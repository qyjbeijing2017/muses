import { CstParser } from "chevrotain";
import {
    AddAssign,
    And,
    Assign,
    Attribute,
    Bool,
    Break,
    BVec2,
    BVec3,
    BVec4,
    Colon,
    Comma,
    Const,
    ConstFloat,
    ConstInt,
    ConstString,
    Continue,
    Dec,
    DivAssign,
    Divide,
    Do,
    Dot,
    Else,
    ENDGLSL,
    Equal,
    FallBack,
    False,
    Float,
    For,
    GLSLPROGRAM,
    GreaterThen,
    GreaterThenEqual,
    Highp,
    Identifier,
    If,
    Inc,
    Int,
    IVec2,
    IVec3,
    IVec4,
    LeftBrace,
    LeftBracket,
    LeftParen,
    LessThen,
    LessThenEqual,
    Lowp,
    Mat2,
    Mat3,
    Mat4,
    Mediump,
    Minus,
    ModAssign,
    MulAssign,
    Multiply,
    musesTokens,
    Not,
    NotEqual,
    Or,
    Pass,
    Plus,
    Properties,
    QuestionMark,
    Return,
    RightBrace,
    RightBracket,
    RightParen,
    Sampler1D,
    Sampler1DShadow,
    Sampler2D,
    Sampler2DShadow,
    Sampler3D,
    SamplerCube,
    Semicolon,
    Shader,
    Struct,
    SubAssign,
    SubShader,
    True,
    Uniform,
    Varying,
    Vec2,
    Vec3,
    Vec4,
    Void,
    While
} from "./lexer";

export class MusesParser extends CstParser {
    constructor() {
        super(musesTokens);
        this.performSelfAnalysis();
    }

    properties = this.RULE("properties", () => {
        this.CONSUME(Properties);
        this.CONSUME(LeftBrace);
        this.CONSUME(RightBrace);
    });

    // #region GLSL

    typeDeclaration = this.RULE("typeDeclaration", () => {
        this.OR([
            { ALT: () => this.CONSUME(Void, { LABEL: 'name' }) },
            { ALT: () => this.CONSUME(Int, { LABEL: 'name' }) },
            { ALT: () => this.CONSUME(Float, { LABEL: 'name' }) },
            { ALT: () => this.CONSUME(Bool, { LABEL: 'name' }) },
            { ALT: () => this.CONSUME(Vec2, { LABEL: 'name' }) },
            { ALT: () => this.CONSUME(Vec3, { LABEL: 'name' }) },
            { ALT: () => this.CONSUME(Vec4, { LABEL: 'name' }) },
            { ALT: () => this.CONSUME(BVec2, { LABEL: 'name' }) },
            { ALT: () => this.CONSUME(BVec3, { LABEL: 'name' }) },
            { ALT: () => this.CONSUME(BVec4, { LABEL: 'name' }) },
            { ALT: () => this.CONSUME(IVec2, { LABEL: 'name' }) },
            { ALT: () => this.CONSUME(IVec3, { LABEL: 'name' }) },
            { ALT: () => this.CONSUME(IVec4, { LABEL: 'name' }) },
            { ALT: () => this.CONSUME(Mat2, { LABEL: 'name' }) },
            { ALT: () => this.CONSUME(Mat3, { LABEL: 'name' }) },
            { ALT: () => this.CONSUME(Mat4, { LABEL: 'name' }) },
            { ALT: () => this.CONSUME(Sampler1DShadow, { LABEL: 'name' }) },
            { ALT: () => this.CONSUME(Sampler2DShadow, { LABEL: 'name' }) },
            { ALT: () => this.CONSUME(Sampler1D, { LABEL: 'name' }) },
            { ALT: () => this.CONSUME(Sampler2D, { LABEL: 'name' }) },
            { ALT: () => this.CONSUME(Sampler3D, { LABEL: 'name' }) },
            { ALT: () => this.CONSUME(SamplerCube, { LABEL: 'name' }) },
            { ALT: () => this.CONSUME(Identifier, { LABEL: 'name' }) },
        ]);
    });

