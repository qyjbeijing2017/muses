import { CstChildrenDictionary, CstNode, IToken } from "chevrotain";
import { MusesGLSL } from "./ast/glsl";
import { MusesIdentify } from "./ast/glsl/Identify";
import { MusesFunctionDeclaration } from "./ast/glsl/function-declaration";
import { MusesTypeDeclaration } from "./ast/glsl/type-declaration";
import { MusesGLSLParmerters, MusesGLSLStorage, MusesVariableDeclaration } from "./ast/glsl/variable-declaration";
import { glslParser } from "./parser";
import { MusesConstants } from "./ast/glsl/constants";
import { MusesStructDeclaration } from "./ast/glsl/struct-declaration";
import { MusesIfStatement } from "./ast/glsl/statement/if-statement";
import { MusesWhileStatement } from "./ast/glsl/statement/while-statement";
import { MusesDoWhileStatement } from "./ast/glsl/statement/dowhile-statement";
import { MusesForStatement } from "./ast/glsl/statement/for-statement";
import { MusesExpressionStatement } from "./ast/glsl/statement/expression-statement";
import { MusesRetrunStatement } from "./ast/glsl/statement/return-statement";
import { MusesBreakStatement } from "./ast/glsl/statement/break-statement";
import { MusesContinueStatement } from "./ast/glsl/statement/continue-statement";
import { MusesVariableConstructor } from "./ast/glsl/expression/variable-constructor";
import { MusesDotExpression } from "./ast/glsl/expression/dot-expression";
import { MusesIndexExpression } from "./ast/glsl/expression/index-expression";
import { MusesCallExpression } from "./ast/glsl/expression/call-expression";
import { MusesUpdateExpression } from "./ast/glsl/expression/update-expression";
import { MusesUnaryExpression } from "./ast/glsl/expression/unary-expression";
import { MusesBinaryExpression } from "./ast/glsl/expression/binary-expression";
import { MusesConditionalExpression } from "./ast/glsl/expression/conditional-expression";
import { MusesAssignExpression } from "./ast/glsl/expression/assign-expression";

const CstVisiter = glslParser.getBaseCstVisitorConstructor();

export class GlslVisitor extends CstVisiter {
    constructor() {
        super();
        this.validateVisitor();
    }

    // #region GLSL
    createConst(token: IToken) {
        switch (token.tokenType.name) {
            case 'Identifier':
                const identifier = new MusesIdentify({ name: token.image });
                return identifier;
            case 'IntLiterial':
                const int = parseInt(token.image);
                const cotVal = new MusesConstants({ type: new MusesTypeDeclaration({ name: "int" }), value: int });
                return cotVal;
            case 'FloatLiterial':
                const float = parseFloat(token.image);
                const cotVal2 = new MusesConstants({ type: new MusesTypeDeclaration({ name: "float" }), value: float });
                return cotVal2;
            case 'True':
                const cotVal3 = new MusesConstants({ type: new MusesTypeDeclaration({ name: "bool" }), value: true });
                return cotVal3;
            case 'False':
                const cotVal4 = new MusesConstants({ type: new MusesTypeDeclaration({ name: "bool" }), value: false });
                return cotVal4;
            default:
                throw new Error(`Invalid constant token, at line ${token.startLine} column ${token.startColumn}`);
        }
    }

    typeDeclaration(ctx: CstChildrenDictionary) {
        const name = (ctx.name[0] as IToken).image;
        const typeDeclaration = new MusesTypeDeclaration({ name });
        return typeDeclaration;
    }

    variableConstrucor(ctx: CstChildrenDictionary) {
        if (!ctx.args) {
            const token = (ctx.type[0] as CstNode).children.name[0] as IToken;
            if (token.tokenType.name !== "Identifier") {
                throw new Error(`Invalid variable constructor, at line ${token.startLine} column ${token.startColumn}`);
            }
            const name = token.image;
            return new MusesIdentify({ name });
        }
        const type = this.visit(ctx.type[0] as CstNode) as MusesTypeDeclaration;
        const size = ctx.size ? this.visit(ctx.size[0] as CstNode) as MusesConstants : undefined;
        const args = ctx.args.map((expression) => {
            const conVal = this.createConst(expression as IToken);
            return conVal;
        });
        const variableConstrucor = new MusesVariableConstructor({ type, args, size });
        return variableConstrucor;
    }

    // #region expression
    parenExpression(ctx: CstChildrenDictionary) {
        return this.visit(ctx.expression[0] as CstNode);
    }

