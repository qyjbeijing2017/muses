import { MusesTypeDeclaration } from "../ast/glsl/type-declaration";
import { MusesGLSLStorage, MusesVariableDeclaration } from "../ast/glsl/variable-declaration";
import { MusesContextFunction } from "./functional";
import { MusesContextType } from "./type";
import { MusesContextVariable } from "./variable";

const boolType = new MusesContextType({
    name: 'bool', rules: [
        { test: /^bool=bool$/ },
        { test: /^bool\(int\)$/ },
        { test: /^bool\(float\)$/ },
        { test: /^bool\&\&bool$/ },
        { test: /^bool\|\|bool$/ },
        { test: /^bool\^\^bool$/ },
        { test: /^bool!=bool$/ },
        { test: /^bool==bool$/ },
        { test: /^!bool$/ },
    ],
});
const intType = new MusesContextType({
    name: 'int', rules: [
        { test: /^int=int$/ },
        { test: /^int\(float\)$/ },
        { test: /^int\(bool\)$/ },
        { test: /^int+int$/ },
        { test: /^int-int$/ },
        { test: /^int\*int$/ },
        { test: /^int\/int$/ },
        { test: /^int>int$/, returnType: boolType },
        { test: /^int>=int$/, returnType: boolType },
        { test: /^int<int$/, returnType: boolType },
        { test: /^int<=int$/, returnType: boolType },
        { test: /^int!=int$/, returnType: boolType },
        { test: /^int==int$/, returnType: boolType },
        { test: /^--int$/, returnType: boolType },
        { test: /^\+\+int$/, returnType: boolType },
        { test: /^int--$/, returnType: boolType },
        { test: /^int\+\+$/, returnType: boolType },
        { test: /^-int$/ },
        { test: /^int\[\]\[int\]/ },
        { test: /^int\[\]\(\)$/, returnArray: true },
        { test: /^int\[\]\(int(,int)*\)/, returnArray: true },
        { test: /^int\[\]=int\[\]$/, returnArray: true },
    ],
});
const floatType = new MusesContextType({
    name: 'float', rules: [
        { test: /^float=float$/ },
        { test: /^float\(int\)$/ },
        { test: /^float\(bool\)$/ },
        { test: /^float\+float$/ },
        { test: /^float\-float$/ },
        { test: /^float\*float$/ },
        { test: /^float\/float$/ },
        { test: /^float\*mat2$/ },
        { test: /^float\*mat3$/ },
        { test: /^float\*mat4$/ },
        { test: /^float\*vec2$/ },
        { test: /^float\*vec3$/ },
        { test: /^float\*vec4$/ },
        { test: /^float>float$/, returnType: boolType },
        { test: /^float>=float$/, returnType: boolType },
        { test: /^float<float$/, returnType: boolType },
        { test: /^float<=float$/, returnType: boolType },
        { test: /^float!=float$/, returnType: boolType },
        { test: /^float==float$/, returnType: boolType },
        { test: /^--float$/, returnType: boolType },
        { test: /^\+\+float$/, returnType: boolType },
        { test: /^float--$/, returnType: boolType },
        { test: /^float\+\+$/, returnType: boolType },
        { test: /^-float$/ },
        { test: /^float\[\]\[int\]/ },
        { test: /^float\[\]\(\)$/, returnArray: true },
        { test: /^float\[\]\(float(,float)*\)/, returnArray: true },
        { test: /^float\[\]=float\[\]$/, returnArray: true },
    ]
});
const vec2Type = new MusesContextType({
    name: 'vec2', rules: [
        { test: /^vec2=vec2$/ },
        { test: /^vec2\.[xy]$/, returnType: floatType },
        { test: /^vec2\.[rg]$/, returnType: floatType },
        { test: /^vec2\.[st]$/, returnType: floatType },
        { test: /^vec2\[int\]$/, returnType: floatType },
        { test: /^vec2\.[xy]{2}$/ },
        { test: /^vec2\.[rg]{2}$/ },
        { test: /^vec2\.[st]{2}$/ },
        { test: /^vec2\(\)$/ },
        { test: /^vec2\(float(,float){0,1}\)$/ },
        { test: /^vec2\(int(,int){0,1}\)$/ },
        { test: /^vec2\*float$/ },
        { test: /^vec2\*mat2$/ },
        { test: /^-vec2$/ },
        { test: /^vec2\[\]\[int\]/ },
        { test: /^vec2\[\]\(\)$/, returnArray: true },
        { test: /^vec2\[\]\(vec2(,vec2)*\)/, returnArray: true },
        { test: /^vec2\[\]=vec2\[\]$/, returnArray: true },
    ],
});
const vec3Type = new MusesContextType({
    name: 'vec3', rules: [
        { test: /^vec3=vec3$/ },
        { test: /^vec3\.[xyz]$/, returnType: floatType },
        { test: /^vec3\.[rgb]$/, returnType: floatType },
        { test: /^vec3\.[stp]$/, returnType: floatType },
        { test: /^vec3\[int\]$/, returnType: floatType },
        { test: /^vec3\.[xyz]{2}$/, returnType: vec2Type },
        { test: /^vec3\.[rgb]{2}$/, returnType: vec2Type },
        { test: /^vec3\.[stp]{2}$/, returnType: vec2Type },
        { test: /^vec3\.[xyz]{3}$/ },
        { test: /^vec3\.[rgb]{3}$/ },
        { test: /^vec3\.[stp]{3}$/ },
        { test: /^vec3\(\)$/ },
        { test: /^vec3\(float(,float){0,2}\)$/ },
        { test: /^vec3\(int(,int){0,2}\)$/ },
        { test: /^vec3\(vec2(,float){0,1}\)$/ },
        { test: /^vec3\(vec2(,int){0,1}\)$/ },
        { test: /^vec3\((float,){0,1}vec2\)$/ },
        { test: /^vec3\((int,){0,1}vec2\)$/ },
        { test: /^vec3\*float$/ },
        { test: /^vec3\*mat3$/ },
        { test: /^vec3\+float$/ },
        { test: /^vec3\-float$/ },
        { test: /^-vec3$/ },
        { test: /^vec3\[\]\[int\]/ },
        { test: /^vec3\[\]\(\)$/, returnArray: true },
        { test: /^vec3\[\]\(vec3(,vec3)*\)/, returnArray: true },
        { test: /^vec3\[\]=vec3\[\]$/, returnArray: true },
    ]
});
const vec4Type = new MusesContextType({
    name: 'vec4', rules: [
        { test: /^vec4=vec4$/ },
        { test: /^vec4\.[xyzw]$/, returnType: floatType },
        { test: /^vec4\.[rgba]$/, returnType: floatType },
        { test: /^vec4\.[stpq]$/, returnType: floatType },
        { test: /^vec4\[int\]$/, returnType: floatType },
        { test: /^vec4\.[xyzw]{2}$/, returnType: vec2Type },
        { test: /^vec4\.[rgba]{2}$/, returnType: vec2Type },
        { test: /^vec4\.[stpq]{2}$/, returnType: vec2Type },
        { test: /^vec4\.[xyzw]{3}$/, returnType: vec3Type },
        { test: /^vec4\.[rgba]{3}$/, returnType: vec3Type },
        { test: /^vec4\.[stpq]{3}$/, returnType: vec3Type },
        { test: /^vec4\.[xyzw]{4}$/ },
        { test: /^vec4\.[rgba]{4}$/ },
        { test: /^vec4\.[stpq]{4}$/ },
        { test: /^vec4\(\)$/ },
        { test: /^vec4\(float(,float){0,3}\)$/ },
        { test: /^vec4\(int(,int){0,3}\)$/ },
        { test: /^vec4\(vec2,float(,float){0,1}\)$/ },
        { test: /^vec4\(vec2,int(,int){0,1}\)$/ },
        { test: /^vec4\(float,vec2(,float){0,1}\)$/ },
        { test: /^vec4\(int,vec2(,int){0,1}\)$/ },
        { test: /^vec4\(vec3(,float){0,1}\)$/ },
        { test: /^vec4\(vec3(,int){0,1}\)$/ },
        { test: /^vec4\((float,){0,1}vec3\)$/ },
        { test: /^vec4\((int,){0,1}vec3\)$/ },
        { test: /^vec4\(vec2,(vec2){0,1}\)$/ },
        { test: /^vec4\*float$/ },
        { test: /^vec4\*mat4$/ },
        { test: /^vec4\*vec4$/ },
        { test: /^vec4\+float$/ },
        { test: /^vec4\-float$/ },
        { test: /^-vec4$/ },
        { test: /^vec4\[\]\[int\]/ },
        { test: /^vec4\[\]\(\)$/, returnArray: true },
        { test: /^vec4\[\]\(vec4(,vec4)*\)/, returnArray: true },
        { test: /^vec4\[\]=vec4\[\]$/, returnArray: true },
    ]
});
const mat2Type = new MusesContextType({
    name: 'mat2', rules: [
        { test: /^mat2=mat2$/ },
        { test: /^mat2\[int\]$/, returnType: vec2Type },
        { test: /^mat2\(\)$/ },
        { test: /^mat2\(float(,float){0,3}\)$/, returnType: vec2Type },
        { test: /^mat2\(int(,int){0,3}\)$/, returnType: vec2Type },
        { test: /^mat2\(vec2(,vec2){0,1}\)$/, returnType: vec2Type },
        { test: /^mat2\*mat2$/ },
        { test: /^mat2\*float$/ },
        { test: /^mat2\*vec2$/, returnType: vec2Type },
        { test: /^-mat2$/ },
        { test: /^mat2\[\]\[int\]/ },
        { test: /^mat2\[\]\(\)$/, returnArray: true },
        { test: /^mat2\[\]\(mat2(,mat2)*\)/, returnArray: true },
        { test: /^mat2\[\]=mat2\[\]$/, returnArray: true },
    ]
});
const mat3Type = new MusesContextType({
    name: 'mat3', rules: [
        { test: /^mat3=mat3$/ },
        { test: /^mat3\[int\]$/, returnType: vec3Type },
        { test: /^mat3\(\)$/ },
        { test: /^mat3\(float(,float){0,8}\)$/, returnType: vec3Type },
        { test: /^mat3\(int(,int){0,8}\)$/, returnType: vec3Type },
        { test: /^mat3\(vec3(,vec3){0,2}\)$/, returnType: vec3Type },
        { test: /^mat3\*mat3$/ },
        { test: /^mat3\*float$/ },
        { test: /^mat3\*vec3$/, returnType: vec3Type },
        { test: /^-mat3$/ },
        { test: /^mat3\[\]\[int\]/ },
        { test: /^mat3\[\]\(\)$/, returnArray: true },
        { test: /^mat3\[\]\(mat3(,mat3)*\)/, returnArray: true },
        { test: /^mat3\[\]=mat3\[\]$/, returnArray: true },
    ]
});
const mat4Type = new MusesContextType({
    name: 'mat4', rules: [
        { test: /^mat4=mat4$/ },
        { test: /^mat4\[int\]$/, returnType: vec4Type },
        { test: /^mat4\(\)$/ },
        { test: /^mat4\(float(,float){0,15}\)$/, returnType: vec4Type },
        { test: /^mat4\(int(,int){0,15}\)$/, returnType: vec4Type },
        { test: /^mat4\(vec4(,vec4){0,3}\)$/, returnType: vec4Type },
        { test: /^mat4\*mat4$/ },
        { test: /^mat4\*float$/ },
        { test: /^mat4\*vec4$/, returnType: vec4Type },
        { test: /^-mat4$/ },
        { test: /^mat4\[\]\[int\]/ },
        { test: /^mat4\[\]\(\)$/, returnArray: true },
        { test: /^mat4\[\]\(mat4(,mat4)*\)/, returnArray: true },
        { test: /^mat4\[\]=mat4\[\]$/, returnArray: true },
    ]
});
const sampler2DType = new MusesContextType({ name: 'sampler2D', rules: [{ test: /^sampler2D=sampler2D$/ }] });
const sampler3DTyoe = new MusesContextType({ name: 'sampler3D', rules: [{ test: /^sampler3D=sampler3D$/ }] });
const samplerCubeType = new MusesContextType({ name: 'samplerCube', rules: [{ test: /^samplerCube=samplerCube$/ }] });
const voidType = new MusesContextType({ name: 'void', rules: [] });

