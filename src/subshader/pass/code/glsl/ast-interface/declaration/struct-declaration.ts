import { ITypeSpecifier } from "../type-specifier";
import { IVariableDeclaration } from "./variable-declaration";

export interface IStructDeclaration extends ITypeSpecifier {
    type: 'structDeclaration';
    name: string;
    rules: {
        test: RegExp;
        returnType: string;
    }[];
    isStruct: true;
    members: IVariableDeclaration[];
}