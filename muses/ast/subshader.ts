import { MusesShaderContext } from "../context/shader";
import { IMusesNodeOptions, MusesNode } from "./node";
import { MusesAstNodeType } from "./nodeType";
import { MusesPass } from "./pass";

export interface IMusesSubShaderOptions extends IMusesNodeOptions   {
    passes: MusesPass[];
}

export class MusesSubShader extends MusesNode {
    toMuses(): string {
       return this.options.passes.map(pass=> `    Pass {
         ${pass.toMuses()}
        }` ).join("\n    ");
    }
    toGLSL(): string {
        throw new Error("Method not implemented.");
    }
    check(ctx: MusesShaderContext): void {
        const subShaderCtx = ctx.createSubShaderContext();
        this.options.passes.forEach((pass) => {
            pass.check(subShaderCtx);
        });
    }
    nodeType: MusesAstNodeType = MusesAstNodeType.SubShader;
    constructor(private readonly options: IMusesSubShaderOptions) {
        super();
    }
}