    atomicExpression(ctx: CstChildrenDictionary) {
        if (ctx.subExpression) {
            return this.visit(ctx.subExpression[0] as CstNode);
        } else if (ctx.type) {
            const type: MusesTypeDeclaration = this.visit(ctx.type[0] as CstNode);
            return new MusesIdentify({ name: type.name });
        } else {
            const token = ctx.const[0] as IToken;
            const conVal = this.createConst(token);
            return conVal;
        }
    }

    indexExpression(ctx: CstChildrenDictionary) {
        const index = ctx.index ? this.visit(ctx.index[0] as CstNode) : undefined;
        return index;
    }

    callExpression(ctx: CstChildrenDictionary) {
        const args = ctx.args?.map((expression) => {
            return this.visit(expression as CstNode);
        }) || [];
        return args;
    }

    dotExpression(ctx: CstChildrenDictionary) {
        const name = (ctx.Identifier[0] as IToken).image;
        const identifier = new MusesIdentify({ name });
        return identifier;
    }

    updateExpression(ctx: CstChildrenDictionary) {
        const operator = (ctx.operator[0] as IToken).image;
        return operator;
    }

    postfixExpression(ctx: CstChildrenDictionary) {
        let object = this.visit(ctx.argument[0] as CstNode);
        if (!ctx.operator) {
            return object;
        }
        for (let i = 0; i < ctx.operator.length; i++) {
            const operator = ctx.operator[i] as CstNode;
            switch (operator.name) {
                case "dotExpression":
                    const property = this.visit(operator);
                    object = new MusesDotExpression({ property, object });
                    break;
                case "indexExpression":
                    const index = this.visit(operator);
                    object = new MusesIndexExpression({ index, object });
                    break;
                case "callExpression":
                    const argument = this.visit(operator);
                    object = new MusesCallExpression({ arguments: argument, callee: object });
                    break;
                case "updateExpression":
                    const updateOperator = this.visit(operator);
                    object = new MusesUpdateExpression({ operator: updateOperator, object });
                    break;
                default:
                    throw new Error("Unknown operator");
            }
        }
        return object;
    }

    unaryExpression(ctx: CstChildrenDictionary) {
        const argument = this.visit(ctx.argument[0] as CstNode);
        if (!ctx.operator) {
            return argument;
        }
        const operator = (ctx.operator[0] as IToken).image;
        const unaryExpression = new MusesUnaryExpression({ operator, argument });
        return unaryExpression;
    }

    multiplicativeExpression(ctx: CstChildrenDictionary) {
        let left = this.visit(ctx.left[0] as CstNode);
        if (!ctx.operator) {
            return left;
        }
        for (let i = 0; i < ctx.operator.length; i++) {
            const operator = (ctx.operator[i] as IToken).image;
            const right = this.visit(ctx.right[i] as CstNode);
            const binaryExpression = new MusesBinaryExpression({ left, operator, right });
            left = binaryExpression;
        }
        return left;
    }

    addtiveExpression(ctx: CstChildrenDictionary) {
        let left = this.visit(ctx.left[0] as CstNode);
        if (!ctx.operator) {
            return left;
        }
        for (let i = 0; i < ctx.operator.length; i++) {
            const operator = (ctx.operator[i] as IToken).image;
            const right = this.visit(ctx.right[i] as CstNode);
            const binaryExpression = new MusesBinaryExpression({ left, operator, right });
            left = binaryExpression;
        }
        return left;
    }

    relationExpression(ctx: CstChildrenDictionary) {
        let left = this.visit(ctx.left[0] as CstNode);
        if (!ctx.operator) {
            return left;
        }
        for (let i = 0; i < ctx.operator.length; i++) {
            const operator = (ctx.operator[i] as IToken).image;
            const right = this.visit(ctx.right[i] as CstNode);
            const binaryExpression = new MusesBinaryExpression({ left, operator, right });
            left = binaryExpression;
        }
        return left;
    }

    equalityExpression(ctx: CstChildrenDictionary) {
        let left = this.visit(ctx.left[0] as CstNode);
        if (!ctx.operator) {
            return left;
        }
        for (let i = 0; i < ctx.operator.length; i++) {
            const operator = (ctx.operator[i] as IToken).image;
            const right = this.visit(ctx.right[i] as CstNode);
            const binaryExpression = new MusesBinaryExpression({ left, operator, right });
            left = binaryExpression;
        }
        return left;
    }

