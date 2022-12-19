import { BlendOp } from "./blendop";
import { CompOp } from "./compop";
import { CullState } from "./cullstate";
import { Factor } from "./factor";
import { IRenderState } from "./renderstate";
import { StencilOp } from "./stencilop";
import { ZTestOp } from "./ztestop";

export const defaultRenderState: IRenderState = {
    AlphaToMask: false,
    Blend: {
        targets: new Map([
            [-1, {
                enabled: false,
                sfactor: Factor.SrcAlpha,
                dfactor: Factor.OneMinusSrcAlpha,
            }],
        ]),
        op: BlendOp.Add,
    },
    ColorMask: {
        enabled: false,
        r: true,
        g: true,
        b: true,
        a: true,
    },
    Conservative: false,
    Cull: {
        enabled: true,
        mode: CullState.Back,
    },
    Offset: {
        enabled: false,
        factor: -1,
        units: -1,
    },
    Stencil: {
        enabled: false,
        Ref: 0,
        ReadMask: 255,
        WriteMask: 255,
        Comp: CompOp.Always,
        Pass: StencilOp.Keep,
        Fail: StencilOp.Keep,
        ZFail: StencilOp.Keep,
        CompBack: CompOp.Always,
        PassBack: StencilOp.Keep,
        FailBack: StencilOp.Keep,
        ZFailBack: StencilOp.Keep,
        CompFront: CompOp.Always,
        PassFront: StencilOp.Keep,
        FailFront: StencilOp.Keep,
        ZFailFront: StencilOp.Keep,
    },
    ZClip: true,
    ZTest: ZTestOp.Less,
    ZWrite: true,
    Tags: {},
    Lod: 0,
};