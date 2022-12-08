import { EmbeddedActionsParser } from "chevrotain";
import { IFunctionDeclaration } from "./ast-interface/declaration/function-declaration";
import { IStructDeclaration } from "./ast-interface/declaration/struct-declaration";
import { IVariableDeclaration, IVariableDeclarator } from "./ast-interface/declaration/variable-declaration";
import { IProgram } from "./ast-interface/program";
import { IBlockStatement } from "./ast-interface/statement/block-statement";
import { IStatement } from "./ast-interface/statement/statement";
import { ITypeSpecifier } from "./ast-interface/type-specifier";
import { GLSLContext } from "./glsl-context";
import { musesToken, musesTokens } from "./lexer";

export class GlslParser extends EmbeddedActionsParser {
    constructor() {
        super(musesTokens);
        this.performSelfAnalysis();
    }
    context: GLSLContext = new GLSLContext();

    variableDeclaratorStatement = this.RULE("variableDeclaratorStatement", () => {
        const variableDeclaration = this.SUBRULE(this.variableDeclaration);
        this.CONSUME(musesToken.Semicolon);
        return variableDeclaration;
    });

    statement = this.RULE("statement", (): IStatement => {
        let statement: IStatement | undefined;
        this.OR([
            { ALT: () => statement = this.SUBRULE(this.blockStatement) },
            { ALT: () => statement = this.SUBRULE(this.variableDeclaration) },
        ]);
        return statement!;
    });

    blockStatement = this.RULE("blockStatement", () => {
        const blockStatement: IBlockStatement = {
            type: 'blockStatement',
            body: [],
        }

        this.CONSUME(musesToken.LeftBrace);
        this.context.addScope();
        this.MANY(() => {
            blockStatement.body.push(this.SUBRULE(this.statement));
        });
        this.context.popScope();
        this.CONSUME(musesToken.RightBrace);

        return blockStatement;
    });

    // #region Declarations
    structDeclaration = this.RULE("structDeclaration", () => {
        const struct: IStructDeclaration = {
            isStruct: true,
            type: 'structDeclaration',
            name: '',
            rules: [],
            members: [],
        }

        this.CONSUME(musesToken.Struct);
        struct.name = this.CONSUME(musesToken.Identifier).image;
        this.CONSUME(musesToken.LeftBrace);
        this.context.addScope();
        this.MANY(() => {
            const declaration = this.SUBRULE(this.variableDeclaration);

            declaration.declarators?.forEach(declarator => {
                if (declarator.const) {
                    throw new Error(`Struct member can't be const!`);
                }
                if (declarator.storage) {
                    throw new Error(`Struct member can't have storage qualifier!`);
                }

                struct.rules.push({
                    test: new RegExp(`${struct.name}\.${declarator.name}`),
                    returnType: declaration.typeName,
                });
            });

            struct.members.push(declaration);
        });
        this.context.popScope();
        this.CONSUME(musesToken.RightBrace);

        this.context.setStruct(struct);

        return struct
    });

    typeSpecifier = this.RULE("typeSpecifier", () => {
        const specifier: ITypeSpecifier = {
            type: 'typeSpecifier',
            name: '',
            isStruct: false,
        };
        this.OR([
            { ALT: () => specifier.name = this.CONSUME(musesToken.Identifier).image },
            { ALT: () => specifier.name = this.CONSUME(musesToken.Types).image },
            {
                ALT: () => {
                    const structDeclaration = this.SUBRULE(this.structDeclaration);
                    Object.assign(specifier, structDeclaration);
                }
            },
        ]);
        const typeCtx = this.context.getType(specifier.name);
        if (!typeCtx) {
            throw new Error(`Type ${name} not found`);
        }

        return specifier;
    });

