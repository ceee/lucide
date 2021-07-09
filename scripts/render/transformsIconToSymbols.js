/* eslint-disable import/no-extraneous-dependencies */
import { basename } from 'path';
import { parseSync, stringify } from 'svgson';
import { generateHashedKey, readSvg, hasDuplicatedChildren } from '../helpers';

/**
 * Build an object in the format: `{ <name>: <contents> }`.
 * @param {string[]} svgFiles - A list of filenames.
 * @param {Function} getSvg - A function that returns the contents of an SVG file given a filename.
 * @returns {Object}
 */
export default (svgFiles, iconsDirectory) =>
  svgFiles
    .map(svgFile => {
      const name = basename(svgFile, '.svg');
      const svg = readSvg(svgFile, iconsDirectory);
      const contents = parseSync(svg);

      if (!(contents.children && contents.children.length)) {
        throw new Error(`${name}.svg has no children!`);
      }

      if (hasDuplicatedChildren(contents.children)) {
        throw new Error(`Duplicated children in ${name}.svg`);
      }

      return stringify({
        name: 'symbol',
        type: 'element',
        attributes: {
          id: name,
          viewBox: contents.attributes.viewBox
        },
        children: contents.children
      });
    });
