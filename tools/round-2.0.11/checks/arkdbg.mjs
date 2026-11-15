import { open } from '../../fs/h.mjs';
const [,, dir] = process.argv;
const P = await open(dir, { dsf: 1, vw: 1000, vh: 640 }); const pg = P.page;
await P.settle(30000, 3); await pg.evaluate(() => { window.__q.skip = false; }); await pg.waitForTimeout(1500);
const r1 = await pg.evaluate(() => { const r = [...document.querySelectorAll('.tm-op')].find((x) => x.textContent.includes('מה היה מונח בארון')); const bs = [...r.querySelectorAll('button')]; return bs.map((b) => b.textContent.trim().slice(0, 30)); });
console.log(JSON.stringify(r1));
await pg.evaluate(() => { const r = [...document.querySelectorAll('.tm-op')].find((x) => x.textContent.includes('מה היה מונח בארון')); const b = [...r.querySelectorAll('button')].find((b) => /רבי יהודה/.test(b.textContent)); b.click(); });
for (let i = 0; i < 8; i++) { await pg.waitForTimeout(500); console.log(i, JSON.stringify(await pg.evaluate(() => window.__ctx.camera.position.toArray().map((v) => +v.toFixed(1))))); }
await P.close(); process.exit(0);
