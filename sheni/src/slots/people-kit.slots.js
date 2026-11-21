//@@begin tm_people.SASH_C
    // AVNET_305 (the user, 19.11.2026 23:36: "יש בעיה עם האבנט של הכהנים בשמחת בית השואבה הוא לא מה שיצרנו כבר"): the avnet of the
    // lottery's priest (55-payis.js AVNET_211) - one band at the elbows' height ("כנגד אצילי ידיו", Klei HaMikdash 10:1), three turns
    // "כרך על גבי כרך" (8:19), each rounded; its threads twined, their colours melting into one hue - tekhelet, argaman, tola'at shani
    // and white (8:1, 8:13) - or all white in "של בוץ" (Yoma 12b; the row "אבנטו של כהן הדיוט": ctx.shared.peopleAvnet.set). Its own
    // InstancedMesh, near and mid (none from afar). Until 3.0.4: three separate stripes at the waist and two ends hanging before him.
    const AVN = ctx.shared.peopleAvnet || (ctx.shared.peopleAvnet = (() => {
      const weave = (pal, seed) => {   // as the lottery's priest's: fine threads, twined - every row leans the other way
        const cv = document.createElement("canvas");
        cv.width = 256;
        cv.height = 48;
        const c = cv.getContext("2d");
        let q = seed >>> 0;
        const r = () => { q = (q * 1664525 + 1013904223) >>> 0; return q / 4294967296; };
        c.fillStyle = pal[0][0];
        c.fillRect(0, 0, 256, 48);
        const rows = 12, rh = 48 / rows, tot = pal.reduce((t, x) => t + x[1], 0);
        const pick = () => { let x = r() * tot; for (const y of pal) { x -= y[1]; if (x <= 0) return y[0]; } return pal[0][0]; };
        c.lineCap = "round";
        c.lineWidth = 3.1;
        for (let k = 0; k < rows; k++) {
          const lean = (k % 2 ? 1 : -1) * rh * 0.9, y = k * rh;
          for (let x = -8; x < 264; x += 4) {
            c.strokeStyle = pick();
            c.globalAlpha = 0.8 + r() * 0.2;
            for (const dx of [0, 256, -256]) { c.beginPath(); c.moveTo(x + dx, y + 0.6); c.lineTo(x + dx + lean, y + rh - 0.6); c.stroke(); }
          }
        }
        c.globalAlpha = 1;
        const t = new CanvasTexture(cv);
        t.wrapS = t.wrapT = RepeatWrapping;
        t.colorSpace = SRGBColorSpace;
        t.repeat.set(5, 1);
        t.anisotropy = 4;
        return t;
      };
      const mat = (pal, seed) => new MeshStandardMaterial({ color: 0xffffff, map: weave(pal, seed), vertexColors: true, roughness: 0.88 });
      const D = mat([["#3d62ab", 4.2], ["#8e1f34", 3.1], ["#c5432b", 1.3], ["#e6e1d3", 1]], 20261119);
      const Wt = mat([["#f7f5ee", 4], ["#e0dbcc", 3], ["#ffffff", 2], ["#cfc9b7", 1]], 20261120);
      const P = {
        white: false, meshes: [],
        mat() { const Y = ctx.shared.payis; if (Y && Y.avnet) P.white = Y.avnet === "butz"; return P.white ? Wt : D; },
        set(m) { P.white = m === "butz"; const M = P.white ? Wt : D; for (const im of P.meshes) im.material = M; return P.white ? "butz" : "rambam"; }
      };
      return P;
    })());
    const AV0 = 1.312, AV1 = 1.462;   // the lottery's priest's band (SY0, SY1)
    const avnet = (yo, nu, nv) => surf(nu, nv, (u, v, o) => {
      const tv = (v * 3) % 1, e = Math.max(0, Math.sin(Math.PI * tv)) * (0.55 + 0.45 * Math.sin(Math.PI * v));
      const y = AV0 + v * (AV1 - AV0), a = u * TAU + Math.PI, th = 0.004 + 0.017 * Math.pow(e, 0.35);
      o.x = (spl(bX, y) + th) * Math.sin(a);
      o.y = y + yo;
      o.z = (spl(bZ, y) + th) * Math.cos(a);
      o.c = 0.88 + 0.12 * e;
    });
