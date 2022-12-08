import { IAstNode } from "../ast-node";

export interface IExpression extends IAstNode {
    typeName: string;
}