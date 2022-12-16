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
import { ITypeConstructor } from "./ast-interface/expression/type-constructor";

export interface IAstVisitor {
    [key: string]: {
        enter?: (node: IAstNode) => void;
        leave?: (node: IAstNode) => void;
    }
}
let visitors: {[key:string]: (node: IAstNode, visitor: IAstVisitor) => void} = {};

export function visit(node: IAstNode, visitor: IAstVisitor) {
    if (visitors[node.type]) {
        visitors[node.type](node, visitor);
    }
}

function binaryExpression(node: IAstNode, visitor: IAstVisitor) {
    if (visitor.binaryExpression?.enter) {
        visitor.binaryExpression.enter(node);
    }
    const binaryExpression = node as IBinaryExpression;
    visit(binaryExpression.left, visitor);
    visit(binaryExpression.right, visitor);
    if (visitor.binaryExpression?.leave) {
        visitor.binaryExpression.leave(node);
    }
}
visitors.binaryExpression = binaryExpression;

function callExpression(node: IAstNode, visitor: IAstVisitor) {
    if (visitor.callExpression?.enter) {
        visitor.callExpression.enter(node);
    }
    const callExpression = node as ICallExpression;
    visit(callExpression.callee, visitor);
    callExpression.params.forEach((argument) => {
        visit(argument, visitor);
    });
    if (visitor.callExpression?.leave) {
        visitor.callExpression.leave(node);
    }
}
visitors.callExpression = callExpression;

function conditionalExpression(node: IAstNode, visitor: IAstVisitor) {
    if (visitor.conditionalExpression?.enter) {
        visitor.conditionalExpression.enter(node);
    }
    const conditionalExpression = node as IConditionalExpression;
    visit(conditionalExpression.test, visitor);
    visit(conditionalExpression.consequent, visitor);
    visit(conditionalExpression.alternate, visitor);
    if (visitor.conditionalExpression?.leave) {
        visitor.conditionalExpression.leave(node);
    }
}
visitors.conditionalExpression = conditionalExpression;

function dotExpression(node: IAstNode, visitor: IAstVisitor) {
    if (visitor.dotExpression?.enter) {
        visitor.dotExpression.enter(node);
    }
    const dotExpression = node as IDotExpression;
    visit(dotExpression.member, visitor);
    visit(dotExpression.operand, visitor);
    if (visitor.dotExpression?.leave) {
        visitor.dotExpression.leave(node);
    }
}
visitors.dotExpression = dotExpression;

function identifierReference(node: IAstNode, visitor: IAstVisitor) {
    if (visitor.identifierReference?.enter) {
        visitor.identifierReference.enter(node);
    }
    if (visitor.identifierReference?.leave) {
        visitor.identifierReference.leave(node);
    }
}
visitors.identifierReference = identifierReference;

function indexExpression(node: IAstNode, visitor: IAstVisitor) {
    if (visitor.indexExpression?.enter) {
        visitor.indexExpression.enter(node);
    }
    const indexExpression = node as IIndexExpression;
    visit(indexExpression.index, visitor);
    visit(indexExpression.operand, visitor);
    if (visitor.indexExpression?.leave) {
        visitor.indexExpression.leave(node);
    }
}
visitors.indexExpression = indexExpression;

function literial(node: IAstNode, visitor: IAstVisitor) {
    if (visitor.literial?.enter) {
        visitor.literial.enter(node);
    }
    if (visitor.literial?.leave) {
        visitor.literial.leave(node);
    }
}
visitors.literial = literial;

function typeConstructor(node: IAstNode, visitor: IAstVisitor) {
    if (visitor.typeConstructor?.enter) {
        visitor.typeConstructor.enter(node);
    }
    const typeConstructor = node as ITypeConstructor;
    typeConstructor.params.forEach((argument) => {
        visit(argument, visitor);
    });
    if (visitor.typeConstructor?.leave) {
        visitor.typeConstructor.leave(node);
    }
}
visitors.typeConstructor = typeConstructor;

