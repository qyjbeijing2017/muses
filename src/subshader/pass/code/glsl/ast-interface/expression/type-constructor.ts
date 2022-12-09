import { IExpression } from "./expression";

export interface ITypeConstructor extends IExpression {
    type: "typeConstructor";
    typeName: string;
    params: IExpression[];
}