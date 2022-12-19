import { Mesh } from "./mesh";
import { Material } from "./material";
import { generateCode, glslCompiler, Muses, PropertyType } from "../src";
import { IProperty } from "../src/properties/properties";
import { IRenderState } from "../src/renderstate/renderstate";
import { muses_define } from "./muses-define";
import { mat4 } from "gl-matrix";

export interface IUniform {
    type: PropertyType;
    value: number | [number, number, number, number] | WebGLTexture;
    property: IProperty;
}

export interface IUniforms {
    [key: string]: IUniform;
}

export interface IUniformLocations {
    [key: string]: WebGLUniformLocation;
}

export interface IRenderCommand {
    program: WebGLProgram;
    vao: WebGLVertexArrayObject;
    renderStates: IRenderState;
    uniformLocations: IUniformLocations;
}

export interface IRenderInfo {
    uniforms: IUniforms,
    commands: IRenderCommand[]
}

export class Renderer3D {
    private _transform: {
        position: [number, number, number],
        euler: [number, number, number],
        scale: [number, number, number],
    } = {
        position: [0, 0, 0],
        euler: [0, 0, 0],
        scale: [1, 1, 1],
    }
    private _gl: WebGL2RenderingContext;
    private _material: Material | null = null;
    private _mesh: Mesh;
    private _muses?: Muses;
    private _vbo: WebGLBuffer;
    private _ebo: WebGLBuffer | null;
    private _renderInfo: IRenderInfo = {
        uniforms: {},
        commands: []
    }

    get modelMatrix(): mat4 {
        const matrix = mat4.create();
        mat4.translate(matrix, matrix, this._transform.position);
        mat4.rotateX(matrix, matrix, this._transform.euler[0]);
        mat4.rotateY(matrix, matrix, this._transform.euler[1]);
        mat4.rotateZ(matrix, matrix, this._transform.euler[2]);
        mat4.scale(matrix, matrix, this._transform.scale);
        return matrix;
    }

    constructor(gl: WebGL2RenderingContext, mesh: Mesh) {
        console.log("Renderer3D constructor");
        this._gl = gl;
        this._mesh = mesh;
        this._vbo = this._mesh.createVBO(gl);
        this._ebo = this._mesh.createEBO(gl);
    }

    private async createRenderInfo(muses: Muses) {
        const renderInfo: IRenderInfo = {
            uniforms: {},
            commands: []
        };
        const uniforms = await this.initUnifroms(muses);
        const commands = this.createCommands(muses, uniforms);
        renderInfo.uniforms = uniforms;
        renderInfo.commands = commands;
        return renderInfo;
    }

    private createCommands(muse: Muses, unifroms: IUniforms) {
        const commands: IRenderCommand[] = [];
        for (let i = 0; i < muse.subShaders.length; i++) {
            commands.length = 0;
            const subShader = muse.subShaders[i];
            try {
                for (let j = 0; j < subShader.passes.length; j++) {
                    const pass = subShader.passes[j];
                    if (!pass.code) {
                        continue;
                    }
                    const code = pass.code;
                    const ast = code.parseToAst({
                        properties: muse.properties,
                        instance: false,
                        defines: {
                            PI: Math.PI,
                        },
                        includes: {
                            glsl: glslCompiler,
                            muses_define: muses_define,
                        },
                    });
                    console.log(ast)
                    const vsSource = generateCode(ast.vertex);
                    console.log(`load vertex shader: \n${vsSource}`);
                    const fsSource = generateCode(ast.fragment);
                    console.log(`load fragment shader: \n${fsSource}`);
                    const program = Renderer3D.initShaderProgram(this._gl, vsSource, fsSource);
                    const vao = this.mesh.createVAO(this.gl, program, this._vbo);
                    const uniformLocations = this.initUniformLocations(program, unifroms);
                    commands.push({
                        program,
                        vao,
                        renderStates: pass.renderStates,
                        uniformLocations
                    });
                }
                break;
            } catch (e) {
                console.warn(e);
            }
        }
        return commands;
    }

