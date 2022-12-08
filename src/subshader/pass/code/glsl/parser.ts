import { CstParser } from "chevrotain";
import { musesToken, musesTokens } from "./lexer";

export class GlslParser extends CstParser {
    constructor() {
        super(musesTokens);
        this.performSelfAnalysis();
    }

    blockStatement = this.RULE("blockStatement", () => {
        this.CONSUME(musesToken.LeftBrace);
        this.CONSUME(musesToken.RightBrace);
    });

    structMemberDeclaration = this.RULE("structMemberDeclaration", () => {
        this.OPTION(() => this.CONSUME(musesToken.PercisionQualifiers, { LABEL: "percision" }));
        this.OR([
            { ALT: () => this.CONSUME(musesToken.Types, { LABEL: 'typeName' }) },
            { ALT: () => this.CONSUME(musesToken.Identifier, { LABEL: 'typeName' }) },
        ]);
        this.AT_LEAST_ONE_SEP({
            SEP: musesToken.Comma,
            DEF: () => {
                this.CONSUME1(musesToken.Identifier, { LABEL: "variable" });
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
        this.OPTION1(() => this.CONSUME(musesToken.PercisionQualifiers, { LABEL: "percision" }));
        this.OR([
            { ALT: () => this.CONSUME(musesToken.Types, { LABEL: 'typeName' }) },
            { ALT: () => this.CONSUME(musesToken.Identifier, { LABEL: 'typeName' }) },
        ]);
        this.AT_LEAST_ONE_SEP({
            SEP: musesToken.Comma,
            DEF: () => {
                this.CONSUME1(musesToken.Identifier, { LABEL: "variable" });
            },
        });
        this.CONSUME(musesToken.Semicolon);
    });

    functionParameterDeclaration = this.RULE("functionParameterDeclaration", () => {
        this.OPTION(() => this.CONSUME(musesToken.Const, { LABEL: "const" }));
        this.OPTION1(() => this.CONSUME(musesToken.ParamStrorageQualifiers, { LABEL: "storage" }));
        this.OPTION2(() => this.CONSUME(musesToken.PercisionQualifiers, { LABEL: "percision" }));
        this.OR([
            { ALT: () => this.CONSUME(musesToken.Types, { LABEL: 'typeName' }) },
            { ALT: () => this.CONSUME(musesToken.Identifier, { LABEL: 'typeName' }) },
        ]);
        this.CONSUME1(musesToken.Identifier, { LABEL: "name" });
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

    globalStatement = this.RULE("globalStatement", () => {
        this.OR([
            { ALT: () => this.SUBRULE(this.functionDeclaration, { LABEL: "statement" }) },
            { ALT: () => this.SUBRULE(this.globalVariableDeclarator, { LABEL: "statement" }) },
            { ALT: () => this.SUBRULE(this.structDeclaration, { LABEL: "statement" }) },
        ]);
    });

    glsl = this.RULE("glsl", () => {
        this.MANY(() => {
            this.SUBRULE(this.globalStatement, { LABEL: "statements" });
        });
    });
    // #endregion
}

export const glslParser = new GlslParser();
