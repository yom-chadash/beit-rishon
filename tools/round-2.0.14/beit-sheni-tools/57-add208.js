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
      const X0 = 84.0, Z0 = -9.5, DZ = -2.1;   // the court of Israel's floor x 83..85 (82.5 - the priests' podium, 85.5 - the duchan's steps)
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
      const MG = grp("simchaMenorot", false);
      const Y0 = LV.EZN, HH = 50, CUPR = 1.7, RB = 5.6, RT = CUPR + 0.8, TOPY = Y0 + HH - 1.0;
      const SPOTS = [[141, -20], [181, -20], [141, 20], [181, 20]];
      const DIRS = [[1, 0], [0, 1], [-1, 0], [0, -1]];
      const shaftG = new LatheGeometry([[0, 0], [2.1, 0], [2.1, 0.7], [1.3, 1.0], [0.8, 1.8], [0.66, 8], [0.55, 28], [0.48, HH - 2.4], [0.9, HH - 1.8], [0.55, HH - 1.4], [0.5, HH - 1.0], [0, HH - 1.0]].map(([r, y]) => new Vector2(r, y)), 20);
      const cupG = new LatheGeometry([[0, 0], [0.3, 0], [0.34, 0.06], [0.62, 0.34], [0.7, 0.55], [0.66, 0.58], [0.58, 0.4], [0.3, 0.14], [0, 0.14]].map(([r, y]) => new Vector2(r, y)), 18);
      const armG = new BoxGeometry(CUPR, 0.22, 0.26); armG.translate(CUPR / 2, 0, 0);
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
      const flames = [], oils = [], halos = [];
      // the ladders: rails and rungs - two InstancedMesh (16 ladders, 32 rails, a rung every 0.9 amah)
      const rails = [], rungs = [];
      const railLen = Math.hypot(RB - RT, TOPY - 0.6 - Y0);
      const tilt = Math.atan2(RB - RT, TOPY - 0.6 - Y0);
      for (const [mx, mz] of SPOTS) {
        const sh = new Mesh(shaftG, M2.gold); sh.position.set(mx, Y0, mz); sh.castShadow = true; sh.receiveShadow = true; MG.add(sh);
        DIRS.forEach(([dx, dz]) => {
          const yaw = Math.atan2(dx, dz);
          const arm = new Mesh(armG, M2.gold); arm.position.set(mx, TOPY - 0.35, mz); arm.rotation.y = yaw - Math.PI / 2; MG.add(arm);
          const cx = mx + dx * CUPR, cz = mz + dz * CUPR;
          const cup = new Mesh(cupG, M2.gold); cup.position.set(cx, TOPY - 0.3, cz); cup.castShadow = true; MG.add(cup);
          const oil = new Mesh(new CylinderGeometry(0.6, 0.6, 0.03, 16), oilM); oil.position.set(cx, TOPY + 0.12, cz); oil.visible = false; MG.add(oil); oils.push(oil);
          const wick = new Mesh(new CylinderGeometry(0.09, 0.11, 0.5, 8), wickM); wick.position.set(cx, TOPY + 0.2, cz); MG.add(wick);
          const fl = new Sprite(new SpriteMaterial({ map: ftx, transparent: true, depthWrite: false, blending: AdditiveBlending }));
          fl.position.set(cx, TOPY + 1.25, cz); fl.scale.set(0.9, 1.8, 1); fl.visible = false; fl.renderOrder = 9; fl.userData = { noPick: true, ph: flames.length * 1.3 };
          MG.add(fl); flames.push(fl);
          // the ladder in the plane of the shaft and this cup, its foot RB from the shaft, its head just under the cup
          const ux = mx + dx * (RB + RT) / 2, uz = mz + dz * (RB + RT) / 2, uy = (Y0 + TOPY - 0.6) / 2;
          for (const sd of [-0.5, 0.5]) rails.push([ux + dz * sd, uy, uz - dx * sd, yaw, tilt]);
          for (let h = 0.9; h < TOPY - 0.6 - Y0; h += 0.9) {
            const k = h / (TOPY - 0.6 - Y0), r = RB + (RT - RB) * k;
            rungs.push([mx + dx * r, Y0 + h, mz + dz * r, yaw]);
          }
        });
        const halo = new Sprite(new SpriteMaterial({ map: htx, transparent: true, depthWrite: false, blending: AdditiveBlending }));
        halo.position.set(mx, TOPY + 1, mz); halo.scale.set(16, 16, 1); halo.visible = false; halo.userData = { noPick: true }; MG.add(halo); halos.push(halo);
      }
      {
        const mm = new Matrix4(), q = new Quaternion(), e = new Euler(), vp = new Vector3(), vs = new Vector3(1, 1, 1);
        const rI = new InstancedMesh(new BoxGeometry(0.14, railLen, 0.14), M2.cedar, rails.length);
        rails.forEach(([x, y, z, yaw, t], i) => { e.set(0, 0, 0); q.setFromEuler(e.set(-t, yaw, 0, "YXZ")); mm.compose(vp.set(x, y, z), q, vs); rI.setMatrixAt(i, mm); });
        const gI = new InstancedMesh(new BoxGeometry(1.0, 0.09, 0.09), M2.cedar, rungs.length);
        rungs.forEach(([x, y, z, yaw], i) => { q.setFromEuler(e.set(0, yaw, 0, "YXZ")); mm.compose(vp.set(x, y, z), q, vs); gI.setMatrixAt(i, mm); });
        for (const im of [rI, gI]) { im.instanceMatrix.needsUpdate = true; im.castShadow = false; im.receiveShadow = true; im.userData.noPick = true; MG.add(im); }
      }
      // the sixteen young priests, each in a group of his own (it climbs); his face to the shaft, a jar in his hands
      const jarG = new LatheGeometry([[0, 0], [0.16, 0], [0.24, 0.12], [0.25, 0.34], [0.14, 0.52], [0.1, 0.6], [0.13, 0.66], [0, 0.66]].map(([r, y]) => new Vector2(r, y)), 12);
      const jarM = new MeshStandardMaterial({ color: 0xb06a3c, roughness: 0.85 });
      const YS = 1.3, YOUTHS = [];
      try {
        const PPy = tm_people(ctx2);
        SPOTS.forEach(([mx, mz], si) => DIRS.forEach(([dx, dz], di) => {
          const G = new Group();
          // SIMCHA_POUR_214 (the user, 16.11.2026 17:23: "השפיכה מאבדת את הכן ושוכפת החוצה"): he climbs ON the ladder, 0.22 out from its
          // rungs all the way, and stops on its highest rung (TOPY - 1.3; until 2.0.13 he went up 0.6..0.7 out from it, in the air, and
          // stopped 3 under the cups' arms - his head at the cup's level and the jar under its rim): the cup at his waist, the jar at his chest
          const foot = [mx + dx * (RB + 0.22), Y0, mz + dz * (RB + 0.22)], top = [mx + dx * (RT + 0.26), TOPY - 1.3, mz + dz * (RT + 0.26)];
          G.position.set(foot[0], foot[1], foot[2]);
          G.rotation.y = Math.atan2(-dx, -dz);   // his face to the shaft
          MG.add(G);
          PPy.crowd(G, [[0, 0, 0]], { y: 0, s: YS, pose: "stand", kind: "kohen", robe: 0xf1ede2, tone: () => (si + di) % 3, exact: true, name: "pirchaKehunah" });
          const jar = new Mesh(jarG, jarM); jar.position.set(0, 1.05 * YS, 0.36 * YS); jar.castShadow = true; G.add(jar);
          // the oil's stream from the jar's mouth into the cup (SIMCHA_POUR_214): a thin rod, set every frame of the pouring
          const run = new Mesh(new CylinderGeometry(0.035, 0.05, 1, 8, 1, true).translate(0, -0.5, 0), oilM); run.visible = false; run.userData.noPick = true; MG.add(run);
          YOUTHS.push({ G, jar, foot, top, cup: si * 4 + di, run, cx: mx + dx * CUPR, cz: mz + dz * CUPR });
        }));
      } catch (_) {}
      // NOTE 4 (the understandability review, U-42): the two labels were a few pixels high in the place's view - twice their size; and
      // the demonstration explains itself, as every other one, with captions in the Mishnah's words (Sukkah 5:2-3, 56:52-53), each shown
      // while its part runs (the climb; the pouring and the lighting, seen near; the whole court lit, seen from afar)
      ctx2.labels.push({ text: "״ומנורות של זהב היו שם, וארבעה ספלים של זהב בראשיהן״ (סוכה ה, ב)", x: 161, y: TOPY + 6.5, z: 0, size: 3.2, layer: "simchaMenorot" });
      ctx2.labels.push({ text: "״גובהה של מנורה חמשים אמה״ (סוכה נב:)", x: 141, y: TOPY + 3.2, z: -20, size: 2.2, layer: "simchaMenorot" });
      const CAPS = [[0, 8.5, "״וארבעה ילדים מפרחי כהנה, ובידיהם כדים של שמן של מאה ועשרים לג״ (סוכה ה, ב)", 161, TOPY - 6, 0, 3.0],
                    [8.5, 15.8, "״שהן מטילין לכל ספל וספל״ (סוכה ה, ב)", 141, TOPY + 6.2, -20, 1.2],
                    [15.8, 23.5, "״ולא היתה חצר בירושלים שאינה מאירה מאור בית השואבה״ (סוכה ה, ג)", 161, TOPY - 6, 0, 3.0]];
      const capL = CAPS.map((c, i) => {
        const gr = new Group(); gr.visible = false; MG.add(gr);
        ctx2.layers = ctx2.layers || {}; ctx2.layers["simchaCap" + i] = gr;
        ctx2.labels.push({ text: c[2], x: c[3], y: c[4], z: c[5], size: c[6], layers: ["simchaMenorot", "simchaCap" + i] });
        return gr;
      });
      const caps = (t) => CAPS.forEach((c, i) => { capL[i].visible = t >= c[0] && t < c[1]; });
      // the demonstration's clock (seconds from the start): 0-1.5 stand, 1.5-11.5 climb, 11.5-13.5 pour, 13.5-14.5 the wicks catch, 14.5-23 down
      const ss = (a, b, x) => { const t = Math.max(0, Math.min(1, (x - a) / (b - a))); return t * t * (3 - 2 * t); };
      const D = { t0: -1, lit: false, held: -1, fl: 0 };
      // SIMCHA_POUR_214: the jar is lifted to his chest before the pouring and tilted toward the cup: its mouth over the cup's middle,
      // 0.45 above the rim, its lowest edge 0.12 above it; the oil runs from the mouth down into the cup. Until 2.0.13 the jar rose
      // with him and was tilted beside the cup, under its rim, and no oil was seen.
      const _mo = new Vector3();
      const pose = (t) => {
        const up = ss(1.5, 11.5, t) * (1 - ss(14.5, 23, t)), pour = Math.sin(Math.PI * Math.max(0, Math.min(1, (t - 11.5) / 2)));
        const lift = ss(10.9, 11.5, t) * (1 - ss(13.5, 14.2, t));
        for (const Y of YOUTHS) {
          Y.G.position.set(Y.foot[0] + (Y.top[0] - Y.foot[0]) * up, Y.foot[1] + (Y.top[1] - Y.foot[1]) * up, Y.foot[2] + (Y.top[2] - Y.foot[2]) * up);
          Y.jar.rotation.x = 1.3 * pour;
          Y.jar.position.y = (1.05 + 0.36 * lift) * YS;
          const on = pour > 0.35;
          if (Y.run.visible !== on) Y.run.visible = on;
          if (on) {
            Y.G.updateMatrixWorld(true);
            Y.jar.localToWorld(_mo.set(0, 0.66, 0)); MG.worldToLocal(_mo);
            const yb = TOPY + 0.12;   // the oil's face in the cup
            Y.run.position.copy(_mo);
            Y.run.scale.y = Math.max(0.05, _mo.y - yb);
          }
        }
        oils.forEach((o) => { o.visible = t >= 12.3; });
        const lit = (i) => t >= 13.5 + (i % 4) * 0.25;
        flames.forEach((f, i) => { f.visible = lit(i); });
        halos.forEach((h, i) => { h.visible = t >= 13.6 + i * 0.15; });
        caps(t);
      };
      const reset = () => { caps(-1); D.t0 = -1; for (const Y of YOUTHS) { Y.G.position.set(Y.foot[0], Y.foot[1], Y.foot[2]); Y.jar.rotation.x = 0; Y.jar.position.y = 1.05 * YS; Y.run.visible = false; } oils.forEach((o) => { o.visible = false; }); flames.forEach((f) => { f.visible = false; }); halos.forEach((h) => { h.visible = false; }); };
      // SIMCHA_STOP_211 (the function review, F1-06 / F1-07; U-50): the demonstration was not among the registered ones - no pause bar, a
      // press on the model did not pause it, "מבט כללי" did not end it, and its two flights (set by the place's click, on timers) took
      // the eye back to the lamps from wherever the viewer had gone, in the presentation too. Now: stop / pause / resume / restart,
      // an entry in demoStops, and the two flights fired by the demonstration's own clock (so a stop or a pause holds them too).
      const FLY = [[8.5, [152, 58, -7], [141, 51, -20]], [15.8, [215, 60, 80], [161, 30, 0]]];
      SH.simchaDemo = {
        start() { if (!MG.visible) MG.visible = true; reset(); D.held = -1; D.fl = 0; D.t0 = performance.now() / 1000; },
        running() { return D.t0 >= 0; },
        stop() { D.held = -1; D.fl = 0; reset(); },
        pause() { if (D.t0 >= 0 && D.held < 0) D.held = performance.now() / 1000; },
        resume() { if (D.t0 >= 0 && D.held >= 0) { D.t0 += performance.now() / 1000 - D.held; D.held = -1; } },
        paused() { return D.held >= 0; }
      };
      (SH.demoStops || (SH.demoStops = [])).push({ id: "simcha-lamps", running: () => SH.simchaDemo.running(), stop: () => SH.simchaDemo.stop(),
        pause: () => SH.simchaDemo.pause(), resume: () => SH.simchaDemo.resume(), paused: () => SH.simchaDemo.paused(), restart: () => SH.simchaDemo.start() });
      SH.features = SH.features || {};
      SH.features.simchaMenorot = { key: "simchaMenorot", timed: false, isOn: () => MG.visible, on: () => { MG.visible = true; }, off: () => { MG.visible = false; reset(); } };
      if (Array.isArray(ctx2.animated)) ctx2.animated.push(() => {
        if (!MG.visible) return;
        const now = performance.now() / 1000;
        if (D.t0 >= 0 && D.held < 0) {
          const t = now - D.t0; pose(t);
          while (D.fl < FLY.length && t >= FLY[D.fl][0]) { const f = FLY[D.fl++]; try { if (typeof ctx2.flyTo === "function") ctx2.flyTo(f[1], f[2], 1600); } catch (_) {} }
          if (t > 23.5) { D.t0 = -1; caps(-1); }
        }
        for (const f of flames) if (f.visible) { const k = 0.85 + 0.15 * Math.sin(now * 9 + f.userData.ph) + 0.06 * Math.sin(now * 23 + f.userData.ph * 2); f.scale.set(0.9 * k, 1.8 * (0.9 + 0.2 * k), 1); }
      });
    }
  }
