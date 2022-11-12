import { mat4, vec2, vec3, vec4 } from 'gl-matrix';
import React, { useEffect, useRef, useState } from 'react';
import { MusesPropertyType, MusesRenderStates, MusesVM, MusesMaterial, MusesLightType } from '../src';
import { Layout, Divider, Form, Input, Button, Popover, InputNumber, Row, Slider, Col } from 'antd';
import './App.css';
import EventEmitter from 'events';
import { SketchPicker } from 'react-color';
import { IMusesLight } from '../src/vm/light';
import { IMusesUniform } from '../src/vm/material';
const { Header, Content, Footer, Sider } = Layout;

// #region shader

function initShaderProgram(gl: WebGL2RenderingContext, vsSource: string, fsSource: string) {
    const vertexShader = loadShader(gl, gl.VERTEX_SHADER, vsSource);
    const fragmentShader = loadShader(gl, gl.FRAGMENT_SHADER, fsSource);

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
function loadShader(gl: WebGL2RenderingContext, type: number, source: string) {
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

// #endregion

// #region objects

const cubeBuffer = [
    // Front face
    -1.0, -1.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0,
    1.0, -1.0, 1.0, 0.0, 0.0, 1.0, 1.0, 0.0, 1.0, 0.0, 0.0,
    1.0, 1.0, 1.0, 0.0, 0.0, 1.0, 1.0, 1.0, 1.0, 0.0, 0.0,
    1.0, 1.0, 1.0, 0.0, 0.0, 1.0, 1.0, 1.0, 1.0, 0.0, 0.0,
    -1.0, 1.0, 1.0, 0.0, 0.0, 1.0, 0.0, 1.0, 1.0, 0.0, 0.0,
    -1.0, -1.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0,

    // Back face
    -1.0, -1.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0,
    -1.0, 1.0, -1.0, 0.0, 0.0, -1.0, 0.0, 1.0, -1.0, 0.0, 0.0,
    1.0, 1.0, -1.0, 0.0, 0.0, -1.0, 1.0, 1.0, -1.0, 0.0, 0.0,
    1.0, 1.0, -1.0, 0.0, 0.0, -1.0, 1.0, 1.0, -1.0, 0.0, 0.0,
    1.0, -1.0, -1.0, 0.0, 0.0, -1.0, 1.0, 0.0, -1.0, 0.0, 0.0,
    -1.0, -1.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0,

    // Top face
    -1.0, 1.0, -1.0, 0.0, 1.0, 0.0, 0.0, 0.0, 0.0, 1.0, 0.0,
    -1.0, 1.0, 1.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 1.0, 0.0,
    1.0, 1.0, 1.0, 0.0, 1.0, 0.0, 1.0, 1.0, 0.0, 1.0, 0.0,
    1.0, 1.0, 1.0, 0.0, 1.0, 0.0, 1.0, 1.0, 0.0, 1.0, 0.0,
    1.0, 1.0, -1.0, 0.0, 1.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0,
    -1.0, 1.0, -1.0, 0.0, 1.0, 0.0, 0.0, 0.0, 0.0, 1.0, 0.0,

    // Bottom face
    -1.0, -1.0, -1.0, 0.0, -1.0, 0.0, 0.0, 0.0, 0.0, -1.0, 0.0,
    1.0, -1.0, -1.0, 0.0, -1.0, 0.0, 1.0, 0.0, 0.0, -1.0, 0.0,
    1.0, -1.0, 1.0, 0.0, -1.0, 0.0, 1.0, 1.0, 0.0, -1.0, 0.0,
    1.0, -1.0, 1.0, 0.0, -1.0, 0.0, 1.0, 1.0, 0.0, -1.0, 0.0,
    -1.0, -1.0, 1.0, 0.0, -1.0, 0.0, 0.0, 1.0, 0.0, -1.0, 0.0,
    -1.0, -1.0, -1.0, 0.0, -1.0, 0.0, 0.0, 0.0, 0.0, -1.0, 0.0,

    // Right face
    1.0, -1.0, -1.0, 1.0, 0.0, 0.0, 0.0, 0.0, 1.0, 0.0, 0.0,
    1.0, 1.0, -1.0, 1.0, 0.0, 0.0, 0.0, 1.0, 1.0, 0.0, 0.0,
    1.0, 1.0, 1.0, 1.0, 0.0, 0.0, 1.0, 1.0, 1.0, 0.0, 0.0,
    1.0, 1.0, 1.0, 1.0, 0.0, 0.0, 1.0, 1.0, 1.0, 0.0, 0.0,
    1.0, -1.0, 1.0, 1.0, 0.0, 0.0, 1.0, 0.0, 1.0, 0.0, 0.0,
    1.0, -1.0, -1.0, 1.0, 0.0, 0.0, 0.0, 0.0, 1.0, 0.0, 0.0,

    // Left face
    -1.0, -1.0, -1.0, -1.0, 0.0, 0.0, 0.0, 0.0, -1.0, 0.0, 0.0,
    -1.0, -1.0, 1.0, -1.0, 0.0, 0.0, 1.0, 0.0, -1.0, 0.0, 0.0,
    -1.0, 1.0, 1.0, -1.0, 0.0, 0.0, 1.0, 1.0, -1.0, 0.0, 0.0,
    -1.0, 1.0, 1.0, -1.0, 0.0, 0.0, 1.0, 1.0, -1.0, 0.0, 0.0,
    -1.0, 1.0, -1.0, -1.0, 0.0, 0.0, 0.0, 1.0, -1.0, 0.0, 0.0,
    -1.0, -1.0, -1.0, -1.0, 0.0, 0.0, 0.0, 0.0, -1.0, 0.0, 0.0,
];

const cubeBuffer1 = [
    -1.0, -1.0, 1.0,   //v0
    -1.0, -1.0, 1.0,   //n0
    0.0, 0.0,           //t0
    0.0, 0.0, 0.0,      //tangent0

    1.0, -1.0, 1.0,    //v1
    1.0, -1.0, 1.0,    //n1
    1.0, 0.0,          //t1
    0.0, 0.0, 0.0,     //tangent1

    1.0, 1.0, 1.0,     //v2
    1.0, 1.0, 1.0,     //n2
    1.0, 1.0,          //t2
    0.0, 0.0, 0.0,     //tangent2

    -1.0, 1.0, 1.0,     //v3
    -1.0, 1.0, 1.0,     //n3
    0.0, 1.0,           //t3
    0.0, 0.0, 0.0,      //tangent3

    -1.0, -1.0, -1.0,   //v4
    -1.0, -1.0, -1.0,   //n4
    0.0, 0.0,           //t4
    0.0, 0.0, 0.0,      //tangent4

    1.0, -1.0, -1.0,    //v5
    1.0, -1.0, -1.0,    //n5
    1.0, 0.0,           //t5
    0.0, 0.0, 0.0,      //tangent5

    1.0, 1.0, -1.0,     //v6
    1.0, 1.0, -1.0,     //n6
    1.0, 1.0,           //t6
    0.0, 0.0, 0.0,      //tangent6

    -1.0, 1.0, -1.0,    //v7
    -1.0, 1.0, -1.0,    //n7
    0.0, 1.0,           //t7
    0.0, 0.0, 0.0,      //tangent7

]

const cubeIndex = [
    0, 1, 2, 0, 2, 3,    // front
    4, 6, 5, 4, 7, 6,    // back
    4, 5, 1, 4, 1, 0,    // left
    3, 2, 6, 3, 6, 7,    // right
    1, 5, 6, 1, 6, 2,    // top
    4, 0, 3, 4, 3, 7     // bottom
];

const skyBoxCube = [
    // positions            // normals         // texture Coords    //tangent

    // Font face
    -1.0, 1.0, -1.0, 0.0, 0.0, 1.0, 0.0, 1.0, 1.0, 0.0, 0.0,  // left-top-front
    -1.0, -1.0, -1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0,  // left-bottom-front
    1.0, -1.0, -1.0, 0.0, 0.0, 1.0, 1.0, 0.0, 1.0, 0.0, 0.0,  // right-bottom-front
    1.0, -1.0, -1.0, 0.0, 0.0, 1.0, 1.0, 0.0, 1.0, 0.0, 0.0,  // right-bottom-front
    1.0, 1.0, -1.0, 0.0, 0.0, 1.0, 1.0, 1.0, 1.0, 0.0, 0.0,  // right-top-front
    -1.0, 1.0, -1.0, 0.0, 0.0, 1.0, 0.0, 1.0, 1.0, 0.0, 0.0,  // left-top-front

    // Left face
    -1.0, -1.0, 1.0, 1.0, 0.0, 0.0, 0.0, 0.0, -1.0, 0.0, 0.0, // left-bottom-left
    -1.0, -1.0, -1.0, 1.0, 0.0, 0.0, 1.0, 0.0, -1.0, 0.0, 0.0, // right-bottom-left
    -1.0, 1.0, -1.0, 1.0, 0.0, 0.0, 1.0, 1.0, -1.0, 0.0, 0.0, // right-top-left
    -1.0, 1.0, -1.0, 1.0, 0.0, 0.0, 1.0, 1.0, -1.0, 0.0, 0.0, // right-top-left
    -1.0, 1.0, 1.0, 1.0, 0.0, 0.0, 0.0, 1.0, -1.0, 0.0, 0.0, // left-top-left
    -1.0, -1.0, 1.0, 1.0, 0.0, 0.0, 0.0, 0.0, -1.0, 0.0, 0.0, // left-bottom-left

    // Right face
    1.0, -1.0, -1.0, -1.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, -1.0, // left-bottom-right
    1.0, -1.0, 1.0, -1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 0.0, -1.0, // right-bottom-right
    1.0, 1.0, 1.0, -1.0, 0.0, 0.0, 1.0, 1.0, 0.0, 0.0, -1.0, // right-top-right
    1.0, 1.0, 1.0, -1.0, 0.0, 0.0, 1.0, 1.0, 0.0, 0.0, -1.0, // right-top-right
    1.0, 1.0, -1.0, -1.0, 0.0, 0.0, 0.0, 1.0, 0.0, 0.0, -1.0, // left-top-right
    1.0, -1.0, -1.0, -1.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, -1.0, // left-bottom-right

    // Back face
    -1.0, -1.0, 1.0, 0.0, 0.0, 1.0, 1.0, 0.0, 0.0, 0.0, 1.0, // right-bottom-back
    -1.0, 1.0, 1.0, 0.0, 0.0, 1.0, 1.0, 1.0, 0.0, 0.0, 1.0, // right-top-back
    1.0, 1.0, 1.0, 0.0, 0.0, 1.0, 0.0, 1.0, 0.0, 0.0, 1.0, // left-top-back
    1.0, 1.0, 1.0, 0.0, 0.0, 1.0, 0.0, 1.0, 0.0, 0.0, 1.0, // left-top-back
    1.0, -1.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 0.0, 0.0, 1.0, // left-bottom-back
    -1.0, -1.0, 1.0, 0.0, 0.0, 1.0, 1.0, 0.0, 0.0, 0.0, 1.0, // right-bottom-back

    // Top face
    -1.0, 1.0, -1.0, 0.0, -1.0, 0.0, 0.0, 0.0, 0.0, -1.0, 0.0, // left-buttom-top
    1.0, 1.0, -1.0, 0.0, -1.0, 0.0, 1.0, 0.0, 0.0, -1.0, 0.0, // right-buttom-top
    1.0, 1.0, 1.0, 0.0, -1.0, 0.0, 1.0, 1.0, 0.0, -1.0, 0.0, // right-top-top
    1.0, 1.0, 1.0, 0.0, -1.0, 0.0, 1.0, 1.0, 0.0, -1.0, 0.0, // right-top-top
    -1.0, 1.0, 1.0, 0.0, -1.0, 0.0, 0.0, 1.0, 0.0, -1.0, 0.0, // left-top-top
    -1.0, 1.0, -1.0, 0.0, -1.0, 0.0, 0.0, 0.0, 0.0, -1.0, 0.0, // left-buttom-top

    // Buttom face
    -1.0, -1.0, -1.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 1.0, 0.0, // left-top-buttom
    -1.0, -1.0, 1.0, 0.0, 1.0, 0.0, 0.0, 0.0, 0.0, 1.0, 0.0, // left-bottom-buttom
    1.0, -1.0, -1.0, 0.0, 1.0, 0.0, 1.0, 1.0, 0.0, 1.0, 0.0, // right-top-buttom
    1.0, -1.0, -1.0, 0.0, 1.0, 0.0, 1.0, 1.0, 0.0, 1.0, 0.0, // right-top-buttom
    -1.0, -1.0, 1.0, 0.0, 1.0, 0.0, 0.0, 0.0, 0.0, 1.0, 0.0, // left-buttom-buttom
    1.0, -1.0, 1.0, 0.0, 1.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0  // right-buttom-buttom
]

const skyBoxPlain = [
    // Font face
    -1.0, -1.0, 0.0, 0.0, 0.0, 1.0, 0.0, 1.0, 1.0, 0.0, 0.0,  // left-top-front
    1.0, -1.0, 0.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0,  // left-bottom-front
    -1.0, 1.0, 0.0, 0.0, 0.0, 1.0, 1.0, 0.0, 1.0, 0.0, 0.0,  // right-bottom-front
    -1.0, 1.0, 0.0, 0.0, 0.0, 1.0, 1.0, 0.0, 1.0, 0.0, 0.0,  // right-bottom-front
    1.0, -1.0, 0.0, 0.0, 0.0, 1.0, 1.0, 1.0, 1.0, 0.0, 0.0,  // right-top-front
    1.0, 1.0, 0.0, 0.0, 0.0, 1.0, 0.0, 1.0, 1.0, 0.0, 0.0,  // left-top-front
]

//#endregion

// #region vbo
function createVbo(gl: WebGL2RenderingContext, buffer: number[]) {
    const vbo = gl.createBuffer()!;
    gl.bindBuffer(gl.ARRAY_BUFFER, vbo);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(buffer), gl.STATIC_DRAW);
    return vbo;
}
// #endregion

// #region vao
function createVao(gl: WebGL2RenderingContext, vbo: WebGLBuffer, shader: WebGLProgram) {
    const posindex = gl.getAttribLocation(shader, "MUSES_POSITION");
    const normalIndex = gl.getAttribLocation(shader, "MUSES_NORMAL");
    const texcoordIndex = gl.getAttribLocation(shader, "MUSES_TEXCOORD0");
    const tangentIndex = gl.getAttribLocation(shader, "MUSES_TANGENT");
    const vao = gl.createVertexArray()!;
    gl.bindVertexArray(vao);
    gl.bindBuffer(gl.ARRAY_BUFFER, vbo);
    if (posindex >= 0)
        gl.vertexAttribPointer(posindex, 3, gl.FLOAT, false, 11 * 4, 0);
    if (normalIndex >= 0)
        gl.vertexAttribPointer(normalIndex, 3, gl.FLOAT, false, 11 * 4, 3 * 4);
    if (texcoordIndex >= 0)
        gl.vertexAttribPointer(texcoordIndex, 3, gl.FLOAT, false, 11 * 4, 6 * 4);
    if (tangentIndex >= 0)
        gl.vertexAttribPointer(tangentIndex, 3, gl.FLOAT, false, 11 * 4, 8 * 4);

    if (posindex >= 0)
        gl.enableVertexAttribArray(posindex);
    if (normalIndex >= 0)
        gl.enableVertexAttribArray(normalIndex);
    if (texcoordIndex >= 0)
        gl.enableVertexAttribArray(texcoordIndex);
    if (tangentIndex >= 0)
        gl.enableVertexAttribArray(tangentIndex);
    return vao;
}
// #endregion

// #region ebo
function createEbo(gl: WebGL2RenderingContext, buffer: number[]) {
    const ebo = gl.createBuffer()!;
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, ebo);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(buffer), gl.STATIC_DRAW);
    return ebo;
}
// #endregion

