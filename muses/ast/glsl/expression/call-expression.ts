import { MusesAstNodeType } from "../../nodeType";
import { MusesConstants } from "../constants";
import { IMusesExpressionOptions, MusesExpression } from "./express";
import { MusesIdentify } from "../Identify";
import { MusesGLSLContext } from "../../../context/glsl";
import { MusesContextType } from "../../../context/type";
import { MusesGLSLTree } from "../../glsltree";
import { MusesIndexExpression } from "./index-expression";

export interface IMusesCallExpressionOptions extends IMusesExpressionOptions {
    callee: MusesIdentify | MusesIndexExpression;
    arguments: (MusesExpression | MusesConstants | MusesIdentify)[];
}

export class MusesCallExpression extends MusesExpression {
    subTree(ctx: MusesGLSLContext, tree: MusesGLSLTree): void {
        this.optionsChildren.arguments.forEach(a => a.subTree(ctx, tree));
        const sign = `${this.name}(${this.optionsChildren.arguments.map(a => this.getExpressionType(ctx, a).name).join(',')})`;
        const func = ctx.functions.find(func => func.sign === sign);
        if (func && func.userFunction && tree.functions.find(f => f.options.name === func.userFunction?.options.name) === undefined) {
            tree.functions.push(func.userFunction);
            return;
        }
        const type = ctx.types.find(type => type.name === this.name);
        if (type && type.struct && tree.structs.find(s => s.options.name === type.struct?.options.name) === undefined) {
            tree.structs.push(type.struct);
            return;
        }
    }
    toMuses(): string {
        return this.toGLSL();
    }
    toGLSL(): string {
        return `${this.optionsChildren.callee.toGLSL()}(${this.optionsChildren.arguments.map(a => a.toGLSL()).join(',')})`;
    }
    get optionsChildren() {
        return this.options as IMusesCallExpressionOptions
    }

    check(ctx: MusesGLSLContext): MusesContextType {
        const parameterTypes = this.optionsChildren.arguments.map(a => this.getExpressionType(ctx, a));

        const sign = `${this.name}(${parameterTypes.map(types => types.sign).join(',')})`;
        const funcName = ctx.functions.find(func => func.sign === sign);
        if (funcName) {
            return funcName.returnType;
        }
        
        const structName = ctx.types.find(type => type.name === this.name);
        if (structName) {
            const structSign = `${structName?.sign}${this.isIndexConstructor?'[]':''}(${parameterTypes.map(types => types.sign).join(',')})`;
            return structName.checkRule(structSign);
        }

        throw new Error(`The function ${sign} is not defined!!!`);
    }

    nodeType: MusesAstNodeType = MusesAstNodeType.CallExpression;
    name = '';
    isIndexConstructor = false;
    constructor(options: IMusesCallExpressionOptions) {
        super(options);
        if (this.optionsChildren.callee.nodeType === MusesAstNodeType.Identify) {
            this.name = (this.optionsChildren.callee as MusesIdentify).name;
        } else {
            this.name = ((this.optionsChildren.callee as MusesIndexExpression).optionsChildren.object as MusesIdentify).name;
            this.isIndexConstructor = true;
        }
    }
}