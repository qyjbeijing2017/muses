import { MusesAstNodeType } from "../../nodeType";
import { MusesConstants } from "../constants";
import { IMusesExpressionOptions, MusesExpression } from "./express";
import { MusesIdentify } from "../Identify";
import { MusesGLSLContext } from "../../../context/glsl";
import { MusesContextType } from "../../../context/type";
import { MusesGLSLTree } from "../../glsltree";

export interface IMusesDotExpressionOptions extends IMusesExpressionOptions {
    object: MusesIdentify | MusesExpression | MusesConstants;
    property: MusesIdentify;
}

export class MusesDotExpression extends MusesExpression {
    subTree(ctx: MusesGLSLContext, tree: MusesGLSLTree): void {
        this.optionsChildren.object.subTree(ctx, tree);
        this.optionsChildren.property.subTree(ctx, tree);
    }
    toMuses(): string {
        return this.toGLSL();
    }
    toGLSL(): string {
        return `${this.optionsChildren.object.toGLSL()}.${this.optionsChildren.property.toGLSL()}`;
    }
    get optionsChildren(){
        return this.options as IMusesDotExpressionOptions
    }
    check(ctx: MusesGLSLContext): MusesContextType {
        const objectType = this.getExpressionType(ctx, this.optionsChildren.object);
        return objectType.checkRule(`${objectType.sign}.${this.optionsChildren.property.name}`);
    }
    nodeType: MusesAstNodeType = MusesAstNodeType.DotExpression;
    constructor(options: IMusesDotExpressionOptions) {
        super(options);
    }
}