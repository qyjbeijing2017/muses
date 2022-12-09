import { IExpression } from "../../expression/expression";
import { IBlockStatement } from "../block-statement";
import { IStatement } from "../statement";

export interface IDoStatement extends IStatement {
    type: 'doStatement';
    body: IBlockStatement;
    test: IExpression;
}