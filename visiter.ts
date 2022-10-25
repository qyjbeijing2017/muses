import { CstChildrenDictionary, CstNode, IToken } from "chevrotain";
import { MusesFallback } from "./ast/fallback";
import { MusesGLSL } from "./ast/glsl";
import { MusesAssignExpression } from "./ast/glsl/expression/assign-expression";
import { MusesConditionalExpression } from "./ast/glsl/expression/conditional-expression";
import { MusesIdentify } from "./ast/glsl/Identify";
import { MusesBinaryExpression } from "./ast/glsl/expression/binary-expression";
import { MusesFunctionDeclaration } from "./ast/glsl/function-declaration";
import { MusesTypeDeclaration } from "./ast/glsl/type-declaration";
import { MusesVariableDeclaration } from "./ast/glsl/variable-declaration";
import { MusesPass } from "./ast/pass";
import { MusesProperties } from "./ast/properties";
import { MusesShader } from "./ast/shader";
import { MusesSubShader } from "./ast/subshader";
import { musesParser } from "./parser";
import { MusesUnaryExpression } from "./ast/glsl/expression/unary-expression";
import { MusesDotExpression } from "./ast/glsl/expression/dot-expression";
import { MusesIndexExpression } from "./ast/glsl/expression/index-expression";
import { MusesCallExpression } from "./ast/glsl/expression/call-expression";
import { MusesUpdateExpression } from "./ast/glsl/expression/update-expression";
import { MusesVariableConstructor } from "./ast/glsl/variable-constructor";
import { MusesTokenName } from "./lexer";
import { MusesConstants } from "./ast/glsl/constants";
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

    createConst(token: IToken) {
        switch (token.tokenType.name) {
            case MusesTokenName.Identifier:
                const identifier = new MusesIdentify({ name: token.image });
                return identifier;
            case MusesTokenName.ConstInt:
                const int = parseInt(token.image);
                const cotVal = new MusesConstants({ type: new MusesTypeDeclaration({ name: "int" }), value: int });
                return cotVal;
            case MusesTokenName.ConstFloat:
                const float = parseFloat(token.image);
                const cotVal2 = new MusesConstants({ type: new MusesTypeDeclaration({ name: "float" }), value: float });
                return cotVal2;
            case MusesTokenName.True:
                const cotVal3 = new MusesConstants({ type: new MusesTypeDeclaration({ name: "bool" }), value: true });
                return cotVal3;
            case MusesTokenName.False:
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
        const args = ctx.args.map((expression) => {
            const conVal = this.createConst(expression as IToken);
            return conVal;
        });
        const variableConstrucor = new MusesVariableConstructor({ type, args });
        return variableConstrucor;
    }

    // #region expression
    parenExpression(ctx: CstChildrenDictionary) {
        return this.visit(ctx.expression[0] as CstNode);
    }

    atomicExpression(ctx: CstChildrenDictionary) {
        if (ctx.subExpression) {
            return this.visit(ctx.subExpression[0] as CstNode);
        } else {
            const token = ctx.const[0] as IToken;
            const conVal = this.createConst(token);
            return conVal;
        }
    }

    indexExpression(ctx: CstChildrenDictionary) {
        const index = this.visit(ctx.index[0] as CstNode);
        return index;
    }

    callExpression(ctx: CstChildrenDictionary) {
        const args = ctx.args.map((expression) => {
            return this.visit(expression as CstNode);
        });
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

    // #region declaration
    storageDeclaration(ctx: CstChildrenDictionary) {
        const storage = (ctx.name[0] as IToken).image;
        return storage;
    }

    percisionDeclaration(ctx: CstChildrenDictionary) {
        const percision = (ctx.name[0] as IToken).image;
        return percision;
    }

    variableAssignment(ctx: CstChildrenDictionary) {
        const name = (ctx.name[0] as IToken).image;
        let value: any = undefined;
        if(ctx.value){
            value = this.visit(ctx.value[0] as CstNode);
        }
        return {
            name,
            value
        };
    }

    variableDeclaration(ctx: CstChildrenDictionary) {
        const type = this.visit(ctx.type[0] as CstNode);
        const storage = ctx.storage ? this.visit(ctx.storage[0] as CstNode) : undefined;
        const percision = ctx.percision ? this.visit(ctx.percision[0] as CstNode) : undefined;
        const delclarations: MusesVariableDeclaration[] = [];
        for (let index = 0; index < ctx.assignment.length; index++) {
            const {name, value} = this.visit(ctx.assignment[index] as CstNode);
            const variableDeclaration = new MusesVariableDeclaration({ name, type, storage, percision, value });
            delclarations.push(variableDeclaration);
        }
        return delclarations;
    }

    functionDeclaration(ctx: CstChildrenDictionary) {
        const returnType = this.visit(ctx.returnType[0] as CstNode);
        const name = (ctx.name[0] as IToken).image;
        const body = ctx.body.map((statement) => this.visit(statement as CstNode));
        const functionDeclaration = new MusesFunctionDeclaration({ returnType, name, body });
        return functionDeclaration;
    }
    // #endregion

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