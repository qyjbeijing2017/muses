import { MusesContextFunction } from "./functional";
import { MusesContextType } from "./type";
import { MusesContextVariable } from "./variable";

export class MusesContext {
    functions: MusesContextFunction[] = [];
    variables: MusesContextVariable[] = [];
    types: MusesContextType[] = [];
    loop: boolean[] = [];
    funcName: undefined| string;

    constructor(defines: {
        functions?: MusesContextFunction[],
        variables?: MusesContextVariable[],
        types?: MusesContextType[]
    } = {}){
        this.functions = defines.functions || [];
        this.variables = defines.variables || [];
        this.types = defines.types || [];
    }
}