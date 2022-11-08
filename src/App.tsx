import { mat4, vec2, vec3, vec4 } from 'gl-matrix';
import React, { useEffect, useRef, useState } from 'react';
import { MusesPropertyType, MusesVM } from '../muses';
import { Layout, Divider, Form, Input, Button, Popover, Image, InputNumber, Row, Slider, Col } from 'antd';
import './App.css';
import EventEmitter from 'events';
import { SketchPicker } from 'react-color';
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
// #endregion

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
    const texcoordIndex = gl.getAttribLocation(shader, "MUSES_TEXCOORD");
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


class Engine extends EventEmitter {
    private gl: WebGL2RenderingContext;
    private _runnig = false;

    objPos = vec3.fromValues(0, 0, 0);
    objEular = vec3.fromValues(0, 0, 0);
    objScale = vec3.fromValues(0.5, 0.5, 0.5);

    cameraPos = vec3.fromValues(2, 2, 3);
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

    private muses?: MusesVM;
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
        this.loadFromShaderCode(text);
    }
    get shader() {
        return this.muses;
    }
    private shaderPrograms: WebGLProgram[] = [];

    async loadShader(url: string) {
        console.log("load shader", url);
        const code = await fetch(url).then(res => res.text());
        this.loadFromShaderCode(code);
    }

    async loadFromShaderCode(code: string) {
        console.log("load shader");
        this.muses = new MusesVM(code);
        const shaders: WebGLProgram[] = [];
        this.muses.glsl?.passes.forEach((pass, index) => {
            console.log(`pass ${index} shader`);
            console.log(pass.vert);
            console.log(pass.frag);
            const program = initShaderProgram(this.gl, pass.vert, pass.frag);
            shaders.push(program);
            console.log("pass", index, "shader loaded");
        });
        const old = this.shaderPrograms;
        this.shaderPrograms = shaders;
        this.createVao();
        this.emit('shaderChanged', this.muses);
        old.forEach(p => this.gl.deleteProgram(p));
        console.log("load shader", "success");
    }

    private vbo?: WebGLBuffer;
    private vertexcount: number = 0;
    set object(obj: number[]) {
        this.vbo = createVbo(this.gl, obj);
        this.createVao();
        this.vertexcount = obj.length / 3;
    }

    private vao?: WebGLVertexArrayObject;
    private createVao() {
        if (!this.vbo || !this.shaderPrograms[0]) return;
        this.vao = createVao(this.gl, this.vbo, this.shaderPrograms[0]);
    }

    private loop() {
        this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
        if (!this.vao) {
            requestAnimationFrame(this.loop.bind(this));
            return;
        }
        this.gl.bindVertexArray(this.vao);
        this.shaderPrograms.forEach(shader => {
            const posM = this.gl.getUniformLocation(shader, "MUSES_MATRIX_M");
            const posV = this.gl.getUniformLocation(shader, "MUSES_MATRIX_V");
            const posP = this.gl.getUniformLocation(shader, "MUSES_MATRIX_P");
            const posMVP = this.gl.getUniformLocation(shader, "MUSES_MATRIX_MVP");
            if (posM) this.gl.uniformMatrix4fv(posM, false, this.modelMatrix);
            if (posV) this.gl.uniformMatrix4fv(posV, false, this.viewMatrix);
            if (posP) this.gl.uniformMatrix4fv(posP, false, this.perspectiveMatrix);
            if (posMVP) this.gl.uniformMatrix4fv(posMVP, false, this.mvpMatrix);
            this.gl.useProgram(shader);
            this.gl.drawArrays(this.gl.TRIANGLES, 0, this.vertexcount);
        });
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
        if (this.vao)
            this.gl.deleteVertexArray(this.vao);
        this.shaderPrograms.forEach(p => this.gl.deleteProgram(p));
    }

    rangeR = vec2.fromValues(2, 100);
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
        gl.clearColor(0.0, 0.0, 0.0, 1.0);
        gl.cullFace(gl.BACK);
        gl.enable(gl.CULL_FACE);
        gl.enable(gl.DEPTH_TEST);
        gl.depthFunc(gl.LEQUAL);
    }

    emit(eventName: 'cameraChanged', pos: vec3): boolean;
    emit(eventName: 'shaderChanged', vm: MusesVM): boolean;
    emit(eventName: string | symbol, ...args: any[]): boolean {
        return super.emit(eventName, ...args);
    }

    addListener(eventName: 'cameraChanged', listener: (pos: vec3) => void): this;
    addListener(eventName: 'shaderChanged', listener: (vm: MusesVM) => void): this;
    addListener(eventName: string | symbol, listener: (...args: any[]) => void): this {
        return super.addListener(eventName, listener);
    }

    on(eventName: 'cameraChanged', listener: (pos: vec3) => void): this;
    on(eventName: 'shaderChanged', listener: (vm: MusesVM) => void): this;
    on(eventName: string | symbol, listener: (...args: any[]) => void): this {
        return super.on(eventName, listener);
    }
}

