import { MusesAstNodeType } from "../../nodeType";
import { MusesConstants } from "../constants";
import { IMusesExpressionOptions, MusesExpression } from "./express";
import { MusesIdentify } from "../Identify";
import { MusesGLSLContext } from "../../../context/glsl";
import { MusesContextType } from "../../../context/type";
import { MusesGLSLTree } from "../../glsltree";

export interface IMusesIndexExpressionOptions extends IMusesExpressionOptions {
    object: MusesIdentify | MusesExpression | MusesConstants;
    index?: MusesExpression | MusesConstants | MusesIdentify;
}

export class MusesIndexExpression extends MusesExpression {
    subTree(ctx: MusesGLSLContext, tree: MusesGLSLTree): void {
        this.optionsChildren.object.subTree(ctx, tree);
        if (this.optionsChildren.index) {
            this.optionsChildren.index.subTree(ctx, tree);
        } else {

        }
    }
    toMuses(): string {
        return this.toGLSL();
    }
    toGLSL(): string {
        return `${this.optionsChildren.object.toGLSL()}[${this.optionsChildren.index?this.optionsChildren.index.toGLSL(): ''}]`;
    }
    check(ctx: MusesGLSLContext): MusesContextType {
        const objectType = this.getExpressionType(ctx, this.optionsChildren.object);
        if (this.optionsChildren.index) {
            const indexType = this.getExpressionType(ctx, this.optionsChildren.index);
            return objectType.checkRule(`${objectType.sign}[${indexType.sign}]`);
        } else {
            return objectType.checkRule(`${objectType.sign}[]`);
        }
    }
    get optionsChildren() {
        return this.options as IMusesIndexExpressionOptions
    }
    nodeType: MusesAstNodeType = MusesAstNodeType.IndexExpression;
    constructor(options: IMusesIndexExpressionOptions) {
        super(options);
    }
}