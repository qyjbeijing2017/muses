import { MusesContext } from "../../context/context";
import { IMusesNodeOptions } from "../../node";
import { MusesAstNodeType } from "../../nodeType";
import { MusesExpression } from "../expression/express";
import { MusesStatement } from "./statement";

export interface IMusesExpressionStatementOptions extends IMusesNodeOptions {
    expression: MusesExpression;
}

export class MusesExpressionStatement extends MusesStatement {
    check(ctx: MusesContext): void {
        this.optionsChildren.expression.check(ctx);
    }
    get optionsChildren(){
        return this.options as IMusesExpressionStatementOptions
    }
    nodeType: MusesAstNodeType = MusesAstNodeType.ExpressionStatement;
    constructor(options: IMusesExpressionStatementOptions) {
        super(options);
    }
}
