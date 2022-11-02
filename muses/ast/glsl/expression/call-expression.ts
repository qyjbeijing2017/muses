import { MusesAstNodeType } from "../../nodeType";
import { MusesConstants } from "../constants";
import { IMusesExpressionOptions, MusesExpression } from "./express";
import { MusesIdentify } from "../Identify";
import { MusesGLSLContext } from "../../../context/glsl";
import { MusesContextType } from "../../../context/type";

export interface IMusesCallExpressionOptions extends IMusesExpressionOptions {
    callee: MusesIdentify;
    arguments: (MusesExpression | MusesConstants | MusesIdentify)[];
}

export class MusesCallExpression extends MusesExpression {
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
        const sign = `${this.optionsChildren.callee.name}(${parameterTypes.map(types => types.name).join(',')})`;
        const funcName = ctx.functions.find(func => func.sign === sign);
        if (funcName) {
            return funcName.returnType;
        }
        const structName = ctx.types.find(type => type.name === this.optionsChildren.callee.name);
        if (structName) {
            return structName.checkRule(sign);
        }
        throw new Error(`The function ${sign} is not defined!!!`);
    }

    nodeType: MusesAstNodeType = MusesAstNodeType.CallExpression;
    constructor(options: IMusesCallExpressionOptions) {
        super(options);
    }
}