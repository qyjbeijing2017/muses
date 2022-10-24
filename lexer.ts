import { Lexer, createToken, TokenType } from "chevrotain"

export enum MusesTokenName {
    // comments
    WhiteSpace = "WhiteSpace",
    SingleLineComment = "SingleLineComment",

    // keywords
    If = "If",
    Else = "Else",
    While = "While",
    Do = "Do",
    For = "For",
    Return = "Return",
    Break = "Break",
    Continue = "Continue",
    Struct = "Struct",

    // qualifier
    Attribute = "Attribute",
    Uniform = "Uniform",
    Varying = "Varying",
    In = "In",
    Out = "Out",
    InOut = "InOut",
    Const = "Const",
    Invariant = "Invariant",

    // precision
    Lowp = "Lowp",
    Mediump = "Mediump",
    Highp = "Highp",

    // shader keywords
    Shader = "Shader",
    Properties = "Properties",
    SubShader = "SubShader",
    FallBack = "FallBack",
    Pass = "Pass",

    // operators
    GreaterThenEqual = "GreaterThenEqual",
    LessThenEqual = "LessThenEqual",
    Equal = "Equal",
    NotEqual = "NotEqual",
    And = "And",
    Or = "Or",
    XOr = "XOr",
    Inc = "Inc",
    Dec = "Dec",
    AddAssign = "AddAssign",
    SubAssign = "SubAssign",
    MulAssign = "MulAssign",
    DivAssign = "DivAssign",
    ModAssign = "ModAssign",
    Plus = "Plus",
    Minus = "Minus",
    Multiply = "Multiply",
    Divide = "Divide",
    Modulo = "Modulo",
    Assign = "Assign",
    GreaterThen = "GreaterThen",
    LessThen = "LessThen",
    Not = "Not",
    QuestionMark = "QuestionMark",

    // punctuation
    LeftParen = "LeftParen",
    RightParen = "RightParen",
    LeftBrace = "LeftBrace",
    RightBrace = "RightBrace",
    LeftBracket = "LeftBracket",
    RightBracket = "RightBracket",
    Comma = "Comma",
    Semicolon = "Semicolon",
    Colon = "Colon",
    Dot = "Dot",

    // types
    Void = "Void",
    Int = "Int",
    Float = "Float",
    Bool = "Bool",
    Vec2 = "Vec2",
    Vec3 = "Vec3",
    Vec4 = "Vec4",
    BVec2 = "BVec2",
    BVec3 = "BVec3",
    BVec4 = "BVec4",
    IVec2 = "IVec2",
    IVec3 = "IVec3",
    IVec4 = "IVec4",
    Mat2 = "Mat2",
    Mat3 = "Mat3",
    Mat4 = "Mat4",
    Sampler1D = "Sampler1D",
    Sampler2D = "Sampler2D",
    Sampler3D = "Sampler3D",
    SamplerCube = "SamplerCube",
    Sampler1Dshadow = "Sampler1Dshadow",
    Sampler2Dshadow = "Sampler2Dshadow",

    // constants
    True = "True",
    False = "False",
    ConstInt = "ConstInt",
    ConstFloat = "ConstFloat",
    ConstString = "ConstString",

    // identifiers
    Identifier = "Identifier",

}

// #region Create Tokens

export const WhiteSpace = createToken({ name: MusesTokenName.WhiteSpace, pattern: /\s+/, group: Lexer.SKIPPED });
export const Comment = createToken({ name: MusesTokenName.SingleLineComment, pattern: /\/\/.*/, group: Lexer.SKIPPED });

// Keywords
export const If = createToken({ name: MusesTokenName.If, pattern: /if/ });
export const Else = createToken({ name: MusesTokenName.Else, pattern: /else/ });
export const While = createToken({ name: MusesTokenName.While, pattern: /while/ });
export const Do = createToken({ name: MusesTokenName.Do, pattern: /do/ });
export const For = createToken({ name: MusesTokenName.For, pattern: /for/ });
export const Return = createToken({ name: MusesTokenName.Return, pattern: /return/ });
export const Break = createToken({ name: MusesTokenName.Break, pattern: /break/ });
export const Continue = createToken({ name: MusesTokenName.Continue, pattern: /continue/ });
export const Struct = createToken({ name: MusesTokenName.Struct, pattern: /struct/ });

// Qualifier
export const Attribute = createToken({ name: MusesTokenName.Attribute, pattern: /attribute/ });
export const Uniform = createToken({ name: MusesTokenName.Uniform, pattern: /uniform/ });
export const Varying = createToken({ name: MusesTokenName.Varying, pattern: /varying/ });
export const In = createToken({ name: MusesTokenName.In, pattern: /in/ });
export const Out = createToken({ name: MusesTokenName.Out, pattern: /out/ });
export const InOut = createToken({ name: MusesTokenName.InOut, pattern: /inout/ });
export const Const = createToken({ name: MusesTokenName.Const, pattern: /const/ });
export const Invariant = createToken({ name: MusesTokenName.Invariant, pattern: /invariant/ });

