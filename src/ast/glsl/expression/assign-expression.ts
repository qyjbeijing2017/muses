import { MusesAstNodeType } from "../../nodeType";
import { MusesConstants } from "../constants";
import { IMusesExpressionOptions, MusesExpression } from "./express";
import { MusesIdentify } from "../Identify";
import { MusesGLSLContext } from "../../../context/glsl";
import { MusesContextType } from "../../../context/type";
import { MusesGLSLTree } from "../../glsltree";

export interface IMusesAssignExpressionOptions extends IMusesExpressionOptions {
    operator: string;
    left: MusesExpression | MusesConstants | MusesIdentify;
    right: MusesExpression | MusesConstants | MusesIdentify;
}

export class MusesAssignExpression extends MusesExpression {
    subTree(ctx: MusesGLSLContext, tree: MusesGLSLTree): void {
        this.optionsChildren.left.subTree(ctx, tree);
        this.optionsChildren.right.subTree(ctx, tree);
    }
    toMuses(): string {
        return this.toGLSL();
    }
    toGLSL(): string {
        return `${this.optionsChildren.left.toGLSL()} ${this.optionsChildren.operator} ${this.optionsChildren.right.toGLSL()}`;
    }
    check(ctx: MusesGLSLContext): MusesContextType {
        const leftType = this.getExpressionType(ctx, this.optionsChildren.left);
        const rightType = this.getExpressionType(ctx, this.optionsChildren.right);
        return leftType.checkRule(`${leftType.sign}${this.optionsChildren.operator}${rightType.sign}`);
    }
    get optionsChildren(){
        return this.options as IMusesAssignExpressionOptions
    }

    nodeType: MusesAstNodeType = MusesAstNodeType.AssignExpression;
    constructor(options: IMusesAssignExpressionOptions) {
        super(options);
    }
}