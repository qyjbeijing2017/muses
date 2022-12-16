import { vec4 } from "gl-matrix";
import { BlendOp, CullState, Factor, PropertyType } from "../src";
import { IRenderState } from "../src/renderstate/renderstate";
import { Camera } from "./camera";
import { cubeNormals, cubePositions, cubeTexCoords } from "./cube";
import { Material } from "./material";
import { Mesh } from "./mesh";
import { IUniformLocations, IUniforms, Renderer3D } from "./renderer3d";

export class Engine {
    private readonly _gl: WebGL2RenderingContext;
    private _running: boolean = false;

    backgroundColor = vec4.fromValues(1, 0, 0, 1);
    backgroundTexture: WebGLTexture | null = null;

    private _renderer: Renderer3D;
    private _camera: Camera;

    constructor(private readonly _container: HTMLCanvasElement) {
        const gl = _container.getContext("webgl2");
        this._camera = new Camera(_container);
        if (!gl) {
            throw new Error("WebGL not supported");
        }
        this._gl = gl;
        const mesh = new Mesh({
            attributes: {
                a_position: {
                    data: Float32Array.from(cubePositions),
                    size: 3,
                    type: this._gl.FLOAT,
                    normalized: false,
                },
                a_normal: {
                    data: Float32Array.from(cubeNormals),
                    size: 3,
                    type: this._gl.FLOAT,
                    normalized: false,
                },
                a_texcoord: {
                    data: Float32Array.from(cubeTexCoords),
                    size: 2,
                    type: this._gl.FLOAT,
                    normalized: false,
                },
            }
        });
        mesh.calculateTangents(gl);
        this._renderer = new Renderer3D(
            this._gl,
            mesh,
        );
        this.loop();
    }

    get camera(): Camera {
        return this._camera;
    }

    get material(): Material | null {
        return this._renderer.material;
    }

    set materialSrc(code: string) {
        this._renderer.material = new Material(code);
    }

    private static cullState2gl(cullState: CullState, gl: WebGL2RenderingContext): number {
        switch (cullState) {
            case CullState.Back:
                return gl.BACK;
            case CullState.Front:
                return gl.FRONT;

        }
    }

    private static blendOp2gl(blendOp: BlendOp, gl: WebGL2RenderingContext): number {
        switch (blendOp) {
            case BlendOp.Add:
                return gl.FUNC_ADD;
            case BlendOp.Sub:
                return gl.FUNC_SUBTRACT;
            case BlendOp.RevSub:
                return gl.FUNC_REVERSE_SUBTRACT;
            case BlendOp.Min:
                return gl.MIN;
            case BlendOp.Max:
                return gl.MAX;
            default:
                return gl.FUNC_ADD;
        }
    }

    private static factor2gl(factor: Factor, gl: WebGL2RenderingContext): number {
        switch (factor) {
            case Factor.Zero:
                return gl.ZERO;
            case Factor.One:
                return gl.ONE;
            case Factor.SrcColor:
                return gl.SRC_COLOR;
            case Factor.OneMinusSrcColor:
                return gl.ONE_MINUS_SRC_COLOR;
            case Factor.DstColor:
                return gl.DST_COLOR;
            case Factor.OneMinusDstColor:
                return gl.ONE_MINUS_DST_COLOR;
            case Factor.SrcAlpha:
                return gl.SRC_ALPHA;
            case Factor.OneMinusSrcAlpha:
                return gl.ONE_MINUS_SRC_ALPHA;
            case Factor.DstAlpha:
                return gl.DST_ALPHA;
            case Factor.OneMinusDstAlpha:
                return gl.ONE_MINUS_DST_ALPHA;
            case Factor.SrcAlphaSaturate:
                return gl.SRC_ALPHA_SATURATE;
            case Factor.ConstantColor:
                return gl.CONSTANT_COLOR;
            case Factor.OneMinusConstantColor:
                return gl.ONE_MINUS_CONSTANT_COLOR;
            case Factor.ConstantAlpha:
                return gl.CONSTANT_ALPHA;
            case Factor.OneMinusConstantAlpha:
                return gl.ONE_MINUS_CONSTANT_ALPHA;
            default:
                return gl.ONE;
        }
    }

    private setRenderStates(renderStates: Partial<IRenderState>): void {
    }

    private setUniforms(uniforms: IUniforms, locations: IUniformLocations): void {
        let textureIndex = 1;
        for (const key in locations) {
            const uniform = uniforms[key];
            const location = locations[key];
            switch (uniform.type) {
                case PropertyType.Color:
                    this._gl.uniform4fv(location, uniform.value as number[]);
                    break;
                case PropertyType.Float:
                    this._gl.uniform1f(location, uniform.value as number);
                    break;
                case PropertyType.Vector:
                    this._gl.uniform4fv(location, uniform.value as number[]);
                    break;
                case PropertyType.Range:
                    this._gl.uniform1f(location, uniform.value as number);
                    break;
                case PropertyType.Int:
                    this._gl.uniform1i(location, uniform.value as number);
                    break;
                case PropertyType.TwoD:
                    this._gl.activeTexture(this._gl.TEXTURE0 + textureIndex);
                    this._gl.bindTexture(this._gl.TEXTURE_2D, uniform.value as WebGLTexture);
                    this._gl.uniform1i(location, textureIndex);
                    break;
                case PropertyType.Cube:
                    this._gl.activeTexture(this._gl.TEXTURE0 + textureIndex);
                    this._gl.bindTexture(this._gl.TEXTURE_CUBE_MAP, uniform.value as WebGLTexture);
                    this._gl.uniform1i(location, textureIndex);
                    break;
                default:
                    throw new Error("Unknown uniform type");
            }
        }
    }

    private update(): void {
        this._gl.clearColor(this.backgroundColor[0], this.backgroundColor[1], this.backgroundColor[2], this.backgroundColor[3]);
        this._gl.clear(this._gl.COLOR_BUFFER_BIT | this._gl.DEPTH_BUFFER_BIT | this._gl.STENCIL_BUFFER_BIT);
        const renderInfo = this._renderer.renderInfo;
        const mesh = this._renderer.mesh;
        const uniforms = renderInfo.uniforms;
        const renderCommands = renderInfo.commands;
        const modelMatrix = this._renderer.modelMatrix;
        const viewMatrix = this._camera.viewMatrix;
        const projectionMatrix = this._camera.projectionMatrix;
        for (const command of renderCommands) {
            this.setRenderStates(command.renderStates);
            this._gl.useProgram(command.program);

            // set uniforms
            const a_model = this._gl.getUniformLocation(command.program, "a_model");
            if(a_model) {
                this._gl.uniformMatrix4fv(a_model, false, modelMatrix);
            }
            const a_view = this._gl.getUniformLocation(command.program, "a_view");
            if(a_view) {
                this._gl.uniformMatrix4fv(a_view, false, viewMatrix);
            }
            const a_projection = this._gl.getUniformLocation(command.program, "a_projection");
            if(a_projection) {
                this._gl.uniformMatrix4fv(a_projection, false, projectionMatrix);
            }
            this.setUniforms(uniforms, command.uniformLocations);
            this._gl.bindVertexArray(command.vao);
            if (this._renderer.ebo) {
                this._gl.drawElements(mesh.mode, mesh.count, mesh.type, mesh.offset);
            } else {
                this._gl.drawArrays(mesh.mode, mesh.first, mesh.count);
            }
        }
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