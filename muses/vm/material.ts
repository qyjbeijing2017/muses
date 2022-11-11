import { MusesProperty, MusesPropertyType } from "../ast/property";
import { MusesVM } from "./vm";

export interface IMusesUniform {
    name: string;
    displayName: string;
    type: MusesPropertyType;
    value: string | Iterable<number> | number;
    range?: [number, number];
    texture?: any;
    deprecated?: any;
}

export class MusesMaterial {
    private _uniforms: IMusesUniform[] = [];
    get uniforms(): IMusesUniform[] {
        return this._uniforms;
    }
    constructor(properties: MusesProperty[], readonly vm: MusesVM) {
        properties.forEach((property) => {
            this._uniforms.push({
                name: property.name,
                type: property.type,
                value: property.defaultValue,
                range: property.range ? [property.range[0], property.range[1]] : undefined,
                displayName: property.displayName,
            });
        });
    }

    setUniform(name: string, value: string | Iterable<number> | number) {
        const uniform = this._uniforms.find((uniform) => uniform.name === name);
        if (uniform && uniform.value !== value) {
            uniform.value = value;
            if(uniform.type === MusesPropertyType._2D) {
                uniform.deprecated = uniform.texture;
                uniform.texture = null;
            }
        }
    }

    setUniforms(uniforms: IMusesUniform[]) {
        uniforms.forEach((uniform) => {
            this.setUniform(uniform.name, uniform.value);
        });
    }
}