import { CstChildrenDictionary, CstNode, IToken } from "chevrotain";
import { IFunctionDeclaration } from "./ast-interface/declaration/function-declaration";
import { IStructDeclaration } from "./ast-interface/declaration/struct-declaration";
import { IVariableDeclaration } from "./ast-interface/declaration/variable-declaration";
import { IBinaryExpression } from "./ast-interface/expression/binary-expression";
import { ICallExpression } from "./ast-interface/expression/call-expression";
import { IConditionalExpression } from "./ast-interface/expression/conditional-expression";
import { IDotExpression } from "./ast-interface/expression/dot-expression";
import { IExpression } from "./ast-interface/expression/expression";
import { IIdentifierReference } from "./ast-interface/expression/identifier-reference";
import { IIndexExpression } from "./ast-interface/expression/index-expression";
import { ILiterial } from "./ast-interface/expression/literial";
import { ITypeConstructor } from "./ast-interface/expression/type-constructor";
import { IUnaryExpression } from "./ast-interface/expression/unary-expression";
import { IUpdateExpression } from "./ast-interface/expression/update-expression";
import { IProgram } from "./ast-interface/program";
import { IBlockStatement } from "./ast-interface/statement/block-statement";
import { IBreakStatement } from "./ast-interface/statement/break-statement";
import { IIfStatement } from "./ast-interface/statement/brench/if-statement";
import { ISwitchCase, ISwitchStatement } from "./ast-interface/statement/brench/switch-statement";
import { IContinueStatement } from "./ast-interface/statement/continue-statement";
import { IExpressionStatement } from "./ast-interface/statement/expression-statement";
import { IDoStatement } from "./ast-interface/statement/loop/do-statement";
import { IForStatement } from "./ast-interface/statement/loop/for-statement";
import { IWhileStatement } from "./ast-interface/statement/loop/while-statement";
import { IReturnStatement } from "./ast-interface/statement/return-statement";
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

    right2left(ctx: CstChildrenDictionary) {
        const left = this.visit(ctx.left[0] as CstNode);
        const right = ctx.operator ? this.visit(ctx.right[0] as CstNode) : undefined;
        const operator = ctx.operator ? (ctx.operator[0] as IToken).image : undefined;
        if (!right || !operator) {
            return left;
        }
        const typeName = this.ctx.checkOperator(left.typeName, operator, right.typeName);
        if (!typeName) {
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

    left2right(ctx: CstChildrenDictionary) {
        let left = this.visit(ctx.left[0] as CstNode);
        if (!ctx.operator || !ctx.right) {
            return left;
        }
        for (let i = 0; i < ctx.operator.length; i++) {
            const operator = (ctx.operator[i] as IToken).image;
            const right = this.visit(ctx.right[i] as CstNode);
            const typeName = this.ctx.checkOperator(left.typeName, operator, right.typeName);
            if (!typeName) {
                throw new Error(`Type ${left.typeName} and ${right.typeName} cannot use operator ${operator}`);
            }
            const binaryExpression: IBinaryExpression = {
                type: 'binaryExpression',
                operator,
                left,
                right,
                typeName,
            }
            left = binaryExpression;
        }
        return left;
    }

    ctx = new GLSLContext();

    parenExpression(ctx: CstChildrenDictionary) {
        return this.visit(ctx.expression[0] as CstNode);
    }

    auto(ctx: CstChildrenDictionary) {
        if (ctx.literial) {
            const literial: ILiterial = {
                type: 'literial',
                typeName: literialTokenType2TypeName((ctx.literial[0] as IToken).tokenType.name),
                value: (ctx.literial[0] as IToken).image,
            }
            return literial;
        }
        if (ctx.identifier) {
            const name = (ctx.identifier[0] as IToken).image;
            const variable = this.ctx.getVariable(name);
            if (!variable) {
                throw new Error(`Variable ${name} is not defined`);
            }
            const identifier: IIdentifierReference = {
                type: 'identifierReference',
                name: name,
                typeName: variable.typeName,
            }
            return identifier;
        }
        if (ctx.type) {
            const typeConstructor: ITypeConstructor = {
                type: 'typeConstructor',
                typeName: (ctx.type[0] as IToken).image,
                params: [],
            }
            return typeConstructor;
        }
        return this.visit(ctx.expression[0] as CstNode);
    }

    indexExpression(ctx: CstChildrenDictionary) {
        const index: IExpression = this.visit(ctx.index[0] as CstNode);
        const indexExpression: IIndexExpression = {
            type: 'indexExpression',
            index: index,
            operand: {} as any,
            typeName: index.typeName,
        }
        return indexExpression;
    }

    callExpression(ctx: CstChildrenDictionary) {
        const params = ctx.params ? ctx.params.map(param => this.visit(param as CstNode)) : [];
        const callExpression: ICallExpression = {
            type: 'callExpression',
            params,
            callee: {} as any,
            typeName: 'void',
        }
        return callExpression;
    }

    dotExpression(ctx: CstChildrenDictionary) {
        const memberName = (ctx.member[0] as IToken).image;
        const member: IIdentifierReference = {
            type: 'identifierReference',
            name: memberName,
            typeName: 'void',
        }
        const dotExpression: IDotExpression = {
            type: 'dotExpression',
            member,
            operand: {} as any,
            typeName: 'void',
        }
        return dotExpression;
    }

    updateExpression(ctx: CstChildrenDictionary) {
        const operator = (ctx.operator[0] as IToken).image;
        const updateExpression: IUpdateExpression = {
            type: 'updateExpression',
            operator,
            operand: {} as any,
            typeName: 'void',
        }
        return updateExpression;
    }

    postfixExpression(ctx: CstChildrenDictionary) {
        let operand = this.visit(ctx.operand[0] as CstNode);
        if (!ctx.operation) {
            return operand;
        }
        for (let i = 0; i < ctx.operations.length; i++) {
            const operation: IExpression = this.visit(ctx.operations[i] as CstNode);
            switch (operation.type) {
                case 'indexExpression':
                    const indexExpression = operation as IIndexExpression;
                    indexExpression.operand = operand;
                    const typeName = this.ctx.getIndexType(operand.typeName);
                    if (!typeName) {
                        throw new Error(`Type ${operand.typeName} cannot use index`);
                    }
                    indexExpression.typeName = typeName;
                    operand = indexExpression;
                    break;
                case 'callExpression':
                    const callExpression = operation as ICallExpression;
                    if(operand.type === 'typeConstructor') {
                        const sign = `${operand.typeName}(${callExpression.params.map(param => param.typeName).join(',')})`;
                        const info = this.ctx.getFunctionOrConstructor(sign);
                        if (!info) {
                            throw new Error(`Constructor ${sign} not found`);
                        }
                        operand.params = callExpression.params;
                        break;
                    }
                    if (operand.type !== 'identifierReference') {
                        throw new Error(`Only identifier can be called`);
                    }
                    callExpression.callee = operand;
                    const sign = `${callExpression.callee.name}(${callExpression.params.map(param => param.typeName).join(',')})`;
                    const info = this.ctx.getFunctionOrConstructor(sign);
                    if (!info) {
                        throw new Error(`Function ${sign} not found`);
                    }
                    if (info.isConstructor) {
                        const constructorExpression: ITypeConstructor = {
                            type: 'typeConstructor',
                            typeName: info.typeName,
                            params: callExpression.params,
                        }
                        operand = constructorExpression;
                    } else {
                        callExpression.typeName = info.typeName;
                        operand = callExpression;
                    }
                    break;
                case 'dotExpression':
                    const dotExpression = operation as IDotExpression;
                    dotExpression.operand = operand;
                    const memberName = dotExpression.member.name;
                    const memberType = this.ctx.getMemberType(operand.typeName, memberName);
                    if (!memberType) {
                        throw new Error(`Type ${operand.typeName} has no member ${memberName}`);
                    }
                    dotExpression.member.typeName = memberType;
                    dotExpression.typeName = memberType;
                    operand = dotExpression;
                    break;
                case 'updateExpression':
                    const updateExpression = operation as IUpdateExpression;
                    updateExpression.operand = operand;
                    const updateTypeName = this.ctx.checkOperator(operand.typeName, updateExpression.operator, undefined);
                    if (!updateTypeName) {
                        throw new Error(`Type ${operand.typeName} cannot use update`);
                    }
                    updateExpression.typeName = updateTypeName;
                    operand = updateExpression;
                    break;
                default:
                    throw new Error(`Unsupported operation ${operation.type}`);
            }
        }
        return operand;
    }

    unaryExpression(ctx: CstChildrenDictionary) {
        const operand = this.visit(ctx.operand[0] as CstNode);
        const operator = ctx.operator ? (ctx.operator[0] as IToken).image : undefined;
        if (!operator) {
            return operand;
        }
        const typeName = this.ctx.checkOperator(undefined, operator, operand.typeName);
        if (!typeName) {
            throw new Error(`Type ${operand.typeName} cannot use operator ${operator}`);
        }
        const unaryExpression: IUnaryExpression = {
            type: 'unaryExpression',
            operator,
            operand,
            typeName,
        }
        return unaryExpression;
    }

    multiplicativeExpression(ctx: CstChildrenDictionary) {
        return this.left2right(ctx);
    }

    addtiveExpression(ctx: CstChildrenDictionary) {
        return this.left2right(ctx);
    }

    relationExpression(ctx: CstChildrenDictionary) {
        return this.left2right(ctx);
    }

    equalityExpression(ctx: CstChildrenDictionary) {
        return this.left2right(ctx);
    }

    andExpression(ctx: CstChildrenDictionary) {
        return this.left2right(ctx);
    }

    xorExpression(ctx: CstChildrenDictionary) {
        return this.left2right(ctx);
    }

    orExpression(ctx: CstChildrenDictionary) {
        return this.left2right(ctx);
    }

    conditionalExpression(ctx: CstChildrenDictionary) {
        const test = this.visit(ctx.test[0] as CstNode);
        if (!ctx.consequent || !ctx.alternate) {
            return test;
        }
        const consequent = this.visit(ctx.consequent[0] as CstNode);
        const alternate = this.visit(ctx.alternate[0] as CstNode);
        if (test.typeName !== 'bool') {
            throw new Error(`Type ${test.typeName} cannot use as condition`);
        }
        if (consequent.typeName !== alternate.typeName) {
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
        const expression: IBinaryExpression = this.right2left(ctx);
        if (
            expression.operator === '=' &&
            expression.left.type !== 'identifierReference'
        ) {
            throw new Error(`Only identifier can be assigned`);
        }
        return expression;
    }

    variableInitializer(ctx: CstChildrenDictionary) {
        const name = (ctx.name[0] as IToken).image;
        const init = ctx.init ? this.visit(ctx.init[0] as CstNode) : undefined;
        const arrayLength: IExpression | undefined = ctx.arrayLength ? this.visit(ctx.arrayLength[0] as CstNode) : undefined;
        if (arrayLength && arrayLength.typeName !== 'int') {
            throw new Error(`Type ${arrayLength.typeName} cannot use as array length`);
        }
        return {
            name,
            init,
            arrayLength,
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
            const { name, init, arrayLength } = this.visit(variable as CstNode);
            if (arrayLength && isConst) {
                throw new Error(`Const variable cannot be array`);
            }
            if (init && (init.typeName !== typeName)) {
                throw new Error(`Type ${init.typeName} cannot assign to ${typeName}`);
            }
            const variableDeclaration: IVariableDeclaration = {
                type: 'variableDeclaration',
                name: name,
                typeName: arrayLength ? `${typeName}[]` : typeName,
                percision,
                isConst,
                init,
                arrayLength,
            }
            this.ctx.setVariable(variableDeclaration);
            return variableDeclaration;
        });
        return variables;
    }

    expressionStatement(ctx: CstChildrenDictionary) {
        const expression = this.visit(ctx.expression[0] as CstNode);
        const expressionStatement: IExpressionStatement = {
            type: 'expressionStatement',
            expression,
        }
        return expressionStatement;
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

    doStatement(ctx: CstChildrenDictionary) {
        const body = this.visit(ctx.body[0] as CstNode);
        const test = this.visit(ctx.test[0] as CstNode);
        if (test.typeName !== 'bool') {
            throw new Error(`Type ${test.typeName} cannot use as condition`);
        }
        const doStatement: IDoStatement = {
            type: 'doStatement',
            body,
            test,
        }
        return doStatement;
    }

    whileStatement(ctx: CstChildrenDictionary) {
        const test = this.visit(ctx.test[0] as CstNode);
        if (test.typeName !== 'bool') {
            throw new Error(`Type ${test.typeName} cannot use as condition`);
        }
        const body = this.visit(ctx.body[0] as CstNode);
        const whileStatement: IWhileStatement = {
            type: 'whileStatement',
            test,
            body,
        }
        return whileStatement;
    }

    forStatement(ctx: CstChildrenDictionary) {
        this.ctx.addFunctionScope();
        const init = ctx.init ? this.visit(ctx.init[0] as CstNode) : undefined;
        const test = this.visit(ctx.test[0] as CstNode);
        if (test && test.typeName !== 'bool') {
            throw new Error(`Type ${test.typeName} cannot use as condition`);
        }
        const update = ctx.update ? this.visit(ctx.update[0] as CstNode) : undefined;
        const body = this.visit(ctx.body[0] as CstNode);
        const forStatement: IForStatement = {
            type: 'forStatement',
            init,
            test,
            update,
            body,
        }
        return forStatement;
    }

    ifStatement(ctx: CstChildrenDictionary) {
        const test = this.visit(ctx.test[0] as CstNode);
        if (test.typeName !== 'bool') {
            throw new Error(`Type ${test.typeName} cannot use as condition`);
        }
        const consequent = this.visit(ctx.consequent[0] as CstNode);
        const alternate = ctx.alternate ? this.visit(ctx.alternate[0] as CstNode) : undefined;
        const ifStatement: IIfStatement = {
            type: 'ifStatement',
            test,
            consequent,
            alternate,
        }
        return ifStatement;
    }

    switchCase(ctx: CstChildrenDictionary) {
        this.ctx.addScope();
        const test = ctx.test ? this.visit(ctx.test[0] as CstNode) : undefined;
        const consequent: IStatement[] = [];
        ctx.consequent?.forEach((statement) => consequent.push(...this.visit(statement as CstNode)));
        const switchCase: ISwitchCase = {
            type: 'switchCase',
            test,
            consequent,
        }
        this.ctx.popScope();
        return switchCase;
    }

    switchStatement(ctx: CstChildrenDictionary) {
        const discriminant = this.visit(ctx.discriminant[0] as CstNode);
        const cases: ISwitchCase[] = [];
        ctx.cases?.forEach((switchCase) => cases.push(this.visit(switchCase as CstNode)));
        const switchStatement: ISwitchStatement = {
            type: 'switchStatement',
            discriminant,
            cases,
        }
        return switchStatement;
    }

    returnStatement(ctx: CstChildrenDictionary) {
        const argument = ctx.argument ? this.visit(ctx.argument[0] as CstNode) : undefined;
        const returnStatement: IReturnStatement = {
            type: 'returnStatement',
            argument,
        }
        return returnStatement;
    }

    breakStatement(ctx: CstChildrenDictionary) {
        const breakStatement: IBreakStatement = {
            type: 'breakStatement',
        }
        return breakStatement;
    }

    continueStatement(ctx: CstChildrenDictionary) {
        const continueStatement: IContinueStatement = {
            type: 'continueStatement',
        }
        return continueStatement;
    }

    statement(ctx: CstChildrenDictionary) {
        const statement = this.visit(ctx.statement[0] as CstNode);
        return Array.isArray(statement) ? statement : [statement];
    }

    structMemberDeclaration(ctx: CstChildrenDictionary) {
        const percision: 'highp' | 'mediump' | 'lowp' | undefined = ctx.percision ? (ctx.percision[0] as IToken).image as 'highp' | 'mediump' | 'lowp' : undefined;
        const typeName: string = (ctx.typeName[0] as IToken).image;
        if (!this.ctx.getType(typeName)) {
            throw new Error(`Type ${typeName} is not defined`);
        };
        const arrayLength: IExpression | undefined = ctx.arrayLength ? this.visit(ctx.arrayLength[0] as CstNode) : undefined;

        const variables = ctx.variable.map((variable) => {
            const variableDeclaration: IVariableDeclaration = {
                type: 'variableDeclaration',
                name: (variable as IToken).image,
                typeName: arrayLength ? `${typeName}[]` : typeName,
                percision,
                arrayLength,
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
        rules.push({
            test: new RegExp(`^${name}\\(${members.map(member=>member.typeName).join(',')}\\)$`),
            returnType: name,
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
            const { name, init, arrayLength } = this.visit(variable as CstNode);
            if (arrayLength && constant) {
                throw new Error(`Const variable cannot be array`);
            }
            if (init && storage) {
                throw new Error(`${storage} variable cannot have init value`);
            }
            if (constant && !init) {
                throw new Error(`const variable must have init value`);
            }
            if (init && (init.typeName !== typeName)) {
                throw new Error(`Type ${init.typeName} cannot assign to ${typeName}`);
            }
            const variableDeclaration: IVariableDeclaration = {
                type: 'variableDeclaration',
                name: name,
                typeName: arrayLength ? `${typeName}[]` : typeName,
                percision,
                const: constant,
                storage,
                arrayLength,
                init,
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
        const arrayLength: IExpression | undefined = ctx.arrayLength ? this.visit(ctx.arrayLength[0] as CstNode) : undefined;
        const variableDeclaration: IVariableDeclaration = {
            type: 'variableDeclaration',
            name: (ctx.name[0] as IToken).image,
            typeName: arrayLength ? `${typeName}[]` : typeName,
            const: ctx.const ? true : false,
            storage: ctx.storage ? (ctx.storage[0] as IToken).image as 'in' | 'out' | 'inout' : undefined,
            percision: ctx.percision ? (ctx.percision[0] as IToken).image as 'lowp' | 'mediump' | 'highp' : undefined,
            arrayLength,
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

    percisionDefinition(ctx:CstChildrenDictionary){
        const percision = (ctx.percision[0] as IToken).image as 'lowp' | 'mediump' | 'highp';
        const typeName = (ctx.typeName[0] as IToken).image;
        if (!this.ctx.getType(typeName)) {
            throw new Error(`Type ${typeName} is not defined`);
        };
        this.ctx.setPercision(percision, typeName);
        return {
            type: 'percisionDefinition',
            percision,
            typeName,
        }
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