function unaryExpression(node: IAstNode, visitor: IAstVisitor) {
    if (visitor.unaryExpression?.enter) {
        visitor.unaryExpression.enter(node);
    }
    const unaryExpression = node as IUnaryExpression;
    visit(unaryExpression.operand, visitor);
    if (visitor.unaryExpression?.leave) {
        visitor.unaryExpression.leave(node);
    }
}
visitors.unaryExpression = unaryExpression;

function updateExpression(node: IAstNode, visitor: IAstVisitor) {
    if (visitor.updateExpression?.enter) {
        visitor.updateExpression.enter(node);
    }
    const updateExpression = node as IUpdateExpression;
    visit(updateExpression.operand, visitor);
    if (visitor.updateExpression?.leave) {
        visitor.updateExpression.leave(node);
    }
}
visitors.updateExpression = updateExpression;

function ifStatement(node: IAstNode, visitor: IAstVisitor) {
    if (visitor.ifStatement?.enter) {
        visitor.ifStatement.enter(node);
    }
    const ifStatement = node as IIfStatement;
    visit(ifStatement.test, visitor);
    visit(ifStatement.consequent, visitor);
    if (ifStatement.alternate) {
        visit(ifStatement.alternate, visitor);
    }
    if (visitor.ifStatement?.leave) {
        visitor.ifStatement.leave(node);
    }
}
visitors.ifStatement = ifStatement;

function switchCase(node: IAstNode, visitor: IAstVisitor) {
    if (visitor.switchCase?.enter) {
        visitor.switchCase.enter(node);
    }
    const switchCase = node as ISwitchCase;
    if (switchCase.test) {
        visit(switchCase.test, visitor);
    }
    switchCase.consequent.forEach(statement => {
        visit(statement, visitor);
    });
    if (visitor.switchCase?.leave) {
        visitor.switchCase.leave(node);
    }
}
visitors.switchCase = switchCase;

function switchStatement(node: IAstNode, visitor: IAstVisitor) {
    if (visitor.switchStatement?.enter) {
        visitor.switchStatement.enter(node);
    }
    const switchStatement = node as ISwitchStatement;
    visit(switchStatement.discriminant, visitor);
    switchStatement.cases.forEach(switchCase => {
        visit(switchCase, visitor);
    });
    if (visitor.switchStatement?.leave) {
        visitor.switchStatement.leave(node);
    }
}
visitors.switchStatement = switchStatement;

function doStatement(node: IAstNode, visitor: IAstVisitor) {
    if (visitor.doStatement?.enter) {
        visitor.doStatement.enter(node);
    }
    const doStatement = node as IDoStatement;
    visit(doStatement.body, visitor);
    visit(doStatement.test, visitor);
    if (visitor.doStatement?.leave) {
        visitor.doStatement.leave(node);
    }
}
visitors.doStatement = doStatement;

function forStatement(node: IAstNode, visitor: IAstVisitor) {
    if (visitor.forStatement?.enter) {
        visitor.forStatement.enter(node);
    }
    const forStatement = node as IForStatement;
    if (forStatement.init) {
        visit(forStatement.init, visitor);
    }
    visit(forStatement.test, visitor);
    if (forStatement.update) {
        visit(forStatement.update, visitor);
    }
    visit(forStatement.body, visitor);
    if (visitor.forStatement?.leave) {
        visitor.forStatement.leave(node);
    }
}
visitors.forStatement = forStatement;

function whileStatement(node: IAstNode, visitor: IAstVisitor) {
    if (visitor.whileStatement?.enter) {
        visitor.whileStatement.enter(node);
    }
    const whileStatement = node as IWhileStatement;
    visit(whileStatement.test, visitor);
    visit(whileStatement.body, visitor);
    if (visitor.whileStatement?.leave) {
        visitor.whileStatement.leave(node);
    }
}
visitors.whileStatement = whileStatement;

function blockStatement(node: IAstNode, visitor: IAstVisitor) {
    if (visitor.blockStatement?.enter) {
        visitor.blockStatement.enter(node);
    }
    const blockStatement = node as IBlockStatement;
    blockStatement.body.forEach(statement => {
        visit(statement, visitor);
    });
    if (visitor.blockStatement?.leave) {
        visitor.blockStatement.leave(node);
    }
}
visitors.blockStatement = blockStatement;

