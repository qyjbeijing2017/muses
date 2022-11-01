import { MusesContext } from "../../context/context";
import { MusesAstNodeType } from "../../nodeType";
import { MusesConstants } from "../constants";
import { MusesExpression } from "../expression/express";
import { MusesIdentify } from "../Identify";
import { MusesVariableDeclaration } from "../variable-declaration";
import { IMusesStatementOptions, MusesStatement } from "./statement";

export interface IMusesIfStatementOptions extends IMusesStatementOptions {
    test: MusesExpression | MusesConstants | MusesIdentify;
    consequent: (MusesVariableDeclaration | MusesStatement)[];
    alternate: (MusesVariableDeclaration | MusesStatement)[] | IMusesIfStatementOptions;
}

export class MusesIfStatement extends MusesStatement {
    check(ctx: MusesContext): void {
        
    }
    get optionsChildren(){
        return this.options as IMusesIfStatementOptions
    }
    nodeType: MusesAstNodeType = MusesAstNodeType.IfStatement;
    constructor(options: IMusesIfStatementOptions) {
        super(options);
    }
}

