import { MusesGLSLContext } from "../../../context/glsl";
import { MusesGLSLTree } from "../../glsltree";
import { IMusesNodeOptions } from "../../node";
import { MusesAstNodeType } from "../../nodeType";
import { MusesExpression } from "../expression/express";
import { MusesStatement } from "./statement";

export interface IMusesExpressionStatementOptions extends IMusesNodeOptions {
    expression: MusesExpression;
}

export class MusesExpressionStatement extends MusesStatement {
    subTree(ctx: MusesGLSLContext, tree: MusesGLSLTree): void {
        this.optionsChildren.expression.subTree(ctx, tree);
    }
    toMuses(): string {
        return this.toGLSL();
    }
    toGLSL(): string {
        return `${this.optionsChildren.expression.toGLSL()};`;
    }
    check(ctx: MusesGLSLContext): void {
        this.optionsChildren.expression.check(ctx);
    }
    get optionsChildren(){
        return this.options as IMusesExpressionStatementOptions
    }
    nodeType: MusesAstNodeType = MusesAstNodeType.ExpressionStatement;
    constructor(options: IMusesExpressionStatementOptions) {
        super(options);
    }
}
