// one figure's way through a stage of the morning demo (TM.seek): node figpath.mjs <plugin> <order> <stageId> <fig> [t0] [t1] [step]
import { open } from '../fs/h.mjs';
const [,, dir, order, sid, fk, t0S = '0', t1S = '99', stS = '0.2'] = process.argv;
const P = await open(dir, { dsf: 0.5, vw: 800, vh: 500 }); const pg = P.page;
await P.settle(30000, 3);
const r = await pg.evaluate(async ([order, sid, fk, t0, t1, st]) => { const c = window.__ctx, S = c.shared, TM = S.tamid, T = S.tour, wait = (ms) => new Promise((r) => setTimeout(r, ms));
  TM.setOrder(order); T.start('tamid', { speed: 1 }); await wait(1500); T.pause(true); await wait(300);
  const list = TM.list(order), i = list.indexOf(sid); if (i < 0) return 'no stage';
  const out = []; const dur = TM.duration(i, order);
  for (let s = Math.max(0, t0); s <= Math.min(dur, t1) + 1e-6; s += st) { TM.seek(i, s); const f = TM.figAt(fk); out.push(s.toFixed(1) + ': ' + (f ? (f.vis ? [f.x, f.y, f.z].map((v) => (+v).toFixed(2)).join(',') + ' ' + f.pose + ' yaw ' + (+f.yaw).toFixed(2) : 'hidden') : 'none')); }
  return 'stage ' + i + ' dur ' + dur + '\n' + out.join('\n'); }, [order, sid, fk, +t0S, +t1S, +stS]);
console.log(r); await P.close(); process.exit(0);
