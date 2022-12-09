import { IExpression } from "./expression";

export interface IIndexExpression extends IExpression {
    type: "indexExpression";
    index: IExpression;
    operand: IExpression;
}