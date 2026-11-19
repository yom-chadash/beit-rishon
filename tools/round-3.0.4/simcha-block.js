    // ---------- SIMCHA_304 (the user, 19.11.2026 19:09: "תעשה הדגמה של שמחת בית השואבה / א: עם כל המרפסות של עזרת הנשים / ב: עם ----------
    // חסידים שהיו מרקדין, ושרים אשרי מי שלא חטא וכו' / ג: עם כל הנלוה"; 19:33: "1." - three balconies, north, south and east; "2. זיזים
    // קבועים תמיד הדגמה רק במתג"; "3. לפני העם - תוסיף מלא אנשים בגילאים שונים כולל ילדים במבנה הדמויות שעשית רק לא כהנים"; "4. ב" - the
    // trumpets and the Levites' instruments): THE REJOICING OF THE WATER-DRAWING. Every quotation read in the library (book:line):
    //  Mishnah Sukkah 5:1-4 (56:51-54); Middot 2:5 (89:16) "וחלקה היתה בראשונה, והקיפוה כצוצרה"; the Bavli, Sukkah 51b (108:1323) "מאי
    //  תיקון גדול? ... חלקה היתה בראשונה. והקיפוה גזוזטרא", 53a (1361: the three sayings; 1366: Rabban Shimon ben Gamliel), 53b (1376: "בעי
    //  רבי ירמיה: למעלה עשירית... תיקו"); the Tosefta, Sukkah 4:1 "עשו שלש גזוזטראות בעזרה כנגד שלש רוחות", 4:2-3, 4:5; the Rambam, Beit
    //  HaBechira 5:9 (337:84), Lulav 8:12-15; the Tiferet Yisrael, Sukkah 5 (772:516 "שהניחו קרשים עם מעקה סביב על הזיזין שיוצאין מהחומות
    //  סביב", 536 "לפני כל העם שעמדו סביב אצל החומות", 554 "לרצפת עזרת נשים") and Middot 2:5 (819:243 "תקרה בולטת מאמצע גובה כתליה");
    //  the Bartenura, Sukkah 5:4 "בארבע אבוקות או בשמונה, זורק זו ומקבל את זו".
    //  ALWAYS: the corbels (zizim) in the walls of the women's court - north, south and east (by its gate), between the chambers, at the
    //  middle of the walls' height. ONLY IN THE DEMONSTRATION (a switch, off by default: the place "שמחת בית השואבה — הדגמה" and the pill):
    //  the planks and the railing on them, the night, the golden lamps lit (SH.simchaDemo.drive), the people by the walls (men and boys of
    //  every age, in their own clothes - tm_people), the dancers with torches, Rabban Shimon ben Gamliel, the Levites on the fifteen steps
    //  with their instruments and the flute below them, the music (sfxLoop "simcha"), and at the cock's crow the two priests with the
    //  trumpets, from the upper gate to the gate that goes out to the east. MODEL CHOICES: the balconies' depth, the corbels' number and
    //  form, the number and places of the people, the dancers and the Levites, the music, the timing; the tenth step - see the card.
    {
      const Y0 = LV.EZN, HB = 17, YB = Y0 + HB, DEP = 3.5, RAILH = 1.9, CXc = 161;
      const WN = -65, WS = 65, WE = 226;   // the walls' inner faces (30-courts.js: 5 thick, on z -+67.5 and x 228.5)
      const fnc = (f) => typeof f === "function";
      const SLOW = () => SH.demoSlow || 1.5;
      const noP = (o) => { o.userData.noPick = true; return o; };
      // ---- the corbels (always) and the planks with the railing (the demonstration) ----
      // a span: along x (the north and south walls) or z (the east wall); `w` the wall's face, `n` into the court; `part` - "j" only
      // when Josephus's gates of the north and the south stand (ctx2.shared.eznGates), "k" only when they do not, "e" the east's
      const SPANS = [
        { ax: "x", w: WN, n: 1, a: 133.5, b: 188.5, part: "k" }, { ax: "x", w: WN, n: 1, a: 133.5, b: 153, part: "j" }, { ax: "x", w: WN, n: 1, a: 169, b: 188.5, part: "j" },
        { ax: "x", w: WS, n: -1, a: 133.5, b: 188.5, part: "k" }, { ax: "x", w: WS, n: -1, a: 133.5, b: 153, part: "j" }, { ax: "x", w: WS, n: -1, a: 169, b: 188.5, part: "j" },
        { ax: "z", w: WE, n: -1, a: -27.5, b: -7.2, part: "e" }, { ax: "z", w: WE, n: -1, a: 7.2, b: 27.5, part: "e" }
      ];
      const zizG = grp("eznZizim", true), plankG = grp("eznGezuztra", false);
      const zizP = { k: new Group(), j: new Group(), e: new Group() }, plP = { k: new Group(), j: new Group(), e: new Group() };
      for (const k of ["k", "j", "e"]) { zizG.add(zizP[k]); plankG.add(plP[k]); }
      const zizGeo = (() => {   // the corbel's side: at the wall 1.5 high, out DEP - 0.2, its lower face rising to 0.45 under the top
        const sh = new Shape();
        sh.moveTo(0, 0); sh.lineTo(DEP - 0.2, 1.05); sh.lineTo(DEP - 0.2, 1.5); sh.lineTo(0, 1.5); sh.lineTo(0, 0);
        const g = new ExtrudeGeometry(sh, { depth: 0.6, bevelEnabled: false });
        g.translate(0, 0, -0.3);
        return g;
      })();
      const wood = new MeshStandardMaterial({ color: 0x8a6a46, roughness: 0.85 });
      const m4z = new Matrix4(), qz = new Quaternion(), vz = new Vector3(), sz1 = new Vector3(1, 1, 1), upY = new Vector3(0, 1, 0);
      for (const S of SPANS) {
        const L = S.b - S.a, nC = Math.max(2, Math.round(L / 2.5)), sp = L / nC;
        const yaw = S.ax === "x" ? (S.n > 0 ? -Math.PI / 2 : Math.PI / 2) : Math.PI;   // the corbel's local +x into the court
        const at = (u, out) => (S.ax === "x" ? [u, S.w + S.n * out] : [S.w + S.n * out, u]);
        const zi = new InstancedMesh(zizGeo, M2.stoneLight, nC);
        qz.setFromAxisAngle(upY, yaw);
        for (let i = 0; i < nC; i++) { const [x, z] = at(S.a + (i + 0.5) * sp, 0); m4z.compose(vz.set(x, YB - 1.5, z), qz, sz1); zi.setMatrixAt(i, m4z); }
        zi.instanceMatrix.needsUpdate = true;
        zi.castShadow = true; zi.receiveShadow = true;
        zizP[S.part].add(noP(zi));
        // the planks on them, and the railing at their outer edge (posts over the corbels, two rails, the two ends closed to the wall)
        const mid = at((S.a + S.b) / 2, DEP / 2);
        const pl = new Mesh(S.ax === "x" ? new BoxGeometry(L, 0.22, DEP) : new BoxGeometry(DEP, 0.22, L), wood);
        pl.position.set(mid[0], YB + 0.11, mid[1]); pl.castShadow = pl.receiveShadow = true;
        plP[S.part].add(noP(pl));
        const posts = new InstancedMesh(new BoxGeometry(0.18, RAILH, 0.18), wood, nC + 1);
        for (let i = 0; i <= nC; i++) { const [x, z] = at(S.a + Math.min(L - 0.09, Math.max(0.09, i * sp)), DEP - 0.12); m4z.compose(vz.set(x, YB + 0.22 + RAILH / 2, z), qz.identity(), sz1); posts.setMatrixAt(i, m4z); }
        posts.instanceMatrix.needsUpdate = true;
        plP[S.part].add(noP(posts));
        for (const h of [RAILH * 0.5, RAILH]) {
          const r = at((S.a + S.b) / 2, DEP - 0.12);
          const rail = new Mesh(S.ax === "x" ? new BoxGeometry(L, 0.14, 0.14) : new BoxGeometry(0.14, 0.14, L), wood);
          rail.position.set(r[0], YB + 0.22 + h, r[1]);
          plP[S.part].add(noP(rail));
          for (const u of [S.a + 0.07, S.b - 0.07]) {
            const e = at(u, (DEP - 0.12) / 2);
            const end = new Mesh(S.ax === "x" ? new BoxGeometry(0.14, 0.14, DEP - 0.12) : new BoxGeometry(DEP - 0.12, 0.14, 0.14), wood);
            end.position.set(e[0], YB + 0.22 + h, e[1]);
            plP[S.part].add(noP(end));
          }
        }
      }
      // which spans stand: Josephus's gates in the middle of the north and the south walls cut those balconies; Rabbenu Shemaya's low
      // east wall (20-mount.js / 30-courts.js, the layer ewShemayaEzn) has no corbels; the planks only while the demonstration runs
      let demoOn = false, syncK = "";
      const sync = () => {
        const j = !!(SH.eznGates && SH.eznGates.josephus), lowE = !!(ctx2.layers.ewShemayaEzn && ctx2.layers.ewShemayaEzn.visible);
        const k = (j ? "j" : "k") + (lowE ? "L" : "H") + (demoOn ? "1" : "0");
        if (k === syncK) return;
        syncK = k;
        zizP.k.visible = !j; zizP.j.visible = j; zizP.e.visible = !lowE;
        plP.k.visible = !j; plP.j.visible = j; plP.e.visible = !lowE;
        plankG.visible = demoOn;
      };
      sync();
      lbl("הזיזים — לגזוזטרא של שמחת בית השואבה (תפארת ישראל, סוכה ה, ב)", 161, YB + 4.2, WN + 3, 1.3, "eznZizim");
      // ---- the demonstration's group (built at its first start) ----
      const DG = grp("simchaShoeva", false);
      const silver = new MeshStandardMaterial({ color: 0xd9dde2, metalness: 0.85, roughness: 0.3 });
      const pitch = new MeshStandardMaterial({ color: 0x2a1c12, roughness: 0.9, emissive: 0x3a1206, emissiveIntensity: 0.6 });
      const T0 = SH.simchaDemo && SH.simchaDemo.tex ? SH.simchaDemo.tex : null;
      const flameM = T0 ? new SpriteMaterial({ map: T0.flame, transparent: true, depthWrite: false, blending: AdditiveBlending }) : null;
      const haloM = T0 ? new SpriteMaterial({ map: T0.halo, transparent: true, depthWrite: false, blending: AdditiveBlending }) : null;
      const FLS = [];   // every torch's flame (they flicker)
      const stickG = new CylinderGeometry(0.045, 0.06, 1.6, 6).translate(0, 0.8, 0);
      const headG = new CylinderGeometry(0.11, 0.075, 0.3, 8).translate(0, 1.72, 0);
      // a torch: the stick, its pitch-head and the fire on it - LIVE_FIRE_304 (the user, 20:43: "האש בלפידים צריכה להיות ממש חיה. אש
      // אש אמיתית"): the altar's live fire (40-altar.js, ctx2.shared.liveFlame), and round it a warm glow; its foot at the group's origin
      const torch = (big, fy = 2.25) => {
        const g = new Group();
        g.add(noP(new Mesh(stickG, wood)));
        g.add(noP(new Mesh(headG, pitch)));
        const live = fnc(SH.liveFlame) ? SH.liveFlame(g, 0, 1.8, 0, big ? 0.2 : 0.17, big ? 0.95 : 0.8, 1.0) : null;
        if (live) noP(live);
        else if (flameM) {   // (only where the live fire is missing: the soft sprite of before)
          const f = new Sprite(flameM); f.position.set(0, fy, 0); f.scale.set(0.55, 1.05, 1); f.renderOrder = 9; noP(f); g.add(f);
          f.userData.ph = FLS.length * 1.7; f.userData.k = 1; FLS.push(f);
        }
        if (haloM) { const h = new Sprite(haloM); h.position.set(0, 2.2, 0); h.scale.setScalar(big ? 3.6 : 2.4); h.renderOrder = 8; noP(h); g.add(h); }
        return g;
      };
      // the fifteen steps (30-courts.js): the Rambam's half discs (the default) - step k (1 the lowest) is the ring of radius 22 - k/2 ..
      // 22.5 - k/2 round (96, 0), its face at 6 + k/2; the Rid's straight steps - step k from x 96 + (15 - k)/2 to 96 + (16 - k)/2
      const ridSteps = () => !!(SH.steps15 && SH.steps15.mode === "rid");
      // the light (the user, 20:44: "התאורה, משהו חשוך, אמנם זה לילה, אבל עדיין צריך לראות מה קורה שם"): three phases of the night
      // kit (55-payis.js NIGHT) of its own - a clear night until the lamps are lit; then "ולא היתה חצר בירושלים שאינה מאירה מאור בית
      // השואבה" (Sukkah 5:3), warm and strong; at the cock's crow, the first grey of the dawn. Their values - model choices
      { const NK = SH.nightKit;
        if (NK && NK.P && !NK.P.simchaNight) Object.assign(NK.P, {
          simchaNight: { el: -16, az: 0.15, sunI: 0.75, sunC: 0xa3b5e2, hemI: 1.95, hemC: 0x96a6d6, gndC: 0x4d5578, fog: 0x0a0f1c, exp: 1.1 },
          simchaLit: { el: -16, az: 0.15, sunI: 0.7, sunC: 0xffcf98, hemI: 2.0, hemC: 0xeec49a, gndC: 0x655036, fog: 0x0c0c14, exp: 1.08 },
          simchaDawn: { el: -5, az: 0.15, sunI: 0.95, sunC: 0xd9d6e8, hemI: 2.2, hemC: 0xc8c6d6, gndC: 0x5e5a60, fog: 0x2c3044, exp: 1.1 } }); }
      const stepY = (x, z, rid) => {
        const r = rid ? x - 96 : Math.hypot(x - 96, z);
        if (rid) { if (r <= 0.5) return 13.5; if (r >= 7.5) return Y0; return Y0 + 0.5 * (16 - Math.ceil(r / 0.5)); }
        if (r <= 15) return 13.5; if (r >= 22) return Y0; return Y0 + 0.5 * Math.min(15, Math.floor((22 - r) / 0.5) + 1);
      };
      const SPOTS = [[141, -20], [181, -20], [141, 20], [181, 20]];   // the golden lamps (above)
      const DR = 8.2, NDANCE = 14;
      let B = null;
      const build = () => {
        if (B) return B;
        const PP = tm_people(ctx2);
        B = { dancers: [], jug: [], lev: {}, koh: [], rsbg: null };
        // ---- the people: men and boys of every age, the whole court full ("לפני כל העם שעמדו סביב אצל החומות", the Tiferet Yisrael; the
        //      user, 20:44: "צריך להיות ממש צפוף בכל העזרה הזאת"), their faces to the middle, the children rather in front; free: the
        //      dancers' ring, the lamps and their ladders, the steps and the Levites, the two flutes, the priests' way to the east gate,
        //      the lesser Sanhedrin's chamber and the four chambers. In cells of 13 amot, three crowds each (men; youths; children),
        //      their plainer levels sooner than the kit's (lodK 2.2: PEOPLE_LOD_304)
        const crowdG = new Group(); crowdG.name = "simchaCrowd"; DG.add(crowdG);
        const free = (x, z) => {
          if (x < 97.5 || x > 224.6 || z < -63.6 || z > 63.6) return false;   // the walls
          if ((x < 134.8 || x > 187.2) && Math.abs(z) > 26.3) return false;   // the four chambers in the corners (the default)
          if (x > 115.8 && x < 137.6 && z > -28.6 && z < -13.2) return false;   // the lesser Sanhedrin "על פתח העזרה" (30-courts.js)
          if (Math.hypot(x - 96, z) < 24.6) return false;                      // the steps and the Levites on them
          for (const [mx, mz] of SPOTS) if (Math.hypot(x - mx, z - mz) < 8.4) return false;   // the lamps, their ladders, the young priests
          if (Math.hypot(x - CXc, z) < 14.6) return false;                     // the dancers
          if (Math.abs(z) < 3.4 && x > 112) return false;                      // the way of the two priests to the east gate
          for (const [fx, fz] of [[121.6, -6], [121.6, 6]]) if (Math.hypot(x - fx, z - fz) < 1.6) return false;   // the two flutes
          return true;
        };
        let q = 19112026;
        const rr = () => (q = (q * 1664525 + 1013904223) >>> 0) / 4294967296;
        const cells = new Map(), SP = 1.3, CELL = 13;
        for (let x = 97.9; x < 224.4; x += SP) for (let z = -63.2; z < 63.4; z += SP) {
          const px = x + (rr() - 0.5) * 0.55, pz = z + (rr() - 0.5) * 0.55;
          if (!free(px, pz)) continue;
          const rc = Math.hypot(px - CXc, pz);
          const front = (rc < 18.5) || (Math.abs(pz) < 5.6 && px > 112) || SPOTS.some(([mx, mz]) => Math.hypot(px - mx, pz - mz) < 11);
          const a = rr(), kind = front && a < 0.45 ? 2 : a < 0.14 ? 10 : a < 0.36 ? 11 : a < 0.62 ? 12 : a < 0.78 ? 1 : 2;
          const yaw = Math.atan2(CXc - px, -pz) + (rr() - 0.5) * 0.55;
          const key = Math.floor(px / CELL) + "," + Math.floor(pz / CELL);
          if (!cells.has(key)) cells.set(key, [[], [], []]);
          const c = cells.get(key);
          if (kind >= 10) c[0].push([px, pz, yaw, kind - 10]); else c[kind].push([px, pz, yaw]);
        }
        const ROB = [0x6b5a3e, 0x4a4f5a, 0x5c4a3a, 0x3e4a5e, 0x7a6a50, 0x55483c], ROBK = [0x5a6070, 0x6b5a3e, 0x7a6a50, 0x4a4f5a];
        let ci = 0, nPeople = 0;
        const LK = 2.6;   // and minLv 1: the people are plain figures from near too (the dancers, the Levites and the priests are full)
        for (const [, c] of cells) {
          const [men, youth, kids] = c;
          if (men.length) PP.crowd(crowdG, men.map((p) => [p[0], p[1], p[2]]), { y: Y0, s: 1.4, pose: "stand", kind: "worker", robe: ROB[ci % ROB.length], tone: (i) => men[i][3], name: "simchaPeople", lodK: LK, minLv: 1 });
          if (youth.length) PP.crowd(crowdG, youth, { y: Y0, s: 1.3, pose: "stand", kind: "student", robe: ROB[(ci + 3) % ROB.length], name: "simchaPeople", lodK: LK, minLv: 1 });
          if (kids.length) PP.crowd(crowdG, kids, { y: Y0, s: ci % 2 ? 1.0 : 0.88, pose: "stand", kind: "student", robe: ROBK[ci % ROBK.length], name: "simchaPeople", lodK: LK, minLv: 1 });
          nPeople += men.length + youth.length + kids.length;
          ci++;
        }
        B.nPeople = nPeople;
        // ---- the dancers: "חסידים ואנשי מעשה" - elders, grey and white; each a figure of his own, with a torch (two of them throw four)
        for (let i = 0; i < NDANCE; i++) {
          const G = new Group(); DG.add(G);
          PP.crowd(G, [[0, 0, 0]], { y: 0, s: 1.4, pose: "stand", kind: "worker", robe: [0x2e3038, 0x3a3226, 0x2c3444][i % 3], tone: () => (i % 3 === 0 ? 0 : 1), exact: true, name: "simchaDancer" });
          const d = { G, ph: (i / NDANCE) * Math.PI * 2, hop: i * 0.37, tor: [] };
          if (i === 3 || i === 10) {   // "בארבע אבוקות... זורק זו ומקבל את זו" (the Bartenura)
            for (let k = 0; k < 4; k++) { const t = torch(k === 0, 1.9); G.add(t); d.tor.push(t); }
            B.jug.push(d);
          } else {
            const t = torch(true); t.position.set(-0.48, 1.9, 0.3); t.rotation.z = 0.12; G.add(t); d.tor.push(t);
          }
          B.dancers.push(d);
        }
        // ---- Rabban Shimon ben Gamliel: in the middle; eight torches; the kidah (a group that tilts about his feet)
        {
          const G = new Group(), Tl = new Group(); DG.add(G); G.add(Tl);
          PP.crowd(Tl, [[0, 0, 0]], { y: 0, s: 1.45, pose: "stand", kind: "worker", robe: 0x24324e, tone: () => 1, exact: true, name: "simchaRSBG" });
          const tor = [];
          for (let k = 0; k < 8; k++) { const t = torch(k % 2 === 0, 1.9); G.add(t); tor.push(t); }
          B.rsbg = { G, Tl, tor };
        }
        // ---- the two priests with the trumpets (white garments, the hat and the sash), the trumpet at the mouth while they blow
        for (const s of [-1, 1]) {
          const G = new Group(); G.visible = false; DG.add(G);
          PP.crowd(G, [[0, 0, 0]], { y: 0, s: 1.4, pose: "stand", kind: "kohen", robe: 0xf1ede2, tone: () => (s < 0 ? 1 : 2), exact: true, name: "simchaKohen" });
          const tr = new Group();
          tr.add(noP(new Mesh(new CylinderGeometry(0.035, 0.035, 1.35, 8).rotateX(Math.PI / 2).translate(0, 0, 0.68), silver)));
          tr.add(noP(new Mesh(new ConeGeometry(0.15, 0.32, 14, 1, true).rotateX(-Math.PI / 2).translate(0, 0, 1.45), silver)));
          G.add(tr);
          B.koh.push({ G, tr, s });
        }
        // ---- the musicians: the Levites on the steps, and the flute below them
        const lyreG = mergeGeometries([new TorusGeometry(0.3, 0.03, 6, 14, Math.PI * 1.3).rotateZ(-0.1).translate(0, 0.3, 0), new BoxGeometry(0.6, 0.05, 0.06).translate(0, 0.6, 0),
          ...[-2, -1, 0, 1, 2].map((s) => new CylinderGeometry(0.006, 0.006, 0.5, 3).translate(s * 0.08, 0.34, 0))]);
        const harpG = mergeGeometries([new BoxGeometry(0.09, 1.0, 0.11).translate(0, 0.5, 0), new BoxGeometry(0.56, 0.07, 0.09).translate(0.27, 0.96, 0), new BoxGeometry(0.58, 0.14, 0.14).translate(0.28, 0.07, 0),
          ...[1, 2, 3, 4, 5, 6, 7].map((s) => new CylinderGeometry(0.005, 0.005, 0.78, 3).translate(s * 0.068, 0.52, 0))]);
        const cymG = mergeGeometries([-1, 1].map((s) => new CylinderGeometry(0.2, 0.2, 0.025, 16).rotateZ(Math.PI / 2).translate(s * 0.16, 0, 0)));
        const trpG = mergeGeometries([new CylinderGeometry(0.03, 0.03, 1.2, 8).rotateX(Math.PI / 2).translate(0, 0, 0.6), new ConeGeometry(0.13, 0.28, 12, 1, true).rotateX(-Math.PI / 2).translate(0, 0, 1.3)]);
        const fluteG = new CylinderGeometry(0.03, 0.045, 0.95, 8).rotateX(Math.PI / 2 - 0.55).translate(0, -0.25, 0.42);
        const levites = (rid) => {
          const g = new Group(); g.visible = false; DG.add(g);
          const pts = [];
          // on all fifteen: "עמדו שם בט״ו שורות על הט״ו מעלות, ובכל שורה שררו שיר המעלות אחר" (the Tiferet Yisrael, Middot 2:5,
          // 819:253) - a row on every step, its figures between those of the row below (a half step along it)
          if (!rid) {
            for (let k = 1; k <= 15; k++) {
              const r = 22 - (k - 1) * 0.5 - 0.25, y = Y0 + 0.5 * k, off = k % 2 ? 0 : 0.5;
              for (let i = 0; i < 6; i++) {
                const th = -1.02 + ((i + off) / 5.5) * 2.04, z = r * Math.sin(th);
                if (Math.abs(z) < 2.6 || (k <= 5 && Math.abs(z) > 19)) continue;
                pts.push([96 + r * Math.cos(th), y, z, Math.atan2(Math.cos(th), Math.sin(th))]);
              }
            }
          } else {
            const RRr = (19.5 * 19.5 + 7.5 * 7.5) / 15;
            for (let k = 1; k <= 15; k++) {
              const d = 0.5 * (15 - k), half = Math.sqrt(Math.max(0, RRr * RRr - (RRr - 7.5 + d) * (RRr - 7.5 + d))) - 1, x = 96 + 0.5 * (15.5 - k), y = Y0 + 0.5 * k, off = k % 2 ? 0 : 0.5;
              for (let i = 0; i < 6; i++) { const z = -half + ((i + off) / 5.5) * 2 * half; if (Math.abs(z) >= 2.6) pts.push([x, y, z, Math.PI / 2]); }
            }
          }
          // each row's figures stand on their own step: one crowd per height
          const byY = new Map();
          for (const p of pts) { if (!byY.has(p[1])) byY.set(p[1], []); byY.get(p[1]).push(p); }
          for (const [y, list] of byY) PP.crowd(g, list.map((p) => [p[0], p[2], p[3]]), { y, s: 1.4, pose: "stand", kind: "levi", robe: 0x8f8468, tone: (i) => 1 + (i % 2), exact: true, name: "simchaLevi" });
          // the instruments before them: lyres for most, harps, cymbals and trumpets
          const kinds = pts.map((p, i) => (i % 9 === 4 ? 2 : i % 7 === 3 ? 3 : i % 4 === 1 ? 1 : 0));
          [lyreG, harpG, cymG, trpG].forEach((geo, t) => {
            const idx = kinds.map((k, i) => (k === t ? i : -1)).filter((i) => i >= 0);
            if (!idx.length) return;
            const im = new InstancedMesh(geo, t === 2 || t === 3 ? (t === 2 ? M2.bronze : silver) : wood, idx.length);
            idx.forEach((i, n) => {
              const p = pts[i], yaw = p[3], fw = t === 3 ? 0.12 : 0.42, hy = t === 3 ? 2.75 : t === 1 ? 1.3 : t === 2 ? 1.85 : 1.6;
              qz.setFromAxisAngle(upY, yaw);
              m4z.compose(vz.set(p[0] + Math.sin(yaw) * fw, p[1] + hy, p[2] + Math.cos(yaw) * fw), qz, sz1);
              im.setMatrixAt(n, m4z);
            });
            im.instanceMatrix.needsUpdate = true;
            g.add(noP(im));
          });
          return g;
        };
        B.levFor = (rid) => B.lev[rid ? "rid" : "rambam"] || (B.lev[rid ? "rid" : "rambam"] = levites(rid));
        // the flute: two players at the steps' foot, on the court's floor ("החליל מכה", the Rambam, Lulav 8:13)
        {
          const g = new Group(); DG.add(g);
          const pts = [[121.6, -6, Math.PI / 2 - 0.25], [121.6, 6, Math.PI / 2 + 0.25]];   // their faces to the court
          PP.crowd(g, pts, { y: Y0, s: 1.4, pose: "stand", kind: "levi", robe: 0x8f8468, tone: (i) => 1 + i, exact: true, name: "simchaFlute" });
          for (const [x, z, yaw] of pts) { const f = noP(new Mesh(fluteG, wood)); f.position.set(x, Y0 + 2.85, z); f.rotation.y = yaw; g.add(f); }
        }
        return B;
      };
      // ---- the clock (the written seconds; the screen's are SH.demoSlow times longer) ----
      const TD = 66;   // the cock's crow
      const CAPS = [[0, "״במוצאי יום טוב הראשון של חג, ירדו לעזרת נשים, ומתקנין שם תקון גדול״ (סוכה ה, ב)"],
        [3.2, "״חלקה היתה בראשונה, והקיפוה גזוזטרא, והתקינו שיהו נשים יושבות מלמעלה ואנשים מלמטה״ (סוכה נא:) — ״קרשים עם מעקה סביב על הזיזין שיוצאין מהחומות״ (תפארת ישראל)"],
        [6, "״ומנורות של זהב היו שם, וארבעה ספלים של זהב בראשיהן, וארבעה סלמות לכל אחד ואחד, וארבעה ילדים מפרחי כהנה ובידיהם כדים של שמן״ (סוכה ה, ב)"],
        [14.5, "״מבלאי מכנסי כהנים ומהמיניהן מהן היו מפקיעין, ובהן היו מדליקין״ (סוכה ה, ג)"],
        [21.8, "״ולא היתה חצר בירושלים שאינה מאירה מאור בית השואבה״ (סוכה ה, ג)"],
        [29.5, "״חסידים ואנשי מעשה היו מרקדים לפניהם באבוקות של אור שבידיהן, ואומרים לפניהן דברי שירות ותשבחות״ (סוכה ה, ד)"],
        [34, "״יש מהן אומרים: אשרי ילדותנו שלא ביישה את זקנותנו — אלו חסידים ואנשי מעשה״ (סוכה נג.)"],
        [38.5, "״ויש מהן אומרים: אשרי זקנותנו שכפרה את ילדותנו — אלו בעלי תשובה״ (סוכה נג.)"],
        [43, "״אלו ואלו אומרים: אשרי מי שלא חטא, ומי שחטא — ישוב וימחול לו״ (סוכה נג.)"],
        [48, "״והלוים בכנורות ובנבלים ובמצלתים ובחצוצרות ובכלי שיר בלא מספר, על חמש עשרה מעלות היורדות מעזרת ישראל לעזרת נשים״ (סוכה ה, ד)"],
        [52, "״שיר המעלות, הנה ברכו את ה׳ כל עבדי ה׳, העומדים בבית ה׳ בלילות״ (תהלים קלד, א) — ״ולוים בכנורות ובנבלים וכל כלי שיר מהן אומרים שיר המעלות הנה ברכו״ (תוספתא סוכה ד, ה)"],
        [56, "״אמרו עליו על רבן שמעון בן גמליאל, כשהיה שמח שמחת בית השואבה, היה נוטל שמנה אבוקות של אור, וזורק אחת ונוטל אחת ואין נוגעות זו בזו״ (סוכה נג.)"],
        [61.5, "״וכשהוא משתחוה, נועץ שני גודליו בארץ ושוחה ונושק את הרצפה וזוקף, ואין כל בריה יכולה לעשות כן, וזו היא קידה״ (סוכה נג.)"],
        [TD, "״ועמדו שני כהנים בשער העליון שיורד מעזרת ישראל לעזרת נשים, ושתי חצוצרות בידיהן. קרא הגבר — תקעו והריעו ותקעו״ (סוכה ה, ד)"],
        [TD + 8.6, "״הגיעו למעלה עשירית — תקעו והריעו ותקעו״ — בהדגמה: ירדו חמש, ועומדים על העשירית (״תיקו״, סוכה נג:)"],
        [TD + 14.9, "״הגיעו לעזרה — תקעו והריעו ותקעו״ — ״לרצפת עזרת נשים״ (תפארת ישראל)"],
        [TD + 20, "״היו תוקעין והולכין, עד שמגיעין לשער היוצא מזרח״ (סוכה ה, ד)"],
        [TD + 34.5, "״הגיעו לשער היוצא ממזרח, הפכו פניהן למערב, ואמרו: אבותינו שהיו במקום הזה אחוריהם אל היכל ה׳ ופניהם קדמה, והמה משתחוים קדמה לשמש — ואנו ליה עינינו״ (סוכה ה, ד)"],
        [TD + 42, "״רבי יהודה אומר: היו שונין ואומרין: אנו ליה, וליה עינינו״ (סוכה ה, ד)"]];
      const TEND = TD + 47;
      // the eye: flights fired by the clock (the viewer may look round between them)
      const FLY = [[0, [252, 88, 96], [161, 14, 0]], [3.4, [173, 26, -24], [158, 22, -64]], [6.2, [176, 32, 44], [141, 30, -20]],
        [14.5, [152, 58, -7], [141, 51, -20]], [21.8, [215, 60, 80], [161, 30, 0]], [29.5, [178, 13.5, 11], [161, 8.5, 0]], [38, [146, 12.5, -9], [161, 8.5, 0]],
        [48, [129, 16, 13], [104, 11, 0]], [56, [177, 12, 12], [161, 9.4, 0]], [TD, [126, 19, 15], [97, 14, 0]], [TD + 19.5, [172, 17, 24], [128, 9, 0]],
        [TD + 27, [204, 16, 23], [182, 9, 0]], [TD + 33, [196, 12.5, 9], [223, 9.5, 0]], [TD + 42.5, [252, 70, 92], [161, 12, 0]]];
      // the two priests' way (the screen's x; their feet on the steps by stepY): the upper gate, the tenth step, the court, the east gate
      const kohWay = (rid) => {
        const x10 = rid ? 96 + 0.5 * (15.5 - 10) : 96 + (22 - 9 * 0.5 - 0.25), xF = rid ? 104.2 : 118.8, xTop = rid ? 95.6 : 110.7;
        return [[TD, 94.6], [TD + 6, 94.6], [TD + 7.4, xTop], [TD + 8.4, x10], [TD + 13.6, x10], [TD + 14.6, xF], [TD + 19.9, xF], [TD + 34, 222.2]];
      };
      const BLASTS = [TD + 1, TD + 8.7, TD + 15];   // tekia - terua - tekia, each ~4.8 s (SOUNDS_300 "trumpets")
      const LONGS = [TD + 20.2, TD + 24.8, TD + 29.4];   // "היו תוקעין והולכין" - long blasts as they go
      // ---- the run ----
      const D = { run: false, t0: 0, pausedAt: null, fl: 0, saved: null, snd: -1, way: null, rid: false, music: null };
      const tNow = () => ((D.pausedAt != null ? D.pausedAt : performance.now()) - D.t0) / 1000 / SLOW();
      let cap = null;
      const capEl = () => {
        if (cap) return cap;
        cap = document.createElement("div");
        cap.id = "tm-simcha-cap";
        cap.setAttribute("dir", "rtl");
        Object.assign(cap.style, { position: "fixed", left: "50%", bottom: "64px", transform: "translateX(-50%)", maxWidth: "min(820px, 78vw)",
          background: "rgba(14,17,28,0.84)", color: "#f4ead0", font: "17px/1.55 var(--font-main, inherit)", padding: "8px 18px",
          borderRadius: "10px", zIndex: "40", pointerEvents: "none", textAlign: "center", userSelect: "none", boxShadow: "0 2px 10px rgba(0,0,0,0.35)", display: "none" });
        document.body.appendChild(cap);
        return cap;
      };
      const ss = (a, b, x) => { const u = Math.max(0, Math.min(1, (x - a) / (b - a))); return u * u * (3 - 2 * u); };
      const at1 = (pts, t) => {   // piecewise linear [[t, v] ...]
        if (t <= pts[0][0]) return pts[0][1];
        for (let i = 0; i + 1 < pts.length; i++) if (t <= pts[i + 1][0]) { const a = pts[i], b = pts[i + 1], u = (t - a[0]) / Math.max(1e-6, b[0] - a[0]); return a[1] + (b[1] - a[1]) * u; }
        return pts[pts.length - 1][1];
      };
      const juggle = (tor, t, H, rate, side0) => {   // each torch up from its hand and down to the other, turning (a cascade)
        const n = tor.length;
        tor.forEach((tg, k) => {
          const u = (((t * rate + k / n) % 1) + 1) % 1, s = ((Math.floor(t * rate + k / n) + k) % 2 ? 1 : -1) * side0;
          tg.position.set(s * (0.42 - 0.84 * u), 2.0 + 4 * H * u * (1 - u), 0.42);
          tg.rotation.set(Math.PI * 2 * u * 1.5, 0, s * 0.3);
        });
      };
      const apply = (t) => {
        const b = B;
        if (!b) return;
        sync();
        // the lamps: their own demonstration, by this clock, without its flights and labels
        const L = SH.simchaDemo;
        if (L && fnc(L.drive)) L.drive(t < 6 ? -1 : Math.min(23.4, t - 6));
        // the dancers: standing in their ring until 29.5, then round it; wider round Rabban Shimon; at the cock's crow off the way
        const go = ss(29.5, 31.5, t) * (1 - ss(TD - 0.2, TD + 1.6, t)), R = DR + 2.6 * ss(55, 57.5, t);
        const tt = Math.min(t, TD), ang = tt < 29.5 ? 0 : tt < 31.5 ? 0.3 * (tt - 29.5) * (tt - 29.5) / 4 : 0.3 * (tt - 30.5);   // the speed rises 0 .. 0.3 in two seconds
        const aside = ss(TD - 0.2, TD + 2.2, t);
        b.dancers.forEach((d, i) => {
          const a = d.ph + ang;
          let x = CXc + R * Math.cos(a), z = R * Math.sin(a);
          if (aside > 0) { const zz = Math.sign(z || 1) * Math.max(5.2, Math.abs(z)); z = z + (zz - z) * aside; }
          const hop = 0.22 * go * Math.abs(Math.sin(Math.PI * (2.1 * t + d.hop)));
          d.G.position.set(x, Y0 + hop, z);
          // the face: to the middle while they stand (-a - PI/2), along the ring as they go round (-a), a little inward, swaying
          d.G.rotation.y = -a - (Math.PI / 2) * (1 - go) - 0.35 * go + 0.45 * go * Math.sin(1.7 * t + d.hop);
          if (b.jug.includes(d)) juggle(d.tor, t, 1.25, 0.95 * (0.35 + 0.65 * go), i % 2 ? 1 : -1);
        });
        // Rabban Shimon ben Gamliel: in the middle; his eight torches (56-61.5), then they are put down; the kidah (62-65.5)
        {
          const r = b.rsbg, jug = ss(55.6, 56.4, t) * (1 - ss(61.2, 61.8, t));
          r.G.position.set(CXc, Y0, -5.6 * ss(TD - 0.2, TD + 2.2, t));
          r.G.rotation.y = Math.PI / 2 + 0.9 * Math.sin(0.5 * t) * (t > 56 && t < 61.5 ? 1 : 0.25);
          for (const tg of r.tor) tg.visible = jug > 0.02;
          if (jug > 0.02) { juggle(r.tor, t, 2.4, 0.9, 1); for (const tg of r.tor) tg.scale.setScalar(jug); }
          const kd = ss(62, 63.3, t) * (1 - ss(64.2, 65.5, t));
          r.Tl.rotation.x = 1.38 * kd;
        }
        // the Levites of the steps' reading; the two priests
        const rid = ridSteps();
        for (const [k, g] of Object.entries(b.lev)) g.visible = (k === "rid") === rid;
        if (!b.lev[rid ? "rid" : "rambam"]) b.levFor(rid).visible = true;
        if (!D.way || D.rid !== rid) { D.way = kohWay(rid); D.rid = rid; }
        const on = t >= TD - 0.05;
        const blow = BLASTS.some((s) => t >= s - 0.3 && t < s + 5) || LONGS.some((s) => t >= s - 0.2 && t < s + 3);
        for (const k of b.koh) {
          k.G.visible = on;
          if (!on) continue;
          const x = at1(D.way, t), z = k.s * 1.25;
          const walking = D.way.some((p, i) => i + 1 < D.way.length && t > p[0] && t < D.way[i + 1][0] && D.way[i + 1][1] !== p[1]);
          k.G.position.set(x, stepY(x, z, rid) + (walking ? 0.05 * Math.abs(Math.sin(t * 9)) : 0), z);
          k.G.rotation.y = Math.PI / 2 + Math.PI * ss(TD + 34, TD + 35.2, t);   // east, then the face to the west
          k.tr.position.set(0, blow ? 2.78 : 1.55, blow ? 0.16 : 0.32);
          k.tr.rotation.set(blow ? -0.12 : 1.25, 0, 0);
        }
        // the night, and the first light from the cock's crow
        const NK = SH.nightKit;
        if (NK && D.saved && D.saved.night) {
          if (t < 19.3) NK.set("simchaNight", "simchaNight", 0);
          else if (t < TD + 8) NK.set("simchaNight", "simchaLit", ss(19.3, 23, t));
          else NK.set("simchaLit", "simchaDawn", ss(TD + 8, TD + 42, t));
        }
        // the music: from the dance to the cock's crow
        if (D.music) D.music.set(D.pausedAt != null ? 0 : 0.9 * ss(29.5, 31.2, t) * (1 - ss(TD - 1.2, TD + 0.2, t)));
        // the caption
        let txt = "";
        for (const [ct, x] of CAPS) if (t >= ct) txt = x;
        const c = capEl();
        if (c.textContent !== txt) c.textContent = txt;
        c.style.display = txt ? "block" : "none";
      };
      const stop = () => {
        if (!D.run) return;
        D.run = false;
        D.pausedAt = null;
        demoOn = false;
        DG.visible = false;
        sync();
        if (cap) cap.style.display = "none";
        if (D.music) { try { D.music.stop(); } catch (_) {} D.music = null; }
        if (fnc(SH.sfxCut)) { try { SH.sfxCut(); } catch (_) {} }
        const L = SH.simchaDemo;
        if (L && fnc(L.clear)) L.clear();
        const s = D.saved;
        D.saved = null;
        if (s) {
          if (!s.lamps && SH.features && SH.features.simchaMenorot) { try { SH.features.simchaMenorot.off(); } catch (_) {} }
          const lg = ctx2.scene && ctx2.scene.getObjectByName("labels");
          if (lg && s.labels != null) lg.visible = s.labels;
          if (s.night && SH.nightKit) SH.nightKit.end();
        }
      };
      const start = () => {
        stop();
        if (fnc(SH.stopDemos)) { try { SH.stopDemos("simcha-shoeva"); } catch (_) {} }
        build();
        const lg = ctx2.scene && ctx2.scene.getObjectByName("labels"), FM = SH.features && SH.features.simchaMenorot;
        D.saved = { labels: lg ? lg.visible : null, lamps: !!(FM && FM.isOn()), night: !!(SH.nightKit && SH.nightKit.begin()) };
        if (lg) lg.visible = false;
        if (D.saved.night) SH.nightKit.set("simchaNight", "simchaNight", 0);
        demoOn = true;
        DG.visible = true;
        sync();
        D.fl = 0;
        D.snd = -1;
        D.way = null;
        D.music = fnc(SH.sfxLoop) ? SH.sfxLoop("simcha") : null;
        D.t0 = performance.now();
        D.run = true;
        apply(0);
      };
      (SH.demoStops || (SH.demoStops = [])).push({ id: "simcha-shoeva", running: () => D.run, stop,
        pause: () => { if (D.run && D.pausedAt == null) D.pausedAt = performance.now(); },
        resume: () => { if (D.pausedAt == null) return; D.t0 += performance.now() - D.pausedAt; D.pausedAt = null; },
        paused: () => D.pausedAt != null,
        restart: () => start() });
      SH.simchaShoeva = { start, stop, get on() { return D.run; },
        seek(t) { if (D.run) { D.t0 = (D.pausedAt != null ? D.pausedAt : performance.now()) - t * 1000 * SLOW(); D.fl = FLY.findIndex((f) => f[0] > t); if (D.fl < 0) D.fl = FLY.length; D.snd = t; } },   // (the tests' way to a moment)
        info: () => ({ people: B ? B.nPeople : 0, dancers: B ? B.dancers.length : 0 }) };
      if (Array.isArray(ctx2.animated)) ctx2.animated.push(() => {
        sync();
        if (!D.run) return;
        const now = performance.now() / 1000;
        for (const f of FLS) { const k = 0.85 + 0.15 * Math.sin(now * 9 + f.userData.ph) + 0.06 * Math.sin(now * 23 + f.userData.ph * 2); f.scale.set(0.55 * k, 1.05 * (0.9 + 0.2 * k), 1); }
        if (D.pausedAt != null) { if (D.music) D.music.set(0); return; }
        const t = tNow();
        if (t >= TEND) { stop(); return; }
        apply(t);
        while (D.fl < FLY.length && t >= FLY[D.fl][0]) { const f = FLY[D.fl++]; try { if (fnc(ctx2.flyTo)) ctx2.flyTo(f[1], f[2], 1800); } catch (_) {} }
        // the trumpets and the cymbals, each once a run (SOUNDS_300)
        if (fnc(SH.sfx) && D.snd < t) {
          for (const s of BLASTS) if (D.snd < s && t >= s) SH.sfx("trumpets");
          for (const s of LONGS) if (D.snd < s && t >= s) SH.sfx("trumpets", { pattern: "long" });
          for (const s of [31.5, 43, 52]) if (D.snd < s && t >= s) SH.sfx("cymbals", { gain: 0.5 });
        }
        D.snd = t;
      });
      // the pill on the model, over the women's court
      const MB = Array.isArray(SH.modelButtons) ? SH.modelButtons : (SH.modelButtons = []);
      MB.push({
        id: "simcha-shoeva", label: "הדגמה: שמחת בית השואבה", labelOn: "עצור את ההדגמה", maxDist: 260,
        title: "״כל מי שלא ראה שמחת בית השואבה, לא ראה שמחה מימיו״ (סוכה ה, א) — הגזוזטראות על הזיזים, המנורות של זהב, החסידים ואנשי מעשה מרקדים באבוקות, הלוים על חמש עשרה המעלות, ובקריאת הגבר — שני הכהנים בחצוצרות.",
        anchor: () => { const p = ctx2.camera && ctx2.camera.position; return p && !D.run && p.x > 70 && p.x < 360 && Math.abs(p.z) < 190 && p.y < 280 ? [161, YB + 8, 0] : null; },
        get: () => D.run,
        set: (on) => { if (on) start(); else stop(); }
      });
    }
