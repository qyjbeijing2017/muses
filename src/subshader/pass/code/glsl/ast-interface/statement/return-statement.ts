import { IExpression } from "../expression/expression";
import { IStatement } from "./statement";

export interface IReturnStatement extends IStatement {
    type: 'returnStatement';
    argument?: IExpression;
}
