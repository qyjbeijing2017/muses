import { MusesGLSLContext } from "../../../context/glsl";
import { MusesGLSLTree } from "../../glsltree";
import { MusesAstNodeType } from "../../nodeType";
import { MusesConstants } from "../constants";
import { MusesExpression } from "../expression/express";
import { MusesIdentify } from "../Identify";
import { MusesVariableDeclaration } from "../variable-declaration";
import { IMusesStatementOptions, MusesStatement } from "./statement";

export interface IMusesIfStatementOptions extends IMusesStatementOptions {
    test: MusesExpression | MusesConstants | MusesIdentify;
    consequent: (MusesVariableDeclaration | MusesStatement)[];
    alternate?: (MusesVariableDeclaration | MusesStatement)[] | MusesIfStatement;
}

export class MusesIfStatement extends MusesStatement {
    subTree(ctx: MusesGLSLContext, tree: MusesGLSLTree): void {
        this.optionsChildren.test.subTree(ctx, tree);
        this.optionsChildren.consequent.forEach((item) => {
            item.subTree(ctx, tree);
        });
        if (this.optionsChildren.alternate) {
            if (Array.isArray(this.optionsChildren.alternate)) {
                this.optionsChildren.alternate.forEach((item) => {
                    item.subTree(ctx, tree);
                });
            } else {
                this.optionsChildren.alternate.subTree(ctx, tree);
            }
        }
    }
    toMuses(): string {
        return this.toGLSL();
    }
    toGLSL(): string {
        let alternateStr = '';
        if (this.optionsChildren.alternate) {
            if (Array.isArray(this.optionsChildren.alternate)) {
                alternateStr = `else{
        ${this.optionsChildren.alternate.map((item) => item.toGLSL()).join("\n        ")}
    }`;
            } else {
                alternateStr = `else ${this.optionsChildren.alternate.toGLSL()}`;
            }
        }

        return `if(${this.optionsChildren.test.toGLSL()}){
        ${this.optionsChildren.consequent.map((item) => item.toGLSL()).join("\n        ")}
    } ${alternateStr}`;
    }

    check(ctx: MusesGLSLContext): void {
        this.optionsChildren.test.check(ctx);
        this.optionsChildren.consequent.forEach((item) => {
            item.check(ctx);
        });
        if (this.optionsChildren.alternate) {
            if (Array.isArray(this.optionsChildren.alternate)) {
                this.optionsChildren.alternate.forEach((item) => {
                    item.check(ctx);
                });
            } else {
                this.optionsChildren.alternate.check(ctx);
            }
        }
    }
    get optionsChildren() {
        return this.options as IMusesIfStatementOptions
    }
    nodeType: MusesAstNodeType = MusesAstNodeType.IfStatement;
    constructor(options: IMusesIfStatementOptions) {
        super(options);
    }
}

