import { MusesContext } from "./context/context";
import { MusesContextType } from "./context/type";
import { MusesContextVariable } from "./context/variable";
import { MusesGLSLPercision, MusesGLSLStorage } from "./glsl/variable-declaration";
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

const muses2glslTypeMap = new Map<MusesPropertyType, MusesContextType>([
    [MusesPropertyType.Color, new MusesContextType({ name: 'vec4', storage: MusesGLSLStorage.uniform, percision: MusesGLSLPercision.lowp })],
    [MusesPropertyType.Float, new MusesContextType({ name: 'float', storage: MusesGLSLStorage.uniform, percision: MusesGLSLPercision.highp })],
    [MusesPropertyType.Int, new MusesContextType({ name: 'int', storage: MusesGLSLStorage.uniform, percision: MusesGLSLPercision.highp })],
    [MusesPropertyType.Vector, new MusesContextType({ name: 'vec4', storage: MusesGLSLStorage.uniform, percision: MusesGLSLPercision.highp })],
    [MusesPropertyType.Range, new MusesContextType({ name: 'float', storage: MusesGLSLStorage.uniform, percision: MusesGLSLPercision.highp })],
    [MusesPropertyType._2D, new MusesContextType({ name: 'sampler2D', storage: MusesGLSLStorage.uniform, percision: MusesGLSLPercision.highp })],
    [MusesPropertyType._3D, new MusesContextType({ name: 'sampler3D', storage: MusesGLSLStorage.uniform, percision: MusesGLSLPercision.highp })],
    [MusesPropertyType.Cube, new MusesContextType({ name: 'samplerCube', storage: MusesGLSLStorage.uniform, percision: MusesGLSLPercision.highp })],
]);


export class MusesProperty extends MusesNode {
    check(ctx: MusesContext): void {
        ctx.variables.push(new MusesContextVariable({
            type: muses2glslTypeMap.get(this.options.type)!.copy(),
            name: this.options.name,
        }));
    }
    nodeType: MusesAstNodeType = MusesAstNodeType.Properties;
    constructor(private readonly options: IMusesPropertyOptions) {
        super();
    }
}