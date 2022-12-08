import { EmbeddedActionsParser } from 'chevrotain'
import { IProperty, PropertyType, PropertyValue } from './properties';
import { propertiesTokens, Comma, Equal, Identifier, LeftBrace, LeftParen, NumberLiteral, RightBrace, RightParen, StringLiteral, Type2D, Type3D, TypeColor, TypeCube, TypeFloat, TypeInt, TypeRange, TypeVector } from './lexer'

export class PropertiesParser extends EmbeddedActionsParser {
    constructor() {
        super(propertiesTokens)
        this.performSelfAnalysis();
    }

    floatType = this.RULE('floatType', () => {
        const type = this.CONSUME(TypeFloat, { LABEL: 'type' }).image as PropertyType;
        this.CONSUME(RightParen);
        this.CONSUME(Equal);
        const valueStr = this.CONSUME(NumberLiteral, { LABEL: 'value' }).image;

        const value = parseFloat(valueStr);
        return { type, value };
    });

    rangeType = this.RULE('rangeType', () => {
        const type = this.CONSUME(TypeRange, { LABEL: 'type' }).image as PropertyType;
        this.CONSUME(LeftParen);
        const minStr = this.CONSUME(NumberLiteral, { LABEL: 'min' }).image;
        this.CONSUME(Comma);
        const maxStr = this.CONSUME2(NumberLiteral, { LABEL: 'max' }).image;
        this.CONSUME(RightParen);
        this.CONSUME1(RightParen);
        this.CONSUME(Equal);
        const valueStr = this.CONSUME3(NumberLiteral, { LABEL: 'value' }).image;

        const min = parseFloat(minStr);
        const max = parseFloat(maxStr);
        const value = parseFloat(valueStr);
        return { type, min, max, value };
    });

    intType = this.RULE('intType', () => {
        const type = this.CONSUME(TypeInt, { LABEL: 'type' }).image as PropertyType;
        this.CONSUME1(RightParen);
        this.CONSUME(Equal);
        const valueStr = this.CONSUME3(NumberLiteral, { LABEL: 'value' }).image;

        const value = parseFloat(valueStr);
        return { type, value };
    });

    colorType = this.RULE('colorType', () => {
        const type = this.CONSUME(TypeColor, { LABEL: 'type' }).image as PropertyType;
        this.CONSUME(RightParen);
        this.CONSUME(Equal);
        this.CONSUME(LeftParen);
        const rStr = this.CONSUME(NumberLiteral, { LABEL: 'r' }).image;
        this.CONSUME(Comma);
        const gStr = this.CONSUME1(NumberLiteral, { LABEL: 'g' }).image;
        this.CONSUME1(Comma);
        const bStr = this.CONSUME2(NumberLiteral, { LABEL: 'b' }).image;
        this.CONSUME2(Comma);
        const aStr = this.CONSUME3(NumberLiteral, { LABEL: 'a' }).image;
        this.CONSUME1(RightParen);

        const r = parseFloat(rStr);
        const g = parseFloat(gStr);
        const b = parseFloat(bStr);
        const a = parseFloat(aStr);
        return { type, value: [r, g, b, a] as [number, number, number, number] };
    });

    vectorType = this.RULE('vectorType', () => {
        const type = this.CONSUME(TypeVector, { LABEL: 'type' }).image as PropertyType;
        this.CONSUME(RightParen);
        this.CONSUME(Equal);
        this.CONSUME(LeftParen);
        const xStr = this.CONSUME(NumberLiteral, { LABEL: 'x' }).image;
        this.CONSUME(Comma);
        const yStr = this.CONSUME1(NumberLiteral, { LABEL: 'y' }).image;
        this.CONSUME1(Comma);
        const zStr = this.CONSUME2(NumberLiteral, { LABEL: 'z' }).image;
        this.CONSUME2(Comma);
        const wStr = this.CONSUME3(NumberLiteral, { LABEL: 'w' }).image;
        this.CONSUME1(RightParen);

        const x = parseFloat(xStr);
        const y = parseFloat(yStr);
        const z = parseFloat(zStr);
        const w = parseFloat(wStr);
        return { type, value: [x, y, z, w] as [number, number, number, number] };
    });

    twoDType = this.RULE('twoDType', () => {
        const type = this.CONSUME(Type2D, { LABEL: 'type' }).image as PropertyType;
        this.CONSUME(RightParen);
        this.CONSUME(Equal);
        const value = this.CONSUME(StringLiteral, { LABEL: 'value' }).image.slice(1, -1);
        this.CONSUME(LeftBrace);
        this.CONSUME1(RightBrace);
        return { type, value };
    });

    threeDdType = this.RULE('threeDdType', () => {
        const type = this.CONSUME(Type3D, { LABEL: 'type' }).image as PropertyType;
        this.CONSUME(RightParen);
        this.CONSUME(Equal);
        const value = this.CONSUME(StringLiteral, { LABEL: 'value' }).image.slice(1, -1);
        this.CONSUME(LeftBrace);
        this.CONSUME1(RightBrace);
        return { type, value };
    });

    cubeType = this.RULE('cubeType', () => {
        const type = this.CONSUME(TypeCube, { LABEL: 'type' }).image as PropertyType;
        this.CONSUME(RightParen);
        this.CONSUME(Equal);
        const value = this.CONSUME(StringLiteral, { LABEL: 'value' }).image.slice(1, -1);
        this.CONSUME(LeftBrace);
        this.CONSUME1(RightBrace);
        return { type, value };
    });


    parse = this.RULE('parse', () => {
        const properties: IProperty[] = [];
        this.MANY(() => {
            let typeAndValue: {
                type: PropertyType,
                value: PropertyValue,
                max?: number,
                min?: number,
            } | null = null;
            const name = this.CONSUME(Identifier, { LABEL: 'name' }).image;
            this.CONSUME(LeftParen);
            const label = this.CONSUME(StringLiteral, { LABEL: 'label' }).image.slice(1, -1);
            this.CONSUME(Comma);
            this.OR([
                { ALT: () => typeAndValue = this.SUBRULE(this.floatType) },
                { ALT: () => typeAndValue = this.SUBRULE(this.rangeType) },
                { ALT: () => typeAndValue = this.SUBRULE(this.intType) },
                { ALT: () => typeAndValue = this.SUBRULE(this.colorType) },
                { ALT: () => typeAndValue = this.SUBRULE(this.vectorType) },
                { ALT: () => typeAndValue = this.SUBRULE(this.twoDType) },
                { ALT: () => typeAndValue = this.SUBRULE(this.threeDdType) },
                { ALT: () => typeAndValue = this.SUBRULE(this.cubeType) },
            ]);
            if(!typeAndValue) {
                throw new Error('Properties type and value not found');
            }

            properties.push({
                name,
                label: label.slice(1, -1),
                ...typeAndValue as any,
            });
        });
        return properties;
    });
}

export const propertiesParser = new PropertiesParser();