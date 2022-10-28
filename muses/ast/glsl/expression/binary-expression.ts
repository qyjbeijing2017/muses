import { MusesAstNodeType } from "../../nodeType";
import { MusesConstants } from "../constants";
import { IMusesExpressionOptions, MusesExpression } from "./express";
import { MusesIdentify } from "../Identify";

export interface IMusesBinaryExpressionOptions extends IMusesExpressionOptions {
    operator: string;
    left: MusesExpression | MusesConstants | MusesIdentify;
    right: MusesExpression | MusesConstants | MusesIdentify;
}

export class MusesBinaryExpression extends MusesExpression {
    nodeType: MusesAstNodeType = MusesAstNodeType.BinaryExpression;
    constructor(options: IMusesBinaryExpressionOptions) {
        super(options);
    }
}