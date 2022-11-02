import { MusesContextType } from "./type";
import { MusesContextVariable } from "./variable";

export class MusesContextFunction {
    readonly parameter: MusesContextVariable[];
    readonly returnType: MusesContextType;
    readonly name: string;
    readonly sign: string;
    readonly isCompilerFunction: boolean;
    constructor(name:string, returnType: MusesContextType, parameter: MusesContextVariable[], isCompilerFunction: boolean = false) {
        this.returnType = returnType;
        this.parameter = parameter;
        this.name = name;
        this.sign = `${name}(${parameter.map(p => p.type.name).join(',')})`;
        this.isCompilerFunction = isCompilerFunction;
    }
}