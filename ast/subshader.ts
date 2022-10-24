import { IMusesNodeOptions, MusesNode } from "./node";
import { MusesAstNodeType } from "./nodeType";

export interface IMusesSubShaderOptions extends IMusesNodeOptions   {
    name: string;
}

export class MusesSubShader extends MusesNode {
    nodeType: MusesAstNodeType = MusesAstNodeType.SubShader;
    constructor(private readonly options: IMusesSubShaderOptions) {
        super();
    }
}