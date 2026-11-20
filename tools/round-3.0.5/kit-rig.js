    // MUSICIANS_305 (the user, 19.11.2026 21:08: "צריך גם לעשות את הלוויים מנגנים... אם הם מנגנים, לא יכולים לעמוד כמו פסלים"; 21:10:
    // "ידיים של הכוהנים תופסות את החצוצרה, אי אפשר בלי"): ARMS THAT MOVE, for the figures of a crowd built with o.arms === false (their
    // own arms are left out, near and mid). rig(parent, n, o) - o = { robe (the sleeves' colour), skin(i) (the hand's tint, as the
    // crowd's SKINS index) } -> { g, arm(i, side, M, S, E, W), done() }: the arm `side` (+1 the left, at +x; -1 the right) of figure
    // i; M its matrix (place, turn, scale, in the parent's frame); S, E, W - the shoulder, the elbow and the wrist in the figure's own
    // units (its face to +z). The upper arm and the forearm are tubes from joint to joint, the joints round, the hand along the
    // forearm, its thumb inward. Every part one InstancedMesh; no shadows; not culled (the matrices change every frame).
    // This house's copy only.
    const rig = (parent, n, o) => {
      const g = new Group();
      g.name = "peopleRig";
      const mk = (geo, m, c) => { const im = new InstancedMesh(geo, m, c); im.castShadow = false; im.receiveShadow = true; im.frustumCulled = false; im.userData.noPick = true; g.add(im); return im; };
      const tube = (r0, r1) => shade(new CylinderGeometry(r1, r0, 1, 6, 1, true).translate(0, 0.5, 0), 0.93);
      const mC = clothMat(o.robe);
      const uA = mk(tube(0.072, 0.06), mC, 2 * n), fA = mk(tube(0.058, 0.048), mC, 2 * n), jA = mk(shade(new SphereGeometry(1, 7, 5), 0.95), mC, 4 * n);
      const handG = (sd) => skinPart(mergeGeometries([at(sph(0.03, 0.0135, 0.042, 5, 3), 0, 0, 0.04), at(sph(0.027, 0.011, 0.03, 5, 3), 0, -0.006, 0.085),
        at(sph(0.01, 0.01, 0.024, 4, 2), -sd * 0.026, 0.004, 0.03)]));
      const hA = { 1: mk(handG(1), mSkin, n), "-1": mk(handG(-1), mSkin, n) };
      const cH = new Color();
      for (let i = 0; i < n; i++) {
        cH.setHex(SKINS[((o.skin ? o.skin(i) : i) * 5 + 1) % SKINS.length]);
        hA[1].setColorAt(i, cH);
        hA[-1].setColorAt(i, cH);
      }
      for (const k of [1, -1]) if (hA[k].instanceColor) hA[k].instanceColor.needsUpdate = true;
      const Z0 = new Matrix4().makeScale(0, 0, 0), mL = new Matrix4(), mW = new Matrix4(), qA = new Quaternion(), qI = new Quaternion(), vA = new Vector3(), vS = new Vector3();
      const YV = new Vector3(0, 1, 0), ZV = new Vector3(0, 0, 1);
      for (const im of [uA, fA]) for (let j = 0; j < 2 * n; j++) im.setMatrixAt(j, Z0);   // until a figure's arm is set, it is not drawn
      for (let j = 0; j < 4 * n; j++) jA.setMatrixAt(j, Z0);
      for (let j = 0; j < n; j++) { hA[1].setMatrixAt(j, Z0); hA[-1].setMatrixAt(j, Z0); }
      const put = (im, j, P, Q, sx, sy, sz, M) => { mL.compose(P, Q, vS.set(sx, sy, sz)); mW.multiplyMatrices(M, mL); im.setMatrixAt(j, mW); };
      parent.add(g);
      return {
        g,
        arm(i, side, M, S, E, W) {
          const j = 2 * i + (side > 0 ? 1 : 0);
          vA.subVectors(E, S);
          const lu = vA.length() || 1e-6;
          qA.setFromUnitVectors(YV, vA.multiplyScalar(1 / lu));
          put(uA, j, S, qA, 1, lu, 1, M);
          vA.subVectors(W, E);
          const lf = vA.length() || 1e-6;
          vA.multiplyScalar(1 / lf);
          qA.setFromUnitVectors(YV, vA);
          put(fA, j, E, qA, 1, lf, 1, M);
          put(jA, 2 * j, S, qI, 0.074, 0.074, 0.074, M);
          put(jA, 2 * j + 1, E, qI, 0.06, 0.06, 0.06, M);
          qA.setFromUnitVectors(ZV, vA);
          put(hA[side > 0 ? 1 : -1], i, W, qA, 1, 1, 1, M);
        },
        done() { for (const im of [uA, fA, jA, hA[1], hA[-1]]) im.instanceMatrix.needsUpdate = true; }
      };
    };
