// usage: node allviews2.mjs <pluginDir> <outJson> [mode=places|ops|both] [filter]   (allviews + the walls that fade at the target: FADE)
// clicks every place row and every opinion chip through the UI, waits for the flight, and measures: the eye's distance from the target,
// and how blank the picture is (the share of the commonest colour, the spread of the brightness). Writes a json + thumbnails of the suspects.
import { open } from '../fs/h.mjs';
import fs from 'fs';
const [dir, outJson, mode = 'both', flt] = process.argv.slice(2);
const { page, close, errs } = await open(dir, { dsf: 0.5, vw: 1280, vh: 760 });
const rx = flt ? new RegExp(flt) : null;
await page.evaluate(() => {
  const c = window.__ctx, q = window.__q;
  q.blank = () => { const url = q.grab(); return new Promise((res) => { const im = new Image(); im.onload = () => { const W = 96, H = 60, t = document.createElement('canvas'); t.width = W; t.height = H; const g = t.getContext('2d'); g.drawImage(im, 0, 0, W, H); const d = g.getImageData(0, 0, W, H).data; const cnt = new Map(); let s = 0, s2 = 0; const n = W * H;
        for (let i = 0; i < d.length; i += 4) { const k = (d[i] >> 4) << 8 | (d[i + 1] >> 4) << 4 | (d[i + 2] >> 4); cnt.set(k, (cnt.get(k) || 0) + 1); const l = 0.3 * d[i] + 0.59 * d[i + 1] + 0.11 * d[i + 2]; s += l; s2 += l * l; }
        let mx = 0; for (const v of cnt.values()) if (v > mx) mx = v; res({ top: +(mx / n).toFixed(2), sd: +Math.sqrt(Math.max(0, s2 / n - (s / n) * (s / n))).toFixed(1), colours: cnt.size, thumb: t.toDataURL('image/jpeg', 0.7) }); }; im.src = url; }); };
  // the walls that the fade loop has made see-through, and how near each is to the target (0 = the target stands in its box)
  q.faded = () => { const T = c.THREE, out = [], tg = c.controls.target, bb = new T.Box3(), v = new T.Vector3(); c.scene.traverse((o) => { const f = o.userData && o.userData.fade; if (!o.isMesh || !f || !(f.tgt < 1)) return; let vis = true; for (let p = o; p; p = p.parent) if (!p.visible) { vis = false; break; } if (!vis) return;
      try { if (!o.geometry.boundingBox) o.geometry.computeBoundingBox(); bb.copy(o.geometry.boundingBox).applyMatrix4(o.matrixWorld); const d = bb.distanceToPoint(tg); bb.getSize(v); out.push({ n: o.name || (o.parent && o.parent.name) || '?', d: +d.toFixed(1), sz: [v.x, v.y, v.z].map((u) => Math.round(u)) }); } catch (_) {} });
    out.sort((a, b) => a.d - b.d); return { n: out.length, near: out.filter((w) => w.d < 6).slice(0, 4), held: !!(c.shared.fadeHold && c.shared.fadeHold.held && c.shared.fadeHold.held()) }; };
  q.pose = () => { const p = c.camera.position, g = c.controls.target; return { d: +p.distanceTo(g).toFixed(2), cam: p.toArray().map((v) => +v.toFixed(1)), tg: g.toArray().map((v) => +v.toFixed(1)), mode: (c.camIndoors && c.camIndoors()) ? 'look' : 'orbit' }; };
});
const res = [];
const measure = async (kind, title) => {
  await page.evaluate(() => window.__q.settle(9000, 6));
  await page.waitForTimeout(500);
  const pose = await page.evaluate(() => window.__q.pose());
  const b = await page.evaluate(() => window.__q.blank());
  const sus = pose.d < 2.5 || b.top > 0.8 || b.sd < 9 || b.colours < 14;
  await page.waitForTimeout(900);
  const fd = await page.evaluate(() => window.__q.faded());
  const r = { kind, title, ...pose, top: b.top, sd: b.sd, colours: b.colours, sus, fadedN: fd.n, fadedNear: fd.near, held: fd.held };
  if (fd.near.length) console.log('FADE', kind, title, JSON.stringify(fd.near), 'held', fd.held);
  res.push(r);
  if (sus) { const fn = '/home/claude/qa/r211/sus/' + String(res.length).padStart(3, '0') + '.jpg'; fs.writeFileSync(fn, Buffer.from(b.thumb.split(',')[1], 'base64')); r.thumb = fn; console.log('SUS', kind, title, JSON.stringify({ d: pose.d, cam: pose.cam, tg: pose.tg, top: b.top, sd: b.sd, colours: b.colours })); }
};
fs.mkdirSync('/home/claude/qa/r211/sus', { recursive: true });
if (mode !== 'ops') {
  const n = await page.evaluate(() => [...document.querySelectorAll('.tm-pl button')].filter((b) => !b.closest('.tm-op')).length);
  for (let i = 0; i < n; i++) {
    const t = await page.evaluate((i) => { const b = [...document.querySelectorAll('.tm-pl button')].filter((b) => !b.closest('.tm-op'))[i]; return b ? b.textContent.trim() : ''; }, i);
    if (rx && !rx.test(t)) continue;
    await page.evaluate((i) => { const b = [...document.querySelectorAll('.tm-pl button')].filter((b) => !b.closest('.tm-op'))[i]; b.click(); }, i);
    await page.waitForTimeout(150);
    await page.evaluate(() => { const cf = document.getElementById('tm-confirm'); if (cf && window.__q.vis(cf)) { const y = cf.querySelector('.y'); if (y) y.click(); } });
    await measure('place', t);
  }
}
if (mode !== 'places') {
  const n = await page.evaluate(() => document.querySelectorAll('.tm-op').length);
  for (let i = 0; i < n; i++) {
    const cap = await page.evaluate((i) => { const e = document.querySelectorAll('.tm-op')[i]; const c = e.querySelector('.cap'); return c ? c.textContent.trim() : ''; }, i);
    if (rx && !rx.test(cap)) continue;
    const m = await page.evaluate((i) => document.querySelectorAll('.tm-op')[i].querySelectorAll('.bb button').length, i);
    for (let j = 0; j < m; j++) {
      const t = await page.evaluate(([i, j]) => { const b = document.querySelectorAll('.tm-op')[i].querySelectorAll('.bb button')[j]; b.click(); return b.textContent.trim(); }, [i, j]);
      await page.waitForTimeout(150);
      await page.evaluate(() => { const cf = document.getElementById('tm-confirm'); if (cf && window.__q.vis(cf)) { const y = cf.querySelector('.y'); if (y) y.click(); } });
      await measure('op', cap + ' :: ' + t);
    }
    // back to the first chip (the default reading)
    await page.evaluate((i) => { const b = document.querySelectorAll('.tm-op')[i].querySelectorAll('.bb button')[0]; if (b) b.click(); }, i);
    await page.waitForTimeout(200);
  }
}
fs.writeFileSync(outJson, JSON.stringify(res, null, 1));
console.log('measured', res.length, 'suspects', res.filter((r) => r.sus).length);
console.log('errs', errs.length, errs.slice(0, 6).join(' | '));
await close();
