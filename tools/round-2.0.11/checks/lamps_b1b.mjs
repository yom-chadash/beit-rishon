import { open } from '../../fs/h.mjs';
const [,, dir, prefix] = process.argv;
const P = await open(dir, { dsf: 1, vw: 1000, vh: 640 }); const pg = P.page;
await P.settle(30000, 3);
// the flames' own places: the meshes named by the lamps module (search the scene for small emissive flame meshes near the menorot)
const info = await pg.evaluate(() => { const c = window.__ctx, T = c.THREE, out = []; const v = new T.Vector3();
  c.scene.traverse((o) => { if (o.isInstancedMesh && /flame|להב|nozzle|spout|side/i.test(o.name || '')) { const m = new T.Matrix4(); const pts = []; for (let i = 0; i < Math.min(o.count, 80); i++) { o.getMatrixAt(i, m); v.setFromMatrixPosition(m).applyMatrix4(o.matrixWorld); pts.push([+v.x.toFixed(2), +v.y.toFixed(2), +v.z.toFixed(2)]); } out.push({ n: o.name, count: o.count, vis: o.visible, first: pts.slice(0, 8) }); } });
  return out; });
console.log(JSON.stringify(info).slice(0, 1500));
const titles = await pg.evaluate(() => [...document.querySelectorAll('.tm-pl button')].map((b) => (b.title || b.textContent).trim()).filter((t) => /מנור/.test(t)));
const t = titles.find((x) => /מנורת משה/.test(x)) || titles[0];
await pg.evaluate((t) => { const b = [...document.querySelectorAll('.tm-pl button')].find((x) => (x.title || x.textContent).trim() === t); b.click(); }, t);
await pg.waitForTimeout(3500);
const cam = await pg.evaluate(() => { const c = window.__ctx; return [c.camera.position.toArray().map((v) => +v.toFixed(2)), c.controls.target.toArray().map((v) => +v.toFixed(2))]; });
console.log(t, JSON.stringify(cam));
const tg = cam[1];
const lab = await pg.evaluate(() => { const rows = [...document.querySelectorAll('#tm-panel label, #tm-panel .tm-row, #tm-panel div')].filter((e) => e.children.length < 4 && /^\s*תוויות/.test(e.textContent || '')); const inp = rows.map((r) => r.querySelector('input[type=checkbox]')).find(Boolean); if (inp && inp.checked) { inp.click(); return 'labels off'; } return inp ? 'already off' : 'no checkbox'; });
console.log(lab);
await pg.evaluate(() => { const c = window.__ctx; const cl = document.querySelector('#tm-xcard .x, #tm-card .x'); if (cl) cl.click(); });
for (const [k, dx, dy, dz] of [['top', 0.01, 2.6, 0.5], ['south', 0.3, 1.9, 2.0], ['east', 2.2, 1.9, 0.2]]) {
  await pg.evaluate(([tg, dx, dy, dz]) => { const c = window.__ctx; c.camera.position.set(tg[0] + dx, tg[1] + dy, tg[2] + dz); c.controls.target.set(tg[0], tg[1] + 0.9, tg[2]); c.controls.update(); }, [tg, dx, dy, dz]);
  await pg.waitForTimeout(1500); await P.rshot(prefix + '_' + k + '.png');
}
console.log('errors:', JSON.stringify(P.errs.slice(0, 5)));
await P.close(); process.exit(0);
