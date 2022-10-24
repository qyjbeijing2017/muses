import { IMusesNodeOptions, MusesNode } from "../node";
import { MusesAstNodeType } from "../nodeType";
import { MusesTypeDeclaration } from "./type-declaration";


export enum MusesGLSLStorage{
    const = "const",
    attribute = "attribute",
    uniform = "uniform",
    varying = "varying",
}


export enum MusesGLSLPercision{
    lowp = "lowp",
    mediump = "mediump",
    highp = "highp",
}

export interface IMusesVariableDeclarationOptions extends IMusesNodeOptions {
    name: string;
    type: MusesTypeDeclaration;
    storage?: MusesGLSLStorage;
    percision?: MusesGLSLPercision;
}

export class MusesVariableDeclaration extends MusesNode {
    nodeType: MusesAstNodeType = MusesAstNodeType.VariableDeclaration;
    constructor(private readonly options: IMusesVariableDeclarationOptions) {
        super();
    }
}