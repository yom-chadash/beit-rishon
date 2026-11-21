// Build the Second Temple (בית שני) from its source files, sheni/src/ (split on 21.11.2026 out of 3.0.6's readable bundle,
// sheni-src/bundle.js, by tools/split-sheni.mjs - the joined files give that bundle back byte for byte):
//
//   node tools/build-sheni.mjs [--out <file>] [--compare <file>] [--house <dir> [--version x.y.z]]
//
//   1. the files of ORDER joined as they are - each module's file begins with its own mark, "  // plugin/js/<name>.js" - and TAIL,
//      the IIFE's end with three.js's licence (the First House's tools/assemble.mjs writes the same tail)
//   2. tools/safe-lines.mjs: " //" at the end of every code line (the sources are written without it; safeLines proves that only
//      comments were added)
//   3. node --check; the readable bundle -> build/sheni/bundle.readable.js (or --out)
//   --compare <file>   the readable bundle against a file, byte for byte (exit 1 on a difference: the first different line and the
//                      source file it comes from). 3.0.6's bundle: git show 3c82e60:sheni-src/bundle.js > /tmp/sheni-306.js
//   --house <dir>      the house's built folder for tools/build-unified.mjs --sheni <dir>: bundle.js minified (terser with the options
//                      of tools/build.mjs and tools/round-3.0.0/minify.mjs, then safe-lines), index.html and manifest.json written by
//                      tools/round-2.0.18/house_sheni.py. The house's version: UI_NEWS.ver in sheni/src/70-ui.js (--version, when
//                      given, must agree with it)
//
// The parts run inside ONE function (var OtzariaPlugin = (() => { ... })(); 00-lib.js opens it, TAIL closes it): no part is valid
// JavaScript alone - node --check and safe-lines run on the joined bundle only. A file in sheni/src that ORDER does not name fails
// the build (it would be left out without a word).
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { safeLines } from './safe-lines.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
export const SRC = path.join(root, 'sheni', 'src');
// the order of the bundle (not of the names: 56-tamid-data.js comes before 55-tamid.js). The names are the ones the code's own
// comments use for the Second House's files ("55-tamid.js", "57-add208.js"...); the marks inside are esbuild's ("plugin/js/tamid.js")
export const ORDER = [
  'header.txt',        // the header comment (the DEV NOTES of the bundle)
  '00-lib.js',         // the IIFE's opening, esbuild's two helpers and three.js 187 (plugin/lib/*)
  '10-core.js', '20-mount.js', '30-courts.js', '40-altar.js', '45-vessels.js', '50-heichal.js',
  '55-payis.js', '56-tamid-data.js', '55-tamid.js', '57-add208.js',
  '70-ui.js', '72-words.js', '75-tour.js', '85-hq.js', '90-entry.js'
];
export const TAIL = '})();\n/**\n * @license\n * Copyright 2010-2023 Three.js Authors\n * SPDX-License-Identifier: MIT\n */\n';

export function readParts(dir = SRC) {
  const extra = fs.readdirSync(dir).filter((f) => !ORDER.includes(f) && !f.startsWith('.') && !/\.md$/i.test(f));
  if (extra.length) throw new Error(dir + ': not in ORDER (tools/build-sheni.mjs): ' + extra.join(', '));
  return ORDER.map((f) => {
    const p = path.join(dir, f);
    if (!fs.existsSync(p)) throw new Error('missing ' + p);
    let text = fs.readFileSync(p, 'utf8');
    if (!text.endsWith('\n')) text += '\n';   // as tools/assemble.mjs: a file's last line never runs into the next file's first
    return { f, text };
  });
}
export const joinParts = (parts) => parts.map((p) => p.text).join('') + TAIL;

// the readable bundle: { parts, plain (joined, without the line ends " //"), code (the bundle) }
export function assemble(dir = SRC) {
  const parts = readParts(dir);
  const plain = joinParts(parts);
  return { parts, plain, code: safeLines(plain).code };
}

// the line (1-based) of the joined text -> the source file and its line (safe-lines adds no line breaks)
function whereIs(parts, line) {
  let first = 1;
  for (const p of parts) {
    const n = p.text.split('\n').length - 1;
    if (line < first + n) return p.f + ':' + (line - first + 1);
    first += n;
  }
  return 'TAIL:' + (line - first + 1);
}

