import { MusesAstNodeType } from "../../nodeType";
import { MusesConstants } from "../constants";
import { IMusesExpressionOptions, MusesExpression } from "./express";
import { MusesIdentify } from "../Identify";
import { MusesGLSLContext } from "../../../context/glsl";
import { MusesContextType } from "../../../context/type";

export interface IMusesConditionalExpressionOptions extends IMusesExpressionOptions {
    testExpression: MusesExpression | MusesConstants | MusesIdentify;
    trueExpression: MusesExpression | MusesConstants | MusesIdentify;
    falseExpression: MusesExpression | MusesConstants | MusesIdentify;
}

export class MusesConditionalExpression extends MusesExpression {
    toMuses(): string {
        return this.toGLSL();
    }
    toGLSL(): string {
        return `${this.optionsChildren.testExpression.toGLSL()} ? ${this.optionsChildren.trueExpression.toGLSL()} : ${this.optionsChildren.falseExpression.toGLSL()}`;
    }
    get optionsChildren(){
        return this.options as IMusesConditionalExpressionOptions
    }
    check(ctx: MusesGLSLContext): MusesContextType {
        const trueType = this.getExpressionType(ctx, this.optionsChildren.trueExpression);
        const falseType = this.getExpressionType(ctx, this.optionsChildren.falseExpression);
        if(trueType.name != falseType.name){
            throw new Error("true or false type must be the same type!!");
        }
        return trueType;
    }
    nodeType: MusesAstNodeType = MusesAstNodeType.ConditionalExpression;
    constructor(options: IMusesConditionalExpressionOptions) {
        super(options);
    }
}