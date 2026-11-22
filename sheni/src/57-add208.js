  // plugin/js/add208.js
  // ===== Beit Sheni 1.9.9 (ADD_208): THE ADDITIONS OF THE "ערכי המקדש" ROUND =====
  // The user, 12.11.2026, on the report on the plugin "ערכי המקדש" (21:14, 21:41): "1. שניהם כמתג" (the golden chandelier: Rashi's lamp and
  // the Rambam's "שמשית"), "2. שים אותה ליד הנברשת" (the golden tablet), "3. אפשרות א'" (the thirteen shofarot in the Azara, by the altar,
  // to the right of one who comes in), "4. לשכת הכלים אפשר בתאים סביב ההיכל", "5. ... מתג לרש"י ורמב"ם, זו שיטה אחת, ומתג לתוספות" (Beit
  // HaEven), "8" (the ulam's courses in the Rambam's reading of the steps), "ב' שתיהן" (a door to the lepers' chamber, in both readings).
  // Every quotation in the cards (tools/cards_208.py, tools/rows_208.py) read in his library. Sizes, materials and exact places that the
  // sources do not give - model choices, said so in the cards.
  async function buildAdd208(ctx2) {
    const { H: H2, M: M2, LV } = ctx2;
    const SH = ctx2.shared;
    ctx2.layers = ctx2.layers || {};
    const grp = (name, visible) => { const g = new Group(); g.name = name; g.visible = visible !== false; ctx2.root.add(g); ctx2.layers[name] = g; return g; };
    const lbl = (text, x, y, z, size, layer) => ctx2.labels.push(Object.assign({ text, x, y, z, size: size || 1.2 }, layer ? { layer } : {}));
    const mesh = (g, geo, mat, x, y, z) => { const m = new Mesh(geo, mat); m.position.set(x, y, z); m.castShadow = m.receiveShadow = true; g.add(m); return m; };
    // the first surface under (x, z) from above, or along a ray - the places of the new pieces follow what the other modules built
    const rc = new Raycaster(), V0 = new Vector3(), V1 = new Vector3();
    const solid = (o) => o.isMesh && o.visible !== false && !(o.material && o.material.transparent && o.material.opacity < 0.5);
    let mw = false;
    const castFrom = (from, dir, fallback) => {
      if (!mw) { ctx2.root.updateMatrixWorld(true); mw = true; }   // built this frame: no matrices until updated
      rc.camera = ctx2.camera;   // the labels' sprites need it (TAMID_QA_207)
      rc.set(V0.set(from[0], from[1], from[2]), V1.set(dir[0], dir[1], dir[2]).normalize());
      const hits = rc.intersectObjects(ctx2.root.children, true).filter((h) => { let o = h.object; while (o) { if (o.visible === false) return false; o = o.parent; } return solid(h.object); });
      return hits.length ? hits[0].point.clone() : fallback;
    };
    const groundAt = (x, z, from, fallback) => { const p = castFrom([x, from, z], [0, -1, 0], null); return p ? p.y : fallback; };
    SH.__add208QA = { groundAt, castFrom };   // for the checks

    // ---------- 1+2. HELENE'S CHANDELIER AND TABLET (Yoma 3:10) ----------
    // "הילני אמו עשתה נברשת של זהב על פתחו של היכל. ואף היא עשתה טבלא של זהב שפרשת סוטה כתובה עליה". The chandelier "על פתחו של
    // היכל" - over the Heichal's door (its east face x 1.5, the door z -5..5, y 22..42), in the ulam, above the golden vine (y ~43).
    // Two forms (the opinions row "הנברשת של הילני — צורתה"): Rashi (Yoma 37a "נברשתא - מנורה") and the Bartenura ("נברשת. מנורה") -
    // a hanging lamp (the default); the Rambam (commentary, Yoma 3:10) "כמו שמשית שעושין על פתחי הבתים מזכוכית והיא עשתה אותה מזהב
    // טוב ממורט" - a gold fan over the doorway. The tablet: Tosefta Sotah 2:1 "טבלא של זהב היתה קבועה בכותלו של היכל והיא נראית
    // [מבאולם]" - on the Heichal's front, north of its door (the side, the size and the height - model choices); its letters engraved
    // ("ובחריתה היתה" - the Rambam's responsum 7:2), drawn as rows of marks (what was written on it is disputed - the card).
    const wallX = (castFrom([12, 30, -12.5], [-1, 0, 0], new Vector3(1.5, 30, -12.5))).x;   // the Heichal's front, seen from the ulam
    const lampG = grp("heleneLamp", true), shamG = grp("heleneShamshit", false), tabG = grp("heleneTablet", true);
    {
      const LX = 4.6, LY = 48.6;   // in the ulam, 3 amot before the wall, over the vine
      mesh(lampG, new CylinderGeometry(0.05, 0.05, 9.4, 6), M2.gold, LX, LY + 1.1 + 4.7, 0);   // the chain to the ulam's height
      const bowl = new LatheGeometry([[0, -0.55], [0.35, -0.5], [0.75, -0.25], [0.95, 0.15], [1.0, 0.35], [0.88, 0.4], [0.7, 0.2], [0.3, 0.05], [0.12, 0.6], [0.16, 1.1], [0, 1.15]].map(([r, y]) => new Vector2(r, y)), 28);
      mesh(lampG, bowl, M2.gold, LX, LY, 0);
      const ring = new TorusGeometry(1.45, 0.07, 8, 40);
      const rm = mesh(lampG, ring, M2.gold, LX, LY + 0.25, 0); rm.rotation.x = Math.PI / 2;
      const cup = new LatheGeometry([[0, 0], [0.16, 0.02], [0.28, 0.18], [0.3, 0.3], [0.24, 0.3], [0.12, 0.12], [0, 0.1]].map(([r, y]) => new Vector2(r, y)), 14);
      const arm = new CylinderGeometry(0.04, 0.04, 1.0, 6);
      for (let i = 0; i < 8; i++) {   // eight cups round it (their number - a model choice)
        const a = (i / 8) * Math.PI * 2, cx = Math.cos(a) * 1.45, cz = Math.sin(a) * 1.45;
        mesh(lampG, cup, M2.gold, LX + cx, LY + 0.3, cz);
        const am = mesh(lampG, arm, M2.gold, LX + cx * 0.62, LY + 0.25, cz * 0.62); am.rotation.z = Math.PI / 2; am.rotation.y = -a;
      }
      lbl("הנברשת של הילני — כרש״י וברטנורא: מנורה (יומא ג, י)", LX + 0.5, LY + 3.2, 0, 1.4, "heleneLamp");
    }
    {
      const SY = 46.6, R = 3.4, X = wallX + 0.3;   // the fan over the doorway, on the wall above the vine
      const polished = new MeshStandardMaterial({ color: 0xffe08a, metalness: 0.35, roughness: 0.22, emissive: 0x8a6418, emissiveIntensity: 0.6, side: DoubleSide });
      const fan = new CircleGeometry(R, 40, 0, Math.PI);
      const f = mesh(shamG, fan, polished, X, SY, 0); f.rotation.y = Math.PI / 2;
      const rim = mesh(shamG, new TorusGeometry(R, 0.12, 6, 40, Math.PI), M2.bronze, X + 0.02, SY, 0); rim.rotation.y = Math.PI / 2;
      mesh(shamG, new BoxGeometry(0.14, 0.24, R * 2 + 0.3), M2.bronze, X, SY - 0.12, 0);   // its base line
      const ray = new BoxGeometry(0.08, R * 0.92, 0.16);
      for (let i = 0; i <= 12; i++) {   // the rays of the fan (a model choice)
        const a = (i / 12) * Math.PI, r = mesh(shamG, ray, M2.bronze, X + 0.06, SY + Math.sin(a) * R * 0.5, -Math.cos(a) * R * 0.5);
        r.rotation.x = a - Math.PI / 2;
      }
      const hub = mesh(shamG, new CylinderGeometry(0.7, 0.7, 0.14, 24, 1, false, 0, Math.PI), M2.bronze, X + 0.1, SY, 0);
      hub.rotation.z = Math.PI / 2; hub.rotation.x = -Math.PI / 2;
      lbl("השמשית של הילני — כרמב״ם (פירוש המשנה, יומא ג, י)", X + 2, SY + R + 1.4, 0, 1.4, "heleneShamshit");
    }
    {
      const TX = wallX + 0.09, TY = 25.4, TZ = -12.5, TW = 2.4, TH = 1.7;   // north of the door, at the height of a man's eye over the floor (y 22)
      const cv = document.createElement("canvas"); cv.width = 256; cv.height = 180;
      const c2 = cv.getContext("2d");
      c2.fillStyle = "#e7c35a"; c2.fillRect(0, 0, 256, 180);
      c2.strokeStyle = "#8a6414"; c2.lineWidth = 6; c2.strokeRect(5, 5, 246, 170);
      c2.fillStyle = "#6e4e0c";
      for (let row = 0; row < 7; row++) for (let k = 0; k < 11; k++) {   // engraved marks in rows, right to left - not letters (model choice)
        const w = 8 + ((row * 7 + k * 13) % 9), x = 236 - k * 20 - w, y = 22 + row * 21;
        if (x > 14) c2.fillRect(x, y, w, 7);
      }
      const tex = new CanvasTexture(cv);
      tex.colorSpace = SRGBColorSpace;
      const pm = new MeshStandardMaterial({ map: tex, metalness: 0.55, roughness: 0.35, emissive: 0x5a400f, emissiveIntensity: 0.35 });
      mesh(tabG, new BoxGeometry(0.12, TH + 0.36, TW + 0.36), M2.bronze, TX - 0.02, TY + TH / 2, TZ);   // a frame, that it be seen on the gilded wall
      mesh(tabG, new BoxGeometry(0.1, TH, TW), [pm, M2.gold, M2.gold, M2.gold, M2.gold, M2.gold], TX + 0.06, TY + TH / 2, TZ);   // the engraved face toward the ulam (+x)
      lbl("טבלא של זהב — פרשת סוטה (יומא ג, י; תוספתא סוטה ב, א)", TX + 2.2, TY + TH + 1.1, TZ, 1.2, "heleneTablet");
      // HELENE_211 (decision 3 of the user, 14.11.2026: "כדאי שיהיה מבט מכוון או סימון"): the tablet is small on the great gilded wall.
      // The card's own switch "מבט" has a view that stands before it (content.json), and an amber frame glows round it for 15 s -
      // the feature heleneTabletGlow (as the upper storey's doorway, aliyahDoor). A sign of the model.
      {
        const gl = grp("heleneTabletGlow", false);
        const fm = new MeshBasicMaterial({ color: 0xff9a00 });
        const W2 = TW + 1.1, H2f = TH + 1.1, cy = TY + TH / 2, t = 0.2;
        for (const [h, w, y, z] of [[t, W2 + t, cy + H2f / 2, TZ], [t, W2 + t, cy - H2f / 2, TZ], [H2f, t, cy, TZ - W2 / 2], [H2f, t, cy, TZ + W2 / 2]]) {
          const b = new Mesh(new BoxGeometry(0.1, h, w), fm);
          b.position.set(TX + 0.16, y, z);
          b.userData.noPick = true;
          gl.add(b);
        }
        SH.features = SH.features || {};
        SH.features.heleneTabletGlow = { key: "heleneTabletGlow", isOn: () => gl.visible, on: () => { gl.visible = true; }, off: () => { gl.visible = false; } };
      }
    }
    // NIVR_SPARKS_211 (stage ב, point 34; the user: V): Yoma 37b (107:893) "תנא: בשעה שהחמה זורחת ניצוצות יוצאין ממנה, והכל יודעין
    // שהגיע זמן קריאת שמע"; Rashi (2157:1409) "ניצוצות - זהרורית שהחמה זורחת מן המזרח ונטה על פתח ההיכל שהוא לצד מערבי". Twinkling
    // sparks round the chandelier (Rashi's lamp) or the fan (the Rambam's shamshit) - whichever the row shows - while the feature
    // heleneSparks is on (a place's 15 s). Their number, size and twinkle: model choices.
    {
      const cv = document.createElement("canvas"); cv.width = cv.height = 64;
      const c2 = cv.getContext("2d"), gr = c2.createRadialGradient(32, 32, 0, 32, 32, 32);
      gr.addColorStop(0, "rgba(255,255,235,1)"); gr.addColorStop(0.22, "rgba(255,226,120,0.9)"); gr.addColorStop(1, "rgba(255,190,60,0)");
      c2.fillStyle = gr; c2.fillRect(0, 0, 64, 64);
      c2.fillStyle = "rgba(255,255,240,0.95)"; c2.fillRect(30, 2, 4, 60); c2.fillRect(2, 30, 60, 4);   // the star's cross
      const tx = new CanvasTexture(cv);
      tx.colorSpace = SRGBColorSpace;
      const SP = [];
      const sparks = (parent, cx, cy, cz, rx, ry, rz, n) => {
        const sg = new Group();
        sg.visible = false;
        parent.add(sg);
        for (let i = 0; i < n; i++) {
          const m = new SpriteMaterial({ map: tx, color: 0xffffff, transparent: true, depthWrite: false, blending: AdditiveBlending });
          const sp = new Sprite(m);
          const a = i * 2.39996, r = 0.35 + 0.65 * ((i * 0.618) % 1);
          sp.position.set(cx + Math.cos(a) * rx * r, cy + ry * (((i * 0.377) % 1) - 0.5), cz + Math.sin(a) * rz * r);
          sp.userData = { noPick: true, ph: i * 1.7, f: 2.2 + (i % 5) * 0.55, s: 1.0 + 0.7 * ((i * 0.41) % 1) };
          sp.renderOrder = 9;
          sg.add(sp);
        }
        SP.push(sg);
        return sg;
      };
      sparks(lampG, 4.6, 48.7, 0, 1.9, 1.3, 1.9, 26);
      sparks(shamG, wallX + 0.6, 46.6 + 1.6, 0, 0.5, 3.0, 3.6, 30);
      SH.features = SH.features || {};
      SH.features.heleneSparks = { key: "heleneSparks", isOn: () => SP[0].visible, on: () => { for (const g2 of SP) g2.visible = true; }, off: () => { for (const g2 of SP) g2.visible = false; } };
      if (Array.isArray(ctx2.animated)) ctx2.animated.push(() => {
        if (!SP[0].visible) return;
        const t = performance.now() / 1000;
        for (const g2 of SP) for (const sp of g2.children) {
          const u = sp.userData, k = Math.max(0, Math.sin(t * u.f + u.ph));
          sp.scale.setScalar(u.s * (0.25 + 1.1 * k * k));
          sp.material.opacity = 0.25 + 0.75 * k;
        }
      });
      ctx2.layers = ctx2.layers || {};
      ctx2.layers.heleneSparks = SP[0];   // the label's layer: shown with the sparks (in either form)
      lbl("״בשעה שהחמה זורחת ניצוצות יוצאין ממנה״ (יומא לז:)", 4.6, 54.6, 0, 1.3, "heleneSparks");
    }
    SH.helene = {
      mode: "rashi",
      set(m) { this.mode = m === "rambam" ? "rambam" : "rashi"; lampG.visible = this.mode === "rashi"; shamG.visible = this.mode === "rambam"; return this.mode; }
    };

    // ---------- 3. THE THIRTEEN SHOFAROT (Shekalim 6:1, 6:5) ----------
    // "שלשה עשר שופרות... היו במקדש". The Bartenura (Shekalim 2:1): "והיו עומדים בעזרה", learned from Jehoiada's chest - "ויתן אתו אצל
    // המזבח מימין בבוא איש בית ה'" (II Kings 12:10; Metzudat David: "בימין הבא אל הבית"). Here: in the Israelites' court (x 82.5..93.5) -
    // the nearest to the altar where one who brings his money may stand - north of the axis, to the right of one who comes in by Nikanor's
    // gate (a model choice). The form: "תבות צרות מלמעלה ורחבות מלמטה עקמות כעין שופר" (the Bartenura 6:1), "עגולות עקומות" (the
    // Rambam's commentary 6:1); the size and the metal - model choices.
    const shG = grp("shofarot", true);
    {
      const prof = [[0, 0], [0.52, 0], [0.56, 0.08], [0.52, 0.45], [0.44, 0.85], [0.33, 1.15], [0.24, 1.32], [0.2, 1.4], [0, 1.4]].map(([r, y]) => new Vector2(r, y));
      const body = new LatheGeometry(prof, 20);
      const neckCurve = new CatmullRomCurve3([new Vector3(0, 1.36, 0), new Vector3(0, 1.62, 0), new Vector3(0.12, 1.86, 0), new Vector3(0.38, 1.98, 0)]);
      const neck = new TubeGeometry(neckCurve, 16, 0.15, 10, false);
      const lip = new TorusGeometry(0.15, 0.04, 6, 16);
      const X0 = 86.5, Z0 = -9.5, DZ = -2.1;   // the court of Israel's floor, east of the duchan (fix-b2, 22.11.2026, at fix-a2's request: the duchan and its steps moved 3 amot west, to touch the priests' court, x 82.5..85 - 84.0 until now stood on them)
      for (let i = 0; i < 13; i++) {
        const z = Z0 + i * DZ, y = groundAt(X0, z, 40, LV.AZ);
        const b = new Group(); b.position.set(X0, y, z); b.rotation.y = Math.PI;   // the curved mouths toward the court (west)
        shG.add(b);
        mesh(b, body, M2.bronze, 0, 0, 0);
        mesh(b, neck, M2.bronze, 0, 0, 0);
        const l = mesh(b, lip, M2.gold, 0.38, 1.98, 0); l.rotation.y = Math.PI / 2;
      }
      lbl("שלשה עשר שופרות (שקלים ו, א; ו, ה)", X0, LV.AZ + 4.2, Z0 + 6 * DZ, 1.6);
    }

    // ---------- 4. THE CHAMBER OF THE VESSELS (Tamid 3:4) ----------
    // "נכנסו ללשכת הכלים, והוציאו משם תשעים ושלשה כלי כסף וכלי זהב". Tiferet Yisrael (Yachin, Tamid 3:4): "לא ידעתי מקומה. ואפשר
    // שהיתה באותן ל"ח לשכות שהיו סביב לכותלי ההיכל" - a label on the cells, not on one of them.
    lbl("לשכת הכלים — אפשר שבאחד מן התאים (תפארת ישראל, תמיד ג, ד)", -30, 50, -40.5, 1.6);

    // ---------- 5. BEIT HAEVEN - THE CHAMBER OF THE PRIEST WHO BURNS THE RED HEIFER (Parah 3:1; Yoma 2a) ----------
    // "ללשכה שעל פני הבירה, צפונה מזרחה, ובית אבן היתה נקראת". Two readings (the row "לשכת בית האבן — מקומה"): Rashi (Yoma 2a "במקצוע
    // מזרחית צפונית של עזרה היתה") with the Rambam (Parah Adumah 2:1 "ללשכה מוכנת בעזרה") - in the Azara's north-east corner (the
    // default); Tosafot (Yoma 2a, "ומאי שנא") "ללשכה שעל פני הבירה שחוץ לעזרה" - outside the Azara, to its north-east. Its size, its height,
    // its door and the place outside - model choices.
    const beIn = grp("beitEvenIn", true), beOut = grp("beitEvenOut", false);
    const chamber = (g, x0, x1, z0, z1, y, doorSide, name) => {
      const T = 1, HH = 9, cx = (x0 + x1) / 2, cz = (z0 + z1) / 2, lx = x1 - x0, lz = z1 - z0;
      // 2.0.8: occlude false - a small chamber is never ghosted (the view's rays ghosted its walls as if they hid the target)
      const op = (side) => (side === doorSide ? [{ center: 0, width: 3, height: 6 }] : []);
      H2.wall(g, { axis: "x", length: lx, height: HH, thickness: T, mat: M2.stoneLight, occlude: false, cx, cz: z0 + T / 2, y, openings: op("n") });
      H2.wall(g, { axis: "x", length: lx, height: HH, thickness: T, mat: M2.stoneLight, occlude: false, cx, cz: z1 - T / 2, y, openings: op("s") });
      H2.wall(g, { axis: "z", length: lz - 2 * T, height: HH, thickness: T, mat: M2.stoneLight, occlude: false, cx: x0 + T / 2, cz, y, openings: op("w") });
      H2.wall(g, { axis: "z", length: lz - 2 * T, height: HH, thickness: T, mat: M2.stoneLight, occlude: false, cx: x1 - T / 2, cz, y, openings: op("e") });
      H2.box(g, lx + 0.4, 0.6, lz + 0.4, M2.stoneSmooth, cx, y + HH, cz);   // the roof
      lbl(name, cx, y + HH + 2.4, cz, 1.4, g.name);
    };
    {
      // BEIT_EVEN_UPPER_208 (the user, 13.11.2026 00:57: "אפשרות ג לשכת בית האבן"): the court's north-east corner holds the building
      // of the three chambers (THREE_CHAMBERS_195, the Gazit by the Boaz), so for Rashi and the Rambam the chamber is an UPPER STOREY on
      // its level roof (30-courts.js: the slab x 66.2..91.8, y 29.5..30.4), in the corner itself: x 81..91 (to the court's east wall),
      // z -67.5..-57.5 (from the court's north line), its door west, to the roof. MODEL CHOICE: no source gives its storey, size,
      // door or the way up. With the chambers' roofs open (ctx2.lishkotCut) it goes with the roof.
      const yU = groundAt(86, -62.5, 60, 30.4);
      const n0 = beIn.children.length;
      chamber(beIn, 81, 91, -67.5, -57.5, yU, "w", "לשכת בית האבן — לרש״י ולרמב״ם: בקרן המזרחית־צפונית. במודל: עלייה על בניין שלוש הלשכות (בחירת מודל)");
      if (Array.isArray(ctx2.lishkotCut)) for (const m of beIn.children.slice(n0)) ctx2.lishkotCut.push(m);
      SH.beitEvenUpper = { y: yU, at: [86, yU, -62.5] };
      const yo = groundAt(86, -96, 60, LV.HAR);
      chamber(beOut, 81, 91, -101, -91, yo, "s", "לשכת בית האבן — לתוספות, חוץ לעזרה");
    }
    SH.beitEven = {
      mode: "rashi",
      set(m) { this.mode = m === "tosafot" ? "tosafot" : "rashi"; beIn.visible = this.mode === "rashi"; beOut.visible = this.mode === "tosafot"; return this.mode; }
    };

    // ---------- 7b. לשכת חשאים (CHASHAIM_208; the user, 12.11.2026 22:56: "לשכת חשאים תעשה בעזרה") ----------
    // Shekalim 5:6 "שתי לשכות היו במקדש, אחת לשכת חשאים ואחת לשכת הכלים. לשכת חשאים, יראי חטא נותנים לתוכה בחשאי, ועניים בני טובים
    // מתפרנסים מתוכה בחשאי"; Tosefta Shekalim 2:16 "כשם שהיתה לשכת חשאין במקדש, כך היתה בכל עיר ועיר". No source gives its place - the
    // Raavad (Melechet Shlomo on Tamid 3:5): "ולא ידענא אי דוקא במקדש קאמר... או בעזרה... לפיכך צריכה עיון באיזה מקום היתה עומדת". The
    // user's word: in the court. MODEL CHOICE: a small chamber against the court's south wall, south of the house, between the third
    // southern gate (x -25..-11) and the ulam's corner, its door to the north; its size as the other small chambers here.
    {
      const chG = grp("chashaim", true);
      const yC = groundAt(3, 63, 60, LV.KOH);
      const wallHit = castFrom([3, yC + 2.5, 52], [0, 0, 1], null);
      const zW = wallHit && wallHit.z > 58 && wallHit.z < 72 ? wallHit.z - 0.02 : 66.8;
      chamber(chG, -1, 7, zW - 7.5, zW, yC, "n", "לשכת חשאים (שקלים ה, ו) — מקומה: בחירת מודל");
      SH.chashaim = { at: [3, yC, zW - 3.75], group: chG };
    }

    // ---------- 8. THE ULAM'S COURSES IN THE RAMBAM'S READING (his commentary, Middot 3:6; Beit HaBechirah 4:9; the Meiri) ----------
    // "וכן סביב לכתלי האולם מלמטה עד למעלה כך היו אמה אחת חלק ורבד שלש אמות. ואמה חלק ורבד שלש אמות עד למעלה... ורבד העליון היה
    // רחבו ארבע אמות". On the ulam's front (x 17.5, z -50..50, y 22..110.5): from the top - a course of four, then an amah plain and a
    // course of three, down to the floor; round the doorway (z -10..10 below 62) and the beams and the gold band over it (z -15..15
    // below 76) the courses stop. How far a course stands out - half an amah, a model choice. Shown with the Rambam's steps only.
    const crs = grp("ulamCoursesRambam", false);
    {
      const X = 17.5, D = 0.5, YB = 22, YT = 110.5;
      const band = (y0, h) => {
        const cut = y0 < 62 ? 10 : y0 < 76 ? 15.5 : 0;
        const segs = cut ? [[-50, -cut], [cut, 50]] : [[-50, 50]];
        for (const [a, b] of segs) H2.box(crs, D, h, b - a, M2.stoneSmooth, X + D / 2, y0, (a + b) / 2);
      };
      let top = YT - 4;
      band(top, 4);
      while (top - 4 >= YB) { top -= 4; band(top, 3); }   // an amah plain, then a course of three
    }
    if (SH.ulamSteps && typeof SH.ulamSteps.set === "function") {
      const set0 = SH.ulamSteps.set.bind(SH.ulamSteps);
      SH.ulamSteps.set = (m) => { const r = set0(m); crs.visible = SH.ulamSteps.mode === "rambam"; return r; };
      crs.visible = SH.ulamSteps.mode === "rambam";
    }

    // ---------- ב. THE DOOR OF THE LEPERS' CHAMBER (both readings of the four chambers) ----------
    // No source mentions a door - a model choice (the user: "וללשכת המצורעים צריך להוסיף דלת", "ב' שתיהן"). Inside the corners (Tosafot Yom
    // Tov, the default): two cedar leaves in its doorway (30-courts.js: the partition at x 133.5, its doorway z -50.5..-44.5, 9 high over
    // the women's court's floor, y 6). The Rosh's (the chambers outside, open to the court): a wall like the partitions, 12 high, along
    // the court's line (z -67.5, x 93.5..131) with a doorway and its leaves - for this chamber only.
    const dIn = grp("lepersDoorIn", true), dOut = grp("lepersDoorRosh", false);
    {
      const Y = LV.EZN;
      for (const s of [-1, 1]) H2.box(dIn, 0.3, 9, 2.95, M2.cedar, 133.5, Y, -47.5 + s * 1.5);
      H2.wall(dOut, { axis: "x", length: 37.5, height: 12, thickness: 2.5, mat: M2.stoneLight, cx: 112.25, cz: -67.5, y: Y, openings: [{ center: 0, width: 6, height: 9 }] });
      H2.box(dOut, 8.4, 0.9, 3.2, M2.stoneSmooth, 112.25, Y + 9, -67.5);   // the lintel
      for (const s of [-1, 1]) H2.box(dOut, 2.95, 9, 0.3, M2.cedar, 112.25 + s * 1.5, Y, -67.5);
      lbl("דלת לשכת המצורעים — בחירת מודל", 112.25, Y + 14, -67.5, 1.2, "lepersDoorRosh");
      // ROSH_DOORS_211 (stage ב, point 26; the user: V - "Enclose the four like the lepers'"): in the Rosh's reading the other three
      // chambers get the same wall, doorway and leaves on the court's line - the oils' (south-west, mirrored), the wood's (north-east)
      // and the Nazirites' (south-east): each wall from the outer side wall's middle to the inner side wall's face, as the lepers'. A
      // model choice, as that one (the cards say so).
      for (const [wx, wz] of [[112.25, 67.5], [209.75, -67.5], [209.75, 67.5]]) {
        H2.wall(dOut, { axis: "x", length: 37.5, height: 12, thickness: 2.5, mat: M2.stoneLight, cx: wx, cz: wz, y: Y, openings: [{ center: 0, width: 6, height: 9 }] });
        H2.box(dOut, 8.4, 0.9, 3.2, M2.stoneSmooth, wx, Y + 9, wz);
        for (const s of [-1, 1]) H2.box(dOut, 2.95, 9, 0.3, M2.cedar, wx + s * 1.5, Y, wz);
      }
    }
    if (SH.eznChambers && typeof SH.eznChambers.set === "function") {
      const set0 = SH.eznChambers.set.bind(SH.eznChambers);
      SH.eznChambers.set = (m) => { const r = set0(m); const out = SH.eznChambers.mode === "outside"; dIn.visible = !out; dOut.visible = out; return r; };
    }

    // ---------- NORTH_211 (stage ב, point 35; the user: V - "Toggle with the three, each in a colour"): THE NORTH FOR SLAUGHTERING THE MOST HOLY ----------
    // Yoma 36a (107:851): "איזהו צפון — מקיר של מזבח צפוני ועד כותל העזרה, וכנגד כל המזבח כולו צפון, דברי רבי יוסי ברבי יהודה. רבי
    // אלעזר ברבי שמעון מוסיף אף בין האולם ולמזבח. רבי מוסיף אף מקום דריסת רגלי הכהנים ואף מקום דריסת רגלי ישראל. אבל מן החליפות ולפנים
    // הכל מודים שפסול". Rashi (2157:1323-1326): "שלשים ושתים אמה שכנגד המזבח בצפון... אבל שלא כנגד המזבח לצד מערב ולצד מזרח... אינו צפון
    // לשחיטה"; R. Elazar - "כל חלק צפוני לצד מערב" (and 1322: "מחצי פתח ההיכל ולצפון בין האולם למזבח"); Rebbi - "אף כל צפון העזרה
    // שבאחת עשרה אמה של מקום דריסת רגלי הכהנים עד כותל מזרחי של עזרה". Patches on the floor, each opinion's addition in its own colour,
    // cumulative (Rashi 1330: "דרבי נמי אית ליה בין האולם ולמזבח צפון"): green - opposite the altar, from its north face to the wall;
    // blue - between the ulam and the altar, from the middle of the house's door northward; orange - east of the altar to the court's
    // east wall, the same; red - "מן החליפות ולפנים", north of the ulam's wings and the house. Fitted to the altar's place and measures
    // (ctx2.shared.altarPlace, altarMeasures) when shown. The southern line of the two additions - Rashi's (the middle of the court) or the
    // Rambam's square (BHB 5:15-16, to the altar's wall line): NORTH_LINE_211, a switch (setLine). The colours - model choices.
    {
      const NG = grp("northZones", false);
      const Y = LV.KOH, ZN = -67.5;
      // the floor under the patches: the courts' slabs and the steps are long north-south boxes under 24.5 - their tops, by x (the highest
      // of a few samples along z), so that a patch lies on the priests' court (16), on the ulam's steps and on Israel's court (13.5) alike
      let cands = null;
      const collect = () => {
        cands = [];
        const bb = new Box3();
        ctx2.root.updateMatrixWorld(true);
        ctx2.root.traverse((o) => {
          if (!o.isMesh || o.isInstancedMesh || o.isSprite) return;
          for (let q = o; q; q = q.parent) if (q === NG) return;
          if (o.material && o.material.transparent && o.material.opacity < 0.6) return;
          try { bb.setFromObject(o); } catch (_) { return; }
          if (bb.max.y < 12 || bb.max.y > 24.5 || bb.max.z - bb.min.z < 10 || bb.max.x < 10 || bb.min.x > 96) return;
          cands.push({ o, x0: bb.min.x, x1: bb.max.x, z0: bb.min.z, z1: bb.max.z, top: bb.max.y });
        });
      };
      const floorAt = (x) => {
        if (!cands) collect();
        let best = -1;
        for (const c of cands) {
          if (x < c.x0 || x > c.x1) continue;
          let vis = true; for (let q = c.o; q; q = q.parent) if (q.visible === false) { vis = false; break; }
          if (!vis) continue;
          for (const zs of [-60, -40, -20, -6]) if (zs >= c.z0 && zs <= c.z1) { if (c.top > best) best = c.top; break; }
        }
        return best > 0 ? best : Y;
      };
      const mk = (color, op) => {
        const g2 = new Group();
        const pm = new MeshBasicMaterial({ color, transparent: true, opacity: op, depthWrite: false }), fm = new MeshBasicMaterial({ color });
        const unit = new BoxGeometry(1, 1, 1), pool = [];
        NG.add(g2);
        const piece = (i, mat) => { if (!pool[i]) { pool[i] = new Mesh(unit, mat); pool[i].userData.noPick = true; g2.add(pool[i]); } pool[i].visible = true; return pool[i]; };
        return { g: g2, fit(x0, x1, z0, z1, flat) {
          let n = 0;
          const d = z1 - z0, zc = (z0 + z1) / 2;
          const xs = [];
          for (let x = x0; x < x1 - 1e-6; x += 1) xs.push([x, Math.min(x + 1, x1)]);
          xs.forEach(([a, b], i) => {
            const w = b - a, xc = (a + b) / 2, y = flat ? Y : floorAt(xc);
            const p0 = piece(n++, pm); p0.material = pm; p0.scale.set(w, 0.04, d); p0.position.set(xc, y + 0.08, zc);
            for (const zz of [z0, z1]) { const b2 = piece(n++, fm); b2.material = fm; b2.scale.set(w, 0.22, 0.45); b2.position.set(xc, y + 0.13, zz); }
            if (i === 0 || i === xs.length - 1) { const b3 = piece(n++, fm); b3.material = fm; b3.scale.set(0.45, 0.22, d); b3.position.set(i === 0 ? a : b, y + 0.13, zc); }
          });
          for (let i = n; i < pool.length; i++) pool[i].visible = false;
        } };
      };
      const P1 = mk(0x37b24d, 0.38), P2 = mk(0x3a7cff, 0.34), P3 = mk(0xff9124, 0.34), PX = mk(0xe03131, 0.22);
      const L1 = { text: "רבי יוסי ברבי יהודה — כנגד כל המזבח, מקירו הצפוני ועד כותל העזרה", x: 0, y: Y + 2.6, z: 0, size: 1.7, layer: "northZones" };
      const L2 = { text: "רבי אלעזר ברבי שמעון מוסיף — בין האולם ולמזבח", x: 0, y: Y + 2.6, z: 0, size: 1.7, layer: "northZones" };
      const L3 = { text: "רבי מוסיף — מקום דריסת רגלי הכהנים ומקום דריסת רגלי ישראל", x: 0, y: Y + 2.6, z: 0, size: 1.7, layer: "northZones" };
      const LX = { text: "״מן החליפות ולפנים — הכל מודים שפסול״ (יומא לו.)", x: -10, y: Y + 3, z: -58.5, size: 1.6, layer: "northZones" };
      // NORTH_LINE_211 (the user, 15.11.2026 13:35: "גבול הצפון לשתי השיטות כמתג"): the southern line of the two additions - Rashi's, the
      // middle of the court ("מחצי פתח ההיכל ולצפון", 2157:1322), or the Rambam's, the line of the altar's north wall ("מכתל צפוני של
      // עזרה עד כתל המזבח... כל המרבע הזה הוא הנקרא צפון", BHB 5:15-16, 337:90-91); its label by the line, east of the altar
      const L4 = { text: "הגבול הדרומי לרש״י — אמצע העזרה (״מחצי פתח ההיכל ולצפון״)", x: 0, y: Y + 2.0, z: 0, size: 1.2, layer: "northZones" };
      const L5 = { text: "הגבול הדרומי לרמב״ם — קו כותל המזבח (בית הבחירה ה, טו–טז)", x: 0, y: Y + 2.0, z: 0, size: 1.2, layer: "northZonesOff" };
      ctx2.labels.push(L1, L2, L3, LX, L4, L5);
      const moveL = (l, x, z) => {
        const ox = l.x, oz = l.z; l.x = x; l.z = z;
        let lg = null; try { lg = ctx2.root.getObjectByName("labels"); } catch (_) {}
        if (lg) for (const spr of lg.children) if ((spr.userData && spr.userData.label === l) || (Math.abs(spr.position.x - ox) < 1e-3 && Math.abs(spr.position.z - oz) < 1e-3 && Math.abs(spr.position.y - l.y) < 1e-3)) { spr.position.set(l.x, l.y, l.z); break; }
      };
      const N = { mode: "rebbi", line: "rashi", on: false };
      const apply = () => {
        const AP = SH.altarPlace, dz = AP && AP.dz && typeof AP.dz[AP.current] === "number" ? AP.dz[AP.current] : 12.5;
        const yose = SH.altarMeasures && SH.altarMeasures.mode === "yose";
        const ax0 = yose ? 43.5 : 39.5, ax1 = 71.5, aN = -19.5 + dz;   // the base's west and east faces, its north face (the north-east corner fixed for R. Yose's 28)
        const mid = N.line === "rambam" ? aN : 0;   // NORTH_LINE_211
        P1.fit(ax0, ax1, ZN, aN);
        P2.fit(17.5, ax0, ZN, mid);
        P3.fit(ax1, 93.5, ZN, mid);
        PX.fit(-93.5, 17.5, ZN, -50, true);
        moveL(L1, (ax0 + ax1) / 2, (ZN + aN) / 2);
        moveL(L2, (17.5 + ax0) / 2, -24);
        moveL(L3, (ax1 + 93.5) / 2, -24);
        moveL(L4, (ax1 + 93.5) / 2, 1.6);
        moveL(L5, (ax1 + 93.5) / 2, aN + 1.6);
        const k = N.mode === "yose" ? 1 : N.mode === "elazar" ? 2 : 3;
        P1.g.visible = true; P2.g.visible = k >= 2; P3.g.visible = k >= 3; PX.g.visible = true;
        L2.layer = k >= 2 ? "northZones" : "northZonesOff"; L3.layer = k >= 3 ? "northZones" : "northZonesOff";
        L4.layer = k >= 2 && N.line !== "rambam" ? "northZones" : "northZonesOff"; L5.layer = k >= 2 && N.line === "rambam" ? "northZones" : "northZonesOff";
        let lg = null; try { lg = ctx2.root.getObjectByName("labels"); } catch (_) {}
        if (lg) for (const spr of lg.children) { const l = spr.userData && spr.userData.label; if (l === L2 || l === L3 || l === L4 || l === L5) spr.userData.layers = [l.layer]; }
        NG.visible = N.on;
      };
      ctx2.layers.northZonesOff = (() => { const g0 = new Group(); g0.visible = false; return g0; })();
      SH.northZones = { get mode() { return N.mode; }, get line() { return N.line; }, set(m) { N.mode = m === "yose" || m === "elazar" ? m : "rebbi"; apply(); return N.mode; },
        setLine(l) { N.line = l === "rambam" ? "rambam" : "rashi"; apply(); return N.line; } };
      SH.features = SH.features || {};
      SH.features.northZones = { key: "northZones", isOn: () => N.on, on: () => { N.on = true; apply(); }, off: () => { N.on = false; NG.visible = false; } };
      // ZONES_FOLLOW_211 (the function review, F1-09): the zones were laid out for the altar's place and measure of the moment they came on;
      // when a row moved the altar while they showed (the presentation's slides do so), they stayed behind. They follow now.
      { let k0 = ""; if (Array.isArray(ctx2.animated)) ctx2.animated.push(() => { if (!N.on) { k0 = ""; return; } const AP = SH.altarPlace, AM = SH.altarMeasures; const k = (AP ? AP.current : "") + "|" + (AM ? AM.mode : ""); if (k0 && k !== k0) apply(); k0 = k; }); }
    }

    // ---------- TRIBES_211 (stage ב, point 20; the user: V "לסמן גם במודל", and 15.11.2026 17:10 - "יהודה ובנימין אפשרות ב"): THE PORTIONS
    // OF YEHUDAH AND BINYAMIN AND THE STRIP ----------
    // Yoma 12a: "מה היה בחלקו של יהודה — הר הבית, הלשכות והעזרות. ומה היה בחלקו של בנימין — אולם והיכל ובית קדשי הקדשים, ורצועה היתה
    // יוצאה מחלקו של יהודה ונכנסת לחלקו של בנימין, ובה היה מזבח בנוי". Rashi there (2157:332): "צד המזרחי רוחב הר הבית, עזרת נשים כולה,
    // ועזרת ישראל כולה, י״א אמה של מקום רגלי דריסת הכהנים... ושם המזבח מתחיל. משם ולמערב בחלקו של בנימין, אלא שבמקום מושב המזבח
    // יוצאה רצועה מחלקו של יהודה ונכנסה לקרן מזרחית דרומית". Rashi Zevachim 53b (2191:2590-2591): "אמה במזרחו אמה בדרומו... כשמגיע לקרן
    // מזרחית צפונית היתה כלה בסמוך לקרן אמה... כשמגעת לקרן דרומית מערבית כלה בסמוך לקרן אמה"; "והרצועה היתה יוצאה בדרום למזבח ונכנסת
    // בחלקו של בנימין... באה בתוך חלקו של בנימין בדרומו של מזבח, ומזבח אוכל בה אמה". So: the border runs north-south on the line of the
    // altar's east face; east of it, Yehudah's (gold) - the priests' eleven amot, the court of Israel and the women's court (the Temple
    // Mount's east side - a label); west of it, Binyamin's (blue); the strip - Yehudah's - south of the altar, from its south face's inner
    // amah (the SW amah out) to the court's south wall (the user's option ב; how far it reaches south - a model choice, no source says),
    // and the altar's two bands in Yehudah's portion as gold columns (the east amah without its north end's amah, the south amah without
    // its west end's amah). Floors as the north's patches (NORTH_211): the courts at their floors' heights, the rest level. A place's
    // feature (untimed), fitted to the altar's place and measures. The colours - model choices.
    {
      const TG = grp("tribes", false);
      const KY = LV.KOH;
      let cands = null;
      const collect = () => {
        cands = [];
        const bb = new Box3();
        ctx2.root.updateMatrixWorld(true);
        ctx2.root.traverse((o) => {
          if (!o.isMesh || o.isInstancedMesh || o.isSprite) return;
          for (let q = o; q; q = q.parent) if (q === TG) return;
          if (o.material && o.material.transparent && o.material.opacity < 0.6) return;
          try { bb.setFromObject(o); } catch (_) { return; }
          if (bb.max.y < 12 || bb.max.y > 24.5 || bb.max.z - bb.min.z < 10 || bb.max.x < 60 || bb.min.x > 96) return;
          cands.push({ o, x0: bb.min.x, x1: bb.max.x, z0: bb.min.z, z1: bb.max.z, top: bb.max.y });
        });
      };
      const floorAt = (x) => {   // east of the altar: the priests' court (16), the duchan's steps, Israel's court (13.5)
        if (!cands) collect();
        let best = -1;
        for (const c of cands) {
          if (x < c.x0 || x > c.x1) continue;
          let vis = true; for (let q = c.o; q; q = q.parent) if (q.visible === false) { vis = false; break; }
          if (!vis) continue;
          for (const zs of [-60, -40, -20, -6]) if (zs >= c.z0 && zs <= c.z1) { if (c.top > best) best = c.top; break; }
        }
        return best > 0 ? best : KY;
      };
      const unit = new BoxGeometry(1, 1, 1);
      const mk = (color, op) => {
        const g2 = new Group();
        const pm = new MeshBasicMaterial({ color, transparent: true, opacity: op, depthWrite: false }), fm = new MeshBasicMaterial({ color });
        const pool = [];
        TG.add(g2);
        const piece = (i, mat) => { if (!pool[i]) { pool[i] = new Mesh(unit, mat); pool[i].userData.noPick = true; g2.add(pool[i]); } pool[i].visible = true; pool[i].material = mat; return pool[i]; };
        let n = 0;
        return { g: g2, begin() { n = 0; }, end() { for (let i = n; i < pool.length; i++) pool[i].visible = false; },
          // a patch x0..x1 by z0..z1: by its floor (y: a number - level; null - by floorAt, a strip an amah wide), its edges as borders
          fit(x0, x1, z0, z1, y, edges = [1, 1, 1, 1]) {
            const d = z1 - z0, zc = (z0 + z1) / 2, xs = [];
            if (y == null) { for (let x = x0; x < x1 - 1e-6; x += 1) xs.push([x, Math.min(x + 1, x1)]); } else xs.push([x0, x1]);
            xs.forEach(([a, b], i) => {
              const w = b - a, xc = (a + b) / 2, yy = y == null ? floorAt(xc) : y;
              const p0 = piece(n++, pm); p0.scale.set(w, 0.04, d); p0.position.set(xc, yy + 0.08, zc);
              if (edges[0]) { const b2 = piece(n++, fm); b2.scale.set(w, 0.22, 0.45); b2.position.set(xc, yy + 0.13, z0); }
              if (edges[1]) { const b2 = piece(n++, fm); b2.scale.set(w, 0.22, 0.45); b2.position.set(xc, yy + 0.13, z1); }
              if (edges[2] && i === 0) { const b3 = piece(n++, fm); b3.scale.set(0.45, 0.22, d); b3.position.set(a, yy + 0.13, zc); }
              if (edges[3] && i === xs.length - 1) { const b3 = piece(n++, fm); b3.scale.set(0.45, 0.22, d); b3.position.set(b, yy + 0.13, zc); }
            });
          },
          column(x0, x1, z0, z1, y0, y1) { const c = piece(n++, pm); c.scale.set(x1 - x0, y1 - y0, z1 - z0); c.position.set((x0 + x1) / 2, (y0 + y1) / 2, (z0 + z1) / 2); } };
      };
      const YE = mk(0xe39b12, 0.52), YS = mk(0xd98a00, 0.6), BI = mk(0x3d7fd6, 0.42);   // (the courts' floors are bright - stronger than the north's patches)
      const TL1 = { text: "חלקו של יהודה — מקום דריסת רגלי הכהנים, עזרת ישראל ועזרת הנשים (רש״י יומא יב.)", x: 0, y: KY + 2.8, z: 0, size: 1.7, layer: "tribes" };
      const TL2 = { text: "חלקו של בנימין — המזבח, האולם, ההיכל ובית קדשי הקדשים", x: 0, y: KY + 2.8, z: 0, size: 1.7, layer: "tribes" };
      const TL3 = { text: "הרצועה — מחלקו של יהודה, בדרום המזבח ועד כותל העזרה (עד היכן — בחירת מודל)", x: 0, y: KY + 2.4, z: 0, size: 1.5, layer: "tribes" };
      const TL4 = { text: "״מזבח אוכל בחלקו של יהודה אמה״ — במזרח ובדרום; לכן אין יסוד בקרן דרומית מזרחית (זבחים נג:)", x: 0, y: KY + 11.5, z: 0, size: 1.3, layer: "tribes" };
      const TL5 = { text: "הר הבית — צדו המזרחי בחלקו של יהודה (רש״י יומא יב.)", x: 290, y: 2.6, z: -120, size: 3.2, layer: "tribes" };
      ctx2.labels.push(TL1, TL2, TL3, TL4, TL5);
      const moveL = (l, x, z) => {
        l.x = x; l.z = z;
        let lg = null; try { lg = ctx2.root.getObjectByName("labels"); } catch (_) {}
        if (lg) for (const spr of lg.children) if (spr.userData && spr.userData.label === l) spr.position.set(x, spr.position.y, z);
      };
      let on = false;
      const apply = () => {
        const AP = SH.altarPlace, dz = AP && AP.dz && typeof AP.dz[AP.current] === "number" ? AP.dz[AP.current] : 12.5;
        const yose = SH.altarMeasures && SH.altarMeasures.mode === "yose";
        const ax0 = yose ? 43.5 : 39.5, ax1 = 71.5, aN = -19.5 + dz, aS = aN + (yose ? 28 : 32);   // the base's faces (the NE corner fixed for R. Yose's 28)
        const sx0 = ax0 + 1, sz0 = aS - 1, ZS = 67.5, ZN = -67.5;
        YE.begin(); YS.begin(); BI.begin();
        YE.fit(ax1, 93.5, ZN, ZS, null, [1, 1, 1, 0]);                    // Yehudah's: the priests' eleven amot and Israel's court
        YE.fit(96, 231, ZN, ZS, LV.EZN, [1, 1, 0, 1]);                     // and the whole women's court
        YS.fit(sx0, ax1, sz0, ZS, KY, [1, 1, 1, 0]);                       // the strip, from the altar's south inner amah to the wall
        YS.column(ax1 - 1, ax1, aN + 1, aS, KY, KY + 9.3);                 // the altar's east band (its north end's amah out)
        YS.column(sx0, ax1 - 1, aS - 1, aS, KY, KY + 9.3);                 // and its south band (its west end's amah out)
        BI.fit(-93.5, sx0, ZN, ZS, KY, [1, 1, 1, 1]);                      // Binyamin's: west of the strip's line, the whole breadth
        BI.fit(sx0, ax1, ZN, sz0, KY, [1, 1, 0, 1]);                       // and north of the strip, up to the border on the altar's east face
        YE.end(); YS.end(); BI.end();
        moveL(TL1, (ax1 + 93.5) / 2 + 1, -30);
        moveL(TL2, -10, -55);
        moveL(TL3, (sx0 + ax1) / 2, (aS + ZS) / 2 + 6);
        moveL(TL4, ax1 + 1, aS + 1);
        TG.visible = on;
      };
      SH.features = SH.features || {};
      SH.features.tribes = { key: "tribes", timed: false, isOn: () => on, on: () => { on = true; apply(); }, off: () => { on = false; TG.visible = false; } };
      { let k0 = ""; if (Array.isArray(ctx2.animated)) ctx2.animated.push(() => { if (!on) { k0 = ""; return; } const AP = SH.altarPlace, AM = SH.altarMeasures; const k = (AP ? AP.current : "") + "|" + (AM ? AM.mode : ""); if (k0 && k !== k0) apply(); k0 = k; }); }   // ZONES_FOLLOW_211
    }

    // ---------- SIMCHA_MENOROT_211 (stage ב, points 10 / 37; the user: "מאושר" + a demonstration): THE GOLDEN LAMPS OF THE WATER-DRAWING ----------
    // Mishnah Sukkah 5:2-3 (56:52-53): "במוצאי יום טוב הראשון של חג, ירדו לעזרת נשים, ומתקנין שם תקון גדול. ומנורות של זהב היו שם,
    // וארבעה ספלים של זהב בראשיהן, וארבעה סלמות לכל אחד ואחד, וארבעה ילדים מפרחי כהנה ובידיהם כדים של שמן של מאה ועשרים לג, שהן מטילין
    // לכל ספל וספל. מבלאי מכנסי כהנים ומהמיניהן מהן היו מפקיעין, ובהן היו מדליקין, ולא היתה חצר בירושלים שאינה מאירה מאור בית השואבה".
    // Sukkah 52b (108:1355): "תנא: גובהה של מנורה חמשים אמה... ובידיהם כדי שמן של שלשים שלשים לוג, שהם כולם מאה ועשרים לוג"; and
    // (1357) "הכא סולמות, וזקיף טובא" - the ladders stood very upright. Yachin (772:520): "סולם לכל ספל". So here: FOUR lamps (their number
    // is not given - a model choice, the card says so), each a golden shaft fifty amot high with four golden cups at its head, a ladder
    // to each cup, and a young priest (white, the hat and the sash) at each ladder's foot with a jar of oil. The demonstration
    // (ctx2.shared.simchaDemo.start): the sixteen climb, pour, the wicks catch, they come down; the cups stay lit while the lamps are
    // shown. The lamps are not part of the building's everyday state: the feature simchaMenorot (a place's, untimed - they go when
    // another place is chosen), off by default. Their places in the court, the shaft's form, the cups' arms - model choices.
    {
      // SIMCHA_LAMPS_B2 (fix-b2, 22.11.2026 - the user's decisions 39, 45 and 46): the lamps now have a PLACE and a FORM.
      // THE PLACE (SH.simchaLamps.at): "mid" - four in the court, as until now; "corner" - one in each of the four chambers in the corners,
      // which were not roofed ("וארבע לשכות היו בארבע מקצעותיה... ולא היו מקורות", Middot 2:5, 89:16) - set by the roofing row when its
      // reading "in the name of Rav Chaim Kanievsky" is chosen (20-mount.js, ctx2.shared.harRoof.set): "שטח עזרת הנשים היה מקרה, ולכן יש
      // לומר ששמו את המנורות בלשכות שבפנות עזרת נשים, שלא היה להן גג" (the booklet of Sukkot, its list of sources, B201). The spots in
      // the chambers are where a lamp, its four ladders and its young priests stand clear of what each chamber holds (measured on the
      // model; in the wood chamber the ladders go diagonally, between the piles) - model choices.
      // THE FORM (SH.simchaLamps.form; the row "מנורות שמחת בית השואבה — צורתן"): "rashi" (the default) - golden shafts fifty amot high,
      // "לפי שהמנורות גבוהין חמשים אמה... והמנורות עולין למעלה הימנה" (Rashi Sukkah 51a, 2163:2408; Sukkah 52b, 108:1355); "ty" - the
      // Tiferet Yisrael (Yachin Sukkah 5:2, 772:520): "ונ"ל דלא שהיו המנורות של זהב כל כך גבוהות ועבות... אלא שהיו המנורות עומדות על
      // בימות גבוהות כל כך, או סביב שפת הגזוזטרא"; and 5:3 (772:532) "שהמנורות עומדות על כן גבוה נ' אמה" - drawn: a lamp of a few amot
      // on a stand of stone fifty amot high (the stand's form and stone, the lamp's size - model choices; the card names the balcony too).
      // Each place-and-form is a set of its own, built when first shown (SET), and the demonstration below runs the set shown.
      const MG = grp("simchaMenorot", false);
      const Y0 = LV.EZN, RB = 5.6;
      const SPOT = { mid: [[141, -20], [181, -20], [141, 20], [181, 20]], corner: [[106.5, -54.5], [205, -48], [124.5, 49.5], [201.5, 53.5]] };
      const SROT = { mid: [0, 0, 0, 0], corner: [0, Math.PI / 4, 0, 0] };
      const FORM = {
        rashi: { HH: 50, CUPR: 1.7, TOPY: Y0 + 50 - 1.0, cupS: 1 },
        ty: { HH: 50, CUPR: 1.25, TOPY: Y0 + 50 + 3.0, cupS: 0.62 }
      };
      const shaftG = new LatheGeometry([[0, 0], [2.1, 0], [2.1, 0.7], [1.3, 1.0], [0.8, 1.8], [0.66, 8], [0.55, 28], [0.48, 50 - 2.4], [0.9, 50 - 1.8], [0.55, 50 - 1.4], [0.5, 50 - 1.0], [0, 50 - 1.0]].map(([r, y]) => new Vector2(r, y)), 20);
      // the Tiferet Yisrael's lamp: a golden lamp of three amot (its base, a shaft, a knop under the arms) - on the stand's top (y 0 here)
      const tyLampG = new LatheGeometry([[0, 0], [0.62, 0], [0.62, 0.18], [0.38, 0.32], [0.24, 0.6], [0.2, 2.3], [0.42, 2.62], [0.26, 2.84], [0.24, 3.0], [0, 3.0]].map(([r, y]) => new Vector2(r, y)), 18);
      const cupG = new LatheGeometry([[0, 0], [0.3, 0], [0.34, 0.06], [0.62, 0.34], [0.7, 0.55], [0.66, 0.58], [0.58, 0.4], [0.3, 0.14], [0, 0.14]].map(([r, y]) => new Vector2(r, y)), 18);
      const oilM = new MeshStandardMaterial({ color: 0xc9a227, roughness: 0.25, metalness: 0.1 });
      const wickM = new MeshStandardMaterial({ color: 0xf2ecdc, roughness: 0.9, emissive: 0x302b22 });
      // a flame: a soft sprite (additive), drawn once
      const fcv = document.createElement("canvas"); fcv.width = 64; fcv.height = 128;
      {
        const c2 = fcv.getContext("2d"), gr = c2.createRadialGradient(32, 84, 2, 32, 84, 44);
        gr.addColorStop(0, "rgba(255,250,215,1)"); gr.addColorStop(0.3, "rgba(255,196,80,0.95)"); gr.addColorStop(0.65, "rgba(255,120,30,0.45)"); gr.addColorStop(1, "rgba(255,90,10,0)");
        c2.fillStyle = gr; c2.beginPath(); c2.moveTo(32, 4); c2.quadraticCurveTo(60, 70, 52, 100); c2.quadraticCurveTo(32, 126, 12, 100); c2.quadraticCurveTo(4, 70, 32, 4); c2.fill();
      }
      const ftx = new CanvasTexture(fcv); ftx.colorSpace = SRGBColorSpace;
      const hcv = document.createElement("canvas"); hcv.width = hcv.height = 64;
      {
        const c2 = hcv.getContext("2d"), gr = c2.createRadialGradient(32, 32, 0, 32, 32, 32);
        gr.addColorStop(0, "rgba(255,214,120,0.55)"); gr.addColorStop(0.5, "rgba(255,170,60,0.18)"); gr.addColorStop(1, "rgba(255,150,40,0)");
        c2.fillStyle = gr; c2.fillRect(0, 0, 64, 64);
      }
      const htx = new CanvasTexture(hcv); htx.colorSpace = SRGBColorSpace;
      const jarG = new LatheGeometry([[0, 0], [0.16, 0], [0.24, 0.12], [0.25, 0.34], [0.14, 0.52], [0.1, 0.6], [0.13, 0.66], [0, 0.66]].map(([r, y]) => new Vector2(r, y)), 12);
      const jarM = new MeshStandardMaterial({ color: 0xb06a3c, roughness: 0.85 });
      const YS = 1.3;
      const LAMP = { at: "mid", form: "rashi" };
      const SET = {};
      const setKey = (at, form) => "simchaSet_" + at + "_" + form;
      // the sets' groups (empty until first shown) - each a layer of its own, so that its labels show with it
      for (const at of ["mid", "corner"]) for (const form of ["rashi", "ty"]) {
        const G = new Group(); G.name = setKey(at, form); G.visible = at === "mid" && form === "rashi"; MG.add(G);
        ctx2.layers[G.name] = G;
        SET[G.name] = { G, at, form, built: false, flames: [], oils: [], halos: [], youths: [] };
      }
      const buildSet = (S) => {
        if (S.built) return S;
        S.built = true;
        const F = FORM[S.form], CUPR = F.CUPR, RT = CUPR + 0.8, TOPY = F.TOPY, G = S.G;
        const armG = new BoxGeometry(CUPR, 0.22 * (S.form === "ty" ? 0.6 : 1), 0.26 * (S.form === "ty" ? 0.6 : 1)); armG.translate(CUPR / 2, 0, 0);
        const rails = [], rungs = [];
        const railLen = Math.hypot(RB - RT, TOPY - 0.6 - Y0);
        const tilt = Math.atan2(RB - RT, TOPY - 0.6 - Y0);
        SPOT[S.at].forEach(([mx, mz], si) => {
          if (S.form === "rashi") { const sh = new Mesh(shaftG, M2.gold); sh.position.set(mx, Y0, mz); sh.castShadow = true; sh.receiveShadow = true; G.add(sh); }
          else {
            // the stand: a square pillar of stone, its foot and its top wider (model choices), and the golden lamp on it
            const st = H2.box(G, 2.4, F.HH - 1.4, 2.4, M2.stoneLight, mx, Y0 + 0.7, mz); st.castShadow = true;
            H2.box(G, 3.8, 0.7, 3.8, M2.stone, mx, Y0, mz);
            H2.box(G, 3.4, 0.7, 3.4, M2.stone, mx, Y0 + F.HH - 0.7, mz);
            const lp = new Mesh(tyLampG, M2.gold); lp.position.set(mx, Y0 + F.HH, mz); lp.castShadow = true; G.add(lp);
          }
          const r0 = SROT[S.at][si], c0 = Math.cos(r0), s0 = Math.sin(r0);
          [[1, 0], [0, 1], [-1, 0], [0, -1]].map(([a, b]) => [a * c0 - b * s0, a * s0 + b * c0]).forEach(([dx, dz]) => {
            const yaw = Math.atan2(dx, dz);
            const arm = new Mesh(armG, M2.gold); arm.position.set(mx, TOPY - 0.35 * F.cupS, mz); arm.rotation.y = yaw - Math.PI / 2; G.add(arm);
            const cx = mx + dx * CUPR, cz = mz + dz * CUPR;
            const cup = new Mesh(cupG, M2.gold); cup.position.set(cx, TOPY - 0.3 * F.cupS, cz); cup.scale.setScalar(F.cupS); cup.castShadow = true; G.add(cup);
            const oil = new Mesh(new CylinderGeometry(0.6 * F.cupS, 0.6 * F.cupS, 0.03, 16), oilM); oil.position.set(cx, TOPY + 0.12 * F.cupS, cz); oil.visible = false; G.add(oil); S.oils.push(oil);
            const wick = new Mesh(new CylinderGeometry(0.09 * F.cupS, 0.11 * F.cupS, 0.5 * F.cupS, 8), wickM); wick.position.set(cx, TOPY + 0.2 * F.cupS, cz); G.add(wick);
            // LIVE_FIRE_304: the cup burns with the altar's live fire (40-altar.js, ctx2.shared.liveFlame) - "הפתילה העבה ביותר והבעירוה"
            // (the Tiferet Yisrael, 772:518); the soft sprite only where that fire is missing
            const live = typeof SH.liveFlame === "function" ? SH.liveFlame(G, cx, TOPY + 0.42 * F.cupS, cz, 0.36 * F.cupS, 1.3 * F.cupS, 1.0) : null;
            const fl = live || new Sprite(new SpriteMaterial({ map: ftx, transparent: true, depthWrite: false, blending: AdditiveBlending }));
            if (!live) { fl.position.set(cx, TOPY + 1.25 * F.cupS, cz); fl.scale.set(0.9 * F.cupS, 1.8 * F.cupS, 1); fl.renderOrder = 9; G.add(fl); }
            fl.visible = false; fl.userData.noPick = true; fl.userData.ph = S.flames.length * 1.3; fl.userData.k = F.cupS; S.flames.push(fl);
            // the ladder in the plane of the shaft and this cup, its foot RB from the shaft, its head just under the cup
            const ux = mx + dx * (RB + RT) / 2, uz = mz + dz * (RB + RT) / 2, uy = (Y0 + TOPY - 0.6) / 2;
            for (const sd of [-0.5, 0.5]) rails.push([ux + dz * sd, uy, uz - dx * sd, yaw, tilt]);
            for (let h = 0.9; h < TOPY - 0.6 - Y0; h += 0.9) {
              const k = h / (TOPY - 0.6 - Y0), r = RB + (RT - RB) * k;
              rungs.push([mx + dx * r, Y0 + h, mz + dz * r, yaw]);
            }
            S.youthSpots = S.youthSpots || [];
            S.youthSpots.push([mx, mz, dx, dz, si, cx, cz]);
          });
          const halo = new Sprite(new SpriteMaterial({ map: htx, transparent: true, depthWrite: false, blending: AdditiveBlending }));
          halo.position.set(mx, TOPY + 1, mz); halo.scale.set(16, 16, 1); halo.visible = false; halo.userData = { noPick: true }; G.add(halo); S.halos.push(halo);
        });
        {
          const mm = new Matrix4(), q = new Quaternion(), e = new Euler(), vp = new Vector3(), vs = new Vector3(1, 1, 1);
          const rI = new InstancedMesh(new BoxGeometry(0.14, railLen, 0.14), M2.cedar, rails.length);
          rails.forEach(([x, y, z, yaw, t], i) => { e.set(0, 0, 0); q.setFromEuler(e.set(-t, yaw, 0, "YXZ")); mm.compose(vp.set(x, y, z), q, vs); rI.setMatrixAt(i, mm); });
          const gI = new InstancedMesh(new BoxGeometry(1.0, 0.09, 0.09), M2.cedar, rungs.length);
          rungs.forEach(([x, y, z, yaw], i) => { q.setFromEuler(e.set(0, yaw, 0, "YXZ")); mm.compose(vp.set(x, y, z), q, vs); gI.setMatrixAt(i, mm); });
          for (const im of [rI, gI]) { im.instanceMatrix.needsUpdate = true; im.castShadow = false; im.receiveShadow = true; im.userData.noPick = true; G.add(im); }
        }
        // the sixteen young priests, each in a group of his own (it climbs); his face to the shaft, a jar in his hands
        try {
          const PPy = tm_people(ctx2);
          S.youthSpots.forEach(([mx, mz, dx, dz, si, cx, cz], k) => {
            const YG = new Group();
            // SIMCHA_POUR_214 (the user, 16.11.2026 17:23: "השפיכה מאבדת את הכן ושוכפת החוצה"): he climbs ON the ladder, 0.22 out from its
            // rungs all the way, and stops on its highest rung (TOPY - 1.3): the cup at his waist, the jar at his chest
            const foot = [mx + dx * (RB + 0.22), Y0, mz + dz * (RB + 0.22)], top = [mx + dx * (RT + 0.26), TOPY - 1.3, mz + dz * (RT + 0.26)];
            YG.position.set(foot[0], foot[1], foot[2]);
            YG.rotation.y = Math.atan2(-dx, -dz);   // his face to the shaft
            G.add(YG);
            PPy.crowd(YG, [[0, 0, 0]], { y: 0, s: YS, pose: "stand", kind: "kohen", robe: 0xf1ede2, young: true, avnet: false, exact: true, name: "pirchaKehunah" });   // YOUNG_300: "ארבעה ילדים מפרחי כהנה" - dark hair, a short beard (until 2.0.18 white and grey too); fix-b2 (the user's decision 68 (1)): priestly garments without the sash (avnet: false - the kit's, fix-a2)
            const jar = new Mesh(jarG, jarM); jar.position.set(0, 1.05 * YS, 0.36 * YS); jar.castShadow = true; YG.add(jar);
            // the oil's stream from the jar's mouth into the cup (SIMCHA_POUR_214): a thin rod, set every frame of the pouring
            const run = new Mesh(new CylinderGeometry(0.035, 0.05, 1, 8, 1, true).translate(0, -0.5, 0), oilM); run.visible = false; run.userData.noPick = true; G.add(run);
            S.youths.push({ G: YG, jar, foot, top, cup: k, run, cx, cz });
          });
        } catch (_) {}
        S.TOPY = TOPY;
        return S;
      };
      // NOTE 4 (the understandability review, U-42): the labels twice their size; and the demonstration explains itself with captions in
      // the Mishnah's words (Sukkah 5:2-3, 56:52-53), each shown while its part runs. SIMCHA_LAMPS_B2: each set has its own (its layer)
      const CAPT = ["״וארבעה ילדים מפרחי כהנה, ובידיהם כדים של שמן של מאה ועשרים לג״ (סוכה ה, ב)", "״שהן מטילין לכל ספל וספל״ (סוכה ה, ב)", "״ולא היתה חצר בירושלים שאינה מאירה מאור בית השואבה״ (סוכה ה, ג)"];
      const CAPT_T = [[0, 8.5], [8.5, 15.8], [15.8, 23.5]];
      const capL = CAPT.map((c, i) => {
        const gr = new Group(); gr.visible = false; MG.add(gr);
        ctx2.layers["simchaCap" + i] = gr;
        return gr;
      });
      for (const k in SET) {
        const S = SET[k], F = FORM[S.form], TOPY = F.TOPY, [x0, z0] = SPOT[S.at][0];
        ctx2.labels.push({ text: "״ומנורות של זהב היו שם, וארבעה ספלים של זהב בראשיהן״ (סוכה ה, ב)", x: 161, y: TOPY + 6.5, z: 0, size: 3.2, layers: ["simchaMenorot", k] });
        ctx2.labels.push({ text: S.form === "rashi" ? "״גובהה של מנורה חמשים אמה״ (סוכה נב:)" : "״שהמנורות עומדות על כן גבוה נ׳ אמה״ (תפארת ישראל, סוכה ה, ג)", x: x0, y: TOPY + 3.2, z: z0, size: 2.2, layers: ["simchaMenorot", k] });
        if (S.at === "corner") ctx2.labels.push({ text: "המנורות בלשכות שבפינות — ״שלא היה להן גג״ (בשם הגר״ח קניבסקי)", x: 161, y: TOPY + 11, z: 0, size: 2.4, layers: ["simchaMenorot", k] });
        CAPT.forEach((c, i) => ctx2.labels.push(i === 1 ? { text: c, x: x0, y: TOPY + 6.2, z: z0, size: 1.2, layers: ["simchaMenorot", "simchaCap" + i, k] }
                                                      : { text: c, x: 161, y: TOPY - 6, z: 0, size: 3.0, layers: ["simchaMenorot", "simchaCap" + i, k] }));
      }
      const caps = (t) => CAPT_T.forEach((c, i) => { capL[i].visible = t >= c[0] && t < c[1]; });
      // the demonstration's clock (seconds from the start): 0-1.5 stand, 1.5-11.5 climb, 11.5-13.5 pour, 13.5-14.5 the wicks catch, 14.5-23 down
      const ss = (a, b, x) => { const t = Math.max(0, Math.min(1, (x - a) / (b - a))); return t * t * (3 - 2 * t); };
      const D = { t0: -1, lit: false, held: -1, fl: 0 };
      let S = null;   // the set shown
      const cur = () => {
        const k = setKey(LAMP.at, LAMP.form);
        if (!S || S.G.name !== k) {
          if (S) resetSet(S);
          S = buildSet(SET[k]);
          for (const kk in SET) SET[kk].G.visible = kk === k;
        }
        return S;
      };
      // SIMCHA_POUR_214: the jar is lifted to his chest before the pouring and tilted toward the cup: its mouth over the cup's middle;
      // the oil runs from the mouth down into the cup
      const _mo = new Vector3();
      const pose = (t) => {
        const C = cur(), F = FORM[C.form];
        const up = ss(1.5, 11.5, t) * (1 - ss(14.5, 23, t)), pour = Math.sin(Math.PI * Math.max(0, Math.min(1, (t - 11.5) / 2)));
        const lift = ss(10.9, 11.5, t) * (1 - ss(13.5, 14.2, t));
        for (const Y of C.youths) {
          Y.G.position.set(Y.foot[0] + (Y.top[0] - Y.foot[0]) * up, Y.foot[1] + (Y.top[1] - Y.foot[1]) * up, Y.foot[2] + (Y.top[2] - Y.foot[2]) * up);
          Y.jar.rotation.x = 1.3 * pour;
          Y.jar.position.y = (1.05 + 0.36 * lift) * YS;
          const on = pour > 0.35;
          if (Y.run.visible !== on) Y.run.visible = on;
          if (on) {
            Y.G.updateMatrixWorld(true);
            Y.jar.localToWorld(_mo.set(0, 0.66, 0)); C.G.worldToLocal(_mo);
            const yb = F.TOPY + 0.12 * F.cupS;   // the oil's face in the cup
            Y.run.position.copy(_mo);
            Y.run.scale.y = Math.max(0.05, _mo.y - yb);
          }
        }
        C.oils.forEach((o) => { o.visible = t >= 12.3; });
        const lit = (i) => t >= 13.5 + (i % 4) * 0.25;
        C.flames.forEach((f, i) => { f.visible = lit(i); });
        C.halos.forEach((h, i) => { h.visible = t >= 13.6 + i * 0.15; });
        caps(t);
      };
      const resetSet = (C) => { for (const Y of C.youths) { Y.G.position.set(Y.foot[0], Y.foot[1], Y.foot[2]); Y.jar.rotation.x = 0; Y.jar.position.y = 1.05 * YS; Y.run.visible = false; } C.oils.forEach((o) => { o.visible = false; }); C.flames.forEach((f) => { f.visible = false; }); C.halos.forEach((h) => { h.visible = false; }); };
      const reset = () => { caps(-1); D.t0 = -1; resetSet(cur()); };
      // SIMCHA_STOP_211 (the function review, F1-06 / F1-07; U-50): stop / pause / resume / restart, an entry in demoStops, and the two
      // flights fired by the demonstration's own clock. SIMCHA_LAMPS_B2: the first flight goes to the first lamp of the set shown
      const FLY = [[8.5, () => { const C = cur(), [x0, z0] = SPOT[C.at][0], T = FORM[C.form].TOPY; return [[x0 + 11, T + 3, z0 + 13], [x0, T - 4, z0]]; }], [15.8, () => [[215, 60, 80], [161, 30, 0]]]];
      SH.simchaDemo = {
        start() { if (!MG.visible) MG.visible = true; reset(); D.held = -1; D.fl = 0; D.t0 = performance.now() / 1000; },
        running() { return D.t0 >= 0; },
        stop() { D.held = -1; D.fl = 0; reset(); },
        pause() { if (D.t0 >= 0 && D.held < 0) D.held = performance.now() / 1000; },
        resume() { if (D.t0 >= 0 && D.held >= 0) { D.t0 += performance.now() / 1000 - D.held; D.held = -1; } },
        paused() { return D.held >= 0; },
        // SIMCHA_304: the rejoicing's demonstration runs the lamps by its own clock (t < 0: before the climb) - no flights, no labels
        drive(t) { if (!MG.visible) MG.visible = true; D.t0 = -1; D.held = -1; pose(t); caps(-1); },
        clear() { D.held = -1; D.fl = 0; reset(); },
        tex: { flame: ftx, halo: htx }
      };
      // SIMCHA_LAMPS_B2: the place and the form. at(): "mid" | "corner"; spots(): the four lamps' [x, z]; topY(): the cups' height
      SH.simchaLamps = {
        get at() { return LAMP.at; }, get form() { return LAMP.form; },
        spots() { return SPOT[LAMP.at].map((p) => p.slice()); },
        topY() { return FORM[LAMP.form].TOPY; },
        set(o) {
          if (o && (o.at === "mid" || o.at === "corner")) LAMP.at = o.at;
          if (o && (o.form === "rashi" || o.form === "ty")) LAMP.form = o.form;
          const run = D.t0 >= 0;
          cur();
          if (!run) resetSet(S);
          if (ctx2.requestRender) ctx2.requestRender();
          return { at: LAMP.at, form: LAMP.form };
        }
      };
      (SH.demoStops || (SH.demoStops = [])).push({ id: "simcha-lamps", running: () => SH.simchaDemo.running(), stop: () => SH.simchaDemo.stop(),
        pause: () => SH.simchaDemo.pause(), resume: () => SH.simchaDemo.resume(), paused: () => SH.simchaDemo.paused(), restart: () => SH.simchaDemo.start() });
      SH.features = SH.features || {};
      SH.features.simchaMenorot = { key: "simchaMenorot", timed: false, isOn: () => MG.visible, on: () => { MG.visible = true; cur(); }, off: () => { MG.visible = false; reset(); } };
      if (Array.isArray(ctx2.animated)) ctx2.animated.push(() => {
        if (!MG.visible) return;
        const C = cur();
        const now = performance.now() / 1000;
        if (D.t0 >= 0 && D.held < 0) {
          const t = now - D.t0; pose(t);
          while (D.fl < FLY.length && t >= FLY[D.fl][0]) { const f = FLY[D.fl++][1](); try { if (typeof ctx2.flyTo === "function") ctx2.flyTo(f[0], f[1], 1600); } catch (_) {} }
          if (t > 23.5) { D.t0 = -1; caps(-1); }
        }
        for (const f of C.flames) if (f.visible && f.isSprite) { const kk = f.userData.k || 1, k = 0.85 + 0.15 * Math.sin(now * 9 + f.userData.ph) + 0.06 * Math.sin(now * 23 + f.userData.ph * 2); f.scale.set(0.9 * k * kk, 1.8 * (0.9 + 0.2 * k) * kk, 1); }
      });
    }
    // ---------- SHILOACH_305 (the user, 20.11.2026 01:21: "אתה יכול להוסיף את מעיין השילוח [איך היו מגיעים לשם"; 01:25: "1. א 2. זו ----------
    // 3. כהן"): THE SHILOACH AND THE WATER'S LIBATION. "נסוך המים כיצד. צלוחית של זהב מחזקת שלשת לגים היה ממלא מן השלוח. הגיעו לשער
    // המים, תקעו והריעו ותקעו. עלה בכבש ופנה לשמאלו, שני ספלים של כסף היו שם" (Mishnah Sukkah 4:9, book 56, line 48); "ולמה נקרא שמו
    // שער המים. שבו מכניסין צלוחית של מים של נסוך בחג" (Middot 2:6); "שני שערי חלדה מן הדרום, משמשין כניסה ויציאה" (Middot 1:3); "שילוח
    // היה מוציא מים כאיסר" (the Yerushalmi, Sukkah 5:6). No source gives the way out of the mount or how far the spring was: the pool is
    // drawn at the bottom of the model's valley south of the mount (some 220 amot from its wall), the path to it from the western gate of
    // Chulda, its form and the pool's - model choices. Always: the pool, its stream and the path. In the demonstration: a priest with the
    // golden flask goes out by the Water Gate and the gate of Chulda, fills it at the Shiloach and comes back; two priests blow at the
    // Water Gate; he goes up the ramp, turns left and pours into the western bowl (40-altar.js: the bowls at x 43.05 / 43.95, z 9.4 of the
    // altar's frame - "מערבי של מים ומזרחי של יין"). Its walk is the walk engine's (ctx2.shared.walk); the walks are hurried.
    // SH.shiloach = { demo, stop, at(t), info, refs, POOL }.
    {
      const SHL = { POOL: [32, 550], PW: 26, PD: 12, D: null, run: false, SP: { x: 25.5, z: 541.4, zT: 540.92 } };
      const K = SH.priestKit;
      const fnc = (f) => typeof f === "function";
      const smooth = (u) => u * u * (3 - 2 * u), lerp = (a, b, u) => a + (b - a) * u;
      const altDz = () => { const AP = SH.altarPlace; return AP && AP.dz && typeof AP.dz[AP.current] === "number" ? AP.dz[AP.current] : 12.5; };
      const groundY = (x, z, from) => { const y = fnc(SH.floorY) ? SH.floorY(x, from == null ? 40 : from, z) : -Infinity; return isFinite(y) ? y : -28; };
      // ---- always: the pool, its stream and the path (built when the terrain is there: on the first frame)
      const SG = new Group();
      SG.name = "shiloach";
      ctx2.root.add(SG);
      let built = false, Y0 = -55;
      const mStone = new MeshStandardMaterial({ color: 0xbfae8c, roughness: 0.95 }), mStone2 = new MeshStandardMaterial({ color: 0xa8987a, roughness: 0.95 });
      const mWater = new MeshStandardMaterial({ color: 0x3e7fb8, roughness: 0.12, metalness: 0.1, transparent: true, opacity: 0.86 });
      const mStream = new MeshStandardMaterial({ color: 0x8fc3ec, roughness: 0.1, transparent: true, opacity: 0.85 });
      const mPath = new MeshStandardMaterial({ color: 0xcbbd9a, roughness: 1, polygonOffset: true, polygonOffsetFactor: -2, polygonOffsetUnits: -2 });
      const PATH = [[0, 366], [2, 392], [7, 425], [14, 460], [21, 495], [26, 522], [29, 538]];   // from the foot of the western Chulda stairs
      const streamTo = (yb) => { const SP = SHL.SP; if (!SP.st) return; const h = Math.max(0.05, SP.y - yb); SP.st.position.set(SP.x, yb + h / 2, SP.zT); SP.st.scale.y = h; };
      const buildPool = () => {
        if (built) return;
        built = true;
        try { const D0 = buildDemo(); SHL.offF = measure(D0, ARM.fill, FILL_LEAN, 0); SHL.offP = measure(D0, ARM.pour, POUR_LEAN, TILT); } catch (e) { console.warn("[shiloach]", e && e.message); }
        const [px, pz] = SHL.POOL, W2 = SHL.PW / 2, D2 = SHL.PD / 2;
        let lo = Infinity;
        for (const dx of [-W2, 0, W2]) for (const dz of [-D2, 0, D2]) lo = Math.min(lo, groundY(px + dx, pz + dz, 20));
        Y0 = isFinite(lo) ? lo : -55;
        const RIM = Y0 + 1.3, WL = Y0 + 0.95;
        const box = (w, h, d, m, x, y, z) => { const b = new Mesh(new BoxGeometry(w, h, d), m); b.position.set(x, y + h / 2, z); b.castShadow = b.receiveShadow = true; SG.add(b); return b; };
        // the basin's four walls (1 thick), from 1.5 under the ground's lowest point to the rim, and its floor
        box(SHL.PW + 2, RIM - Y0 + 1.5, 1, mStone, px, Y0 - 1.5, pz - D2 - 0.5);
        box(SHL.PW + 2, RIM - Y0 + 1.5, 1, mStone, px, Y0 - 1.5, pz + D2 + 0.5);
        box(1, RIM - Y0 + 1.5, SHL.PD, mStone, px - W2 - 0.5, Y0 - 1.5, pz);
        box(1, RIM - Y0 + 1.5, SHL.PD, mStone, px + W2 + 0.5, Y0 - 1.5, pz);
        box(SHL.PW, 0.2, SHL.PD, mStone2, px, Y0 - 1.6, pz);
        const water = new Mesh(new PlaneGeometry(SHL.PW, SHL.PD).rotateX(-Math.PI / 2), mWater);
        water.position.set(px, WL, pz);
        water.renderOrder = 2;
        SG.add(water);
        // the spring's mouth (the user, 01:56, over the picture of the pouring: "הוא לא מוזג לתוך הספל למה" - and a flask held over a pool
        // that it could not reach would be the same fault): a block of stone on the pool's north side, at the path's end, with a spout
        // toward the path; its thin stream ("כאיסר") falls into a small basin at its foot (the water goes on to the pool under the block).
        // The spout's height: over the mouth of the flask held out under it - measured on the priest's own figure (SHL.offF). Its form - a
        // model choice
        const SP = SHL.SP, gy = groundY(SP.x, SP.z - 0.9, 20), offF = SHL.offF || { y: 1.2 };
        SP.gy = gy;
        SP.y = gy + Math.max(1.15, offF.y + 0.34);   // the spout's tip
        box(2.6, SP.y - gy + 1.15, 1.6, mStone, SP.x, gy - 0.4, SP.z + 0.8);
        const spout = new Mesh(new CylinderGeometry(0.075, 0.095, 0.48, 12), mStone);
        spout.rotation.x = Math.PI / 2;
        spout.position.set(SP.x, SP.y + 0.03, SP.z - 0.24);
        spout.castShadow = true;
        SG.add(spout);
        box(1.4, 0.85, 1.0, mStone2, SP.x, gy - 0.45, SP.z - 0.52);   // the basin
        const bw = new Mesh(new PlaneGeometry(1.15, 0.78).rotateX(-Math.PI / 2), mWater);
        bw.position.set(SP.x, gy + 0.36, SP.z - 0.52);
        SG.add(bw);
        SP.base = gy + 0.36;
        SP.st = new Mesh(new CylinderGeometry(0.026, 0.032, 1, 8, 1, true), mStream);
        SG.add(SP.st);
        streamTo(SP.base);
        // the path: a strip on the ground from the stairs' foot to the steps (sampled every 2 amot, 3.2 wide)
        const pts = [], pos = [], idx = [];
        for (let i = 0; i < PATH.length - 1; i++) { const a = PATH[i], b = PATH[i + 1], n = Math.ceil(Math.hypot(b[0] - a[0], b[1] - a[1]) / 2); for (let k = 0; k < n; k++) pts.push([lerp(a[0], b[0], k / n), lerp(a[1], b[1], k / n)]); }
        pts.push(PATH[PATH.length - 1]);
        pts.forEach((p, i) => {
          const q = pts[Math.min(pts.length - 1, i + 1)], r0 = pts[Math.max(0, i - 1)], dx = q[0] - r0[0], dz = q[1] - r0[1], L = Math.hypot(dx, dz) || 1, nx = -dz / L * 1.6, nz = dx / L * 1.6;
          for (const s of [-1, 1]) { const x = p[0] + s * nx, z = p[1] + s * nz; pos.push(x, groundY(x, z, 20) + 0.06, z); }
          if (i > 0) { const k = 2 * i; idx.push(k - 2, k - 1, k, k - 1, k + 1, k); }
        });
        const pg = new BufferGeometry();
        pg.setAttribute("position", new Float32BufferAttribute(pos, 3));
        pg.setIndex(idx);
        pg.computeVertexNormals();
        const pm = new Mesh(pg, mPath);
        pm.receiveShadow = true;
        SG.add(pm);
        SG.traverse((o) => { if (o.isMesh) o.userData.noPick = true; });
      };
      if (Array.isArray(ctx2.animated)) ctx2.animated.push(() => { if (!built && fnc(SH.floorY)) { try { buildPool(); } catch (e) { console.warn("[shiloach]", e && e.message); built = true; } } });
      (ctx2.labels = ctx2.labels || []).push({ text: "מעיין השילוח", x: SHL.POOL[0], y: -45, z: SHL.POOL[1], size: 4 });
      // ---- the demonstration's people: the priest of the water and two with trumpets (the kit's priest; his arms and feet move)
      const FIG = (() => {
        if (!K) return null;
        const FS = K.FS, sc = (q, s) => q.scale(s, s, s), W1 = (q) => K.white(q);
        const P = { sx: K.SH_X * FS, sy: K.SH_Y * FS, up: K.UP * FS, fo: K.FORE * FS };
        const upP = sc(mergeGeometries([W1(K.sph(0.07, 0.07, 0.07, 14, 10)), W1(K.at(new CylinderGeometry(0.07, 0.058, P.up / FS, 14), 0, -P.up / FS / 2, 0)),
          W1(K.at(K.sph(0.058, 0.058, 0.058, 12, 8), 0, -P.up / FS, 0))]), FS);
        const foP = sc(W1(K.at(new CylinderGeometry(0.056, 0.046, P.fo / FS, 14), 0, -P.fo / FS / 2, 0)), FS);
        const hand = { 1: sc(K.at(K.handRaw(1), 0, -(P.fo / FS + 0.045), 0), FS), "-1": sc(K.at(K.handRaw(-1), 0, -(P.fo / FS + 0.045), 0), FS) };
        const foot = { 1: sc(K.footGeo(1).translate(-0.1, 0, 0), FS), "-1": sc(K.footGeo(-1).translate(0.1, 0, 0), FS) };
        const neck = sc(K.at(new CylinderGeometry(0.066, 0.072, 0.09, 12), 0, 1.925, 0), 1);
        return { P, upP, foP, hand, foot, neck };
      })();
      const mkPriest = (n) => {
        const FS = K.FS, g = new Group(), lean = new Group(), S = new Group();
        g.add(lean);
        S.scale.setScalar(FS);
        lean.add(S);
        const add = (par, geo, mat) => { const m = new Mesh(geo, mat); m.castShadow = true; m.userData.noPick = true; par.add(m); return m; };
        add(S, K.gRobeBody, K.mRobe);
        add(S, FIG.neck, K.mSkin);
        const sash = add(S, K.gSash, (SH.tamid && SH.tamid.belt === "white") ? K.mSashWhite : K.mSashDyed);
        const hg = K.headOn(S, K.HEAD_Y, K.mBeards[n % K.mBeards.length], n);
        hg.traverse((m) => { if (m.isMesh) m.userData.noPick = true; });
        add(S, K.gHat, K.mHat).position.y = K.HAT_Y;
        const arm = (side) => {
          const sh = new Group();
          sh.position.set(side * FIG.P.sx, FIG.P.sy, 0);
          lean.add(sh);
          add(sh, FIG.upP, K.mRobe);
          const el = new Group();
          el.position.y = -FIG.P.up;
          sh.add(el);
          add(el, FIG.foP, K.mRobe);
          add(el, FIG.hand[side], K.mSkin);
          const grip = new Group();
          grip.position.set(0, -(FIG.P.fo + 0.08), 0.03);
          el.add(grip);
          return { sh, el, grip };
        };
        const L = arm(1), R = arm(-1);
        const fl = add(g, FIG.foot[1], K.mSkin), fr = add(g, FIG.foot[-1], K.mSkin);
        fl.position.x = 0.1 * FS;
        fr.position.x = -0.1 * FS;
        g.visible = false;
        return { g, lean, L, R, fl, fr, sash };
      };
      const setArm = (A2, v, side) => { A2.sh.rotation.set(v[0], 0, side * v[1]); A2.el.rotation.set(v[2], 0, 0); };
      const ARM = { rest: [0.05, 0.08, -0.15], carry: [-0.25, 0.1, -0.85], fill: [-1.05, 0.12, -0.35], pour: [-1.2, 0.1, -0.55], tR: [-1.42, 0.05, -0.2], tL: [-1.28, -0.06, -0.38] };
      const buildDemo = () => {
        if (SHL.D) return SHL.D;
        const DG = new Group();
        DG.name = "shiloachDemo";
        DG.visible = false;
        ctx2.root.add(DG);
        const p = mkPriest(2), t1 = mkPriest(4), t2 = mkPriest(6);
        for (const f of [p, t1, t2]) DG.add(f.g);
        // the golden flask (its form - a model choice), in his right hand
        const gold = new MeshStandardMaterial({ color: 0xd8ad45, metalness: 0.9, roughness: 0.28 });
        const flask = new Mesh(new LatheGeometry([[0.001, 0], [0.07, 0], [0.105, 0.05], [0.11, 0.12], [0.07, 0.21], [0.032, 0.25], [0.04, 0.3], [0.001, 0.3]].map(([r, y]) => new Vector2(r, y)), 18), gold);
        flask.castShadow = true;
        flask.userData.noPick = true;
        flask.position.set(0, -0.2, 0.02);
        p.R.grip.add(flask);
        const fwater = new Mesh(new CylinderGeometry(0.035, 0.05, 1, 8, 1, true), new MeshStandardMaterial({ color: 0x7fc0f0, transparent: true, opacity: 0.8, roughness: 0.1 }));
        fwater.visible = false;
        DG.add(fwater);
        // the silver trumpets (Numbers 10:2), one for each of the two, from his mouth forward and up
        const silver = new MeshStandardMaterial({ color: 0xe6e6ea, metalness: 0.85, roughness: 0.25, side: DoubleSide });
        for (const f of [t1, t2]) {
          const tr = new Group();
          const tube = new Mesh(new CylinderGeometry(0.022, 0.026, 1.25, 10), silver);
          tube.position.y = 0.625;
          const bell = new Mesh(new CylinderGeometry(0.16, 0.03, 0.26, 16, 1, true), silver);
          bell.position.y = 1.36;
          tr.add(tube, bell);
          tr.position.set(0, K.HEAD_Y * K.FS - 0.17, 0.14);
          tr.rotation.x = 1.25;
          tr.traverse((m) => { if (m.isMesh) { m.castShadow = true; m.userData.noPick = true; } });
          f.lean.add(tr);
        }
        SHL.D = { DG, p, t1, t2, flask, fwater, ys: new Map() };
        return SHL.D;
      };
      // ---- the ways (each [x, z] in the world; the floor under them read once, from a height near it)
      const AW = (x, lz) => [x, lz + altDz()];   // in the altar's frame (the opinions table moves it)
      const yAt = (D2, x, z, near) => { const k = Math.round(x * 4) + "," + Math.round(z * 4) + "," + Math.round(near); let y = D2.ys.get(k); if (y === undefined) { y = groundY(x, z, near + 2.6); D2.ys.set(k, y); } return y; };
      const plen = (pts) => { let L = 0; for (let i = 1; i < pts.length; i++) L += Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]); return L; };
      const along = (pts, u) => {   // the point at fraction u of the way, and the way's heading there
        const L = plen(pts) * clamp(u, 0, 1);
        let acc = 0;
        for (let i = 1; i < pts.length; i++) {
          const a = pts[i - 1], b = pts[i], l = Math.hypot(b[0] - a[0], b[1] - a[1]);
          if (acc + l >= L || i === pts.length - 1) { const f = l > 0 ? clamp((L - acc) / l, 0, 1) : 0; return [lerp(a[0], b[0], f), lerp(a[1], b[1], f), Math.atan2(b[0] - a[0], b[1] - a[1])]; }
          acc += l;
        }
        return [pts[0][0], pts[0][1], 0];
      };
      // the beats (demo seconds; the walk engine runs them at ctx2.shared.demoSlow)
      const T = { out1: 4.6, gate1: 8.6, stairs1: 11.8, path1: 17.6, rim1: 18.8, fill0: 19.6, fill1: 22.6, back0: 23.6,
        back1: 30.2, wg0: 32.4, wg1: 35.8, blow0: 36.0, blow1: 40.2, in1: 44.2, ramp1: 48.6, top1: 51.4, pour0: 52.0, pour1: 55.6, end: 58.2 };
      // the flask: upright in the world, its neck in his hand; tilted forward to pour. Its mouth - where the streams begin and end
      const FILL_LEAN = 0.1, POUR_LEAN = 0.08, TILT = 1.62;
      const QG = new Quaternion(), QT = new Quaternion(), AX = new Vector3(), NECK = new Vector3(0, -0.21, 0), MOUTH = new Vector3(0, 0.3, 0), V1 = new Vector3();
      const setFlask = (D2, tilt, yaw) => {
        const f = D2.flask;
        D2.p.g.updateMatrixWorld(true);
        D2.p.R.grip.getWorldQuaternion(QG).invert();
        QT.setFromAxisAngle(AX.set(Math.cos(yaw), 0, -Math.sin(yaw)), tilt);
        f.quaternion.copy(QG).multiply(QT);
        f.position.copy(NECK).applyQuaternion(QT).applyQuaternion(QG);
        f.updateMatrixWorld(true);
      };
      const mouthW = (D2, out) => D2.flask.localToWorld(out.copy(MOUTH));
      const measure = (D2, arm, lean, tilt) => {   // the flask's mouth from his feet, his face to +z
        const p = D2.p;
        p.g.position.set(0, 0, 0);
        p.g.rotation.y = 0;
        p.lean.position.set(0, 0, 0);
        p.lean.rotation.x = lean;
        setArm(p.R, arm, -1);
        setFlask(D2, tilt, 0);
        const m = mouthW(D2, new Vector3()), o = p.g.getWorldPosition(new Vector3());
        return { x: m.x - o.x, y: m.y - o.y, z: m.z - o.z };
      };
      // the ways (each [x, z] in the world; the floor under them read once, from a height near it). The Water Gate's landing (y 13.5,
      // x -24..-12) has its stair down to the east (to y 0 at x 2) and the soreg its opening before the gate (x -19..-17, z 80)
      const BOWL = () => AW(43.05, 9.4);   // the western bowl, of the water
      const bowlY = () => { const B = BOWL(), k = Math.round(B[1] * 10); if (SHL.byK !== k) { SHL.byK = k; SHL.by = groundY(B[0], B[1], 40); } return SHL.by; };
      const standF = () => { const SP = SHL.SP, o = SHL.offF || { x: 0, z: 0.9 }; return [SP.x - o.x, SP.zT - o.z]; };   // the flask's mouth under the spout
      const standP = () => { const B = BOWL(), o = SHL.offP || { x: 0, z: 0.9 }; return [B[0] - o.x, B[1] - o.z]; };   // the flask's mouth over the bowl
      const WAYS = () => {
        const G_IN = [-18, 60.5], G_OUT = [-18, 72.6], TOPS = [-12, 72.6], FOOT = [2.6, 72.6];
        return [
          { pts: [G_IN, [-18, 66.5], G_OUT, TOPS, FOOT], t: [0.6, T.out1], near: 16 },
          { pts: [FOOT, [3.4, 77.6], [-18, 78], [-18, 84], [-12, 150], [0, 305], [0, 335.5]], t: [T.out1, T.gate1], near: 1, hide: true },   // (not seen: the soreg's opening, the mount, the gate of Chulda)
          { pts: [[0, 335.5], [0, 364.5]], t: [T.gate1, T.stairs1], stairs: [0.2, -28] },
          { pts: PATH.slice(), t: [T.stairs1, T.path1], terrain: true },
          { pts: [PATH[PATH.length - 1], standF()], t: [T.path1, T.rim1], terrain: true, endYaw: 0 },   // his face to the spout
          { pts: [standF()].concat(PATH.slice().reverse()), t: [T.back0, T.back0 + 4.6], terrain: true },
          { pts: [[0, 364.5], [0, 335.5]], t: [T.back0 + 4.6, T.back1], stairs: [-28, 0.2] },
          { pts: [[0, 335.5], [0, 305], [-12, 150], [-18, 84], [-18, 78], [3.6, 77.4]], t: [T.back1 + 0.1, T.wg0], near: 1, hide: true },
          { pts: [[3.6, 77.4], FOOT, TOPS, [-16.6, 72.6], G_OUT], t: [T.wg0, T.wg1], near: 16, endYaw: Math.PI },   // up to the gate, his face to it
          // in the court: north of the chambers along its south wall (from z 54) and of the laver (x 22, z 57), to the ramp's foot (z 54)
          { pts: [G_OUT, [-18, 64], [-18, 59], [-8, 54.5], [30, 53.2], [46, 53.2], AW(57.4, 41.2)], t: [T.blow1, T.in1], near: 16 },
          { pts: [AW(57.4, 41.2), AW(57.4, 18.5)], t: [T.in1, T.ramp1], ramp: true },
          { pts: [AW(57.4, 18.5), AW(57.0, 12.6), AW(50.8, 9.8), AW(46.6, 8.4), standP()], t: [T.ramp1, T.top1], near: 25, endYaw: 0 }   // "ופנה לשמאלו"; his face to the bowls
        ];
      };
      const placeOn = (D2, f, w, t, carry) => {   // the figure on way w at second t: its place, heading, height and the step
        const u = (t - w.t[0]) / Math.max(1e-3, w.t[1] - w.t[0]), q = along(w.pts, u);
        let y;
        if (w.stairs) y = lerp(w.stairs[0], w.stairs[1], clamp(u, 0, 1));
        else if (w.terrain) y = yAt(D2, q[0], q[1], 20);
        else if (w.ramp) y = yAt(D2, q[0], q[1], 30);
        else y = yAt(D2, q[0], q[1], w.near);
        f.g.position.set(q[0], y, q[1]);
        f.g.rotation.y = u >= 1 && w.endYaw != null ? w.endYaw : q[2];
        const walking = u > 0 && u < 1, ph = t * 9;
        f.fl.position.z = walking ? 0.17 * Math.sin(ph) : 0;
        f.fr.position.z = walking ? -0.17 * Math.sin(ph) : 0;
        f.lean.position.y = walking ? Math.abs(Math.cos(ph)) * 0.035 : 0;
        setArm(f.L, walking ? [0.3 * Math.sin(ph), 0.08, -0.25] : ARM.rest, 1);
        setArm(f.R, carry ? ARM.carry : walking ? [-0.3 * Math.sin(ph), 0.08, -0.25] : ARM.rest, -1);
        return u;
      };
      const apply = (t) => {
        const D2 = buildDemo(), WS = WAYS(), p = D2.p;
        // the priest: which way he is on at this second (between them he stands where the last left him; on a hidden one he is not seen)
        let cur = null;
        for (const w of WS) if (t >= w.t[0] - 0.01) cur = w;
        p.g.visible = !!cur && !cur.hide && t < T.end;
        if (cur) placeOn(D2, p, cur, Math.min(t, cur.t[1]), true);
        const yaw = p.g.rotation.y;
        p.lean.rotation.x = 0;
        // filling under the spring's stream (the flask upright, its mouth under the spout)
        let fillK = 0, pourK = 0;
        if (t >= T.fill0 && t < T.back0) {
          fillK = smooth(clamp((t - T.fill0) / 0.6, 0, 1)) * (1 - smooth(clamp((t - T.fill1) / 0.6, 0, 1)));
          setArm(p.R, ARM.carry.map((v, i) => lerp(v, ARM.fill[i], fillK)), -1);
          p.lean.rotation.x = FILL_LEAN * fillK;
        }
        // pouring into the western bowl, his hand raised ("ולמנסך אומרים לו, הגבה ידך")
        if (t >= T.pour0 && t < T.end) {
          pourK = smooth(clamp((t - T.pour0) / 0.6, 0, 1)) * (1 - smooth(clamp((t - T.pour1) / 0.6, 0, 1)));
          setArm(p.R, ARM.carry.map((v, i) => lerp(v, ARM.pour[i], pourK)), -1);
          p.lean.rotation.x = POUR_LEAN * pourK;
        }
        setFlask(D2, TILT * pourK, yaw);
        // the streams: the spring's ends in the flask while he holds it there; the flask's falls into the bowl
        const m = mouthW(D2, V1);
        streamTo(fillK > 0.9 && p.g.visible ? m.y + 0.02 : (SHL.SP.base || 0));
        D2.fwater.visible = false;
        if (pourK > 0.92 && p.g.visible) {
          const by = bowlY(), h = Math.max(0.05, m.y - by);
          D2.fwater.visible = true;
          D2.fwater.position.set(m.x, by + h / 2, m.z);
          D2.fwater.scale.y = h;
        }
        // the two with trumpets at the Water Gate: on its landing, either side of the way in
        const tOn = t >= T.wg0 && t < T.in1 + 1;
        for (const [f, x] of [[D2.t1, -21.4], [D2.t2, -14.4]]) {
          f.g.visible = tOn;
          if (!tOn) continue;
          f.g.position.set(x, yAt(D2, x, 74.0, 13.5), 74.0);
          f.g.rotation.y = x < -18 ? 0.35 : -0.35;   // their faces out, to the chel, a little toward the way in
          const up = smooth(clamp((t - T.blow0 + 0.6) / 0.5, 0, 1)) * (1 - smooth(clamp((t - T.blow1) / 0.5, 0, 1)));
          setArm(f.R, ARM.rest.map((v, i) => lerp(v, ARM.tR[i], up)), -1);
          setArm(f.L, ARM.rest.map((v, i) => lerp(v, ARM.tL[i], up)), 1);
          f.lean.children[f.lean.children.length - 1].visible = up > 0.3;   // the trumpet
        }
      };
      // ---- the eye (keys [t, eye, look], demo seconds) and the words
      const keys = () => {
        const wy = Y0, SP = SHL.SP, sf = standF(), sy = SP.gy != null ? SP.gy : wy;
        const A1 = AW(57.4, 30), B = BOWL();
        return [
          [0, [4, 21, 94], [-17, 15, 70]], [T.out1, [9, 14, 92], [-3, 5, 74]],
          // over the mount (above the roof of the royal stoa, 37.5) to the outside of the gate of Chulda
          [T.out1 + 1.6, [10, 95, 200], [6, 0, 360]], [T.gate1 - 1.0, [24, 40, 384], [2, -4, 338]],
          [T.gate1, [22, 10, 352], [0, -6, 340]], [T.stairs1, [24, -6, 380], [0, -24, 360]],
          [T.path1 - 2.2, [44, wy + 22, 470], [20, wy + 4, 515]],
          [T.rim1, [sf[0] - 5.2, sy + 2.9, sf[1] - 2.0], [sf[0] + 0.3, sy + 1.3, sf[1] + 0.8]], [T.fill1, [sf[0] - 4.8, sy + 2.7, sf[1] - 1.6], [sf[0] + 0.3, sy + 1.25, sf[1] + 0.85]],
          [T.back0 + 1.0, [sf[0] - 6, sy + 10, sf[1] - 6], [sf[0] + 4, sy - 2, sf[1] - 30]], [T.back0 + 2.6, [40, wy + 34, 600], [12, -24, 420]],
          [T.back1 - 0.6, [22, 4, 384], [0, -6, 345]],
          // up over the wall and the mount again, to the Water Gate
          [T.back1 + 0.5, [22, 42, 372], [0, 0, 330]], [T.back1 + 1.4, [10, 48, 220], [-10, 0, 100]],
          [T.wg0 + 0.2, [10, 16, 96], [-4, 6, 74]], [T.wg1 - 0.4, [-30, 18, 86], [-17, 15.2, 73]], [T.blow1, [-32, 17.6, 84], [-17, 15.3, 73.2]],
          // over the court's wall (40.9) into the court, to the ramp
          [T.blow1 + 1.0, [-4, 52, 80], [-14, 16, 63]], [T.in1 - 0.8, [38, 30, 44], [56, 18, 50]], [T.ramp1 - 1.0, [38, 31, A1[1] - 8.5], [56, 23, A1[1] - 12.5]],
          [T.top1, [40, 31, B[1] + 11], [B[0] + 3, 25.5, B[1] - 1]], [T.pour0 + 0.8, [48.6, 29.4, B[1] + 8.6], [B[0] + 0.3, 26.2, B[1] - 0.4]],
          [T.end, [48.2, 29.2, B[1] + 8.2], [B[0] + 0.2, 26.1, B[1] - 0.3]]
        ];
      };
      const caps = [
        [0, "״נסוך המים כיצד. צלוחית של זהב מחזקת שלשת לגים היה ממלא מן השלוח״ (סוכה ד, ט)"],
        [T.gate1 - 0.8, "״שני שערי חלדה מן הדרום, משמשין כניסה ויציאה״ (מידות א, ג)"],
        [T.stairs1, "אל השילוח — הדרך ומקום המעיין בחירת מודל: אין מקור שמתאר אותם"],
        [T.rim1 - 0.4, "״היה ממלא מן השלוח״ (סוכה ד, ט); ״שילוח היה מוציא מים כאיסר״ (ירושלמי סוכה ה, ו)"],
        [T.back0 + 0.6, "בחזרה — דרך שערי חלדה ושער המים"],
        [T.wg0, "״הגיעו לשער המים, תקעו והריעו ותקעו״ (סוכה ד, ט). ״ולמה נקרא שמו שער המים. שבו מכניסין צלוחית של מים של נסוך בחג״ (מידות ב, ו)"],
        [T.in1 - 0.4, "״עלה בכבש ופנה לשמאלו, שני ספלים של כסף היו שם״ (סוכה ד, ט)"],
        [T.pour0 - 0.6, "״מערבי של מים, מזרחי של יין״; ״ולמנסך אומרים לו, הגבה ידך״ (סוכה ד, ט)"]
      ];
      const finish = () => {
        SHL.run = false;
        if (SHL.D) SHL.D.DG.visible = false;
        streamTo(SHL.SP.base || 0);
        const sv = SHL.saved;
        if (sv && sv.lg) sv.lg.visible = sv.labels;
        if (sv && sv.view && SH.viewLimits) SH.viewLimits.set(sv.view);   // the view's limits as they were
        delete SH.camLow;
        SHL.saved = null;
      };
      const start = () => {
        const Wk = SH.walk;
        if (!Wk || !K || !FIG) return false;
        buildPool();
        const D2 = buildDemo();
        if (fnc(SH.stopDemos)) SH.stopDemos("shiloachDemo");
        for (const f of [D2.p, D2.t1, D2.t2]) f.sash.material = (SH.tamid && SH.tamid.belt === "white") ? K.mSashWhite : K.mSashDyed;
        let lg = null;
        try { lg = ctx2.root.getObjectByName("labels"); } catch (_) {}
        SHL.saved = { lg, labels: lg ? lg.visible : true, view: SH.viewLimits ? SH.viewLimits.get() : null };
        if (lg) lg.visible = false;
        // the eye goes down to the Shiloach, far from the mount and under its ground: the view's limits are widened for the walk
        if (SH.viewLimits) SH.viewLimits.include([SHL.POOL[0], Y0 - 1, SHL.POOL[1] + 10]);
        SH.camLow = Y0 - 3;
        D2.DG.visible = true;
        SHL.run = true;
        apply(0);
        Wk.run(keys(), caps, finish);
        return true;
      };
      const stop = () => { if (!SHL.run) return; const Wk = SH.walk; if (Wk && Wk.on) Wk.stop(); else finish(); };
      let sndT = -1;
      if (Array.isArray(ctx2.animated)) ctx2.animated.push(() => {
        if (!SHL.run) { sndT = -1; return; }
        const Wk = SH.walk, t = Wk && fnc(Wk.now) ? Math.max(0, Wk.now()) : 0;
        try { apply(t); } catch (e) { console.warn("[shiloach]", e && e.message); }
        try {
          if (sndT >= 0 && t > sndT && fnc(SH.sfx)) {
            if (sndT < T.fill0 + 0.4 && t >= T.fill0 + 0.4) SH.sfx("water", { dur: 2.2, gain: 0.7 });
            if (sndT < T.blow0 && t >= T.blow0) SH.sfx("trumpets");
            if (sndT < T.pour0 + 0.5 && t >= T.pour0 + 0.5) SH.sfx("water", { dur: 2.0, gain: 0.6 });
          }
        } catch (_) {}
        sndT = t;
      });
      const walkEntry = () => (SH.demoStops || []).find((q) => q.id === "walk");
      (SH.demoStops || (SH.demoStops = [])).push({ id: "shiloachDemo", running: () => SHL.run, stop,
        pause: () => { const w = walkEntry(); if (w) w.pause(); }, resume: () => { const w = walkEntry(); if (w) w.resume(); },
        paused: () => { const w = walkEntry(); return !!(w && w.paused()); }, restart: () => { stop(); start(); } });
      const INFO = "**המשנה** (סוכה ד, ט): ״נסוך המים כיצד. צלוחית של זהב מחזקת שלשת לגים היה ממלא מן השלוח. הגיעו לשער המים, תקעו והריעו ותקעו. עלה בכבש ופנה לשמאלו, שני ספלים של כסף היו שם... מערבי של מים, מזרחי של יין... ולמנסך אומרים לו, הגבה ידך״; ובשבת (שם, י): ״היה ממלא מערב שבת חבית של זהב שאינה מקדשת, מן השלוח, ומניחה בלשכה״.\n" +
        "**שער המים** (מידות ב, ו): ״ולמה נקרא שמו שער המים. שבו מכניסין צלוחית של מים של נסוך בחג. רבי אליעזר בן יעקב אומר, ובו המים מפכים, ועתידין להיות יוצאין מתחת מפתן הבית״; וכן בתוספתא (סוכה ג, ג).\n" +
        "**שערי חולדה** (מידות א, ג): ״שני שערי חלדה מן הדרום, משמשין כניסה ויציאה״.\n" +
        "**השילוח** — תני, רבן שמעון בן גמליאל אומר: ״שילוח היה מוציא מים כאיסר. אמרו: נרחיבנו וירבו מימיו. הרחיבוהו ונתמעטו מימיו. חזרו וגדרוהו וחזר לכמות שהיה״ (ירושלמי סוכה ה, ו).\n" +
        "**במודל:** אין מקור שמתאר את הדרך מהמקדש אל השילוח ואת מרחקו. הבריכה מצוירת בתחתית העמק שבדרום ההר, כמאתיים ועשרים אמה מחומתו, והשביל אליה יוצא משער חולדה המערבי — בחירת מודל. צורת הבריכה, מוצא המעיין (אבן עם צינור שהמים יורדים ממנו), צורת הצלוחית ושני התוקעים — בחירות מודל. בהדגמה הכהן ממלא את הצלוחית מתחת לזרם היוצא מן המעיין, ומנסך ביד מורמת לתוך הספל המערבי. ההליכה בהדגמה מואצת, ובשני מקומות היא מדולגת (בדרך על פני הר הבית).";
      const REFS = [["סוכה ד, ט", { book: 56, index: 48 }], ["סוכה ד, י", { book: 56, index: 49 }], ["מידות ב, ו", "Mishnah_Middot.2.6"], ["מידות א, ג", "Mishnah_Middot.1.3"]];
      SH.shiloach = { demo: start, stop, T, info: INFO, refs: REFS, POOL: SHL.POOL, at: (t) => { buildPool(); const D2 = buildDemo(); D2.DG.visible = true; apply(t); return { Y0 }; },
        leave: () => { if (SHL.D) SHL.D.DG.visible = false; }, dbg: () => ({ offF: SHL.offF, offP: SHL.offP, SP: { x: SHL.SP.x, y: SHL.SP.y, gy: SHL.SP.gy, zT: SHL.SP.zT }, standF: standF(), standP: standP(), bowl: BOWL(), bowlY: bowlY() }) };
      SH.modelButtons = SH.modelButtons || [];
      SH.modelButtons.push({
        id: "shiloachDemo", label: "הדגמה: ניסוך המים — מן השילוח", labelOn: "עצור את ההדגמה", maxDist: 140,
        title: "״צלוחית של זהב מחזקת שלשת לגים היה ממלא מן השלוח. הגיעו לשער המים, תקעו והריעו ותקעו״ (סוכה ד, ט). ההדגמה: כהן יוצא בשער המים ובשער חולדה, ממלא מן השילוח, חוזר, ומנסך בספל המערבי.",
        anchor: () => [SHL.POOL[0], Y0 + 9, SHL.POOL[1]],
        get: () => SHL.run,
        set: (on) => { if (on) start(); else stop(); }
      });
    }
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
      // the golden lamps (above) - SIMCHA_LAMPS_B2: where they stand now (in the court, or in the corner chambers with the roofing "in the
      // name of Rav Chaim Kanievsky"); the crowd is laid out round them, and laid out again when they move (B.crowdKey)
      const lampSpots = () => (SH.simchaLamps && typeof SH.simchaLamps.spots === "function" ? SH.simchaLamps.spots() : [[141, -20], [181, -20], [141, 20], [181, 20]]);
      const lampKey = () => JSON.stringify(lampSpots()) + "|" + (SH.eznRoof && SH.eznRoof.on ? "r" : "");
      const DR = 8.2, NDANCE = 14;
      // ---- MUSICIANS_305 (the user, 21:08: "צריך גם לעשות את הלוויים מנגנים... אם הם מנגנים, לא יכולים לעמוד כמו פסלים"; 21:10:
      // "ידיים של הכוהנים תופסות את החצוצרה, אי אפשר בלי"): THE MUSICIANS' KIT. A musician is a figure of tm_people without its own
      // arms (crowd o.arms: false); every frame his arms (PP.rig) and his instrument are set: the instrument in his hands, the hands at
      // their work in time with the music, the body swaying a little with it. All in the figure's own units (its scale 1.4 - an amah
      // is 0.714; the face to +z, the left at +x). Until 2.0.13 the Levites and the flutes stood still, their instruments standing
      // before them, and the priests' trumpets moved before their mouths without hands. The instruments' forms and the motions -
      // model choices.
      const MUS = (() => {
        const UA = 0.32, FA = 0.29, HL = 0.075;   // the upper arm, the forearm (to the wrist), the wrist to the middle of the fingers
        const SHL = new Vector3(0.25, 1.718, 0), SHR = new Vector3(-0.25, 1.718, 0);
        const cyl = (r0, r1, a, b, n = 6) => {   // a tube from a to b
          const d = new Vector3(b[0] - a[0], b[1] - a[1], b[2] - a[2]), L = d.length();
          const q = new CylinderGeometry(r1, r0, L, n);
          q.applyQuaternion(new Quaternion().setFromUnitVectors(new Vector3(0, 1, 0), d.normalize()));
          q.translate((a[0] + b[0]) / 2, (a[1] + b[1]) / 2, (a[2] + b[2]) / 2);
          return q;
        };
        // the lyre (כנור): a sound-box below, two arms out and up, the yoke across them, seven strings - in its own plane (x, y) (fix-b2,
        // 22.11.2026: seven, "כנור של מקדש של שבעה נימין היה" - Arachin 13b; five until now)
        const G = {
          lyre: [mergeGeometries([new BoxGeometry(0.27, 0.085, 0.06).translate(0, 0.0425, 0), cyl(0.016, 0.013, [0.1, 0.06, 0], [0.155, 0.37, 0]),
            cyl(0.016, 0.013, [-0.1, 0.06, 0], [-0.155, 0.37, 0]), cyl(0.014, 0.014, [-0.18, 0.345, 0], [0.18, 0.345, 0])]),
            mergeGeometries([-3, -2, -1, 0, 1, 2, 3].map((k) => cyl(0.0025, 0.0025, [k * 0.03, 0.085, 0.012], [k * 0.036, 0.335, 0.012], 3)))],
          // the harp (נבל): its pillar, the neck over it, the sound-box along its foot, ten strings (fix-b2, 22.11.2026 - the user's
          // decision 66: "בנבל עשור" (Psalms 33:2), ten in every place; seven until now)
          harp: [mergeGeometries([new BoxGeometry(0.045, 0.56, 0.055).translate(0, 0.28, 0), new BoxGeometry(0.33, 0.045, 0.05).translate(0.165, 0.545, 0),
            new BoxGeometry(0.36, 0.09, 0.08).translate(0.18, 0.045, 0)]),
            mergeGeometries([1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((k) => cyl(0.0022, 0.0022, [k * 0.0305, 0.09, 0], [k * 0.0305, 0.52, 0], 3)))],
          cym: [new CylinderGeometry(0.13, 0.13, 0.016, 16).rotateZ(Math.PI / 2)],   // a cymbal: its face across x (the two meet)
          // a trumpet (חצוצרה): from the mouthpiece (the origin) forward along +z, the bell at its end
          tru: [mergeGeometries([cyl(0.017, 0.021, [0, 0, 0], [0, 0, 0.86], 8), new ConeGeometry(0.095, 0.2, 14, 1, true).rotateX(-Math.PI / 2).translate(0, 0, 0.96)])],
          flute: [cyl(0.019, 0.026, [0, 0, 0], [0, 0, 0.68], 8)]   // the flute (חליל): from the mouth forward
        };
        G.koh = G.tru;
        const strM = new MeshStandardMaterial({ color: 0xe9dfc6, roughness: 0.55 });
        const bronzeM = new MeshStandardMaterial({ color: 0xc8963e, metalness: 0.75, roughness: 0.32 });   // (M2.bronze is dark in the night)
        const MAT = { lyre: [wood, strM], harp: [wood, strM], cym: [bronzeM], tru: [silver], koh: [silver], flute: [wood] };
        const ss01 = (x) => { const u = Math.max(0, Math.min(1, x)); return u * u * (3 - 2 * u); };
        const lerp = (a, b, u) => a + (b - a) * u;
        const V = new Vector3(), Q = new Quaternion(), E3 = new Euler(), ONE = new Vector3(1, 1, 1);
        const P1 = new Vector3(), P2 = new Vector3(), T1 = new Vector3(), T2 = new Vector3();
        const place = (out, x, y, z, rx, ry, rz) => out.compose(V.set(x, y, z), Q.setFromEuler(E3.set(rx, ry, rz, "YXZ")), ONE);
        const pt = (m, x, y, z, out) => out.set(x, y, z).applyMatrix4(m);
        const wristTo = (S, P, out) => { T1.subVectors(P, S); const d = T1.length() || 1e-6; out.copy(P).addScaledVector(T1, -HL / d); };   // the fingers at P
        // the elbow of the arm from the shoulder S to the wrist W (W is pulled in when it is beyond the arm's length): down, out and back
        const elbow = (S, W, side, out) => {
          T1.subVectors(W, S);
          let d = T1.length();
          T1.multiplyScalar(1 / (d || 1e-6));
          if (d > UA + FA - 1e-3) { d = UA + FA - 1e-3; W.copy(S).addScaledVector(T1, d); }
          const ca = Math.max(-1, Math.min(1, (UA * UA + d * d - FA * FA) / (2 * UA * Math.max(d, 1e-4)))), sa = Math.sqrt(Math.max(0, 1 - ca * ca));
          T2.set(side * 0.55, -1, -0.3);
          T2.addScaledVector(T1, -T2.dot(T1)).normalize();
          out.copy(S).addScaledVector(T1, UA * ca).addScaledVector(T2, UA * sa);
        };
        // every instrument at a moment: e8 - the music's eighth (fractional), v - 0 at rest .. 1 playing; sets f.IM (and f.IM2), f.WL, f.WR
        const HANDS = {
          lyre(f, e8, v) {   // before the chest, a little to the left, its top out and to the left; the left hand on its left arm, the right across the strings
            place(f.IM, 0.07, 1.2, 0.3, 0.28, 0.12, -0.22);
            pt(f.IM, 0.155, 0.2, -0.02, P1);
            const sw = v * 0.075 * Math.sin(Math.PI * e8 + f.ph);   // a stroke every eighth
            pt(f.IM, sw - 0.02 * (1 - v), 0.19, 0.045 + 0.035 * (1 - v), P2);
            wristTo(SHL, P1, f.WL); wristTo(SHR, P2, f.WR);
          },
          harp(f, e8, v) {   // at the hip before him, its pillar to his right; both hands on the strings, by turns
            place(f.IM, -0.17, 0.98, 0.3, 0.12, 0.25, 0.05);
            const a = v * Math.sin(Math.PI * e8 * 0.5 + f.ph), b = v * Math.sin(Math.PI * e8 * 0.5 + f.ph + Math.PI);
            pt(f.IM, 0.23 + 0.03 * a, 0.3 + 0.05 * a, 0.04 + 0.03 * (1 - v), P1);
            pt(f.IM, 0.09 + 0.03 * b, 0.36 + 0.05 * b, 0.04 + 0.03 * (1 - v), P2);
            wristTo(SHL, P1, f.WL); wristTo(SHR, P2, f.WR);
          },
          cym(f, e8, v) {   // a cymbal in each hand; they meet at the head of every phrase (the loop's clash, 92-sounds)
            const u = ((e8 / 16) % 1 + 1) % 1;
            let gap = 0.15;
            if (u > 0.86) gap = 0.035 + 0.115 * (1 - ss01((u - 0.86) / 0.14));
            else if (u < 0.22) gap = 0.035 + 0.115 * ss01((u - 0.04) / 0.18);
            gap = 0.15 + (gap - 0.15) * v;
            const y = 1.3 + 0.14 * v, z = 0.28 + 0.04 * v;
            place(f.IM, gap, y, z, 0, 0, 0);
            place(f.IM2, -gap, y, z, 0, 0, 0);
            P1.set(gap + 0.03, y - 0.01, z - 0.01); P2.set(-gap - 0.03, y - 0.01, z - 0.01);
            wristTo(SHL, P1, f.WL); wristTo(SHR, P2, f.WR);
          },
          tru(f, e8, v) {   // across the chest at rest; at the call (the loop's trumpets: the head of the first and the third phrase) to the mouth
            const u = ((e8 % 32) + 32) % 32;
            let up = 0;
            if (u >= 29.5) up = ss01((u - 29.5) / 2.5); else if (u < 4.2) up = 1; else if (u < 6) up = 1 - ss01((u - 4.2) / 1.8);
            HANDS.koh(f, up * v);
          },
          koh(f, up) {   // the trumpet in both hands: the right by the mouthpiece, the left further; up 0 - before him, a little down; 1 - at the mouth, its bell a little up
            place(f.IM, lerp(-0.08, 0, up), lerp(1.36, 1.985, up), lerp(0.24, 0.135, up), lerp(0.38, -0.14, up), lerp(0.32, 0, up), 0);
            pt(f.IM, 0, -0.03, 0.2, P2); pt(f.IM, 0, -0.03, 0.34, P1);
            wristTo(SHR, P2, f.WR); wristTo(SHL, P1, f.WL);
          },
          flute(f, e8, v) {   // at the mouth, down and forward; the left hand above, the right below it, the fingers at work
            const b = v * 0.012 * Math.sin(Math.PI * e8 * 0.5 + f.ph);
            place(f.IM, lerp(0.02, 0, v), lerp(1.4, 1.98, v), lerp(0.22, 0.13, v), lerp(1.15, 0.55, v), lerp(-0.2, 0, v), 0);
            pt(f.IM, 0, -0.025 + b, 0.2, P1); pt(f.IM, 0, -0.025 - b, 0.42, P2);
            wristTo(SHL, P1, f.WL); wristTo(SHR, P2, f.WR);
          }
        };
        const qB = new Quaternion(), eB = new Euler(), vB = new Vector3(), vS = new Vector3(), mW = new Matrix4();
        // a set: figs [{ x, y, z, yaw, kind, cw (the crowd's handle), ci (its index there), skin }] in `parent`, their sleeves `robe`
        const set = (parent, figs, robe) => {
          const PP = tm_people(ctx2);
          const rig = PP.rig(parent, figs.length, { robe, skin: (i) => figs[i].skin });
          const count = {}, inst = {}, all = [];
          figs.forEach((f, i) => {
            f.ri = i; f.ii = count[f.kind] = (count[f.kind] || 0);
            count[f.kind]++;
            f.IM = new Matrix4(); f.IM2 = new Matrix4(); f.M = new Matrix4();
            f.WL = new Vector3(); f.WR = new Vector3(); f.EL = new Vector3(); f.ER = new Vector3();
            f.ph = ((i * 0.618) % 1) * 0.9; f.up = 0;
          });
          for (const k in count) {
            const n = count[k] * (k === "cym" ? 2 : 1);
            inst[k] = G[k].map((geo, j) => {
              const im = new InstancedMesh(geo, MAT[k][j], n);
              im.castShadow = false; im.receiveShadow = true; im.frustumCulled = false; im.userData.noPick = true; im.name = "simchaInstr";
              parent.add(im); all.push(im);
              return im;
            });
          }
          const crowds = [...new Set(figs.map((f) => f.cw).filter(Boolean))];
          return {
            g: parent, figs,
            // e8 - the music's eighth; v - how much they play (0 .. 1); the body's sway and the hands at their work. Every frame, near
            // or far (a few tens of thousands of triangles in all): a pause, or a flight to them in it, finds them set
            play(e8, v) {
              for (const f of figs) {
                const sw = v * Math.sin(Math.PI * 2 * e8 / 16 + f.ph * 7), nd = v * Math.sin(Math.PI * 2 * e8 / 8 + f.ph * 9);
                qB.setFromEuler(eB.set(0.03 * nd, f.yaw + 0.05 * sw, 0.025 * sw, "YXZ"));
                f.M.compose(vB.set(f.x, f.y, f.z), qB, vS.set(1.4, 1.4, 1.4));
                if (f.cw) f.cw.pose(f.ci, f.M);
                if (f.kind === "koh") HANDS.koh(f, f.up); else HANDS[f.kind](f, e8, v);
                elbow(SHL, f.WL, 1, f.EL);
                elbow(SHR, f.WR, -1, f.ER);
                rig.arm(f.ri, 1, f.M, SHL, f.EL, f.WL);
                rig.arm(f.ri, -1, f.M, SHR, f.ER, f.WR);
                const two = f.kind === "cym";
                mW.multiplyMatrices(f.M, f.IM);
                for (const im of inst[f.kind]) im.setMatrixAt(two ? 2 * f.ii : f.ii, mW);
                if (two) { mW.multiplyMatrices(f.M, f.IM2); for (const im of inst[f.kind]) im.setMatrixAt(2 * f.ii + 1, mW); }
              }
              for (const c of crowds) c.done();
              rig.done();
              for (const im of all) im.instanceMatrix.needsUpdate = true;
            }
          };
        };
        return { set };
      })();
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
        const fillCrowd = () => {   // SIMCHA_LAMPS_B2: the people's layout, again when the lamps have moved
        for (let i = crowdG.children.length - 1; i >= 0; i--) crowdG.remove(crowdG.children[i]);
        const SPOTS = lampSpots(), COLS = SH.eznRoof && SH.eznRoof.on && Array.isArray(SH.eznRoof.cols) ? SH.eznRoof.cols : [];
        B.crowdKey = lampKey();
        const free = (x, z) => {
          if (x < 97.5 || x > 224.6 || z < -63.6 || z > 63.6) return false;   // the walls
          if ((x < 134.8 || x > 187.2) && Math.abs(z) > 26.3) return false;   // the four chambers in the corners (the default)
          if (x > 115.8 && x < 137.6 && z > -28.6 && z < -13.2) return false;   // the lesser Sanhedrin "על פתח העזרה" (30-courts.js)
          if (Math.hypot(x - 96, z) < 24.6) return false;                      // the steps and the Levites on them
          for (const [mx, mz] of SPOTS) if (Math.hypot(x - mx, z - mz) < 8.4) return false;   // the lamps, their ladders, the young priests
          for (const [cx, cz] of COLS) if (Math.hypot(x - cx, z - cz) < 1.9) return false;   // the roof's columns (the roofing "in the name of Rav Chaim Kanievsky")
          if (Math.hypot(x - CXc, z) < 14.6) return false;                     // the dancers
          if (Math.abs(z) < 3.4 && x > 112) return false;                      // the way of the two priests to the east gate
          for (const [fx, fz] of [[121.6, -6], [121.6, 6]]) if (Math.hypot(x - fx, z - fz) < 2.6) return false;   // the two flutes (MUSICIANS_305: 2.6, 1.6 until 2.0.13 - one stood before each)
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
        };
        B.fillCrowd = fillCrowd;
        fillCrowd();
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
        // ---- the two priests with the trumpets (white garments, the hat and the sash) - MUSICIANS_305: "ושתי חצוצרות בידיהן" (5:4):
        // the trumpet in both hands, to the mouth while they blow (MUS above; each priest a set of one, in his own group)
        for (const s of [-1, 1]) {
          const G = new Group(); G.visible = false; DG.add(G);
          const near = PP.crowd(G, [[0, 0, 0]], { y: 0, s: 1.4, pose: "stand", kind: "kohen", robe: 0xf1ede2, tone: () => (s < 0 ? 1 : 2), exact: true, arms: false, name: "simchaKohen" });
          const cw = near && near.userData ? near.userData.crowd : null;
          const set = MUS.set(G, [{ x: 0, y: 0, z: 0, yaw: 0, kind: "koh", cw, ci: 0, skin: s < 0 ? 0 : 1 }], 0xf1ede2);
          B.koh.push({ G, s, set, up: 0 });
        }
        // ---- the musicians: the Levites on the steps, and the flute below them (MUSICIANS_305: each with his instrument in his hands)
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
          // "בכנורות ובנבלים ובמצלתים ובחצוצרות" (5:4): lyres for most, harps, cymbals and trumpets (their numbers - model choices)
          const kinds = pts.map((p, i) => (i % 9 === 4 ? "cym" : i % 7 === 3 ? "tru" : i % 4 === 1 ? "harp" : "lyre"));
          // each row's figures stand on their own step: one crowd per height
          const byY = new Map();
          pts.forEach((p, i) => { if (!byY.has(p[1])) byY.set(p[1], []); byY.get(p[1]).push(i); });
          const figs = [];
          for (const [y, idx] of byY) {
            const near = PP.crowd(g, idx.map((i) => [pts[i][0], pts[i][2], pts[i][3]]), { y, s: 1.4, pose: "stand", kind: "levi", robe: 0x8f8468, tone: (j) => 1 + (j % 2), exact: true, arms: false, name: "simchaLevi" });
            const cw = near && near.userData ? near.userData.crowd : null;
            idx.forEach((i, j) => figs.push({ x: pts[i][0], y, z: pts[i][2], yaw: pts[i][3], kind: kinds[i], cw, ci: j, skin: j }));
          }
          return MUS.set(g, figs, 0x8f8468);
        };
        B.levFor = (rid) => B.lev[rid ? "rid" : "rambam"] || (B.lev[rid ? "rid" : "rambam"] = levites(rid));
        // the flute: two players at the steps' foot, on the court's floor ("החליל מכה", the Rambam, Lulav 8:13)
        {
          const g = new Group(); DG.add(g);
          const pts = [[121.6, -6, Math.PI / 2 - 0.25], [121.6, 6, Math.PI / 2 + 0.25]];   // their faces to the court
          const near = PP.crowd(g, pts, { y: Y0, s: 1.4, pose: "stand", kind: "levi", robe: 0x8f8468, tone: (i) => 1 + i, exact: true, arms: false, name: "simchaFlute" });
          const cw = near && near.userData ? near.userData.crowd : null;
          B.flute = MUS.set(g, pts.map((p, j) => ({ x: p[0], y: Y0, z: p[1], yaw: p[2], kind: "flute", cw, ci: j, skin: j })), 0x8f8468);
        }
        return B;
      };
      // ---- the clock (the written seconds; the screen's are SH.demoSlow times longer) ----
      // CAPTIONS_305: the clock in phases - the lamps (L0), the dance (DZ), the Levites (LVS - not LV, the name of the levels in this function), Rabban Shimon (RS), the cock's crow (TD)
      const L0 = 13.7, DZ = L0 + 23.5, LVS = DZ + 41, RS = LVS + 8, TD = RS + 10;   // (until 2.0.13: 6, 29.5, 48, 56, 66)
      const CAPS = [[0, "״אמרו: כל מי שלא ראה שמחת בית השואבה, לא ראה שמחה מימיו״ (סוכה ה, א)"],
        [3, "״במוצאי יום טוב הראשון של חג, ירדו לעזרת נשים, ומתקנין שם תקון גדול״ (סוכה ה, ב)"],
        [5.8, "״מאי תיקון גדול?... חלקה היתה בראשונה, והקיפוה גזוזטרא, והתקינו שיהו נשים יושבות מלמעלה ואנשים מלמטה״ (סוכה נא:) — ״קרשים עם מעקה סביב על הזיזין שיוצאין מהחומות״ (תפארת ישראל)"],
        [9.2, "״תנו רבנן: בראשונה היו נשים מבפנים ואנשים מבחוץ, והיו באים לידי קלות ראש. התקינו שיהו נשים יושבות מבחוץ ואנשים מבפנים, ועדיין היו באין לידי קלות ראש. התקינו שיהו נשים יושבות מלמעלה ואנשים מלמטה״ (סוכה נא:)"],
        [L0, "״ומנורות של זהב היו שם, וארבעה ספלים של זהב בראשיהן, וארבעה סלמות לכל אחד ואחד, וארבעה ילדים מפרחי כהנה ובידיהם כדים של שמן״ (סוכה ה, ב)"],
        [L0 + 4.2, "״תנא: והן משובחין היו יותר מבנה של מרתא בת בייתוס״... ״מאי משובחים?... התם כבש, ומרובע, ולא זקיף. הכא סולמות, וזקיף טובא״ (סוכה נב:)"],
        [L0 + 8.5, "״מבלאי מכנסי כהנים ומהמיניהן מהן היו מפקיעין, ובהן היו מדליקין״ (סוכה ה, ג)"],
        [L0 + 15.8, "״ולא היתה חצר בירושלים שאינה מאירה מאור בית השואבה״ (סוכה ה, ג)"],
        [L0 + 19.6, "״אשה היתה בוררת חטים לאור של בית השואבה״ (סוכה נג.)"],
        [DZ, "״חסידים ואנשי מעשה היו מרקדים לפניהם באבוקות של אור שבידיהן, ואומרים לפניהן דברי שירות ותשבחות״ (סוכה ה, ד)"],
        [DZ + 4.5, "״יש מהן אומרים: אשרי ילדותנו שלא ביישה את זקנותנו — אלו חסידים ואנשי מעשה״ (סוכה נג.)"],
        [DZ + 9, "״ויש מהן אומרים: אשרי זקנותנו שכפרה את ילדותנו — אלו בעלי תשובה״ (סוכה נג.)"],
        [DZ + 13.5, "״אלו ואלו אומרים: אשרי מי שלא חטא, ומי שחטא — ישוב וימחול לו״ (סוכה נג.)"],
        [DZ + 18, "״אמרו עליו על הלל הזקן, כשהיה שמח בשמחת בית השואבה, אמר כן: אם אני כאן — הכל כאן, ואם איני כאן — מי כאן״ (סוכה נג.)"],
        [DZ + 22.5, "״הוא היה אומר כן: מקום שאני אוהב — שם רגלי מוליכות אותי. אם תבא אל ביתי — אני אבא אל ביתך, אם אתה לא תבא אל ביתי — אני לא אבא אל ביתך, שנאמר: ׳בכל המקום אשר אזכיר את שמי אבא אליך וברכתיך׳״ (סוכה נג.)"],
        [DZ + 27.5, "״אמר רבי יהושע בן חנניה: כשהיינו שמחים שמחת בית השואבה, לא ראינו שינה בעינינו״ (סוכה נג.)"],
        [DZ + 31.5, "״כיצד? שעה ראשונה תמיד של שחר, משם לתפלה, משם לקרבן מוסף, משם לתפלת המוספין, משם לבית המדרש, משם לאכילה ושתיה, משם לתפלת המנחה, משם לתמיד של בין הערבים, מכאן ואילך לשמחת בית השואבה״ (סוכה נג.)"],
        [DZ + 37, "״אלא הכי קאמר: לא טעמנו טעם שינה, דהוו מנמנמי אכתפא דהדדי״ (סוכה נג.)"],
        [LVS, "״והלוים בכנורות ובנבלים ובמצלתים ובחצוצרות ובכלי שיר בלא מספר, על חמש עשרה מעלות היורדות מעזרת ישראל לעזרת נשים״ (סוכה ה, ד)"],
        [LVS + 4, "״שיר המעלות, הנה ברכו את ה׳ כל עבדי ה׳, העומדים בבית ה׳ בלילות״ (תהלים קלד, א) — ״ולוים בכנורות ובנבלים וכל כלי שיר מהן אומרים שיר המעלות הנה ברכו״ (תוספתא סוכה ד, ה)"],
        [RS, "״אמרו עליו על רבן שמעון בן גמליאל, כשהיה שמח שמחת בית השואבה, היה נוטל שמנה אבוקות של אור, וזורק אחת ונוטל אחת ואין נוגעות זו בזו״ (סוכה נג.)"],
        [RS + 5.5, "״וכשהוא משתחוה, נועץ שני גודליו בארץ ושוחה ונושק את הרצפה וזוקף, ואין כל בריה יכולה לעשות כן, וזו היא קידה״ (סוכה נג.) — ופניו אל ההיכל"],
        [TD, "״ועמדו שני כהנים בשער העליון שיורד מעזרת ישראל לעזרת נשים, ושתי חצוצרות בידיהן. קרא הגבר — תקעו והריעו ותקעו״ (סוכה ה, ד)"],
        [TD + 8.6, "״הגיעו למעלה עשירית — תקעו והריעו ותקעו״ — בהדגמה: ירדו חמש, ועומדים על העשירית (״תיקו״, סוכה נג:)"],
        [TD + 14.9, "״הגיעו לעזרה — תקעו והריעו ותקעו״ — ״לרצפת עזרת נשים״ (תפארת ישראל)"],
        [TD + 20, () => "״היו תוקעין והולכין, עד שמגיעין לשער היוצא מזרח״ (סוכה ה, ד) — " + (SH.simchaWalk && SH.simchaWalk.mode === "tyt"
          ? "לתפארת ישראל: ״היינו רק תקיעה בלי תרועה״" : "לרש״י: ״באלו שלש אחרונות מאריכין עד שמגיעין לשער״ — התקיעה, התרועה והתקיעה נמשכות בהליכה")],
        [TD + 34.5, "״הגיעו לשער היוצא ממזרח, הפכו פניהן למערב, ואמרו: אבותינו שהיו במקום הזה אחוריהם אל היכל ה׳ ופניהם קדמה, והמה משתחוים קדמה לשמש — ואנו ליה עינינו״ (סוכה ה, ד)"],
        [TD + 42, "״רבי יהודה אומר: היו שונין ואומרין: אנו ליה, וליה עינינו״ (סוכה ה, ד)"],
        [TD + 46.5, "״אלא הכי אמרי: המה משתחוים קדמה, ואנו ליה — אנחנו מודים, ועינינו ליה מיחלות״ (סוכה נג:)"]];
      const TEND = TD + 51;
      // the eye: flights fired by the clock (the viewer may look round between them)
      const FLY = [[0, [252, 88, 96], [161, 14, 0]], [3.4, [173, 26, -24], [158, 22, -64]], [L0 + 0.2, [176, 32, 44], [141, 30, -20]],
        [L0 + 8.5, [152, 58, -7], [141, 51, -20]], [L0 + 15.8, [215, 60, 80], [161, 30, 0]], [DZ, [178, 13.5, 11], [161, 8.5, 0]], [DZ + 8.5, [146, 12.5, -9], [161, 8.5, 0]],
        [DZ + 27.5, [172, 20, -26], [161, 8, 0]], [LVS, [129, 16, 13], [104, 11, 0]], [RS, [177, 12, 12], [161, 9.4, 0]], [RS + 5.4, [146, 11.5, 9], [161, 8.6, 0]],
        [TD, [126, 19, 15], [97, 14, 0]], [TD + 19.5, [172, 17, 24], [128, 9, 0]],
        [TD + 27, [204, 16, 23], [182, 9, 0]], [TD + 33, [196, 12.5, 9], [223, 9.5, 0]], [TD + 42.5, [252, 70, 92], [161, 12, 0]]];
      // the two priests' way (the screen's x; their feet on the steps by stepY): the upper gate, the tenth step, the court, the east gate
      const kohWay = (rid) => {
        const x10 = rid ? 96 + 0.5 * (15.5 - 10) : 96 + (22 - 9 * 0.5 - 0.25), xF = rid ? 104.2 : 118.8, xTop = rid ? 95.6 : 110.7;
        return [[TD, 94.6], [TD + 6, 94.6], [TD + 7.4, xTop], [TD + 8.4, x10], [TD + 13.6, x10], [TD + 14.6, xF], [TD + 19.9, xF], [TD + 34, 222.2]];
      };
      const BLASTS = [TD + 1, TD + 8.7, TD + 15];   // tekia - terua - tekia, each ~4.8 s (SOUNDS_300 "trumpets")
      const LONGS = [TD + 20.2, TD + 24.8, TD + 29.4];   // "היו תוקעין והולכין" - long blasts as they go (the Tiferet Yisrael's)
      // TERUAH_305 (the user, 21:10: "ונראה לי יש תרועה שם גם, תבדוק"; 21:24: "2. ג" - a switch, ״שיטות ומחלוקות״ sh60): "היו תוקעין
      // והולכין" (5:4). Rashi (on the mishnah): "באלו שלש אחרונות מאריכין עד שמגיעין לשער היוצא מעזרת נשים להר הבית", and so the
      // Bartenura (5:5: "ומאריכין בהן עד שהגיעו לשער התחתון"), the Tosafot Yom Tov and the Pnei Moshe - the court's tekia, teruah and
      // tekia drawn out along the way, to the east gate (the default; their length - model choice); the Tiferet Yisrael (Yachin 5:5,
      // 772:581): "ואע״ג דגם לאחר מעלה עשירית קאמר תוקעין והולכין, היינו רק תקיעה בלי תרועה" - after the court's three, long blasts
      // without a teruah as they go (until 2.0.13 the only way)
      const WALK = SH.simchaWalk || (SH.simchaWalk = { mode: "rashi", set(m) { this.mode = m === "tyt" ? "tyt" : "rashi"; return this.mode; } });
      const DRAWN = [TD + 15, TD + 34];   // Rashi's: from the court's floor to the east gate
      const blowing = (t) => (WALK.mode === "tyt"
        ? BLASTS.some((s) => t >= s - 0.3 && t < s + 5) || LONGS.some((s) => t >= s - 0.2 && t < s + 3)
        : BLASTS.slice(0, 2).some((s) => t >= s - 0.3 && t < s + 5) || (t >= DRAWN[0] - 0.3 && t < DRAWN[1]));
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
        if (L && fnc(L.drive)) L.drive(t < L0 ? -1 : Math.min(23.4, t - L0));
        // the dancers: standing in their ring until DZ, then round it; wider round Rabban Shimon; at the cock's crow off the way
        const go = ss(DZ, DZ + 2, t) * (1 - ss(TD - 0.2, TD + 1.6, t)), R = DR + 2.6 * ss(RS - 1, RS + 1.5, t);
        const tt = Math.min(t, TD), ang = tt < DZ ? 0 : tt < DZ + 2 ? 0.3 * (tt - DZ) * (tt - DZ) / 4 : 0.3 * (tt - DZ - 1);   // the speed rises 0 .. 0.3 in two seconds
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
          const r = b.rsbg, jug = ss(RS - 0.4, RS + 0.4, t) * (1 - ss(RS + 5.2, RS + 5.8, t));
          r.G.position.set(CXc, Y0, -5.6 * ss(TD - 0.2, TD + 2.2, t));
          // KIDAH_WEST_305 (the user, 22:22: "בודאי כל ההשתחויות בבהמ"ק היו להיכל ולא חלילה ההיפך כמו שאמרו... אחוריהם אל ההיכל
          // ופניהם קדמה"): before the kidah he turns to the west, his face to the heichal, and after it back (until 2.0.13 - to the east)
          const wst = ss(RS + 5.4, RS + 6.2, t) * (1 - ss(RS + 9.9, RS + 10.6, t));
          r.G.rotation.y = (Math.PI / 2 + 0.9 * Math.sin(0.5 * t) * (t > RS && t < RS + 5.5 ? 1 : 0.25)) * (1 - wst) - (Math.PI / 2) * wst;
          for (const tg of r.tor) tg.visible = jug > 0.02;
          if (jug > 0.02) { juggle(r.tor, t, 2.4, 0.9, 1); for (const tg of r.tor) tg.scale.setScalar(jug); }
          const kd = ss(RS + 6.3, RS + 7.6, t) * (1 - ss(RS + 8.5, RS + 9.8, t));
          r.Tl.rotation.x = 1.38 * kd;
        }
        // the Levites of the steps' reading; the two priests
        const rid = ridSteps();
        for (const [k, st] of Object.entries(b.lev)) st.g.visible = (k === "rid") === rid;
        if (!b.lev[rid ? "rid" : "rambam"]) b.levFor(rid).g.visible = true;
        // MUSICIANS_305: the music's eighth - the loop's own clock while it sounds (D.music.beat, 92-sounds), else the screen's -
        // and how much they play: from the dance to the cock's crow, as the music (below)
        const bt = D.music && fnc(D.music.beat) ? D.music.beat() : null, e8 = bt != null ? bt : performance.now() / 200;
        const vM = ss(DZ, DZ + 1.7, t) * (1 - ss(TD - 1.2, TD + 0.2, t));
        b.lev[rid ? "rid" : "rambam"].play(e8, vM);
        if (b.flute) b.flute.play(e8, vM);
        if (!D.way || D.rid !== rid) { D.way = kohWay(rid); D.rid = rid; }
        const on = t >= TD - 0.05;
        const blow = blowing(t);
        const dt = Math.max(0, Math.min(0.2, t - (D.lt == null ? t : D.lt)));
        D.lt = t;
        for (const k of b.koh) {
          k.G.visible = on;
          if (!on) continue;
          const x = at1(D.way, t), z = k.s * 1.25;
          const walking = D.way.some((p, i) => i + 1 < D.way.length && t > p[0] && t < D.way[i + 1][0] && D.way[i + 1][1] !== p[1]);
          k.G.position.set(x, stepY(x, z, rid) + (walking ? 0.05 * Math.abs(Math.sin(t * 9)) : 0), z);
          k.G.rotation.y = Math.PI / 2 + Math.PI * ss(TD + 34, TD + 35.2, t);   // east, then the face to the west
          k.up += ((blow ? 1 : 0) - k.up) * Math.min(1, dt * 7);   // MUSICIANS_305: to the mouth in about a third of a second
          k.set.figs[0].up = k.up;
          k.set.play(0, 0);
        }
        // the night, and the first light from the cock's crow
        const NK = SH.nightKit;
        if (NK && D.saved && D.saved.night) {
          if (t < L0 + 13.3) NK.set("simchaNight", "simchaNight", 0);
          else if (t < TD + 8) NK.set("simchaNight", "simchaLit", ss(L0 + 13.3, L0 + 17, t));
          else NK.set("simchaLit", "simchaDawn", ss(TD + 8, TD + 42, t));
        }
        // the music: from the dance to the cock's crow
        if (D.music) D.music.set(D.pausedAt != null ? 0 : 0.9 * ss(DZ, DZ + 1.7, t) * (1 - ss(TD - 1.2, TD + 0.2, t)));
        // the caption
        let txt = "";
        for (const [ct, x] of CAPS) if (t >= ct) txt = typeof x === "function" ? x() : x;
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
        if (B && B.crowdKey !== lampKey() && typeof B.fillCrowd === "function") B.fillCrowd();   // SIMCHA_LAMPS_B2
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
        D.lt = null;
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
          const tyt = WALK.mode === "tyt";   // TERUAH_305; the cymbals - in the loop now (MUSICIANS_305)
          for (const s of tyt ? BLASTS : BLASTS.slice(0, 2)) if (D.snd < s && t >= s) SH.sfx("trumpets");
          if (tyt) { for (const s of LONGS) if (D.snd < s && t >= s) SH.sfx("trumpets", { pattern: "long" }); }
          else if (D.snd < DRAWN[0] && t >= DRAWN[0]) SH.sfx("trumpets", { pattern: "drawn", dur: (DRAWN[1] - t) * SLOW() });
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
    // ---------- ARAVAH_B2 (fix-b2, 22.11.2026 - the user's decisions 56 and 80): THE WILLOW'S COMMANDMENT AND THE CIRCUIT OF THE ALTAR ----------
    // Mishnah Sukkah 4:5 (56:44): "מצות ערבה כיצד, מקום היה למטה מירושלים, ונקרא מוצא. יורדין לשם ומלקטין משם מרביות של ערבה, ובאין וזוקפין
    // אותן בצדי המזבח, וראשיהן כפופין על גבי המזבח. תקעו והריעו ותקעו. בכל יום מקיפין את המזבח פעם אחת, ואומרים, אנא ה' הושיעה נא, אנא ה'
    // הצליחה נא... ואותו היום מקיפין את המזבח שבע פעמים"; Sukkah 45a (108:1165-1166): eleven amot long, "כדי שיהו גוחות על גבי המזבח אמה".
    // From Rav Chaim Kanievsky, as brought in Chalamish ("אלחנן וחיים שמחים בירושלים", the list of sources, on pp. 25, 30): "יש ערבות רבות
    // שממלאות את צדי המזבח, ולא מעטות"; "הערבות צריכות להיות מנחות ישירות על היסוד ולא בתוך כלי, וכנראה היו לערבות גזעים עבים"; "הערבות מנחות
    // רק במקום שיש יסוד, וזה נקרא להקיף את המזבח" - and perhaps not in the east and the south. So: many willows, thick at the foot, standing
    // on the yesod - all along the north and the west - eleven amot high, their heads bent an amah over the altar's top. THE CIRCUIT
    // (SH.aravah.circuit, the row "הקפת המזבח"): "priests" (the default) - priests alone go round (Rashi, Sukkah 43b, 2163:2025: "אבל ישראל לא
    // היה נכנס בין האולם ולמזבח"; the Tosafot, the Ritva, the Meiri, the Ran, the Gra; Kelim 1:8-9); "all" - Israelites too (the Or Zarua,
    // part 2, 315 - 3930:3793 - in the name of the Yerushalmi). The figures go round the altar and its ramp, a branch in each hand, while the
    // demonstration is shown (a place's feature, untimed). No tefillin - Chol HaMoed (SH.tefOff). MODEL CHOICES: the willows' number and form,
    // the way round (outside the ramp too), the walkers' number, pace and what they hold (a willow branch).
    {
      const AG = grp("aravahDemo", false);
      const altDz = () => { const AP = SH.altarPlace; return AP && AP.dz && typeof AP.dz[AP.current] === "number" ? AP.dz[AP.current] : 12.5; };
      const F = LV.KOH, YT = F + 1;   // the yesod's top
      const AR = { circuit: "priests", built: false, walkers: { priests: [], all: [] }, t0: 0 };
      const trunkM = new MeshStandardMaterial({ color: 0x6d6a3e, roughness: 0.85 });
      const leafM = new MeshStandardMaterial({ color: 0x6f9a52, roughness: 0.8, side: DoubleSide });
      const leafIM = new MeshStandardMaterial({ color: 0xffffff, roughness: 0.75, side: DoubleSide });
      const WG = {};   // the willows for each altar's measure (32, or R. Yose's 28), built when first shown
      const curW = () => (SH.altarMeasures && SH.altarMeasures.mode === "yose") ? 28 : 32;
      const willows = (W) => {
        if (WG[W]) return WG[W];
        const WGr = WG[W] = new Group(); WGr.name = "aravahWillows" + W; AG.add(WGr);
        const x0 = 71.5 - W, z1 = -19.5 + W;   // the altar's frame (40-altar.js): its north-east corner fixed at (71.5, -19.5)
        const trunks = [], leaves = [];
        let q = 22112026;
        const rr = () => (q = (q * 1664525 + 1013904223) >>> 0) / 4294967296;
        // a willow: [foot x, z], the inward direction [ix, iz]
        // a willow ("מרביות של ערבה" - long branches, the Bartenura's "נטיעות"): a thick foot on the yesod, a long stem bending at its head over
        // the altar's top (Sukkah 45a: "כדי שיהו גוחות על המזבח אמה"), a few side shoots, and narrow hanging leaves on the upper two thirds
        const tubeOf = (pts, r0, r1, segs) => {
          const curve = new CatmullRomCurve3(pts), tube = new TubeGeometry(curve, segs, 1, 6, false), pos = tube.attributes.position;
          for (let i = 0; i < pos.count; i++) {   // taper: each ring of the tube round its own centre
            const ring = Math.floor(i / 7), u = ring / segs, c = curve.getPointAt(u), r = r0 + (r1 - r0) * Math.pow(u, 0.6);
            pos.setXYZ(i, c.x + (pos.getX(i) - c.x) * r, c.y + (pos.getY(i) - c.y) * r, c.z + (pos.getZ(i) - c.z) * r);
          }
          trunks.push(tube);
          return curve;
        };
        const leafAlong = (curve, u0, n, spread) => {
          for (let k = 0; k < n; k++) {
            const u = u0 + (1 - u0) * Math.sqrt(rr()), p = curve.getPoint(Math.min(1, u)), a = rr() * Math.PI * 2, s = 0.04 + rr() * spread;
            leaves.push([p.x + Math.cos(a) * s, p.y + (rr() - 0.3) * 0.2, p.z + Math.sin(a) * s, rr() * Math.PI * 2, 0.25 + rr() * 0.75, rr()]);
          }
        };
        const willow = (fx, fz, ix, iz) => {
          const H = 10.6 + rr() * 0.8, reach = 2.5 + rr() * 0.6, px = -iz, pz = ix, sw = (rr() - 0.5) * 0.5, pts = [];
          for (let i = 0; i <= 10; i++) {
            const u = i / 10, y = YT + H * (u < 0.8 ? u : 0.8 + (u - 0.8) * 0.55);
            const bend = u < 0.72 ? 0.1 * u : 0.072 + Math.pow((u - 0.72) / 0.28, 1.5) * reach;   // the head bends over the altar
            pts.push(new Vector3(fx + ix * bend + px * sw * u, y, fz + iz * bend + pz * sw * u));
          }
          const main = tubeOf(pts, 0.17 + rr() * 0.05, 0.035, 16);   // "וכנראה היו לערבות גזעים עבים"
          leafAlong(main, 0.38, 60, 0.3);
          const nb = 3 + Math.floor(rr() * 3);
          for (let b = 0; b < nb; b++) {
            const u0 = 0.3 + rr() * 0.4, p0 = main.getPoint(u0), side = (b % 2 ? 1 : -1) * (0.5 + rr() * 0.6), len = 1.8 + rr() * 1.8, inw = 0.3 + rr() * 0.6;
            const P = (t, up) => new Vector3(p0.x + px * side * t + ix * inw * t * t, p0.y + up, p0.z + pz * side * t + iz * inw * t * t);
            const bc = tubeOf([P(0, 0), P(0.45, len * 0.5), P(0.85, len * 0.85), P(1.2, len * 0.9 - 0.5)], 0.05, 0.015, 8);
            leafAlong(bc, 0.25, 32, 0.22);
          }
        };
        for (let x = x0 + 0.5, k = 0; x < 71.2; x += 0.95 + (rr() - 0.5) * 0.35, k++) willow(x, k % 2 ? -18.85 : -19.2, 0, 1);       // along the north, on the yesod
        for (let z = -18.2, k = 0; z < z1 - 0.5; z += 0.95 + (rr() - 0.5) * 0.35, k++) willow(k % 2 ? x0 + 0.65 : x0 + 0.3, z, 1, 0);   // along the west
        const tm = new Mesh(mergeGeometries(trunks), trunkM); tm.castShadow = true; tm.userData.noPick = true; WGr.add(tm);
        const lg = new PlaneGeometry(0.075, 0.46).translate(0, -0.23, 0);   // a narrow leaf, hanging from its stalk
        const im = new InstancedMesh(lg, leafIM, leaves.length);
        const mm = new Matrix4(), qq = new Quaternion(), e = new Euler(), vp = new Vector3(), vs = new Vector3(1, 1, 1), col = new Color();
        leaves.forEach(([x, y, z, a, t, c], i) => {
          qq.setFromEuler(e.set(t, a, 0, "YXZ")); mm.compose(vp.set(x, y, z), qq, vs); im.setMatrixAt(i, mm);
          im.setColorAt(i, col.setHSL(0.23 + c * 0.06, 0.34 + c * 0.16, 0.24 + c * 0.12));   // willow's grey-green, lighter and darker leaves
        });
        if (im.instanceColor) im.instanceColor.needsUpdate = true;
        im.castShadow = true;
        im.instanceMatrix.needsUpdate = true; im.userData.noPick = true; WGr.add(im);
        WGr.userData.x0 = x0;
        return WGr;
      };
      const LB = [];   // the labels, in the altar's frame (z without the place's shift): moved with it
      const build = () => {
        if (AR.built) return;
        AR.built = true;
        // the walkers: priests in white; with the reading "all", Israelites in their own clothes too
        try {
          const PP = tm_people(ctx2), branchG = new CylinderGeometry(0.02, 0.03, 1.6, 5).translate(0, 0.8, 0);
          // the priests: a willow's branch in the right hand (Rashi, Sukkah 43b: "ביד נוטלין אותה ומנענעים ומקיפין בה הכהנים את המזבח");
          // the Israelites (the Or Zarua's Yerushalmi): "נוטלים את לולביהן בידיהן ימנית ואתרוגיהן בידיהן השמאלית"
          const lulavG = new CylinderGeometry(0.018, 0.026, 1.9, 5).translate(0, 0.95, 0), etrogG = new SphereGeometry(0.1, 10, 8).scale(1, 1.35, 1);
          const lulavM = new MeshStandardMaterial({ color: 0x5f7a3a, roughness: 0.8 }), etrogM = new MeshStandardMaterial({ color: 0xd9c23a, roughness: 0.6 });
          const twig = new BoxGeometry(0.04, 0.3, 0.006);
          const mk = (kind, robe, list, n, name, israel) => {
            for (let i = 0; i < n; i++) {
              const G = new Group(); G.visible = false; AG.add(G);
              PP.crowd(G, [[0, 0, 0]], { y: 0, s: 1.4, pose: "stand", kind, robe: Array.isArray(robe) ? robe[i % robe.length] : robe, tone: () => i % 4, exact: true, avnet: kind === "kohen" ? undefined : false, name });
              if (israel) {
                const l = new Mesh(lulavG, lulavM); l.position.set(-0.36, 1.15, 0.3); l.rotation.x = 0.12; G.add(l);
                const e = new Mesh(etrogG, etrogM); e.position.set(0.36, 1.3, 0.32); G.add(e);
              } else {
                const b = new Mesh(branchG, leafM); b.position.set(-0.36, 1.15, 0.3); b.rotation.z = 0.25; G.add(b);
                for (let j = 0; j < 7; j++) { const t = new Mesh(twig, leafM); t.position.set(-0.36 + 0.25 * (0.4 + j * 0.09) + (j % 2 ? 0.06 : -0.06), 1.15 + 1.6 * (0.4 + j * 0.09), 0.3); t.rotation.z = j % 2 ? -0.6 : 0.6; G.add(t); }
              }
              list.push(G);
            }
          };
          mk("kohen", 0xf1ede2, AR.walkers.priests, 14, "aravahPriest", false);
          mk("worker", [0x6b5a3e, 0x4a4f5a, 0x5c4a3a, 0x3e4a5e, 0x7a6a50], AR.walkers.all, 18, "aravahIsraelite", true);
        } catch (_) {}
      };
      // the labels are pushed at once (the labels' layer is drawn once, at the start), and follow the altar's place
      for (const [text, x, y, z, size] of [
        ["״ובאין וזוקפין אותן בצדי המזבח, וראשיהן כפופין על גבי המזבח״ (סוכה ד, ה)", 55.5, F + 15, -21.5, 1.6],
        ["הערבות על היסוד בלבד — מפי הגר״ח קניבסקי, כפי שהובא בחלמיש", 36.5, F + 13.2, -3.5, 1.2],
        ["״בכל יום מקיפין את המזבח פעם אחת, ואומרים, אנא ה׳ הושיעה נא״ (סוכה ד, ה)", 55.5, F + 17.2, 6, 1.5]]) {
        const l = { text, x, y, z: z + 12.5, size, layer: "aravahDemo" };
        ctx2.labels.push(l); LB.push([l, z]);
      }
      let lbDz = 12.5;
      const moveLabels = (dz) => {
        if (dz === lbDz) return;
        lbDz = dz;
        let lg = null; try { lg = ctx2.root.getObjectByName("labels"); } catch (_) {}
        for (const [l, z] of LB) {
          const oz = l.z; l.z = z + dz;
          if (lg) for (const spr of lg.children) {
            if ((spr.userData && spr.userData.label === l) || (Math.abs(spr.position.x - l.x) < 1e-3 && Math.abs(spr.position.y - l.y) < 1e-3 && Math.abs(spr.position.z - oz) < 1e-3)) { spr.position.z = l.z; break; }
          }
        }
      };
      // the way round, in the altar's frame: a rounded rectangle round the altar and its ramp (x 36.5..74.5, z -22.5..45.5)
      const PATH = (() => {
        const X0 = 36.5, X1 = 74.5, Z0 = -22.5, Z1 = 45.5, R = 3, P = [];
        const arc = (cx, cz, a0) => { for (let i = 0; i <= 6; i++) { const a = a0 + (Math.PI / 2) * i / 6; P.push([cx + R * Math.cos(a), cz + R * Math.sin(a)]); } };
        arc(X1 - R, Z0 + R, -Math.PI / 2); arc(X1 - R, Z1 - R, 0); arc(X0 + R, Z1 - R, Math.PI / 2); arc(X0 + R, Z0 + R, Math.PI);
        const L = [0]; for (let i = 1; i <= P.length; i++) { const a = P[i - 1], b = P[i % P.length]; L.push(L[i - 1] + Math.hypot(b[0] - a[0], b[1] - a[1])); }
        return { P, L, len: L[P.length] };
      })();
      const at = (s) => {   // a point on the way at arc length s
        const { P, L, len } = PATH; s = ((s % len) + len) % len;
        let i = 1; while (i < L.length && L[i] < s) i++;
        const a = P[(i - 1) % P.length], b = P[i % P.length], u = (s - L[i - 1]) / Math.max(1e-6, L[i] - L[i - 1]);
        return [a[0] + (b[0] - a[0]) * u, a[1] + (b[1] - a[1]) * u, Math.atan2(a[0] - b[0], a[1] - b[1])];   // walking toward smaller s
      };
      // the way's direction: on the south side eastward, then north on the east side - the altar on the left, as one who turns to the
      // right from the ramp and goes round (a model choice: the Mishnah does not say). The walkers are in AG, which carries the place's shift
      const pose = () => {
        const t = (performance.now() - AR.t0) / 1000, sp = 2.4;
        const list = AR.circuit === "all" ? AR.walkers.priests.concat(AR.walkers.all) : AR.walkers.priests;
        for (const G of AR.walkers.priests.concat(AR.walkers.all)) if (!list.includes(G)) G.visible = false;
        const gap = PATH.len / list.length;
        list.forEach((G, i) => {
          const [x, z, yaw] = at(-t * sp + i * gap);
          G.position.set(x, F + Math.abs(Math.sin(t * 4.2 + i * 1.3)) * 0.05, z); G.rotation.y = yaw; G.visible = true;
        });
      };
      const sync = () => {
        const dz = altDz(), W = curW();
        AG.position.z = dz; moveLabels(dz);
        const WGr = willows(W);
        for (const k in WG) WG[k].visible = WG[k] === WGr;
      };
      const tefOn = (on) => { const TO = SH.tefOff || (SH.tefOff = new Set()); if (on) TO.add("aravah"); else TO.delete("aravah"); };
      SH.aravah = {
        get circuit() { return AR.circuit; },
        setCircuit(m) { AR.circuit = m === "all" ? "all" : "priests"; if (AG.visible) pose(); return AR.circuit; },
        show() { const F2 = SH.features && SH.features.aravah; if (F2 && !F2.isOn()) F2.on(); }
      };
      SH.features = SH.features || {};
      SH.features.aravah = { key: "aravah", timed: false, isOn: () => AG.visible,
        on: () => { build(); sync(); AR.t0 = performance.now(); AG.visible = true; tefOn(true); pose(); },
        off: () => { AG.visible = false; tefOn(false); } };
      if (Array.isArray(ctx2.animated)) ctx2.animated.push(() => {
        if (!AG.visible) return;
        sync();
        pose();
      });
    }
    // ORDER_B2 (fix-b2, 22.11.2026 - the user's decisions 16 and 24: "בסדר היום" in the Second Temple's cards): a place -> the stage of the
    // morning service done in it (55-tamid.js, its stages' ids); the card's link starts the presentation "סדר עבודת הבוקר" at that stage
    // (70-ui.js renderLinks). The choice of the stage for each place - a model choice.
    SH.placeOrder = {
      "הר הבית": "ihb", "בית המוקד": "moked", "לשכת הגזית — הסנהדרין": "lot2", "לשכת הטלאים — בבית המוקד": "lamb",
      "הכיור": "kiyor", "הדגמת המוכני — הכיור יורד לבור ועולה": "kiyor", "המזבח": "terumah", "בית המטבחים": "tobeit", "הטבעות": "akedah",
      "השער הגדול — ארבע הדלתות": "gate", "פתיחת השער הגדול — הדגמה": "gate", "הקודש": "inner", "המנורה": "lamps5", "מזבח הזהב": "ketoret",
      "הכבש הגדול": "evarim", "שולחן החלבים — שני השולחנות שבמערב הכבש": "evarim", "שלוש המחתות — בכל יום וביום הכיפורים": "machta",
      "האולם": "birkat", "לשכת עושי חביתין": "mincha", "ספלי הניסוך": "nesachim", "דוכן הלויים": "shir"
    };
  }
