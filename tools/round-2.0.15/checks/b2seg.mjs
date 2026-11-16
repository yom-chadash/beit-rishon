// the top surface along a segment: node /tmp/b2seg.mjs x0 z0 x1 z1 n [ytop]
import { open } from '/home/claude/qa/fs/h.mjs';
const [,, ...a] = process.argv; const [x0, z0, x1, z1, n, yt = 30] = a.map(Number);
const P = await open('/home/claude/b2src/plugin', { dsf: 0.5, vw: 800, vh: 500 }); const pg = P.page;
await P.settle(30000, 3);
const r = await pg.evaluate(([x0, z0, x1, z1, n, yt]) => { const c = window.__ctx, T = c.THREE; c.scene.updateMatrixWorld(true);
  const meshes = []; c.scene.traverse((o) => { if (o.isMesh) { let v = true; for (let q = o; q; q = q.parent) if (q.visible === false) v = false; if (v && !(o.geometry && o.geometry.type === 'PlaneGeometry')) meshes.push(o); } });
  const rc = new T.Raycaster(); const out = [];
  for (let i = 0; i <= n; i++) { const x = x0 + (x1 - x0) * i / n, z = z0 + (z1 - z0) * i / n; rc.set(new T.Vector3(x, yt, z), new T.Vector3(0, -1, 0)); rc.far = yt + 5;
    const h = rc.intersectObjects(meshes, false).filter((h) => !(h.object.material && h.object.material.transparent && h.object.material.opacity < 0.3))[0];
    out.push(x.toFixed(1) + ',' + z.toFixed(1) + ': ' + (h ? h.point.y.toFixed(2) + ' ' + (h.object.parent && h.object.parent.name || '') + '/' + h.object.geometry.type.replace('Geometry', '') : '-')); }
  return out.join('\n'); }, [x0, z0, x1, z1, n, yt]);
console.log(r); await P.close(); process.exit(0);
