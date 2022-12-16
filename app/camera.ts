import { mat4, vec2, vec3 } from "gl-matrix";

export class Camera{
    private _postion: vec3 = vec3.fromValues(4, 4, 6);
    private _fov = 45;
    private _near = 0.1;
    private _far = 100;

    rangeR = vec2.fromValues(2, 30);
    rangeTheta = vec2.fromValues(15 * Math.PI / 180, 165 * Math.PI / 180);
    rangePhi = vec2.fromValues(0, Math.PI * 2);

    constructor(private readonly _container: HTMLCanvasElement){
    }

    private limitRange(value: number, range: vec2) {
        if (value < range[0])
            return range[0];
        if (value > range[1])
            return range[1];
        return value;
    }

    get cameraControl() {
        const r = vec3.length(this._postion);
        const theta = Math.acos(this._postion[1] / r);
        const phi = Math.atan2(this._postion[2], this._postion[0]);
        return vec3.fromValues(r, theta / Math.PI * 180, phi / Math.PI * 180);
    }

    set cameraControl(value: vec3) {
        const r = this.limitRange(value[0], this.rangeR);
        const theta = this.limitRange(value[1] * Math.PI / 180, this.rangeTheta);
        const phi = value[2] * Math.PI / 180

        const x = r * Math.sin(theta) * Math.cos(phi);
        const y = r * Math.cos(theta);
        const z = r * Math.sin(theta) * Math.sin(phi);
        this._postion = vec3.fromValues(x, y, z);
    }

    get viewMatrix() {
        const target = vec3.fromValues(0, 0, 0);
        const up = vec3.fromValues(0, 1, 0);
        return mat4.lookAt(mat4.create(), this._postion, target, up);
    }

    get projectionMatrix() {
        const aspect = 1920 /  1080;
        return mat4.perspective(mat4.create(), this._fov, aspect, this._near, this._far);
    }
}