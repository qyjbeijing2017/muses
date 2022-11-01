import { MusesContext } from "./context/context";
import { MusesFallback } from "./fallback";
import { IMusesNodeOptions, MusesNode } from "./node";
import { MusesAstNodeType } from "./nodeType";
import { MusesProperty } from "./property";
import { MusesSubShader } from "./subshader";

export interface IMusesShaderOptions extends IMusesNodeOptions {
    name: string;
    properties?: MusesProperty[];
    subShaders: MusesSubShader[];
    fallback?: MusesFallback;
}

export class MusesShader extends MusesNode {
    check(ctx: MusesContext): void {
        this.options.properties?.forEach((property) => {
            property.check(ctx);
        });
        this.options.subShaders.forEach((subShader) => {
            subShader.check(ctx);
        });
    }
    nodeType: MusesAstNodeType = MusesAstNodeType.Shader;
    constructor(private readonly options: IMusesShaderOptions) {
        super();
    }
}
