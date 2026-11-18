// Capture a fixed set of views of one house page, for before/after comparison.
// Usage: node views.mjs <folder to serve> <page path, e.g. /rishon/index.html> <out dir> [max views, default 36]
// Clicks the buttons of the views grid and of the panel's tree (sampled evenly when there are more than max), waits
// for the flight, hides the panel and the card, and saves NN.png (640x400) plus index.json (NN -> title, camera)
// and errors.json (console errors). Network traffic keeps going through the environment's proxy (no proxy flags);
// the page is served from 127.0.0.1, which Chrome never sends to a proxy.
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import puppeteer from 'puppeteer-core';

const root = path.resolve(process.argv[2]);
const pagePath = process.argv[3] || '/index.html';
const outDir = path.resolve(process.argv[4] || 'views');
const maxViews = +(process.argv[5] || 36);
fs.mkdirSync(outDir, { recursive: true });
const types = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.json': 'application/json', '.png': 'image/png' };
const server = http.createServer((req, res) => {
  const p = decodeURIComponent(req.url.split('?')[0]);
  const f = path.join(root, p);
  if (!f.startsWith(root) || !fs.existsSync(f) || fs.statSync(f).isDirectory()) { res.writeHead(404); res.end(); return; }
  res.writeHead(200, { 'Content-Type': types[path.extname(f)] || 'application/octet-stream' });
  fs.createReadStream(f).pipe(res);
}).listen(0, '127.0.0.1');
await new Promise((r) => server.once('listening', r));
const port = server.address().port;
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const SEL = '#tm-views button, details.tm-pl:not(.tm-ops-det) > div > button';

const browser = await puppeteer.launch({
  executablePath: '/usr/bin/google-chrome', headless: true, timeout: 60000,
  args: ['--no-sandbox', '--disable-dev-shm-usage', '--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist', '--lang=he', '--font-render-hinting=none']
});
const errors = [], index = [];
try {
  const page = await browser.newPage();
  page.setDefaultTimeout(60000);
  await page.setViewport({ width: 960, height: 600, deviceScaleFactor: 1 });
  // no "מה חדש" window: mark every version as seen (the keys of both houses), as tools/qa.mjs does
  await page.evaluateOnNewDocument((ao) => {
    try { localStorage.setItem('tm1.news.seen', '9.9.9'); localStorage.setItem('tm2.news.seen', '9.9.9'); localStorage.setItem('tm.hq.ao', ao); } catch (_) {}
  }, process.env.HQAO === '1' ? '1' : '0');
  page.on('console', (m) => { if (m.type() === 'error' && !/favicon|status of 404/.test(m.text())) errors.push(m.text().slice(0, 300)); });
  page.on('pageerror', (e) => errors.push('pageerror: ' + String(e && e.message || e).slice(0, 300)));
  const t0 = Date.now();
  await page.goto('http://127.0.0.1:' + port + pagePath, { waitUntil: 'domcontentloaded' });
  await page.waitForFunction(() => document.documentElement.classList.contains('tm-ready'), { timeout: 240000, polling: 1000 });
  const readyMs = Date.now() - t0;
  await page.evaluate(() => { const n = document.getElementById('tm-news'); if (n) n.remove(); });
  await page.evaluate(async () => { const H = window.__hq; H.set(false, true); for (let i = 0; i < 600 && H.S.giWarm !== 2; i++) await new Promise((r) => setTimeout(r, 100)); H.set(false, false); });
  const titles = await page.evaluate((sel) => [...document.querySelectorAll(sel)].map((b) => (b.title || b.textContent || '').trim().slice(0, 60)), SEL);
  const pick = [];
  if (titles.length <= maxViews) titles.forEach((_, i) => pick.push(i));
  else for (let k = 0; k < maxViews; k++) pick.push(Math.round(k * (titles.length - 1) / (maxViews - 1)));
  for (const i of pick) {
    const nn = String(i + 1).padStart(3, '0');
    await page.evaluate((sel, i) => {
      const b = [...document.querySelectorAll(sel)][i];
      const d = b.closest('details');
      if (d) d.open = true;
      b.click();
    }, SEL, i);
    await sleep(900);
    await page.evaluate(() => { const cf = document.getElementById('tm-confirm'); if (cf && cf.style.display === 'flex') { const y = cf.querySelector('.y'); if (y) y.click(); } });
    await sleep(2700);
    await page.evaluate(() => { for (const id of ['tm-xcard', 'tm-card', 'tm-panel']) { const e = document.getElementById(id); if (e) e.style.visibility = 'hidden'; } document.querySelectorAll('[id^="tm-news"]').forEach((e) => { if (e.id !== 'tm-news-btn') e.remove(); }); });
    await sleep(400);
    const cam = await page.evaluate(() => { try { const c = window.__camera; return c.position.toArray().map((x) => +x.toFixed(1)); } catch (_) { return null; } });
    const shots = await page.evaluate(() => {
      const H = window.__hq, r = window.__renderer, ctx = window.__ctx, out = {};
      const draw = () => { r.render(ctx.scene, window.__camera); return r.domElement.toDataURL('image/png'); };
      H.set(false, false); H.frame(); out.off = draw();
      H.set(true, false); H.frame(); out.on = draw();
      H.show(); out.ao = r.domElement.toDataURL('image/png');
      H.set(false, true); H.frame(); out.gi = draw();
      H.show('gi'); out.gitex = r.domElement.toDataURL('image/png');
      H.set(true, true); H.frame(); out.both = draw();
      H.set(false, false); H.frame();
      return out;
    });
    for (const k of ['off', 'on', 'ao', 'gi', 'gitex', 'both']) fs.writeFileSync(path.join(outDir, nn + '-' + k + '.png'), Buffer.from(shots[k].split(',')[1], 'base64'));
    index.push({ n: nn, title: titles[i], cam });
    await page.evaluate(() => { for (const id of ['tm-xcard', 'tm-card', 'tm-panel']) { const e = document.getElementById(id); if (e) e.style.visibility = ''; } });
  }
  fs.writeFileSync(path.join(outDir, 'index.json'), JSON.stringify(index, null, 1), 'utf8');
  fs.writeFileSync(path.join(outDir, 'errors.json'), JSON.stringify(errors, null, 1), 'utf8');
  console.log(JSON.stringify({ page: pagePath, readyMs, buttons: titles.length, captured: index.length, errors: errors.length }));
} finally {
  await browser.close();
  server.close();
}
