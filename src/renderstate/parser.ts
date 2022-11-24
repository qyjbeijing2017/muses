import { EmbeddedActionsParser } from 'chevrotain'
import { Comma } from '../properties/lexer';
import { BlendOp } from './blendop';
import { CompOp } from './compop';
import { CullState } from './cullstate';
import { Factor } from './factor';
import { IRenderState } from './interface';
import { AlphaToMask, Assign, Blend, BlendFactorValue, BlendOp as BlendOpLex, BlendOpValue, ColorMask, ColorMaskValue, Comp, CompareOpValue, CompBack, CompFront, Conservative, Cull, CullModeValue, Fail, FailBack, FailFront, LeftBrace, LOD, NumberLiteral, Off, Offset, On, Pass, PassBack, PassFront, ReadMask, Ref, renderStatesTokens, RightBrace, Stencil, StencilOpValue, StringLiteral, Tags, True, WriteMask, ZClip, ZClipValue, Zero, ZFail, ZFailBack, ZFailFront, ZTest, ZWrite } from './lexer';
import { StencilOp } from './stencilop';
import { ZTestOp } from './ztestop';

export class RenderStateParser extends EmbeddedActionsParser {
    constructor() {
        super(renderStatesTokens)
        this.performSelfAnalysis();
    }

    tags = this.RULE('tags', () => {
        const tags: { [key: string]: string } = {};

        this.CONSUME(Tags);
        this.CONSUME(LeftBrace);
        this.MANY(() => {
            const key = this.CONSUME(StringLiteral).image;
            this.CONSUME(Assign);
            const value = this.CONSUME1(StringLiteral).image;
            tags[key] = value;
        });
        this.CONSUME(RightBrace);

        return tags;
    });

    lod = this.RULE('lod', () => {
        this.CONSUME(LOD);
        const valueStr = this.CONSUME(NumberLiteral).image;
        const value = parseInt(valueStr);
        return value;
    });

    alphaToMash = this.RULE('alphaToMash', () => {
        let enable = false;
        this.CONSUME(AlphaToMask);
        this.OR([
            { ALT: () => enable = this.CONSUME(On).image === 'ON' },
            { ALT: () => enable = this.CONSUME(Off).image !== 'OFF' },
        ]);
        return enable;
    });

    blend = this.RULE('blend', () => {
        const blend: {
            enabled: boolean,
            target?: number,
            sfactor: Factor,
            dfactor: Factor,
            sfactorA?: Factor,
            dfactorA?: Factor,
        } = {
            enabled: true,
            sfactor: Factor.SrcAlpha,
            dfactor: Factor.OneMinusSrcAlpha,
        };
        this.CONSUME(Blend);
        this.OPTION(() => {
            const targetStr = this.CONSUME(NumberLiteral).image;
            blend.target = parseInt(targetStr);
        });
        this.OR([
            { ALT: () => blend.enabled = this.CONSUME(Off).image !== 'OFF' },
            {
                ALT: () => {
                    blend.sfactor = this.CONSUME(BlendFactorValue).image as Factor;
                    blend.dfactor = this.CONSUME1(BlendFactorValue).image as Factor;
                    this.OPTION1(() => {
                        this.CONSUME(Comma);
                        blend.sfactorA = this.CONSUME2(BlendFactorValue).image as Factor;
                        blend.dfactorA = this.CONSUME3(BlendFactorValue).image as Factor;
                    });
                }
            }
        ]);

        return blend;
    });

    blendOp = this.RULE('blendOp', () => {
        this.CONSUME(BlendOpLex);
        const val = this.CONSUME(BlendOpValue).image as BlendOp;
        return val;
    });

    colorMask = this.RULE('colorMask', () => {
        const colorMask = {
            enabled: false,
            r: true,
            g: true,
            b: true,
            a: true,
        }
        let rgbaStr: string = '';
        this.CONSUME(ColorMask);
        this.OR([
            { ALT: () => colorMask.enabled = this.CONSUME(NumberLiteral).image !== '0' },
            { ALT: () => this.MANY(() => rgbaStr += this.CONSUME(ColorMaskValue).image) },
        ]);
        if (rgbaStr !== '') {
            colorMask.r = rgbaStr.includes('R');
            colorMask.g = rgbaStr.includes('G');
            colorMask.b = rgbaStr.includes('B');
            colorMask.a = rgbaStr.includes('A');
        }
        return colorMask;
    });

