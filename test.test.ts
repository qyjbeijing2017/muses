import { musesLexer } from "./lexer";
import * as fs from 'fs';
import { musesParser } from "./parser";
import { musesVisitor } from "./visiter";

const filePath = './test.muses';
const outLexPath = './lex.json';
const outCstPath = './cts.json';
const outAstPath = './ast.json';
const text = fs.readFileSync(filePath, 'utf8');

const lexingResult = musesLexer.tokenize(text);
if(lexingResult.errors.length > 0) {
    console.log(lexingResult.errors);
    process.exit(1);
}
fs.writeFileSync(outLexPath, JSON.stringify(lexingResult, null, 2));

musesParser.input = lexingResult.tokens;
const cst = musesParser.shader();
if(musesParser.errors.length > 0) {
    console.log(musesParser.errors);
    process.exit(1);
}
fs.writeFileSync(outCstPath, JSON.stringify(cst, null, 2));

const ast = musesVisitor.visit(cst);
fs.writeFileSync(outAstPath, JSON.stringify(ast, null, 2));