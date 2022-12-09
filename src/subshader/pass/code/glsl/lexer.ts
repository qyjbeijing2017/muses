import { Lexer, createToken, TokenType } from "chevrotain"

// #region Create Tokens

// Identifiers
export const Identifier = createToken({ name: 'Identifier', pattern: /[a-zA-Z_]\w*/ });

export const WhiteSpace = createToken({ name: 'WhiteSpace', pattern: /\s+/, group: Lexer.SKIPPED });
export const Comment = createToken({ name: 'SingleLineComment', pattern: /\/\/.*/, group: Lexer.SKIPPED });

// Keywords
export const If = createToken({ name: 'If', pattern: /if/, longer_alt: Identifier });
export const Else = createToken({ name: 'Else', pattern: /else/, longer_alt: Identifier });
export const While = createToken({ name: 'While', pattern: /while/, longer_alt: Identifier });
export const Do = createToken({ name: 'Do', pattern: /do/, longer_alt: Identifier });
export const For = createToken({ name: 'For', pattern: /for/, longer_alt: Identifier });
export const Return = createToken({ name: 'Return', pattern: /return/, longer_alt: Identifier });
export const Break = createToken({ name: 'Break', pattern: /break/, longer_alt: Identifier });
export const Continue = createToken({ name: 'Continue', pattern: /continue/, longer_alt: Identifier });
export const Struct = createToken({ name: 'Struct', pattern: /struct/, longer_alt: Identifier });
export const Switch = createToken({ name: 'Switch', pattern: /switch/, longer_alt: Identifier });
export const Case = createToken({ name: 'Case', pattern: /case/, longer_alt: Identifier });
export const Default = createToken({ name: 'Default', pattern: /default/, longer_alt: Identifier });

// Types
export const Types = createToken({ name: 'Types', pattern: Lexer.NA });
export const Void = createToken({ name: 'Void', pattern: /void/, longer_alt: Identifier });
export const Int = createToken({ name: 'Int', pattern: /int/, longer_alt: Identifier, categories: Types });
export const Float = createToken({ name: 'Float', pattern: /float/, longer_alt: Identifier, categories: Types });
export const Bool = createToken({ name: 'Bool', pattern: /bool/, longer_alt: Identifier, categories: Types });
export const Vec2 = createToken({ name: 'Vec2', pattern: /vec2/, longer_alt: Identifier, categories: Types });
export const Vec3 = createToken({ name: 'Vec3', pattern: /vec3/, longer_alt: Identifier, categories: Types });
export const Vec4 = createToken({ name: 'Vec4', pattern: /vec4/, longer_alt: Identifier, categories: Types });
export const BVec2 = createToken({ name: 'BVec2', pattern: /bvec2/, longer_alt: Identifier, categories: Types });
export const BVec3 = createToken({ name: 'BVec3', pattern: /bvec3/, longer_alt: Identifier, categories: Types });
export const BVec4 = createToken({ name: 'BVec4', pattern: /bvec4/, longer_alt: Identifier, categories: Types });
export const IVec2 = createToken({ name: 'IVec2', pattern: /ivec2/, longer_alt: Identifier, categories: Types });
export const IVec3 = createToken({ name: 'IVec3', pattern: /ivec3/, longer_alt: Identifier, categories: Types });
export const IVec4 = createToken({ name: 'IVec4', pattern: /ivec4/, longer_alt: Identifier, categories: Types });
export const Mat2 = createToken({ name: 'Mat2', pattern: /mat2/, longer_alt: Identifier, categories: Types });
export const Mat3 = createToken({ name: 'Mat3', pattern: /mat3/, longer_alt: Identifier, categories: Types });
export const Mat4 = createToken({ name: 'Mat4', pattern: /mat4/, longer_alt: Identifier, categories: Types });
export const Sampler1DShadow = createToken({ name: 'Sampler1Dshadow', pattern: /sampler1Dshadow/, longer_alt: Identifier, categories: Types });
export const Sampler2DShadow = createToken({ name: 'Sampler2Dshadow', pattern: /sampler2Dshadow/, longer_alt: Identifier, categories: Types });
export const Sampler1D = createToken({ name: 'Sampler1D', pattern: /sampler1D/, longer_alt: Identifier, categories: Types });
export const Sampler2D = createToken({ name: 'Sampler2D', pattern: /sampler2D/, longer_alt: Identifier, categories: Types });
export const Sampler3D = createToken({ name: 'Sampler3D', pattern: /sampler3D/, longer_alt: Identifier, categories: Types });
export const SamplerCube = createToken({ name: 'SamplerCube', pattern: /samplerCube/, longer_alt: Identifier, categories: Types });

