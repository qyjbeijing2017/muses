import { MusesContext } from "../../context/context";
import { MusesAstNodeType } from "../../nodeType";
import { MusesStatement } from "./statement";

export class MusesBreakStatement extends MusesStatement {
    check(ctx: MusesContext): void {
        if(!ctx.loop){
            throw new Error(`Break cannot be used out of the loop!!!`);
        }
    }
    nodeType: MusesAstNodeType = MusesAstNodeType.BreakStatement;
    constructor() {
        super({});
    }
}

