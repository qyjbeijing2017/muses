import { IAstNode } from "../ast-node";
import { IStatement } from "../statement/statement";
import { ITypeSpecifier } from "../type-specifier";
import { IDeclaration } from "./declaration";


export interface IVariableDeclarator extends IAstNode {
    type: 'variableDeclarator';
    name: string;
    typeName: string;
    typeSpecifier: ITypeSpecifier;
    percision?: 'lowp' | 'mediump' | 'highp';
    const?: boolean;
    storage?: 'in' | 'out' | 'inout' | 'uniform' | 'varying' | 'attribute';
}

export interface IVariableDeclaration extends IDeclaration, IStatement {
    type: 'variableDeclaration';
    declarators: IVariableDeclarator[];
}