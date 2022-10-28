import { IMusesNodeOptions, MusesNode } from "../node";
import { MusesAstNodeType } from "../nodeType";
import { MusesVariableDeclaration } from "./variable-declaration";

export interface IMusesStructDeclarationOptions extends IMusesNodeOptions {
    name: string;
    members: MusesVariableDeclaration[];
}

export class MusesStructDeclaration extends MusesNode {
    nodeType: MusesAstNodeType = MusesAstNodeType.StructDeclaration;
    constructor(private readonly options: IMusesStructDeclarationOptions) {
        super();
    }
}

