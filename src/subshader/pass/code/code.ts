import { parser } from '@shaderfrog/glsl-parser';
import { IProperty } from '../../../properties/properties';
import { MusesGLSL } from './glsl/ast/glsl';
import { MusesGLSLContext } from './glsl/context/glsl';
import { glslCtxDefine } from './glsl/context/glsl.ctx';
import { MusesPassContext } from './glsl/context/pass';
import { glslLexer } from './glsl/lexer';
import { glslParser } from './glsl/parser';
import { glslPreprocess } from './glsl/preprocess';
import { glslVisitor } from './glsl/visiter';

export class Code {
    constructor(readonly source: string, readonly type: 'GLSL' | 'HLSL' | 'CG') {
    }

    parseToAst(options?: {
        includes?: { [key: string]: string };
        defines?: { [key: string]: Object };
        properties?: IProperty[];
        instance?: boolean;
    }) {
        let codeTree: {
            ast: any,
            vertexFunctionName: string,
            fragmentFunctionName: string,
        } | null = null;

        switch (this.type) {
            case 'GLSL':
                codeTree = this.fromGLSL(options);
                break;
            case 'HLSL':
                codeTree = this.fromHLSL(options);
                break;
            case 'CG':
                codeTree = this.fromCG(options);
                break;
            default:
                codeTree = this.fromGLSL(options);
                break;
        }

        if(!codeTree) {
            throw new Error(`Unsupported code type ${this.type}`);
        }

        // get all global variables
        // visit(codeTree.ast, {
        //     function: {
        //         enter: (node) => {
        //             console.log(node);
        //         },
        //     }
        // })



        return {
            vertAst: codeTree.ast,
            fragAst: codeTree.ast,
        };
    }

    private fromGLSL(options?: {
        includes?: { [key: string]: string };
        defines?: { [key: string]: Object };
        properties?: IProperty[];
        instance?: boolean;
    }) {
        const { code, fragmentFunctionName, vertexFunctionName } = glslPreprocess(this.source, options);
        // parse
        // const ast = parser.parse(code);

        const lex = glslLexer.tokenize(code);
        if (lex.errors.length > 0) {
            throw new Error(lex.errors[0].message);
        }

        glslParser.input = lex.tokens;
        const ast = glslParser.glsl();
        if (glslParser.errors.length > 0) {
            throw new Error(glslParser.errors[0].message);
        }
        // const ast = glslVisitor.visit(cst) as MusesGLSL;

        // const ctx = new MusesPassContext(glslCtxDefine);
        // ast.check(ctx);

        return {
            ast: ast,
            vertexFunctionName,
            fragmentFunctionName,
        };
    }

    private fromHLSL(options?: {
        includes?: { [key: string]: string };
        defines?: { [key: string]: Object };
        properties?: IProperty[];
    }) {
        return null;
    }

    private fromCG(options?: {
        includes?: { [key: string]: string };
        defines?: { [key: string]: Object };
        properties?: IProperty[];
    }) {
        return null;
    }

}