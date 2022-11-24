import { BlendOp } from "./blendop";
import { CompOp } from "./compop";
import { CullState } from "./cullstate";
import { Factor } from "./factor";
import { StencilOp } from "./stencilop";
import { ZTestOp } from "./ztestop";

export interface IRenderState {
    AlphaToMask: boolean;
    Blend: {
        enabled: boolean;
        sfactor: Factor;
        dfactor: Factor;
        op: BlendOp;
    };
    ColorMask: {
        enabled: boolean;
        r: boolean;
        g: boolean;
        b: boolean;
        a: boolean;
    };
    Conservative: boolean;
    Cull: {
        enabled: boolean;
        mode: CullState;
    };
    Offset: {
        enabled: boolean;
        factor: number;
        units: number;
    };
    Stencil: {
        enabled: boolean;
        Ref: number;
        ReadMask: number;
        WriteMask: number;
        Comp: CompOp;
        Pass: StencilOp;
        Fail: StencilOp;
        ZFail: StencilOp;
        CompBack: CompOp;
        PassBack: StencilOp;
        FailBack: StencilOp;
        ZFailBack: StencilOp;
        CompFront: CompOp;
        PassFront: StencilOp;
        FailFront: StencilOp;
        ZFailFront: StencilOp;
    };
    ZClip: boolean;
    ZTest: ZTestOp;
    ZWrite: boolean;
    Tags: { [key: string]: string };
    Lod: number;
}