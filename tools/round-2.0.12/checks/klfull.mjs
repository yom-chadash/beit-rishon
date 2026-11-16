// as klplace.mjs, but the picture is the whole page (the card, the bars and the overlays too): node klfull.mjs <plugin> <outprefix> "title"...
import { open } from '../../fs/h.mjs';
const [,, dir, prefix, ...titles] = process.argv;
const { page, close, errs } = await open(dir, { dsf: 1, vw: +(process.env.VW || 1000), vh: +(process.env.VH || 640) });
await page.evaluate(() => { window.__q.skip = false; });
await page.waitForTimeout(2000);
let n = 0;
for (const t of titles) {
  n++;
  const r = await page.evaluate((t) => { const bs = [...document.querySelectorAll('.tm-pl button')].filter((b) => !b.closest('.tm-op')); const b = bs.find((x) => x.textContent.trim() === t) || bs.find((x) => x.textContent.trim().startsWith(t)); if (!b) return 'not found'; b.click(); return b.textContent.trim().slice(0, 60); }, t);
  await page.waitForTimeout(4500);
  await page.screenshot({ path: prefix + n + '.png' });
  console.log(n, r);
}
console.log('errs', errs.length, errs.slice(0, 3).join(' | '));
await close(); process.exit(0);
