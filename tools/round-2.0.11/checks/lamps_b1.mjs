import { open } from '../../fs/h.mjs';
const [,, dir, prefix] = process.argv;
const P = await open(dir, { dsf: 1, vw: 1000, vh: 640 }); const pg = P.page;
await P.settle(30000, 3);
const titles = await pg.evaluate(() => [...document.querySelectorAll('.tm-pl button')].map((b) => (b.title || b.textContent).trim()).filter((t) => /מנור/.test(t)));
console.log(JSON.stringify(titles));
const t = titles.find((x) => /מקרוב/.test(x)) || titles[0];
await pg.evaluate((t) => { const b = [...document.querySelectorAll('.tm-pl button')].find((x) => (x.title || x.textContent).trim() === t); b.click(); }, t);
await pg.waitForTimeout(3500);
const cam = await pg.evaluate(() => { const c = window.__ctx; return [c.camera.position.toArray().map((v) => +v.toFixed(1)), c.controls.target.toArray().map((v) => +v.toFixed(1))]; });
console.log(t, JSON.stringify(cam));
await P.rshot(prefix + '_place.png');
// closer: from above the target, slightly east
const [c0, tg] = cam;
await pg.evaluate(([tg]) => { const c = window.__ctx; c.camera.position.set(tg[0] + 2.2, tg[1] + 2.6, tg[2] + 0.4); c.controls.target.set(tg[0], tg[1] + 0.6, tg[2]); c.controls.update(); }, [tg]);
await pg.waitForTimeout(1500); await P.rshot(prefix + '_near.png');
console.log('errors:', JSON.stringify(P.errs.slice(0, 5)));
await P.close(); process.exit(0);
