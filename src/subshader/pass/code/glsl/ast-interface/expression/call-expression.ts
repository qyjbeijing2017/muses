import { IExpression } from "./expression";
import { IIdentifierReference } from "./identifier-reference";

export interface ICallExpression extends IExpression {
    type: "callExpression";
    params: IExpression[];
    callee: IIdentifierReference;
}