import { IMusesNodeOptions, MusesNode } from "../../node";
import { MusesAstNodeType } from "../../nodeType";
import { MusesStatement } from "./statement";

export class MusesContinueStatement extends MusesStatement {
    nodeType: MusesAstNodeType = MusesAstNodeType.ContinueStatement;
    constructor() {
        super({});
    }
}

