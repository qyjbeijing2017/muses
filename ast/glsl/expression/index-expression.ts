import { MusesAstNodeType } from "../../nodeType";
import { MusesConstants } from "../constants";
import { IMusesExpressionOptions, MusesExpression } from "./express";
import { MusesIdentify } from "../Identify";

export interface IMusesIndexExpressionOptions extends IMusesExpressionOptions {
    object: MusesIdentify | MusesExpression | MusesConstants;
    index: MusesExpression | MusesConstants | MusesIdentify;
}

export class MusesIndexExpression extends MusesExpression {
    nodeType: MusesAstNodeType = MusesAstNodeType.IndexExpression;
    constructor(options: IMusesIndexExpressionOptions) {
        super(options);
    }
}