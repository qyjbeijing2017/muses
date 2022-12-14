import * as fs from 'fs';
import { MusesVM } from '../muses';

const filePath = './test/in.muses';
const outLexPath = './test/lex.json';
const outCstPath = './test/cts.json';
const outAstPath = './test/ast.json';
const outCtxPath = './test/ctx.json';
const outTreePath = './test/tree.json';
const outMusesPath = './test/out.muses';
const code = fs.readFileSync(filePath, 'utf8');
const vm = new MusesVM(code);
fs.writeFileSync(outLexPath, JSON.stringify(vm.lex, null, 2));
fs.writeFileSync(outCstPath, JSON.stringify(vm.cst, null, 2));
fs.writeFileSync(outAstPath, JSON.stringify(vm.ast, null, 2));
fs.writeFileSync(outMusesPath, vm.ast.toMuses());
fs.writeFileSync(outMusesPath, vm.ast.toMuses());
fs.writeFileSync(outTreePath, JSON.stringify(vm.glsl, null, 2));
