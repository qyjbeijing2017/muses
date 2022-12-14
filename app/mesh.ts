import { vec2, vec3 } from "gl-matrix";

export interface IAttributes {
    [key: string]: {
        data: ArrayBuffer;
        type: number;
        size: 1 | 2 | 3 | 4;
    }
}

export interface IMeshOptions {
    attributes: IAttributes;
    indices?: Uint16Array;
}


export class Mesh {
    private _attributes: IAttributes;
    private _indices: Uint16Array | null = null;
    constructor(options: IMeshOptions) {
        this._attributes = options.attributes;
        if (options.indices) {
            this._indices = options.indices;
        }
    }

    get attributes(): IAttributes {
        return this._attributes;
    }

    get indices(): Uint16Array | null {
        return this._indices;
    }

    createVAO(gl: WebGL2RenderingContext, program: WebGLProgram, vbo: WebGLBuffer) {
        const vao = gl.createVertexArray()!;
        gl.bindVertexArray(vao);
        gl.bindBuffer(gl.ARRAY_BUFFER, vbo);
        let offset = 0;
        for (const key in this.attributes) {
            const attribute = this.attributes[key];
            const index = gl.getAttribLocation(program, key);
            if (index >= 0) {
                gl.vertexAttribPointer(index, attribute.size, attribute.type, false, 0, offset);
                gl.enableVertexAttribArray(index);
            }
            offset += attribute.data.byteLength;
        }
        return vao;
    }

    createVBO(gl: WebGL2RenderingContext) {
        const vbo = gl.createBuffer()!;
        gl.bindBuffer(gl.ARRAY_BUFFER, vbo);
        const bufferLength = Object.keys(this.attributes).reduce((prev, key) => {
            return prev + this.attributes[key].data.byteLength;
        }, 0);
        gl.bufferData(gl.ARRAY_BUFFER, bufferLength, gl.STATIC_DRAW);

        let offset = 0;
        for (const key in this.attributes) {
            const attribute = this.attributes[key];
            gl.bufferSubData(gl.ARRAY_BUFFER, offset, attribute.data);
            offset += attribute.data.byteLength;
        }
        gl.bindBuffer(gl.ARRAY_BUFFER, null);
        return vbo;
    }

    calculateTangents(gl: WebGL2RenderingContext, positionsKey: string = "a_position", texCoordsKey: string = "a_texCoord", tangentsKey: string = "a_tangent"): void {
        const positions = new Float32Array(this.attributes[positionsKey].data);
        const texCoords = new Float32Array(this.attributes[texCoordsKey].data);
        const tangents = new Float32Array(positions.length);
        const indices = this.indices;
        if (indices) {
            for (let i = 0; i < indices.length; i += 3) {
                const i0 = indices[i];
                const i1 = indices[i + 1];
                const i2 = indices[i + 2];

                const p0 = vec3.fromValues(positions[i0 * 3], positions[i0 * 3 + 1], positions[i0 * 3 + 2]);
                const p1 = vec3.fromValues(positions[i1 * 3], positions[i1 * 3 + 1], positions[i1 * 3 + 2]);
                const p2 = vec3.fromValues(positions[i2 * 3], positions[i2 * 3 + 1], positions[i2 * 3 + 2]);

                const uv0 = vec2.fromValues(texCoords[i0 * 2], texCoords[i0 * 2 + 1]);
                const uv1 = vec2.fromValues(texCoords[i1 * 2], texCoords[i1 * 2 + 1]);
                const uv2 = vec2.fromValues(texCoords[i2 * 2], texCoords[i2 * 2 + 1]);

                const deltaPos1 = vec3.sub(vec3.create(), p1, p0);
                const deltaPos2 = vec3.sub(vec3.create(), p2, p0);

                const deltaUV1 = vec2.sub(vec2.create(), uv1, uv0);
                const deltaUV2 = vec2.sub(vec2.create(), uv2, uv0);

                const r = 1.0 / (deltaUV1[0] * deltaUV2[1] - deltaUV1[1] * deltaUV2[0]);
                const tangent = vec3.scale(vec3.create(), vec3.sub(vec3.create(), vec3.scale(vec3.create(), deltaPos1, deltaUV2[1]), vec3.scale(vec3.create(), deltaPos2, deltaUV1[1])), r);

                const i0t = i0 * 3;
                const i1t = i1 * 3;
                const i2t = i2 * 3;
                tangents[i0t] += tangent[0];
                tangents[i0t + 1] += tangent[1];
                tangents[i0t + 2] += tangent[2];
                tangents[i1t] += tangent[0];
                tangents[i1t + 1] += tangent[1];
                tangents[i1t + 2] += tangent[2];
                tangents[i2t] += tangent[0];
                tangents[i2t + 1] += tangent[1];
                tangents[i2t + 2] += tangent[2];

            }
        } else {
            for (let i = 0; i < positions.length; i += 9) {
                const p0 = vec3.fromValues(positions[i], positions[i + 1], positions[i + 2]);
                const p1 = vec3.fromValues(positions[i + 3], positions[i + 4], positions[i + 5]);
                const p2 = vec3.fromValues(positions[i + 6], positions[i + 7], positions[i + 8]);

                const uv0 = vec2.fromValues(texCoords[i], texCoords[i + 1]);
                const uv1 = vec2.fromValues(texCoords[i + 2], texCoords[i + 3]);
                const uv2 = vec2.fromValues(texCoords[i + 4], texCoords[i + 5]);

                const deltaPos1 = vec3.sub(vec3.create(), p1, p0);
                const deltaPos2 = vec3.sub(vec3.create(), p2, p0);

                const deltaUV1 = vec2.sub(vec2.create(), uv1, uv0);
                const deltaUV2 = vec2.sub(vec2.create(), uv2, uv0);

                const r = 1.0 / (deltaUV1[0] * deltaUV2[1] - deltaUV1[1] * deltaUV2[0]);
                const tangent = vec3.scale(vec3.create(), vec3.sub(vec3.create(), vec3.scale(vec3.create(), deltaPos1, deltaUV2[1]), vec3.scale(vec3.create(), deltaPos2, deltaUV1[1])), r);

                tangents[i] = tangent[0];
                tangents[i + 1] = tangent[1];
                tangents[i + 2] = tangent[2];
                tangents[i + 3] = tangent[0];
                tangents[i + 4] = tangent[1];
                tangents[i + 5] = tangent[2];
                tangents[i + 6] = tangent[0];
                tangents[i + 7] = tangent[1];
                tangents[i + 8] = tangent[2];
            }
        }
        this.attributes[tangentsKey] = {
            size: 3,
            type: gl.FLOAT,
            data: tangents
        };
    }
}
