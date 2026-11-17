// node look.mjs <page.html> <steps.json> <outdir>
// steps: [{ name, js?, cam?, tg?, wait?, shot? (default true) }] - js runs in the page (async allowed, `C` = __TM_CTX)
import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import puppeteer from 'puppeteer-core';
const [pageFile, stepsFile, outDir] = process.argv.slice(2);
fs.mkdirSync(outDir, { recursive: true });
const steps = JSON.parse(fs.readFileSync(stepsFile, 'utf8'));
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const browser = await puppeteer.launch({
  executablePath: '/usr/bin/google-chrome', headless: true, timeout: 60000, protocolTimeout: 600000,
  args: ['--no-sandbox', '--disable-dev-shm-usage', '--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader',
    '--ignore-gpu-blocklist', '--lang=he', '--font-render-hinting=none', '--allow-file-access-from-files', '--no-first-run']
});
const errors = [];
try {
  const page = await browser.newPage();
  page.on('pageerror', (e) => errors.push('pageerror: ' + String(e.message || e).slice(0, 300)));
  page.on('console', (m) => { if (m.type() === 'error') errors.push('console: ' + m.text().slice(0, 300)); });
  await page.setViewport({ width: 1280, height: 800 });
  const t0 = Date.now();
  await page.goto(pathToFileURL(path.resolve(pageFile)).href, { waitUntil: 'load', timeout: 120000 });
  for (;;) {
    const ready = await page.evaluate(() => document.documentElement.classList.contains('tm-ready')).catch(() => false);
    if (ready) break;
    if (Date.now() - t0 > 300000) throw new Error('not ready');
    await sleep(1000);
  }
  console.log('ready in', Date.now() - t0, 'ms');
  await sleep(1500);
  for (const s of steps) {
    if (s.js) {
      const r = await page.evaluate(new Function('return (async () => { const C = window.__TM_CTX; ' + s.js + ' })()')).catch((e) => 'ERR ' + e.message);
      if (r !== undefined) console.log(s.name || 'js', '->', typeof r === 'string' ? r : JSON.stringify(r));
    }
    if (s.cam && s.tg) {
      await page.evaluate((p, t) => {
        const C = window.__TM_CTX;
        C.camera.position.set(...p);
        C.controls.target.set(...t);
        C.controls.update();
      }, s.cam, s.tg);
    }
    await sleep(s.wait || 1200);
    if (s.cam && s.tg) {   // the guard may have moved it: set it again right before the picture
      await page.evaluate((p, t) => { const C = window.__TM_CTX; C.camera.position.set(...p); C.controls.target.set(...t); C.controls.update(); }, s.cam, s.tg);
      await sleep(300);
    }
    if (s.shot !== false && s.name) {
      await page.evaluate((hidePanel) => {
        document.querySelectorAll('[role=dialog]').forEach((e) => { if (/מה חדש/.test(e.getAttribute('aria-label') || '')) e.remove(); });
        const p = document.getElementById('tm-panel'); if (p && hidePanel) p.style.visibility = 'hidden';
      }, !!process.env.NOPANEL);
      await sleep(200);
      await page.screenshot({ path: path.join(outDir, s.name + '.png') });
      console.log('shot', s.name);
    }
  }
} catch (e) {
  console.log('FAILED', e.message);
} finally {
  console.log('errors:', errors.length ? errors.join('\n') : 'none');
  await browser.close();
}
