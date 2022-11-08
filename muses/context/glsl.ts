import { MusesContextBase } from "./base";
import { MusesContextFunction } from "./functional";
import { MusesContextType } from "./type";
import { MusesContextVariable } from "./variable";

export class MusesGLSLContext extends MusesContextBase {
    readonly functions: MusesContextFunction[] = [];
    readonly variables: MusesContextVariable[] = [];
    readonly types: MusesContextType[] = [];
    loop: boolean[] = [];
    funcName: undefined | string;

    constructor(defines: {
        functions?: MusesContextFunction[],
        variables?: MusesContextVariable[],
        types?: MusesContextType[]
    } = {}){
        super();
        this.functions = defines.functions || [];
        this.variables = defines.variables || [];
        this.types = defines.types || [];
    }
}