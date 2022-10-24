import { CstParser } from "chevrotain";
import { IMusesNodeOptions, MusesNode } from "./node";
import { MusesAstNodeType } from "./nodeType";

export interface IMusesShaderOptions extends IMusesNodeOptions {
    name: string;
}

export class MusesShader extends MusesNode {
    nodeType: MusesAstNodeType = MusesAstNodeType.Shader;
    constructor(private readonly options: IMusesShaderOptions) {
        super();
    }
}
