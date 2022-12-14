import { CstParser } from "chevrotain";
import { musesToken, musesTokens } from "./lexer";

export class MusesParser extends CstParser {
    constructor() {
        super(musesTokens);
        this.performSelfAnalysis();
    }

    textureProperty = this.RULE("textureProperty", () => {
        this.OR([
            { ALT: () => this.CONSUME(musesToken.Properties2D, { LABEL: 'type' }) },
            { ALT: () => this.CONSUME(musesToken.Properties3D, { LABEL: 'type' }) },
            { ALT: () => this.CONSUME(musesToken.PropertiesCube, { LABEL: 'type' }) },
        ]);
        this.CONSUME(musesToken.RightParen);
        this.CONSUME(musesToken.Assign);
        this.CONSUME(musesToken.ConstString, { LABEL: "value" });
        this.CONSUME(musesToken.LeftBrace);
        this.CONSUME(musesToken.RightBrace);
    });

    vectorProperty = this.RULE("vectorProperty", () => {
        this.OR([
            { ALT: () => this.CONSUME(musesToken.PropertiesVector, { LABEL: 'type' }) },
            { ALT: () => this.CONSUME(musesToken.PropertiesColor, { LABEL: 'type' }) },
        ]);
        this.CONSUME(musesToken.RightParen);
        this.CONSUME(musesToken.Assign);
        this.CONSUME(musesToken.LeftParen);
        this.OR1([
            { ALT: () => this.CONSUME(musesToken.ConstFloat, { LABEL: "value" }) },
            { ALT: () => this.CONSUME(musesToken.ConstInt, { LABEL: "value" }) },
        ]);
        this.CONSUME(musesToken.Comma);
        this.OR2([
            { ALT: () => this.CONSUME1(musesToken.ConstFloat, { LABEL: "value" }) },
            { ALT: () => this.CONSUME1(musesToken.ConstInt, { LABEL: "value" }) },
        ]);
        this.CONSUME1(musesToken.Comma);
        this.OR3([
            { ALT: () => this.CONSUME2(musesToken.ConstFloat, { LABEL: "value" }) },
            { ALT: () => this.CONSUME2(musesToken.ConstInt, { LABEL: "value" }) },
        ]);
        this.CONSUME2(musesToken.Comma);
        this.OR4([
            { ALT: () => this.CONSUME3(musesToken.ConstFloat, { LABEL: "value" }) },
            { ALT: () => this.CONSUME3(musesToken.ConstInt, { LABEL: "value" }) },
        ]);
        this.CONSUME1(musesToken.RightParen);
    });

    floatProperty = this.RULE("floatProperty", () => {
        this.OR([
            { ALT: () => this.CONSUME(musesToken.PropertiesFloat, { LABEL: 'type' }) },
            {
                ALT: () => {
                    this.CONSUME(musesToken.PropertiesRange, { LABEL: 'type' });
                    this.CONSUME(musesToken.LeftParen);
                    this.OR1([
                        { ALT: () => this.CONSUME2(musesToken.ConstFloat, { LABEL: "range" }) },
                        { ALT: () => this.CONSUME2(musesToken.ConstInt, { LABEL: "range" }) },
                    ]);
                    this.CONSUME(musesToken.Comma);
                    this.OR2([
                        { ALT: () => this.CONSUME1(musesToken.ConstFloat, { LABEL: "range" }) },
                        { ALT: () => this.CONSUME1(musesToken.ConstInt, { LABEL: "range" }) },
                    ]);
                    this.CONSUME1(musesToken.RightParen);
                }
            },
        ]);
        this.CONSUME(musesToken.RightParen);
        this.CONSUME(musesToken.Assign);
        this.CONSUME(musesToken.ConstFloat, { LABEL: "value" });
    });

    intProperty = this.RULE("intProperty", () => {
        this.CONSUME(musesToken.PropertiesInt, { LABEL: 'type' });
        this.CONSUME(musesToken.RightParen);
        this.CONSUME(musesToken.Assign);
        this.CONSUME(musesToken.ConstInt, { LABEL: "value" });
    });

