// the morning demo's washing priest: his real points inside any solid thing near the laver (each thing's own box, in its own frame)
import { open } from '../fs/h.mjs';
const [,, dir, ...secs] = process.argv;
const P = await open(dir, { dsf: 0.5, vw: 900, vh: 600 }); const pg = P.page;
await P.settle(30000, 3);
await pg.evaluate(async () => { const S = window.__ctx.shared; S.tamid.setOrder('abba'); S.tour.start('tamid', { speed: 1 }); await new Promise((r) => setTimeout(r, 1500)); S.tour.goto(S.tamid.list('abba').indexOf('kiyor')); await new Promise((r) => setTimeout(r, 4200)); });
for (const sec of secs.map(Number)) {
  const r = await pg.evaluate(async (sec) => { const c = window.__ctx, T = c.shared.tour, W = c.shared.tamid, TH = c.THREE;
    if (window.__kv) T.pause(false); window.__kv = 1;
    for (let k = 0; k < 600 && !(W.stage === 3 && W.sec >= sec); k++) await new Promise((r) => setTimeout(r, 40));
    T.pause(true); await new Promise((r) => setTimeout(r, 300));
    c.scene.updateMatrixWorld(true);
    const f = W.figAt('t'); let fig = null;
    // the figure's group: the nearest group named like a figure at its place
    c.scene.traverse((o) => { if (fig || !o.isGroup) return; if (Math.abs(o.position.x - f.x) < 0.01 && Math.abs(o.position.z - f.z) < 0.01 && o.children.length > 2) fig = o; });
    if (!fig) return 'no fig';
    const own = new Set(); fig.traverse((o) => own.add(o));
    const obs = []; const v = new TH.Vector3();
    c.scene.traverse((o) => { if (!o.isMesh || own.has(o)) return; for (let a = o; a; a = a.parent) if (a.visible === false) return; const mt = Array.isArray(o.material) ? o.material[0] : o.material; if (mt && mt.transparent && mt.opacity < 0.9) return;
      let nm = ''; for (let a = o; a && !nm; a = a.parent) nm = a.name || ''; if (/kiddushWater|labels/.test(nm)) return;
      if (!o.geometry.boundingBox) o.geometry.computeBoundingBox(); const b = o.geometry.boundingBox.clone().applyMatrix4(o.matrixWorld);
      if (b.max.x < f.x - 3 || b.min.x > f.x + 3 || b.max.z < f.z - 3 || b.min.z > f.z + 3 || b.max.x - b.min.x > 60) return;
      obs.push({ nm: nm + '/' + o.geometry.type.replace('Geometry', ''), inv: o.matrixWorld.clone().invert(), lb: o.geometry.boundingBox, inst: o.isInstancedMesh ? o : null }); });
    const hits = {};
    fig.traverse((o) => { if (!o.isMesh) return; for (let a = o; a; a = a.parent) if (a.visible === false) return; const pos = o.geometry.attributes.position; const used = o.geometry.index ? new Set(o.geometry.index.array) : null;
      for (let j = 0; j < pos.count; j++) { if (used && !used.has(j)) continue; v.fromBufferAttribute(pos, j).applyMatrix4(o.matrixWorld);
        for (const q of obs) { if (q.inst) continue; const lv = v.clone().applyMatrix4(q.inv); if (q.lb.containsPoint(lv)) { const h = hits[q.nm] = hits[q.nm] || { n: 0, y: [9e9, -9e9], z: [9e9, -9e9] }; h.n++; h.y = [Math.min(h.y[0], v.y), Math.max(h.y[1], v.y)]; h.z = [Math.min(h.z[0], v.z), Math.max(h.z[1], v.z)]; } } } });
    return 'sec ' + (+W.sec).toFixed(2) + ' fig ' + [f.x, f.z].map((q) => (+q).toFixed(2)) + ' ' + f.pose + ' obstacles ' + obs.length + ' :: ' + (Object.entries(hits).map(([k, h]) => k + ' n' + h.n + ' y' + h.y.map((q) => q.toFixed(2)) + ' z' + h.z.map((q) => q.toFixed(2))).join(' | ') || 'clear'); }, sec);
  console.log(r);
}
await P.close(); process.exit(0);