    variableConstrucor = this.RULE("variableConstrucor", () => {
        this.SUBRULE(this.typeDeclaration, { LABEL: 'type' });
        this.OPTION(() => {
            this.CONSUME(LeftParen);
            this.MANY_SEP({
                SEP: Comma,
                DEF: () => {
                    this.OR([
                        { ALT: () => this.CONSUME(ConstFloat, { LABEL: 'args' }) },
                        { ALT: () => this.CONSUME(ConstInt, { LABEL: 'args' }) },
                        { ALT: () => this.CONSUME(True, { LABEL: 'args' }) },
                        { ALT: () => this.CONSUME(False, { LABEL: 'args' }) },
                        { ALT: () => this.CONSUME(Identifier, { LABEL: 'args' }) },
                    ]);
                }
            });
            this.CONSUME(RightParen);
        });
    });

    // #region expression
    parenExpression = this.RULE("parenExpression", () => {
        this.CONSUME(LeftParen);
        this.SUBRULE(this.assignExpression, { LABEL: 'expression' });
        this.CONSUME(RightParen);
    });

    atomicExpression = this.RULE("atomicExpression", () => {
        this.OR([
            { ALT: () => this.CONSUME(ConstFloat, { LABEL: "const" }) },
            { ALT: () => this.CONSUME(ConstInt, { LABEL: "const" }) },
            { ALT: () => this.CONSUME(True, { LABEL: "const" }) },
            { ALT: () => this.CONSUME(False, { LABEL: "const" }) },
            { ALT: () => this.SUBRULE(this.variableConstrucor, { LABEL: "subExpression" }) },
            { ALT: () => this.SUBRULE(this.parenExpression, { LABEL: "subExpression" }) },
        ]);
    });

    indexExpression = this.RULE("indexExpression", () => {
        this.CONSUME(LeftBracket);
        this.SUBRULE(this.assignExpression, { LABEL: 'index' });
        this.CONSUME(RightBracket);
    });

    callExpression = this.RULE("callExpression", () => {
        this.CONSUME(LeftParen);
        this.MANY_SEP({
            SEP: Comma,
            DEF: () => this.SUBRULE(this.assignExpression, { LABEL: 'args' }),
        });
        this.CONSUME(RightParen);
    });

    dotExpression = this.RULE("dotExpression", () => {
        this.CONSUME(Dot);
        this.CONSUME(Identifier);
    });

    updateExpression = this.RULE("updateExpression", () => {
        this.OR([
            { ALT: () => this.CONSUME(Inc, { LABEL: "operator" }) },
            { ALT: () => this.CONSUME(Dec, { LABEL: "operator" }) },
        ]);
    });

    postfixExpression = this.RULE("postfixExpression", () => {
        this.SUBRULE(this.atomicExpression, { LABEL: "argument" });
        this.MANY(() => {
            this.OR([
                { ALT: () => this.SUBRULE(this.dotExpression, { LABEL: "operator" }) },
                { ALT: () => this.SUBRULE(this.updateExpression, { LABEL: "operator" }) },
                { ALT: () => this.SUBRULE(this.callExpression, { LABEL: "operator" }) },
                { ALT: () => this.SUBRULE(this.indexExpression, { LABEL: "operator" }) },
            ]);
        });
    });

    unaryExpression = this.RULE("unaryExpression", () => {
        this.OR([
            {
                ALT: () => {
                    this.CONSUME(Minus, { LABEL: "operator" });
                    this.SUBRULE(this.unaryExpression, { LABEL: "argument" });
                }
            },
            {
                ALT: () => {
                    this.CONSUME(Plus, { LABEL: "operator" });
                    this.SUBRULE1(this.unaryExpression, { LABEL: "argument" });
                }
            },
            {
                ALT: () => {
                    this.CONSUME(Inc, { LABEL: "operator" });
                    this.SUBRULE2(this.unaryExpression, { LABEL: "argument" });
                }
            },
            {
                ALT: () => {
                    this.CONSUME(Dec, { LABEL: "operator" });
                    this.SUBRULE3(this.unaryExpression, { LABEL: "argument" });
                }
            },
            {
                ALT: () => {
                    this.CONSUME(Not, { LABEL: "operator" });
                    this.SUBRULE4(this.unaryExpression, { LABEL: "argument" });
                }
            },
            {
                ALT: () => {
                    this.SUBRULE5(this.postfixExpression, { LABEL: "argument" });
                }
            }
        ]);
    });

    multiplicativeExpression = this.RULE("multiplicativeExpression", () => {
        this.SUBRULE(this.unaryExpression, { LABEL: "left" });
        this.MANY(() => {
            this.OR([
                { ALT: () => this.CONSUME(Multiply, { LABEL: "operator" }) },
                { ALT: () => this.CONSUME(Divide, { LABEL: "operator" }) }
            ]);
            this.SUBRULE1(this.unaryExpression, { LABEL: "right" });
        });
    });

