import { MusesVariableDeclaration } from "../ast/glsl/variable-declaration";
import { MusesContextType } from "./type";


export class MusesContextVariable {
    readonly type: MusesContextType;
    readonly name: string;
    readonly variable?: MusesVariableDeclaration;

    constructor(desc: {
        type: MusesContextType,
        name: string,
        variable?: MusesVariableDeclaration,
        local?: boolean,
    }) {
        this.type = desc.type;
        this.name = desc.name;
        this.variable = desc.variable;
    }
}