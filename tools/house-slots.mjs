// tools/house-slots.mjs - the code the two houses share (21.11.2026, stage 2 of the split): ONE text in shared/, put together for
// each house AT BUILD TIME, into the same one function (IIFE) as before. Nothing is loaded separately at run time: the bundle of each
// house is the same text as before the split, byte for byte (tools/assemble.mjs for בית ראשון, tools/build-sheni.mjs for בית שני).
//
//   shared/<file>            a module of both houses (00-lib.js, 70-ui.js, 72-words.js, 75-tour.js, 85-hq.js, 90-entry.js). Where the
//                            houses differ, a line "<spaces>//@@slot <name>" stands in for each house's own lines;
//   <house>/slots/<base>.slots.js   the house's lines for every slot of shared/<base>.js:
//                                //@@begin <name>
//                                ...the lines (none, if this house has nothing there)...
//                                //@@end <name>
//   shared/frag/<name>.js    a piece of a module of both houses (the figures' kits): in the house's own module, the line
//                            "<spaces>//@@include <name>" stands for it; its slots in <house>/slots/<name>.slots.js
//   <house> = src (בית ראשון) | sheni/src (בית שני)
//
// A module is in shared/ OR in the house's folder, never in both; every slot must be filled exactly once, and every slot of a
// house's file must be used: anything else stops the build (nothing is left out silently).
//   node tools/house-slots.mjs <rishon|sheni> <file> [out]   - the module as the house's build gets it (to read it, or to diff)
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

export const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
export const HOUSES = { rishon: 'src', sheni: path.join('sheni', 'src') };
// every file is read with its line ends as LF (a checkout with CRLF - git on Windows - builds the same bundle; a CR before a line
// break never changes JavaScript: not in a string, where it cannot stand, and not in a template literal, which reads CRLF and CR as LF)
const read = (f) => fs.readFileSync(f, 'utf8').replace(/\r\n?/g, '\n');
const SLOT = /^\s*\/\/@@slot (\S+)$/, INCLUDE = /^\s*\/\/@@include (\S+)$/, BEGIN = /^\/\/@@begin (\S+)$/;
// the shared files and the slots files each house's build read (verifyHouse: none may be left out)
const USED = { rishon: new Set(), sheni: new Set() };

export function readSlots(file) {
  const map = new Map();
  if (!fs.existsSync(file)) return map;
  const L = read(file).split('\n');
  for (let i = 0; i < L.length; i++) {
    const m = BEGIN.exec(L[i]);
    if (!m) { if (L[i].trim()) throw new Error(file + ':' + (i + 1) + ': a line outside //@@begin ... //@@end'); continue; }
    const end = '//@@end ' + m[1], body = [];
    let j = i + 1;
    while (j < L.length && L[j] !== end) body.push(L[j++]);
    if (j >= L.length) throw new Error(file + ': the slot ' + m[1] + ' has no ' + end);
    if (map.has(m[1])) throw new Error(file + ': the slot ' + m[1] + ' twice');
    map.set(m[1], body);
    i = j;
  }
  return map;
}

// the shared text with one house's slots
export function fill(sharedFile, slotsFile) {
  const slots = readSlots(slotsFile), used = new Set(), out = [];
  for (const l of read(sharedFile).split('\n')) {
    const m = SLOT.exec(l);
    if (!m) { out.push(l); continue; }
    if (!slots.has(m[1])) throw new Error(path.relative(ROOT, slotsFile) + ': no slot ' + m[1] + ' (' + path.relative(ROOT, sharedFile) + ')');
    if (used.has(m[1])) throw new Error(path.relative(ROOT, sharedFile) + ': the slot ' + m[1] + ' twice');
    used.add(m[1]);
    out.push(...slots.get(m[1]));
  }
  const unused = [...slots.keys()].filter((k) => !used.has(k));
  if (unused.length) throw new Error(path.relative(ROOT, slotsFile) + ': slots that ' + path.relative(ROOT, sharedFile) + ' does not have: ' + unused.join(', '));
  return out.join('\n');
}

// the text of a module (or of header.txt) for a house
export function houseText(house, file, root = ROOT) {
  const dir = HOUSES[house];
  if (!dir) throw new Error('no house ' + house);
  const own = path.join(root, dir, file), shared = path.join(root, 'shared', file);
  const base = file.replace(/\.js$/, '');
  const used = USED[house];
  let text;
  if (fs.existsSync(shared)) {
    if (fs.existsSync(own)) throw new Error(file + ' is both in shared/ and in ' + dir + '/: one of them must go');
    const slots = path.join(root, dir, 'slots', base + '.slots.js');
    text = fill(shared, slots);
    used.add(path.resolve(shared)); used.add(path.resolve(slots));
  } else if (fs.existsSync(own)) text = read(own);
  else throw new Error('missing module ' + file + ' (neither ' + dir + '/' + file + ' nor shared/' + file + ')');
  if (text.includes('//@@include ')) {
    text = text.split('\n').map((l) => {
      const m = INCLUDE.exec(l);
      if (!m) return l;
      const frag = path.join(root, 'shared', 'frag', m[1] + '.js'), slots = path.join(root, dir, 'slots', m[1] + '.slots.js');
      if (!fs.existsSync(frag)) throw new Error(dir + '/' + file + ': //@@include ' + m[1] + ' - no shared/frag/' + m[1] + '.js');
      used.add(path.resolve(frag)); used.add(path.resolve(slots));
      return fill(frag, slots);
    }).join('\n');
  }
  // a mark that was not taken - "//@@include x " with a space at the end, "//@@Slot", a mark inside a slot - would leave a piece out
  // without a word (REFUTE ק־9): no "//@@" may be left in what the build gets (the sources of 3.0.6 have none)
  const left = text.split('\n').findIndex((l) => l.includes('//@@'));
  if (left >= 0) throw new Error(dir + '/' + file + ' (as built), line ' + (left + 1) + ': a //@@ mark that is not "//@@slot <name>" or "//@@include <name>" exactly: ' + JSON.stringify(text.split('\n')[left].trim().slice(0, 100)));
  return text;
}

// after a house's build has read all its files: every slots file of the house, every module of shared/ and every piece of shared/frag/
// must have been read (a file left out - an orphan slots file, a piece no //@@include brings in - would be edited for nothing)
export function verifyHouse(house, root = ROOT) {
  const dir = path.join(root, HOUSES[house]), used = USED[house], missing = [];
  const list = (d, re) => (fs.existsSync(d) ? fs.readdirSync(d).filter((f) => re.test(f)).map((f) => path.join(d, f)) : []);
  for (const f of [...list(path.join(dir, 'slots'), /\.slots\.js$/), ...list(path.join(root, 'shared'), /\.js$/), ...list(path.join(root, 'shared', 'frag'), /\.js$/)])
    if (!used.has(path.resolve(f))) missing.push(path.relative(root, f));
  if (missing.length) throw new Error(house + ': files that the build did not read (a slots file of a module that is not shared, a piece no //@@include brings in, or a shared module not in the build order): ' + missing.join(', '));
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const [house, file, out] = process.argv.slice(2);
  const t = houseText(house, file);
  if (out) fs.writeFileSync(out, t, 'utf8'); else process.stdout.write(t);
}
