import { MusesAstNodeType } from "../../nodeType";
import { MusesConstants } from "../constants";
import { IMusesExpressionOptions, MusesExpression } from "./express";
import { MusesIdentify } from "../Identify";

export interface IMusesUpdateExpressionOptions extends IMusesExpressionOptions {
    operator: string;
    object: MusesExpression | MusesConstants | MusesIdentify;
}

export class MusesUpdateExpression extends MusesExpression {
    nodeType: MusesAstNodeType = MusesAstNodeType.UpdateExpression;
    constructor(options: IMusesUpdateExpressionOptions) {
        super(options);
    }
}