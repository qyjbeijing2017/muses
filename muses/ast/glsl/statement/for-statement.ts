import { MusesContext } from "../../context/context";
import { IMusesNodeOptions } from "../../node";
import { MusesAstNodeType } from "../../nodeType";
import { MusesConstants } from "../constants";
import { MusesExpression } from "../expression/express";
import { MusesIdentify } from "../Identify";
import { MusesVariableDeclaration } from "../variable-declaration";
import { MusesStatement } from "./statement";

export interface IMusesForStatementOptions extends IMusesNodeOptions {
    init?: MusesVariableDeclaration | MusesExpression | MusesConstants | MusesIdentify;
    test: MusesExpression | MusesConstants | MusesIdentify;
    update?: MusesExpression | MusesConstants | MusesIdentify;
    body: (MusesStatement | MusesVariableDeclaration)[];
}

export class MusesForStatement extends MusesStatement {
    check(ctx: MusesContext): void {
        this.optionsChildren.test.check(ctx);
        this.optionsChildren.init?.check(ctx);
        this.optionsChildren.update?.check(ctx);
        ctx.loop.push(true);
        this.optionsChildren.body?.forEach((item) => {
            item.check(ctx);
        });
        ctx.loop.pop();
    }

    get optionsChildren(){
        return this.options as IMusesForStatementOptions
    }
    nodeType: MusesAstNodeType = MusesAstNodeType.ForStatement;
    constructor(options: IMusesForStatementOptions) {
        super(options);
    }
}
