import { MusesAstNodeType } from "../../nodeType";
import { MusesConstants } from "../constants";
import { IMusesExpressionOptions, MusesExpression } from "./express";
import { MusesIdentify } from "../Identify";
import { MusesGLSLContext } from "../../../context/glsl";
import { MusesContextType } from "../../../context/type";

export interface IMusesUpdateExpressionOptions extends IMusesExpressionOptions {
    operator: string;
    object: MusesExpression | MusesConstants | MusesIdentify;
}

export class MusesUpdateExpression extends MusesExpression {
    toMuses(): string {
        return this.toGLSL();
    }
    toGLSL(): string {
        return `${this.optionsChildren.object.toGLSL()}${this.optionsChildren.operator}`;
    }
    check(ctx: MusesGLSLContext): MusesContextType {
        const objectType = this.getExpressionType(ctx, this.optionsChildren.object);
        return objectType.checkRule(`${objectType.name}${this.optionsChildren.operator}`);
    }
    get optionsChildren(){
        return this.options as IMusesUpdateExpressionOptions
    }
    nodeType: MusesAstNodeType = MusesAstNodeType.UpdateExpression;
    constructor(options: IMusesUpdateExpressionOptions) {
        super(options);
    }
}