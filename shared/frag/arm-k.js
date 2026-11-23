    // ===== ARM_K (fix-k, 23.11.2026 - the user via the coordinator: "הכהנים אמורים להקיף עם ארבעת המינים בנטילה, ולא סתם בסחיבה"): ARMS
    // THAT HOLD, for a figure of either house (one construction, shared/frag/arm-k.js, by an include line "arm-k"): the sleeve to the elbow,
    // the forearm and hand.js's hand at the wrist, of the priests' kit's measures, solved to where the hand must be (two bones: the shoulder,
    // the elbow toward `pole`, the wrist), the hand turned as asked; and THE FOUR SPECIES IN NETILAH - the lulav, the hadassim and the aravot
    // bound with it, upright in the right hand (its fingers closed round the binding: hand.js "grip"), the etrog in the left (closed round
    // it: "gripW"), the two hands close together before the chest. The same hands as the waving of the first fruits (57-add208.js HANDS_K).
    //   tm_armK(K) - K: a house's priests' kit (SH.priestKit, ark_kit()) -> null, or { arm(parent, sd, mat, mid), setArm(A, W, q, pose,
    //   pole), handQ(sd, F, N), four(G, mat) }: four - on a walker G (its feet at 0, its face to +z, its left at +x) of the people's kit built
    //   without its own arms - the two arms, the lulav and the etrog -> { arms, lulav, etrog, R, L, parts } (R / L: the rings' middles and ways,
    //   in G; parts - all it added, to show or hide); branch(G, mat) - a willow's branch in netilah (below)
    // MODEL CHOICES: the measures and forms of the lulav (1.3 amot, its spine to the holder), of the three hadassim (to its right) and the
    // two aravot (to its left), of the three bindings and of the etrog (0.28 amah long); the hands' places and the elbows.
    const tm_armK = (K) => {
      if (!K || !K.handWr || !K.handAt) return null;
      const FS = K.FS, sc = (q, s) => q.scale(s, s, s), W1 = (q) => K.white(q);
      const up = K.UP * FS, fo = K.FORE * FS, sx = K.SH_X * FS, sy = K.SH_Y * FS;
      const upG = sc(mergeGeometries([W1(K.sph(0.07, 0.07, 0.07, 14, 10)), W1(K.at(new CylinderGeometry(0.07, 0.058, K.UP, 14), 0, -K.UP / 2, 0)), W1(K.at(K.sph(0.058, 0.058, 0.058, 12, 8), 0, -K.UP, 0))]), FS);
      const foG = sc(W1(K.at(new CylinderGeometry(0.056, 0.046, K.FORE, 14), 0, -K.FORE / 2, 0)), FS);
      const DOWN = new Vector3(0, -1, 0), _a = new Vector3(), _n = new Vector3(), _w = new Vector3();
      const cl = (v, a, b) => (v < a ? a : v > b ? b : v);
      // an arm on `parent` (the figure's frame), its shoulder at (sd sx, sy, 0); mid - the hand in fewer faces (from a few amot)
      const arm = (parent, sd, m, mid) => {
        const u = new Mesh(upG, m), f = new Mesh(foG, m), h = new Mesh(K.handWr(sd, "rest", !!mid), K.mHand);
        for (const o of [u, f, h]) { o.castShadow = true; o.userData.noPick = true; parent.add(o); }
        const S0 = new Vector3(sd * sx, sy, 0); u.position.copy(S0);
        return { sd, S0, u, f, h, mid: !!mid, pose: "rest", E: new Vector3(), W: new Vector3(), short: 0 };
      };
      // the wrist at W, the hand turned by q (in the parent's frame), the elbow toward pole
      const setArm = (A, W, q, pose, pole) => {
        if (pose && A.pose !== pose) { A.h.geometry = K.handWr(A.sd, pose, A.mid); A.pose = pose; }
        _a.subVectors(W, A.S0); const D = _a.length() || 1e-6; _a.multiplyScalar(1 / D);
        const Dc = Math.min(D, up + fo - 1e-4), ca = cl((up * up + Dc * Dc - fo * fo) / (2 * up * Dc), -1, 1);
        _n.copy(pole).addScaledVector(_a, -pole.dot(_a)).normalize();
        A.E.copy(A.S0).addScaledVector(_a, up * ca).addScaledVector(_n, up * Math.sqrt(Math.max(0, 1 - ca * ca)));
        A.W.copy(A.S0).addScaledVector(_a, Dc); A.short = D - Dc;
        A.u.quaternion.setFromUnitVectors(DOWN, _w.subVectors(A.E, A.S0).normalize());
        A.f.position.copy(A.E); A.f.quaternion.setFromUnitVectors(DOWN, _w.subVectors(A.W, A.E).normalize());
        A.h.position.copy(A.W); A.h.quaternion.copy(q);
      };
      // the hand turned so that its fingers go along F and its palm looks toward N (handWr's frame: the fingers down, the palm toward
      // (-sd sin 0.95, 0, -cos 0.95) - priest-kit.js handRaw)
      const handQ = (sd, F, N) => {
        const Fh = new Vector3(0, -1, 0), Nh = new Vector3(-sd * Math.sin(0.95), 0, -Math.cos(0.95)), Bh = new Vector3().crossVectors(Fh, Nh);
        const Fn = F.clone().normalize(), Nt = N.clone().addScaledVector(Fn, -N.dot(Fn)).normalize(), Bt = new Vector3().crossVectors(Fn, Nt);
        return new Quaternion().setFromRotationMatrix(new Matrix4().makeBasis(Fn, Nt, Bt).multiply(new Matrix4().makeBasis(Fh, Nh, Bh).transpose()));
      };
      // a closed hand (pose "grip" / "gripW") whose ring's middle is at C, the held thing's way through it `ax` (from the little finger to
      // the first), the wrist toward `wd` from it (made square to ax) -> { q, W } (the hand's turn and the wrist's place)
      const ringHold = (sd, pose, C, ax, wd) => {
        const G = K.handAt(sd, pose), Axh = K.handAt(sd, pose + "Ax").normalize(), Wh = G.clone().negate();
        Wh.addScaledVector(Axh, -Wh.dot(Axh)).normalize();
        const a = ax.clone().normalize(), w = wd.clone().addScaledVector(a, -wd.dot(a)).normalize();
        const q = new Quaternion().setFromRotationMatrix(new Matrix4().makeBasis(a, w, new Vector3().crossVectors(a, w)).multiply(new Matrix4().makeBasis(Axh, Wh, new Vector3().crossVectors(Axh, Wh)).transpose()));
        return { q, W: C.clone().sub(G.clone().applyQuaternion(q)) };
      };
      // ---- the four species (built once; the walkers share their geometries)
      let SP = null;
      const species = () => {
        if (SP) return SP;
        const lulavM = new MeshStandardMaterial({ color: 0x7f9446, roughness: 0.75 }), hadasM = new MeshStandardMaterial({ color: 0x2f5a2a, roughness: 0.7 });
        const aravaM = new MeshStandardMaterial({ color: 0x86a65e, roughness: 0.8 }), stemM = new MeshStandardMaterial({ color: 0x6b5a32, roughness: 0.85 }), etrogM = new MeshStandardMaterial({ color: 0xdcc43a, roughness: 0.55 });
        // the lulav: a closed frond, flat, narrowing to its tip, from 0.25 under the hand to 1.05 over it; its binding under the hand
        // (a sleeve of its own leaves, as thick as the closed hand's ring - 0.027); two more bindings over and under the hand
        const parts = [];
        parts.push(new CylinderGeometry(0.006, 0.022, 1.3, 8).scale(1.7, 1, 1).translate(0, 0.4, 0.004));
        parts.push(new CylinderGeometry(0.027, 0.027, 0.17, 14).translate(0, 0, 0));
        for (const y of [-0.17, 0.13]) parts.push(new TorusGeometry(0.031, 0.005, 6, 16).rotateX(Math.PI / 2).translate(0, y, 0));
        const lulavG = mergeGeometries(parts.map((g) => g.index ? g.toNonIndexed() : g));
        // three hadassim to its right (-x: the holder's right) and two aravot to its left (+x), their stems from the binding up to 0.55
        const stemG = mergeGeometries([[-0.026, 0.006], [-0.02, -0.014], [-0.03, -0.004], [0.026, 0.004], [0.02, -0.014]].map(([x, z], i) => new CylinderGeometry(0.0035, 0.005, 0.78, 5).translate(x * (i < 3 ? 1 : 1), 0.18, z).toNonIndexed()));
        const hadasLeaf = new SphereGeometry(1, 6, 4).scale(0.011, 0.019, 0.003), aravaLeaf = new SphereGeometry(1, 6, 4).scale(0.006, 0.055, 0.002);
        const HM = [], AM = [], m4 = new Matrix4(), qq = new Quaternion(), e = new Euler();
        [[-0.026, 0.006], [-0.02, -0.014], [-0.03, -0.004]].forEach(([x, z], s) => {   // the hadas: whorls of three leaves ("עבות")
          for (let k = 0; k < 13; k++) { const y = 0.12 + k * 0.034; for (let j = 0; j < 3; j++) { const a = j * 2.094 + k * 0.6 + s; qq.setFromEuler(e.set(0.5, a, 0, "YXZ")); m4.compose(new Vector3(x + Math.sin(a) * 0.012, y + 0.01, z + Math.cos(a) * 0.012), qq, new Vector3(1, 1, 1)); HM.push(m4.clone()); } }
        });
        [[0.026, 0.004], [0.02, -0.014]].forEach(([x, z], s) => {   // the arava: long narrow leaves along it
          for (let k = 0; k < 14; k++) { const y = 0.1 + k * 0.032, a = k * 2.4 + s * 1.3; qq.setFromEuler(e.set(0.35, a, 0, "YXZ")); m4.compose(new Vector3(x + Math.sin(a) * 0.01, y + 0.03, z + Math.cos(a) * 0.01), qq, new Vector3(1, 1, 1)); AM.push(m4.clone()); }
        });
        // the etrog: its pitam up, a little stem below; 0.28 long, 0.212 across (the closed hand's ring round it - "gripW", 0.22 across)
        const etrogG = mergeGeometries([new SphereGeometry(1, 22, 16).scale(0.106, 0.14, 0.106).toNonIndexed(), new ConeGeometry(0.012, 0.035, 8).translate(0, 0.155, 0).toNonIndexed(), new CylinderGeometry(0.006, 0.008, 0.02, 6).translate(0, -0.148, 0).toNonIndexed()]);
        return (SP = { lulavG, stemG, hadasLeaf, aravaLeaf, HM, AM, lulavM, hadasM, aravaM, stemM, etrogM, etrogG });
      };
      // the hands' places in the walker's frame: the right ring (the lulav's binding) 0.09 to his right, the left ring (the etrog's middle)
      // 0.1 to his left - 0.19 apart; both before his chest; the wrists toward him and a little out
      const CR = new Vector3(-0.09, 2.02, 0.34), CL = new Vector3(0.1, 1.98, 0.36), UPV = new Vector3(0, 1, 0);
      const HR = ringHold(-1, "grip", CR, UPV, new Vector3(-0.35, 0, -0.94)), HL = ringHold(1, "gripW", CL, UPV, new Vector3(0.35, 0, -0.94));
      const POLE = { 1: new Vector3(0.6, -1, -0.3).normalize(), "-1": new Vector3(-0.6, -1, -0.3).normalize() };
      const four = (G, mat) => {
        const S = species(), arms = { 1: arm(G, 1, mat, true), "-1": arm(G, -1, mat, true) };
        setArm(arms[-1], HR.W, HR.q, "grip", POLE[-1]);
        setArm(arms[1], HL.W, HL.q, "gripW", POLE[1]);
        const lulav = new Group(); lulav.position.copy(CR); G.add(lulav);
        const add = (g, m) => { const o = new Mesh(g, m); o.castShadow = true; o.userData.noPick = true; lulav.add(o); return o; };
        add(S.lulavG, S.lulavM); add(S.stemG, S.stemM);
        for (const [geo, M, mt] of [[S.hadasLeaf, S.HM, S.hadasM], [S.aravaLeaf, S.AM, S.aravaM]]) { const im = new InstancedMesh(geo, mt, M.length); M.forEach((m, i) => im.setMatrixAt(i, m)); im.instanceMatrix.needsUpdate = true; im.userData.noPick = true; lulav.add(im); }
        const etrog = new Mesh(S.etrogG, S.etrogM); etrog.position.copy(CL); etrog.castShadow = true; etrog.userData.noPick = true; G.add(etrog);
        return { arms, lulav, etrog, R: { C: CR, ax: UPV }, L: { C: CL, ax: UPV }, parts: [arms[1].u, arms[1].f, arms[1].h, arms[-1].u, arms[-1].f, arms[-1].h, lulav, etrog] };
      };
      // ---- a willow's branch in netilah (ARAVAH_K - prepared, the coordinator: "ענף ערבה זקוף ביד ימין, בנטילה ובנענוע, לא בסחיבה"):
      // upright in the right hand (closed round its stem: hand.js "fist", a rod 0.0084 amah in radius), before the chest, shaken a little
      // forward and back as he walks (tick); the left hand hangs. Its length (1.4 amot) and leaves - model choices
      let BR = null;
      const branchGeo = () => {
        if (BR) return BR;
        const stemM = new MeshStandardMaterial({ color: 0x6d6a3e, roughness: 0.85 }), leafM = new MeshStandardMaterial({ color: 0x7a9a58, roughness: 0.8, side: DoubleSide });
        const stem = new CylinderGeometry(0.003, 0.0084, 1.4, 6).translate(0, 0.5, 0);
        const twigs = [], LM = [], m4 = new Matrix4(), qq = new Quaternion(), e = new Euler();
        let r = 7;
        const rr = () => (r = (r * 1664525 + 1013904223) >>> 0) / 4294967296;
        for (let k = 0; k < 4; k++) { const y0 = 0.45 + k * 0.17, sd = k % 2 ? 1 : -1; twigs.push(new CylinderGeometry(0.0015, 0.003, 0.3, 4).translate(0, 0.15, 0).rotateZ(-sd * 0.5).translate(0, y0, 0)); }
        for (let k = 0; k < 46; k++) { const y = 0.3 + rr() * 0.88, a = rr() * Math.PI * 2; qq.setFromEuler(e.set(0.25 + rr() * 0.5, a, 0, "YXZ")); m4.compose(new Vector3(Math.sin(a) * 0.012, y, Math.cos(a) * 0.012), qq, new Vector3(1, 1, 1)); LM.push(m4.clone()); }
        return (BR = { stem: mergeGeometries([stem.toNonIndexed()].concat(twigs.map((g) => g.toNonIndexed()))), leaf: new PlaneGeometry(0.022, 0.13).translate(0, -0.065, 0), LM, stemM, leafM });
      };
      const CB = new Vector3(-0.07, 2.02, 0.36), HB = ringHold(-1, "fist", CB, UPV, new Vector3(-0.35, 0, -0.94));
      const branch = (G, mat) => {
        const S = branchGeo(), arms = { 1: arm(G, 1, mat, true), "-1": arm(G, -1, mat, true) };
        setArm(arms[1], new Vector3(sx + 0.07, sy - (up + fo) * 0.985, 0.1), handQ(1, new Vector3(0, -1, 0.1), new Vector3(-1, 0, 0)), "rest", POLE[1]);
        const b = new Group(); G.add(b);
        const st = new Mesh(S.stem, S.stemM); st.castShadow = true; st.userData.noPick = true; b.add(st);
        const im = new InstancedMesh(S.leaf, S.leafM, S.LM.length); S.LM.forEach((m, i) => im.setMatrixAt(i, m)); im.instanceMatrix.needsUpdate = true; im.userData.noPick = true; b.add(im);
        const off = new Vector3();
        // the shaking: the hand and the branch together, forward and back 0.05 and a little up and down (the branch tilting with it)
        const tick = (t) => {
          const w = Math.sin(t * 9), v = Math.sin(t * 18) * 0.25;
          off.set(0, 0.012 * v, 0.05 * w);
          const C = CB.clone().add(off), q = new Quaternion().setFromAxisAngle(new Vector3(1, 0, 0), 0.12 * w);
          b.position.copy(C); b.quaternion.copy(q);
          setArm(arms[-1], C.clone().sub(K.handAt(-1, "fist").applyQuaternion(q.clone().multiply(HB.q))), q.clone().multiply(HB.q), "fist", POLE[-1]);
        };
        tick(0);
        return { arms, branch: b, tick, R: { C: CB, ax: UPV }, parts: [arms[1].u, arms[1].f, arms[1].h, arms[-1].u, arms[-1].f, arms[-1].h, b] };
      };
      return { up, fo, sx, sy, arm, setArm, handQ, ringHold, four, branch };
    };
