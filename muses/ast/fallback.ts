import { IMusesNodeOptions, MusesGLSLNode } from "./node";
import { MusesAstNodeType } from "./nodeType";

export interface IMusesFallbackOptions extends IMusesNodeOptions {
    to: string;
}

export class MusesFallback extends MusesGLSLNode{
    toMuses(): string {
        return this.options.to;
    }
    toGLSL(): string {
        return `"${this.options.to}"`;
    }
    nodeType: MusesAstNodeType = MusesAstNodeType.FallBack;
    constructor(private readonly options:IMusesFallbackOptions) {
        super();
    }
}