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
export const BlendFactorValue = createToken({ name: "BlendFactorValue", pattern: Lexer.NA });

export const Zero = createToken({ name: "Zero", pattern: /Zero/, categories: [BlendFactorValue] });
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
export const BlendOpValue = createToken({ name: "BlendOpValue", pattern: Lexer.NA });
export const Add = createToken({ name: "Add", pattern: /Add/, categories: [BlendOpValue] });
export const Subtract = createToken({ name: "Subtract", pattern: /Subtract/, categories: [BlendOpValue] });
export const ReverseSubtract = createToken({ name: "ReverseSubtract", pattern: /ReverseSubtract/, categories: [BlendOpValue] });
export const Min = createToken({ name: "Min", pattern: /Min/, categories: [BlendOpValue] });
export const Max = createToken({ name: "Max", pattern: /Max/, categories: [BlendOpValue] });
export const LogicalClear = createToken({ name: "LogicalClear", pattern: /LogicalClear/, categories: [BlendOpValue] });
export const LogicalSet = createToken({ name: "LogicalSet", pattern: /LogicalSet/, categories: [BlendOpValue] });
export const LogicalCopy = createToken({ name: "LogicalCopy", pattern: /LogicalCopy/, categories: [BlendOpValue] });
export const LogicalCopyInverted = createToken({ name: "LogicalCopyInverted", pattern: /LogicalCopyInverted/, categories: [BlendOpValue] });
export const LogicalNoop = createToken({ name: "LogicalNoop", pattern: /LogicalNoop/, categories: [BlendOpValue] });
export const LogicalInvert = createToken({ name: "LogicalInvert", pattern: /LogicalInvert/, categories: [BlendOpValue] });
export const LogicalAnd = createToken({ name: "LogicalAnd", pattern: /LogicalAnd/, categories: [BlendOpValue] });
export const LogicalNand = createToken({ name: "LogicalNand", pattern: /LogicalNand/, categories: [BlendOpValue] });
export const LogicalOr = createToken({ name: "LogicalOr", pattern: /LogicalOr/, categories: [BlendOpValue] });
export const LogicalNor = createToken({ name: "LogicalNor", pattern: /LogicalNor/, categories: [BlendOpValue] });
export const LogicalXor = createToken({ name: "LogicalXor", pattern: /LogicalXor/, categories: [BlendOpValue] });
export const LogicalEquiv = createToken({ name: "LogicalEquiv", pattern: /LogicalEquiv/, categories: [BlendOpValue] });
export const LogicalAndReverse = createToken({ name: "LogicalAndReverse", pattern: /LogicalAndReverse/, categories: [BlendOpValue] });
export const LogicalAndInverted = createToken({ name: "LogicalAndInverted", pattern: /LogicalAndInverted/, categories: [BlendOpValue] });
export const LogicalOrReverse = createToken({ name: "LogicalOrReverse", pattern: /LogicalOrReverse/, categories: [BlendOpValue] });
export const LogicalOrInverted = createToken({ name: "LogicalOrInverted", pattern: /LogicalOrInverted/, categories: [BlendOpValue] });

export const Mutiply = createToken({ name: "Mutiply", pattern: /Mutiply/, categories: [BlendOpValue] });
export const Screen = createToken({ name: "Screen", pattern: /Screen/, categories: [BlendOpValue] });
export const Overlay = createToken({ name: "Overlay", pattern: /Overlay/, categories: [BlendOpValue] });
export const Darken = createToken({ name: "Darken", pattern: /Darken/, categories: [BlendOpValue] });
export const Lighten = createToken({ name: "Lighten", pattern: /Lighten/, categories: [BlendOpValue] });
export const ColorDodge = createToken({ name: "ColorDodge", pattern: /ColorDodge/, categories: [BlendOpValue] });
export const ColorBurn = createToken({ name: "ColorBurn", pattern: /ColorBurn/, categories: [BlendOpValue] });
export const HardLight = createToken({ name: "HardLight", pattern: /HardLight/, categories: [BlendOpValue] });
export const SoftLight = createToken({ name: "SoftLight", pattern: /SoftLight/, categories: [BlendOpValue] });
export const Difference = createToken({ name: "Difference", pattern: /Difference/, categories: [BlendOpValue] });
export const Exclusion = createToken({ name: "Exclusion", pattern: /Exclusion/, categories: [BlendOpValue] });
export const HSLHue = createToken({ name: "HSLHue", pattern: /HSLHue/, categories: [BlendOpValue] });
export const HSLSaturation = createToken({ name: "HSLSaturation", pattern: /HSLSaturation/, categories: [BlendOpValue] });
export const HSLColor = createToken({ name: "HSLColor", pattern: /HSLColor/, categories: [BlendOpValue] });
export const HSLLuminosity = createToken({ name: "HSLLuminosity", pattern: /HSLLuminosity/, categories: [BlendOpValue] });



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
export const StencilOpValue = createToken({ name: "StencilOpValue", pattern: Lexer.NA });
export const Keep = createToken({ name: "Keep", pattern: /Keep/, categories: [StencilOpValue] });
export const Replace = createToken({ name: "Replace", pattern: /Replace/, categories: [StencilOpValue] });
export const IncrSat = createToken({ name: "IncrSat", pattern: /IncrSat/, categories: [StencilOpValue] });
export const DecrSat = createToken({ name: "DecrSat", pattern: /DecrSat/, categories: [StencilOpValue] });
export const Invert = createToken({ name: "Invert", pattern: /Invert/, categories: [StencilOpValue] });
export const IncrWrap = createToken({ name: "IncrWrap", pattern: /IncrWrap/, categories: [StencilOpValue] });
export const DecrWrap = createToken({ name: "DecrWrap", pattern: /DecrWrap/, categories: [StencilOpValue] });