// Precision
export const Lowp = createToken({ name: MusesTokenName.Lowp, pattern: /lowp/ });
export const Mediump = createToken({ name: MusesTokenName.Mediump, pattern: /mediump/ });
export const Highp = createToken({ name: MusesTokenName.Highp, pattern: /highp/ });

// Shader Keywords
export const Shader = createToken({ name: MusesTokenName.Shader, pattern: /Shader/ });
export const Properties = createToken({ name: MusesTokenName.Properties, pattern: /Properties/ });
export const SubShader = createToken({ name: MusesTokenName.SubShader, pattern: /SubShader/ });
export const FallBack = createToken({ name: MusesTokenName.FallBack, pattern: /FallBack/ });
export const Pass = createToken({ name: MusesTokenName.Pass, pattern: /Pass/ });

// Operators
export const GreaterThenEqual = createToken({ name: MusesTokenName.GreaterThenEqual, pattern: />=/ });
export const LessThenEqual = createToken({ name: MusesTokenName.LessThenEqual, pattern: /<=/ });
export const Equal = createToken({ name: MusesTokenName.Equal, pattern: /==/ });
export const NotEqual = createToken({ name: MusesTokenName.NotEqual, pattern: /!=/ });
export const And = createToken({ name: MusesTokenName.And, pattern: /&&/ });
export const Or = createToken({ name: MusesTokenName.Or, pattern: /\|\|/ });
export const XOr = createToken({ name: MusesTokenName.XOr, pattern: /\^\^/ });
export const Inc = createToken({ name: MusesTokenName.Inc, pattern: /\+\+/ });
export const Dec = createToken({ name: MusesTokenName.Dec, pattern: /--/ });
export const AddAssign = createToken({ name: MusesTokenName.AddAssign, pattern: /\+=/ });
export const SubAssign = createToken({ name: MusesTokenName.SubAssign, pattern: /-=/ });
export const MulAssign = createToken({ name: MusesTokenName.MulAssign, pattern: /\*=/ });
export const DivAssign = createToken({ name: MusesTokenName.DivAssign, pattern: /\/=/ });
export const ModAssign = createToken({ name: MusesTokenName.ModAssign, pattern: /%=/ });
export const Plus = createToken({ name: MusesTokenName.Plus, pattern: /\+/ });
export const Minus = createToken({ name: MusesTokenName.Minus, pattern: /-/ });
export const Multiply = createToken({ name: MusesTokenName.Multiply, pattern: /\*/ });
export const Divide = createToken({ name: MusesTokenName.Divide, pattern: /\// });
export const Modulo = createToken({ name: MusesTokenName.Modulo, pattern: /%/ });
export const Assign = createToken({ name: MusesTokenName.Assign, pattern: /=/ });
export const GreaterThen = createToken({ name: MusesTokenName.GreaterThen, pattern: />/ });
export const LessThen = createToken({ name: MusesTokenName.LessThen, pattern: /</ });
export const Not = createToken({ name: MusesTokenName.Not, pattern: /!/ });
export const QuestionMark = createToken({ name: "QuestionMark", pattern: /\?/ });

// Punctuation
export const LeftParen = createToken({ name: MusesTokenName.LeftParen, pattern: /\(/ });
export const RightParen = createToken({ name: MusesTokenName.RightParen, pattern: /\)/ });
export const LeftBrace = createToken({ name: MusesTokenName.LeftBrace, pattern: /\{/ });
export const RightBrace = createToken({ name: MusesTokenName.RightBrace, pattern: /\}/ });
export const LeftBracket = createToken({ name: MusesTokenName.LeftBracket, pattern: /\[/ });
export const RightBracket = createToken({ name: MusesTokenName.RightBracket, pattern: /\]/ });
export const Comma = createToken({ name: MusesTokenName.Comma, pattern: /,/ });
export const Semicolon = createToken({ name: MusesTokenName.Semicolon, pattern: /;/ });
export const Dot = createToken({ name: MusesTokenName.Dot, pattern: /\./ });
export const Colon = createToken({ name: MusesTokenName.Colon, pattern: /:/ });

// Types
export const Void = createToken({ name: MusesTokenName.Void, pattern: /void/ });
export const Int = createToken({ name: MusesTokenName.Int, pattern: /int/ });
export const Float = createToken({ name: MusesTokenName.Float, pattern: /float/ });
export const Bool = createToken({ name: MusesTokenName.Bool, pattern: /bool/ });
export const Vec2 = createToken({ name: MusesTokenName.Vec2, pattern: /vec2/ });
export const Vec3 = createToken({ name: MusesTokenName.Vec3, pattern: /vec3/ });
export const Vec4 = createToken({ name: MusesTokenName.Vec4, pattern: /vec4/ });
export const BVec2 = createToken({ name: MusesTokenName.BVec2, pattern: /bvec2/ });
export const BVec3 = createToken({ name: MusesTokenName.BVec3, pattern: /bvec3/ });
export const BVec4 = createToken({ name: MusesTokenName.BVec4, pattern: /bvec4/ });
export const IVec2 = createToken({ name: MusesTokenName.IVec2, pattern: /ivec2/ });
export const IVec3 = createToken({ name: MusesTokenName.IVec3, pattern: /ivec3/ });
export const IVec4 = createToken({ name: MusesTokenName.IVec4, pattern: /ivec4/ });
export const Mat2 = createToken({ name: MusesTokenName.Mat2, pattern: /mat2/ });
export const Mat3 = createToken({ name: MusesTokenName.Mat3, pattern: /mat3/ });
export const Mat4 = createToken({ name: MusesTokenName.Mat4, pattern: /mat4/ });
export const Sampler1D = createToken({ name: MusesTokenName.Sampler1D, pattern: /sampler1D/ });
export const Sampler2D = createToken({ name: MusesTokenName.Sampler2D, pattern: /sampler2D/ });
export const Sampler3D = createToken({ name: MusesTokenName.Sampler3D, pattern: /sampler3D/ });
export const SamplerCube = createToken({ name: MusesTokenName.SamplerCube, pattern: /samplerCube/ });
export const Sampler1DShadow = createToken({ name: MusesTokenName.Sampler1Dshadow, pattern: /sampler1Dshadow/ });
export const Sampler2DShadow = createToken({ name: MusesTokenName.Sampler2Dshadow, pattern: /sampler2Dshadow/ });

// Constants
export const True = createToken({ name: MusesTokenName.True, pattern: /true/ });
export const False = createToken({ name: MusesTokenName.Float, pattern: /false/ });
export const ConstInt = createToken({ name: MusesTokenName.ConstInt, pattern: /0|[1-9]\d*/ });
export const ConstFloat = createToken({ name: MusesTokenName.ConstFloat, pattern: /0|[1-9]\d*\.\d*/ });
export const ConstString = createToken({ name: MusesTokenName.ConstString, pattern: /"[^"]*"/ });

// Identifiers
export const Identifier = createToken({ name: MusesTokenName.Identifier, pattern: /[a-zA-Z_]\w*/ });

// #endregion

// All tokens
export const musesTokens: TokenType[] = [
    // comments
    WhiteSpace,                     // 
    Comment,                        // //

    // keywords
    If,                             // if
    Else,                           // else
    While,                          // while
    Do,                             // do
    For,                            // for
    Return,                         // return
    Break,                          // break
    Continue,                       // continue
    Struct,                         // struct

    // qualifier
    Attribute,                      // attribute
    Uniform,                        // uniform
    Varying,                        // varying
    In,                             // in
    Out,                            // out
    InOut,                          // inout
    Const,                          // const
    Invariant,                      // invariant

    // precision
    Lowp,                           // lowp
    Mediump,                        // mediump
    Highp,                          // highp

    // shader keywords
    Shader,                         // Shader
    Properties,                     // Properties
    SubShader,                      // SubShader
    FallBack,                       // FallBack
    Pass,                           // Pass

    // operators
    GreaterThenEqual,               // >=
    LessThenEqual,                  // <=
    Equal,                          // ==
    NotEqual,                       // !=
    And,                            // &&
    Or,                             // ||
    XOr,                            // ^^
    Inc,                            // ++
    Dec,                            // --
    AddAssign,                      // +=
    SubAssign,                      // -=
    MulAssign,                      // *=
    DivAssign,                      // /=
    ModAssign,                      // %=
    Plus,                           // +
    Minus,                          // -
    Multiply,                       // *
    Divide,                         // /
    Modulo,                         // %
    Assign,                         // =
    GreaterThen,                    // >
    LessThen,                       // <
    Not,                            // !
    QuestionMark,                   // ?

    // punctuation
    LeftParen,                      // (
    RightParen,                     // )
    LeftBrace,                      // {
    RightBrace,                     // }
    LeftBracket,                    // [
    RightBracket,                   // ]
    Comma,                          // ,
    Semicolon,                      // ;
    Colon,                          // :
    Dot,                            // .
    
    // types
    Void,                           // void
    Int,                            // int
    Float,                          // float
    Bool,                           // bool
    Vec2,                           // vec2
    Vec3,                           // vec3
    Vec4,                           // vec4
    BVec2,                          // bvec2
    BVec3,                          // bvec3
    BVec4,                          // bvec4
    IVec2,                          // ivec2
    IVec3,                          // ivec3
    IVec4,                          // ivec4
    Mat2,                           // mat2
    Mat3,                           // mat3
    Mat4,                           // mat4
    Sampler1D,                      // sampler1D
    Sampler2D,                      // sampler2D
    Sampler3D,                      // sampler3D
    SamplerCube,                    // samplerCube
    Sampler1DShadow,                // sampler1Dshadow
    Sampler2DShadow,                // sampler2Dshadow

    // constants
    True,                           // true
    False,                          // false
    ConstInt,                       // 0|[1-9]\d*
    ConstFloat,                     // 0|[1-9]\d*\.\d*
    ConstString,                    // "[^"]*"

    // identifiers
    Identifier                      // [a-zA-Z_]\w*
];

// Lexer
export const musesLexer = new Lexer(musesTokens);