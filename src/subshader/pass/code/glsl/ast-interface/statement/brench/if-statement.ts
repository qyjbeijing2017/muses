import { IExpression } from "../../expression/expression";
import { IBlockStatement } from "../block-statement";
import { IStatement } from "../statement";

export interface IIfStatement extends IStatement {
    type: 'ifStatement';
    test: IExpression;
    consequent: IBlockStatement;
    alternate?: IBlockStatement | IIfStatement;
}