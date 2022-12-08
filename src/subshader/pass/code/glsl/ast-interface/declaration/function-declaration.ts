import { IBlockStatement } from "../statement/block-statement";
import { IDeclaration } from "./declaration";
import { IVariableDeclarator } from "./variable-declaration";

export interface IFunctionDeclaration extends IDeclaration {
    type: 'functionDeclaration';
    name: string;
    returnType: string;
    parameters: IVariableDeclarator[];
    body?: IBlockStatement;
}