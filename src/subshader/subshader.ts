import { matchRecursiveRegExp } from "../../utils/matchRecursiveRegExp";
import { IRenderState } from "../renderstate/interface";
import { renderStatesLexer } from "../renderstate/lexer";
import { renderStateParser } from "../renderstate/parser";

export class SubShader {
    readonly renderStates: IRenderState;
    constructor(private source: string) {
        const passesSource = matchRecursiveRegExp(source, "{", "}", "g");
        let rsSource = source;
        passesSource.forEach((passSource) => {
            rsSource = rsSource.replace(new RegExp(`Pass\\s*{${passSource}}`), '');
        });
        console.log(rsSource);
        const lexer = renderStatesLexer.tokenize(rsSource);
        console.log(lexer);
        renderStateParser.input = lexer.tokens;
        this.renderStates = renderStateParser.parse();
        console.log(this.renderStates);
    }
}