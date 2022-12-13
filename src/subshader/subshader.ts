import { matchRecursiveRegExp } from "../../utils/matchRecursiveRegExp";
import { IRenderState } from "../renderstate/renderstate";
import { renderStatesLexer } from "../renderstate/lexer";
import { renderStateParser } from "../renderstate/parser";
import { Pass } from "./pass/pass";
import { MusesManager } from "../muse-manager";

export class SubShader {
    readonly renderStates: Partial<IRenderState>;
    readonly passes: Pass[];
    constructor(readonly source: string) {
        const passesSource = matchRecursiveRegExp(source, "{", "}", "g");
        const passesTitle = source.match(/Pass|Tags|Stencil/g) || [];
        let rsSource = source;
        this.passes = [];
        passesSource.map((passSource, index) => {
            rsSource = rsSource.replace(passSource, '');
            rsSource = rsSource.replace(new RegExp(`Pass\\s*{}`), '');
            if(passesTitle[index] === "Pass") {
                this.passes.push(new Pass(passSource, this));
            }
        });
        this.renderStates = SubShader.Parse(rsSource);
    }

    static Parse(source: string) {
        const lexer = renderStatesLexer.tokenize(source);
        if(lexer.errors.length > 0) {
            throw new Error(lexer.errors[0].message);
        }
        renderStateParser.input = lexer.tokens;
        const parse = renderStateParser.parse();
        if(renderStateParser.errors.length > 0) {
            throw new Error(renderStateParser.errors[0].message);
        }
        return parse;
    }

}