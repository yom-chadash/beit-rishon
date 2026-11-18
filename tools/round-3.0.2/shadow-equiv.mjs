// SHADOW_CACHE_302 check: the same changes made in two builds (old: the map drawn every frame; new: drawn only when it changed) must
// give the same pictures. Usage: node shadow-equiv.mjs <old folder> <new folder> <page path> <out dir>
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import puppeteer from 'puppeteer-core';

const [oldDir, newDir, pagePath, outDir] = process.argv.slice(2);
fs.mkdirSync(outDir, { recursive: true });
const types = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.json': 'application/json', '.png': 'image/png' };
function serve(root) {
  root = path.resolve(root);
  const s = http.createServer((req, res) => {
    const p = decodeURIComponent(req.url.split('?')[0]);
    const f = path.join(root, p);
    if (!f.startsWith(root) || !fs.existsSync(f) || fs.statSync(f).isDirectory()) { res.writeHead(404); res.end(); return; }
    res.writeHead(200, { 'Content-Type': types[path.extname(f)] || 'application/octet-stream' });
    fs.createReadStream(f).pipe(res);
  }).listen(0, '127.0.0.1');
  return new Promise((r) => s.once('listening', () => r(s)));
}
const args = ['--no-sandbox', '--disable-dev-shm-usage', '--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'];

