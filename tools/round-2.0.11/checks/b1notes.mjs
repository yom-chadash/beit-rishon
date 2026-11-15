import { open } from '../../fs/h.mjs';
const [,, dir, prefix] = process.argv;
const P = await open(dir, { dsf: 1, vw: 1000, vh: 640 }); const pg = P.page;
await P.settle(30000, 3); await pg.evaluate(() => { window.__q.skip = false; }); await pg.waitForTimeout(1500);
// the ark row: its second chip
const r1 = await pg.evaluate(() => { const r = [...document.querySelectorAll('.tm-op')].find((x) => x.textContent.includes('מה היה מונח בארון')); if (!r) return 'no row'; const bs = [...r.querySelectorAll('button')].filter((b) => /רבי יהודה/.test(b.textContent)); if (!bs.length) return 'no chip'; bs[0].click(); return 'clicked'; });
await pg.waitForTimeout(3500);
const s1 = await pg.evaluate(() => ({ open: window.__ctx.shared.arkInside.on, cam: window.__ctx.camera.position.toArray().map((v) => +v.toFixed(1)) }));
await P.rshot(prefix + 'ark.png');
console.log('ark', r1, JSON.stringify(s1));
// the ramp places follow the altar
const r2 = await pg.evaluate(() => { const A = window.__ctx.shared.altarPlace; A.set('north'); const bs = [...document.querySelectorAll('.tm-pl button')].filter((b) => !b.closest('.tm-op')); const b = bs.find((x) => x.textContent.trim() === 'הכבש'); if (!b) return 'no place'; b.click(); return A.current; });
await pg.waitForTimeout(3500);
const s2 = await pg.evaluate(() => ({ tg: window.__ctx.controls.target.toArray().map((v) => +v.toFixed(1)) }));
console.log('ramp', r2, JSON.stringify(s2));
console.log('errors:', JSON.stringify(P.errs.slice(0, 4)));
await P.close(); process.exit(0);
