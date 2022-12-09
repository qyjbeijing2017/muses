import { IExpression } from "./expression";

export interface IUpdateExpression extends IExpression {
    type: "updateExpression";
    operator: string;
    operand: IExpression;
}