// #region texture
function createTexture(gl: WebGL2RenderingContext, image: HTMLImageElement) {
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
function createCubeTexture(gl: WebGL2RenderingContext, image: HTMLImageElement) {
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
// #endregion


interface IRenderObject {
    muses: MusesVM;
    material: MusesMaterial;
    commands: {
        state: MusesRenderStates;
        program: WebGLProgram;
        vao: WebGLVertexArrayObject;
    }[];
}

class Engine extends EventEmitter {
    private gl: WebGL2RenderingContext;
    private _runnig = false;
    private startTime = new Date().getTime();
    get time() {
        return new Date().getTime() - this.startTime;
    }

    objPos = vec3.fromValues(0, 0, 0);
    objEular = vec3.fromValues(0, 0, 0);
    objScale = vec3.fromValues(1, 1, 1);

    cameraPos = vec3.fromValues(4, 4, 6);
    fov = 45;
    near = 0.1;
    far = 100;
    get aspect() {
        return this.gl.canvas.clientWidth / this.gl.canvas.clientHeight;
    }

    get modelMatrix() {
        const m = mat4.create();
        mat4.scale(m, m, this.objScale);
        mat4.rotateZ(m, m, this.objEular[2]);
        mat4.rotateY(m, m, this.objEular[1]);
        mat4.rotateX(m, m, this.objEular[0]);
        mat4.translate(m, m, this.objPos);
        return m;
    }

    get viewMatrix() {
        const m = mat4.create();
        mat4.lookAt(m, this.cameraPos, this.objPos, vec3.fromValues(0, 1, 0));
        return m;
    }

    get perspectiveMatrix() {
        const m = mat4.create();
        mat4.perspective(m, this.fov * Math.PI / 180, this.aspect, this.near, this.far);
        return m;
    }

    get mvpMatrix() {
        const m = mat4.create();
        mat4.multiply(m, this.perspectiveMatrix, this.viewMatrix);
        mat4.multiply(m, m, this.modelMatrix);
        return m;
    }

    get vpdiMatrix() {
        const m = mat4.create();
        const view = this.viewMatrix;
        const viewDirectionMatrix = mat4.fromValues(
            view[0], view[1], view[2], 0,
            view[4], view[5], view[6], 0,
            view[8], view[9], view[10], 0,
            0, 0, 0, 1
        );
        mat4.multiply(m, this.perspectiveMatrix, viewDirectionMatrix);
        mat4.invert(m, m);
        return m;
    }

    private object?: IRenderObject;

    set background(value: vec4) {
        this.gl.clearColor(value[0], value[1], value[2], value[3]);
    }

    private _shaderUrl: string;
    get shaderUrl() {
        return this._shaderUrl;
    }
    set shaderUrl(url: string) {
        this._shaderUrl = url;
        this.loadShader(url);
    }
    set shaderText(text: string) {
        this.loadFromShaderCode(text, this.vbo).then(obj => {
            const old = this.object;
            this.object = obj;
            this.emit('materialChanged', obj.material);
            if (!old) return;
            old.commands.forEach(p => this.gl.deleteProgram(p.program));
            console.log("load shader", "success");
        });
    }
    get shader() {
        return this.object?.muses;
    }

    private skybox?: IRenderObject;
    private _skyBoxVbo: WebGLBuffer;
    private skyBoxTexture: WebGLTexture;
    setSkyBox(url: string) {
        const image = new Image();
        image.src = url;
        image.onload = () => {
            this.skyBoxTexture = createCubeTexture(this.gl, image);
        }
    }

    setSkyBoxShader(url: string) {
        this.loadSkyBoxShader(url);
    }

    async loadSkyBoxShader(url: string) {
        console.log("load skybox shader", url);
        const shader = await fetch(url).then(res => res.text());
        this.loadFromShaderCode(shader, this._skyBoxVbo).then((obj) => {
            const old = this.skybox;
            this.skybox = obj;
            if (!old) return;
            old.commands.forEach(p => this.gl.deleteProgram(p.program));
            console.log("load skybox shader", "success");
        });
    }

    async loadShader(url: string) {
        console.log("load shader", url);
        const code = await fetch(url).then(res => res.text());
        this.loadFromShaderCode(code, this.vbo).then((obj) => {
            const old = this.object;
            this.object = obj;
            this.emit('materialChanged', obj.material);
            if (!old) return;
            old.commands.forEach(p => this.gl.deleteProgram(p.program));
            console.log("load shader", "success");
        });
    }

    async loadFromShaderCode(code: string, vbo: WebGLBuffer) {
        console.log("load shader");
        const muses = new MusesVM(code);
        const commands: { state: MusesRenderStates; program: WebGLProgram; vao: WebGLVertexArrayObject; }[] = [];
        muses.glsl?.passes.forEach((pass, index) => {
            console.log(`pass ${index} shader`);
            console.log(pass.vert);
            console.log(pass.frag);
            console.log(pass.state);
            const program = initShaderProgram(this.gl, pass.vert, pass.frag);
            commands.push({
                state: pass.state,
                program,
                vao: createVao(this.gl, vbo, program),
            });
            console.log("pass", index, "shader loaded");
        });
        const material = muses.createMaterial();
        return {
            muses,
            commands,
            material,
        }
    }

    private vbo: WebGLBuffer;
    private ebo?: WebGLBuffer;
    private vertexcount: number = 0;
    setObject(obj: number[], index?: number[]) {
        if (this.vbo) {
            this.gl.deleteBuffer(this.vbo);
        }
        if (this.ebo) {
            this.gl.deleteBuffer(this.ebo);
        }
        this.vbo = createVbo(this.gl, obj);
        this.vertexcount = obj.length / 8;
        this.ebo = undefined;
        if (index) {
            this.ebo = createEbo(this.gl, index);
            this.vertexcount = index.length;
        } else {
            this.vertexcount = obj.length / 11;
        }
    }

    private setState(state: MusesRenderStates) {
        if (state.zTest < 0) {
            this.gl.disable(this.gl.DEPTH_TEST);
        } else {
            this.gl.enable(this.gl.DEPTH_TEST);
            this.gl.depthFunc(state.zTest);
        }
        if (!state.zWrite) {
            this.gl.depthMask(false);
        } else {
            this.gl.depthMask(true);
        }
        if (state.cull < 0) {
            this.gl.disable(this.gl.CULL_FACE);
        } else {
            this.gl.enable(this.gl.CULL_FACE);
            this.gl.cullFace(state.cull);
        }
        if (state.blend[0] < 0) {
            this.gl.disable(this.gl.BLEND);
        } else {
            this.gl.enable(this.gl.BLEND);
            this.gl.blendFunc(state.blend[0], state.blend[1]);
        }
        if (state.stencil[0] < 0) {
            this.gl.disable(this.gl.STENCIL_TEST);
        } else {
            this.gl.enable(this.gl.STENCIL_TEST);
            this.gl.stencilFunc(state.stencil[0], state.stencil[1], state.stencil[2]);
        }
    }

    private lights: IMusesLight[] = [
        {
            name: 'spot',
            type: MusesLightType.Spot,
            cutoff: Math.cos(20 * Math.PI / 180),
            outerCutoff: Math.cos(22 * Math.PI / 180),
            color: vec3.fromValues(0.3, 0.3, 0.3),
            direction: vec3.fromValues(-1, -1, 0.0),
            position: vec3.fromValues(1.5, 1.5, 0.0),
            constantAttenuation: 1,
            linearAttenuation: 0.09,
            quadraticAttenuation: 0.032,
        },
        {
            name: 'global',
            type: MusesLightType.Directional,
            color: vec3.fromValues(0.3, 0.3, 0.3),
            direction: vec3.fromValues(-1, -1, -1),
        },
        {
            name: 'point',
            type: MusesLightType.Point,
            color: vec3.fromValues(0.3, 0.3, 0.3),
            position: vec3.fromValues(1.5, 1.5, 1.5),
            constantAttenuation: 1,
            linearAttenuation: 0.09,
            quadraticAttenuation: 0.032,
        }
    ];

    private setUniforms(program: WebGLProgram, uniforms: IMusesUniform[]) {
        let textureIndex = 1;
        uniforms.forEach(uniform => {
            const location = this.gl.getUniformLocation(program, uniform.name);
            if (location === null) {
                return;
            }
            switch (uniform.type) {
                case MusesPropertyType.Float:
                    this.gl.uniform1f(location, uniform.value as number);
                    break;
                case MusesPropertyType.Int:
                    this.gl.uniform1i(location, uniform.value as number);
                    break;
                case MusesPropertyType.Color:
                    this.gl.uniform4f(location, uniform.value[0], uniform.value[1], uniform.value[2], uniform.value[3]);
                    break;
                case MusesPropertyType.Range:
                    this.gl.uniform1f(location, uniform.value as number);
                    break;
                case MusesPropertyType.Vector:
                    this.gl.uniform4f(location, uniform.value[0], uniform.value[1], uniform.value[2], uniform.value[3]);
                    break;
                case MusesPropertyType._2D:
                    if (uniform.deprecated) {
                        this.gl.deleteTexture(uniform.deprecated as WebGLTexture);
                        uniform.deprecated = undefined;
                    }
                    if (uniform.texture) {
                        this.gl.activeTexture(this.gl.TEXTURE0 + textureIndex);
                        this.gl.bindTexture(this.gl.TEXTURE_2D, uniform.texture);
                        this.gl.uniform1i(location, textureIndex);
                        textureIndex++;
                    } else {
                        const image = new Image();
                        image.src = uniform.value as string;
                        image.onload = () => {
                            uniform.texture = createTexture(this.gl, image);
                        }
                    }
                    break;
                case MusesPropertyType.Cube:
                    if (uniform.deprecated) {
                        this.gl.deleteTexture(uniform.deprecated as WebGLTexture);
                        uniform.deprecated = undefined;
                    }
                    if (uniform.texture) {
                        this.gl.activeTexture(this.gl.TEXTURE0 + textureIndex);
                        this.gl.bindTexture(this.gl.TEXTURE_CUBE_MAP, uniform.texture);
                        this.gl.uniform1i(location, textureIndex);
                        textureIndex++;
                    } else {
                        const image = new Image();
                        image.src = uniform.value as string;
                        image.onload = () => {
                            uniform.texture = createCubeTexture(this.gl, image);
                        }
                    }
                    break;
                case MusesPropertyType._3D:
                    break;
                default:
                    break;
            }
        });
    }

    private setLights(program: WebGLProgram, lights: IMusesLight[]) {
        const ambient = this.gl.getUniformLocation(program, `MUSES_AMBIENT`);
        if (ambient === null) {
            return;
        }
        this.gl.uniform3f(ambient, 0.2, 0.2, 0.2);

        for (let index = 0; index < 10; index++) {
            const light = lights[index];
            if (!light) {
                const type = this.gl.getUniformLocation(program, `MUSES_LIGHTS[${index}].type`);
                if (type === null) {
                    return;
                }
                this.gl.uniform1i(type, 0);
                return;
            } else {
                const type = this.gl.getUniformLocation(program, `MUSES_LIGHTS[${index}].type`);
                if (type === null) {
                    return;
                }
                this.gl.uniform1i(type, light.type);
            }
            const color = this.gl.getUniformLocation(program, `MUSES_LIGHTS[${index}].color`);
            if (color === null) {
                return;
            }
            this.gl.uniform3f(color, light.color ? light.color[0] : 0, light.color ? light.color[1] : 0, light.color ? light.color[2] : 0);
            const direction = this.gl.getUniformLocation(program, `MUSES_LIGHTS[${index}].direction`);
            if (direction !== null) {
                this.gl.uniform3f(
                    direction,
                    light.direction ? light.direction[0] : 0,
                    light.direction ? light.direction[1] : 0,
                    light.direction ? light.direction[2] : 0);
            }
            const position = this.gl.getUniformLocation(program, `MUSES_LIGHTS[${index}].position`);
            if (location !== null) {
                this.gl.uniform3f(
                    position,
                    light.position ? light.position[0] : 0,
                    light.position ? light.position[1] : 0,
                    light.position ? light.position[2] : 0);
            }
            const cutoff = this.gl.getUniformLocation(program, `MUSES_LIGHTS[${index}].cutOff`);
            if (cutoff !== null) {
                this.gl.uniform1f(cutoff, light.cutoff ? light.cutoff : 0);
            }
            const outerCutoff = this.gl.getUniformLocation(program, `MUSES_LIGHTS[${index}].outerCutOff`);
            if (outerCutoff !== null) {
                this.gl.uniform1f(outerCutoff, light.outerCutoff ? light.outerCutoff : 0);
            }
            const constantAttenuation = this.gl.getUniformLocation(program, `MUSES_LIGHTS[${index}].constantAttenuation`);
            if (constantAttenuation !== null) {
                this.gl.uniform1f(constantAttenuation, light.constantAttenuation ? light.constantAttenuation : 1);
            }
            const linearAttenuation = this.gl.getUniformLocation(program, `MUSES_LIGHTS[${index}].linearAttenuation`);
            if (linearAttenuation !== null) {
                this.gl.uniform1f(linearAttenuation, light.linearAttenuation ? light.linearAttenuation : 0.7);
            }
            const quadraticAttenuation = this.gl.getUniformLocation(program, `MUSES_LIGHTS[${index}].quadraticAttenuation`);
            if (quadraticAttenuation !== null) {
                this.gl.uniform1f(quadraticAttenuation, light.quadraticAttenuation ? light.quadraticAttenuation : 1.8);
            }
        }
    }

    render(object: IRenderObject) {
        object.commands.forEach(command => {
            this.gl.useProgram(command.program);
            this.setState(command.state);
            this.gl.bindVertexArray(command.vao);
            const posM = this.gl.getUniformLocation(command.program, "MUSES_MATRIX_M");
            const posV = this.gl.getUniformLocation(command.program, "MUSES_MATRIX_V");
            const posP = this.gl.getUniformLocation(command.program, "MUSES_MATRIX_P");
            const posMVP = this.gl.getUniformLocation(command.program, "MUSES_MATRIX_MVP");
            const posVPDI = this.gl.getUniformLocation(command.program, "MUSES_MATRIX_VDPI");
            const posTime = this.gl.getUniformLocation(command.program, "MUSES_TIME");
            const posCameraPos = this.gl.getUniformLocation(command.program, "MUSES_CAMERA_POS");
            if (posM) this.gl.uniformMatrix4fv(posM, false, this.modelMatrix);
            if (posV) this.gl.uniformMatrix4fv(posV, false, this.viewMatrix);
            if (posP) this.gl.uniformMatrix4fv(posP, false, this.perspectiveMatrix);
            if (posMVP) this.gl.uniformMatrix4fv(posMVP, false, this.mvpMatrix);
            if (posVPDI) this.gl.uniformMatrix4fv(posVPDI, false, this.vpdiMatrix);
            if (posTime) this.gl.uniform1i(posTime, this.time);
            if (posCameraPos) this.gl.uniform3f(posCameraPos, this.cameraPos[0], this.cameraPos[1], this.cameraPos[2]);

            this.setUniforms(command.program, object.material!.uniforms);
            this.setLights(command.program, this.lights);

            if (this.ebo) {
                this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, this.ebo);
                this.gl.drawElements(this.gl.TRIANGLES, this.vertexcount, this.gl.UNSIGNED_SHORT, 0);
            } else {
                this.gl.drawArrays(this.gl.TRIANGLES, 0, this.vertexcount);
            }
        });
    }

    renderSkyBox(object: IRenderObject) {
        object.commands.forEach(command => {
            this.gl.useProgram(command.program);
            this.setState(command.state);
            this.gl.bindVertexArray(command.vao);
            const posM = this.gl.getUniformLocation(command.program, "MUSES_MATRIX_M");
            const posV = this.gl.getUniformLocation(command.program, "MUSES_MATRIX_V");
            const posP = this.gl.getUniformLocation(command.program, "MUSES_MATRIX_P");
            const posMVP = this.gl.getUniformLocation(command.program, "MUSES_MATRIX_MVP");
            const posVPDI = this.gl.getUniformLocation(command.program, "MUSES_MATRIX_VDPI");
            const posTime = this.gl.getUniformLocation(command.program, "MUSES_TIME");
            const skyBox = this.gl.getUniformLocation(command.program, "MUSES_SKYBOX");
            if (posM) this.gl.uniformMatrix4fv(posM, false, mat4.create());
            if (posV) this.gl.uniformMatrix4fv(posV, false, this.viewMatrix);
            if (posP) this.gl.uniformMatrix4fv(posP, false, this.perspectiveMatrix);
            if (posMVP) this.gl.uniformMatrix4fv(posMVP, false, this.mvpMatrix);
            if (posVPDI) this.gl.uniformMatrix4fv(posVPDI, false, this.vpdiMatrix);
            if (posTime) this.gl.uniform1i(posTime, this.time);
            if (skyBox && this.skyBoxTexture) {
                this.gl.activeTexture(this.gl.TEXTURE0);
                this.gl.bindTexture(this.gl.TEXTURE_CUBE_MAP, this.skyBoxTexture);
                this.gl.uniform1i(skyBox, 0);
            }
            this.gl.drawArrays(this.gl.TRIANGLES, 0, 6);
        });
    }

    private loop() {
        this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
        if (this.skybox)
            this.renderSkyBox(this.skybox);
        if (this.object)
            this.render(this.object);
        if (this._runnig)
            requestAnimationFrame(this.loop.bind(this));
    }

    startLoop() {
        if (this._runnig)
            return;
        this._runnig = true;
        this.loop();
        console.log("start loop");
    }

    stop() {
        this._runnig = false;
    }

    exit() {
        this.stop();
        if (this.vbo)
            this.gl.deleteBuffer(this.vbo);
        this.object?.commands.forEach(c => {
            this.gl.deleteProgram(c);
            this.gl.deleteVertexArray(c);
        });
        this.skybox?.commands.forEach(c => {
            this.gl.deleteProgram(c);
            this.gl.deleteVertexArray(c);
        });
    }

    rangeR = vec2.fromValues(2, 30);
    rangeTheta = vec2.fromValues(15 * Math.PI / 180, 165 * Math.PI / 180);
    rangePhi = vec2.fromValues(0, Math.PI * 2);

    private limitRange(value: number, range: vec2) {
        if (value < range[0])
            return range[0];
        if (value > range[1])
            return range[1];
        return value;
    }

    get cameraControl() {
        const r = vec3.length(this.cameraPos);
        const theta = Math.acos(this.cameraPos[1] / r);
        const phi = Math.atan2(this.cameraPos[2], this.cameraPos[0]);
        return vec3.fromValues(r, theta / Math.PI * 180, phi / Math.PI * 180);
    }

    set cameraControl(value: vec3) {
        const r = this.limitRange(value[0], this.rangeR);
        const theta = this.limitRange(value[1] * Math.PI / 180, this.rangeTheta);
        const phi = value[2] * Math.PI / 180

        const x = r * Math.sin(theta) * Math.cos(phi);
        const y = r * Math.cos(theta);
        const z = r * Math.sin(theta) * Math.sin(phi);
        this.emit("cameraChanged", vec3.fromValues(r, theta / Math.PI * 180, phi / Math.PI * 180));
        this.cameraPos = vec3.fromValues(x, y, z);
    }

    constructor(gl: WebGL2RenderingContext) {
        super();
        this.gl = gl;
        this.setObject(cubeBuffer);
        this._skyBoxVbo = createVbo(this.gl, skyBoxPlain);
        gl.clearColor(0.0, 0.0, 0.0, 1.0);
        gl.cullFace(gl.BACK);
        gl.enable(gl.CULL_FACE);
        gl.enable(gl.DEPTH_TEST);
        gl.depthFunc(gl.LEQUAL);
        this.setSkyBoxShader('./skybox.muses');
        this.setSkyBox('./cubemaps_skybox.png');
    }

    emit(eventName: 'cameraChanged', pos: vec3): boolean;
    emit(eventName: 'materialChanged', material: MusesMaterial): boolean;
    emit(eventName: string | symbol, ...args: any[]): boolean {
        return super.emit(eventName, ...args);
    }

    addListener(eventName: 'cameraChanged', listener: (pos: vec3) => void): this;
    addListener(eventName: 'materialChanged', listener: (material: MusesMaterial) => void): this;
    addListener(eventName: string | symbol, listener: (...args: any[]) => void): this {
        return super.addListener(eventName, listener);
    }

    on(eventName: 'cameraChanged', listener: (pos: vec3) => void): this;
    on(eventName: 'materialChanged', listener: (material: MusesMaterial) => void): this;
    on(eventName: string | symbol, listener: (...args: any[]) => void): this {
        return super.on(eventName, listener);
    }
}

function ColorSelector(props: {
    color?: vec4,
    onChange?: (color: vec4) => void
}) {
    const [color, setColor] = useState(props.color || vec4.fromValues(1, 1, 1, 1));

    return <Popover placement={`right`} content={
        <SketchPicker
            color={props.color ?
                {
                    r: props.color[0] * 255,
                    g: props.color[1] * 255,
                    b: props.color[2] * 255,
                    a: props.color[3]
                } : {
                    r: color[0] * 255,
                    g: color[1] * 255,
                    b: color[2] * 255,
                    a: color[3]
                }
            }
            onChange={(color) => {
                const c = vec4.fromValues(color.rgb.r / 255, color.rgb.g / 255, color.rgb.b / 255, color.rgb.a || 1);
                setColor(c);
                if (props.onChange)
                    props.onChange(c);
            }}
        />
    }>
        <div
            style={{
                width: "100%",
                height: "30px",
                backgroundColor: `rgba(${color[0] * 255},${color[1] * 255},${color[2] * 255},${color[3] * 255})`,
                border: "1px solid #ccc",
            }}
        />
    </Popover>
}

function ImageSelector(props: {
    defaultImage?: string,
    image?: string,
    onChanged?: (image: string) => void
}) {
    const [image, setImage] = useState(props.defaultImage || "");
    const [color, setColor] = useState(vec4.fromValues(1, 1, 1, 1));
    const canvas = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        if (!canvas.current) return;
        const ctx = canvas.current.getContext("2d");
        if (!ctx) return;
        const img = new Image();
        img.src = image;
        img.onload = () => {
            ctx.drawImage(img, 0, 0, 256, 256);
            const imgData = ctx.getImageData(0, 0, 256, 256);
            for (let i = 0; i < imgData.data.length; i += 4) {
                imgData.data[i] *= color[0];
                imgData.data[i + 1] *= color[1];
                imgData.data[i + 2] *= color[2];
                imgData.data[i + 3] *= color[3];
            }
            ctx.clearRect(0, 0, 256, 256);
            ctx.putImageData(imgData, 0, 0);
            canvas.current?.toBlob((blob) => {
                if (!blob) return;
                const url = URL.createObjectURL(blob);
                if (props.onChanged)
                    props.onChanged(url);
            });
        }
    }, [image, color]);


    return <Input.Group compact>
        <canvas ref={canvas} style={{ width: "100%", height: "100%", border: '1px solid black' }} width={256} height={256} />
        <Input style={{ width: '75%' }} value={props.image ? props.image : image} onChange={e => setImage(e.currentTarget.value)} />
        <Button style={{ width: '25%' }} onClick={() => {
            const fileSelector = document.createElement('input');
            fileSelector.setAttribute('type', 'file');
            fileSelector.setAttribute('accept', '.png,.jpg,.jpeg,.bmp');
            fileSelector.onchange = (e) => {
                const file = (e.target as HTMLInputElement).files![0];
                const reader = new FileReader();
                reader.onload = (e) => {
                    setImage(e.target?.result as string);
                };
                reader.readAsDataURL(file);
            }
            fileSelector.click();
        }} >Local</Button>
        <ColorSelector color={color} onChange={setColor} />
    </Input.Group>
}

