import { MusesGLSLContext } from "../../../context/glsl";
import { IMusesNodeOptions } from "../../node";
import { MusesAstNodeType } from "../../nodeType";
import { MusesConstants } from "../constants";
import { MusesExpression } from "../expression/express";
import { MusesIdentify } from "../Identify";
import { MusesVariableDeclaration } from "../variable-declaration";
import { MusesStatement } from "./statement";

export interface IMusesForStatementOptions extends IMusesNodeOptions {
    init?: MusesVariableDeclaration[] | MusesExpression | MusesConstants | MusesIdentify;
    test: MusesExpression | MusesConstants | MusesIdentify;
    update?: MusesExpression | MusesConstants | MusesIdentify;
    body: (MusesStatement | MusesVariableDeclaration)[];
}

export class MusesForStatement extends MusesStatement {
    toMuses(): string {
        return this.toGLSL();
    }
    toGLSL(): string {
        let init = '';
        if(this.optionsChildren.init && Array.isArray(this.optionsChildren.init)){
            init = MusesVariableDeclaration.arrayToGLSL(this.optionsChildren.init);
        }else{
            init = this.optionsChildren.init?.toGLSL() || '';
        }

        return `for(${init} ${this.optionsChildren.test.toGLSL()}; ${this.optionsChildren.update?.toGLSL()}){
        ${this.optionsChildren.body.map((item) => item.toGLSL()).join("\n        ")}
    }`;
    }
    check(ctx: MusesGLSLContext): void {
        if(this.optionsChildren.init && Array.isArray(this.optionsChildren.init)){
            this.optionsChildren.init.forEach((item) => item.check(ctx));
        }else{
            this.optionsChildren.init?.check(ctx);
        }
        this.optionsChildren.test.check(ctx);
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
