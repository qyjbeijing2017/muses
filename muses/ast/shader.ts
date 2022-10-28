import { MusesFallback } from "./fallback";
import { IMusesNodeOptions, MusesNode } from "./node";
import { MusesAstNodeType } from "./nodeType";
import { MusesProperties } from "./properties";
import { MusesSubShader } from "./subshader";

export interface IMusesShaderOptions extends IMusesNodeOptions {
    name: string;
    properties?: MusesProperties;
    subShaders: MusesSubShader[];
    fallback?: MusesFallback;
}

export class MusesShader extends MusesNode {
    nodeType: MusesAstNodeType = MusesAstNodeType.Shader;
    constructor(private readonly options: IMusesShaderOptions) {
        super();
    }
}