    property = this.RULE("property", () => {
        this.CONSUME(musesToken.Identifier, { LABEL: "name" });
        this.CONSUME(musesToken.LeftParen);
        this.CONSUME(musesToken.ConstString, { LABEL: "displayName" });
        this.CONSUME(musesToken.Comma);
        this.OR([
            { ALT: () => this.SUBRULE(this.floatProperty, { LABEL: 'variable' }) },
            { ALT: () => this.SUBRULE(this.intProperty, { LABEL: 'variable' }) },
            { ALT: () => this.SUBRULE(this.vectorProperty, { LABEL: 'variable' }) },
            { ALT: () => this.SUBRULE(this.textureProperty, { LABEL: 'variable' }) },
        ]);
    });

    properties = this.RULE("properties", () => {
        this.CONSUME(musesToken.Properties);
        this.CONSUME(musesToken.LeftBrace);
        this.MANY(() => this.SUBRULE(this.property, { LABEL: 'property' }));
        this.CONSUME(musesToken.RightBrace);
    });

    // #region GLSL

    typeDeclaration = this.RULE("typeDeclaration", () => {
        this.OR([
            { ALT: () => this.CONSUME(musesToken.Void, { LABEL: 'name' }) },
            { ALT: () => this.CONSUME(musesToken.Int, { LABEL: 'name' }) },
            { ALT: () => this.CONSUME(musesToken.Float, { LABEL: 'name' }) },
            { ALT: () => this.CONSUME(musesToken.Bool, { LABEL: 'name' }) },
            { ALT: () => this.CONSUME(musesToken.Vec2, { LABEL: 'name' }) },
            { ALT: () => this.CONSUME(musesToken.Vec3, { LABEL: 'name' }) },
            { ALT: () => this.CONSUME(musesToken.Vec4, { LABEL: 'name' }) },
            { ALT: () => this.CONSUME(musesToken.BVec2, { LABEL: 'name' }) },
            { ALT: () => this.CONSUME(musesToken.BVec3, { LABEL: 'name' }) },
            { ALT: () => this.CONSUME(musesToken.BVec4, { LABEL: 'name' }) },
            { ALT: () => this.CONSUME(musesToken.IVec2, { LABEL: 'name' }) },
            { ALT: () => this.CONSUME(musesToken.IVec3, { LABEL: 'name' }) },
            { ALT: () => this.CONSUME(musesToken.IVec4, { LABEL: 'name' }) },
            { ALT: () => this.CONSUME(musesToken.Mat2, { LABEL: 'name' }) },
            { ALT: () => this.CONSUME(musesToken.Mat3, { LABEL: 'name' }) },
            { ALT: () => this.CONSUME(musesToken.Mat4, { LABEL: 'name' }) },
            { ALT: () => this.CONSUME(musesToken.Sampler1DShadow, { LABEL: 'name' }) },
            { ALT: () => this.CONSUME(musesToken.Sampler2DShadow, { LABEL: 'name' }) },
            { ALT: () => this.CONSUME(musesToken.Sampler1D, { LABEL: 'name' }) },
            { ALT: () => this.CONSUME(musesToken.Sampler2D, { LABEL: 'name' }) },
            { ALT: () => this.CONSUME(musesToken.Sampler3D, { LABEL: 'name' }) },
            { ALT: () => this.CONSUME(musesToken.SamplerCube, { LABEL: 'name' }) },
            { ALT: () => this.CONSUME(musesToken.Identifier, { LABEL: 'name' }) },
        ]);
    });

