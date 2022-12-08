import { IExpression } from "./expression";

export interface ILiterial extends IExpression {
    type: 'literial';
    typeName: string;
    value: string;
}