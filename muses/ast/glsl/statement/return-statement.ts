import { MusesGLSLContext } from "../../../context/glsl";
import { MusesGLSLTree } from "../../glsltree";
import { IMusesNodeOptions } from "../../node";
import { MusesAstNodeType } from "../../nodeType";
import { MusesConstants } from "../constants";
import { MusesExpression } from "../expression/express";
import { MusesIdentify } from "../Identify";
import { MusesStatement } from "./statement";

export interface IMusesRetrunStatementOptions extends IMusesNodeOptions {
    argument?: MusesExpression | MusesConstants | MusesIdentify;
}

export class MusesRetrunStatement extends MusesStatement {
    subTree(ctx: MusesGLSLContext, tree: MusesGLSLTree): void {
        if (this.optionsChildren.argument) {
            this.optionsChildren.argument.subTree(ctx, tree);
        }
    }
    toMuses(): string {
        return this.toGLSL();
    }
    toGLSL(): string {
        if (this.optionsChildren.argument) {
            return `return ${this.optionsChildren.argument.toGLSL()};`;
        }
        return `return;`;
    }
    check(ctx: MusesGLSLContext): void {
        if (!ctx.funcName) {
            throw new Error(`found a return out of the function`);
        }
        const func = ctx.functions.find(func => func.name === ctx.funcName)!;
        if (this.optionsChildren.argument) {
            const type = this.getExpressionType(ctx, this.optionsChildren.argument);
            if(type.sign !== func.returnType.sign){
                throw new Error(`Cannot return the type ${type.sign} for ${func.returnType.sign} in ${ctx.funcName}`);
            }
        }
        if (func.returnType.sign === 'void') {
            throw new Error(`Not return anything for ${func.returnType.sign} in ${ctx.funcName}`);
        }
    }

    getExpressionType(ctx: MusesGLSLContext, value: MusesExpression | MusesConstants | MusesIdentify) {
        switch (value.nodeType) {
            case MusesAstNodeType.Identify:
                const variables = ctx.variables.find(variable => variable.name === (value as MusesIdentify).name);
                if (!variables) {
                    throw new Error(`Variable ${(value as MusesIdentify).name} is not defined`);
                }
                return variables.type;
            case MusesAstNodeType.Constants:
                return (value as MusesConstants).type.toCtxType(ctx);
            default:
                return (value as MusesExpression).check(ctx)
        }
    }

    get optionsChildren() {
        return this.options as IMusesRetrunStatementOptions
    }
    nodeType: MusesAstNodeType = MusesAstNodeType.ReturnStatement;
    constructor(options: IMusesRetrunStatementOptions) {
        super(options);
    }
}

