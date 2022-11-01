import { MusesAstNodeType } from "../../nodeType";
import { MusesTypeDeclaration } from "../type-declaration";
import { MusesConstants } from "../constants";
import { IMusesExpressionOptions, MusesExpression } from "./express";
import { MusesIdentify } from "../Identify";
import { MusesContext } from "../../context/context";
import { MusesContextType } from "../../context/type";

export interface IMusesDotExpressionOptions extends IMusesExpressionOptions {
    object: MusesIdentify | MusesExpression | MusesConstants;
    property: MusesIdentify;
}

export class MusesDotExpression extends MusesExpression {
    get optionsChildren(){
        return this.options as IMusesDotExpressionOptions
    }
    check(ctx: MusesContext): MusesContextType {
        const objectType = this.getExpressionType(ctx, this.optionsChildren.object);
        return objectType.checkRule(`${objectType.name}.${this.optionsChildren.property.name}`);
    }
    nodeType: MusesAstNodeType = MusesAstNodeType.DotExpression;
    constructor(options: IMusesDotExpressionOptions) {
        super(options);
    }
}