import { matchRecursiveRegExp } from "../../../utils/matchRecursiveRegExp";
import { defaultRenderState } from "../../renderstate/default";
import { IRenderState } from "../../renderstate/renderstate";
import { renderStatesLexer } from "../../renderstate/lexer";
import { renderStateParser } from "../../renderstate/parser";
import { Code } from "./code/code";
import { MusesManager } from "../../muse-manager";
import { SubShader } from "../subshader";

export class Pass {
    private readonly _renderStates: Partial<IRenderState>;
    readonly code: Code | null;

    get renderStates() {
        return Object.assign({}, defaultRenderState, this.subShader.renderStates, this._renderStates);
    }

    constructor(readonly source: string, readonly subShader: SubShader) {
        const glslSources = matchRecursiveRegExp(source, "GLSLPROGRAM|HLSLPROGRAM|CGPROGRAM", "ENDGLSL|ENDHLSL|ENDCG", "g");
        const glslTitle = source.match(/GLSLPROGRAM|HLSLPROGRAM|CGPROGRAM/g) || [];
        let rsSource = source;
        let code: Code | null = null;
        glslSources.forEach((glslSource, index) => {
            rsSource = rsSource.replace(glslSource, '');
            rsSource = rsSource.replace(/(GLSLPROGRAM|HLSLPROGRAM|CGPROGRAM)(ENDGLSL|ENDHLSL|ENDCG)/, '');
            code = new Code(glslSource, glslTitle[index].replace("PROGRAM", "") as 'GLSL' | 'HLSL' | 'CG');
        });
        this.code = code;
        this._renderStates = Pass.ParseRenderState(rsSource);
    }

    static ParseRenderState(source: string) {
        const lexer = renderStatesLexer.tokenize(source);
        if (lexer.errors.length > 0) {
            throw new Error(lexer.errors[0].message);
        }
        renderStateParser.input = lexer.tokens;
        const parse = renderStateParser.parse();
        if (renderStateParser.errors.length > 0) {
            throw new Error(renderStateParser.errors[0].message);
        }
        return parse;
    }
}