function Properties({ onChange, material }:
    {
        onChange?: (uniform: { [key: string]: any }) => void;
        material?: MusesMaterial;
    }) {
    const [uniformStorage, setUniform] = useState<IMusesUniform[]>(material?.uniforms || []);

    useEffect(() => {
        material?.setUniforms(uniformStorage);
        if (onChange) {
            onChange(uniformStorage);
        }
    }, [uniformStorage]);


    return <>
        {material?.uniforms.map((p, i) => {
            switch (p.type) {
                case MusesPropertyType.Color:
                    return <Form.Item label={p.displayName} key={i}>
                        <ColorSelector
                            color={vec4.fromValues(p.value[0], p.value[1], p.value[2], p.value[3])}
                            onChange={(color) => setUniform(material.uniforms.map((u, j) => i === j ? { ...u, value: color } : u))}
                        />
                    </Form.Item>
                case MusesPropertyType._2D:
                    return <Form.Item label={p.displayName} key={i}>
                        <ImageSelector
                            defaultImage={p.value as string}
                            onChanged={image => setUniform(material.uniforms.map((u, j) => i === j ? { ...u, value: image } : u))}
                        />
                    </Form.Item>
                case MusesPropertyType._3D:
                    return <Form.Item label={p.displayName} key={i}>
                        <ImageSelector
                            defaultImage={p.value as string}
                            onChanged={image => setUniform(material.uniforms.map((u, j) => i === j ? { ...u, value: image } : u))}
                        />
                    </Form.Item>
                case MusesPropertyType.Cube:
                    return <Form.Item label={p.displayName} key={i}>
                        <ImageSelector
                            defaultImage={p.value as string}
                            onChanged={image => setUniform(material.uniforms.map((u, j) => i === j ? { ...u, value: image } : u))}
                        />
                    </Form.Item>
                case MusesPropertyType.Float:
                    return <Form.Item label={p.displayName} key={i}>
                        <InputNumber
                            defaultValue={p.value as number}
                            onChange={value => setUniform(material.uniforms.map((u, j) => i === j ? { ...u, value: value || 0 } : u))}
                        />
                    </Form.Item>
                case MusesPropertyType.Int:
                    return <Form.Item label={p.displayName} key={i}>
                        <InputNumber
                            defaultValue={p.value as number}
                            onChange={value => setUniform(material.uniforms.map((u, j) => i === j ? { ...u, value: Math.floor(value || 0) } : u))}
                        />
                    </Form.Item>
                case MusesPropertyType.Range:
                    return <Form.Item label={p.displayName} key={i}>
                        <Row>
                            <Col span={15}>
                                <Slider
                                    min={p.range![0]}
                                    max={p.range![1]}
                                    value={p.value as number}
                                    onChange={value => setUniform(material.uniforms.map((u, j) => i === j ? { ...u, value: value } : u))}
                                    step={0.0001}
                                />
                            </Col>
                            <Col span={1}>
                                <InputNumber
                                    min={p.range![0]}
                                    max={p.range![1]}
                                    value={p.value as number}
                                    onChange={value => setUniform(material.uniforms.map((u, j) => i === j ? { ...u, value: value || 0 } : u))}
                                />
                            </Col>
                        </Row>
                    </Form.Item>
                case MusesPropertyType.Vector:
                    return <Form.Item label={p.displayName} key={i} labelCol={{ span: 6 }} wrapperCol={{ span: 18 }}>
                        <Row>
                            <Col span={6}>
                                <InputNumber
                                    defaultValue={p.value[0]}
                                    onChange={value => setUniform(material.uniforms.map((u, j) => i === j ? { ...u, value: [value || 0, u.value[1], u.value[2], u.value[3]] } : u))}
                                />
                            </Col>
                            <Col span={6}>
                                <InputNumber
                                    defaultValue={p.value[1]}
                                    onChange={value => setUniform(material.uniforms.map((u, j) => i === j ? { ...u, value: [u.value[0], value || 0, u.value[2], u.value[3]] } : u))}
                                />
                            </Col>
                            <Col span={6}>
                                <InputNumber
                                    defaultValue={p.value[2]}
                                    onChange={value => setUniform(material.uniforms.map((u, j) => i === j ? { ...u, value: [u.value[0], u.value[1], value || 0, u.value[3]] } : u))}
                                />
                            </Col>
                            <Col span={6}>
                                <InputNumber
                                    defaultValue={p.value[3]}
                                    onChange={value => setUniform(material.uniforms.map((u, j) => i === j ? { ...u, value: [u.value[0], u.value[1], u.value[2], value || 0] } : u))}
                                />
                            </Col>
                        </Row>
                    </Form.Item>
                default:
                    return <Form.Item label={p.displayName} key={i}>
                        <Input />
                    </Form.Item>
            }
        })}
    </>;
}

