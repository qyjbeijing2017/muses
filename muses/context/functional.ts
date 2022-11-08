import { MusesFunctionDeclaration } from "../ast/glsl/function-declaration";
import { MusesContextType } from "./type";
import { MusesContextVariable } from "./variable";

export class MusesContextFunction {
    readonly parameter: MusesContextVariable[];
    readonly returnType: MusesContextType;
    readonly name: string;
    readonly sign: string;
    readonly userFunction?: MusesFunctionDeclaration;
    constructor(name:string, returnType: MusesContextType, parameter: MusesContextVariable[], userFunction?: MusesFunctionDeclaration) {
        this.returnType = returnType;
        this.parameter = parameter;
        this.name = name;
        this.sign = `${name}(${parameter.map(p => p.type.sign).join(',')})`;
        this.userFunction = userFunction;
    }
}