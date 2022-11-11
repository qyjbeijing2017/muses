
export enum MusesLightType{
    Null = 0,
    Point = 1,
    Spot = 2,
    Directional = 3,
}

export interface IMusesLight{
    name?: string;
    position?: Iterable<number>;
    color?: Iterable<number>;
    direction?: Iterable<number>;
    cutoff?: number;
    outerCutoff?: number;
    constantAttenuation?: number;
    linearAttenuation?: number;
    quadraticAttenuation?: number;
    type: MusesLightType;
}

