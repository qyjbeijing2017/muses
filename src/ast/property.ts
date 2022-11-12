import { MusesGLSLContext } from "../context/glsl";
import { MusesContextType } from "../context/type";
import { MusesContextVariable } from "../context/variable";
import { MusesGLSLPercision, MusesGLSLStorage } from "./glsl/variable-declaration";
import { IMusesNodeOptions, MusesGLSLNode } from "./node";
import { MusesAstNodeType } from "./nodeType";
import {MusesVariableDeclaration} from "./glsl/variable-declaration";
import { MusesTypeDeclaration } from "./glsl/type-declaration";
import { glslTypes } from "../context/glsl.ctx";

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
    [MusesPropertyType.Color, glslTypes.vec4Type ],
    [MusesPropertyType.Float, glslTypes.floatType ],
    [MusesPropertyType.Int, glslTypes.intType ],
    [MusesPropertyType.Vector, glslTypes.vec4Type ],
    [MusesPropertyType.Range, glslTypes.floatType ],
    [MusesPropertyType._2D, glslTypes.sampler2DType ],
    [MusesPropertyType._3D, glslTypes.sampler3DType ],
    [MusesPropertyType.Cube, glslTypes.samplerCubeType ],
]);


export class MusesProperty extends MusesGLSLNode {
    get type(){
        return this.options.type;
    }
    get defaultValue() {
        return this.options.value;
    }
    get range(): number[] | undefined {
        return this.options.range;
    }
    get name(): string {
        return this.options.name;
    }
    get displayName(): string {
        return this.options.displayName;
    }


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
            variable: new MusesVariableDeclaration({
                name: this.options.name,
                type: new MusesTypeDeclaration({name: muses2glslTypeMap.get(this.options.type)!.name}),
                storage: MusesGLSLStorage.uniform,
            }),
        }));
    }
    nodeType: MusesAstNodeType = MusesAstNodeType.Properties;
    constructor(private readonly options: IMusesPropertyOptions) {
        super();
    }
}