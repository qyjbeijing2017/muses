import { IMusesNodeOptions } from "../../node";
import { MusesAstNodeType } from "../../nodeType";
import { MusesConstants } from "../constants";
import { MusesExpression } from "../expression/express";
import { MusesIdentify } from "../Identify";
import { MusesVariableDeclaration } from "../variable-declaration";
import { MusesStatement } from "./statement";

export interface IMusesDoWhileStatementOptions extends IMusesNodeOptions {
    test: MusesExpression | MusesConstants | MusesIdentify;
    body: (MusesStatement | MusesVariableDeclaration)[];
}

export class MusesDoWhileStatement extends MusesStatement {
    nodeType: MusesAstNodeType = MusesAstNodeType.DoWhileStatement;
    constructor(options: IMusesDoWhileStatementOptions) {
        super(options);
    }
}
