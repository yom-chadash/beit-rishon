// Real Three.js regression tests; no browser or downloaded test dependency required.
// node tools/perf-render-test.mjs [--benchmark]
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import { performance } from 'node:perf_hooks';

const root = new URL('../', import.meta.url);
const read = (name) => fs.readFileSync(new URL(name, root), 'utf8');
const library = read('shared/00-lib.js');
const helper = read('shared/frag/raycast-bounds.js');
// Load the exact vendored renderer version and the actual source fragment together.
const T = new Function('window', library + helper + '\nreturn { ...three_module_exports, makeRaycast: ent_makeRaycast, pickable: ent_pickable };})(); return OtzariaPlugin;')({ performance });
const { Group, Scene, Mesh, InstancedMesh, BoxGeometry, BufferAttribute, Float32BufferAttribute, InterleavedBuffer, InterleavedBufferAttribute,
  MeshBasicMaterial, ShaderMaterial, Matrix4, Vector3, Raycaster, DoubleSide, FrontSide, Plane, DirectionalLight } = T;
const mat = new MeshBasicMaterial({ side: DoubleSide });
let passed = 0;
const check = (name, fn) => { fn(); passed++; console.log('PASS ' + name); };
const summary = (hits) => hits.map((h) => ({ object: h.object.id, instance: h.instanceId, face: h.faceIndex, distance: h.distance, point: h.point.toArray() }));
const compare = (cast, ray, objects) => {
  const expected = ray.intersectObjects(objects, false);
  const actual = cast(ray, objects);
  assert.deepEqual(summary(actual), summary(expected));
  return actual;
};
const down = (x, z, y = 100) => new Raycaster(new Vector3(x, y, z), new Vector3(0, -1, 0), 0, 200);

check('exact hit identity, triangle, distance, ordering and near/far/layers', () => {
  const a = new Mesh(new BoxGeometry(8, 2, 8), mat), b = a.clone(), c = a.clone();
  b.position.y = 5; c.layers.set(2);
  const objects = [a, b, c], cast = T.makeRaycast(), ray = down(0, 0);
  for (const o of objects) o.updateMatrixWorld();
  assert.ok(compare(cast, ray, objects).length);
  ray.near = 96; ray.far = 102;
  compare(cast, ray, objects);
  ray.layers.set(2);
  compare(cast, ray, objects);
  compare(cast, down(50, 50), objects);
});

check('moving and rotating parents, nonuniform/negative scale and boundary hits', () => {
  const parent = new Group(), mesh = new Mesh(new BoxGeometry(6, 2, 4), mat), cast = T.makeRaycast();
  parent.add(mesh); parent.updateMatrixWorld(true);
  compare(cast, down(3, 2), [mesh]);
  parent.position.set(20, 7, -15); parent.rotation.set(0.2, 0.7, -0.1); parent.scale.set(-2, 3, 0.5);
  parent.updateMatrixWorld(true);
  assert.ok(compare(cast, down(20, -15), [mesh]).length);
  compare(cast, down(0, 0), [mesh]);
});

check('geometry edits, replacement attributes and replacement geometry invalidate bounds', () => {
  const mesh = new Mesh(new BoxGeometry(2, 2, 2), mat), cast = T.makeRaycast();
  mesh.updateMatrixWorld(); compare(cast, down(0, 0), [mesh]);
  let p = mesh.geometry.attributes.position;
  for (let i = 0; i < p.count; i++) p.setX(i, p.getX(i) + 20);
  p.needsUpdate = true; mesh.geometry.computeBoundingSphere();
  assert.ok(compare(cast, down(20, 0), [mesh]).length);
  p = new Float32BufferAttribute(p.array.slice(), 3);
  for (let i = 0; i < p.count; i++) p.setZ(i, p.getZ(i) + 12);
  mesh.geometry.setAttribute('position', p); mesh.geometry.computeBoundingSphere();
  assert.ok(compare(cast, down(20, 12), [mesh]).length);
  mesh.geometry = new BoxGeometry(4, 4, 4);
  assert.ok(compare(cast, down(0, 0), [mesh]).length);
});

check('interleaved position buffer versions invalidate bounds', () => {
  const geometry = new BoxGeometry(2, 2, 2), source = geometry.attributes.position;
  const buffer = new InterleavedBuffer(new Float32Array(source.count * 4), 4);
  const p = new InterleavedBufferAttribute(buffer, 3, 0);
  for (let i = 0; i < source.count; i++) p.setXYZ(i, source.getX(i), source.getY(i), source.getZ(i));
  geometry.setAttribute('position', p);
  const mesh = new Mesh(geometry, mat), cast = T.makeRaycast(); mesh.updateMatrixWorld();
  compare(cast, down(0, 0), [mesh]);
  for (let i = 0; i < p.count; i++) p.setX(i, p.getX(i) + 8);
  buffer.needsUpdate = true; geometry.computeBoundingSphere();
  assert.ok(compare(cast, down(8, 0), [mesh]).length);
});

