import { IAstNode } from "./ast-interface/ast-node";
import { IFunctionDeclaration } from "./ast-interface/declaration/function-declaration";
import { IStructDeclaration } from "./ast-interface/declaration/struct-declaration";
import { IVariableDeclaration } from "./ast-interface/declaration/variable-declaration";
import { IReturnStatement } from "./ast-interface/statement/return-statement";
import { IBlockStatement } from "./ast-interface/statement/block-statement";
import { IWhileStatement } from "./ast-interface/statement/loop/while-statement";
import { IForStatement } from "./ast-interface/statement/loop/for-statement";
import { IDoStatement } from "./ast-interface/statement/loop/do-statement";
import { ISwitchCase, ISwitchStatement } from "./ast-interface/statement/brench/switch-statement";
import { IIfStatement } from "./ast-interface/statement/brench/if-statement";
import { IProgram } from "./ast-interface/program";
import { IUpdateExpression } from "./ast-interface/expression/update-expression";
import { IUnaryExpression } from "./ast-interface/expression/unary-expression";
import { IIndexExpression } from "./ast-interface/expression/index-expression";
import { IDotExpression } from "./ast-interface/expression/dot-expression";
import { IConditionalExpression } from "./ast-interface/expression/conditional-expression";
import { ICallExpression } from "./ast-interface/expression/call-expression";
import { IBinaryExpression } from "./ast-interface/expression/binary-expression";
import { IIdentifierReference } from "./ast-interface/expression/identifier-reference";
import { ILiterial } from "./ast-interface/expression/literial";
import { ITypeConstructor } from "./ast-interface/expression/type-constructor";
import { IBreakStatement } from "./ast-interface/statement/break-statement";
import { IExpressionStatement } from "./ast-interface/statement/expression-statement";
import { IPercisionDefinition } from "./ast-interface/statement/percision-definition";

let generator: { [key: string]: (node: IAstNode) => string } = {};

export function generateCode(node: IAstNode) {
    if (generator[node.type]) {
        return generator[node.type](node);
    }
    throw new Error(`Unsupported node type ${node.type}`);
}

function binaryExpression(node: IAstNode) {
    const binaryExpression = node as IBinaryExpression;
    return `${generateCode(binaryExpression.left)} ${binaryExpression.operator} ${generateCode(binaryExpression.right)}`;
}
generator.binaryExpression = binaryExpression;

function callExpression(node: IAstNode) {
    const callExpression = node as ICallExpression;
    const args = callExpression.params.map((arg) => generateCode(arg)).join(', ');
    return `${generateCode(callExpression.callee)}(${args})`;
}
generator.callExpression = callExpression;

function conditionalExpression(node: IAstNode) {
    const conditionalExpression = node as IConditionalExpression;
    return `${generateCode(conditionalExpression.test)} ? ${generateCode(conditionalExpression.consequent)} : ${generateCode(conditionalExpression.alternate)}`;
}
generator.conditionalExpression = conditionalExpression;

function dotExpression(node: IAstNode) {
    const dotExpression = node as IDotExpression;
    return `${generateCode(dotExpression.operand)}.${generateCode(dotExpression.member)}`;
}
generator.dotExpression = dotExpression;

function identifierReference(node: IAstNode) {
    const identifierReference = node as IIdentifierReference;
    return identifierReference.name;
}
generator.identifierReference = identifierReference;

function indexExpression(node: IAstNode) {
    const indexExpression = node as IIndexExpression;
    return `${generateCode(indexExpression.operand)}[${generateCode(indexExpression.index)}]`;
}
generator.indexExpression = indexExpression;

function literial(node: IAstNode) {
    const literial = node as ILiterial;
    return literial.value;
}
generator.literial = literial;

function typeConstructor(node: IAstNode) {
    const typeConstructor = node as ITypeConstructor;
    const args = typeConstructor.params.map((arg) => generateCode(arg)).join(', ');
    return `${typeConstructor.typeName}(${args})`;
}
generator.typeConstructor = typeConstructor;

function unaryExpression(node: IAstNode) {
    const unaryExpression = node as IUnaryExpression;
    return `${unaryExpression.operator}${generateCode(unaryExpression.operand)}`;
}
generator.unaryExpression = unaryExpression;

function updateExpression(node: IAstNode) {
    const updateExpression = node as IUpdateExpression;
    return `${updateExpression.operator}${generateCode(updateExpression.operand)}`;
}
generator.updateExpression = updateExpression;

