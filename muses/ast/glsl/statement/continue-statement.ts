import { MusesContext } from "../../context/context";
import { MusesAstNodeType } from "../../nodeType";
import { MusesStatement } from "./statement";

export class MusesContinueStatement extends MusesStatement {
    check(ctx: MusesContext): void {
        if(!ctx.loop){
            throw new Error(`Continue cannot be used out of the loop!!!`);
        }
    }
    nodeType: MusesAstNodeType = MusesAstNodeType.ContinueStatement;
    constructor() {
        super({});
    }
}

