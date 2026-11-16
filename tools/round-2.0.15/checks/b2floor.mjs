// the top surface under given points: node /tmp/b2floor.mjs z x0 x1 step [ytop]
import { open } from '/home/claude/qa/fs/h.mjs';
const [,, zS, x0S, x1S, stS, ytS = '40'] = process.argv;
const P = await open('/home/claude/b2src/plugin', { dsf: 0.5, vw: 800, vh: 500 }); const pg = P.page;
await P.settle(30000, 3);
const r = await pg.evaluate(([z, x0, x1, st, yt]) => { const c = window.__ctx, T = c.THREE; c.scene.updateMatrixWorld(true);
  const meshes = []; c.scene.traverse((o) => { if (o.isMesh) { let v = true; for (let a = o; a; a = a.parent) if (a.visible === false) v = false; if (v && !(o.geometry && o.geometry.type === 'PlaneGeometry')) meshes.push(o); } });
  const rc = new T.Raycaster(); const out = [];
  for (let x = x0; x <= x1 + 1e-6; x += st) { rc.set(new T.Vector3(x, yt, z), new T.Vector3(0, -1, 0)); rc.far = yt + 5;
    const h = rc.intersectObjects(meshes, false).filter((h) => !(h.object.material && h.object.material.transparent && h.object.material.opacity < 0.3)).slice(0, 3);
    out.push(x.toFixed(1) + ': ' + h.map((q) => q.point.y.toFixed(1) + ' ' + (q.object.parent && q.object.parent.name || '') + '/' + q.object.geometry.type.replace('Geometry', '')).join(' | ')); }
  return out.join('\n'); }, [Number(zS), Number(x0S), Number(x1S), Number(stS), Number(ytS)]);
console.log(r); await P.close(); process.exit(0);
