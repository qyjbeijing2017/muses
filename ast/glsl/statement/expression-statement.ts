import { IMusesNodeOptions } from "../../node";
import { MusesAstNodeType } from "../../nodeType";
import { MusesExpression } from "../expression/express";
import { MusesStatement } from "./statement";

export interface IMusesExpressionStatementOptions extends IMusesNodeOptions {
    expression: MusesExpression;
}

export class MusesExpressionStatement extends MusesStatement {
    nodeType: MusesAstNodeType = MusesAstNodeType.ExpressionStatement;
    constructor(options: IMusesExpressionStatementOptions) {
        super(options);
    }
}
