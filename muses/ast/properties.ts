import { IMusesNodeOptions, MusesNode } from "./node";
import { MusesAstNodeType } from "./nodeType";

export interface IMusesPropertiesOptions extends IMusesNodeOptions {
}

export class MusesProperties extends MusesNode{
    nodeType: MusesAstNodeType = MusesAstNodeType.Properties;
    constructor(private readonly options:IMusesPropertiesOptions) {
        super();
    }
}