    cull = this.RULE('cull', () => {
        const cull = {
            enabled: true,
            mode: CullState.Back,
        };

        this.CONSUME(Cull);
        this.OR([
            { ALT: () => cull.mode = this.CONSUME(CullModeValue).image as CullState },
            { ALT: () => cull.enabled = this.CONSUME(Off).image !== 'Off' },
        ]);

        return cull;
    });

    offset = this.RULE('offset', () => {
        const offset = {
            enabled: true,
            factor: -1,
            units: -1,
        };

        this.CONSUME(Offset);
        const factorStr = this.CONSUME(NumberLiteral);
        const unitsStr = this.CONSUME1(NumberLiteral);

        offset.factor = parseFloat(factorStr.image);
        offset.units = parseFloat(unitsStr.image);
        return offset;
    });


    ref = this.RULE('ref', () => {
        this.CONSUME(Ref);
        const valStr = this.CONSUME(NumberLiteral);
        return parseInt(valStr.image);
    });

    readMask = this.RULE('readMask', () => {
        this.CONSUME(ReadMask);
        const valStr = this.CONSUME(NumberLiteral);
        return parseInt(valStr.image);
    });

    writeMask = this.RULE('writeMask', () => {
        this.CONSUME(WriteMask);
        const valStr = this.CONSUME(NumberLiteral);
        return parseInt(valStr.image);
    });

    comp = this.RULE('comp', () => {
        this.CONSUME(Comp);
        const val = this.CONSUME(CompareOpValue).image as CompOp;
        return val;
    });

    pass = this.RULE('pass', () => {
        this.CONSUME(Pass);
        const val = this.CONSUME(StencilOpValue).image as StencilOp;
        return val;
    });

    fail = this.RULE('fail', () => {
        this.CONSUME(Fail);
        const val = this.CONSUME(StencilOpValue).image as StencilOp;
        return val;
    });

    zFail = this.RULE('zFail', () => {
        this.CONSUME(ZFail);
        const val = this.CONSUME(StencilOpValue).image as StencilOp;
        return val;
    });

    compBack = this.RULE('compBack', () => {
        this.CONSUME(CompBack);
        const val = this.CONSUME(CompareOpValue).image as CompOp;
        return val;
    });

    passBack = this.RULE('passBack', () => {
        this.CONSUME(PassBack);
        const val = this.CONSUME(StencilOpValue).image as StencilOp;
        return val;
    });

    failBack = this.RULE('failBack', () => {
        this.CONSUME(FailBack);
        const val = this.CONSUME(StencilOpValue).image as StencilOp;
        return val;
    });

    zFailBack = this.RULE('zFailBack', () => {
        this.CONSUME(ZFailBack);
        const val = this.CONSUME(StencilOpValue).image as StencilOp;
        return val;
    });

    compFront = this.RULE('compFront', () => {
        this.CONSUME(CompFront);
        const val = this.CONSUME(CompareOpValue).image as CompOp;
        return val;
    });

    passFront = this.RULE('passFront', () => {
        this.CONSUME(PassFront);
        const val = this.CONSUME(StencilOpValue).image as StencilOp;
        return val;
    });

    failFront = this.RULE('failFront', () => {
        this.CONSUME(FailFront);
        const val = this.CONSUME(StencilOpValue).image as StencilOp;
        return val;
    });

    zFailFront = this.RULE('zFailFront', () => {
        this.CONSUME(ZFailFront);
        const val = this.CONSUME(StencilOpValue).image as StencilOp;
        return val;
    });

