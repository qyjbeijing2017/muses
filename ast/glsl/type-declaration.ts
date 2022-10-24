import { IMusesNodeOptions, MusesNode } from "../node";
import { MusesAstNodeType } from "../nodeType";

export interface IMusesTypeDeclarationOptions extends IMusesNodeOptions {
    name: string;
}

export class MusesTypeDeclaration extends MusesNode {
    nodeType: MusesAstNodeType = MusesAstNodeType.TypeDeclaration;
    constructor(private readonly options: IMusesTypeDeclarationOptions) {
        super();
    }
}