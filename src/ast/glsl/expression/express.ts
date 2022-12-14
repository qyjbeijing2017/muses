import { MusesGLSLContext } from "../../../context/glsl";
import { MusesContextType } from "../../../context/type";
import { IMusesNodeOptions, MusesGLSLNode } from "../../node";
import { MusesAstNodeType } from "../../nodeType";
import { MusesConstants } from "../constants";
import { MusesIdentify } from "../Identify";

export interface IMusesExpressionOptions extends IMusesNodeOptions {

}

export abstract class MusesExpression extends MusesGLSLNode {
    abstract check(ctx: MusesGLSLContext): MusesContextType;

    getExpressionType(ctx: MusesGLSLContext, value: MusesExpression | MusesConstants | MusesIdentify) {
        switch(value.nodeType){
            case MusesAstNodeType.Identify:
                const variables = ctx.variables.find(variable=> variable.name === (value as MusesIdentify).name);
                if(!variables){
                    throw new Error(`Variable ${(value as MusesIdentify).name} is not defined`);
                }
                return variables.type;
            case MusesAstNodeType.Constants:
                return (value as MusesConstants).type.toCtxType(ctx);
            default:
                return (value as MusesExpression).check(ctx)
        }
    }

    constructor(readonly options: IMusesExpressionOptions) {
        super();
    }
}