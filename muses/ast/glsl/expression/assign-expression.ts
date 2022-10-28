import { MusesAstNodeType } from "../../nodeType";
import { MusesConstants } from "../constants";
import { IMusesExpressionOptions, MusesExpression } from "./express";
import { MusesIdentify } from "../Identify";

export interface IMusesAssignExpressionOptions extends IMusesExpressionOptions {
    operator: string;
    left: MusesExpression | MusesConstants | MusesIdentify;
    right: MusesExpression | MusesConstants | MusesIdentify;
}

export class MusesAssignExpression extends MusesExpression {
    nodeType: MusesAstNodeType = MusesAstNodeType.AssignExpression;
    constructor(options: IMusesAssignExpressionOptions) {
        super(options);
    }
}