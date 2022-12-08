import { AstNode } from "@shaderfrog/glsl-parser/dist/ast";
import { IVariableDeclaration } from './declaration/variable-declaration';

export interface ITypeSpecifier extends AstNode {
    type: 'typeSpecifier' | 'structDeclaration';
    name: string;
    isStruct?: boolean;
    members?: IVariableDeclaration[];
}