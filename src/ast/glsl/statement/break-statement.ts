import { MusesGLSLContext } from "../../../context/glsl";
import { MusesAstNodeType } from "../../nodeType";
import { MusesStatement } from "./statement";

export class MusesBreakStatement extends MusesStatement {
    toMuses(): string {
        return `break;`;
    }
    toGLSL(): string {
        return `break;`;
    }
    check(ctx: MusesGLSLContext): void {
        if(!ctx.loop){
            throw new Error(`Break cannot be used out of the loop!!!`);
        }
    }
    nodeType: MusesAstNodeType = MusesAstNodeType.BreakStatement;
    constructor() {
        super({});
    }
}

