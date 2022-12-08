import { IStatement } from "./statement";

export interface IBlockStatement extends IStatement {
    type: 'blockStatement';
    body: IStatement[];
}