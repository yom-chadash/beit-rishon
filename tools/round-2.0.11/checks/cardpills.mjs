import { open } from '../../fs/h.mjs';
const [,, dir, ...titles] = process.argv;
const P = await open(dir, { dsf: 1, vw: 1000, vh: 640 }); const pg = P.page;
await P.settle(30000, 3); await pg.evaluate(() => { window.__q.skip = false; }); await pg.waitForTimeout(1500);
for (const t of titles) {
  await pg.evaluate((t) => { const bs = [...document.querySelectorAll('.tm-pl button')].filter((b) => !b.closest('.tm-op')); const b = bs.find((x) => x.textContent.trim().startsWith(t)); if (b) b.click(); }, t);
  await pg.waitForTimeout(4500);
  const r = await pg.evaluate(() => { const h = document.getElementById('tm-card-pills'); return h && h.style.display !== 'none' ? [...h.querySelectorAll('button')].map((b) => b.textContent) : null; });
  console.log(t, '->', JSON.stringify(r));
}
console.log('errors:', JSON.stringify(P.errs.slice(0, 4)));
await P.close(); process.exit(0);
