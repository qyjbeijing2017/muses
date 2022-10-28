import { IMusesNodeOptions, MusesNode } from "../../node";
import { MusesAstNodeType } from "../../nodeType";
import { MusesStatement } from "./statement";

export class MusesBreakStatement extends MusesStatement {
    nodeType: MusesAstNodeType = MusesAstNodeType.BreakStatement;
    constructor() {
        super({});
    }
}

