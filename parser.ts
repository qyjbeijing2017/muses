import { CstParser } from "chevrotain";
import { musesTokens } from "./lexer";

export class MusesParser extends CstParser {
    constructor() {
        super(musesTokens);
        this.performSelfAnalysis();
    }
}

export const musesParser = new MusesParser();
