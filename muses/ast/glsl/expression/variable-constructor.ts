import { MusesAstNodeType } from "../../nodeType";
import { MusesConstants } from "../constants";
import { IMusesExpressionOptions, MusesExpression } from "./express";
import { MusesIdentify } from "../Identify";
import { MusesTypeDeclaration } from "../type-declaration";
import { MusesContext } from "../../context/context";
import { MusesContextType } from "../../context/type";

export interface IMusesVariableConstructorOptions extends IMusesExpressionOptions {
    type: MusesTypeDeclaration;
    args: (MusesIdentify | MusesConstants | MusesExpression)[];
}

export class MusesVariableConstructor extends MusesExpression {
    check(ctx: MusesContext): MusesContextType {
        const argTypes = this.optionsChildren.args.map((arg)=>this.getExpressionType(ctx, arg));
        const type = this.optionsChildren.type.toCtxType(ctx);
        return type.checkRule(`${type.name}(${argTypes.map(argType=>argType.name).join(',')})`);
    }
    get optionsChildren(){
        return this.options as IMusesVariableConstructorOptions;
    }
    nodeType: MusesAstNodeType = MusesAstNodeType.VariableConstructor;
    constructor(options: IMusesVariableConstructorOptions) {
        super(options);
    }
}