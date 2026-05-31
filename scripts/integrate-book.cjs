#!/usr/bin/env node
/* Integrate an agent-drafted book into textbooks.ts (units array) and
 * bookSections.ts (book block). Replaces the matched bracket-balanced block.
 * Safe because note strings contain no [] {} characters (only half-width ()).
 * Usage: node scripts/integrate-book.cjs <bookId>
 */
const fs = require('fs');
const path = require('path');

const id = process.argv[2];
if (!id) throw new Error('usage: integrate-book.cjs <bookId>');

const root = path.resolve(__dirname, '..');
const tbPath = path.join(root, 'src/data/textbooks.ts');
const bsPath = path.join(root, 'src/data/bookSections.ts');
const tbNew = fs.readFileSync(`/tmp/${id}_tb.ts`, 'utf8').trim();
const bsNew = fs.readFileSync(`/tmp/${id}_bs.ts`, 'utf8').trim();

/** Replace the bracket-balanced block that starts at the first `open` char
 *  found after `marker`, through its matching `close`. */
function replaceBlock(src, marker, open, close, replacement) {
  const i = src.indexOf(marker);
  if (i < 0) throw new Error(`marker not found: ${marker}`);
  const j = src.indexOf(open, i + marker.length);
  if (j < 0) throw new Error(`open '${open}' not found after ${marker}`);
  let depth = 0;
  let k = j;
  for (; k < src.length; k++) {
    if (src[k] === open) depth++;
    else if (src[k] === close) {
      depth--;
      if (depth === 0) break;
    }
  }
  if (depth !== 0) throw new Error(`unbalanced ${open}${close} after ${marker}`);
  return src.slice(0, j) + replacement + src.slice(k + 1);
}

let tb = fs.readFileSync(tbPath, 'utf8');
tb = replaceBlock(tb, `id: '${id}'`, '[', ']', tbNew);
fs.writeFileSync(tbPath, tb);

let bs = fs.readFileSync(bsPath, 'utf8');
bs = replaceBlock(bs, `${id}:`, '{', '}', bsNew);
fs.writeFileSync(bsPath, bs);

console.log(`integrated ${id}: tb +${tbNew.split('\n').length} lines, bs +${bsNew.split('\n').length} lines`);
