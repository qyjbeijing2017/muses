import { IStatement } from "./statement";

export interface IPrecisionDefinition extends IStatement {
    type: 'PrecisionDefinition';
    precision: string;
    typeName: string;
}