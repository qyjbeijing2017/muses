import { CstNode, ILexingResult } from "chevrotain";
import { MusesShader } from "./ast/shader";
import { glslCtxDefine } from "./context/glsl.ctx";
import { musesLexer } from "./lexer";
import { musesParser } from "./parser";
import { musesVisitor } from "./visiter";
import { MusesShaderContext } from "./context/shader";

export class MusesVM {
    static readonly lexer = musesLexer;
    static readonly praser = musesParser;
    static readonly visitor = musesVisitor;

    readonly lex: ILexingResult;
    readonly cst: CstNode;
    readonly ast: MusesShader;
    readonly ctx: MusesShaderContext;
    constructor(code: string) {
        this.lex = musesLexer.tokenize(code);
        if (this.lex.errors.length > 0) {
            throw new Error(this.lex.errors[0].message);
        }
        musesParser.input = this.lex.tokens;
        this.cst = musesParser.shader();
        if (musesParser.errors.length > 0) {
            throw new Error(musesParser.errors[0].message);
        }
        this.ast = musesVisitor.visit(this.cst);
        this.ctx = new MusesShaderContext(glslCtxDefine);
        this.ast.check(this.ctx);
    }
}