    variableDeclaration = this.RULE("variableDeclaration", () => {
        const variableDeclaration: IVariableDeclaration = {
            type: 'variableDeclaration',
            declarators: [],
        }
        let constants = false;
        let storage: 'in' | 'out' | 'inout' | 'uniform' | 'varying' | 'attribute' | undefined;
        let percision: 'lowp' | 'mediump' | 'highp' | undefined;

        this.OPTION(() => constants = this.CONSUME(musesToken.Const) ? true : false);
        this.OPTION1(() => storage = this.CONSUME(musesToken.StorageQualifiers).image as 'in' | 'out' | 'inout' | 'uniform' | 'varying' | 'attribute');
        this.OPTION2(() => percision = this.CONSUME(musesToken.PercisionQualifiers).image as 'lowp' | 'mediump' | 'highp');
        const typeSpecifier = this.SUBRULE(this.typeSpecifier);
        this.MANY_SEP({
            SEP: musesToken.Comma,
            DEF: () => {
                const declarator: IVariableDeclarator = {
                    type: 'variableDeclarator',
                    name: '',
                    typeName: typeSpecifier.name,
                    typeSpecifier: typeSpecifier,
                    percision,
                    storage,
                    const: constants,
                }

                declarator.name = this.CONSUME(musesToken.Identifier).image;
                this.OPTION3(() => {
                    this.CONSUME(musesToken.Assign);
                });

                this.context.setVariable(declarator);
                variableDeclaration.declarators.push(declarator);
            }
        });
        
        if (variableDeclaration.declarators.length === 0 && !typeSpecifier.isStruct) {
            throw new Error(`Need a identifier to declaration a variable`);
        }
        if (percision && typeSpecifier.isStruct) {
            throw new Error(`Struct ${typeSpecifier.name} cannot be qualifered by ${percision}!`);
        }
        return variableDeclaration;
    });

    functionDeclaration = this.RULE("functionDeclaration", () => {
        const functionDeclaration: IFunctionDeclaration = {
            type: 'functionDeclaration',
            name: '',
            returnType: '',
            parameters: [],
        };

        this.OR([
            { ALT: () => functionDeclaration.returnType = this.CONSUME(musesToken.Void).image },
            { ALT: () => functionDeclaration.returnType = this.CONSUME(musesToken.Identifier).image },
            { ALT: () => functionDeclaration.returnType = this.CONSUME(musesToken.Types).image },
        ]);
        if (functionDeclaration.returnType !== 'void') {
            const typeCtx = this.context.getType(functionDeclaration.returnType);
            if (!typeCtx) {
                throw new Error(`Type ${functionDeclaration.returnType} not found`);
            }
        }

        functionDeclaration.name = this.CONSUME1(musesToken.Identifier).image;
        this.context.addFunctionScope();
        this.CONSUME2(musesToken.LeftParen);
        this.MANY_SEP({
            SEP: musesToken.Comma,
            DEF: () => {
                const declaration = this.SUBRULE(this.variableDeclaration);
                if (!Array.isArray(declaration.declarators)) {
                    return;
                }
                if (declaration.declarators.length !== 1) {
                    throw new Error(`Function param define error!`);
                }
                const declarator = declaration.declarators[0];
                if (declarator.typeSpecifier.type === 'structDeclaration') {
                    throw new Error(`Struct cannot be declaration in function parama`);
                }
                if (
                    declarator.storage === 'attribute' ||
                    declarator.storage === 'uniform' ||
                    declarator.storage === 'varying'
                ) {
                    throw new Error(`Qualifer ${declaration.declarators[0].storage} cannot be used in function param!`)
                }
                functionDeclaration.parameters.push(declarator);
            }
        });
        this.CONSUME3(musesToken.RightParen);
        this.context.setFunction(functionDeclaration);
        this.OR1([
            { ALT: () => this.CONSUME(musesToken.Semicolon) },
            { ALT: () => this.SUBRULE1(this.blockStatement) },
        ])
        return functionDeclaration;
    });
    // #endregion

    glsl = this.RULE("glsl", () => {
        const program: IProgram = {
            type: 'program',
            statements: [],
        }
        this.MANY(() => {
            this.OR([
                {
                    ALT: () => {
                        const declaration = this.SUBRULE(this.variableDeclaratorStatement);
                        if (Array.isArray(declaration.declarators) && declaration.declarators.length > 0) {
                            if (
                                declaration.declarators[0].storage === 'in' ||
                                declaration.declarators[0].storage === 'out' ||
                                declaration.declarators[0].storage === 'inout'
                            ) {
                                throw new Error(`Qualifer ${declaration.declarators[0].storage} only be used in function param!`)
                            }
                        }
                        program.statements.push(declaration);
                    }
                },
                { ALT: () => program.statements.push(this.SUBRULE1(this.functionDeclaration)) },
            ]);
        });
        return program;
    });
    // #endregion
}

export const glslParser = new GlslParser();