const MINIFY = {   // tools/build.mjs (the First House) and tools/round-3.0.0/minify.mjs: the same options
  compress: { passes: 2, keep_infinity: true, pure_getters: false, unsafe: false },
  mangle: { keep_classnames: false, keep_fnames: false },
  format: { comments: /@license|@preserve/i, ascii_only: false, max_line_len: 4000 },
  sourceMap: false
};

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const argv = process.argv.slice(2);
  const opt = (k) => { const i = argv.indexOf(k); return i >= 0 ? argv[i + 1] : undefined; };
  const log = (m) => console.log('[sheni] ' + m);
  const t0 = Date.now();
  const { parts, plain, code } = assemble();
  // the old big file was removed (21.11.2026); a merge with a branch that changed it brings it back - and two sources drift apart
  // without a word. Its change is ported by tools/split-sheni.mjs --force --base (sheni/README.md), then it is deleted
  const old = path.join(root, 'sheni-src', 'bundle.js');
  if (fs.existsSync(old)) {
    if (fs.readFileSync(old, 'utf8') === code) log('NOTE: sheni-src/bundle.js is here again, the same as what sheni/src builds: delete it (sheni/src is the source)');
    else {
      console.error('[sheni] sheni-src/bundle.js is here again, and it is NOT what sheni/src builds: a change made in it would be lost. Port it to sheni/src:');
      console.error('  node tools/split-sheni.mjs sheni-src/bundle.js sheni/src --force --base <the bundle it was made from>   - then delete it (sheni/README.md)');
      process.exit(1);
    }
  }
  const out = path.resolve(opt('--out') || path.join(root, 'build', 'sheni', 'bundle.readable.js'));
  fs.mkdirSync(path.dirname(out), { recursive: true });
  fs.writeFileSync(out, code, 'utf8');
  execFileSync('node', ['--check', out], { stdio: 'inherit' });
  log('readable bundle: ' + out + ' (' + parts.length + ' files, ' + Buffer.byteLength(code) + ' bytes)');

  if (opt('--compare')) {
    const ref = fs.readFileSync(path.resolve(opt('--compare')));
    const mine = Buffer.from(code, 'utf8');
    if (Buffer.compare(ref, mine) === 0) log('the same as ' + opt('--compare') + ', byte for byte (' + ref.length + ' bytes)');
    else {
      const a = ref.toString('utf8').split('\n'), b = code.split('\n');
      let i = 0;
      while (i < a.length && i < b.length && a[i] === b[i]) i++;
      console.error('[sheni] DIFFERENT from ' + opt('--compare') + ' (' + ref.length + ' / ' + mine.length + ' bytes): first at line ' + (i + 1) + ' (' + whereIs(parts, i + 1) + ')');
      console.error('  ' + opt('--compare') + ': ' + JSON.stringify(String(a[i]).slice(0, 160)));
      console.error('  built:    ' + JSON.stringify(String(b[i]).slice(0, 160)));
      process.exit(1);
    }
  }

  if (opt('--house')) {
    const m = /\n {2}var UI_NEWS = \{\n {4}ver: "(\d+\.\d+\.\d+)"/.exec(plain);
    if (!m) throw new Error('no UI_NEWS.ver in sheni/src/70-ui.js');
    const ver = opt('--version') || m[1];
    if (ver !== m[1]) throw new Error('--version ' + ver + ' but UI_NEWS.ver (sheni/src/70-ui.js) is ' + m[1] + ': "what\'s new" and the bar would disagree');
    const { minify } = await import('terser');
    const t1 = Date.now();
    const res = await minify(code, MINIFY);
    if (!res.code) throw new Error('terser produced no code');
    const min = path.join(path.dirname(out), 'bundle.min.js');
    fs.writeFileSync(min, safeLines(res.code).code, 'utf8');
    execFileSync('node', ['--check', min], { stdio: 'inherit' });
    log('minified: ' + code.length + ' -> ' + res.code.length + ' chars, in ' + ((Date.now() - t1) / 1000).toFixed(1) + ' s');
    // index.html and manifest.json (and bundle.js copied from `min`) - house_sheni.py, as in the chain of 3.0.0-3.0.6
    execFileSync('python3', ['-I', path.join(root, 'tools', 'round-2.0.18', 'house_sheni.py'), min, ver, path.resolve(opt('--house'))], { stdio: 'inherit' });
    execFileSync('node', [path.join(root, 'tools', 'safe-lines.mjs'), '--check', path.join(path.resolve(opt('--house')), 'bundle.js')], { stdio: 'inherit', timeout: 120000 });
    log('the house folder: ' + path.resolve(opt('--house')) + ' (בית שני ' + ver + ')');
  }
  log('done in ' + ((Date.now() - t0) / 1000).toFixed(1) + ' s');
}
