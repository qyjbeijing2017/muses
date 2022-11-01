import { MusesGLSLParmerters, MusesGLSLPercision, MusesGLSLStorage } from "../glsl/variable-declaration";
import { MusesContextType } from "./type";

export class MusesContextVariable{
    readonly type: MusesContextType;
    readonly name: string;
    private value?: any;
    private parents?: MusesContextVariable;

    constructor(desc:{
        type: MusesContextType,
        name: string,
    }, parents?: MusesContextVariable){
        this.type = desc.type;
        this.name = desc.name;
    }
}