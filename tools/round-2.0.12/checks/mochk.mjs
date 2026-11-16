// the laver's mochani in its three modes: node mochk.mjs <plugin> <outdir>
// each mode: set, a still frame half way down (evening), full down (night), then stop; the meshes' positions and the errors
import { open } from '../../fs/h.mjs';
import fs from 'node:fs';
const [,, dir, out] = process.argv; fs.mkdirSync(out, { recursive: true });
const P = await open(dir, { dsf: 1, vw: 1100, vh: 700 }); const pg = P.page;
await P.settle(30000, 3);
for (const mode of ['rashi', 'rambam', 'cover']) {
  for (const [d, ph] of [[0, null], [2.8, 'eve'], [5.6, 'night']]) {
    const st = await pg.evaluate(([mode, d, ph]) => {
      const c = window.__ctx, S = c.shared;
      const got = S.mochani.set(mode);
      if (ph) S.mukhni.pose(d, ph); else S.mukhni.stop();
      const f = S.flyPoints.mukhniDemo;
      c.camera.position.set(f.pos[0], f.pos[1], f.pos[2]); c.controls.target.set(f.target[0], f.target[1], f.target[2]); c.camera.lookAt(f.target[0], f.target[1], f.target[2]); c.controls.update && c.controls.update();
      const L = c.layers || {};
      const vis = (o) => { let p = o, v = true; while (p && v) { v = p.visible; p = p.parent; } return v; };
      const lay = ['mochaniRambam', 'mochaniCover', 'mukhniEve', 'mukhniNight', 'mukhniEveC', 'mukhniNightC'].map((k) => k + ':' + (L[k] ? (vis(L[k]) ? 1 : 0) : 'x')).join(' ');
      const cy = L.mochaniCover ? L.mochaniCover.position.y.toFixed(2) : 'x', ky = L.mochaniRambam && L.mochaniRambam.parent ? L.mochaniRambam.parent.position.y.toFixed(2) : 'x';
      return got + ' d=' + d + ' ' + (ph || '-') + ' | ' + lay + ' | cover.y ' + cy + ' laver.y ' + ky;
    }, [mode, d, ph]);
    await pg.waitForTimeout(500); await P.settle(12000, 4);
    const name = out + '/' + mode + '_' + String(d).replace('.', 'p') + '.png';
    await P.rshot(name);
    console.log(name, st);
  }
}
await pg.evaluate(() => { const S = window.__ctx.shared; S.mukhni.stop(); S.mochani.set('rashi'); });
console.log('errors:', JSON.stringify(P.errs.slice(0, 4)));
await P.close(); process.exit(0);
