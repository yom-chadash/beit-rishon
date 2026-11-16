// exact-ish: the washing priest's vertices inside the base's body, its laver, the altar's yesod / body (world boxes measured from vertices too)
import { open } from '../../fs/h.mjs';
const [,, dir, place, ...lts] = process.argv;
const P = await open(dir, { dsf: 0.5, vw: 800, vh: 500 }); const pg = P.page;
await P.settle(30000, 3);
if (place && place !== 'south') { await pg.evaluate((pl) => { const c = window.__ctx; if (pl === 'rtam') c.shared.altarRTam.set('rtam'); else c.shared.altarPlace.set(pl); }, place); await pg.waitForTimeout(800); }
for (const lt of lts.map(Number)) {
  const r = await pg.evaluate((lt) => { const c = window.__ctx, T = c.THREE, D = c.shared.mechona.demo; D.seek(D.washAt[0] + lt);
    return new Promise((res) => requestAnimationFrame(() => requestAnimationFrame(() => {
      c.scene.updateMatrixWorld(true);
      let fig = null; c.layers.mechonaWash.traverse((o) => { if (!fig && o.name === 'arkPriest') fig = o; });
      const v = new T.Vector3(), m4 = new T.Matrix4();
      // the obstacles: every visible mesh named mechona-* (not the stream / pool) or altar*, as its world AABB; a vertex of the priest inside counts
      const obs = [];
      c.scene.traverse((o) => { if (!o.isMesh) return; for (let a = o; a; a = a.parent) if (a.visible === false) return; let nm = ''; for (let a = o; a && !nm; a = a.parent) nm = a.name || '';
        if (!/^mechona-(frame|relief|laver|wheels|axle|panel|body|kan|roof|mouth)|^altar/.test(nm)) return; if (nm === 'arkPriest') return;
        if (!o.geometry.boundingBox) o.geometry.computeBoundingBox(); const b = o.geometry.boundingBox.clone().applyMatrix4(o.matrixWorld);
        if (b.max.x < 39 || b.min.x > 45 || b.max.z < 19 || b.min.z > 25) return; obs.push({ o, nm, inv: o.matrixWorld.clone().invert(), lb: o.geometry.boundingBox }); });
      const hits = {};
      fig.traverse((o) => { if (!o.isMesh) return; for (let a = o; a; a = a.parent) if (a.visible === false) return; const pos = o.geometry.attributes.position; const used = o.geometry.index ? new Set(o.geometry.index.array) : null;
        for (let j = 0; j < pos.count; j += 1) { if (used && !used.has(j)) continue; v.fromBufferAttribute(pos, j).applyMatrix4(o.matrixWorld);
          for (const q of obs) { const lv = v.clone().applyMatrix4(q.inv); if (q.lb.containsPoint(lv)) { const k = q.nm + ' <- ' + o.geometry.type.replace('Geometry', ''); hits[k] = hits[k] || { n: 0, y: [9e9, -9e9], x: [9e9, -9e9] }; const h = hits[k]; h.n++; h.y = [Math.min(h.y[0], v.y), Math.max(h.y[1], v.y)]; h.x = [Math.min(h.x[0], v.x), Math.max(h.x[1], v.x)]; } } } });
      res('lt ' + lt + ' obstacles ' + obs.length + ' :: ' + (Object.entries(hits).map(([k, h]) => k + ' n' + h.n + ' y' + h.y.map((q) => q.toFixed(2)) + ' x' + h.x.map((q) => q.toFixed(2))).join(' | ') || 'clear'));
    }))); }, lt);
  console.log(r);
}
await P.close(); process.exit(0);
