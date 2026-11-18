// Write the library part of HQ_302 (the WebGL light toggles): three.js r160's GTAO and Poisson denoise shaders and their noise and
// sample-point helpers, taken verbatim from examples/jsm/shaders/ (MIT, as the rest of the bundled three.js), as plain declarations
// for the plugin's single scope (the three.js names they use - DataTexture, Matrix4, Vector2, Vector3, RepeatWrapping - are in it).
// Usage: node gen-hq-lib.mjs <three 0.160 package dir> <out file>
import fs from 'node:fs';
import path from 'node:path';

const [pkg, out] = process.argv.slice(2);
const S = path.join(pkg, 'examples', 'jsm', 'shaders');
const strip = (t) => t.replace(/^import[\s\S]*?from\s+['"][^'"]+['"];\s*$/gm, '').replace(/^export\s*\{[^}]*\};?\s*$/gm, '');
let gtao = strip(fs.readFileSync(path.join(S, 'GTAOShader.js'), 'utf8'));
let pd = strip(fs.readFileSync(path.join(S, 'PoissonDenoiseShader.js'), 'utf8'));
// only what HQ uses: GTAOShader, generateMagicSquareNoise (+ generateMagicSquare), PoissonDenoiseShader, generatePdSamplePointInitializer
// (+ generateDenoiseSamples); GTAODepthShader and GTAOBlendShader are dropped
const cut = (t, name) => {
  const a = t.indexOf('const ' + name + ' = {');
  if (a < 0) throw new Error('no ' + name);
  let i = t.indexOf('{', a), d = 0;
  for (; i < t.length; i++) { if (t[i] === '{') d++; else if (t[i] === '}') { d--; if (d === 0) break; } }
  const end = t.indexOf(';', i) + 1;
  return t.slice(0, a) + t.slice(end);
};
gtao = cut(cut(gtao, 'GTAODepthShader'), 'GTAOBlendShader');
const body = (gtao + '\n' + pd).replace(/\/\*\*[\s\S]*?\*\//g, '').replace(/\n{3,}/g, '\n\n').trim();
const indented = body.split('\n').map((l) => (l.trim() ? '    ' + l.replace(/^\t+/, (m) => '  '.repeat(m.length)) : '')).join('\n');
const head = `  // ===== HQ_302: the library part - three.js r160's GTAO (ground-truth ambient occlusion) and Poisson denoise shaders, verbatim from
  // examples/jsm/shaders/GTAOShader.js and PoissonDenoiseShader.js (MIT, as the rest of the bundled three.js); written by
  // tools/round-3.0.2/gen-hq-lib.mjs. Only HQ_make (below) uses them.
  var HQ_LIB = (function () {
`;
const tail = `
    return { GTAOShader, generateMagicSquareNoise, PoissonDenoiseShader, generatePdSamplePointInitializer };
  })();
`;
fs.writeFileSync(out, head + indented + '\n' + tail);
console.log('written', out, fs.statSync(out).size, 'bytes');
