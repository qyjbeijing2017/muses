import { IDeclaration } from "./declaration";
import { IVariableDeclaration } from "./variable-declaration";

export interface IStructDeclaration extends IDeclaration {
    type: 'structDeclaration';
    name: string;
    rules: {
        test: RegExp;
        returnType: string;
    }[];
    isStruct: true;
    members: IVariableDeclaration[];
}
