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
        { test: /^bool\[\]\[int\]/ },
        { test: /^bool\[\]\(\)$/, returnArray: true },
        { test: /^bool\[\]\(bool(,bool)*\)/, returnArray: true },
        { test: /^bool\[\]=bool\[\]$/, returnArray: true },
    ],
});
const intType = new MusesContextType({
    name: 'int', rules: [
        { test: /^int=int$/ },
        { test: /^int\+=int$/ },
        { test: /^int\-=int$/ },
        { test: /^int\*=int$/ },
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
        { test: /^float\+=float$/ },
        { test: /^float\-=float$/ },
        { test: /^float\*=float$/ },
        { test: /^float\(int\)$/ },
        { test: /^float\(bool\)$/ },
        { test: /^float\+float$/ },
        { test: /^float\-float$/ },
        { test: /^float\*float$/ },
        { test: /^float\/float$/ },
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
        { test: /^vec2\+=vec2$/ },
        { test: /^vec2\-=vec2$/ },
        { test: /^vec2\*=vec2$/ },
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
        { test: /^vec2\+vec2$/ },
        { test: /^vec2\*vec2$/ },
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
        { test: /^vec3\+=vec3$/ },
        { test: /^vec3\-=vec3$/ },
        { test: /^vec3\*=vec3$/ },
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
        { test: /^vec3\+vec3$/ },
        { test: /^vec3\-vec3$/ },
        { test: /^vec3\*vec3$/ },
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
        { test: /^vec4\+=vec4$/ },
        { test: /^vec4\-=vec4$/ },
        { test: /^vec4\*=vec4$/ },
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
        { test: /^vec4\+vec4$/ },
        { test: /^vec4\-vec4$/ },
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
        { test: /^mat2\(float(,float){0,3}\)$/ },
        { test: /^mat2\(int(,int){0,3}\)$/ },
        { test: /^mat2\(vec2(,vec2){0,1}\)$/ },
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
        { test: /^mat3\(float(,float){0,8}\)$/ },
        { test: /^mat3\(int(,int){0,8}\)$/ },
        { test: /^mat3\(vec3(,vec3){0,2}\)$/ },
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
        { test: /^mat4\(float(,float){0,15}\)$/ },
        { test: /^mat4\(int(,int){0,15}\)$/ },
        { test: /^mat4\(vec4(,vec4){0,3}\)$/ },
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
const sampler3DType = new MusesContextType({ name: 'sampler3D', rules: [{ test: /^sampler3D=sampler3D$/ }] });
const samplerCubeType = new MusesContextType({ name: 'samplerCube', rules: [{ test: /^samplerCube=samplerCube$/ }] });
const voidType = new MusesContextType({ name: 'void', rules: [] });

floatType.rules!.push(
    { test: /^float\*mat2$/, returnType: mat2Type },
    { test: /^float\*mat3$/, returnType: mat3Type },
    { test: /^float\*mat4$/, returnType: mat4Type },
    { test: /^float\*vec2$/, returnType: vec2Type },
    { test: /^float\*vec3$/, returnType: vec3Type },
    { test: /^float\*vec4$/, returnType: vec4Type },
);

export const glslTypes = {
    vec2Type,
    vec3Type,
    vec4Type,
    mat2Type,
    mat3Type,
    mat4Type,
    sampler2DType,
    sampler3DType,
    samplerCubeType,
    voidType,
    boolType,
    intType,
    floatType,
}


export const glslCtxDefine = {
    types: [
        vec2Type,
        vec3Type,
        vec4Type,
        mat2Type,
        mat3Type,
        mat4Type,
        sampler2DType,
        sampler3DType,
        samplerCubeType,
        voidType,
        boolType,
        intType,
        floatType,
    ],
    variables: [
        new MusesContextVariable({ name: 'gl_FragColor', type: vec4Type }),
        new MusesContextVariable({ name: 'gl_Position', type: vec4Type }),
    ],
    functions: [
        new MusesContextFunction('sin', floatType, [
            new MusesContextVariable({ name: 'a', type: floatType })
        ]),
        new MusesContextFunction('cos', floatType, [
            new MusesContextVariable({ name: 'a', type: floatType })
        ]),
        new MusesContextFunction('tan', floatType, [
            new MusesContextVariable({ name: 'a', type: floatType })
        ]),
        new MusesContextFunction('asin', floatType, [
            new MusesContextVariable({ name: 'a', type: floatType })
        ]),
        new MusesContextFunction('acos', floatType, [
            new MusesContextVariable({ name: 'a', type: floatType })
        ]),
        new MusesContextFunction('atan', floatType, [
            new MusesContextVariable({ name: 'a', type: floatType })
        ]),
        new MusesContextFunction('max', floatType, [
            new MusesContextVariable({ name: 'a', type: floatType }),
            new MusesContextVariable({ name: 'b', type: floatType })
        ]),
        new MusesContextFunction('min', floatType, [
            new MusesContextVariable({ name: 'a', type: floatType }),
            new MusesContextVariable({ name: 'b', type: floatType })
        ]),
        new MusesContextFunction('max', intType, [
            new MusesContextVariable({ name: 'a', type: intType }),
            new MusesContextVariable({ name: 'b', type: intType })
        ]),
        new MusesContextFunction('min', intType, [
            new MusesContextVariable({ name: 'a', type: intType }),
            new MusesContextVariable({ name: 'b', type: intType })
        ]),
        new MusesContextFunction('pow', floatType, [
            new MusesContextVariable({ name: 'a', type: floatType }),
            new MusesContextVariable({ name: 'b', type: floatType })
        ]),
        new MusesContextFunction('radians', floatType, [
            new MusesContextVariable({ name: 'degree', type: floatType })
        ]),
        new MusesContextFunction('degree', floatType, [
            new MusesContextVariable({ name: 'radians', type: floatType })
        ]),
        new MusesContextFunction('exp', floatType, [
            new MusesContextVariable({ name: 'x', type: floatType })
        ]),
        new MusesContextFunction('log', floatType, [
            new MusesContextVariable({ name: 'x', type: floatType })
        ]),
        new MusesContextFunction('exp2', floatType, [
            new MusesContextVariable({ name: 'x', type: floatType })
        ]),
        new MusesContextFunction('log2', floatType, [
            new MusesContextVariable({ name: 'x', type: floatType })
        ]),
        new MusesContextFunction('sqrt', floatType, [
            new MusesContextVariable({ name: 'x', type: floatType })
        ]),
        new MusesContextFunction('abs', floatType, [
            new MusesContextVariable({ name: 'x', type: floatType })
        ]),
        new MusesContextFunction('sign', floatType, [
            new MusesContextVariable({ name: 'x', type: floatType })
        ]),
        new MusesContextFunction('floor', floatType, [
            new MusesContextVariable({ name: 'x', type: floatType })
        ]),
        new MusesContextFunction('ceil', floatType, [
            new MusesContextVariable({ name: 'x', type: floatType })
        ]),
        new MusesContextFunction('fract', floatType, [
            new MusesContextVariable({ name: 'x', type: floatType })
        ]),
        new MusesContextFunction('mod', floatType, [
            new MusesContextVariable({ name: 'x', type: floatType }),
            new MusesContextVariable({ name: 'y', type: floatType })
        ]),
        new MusesContextFunction('clamp', floatType, [
            new MusesContextVariable({ name: 'x', type: floatType }),
            new MusesContextVariable({ name: 'min', type: floatType }),
            new MusesContextVariable({ name: 'max', type: floatType })
        ]),
        new MusesContextFunction('mix', floatType, [
            new MusesContextVariable({ name: 'x', type: floatType }),
            new MusesContextVariable({ name: 'y', type: floatType }),
            new MusesContextVariable({ name: 'a', type: floatType })
        ]),
        new MusesContextFunction('step', floatType, [
            new MusesContextVariable({ name: 'edge', type: floatType }),
            new MusesContextVariable({ name: 'x', type: floatType })
        ]),
        new MusesContextFunction('smoothstep', floatType, [
            new MusesContextVariable({ name: 'edge0', type: floatType }),
            new MusesContextVariable({ name: 'edge1', type: floatType }),
            new MusesContextVariable({ name: 'x', type: floatType })
        ]),
        new MusesContextFunction('length', floatType, [
            new MusesContextVariable({ name: 'a', type: vec2Type })
        ]),
        new MusesContextFunction('length', floatType, [
            new MusesContextVariable({ name: 'a', type: vec3Type })
        ]),
        new MusesContextFunction('length', floatType, [
            new MusesContextVariable({ name: 'a', type: vec4Type })
        ]),
        new MusesContextFunction('distance', floatType, [
            new MusesContextVariable({ name: 'a', type: vec2Type }),
            new MusesContextVariable({ name: 'b', type: vec2Type })
        ]),
        new MusesContextFunction('distance', floatType, [
            new MusesContextVariable({ name: 'a', type: vec3Type }),
            new MusesContextVariable({ name: 'b', type: vec3Type })
        ]),
        new MusesContextFunction('distance', floatType, [
            new MusesContextVariable({ name: 'a', type: vec4Type }),
            new MusesContextVariable({ name: 'b', type: vec4Type })
        ]),
        new MusesContextFunction('dot', floatType, [
            new MusesContextVariable({ name: 'a', type: vec2Type }),
            new MusesContextVariable({ name: 'b', type: vec2Type })
        ]),
        new MusesContextFunction('dot', floatType, [
            new MusesContextVariable({ name: 'a', type: vec3Type }),
            new MusesContextVariable({ name: 'b', type: vec3Type })
        ]),
        new MusesContextFunction('dot', floatType, [
            new MusesContextVariable({ name: 'a', type: vec4Type }),
            new MusesContextVariable({ name: 'b', type: vec4Type })
        ]),
        new MusesContextFunction('cross', vec2Type, [
            new MusesContextVariable({ name: 'a', type: vec2Type }),
            new MusesContextVariable({ name: 'b', type: vec2Type })
        ]),
        new MusesContextFunction('cross', vec3Type, [
            new MusesContextVariable({ name: 'a', type: vec3Type }),
            new MusesContextVariable({ name: 'b', type: vec3Type })
        ]),
        new MusesContextFunction('cross', vec4Type, [
            new MusesContextVariable({ name: 'a', type: vec4Type }),
            new MusesContextVariable({ name: 'b', type: vec4Type })
        ]),
        new MusesContextFunction('normalize', vec2Type, [
            new MusesContextVariable({ name: 'a', type: vec2Type })
        ]),
        new MusesContextFunction('normalize', vec3Type, [
            new MusesContextVariable({ name: 'a', type: vec3Type })
        ]),
        new MusesContextFunction('normalize', vec4Type, [
            new MusesContextVariable({ name: 'a', type: vec4Type })
        ]),
        new MusesContextFunction('faceforward', vec2Type, [
            new MusesContextVariable({ name: 'n', type: vec2Type }),
            new MusesContextVariable({ name: 'i', type: vec2Type }),
            new MusesContextVariable({ name: 'nref', type: vec2Type })
        ]),
        new MusesContextFunction('faceforward', vec3Type, [
            new MusesContextVariable({ name: 'n', type: vec3Type }),
            new MusesContextVariable({ name: 'i', type: vec3Type }),
            new MusesContextVariable({ name: 'nref', type: vec3Type })
        ]),
        new MusesContextFunction('faceforward', vec4Type, [
            new MusesContextVariable({ name: 'n', type: vec4Type }),
            new MusesContextVariable({ name: 'i', type: vec4Type }),
            new MusesContextVariable({ name: 'nref', type: vec4Type })
        ]),
        new MusesContextFunction('reflect', vec2Type, [
            new MusesContextVariable({ name: 'i', type: vec2Type }),
            new MusesContextVariable({ name: 'n', type: vec2Type })
        ]),
        new MusesContextFunction('reflect', vec3Type, [
            new MusesContextVariable({ name: 'i', type: vec3Type }),
            new MusesContextVariable({ name: 'n', type: vec3Type })
        ]),
        new MusesContextFunction('reflect', vec4Type, [
            new MusesContextVariable({ name: 'i', type: vec4Type }),
            new MusesContextVariable({ name: 'n', type: vec4Type })
        ]),
        new MusesContextFunction('texture2D', vec4Type, [
            new MusesContextVariable({ name: 'sample', type: sampler2DType }),
            new MusesContextVariable({ name: 'tex', type: vec2Type })
        ]),

    ],
};