    private async initUnifroms(muses: Muses) {
        const uniform: IUniforms = {};
        const properties = muses.properties;
        for (let i = 0; i < properties.length; i++) {
            const property = properties[i];
            let value: number | [number, number, number, number] | WebGLTexture = property.value;
            switch (property.type) {
                case PropertyType.Cube:
                    const cubeData = await fetch(property.value as string).then(res => res.blob());
                    const cubeElement = document.createElement('img');
                    cubeElement.src = URL.createObjectURL(cubeData);
                    await new Promise<void>((resolve) => {
                        cubeElement.onload = () => {
                            resolve();
                        };
                    });
                    value = Renderer3D.createCubeTexture(this.gl, cubeElement);
                    break;
                case PropertyType.TwoD:
                    const textureData = await fetch(property.value as string).then(res => res.blob());
                    const textureElement = document.createElement('img');
                    textureElement.src = URL.createObjectURL(textureData);
                    await new Promise<void>((resolve) => {
                        textureElement.onload = () => {
                            resolve();
                        };
                    });
                    value = Renderer3D.createTexture(this.gl, textureElement);
                    break;
                default:
                    break;
            }
            uniform[property.name] = {
                type: property.type,
                value: value,
                property,
            };
        }
        return uniform;
    }

    private initUniformLocations(program: WebGLProgram, uniforms: IUniforms) {
        const uniformLocations: { [key: string]: WebGLUniformLocation } = {};
        for (const key in uniforms) {
            const uniform = uniforms[key];
            const location = this.gl.getUniformLocation(program, key);
            if (location) {
                uniformLocations[key] = location;
            }
        }
        return uniformLocations;
    }

    setFloat(name: string, value: number) {
        const uniform = this._renderInfo.uniforms[name];
        if (uniform && (uniform.type === PropertyType.Float || uniform.type === PropertyType.Range)) {
            uniform.value = value;
        } else {
            throw new Error(`uniform ${name} not found`);
        }
    }

    setInt(name: string, value: number) {
        const uniform = this._renderInfo.uniforms[name];
        if (uniform && uniform.type === PropertyType.Int) {
            uniform.value = value;
        } else {
            throw new Error(`uniform ${name} not found`);
        }
    }

    setVector(name: string, value: [number, number, number, number]) {
        const uniform = this._renderInfo.uniforms[name];
        if (uniform && uniform.type === PropertyType.Vector) {
            uniform.value = value;
        } else {
            throw new Error(`uniform ${name} not found`);
        }
    }

    async setTexture(name: string, value: string) {
        const uniform = this._renderInfo.uniforms[name];
        if (uniform) {
            switch (uniform.type) {
                case PropertyType.Cube:
                    const cubeData = await fetch(value).then(res => res.blob());
                    const cubeElement = document.createElement('img');
                    cubeElement.src = URL.createObjectURL(cubeData);
                    await new Promise<void>((resolve) => {
                        cubeElement.onload = () => {
                            resolve();
                        };
                    });
                    uniform.value = Renderer3D.createCubeTexture(this.gl, cubeElement);
                    break;
                case PropertyType.TwoD:
                    const textureData = await fetch(value).then(res => res.blob());
                    const textureElement = document.createElement('img');
                    textureElement.src = URL.createObjectURL(textureData);
                    await new Promise<void>((resolve) => {
                        textureElement.onload = () => {
                            resolve();
                        };
                    });
                    uniform.value = Renderer3D.createTexture(this.gl, textureElement);
                    break;
                default:
                    throw new Error(`uniform ${name} type error`);
            }
        } else {
            throw new Error(`uniform ${name} not found`);
        }
    }

    private async materialListener(muses: Muses) {
        this._renderInfo = await this.createRenderInfo(muses);
        this._muses = muses;
    }

    set material(value: Material | null) {
        if (!value) {
            this._renderInfo = {
                commands: [],
                uniforms: {},
            }
            this._material = null;
            return;
        }
        value.addListener('ready', this.materialListener.bind(this));
        this._material = value;
        this._material.init();
    }

