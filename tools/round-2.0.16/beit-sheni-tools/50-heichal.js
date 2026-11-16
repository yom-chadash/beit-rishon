  function m4(x, y, z, rx = 0, ry = 0, rz = 0, sx = 1, sy = 1, sz = 1) {
    const m = new Matrix4();
    m.compose(
      new Vector3(x, y, z),
      new Quaternion().setFromEuler(new Euler(rx, ry, rz)),
      new Vector3(sx, sy, sz)
    );
    return m;
  }
  // 1.3.0: a splayed window reveal - outer ow x oh at z 0, narrowing to iw x ih at z -depth (Menachot 86b "שקופים אטומים" as Rashi reads it:
  // open outside, narrow inside; the First Temple plugin's windows, the user: "תעשה כמו בבית ראשון")
  function hei_splayGeo(ow, oh, iw, ih, depth) {
    const o = [[-ow / 2, -oh / 2, 0], [ow / 2, -oh / 2, 0], [ow / 2, oh / 2, 0], [-ow / 2, oh / 2, 0]];
    const n = [[-iw / 2, -ih / 2, -depth], [iw / 2, -ih / 2, -depth], [iw / 2, ih / 2, -depth], [-iw / 2, ih / 2, -depth]];
    const quads = [[o[0], o[1], n[1], n[0]], [o[3], n[3], n[2], o[2]], [o[0], n[0], n[3], o[3]], [o[1], o[2], n[2], n[1]]];
    const pos = [], uv = [];
    const tuv = [[0, 0], [1, 0], [1, 1], [0, 0], [1, 1], [0, 1]];
    for (const q of quads) {
      const tri = [q[0], q[1], q[2], q[0], q[2], q[3]];
      for (let i = 0; i < 6; i++) {
        pos.push(tri[i][0], tri[i][1], tri[i][2]);
        uv.push(tuv[i][0] * ow, tuv[i][1] * depth);
      }
    }
    const geo = new BufferGeometry();
    geo.setAttribute("position", new BufferAttribute(new Float32Array(pos), 3));
    geo.setAttribute("uv", new BufferAttribute(new Float32Array(uv), 2));
    geo.computeVertexNormals();
    return geo;
  }
  function instMesh(parent, geo, mat, mats, shadows = true) {
    const im = new InstancedMesh(geo, mat, mats.length);
    mats.forEach((mm, i) => im.setMatrixAt(i, mm));
    im.castShadow = shadows;
    im.receiveShadow = shadows;
    parent.add(im);
    return im;
  }
  function spikeMats(segs) {
    const out = [];
    for (const s of segs) {
      const dx = s.x2 - s.x1, dz = s.z2 - s.z1;
      const n = Math.max(2, Math.floor(Math.hypot(dx, dz) / 2) + 1);
      for (let i = 0; i < n; i++) {
        const t = i / (n - 1);
        out.push(m4(s.x1 + dx * t, s.y, s.z1 + dz * t));
      }
    }
    return out;
  }
  async function build4(ctx2) {
    const { H: H2, M: M2 } = ctx2;
    const g = new Group();
    g.name = "heichal";
    ctx2.root.add(g);
    const F = LV.HEI;
    const AZ = LV.KOH;
    const E = CO.xUlamE;
    const W = CO.xHeiW;
    const cut = [];
    H2.box(g, 16.5, 6, 102, M2.marble, 9.25, AZ, 0);
    const otemBlock = H2.box(g, 84.5, 6, 72, M2.marble, -41.25, AZ, 0);   // 1.9.0: named - the Raavad's cells stand in it (the cells below)
    // Middot 3:6 (+5:1): "בין האולם ולמזבח עשרים ושתים אמה, ושתים עשרה מעלות היו שם, רום מעלה חצי אמה ושלחה אמה, אמה אמה ורובד שלש, ואמה אמה
    // ורובד שלש, והעליונה אמה אמה ורובד ארבע". 1.7.1 (the user: "נא לתקן וליצור שתי שיטות"): three drawn readings, switched from the opinions
    // table (ctx2.shared.ulamSteps.set("bartenura" | "tiferet" | "rambam")); the treads run from the altar's west face (x 39.5) west to the
    // ulam (x 17.5), 22 amot, each tread half an amah higher than the one before it, 12 risers = 6 amot = the ulam's floor (LV.HEI - LV.KOH).
    //  - Bartenura (default): 3 amot of flat floor by the altar, then treads 1,1,1 | 3 | 1,1 | 3 | 1,1,1,1 | 4 - the landing (רובד) is itself a
    //    step, "מעלה רביעית היה רחבה שלש אמות... המעלה העליונה היתה רחבה ארבע אמות" (Bartenura 3:6 in the name of R. Baruch). 3 + 19 = 22.
    //  - Tiferet Yisrael (Yachin 3:6): 1 amah of floor, then "שתי מעלות ורובד שלש" three times and "שתי מעלות ורובד ארבע": 1,1,3 | 1,1,3 | 1,1,3 | 1,1,4.
    //  - Rambam (Beit HaBechirah 6:4, as quoted in the notes): level ground, then 12 treads of half an amah next to the ulam.
    // The steps run the whole width of the ulam (100 amot, Tiferet Yisrael 3:6: "לכל רוחב האולם"); before 1.7.1 the model drew 4·4·4 narrow
    // steps and three landings, a reading of neither commentator.
    {
      const ALTAR_W = 39.5;
      const stB = new Group(), stT = new Group(), stR = new Group();
      stT.visible = false;
      stR.visible = false;
      g.add(stB);
      g.add(stT);
      g.add(stR);
      const treads = (grp, flat, widths) => {   // each entry is one step (riser 0.5), landings are the wide ones
        let sx = ALTAR_W - flat, lvl = 0;
        for (const w of widths) {
          lvl += 0.5;
          H2.box(grp, w, lvl, 100, w >= 3 ? M2.marble : M2.stoneSmooth, sx - w / 2, AZ, 0);
          sx -= w;
        }
        if (Math.abs(sx - (ALTAR_W - 22)) > 1e-6) console.warn("ulam steps do not fill 22 amot", widths, sx);
      };
      treads(stB, 3, [1, 1, 1, 3, 1, 1, 3, 1, 1, 1, 1, 4]);
      treads(stT, 1, [1, 1, 3, 1, 1, 3, 1, 1, 3, 1, 1, 4]);
      let rx = ALTAR_W - 16, rl = 0;
      for (let i = 0; i < 12; i++) {
        rl += 0.5;
        H2.box(stR, 0.5, rl, 100, M2.stoneSmooth, rx - 0.25, AZ, 0);
        rx -= 0.5;
      }
      ctx2.shared.ulamSteps = {
        mode: "bartenura",
        set(m) {
          if (m === "mishnah") m = "bartenura";   // the name used up to 1.7.0
          this.mode = m;
          stB.visible = m === "bartenura";
          stT.visible = m === "tiferet";
          stR.visible = m === "rambam";
        }
      };
    }
    // 1.1.0 (Middot 4:6; Rambam Beit HaBechirah 4:3): "ההיכל מאה על מאה על רום מאה" - the 100 amot of height INCLUDE the 6-amah otem (the
    // solid base under the floor: "האוטם שש אמות, וגובהו ארבעים..."), so they are counted from the Azara floor (y 16): walls 22..62,
    // ceiling layers 62..67, upper storey 67..107, its ceiling 107..112, parapet 112..115, kalah orev 115..116. Before 1.1.0 the model
    // counted the 100 from the Heichal floor (top at 122) and was 6 amot too tall.
    const frontWall = H2.wall(g, {
      axis: "z",
      length: 100,
      height: 88.5,   // 1.9.5: up to the gold band (110.5), as the other walls; until 1.9.4 it rose to 115 as its own parapet, five amot thick
      thickness: 5,
      mat: M2.marble,
      occlude: false,
      cx: 15,
      cz: 0,
      y: F,
      openings: [{ center: 0, width: 20, height: 40 }]
    });
    // 1.9.2 (the user: "דווקא בכפתור אני רוצה שהוא יציג את האולם במבט ממורכז"): the ulam's front with its dress - the button "פתח את
    // האולם" (hei-ulam-front, below) takes it away with the ceiling, and the eye stands before the ulam, in its middle
    const ulamFrontCut = [frontWall];
    ulamFrontCut.push(
      H2.box(g, 0.4, 2.5, 40, M2.stoneSmooth, 17.5, F, -30),
      H2.box(g, 0.4, 2.5, 40, M2.stoneSmooth, 17.5, F, 30),
      H2.box(g, 0.15, 37.5, 5, M2.gold, 17.575, F + 2.5, -12.7),
      H2.box(g, 0.15, 37.5, 5, M2.gold, 17.575, F + 2.5, 12.7),
      H2.box(g, 0.15, 3.5, 32, M2.gold, 17.575, 72.5, 0),
      H2.box(g, 6.2, 1.53, 102.4, M2.gold, 15.6, 110.5, 0));   // 1.9.5: the roof's gold band over the facade (until 1.9.4 a band of the facade's own, at 99..102)
    const beamW = [22, 24, 26, 28, 30];
    for (let i = 0; i < 5; i++) ulamFrontCut.push(H2.box(g, 0.8, 1, beamW[i], M2.cedar, 17.6, 62.5 + i * 2, 0));
    const pilG = H2.uvWorldBox(new BoxGeometry(0.5, 76, 1.6), 0.5, 76, 1.6);
    const pilMats = [];
    for (const zz of [34.5, 39.5, 44.5, 49]) {
      pilMats.push(m4(17.6, 60, zz));
      pilMats.push(m4(17.6, 60, -zz));
    }
    ulamFrontCut.push(instMesh(g, pilG, M2.marble, pilMats));
    // 1.3.0 (the user): the ulam's inner width - two readings, both drawn, switched by ctx2.shared.ulamWidth (the opinions table):
    //  "mishnah" (Middot 4:7 as Rashi / Tosafot Yom Tov read it): the hollow is 70, as wide as the house, and the 15 amot by which the ulam
    //    exceeds the house on each side are בית החליפות, the rooms where the knives were kept (solid blocks here, with their label);
    //  "rambam" (Beit HaBechirah 4:5): the ulam's wall is 5 and "from the ulam's wall to the wall of the kodesh ten amot" - the hollow is 90.
    //  Until 1.2.0 the model had a 55-amah hollow with 22.5-amah blocks (Yossi's choice). The south pieces of each reading are in the
    //  cutaway (they hide with "פתח את ההיכל"); a reading's pieces live in its own Group (ctx2.layers.ulamMishnah / ulamRambam), so a
    //  hidden reading stays hidden whatever the cutaway does, and its labels (layer: ...) follow the group.
    const ulamM = new Group(), ulamR = new Group();
    g.add(ulamM);
    g.add(ulamR);
    ctx2.layers = ctx2.layers || {};
    ctx2.layers.ulamMishnah = ulamM;
    ctx2.layers.ulamRambam = ulamR;
    H2.box(ulamM, 11, 90, 15, M2.marble, 7, F, -42.5);   // בית החליפות north (z 35..50)
    cut.push(H2.box(ulamM, 11, 90, 15, M2.marble, 7, F, 42.5));   // בית החליפות south
    // 1.9.3 (the user, of the kuntres' author's note 5: "כן תמיד"; 21:02 "קרן זווית"): THE TWO WICKETS OF BEIT HACHALIFOT, WICKETS AT THE CORNER -
    // Zevachim 55b "רבי יוסי ברבי יהודה אומר: שני פשפשין היו בבית החליפות, וגובהן שמנה, כדי להכשיר את העזרה כולה לאכילת קדשי קדשים
    // ולשחיטת קדשים קלים" (130, line 1920); "והא איכא צדדין" - Rashi (2191, lines 2692, 2699): "ובאותן שני כתלים היו שני פתחים קטנים...
    // ופתוחין למערב", "דפתח להו בקרן זוית - של אולם, מקצת הפתח פונה לצפון ומקצתו למערב, וכן בדרום". So each wicket stands at the outer
    // western corner of its excess (x 1.5, z -50 / 50): two amot of it in the western face and two in the side face, eight high, from
    // the ulam's floor. In this reading the wings are solid, so it is drawn on the faces - dark, in a frame. Its width - a model choice.
    {
      const wkDark = new MeshBasicMaterial({ color: 0x15110b });
      for (const sg of [-1, 1]) {
        const wk = [
          H2.box(ulamM, 0.06, 8, 2, wkDark, 1.47, F, 49 * sg),                 // the part in the western face (z 48..50)
          H2.box(ulamM, 2, 8, 0.06, wkDark, 2.5, F, 50.03 * sg),               // the part in the side face (x 1.5..3.5)
          H2.box(ulamM, 0.3, 8.4, 0.4, M2.stoneSmooth, 1.4, F, 47.8 * sg),     // the frame: the jamb in the western face
          H2.box(ulamM, 0.4, 8.4, 0.3, M2.stoneSmooth, 3.7, F, 50.1 * sg),     // the jamb in the side face
          H2.box(ulamM, 0.3, 0.4, 2.5, M2.stoneSmooth, 1.4, F + 8, 48.9 * sg), // the lintel, round the corner
          H2.box(ulamM, 2.5, 0.4, 0.3, M2.stoneSmooth, 2.6, F + 8, 50.1 * sg)];
        if (sg > 0) cut.push(...wk);
        ctx2.labels.push({ text: "פשפש בית החליפות — בקרן זווית, גבוה שמונה", x: 0.4, y: F + 9.8, z: 51 * sg, size: 1, layer: "ulamMishnah" });
      }
    }
    ctx2.ulamOpenCut = [];   // 1.5.0 (the user: "הוסף כפתור פתח את האולם"): the ulam's roof and the mass above it, of both readings
    ctx2.ulamOpenCut.push(H2.box(ulamM, 11, 0.4, 70, M2.cedar, 7, 63.9, 0), H2.box(ulamM, 11, 46.2, 70, M2.marble, 7, 64.3, 0));
    cut.push(...ctx2.ulamOpenCut);
    // 1.9.3: the side walls with the wicket's part at their west end (x 1.5..3.5, eight high) - see the wickets below
    H2.box(ulamR, 9, 90, 5, M2.marble, 8, F, -47.5);   // the ulam's own wall north (z 45..50), x 3.5..12.5
    H2.box(ulamR, 2, 82, 5, M2.marble, 2.5, F + 8, -47.5);
    cut.push(H2.box(ulamR, 9, 90, 5, M2.marble, 8, F, 47.5), H2.box(ulamR, 2, 82, 5, M2.marble, 2.5, F + 8, 47.5));
    { const a = H2.box(ulamR, 11, 0.4, 90, M2.cedar, 7, 63.9, 0), b = H2.box(ulamR, 11, 46.2, 90, M2.marble, 7, 64.3, 0); ctx2.ulamOpenCut.push(a, b); cut.push(a, b); }
    // 1.9.3 (the wickets - "כן תמיד"; "קרן זווית"): in the Rambam's reading the hall is 90 wide, so the ulam's excess over the house (z 35..45)
    // has a western wall of its own (one amah thick, x 0.5..1.5 - a model choice), which closes the hall and the corner (z up to 50).
    // The wicket at the corner (Rashi, Zevachim 55b): two amot in the western wall by the corner (z 43..45) and two in the side wall's
    // west end (x 1.5..3.5, above), both real openings eight high.
    for (const sg of [-1, 1]) {
      const wk = [H2.box(ulamR, 1, 90, 8, M2.marble, 1, F, 39 * sg), H2.box(ulamR, 1, 82, 2, M2.marble, 1, F + 8, 44 * sg), H2.box(ulamR, 1, 90, 5, M2.marble, 1, F, 47.5 * sg)];
      if (sg > 0) cut.push(...wk);
      ctx2.labels.push({ text: "פשפש בית החליפות — בקרן זווית, גבוה שמונה", x: 0, y: F + 9.8, z: 51 * sg, size: 1, layer: "ulamRambam" });
    }
    ulamR.visible = false;
    // 1.9.3 (the user, of the kuntres, point 2: "תוסיף את שיטת רשי"): THE ULAM'S CEILING A VAULT - Rashi Yoma 52a "כותל אולם - כותל החיצון
    // למטה רוחב היסוד והאסקופה ולמעלה מגובה כיפת הפתח עובי החומה שעולה עד ק' אמה לבד רוחב כיפת החלל שהיא י"א אמה" (2157, line 1959);
    // the Tosafot RID there: "ומשמע מדבריו שאותן י"א אמה... כיפה היתה עליהם" (2109, line 159). A barrel vault over the eleven amot, its
    // crown at the flat ceiling's height, in each reading of the width; hidden by default. Its height and form - model choices.
    const ulamVaults = [];
    {
      // 1.9.3: "כיפת הפתח" (Rashi Yoma 52a) - the ulam's doorway, 20 wide and 40 high (Middot 3:7), ends in an arch: the two corners over
      // the arch are filled, in the wall's five amot. The arch's crown at the doorway's forty - a model choice. Rashi's reading only.
      const ag = new Group();
      g.add(ag);
      const sh = new Shape();
      sh.moveTo(-10, F + 30); sh.absarc(0, F + 30, 10, Math.PI, 0, true); sh.lineTo(10, F + 40.02); sh.lineTo(-10, F + 40.02); sh.closePath();
      const ageo = new ExtrudeGeometry(sh, { depth: 5.02, bevelEnabled: false, curveSegments: 28 });
      ageo.rotateY(Math.PI / 2);
      ageo.translate(12.49, 0, 0);
      const am = new Mesh(ageo, M2.marble);
      am.castShadow = am.receiveShadow = true;
      ag.add(am);
      ulamFrontCut.push(am);
      ulamVaults.push(ag);
    }
    for (const [grp, len] of [[ulamM, 70], [ulamR, 90]]) {
      const vg = new Group();
      grp.add(vg);   // 1.9.3 (20:04): seen by default
      const VR = 5.5, VY1 = 63.95, VY0 = 63.9 - VR;
      const sh = new Shape();
      sh.moveTo(1.5, VY0); sh.absarc(7, VY0, VR, Math.PI, 0, true); sh.lineTo(12.5, VY1); sh.lineTo(1.5, VY1); sh.closePath();
      const vgeo = new ExtrudeGeometry(sh, { depth: len, bevelEnabled: false, curveSegments: 28 });
      vgeo.translate(0, 0, -len / 2);
      const vm = new Mesh(vgeo, M2.marble);
      vm.castShadow = vm.receiveShadow = true;
      vg.add(vm);
      ctx2.ulamOpenCut.push(vm);
      cut.push(vm);
      ulamVaults.push(vg);
    }
    // "vault" - Rashi (the default); "none" - the Tosafot RID (Yoma 52a): "האולם לא הי' אלא כותל אחד... ובינו ובין ההיכל הי' אויר מגולה ולא
    // הי' שם תקרה ולא כיפה" - the ceiling, the building over it and the cap are not there (as when the ulam's roof is opened)
    ctx2.shared.ulamCeiling = { mode: "vault", set(m) { this.mode = m === "none" ? "none" : "vault"; for (const v of ulamVaults) v.visible = this.mode === "vault"; if (ctx2.shared.__ulamRoofApply) ctx2.shared.__ulamRoofApply(); return this.mode; } };
    {
      const MB = Array.isArray(ctx2.shared.modelButtons) ? ctx2.shared.modelButtons : (ctx2.shared.modelButtons = []);
      let on = false;
      // the ceiling only - the place "האולם" (its view from above) and the vine's and the tables' places open it for 15 s
      // (ctx.shared.openFor); 1.9.2: not a button on the model any more (the button is hei-ulam-front)
      MB.push({
        id: "hei-ulam", label: "פתח את תקרת האולם", labelOn: "סגור את תקרת האולם", removal: true, maxDist: 320,
        title: "מסיר את תקרת האולם ואת הבניין שמעליה, כדי לראות מלמעלה את פנים האולם. כלי צפייה בלבד; נסגר מעצמו.",
        anchor: () => null,
        get: () => on,
        set: (v) => { on = !!v; for (const m of ctx2.ulamOpenCut) m.visible = !(on || front || ctx2.shared.ulamCeiling.mode === "none"); if (ctx2.shared.__ulamTopMarks) ctx2.shared.__ulamTopMarks(on); },   // ULAMVIEW_211: the frames of the reading on the top
        under: () => !!(ctx2.shared.camUnder && ctx2.shared.camUnder(ctx2.ulamOpenCut))   // 1.9.2
      });
      // 1.9.2 (the user: "הוסף מתג צף פתח את האולם כמו בבית ראשון (גם במיקום המתג)"; "דווקא בכפתור אני רוצה שהוא יציג את האולם במבט
      // ממורכז (כהשלמה לברירת מחדל שהיא מלמעלה)"): THE BUTTON "פתח את האולם", as the First Temple plugin's ui-ulam - on the ulam's front
      // over its doorway, seen from the east; it takes away the front with its dress and the ceiling, and the eye stands before the ulam,
      // in its middle (70-ui.js REVEAL "hei-ulam-front"). A viewing tool only.
      let front = false;
      ctx2.shared.__ulamRoofApply = () => { for (const m of ctx2.ulamOpenCut) m.visible = !(on || front || ctx2.shared.ulamCeiling.mode === "none"); };   // 1.9.3
      const A_TOP = [15, 116.8, 0], A_FRONT = [18.3, 66.5, 0], A_OPEN = [18.3, 57.5, 0];   // reused: no allocation per frame
      ctx2.shared.__ulamFrontCut = ulamFrontCut;   // (for the checks)
      MB.push({
        id: "hei-ulam-front", label: "פתח את האולם", labelOn: "סגור את האולם", removal: true, maxDist: 150,   // 1.9.3: 150 (it showed from Nikanor's gate, 179 away)
        title: "מסיר את חזית האולם ואת תקרתו, ומעמיד את המבט מול האולם, באמצעו: גפן הזהב, שני השולחנות, השרשרות, קורות הארז ופתח ההיכל. כלי צפייה בלבד — לאולם לא היו דלתות (מידות ב, ג).",
        // over the front's top from above (the place's view), else on its face over the doorway from the east; with the front taken away,
        // a little lower (where the doorway's head was), so that "סגור את האולם" stands in the centred view and not over its top edge
        anchor: () => { const c = ctx2.camera; if (!c) return null; if (c.position.y > 100) return A_TOP; return c.position.x > 17 ? (front ? A_OPEN : A_FRONT) : null; },
        get: () => front,
        set: (v) => {
          front = !!v;
          for (const m of ulamFrontCut) m.visible = !front;
          for (const m of ctx2.ulamOpenCut) m.visible = !(on || front || ctx2.shared.ulamCeiling.mode === "none");
        },
        under: () => !!(ctx2.shared.camUnder && ctx2.shared.camUnder(ctx2.ulamOpenCut))
      });
    }
    // 1.8.0 (the user: "מתג רוחב האולם ב־3 הקריאות, מבט מלמעלה שיראו ההבדלים"): the Tiferet Yisrael's reading (Middot 4:7, Yachin 70-72) as a
    // third: the fifteen amot by which the ulam exceeds the house on each side are its wall, 5 (z 45..50), and a room, 10 north-south by 11
    // east-west ("והוא היה נקרא בית החליפות אותו רווח של י׳ אמה מצפון לדרום וי״א אמה ממזרח למערב... היה חדר מכאן ומכאן"), where each
    // watch kept its knives, with two doors: one to the ulam and one at its outer western corner ("בזוית צפונית מערבית"), each 8 amot high,
    // to make the whole court fit for slaughtering kodashim kalim (Zevachim 55b). The ulam between them 70 wide, as the house. Model choices:
    // the room 20 high, its partition from the ulam (1, on the house's line z 35), its western wall (1, x 0.5..1.5), the doors 4 wide.
    const ulamT = new Group();
    g.add(ulamT);
    ulamT.visible = false;
    ctx2.layers.ulamTiferet = ulamT;
    {
      const RH = 20, MW = M2.marble;
      const roofs = [H2.box(ulamT, 11, 0.4, 70, M2.cedar, 7, 63.9, 0), H2.box(ulamT, 11, 46.2, 70, MW, 7, 64.3, 0)];
      for (const sg of [-1, 1]) {
        const keep = [];
        keep.push(H2.box(ulamT, 12, 90, 5, MW, 6.5, F, 47.5 * sg));                             // the ulam's own wall (z 45..50), to the western wall's line
        keep.push(H2.box(ulamT, 3.5, RH, 1, MW, 3.25, F, 35 * sg), H2.box(ulamT, 3.5, RH, 1, MW, 10.75, F, 35 * sg), H2.box(ulamT, 4, RH - 8, 1, MW, 7, F + 8, 35 * sg));   // the partition, its door at x 5..9
        keep.push(H2.box(ulamT, 1, 90, 4.5, MW, 1, F, 37.75 * sg), H2.box(ulamT, 1, 90, 1, MW, 1, F, 44.5 * sg), H2.box(ulamT, 1, 90 - 8, 4, MW, 1, F + 8, 42 * sg));   // the western wall, its door at z 40..44
        const above = H2.box(ulamT, 11, 90 - RH, 10.5, MW, 7, F + RH, 39.75 * sg);                // over the room, up to the ulam's top
        roofs.push(above);
        if (sg > 0) cut.push(...keep, above);
      }
      ctx2.ulamOpenCut.push(...roofs);
      cut.push(roofs[0], roofs[1]);
      for (const sg of [-1, 1]) ctx2.labels.push({ text: "בית החליפות — חדר (תפארת ישראל)", x: 7, y: F + 12, z: 40 * sg, size: 1.3, layer: "ulamTiferet" });
      ctx2.labels.push({ text: "חלל האולם — תשעים אמה (רמב״ם)", x: 7, y: F + 30, z: 30, size: 1.5, layer: "ulamRambam" }, { text: "חלל האולם — שבעים אמה", x: 7, y: F + 30, z: 22, size: 1.5, layer: "ulamMishnah" }, { text: "חלל האולם — שבעים אמה", x: 7, y: F + 30, z: 22, size: 1.5, layer: "ulamTiferet" });
    }
    ctx2.shared.ulamWidth = { mode: "mishnah", set(m) { this.mode = m === "rambam" || m === "tiferet" ? m : "mishnah"; ulamM.visible = this.mode === "mishnah"; ulamR.visible = this.mode === "rambam"; ulamT.visible = this.mode === "tiferet"; } };
    // ULAMVIEW_211 (the user, 14.11.2026: "בהצגת השינויים באולם (רמב״ם, תפא״י וכו') צריך להרחיק את המבט כדי שיובן הפער"): the row's
    // view is from higher up, over the ulam's whole width (content.json), and while the ulam's roof is open the reading's own parts
    // are framed on the building's top, each with its name: the hollow - a blue frame; בית החליפות - an orange one (the solid
    // fifteen amot of the Tosafot Yom Tov, Tiferet Yisrael's rooms; none for the Rambam, whose hollow is ninety). Signs of the
    // model, as the courts' zones.
    {
      const Y = 112.3, T = 0.8;
      const mH = new MeshBasicMaterial({ color: 0x1596d6 }), mW = new MeshBasicMaterial({ color: 0xf07a00 });
      const holders = [];
      const holder = (grp) => { const h = new Group(); h.visible = false; grp.add(h); holders.push(h); return h; };
      const frame = (parent, x0, x1, za, zb, mat) => {
        const z0 = Math.min(za, zb), z1 = Math.max(za, zb);
        const bar = (w, d, x, z) => { const b = new Mesh(new BoxGeometry(w, 0.5, d), mat); b.position.set(x, Y, z); b.userData.noPick = true; parent.add(b); };
        bar(x1 - x0 + T, T, (x0 + x1) / 2, z0); bar(x1 - x0 + T, T, (x0 + x1) / 2, z1);
        bar(T, z1 - z0, x0, (z0 + z1) / 2); bar(T, z1 - z0, x1, (z0 + z1) / 2);
      };
      const hM = holder(ulamM), hT = holder(ulamT), hR = holder(ulamR);
      frame(hM, 1.5, 12.5, -35, 35, mH);
      for (const sg of [-1, 1]) frame(hM, 1.5, 12.5, 36.1 * sg, 49.6 * sg, mW);
      frame(hT, 1.5, 12.5, -34.4, 34.4, mH);
      for (const sg of [-1, 1]) frame(hT, 1.5, 12.5, 35.6 * sg, 45 * sg, mW);
      frame(hR, 1.5, 12.5, -45, 45, mH);
      const topL = new Group();
      topL.visible = false;
      g.add(topL);
      ctx2.layers.ulamTopMarks = topL;
      ctx2.shared.__ulamTopMarks = (v) => { for (const h of holders) h.visible = !!v; topL.visible = !!v; };
      ctx2.labels.push(
        { text: "חלל האולם — שבעים אמה", x: 7, y: Y + 4, z: 0, size: 4.4, layers: ["ulamMishnah", "ulamTopMarks"] },
        { text: "בית החליפות", x: 7, y: Y + 4, z: -42.8, size: 3, layers: ["ulamMishnah", "ulamTopMarks"] },
        { text: "בית החליפות", x: 7, y: Y + 4, z: 42.8, size: 3, layers: ["ulamMishnah", "ulamTopMarks"] },
        { text: "חלל האולם — שבעים אמה", x: 7, y: Y + 4, z: 0, size: 4.4, layers: ["ulamTiferet", "ulamTopMarks"] },
        { text: "בית החליפות — חדר (תפארת ישראל)", x: 7, y: Y + 4, z: -40.3, size: 2.6, layers: ["ulamTiferet", "ulamTopMarks"] },
        { text: "בית החליפות — חדר (תפארת ישראל)", x: 7, y: Y + 4, z: 40.3, size: 2.6, layers: ["ulamTiferet", "ulamTopMarks"] },
        { text: "חלל האולם — תשעים אמה (רמב״ם)", x: 7, y: Y + 4, z: 0, size: 4.4, layers: ["ulamRambam", "ulamTopMarks"] }
      );
    }
    ctx2.labels.push({ text: "בית החליפות", x: 7, y: F + 24, z: -42.5, size: 1.6, layer: "ulamMishnah" }, { text: "בית החליפות", x: 7, y: F + 24, z: 42.5, size: 1.6, layer: "ulamMishnah" });
    const ulamCap = H2.box(g, 11.7, 1.53, 102.4, M2.gold, 6.65, 110.5, 0);   // 1.9.5: 1.53 - its top a hair over the tops of the wings' blocks (112), which showed through it in patches
    // 1.8.0: "פתח את האולם" opens the top too (the gold cap and the parapets), so the three readings of the width are seen from above
    ctx2.ulamOpenCut.push(ulamCap);   // (1.9.5: the ulam's parapets are pieces of the roof's ring, below; they hide with this list too)
    // 1.9.1 (the user: "צורת הבנין — כציור"): THE BUILDING'S SHAPE - two readings (ctx2.shared.houseShape, the opinions table):
    //  "rambam" (the default): the Rambam's Commentary on Middot 4:7 (book 573, line 59) "והיה כולו ר"ל כל ההיכל מאה על מאה היו מטין הבנין מעט
    //    לצד מערב וכשימשך לצד המזרח מתרחב כדמות האריה", drawn as a trapezoid in his autograph (Kafih); Beit HaBechirah 4:5 (337, 66) "מן הצפון
    //    לדרום מאה אמה. עבי כתל האולם חמש אמות. ומכתל אולם עד כתל הקדש עשר אמות", and 4:9 (337, 70) "ויציעים היו מקיפין לבית כלו מסביב חוץ
    //    לכתל המסבה" - so the ulam's wall (5) runs along the whole house on the north and the south, ten amot out from the cells' outer wall,
    //    and the galleries stand in that space (his drawing of the house, Middot 4:2). The west, after Beit HaBechirah 4:4 (the length 100 ends
    //    with the cells' wall), has no such wall: the galleries pass round it outside. The narrowing: 100 at the ulam, 94 at the west (the
    //    inner faces 45 -> 42 from the axis) - "מעט", a model choice (his drawing narrows more, as a sketch). The walls rise with the ulam to
    //    its top (y 112, a parapet over it); the space between them and the house is open to the sky (model choice).
    //    And the bands, 4:9: "וכן סביב לכתלי האולם מלמטה עד למעלה כך היו אמה אחת חלק ורבד שלש אמות. ואמה חלק ורבד שלש אמות עד למעלה. ונמצאו
    //    הרבדין מקפין לכתלים. רחב כל רבד שלש אמות עד למעלה. ובין כל רבד ורבד אמה. ורבד העליון היה רחבו ארבע אמות" - read by height (the
    //    user: "רוחב היינו הגובה"): from the house's floor (22) an amah plain and a band of 3, and so up; the top band 4 (108..112), so the
    //    plain under it is 2 (the count does not close - a model choice); each band stands out an amah (model choice), on the outer faces of
    //    the long walls and their ends. The ulam's front keeps its own (the model's) dress.
    //  "mishnah": as the model was until 1.9.0 - the house 70 wide behind the ulam's 100 (Middot 4:7 "וההיכל צר מאחוריו ורחב מלפניו").
    {
      const shellG = new Group();
      shellG.name = "house-shell-rambam";
      g.add(shellG);
      const Y0 = AZ, YT = 112, XE = 1.5, XW = -82.5, NE = 45, NW = 42, T5 = 5;
      const L = Math.hypot(XE - XW, NE - NW), ang = Math.asin((NE - NW) / L);
      const parts = [], southBands = [];
      // 1.9.5: the shell's parapets, one group a reading (the reading of the parapet shows its own: applyTop, below)
      const shellParTK = new Group(), shellParRY = new Group();
      shellG.add(shellParTK); shellG.add(shellParRY);
      shellParRY.visible = false;
      ctx2.__shellPar = { tk: shellParTK, ry: shellParRY };
      const slab = (s, w, h, off, y, mat) => {   // a slab along the slanted line, its centre `off` out from the wall's inner face
        const m = H2.box(shellG, L, h, w, mat || M2.marble, (XE + XW) / 2, y, s * ((NE + NW) / 2 + off));
        m.rotation.y = s < 0 ? ang : -ang;   // north: the west end nearer the axis (z grows westward); south mirrored
        parts.push([m, s]);
        if (ctx2.herodAdd && !mat) ctx2.herodAdd(m);
        if (s > 0) cut.push(m);
        else (ctx2.shellNorth = ctx2.shellNorth || []).push(m);   // 1.9.1: the north wall - the mesibah's pill takes it off with its own wall
        return m;
      };
      for (const s of [-1, 1]) {
        slab(s, T5, YT - Y0, T5 / 2, Y0);                          // the wall, 5 thick
        // its parapet. 1.9.5: on the top band's edge - the line of the parapets of the ulam's ends (until 1.9.4 on the wall's own edge, an
        // amah inside that line, three amot in both readings and without the spikes): three amot and the spikes, or four amot (Middot 4:6)
        for (const [hh, grp] of [[3, shellParTK], [4, shellParRY]]) {
          const pm = H2.box(grp, L, hh, 0.9, M2.marble, (XE + XW) / 2, YT, s * ((NE + NW) / 2 + T5 + 0.6));
          pm.rotation.y = s < 0 ? ang : -ang;
          parts.push([pm, s]);
          if (s > 0) cut.push(pm);
          else (ctx2.shellNorth = ctx2.shellNorth || []).push(pm);
        }
        {
          const sg0 = new ConeGeometry(0.12, 1, 6);
          sg0.translate(0, 0.5, 0);
          const sm = instMesh(shellParTK, sg0, M2.gold, spikeMats([{ x1: XW + 1, z1: s * (NW + T5 + 0.6), x2: XE - 1, z2: s * (NE + T5 + 0.6), y: YT + 3 }]), false);
          parts.push([sm, s]);
          if (s > 0) cut.push(sm);
          else (ctx2.shellNorth = ctx2.shellNorth || []).push(sm);
        }
        // the bands (4:9), on the outer face: 1 plain + 3, ..., the top band 4
        const bands = [];
        for (let y = F + 1; y + 3 <= YT - 4 - 1; y += 4) bands.push([y, 3]);
        bands.push([YT - 4, 4]);
        // 1.9.2 (the loading and the rotation were slower since 1.9.1): the bands of a side in one group, instanced - 4 draws a side
        // instead of 42; the group's pieces go to the side's list (the south to the cutaway, the north to the mesibah's pill)
        const bandG = new Group();
        shellG.add(bandG);
        for (const [by, bh] of bands) {
          const m = H2.box(bandG, L, bh, 1, M2.stoneSmooth, (XE + XW) / 2, by, s * ((NE + NW) / 2 + T5 + 0.5));
          m.rotation.y = s < 0 ? ang : -ang;
        }
        // the wall's west end: the bands turn round it (an end face 5 wide)
        for (const [by, bh] of bands) H2.box(bandG, 1, bh, T5 + 1, M2.stoneSmooth, XW - 0.5, by, s * (NW + T5 / 2 + 0.5));
        H2.instancify(bandG, 1);
        for (const m of bandG.children) { if (s > 0) { cut.push(m); southBands.push(m); } else (ctx2.shellNorth = ctx2.shellNorth || []).push(m); }
      }
      ctx2.labels.push(
        { text: "כותל האולם — ״עבי כתל האולם חמש אמות״ (רמב״ם בית הבחירה ד, ה)", x: -30, y: YT + 4, z: -(NE + 2.5), size: 1.7, layer: "houseShellRambam" },
        { text: "הרובדים — ״אמה אחת חלק ורבד שלש אמות״ (רמב״ם ד, ט)", x: -10, y: F + 30, z: -(NE + T5 + 1.6), size: 1.4, layer: "houseShellRambam" },
        { text: "״מטין הבנין מעט לצד מערב״ — מאה במזרח, תשעים וארבע במערב (פירוש המשניות ד, ז)", x: -78, y: YT + 4, z: 0, size: 1.6, layer: "houseShellRambam" }
      );
      ctx2.layers.houseShellRambam = shellG;
      ctx2.shared.houseShape = {
        mode: "mishnah",
        set(m) { this.mode = m === "rambam" ? "rambam" : "mishnah"; shellG.visible = this.mode === "rambam"; return this.mode; }
      };
      ctx2.shared.houseShape.set("mishnah");   // 1.9.3 (the user, 21:00: "להפוך את ברירת המחדל"): the Mishnah's shape by default - the wickets of Beit HaChalifot are seen
      // 1.9.3 (the user: "מתג במאה שמראה את הפשפש"): in the Rambam's shape his south wall hides the south wicket - the feature
      // shellSouth takes it off for a place's 15 s (as shellNorth, below) and gives back what was shown before
      {
        const sp = parts.filter((p) => p[1] > 0).map((p) => p[0]).concat(southBands);
        let sOff = false, was = null;
        ctx2.shared.features = ctx2.shared.features || {};
        ctx2.shared.features.shellSouth = { key: "shellSouth", isOn: () => sOff,
          on: () => { if (sOff) return; sOff = true; was = sp.map((m) => m.visible); for (const m of sp) m.visible = false; },
          off: () => { if (!sOff) return; sOff = false; sp.forEach((m, i) => { m.visible = was ? was[i] : true; }); was = null; } };
      }
      // 1.9.1 (the user, on the place of Beit HaMoked's gate: "גם זו תקלה"): the Rambam's north wall stands between the court's north strip and
      // the house, so a view of a door in the north row (from the court's side) needs it off for a while - the feature shellNorth (a place's 15 s)
      ctx2.shared.features = ctx2.shared.features || {};
      let nOff = false;
      ctx2.shared.features.shellNorth = { key: "shellNorth", isOn: () => nOff,
        on: () => { nOff = true; for (const m of ctx2.shellNorth || []) m.visible = false; },
        off: () => { nOff = false; for (const m of ctx2.shellNorth || []) m.visible = true; } };
    }
    // ===== 1.4.0 (the user, "להוסיף הכל"): THE 38 CELLS, THE MESIBAH, THE UPPER STOREY AND ITS LULIN (Middot 4:3-5, 4:7; Rambam 4:10-13).
    // Until 1.3.0 the house's long sides were solid blocks 25 thick with the cells drawn on them. Now, per side (north s = -1, south s = +1),
    // from the room outward: the house's wall 6 (z 10..16) - it recedes one amah per storey, so the cell is 5, 6 and 7 wide (4:4 "התחתונה
    // חמש ורובד שש, האמצעית שש ורובד שבע, והעליונה שבע"); the cell (16..21); the cells' wall 5 (21..26); the mesibah 3 (26..29; in the south
    // "בית הורדת המים", 4:7); its wall (29..35). Three storeys (model choice: 14 amot each, 22..36..50..64, the roof of the cells at 64 - the
    // Mishnah gives the storeys no height), 15 cells a side and 8 in the west (3 + 3 + 2, 4:3), the partitions 0.5 (model choice); each cell has
    // three doors - to the right, to the left and to the one above it (4:3) - drawn as dark openings. The mesibah climbs along the north from
    // the north-east corner to the cells' roof at the north-west (4:5 "הלך על גבי כל פני הצפון עד שהוא מגיע למערב"), then one walks on the
    // roofs round the west and along the south to the door of the upper storey, which opens to the south (4:5); the pill "פתח את המסיבה"
    // takes the mesibah's outer wall off. The upper storey (67..107) is hollow: the ceiling layers of the house (62..67: כיור, בית דלפה,
    // תקרה, מעזיבה), its floor with the three lulin over the Holy of Holies (4:5 "ולולין היו פתוחין בעליה לבית קדש הקדשים") and the row of
    // ראשי פספסין between its kodesh part and its devir part. The south pieces are in the cutaway ("פתח את ההיכל").
    // ===== 1.9.0 (the user: "איורי התאים חובה כל השיטות"): THE CELLS BY READINGS. Until 1.8.2 fifteen cells a storey were drawn on each
    // side; Middot 4:3 "שבצפון ושבדרום, חמשה על גבי חמשה, וחמשה על גביהם. ושבמערב, שלשה על גבי שלשה, ושנים על גביהם" (Rambam 4:10) -
    // five a storey in the north and the south, three, three and two in the west. Per side, outward from the house's inner face (|z| 10;
    // x -65.5 in the west): the house's wall, the cell, the cell's outer wall - seventeen amot (4:7 "כתל התא חמש, והתא שש, כתל ההיכל שש");
    // then, in the north, the mesibah 3 (27..30) and its wall 5 (30..35), in the south "בית הורדת המים" and its wall (1.9.0: they were
    // 26..29 and 29..35). How the cells widen 5, 6, 7 (4:4 "התחתונה, חמש, ורבד שש. והאמצעית, שש, ורבד שבע. והעליונה, שבע") - eight
    // readings, ctx2.shared.cellsReading (the opinions table "צורת התאים"); each reading is its own Group (ctx2.layers.cells_<key>), built
    // when it is first chosen; its south part goes into the cutaway; its labels stand at the section (x -37.4) and follow its layer:
    //   rashi    - Rashi and the R"Sh (TYT 4:4; R. Shemaya, the Rosh): the house's wall 6, 5, 4, the cells 5, 6, 7; the 17th amah in the outer
    //              wall (6) - model choice
    //   ri       - Ri in Tosafot (Yoma 52a, Bava Batra 61a; the Yad Ramah): the wall 7, 6, 5; the Mishnah (4:7) measures the middle storey
    //   riB      - Ri, "אי נמי": half an amah from every wall, the partitions too - the wall 6.5, 6, 5.5, the outer wall 5.5, 5, 4.5, square cells
    //   riC      - Ri, "עוד": the lower cell 6 in the Second Temple; the storeys above (7, 8) are not stated (לא מאומת)
    //   rybm     - R. Yitzchak bar Mordechai: the ledges in the cell's outer wall - its top course 6, then 7, standing out one amah, then two
    //   habachur - R. Yitzchak HaBachur: no ledge in the house's wall; the beams from partition to partition in recesses of half an amah on
    //              each face; the cells 6 wide on every storey, their length 5, 6, 7
    //   rid      - Tosafot RID (Bava Batra 61a, Kovetz Shitot Kamai): the house's wall 6 and, in the lower cell, a wall of one amah against it up
    //              to the ceiling, for the beams; the wall 5 from the middle ceiling up
    //   raavad   - the Raavad (Hasagot 4:9): the cell 5 only opposite the otem (6 amot, 16..22 - the lower storey stands there, as the TYT reads
    //              him, 4:3), then 6; the house's wall 7, then 6; the common otem block gives way to the cells there
    // The cells' centres along the wall are the same in every reading (five in the 67 amot from the house's front wall, x -4.5, to the line
    // of the west wall, -71.5, partitions of 2 - model choice; in the west three in z -22..22, two on the top storey).
    const cellsG = new Group();
    g.add(cellsG);
    const cutS = [];   // the south side's common pieces (into the cutaway)
    const outerWalls = [];   // the house's outer faces (the Herod material swap below)
    const wallBox = (w, h, d, x, y, z, s, keep) => { const m = H2.box(cellsG, w, h, d, M2.marble, x, y, z); if (s > 0 && !keep) cutS.push(m); return m; };
    const dark = new MeshStandardMaterial({ color: 0x15110b, roughness: 1 });
    const unitBox = new BoxGeometry(1, 1, 1);
    const CELLS_R = {
      rashi: { st: [22, 36, 50, 64], hw: [6, 5, 4], cw: [5, 6, 7], ow: [6, 6, 6] },
      ri: { st: [22, 36, 50, 64], hw: [7, 6, 5], cw: [5, 6, 7], ow: [5, 5, 5] },
      riB: { st: [22, 36, 50, 64], hw: [6.5, 6, 5.5], cw: [5, 6, 7], ow: [5.5, 5, 4.5], len: [5, 6, 7] },
      riC: { st: [22, 36, 50, 64], hw: [6, 5, 4], cw: [6, 7, 8], ow: [5, 5, 5] },
      rybm: { st: [22, 36, 50, 64], hw: [6, 6, 6], cw: [5, 6, 7], ow: [5, 5, 5], shift: true },
      habachur: { st: [22, 36, 50, 64], hw: [6, 6, 6], cw: [6, 6, 6], ow: [5, 5, 5], len: [5, 6, 7], along: true },
      rid: { st: [22, 36, 50, 64], hw: [6, 6, 5], cw: [6, 6, 7], ow: [5, 5, 5], pil: true },
      raavad: { st: [16, 22, 43, 64], hw: [7, 6, 6], cw: [5, 6, 6], ow: [5, 5, 5], otem: true },
      rambam: { st: [22, 36, 50, 64], rambam: true }   // 1.9.1: his own drawings (rambamCells below)
    };
    // the labels of each reading, at the section (text, y, z); tools/rows_190.py maps them to the reading's card
    const CELLS_LBL = {"rashi": [["צורת התאים — רש״י והר״ש", 63.6, -22.5], ["קומה תחתונה", 29.0, -40], ["כותל ההיכל 6", 31.6, -13.0], ["התא 5", 29.0, -18.5], ["כותל התא 6", 26.4, -24.0], ["קומה אמצעית", 43.0, -40], ["כותל ההיכל 5", 45.6, -12.5], ["התא 6", 43.0, -18.0], ["כותל התא 6", 40.4, -24.0], ["קומה עליונה", 57.0, -40], ["כותל ההיכל 4", 59.6, -12.0], ["התא 7", 57.0, -17.5], ["כותל התא 6", 54.4, -24.0], ["המסבה 3", 60, -28.5], ["כותל המסבה 5", 30, -32.5]], "ri": [["צורת התאים — ר״י, פירוש ראשון", 63.6, -22.5], ["קומה תחתונה", 29.0, -40], ["כותל ההיכל 7", 31.6, -13.5], ["התא 5", 29.0, -19.5], ["כותל התא 5", 26.4, -24.5], ["קומה אמצעית", 43.0, -40], ["כותל ההיכל 6", 45.6, -13.0], ["התא 6", 43.0, -19.0], ["כותל התא 5", 40.4, -24.5], ["קומה עליונה", 57.0, -40], ["כותל ההיכל 5", 59.6, -12.5], ["התא 7", 57.0, -18.5], ["כותל התא 5", 54.4, -24.5], ["המסבה 3", 60, -28.5], ["כותל המסבה 5", 30, -32.5]], "riB": [["צורת התאים — ר״י, פירוש שני", 63.6, -22.5], ["קומה תחתונה", 29.0, -40], ["כותל ההיכל 6½", 31.6, -13.25], ["התא 5 על 5", 29.0, -19.0], ["כותל התא 5½", 26.4, -24.25], ["קומה אמצעית", 43.0, -40], ["כותל ההיכל 6", 45.6, -13.0], ["התא 6 על 6", 43.0, -19.0], ["כותל התא 5", 40.4, -24.5], ["קומה עליונה", 57.0, -40], ["כותל ההיכל 5½", 59.6, -12.75], ["התא 7 על 7", 57.0, -19.0], ["כותל התא 4½", 54.4, -24.75], ["המסבה 3", 60, -28.5], ["כותל המסבה 5", 30, -32.5]], "riC": [["צורת התאים — ר״י, פירוש שלישי", 63.6, -22.5], ["קומה תחתונה", 29.0, -40], ["כותל ההיכל 6", 31.6, -13.0], ["התא 6", 29.0, -19.0], ["כותל התא 5", 26.4, -24.5], ["קומה אמצעית — לא מאומת", 43.0, -40], ["כותל ההיכל 5", 45.6, -12.5], ["התא 7", 43.0, -18.5], ["כותל התא 5", 40.4, -24.5], ["קומה עליונה — לא מאומת", 57.0, -40], ["כותל ההיכל 4", 59.6, -12.0], ["התא 8", 57.0, -18.0], ["כותל התא 5", 54.4, -24.5], ["המסבה 3", 60, -28.5], ["כותל המסבה 5", 30, -32.5]], "rybm": [["צורת התאים — ר׳ יצחק בר מרדכי", 63.6, -22.5], ["קומה תחתונה", 29.0, -40], ["כותל ההיכל 6", 31.6, -13.0], ["התא 5", 29.0, -18.5], ["כותל התא 5", 26.4, -23.5], ["קומה אמצעית", 43.0, -40], ["כותל ההיכל 6", 45.6, -13.0], ["התא 6", 43.0, -19.0], ["כותל התא 5", 40.4, -24.5], ["קומה עליונה", 57.0, -40], ["כותל ההיכל 6", 59.6, -13.0], ["התא 7", 57.0, -19.5], ["כותל התא 5", 54.4, -25.5], ["השורה העליונה — 6", 34.5, -24], ["השורה העליונה — 7", 48.5, -25.5], ["המסבה 3", 60, -28.5], ["כותל המסבה 5", 30, -32.5]], "habachur": [["צורת התאים — ר׳ יצחק הבחור", 63.6, -22.5], ["קומה תחתונה", 29.0, -40], ["כותל ההיכל 6", 31.6, -13.0], ["התא 6, אורכו 5", 29.0, -19.0], ["כותל התא 5", 26.4, -24.5], ["קומה אמצעית", 43.0, -40], ["כותל ההיכל 6", 45.6, -13.0], ["התא 6, אורכו 6", 43.0, -19.0], ["כותל התא 5", 40.4, -24.5], ["קומה עליונה", 57.0, -40], ["כותל ההיכל 6", 59.6, -13.0], ["התא 6, אורכו 7", 57.0, -19.0], ["כותל התא 5", 54.4, -24.5], ["המסבה 3", 60, -28.5], ["כותל המסבה 5", 30, -32.5]], "rid": [["צורת התאים — תוספות רי״ד", 63.6, -22.5], ["קומה תחתונה", 29.0, -40], ["כותל ההיכל 6", 31.6, -13.0], ["כותל של אמה", 24.5, -16.5], ["התא 5", 29.0, -19.5], ["כותל התא 5", 26.4, -24.5], ["קומה אמצעית", 43.0, -40], ["כותל ההיכל 6", 45.6, -13.0], ["התא 6", 43.0, -19.0], ["כותל התא 5", 40.4, -24.5], ["קומה עליונה", 57.0, -40], ["כותל ההיכל 5", 59.6, -12.5], ["התא 7", 57.0, -18.5], ["כותל התא 5", 54.4, -24.5], ["המסבה 3", 60, -28.5], ["כותל המסבה 5", 30, -32.5]], "rambam": [["צורת התאים — הרמב״ם, כציורו", 65.5, -22.5], ["קומה תחתונה", 29.0, -47], ["קומה אמצעית", 43.0, -47], ["קומה עליונה", 57.0, -47], ["תא — כותל ההיכל 6", 33.5, -13.0], ["תא — התא 6", 30.5, -19.0], ["תא — כותל התא 5", 27.5, -24.5], ["תא — המסבה 3", 24.5, -28.5], ["תא — כותל המסבה 5", 33.5, -32.5], ["יציע חמש", 25.0, -37.5], ["רובד שש", 36.9, -38.0], ["יציע שש", 40.0, -38.0], ["רובד שבע", 50.9, -38.5], ["יציע שבע", 54.0, -38.5]], "raavad": [["צורת התאים — הרמב״ם (כדברי הראב״ד והתוי״ט)", 63.6, -22.5], ["כנגד האוטם", 19.0, -40], ["כותל ההיכל 7", 21.6, -13.5], ["התא 5", 19.0, -19.5], ["כותל התא 5", 16.4, -24.5], ["קומה אמצעית", 32.5, -40], ["כותל ההיכל 6", 35.1, -13.0], ["התא 6", 32.5, -19.0], ["כותל התא 5", 29.9, -24.5], ["קומה עליונה", 53.5, -40], ["כותל ההיכל 6", 56.1, -13.0], ["התא 6", 53.5, -19.0], ["כותל התא 5", 50.9, -24.5], ["המסבה 3", 60, -28.5], ["כותל המסבה 5", 30, -32.5]]};
    const CELL_CX = [0, 1, 2, 3, 4].map((i) => -4.5 - 13.4 * (i + 0.5));   // -11.2, -24.6, -38, -51.4, -64.8
    const CELL_WZ = { 3: [-44 / 3, 0, 44 / 3], 2: [-11, 11] };              // the west cells' centres (z)
    const CUT_X = -38;   // the section through the middle cell
    ctx2.layers = ctx2.layers || {};
    // the readings' labels show only in their section (the navigation box's "חתך" on, east-west, at the middle cell): a layer whose
    // visibility is read from ctx2.shared.section (the label loop reads ctx.layers[...].visible every frame)
    {
      const secLayer = new Group();
      Object.defineProperty(secLayer, "visible", { get: () => { const S = ctx2.shared.section; return !!(S && S.on && S.axis === "x" && Math.abs(S.v - CUT_X) < 4); }, set: () => {} });
      ctx2.layers.cellsSection = secLayer;
    }
    // CELLS_CLEAN_211: while the cells' section shows, the labels that are not its own are put aside (names of far gates and chambers stood
    // among the numbers). By the sprite's MATERIAL, not its own visibility - the interface's label loop sets that every frame.
    if (Array.isArray(ctx2.animated)) {
      let lgc = null, last = false;
      ctx2.animated.push(() => {
        const CS = ctx2.layers.cellsSection, on = !!(CS && CS.visible);
        if (!on && !last) return;
        if (!lgc) { try { lgc = ctx2.scene.getObjectByName("labels"); } catch (_) { lgc = null; } }
        if (!lgc) return;
        for (const spr of lgc.children) {
          const L = spr.userData.layers, hide = on && !(L && L.indexOf("cellsSection") >= 0);
          if (spr.material && spr.material.visible === hide) spr.material.visible = !hide;
        }
        last = on;
      });
    }
    // 1.9.1 (the user: "בלחיצת מתג המסיבה אמור להיפתח הקירוי שלה"): in the Rambam's reading the mesibah is the lowest cell of its strip (z 27..30,
    // x -82.5..-4.5; rambamCells below) - its place cuts the model by height above that storey (the section, axis "y", at 35.2, for 15 s)
    // and this layer marks it: an amber plate on its floor and its name, shown while that cut is on and the Rambam's reading is chosen
    {
      const mp = new Group();
      Object.defineProperty(mp, "visible", { get: () => { const S = ctx2.shared.section, R = ctx2.shared.cellsReading; return !!(S && S.on && S.axis === "y" && S.v < 40 && (!R || R.mode === "rambam")); }, set: () => {} });
      const plate = new Mesh(new BoxGeometry(78, 0.08, 3), new MeshBasicMaterial({ color: 0xffb21a, transparent: true, opacity: 0.45, depthWrite: false }));
      plate.position.set(-43.5, F + 0.15, -28.5);
      plate.userData.noPick = true;
      mp.add(plate);
      g.add(mp);
      ctx2.layers.mesibahPlan = mp;
      ctx2.labels.push({ text: "המסבה — התא התחתון שברצועה זו (פירוש המשניות לרמב״ם)", x: -43.5, y: F + 6, z: -28.5, size: 1.6, layer: "mesibahPlan" });
    }
    const cellParts = {};
    for (const key of Object.keys(CELLS_R)) {
      const grp = new Group(), south = new Group();
      grp.visible = false;
      grp.add(south);
      cellsG.add(grp);
      ctx2.layers["cells_" + key] = grp;
      cellParts[key] = { grp, south, built: false };
      // CELLS_CLEAN_211 (the user, 14.11.2026, of the row "צורת התאים": the drawings, the cards and the chips are a jumble - "רק המספרים
      // השונים, מודגשים ובצבע"): a number that is NOT the Mishnah's plain one - the heichal's wall 6 and the cell's wall 5 (Middot 4:7),
      // the cells 5, 6, 7 from below (4:4) - stands on a dark plate with a red rim, and so do the two things only one reading has (the
      // Rid's wall of an amah, R. Yitzchak bar Mordechai's upper rows); every other label is plain and smaller, and the title too.
      // So what a reading changes is seen at a glance. (The Rambam's own drawings - "rambam" - keep their labels as they were.)
      let storey = -1;
      for (const [text, y, z] of CELLS_LBL[key]) {
        if (/^(קומה|כנגד האוטם)/.test(text)) storey++;
        const title = text.indexOf("צורת התאים") === 0, small = text.indexOf("תא — ") === 0;
        const mH = /^כותל ההיכל (\S+)$/.exec(text), mO = /^כותל התא (\S+)$/.exec(text), mC = /^התא (\d+)/.exec(text);
        const hot = key !== "rambam" && !!((mH && mH[1] !== "6") || (mO && mO[1] !== "5") || (mC && storey >= 0 && storey <= 2 && +mC[1] !== [5, 6, 7][storey]) || /^(כותל של אמה|השורה העליונה)/.test(text));
        const rec = { text, x: CUT_X + 0.6, y, z, size: title ? 3.4 : small ? 2.3 : key === "rambam" ? 3 : hot ? 3 : 2.4, layers: ["cells_" + key, "cellsSection"] };   // 1.9.1: the Rambam's five strips, smaller
        if (hot) { rec.box = true; rec.rim = "#e0562f"; rec.onTop = true; }
        ctx2.labels.push(rec);
      }
    }
    // ===== 1.9.1 (the user: "איורי התאים כפי שהבאת מקאפח"; and before it "כך תעשה"): THE RAMBAM'S CELLS, by his own drawings in the
    // Commentary on the Mishnah (Middot 4:3, Kafih's edition from the autograph - the page images checked; the library's translation, book
    // 573 line 51): "כבר אמרנו בתמיד שתא נקראת ההרחקה שיש בין שתי הכתלים... תמצא בצפון חמשה הרחקות והם כותל מסבה ומסבה וכותל התא והתא
    // וכותל ההיכל וכמותם בדרום... כותל המסיבה וכותל התא וכותל ההיכל לא היה כותל סתום אלא שני כותלים וביניהם הרחקה"; Mishneh Torah, Beit
    // HaBechirah 4:10 "כל אלו המקומות הפנויים שבין הכתלים הם הנקראים תאים". Per side (north, south): six thin walls and five strips, each strip
    // one long cell a storey, three storeys (his drawing: three rows of five, the lowest row named כותל ההיכל, התא, כותל התא, המסבה, כותל
    // המסבה); in the west three strips (כותל התא, התא, כותל ההיכל), three and three, and on the top storey TWO cells, each half the band
    // (his drawing: the line between them over the middle of the middle strip). The thin walls one amah (model choice: no source gives their
    // thickness), so the strips are 4, 6, 3, 3 and 3 clear. The inner three strips run round the north, the west and the south (his drawing
    // of 4:2: nested bands); the corner squares are the west cells' (a partition closes each north / south cell there - model choice). The
    // mesibah: for him the lowest cell of its strip ("לקצת התאים היו שמות כגון שקרא השורה התחתונה מהם מסיבה ובית הורדת המים"), and the cell
    // with five doors stood "בדיוטא האמצעית של התאים והוא שהיה על גבי המסיבה" (Kafih) - so the staircase of the other readings is not drawn
    // here; how one went up in it, he does not explain. The doors: one in every thin wall between two cells, a storey (the cell's right and
    // left), and one in every floor (to the cell above), drawn as dark openings. THE YATZI'IM (Middot 4:4; the Commentary there: "הם
    // הגזוזטראות המקיפות להיכל מבחוץ... וכן היה מוקף כל ההיכל מבחוץ לכותל המסבה ג' גזוזטראות"; Mishneh Torah 4:9 "ויציעים היו מקיפין לבית
    // כלו מסביב חוץ לכתל המסבה... וכן היו השלש יציעים מקיפים לבית משלשה רוחותיו"): his drawing has the wall straight and the galleries
    // growing outward - the lowest 5, the middle 6, the top 7, each one amah beyond the one under it, a רובד (slab) of 6 and of 7 between
    // them (Kafih: "עד שאי אפשר לטפס בכותל"). Here round the north, the west and the south, their floors at the cells' storeys (22 on a
    // plinth like the otem, 36, 50), the slabs one amah thick, a railing on each edge, the top one open: model choices.
    const nonRambam = new Group();   // the common pieces the Rambam's reading replaces: the mesibah's staircase and the outer wall 30..35
    cellsG.add(nonRambam);
    ctx2.layers.nonRambamCells = nonRambam;
    const rambamCells = (P, boxXZ, inst, doors, doorsS, outer, PART) => {
      const ST = [22, 36, 50, 64];
      const yb = (k) => (k === 0 ? ST[0] : ST[k] - 1), yt = (k) => (k < 2 ? ST[k + 1] - 1 : ST[3]);
      const WALLS = [[0, 1], [5, 6], [12, 13], [16, 17], [20, 21], [24, 25]];   // offsets from the inner face (|z| 10; x -65.5 in the west)
      const STRIPS = [[1, 5], [6, 12], [13, 16], [17, 20], [21, 24]];             // the five cells; the inner three turn round the west
      const XE = -4.5, XWE = -82.5, IN = 10, XI = -65.5, DOOR_X = -31;          // the doors in the long walls: off the section at -38
      for (const s of [-1, 1]) {
        const Z = (a, b) => (s < 0 ? [-(IN + b), -(IN + a)] : [IN + a, IN + b]);
        const D = s > 0 ? doorsS : doors;
        for (let k = 0; k < 3; k++) {
          const y0 = yb(k), y1 = yt(k), top = k === 2;
          WALLS.forEach(([a, b], i) => {
            // the inner four walls reach the west leg's outer face; on the top storey the middle two stop at the house's west face
            let xw = i < 4 ? XI - b : XWE;
            if (top && (i === 1 || i === 2)) xw = XI - 1;
            const m = boxXZ(s, xw, XE, y0, y1, ...Z(a, b), i === 0 || i === 5 ? undefined : PART);
            if (i === 5 && m) outer.push(m);
            if (i > 0 && i < 5) inst(D, DOOR_X, ST[k] + 1.5, s * (IN + (a + b) / 2), 1.6, 3, b - a + 0.1);   // the door between two cells
          });
          // the corner partitions: a north / south cell of an inner strip ends where the west cell begins (on the top storey: at the house's west face)
          STRIPS.slice(0, 3).forEach(([a, b]) => { const xc = top ? XI - 1 : XI - a; boxXZ(s, xc, xc + 1, y0, y1, ...Z(a, b), PART); });
          boxXZ(s, XWE, XWE + 1, y0, y1, ...Z(17, 25), PART);   // the outer two strips' west end (they do not turn)
          boxXZ(s, XE - 1, XE, y0, y1, ...Z(17, 25), PART);     // and their east end (the house's front wall reaches |z| 27)
          if (k < 2) {
            STRIPS.forEach(([a, b]) => inst(D, DOOR_X - 9, ST[k + 1] - 0.25, s * (IN + (a + b) / 2), 1.2, 0.6, Math.min(1.2, b - a - 0.4)));   // the door up
            boxXZ(s, XWE, XE, ST[k + 1] - 0.5, ST[k + 1], ...Z(0, 25));                                                                   // the floor above
          }
        }
        boxXZ(s, XWE, XE, ST[3] - 1, ST[3] - 0.25, ...Z(0, 25));   // the cells' roof (under the walk)
      }
      // the west band (x -65.5 .. -82.5): the inner four walls' west legs; on the top storey two cells, the line between them at x -74
      for (let k = 0; k < 3; k++) {
        const y0 = yb(k), y1 = yt(k), top = k === 2;
        WALLS.slice(0, 4).forEach(([a, b], i) => {
          if (top && (i === 1 || i === 2)) return;
          const m = boxXZ(-1, XI - b, XI - a, y0, y1, -(IN + a), IN + a, i === 0 || i === 3 ? undefined : PART);
          if (i === 3 && m) outer.push(m);
          if (!top && (i === 1 || i === 2)) inst(doors, XI - (a + b) / 2, ST[k] + 1.5, 0, b - a + 0.1, 3, 1.6);
        });
        if (top) {
          boxXZ(-1, -74.5, -73.5, y0, y1, -(IN + 16), IN + 16, PART);
          inst(doors, -74, ST[k] + 1.5, 0, 1.1, 3, 1.6);
        } else STRIPS.slice(0, 3).forEach(([a, b]) => inst(doors, XI - (a + b) / 2, ST[k + 1] - 0.25, 7, Math.min(1.2, b - a - 0.4), 0.6, 1.2));
        if (k < 2) boxXZ(-1, XWE, XI, ST[k + 1] - 0.5, ST[k + 1], -IN, IN);
      }
      boxXZ(-1, XWE, XI, ST[3] - 1, ST[3] - 0.25, -IN, IN);
      // the yatzi'im: three galleries outside the mesibah's wall (|z| 35; x -82.5 in the west), the lowest 5, the middle 6, the top 7
      const GW = [5, 6, 7], GX1 = 1.5, GO = 35, rail = M2.stoneLight || M2.marble;   // the east end: the wings' back face (x 1.5)
      for (const s of [-1, 1]) {
        const Zg = (a, b) => (s < 0 ? [-(GO + b), -(GO + a)] : [GO + a, GO + b]);
        boxXZ(s, XWE - GW[0], GX1, 16, 22, ...Zg(0, GW[0]));   // the plinth of the lowest gallery (as the otem, 6 over the court)
        for (let k = 0; k < 3; k++) {
          const w = GW[k], y = ST[k];
          if (k > 0) boxXZ(s, XWE - w, GX1, y - 1, y, ...Zg(0, w));         // the רובד: the slab of 6, of 7
          boxXZ(s, XWE - w, GX1, y, y + 1.2, ...Zg(w - 0.3, w), rail);       // the railing on its edge
        }
      }
      boxXZ(-1, XWE - GW[0], XWE, 16, 22, -GO, GO);                           // the west galleries (the north and south ones reach round the corners)
      for (let k = 0; k < 3; k++) {
        const w = GW[k], y = ST[k];
        if (k > 0) boxXZ(-1, XWE - w, XWE, y - 1, y, -GO, GO);
        boxXZ(-1, XWE - w, XWE - w + 0.3, y, y + 1.2, -(GO + w), GO + w, rail);
      }
    };
    const otemBlockRef = otemBlock;   // the common otem block - hidden for the readings whose lower storey stands in it
    const buildCells = (key) => {
      const R = CELLS_R[key], P = cellParts[key];
      if (P.built) return;
      P.built = true;
      const ST = R.st, hw = R.hw, cw = R.cw, ow = R.ow;
      const beams = [], beamsS = [], doors = [], doorsS = [], outer = [];
      const boxXZ = (s, x0, x1, y0, y1, z0, z1, mat) => {
        if (x1 - x0 < 0.01 || y1 - y0 < 0.01 || z1 - z0 < 0.01) return null;
        return H2.box(s > 0 ? P.south : P.grp, x1 - x0, y1 - y0, z1 - z0, mat || M2.marble, (x0 + x1) / 2, y0, (z0 + z1) / 2);
      };
      const PART = M2.stoneLight || M2.marble;   // the partitions in a warmer stone, so that a cell reads as a room in the section
      const inst = (list, cx, cy, cz, sx, sy, sz) => list.push(m4(cx, cy, cz, 0, 0, 0, sx, sy, sz));
      const yb = (k) => (k === 0 ? ST[0] : ST[k] - 1), yt = (k) => (k < 2 ? ST[k + 1] - 1 : ST[3]);
      rambamBody: {
      if (R.rambam) { rambamCells(P, boxXZ, inst, doors, doorsS, outer, PART); break rambamBody; }   // 1.9.1
      const A = (k) => 10 + hw[k], B = (k) => 10 + hw[k] + cw[k], O = (k) => B(k) + ow[k];
      const xW = (k) => -65.5 - hw[k];                                   // the line of the west wall's outer face
      const xOut = (k) => -65.5 - hw[k] - cw[k] - ow[k];                 // the west band's outer face (-82.5; rybm -81.5, -82.5, -83.5)
      const Lx = (k) => (R.len ? R.len[k] : 11.4), Lz = (k, n) => (R.len ? R.len[k] : n === 3 ? 44 / 3 - 2 : 20);
      for (const s of [-1, 1]) {
        const Z = (a, b) => (s < 0 ? [-b, -a] : [a, b]);
        const D = s > 0 ? doorsS : doors, BM = s > 0 ? beamsS : beams;
        for (let k = 0; k < 3; k++) {
          const y0 = yb(k), y1 = yt(k);
          boxXZ(s, xW(k), -4.5, y0, y1, ...Z(10, A(k)));                                       // the house's wall
          if (R.pil && k === 0) boxXZ(s, xW(0), -4.5, ST[0], ST[1] - 1, ...Z(A(0), A(0) + 1));   // RID: the wall of one amah
          if (R.shift && k < 2) {
            boxXZ(s, xOut(k), -4.5, y0, ST[k + 1] - 2, ...Z(B(k), O(k)));                       // the cell's outer wall
            boxXZ(s, xOut(k), -4.5, ST[k + 1] - 2, ST[k + 1] - 1, ...Z(B(k), B(k) + 6 + k));     // its top course, 6 and 7
          } else boxXZ(s, xOut(k), -4.5, y0, y1, ...Z(B(k), O(k)));
          // the partitions of the five cells (a door in each one between two cells) and the end pieces
          const L = Lx(k), cells = CELL_CX.map((c) => [c - L / 2, c + L / 2]);
          const pieces = [[cells[0][1], -4.5]];
          for (let i = 0; i < 4; i++) pieces.push([cells[i + 1][1], cells[i][0]]);
          pieces.push([xW(k), cells[4][0]]);
          pieces.forEach(([p0, p1], i) => {
            boxXZ(s, p0, p1, y0, y1, ...Z(A(k), B(k)), PART);
            if (i > 0 && i < 5) inst(D, (p0 + p1) / 2, ST[k] + 1.5, s * (A(k) + cw[k] / 2), p1 - p0 + 0.1, 3, 1.6);
          });
          if (k < 2) {
            const a1 = A(k + 1), b1 = B(k + 1), yS = ST[k + 1];
            for (const c of CELL_CX) inst(D, c, yS - 0.5, s * (a1 + cw[k + 1] / 2), 1.2, 1.04, 1.2);   // the door to the cell above
            boxXZ(s, xW(k + 1), -4.5, yS - 0.5, yS, ...Z(a1, Math.max(b1, B(k))));                      // the floor above
            if (R.along) {   // the beams from partition to partition (R. Yitzchak HaBachur)
              const L1 = Lx(k + 1);
              for (const c of CELL_CX) for (let zz = a1 + 0.5; zz < b1 - 0.2; zz += 1) inst(BM, c, yS - 0.75, s * zz, L1, 0.5, 0.5);
            } else {
              const za = R.pil && k === 0 ? A(0) : a1, zb = R.shift ? B(k) + 1 : Math.max(B(k), b1) + 0.5;
              for (const [x0, x1] of cells) for (let xx = x0 + 0.75; xx < x1 - 0.2; xx += 1.5) inst(BM, xx, yS - 0.75, s * (za + zb) / 2, 0.5, 0.5, zb - za);
            }
          }
        }
        boxXZ(s, xW(2), -4.5, ST[3] - 1, ST[3] - 0.25, ...Z(A(2), B(2)));   // the cells' roof (under the walk, 63.75)
      }
      // the west band: three, three and two cells between z -B and B (the corners are theirs)
      for (let k = 0; k < 3; k++) {
        const y0 = yb(k), y1 = yt(k), n = k < 2 ? 3 : 2, x0 = xW(k), x1 = x0 - cw[k], bz = B(k);
        boxXZ(-1, x0, -65.5, y0, y1, -10, 10);                                               // the house's west wall (the corners are the north / south walls')
        if (R.pil && k === 0) boxXZ(-1, x0 - 1, x0, ST[0], ST[1] - 1, -bz, bz);
        if (R.shift && k < 2) {
          outer.push(boxXZ(-1, xOut(k), x1, y0, ST[k + 1] - 2, -bz, bz));
          outer.push(boxXZ(-1, x1 - 6 - k, x1, ST[k + 1] - 2, ST[k + 1] - 1, -bz, bz));
        } else outer.push(boxXZ(-1, xOut(k), x1, y0, y1, -bz, bz));
        const L = Lz(k, n), cells = CELL_WZ[n].map((c) => [c - L / 2, c + L / 2]);
        const pieces = [[-bz, cells[0][0]]];
        for (let i = 0; i + 1 < n; i++) pieces.push([cells[i][1], cells[i + 1][0]]);
        pieces.push([cells[n - 1][1], bz]);
        pieces.forEach(([p0, p1], i) => {
          boxXZ(-1, x1, x0, y0, y1, p0, p1, PART);
          if (i > 0 && i < n) inst(doors, (x0 + x1) / 2, ST[k] + 1.5, (p0 + p1) / 2, 1.6, 3, p1 - p0 + 0.1);
        });
        if (k < 2) {
          const xa = xW(k + 1), xb = xa - cw[k + 1], yS = ST[k + 1], n1 = k + 1 < 2 ? 3 : 2, bz1 = B(k + 1);
          for (const c of CELL_WZ[n1]) inst(doors, (xa + xb) / 2, yS - 0.5, c, 1.2, 1.04, 1.2);
          boxXZ(-1, Math.min(xb, x1), xa, yS - 0.5, yS, -Math.max(bz, bz1), Math.max(bz, bz1));
          if (R.along) {
            const L1 = Lz(k + 1, n1);
            for (const c of CELL_WZ[n]) for (let xx = xb + 0.5; xx < xa - 0.2; xx += 1) inst(beams, xx, yS - 0.75, c, 0.5, 0.5, Math.min(L1, L + 1));
          } else {
            const xs = R.pil && k === 0 ? x0 : xa, xe = R.shift ? x1 - 1 : Math.min(x1, xb) - 0.5;
            for (const [z0, z1] of cells) for (let zz = z0 + 0.75; zz < z1 - 0.2; zz += 1.5) inst(beams, (xs + xe) / 2, yS - 0.75, zz, xs - xe, 0.5, 0.5);
          }
        }
      }
      boxXZ(-1, xW(2) - cw[2], xW(2), ST[3] - 1, ST[3] - 0.25, -B(2), B(2));
      // the Raavad: the lower storey stands in the otem - the common block gives way, these pieces stay (the house's inner otem, the strip
      // under the front wall, the rims under the mesibah and outside the west band)
      if (R.otem) {
        boxXZ(-1, -65.5, 1, 16, 22, -10, 10);
        for (const s of [-1, 1]) {
          H2.box(P.grp, 5.5, 6, 26, M2.marble, -1.75, 16, s * 23);                    // x -4.5..1, |z| 10..36
          H2.box(P.grp, 79, 6, 9, M2.marble, -44, 16, s * 31.5);                       // x -83.5..-4.5, |z| 27..36
        }
        boxXZ(-1, -83.5, -82.5, 16, 22, -27, 27);
      }
      }   // rambamBody
      const im = (parent, list, mat) => { if (list.length) instMesh(parent, unitBox, mat, list, false); };
      im(P.grp, beams, M2.cedar);
      im(P.south, beamsS, M2.cedar);
      im(P.grp, doors, dark);
      im(P.south, doorsS, dark);
      // the house's outer faces (Herod) and the cutaway: at the first build into the lists below; later straight into the live ones
      for (const m of outer) if (m) (ctx2.herodAdd ? ctx2.herodAdd(m) : outerWalls.push(m));
      if (Array.isArray(ctx2.cutaway) && ctx2.cutawayReady) { P.south.visible = ctx2.cutaway.length ? ctx2.cutaway[0].visible !== false : true; ctx2.cutaway.push(P.south); } else cutS.push(P.south);
    };
    ctx2.shared.cellsReading = {
      mode: "raavad", keys: Object.keys(CELLS_R), cutX: CUT_X,   // 1.9.3 (the user, 20:16): the Rambam as the Tosafot Yom Tov reads him (4:3) - the lowest storey opposite the otem, as the Raavad; his drawings ("rambam") are no longer in the table
      set(key) {
        if (!CELLS_R[key]) key = "raavad";
        buildCells(key);
        this.mode = key;
        for (const k of Object.keys(cellParts)) cellParts[k].grp.visible = k === key;
        if (otemBlockRef) otemBlockRef.visible = !CELLS_R[key].otem;
        nonRambam.visible = !CELLS_R[key].rambam;   // 1.9.1
        try { NEDOOR.ready(); } catch (_) {}
        try { LULHOLE.ready(); } catch (_) {}   // 1.9.3: and the lul behind the Kaporet   // 1.9.2: the door of the north-east cell is cut in the new reading's walls too
      }
    };
    buildCells("raavad");   // 1.9.3: the default reading (the others are built when first chosen)
    cellParts.raavad.grp.visible = true;
    nonRambam.visible = true;
    // ===== KELIM_211 (the user, 14.11.2026, of the place "לשכת הכלים": "מה הוא מציג?"; "אמורה להציג את מה שהיה בה"): until now the
    // place showed a label over the cells and the house cut across. Now: THE NINETY-THREE VESSELS - "נכנסו ללשכת הכלים, והוציאו משם
    // תשעים ושלשה כלי כסף וכלי זהב" (Tamid 3:4) - stand on three stepped shelves in ONE CELL, the middle one of the north side, in its
    // lowest storey (the Tiferet Yisrael, Yachin there: "לא ידעתי מקומה. ואפשר שהיתה באותן ל"ח לשכות שהיו סביב לכותלי ההיכל" - which
    // cell is a model choice), and the place's view looks down into that cell, the house cut by height just under the cell's beams
    // (ctx2.shared.section, axis "y"; no cut across the house, no parochet in the picture). The cell's floor and place follow the
    // cells' reading (CELLS_R: st, hw, cw; the Rambam's drawings: the middle strip of the five). MODEL CHOICES: the cell, the shelves,
    // the vessels' shapes (bowls, cups and pans, silver and gold in turn), their order. ctx2.shared.features.kelim (not timed);
    // ctx2.shared.kelimView() - the view, by the reading (the line of sight clears the top of the cell's inner wall).
    {
      const KG = new Group();
      KG.name = "kelimChamber";
      KG.visible = false;
      cellsG.add(KG);
      ctx2.layers.kelim = KG;
      const silverK = new MeshStandardMaterial({ color: 0xcfd3d8, metalness: 0.9, roughness: 0.28 });
      const prof = (pts) => new LatheGeometry(pts.map(([r, y]) => new Vector2(r, y)), 14);
      const SHAPES = [prof([[0, 0], [0.07, 0], [0.09, 0.03], [0.15, 0.11], [0.17, 0.16], [0.155, 0.16], [0.13, 0.11], [0, 0.04]]),            // a bowl
        prof([[0, 0], [0.06, 0], [0.05, 0.02], [0.02, 0.05], [0.02, 0.14], [0.07, 0.19], [0.09, 0.3], [0.075, 0.3], [0.05, 0.2], [0, 0.17]]),  // a cup on a stem
        prof([[0, 0], [0.16, 0], [0.18, 0.05], [0.165, 0.05], [0.15, 0.015], [0, 0.015]])];                                                       // a pan
      const N = 31, SH_Y = [1.0, 2.0, 3.0], SH_D = [1.1, 0.8, 0.5], LEN = 10.4, CX2 = CELL_CX[2];   // the lower a shelf, the deeper: every row shows from above
      const meshes = [];
      for (let sp = 0; sp < 3; sp++) for (let mt = 0; mt < 2; mt++) {
        const im = new InstancedMesh(SHAPES[sp], mt ? M2.gold : silverK, 93);
        im.count = 0;
        im.castShadow = true;
        im.frustumCulled = false;
        KG.add(im);
        meshes.push(im);
      }
      const m4k = new Matrix4();
      for (let r = 0; r < 3; r++) for (let i = 0; i < N; i++) {
        const k = r * N + i, im = meshes[(k % 3) * 2 + ((i + r) % 2)];
        m4k.makeTranslation(-LEN / 2 + 0.2 + i * (LEN - 0.4) / (N - 1), SH_Y[r] + 0.06, SH_D[r] - 0.25);
        im.setMatrixAt(im.count++, m4k);
      }
      for (const im of meshes) im.instanceMatrix.needsUpdate = true;
      SH_Y.forEach((y, r) => H2.box(KG, LEN, 0.06, SH_D[r], M2.cedar, 0, y, SH_D[r] / 2));
      for (const x of [-LEN / 2 + 0.04, -LEN / 6, LEN / 6, LEN / 2 - 0.04]) {   // the uprights: a stepped side under each shelf
        SH_Y.forEach((y, r) => H2.box(KG, 0.08, y - (r ? SH_Y[r - 1] : 0), SH_D[r], M2.cedar, x, r ? SH_Y[r - 1] : 0, SH_D[r] / 2));
      }
      // the cell by the reading: its floor, the height of the cut (just under the beams of the floor above) and its two long walls
      const geo = () => {
        const key = ctx2.shared.cellsReading.mode, R = CELLS_R[key] || CELLS_R.raavad;
        if (R.rambam) return { y0: 22, yCut: 34.96, zIn: -23, zOut: -26 };
        return { y0: R.st[0], yCut: R.st[1] - 1.04, zIn: -(10 + R.hw[0]), zOut: -(10 + R.hw[0] + R.cw[0]) };
      };
      const kLbl = { text: "תשעים ושלושה כלי כסף וכלי זהב (תמיד ג, ד)", x: CX2, y: 20.3, z: -21.6, size: 1.05, box: true, onTop: true, layer: "kelim" };
      ctx2.labels.push(kLbl);
      let lblSpr = null;
      const place = () => {
        const g = geo();
        KG.position.set(CX2, g.y0, g.zOut);   // against the cell's outer wall, the shelves towards the house
        if (!lblSpr) { try { const lg = ctx2.scene.getObjectByName("labels"); if (lg) lblSpr = lg.children.find((sp) => sp.userData.label === kLbl) || null; } catch (_) {} }
        if (lblSpr) lblSpr.position.set(CX2, g.y0 + 4.3, g.zOut + 0.25);
        return g;
      };
      let prevSec = null;
      ctx2.shared.kelimView = () => {
        // the eye stands over the cell's inner wall and looks down at the shelves: at 62 degrees, or steeper where the cell is deep
        // (the line from the bottom shelf's front must clear the top of the cell's inner wall), 15.5 amot from the shelves - the
        // rack fills the middle of the picture, and little of the cut wall shows under it
        const g = geo(), ty = g.y0 + 1.2, tz = g.zOut + 0.9;
        const need = Math.atan2(g.yCut + 0.3 - (g.y0 + 1), g.zIn - 0.1 - (g.zOut + SH_D[0]));
        const th = Math.max(62 * Math.PI / 180, need + 0.035), d = 15.5;
        return { cam: [CX2, ty + d * Math.sin(th), tz + d * Math.cos(th)], tg: [CX2, ty, tz] };
      };
      ctx2.shared.features = ctx2.shared.features || {};
      const apply = () => { const g = place(), S = ctx2.shared.section; if (S && typeof S.set === "function") S.set(true, "y", g.yCut); };
      ctx2.shared.features.kelim = { key: "kelim", timed: false, isOn: () => KG.visible,
        on: () => {
          const S = ctx2.shared.section;
          if (S && !prevSec) prevSec = { on: !!S.on, axis: S.axis, v: S.v };
          KG.visible = true;
          apply();
        },
        off: () => {
          KG.visible = false;
          const S = ctx2.shared.section;
          if (S && typeof S.set === "function" && prevSec) { S.set(prevSec.on, prevSec.axis, prevSec.v); prevSec = null; }
        } };
      // another reading of the cells chosen while the vessels show: they move to the new cell, and the cut with them
      const CR = ctx2.shared.cellsReading, set0 = CR.set;
      CR.set = function(key) { const r = set0.call(this, key); if (KG.visible) { try { apply(); } catch (_) {} } return r; };
    }
    // the common walls: the mesibah's (in the south: בית הורדת המים) outer wall, 30..35, from the house's floor (22) to the cells' roof,
    // and the walk's outer wall over it (64..72); the north ones go with the mesibah's pill
    for (const s of [-1, 1]) {
      const mw = wallBox(84, 42, 5, -40.5, 22, s * 32.5, s), mu = wallBox(84, 8, 5, -40.5, 64, s * 32.5, s);
      nonRambam.add(mw);   // 1.9.1: the Rambam's reading has its own double wall there
      outerWalls.push(mw, mu);
      if (s < 0) (ctx2.mesibahCut = ctx2.mesibahCut || []).push(mw, mu);
      wallBox(84, 43, 6, -40.5, 64, s * 13, s);                                  // the upper storey's wall over the house's wall (z 10..16)
      outerWalls.push(wallBox(84, 35, 19, -40.5, 72, s * 25.5, s));             // the mass above the walk (16..35, 72..107)
    }
    // the west: the upper storey's west wall, the walk's outer wall and the mass above it, the walk's floor (the cells' roof)
    H2.box(cellsG, 6, 43, 20, M2.marble, -68.5, 64, 0);
    outerWalls.push(H2.box(cellsG, 5, 8, 60, M2.marble, -80, 64, 0));            // x -82.5..-77.5, z -30..30 (was 42 long), 64..72
    outerWalls.push(H2.box(cellsG, 17, 35, 20, M2.marble, -74, 72, 0));          // the mass above (72..107)
    H2.box(cellsG, 6, 0.3, 60, M2.marble, -74.5, 63.75, 0);                      // the west walk's floor (z -30..30)
    for (const m of cutS) cut.push(m);
    ctx2.labels.push(
      { text: "התאים — שלושים ושמונה, בשלוש קומות", x: -40, y: 66.5, z: 36.5, size: 1.6 },
      { text: "בית הורדת המים", x: -20, y: 30, z: 28.5, size: 1.1 }
    );
    // the mesibah: the sloped passage in the north (z 26..29), from the north-east corner (y 22) to the cells' roof at the north-west (y 64)
    {
      // 1.5.0 (the user: "המסיבה תבדוק טוב ותאייר מחדש"): a STAIRCASE in the passage (z 26..29), 84 steps of half an amah (Middot 2:3 "כל
      // המעלות שהיו שם רום מעלה חצי אמה"), from the north-east corner (y 22) up to the cells' roof at the north-west (y 64) - and from there
      // the walk on the cells' roofs: "הגיע למערב והפך פניו לדרום, הלך על כל פני מערב עד שהוא מגיע לדרום; הגיע לדרום והפך פניו למזרח, היה
      // מהלך בדרום עד שהוא מגיע לפתחה של עליה" (4:5) - a paved path with a low parapet along the west and the south roofs to the door
      H2.stairs(nonRambam, { width: 3, totalRise: 42, steps: 84, dir: "W", x: -4.5, y: 22, z: -28.5, tread: 72 / 84 });   // 1.9.1: not in the Rambam's reading   // 1.9.0: z 27..30 (was 26..29)
      const pathMat = M2.marble.clone(); pathMat.color.multiplyScalar(0.92);
      H2.box(cellsG, 72, 0.3, 14, pathMat, -40.5, 63.75, -23);                        // the north walk's floor (the cells' roof, z 16..30; 1.9.0: was 16..29)
      cut.push(H2.box(cellsG, 72, 0.3, 14, pathMat, -40.5, 63.75, 23));               // the south walk's floor, to the aliyah's door (1.9.0: into the cutaway itself)
      ctx2.labels.push({ text: "על גגות התאים — למערב ולדרום, עד פתח העלייה", x: -74.5, y: 69, z: 0, size: 1.2 });
      // the mesibah's outer wall is its own list and pill (ctx2.mesibahCut) so the passage can be seen from the north
      ctx2.mesibahCut = ctx2.mesibahCut || [];
      // (1.9.0: the mesibah's outer wall and the walk's wall over it are pushed where they are built, with the cells)
      const MB = Array.isArray(ctx2.shared.modelButtons) ? ctx2.shared.modelButtons : (ctx2.shared.modelButtons = []);
      let on = false;
      MB.push({
        id: "hei-mesibah", label: "פתח את המסיבה", labelOn: "סגור את המסיבה", removal: true, maxDist: 260, layer: "nonRambamCells",
        title: "מסיר את הכותל החיצוני של המסיבה שבצפון הבית, כדי לראות את המעבר העולה מקרן מזרחית־צפונית אל גג התאים (מידות ד, ה). כלי צפייה בלבד.",
        anchor: () => (ctx2.camera && ctx2.camera.position.z < -20 ? [-40, 45, -35.5] : null),
        get: () => on,
        set: (v) => { on = !!v; for (const m of ctx2.mesibahCut) m.visible = !on; for (const m of ctx2.shellNorth || []) m.visible = !on; }   // 1.9.1: and the Rambam's north wall
      });
      ctx2.labels.push({ text: "המסיבה — עולה מקרן מזרחית צפונית", x: -40, y: 48, z: -30, size: 1.4, layer: "nonRambamCells" });
    }
    // 1.9.2 (the user: "המסיבה לא ברור מה יצא, אמנם רואים מלמעלה אבל אין לי מושג מה זה המסיבה"; "צריך להיות מוסבר במצגת — אולי ע״י
    // צבע צף"): THE MESIBAH IN A FLOATING COLOUR - the place lights it for 15 s (the feature mesibahGlow), drawn over the walls, the house
    // closed: the passage itself as a pale amber body - in the reading chosen in the cells' row: the Rambam's, the lowest cell of its strip
    // (z -30..-27, x -81.5..-5.5, 22..35); the others', the sloped way from the north-east corner up to the roofs at the north-west - and
    // moving chevrons along the Mishnah's way (Middot 4:5): "היה עולה במסבה ופניו למערב, הלך על כל פני הצפון עד שהוא מגיע למערב" - west
    // along the north; "הגיע למערב והפך פניו לדרום" - south along the west roofs; "הגיע לדרום והפך פניו למזרח... עד שהוא מגיע לפתחה של
    // עליה" - east along the south roofs to the aliyah's door, which glows too (aliyahDoor). In the Rambam's reading the climb from his cell
    // to the roofs is a dotted line, without chevrons: he does not say how one went up. Colours, sizes and speed - model choices.
    {
      const mg = new Group();
      mg.visible = false;
      g.add(mg);
      const bodyM = new MeshBasicMaterial({ color: 0xffb21a, transparent: true, opacity: 0.28, depthTest: false, depthWrite: false });
      const edgeM = new LineBasicMaterial({ color: 0xff9a00, transparent: true, opacity: 0.95, depthTest: false });
      const addBody = (parent, w, h, d, x, y, z, rz) => {
        const geo = new BoxGeometry(w, h, d);
        const m = new Mesh(geo, bodyM);
        m.position.set(x, y, z);
        if (rz) m.rotation.z = rz;
        m.renderOrder = 14;
        m.userData.noPick = true;
        parent.add(m);
        const e = new LineSegments(new EdgesGeometry(geo), edgeM);
        e.position.copy(m.position);
        e.rotation.copy(m.rotation);
        e.renderOrder = 15;
        e.userData.noPick = true;
        parent.add(e);
      };
      const rbG = new Group(), stG = new Group();
      mg.add(rbG, stG);
      addBody(rbG, 76, 13, 3, -43.5, 28.5, -28.5);                                         // the Rambam's: the lowest cell of the strip
      addBody(stG, Math.hypot(72, 42), 4, 3, -40.5, 45.3, -28.5, -Math.atan2(42, 72));      // the others': the sloped way, 4 over the steps
      ctx2.layers.mesibahGlow = mg;
      ctx2.layers.mesibahGlowRB = rbG;
      ctx2.layers.mesibahGlowST = stG;
      ctx2.labels.push(
        { text: "המסבה", x: -43.5, y: 37.5, z: -31, size: 2.2, layers: ["mesibahGlow", "mesibahGlowRB"], onTop: true, box: true },
        { text: "המסבה", x: -40.5, y: 51, z: -31, size: 2.2, layers: ["mesibahGlow", "mesibahGlowST"], onTop: true, box: true }
      );
      // the dotted climb of the Rambam's reading, at the strip's west end
      const dash = new Line(new BufferGeometry().setFromPoints([new Vector3(-80, 23.6, -28.5), new Vector3(-80, 64.6, -28.5)]),
        new LineDashedMaterial({ color: 0xff9a00, dashSize: 1.3, gapSize: 1.0, transparent: true, opacity: 0.95, depthTest: false }));
      dash.computeLineDistances();
      dash.renderOrder = 15;
      dash.userData.noPick = true;
      rbG.add(dash);
      // the ways of the chevrons: [points, the reading's group]
      const R1 = 64.6, R2 = 65.5;
      const WAYS_M = [
        { grp: rbG, pts: [[-6.5, 23.6, -28.5], [-80, 23.6, -28.5]] },                                                   // in his cell, westward
        { grp: rbG, pts: [[-80, R1, -28.5], [-80, R1, 28.5], [-30, R1, 28.5], [-30, 66.6, 33.6]] },                     // on the roofs
        { grp: stG, pts: [[-5.5, 24, -28.5], [-76.5, R2, -28.5], [-79.5, R2, -28.5], [-79.5, R2, 28.5], [-30, R2, 28.5], [-30, 67.2, 33.6]] }
      ];
      const chevM = new MeshBasicMaterial({ color: 0xff5a1f, transparent: true, opacity: 0.95, depthTest: false, depthWrite: false });
      const chevG = new ConeGeometry(0.5, 1.3, 3);
      const SPACING = 5, SPEED = 5;   // amot between chevrons; amot a second
      const UPY = new Vector3(0, 1, 0), qv = new Quaternion(), mm = new Matrix4(), dv = new Vector3(), pv = new Vector3(), one = new Vector3(1, 1, 1);
      for (const W of WAYS_M) {
        W.seg = [];
        W.len = 0;
        for (let i = 0; i + 1 < W.pts.length; i++) {
          const a2 = new Vector3(...W.pts[i]), b2 = new Vector3(...W.pts[i + 1]), L = a2.distanceTo(b2);
          W.seg.push({ a: a2, d: b2.clone().sub(a2).normalize(), L, s0: W.len });
          W.len += L;
        }
        W.n = Math.max(1, Math.floor(W.len / SPACING));
        W.inst = new InstancedMesh(chevG, chevM, W.n);
        W.inst.renderOrder = 16;
        W.inst.frustumCulled = false;
        W.inst.userData.noPick = true;
        W.grp.add(W.inst);
      }
      const t0m = performance.now();
      ctx2.animated.push(() => {
        if (!mg.visible) return;
        const R = ctx2.shared.cellsReading, rb = !R || R.mode === "rambam";
        rbG.visible = rb;
        stG.visible = !rb;
        const off = ((performance.now() - t0m) / 1000) * SPEED;
        for (const W of WAYS_M) {
          if (!W.grp.visible) continue;
          for (let i = 0; i < W.n; i++) {
            const s2 = (i * (W.len / W.n) + off) % W.len;
            let sg = W.seg[0];
            for (const q of W.seg) if (s2 >= q.s0) sg = q;
            pv.copy(sg.a).addScaledVector(sg.d, s2 - sg.s0);
            qv.setFromUnitVectors(UPY, dv.copy(sg.d));
            mm.compose(pv, qv, one);
            W.inst.setMatrixAt(i, mm);
          }
          W.inst.instanceMatrix.needsUpdate = true;
        }
      });
      const doorOf = () => ctx2.layers.aliyahDoor;
      ctx2.shared.features = ctx2.shared.features || {};
      ctx2.shared.features.mesibahGlow = { key: "mesibahGlow", isOn: () => mg.visible,
        on: () => { mg.visible = true; const d = doorOf(); if (d) d.visible = true; },
        off: () => { mg.visible = false; const d = doorOf(), ag = ctx2.layers.aliyahGlow; if (d) d.visible = !!(ag && ag.visible); } };
    }
    // 1.4.0 (the user: "הורודס כמתג"): Herod's building - Bava Batra 4a / Sukkah 51b (124, line 74; 108, lines 1317-1318): "במאי בנייה?
    // אמר רבה: באבני שישא ומרמרא. איכא דאמרי: באבני כוחלא, שישא ומרמרא. אפיק שפה ועייל שפה, כי היכי דנקביל סידא. סבר למשעייה
    // בדהבא, אמרו ליה רבנן: שבקיה, דהכי שפיר טפי, דמיחזי כי אידוותא דימא". Rashi (Bava Batra 4a): "שישא - שיש ירוק", "ומרמרא - שיש
    // לבן", "כוחלא - שיש צבוע כעין כחול", "אידוותא דימא - גלי הים"; (Sukkah 51b) "כגלי הים שהאבנים משונים במראיהן זו מזו והעינים
    // המסתכלות בהן שוטטות ונראות כאילו גלי הים הם נדים ונעים". From 1.4.0 to 1.9.4 the reading dressed THE HEICHAL'S WALLS in
    // courses of the three marbles.
    // 1.9.5 (a remark sent on to the user, 11.11.2026: "בבנין הורדוס השיש הצבוע לא הי' בקירות ההיכל... השיש כגלי הים הי' בריצפה";
    // the user: "להסיר את שיטת הקירות, ולהעביר לרצפה"): the walls keep their stone in every reading, and the reading lays the three
    // marbles in THE AZARAH'S FLOOR (the pieces of 30-courts.js, ctx2.herodFloor) - the Rambam, Beit HaBechirah 1:10 "ומרצפין את כל
    // העזרה באבנים יקרות" (337, line 12), Har HaMoriah there "כוונתו באבני שיש" (5474, line 25). That the coloured marble was in the
    // floor is told in the name of the book "חנוכת הבית" - not in the user's library, NOT VERIFIED; the card says so. The floor: slabs
    // of two amot in the three marbles, their rows waving like the sea (the slabs' size and the rows' wave - model choices).
    const herodFloorTex = (() => {
      const SZ = 1024, N = 12, T = SZ / N;   // the tile is 24 amot: 12 x 12 slabs of 2 amot
      const cv = document.createElement("canvas");
      cv.width = cv.height = SZ;
      const c = cv.getContext("2d");
      const MARBLE = [["#f1eee7", "#e2ddd0"], ["#a9c0a2", "#8ea886"], ["#9db4d0", "#839dbd"]];   // white, green, blue
      for (let i = 0; i < N; i++) {
        const wave = Math.round(1.6 * Math.sin((2 * Math.PI * i) / N));   // the rows wave across the tile (one wave a tile: it joins itself)
        for (let j = 0; j < N; j++) {
          const kind = (((j + wave) % 3) + 3) % 3, x = i * T, y = j * T;
          const [a, b2] = MARBLE[kind];
          const gr = c.createLinearGradient(x, y, x + T, y + T);
          gr.addColorStop(0, a); gr.addColorStop(0.35 + hash(i * 7.3 + j * 3.1) * 0.3, b2); gr.addColorStop(1, a);
          c.fillStyle = gr; c.fillRect(x, y, T, T);
          for (let v = 0; v < 5; v++) {   // the veins of the marble
            c.strokeStyle = kind === 0 ? "rgba(150,140,125,0.22)" : "rgba(255,255,255,0.26)";
            c.lineWidth = 1 + hash(v + i * 1.7 + j) * 1.4;
            c.beginPath();
            let px = x + hash(v * 3.3 + i + j * 2.9) * T, py = y + hash(v * 5.1 + j + i * 0.7) * T;
            c.moveTo(px, py);
            for (let k = 0; k < 4; k++) { px += (hash(k + v + i * 2.1) - 0.4) * 30; py += (hash(k * 2.2 + v + j) - 0.5) * 24; c.lineTo(Math.min(x + T, Math.max(x, px)), Math.min(y + T, Math.max(y, py))); }
            c.stroke();
          }
          c.fillStyle = "rgba(60,55,45,0.5)"; c.fillRect(x, y, T, 1.5); c.fillRect(x, y, 1.5, T);   // the joints
        }
      }
      const tx = new CanvasTexture(cv);
      tx.wrapS = tx.wrapT = RepeatWrapping; tx.anisotropy = 8; tx.colorSpace = SRGBColorSpace; tx.repeat.set(1 / 24, 1 / 24);
      return tx;
    })();
    const herodFloorMat = new MeshStandardMaterial({ map: herodFloorTex, roughness: 0.3, metalness: 0.03, envMapIntensity: 0.9 });
    const herodPairs = (ctx2.herodFloor || []).map((m) => [m, m.material]);
    ctx2.shared.herod = { on: false, get() { return this.on; }, set(on) { this.on = !!on; herodPairs.forEach(([m, b]) => { m.material = this.on ? herodFloorMat : b; }); } };
    ctx2.herodAdd = () => {};   // (1.9.5: the house's outer faces keep their stone - nothing joins the swap any more)
    // 1.9.5 (a remark sent on to the user, 11.11.2026: "בגג ההיכל המעקות לא חופפים"; the user: "מצוין"): ONE RING. Until 1.9.4 the
    // house's top was pieced together: the facade's wall rose to 115 as its own parapet, five amot thick, with a gold band of its own at
    // 99..102, while the other sides had the gold band at 110.5..112 and a thin parapet on it; the west parapet ended short of the north
    // and the south ones (an open slit at both corners), and the parapets of the ulam's ends stood beside the facade's end, off its
    // line. Now the facade's wall ends under the gold band like every other wall, the band runs round the facade too, and one parapet
    // stands on the band's edge all round the roof, its corners closed: three amot and the spikes over it (the Tanna Kamma), or four
    // amot (R. Yehuda) - Middot 4:6. A piece hides with what stands under it: the ulam's with the ulam's ceiling (ulamOpenCut), the
    // facade's with the front (ulamFrontCut), the south side's with the house's cutaway (cut). mkRing builds a ring at a height - the
    // roof's (112) and the one over the Abarbanel's twenty amot (132, below).
    const parTK = new Group(), parRY = new Group();
    g.add(parTK);
    g.add(parRY);
    parRY.visible = false;
    ctx2.layers = ctx2.layers || {};
    ctx2.layers.parapetTK = parTK;
    ctx2.layers.parapetYehuda = parRY;
    const mkRing = (parent, y0, h, spikes, lists) => {
      const gS = new Group(), gUN = new Group(), gUS = new Group(), gF = new Group();
      parent.add(gS); parent.add(gUN); gS.add(gUS); parent.add(gF);
      const segs = new Map();
      const piece = (grp, x0, x1, z0, z1) => {
        H2.box(grp, x1 - x0, h, Math.abs(z1 - z0), M2.marble, (x0 + x1) / 2, y0, (z0 + z1) / 2);
        if (!segs.has(grp)) segs.set(grp, []);
        return segs.get(grp);
      };
      // the west side, whole, with both its corners
      piece(parent, -83.85, -82.95, -36.35, 36.35).push({ x1: -83.4, z1: -35.9, x2: -83.4, z2: 35.9, y: y0 + h });
      for (const [sg, gB, gU] of [[-1, parent, gUN], [1, gS, gUS]]) {
        piece(gB, -82.95, 1.85, sg * 35.45, sg * 36.35).push({ x1: -81.4, z1: sg * 35.9, x2: 1.4, z2: sg * 35.9, y: y0 + h });       // the house's side, from the west parapet to the wing's return
        piece(gU, 0.95, 1.85, sg * 36.35, sg * 50.15).push({ x1: 1.4, z1: sg * 37.9, x2: 1.4, z2: sg * 48.6, y: y0 + h });             // the return over the wing's west face
        piece(gU, 0.95, 12.5, sg * 50.15, sg * 51.05).push({ x1: 1.4, z1: sg * 50.6, x2: 11.4, z2: sg * 50.6, y: y0 + h });            // the ulam's end
        piece(gF, 12.5, 17.65, sg * 50.15, sg * 51.05).push({ x1: 13.4, z1: sg * 50.6, x2: 17.4, z2: sg * 50.6, y: y0 + h });          // ... and its part over the facade's wall
      }
      piece(gF, 17.65, 18.55, -51.05, 51.05).push({ x1: 18.1, z1: -50.6, x2: 18.1, z2: 50.6, y: y0 + h });                             // the facade, whole, with both its corners
      if (spikes) {
        const sG = new ConeGeometry(0.12, 1, 6);
        sG.translate(0, 0.5, 0);
        for (const [grp, sl] of segs) instMesh(grp, sG, M2.gold, spikeMats(sl), false);
      }
      if (lists) {
        cut.push(gS);
        ctx2.ulamOpenCut.push(gUN, gUS);
        ulamFrontCut.push(gF);
      }
      return { gS, gUN, gUS, gF };
    };
    mkRing(parTK, 112, 3, true, true);    // maakeh 3 amot (112..115) and an amah of kalah orev over it
    mkRing(parRY, 112, 4, false, true);   // "לא היה כלה עורב עולה מן המדה, אלא ארבע אמות היה מעקה" (112..116), R. Yehuda
    // 1.4.0 (the user): "120 אמה" - the Abarbanel (I Kings 8:10, after Josephus): the house 120 high. An extra band of 20 amot over the
    // roof (115..135) with its own parapet, in ctx2.layers.height120 (off; the opinions table); the Mishnah's 100 (Middot 4:6) stays the default.
    const h120 = new Group();
    h120.visible = false;
    g.add(h120);
    ctx2.layers = ctx2.layers || {};
    ctx2.layers.height120 = h120;
    // 1.9.5: on the house's own plan (the house 70 wide, the ulam 100), from the roof's gold band up twenty amot, a gold band and a
    // ring of the parapet's reading over it (132..136 - the hundred and twenty with the parapet, as the Mishnah's hundred). Until 1.9.4
    // a block 100 x 70 stood on the old parapet's top (115) with parapets of its own to 138, the eastern one hanging over the wings.
    H2.box(h120, 84, 18.5, 70, M2.marble, -40.5, 112, 0);
    H2.box(h120, 16, 18.5, 100, M2.marble, 9.5, 112, 0);
    H2.box(h120, 84.78, 1.5, 73, M2.gold, -41.61, 130.5, 0);
    H2.box(h120, 17.9, 1.5, 102.4, M2.gold, 9.75, 130.5, 0);
    const h120TK = new Group(), h120RY = new Group();
    h120.add(h120TK); h120.add(h120RY);
    mkRing(h120TK, 132, 3, true, false);
    mkRing(h120RY, 132, 4, false, false);
    const applyTop = () => {
      const ry = ctx2.shared.parapet.mode === "yehuda", hi = h120.visible;
      parTK.visible = !ry && !hi; parRY.visible = ry && !hi;
      h120TK.visible = !ry; h120RY.visible = ry;
      if (ctx2.__shellPar) { ctx2.__shellPar.tk.visible = !ry; ctx2.__shellPar.ry.visible = ry; }
    };
    ctx2.shared.parapet = { mode: "tk", set(m) { this.mode = m === "yehuda" ? "yehuda" : "tk"; applyTop(); } };
    ctx2.shared.height120 = { get: () => h120.visible, set: (on) => { h120.visible = !!on; applyTop(); } };
    applyTop();
    ctx2.labels.push({ text: "תוספת עד 120 אמה — אברבנאל, יוסף בן מתתיהו", x: -32, y: 126, z: 36.5, size: 1.6, layer: "height120" });
    const goldCeil = H2.box(g, 61, 0.4, 20, M2.gold, -35, 62, 0);
    // 1.4.0: the ceiling layers of the house (62..67) = the floor of the upper storey; the storey itself (67..107) is hollow
    const innerFill = H2.box(g, 61, 4.6, 20, M2.marble, -35, 62.4, 0);
    cut.push(goldCeil, innerFill);
    {
      const dk = new MeshStandardMaterial({ color: 0x15110b, roughness: 1 });
      // the three lulin over the Holy of Holies (x -65.5..-45.5): 2 x 2 each (model choice), seen from the storey and from the devir
      for (const z of [-6, 0, 6]) {
        H2.box(g, 2, 0.06, 2, dk, -55.5, 67.0, z);
        H2.box(g, 2, 0.06, 2, dk, -55.5, 61.95, z);
      }
      // ראשי פספסין: a low row of posts across the storey, on the line of the parochet (x -45)
      const pg = new BoxGeometry(0.3, 1.2, 0.3);
      instMesh(g, pg, M2.cedar, [-8, -6, -4, -2, 0, 2, 4, 6, 8].map((z) => m4(-45, 67.6, z)), false);
      // the storey's door to the south (4:5) and the two cedar posts by it, by which one climbs to its roof
      H2.box(g, 3, 8, 0.3, dk, -30, 67, 35.1);
      H2.box(g, 0.5, 36, 0.5, M2.cedar, -32.5, 67, 35.8);
      H2.box(g, 0.5, 36, 0.5, M2.cedar, -27.5, 67, 35.8);
      // 1.9.1 (the user: "פתח העלייה לא ברור — שים צבע צף"): the doorway glows for 15 s (the feature aliyahDoor) - an amber plate in it
      // and a frame round it, drawn over the wall
      {
        const grp = new Group();
        grp.visible = false;
        const pm = new MeshBasicMaterial({ color: 0xffb21a, transparent: true, opacity: 0.5, depthWrite: false });
        const plate = new Mesh(new BoxGeometry(3, 8, 0.1), pm);
        plate.position.set(-30, 71, 35.4);
        plate.userData.noPick = true;
        grp.add(plate);
        const fm = new MeshBasicMaterial({ color: 0xff9a00 });
        for (const [w, h, x, y] of [[4, 0.45, -30, 75.25], [4, 0.45, -30, 66.75], [0.45, 8.9, -31.8, 71], [0.45, 8.9, -28.2, 71]]) {
          const b2 = new Mesh(new BoxGeometry(w, h, 0.22), fm);
          b2.position.set(x, y, 35.5);
          b2.userData.noPick = true;
          grp.add(b2);
        }
        g.add(grp);
        ctx2.layers.aliyahDoor = grp;
        ctx2.shared.features = ctx2.shared.features || {};
        ctx2.shared.features.aliyahDoor = { key: "aliyahDoor", isOn: () => grp.visible, on: () => { grp.visible = true; }, off: () => { grp.visible = false; } };
      }
      // 1.9.2 (the user: "העלייה ברירת מחדל תצוגה מהצד"; "ממש לא! בית סגור והצגת העליה מבחוץ עם הלולין"): THE UPPER STOREY SEEN FROM
      // OUTSIDE, the house closed - its room (over the heichal and the Holy of Holies, x -65.5..-4.5, 67..107) as a pale amber body drawn
      // over the walls, its edges, the three lulin in its floor (Middot 4:5 "ולולין היו פתוחין בעליה לבית קדש הקדשים") as bright squares,
      // and its doorway's glow (aliyahDoor) - the feature aliyahGlow (the place's 15 s; the card's switch "העלייה — מבט")
      {
        const ag = new Group();
        ag.visible = false;
        const bodyM = new MeshBasicMaterial({ color: 0xffb21a, transparent: true, opacity: 0.22, depthTest: false, depthWrite: false });
        const body = new Mesh(new BoxGeometry(61, 40, 20), bodyM);
        body.position.set(-35, 87, 0);
        body.renderOrder = 14;
        body.userData.noPick = true;
        ag.add(body);
        const edges = new LineSegments(new EdgesGeometry(new BoxGeometry(61, 40, 20)), new LineBasicMaterial({ color: 0xff9a00, transparent: true, opacity: 0.9, depthTest: false }));
        edges.position.copy(body.position);
        edges.renderOrder = 15;
        ag.add(edges);
        const lm = new MeshBasicMaterial({ color: 0xff3b1f, transparent: true, opacity: 0.95, depthTest: false, depthWrite: false });
        for (const z of [-6, 0, 6]) {
          const q = new Mesh(new BoxGeometry(2.2, 0.3, 2.2), lm);
          q.position.set(-55.5, 67.2, z);
          q.renderOrder = 16;
          q.userData.noPick = true;
          ag.add(q);
        }
        g.add(ag);
        ctx2.layers.aliyahGlow = ag;
        ctx2.labels.push(
          { text: "העלייה — מעל ההיכל וקודש הקדשים, גובהה ארבעים אמה", x: -35, y: 101, z: 11, size: 2, layer: "aliyahGlow", onTop: true, box: true },
          { text: "הלולין — פתוחים בעלייה לבית קודש הקדשים", x: -55.5, y: 71.5, z: 11, size: 1.6, layer: "aliyahGlow", onTop: true, box: true }
        );
        const door = ctx2.layers.aliyahDoor;
        ctx2.shared.features.aliyahGlow = { key: "aliyahGlow", isOn: () => ag.visible,
          on: () => { ag.visible = true; if (door) door.visible = true; },
          off: () => { ag.visible = false; if (door) door.visible = false; } };
      }
      ctx2.labels.push(
        { text: "העלייה — ארבעים אמה", x: -35, y: 90, z: 0, size: 2 },
        { text: "לולין לבית קודש הקדשים", x: -55.5, y: 69, z: 0, size: 1.1 },
        { text: "ראשי פספסין — בין הקודש לקודש הקדשים", x: -45, y: 69.6, z: -9, size: 1 },
        { text: "פתח העלייה — פתוח לדרום, ושני כלונסות של ארז", x: -30, y: 76, z: 36.5, size: 1.2 }
      );
    }
    H2.box(g, 83, 3.5, 68, M2.marble, -40, 107, 0);   // ceiling layers of the upper storey (107..112; the top 1.5 is the gold band)
    H2.box(g, 84.78, 1.5, 73, M2.gold, -41.61, 110.5, 0);
    // 1.4.0 (the user): the parapet in two readings (Middot 4:6) - ctx2.shared.parapet: "tk" - three amot of maakeh and one amah of kalah
    // orev, the spikes (112..116); "yehuda" - "לא היה כלה עורב עולה מן המדה, אלא ארבע אמות היה מעקה": four amot, no spikes (112..116)
    // 1.4.0: the drawn storey lines and cells of 1.0.x are gone - the cells are built above

    // 1.3.0 (the user: "תעשה כמו בבית ראשון"): the windows are splayed reveals - 3 x 2.5 outside narrowing to 1 x 1 inside, 4 deep, with a
    // dark inner square - at Yossi's places (two rows, y 70 and 95, eight per side; a model choice - Middot gives the house no windows,
    // the ulam's "העטרות שבחלונות" are 3:8). Before 1.3.0: flat dark slabs.
    const winG = hei_splayGeo(3, 2.5, 1, 1, 4);
    const winMat = M2.stoneLight.clone();
    winMat.side = DoubleSide;
    const backG = new PlaneGeometry(1, 1);
    const backMat = new MeshStandardMaterial({ color: 1445897, roughness: 1, side: DoubleSide });
    const winN = [], winS = [], backN = [], backS = [];
    for (let x = -76; x <= -6 + 0.01; x += 10) {
      for (const yy of [70, 95]) {
        winN.push(m4(x, yy, -35.05, 0, Math.PI, 0));
        winS.push(m4(x, yy, 35.05, 0, 0, 0));
        backN.push(m4(x, yy, -35.05 + 3.9, 0, Math.PI, 0));
        backS.push(m4(x, yy, 35.05 - 3.9, 0, 0, 0));
      }
    }
    instMesh(g, winG, winMat, winN, false);
    instMesh(g, backG, backMat, backN, false);
    cut.push(instMesh(g, winG, winMat, winS, false), instMesh(g, backG, backMat, backS, false));
    H2.box(g, 6, 85, 1.1, M2.marble, -2, F, -35);
    H2.box(g, 60.3, 0.06, 18.6, M2.marble, -34.71, F + 0.01, 0);
    H2.box(g, 6.24, 0.06, 10.1, M2.marble, -1.42, F + 0.01, 0);
    H2.box(g, 10.68, 0.06, 54.8, M2.marble, 7.06, F + 0.01, 0);
    const FL = F + 0.08;
    // 1.9.3 (the user, of the kuntres, point 24: "חובה לשנות"): THE SLOPING FLOOR - a wedge of the floor's marble on the level floor, from
    // the heichal's door to the west wall of the Holy of Holies, rising HOUSE_SLOPE.rise (10-core.js; Rashi Menachot 99a "דבית המקדש היה
    // משופע ולצד מערב מגביה יותר"). The vessels (45-vessels.js), the parochot and the rock below stand on it by houseRise(x).
    {
      const zh = 9.38, L = HOUSE_SLOPE.x0 - HOUSE_SLOPE.x1;
      const sh = new Shape();
      sh.moveTo(0, 0); sh.lineTo(-L, 0); sh.lineTo(-L, HOUSE_SLOPE.rise); sh.closePath();
      const wg = new ExtrudeGeometry(sh, { depth: 2 * zh, bevelEnabled: false });
      wg.translate(HOUSE_SLOPE.x0, FL - 0.01, -zh);
      const wedge = new Mesh(wg, M2.marble);
      wedge.name = "houseSlope";
      wedge.receiveShadow = true;
      g.add(wedge);
    }
    // 1.9.3 (the user, of the kuntres, point 7: "תעשה כולל כרטיס"): THE SLAB OF THE SOTAH'S DUST - Mishnah Sotah 2:2 "נכנס להיכל ופנה
    // לימינו, ומקום היה שם אמה על אמה, וטבלא של שיש, וטבעת היתה קבועה בה. וכשהוא מגביהה, נוטל עפר מתחתיה" (67, line 13); Rashi Sotah 15b
    // "לאחזה בטבעתה ולהגביהה מבין הרצפה שהיא כולה באבני שיש" (2172, line 851). To the right of him who enters = the north; drawn as
    // the keys' slab of Beit HaMoked (a marble tablet of an amah, a ring). The exact spot - a model choice.
    {
      const sx = -8.6, sz = -7.4, sy = FL + houseRise(sx);
      H2.box(g, 1.12, 0.03, 1.12, new MeshBasicMaterial({ color: 0x15110b }), sx, sy, sz);
      H2.box(g, 1, 0.08, 1, M2.marble, sx, sy, sz);
      H2.ring(g, 0.18, 0.04, M2.bronze, sx, sy + 0.12, sz);
      ctx2.labels.push({ text: "טבלא של שיש וטבעת — עפר הסוטה", x: sx, y: sy + 1.7, z: sz, size: 0.9 });
    }
    // 1.4.0: the gold liners of the room are the CARVED gold (Yoma 54a "כרובים דצורתא"; I Kings 6:29 - cherubim, palms, open flowers), the
    // First Temple plugin's canvas carving (45-vessels.js int_carvedMat); plain gold if that fails
    let lineMat = M2.gold;
    try { lineMat = int_carvedMat(5, 10); ctx2.labels.push({ text: "כרובים דצורתא — פיתוחי הקירות (יומא נד.)", x: -25, y: 50, z: -9.3, size: 1.3 }); } catch (e) { console.warn("[heichal] carvings skipped:", e && e.message); }
    H2.box(g, 61, 40, 0.6, lineMat, -35, F, -9.68);
    const lineS = H2.box(g, 61, 40, 0.6, lineMat, -35, F, 9.68);
    H2.box(g, 0.6, 40, 18.76, lineMat, -65.18, F, 0);
    cut.push(lineS);
    const gateWall = H2.wall(g, {   // 1.9.1: kept - R. Yehuda's way (below) puts a passage in its north jamb while it is shown
      axis: "z",
      length: 20,
      height: 85,
      thickness: 6,
      mat: M2.gold,
      occlude: false,
      cx: -1.5,
      cz: 0,
      y: F,
      openings: [{ center: 0, width: 10, height: 20 }]
    });
    // 1.9.1 (the user: "תוסיף הדגמה לפתיחת הדלתות לשתי השיטות"; "תוסיף רעש של פתיחת דלת כבדה ופתיחה ע״י מפתח מזהב (פותות - רק רש״י)"):
    // ===== 1.9.2 (the user, on the two demonstrations: "בהדגמת הפשפש אני רוצה שההדגמה ממש תכניס אותי לתוך הפשפש ולא מלמעלה עם מעקב";
    // "הדגמת הדלת - לא רואים את ב' הדלתות, ההדגמה לא מספיק חיה"; "ההדגמה מציגה בכל פעם רק את א' מן השיטות"): THE WALK - the camera at a
    // man's eye (3.2 amot over the floor) along keys [t (s), eye, look], smooth through them (Catmull-Rom; a key repeated is a pause), led in
    // from wherever the camera is (1.4 s), with the Mishnah's words under the picture for each stage and events at set moments. A press on
    // the model (a drag) ends the walk where it is; the doors finish by themselves. ctx2.shared.walk = { run(keys, caps, onEnd, events),
    // stop(), on, LEAD }. The speed and the eye's height - model choices.
    // 1.9.2 (the user: "כל ההדגמות יותר איטיות"): every demonstration runs at SLOW of its written timing - the walk, the doors, the
    // captions and the sounds alike (all of them are written in "demo seconds"; the clocks below divide the real time by SLOW)
    const SLOW = ctx2.shared.demoSlow || (ctx2.shared.demoSlow = 1.5);
    const DEMO_STOPS = ctx2.shared.demoStops || (ctx2.shared.demoStops = []);   // 90-entry.js stopDemos: any switch stops these first
    const DW = (() => {
      const LEAD = 1.4;
      let S = null, capEl = null;
      // 1.9.2: CENTRIPETAL Catmull-Rom (alpha 0.5) - the uniform one overshot at the corners and on long legs (the mesibah's walk went out
      // through its wall: the far start of the lead-in pulled the first leg's tangent); the lead-in itself (from wherever the camera was to
      // the first key) is a plain eased line, and the far start is not a neighbour of the legs after it
      const crc = (P0, P1, P2, P3, u) => {
        const d = (A, B) => Math.max(1e-4, Math.sqrt(Math.hypot(B[0] - A[0], B[1] - A[1], B[2] - A[2])));
        const t1 = d(P0, P1), t2 = t1 + d(P1, P2), t3 = t2 + d(P2, P3), t = t1 + u * (t2 - t1);
        const L = (A, B, ta, tb) => A.map((v, q) => ((tb - t) * v + (t - ta) * B[q]) / (tb - ta));
        const A1 = L(P0, P1, 0, t1), A2 = L(P1, P2, t1, t2), A3 = L(P2, P3, t2, t3);
        const B1 = L(A1, A2, 0, t2), B2 = L(A2, A3, t1, t3);
        return L(B1, B2, t1, t2);
      };
      const at = (keys, t, k) => {
        const n = keys.length;
        if (t <= keys[0][0]) return keys[0][k];
        if (t >= keys[n - 1][0]) return keys[n - 1][k];
        let i = 0;
        while (i < n - 2 && t > keys[i + 1][0]) i++;
        const u = (t - keys[i][0]) / Math.max(1e-6, keys[i + 1][0] - keys[i][0]);
        if (i === 0) { const e = u * u * (3 - 2 * u), a = keys[0][k], b = keys[1][k]; return [0, 1, 2].map((q) => a[q] + (b[q] - a[q]) * e); }
        const P = (j) => keys[Math.max(1, Math.min(n - 1, j))][k];
        return crc(P(i - 1), P(i), P(i + 1), P(i + 2), u);
      };
      // WALK_SOFT_204 (the user, 12.11.2026 02:14: "המצלמה במסיבה כשהיא פונה שמאלה/ימינה זווית המעבר יותר חלקה ולא ריצה מוזרה של
      // המצלמה ... בעיה זו קיימת גם בפשפשים"): until 2.0.3 the look POINT went by a curve from key to key - at a corner it swept from far
      // ahead to far aside within a second, and the eye spun. A walk run with { soft: true } turns BY ANGLE: the heading and the tilt
      // at each key are those of its look point; between the keys they go evenly, smoothed over TURN_W seconds to each side (a turn
      // begins a little before its corner and ends a little after it); and no leg turns faster than TURN_MAX degrees a second - a leg
      // that would is given more time, and the keys, the captions and the events after it move with it (W.now(): the walk's WRITTEN
      // second, for a demonstration that keeps its own clock). { from, count }: only the legs from the written second `from` on, among
      // the first `count` keys, are so stretched; after the key `count` the look goes by its points again and the times stay as
      // written (the great gate's views, which follow the wicket's walk in one run)
      const TURN_W = 0.7, TURN_MAX = 40;
      const softPlan = (keys, from, cnt) => {
        const n = keys.length, yaw = [], pit = [], ts = [keys[0][0]];
        for (let i = 0; i < n; i++) {
          const e = keys[i][1], l = keys[i][2], dx = l[0] - e[0], dy = l[1] - e[1], dz = l[2] - e[2];
          let y = Math.atan2(dx, dz);
          if (i) { while (y - yaw[i - 1] > Math.PI) y -= 2 * Math.PI; while (y - yaw[i - 1] < -Math.PI) y += 2 * Math.PI; }
          yaw.push(y);
          pit.push(Math.atan2(dy, Math.hypot(dx, dz)));
          if (i) {
            const dt = keys[i][0] - keys[i - 1][0], need = Math.abs(yaw[i] - yaw[i - 1]) * 180 / Math.PI / TURN_MAX;
            ts.push(ts[i - 1] + (i > 1 && i <= cnt && dt > 0 && keys[i - 1][0] >= from - 1e-6 ? Math.max(dt, need) : dt));
          }
        }
        return { src: keys.map((k) => k[0]), ts, yaw, pit, tu: 1e9 };
      };
      const pw = (xs, ys, x) => {   // the broken line through (xs, ys) at x; beyond its ends it goes on one for one
        const n = xs.length;
        if (x <= xs[0]) return ys[0] + (x - xs[0]);
        if (x >= xs[n - 1]) return ys[n - 1] + (x - xs[n - 1]);
        let i = 0;
        while (i < n - 2 && x > xs[i + 1]) i++;
        return ys[i] + (x - xs[i]) / Math.max(1e-6, xs[i + 1] - xs[i]) * (ys[i + 1] - ys[i]);
      };
      const lin = (xs, ys, x) => (x <= xs[0] ? ys[0] : x >= xs[xs.length - 1] ? ys[ys.length - 1] : pw(xs, ys, x));
      const softLook = (P, t, e, d) => {   // (d: the written look point's distance - the controls' pivot stays where it was written)
        let y = 0, p = 0;
        for (let k = -4; k <= 4; k++) { const w = 1 - Math.abs(k) / 5, tt = t + k * TURN_W / 4; y += w * lin(P.ts, P.yaw, tt); p += w * lin(P.ts, P.pit, tt); }
        y /= 5;
        p /= 5;
        const c = Math.cos(p);
        return [e[0] + Math.sin(y) * c * d, e[1] + Math.sin(p) * d, e[2] + Math.cos(y) * c * d];
      };
      const caption = (text) => {
        if (!capEl) {
          capEl = document.createElement("div");
          capEl.id = "tm-walk-cap";
          capEl.setAttribute("dir", "rtl");
          Object.assign(capEl.style, { position: "fixed", left: "50%", bottom: "64px", transform: "translateX(-50%)", maxWidth: "min(760px, 74vw)",
            background: "rgba(14,17,28,0.8)", color: "#f4ead0", font: "17px/1.55 var(--font-main, inherit)", padding: "8px 18px",
            borderRadius: "10px", zIndex: "40", pointerEvents: "none", textAlign: "center", userSelect: "none", boxShadow: "0 2px 10px rgba(0,0,0,0.35)" });
          document.body.appendChild(capEl);
        }
        if (capEl.textContent !== (text || "")) capEl.textContent = text || "";
        capEl.style.display = text ? "block" : "none";
      };
      // 1.9.2: a walk sees with a wider eye (66 degrees instead of 48 - the doorway is narrow), and gives the old one back at its end
      let fov0 = 0;
      const setFov = (v) => { const cam = ctx2.camera; if (cam && cam.isPerspectiveCamera && Math.abs(cam.fov - v) > 0.01) { cam.fov = v; cam.updateProjectionMatrix(); } };
      const stop = () => {
        if (!S) return;
        const s2 = S;
        S = null;
        if (fov0) { setFov(fov0); fov0 = 0; }
        caption("");
        if (s2.onEnd) { try { s2.onEnd(); } catch (_) {} }
      };
      ctx2.animated.push(() => {
        if (!S) return;
        if (S.pausedAt != null) return;   // DEMO_PAUSE_207: paused - the clock stands, the eye is the viewer's
        const cam = ctx2.camera, c = ctx2.controls;
        if (!cam) return;
        const t = (performance.now() - S.t0) / 1000 / SLOW;
        const e = at(S.keys, t, 1);
        let l = at(S.keys, t, 2);
        if (S.soft) {   // WALK_SOFT_204
          const w = Math.max(0, Math.min(1, (S.soft.tu - t) / TURN_W));
          if (w > 0) { const sl = softLook(S.soft, t, e, Math.max(0.5, Math.hypot(l[0] - e[0], l[1] - e[1], l[2] - e[2]))); l = [0, 1, 2].map((q) => l[q] + (sl[q] - l[q]) * w); }
        }
        if (S.blend) {   // DEMO_PAUSE_207: after a pause, from where the viewer left the eye back to the walk's, in 0.9 s
          const w0 = Math.min(1, (performance.now() - S.blend.at) / 900), w = w0 * w0 * (3 - 2 * w0), P0 = S.blend.pos, T0 = S.blend.tg;
          for (let q = 0; q < 3; q++) { e[q] = P0[q] + (e[q] - P0[q]) * w; l[q] = T0[q] + (l[q] - T0[q]) * w; }
          if (w0 >= 1) S.blend = null;
        }
        cam.position.set(e[0], e[1], e[2]);
        if (c && c.target) c.target.set(l[0], l[1], l[2]);
        cam.lookAt(l[0], l[1], l[2]);
        let cap = "";
        for (const [ct, txt] of S.caps) if (t >= ct) cap = txt;
        caption(cap);
        while (S.events.length && t >= S.events[0][0]) { const ev = S.events.shift(); try { ev[1](); } catch (_) {} if (!S) return; }
        if (t >= S.keys[S.keys.length - 1][0] + 0.4) stop();
      });
      // DEMO_PAUSE_207: a press on the model pauses the walk (90-entry.js) - until 2.0.7 it ended it
      const pauseW = () => { if (S && S.pausedAt == null) S.pausedAt = performance.now(); };
      const resumeW = () => {
        if (!S || S.pausedAt == null) return;
        S.t0 += performance.now() - S.pausedAt;
        S.pausedAt = null;
        const cam = ctx2.camera, c = ctx2.controls;
        if (cam && c && c.target) S.blend = { pos: cam.position.toArray(), tg: c.target.toArray(), at: performance.now() };
      };
      const W = {
        LEAD,
        run(keys, caps, onEnd, events, opt) {
          stop();
          const cam = ctx2.camera, c = ctx2.controls;
          const k0 = [0, cam ? cam.position.toArray() : keys[0][1], c && c.target ? c.target.toArray() : keys[0][2]];
          if (cam && cam.isPerspectiveCamera) { fov0 = cam.fov; setFov(66); }
          let K = [k0].concat(keys.map(([t, eye, look]) => [t + LEAD, eye, look])), wp = (t) => t, soft = null;
          if (opt && opt.soft) {   // WALK_SOFT_204
            const cnt = opt.count === undefined ? K.length - 1 : Math.min(K.length - 1, opt.count);   // (K has the lead-in's key before the walk's)
            soft = softPlan(K, (opt.from || 0) + LEAD, cnt);
            wp = (t) => pw(soft.src, soft.ts, t);
            if (cnt < K.length - 1) soft.tu = soft.ts[cnt];
            K = K.map((k, i) => [soft.ts[i], k[1], k[2]]);
          }
          S = { t0: performance.now(), onEnd, soft, keys: K,
            caps: (caps || []).map(([t, txt]) => [wp(t + LEAD), txt]),
            events: (events || []).map(([t, fn]) => [wp(t + LEAD), fn]).sort((a, b) => a[0] - b[0]) };
        },
        // the walk's written second now, from its own start (after the lead-in)
        now() { if (!S) return -1; const t = ((S.pausedAt != null ? S.pausedAt : performance.now()) - S.t0) / 1000 / SLOW; return (S.soft ? pw(S.soft.ts, S.soft.src, t) : t) - LEAD; },   // DEMO_PAUSE_207: stands while paused
        stop,
        get on() { return !!S; }
      };
      ctx2.shared.walk = W;
      DEMO_STOPS.push({ id: "walk", running: () => !!S, stop, pause: pauseW, resume: resumeW, paused: () => !!(S && S.pausedAt != null) });
      return W;
    })();
    // ===== KOHEN_ACTOR_211 (the user, 15.11.2026, of the walk from the wicket to the great gate: a whole priest, not a hand): ONE PRIEST
    // WHO WALKS AND USES HIS HANDS - the lotteries' priest (55-payis.js, his parts in ctx2.shared.priestKit) on the morning service's
    // skeleton (55-tamid.js makeFigKit: two arms - shoulder, elbow, grip - and the feet), built when a demonstration first needs him.
    // KOH.pose(o) each frame: o.x, o.y, o.z - where he stands; o.yaw - his facing (without it: the way he moves); his step goes by the
    // distance moved (the arms swing, the feet, a little rise and fall); o.base - "rest" | "hold" (the right arm bent, something in the
    // hand); o.armR / o.armL = { p: [x, y, z] (a point of the world for the palm), w: 0..1, pole: [x, y, z] (his own frame: where the
    // elbow leans) } - the arm reaches there (two bones; a far point stretches the arm toward it); o.key = { dir: [x, y, z], turn } |
    // true - the key in his right hand (life-size; `dir` - the way it points); o.xray - the right arm and the key are drawn over the
    // stone (inside a wall). KOH.hide(). Model choices: his look (as the lotteries' priests), the key's form and size.
    const KOH = (() => {
      let A = null, bad = false;
      const KEYL = 0.36;
      const DN = new Vector3(0, -1, 0), XV = new Vector3(1, 0, 0), tS = new Vector3(), tD = new Vector3(), tP = new Vector3(), tU = new Vector3(), tE = new Vector3(), tF = new Vector3(), tW = new Vector3();
      const qS = new Quaternion(), qE = new Quaternion(), qI = new Quaternion();
      const BASE = { rest: [0.05, 0.08, -0.15], hold: [-0.55, 0.05, -1.0] };
      const DEF_POLE = { 1: [0.35, -1, -0.5], "-1": [-0.35, -1, -0.5] };
      const build = () => {
        const K = ctx2.shared.priestKit;
        if (!K || bad) { bad = true; return null; }
        try {
          const FS = K.FS, sc = (q) => q.scale(FS, FS, FS), W1 = (q) => K.white(q);
          const up = K.UP * FS, fo = K.FORE * FS, sx = K.SH_X * FS, sy = K.SH_Y * FS;
          const gUp = sc(mergeGeometries([W1(K.sph(0.07, 0.07, 0.07, 14, 10)), W1(K.at(new CylinderGeometry(0.07, 0.058, up / FS, 14), 0, -up / FS / 2, 0)), W1(K.at(K.sph(0.058, 0.058, 0.058, 12, 8), 0, -up / FS, 0))]));
          const gFo = sc(W1(K.at(new CylinderGeometry(0.056, 0.046, fo / FS, 14), 0, -fo / FS / 2, 0)));
          const gHand = (side) => sc(K.at(K.handRaw(side), 0, -(fo / FS + 0.045), 0));
          const gFoot = (side) => sc(K.footGeo(side).translate(-side * 0.1, 0, 0));
          const g0 = new Group(), lean = new Group(), S = new Group();
          g0.name = "kohen-actor";
          g0.visible = false;
          g0.add(lean);
          S.scale.setScalar(FS);
          lean.add(S);
          const body = new Mesh(K.gRobeBody, K.mRobe);
          body.castShadow = true;
          S.add(body);
          S.add(new Mesh(K.at(new CylinderGeometry(0.066, 0.072, 0.09, 12), 0, 1.925, 0), K.mSkin));   // the neck
          const sash = new Mesh(K.gSash, K.mSashDyed);   // KOH_CARRY_211: white in the reading "של בוץ", and for the High Priest on Yom Kippur (o.white)
          S.add(sash);
          K.headOn(S, K.HEAD_Y, K.mBeards[1 % K.mBeards.length], 1);
          const hat = new Mesh(K.gHat, K.mHat);
          hat.position.y = K.HAT_Y;
          S.add(hat);
          const mRobeX = K.mRobe.clone(), mSkinX = K.mSkin.clone();   // the right arm's own materials (drawn over the stone inside a wall)
          mRobeX.transparent = mSkinX.transparent = true;
          const arm = (side, mR, mS) => {
            const sh = new Group();
            sh.position.set(side * sx, sy, 0);
            lean.add(sh);
            const m1 = new Mesh(gUp, mR);
            sh.add(m1);
            const el = new Group();
            el.position.y = -up;
            sh.add(el);
            const m2 = new Mesh(gFo, mR), m3 = new Mesh(gHand(side), mS);
            el.add(m2, m3);
            const grip = new Group();
            grip.position.set(0, -(fo + 0.08), 0.03);
            el.add(grip);
            for (const m of [m1, m2, m3]) m.castShadow = true;
            return { sh, el, grip, meshes: [m1, m2, m3], q0: new Quaternion(), e0: new Quaternion() };
          };
          const L = arm(1, K.mRobe, K.mSkin), R = arm(-1, mRobeX, mSkinX);
          const fl = new Mesh(gFoot(1), K.mSkin), fr = new Mesh(gFoot(-1), K.mSkin);
          fl.position.x = 0.1 * FS;
          fr.position.x = -0.1 * FS;
          g0.add(fl, fr);
          g0.traverse((o) => { if (o.isMesh) o.userData.noPick = true; });
          g.add(g0);
          const keyM = new MeshStandardMaterial({ color: 0xd9b24a, roughness: 0.3, metalness: 0.9, transparent: true });
          const key = new Group();
          key.visible = false;
          { const s1 = new Mesh(new CylinderGeometry(0.028, 0.028, KEYL, 8), keyM); s1.rotation.z = Math.PI / 2; s1.position.x = KEYL / 2; key.add(s1);
            const bit = new Mesh(new BoxGeometry(0.08, 0.13, 0.035), keyM); bit.position.set(KEYL - 0.05, -0.065, 0); key.add(bit);
            const bow = new Mesh(new TorusGeometry(0.075, 0.024, 8, 18), keyM); bow.position.x = -0.05; key.add(bow);
            for (const m of key.children) { m.castShadow = true; m.userData.noPick = true; } }
          g.add(key);
          A = { g0, lean, L, R, fl, fr, key, sash, K, white: false, props: null, mats: [mRobeX, mSkinX, keyM], P: { sx, sy, up, fo }, ph: 0, wk: 0, yaw: 0, yawT: null, last: null, xray: false };
        } catch (_) { bad = true; A = null; }
        return A;
      };
      const setBase = (arm, v, side) => { arm.sh.rotation.set(v[0], 0, side * v[1]); arm.el.rotation.set(v[2], 0, 0); };
      // two bones to a point given in his own frame; w - how far from the base pose toward it
      const reach = (a, arm, side, t, pole, w) => {
        if (!(w > 0.001)) return;
        const P = a.P, L1 = P.up, L2 = P.fo + 0.08;
        arm.q0.copy(arm.sh.quaternion);
        arm.e0.copy(arm.el.quaternion);
        tS.set(side * P.sx, P.sy, 0);
        tD.copy(t).sub(tS);
        const d = Math.min(L1 + L2 - 0.004, Math.max(Math.abs(L1 - L2) + 0.03, tD.length()));
        tD.normalize();
        const cA = Math.min(1, Math.max(-1, (L1 * L1 + d * d - L2 * L2) / (2 * L1 * d))), Aa = Math.acos(cA);
        const pl = pole || DEF_POLE[side];
        tP.set(pl[0], pl[1], pl[2]);
        tP.addScaledVector(tD, -tP.dot(tD));
        if (tP.lengthSq() < 1e-4) { tP.set(0, 0, -1); tP.addScaledVector(tD, -tP.dot(tD)); }
        tP.normalize();
        tU.copy(tD).multiplyScalar(Math.cos(Aa)).addScaledVector(tP, Math.sin(Aa));       // the upper arm
        tE.copy(tS).addScaledVector(tU, L1);                                             // the elbow
        tF.copy(tS).addScaledVector(tD, d).sub(tE).normalize();                          // the forearm
        qS.setFromUnitVectors(DN, tU);
        tF.applyQuaternion(qI.copy(qS).invert());
        qE.setFromUnitVectors(DN, tF);
        arm.sh.quaternion.copy(arm.q0).slerp(qS, Math.min(1, w));
        arm.el.quaternion.copy(arm.e0).slerp(qE, Math.min(1, w));
      };
      const toLocal = (a, p, out) => {   // a point of the world in his own frame
        const dx = p[0] - a.g0.position.x, dz = p[2] - a.g0.position.z, c = Math.cos(a.yaw), sn = Math.sin(a.yaw);
        return out.set(dx * c - dz * sn, p[1] - a.g0.position.y - a.lean.position.y, dx * sn + dz * c);
      };
      const pose = (o) => {
        const a = A || build();
        if (!a) return false;
        const now = performance.now(), first = !a.g0.visible || !a.last || now - a.last.t > 600;
        let moved = first ? 0 : Math.hypot(o.x - a.last.x, o.z - a.last.z);
        if (moved > 2.5) moved = 0;                                   // a jump (another scene) is no step
        a.ph += moved * 2.9;
        a.wk = first ? 0 : a.wk + ((moved > 0.002 ? 1 : 0) - a.wk) * 0.2;
        let yaw = o.yaw;
        if (yaw == null) yaw = moved > 0.004 ? Math.atan2(o.x - a.last.x, o.z - a.last.z) : a.yawT == null ? a.yaw : a.yawT;
        a.yawT = yaw;
        let dy = yaw - a.yaw;
        while (dy > Math.PI) dy -= 2 * Math.PI;
        while (dy < -Math.PI) dy += 2 * Math.PI;
        a.yaw = first || o.snap ? yaw : a.yaw + dy * 0.2;
        a.last = { x: o.x, z: o.z, t: now };
        const sw = Math.sin(a.ph), wk = a.wk;
        a.g0.visible = true;
        a.g0.position.set(o.x, o.y, o.z);
        a.g0.rotation.y = a.yaw;
        a.lean.position.y = Math.abs(Math.cos(a.ph)) * 0.035 * wk;
        a.fl.position.z = 0.17 * sw * wk;
        a.fr.position.z = -0.17 * sw * wk;
        const hold = o.base === "hold";
        const mix = (b, s2) => [b[0] + (-0.32 * s2 - b[0]) * wk, b[1] + (0.08 - b[1]) * wk, b[2] + (-0.25 - b[2]) * wk];
        const carry = o.base === "carry";   // KOH_CARRY_211: both arms bent, something in each hand (o.props = { r, l }: his own things, hung on the hands)
        setBase(a.R, hold || carry ? BASE.hold : mix(BASE.rest, sw), -1);
        setBase(a.L, carry ? BASE.hold : mix(BASE.rest, -sw), 1);
        { const wh = !!o.white || !!(ctx2.shared.payis && ctx2.shared.payis.avnet === "butz"); if (a.white !== wh) { a.white = wh; a.sash.material = wh ? a.K.mSashWhite : a.K.mSashDyed; } }
        { const pr = o.props || null; if (a.props !== pr) { if (a.props) { if (a.props.r) a.R.grip.remove(a.props.r); if (a.props.l) a.L.grip.remove(a.props.l); } a.props = pr; if (pr) { if (pr.r) a.R.grip.add(pr.r); if (pr.l) a.L.grip.add(pr.l); } } }
        if (o.armR) reach(a, a.R, -1, toLocal(a, o.armR.p, tW), o.armR.pole, o.armR.w == null ? 1 : o.armR.w);
        if (o.armL) reach(a, a.L, 1, toLocal(a, o.armL.p, tW), o.armL.pole, o.armL.w == null ? 1 : o.armL.w);
        const xr = !!o.xray;
        if (xr !== a.xray) {
          a.xray = xr;
          for (const m of a.mats) { m.depthTest = !xr; m.needsUpdate = true; }
          for (const m of a.R.meshes) m.renderOrder = xr ? 21 : 0;
          a.key.traverse((q) => { q.renderOrder = xr ? 22 : 0; });
        }
        a.key.visible = !!o.key;
        if (o.key) {
          a.g0.updateMatrixWorld(true);
          a.R.grip.getWorldPosition(a.key.position);
          if (o.key.dir) tD.set(o.key.dir[0], o.key.dir[1], o.key.dir[2]).normalize();
          else { a.R.el.getWorldPosition(tE); tD.copy(a.key.position).sub(tE).normalize(); }
          a.key.quaternion.setFromUnitVectors(XV, tD);
          if (o.key.turn) a.key.rotateX(o.key.turn);
        }
        return true;
      };
      return { pose, KEYL, hide() { if (A) { A.g0.visible = false; A.key.visible = false; A.last = null; } }, dims() { const a = A || build(); return a ? a.P : null; },
        get shown() { return !!(A && A.g0.visible); }, get actor() { return A; } };
    })();
    ctx2.shared.kohenActor = KOH;
    // 1.9.2 (the user: "תעשה גם הדגמה למסיבה"): THE MESIBAH, WALKED at a man's eye (DW), in the reading chosen in the cells' row, with
    // its floating colour lit all the way (mesibahGlow) - the Mishnah's way (Middot 4:5, book 89): "ומסבה היתה עולה מקרן מזרחית צפונית
    // לקרן צפונית מערבית, שבה היו עולים לגגות התאים. היה עולה במסבה ופניו למערב... הגיע למערב, והפך פניו לדרום... הגיע לדרום, והפך פניו
    // למזרח. היה מהלך בדרום, עד שהוא מגיע לפתחה של עליה, שפתחה של עליה פתוח לדרום". The readings with a staircase (z -30..-27, x -4.5..-76.5,
    // 22..64): up the steps westward, on the roofs south along the west and east along the south, to the aliyah's door (x -30, z 35, 67..75).
    // The Rambam's (the default): along his cell, the lowest of its strip, westward; at its west end the eye RISES in a flight to the roofs -
    // he does not say how one went up (the dotted line of the floating colour) - and walks on. A button on the model at the mesibah's foot,
    // and a place of the tree. The eye's height (3.2-3.4 over the floor or the step), the timing - model choices.
    {
      const Y0 = 22, ys = (x) => Y0 + ((-4.5 - x) / 72) * 42 + 3.4;   // the eye over the step at x
      const RW = 67.1;                                                  // the eye on the roofs (the walk's floor 63.9)
      const ROOF = [
        [17.0, [-79.5, RW, 26.5], [-79.5, RW - 0.6, 45]],
        [18.0, [-78.0, RW, 28.5], [-50, RW - 0.6, 28.5]],
        [23.5, [-34.0, RW, 28.5], [-20, RW - 0.1, 28.5]],
        [25.0, [-30.0, RW + 0.1, 30.5], [-30.0, 70.5, 36]],
        [27.0, [-30.0, RW + 0.1, 31.5], [-30.0, 70.5, 36]]
      ];
      const MW = {
        stairs: [
          [0.0, [-6.0, ys(-6.0), -28.5], [-20, ys(-20) + 0.6, -28.5]],
          [1.5, [-8.0, ys(-8.0), -28.5], [-22, ys(-22) + 0.6, -28.5]],
          [10.5, [-74.5, ys(-74.5), -28.5], [-90, ys(-74.5) + 1.5, -28.5]],
          [11.8, [-79.0, RW, -27.0], [-79.5, RW - 0.6, 0]],
          [13.2, [-79.4, RW, -17.0], [-79.5, RW - 0.6, 6]]
        ].concat(ROOF),
        rambam: [
          [0.0, [-6.5, Y0 + 3.2, -28.5], [-30, Y0 + 3.5, -28.5]],
          [9.0, [-77.5, Y0 + 3.2, -28.5], [-95, Y0 + 3.5, -28.5]],
          [10.2, [-79.5, Y0 + 4.0, -28.5], [-79.5, 50, -26.5]],
          [12.2, [-80.0, RW + 0.4, -28.0], [-79.5, RW - 0.6, 0]],
          [13.6, [-79.6, RW, -18.0], [-79.5, RW - 0.6, 6]]
        ].concat(ROOF)
      };
      const C0 = "״ומסבה היתה עולה מקרן מזרחית צפונית לקרן צפונית מערבית, שבה היו עולים לגגות התאים״ (מידות ד, ה)";
      const C1 = "״היה עולה במסבה ופניו למערב. הלך על כל פני הצפון, עד שהוא מגיע למערב״";
      const C2 = "״הגיע למערב, והפך פניו לדרום. הלך כל פני מערב עד שהוא מגיע לדרום״";
      const C3 = "״הגיע לדרום, והפך פניו למזרח. היה מהלך בדרום, עד שהוא מגיע לפתחה של עליה, שפתחה של עליה פתוח לדרום״";
      const MC = {
        stairs: [[0, C0], [2.5, C1], [11.6, C2], [17.6, C3]],
        rambam: [[0, C0], [2.5, C1], [9.6, "איך עלו מן המסבה לגגות — לא פירש"], [12.4, C2], [17.6, C3]]
      };
      let mOn = false;
      const glowF = () => (ctx2.shared.features || {}).mesibahGlow;
      const stopM = (fromWalk) => {
        if (!mOn) return;
        mOn = false;
        const F2 = glowF();
        if (F2) F2.off();
        if (!fromWalk) DW.stop();
      };
      ctx2.shared.mesibahDemo = () => {
        const R = ctx2.shared.cellsReading, rb = !R || R.mode === "rambam";
        const F2 = glowF();
        if (F2) F2.on();
        mOn = true;
        DW.run(rb ? MW.rambam : MW.stairs, rb ? MC.rambam : MC.stairs, () => stopM(true), null, { soft: true });   // WALK_SOFT_204
      };
      ctx2.shared.mesibahStop = () => stopM(false);
      DEMO_STOPS.push({ id: "hei-mesibah-demo", running: () => mOn, stop: () => stopM(false) });
      const MBm = Array.isArray(ctx2.shared.modelButtons) ? ctx2.shared.modelButtons : (ctx2.shared.modelButtons = []);
      MBm.push({
        id: "hei-mesibah-demo", label: "הדגמה: הליכה במסיבה", labelOn: "עצור את ההדגמה", maxDist: 150,   // 1.9.2: from the north of the house only, seen
        title: "הליכה בגובה העיניים בדרך שבמשנה (מידות ד, ה): במסבה למערב, על גגות התאים לדרום ולמזרח, עד פתח העלייה — בשיטה שנבחרה בתפריט, תחת ״שיטות ומחלוקות״.",
        anchor: () => {
          const p = ctx2.camera && ctx2.camera.position;
          return p && p.z < -36 && p.x > -150 && p.x < 70 ? [-8, 38, -37] : null;
        },
        get: () => mOn,
        set: (v) => { if (v) ctx2.shared.mesibahDemo(); else stopM(false); }
      });
    }
    // 1.9.2 (the user: "תעשה חור - אגב קבוע בקיר לכניסה"): THE DOOR OF THE NORTH-EAST CELL TO THE HEICHAL - "ובקרן מזרחית צפונית היו חמשה
    // פתחים, אחד לתא מן הימין, ואחד לתא שעל גביו, ואחד למסבה, ואחד לפשפש, ואחד להיכל" (Middot 4:3, book 89 line 30) - the Sages' way:
    // "נטל את המפתח ופתח את הפשפש, ונכנס להתא, ומהתא להיכל" (4:2). A real opening, 2.6 wide and 6 high, through the house's north wall 2 amot
    // from its front (x -7.8..-5.2), in every reading of the cells: a clipping box (six planes, clipIntersection) on the materials of the
    // pieces that cross it; while the live section is on, its plane takes the box's place. It is open in the Sages' way (the default) -
    // R. Yehuda's way has the passage in the front wall instead (pishTunnel). Its size and place - model choices.
    const NEDOOR = (() => {
      const B = { x0: -7.8, x1: -5.2, y0: F + 0.08, y1: F + 6, z0: -16.7, z1: -9.3 };
      const planes = [new Plane(new Vector3(-1, 0, 0), B.x0), new Plane(new Vector3(1, 0, 0), -B.x1), new Plane(new Vector3(0, -1, 0), B.y0),
        new Plane(new Vector3(0, 1, 0), -B.y1), new Plane(new Vector3(0, 0, -1), B.z0), new Plane(new Vector3(0, 0, 1), -B.z1)];
      const box = new Box3(new Vector3(B.x0, B.y0, B.z0), new Vector3(B.x1, B.y1, B.z1));
      let meshes = null, on = true, built = false;
      const find = () => {
        meshes = [];
        const bb = new Box3();
        g.updateMatrixWorld(true);
        g.traverse((o) => {
          if (!o.isMesh || !o.material || o.isSprite) return;
          try {
            if (o.isInstancedMesh) { o.computeBoundingBox(); bb.copy(o.boundingBox).applyMatrix4(o.matrixWorld); }
            else { if (!o.geometry.boundingBox) o.geometry.computeBoundingBox(); bb.copy(o.geometry.boundingBox).applyMatrix4(o.matrixWorld); }
            if (bb.intersectsBox(box)) meshes.push(o);
          } catch (_) {}
        });
      };
      ctx2.animated.push(() => {
        if (!built) return;
        const S = ctx2.shared.section;
        if (S && S.on) return;
        if (!meshes) find();
        for (const o of meshes) for (const m of Array.isArray(o.material) ? o.material : [o.material]) {
          if (!m || m.isShaderMaterial || m.isSpriteMaterial) continue;
          if (on) { if (m.clippingPlanes !== planes) { m.clippingPlanes = planes; m.clipIntersection = true; m.needsUpdate = true; } }
          else if (m.clippingPlanes === planes) { m.clippingPlanes = null; m.clipIntersection = false; m.needsUpdate = true; }
        }
        if (on && ctx2.renderer && !ctx2.renderer.localClippingEnabled) ctx2.renderer.localClippingEnabled = true;
      });
      return { set(v) { on = !!v; }, ready() { built = true; meshes = null; }, get on() { return on; } };
    })();
    // 1.9.3 (the user, of the kuntres, point 11: "שניהם כברירת מחדל"): THE LUL BEHIND THE KAPORET - Zevachim 55b "לול קטן היה אחורי בית
    // הכפורת, גבוה שמונה אמות; כדי להכשיר את העזרה לאכילת קדשי קדשים, ולשחיטת קדשים קלים" (130, line 1924); Rashi (2191, line 2702):
    // "כמין חלון פתוח מן התא שאחורי בית הכפרת לאויר העזרה"; the Rosh on Tamid 27a (2224, line 48): "לשכה אחת היתה במערב, והיה לול קטן
    // בכותל מערבי פתוח מן קדש הקדשים לאותה לשכה, והלשכה היתה פתוחה לעזרה כנגד הלול". Both by default: ONE box cut through the house's
    // western wall and the cell's outer wall - x -82.7..-65.3, two amot wide on the axis (a model choice), eight high, its sill one amah
    // above the Holy of Holies' floor at its west end (F + 4, the slope). NEDOOR's way, but on a CLONE of each mesh's material (a
    // material has one set of planes; the clone keeps the door's and the lul's apart, and follows a swap of the mesh's material).
    const LULHOLE = (() => {
      const B = { x0: -82.7, x1: -65.3, y0: F + 5, y1: F + 13, z0: -1, z1: 1 };
      const planes = [new Plane(new Vector3(-1, 0, 0), B.x0), new Plane(new Vector3(1, 0, 0), -B.x1), new Plane(new Vector3(0, -1, 0), B.y0),
        new Plane(new Vector3(0, 1, 0), -B.y1), new Plane(new Vector3(0, 0, -1), B.z0), new Plane(new Vector3(0, 0, 1), -B.z1)];
      const box = new Box3(new Vector3(B.x0, B.y0, B.z0), new Vector3(B.x1, B.y1, B.z1));
      const clones = new Map();
      let meshes = null, built = false;
      // the openings' reveals (the walls are hollow boxes): thin plates just outside the box, in the two walls' thickness
      for (const [xc, len] of [[-68.5, 6], [-80, 5]]) {
        for (const m of [H2.box(g, len, 8.04, 0.04, M2.marble, xc, B.y0 - 0.02, -1.03), H2.box(g, len, 8.04, 0.04, M2.marble, xc, B.y0 - 0.02, 1.03),
          H2.box(g, len, 0.04, 2.1, M2.marble, xc, B.y0 - 0.05, 0), H2.box(g, len, 0.04, 2.1, M2.marble, xc, B.y1 + 0.01, 0)]) m.userData.noHole = true;
      }
      ctx2.labels.push({ text: "לול קטן אחורי בית הכפורת — גבוה שמונה אמות (זבחים נה:)", x: -84.6, y: F + 14.6, z: 0, size: 1.2 });
      const find = () => {
        meshes = [];
        const bb = new Box3();
        g.updateMatrixWorld(true);
        g.traverse((o) => {
          if (!o.isMesh || !o.material || o.isSprite || o.userData.noHole || Array.isArray(o.material)) return;
          try {
            if (o.isInstancedMesh) { o.computeBoundingBox(); bb.copy(o.boundingBox).applyMatrix4(o.matrixWorld); }
            else { if (!o.geometry.boundingBox) o.geometry.computeBoundingBox(); bb.copy(o.geometry.boundingBox).applyMatrix4(o.matrixWorld); }
            if (bb.intersectsBox(box)) meshes.push(o);
          } catch (_) {}
        });
      };
      ctx2.animated.push(() => {
        if (!built) return;
        const S = ctx2.shared.section;
        if (S && S.on) return;
        if (!meshes) find();
        for (const o of meshes) {
          const m = o.material;
          if (!m || m.isShaderMaterial || m.isSpriteMaterial || (m.userData && m.userData.__lul)) continue;
          let c = clones.get(m);
          if (!c) { c = m.clone(); c.clippingPlanes = planes; c.clipIntersection = true; c.userData = Object.assign({}, m.userData, { __lul: true }); clones.set(m, c); }
          o.material = c;
        }
        for (const c of clones.values()) if (c.clippingPlanes !== planes) { c.clippingPlanes = planes; c.clipIntersection = true; c.needsUpdate = true; }   // after a section
        if (ctx2.renderer && !ctx2.renderer.localClippingEnabled) ctx2.renderer.localClippingEnabled = true;
      });
      return { ready() { built = true; meshes = null; } };
    })();
    // THE FOUR DOORS OF THE GREAT GATE (Middot 4:1, book 89 line 28): "וארבע דלתות היו לו, שתים בפנים ושתים בחוץ... החיצונות נפתחות לתוך
    // הפתח לכסות עביו של כתל, והפנימיות נפתחות לתוך הבית לכסות אחר הדלתות... רבי יהודה אומר, בתוך הפתח היו עומדות, וכמין אצטרמיטה היו,
    // ונקפלות לאחוריהן, אלו שתי אמות ומחצה, ואלו שתי אמות ומחצה, חצי אמה מזוזה מכאן, וחצי אמה מזוזה מכאן". The Rambam rules as the Tanna
    // Kamma (Beit HaBechirah 4:7, book 337 line 68) - "tk", the default; R. Yehuda's - "yehuda" - after the Bartenura (643, 174: "כל דלת היה
    // חמש אמות מחבר משתי לוחות, כל לוח שתי אמות ומחצה... ולסוף חצי אמה של עבי הכתל היו קבועות") and the Rambam's commentary (573, 47).
    // Until 1.9.0 four gold leaves stood half open in the doorway, with no reading. tk: the outer pair hinged 1 amah in from the outer face
    // (x 0.5), opening 90 degrees into the doorway, 5 of the wall's 6 amot covered; the inner pair on the inner face (x -4.5), opening 180
    // degrees into the house, flat on its wall. yehuda: each door two boards of 2.5 on hinges, fixed half an amah into the wall (x 1.0 and
    // -4.0); the outer door opens inward and folds back on itself, the inner outward, each covering 2.5 amot of the thickness.
    // ctx2.shared.greatGate = { mode, set(m), pose(t) - 0 shut .. 1 open, demo(), stop() }; the default open.
    // THE DEMONSTRATION (the place "פתיחת השער הגדול — הדגמה" and the row): Tamid 3:7 "הגיע לשער הגדול, העביר את הנגר ואת הפותחות
    // ופתחו" (88, 19; the Bartenura there, 634, 112: "הפותחות. המנעולים והמסגרות"); the key of gold - the user's, after Rashi on I Kings
    // 7:50 "והפתות. מפתחות, שמעתי. שמפתחין בהם את המנעול" (3673, 468): the doors shut, the key enters the lock and turns, the bar is lifted
    // out of its brackets, and the doors open slowly - for the Tanna Kamma the inner pair first (the priest comes from the heichal, Middot
    // 4:2) and then the outer; for R. Yehuda, standing between the two gates, the outer first and then the inner ("ופתח את החיצונות מבפנים
    // ואת הפנימיות מבחוץ") - with the sound of a heavy door made in the plugin (WebAudio, no file): "מיריחו היו שומעין קול שער הגדול
    // שנפתח" (Tamid 3:8). The house is cut along its axis (the live section, z > 0.2) for the 17 s, so that the doors are seen from the side,
    // inside the wall. The leaves' thickness, the lock's and bar's place and form, the timing - model choices.
    {
      const GT = 0.26, GH = 19.8, gold = M2.gold;
      const gateG = new Group();
      gateG.name = "great-gate";
      g.add(gateG);
      const tkG = new Group(), ryG = new Group();
      gateG.add(tkG, ryG);
      ryG.visible = false;
      // a hinge: a group at (x, F, z) for the side s (-1 north, +1 south); its leaf runs from the hinge toward the axis (local +z for the north,
      // -z for the south), off the pivot line by off along local x
      // 1.9.2: each leaf and board outlined in a dark line, so that gold reads against gold and a fold shows as two boards (model choice)
      const edgeMat = new LineBasicMaterial({ color: 0x3d2b0c, transparent: true, opacity: 0.8 });
      const leafBox = (parent, w, off, s) => {
        const b = H2.box(parent, GT, GH, w, gold, off, 0.1, -s * w / 2);
        b.userData.noPick = false;
        const ed = new LineSegments(new EdgesGeometry(b.geometry), edgeMat);
        ed.userData.noPick = true;
        b.add(ed);
        return b;
      };
      const hinge = (parent, x, z) => { const h = new Group(); h.position.set(x, F, z); parent.add(h); return h; };
      const pivots = (parent, x, z) => {
        H2.cyl(parent, 0.13, 0.13, 0.3, gold, x, F, z, 10);
        H2.cyl(parent, 0.13, 0.13, 0.3, gold, x, F + GH - 0.1, z, 10);
      };
      // the Tanna Kamma: [hinge, angle at open] for the outer and inner pairs
      const TK = { outer: [], inner: [] };
      let tkLockLeaf = null, ryLockLeaf = null;   // the leaves that carry the lock: the north inner (tk), the north outer's second board (yehuda)
      for (const s of [-1, 1]) {
        const ho = hinge(tkG, 0.5, s * 5); leafBox(ho, 5, 0.13, s); TK.outer.push([ho, s < 0 ? -Math.PI / 2 : Math.PI / 2]); pivots(tkG, 0.5, s * 5);
        const hi = hinge(tkG, -4.5, s * 5); const li = leafBox(hi, 5, 0.13, s); TK.inner.push([hi, s < 0 ? -Math.PI : Math.PI]); pivots(tkG, -4.5, s * 5);
        if (s < 0) tkLockLeaf = li;
      }
      // R. Yehuda: each door two boards; A on the jamb's hinge, B on A's free edge; [A, angleA, B, angleB, offB0, offB1, bLeaf]
      const RY = { outer: [], inner: [] };
      for (const [kind, x, offA, offB1] of [["outer", 1.0, 0.13, -0.37], ["inner", -4.0, -0.13, 0.37]]) {
        for (const s of [-1, 1]) {
          const a = hinge(ryG, x, s * 5);
          leafBox(a, 2.5, offA, s);
          const b = new Group();
          b.position.set(0, 0, -s * 2.5);
          a.add(b);
          const bLeaf = leafBox(b, 2.5, offA, s);
          // 1.9.2: the joint of the two boards - three gold knuckles on the fold line, so that the fold is seen as a hinge (model choice:
          // the Bartenura says "מחבר משתי לוחות", not how they were joined)
          for (const ky of [1.6, 9.9, 18.2]) H2.cyl(b, 0.12, 0.12, 0.8, gold, offA, ky, 0, 10);
          pivots(ryG, x, s * 5);
          const outer = kind === "outer";
          const angA = (outer ? s : -s) * Math.PI / 2;           // the outer door turns inward (west), the inner outward (east)
          RY[kind].push([a, angA, b, -2 * angA, offA, offB1, bLeaf]);   // the second board folds back on the first, on its doorway side
          if (outer && s < 0) ryLockLeaf = bLeaf;
        }
      }
      const ease = (u) => (u <= 0 ? 0 : u >= 1 ? 1 : 0.5 - 0.5 * Math.cos(Math.PI * u));
      const poseTK = (ti, to) => {
        for (const [h, a] of TK.inner) h.rotation.y = a * ease(ti);
        for (const [h, a] of TK.outer) h.rotation.y = a * ease(to);
      };
      const poseRY = (ti, to) => {
        for (const [key, t] of [["outer", to], ["inner", ti]]) for (const [a, angA, b, angB, offB0, offB1, bLeaf] of RY[key]) {
          const e = ease(t);
          a.rotation.y = angA * e;
          b.rotation.y = angB * e;
          bLeaf.position.x = offB0 + (offB1 - offB0) * e;   // the second board slides to lie against the first as it folds
        }
      };
      // the bar (נגר) and its brackets, and the key of gold
      const cedarBar = new MeshStandardMaterial({ color: 0x8a5a2b, roughness: 0.8, transparent: true, opacity: 1 });
      const bar = new Mesh(new BoxGeometry(0.4, 0.4, 11.4), cedarBar);
      bar.castShadow = true;
      bar.name = "great-gate-bar";
      gateG.add(bar);
      const brackets = { tk: new Group(), yehuda: new Group() };
      const BAR_Y = 3.3;
      for (const k of ["tk", "yehuda"]) { brackets[k].visible = false; gateG.add(brackets[k]); }
      for (const s of [-1, 1]) {
        // KOHEN_ACTOR_211: the bar at a man's reach, BAR_Y over the floor (until 2.0.1 it lay 8.4 up - no man could lift it out)
        H2.box(brackets.tk, 0.5, 0.12, 0.6, gold, -4.75, F + BAR_Y - 0.2, s * 5.6);   // on the inner face, beside the opening
        H2.box(brackets.tk, 0.12, 0.5, 0.6, gold, -5.0, F + BAR_Y - 0.2, s * 5.6);
        H2.box(brackets.yehuda, 0.6, 0.12, 0.25, gold, 0.75, F + BAR_Y - 0.2, s * 4.88);   // on the reveals, inside the doorway
      }
      const key = new Group();
      key.name = "great-gate-key";
      key.visible = false;
      key.scale.setScalar(2.2);   // larger than life, so that it is seen from the demonstration's camera (model choice)
      gateG.add(key);
      const keyMat = gold.clone();
      keyMat.transparent = true;
      { // the shaft along +x (into the lock), the bow at its back end, the bit at its tip
        const sh = new Mesh(new CylinderGeometry(0.05, 0.05, 0.9, 10), keyMat); sh.rotation.z = Math.PI / 2; sh.position.x = 0.45; key.add(sh);
        const bow = new Mesh(new TorusGeometry(0.2, 0.05, 8, 24), keyMat); bow.position.x = -0.2; key.add(bow);   // in one plane with the bit
        const bit = new Mesh(new BoxGeometry(0.16, 0.22, 0.06), keyMat); bit.position.set(0.82, -0.12, 0); key.add(bit);
        for (const m of key.children) m.castShadow = true;
      }
      // 1.9.2 (the user: "לא מספיק ברור איך היתה נדחפת היד כדי לפתוח"): the priest's hand holds the key by its bow and pushes it into the
      // lock - a fist and a white linen sleeve along the shaft's line, back toward the eye (the walk's camera stands an arm's length behind
      // it), turning with the key; it fades out with it. In the key's own (x2.2) frame. The form - a model choice
      const armMats = [new MeshStandardMaterial({ color: 0xc99d7c, roughness: 0.75, transparent: true }), new MeshStandardMaterial({ color: 0xf1ede2, roughness: 0.92, transparent: true })];
      {
        const fist = new Mesh(new SphereGeometry(0.13, 14, 10), armMats[0]); fist.scale.set(1.15, 0.95, 1.05); fist.position.set(-0.36, -0.01, 0); key.add(fist);
        const thumb = new Mesh(new CylinderGeometry(0.035, 0.04, 0.16, 8), armMats[0]); thumb.rotation.z = Math.PI / 2.6; thumb.position.set(-0.27, 0.09, 0.07); key.add(thumb);
        const wrist = new Mesh(new CylinderGeometry(0.075, 0.085, 0.22, 12), armMats[0]); wrist.rotation.z = Math.PI / 2; wrist.position.set(-0.55, 0, 0); key.add(wrist);
        const sleeve = new Mesh(new CylinderGeometry(0.115, 0.14, 1.3, 14), armMats[1]); sleeve.rotation.z = Math.PI / 2; sleeve.position.set(-1.3, -0.02, 0); key.add(sleeve);
        for (const m of [fist, thumb, wrist, sleeve]) { m.castShadow = true; m.userData.noPick = true; }
      }
      // the lock's plate on its leaf (so it turns with it), 2.2 above the floor, 0.45 from the doors' meeting line, on the west face;
      // a leaf box is centred at (off, 10, +-w/2) of its hinge: tk's north inner leaf - (0.13, 10, 2.5); yehuda's north second board - (0.13, 10, 1.25)
      const plate = (leaf, dz) => { const m = new Mesh(new BoxGeometry(0.05, 1.5, 1.0), gold); m.position.set(-0.15, F + 2.2 - F - 10, dz); m.visible = false; leaf.add(m); return m; };
      const plates = { tk: plate(tkLockLeaf, 1.8), yehuda: plate(ryLockLeaf, 0.55) };
      // where the lock and the bar are, per reading: the key comes from the west (x0 -> x1) at the north leaf's free edge
      const LOCK = { tk: { x0: -8.6, x1: -6.5, y: F + 2.2, z: -0.7 }, yehuda: { x0: -2.6, x1: -0.98, y: F + 2.2, z: -0.7 } };   // the key 2.2 long: its tip at the plate
      const BAR = { tk: { x: -4.75, y: F + BAR_Y, z: 0, dx: -1.6 }, yehuda: { x: 0.75, y: F + BAR_Y, z: 0, dx: -1.6 } };
      // the captions (layers greatGateCap0..3), over the doorway, in the north half (the section keeps it)
      const capG = [new Group(), new Group(), new Group(), new Group()];
      capG.forEach((c, i) => { c.visible = false; g.add(c); ctx2.layers["greatGateCap" + i] = c; });
      const modeG = { tk: new Group(), yehuda: new Group() };
      for (const k of ["tk", "yehuda"]) { modeG[k].visible = false; g.add(modeG[k]); ctx2.layers["greatGate_" + k] = modeG[k]; }
      const CAPS = {
        tk: ["״הגיע לשער הגדול, העביר את הנגר ואת הפותחות ופתחו״ (תמיד ג, ז)", "״והפנימיות נפתחות לתוך הבית לכסות אחר הדלתות״ (מידות ד, א)",
             "״החיצונות נפתחות לתוך הפתח לכסות עביו של כתל״ (מידות ד, א)", "״מיריחו היו שומעין קול שער הגדול שנפתח״ (תמיד ג, ח)"],
        yehuda: ["רבי יהודה: ״עד שנמצא עומד בין שני השערים, ופתח את החיצונות מבפנים״ (מידות ד, ב)", "״בתוך הפתח היו עומדות, וכמין אצטרמיטה היו, ונקפלות לאחוריהן״ (מידות ד, א)",
                 "״ואת הפנימיות מבחוץ״ — ״אלו שתי אמות ומחצה, ואלו שתי אמות ומחצה״ (מידות ד, א–ב)", "״מיריחו היו שומעין קול שער הגדול שנפתח״ (תמיד ג, ח)"]
      };
      for (const k of ["tk", "yehuda"]) CAPS[k].forEach((t, i) => ctx2.labels.push({ text: t, x: -3, y: F + 14.5, z: -2.5, size: 1.2, layers: ["greatGateCap" + i, "greatGate_" + k] }));   // in both cameras' frames
      ctx2.labels.push({ text: "השער הגדול — ארבע דלתות (מידות ד, א)", x: 3.4, y: F + 17.5, z: 0, size: 1.5 });
      // the demonstration's cameras (the house cut along its axis): tk - inside the heichal, from the south-west, at the inner doors' house
      // face, the key and the bar; yehuda - between the two gates, looking north into the doorway (model choices)
      const DEMO_CAM = { tk: { pos: [-16.5, F + 11, 14.5], target: [-2.5, F + 7.5, -2.5] }, yehuda: { pos: [-2, F + 15, 16.5], target: [-1.0, F + 7, -2.8] } };   // a little back: the whole height of the doors
      // 1.9.2 (the user: "לא רואים את ב' הדלתות... לא מספיק חיה"): the demonstration is walked (DW above), at a man's eye. The Tanna Kamma -
      // from inside the heichal (the priest comes from it, Middot 4:2): the key and the bar at the inner doors, a step back as they swing
      // into the house, into the doorway as the outer ones swing into it, a look north at the folded outer door and back west at the inner
      // ones lying on their wall. R. Yehuda - standing between the two gates: the key and the bar at the outer doors, they fold; a turn round
      // by the north to the inner doors, they fold; and in, into the heichal. Every key keeps the eye clear of the turning leaves.
      const YE = F + 3.2;
      // 1.9.2 (the user, of the walked demonstration: "רואים את שתי הדלתות אבל לא רואים את הקיפול עצמו"): from the doorway's middle
      // the hinges were 50 degrees aside, out of the frame, and the leaves 20 high fill any view inside the doorway - a fold is a figure in
      // the plan. So the key is seen from the side, the priest's hand pushing it into the lock; while a pair turns, the eye rises over the
      // doors' tops (inside the wall over the doorway - a solid box is not seen from inside it) and looks down at one door: R. Yehuda's - its
      // two boards fold into a V and lie on the reveal, the outer pair and then the inner; the Tanna Kamma's inner pair from over the
      // heichal's floor, the outer from over the doorway; then down to the eye again - R. Yehuda: a look at the north reveal, where the two
      // folded doors lie in the wall's thickness, 2.5 and 2.5 with half an amah of jamb at each end. The eye keeps clear of the turning leaves.
      const WALKK = {
        tk: [
          [0.0, [-15, YE, 1.0], [-4.5, F + 3.0, -0.3]],
          [1.2, [-8.2, YE - 0.2, 3.4], [-5.3, F + 2.2, -0.8]],     // KOHEN_ACTOR_211: the whole priest at the lock (until 2.0.1: a hand and a great key)
          [3.8, [-8.4, YE - 0.2, 3.4], [-5.3, F + 2.4, -0.8]],
          [4.8, [-11, F + 27, 7], [-5, F + 6, -2]],
          [8.4, [-11, F + 27, 6.6], [-5, F + 6, -2]],
          [9.4, [-2.2, F + 25, 2.6], [0.0, F + 8, -3.2]],
          [13.0, [-2.1, F + 25, 2.4], [0.0, F + 8, -3.2]],
          [14.6, [-2.4, YE, 0], [-2.4, F + 4.0, -6]],
          [16.0, [-2.6, YE, 0], [-12, F + 4.0, 0]],
          [17.6, [-2.6, YE, 0], [-14, F + 4.0, 0.5]]
        ],
        yehuda: [
          [0.0, [-3.4, YE, 1.0], [1.0, F + 3.0, -0.3]],
          [1.2, [-2.9, YE - 0.2, 3.1], [0.2, F + 2.2, -0.8]],      // KOHEN_ACTOR_211
          [3.8, [-3.0, YE - 0.2, 3.1], [0.1, F + 2.4, -0.8]],
          [4.8, [-2.4, F + 25, 2.2], [0.0, F + 8, -3.2]],
          [8.6, [-2.3, F + 25, 2.0], [0.0, F + 8, -3.2]],
          [9.4, [-0.8, F + 25, -2.2], [-3.0, F + 8, 3.2]],
          [13.0, [-0.9, F + 25, -2.0], [-3.0, F + 8, 3.2]],
          [14.8, [-1.5, YE + 0.6, 3.6], [-1.5, F + 4.0, -5.6]],
          [16.4, [-6.0, YE, 0.6], [-24, F + 4.5, 0]],
          [17.6, [-10.5, YE, 0], [-31, F + 4.5, 0]]
        ]
      };
      const WALKC = {
        tk: [[0, "״הגיע לשער הגדול, העביר את הנגר ואת הפותחות ופתחו״ (תמיד ג, ז)"], [4.2, "״והפנימיות נפתחות לתוך הבית לכסות אחר הדלתות״ (מידות ד, א)"],
             [9.0, "״החיצונות נפתחות לתוך הפתח לכסות עביו של כתל״ (מידות ד, א)"], [13.2, "״מיריחו היו שומעין קול שער הגדול שנפתח״ (תמיד ג, ח)"]],
        yehuda: [[0, "רבי יהודה: ״עד שנמצא עומד בין שני השערים, ופתח את החיצונות מבפנים״ (מידות ד, ב)"], [4.2, "״בתוך הפתח היו עומדות, וכמין אצטרמיטה היו, ונקפלות לאחוריהן״ (מידות ד, א)"],
                 [9.0, "״ואת הפנימיות מבחוץ״ (מידות ד, ב)"], [13.2, "״אלו שתי אמות ומחצה, ואלו שתי אמות ומחצה, חצי אמה מזוזה מכאן, וחצי אמה מזוזה מכאן״ (מידות ד, א)"],
                 [15.4, "״מיריחו היו שומעין קול שער הגדול שנפתח״ (תמיד ג, ח)"]]
      };
      // the sound, made here (no file): a click of the lock, the bar's scrape, the groan of a heavy door on its pivots, its rumble and thud.
      // window.AudioContext - the bundle's own AudioContext is three.js's wrapper class
      const SFX = (() => {
        let ac = null;
        const A = () => {
          if (ctx2.shared.soundOff) return null;   // SOUND_211: the settings' row "קולות בהדגמות"
          if (!ac) { const C = window.AudioContext || window.webkitAudioContext; if (!C) return null; try { ac = new C(); } catch (_) { return null; } }
          if (ac.state === "suspended") { try { ac.resume(); } catch (_) {} }
          return ac;
        };
        const noise = (a, sec) => { const b = a.createBuffer(1, Math.max(1, Math.floor(a.sampleRate * sec)), a.sampleRate), d = b.getChannelData(0); for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1; return b; };
        const env = (a, t, peak, att, dec) => { const g2 = a.createGain(); g2.gain.setValueAtTime(0.0001, t); g2.gain.exponentialRampToValueAtTime(peak, t + att); g2.gain.exponentialRampToValueAtTime(0.0001, t + att + dec); g2.connect(a.destination); return g2; };
        return {
          click(at) { const a = A(); if (!a) return; const t = a.currentTime + (at || 0);
            for (const [dt, f] of [[0, 3400], [0.08, 2300], [0.2, 1800]]) { const s2 = a.createBufferSource(); s2.buffer = noise(a, 0.06); const bp = a.createBiquadFilter(); bp.type = "bandpass"; bp.frequency.value = f; bp.Q.value = 9; s2.connect(bp); bp.connect(env(a, t + dt, 0.7, 0.003, 0.05)); s2.start(t + dt); } },
          scrape(at, dur) { const a = A(); if (!a) return; const t = a.currentTime + (at || 0); const s2 = a.createBufferSource(); s2.buffer = noise(a, dur + 0.1);
            const bp = a.createBiquadFilter(); bp.type = "bandpass"; bp.Q.value = 3; bp.frequency.setValueAtTime(350, t); bp.frequency.linearRampToValueAtTime(900, t + dur);
            const g2 = a.createGain(); g2.gain.setValueAtTime(0.0001, t); g2.gain.exponentialRampToValueAtTime(0.35, t + 0.08); g2.gain.setValueAtTime(0.35, t + dur - 0.15); g2.gain.exponentialRampToValueAtTime(0.0001, t + dur);
            s2.connect(bp); bp.connect(g2); g2.connect(a.destination); s2.start(t); s2.stop(t + dur + 0.1); },
          door(at, dur) { const a = A(); if (!a) return; const t = a.currentTime + (at || 0);
            // the groan: a sawtooth that wanders, through a resonant band
            const o = a.createOscillator(); o.type = "sawtooth"; o.frequency.setValueAtTime(62, t); o.frequency.linearRampToValueAtTime(88, t + dur * 0.6); o.frequency.linearRampToValueAtTime(70, t + dur);
            const lfo = a.createOscillator(); lfo.frequency.value = 6.5; const lg = a.createGain(); lg.gain.value = 9; lfo.connect(lg); lg.connect(o.frequency);
            const bp = a.createBiquadFilter(); bp.type = "bandpass"; bp.frequency.value = 420; bp.Q.value = 5;
            const g2 = a.createGain(); g2.gain.setValueAtTime(0.0001, t); g2.gain.exponentialRampToValueAtTime(0.22, t + 0.4); g2.gain.setValueAtTime(0.22, t + dur - 0.5); g2.gain.exponentialRampToValueAtTime(0.0001, t + dur);
            o.connect(bp); bp.connect(g2); g2.connect(a.destination); o.start(t); lfo.start(t); o.stop(t + dur + 0.05); lfo.stop(t + dur + 0.05);
            // the rumble of the heavy leaves
            const s2 = a.createBufferSource(); s2.buffer = noise(a, dur + 0.1); const lp = a.createBiquadFilter(); lp.type = "lowpass"; lp.frequency.value = 140;
            const g3 = a.createGain(); g3.gain.setValueAtTime(0.0001, t); g3.gain.exponentialRampToValueAtTime(0.5, t + 0.5); g3.gain.setValueAtTime(0.5, t + dur - 0.4); g3.gain.exponentialRampToValueAtTime(0.0001, t + dur);
            s2.connect(lp); lp.connect(g3); g3.connect(a.destination); s2.start(t); s2.stop(t + dur + 0.1);
            // the thud as it comes to rest
            const th = a.createOscillator(); th.type = "sine"; th.frequency.setValueAtTime(58, t + dur); th.frequency.exponentialRampToValueAtTime(32, t + dur + 0.35);
            th.connect(env(a, t + dur, 0.8, 0.01, 0.5)); th.start(t + dur); th.stop(t + dur + 0.6); },
          stop() { try { if (ac) ac.close(); } catch (_) {} ac = null; },
          suspend() { try { if (ac && ac.state === "running") ac.suspend(); } catch (_) {} },   // DEMO_PAUSE_207
          resume() { try { if (ac && ac.state === "suspended") ac.resume(); } catch (_) {} }
        };
      })();
      const G = ctx2.shared.greatGate = {
        mode: "tk", t0: -1, play: false,
        set(m) {
          this.mode = m === "yehuda" ? "yehuda" : "tk";
          tkG.visible = this.mode === "tk";
          ryG.visible = this.mode === "yehuda";
          if (this.t0 < 0) this.pose(1);
          return this.mode;
        },
        pose(t) { poseTK(t, t); poseRY(t, t); },   // both readings, so that a switch keeps the state
        prep(cut) {   // the demonstration's set: the reading's brackets and lock, the doors shut; `cut` (a still frame for the tour): the captions over the doorway and the house cut along its axis
          const k = this.mode;
          brackets.tk.visible = k === "tk"; brackets.yehuda.visible = k === "yehuda";
          plates.tk.visible = k === "tk"; plates.yehuda.visible = k === "yehuda";
          for (const kk of ["tk", "yehuda"]) modeG[kk].visible = !!cut && kk === k;
          this.pose(0);
          bar.scale.z = k === "yehuda" ? 10.2 / 11.4 : 1;   // inside the doorway it rests on ledges at the reveals, between them
          bar.visible = true;
          bar.position.set(BAR[k].x, BAR[k].y, BAR[k].z);
          cedarBar.opacity = 1;
          const S = ctx2.shared.section;
          if (cut && S && typeof S.set === "function" && !(S.on && S.axis === "z" && S.v === 0.2)) { S.set(true, "z", 0.2); if (ctx2.shared.sectionPaint) ctx2.shared.sectionPaint(); this.cut = true; }
          else if (!cut && S && S.on && typeof S.set === "function") { S.set(false); if (ctx2.shared.sectionPaint) ctx2.shared.sectionPaint(); }
        },
        walkKeys: (k) => WALKK[k === "yehuda" ? "yehuda" : "tk"],
        walkCaps: (k) => WALKC[k === "yehuda" ? "yehuda" : "tk"],
        // 1.9.2 (the user: "ההדגמה מציגה בכל פעם רק את א' מן השיטות ורק במעבר למתג השיטה השניה מוצגת ההדגמה הרלוונטית לו (כמו בכסא
        // שלמה)"): the reading now chosen only; a chip of the row chooses and runs. `walk` false: the doors alone (the pishpesh's walk leads in)
        demo(m, walk) {
          if (m) this.set(m);
          this.prep(false);
          // 1.9.2 (the user: "רואים את שתי הדלתות אבל לא רואים את הקיפול עצמו"): the doors wait for the eye - the walk begins with a
          // lead-in flight (DW.LEAD) from wherever the camera was, so the demonstration's clock starts after it (until now the doors moved
          // 1.4 s before the eye came to them); `walk` false (the pishpesh's walk calls it at the right moment): at once
          const lead = walk !== false ? DW.LEAD * SLOW : 0;
          if (walk !== false) DW.run(WALKK[this.mode], WALKC[this.mode]);
          this.t0 = performance.now() + lead * 1000;
          this.play = true;
          // the sound, scheduled from the click (a user gesture): the key, the bar, then the two pairs
          SFX.click(lead + 2.35 * SLOW); SFX.scrape(lead + 2.95 * SLOW, 1.0 * SLOW);
          SFX.door(lead + 4.2 * SLOW, 4.5 * SLOW); SFX.door(lead + 9.0 * SLOW, 4.0 * SLOW);
        },
        sfx: SFX,
        // 1.9.1 (the user: "אין הדגמה של שתי השיטות בפתיחת הדלת... הייתי מעדיף הדגמה של שתי הדלתות כשהם סגורות ונפתחות"): both readings, one
        // after the other - each from the four doors shut until they are open (the Tanna Kamma, then R. Yehuda), the camera at each one's
        // place; the reading that was chosen comes back at the end. The place, and the button on the model, run it; a chip runs its own reading
        demoBoth() { this.demo(null, true); },   // (1.9.1's name, kept for the places and the tour: the chosen reading now)
        at(e, m) { if (m) this.set(m); this.t0 = -1; this.play = false; this.prep(true); apply(e); },   // a still frame of the demonstration (checks, the tour)
        stop() {
          this.pausedAt = null;   // DEMO_PAUSE_207
          KOH.hide();             // KOHEN_ACTOR_211
          SFX.stop();   // SFX_STOP_205 (the user, 12.11.2026: "אחרי הדגמה של הפשפש שלא הסתיימה (עצרתי בכח) הקול של הדלתות נשאר אפי' אם אני במקום אחר"): the sounds are timed ahead when a demonstration starts - a stop silences those not yet heard too
          this.seq = null;
          this.t0 = -1; this.play = false;
          key.visible = false; bar.visible = false;
          brackets.tk.visible = brackets.yehuda.visible = false;
          plates.tk.visible = plates.yehuda.visible = false;
          capG.forEach((c) => (c.visible = false));
          for (const kk of ["tk", "yehuda"]) modeG[kk].visible = false;
          this.pose(1);
          const S = ctx2.shared.section;
          if (this.cut && S && S.on && S.axis === "z" && S.v === 0.2) { S.set(false, "z", 0.2); if (ctx2.shared.sectionPaint) ctx2.shared.sectionPaint(); }
          this.cut = false;
        }
      };
      bar.visible = false;
      (ctx2.shared.soundStops || (ctx2.shared.soundStops = [])).push(() => SFX.stop());   // SOUND_211
      G.set("tk");
      DEMO_STOPS.push({ id: "hei-gate-demo", running: () => G.t0 >= 0, stop: () => { DW.stop(); G.stop(); },
        // DEMO_PAUSE_207: the clock stands; the doors' sound waits with it (its context suspended - the scheduled sounds keep their seconds)
        pause: () => { if (G.t0 >= 0 && G.pausedAt == null) { G.pausedAt = performance.now(); SFX.suspend(); } },
        resume: () => { if (G.pausedAt != null) { G.t0 += performance.now() - G.pausedAt; G.pausedAt = null; SFX.resume(); } },
        paused: () => G.pausedAt != null });
      function apply(e) {
        const k = G.mode, L = LOCK[k], B = BAR[k];
        const clamp = (u) => Math.min(1, Math.max(0, u));
        // the key: in (1.5-2.3 s), turns (2.3-2.9), out and gone (2.9-3.6)
        const kohOn = !!KOH.dims();   // KOHEN_ACTOR_211: the whole priest does it - the great key and its hand are not drawn
        key.visible = !kohOn && e >= 1.2 && e < 3.6;
        const kin = ease(clamp((e - 1.5) / 0.8)), kout = ease(clamp((e - 2.95) / 0.6));
        key.position.set(L.x0 + (L.x1 - L.x0) * (kin - kout), L.y, L.z);
        key.rotation.x = (Math.PI / 2) * ease(clamp((e - 2.3) / 0.6));
        keyMat.opacity = 1 - kout;
        for (const am of armMats) am.opacity = 1 - kout;
        // the bar: in its brackets, lifted (2.95-3.35), drawn back (3.35-4.0), gone
        bar.visible = e < 4.1;
        // (with the priest: his two hands come to it first - up out of the brackets 3.2-3.5, a step back with it 3.5-4.0, and it is put by)
        const lift = kohOn ? ease(clamp((e - 3.2) / 0.3)) : ease(clamp((e - 2.95) / 0.4)), back = kohOn ? ease(clamp((e - 3.5) / 0.5)) : ease(clamp((e - 3.35) / 0.65));
        bar.position.set(B.x + (kohOn ? -0.6 : B.dx) * back, B.y + (kohOn ? 0.35 : 0.5) * lift, B.z);
        cedarBar.opacity = 1 - clamp((e - (kohOn ? 3.78 : 3.7)) / (kohOn ? 0.3 : 0.4));
        // the doors: the first pair 4.2-8.7, the second 9.0-13.0 (tk: inner then outer; yehuda: outer then inner)
        const p1 = clamp((e - 4.2) / 4.5), p2 = clamp((e - 9.0) / 4.0);
        if (k === "tk") poseTK(p1, p2); else poseRY(p2, p1);
        const stage = e < 4.0 ? 0 : e < 8.9 ? 1 : e < 13.2 ? 2 : 3;
        capG.forEach((c, i) => (c.visible = i === stage));
        if (kohOn) kohGate(e, k);
      }
      // KOHEN_ACTOR_211: THE PRIEST AT THE GREAT GATE (the demonstration's seconds). He stands at the lock, the key in his right hand: in,
      // turned, out; both hands lift the bar out of its brackets and he steps back with it; he takes the two leaves by their meeting edges
      // and draws them toward him, stepping back out of their way (the Tanna Kamma: the inner pair from inside the house, then through the
      // doorway to the outer pair; R. Yehuda, between the two gates: the outer pair, a turn, the inner pair); and he walks on into the
      // heichal. The leaves turn at their own pace - where he stands at each moment is clear of them. Model choices: all of it.
      const KT = {
        tk: [[0, -5.6, -1.05], [2.95, -5.6, -1.05], [3.15, -5.4, -1.05], [3.5, -5.4, -1.05], [4.0, -6.0, -0.5], [4.25, -5.35, 0], [4.8, -5.9, 0], [5.1, -6.6, 0], [5.25, -6.9, 0], [5.6, -7.4, 0],
             [6.6, -7.4, 0], [8.6, -0.55, 0], [9.0, -0.55, 0], [10.0, -1.5, 0], [10.3, -2.1, 0], [10.7, -2.6, 0], [13.0, -2.6, 0], [14.6, -7.5, 0], [16.0, -13, 0], [17.6, -17.5, 0]],
        yehuda: [[0, -0.1, -1.05], [2.95, -0.1, -1.05], [3.15, 0.05, -1.05], [3.5, 0.05, -1.05], [4.0, -0.55, -0.5], [4.3, 0.2, 0], [5.0, 0.2, 0], [5.6, -0.3, 0], [8.2, -0.3, 0], [9.0, -3.2, 0],
                 [9.9, -3.2, 0], [10.5, -2.6, 0], [13.0, -2.6, 0], [14.8, -7, 0], [16.4, -11.5, 0], [17.6, -16, 0]]
      };
      const ktrk = (pts, t) => {
        if (t <= pts[0][0]) return [pts[0][1], pts[0][2]];
        for (let i = 0; i + 1 < pts.length; i++) if (t <= pts[i + 1][0]) { const u = (t - pts[i][0]) / Math.max(1e-6, pts[i + 1][0] - pts[i][0]); return [pts[i][1] + (pts[i + 1][1] - pts[i][1]) * u, pts[i][2] + (pts[i + 1][2] - pts[i][2]) * u]; }
        const Lp = pts[pts.length - 1];
        return [Lp[1], Lp[2]];
      };
      const kvv = new Vector3();
      // the free edge of a leaf (the Tanna Kamma) or of a door's second board (R. Yehuda), at a hand's height, in the world; i: 0 north, 1 south
      const tipOf = (k, pair, i) => {
        const s = i ? 1 : -1;
        if (k === "tk") { const h = TK[pair][i][0]; h.updateWorldMatrix(true, false); return h.localToWorld(kvv.set(0.13, 2.3, -s * 4.85)).toArray(); }
        const R = RY[pair][i];
        R[2].updateWorldMatrix(true, false);
        return R[2].localToWorld(kvv.set(R[6].position.x, 2.3, -s * 2.4)).toArray();
      };
      function kohGate(e, k) {
        const clamp = (u) => Math.min(1, Math.max(0, u));
        const Lk = LOCK[k], yk = k === "yehuda", p = ktrk(KT[k], e), east = Math.PI / 2, west = -Math.PI / 2;
        const yaw = yk ? (e < 8.2 ? east : west) : (e < 13.0 ? east : west);
        const o = { x: p[0], y: F, z: p[1], yaw, base: e < 3.0 ? "hold" : "rest", key: e < 1.0 ? true : null };
        // the key: toward the lock, in (1.5-2.3), turned (2.3-2.9), out and away
        const px = (yk ? 0.955 : -4.545) - KOH.KEYL - 0.02;
        if (e >= 1.0 && e < 3.15) {
          const w = Math.min(clamp((e - 1.0) / 0.4), 1 - clamp((e - 2.95) / 0.2)), kin = ease(clamp((e - 1.5) / 0.8)), kout = ease(clamp((e - 2.9) / 0.15));
          o.armR = { p: [px - 0.3 * (1 - kin + kout), Lk.y + 0.04 * (1 - kin), Lk.z], w };
          o.key = { dir: [1, 0, 0], turn: (Math.PI / 2) * ease(clamp((e - 2.3) / 0.6)) };
        }
        // the bar: both hands to it, up and back with it, until it is put by
        if (e >= 2.98 && e < 4.2) {
          const w = Math.min(clamp((e - 2.98) / 0.22), 1 - clamp((e - 3.95) / 0.22)), bx = bar.position.x - 0.22, by = bar.position.y - 0.04;
          o.armR = { p: [bx, by, p[1] + 0.3], w };
          o.armL = { p: [bx, by, p[1] - 0.3], w };
          o.key = null;
        }
        // a pair of doors: his hands on the two meeting edges from t0 to t1
        const pull = (pair, t0, t1) => {
          if (!(e >= t0 - 0.25 && e < t1 + 0.3)) return;
          const w = Math.min(clamp((e - (t0 - 0.25)) / 0.25), 1 - clamp((e - t1) / 0.3)), n = tipOf(k, pair, 0), s2 = tipOf(k, pair, 1), fe = yaw === east;
          o.armL = { p: fe ? n : s2, w };
          o.armR = { p: fe ? s2 : n, w };
        };
        if (yk) { pull("outer", 4.3, 5.1); pull("inner", 9.0, 9.9); } else { pull("inner", 4.25, 5.2); pull("outer", 9.0, 10.25); }
        KOH.pose(o);
      }
      ctx2.animated.push(() => {
        if (G.t0 < 0) return;
        if (G.pausedAt != null) return;   // DEMO_PAUSE_207
        const e = (performance.now() - G.t0) / 1000 / SLOW;
        apply(e);
        const q = G.seq;
        if (e > 17.6) { G.stop(); if (q && q.back) G.set(q.back); }
      });
      // 1.9.1 (the user: "כפתור על הכיור להדגמה וכן בכל מקום שיש הדגמה כפתור כמו בבית ראשון"): the button on the model, over the doorway - on
      // the ulam's side, or the heichal's when the camera is inside
      {
        const MB = Array.isArray(ctx2.shared.modelButtons) ? ctx2.shared.modelButtons : (ctx2.shared.modelButtons = []);
        const aE = [3.2, F + 21.8, 0], aW = [-5.8, F + 21.8, 0];
        MB.push({
          // 1.9.2 (the user, a screenshot from the court: "למה הכפתורים האלו מופיעים אם אני בכלל בשער?"): the demonstrations' pills only near
          // their place and seen - the ray test on (a wall between hides them), a short reach, and only from the ulam, the heichal or the court
          // in front of them
          id: "hei-gate-demo", label: "הדגמה: פתיחת ארבע הדלתות", labelOn: "עצור את ההדגמה", maxDist: 90,
          title: "ארבע דלתות השער הגדול (מידות ד, א), לשיטה שנבחרה בתפריט, תחת ״שיטות ומחלוקות״: הדלתות סגורות, המפתח והנגר, ונפתחות — בהליכה, בגובה העיניים. המתג של השיטה האחרת מראה את שלה.",
          anchor: () => {
            const p = ctx2.camera && ctx2.camera.position;
            if (!p || !(p.x > -45 && p.x < 70 && Math.abs(p.z) < 50 && p.y < F + 70)) return null;
            return p.x < -4.5 ? aW : aE;
          },
          get: () => G.t0 >= 0,
          set: (on) => { if (on) G.demo(null, true); else { DW.stop(); G.stop(); } }
        });
      }
      ctx2.shared.flyPoints = ctx2.shared.flyPoints || {};
      ctx2.shared.flyPoints.greatGateDemo = DEMO_CAM.tk;
      ctx2.shared.flyPoints.greatGate = { pos: [-21, F + 11, 6], target: [-2, F + 9, 0] };
    }
    // 1.9.1 (the user: "צור חור לפשפשים לשתי השיטות"): the front wall beside the great gate (|z| 10.2..27.3) is built six amot thick (the
    // house's wall, Middot 4:7 "כותל ההיכל שש") with its gold facing, and the two pishpeshin are real openings through it, 3 x 6 at z +-19
    // (size and place - model choices); until 1.9.0 the facing was a gold sheet with the wickets painted on it
    for (const s2 of [-1, 1]) {
      const zc = s2 * 18.75, hole = [{ center: zc - s2 * 19, width: 3, height: 6 }];
      const body = H2.wall(g, { axis: "z", length: 17.1, height: 42, thickness: 5.95, mat: M2.marble, occlude: false, cx: -1.5, cz: zc, y: F, openings: hole });
      const face = H2.wall(g, { axis: "z", length: 17.1, height: 42, thickness: 0.15, mat: M2.gold, occlude: false, cx: 1.6, cz: zc, y: F, openings: hole });
      if (s2 > 0) cut.push(body, face);
      else ctx2.__pishBodyN = body;
    }
    // 1.9.1 (the user: "אתה לא יכול לעשות הדגמה לפשפשים שממש נכנסת לתוך עובי הכותל?"): R. Yehuda's way - "בתוך עביו של כתל היה מהלך, עד שנמצא
    // עומד בין שני השערים" (Middot 4:2) - drawn as a real passage in the wall's thickness: from the north pishpesh (z -20.5..-17.5) south
    // inside the wall, 1.5 wide and 6 high on the wall's middle line (x -2.25..-0.75), to the great gate's north reveal (z -5), between the
    // places of his two doors (x 1.0 and -4.0). While his way is shown, the north wall beside the gate and the gate's wall are swapped for
    // these pieces, the same walls with the passage in them. Its width, height and line - model choices
    {
      const tunG = new Group();
      tunG.visible = false;
      g.add(tunG);
      const MW = M2.marble, GD = M2.gold, X0 = -4.475, X1 = 1.475, TW0 = -2.25, TW1 = -0.75, TH = 6;
      const bx = (mat, x0, x1, y0, y1, z0, z1) => H2.box(tunG, x1 - x0, y1 - y0, z1 - z0, mat, (x0 + x1) / 2, y0, (z0 + z1) / 2);
      // the wall north of the gate (|z| 10.2..27.3, 42 high): solid north of the pishpesh, over it, and round the passage
      bx(MW, X0, X1, F, F + 42, -27.3, -20.5);
      bx(MW, X0, X1, F + TH, F + 42, -20.5, -17.5);
      bx(MW, X0, X1, F + TH, F + 42, -17.5, -10.2);
      bx(MW, TW1, X1, F, F + TH, -17.5, -10.2);
      bx(MW, X0, TW0, F, F + TH, -17.5, -10.2);
      // the gate's wall (|z| < 10, 85 high, its doorway 10 x 20): the north jamb round the passage, the lintel and the south jamb
      bx(GD, -4.5, 1.5, F + TH, F + 85, -10, -5);
      bx(GD, TW1, 1.5, F, F + TH, -10, -5);
      bx(GD, -4.5, TW0, F, F + TH, -10, -5);
      bx(GD, -4.5, 1.5, F + 20, F + 85, -5, 5);
      bx(GD, -4.5, 1.5, F, F + 85, 5, 10);
      tunG.traverse((o) => { if (o.isMesh) o.userData.noPick = true; });
      ctx2.shared.pishTunnel = (on) => {
        on = !!on;
        tunG.visible = on;
        if (gateWall) gateWall.visible = !on;
        if (ctx2.__pishBodyN) ctx2.__pishBodyN.visible = !on;
      };
    }
    H2.cyl(g, 0.15, 0.18, 22, M2.cedar, 2.3, F, -5.7, 10);
    H2.cyl(g, 0.15, 0.18, 22, M2.cedar, 2.3, F, 5.7, 10);
    const rod = new Mesh(new CylinderGeometry(0.1, 0.1, 12, 10), M2.gold);
    rod.rotation.x = Math.PI / 2;
    rod.position.set(2.3, 43.5, 0);
    rod.castShadow = true;
    g.add(rod);
    // 1.9.1 (the user: "גפן של זהב — מבט מרוחק יותר, שתיראה כולה"): a fuller vine - "וכל מי שהוא מתנדב עלה או גרגיר או אשכול, מביא
    // ותולה בה" (Middot 3:8): leaves along the rod and over the posts, and clusters of grapes hanging from it (their number - model choice)
    const leafG = new BoxGeometry(0.85, 0.06, 0.62);
    const leafMats = [], grapeMats = [];
    for (let i = 0; i < 46; i++) {
      const t = i / 45, onPost = i % 7 === 3;
      leafMats.push(m4(
        2.35 + Math.sin(i * 3.7) * 0.25,
        onPost ? 30 + (i % 3) * 4.2 : 43.1 + Math.sin(i * 2.1) * 1.1,
        onPost ? (i % 2 ? 5.7 : -5.7) + Math.sin(i) * 0.4 : -6 + t * 12,
        Math.sin(i) * 0.7,
        i * 0.9,
        0.4 + Math.sin(i * 1.3) * 0.6
      ));
    }
    for (let c = 0; c < 9; c++) {   // nine clusters: rows of grapes narrowing downward
      const cz = -4.4 + c * 1.1, top = 42.6 - (c % 3) * 0.25;
      for (const [row, n] of [[0, 4], [1, 3], [2, 3], [3, 2], [4, 1]]) for (let k = 0; k < n; k++) {
        grapeMats.push(m4(2.45 + (k % 2) * 0.12, top - row * 0.26, cz + (k - (n - 1) / 2) * 0.24, 0, 0, 0, 1, 1, 1));
      }
    }
    instMesh(g, leafG, M2.gold, leafMats, false);
    instMesh(g, new SphereGeometry(0.15, 8, 8), M2.gold, grapeMats, false);
    // 1.1.0: the two tables of the Ulam (Mishnah Shekalim 6:4; Rambam Beit HaBechirah 3:16; Menachot 99b): marble (the bread on its way in)
    // and gold (on its way out), inside the Ulam by the Heichal entrance. Size (2 x 1 amot like the shulchan) and sides (marble north, gold south): MODEL CHOICES.
    // 1.9.1 (the user: "שלחנות האולם תגדיל קצת ותן להם מבט יותר ברור"): 2.4 x 1.2, 1.6 high (model choice), with a rim; on the marble
    // table the twelve loaves in two rows of six, as they come in (the size of the loaves - model choice)
    for (const [zz, mat] of [[-8, M2.marble], [8, M2.gold]]) {
      for (const dx of [-1.05, 1.05]) for (const dz of [-0.48, 0.48]) H2.box(g, 0.18, 1.6, 0.18, mat, 4 + dx, F, zz + dz);
      H2.box(g, 2.4, 0.14, 1.2, mat, 4, F + 1.6, zz);
      for (const s2 of [-1, 1]) { H2.box(g, 2.4, 0.12, 0.08, mat, 4, F + 1.74, zz + s2 * 0.56); H2.box(g, 0.08, 0.12, 1.2, mat, 4 + s2 * 1.16, F + 1.74, zz); }
    }
    {
      // BREAD_205 (the user: "הלחם בשולחנות האולם צריך להיות נאמן למקור"): the loaves of the table inside (45-vessels.js tableGeo.bread:
      // two stacks of six, each loaf with its walls folded up and its horns), without the posts and the tubes, which belong to the
      // golden table inside; their base on the marble board (its top at F + 1.74). As in the First House plugin since 1.3.3.
      // How they lay on the marble table is not written: a model choice (said in the card).
      const BK = ctx2.shared.breadKit;
      if (BK) { const br = instMesh(g, BK.geo, BK.mat, [new Matrix4().makeTranslation(4, F + 1.74 - BK.top, -8)], true); br.name = "ulam-table-bread"; if (BK.geoB && ctx2.shared.breadShape) ctx2.shared.breadShape.shaped(br, BK.geo, BK.geoB); }   // SHOWBREAD_SHAPE_211
    }
    ctx2.labels.push({ text: "שלחן השיש — לחם הפנים בכניסתו", x: 4, y: F + 4.8, z: -8, size: 1.2 }, { text: "שלחן הזהב — ביציאתו", x: 4, y: F + 4.8, z: 8, size: 1.2 });
    // 1.1.0: the two pishpeshin (wickets) of the great gate (Middot 4:2; Rambam 4:6), one north and one south of it, on the east face of the
    // Heichal in the zone of the cells (Middot 4:3: the north-east cell has a door "to the pishpesh"). Size 3 x 6 and distance from the gate: MODEL CHOICES.
    // 1.9.1: each opening has a stone frame on the face; the northern wicket's door stands open into the wall, the southern one is shut
    // ("ושל דרום לא נכנס בו אדם מעולם", Middot 4:2)
    for (const sz of [-1, 1]) {
      const zz = sz * 19;
      H2.box(g, 0.3, 0.4, 3.8, M2.stoneLight, 1.8, F + 6, zz);
      for (const e of [-1, 1]) H2.box(g, 0.3, 6, 0.4, M2.stoneLight, 1.8, F, zz + e * 1.7);
      if (sz > 0) H2.box(g, 0.2, 6, 3, M2.cedar, 1.3, F, zz);                 // the southern - shut
      else {
        const hinge = new Group();
        hinge.position.set(1.3, F, zz - 1.38);
        hinge.rotation.y = -Math.PI / 2;                                        // swung in, flat against the north reveal
        g.add(hinge);
        H2.box(hinge, 0.2, 6, 3, M2.cedar, 0, 0, 1.5);
        ctx2.__pishDoorN = hinge;   // 1.9.2: the walk opens it
      }
    }
    { const lb = new Group(); g.add(lb); ctx2.layers.pishLblDoor = lb; }   // 1.9.2: off in the Ra'avad's reading (pishLock below)
    ctx2.labels.push({ text: "פשפש צפוני", x: 3.4, y: F + 7.6, z: -19, size: 1.2, layers: ["pishLblDoor"] }, { text: "פשפש דרומי — סגור יהיה", x: 3.4, y: F + 7.6, z: 19, size: 1.2 });   // 1.9.2: 1.7 out of the face
    // 1.8.1 (the user: "תן את ב׳ השיטות לפשפש גם מבפנים"): THE TWO WAYS from the northern pishpesh to the great gate (Middot 4:2), drawn as
    // dashed paths that show through the walls (they render on top), so they read from outside and from inside alike, switched by
    // ctx2.shared.pishpeshWay (the opinions table; the place "פשפשי ההיכל" shows the chosen one for 15 s): "rabbanan" - "נטל את המפתח ופתח את
    // הפשפש, ונכנס להתא, ומהתא להיכל" and through the hall to the inner doors of the great gate, then out to the outer ones; "yehuda" -
    // "בתוך עביו של כתל היה מהלך, עד שנמצא עומד בין שני השערים, ופתח את החיצונות מבפנים ואת הפנימיות מבחוץ" - inside the six amot of the
    // front wall (x -4.5..1.5), from the pishpesh to the space between the two pairs of doors. The cell's door to the hall and the line inside
    // the wall - model choices.
    {
      const root = new Group(), tk = new Group(), ry = new Group();
      root.visible = false;
      ry.visible = false;
      g.add(root); root.add(tk); root.add(ry);
      ctx2.layers.pishWay = root; ctx2.layers.pishWayTK = tk; ctx2.layers.pishWayRY = ry;
      const Y = F + 0.35;
      const path = (grp, pts, color) => {
        const mat = new MeshBasicMaterial({ color, transparent: true, opacity: 0.95, depthTest: false });
        for (let i = 0; i + 1 < pts.length; i++) {
          const [x0, z0] = pts[i], [x1, z1] = pts[i + 1], L = Math.hypot(x1 - x0, z1 - z0), n = Math.max(1, Math.floor(L / 1.2));
          for (let k = 0; k < n; k++) {
            const t0 = k / n, t1 = (k + 0.6) / n;
            const ax = x0 + (x1 - x0) * t0, az = z0 + (z1 - z0) * t0, bx = x0 + (x1 - x0) * t1, bz = z0 + (z1 - z0) * t1;
            const d = new Mesh(new BoxGeometry(Math.hypot(bx - ax, bz - az), 0.14, 0.32), mat);
            d.position.set((ax + bx) / 2, Y, (az + bz) / 2);
            d.rotation.y = -Math.atan2(bz - az, bx - ax);
            d.renderOrder = 12; d.userData.noPick = true;
            grp.add(d);
          }
        }
        const [xe, ze] = pts[pts.length - 1], [xp, zp] = pts[pts.length - 2];
        const tip = new Mesh(new ConeGeometry(0.55, 1.3, 10), mat);
        tip.rotation.z = -Math.PI / 2;
        const holder = new Group(); holder.add(tip); holder.position.set(xe, Y, ze); holder.rotation.y = -Math.atan2(ze - zp, xe - xp);
        tip.renderOrder = 12; grp.add(holder);
      };
      path(tk, [[3, -19], [-6.5, -19], [-6.5, -12.5], [-6.5, -3], [-5.2, 0], [2.8, 0]], 0x2fd3ff);
      path(ry, [[3, -19], [-1.5, -19], [-1.5, -5.5], [-1.5, 0]], 0xff4fd8);
      ctx2.labels.push(
        { text: "דרך חכמים: מן הפשפש לתא, מן התא להיכל, ולשער הגדול", x: -8, y: F + 4.5, z: -9, size: 1.1, layers: ["pishWay", "pishWayTK"] },
        { text: "דרך רבי יהודה: בתוך עובי הכותל, עד בין שני השערים", x: -1.5, y: F + 4.5, z: -11, size: 1.1, layers: ["pishWay", "pishWayRY"] }
      );
      // 1.9.2 (the user: "תעשה חור - אגב קבוע בקיר לכניסה"): the way's openings stay - R. Yehuda's passage in the front wall (pishTunnel),
      // or the Sages' door from the north-east cell to the heichal (NEDOOR)
      ctx2.shared.pishpeshWay = { mode: "rabbanan", set(m) { this.mode = m === "yehuda" ? "yehuda" : "rabbanan"; tk.visible = this.mode === "rabbanan"; ry.visible = this.mode === "yehuda"; root.visible = true;
        if (ctx2.shared.pishTunnel) ctx2.shared.pishTunnel(this.mode === "yehuda"); NEDOOR.set(this.mode === "rabbanan"); } };
      // 1.9.1 (the user: "הדגמה של הכניסה אפשרית?"): THE ENTRY - a glowing marker (the priest with the key) walks the chosen way over 9 s,
      // drawn over the walls, with the Mishnah's words for each stage (layers pishDemo0..2); ctx2.shared.pishpeshDemo(mode)
      {
        const WAYS = {
          rabbanan: [[3, -19], [-6.5, -19], [-6.5, -12.5], [-6.5, -3], [-5.2, 0], [2.8, 0]],
          yehuda: [[3, -19], [-1.5, -19], [-1.5, -5.5], [-1.5, 0]]
        };
        const CAPS = {
          rabbanan: ["״נטל את המפתח ופתח את הפשפש״", "״ונכנס להתא, ומהתא להיכל״", "״הגיע לשער הגדול, העביר את הנגר ואת הפותחות ופתחו״ (תמיד ג, ז)"],
          yehuda: ["״נטל את המפתח ופתח את הפשפש״", "רבי יהודה: ״בתוך עביו של כתל היה מהלך״", "״עד שנמצא עומד בין שני השערים, ופתח את החיצונות מבפנים ואת הפנימיות מבחוץ״"]
        };
        const mk = new Group();
        mk.visible = false;
        g.add(mk);
        // 1.9.1 (the user: "בפשפשים תעשה צללית ולא מה שעשית"): a SILHOUETTE, as the king's in the First Temple plugin - one translucent
        // robed figure, no face and no features, about 3.9 amot tall; drawn over the walls (R. Yehuda's way runs inside the wall)
        const silMat = new MeshBasicMaterial({ color: 0x2a1f45, transparent: true, opacity: 0.6, depthWrite: false, depthTest: false });
        const part = (geo, x, y, z, rz) => { const m = new Mesh(geo, silMat); m.position.set(x, y, z); if (rz) m.rotation.z = rz; m.renderOrder = 13; mk.add(m); return m; };
        part(new CylinderGeometry(0.36, 0.72, 3.05, 20), 0, 1.525, 0);                    // the robe, to the feet
        const sh = part(new SphereGeometry(0.46, 14, 8), 0, 3.0, 0); sh.scale.set(1, 0.44, 0.66);   // the shoulders
        const hd = part(new SphereGeometry(0.3, 14, 10), 0, 3.5, 0); hd.scale.set(0.97, 1.2, 1);    // the head
        for (const e of [-1, 1]) part(new CylinderGeometry(0.11, 0.13, 1.6, 8), e * 0.52, 2.2, 0, e * 0.12);   // the arms
        const capG = [new Group(), new Group(), new Group()];
        capG.forEach((c, i) => { c.visible = false; g.add(c); ctx2.layers["pishDemo" + i] = c; });
        const capLbl = { rabbanan: [], yehuda: [] };
        for (const mode of ["rabbanan", "yehuda"]) CAPS[mode].forEach((t, i) => { const l = { text: t, x: -2, y: F + 9.5, z: -12, size: 1.3, layers: ["pishDemo" + i, mode === "rabbanan" ? "pishWayTK" : "pishWayRY"] }; ctx2.labels.push(l); capLbl[mode].push(l); });
        const D = { t0: -1, mode: "rabbanan", seq: null, cut: false };
        // 1.9.2 (the user: "ההדגמה ממש תכניס אותי לתוך הפשפש ולא מלמעלה"; "למה נעצרים — נכנסים ממש"): THE ENTRY, WALKED at a man's eye
        // (DW): from the ulam to the northern pishpesh, the key and the wicket swung in, through the wall - the Sages: into the cell, and by
        // its door into the heichal (Middot 4:3 "ואחד להיכל"), to the great gate from inside, where the four doors are opened as the Tanna
        // Kamma; R. Yehuda: in the wall's thickness to between the two gates, where the doors are opened as he says, and in, into the heichal.
        // The chosen way only (the row's chip chooses and runs). No section any more (1.9.1 cut the model from above); the figure is not drawn -
        // the eye is the priest's.
        // 1.9.2 (the user: "תעשה את ג' השיטות ברירת מחדל הרמבם"; "ר גרשום כנראה שהוא ביאור מלאכת שלמה"): THE TWO KEYS (Tamid 3:6: "ושני
        // מפתחות, אחד יורד לאמת השחי ואחד פותח כיון"; 3:7: "נטל את המפתח ופתח את הפשפש") - where the hand went in, three readings, the row
        // "המפתח שיורד לאמת השחי" (ctx2.shared.pishLock), each in its own words (checked in the library):
        //  "rambam" (the default) - the Commentary on the Mishnah, Tamid 3:6 (book 575): "שני מנעולים, אחד בתחתית הפתח, כדי שלא יהיה נוח
        //     לפתוח, עד שיושיט אדם ידו מן המקום שהוא עומד שם ומושך אמת זרועו עד סוף האציל... והאחד פותח אותו כנגד ידו והוא עומד, ואין צריך
        //     להרים ידיו למעלה ולא להושיטם למטה": two locks on the door's outer face - low (the arm straight down) and at the hand;
        //  "ms" - Melechet Shlomo on Tamid 3:6 (book 1202): "והפתח הפתוח לאולם היה אצל הפתח חור עקום בעובי הכותל, ומכניס ידו עם המפתח בחור
        //     עד בית השחי, ופותח את המנעול מבפנים"; and Rabbenu Gershom (Tamid 30b, book 2101): "אותו שבפנים היה צריך להושיט זרועו עד בית
        //     השחי": a crooked hole south of the opening, the lock on the door's inner face;
        //  "raavad" - his gloss on Beit HaBechira 4:11 (book 5252): "והיה פתח קטן כעין חלון שמכניס זרועו בה, והוא נקרא פשפש, ופותח פתח התא
        //     המזרחי שהיה המנעול מבפנים": a small window by the door, the arm through it to the lock inside.
        // The places and forms of the hole, the window and the locks, and the arm (the great gate's form) - model choices. In the walk the
        // arm does it before the door swings in; inside the wall the hole and the arm are drawn over the stone (an X-ray).
        const PL = (() => {
          const doorG = ctx2.__pishDoorN;
          const plate = new MeshStandardMaterial({ color: 0x9a7a2a, roughness: 0.45, metalness: 0.75 });
          const holeM = new MeshBasicMaterial({ color: 0x120c06, transparent: true, opacity: 0.92 });
          const xrayM = new MeshBasicMaterial({ color: 0x2a1a0a, transparent: true, opacity: 0.55, depthTest: false, depthWrite: false });
          const xrayE = new LineBasicMaterial({ color: 0xffb21a, transparent: true, opacity: 0.95, depthTest: false });
          const grp = { rambam: new Group(), ms: new Group(), raavad: new Group() };
          for (const k of Object.keys(grp)) { grp[k].visible = k === "rambam"; g.add(grp[k]); }
          const onDoor = { rambam: new Group(), inner: new Group() };   // the plates ride on the door's hinge group
          if (doorG) { doorG.add(onDoor.rambam); doorG.add(onDoor.inner); }
          onDoor.inner.visible = false;
          const plateAt = (parent, lx, ly, lz) => {
            const b = new Mesh(new BoxGeometry(0.05, 0.5, 0.38), plate); b.position.set(lx, ly, lz); b.castShadow = true; parent.add(b);
            const kh = new Mesh(new BoxGeometry(0.02, 0.16, 0.06), holeM); kh.position.set(lx + Math.sign(lx) * 0.03, ly, lz); parent.add(kh);
          };
          // the door (shut): its outer face at local x +0.1 (world 1.4), its free edge at local z 3 (world -17.38)
          // KOHEN_ACTOR_211: a whole priest opens them, with an arm of a man's length - so the locks, the hole and the window stand where
          // he reaches: the Rambam's two on the door's outer face (the low one an arm's length under his shoulder, "ומושך אמת זרועו");
          // the lock of the other two readings - a box on the door's inner face by its free edge, its keyhole in its south side: the
          // hand comes to it from the south, out of the hole (Melechet Shlomo: in from the face and then bent north, as an arm bends at
          // its elbow) or through the window (the Ra'avad: aslant). Until 2.0.1 the hole was three amot long, for a hand without a man.
          const LKY = F + 2.42;                         // the height of the priest's shoulder
          plateAt(onDoor.rambam, 0.12, 1.35, 2.3);      // "בתחתית הפתח": reached with the arm straight down, standing (F + 1.35)
          plateAt(onDoor.rambam, 0.12, 1.95, 2.3);      // "כנגד ידו": at his elbow's height as he stands - "ואין צריך להרים ידיו למעלה ולא להושיטם למטה" (until 2.0.1: 2.35)
          { const bx = new Mesh(new BoxGeometry(0.26, 0.5, 0.3), plate); bx.position.set(-0.23, 2.42, 2.63); bx.castShadow = true; onDoor.inner.add(bx);   // inside: Melechet Shlomo's and the Ra'avad's lock
            const kh = new Mesh(new BoxGeometry(0.06, 0.16, 0.02), holeM); kh.position.set(-0.23, 2.42, 2.79); onDoor.inner.add(kh); }
          // Melechet Shlomo: the hole's mouth on the face south of the opening, in at x 0.6 and turned north to behind the door's free edge
          const MS_PATH = [[1.69, LKY, -16.8], [1.07, LKY, -16.8], [1.07, LKY, -17.24]];   // its end: the hand, a key's length south of the keyhole
          const RV_PATH = [[1.69, LKY, -16.72], [1.07, LKY, -17.24]];
          const mouth = (parent, z, w, h) => { const m = new Mesh(new BoxGeometry(0.06, h, w), holeM); m.position.set(1.7, LKY, z); parent.add(m); };
          mouth(grp.ms, -16.8, 0.6, 0.6);
          { const fr = new Mesh(new BoxGeometry(0.12, 1.25, 1.25), M2.stoneLight); fr.position.set(1.66, LKY, -16.6); grp.raavad.add(fr);
            mouth(grp.raavad, -16.6, 0.95, 0.95); }   // the Ra'avad's window, a stone frame round it (it joins the door's own frame)
          // the X-ray of the hole / the window (shown during the walk's keys only)
          const xr = { ms: new Group(), raavad: new Group() };
          const tube = (parent, a2, b2, w) => {
            const A = new Vector3(...a2), B = new Vector3(...b2), L = A.distanceTo(B), geo = new BoxGeometry(L, w, w);
            const m = new Mesh(geo, xrayM); m.position.copy(A).add(B).multiplyScalar(0.5); m.quaternion.setFromUnitVectors(new Vector3(1, 0, 0), B.clone().sub(A).normalize());
            m.renderOrder = 18; parent.add(m);
            const e = new LineSegments(new EdgesGeometry(geo), xrayE); e.position.copy(m.position); e.quaternion.copy(m.quaternion); e.renderOrder = 19; parent.add(e);
          };
          for (let i = 0; i + 1 < MS_PATH.length; i++) tube(xr.ms, MS_PATH[i], MS_PATH[i + 1], 0.6);
          tube(xr.raavad, RV_PATH[0], RV_PATH[1], 0.8);
          for (const k of ["ms", "raavad"]) {   // KOHEN_ACTOR_211: the lock behind the door, seen through it with the hole
            const lg = new BoxGeometry(0.26, 0.5, 0.3), lm = new Mesh(lg, xrayM);
            lm.position.set(1.07, LKY, -17.75); lm.renderOrder = 18; xr[k].add(lm);
            const le = new LineSegments(new EdgesGeometry(lg), xrayE);
            le.position.copy(lm.position); le.renderOrder = 19; xr[k].add(le);
          }
          for (const k of ["ms", "raavad"]) { xr[k].visible = false; grp[k].add(xr[k]); }
          // the labels - 1.7 out of the wall's face (a sprite seen aslant does not sink into the stone), and hidden during the walk (its
          // captions say it; layer pishLockLbl)
          const lblG = new Group();
          g.add(lblG);
          ctx2.layers.pishLockLbl = lblG;
          ctx2.labels.push(
            { text: "שני מנעולים מבחוץ (הרמב״ם)", x: 3.4, y: F + 4.4, z: -17.0, size: 0.8, layers: ["pishLockRB", "pishLockLbl"] },
            { text: "חור עקום בעובי הכותל (מלאכת שלמה)", x: 3.4, y: F + 4.4, z: -15.9, size: 0.8, layers: ["pishLockMS", "pishLockLbl"] },
            { text: "הפשפש — ״פתח קטן כעין חלון״ (הראב״ד)", x: 3.4, y: F + 4.4, z: -15.7, size: 0.8, layers: ["pishLockRV", "pishLockLbl"] },
            { text: "פתח התא — ״שהיה המנעול מבפנים״", x: 3.4, y: F + 7.6, z: -19, size: 1.1, layers: ["pishLockRV"] }
          );
          ctx2.layers.pishLockRB = grp.rambam; ctx2.layers.pishLockMS = grp.ms; ctx2.layers.pishLockRV = grp.raavad;
          // the arm: a sleeve in up to three pieces (it follows the crooked hole), the fist, and the key out of the fist
          const skin = new MeshStandardMaterial({ color: 0xc99d7c, roughness: 0.75, transparent: true }), linen = new MeshStandardMaterial({ color: 0xf1ede2, roughness: 0.92, transparent: true });
          const keyM = new MeshStandardMaterial({ color: 0xd9b24a, roughness: 0.3, metalness: 0.9, transparent: true });
          const arm = new Group(); arm.visible = false; g.add(arm);
          const segs = [0, 1, 2].map(() => { const m = new Mesh(new CylinderGeometry(0.13, 0.15, 1, 12), linen); m.castShadow = true; arm.add(m); return m; });
          const fist = new Mesh(new SphereGeometry(0.16, 14, 10), skin); fist.scale.set(1.1, 0.95, 1.05); arm.add(fist);
          const key = new Group(); arm.add(key);
          { const sh = new Mesh(new CylinderGeometry(0.035, 0.035, 0.62, 8), keyM); sh.rotation.z = Math.PI / 2; sh.position.x = 0.31; key.add(sh);
            const bit = new Mesh(new BoxGeometry(0.1, 0.16, 0.04), keyM); bit.position.set(0.56, -0.08, 0); key.add(bit);
            const bow = new Mesh(new TorusGeometry(0.1, 0.03, 8, 18), keyM); bow.position.x = -0.06; key.add(bow); }
          const allM = [skin, linen, keyM];
          const UP = new Vector3(0, 1, 0), X1 = new Vector3(1, 0, 0), va = new Vector3(), vb = new Vector3();
          const setSeg = (m, a2, b2) => {
            va.set(...a2); vb.set(...b2);
            const L = va.distanceTo(vb);
            if (!(L > 0.02)) { m.visible = false; return; }
            m.visible = true;
            m.position.copy(va).add(vb).multiplyScalar(0.5);
            m.scale.set(1, L, 1);
            m.quaternion.setFromUnitVectors(UP, vb.clone().sub(va).normalize());
          };
          // place the arm along a path [P_out (behind the hand's start, outside), ..., P_last (the lock)]: the hand at distance s along it,
          // the sleeve the LA before it; dir - where the key points (into the lock)
          const LA = 2.4;
          const along = (path, d) => {   // a point at distance d along the path (before its start: back along its first leg)
            if (d <= 0) { const a2 = new Vector3(...path[0]), b2 = new Vector3(...path[1]), u = a2.clone().sub(b2).normalize(); return a2.addScaledVector(u, -d).toArray(); }
            let acc = 0;
            for (let i = 0; i + 1 < path.length; i++) {
              const a2 = new Vector3(...path[i]), b2 = new Vector3(...path[i + 1]), L = a2.distanceTo(b2);
              if (d <= acc + L) return a2.lerp(b2, (d - acc) / L).toArray();
              acc += L;
            }
            return path[path.length - 1];
          };
          const lenOf = (path) => { let L = 0; for (let i = 0; i + 1 < path.length; i++) L += new Vector3(...path[i]).distanceTo(new Vector3(...path[i + 1])); return L; };
          const placeArm = (path, s2, dir, turn, alpha, xray) => {
            arm.visible = alpha > 0.01;
            if (!arm.visible) return;
            for (const m of allM) { m.opacity = alpha; m.depthTest = !xray; }
            arm.renderOrder = xray ? 20 : 0;
            arm.traverse((o) => { o.renderOrder = xray ? 20 : 0; });
            // the joints along the path between s2 - LA and s2
            const pts = [along(path, s2 - LA)];
            let acc = 0;
            for (let i = 0; i + 1 < path.length; i++) {
              acc += new Vector3(...path[i]).distanceTo(new Vector3(...path[i + 1]));
              if (acc > s2 - LA && acc < s2) pts.push(path[i + 1]);
            }
            const hand = along(path, s2);
            pts.push(hand);
            segs.forEach((m, i) => (i + 1 < pts.length ? setSeg(m, pts[i], pts[i + 1]) : (m.visible = false)));
            fist.position.set(...hand);
            key.position.set(...hand);
            key.quaternion.setFromUnitVectors(X1, new Vector3(...dir).normalize());
            key.rotateX(turn);
          };
          // the Rambam's two reaches: from the shoulder (standing at the door) straight to the hand; the hand stops a key's length (0.62) east of
          // the plate's face (x 1.445), so that the key's tip is in the lock
          const RB_LOW = { sh: [2.3, F + 3.05, -17.83], h0: [2.65, F + 1.35, -17.83], h1: [2.07, F + 1.35, -17.83] };
          const RB_HAND = { sh: [2.95, F + 2.85, -17.83], h0: [2.65, F + 2.35, -17.83], h1: [2.07, F + 2.35, -17.83] };
          const placeDirect = (sh, hand, dir, turn, alpha) => {
            arm.visible = alpha > 0.01;
            if (!arm.visible) return;
            for (const m of allM) { m.opacity = alpha; m.depthTest = true; }
            arm.traverse((o) => { o.renderOrder = 0; });
            setSeg(segs[0], sh, hand);
            segs[1].visible = segs[2].visible = false;
            fist.position.set(...hand);
            key.position.set(...hand);
            key.quaternion.setFromUnitVectors(X1, new Vector3(...dir).normalize());
            key.rotateX(turn);
          };
          const E = (u) => (u <= 0 ? 0 : u >= 1 ? 1 : 0.5 - 0.5 * Math.cos(Math.PI * u));
          const seg01 = (t, a2, b2) => Math.min(1, Math.max(0, (t - a2) / (b2 - a2)));
          const W = {
            mode: "rambam",
            set(m) {
              this.mode = m === "ms" || m === "raavad" ? m : "rambam";
              for (const k of Object.keys(grp)) grp[k].visible = k === this.mode;
              onDoor.rambam.visible = this.mode === "rambam";
              onDoor.inner.visible = this.mode !== "rambam";
              if (ctx2.layers.pishLblDoor) ctx2.layers.pishLblDoor.visible = this.mode !== "raavad";
              return this.mode;
            },
            // the keys' phase of the walk, t in demo seconds from its start; LT its length
            LT: 4.6,
            pose(t) {
              const m = this.mode;
              if (xr.ms) xr.ms.visible = m === "ms" && t > 0.8 && t < this.LT;
              if (xr.raavad) xr.raavad.visible = m === "raavad" && t > 0.8 && t < this.LT;
              arm.visible = false;   // KOHEN_ACTOR_211: the whole priest does it (koh, below) - until 2.0.1 a sleeve and a fist alone
            },
            // KOHEN_ACTOR_211: THE PRIEST AT THE WICKET'S LOCKS at the walk's second t (until LT) - where he stands and what his right arm
            // does, for KOH.pose. The Rambam: before the door, his right shoulder against the two locks - the arm straight down to the
            // low one, the key in and turned, then a half step back and the lock at his hand. Melechet Shlomo / the Ra'avad: his face to
            // the wall, his shoulder coming to the hole's (the window's) mouth as the arm goes in "עד בית השחי", the key to the keyhole
            // behind the door; the arm inside the stone is drawn over it
            koh(t) {
              const m = this.mode, P = KOH.dims(), SX = P ? P.sx : 0.35, W2 = -Math.PI / 2;
              if (m === "rambam") {
                const RBZ = -18.08, low = t < 2.9, t0 = low ? 1.0 : 2.9, yy = F + (low ? 1.35 : 1.95);
                const appear = seg01(t, t0, t0 + 0.35), goIn = E(seg01(t, t0 + 0.35, t0 + 0.95)), turn = E(seg01(t, t0 + 0.95, t0 + 1.4)) * Math.PI / 2, out = E(seg01(t, t0 + 1.4, t0 + 1.8)), f = goIn - out;
                const hx = 1.445 + KOH.KEYL + 0.02 + 0.28 * (1 - f);
                return { x: 2.05 + 0.4 * E(seg01(t, 2.7, 3.1)), y: F, z: RBZ + SX, yaw: W2, base: "hold", key: t < t0 || t > t0 + 1.9 ? true : { dir: [-1, 0, 0], turn: turn * (1 - out) },
                  armR: t >= t0 ? { p: [hx, yy + (low ? 0.06 : 0) * (1 - f), RBZ], w: Math.min(appear, 1 - seg01(t, t0 + 1.7, t0 + 1.9)) } : null };
              }
              const path = m === "ms" ? MS_PATH : RV_PATH, L = lenOf(path);
              const appear = seg01(t, 1.0, 1.35), goIn = E(seg01(t, 1.35, 2.75)), turn = E(seg01(t, 2.75, 3.25)) * Math.PI / 2, out = E(seg01(t, 3.25, 4.3)), p = goIn - out;
              const hand = along(path, Math.max(0.001, p * L)), kn = E(seg01(p, 0.5, 0.85));
              return { x: 1.94 + 0.7 * (1 - p), y: F, z: path[0][2] + SX, yaw: W2, base: "hold", xray: p > 0.04,
                key: t < 1.0 || t > 4.5 ? true : { dir: [-(1 - kn), 0, -kn], turn: turn * (1 - out) },
                armR: t >= 1.0 ? { p: hand, w: Math.min(appear, 1 - seg01(t, 4.3, 4.55)), pole: m === "ms" ? [1, -0.15, 0] : null } : null };
            },
            hide() { arm.visible = false; if (xr.ms) xr.ms.visible = false; if (xr.raavad) xr.raavad.visible = false; lblG.visible = true; },
            walking() { lblG.visible = false; }
          };
          return W;
        })();
        ctx2.shared.pishLock = PL;
        const YW = F + 3.2, LT = PL.LT, PW_END = 10.6 + LT - 0.8;   // the old walk, from its door-opening on, after the keys
        const shiftK = (keys, dt) => keys.map(([t, e2, l2]) => [t + dt, e2, l2]);
        // KOHEN_ACTOR_211: from the north-east - his right side, the arm and the locks (from the south his own body hid them)
        const LOCK_CAM = {
          rambam: [[5.0, YW - 0.2, -21.6], [1.7, F + 1.95, -18.0]],
          ms: [[4.5, F + 4.5, -20.8], [1.3, F + 2.3, -17.2]],   // a little above the eye: the hole's bend is seen from over it
          raavad: [[4.5, F + 4.3, -20.6], [1.3, F + 2.3, -17.1]]
        };
        const LOCK_CAP = {
          rambam: [[0.9, "הרמב״ם: ״אחד בתחתית הפתח... ומושך אמת זרועו עד סוף האציל״"], [2.9, "״והאחד פותח אותו כנגד ידו והוא עומד״"]],
          ms: [[0.9, "מלאכת שלמה: ״חור עקום בעובי הכותל, ומכניס ידו עם המפתח בחור עד בית השחי, ופותח את המנעול מבפנים״"]],
          raavad: [[0.9, "הראב״ד: ״פתח קטן כעין חלון שמכניס זרועו בה... ופותח פתח התא... שהיה המנעול מבפנים״"]]
        };
        const PWALK0 = {
          rabbanan: [
            [0.0, [10, YW, -15.5], [1.6, F + 3, -19]],
            [1.0, [6.8, YW, -18.6], [1.6, F + 2.8, -19]],
            [2.6, [6.8, YW, -18.6], [1.6, F + 2.8, -19]],
            [3.8, [0.6, YW, -19], [-6, F + 3, -19]],
            [4.8, [-5.0, YW, -19.2], [-7.6, F + 3, -15.0]],     // KOHEN_ACTOR_211: the eye turns with the priest toward the cell's door (it looked on west along the cell)
            [5.8, [-6.5, YW, -18.4], [-6.5, F + 3, -9]],        // (WALK_SOFT_204: the eye's line as it was - the door stands right by the wall he comes through; the turn itself is slow, by angle)
            [7.8, [-6.5, YW, -12.2], [-6.5, F + 3, -3]],
            [8.3, [-6.5, YW, -9.7], [-8.6, F + 3.2, -1.5]],     // WALK_SOFT_204: out of the door in its middle (the curve cut its jamb)
            [9.2, [-8.5, YW, -4.5], [-5.0, F + 3.0, -1.0]],     // KOHEN_ACTOR_211: the eye stays with the priest on his way to the gate (it looked into the house)
            [10.6, [-13, YW, 0.8], [-4.5, F + 3.0, -0.3]]     // WALK_END_211: 10.6 - with the shift below it IS PW_END (written PW_END it came 3.8 s late: the eye was still on its way while the key turned and the bar was lifted, and the gate's close keys were passed over)
          ],
          yehuda: [
            [0.0, [10, YW, -15.5], [1.6, F + 3, -19]],
            [1.0, [6.8, YW, -18.6], [1.6, F + 2.8, -19]],
            [2.6, [6.8, YW, -18.6], [1.6, F + 2.8, -19]],
            [3.8, [0.2, YW, -19], [-1.5, F + 3, -14]],
            [4.6, [-1.5, YW, -18.6], [-1.5, F + 3, -10]],
            [5.2, [-1.5, YW, -16.4], [-1.5, F + 3, -8]],        // WALK_SOFT_204: on the middle line of the way in the wall (the curve leaned to its side)
            [7.6, [-1.5, YW, -7.5], [-1.5, F + 3, 0]],
            [9.0, [-2.6, YW, -1.2], [0.6, F + 2.9, -0.5]],      // KOHEN_ACTOR_211: toward the priest at the outer doors
            [10.6, [-3.4, YW, 1.0], [1.0, F + 3.0, -0.3]]      // WALK_END_211
          ]
        };
        const PCAP = {
          rabbanan: [[0, "״נטל את המפתח ופתח את הפשפש, ונכנס להתא, ומהתא להיכל״ (מידות ד, ב)"],
                     [4.4, "בקרן מזרחית צפונית: ״אחד לתא מן הימין, ואחד לתא שעל גביו, ואחד למסבה, ואחד לפשפש, ואחד להיכל״ (מידות ד, ג)"]],
          yehuda: [[0, "״נטל את המפתח ופתח את הפשפש״ (מידות ד, ב)"],
                   [3.8, "רבי יהודה: ״בתוך עביו של כתל היה מהלך, עד שנמצא עומד בין שני השערים״ (מידות ד, ב)"]]
        };
        const doorN = () => ctx2.__pishDoorN;
        // KOHEN_ACTOR_211: THE PRIEST'S OWN WAY after the locks (the walk's written seconds): to the door, a push as it swings in, and on
        // AHEAD OF THE EYE - the Sages: through the wall into the cell, by its door into the heichal, to the inner doors' lock; R. Yehuda:
        // in the wall's thickness, out into the doorway between the two gates, to the outer doors' lock. There the great gate's own
        // demonstration takes him over (kohGate). Until 2.0.1 no one was drawn: the eye was the priest's
        const KWAY = {
          rabbanan: [[LT + 1.5, 2.0, -19], [LT + 2.4, -2.0, -19], [LT + 3.0, -5.0, -19.1], [LT + 3.4, -6.5, -18.6], [LT + 4.0, -6.5, -16.0], [LT + 5.0, -6.5, -13.0], [LT + 7.0, -6.5, -7.5],
                     [LT + 7.5, -6.8, -5.6], [LT + 8.4, -6.6, -2.6], [LT + 9.2, -5.6, -1.05]],
          yehuda: [[LT + 1.5, 2.0, -19], [LT + 2.3, -1.0, -19], [LT + 2.7, -1.5, -18.2], [LT + 3.8, -1.5, -14.6], [LT + 4.4, -1.5, -12.6], [LT + 6.8, -1.5, -4.2], [LT + 7.6, -0.9, -2.0],
                   [LT + 8.2, -0.1, -1.05]]
        };
        const kE = (u) => (u <= 0 ? 0 : u >= 1 ? 1 : 0.5 - 0.5 * Math.cos(Math.PI * u)), k01 = (t, a2, b2) => Math.min(1, Math.max(0, (t - a2) / (b2 - a2)));
        const kline = (pts, t) => {
          if (t <= pts[0][0]) return [pts[0][1], pts[0][2]];
          for (let i = 0; i + 1 < pts.length; i++) if (t <= pts[i + 1][0]) { const u = (t - pts[i][0]) / Math.max(1e-6, pts[i + 1][0] - pts[i][0]); return [pts[i][1] + (pts[i + 1][1] - pts[i][1]) * u, pts[i][2] + (pts[i + 1][2] - pts[i][2]) * u]; }
          const Lp = pts[pts.length - 1];
          return [Lp[1], Lp[2]];
        };
        const kvw = new Vector3();
        const kohWicket = (t) => {
          if (t <= LT) { KOH.pose(PL.koh(t)); return; }
          const way = KWAY[D.mode], end = way[way.length - 1], o = { y: F, base: "hold", key: true };
          if (t < LT + 1.5) {
            const s0 = PL.koh(LT), u = kE(k01(t, LT, LT + 0.55)), v = k01(t, LT + 0.55, LT + 1.5), d = doorN();
            o.x = s0.x + (2.45 - s0.x) * u - 0.45 * v;
            o.z = s0.z + (-19 - s0.z) * u;
            o.yaw = -Math.PI / 2;
            if (d) { d.updateWorldMatrix(true, false); o.armR = { p: d.localToWorld(kvw.set(0.14, 2.3, 2.2)).toArray(), w: Math.min(k01(t, LT + 0.45, LT + 0.75), 1 - k01(t, LT + 1.15, LT + 1.45)) }; }
          } else {
            const p = kline(way, t);
            o.x = p[0];
            o.z = p[1];
            if (t >= end[0] - 0.05) o.yaw = Math.PI / 2;   // at the lock: his face to the doors
          }
          KOH.pose(o);
        };
        ctx2.shared.pishpeshDemo = (mode) => {
          const W = ctx2.shared.pishpeshWay;
          if (W) W.set(mode || W.mode);
          D.mode = W ? W.mode : "rabbanan";
          mk.visible = false;
          capG.forEach((c) => (c.visible = false));
          root.visible = false;
          const G = ctx2.shared.greatGate, gk = D.mode === "yehuda" ? "yehuda" : "tk";
          if (G) { G.stop(); G.set(gk); G.prep(false); D.gateShut = true; }   // the four doors shut before he comes (1.9.3: gateShut - put back if the walk is stopped before their turn)
          if (doorN()) doorN().rotation.y = 0;
          const tail = G ? G.walkKeys(gk).slice(1).map(([t, e2, l2]) => [t + PW_END, e2, l2]) : [];
          const tcap = G ? G.walkCaps(gk).map(([t, txt]) => [t + PW_END, txt]) : [];
          // 1.9.2: first the keys, in the reading chosen in the row "המפתח שיורד לאמת השחי" (PL), then the old walk from the door on
          const lm = PL.mode, lc = LOCK_CAM[lm];
          PL.walking();
          const keys = [PWALK0[D.mode][0], [1.0, lc[0], lc[1]], [LT - 0.2, lc[0], lc[1]]].concat(shiftK(PWALK0[D.mode].slice(1), LT - 0.8));
          const caps = [[0, "״ושני מפתחות, אחד יורד לאמת השחי ואחד פותח כיון״ (תמיד ג, ו)"]].concat(LOCK_CAP[lm], shiftK(PCAP[D.mode].map(([t, x]) => [t, x, null]), LT - 0.8).map(([t, x]) => [t, x]));
          D.t0 = performance.now() + DW.LEAD * SLOW * 1000;
          if (G && G.sfx) {
            const at = (t) => (DW.LEAD + t) * SLOW;
            if (lm === "rambam") { G.sfx.click(at(2.15)); G.sfx.click(at(4.05)); } else G.sfx.click(at(2.95));
            G.sfx.scrape(at(LT + 0.25), 0.9 * SLOW);
          }
          DW.run(keys.concat(tail), caps.concat(tcap), () => ctx2.shared.pishpeshStop(true),
            [[PW_END, () => { D.gateShut = false; if (G) { D.gateRun = true; G.demo(gk, false); } }]], { soft: true, from: LT + 0.4, count: keys.length });   // WALK_SOFT_204: the walk's own legs; the gate's views after them as written
        };
        ctx2.shared.pishpeshDemoBoth = () => ctx2.shared.pishpeshDemo();   // (1.9.1's name: the chosen way now)
        DEMO_STOPS.push({ id: "hei-pish-demo", running: () => D.t0 >= 0, stop: () => ctx2.shared.pishpeshStop(),
          // DEMO_PAUSE_207: the keys' and the bar's sounds wait (the gate's audio context); its clock is the walk's (DW.now stands), or its own
          pause: () => { if (D.t0 < 0 || D.pausedAt != null) return; D.pausedAt = performance.now(); const G = ctx2.shared.greatGate; if (G && G.sfx && G.sfx.suspend) G.sfx.suspend(); },
          resume: () => { if (D.pausedAt == null) return; if (!DW.on) D.t0 += performance.now() - D.pausedAt; D.pausedAt = null; const G = ctx2.shared.greatGate; if (G && G.sfx && G.sfx.resume) G.sfx.resume(); },
          paused: () => D.pausedAt != null });
        ctx2.shared.pishpeshStop = (fromWalk) => {
          D.seq = null; D.t0 = -1; D.pausedAt = null; mk.visible = false; capG.forEach((c) => (c.visible = false));   // DEMO_PAUSE_207: D.pausedAt
          PL.hide();
          if (doorN()) doorN().rotation.y = -Math.PI / 2;
          // 1.9.3 (the full scan: a demonstration stopped before the doors' turn left the great gate shut and barred - the walk shuts the
          // four doors at its start): the gate back as it stands, unless its own demonstration runs (it stops itself)
          // (D.gateShut: the walk shut the doors and their own turn has not begun - a stop of the walk itself comes here as its end,
          // fromWalk, so the flag and not fromWalk tells it from the walk's own end)
          const G = ctx2.shared.greatGate;
          // SFX_STOP_205 b (the user, 12.11.2026: "אחרי הדגמה של הפשפש שלא הסתיימה (עצרתי בכח) הקול של הדלתות נשאר"): the walk hands on to the
          // great gate's own demonstration (D.gateRun); the walk's pill stopped only the walk - the doors went on opening, with their
          // sounds, timed ahead. A stop of the walk now stops the doors it started, and every sound still to come
          if (!fromWalk) { if (D.gateRun && G && G.t0 >= 0) G.stop(); if (G && G.sfx) G.sfx.stop(); }
          D.gateRun = false;
          if (D.gateShut) { D.gateShut = false; if (G && !(G.t0 >= 0)) G.stop(); }
          if (!(G && G.t0 >= 0)) KOH.hide();   // KOHEN_ACTOR_211
          if (!fromWalk) DW.stop();
        };
        {
          const MB = Array.isArray(ctx2.shared.modelButtons) ? ctx2.shared.modelButtons : (ctx2.shared.modelButtons = []);
          const anc = [2.8, F + 9.6, -19];
          MB.push({
            id: "hei-pish-demo", label: "הדגמה: הכניסה בפשפש", labelOn: "עצור את ההדגמה", maxDist: 80,   // 1.9.2: near it and seen only
            title: "הכהן נוטל את המפתח ופותח את הפשפש (מידות ד, ב) — בהליכה, בגובה העיניים, בדרך שנבחרה בתפריט, תחת ״שיטות ומחלוקות״: לחכמים — לתא, ומן התא להיכל; לרבי יהודה — בתוך עובי הכותל, עד בין שני השערים. בסוף נפתחות ארבע הדלתות של השער הגדול.",
            anchor: () => {
              const p = ctx2.camera && ctx2.camera.position;
              return p && p.x > -10 && p.x < 60 && Math.abs(p.z) < 52 && p.y < F + 60 ? anc : null;
            },
            get: () => D.t0 >= 0,
            set: (on) => { if (on) ctx2.shared.pishpeshDemo(); else ctx2.shared.pishpeshStop(); }
          });
        }
        const DUR = 9000;
        const placeAt = (u) => {
          const pts = WAYS[D.mode];
          const L = [];
          let tot = 0;
          for (let i = 0; i + 1 < pts.length; i++) { const d = Math.hypot(pts[i + 1][0] - pts[i][0], pts[i + 1][1] - pts[i][1]); L.push(d); tot += d; }
          let rem = Math.min(1, Math.max(0, u)) * tot, k = 0;
          while (k < L.length - 1 && rem > L[k]) { rem -= L[k]; k++; }
          const f = L[k] ? Math.min(1, rem / L[k]) : 1;
          mk.position.set(pts[k][0] + (pts[k + 1][0] - pts[k][0]) * f, F + 0.05, pts[k][1] + (pts[k + 1][1] - pts[k][1]) * f);
          mk.rotation.y = -Math.atan2(pts[k + 1][1] - pts[k][1], pts[k + 1][0] - pts[k][0]);
          const stage = u < 0.12 ? 0 : u < 0.7 ? 1 : 2;
          capG.forEach((c, i) => (c.visible = i === stage));
        };
        ctx2.shared.pishpeshPose = (mode, u) => { const W = ctx2.shared.pishpeshWay; if (W) W.set(mode); D.mode = W ? W.mode : "rabbanan"; D.t0 = -1; mk.visible = true; if (ctx2.shared.pishTunnel) ctx2.shared.pishTunnel(D.mode === "yehuda"); placeAt(u); };   // a still frame
        ctx2.animated.push(() => {
          if (D.t0 < 0) return;
          const t = DW.on ? DW.now() : ((D.pausedAt != null ? D.pausedAt : performance.now()) - D.t0) / 1000 / SLOW;   // DEMO_PAUSE_207
          void 0;   // from the walk's own start (after its lead-in), in demo seconds (WALK_SOFT_204: the walk's written second - a turn given more time holds this clock too)
          const d = doorN();
          if (d) { const u = Math.min(1, Math.max(0, (t - (LT + 0.2)) / 1.4)); d.rotation.y = -Math.PI / 2 * (0.5 - 0.5 * Math.cos(Math.PI * u)); }
          PL.pose(t);   // 1.9.2: the hand and the keys
          { const G0 = ctx2.shared.greatGate; if (!(G0 && G0.t0 >= 0)) kohWicket(t); }   // KOHEN_ACTOR_211 (from the great gate's own start: kohGate)
        });
      }
      ctx2.shared.features = ctx2.shared.features || {};
      ctx2.shared.features.pishWay = { key: "pishWay", isOn: () => root.visible, on: () => { root.visible = true; }, off: () => { root.visible = false; } };
    }
    // 1.4.0: the cedar beams across the ulam, from the house's wall (x 1.5) to the ulam's front wall (x 12.5), near its ceiling (Middot 3:8)
    const beamG = new CylinderGeometry(0.35, 0.35, 11, 10);
    beamG.rotateZ(Math.PI / 2);
    instMesh(g, beamG, M2.cedar, [-30, -15, 0, 15, 30].map((z) => m4(7, 60.5, z)));
    ctx2.labels.push({ text: "כלונסות של ארז — שלא יבעט", x: 7, y: 61.8, z: -15, size: 1.1 });
    const chainG = new CylinderGeometry(0.07, 0.07, 24, 8);
    instMesh(
      g,
      chainG,
      M2.gold,
      [m4(7, 52, -21), m4(7, 52, 21), m4(7, 52, -25), m4(7, 52, 25)],
      false
    );
    // 1.3.0: the menorah, the table and the golden altar are built by 45-vessels.js (the First Temple plugin's models, one of each)
    // 1.9.3: the parochot stand on the sloping floor (shorter by its rise there), and THE INNER PAROCHET'S HEAD IS BENT a little toward
    // the Holy of Holies (the user, of the kuntres, point 26: "עשה כך") - Sukkah 7b "ורבנן? ההוא דניכוף ביה פורתא, דמחזי כסכך" (108, line
    // 189); Rashi "ליכוף בה - למעלה פורתא כעין גג יעשה ממקצתה" (2163, line 263). The top two amot lean 60 degrees - a model choice.
    const PAR_Y = FL + houseRise(-45), PAR_H = 39.9 - houseRise(-45), PAR_BEND = 2;
    const parOut = H2.box(g, 0.12, PAR_H, 18.4, M2.parochet, -44.5, PAR_Y, -0.8);
    const parIn = H2.box(g, 0.12, PAR_H - PAR_BEND, 18.4, M2.parochet, -45.5, PAR_Y, 0.8);
    let parFlap = null;
    {
      const fg = new BoxGeometry(0.12, 2.4, 18.4);
      fg.translate(0, 1.2, 0);
      const flap = parFlap = new Mesh(fg, M2.parochet);
      flap.position.set(-45.5, PAR_Y + PAR_H - PAR_BEND, 0.8);
      flap.rotation.z = Math.PI / 3;
      flap.castShadow = flap.receiveShadow = true;
      g.add(flap);
    }
    // 1.8.0 (the user: "תחפש אם היו איורים על הפרוכות"): THE FIGURES WOVEN IN THE PAROCHOT - a drawn reading (ctx2.shared.parochetArt). The
    // parochet is "מעשה חושב" (Exodus 26:31); Yoma 72b: "חושב — מעשה אורג, לפיכך שני פרצופות". Rashi there: "שתי צורות על שתי קירותיה אין
    // דומות זו לזו פעמים שמצד זה ארי ומצד זה נשר" - "rashi": eagles toward the heichal and lions toward the devir, as the user chose for the
    // First Temple's parochet (B1 K.4); the Rambam (Kelei HaMikdash 8:15, as the Mishneh LaMelech reads him; the Jerusalem Talmud, Shekalim 8:4,
    // one view): one figure seen from both sides - "rambam": lions, mirrored on the far face as a woven figure is; "keruvim": cherubim, as the
    // Torah's parochet "כרבים" (Exodus 26:31; II Chronicles 3:14) - the Mishneh LaMelech asks why the Rambam left them out; "plain": no figures
    // (the Ma'asei LaMelech, Kelei HaMikdash 8:15, quoting a book: in the Second Temple the doubt of the amah traksin made two parochot, "ולא הי׳
    // יכול לעשות כרובים שלא ידעו איזה הפרוכת העקרי"). The figures and the weave are the First Temple plugin's (int_parochetTex);
    // the cherubim drawn here (a standing figure with a child's face and raised wings) in the weave's purple; their size and spacing - model choices.
    {
      const S = 512, TILE = 4, A = S / TILE;
      const mk = (w, h) => { const c = document.createElement("canvas"); c.width = w; c.height = h; return c; };
      const bg = mk(S, S), b = bg.getContext("2d");
      b.fillStyle = "#d66a7c"; b.fillRect(0, 0, S, S);
      const tints = ["178,30,60", "243,166,178", "122,62,142", "62,80,162", "248,240,230"];
      for (let i = 0; i < 200; i++) {
        const x = hash(i * 1.37) * S, y = hash(i * 2.71) * S, rx = 11 + hash(i * 3.13) * 50, ry = 2.5 + hash(i * 4.91) * 7.5, rot = (hash(i * 5.33) - 0.5) * 0.7;
        b.fillStyle = "rgba(" + tints[i % 5] + "," + (0.1 + hash(i * 6.17) * 0.2).toFixed(3) + ")";
        for (const ox of [-S, 0, S]) for (const oy of [-S, 0, S]) {
          const cx = x + ox, cy = y + oy;
          if (cx + rx < 0 || cx - rx > S || cy + rx < 0 || cy - rx > S) continue;
          b.beginPath(); b.ellipse(cx, cy, rx, ry, rot, 0, Math.PI * 2); b.fill();
        }
      }
      b.fillStyle = "rgba(84,16,38,0.08)";
      for (let y = 0; y < S; y += 3) b.fillRect(0, y, S, 1);
      b.fillStyle = "rgba(255,236,240,0.06)";
      for (let x = 0; x < S; x += 3) b.fillRect(x, 0, 1, S);
      const FIG = "#5c2c80", FIG_D = "#3c1858", FIG_L = "#9a6cbc";
      const eagle = mk(320, 300), e = eagle.getContext("2d");
      e.lineJoin = "round"; e.lineCap = "round"; e.fillStyle = FIG; e.strokeStyle = FIG_D; e.lineWidth = 4;
      for (const sd of [-1, 1]) {
        const X = (x) => 160 + sd * (x - 160);
        e.beginPath();
        e.moveTo(X(146), 118);
        e.quadraticCurveTo(X(118), 52, X(64), 30);
        e.quadraticCurveTo(X(30), 18, X(8), 10);
        for (const [px, py] of [[22, 36], [6, 44], [30, 62], [12, 74], [40, 88], [24, 104], [56, 112], [44, 130], [76, 134], [70, 152], [104, 150], [104, 166], [142, 160]]) e.lineTo(X(px), py);
        e.closePath(); e.fill(); e.stroke();
        e.save(); e.strokeStyle = FIG_L; e.lineWidth = 2.2;
        e.beginPath(); e.moveTo(X(140), 112); e.quadraticCurveTo(X(110), 70, X(60), 46); e.stroke();
        for (const [x1, y1] of [[24, 40], [30, 66], [42, 92], [58, 116], [78, 138], [104, 154]]) { e.beginPath(); e.moveTo(X(118), 96 + (y1 - 40) * 0.35); e.lineTo(X(x1 + 8), y1 + 2); e.stroke(); }
        e.restore();
      }
      e.beginPath(); e.moveTo(142, 186); e.lineTo(178, 186);
      for (const [px, py] of [[204, 262], [188, 252], [176, 274], [166, 256], [160, 280], [154, 256], [144, 274], [132, 252], [116, 262]]) e.lineTo(px, py);
      e.closePath(); e.fill(); e.stroke();
      e.beginPath(); e.ellipse(160, 146, 26, 54, 0, 0, Math.PI * 2); e.fill(); e.stroke();
      for (const sd of [-1, 1]) {
        e.beginPath(); e.moveTo(160 + sd * 12, 190); e.lineTo(160 + sd * 22, 222); e.lineWidth = 8; e.strokeStyle = FIG; e.stroke();
        e.lineWidth = 3.5; e.strokeStyle = FIG_D;
        for (const d of [-9, 0, 9]) { e.beginPath(); e.moveTo(160 + sd * 22, 222); e.quadraticCurveTo(160 + sd * 22 + d, 228, 160 + sd * 22 + d * 1.2, 236); e.stroke(); }
      }
      e.lineWidth = 4;
      e.beginPath(); e.ellipse(162, 80, 20, 22, 0, 0, Math.PI * 2); e.fill(); e.stroke();
      e.beginPath(); e.moveTo(176, 70); e.quadraticCurveTo(206, 68, 204, 94); e.quadraticCurveTo(196, 84, 180, 90); e.closePath(); e.fill(); e.stroke();
      e.fillStyle = FIG_L; e.beginPath(); e.arc(170, 74, 3.8, 0, Math.PI * 2); e.fill();
      e.strokeStyle = FIG_L; e.lineWidth = 2; e.beginPath(); e.moveTo(146, 108); e.quadraticCurveTo(160, 118, 174, 108); e.stroke();
      const lion = mk(340, 240), l = lion.getContext("2d");
      l.lineJoin = "round"; l.lineCap = "round"; l.fillStyle = FIG; l.strokeStyle = FIG_D; l.lineWidth = 4;
      const leg = (x0, y0, x1, w0, w1) => {
        l.beginPath(); l.moveTo(x0 - w0 / 2, y0); l.lineTo(x0 + w0 / 2, y0); l.lineTo(x1 + w1 / 2, 204); l.lineTo(x1 - w1 / 2, 204); l.closePath(); l.fill(); l.stroke();
        l.beginPath(); l.ellipse(x1 + 6, 206, w1 * 0.85, 8, 0, 0, Math.PI * 2); l.fill(); l.stroke();
      };
      leg(92, 118, 72, 30, 18); leg(226, 118, 250, 28, 18);
      l.beginPath(); l.moveTo(66, 100); l.bezierCurveTo(30, 108, 34, 160, 14, 150); l.lineWidth = 9; l.strokeStyle = FIG; l.stroke();
      l.lineWidth = 4; l.strokeStyle = FIG_D;
      l.beginPath(); l.ellipse(14, 146, 11, 15, 0.3, 0, Math.PI * 2); l.fill(); l.stroke();
      l.beginPath();
      l.moveTo(64, 96); l.quadraticCurveTo(70, 72, 110, 76); l.quadraticCurveTo(160, 82, 206, 70); l.quadraticCurveTo(246, 74, 248, 120);
      l.quadraticCurveTo(240, 148, 206, 142); l.quadraticCurveTo(150, 136, 104, 144); l.quadraticCurveTo(62, 146, 64, 96); l.closePath(); l.fill(); l.stroke();
      leg(114, 126, 102, 32, 20); leg(210, 126, 222, 32, 20);
      l.beginPath();
      for (let k = 0; k <= 30; k++) {
        const a = k / 30 * Math.PI * 2, r = k % 2 ? 58 : 44, px = 250 + Math.cos(a) * r, py = 88 + Math.sin(a) * r * 0.92;
        if (k) l.lineTo(px, py); else l.moveTo(px, py);
      }
      l.closePath(); l.fill(); l.stroke();
      l.beginPath(); l.ellipse(276, 94, 30, 27, 0, 0, Math.PI * 2); l.fill(); l.stroke();
      l.beginPath(); l.ellipse(306, 106, 20, 15, 0.12, 0, Math.PI * 2); l.fill(); l.stroke();
      l.beginPath(); l.moveTo(258, 70); l.lineTo(264, 52); l.lineTo(274, 68); l.closePath(); l.fill(); l.stroke();
      l.fillStyle = FIG_L; l.beginPath(); l.ellipse(290, 86, 4.5, 3.5, 0, 0, Math.PI * 2); l.fill();
      l.strokeStyle = FIG_L; l.lineWidth = 2.2;
      l.beginPath(); l.moveTo(300, 118); l.quadraticCurveTo(310, 124, 322, 114); l.stroke();
      for (let k = 0; k < 10; k++) { const a = k / 10 * Math.PI * 2; l.beginPath(); l.moveTo(250 + Math.cos(a) * 34, 88 + Math.sin(a) * 32); l.lineTo(250 + Math.cos(a) * 52, 88 + Math.sin(a) * 48); l.stroke(); }
      l.beginPath(); l.moveTo(120, 100); l.quadraticCurveTo(150, 112, 196, 100); l.stroke();
      // the cherubim (model choice, as no source draws them): a standing figure with a child's face (Sukkah 5b "כרוב — כרביא"), its two wings
      // raised and spread up behind it, a long robe; drawn once on a 300 x 320 canvas, facing the viewer
      const cherub = mk(300, 320), q = cherub.getContext("2d");
      q.lineJoin = "round"; q.lineCap = "round"; q.fillStyle = FIG; q.strokeStyle = FIG_D; q.lineWidth = 4;
      for (const sd of [-1, 1]) {                                          // the wings: from the shoulders up and out, the feathers along the lower edge
        const X = (x) => 150 + sd * (x - 150);
        q.beginPath(); q.moveTo(X(160), 128);
        q.quadraticCurveTo(X(210), 40, X(290), 18);
        for (const [px, py] of [[276, 46], [292, 60], [268, 80], [282, 98], [252, 112], [262, 132], [228, 140], [232, 160], [198, 158]]) q.lineTo(X(px), py);
        q.closePath(); q.fill(); q.stroke();
        q.save(); q.strokeStyle = FIG_L; q.lineWidth = 2.2;
        for (const [x1, y1] of [[270, 40], [262, 70], [244, 100], [222, 126], [200, 146]]) { q.beginPath(); q.moveTo(X(178), 132); q.lineTo(X(x1), y1); q.stroke(); }
        q.restore();
      }
      q.beginPath();                                                       // the robe
      q.moveTo(130, 118); q.lineTo(170, 118); q.quadraticCurveTo(196, 200, 206, 300); q.lineTo(94, 300); q.quadraticCurveTo(104, 200, 130, 118);
      q.closePath(); q.fill(); q.stroke();
      q.save(); q.strokeStyle = FIG_L; q.lineWidth = 2.2;
      for (const dx of [-24, -8, 8, 24]) { q.beginPath(); q.moveTo(150 + dx * 0.4, 140); q.quadraticCurveTo(150 + dx, 220, 150 + dx * 1.6, 296); q.stroke(); }
      q.restore();
      q.beginPath(); q.ellipse(150, 92, 24, 27, 0, 0, Math.PI * 2); q.fill(); q.stroke();   // the head
      q.fillStyle = FIG_L;                                                 // the face: eyes, cheeks, mouth
      q.beginPath(); q.arc(141, 90, 3.6, 0, Math.PI * 2); q.arc(159, 90, 3.6, 0, Math.PI * 2); q.fill();
      q.strokeStyle = FIG_L; q.lineWidth = 2.2; q.beginPath(); q.moveTo(142, 104); q.quadraticCurveTo(150, 109, 158, 104); q.stroke();
      q.strokeStyle = FIG_D; q.lineWidth = 3; q.beginPath(); q.arc(150, 84, 26, Math.PI * 1.08, Math.PI * 1.92); q.stroke();   // the hair
      const face = (fig, fw) => {
        const c = mk(S, S), x = c.getContext("2d");
        x.drawImage(bg, 0, 0);
        if (fig) {
          const w = fw * A, h = w * fig.height / fig.width, step = S / 3;
          for (let r = 0; r < 3; r++) for (let k = 0; k < 3; k++) x.drawImage(fig, (k + 0.5) * step - w / 2, (r + 0.5) * step - h / 2, w, h);
        }
        return c;
      };
      const mirror = (cv) => { const m = mk(cv.width, cv.height), x = m.getContext("2d"); x.translate(cv.width, 0); x.scale(-1, 1); x.drawImage(cv, 0, 0); return m; };
      const tex = (cv) => {
        const t = new CanvasTexture(cv);
        t.wrapS = t.wrapT = RepeatWrapping;
        t.colorSpace = SRGBColorSpace;
        t.anisotropy = 8;
        t.repeat.set(18.4 / TILE, 39.9 / TILE);
        return t;
      };
      const T = { eagle: tex(face(eagle, 1.15)), lionW: tex(face(mirror(lion), 1.2)), lionE: tex(face(lion, 1.2)), plain: tex(face(null)) };
      T.cherub = tex(face(cherub, 1.1));
      const mat = (t) => new MeshStandardMaterial({ map: t, roughness: 0.95, metalness: 0 });
      const M = { eagle: mat(T.eagle), lionW: mat(T.lionW), lionE: mat(T.lionE), cherub: mat(T.cherub), plain: mat(T.plain) };
      if (parFlap) { const tf = T.plain.clone(); tf.repeat.set(18.4 / TILE, 2.4 / TILE); tf.needsUpdate = true; parFlap.material = mat(tf); }   // 1.9.3: the bent head, in the weave
      const faces = [];   // [mesh, side]: side +1 = the face toward the heichal (east), -1 = toward the devir (west)
      const geoF = new PlaneGeometry(18.4, 39.9);
      for (const [x, z, hh] of [[-44.5, -0.8, PAR_H], [-45.5, 0.8, PAR_H - PAR_BEND]]) for (const sd of [1, -1]) {   // 1.9.3: each parochet's own height
        const m = new Mesh(geoF, M.plain);
        m.scale.y = hh / 39.9;
        m.rotation.y = sd > 0 ? Math.PI / 2 : -Math.PI / 2;
        m.position.set(x + sd * 0.065, PAR_Y + hh / 2, z);
        m.receiveShadow = true;
        g.add(m);
        faces.push([m, sd]);
      }
      ctx2.shared.parochetArt = {
        mode: "rashi",
        set(k) {
          this.mode = ["rashi", "rambam", "keruvim", "plain"].indexOf(k) >= 0 ? k : "rashi";
          for (const [m, sd] of faces) {
            m.material = this.mode === "rashi" ? (sd > 0 ? M.eagle : M.lionW) : this.mode === "rambam" ? (sd > 0 ? M.lionE : M.lionW) : this.mode === "keruvim" ? M.cherub : M.plain;
          }
        }
      };
      ctx2.shared.parochetArt.set("rashi");
      // PAR_COUNT_211 (2.0.2; the user, of Yoma 5:1: "תוסיף את שיטת ר' יוסי"): R. YOSE'S SINGLE PAROCHET, a drawn option. "רבי יוסי אומר, לא
      // היתה שם אלא פרכת אחת בלבד" (Mishnah Yoma 5:1). Its place - the Yachin there: "ס"ל דעובי אותה אמה כלפנים"; the Lechem Shamayim (Middot
      // 4:5): "לא מפסקא פרוכת אלא בצד אחד (דהיינו כפי הנראה צד החיצון)" - so it hangs on the HEICHAL'S side of the amah. Its opening - Yoma 51b:
      // "אמר רב חסדא: רבי יוסי היא, דאמר: פיתחא בצפון קאי". In the model the inner parochet (already open at the north, its head bent) moves one
      // amah east and the outer one is put away; "two" brings both back.
      ctx2.shared.parochotCount = {
        mode: "two",
        set(k) {
          const one = k === "one";
          this.mode = one ? "one" : "two";
          const x = one ? -44.5 : -45.5;
          parOut.visible = !one;
          parIn.position.x = x;
          if (parFlap) parFlap.position.x = x;
          faces[0][0].visible = faces[1][0].visible = !one;
          faces[2][0].position.x = x + 0.065;
          faces[3][0].position.x = x - 0.065;
        }
      };
    }
    // ===== YK_211 (2.0.2; round 211, Batch 1 of tools211/SOURCES_211.md - the Yom Kippur points 2-5) =====
    // What is seen only on Yom Kippur is OFF until its place or its opinions row is chosen (the user: "ברירת מחדל כבוי (נראלי ששיך רק
    // ביוהכ)"): the features rovad4 / kanim / machtot (not timed: they go back when another place is chosen), and the High Priest's walk
    // to between the parochot (ctx2.shared.ykEntry). Every source below was read in the library (book:line).
    {
      ctx2.shared.features = ctx2.shared.features || {};
      const FY = (x) => F + houseRise(x);
      const lblY = (text, x, y, z, size, layers, rim) => ctx2.labels.push({ text, x, y, z, size, box: true, rim: rim || "#e2a400", onTop: true, far: 260, layers });
      const feat = (key, grp, also) => { ctx2.shared.features[key] = { key, timed: false, isOn: () => grp.visible, on: () => { grp.visible = true; if (also) also(true); }, off: () => { grp.visible = false; if (also) also(false); } }; };
      const noP = (m) => { m.userData.noPick = true; return m; };
      const goldRed = new MeshStandardMaterial({ color: 0xf0a060, roughness: 0.34, metalness: 0.5, envMapIntensity: 1.3, emissive: 0x6a2a0c, emissiveIntensity: 0.5 });      // "והיום אדום"
      const goldGreen = new MeshStandardMaterial({ color: 0xe6e07a, roughness: 0.34, metalness: 0.5, envMapIntensity: 1.3, emissive: 0x4a4a10, emissiveIntensity: 0.45 });    // "זהבה ירוק"
      const silverM = new MeshStandardMaterial({ color: 0xe6eaee, roughness: 0.32, metalness: 0.5, envMapIntensity: 1.3, emissive: 0x4a5058, emissiveIntensity: 0.45 });
      const coalM = new MeshStandardMaterial({ color: 0x6b1a08, emissive: 0xff4a12, emissiveIntensity: 0.95, roughness: 0.9 });
      const bloodM = new MeshStandardMaterial({ color: 0x7a0f12, roughness: 0.35 });
      const incM = new MeshStandardMaterial({ color: 0xf1ead8, roughness: 0.95 });
      const mizrak = (parent, x, y, z) => {   // a golden bowl and the blood in it
        noP(H2.lathe(parent, [[0, 0], [0.07, 0], [0.1, 0.03], [0.2, 0.16], [0.215, 0.17], [0.19, 0.17], [0.09, 0.045], [0, 0.04]], M2.gold, x, y, z, 20));
        noP(H2.cyl(parent, 0.172, 0.172, 0.012, bloodM, x, y + 0.13, z, 18));
      };
      // an open pan: w across (x), d along (z), h high, its walls th thick; (x, y, z) - the middle of its floor's underside
      const pan = (grp, mat, w, h, d, th, x, y, z) => {
        const add = (bw, bh, bd, bx, by, bz) => { const m = noP(new Mesh(new BoxGeometry(bw, bh, bd), mat)); m.position.set(x + bx, y + by, z + bz); m.castShadow = true; grp.add(m); };
        add(w, th, d, 0, th / 2, 0);
        add(th, h, d, -w / 2 + th / 2, h / 2, 0);
        add(th, h, d, w / 2 - th / 2, h / 2, 0);
        add(w, h, th, 0, h / 2, -d / 2 + th / 2);
        add(w, h, th, 0, h / 2, d / 2 - th / 2);
      };
      const part = (grp, geo, mat, x, y, z) => { const m = noP(new Mesh(geo, mat)); m.position.set(x, y, z); m.castShadow = true; grp.add(m); return m; };

      // ---------- 1. THE FOURTH ROVAD (Mishnah Yoma 4:3, 55:33: "ונתנו למי שהוא ממרס בו על הרבד הרביעי שבהיכל... והניחה על הרבד הרביעי
      // שבעזרה"; Yoma 43b, 107:1100: "והכתיב וכל אדם לא יהיה באהל מועד? אמר רב יהודה: תני של היכל"). The user: "תסמן את שניהם" - the two
      // countings that the Tosafot Rid names (2109:135): "אי קדושת היכל ואולם חדא הוא מונה מפתח האולם ולחוץ ואי שתי קדושות הן מונה
      // מפתח ההיכל ולחוץ". (a) blue - from the heichal's doorway outward, in the ulam (the Yachin's words, 762:371: "על השורה הד' שבאבני
      // הרצפה מפתח ההיכל ולחוץ"); (b) orange - from the ulam's doorway outward (the Tosafot Yom Tov for the Bartenura, 898:130: "דאולם
      // והיכל חדא קדושה ואולם נמי אוהל מועד מיקרי"; the Meiri, 2199:386: "באותו תחום שבין האולם למזבח"). A row's breadth is not
      // stated: one amah (a model choice); rows 1-3 pale, the fourth strong; a priest with the bowl stands on each ("ושם עומד הממרס
      // בו", Bartenura 582:168).
      {
        const R4 = new Group();
        R4.name = "rovad4";
        R4.visible = false;
        g.add(R4);
        ctx2.layers.rovad4 = R4;
        const mk = (col, op) => new MeshBasicMaterial({ color: col, transparent: true, opacity: op, depthWrite: false });
        const A1 = mk(0x2f7fe0, 0.66), A0 = mk(0x2f7fe0, 0.17), B1 = mk(0xf08a1c, 0.7), B0 = mk(0xf08a1c, 0.18);
        const strip = (parent, mat, x0, x1, y, zw) => { const m = noP(new Mesh(new BoxGeometry(x1 - x0 - 0.05, 0.04, zw), mat)); m.position.set((x0 + x1) / 2, y + 0.03, 0); m.renderOrder = 6; parent.add(m); };
        const UF = F + 0.07;   // the ulam's paving lies 0.07 over the block
        for (let i = 0; i < 4; i++) strip(R4, i === 3 ? A1 : A0, 1.5 + i, 2.5 + i, UF + 0.005, 10);           // (a): the ulam's floor, x 1.5..12.5
        const bFlat = new Group(), bRam = new Group(), figA = new Group(), figB = new Group();
        R4.add(bFlat, bRam, figA, figB);
        for (let i = 0; i < 4; i++) strip(bFlat, i === 3 ? B1 : B0, 17.5 + i, 18.5 + i, F, 10);               // (b): the top landing (four amot in the Bartenura's and the Tiferet Yisrael's steps)
        for (let i = 0; i < 8; i++) strip(bRam, i >= 6 ? B1 : B0, 17.5 + i * 0.5, 18 + i * 0.5, F - i * 0.5, 10);   // the Rambam's steps: treads of half an amah, two to a row
        const PPL = typeof tm_people === "function" ? tm_people(ctx2) : null, WEST = -Math.PI / 2;
        if (PPL) {
          PPL.crowd(figA, [[5, 0, WEST]], { y: UF, s: 1.4, pose: "stand", kind: "kohen", robe: 0xf1ede2, tone: () => 1, name: "memares-a" });
          PPL.crowd(figB, [[21, 0, WEST]], { y: F, s: 1.4, pose: "stand", kind: "kohen", robe: 0xf1ede2, tone: () => 2, name: "memares-b" });
        }
        mizrak(figA, 5 - 0.5, UF + 1.9, 0);
        mizrak(figB, 21 - 0.5, F + 1.9, 0);
        const stepsNow = () => { const r = !!(ctx2.shared.ulamSteps && ctx2.shared.ulamSteps.mode === "rambam"); bRam.visible = r; bFlat.visible = !r; figB.position.set(r ? -0.25 : 0, r ? -3.0 : 0, 0); };
        stepsNow();
        if (ctx2.shared.ulamSteps) { const s0 = ctx2.shared.ulamSteps.set; ctx2.shared.ulamSteps.set = function (m) { s0.call(this, m); stepsNow(); }; }
        // (c) green - THE FIREPAN'S ROVAD, counted from his coming down the ramp (TYT_KEVESH; the user, 08:33: "למה לא?"): the Tosafot Yom
        // Tov (898:133): "לכאורה היינו דבין רישא לסיפא דברישא הוא מונה מהיכל ולחוץ והכא מונה מירידתו מן הכבש והוא פונה למול ההיכל" - he
        // comes down in the ramp's middle (Yoma 4:5, 55:35: "והיום כהן גדול עולה באמצע ויורד באמצע"), turns to face the heichal (west),
        // and the fourth row from there; the firepan of coals lies on it. Where the counting starts and the rows' length - model choices.
        {
          // In the model the ramp's foot reaches the building south of it (the south chambers): he steps off the ramp on its WEST side,
          // by its foot, his face to the heichal, and the rows are counted from the ramp's west edge (x 47.5) - model choices.
          const C1 = mk(0x2fa84f, 0.7), C0 = mk(0x2fa84f, 0.18), cG = new Group(), XF = 47.5 + 3, ZF = 42.6 - 3.1;
          R4.add(cG);
          for (let i = 0; i < 4; i++) { const m = noP(new Mesh(new BoxGeometry(0.95, 0.04, 4), i === 3 ? C1 : C0)); m.position.set(XF - 3.5 - i, AZ + 0.03, ZF); m.renderOrder = 6; cG.add(m); }
          const mq = new Group();
          mq.position.set(XF - 6.5, AZ + 0.05, ZF);
          mq.rotation.y = Math.PI / 2;
          cG.add(mq);
          pan(mq, goldRed, 0.46, 0.18, 0.56, 0.018, 0, 0, 0);
          part(mq, new BoxGeometry(0.05, 0.04, 0.95), goldRed, 0, 0.11, -0.755);
          part(mq, new BoxGeometry(0.42, 0.05, 0.52), coalM, 0, 0.1, 0);
          lblY("הרובד הרביעי של המחתה — ״מירידתו מן הכבש״ (תוספות יום טוב: ״לכאורה״)", XF - 6.5, AZ + 3.0, ZF, 1.0, ["rovad4"], "#2fa84f");
          // the ramp goes with the altar: its place in the court (ctx2.shared.altarPlace - the Tannaim's dispute; the ramp's numbers
          // above are in the altar's own frame, which the place moves by dz in z: 12.5 for the Mishnah, the default) and R. Yose's first
          // altar (ctx2.shared.altarMeasures: the ramp 2 east and 4 north) - the counting, its firepan and its label go with its foot
          const am = ctx2.shared.altarMeasures, ap = ctx2.shared.altarPlace, gLbl = ctx2.labels[ctx2.labels.length - 1];
          const gBase = [gLbl.x, gLbl.y, gLbl.z];
          const syncG = () => {
            const y = !!am && (am.mode === "yose" || am.current === "yose"), dz = (ap && ap.dz && ap.dz[ap.current]) || 0;
            const dx = y ? 2 : 0, z = dz + (y ? -4 : 0), ox = gLbl.x, oy = gLbl.y, oz = gLbl.z, fy = ctx2.shared.floorY;
            let yy = 0;   // the court's paving there is a little higher than AZ (16.3 by the ramp's foot): the rows lie on it
            if (typeof fy === "function") { const h = fy(XF - 5 + dx, AZ + 4, ZF + z); if (isFinite(h) && h >= AZ - 0.01 && h < AZ + 1.5) yy = h - AZ; }
            cG.position.set(dx, yy, z);
            gLbl.x = gBase[0] + dx; gLbl.y = gBase[1] + yy; gLbl.z = gBase[2] + z;
            let lg = null;
            try { lg = ctx2.root.getObjectByName("labels"); } catch (_) {}
            if (lg) for (const spr of lg.children) {
              if ((spr.userData && spr.userData.label === gLbl) || (Math.abs(spr.position.x - ox) < 1e-3 && Math.abs(spr.position.y - oy) < 1e-3 && Math.abs(spr.position.z - oz) < 1e-3)) { spr.position.set(gLbl.x, gLbl.y, gLbl.z); break; }
            }
          };
          if (am && typeof am.set === "function") { const s0 = am.set; am.set = function (...q) { const r = s0.apply(this, q); syncG(); return r; }; }
          if (ap && typeof ap.set === "function") { const s1 = ap.set; ap.set = function (...q) { const r = s1.apply(this, q); syncG(); return r; }; }
          syncG();
        }
        lblY("הרובד הרביעי — ״מפתח ההיכל ולחוץ״", 5, F + 4.7, 0, 1.0, ["rovad4"], "#2f7fe0");
        lblY("הרובד הרביעי — ״מפתח האולם ולחוץ״", 21, F + 4.7, 0, 1.0, ["rovad4"], "#f08a1c");
        feat("rovad4", R4);
      }

      // ---------- 2. THE GOLDEN STANDS (Mishnah Yoma 5:3-4, 55:40-41: "יצא והניחו על כן הזהב שבהיכל... יצא והניחו על כן השני שהיה
      // בהיכל. רבי יהודה אומר, לא היה שם אלא כן אחד בלבד"; Yoma 55b, 107:1444). Where in the heichal, their form and height are not
      // stated - before the parochet, a little south of the middle: model choices. ctx2.shared.kanim.set(1 | 2).
      {
        const KN = new Group(), second = new Group(), oneG = new Group();
        KN.name = "kanim";
        KN.visible = false;
        oneG.visible = false;
        g.add(KN);
        KN.add(second, oneG);
        ctx2.layers.kanim = KN;
        ctx2.layers.kanimTwo = second;
        ctx2.layers.kanimOne = oneG;
        const KX = -42, KZ = [2.3, 3.9], KH = 1.5, ky = FY(KX);
        const stand = (parent, z) => {
          noP(H2.lathe(parent, [[0, 0], [0.34, 0], [0.36, 0.05], [0.2, 0.12], [0.09, 0.2], [0.07, KH * 0.5], [0.11, KH * 0.56], [0.07, KH * 0.62], [0.08, KH - 0.14], [0.22, KH - 0.05], [0.27, KH], [0, KH]], M2.gold, KX, ky, z, 22));
          mizrak(parent, KX, ky + KH, z);
        };
        stand(KN, KZ[0]);
        stand(second, KZ[1]);
        lblY("כן הזהב — דם הפר", KX, ky + KH + 0.95, KZ[0] - 0.9, 0.8, ["kanim", "kanimTwo"]);   // NOTE 9 (U-57, 3): nearer the stands
        lblY("הכן השני — דם השעיר", KX, ky + KH + 0.6, KZ[1] + 1.0, 0.8, ["kanim", "kanimTwo"]);
        lblY("כן אחד בלבד — רבי יהודה", KX, ky + KH + 0.8, KZ[0], 0.8, ["kanim", "kanimOne"]);
        ctx2.shared.kanim = { count: 2, set(n) { this.count = n === 1 ? 1 : 2; second.visible = this.count === 2; oneG.visible = this.count === 1; } };
        feat("kanim", KN);
      }

      // ---------- 3. THE THREE FIREPANS (Mishnah Yoma 4:4, 55:34: "בכל יום היה חותה בשל כסף ומערה בתוך של זהב, והיום חותה בשל זהב
      // ובה היה מכניס. בכל יום חותה בשל ארבעת קבין ומערה בתוך של שלשת קבין... בכל יום היתה כבדה, והיום קלה. בכל יום היתה ידה קצרה,
      // והיום ארכה. בכל יום היה זהבה ירוק, והיום אדם"; Yoma 44b, 107:1129-1130: "גלדה עבה, והיום רך"; "והיום היה לה ניאשתיק" - Rashi
      // 2157:1718 "טבעת בראשה"). Side by side on the court's floor by the altar's south-west corner, only to be compared: their
      // measures in amot, the forms and the place - model choices.
      {
        const MG = new Group();
        MG.name = "machtot";
        MG.visible = false;
        g.add(MG);
        ctx2.layers.machtot = MG;
        const MX = 39.0, MY = AZ, MZ = [18.4, 20.0, 21.6];
        // (the pans lie along x, their handles to the west)
        const one = (z, mat, w, d, h, th, handle, coals, ring) => {
          const q = new Group();
          q.position.set(MX, MY, z);
          q.rotation.y = Math.PI / 2;          // the pan's own z -> the world's x; its handle (toward -z) -> the west
          MG.add(q);
          pan(q, mat, w, h, d, th, 0, 0, 0);
          part(q, new BoxGeometry(0.05, 0.04, handle), mat, 0, h * 0.62, -d / 2 - handle / 2);
          if (coals) part(q, new BoxGeometry(w - 2 * th - 0.02, 0.05, d - 2 * th - 0.02), coalM, 0, h * 0.55, 0);
          if (ring) { const r = part(q, new TorusGeometry(0.06, 0.014, 8, 18), mat, 0, h * 0.62 - 0.065, -d / 2 - handle); r.rotation.y = Math.PI / 2; }
        };
        one(MZ[0], silverM, 0.5, 0.62, 0.2, 0.045, 0.34, false, false);      // every day: of silver, four kav
        one(MZ[1], goldGreen, 0.46, 0.56, 0.18, 0.045, 0.34, true, false);    // every day: of gold, three kav, thick, a short handle
        one(MZ[2], goldRed, 0.46, 0.56, 0.18, 0.018, 0.95, true, true);       // the day's: of red gold, three kav, thin, a long handle, the ring
        // PAN_NUMBERS_211 (the understandability review, U-46): from the place's eye each label, floating over its pan, stood beside the
        // NEXT pan (and the Yom Kippur one's beside the shitin's slab) - a pupil read all three wrongly. Each pan has a small number
        // plate right on it now, and each label opens with its pan's number.
        lblY("1 · בכל יום — של כסף, ארבעת קבין", MX + 0.3, MY + 0.95, MZ[0], 0.4, ["machtot"]);
        lblY("2 · בכל יום — של זהב, שלושת קבין", MX + 0.3, MY + 1.4, MZ[1], 0.4, ["machtot"]);
        lblY("3 · ביום הכיפורים — זהב אדום, ידה ארוכה", MX + 0.3, MY + 1.85, MZ[2], 0.4, ["machtot"]);
        ["1", "2", "3"].forEach((n, i) => lblY(n, MX, MY + 0.42, MZ[i], 0.3, ["machtot"]));
        // by the altar's west face wherever its place in the court is (ctx2.shared.altarPlace: drawn for the Mishnah's, dz 12.5)
        {
          const ap = ctx2.shared.altarPlace, L3 = ctx2.labels.slice(-3), B3 = L3.map((l) => l.z);
          const syncM = () => {
            const z = ((ap && ap.dz && ap.dz[ap.current]) || 12.5) - 12.5;
            MG.position.z = z;
            let lg = null;
            try { lg = ctx2.root.getObjectByName("labels"); } catch (_) {}
            L3.forEach((l, i) => {
              const oz = l.z;
              l.z = B3[i] + z;
              if (lg) for (const spr of lg.children) {
                if ((spr.userData && spr.userData.label === l) || (Math.abs(spr.position.x - l.x) < 1e-3 && Math.abs(spr.position.y - l.y) < 1e-3 && Math.abs(spr.position.z - oz) < 1e-3)) { spr.position.z = l.z; break; }
              }
            });
          };
          if (ap && typeof ap.set === "function") { const s1 = ap.set; ap.set = function (...q) { const r = s1.apply(this, q); syncM(); return r; }; }
          syncM();
        }
        feat("machtot", MG);
      }

      // ---------- 4. THE HIGH PRIEST'S WAY TO BETWEEN THE PAROCHOT, WALKED (Mishnah Yoma 5:1, 55:38; the user: "מצוין"). The priest of
      // the wicket's walk (KOH) in a white sash, the firepan in his right hand and the spoon in his left. Two parochot (the default):
      // "בין המזבח למנורה היה מהלך, דברי רבי יהודה" (Yoma 51b, 107:1318-1319: "פיתחא בדרום קאי"; so the Tosefta, Yoma 2:11) - to the
      // outer parochet's opening in the south, between the two northward, and in by the inner one's opening. One parochet (R. Yose,
      // the row "הפרוכות — שתיים או אחת"): "ויש אומרים: בין שלחן לכותל... רבי יוסי היא, דאמר: פיתחא בצפון קאי". THE EYE DOES NOT ENTER
      // the Holy of Holies and the cloud stays (the model's rule): he goes into it and is seen no more; "יצא ובא לו בדרך בית כניסתו" -
      // backward, his face to the Holy of Holies (the Meiri, 2199:419: "שהיה יוצא אחורנית ופניו כלפי קדש הקדשים") - "ומתפלל תפלה קצרה
      // בבית החיצון". His hands are empty then: the spoon and the pan stay inside until he comes for them (Yoma 7:4). The speed, the
      // eye's way, where he stands to pray - model choices.
      {
        const Y = { t0: -1, mode: "two" };
        let props = null;
        const mkProps = () => {
          const r = new Group(), l = new Group();
          r.rotation.x = l.rotation.x = 1.55;   // (the forearm lies forward: the hand's frame back to his own)
          part(r, new BoxGeometry(0.045, 0.035, 0.95), goldRed, 0, -0.1, -0.03);
          pan(r, goldRed, 0.4, 0.13, 0.46, 0.02, 0, -0.14, 0.66);
          part(r, new BoxGeometry(0.34, 0.05, 0.4), coalM, 0, -0.06, 0.66);
          part(l, new BoxGeometry(0.035, 0.03, 0.3), M2.gold, 0, -0.03, 0.08);
          noP(H2.lathe(l, [[0, 0], [0.06, 0], [0.13, 0.07], [0.145, 0.085], [0.12, 0.085], [0.05, 0.03], [0, 0.03]], M2.gold, 0, -0.07, 0.3, 16));
          const heap = part(l, new SphereGeometry(0.11, 12, 8), incM, 0, 0.02, 0.3);
          heap.scale.set(1, 0.55, 1);
          return { r, l };
        };
        const E = (x, h) => F + houseRise(Math.min(-4.5, x)) + h;
        const NORTH = Math.PI, WESTY = -Math.PI / 2;
        const PATH = {
          two: [[0, -7.5, 1.2], [3.0, -17, 2.8], [7.5, -33.5, 3.3], [9.3, -40.0, 5.6], [10.6, -43.3, 8.6], [11.4, -44.95, 9.25], [12.2, -45.0, 8.2], [17.4, -45.0, -8.4], [18.0, -45.15, -9.25], [18.8, -46.5, -9.25], [19.6, -46.7, -8.0]],
          one: [[0, -7.5, -1.2], [1.6, -11.5, -6.6], [2.5, -14.0, -8.8], [11.6, -43.2, -8.9], [12.4, -44.9, -9.25], [13.1, -45.1, -8.4], [15.8, -45.1, -0.5], [16.6, -46.7, 0]]
        };
        const BACK = {
          two: [[26.0, -45.0, 3.0, NORTH], [28.0, -45.0, 9.25, NORTH], [28.8, -43.6, 9.0, WESTY], [30.0, -41.6, 7.0, WESTY]],
          one: [[20.0, -45.1, -5.0, 0], [21.2, -45.1, -9.25, 0], [22.0, -43.5, -9.0, WESTY], [23.2, -41.6, -7.6, WESTY]]
        };
        const KEYS = {
          two: [
            [0, [-5.6, E(-5.6, 3.6), -1.6], [-12, E(-12, 2.4), 1.8]],
            [3.0, [-11.0, E(-11, 3.6), -0.6], [-19, E(-19, 2.3), 2.8]],
            [7.5, [-26.5, E(-26.5, 3.7), 0.2], [-35, E(-35, 2.3), 3.4]],
            [9.3, [-33.5, E(-33.5, 3.7), 1.4], [-41, E(-41, 2.3), 6.2]],
            [10.8, [-38.5, E(-38.5, 3.7), 4.2], [-44.6, E(-44.6, 2.3), 9.0]],
            [12.2, [-41.8, E(-41.8, 3.5), 7.6], [-45.0, E(-45, 2.3), 8.2]],
            [13.2, [-44.1, E(-44.1, 3.4), 9.3], [-45.0, E(-45, 2.3), 3.5]],
            [14.2, [-44.86, E(-45, 3.3), 9.55], [-45.0, E(-45, 2.3), -9]],
            [15.4, [-44.98, E(-45, 3.3), 8.9], [-45.0, E(-45, 2.3), -9]],     // (a key more: the curve swung west of the amah's middle, into the inner parochet)
            [19.0, [-44.98, E(-45, 3.3), 5.5], [-45.25, E(-45, 2.3), -9.3]],
            [21.4, [-44.98, E(-45, 3.3), 5.5], [-45.25, E(-45, 2.3), -9.3]],
            [22.8, [-44.9, E(-45, 3.3), 9.4], [-45.0, E(-45, 2.3), 2]],
            [24.2, [-43.4, E(-43.4, 3.4), 9.15], [-44.9, E(-45, 2.3), 9.6]],
            [25.6, [-39.5, E(-39.5, 3.6), 4.5], [-44.6, E(-44.6, 2.3), 9.0]],
            [29.5, [-37.8, E(-37.8, 3.6), 3.4], [-42.0, E(-42, 2.3), 7.0]],
            [31.5, [-37.8, E(-37.8, 3.6), 3.4], [-42.0, E(-42, 2.3), 7.0]]
          ],
          one: [
            [0, [-5.6, E(-5.6, 3.6), 2.2], [-11, E(-11, 2.4), -4.5]],
            [2.5, [-9.0, E(-9, 3.6), -3.0], [-17, E(-17, 2.3), -8.8]],
            [7.0, [-22.0, E(-22, 3.7), -5.2], [-31, E(-31, 2.3), -8.8]],
            [11.0, [-36.5, E(-36.5, 3.7), -3.6], [-44.3, E(-44.3, 2.3), -9.0]],
            [13.0, [-40.6, E(-40.6, 3.5), -7.4], [-45.2, E(-45, 2.3), -9.1]],
            [18.4, [-40.9, E(-40.9, 3.5), -7.2], [-45.2, E(-45, 2.3), -9.1]],
            [19.6, [-38.5, E(-38.5, 3.6), -4.0], [-44.4, E(-44.4, 2.3), -9.0]],
            [24.4, [-37.6, E(-37.6, 3.6), -3.2], [-42.0, E(-42, 2.3), -7.6]],
            [26.4, [-37.6, E(-37.6, 3.6), -3.2], [-42.0, E(-42, 2.3), -7.6]]
          ]
        };
        const C0 = "״נטל את המחתה בימינו ואת הכף בשמאלו. היה מהלך בהיכל״ (יומא ה, א)";
        // YK_CAPS_211 (the understandability review, U-24; told to the user, 15.11.2026 18:36): (1) THIS IS THE SECOND TEMPLE - the Mishnah's
        // "עד שהוא מגיע לארון... בין שני הבדים" was shown as it stands, and a pupil learned that an ark stood there. The Mishnah's own
        // next words are shown now - "משנטל הארון, אבן היתה שם מימות נביאים ראשונים, ושתיה היתה נקראת, גבוהה מן הארץ שלש אצבעות, ועליה
        // היה נותן" (Yoma 5:2; 55:39) - and the Gemara's "מקום ארון" (Yoma 52b; 107:1349). (2) the captions were too short to read (22
        // words of Mishnah for under six seconds): the long one is two captions, the earlier ones start sooner, and the High Priest stays
        // inside longer (HOLD written seconds: the eye waits, and everything after it moves on by as much).
        const C_ARON = "״הגיע לצפון, הופך פניו לדרום, מהלך לשמאלו עם הפרכת עד שהוא מגיע לארון״ — ובבית שני: ״מקום ארון״ (יומא נב:)";
        const C_EVEN = "״משנטל הארון, אבן היתה שם מימות נביאים ראשונים, ושתיה היתה נקראת, גבוהה מן הארץ שלש אצבעות, ועליה היה נותן״ (יומא ה, ב)";
        const C_IN = "״צבר את הקטרת על גבי גחלים, ונתמלא כל הבית כלו עשן״";
        const C_OUT = "״יצא ובא לו בדרך בית כניסתו, ומתפלל תפלה קצרה בבית החיצון, ולא היה מאריך בתפלתו, שלא להבעית את ישראל״";
        const HOLD = { two: 4, one: 4.6 }, HOLD_FROM = { two: 21.4, one: 18.4 };
        for (const k of ["two", "one"]) {
          const h = HOLD[k], K = KEYS[k], i = K.findIndex((q) => q[0] === HOLD_FROM[k]);
          KEYS[k] = K.slice(0, i + 1).concat([[HOLD_FROM[k] + h, K[i][1], K[i][2]]], K.slice(i + 1).map((q) => [q[0] + h, q[1], q[2]]));
          BACK[k] = BACK[k].map((q) => [q[0] + h, q[1], q[2], q[3]]);
        }
        const CAPS = {
          two: [[0, C0], [4.0, "״בין המזבח למנורה היה מהלך, דברי רבי יהודה״ (יומא נא:)"],
                [7.6, "״עד שמגיע לבין שתי הפרכות המבדילות בין הקדש ובין קדש הקדשים, וביניהן אמה״"],
                [10.6, "״החיצונה היתה פרופה מן הדרום, והפנימית מן הצפון״"],
                [13.2, "״מהלך ביניהן, עד שמגיע לצפון״"],
                [16.2, C_ARON],
                [20.4, C_EVEN], [20.4 + 4.2, C_IN], [24.2 + HOLD.two, C_OUT]],
          one: [[0, C0], [3.2, "״ויש אומרים: בין שלחן לכותל... רבי יוסי היא, דאמר: פיתחא בצפון קאי״ (יומא נא:)"],
                [9.0, "״רבי יוסי אומר, לא היתה שם אלא פרכת אחת בלבד״ — ופתחה בצפון"],
                [12.4, C_ARON.replace("״הגיע לצפון, הופך", "״הופך")],
                [16.4, C_EVEN], [16.4 + 4.2, C_IN], [19.4 + HOLD.one, C_OUT]]
        };
        const at = (pts, t) => {
          if (t <= pts[0][0]) return pts[0];
          for (let i = 0; i + 1 < pts.length; i++) if (t <= pts[i + 1][0]) { const a = pts[i], b = pts[i + 1], u = (t - a[0]) / Math.max(1e-6, b[0] - a[0]); return [t, a[1] + (b[1] - a[1]) * u, a[2] + (b[2] - a[2]) * u, b[3]]; }
          return pts[pts.length - 1];
        };
        // YK_SOLOMON_215 (the user, 16.11.2026 21:43: "אפשרות ב"): Solomon's ten vessels (the row "שולחנות שלמה ומנורותיו") are hidden
        // while he walks - his way stays as it is - and back at the end (45-vessels.js, solomonVessels.hold)
        const solHold = (on) => { const S = ctx2.shared.solomonVessels; if (S && typeof S.hold === "function") { try { S.hold(on); } catch (_) {} } };
        Y.stop = (fromWalk) => {
          if (Y.t0 < 0) return;
          Y.t0 = -1;
          KOH.hide();
          solHold(false);
          if (!fromWalk) DW.stop();
        };
        Y.start = () => {
          Y.stop();
          solHold(true);
          Y.mode = ctx2.shared.parochotCount && ctx2.shared.parochotCount.mode === "one" ? "one" : "two";
          if (!props) props = mkProps();
          DW.run(KEYS[Y.mode], CAPS[Y.mode], () => Y.stop(true));
          Y.t0 = performance.now();
        };
        Object.defineProperty(Y, "on", { get: () => Y.t0 >= 0 });
        ctx2.shared.ykEntry = Y;
        ctx2.animated.push(() => {
          if (Y.t0 < 0) return;
          if (!DW.on) { Y.stop(true); return; }
          const t = DW.now(), P = PATH[Y.mode], B = BACK[Y.mode], tin = P[P.length - 1][0];
          if (t <= tin + 0.45) {
            const p = at(P, Math.max(0, t)), o = { x: p[1], y: FY(p[1]), z: p[2], base: "carry", white: true, props };
            if (t <= 0.05) o.yaw = Math.atan2(P[1][1] - P[0][1], P[1][2] - P[0][2]);
            KOH.pose(o);
          } else if (t < B[0][0]) KOH.hide();
          else { const p = at(B, t); KOH.pose({ x: p[1], y: FY(p[1]), z: p[2], yaw: p[3] == null ? B[0][3] : p[3], white: true }); }
        });
        DEMO_STOPS.push({ id: "hei-yk-entry", running: () => Y.t0 >= 0, stop: () => Y.stop() });
        const MBy = Array.isArray(ctx2.shared.modelButtons) ? ctx2.shared.modelButtons : (ctx2.shared.modelButtons = []);
        const ANC = [-40.5, FY(-40.5) + 8.2, 0];
        MBy.push({
          id: "hei-yk-entry", label: "הדגמה: הכהן הגדול נכנס בקטורת", labelOn: "עצור את ההדגמה", maxDist: 60,
          title: "ביום הכיפורים: הכהן הגדול, המחתה בימינו והכף בשמאלו, מהלך בהיכל עד שמגיע לבין שתי הפרוכות (יומא ה, א) — בדרך שנבחרה במתג ״הפרוכות — שתיים או אחת״. המבט אינו נכנס לקודש הקדשים.",
          anchor: () => { const p = ctx2.camera && ctx2.camera.position; return p && p.x < -4.5 && p.x > -46 && Math.abs(p.z) < 10 && p.y > F && p.y < F + 46 ? ANC : null; },
          get: () => Y.t0 >= 0,
          set: (on) => { if (on) Y.start(); else Y.stop(); }
        });
      }
    }
    const rockMat = M2.stone.clone();
    rockMat.color = new Color(12167564);
    const rock = new Mesh(new DodecahedronGeometry(1.3, 0), rockMat);
    rock.scale.set(1, 0.1, 1.15);   // 1.1.0: "גבוהה מן הארץ שלש אצבעות" (Yoma 5:2) = 3/24 amah; the rock is 1.3 r -> 0.13 high
    rock.rotation.y = 0.4;
    rock.position.set(-61.5, F + 0.08 + houseRise(-61.5), 0);   // 1.3.0: in the WEST of the room (Rambam 4:1 "במערבו"; the room x -65.5..-45.5); until 1.2.0 at its middle (-55.5)
    rock.castShadow = rock.receiveShadow = true;
    g.add(rock);
    const kodeshLight = new PointLight(16767392, 12, 50, 1.8);
    kodeshLight.position.set(-35, 42, 0);
    g.add(kodeshLight);
    ctx2.labels.push(
      { text: "ההיכל", x: -32.5, y: 124, z: 0, size: 8 },
      { text: "האולם", x: 7, y: 55, z: 0, size: 3.5 },
      { text: "הקודש", x: -25, y: 45, z: 0, size: 3 },
      { text: "קודש הקדשים", x: -55.5, y: 40, z: 0, size: 3 },
      { text: "הגפן של זהב", x: 2.5, y: 46.5, z: 0, size: 2.5 },
      { text: "אבן השתייה", x: -61.5, y: 24.5 + houseRise(-61.5), z: 0, size: 2.5 }
    );
    ctx2.shared.flyPoints = ctx2.shared.flyPoints || {};
    Object.assign(ctx2.shared.flyPoints, {
      heichalFront: { pos: [112, 118, 112], target: [-22, 52, 0] },   // 1.2.0: from the south-east above (the whole house, its south face free for the pill "פתח את ההיכל")
      heichalInside: { pos: [9, 32, 0], target: [-30, 30, 0] },       // 1.5.0 (the user: "ההיכל - למה מציג מבחוץ?"): from the ulam, through the great gate, into the Kodesh
      ulam: { pos: [9, 165, 28], target: [7, 30, 0] },                 // 1.9.2 (the user: "האולם שיהיה תצוגה מלמעלה"): over the ulam, the ceiling opened (the place); from
                                                                          // the east the front (to 115) hid the inside - here the eye looks down through the open roof
      kodesh: { pos: [-6, 38, 0], target: [-30, 27, 0] },
      kodeshHakodashim: { pos: [-47, 34, 6], target: [-61.5, 23.5, -1] }
    });
    for (const m of cut) ctx2.cutaway.push(m);
    ctx2.cutawayReady = true;   // 1.9.0: a reading of the cells built later puts its south part straight into ctx2.cutaway
    // 1.2.0: for the UI engine (the cloud over the Holy of Holies, the pill "פתח את ההיכל" on the south face)
    ctx2.shared.devirCenter = { x: -55.5, y: LV.HEI + 20, z: 0 };
    ctx2.shared.anchors = Object.assign(ctx2.shared.anchors || {}, { houseSouth: [-32, LV.HEI + 26, 35.5] });
    // 1.9.1 (the user: "הצגת שער העליון צריך לעשות מבט שיכלול את כל השערים"): the house stands 100 high in the middle of the court and
    // hides the gates behind it from every side - the house can turn to glass for a while (one pale transparent material over all of
    // its meshes; the old ones are kept and put back): ctx2.shared.houseGhost.set(on)
    {
      const ghostMat = new MeshStandardMaterial({ color: 0xf3ead6, transparent: true, opacity: 0.16, depthWrite: false, roughness: 1 });
      ctx2.shared.houseGhost = {
        on: false, saved: null,
        set(on) {
          on = !!on;
          if (on === this.on) return;
          this.on = on;
          if (on) {
            this.saved = [];
            g.traverse((o) => { if ((o.isMesh || o.isInstancedMesh) && o.material) { this.saved.push([o, o.material, o.castShadow]); o.material = ghostMat; o.castShadow = false; } });
          } else {
            for (const [o, m, cs] of this.saved || []) { o.material = m; o.castShadow = cs; }
            this.saved = null;
          }
        }
      };
    }
    NEDOOR.ready();   // 1.9.2: the house is whole - the door of the north-east cell finds the pieces it cuts
    LULHOLE.ready();   // 1.9.3
    ctx2.shared.cellsReading.set("raavad");   // 1.9.3: the default reading whole - its cells stand where the common otem block gives way
  }

