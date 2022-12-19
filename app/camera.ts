import { mat4, vec2, vec3, vec4 } from "gl-matrix";
import { Material } from "./material";
import { Mesh } from "./mesh";
import { Renderer3D } from "./renderer3d";
import { skyBoxPosition } from "./skybox";

const skyBoxShader = `
Shader "SkyBox" {
    Properties {
    }
    SubShader {
        Pass {
            // renderstate
            
            Cull Off
            ZWrite Off

            // glsl        
            GLSLPROGRAM
            #pragma vertex vert
            #pragma fragment frag
            #include "glsl"
            #include "muses_define"

            varying vec2 v_texcoord;

            void vert() {
                v_texcoord = a_texcoord;
                gl_Position = a_projection * a_view * vec4(a_position, 1.0) * 0.9;
            }
            
            void frag() {
                gl_FragColor = textureCube(skybox, TexCoords);
            }

            ENDGLSL
        }
    }

    FallBack "Diffuse"
}
`

export class Camera{
    private _postion: vec3 = vec3.fromValues(4, 4, 6);
    private _fov = 45;
    private _near = 0.1;
    private _far = 100;

    private _backgroundColor = vec4.fromValues(0.2, 0.3, 0.3, 1);
    private _backgroundTexture: WebGLTexture | null = null;
    private _skyBoxRenderer: Renderer3D;

    private async loadTexture(url: string) {
        const skyboxSrc = await fetch(url);
        const skyboxImage = await skyboxSrc.blob();
        const skyboxElement = document.createElement("img");
        skyboxElement.src = URL.createObjectURL(skyboxImage);
        skyboxElement.onload = () => {
            this._backgroundTexture = Renderer3D.createCubeTexture(this._gl, skyboxElement);
        };

    }

    get backgroundColor() {
        return this._backgroundColor;
    }

    get backgroundTexture() {
        return this._backgroundTexture;
    }

    get skyBoxRenderer() {
        return this._skyBoxRenderer;
    }

    set background(value: vec4 | string) {
        if (typeof value === "string") {
            this.loadTexture(value);
        } else {
            this._backgroundColor = value;
            this._backgroundTexture = null;
        }
    }

    rangeR = vec2.fromValues(2, 30);
    rangeTheta = vec2.fromValues(15 * Math.PI / 180, 165 * Math.PI / 180);
    rangePhi = vec2.fromValues(0, Math.PI * 2);

    constructor(private readonly _container: HTMLCanvasElement, private readonly _gl: WebGL2RenderingContext){
        const mesh = new Mesh({
            attributes:{
                a_position: {
                    data: Float32Array.from(skyBoxPosition),
                    size: 3,
                    type: this._gl.FLOAT,
                    normalized: false,
                },
            }
        });
        this._skyBoxRenderer = new Renderer3D(_gl, mesh);
        this._skyBoxRenderer.material = new Material(skyBoxShader);
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