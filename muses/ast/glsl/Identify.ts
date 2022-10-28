import { IMusesNodeOptions, MusesNode } from "../node";
import { MusesAstNodeType } from "../nodeType";

export interface IMusesIdentifyOptions extends IMusesNodeOptions {
    name: string;
}

export class MusesIdentify extends MusesNode {
    nodeType: MusesAstNodeType = MusesAstNodeType.Identify;
    constructor(private readonly options: IMusesIdentifyOptions) {
        super();
    }
}