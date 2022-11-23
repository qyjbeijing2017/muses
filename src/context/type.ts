import { MusesStructDeclaration } from "../ast/glsl/struct-declaration";
import { MusesGLSLStorage, MusesGLSLParmerters, MusesGLSLPercision } from "../ast/glsl/variable-declaration";

export class MusesContextType {
    readonly name: string;
    readonly rules?: { test: RegExp, returnType?: MusesContextType, returnArray?: boolean }[];
    readonly storage?: MusesGLSLStorage;
    readonly percision?: MusesGLSLPercision;
    readonly parameters?: MusesGLSLParmerters;
    readonly struct?: MusesStructDeclaration;
    readonly isArray?: boolean;
    constructor(
        desc: {
            name: string,
            parent?: MusesContextType,
            struct?: MusesStructDeclaration,
            storage?: MusesGLSLStorage;
            percision?: MusesGLSLPercision;
            parameters?: MusesGLSLParmerters;
            rules?: { test: RegExp, returnType?: MusesContextType, returnArray?: boolean }[];
            isArray?: boolean;
        },
    ) {
        this.name = desc.name;
        this.struct = desc.struct;
        this.storage = desc.storage;
        this.percision = desc.percision;
        this.parameters = desc.parameters;
        this.rules = desc.rules;
        this.isArray = desc.isArray;

        if (this.struct && (this.percision)) {
            throw new Error(`Struct ${this.name} can not have percision limit`);
        }
    }

    checkRule(sign: string): MusesContextType {
        const rule = this.rules?.find(r => r.test.test(sign));
        if (!rule) {
            console.log(rule);
            throw new Error(`Type ${this.sign} has no rule for ${sign}`);
        }
        return rule.returnType || (rule.returnArray ? this.copy({ isArray: true }) : this.copy());
    }

    copy(limit?: {
        storage?: MusesGLSLStorage;
        percision?: MusesGLSLPercision;
        parameters?: MusesGLSLParmerters;
        isArray?: boolean;
    }): MusesContextType {
        return new MusesContextType({
            name: this.name,
            struct: this.struct,
            storage: limit?.storage || this.storage,
            percision: limit?.percision || this.percision,
            parameters: limit?.parameters || this.parameters,
            rules: this.rules,
            isArray: limit?.isArray,
        });
    }

    equal(type: MusesContextType): boolean {
        return this.name === type.name;
    }

    get sign(): string {
        return `${this.name}${this.isArray ? '[]' : ''}`;
    }
}
