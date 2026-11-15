import { open } from '../../fs/h.mjs';
const [,, dir, prefix] = process.argv;
const P = await open(dir, { dsf: 1, vw: 1000, vh: 640 }); const pg = P.page;
await P.settle(30000, 3); await pg.evaluate(() => { window.__q.skip = false; }); await pg.waitForTimeout(1500);
await pg.evaluate(() => { const bs = [...document.querySelectorAll('.tm-pl button')].filter((b) => !b.closest('.tm-op')); const b = bs.find((x) => x.textContent.trim().startsWith('מנורות של זהב')); b.click(); });
const t0 = Date.now();
for (const at of [4, 11.5, 19]) {
  const wait = at * 1000 - (Date.now() - t0); if (wait > 0) await pg.waitForTimeout(wait);
  const st = await pg.evaluate(() => { const L = window.__ctx.layers; return [0, 1, 2].map((i) => !!(L['simchaCap' + i] && L['simchaCap' + i].visible)).concat([window.__ctx.shared.simchaDemo.running()]); });
  await pg.screenshot({ path: prefix + at + '.png' });
  console.log(at, JSON.stringify(st));
}
console.log('errors:', JSON.stringify(P.errs.slice(0, 4)));
await P.close(); process.exit(0);
