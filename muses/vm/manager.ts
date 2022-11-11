import { IMusesLight } from "./light";

export class MusesManager {
    lights: IMusesLight[];
    constructor({
        lights,
    }: {
        lights: IMusesLight[];
    }) {
        this.lights = lights;
    }
}