import { IMusesNodeOptions, MusesNode } from "./node";
import { MusesAstNodeType } from "./nodeType";

export interface IMusesFallbackOptions extends IMusesNodeOptions {
    to: string;
}

export class MusesFallback extends MusesNode{
    nodeType: MusesAstNodeType = MusesAstNodeType.FallBack;
    constructor(private readonly options:IMusesFallbackOptions) {
        super();
    }
}