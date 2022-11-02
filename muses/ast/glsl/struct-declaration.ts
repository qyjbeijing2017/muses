import { MusesGLSLContext } from "../../context/glsl";
import { MusesContextType } from "../../context/type";
import { IMusesNodeOptions, MusesGLSLNode } from "../node";
import { MusesAstNodeType } from "../nodeType";
import { MusesVariableDeclaration } from "./variable-declaration";

export interface IMusesStructDeclarationOptions extends IMusesNodeOptions {
    name: string;
    members: MusesVariableDeclaration[];
}

export class MusesStructDeclaration extends MusesGLSLNode {
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
            isStruct: true,
            rules: [
                {
                    test: new RegExp(`^${this.options.name}\\(${membersTypes.map(m => m.name).join(",")}\\)$`),
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
    constructor(private readonly options: IMusesStructDeclarationOptions) {
        super();
    }
}