async function run(dir, tag) {
  const server = await serve(dir);
  const browser = await puppeteer.launch({ executablePath: '/usr/bin/google-chrome', headless: true, timeout: 60000, args });
  const shots = [];
  try {
    const page = await browser.newPage();
    await page.setViewport({ width: 960, height: 600 });
    await page.evaluateOnNewDocument(() => { try { for (const k of ['tm1.news.seen', 'tm2.news.seen']) localStorage.setItem(k, '9.9.9'); } catch (_) {} });
    await page.goto('http://127.0.0.1:' + server.address().port + pagePath, { waitUntil: 'domcontentloaded' });
    await page.waitForFunction(() => document.documentElement.classList.contains('tm-ready'), { timeout: 600000, polling: 1000 });
    await new Promise((r) => setTimeout(r, 2000));
    await page.evaluate(() => {
      document.querySelectorAll('[id^=tm-news]').forEach((e) => e.remove());
      const ctx = window.__ctx, r = window.__renderer, cam = window.__camera, ctl = ctx.controls, sc = ctx.scene;
      r.setAnimationLoop(null);
      const T = ctl.target.clone();
      const W = {};
      window.__W = W;
      W.draw = () => { for (let i = 0; i < 2; i++) r.render(sc, cam); return r.domElement.toDataURL('image/png'); };
      // a caster seen from the eye (the same one in both builds: the same scene, the same order): near the target, of a fair size,
      // and the first thing a ray from the eye meets
      const V = cam.position.constructor, v = new V(), list = [];
      sc.traverseVisible((o) => {
        if (!o.isMesh || !o.castShadow || o.isInstancedMesh || !o.geometry) return;
        if (!o.geometry.boundingSphere) o.geometry.computeBoundingSphere();
        const bs = o.geometry.boundingSphere; o.getWorldPosition(v);
        const rad = bs.radius * o.matrixWorld.getMaxScaleOnAxis();
        if (rad > 1.5 && rad < 12 && v.distanceTo(T) < 160) list.push([v.distanceTo(T), o, v.clone()]);
      });
      list.sort((a, b) => a[0] - b[0]);
      W.obj = null;
      const el = r.domElement, Z = window.__zoomQA;
      for (const [, o, p] of list.slice(0, 150)) {
        cam.position.set(p.x + 30, p.y + 26, p.z + 22); ctl.target.copy(p); ctl.update(); cam.updateMatrixWorld();
        if (!Z || !Z.at) { W.obj = o; break; }
        const q = p.clone().project(cam), bb = el.getBoundingClientRect();
        const h = Z.at(bb.left + (q.x + 1) / 2 * bb.width, bb.top + (1 - q.y) / 2 * bb.height);
        const rad = o.geometry.boundingSphere.radius * o.matrixWorld.getMaxScaleOnAxis();
        if (h && Math.hypot(h[0] - p.x, h[1] - p.y, h[2] - p.z) < rad * 1.1) { W.obj = o; break; }
      }
      if (!W.obj) { cam.position.set(T.x + 55, T.y + 38, T.z + 35); ctl.target.copy(T); ctl.update(); }
      const il = [], c0 = ctl.target.clone();
      sc.traverseVisible((o) => { if (o.isInstancedMesh && o.castShadow && o.count > 2) { o.getWorldPosition(v); il.push([v.distanceTo(c0), o]); } });
      il.sort((a, b) => a[0] - b[0]);
      W.inst = il.length ? il[0][1] : null;
      W.info = { picked: !!W.obj, name: W.obj && (W.obj.name || W.obj.parent && W.obj.parent.name), at: ctl.target.toArray().map((x) => +x.toFixed(1)), inst: !!W.inst, zq: !!window.__zoomQA };
    });
    const steps = [
      ['0-start', () => {}],
      ['1-moved', () => { const o = window.__W.obj; if (o) { o.position.x += 6; o.position.z += 4; } }],
      ['2-hidden', () => { const o = window.__W.obj; if (o) o.visible = false; }],
      ['3-back', () => { const o = window.__W.obj; if (o) { o.visible = true; o.position.x -= 6; o.position.z -= 4; } }],
      ['4-instance', () => { const m = window.__W.inst; if (m) { const M = new window.__camera.matrix.constructor(); m.getMatrixAt(0, M); M.elements[13] += 5; M.elements[12] += 4; m.setMatrixAt(0, M); m.instanceMatrix.needsUpdate = true; } }],
      ['5-material', () => { const o = window.__W.obj; if (o) { o.material = o.material.clone(); o.material.visible = false; } }],
      ['6-section', () => { const S = window.__ctx.shared && window.__ctx.shared.section; if (S && S.set) S.set(true, 'z', window.__ctx.controls.target.z); }],
      ['7-sectionOff', () => { const S = window.__ctx.shared && window.__ctx.shared.section; if (S && S.set) S.set(false, 'z', 0); }],
      ['8-sun', () => { window.__ctx.scene.traverse((o) => { if (o.isDirectionalLight && o.castShadow) { o.position.x += 120; o.updateMatrixWorld(); } }); }],
    ];
    const info = await page.evaluate(() => window.__W.info);
    for (const [name, fn] of steps) {
      await page.evaluate(fn);
      const d0 = await page.evaluate(() => window.__shc ? window.__shc.draws : -1);
      const url = await page.evaluate(() => window.__W.draw());
      const d1 = await page.evaluate(() => window.__shc ? window.__shc.draws : -1);
      const f = path.join(outDir, tag + '-' + name + '.png');
      fs.writeFileSync(f, Buffer.from(url.split(',')[1], 'base64'));
      shots.push([name, f, d1 - d0]);
    }
    const shc = await page.evaluate(() => window.__shc ? { frames: window.__shc.frames, draws: window.__shc.draws } : null);
    return { info, shots, shc };
  } finally {
    await browser.close();
    server.close();
  }
}
const A = await run(oldDir, 'old');
const B = await run(newDir, 'new');
console.log('picked', JSON.stringify(A.info), JSON.stringify(B.info), 'new cache', JSON.stringify(B.shc));
for (let i = 0; i < A.shots.length; i++) {
  let v = '?';
  try { execFileSync('compare', ['-metric', 'RMSE', A.shots[i][1], B.shots[i][1], 'null:'], { stdio: 'pipe' }); v = '0 (identical)'; }
  catch (e) { v = String(e.stderr || e.stdout || e.message).trim(); }
  let d = '';
  if (i > 0) { try { execFileSync('compare', ['-metric', 'RMSE', A.shots[i][1], A.shots[i - 1][1], 'null:'], { stdio: 'pipe' }); d = 'same as previous'; } catch (e) { d = 'vs previous ' + String(e.stderr || '').trim(); } }
  console.log(A.shots[i][0].padEnd(14), 'old vs new:', v.padEnd(28), '| maps drawn (new):', B.shots[i][2], '| old step', d);
}
