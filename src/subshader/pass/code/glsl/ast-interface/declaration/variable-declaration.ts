import { IExpression } from "../expression/expression";
import { IStatement } from "../statement/statement";
import { IDeclaration } from "./declaration";


export interface IVariableDeclaration extends IDeclaration, IStatement {
    type: 'variableDeclaration';
    name: string;
    typeName: string;
    percision?: 'lowp' | 'mediump' | 'highp';
    const?: boolean;
    storage?: 'in' | 'out' | 'inout' | 'uniform' | 'varying' | 'attribute';
    init?: IExpression
    arrayLength?: IExpression;
}