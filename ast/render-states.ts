import { IMusesNodeOptions, MusesNode } from "./node";
import { MusesAstNodeType } from "./nodeType";

export interface IMusesRenderStatesOptions extends IMusesNodeOptions {
}

export class MusesRenderStates extends MusesNode{
    nodeType: MusesAstNodeType = MusesAstNodeType.RenderStates;
    constructor(private readonly options:IMusesRenderStatesOptions) {
        super();
    }
}