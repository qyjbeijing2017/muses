import { MusesGLSLContext } from "../../../context/glsl";
import { MusesGLSLTree } from "../../glsltree";
import { IMusesNodeOptions } from "../../node";
import { MusesAstNodeType } from "../../nodeType";
import { MusesConstants } from "../constants";
import { MusesExpression } from "../expression/express";
import { MusesIdentify } from "../Identify";
import { MusesVariableDeclaration } from "../variable-declaration";
import { MusesStatement } from "./statement";

export interface IMusesWhileStatementOptions extends IMusesNodeOptions {
    test: MusesExpression | MusesConstants | MusesIdentify;
    body: (MusesStatement | MusesVariableDeclaration)[];
}

export class MusesWhileStatement extends MusesStatement {
    subTree(ctx: MusesGLSLContext, tree: MusesGLSLTree): void {
        let variableCount = ctx.variables.length;
        this.optionsChildren.test.subTree(ctx, tree);
        this.optionsChildren.body.forEach((item) => {
            item.subTree(ctx, tree);
        });
        while (ctx.variables.length > variableCount) {
            ctx.variables.pop();
        }
    }
    toMuses(): string {
        return this.toGLSL();
    }
    toGLSL(): string {
        return `while(${this.optionsChildren.test.toGLSL()}){
        ${this.optionsChildren.body.map((item) => item.toGLSL()).join("\n        ")}
    }`;
    }
    check(ctx: MusesGLSLContext): void {
        let variableCount = ctx.variables.length;
        this.optionsChildren.test.check(ctx);
        ctx.loop.push(true);
        this.optionsChildren.body?.forEach((item) => {
            item.check(ctx);
        });
        ctx.loop.pop();
        while (ctx.variables.length > variableCount) {
            ctx.variables.pop();
        }
    }

    get optionsChildren(){
        return this.options as IMusesWhileStatementOptions;
    }
    
    nodeType: MusesAstNodeType = MusesAstNodeType.WhileStatement;
    constructor(options: IMusesWhileStatementOptions) {
        super(options);
    }
}
