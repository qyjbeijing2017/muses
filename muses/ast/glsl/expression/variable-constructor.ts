import { MusesAstNodeType } from "../../nodeType";
import { MusesConstants } from "../constants";
import { IMusesExpressionOptions, MusesExpression } from "./express";
import { MusesIdentify } from "../Identify";
import { MusesTypeDeclaration } from "../type-declaration";
import { MusesGLSLContext } from "../../../context/glsl";
import { MusesContextType } from "../../../context/type";

export interface IMusesVariableConstructorOptions extends IMusesExpressionOptions {
    type: MusesTypeDeclaration;
    args: (MusesIdentify | MusesConstants | MusesExpression)[];
}

export class MusesVariableConstructor extends MusesExpression {
    toMuses(): string {
        return this.toGLSL();
    }
    toGLSL(): string {
        return `${this.optionsChildren.type.toGLSL()}(${this.optionsChildren.args.map(arg=>arg.toGLSL()).join(',')})`;
    }
    check(ctx: MusesGLSLContext): MusesContextType {
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