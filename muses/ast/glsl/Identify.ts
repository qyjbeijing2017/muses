import { MusesGLSLContext } from "../../context/glsl";
import { MusesContextType } from "../../context/type";
import { MusesGLSLTree } from "../glsltree";
import { IMusesNodeOptions, MusesGLSLNode } from "../node";
import { MusesAstNodeType } from "../nodeType";

export interface IMusesIdentifyOptions extends IMusesNodeOptions {
    name: string;
}

export class MusesIdentify extends MusesGLSLNode {
    subTree(ctx: MusesGLSLContext, tree: MusesGLSLTree): void {
        const variable = ctx.variables.find(variable=> variable.name === this.name);
        if(variable?.variable && tree.variables.find(variable=> variable.name === this.name) === undefined){
            tree.variables.push(variable?.variable);
            variable.variable.subTree(ctx, tree);
        }
    }
    toMuses(): string {
        return this.toGLSL();
    }
    toGLSL(): string {
        return this.name;
    }
    check(ctx: MusesGLSLContext): MusesContextType {
        const variables = ctx.variables.find(variable=> variable.name === this.name);
        if(!variables){
            throw new Error(`Variable ${this.name} is not defined`);
        }
        return variables.type;
    }
    get name(){
        return this.options.name;
    }
    nodeType: MusesAstNodeType = MusesAstNodeType.Identify;
    constructor(private readonly options: IMusesIdentifyOptions) {
        super();
    }
}