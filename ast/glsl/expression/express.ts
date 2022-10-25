import { IMusesNodeOptions, MusesNode } from "../../node";

export interface IMusesExpressionOptions extends IMusesNodeOptions {

}

export abstract class MusesExpression extends MusesNode {
    constructor(private readonly options: IMusesExpressionOptions) {
        super();
    }
}