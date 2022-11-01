import { MusesAstNodeType } from "../../nodeType";
import { MusesConstants } from "../constants";
import { IMusesExpressionOptions, MusesExpression } from "./express";
import { MusesIdentify } from "../Identify";
import { MusesContext } from "../../context/context";
import { MusesContextType } from "../../context/type";

export interface IMusesUnaryExpressionOptions extends IMusesExpressionOptions {
    operator: string;
    argument: MusesExpression | MusesConstants | MusesIdentify;
}

export class MusesUnaryExpression extends MusesExpression {
    check(ctx: MusesContext): MusesContextType {
        const argumentType = this.getExpressionType(ctx, this.optionsChildren.argument);
        return argumentType;
    }
    get optionsChildren(){
        return this.options as IMusesUnaryExpressionOptions
    }
    nodeType: MusesAstNodeType = MusesAstNodeType.UnaryExpression;
    constructor(options: IMusesUnaryExpressionOptions) {
        super(options);
    }
}