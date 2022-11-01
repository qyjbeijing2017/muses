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

const boolType          = new MusesContextType({ name: 'bool'           ,rules:[{test: /bool\(int\)/},{test: /bool\(float\)/}]});
const intType           = new MusesContextType({ name: 'int'            ,rules:[{test: /int\(float\)/}]});
const floatType         = new MusesContextType({ name: 'float'          ,rules:[{test: /float\(int\)/}]});
const vec2Type          = new MusesContextType({ name: 'vec2'           ,rules:[]});
const vec3Type          = new MusesContextType({ name: 'vec3'           ,rules:[]});
const vec4Type          = new MusesContextType({ name: 'vec4'           ,rules:[]});
const mat2Type          = new MusesContextType({ name: 'mat2'           ,rules:[]});
const mat3Type          = new MusesContextType({ name: 'mat3'           ,rules:[]});
const mat4Type          = new MusesContextType({ name: 'mat4'           ,rules:[]});
const sampler2DType     = new MusesContextType({ name: 'sampler2D'      ,rules:[]});
const sampler3DTyoe     = new MusesContextType({ name: 'sampler3D'      ,rules:[]});
const samplerCubeType   = new MusesContextType({ name: 'samplerCube'    ,rules:[]});
const voidType          = new MusesContextType({ name: 'void'           ,rules:[]});

const ctx = new MusesContext({
    types: [
        vec2Type        ,
        vec3Type        ,
        vec4Type        ,
        mat2Type        ,
        mat3Type        ,
        mat4Type        ,
        sampler2DType   ,
        sampler3DTyoe   ,
        samplerCubeType ,
        voidType        ,
        boolType        ,
        intType         ,
        floatType       ,
    ],
});

ast.check(ctx);

fs.writeFileSync('./test/ctx.json', JSON.stringify(ctx, null, 2));
