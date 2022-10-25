import { MusesAstNodeType } from "../../nodeType";
import { MusesTypeDeclaration } from "../type-declaration";
import { MusesConstants } from "../constants";
import { IMusesExpressionOptions, MusesExpression } from "./express";
import { MusesIdentify } from "../Identify";

export interface IMusesDotExpressionOptions extends IMusesExpressionOptions {
    object: MusesIdentify | MusesTypeDeclaration | MusesExpression | MusesConstants;
    property: MusesIdentify | MusesTypeDeclaration | MusesExpression | MusesConstants;
}

export class MusesDotExpression extends MusesExpression {
    nodeType: MusesAstNodeType = MusesAstNodeType.DotExpression;
    constructor(options: IMusesDotExpressionOptions) {
        super(options);
    }
}