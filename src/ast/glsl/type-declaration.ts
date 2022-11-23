import { MusesGLSLContext } from "../../context/glsl";
import { MusesGLSLTree } from "../glsltree";
import { IMusesNodeOptions, MusesGLSLNode } from "../node";
import { MusesAstNodeType } from "../nodeType";

export interface IMusesTypeDeclarationOptions extends IMusesNodeOptions {
    name: string;
}

export class MusesTypeDeclaration extends MusesGLSLNode {
    subTree(ctx: MusesGLSLContext, tree: MusesGLSLTree): void {
        const ctxType = this.toCtxType(ctx);
        if (ctxType.struct) {
            if (!tree.structs.find(struct => struct.options.name === ctxType.struct?.options.name)) {
                tree.structs.push(ctxType.struct);
            }
        }
    }
    toMuses(): string {
        return this.toGLSL();
    }
    toGLSL(): string {
        return this.name;
    }
    check(ctx: MusesGLSLContext): void {
        if (!ctx.types.find(type => type.name === this.name)) {
            throw new Error(`Type ${this.name} has not been declared.`);
        }
    }
    toCtxType(ctx: MusesGLSLContext) {
        const type = ctx.types.find(type => type.name === this.name);
        if (!type) {
            throw new Error(`Type ${this.name} has not been declared.`);
        }
        return type;
    }

    get name() {
        return this.options.name;
    }
    nodeType: MusesAstNodeType = MusesAstNodeType.TypeDeclaration;
    constructor(readonly options: IMusesTypeDeclarationOptions) {
        super();
    }
}