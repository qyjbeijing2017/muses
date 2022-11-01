import { MusesContext } from "./context/context";
import { MusesAstNodeType } from "./nodeType";

export interface IMusesNodeOptions {
}

export abstract class MusesNode{
    abstract readonly nodeType: MusesAstNodeType;
    check(ctx: MusesContext): void{};
}