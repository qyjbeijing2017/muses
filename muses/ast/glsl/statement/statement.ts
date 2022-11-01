import { IMusesNodeOptions, MusesNode } from "../../node";

export interface IMusesStatementOptions extends IMusesNodeOptions {

}

export abstract class MusesStatement extends MusesNode {
    constructor(readonly options: IMusesStatementOptions) {
        super();
    }
}