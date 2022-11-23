import { MusesGLSLContext } from "../../context/glsl";
import { MusesContextType } from "../../context/type";
import { MusesGLSLTree } from "../glsltree";
import { IMusesNodeOptions, MusesGLSLNode } from "../node";
import { MusesAstNodeType } from "../nodeType";
import { MusesVariableDeclaration } from "./variable-declaration";

export interface IMusesStructDeclarationOptions extends IMusesNodeOptions {
    name: string;
    members: MusesVariableDeclaration[];
}

export class MusesStructDeclaration extends MusesGLSLNode {
    subTree(ctx: MusesGLSLContext, tree: MusesGLSLTree): void {
        this.options.members.map(member=>member.subTree(ctx, tree));
    }
    toMuses(): string {
        return this.toGLSL();
    }
    toGLSL(): string {
        return `struct ${this.options.name} {
    ${this.options.members.map((member) => member.toGLSL()).join("\n    ")}
};`;
    }
    check(ctx: MusesGLSLContext): void {
        const membersTypes = this.options.members.map(m => m.toCtxType(ctx));

        ctx.types.push(new MusesContextType({
            name: this.options.name,
            struct: this,
            rules: [
                {
                    test: new RegExp(`^${this.options.name}\\(${membersTypes.map(m => m.name + m.isArray ? `\\[\\]` : '').join(",")}\\)$`),
                },
                {
                    test: new RegExp(`^${this.options.name}\\[\\]\\[int\\]$`),
                },
                {
                    test: new RegExp(`^${this.options.name}\\[\\]\\(\\)$`),
                    returnArray: true,
                },
                {
                    test: new RegExp(`^${this.options.name}\\[\\]\\(${this.options.name},(${this.options.name})*\\)$`),
                    returnArray: true,
                },
                {
                    test: new RegExp(`^${this.options.name}=${this.options.name}$`),
                    returnArray: true,
                },
                ...membersTypes.map((m, i) => {
                    return {
                        test: new RegExp(`^${this.options.name}\.${this.options.members[i].name}$`),
                        returnType: m,
                    }
                }),
            ],
        }));
    }

    nodeType: MusesAstNodeType = MusesAstNodeType.StructDeclaration;
    constructor(readonly options: IMusesStructDeclarationOptions) {
        super();
    }
}