    addtiveExpression = this.RULE("addtiveExpression", () => {
        this.SUBRULE(this.multiplicativeExpression, { LABEL: "left" });
        this.MANY(() => {
            this.OR([
                { ALT: () => this.CONSUME(Plus, { LABEL: "operator" }) },
                { ALT: () => this.CONSUME(Minus, { LABEL: "operator" }) }
            ]);
            this.SUBRULE1(this.multiplicativeExpression, { LABEL: "right" });
        });
    });

    relationExpression = this.RULE("relationExpression", () => {
        this.SUBRULE(this.addtiveExpression, { LABEL: "left" });
        this.MANY(() => {
            this.OR([
                { ALT: () => this.CONSUME(GreaterThen, { LABEL: "operator" }) },
                { ALT: () => this.CONSUME(GreaterThenEqual, { LABEL: "operator" }) },
                { ALT: () => this.CONSUME(LessThen, { LABEL: "operator" }) },
                { ALT: () => this.CONSUME(LessThenEqual, { LABEL: "operator" }) }
            ]);
            this.SUBRULE1(this.addtiveExpression, { LABEL: "right" });
        });
    });

    equalityExpression = this.RULE("equalityExpression", () => {
        this.SUBRULE(this.relationExpression, { LABEL: "left" });
        this.MANY(() => {
            this.OR([
                { ALT: () => this.CONSUME(Equal, { LABEL: "operator" }) },
                { ALT: () => this.CONSUME(NotEqual, { LABEL: "operator" }) },
            ]);
            this.SUBRULE1(this.relationExpression, { LABEL: "right" });
        });
    });

    andExpression = this.RULE("andExpression", () => {
        this.SUBRULE(this.equalityExpression, { LABEL: "left" });
        this.MANY(() => {
            this.CONSUME(And, { LABEL: "operator" });
            this.SUBRULE1(this.equalityExpression, { LABEL: "right" });
        });
    });

    xorExpression = this.RULE("xorExpression", () => {
        this.SUBRULE(this.andExpression, { LABEL: "left" });
        this.MANY(() => {
            this.CONSUME(Or);
            this.SUBRULE1(this.andExpression, { LABEL: "left" });
        });
    });

    orExpression = this.RULE("orExpression", () => {
        this.SUBRULE(this.xorExpression, { LABEL: "left" });
        this.MANY(() => {
            this.CONSUME(Or, { LABEL: "operator" });
            this.SUBRULE1(this.xorExpression, { LABEL: "right" });
        });
    });

    conditionalExpression = this.RULE("conditionalExpression", () => {
        this.SUBRULE(this.orExpression, { LABEL: "testExpression" });
        this.OPTION(() => {
            this.CONSUME(QuestionMark);
            this.SUBRULE1(this.conditionalExpression, { LABEL: "trueExpression" });
            this.CONSUME(Colon);
            this.SUBRULE2(this.conditionalExpression, { LABEL: "falseExpression" });
        });
    });

    assignExpression = this.RULE("assignExpression", () => {
        this.SUBRULE(this.conditionalExpression, { LABEL: "left" });
        this.OPTION(() => {
            this.OR([
                { ALT: () => this.CONSUME(Assign, { LABEL: 'operator' }) },
                { ALT: () => this.CONSUME(AddAssign, { LABEL: 'operator' }) },
                { ALT: () => this.CONSUME(SubAssign, { LABEL: 'operator' }) },
                { ALT: () => this.CONSUME(MulAssign, { LABEL: 'operator' }) },
                { ALT: () => this.CONSUME(DivAssign, { LABEL: 'operator' }) },
            ]);
            this.SUBRULE2(this.assignExpression, { LABEL: "right" });
        });
    });
    // #endregion

    // #region statements
    blockStatement = this.RULE("blockStatement", () => {
        this.CONSUME(LeftBrace);
        this.MANY(() => {
            this.OR([
                { ALT: () => this.SUBRULE(this.expressionStatement, { LABEL: "statement" }) },
                { ALT: () => this.SUBRULE(this.ifStatement, { LABEL: "statement" }) },
                { ALT: () => this.SUBRULE(this.whileStatement, { LABEL: "statement" }) },
                { ALT: () => this.SUBRULE(this.doWhileStatement, { LABEL: "statement" }) },
                { ALT: () => this.SUBRULE(this.forStatement, { LABEL: "statement" }) },
                { ALT: () => this.SUBRULE(this.returnStatement, { LABEL: "statement" }) },
                { ALT: () => this.SUBRULE(this.breakStatement, { LABEL: "statement" }) },
                { ALT: () => this.SUBRULE(this.continueStatement, { LABEL: "statement" }) },
                { ALT: () => this.SUBRULE(this.variableDeclaration, { LABEL: "statement" }) },
                { ALT: () => this.SUBRULE(this.blockStatement, { LABEL: "statement" }) },
            ]);
        });
        this.CONSUME(RightBrace);
    });

