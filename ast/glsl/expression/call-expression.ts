import { MusesAstNodeType } from "../../nodeType";
import { MusesTypeDeclaration } from "../type-declaration";
import { MusesConstants } from "../constants";
import { IMusesExpressionOptions, MusesExpression } from "./express";
import { MusesIdentify } from "../Identify";

export interface IMusesCallExpressionOptions extends IMusesExpressionOptions {
    callee: MusesIdentify | MusesTypeDeclaration | MusesExpression | MusesConstants;
    arguments: (MusesExpression | MusesConstants | MusesIdentify)[];
}

export class MusesCallExpression extends MusesExpression {
    nodeType: MusesAstNodeType = MusesAstNodeType.CallExpression;
    constructor(options: IMusesCallExpressionOptions) {
        super(options);
    }
}