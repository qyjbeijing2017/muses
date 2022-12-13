import { GLSLContext } from "../glsl-context";
import { IAstNode } from "./ast-node";
import { IDeclaration } from "./declaration/declaration";

export interface IProgram extends IAstNode {
    type: 'program';
    statements: IDeclaration[];
    ctx: GLSLContext;
}