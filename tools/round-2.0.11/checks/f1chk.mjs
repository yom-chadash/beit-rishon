// the function review's b2 fixes: node f1chk.mjs <plugin>
import { open } from '../../fs/h.mjs';
const [,, dir] = process.argv;
const P = await open(dir, { dsf: 1, vw: 1280, vh: 800 }); const pg = P.page;
await P.settle(30000, 3);
const out = {};
const cam = () => pg.evaluate(() => { const c = window.__ctx; return [c.camera.position.x, c.camera.position.y, c.camera.position.z, c.controls.target.x, c.controls.target.y, c.controls.target.z].map((v) => Math.round(v)); });
const feats = () => pg.evaluate(() => Object.entries(window.__ctx.shared.features || {}).filter(([k, f]) => { try { return f.isOn && f.isOn(); } catch (_) { return false; } }).map(([k]) => k));
const running = () => pg.evaluate(() => (window.__ctx.shared.demoStops || []).filter((d) => { try { return d.running(); } catch (_) { return false; } }).map((d) => d.id));
const clickPlace = (t) => pg.evaluate((t) => { const b = [...document.querySelectorAll('.tm-pl button')].find((x) => (x.title || '').trim() === t || x.textContent.trim() === t); if (!b) return false; b.click(); return true; }, t);
const clickChip = (rowStart, idx) => pg.evaluate(([rs, idx]) => { const rows = [...document.querySelectorAll('.tm-op')]; for (const r of rows) { const cap = r.querySelector('.cap, summary, .c'); const txt = (r.textContent || ''); if (txt.includes(rs)) { const bs = r.querySelectorAll('.bb button'); if (bs[idx]) { bs[idx].click(); return bs[idx].textContent; } } } return null; }, [rowStart, idx]);
// 1. the names round, then another place
out.chip = await clickChip('שמות הלשכות שבבית המוקד', 1); await pg.waitForTimeout(2600);
out.run1 = await running();
out.p1 = await clickPlace('הר הבית'); await pg.waitForTimeout(2500);
out.run1b = await running(); out.cam1 = await cam();
await pg.waitForTimeout(6000); out.cam1b = await cam();
// 2. the lamps: registered, paused by a press on the model, ended by the view button
out.p2 = await clickPlace('מנורות של זהב — שמחת בית השואבה'); await pg.waitForTimeout(3000);
out.run2 = await running(); out.bar = await pg.evaluate(() => { const e = document.getElementById('tm-dpause'); return !!(e && e.style.display !== 'none'); });
await pg.evaluate(() => { const b = [...document.querySelectorAll('button')].find((x) => x.textContent.trim() === 'מבט כללי'); if (b) b.click(); }); await pg.waitForTimeout(2500);
out.run2b = await running(); out.feat2b = await feats(); out.cam2 = await cam();
await pg.waitForTimeout(9000); out.cam2b = await cam();
console.log(JSON.stringify(out)); // 3. the presentation: the officers' slide has the officers, and the next slide has not
out.tour = await pg.evaluate(async () => { const S = window.__ctx.shared, T = S.tour, wait = (ms) => new Promise((r) => setTimeout(r, ms));
  const modes = Array.isArray(T.modes) ? T.modes.map((m) => m.key) : null; T.start('topics', { speed: 1 }); await wait(1500);
  const sl = T.slides || []; const fe = () => Object.entries(S.features || {}).filter(([k, f]) => { try { return f.isOn && f.isOn(); } catch (_) { return false; } }).map(([k]) => k);
  const res = { n: sl.length, modes };
  for (const t of ['הממונים שבמקדש', 'חלקי יהודה ובנימין — הרצועה שבדרום המזבח', 'מנורות של זהב — שמחת בית השואבה']) {
    const i = sl.findIndex((s) => s.title === t); if (i < 0) { res[t] = 'no slide'; continue; }
    T.goto(i); await wait(2500); const a = fe(); T.goto(i + 1); await wait(2500); res[t] = [a, fe(), sl[i + 1].title]; }
  T.stop && T.stop(); await wait(800); res.after = fe(); return res; });
console.log(JSON.stringify(out, null, 1));
console.log('errors:', JSON.stringify(P.errs.slice(0, 6)));
await P.close(); process.exit(0);
