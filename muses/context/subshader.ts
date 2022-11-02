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
        const ctx = new MusesPassContext(this.defines);
        this.passes.push(ctx);
        return ctx;
    }
}