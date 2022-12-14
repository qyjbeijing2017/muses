export enum PropertyType {
    Int = 'Int',
    Float = 'Float',
    Color = 'Color',
    Vector = 'Vector',
    Range = 'Range',
    TwoD = '2D',
    ThreeD = '3D',
    Cube = 'Cube',
}

export type PropertyValue = number | [number, number, number, number] | string;

export interface IProperty {
    name: string;
    type: PropertyType;
    label: string;
    value: PropertyValue;
    min?: number;
    max?: number;
}
