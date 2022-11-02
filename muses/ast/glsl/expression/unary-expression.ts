import { MusesAstNodeType } from "../../nodeType";
import { MusesConstants } from "../constants";
import { IMusesExpressionOptions, MusesExpression } from "./express";
import { MusesIdentify } from "../Identify";
import { MusesGLSLContext } from "../../../context/glsl";
import { MusesContextType } from "../../../context/type";

export interface IMusesUnaryExpressionOptions extends IMusesExpressionOptions {
    operator: string;
    argument: MusesExpression | MusesConstants | MusesIdentify;
}

export class MusesUnaryExpression extends MusesExpression {
    toMuses(): string {
        return this.toGLSL();
    }
    toGLSL(): string {
        return `${this.optionsChildren.operator}${this.optionsChildren.argument.toGLSL()}`;
    }
    check(ctx: MusesGLSLContext): MusesContextType {
        const argumentType = this.getExpressionType(ctx, this.optionsChildren.argument);
        return argumentType.checkRule(`${this.optionsChildren.operator}${argumentType.name}`);
    }
    get optionsChildren(){
        return this.options as IMusesUnaryExpressionOptions
    }
    nodeType: MusesAstNodeType = MusesAstNodeType.UnaryExpression;
    constructor(options: IMusesUnaryExpressionOptions) {
        super(options);
    }
}