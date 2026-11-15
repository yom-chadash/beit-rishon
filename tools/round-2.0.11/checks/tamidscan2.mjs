// every stage of the morning demo in both orders, at three moments: errors, and figures standing under the ground or with a broken place
// node tamidscan.mjs <plugin>
import { open } from '../../fs/h.mjs';
const [,, dir] = process.argv;
const P = await open(dir); const pg = P.page;
await P.settle(30000, 3);
for (const order of ['abba', 'rambam']) {
  const r = await pg.evaluate(async (order) => { const S = window.__ctx.shared, TM = S.tamid, T = S.tour, wait = (ms) => new Promise((r) => setTimeout(r, ms));
    TM.setOrder(order); T.start('tamid', { speed: 1 }); await wait(1500);
    const list = TM.list(order), bad = [], durs = T.slides.map((s) => s.dur);
    const IDS = ["mem", "t", "mc", "cv", "s1", "s2", "s3", "s4", "s5", "s6", "s7", "s8", "s9", "s10", "s11", "s12", "s13", "k", "f", "e", "b1", "b2", "b3", "b4", "sg", "tr1", "tr2", "ba", "l1", "l5", "l9", "l11", "v1", "v6", "v7", "v12"];
    for (let i = 0; i < list.length; i++) {
      for (const fr of [0.35, 0.7, 0.97]) {
        T.pause(false); T.goto(i); await wait(1300); T.seek(Math.max(0.5, durs[i] * fr)); await wait(450); T.pause(true); await wait(120);
        for (const k of IDS) { const f = TM.figAt(k); if (f && f.vis && !(isFinite(f.x) && isFinite(f.y) && isFinite(f.z) && f.y > 5.5 && f.y < 60)) bad.push([list[i], fr, k, +(+f.x).toFixed(1), +(+f.y).toFixed(1), +(+f.z).toFixed(1)]); }
      }
    }
    T.stop && T.stop();
    return { n: list.length, bad }; }, order);
  console.log(order, JSON.stringify(r).slice(0, 1500));
}
console.log('errors:', JSON.stringify(P.errs.slice(0, 8)), 'warns:', JSON.stringify((P.warns || []).filter((w) => /tamid/.test(w)).slice(0, 6)));
await P.close(); process.exit(0);
