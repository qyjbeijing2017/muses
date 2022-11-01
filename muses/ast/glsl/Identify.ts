import { MusesContext } from "../context/context";
import { MusesContextType } from "../context/type";
import { IMusesNodeOptions, MusesNode } from "../node";
import { MusesAstNodeType } from "../nodeType";

export interface IMusesIdentifyOptions extends IMusesNodeOptions {
    name: string;
}

export class MusesIdentify extends MusesNode {
    check(ctx: MusesContext): MusesContextType {
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