function breakStatement(node: IAstNode, visitor: IAstVisitor) {
    if (visitor.breakStatement?.enter) {
        visitor.breakStatement.enter(node);
    }
    if (visitor.breakStatement?.leave) {
        visitor.breakStatement.leave(node);
    }
}
visitors.breakStatement = breakStatement;

function continueStatement(node: IAstNode, visitor: IAstVisitor) {
    if (visitor.continueStatement?.enter) {
        visitor.continueStatement.enter(node);
    }
    if (visitor.continueStatement?.leave) {
        visitor.continueStatement.leave(node);
    }
}
visitors.continueStatement = continueStatement;

function expressionStatement(node: IAstNode, visitor: IAstVisitor) {
    if (visitor.expressionStatement?.enter) {
        visitor.expressionStatement.enter(node);
    }
    const expressionStatement = node as IReturnStatement;
    if (expressionStatement.expression) {
        visit(expressionStatement.expression, visitor);
    }
    if (visitor.expressionStatement?.leave) {
        visitor.expressionStatement.leave(node);
    }
}
visitors.expressionStatement = expressionStatement;

function precisionDefinition(node: IAstNode, visitor: IAstVisitor) {
    if (visitor.precisionDefine?.enter) {
        visitor.precisionDefine.enter(node);
    }
    if (visitor.precisionDefine?.leave) {
        visitor.precisionDefine.leave(node);
    }
}
visitors.precisionDefinition = precisionDefinition;

function returnStatement(node: IAstNode, visitor: IAstVisitor) {
    if (visitor.returnStatement?.enter) {
        visitor.returnStatement.enter(node);
    }
    const returnStatement = node as IReturnStatement;
    if (returnStatement.argument) {
        visit(returnStatement.argument, visitor);
    }
    if (visitor.returnStatement?.leave) {
        visitor.returnStatement.leave(node);
    }
}
visitors.returnStatement = returnStatement;

function variableDeclaration(node: IAstNode, visitor: IAstVisitor) {
    if (visitor.variableDeclaration?.enter) {
        visitor.variableDeclaration.enter(node);
    }
    const variableDeclaration = node as IVariableDeclaration;
    if (variableDeclaration.init) {
        visit(variableDeclaration.init, visitor);
    }
    if (variableDeclaration.arrayLength) {
        visit(variableDeclaration.arrayLength, visitor);
    }
    if (visitor.variableDeclaration?.leave) {
        visitor.variableDeclaration.leave(node);
    }
}
visitors.variableDeclaration = variableDeclaration;

function structDeclaration(node: IAstNode, visitor: IAstVisitor) {
    if (visitor.structDeclaration?.enter) {
        visitor.structDeclaration.enter(node);
    }
    const structDeclaration = node as IStructDeclaration;
    structDeclaration.members.forEach(member => {
        visit(member, visitor);
    });
    if (visitor.structDeclaration?.leave) {
        visitor.structDeclaration.leave(node);
    }
}
visitors.structDeclaration = structDeclaration;

function functionDeclaration(node: IAstNode, visitor: IAstVisitor) {
    if (visitor.functionDeclaration?.enter) {
        visitor.functionDeclaration.enter(node);
    }
    const functionDeclaration = node as IFunctionDeclaration;
    functionDeclaration.parameters.forEach(parameter => {
        visit(parameter, visitor);
    });
    if (functionDeclaration.body) {
        visit(functionDeclaration.body, visitor);
    }
    if (visitor.functionDeclaration?.leave) {
        visitor.functionDeclaration.leave(node);
    }
}
visitors.functionDeclaration = functionDeclaration;

function program(node: IAstNode, visitor: IAstVisitor) {
    if (visitor.program?.enter) {
        visitor.program.enter(node);
    }
    const program = node as IProgram;
    program.statements.forEach(statement => {
        visit(statement, visitor);
    });

    if (visitor.program?.leave) {
        visitor.program.leave(node);
    }
}
visitors.program = program;

