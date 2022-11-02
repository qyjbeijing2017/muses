import { MusesAstNodeType } from "../../nodeType";
import { MusesConstants } from "../constants";
import { IMusesExpressionOptions, MusesExpression } from "./express";
import { MusesIdentify } from "../Identify";
import { MusesGLSLContext } from "../../../context/glsl";
import { MusesContextType } from "../../../context/type";

export interface IMusesBinaryExpressionOptions extends IMusesExpressionOptions {
    operator: string;
    left: MusesExpression | MusesConstants | MusesIdentify;
    right: MusesExpression | MusesConstants | MusesIdentify;
}

export class MusesBinaryExpression extends MusesExpression {
    toMuses(): string {
        return this.toGLSL();
    }
    toGLSL(): string {
        return `${this.optionsChildren.left.toGLSL()} ${this.optionsChildren.operator} ${this.optionsChildren.right.toGLSL()}`;
    }
    get optionsChildren(){
        return this.options as IMusesBinaryExpressionOptions
    }
    check(ctx: MusesGLSLContext): MusesContextType {
        const leftType = this.getExpressionType(ctx, this.optionsChildren.left);
        const rightType = this.getExpressionType(ctx, this.optionsChildren.right);
        return leftType.checkRule(`${leftType.name}${this.optionsChildren.operator}${rightType.name}`);
    }

    nodeType: MusesAstNodeType = MusesAstNodeType.BinaryExpression;
    constructor(options: IMusesBinaryExpressionOptions) {
        super(options);
    }
}