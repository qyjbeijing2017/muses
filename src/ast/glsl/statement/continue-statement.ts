import { MusesGLSLContext } from "../../../context/glsl";
import { MusesAstNodeType } from "../../nodeType";
import { MusesStatement } from "./statement";

export class MusesContinueStatement extends MusesStatement {
    toMuses(): string {
        return `continue;`;
    }
    toGLSL(): string {
        return `continue;`;
    }
    check(ctx: MusesGLSLContext): void {
        if(!ctx.loop){
            throw new Error(`Continue cannot be used out of the loop!!!`);
        }
    }
    nodeType: MusesAstNodeType = MusesAstNodeType.ContinueStatement;
    constructor() {
        super({});
    }
}

