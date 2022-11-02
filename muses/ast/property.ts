import { MusesGLSLContext } from "../context/glsl";
import { MusesContextType } from "../context/type";
import { MusesContextVariable } from "../context/variable";
import { MusesGLSLPercision, MusesGLSLStorage } from "./glsl/variable-declaration";
import { IMusesNodeOptions, MusesGLSLNode } from "./node";
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
    displayName: string;
}

const muses2glslTypeMap = new Map<MusesPropertyType, MusesContextType>([
    [MusesPropertyType.Color, new MusesContextType({ name: 'vec4', storage: MusesGLSLStorage.uniform, percision: MusesGLSLPercision.lowp })],
    [MusesPropertyType.Float, new MusesContextType({ name: 'float', storage: MusesGLSLStorage.uniform })],
    [MusesPropertyType.Int, new MusesContextType({ name: 'int', storage: MusesGLSLStorage.uniform })],
    [MusesPropertyType.Vector, new MusesContextType({ name: 'vec4', storage: MusesGLSLStorage.uniform })],
    [MusesPropertyType.Range, new MusesContextType({ name: 'float', storage: MusesGLSLStorage.uniform })],
    [MusesPropertyType._2D, new MusesContextType({ name: 'sampler2D', storage: MusesGLSLStorage.uniform })],
    [MusesPropertyType._3D, new MusesContextType({ name: 'sampler3D', storage: MusesGLSLStorage.uniform })],
    [MusesPropertyType.Cube, new MusesContextType({ name: 'samplerCube', storage: MusesGLSLStorage.uniform })],
]);


export class MusesProperty extends MusesGLSLNode {
    toMuses(): string {
        const typeStr = this.options.range?`${this.options.type}(${this.options.range.join(',')})`: this.options.type;
        const name = this.options.name;
        const display = `"${this.options.displayName}"`;
        let value: string = '';
        if (typeof this.options.value === 'string') {
            value = `"${this.options.value}" {}`;
        } else if (Array.isArray(this.options.value)) {
            value = `(${this.options.value.join(',')})`;
        } else {
            value = this.options.value.toString();
        }
        return `${name}(${display},${typeStr}) = ${value}`;
    }
    toGLSL(): string {
        const type = muses2glslTypeMap.get(this.options.type)!;
        return `${type.storage} ${type.percision} ${type.name} ${this.options.name};`;
    }
    check(ctx: MusesGLSLContext): void {
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