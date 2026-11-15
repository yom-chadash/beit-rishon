// the menorah's lamps close up, in the two directions: node fix/lamps.mjs <plugin> <b1|b2> <prefix>
import { open } from '../../fs/h.mjs';
const [,, dir, house, prefix] = process.argv;
const P = await open(dir, { dsf: 1, vw: 1000, vh: 640 }); const pg = P.page;
await P.settle(30000, 3);
const shot = async (name, cam, tg) => { await pg.evaluate(([cam, tg]) => { const c = window.__ctx; c.camera.position.set(...cam); c.controls.target.set(...tg); c.controls.update(); }, [cam, tg]); await pg.waitForTimeout(1500); await P.rshot(prefix + name + '.png'); };
if (house === 'b2') {
  for (const mode of ['ns', 'ew']) {
    const M = await pg.evaluate((mode) => { const S = window.__ctx.shared; S.menorahDir.set(mode); const m = S.menorah; return { x: m.MEN.x, z: m.MEN.z, fl: m.FL, rot: m.MEN.rot, lamps: [0, 3, 6].map((i) => m.lampPos(i).map((v) => +v.toFixed(2))) }; }, mode);
    console.log(mode, JSON.stringify(M));
    // from the north-east and above, looking at the lamps
    await shot('_' + mode + '_a', [M.x + 1.6, M.fl + 4.6, M.z - 2.4], [M.x, M.fl + 3.15, M.z]);
    await shot('_' + mode + '_top', [M.x + 0.01, M.fl + 6.2, M.z], [M.x, M.fl + 3.1, M.z]);
  }
} else {
  const info = await pg.evaluate(() => { const S = window.__ctx.shared; return Object.keys(S).filter((k) => /menor|layout|interior|vessel/i.test(k)); });
  console.log('b1 keys', JSON.stringify(info));
}
console.log('errors:', JSON.stringify(P.errs.slice(0, 5)));
await P.close(); process.exit(0);
