// Solomon's vessels: pictures of the kodesh from above for given settings: node /tmp/b2sol.mjs out mode(ten|one) dir(rambam|rabbi|rashbash) [cam]
import { open } from '/home/claude/qa/fs/h.mjs';
const [,, out, mode, dir, camS = '-25,62,0.5,-25,22,0'] = process.argv;
const P = await open('/home/claude/b2src/plugin', { dsf: 1, vw: 1000, vh: 640 }); const pg = P.page;
await P.settle(30000, 3);
const info = await pg.evaluate(([mode, dir]) => { const S = window.__ctx.shared;
  S.menorahDir.set(dir === 'rabbi' ? 'ew' : 'ns'); S.tableDir.set(dir === 'rashbash' ? 'ns' : 'ew');
  S.solomonVessels.set(mode);
  // the heichal's roof off, to look in
  if (S.openFor) try { S.openFor('crt-heichal', 60000); } catch (_) {}
  return JSON.stringify({ cur: S.solomonVessels.get ? S.solomonVessels.get() : S.solomonVessels.current }); }, [mode, dir]);
const cam = camS.split(',').map(Number);
await pg.evaluate((cam) => { const c = window.__ctx; c.camera.position.set(cam[0], cam[1], cam[2]); c.controls.target.set(cam[3], cam[4], cam[5]); c.camera.lookAt(cam[3], cam[4], cam[5]); c.controls.update && c.controls.update(); }, cam);
await pg.waitForTimeout(800); await P.settle(12000, 4);
await P.rshot(out); console.log(out, info, JSON.stringify(P.errs.slice(0, 3)));
await P.close(); process.exit(0);
