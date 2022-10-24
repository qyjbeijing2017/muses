import { CstChildrenDictionary, CstNode, IToken } from "chevrotain";
import { MusesFallback } from "./ast/fallback";
import { MusesGLSL } from "./ast/glsl";
import { MusesFunctionDeclaration } from "./ast/glsl/function-declaration";
import { MusesTypeDeclaration } from "./ast/glsl/type-declaration";
import { MusesVariableDeclaration } from "./ast/glsl/variable-declaration";
import { MusesPass } from "./ast/pass";
import { MusesProperties } from "./ast/properties";
import { MusesShader } from "./ast/shader";
import { MusesSubShader } from "./ast/subshader";
import { musesParser } from "./parser";
const CstVisiter = musesParser.getBaseCstVisitorConstructor();

export class MusesVisitor extends CstVisiter {
    constructor() {
        super();
        this.validateVisitor();
    }

    properties(ctx: CstChildrenDictionary) {
        const properties = new MusesProperties({});
        return properties;
    }

    // #region GLSL
    storageDeclaration(ctx: CstChildrenDictionary) {
        const storage = (ctx.name[0] as IToken).image;
        return storage;
    }

    percisionDeclaration(ctx: CstChildrenDictionary) {
        const percision = (ctx.name[0] as IToken).image;
        return percision;
    }
    
    typeDeclaration(ctx: CstChildrenDictionary) {
        const name = (ctx.name[0] as IToken).image;
        const typeDeclaration = new MusesTypeDeclaration({ name });
        return typeDeclaration;
    }

    variableDeclaration(ctx: CstChildrenDictionary) {
        const type = this.visit(ctx.type[0] as CstNode);
        const name = (ctx.name[0] as IToken).image;
        const storage = ctx.storage?this.visit(ctx.storage[0] as CstNode): undefined;
        const percision = ctx.percision?this.visit(ctx.percision[0] as CstNode): undefined;
        const variableDeclaration = new MusesVariableDeclaration({ name, type, storage, percision });
        return variableDeclaration;
    }

    functionDeclaration(ctx: CstChildrenDictionary) {
        const returnType = this.visit(ctx.returnType[0] as CstNode);
        const name = (ctx.name[0] as IToken).image;
        const functionDeclaration = new MusesFunctionDeclaration({ returnType, name });
        return functionDeclaration;
    }

    variableDeclarationStatement(ctx: CstChildrenDictionary) {
        const variableDeclaration = this.visit(ctx.variableDeclaration[0] as CstNode);
        return variableDeclaration;
    }

    glsl(ctx: CstChildrenDictionary) {
        const glsl = new MusesGLSL({
            body: ctx.body.map((statement) => this.visit(statement as CstNode)),
        });
        return glsl;
    }
    // #endregion

    pass(ctx: CstChildrenDictionary) {
        const pass = new MusesPass({
            glsl: ctx.glsl ? this.visit(ctx.glsl[0] as CstNode) : undefined,
        });
        return pass;
    }

    subshader(ctx: CstChildrenDictionary) {
        const subshader = new MusesSubShader({
            passes: ctx.passes.map((pass) => this.visit(pass as CstNode)),
        });
        return subshader;
    }

    fallback(ctx: CstChildrenDictionary) {
        const fallback = new MusesFallback({
            to: (ctx.to[0] as IToken).image.replace(/"/g, ""),
        });
        return fallback;
    }

    shader(ctx: CstChildrenDictionary) {
        const shader = new MusesShader({
            name: (ctx.name[0] as IToken).image.replace(/"/g, ""),
            subShaders: ctx.subshader.map((subshader) => this.visit(subshader as CstNode)),
            properties: ctx.properties ? this.visit(ctx.properties[0] as CstNode) : undefined,
            fallback: ctx.fallback ? this.visit(ctx.fallback[0] as CstNode) : undefined,
        });
        return shader;
    }
}

export const musesVisitor = new MusesVisitor();