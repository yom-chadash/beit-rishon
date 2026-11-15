// moments of the morning demo at the demo's own eye (or a given one):
// node demoshots.mjs <plugin> <outdir> <order: abba|rambam> <stageId>@<sec>[@x,y,z,tx,ty,tz] ...
import { open } from '../fs/h.mjs';
import fs from 'node:fs';
const [,, dir, out, order, ...items] = process.argv; fs.mkdirSync(out, { recursive: true });
const P = await open(dir, { dsf: 1, vw: +(process.env.VW || 1200), vh: +(process.env.VH || 740) }); const pg = P.page;
await P.settle(30000, 3);
const list = await pg.evaluate(async (order) => { const S = window.__ctx.shared; S.tamid.setOrder(order); S.tour.start('tamid', { speed: 1 }); await new Promise((r) => setTimeout(r, 1500)); return S.tamid.list ? S.tamid.list(order) : null; }, order);
console.log('stages:', JSON.stringify(list));
let n = 0;
for (const it of items) {
  n++;
  const [id, secS, camS] = it.split('@'); const sec = +secS, cam = camS ? camS.split(',').map(Number) : null;
  const i = list.indexOf(id);
  if (i < 0) { console.log('NO STAGE', id); continue; }
  const st = await pg.evaluate(async ([i, sec, cam]) => { const c = window.__ctx, T = c.shared.tour; T.pause(false); T.goto(i); await new Promise((r) => setTimeout(r, 4200)); T.seek(sec); await new Promise((r) => setTimeout(r, 700)); T.pause(true);
    await new Promise((r) => setTimeout(r, 400));
    if (cam) { c.camera.position.set(cam[0], cam[1], cam[2]); c.controls.target.set(cam[3], cam[4], cam[5]); c.camera.lookAt(cam[3], cam[4], cam[5]); c.controls.update && c.controls.update(); }
    const W = c.shared.tamid; return W.stage + '@' + (+W.sec).toFixed(1) + ' cam ' + c.camera.position.toArray().map((v) => v.toFixed(1)).join(',') + ' -> ' + c.controls.target.toArray().map((v) => v.toFixed(1)).join(','); }, [i, sec, cam]);
  await pg.waitForTimeout(900); await P.settle(15000, 5);
  const name = out + '/' + (process.env.PFX || 's') + String(n).padStart(2, '0') + '_' + id + '_' + String(sec).replace('.', 'p') + '.png';
  await P.rshot(name);
  console.log(name, st);
}
console.log('errors:', JSON.stringify(P.errs.slice(0, 4)));
await P.close(); process.exit(0);
