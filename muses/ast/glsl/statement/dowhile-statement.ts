import { MusesGLSLContext } from "../../../context/glsl";
import { MusesGLSLTree } from "../../glsltree";
import { IMusesNodeOptions } from "../../node";
import { MusesAstNodeType } from "../../nodeType";
import { MusesConstants } from "../constants";
import { MusesVariableDeclaration } from "../variable-declaration";
import { MusesStatement } from "./statement";

export interface IMusesDoWhileStatementOptions extends IMusesNodeOptions {
    test:  MusesConstants;
    body: (MusesStatement | MusesVariableDeclaration)[];
}

export class MusesDoWhileStatement extends MusesStatement {
    subTree(ctx: MusesGLSLContext, tree: MusesGLSLTree): void {
        let variableCount = ctx.variables.length;
        this.optionsChildren.test.subTree(ctx, tree);
        this.optionsChildren.body?.forEach((item) => {
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
        return `do{
        ${this.optionsChildren.body.map((item) => item.toGLSL()).join("\n        ")}
    }while(${this.optionsChildren.test.toGLSL()});`;
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
        return this.options as IMusesDoWhileStatementOptions
    }
    nodeType: MusesAstNodeType = MusesAstNodeType.DoWhileStatement;
    constructor(options: IMusesDoWhileStatementOptions) {
        super(options);
    }
}
