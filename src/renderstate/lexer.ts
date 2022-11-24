import { createToken, Lexer } from "chevrotain";

export const NumberLiteral = createToken({ name: "NumberLiteral", pattern: /-?(0|[1-9]\d*)(\.\d+)?([eE][+-]?\d+)?/ });
export const StringLiteral = createToken({ name: "StringLiteral", pattern: /"[^"]*"/ });
export const Comment = createToken({ name: "Comment", pattern: /\/\/.*/, group: Lexer.SKIPPED });
export const WhiteSpace = createToken({ name: "WhiteSpace", pattern: /\s+/, group: Lexer.SKIPPED });


export const AlphaToMask = createToken({ name: "AlphaToMask", pattern: /AlphaToMask/ });
export const Blend = createToken({ name: "Blend", pattern: /Blend/ });
export const BlendOp = createToken({ name: "BlendOp", pattern: /BlendOp/ });
export const ColorMask = createToken({ name: "ColorMask", pattern: /ColorMask/ });
export const Cull = createToken({ name: "Cull", pattern: /Cull/ });
export const Offset = createToken({ name: "Offset", pattern: /Offset/ });
export const Stencil = createToken({ name: "Stencil", pattern: /Stencil/ });
export const ZClip = createToken({ name: "ZClip", pattern: /ZClip/ });
export const ZTest = createToken({ name: "ZTest", pattern: /ZTest/ });
export const ZWrite = createToken({ name: "ZWrite", pattern: /ZWrite/ });
export const Tags = createToken({ name: "Tags", pattern: /Tags/ });
export const Conservative = createToken({ name: "Conservative", pattern: /Conservative/ });


export const Off = createToken({ name: "Off", pattern: /Off/ });
export const On = createToken({ name: "On", pattern: /On/ });



//blend factor
export const BlendFactorValue = createToken({
    name: "BlendFactorAdd", pattern: Lexer.NA
});

export const Zero = createToken({ name: "Zero", pattern: /Zero/ });
export const One = createToken({ name: "One", pattern: /One/, categories: [BlendFactorValue] });
export const SrcColor = createToken({ name: "SrcColor", pattern: /SrcColor/, categories: [BlendFactorValue] });
export const OneMinusSrcColor = createToken({ name: "OneMinusSrcColor", pattern: /OneMinusSrcColor/, categories: [BlendFactorValue] });
export const DstColor = createToken({ name: "DstColor", pattern: /DstColor/, categories: [BlendFactorValue] });
export const OneMinusDstColor = createToken({ name: "OneMinusDstColor", pattern: /OneMinusDstColor/, categories: [BlendFactorValue] });
export const SrcAlpha = createToken({ name: "SrcAlpha", pattern: /SrcAlpha/, categories: [BlendFactorValue] });
export const OneMinusSrcAlpha = createToken({ name: "OneMinusSrcAlpha", pattern: /OneMinusSrcAlpha/, categories: [BlendFactorValue] });
export const DstAlpha = createToken({ name: "DstAlpha", pattern: /DstAlpha/, categories: [BlendFactorValue] });
export const OneMinusDstAlpha = createToken({ name: "OneMinusDstAlpha", pattern: /OneMinusDstAlpha/, categories: [BlendFactorValue] });
export const SrcAlphaSaturate = createToken({ name: "SrcAlphaSaturate", pattern: /SrcAlphaSaturate/, categories: [BlendFactorValue] });
export const ConstantColor = createToken({ name: "ConstantColor", pattern: /ConstantColor/, categories: [BlendFactorValue] });
export const OneMinusConstantColor = createToken({ name: "OneMinusConstantColor", pattern: /OneMinusConstantColor/, categories: [BlendFactorValue] });
export const ConstantAlpha = createToken({ name: "ConstantAlpha", pattern: /ConstantAlpha/, categories: [BlendFactorValue] });
export const OneMinusConstantAlpha = createToken({ name: "OneMinusConstantAlpha", pattern: /OneMinusConstantAlpha/, categories: [BlendFactorValue] });





//blend op
export const Add = createToken({ name: "Add", pattern: /Add/ });
export const Subtract = createToken({ name: "Subtract", pattern: /Subtract/ });
export const ReverseSubtract = createToken({ name: "ReverseSubtract", pattern: /ReverseSubtract/ });
export const Min = createToken({ name: "Min", pattern: /Min/ });
export const Max = createToken({ name: "Max", pattern: /Max/ });
export const LogicalClear = createToken({ name: "LogicalClear", pattern: /LogicalClear/ });
export const LogicalSet = createToken({ name: "LogicalSet", pattern: /LogicalSet/ });
export const LogicalCopy = createToken({ name: "LogicalCopy", pattern: /LogicalCopy/ });
export const LogicalCopyInverted = createToken({ name: "LogicalCopyInverted", pattern: /LogicalCopyInverted/ });
export const LogicalNoop = createToken({ name: "LogicalNoop", pattern: /LogicalNoop/ });
export const LogicalInvert = createToken({ name: "LogicalInvert", pattern: /LogicalInvert/ });
export const LogicalAnd = createToken({ name: "LogicalAnd", pattern: /LogicalAnd/ });
export const LogicalNand = createToken({ name: "LogicalNand", pattern: /LogicalNand/ });
export const LogicalOr = createToken({ name: "LogicalOr", pattern: /LogicalOr/ });
export const LogicalNor = createToken({ name: "LogicalNor", pattern: /LogicalNor/ });
export const LogicalXor = createToken({ name: "LogicalXor", pattern: /LogicalXor/ });
export const LogicalEquiv = createToken({ name: "LogicalEquiv", pattern: /LogicalEquiv/ });
export const LogicalAndReverse = createToken({ name: "LogicalAndReverse", pattern: /LogicalAndReverse/ });
export const LogicalAndInverted = createToken({ name: "LogicalAndInverted", pattern: /LogicalAndInverted/ });
export const LogicalOrReverse = createToken({ name: "LogicalOrReverse", pattern: /LogicalOrReverse/ });
export const LogicalOrInverted = createToken({ name: "LogicalOrInverted", pattern: /LogicalOrInverted/ });

export const Mutiply = createToken({ name: "Mutiply", pattern: /Mutiply/ });
export const Screen = createToken({ name: "Screen", pattern: /Screen/ });
export const Overlay = createToken({ name: "Overlay", pattern: /Overlay/ });
export const Darken = createToken({ name: "Darken", pattern: /Darken/ });
export const Lighten = createToken({ name: "Lighten", pattern: /Lighten/ });
export const ColorDodge = createToken({ name: "ColorDodge", pattern: /ColorDodge/ });
export const ColorBurn = createToken({ name: "ColorBurn", pattern: /ColorBurn/ });
export const HardLight = createToken({ name: "HardLight", pattern: /HardLight/ });
export const SoftLight = createToken({ name: "SoftLight", pattern: /SoftLight/ });
export const Difference = createToken({ name: "Difference", pattern: /Difference/ });
export const Exclusion = createToken({ name: "Exclusion", pattern: /Exclusion/ });
export const HSLHue = createToken({ name: "HSLHue", pattern: /HSLHue/ });
export const HSLSaturation = createToken({ name: "HSLSaturation", pattern: /HSLSaturation/ });
export const HSLColor = createToken({ name: "HSLColor", pattern: /HSLColor/ });
export const HSLLuminosity = createToken({ name: "HSLLuminosity", pattern: /HSLLuminosity/ });

export const BlendOpValue = createToken({
    name: "BlendOpValue", pattern: Lexer.NA, categories: [
        Add,
        Subtract,
        ReverseSubtract,
        Min,
        Max,
        LogicalClear,
        LogicalSet,
        LogicalCopyInverted,
        LogicalCopy,
        LogicalNoop,
        LogicalInvert,
        LogicalAnd,
        LogicalNand,
        LogicalOr,
        LogicalNor,
        LogicalXor,
        LogicalEquiv,
        LogicalAndReverse,
        LogicalAndInverted,
        LogicalOrReverse,
        LogicalOrInverted,

        Mutiply,
        Screen,
        Overlay,
        Darken,
        Lighten,
        ColorDodge,
        ColorBurn,
        HardLight,
        SoftLight,
        Difference,
        Exclusion,
        HSLHue,
        HSLSaturation,
        HSLColor,
        HSLLuminosity,
    ]
});

// stencil key
export const Ref = createToken({ name: "Ref", pattern: /Ref/ });
export const ReadMask = createToken({ name: "ReadMask", pattern: /ReadMask/ });
export const WriteMask = createToken({ name: "WriteMask", pattern: /WriteMask/ });
export const Comp = createToken({ name: "Comp", pattern: /Comp/ });
export const Pass = createToken({ name: "Pass", pattern: /Pass/ });
export const Fail = createToken({ name: "Fail", pattern: /Fail/ });
export const ZFail = createToken({ name: "ZFail", pattern: /ZFail/ });
export const CompBack = createToken({ name: "CompBack", pattern: /CompBack/ });
export const PassBack = createToken({ name: "PassBack", pattern: /PassBack/ });
export const FailBack = createToken({ name: "FailBack", pattern: /FailBack/ });
export const ZFailBack = createToken({ name: "ZFailBack", pattern: /ZFailBack/ });
export const CompFront = createToken({ name: "CompFront", pattern: /CompFront/ });
export const PassFront = createToken({ name: "PassFront", pattern: /PassFront/ });
export const FailFront = createToken({ name: "FailFront", pattern: /FailFront/ });
export const ZFailFront = createToken({ name: "ZFailFront", pattern: /ZFailFront/ });


//stencil op

export const Keep = createToken({ name: "Keep", pattern: /Keep/ });
export const Replace = createToken({ name: "Replace", pattern: /Replace/ });
export const IncrSat = createToken({ name: "IncrSat", pattern: /IncrSat/ });
export const DecrSat = createToken({ name: "DecrSat", pattern: /DecrSat/ });
export const Invert = createToken({ name: "Invert", pattern: /Invert/ });
export const IncrWrap = createToken({ name: "IncrWrap", pattern: /IncrWrap/ });
export const DecrWrap = createToken({ name: "DecrWrap", pattern: /DecrWrap/ });

export const StencilOpValue = createToken({
    name: "StencilOpValue", pattern: Lexer.NA, categories: [
        Keep,
        Replace,
        IncrSat,
        DecrSat,
        Invert,
        IncrWrap,
        DecrWrap,
    ]
});

//compare op
export const Never = createToken({ name: "Never", pattern: /Never/ });
export const Less = createToken({ name: "Less", pattern: /Less/ });
export const Equal = createToken({ name: "Equal", pattern: /Equal/ });
export const LEqual = createToken({ name: "LEqual", pattern: /LEqual/ });
export const Greater = createToken({ name: "Greater", pattern: /Greater/ });
export const NotEqual = createToken({ name: "NotEqual", pattern: /NotEqual/ });
export const GEqual = createToken({ name: "GEqual", pattern: /GEqual/ });
export const Always = createToken({ name: "Always", pattern: /Always/ });

export const CompareOpValue = createToken({
    name: "CompareOpValue", pattern: Lexer.NA, categories: [
        Never,
        Less,
        LEqual,
        GEqual,
        NotEqual,
        Equal,
        Greater,
        Always,
    ]
});


// z clip
export const ZClipValue = createToken({
    name: "ZClipValue", pattern: Lexer.NA, categories: [
        True,
        False,
    ]
});

export const True = createToken({ name: "True", pattern: /True/ });
export const False = createToken({ name: "False", pattern: /False/ });


// color mask
export const R = createToken({ name: "R", pattern: /R/ });
export const G = createToken({ name: "G", pattern: /G/ });
export const B = createToken({ name: "B", pattern: /B/ });
export const A = createToken({ name: "A", pattern: /A/ });

export const ColorMaskValue = createToken({
    name: "ColorMaskValue", pattern: Lexer.NA, categories: [
        R,
        G,
        B,
        A,
    ]
});

// cull mode
export const Front = createToken({ name: "Front", pattern: /Front/ });
export const Back = createToken({ name: "Back", pattern: /Back/ });

export const CullModeValue = createToken({
    name: "CullModeValue", pattern: Lexer.NA, categories: [
        Front,
        Back,
    ]
});

// lod
export const LOD = createToken({ name: "LOD", pattern: /LOD/ });

export const LeftBrace = createToken({ name: "LeftBrace", pattern: /\{/ });
export const RightBrace = createToken({ name: "RightBrace", pattern: /\}/ });
export const Assign = createToken({ name: "Assign", pattern: /=/ });

export const renderStatesTokens = [
    WhiteSpace,
    Comment,

    AlphaToMask,
    BlendOpValue,
    BlendOp,
    Blend,
    ColorMask,
    Cull,
    Offset,
    Stencil,
    ZClip,
    ZTest,
    ZWrite,
    Conservative,

    Zero,
    OneMinusConstantAlpha,
    OneMinusConstantColor,
    OneMinusSrcColor,
    OneMinusDstColor,
    OneMinusSrcAlpha,
    OneMinusDstAlpha,
    SrcAlphaSaturate,
    ConstantColor,
    ConstantAlpha,
    StencilOpValue,
    CompareOpValue,
    SrcAlpha,
    DstAlpha,
    DstColor,
    SrcColor,
    One,
    ZClipValue,

    Ref,
    ReadMask,
    WriteMask,
    CompBack,
    PassBack,
    FailBack,
    ZFailBack,
    CompFront,
    PassFront,
    FailFront,
    ZFailFront,
    Comp,
    Pass,
    Fail,
    ZFail,

    LOD,
    LeftBrace,
    RightBrace,

    ColorMaskValue,
    CullModeValue,

    Off,
    On,

    NumberLiteral,
    StringLiteral,
    Assign,
];

export const renderStatesLexer = new Lexer(renderStatesTokens);
