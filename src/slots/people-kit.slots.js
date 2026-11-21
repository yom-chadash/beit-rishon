//@@begin tm_people.SASH_C
    const SASH_C = [new Color(0x3d62ab), new Color(0x8e1f34), new Color(0xc5432b)];
    const sashK = (yo) => {
      const out = SASH_C.map((col, k) => tint(surf(14, 1, (u, v, o) => {
        const y = 1.27 + k * 0.034 + v * 0.034, a = u * TAU + Math.PI;
        o.x = spl(bX, y) * 1.035 * Math.sin(a); o.y = y + yo; o.z = spl(bZ, y) * 1.035 * Math.cos(a); o.c = 1;
      }), col));
      out.push(tint(at(new BoxGeometry(0.045, 0.4, 0.014), 0.035, 1.08 + yo, spl(bZ, 1.1) * 1.07), SASH_C[0]));
      out.push(tint(at(new BoxGeometry(0.045, 0.34, 0.014), -0.03, 1.11 + yo, spl(bZ, 1.1) * 1.08), SASH_C[1]));
      return out;
    };
//@@end tm_people.SASH_C
//@@begin build
    const build = (pose, L, kind, robeCol) => {
      const key = pose + "|" + L.toFixed(3) + "|" + kind + "|" + (robeCol == null ? "" : robeCol);
//@@end build
//@@begin build-2
          for (const q of arm([sd * 0.25, SY - 0.01, 0], [sd * 0.275, 1.4, 0.02], W)) cloth.push(q);
          skin.push(hand(sd, sd > 0 ? [0.1, 1.395, 0.26] : [-0.09, 1.475, 0.27], -sd * 0.3));
//@@end build-2
//@@begin build-3
      if (kind === "kohen") for (const q of sashK(seated ? -OFF : 0)) cloth.push(q);
//@@end build-3
//@@begin build-4
        : [[0.25, 1.1], [0.19, 3.3], [0.14, 5.2]].map(([len, w2]) => mergeGeometries(base().concat(stache().map(headT), [headT(beard(len, w2))])));
      // PEOPLE_KIT_205 - the plain figure (from ~22 amot): the same body in a few faces - the robe, the lap, the arms, the kippah; the
      // head with its painted face; the beard (or a young man's hair and peyot) in its own colour
//@@end build-4
//@@begin build-5
        mc.push(shade(limb([sd * 0.245, SY - 0.01, 0], E, 0.074, 0.06, 5), 0.95));
        mc.push(shade(limb(E, W, 0.058, 0.048, 5), 0.9));
        ms.push(skinPart(at(sph(0.032, 0.016, 0.05, 4, 3), W[0] - sd * 0.02, W[1] - 0.02, W[2] + 0.05)));
//@@end build-5
//@@begin build-6
      if (kind === "kohen") mc.push(sashK(seated ? -OFF : 0)[1]);
//@@end build-6
//@@begin build-7
      } else mh.push(headT(beard(0.2, 2.2, 8, 3)));
      const mid = { cloth: mergeGeometries(mc), skin: mergeGeometries(ms), hair: mergeGeometries(mh) };
      // from afar: the robe, the head and the kippah, plain
//@@end build-7
//@@begin build-8
      return (cache[key] = { cloth: mergeGeometries(cloth), skin: mergeGeometries(skin), hair, mid, far: mergeGeometries(far) });
//@@end build-8
//@@begin crowd.n
      const n = pts.length, L = o.pose === "bench" ? o.seat / o.s : 0, G = build(o.pose, L, o.kind, o.robe), mCl0 = clothMat(o.robe);
//@@end crowd.n
//@@begin crowd.avN
//@@end crowd.avN
//@@begin crowd
      pts.forEach(([x, z, yaw], i) => {
        const big = o.big === i, s = o.s * (big ? 1.08 : 0.97 + rnd() * 0.06), fw = o.fwd || 0;
        qt.setFromAxisAngle(up, yaw + (rnd() - 0.5) * (o.pose === "bench" ? 0.16 : 0.3));
        m4.compose(ps.set(x + Math.sin(yaw) * fw, o.y, z + Math.cos(yaw) * fw), qt, sc.set(s, s, s));
        for (const im of [cloth, skin, fm, mCl, mSk, mHr]) im.setMatrixAt(i, m4);
//@@end crowd
//@@begin crowd.pal
        const pal = TONES[o.kind === "student" ? 3 : (o.tone ? o.tone(i) : 1)], k = big ? 0 : (i * 7 + 3) % hairs.length;
//@@end crowd.pal
//@@begin crowd-2
//@@end crowd-2
//@@begin crowd-3
      for (const im of [cloth, skin, fm, mCl, mSk, mHr].concat(hairs)) {
        im.instanceMatrix.needsUpdate = true;
        if (im.instanceColor) im.instanceColor.needsUpdate = true;
        if (im.count > 0) (im === fm ? far : im === mCl || im === mSk || im === mHr ? mid : near).add(im);
//@@end crowd-3
//@@begin crowd-4
      LOD.push({ near, mid, far, anchor, R: R * 1.0, lv: 1 });
      return near;
//@@end crowd-4
//@@begin tm_people.d
        const d = Math.max(0, wp.distanceTo(cam.position) - e.R) * f;
//@@end tm_people.d
//@@begin tm_people.after-lv
//@@end tm_people.after-lv
//@@begin tm_people.after-age
    return (ctx.__tmPeople = { crowd, facing, age });
  }
  // ===== PEOPLE_KIT_204 END
//@@end tm_people.after-age
