import { MusesContext } from "../../context/context";
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
    check(ctx: MusesContext): void {
        this.optionsChildren.test.check(ctx);
        ctx.loop.push(true);
        this.optionsChildren.body?.forEach((item) => {
            item.check(ctx);
        });
        ctx.loop.pop();
    }

    get optionsChildren(){
        return this.options as IMusesDoWhileStatementOptions
    }
    nodeType: MusesAstNodeType = MusesAstNodeType.DoWhileStatement;
    constructor(options: IMusesDoWhileStatementOptions) {
        super(options);
    }
}
