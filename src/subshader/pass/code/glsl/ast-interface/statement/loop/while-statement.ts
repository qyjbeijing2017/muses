import { IExpression } from "../../expression/expression";
import { IBlockStatement } from "../block-statement";
import { IStatement } from "../statement";

export interface IWhileStatement extends IStatement {
    type: 'whileStatement';
    test: IExpression;
    body: IBlockStatement;
}