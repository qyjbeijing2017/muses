import { MusesGLSLContext } from "../../context/glsl";
import { MusesContextType } from "../../context/type";
import { IMusesNodeOptions, MusesGLSLNode } from "../node";
import { MusesAstNodeType } from "../nodeType";

export interface IMusesTypeDeclarationOptions extends IMusesNodeOptions {
    name: string;
}

export class MusesTypeDeclaration extends MusesGLSLNode {
    toMuses(): string {
        return this.toGLSL();
    }
    toGLSL(): string {
        return this.name;
    }
    check(ctx: MusesGLSLContext): void {
        if(!ctx.types.find(type => type.name === this.name)){
            throw new Error(`Type ${this.name} has not been declared.`);
        }
    }
    toCtxType(ctx: MusesGLSLContext){
        const type = ctx.types.find(type => type.name === this.name);
        if(!type){
            throw new Error(`Type ${this.name} has not been declared.`);
        }
        return type;
    }

    get name(){
        return this.options.name;
    }
    nodeType: MusesAstNodeType = MusesAstNodeType.TypeDeclaration;
    constructor(private readonly options: IMusesTypeDeclarationOptions) {
        super();
    }
}