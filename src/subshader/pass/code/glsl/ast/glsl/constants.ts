import { MusesGLSLContext } from "../../context/glsl";
import { MusesContextType } from "../../context/type";
import { IMusesNodeOptions, MusesGLSLNode } from "../node";
import { MusesAstNodeType } from "../nodeType";
import { MusesTypeDeclaration } from "./type-declaration";

export interface IMusesConstantsOptions extends IMusesNodeOptions {
    type: MusesTypeDeclaration;
    value: any;
}

export class MusesConstants extends MusesGLSLNode {
    toMuses(): string {
        return this.toGLSL();
    }
    toGLSL(): string {
        if(this.options.type.name === "float"){
            return /\./.test(this.options.value.toString())?this.options.value.toString():this.options.value.toString() + ".";
        }
        return `${this.options.value}`;
    }
    check(ctx: MusesGLSLContext): MusesContextType {
        return this.options.type.toCtxType(ctx);
    }
    get type(){
        return this.options.type;
    }
    nodeType: MusesAstNodeType = MusesAstNodeType.Constants;
    constructor(private readonly options: IMusesConstantsOptions) {
        super();
    }
}