check('instance transforms, instance buffer replacement, count and geometry invalidation', () => {
  const mesh = new InstancedMesh(new BoxGeometry(2, 2, 2), mat, 3), cast = T.makeRaycast(), matrix = new Matrix4();
  for (let i = 0; i < 3; i++) mesh.setMatrixAt(i, matrix.makeTranslation(i * 5, 0, 0));
  mesh.instanceMatrix.needsUpdate = true; mesh.updateMatrixWorld();
  compare(cast, down(0, 0), [mesh]);
  mesh.setMatrixAt(0, matrix.makeTranslation(40, 0, 0));
  mesh.instanceMatrix.needsUpdate = true; mesh.computeBoundingSphere();
  assert.ok(compare(cast, down(40, 0), [mesh]).length);
  mesh.count = 0; mesh.computeBoundingSphere(); compare(cast, down(40, 0), [mesh]);
  mesh.count = 3; mesh.instanceMatrix = mesh.instanceMatrix.clone();
  mesh.setMatrixAt(0, matrix.makeTranslation(-40, 0, 0));
  mesh.computeBoundingSphere(); assert.ok(compare(cast, down(-40, 0), [mesh]).length);
  mesh.geometry = new BoxGeometry(2, 2, 20); mesh.computeBoundingSphere();
  assert.ok(compare(cast, down(-40, 8), [mesh]).length);
  mesh.position.z = 10; mesh.updateMatrixWorld();
  assert.ok(compare(cast, down(-40, 18), [mesh]).length);
});

check('custom raycasts, morph targets and invalid bounds safely use Three.js', () => {
  const mesh = new Mesh(new BoxGeometry(1, 1, 1), mat), cast = T.makeRaycast(); mesh.updateMatrixWorld();
  mesh.raycast = (_ray, hits) => hits.push({ object: mesh, distance: 1, point: new Vector3(50, 99, 50) });
  assert.equal(compare(cast, down(50, 50), [mesh]).length, 1);
  const morph = new Mesh(new BoxGeometry(2, 2, 2), mat);
  morph.geometry.morphAttributes.position = [morph.geometry.attributes.position.clone()];
  morph.updateMorphTargets(); morph.updateMatrixWorld();
  compare(cast, down(0, 0), [morph]);
  const invalid = new Mesh(new BoxGeometry(2, 2, 2), mat);
  invalid.geometry.attributes.position.setX(0, NaN); invalid.updateMatrixWorld();
  const warn = console.error; console.error = () => {};
  try { compare(cast, down(50, 50), [invalid]); } finally { console.error = warn; }
});

check('faded, clipped, transparent and material-array solids retain exact picking behavior', () => {
  const materials = Array.from({ length: 6 }, () => mat.clone());
  materials[0].transparent = true; materials[0].opacity = 0.1;
  materials[1].clippingPlanes = [new Plane(new Vector3(0, 1, 0), -5)];
  const mesh = new Mesh(new BoxGeometry(4, 2, 4), materials), cast = T.makeRaycast(); mesh.updateMatrixWorld();
  assert.ok(compare(cast, down(0, 0), [mesh]).length);
  mesh.material = mat.clone(); mesh.material.side = FrontSide;
  compare(cast, down(0, 0), [mesh]);
});

check('deterministic mixed scene: 400 exact ray equivalence checks', () => {
  let seed = 73491;
  const random = () => ((seed = Math.imul(seed, 1664525) + 1013904223 | 0) >>> 0) / 4294967296;
  const objects = [], cast = T.makeRaycast();
  for (let i = 0; i < 70; i++) {
    const mesh = new Mesh(new BoxGeometry(random() * 20 + 0.2, random() * 15 + 0.1, random() * 20 + 0.2), mat);
    mesh.position.set(random() * 120 - 60, random() * 20, random() * 120 - 60);
    mesh.rotation.set(random(), random(), random()); mesh.scale.set(random() + 0.1, random() + 0.1, random() + 0.1);
    mesh.updateMatrixWorld(); objects.push(mesh);
  }
  for (let i = 0; i < 400; i++) {
    const origin = new Vector3(random() * 140 - 70, random() * 100, random() * 140 - 70);
    const dir = new Vector3(random() - 0.5, random() - 1, random() - 0.5).normalize();
    compare(cast, new Raycaster(origin, dir, random() * 2, random() * 200), objects);
  }
});

