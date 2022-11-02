import { MusesContextBase } from "./base";
import { MusesContextFunction } from "./functional";
import { MusesGLSLContext } from "./glsl";
import { MusesSubShaderContext } from "./subshader";
import { MusesContextType } from "./type";
import { MusesContextVariable } from "./variable";


export class MusesShaderContext extends MusesContextBase {
    private subShaders: MusesSubShaderContext[] = [];
    private properties: MusesGLSLContext = new MusesGLSLContext();
    get subShaderContexts(): MusesSubShaderContext[] {
        return this.subShaders;
    }

    constructor(private readonly defines: {
        functions?: MusesContextFunction[],
        variables?: MusesContextVariable[],
        types?: MusesContextType[]
    } = {}) {
        super();
    }

    get propertiesCtx(): MusesGLSLContext {
        return this.properties;
    }

    createSubShaderContext(): MusesSubShaderContext {
        const defines = {
            functions: this.defines.functions,
            variables: [...this.properties.variables, ...(this.defines.variables || [])],
            types: this.defines.types,
        }
        const ctx = new MusesSubShaderContext(this.defines);
        this.subShaders.push(ctx);
        return ctx;
    }

}