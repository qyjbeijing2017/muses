import { MusesAstNodeType } from "../../nodeType";
import { MusesConstants } from "../constants";
import { IMusesExpressionOptions, MusesExpression } from "./express";
import { MusesIdentify } from "../Identify";
import { MusesContext } from "../../context/context";
import { MusesContextType } from "../../context/type";

export interface IMusesIndexExpressionOptions extends IMusesExpressionOptions {
    object: MusesIdentify | MusesExpression | MusesConstants;
    index: MusesExpression | MusesConstants | MusesIdentify;
}

export class MusesIndexExpression extends MusesExpression {
    check(ctx: MusesContext): MusesContextType {
        const objectType = this.getExpressionType(ctx, this.optionsChildren.object);
        const indexType = this.getExpressionType(ctx, this.optionsChildren.index);
        return objectType.checkRule(`${objectType.name}[${indexType.name}]`);
    }
    get optionsChildren(){
        return this.options as IMusesIndexExpressionOptions
    }
    nodeType: MusesAstNodeType = MusesAstNodeType.IndexExpression;
    constructor(options: IMusesIndexExpressionOptions) {
        super(options);
    }
}