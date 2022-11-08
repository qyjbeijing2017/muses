import { MusesGLSLContext } from "../../context/glsl";
import { MusesContextFunction } from "../../context/functional";
import { IMusesNodeOptions, MusesGLSLNode } from "../node";
import { MusesAstNodeType } from "../nodeType";
import { MusesStatement } from "./statement/statement";
import { MusesTypeDeclaration } from "./type-declaration";
import { MusesVariableDeclaration } from "./variable-declaration";
import { MusesGLSLTree } from "../glsltree";

export interface IMusesFunctionDeclarationOptions extends IMusesNodeOptions {
    name: string;
    returnType: MusesTypeDeclaration;
    parameters: MusesVariableDeclaration[];
    body?: (MusesStatement | MusesVariableDeclaration)[];
}

export class MusesFunctionDeclaration extends MusesGLSLNode {
    subTree(ctx: MusesGLSLContext, tree: MusesGLSLTree): void {
        tree.functions.push(this);
        ctx.funcName = this.options.name;
        let variableCount = ctx.variables.length;
        ctx.variables.push(...this.options.parameters.map(parameter => parameter.toCtxVariable(ctx)));
        this.options.parameters.forEach(parameter => parameter.subTree(ctx, tree));
        this.options.body?.forEach((item) => {
            item.subTree(ctx, tree);
        });
        while (ctx.variables.length > variableCount) {
            ctx.variables.pop();
        }
        ctx.funcName = undefined;
    }
    toMuses(): string {
        return this.toGLSL();
    }
    toGLSL(): string {
        return `${this.options.returnType.toMuses()} ${this.options.name}(${this.options.parameters.map(parameter => parameter.toMuses().replace(/;/, '')).join(", ")}) {
    ${this.options.body?.map((item) => item.toMuses()).join("\n    ") || ''}
}`;
    }
    check(ctx: MusesGLSLContext): void {
        const sign = `${this.options.name}(${this.options.parameters.map(p => p.options.type.options.name).join(',')})`;
        const func = ctx.functions.find(func => func.sign === sign);
        if (func) {
            throw new Error(`Function ${sign} has been declared.`);
        }

        ctx.functions.push(new MusesContextFunction(
            this.options.name,
            this.options.returnType.toCtxType(ctx),
            this.options.parameters.map(parameter => parameter.toCtxVariable(ctx)),
            this,
        ));
        let variableCount = ctx.variables.length;
        ctx.variables.push(...this.options.parameters.map(parameter => parameter.toCtxVariable(ctx)));
        ctx.funcName = this.options.name;
        this.options.body?.forEach((item) => {
            item.check(ctx);
        });

        while (ctx.variables.length > variableCount) {
            ctx.variables.pop();
        }
        ctx.funcName = undefined;
    }
    nodeType: MusesAstNodeType = MusesAstNodeType.FunctionDeclaration;
    constructor(readonly options: IMusesFunctionDeclarationOptions) {
        super();
    }
}

