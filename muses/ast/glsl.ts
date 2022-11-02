import { MusesPassContext } from "../context/pass";
import { MusesFunctionDeclaration } from "./glsl/function-declaration";
import { MusesStructDeclaration } from "./glsl/struct-declaration";
import { MusesVariableDeclaration } from "./glsl/variable-declaration";
import { IMusesNodeOptions, MusesGLSLNode, MusesNode } from "./node";
import { MusesAstNodeType } from "./nodeType";

export interface IMusesGLSLOptions extends IMusesNodeOptions {
    body: (MusesFunctionDeclaration | MusesStructDeclaration | MusesVariableDeclaration)[]
}

export class MusesGLSL extends MusesNode{
    toMuses(): string {
        return this.toGLSL();
    }
    toGLSL(): string {
        return this.options.body.map((item) => item.toMuses()).join("\n");
    }
    check(ctx: MusesPassContext): void {
        const glslCtx = ctx.createGLSLContext();
        this.options.body.forEach((item) => {
            item.check(glslCtx);
        });
    }
    nodeType: MusesAstNodeType = MusesAstNodeType.GLSL;
    constructor(private readonly options:IMusesGLSLOptions) {
        super();
    }
}