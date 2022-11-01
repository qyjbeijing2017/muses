import { MusesContext } from "./context/context";
import { IMusesNodeOptions, MusesNode } from "./node";
import { MusesAstNodeType } from "./nodeType";
import { MusesPass } from "./pass";

export interface IMusesSubShaderOptions extends IMusesNodeOptions   {
    passes: MusesPass[];
}

export class MusesSubShader extends MusesNode {
    check(ctx: MusesContext): void {
        this.options.passes.forEach((pass) => {
            pass.check(ctx);
        });
    }
    nodeType: MusesAstNodeType = MusesAstNodeType.SubShader;
    constructor(private readonly options: IMusesSubShaderOptions) {
        super();
    }
}