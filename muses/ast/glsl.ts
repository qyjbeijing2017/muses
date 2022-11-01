import { MusesContext } from "./context/context";
import { MusesFunctionDeclaration } from "./glsl/function-declaration";
import { MusesStructDeclaration } from "./glsl/struct-declaration";
import { MusesVariableDeclaration } from "./glsl/variable-declaration";
import { IMusesNodeOptions, MusesNode } from "./node";
import { MusesAstNodeType } from "./nodeType";

export interface IMusesGLSLOptions extends IMusesNodeOptions {
    body: (MusesFunctionDeclaration | MusesStructDeclaration | MusesVariableDeclaration)[]
}

export class MusesGLSL extends MusesNode{
    check(ctx: MusesContext): void {
        this.options.body.forEach((item) => {
            item.check(ctx);
        });
    }
    nodeType: MusesAstNodeType = MusesAstNodeType.GLSL;
    constructor(private readonly options:IMusesGLSLOptions) {
        super();
    }
}