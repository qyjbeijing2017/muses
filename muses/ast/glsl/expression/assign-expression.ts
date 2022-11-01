import { MusesAstNodeType } from "../../nodeType";
import { MusesConstants } from "../constants";
import { IMusesExpressionOptions, MusesExpression } from "./express";
import { MusesIdentify } from "../Identify";
import { MusesContext } from "../../context/context";
import { MusesContextType } from "../../context/type";

export interface IMusesAssignExpressionOptions extends IMusesExpressionOptions {
    operator: string;
    left: MusesExpression | MusesConstants | MusesIdentify;
    right: MusesExpression | MusesConstants | MusesIdentify;
}

export class MusesAssignExpression extends MusesExpression {
    check(ctx: MusesContext): MusesContextType {
        if(this.optionsChildren.left.nodeType != MusesAstNodeType.Identify){
            throw new Error('the left value must be assignable value');
        }
        const leftType = this.getExpressionType(ctx, this.optionsChildren.left);
        const rightType = this.getExpressionType(ctx, this.optionsChildren.right);
        if(leftType.name != rightType.name){
            throw new Error(`The ${rightType.name} cannot ${this.optionsChildren.operator} to ${leftType.name}`);
        }
        return leftType;
    }
    get optionsChildren(){
        return this.options as IMusesAssignExpressionOptions
    }

    nodeType: MusesAstNodeType = MusesAstNodeType.AssignExpression;
    constructor(options: IMusesAssignExpressionOptions) {
        super(options);
    }
}