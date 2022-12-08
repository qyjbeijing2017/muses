import * as fs from 'fs';
import * as path from 'path';
import { Muses } from '../src';
import { MusesManager } from '../src/muse-manager';

const codePath = path.join(__dirname, 'Default.shader');
const manager = new MusesManager();
const muses = new Muses(fs.readFileSync(codePath, 'utf8'), manager);
const ast = muses.subShaders[0].passes[0].code?.parseToAst({
    properties: muses.properties,
    instance: true,
}) || {};

fs.writeFileSync(
    path.join(__dirname, 'ast.json'),
    JSON.stringify(
        ast,
        null,
        2
    )
);