    stencil = this.RULE('stencil', () => {

        const stencil = {
            enabled: true,
            Ref: 0,
            ReadMask: 0,
            WriteMask: 0,
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
        };

        this.CONSUME(Stencil);
        this.CONSUME(LeftBrace);
        this.MANY(() => {
            this.OR([
                { ALT: () => stencil.Ref = this.SUBRULE(this.ref) },
                { ALT: () => stencil.ReadMask = this.SUBRULE(this.readMask) },
                { ALT: () => stencil.WriteMask = this.SUBRULE(this.writeMask) },
                { ALT: () => stencil.Comp = this.SUBRULE(this.comp) },
                { ALT: () => stencil.Pass = this.SUBRULE(this.pass) },
                { ALT: () => stencil.Fail = this.SUBRULE(this.fail) },
                { ALT: () => stencil.ZFail = this.SUBRULE(this.zFail) },
                { ALT: () => stencil.CompBack = this.SUBRULE(this.compBack) },
                { ALT: () => stencil.PassBack = this.SUBRULE(this.passBack) },
                { ALT: () => stencil.FailBack = this.SUBRULE(this.failBack) },
                { ALT: () => stencil.ZFailBack = this.SUBRULE(this.zFailBack) },
                { ALT: () => stencil.CompFront = this.SUBRULE(this.compFront) },
                { ALT: () => stencil.PassFront = this.SUBRULE(this.passFront) },
                { ALT: () => stencil.FailFront = this.SUBRULE(this.failFront) },
                { ALT: () => stencil.ZFailFront = this.SUBRULE(this.zFailFront) },
            ]);
        });
        this.CONSUME(RightBrace);

        return stencil;
    });

    zclip = this.RULE('zclip', () => {
        this.CONSUME(ZClip);
        const val = this.CONSUME(ZClipValue).image;
        return val === 'True';
    });

    ztest = this.RULE('ztest', () => {
        this.CONSUME(ZTest);
        const val = this.CONSUME(CompareOpValue).image as ZTestOp;
        return val;
    });

    zwrite = this.RULE('zwrite', () => {
        let val = 'On';
        this.CONSUME(ZWrite);
        this.OR([
            { ALT: () => val = this.CONSUME(On).image },
            { ALT: () => val = this.CONSUME(Off).image },
        ]);
        return val === 'On';
    });

    conservative = this.RULE('conservative', () => {
        this.CONSUME(Conservative);
        const val = this.CONSUME(ZClipValue).image;
        return val === 'True';
    });


    parse = this.RULE('parse', () => {
        let renderState: IRenderState = {
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
                ReadMask: 0,
                WriteMask: 0,
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
            ZClip: false,
            ZTest: ZTestOp.Always,
            ZWrite: true,
            Tags: {},
            Lod: 0,
        };

        this.MANY(() => {
            this.OR([
                { ALT: () => renderState.Lod = this.SUBRULE(this.lod) },
                { ALT: () => renderState.Tags = this.SUBRULE(this.tags) },
                { ALT: () => renderState.AlphaToMask = this.SUBRULE(this.alphaToMash) },
                {
                    ALT: () => {
                        let blen = this.SUBRULE(this.blend);
                        if (blen.target) {
                            renderState.Blend.targets.set(blen.target, blen);
                        } else {
                            renderState.Blend.targets.clear();
                            renderState.Blend.targets.set(-1, blen);
                        }
                    }
                },
                { ALT: () => renderState.Blend.op = this.SUBRULE(this.blendOp) },
                { ALT: () => renderState.ColorMask = this.SUBRULE(this.colorMask) },
                { ALT: () => renderState.Conservative = this.SUBRULE(this.conservative) },
                { ALT: () => renderState.Cull = this.SUBRULE(this.cull) },
                { ALT: () => renderState.Offset = this.SUBRULE(this.offset) },
                { ALT: () => renderState.Stencil = this.SUBRULE(this.stencil) },
                { ALT: () => renderState.ZClip = this.SUBRULE(this.zclip) },
                { ALT: () => renderState.ZTest = this.SUBRULE(this.ztest) },
                { ALT: () => renderState.ZWrite = this.SUBRULE(this.zwrite) },
            ]);
        });
        
        return renderState;
    });
}

export const renderStateParser = new RenderStateParser();