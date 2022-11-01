import { MusesAstNodeType } from "../../nodeType";
import { MusesConstants } from "../constants";
import { IMusesExpressionOptions, MusesExpression } from "./express";
import { MusesIdentify } from "../Identify";
import { MusesContext } from "../../context/context";
import { MusesContextType } from "../../context/type";

export interface IMusesUpdateExpressionOptions extends IMusesExpressionOptions {
    operator: string;
    object: MusesExpression | MusesConstants | MusesIdentify;
}

export class MusesUpdateExpression extends MusesExpression {
    check(ctx: MusesContext): MusesContextType {
        const objectType = this.getExpressionType(ctx, this.optionsChildren.object);
        if(objectType.name != 'float' && objectType.name != 'int'){
            throw new Error(`The ${objectType.name} cannot be ${this.optionsChildren.operator}`);
        }
        return objectType;
    }
    get optionsChildren(){
        return this.options as IMusesUpdateExpressionOptions
    }
    nodeType: MusesAstNodeType = MusesAstNodeType.UpdateExpression;
    constructor(options: IMusesUpdateExpressionOptions) {
        super(options);
    }
}