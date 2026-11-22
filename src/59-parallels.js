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
    ctx.shared.parallels = { watchers };
  }
