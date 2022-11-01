import { musesLexer } from "../muses/lexer";
import * as fs from 'fs';
import { musesParser } from "../muses/parser";
import { musesVisitor } from "../muses/visiter";
import { MusesContext } from "../muses/ast/context/context";
import { MusesContextType } from "../muses/ast/context/type";

const filePath = './test/test.muses';
const outLexPath = './test/lex.json';
const outCstPath = './test/cts.json';
const outAstPath = './test/ast.json';
const text = fs.readFileSync(filePath, 'utf8');

const lexingResult = musesLexer.tokenize(text);
if (lexingResult.errors.length > 0) {
    console.log(lexingResult.errors);
    process.exit(1);
}
fs.writeFileSync(outLexPath, JSON.stringify(lexingResult, null, 2));

musesParser.input = lexingResult.tokens;
const cst = musesParser.shader();
if (musesParser.errors.length > 0) {
    console.log(musesParser.errors);
    process.exit(1);
}
fs.writeFileSync(outCstPath, JSON.stringify(cst, null, 2));

const ast = musesVisitor.visit(cst);
fs.writeFileSync(outAstPath, JSON.stringify(ast, null, 2));

const boolType = new MusesContextType({ name: 'bool', rules: [{ test: /^bool\(int\)$/ }, { test: /^bool\(float\)$/ }] });
const intType = new MusesContextType({ name: 'int', rules: [{ test: /^int\(float\)$/ }] });
const floatType = new MusesContextType({ name: 'float', rules: [{ test: /^float\(int\)$/ }] });
const vec2Type = new MusesContextType({
    name: 'vec2', rules: [
        { test: /^vec2\.[xy]$/, returnType: floatType },
        { test: /^vec2\.[rg]$/, returnType: floatType },
        { test: /^vec2\.[st]$/, returnType: floatType },
        { test: /^vec2\[int\]$/, returnType: floatType },
        { test: /^vec2\.[xy]{2}$/ },
        { test: /^vec2\.[rg]{2}$/ },
        { test: /^vec2\.[st]{2}$/ },
        { test: /^vec2\(float(,float){0,1}\)$/ },
        { test: /^vec2\(int(,int){0,1}\)$/ },
    ]
});
const vec3Type = new MusesContextType({
    name: 'vec3', rules: [
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
        { test: /^vec3\(float(,float){0,2}\)$/ },
        { test: /^vec3\(int(,int){0,2}\)$/ },
    ]
});
const vec4Type = new MusesContextType({
    name: 'vec4', rules: [
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
        { test: /^vec4\(float(,float){0,3}\)$/ },
        { test: /^vec4\(int(,int){0,3}\)$/ },
    ]
});
const mat2Type = new MusesContextType({ name: 'mat2', rules: [
    { test: /^mat2\.[int]$/, returnType: vec2Type },
    { test: /^mat2\(float(,float){0,3}\)$/, returnType: vec2Type },
    { test: /^mat2\(int(,int){0,3}\)$/, returnType: vec2Type },
    { test: /^mat2\(vec2(,vec2){0,1}\)$/, returnType: vec2Type },
] });
const mat3Type = new MusesContextType({ name: 'mat3', rules: [
    { test: /^mat3\.[int]$/, returnType: vec3Type },
    { test: /^mat3\(float(,float){0,8}\)$/, returnType: vec3Type },
    { test: /^mat3\(int(,int){0,8}\)$/, returnType: vec3Type },
    { test: /^mat3\(vec3(,vec3){0,2}\)$/, returnType: vec3Type },
] });
const mat4Type = new MusesContextType({ name: 'mat4', rules: [
    { test: /^mat4\.[int]$/, returnType: vec4Type },
    { test: /^mat4\(float(,float){0,15}\)$/, returnType: vec4Type },
    { test: /^mat4\(int(,int){0,15}\)$/, returnType: vec4Type },
    { test: /^mat4\(vec4(,vec4){0,3}\)$/, returnType: vec4Type },
] });
const sampler2DType = new MusesContextType({ name: 'sampler2D', rules: [] });
const sampler3DTyoe = new MusesContextType({ name: 'sampler3D', rules: [] });
const samplerCubeType = new MusesContextType({ name: 'samplerCube', rules: [] });
const voidType = new MusesContextType({ name: 'void', rules: [] });

const ctx = new MusesContext({
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
});

ast.check(ctx);

fs.writeFileSync('./test/ctx.json', JSON.stringify(ctx, null, 2));
