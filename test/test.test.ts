import * as fs from 'fs';
import * as path from 'path';
import { Muses, generateCode, glslCompiler } from '../src';
const codePath = path.join(__dirname, 'Default.shader');
const muses = new Muses(fs.readFileSync(codePath, 'utf8'));
const ast = muses.subShaders[0].passes[0].code?.parseToAst({
    properties: muses.properties,
    instance: true,
    defines: {
        'PI': '3.141592',
    },
    includes: {
        glsl: glslCompiler,
    },
}) || {
    vertex: null,
    fragment: null,
};

fs.writeFileSync(
    path.join(__dirname, 'ast.json'),
    JSON.stringify(
        ast,
        null,
        2
    )
);

fs.writeFileSync(
    path.join(__dirname, 'test.vert'),
    ast.vertex ? generateCode(ast.vertex): 'vertex error',
);

fs.writeFileSync(
    path.join(__dirname, 'test.frag'),
    ast.fragment ? generateCode(ast.fragment): 'fragment error',
);
