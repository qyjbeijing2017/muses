import { IStatement } from "./statement";

export interface IPercisionDefinition extends IStatement {
    type: 'percisionDefine';
    precision: string;
    typeName: string;
}