import { IMusesNodeOptions, MusesNode } from "../node";
import { MusesAstNodeType } from "../nodeType";
import { MusesStatement } from "./statement/statement";
import { MusesTypeDeclaration } from "./type-declaration";
import { MusesVariableDeclaration } from "./variable-declaration";

export interface IMusesFunctionDeclarationOptions extends IMusesNodeOptions {
    name: string;
    returnType: MusesTypeDeclaration;
    parameters: MusesVariableDeclaration[];
    body?: (MusesStatement| MusesVariableDeclaration)[];
}

export class MusesFunctionDeclaration extends MusesNode {
    nodeType: MusesAstNodeType = MusesAstNodeType.FunctionDeclaration;
    constructor(private readonly options: IMusesFunctionDeclarationOptions) {
        super();
    }
}