    andExpression(ctx: CstChildrenDictionary) {
        let left = this.visit(ctx.left[0] as CstNode);
        if (!ctx.operator) {
            return left;
        }
        for (let i = 0; i < ctx.operator.length; i++) {
            const operator = (ctx.operator[i] as IToken).image;
            const right = this.visit(ctx.right[i] as CstNode);
            const binaryExpression = new MusesBinaryExpression({ left, operator, right });
            left = binaryExpression;
        }
        return left;
    }

    xorExpression(ctx: CstChildrenDictionary) {
        let left = this.visit(ctx.left[0] as CstNode);
        if (!ctx.operator) {
            return left;
        }
        for (let i = 0; i < ctx.operator.length; i++) {
            const operator = (ctx.operator[i] as IToken).image;
            const right = this.visit(ctx.right[i] as CstNode);
            const binaryExpression = new MusesBinaryExpression({ left, operator, right });
            left = binaryExpression;
        }
        return left;
    }

    orExpression(ctx: CstChildrenDictionary) {
        let left = this.visit(ctx.left[0] as CstNode);
        if (!ctx.operator) {
            return left;
        }
        for (let i = 0; i < ctx.operator.length; i++) {
            const operator = (ctx.operator[i] as IToken).image;
            const right = this.visit(ctx.right[i] as CstNode);
            const binaryExpression = new MusesBinaryExpression({ left, operator, right });
            left = binaryExpression;
        }
        return left;
    }

    conditionalExpression(ctx: CstChildrenDictionary) {
        const testExpression = this.visit(ctx.testExpression[0] as CstNode);
        if (!ctx.trueExpression) {
            return testExpression;
        }
        const trueExpression = this.visit(ctx.trueExpression[0] as CstNode);
        const falseExpression = this.visit(ctx.falseExpression[0] as CstNode);

        const conditionalExpression = new MusesConditionalExpression({ testExpression, trueExpression, falseExpression });
        return conditionalExpression;
    }

    assignExpression(ctx: CstChildrenDictionary) {
        const left = this.visit(ctx.left[0] as CstNode);
        if (!ctx.operator) {
            return left;
        }
        const operator = (ctx.operator[0] as IToken).image;
        const right = this.visit(ctx.right[0] as CstNode);
        const assignExpression = new MusesAssignExpression({ left, operator, right });
        return assignExpression;
    }
    // #endregion

    // #region statements
    blockStatement(ctx: CstChildrenDictionary) {
        const statements = ctx.statement?.map((statement) => this.visit(statement as CstNode)) || [];
        const statementsOut: any[] = [];
        statements.forEach((statement) => {
            if (Array.isArray(statement)) {
                statementsOut.push(...statement);
            } else {
                statementsOut.push(statement);
            }
        });
        return statementsOut;
    }

    ifStatement(ctx: CstChildrenDictionary) {
        const test = this.visit(ctx.test[0] as CstNode);
        const consequent = this.visit(ctx.consequent[0] as CstNode);
        const alternate = ctx.alternate ? this.visit(ctx.alternate[0] as CstNode) : undefined;
        const ifStatement = new MusesIfStatement({ test, consequent, alternate });
        return ifStatement;
    }

    whileStatement(ctx: CstChildrenDictionary) {
        const test = this.visit(ctx.testExpression[0] as CstNode);
        const body = this.visit(ctx.statement[0] as CstNode);
        const whileStatement = new MusesWhileStatement({ test, body });
        return whileStatement;
    }

    doWhileStatement(ctx: CstChildrenDictionary) {
        const test = this.visit(ctx.testExpression[0] as CstNode);
        const body = this.visit(ctx.statement[0] as CstNode);
        const doWhileStatement = new MusesDoWhileStatement({ test, body });
        return doWhileStatement;
    }

    forStatement(ctx: CstChildrenDictionary) {
        const init = ctx.init ? this.visit(ctx.init[0] as CstNode) : undefined;
        const test = this.visit(ctx.test[0] as CstNode);
        const update = ctx.update ? this.visit(ctx.update[0] as CstNode) : undefined;
        const body = this.visit(ctx.statement[0] as CstNode);
        const forStatement = new MusesForStatement({ init, test, update, body });
        return forStatement;
    }

    expressionStatement(ctx: CstChildrenDictionary) {
        const expression = this.visit(ctx.expression[0] as CstNode);
        const expressionStatement = new MusesExpressionStatement({ expression });
        return expressionStatement;
    }

    returnStatement(ctx: CstChildrenDictionary) {
        const argument = ctx.argument ? this.visit(ctx.argument[0] as CstNode) : undefined;
        const returnStatement = new MusesRetrunStatement({ argument });
        return returnStatement;
    }

    breakStatement(ctx: CstChildrenDictionary) {
        const breakStatement = new MusesBreakStatement();
        return breakStatement;
    }

