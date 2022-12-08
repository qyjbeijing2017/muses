import { IBlockStatement } from "../statement/block-statement";
import { IDeclaration } from "./declaration";
import { IVariableDeclaration } from "./variable-declaration";

export interface IFunctionDeclaration extends IDeclaration {
    type: 'functionDeclaration';
    name: string;
    returnTypeName: string;
    parameters: IVariableDeclaration[];
    body?: IBlockStatement;
}