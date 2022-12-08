import { IExpression } from "./expression";

export interface IIdentifierReference extends IExpression {
    type: 'identifierReference';
    name: string;
    typeName: string;
}