import { IExpression } from "../expression/expression";
import { IStatement } from "./statement";

export interface IExpressionStatement extends IStatement {
    type: 'expressionStatement';
    expression: IExpression;
}