    ifStatement = this.RULE("ifStatement", () => {
        this.CONSUME(If);
        this.CONSUME(LeftParen);
        this.SUBRULE(this.assignExpression, { LABEL: "test" });
        this.CONSUME(RightParen);
        this.SUBRULE(this.blockStatement, { LABEL: "consequent" });
        this.OPTION(() => {
            this.CONSUME(Else);
            this.OR([
                { ALT: () => this.SUBRULE1(this.blockStatement, { LABEL: "alternate" }) },
                { ALT: () => this.SUBRULE(this.ifStatement, { LABEL: "alternate" }) },
            ]);
        });
    });

    whileStatement = this.RULE("whileStatement", () => {
        this.CONSUME(While);
        this.CONSUME(LeftParen);
        this.SUBRULE(this.assignExpression, { LABEL: "testExpression" });
        this.CONSUME(RightParen);
        this.SUBRULE(this.blockStatement, { LABEL: "statement" });
    });

    doWhileStatement = this.RULE("doWhileStatement", () => {
        this.CONSUME(Do);
        this.SUBRULE(this.blockStatement, { LABEL: "statement" });
        this.CONSUME(While);
        this.CONSUME(LeftParen);
        this.SUBRULE(this.assignExpression, { LABEL: "testExpression" });
        this.CONSUME(RightParen);
        this.CONSUME(Semicolon);
    });

    forStatement = this.RULE("forStatement", () => {
        this.CONSUME(For);
        this.CONSUME(LeftParen);
        this.OPTION(() => {
            this.OR([
                { ALT: () => this.SUBRULE(this.variableDeclaration, { LABEL: "init" }) },
                { ALT: () => this.SUBRULE(this.expressionStatement, { LABEL: "init" }) },
            ]);
        });
        this.CONSUME(Semicolon);
        this.SUBRULE(this.assignExpression, { LABEL: "test" });
        this.CONSUME1(Semicolon);
        this.OPTION1(() => {
            this.SUBRULE1(this.assignExpression, { LABEL: "update" });
        });
        this.CONSUME(RightParen);
        this.SUBRULE2(this.blockStatement, { LABEL: "statement" });
    });

    expressionStatement = this.RULE("expressionStatement", () => {
        this.SUBRULE(this.assignExpression, { LABEL: "expression" });
        this.CONSUME(Semicolon);
    });

    returnStatement = this.RULE("returnStatement", () => {
        this.CONSUME(Return);
        this.OPTION(() => {
            this.SUBRULE(this.assignExpression, { LABEL: "expression" });
        });
        this.CONSUME(Semicolon);
    });

    continueStatement = this.RULE("continueStatement", () => {
        this.CONSUME(Continue);
        this.CONSUME(Semicolon);
    });

    breakStatement = this.RULE("breakStatement", () => {
        this.CONSUME(Break);
        this.CONSUME(Semicolon);
    });
    // #endregion

    // #region declaration
    structMemberDeclaration = this.RULE("structMemberDeclaration", () => {
        this.OPTION1(() => this.SUBRULE1(this.percisionDeclaration, { LABEL: 'percision' }));
        this.SUBRULE2(this.typeDeclaration, { LABEL: "type" });
        this.CONSUME(Identifier, { LABEL: "name" });
        this.CONSUME(Semicolon);
    });

    structDeclaration = this.RULE("structDeclaration", () => {
        this.CONSUME(Struct);
        this.CONSUME(Identifier, { LABEL: "name" });
        this.CONSUME(LeftBrace);
        this.MANY(() => {
            this.SUBRULE(this.structMemberDeclaration, { LABEL: "members" });
        });
        this.CONSUME(RightBrace);
        this.MANY_SEP({
            SEP: Comma,
            DEF: () => this.CONSUME2(Identifier, { LABEL: "variables" })
        });
        this.CONSUME(Semicolon);
    });

