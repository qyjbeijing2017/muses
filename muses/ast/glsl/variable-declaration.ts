import { MusesContext } from "../context/context";
import { MusesContextType } from "../context/type";
import { MusesContextVariable } from "../context/variable";
import { IMusesNodeOptions, MusesNode } from "../node";
import { MusesAstNodeType } from "../nodeType";
import { MusesConstants } from "./constants";
import { MusesExpression } from "./expression/express";
import { MusesIdentify } from "./Identify";
import { MusesTypeDeclaration } from "./type-declaration";


export enum MusesGLSLStorage{
    const = "const",
    attribute = "attribute",
    uniform = "uniform",
    varying = "varying",
}


export enum MusesGLSLPercision{
    lowp = "lowp",
    mediump = "mediump",
    highp = "highp",
}
export enum MusesGLSLParmerters{
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
}

export class MusesVariableDeclaration extends MusesNode {
    get name(){
        return this.options.name;
    }
    check(ctx: MusesContext): void {
        const same = ctx.variables.find(v => v.name === this.options.name) || ctx.types.find(t => t.name === this.options.name);
        if(same){
            throw new Error(`Variable ${this.options.name} is already defined`);
        }
        const variable = this.toCtxVariable(ctx); 
        if(this.options.value){
            const valueType =  this.options.value.check(ctx);
            if(!valueType){
                throw new Error(`Right value is not defined`);
            }
            if(!variable.type.equal(valueType)){
                throw new Error(`Variable ${this.options.name} type ${this.options.type.name} is not equal to value type ${valueType.name}`);
            }
        }
        ctx.variables.push(variable);
    }

    toCtxVariable(ctx: MusesContext): MusesContextVariable {
        const currentType = ctx.types.find(t => t.name === this.options.type.name);
        if(!currentType){
            throw new Error(`Type ${this.options.type.name} is not defined`);
        
        }
        return new MusesContextVariable({
            name: this.options.name,
            type: currentType.copy({
                storage: this.options.storage,
                percision: this.options.percision,
                parameters: this.options.parameters,
            }),
        });
    }

    toCtxType(ctx: MusesContext): MusesContextType {
        const currentType = ctx.types.find(t => t.name === this.options.type.name);
        if(!currentType){
            throw new Error(`Type ${this.options.type.name} is not defined`);
        }
        return currentType.copy({
            storage: this.options.storage,
            percision: this.options.percision,
            parameters: this.options.parameters,
        });
    }

    nodeType: MusesAstNodeType = MusesAstNodeType.VariableDeclaration;
    constructor(private readonly options: IMusesVariableDeclarationOptions) {
        super();
    }
}