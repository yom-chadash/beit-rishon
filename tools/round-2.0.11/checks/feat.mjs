import { open } from '/home/claude/qa/fs/h.mjs';
const { page, close, errs, settle } = await open('/home/claude/b2src/plugin', { dsf: 0.5, vw: 1000, vh: 640 });
const click = (t) => page.evaluate((t) => { const bs = [...document.querySelectorAll('.tm-pl button')].filter((b) => !b.closest('.tm-op')); const b = bs.find((x) => x.textContent.trim() === t) || bs.find((x) => x.textContent.indexOf(t) >= 0); if (!b) return 'NO ' + t; b.click(); return b.textContent.trim(); }, t);
const opt = (row, o) => page.evaluate(([row, opt]) => { const ops = [...document.querySelectorAll('.tm-op')]; const e = ops.find((e) => { const c = e.querySelector('.cap'); return c && c.textContent.indexOf(row) >= 0; }); if (!e) return 'NO ROW'; const b = [...e.querySelectorAll('.bb button')].find((x) => x.textContent.indexOf(opt) >= 0); if (!b) return 'NO OPT'; b.click(); return b.textContent.trim(); }, [row, o]);
const st = () => page.evaluate(() => { const F = window.__ctx.shared.features || {}; const o = {}; for (const k of ['tribes', 'northZones', 'simchaMenorot', 'zoneHel']) if (F[k]) o[k] = !!F[k].isOn(); return o; });
const w = (ms) => page.waitForTimeout(ms);
const log = async (what, r) => { await w(1500); console.log(what, '|', r, '|', JSON.stringify(await st())); };
// A: tribes once, then another place
await log('A1 click tribes', await click('חלקי יהודה ובנימין'));
await log('A2 click another place', await click('לשכת המלח'));
// B: tribes twice, then another place
await log('B1 click tribes', await click('חלקי יהודה ובנימין'));
await log('B2 click tribes again', await click('חלקי יהודה ובנימין'));
await log('B3 click another place', await click('לשכת המלח'));
await log('B4 click a third place', await click('שער ניקנור'));
// C: north zones: option, option, then a place
await log('C0 tribes state before', '');
await log('C1 north rashi', await opt('צפון לשחיטת', 'הגבול כרש'));
await log('C2 north rambam', await opt('צפון לשחיטת', 'הגבול כרמב'));
await log('C3 tribes place', await click('חלקי יהודה ובנימין'));
await log('C4 tribes place again', await click('חלקי יהודה ובנימין'));
await log('C5 other place', await click('לשכת הפרוה'));
// D: lamps twice then other
await log('D1 lamps', await click('מנורות של זהב'));
await log('D2 lamps again', await click('מנורות של זהב'));
await log('D3 other', await click('לשכת הפרוה'));
// breaches
const br = await page.evaluate(() => { const S = window.__ctx.shared.soregBreach; let n = -1; try { const L = window.__ctx.layers; const g = L.soregBreach || L.breach || null; n = g ? g.children.length : -1; } catch (_) {} return { keys: S ? Object.keys(S) : null, n, layers: Object.keys(window.__ctx.layers).filter((k) => /oreg|reach/i.test(k)) }; });
console.log('breach', JSON.stringify(br));
console.log('errs', errs.length, errs.slice(0, 3).join(' | '));
await close();