    set mesh(value: Mesh) {
        this._mesh = value;
        this._vbo = this._mesh.createVBO(this.gl);
        new Promise<void>((resolve) => {
            if (this._muses) {
                const command = this.createCommands(this._muses, this._renderInfo.uniforms);
                this._renderInfo.commands = command;
            }
            resolve();
        });
    }

    get gl() {
        return this._gl;
    }

    get material() {
        return this._material;
    }

    get mesh() {
        return this._mesh;
    }

    get muses() {
        return this._muses || null;
    }

    get renderInfo() {
        return this._renderInfo;
    }

    get ebo() {
        return this._ebo;
    }

    // #region shader
    static initShaderProgram(gl: WebGL2RenderingContext, vsSource: string, fsSource: string) {
        const vertexShader = this.loadShader(gl, gl.VERTEX_SHADER, vsSource);
        const fragmentShader = this.loadShader(gl, gl.FRAGMENT_SHADER, fsSource);

        // 创建着色器程序

        const shaderProgram = gl.createProgram()!;
        gl.attachShader(shaderProgram, vertexShader);
        gl.attachShader(shaderProgram, fragmentShader);
        gl.linkProgram(shaderProgram);

        // 创建失败，alert
        if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
            throw new Error('Unable to initialize the shader program: ' + gl.getProgramInfoLog(shaderProgram));
        }

        return shaderProgram;
    }

    //
    // 创建指定类型的着色器，上传 source 源码并编译
    //
    static loadShader(gl: WebGL2RenderingContext, type: number, source: string) {
        const shader = gl.createShader(type)!;

        // Send the source to the shader object

        gl.shaderSource(shader, source);

        // Compile the shader program

        gl.compileShader(shader);

        // See if it compiled successfully

        if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
            const log = gl.getShaderInfoLog(shader)
            gl.deleteShader(shader);
            throw new Error(`An error occurred compiling the ${type === gl.VERTEX_SHADER ? 'vertext' : 'fragment'} shaders: ` + log);
        }

        return shader;
    }


    static createTexture(gl: WebGL2RenderingContext, image: HTMLImageElement) {
        const texture = gl.createTexture()!;
        gl.bindTexture(gl.TEXTURE_2D, texture);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
        gl.generateMipmap(gl.TEXTURE_2D);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);
        return texture;
    }
    static createCubeTexture(gl: WebGL2RenderingContext, image: HTMLImageElement) {
        const texture = gl.createTexture()!;
        const canvas = document.createElement("canvas");
        canvas.width = image.width;
        canvas.height = image.height;
        const ctx = canvas.getContext("2d")!;
        ctx.drawImage(image, 0, 0);
        const pX = ctx.getImageData(image.width / 4 * 2, image.height / 3, image.width / 4, image.height / 3);
        const nX = ctx.getImageData(0, image.height / 3, image.width / 4, image.height / 3);
        const pY = ctx.getImageData(image.width / 4, 0, image.width / 4, image.height / 3);
        const nY = ctx.getImageData(image.width / 4, image.height / 3 * 2, image.width / 4, image.height / 3);
        const pZ = ctx.getImageData(image.width / 4, image.height / 3, image.width / 4, image.height / 3);
        const nZ = ctx.getImageData(image.width / 4 * 3, image.height / 3, image.width / 4, image.height / 3);

        gl.bindTexture(gl.TEXTURE_CUBE_MAP, texture);
        gl.texImage2D(gl.TEXTURE_CUBE_MAP_POSITIVE_X, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, pX);
        gl.texImage2D(gl.TEXTURE_CUBE_MAP_NEGATIVE_X, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, nX);
        gl.texImage2D(gl.TEXTURE_CUBE_MAP_POSITIVE_Y, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, pY);
        gl.texImage2D(gl.TEXTURE_CUBE_MAP_NEGATIVE_Y, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, nY);
        gl.texImage2D(gl.TEXTURE_CUBE_MAP_POSITIVE_Z, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, pZ);
        gl.texImage2D(gl.TEXTURE_CUBE_MAP_NEGATIVE_Z, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, nZ);
        gl.generateMipmap(gl.TEXTURE_CUBE_MAP);
        gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
        gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_S, gl.REPEAT);
        gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_T, gl.REPEAT);
        return texture;
    }
}