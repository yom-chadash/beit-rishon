// moments of the lots demo at its own eye (or a given one): node payisshots.mjs <plugin> <outdir> <reading: tamid|rambam> <sec>[@x,y,z,tx,ty,tz] ...
import { open } from '../fs/h.mjs';
import fs from 'node:fs';
const [,, dir, out, reading, ...items] = process.argv; fs.mkdirSync(out, { recursive: true });
const P = await open(dir, { dsf: 1, vw: +(process.env.VW || 1200), vh: +(process.env.VH || 740) }); const pg = P.page;
await P.settle(30000, 3);
if (process.env.PRE) console.log('pre', JSON.stringify(await pg.evaluate(process.env.PRE)));
const tl = await pg.evaluate(async (reading) => { const S = window.__ctx.shared; S.payis.setReading(reading); S.payis.start(); await new Promise((r) => setTimeout(r, 1200)); return S.payis.timeline(); }, reading);
console.log('dur', tl.dur); console.log('caps', JSON.stringify(tl.caps.slice(0, 14))); console.log('cams', JSON.stringify(tl.cams.slice(0, 8)));
let n = 0;
for (const it of items) {
  n++;
  const [secS, camS] = it.split('@'); const sec = +secS, cam = camS ? camS.split(',').map(Number) : null;
  const st = await pg.evaluate(async ([sec, cam]) => { const c = window.__ctx, Y = c.shared.payis; Y.at(sec, !!cam); await new Promise((r) => setTimeout(r, 900));
    if (cam) { c.camera.position.set(cam[0], cam[1], cam[2]); c.controls.target.set(cam[3], cam[4], cam[5]); c.camera.lookAt(cam[3], cam[4], cam[5]); c.controls.update && c.controls.update(); }
    return (+Y.now()).toFixed(1) + ' cam ' + c.camera.position.toArray().map((v) => v.toFixed(1)).join(',') + ' -> ' + c.controls.target.toArray().map((v) => v.toFixed(1)).join(','); }, [sec, cam]);
  await pg.waitForTimeout(900); await P.settle(15000, 5);
  const name = out + '/' + (process.env.PFX || 'p') + String(n).padStart(2, '0') + '_' + String(sec).replace('.', 'p') + '.png';
  await P.rshot(name);
  console.log(name, st);
}
console.log('errors:', JSON.stringify(P.errs.slice(0, 4)));
await P.close(); process.exit(0);