    variableConstrucor = this.RULE("variableConstrucor", () => {
        this.OPTION(() => {
            this.CONSUME(musesToken.LeftBracket, { LABEL: 'array' });
            this.OPTION2(()=>this.SUBRULE(this.assignExpression, { LABEL: 'size' }));
            this.CONSUME(musesToken.RightBracket);
        });

        this.OPTION1(() => {
            this.CONSUME(musesToken.LeftParen);
            this.MANY_SEP({
                SEP: musesToken.Comma,
                DEF: () => {
                    this.OR1([
                        { ALT: () => this.CONSUME(musesToken.ConstFloat, { LABEL: 'args' }) },
                        { ALT: () => this.CONSUME(musesToken.ConstInt, { LABEL: 'args' }) },
                        { ALT: () => this.CONSUME(musesToken.True, { LABEL: 'args' }) },
                        { ALT: () => this.CONSUME(musesToken.False, { LABEL: 'args' }) },
                        { ALT: () => this.CONSUME(musesToken.Identifier, { LABEL: 'args' }) },
                    ]);
                }
            });
            this.CONSUME(musesToken.RightParen);
        });
    });

    // #region expression
    parenExpression = this.RULE("parenExpression", () => {
        this.CONSUME(musesToken.LeftParen);
        this.SUBRULE(this.assignExpression, { LABEL: 'expression' });
        this.CONSUME(musesToken.RightParen);
    });

    atomicExpression = this.RULE("atomicExpression", () => {
        this.OR([
            { ALT: () => this.CONSUME(musesToken.ConstFloat, { LABEL: "const" }) },
            { ALT: () => this.CONSUME(musesToken.ConstInt, { LABEL: "const" }) },
            { ALT: () => this.CONSUME(musesToken.True, { LABEL: "const" }) },
            { ALT: () => this.CONSUME(musesToken.False, { LABEL: "const" }) },
            // { ALT: () => this.SUBRULE(this.variableConstrucor, { LABEL: "subExpression" }) },
            { ALT: () => this.SUBRULE(this.typeDeclaration, { LABEL: "type" }) },
            { ALT: () => this.SUBRULE(this.parenExpression, { LABEL: "subExpression" }) },
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
            DEF: () => this.SUBRULE(this.assignExpression, { LABEL: 'args' }),
        });
        this.CONSUME(musesToken.RightParen);
    });

    dotExpression = this.RULE("dotExpression", () => {
        this.CONSUME(musesToken.Dot);
        this.CONSUME(musesToken.Identifier);
    });

