import { CstParser } from "chevrotain";
import { musesToken, musesTokens } from "./lexer";

export class GlslParser extends CstParser {
    constructor() {
        super(musesTokens);
        this.performSelfAnalysis();
    }

    parenExpression = this.RULE("parenExpression", () => {
        this.CONSUME(musesToken.LeftParen);
        this.SUBRULE(this.assignExpression, { LABEL: 'expression' });
        this.CONSUME(musesToken.RightParen);
    });

    auto = this.RULE("auto", () => {
        this.OR([
            { ALT: () => this.CONSUME(musesToken.Literials, { LABEL: 'literial' }) },
            { ALT: () => this.CONSUME(musesToken.Identifier, { LABEL: 'identifier' }) },
            { ALT: () => this.CONSUME(musesToken.Types, { LABEL: 'type' }) },
            { ALT: () => this.SUBRULE(this.parenExpression, { LABEL: 'expression' }) },
        ]);
    });

    indexExpression = this.RULE("indexExpression", () => {
        this.CONSUME(musesToken.LeftBracket);
        this.OPTION(() => this.SUBRULE(this.assignExpression, { LABEL: 'index' }));
        this.CONSUME(musesToken.RightBracket);
    });

    callExpression = this.RULE("callExpression", () => {
        this.CONSUME(musesToken.LeftParen);
        this.MANY_SEP({
            SEP: musesToken.Comma,
            DEF: () => this.SUBRULE(this.assignExpression, { LABEL: 'params' }),
        });
        this.CONSUME(musesToken.RightParen);
    });

    dotExpression = this.RULE("dotExpression", () => {
        this.CONSUME(musesToken.Dot);
        this.CONSUME(musesToken.Identifier, { LABEL: 'memberName' });
    });

    updateExpression = this.RULE("updateExpression", () => {
        this.OR([
            { ALT: () => this.CONSUME(musesToken.Inc, { LABEL: "operator" }) },
            { ALT: () => this.CONSUME(musesToken.Dec, { LABEL: "operator" }) },
        ]);
    });

    postfixExpression = this.RULE("postfixExpression", () => {
        this.SUBRULE(this.auto, { LABEL: "operand" });
        this.MANY(() => {
            this.OR([
                { ALT: () => this.SUBRULE(this.dotExpression, { LABEL: "operations" }) },
                { ALT: () => this.SUBRULE(this.updateExpression, { LABEL: "operations" }) },
                { ALT: () => this.SUBRULE(this.callExpression, { LABEL: "operations" }) },
                { ALT: () => this.SUBRULE(this.indexExpression, { LABEL: "operations" }) },
            ]);
        });
    });

    unaryExpression = this.RULE("unaryExpression", () => {
        this.OR([
            {
                ALT: () => {
                    this.CONSUME(musesToken.Minus, { LABEL: "operator" });
                    this.SUBRULE(this.unaryExpression, { LABEL: "operand" });
                }
            },
            {
                ALT: () => {
                    this.CONSUME(musesToken.Plus, { LABEL: "operator" });
                    this.SUBRULE1(this.unaryExpression, { LABEL: "operand" });
                }
            },
            {
                ALT: () => {
                    this.CONSUME(musesToken.Inc, { LABEL: "operator" });
                    this.SUBRULE2(this.unaryExpression, { LABEL: "operand" });
                }
            },
            {
                ALT: () => {
                    this.CONSUME(musesToken.Dec, { LABEL: "operator" });
                    this.SUBRULE3(this.unaryExpression, { LABEL: "operand" });
                }
            },
            {
                ALT: () => {
                    this.CONSUME(musesToken.Not, { LABEL: "operator" });
                    this.SUBRULE4(this.unaryExpression, { LABEL: "operand" });
                }
            },
            {
                ALT: () => {
                    this.SUBRULE5(this.postfixExpression, { LABEL: "operand" });
                }
            }
        ]);
    });

