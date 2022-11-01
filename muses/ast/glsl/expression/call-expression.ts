import { MusesAstNodeType } from "../../nodeType";
import { MusesConstants } from "../constants";
import { IMusesExpressionOptions, MusesExpression } from "./express";
import { MusesIdentify } from "../Identify";
import { MusesContext } from "../../context/context";
import { MusesContextType } from "../../context/type";

export interface IMusesCallExpressionOptions extends IMusesExpressionOptions {
    callee: MusesIdentify;
    arguments: (MusesExpression | MusesConstants | MusesIdentify)[];
}

export class MusesCallExpression extends MusesExpression {
    get optionsChildren() {
        return this.options as IMusesCallExpressionOptions
    }

    check(ctx: MusesContext): MusesContextType {
        const funcName = ctx.functions.find(func => func.name === this.optionsChildren.callee.name);
        if (funcName) {
            if (funcName.parameter.length !== this.optionsChildren.arguments.length) {
                throw new Error(`the function ${funcName.name} need ${funcName.parameter.length} arguments, but you give ${this.optionsChildren.arguments.length} arguments!`);
            }
            for (let index = 0; index < funcName.parameter.length; index++) {
                const parameter = funcName.parameter[index];
                const argument = this.optionsChildren.arguments[index];
                const argumentType = this.getExpressionType(ctx, argument);
                if (argumentType.name !== parameter.type.name) {
                    throw new Error(`the function ${funcName.name} need ${parameter.type.name} type argument, but you give ${argumentType.name} type argument!`);
                }
            }
            return funcName.returnType;
        }
        const structName = ctx.types.find(type => type.name === this.optionsChildren.callee.name);
        if (structName) {
            return structName.checkRule(`${structName.name}(${this.optionsChildren.arguments.map(m=>this.getExpressionType(ctx, m).name).join(",")})`);
        }
        throw new Error(`The function ${this.optionsChildren.callee.name} not defined!!`)
    }

    nodeType: MusesAstNodeType = MusesAstNodeType.CallExpression;
    constructor(options: IMusesCallExpressionOptions) {
        super(options);
    }
}