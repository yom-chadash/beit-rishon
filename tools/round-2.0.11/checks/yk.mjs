import { open } from '../../fs/h.mjs';
const [,, dir, mode] = process.argv;
const P = await open(dir, { dsf: 1, vw: 1000, vh: 640 }); const pg = P.page;
await P.settle(30000, 3);
await pg.evaluate((mode) => { const S = window.__ctx.shared; if (S.parochotCount && S.parochotCount.set) S.parochotCount.set(mode); S.ykEntry.start(); }, mode);
const seen = []; let last = '';
for (let i = 0; i < 80; i++) {
  await pg.waitForTimeout(1000);
  const r = await pg.evaluate(() => { const S = window.__ctx.shared; const els = [...document.querySelectorAll('div')].filter((e) => e.id && /cap/i.test(e.id) && e.textContent && getComputedStyle(e).display !== 'none'); return { on: S.ykEntry.on, t: S.walk && S.walk.now ? +S.walk.now().toFixed(1) : null, cap: els.map((e) => e.textContent).join(' | ') }; });
  if (r.cap !== last) { seen.push([i + 1, r.t, r.cap.slice(0, 70)]); last = r.cap; }
  if (!r.on) { seen.push([i + 1, 'END']); break; }
}
for (const s of seen) console.log(JSON.stringify(s));
console.log('errors:', JSON.stringify(P.errs.slice(0, 5)));
await P.close(); process.exit(0);
