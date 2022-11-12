import { MusesMaterial } from "./material";

export interface IMusesObject {
    name: string;
    material: MusesMaterial;
    modelMatrix: Iterable<number>;
}