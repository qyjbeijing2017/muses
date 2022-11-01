import { MusesContextType } from "./type";
import { MusesContextVariable } from "./variable";

export class MusesContextFunction {
    parameter: MusesContextVariable[];
    returnType: MusesContextType;
    name: string;
    constructor(name:string, returnType: MusesContextType, parameter: MusesContextVariable[]) {
        this.returnType = returnType;
        this.parameter = parameter;
        this.name = name;
    }
}