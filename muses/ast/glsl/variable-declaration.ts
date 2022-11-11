import { MusesGLSLContext } from "../../context/glsl";
import { MusesContextType } from "../../context/type";
import { MusesContextVariable } from "../../context/variable";
import { MusesGLSLTree } from "../glsltree";
import { IMusesNodeOptions, MusesGLSLNode } from "../node";
import { MusesAstNodeType } from "../nodeType";
import { MusesConstants } from "./constants";
import { MusesExpression } from "./expression/express";
import { MusesIdentify } from "./Identify";
import { MusesTypeDeclaration } from "./type-declaration";

export enum MusesGLSLStorage {
    const = "const",
    attribute = "attribute",
    uniform = "uniform",
    varying = "varying",
}

export enum MusesGLSLPercision {
    lowp = "lowp",
    mediump = "mediump",
    highp = "highp",
}

export enum MusesGLSLParmerters {
    in = "in",
    out = "out",
    inout = "inout",
}

export interface IMusesVariableDeclarationOptions extends IMusesNodeOptions {
    name: string;
    type: MusesTypeDeclaration;
    storage?: MusesGLSLStorage;
    percision?: MusesGLSLPercision;
    value?: MusesExpression | MusesConstants | MusesIdentify;
    parameters?: MusesGLSLParmerters;
    size?: MusesExpression | MusesConstants | MusesIdentify;
}

export class MusesVariableDeclaration extends MusesGLSLNode {
    subTree(ctx: MusesGLSLContext, tree: MusesGLSLTree): void {
        this.options.value?.subTree(ctx, tree);
        this.options.type.subTree(ctx, tree);
        ctx.variables.push(this.toCtxVariable(ctx));
    }
    toMuses(): string {
        return this.toGLSL();
    }
    toGLSL(): string {
        return `${this.options.storage ? this.options.storage + ' ' : ''}${this.options.parameters ? this.options.parameters + ' ' : ''}${this.options.percision ? this.options.percision + ' ' : ''}${this.options.type.toGLSL()} ${this.options.name}${this.options.size ? `[${this.options.size.toGLSL()}]` : ''}${this.options.value ? ` = ${this.options.value.toGLSL()}` : ''};`;
    }
    static arrayToGLSL(variables: MusesVariableDeclaration[]): string {
        const options = variables[0].options;
        return `${options.storage ? options.storage + ' ' : ''}${options.parameters ? options.parameters + ' ' : ''}${options.percision ? options.percision + ' ' : ''}${options.type.toGLSL()} ${variables.map(variable => `${variable.options.name}${variable.options.value ? ` = ${variable.options.value.toGLSL()}` : ''}`)};`;
    }
    get name() {
        return this.options.name;
    }

    check(ctx: MusesGLSLContext): void {
        const variable = this.toCtxVariable(ctx);
        if (this.options.size) {
            const sizeType = this.getExpressionType(ctx, this.options.size);
            if (sizeType.sign !== 'int') {
                throw new Error(`Type ${sizeType.sign} is not assignable to int`);
            }
        }
        if (this.options.value) {
            const valueType = this.getExpressionType(ctx, this.options.value);
            if (!variable.type.checkRule(`${variable.type.sign}=${valueType.sign}`)) {
                throw new Error(`Type ${valueType.sign} is not assignable to ${variable.type.sign}`);
            }
        }
        if (ctx.variables.find(v => v.name === variable.name)) {
            throw new Error(`Variable ${variable.name} is already defined`);
        }
        ctx.variables.push(this.toCtxVariable(ctx));
    }

    getExpressionType(ctx: MusesGLSLContext, value: MusesExpression | MusesConstants | MusesIdentify) {
        switch (value.nodeType) {
            case MusesAstNodeType.Identify:
                const variables = ctx.variables.find(variable => variable.name === (value as MusesIdentify).name);
                if (!variables) {
                    throw new Error(`Variable ${(value as MusesIdentify).name} is not defined`);
                }
                return variables.type;
            case MusesAstNodeType.Constants:
                return (value as MusesConstants).type.toCtxType(ctx);
            default:
                return (value as MusesExpression).check(ctx)
        }
    }

    toCtxVariable(ctx: MusesGLSLContext): MusesContextVariable {
        const currentType = ctx.types.find(t => t.name === this.options.type.name);
        if (!currentType) {
            throw new Error(`Type ${this.options.type.name} is not defined`);

        }
        return new MusesContextVariable({
            name: this.options.name,
            type: currentType.copy({
                storage: this.options.storage,
                percision: this.options.percision,
                parameters: this.options.parameters,
                isArray: !!this.options.size,
            }),
            variable: ctx.funcNames.length > 0 ? undefined : this,
        });
    }

    toCtxType(ctx: MusesGLSLContext): MusesContextType {
        const currentType = ctx.types.find(t => t.name === this.options.type.name);
        if (!currentType) {
            throw new Error(`Type ${this.options.type.name} is not defined`);
        }
        return currentType.copy({
            storage: this.options.storage,
            percision: this.options.percision,
            parameters: this.options.parameters,
            isArray: !!this.options.size,
        });
    }

    nodeType: MusesAstNodeType = MusesAstNodeType.VariableDeclaration;
    constructor(readonly options: IMusesVariableDeclarationOptions) {
        super();
    }
}