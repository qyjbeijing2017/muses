import { mat4, vec4 } from "gl-matrix";
import { BlendOp, CompOp, CullState, Factor, PropertyType, StencilOp, ZTestOp } from "../src";
import { IRenderState } from "../src/renderstate/renderstate";
import { Camera } from "./camera";
import { cubeNormals, cubePositions, cubeTexCoords } from "./cube";
import { Material } from "./material";
import { Mesh } from "./mesh";
import { IUniformLocations, IUniforms, Renderer3D } from "./renderer3d";

export class Engine {
    private readonly _gl: WebGL2RenderingContext;
    private _running: boolean = false;

    private _renderer: Renderer3D;
    private _camera: Camera;

    constructor(private readonly _container: HTMLCanvasElement) {
        const gl = _container.getContext("webgl2");
        if (!gl) {
            throw new Error("WebGL not supported");
        }
        this._gl = gl;
        this._camera = new Camera(_container, gl);
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
            default:
                return gl.BACK;
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

    private static compOp2gl(compOp: CompOp, gl: WebGL2RenderingContext): number {
        switch (compOp) {
            case CompOp.Never:
                return gl.NEVER;
            case CompOp.Less:
                return gl.LESS;
            case CompOp.Equal:
                return gl.EQUAL;
            case CompOp.LEqual:
                return gl.LEQUAL;
            case CompOp.Greater:
                return gl.GREATER;
            case CompOp.NotEqual:
                return gl.NOTEQUAL;
            case CompOp.GEqual:
                return gl.GEQUAL;
            case CompOp.Always:
                return gl.ALWAYS;
            default:
                return gl.ALWAYS;
        }
    }

    private static stencilOp2gl(stencilOp: StencilOp, gl: WebGL2RenderingContext): number {
        switch (stencilOp) {
            case StencilOp.Keep:
                return gl.KEEP;
            case StencilOp.Zero:
                return gl.ZERO;
            case StencilOp.Replace:
                return gl.REPLACE;
            case StencilOp.IncrSat:
                return gl.INCR;
            case StencilOp.IncrWrap:
                return gl.INCR_WRAP;
            case StencilOp.DecrSat:
                return gl.DECR;
            case StencilOp.DecrWrap:
                return gl.DECR_WRAP;
            case StencilOp.Invert:
                return gl.INVERT;
            default:
                return gl.KEEP;
        }
    }

    private static zTestOp2gl(zTestOp: ZTestOp, gl: WebGL2RenderingContext): number {
        switch (zTestOp) {
            case ZTestOp.Less:
                return gl.LESS;
            case ZTestOp.Equal:
                return gl.EQUAL;
            case ZTestOp.LEqual:
                return gl.LEQUAL;
            case ZTestOp.Greater:
                return gl.GREATER;
            case ZTestOp.NotEqual:
                return gl.NOTEQUAL;
            case ZTestOp.GEqual:
                return gl.GEQUAL;
            case ZTestOp.Always:
                return gl.ALWAYS;
            default:
                return gl.ALWAYS;
        }
    }

    private setRenderStates(renderStates: IRenderState): void {
        if (renderStates.Blend) {
            const blend = renderStates.Blend.targets.get(-1);
            if (blend && blend.enabled) {
                this._gl.enable(this._gl.BLEND);
                if (blend.sfactorA === undefined || blend.dfactorA === undefined) {
                    this._gl.blendFunc(
                        Engine.factor2gl(blend.sfactor, this._gl),
                        Engine.factor2gl(blend.dfactor, this._gl)
                    );
                } else {
                    this._gl.blendFuncSeparate(
                        Engine.factor2gl(blend.sfactor, this._gl),
                        Engine.factor2gl(blend.dfactor, this._gl),
                        Engine.factor2gl(blend.sfactorA, this._gl),
                        Engine.factor2gl(blend.dfactorA, this._gl)
                    );
                }
            } else {
                this._gl.disable(this._gl.BLEND);
            }
            if (renderStates.Blend.op) {
                this._gl.blendEquation(Engine.blendOp2gl(renderStates.Blend.op, this._gl));
            }
        } else {
            this._gl.disable(this._gl.BLEND);
        }
        if (renderStates.Cull) {
            if (renderStates.Cull.enabled === false) {
                this._gl.disable(this._gl.CULL_FACE);
            }
            if (renderStates.Cull.mode) {
                this._gl.cullFace(Engine.cullState2gl(renderStates.Cull.mode, this._gl));
            } else {
                this._gl.cullFace(this._gl.BACK);
            }
        } else {
            this._gl.enable(this._gl.CULL_FACE);
            this._gl.cullFace(this._gl.BACK);
        }
        if (renderStates.Stencil && renderStates.Stencil.enabled) {
            this._gl.enable(this._gl.STENCIL_TEST);
            const writeMask = renderStates.Stencil.WriteMask || 0xff;
            const readMask = renderStates.Stencil.ReadMask || 0xff;
            const ref = renderStates.Stencil.Ref || 0;
            const comp = Engine.compOp2gl(renderStates.Stencil.Comp || CompOp.Always, this._gl);
            const pass = Engine.stencilOp2gl(renderStates.Stencil.Pass || StencilOp.Keep, this._gl);
            const sfail = Engine.stencilOp2gl(renderStates.Stencil.Fail || StencilOp.Keep, this._gl);
            const dpfail = Engine.stencilOp2gl(renderStates.Stencil.ZFail || StencilOp.Keep, this._gl);
            this._gl.stencilFunc(comp, ref, readMask);
            this._gl.stencilMask(writeMask);
            this._gl.stencilOp(sfail, dpfail, pass);

        } else {
            this._gl.disable(this._gl.STENCIL_TEST);
        }
        if (renderStates.ZClip === false) {
            this._gl.disable(this._gl.DEPTH_TEST);
        } else {
            this._gl.enable(this._gl.DEPTH_TEST);
        }
        if (renderStates.ZTest) {
            this._gl.depthFunc(Engine.zTestOp2gl(renderStates.ZTest, this._gl));
        }
        if (renderStates.ZWrite) {
            this._gl.depthMask(renderStates.ZWrite);
        }
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
                    textureIndex++;
                    break;
                case PropertyType.Cube:
                    this._gl.activeTexture(this._gl.TEXTURE0 + textureIndex);
                    this._gl.bindTexture(this._gl.TEXTURE_CUBE_MAP, uniform.value as WebGLTexture);
                    this._gl.uniform1i(location, textureIndex);
                    textureIndex++;
                    break;
                default:
                    throw new Error("Unknown uniform type");
            }
        }
    }

    private renderer(renderer3d: Renderer3D, viewMatrix: mat4, projectionMatrix: mat4, backgroundTexture: WebGLTexture | null) {
        const renderInfo = renderer3d.renderInfo;
        const mesh = renderer3d.mesh;
        const uniforms = renderInfo.uniforms;
        const renderCommands = renderInfo.commands;
        const modelMatrix = renderer3d.modelMatrix;
        for (const command of renderCommands) {
            this.setRenderStates(command.renderStates);
            this._gl.useProgram(command.program);

            // set uniforms
            const a_model = this._gl.getUniformLocation(command.program, "a_model");
            if (a_model) {
                this._gl.uniformMatrix4fv(a_model, false, modelMatrix);
            }
            const a_view = this._gl.getUniformLocation(command.program, "a_view");
            if (a_view) {
                this._gl.uniformMatrix4fv(a_view, false, viewMatrix);
            }
            const a_projection = this._gl.getUniformLocation(command.program, "a_projection");
            if (a_projection) {
                this._gl.uniformMatrix4fv(a_projection, false, projectionMatrix);
            }
            if (backgroundTexture) {
                const a_skybox = this._gl.getUniformLocation(command.program, "a_skybox");
                if (a_skybox) {
                    this._gl.activeTexture(this._gl.TEXTURE0);
                    this._gl.bindTexture(this._gl.TEXTURE_CUBE_MAP, backgroundTexture);
                    this._gl.uniform1i(location, 0);
                }
            }
            this.setUniforms(uniforms, command.uniformLocations);
            this._gl.bindVertexArray(command.vao);
            if (renderer3d.ebo) {
                this._gl.drawElements(mesh.mode, mesh.count, mesh.type, mesh.offset);
            } else {
                this._gl.drawArrays(mesh.mode, mesh.first, mesh.count);
            }
        }

    }

    private update(): void {
        const viewMatrix = this.camera.viewMatrix;
        const projectionMatrix = this.camera.projectionMatrix;
        const skybox = this.camera.backgroundTexture;
        this._gl.clearColor(this.camera.backgroundColor[0], this.camera.backgroundColor[1], this.camera.backgroundColor[2], this.camera.backgroundColor[3]);
        this._gl.clear(this._gl.COLOR_BUFFER_BIT | this._gl.DEPTH_BUFFER_BIT | this._gl.STENCIL_BUFFER_BIT);
        if(skybox){
            this.renderer(this._camera.skyBoxRenderer, viewMatrix, projectionMatrix, skybox);
        }
        this.renderer(this._renderer, viewMatrix, projectionMatrix, skybox);
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