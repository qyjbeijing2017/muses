import { MusesAstNodeType } from "./nodeType";

export interface IMusesNodeOptions {
}

export abstract class MusesNode{
    abstract readonly nodeType: MusesAstNodeType;
}