// Qualifier
export const StorageQualifiers = createToken({ name: 'StorageQualifiers', pattern: Lexer.NA });
export const GlobalStorageQualifiers = createToken({ name: 'GlobalStorageQualifiers', pattern: Lexer.NA });
export const ParamStrorageQualifiers = createToken({ name: 'ParamStrorageQualifiers', pattern: Lexer.NA });
export const Attribute = createToken({ name: 'Attribute', pattern: /attribute/, longer_alt: Identifier, categories: [StorageQualifiers, GlobalStorageQualifiers] });
export const Uniform = createToken({ name: 'Uniform', pattern: /uniform/, longer_alt: Identifier, categories: [StorageQualifiers, GlobalStorageQualifiers] });
export const Varying = createToken({ name: 'Varying', pattern: /varying/, longer_alt: Identifier, categories: [StorageQualifiers, GlobalStorageQualifiers] });
export const InOut = createToken({ name: 'InOut', pattern: /inout/, longer_alt: Identifier, categories: [StorageQualifiers, ParamStrorageQualifiers] });
export const Invariant = createToken({ name: 'Invariant', pattern: /invariant/, longer_alt: Identifier });
export const In = createToken({ name: 'In', pattern: /in/, longer_alt: Identifier, categories: [StorageQualifiers, ParamStrorageQualifiers] });
export const Out = createToken({ name: 'Out', pattern: /out/, longer_alt: Identifier, categories: [StorageQualifiers, ParamStrorageQualifiers] });
export const Const = createToken({ name: 'Const', pattern: /const/, longer_alt: Identifier, categories: [StorageQualifiers, GlobalStorageQualifiers] });

// Precision
export const PercisionQualifiers = createToken({ name: 'PercisionQualifiers', pattern: Lexer.NA });
export const Percision = createToken({ name: 'Percision', pattern: /precision/, longer_alt: Identifier });
export const Lowp = createToken({ name: 'Lowp', pattern: /lowp/, longer_alt: Identifier, categories: PercisionQualifiers });
export const Mediump = createToken({ name: 'Mediump', pattern: /mediump/, longer_alt: Identifier, categories: PercisionQualifiers });
export const Highp = createToken({ name: 'Highp', pattern: /highp/, longer_alt: Identifier, categories: PercisionQualifiers });

