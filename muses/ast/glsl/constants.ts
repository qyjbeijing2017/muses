import { IMusesNodeOptions, MusesNode } from "../node";
import { MusesAstNodeType } from "../nodeType";
import { MusesTypeDeclaration } from "./type-declaration";

export interface IMusesConstantsOptions extends IMusesNodeOptions {
    type: MusesTypeDeclaration;
    value: any;
}

export class MusesConstants extends MusesNode {
    nodeType: MusesAstNodeType = MusesAstNodeType.Constants;
    constructor(private readonly options: IMusesConstantsOptions) {
        super();
    }
}