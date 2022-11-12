import { IMusesNodeOptions, MusesGLSLNode } from "../../node";

export interface IMusesStatementOptions extends IMusesNodeOptions {

}

export abstract class MusesStatement extends MusesGLSLNode {
    constructor(readonly options: IMusesStatementOptions) {
        super();
    }
}