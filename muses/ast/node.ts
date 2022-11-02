import { MusesContextBase } from "../context/base";
import { MusesGLSLContext } from "../context/glsl";
import { MusesAstNodeType } from "./nodeType";

export interface IMusesNodeOptions {
}

export abstract class MusesNode{
    abstract readonly nodeType: MusesAstNodeType;
    check(ctx: MusesContextBase): void {};
    abstract toMuses(): string;
    abstract toGLSL(): string;
}

export abstract class MusesGLSLNode extends MusesNode{
    check(ctx: MusesGLSLContext): void{};
}

