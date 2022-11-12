import { CstNode, ILexingResult } from "chevrotain";
import { MusesShader } from "../ast/shader";
import { glslCtxDefine } from "../context/glsl.ctx";
import { musesLexer } from "../lexer";
import { musesParser } from "../parser";
import { musesVisitor } from "../visiter";
import { MusesShaderContext } from "../context/shader";
import { MusesAstNodeType } from "../ast/nodeType";
import { MusesFunctionDeclaration } from "../ast/glsl/function-declaration";
import { MusesGLSLTree } from "../ast/glsltree";
import { MusesProperty } from "../ast/property";
import { v4 } from 'uuid';
import { MusesMaterial } from "./material";
import { IMusesLight } from './light';
import { IMusesObject } from "./object";
import { MusesRenderStates } from "../ast/render-states";
import { MusesLightType } from "./light.type";

export interface IMusesGLSL {
    passes: { vert: string, frag: string, state: MusesRenderStates }[];
}

const musesGLSL = `
attribute vec4 MUSES_POSITION;
attribute vec3 MUSES_NORMAL;
attribute vec2 MUSES_TEXCOORD0;
attribute vec4 MUSES_TANGENT;

uniform mat4 MUSES_MATRIX_M;
uniform mat4 MUSES_MATRIX_V;
uniform mat4 MUSES_MATRIX_P;
uniform mat4 MUSES_MATRIX_MVP;
uniform mat4 MUSES_MATRIX_VDPI;

uniform samplerCube MUSES_SKYBOX;
uniform vec3 MUSES_CAMERA_POS;

struct Light {
    vec3 position;
    vec3 color;
    vec3 direction;
    float cutOff;
    float outerCutOff;

    float constantAttenuation;
    float linearAttenuation;
    float quadraticAttenuation;

    int type; // 0 = null 1 = point, 2 = spot, 3 = directional
};

uniform Light MUSES_LIGHTS[10];
uniform vec3 MUSES_AMBIENT;

vec3 MusesLightAll(vec4 pos, vec3 normal){
    vec3 color = MUSES_AMBIENT;
    for(int i = 0; i < 10; i++){
        Light light = MUSES_LIGHTS[i];
        if(light.type == 0){ continue; }
        if(light.type == 1){
            vec3 lightDir = normalize(light.position - pos.xyz);
            float lambertTerm = max(dot(lightDir, normal), 0.0);
            float distance = length(light.position - pos.xyz);
            float attenuation = 1.0 / (light.constantAttenuation + light.linearAttenuation * distance + light.quadraticAttenuation * distance * distance);
            color += light.color * lambertTerm * attenuation;
        }
        if(light.type == 2){
            vec3 lightDir = normalize(light.position - pos.xyz);
            float lambertTerm = max(dot(lightDir, normal), 0.0);
            float theta = dot(-lightDir, normalize(light.direction));
            float epsilon = (light.cutOff - light.outerCutOff);
            float intensity = clamp((theta - light.outerCutOff)/epsilon, 0.0, 1.0);
            float distance = length(light.position - pos.xyz);
            float attenuation = 1.0 / (light.constantAttenuation + light.linearAttenuation * distance + light.quadraticAttenuation * distance * distance);
            color += light.color * lambertTerm * intensity * attenuation;
        }
        if(light.type == 3){
            vec3 lightDir = normalize(-light.direction);
            float lambertTerm = max(dot(lightDir, normal), 0.0);
            color += light.color * lambertTerm;
        }
    }
    return color;
}

uniform int MUSES_TIME;
`;

const musesGLSLEndDefine = `
void vertMain() {
    vert();
}
void fragMain() {
    frag();
}
ENDGLSL
`;

const glesDefine = `
#ifdef GL_ES
    precision mediump float;
#endif
`

export class MusesVM {
    private readonly id: string;
    static readonly lexer = musesLexer;
    static readonly praser = musesParser;
    static readonly visitor = musesVisitor;

    readonly lex: ILexingResult;
    readonly cst: CstNode;
    readonly ast: MusesShader;
    readonly ctx: MusesShaderContext;
    readonly name: string;
    readonly properties: MusesProperty[];

