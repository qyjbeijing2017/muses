import { CstNode, ILexingResult } from "chevrotain";
import { MusesShader } from "./ast/shader";
import { glslCtxDefine } from "./context/glsl.ctx";
import { musesLexer } from "./lexer";
import { musesParser } from "./parser";
import { musesVisitor } from "./visiter";
import { MusesShaderContext } from "./context/shader";
import { MusesAstNodeType } from "./ast/nodeType";
import { MusesFunctionDeclaration } from "./ast/glsl/function-declaration";
import { MusesGLSLTree } from "./ast/glsltree";
import { MusesProperty, MusesPropertyType } from "./ast/property";
import { v4 } from 'uuid';

export interface IMusesGLSL {
    passes: { vert: string, frag: string }[];
}

export interface IMusesUniform {
    name: string;
    type: MusesPropertyType;
    value: string | Iterable<number> | number;
}

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

    private _uniforms: IMusesUniform[];
    constructor(code: string) {
        this.id = v4();
        // prase code
        this.lex = musesLexer.tokenize(code);
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

        // init uniform
        this.properties = this.ast.options.properties || [];
        this._uniforms = [];
        this.properties.forEach((property) => {
            this._uniforms.push({
                name: property.name,
                type: property.type,
                value: property.defaultValue,
            });
        });
    }

    setUniform(name: string, value: string | Iterable<number> | number) {
        const uniform = this._uniforms.find((uniform) => uniform.name === name);
        if (uniform) {
            uniform.value = value;
        }
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
            const passes: { frag: string, vert: string }[] = [];
            for (let j = 0; j < subShader.options.passes.length; j++) {
                const pass = subShader.options.passes[j];
                const vertNode = pass.options.glsl?.options.body?.find(
                    (node) => node.nodeType === MusesAstNodeType.FunctionDeclaration && (node as MusesFunctionDeclaration).options.name === "vert"
                );
                const fragNode = pass.options.glsl?.options.body?.find(
                    (node) => node.nodeType === MusesAstNodeType.FunctionDeclaration && (node as MusesFunctionDeclaration).options.name === "frag"
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
                    vert: vertTree.code.replace('vert()', 'main()'),
                    frag: fragTree.code.replace('frag()', 'main()'),
                });
            }
            if (passes.length > 0) {
                return { passes };
            }
        }
        return null;
    }
}