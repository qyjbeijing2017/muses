import { IMusesNodeOptions, MusesNode } from "../node";
import { MusesAstNodeType } from "../nodeType";
import { MusesConstants } from "./constants";
import { MusesIdentify } from "./Identify";
import { MusesTypeDeclaration } from "./type-declaration";

export interface IMusesVariableConstructorOptions extends IMusesNodeOptions {
    type: MusesTypeDeclaration;
    args: (MusesIdentify | MusesConstants)[];
}

export class MusesVariableConstructor extends MusesNode {
    nodeType: MusesAstNodeType = MusesAstNodeType.VariableConstructor;
    constructor(private readonly options: IMusesVariableConstructorOptions) {
        super();
    }
}