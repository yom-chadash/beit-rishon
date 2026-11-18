    // ===== MESIBAH_303 (the user, 18.11.2026 - the plan he took): THE DEMONSTRATION "הכהן יורד לבית הטבילה" - Tamid 1:1 (book 88,
    // line 2), walked: the priest rises by his bed in Beit HaMoked, goes into the north-west chamber and down the winding stair round
    // its pillar (the Mefaresh, 2105, line 17: "עמוד של בנין שעולין ויורדין בו ע"י גלגול"), along the tunnel between the lamps, past the
    // toilet's open door ("פתוח, יודע שאין שם אדם") and the fire, into the bath: down the steps, immersed, up; dried with the towel,
    // warmed before the fire; and back up, to his brothers asleep in the hall. The eye at a man's height, in cuts (its own clock and
    // its own captions, as the walk's - DW - draws them; the time written in demo seconds, run at SLOW). He is in his own clothes:
    // "ובגדי קדש לא היו ישנים בהן... ומתכסין בכסות עצמן" (the same Mishnah) - the Levites' look of the morning's service (55-tamid.js:
    // a plain robe, a cap, no belt). The ways, the times and the figures' forms - model choices. The underground: 30-courts.js
    // MESIBAH_303 (ctx2.shared.tevilaWay).
    {
      const MS = () => ctx2.shared.tevilaWay;
      const HP = Math.PI / 2;
      const RW = 1.05;                                   // the stair's walking line, from the pillar's axis
      const cl = (v, a, b) => Math.max(a, Math.min(b, v));
      const sm = (u) => { u = cl(u, 0, 1); return u * u * (3 - 2 * u); };
      const lerp3 = (a, b, u) => [a[0] + (b[0] - a[0]) * u, a[1] + (b[1] - a[1]) * u, a[2] + (b[2] - a[2]) * u];
      // a broken line of [x, y, z], walked by its length in the plan
      const poly = (pts) => {
        const L = [0];
        for (let i = 1; i < pts.length; i++) L.push(L[i - 1] + Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][2] - pts[i - 1][2]));
        const seg = (s) => { s = cl(s, 0, L[L.length - 1]); let i = 0; while (i < L.length - 2 && s > L[i + 1]) i++; return [i, s]; };
        return { len: L[L.length - 1],
          at(s) { const [i, q] = seg(s); return lerp3(pts[i], pts[i + 1], (q - L[i]) / Math.max(1e-6, L[i + 1] - L[i])); },
          yaw(s) { const [i] = seg(s); return Math.atan2(pts[i + 1][0] - pts[i][0], pts[i + 1][2] - pts[i][2]); } };
      };
      // on the stair: theta in degrees (0 - south, 90 - east; going down it decreases), its height by the step under him
      const sp = (th) => { const M = MS(), r = th * Math.PI / 180; return [M.MX + RW * Math.sin(r), M.FL - M.RISE * (-th / 30) - 0.25, M.MZ + RW * Math.cos(r)]; };
      // in the pool: the five steps down westward and the floor (30-courts.js: POOL, RP)
      const spYaw = (th) => { const r = th * Math.PI / 180; return Math.atan2(-Math.cos(r), Math.sin(r)); };
      const poolY = (x) => { const M = MS(); return M.YF - M.RP * cl((M.POOL.x1 - x) / 0.5 + 0.5, 0, 6); };
      let built = null;
      const build = () => {
        if (built) return built;
        const M = MS();
        if (!M) return null;
        const F0 = M.FL;
        // the hall: his place and his brothers asleep (Tamid 1:1 "ומתכסין בכסות עצמן"; their garments folded under their heads)
        const sleepG = new Group();
        sleepG.name = "tevilaSleepers";
        sleepG.visible = false;
        g.add(sleepG);
        const blank = [0x6f5a45, 0x5d6470, 0x7a6a52, 0x5f5446, 0x6b5f6e].map((c) => new MeshStandardMaterial({ color: c, roughness: 0.95 }));
        const skin = new MeshStandardMaterial({ color: 0xc9a07c, roughness: 0.8 }), capM = new MeshStandardMaterial({ color: 0x2a2520, roughness: 0.9 });
        const white = new MeshStandardMaterial({ color: 0xf1eee6, roughness: 0.85 });
        const body = new CapsuleGeometry(0.42, 2.0, 4, 10).rotateX(HP), headG = new SphereGeometry(0.2, 10, 8), capG = new SphereGeometry(0.21, 10, 6, 0, Math.PI * 2, 0, HP);
        const pileG = new BoxGeometry(0.62, 0.16, 0.42);
        [[-15.4, F0, -72.6, HP], [-20.6, F0, -61.3, -HP], [-12.4, F0, -67.5, Math.PI], [-31.6, F0 + 1, -67.5, 0], [-4.4, F0 + 1, -67.5, 0], [-28.6, F0, -65.9, HP]].forEach(([x, y, z, yaw], i) => {
          const s = new Group();
          const b = new Mesh(body, blank[i % blank.length]);
          b.scale.set(1, 0.62, 1);
          b.position.y = 0.26;
          s.add(b);
          const h = new Mesh(headG, skin); h.position.set(0, 0.32, 1.45); s.add(h);
          const c = new Mesh(capG, capM); c.rotation.x = HP; c.position.set(0, 0.32, 1.5); s.add(c);
          const p = new Mesh(pileG, white); p.position.set(0, 0.08, 1.86); s.add(p);
          s.position.set(x, y, z);
          s.rotation.y = yaw;
          for (const m of s.children) m.castShadow = true;
          sleepG.add(s);
        });
        {   // his own place, empty: his cover thrown back, his garments folded at its head
          const s = new Group();
          const cv = new Mesh(new BoxGeometry(0.95, 0.07, 2.3), blank[2]); cv.position.set(0, 0.035, 0); s.add(cv);
          const fold = new Mesh(new BoxGeometry(0.95, 0.12, 0.5), blank[2]); fold.position.set(0.05, 0.1, -0.95); fold.rotation.y = 0.08; s.add(fold);
          const p = new Mesh(pileG, white); p.position.set(0, 0.08, 1.4); s.add(p);
          s.position.set(-28.0, F0, -67.5);
          s.rotation.y = HP;
          sleepG.add(s);
        }
        // the caption, as the walk's (DW)
        const cap = document.createElement("div");
        cap.id = "tm-mes-cap";
        cap.setAttribute("dir", "rtl");
        Object.assign(cap.style, { position: "fixed", left: "50%", bottom: "64px", transform: "translateX(-50%)", maxWidth: "min(760px, 74vw)",
          background: "rgba(14,17,28,0.8)", color: "#f4ead0", font: "17px/1.55 var(--font-main, inherit)", padding: "8px 18px",
          borderRadius: "10px", zIndex: "40", pointerEvents: "none", textAlign: "center", userSelect: "none", boxShadow: "0 2px 10px rgba(0,0,0,0.35)", display: "none" });
        document.body.appendChild(cap);
        // ---- his ways (the screen's seconds; a cut may jump him on - "a jump is no step", KOH)
        const A = poly([[-27.4, F0, -68.7], [-25.6, F0, -69.1], [-25.0, F0, -69.8], [-25.4, F0, -70.6], [-26.8, F0, -71.05], [-27.8, F0, -71.25], sp(-15)]);
        const B = poly([sp(-1335), [-27.6, M.YF, -72.4], [M.MX, M.YF, -71.0], [M.MX, M.YF, -58.6], [M.MX - 0.6, M.YF, -58.0], [-34.5, M.YF, -58.0]]);
        const BV = poly([sp(-1335), [-27.6, M.YF, -72.4], [M.MX, M.YF, -71.0], [M.MX, M.YF, -58.6], [M.MX - 0.6, M.YF, -58.0], [-60, M.YF, -58.0]]);   // the eye's way, ahead of him
        const T = { a0: 0.9, a1: 0.9 + A.len / 1.35, s1: 0, s2: 0 };
        T.s1 = T.a1;
        T.s2 = T.s1 + 3.6;
        const SPD = 1.3 * 180 / Math.PI / RW;   // degrees a second on the stair
        const t4 = T.s2 + 185 / SPD, tB = t4 + B.len / 1.35;
        const LEGS = [
          [0, T.a0, () => ({ p: A.at(0), yaw: 2.0 })],
          [T.a0, T.a1, (t) => ({ p: A.at((t - T.a0) * 1.35), yaw: A.yaw((t - T.a0) * 1.35) })],
          [T.s1, T.s2, (t) => ({ p: sp(-15 - (t - T.s1) * SPD), yaw: spYaw(-15 - (t - T.s1) * SPD) })],
          [T.s2, t4, (t) => ({ p: sp(-1150 - (t - T.s2) * SPD), yaw: spYaw(-1150 - (t - T.s2) * SPD) })],
          [t4, tB, (t) => ({ p: B.at((t - t4) * 1.35), yaw: B.yaw((t - t4) * 1.35) })]
        ];
        // the end of the tunnel, the toilet's door, the bath
        const E = poly([[-88, M.YF, -58.0], [-95.3, M.YF, -58.0]]), E2 = poly([[-95.3, M.YF, -58.0], [-100.2, M.YF, -58.0]]);
        const tE0 = tB, tE1 = tE0 + E.len / 1.35, tE2 = tE1 + 1.6, tE3 = tE2 + E2.len / 1.35;
        LEGS.push([tE0, tE1, (t) => ({ p: E.at((t - tE0) * 1.35), yaw: -HP })],
          [tE1, tE2, () => ({ p: E.at(E.len), yaw: -2.4 })],                    // his face to the toilet's open door
          [tE2, tE3, (t) => ({ p: E2.at((t - tE2) * 1.35), yaw: -HP })]);
        const xP = -103.7, tP0 = tE3, tP1 = tP0 + 3.9, tD0 = tP1 + 0.3, tD1 = tD0 + 1.4, tP2 = tD1 + 0.3, tP3 = tP2 + 3.9;
        LEGS.push([tP0, tP1, (t) => { const x = -100.2 + (xP + 100.2) * sm((t - tP0) / (tP1 - tP0)); return { p: [x, poolY(x), -58.0], yaw: -HP }; }],
          [tP1, tP2, (t) => { const u = cl((t - tD0) / (tD1 - tD0), 0, 1), d = Math.sin(Math.PI * u); return { p: [xP, M.PB - 0.68 * d * d, -58.0], yaw: -HP }; }],
          [tP2, tP3, (t) => { const x = xP + (-100.2 - xP) * sm((t - tP2) / (tP3 - tP2)); return { p: [x, poolY(x), -58.0], yaw: HP }; }]);
        // the towel: to the peg, taken, dried, hung back
        const tw = M.TOWEL, W1 = poly([[-100.2, M.YF, -58.0], [-100.9, M.YF, -60.35]]);
        const tT0 = tP3, tT1 = tT0 + W1.len / 1.2, tT2 = tT1 + 1.0, tT3 = tT2 + 3.0, tT4 = tT3 + 0.6;
        LEGS.push([tT0, tT1, (t) => ({ p: W1.at((t - tT0) * 1.2), yaw: W1.yaw((t - tT0) * 1.2) })],
          [tT1, tT2, (t) => ({ p: W1.at(W1.len), yaw: Math.PI, armR: { p: [tw[0] + 0.05, tw[1] + 0.3, tw[2] + 0.05], w: sm((t - tT1) / 0.5) * (1 - sm((t - tT1 - 0.6) / 0.4)) }, towel: t >= tT1 + 0.55 })],
          [tT2, tT3, (t) => ({ p: W1.at(W1.len), yaw: -0.5, towel: true, dry: (t - tT2) / (tT3 - tT2) })],
          [tT3, tT4, (t) => ({ p: W1.at(W1.len), yaw: Math.PI, towel: t < tT3 + 0.35 })]);
        // to the fire, and warmed before it
        const Fw = poly([[-100.9, M.YF, -60.35], [-99.2, M.YF, -58.2], [-97.4, M.YF, -58.0], [M.FIRE.x, M.YF, -57.85]]);
        const tF0 = tT4, tF1 = tF0 + Fw.len / 1.3, tF2 = tF1 + 4.2;
        LEGS.push([tF0, tF1, (t) => ({ p: Fw.at((t - tF0) * 1.3), yaw: Fw.yaw((t - tF0) * 1.3) })],
          [tF1, tF2, (t) => { const w = 0.85 * sm((t - tF1) / 0.7) * (1 - sm((t - tF2 + 0.5) / 0.5)); return { p: Fw.at(Fw.len), yaw: 0, armR: { p: [M.FIRE.x - 0.16, M.YF + 1.75, M.FIRE.z - 0.55], w }, armL: { p: [M.FIRE.x + 0.16, M.YF + 1.75, M.FIRE.z - 0.55], w } }; }]);
        // and back: up the last half turn, out of the chamber, to his place by his brothers
        const tU0 = tF2, tU1 = tU0 + 0.6, A2 = poly([[-26.8, F0, -71.05], [-25.4, F0, -70.6], [-25.0, F0, -69.8], [-25.6, F0, -69.1], [-27.4, F0, -68.7]]);
        const tU2 = tU1 + A2.len / 1.35, tEnd = tU2 + 4.0;
        LEGS.push([tU0, tU1, () => ({ p: A2.at(0), yaw: 1.2 })],
          [tU1, tU2, (t) => ({ p: A2.at((t - tU1) * 1.35), yaw: A2.yaw((t - tU1) * 1.35) })],
          [tU2, tEnd, () => ({ p: A2.at(A2.len), yaw: -1.9 })]);
        // ---- the eye: shots [t0, t1, eye(t), look(t) | null - at him]; between them a cut
        const head = (o, up) => [o.p[0], o.p[1] + (up == null ? 2.6 : up), o.p[2]];
        // through the keys by time, smooth (the walk's centripetal Catmull-Rom, DW)
        const crc = (P0, P1, P2, P3, u) => {
          const d = (a, b) => Math.max(1e-4, Math.sqrt(Math.hypot(b[0] - a[0], b[1] - a[1], b[2] - a[2])));
          const t1 = d(P0, P1), t2 = t1 + d(P1, P2), t3 = t2 + d(P2, P3), tt = t1 + u * (t2 - t1);
          const L = (a, b, ta, tb) => a.map((v, q) => ((tb - tt) * v + (tt - ta) * b[q]) / (tb - ta));
          const A1 = L(P0, P1, 0, t1), A2 = L(P1, P2, t1, t2), A3 = L(P2, P3, t2, t3);
          return L(L(A1, A2, 0, t2), L(A2, A3, t1, t3), t1, t2);
        };
        const keys = (K) => (t) => {
          let i = 0;
          while (i < K.length - 2 && t > K[i + 1][0]) i++;
          const u = cl((t - K[i][0]) / Math.max(1e-6, K[i + 1][0] - K[i][0]), 0, 1), P = (j) => K[Math.max(0, Math.min(K.length - 1, j))][1];
          return K.length < 3 ? lerp3(K[0][1], K[1][1], u) : crc(i ? P(i - 1) : lerp3(P(0), P(1), -0.3), P(i), P(i + 1), i + 2 < K.length ? P(i + 2) : lerp3(P(i), P(i + 1), 1.3), u);
        };
        const WEST = [-32.5, F0 + 5.4, -64.9];   // the hall's west end, over the bench: his place, his brothers, the chamber's door
        const sC = 15.97;                          // (on his way B: where he is round the corner, in the tunnel west)
        const tC = t4 + 12.0 / 1.35;               // the cut from the tunnel south to the tunnel west
        const SHOTS = [
          [0, T.a1 - 1.2, keys([[0, WEST], [T.a1 - 1.2, [-31.9, F0 + 5.0, -65.6]]]), null],
          [T.a1 - 1.2, T.s2, keys([[T.a1 - 1.2, [-25.3, F0 + 4.9, -71.0]], [T.a1 + 1.8, [-26.0, F0 + 5.1, -75.5]], [T.s2, [-27.4, F0 + 5.3, -74.9]]]), null],
          [T.s2, t4 + 1.2, keys([[T.s2, [M.MX + 0.3, M.YF + 2.7, -69.9]], [t4, [M.MX + 0.15, M.YF + 2.8, -69.4]], [t4 + 1.2, [M.MX, M.YF + 3.0, -68.0]]]), null],
          // the tunnel south: the eye ahead of him, never past its end (the corner's wall would stand between them)
          [t4 + 1.2, tC, (t) => { const s = Math.min((t - t4) * 1.35 + 4.6, 15.0), p = BV.at(s); return [p[0], M.YF + 3.65, p[2]]; }, null],
          // the tunnel west: the eye ahead of him, waiting at first for him to come round the corner
          [tC, tB, (t) => { const s = (t - t4) * 1.35, x = s < sC ? -34.6 : Math.min(-34.6, -28.85 - (s - sC) - 5.75); return [x, M.YF + 3.6, -58.0]; },
            (t, o) => ((t - t4) * 1.35 < 14.9 ? [M.MX - 0.4, M.YF + 2.4, -58.3] : head(o, 2.45))],
          [tE0, tE2 + 1.0, keys([[tE0, [-98.6, M.YF + 3.55, -58.0]], [tE2, [-98.6, M.YF + 3.55, -58.0]], [tE2 + 1.0, [-99.2, M.YF + 3.8, -59.6]]]), null],
          [tE2 + 1.0, tT4, keys([[tE2 + 1.0, [-103.6, M.YF + 4.0, -55.4]], [tP1, [-103.4, M.YF + 3.7, -55.8]], [tP3, [-103.5, M.YF + 3.9, -55.5]], [tT4, [-103.3, M.YF + 4.0, -55.6]]]),
            (t, o) => (t >= tD0 - 0.4 && t <= tD1 + 0.6 ? [xP, M.WATER - 0.4, -58.0] : head(o, 2.2))],
          [tT4, tF2, keys([[tT4, [-94.4, M.YF + 3.4, -58.8]], [tF2, [-94.6, M.YF + 3.45, -58.85]]]), (t, o) => (t > tF1 - 0.5 ? [M.FIRE.x, M.YF + 1.2, M.FIRE.z] : head(o, 2.2))],
          [tF2, tEnd, keys([[tF2, WEST], [tEnd, [-32.2, F0 + 5.2, -65.3]]]), (t, o) => (t < tU1 + 0.3 ? [-25.0, F0 + 1.8, -69.8] : head(o, 2.3))]
        ];
        const CAPS = [[0, "״ארע קרי לאחד מהן, יוצא והולך לו במסבה ההולכת תחת הבירה״ (תמיד א, א)"],
          [T.a1 - 1.2, "״צפונית מערבית, בה יורדים לבית הטבילה״ (מידות א, ו)"],
          [T.s2, "המסבה: ״עמוד של בנין שעולין ויורדין בו ע״י גלגול״ (המפרש לתמיד)"],
          [t4 + 1.2, "״והנרות דולקין מכאן ומכאן, עד שהוא מגיע לבית הטבילה״ (תמיד א, א)"],
          [tE0, "״ומדורה היתה שם, ובית כסא של כבוד״"],
          [tE1 - 0.6, "״וזה היה כבודו, מצאו נעול, יודע שיש שם אדם. פתוח, יודע שאין שם אדם״"],
          [tP0, "״ירד וטבל״"],
          [tP2, "״עלה ונסתפג״"],
          [tF0 + 0.6, "״ונתחמם כנגד המדורה״"],
          [tF2, "״בא וישב לו אצל אחיו הכהנים עד שהשערים נפתחים, יוצא והולך לו״ (תמיד א, א)"]];
        built = { sleepG, cap, LEGS, SHOTS, CAPS, tEnd, tD0, tD1, wet: [tD0 + 0.25, tD0 + 2.0],
          marks: { a1: T.a1, s2: T.s2, t4, tB, tE1, tE2, tE3, tP1, tD0, tD1, tP3, tT1, tT2, tT3, tT4, tF1, tF2, tU1, tU2, tEnd } };
        return built;
      };
      // ---- his own clothes (the Levites' look of the morning's service) on the one priest who walks (KOH), and back
      const own = { saved: null, mat: null, cap: null };
      const ownOn = () => {
        const a = KOH.actor;
        if (!a || own.saved) return;
        const K = a.K, S = a.lean.children.find((o) => o.isGroup && o.children.some((m) => m.geometry === K.gRobeBody));
        if (!S) return;
        if (!own.mat) {
          own.mat = typeof K.mat === "function" ? K.mat(0xc4b79a, { vertexColors: true, roughness: 0.95 }) : new MeshStandardMaterial({ color: 0xc4b79a, roughness: 0.95, vertexColors: true });
          own.mat.emissive = new Color(0x2a1a0c);
          own.mat.emissiveIntensity = 0.55;
          own.cap = new Mesh(K.gCap, new MeshStandardMaterial({ color: 0x2a2520, roughness: 0.9 }));
          own.cap.position.y = K.HEAD_Y;
          own.cap.castShadow = true;
          own.cap.userData.noPick = true;
        }
        const bodyM = S.children.find((m) => m.geometry === K.gRobeBody), hat = S.children.find((m) => m.geometry === K.gHat);
        const arms = [a.L.meshes[0], a.L.meshes[1], a.R.meshes[0], a.R.meshes[1]];
        own.saved = { S, bodyM, hat, hatV: hat ? hat.visible : true, sashV: a.sash.visible, body: bodyM ? bodyM.material : null, arms: arms.map((m) => [m, m.material]) };
        if (bodyM) bodyM.material = own.mat;
        for (const m of arms) m.material = own.mat;
        if (hat) hat.visible = false;
        a.sash.visible = false;
        S.add(own.cap);
      };
      const ownOff = () => {
        const s = own.saved;
        if (!s) return;
        own.saved = null;
        if (s.bodyM) s.bodyM.material = s.body;
        for (const [m, mt] of s.arms) m.material = mt;
        if (s.hat) s.hat.visible = s.hatV;
        const a = KOH.actor;
        if (a) a.sash.visible = s.sashV;
        if (own.cap && own.cap.parent) own.cap.parent.remove(own.cap);
      };
      // ---- the run
      const D = { run: false, t0: 0, pausedAt: null, blend: null, look: null, shot: -1, saved: null };
      const tNow = () => ((D.pausedAt != null ? D.pausedAt : performance.now()) - D.t0) / 1000 / SLOW;
      const setFov = (v) => { const cam = ctx2.camera; if (cam && cam.isPerspectiveCamera && Math.abs(cam.fov - v) > 0.01) { cam.fov = v; cam.updateProjectionMatrix(); } };
      const stop = () => {
        if (!D.run) return;
        D.run = false;
        D.pausedAt = null;
        D.blend = null;
        const B = built, M = MS();
        if (B) { B.sleepG.visible = false; B.cap.style.display = "none"; }
        kohSteps(-1);
        KOH.pose({ x: 0, y: -400, z: 0, props: null });
        KOH.hide();
        ownOff();
        if (M) { M.towel.visible = true; M.ripple.visible = false; }
        const s = D.saved;
        D.saved = null;
        if (s) {
          if (s.fov) setFov(s.fov);
          const lg = ctx2.scene && ctx2.scene.getObjectByName("labels");
          if (lg && s.labels != null) lg.visible = s.labels;
          if (M && s.see) M.see(true);
        }
      };
      const start = () => {
        stop();
        const M = MS(), B = build();
        if (!M || !B || !KOH.dims()) return;
        if (typeof ctx2.shared.stopDemos === "function") { try { ctx2.shared.stopDemos("mes-tevila-demo"); } catch (_) {} }
        const lg = ctx2.scene && ctx2.scene.getObjectByName("labels");
        D.saved = { fov: ctx2.camera && ctx2.camera.isPerspectiveCamera ? ctx2.camera.fov : 0, labels: lg ? lg.visible : null, see: M.seeOn };
        if (lg) lg.visible = false;   // (as the morning's service: the model's names aside while it runs)
        M.see(false);                 // the eye walks inside: no x-ray through the walls
        setFov(66);
        B.sleepG.visible = true;
        D.shot = -1;
        D.look = null;
        D.t0 = performance.now();
        D.run = true;
      };
      DEMO_STOPS.push({ id: "mes-tevila-demo", running: () => D.run, stop,
        pause: () => { if (D.run && D.pausedAt == null) D.pausedAt = performance.now(); },
        resume: () => {
          if (D.pausedAt == null) return;
          D.t0 += performance.now() - D.pausedAt;
          D.pausedAt = null;
          const cam = ctx2.camera, c = ctx2.controls;
          if (cam && c && c.target) D.blend = { pos: cam.position.toArray(), tg: c.target.toArray(), at: performance.now() };
        },
        paused: () => D.pausedAt != null,
        restart: () => start() });
      ctx2.shared.tevilaDemo = { start, stop, get on() { return D.run; },
        seek(t) { if (D.run) { D.t0 = (D.pausedAt != null ? D.pausedAt : performance.now()) - t * 1000 * SLOW; D.shot = -1; } },   // (the tests' way to a moment)
        get length() { const B = build(); return B ? B.tEnd : 0; }, get marks() { const B = build(); return B ? B.marks : null; } };
      const towelOn = { v: false };
      ctx2.animated.push(() => {
        if (!D.run) return;
        const B = built, M = MS();
        if (!B || !M) { stop(); return; }
        if (D.pausedAt != null) { kohSteps(0); D.lastMs = 0; return; }
        const t = tNow();
        if (t >= B.tEnd + 0.4) { stop(); return; }
        // the priest
        let leg = B.LEGS[B.LEGS.length - 1];
        for (const L of B.LEGS) if (t >= L[0] && t < L[1]) { leg = L; break; }
        const o = leg[2](t);
        const tw = !!o.towel;
        if (tw !== towelOn.v) { towelOn.v = tw; M.towel.visible = !tw; }
        const pose = { x: o.p[0], y: o.p[1], z: o.p[2], base: tw ? "hold" : "rest", props: tw ? { r: M.towelProp } : null };
        if (o.yaw != null) pose.yaw = o.yaw;
        if (o.armR) pose.armR = o.armR;
        if (o.armL) pose.armL = o.armL;
        if (o.dry != null) {   // the towel over his face and his breast: a round of the right hand, twice
          const a = (o.dry * 2) * Math.PI * 2, yw = o.yaw, c = Math.cos(yw), s = Math.sin(yw);
          const lx = -0.04 + 0.16 * Math.cos(a), ly = 2.45 + 0.32 * Math.sin(a), lz = 0.32;
          pose.armR = { p: [o.p[0] + lx * c + lz * s, o.p[1] + ly, o.p[2] - lx * s + lz * c], w: Math.min(1, o.dry * 6, (1 - o.dry) * 6) };
        }
        KOH.pose(pose);
        if (!own.saved) ownOn();
        kohSteps(1);
        // the water over him, and its ring
        { const u = (t - B.wet[0]) / (B.wet[1] - B.wet[0]), on = u >= 0 && u <= 1, R = M.ripple; R.visible = on; if (on) { R.scale.setScalar(1 + 3.2 * u); R.material.opacity = 0.75 * (1 - u); } }
        // the eye
        let si = B.SHOTS.length - 1;
        for (let i = 0; i < B.SHOTS.length; i++) if (t >= B.SHOTS[i][0] && t < B.SHOTS[i][1]) { si = i; break; }
        const S = B.SHOTS[si], cut = si !== D.shot;
        D.shot = si;
        const e = S[2](t), want = S[3] ? S[3](t, o) : [o.p[0], o.p[1] + 2.45, o.p[2]];
        const nowMs = performance.now(), dt = D.lastMs ? Math.min(0.25, (nowMs - D.lastMs) / 1000) : 0;
        D.lastMs = nowMs;
        if (cut || !D.look) D.look = want.slice();
        else { const k = 1 - Math.exp(-dt * 7); for (let q = 0; q < 3; q++) D.look[q] += (want[q] - D.look[q]) * k; }   // (by the clock: the same at any frame rate)
        let E2 = e, L2 = D.look;
        if (D.blend) {
          const w0 = Math.min(1, (performance.now() - D.blend.at) / 900), w = w0 * w0 * (3 - 2 * w0);
          E2 = lerp3(D.blend.pos, e, w);
          L2 = lerp3(D.blend.tg, D.look, w);
          if (w0 >= 1) D.blend = null;
        }
        const cam = ctx2.camera, c = ctx2.controls;
        if (cam) {
          cam.position.set(E2[0], E2[1], E2[2]);
          if (c && c.target) c.target.set(L2[0], L2[1], L2[2]);
          cam.lookAt(L2[0], L2[1], L2[2]);
        }
        let txt = "";
        for (const [ct, x] of B.CAPS) if (t >= ct) txt = x;
        if (B.cap.textContent !== txt) B.cap.textContent = txt;
        B.cap.style.display = txt ? "block" : "none";
      });
      {
        const MB = Array.isArray(ctx2.shared.modelButtons) ? ctx2.shared.modelButtons : (ctx2.shared.modelButtons = []);
        MB.push({
          id: "mes-tevila-demo", label: "הדגמה: הכהן יורד לבית הטבילה", labelOn: "עצור את ההדגמה", maxDist: 150,
          title: "״ארע קרי לאחד מהן, יוצא והולך לו במסבה ההולכת תחת הבירה... ירד וטבל, עלה ונסתפג ונתחמם כנגד המדורה״ (תמיד א, א) — בהליכה, בגובה העיניים: מבית המוקד, במעלות שסביב העמוד, במחילה שבין הנרות, אל בית הטבילה, ובחזרה אל אחיו הכהנים.",
          anchor: () => {
            const p = ctx2.camera && ctx2.camera.position, M = MS();
            return p && M && p.z < -20 && p.x < 20 && p.x > -120 && p.y < 160 ? [M.MX, 40, M.MZ] : null;
          },
          get: () => D.run,
          set: (on) => { if (on) start(); else stop(); }
        });
      }
    }
