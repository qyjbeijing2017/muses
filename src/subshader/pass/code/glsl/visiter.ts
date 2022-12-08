import { CstChildrenDictionary, CstNode, IToken } from "chevrotain";
import { IFunctionDeclaration } from "./ast-interface/declaration/function-declaration";
import { IStructDeclaration } from "./ast-interface/declaration/struct-declaration";
import { IVariableDeclaration } from "./ast-interface/declaration/variable-declaration";
import { IProgram } from "./ast-interface/program";
import { IBlockStatement } from "./ast-interface/statement/block-statement";
import { GLSLContext } from "./glsl-context";
import { glslParser } from "./parser";

const CstVisiter = glslParser.getBaseCstVisitorConstructor();

export class GlslVisitor extends CstVisiter {
    constructor() {
        super();
        this.validateVisitor();
    }

    ctx = new GLSLContext();

    blockStatement(ctx: CstChildrenDictionary) {
        const blockStatement: IBlockStatement = {
            type: 'blockStatement',
            body: [],
        }
        return blockStatement;
    }

    structMemberDeclaration(ctx: CstChildrenDictionary) {
        const percision: 'highp' | 'mediump' | 'lowp' | undefined = ctx.percision ? (ctx.percision[0] as IToken).image as 'highp' | 'mediump' | 'lowp' : undefined;
        const typeName: string = (ctx.typeName[0] as IToken).image;
        if (!this.ctx.getType(typeName)) {
            throw new Error(`Type ${typeName} is not defined`);
        };

        const variables = ctx.variable.map((variable) => {
            const variableDeclaration: IVariableDeclaration = {
                type: 'variableDeclaration',
                name: (variable as IToken).image,
                typeName,
                percision,
            }
            this.ctx.setVariable(variableDeclaration);
            return variableDeclaration;
        });
        return variables;
    }

    structDeclaration(ctx: CstChildrenDictionary) {
        const name = (ctx.name[0] as IToken).image;
        const members: IVariableDeclaration[] = [];
        this.ctx.addScope();
        ctx.members?.forEach((member) => {
            members.push(...this.visit(member as CstNode));
        });
        this.ctx.popScope();
        const rules = members.map((member) => {
            return {
                test: new RegExp(`^${name}\.${member.name}$`),
                returnType: member.typeName,
            }
        });
        const structDeclaration: IStructDeclaration = {
            type: 'structDeclaration',
            name,
            members,
            rules,
            isStruct: true,
        }
        this.ctx.setStruct(structDeclaration);
        return structDeclaration;
    }

    globalVariableDeclarator(ctx: CstChildrenDictionary) {
        const qualifier: 'uniform' | 'varying' | 'attribute' | 'const' | undefined = ctx.storage ? (ctx.storage[0] as IToken).image as 'uniform' | 'varying' | 'attribute' | 'const' : undefined;
        const constant: boolean = qualifier === 'const';
        const storage: 'uniform' | 'varying' | 'attribute' | undefined = qualifier === 'uniform' || qualifier === 'varying' || qualifier === 'attribute' ? qualifier : undefined;
        const percision: 'lowp' | 'mediump' | 'highp' | undefined = ctx.percision ? (ctx.percision[0] as IToken).image as 'lowp' | 'mediump' | 'highp' : undefined;
        const typeName: string = (ctx.typeName[0] as IToken).image;
        if (!this.ctx.getType(typeName)) {
            throw new Error(`Type ${typeName} is not defined`);
        };

        const variables = ctx.variable.map((variable) => {
            const variableDeclaration: IVariableDeclaration = {
                type: 'variableDeclaration',
                name: (variable as IToken).image,
                typeName,
                percision,
                const: constant,
                storage,
            }
            this.ctx.setVariable(variableDeclaration);
            return variableDeclaration;
        });
        return variables;
    }

    functionParameterDeclaration(ctx: CstChildrenDictionary) {
        const typeName = (ctx.typeName[0] as IToken).image;
        if (!this.ctx.getType(typeName)) {
            throw new Error(`Type ${typeName} is not defined`);
        };
        const variableDeclaration: IVariableDeclaration = {
            type: 'variableDeclaration',
            name: (ctx.name[0] as IToken).image,
            typeName,
            const: ctx.const ? true : false,
            storage: ctx.storage ? (ctx.storage[0] as IToken).image as 'in' | 'out' | 'inout' : undefined,
            percision: ctx.percision ? (ctx.percision[0] as IToken).image as 'lowp' | 'mediump' | 'highp' : undefined,
        }
        return variableDeclaration;
    }

    functionDeclaration(ctx: CstChildrenDictionary) {
        const returnTypeName = (ctx.returnTypeName[0] as IToken).image;
        if (!this.ctx.getType(returnTypeName)) {
            throw new Error(`Type ${returnTypeName} is not defined`);
        };
        this.ctx.addFunctionScope();
        const functionDeclaration: IFunctionDeclaration = {
            type: 'functionDeclaration',
            name: (ctx.name[0] as IToken).image,
            returnTypeName,
            parameters: ctx.parameters?.map((parameter) => this.visit(parameter as CstNode)) || [],
        };
        this.ctx.setFunction({
            ...functionDeclaration,
            onlyDefine: !ctx.body,
        });
        if (ctx.body) {
            functionDeclaration.body = this.visit(ctx.body[0] as CstNode);
        } else {
            this.ctx.popScope();
        }
        return functionDeclaration;
    }

    globalStatement(ctx: CstChildrenDictionary) {
        const statements = this.visit(ctx.statement[0] as CstNode);
        return Array.isArray(statements) ? statements : [statements];
    }

    glsl(ctx: CstChildrenDictionary) {
        const program: IProgram = {
            type: 'program',
            statements: [],
        };
        ctx.statements.forEach((statement) => {
            program.statements.push(...this.visit(statement as CstNode));
        });
        return program;
    }
}

export const glslVisitor = new GlslVisitor();