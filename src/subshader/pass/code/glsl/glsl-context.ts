export interface IGLSLTypeContext {
    isStruct?: boolean;
    name: string;
    rules: {
        test: RegExp;
        returnType: string;
    }[];
}

export interface IGLSLVariableContext {
    name: string;
    typeName: string;
    percision?: 'lowp' | 'mediump' | 'highp';
    const?: boolean;
    storage?: 'in' | 'out' | 'inout' | 'uniform' | 'varying' | 'attribute';
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
    getFunction(sign: string): IGLSLFunctionContext | null {
        return this._functions[sign] || null;
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
        const sign = func.name + '(' + func.parameters.map((p) => p.typeName).join(',') + ')' + func.returnTypeName;
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

    checkOperator(left: string, right: string, operator: string): string | null {
        const type = this.getType(left);
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
                    { test: /^bool=bool$/, returnType: 'bool' },
                    { test: /^bool\!=bool$/, returnType: 'bool' },
                    { test: /^bool\(int\)$/, returnType: 'bool' },
                    { test: /^bool\(float\)$/, returnType: 'bool' },
                ],
            },
            'float': {
                name: 'float',
                rules: [
                    { test: /^float=float$/, returnType: 'float' },
                    { test: /^float+float$/, returnType: 'float' },
                    { test: /^float\-float$/, returnType: 'float' },
                    { test: /^float\*float$/, returnType: 'float' },
                    { test: /^float\/float$/, returnType: 'float' },
                    { test: /^float\*vec2$/, returnType: 'vec2' },
                    { test: /^float\*vec3$/, returnType: 'vec3' },
                    { test: /^float\*vec4$/, returnType: 'vec4' },
                    { test: /^float\*mat2$/, returnType: 'mat2' },
                    { test: /^float\*mat3$/, returnType: 'mat3' },
                    { test: /^float\*mat4$/, returnType: 'mat4' },
                    { test: /^float\(int\)$/, returnType: 'float' },
                    { test: /^float\(float\)$/, returnType: 'float' },
                    { test: /^float\(bool\)$/, returnType: 'float' },
                ],
            },
            'int': {
                name: 'int',
                rules: [
                    { test: /^int=int$/, returnType: 'int' },
                    { test: /^int+int$/, returnType: 'int' },
                    { test: /^int\-int$/, returnType: 'int' },
                    { test: /^int\*int$/, returnType: 'int' },
                    { test: /^int\/int$/, returnType: 'int' },
                    { test: /^int\(int\)$/, returnType: 'int' },
                    { test: /^int\(float\)$/, returnType: 'int' },
                    { test: /^int\(bool\)$/, returnType: 'int' },
                ],
            },
            'vec2': {
                name: 'vec2',
                rules: [
                    { test: /^vec2=vec2$/, returnType: 'vec2'},
                    { test: /^vec2+vec2$/, returnType: 'vec2' },
                    { test: /^vec2\-vec2$/, returnType: 'vec2' },
                    { test: /^vec2\*vec2$/, returnType: 'vec2' },
                    { test: /^vec2\/vec2$/, returnType: 'vec2' },
                    { test: /^vec2\*float$/, returnType: 'vec2' },
                    { test: /^vec2\/float$/, returnType: 'vec2' },
                    { test: /^vec2\(float(,float){0,1}\)$/, returnType: 'vec2' },
                ],
            },
            'vec3': {
                name: 'vec3',
                rules: [
                    { test: /^vec3=vec3$/, returnType: 'vec3'},
                    { test: /^vec3+vec3$/, returnType: 'vec3' },
                    { test: /^vec3\-vec3$/, returnType: 'vec3' },
                    { test: /^vec3\*vec3$/, returnType: 'vec3' },
                    { test: /^vec3\/vec3$/, returnType: 'vec3' },
                    { test: /^vec3\*float$/, returnType: 'vec3' },
                    { test: /^vec3\/float$/, returnType: 'vec3' },
                    { test: /^vec3\(float(,float){0,2}\)$/, returnType: 'vec3' },
                ],
            },
            'vec4': {
                name: 'vec4',
                rules: [
                    { test: /^vec4=vec4$/, returnType: 'vec4'},
                    { test: /^vec4+vec4$/, returnType: 'vec4' },
                    { test: /^vec4\-vec4$/, returnType: 'vec4' },
                    { test: /^vec4\*vec4$/, returnType: 'vec4' },
                    { test: /^vec4\/vec4$/, returnType: 'vec4' },
                    { test: /^vec4\*float$/, returnType: 'vec4' },
                    { test: /^vec4\/float$/, returnType: 'vec4' },
                    { test: /^vec4\(float(,float){0,2}\)$/, returnType: 'vec4' },
                ],
            }
        };
    }
}
