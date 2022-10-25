import { MusesAstNodeType } from "../../nodeType";
import { MusesConstants } from "../constants";
import { IMusesExpressionOptions, MusesExpression } from "./express";
import { MusesIdentify } from "../Identify";

export interface IMusesConditionalExpressionOptions extends IMusesExpressionOptions {
    testExpression: MusesExpression | MusesConstants | MusesIdentify;
    trueExpression: MusesExpression | MusesConstants | MusesIdentify;
    falseExpression: MusesExpression | MusesConstants | MusesIdentify;
}

export class MusesConditionalExpression extends MusesExpression {
    nodeType: MusesAstNodeType = MusesAstNodeType.ConditionalExpression;
    constructor(options: IMusesConditionalExpressionOptions) {
        super(options);
    }
}