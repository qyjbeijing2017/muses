import { IProperty } from "../../../../properties/properties";
import preprocess from '@shaderfrog/glsl-parser/dist/preprocessor';
import { IProgram } from "./ast-interface/program";
import { glslLexer } from "./lexer";
import { glslParser } from "./parser";
import { glslVisitor } from "./visiter";
import { IFunctionDeclaration } from "./ast-interface/declaration/function-declaration";
import { ICallExpression } from "./ast-interface/expression/call-expression";

function properties2glsl(options: {
    properties: IProperty[]
    instance?: boolean;
}) {
    const stroage = options.instance ? 'attribute' : 'uniform';
    return options.properties.map((property) => {
        switch (property.type) {
            case 'Int':
                return `${stroage} highp int ${property.name};`;
            case 'Float':
                return `${stroage} highp float ${property.name};`;
            case 'Range':
                return `${stroage} highp float ${property.name};`;
            case 'Color':
                return `${stroage} lowp vec4 ${property.name};`;
            case 'Vector':
                return `${stroage} highp vec4 ${property.name};`;
            case '2D':
                return `${stroage} sampler2D ${property.name};`;
            case '3D':
                return `${stroage} sampler2D ${property.name};`;
            case 'Cube':
                return `${stroage} samplerCube ${property.name};`;
            default:
                throw new Error(`Unsupported property type ${property.type}`);
        }
    }).join('\n');
}

export function parseGLSLChunk(chunk: string, ctx: IProgram, isCompileDefine: boolean = false) {
    const lex = glslLexer.tokenize(chunk);
    if (lex.errors.length > 0) {
        throw new Error(lex.errors[0].message);
    }
    glslParser.input = lex.tokens;
    const cst = isCompileDefine ? glslParser.compilerDefinition() : glslParser.glsl();
    if (glslParser.errors.length > 0) {
        throw new Error(glslParser.errors[0].message);
    }
    glslVisitor.programCtx = ctx;
    const ast = glslVisitor.visit(cst) as IProgram;
    return ast;
}

export interface IParseCtx{
    defines: { [key: string]: Object },
    includes: { [key: string]: string },
    properties: IProperty[];
    instance: boolean;
    ast: IProgram;
    vertexFunctionName?: string;
    fragmentFunctionName?: string;
}

export function parseGLSL(source: string, parseCtx: IParseCtx) {
    let code = source;

    parseCtx.vertexFunctionName = source.match(/#pragma\s+vertex\s+(\w+)/)?.[1] || 'vertex';
    parseCtx.fragmentFunctionName = source.match(/#pragma\s+fragment\s+(\w+)/)?.[1] || 'fragment';
    code = code.replace(/#pragma\s+vertex\s+(\w+)/, '');
    code = code.replace(/#pragma\s+fragment\s+(\w+)/, '');

    const includeRegex = /#include\s+"(\w+)"/g;
    let match;
    while (match = includeRegex.exec(code)) {
        const includeName = match[1];
        let includeSource = parseCtx.includes[includeName] || null;
        if (includeSource) {
            const isCompileDefine = includeSource.match(/#pragma\s+compiler/);
            if (isCompileDefine) {
                includeSource = includeSource.replace(/#pragma\s+compiler/, '');
                parseCtx.ast = parseGLSLChunk(includeSource, parseCtx.ast, true);
            }else{
                parseCtx.ast = parseGLSLChunk(includeSource, parseCtx.ast);
            }
        } else {
            throw new Error(`Include ${includeName} not found`);
        }
        code = code.replace(match[0], '');
    }
    code = preprocess(code, {
        defines: parseCtx?.defines,
    });

    if(parseCtx.properties){
        const propertiesCode = properties2glsl(parseCtx);
        parseCtx.ast = parseGLSLChunk(propertiesCode, parseCtx.ast);
    }
    parseCtx.ast = parseGLSLChunk(code, parseCtx.ast);
    return parseCtx;
}

export function getFunctionSignature(func:IFunctionDeclaration | ICallExpression) {
    if(func.type === 'functionDeclaration'){
        return `${func.name}(${func.parameters.map((param) => param.typeName).join(',')})`;
    }else{
        return `${func.callee.name}(${func.params.map((arg) => arg.typeName).join(',')})`;
    }
}