    storageDeclaration = this.RULE("storageDeclaration", () => {
        this.OR([
            { ALT: () => this.CONSUME(Const, { LABEL: 'name' }) },
            { ALT: () => this.CONSUME(Attribute, { LABEL: 'name' }) },
            { ALT: () => this.CONSUME(Uniform, { LABEL: 'name' }) },
            { ALT: () => this.CONSUME(Varying, { LABEL: 'name' }) },
        ]);
    });

    percisionDeclaration = this.RULE("percisionDeclaration", () => {
        this.OR([
            { ALT: () => this.CONSUME(Highp, { LABEL: 'name' }) },
            { ALT: () => this.CONSUME(Mediump, { LABEL: 'name' }) },
            { ALT: () => this.CONSUME(Lowp, { LABEL: 'name' }) },
        ]);
    });

    variableAssignment = this.RULE("variableAssignment", () => {
        this.CONSUME(Identifier, { LABEL: 'name' });
        this.OPTION(() => {
            this.CONSUME(Assign);
            this.SUBRULE(this.assignExpression, { LABEL: 'value' });
        });
    });

    variableDeclaration = this.RULE("variableDeclaration", () => {
        this.OPTION(() => this.SUBRULE(this.storageDeclaration, { LABEL: 'storage' }));
        this.OPTION1(() => this.SUBRULE1(this.percisionDeclaration, { LABEL: 'percision' }));
        this.SUBRULE2(this.typeDeclaration, { LABEL: "type" });
        this.AT_LEAST_ONE_SEP({
            SEP: Comma,
            DEF: () => {
                this.SUBRULE3(this.variableAssignment, { LABEL: 'assignment' });
            },
        });
        this.CONSUME(Semicolon);
    });

    functionParameterDeclaration = this.RULE("functionParameterDeclaration", () => {

        this.OPTION(() => this.SUBRULE(this.percisionDeclaration, { LABEL: 'percision' }));
        this.SUBRULE(this.typeDeclaration, { LABEL: "type" });
        this.CONSUME(Identifier, { LABEL: "name" });
    });

    functionDeclaration = this.RULE("functionDeclaration", () => {
        this.SUBRULE(this.typeDeclaration, { LABEL: "returnType" });
        this.CONSUME(Identifier, { LABEL: "name" });
        this.CONSUME(LeftParen);
        this.MANY_SEP({
            SEP: Comma,
            DEF: () => this.SUBRULE(this.variableDeclaration, { LABEL: "parameters" }),
        });
        this.CONSUME(RightParen);
        this.SUBRULE(this.blockStatement, { LABEL: "body" });
    });
    // #endregion

    glsl = this.RULE("glsl", () => {
        this.CONSUME(GLSLPROGRAM);
        this.AT_LEAST_ONE(() => {
            this.OR([
                { ALT: () => this.SUBRULE(this.variableDeclaration, { LABEL: 'body' }) },
                { ALT: () => this.SUBRULE(this.functionDeclaration, { LABEL: 'body' }) },
                { ALT: () => this.SUBRULE(this.structDeclaration, { LABEL: 'body' }) },
            ]);
        });
        this.CONSUME(ENDGLSL);
    });
    // #endregion

    pass = this.RULE("pass", () => {
        this.CONSUME(Pass);
        this.CONSUME(LeftBrace);
        this.OR([
            { ALT: () => this.SUBRULE(this.glsl, { LABEL: 'glsl' }) },
        ]);
        this.CONSUME(RightBrace);
    });

    subshader = this.RULE("subshader", () => {
        this.CONSUME(SubShader);
        this.CONSUME(LeftBrace);
        this.AT_LEAST_ONE(() => {
            this.SUBRULE(this.pass, { LABEL: "passes" });
        });
        this.CONSUME(RightBrace);
    });

    fallback = this.RULE("fallback", () => {
        this.CONSUME(FallBack);
        this.CONSUME(ConstString, { LABEL: "to" });
    });

    shader = this.RULE("shader", () => {
        this.CONSUME(Shader);
        this.CONSUME(ConstString, { LABEL: "name" });
        this.CONSUME(LeftBrace);
        this.OPTION(() => this.SUBRULE(this.properties, { LABEL: "properties" }));
        this.AT_LEAST_ONE(() => this.SUBRULE2(this.subshader, { LABEL: "subshader" }));
        this.OPTION2(() => this.SUBRULE3(this.fallback, { LABEL: "fallback" }));
        this.CONSUME(RightBrace);
    });
}

export const musesParser = new MusesParser();
