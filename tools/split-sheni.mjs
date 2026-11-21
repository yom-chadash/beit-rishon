// Split the Second Temple's readable bundle into its source files - done ONCE, on 21.11.2026, on 3.0.6's sheni-src/bundle.js:
//
//   node tools/split-sheni.mjs [<readable bundle> [<out dir>]] [--force --base <readable bundle>]
//        defaults: sheni-src/bundle.js -> sheni/src/. A folder that already has files is refused. --force writes over it - for a
//        bundle made from the sources and then patched in the old way, by text (or the bundle of another branch, at a merge) - and
//        only with --base: the bundle the new one was made from. The files that are there now must build EXACTLY --base (else every
//        change made in them since --base would be lost without a word: port such changes by hand).
//
// The cuts (tools/build-sheni.mjs ORDER):
//   header.txt     the header comment, up to "var OtzariaPlugin = (() => {"
//   00-lib.js      from there - the IIFE's opening, esbuild's two helpers, three.js (its marks "  // plugin/lib/...") - to the first module
//   10-core.js ... 90-entry.js   every module from its own mark, "  // plugin/js/<name>.js" (the file's first line; hq.js's mark goes
//                  on with a note in brackets), to the next mark. Lines that only begin like a mark ("  // plugin/js/ui.js - the
//                  panel...", "  // plugin/js/entry - renderer...") are not marks; "plugin/lib/three.module.js" twice stays in 00-lib.js
//   the end        "})();" and three.js's licence: not a file - build-sheni.mjs writes it (TAIL), as tools/assemble.mjs does
// The line ends " //" (tools/safe-lines.mjs) are taken off by the rule of tools/round-3.0.0/strip.py (" //" after a non-space, at the
// line's end): safe-lines writes them back. Nothing is written unless the way back is proved first - the files, joined by
// build-sheni.mjs's own code and passed through safeLines, give the bundle byte for byte.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { ORDER, TAIL, joinParts, assemble } from './build-sheni.mjs';
import { safeLines } from './safe-lines.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const argv = process.argv.slice(2);
const bi = argv.indexOf('--base');
const BASE = bi >= 0 ? path.resolve(argv[bi + 1]) : null;
const args = argv.filter((a, i) => a !== '--force' && a !== '--base' && !(bi >= 0 && i === bi + 1));
const force = argv.includes('--force');
const IN = path.resolve(args[0] || path.join(root, 'sheni-src', 'bundle.js'));
const OUT = path.resolve(args[1] || path.join(root, 'sheni', 'src'));
const fail = (m) => { console.error('[split] ' + m); process.exit(1); };
if (!fs.existsSync(IN)) fail('no ' + IN + (args[0] ? '' : ' (sheni-src/bundle.js was removed after the split, 21.11.2026: name the bundle to split)'));
if (BASE && !fs.existsSync(BASE)) fail('no --base ' + BASE);
// 21.11.2026 (stage 2): the modules both houses share live in shared/ (tools/house-slots.mjs), not in sheni/src/. A split writes whole
// files - into sheni/src/ that would put a second copy next to shared/ (the build stops on it). Split into another (empty) folder,
// and port the change by hand: to shared/<file> if it is for both houses, to sheni/src/slots/<file>.slots.js if for this house only
const SHARED = path.join(root, 'shared');
if (path.resolve(OUT) === path.join(root, 'sheni', 'src') && fs.existsSync(SHARED) && ORDER.some((f) => fs.existsSync(path.join(SHARED, f))))
  fail('shared/ holds modules of both houses (' + ORDER.filter((f) => fs.existsSync(path.join(SHARED, f))).join(', ') + '): a split into sheni/src would duplicate them. Split into an empty folder and port by hand (unified/DEV_NOTES.md, "הקוד המשותף")');
if (fs.existsSync(OUT) && fs.readdirSync(OUT).length) {
  if (!force || !BASE) fail(OUT + ' has files: not written over (--force --base <the bundle the new one was made from>)');
  // the files there now must be exactly the base of the new bundle: nothing in them is lost
  if (assemble(OUT).code !== fs.readFileSync(BASE, 'utf8')) fail('the files of ' + OUT + ' do not build --base ' + BASE + ' exactly: they were changed since. Not written over - port the change by hand');
}

const B = fs.readFileSync(IN, 'utf8');
if (B.includes('\r')) fail('the bundle has \\r');
if (!B.endsWith('\n')) fail('the bundle does not end with a line break');
// 1. the line ends off
const L = B.split('\n').map((l) => (/\S \/\/$/.test(l) ? l.slice(0, -3) : l));
// 2. the cuts, by line
const FILE = { core: '10-core.js', mount: '20-mount.js', courts: '30-courts.js', altar: '40-altar.js', vessels: '45-vessels.js',
  heichal: '50-heichal.js', payis: '55-payis.js', 'tamid-data': '56-tamid-data.js', tamid: '55-tamid.js', add208: '57-add208.js',
  ui: '70-ui.js', words: '72-words.js', tour: '75-tour.js', hq: '85-hq.js', entry: '90-entry.js' };
const marks = [];
L.forEach((l, i) => { const m = /^ {2}\/\/ plugin\/js\/([a-z0-9-]+)\.js(?: \(.*\))?$/.exec(l); if (m) marks.push({ i, f: FILE[m[1]] || fail('an unknown mark at line ' + (i + 1) + ': ' + l) }); });
const want = ORDER.slice(2);
if (marks.map((m) => m.f).join() !== want.join()) fail('the marks are not the modules of ORDER, once each and in order: ' + marks.map((m) => m.f).join(', '));
const open = L.indexOf('var OtzariaPlugin = (() => {');
if (open < 1 || L.indexOf('var OtzariaPlugin = (() => {', open + 1) >= 0) fail('"var OtzariaPlugin = (() => {" not found once');
const tailLines = TAIL.split('\n').length - 1;
const end = L.length - 1 - tailLines;   // the line "})();" (L's last element is the empty string after the last line break)
if (L.slice(end).join('\n') !== TAIL) fail('the bundle does not end with build-sheni.mjs TAIL');
if (!(open < marks[0].i)) fail('a module before the library');
const text = (a, b) => L.slice(a, b).join('\n') + '\n';
const parts = [{ f: 'header.txt', text: text(0, open) }, { f: '00-lib.js', text: text(open, marks[0].i) }];
marks.forEach((m, k) => parts.push({ f: m.f, text: text(m.i, k + 1 < marks.length ? marks[k + 1].i : end) }));
// 3. the way back, before anything is written
if (parts.map((p) => p.f).join() !== ORDER.join()) fail('the parts are not ORDER');
const joined = joinParts(parts);
if (joined !== L.join('\n')) fail('the joined parts are not the bundle without its line ends');
const back = safeLines(joined).code;
if (back !== B) fail('safeLines(the joined parts) is not the bundle');
// 4. write
fs.mkdirSync(OUT, { recursive: true });
for (const p of parts) fs.writeFileSync(path.join(OUT, p.f), p.text, 'utf8');
for (const p of parts) console.log('[split] ' + p.f.padEnd(17) + String(p.text.split('\n').length - 1).padStart(6) + ' lines ' + String(Buffer.byteLength(p.text)).padStart(9) + ' bytes');
console.log('[split] ' + parts.length + ' files -> ' + OUT + '; joined + safe-lines = ' + path.relative(root, IN) + ', byte for byte (' + Buffer.byteLength(B) + ' bytes); line ends taken off: ' + B.split('\n').filter((l) => /\S \/\/$/.test(l)).length);