    multiplicativeExpression = this.RULE("multiplicativeExpression", () => {
        this.SUBRULE(this.unaryExpression, { LABEL: "left" });
        this.MANY(() => {
            this.OR([
                { ALT: () => this.CONSUME(musesToken.Multiply, { LABEL: "operator" }) },
                { ALT: () => this.CONSUME(musesToken.Divide, { LABEL: "operator" }) }
            ]);
            this.SUBRULE1(this.unaryExpression, { LABEL: "right" });
        });
    });

    addtiveExpression = this.RULE("addtiveExpression", () => {
        this.SUBRULE(this.multiplicativeExpression, { LABEL: "left" });
        this.MANY(() => {
            this.OR([
                { ALT: () => this.CONSUME(musesToken.Plus, { LABEL: "operator" }) },
                { ALT: () => this.CONSUME(musesToken.Minus, { LABEL: "operator" }) }
            ]);
            this.SUBRULE1(this.multiplicativeExpression, { LABEL: "right" });
        });
    });

    relationExpression = this.RULE("relationExpression", () => {
        this.SUBRULE(this.addtiveExpression, { LABEL: "left" });
        this.MANY(() => {
            this.OR([
                { ALT: () => this.CONSUME(musesToken.GreaterThen, { LABEL: "operator" }) },
                { ALT: () => this.CONSUME(musesToken.GreaterThenEqual, { LABEL: "operator" }) },
                { ALT: () => this.CONSUME(musesToken.LessThen, { LABEL: "operator" }) },
                { ALT: () => this.CONSUME(musesToken.LessThenEqual, { LABEL: "operator" }) }
            ]);
            this.SUBRULE1(this.addtiveExpression, { LABEL: "right" });
        });
    });

    equalityExpression = this.RULE("equalityExpression", () => {
        this.SUBRULE(this.relationExpression, { LABEL: "left" });
        this.MANY(() => {
            this.OR([
                { ALT: () => this.CONSUME(musesToken.Equal, { LABEL: "operator" }) },
                { ALT: () => this.CONSUME(musesToken.NotEqual, { LABEL: "operator" }) },
            ]);
            this.SUBRULE1(this.relationExpression, { LABEL: "right" });
        });
    });

    andExpression = this.RULE("andExpression", () => {
        this.SUBRULE(this.equalityExpression, { LABEL: "left" });
        this.MANY(() => {
            this.CONSUME(musesToken.And, { LABEL: "operator" });
            this.SUBRULE1(this.equalityExpression, { LABEL: "right" });
        });
    });

    xorExpression = this.RULE("xorExpression", () => {
        this.SUBRULE(this.andExpression, { LABEL: "left" });
        this.MANY(() => {
            this.CONSUME(musesToken.XOr, { LABEL: "operator" });
            this.SUBRULE1(this.andExpression, { LABEL: "left" });
        });
    });

    orExpression = this.RULE("orExpression", () => {
        this.SUBRULE(this.xorExpression, { LABEL: "left" });
        this.MANY(() => {
            this.CONSUME(musesToken.Or, { LABEL: "operator" });
            this.SUBRULE1(this.xorExpression, { LABEL: "right" });
        });
    });

    conditionalExpression = this.RULE("conditionalExpression", () => {
        this.SUBRULE(this.orExpression, { LABEL: "test" });
        this.OPTION(() => {
            this.CONSUME(musesToken.QuestionMark);
            this.SUBRULE1(this.conditionalExpression, { LABEL: "consequent" });
            this.CONSUME(musesToken.Colon);
            this.SUBRULE2(this.conditionalExpression, { LABEL: "alternate" });
        });
    });

    assignExpression = this.RULE("assignExpression", () => {
        this.SUBRULE(this.conditionalExpression, { LABEL: "left" });
        this.OPTION(() => {
            this.OR([
                { ALT: () => this.CONSUME(musesToken.Assign, { LABEL: 'operator' }) },
                { ALT: () => this.CONSUME(musesToken.AddAssign, { LABEL: 'operator' }) },
                { ALT: () => this.CONSUME(musesToken.SubAssign, { LABEL: 'operator' }) },
                { ALT: () => this.CONSUME(musesToken.MulAssign, { LABEL: 'operator' }) },
                { ALT: () => this.CONSUME(musesToken.DivAssign, { LABEL: 'operator' }) },
            ]);
            this.SUBRULE2(this.assignExpression, { LABEL: "right" });
        });
    });
    variableInitializer = this.RULE("variableInitializer", () => {
        this.CONSUME(musesToken.Identifier, { LABEL: "name" });
        this.OPTION(() => {
            this.OR([
                {
                    ALT: () => {
                        this.CONSUME(musesToken.LeftBracket);
                        this.SUBRULE(this.assignExpression, { LABEL: "arrayLength" });
                        this.CONSUME(musesToken.RightBracket);
                    }
                },
                {
                    ALT: () => {
                        this.CONSUME(musesToken.Assign);
                        this.SUBRULE1(this.assignExpression, { LABEL: "init" });
                    }
                },
            ]);
        });
    });

