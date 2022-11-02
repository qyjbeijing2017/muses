import { MusesAstNodeType } from "../../nodeType";
import { MusesTypeDeclaration } from "../type-declaration";
import { MusesConstants } from "../constants";
import { IMusesExpressionOptions, MusesExpression } from "./express";
import { MusesIdentify } from "../Identify";
import { MusesGLSLContext } from "../../../context/glsl";
import { MusesContextType } from "../../../context/type";

export interface IMusesDotExpressionOptions extends IMusesExpressionOptions {
    object: MusesIdentify | MusesExpression | MusesConstants;
    property: MusesIdentify;
}

export class MusesDotExpression extends MusesExpression {
    toMuses(): string {
        return this.toGLSL();
    }
    toGLSL(): string {
        return `${this.optionsChildren.object.toGLSL()}.${this.optionsChildren.property.toGLSL()}`;
    }
    get optionsChildren(){
        return this.options as IMusesDotExpressionOptions
    }
    check(ctx: MusesGLSLContext): MusesContextType {
        const objectType = this.getExpressionType(ctx, this.optionsChildren.object);
        return objectType.checkRule(`${objectType.name}.${this.optionsChildren.property.name}`);
    }
    nodeType: MusesAstNodeType = MusesAstNodeType.DotExpression;
    constructor(options: IMusesDotExpressionOptions) {
        super(options);
    }
}