import { MusesLightType } from "./light.type";

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

