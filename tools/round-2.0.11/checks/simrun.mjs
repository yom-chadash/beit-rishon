import { open } from '../../fs/h.mjs';
const [,, dir] = process.argv;
const P = await open(dir, { dsf: 1, vw: 1000, vh: 640 }); const pg = P.page;
await P.settle(30000, 3); await pg.evaluate(() => { window.__q.skip = false; }); await pg.waitForTimeout(1500);
await pg.evaluate(() => {
  const S = window.__ctx.shared.simchaDemo, st = S.stop.bind(S);
  S.stop = function () { window.__stopTrace = (new Error('stop')).stack.split('\n').slice(1, 7).map((x) => x.trim().slice(0, 140)); return st(); };
  const bs = [...document.querySelectorAll('.tm-pl button')].filter((b) => !b.closest('.tm-op')); bs.find((x) => x.textContent.trim().startsWith('מנורות של זהב')).click();
});
const t0 = Date.now(); let last = null;
while (Date.now() - t0 < 13000) {
  const r = await pg.evaluate(() => [window.__ctx.shared.simchaDemo.running(), window.__ctx.camera.position.toArray().map((v) => Math.round(v))]);
  const k = JSON.stringify(r[0]);
  if (k !== last) { console.log(((Date.now() - t0) / 1000).toFixed(1), JSON.stringify(r)); last = k; }
  await pg.waitForTimeout(250);
}
console.log('trace', JSON.stringify(await pg.evaluate(() => window.__stopTrace || null)));
await P.close(); process.exit(0);
