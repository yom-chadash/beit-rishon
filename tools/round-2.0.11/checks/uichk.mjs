// the review round's UI fixes in one page: node uichk.mjs <plugin> <b1|b2>
import { open } from '../../fs/h.mjs';
const [,, dir, house] = process.argv;
const P = await open(dir, { dsf: 1, vw: 1280, vh: 800 }); const pg = P.page;
await P.settle(30000, 3);
const out = {};
const clickPlace = async (title) => pg.evaluate((t) => { const b = [...document.querySelectorAll('.tm-pl button')].find((x) => (x.title || x.textContent).trim() === t || x.textContent.trim() === t); if (!b) return false; b.click(); return true; }, title);
// 1. the fold
const long = house === 'b2' ? 'מנורות של זהב — שמחת בית השואבה' : 'עליית המלך לכסא';
out.place = await clickPlace(long); await pg.waitForTimeout(1500);
out.fold = await pg.evaluate(() => { const b = document.querySelector('#tm-xcard .b'); if (!b) return null; const ps = [...b.querySelectorAll('.p')]; const bt = b.querySelector('.tm-more');
  const vis = ps.filter((p) => p.style.display !== 'none' && p.textContent.trim()), hid = ps.filter((p) => p.style.display === 'none' && p.textContent.trim());
  return { btn: bt ? bt.textContent : null, btnW: bt ? Math.round(bt.getBoundingClientRect().width) : 0, bodyW: Math.round(b.clientWidth), shown: vis.length, hidden: hid.length,
    modelShown: vis.filter((p) => /^במודל/.test(p.textContent.trim())).length, modelHidden: hid.filter((p) => /^במודל/.test(p.textContent.trim())).length,
    lastShown: vis.length ? vis[vis.length - 1].textContent.slice(0, 60) : '', afterBtn: bt && bt.nextElementSibling ? bt.nextElementSibling.textContent.slice(0, 40) : '' }; });
out.demoBefore = await pg.evaluate(() => (window.__ctx.shared.demoStops || []).filter((d) => { try { return d.running(); } catch (_) { return false; } }).map((d) => d.id));
await pg.waitForTimeout(600);
const hasMore = await pg.$('#tm-xcard .tm-more');
if (hasMore) { await pg.click('#tm-xcard .tm-more'); await pg.waitForTimeout(500); }
out.demoAfterMore = await pg.evaluate(() => (window.__ctx.shared.demoStops || []).filter((d) => { try { return d.running(); } catch (_) { return false; } }).map((d) => d.id));
out.afterMore = await pg.evaluate(() => { const b = document.querySelector('#tm-xcard .b'); const ps = [...b.querySelectorAll('.p')]; return { hidden: ps.filter((p) => p.style.display === 'none').length, btn: !!b.querySelector('.tm-more') }; });
// 2. the view button leaves the place
out.featBefore = await pg.evaluate(() => Object.entries(window.__ctx.shared.features || {}).filter(([k, f]) => { try { return f.isOn && f.isOn(); } catch (_) { return false; } }).map(([k]) => k));
await pg.evaluate(() => { const b = [...document.querySelectorAll('button')].find((x) => x.textContent.trim() === 'מבט כללי'); if (b) b.click(); }); await pg.waitForTimeout(1200);
out.featAfterView = await pg.evaluate(() => Object.entries(window.__ctx.shared.features || {}).filter(([k, f]) => { try { return f.isOn && f.isOn(); } catch (_) { return false; } }).map(([k]) => k));
// 3. the news window
await pg.evaluate(() => window.__ctx.ui.news.show()); await pg.waitForTimeout(500);
out.news = await pg.evaluate(() => { const d = document.getElementById('tm-news'); if (!d) return null; const box = d.querySelector('.box'), ok = d.querySelector('.b button'), x = d.querySelector('.t .x'), ul = d.querySelector('ul');
  const r = ok.getBoundingClientRect(), rb = box.getBoundingClientRect(); return { n: ul.children.length, boxH: Math.round(rb.height), win: innerHeight, okBottom: Math.round(r.bottom), okInView: r.bottom <= innerHeight && r.top >= 0, x: !!x, ulScroll: ul.scrollHeight > ul.clientHeight, title: d.querySelector('.t span').textContent }; });
await pg.keyboard.press('Enter'); await pg.waitForTimeout(300);
out.newsAfterEnter = await pg.evaluate(() => !!document.getElementById('tm-news'));
await P.rshot('/home/claude/qa/r211/fix/news_' + house + '.png').catch(() => {});
await pg.keyboard.press('Escape'); await pg.waitForTimeout(300);
out.newsAfterEsc = await pg.evaluate(() => !!document.getElementById('tm-news'));
out.footNews = await pg.evaluate(() => { const f = document.getElementById('tm-foot-news'); if (!f) return null; f.click(); return !!document.getElementById('tm-news'); });
await pg.evaluate(() => { const d = document.getElementById('tm-news'); if (d) d.querySelector('.t .x').click(); }); await pg.waitForTimeout(200);
out.newsAfterX = await pg.evaluate(() => !!document.getElementById('tm-news'));
console.log(JSON.stringify(out, null, 1));
console.log('errors:', JSON.stringify(P.errs.slice(0, 6)));
await P.close(); process.exit(0);
