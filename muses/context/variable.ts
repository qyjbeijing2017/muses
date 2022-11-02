import { MusesContextType } from "./type";

export class MusesContextVariable {
    readonly type: MusesContextType;
    readonly name: string;
    readonly isCompilerVariable: boolean;

    constructor(desc: {
        type: MusesContextType,
        name: string,
        isCompilerVariable?: boolean,
    }) {
        this.type = desc.type;
        this.name = desc.name;
        this.isCompilerVariable = desc.isCompilerVariable || false;
    }
}