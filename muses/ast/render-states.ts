import { IMusesNodeOptions, MusesGLSLNode } from "./node";
import { MusesAstNodeType } from "./nodeType";

export enum MusesRenderState {
    OFF = -1,
    ZERO = 0,
    ONE = 1,
    
    NEVER = 512,
    LESS = 513,
    EQUAL = 514,
    LEQUAL = 515,
    GREATER = 516,
    NOTEQUAL = 517,
    GEQUAL = 518,
    ALWAYS = 519,

    SRC_COLOR = 768,
    ONE_MINUS_SRC_COLOR = 769,
    DST_COLOR = 774,
    ONE_MINUS_DST_COLOR = 775,
    SRC_ALPHA = 770,
    ONE_MINUS_SRC_ALPHA = 771,
    DST_ALPHA = 772,
    ONE_MINUS_DST_ALPHA = 773,
    CONSTANT_COLOR = 32769,
    ONE_MINUS_CONSTANT_COLOR = 32770,
    CONSTANT_ALPHA = 32771,
    ONE_MINUS_CONSTANT_ALPHA = 32772,
    SRC_ALPHA_SATURATE = 776, 
    
    FRONT = 1028,
    BACK = 1029,
    FRONT_AND_BACK = 1032,
}


type MusesBlenderF = "ZERO" |
    "ONE" |
    "SRC_COLOR" |
    "ONE_MINUS_SRC_COLOR" |
    "DST_COLOR" |
    "ONE_MINUS_DST_COLOR" |
    "SRC_ALPHA" |
    "ONE_MINUS_SRC_ALPHA" |
    "DST_ALPHA" |
    "ONE_MINUS_DST_ALPHA" |
    "CONSTANT_COLOR" |
    "ONE_MINUS_CONSTANT_COLOR" |
    "CONSTANT_ALPHA" |
    "ONE_MINUS_CONSTANT_ALPHA" |
    "SRC_ALPHA_SATURATE";

type MusesRenderF = "OFF" | "NEVER" | "LESS" | "EQUAL" | "LEQUAL" | "GREATER" | "NOTEQUAL" | "GEQUAL"| "ALWAYS";

type MusesRenderFace = "FRONT" | "BACK" | "FRONT_AND_BACK" | "OFF";

export interface IMusesRenderStatesOptions extends IMusesNodeOptions {
    zTest?: MusesRenderF;
    zWrite?: "ON" | "OFF";
    stencil?: [MusesRenderF, number, number];
    blend?: [ MusesBlenderF, MusesBlenderF ];
    cull?: MusesRenderFace;
}

export class MusesRenderStates extends MusesGLSLNode {
    private _zTest = MusesRenderState.LESS;
    private _zWrite = true;
    private _stencil: [MusesRenderState, number, number] = [MusesRenderState.OFF, MusesRenderState.OFF, MusesRenderState.OFF];
    private _blend: [MusesRenderState, MusesRenderState] = [MusesRenderState.OFF, MusesRenderState.OFF];
    private _cull = MusesRenderState.BACK;

    get zTest(): MusesRenderState {
        return this._zTest;
    }

    get zWrite(): boolean {
        return this._zWrite;
    }

    get stencil(): [MusesRenderState, number, number] {
        return this._stencil;
    }

    get blend(): [MusesRenderState, MusesRenderState] {
        return this._blend;
    }

    get cull(): MusesRenderState {
        return this._cull;
    }

    toMuses(): string {
        throw new Error("Method not implemented.");
    }
    toGLSL(): string {
        throw new Error("Method not implemented.");
    }
    nodeType: MusesAstNodeType = MusesAstNodeType.RenderStates;
    constructor(options: IMusesRenderStatesOptions = {}) {
        super();
        if (options.zTest) {
            this._zTest = MusesRenderState[options.zTest];
        }
        if (options.zWrite) {
            this._zWrite = options.zWrite === "ON";
        }
        if (options.stencil) {
            this._stencil = [MusesRenderState[options.stencil[0]], options.stencil[1], options.stencil[2]];
        }
        if (options.blend) {
            this._blend = [MusesRenderState[options.blend[0]], MusesRenderState[options.blend[1]]];
        }
        if (options.cull) {
            this._cull = MusesRenderState[options.cull];
        }
    }
}