    variableDeclaration = this.RULE("variableDeclaration", () => {
        this.OPTION(() => this.CONSUME(musesToken.Const, { LABEL: "const" }));
        this.OPTION1(() => this.CONSUME(musesToken.PrecisionQualifiers, { LABEL: "precision" }));
        this.OR([
            { ALT: () => this.CONSUME(musesToken.Types, { LABEL: 'typeName' }) },
            { ALT: () => this.CONSUME(musesToken.Identifier, { LABEL: 'typeName' }) },
        ]);
        this.AT_LEAST_ONE_SEP({
            SEP: musesToken.Comma,
            DEF: () => {
                this.SUBRULE(this.variableInitializer, { LABEL: "variable" });
            },
        });
        this.CONSUME(musesToken.Semicolon);
    });

    expressionStatement = this.RULE("expressionStatement", () => {
        this.SUBRULE(this.assignExpression, { LABEL: "expression" });
        this.CONSUME(musesToken.Semicolon);
    });

    blockStatement = this.RULE("blockStatement", () => {
        this.CONSUME(musesToken.LeftBrace);
        this.MANY(() => {
            this.SUBRULE(this.statement, { LABEL: "statements" });
        });
        this.CONSUME(musesToken.RightBrace);
    });

    doStatement = this.RULE("doStatement", () => {
        this.CONSUME(musesToken.Do);
        this.SUBRULE(this.blockStatement, { LABEL: "body" });
        this.CONSUME(musesToken.While);
        this.CONSUME(musesToken.LeftParen);
        this.SUBRULE(this.assignExpression, { LABEL: "test" });
        this.CONSUME(musesToken.RightParen);
        this.CONSUME(musesToken.Semicolon);
    });

    whileStatement = this.RULE("whileStatement", () => {
        this.CONSUME(musesToken.While);
        this.CONSUME(musesToken.LeftParen);
        this.SUBRULE(this.assignExpression, { LABEL: "test" });
        this.CONSUME(musesToken.RightParen);
        this.SUBRULE(this.blockStatement, { LABEL: "body" });
    });

    forStatement = this.RULE("forStatement", () => {
        this.CONSUME(musesToken.For);
        this.CONSUME(musesToken.LeftParen);
        this.OR([
            { ALT: () => this.SUBRULE(this.variableDeclaration, { LABEL: "init" }) },
            { ALT: () => this.SUBRULE(this.expressionStatement, { LABEL: "init" }) },
            { ALT: () => this.CONSUME(musesToken.Semicolon) }
        ]);
        this.SUBRULE(this.assignExpression, { LABEL: "test" });
        this.CONSUME1(musesToken.Semicolon);
        this.OPTION(() => this.SUBRULE1(this.assignExpression, { LABEL: "update" }));
        this.CONSUME(musesToken.RightParen);
        this.SUBRULE(this.blockStatement, { LABEL: "body" });
    });

    ifStatement = this.RULE("ifStatement", () => {
        this.CONSUME(musesToken.If);
        this.CONSUME(musesToken.LeftParen);
        this.SUBRULE(this.assignExpression, { LABEL: "test" });
        this.CONSUME(musesToken.RightParen);
        this.SUBRULE(this.blockStatement, { LABEL: "consequent" });
        this.OPTION(() => {
            this.CONSUME(musesToken.Else);
            this.OR([
                { ALT: () => this.SUBRULE1(this.blockStatement, { LABEL: "alternate" }) },
                { ALT: () => this.SUBRULE(this.ifStatement, { LABEL: "alternate" }) },
            ]);
        });
    });

