// the morning demonstration's washing (stage kiyor), played in real time to given seconds, each seen from given cameras:
// node kidshot.mjs <plugin> <outdir> <sec>[@x,y,z,tx,ty,tz][@...] ...   (the demo's own camera when none)
import { open } from '../fs/h.mjs';
import fs from 'node:fs';
const [,, dir, out, ...items] = process.argv; fs.mkdirSync(out, { recursive: true });
const P = await open(dir, { dsf: 1, vw: +(process.env.VW || 1100), vh: +(process.env.VH || 700) }); const pg = P.page;
await P.settle(30000, 3);
await pg.evaluate(async () => { const S = window.__ctx.shared; S.tamid.setOrder('abba'); S.tour.start('tamid', { speed: 1 }); await new Promise((r) => setTimeout(r, 1500)); S.tour.goto(S.tamid.list('abba').indexOf('kiyor')); await new Promise((r) => setTimeout(r, 4200)); });
let n = 0;
for (const it of items) {
  const [secS, ...cams] = it.split('@'); const sec = +secS;
  const st = await pg.evaluate(async (sec) => { const c = window.__ctx, T = c.shared.tour, W = c.shared.tamid;
    if (window.__kidStarted) T.pause(false);
    window.__kidStarted = 1;
    for (let k = 0; k < 600 && !(W.stage === 3 && W.sec >= sec); k++) await new Promise((r) => setTimeout(r, 40));
    T.pause(true); await new Promise((r) => setTimeout(r, 200));
    const f = W.figAt('t'); return W.stage + '@' + (+W.sec).toFixed(2) + ' t ' + (f ? [f.x, f.y, f.z].map((v) => (+v).toFixed(2)).join(',') + ' ' + f.pose : '-'); }, sec);
  for (const camS of (cams.length ? cams : [''])) {
    n++;
    const cam = camS ? camS.split(',').map(Number) : null;
    if (cam) await pg.evaluate((cam) => { const c = window.__ctx; c.camera.position.set(cam[0], cam[1], cam[2]); c.controls.target.set(cam[3], cam[4], cam[5]); c.camera.lookAt(cam[3], cam[4], cam[5]); c.controls.update && c.controls.update(); }, cam);
    await pg.waitForTimeout(400); await P.settle(12000, 4);
    const name = out + '/k' + String(n).padStart(2, '0') + '_' + String(sec).replace('.', 'p') + '.png';
    await P.rshot(name);
    console.log(name, st);
  }
}
console.log('errors:', JSON.stringify(P.errs.slice(0, 4)));
await P.close(); process.exit(0);
