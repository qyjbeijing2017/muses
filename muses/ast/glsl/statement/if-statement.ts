import { MusesGLSLContext } from "../../../context/glsl";
import { MusesAstNodeType } from "../../nodeType";
import { MusesConstants } from "../constants";
import { MusesExpression } from "../expression/express";
import { MusesIdentify } from "../Identify";
import { MusesVariableDeclaration } from "../variable-declaration";
import { IMusesStatementOptions, MusesStatement } from "./statement";

export interface IMusesIfStatementOptions extends IMusesStatementOptions {
    test: MusesExpression | MusesConstants | MusesIdentify;
    consequent: (MusesVariableDeclaration | MusesStatement)[];
    alternate: (MusesVariableDeclaration | MusesStatement)[] | IMusesIfStatementOptions;
}

export class MusesIfStatement extends MusesStatement {
    toMuses(): string {
        return this.toGLSL();
    }
    toGLSL(): string {
        throw new Error("Method not implemented.");
    }
    check(ctx: MusesGLSLContext): void {
        
    }
    get optionsChildren(){
        return this.options as IMusesIfStatementOptions
    }
    nodeType: MusesAstNodeType = MusesAstNodeType.IfStatement;
    constructor(options: IMusesIfStatementOptions) {
        super(options);
    }
}

