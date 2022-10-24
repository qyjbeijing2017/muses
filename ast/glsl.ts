import { MusesFunctionDeclaration } from "./glsl/function-declaration";
import { IMusesNodeOptions, MusesNode } from "./node";
import { MusesAstNodeType } from "./nodeType";

export interface IMusesGLSLOptions extends IMusesNodeOptions {
    body: (MusesFunctionDeclaration)[]
}

export class MusesGLSL extends MusesNode{
    nodeType: MusesAstNodeType = MusesAstNodeType.GLSL;
    constructor(private readonly options:IMusesGLSLOptions) {
        super();
    }
}