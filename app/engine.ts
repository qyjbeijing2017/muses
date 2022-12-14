import { vec4 } from "gl-matrix";
import { Material } from "./material";
import { Mesh } from "./mesh";
import { Renderer3D } from "./renderer3d";

export class Engine {
    private readonly _gl: WebGL2RenderingContext;
    private _running: boolean = false;

    backgroundColor = vec4.fromValues(1, 0, 0, 1);
    backgroundTexture: WebGLTexture | null = null;

    renderer: Renderer3D;

    constructor(private readonly _container: HTMLCanvasElement) {
        const gl = _container.getContext("webgl2"); 11
        if (!gl) {
            throw new Error("WebGL not supported");
        }
        this._gl = gl;
        this.renderer = new Renderer3D(
            this._gl,
            new Material();
            new Mesh({
                
            })
        );
        this.loop();
    }



    private update(): void {
        this._gl.clearColor(this.backgroundColor[0], this.backgroundColor[1], this.backgroundColor[2], this.backgroundColor[3]);
        this._gl.clear(this._gl.COLOR_BUFFER_BIT | this._gl.DEPTH_BUFFER_BIT | this._gl.STENCIL_BUFFER_BIT);

    }

    loop(): void {
        this._running = true;
        this.update();
        if (this._running) {
            requestAnimationFrame(this.loop.bind(this));
        }
    }

    exit(): void {
        this._running = false;
    }
}