import { IBlockStatement } from "../statement/block-statement";
import { ITypeSpecifier } from "../type-specifier";
import { IDeclaration } from "./declaration";
import { IVariableDeclarator } from "./variable-declaration";

export interface IFunctionDeclaration extends IDeclaration {
    type: 'functionDeclaration';
    name: string;
    returnTypeName: string;
    returnType: ITypeSpecifier;
    parameters: IVariableDeclarator[];
    body?: IBlockStatement;
}