//@@end tm_people.SASH_C
//@@begin build
    const build = (pose, L, kind, robeCol, young, noArms) => {   // YOUNG_300: young - a short beard (the young priests of the water-drawing); MUSICIANS_305: noArms
      const key = pose + "|" + L.toFixed(3) + "|" + kind + "|" + (robeCol == null ? "" : robeCol) + (young ? "|young" : "") + (noArms ? "|na" : "");
//@@end build
//@@begin build-2
          if (!noArms) for (const q of arm([sd * 0.25, SY - 0.01, 0], [sd * 0.275, 1.4, 0.02], W)) cloth.push(q);   // MUSICIANS_305
          if (!noArms) skin.push(hand(sd, sd > 0 ? [0.1, 1.395, 0.26] : [-0.09, 1.475, 0.27], -sd * 0.3));
//@@end build-2
//@@begin build-3
      const avG = kind === "kohen" ? avnet(seated ? -OFF : 0, 40, 12) : null;   // AVNET_305
//@@end build-3
//@@begin build-4
        : (young ? [[0.05, 2.0]] : [[0.25, 1.1], [0.19, 3.3], [0.14, 5.2]]).map(([len, w2]) => mergeGeometries(base().concat(stache().map(headT), [headT(beard(len, w2))])));
      // PEOPLE_KIT_205 - the plain figure (from ~22 amot): the same body in a few faces - the robe, the lap, the arms, the kippah; the
      // head with its painted face; the beard (or a young man's hair and peyot) in its own colour
//@@end build-4
//@@begin build-5
        if (!noArms) mc.push(shade(limb([sd * 0.245, SY - 0.01, 0], E, 0.074, 0.06, 5), 0.95));
        if (!noArms) mc.push(shade(limb(E, W, 0.058, 0.048, 5), 0.9));
        if (!noArms) ms.push(skinPart(at(sph(0.032, 0.016, 0.05, 4, 3), W[0] - sd * 0.02, W[1] - 0.02, W[2] + 0.05)));
//@@end build-5
//@@begin build-6
      const avM = kind === "kohen" ? avnet(seated ? -OFF : 0, 16, 9) : null;   // AVNET_305
//@@end build-6
//@@begin build-7
      } else mh.push(headT(beard(young ? 0.05 : 0.2, 2.2, 8, 3)));
      const mid = { cloth: mergeGeometries(mc), skin: mergeGeometries(ms), hair: mergeGeometries(mh), avnet: avM };
      // from afar: the robe, the head and the kippah, plain
//@@end build-7
//@@begin build-8
      return (cache[key] = { cloth: mergeGeometries(cloth), skin: mergeGeometries(skin), hair, mid, far: mergeGeometries(far), avnet: avG });
//@@end build-8
//@@begin crowd.n
      const n = pts.length, L = o.pose === "bench" ? o.seat / o.s : 0, G = build(o.pose, L, o.kind, o.robe, !!o.young, o.arms === false), mCl0 = clothMat(o.robe);
//@@end crowd.n
//@@begin crowd.avN
      const avN = G.avnet ? mk(G.avnet, AVN.mat()) : null, avD = G.mid.avnet ? mk(G.mid.avnet, AVN.mat()) : null;   // AVNET_305
      if (avN) AVN.meshes.push(avN, avD);
//@@end crowd.avN
//@@begin crowd
      const slots = [];   // MUSICIANS_305: each figure's hair - its mesh and place there
      pts.forEach(([x, z, yaw], i) => {
        const big = o.big === i, j0 = big ? 0 : rnd(), s = o.s * (big ? 1.08 : o.exact ? 1 : 0.97 + j0 * 0.06), fw = o.fwd || 0;   // NAZIR_LOCKS_211: o.exact - the size and the turn as given
        const jy = (rnd() - 0.5) * (o.pose === "bench" ? 0.16 : 0.3);
        qt.setFromAxisAngle(up, yaw + (o.exact ? 0 : jy));
        m4.compose(ps.set(x + Math.sin(yaw) * fw, o.y, z + Math.cos(yaw) * fw), qt, sc.set(s, s, s));
        for (const im of [cloth, skin, fm, mCl, mSk, mHr]) im.setMatrixAt(i, m4);
        if (avN) { avN.setMatrixAt(i, m4); avD.setMatrixAt(i, m4); }   // AVNET_305
//@@end crowd
//@@begin crowd.pal
        const pal = TONES[o.kind === "student" || o.young ? 3 : (o.tone ? o.tone(i) : 1)], k = big ? 0 : (i * 7 + 3) % hairs.length;
//@@end crowd.pal
//@@begin crowd-2
        slots[i] = [k, cnt[k]];
//@@end crowd-2
//@@begin crowd-3
      for (const im of [cloth, skin, fm, mCl, mSk, mHr].concat(hairs, avN ? [avN, avD] : [])) {   // AVNET_305
        im.instanceMatrix.needsUpdate = true;
        if (im.instanceColor) im.instanceColor.needsUpdate = true;
        if (im.count > 0) (im === fm ? far : im === mCl || im === mSk || im === mHr || im === avD ? mid : near).add(im);
//@@end crowd-3
//@@begin crowd-4
      LOD.push({ near, mid, far, anchor, R: R * 1.0, lv: 1, k: o.lodK > 0 ? o.lodK : 1, min: o.minLv | 0 });   // PEOPLE_LOD_304: lodK, minLv (this house's copy)
      // MUSICIANS_305: the crowd's handle - its level of detail, and a figure moved (its matrix: place, turn, scale)
      const lodE = LOD[LOD.length - 1], allIm = [cloth, skin, fm, mCl, mSk, mHr].concat(avN ? [avN, avD] : []);   // AVNET_305
      near.userData.crowd = {
        lod: lodE,
        pose(i, m) { for (const im of allIm) im.setMatrixAt(i, m); const sl = slots[i]; if (sl) hairs[sl[0]].setMatrixAt(sl[1], m); },
        done() { for (const im of allIm.concat(hairs)) im.instanceMatrix.needsUpdate = true; }
      };
      return near;
    };
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
//@@end crowd-4
//@@begin tm_people.d
        const d = Math.max(0, wp.distanceTo(cam.position) - e.R) * f * e.k;
//@@end tm_people.d
//@@begin tm_people.after-lv
        if (lv < e.min) lv = e.min;   // PEOPLE_LOD_304: a crowd that never takes the full figure (minLv 1)
//@@end tm_people.after-lv
//@@begin tm_people.after-age
    return (ctx.__tmPeople = { crowd, facing, age, rig });
  }
  // ===== PEOPLE_KIT_204 END
//@@end tm_people.after-age
