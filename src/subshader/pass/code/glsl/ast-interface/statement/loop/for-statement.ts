import { IVariableDeclaration } from "../../declaration/variable-declaration";
import { IExpression } from "../../expression/expression";
import { IBlockStatement } from "../block-statement";
import { IExpressionStatement } from "../expression-statement";
import { IStatement } from "../statement";

export interface IForStatement extends IStatement {
    type: 'forStatement';
    init?: IExpressionStatement | IVariableDeclaration;
    test: IExpression;
    update?: IExpression;
    body: IBlockStatement;
}