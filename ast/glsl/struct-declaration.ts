import { IMusesNodeOptions, MusesNode } from "../node";
import { MusesAstNodeType } from "../nodeType";
import { MusesTypeDeclaration } from "./type-declaration";

export interface IMusesStructDeclarationOptions extends IMusesNodeOptions {
    name: string;
    returnType: MusesTypeDeclaration;
    parameters?: string[];
    body?: any[];
}

export class MusesStructDeclaration extends MusesNode {
    nodeType: MusesAstNodeType = MusesAstNodeType.FunctionDeclaration;
    constructor(private readonly options: IMusesStructDeclarationOptions) {
        super();
    }
}

