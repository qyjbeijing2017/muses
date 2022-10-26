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
    nodeType: MusesAstNodeType = MusesAstNodeType.ForStatement;
    constructor(options: IMusesForStatementOptions) {
        super(options);
    }
}
