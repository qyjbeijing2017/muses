import { MusesShaderContext } from "../context/shader";
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
    toGLSL(): string {
        throw new Error("This is not a glsl node.");
    }
    toMuses(): string {
        return `Shader "${this.options.name}"{

    Properties {
        ${this.options.properties?.map((property) => property.toMuses()).join("\n        ")}
    }

    SubShader {
    ${this.options.subShaders.map((subShader) => subShader.toMuses()).join(`
    }
    
    SubShader {
    `)}
    }

    FallBack ${this.options.fallback?.toMuses()}
}`;
    }
    check(ctx: MusesShaderContext): void {
        this.options.properties?.forEach((property) => {
            property.check(ctx.propertiesCtx);
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
