import { open } from '../../fs/h.mjs';
const [,, dir, prefix] = process.argv;
const P = await open(dir, { dsf: 1, vw: 1100, vh: 700 }); const pg = P.page;
await P.settle(30000, 3);
const out = {};
out.rows = await pg.evaluate(() => [...document.querySelectorAll('.tm-op')].map((r) => (r.querySelector('.cap') || r).textContent.trim().slice(0, 34)).slice(0, 40));
const chip = (i) => pg.evaluate((i) => { const r = [...document.querySelectorAll('.tm-op')].find((x) => x.textContent.includes('ארון יהוידע — שניים או אחד')); if (!r) return null; const bs = r.querySelectorAll('.bb button'); if (!bs[i]) return 'no chip'; bs[i].click(); return bs[i].textContent; }, i);
const st = () => pg.evaluate(() => { const y = window.__ctx.shared.yehoyada, L = window.__ctx.layers; return { on: y.on, mode: y.mode, flags: [L.yehoyadaMalbim.visible, L.yehoyadaRashiGate.visible, L.yehoyadaRashiAltar.visible], card: (document.querySelector('#tm-xcard .h') || {}).textContent, body: ((document.querySelector('#tm-xcard .b') || {}).textContent || '').slice(0, 80), chips: ((document.querySelector('#tm-xcard .o') || {}).textContent || '').slice(0, 160) }; });
for (const i of [1, 0]) { out['chip' + i] = await chip(i); await pg.waitForTimeout(2600); out['st' + i] = await st(); await P.rshot(prefix + '_' + i + '.png'); }
// the place's card carries the row
await pg.evaluate(() => { const b = [...document.querySelectorAll('.tm-pl button')].find((x) => (x.title || x.textContent).trim() === 'ארון יהוידע שבשער — לתקלין עתיקין'); if (b) b.click(); }); await pg.waitForTimeout(2500);
out.place = await st();
// the throne: the ascent place, then another place - the reading goes back
await pg.evaluate(() => { const b = [...document.querySelectorAll('.tm-pl button')].find((x) => (x.title || x.textContent).trim() === 'עליית המלך לכסא'); if (b) b.click(); }); await pg.waitForTimeout(2500);
out.thr1 = await pg.evaluate(() => window.__ctx.shared.throneVersion.current);
await pg.evaluate(() => { const b = [...document.querySelectorAll('.tm-pl button')].find((x) => (x.title || x.textContent).trim() === 'כסא שלמה'); if (b) b.click(); }); await pg.waitForTimeout(2500);
out.thr2 = await pg.evaluate(() => window.__ctx.shared.throneVersion.current);
console.log(JSON.stringify(out, null, 1));
console.log('errors:', JSON.stringify(P.errs.slice(0, 5)));
await P.close(); process.exit(0);
