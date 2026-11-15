import { open } from '../../fs/h.mjs';
const [,, dir, needle] = process.argv;
const P = await open(dir, { dsf: 1, vw: 1000, vh: 640 }); const pg = P.page;
await P.settle(30000, 3);
await pg.evaluate(() => { const f = window.__ctx.shared.features.rampWays; f.on(); });
await pg.waitForTimeout(800);
const info = await pg.evaluate((needle) => {
  const c = window.__ctx, out = [];
  for (const L of c.labels) if ((L.text || '').includes(needle)) out.push({ text: L.text.slice(0, 30), x: L.x, y: L.y, z: L.z, layer: L.layer, layers: L.layers, keys: Object.keys(L).join(','), sprite: !!(L.sprite || L.mesh || L.obj), vis: L.sprite ? L.sprite.visible : (L.obj ? L.obj.visible : null) });
  let sprites = 0, match = [];
  c.scene.traverse((o) => { if (o.isSprite) { sprites++; const L = o.userData && o.userData.label; if (L && L.text && L.text.includes(needle)) match.push({ vis: o.visible, p: o.position.toArray().map((v) => +v.toFixed(1)), sc: o.scale.toArray().map((v) => +v.toFixed(2)), lays: o.userData.layers, layVis: (o.userData.layers || []).map((n) => !!(c.layers[n] && c.layers[n].visible)), cam: c.camera.position.toArray().map((v) => +v.toFixed(1)) }); } });
  return { out, sprites, match };
}, needle);
console.log(JSON.stringify(info, null, 1).slice(0, 2500));
await P.close(); process.exit(0);
