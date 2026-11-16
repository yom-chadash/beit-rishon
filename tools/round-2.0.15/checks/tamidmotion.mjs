// the morning demo, sampled every 0.1 s of every stage (TM.seek - the state is computed, not played): figures that JUMP (more than
// 1.2 amot in 0.1 s while seen), and figures whose body's middle is INSIDE a solid of the model (a wall, a step, a vessel; boxes first,
// then a ray up through that mesh counts its faces). node tamidmotion.mjs <plugin> [order abba|rambam] [step 0.1]
import { open } from '../fs/h.mjs';
const [,, dir, order = 'abba', stepS = '0.1'] = process.argv;
const P = await open(dir, { dsf: 0.5, vw: 900, vh: 560 }); const pg = P.page;
await P.settle(30000, 3);
const r = await pg.evaluate(async ([order, step]) => {
  const c = window.__ctx, S = c.shared, TM = S.tamid, T = S.tour, TH = c.THREE, wait = (ms) => new Promise((r) => setTimeout(r, ms));
  TM.setOrder(order); T.start('tamid', { speed: 1 }); await wait(1500); T.pause(true); await wait(300);
  const list = TM.list(order);
  const KEYS = ['t', 'mem', 'mc', 'cv', 'k', 'f', 'e', 'ba', 'sg', 'p', 'old', 'hp', 'b1', 'b2', 'b3', 'b4', 'tr1', 'tr2'];
  for (let i = 1; i <= 13; i++) KEYS.push('s' + i);
  for (let i = 1; i <= 13; i++) KEYS.push('l' + i);
  for (let i = 1; i <= 13; i++) KEYS.push('v' + i);
  // the solids: every visible mesh outside the demo's own world and the labels, box-shaped or a closed extrusion, not a floor or the ground
  TM.seek(0, 0.5); c.scene.updateMatrixWorld(true);
  let world = null; c.scene.traverse((o) => { if (!world && o.name === 'tamid-world') world = o; });
  const solids = []; const m4 = new TH.Matrix4();
  const skip = (o) => { for (let a = o; a; a = a.parent) { if (a === world || a.name === 'labels' || a.visible === false) return true; } return false; };
  c.scene.traverse((o) => { if (!o.isMesh || skip(o)) return; const gt = o.geometry && o.geometry.type; if (!/BoxGeometry|ExtrudeGeometry|CylinderGeometry/.test(gt || '')) return;
    const mt = Array.isArray(o.material) ? o.material[0] : o.material; if (mt && (mt.transparent && mt.opacity < 0.6)) return; if (o.userData && o.userData.noPick) return;
    if (!o.geometry.boundingBox) o.geometry.computeBoundingBox();
    const n = o.isInstancedMesh ? o.count : 1;
    for (let k = 0; k < n; k++) { const mw = o.isInstancedMesh ? (o.getMatrixAt(k, m4), m4.clone().premultiply(o.matrixWorld)) : o.matrixWorld.clone(); const b = o.geometry.boundingBox.clone().applyMatrix4(mw);
      const sx = b.max.x - b.min.x, sy = b.max.y - b.min.y, sz = b.max.z - b.min.z; if (sx > 400 || sz > 400 || sy < 0.6) continue;   // the ground, the floors' slabs
      let nm = ''; for (let a = o; a && !nm; a = a.parent) nm = a.name || '';
      solids.push({ b, o, k, mw, nm, gt }); } });
  const cell = new Map(), CS = 8, key = (x, z) => Math.floor(x / CS) + ',' + Math.floor(z / CS);
  solids.forEach((s, idx) => { for (let x = Math.floor(s.b.min.x / CS); x <= Math.floor(s.b.max.x / CS); x++) for (let z = Math.floor(s.b.min.z / CS); z <= Math.floor(s.b.max.z / CS); z++) { const kk = x + ',' + z; if (!cell.has(kk)) cell.set(kk, []); cell.get(kk).push(idx); } });
  const rc = new TH.Raycaster(); const up = new TH.Vector3(0, 1, 0), dn = new TH.Vector3(0, -1, 0), pv = new TH.Vector3();
  const lp = new TH.Vector3(), inv = new TH.Matrix4();
  const inside = (x, y, z) => { const L = cell.get(key(x, z)); if (!L) return null; pv.set(x, y, z);
    for (const idx of L) { const s = solids[idx]; if (!s.b.containsPoint(pv)) continue;
      if (s.gt === 'BoxGeometry') {   // exact: the point in the box's own frame
        inv.copy(s.mw).invert(); lp.copy(pv).applyMatrix4(inv); const bb = s.o.geometry.boundingBox;
        if (lp.x > bb.min.x + 0.02 && lp.x < bb.max.x - 0.02 && lp.y > bb.min.y + 0.02 && lp.y < bb.max.y - 0.02 && lp.z > bb.min.z + 0.02 && lp.z < bb.max.z - 0.02) return s;
        continue; }
      if (s.o.isInstancedMesh) continue;
      // a closed solid (an extrusion with openings, a cylinder): faces above AND below the point, both sides counted
      const ms = Array.isArray(s.o.material) ? s.o.material : [s.o.material], sides = ms.map((m) => m.side); ms.forEach((m) => { m.side = TH.DoubleSide; });
      const cnt = (dir) => { rc.set(pv, dir); rc.near = 0; rc.far = 1e4; const out = []; s.o.raycast(rc, out); return out.length; };
      const a = cnt(up), b = cnt(dn);
      ms.forEach((m, i) => { m.side = sides[i]; });
      if (a % 2 === 1 && b % 2 === 1) return s; }
    return null; };
  const jumps = [], walls = [], cuts = []; let prev = {};
  for (let i = 0; i < list.length; i++) {
    const dur = TM.duration(i, order);
    for (let sec = 0; sec <= dur + 1e-6; sec += step) {
      TM.seek(i, sec);
      for (const kf of KEYS) { const f = TM.figAt(kf); if (!f || !f.vis || !isFinite(f.x)) { delete prev[kf]; continue; }
        const p = prev[kf];
        if (p) { const d = Math.hypot(f.x - p.x, f.z - p.z, (f.y - p.y)); if (d > 1.2) (p.i === i ? jumps : cuts).push([list[i], +sec.toFixed(1), kf, +d.toFixed(1), [+p.x.toFixed(1), +p.z.toFixed(1)], [+f.x.toFixed(1), +f.z.toFixed(1)]]); }
        prev[kf] = { x: f.x, y: f.y, z: f.z, i };
        const s = inside(f.x, f.y + 1.1, f.z);
        if (s) walls.push([list[i], +sec.toFixed(1), kf, s.nm + '/' + s.gt.replace('Geometry', ''), [+f.x.toFixed(1), +f.y.toFixed(1), +f.z.toFixed(1)], 'box x' + s.b.min.x.toFixed(1) + '..' + s.b.max.x.toFixed(1) + ' z' + s.b.min.z.toFixed(1) + '..' + s.b.max.z.toFixed(1) + ' y' + s.b.min.y.toFixed(1) + '..' + s.b.max.y.toFixed(1)]); }
    }
  }
  // fold: one line per (stage, figure, what) with its first and last second
  const fold = (arr, kf) => { const m = new Map(); for (const a of arr) { const k2 = a[0] + '|' + a[2] + '|' + (kf ? a[3] : ''); if (!m.has(k2)) m.set(k2, { first: a, last: a[1], n: 0 }); const e = m.get(k2); e.last = a[1]; e.n++; } return [...m.values()].map((e) => e.first.concat(['..' + e.last, 'n' + e.n])); };
  return { stages: list.length, solids: solids.length, jumps: fold(jumps, false), cuts: cuts.length, cutsList: cuts.slice(0, 40), walls: fold(walls, true) };
}, [order, +stepS]);
console.log('stages', r.stages, 'solids', r.solids);
console.log('JUMPS (' + r.jumps.length + '):'); for (const j of r.jumps) console.log('  ' + JSON.stringify(j));
console.log('WALLS (' + r.walls.length + '):'); for (const w of r.walls) console.log('  ' + JSON.stringify(w));
console.log('CUTS between stages:', r.cuts); for (const c2 of r.cutsList) console.log('  ' + JSON.stringify(c2));
console.log('errors:', JSON.stringify(P.errs.slice(0, 6)));
await P.close(); process.exit(0);
