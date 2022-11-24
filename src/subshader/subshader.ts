import { matchRecursiveRegExp } from "../../utils/matchRecursiveRegExp";
import { IRenderState } from "../renderstate/interface";
import { renderStatesLexer } from "../renderstate/lexer";
import { renderStateParser } from "../renderstate/parser";

export class SubShader {
    readonly renderStates: IRenderState;
    constructor(readonly source: string) {
        const passesSource = matchRecursiveRegExp(source, "{", "}", "g");
        let rsSource = source;
        passesSource.forEach((passSource) => {
            rsSource = rsSource.replace(new RegExp(`Pass\\s*{${passSource}}`), '');
        });

        this.renderStates = SubShader.Parse(rsSource);
        console.log(this.renderStates);
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