// the First Temple's washing priest at the stand (layer mechonaWash): node b1kid.mjs <plugin> <out.png>
import { open } from '../../fs/h.mjs';
const [,, dir, out] = process.argv;
const P = await open(dir, { dsf: 1, vw: 1100, vh: 700 }); const pg = P.page;
await P.settle(30000, 3);
const st = await pg.evaluate(() => { const c = window.__ctx, L = c.layers || {};
  const w = L.mechonaWash; if (!w) return 'no layer';
  w.visible = true; let p = w.parent; while (p) { p.visible = true; p = p.parent; }
  let fig = null; w.traverse((o) => { if (!fig && o.name === 'arkPriest') fig = o; });
  if (!fig) return 'no figure';
  fig.updateMatrixWorld(true); const v = fig.getWorldPosition(new fig.position.constructor());
  const bend = fig.children[0] && fig.children[0].children.find((o) => o.isGroup && o.rotation.x > 0.5);
  c.camera.position.set(v.x - 1.2, v.y + 2.2, v.z + 4.2); c.controls.target.set(v.x - 0.4, v.y + 1.4, v.z); c.camera.lookAt(v.x - 0.4, v.y + 1.4, v.z); c.controls.update && c.controls.update();
  return 'fig at ' + [v.x, v.y, v.z].map((q) => q.toFixed(2)).join(',') + ' bend ' + (bend ? bend.rotation.x.toFixed(2) : 'none'); });
await pg.waitForTimeout(500); await P.settle(12000, 4);
await P.rshot(out);
console.log(st, 'errors:', JSON.stringify(P.errs.slice(0, 4)));
await P.close(); process.exit(0);
