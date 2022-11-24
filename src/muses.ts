import { matchRecursiveRegExp } from "../utils/matchRecursiveRegExp";
import { IProperty } from "./properties/interface";
import { propertiesLexer } from "./properties/lexer";
import { propertiesParser } from "./properties/parser";
import { SubShader } from "./subshader/subshader";


export class Muses {
    readonly name: string;
    readonly fallBack: string | null;
    readonly properties: IProperty[];
    readonly subShaders: SubShader[];
    constructor(readonly source: string) {
        this.name = Muses.getName(source);
        this.fallBack = Muses.getFallBack(source);
        this.properties = Muses.getProperties(source);
        this.subShaders = Muses.getSubShaders(source);
    }

    static getName(source: string) {
        if (!/^\s*Shader\s*"[a-zA-Z_][a-zA-Z0-9_]*"/.test(source)) {
            throw new Error("Invalid shader name");
        }
        const name = source.match(/"[a-zA-Z_][a-zA-Z0-9_]*"/)![0];
        return name.slice(1, -1);
    }

    static getFallBack(source: string) {
        const fallbackMatch = source.match(/FallBack\s*"[a-zA-Z_][a-zA-Z0-9_]*"/);
        if (fallbackMatch) {
            const fallback = fallbackMatch[0].replace(/FallBack\s*/, "");
            return fallback.slice(1, -1);
        }
        return null;
    }

    static getProperties(source: string) {
        const propertiesStr = Muses.splitProperties(source);
        if(!propertiesStr) {
            return [];
        }
        const index = source.indexOf(propertiesStr);
        const fontText = source.slice(0, index);
        const line = fontText.split(/\n/).length;
        const column = fontText.length - fontText.lastIndexOf("\n");

        const lexer = propertiesLexer.tokenize(propertiesStr);
        propertiesParser.input = lexer.tokens;
        const parse = propertiesParser.parse();
        return parse;
    }

    static splitProperties(source: string) {
        const shaderBodyMatch = matchRecursiveRegExp(source, "{", "}", "g");
        if (shaderBodyMatch.length !== 1) {
            throw new Error("Shader body not found");
        }
        const shaderBody = shaderBodyMatch[0];
        const propertiesMatch = matchRecursiveRegExp(shaderBody, "{", "}", "g");
        const propertiesTitleMatch = shaderBody.match(/Properties|SubShader/g);
        if(propertiesTitleMatch?.length != propertiesMatch.length) {
            throw new Error("Properties or SubShader titles and bodies not same length");
        }
        for (let index = 0; index < propertiesTitleMatch.length; index++) {
            const element = propertiesTitleMatch[index];
            if(element === "Properties") {
                return propertiesMatch[index];
            }
        }
    }
    
    static getSubShaders(source: string) {
        const subShaders = Muses.splitSubShaders(source);
        return subShaders.map((subShader) => {
            return new SubShader(subShader);
        });
    }

    static splitSubShaders(source: string) {
        const shaderBodyMatch = matchRecursiveRegExp(source, "{", "}", "g");
        if (shaderBodyMatch.length !== 1) {
            throw new Error("Shader body not found");
        }
        const shaderBody = shaderBodyMatch[0];
        const subShadersMatch = matchRecursiveRegExp(shaderBody, "{", "}", "g");
        const subShadersTitleMatch = shaderBody.match(/Properties|SubShader/g);
        if(subShadersTitleMatch?.length != subShadersMatch.length) {
            throw new Error("Properties or SubShader titles and bodies not same length");
        }
        const subShaders: string[] = [];
        for (let index = 0; index < subShadersTitleMatch.length; index++) {
            const element = subShadersTitleMatch[index];
            if(element === "SubShader") {
                subShaders.push(subShadersMatch[index]);
            }
        }
        return subShaders;
    }

    static shaderBody(source: string) {
        return matchRecursiveRegExp(source, "{", "}", "g");
    }
}