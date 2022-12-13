import { IProgram } from "./ast-interface/program";

export interface IGLSLTypeContext {
    isStruct?: boolean;
    name: string;
    rules: {
        test: RegExp;
        returnType: string;
    }[];
    percision?: 'lowp' | 'mediump' | 'highp';
}

export interface IGLSLVariableContext {
    name: string;
    typeName: string;
    percision?: 'lowp' | 'mediump' | 'highp';
    const?: boolean;
    storage?: 'in' | 'out' | 'inout' | 'uniform' | 'varying' | 'attribute';
    arrayLength?: any;
}

export interface IGLSLFunctionContext {
    sign: string;
    returnTypeName: string;
    parameters: {
        name: string;
        typeName: string;
    }[];
    onlyDefine?: boolean;
}

export class GLSLContext {
    private _types: { [name: string]: IGLSLTypeContext; };
    private _variables: { [name: string]: IGLSLVariableContext; };
    private _functions: { [sign: string]: IGLSLFunctionContext; };
    private _localVariables: { [name: string]: IGLSLVariableContext; }[];
    private _isFunctionParameter: boolean = false;
    getVariable(name: string): IGLSLVariableContext | null {
        for (let i = this._localVariables.length - 1; i >= 0; i--) {
            const localVariable = this._localVariables[i];
            if (localVariable[name]) {
                return localVariable[name];
            }
        }
        return this._variables[name] || null;
    }
    setVariable(variable: IGLSLVariableContext) {
        const name = variable.name;
        if (this._localVariables.length !== 0) {
            const lastIndex = this._localVariables.length - 1;
            if (this._localVariables[lastIndex][name]) {
                throw new Error('variable ' + name + ' already exists in current scope');
            };
            this._localVariables[lastIndex][name] = variable;
            return;
        }
        if (this._variables[name]) {
            throw new Error('variable ' + name + ' already exists in global scope');
        }
        this._variables[name] = variable;

    }
    getFunctionOrConstructor(sign: string): { isConstructor?: boolean, typeName: string } | null {
        if (this._functions[sign]) {
            return { typeName: this._functions[sign].returnTypeName };
        }
        const typeName = sign.split('(')[0];
        const type = this.getType(typeName);
        if (type) {
            const rules = type.rules;
            for (let i = 0; i < rules.length; i++) {
                const rule = rules[i];
                if (rule.test.test(sign)) {
                    return { isConstructor: true, typeName };
                }
            }
        }
        return null;
    }

    setFunction(func: {
        name: string;
        returnTypeName: string;
        parameters: {
            name: string;
            typeName: string;
        }[],
        onlyDefine?: boolean;
    }) {
        const sign = func.name + '(' + func.parameters.map((p) => p.typeName).join(',') + ')';
        if (this._functions[sign]) {
            if (!this._functions[sign].onlyDefine || func.onlyDefine) {
                throw new Error('function ' + sign + ' already exists');
            }
        }
        this._functions[sign] = {
            sign,
            returnTypeName: func.returnTypeName,
            parameters: func.parameters,
            onlyDefine: func.onlyDefine,
        };
    }

    getType(name: string): IGLSLTypeContext | null {
        return this._types[name] || null;
    }

    setStruct(struct: IGLSLTypeContext) {
        if (this._types[struct.name]) {
            throw new Error('type ' + struct.name + ' already exists');
        }
        this._types[struct.name] = struct;
    }

    addFunctionScope() {
        this._isFunctionParameter = true;
        this._localVariables.push({});
    }
    addScope() {
        if (this._isFunctionParameter) {
            this._isFunctionParameter = false;
            return;
        }
        this._localVariables.push({});
    }
    popScope() {
        this._isFunctionParameter = false;
        this._localVariables.pop();
    }

    checkOperator(left: string | undefined, operator: string, right: string | undefined): string | null {
        const typeName = left || right;
        if (!typeName) {
            return null;
        }
        if (/[]$/.test(typeName)) {
            if (right === left && operator === '=') {
                return typeName;
            }
            return null;
        }
        const type = this.getType(typeName);
        if (!type) {
            return null;
        }
        for (const rule of type.rules) {
            if (rule.test.test(left + operator + right)) {
                return rule.returnType;
            }
        }
        return null;
    }

    getMemberType(structName: string, memberName: string): string | null {
        const type = this.getType(structName);
        if (!type) {
            return null;
        }
        for (const rule of type.rules) {
            if (rule.test.test(structName + '.' + memberName)) {
                return rule.returnType;
            }
        }
        return null;
    }

