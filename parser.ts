import { CstParser } from "chevrotain";
import {
    Assign,
    Attribute,
    Bool,
    BVec2,
    BVec3,
    BVec4,
    Const,
    ConstString,
    ENDGLSL,
    FallBack,
    Float,
    GLSLPROGRAM,
    Highp,
    Identifier,
    Int,
    IVec2,
    IVec3,
    IVec4,
    LeftBrace,
    LeftParen,
    Lowp,
    Mat2,
    Mat3,
    Mat4,
    Mediump,
    musesTokens,
    Pass,
    Properties,
    RightBrace,
    RightParen,
    Sampler1D,
    Sampler1DShadow,
    Sampler2D,
    Sampler2DShadow,
    Sampler3D,
    SamplerCube,
    Semicolon,
    Shader,
    SubShader,
    Uniform,
    Varying,
    Vec2,
    Vec3,
    Vec4,
    Void
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

    variableDeclaration = this.RULE("variableDeclaration", () => {
        this.OPTION(() => this.SUBRULE(this.storageDeclaration, { LABEL: 'storage' }));
        this.OPTION1(() => this.SUBRULE(this.percisionDeclaration, { LABEL: 'percision' }));
        this.SUBRULE2(this.typeDeclaration, { LABEL: "type" });
        this.CONSUME(Identifier, { LABEL: "name" });
        this.OPTION2(() => {
            this.CONSUME(Assign);
        });
    });

    variableDeclarationStatement = this.RULE("variableDeclarationStatement", () => {
        this.SUBRULE(this.variableDeclaration, { LABEL: 'variableDeclaration' });
        this.CONSUME(Semicolon);
    });

    functionDeclaration = this.RULE("functionDeclaration", () => {
        this.SUBRULE(this.typeDeclaration, { LABEL: "returnType" });
        this.CONSUME(Identifier, { LABEL: "name" });
        this.CONSUME(LeftParen);
        this.CONSUME(RightParen);
        this.CONSUME(LeftBrace);
        this.MANY(() => {
            this.OR([
                { ALT: () => this.SUBRULE(this.variableDeclarationStatement, { LABEL: 'body' }) },
            ]);
        });
        this.CONSUME(RightBrace);
    });

    glsl = this.RULE("glsl", () => {
        this.CONSUME(GLSLPROGRAM);
        this.AT_LEAST_ONE(() => {
            this.OR([
                { ALT: () => this.SUBRULE(this.variableDeclarationStatement, { LABEL: 'body' }) },
                { ALT: () => this.SUBRULE(this.functionDeclaration, { LABEL: 'body' }) },
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
