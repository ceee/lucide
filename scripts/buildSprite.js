import fs from 'fs';
import path from 'path';
import getArgumentOptions from 'minimist'; // eslint-disable-line import/no-extraneous-dependencies

import transformsIconToSymbols from './render/transformsIconToSymbols';
import generateSpriteFile from './build/generateSpriteFile';

import { readSvgDirectory } from './helpers';

const cliArguments = getArgumentOptions(process.argv.slice(2));

const ICONS_DIR = path.resolve(__dirname, '../icons');
const OUTPUT_DIR = path.resolve(__dirname, cliArguments.output || '../build');

if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR);
}

const {
  renderUniqueKey = false,
  templateSrc = './templates/defaultIconFileTemplate',
  silent = false,
  iconFileExtention = '.js',
  exportFileName = 'lucide.svg',
} = cliArguments;

const svgFiles = readSvgDirectory(ICONS_DIR);

const icons = transformsIconToSymbols(svgFiles, ICONS_DIR);

// Generates entry files for the compiler filled with icons exports
generateSpriteFile(
  path.join(OUTPUT_DIR, 'sprite', exportFileName),
  path.join(OUTPUT_DIR, 'sprite'),
  icons
);
