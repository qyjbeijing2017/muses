import { MusesSubShaderContext } from "../context/subshader";
import { MusesGLSL } from "./glsl";
import { IMusesNodeOptions, MusesNode } from "./node";
import { MusesAstNodeType } from "./nodeType";
import { MusesRenderStates } from "./render-states";

export interface IMusesPassOptions extends IMusesNodeOptions {
    glsl?: MusesGLSL
    renderStates?: MusesRenderStates;
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
    readonly renderStates: MusesRenderStates;
    constructor(readonly options:IMusesPassOptions) {
        super();
        this.renderStates = options.renderStates || new MusesRenderStates();
    }
}