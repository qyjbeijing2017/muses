import { CstParser } from "chevrotain";
import { musesToken, musesTokens } from "./lexer";

export class GlslParser extends CstParser {
    constructor() {
        super(musesTokens);
        this.performSelfAnalysis();
    }

    auto = this.RULE("auto", () => {
        this.OR([
            { ALT: () => this.CONSUME(musesToken.Literials, { LABEL: 'literial' }) },
        ]);
    });

    orExpression = this.RULE("orExpression", () => {
        this.SUBRULE(this.auto, { LABEL: "left" });
        this.MANY(() => {
            this.CONSUME(musesToken.Or, { LABEL: "operator" });
            this.SUBRULE1(this.auto, { LABEL: "right" });
        });
    });

    conditionalExpression = this.RULE("conditionalExpression", () => {
        this.SUBRULE(this.auto, { LABEL: "testExpression" });
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
            this.CONSUME(musesToken.Assign);
            this.SUBRULE2(this.assignExpression, { LABEL: "init" });
        });
    });

    variableDeclaration = this.RULE("variableDeclaration", () => {
        this.OPTION(() => this.CONSUME(musesToken.Const, { LABEL: "const" }));
        this.OPTION1(() => this.CONSUME(musesToken.Percision, { LABEL: "percision" }));
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

    statement = this.RULE("statement", () => {
        this.OR([
            { ALT: () => this.SUBRULE(this.variableDeclaration, { LABEL: "statement" }) },
            { ALT: () => this.SUBRULE(this.blockStatement, { LABEL: "statement" }) },
        ]);
    });

    blockStatement = this.RULE("blockStatement", () => {
        this.CONSUME(musesToken.LeftBrace);
        this.MANY(() => {
            this.SUBRULE(this.statement, { LABEL: "statements" });
        });
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
                this.SUBRULE(this.variableInitializer, { LABEL: "variable" });
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
