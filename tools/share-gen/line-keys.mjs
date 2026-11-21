// tools/share-gen/line-keys.mjs - for tools/share-gen/share_gen.py (run once per file; see there):
//   node tools/share-gen/line-keys.mjs <file.js> <out.json>
// writes { keys, units } for a module (or a piece of one) of the IIFE:
//   keys[i]  - the CODE of line i: the raw text of every token (or piece of a token) on the line, joined by \u0001; '' for a line
//              with no token (an empty line or a comment). Two lines with the same key are the same code - the whitespace inside a
//              string or a template literal counts, the whitespace between tokens and the comments do not.
//   units    - [{ name, a, b }]: the named functions and variables (0-based lines a..b), for the slots' names
// The text is parsed inside a function (a module of the IIFE is a list of statements; it is not a program alone).
import fs from 'node:fs';
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const acorn = require('acorn');
const [file, out] = process.argv.slice(2);
const text = fs.readFileSync(file, 'utf8');
const code = '(function(){\n' + text + '\n})';
const starts = [0];
for (let i = 0; i < code.length; i++) if (code[i] === '\n') starts.push(i + 1);
const lineOf = (off) => { let lo = 0, hi = starts.length - 1; while (lo < hi) { const m = (lo + hi + 1) >> 1; if (starts[m] <= off) lo = m; else hi = m - 1; } return lo; };
const n = text.split('\n').length;
const keys = Array.from({ length: n }, () => []);
for (const t of acorn.tokenizer(code, { ecmaVersion: 'latest', allowReturnOutsideFunction: true })) {
  let s = t.start;
  while (s < t.end) {
    const L = lineOf(s), end = L + 1 < starts.length ? starts[L + 1] - 1 : code.length, e = Math.min(t.end, end);
    if (L >= 1 && L <= n) keys[L - 1].push(code.slice(s, e));
    if (e < t.end && L < n) keys[L].push('\u0002');   // the line break inside the token: the next line goes on with it
    s = e + 1;
  }
}
const units = [];
// (a piece that is not whole statements - a slot's lines - has keys but no names)
let ast = null;
try { ast = acorn.parse(code, { ecmaVersion: 'latest', allowReturnOutsideFunction: true, locations: true }); } catch (_) {}
// a plain walk over the tree (the package has acorn, not acorn-walk)
const visit = (node, fn) => {
  if (!node || typeof node.type !== 'string') return;
  fn(node);
  for (const k of Object.keys(node)) {
    if (k === 'loc') continue;
    const v = node[k];
    if (Array.isArray(v)) { for (const c of v) if (c && typeof c.type === 'string') visit(c, fn); }
    else if (v && typeof v.type === 'string') visit(v, fn);
  }
};
if (ast) visit(ast, (node) => {
  // the functions only (declared, or the value of a variable / a property): a slot is named by the function it is in
  let name = null;
  const isFn = (v) => v && /^(FunctionExpression|ArrowFunctionExpression)$/.test(v.type);
  if ((node.type === 'FunctionDeclaration' || node.type === 'FunctionExpression') && node.id) name = node.id.name;
  else if (node.type === 'VariableDeclarator' && node.id.type === 'Identifier' && isFn(node.init)) name = node.id.name;
  else if (node.type === 'Property' && node.key && (node.key.type === 'Identifier' || node.key.type === 'Literal') && isFn(node.value)) name = String(node.key.name || node.key.value);
  else if (node.type === 'MethodDefinition' && node.key && node.key.type === 'Identifier') name = node.key.name;
  if (name) units.push({ name, a: node.loc.start.line - 2, b: node.loc.end.line - 2 });
});
// and the declarations of the outermost level (the IIFE's: a table such as UI_NEWS), for a slot outside every function
for (const st of ast ? ast.body[0].expression.body.body : []) {
  const names = st.type === 'FunctionDeclaration' && st.id ? [st.id.name] : st.type === 'VariableDeclaration' ? st.declarations.filter((d) => d.id.type === 'Identifier').map((d) => d.id.name) : [];
  if (names.length) units.push({ name: names[0], a: st.loc.start.line - 2, b: st.loc.end.line - 2, top: true });
}
fs.writeFileSync(out, JSON.stringify({ keys: keys.map((k) => k.join('\u0001')), units }));
