import { CstChildrenDictionary, CstNode, IToken } from "chevrotain";
import { IFunctionDeclaration } from "./ast-interface/declaration/function-declaration";
import { IStructDeclaration } from "./ast-interface/declaration/struct-declaration";
import { IVariableDeclaration } from "./ast-interface/declaration/variable-declaration";
import { IBinaryExpression } from "./ast-interface/expression/binary-expression";
import { IConditionalExpression } from "./ast-interface/expression/conditional-expression";
import { ILiterial } from "./ast-interface/expression/literial";
import { IProgram } from "./ast-interface/program";
import { IBlockStatement } from "./ast-interface/statement/block-statement";
import { IStatement } from "./ast-interface/statement/statement";
import { GLSLContext } from "./glsl-context";
import { glslParser } from "./parser";

const CstVisiter = glslParser.getBaseCstVisitorConstructor();

function literialTokenType2TypeName(tokenType: string) {
    switch (tokenType) {
        case 'True':
            return 'bool';
        case 'False':
            return 'bool';
        case 'FloatLiterial':
            return 'float';
        case 'IntLiterial':
            return 'int';
        default:
            return tokenType;
    }
}

export class GlslVisitor extends CstVisiter {
    constructor() {
        super();
        this.validateVisitor();
    }

    ctx = new GLSLContext();

    auto(ctx: CstChildrenDictionary) {
        if(ctx.literial){
            const literial:ILiterial = {
                type: 'literial',
                typeName: literialTokenType2TypeName((ctx.literial[0] as IToken).tokenType.name),
                value: (ctx.literial[0] as IToken).image,
            }
            return literial;
        }
        return ctx;
    }

    conditionalExpression(ctx:CstChildrenDictionary){
        const test = this.visit(ctx.test[0] as CstNode);
        const consequent = this.visit(ctx.consequent[0] as CstNode);
        const alternate = this.visit(ctx.alternate[0] as CstNode);
        if(test.typeName !== 'bool'){
            throw new Error(`Type ${test.typeName} cannot use as condition`);
        }
        if(consequent.typeName !== alternate.typeName){
            throw new Error(`Type ${consequent.typeName} and ${alternate.typeName} cannot use as condition`);
        }
        const conditionalExpression: IConditionalExpression = {
            type: 'conditionalExpression',
            test,
            consequent,
            alternate,
            typeName: consequent.typeName,
        };
        return conditionalExpression;
    }

    assignExpression(ctx: CstChildrenDictionary) {
        const left = this.visit(ctx.left[0] as CstNode);
        const right = ctx.operator ? this.visit(ctx.right[0] as CstNode) : undefined;
        const operator = ctx.operator ? (ctx.operator[0] as IToken).image : undefined;
        if (!right || !operator) {
            return left;
        }
        const typeName = this.ctx.checkOperator(operator, left.typeName, right.typeName);
        if(!typeName){
            throw new Error(`Type ${left.typeName} and ${right.typeName} cannot use operator ${operator}`);
        }
        const binaryExpression: IBinaryExpression = {
            type: 'binaryExpression',
            operator,
            left,
            right,
            typeName,
        }
        return binaryExpression;
    }

    variableInitializer(ctx: CstChildrenDictionary) {
        const name = (ctx.name[0] as IToken).image;
        const init = ctx.init ? this.visit(ctx.init[0] as CstNode) : undefined;
        return {
            name,
            init,
        }
    }

    variableDeclaration(ctx: CstChildrenDictionary) {
        const isConst = ctx.const ? true : false;
        const percision: 'highp' | 'mediump' | 'lowp' | undefined = ctx.percision ? (ctx.percision[0] as IToken).image as 'highp' | 'mediump' | 'lowp' : undefined;
        const typeName: string = (ctx.typeName[0] as IToken).image;
        if (!this.ctx.getType(typeName)) {
            throw new Error(`Type ${typeName} is not defined`);
        }
        const variables = ctx.variable.map((variable) => {
            const {name, init} = this.visit(variable as CstNode);
            if(init &&  (init.typeName !== typeName)){
                throw new Error(`Type ${init.typeName} cannot assign to ${typeName}`);
            }
            const variableDeclaration: IVariableDeclaration = {
                type: 'variableDeclaration',
                name: name,
                typeName,
                percision,
                isConst,
                init,
            }
            this.ctx.setVariable(variableDeclaration);
            return variableDeclaration;
        });
        return variables;
    }

    statement(ctx: CstChildrenDictionary) {
        const statement = this.visit(ctx.statement[0] as CstNode);
        return Array.isArray(statement) ? statement : [statement];
    }

    blockStatement(ctx: CstChildrenDictionary) {
        this.ctx.addScope();
        const statements: IStatement[] = [];
        ctx.statements?.forEach((statement) => statements.push(...this.visit(statement as CstNode)));
        this.ctx.popScope();
        const blockStatement: IBlockStatement = {
            type: 'blockStatement',
            body: statements,
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
            const {name, init} = this.visit(variable as CstNode);
            if(init &&  storage){
                throw new Error(`${storage} variable cannot have init value`);
            }
            if(constant && !init){
                throw new Error(`const variable must have init value`);
            }
            if(init &&  (init.typeName !== typeName)){
                throw new Error(`Type ${init.typeName} cannot assign to ${typeName}`);
            }
            const variableDeclaration: IVariableDeclaration = {
                type: 'variableDeclaration',
                name: name,
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
        this.ctx.setVariable(variableDeclaration);
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