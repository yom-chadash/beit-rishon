#!/usr/bin/env python3
# round 3.0.4 (בית שני 2.0.13) - NIGHT_COALS_304, second step (found in the test): the night of the altar in BOTH readings of the
# tapuach. The first step drew the heaps of coals only where the round heap's reading has its pyres, and at the night's end it made
# the coals of that reading seen again - also when the Ra'avad's reading was chosen (there they are not seen). Now:
#  - the Ra'avad's reading (40-altar.js, ctx2.shared.__pyresR): his great and second pyre's logs, his two gezirin and his coals are
#    kept by name (night: {logs, gez, coals, fl}); at night they are not seen, and heaps of coals stand where they stand (in the amah
#    round his table, made when first needed);
#  - the fire's light, glow, smoke and sparks start from what the chosen reading made them when the night begins, and at its end
#    tapuach.set(mode) gives the reading its own fire again (also if the reading was changed meanwhile);
#  - a heap goes down onto the altar's top (scale about the top), instead of sinking into the altar's body.
# Run from the repository's root: python3 -I tools/round-3.0.4/night_raavad_patch.py
import sys

def rd(p):
    return open(p, encoding='utf-8').read()

def wr(p, s):
    open(p, 'w', encoding='utf-8').write(s)

def once(s, old, new, what):
    k = s.count(old)
    if k != 1:
        sys.exit('%s: anchor found %d times' % (what, k))
    return s.replace(old, new)

p = 'sheni-src/bundle.js'
s = rd(p)
if 'NIGHT_RAAVAD_304' in s:
    sys.exit('already applied')

# ---------- 1. the Ra'avad's pyres, kept by name ----------
s = once(s, '        instLogsB(lR); //\n',
         '        const pRK = instLogsB(lR);   // NIGHT_RAAVAD_304: his great and second pyre - not seen at night (altarNight) //\n', 'lR')
s = once(s, '        for (const dz of [-1, 1]) H2.box(mv, 0.94, 0.1, 0.94, M2.cedar, XE - 0.5 + 0.47, gTop, GP.cz + dz); //\n',
         '        const gzR = [-1, 1].map((dz) => H2.box(mv, 0.94, 0.1, 0.94, M2.cedar, XE - 0.5 + 0.47, gTop, GP.cz + dz));   // NIGHT_RAAVAD_304 //\n', 'gezirin')
s = once(s, '        [GP.cz - 3.2, GP.cz - 1.6, GP.cz, GP.cz + 1.6, GP.cz + 3.2].forEach((z, i) => { //\n',
         '        const fR0 = flames.length;   // NIGHT_RAAVAD_304 //\n        [GP.cz - 3.2, GP.cz - 1.6, GP.cz, GP.cz + 1.6, GP.cz + 3.2].forEach((z, i) => { //\n', 'fR0')
s = once(s, '        addFlame(XW, TOP + 0.3, 5, 0.6, 1.6, 16758832, 0.8); //\n',
         '        addFlame(XW, TOP + 0.3, 5, 0.6, 1.6, 16758832, 0.8); //\n        const fR = flames.slice(fR0);   // NIGHT_RAAVAD_304: his great pyre\'s five flames and his second\'s one //\n', 'fR')
s = once(s, 'ctx2.shared.__pyresR = { p3, f3, p4, pYK, top: gTop - TOP, xe: XE, xw: XW };',
         'ctx2.shared.__pyresR = { p3, f3, p4, pYK, top: gTop - TOP, xe: XE, xw: XW, night: { logs: pRK, gez: gzR, coals: coalsR, fl: fR } };', '__pyresR')

