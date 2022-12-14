import { IProperty } from '../../../properties/properties';
import { getFunctionSignature, IParseCtx, parseGLSL } from './glsl/glsl-prarser';
import { GLSLContext } from './glsl/glsl-context';
import { visit } from './glsl/glsl-visiter'
import { IIdentifierReference } from './glsl/ast-interface/expression/identifier-reference';
import { ICallExpression } from './glsl/ast-interface/expression/call-expression';
import { IProgram } from './glsl/ast-interface/program';

export class Code {
    constructor(readonly source: string, readonly type: 'GLSL' | 'HLSL' | 'CG') {
    }

    parseToAst(options?: {
        includes?: { [key: string]: string };
        defines?: { [key: string]: Object };
        properties?: IProperty[];
        instance?: boolean;
    }): {
        vertex: IProgram;
        fragment: IProgram;
    } {
        let codeCtx: IParseCtx | null = null;

        switch (this.type) {
            case 'GLSL':
                codeCtx = this.fromGLSL(options);
                break;
            case 'HLSL':
                codeCtx = this.fromHLSL(options);
                break;
            case 'CG':
                codeCtx = this.fromCG(options);
                break;
            default:
                codeCtx = this.fromGLSL(options);
                break;
        }

        if (codeCtx === null) {
            throw new Error(`Unsupported code type ${this.type}`);
        }

        const ast = codeCtx.ast;
        const fragNode = ast.statements.find((s) => s.type === 'functionDeclaration' && s.name === codeCtx?.fragmentFunctionName);
        const vertNode = ast.statements.find((s) => s.type === 'functionDeclaration' && s.name === codeCtx?.vertexFunctionName);
        if (fragNode === undefined || vertNode === undefined) {
            throw new Error(`Could not find fragment or vertex function in code`);
        }
        const ctx = ast.ctx;
        const vertRefs = new Set<string>();
        visit(vertNode, {
            identifierReference: {
                enter: (node) => {
                    const identifierReference: IIdentifierReference = node as IIdentifierReference;
                    if(ctx.getVariable(identifierReference.name)){
                        vertRefs.add(identifierReference.name);
                    }
                }
            },
            callExpression: {
                enter: (node) => {
                    const callExpression: ICallExpression = node as ICallExpression;
                    const sign = getFunctionSignature(callExpression);
                    if(ctx.getVariable(sign)){
                        vertRefs.add(callExpression.callee.name);
                    }
                }
            }
        });
        const fragRefs = new Set<string>();
        visit(fragNode, {
            identifierReference: {
                enter: (node) => {
                    const identifierReference: IIdentifierReference = node as IIdentifierReference;
                    if(ctx.getVariable(identifierReference.name)){
                        fragRefs.add(identifierReference.name);
                    }
                }
            },
            callExpression: {
                enter: (node) => {
                    const callExpression: ICallExpression = node as ICallExpression;
                    const sign = getFunctionSignature(callExpression);
                    if(ctx.getVariable(sign)){
                        vertRefs.add(callExpression.callee.name);
                    }
                }
            }
        });
        console.log(vertRefs, fragRefs);

        const vertAst:IProgram = {
            type: 'program',
            statements: ast.statements.filter((s) => {
                if(s.type === 'functionDeclaration'){
                    return s.name === codeCtx?.vertexFunctionName || vertRefs.has(s.name);
                }
                if(s.type === 'variableDeclaration'){
                    return vertRefs.has(s.name);
                }
                return true;
            }),
            ctx: ast.ctx,
        }

        const fragAst:IProgram = {
            type: 'program',
            statements: ast.statements.filter((s) => {
                if(s.type === 'functionDeclaration'){
                    return s.name === codeCtx?.fragmentFunctionName || fragRefs.has(s.name);
                }
                if(s.type === 'variableDeclaration'){
                    return fragRefs.has(s.name);
                }
                return true;
            }),
            ctx: ast.ctx,
        }

        return {
            vertex: vertAst,
            fragment: fragAst,
        };
    }

    private fromGLSL(options?: {
        includes?: { [key: string]: string };
        defines?: { [key: string]: Object };
        properties?: IProperty[];
        instance?: boolean;
    }) {
        const ctx = parseGLSL(this.source, {
            defines: options?.defines ? options.defines : {},
            includes: options?.includes ? options.includes : {},
            properties: options?.properties ? options.properties : [],
            instance: options?.instance ? options.instance : false,
            ast: {
                type: 'program',
                statements: [],
                ctx: new GLSLContext(),
            },
        });

        return ctx;
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