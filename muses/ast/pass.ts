import { MusesGLSLContext } from "../context/glsl";
import { MusesPassContext } from "../context/pass";
import { MusesSubShaderContext } from "../context/subshader";
import { MusesGLSL } from "./glsl";
import { IMusesNodeOptions, MusesGLSLNode, MusesNode } from "./node";
import { MusesAstNodeType } from "./nodeType";

export interface IMusesPassOptions extends IMusesNodeOptions {
    glsl?: MusesGLSL
}

export class MusesPass extends MusesNode{
    toGLSL(): string {
        throw new Error("Method not implemented.");
    }
    toMuses(): string {
        return `   //glsl
            GLSLPROGRAM

${this.options.glsl?.toMuses()}

            ENDGLSLPROGRAM`;
    }

    check(ctx: MusesSubShaderContext): void {
        const passCtx = ctx.createPassContext();
        this.options.glsl?.check(passCtx);
    }

    nodeType: MusesAstNodeType = MusesAstNodeType.Pass;
    constructor(private readonly options:IMusesPassOptions) {
        super();
    }
}