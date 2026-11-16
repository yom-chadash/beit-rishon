// the follow view's path through the wash stop (no lag): the eye's distance to the nearest solid thing, every 0.05 s
import { open } from '../../fs/h.mjs';
const [,, dir, place] = process.argv;
const P = await open(dir, { dsf: 0.5, vw: 800, vh: 500 }); const pg = P.page;
await P.settle(30000, 3);
if (place && place !== 'south') { await pg.evaluate((pl) => { const c = window.__ctx; if (pl === 'rtam') c.shared.altarRTam.set('rtam'); else c.shared.altarPlace.set(pl); }, place); await pg.waitForTimeout(800); }
await pg.evaluate(() => { const D = window.__ctx.shared.mechona.demo; D.seek(D.washAt[0] + 1); }); await pg.waitForTimeout(400);
const r = await pg.evaluate(() => { const c = window.__ctx, T = c.THREE, M = c.shared.mechona, D = M.demo; const W = D.washAt;
  // the solid meshes near the wash stop, as world boxes (instanced too)
  c.scene.updateMatrixWorld(true); const boxes = []; const m4 = new T.Matrix4();
  c.scene.traverse((o) => { if (!o.isMesh) return; for (let a = o; a; a = a.parent) if (a.visible === false) return; const mt = Array.isArray(o.material) ? o.material[0] : o.material; if (mt && mt.transparent && mt.opacity < 0.5) return;
    let nm = ''; for (let a = o; a && !nm; a = a.parent) nm = a.name || ''; if (nm === 'labels' || nm === 'arkPriest') return;
    if (!o.geometry.boundingBox) o.geometry.computeBoundingBox();
    const add = (mw) => { const b = o.geometry.boundingBox.clone().applyMatrix4(mw); if (b.max.x < 25 || b.min.x > 60 || b.max.z < -10 || b.min.z > 40) return; if (b.max.x - b.min.x > 80 || b.max.z - b.min.z > 80) return; boxes.push([b, nm]); };
    if (o.isInstancedMesh) { for (let i = 0; i < o.count; i++) { o.getMatrixAt(i, m4); add(m4.clone().premultiply(o.matrixWorld)); } } else add(o.matrixWorld); });
  const out = []; let worst = 1e9, wt = 0, wn = '';
  for (let tau = W[0] - 2.5; tau <= W[1] + 2.5; tau += 0.05) { D.seek(tau); const v = M.follow.view(tau), p = new T.Vector3(...v.pos);
    let best = 1e9, bn = ''; for (const [b, nm] of boxes) { const d = b.distanceToPoint(p); if (d < best) { best = d; bn = nm; } }
    if (best < worst) { worst = best; wt = tau - W[0]; wn = bn; }
    if (Math.abs(((tau - W[0]) * 20) % 10) < 0.5) out.push((tau - W[0]).toFixed(2) + ': ' + v.pos.map((q) => q.toFixed(1)) + ' kc ' + (v.kc || 0).toFixed(2) + ' near ' + best.toFixed(2) + ' ' + bn); }
  return out.join('\n') + '\nWORST ' + worst.toFixed(2) + ' at lt ' + wt.toFixed(2) + ' ' + wn + ' (boxes ' + boxes.length + ')'; });
console.log(r); await P.close(); process.exit(0);