export default function App() {
    const ref = useRef<HTMLCanvasElement>(null);
    const [engine, setEngine] = useState<Engine | null>(null);
    const [mouseDown, setMouseDown] = useState(false);
    const [collapsed, setCollapsed] = useState(false);
    const [camPos, setCamPos] = useState<vec3>(vec3.fromValues(1, 0, 0));
    const [fileName, setFileName] = useState<string>('pbr.muses');
    const [shader, setShader] = useState<MusesMaterial>();

    useEffect(() => {
        if (!ref.current) return;
        const gl = ref.current.getContext('webgl2');
        if (!gl) {
            alert('Cannot initlizated the webgl!');
            return;
        }

        const engine = new Engine(gl);
        engine.shaderUrl = fileName;
        engine.background = vec4.fromValues(0.0, 0.0, 0.0, 1);
        engine.setObject(cubeBuffer);
        engine.startLoop();
        setEngine(engine);
        setCamPos(engine.cameraControl);
        engine.on('cameraChanged', setCamPos);
        engine.on('materialChanged', setShader);

        return () => {
            engine.exit();
        }

    }, [ref]);

    return <Layout style={{ minHeight: '100vh' }}>
        <Sider
            collapsible
            collapsed={collapsed}
            onCollapse={value => setCollapsed(value)}
            width={350}
            theme='light'
        >
            <div style={{ padding: 10 }}>
                <h1 style={{ width: '100%', textAlign: 'center', fontSize: '25px', paddingTop: 15, paddingBottom: 5 }}>{collapsed ? 'M' : 'Muses'}</h1>
                <Divider />
                {!collapsed ?
                    <Form
                        name="camera"
                        labelCol={{ span: 6 }}
                        wrapperCol={{ span: 18 }}
                        style={{ width: '100%', overflowY: 'auto', overflowX: 'hidden', height: 'calc(100vh - 230px)' }}
                    >
                        <Divider plain > background </Divider>
                        <Divider plain > camera </Divider>
                        <div style={{ paddingLeft: 20 }}>
                            {`r: ${camPos[0].toFixed(2)}`}
                            <br />
                            {`t: ${camPos[1].toFixed(2)}`}
                            <br />
                            {`p: ${camPos[2].toFixed(2)}`}
                        </div>
                        <Divider plain > shader </Divider>
                        <Form.Item label={'Shader'} name={'CameraPos'}>
                            <Input.Group compact>
                                <Input style={{ width: '50%' }} value={fileName} onChange={e => setFileName(e.currentTarget.value)} />
                                <Button style={{ width: '25%' }} onClick={() => {
                                    engine!.shaderUrl = fileName;
                                }} >Cloud</Button>
                                <Button style={{ width: '25%' }} onClick={() => {
                                    const fileSelector = document.createElement('input');
                                    fileSelector.setAttribute('type', 'file');
                                    fileSelector.setAttribute('accept', '.muses');
                                    fileSelector.onchange = (e) => {
                                        const file = (e.target as HTMLInputElement).files![0];
                                        setFileName(file.name);
                                        const reader = new FileReader();
                                        reader.onload = (e) => {
                                            const text = (e.target as FileReader).result as string;
                                            engine!.shaderText = text;
                                        }
                                        reader.readAsText(file);
                                    }
                                    fileSelector.click();
                                }} >Local</Button>
                            </Input.Group>
                        </Form.Item>
                        <Properties material={shader} />
                        <canvas id='skyBox' style={{ width: '100%' }} />
                        <canvas id='skyBoxLeft' style={{ width: '100%' }} />
                        <canvas id='skyBoxFont' style={{ width: '100%' }} />
                        <canvas id='skyBoxBack' style={{ width: '100%' }} />
                        <canvas id='skyBoxRight' style={{ width: '100%' }} />
                        <canvas id='skyBoxTop' style={{ width: '100%' }} />
                        <canvas id='skyBoxBottom' style={{ width: '100%' }} />
                    </Form>
                    : null}
                <Divider />
            </div>
        </Sider>
        <Layout className="site-layout">
            <canvas
                ref={ref}
                width={1920}
                height={1080}
                onMouseMove={e => {
                    if (!engine) return;
                    if (mouseDown) {
                        const pos = engine.cameraControl;
                        pos[1] -= e.movementY / 2;
                        pos[2] += e.movementX / 2;
                        engine.cameraControl = pos;
                    }
                }}
                onMouseDown={e => {
                    setMouseDown(true);
                }}
                onMouseUp={e => {
                    setMouseDown(false);
                }}
                onMouseLeave={e => {
                    setMouseDown(false);
                }}
                onWheel={e => {
                    if (!engine) return;
                    const control = engine.cameraControl;
                    control[0] += e.deltaY * 0.01;
                    engine.cameraControl = control;
                }}

                style={{ width: '100%', height: '100%' }}
            />
        </Layout>
    </Layout >
}

