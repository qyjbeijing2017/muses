import { IStatement } from "./statement";

export interface IPercisionDefinition extends IStatement {
    type: 'percisionDefinition';
    precision: string;
    typeName: string;
}