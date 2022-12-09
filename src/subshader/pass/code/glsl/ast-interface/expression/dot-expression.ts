import { IExpression } from "./expression";
import { IIdentifierReference } from "./identifier-reference";

export interface IDotExpression extends IExpression {
    type: "dotExpression";
    member: IIdentifierReference;
    operand: IExpression;
}