import { IExpression } from "./expression";

export interface IConditionalExpression extends IExpression {
    type: "conditionalExpression";
    test: IExpression;
    consequent: IExpression;
    alternate: IExpression;
}