// Operators
export const GreaterThenEqual = createToken({ name: 'GreaterThenEqual', pattern: />=/ });
export const LessThenEqual = createToken({ name: 'LessThenEqual', pattern: /<=/ });
export const Equal = createToken({ name: 'Equal', pattern: /==/ });
export const NotEqual = createToken({ name: 'NotEqual', pattern: /!=/ });
export const And = createToken({ name: 'And', pattern: /&&/ });
export const Or = createToken({ name: 'Or', pattern: /\|\|/ });
export const XOr = createToken({ name: 'XOr', pattern: /\^\^/ });
export const Inc = createToken({ name: 'Inc', pattern: /\+\+/ });
export const Dec = createToken({ name: 'Dec', pattern: /--/ });
export const BitLeftShift = createToken({ name: 'BitLeftShift', pattern: /<</ });
export const BitRightShift = createToken({ name: 'BitRightShift', pattern: />>/ });
export const BitAnd = createToken({ name: 'BitAnd', pattern: /&/ });
export const BitOr = createToken({ name: 'BitOr', pattern: /\|/ });
export const BitXOr = createToken({ name: 'BitXOr', pattern: /\^/ });
export const AddAssign = createToken({ name: 'AddAssign', pattern: /\+=/ });
export const SubAssign = createToken({ name: 'SubAssign', pattern: /-=/ });
export const MulAssign = createToken({ name: 'MulAssign', pattern: /\*=/ });
export const DivAssign = createToken({ name: 'DivAssign', pattern: /\/=/ });
export const ModAssign = createToken({ name: 'ModAssign', pattern: /%=/ });
export const Plus = createToken({ name: 'Plus', pattern: /\+/ });
export const Minus = createToken({ name: 'Minus', pattern: /-/ });
export const Multiply = createToken({ name: 'Multiply', pattern: /\*/ });
export const Divide = createToken({ name: 'Divide', pattern: /\// });
export const Modulo = createToken({ name: 'Modulo', pattern: /%/ });
export const Assign = createToken({ name: 'Assign', pattern: /=/ });
export const GreaterThen = createToken({ name: 'GreaterThen', pattern: />/ });
export const LessThen = createToken({ name: 'LessThen', pattern: /</ });
export const Not = createToken({ name: 'Not', pattern: /!/ });
export const QuestionMark = createToken({ name: "QuestionMark", pattern: /\?/ });

// Punctuation
export const LeftParen = createToken({ name: 'LeftParen', pattern: /\(/ });
export const RightParen = createToken({ name: 'RightParen', pattern: /\)/ });
export const LeftBrace = createToken({ name: 'LeftBrace', pattern: /\{/ });
export const RightBrace = createToken({ name: 'RightBrace', pattern: /\}/ });
export const LeftBracket = createToken({ name: 'LeftBracket', pattern: /\[/ });
export const RightBracket = createToken({ name: 'RightBracket', pattern: /\]/ });
export const Comma = createToken({ name: 'Comma', pattern: /,/ });
export const Semicolon = createToken({ name: 'Semicolon', pattern: /;/ });
export const Dot = createToken({ name: 'Dot', pattern: /\./ });
export const Colon = createToken({ name: 'Colon', pattern: /:/ });

// Constants
export const Literials = createToken({ name: 'Literials', pattern: Lexer.NA });
export const True = createToken({ name: 'True', pattern: /true/, longer_alt: Identifier, categories: Literials });
export const False = createToken({ name: 'False', pattern: /false/, longer_alt: Identifier, categories: Literials });
export const FloatLiterial = createToken({ name: 'FloatLiterial', pattern: /(0|[1-9]\d*)\.\d*/, categories: Literials });
export const IntLiterial = createToken({ name: 'IntLiterial', pattern: /([1-9]\d*|0)|(0x[0-9A-F]*)|(0b[0-1]*)|(0[0-7]*)/, categories: Literials });
export const StringLiterial = createToken({ name: 'StringLiterial', pattern: /"[^"]*"/ });


// #endregion

// All tokens
export const musesTokens: TokenType[] = [
    // comments
    WhiteSpace,                     // 
    Comment,                        // //

    // types
    Types,
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
    Sampler1DShadow,                // sampler1Dshadow
    Sampler2DShadow,                // sampler2Dshadow
    Sampler1D,                      // sampler1D
    Sampler2D,                      // sampler2D
    Sampler3D,                      // sampler3D
    SamplerCube,                    // samplerCube


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
    Switch,                         // switch
    Case,                           // case
    Default,                        // default

    // qualifier
    StorageQualifiers,
    GlobalStorageQualifiers,
    ParamStrorageQualifiers,
    Attribute,                      // attribute
    Uniform,                        // uniform
    Varying,                        // varying
    InOut,                          // inout
    Invariant,                      // invariant
    In,                             // in
    Out,                            // out
    Const,                          // const

    // precision
    PercisionQualifiers,
    Percision,                      // precision
    Lowp,                           // lowp
    Mediump,                        // mediump
    Highp,                          // highp

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
    BitLeftShift,                   // <<
    BitRightShift,                  // >>
    BitAnd,                         // &
    BitOr,                          // |
    BitXOr,                         // ^
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

    // constants
    Literials,
    True,                           // true
    False,                          // false
    FloatLiterial,                  // 0|[1-9]\d*\.\d*
    IntLiterial,                    // 0|[1-9]\d*
    StringLiterial,                 // "[^"]*"

    // identifiers
    Identifier                      // [a-zA-Z_]\w*
];

// tokenLab
export const musesToken = {
    AddAssign,
    And,
    Assign,
    Attribute,
    Bool,
    Break,
    BVec2,
    BVec3,
    BVec4,
    Colon,
    Comma,
    Const,
    FloatLiterial,
    IntLiterial,
    StringLiterial,
    Continue,
    Dec,
    DivAssign,
    Divide,
    Do,
    Dot,
    Else,
    Equal,
    False,
    Float,
    For,
    GreaterThen,
    GreaterThenEqual,
    Highp,
    Identifier,
    If,
    In,
    Inc,
    InOut,
    Int,
    IVec2,
    IVec3,
    IVec4,
    LeftBrace,
    LeftBracket,
    LeftParen,
    LessThen,
    LessThenEqual,
    Lowp,
    Mat2,
    Mat3,
    Mat4,
    Mediump,
    Minus,
    ModAssign,
    MulAssign,
    Multiply,
    Not,
    NotEqual,
    XOr,
    Or,
    Out,
    Plus,
    QuestionMark,
    Return,
    RightBrace,
    RightBracket,
    RightParen,
    Sampler1D,
    Sampler1DShadow,
    Sampler2D,
    Sampler2DShadow,
    Sampler3D,
    SamplerCube,
    Semicolon,
    Struct,
    SubAssign,
    True,
    Uniform,
    Varying,
    Vec2,
    Vec3,
    Vec4,
    Void,
    While,
    Percision,                      // precision
    Types,
    PercisionQualifiers,
    StorageQualifiers,
    GlobalStorageQualifiers,
    ParamStrorageQualifiers,
    Literials,
    Switch,
    Case,
    Default,
}

// Lexer
export const glslLexer = new Lexer(musesTokens);
