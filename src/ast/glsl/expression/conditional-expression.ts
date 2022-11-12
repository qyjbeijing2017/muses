import { MusesAstNodeType } from "../../nodeType";
import { MusesConstants } from "../constants";
import { IMusesExpressionOptions, MusesExpression } from "./express";
import { MusesIdentify } from "../Identify";
import { MusesGLSLContext } from "../../../context/glsl";
import { MusesContextType } from "../../../context/type";
import { MusesGLSLTree } from "../../glsltree";

export interface IMusesConditionalExpressionOptions extends IMusesExpressionOptions {
    testExpression: MusesExpression | MusesConstants | MusesIdentify;
    trueExpression: MusesExpression | MusesConstants | MusesIdentify;
    falseExpression: MusesExpression | MusesConstants | MusesIdentify;
}

export class MusesConditionalExpression extends MusesExpression {
    subTree(ctx: MusesGLSLContext, tree: MusesGLSLTree): void {
        this.optionsChildren.testExpression.subTree(ctx, tree);
        this.optionsChildren.trueExpression.subTree(ctx, tree);
        this.optionsChildren.falseExpression.subTree(ctx, tree);
    }
    toMuses(): string {
        return this.toGLSL();
    }
    toGLSL(): string {
        return `${this.optionsChildren.testExpression.toGLSL()} ? ${this.optionsChildren.trueExpression.toGLSL()} : ${this.optionsChildren.falseExpression.toGLSL()}`;
    }
    get optionsChildren(){
        return this.options as IMusesConditionalExpressionOptions
    }
    check(ctx: MusesGLSLContext): MusesContextType {
        const trueType = this.getExpressionType(ctx, this.optionsChildren.trueExpression);
        const falseType = this.getExpressionType(ctx, this.optionsChildren.falseExpression);
        if(trueType.sign != falseType.sign){
            throw new Error("true or false type must be the same type!!");
        }
        return trueType;
    }
    nodeType: MusesAstNodeType = MusesAstNodeType.ConditionalExpression;
    constructor(options: IMusesConditionalExpressionOptions) {
        super(options);
    }
}