    updateExpression = this.RULE("updateExpression", () => {
        this.OR([
            { ALT: () => this.CONSUME(musesToken.Inc, { LABEL: "operator" }) },
            { ALT: () => this.CONSUME(musesToken.Dec, { LABEL: "operator" }) },
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
                    this.CONSUME(musesToken.Minus, { LABEL: "operator" });
                    this.SUBRULE(this.unaryExpression, { LABEL: "argument" });
                }
            },
            {
                ALT: () => {
                    this.CONSUME(musesToken.Plus, { LABEL: "operator" });
                    this.SUBRULE1(this.unaryExpression, { LABEL: "argument" });
                }
            },
            {
                ALT: () => {
                    this.CONSUME(musesToken.Inc, { LABEL: "operator" });
                    this.SUBRULE2(this.unaryExpression, { LABEL: "argument" });
                }
            },
            {
                ALT: () => {
                    this.CONSUME(musesToken.Dec, { LABEL: "operator" });
                    this.SUBRULE3(this.unaryExpression, { LABEL: "argument" });
                }
            },
            {
                ALT: () => {
                    this.CONSUME(musesToken.Not, { LABEL: "operator" });
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
            this.CONSUME(musesToken.Or);
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
        this.SUBRULE(this.orExpression, { LABEL: "testExpression" });
        this.OPTION(() => {
            this.CONSUME(musesToken.QuestionMark);
            this.SUBRULE1(this.conditionalExpression, { LABEL: "trueExpression" });
            this.CONSUME(musesToken.Colon);
            this.SUBRULE2(this.conditionalExpression, { LABEL: "falseExpression" });
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
    // #endregion

    // #region statements
    blockStatement = this.RULE("blockStatement", () => {
        this.CONSUME(musesToken.LeftBrace);
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
        this.CONSUME(musesToken.RightBrace);
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

    whileStatement = this.RULE("whileStatement", () => {
        this.CONSUME(musesToken.While);
        this.CONSUME(musesToken.LeftParen);
        this.SUBRULE(this.assignExpression, { LABEL: "testExpression" });
        this.CONSUME(musesToken.RightParen);
        this.SUBRULE(this.blockStatement, { LABEL: "statement" });
    });

    doWhileStatement = this.RULE("doWhileStatement", () => {
        this.CONSUME(musesToken.Do);
        this.SUBRULE(this.blockStatement, { LABEL: "statement" });
        this.CONSUME(musesToken.While);
        this.CONSUME(musesToken.LeftParen);
        this.SUBRULE(this.assignExpression, { LABEL: "testExpression" });
        this.CONSUME(musesToken.RightParen);
        this.CONSUME(musesToken.Semicolon);
    });

    forStatement = this.RULE("forStatement", () => {
        this.CONSUME(musesToken.For);
        this.CONSUME(musesToken.LeftParen);
        this.OPTION(() => {
            this.OR([
                { ALT: () => this.SUBRULE(this.variableDeclaration, { LABEL: "init" }) },
                { ALT: () => this.SUBRULE(this.expressionStatement, { LABEL: "init" }) },
            ]);
        });
        this.SUBRULE(this.assignExpression, { LABEL: "test" });
        this.CONSUME1(musesToken.Semicolon);
        this.OPTION1(() => {
            this.SUBRULE1(this.assignExpression, { LABEL: "update" });
        });
        this.CONSUME(musesToken.RightParen);
        this.SUBRULE2(this.blockStatement, { LABEL: "statement" });
    });

    expressionStatement = this.RULE("expressionStatement", () => {
        this.SUBRULE(this.assignExpression, { LABEL: "expression" });
        this.CONSUME(musesToken.Semicolon);
    });

    returnStatement = this.RULE("returnStatement", () => {
        this.CONSUME(musesToken.Return);
        this.OPTION(() => {
            this.SUBRULE(this.assignExpression, { LABEL: "argument" });
        });
        this.CONSUME(musesToken.Semicolon);
    });

    continueStatement = this.RULE("continueStatement", () => {
        this.CONSUME(musesToken.Continue);
        this.CONSUME(musesToken.Semicolon);
    });

    breakStatement = this.RULE("breakStatement", () => {
        this.CONSUME(musesToken.Break);
        this.CONSUME(musesToken.Semicolon);
    });
    // #endregion

    // #region declaration
    structMemberDeclaration = this.RULE("structMemberDeclaration", () => {
        this.OPTION1(() => this.SUBRULE1(this.percisionDeclaration, { LABEL: 'percision' }));
        this.SUBRULE2(this.typeDeclaration, { LABEL: "type" });
        this.CONSUME(musesToken.Identifier, { LABEL: "name" });
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
        this.MANY_SEP({
            SEP: musesToken.Comma,
            // DEF: () => this.CONSUME2(musesToken.Identifier, { LABEL: "variables" })
            DEF: () => this.SUBRULE1(this.variableAssignment, { LABEL: 'variables' }),
        });
        this.CONSUME(musesToken.Semicolon);
    });

    storageDeclaration = this.RULE("storageDeclaration", () => {
        this.OR([
            { ALT: () => this.CONSUME(musesToken.Const, { LABEL: 'name' }) },
            { ALT: () => this.CONSUME(musesToken.Attribute, { LABEL: 'name' }) },
            { ALT: () => this.CONSUME(musesToken.Uniform, { LABEL: 'name' }) },
            { ALT: () => this.CONSUME(musesToken.Varying, { LABEL: 'name' }) },
        ]);
    });

    percisionDeclaration = this.RULE("percisionDeclaration", () => {
        this.OR([
            { ALT: () => this.CONSUME(musesToken.Highp, { LABEL: 'name' }) },
            { ALT: () => this.CONSUME(musesToken.Mediump, { LABEL: 'name' }) },
            { ALT: () => this.CONSUME(musesToken.Lowp, { LABEL: 'name' }) },
        ]);
    });

    sizeDeclaration = this.RULE("sizeDeclaration", () => {
        this.CONSUME(musesToken.LeftBracket);
        this.OPTION(() => this.SUBRULE(this.assignExpression, { LABEL: 'size' }));
        this.CONSUME(musesToken.RightBracket);
    });

    variableAssignment = this.RULE("variableAssignment", () => {
        this.CONSUME(musesToken.Identifier, { LABEL: 'name' });
        this.OPTION(() => {
            this.SUBRULE(this.sizeDeclaration, { LABEL: 'size' });
        });
        this.OPTION1(() => {
            this.CONSUME(musesToken.Assign);
            this.SUBRULE2(this.assignExpression, { LABEL: 'value' });
        });
    });

    variableDeclaration = this.RULE("variableDeclaration", () => {
        this.OPTION(() => this.SUBRULE(this.storageDeclaration, { LABEL: 'storage' }));
        this.OPTION1(() => this.SUBRULE1(this.percisionDeclaration, { LABEL: 'percision' }));
        this.SUBRULE2(this.typeDeclaration, { LABEL: "type" });
        this.AT_LEAST_ONE_SEP({
            SEP: musesToken.Comma,
            DEF: () => {
                this.SUBRULE3(this.variableAssignment, { LABEL: 'assignment' });
            },
        });
        this.CONSUME(musesToken.Semicolon);
    });

    functionParameterDeclaration = this.RULE("functionParameterDeclaration", () => {
        this.OPTION(() => this.CONSUME(musesToken.Const, { LABEL: 'storage' }));
        this.OPTION1(() => {
            this.OR([
                { ALT: () => this.CONSUME(musesToken.In, { LABEL: 'parameters' }) },
                { ALT: () => this.CONSUME(musesToken.Out, { LABEL: 'parameters' }) },
                { ALT: () => this.CONSUME(musesToken.InOut, { LABEL: 'parameters' }) },
            ]);
        });
        this.OPTION2(() => this.SUBRULE(this.percisionDeclaration, { LABEL: 'percision' }));
        this.SUBRULE(this.typeDeclaration, { LABEL: "type" });
        this.CONSUME(musesToken.Identifier, { LABEL: "name" });
    });

    functionDeclaration = this.RULE("functionDeclaration", () => {
        this.SUBRULE(this.typeDeclaration, { LABEL: "returnType" });
        this.CONSUME(musesToken.Identifier, { LABEL: "name" });
        this.CONSUME(musesToken.LeftParen);
        this.MANY_SEP({
            SEP: musesToken.Comma,
            DEF: () => this.SUBRULE(this.functionParameterDeclaration, { LABEL: "parameters" }),
        });
        this.CONSUME(musesToken.RightParen);
        this.SUBRULE(this.blockStatement, { LABEL: "body" });
    });
    // #endregion

    glsl = this.RULE("glsl", () => {
        this.CONSUME(musesToken.GLSLPROGRAM);
        this.AT_LEAST_ONE(() => {
            this.OR([
                { ALT: () => this.SUBRULE(this.variableDeclaration, { LABEL: 'body' }) },
                { ALT: () => this.SUBRULE(this.functionDeclaration, { LABEL: 'body' }) },
                { ALT: () => this.SUBRULE(this.structDeclaration, { LABEL: 'body' }) },
            ]);
        });
        this.CONSUME(musesToken.ENDGLSL);
    });
    // #endregion

    zTest = this.RULE("zTest", () => {
        this.CONSUME(musesToken.ZTest);
        this.OR([
            { ALT: () => this.CONSUME(musesToken.OFF, { LABEL: 'value' }) },
            { ALT: () => this.CONSUME(musesToken.ALWAY, { LABEL: 'value' }) },
            { ALT: () => this.CONSUME(musesToken.NEVER, { LABEL: 'value' }) },
            { ALT: () => this.CONSUME(musesToken.LESS, { LABEL: 'value' }) },
            { ALT: () => this.CONSUME(musesToken.EQUAL, { LABEL: 'value' }) },
            { ALT: () => this.CONSUME(musesToken.LEQUAL, { LABEL: 'value' }) },
            { ALT: () => this.CONSUME(musesToken.GREATER, { LABEL: 'value' }) },
            { ALT: () => this.CONSUME(musesToken.NOTEQUAL, { LABEL: 'value' }) },
            { ALT: () => this.CONSUME(musesToken.GEQUAL, { LABEL: 'value' }) },
        ]);
    });

    zWrite = this.RULE("zWrite", () => {
        this.CONSUME(musesToken.ZWrite);
        this.OR([
            { ALT: () => this.CONSUME(musesToken.OFF, { LABEL: 'value' }) },
            { ALT: () => this.CONSUME(musesToken.ON, { LABEL: 'value' }) },
        ]);
    });

    stencil = this.RULE("stencil", () => {
        this.CONSUME(musesToken.Stencil);
        this.OR([
            { ALT: () => this.CONSUME(musesToken.ALWAY, { LABEL: 'value' }) },
            { ALT: () => this.CONSUME(musesToken.NEVER, { LABEL: 'value' }) },
            { ALT: () => this.CONSUME(musesToken.LESS, { LABEL: 'value' }) },
            { ALT: () => this.CONSUME(musesToken.EQUAL, { LABEL: 'value' }) },
            { ALT: () => this.CONSUME(musesToken.LEQUAL, { LABEL: 'value' }) },
            { ALT: () => this.CONSUME(musesToken.GREATER, { LABEL: 'value' }) },
            { ALT: () => this.CONSUME(musesToken.NOTEQUAL, { LABEL: 'value' }) },
            { ALT: () => this.CONSUME(musesToken.GEQUAL, { LABEL: 'value' }) },
        ]);
        this.CONSUME(musesToken.ConstInt, { LABEL: 'value' });
        this.CONSUME1(musesToken.ConstInt, { LABEL: 'value' });
    });

    stencilMask = this.RULE("stencilMask", () => {
        this.CONSUME(musesToken.StencilMask);
        this.CONSUME(musesToken.ConstInt, { LABEL: 'value' });
    });

    blend = this.RULE("blend", () => {
        this.CONSUME(musesToken.Blend);
        this.OR([
            { ALT: () => this.CONSUME(musesToken.ZERO, { LABEL: 'value' }) },
            { ALT: () => this.CONSUME(musesToken.ONE, { LABEL: 'value' }) },
            { ALT: () => this.CONSUME(musesToken.SRC_COLOR, { LABEL: 'value' }) },
            { ALT: () => this.CONSUME(musesToken.ONE_MINUS_SRC_COLOR, { LABEL: 'value' }) },
            { ALT: () => this.CONSUME(musesToken.DST_COLOR, { LABEL: 'value' }) },
            { ALT: () => this.CONSUME(musesToken.ONE_MINUS_DST_COLOR, { LABEL: 'value' }) },
            { ALT: () => this.CONSUME(musesToken.SRC_ALPHA, { LABEL: 'value' }) },
            { ALT: () => this.CONSUME(musesToken.ONE_MINUS_SRC_ALPHA, { LABEL: 'value' }) },
            { ALT: () => this.CONSUME(musesToken.DST_ALPHA, { LABEL: 'value' }) },
            { ALT: () => this.CONSUME(musesToken.ONE_MINUS_DST_ALPHA, { LABEL: 'value' }) },
            { ALT: () => this.CONSUME(musesToken.CONSTANT_COLOR, { LABEL: 'value' }) },
            { ALT: () => this.CONSUME(musesToken.ONE_MINUS_CONSTANT_COLOR, { LABEL: 'value' }) },
            { ALT: () => this.CONSUME(musesToken.CONSTANT_ALPHA, { LABEL: 'value' }) },
            { ALT: () => this.CONSUME(musesToken.ONE_MINUS_CONSTANT_ALPHA, { LABEL: 'value' }) },  
        ]);
        this.OR1([
            { ALT: () => this.CONSUME1(musesToken.ZERO, { LABEL: 'value' }) },
            { ALT: () => this.CONSUME1(musesToken.ONE, { LABEL: 'value' }) },
            { ALT: () => this.CONSUME1(musesToken.SRC_COLOR, { LABEL: 'value' }) },
            { ALT: () => this.CONSUME1(musesToken.ONE_MINUS_SRC_COLOR, { LABEL: 'value' }) },
            { ALT: () => this.CONSUME1(musesToken.DST_COLOR, { LABEL: 'value' }) },
            { ALT: () => this.CONSUME1(musesToken.ONE_MINUS_DST_COLOR, { LABEL: 'value' }) },
            { ALT: () => this.CONSUME1(musesToken.SRC_ALPHA, { LABEL: 'value' }) },
            { ALT: () => this.CONSUME1(musesToken.ONE_MINUS_SRC_ALPHA, { LABEL: 'value' }) },
            { ALT: () => this.CONSUME1(musesToken.DST_ALPHA, { LABEL: 'value' }) },
            { ALT: () => this.CONSUME1(musesToken.ONE_MINUS_DST_ALPHA, { LABEL: 'value' }) },
            { ALT: () => this.CONSUME1(musesToken.CONSTANT_COLOR, { LABEL: 'value' }) },
            { ALT: () => this.CONSUME1(musesToken.ONE_MINUS_CONSTANT_COLOR, { LABEL: 'value' }) },
            { ALT: () => this.CONSUME1(musesToken.CONSTANT_ALPHA, { LABEL: 'value' }) },
            { ALT: () => this.CONSUME1(musesToken.ONE_MINUS_CONSTANT_ALPHA, { LABEL: 'value' }) },  
        ]);

    });

    cull = this.RULE("cull", () => {
        this.CONSUME(musesToken.Cull);
        this.OR([
            { ALT: () => this.CONSUME(musesToken.OFF, { LABEL: 'value' }) },
            { ALT: () => this.CONSUME(musesToken.FRONT, { LABEL: 'value' }) },
            { ALT: () => this.CONSUME(musesToken.BACK, { LABEL: 'value' }) },
            { ALT: () => this.CONSUME(musesToken.FRONT_AND_BACK, { LABEL: 'value' }) },
        ]);
    });

    renderState = this.RULE("renderState", () => {
        this.MANY(() => {
            this.OR([
                { ALT: () => this.SUBRULE(this.zTest, { LABEL: 'zTest' }) },
                { ALT: () => this.SUBRULE(this.zWrite, { LABEL: 'zWrite' }) },
                { ALT: () => this.SUBRULE(this.stencil, { LABEL: 'stencil' }) },
                { ALT: () => this.SUBRULE(this.blend, { LABEL: 'blend' }) },
                { ALT: () => this.SUBRULE(this.cull, { LABEL: 'cull' }) },
            ]);
        });
    });

    pass = this.RULE("pass", () => {
        this.CONSUME(musesToken.Pass);
        this.CONSUME(musesToken.LeftBrace);
        this.SUBRULE(this.renderState, { LABEL: "renderState" });
        this.OR([
            { ALT: () => this.SUBRULE(this.glsl, { LABEL: 'glsl' }) },
        ]);
        this.CONSUME(musesToken.RightBrace);
    });

    subshader = this.RULE("subshader", () => {
        this.CONSUME(musesToken.SubShader);
        this.CONSUME(musesToken.LeftBrace);
        this.AT_LEAST_ONE(() => {
            this.SUBRULE(this.pass, { LABEL: "passes" });
        });
        this.CONSUME(musesToken.RightBrace);
    });

    fallback = this.RULE("fallback", () => {
        this.CONSUME(musesToken.FallBack);
        this.CONSUME(musesToken.ConstString, { LABEL: "to" });
    });

    shader = this.RULE("shader", () => {
        this.CONSUME(musesToken.Shader);
        this.CONSUME(musesToken.ConstString, { LABEL: "name" });
        this.CONSUME(musesToken.LeftBrace);
        this.OPTION(() => this.SUBRULE(this.properties, { LABEL: "properties" }));
        this.AT_LEAST_ONE(() => this.SUBRULE2(this.subshader, { LABEL: "subshader" }));
        this.OPTION2(() => this.SUBRULE3(this.fallback, { LABEL: "fallback" }));
        this.CONSUME(musesToken.RightBrace);
    });
}

export const musesParser = new MusesParser();
