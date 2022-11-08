import { MusesFunctionDeclaration } from "./glsl/function-declaration";
import { MusesStructDeclaration } from "./glsl/struct-declaration"
import { MusesVariableDeclaration } from "./glsl/variable-declaration";

export class MusesGLSLTree{
    structs: MusesStructDeclaration[] = [];
    variables: MusesVariableDeclaration[] = [];
    functions: MusesFunctionDeclaration[] = [];
    private _code?: string;

    get code(): string {
        if (this._code === undefined) {
            const struct = this.structs.map((item) => item.toGLSL()).join("\n");
            const variable = this.variables.map((item) => item.toGLSL()).join("\n");
            const function_ = this.functions.map((item) => item.toGLSL()).join("\n");
            this._code = `${struct}
${variable}
${function_}`;
        }
        return this._code;
    }
}