    readonly vertexEntry = 'vert';
    readonly fragmentEntry = 'frag';

    constructor(code: string) {
        this.id = v4();
        let source = code;
        source = source.replace(/\#include "muses.glsl"/g, musesGLSL);
        source = source.replace(/ENDGLSL/g, musesGLSLEndDefine);

        // prase code
        this.lex = musesLexer.tokenize(source);
        if (this.lex.errors.length > 0) {
            throw new Error(this.lex.errors[0].message);
        }
        musesParser.input = this.lex.tokens;
        this.cst = musesParser.shader();
        if (musesParser.errors.length > 0) {
            throw new Error(musesParser.errors[0].message);
        }
        this.ast = musesVisitor.visit(this.cst);
        this.ctx = new MusesShaderContext(glslCtxDefine);
        this.ast.check(this.ctx);
        this.name = this.ast.options.name;

        this.properties = this.ast.options.properties || [];
    }

    update(): void {
    }

    equals(other: MusesVM): boolean {
        return this.id === other.id;
    }

    private _glsl?: IMusesGLSL | null;

    get glsl(): IMusesGLSL | null {
        if (this._glsl === undefined) {
            this._glsl = this.toGlsl()
        }
        return this._glsl;
    }

    private toGlsl(): IMusesGLSL | null {
        for (let i = 0; i < this.ast.options.subShaders.length; i++) {
            const subShader = this.ast.options.subShaders[i];
            const passes: { frag: string, vert: string, state: MusesRenderStates }[] = [];
            for (let j = 0; j < subShader.options.passes.length; j++) {
                const pass = subShader.options.passes[j];
                const vertNode = pass.options.glsl?.options.body?.find(
                    (node) => node.nodeType === MusesAstNodeType.FunctionDeclaration && (node as MusesFunctionDeclaration).options.name === "vertMain"
                );
                const fragNode = pass.options.glsl?.options.body?.find(
                    (node) => node.nodeType === MusesAstNodeType.FunctionDeclaration && (node as MusesFunctionDeclaration).options.name === "fragMain"
                );
                if (!vertNode || !fragNode) {
                    continue;
                }
                const ctx = this.ctx.subShaderContexts[i].passContexts[j].glslCtx;
                const vertTree = new MusesGLSLTree();
                const fragTree = new MusesGLSLTree();
                vertNode.subTree(ctx, vertTree);
                fragNode.subTree(ctx, fragTree);
                passes.push({
                    vert: glesDefine + vertTree.code.replace('vertMain()', 'main()'),
                    frag: glesDefine + fragTree.code.replace('fragMain()', 'main()'),
                    state: pass.renderStates,
                });
            }
            if (passes.length > 0) {
                return { passes };
            }
        }
        return null;
    }

    createMaterial(): MusesMaterial {
        return new MusesMaterial(this.properties, this);
    }

    static draw<RenderObj extends IMusesObject>({
        objects,
        lights,
    }: {
        objects: RenderObj[],
        lights?: IMusesLight[],
        viewMatrix?: Iterable<number>,
        projectionMatrix?: Iterable<number>,
    }): {
        objects: RenderObj[],
        lightsMap: Map<MusesLightType, IMusesLight[]>,
        instancing: boolean,
    }[] {

        const lightsMap = new Map<MusesLightType, IMusesLight[]>();
        for (const light of lights || []) {
            const lights = lightsMap.get(light.type) || [];
            lights.push(light);
            lightsMap.set(light.type, lights);
        }


        const renderObjMap = new Map<string, RenderObj[]>();
        objects.forEach((object) => {
            const key = object.material.vm.id;
            if (renderObjMap.has(key)) {
                renderObjMap.get(key)?.push(object);
            } else {
                renderObjMap.set(key, [object]);
            }
        });

        const renderObjs: {
            objects: RenderObj[],
            lightsMap: Map<MusesLightType, IMusesLight[]>,
            instancing: boolean,
        }[] = [];

        for (const [key, objects] of renderObjMap) {
            renderObjs.push({
                objects,
                lightsMap,
                instancing: false,
            });
        }
        return renderObjs;
    }
}