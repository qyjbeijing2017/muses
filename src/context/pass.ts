import { MusesContextBase } from "./base";
import { MusesContextFunction } from "./functional";
import { MusesGLSLContext } from "./glsl";
import { MusesContextType } from "./type";
import { MusesContextVariable } from "./variable";

export class MusesPassContext extends MusesContextBase {
    private glsl?: MusesGLSLContext;
    get glslCtx(): MusesGLSLContext{
        if(!this.glsl){
            this.glsl = new MusesGLSLContext(this.defines);
        }
        return this.glsl;
    }
    constructor(private readonly defines: {
        functions?: MusesContextFunction[],
        variables?: MusesContextVariable[],
        types?: MusesContextType[]
    } = {}){
        super();
    }
    createGLSLContext(): MusesGLSLContext{
        const glsl = new MusesGLSLContext(this.defines);
        this.glsl = glsl;
        return glsl;
    }
}