const oldPick = (scene, ray) => ray.intersectObjects(scene.children, true).filter((h) => {
  const o = h.object;
  if (!o.isMesh || o.isSprite || o.userData.noPick) return false;
  for (let p = o; p; p = p.parent) if (!p.visible || p.name === 'labels') return false;
  const m = Array.isArray(o.material) ? o.material[0] : o.material;
  return !!m && !(m.uniforms && m.uniforms.sunPosition) && !(m.transparent && m.opacity < 0.5) && m.visible !== false;
});
check('zoom prefilter preserves results through hidden, fading, noPick and label changes', () => {
  const scene = new Scene(), hidden = new Group(), labels = new Group(), cast = T.makeRaycast();
  labels.name = 'labels'; hidden.visible = false; scene.add(hidden, labels);
  const add = (parent, y, material = mat) => { const o = new Mesh(new BoxGeometry(4, 1, 4), material); o.position.y = y; parent.add(o); return o; };
  add(hidden, 10); add(labels, 20);
  const solid = add(scene, 0), ignored = add(scene, 15); ignored.userData.noPick = true;
  const glass = add(scene, 8, mat.clone()); glass.material.transparent = true; glass.material.opacity = 0.1;
  const sky = add(scene, 50, new ShaderMaterial({ uniforms: { sunPosition: { value: new Vector3() } } }));
  const array = add(scene, 4, [glass.material, mat, mat, mat, mat, mat]);
  const compareZoom = () => { scene.updateMatrixWorld(true); const ray = down(0, 0); assert.deepEqual(summary(cast(ray, T.pickable(scene))), summary(oldPick(scene, ray))); };
  compareZoom();
  hidden.visible = true; compareZoom();
  glass.material.opacity = 0.8; compareZoom();
  array.material = [mat, glass.material, mat, mat, mat, mat]; compareZoom();
  solid.visible = false; compareZoom();
  ignored.userData.noPick = false; compareZoom();
  labels.name = ''; compareZoom();
  sky.material = mat; compareZoom();
  scene.visible = false; compareZoom();
});

check('hidden detail geometry never reaches the exact zoom raycast', () => {
  const scene = new Scene(), hidden = new Group(); hidden.visible = false; scene.add(hidden);
  for (let i = 0; i < 120; i++) hidden.add(new Mesh(new BoxGeometry(4, 1, 4), mat));
  const visible = new Mesh(new BoxGeometry(4, 1, 4), mat); scene.add(visible); scene.updateMatrixWorld(true);
  const ray = down(0, 0), cast = T.makeRaycast(), original = Mesh.prototype._computeIntersections;
  let oldTests = 0, newTests = 0;
  Mesh.prototype._computeIntersections = function (...args) { oldTests++; return original.apply(this, args); };
  oldPick(scene, ray);
  Mesh.prototype._computeIntersections = function (...args) { newTests++; return original.apply(this, args); };
  try { cast(ray, T.pickable(scene)); } finally { Mesh.prototype._computeIntersections = original; }
  assert.equal(oldTests, 121); assert.equal(newTests, 1);
});

if (process.argv.includes('--benchmark')) {
  // A deterministic thin-wall workload: every broad sphere intersects the ray, while
  // the exact wall boxes do not. Times describe this workload, not whole-app FPS.
  const objects = [], cast = T.makeRaycast(), ray = down(0, 0);
  const geometry = new BoxGeometry(300, 0.25, 0.25, 96, 1, 1);
  for (let i = 0; i < 120; i++) {
    const mesh = new Mesh(geometry, mat); mesh.position.z = 1 + i * 0.4; mesh.updateMatrixWorld(); objects.push(mesh);
  }
  compare(cast, ray, objects); // Warm both paths, including bounds and JIT.
  const times = (fn) => {
    const samples = [];
    for (let i = 0; i < 7; i++) { const t = performance.now(); for (let j = 0; j < 12; j++) fn(); samples.push((performance.now() - t) / 12); }
    samples.sort((a, b) => a - b); return samples[3];
  };
  const before = times(() => ray.intersectObjects(objects, false)), after = times(() => cast(ray, objects));
  console.log(JSON.stringify({ benchmark: '120 thin wall meshes, 96 segments each; median ms per exact downward query',
    beforeMs: before, afterMs: after, speedup: before / after, exactMeshTestsBefore: 120, exactMeshTestsAfter: 0 }, null, 2));
}
console.log(`\n${passed} render/picking regression groups passed (Three.js r${T.REVISION}).`);