    switchCase = this.RULE("switchCase", () => {
        this.OR([
            { ALT: () => {
                this.CONSUME(musesToken.Case);
                this.SUBRULE(this.assignExpression, { LABEL: "test" });
            }},
            { ALT: () => this.CONSUME(musesToken.Default) },
        ]);
        this.CONSUME(musesToken.Colon);
        this.MANY(() => {
            this.SUBRULE(this.statement, { LABEL: "consequent" });
        });
    });

    switchStatement = this.RULE("switchStatement", () => {
        this.CONSUME(musesToken.Switch);
        this.CONSUME(musesToken.LeftParen);
        this.SUBRULE(this.assignExpression, { LABEL: "discriminant" });
        this.CONSUME(musesToken.RightParen);
        this.CONSUME(musesToken.LeftBrace);
        this.MANY(() => {
            this.SUBRULE(this.switchCase, { LABEL: "cases" });
        });
        this.CONSUME(musesToken.RightBrace);
    });

    returnStatement = this.RULE("returnStatement", () => {
        this.CONSUME(musesToken.Return);
        this.OPTION(() => {
            this.SUBRULE(this.assignExpression, { LABEL: "argument" });
        });
        this.CONSUME(musesToken.Semicolon);
    });

    breakStatement = this.RULE("breakStatement", () => {
        this.CONSUME(musesToken.Break);
        this.CONSUME(musesToken.Semicolon);
    });

    continueStatement = this.RULE("continueStatement", () => {
        this.CONSUME(musesToken.Continue);
        this.CONSUME(musesToken.Semicolon);
    });

    statement = this.RULE("statement", () => {
        this.OR([
            { ALT: () => this.SUBRULE(this.variableDeclaration, { LABEL: "statement" }) },
            { ALT: () => this.SUBRULE(this.blockStatement, { LABEL: "statement" }) },
            { ALT: () => this.SUBRULE(this.expressionStatement, { LABEL: "statement" }) },
            { ALT: () => this.SUBRULE(this.ifStatement, { LABEL: "statement" }) },
            { ALT: () => this.SUBRULE(this.switchStatement, { LABEL: "statement" }) },
            { ALT: () => this.SUBRULE(this.whileStatement, { LABEL: "statement" }) },
            { ALT: () => this.SUBRULE(this.forStatement, { LABEL: "statement" }) },
            { ALT: () => this.SUBRULE(this.doStatement, { LABEL: "statement" }) },
        ]);
    });

    structMemberDeclaration = this.RULE("structMemberDeclaration", () => {
        this.OPTION(() => this.CONSUME(musesToken.PrecisionQualifiers, { LABEL: "precision" }));
        this.OR([
            { ALT: () => this.CONSUME(musesToken.Types, { LABEL: 'typeName' }) },
            { ALT: () => this.CONSUME(musesToken.Identifier, { LABEL: 'typeName' }) },
        ]);
        this.AT_LEAST_ONE_SEP({
            SEP: musesToken.Comma,
            DEF: () => {
                this.CONSUME1(musesToken.Identifier, { LABEL: "variable" });
                this.OPTION1(() => {
                    this.CONSUME(musesToken.LeftBracket);
                    this.SUBRULE(this.assignExpression, { LABEL: "arrayLength" });
                    this.CONSUME(musesToken.RightBracket);
                });
            },
        });
        this.CONSUME(musesToken.Semicolon);
    });

    structDeclaration = this.RULE("structDeclaration", () => {
        this.CONSUME(musesToken.Struct);
        this.CONSUME(musesToken.Identifier, { LABEL: "name" });
        this.CONSUME(musesToken.LeftBrace);
        this.MANY(() => {
            this.SUBRULE(this.structMemberDeclaration, { LABEL: "members" });
        });
        this.CONSUME(musesToken.RightBrace);
        this.MANY_SEP1({
            SEP: musesToken.Comma,
            DEF: () => {
                this.CONSUME2(musesToken.Identifier, { LABEL: "variableName" });
            },
        });
        this.CONSUME1(musesToken.Semicolon);
    });

