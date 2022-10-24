import { IMusesNodeOptions, MusesNode } from "./node";
import { MusesAstNodeType } from "./nodeType";
import { MusesPass } from "./pass";

export interface IMusesSubShaderOptions extends IMusesNodeOptions   {
    passes: MusesPass[];
}

export class MusesSubShader extends MusesNode {
    nodeType: MusesAstNodeType = MusesAstNodeType.SubShader;
    constructor(private readonly options: IMusesSubShaderOptions) {
        super();
    }
}