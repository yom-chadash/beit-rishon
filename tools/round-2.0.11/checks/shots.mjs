// usage: node shots.mjs spec.json   spec: {plugin?, w?, h?, pre?: "js", shots: [[name, cam, tg, js?], ...]}
import { open } from '../fs/h.mjs';
import fs from 'fs';
const spec = JSON.parse(fs.readFileSync(process.argv[2], 'utf8'));
const { page, close, errs, rshot } = await open(spec.plugin || '/home/claude/b2src/plugin', { dsf: 1, vw: spec.w || 1100, vh: spec.h || 700 });
const fly = (cam, tg) => page.evaluate(([cam, tg]) => { const c = window.__ctx; c.camera.position.set(...cam); c.controls.target.set(...tg); c.controls.update(); }, [cam, tg]);
const tri = () => page.evaluate(() => window.__ctx.renderer.info.render.triangles);
if (spec.pre) await page.evaluate(spec.pre);
const out = {};
for (const [n, cam, tg, js] of spec.shots) {
  if (js) { try { const r = await page.evaluate(js); console.log(n, JSON.stringify(r)); } catch (e) { console.log('JS-ERR', n, e.message); } }
  await fly(cam, tg); await page.waitForTimeout(spec.wait || 1200);
  await rshot('/home/claude/qa/r211/' + n + '.png'); out[n] = await tri();
}
console.log(JSON.stringify(out));
console.log('errs', errs.length, errs.slice(0, 4).join(' | '));
await close();
