import { IExpression } from "./expression";

export interface IBinaryExpression extends IExpression {
    type: 'binaryExpression';
    operator: string;
    left: IExpression;
    right: IExpression;
    typeName: string;
}