import { MusesAstNodeType } from "../../nodeType";
import { MusesConstants } from "../constants";
import { IMusesExpressionOptions, MusesExpression } from "./express";
import { MusesIdentify } from "../Identify";
import { MusesContext } from "../../context/context";
import { MusesContextType } from "../../context/type";

export interface IMusesBinaryExpressionOptions extends IMusesExpressionOptions {
    operator: string;
    left: MusesExpression | MusesConstants | MusesIdentify;
    right: MusesExpression | MusesConstants | MusesIdentify;
}

export class MusesBinaryExpression extends MusesExpression {
    get optionsChildren(){
        return this.options as IMusesBinaryExpressionOptions
    }
    check(ctx: MusesContext): MusesContextType {
        const leftType = this.getExpressionType(ctx, this.optionsChildren.left);
        const rightType = this.getExpressionType(ctx, this.optionsChildren.right);
        if(leftType.name != rightType.name){
            throw new Error(`The ${rightType.name} cannot ${this.optionsChildren.operator} to ${leftType.name}`);
        }
        return leftType;
    }

    nodeType: MusesAstNodeType = MusesAstNodeType.BinaryExpression;
    constructor(options: IMusesBinaryExpressionOptions) {
        super(options);
    }
}