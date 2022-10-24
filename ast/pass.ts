import { IMusesNodeOptions, MusesNode } from "./node";
import { MusesAstNodeType } from "./nodeType";

export interface IMusesPassOptions extends IMusesNodeOptions {
}

export class MusesPass extends MusesNode{
    nodeType: MusesAstNodeType = MusesAstNodeType.Pass;
    constructor(private readonly options:IMusesPassOptions) {
        super();
    }
}