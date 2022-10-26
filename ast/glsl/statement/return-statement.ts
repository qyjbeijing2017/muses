import { IMusesNodeOptions } from "../../node";
import { MusesAstNodeType } from "../../nodeType";
import { MusesConstants } from "../constants";
import { MusesExpression } from "../expression/express";
import { MusesIdentify } from "../Identify";
import { MusesStatement } from "./statement";

export interface IMusesRetrunStatementOptions extends IMusesNodeOptions {
    argument?: MusesExpression | MusesConstants | MusesIdentify;
}

export class MusesRetrunStatement extends MusesStatement {
    nodeType: MusesAstNodeType = MusesAstNodeType.ReturnStatement;
    constructor(options: IMusesRetrunStatementOptions) {
        super(options);
    }
}

