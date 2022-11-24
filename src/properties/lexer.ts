import { createToken, Lexer } from "chevrotain";


export const NumberLiteral = createToken({ name: "NumberLiteral", pattern: /-?(0|[1-9]\d*)(\.\d+)?([eE][+-]?\d+)?/ });
export const StringLiteral = createToken({ name: "StringLiteral", pattern: /"[^"]*"/ });
export const Identifier = createToken({ name: "Identifier", pattern: /[a-zA-Z_][a-zA-Z0-9_]*/ });
export const Comment = createToken({ name: "Comment", pattern: /\/\/.*/, group: Lexer.SKIPPED });
export const WhiteSpace = createToken({ name: "WhiteSpace", pattern: /\s+/, group: Lexer.SKIPPED});

export const TypeInt = createToken({ name: "TypeInt", pattern: /Int/, longer_alt: Identifier });
export const TypeFloat = createToken({ name: "TypeFloat", pattern: /Float/, longer_alt: Identifier });
export const TypeColor = createToken({ name: "TypeColor", pattern: /Color/, longer_alt: Identifier });
export const TypeVector = createToken({ name: "TypeVector", pattern: /Vector/, longer_alt: Identifier });
export const TypeRange = createToken({ name: "TypeRange", pattern: /Range/, longer_alt: Identifier });
export const Type2D = createToken({ name: "Type2D", pattern: /2D/, longer_alt: Identifier });
// export const Type2DArr = createToken({ name: "Type2DArr", pattern: /2DArray/, longer_alt: Identifier });
export const Type3D = createToken({ name: "Type3D", pattern: /3D/, longer_alt: Identifier });
export const TypeCube = createToken({ name: "TypeCube", pattern: /Cube/, longer_alt: Identifier });
// export const TypeCubeArr = createToken({ name: "TypeCubeArr", pattern: /CubeArray/, longer_alt: Identifier });

export const LeftParen = createToken({ name: "LeftParen", pattern: /\(/ });
export const RightParen = createToken({ name: "RightParen", pattern: /\)/ });
export const LeftBrace = createToken({ name: "LeftBrace", pattern: /\{/ });
export const RightBrace = createToken({ name: "RightBrace", pattern: /\}/ });
export const Comma = createToken({ name: "Comma", pattern: /,/ });

export const Equal = createToken({ name: "Equal", pattern: /=/ });

export const propertiesTokens = [
    WhiteSpace,
    Comment,
    TypeInt,
    TypeFloat,
    TypeColor,
    TypeVector,
    TypeRange,
    Type2D,
    // Type2DArr,
    Type3D,
    TypeCube,
    // TypeCubeArr,
    LeftParen,
    RightParen,
    LeftBrace,
    RightBrace,
    Equal,
    Comma,
    NumberLiteral,
    StringLiteral,
    Identifier,
];

export const propertiesLexer = new Lexer(propertiesTokens);