export const glslCtxDefine = {
    types: [
        vec2Type,
        vec3Type,
        vec4Type,
        mat2Type,
        mat3Type,
        mat4Type,
        sampler2DType,
        sampler3DTyoe,
        samplerCubeType,
        voidType,
        boolType,
        intType,
        floatType,
    ],
    variables: [
        new MusesContextVariable({ name: 'gl_FragColor', type: vec4Type }),
        new MusesContextVariable({ name: 'gl_Position', type: vec4Type }),
        new MusesContextVariable({
            name: 'MUSES_MATRIX_MVP',
            type: mat4Type.copy({ storage: MusesGLSLStorage.uniform }),
            variable: new MusesVariableDeclaration({
                name: 'MUSES_MATRIX_MVP',
                type: new MusesTypeDeclaration({ name: 'mat4' }),
                storage: MusesGLSLStorage.uniform
            }),
        }),
        new MusesContextVariable({
            name: 'MUSES_MATRIX_MV',
            type: mat4Type.copy({ storage: MusesGLSLStorage.uniform }),
            variable: new MusesVariableDeclaration({
                name: 'MUSES_MATRIX_MV',
                type: new MusesTypeDeclaration({ name: 'mat4' }),
                storage: MusesGLSLStorage.uniform
            }),
        }),
        new MusesContextVariable({ 
            name: 'MUSES_MATRIX_M', 
            type: mat4Type.copy({ storage: MusesGLSLStorage.uniform }),
            variable: new MusesVariableDeclaration({
                name: 'MUSES_MATRIX_M',
                type: new MusesTypeDeclaration({ name: 'mat4' }),
                storage: MusesGLSLStorage.uniform
            }),
        }),
        new MusesContextVariable({ 
            name: 'MUSES_MATRIX_V', 
            type: mat4Type.copy({ storage: MusesGLSLStorage.uniform }),
            variable: new MusesVariableDeclaration({
                name: 'MUSES_MATRIX_V',
                type: new MusesTypeDeclaration({ name: 'mat4' }),
                storage: MusesGLSLStorage.uniform
            }),
        }),
        new MusesContextVariable({ 
            name: 'MUSES_MATRIX_P', 
            type: mat4Type.copy({ storage: MusesGLSLStorage.uniform }),
            variable: new MusesVariableDeclaration({
                name: 'MUSES_MATRIX_P',
                type: new MusesTypeDeclaration({ name: 'mat4' }),
                storage: MusesGLSLStorage.uniform
            }),
        }),
        new MusesContextVariable({ 
            name: 'MUSES_POSITION', 
            type: vec4Type.copy({ storage: MusesGLSLStorage.attribute }),
            variable: new MusesVariableDeclaration({
                name: 'MUSES_POSITION',
                type: new MusesTypeDeclaration({ name: 'vec4' }),
                storage: MusesGLSLStorage.attribute
            }),
        }),
        new MusesContextVariable({ 
            name: 'MUSES_NORMAL',
            type: vec3Type.copy({ storage: MusesGLSLStorage.attribute }),
            variable: new MusesVariableDeclaration({
                name: 'MUSES_NORMAL',
                type: new MusesTypeDeclaration({ name: 'vec3' }),
                storage: MusesGLSLStorage.attribute
            }),
        }),
        new MusesContextVariable({ 
            name: 'MUSES_TEXCOORD', 
            type: vec2Type.copy({ storage: MusesGLSLStorage.attribute }),
            variable: new MusesVariableDeclaration({
                name: 'MUSES_TEXCOORD',
                type: new MusesTypeDeclaration({ name: 'vec2' }),
                storage: MusesGLSLStorage.attribute
            }),
        }),
        new MusesContextVariable({
            name: 'MUSES_TANGENT',
            type: vec3Type.copy({ storage: MusesGLSLStorage.attribute }),
            variable: new MusesVariableDeclaration({
                name: 'MUSES_TANGENT',
                type: new MusesTypeDeclaration({ name: 'vec3' }),
                storage: MusesGLSLStorage.attribute
            }),
         }),
    ],
    functions: [
        new MusesContextFunction('dot', floatType, [
            new MusesContextVariable({ name: 'glsl', type: vec3Type }),
            new MusesContextVariable({ name: 'glsl', type: vec3Type })
        ]),
    ],
};