    globalVariableDeclarator = this.RULE("globalVariableDeclarator", () => {
        this.OPTION(() => this.CONSUME(musesToken.GlobalStorageQualifiers, { LABEL: "storage" }));
        this.OPTION1(() => this.CONSUME(musesToken.PrecisionQualifiers, { LABEL: "precision" }));
        this.OR([
            { ALT: () => this.CONSUME(musesToken.Types, { LABEL: 'typeName' }) },
            { ALT: () => this.CONSUME(musesToken.Identifier, { LABEL: 'typeName' }) },
        ]);
        this.AT_LEAST_ONE_SEP({
            SEP: musesToken.Comma,
            DEF: () => {
                this.SUBRULE(this.variableInitializer, { LABEL: "variable" });
            },
        });
        this.CONSUME(musesToken.Semicolon);
    });

    functionParameterDeclaration = this.RULE("functionParameterDeclaration", () => {
        this.OPTION(() => this.CONSUME(musesToken.Const, { LABEL: "const" }));
        this.OPTION1(() => this.CONSUME(musesToken.ParamStrorageQualifiers, { LABEL: "storage" }));
        this.OPTION2(() => this.CONSUME(musesToken.PrecisionQualifiers, { LABEL: "precision" }));
        this.OR([
            { ALT: () => this.CONSUME(musesToken.Types, { LABEL: 'typeName' }) },
            { ALT: () => this.CONSUME(musesToken.Identifier, { LABEL: 'typeName' }) },
        ]);
        this.CONSUME1(musesToken.Identifier, { LABEL: "name" });
        this.OPTION3(() => {
            this.CONSUME(musesToken.LeftBracket);
            this.SUBRULE(this.assignExpression, { LABEL: "arrayLength" });
            this.CONSUME(musesToken.RightBracket);
        });
    });

    functionDeclaration = this.RULE("functionDeclaration", () => {
        this.OR([
            { ALT: () => this.CONSUME(musesToken.Types, { LABEL: "returnTypeName" }) },
            { ALT: () => this.CONSUME(musesToken.Void, { LABEL: "returnTypeName" }) },
            { ALT: () => this.CONSUME(musesToken.Identifier, { LABEL: "returnTypeName" }) },
        ]);
        this.CONSUME1(musesToken.Identifier, { LABEL: "name" });
        this.CONSUME(musesToken.LeftParen);
        this.MANY_SEP({
            SEP: musesToken.Comma,
            DEF: () => {
                this.SUBRULE(this.functionParameterDeclaration, { LABEL: "parameters" });
            },
        });
        this.CONSUME(musesToken.RightParen);
        this.OR1([
            { ALT: () => this.SUBRULE(this.blockStatement, { LABEL: "body" }) },
            { ALT: () => this.CONSUME(musesToken.Semicolon) },
        ]);
    });

    precisionDefinition = this.RULE("precisionDefinition", () => {
        this.CONSUME(musesToken.Precision);
        this.CONSUME(musesToken.PrecisionQualifiers, { LABEL: "precision" });
        this.CONSUME(musesToken.Types, { LABEL: "typeName" });
        this.CONSUME(musesToken.Semicolon);
    });

    globalStatement = this.RULE("globalStatement", () => {
        this.OR([
            { ALT: () => this.SUBRULE(this.functionDeclaration, { LABEL: "statement" }) },
            { ALT: () => this.SUBRULE(this.globalVariableDeclarator, { LABEL: "statement" }) },
            { ALT: () => this.SUBRULE(this.structDeclaration, { LABEL: "statement" }) },
            { ALT: () => this.SUBRULE(this.precisionDefinition, { LABEL: "statement" }) },
        ]);
    });

    glsl = this.RULE("glsl", () => {
        this.MANY(() => {
            this.SUBRULE(this.globalStatement, { LABEL: "statements" });
        });
    });

    compilerDefinition = this.RULE("compileDefinition", () => {
        this.MANY(() => {
            this.SUBRULE(this.globalStatement, { LABEL: "statements" });
        });
    });
    // #endregion
}

export const glslParser = new GlslParser();