# ---------- 2. the night block, rewritten ----------
a = s.index('      const NH = new Group(); //\n')
a = s.rindex('    { //\n', 0, a)
b = s.index('    let lastT = 0; //\n', a)
NEW = r'''    { //
      // NIGHT_RAAVAD_304: both readings of the tapuach - the heaps where the reading's pyres stand; the fire as the reading has it //
      const cG = new IcosahedronGeometry(1, 0); //
      const hot = new MeshStandardMaterial({ color: 0x3a1206, emissive: 0xff5a10, emissiveIntensity: 1.5, roughness: 1 }); //
      const warm = new MeshStandardMaterial({ color: 0x2a0d05, emissive: 0xc8360a, emissiveIntensity: 1.0, roughness: 1 }); //
      const ash = new MeshStandardMaterial({ color: 0x8a8580, roughness: 1 }); //
      let seed = 3041; //
      const rnd = () => (seed = (seed * 16807) % 2147483647) / 2147483647; //
      const parent = (ctx2.shared.__coals3d && ctx2.shared.__coals3d.parent) || mv; //
      // a set of heaps: [centre x, centre z, half-sizes x / z, height, pieces, a piece's least and greatest size]; ash on the rim, the glow //
      // in the heart //
      const mkHeaps = (name, specs) => { //
        const G = new Group(); //
        G.name = name; //
        G.visible = false; //
        const lists = [[], [], []]; //
        for (const [cx, cz, rx, rz, h, n, s0, s1] of specs) { //
          for (let i = 0; i < n; i++) { //
            const a = rnd() * Math.PI * 2, r = Math.sqrt(rnd()), x = cx + Math.cos(a) * rx * r, z = cz + Math.sin(a) * rz * r; //
            const y = TOP + 0.03 + (1 - r * r) * h * (0.75 + rnd() * 0.25); //
            const k = r > 0.82 ? (rnd() < 0.7 ? 2 : 1) : r > 0.55 ? (rnd() < 0.35 ? 2 : 1) : (rnd() < 0.6 ? 0 : 1); //
            lists[k].push([x, y, z, s0 + rnd() * (s1 - s0)]); //
          } //
        } //
        const m4 = new Matrix4(), q4 = new Quaternion(), e4 = new Euler(), v4 = new Vector3(), s4 = new Vector3(); //
        lists.forEach((list, k) => { //
          if (!list.length) return; //
          const im = new InstancedMesh(cG, [hot, warm, ash][k], list.length); //
          list.forEach((q, i) => { e4.set(rnd() * 6.28, rnd() * 6.28, rnd() * 6.28); q4.setFromEuler(e4); v4.set(q[0], q[1], q[2]); s4.set(q[3] * 1.3, q[3] * 0.7, q[3]); m4.compose(v4, q4, s4); im.setMatrixAt(i, m4); }); //
          im.userData.noPick = true; //
          im.receiveShadow = true; //
          G.add(im); //
        }); //
        parent.add(G); //
        return G; //
      }; //
      const NH = mkHeaps("nightCoals", [ //
        [(GP.x0 + GP.x1) / 2, GP.cz, 1.75, 3.1, 0.55, 300, 0.07, 0.15],   // where the great pyre stands (4.5 x 8) //
        [GP.x0 - 0.2, GP.cz + GP.hz - 0.6, 0.75, 0.6, 0.28, 50, 0.06, 0.11],   // its south-west foot - the inner coals, whence the terumah //
        [46, 5, 0.62, 0.55, 0.24, 46, 0.05, 0.1]]);   // the second pyre (addPyre(46, 5, ...)) //
      let NHR = null;   // the Ra'avad's reading: by his table (ctx2.shared.__pyresR, built below), made when first needed //
      const heapsR = (RS) => NHR || (NHR = mkHeaps("nightCoalsRaavad", [ //
        [RS.xe, GP.cz, 0.42, GP.hz - 0.3, 0.42, 150, 0.06, 0.12],   // his great pyre, in the amah round the table //
        [RS.xw, 5, 0.55, 0.6, 0.22, 40, 0.05, 0.1]]));   // his second //
      ctx2.animated.push((t) => { if (!NH.visible && !(NHR && NHR.visible)) return; hot.emissiveIntensity = 1.35 + 0.4 * Math.sin(t * 0.0068) * Math.sin(t * 0.0029 + 1); warm.emissiveIntensity = 0.85 + 0.3 * Math.sin(t * 0.0091 + 2); }); //
      // the heap goes down onto the altar's top as k falls (scaled about the top, not about the ground) //
      const flat = (H, k) => { const sc = Math.max(0.05, k); H.visible = k > 0.01; H.scale.y = sc; H.position.y = TOP * (1 - sc); }; //
      let B = null;   // the reading's fire as it is when the night begins (tapuach.set gives each reading its own) //
      ctx2.shared.altarNight = { //
        k: 0, //
        set(k) { //
          k = Math.max(0, Math.min(1, +k || 0)); //
          if (Math.abs(k - this.k) < 1e-4) return; //
          const T = ctx2.shared.tapuach, RS = ctx2.shared.__pyresR; //
          if (!B) B = { rv: !!(T && T.mode === "raavad" && RS && RS.night), top: FXP.top, gy: glow.position.y, op: glow.material.opacity, sx: glow.scale.x, sy: glow.scale.y, fl: fireLight.position.y }; //
          this.k = k; //
          const night = k > 0.5, R = B.rv ? RS.night : null; //
          if (R) { //
            R.logs.visible = !night; //
            R.coals.visible = !night; //
            for (const g of R.gez) g.visible = !night; //
            flat(heapsR(RS), k); //
          } else { //
            pyreLogsK.visible = !night; //
            coals.visible = !night;   // the plane between the gezirin, on the pyre's top //
            if (ctx2.shared.__coals3d) ctx2.shared.__coals3d.visible = !night; //
            flat(NH, k); //
          } //
          for (const f of R ? R.fl : GPF) { //
            const u = f.userData; //
            if (u.ny0 == null) { u.ny0 = f.position.y; u.nh0 = u.h; } //
            f.position.y = u.ny0 + (TOP + 0.3 - u.ny0) * k; //
            u.h = u.nh0 * (1 - 0.62 * k); //
          } //
          FXP.top = B.top + (0.55 - B.top) * k; //
          glow.position.y = B.gy + (TOP + 1.0 - B.gy) * k; //
          glow.material.opacity = B.op * (1 - 0.25 * k); //
          glow.scale.set(B.sx * (1 - 0.3 * k), B.sy * (1 - 0.45 * k), 1); //
          fireLight.position.y = B.fl - 2.2 * k; //
          if (k < 1e-4) {   // the night over: the reading's own fire, as tapuach.set makes it (also if the reading was changed meanwhile) //
            B = null; //
            if (T && typeof T.set === "function") T.set(T.mode); //
          } //
        } //
      }; //
    } //
'''
s = s[:a] + NEW + s[b:]
wr(p, s)
print('NIGHT_RAAVAD_304 applied')
