import * as fs from 'fs';
import * as path from 'path';
import { Muses } from '../src';

const codePath = path.join(__dirname, 'Default.shader');
const muses = new Muses(fs.readFileSync(codePath, 'utf8'));