//compare op
export const CompareOpValue = createToken({ name: "CompareOpValue", pattern: Lexer.NA });
export const Never = createToken({ name: "Never", pattern: /Never/, categories: [CompareOpValue] });
export const Less = createToken({ name: "Less", pattern: /Less/, categories: [CompareOpValue] });
export const Equal = createToken({ name: "Equal", pattern: /Equal/, categories: [CompareOpValue] });
export const LEqual = createToken({ name: "LEqual", pattern: /LEqual/, categories: [CompareOpValue] });
export const Greater = createToken({ name: "Greater", pattern: /Greater/, categories: [CompareOpValue] });
export const NotEqual = createToken({ name: "NotEqual", pattern: /NotEqual/, categories: [CompareOpValue] });
export const GEqual = createToken({ name: "GEqual", pattern: /GEqual/, categories: [CompareOpValue] });
export const Always = createToken({ name: "Always", pattern: /Always/, categories: [CompareOpValue] });




// z clip
export const ZClipValue = createToken({ name: "ZClipValue", pattern: Lexer.NA });
export const True = createToken({ name: "True", pattern: /True/, categories: [ZClipValue] });
export const False = createToken({ name: "False", pattern: /False/, categories: [ZClipValue] });


// color mask
export const ColorMaskValue = createToken({ name: "ColorMaskValue", pattern: Lexer.NA });
export const R = createToken({ name: "R", pattern: /R/, categories: [ColorMaskValue] });
export const G = createToken({ name: "G", pattern: /G/, categories: [ColorMaskValue] });
export const B = createToken({ name: "B", pattern: /B/, categories: [ColorMaskValue] });
export const A = createToken({ name: "A", pattern: /A/, categories: [ColorMaskValue] });


// cull mode
export const CullModeValue = createToken({ name: "CullModeValue", pattern: Lexer.NA });
export const Front = createToken({ name: "Front", pattern: /Front/, categories: [CullModeValue] });
export const Back = createToken({ name: "Back", pattern: /Back/, categories: [CullModeValue] });


// lod
export const LOD = createToken({ name: "LOD", pattern: /LOD/ });

export const LeftBrace = createToken({ name: "LeftBrace", pattern: /\{/ });
export const RightBrace = createToken({ name: "RightBrace", pattern: /\}/ });
export const Assign = createToken({ name: "Assign", pattern: /=/ });

export const renderStatesTokens = [
    WhiteSpace,
    Comment,

    AlphaToMask,
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
    LogicalAndReverse,
    LogicalAndInverted,
    LogicalAnd,
    LogicalNand,
    LogicalOrReverse,
    LogicalOrInverted,
    LogicalOr,
    LogicalNor,
    LogicalXor,
    LogicalEquiv,


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

    // BlendFactorValue,
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

    Keep,
    Replace,
    IncrSat,
    DecrSat,
    Invert,
    IncrWrap,
    DecrWrap,

    Never,
    Less,
    LEqual,
    GEqual,
    NotEqual,
    Equal,
    Greater,
    Always,

    SrcAlpha,
    DstAlpha,
    DstColor,
    SrcColor,
    One,
    True,
    False,

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

    Front,
    Back,

    Off,
    On,

    R,
    G,
    B,
    A,

    NumberLiteral,
    StringLiteral,
    Assign,
];

export const renderStatesLexer = new Lexer(renderStatesTokens);
