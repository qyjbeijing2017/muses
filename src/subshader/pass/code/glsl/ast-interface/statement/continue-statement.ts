import { IStatement } from "./statement";

export interface IContinueStatement extends IStatement {
    type: 'continueStatement';
}