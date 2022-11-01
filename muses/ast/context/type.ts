import { MusesGLSLStorage, MusesGLSLParmerters, MusesGLSLPercision } from "../glsl/variable-declaration";

export class MusesContextType {
    name: string;
    rules?: {test:RegExp, returnType?: MusesContextType}[];
    storage?: MusesGLSLStorage;
    percision?: MusesGLSLPercision;
    parameters?: MusesGLSLParmerters;
    isStruct?: boolean;
    constructor(
        desc: {
            name: string,
            parent?: MusesContextType,
            isStruct?: boolean,
            storage?: MusesGLSLStorage;
            percision?: MusesGLSLPercision;
            parameters?: MusesGLSLParmerters;
            rules?: {test:RegExp, returnType?: MusesContextType}[]; 
        },
    ) {
        this.name = desc.name;
        this.isStruct = desc.isStruct;
        this.storage = desc.storage;
        this.percision = desc.percision;
        this.parameters = desc.parameters;
        this.rules = desc.rules;

        if (this.isStruct && (this.storage || this.percision)) {
            throw new Error(`Struct ${this.name} can not have storage or percision limit`);
        }
    }

    checkRule(name: string): MusesContextType {
        const rule = this.rules?.find(r => r.test.test(name));
        if(!rule){
            throw new Error(`Type ${this.name} has no rule for ${name}`);
        }
        return rule.returnType || this;
    }

    copy(limit?: {
        storage?: MusesGLSLStorage;
        percision?: MusesGLSLPercision;
        parameters?: MusesGLSLParmerters;
    }): MusesContextType {
        return new MusesContextType({
            name: this.name,
            isStruct: this.isStruct,
            storage: limit?.storage || this.storage,
            percision: limit?.percision || this.percision,
            parameters: limit?.parameters || this.parameters,
            rules: this.rules
        });
    }

    equal(type: MusesContextType): boolean {
        return this.name === type.name;
    }
}
