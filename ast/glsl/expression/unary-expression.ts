import { MusesAstNodeType } from "../../nodeType";
import { MusesConstants } from "../constants";
import { IMusesExpressionOptions, MusesExpression } from "./express";
import { MusesIdentify } from "../Identify";

export interface IMusesUnaryExpressionOptions extends IMusesExpressionOptions {
    operator: string;
    argument: MusesExpression | MusesConstants | MusesIdentify;
}

export class MusesUnaryExpression extends MusesExpression {
    nodeType: MusesAstNodeType = MusesAstNodeType.UnaryExpression;
    constructor(options: IMusesUnaryExpressionOptions) {
        super(options);
    }
}