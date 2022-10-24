import { IMusesNodeOptions, MusesNode } from "../node";
import { MusesAstNodeType } from "../nodeType";
import { MusesTypeDeclaration } from "./type-declaration";

export interface IMusesFunctionDeclarationOptions extends IMusesNodeOptions {
    name: string;
    returnType: MusesTypeDeclaration;
    parameters?: string[];
    body?: string;
}

export class MusesFunctionDeclaration extends MusesNode {
    nodeType: MusesAstNodeType = MusesAstNodeType.FunctionDeclaration;
    constructor(private readonly options: IMusesFunctionDeclarationOptions) {
        super();
    }
}

