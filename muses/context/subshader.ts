import { MusesContextBase } from "./base";
import { MusesContextFunction } from "./functional";
import { MusesPassContext } from "./pass";
import { MusesContextType } from "./type";
import { MusesContextVariable } from "./variable";

export class MusesSubShaderContext extends MusesContextBase {
    private passes: MusesPassContext[] = []; 
    get passContexts(): MusesPassContext[]{
        return this.passes;
    }

    constructor(private readonly defines: {
        functions?: MusesContextFunction[],
        variables?: MusesContextVariable[],
        types?: MusesContextType[]
    } = {}){
        super();
    }

    createPassContext(): MusesPassContext{
        const defines = {
            functions: [...this.defines.functions ?? []],
            variables: [...this.defines.variables ?? []],
            types: [...this.defines.types ?? []],
        }
        const ctx = new MusesPassContext(defines);
        this.passes.push(ctx);
        return ctx;
    }
}