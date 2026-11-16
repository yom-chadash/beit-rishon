// the water-drawing lamps' demonstration: run it to t (real time), hold it, look at one lamp's cups from near: node simcha.mjs <plugin> <out> t[@lamp] ...
import { open } from '../fs/h.mjs';
import fs from 'node:fs';
const [,, dir, out, ...items] = process.argv; fs.mkdirSync(out, { recursive: true });
const P = await open(dir, { dsf: 1, vw: 1100, vh: 700 }); const pg = P.page;
await P.settle(30000, 3);
let n = 0;
for (const it of items) {
  n++; const [tS, lS, vS] = it.split('@'); const tt = +tS, lamp = lS ? +lS : 0, view = vS || 'side';
  const st = await pg.evaluate(async ([tt, lamp, view]) => { const c = window.__ctx, SH = c.shared, T = c.THREE;
    SH.features.simchaMenorot.on(); SH.simchaDemo.start(); const t0 = performance.now();
    while ((performance.now() - t0) / 1000 < tt) await new Promise((r) => setTimeout(r, 20));
    SH.simchaDemo.pause(); await new Promise((r) => setTimeout(r, 200));
    c.scene.updateMatrixWorld(true);
    // the jars (their colour) and the cups (gold lathes with 18 segments) of this lamp
    const jars = [], cups = []; const v = new T.Vector3();
    c.scene.traverse((o) => { if (!o.isMesh) return; const m = o.material; if (m && m.color && m.color.getHex() === 0xb06a3c) { o.getWorldPosition(v); jars.push({ o, p: v.clone() }); } });
    c.scene.traverse((o) => { if (!o.isMesh || !o.geometry || o.geometry.type !== 'LatheGeometry') return; const pa = o.geometry.parameters; if (!pa || pa.segments !== 18) return; o.getWorldPosition(v); cups.push(v.clone()); });
    const SP = [[141, -20], [181, -20], [141, 20], [181, 20]][lamp];
    const myCups = cups.filter((p) => Math.hypot(p.x - SP[0], p.z - SP[1]) < 3);
    const myJars = jars.filter((j) => Math.hypot(j.p.x - SP[0], j.p.z - SP[1]) < 5);
    const cy = myCups.length ? myCups[0].y : 0;
    // the mouth of each jar: its local top (0, 0.66, 0) in world
    const mouths = myJars.map((j) => { const q = new T.Vector3(0, 0.66, 0); j.o.localToWorld(q); return q; });
    const rep = myCups.map((cp) => { let best = null; for (const mth of mouths) { const d = Math.hypot(mth.x - cp.x, mth.z - cp.z); if (!best || d < best.d) best = { d, dy: mth.y - cp.y }; } return 'cup ' + [cp.x, cp.z].map((q) => q.toFixed(1)) + ' mouth off ' + (best ? best.d.toFixed(2) + ' dy ' + best.dy.toFixed(2) : '-'); });
    const cam = view === 'top' ? [SP[0] + 0.5, cy + 9, SP[1] + 0.5] : [SP[0] + 6.5, cy + 2.2, SP[1] + 5.5];
    c.camera.position.set(cam[0], cam[1], cam[2]); c.controls.target.set(SP[0], cy + 0.2, SP[1]); c.camera.lookAt(SP[0], cy + 0.2, SP[1]); c.controls.update && c.controls.update();
    return 't ' + tt + ' cups ' + myCups.length + ' jars ' + myJars.length + ' cupY ' + cy.toFixed(2) + '\n  ' + rep.join('\n  '); }, [tt, lamp, view]);
  await pg.waitForTimeout(300); await P.settle(8000, 3);
  const name = out + '/s' + String(n).padStart(2, '0') + '_' + String(tt).replace('.', 'p') + '_' + lamp + '_' + view + '.png';
  await P.rshot(name); console.log(name, st);
  await pg.evaluate(() => { window.__ctx.shared.simchaDemo.stop(); });
}
console.log('errors:', JSON.stringify(P.errs.slice(0, 4)));
await P.close(); process.exit(0);
