import { IAstNode } from "../../ast-node";
import { IExpression } from "../../expression/expression";
import { IStatement } from "../statement";

export interface ISwitchCase extends IAstNode {
    type: 'switchCase';
    test?: IExpression;
    consequent: IStatement[];
}

export interface ISwitchStatement extends IStatement {
    type: 'switchStatement';
    discriminant: IExpression;
    cases: ISwitchCase[];
}