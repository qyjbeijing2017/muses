import React, { useEffect, useRef, useState } from 'react';

const vsSource = `
attribute vec4 aVertexPosition;

void main() {
  gl_Position = aVertexPosition;
}
`;

const fsSource = `
    void main() {
      gl_FragColor = vec4(1.0, 0.0, 1.0, 1.0);
    }
  `;

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
        throw new Error('An error occurred compiling the shaders: ' + log);
    }

    return shader;
}

const positions = [
    0.5, 0.5, 0.5,
    -0.5, 0.5, 0.5,
    0.5, -0.5, 0.5,
    -0.5, -0.5, 0.5,
];

function createVbo(gl: WebGL2RenderingContext, positions: number[]) {
    const vbo = gl.createBuffer()!;
    gl.bindBuffer(gl.ARRAY_BUFFER, vbo);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);
    return vbo;
}

function createVao(gl: WebGL2RenderingContext, vbo: WebGLBuffer, shader: WebGLProgram) {
    const index = gl.getAttribLocation(shader, "aVertexPosition");
    const vao = gl.createVertexArray()!;
    gl.bindVertexArray(vao);
    gl.bindBuffer(gl.ARRAY_BUFFER, vbo);
    gl.vertexAttribPointer(index, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(index);
    return vao;
}

export default function App() {
    const ref = useRef<HTMLCanvasElement>(null);
    const [width, setWidth] = useState(1920);
    const [height, setHeight] = useState(1080);

    useEffect(() => {
        const onResize = () => {
            if (ref.current) {
                setWidth(ref.current.clientWidth);
                setHeight(ref.current.clientHeight);
            }
        };
        window.addEventListener('resize', onResize);
        return () => window.removeEventListener('resize', onResize);
    }, []);
    
    useEffect(() => {
        if (!ref.current) return;
        const gl = ref.current.getContext('webgl2');
        if (!gl) {
            alert('Cannot initlizated the webgl!');
            return;
        }
        const shaderProgram = initShaderProgram(gl, vsSource, fsSource);
        const vbo = createVbo(gl, positions);
        const vao = createVao(gl, vbo, shaderProgram);

        gl.clearColor(0.0, 0.0, 0.0, 1.0);
        gl.enable(gl.DEPTH_TEST);
        gl.depthFunc(gl.LEQUAL);

        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
        gl.bindVertexArray(vao);
        gl.useProgram(shaderProgram);
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    }, [ref]);

    return <canvas ref={ref} width={width} height={height} style={{ width: '100%', height: '100%', position: 'fixed' }} />
}

