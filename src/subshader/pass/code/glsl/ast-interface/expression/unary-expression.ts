import { IExpression } from "./expression";

export interface IUnaryExpression extends IExpression {
    type: "unaryExpression";
    operator: string;
    operand: IExpression;
}