// Same page, same view, interleaved blocks of frames: A = the shadow map drawn every frame (as until 3.0.1), B = drawn only on a
// change (SHADOW_CACHE_302), C = B with the soft shadow (HQ_302 AO) on. CPU time per frame (the JS + command submission), each block
// followed by an untimed GPU sync. Usage: node perf-ab.mjs <folder> <page path>
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import puppeteer from 'puppeteer-core';

const root = path.resolve(process.argv[2]);
const pagePath = process.argv[3] || '/index.html';
const types = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.json': 'application/json', '.png': 'image/png' };
const server = http.createServer((req, res) => {
  const p = decodeURIComponent(req.url.split('?')[0]);
  const f = path.join(root, p);
  if (!f.startsWith(root) || !fs.existsSync(f) || fs.statSync(f).isDirectory()) { res.writeHead(404); res.end(); return; }
  res.writeHead(200, { 'Content-Type': types[path.extname(f)] || 'application/octet-stream' });
  fs.createReadStream(f).pipe(res);
}).listen(0, '127.0.0.1');
await new Promise((r) => server.once('listening', r));
const args = ['--no-sandbox', '--disable-dev-shm-usage', '--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'];
const browser = await puppeteer.launch({ executablePath: '/usr/bin/google-chrome', headless: true, timeout: 60000, protocolTimeout: 1800000, args });
try {
  const page = await browser.newPage();
  await page.setViewport({ width: 960, height: 600 });
  await page.evaluateOnNewDocument(() => { try { for (const k of ['tm1.news.seen', 'tm2.news.seen']) localStorage.setItem(k, '9.9.9'); } catch (_) {} });
  await page.goto('http://127.0.0.1:' + server.address().port + pagePath, { waitUntil: 'domcontentloaded' });
  await page.waitForFunction(() => document.documentElement.classList.contains('tm-ready'), { timeout: 600000, polling: 1000 });
  await new Promise((r) => setTimeout(r, 2500));
  const res = await page.evaluate(async () => {
    const ctx = window.__ctx, r = window.__renderer, cam = window.__camera, sc = ctx.scene, H = window.__hq, S = window.__shc;
    if (H) { H.set(false, true); for (let i = 0; i < 600 && H.S.giWarm !== 2; i++) await new Promise((res) => setTimeout(res, 100)); H.set(false, false); }
    r.setAnimationLoop(null);
    const SYNC = true;
    const gl = r.getContext(), px = new Uint8Array(4), sync = () => gl.readPixels(0, 0, 1, 1, gl.RGBA, gl.UNSIGNED_BYTE, px);
    const T = ctx.controls.target.clone();
    const views = { start: [cam.position.toArray(), T.toArray()] };
    const out = {};
    for (const [name, [p, t]] of Object.entries(views)) {
      cam.position.fromArray(p); ctx.controls.target.fromArray(t); ctx.controls.update();
      for (let i = 0; i < 4; i++) r.render(sc, cam);
      sync();
      const acc = { A: [], B: [], C: [], D: [] };
      const block = (mode) => {
        if (H) H.set(mode === 'C' || mode === 'D', mode === 'D');
        if ((mode === 'C' || mode === 'D') && H) { H.frame(); r.render(sc, cam); sync(); }
        const a = performance.now();
        for (let i = 0; i < 3; i++) { if (mode === 'A' && S) S.force = true; if ((mode === 'C' || mode === 'D') && H) H.frame(); r.render(sc, cam); }
        if (SYNC) sync();
        acc[mode].push((performance.now() - a) / 3);
        sync();
      };
      for (let k = 0; k < 2; k++) for (const m of ['A', 'B', 'C', 'D']) block(m);
      if (H) H.set(false, false);
      const med = (v) => { const s = v.slice().sort((x, y) => x - y); return +s[Math.floor(s.length / 2)].toFixed(2); };
      out[name] = { A_everyFrame: med(acc.A), B_cached: med(acc.B), C_AO: med(acc.C), D_AO_GI: med(acc.D) };
    }
    return out;
  });
  console.log(JSON.stringify(res));
} catch (e) {
  console.log('fatal', String(e && e.message || e).slice(0, 300));
} finally {
  await browser.close();
  server.close();
}
