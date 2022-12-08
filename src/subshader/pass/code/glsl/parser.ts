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

    // variableDeclaratorStatement = this.RULE("variableDeclaratorStatement", () => {
    //     const variableDeclaration = this.SUBRULE(this.variableDeclaration);
    //     this.CONSUME(musesToken.Semicolon);
    //     return variableDeclaration;
    // });

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
            { ALT: () => specifier.name = this.CONSUME(musesToken.Void).image },
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
            throw new Error(`Type ${specifier.name} not found`);
        }

        return specifier;
    });

    // variableDeclaration = this.RULE("variableDeclaration", () => {
    //     const variableDeclaration: IVariableDeclaration = {
    //         type: 'variableDeclaration',
    //         declarators: [],
    //     }
    //     let constants = false;
    //     let storage: 'in' | 'out' | 'inout' | 'uniform' | 'varying' | 'attribute' | undefined;
    //     let percision: 'lowp' | 'mediump' | 'highp' | undefined;

    //     this.OPTION(() => constants = this.CONSUME(musesToken.Const) ? true : false);
    //     this.OPTION1(() => storage = this.CONSUME(musesToken.StorageQualifiers).image as 'in' | 'out' | 'inout' | 'uniform' | 'varying' | 'attribute');
    //     this.OPTION2(() => percision = this.CONSUME(musesToken.PercisionQualifiers).image as 'lowp' | 'mediump' | 'highp');
    //     const typeSpecifier = this.SUBRULE(this.typeSpecifier);
    //     this.MANY_SEP({
    //         SEP: musesToken.Comma,
    //         DEF: () => {
    //             const declarator: IVariableDeclarator = {
    //                 type: 'variableDeclarator',
    //                 name: '',
    //                 typeName: typeSpecifier.name,
    //                 typeSpecifier: typeSpecifier,
    //                 percision,
    //                 storage,
    //                 const: constants,
    //             }

    //             declarator.name = this.CONSUME(musesToken.Identifier).image;
    //             this.OPTION3(() => {
    //                 this.CONSUME(musesToken.Assign);
    //             });

    //             this.context.setVariable(declarator);
    //             variableDeclaration.declarators.push(declarator);
    //         }
    //     });


    //     if (variableDeclaration.declarators.length === 0 && !typeSpecifier.isStruct) {
    //         throw new Error(`Need a identifier to declaration a variable`);
    //     }
    //     if (percision && typeSpecifier.isStruct) {
    //         throw new Error(`Struct ${typeSpecifier.name} cannot be qualifered by ${percision}!`);
    //     }
    //     // this.CONSUME(musesToken.Semicolon);
    //     return variableDeclaration;
    // });

    // functionDeclaration = this.RULE("functionDeclaration", () => {
    //     const functionDeclaration: IFunctionDeclaration = {
    //         type: 'functionDeclaration',
    //         name: '',
    //         returnType: '',
    //         parameters: [],
    //     };

    //     this.OR([
    //         { ALT: () => functionDeclaration.returnType = this.CONSUME(musesToken.Void).image },
    //         { ALT: () => functionDeclaration.returnType = this.CONSUME(musesToken.Identifier).image },
    //         { ALT: () => functionDeclaration.returnType = this.CONSUME(musesToken.Types).image },
    //     ]);
    //     if (functionDeclaration.returnType !== 'void') {
    //         const typeCtx = this.context.getType(functionDeclaration.returnType);
    //         if (!typeCtx) {
    //             throw new Error(`Type ${functionDeclaration.returnType} not found`);
    //         }
    //     }

    //     functionDeclaration.name = this.CONSUME1(musesToken.Identifier).image;
    //     this.context.addFunctionScope();
    //     this.CONSUME2(musesToken.LeftParen);
    //     this.MANY_SEP({
    //         SEP: musesToken.Comma,
    //         DEF: () => {
    //             const declaration = this.SUBRULE(this.variableDeclaration);
    //             if (!Array.isArray(declaration.declarators)) {
    //                 return;
    //             }
    //             if (declaration.declarators.length !== 1) {
    //                 throw new Error(`Function param define error!`);
    //             }
    //             const declarator = declaration.declarators[0];
    //             if (declarator.typeSpecifier.type === 'structDeclaration') {
    //                 throw new Error(`Struct cannot be declaration in function parama`);
    //             }
    //             if (
    //                 declarator.storage === 'attribute' ||
    //                 declarator.storage === 'uniform' ||
    //                 declarator.storage === 'varying'
    //             ) {
    //                 throw new Error(`Qualifer ${declaration.declarators[0].storage} cannot be used in function param!`)
    //             }
    //             functionDeclaration.parameters.push(declarator);
    //         }
    //     });
    //     this.CONSUME3(musesToken.RightParen);
    //     this.context.setFunction(functionDeclaration);
    //     this.OR1([
    //         { ALT: () => this.CONSUME(musesToken.Semicolon) },
    //         { ALT: () => this.SUBRULE1(this.blockStatement) },
    //     ])
    //     return functionDeclaration;
    // });

    variableDeclarator = this.RULE("variableDeclarator", () => {
        const declarators = [] as IVariableDeclarator[];
        this.MANY_SEP({
            SEP: musesToken.Comma,
            DEF: () => {
                const declarator: IVariableDeclarator = {
                    type: 'variableDeclarator',
                    name: '',
                    typeName: '',
                    typeSpecifier: {
                        type: 'typeSpecifier',
                        name: '',
                    },
                }

                declarator.name = this.CONSUME(musesToken.Identifier).image;
                this.OPTION3(() => {
                    this.CONSUME(musesToken.Assign);
                });

                this.context.setVariable(declarator);
                declarators.push(declarator);
            }
        });
        return declarators;
    });

    variableDeclaration = this.RULE("variableDeclaration", () => {
        // variable declaration
        const variableDeclaration: IVariableDeclaration = {
            type: 'variableDeclaration',
            declarators: [],
        }
        let constants = false;
        let storage: 'in' | 'out' | 'inout' | 'uniform' | 'varying' | 'attribute' | undefined;
        let percision: 'lowp' | 'mediump' | 'highp' | undefined;

        // rule
        this.OPTION(() => constants = this.CONSUME(musesToken.Const) ? true : false);
        this.OPTION1(() => storage = this.CONSUME(musesToken.StorageQualifiers).image as 'in' | 'out' | 'inout' | 'uniform' | 'varying' | 'attribute');
        this.OPTION2(() => percision = this.CONSUME(musesToken.PercisionQualifiers).image as 'lowp' | 'mediump' | 'highp');
        const typeSpecifier = this.SUBRULE(this.typeSpecifier);
        variableDeclaration.declarators = this.SUBRULE(this.variableDeclarator);

        if(!Array.isArray(variableDeclaration.declarators)) {
            return variableDeclaration;
        }

        variableDeclaration.declarators.map((declarator) => {
            declarator.const = constants;
            declarator.storage = storage;
            declarator.percision = percision;
            declarator.typeSpecifier = typeSpecifier;
            return declarator;
        });

        // check
        if (typeSpecifier.isStruct) {
            throw new Error(`Struct must be declaration in global scope!`);
        }
        if (variableDeclaration.declarators.length < 1) {
            throw new Error(`Need a identifier to declaration a variable!`);
        }
        const declarator = variableDeclaration.declarators[0];
        if (declarator.typeName === 'void') {
            throw new Error(`Variable cannot be void type!`);
        }
        this.CONSUME(musesToken.Semicolon);
        return variableDeclaration;
    });

    // functionDeclaration = this.RULE("functionDeclaration", () => {
    //     // variable declaration
    //     const functionDeclaration: IFunctionDeclaration = {
    //         type: 'functionDeclaration',
    //         name: '',
    //         parameters: [],
    //         returnType: {
    //             type: 'typeSpecifier',
    //             name: '',
    //         },
    //         returnTypeName: '',
    //     }
    //     functionDeclaration.returnType = this.SUBRULE(this.typeSpecifier);
    //     functionDeclaration.returnTypeName = functionDeclaration.returnType.name;
    //     functionDeclaration.name = this.CONSUME(musesToken.Identifier).image;
    //     this.context.addFunctionScope();
    //     this.CONSUME2(musesToken.LeftParen);
    //     this.MANY_SEP({
    //         SEP: musesToken.Comma,
    //         DEF: () => {
    //             const declaration = this.SUBRULE(this.variableDeclaration);
    //             if (!Array.isArray(declaration.declarators)) {
    //                 return;
    //             }
    //             if (declaration.declarators.length !== 1) {
    //                 throw new Error(`Function param define error!`);
    //             }
    //             const declarator = declaration.declarators[0];
    //             if (declarator.typeSpecifier.type === 'structDeclaration') {
    //                 throw new Error(`Struct cannot be declaration in function parama`);
    //             }
    //             if (
    //                 declarator.storage === 'attribute' ||
    //                 declarator.storage === 'uniform' ||
    //                 declarator.storage === 'varying'
    //             ) {
    //                 throw new Error(`Qualifer ${declaration.declarators[0].storage} cannot be used in function param!`)
    //             }
    //             functionDeclaration.parameters.push(declarator);
    //         }
    //     });
    //     this.CONSUME3(musesToken.RightParen);
    //     this.context.setFunction(functionDeclaration);
    //     this.OR([
    //         { ALT: () => {
    //             this.CONSUME(musesToken.Semicolon);
    //             this.context.popScope();
    //         }},
    //         { ALT: () => this.SUBRULE1(this.blockStatement) },
    //     ]);
    //     return functionDeclaration;
    // });

    declarationStatement = this.RULE("declarationStatement", () => {
        let declaration: IFunctionDeclaration | IVariableDeclaration | undefined;
        let constants = false;
        let storage: 'in' | 'out' | 'inout' | 'uniform' | 'varying' | 'attribute' | undefined;
        let percision: 'lowp' | 'mediump' | 'highp' | undefined;

        this.OPTION(() => constants = this.CONSUME(musesToken.Const) ? true : false);
        this.OPTION1(() => storage = this.CONSUME(musesToken.StorageQualifiers).image as 'in' | 'out' | 'inout' | 'uniform' | 'varying' | 'attribute');
        this.OPTION2(() => percision = this.CONSUME(musesToken.PercisionQualifiers).image as 'lowp' | 'mediump' | 'highp');
        const typeSpecifier = this.SUBRULE(this.typeSpecifier);
        this.OR([
            {
                ALT: () => {
                    const functionDeclaration: IFunctionDeclaration = {
                        type: 'functionDeclaration',
                        name: '',
                        returnTypeName: '',
                        returnType: typeSpecifier,
                        parameters: [],
                    };
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
                        { ALT: () => {
                            this.CONSUME(musesToken.Semicolon);
                            this.context.popScope();
                        }},
                        { ALT: () => this.SUBRULE1(this.blockStatement) },
                    ]);
                }
            },
            {
                ALT: () => {
                    // variable declaration
                    declaration = {
                        type: 'variableDeclaration',
                        declarators: [],
                    }

                    // rule
                    declaration.declarators = this.SUBRULE(this.variableDeclarator);

                    if(!Array.isArray(declaration.declarators)) {
                        return declaration;
                    }
                    declaration.declarators.map((declarator) => {
                        declarator.const = constants;
                        declarator.storage = storage;
                        declarator.percision = percision;
                        declarator.typeSpecifier = typeSpecifier;
                        return declarator;
                    });


                    // check
                    if (!Array.isArray(declaration.declarators)) {
                        return;
                    }
                    if (declaration.declarators.length === 0 && !typeSpecifier.isStruct) {
                        throw new Error(`Need a identifier to declaration a variable`);
                    }
                    if (percision && typeSpecifier.isStruct) {
                        throw new Error(`Struct ${typeSpecifier.name} cannot be qualifered by ${percision}!`);
                    }
                    if (declaration.declarators.length >= 1) {
                        const declarator = declaration.declarators[0];
                        if (declarator.typeName === 'void') {
                            throw new Error(`Variable cannot be void type!`);
                        }
                    }
                    this.CONSUME(musesToken.Semicolon);
                }
            },
        ]);

        return declaration!;
    });
    // #endregion

    glsl = this.RULE("glsl", () => {
        const program: IProgram = {
            type: 'program',
            statements: [],
        }
        this.MANY(() => {
            this.OR([
                { ALT: () => program.statements.push(this.SUBRULE(this.declarationStatement)) },
            ]);
        });
        return program;
    });
    // #endregion
}

export const glslParser = new GlslParser();