function ifStatement(node: IAstNode) {
    const ifStatement = node as IIfStatement;
    let code = `if (${generateCode(ifStatement.test)}) ${generateCode(ifStatement.consequent)}`;
    if (ifStatement.alternate) {
        code += ` else ${generateCode(ifStatement.alternate)}`;
    }
    return code;
}
generator.ifStatement = ifStatement;

function switchCase(node: IAstNode) {
    const switchCase = node as ISwitchCase;
    const statements = switchCase.consequent.map((s) => generateCode(s)).join(`\n`);
    return `${switchCase.test ? 'case ' + generateCode(switchCase.test) : 'default '}:\n${statements}`;
}
generator.switchCase = switchCase;

function switchStatement(node: IAstNode) {
    const switchStatement = node as ISwitchStatement;
    const cases = switchStatement.cases.map((c) => generateCode(c)).join(`\n`);
    return `switch (${generateCode(switchStatement.discriminant)}) {\n${cases}\n}`;
}
generator.switchStatement = switchStatement;


function doStatement(node: IAstNode) {
    const doStatement = node as IDoStatement;
    return `do ${generateCode(doStatement.body)} while (${generateCode(doStatement.test)});`;
}
generator.doStatement = doStatement;

function forStatement(node: IAstNode) {
    const forStatement = node as IForStatement;
    return `for (${forStatement.init ? generateCode(forStatement.init) : ';'} ${generateCode(forStatement.test)}; ${forStatement.update ? generateCode(forStatement.update) : ''}) ${generateCode(forStatement.body)}`;
}
generator.forStatement = forStatement;

function whileStatement(node: IAstNode) {
    const whileStatement = node as IWhileStatement;
    return `while (${generateCode(whileStatement.test)}) ${generateCode(whileStatement.body)}`;
}
generator.whileStatement = whileStatement;

function blockStatement(node: IAstNode) {
    const blockStatement = node as IBlockStatement;
    const statements = blockStatement.body.map((s) => generateCode(s)).join(`\n`);
    return `{\n${statements}\n}`;
}
generator.blockStatement = blockStatement;

function breakStatement(node: IAstNode) {
    return `break;`;
}
generator.breakStatement = breakStatement;

function continueStatement(node: IAstNode) {
    return `continue;`;
}
generator.continueStatement = continueStatement;

function expressionStatement(node: IAstNode) {
    const expressionStatement = node as IExpressionStatement;
    return `${generateCode(expressionStatement.expression)};`;
}
generator.expressionStatement = expressionStatement;

function percisionDefinition(node: IAstNode) {
    const percisionDefinition = node as IPercisionDefinition;
    return `precision ${percisionDefinition.precision} ${percisionDefinition.typeName}`;
}
generator.percisionDefinition = percisionDefinition;

function returnStatement(node: IAstNode) {
    const returnStatement = node as IReturnStatement;
    return `return ${returnStatement.argument ? generateCode(returnStatement.argument) : ''};`;
}
generator.returnStatement = returnStatement;

function variableDeclaration(node: IAstNode) {
    const variableDeclaration = node as IVariableDeclaration;
    const constant = variableDeclaration.constant ? 'const ' : '';
    const storage = variableDeclaration.storage ? variableDeclaration.storage + ' ' : '';
    const percision = variableDeclaration.percision ? variableDeclaration.percision + ' ' : '';
    const typeName = variableDeclaration.typeName;
    const name = variableDeclaration.name;
    const initializer = variableDeclaration.initializer ? ' = ' + generateCode(variableDeclaration.initializer) : '';
    return `${constant}${storage}${percision}${typeName} ${name}${initializer};`;
}
generator.variableDeclaration = variableDeclaration;

function structDeclaration(node: IAstNode) {
    const structDeclaration = node as IStructDeclaration;
    const fields = structDeclaration.members.map((f) => generateCode(f)).join(`\n`);
    return `struct ${structDeclaration.name} {\n${fields}\n}`;
}
generator.structDeclaration = structDeclaration;

function functionDeclaration(node: IAstNode) {
    const functionDeclaration = node as IFunctionDeclaration;
    const returnTypeName = functionDeclaration.returnTypeName;
    const name = functionDeclaration.name;
    const parameters = functionDeclaration.parameters.map((p) => generateCode(p).replace(';', '')).join(', ');
    const body = functionDeclaration.body ? generateCode(functionDeclaration.body) : null;
    return `${returnTypeName} ${name}(${parameters})${body ? body : ';'}`;
}
generator.functionDeclaration = functionDeclaration;

function program(node: IAstNode) {
    const program = node as IProgram;
    const statements = program.statements.map((s) => generateCode(s)).join(`\n`);
    return `${statements}`;
}
generator.program = program;