import { MusesGLSLContext } from "../../context/glsl";
import { MusesContextFunction } from "../../context/functional";
import { MusesContextType } from "../../context/type";
import { IMusesNodeOptions, MusesGLSLNode } from "../node";
import { MusesAstNodeType } from "../nodeType";
import { MusesStatement } from "./statement/statement";
import { MusesTypeDeclaration } from "./type-declaration";
import { MusesVariableDeclaration } from "./variable-declaration";

export interface IMusesFunctionDeclarationOptions extends IMusesNodeOptions {
    name: string;
    returnType: MusesTypeDeclaration;
    parameters: MusesVariableDeclaration[];
    body?: (MusesStatement | MusesVariableDeclaration)[];
}

export class MusesFunctionDeclaration extends MusesGLSLNode {
    toMuses(): string {
        return this.toGLSL();
    }
    toGLSL(): string {
        return `${this.options.returnType.toMuses()} ${this.options.name}(${this.options.parameters.map(parameter => parameter.toMuses().replace(/;/, '')).join(", ")}) {
    ${this.options.body?.map((item) => item.toMuses()).join("\n    ")}
}`;
    }
    check(ctx: MusesGLSLContext): void {
        ctx.functions.push(new MusesContextFunction(this.options.name, this.options.returnType.toCtxType(ctx), this.options.parameters.map(parameter => parameter.toCtxVariable(ctx))));
        ctx.variables.push(...this.options.parameters.map(parameter => parameter.toCtxVariable(ctx)));
        ctx.funcName = this.options.name;
        this.options.body?.forEach((item) => {
            item.check(ctx);
        });
        for (let index = 0; index < this.options.parameters.length; index++) {
            ctx.variables.pop();
        }
        ctx.funcName = undefined;
    }
    nodeType: MusesAstNodeType = MusesAstNodeType.FunctionDeclaration;
    constructor(readonly options: IMusesFunctionDeclarationOptions) {
        super();
    }
}

