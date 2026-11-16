// the First Temple's base demonstration running, its follow view snapped at moments of the wash stop: node b1kidview.mjs <plugin> <outdir> [place=south|north|middle|rtam] lt...
import { open } from '../../fs/h.mjs';
import fs from 'node:fs';
const [,, dir, out, place, ...lts] = process.argv; fs.mkdirSync(out, { recursive: true });
const P = await open(dir, { dsf: 1, vw: Number(process.env.VW || 1100), vh: Number(process.env.VH || 700) }); const pg = P.page;
await P.settle(30000, 3);
const pl = await pg.evaluate((place) => { const c = window.__ctx, AP = c.shared.altarPlace;
  if (place && place !== 'south' && AP) { if (place === 'rtam') { const R = c.shared.altarRTam; if (R && R.set) R.set('rtam'); else return 'no rtam'; } else AP.set(place); }
  return AP ? AP.current + ' extra ' + (AP.extra || 0) : 'no place'; }, place);
await pg.waitForTimeout(800);
let n = 0;
for (const lt of lts.map(Number)) {
  n++;
  const st = await pg.evaluate((lt) => { const c = window.__ctx, M = c.shared.mechona, D = M.demo, T = c.THREE;
    if (!D.running) D.start();
    D.seek(D.washAt[0] + lt); M.follow.snap();
    return new Promise((res) => requestAnimationFrame(() => requestAnimationFrame(() => {
      const cam = c.camera, ws = D.washStation; const v = new T.Vector3(ws[0], 13, ws[1]).project(cam);
      // the shitin label's sprite
      let shit = '?'; const lg = c.root ? c.root.getObjectByName('labels') : null; if (lg) for (const s of lg.children) if (s.userData.label && s.userData.label.text === 'השיתין') shit = s.visible ? 'shown' : 'hidden';
      // the first solid thing between the eye and the aim
      const r = window.__q.ray();
      res('lt ' + lt + ' cam ' + cam.position.toArray().map((q) => q.toFixed(1)) + ' aim ' + c.controls.target.toArray().map((q) => q.toFixed(1)) + ' follow ' + M.follow.on + ' pill ndc ' + v.x.toFixed(2) + ',' + v.y.toFixed(2) + ' shitin ' + shit + ' ray ' + JSON.stringify(r));
    }))); }, lt);
  const name = out + '/k' + String(n).padStart(2, '0') + '_' + String(lt).replace('.', 'p') + '.png';
  await P.rshot(name); console.log(name, st);
}
console.log('place', pl, 'errors:', JSON.stringify(P.errs.slice(0, 4)));
await P.close(); process.exit(0);