function ColorSelector(props: {
    defaultColor?: vec4,
    color?: vec4,
    onChange?: (color: vec4) => void
}) {
    const [color, setColor] = useState(props.defaultColor || vec4.fromValues(1, 1, 1, 1));

    return <Popover placement={`right`} content={
        <SketchPicker
            color={props.color ?
                {
                    r: props.color[0] * 255,
                    g: props.color[1] * 255,
                    b: props.color[2] * 255,
                    a: props.color[3] * 255
                } : {
                    r: color[0] * 255,
                    g: color[1] * 255,
                    b: color[2] * 255,
                    a: color[3] * 255
                }
            }
            onChange={(color) => {
                const c = vec4.fromValues(color.rgb.r / 255, color.rgb.g / 255, color.rgb.b / 255, (color.rgb.a || 255) / 255);
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
    return <Input.Group compact>
        <Image src={image} style={{ width: '100%' }} />
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

    </Input.Group>
}

function Properties({ vm, onChange, uniforms }:
    {
        vm?: MusesVM,
        onChange?: (uniform: { [key: string]: any }) => void;
        uniforms?: { [key: string]: { type: MusesPropertyType, value: any } };
    }) {
    const [uniformStorage, setUniform] = useState<{ [key: string]: { type: MusesPropertyType, value: any } }>(uniforms || {});

    useEffect(() => {
        if (uniforms) return;
        const defaultUniform: { [key: string]: { type: MusesPropertyType, value: any } } = {};
        vm?.properties.map(p => {
            switch (p.type) {
                case MusesPropertyType.Color:
                    defaultUniform[p.name] = { type: p.type, value: vec4.fromValues(p.defaultValue[0], p.defaultValue[1], p.defaultValue[2], p.defaultValue[3]) };
                    break;
                case MusesPropertyType._2D:
                    defaultUniform[p.name] = { type: p.type, value: p.defaultValue };
                    break;
                case MusesPropertyType._3D:
                    defaultUniform[p.name] = { type: p.type, value: p.defaultValue };
                    break;
                case MusesPropertyType.Cube:
                    defaultUniform[p.name] = { type: p.type, value: p.defaultValue };
                    break;
                case MusesPropertyType.Float:
                    defaultUniform[p.name] = { type: p.type, value: p.defaultValue };
                    break;
                case MusesPropertyType.Int:
                    defaultUniform[p.name] = { type: p.type, value: p.defaultValue };
                    break;
                case MusesPropertyType.Range:
                    defaultUniform[p.name] = { type: p.type, value: p.defaultValue };
                    break;
                case MusesPropertyType.Vector:
                    defaultUniform[p.name] = { type: p.type, value: vec4.fromValues(p.defaultValue[0], p.defaultValue[1], p.defaultValue[2], p.defaultValue[3]) };
                    break;
                default:
                    break;
            }
        });
        setUniform(defaultUniform);
    }, []);

    useEffect(() => {
        if (onChange) {
            onChange(uniformStorage);
        }
    }, [uniformStorage]);


    return <>
        {vm?.properties.map((p, i) => {
            switch (p.type) {
                case MusesPropertyType.Color:
                    return <Form.Item label={p.displayName} key={i}>
                        <ColorSelector
                            defaultColor={vec4.fromValues(p.defaultValue[0], p.defaultValue[1], p.defaultValue[2], p.defaultValue[3])}
                            onChange={(color) => setUniform({ ...uniformStorage, [p.name]: { type: p.type, value: color } })}
                        />
                    </Form.Item>
                case MusesPropertyType._2D:
                    const defaultImage = p.defaultValue as string;
                    return <Form.Item label={p.displayName} key={i}>
                        <ImageSelector
                            defaultImage={p.defaultValue as string}
                            onChanged={image => setUniform({ ...uniformStorage, [p.name]: { type: p.type, value: image } })}
                        />
                    </Form.Item>
                case MusesPropertyType._3D:
                    return <Form.Item label={p.displayName} key={i}>
                        <ImageSelector
                            defaultImage={p.defaultValue as string}
                            onChanged={image => setUniform({ ...uniformStorage, [p.name]: { type: p.type, value: image } })}
                        />
                    </Form.Item>
                case MusesPropertyType.Cube:
                    return <Form.Item label={p.displayName} key={i}>
                        <ImageSelector
                            defaultImage={p.defaultValue as string}
                            onChanged={image => setUniform({ ...uniformStorage, [p.name]: { type: p.type, value: image } })}
                        />
                    </Form.Item>
                case MusesPropertyType.Float:
                    return <Form.Item label={p.displayName} key={i}>
                        <InputNumber
                            defaultValue={p.defaultValue as number}
                            onChange={value => setUniform({ ...uniformStorage, [p.name]: { type: p.type, value } })}
                        />
                    </Form.Item>
                case MusesPropertyType.Int:
                    return <Form.Item label={p.displayName} key={i}>
                        <InputNumber
                            defaultValue={p.defaultValue as number}
                            onChange={value => setUniform({ ...uniformStorage, [p.name]: { type: p.type, value } })}
                        />
                    </Form.Item>
                case MusesPropertyType.Range:
                    return <Form.Item label={p.displayName} key={i}>
                        <Row>
                            <Col span={15}>
                                <Slider
                                    min={p.range![0]}
                                    max={p.range![1]}
                                    value={uniformStorage[p.name]?.value || p.defaultValue}
                                    defaultValue={p.defaultValue as number}
                                    onChange={value => setUniform({ ...uniformStorage, [p.name]: { type: p.type, value } })}
                                    step={0.0001}
                                />
                            </Col>
                            <Col span={1}>
                                <InputNumber
                                    min={p.range![0]}
                                    max={p.range![1]}
                                    value={uniformStorage[p.name]?.value || p.defaultValue}
                                    defaultValue={p.defaultValue as number}
                                    onChange={value => setUniform({ ...uniformStorage, [p.name]: { type: p.type, value } })}
                                />
                            </Col>
                        </Row>
                    </Form.Item>
                case MusesPropertyType.Vector:
                    return <Form.Item label={p.displayName} key={i} labelCol={{ span: 6 }} wrapperCol={{ span: 18 }}>
                        <Row>
                            <Col span={6}>
                                <InputNumber
                                    defaultValue={p.defaultValue[0]}
                                    onChange={value => setUniform({ ...uniformStorage, [p.name]: { type: p.type, value: vec4.fromValues(value || 0, uniformStorage[p.name].value[1], uniformStorage[p.name].value[2], uniformStorage[p.name].value[3]) } })}
                                />
                            </Col>
                            <Col span={6}>
                                <InputNumber
                                    defaultValue={p.defaultValue[1]}
                                    onChange={value => setUniform({ ...uniformStorage, [p.name]: { type: p.type, value: vec4.fromValues(uniformStorage[p.name].value[0], value || 0, uniformStorage[p.name].value[2], uniformStorage[p.name].value[3]) } })}
                                />
                            </Col>
                            <Col span={6}>
                                <InputNumber
                                    defaultValue={p.defaultValue[2]}
                                    onChange={value => setUniform({ ...uniformStorage, [p.name]: { type: p.type, value: vec4.fromValues(uniformStorage[p.name].value[0], uniformStorage[p.name].value[1], value || 0, uniformStorage[p.name].value[3]) } })}
                                />
                            </Col>
                            <Col span={6}>
                                <InputNumber
                                    defaultValue={p.defaultValue[3]}
                                    onChange={value => setUniform({ ...uniformStorage, [p.name]: { type: p.type, value: vec4.fromValues(uniformStorage[p.name].value[0], uniformStorage[p.name].value[1], uniformStorage[p.name].value[2], value || 0) } })}
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
    const [fileName, setFileName] = useState<string>('default.muses');
    const [shader, setShader] = useState<MusesVM | null>(null);

    useEffect(() => {
        if (!ref.current) return;
        const gl = ref.current.getContext('webgl2');
        if (!gl) {
            alert('Cannot initlizated the webgl!');
            return;
        }

        const engine = new Engine(gl);
        engine.shaderUrl = fileName;
        engine.background = vec4.fromValues(0.2, 0.2, 0.2, 1);
        engine.object = cubeBuffer;
        engine.startLoop();
        setEngine(engine);
        setCamPos(engine.cameraControl);
        engine.on('cameraChanged', setCamPos);
        engine.on('shaderChanged', setShader);

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
                        style={{ width: '100%', overflowY: 'auto', overflowX: 'hidden', height: 'calc(100vh - 200px)' }}
                    >
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
                        <Properties vm={shader || undefined} />
                    </Form>
                    : null}

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

