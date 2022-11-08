import { MusesAstNodeType } from "../../nodeType";
import { MusesConstants } from "../constants";
import { IMusesExpressionOptions, MusesExpression } from "./express";
import { MusesIdentify } from "../Identify";
import { MusesTypeDeclaration } from "../type-declaration";
import { MusesGLSLContext } from "../../../context/glsl";
import { MusesContextType } from "../../../context/type";
import { MusesGLSLTree } from "../../glsltree";

export interface IMusesVariableConstructorOptions extends IMusesExpressionOptions {
    type: MusesTypeDeclaration;
    size?: MusesExpression | MusesConstants | MusesIdentify;
    args: (MusesIdentify | MusesConstants | MusesExpression)[];
}

export class MusesVariableConstructor extends MusesExpression {
    subTree(ctx: MusesGLSLContext, tree: MusesGLSLTree): void {
        this.optionsChildren.type.subTree(ctx, tree);
        this.optionsChildren.args.forEach((arg) => arg.subTree(ctx, tree));
    }
    toMuses(): string {
        return this.toGLSL();
    }
    toGLSL(): string {
        return `${this.optionsChildren.type.toGLSL()}${this.optionsChildren.size ? `[${this.optionsChildren.size.toGLSL()}]` : ''}(${this.optionsChildren.args.map(arg => arg.toGLSL()).join(',')})`;
    }
    check(ctx: MusesGLSLContext): MusesContextType {
        const argTypes = this.optionsChildren.args.map((arg) => this.getExpressionType(ctx, arg));
        const type = this.optionsChildren.type.toCtxType(ctx);
        if (this.optionsChildren.size) {
            const sizeType = this.optionsChildren.size?.check(ctx);
            if (sizeType.sign !== 'int') {
                throw new Error(`Variable constructor size must be int`);
            }
        }
        return type.checkRule(`${type.sign}${this.optionsChildren.size ? '[]' : ''}(${argTypes.map(argType => argType.sign).join(',')})`);
    }
    get optionsChildren() {
        return this.options as IMusesVariableConstructorOptions;
    }
    nodeType: MusesAstNodeType = MusesAstNodeType.VariableConstructor;
    constructor(options: IMusesVariableConstructorOptions) {
        super(options);
    }
}