import { IMusesNodeOptions, MusesNode } from "./node";
import { MusesAstNodeType } from "./nodeType";

export enum MusesPropertyType {
    Float = "Float",
    Int = "Int",
    Vector = "Vector",
    Color = "Color",
    Range = "Range",
    _2D = "2D",
    _3D = "3D",
    Cube = "Cube",
}

export interface IMusesPropertyOptions extends IMusesNodeOptions {
    type: MusesPropertyType;
    value: string | number[] | number;
    name: string;
    range?: number[];
}

export class MusesProperty extends MusesNode {
    nodeType: MusesAstNodeType = MusesAstNodeType.Properties;
    constructor(private readonly options: IMusesPropertyOptions) {
        super();
    }
}