    continueStatement(ctx: CstChildrenDictionary) {
        const continueStatement = new MusesContinueStatement();
        return continueStatement;
    }
    // #endregion

    // #region declaration
    structMemberDeclaration(ctx: CstChildrenDictionary) {
        const type = this.visit(ctx.type[0] as CstNode);
        const percision = ctx.percision ? this.visit(ctx.percision[0] as CstNode) : undefined;
        const name = (ctx.name[0] as IToken).image;
        const variableDeclaration = new MusesVariableDeclaration({ name, type, percision });
        return variableDeclaration;
    }

    structDeclaration(ctx: CstChildrenDictionary) {
        const name = (ctx.name[0] as IToken).image;
        const members = ctx.members?.map((member) => this.visit(member as CstNode)) || [];
        const structDeclaration = new MusesStructDeclaration({ name, members });
        const outArray: (MusesStructDeclaration | MusesVariableDeclaration)[] = [structDeclaration];
        const type = new MusesTypeDeclaration({ name });
        if (ctx.variables) {
            const variables = ctx.variables.map((variable) => {
                const { name, value, size, } = this.visit(variable as CstNode);
                return new MusesVariableDeclaration({ name, type, value, size });
            });
            outArray.push(...variables);
        }
        return outArray;
    }

    storageDeclaration(ctx: CstChildrenDictionary) {
        const storage = (ctx.name[0] as IToken).image;
        return storage;
    }

    percisionDeclaration(ctx: CstChildrenDictionary) {
        const percision = (ctx.name[0] as IToken).image;
        return percision;
    }

    sizeDeclaration(ctx: CstChildrenDictionary) {
        const size = ctx.size ? this.visit(ctx.size[0] as CstNode) : undefined;
        return size;
    }

    variableAssignment(ctx: CstChildrenDictionary) {
        const name = (ctx.name[0] as IToken).image;
        let value: any = undefined;
        if (ctx.value) {
            value = this.visit(ctx.value[0] as CstNode);
        }
        const size = ctx.size ? this.visit(ctx.size[0] as CstNode) : undefined;
        return {
            name,
            value,
            size,
        };
    }

    variableDeclaration(ctx: CstChildrenDictionary) {
        const type = this.visit(ctx.type[0] as CstNode) as MusesTypeDeclaration;
        const storage = ctx.storage ? this.visit(ctx.storage[0] as CstNode) : undefined;
        const percision = ctx.percision ? this.visit(ctx.percision[0] as CstNode) : undefined;
        const delclarations: MusesVariableDeclaration[] = [];
        for (let index = 0; index < ctx.assignment.length; index++) {
            const { name, value, size } = this.visit(ctx.assignment[index] as CstNode);
            const variableDeclaration = new MusesVariableDeclaration({ name, type, storage, percision, value, size });
            delclarations.push(variableDeclaration);
        }
        return delclarations;
    }

    functionParameterDeclaration(ctx: CstChildrenDictionary) {
        const type = this.visit(ctx.type[0] as CstNode);
        const name = (ctx.name[0] as IToken).image;
        const storage = ctx.storage ? MusesGLSLStorage.const : undefined;
        const percision = ctx.percision ? this.visit(ctx.percision[0] as CstNode) : undefined;
        const parameters = ctx.parameters ? (ctx.parameters[0] as IToken).image as MusesGLSLParmerters : undefined;
        const parameterDeclaration = new MusesVariableDeclaration({ name, type, percision, parameters, storage });
        return parameterDeclaration;
    }

    functionDeclaration(ctx: CstChildrenDictionary) {
        const returnType = this.visit(ctx.returnType[0] as CstNode);
        const name = (ctx.name[0] as IToken).image;
        const body = this.visit(ctx.body[0] as CstNode);
        const parameters = ctx.parameters?.map((parameter) => this.visit(parameter as CstNode)) || [];
        const functionDeclaration = new MusesFunctionDeclaration({ returnType, name, body, parameters });
        return functionDeclaration;
    }
    // #endregion

    glsl(ctx: CstChildrenDictionary) {
        const body = ctx.body.map((statement) => this.visit(statement as CstNode));
        const bodyStatements: any[] = [];
        body.forEach((statement) => {
            if (Array.isArray(statement)) {
                bodyStatements.push(...statement);
            } else {
                bodyStatements.push(statement);
            }
        });

        const glsl = new MusesGLSL({
            body: bodyStatements,
        });
        return glsl;
    }
    // #endregion
}

export const glslVisitor = new GlslVisitor();