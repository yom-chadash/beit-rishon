  // ===== 59-parallels.js (fix-c, 22.11.2026): THE FIRST TEMPLE'S COUNTERPARTS OF PLACES THAT ONLY THE SECOND TEMPLE HAD IN THE MODEL =====
  // The user went over chapter ב of the "same place" list (same-place-list.md, 09:38: "לבצע") - a place of the Second Temple with no
  // counterpart in the First is added here too and linked by the card's button "אותו מקום" (UI_SAME_PAIRS_C in shared/70-ui.js). Each
  // piece copies the Second Temple's own (sheni/src) and fits it to this house: the court 187 x 135 at y 6 (LV.AZ), the great court
  // 500 x 500 at y 0, the outer court x 93.5..228.5 at y 3, the bronze altar of II Chr 4:1 (40-altar.js: its group "altar" moves with the
  // row "מקום המזבח", ctx.shared.altarPlace; its measures with ctx.shared.altarYose). Built here:
  //   1. the synagogue and the house of study on the Temple Mount (Yoma 7:1; Rashi Yoma 68b; the Tosefta, Chagigah 2:4) - plain houses
  //      in the great court at the Second Temple model's places (x 161 / 40, z 112);
  //   2. "בין האולם ולמזבח" - its zone on the floor, lit for 15 s by its place (Kelim 1:9; Joel 2:17);
  //   3. the two tables west of the ramp - "שלחן החלבים" (Shekalim 6:4; Tamid 7:3), by the altar's south-west corner as the Ra'avad;
  //   4. the three firepans (Yoma 4:4; Yoma 44b), a hidden group shown by their place;
  //   5. the portions of Yehudah and Binyamin (Yoma 12a; Zevachim 53b) by the row "יסוד המזבח בדרום" (Tosafot Zevachim 61b / R. Tam);
  //   6. the windows of Beit HaChalifot where the knives were kept (Middot 4:7; Rashi Sukkah 56a), one for each of the 24 watches of
  //      I Chr 24 - in the north wing; Bilga's is open: its window was shut "כשנכנסו יוונים להיכל" (Sukkah 56b), in the Second Temple.
  // Every measure and place without a source is a model choice, so marked in the cards (src/slots/70-ui.slots.js, PARALLELS_C).
  function par_mergeInto(parent, tmp, opts) {   // the meshes of a temporary group merged by material into the parent (few draw calls)
    tmp.updateMatrixWorld(true);
    const byMat = new Map();
    tmp.traverse((o) => { if (o.isMesh) { if (!byMat.has(o.material)) byMat.set(o.material, []); byMat.get(o.material).push(o.geometry.clone().applyMatrix4(o.matrixWorld)); } });
    const out = [];
    for (const [mat, list] of byMat) {
      const m = new Mesh(mergeGeometries(list), mat);
      m.castShadow = !!(opts && opts.shadow);
      m.receiveShadow = true;
      if (opts && opts.noPick) m.userData.noPick = true;
      parent.add(m);
      out.push(m);
    }
    return out;
  }
  // a label's sprite follows its label object when the label is moved (the labels are sprites made once by 70-ui.js)
  function par_moveLabel(ctx, l, x, y, z) {
    const ox = l.x, oy = l.y, oz = l.z;
    l.x = x; l.y = y; l.z = z;
    let lg = null;
    try { lg = ctx.root.getObjectByName("labels"); } catch (_) {}
    if (lg) for (const spr of lg.children) {
      if ((spr.userData && spr.userData.label === l) || (Math.abs(spr.position.x - ox) < 1e-3 && Math.abs(spr.position.y - oy) < 1e-3 && Math.abs(spr.position.z - oz) < 1e-3)) { spr.position.set(x, y, z); break; }
    }
  }

  async function buildParallels(ctx) {
    const M2 = ctx.M, H2 = ctx.H, CO2 = ctx.CO, LV2 = ctx.LV;
    const g = new Group();
    g.name = "parallels";
    ctx.root.add(g);
    ctx.layers = ctx.layers || {};
    ctx.shared.features = ctx.shared.features || {};
    const AZ = LV2.AZ;   // 6: the inner court's floor
    // the altar's frame (40-altar.js): its group moves along z with the row "מקום המזבח"; the measures go by the row "מידות המזבח"
    const altarG = () => { try { return ctx.root.getObjectByName("altar"); } catch (_) { return null; } };
    const yose = () => !!(ctx.shared.altarYose && ctx.shared.altarYose.current === "yose");
    const altarDz = () => { const A = ctx.shared.altarPlace; return A && A.dz && A.current in A.dz ? A.dz[A.current] + (A.extra || 0) : 10; };
    const ACX = (CO2.xAltarW + CO2.xAltarE) / 2;   // 55
    // the altar's base (the wall below the sovev) and its yesod's outline, in the altar's own frame (z round 0)
    const base = () => (yose() ? { x0: ACX - 13, x1: ACX + 13, z0: -13, z1: 13, yw: ACX - 14, ys: 14 } : { x0: ACX - 11, x1: ACX + 11, z0: -11, z1: 11, yw: ACX - 12, ys: 12 });
    const watchers = [];   // functions called when the altar's place or measures change (ZONES_FOLLOW_211 as in the Second Temple)
    {
      let k0 = "";
      ctx.animated.push(() => {
        const A = ctx.shared.altarPlace, R = ctx.shared.altarRTam;
        const k = (A ? A.current + ":" + (A.extra || 0) : "") + "|" + (yose() ? "y" : "c") + "|" + (R ? R.current : "");
        if (k === k0) return;
        k0 = k;
        for (const f of watchers) { try { f(); } catch (e) { console.warn("[parallels] follow", e && e.message); } }
      });
    }

    // ---------- 1. THE SYNAGOGUE AND THE HOUSE OF STUDY ON THE TEMPLE MOUNT (SYNAGOGUE_B2 / MIDRASH_B2 of the Second Temple's 20-mount.js) ----------
    // Yoma 7:1 (55:55) "חזן הכנסת נוטל ספר תורה ונותנו לראש הכנסת"; Rashi Yoma 68b (2157:2562) "בית הכנסת - היה סמוך לעזרה בהר הבית"; the
    // Tosefta, Chagigah 2:4 (200:17) "ובשבתות ובימים טובים נכנסין לבית המדרש שבהר הבית" (Sanhedrin 88b, 125:3450: "יושבין בחיל"). The
    // sources speak of the Second Temple's days; in this house the user's decision (same-place-list, 09:38: "לבצע"): the same plain houses
    // at the same places - in the great court, south of the outer court (x 161) and south of the inner court (x 40), z 112. Their places,
    // sizes and forms - model choices.
    {
      const plainHouse = (name, X, Z, W, D, HH, text) => {
        const SY = new Group(); SY.name = name; g.add(SY); ctx.layers[name] = SY;
        H2.wall(SY, { axis: "x", length: W, height: HH, thickness: 1.2, mat: M2.stoneLight, cx: X, cz: Z - D / 2, y: LV2.HAR, openings: [{ center: 0, width: 3, height: 6 }] });
        H2.wall(SY, { axis: "x", length: W, height: HH, thickness: 1.2, mat: M2.stoneLight, cx: X, cz: Z + D / 2, y: LV2.HAR, openings: [] });
        H2.wall(SY, { axis: "z", length: D - 1.2, height: HH, thickness: 1.2, mat: M2.stoneLight, cx: X - W / 2 + 0.6, cz: Z, y: LV2.HAR, openings: [] });
        H2.wall(SY, { axis: "z", length: D - 1.2, height: HH, thickness: 1.2, mat: M2.stoneLight, cx: X + W / 2 - 0.6, cz: Z, y: LV2.HAR, openings: [] });
        H2.box(SY, W + 1.2, 0.8, D + 1.2, M2.stone, X, LV2.HAR + HH, Z);                         // the roof
        H2.box(SY, W, 0.2, D, M2.paveFine, X, LV2.HAR + 0.02, Z);                                // the floor
        const dark = new MeshBasicMaterial({ color: 0x1d1610 });
        const nw = Math.floor((W - 6) / 3);
        for (let i = 0; i < nw; i++) for (const sd of [-1, 1]) {                                  // windows high in the long walls
          const w = new Mesh(new PlaneGeometry(1.2, 2.2), dark); w.position.set(X - (nw - 1) * 1.5 + i * 3, LV2.HAR + HH - 3, Z + sd * (D / 2 + 0.62)); w.rotation.y = sd > 0 ? 0 : Math.PI; w.userData.noPick = true; SY.add(w);
        }
        H2.box(SY, 4.4, 0.6, 2, M2.stoneSmooth, X, LV2.HAR, Z - D / 2 - 1.6);                    // a step before the door (the door toward the courts, north)
        ctx.labels.push({ text, x: X, y: LV2.HAR + HH + 4, z: Z, size: 2.2, layer: name });
      };
      plainHouse("harSynagogue", 161, 112, 24, 16, 13, "בית הכנסת שבהר הבית — ״היה סמוך לעזרה בהר הבית״ (רש״י יומא סח:)");
      plainHouse("harMidrash", 40, 112, 20, 14, 11, "בית המדרש שבהר הבית (תוספתא חגיגה ב, ד)");
    }

    // ---------- 2. "בין האולם ולמזבח" - THE ZONE ON THE FLOOR (as the Second Temple's zoneUlamAltar, 30-courts.js) ----------
    // From the ulam's front (x 18.5) to the altar's yesod (x 43, or 41 with R. Yose's altar), over the court's whole breadth (the Second
    // Temple's default). Kelim 1:9 "בין האולם ולמזבח מקודש ממנו, שאין בעלי מומין ופרועי ראש נכנסים לשם"; Joel 2:17 "בין האולם ולמזבח
    // יבכו הכהנים משרתי ה׳". The breadth and the end at the yesod - model choices. A place's feature (15 s).
    {
      const ZG = new Group();
      ZG.name = "zoneUlamAltar";
      ZG.visible = false;
      g.add(ZG);
      ctx.layers.zoneUlamAltar = ZG;
      const pm = new MeshBasicMaterial({ color: 0xff5a5a, transparent: true, opacity: 0.3, depthWrite: false }), fm = new MeshBasicMaterial({ color: 0xff5a5a });
      const unit = new BoxGeometry(1, 1, 1);
      const parts = [];
      for (let i = 0; i < 5; i++) { const m = new Mesh(unit, i ? fm : pm); m.userData.noPick = true; m.renderOrder = 2; ZG.add(m); parts.push(m); }
      const zl = { text: "בין האולם ולמזבח", x: 30, y: AZ + 3, z: 0, size: 2.2, layer: "zoneUlamAltar" };
      ctx.labels.push(zl);
      const z0 = -(CO2.AZ_W / 2 - 2.5), z1 = CO2.AZ_W / 2 - 2.5;   // between the walls' inner faces (z -+65)
      const fit = () => {
        const x0 = CO2.xUlamE, x1 = base().yw, y = AZ;
        const set = (m, w, h, d, x, yy, z) => { m.scale.set(w, h, d); m.position.set(x, yy, z); };
        set(parts[0], x1 - x0, 0.04, z1 - z0, (x0 + x1) / 2, y + 0.07, (z0 + z1) / 2);
        set(parts[1], x1 - x0, 0.22, 0.6, (x0 + x1) / 2, y + 0.11, z0);
        set(parts[2], x1 - x0, 0.22, 0.6, (x0 + x1) / 2, y + 0.11, z1);
        set(parts[3], 0.6, 0.22, z1 - z0, x0, y + 0.11, (z0 + z1) / 2);
        set(parts[4], 0.6, 0.22, z1 - z0, x1, y + 0.11, (z0 + z1) / 2);
        par_moveLabel(ctx, zl, (x0 + x1) / 2, y + 3, -30);
      };
      fit();
      watchers.push(fit);
      let on = false;
      ctx.shared.features.zoneUlamAltar = { key: "zoneUlamAltar", isOn: () => on, on: () => { on = true; fit(); ZG.visible = true; }, off: () => { on = false; ZG.visible = false; } };
      ctx.shared.ulamAltar = { get x1() { return base().yw; } };
    }

    // ---------- 3. THE TWO TABLES WEST OF THE RAMP - "שלחן החלבים" (SHULCHAN_210 of the Second Temple's 40-altar.js) ----------
    // Shekalim 6:4 (54:41) "ושנים במערב הכבש, אחד של שיש ואחד של כסף, על של שיש היו נותנים את האברים, על של כסף כלי שרת"; the marble
    // one is "שלחן החלבים" of Tamid 7:3 (88:40; the Rambam's commentary there; the Bartenura), by the altar's south-west corner as the
    // Ra'avad (Melechet Shlomo, Tamid 7:3; 1202:319) "שהרי במערבו של כבש היה השלחן היינו בקרן מערבית דרומית". In the altar's group (they
    // go with the row "מקום המזבח"); with R. Yose's altar (28) 2 west and 2 south. West of the path to the yesod (Rashi's small ramp, which
    // runs askew from the big ramp to the yesod's corner) and of the shitin's slab; 1.2 x 1.6, an amah and a half high ("שהוא גבוה" - the
    // Rosh, Tamid 33b). The measures and the exact spot - model choices. ctx.shared.rampTables = { marble: [x, z], silver: [x, z], top }
    // in the world's frame (getters), for the demonstrations (the trumpeters stand on the marble one - the user's decision 102).
    {
      const TG = new Group();
      TG.name = "rampTables";
      const silver = M2.bronze.clone();
      silver.color.set(0xcccccc);
      silver.color.set(0xe2e4e8);
      silver.metalness = 0.55;
      silver.roughness = 0.32;
      silver.emissive = new Color(0x2a2a2e);
      silver.emissiveIntensity = 0.5;
      const TW = 1.2, TD = 1.6, LEG = 1.25, TT = 0.25;
      const MB = [ACX - 15.4, 13.6], SV = [ACX - 15.4, 15.8];   // x 39.6 (the yesod's west face at 43), z 13.6 / 15.8 (its south face at 12): off the view of the small ramps (flyPoints.mizbeachRamps)
      const mkTable = (mat, tx, tz) => {
        H2.box(TG, TW, TT, TD, mat, tx, AZ + LEG, tz);
        for (const lx of [-1, 1]) for (const lz of [-1, 1]) H2.box(TG, 0.16, LEG, 0.16, mat, tx + lx * (TW / 2 - 0.12), AZ, tz + lz * (TD / 2 - 0.12));
      };
      mkTable(M2.marble, MB[0], MB[1]);
      mkTable(silver, SV[0], SV[1]);
      const ag = altarG();
      (ag || g).add(TG);
      const L1 = { text: "שלחן של שיש — שלחן החלבים", x: MB[0] - 0.8, y: AZ + 5.6, z: MB[1], size: 0.9 };
      const L2 = { text: "שלחן של כסף — לכלי שרת", x: SV[0] - 0.8, y: AZ + 4.8, z: SV[1], size: 0.9 };
      ctx.labels.push(L1, L2);
      const off = () => (yose() ? [-2, 2] : [0, 0]);
      const follow = () => {
        const [ox, oz] = off(), dz = ag ? altarDz() : 0;
        TG.position.set(ox, 0, oz);
        par_moveLabel(ctx, L1, MB[0] + ox - 0.8, AZ + 5.6, MB[1] + oz + dz);
        par_moveLabel(ctx, L2, SV[0] + ox - 0.8, AZ + 4.8, SV[1] + oz + dz);
      };
      follow();
      watchers.push(follow);
      ctx.shared.rampTables = {
        get marble() { const [ox, oz] = off(); return [MB[0] + ox, MB[1] + oz + altarDz()]; },
        get silver() { const [ox, oz] = off(); return [SV[0] + ox, SV[1] + oz + altarDz()]; },
        top: LEG + TT, floor: AZ
      };
      ctx.shared.flyPoints = ctx.shared.flyPoints || {};
    }

    // ---------- 4. THE THREE FIREPANS (the Second Temple's 50-heichal.js, section 3) ----------
    // Mishnah Yoma 4:4 (55:34) "בכל יום היה חותה בשל כסף ומערה בתוך של זהב, והיום חותה בשל זהב ובה היה מכניס. בכל יום חותה בשל ארבעת
    // קבין ומערה בתוך של שלשת קבין... בכל יום היתה כבדה, והיום קלה. בכל יום היתה ידה קצרה, והיום ארכה. בכל יום היה זהבה ירוק, והיום אדם";
    // Yoma 44b (107:1129-1130) "גלדה עבה, והיום רך"; "והיום היה לה ניאשתיק" - Rashi (2157:1718) "טבעת בראשה". Side by side on the court's
    // floor by the altar's south-west corner, west of the two tables, only to be compared: their measures, forms and place - model
    // choices. A hidden group in the altar's group, shown by its place (the feature "machtot").
    {
      const MG = new Group();
      MG.name = "machtot";
      MG.visible = false;
      const ag = altarG();
      (ag || g).add(MG);
      ctx.layers.machtot = MG;
      const silverM = new MeshStandardMaterial({ color: 0xd9d9de, metalness: 0.85, roughness: 0.3 });
      const goldGreen = new MeshStandardMaterial({ color: 0xc8b04a, metalness: 0.9, roughness: 0.32 });
      const goldRed = new MeshStandardMaterial({ color: 0xd88a3a, metalness: 0.9, roughness: 0.3 });
      const coalM = new MeshStandardMaterial({ color: 0x2a1408, emissive: 0xc8400c, emissiveIntensity: 0.8, roughness: 0.9 });
      const part = (q, geo, mat, x, y, z) => { const m = new Mesh(geo, mat); m.position.set(x, y, z); m.castShadow = true; q.add(m); return m; };
      // a pan: the floor and four sides, w x d, h high, the sides th thick (an open box)
      const pan = (q, mat, w, h, d, th) => {
        part(q, new BoxGeometry(w, th, d), mat, 0, th / 2, 0);
        part(q, new BoxGeometry(w, h, th), mat, 0, h / 2, d / 2 - th / 2);
        part(q, new BoxGeometry(w, h, th), mat, 0, h / 2, -d / 2 + th / 2);
        part(q, new BoxGeometry(th, h, d), mat, w / 2 - th / 2, h / 2, 0);
        part(q, new BoxGeometry(th, h, d), mat, -w / 2 + th / 2, h / 2, 0);
      };
      const MX = ACX - 17.6, MZ = [13.2, 14.8, 16.4];   // x 37.4, west of the tables (x 39..40.2)
      const one = (z, mat, w, d, h, th, handle, coals, ring) => {
        const q = new Group();
        q.position.set(MX, AZ, z);
        q.rotation.y = Math.PI / 2;          // the pan's own z -> the world's x; its handle (toward -z) -> the west
        MG.add(q);
        pan(q, mat, w, h, d, th);
        part(q, new BoxGeometry(0.05, 0.04, handle), mat, 0, h * 0.62, -d / 2 - handle / 2);
        if (coals) part(q, new BoxGeometry(w - 2 * th - 0.02, 0.05, d - 2 * th - 0.02), coalM, 0, h * 0.55, 0);
        if (ring) { const r = part(q, new TorusGeometry(0.06, 0.014, 8, 18), mat, 0, h * 0.62 - 0.065, -d / 2 - handle); r.rotation.y = Math.PI / 2; }
      };
      one(MZ[0], silverM, 0.5, 0.62, 0.2, 0.045, 0.34, false, false);      // every day: of silver, four kav
      one(MZ[1], goldGreen, 0.46, 0.56, 0.18, 0.045, 0.34, true, false);    // every day: of gold, three kav, thick, a short handle
      one(MZ[2], goldRed, 0.46, 0.56, 0.18, 0.018, 0.95, true, true);       // the day's: of red gold, three kav, thin, a long handle, the ring
      const LB = [
        { text: "1 · בכל יום — של כסף, ארבעת קבין", x: MX + 0.3, y: AZ + 0.95, z: MZ[0], size: 0.4, layer: "machtot" },
        { text: "2 · בכל יום — של זהב, שלושת קבין", x: MX + 0.3, y: AZ + 1.55, z: MZ[1], size: 0.4, layer: "machtot" },
        { text: "3 · ביום הכיפורים — זהב אדום, ידה ארוכה", x: MX + 0.3, y: AZ + 2.15, z: MZ[2], size: 0.4, layer: "machtot" }
      ];
      const PAN_INFO = ["של כסף, ארבעת קבין — ״בכל יום היה חותה בשל כסף״", "של זהב, שלושת קבין — ״ומערה בתוך של זהב״", "של זהב אדום, ידה ארוכה — ״והיום חותה בשל זהב ובה היה מכניס״"];
      const LN = ["1", "2", "3"].map((n, i) => ({ text: n, x: MX, y: AZ + 0.42, z: MZ[i], size: 0.3, layer: "machtot", title: "מחתה " + n,
        info: "מחתה " + n + ": " + PAN_INFO[i] + " (יומא ד, ד). ראו בלוח: ״שלוש המחתות — בכל יום וביום הכיפורים״.", refs: [["יומא ד, ד", { book: 55, index: 34 }]] }));
      ctx.labels.push(...LB, ...LN);
      const follow = () => {
        const ox = yose() ? -2 : 0, oz = yose() ? 2 : 0, dz = ag ? altarDz() : 0;
        MG.position.set(ox, 0, oz);
        LB.forEach((l, i) => par_moveLabel(ctx, l, MX + 0.3 + ox, l.y, MZ[i] + oz + dz));
        LN.forEach((l, i) => par_moveLabel(ctx, l, MX + ox, l.y, MZ[i] + oz + dz));
      };
      follow();
      watchers.push(follow);
      ctx.shared.features.machtot = { key: "machtot", isOn: () => MG.visible, on: () => { follow(); MG.visible = true; }, off: () => { MG.visible = false; } };
      ctx.shared.machtotAt = () => { const ox = yose() ? -2 : 0, oz = yose() ? 2 : 0; return [MX + ox, AZ, MZ[1] + oz + altarDz()]; };
    }

    // ---------- 5. THE PORTIONS OF YEHUDAH AND BINYAMIN (TRIBES_211 of the Second Temple's 57-add208.js) ----------
    // Yoma 12a (107:256): "מה היה בחלקו של יהודה — הר הבית, הלשכות והעזרות. ומה היה בחלקו של בנימין — אולם והיכל ובית קדשי הקדשים, ורצועה
    // היתה יוצאה מחלקו של יהודה ונכנסת לחלקו של בנימין, ובה היה מזבח בנוי"; Rashi there (2157:332); Zevachim 53b (130:1866) "וקרן מזרחית
    // דרומית לא היה לה יסוד... לפי שלא היתה בחלקו של טורף... מזבח אוכל בחלקו של יהודה אמה" (Rashi 2191:2590-2591 "אמה במזרחו אמה
    // בדרומו"). IN THIS HOUSE by the row "יסוד המזבח בדרום — ומקום המזבח" (ctx.shared.altarRTam, 40-altar.js): R. Tam's reading - the
    // First Temple's yesod ran as the Second's, so the portions as there: the east amah (its north end's amah out) and the south amah
    // (its west end's amah out) in Yehudah's, the strip from that south amah to the court's south wall; Tosafot's conclusion (the default)
    // - Tosafot Zevachim 61b (1936:659) "ובבית ראשון היה להם יסוד לדרום שהיה משוך בחלקו של טורף חוץ מרוח מזרחית שלא נשתנה שהיה בלא
    // יסוד (עד) חלקו של יהודה כמו בבית שני": the east amah as there; the south yesod in Binyamin's, and the strip south of it - three amot
    // south of the yesod's outline (the four amot the returnees added in the south, less the amah the altar ate in Yehudah's; how far -
    // a model choice, a question for the user). Gold - Yehudah's, blue - Binyamin's, dark gold - the strip. A place's feature (untimed).
    {
      const TG = new Group();
      TG.name = "tribes";
      TG.visible = false;
      g.add(TG);
      ctx.layers.tribes = TG;
      const unit = new BoxGeometry(1, 1, 1);
      const mk = (color, op) => {
        const g2 = new Group();
        const pm = new MeshBasicMaterial({ color, transparent: true, opacity: op, depthWrite: false }), fm = new MeshBasicMaterial({ color });
        const pool = [];
        TG.add(g2);
        const piece = (i, mat) => { if (!pool[i]) { pool[i] = new Mesh(unit, mat); pool[i].userData.noPick = true; pool[i].renderOrder = 2; g2.add(pool[i]); } pool[i].visible = true; pool[i].material = mat; return pool[i]; };
        let n = 0;
        return { begin() { n = 0; }, end() { for (let i = n; i < pool.length; i++) pool[i].visible = false; },
          fit(x0, x1, z0, z1, y, edges = [1, 1, 1, 1]) {
            if (x1 - x0 < 0.05 || z1 - z0 < 0.05) return;
            const d = z1 - z0, zc = (z0 + z1) / 2, w = x1 - x0, xc = (x0 + x1) / 2;
            const p0 = piece(n++, pm); p0.scale.set(w, 0.04, d); p0.position.set(xc, y + 0.08, zc);
            if (edges[0]) { const b = piece(n++, fm); b.scale.set(w, 0.22, 0.45); b.position.set(xc, y + 0.13, z0); }
            if (edges[1]) { const b = piece(n++, fm); b.scale.set(w, 0.22, 0.45); b.position.set(xc, y + 0.13, z1); }
            if (edges[2]) { const b = piece(n++, fm); b.scale.set(0.45, 0.22, d); b.position.set(x0, y + 0.13, zc); }
            if (edges[3]) { const b = piece(n++, fm); b.scale.set(0.45, 0.22, d); b.position.set(x1, y + 0.13, zc); }
          },
          column(x0, x1, z0, z1, y0, y1) { const c = piece(n++, pm); c.scale.set(x1 - x0, y1 - y0, z1 - z0); c.position.set((x0 + x1) / 2, (y0 + y1) / 2, (z0 + z1) / 2); } };
      };
      const YE = mk(0xe39b12, 0.52), YS = mk(0xd98a00, 0.6), BI = mk(0x3d7fd6, 0.42);
      const TL1 = { text: "חלקו של יהודה — ממזרח לקו: החצר שממזרח למזבח והחצר החיצונה (רש״י יומא יב.)", x: 0, y: AZ + 2.8, z: 0, size: 1.7, layer: "tribes" };
      const TL2 = { text: "חלקו של בנימין — המזבח, האולם, ההיכל ובית קדשי הקדשים", x: 0, y: AZ + 2.8, z: 0, size: 1.7, layer: "tribes" };
      const TL3 = { text: "", x: 0, y: AZ + 2.4, z: 0, size: 1.5, layer: "tribes" };
      const TL4 = { text: "", x: 0, y: AZ + 11.5, z: 0, size: 1.3, layer: "tribes" };
      const TL5 = { text: "הר הבית — צדו המזרחי בחלקו של יהודה (רש״י יומא יב.)", x: 290, y: 2.6, z: -120, size: 3.2, layer: "tribes" };
      // the strip's and the band's texts by the reading (two labels each; the one of the reading on - a layer of its own)
      const LT = new Group(), LR = new Group();
      LT.name = "tribesTosafot"; LR.name = "tribesRTam";
      g.add(LT, LR);
      ctx.layers.tribesTosafot = LT; ctx.layers.tribesRTam = LR;
      const TL3T = { text: "הרצועה — מחלקו של יהודה, מדרום ליסוד הדרומי, שהיה ״משוך בחלקו של טורף״ (תוספות זבחים סא:); מקומה — בחירת מודל", x: 0, y: AZ + 2.4, z: 0, size: 1.5, layers: ["tribes", "tribesTosafot"] };
      const TL3R = { text: "הרצועה — מחלקו של יהודה, מאמתו הדרומית של המזבח ועד כותל החצר (ר״ת; עד היכן — בחירת מודל)", x: 0, y: AZ + 2.4, z: 0, size: 1.5, layers: ["tribes", "tribesRTam"] };
      const TL4T = { text: "״מזבח אוכל בחלקו של יהודה אמה״ — במזרח; לכן אין יסוד בקרן דרומית מזרחית (זבחים נג:)", x: 0, y: AZ + 11.5, z: 0, size: 1.3, layers: ["tribes", "tribesTosafot"] };
      const TL4R = { text: "״מזבח אוכל בחלקו של יהודה אמה״ — במזרח ובדרום (זבחים נג:)", x: 0, y: AZ + 11.5, z: 0, size: 1.3, layers: ["tribes", "tribesRTam"] };
      void TL3; void TL4;
      ctx.labels.push(TL1, TL2, TL3T, TL3R, TL4T, TL4R, TL5);
      let on = false;
      const ZS = CO2.AZ_W / 2 - 2.5, ZN = -ZS, XE = CO2.AZ_L / 2 - 2.5, XW = -XE;   // the court between its walls' inner faces (z -+65, x -+91)
      const apply = () => {
        const b = base(), dz = altarDz(), rt = !!(ctx.shared.altarRTam && ctx.shared.altarRTam.current === "rtam");
        const ax0 = b.x0, ax1 = b.x1, aN = b.z0 + dz, aS = b.z1 + dz, sx0 = ax0 + 1;
        const sz0 = rt ? aS - 1 : (b.ys + dz) + 3;   // the strip's north edge: the south amah (R. Tam), or three amot south of the yesod (Tosafot)
        YE.begin(); YS.begin(); BI.begin();
        YE.fit(ax1, XE, ZN, ZS, AZ, [1, 1, 1, 1]);                                       // Yehudah's: the court east of the line on the altar's east face
        if (ctx.shared.newCourt) { const nc = ctx.shared.newCourt; YE.fit(nc.x0 + 1, nc.x1 - 1, nc.z0 + 1, nc.z1 - 1, nc.y, [1, 1, 1, 1]); }   // and the outer court
        YS.fit(sx0, ax1, sz0, ZS, AZ, [1, 1, 1, 0]);                                       // the strip, to the court's south wall
        YS.column(ax1 - 1, ax1, aN + 1, aS, AZ, AZ + 9.3);                                 // the altar's east band (its north end's amah out)
        if (rt) YS.column(sx0, ax1 - 1, aS - 1, aS, AZ, AZ + 9.3);                         // R. Tam: and its south band (its west end's amah out)
        BI.fit(XW, sx0, ZN, ZS, AZ, [1, 1, 1, 1]);                                         // Binyamin's: west of the strip's line, the whole breadth
        BI.fit(sx0, ax1, ZN, sz0, AZ, [1, 1, 0, 1]);                                       // and north of the strip, to the line on the altar's east face
        YE.end(); YS.end(); BI.end();
        LT.visible = !rt; LR.visible = rt;
        par_moveLabel(ctx, TL1, (ax1 + XE) / 2 + 1, AZ + 2.8, -30);
        par_moveLabel(ctx, TL2, -10, AZ + 2.8, -55);
        par_moveLabel(ctx, TL3T, (sx0 + ax1) / 2, AZ + 2.4, (sz0 + ZS) / 2 + 3);
        par_moveLabel(ctx, TL3R, (sx0 + ax1) / 2, AZ + 2.4, (sz0 + ZS) / 2 + 3);
        par_moveLabel(ctx, TL4T, ax1 + 1, AZ + 11.5, aS + 1);
        par_moveLabel(ctx, TL4R, ax1 + 1, AZ + 11.5, aS + 1);
        TG.visible = on;
      };
      watchers.push(() => { if (on) apply(); });
      ctx.shared.features.tribes = { key: "tribes", timed: false, isOn: () => on, on: () => { on = true; apply(); }, off: () => { on = false; TG.visible = false; LT.visible = LR.visible = false; } };
    }

    // ---------- 6. THE WINDOWS OF BEIT HACHALIFOT, WHERE THE KNIVES WERE KEPT (CHALIFOT_WINDOWS_B2 of the Second Temple's 50-heichal.js) ----------
    // Middot 4:7 (89:34) "והוא היה נקרא בית החליפות, ששם גונזים את הסכינים"; Sukkah 5:8 (56:58) "בלגה לעולם חולקת בדרום, וטבעתה קבועה,
    // וחלונה סתומה"; Rashi there (2163:2731) "חלונות היו בבית החליפות בעובי כותלי התאים שבצפונו של היכל ששם גונזין את סכיניהן כדתנן במסכת
    // מדות (פ"ד משנה ז) וסתמו חלונה של בילגה". Twenty-four windows, one for each of the watches of I Chr 24:7-18 (38:795-806), in the north
    // wing (50-heichal.js: the wing's room z -16..-36, x 2.5..12.5, its floor at 12), on its west face - the wall against the chambers'
    // run ("בעובי כותלי התאים"), three rows of eight, two knives in each. Bilga's (the fifteenth lot, I Chr 24:14) is OPEN here: "וכששמעו
    // חכמים בדבר, קבעו את טבעתה וסתמו את חלונה" - "כשנכנסו יוונים להיכל" (Sukkah 56b, 108:1467), in the Second Temple's days; for "ויש
    // אומרים: משמרתו שוהה לבא" (108:1468) no time is said - open, a model choice. Until fix-c the house had 24 plain niches of a model
    // choice in both wings (removed from 50-heichal.js). The windows' size, height and places - model choices.
    {
      const F = LV2.HEI, XF = CO2.xHouseE;   // 12; the wing room's west face, x 2.5
      const nDark = new MeshBasicMaterial({ color: 0x17110b });
      const bladeM = new MeshStandardMaterial({ color: 0xb9bcc0, metalness: 0.85, roughness: 0.3 });
      const handleM = new MeshStandardMaterial({ color: 0x5a3c22, roughness: 0.8 });
      const frameM = M2.stoneSmooth;
      const tmp = new Group();
      for (let r = 0; r < 3; r++) for (let c = 0; c < 8; c++) {
        const z = -18.2 - c * 2.3, y = F + 2.4 + r * 1.3, x = XF + 0.02;
        const d = new Mesh(new PlaneGeometry(0.8, 0.8), nDark); d.position.set(x, y, z); d.rotation.y = Math.PI / 2; tmp.add(d);
        for (const [fz, fy, fw, fh] of [[0, 0.46, 1.0, 0.12], [0, -0.46, 1.0, 0.12], [-0.46, 0, 0.12, 0.8], [0.46, 0, 0.12, 0.8]]) {
          const f = new Mesh(new BoxGeometry(0.1, fh, fw), frameM); f.position.set(XF + 0.05, y + fy, z + fz); tmp.add(f);
        }
        for (const sz of [-0.18, 0.12]) {   // two knives lying in the window, their handles to the north
          const b = new Mesh(new BoxGeometry(0.07, 0.012, 0.34), bladeM); b.position.set(XF + 0.07, y - 0.36, z + sz + 0.08); tmp.add(b);
          const h = new Mesh(new BoxGeometry(0.05, 0.03, 0.14), handleM); h.position.set(XF + 0.07, y - 0.36, z + sz - 0.16); tmp.add(h);
        }
      }
      const WG = new Group();
      WG.name = "chalifotWindows";
      g.add(WG);
      par_mergeInto(WG, tmp, { noPick: true });
      ctx.labels.push({ text: "בית החליפות — ״ששם גונזים את הסכינים״ (מידות ד, ז): כ״ד חלונות, אחד לכל משמר", x: XF + 1.2, y: F + 6.9, z: -26.25, size: 0.9 });
      ctx.shared.flyPoints = ctx.shared.flyPoints || {};
      // from the east and above, over the ulam's front and roof (the place opens them for 20 s, as the pill "פתח את האולם")
      ctx.shared.flyPoints.chalifotWindows = { pos: [27, F + 17, -26.25], target: [XF, F + 3.4, -26.25] };
    }

    // ---------- 7. THE PILGRIM'S WALK AT A MAN'S EYE (PILGRIM_B2 of the Second Temple's 57-add208.js) ----------
    // Middot 2:2 (89:13): "כל הנכנסין להר הבית נכנסין דרך ימין ומקיפין ויוצאין דרך שמאל, חוץ ממי שארעו דבר, שהוא מקיף לשמאל"; the
    // Bartenura there (643:64): "כגון הנכנסים דרך שערי חלדה שהן מן הימין, מקיפין דרך שער הטדי". IN THIS HOUSE (the user's decision 111:
    // the way by the First Temple's own building, which has one gate on each side and no women's court): in by the southern gate - named
    // here "שער חולדה" - from the landing of the king's ascent before it, to the right (east) along the south of the great court, north
    // along its east (by the outer court and the eastern gate), west along its north, and out by the northern gate - "שער טדי". The walk
    // engine of 50-heichal.js (ctx.shared.walk); the eye 3.2 over the floor. The way and the pace - model choices; the order is the
    // Mishnah's, said in the Second Temple's days (the card says so).
    {
      const EY = 3.2, Y = LV2.HAR + EY;
      const KEYS = [
        [0, [103, Y, 349], [103, Y, 320]], [4, [103, Y, 336], [103, Y, 300]], [7, [103, Y, 320], [126, Y, 314]],
        [10, [128, Y, 313], [200, Y, 311]], [18, [252, Y, 311], [318, Y, 292]], [24, [314, Y, 272], [318, Y, 200]],
        [31, [318, Y, 140], [318, Y, 60]], [37, [318, Y, 22], [348, Y, 0]], [41, [318, Y, -18], [318, Y, -100]],
        [47, [314, Y, -128], [250, Y, -140]], [55, [190, Y, -141], [120, Y, -145]], [61, [116, Y, -148], [103, Y + 2, -170]],
        [65, [103, Y, -158], [103, Y + 3, -190]], [68, [103, Y, -171], [103, Y - 8, -215]]
      ];
      const CAPS = [
        [0, "״כל הנכנסין להר הבית נכנסין דרך ימין ומקיפין ויוצאין דרך שמאל״ (מידות ב, ב)"],
        [4, "״כגון הנכנסים דרך שערי חלדה שהן מן הימין, מקיפין דרך שער הטדי״ (ברטנורא שם)"],
        [8, "נכנסים בשער הדרומי — שער חולדה — ופונים לימין, מזרחה"],
        [25, "צפונה, לאורך המזרח — מול החצר החיצונה והשער המזרחי"],
        [40, "״חוץ ממי שארעו דבר, שהוא מקיף לשמאל. מה לך מקיף לשמאל — שאני אבל, השוכן בבית הזה ינחמך״ (מידות ב, ב)"],
        [48, "מערבה, לאורך הצפון"],
        [60, "ויוצאים בשער הצפוני — שער טדי — דרך שמאל. המשנה נאמרה בימי הבית השני; המסלול בבית ראשון — בחירת מודל"]
      ];
      const PW = { run: false, saved: null };
      const finish = () => {
        PW.run = false;
        const sv = PW.saved;
        if (sv && sv.lg) sv.lg.visible = sv.labels;
        if (sv && sv.view && ctx.shared.viewLimits) ctx.shared.viewLimits.set(sv.view);
        if (sv && sv.fade != null && ctx.shared.fadeState) ctx.shared.fadeState.on = sv.fade;
        PW.saved = null;
      };
      const start = () => {
        const Wk = ctx.shared.walk;
        if (!Wk) return false;
        if (typeof ctx.shared.stopDemos === "function") ctx.shared.stopDemos("pilgrimWalk");
        let lg = null; try { lg = ctx.root.getObjectByName("labels"); } catch (_) {}
        PW.saved = { lg, labels: lg ? lg.visible : true, view: ctx.shared.viewLimits ? ctx.shared.viewLimits.get() : null, fade: ctx.shared.fadeState ? ctx.shared.fadeState.on : null };
        if (lg) lg.visible = false;
        if (ctx.shared.fadeState) ctx.shared.fadeState.on = false;   // at a man's eye nothing is see-through: the gates he walks through stay whole
        if (ctx.shared.viewLimits) for (const k of KEYS) { ctx.shared.viewLimits.include(k[1]); ctx.shared.viewLimits.include(k[2]); }
        PW.run = true;
        Wk.run(KEYS, CAPS, finish);
        return true;
      };
      const stop = () => { if (!PW.run) return; const Wk = ctx.shared.walk; if (Wk && Wk.on) Wk.stop(); else finish(); };
      const walkStop = () => (ctx.shared.demoStops || []).find((q) => q.id === "walk");
      (ctx.shared.demoStops || (ctx.shared.demoStops = [])).push({ id: "pilgrimWalk", running: () => PW.run, stop,
        pause: () => { const w = walkStop(); if (w && w.pause) w.pause(); },
        resume: () => { const w = walkStop(); if (w && w.resume) w.resume(); },
        paused: () => { const w = walkStop(); return !!(w && w.paused && w.paused()); }, restart: () => { stop(); start(); } });
      ctx.shared.pilgrimWalk = { start, stop, get on() { return PW.run; } };
    }

    // ---------- 8. THE WILLOW'S COMMANDMENT AND THE CIRCUIT OF THE ALTAR (ARAVAH_B2 of the Second Temple's 57-add208.js) ----------
    // Mishnah Sukkah 4:5 (56:44) "ובאין וזוקפין אותן בצדי המזבח, וראשיהן כפופין על גבי המזבח... בכל יום מקיפין את המזבח פעם אחת"; Sukkah
    // 45a (108:1165-1166) eleven amot, "כדי שיהו גוחות על גבי המזבח אמה"; "על היסוד מנח להו". From Rav Chaim Kanievsky, as brought in
    // Chalamish: many willows, thick at the foot, only where there is a yesod; perhaps not in the east and the south. IN THIS HOUSE: on the
    // yesod of the bronze altar (40-altar.js) along its north and west, as in the Second Temple (in Tosafot's reading of the First Temple's
    // yesod it ran along the south too, under the ramp - not drawn there: a model choice); eleven amot from the yesod's top (7) to 18, the
    // heads bent over the top (16). The circuit by the row "הקפת המזבח בערבה" (c1): priests alone (the default; Rashi Sukkah 43b), or
    // Israelites too (the Or Zarua in the name of the Yerushalmi). The way round the altar and its ramp keeps off the ten bases (45-vessels.js,
    // their block x 19..41) and the two tables. No tefillin - Chol HaMoed (ctx.shared.tefOff). The willows' number and form, the way, the
    // walkers' number and pace - model choices. In the altar's group: it goes with the row "מקום המזבח".
    {
      const AG = new Group();
      AG.name = "aravahDemo";
      AG.visible = false;
      const agp = altarG();
      (agp || g).add(AG);
      ctx.layers.aravahDemo = AG;
      const YT = AZ + 1;   // the yesod's top
      const AR = { circuit: "priests", built: false, walkers: { priests: [], all: [] }, t0: 0 };
      const trunkM = new MeshStandardMaterial({ color: 0x6d6a3e, roughness: 0.85 });
      const leafM = new MeshStandardMaterial({ color: 0x6f9a52, roughness: 0.8, side: DoubleSide });
      const leafIM = new MeshStandardMaterial({ color: 0xffffff, roughness: 0.75, side: DoubleSide });
      const WG = {};
      const willows = (key) => {
        if (WG[key]) return WG[key];
        const b = base();
        const WGr = WG[key] = new Group(); WGr.name = "aravahWillows_" + key; AG.add(WGr);
        const x0 = b.yw, x1 = b.x1 + 1, zN = -b.ys, zS = b.ys;   // the yesod's outline: west x0, north zN
        const trunks = [], leaves = [];
        let q = 22112026;
        const rr = () => (q = (q * 1664525 + 1013904223) >>> 0) / 4294967296;
        const tubeOf = (pts, r0, r1, segs) => {
          const curve = new CatmullRomCurve3(pts), tube = new TubeGeometry(curve, segs, 1, 6, false), pos = tube.attributes.position;
          for (let i = 0; i < pos.count; i++) {
            const ring = Math.floor(i / 7), u = ring / segs, c = curve.getPointAt(u), r = r0 + (r1 - r0) * Math.pow(u, 0.6);
            pos.setXYZ(i, c.x + (pos.getX(i) - c.x) * r, c.y + (pos.getY(i) - c.y) * r, c.z + (pos.getZ(i) - c.z) * r);
          }
          trunks.push(tube);
          return curve;
        };
        const leafAlong = (curve, u0, n, spread) => {
          for (let k = 0; k < n; k++) {
            const u = u0 + (1 - u0) * Math.sqrt(rr()), p = curve.getPoint(Math.min(1, u)), a = rr() * Math.PI * 2, sp = 0.04 + rr() * spread;
            leaves.push([p.x + Math.cos(a) * sp, p.y + (rr() - 0.3) * 0.2, p.z + Math.sin(a) * sp, rr() * Math.PI * 2, 0.25 + rr() * 0.75, rr()]);
          }
        };
        const willow = (fx, fz, ix, iz) => {
          const H = 10.6 + rr() * 0.8, reach = 2.5 + rr() * 0.6, px = -iz, pz = ix, sw = (rr() - 0.5) * 0.5, pts = [];
          for (let i = 0; i <= 10; i++) {
            const u = i / 10, y = YT + H * (u < 0.8 ? u : 0.8 + (u - 0.8) * 0.55);
            const bend = u < 0.72 ? 0.1 * u : 0.072 + Math.pow((u - 0.72) / 0.28, 1.5) * reach;   // the head bends over the altar
            pts.push(new Vector3(fx + ix * bend + px * sw * u, y, fz + iz * bend + pz * sw * u));
          }
          const main = tubeOf(pts, 0.17 + rr() * 0.05, 0.035, 16);
          leafAlong(main, 0.38, 60, 0.3);
          const nb = 3 + Math.floor(rr() * 3);
          for (let k = 0; k < nb; k++) {
            const u0 = 0.3 + rr() * 0.4, p0 = main.getPoint(u0), side = (k % 2 ? 1 : -1) * (0.5 + rr() * 0.6), len = 1.8 + rr() * 1.8, inw = 0.3 + rr() * 0.6;
            const P = (t, up) => new Vector3(p0.x + px * side * t + ix * inw * t * t, p0.y + up, p0.z + pz * side * t + iz * inw * t * t);
            const bc = tubeOf([P(0, 0), P(0.45, len * 0.5), P(0.85, len * 0.85), P(1.2, len * 0.9 - 0.5)], 0.05, 0.015, 8);
            leafAlong(bc, 0.25, 32, 0.22);
          }
        };
        for (let x = x0 + 0.5, k = 0; x < x1 - 0.3; x += 0.95 + (rr() - 0.5) * 0.35, k++) willow(x, k % 2 ? zN + 0.65 : zN + 0.3, 0, 1);   // along the north, on the yesod
        for (let z = zN + 1.3, k = 0; z < zS - 0.5; z += 0.95 + (rr() - 0.5) * 0.35, k++) willow(k % 2 ? x0 + 0.65 : x0 + 0.3, z, 1, 0);   // along the west
        const tm = new Mesh(mergeGeometries(trunks), trunkM); tm.castShadow = true; tm.userData.noPick = true; WGr.add(tm);
        const lgeo = new PlaneGeometry(0.075, 0.46).translate(0, -0.23, 0);
        const im = new InstancedMesh(lgeo, leafIM, leaves.length);
        const mm = new Matrix4(), qq = new Quaternion(), e = new Euler(), vp = new Vector3(), vs = new Vector3(1, 1, 1), col = new Color();
        leaves.forEach(([x, y, z, a, t, c], i) => {
          qq.setFromEuler(e.set(t, a, 0, "YXZ")); mm.compose(vp.set(x, y, z), qq, vs); im.setMatrixAt(i, mm);
          im.setColorAt(i, col.setHSL(0.23 + c * 0.06, 0.34 + c * 0.16, 0.24 + c * 0.12));
        });
        if (im.instanceColor) im.instanceColor.needsUpdate = true;
        im.castShadow = true;
        im.instanceMatrix.needsUpdate = true; im.userData.noPick = true; WGr.add(im);
        return WGr;
      };
      const build = () => {
        if (AR.built) return;
        AR.built = true;
        try {
          const PP = tm_people(ctx), branchG = new CylinderGeometry(0.02, 0.03, 1.6, 5).translate(0, 0.8, 0);
          const lulavG = new CylinderGeometry(0.018, 0.026, 1.9, 5).translate(0, 0.95, 0), etrogG = new SphereGeometry(0.1, 10, 8).scale(1, 1.35, 1);
          const lulavM = new MeshStandardMaterial({ color: 0x5f7a3a, roughness: 0.8 }), etrogM = new MeshStandardMaterial({ color: 0xd9c23a, roughness: 0.6 });
          const twig = new BoxGeometry(0.04, 0.3, 0.006);
          const mk = (kind, robe, list, n, name, israel) => {
            for (let i = 0; i < n; i++) {
              const G = new Group(); G.visible = false; AG.add(G);
              PP.crowd(G, [[0, 0, 0]], { y: 0, s: 1.4, pose: "stand", kind, robe: Array.isArray(robe) ? robe[i % robe.length] : robe, tone: () => i % 4, exact: true, avnet: kind === "kohen" ? undefined : false, name });
              if (israel) {
                const l = new Mesh(lulavG, lulavM); l.position.set(-0.36, 1.15, 0.3); l.rotation.x = 0.12; G.add(l);
                const et = new Mesh(etrogG, etrogM); et.position.set(0.36, 1.3, 0.32); G.add(et);
              } else {
                const br = new Mesh(branchG, leafM); br.position.set(-0.36, 1.15, 0.3); br.rotation.z = 0.25; G.add(br);
                for (let j = 0; j < 7; j++) { const t = new Mesh(twig, leafM); t.position.set(-0.36 + 0.25 * (0.4 + j * 0.09) + (j % 2 ? 0.06 : -0.06), 1.15 + 1.6 * (0.4 + j * 0.09), 0.3); t.rotation.z = j % 2 ? -0.6 : 0.6; G.add(t); }
              }
              list.push(G);
            }
          };
          mk("kohen", 0xf1ede2, AR.walkers.priests, 14, "aravahPriest", false);
          mk("worker", [0x6b5a3e, 0x4a4f5a, 0x5c4a3a, 0x3e4a5e, 0x7a6a50], AR.walkers.all, 18, "aravahIsraelite", true);
        } catch (e) { console.warn("[parallels] aravah walkers", e && e.message); }
      };
      // the labels follow the altar's place (pushed now: the labels are made once)
      const LB = [];
      for (const [text, x, y, z, size] of [
        ["״ובאין וזוקפין אותן בצדי המזבח, וראשיהן כפופין על גבי המזבח״ (סוכה ד, ה)", ACX, AZ + 15, -14.5, 1.6],
        ["הערבות על היסוד בלבד — מפי הגר״ח קניבסקי, כפי שהובא בחלמיש", ACX - 17, AZ + 13.2, 3.5, 1.2],
        ["״בכל יום מקיפין את המזבח פעם אחת, ואומרים, אנא ה׳ הושיעה נא״ (סוכה ד, ה)", ACX, AZ + 17.2, 13, 1.5]]) {
        const l = { text, x, y, z: z + 10, size, layer: "aravahDemo" };
        ctx.labels.push(l); LB.push([l, z]);
      }
      // the way round, in the altar's frame: round the altar and its ramp; west of the yesod by 1.6, and south of the yesod no further
      // west than x 41.9 (the bases' block reaches x 41, and it stays where it is when the altar moves)
      const pathOf = () => {
        const b = base(), foot = yose() ? 44 : 42, R = 2.5, P = [];
        const XW = b.yw - 1.6, XWS = Math.max(XW, 41.9), XE = b.x1 + 4, ZN = -b.ys - 2.5, ZS = foot + 3;
        const arc = (cx, cz, a0) => { for (let i = 0; i <= 6; i++) { const a = a0 + (Math.PI / 2) * i / 6; P.push([cx + R * Math.cos(a), cz + R * Math.sin(a)]); } };
        arc(XE - R, ZN + R, -Math.PI / 2); arc(XE - R, ZS - R, 0); arc(XWS + R, ZS - R, Math.PI / 2);
        if (XWS > XW + 0.01) { P.push([XWS, b.ys + 2.6]); P.push([XW, b.ys + 1.2]); }   // the jog round the yesod's south-west corner (R. Yose's)
        arc(XW + R, ZN + R, Math.PI);
        const L = [0]; for (let i = 1; i <= P.length; i++) { const a = P[i - 1], c = P[i % P.length]; L.push(L[i - 1] + Math.hypot(c[0] - a[0], c[1] - a[1])); }
        return { P, L, len: L[P.length] };
      };
      let PATH = null, pathKey = "";
      const at = (s) => {
        const { P, L, len } = PATH; s = ((s % len) + len) % len;
        let i = 1; while (i < L.length && L[i] < s) i++;
        const a = P[(i - 1) % P.length], c = P[i % P.length], u = (s - L[i - 1]) / Math.max(1e-6, L[i] - L[i - 1]);
        return [a[0] + (c[0] - a[0]) * u, a[1] + (c[1] - a[1]) * u, Math.atan2(a[0] - c[0], a[1] - c[1])];   // walking toward smaller s
      };
      const pose = () => {
        const t = (performance.now() - AR.t0) / 1000, sp = 2.4;
        const list = AR.circuit === "all" ? AR.walkers.priests.concat(AR.walkers.all) : AR.walkers.priests;
        for (const G of AR.walkers.priests.concat(AR.walkers.all)) if (!list.includes(G)) G.visible = false;
        if (!list.length || !PATH) return;
        const gap = PATH.len / list.length;
        list.forEach((G, i) => {
          const [x, z, yaw] = at(-t * sp + i * gap);
          G.position.set(x, AZ + Math.abs(Math.sin(t * 4.2 + i * 1.3)) * 0.05, z); G.rotation.y = yaw; G.visible = true;
        });
      };
      const sync = () => {
        const key = yose() ? "yose" : "chronicles", dz = agp ? altarDz() : 0;
        if (key !== pathKey) { PATH = pathOf(); pathKey = key; }
        const W = willows(key);
        for (const k in WG) WG[k].visible = WG[k] === W;
        for (const [l, z] of LB) if (Math.abs(l.z - (z + dz)) > 1e-6) par_moveLabel(ctx, l, l.x, l.y, z + dz);
      };
      const tefOn = (on) => { const TO = ctx.shared.tefOff || (ctx.shared.tefOff = new Set()); if (on) TO.add("aravah"); else TO.delete("aravah"); };
      ctx.shared.aravah = {
        get circuit() { return AR.circuit; },
        setCircuit(m) { AR.circuit = m === "all" ? "all" : "priests"; if (AG.visible) pose(); return AR.circuit; },
        show() { const F2 = ctx.shared.features.aravah; if (F2 && !F2.isOn()) F2.on(); }
      };
      ctx.shared.features.aravah = { key: "aravah", timed: false, isOn: () => AG.visible,
        on: () => { build(); sync(); AR.t0 = performance.now(); AG.visible = true; tefOn(true); pose(); },
        off: () => { AG.visible = false; tefOn(false); } };
      ctx.animated.push(() => { if (!AG.visible) return; sync(); pose(); });
    }

    // ---------- 9. THE WATER'S LIBATION FROM THE SHILOACH - A DEMONSTRATION (SHILOACH_305 / SHILOACH_CHALAMISH_B2 of the Second Temple) ----------
    // Mishnah Sukkah 4:9 (56:48): "נסוך המים כיצד. צלוחית של זהב מחזקת שלשת לגים היה ממלא מן השלוח. הגיעו לשער המים, תקעו והריעו ותקעו.
    // עלה בכבש ופנה לשמאלו, שני ספלים של כסף היו שם... מערבי של מים, מזרחי של יין... ולמנסך אומרים לו, הגבה ידך"; Sukkah 5:4 (56:54) - the
    // two priests with trumpets "בשער העליון שיורד מעזרת ישראל לעזרת נשים... עד שמגיעין לשער היוצא מזרח... הפכו פניהן למערב"; Tamid 7:3
    // (88:40) - the deputy on the horn with the sudar, the two on the table of the fats. IN THIS HOUSE (the user's decision 111): the way by
    // the First Temple's own building - no women's court and no gates of Chulda. The inner court's east gate (its round steps go down to the
    // outer court - Rashi on I Kings 6:36 calls that court "עזרת נשים") stands for "השער העליון", the outer court's east gate for "השער היוצא
    // מזרח"; out by the great court's east gate and down its stairs, to the spring (ctx.shared.shiloachSpring1: its place, the spout and the
    // stream - the shared builder of the Second Temple's spring, shared/frag/shiloach.js); back by the same stairs and across the great
    // court to the inner court's south-eastern gate, which stands for "שער המים" (the easternmost of the south, as Middot 1:4 orders the
    // Second Temple's gates - a model choice), up the ramp, to the left, into the western bowl (40-altar.js: the bowls by the south-west horn).
    // The card says the order is the Mishnah's, said in the Second Temple's days. At night by torches, back at dawn (as Chalamish draws the
    // Second Temple's); no tefillin (ctx.shared.tefOff). The way, its times and the figures' places - model choices.
    {
      const SP1 = () => ctx.shared.shiloachSpring1 || null;
      // the priests are the First Temple's own priest-kit figures (58-ark.js ark_priestFig: the white kutonet, the avnet, the migba'at),
      // a grip in each hand for the flask and the sudar
      const K = (() => { try { return typeof ark_kit === "function" && typeof ark_priestFig === "function" ? ark_kit() : null; } catch (_) { return null; } })();
      const clamp = (v, a, b) => Math.max(a, Math.min(b, v)), smooth = (u) => u * u * (3 - 2 * u), lerp = (a, b, u) => a + (b - a) * u;
      const fnc = (f) => typeof f === "function";
      const groundY = (x, z, from) => { const y = fnc(ctx.shared.floorY) ? ctx.shared.floorY(x, from == null ? 40 : from, z) : -Infinity; return isFinite(y) ? y : -28; };
      const mkPriest = (n) => {
        const f = ark_priestFig(n), KG = ark_kitArms();
        for (const A2 of [f.L, f.R]) { const grip = new Group(); grip.position.set(0, -(KG.P.fo + 0.08), 0.03); A2.el.add(grip); A2.grip = grip; }
        f.g.traverse((m) => { if (m.isMesh) m.userData.noPick = true; });
        f.g.name = "shiloachPriest1";
        f.g.visible = false;
        return f;
      };
      const setArm = (A2, v, side) => { A2.sh.rotation.set(v[0], 0, side * v[1]); A2.el.rotation.set(v[2], 0, 0); };
      const ARM = { rest: [0.05, 0.08, -0.15], carry: [-0.25, 0.1, -0.85], fill: [-1.05, 0.12, -0.35], pour: [-1.2, 0.1, -0.55], tR: [-1.42, 0.05, -0.2], tL: [-1.28, -0.06, -0.38] };
      // ---- the night (the Second Temple's 55-payis.js NIGHT, carried over: the sky's sun under the horizon, the lights low; the dawn)
      const NIGHT = ctx.shared.nightKit || (ctx.shared.nightKit = (() => {
        let sky = null, sun = null, hemi = null, saved = null, envOff = false;
        const P = {
          night: { el: -16, az: 0.15, sunI: 0.5, sunC: 0x8fa6d8, hemI: 1.35, hemC: 0x7f8fc4, gndC: 0x3d4668, fog: 0x0a0f1c, exp: 1.0 },
          alot: { el: -11, az: 0.15, sunI: 0.5, sunC: 0x94a9d8, hemI: 1.35, hemC: 0x7f8fc4, gndC: 0x3d4668, fog: 0x121829, exp: 1.0 },
          heir: { el: -2, az: 0.15, sunI: 0.7, sunC: 0xffd9b0, hemI: 1.3, hemC: 0xa0a6c0, gndC: 0x5a5a68, fog: 0x4a4a58, exp: 0.95 },
          morning: { el: 9, az: 0.2, sunI: 1.5, sunC: 0xffe2bd, hemI: 0.62, hemC: 0xa9b3c8, gndC: 0x4a4436, fog: 0x8d8f98, exp: 0.9 }
        };
        const find = () => {
          if (sky && sun && hemi) return true;
          for (const o of ctx.scene.children) {
            if (o.isDirectionalLight) sun = o;
            else if (o.isHemisphereLight) hemi = o;
            else if (o.material && o.material.uniforms && o.material.uniforms.sunPosition) sky = o;
          }
          return !!(sky && sun && hemi);
        };
        const c1 = new Color(), c2 = new Color();
        const mixHex = (a, b, k) => c1.setHex(a).lerp(c2.setHex(b), k).getHex();
        const apply = (A, B, k) => {
          const L = (a, b) => a + (b - a) * k;
          const el = L(A.el, B.el) * Math.PI / 180;
          sky.material.uniforms.sunPosition.value.set(Math.cos(el), Math.sin(el), L(A.az, B.az));
          sun.intensity = L(A.sunI, B.sunI);
          sun.color.setHex(mixHex(A.sunC, B.sunC, k));
          hemi.intensity = L(A.hemI, B.hemI);
          hemi.color.setHex(mixHex(A.hemC, B.hemC, k));
          hemi.groundColor.setHex(mixHex(A.gndC, B.gndC, k));
          if (ctx.scene.fog) ctx.scene.fog.color.setHex(mixHex(A.fog, B.fog, k));
          ctx.renderer.toneMappingExposure = L(A.exp, B.exp);
        };
        return {
          P,
          begin() {
            if (!find() || saved) return !!saved;
            saved = { sp: sky.material.uniforms.sunPosition.value.clone(), sunI: sun.intensity, sunC: sun.color.getHex(), hemI: hemi.intensity,
              hemC: hemi.color.getHex(), gndC: hemi.groundColor.getHex(), fog: ctx.scene.fog ? ctx.scene.fog.color.getHex() : 0,
              exp: ctx.renderer.toneMappingExposure, env: ctx.scene.environment };
            return true;
          },
          set(a, b, k) {
            if (!saved) return;
            const A = P[a], B = P[b || a];
            apply(A, B, Math.max(0, Math.min(1, k || 0)));
            const dark = (A.el + (B.el - A.el) * (k || 0)) < 3;
            if (dark !== envOff) { envOff = dark; ctx.scene.environment = dark ? null : saved.env; }
          },
          end() {
            if (!saved) return;
            sky.material.uniforms.sunPosition.value.copy(saved.sp);
            sun.intensity = saved.sunI; sun.color.setHex(saved.sunC);
            hemi.intensity = saved.hemI; hemi.color.setHex(saved.hemC); hemi.groundColor.setHex(saved.gndC);
            if (ctx.scene.fog) ctx.scene.fog.color.setHex(saved.fog);
            ctx.renderer.toneMappingExposure = saved.exp;
            ctx.scene.environment = saved.env;
            envOff = false;
            saved = null;
          },
          get on() { return !!saved; }
        };
      })());
      const SHL = { D: null, run: false, night: false, saved: null };
      const AW = (x, lz) => [x, lz + altarDz()];   // in the altar's frame (the row "מקום המזבח" moves it)
      const yAt = (D2, x, z, near) => { const k = Math.round(x * 4) + "," + Math.round(z * 4) + "," + Math.round(near); let y = D2.ys.get(k); if (y === undefined) { y = groundY(x, z, near + 2.6); D2.ys.set(k, y); } return y; };
      const plen = (pts) => { let L = 0; for (let i = 1; i < pts.length; i++) L += Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]); return L; };
      const along = (pts, u) => {
        const L = plen(pts) * clamp(u, 0, 1);
        let acc = 0;
        for (let i = 1; i < pts.length; i++) {
          const a = pts[i - 1], b = pts[i], l = Math.hypot(b[0] - a[0], b[1] - a[1]);
          if (acc + l >= L || i === pts.length - 1) { const f = l > 0 ? clamp((L - acc) / l, 0, 1) : 0; return [lerp(a[0], b[0], f), lerp(a[1], b[1], f), Math.atan2(b[0] - a[0], b[1] - a[1])]; }
          acc += l;
        }
        return [pts[0][0], pts[0][1], 0];
      };
      // the beats (demo seconds; the walk engine runs them at ctx.shared.demoSlow)
      const T = { walk0: 4.0, out1: 9.0, decl1: 11.8, east1: 15.6, steps1: 18.4, path1: 27.4, rim1: 28.6, fill0: 29.4, fill1: 32.4, back0: 33.4,
        backS: 42.2, back1: 44.6, wg0: 50.7, wg1: 53.1, blow0: 53.3, blow1: 57.5, in1: 60.3, ramp1: 64.7, top1: 67.5, pour0: 68.1, pour1: 71.7, end: 74.3 };
      const FILL_LEAN = 0.1, POUR_LEAN = 0.08, TILT = 1.62;
      const QG = new Quaternion(), QT = new Quaternion(), AX = new Vector3(), NECK = new Vector3(0, -0.21, 0), MOUTH = new Vector3(0, 0.3, 0), V1 = new Vector3();
      const setJug = (fig, jug, tilt, yaw) => {
        fig.g.updateMatrixWorld(true);
        fig.R.grip.getWorldQuaternion(QG).invert();
        QT.setFromAxisAngle(AX.set(Math.cos(yaw), 0, -Math.sin(yaw)), tilt);
        jug.quaternion.copy(QG).multiply(QT);
        jug.position.copy(NECK).applyQuaternion(QT).applyQuaternion(QG);
        jug.updateMatrixWorld(true);
      };
      const mouthW = (jug, out) => jug.localToWorld(out.copy(MOUTH));
      const measure = (D2, arm, lean, tilt) => {   // the flask's mouth from his feet, his face to +z
        const p = D2.p;
        p.g.position.set(0, 0, 0); p.g.rotation.y = 0;
        p.lean.position.set(0, 0, 0); p.lean.rotation.x = lean;
        setArm(p.R, arm, -1);
        setJug(p, D2.flask, tilt, 0);
        const m = mouthW(D2.flask, new Vector3()), o = p.g.getWorldPosition(new Vector3());
        return { x: m.x - o.x, y: m.y - o.y, z: m.z - o.z };
      };
      // the bowls of the libations (40-altar.js: by the south-west horn, on the top; R. Yose's altar takes them 2 west and 2 south)
      const BOWL = () => (yose() ? AW(ACX - 10.7, 10.6) : AW(ACX - 8.7, 8.6));   // the western, of the water
      const bowlY = () => { const B = BOWL(), k = Math.round(B[1] * 10) + (yose() ? 1000 : 0); if (SHL.byK !== k) { SHL.byK = k; SHL.by = groundY(B[0], B[1], 22); } return SHL.by; };
      const standP = () => { const B = BOWL(), o = SHL.offP || { x: 0, z: 0.9 }; return [B[0] - o.x, B[1] - o.z]; };
      // under the spring's fall, his face to its cliff (the kit's frame turned by its yaw: the figure's own offsets turned with it)
      const standF = () => {
        const S = SP1(), o = SHL.offF || { x: 0, z: 0.9 };
        if (!S) return [0, 0];
        if (S.kit && S.kit.lake && S.kit.standFor) { const q = S.kit.standFor(o); return [q.x, q.z]; }   // NATURAL_POOL (decision 122 b): on the bank, beside the fall
        const y = S.yaw || 0, c = Math.cos(y), n = Math.sin(y);
        return [S.spout[0] - (o.x * c + o.z * n), S.spout[2] - (-o.x * n + o.z * c)];
      };
      const standYaw = () => { const S = SP1(); if (!S) return 0; if (S.kit && S.kit.lake && S.kit.standFor) return S.kit.standFor(SHL.offF || { x: 0, z: 0.9 }).yaw; return S.yaw || 0; };
      const buildDemo = () => {
        if (SHL.D) return SHL.D;
        const DG = new Group();
        DG.name = "shiloachDemo1";
        DG.visible = false;
        ctx.root.add(DG);
        const p = mkPriest(2), t1 = mkPriest(4), t2 = mkPriest(6);
        for (const f of [p, t1, t2]) DG.add(f.g);
        const gold = new MeshStandardMaterial({ color: 0xd8ad45, metalness: 0.9, roughness: 0.28 });
        const jugGeo = () => mergeGeometries([   // a golden jug with a handle and a lip, as Chalamish draws it (the Second Temple's)
          new LatheGeometry([[0.001, 0], [0.065, 0], [0.105, 0.045], [0.118, 0.12], [0.098, 0.19], [0.05, 0.235], [0.044, 0.27], [0.062, 0.3], [0.001, 0.3]].map(([r, y]) => new Vector2(r, y)), 20),
          new TorusGeometry(0.075, 0.013, 6, 14, Math.PI * 1.15).rotateZ(-Math.PI * 0.62).translate(-0.1, 0.17, 0),
          new ConeGeometry(0.03, 0.08, 8, 1, true).rotateZ(-Math.PI / 2.6).translate(0.07, 0.29, 0)]);
        const flask = new Mesh(jugGeo(), gold);
        flask.castShadow = true; flask.userData.noPick = true; flask.position.set(0, -0.2, 0.02);
        p.R.grip.add(flask);
        const fwater = new Mesh(new CylinderGeometry(0.035, 0.05, 1, 8, 1, true), new MeshStandardMaterial({ color: 0x7fc0f0, transparent: true, opacity: 0.8, roughness: 0.1 }));
        fwater.visible = false; DG.add(fwater);
        const silver = new MeshStandardMaterial({ color: 0xe6e6ea, metalness: 0.85, roughness: 0.25, side: DoubleSide });
        for (const f of [t1, t2]) {   // the silver trumpets (Numbers 10:2), from the mouth forward and up
          const tr = new Group();
          const tube = new Mesh(new CylinderGeometry(0.022, 0.026, 1.25, 10), silver); tube.position.y = 0.625;
          const bell = new Mesh(new CylinderGeometry(0.16, 0.03, 0.26, 16, 1, true), silver); bell.position.y = 1.36;
          tr.add(tube, bell);
          tr.position.set(0, K.HEAD_Y * K.FS - 0.17, 0.14);
          tr.rotation.x = 1.25;
          tr.traverse((m) => { if (m.isMesh) { m.castShadow = true; m.userData.noPick = true; } });
          f.lean.add(tr);
          f.tr = tr;
        }
        const D2 = SHL.D = { DG, p, t1, t2, flask, fwater, ys: new Map() };
        // the rest of the people (the Second Temple's buildExtra): the wine's priest, the deputy with the sudar, the streams, the watchers,
        // the procession with torches, the Levite with the lyre at the spring, the Levites east of the altar
        try {
          const PP = tm_people(ctx);
          const ROBES = [0x6b5a3e, 0x4a4f5a, 0x5c4a3a, 0x3e4a5e, 0x7a6a50, 0x5a3e4a, 0x3e5a4a];
          const w = mkPriest(8); DG.add(w.g);
          const wjug = new Mesh(jugGeo(), gold); wjug.castShadow = true; wjug.userData.noPick = true; wjug.position.set(0, -0.2, 0.02); w.R.grip.add(wjug);
          const wwine = new Mesh(new CylinderGeometry(0.035, 0.05, 1, 8, 1, true), new MeshStandardMaterial({ color: 0x8a1626, transparent: true, opacity: 0.85, roughness: 0.15 }));
          wwine.visible = false; DG.add(wwine);
          const sg = mkPriest(10); DG.add(sg.g);
          const sud = (() => {   // the sudar (the Second Temple's: a black cloth 0.62 x 1.0, its corner in the hand)
            const sg2 = new Group(), W0 = 0.62, L0 = 1.0, geo = new PlaneGeometry(W0, L0, 6, 10);
            geo.translate(-W0 / 2, -L0 / 2, 0);
            const pos = geo.attributes.position, base0 = Float32Array.from(pos.array);
            const m = new Mesh(geo, new MeshStandardMaterial({ color: 0x17171c, roughness: 0.9, side: DoubleSide })); m.castShadow = true; m.userData.noPick = true; sg2.add(m);
            sg2.userData.tick = (t, k) => { for (let i = 0; i < pos.count; i++) { const x = base0[i * 3], y = base0[i * 3 + 1], d = Math.hypot(x, y) / L0; pos.array[i * 3 + 2] = (0.03 + 0.16 * k) * d * Math.sin(6.5 * d - (3 + 7 * k) * t) + 0.05 * k * d * d * Math.sin(2.1 * t); pos.array[i * 3] = x * (1 - 0.12 * k * d * (0.5 + 0.5 * Math.sin(4 * t + 3 * d))); } pos.needsUpdate = true; geo.computeVertexNormals(); };
            sg2.userData.tick(0, 0); return sg2;
          })();
          sg.R.grip.add(sud);
          // the men and boys who watch in the outer court, on both sides of the way
          const watch = new Group(); DG.add(watch); watch.visible = false;
          let q = 1122;
          const rr = () => (q = (q * 1664525 + 1013904223) >>> 0) / 4294967296;
          const men = [], boys = [];
          for (let x = 112; x < 218; x += 7 + rr() * 3) for (const sd of [-1, 1]) {
            const z = sd * (6.2 + rr() * 6), list = rr() < 0.3 ? boys : men;
            list.push([x + (rr() - 0.5) * 2, z, sd > 0 ? Math.PI : 0]);
          }
          const yOC = ctx.shared.newCourt ? ctx.shared.newCourt.y : 3;
          PP.crowd(watch, men, { y: yOC, s: 1.4, pose: "stand", kind: "worker", robe: ROBES[1], tone: (i) => i % 4, name: "shiloachWatcher1" });
          PP.crowd(watch, boys, { y: yOC, s: 1.0, pose: "stand", kind: "worker", robe: ROBES[4], tone: (i) => (i + 1) % 4, name: "shiloachBoy1" });
          // the procession with torches: men and boys round the priest, out and back
          const torchM = new MeshStandardMaterial({ color: 0x5b3a1e, roughness: 0.8 });
          const flameM = new MeshStandardMaterial({ color: 0xffb13a, emissive: 0xff7a10, emissiveIntensity: 2.2, transparent: true, opacity: 0.92 });
          const stickG = new CylinderGeometry(0.025, 0.035, 1.1, 6).translate(0, 0.55, 0), flameG = new ConeGeometry(0.11, 0.36, 8).translate(0, 0.18, 0);
          const COL = [0x2f6b3a, 0x5b3a8a, 0x2e5d9a, 0xc9a227, 0x9a3030, 0x2a8a80, 0xb86a2a, 0x6b7a2e, 0x8a3a6a, 0x3a4a8a, 0xa8552e, 0x40706a];
          const glowTex = (() => { const cv = document.createElement("canvas"); cv.width = cv.height = 64; const c2 = cv.getContext("2d"); const gr = c2.createRadialGradient(32, 32, 2, 32, 32, 32); gr.addColorStop(0, "rgba(255,190,90,0.85)"); gr.addColorStop(0.4, "rgba(255,140,40,0.35)"); gr.addColorStop(1, "rgba(255,120,20,0)"); c2.fillStyle = gr; c2.fillRect(0, 0, 64, 64); return new CanvasTexture(cv); })();
          const glowM = new SpriteMaterial({ map: glowTex, transparent: true, depthWrite: false, blending: AdditiveBlending });
          const fol = [], LANES = [-2.0, -0.9, 0.9, 2.0];
          const KIDS = [17, 29, 53, 71, 88], LIT = [2, 20, 38, 56, 74, 92];   // ROUTE_CROWD (as the Second Temple's ROUTE_CROWD_B2; the user: "מלא אנשים"): 104, thirty ahead of him
          for (let i = 0; i < 104; i++) {
            const G = new Group(); G.visible = false; DG.add(G);
            const kid = KIDS.includes(i), boy = !kid && i % 5 === 3;
            PP.crowd(G, [[0, 0, 0]], { y: 0, s: kid ? 0.8 : boy ? 1.05 : 1.4, pose: "stand", kind: kid || boy ? "student" : "worker", robe: COL[(i * 5) % COL.length], tone: () => i % 4, exact: true, name: "shiloachProcession1" });
            let fl = null;
            if (!kid) {
              const T0 = new Group(); T0.position.set(boy ? -0.27 : -0.36, boy ? 0.98 : 1.3, 0.3); T0.rotation.x = 0.15; G.add(T0);
              T0.add(new Mesh(stickG, torchM));
              fl = new Mesh(flameG, flameM); fl.position.y = 1.1; T0.add(fl);
              const gl = new Sprite(glowM); gl.scale.set(1.7, 1.7, 1); gl.position.y = 0.2; gl.userData.noPick = true; fl.add(gl);
              if (LIT.includes(i)) { const lt = new PointLight(0xffa040, 22, 20, 1.6); lt.position.y = 0.25; fl.add(lt); }   // six lights in all (each light costs every material)
            }
            const lead = i < 30, k = lead ? i : i - 30;   // dense: each keeps a distance in amot from him (as there)
            fol.push({ G, fl, lag: i * 0.37, d: lead ? -(1.2 + k * 0.34) : 1.0 + k * 0.36, side: LANES[i % 4] + (((i * 7) % 5) - 2) * 0.08, rank: lead ? k * 0.34 : 0 });
          }
          // a Levite with a lyre at the spring
          const lev = new Group(); DG.add(lev); lev.visible = false;
          PP.crowd(lev, [[0, 0, 0]], { y: 0, s: 1.4, pose: "stand", kind: "levi", robe: 0xe9e3d3, tone: () => 2, exact: true, name: "shiloachLevite1" });
          {
            const wood = new MeshStandardMaterial({ color: 0x8a5a2b, roughness: 0.6 }), str = new MeshStandardMaterial({ color: 0xeae2c8, roughness: 0.4 });
            const LY = new Group(); LY.position.set(0.05, 1.25, 0.38); LY.rotation.x = -0.25; lev.add(LY);
            const armL = (sx) => { const c = new Mesh(new TubeGeometry(new CatmullRomCurve3([new Vector3(sx * 0.12, 0, 0), new Vector3(sx * 0.2, 0.25, 0), new Vector3(sx * 0.16, 0.5, 0)]), 8, 0.02, 5, false), wood); LY.add(c); };
            armL(-1); armL(1);
            const bar = new Mesh(new CylinderGeometry(0.018, 0.018, 0.4, 6).rotateZ(Math.PI / 2), wood); bar.position.y = 0.5; LY.add(bar);
            const bx = new Mesh(new BoxGeometry(0.3, 0.1, 0.06), wood); LY.add(bx);
            for (let kk = -3; kk <= 3; kk++) { const sm = new Mesh(new CylinderGeometry(0.003, 0.003, 0.46, 3), str); sm.position.set(kk * 0.03, 0.26, 0.02); LY.add(sm); }   // seven strings (Arachin 13b)
          }
          // the Levites with the song east of the altar - "עמדים מזרח למזבח" (II Chr 5:12; 40-altar.js, the place of the singers), flutes among
          // them (Arachin 2:3 "ובשמונת ימי החג... החליל מכה לפני המזבח"); their faces to the people, east (the user's decision 99). In the altar's group
          const duch = new Group(); duch.visible = false;
          const agd = altarG(); (agd || DG).add(duch);
          const LZ = [-8.4, -6.0, -3.6, -1.2, 1.2, 3.6, 6.0, 8.4], flutes = [1, 3, 5], LX = ACX + 17;   // x 72 (the place: x 69..77)
          PP.crowd(duch, LZ.map((z) => [LX, z, Math.PI / 2]), { y: AZ, s: 1.4, pose: "stand", kind: "levi", robe: 0xe9e3d3, tone: (i) => i % 4, name: "shiloachLevites1" });
          const reed = new MeshStandardMaterial({ color: 0xc8b07a, roughness: 0.6 });
          for (const i of flutes) {
            const fm = new Mesh(new CylinderGeometry(0.026, 0.034, 0.62, 8), reed);   // from the mouth forward and down (he faces east, +x)
            fm.position.set(LX + 0.17 + 0.19, AZ + 1.86 - 0.25, LZ[i]); fm.rotation.z = 0.64; fm.castShadow = true; fm.userData.noPick = true; duch.add(fm);
          }
          Object.assign(D2, { w, wjug, wwine, sg, sud, watch, fol, lev, duch });
        } catch (e) { console.warn("[parallels] shiloach people", e && e.message); }
        try { SHL.offF = measure(D2, ARM.fill, FILL_LEAN, 0); SHL.offP = measure(D2, ARM.pour, POUR_LEAN, TILT); } catch (e) { console.warn("[parallels] shiloach measure", e && e.message); }
        return D2;
      };
      // ---------- 10. THE SPRING OF THE SHILOACH (item 10) - the shared build: tm_shiloach (B2's shared/frag/shiloach.js, brought in by
      // 20-mount.js; in the Second Temple SHILOACH_KIT_B2) - the cliff, the small opening, the white fall into the basin, the great pool,
      // the green, the torches' and the moon's light, the roar. ITS PLACE IN THIS HOUSE waits for the user (the coordinator's question
      // 117) - he answered (22.11.2026 12:09, again 12:11: "117 א"): IN THE KIDRON VALLEY, ON ITS WESTERN SLOPE, SOUTH-EAST OF THE MOUNT, as
      // proposed - "והורדתם אתו אל־גחון" (I Kings 1:33; Rashi: "הוא מעין השלוח"), "ויעלו משם" (1:45), "מערבה לגיחון בנחל" (II Chr 33:14).
      // The cliff in the slope (west), the water out to the east, toward the valley's floor; the great pool south of it, before its face;
      // the way comes down the valley from the north, to its east side. The mouth's height is measured on the priest's own figure, as there.
      // SPRING_C = null builds nothing (and hides the demonstration and its places).
      const SPRING_C = { x: 470, z: 556, yaw: -Math.PI / 2, approach: [478, 538] };   // { x, z, yaw, approach: [x, z] (the way's end before it), lake (the kit's own: the natural pool, decision 122 b) }
      let springLabel = null;
      if (SPRING_C) {
        ctx.shared.shiloach1 = { place: SPRING_C };
        // its label over the cliff (its height set when the spring is built, on the ground found then)
        springLabel = { text: "מעיין השילוח", x: SPRING_C.x, y: -36, z: SPRING_C.z, size: 4 };
        (ctx.labels = ctx.labels || []).push(springLabel);
      }
      const mergeStatic = (G0) => {   // the kit's many fronds, boulders, leaves and spires - one mesh for each of their materials (few draw calls)
        const by = new Map();
        for (const o of G0.children) if (o.isMesh && o.material && !o.material.transparent) { const l = by.get(o.material) || []; l.push(o); by.set(o.material, l); }
        for (const [mat, list] of by) {
          if (list.length < 3) continue;
          let mg = null;
          try { mg = mergeGeometries(list.map((o) => { o.updateMatrix(); return o.geometry.clone().applyMatrix4(o.matrix); })); } catch (_) { mg = null; }
          if (!mg) continue;
          const m = new Mesh(mg, mat);
          m.castShadow = list.some((o) => o.castShadow); m.receiveShadow = true; m.userData.noPick = true;
          G0.add(m);
          for (const o of list) G0.remove(o);
        }
      };
      const buildSpring = () => {
        if (SHL.spring !== undefined) return SHL.spring;
        SHL.spring = null;
        if (!SPRING_C || typeof tm_shiloach !== "function" || !K) return null;
        try {
          const D2 = buildDemo();
          if (!SHL.offF) SHL.offF = measure(D2, ARM.fill, FILL_LEAN, 0);
          const C = SPRING_C, yaw = C.yaw || 0, c = Math.cos(yaw), n = Math.sin(yaw);
          const Wl = (lx, lz) => [C.x + lx * c + lz * n, C.z - lx * n + lz * c];   // the kit's frame -> the world (as tm_shiloach's own)
          const g0 = Wl(0, -0.9), gy = groundY(g0[0], g0[1], 60);
          const mouthY = gy + Math.max(1.15, SHL.offF.y + 0.34), basinY = gy + 0.36;
          const kit = tm_shiloach(ctx, { x: C.x, z: C.z, mouthY, yaw, ground: (x, z) => groundY(x, z, 60), parent: ctx.root, seed: 4706, name: "shiloachSpring1",
            basinY, basinDz: 0.55, fallZ: 0.5, pool: null, lake: C.lake, lights: { torch: 85, moon: 34 },   // NATURAL_POOL (122 b): the fall into a natural pool, no walled pool
            sfx: (nm, op) => { if (fnc(ctx.shared.sfx)) ctx.shared.sfx(nm, op); }, roar: { name: "water", dur: 4.5, gain: 3.2 } });
          mergeStatic(kit.G);
          kit.setBottom(basinY);
          const fp = Wl(0, -0.5);   // where the fall comes down (fallZ: 0.5 before the face)
          SHL.spring = ctx.shared.shiloachSpring1 = {
            kit, gy, yaw, Wl, mouthY, approach: C.approach || Wl(-8, -28), spout: [fp[0], mouthY, fp[1]],
            streamTo: (y) => kit.setBottom(y == null ? basinY : y), lights: (on) => kit.setLit(on ? 1 : 0)
          };
          const V3 = new Vector3(C.x, mouthY, C.z);
          ctx.animated.push(() => { if (!SHL.run && !(ctx.camera && ctx.camera.position.distanceTo(V3) < 70)) return; kit.tick(performance.now() / 1000); });
          // the eye may go down into the valley, to the spring (the guard's floor, 90-entry.js: under -27.5 only where the floor under the
          // target is lower - the valley)
          SHL.camLow = Math.min(-27.5, gy - 3);
          if (springLabel) { const lq = Wl(0, 3.5); par_moveLabel(ctx, springLabel, lq[0], gy + 18, lq[1]); }
          ctx.shared.camLow = SHL.camLow;
        } catch (e) { console.warn("[parallels] shiloach spring", e && e.message); SHL.spring = null; }
        return SHL.spring;
      };
      // built at the first frame (the floor's ray needs the whole scene), as the Second Temple's
      // built when the eye comes within 300 amot of it, or when the demonstration starts (as the Second Temple's, d6d17d1: not at the first
      // frame - the load time)
      if (SPRING_C) { const VS = new Vector3(SPRING_C.x, -50, SPRING_C.z); ctx.animated.push(() => { if (SHL.spring === undefined && fnc(ctx.shared.floorY) && ctx.camera && ctx.camera.position.distanceTo(VS) < 300) buildSpring(); }); }
      // ---- the ways (each [x, z] in the world). Out: the inner court's east gate (x 93.5, its round steps to the outer court's floor),
      // the outer court's east gate (x 228.5) and its steps, the great court to its east gate (x 353) and down its 56 stairs (to x 383.5,
      // y -28); then to the spring. Back: up the stairs, across the great court south of the outer court, to the inner court's south-eastern
      // gate (x 40), up its twelve steps (z 78.5 -> 72.5), in, to the ramp's foot, up its east half, on the top to the left, to the bowl.
      const valley = () => {
        const S = SP1(), A = S ? S.approach : [460, 540];
        // from the stairs' foot down into the valley, by its western slope (a model choice), to the place before the spring
        return [[383.5, 0], [398, 30], [420, 140], [440, 300], [A[0] - 8, A[1] - 40], A];
      };
      const WAYS = () => {
        const V = valley(), Vr = V.slice().reverse();
        return [
          { pts: [[91.6, 0], [91.7, 0]], t: [0, 0.1], near: 7, endYaw: Math.PI / 2 },   // in the gate, behind the two with trumpets
          { pts: [[91.7, 0], [98, 0], [106, 0], [226.5, 0]], t: [T.walk0 + 0.5, T.out1 + 0.5], near: 7, endYaw: -Math.PI / 2 },   // his face to the west there
          { pts: [[226.5, 0], [229.5, 0], [233, 0], [300, 0], [355.5, 0]], t: [T.decl1 + 0.2, T.east1], near: 4, proc: true },
          { pts: [[355.5, 0], [383.5, 0]], t: [T.east1, T.steps1], stairs: [0, -28], proc: true },
          { pts: V, t: [T.steps1, T.path1], terrain: true, proc: true },
          { pts: [V[V.length - 1], standF()], t: [T.path1, T.rim1], terrain: true, endYaw: standYaw() },   // his face to the fall
          { pts: [standF()].concat(Vr.slice(1)), t: [T.back0, T.backS], terrain: true, proc: true },
          { pts: [[383.5, 0], [355.5, 0]], t: [T.backS, T.back1], stairs: [-28, 0], proc: true },
          { pts: [[355.5, 0], [336, 6], [300, 74], [250, 86], [150, 90], [60, 90], [44, 86], [40, 80.5]], t: [T.back1 + 0.1, T.wg0], near: 4, proc: true },   // the procession with him, south of the outer court
          { pts: [[40, 80.5], [40, 78.5], [40, 72.5], [40, 71]], t: [T.wg0, T.wg1], steps: [[78.5, 0], [72.5, 6]], endYaw: Math.PI },   // up to the gate, his face into the court
          { pts: [[40, 71], [40, 66], [46, 60], AW(57.0, 44.5)], t: [T.blow1, T.in1], near: 7 },
          { pts: [AW(57.0, 44.5), AW(57.0, yose() ? 15.5 : 13.5)], t: [T.in1, T.ramp1], ramp: true },
          { pts: [AW(57.0, yose() ? 15.5 : 13.5), AW(56.4, yose() ? 11.6 : 9.6)].concat(yose() ? [AW(50, 10.8), AW(46.6, 10.4)] : [AW(51.5, 8.9), AW(48.4, 8.3)]).concat([standP()]), t: [T.ramp1, T.top1], near: 18, endYaw: 0 }   // "ופנה לשמאלו"
        ];
      };
      // ROUTE_CROWD (as the Second Temple's ROUTE_CROWD_B2; the coordinator: "והמון לאורך הדרך"): men and boys standing on both sides of the
      // way outside the mount - down the valley to the spring - in small knots, their faces to the way; built when the demonstration starts
      // (the ground under each knot - one ray), in pieces of about fifty amot (each its own level of detail). Number and places - model choices
      const ROUTE_COL = [0x2f6b3a, 0x5b3a8a, 0x2e5d9a, 0xc9a227, 0x9a3030, 0x2a8a80, 0xb86a2a, 0x6b7a2e, 0x8a3a6a, 0x3a4a8a];
      const buildRoute = (D2) => {
        if (D2.route) return D2.route;
        const RG = new Group(); RG.name = "shiloachRoute1"; RG.visible = false; D2.DG.add(RG); D2.route = RG;
        let q = 9133; const rr = () => (q = (q * 1664525 + 1013904223) >>> 0) / 4294967296;
        const PPr = tm_people(ctx), WS = WAYS().filter((w) => w.terrain && w.proc && w.t[1] <= T.path1 + 0.01);
        const chunks = []; let cur = [], acc = 0;
        for (const w of WS) {
          const L = plen(w.pts);
          for (let d = 4; d < L - 6; d += 5) {
            const qq = along(w.pts, d / L), yaw = qq[2], ph = yAt(D2, qq[0], qq[1], 60);
            for (const sd of [-1, 1]) {
              if (rr() < 0.2) continue;
              const off = sd * (3.4 + rr() * 1.4), x0 = qq[0] + Math.cos(yaw) * off, z0 = qq[1] - Math.sin(yaw) * off, gy0 = yAt(D2, x0, z0, 60);
              if (!isFinite(gy0) || !isFinite(ph) || Math.abs(gy0 - ph) > 1.6) continue;
              const n = 1 + (rr() < 0.55 ? 1 : 0) + (rr() < 0.25 ? 1 : 0);
              for (let k = 0; k < n; k++) { const a1 = (rr() - 0.5) * 1.8, b1 = sd * rr() * 0.9, x = x0 + Math.sin(yaw) * a1 + Math.cos(yaw) * b1, z = z0 + Math.cos(yaw) * a1 - Math.sin(yaw) * b1; cur.push([x, z, Math.atan2(qq[0] - x, qq[1] - z), gy0, rr()]); }
            }
            acc += 5; if (acc >= 50) { chunks.push(cur); cur = []; acc = 0; }
          }
        }
        if (cur.length) chunks.push(cur);
        let total = 0;
        chunks.forEach((C, ci) => {
          const men = C.filter((p2) => p2[4] >= 0.28), boys = C.filter((p2) => p2[4] < 0.28), avg = C.reduce((a2, p2) => a2 + p2[3], 0) / Math.max(1, C.length);
          if (men.length) PPr.crowd(RG, men.map((p2) => [p2[0], p2[1], p2[2], p2[3]]), { y: avg, s: 1.4, pose: "stand", kind: "worker", robe: ROUTE_COL[ci % ROUTE_COL.length], tone: (i) => (i + ci) % 4, name: "shiloachRoute1" });
          if (boys.length) PPr.crowd(RG, boys.map((p2) => [p2[0], p2[1], p2[2], p2[3]]), { y: avg, s: 1.05, pose: "stand", kind: "student", robe: ROUTE_COL[(ci + 5) % ROUTE_COL.length], tone: (i) => (i + ci + 1) % 4, name: "shiloachRouteBoy1" });
          total += C.length;
        });
        RG.userData.count = total;
        return RG;
      };
      const wayY = (D2, w, q, u) => {
        if (w.stairs) return yAt(D2, q[0], q[1], lerp(w.stairs[0], w.stairs[1], clamp(u, 0, 1)) + 1);   // on the treads (the ray from a little over the line of the stairs)
        if (w.steps) { const [a, b] = w.steps; return yAt(D2, q[0], q[1], (q[1] >= a[0] ? a[1] : q[1] <= b[0] ? b[1] : lerp(a[1], b[1], (a[0] - q[1]) / (a[0] - b[0]))) + 1); }
        return yAt(D2, q[0], q[1], w.terrain ? 60 : w.ramp ? 20 : w.near);
      };
      const placeOn = (D2, f, w, t, carry) => {
        const u = (t - w.t[0]) / Math.max(1e-3, w.t[1] - w.t[0]), q = along(w.pts, u);
        f.g.position.set(q[0], wayY(D2, w, q, u), q[1]);
        f.g.rotation.y = u >= 1 && w.endYaw != null ? w.endYaw : q[2];
        const walking = u > 0 && u < 1, ph = t * 9;
        f.fl.position.z = walking ? 0.17 * Math.sin(ph) : 0;
        f.fr.position.z = walking ? -0.17 * Math.sin(ph) : 0;
        f.lean.position.y = walking ? Math.abs(Math.cos(ph)) * 0.035 : 0;
        setArm(f.L, walking ? [0.3 * Math.sin(ph), 0.08, -0.25] : ARM.rest, 1);
        setArm(f.R, carry ? ARM.carry : walking ? [-0.3 * Math.sin(ph), 0.08, -0.25] : ARM.rest, -1);
        return u;
      };
      const wayAt = (WS, t) => { let cur = null; for (const w of WS) if (t >= w.t[0] - 0.01) cur = w; return cur; };
      const apply = (t) => {
        const D2 = buildDemo(), WS = WAYS(), p = D2.p, S = SP1();
        const cur = wayAt(WS, t);
        p.g.visible = !!cur && t < T.end;
        if (cur) placeOn(D2, p, cur, Math.min(t, cur.t[1]), true);
        const yaw = p.g.rotation.y;
        p.lean.rotation.x = 0;
        let fillK = 0, pourK = 0;
        if (t >= T.fill0 && t < T.back0) {   // filling under the spring's stream
          fillK = smooth(clamp((t - T.fill0) / 0.6, 0, 1)) * (1 - smooth(clamp((t - T.fill1) / 0.6, 0, 1)));
          setArm(p.R, ARM.carry.map((v, i) => lerp(v, ARM.fill[i], fillK)), -1);
          p.lean.rotation.x = FILL_LEAN * fillK;
        }
        if (t >= T.pour0 && t < T.end) {   // pouring into the western bowl, his hand raised ("ולמנסך אומרים לו, הגבה ידך")
          pourK = smooth(clamp((t - T.pour0) / 0.6, 0, 1)) * (1 - smooth(clamp((t - T.pour1) / 0.6, 0, 1)));
          setArm(p.R, ARM.carry.map((v, i) => lerp(v, ARM.pour[i], pourK)), -1);
          p.lean.rotation.x = POUR_LEAN * pourK;
        }
        setJug(p, D2.flask, TILT * pourK, yaw);
        const m = mouthW(D2.flask, V1);
        if (S && fnc(S.streamTo)) S.streamTo(fillK > 0.9 && p.g.visible ? m.y + 0.02 : null);
        D2.fwater.visible = false;
        if (pourK > 0.92 && p.g.visible) {
          const by = bowlY(), h = Math.max(0.05, m.y - by);
          D2.fwater.visible = true; D2.fwater.position.set(m.x, by + h / 2, m.z); D2.fwater.scale.y = h;
        }
        // the opening (Sukkah 5:4): the two with trumpets in the inner court's east gate, their walk blowing to the outer court's east gate
        const tOpen = t < T.decl1 + 0.3;
        if (tOpen) {
          for (const [f, sd] of [[D2.t1, -1], [D2.t2, 1]]) {
            const z = sd * 3.0, wy = t < T.walk0 ? { pts: [[94.4, z], [94.5, z]], t: [0, 0.1], near: 7, endYaw: Math.PI / 2 }
              : { pts: [[94.4, z], [98.4, z], [106, z], [227.6, z]], t: [T.walk0, T.out1], near: 7, endYaw: -Math.PI / 2 };
            f.g.visible = true;
            placeOn(D2, f, wy, Math.min(t, wy.t[1]), false);
            const blowK = t < T.walk0 ? smooth(clamp((t - 0.6) / 0.5, 0, 1)) * (1 - smooth(clamp((t - 3.4) / 0.4, 0, 1)))
              : t < T.out1 ? 1 - smooth(clamp((t - T.out1 + 0.4) / 0.4, 0, 1)) : 0;
            if (blowK > 0) { setArm(f.R, ARM.rest.map((v, i) => lerp(v, ARM.tR[i], blowK)), -1); setArm(f.L, ARM.rest.map((v, i) => lerp(v, ARM.tL[i], blowK)), 1); }
            f.tr.visible = blowK > 0.3 || t < T.out1;
          }
        }
        // at the altar the same two stand ON THE TABLE OF THE FATS (Tamid 7:3; the user's decision 102) - the marble table (ctx.shared.rampTables)
        const tAlt = t >= T.top1 - 1.2 && t < T.end;
        if (tAlt) {
          const blowA = smooth(clamp((t - T.pour0 + 0.4) / 0.5, 0, 1)) * (1 - smooth(clamp((t - T.pour1) / 0.5, 0, 1)));
          const RT = ctx.shared.rampTables, MB = RT ? RT.marble : AW(ACX - 15.4, 13.6), B = BOWL();
          for (const [f, dz2] of [[D2.t1, -0.38], [D2.t2, 0.38]]) {
            f.g.visible = true;
            f.g.position.set(MB[0], AZ + (RT ? RT.top : 1.5) + 0.01, MB[1] + dz2);
            f.g.rotation.y = Math.atan2(B[0] - MB[0], B[1] - (MB[1] + dz2));
            setArm(f.R, ARM.rest.map((v, i) => lerp(v, ARM.tR[i], blowA)), -1);
            setArm(f.L, ARM.rest.map((v, i) => lerp(v, ARM.tL[i], blowA)), 1);
            f.tr.visible = blowA > 0.3;
          }
        }
        // the two at the gate that stands for the Water Gate: on its steps' head, either side of the way in
        const tOn = t >= T.wg0 && t < T.in1 + 1;
        for (const [f, x] of [[D2.t1, 36.4], [D2.t2, 43.6]]) {
          if (!tAlt && !tOpen) f.g.visible = tOn;
          if (!tOn) continue;
          f.g.position.set(x, AZ, 73.4);
          f.g.rotation.y = x < 40 ? 0.35 : -0.35;   // their faces out, to the south, a little toward the way in
          const up = smooth(clamp((t - T.blow0 + 0.6) / 0.5, 0, 1)) * (1 - smooth(clamp((t - T.blow1) / 0.5, 0, 1)));
          setArm(f.R, ARM.rest.map((v, i) => lerp(v, ARM.tR[i], up)), -1);
          setArm(f.L, ARM.rest.map((v, i) => lerp(v, ARM.tL[i], up)), 1);
          f.tr.visible = up > 0.3;
        }
        try { extraApply(D2, WS, t); } catch (e) { if (!SHL.warned) { SHL.warned = true; console.warn("[parallels] shiloach extra", e && e.message); } }
      };
      const extraApply = (D2, WS, t) => {
        if (!D2.fol) return;
        if (SHL.night) {
          if (t < T.back0) NIGHT.set("night", "night", 0);
          else if (t < T.back1) NIGHT.set("night", "alot", smooth(clamp((t - T.back0) / (T.back1 - T.back0), 0, 1)));
          else if (t < T.in1) NIGHT.set("alot", "heir", smooth(clamp((t - T.back1) / (T.in1 - T.back1), 0, 1)));
          else NIGHT.set("heir", "morning", smooth(clamp((t - T.in1) / (T.top1 - T.in1), 0, 1)));
        }
        D2.watch.visible = t < T.decl1 + 0.5;
        if (D2.route) D2.route.visible = t >= T.decl1 && t < T.back1 + 1;   // ROUTE_CROWD
        const fl = 0.85 + 0.15 * Math.sin(t * 17);
        const wp = wayAt(WS, t);
        // the procession, from the great court's east gate out (decl1 + 1.2) to the gate that stands for the Water Gate (they stay below
        // it while the two blow): the way they walk - his, if it is one of theirs (proc, stairs, terrain), else the last of theirs before it
        // (they wait at its end, in their ranks)
        let pw = null;
        if (t >= T.decl1 + 1.2 && t < T.blow1 + 1.0) for (const q of WS) if ((q.proc || q.stairs || q.terrain) && t >= q.t[0] - 0.01) pw = q;
        const S = SP1(), sf = standF(), syw = S ? S.yaw || 0 : 0, sc = Math.cos(syw), sn = Math.sin(syw);
        // at the spring they stand in an arc behind him (the kit's frame: before its face, -z), clear of the pool on his east and of the
        // eye at his west side
        const atK = S ? smooth(clamp((t - (T.path1 - 0.6)) / 1.8, 0, 1)) * (1 - smooth(clamp((t - T.back0) / 1.0, 0, 1))) : 0;
        const pwI = pw ? WS.indexOf(pw) : -1;
        const Sp = !pw ? 0 : pw === wp ? clamp((t - pw.t[0]) / Math.max(1e-3, pw.t[1] - pw.t[0]), 0, 1) * plen(pw.pts) : plen(pw.pts);
        D2.fol.forEach((F, i) => {
          F.G.visible = !!pw;
          if (!pw) return;
          let w = pw, L = plen(w.pts), S2 = Sp - F.d;
          if (S2 < 0 && pwI > 0) { const pv = WS[pwI - 1]; if (pv.proc || pv.stairs || pv.terrain) { w = pv; L = plen(w.pts); S2 = Math.max(0, L + S2); } }
          S2 = clamp(S2, 0, Math.max(0, L - 1.6 - F.rank));
          const u = L > 0 ? S2 / L : 0, qq = along(w.pts, u), yaw = qq[2];
          let x = qq[0] + Math.cos(yaw) * F.side, z = qq[1] - Math.sin(yaw) * F.side;
          let ry = t >= w.t[1] && w.endYaw != null && w === wp ? w.endYaw : yaw, near = w.stairs ? lerp(w.stairs[0], w.stairs[1], u) + 1 : w.terrain ? 60 : 4;
          if (atK > 0) {
            const row = i % 8, k = Math.floor(i / 8), ph = (-45 + 50 * (k + 0.5 * (row % 2)) / 13.5) * Math.PI / 180, r = 5.5 + row * 1.1;   // six rows, before the cliff, clear of the pool and of the eye across it
            const lx = Math.sin(ph) * r, lz = -Math.cos(ph) * r, ax = sf[0] + lx * sc + lz * sn, az = sf[1] - lx * sn + lz * sc;
            x = lerp(x, ax, atK); z = lerp(z, az, atK); near = 60;
            if (atK > 0.5) ry = Math.atan2(sf[0] - x, sf[1] - z);
          }
          F.G.position.set(x, yAt(D2, x, z, near) + (u > 0 && u < 0.999 && atK < 0.99 ? Math.abs(Math.sin(t * 8 + F.lag)) * 0.04 : 0), z);
          F.G.rotation.y = ry;
          if (F.fl) F.fl.scale.set(fl, 0.9 + 0.2 * Math.sin(t * 23 + F.lag * 3), fl);
        });
        if (S && fnc(S.lights)) S.lights(SHL.run && t >= T.path1 - 1.2 && t < T.back0 + 2.4);
        // the Levite with the lyre at the spring: on its east, by the pool's corner, his face to the priest (seen behind him from the eye)
        const lvOn = !!S && t >= T.path1 - 1 && t < T.back0 + 1.6;
        D2.lev.visible = lvOn;
        if (lvOn) { const lp = S.Wl ? S.Wl(-3.0, -2.6) : [sf[0] - 2.1, sf[1] - 2.1]; D2.lev.position.set(lp[0], yAt(D2, lp[0], lp[1], 60), lp[1]); D2.lev.rotation.y = Math.atan2(sf[0] - lp[0], sf[1] - lp[1]); }
        // the libation: the wine's priest with him up the ramp, to the eastern bowl; the deputy on the south-west horn
        const w2 = D2.w, wOn = t >= T.in1 - 1.2 && t < T.end;
        w2.g.visible = wOn;
        if (wOn) {
          const B = BOWL(), o = SHL.offP || { x: 0, z: 0.9 }, sw = [B[0] + 0.9 - o.x, B[1] - o.z], zt = yose() ? 15.5 : 13.5;
          const WW = [{ pts: [AW(58.6, 46.5), AW(58.6, 46.6)], t: [0, 0.1], near: 7 },
            { pts: [AW(58.6, 44.5), AW(58.6, zt)], t: [T.in1 + 0.5, T.ramp1 + 0.5], ramp: true },
            { pts: [AW(58.6, zt), AW(58.0, zt - 3.8), AW(52.5, zt - 4.4), AW(49.4, zt - 5.0), sw], t: [T.ramp1 + 0.5, T.top1 + 0.5], near: 18, endYaw: 0 }];
          let cw = WW[0]; for (const q2 of WW) if (t >= q2.t[0] - 0.01) cw = q2;
          placeOn(D2, w2, cw, Math.min(t, cw.t[1]), true);
          const pk = smooth(clamp((t - T.pour0) / 0.6, 0, 1)) * (1 - smooth(clamp((t - T.pour1) / 0.6, 0, 1)));
          if (pk > 0) { setArm(w2.R, ARM.carry.map((v, i) => lerp(v, ARM.pour[i], pk)), -1); w2.lean.rotation.x = POUR_LEAN * pk; } else w2.lean.rotation.x = 0;
          setJug(w2, D2.wjug, TILT * pk, w2.g.rotation.y);
          D2.wwine.visible = false;
          if (pk > 0.92) { const mm = D2.wjug.localToWorld(V1.copy(MOUTH)), by = bowlY(), h = Math.max(0.05, mm.y - by); D2.wwine.visible = true; D2.wwine.position.set(mm.x, by + h / 2, mm.z); D2.wwine.scale.y = h; }
        }
        const sOn = t >= T.top1 - 1.0 && t < T.end;
        D2.sg.g.visible = sOn;
        if (sOn) {
          const [hx, hz] = yose() ? AW(ACX - 11.5, 11.5) : AW(ACX - 9.5, 9.5);   // the south-west horn (40-altar.js: 1 x 1 x 1 on the top's corner)
          const hk = hx * 1000 + hz;
          if (SHL.hornK !== hk) { SHL.hornK = hk; let hy = -Infinity; for (const [dx, dz2] of [[0, 0], [0.25, 0.25], [-0.25, 0.25], [0.25, -0.25], [-0.25, -0.25]]) hy = Math.max(hy, groundY(hx + dx, hz + dz2, 22)); SHL.hornY = isFinite(hy) ? hy : AZ + 11; }
          const S3 = D2.sg;
          S3.g.position.set(hx, SHL.hornY, hz); S3.g.rotation.y = Math.PI / 2 + 0.35;
          const wave = smooth(clamp((t - T.pour0 + 0.7) / 0.5, 0, 1)) * (1 - smooth(clamp((t - T.pour1 - 0.4) / 0.5, 0, 1)));
          setArm(S3.R, ARM.rest.map((v, i) => lerp(v, [-2.85, 0.18, -0.15][i], wave)), -1);
          setArm(S3.L, ARM.rest, 1);
          S3.fl.position.z = S3.fr.position.z = 0; S3.lean.position.y = 0; S3.lean.rotation.x = 0;
          if (D2.sud && D2.sud.userData.tick) D2.sud.userData.tick(t, wave);
        }
        D2.duch.visible = t >= T.in1 - 1 && t < T.end;
      };
      // ---- the eye (keys [t, eye, look], demo seconds) and the words
      const pAt = (t) => {   // where he is at demo second t (for the eye)
        const D2 = buildDemo(), w = wayAt(WAYS(), t);
        if (!w) return [91.7, 6, 0];
        const u = clamp((t - w.t[0]) / Math.max(1e-3, w.t[1] - w.t[0]), 0, 1), q = along(w.pts, u);
        return [q[0], wayY(D2, w, q, u), q[1]];
      };
      const keys = () => {
        const S = SP1(), sy = S.gy, M = S.mouthY != null ? S.mouthY : S.spout[1];
        const Wl = S.Wl || ((lx, lz) => [S.spout[0] + lx, S.spout[2] + 0.5 + lz]), kp = (lx, y, lz) => { const q = Wl(lx, lz); return [q[0], y, q[1]]; };
        const off = (t, d) => { const p = pAt(t); return [t, [p[0] + d[0], p[1] + d[1], p[2] + d[2]], [p[0], p[1] + 1.4, p[2]]]; };
        const A1 = AW(57.0, 30), B = BOWL();
        return [
          [0, [118, 15, 18], [96, 9.5, 0]], [3.4, [119, 14.5, 16], [97, 9, 0]], [T.walk0 + 1.6, [150, 17, 26], [122, 4, 0]], [T.out1 - 1.2, [196, 15, 24], [224, 4, 0]],
          [T.out1 + 0.8, [244, 12, 13], [224, 5, 0]], [T.decl1, [242, 13, 14], [224, 5, 0]],
          [T.decl1 + 1.4, [268, 10, 24], [248, 1, 0]], [T.east1 - 1.4, [338, 9, 22], [312, 1, 0]], [T.east1, [334, 10, 20], [356, 3, 0]],
          [T.east1 + 1.4, [392, 6, 24], [372, -12, 0]], [T.steps1, [404, -12, 22], [384, -27, 2]],
          off(T.steps1 + 3, [-14, 18, 30]), off(T.steps1 + 6, [-14, 18, 30]),   // down the valley: before them, a little above, from its western side
          // the spring (as the Second Temple's: the cliff, the opening and the pool at a man's height; the filling closer, from the side)
          [T.path1 - 2.2, kp(10.5, sy + 9, -35.4), kp(2.5, sy + 4, -1.4)],
          (() => { const p = pAt(T.path1 - 0.4), sp = S.spout; return [T.path1 - 0.4, kp(10, sy + 4.5, -16), [lerp(p[0], sp[0], 0.35), sy + 1.6, lerp(p[2], sp[2], 0.35)]]; })(),   // he comes in, the cliff beside
          [T.rim1, kp(3.4, sy + 2.0, -5.6), kp(-0.4, M - 0.3, -0.4)], [T.fill1, kp(3.0, sy + 1.8, -5.0), kp(-0.4, M - 0.3, -0.4)],   // across the pool (as the Second Temple's)
          off(T.back0 + 1.0, [9, 8, 13]),   // he turns back with the full flask
          off(T.back0 + 3.2, [-10, 20, -40]), off(T.back0 + 6.2, [-10, 20, -40]),   // up the valley: before them, looking back at them
          [T.backS - 0.6, [404, -12, 24], [384, -27, 2]], [T.back1 - 0.4, [372, 8, 22], [354, 2, 0]],
          off(T.back1 + 0.9, [26, 44, 74]), off(T.back1 + 3.2, [26, 44, 74]), off(T.wg0 - 1.2, [22, 30, 52]),   // across the great court, from high in the south-east
          [T.wg0 - 0.2, [58, 18, 104], [42, 4, 80]], [T.wg1 - 0.4, [56, 16, 96], [40, 7.5, 73]], [T.blow1, [57, 15.6, 95], [40, 7.6, 73.2]],
          [T.blow1 + 1.0, [72, 34, 92], [48, 6, 60]], [T.in1 - 0.8, [76, 18, A1[1] + 18], [57, 8, A1[1] + 8]], [T.ramp1 - 1.0, [72, 22, A1[1] - 2], [57, 13, A1[1] - 12]],
          [T.top1, [33, 22, B[1] + 11], [B[0] + 3, 15.5, B[1] - 1]], [T.pour0 + 0.8, [41, 20.4, B[1] + 8.6], [B[0] + 0.3, 16.2, B[1] - 0.4]],
          [T.pour0 + 2.8, [48, 22.5, B[1] + 13], [B[0] + 0.6, 16.2, B[1] - 0.6]], [T.end, [48.5, 22.5, B[1] + 13.4], [B[0] + 0.6, 16.2, B[1] - 0.6]]
        ];
      };
      const caps = [
        [0, "״נסוך המים כיצד. צלוחית של זהב מחזקת שלשת לגים היה ממלא מן השלוח״ (סוכה ד, ט)"],
        [1.2, "״ועמדו שני כהנים בשער העליון שיורד מעזרת ישראל לעזרת נשים, ושתי חצוצרות בידיהן. קרא הגבר, תקעו והריעו ותקעו״ (סוכה ה, ד) — בבית ראשון: השער המזרחי של החצר הפנימית (בחירת מודל)"],
        [T.walk0 + 0.4, "״היו תוקעין והולכין, עד שמגיעין לשער היוצא מזרח״ (סוכה ה, ד) — בבית ראשון: השער המזרחי של החצר החיצונה (בחירת מודל)"],
        [T.out1 + 0.4, "״הגיעו לשער היוצא ממזרח, הפכו פניהן למערב, ואמרו... ואנו ליה עינינו״ (סוכה ה, ד)"],
        [T.decl1 + 0.2, "ויוצאים בשער המזרחי של החצר הגדולה, בלפידים כפי שהובא בחלמיש — הדרך בבית ראשון: בחירת מודל; ההליכה מואצת"],
        [T.steps1, "אל השילוח — הדרך ומקום המעיין: בחירת מודל"],
        [T.rim1 - 0.4, "״שילוח היה מוציא מים כאיסר״ (ירושלמי סוכה ה, ו); ״היה ממלא מן השלוח״ (סוכה ד, ט)"],
        [T.back0 + 0.6, "וחוזרים לפני עלות השחר, כפי שהובא בחלמיש — במעלות שער המזרח ובחצר הגדולה: בחירת מודל"],
        [T.wg0, "״הגיעו לשער המים, תקעו והריעו ותקעו״ (סוכה ד, ט) — בבית ראשון: השער המזרחי שבדרום החצר הפנימית, כסדר ״שבדרום, שער הדלק. שני לו, שער הבכורות. שלישי לו, שער המים״ (מדות א, ד); בחירת מודל"],
        [T.in1 - 0.4, "״עלה בכבש ופנה לשמאלו, שני ספלים של כסף היו שם״ (סוכה ד, ט)"],
        [T.top1 - 0.6, "״הסגן עומד על הקרן והסודרים בידו״ (תמיד ז, ג)"],
        [T.pour0 - 0.3, "״מערבי של מים, מזרחי של יין״; ״ולמנסך אומרים לו, הגבה ידך״ (סוכה ד, ט); ״ושני כהנים עומדים על שלחן החלבים ושתי חצוצרות של כסף בידם״ (תמיד ז, ג)"],
        [T.pour0 + 2.0, "״והניף הסגן בסודרין... ודברו הלוים בשיר״ (תמיד ז, ג); ״ובשנים עשר יום בשנה החליל מכה לפני המזבח... ובשמונת ימי החג״ (ערכין ב, ג). סדר המשנה נאמר בימי הבית השני"]
      ];
      const tefOn = (on) => { const TO = ctx.shared.tefOff || (ctx.shared.tefOff = new Set()); if (on) TO.add("shiloach1"); else TO.delete("shiloach1"); };
      const finish = () => {
        SHL.run = false;
        if (SHL.D) { SHL.D.DG.visible = false; if (SHL.D.duch) SHL.D.duch.visible = false; }
        if (SHL.night) { NIGHT.end(); SHL.night = false; }
        const S = SP1();
        if (S && fnc(S.streamTo)) S.streamTo(null);
        if (S && fnc(S.lights)) S.lights(false);
        tefOn(false);
        const sv = SHL.saved;
        if (sv && sv.lg) sv.lg.visible = sv.labels;
        if (sv && sv.view && ctx.shared.viewLimits) ctx.shared.viewLimits.set(sv.view);
        if (sv && sv.fade != null && ctx.shared.fadeState) ctx.shared.fadeState.on = sv.fade;
        if (SHL.camLow != null) ctx.shared.camLow = SHL.camLow; else delete ctx.shared.camLow;
        SHL.saved = null;
      };
      const start = () => {
        const T00 = performance.now();
        const Wk = ctx.shared.walk, S = SP1() || buildSpring();
        if (!Wk || !K || !S) return false;
        const D2 = buildDemo();
        if (fnc(ctx.shared.stopDemos)) ctx.shared.stopDemos("shiloachDemo1");
        let lg = null;
        try { lg = ctx.root.getObjectByName("labels"); } catch (_) {}
        SHL.saved = { lg, labels: lg ? lg.visible : true, view: ctx.shared.viewLimits ? ctx.shared.viewLimits.get() : null, fade: ctx.shared.fadeState ? ctx.shared.fadeState.on : null };
        if (lg) lg.visible = false;
        if (ctx.shared.fadeState) ctx.shared.fadeState.on = false;
        if (ctx.shared.viewLimits) { for (const k of keys()) { ctx.shared.viewLimits.include(k[1]); ctx.shared.viewLimits.include(k[2]); } }
        ctx.shared.camLow = Math.min(-27.5, S.gy - 3);
        SHL.night = !!NIGHT.begin();
        tefOn(true);
        try { const t0 = performance.now(); buildRoute(D2); SHL.routeMs = performance.now() - t0; } catch (e) { console.warn("[parallels] shiloach route", e && e.message); }   // ROUTE_CROWD
        D2.DG.visible = true;
        SHL.run = true;
        apply(0);
        Wk.run(keys(), caps, finish);
        SHL.startMs = performance.now() - T00;
        return true;
      };
      const stop = () => { if (!SHL.run) return; const Wk = ctx.shared.walk; if (Wk && Wk.on) Wk.stop(); else finish(); };
      let sndT = -1;
      ctx.animated.push(() => {
        if (!SHL.run) { sndT = -1; return; }
        const Wk = ctx.shared.walk, t = Wk && fnc(Wk.now) ? Math.max(0, Wk.now()) : 0;
        try { apply(t); } catch (e) { console.warn("[parallels] shiloach", e && e.message); }
        try {
          if (sndT >= 0 && t > sndT && fnc(ctx.shared.sfx)) {
            if (sndT < 0.8 && t >= 0.8) ctx.shared.sfx("trumpets");
            for (const ts of [T.path1 - 1.2, T.rim1 + 1.5, T.fill0 + 2.5]) if (sndT < ts && t >= ts) ctx.shared.sfx("water", { dur: 4.5, gain: 3.2 });   // "נובעים בקול גדול"
            if (sndT < T.blow0 && t >= T.blow0) ctx.shared.sfx("trumpets");
            if (sndT < T.pour0 && t >= T.pour0) ctx.shared.sfx("trumpets");
            if (sndT < T.pour0 + 0.5 && t >= T.pour0 + 0.5) ctx.shared.sfx("water", { dur: 2.0, gain: 0.6 });
          }
        } catch (_) {}
        sndT = t;
      });
      const walkEntry = () => (ctx.shared.demoStops || []).find((q) => q.id === "walk");
      (ctx.shared.demoStops || (ctx.shared.demoStops = [])).push({ id: "shiloachDemo1", running: () => SHL.run, stop,
        pause: () => { const w = walkEntry(); if (w && w.pause) w.pause(); }, resume: () => { const w = walkEntry(); if (w && w.resume) w.resume(); },
        paused: () => { const w = walkEntry(); return !!(w && w.paused && w.paused()); }, restart: () => { stop(); start(); } });
      ctx.shared.shiloachDemo1 = { start, stop, T, get on() { return SHL.run; }, at: (t) => { buildSpring(); const D2 = buildDemo(); D2.DG.visible = true; apply(t); }, ways: () => WAYS(), spring: () => buildSpring(), keys: () => keys(), stats: () => ({ route: SHL.D && SHL.D.route ? SHL.D.route.userData.count : 0, routeMs: SHL.routeMs, walkers: SHL.D && SHL.D.fol ? SHL.D.fol.length : 0, startMs: SHL.startMs }) };
    }

    // ---------- 11. THE THIRTEEN SHOFAROT (item 22; the user's decision 112 ג, 22.11.2026 12:09: a switch of its own, off) ----------
    // Mishnah Shekalim 6:5 (54:42) "שלשה עשר שופרות היו במקדש, וכתוב עליהם, תקלין חדתין ותקלין עתיקין, קנין וגוזלי עולה, עצים, ולבונה, זהב
    // לכפרת. ששה, לנדבה" - said of the Second Temple. For the First Temple: the Malbim on II Kings 12:10 (3379:449) "וי"ל שרמז זה במ"ש ארון
    // אחד... שכל הי"ג ארונות נקראו בשם ארון אחד שאחד מספרו י"ג"; the Yerushalmi Shekalim 6:4 (154:215) "על ידי שהנדבה מרובה ריבו לה שופרות
    // הרבה. [שנאמר] וככלותם הביאו לפני המלך ויהוידע"; the Bartenura (2:1, 593:56) "כההיא דכתיב ביהוידע... והיו עומדים בעזרה". IN THIS
    // HOUSE: in the inner court, by Jehoiada's inner chest (20-mount.js, MNT_ARON_IN [70, -8]) - "אצל המזבח מימין בבוא איש בית ה׳" (II Kings
    // 12:10): north of the axis, on the right of him who comes in by the east gate; a row along z at x 80, their mouths to the west. The form
    // as the Second Temple's (57-add208.js): "תבות צרות מלמעלה ורחבות מלמטה עקמות כעין שופר" (the Bartenura 6:1, 593:213). Their place, size
    // and metal - model choices. A switch (a place with its feature and a pill on the model), off by default.
    {
      const shG = new Group();
      shG.name = "shofarot13";
      shG.visible = false;
      g.add(shG);
      ctx.layers.shofarot13 = shG;
      const prof = [[0, 0], [0.52, 0], [0.56, 0.08], [0.52, 0.45], [0.44, 0.85], [0.33, 1.15], [0.24, 1.32], [0.2, 1.4], [0, 1.4]].map(([r, y]) => new Vector2(r, y));
      const body = new LatheGeometry(prof, 20);
      const neck = new TubeGeometry(new CatmullRomCurve3([new Vector3(0, 1.36, 0), new Vector3(0, 1.62, 0), new Vector3(0.12, 1.86, 0), new Vector3(0.38, 1.98, 0)]), 16, 0.15, 10, false);
      const lip = new TorusGeometry(0.15, 0.04, 6, 16);
      const X0 = 80, Z0 = -10.5, DZ = -2.1, tmp = new Group();
      for (let i = 0; i < 13; i++) {
        const b = new Group(); b.position.set(X0, AZ, Z0 + i * DZ); b.rotation.y = Math.PI;   // the curved mouths toward the court (west)
        tmp.add(b);
        b.add(new Mesh(body, M2.bronze), new Mesh(neck, M2.bronze));
        const l = new Mesh(lip, M2.gold || M2.bronze); l.position.set(0.38, 1.98, 0); l.rotation.y = Math.PI / 2; b.add(l);
      }
      par_mergeInto(shG, tmp, { shadow: true, noPick: false });
      ctx.labels.push({ text: "שלשה עשר שופרות (שקלים ו, ה; מלבי״ם מלכים ב יב, י)", x: X0, y: AZ + 4.2, z: Z0 + 6 * DZ, size: 1.6, layer: "shofarot13" });
      const set13 = (on) => { shG.visible = !!on; return shG.visible; };
      ctx.shared.shofarot13 = { get on() { return shG.visible; }, set: set13, at: [X0, AZ, Z0 + 6 * DZ] };
      (ctx.shared.features = ctx.shared.features || {}).shofarot13 = { key: "shofarot13", timed: false, isOn: () => shG.visible, on: () => set13(true), off: () => set13(false) };
      ctx.shared.modelButtons = ctx.shared.modelButtons || [];
      ctx.shared.modelButtons.push({
        id: "par-shofarot13", label: "הצג את שלושה עשר השופרות", labelOn: "הסתר את שלושה עשר השופרות",
        title: "״שלשה עשר שופרות היו במקדש״ (שקלים ו, ה); בבית ראשון — כרמז המלבי״ם (מלכים ב יב, י): ״שכל הי\"ג ארונות נקראו בשם ארון אחד״. כבוי כברירת מחדל",
        anchor: [X0, AZ + 3, Z0 + 6 * DZ], maxDist: 120, get: () => shG.visible, set: (on) => { set13(on); }
      });
    }

    // ---------- 12. THE CITY OF DAVID - A LAYER OF ITS OWN, OFF (the user's decision 153 א, 22.11.2026) - AND THE MILLO (150 א, 151 א, 152 א) ----------
    // The layer ctx.layers.irDavid (off): built only when it is first shown (as the spring - nothing at the load). Its outline, wall, the
    // fortress of Zion and the gates wait for the sources (the coordinator); until then IR_C.poly is provisional (the simple houses only).
    // THE MILLO: "וישב דוד במצדה ויקרא לה עיר דוד ויבן דוד סביב מן המלוא וביתה" (II Sam 5:9); "אך בת פרעה עלתה מעיר דוד אל ביתה אשר בנה
    // לה אז בנה את המלוא" (I Kings 9:24); "שלמה בנה את המלוא סגר את פרץ עיר דוד אביו" (11:27). Its place (the user, 150 א): outside the
    // fortress's wall and inside the city's wall, against the city's wall, by Pharaoh's daughter's house (60-palace.js: x 35..65, z 560..610) -
    // the Radak's Shorashim (6063:2110) "סמוך לחומה מבפנים", Rashi II Sam 5:9 (3688:113) "סביב למצודה", Metzudat David I Kings 9:24 (3345:889)
    // "שהיה סמוך לביתה". MILLO_C - its centre and size (moved when the city's wall is placed). Two rows: its FORM (151 א) - an open square for
    // the people's gatherings (the Radak 3541:200, the Shorashim, Metzudat David, the Malbim, the Ralbag, Abarbanel; the default) or Rashi's
    // mound - "הקף חומה נמוכה, וממלאין אותה עפר, וגבה התל באמצע, ומשפע והולך לכל רוח" (3688:113); and its TIME - before Solomon: empty, the
    // pilgrims' tents ("כי אביו הניחו לפרש בו עולי רגלים אהלים", Rashi I Kings 9:24, 3673:579), on Rashi's mound David's houses too ("ועליו
    // בנה דוד בתים"); after Solomon (the default - the model's time): houses for her servants ("לבנות לתוכו בתים, לעבדיה ולשפחותיה", 3673:579;
    // the Malbim 3394:580 "להיות מוגדר בשבילה לצניעות ובתים לעבדיה ומשרתיה" - the square fenced), and in Rashi's reading the tower ("ובנה שם
    // מגדל לבת פרעה ולאנשים שעובדין לה", Rashi Sanhedrin 101b, 2180:5595 - the user, 152 א). The breach in the city's wall - with the wall.
    // No women's figures: the pilgrims are men (the shared people kit). Sizes, the houses, the tents and the tower - model choices.
    {
      const IR = new Group(); IR.name = "irDavid"; IR.visible = false; g.add(IR); ctx.layers.irDavid = IR;
      const fnc = (f) => typeof f === "function", groundY = (x, z, from) => { const y = fnc(ctx.shared.floorY) ? ctx.shared.floorY(x, from == null ? 40 : from, z) : -Infinity; return isFinite(y) ? y : -28; };
      const flag = (name, on) => { const f = new Group(); f.name = name; f.visible = on; IR.add(f); ctx.layers[name] = f; return f; };
      const FL = { plaza: flag("milloPlaza", true), tel: flag("milloTel", false), before: flag("milloBefore", false), after: flag("milloAfter", true), hez: flag("irHezekiah", false),
        fortSep: flag("irFortSep", true), fortRashi: flag("irFortRashi", false) };
      // THE CITY (the user's decision 155 א, 22.11.2026, on the sources' proposal 62): south of the palace's terrace (60-palace.js: x 10..196,
      // z 352.5..672.5, its top -10) and lower than it, on a ridge that goes down southward; the Gihon below it ("כלם ירדו מציון עיר דוד שהיה
      // שם בגבוה העיר אל גיחון שהיה בשפל ההר", Abarbanel I Kings 1:38, 3574:116; "אך בת־פרעה עלתה מעיר דוד", 9:24). IR_C: its north edge
      // (N, from W to E), its southern tip (tip - a parameter: by the spring, when the spring's place is decided - 156 ב), the ridge's
      // heights (hN at the north, hT at the tip). Its size, the ridge's form and the wall's line - model choices.
      const IR_C = { N: 690, W: 0, E: 210, tip: [105, 1010], hN: -14, hT: -31, houses: 200 };
      const MILLO_C = { x: 16, z: 722, w: 28, d: 44 };   // inside the city's west wall, at its north end - the nearest to Pharaoh's daughter's house (model choice)
      const ML = { form: "plaza", time: "after", fortress: "sep", built: false, parts: null,
        fort: { x0: 92, x1: 160, z0: 704, z1: 762 },   // the fortress of Zion: in the city's upper part (model choice)
        towerAt: [154, 710], davidAt: [62, 790] };     // its tower; David's house (model choice)
      const stoneM = M2.stoneLight || M2.stone, earthM = new MeshStandardMaterial({ color: 0xa48a62, roughness: 1 }), floorM = new MeshStandardMaterial({ color: 0xc2ab84, roughness: 1 });
      const plasterM = new MeshStandardMaterial({ color: 0xd9ccb2, roughness: 0.95 }), roofM = new MeshStandardMaterial({ color: 0x8f7a5a, roughness: 1 });
      const tentMs = [0xe8dcc0, 0xc9b48a, 0xb88c5a, 0x9c7b52].map((c) => new MeshStandardMaterial({ color: c, roughness: 0.95, side: DoubleSide }));
      // the city's outline and its ridge: high along its middle, down to the ground (-28.5) at the wall; level under the Millo
      const POLY = (() => { const { N, W, E, tip } = IR_C, [tx, tz] = tip, L = tz - N; return [[W, N], [E, N], [E + 12, N + L * 0.25], [E, N + L * 0.53], [tx + 60, tz - 60], [tx, tz], [tx - 60, tz - 60], [W - 5, N + L * 0.53], [W - 12, N + L * 0.25]]; })();
      const inPoly = (x, z) => { let c = false; for (let i = 0, j = POLY.length - 1; i < POLY.length; j = i++) { const [xi, zi] = POLY[i], [xj, zj] = POLY[j]; if ((zi > z) !== (zj > z) && x < (xj - xi) * (z - zi) / (zj - zi) + xi) c = !c; } return c; };
      const edgeDist = (x, z) => { let d = Infinity; for (let i = 0, j = POLY.length - 1; i < POLY.length; j = i++) { const [ax, az] = POLY[j], [bx, bz] = POLY[i], vx = bx - ax, vz = bz - az, t = Math.max(0, Math.min(1, ((x - ax) * vx + (z - az) * vz) / (vx * vx + vz * vz))); d = Math.min(d, Math.hypot(x - ax - vx * t, z - az - vz * t)); } return d; };
      const MILLO_Y = () => IR_C.hN - 2;
      const ridgeH = (x, z) => {
        const C = MILLO_C; if (Math.abs(x - C.x) < C.w / 2 + 2 && Math.abs(z - C.z) < C.d / 2 + 2) return MILLO_Y();
        if (!inPoly(x, z)) return -40;
        const k = Math.max(0, Math.min(1, (z - IR_C.N) / (IR_C.tip[1] - IR_C.N))), hA = IR_C.hN + (IR_C.hT - IR_C.hN) * k, e = Math.min(1, edgeDist(x, z) / 26), sm = e * e * (3 - 2 * e);
        return -28.5 + (hA + 28.5) * sm;
      };
      const gyAt = (x, z) => ridgeH(x, z);
      const instBoxes = (parent, list, mat, name) => {   // list [[x, y, z, sx, sy, sz, ry]] - one InstancedMesh (a unit box from its floor up)
        const geo = new BoxGeometry(1, 1, 1).translate(0, 0.5, 0), im = new InstancedMesh(geo, mat, list.length), m4 = new Matrix4(), qq = new Quaternion(), e = new Euler(), v = new Vector3(), sc = new Vector3();
        list.forEach((b, i) => { qq.setFromEuler(e.set(0, b[6] || 0, 0)); m4.compose(v.set(b[0], b[1], b[2]), qq, sc.set(b[3], b[4], b[5])); im.setMatrixAt(i, m4); });
        im.castShadow = im.receiveShadow = true; im.name = name || "irBoxes"; im.userData.noPick = true; parent.add(im); return im;
      };
      const houses = (parent, pts, name) => {   // simple houses: walls 5 x 3.6 x 5 and a flat roof - two InstancedMeshes
        instBoxes(parent, pts.map((p) => [p[0], p[1], p[2], p[3] || 5, 3.6, p[4] || 5, p[5] || 0]), plasterM, name);
        instBoxes(parent, pts.map((p) => [p[0], p[1] + 3.6, p[2], (p[3] || 5) + 0.4, 0.35, (p[4] || 5) + 0.4, p[5] || 0]), roofM, name + "Roof");
      };
      const buildMillo = () => {
        if (ML.parts) return ML.parts;
        const C = MILLO_C, hx = C.w / 2, hz = C.d / 2, gy = gyAt(C.x, C.z), G0 = new Group(); G0.name = "millo"; IR.add(G0);
        const P = new Group(), T = new Group(), tentsP = new Group(), tentsT = new Group(), housesP = new Group(), housesT = new Group(), davidT = new Group(), fence = new Group(), tower = new Group(), pilgrims = new Group();
        for (const q of [P, T]) G0.add(q);
        P.add(tentsP, housesP, fence); T.add(tentsT, housesT, davidT, tower); G0.add(pilgrims);
        // the square: a floor of beaten earth
        H2.box(P, C.w, 0.25, C.d, floorM, C.x, gy, C.z);
        // Rashi's mound: the low wall round it and the earth within, high in the middle and falling to every side
        const LW = 2.0, LT = 0.9;
        for (const [sx, sz, lx, lz] of [[0, -1, C.w, LT], [0, 1, C.w, LT], [-1, 0, LT, C.d], [1, 0, LT, C.d]]) H2.box(T, lx, LW, lz, stoneM, C.x + sx * (hx - LT / 2), gy, C.z + sz * (hz - LT / 2));
        const moundH = (lx, lz) => { const m = Math.max(Math.abs(lx) / (hx - LT), Math.abs(lz) / (hz - LT)); return LW - 0.2 + 4.2 * (1 - Math.min(1, m) * Math.min(1, m)); };
        {
          const geo = new PlaneGeometry(C.w - 2 * LT, C.d - 2 * LT, 28, 44).rotateX(-Math.PI / 2), ps = geo.attributes.position;
          for (let i = 0; i < ps.count; i++) ps.setY(i, moundH(ps.getX(i), ps.getZ(i)));
          geo.computeVertexNormals();
          const mm = new Mesh(geo, earthM); mm.position.set(C.x, gy, C.z); mm.receiveShadow = true; mm.userData.noPick = true; T.add(mm);
        }
        const yT = (x, z) => gy + moundH(x - C.x, z - C.z);
        // the pilgrims' tents (before Solomon): four-sided, of cloth
        const tent = (parent, x, y, z, i) => { const t = new Mesh(new ConeGeometry(1.7, 2.4, 4, 1, true).rotateY(Math.PI / 4).translate(0, 1.2, 0), tentMs[i % tentMs.length]); t.position.set(x, y, z); t.rotation.y = (i * 0.7) % 1.5; t.castShadow = true; t.userData.noPick = true; parent.add(t); };
        let k = 0;
        for (let iz = 0; iz < 5; iz++) for (let ix = 0; ix < 3; ix++) { const x = C.x - hx + 5 + ix * ((C.w - 10) / 2) + ((iz % 2) ? 1.2 : -1.2), z = C.z - hz + 5 + iz * ((C.d - 10) / 4); tent(tentsP, x, gy + 0.25, z, k++); }
        for (const [lx, lz] of [[-6, -14], [5, -12], [-7, 10], [6, 13], [-2, -6], [3, 6], [-8, 0], [8, -2]]) tent(tentsT, C.x + lx, yT(C.x + lx, C.z + lz), C.z + lz, k++);
        // the pilgrims: men, standing and sitting by the tents
        try {
          const PPm = tm_people(ctx), ptsS = [], ptsG = [];
          let q = 15011; const rr = () => (q = (q * 1664525 + 1013904223) >>> 0) / 4294967296;
          for (let i = 0; i < 18; i++) { const x = C.x + (rr() - 0.5) * (C.w - 6), z = C.z + (rr() - 0.5) * (C.d - 6); (i % 3 ? ptsS : ptsG).push([x, z, rr() * 6.28]); }
          const COLS = [0x6b5a3e, 0x4a4f5a, 0x5c4a3a, 0x3e4a5e, 0x7a6a50];
          PPm.crowd(pilgrims, ptsS, { y: gy + 0.25, s: 1.4, pose: "stand", kind: "worker", robe: COLS[1], tone: (i) => i % 4, name: "milloPilgrims" });
          PPm.crowd(pilgrims, ptsG, { y: gy + 0.25, s: 1.4, pose: "ground", kind: "worker", robe: COLS[3], tone: (i) => (i + 2) % 4, name: "milloPilgrimsSit" });
        } catch (e) { console.warn("[parallels] millo pilgrims", e && e.message); }
        // after Solomon: the houses for her servants - on the square in two rows (and the square fenced, as the Malbim), on the mound in a grid
        const hp = []; for (const sx of [-1, 1]) for (let i = 0; i < 6; i++) hp.push([C.x + sx * (hx - 4.2), gy + 0.25, C.z - hz + 4.5 + i * ((C.d - 9) / 5), 5, 5, 0]);
        houses(housesP, hp, "milloHousesP");
        const FT = 0.7, FH = 3.2, GW = 5;   // the fence round the square: a gate in the east (toward her house)
        for (const [sx, sz, lx, lz] of [[0, -1, C.w, FT], [0, 1, C.w, FT], [-1, 0, FT, C.d]]) H2.box(fence, lx, FH, lz, stoneM, C.x + sx * (hx - FT / 2), gy, C.z + sz * (hz - FT / 2));
        for (const sz of [-1, 1]) H2.box(fence, FT, FH, (C.d - GW) / 2, stoneM, C.x + hx - FT / 2, gy, C.z + sz * (GW / 2 + (C.d - GW) / 4));
        const ht = []; for (const lx of [-6.5, 0.5, 7]) for (const lz of [-12, -2, 9]) ht.push([C.x + lx, yT(C.x + lx, C.z + lz) - 0.2, C.z + lz, 4.6, 4.6, 0]);
        houses(housesT, ht, "milloHousesT");
        const hd = []; for (const [lx, lz] of [[-3, -1], [4, 3], [-1, 12], [2, -13]]) hd.push([C.x + lx, yT(C.x + lx, C.z + lz) - 0.2, C.z + lz, 5, 5, 0.3]);
        houses(davidT, hd, "milloHousesDavid");
        // Rashi (Sanhedrin 101b): the tower for Pharaoh's daughter - at the city's wall's side (the west, for now), its foot in the low wall
        H2.box(tower, 7, 16, 7, stoneM, C.x - hx + 3.5, gy, C.z);
        for (const [dx, dz] of [[-3, -3], [-3, 0], [-3, 3], [0, -3], [0, 3], [3, -3], [3, 0], [3, 3]]) H2.box(tower, 1.2, 1.2, 1.2, stoneM, C.x - hx + 3.5 + dx, gy + 16, C.z + dz);
        G0.traverse((o) => { if (o.isMesh) o.userData.noPick = true; });
        ML.parts = { P, T, tentsP, tentsT, housesP, housesT, davidT, fence, tower, pilgrims, gy };
        return ML.parts;
      };
      const applyMillo = () => {
        FL.plaza.visible = ML.form === "plaza"; FL.tel.visible = ML.form === "tel"; FL.before.visible = ML.time === "before"; FL.after.visible = ML.time !== "before"; FL.hez.visible = ML.time === "hezekiah";
        FL.fortSep.visible = ML.fortress === "sep"; FL.fortRashi.visible = ML.fortress === "rashi";
        const CP = ML.cityParts;
        if (CP) {
          CP.breachFill.visible = ML.time !== "before"; CP.outer.visible = ML.time === "hezekiah"; CP.arkTent.visible = ML.time === "before";
          CP.fortG.visible = ML.fortress === "sep"; CP.towers.visible = ML.fortress === "rashi";
        }
        const Q = ML.parts; if (!Q || !Q.P) return;
        const pl = ML.form === "plaza", bf = ML.time === "before";
        Q.P.visible = pl; Q.T.visible = !pl;
        Q.tentsP.visible = Q.tentsT.visible = Q.pilgrims.visible = bf;
        Q.housesP.visible = Q.fence.visible = !bf; Q.housesT.visible = !bf; Q.tower.visible = !bf; Q.davidT.visible = bf;
      };
      // THE CITY: the ridge, the houses, the wall (its breach before Solomon; Hezekiah's second wall and the pool between the walls), the
      // fortress of Zion and its tower (the row "מצודת ציון"), the stairs down from the city (Nehemiah 3:15), David's house and the ark's tent
      const buildCity = () => {
        if (ML.city) return;
        ML.city = true;
        const CG = new Group(); CG.name = "irDavidCity"; IR.add(CG);
        let x0 = Infinity, x1 = -Infinity, z0 = Infinity, z1 = -Infinity; for (const [x, z] of POLY) { x0 = Math.min(x0, x); x1 = Math.max(x1, x); z0 = Math.min(z0, z); z1 = Math.max(z1, z); }
        x0 -= 6; x1 += 6; z0 -= 6; z1 += 6;
        // the ridge: a grid over the outline, its outside sunk under the ground
        {
          const nx = Math.round((x1 - x0) / 4), nz = Math.round((z1 - z0) / 4), geo = new PlaneGeometry(x1 - x0, z1 - z0, nx, nz).rotateX(-Math.PI / 2), ps = geo.attributes.position;
          for (let i = 0; i < ps.count; i++) { const x = ps.getX(i) + (x0 + x1) / 2, z = ps.getZ(i) + (z0 + z1) / 2; ps.setY(i, ridgeH(x, z)); }
          geo.computeVertexNormals();
          const rm = new Mesh(geo, new MeshStandardMaterial({ color: 0xb8a37a, roughness: 1 })); rm.position.set((x0 + x1) / 2, 0, (z0 + z1) / 2); rm.receiveShadow = true; rm.userData.noPick = true; CG.add(rm);
        }
        // the houses: in the city, clear of the Millo, the fortress, the stairs and David's house
        const FZ = ML.fort, clear = (x, z) => !(Math.abs(x - MILLO_C.x) < MILLO_C.w / 2 + 5 && Math.abs(z - MILLO_C.z) < MILLO_C.d / 2 + 5) && !(x > FZ.x0 - 6 && x < FZ.x1 + 6 && z > FZ.z0 - 6 && z < FZ.z1 + 6) && !(Math.abs(x - ML.davidAt[0]) < 14 && Math.abs(z - ML.davidAt[1]) < 12) && !(Math.abs(x - IR_C.tip[0]) < 9 && z > IR_C.tip[1] - 75);
        let q = 5303; const rr = () => (q = (q * 1664525 + 1013904223) >>> 0) / 4294967296;
        const pts = [];
        for (let z = z0 + 8; z < z1 - 6 && pts.length < IR_C.houses; z += 10.5) for (let x = x0 + 8; x < x1 - 6 && pts.length < IR_C.houses; x += 10.5) {
          if (rr() < 0.22) continue;
          const xx = x + (rr() - 0.5) * 3, zz = z + (rr() - 0.5) * 3;
          if (!inPoly(xx, zz) || edgeDist(xx, zz) < 7 || !clear(xx, zz)) continue;
          pts.push([xx, ridgeH(xx, zz) - 0.4, zz, 5 + rr() * 3, 5 + rr() * 3, (rr() - 0.5) * 0.3]);
        }
        houses(CG, pts, "irDavidHouses");
        ML.cityCount = pts.length;
        // the wall round the city (stone, 9 high on the outline); before Solomon a breach by the Millo (the user: "פרצה בחומה"; Rashi I Kings
        // 11:27 "שהיה הפרץ אחורי המלוא"); Hezekiah - another wall outside it by the Millo, and the pool between the two walls
        const WH = 9, WT = 2.6, wallM = M2.stone, segs = [], breach = { x: MILLO_C.x - MILLO_C.w / 2, z0: MILLO_C.z - 4, z1: MILLO_C.z + 4 };
        const wallG = new Group(), breachFill = new Group(), outer = new Group(), towers = new Group(); CG.add(wallG, breachFill, outer, towers);
        // a stretch of wall from its foot (the ground at the outline) to WH over the highest ground just inside it (the city stands behind it)
        const cxm = (IR_C.W + IR_C.E) / 2, czm = (IR_C.N + IR_C.tip[1]) / 2;
        const seg = (parent, ax, az, bx, bz, h, t, out) => {
          const L = Math.hypot(bx - ax, bz - az); let nx = -(bz - az) / L, nz = (bx - ax) / L; if (nx * (cxm - (ax + bx) / 2) + nz * (czm - (az + bz) / 2) < 0) { nx = -nx; nz = -nz; }
          let hi = -28.5; if (!out) for (const u of [0.1, 0.3, 0.5, 0.7, 0.9]) for (const d of [5, 10]) hi = Math.max(hi, ridgeH(ax + (bx - ax) * u + nx * d, az + (bz - az) * u + nz * d));
          const yb = -29.5, top = Math.max(-28.5 + h, hi + 5.5);
          const m = H2.box(parent, L + t * 0.6, top - yb, t, wallM, (ax + bx) / 2, yb, (az + bz) / 2); m.rotation.y = -Math.atan2(bz - az, bx - ax); return m;
        };
        for (let i = 0; i < POLY.length; i++) {
          const [ax, az] = POLY[i], [bx, bz] = POLY[(i + 1) % POLY.length];
          // the west wall's first stretch carries the breach: cut it into two, the breach's stone apart (shown after Solomon)
          if (i === POLY.length - 1) {   // from [W-12, N+L/4] back to [W, N]: the Millo's side
            const zA = Math.min(az, bz), zB = Math.max(az, bz), xAt = (z) => ax + (bx - ax) * (z - az) / (bz - az);
            seg(wallG, xAt(zA), zA, xAt(breach.z0), breach.z0, WH, WT); seg(wallG, xAt(breach.z1), breach.z1, xAt(zB), zB, WH, WT);
            seg(breachFill, xAt(breach.z0), breach.z0, xAt(breach.z1), breach.z1, WH, WT);
            ML.breachAt = [xAt((breach.z0 + breach.z1) / 2), (breach.z0 + breach.z1) / 2];
            segs.push([ax, az, bx, bz]); continue;
          }
          seg(wallG, ax, az, bx, bz, WH, WT); segs.push([ax, az, bx, bz]);
        }
        // Hezekiah: "ולחוצה החומה אחרת ויחזק את־המלוא עיר דויד" (II Chr 32:5); "ומקוה עשיתם בין החמתים" (Isaiah 22:11) - by the Millo
        // (Metzudat David there, 3318:1617, "וחיזק פרצות המלוא שהיתה בעיר דוד"); the other wall 14 amot out, along the west side; the pool between
        {
          const off = 14, [ax, az] = POLY[POLY.length - 1], [bx, bz] = POLY[0], [cx2, cz2] = POLY[POLY.length - 2];
          seg(outer, ax - off, az, bx - off, bz - 8, WH - 1, WT, true); seg(outer, cx2 - off, cz2, ax - off, az, WH - 1, WT, true);
          seg(outer, bx - off, bz - 8, bx + 30, bz - 8, WH - 1, WT, true);
          const pz = MILLO_C.z + 14, px = ax + (bx - ax) * (pz - az) / (bz - az) - off / 2;   // midway between the two walls
          const pool = new Mesh(new BoxGeometry(9, 0.3, 22), new MeshStandardMaterial({ color: 0x3f7fb5, roughness: 0.15, metalness: 0.1 })); pool.position.set(px, -28.2, pz); pool.userData.noPick = true; outer.add(pool);
          for (const [dx, dz, lx, lz] of [[-5, 0, 0.8, 23.6], [5, 0, 0.8, 23.6], [0, -11.4, 10.6, 0.8], [0, 11.4, 10.6, 0.8]]) H2.box(outer, lx, 1.2, lz, M2.stoneLight || M2.stone, px + dx, -28.8, pz + dz);
          ML.poolAt = [px, pz];
        }
        // towers on the wall (in Rashi's reading - the whole city a fortress, Rashi II Sam 5:6 "מצודת ציון נקראה יבוס")
        const tl = []; for (const [ax, az, bx, bz] of segs) for (const u of [0, 0.5]) { const x = ax + (bx - ax) * u, z = az + (bz - az) * u; const L2 = Math.hypot(cxm - x, czm - z) || 1, hiT = Math.max(-28.5, ridgeH(x + (cxm - x) / L2 * 5, z + (czm - z) / L2 * 5), ridgeH(x + (cxm - x) / L2 * 10, z + (czm - z) / L2 * 10)); tl.push([x, -30, z, 6.5, Math.max(-28.5 + WH, hiT + 5.5) + 4 + 30, 6.5, -Math.atan2(bz - az, bx - ax)]); }
        instBoxes(towers, tl, wallM, "irDavidTowers");
        // the fortress of Zion (the default reading - Metzudat David II Sam 5:7, 3329:252 "שם מבצר חזק, סמוך למקום יבוס"; Abarbanel 3577:125;
        // the Malbim 3390:198): a walled fort in the city's upper part, its gate to the south; its tower - "מגדל דוד, הוא מצודת ציון" (Rashi Song
        // 4:4, 3659:208), high, seen from afar (Metzudat David 3316:122), shields hung on its walls ("לתלות המגינים על כתלי המגדל", 3316:123)
        const fortG = new Group(); CG.add(fortG);
        { const F = ML.fort, FH = 13, FT2 = 3, fy = ridgeH((F.x0 + F.x1) / 2, (F.z0 + F.z1) / 2) - 1, w = F.x1 - F.x0, d = F.z1 - F.z0, gw = 6;
          H2.box(fortG, w, FH, FT2, wallM, (F.x0 + F.x1) / 2, fy, F.z0 + FT2 / 2);
          H2.box(fortG, FT2, FH, d, wallM, F.x0 + FT2 / 2, fy, (F.z0 + F.z1) / 2); H2.box(fortG, FT2, FH, d, wallM, F.x1 - FT2 / 2, fy, (F.z0 + F.z1) / 2);
          for (const sd of [-1, 1]) H2.box(fortG, (w - gw) / 2, FH, FT2, wallM, (F.x0 + F.x1) / 2 + sd * (gw / 2 + (w - gw) / 4), fy, F.z1 - FT2 / 2);
          for (const [cx3, cz3] of [[F.x0, F.z0], [F.x1, F.z0], [F.x0, F.z1], [F.x1, F.z1]]) H2.box(fortG, 7, FH + 5, 7, wallM, cx3, fy, cz3); }
        const towerG = new Group(); CG.add(towerG);
        { const [tx, tz] = ML.towerAt, ty = ridgeH(tx, tz) - 1, TS = 11, TH = 36;
          H2.box(towerG, TS, TH, TS, M2.stoneLight || M2.stone, tx, ty, tz);
          for (const [dx, dz] of [[-4, -4], [-4, 0], [-4, 4], [0, -4], [0, 4], [4, -4], [4, 0], [4, 4]]) H2.box(towerG, 1.6, 1.6, 1.6, M2.stoneLight || M2.stone, tx + dx, ty + TH, tz + dz);
          const sh = new InstancedMesh(new CylinderGeometry(0.75, 0.75, 0.14, 14).rotateX(Math.PI / 2), M2.bronze, 4 * 3 * 5), m4 = new Matrix4(), qq = new Quaternion(), e = new Euler(), v = new Vector3(), one = new Vector3(1, 1, 1);
          let n = 0; for (let f = 0; f < 4; f++) for (let r = 0; r < 3; r++) for (let c = 0; c < 5; c++) { const a = f * Math.PI / 2, u = (c - 2) * 2.0, y = ty + TH - 6 - r * 3.4; v.set(tx + Math.sin(a) * (TS / 2 + 0.1) + Math.cos(a) * u, y, tz + Math.cos(a) * (TS / 2 + 0.1) - Math.sin(a) * u); qq.setFromEuler(e.set(0, a, 0)); m4.compose(v, qq, one); sh.setMatrixAt(n++, m4); }
          sh.castShadow = true; sh.userData.noPick = true; towerG.add(sh); }
        // the stairs down from the city to the wall below by the Shiloach's pool (Nehemiah 3:15 "ועד־המעלות היורדות מעיר דויד"; the Ralbag
        // there, 3635:56 "הנה מציון שהיא עיר דוד היו יורדות מעלות עד חומת ירושלים") - at the southern tip (by the spring, when it is placed there)
        const stairG = new Group(); CG.add(stairG);
        { const [tx, tz] = IR_C.tip, zs = tz - 70, n = 30; const sl = []; for (let i = 0; i < n; i++) { const z = zs + i * (64 / n), y = ridgeH(tx, z); sl.push([tx, y - 0.6, z, 6, 1.1, 64 / n + 0.05, 0]); for (const sd of [-1, 1]) sl.push([tx + sd * 3.4, y - 0.6, z, 0.8, 2.0, 64 / n + 0.05, 0]); } instBoxes(stairG, sl, M2.stoneLight || M2.stone, "irDavidStairs"); }   // the steps between two low parapets
        // David's house (Nehemiah 12:37 "מעל לבית דויד"), and the tent he pitched for the ark until it went up to the Temple ("להעלות את־ארון
        // ברית־יהוה מעיר דוד", I Kings 8:1) - the tent only before Solomon's house of God
        const davidG = new Group(), arkTent = new Group(); CG.add(davidG, arkTent);
        { const [dx2, dz2] = ML.davidAt, dy = ridgeH(dx2, dz2) - 0.5; H2.box(davidG, 22, 9, 14, M2.stoneLight || M2.stone, dx2, dy, dz2); H2.box(davidG, 23, 0.6, 15, roofM, dx2, dy + 9, dz2);
          const tx2 = dx2 + 24, tz2 = dz2 + 2, ty2 = ridgeH(tx2, tz2) - 0.3; const tm2 = new Mesh(new ConeGeometry(4.2, 5.5, 4, 1, true).rotateY(Math.PI / 4).translate(0, 2.75, 0), tentMs[0]); tm2.position.set(tx2, ty2, tz2); tm2.scale.set(1.4, 1, 1); tm2.castShadow = true; arkTent.add(tm2); ML.arkAt = [tx2, ty2, tz2]; }
        CG.traverse((o) => { if (o.isMesh) o.userData.noPick = true; });
        ML.cityParts = { wallG, breachFill, outer, towers, fortG, towerG, stairG, davidG, arkTent };
        applyMillo();
      };
      const ensure = () => { if (!IR.visible) return; if (!ML.parts && !ML.failed) { try { buildMillo(); applyMillo(); } catch (e) { console.warn("[parallels] millo", e && e.message); ML.err = String(e && e.stack || e).slice(0, 300); ML.parts = null; ML.failed = true; } } if (!ML.city) { try { buildCity(); } catch (e) { console.warn("[parallels] ir david", e && e.message); ML.errC = String(e && e.stack || e).slice(0, 300); } } };
      ctx.animated.push(() => { if (IR.visible && ((!ML.parts && !ML.failed) || !ML.city) && fnc(ctx.shared.floorY)) ensure(); });
      const setLayer = (on) => { IR.visible = !!on; if (on) ensure(); return IR.visible; };
      ctx.shared.irDavid = { get on() { return IR.visible; }, set: setLayer, millo: MILLO_C, poly: () => IR_C.poly, stats: () => ({ houses: ML.cityCount || 0, millo: !!ML.parts, err: ML.err, errC: ML.errC }) };
      ctx.shared.millo = {
        get form() { return ML.form; }, get time() { return ML.time; },
        setForm(f) { ML.form = f === "tel" ? "tel" : "plaza"; applyMillo(); return ML.form; },
        setTime(t) { ML.time = t === "before" || t === "hezekiah" ? t : "after"; applyMillo(); return ML.time; },
        get fortress() { return ML.fortress; }, setFortress(f) { ML.fortress = f === "rashi" ? "rashi" : "sep"; applyMillo(); return ML.fortress; },
        at: () => [MILLO_C.x, gyAt(MILLO_C.x, MILLO_C.z), MILLO_C.z]
      };
      applyMillo();
      (ctx.shared.features = ctx.shared.features || {}).irDavid = { key: "irDavid", timed: false, isOn: () => IR.visible, on: () => setLayer(true), off: () => setLayer(false) };
      ctx.labels.push({ text: "המלוא — רחבה פנויה לאסיפת העם (רד״ק; ספר השרשים)", x: MILLO_C.x, y: -2, z: MILLO_C.z, size: 2.2, layers: ["irDavid", "milloPlaza"] });
      ctx.labels.push({ text: "המלוא — ״הקף חומה נמוכה, וממלאין אותה עפר״ (רש״י)", x: MILLO_C.x, y: 0, z: MILLO_C.z, size: 2.2, layers: ["irDavid", "milloTel"] });
      ctx.labels.push({ text: "אהלי עולי הרגלים — ״לפרש בו עולי רגלים אהלים״ (רש״י מלכים א ט, כד)", x: MILLO_C.x, y: -7, z: MILLO_C.z + 8, size: 1.4, layers: ["irDavid", "milloBefore"] });
      ctx.labels.push({ text: "בתים לעבדיה ולשפחותיה (רש״י מלכים א ט, כד)", x: MILLO_C.x + 6, y: -7, z: MILLO_C.z - 8, size: 1.4, layers: ["irDavid", "milloAfter"] });
      ctx.labels.push({ text: "מגדל לבת פרעה (רש״י סנהדרין קא:)", x: MILLO_C.x - MILLO_C.w / 2 + 3.5, y: 4, z: MILLO_C.z, size: 1.4, layers: ["irDavid", "milloTel", "milloAfter"] });
      ctx.labels.push({ text: "עיר דוד", x: 105, y: 8, z: 840, size: 6, layers: ["irDavid"] });
      ctx.labels.push({ text: "מצודת ציון", x: 126, y: 6, z: 733, size: 3, layers: ["irDavid", "irFortSep"] });
      ctx.labels.push({ text: "מצודת ציון — העיר כולה מצודה (רש״י שמואל ב ה, ו)", x: 105, y: 4, z: 780, size: 2.4, layers: ["irDavid", "irFortRashi"] });
      ctx.labels.push({ text: "מגדל דוד — ״הוא מצודת ציון״ (רש״י שיר השירים ד, ד); מגינים על כתליו", x: ML.towerAt[0], y: 27, z: ML.towerAt[1], size: 1.8, layers: ["irDavid"] });
      ctx.labels.push({ text: "״המעלות היורדות מעיר דויד״ (נחמיה ג, טו)", x: IR_C.tip[0] + 8, y: -16, z: IR_C.tip[1] - 40, size: 1.8, layers: ["irDavid"] });
      ctx.labels.push({ text: "בית דוד", x: ML.davidAt[0], y: -2, z: ML.davidAt[1], size: 2, layers: ["irDavid"] });
      ctx.labels.push({ text: "אהל הארון — עד שהועלה למקדש (מלכים א ח, א)", x: ML.davidAt[0] + 24, y: -6, z: ML.davidAt[1] + 2, size: 1.6, layers: ["irDavid", "milloBefore"] });
      ctx.labels.push({ text: "הפרצה — ״פרץ עיר דוד״ (מלכים א יא, כז)", x: MILLO_C.x - MILLO_C.w / 2 - 2, y: -14, z: MILLO_C.z, size: 1.6, layers: ["irDavid", "milloBefore"] });
      ctx.labels.push({ text: "״ולחוצה החומה אחרת״ והמקוה בין החומות (דברי הימים ב לב, ה; ישעיהו כב, יא)", x: MILLO_C.x - MILLO_C.w / 2 - 12, y: -18, z: MILLO_C.z + 14, size: 1.6, layers: ["irDavid", "irHezekiah"] });
      ctx.shared.modelButtons = ctx.shared.modelButtons || [];
      ctx.shared.modelButtons.push({ id: "par-irDavid", label: "הצג את עיר דוד והמלוא", labelOn: "הסתר את עיר דוד", title: "עיר דוד — שכבה פשוטה, כבויה כברירת מחדל: הבתים, המלוא (ומקום החומה והמצודה — לפי המקורות)",
        anchor: [105, 0, 700], maxDist: 320, get: () => IR.visible, set: (on) => { setLayer(on); } });
    }
    ctx.shared.parallels = { watchers };
  }
