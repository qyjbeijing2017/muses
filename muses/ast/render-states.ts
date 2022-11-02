import { IMusesNodeOptions, MusesGLSLNode } from "./node";
import { MusesAstNodeType } from "./nodeType";

export interface IMusesRenderStatesOptions extends IMusesNodeOptions {
}

export class MusesRenderStates extends MusesGLSLNode{
    toMuses(): string {
        throw new Error("Method not implemented.");
    }
    toGLSL(): string {
        throw new Error("Method not implemented.");
    }
    nodeType: MusesAstNodeType = MusesAstNodeType.RenderStates;
    constructor(private readonly options:IMusesRenderStatesOptions) {
        super();
    }
}