    getIndexType(arrayName: string): string | null {
        if (/[]$/.test(arrayName)) {
            return arrayName.replace(/[]$/, '');
        }
        const type = this.getType(arrayName);
        if (!type) {
            return null;
        }
        for (const rule of type.rules) {
            if (rule.test.test(arrayName + '[]')) {
                return rule.returnType;
            }
        }
        return null;
    }

    setPercision(percision: 'lowp' | 'mediump' | 'highp', typeName: string): string | null {
        const type = this.getType(typeName);
        if (!type) {
            return null;
        }
        if(type.percision) {
            type.percision = percision;
            return percision;
        }
        return null;
    }

    static combineContexts(contexts: GLSLContext[]): GLSLContext {
        const context = new GLSLContext();
        for (const c of contexts) {
            context._variables = { ...context._variables, ...c._variables };
            context._functions = { ...context._functions, ...c._functions };
            context._types = { ...context._types, ...c._types };
        }
        return context;
    }

    constructor() {
        this._variables = {};
        this._functions = {};
        this._localVariables = [];
        this._types = {
            'void': {
                name: 'void',
                rules: [],
            },
            'bool': {
                name: 'bool',
                rules: [
                    { test: /^bool(\|\||\^\^|\&\&|\!=|=|==)bool$/, returnType: 'bool' },
                    { test: /^bool\(int|float\)$/, returnType: 'bool' },
                ],
            },
            'float': {
                name: 'float',
                rules: [
                    { test: /^float(\+|\-|\*|\/){0,1}=float$/, returnType: 'float' },
                    { test: /^float(\+|\-|\*|\/)float$/, returnType: 'float' },
                    { test: /^float(\>|\<|\>=|\<=|!=|==)float$/, returnType: 'bool' },
                    { test: /^float(\+|\-|\*|\/)vec[2-4]$/, returnType: 'vec2' },
                    { test: /^float(\+|\-|\*|\/)mat[2-4]$/, returnType: 'mat2' },
                    { test: /^float\((int|float|bool)\)$/, returnType: 'float' },
                    { test: /^(\+{1,2}|\-{1,2})?float(\+\+|\-\-)?$/, returnType: 'float' },
                ],
                percision: 'mediump',
            },
            'int': {
                name: 'int',
                rules: [
                    { test: /^int(\+|\-|\*|\/){0,1}=int$/, returnType: 'int' },
                    { test: /^int(\+|\-|\*|\/)int$/, returnType: 'int' },
                    { test: /^int(\>|\<|\>=|\<=|!=|==)int$/, returnType: 'bool' },
                    { test: /^int\((int|float|bool)\)$/, returnType: 'int' },
                    { test: /^(\+{1,2}|\-{1,2})?int(\+\+|\-\-)?$/, returnType: 'int' },
                ],
                percision: 'mediump',
            },
            'vec2': {
                name: 'vec2',
                rules: [
                    { test: /^vec2(\+|\-|\*|\/){0,1}=vec2$/, returnType: 'vec2' },
                    { test: /^vec2(\+|\-|\*|\/)vec2$/, returnType: 'vec2' },
                    { test: /^vec2(\+|\-|\*|\/)float$/, returnType: 'vec2' },
                    { test: /^vec2*mat3$/, returnType: 'vec2' },
                    { test: /^vec2\(float(,float){0,1}\)$/, returnType: 'vec2' },
                    { test: /^vec2\[\]$/, returnType: 'float' },
                    { test: /^vec2.[xyrgst]$/, returnType: 'float' },
                    { test: /^vec2.[xyrgst]{2}$/, returnType: 'vec2' },
                    { test: /^vec2.[xyrgst]{3}$/, returnType: 'vec3' },
                    { test: /^vec2.[xyrgst]{4}$/, returnType: 'vec4' },
                    { test: /^\-vec2$/, returnType: 'vec2' },
                ],
                percision: 'mediump',
            },
            'vec3': {
                name: 'vec3',
                rules: [
                    { test: /^vec3(\+|\-|\*|\/){0,1}=vec3$/, returnType: 'vec3' },
                    { test: /^vec3(\+|\-|\*|\/)vec3$/, returnType: 'vec3' },
                    { test: /^vec3(\+|\-|\*|\/)float$/, returnType: 'vec3' },
                    { test: /^vec3*mat3$/, returnType: 'vec3' },
                    { test: /^vec3\(float(,float){0,2}\)$/, returnType: 'vec3' },
                    { test: /^vec3\[\]$/, returnType: 'float' },
                    { test: /^vec3.[xyzrgbstr]$/, returnType: 'float' },
                    { test: /^vec3.[xyzrgbstr]{2}$/, returnType: 'vec2' },
                    { test: /^vec3.[xyzrgbstr]{3}$/, returnType: 'vec3' },
                    { test: /^vec3.[xyzrgbstr]{4}$/, returnType: 'vec4' },
                    { test: /^\-vec3$/, returnType: 'vec3' },
                ],
                percision: 'mediump',
            },
            'vec4': {
                name: 'vec4',
                rules: [
                    { test: /^vec4(\+|\-|\*|\/){0,1}=vec4$/, returnType: 'vec4' },
                    { test: /^vec4(\+|\-|\*|\/)vec4$/, returnType: 'vec4' },
                    { test: /^vec4(\+|\-|\*|\/)float$/, returnType: 'vec4' },
                    { test: /^vec4*mat4$/, returnType: 'vec4' },
                    { test: /^vec4\(float(,float){0,3}\)$/, returnType: 'vec4' },
                    { test: /^vec4\[\]$/, returnType: 'float' },
                    { test: /^vec4.[xyzwrgbastrq]$/, returnType: 'float' },
                    { test: /^vec4.[xyzwrgbastrq]{2}$/, returnType: 'vec2' },
                    { test: /^vec4.[xyzwrgbastrq]{3}$/, returnType: 'vec3' },
                    { test: /^vec4.[xyzwrgbastrq]{4}$/, returnType: 'vec4' },
                    { test: /^\-vec4$/, returnType: 'vec4' },
                ],
                percision: 'mediump',
            },
            'mat2': {
                name: 'mat2',
                rules: [
                    { test: /^mat2(\+|\-|\*|\/){0,1}=mat2$/, returnType: 'mat2' },
                    { test: /^mat2(\+|\-|\*|\/)mat2$/, returnType: 'mat2' },
                    { test: /^mat2(\+|\-|\*|\/)float$/, returnType: 'mat2' },
                    { test: /^mat2*vec2$/, returnType: 'vec2' },
                    { test: /^mat2\(float(,float){0,3}\)$/, returnType: 'mat2' },
                    { test: /^mat2\(vec2(,vec2){0,1}\)$/, returnType: 'mat2' },
                    { test: /^mat2\[\]$/, returnType: 'vec2' },
                ],
                percision: 'mediump',
            },
            'mat3': {
                name: 'mat3',
                rules: [
                    { test: /^mat3(\+|\-|\*|\/){0,1}=mat3$/, returnType: 'mat3' },
                    { test: /^mat3(\+|\-|\*|\/)mat3$/, returnType: 'mat3' },
                    { test: /^mat3(\+|\-|\*|\/)float$/, returnType: 'mat3' },
                    { test: /^mat4*vec3$/, returnType: 'vec3' },
                    { test: /^mat3\(float(,float){0,8}\)$/, returnType: 'mat3' },
                    { test: /^mat3\(vec3(,vec3){0,2}\)$/, returnType: 'mat3' },
                    { test: /^mat3\[\]$/, returnType: 'vec3' },
                ],
                percision: 'mediump',
            },
            'mat4': {
                name: 'mat4',
                rules: [
                    { test: /^mat4(\+|\-|\*|\/){0,1}=mat4$/, returnType: 'mat4' },
                    { test: /^mat4(\+|\-|\*|\/)mat4$/, returnType: 'mat4' },
                    { test: /^mat4(\+|\-|\*|\/)float$/, returnType: 'mat4' },
                    { test: /^mat4*vec4$/, returnType: 'vec4' },
                    { test: /^mat4\(float(,float){0,15}\)$/, returnType: 'mat4' },
                    { test: /^mat4\(vec4(,vec4){0,3}\)$/, returnType: 'mat4' },
                    { test: /^mat4\[\]$/, returnType: 'vec4' },
                ],
                percision: 'mediump',
            },
            'sampler2D': {
                name: 'sampler2D',
                rules: [
                    { test: /^sampler2D=sampler2D$/, returnType: 'sampler2D' },
                ],
            },
            'samplerCube': {
                name: 'samplerCube',
                rules: [
                    { test: /^samplerCube=samplerCube$/, returnType: 'samplerCube' },
                ],
            },
        };
    }
}
