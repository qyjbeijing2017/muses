import { IDeclaration } from "./declaration";


export interface IVariableDeclaration extends IDeclaration {
    type: 'variableDeclaration';
    name: string;
    typeName: string;
    percision?: 'lowp' | 'mediump' | 'highp';
    const?: boolean;
    storage?: 'in' | 'out' | 'inout' | 'uniform' | 'varying' | 'attribute';
}