import { MusesContext } from "../context/context";
import { MusesContextType } from "../context/type";
import { IMusesNodeOptions, MusesNode } from "../node";
import { MusesAstNodeType } from "../nodeType";
import { MusesTypeDeclaration } from "./type-declaration";

export interface IMusesConstantsOptions extends IMusesNodeOptions {
    type: MusesTypeDeclaration;
    value: any;
}

export class MusesConstants extends MusesNode {
    check(ctx: MusesContext): MusesContextType {
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