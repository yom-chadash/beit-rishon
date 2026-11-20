  // ===== 46-shitin.js (DAVID_SHITIN_305, 1.4.14): "בשעה שכרה דוד שיתין" - THE DEEP AND THE FIFTEEN SONGS OF ASCENTS =====
  // The user, 19.11.2026 21:10 ("דוד קרא את השיתין, תראה את גרסת הבבלי ירושלמי בכרטיס, אחיתופל תעשה חניקה, אבל עדינה"); 23:49 ("אלף
  // אמה בכל מזמור"). The demonstration follows the Bavli (Sukkah 53a-b, as the library has it, book 108, lines 1371-1375): the deep
  // rises when David digs the shitin; his question; no one answers; "יחנק בגרונו"; Ahitophel's kal vachomer and "שרי"; the shard with
  // the Name thrown in; the deep goes down 16,000 amot; the fifteen Songs of Ascents raise it 15,000 - a thousand with each (a model
  // choice: the fifteen thousand shared evenly) - and it stands at a thousand ("סומכא דארעא אלפא גרמידי", Ulla). Then Makkot 11a: "קללת
  // חכם – אפילו בחנם היא באה... ואפילו הכי כתיב ויחנק" - shown by a hint only: his hands go to his neck, his head bows, and he fades away.
  // The Yerushalmi's version (Sanhedrin 10:2: a hundred amot with each song) is in the card. In David's days there was no house and no
  // altar yet: their buildings go see-through while it runs. Under the floor, a section drawn over the picture (not hidden by what is in
  // front of it): the shaft, the water in it, a scale of a thousand amot to a mark - compressed (a thousand amot = 2 amot of the model).
  // The figures: the kit's (58-ark.js ark_kit); David in a king's garments and crown (as the king of "דבקו שערים"); Ahitophel an elder in
  // a mantle. Their places, poses and colours, the shard's form, the section's look - model choices. Runs on the walk engine
  // (50-heichal.js ctx.shared.walk). ctx.shared.davidShitin = { demo, stop, at(t) (a still for checks), T, info, refs }.
  function dsh_crown(GOLD) {   // the crown of 58-ark.js ark_kingFig (in the head's frame)
    const K = ark_kit(), crown = new Group();
    const band = new Mesh(new CylinderGeometry(0.152, 0.145, 0.072, 32, 1, true), GOLD);
    band.position.y = 0.112;
    crown.add(band);
    const ptG = new ConeGeometry(0.03, 0.085, 4), ballG = new SphereGeometry(0.014, 8, 6), gemG = new SphereGeometry(0.0125, 8, 6);
    const RED = K.mat(0xb3122e, { roughness: 0.25, emissive: 0x3a0610 }), GREEN = K.mat(0x1f7a3d, { roughness: 0.25, emissive: 0x062a12 });
    for (let i = 0; i < 8; i++) {
      const a = (i / 8) * K.TAU, x = Math.sin(a), z = Math.cos(a);
      const pt = new Mesh(ptG, GOLD);
      pt.position.set(x * 0.149, 0.19, z * 0.149);
      pt.rotation.y = a;
      crown.add(pt);
      const ball = new Mesh(ballG, GOLD);
      ball.position.set(x * 0.149, 0.238, z * 0.149);
      crown.add(ball);
      const b2 = a + Math.PI / 8, gem = new Mesh(gemG, i % 2 ? GREEN : RED);
      gem.position.set(Math.sin(b2) * 0.152, 0.112, Math.cos(b2) * 0.152);
      crown.add(gem);
    }
    crown.scale.set(1, 1, 1.08);
    crown.traverse((o) => { if (o.isMesh) o.userData.noPick = true; });
    return crown;
  }
  // a standing man of the kit (his face +z): the robe, a mantle from the shoulders round the back to the floor, a belt, the head (its
  // beard), a crown and kippah or a cap; the arms with elbows (ark_setArm); the neck's pivot NK (the head bows there: NK.rotation.x)
  function dsh_fig(o) {
    const K = ark_kit(), KG = ark_kitArms(), FS = K.FS, NKY = 1.86;
    const g = new Group(), lean = new Group();
    g.add(lean);
    const S = new Group();
    S.scale.setScalar(FS);
    lean.add(S);
    const add = (par, geo, mat) => { const m = new Mesh(geo, mat); m.castShadow = true; m.userData.noPick = true; par.add(m); return m; };
    add(S, K.gRobeBody, o.robe);
    add(S, K.surf(30, 26, (u, v, q) => {   // as 60-palace.js pal_kingFig's standing mantle
      const a = Math.PI + (u - 0.5) * 2.3, low = Math.pow(1 - v, 2), fold = Math.sin(9 * a + 1.3) * (1 - v) * 0.027;
      const y = 0.07 + v * (1.79 - 0.07), yb = Math.max(0.1, y);
      q.x = (K.spl(K.bX, yb) + 0.036 + 0.05 * low + fold) * Math.sin(a);
      q.z = (K.spl(K.bZ, yb) + 0.042 + 0.1 * low + fold) * Math.cos(a);
      q.y = y;
      q.c = 0.88 + 0.12 * Math.sin(9 * a + 1.3);
      q.tu = u;
      q.tv = v;
    }, true), o.mantle);
    add(S, K.gSash, o.belt);
    const NK = new Group();
    NK.position.y = NKY;
    S.add(NK);
    add(NK, KG.neck, K.mSkin).position.y = -NKY;
    const hg = K.headOn(NK, K.HEAD_Y - NKY, o.beard, o.k || 0);
    hg.rotation.y = o.turn || 0;
    if (o.crown) { hg.add(ark_kingKippah(o.gold)); hg.add(dsh_crown(o.gold)); }
    else if (o.cap) { const c = add(NK, K.gCap, o.cap); c.position.y = K.HEAD_Y - NKY; }
    hg.traverse((m) => { if (m.isMesh) m.userData.noPick = true; });
    const arm = (side) => {
      const sh = new Group();
      sh.position.set(side * KG.P.sx, KG.P.sy, 0);
      lean.add(sh);
      add(sh, KG.upP, o.robe);
      const el = new Group();
      el.position.y = -KG.P.up;
      sh.add(el);
      add(el, KG.foP, o.robe);
      add(el, KG.handP[side], K.mSkin);
      const grip = new Group();
      grip.position.set(0, -(KG.P.fo + 0.08), 0.03);
      el.add(grip);
      return { sh, el, grip, side };
    };
    const L = arm(1), R = arm(-1);
    for (const side of [1, -1]) add(g, KG.foot[side], K.mSkin).position.x = side * 0.1 * FS;
    ark_setArm(L, ARK_POSE.stand, 1);
    ark_setArm(R, ARK_POSE.stand, -1);
    return { g, lean, NK, L, R };
  }
  // a line of Hebrew on a sprite (the section's words; drawn once)
  function dsh_text(text, o) {
    o = o || {};
    const px = o.px || 52, pad = 14, cv = document.createElement("canvas"), c = cv.getContext("2d");
    const font = (o.bold === false ? "" : "bold ") + px + "px 'Segoe UI', Arial, sans-serif";
    c.font = font;
    const w = Math.ceil(c.measureText(text).width) + pad * 2, h = Math.ceil(px * 1.5) + pad;
    cv.width = w;
    cv.height = h;
    c.font = font;
    if (o.bg) { c.fillStyle = o.bg; const r = 12; c.beginPath(); c.moveTo(r, 0); c.arcTo(w, 0, w, h, r); c.arcTo(w, h, 0, h, r); c.arcTo(0, h, 0, 0, r); c.arcTo(0, 0, w, 0, r); c.fill(); }
    c.fillStyle = o.color || "#f4ead0";
    c.textAlign = "center";
    c.textBaseline = "middle";
    c.direction = "rtl";
    c.fillText(text, w / 2, h / 2 + 1);
    const t = new CanvasTexture(cv);
    t.colorSpace = SRGBColorSpace;
    const m = new SpriteMaterial({ map: t, transparent: true, depthTest: false, depthWrite: false });
    const s = new Sprite(m);
    const H = o.h || 0.9;
    s.scale.set(H * w / h, H, 1);
    s.center.set(o.cx == null ? 0.5 : o.cx, o.cy == null ? 0.5 : o.cy);
    s.renderOrder = 74;
    s.userData.noPick = true;
    return s;
  }
  async function buildShitinDemo(ctx) {
    const M2 = ctx.M, F = ctx.LV.AZ, GOLD = M2.gold;
    const W = () => ctx.shared.walk;
    const clamp = (v, a, b) => (v < a ? a : v > b ? b : v), sm = (u) => { u = clamp(u, 0, 1); return u * u * (3 - 2 * u); };
    const lerp = (a, b, u) => a + (b - a) * u, mix = (A, B, u) => A.map((v, i) => lerp(v, B[i], u));
    const span = (t, a, b) => sm((t - a) / Math.max(1e-6, b - a));
    // the beats (demo seconds; the walk runs them at ctx.shared.demoSlow, 1.5)
    const T = { dig0: 0.6, dig1: 3.6, rise0: 4.2, rise1: 6.6, well1: 9.0, ovOut: 8.8, ask: 9.8, silent: 13.4, curse: 15.4, kal: 18.8, shrei: 24.4,
      write: 26.0, ovIn: 26.6, toss: 27.6, splash: 28.9, drop0: 29.4, drop1: 33.2, said: 33.8, ps0: 37.8, psD: 1.2, rest: 55.8, coda: 62.4, neck0: 64.6,
      neck1: 66.8, fade0: 68.2, fade1: 71.0, end: 72.0 };
    T.psEnd = T.ps0 + 15 * T.psD;
    const U = 2.0, PW = 8, PH = 36, DEEP = 16.6;   // the section: a thousand amot to 2 of the model; its breadth and depth; the deep's top (thousands)
    let D = null;   // built on first use
    const build = () => {
      if (D) return D;
      const K = ark_kit();
      const g = new Group();
      g.name = "davidShitin";
      g.visible = false;
      ctx.root.add(g);
      const { mRobeK, mMantle } = ark_kingMats();
      // David in a king's garments and crown - and red-haired (the user, 20.11.2026 01:30: "דוד המלך צריך להיראות כמלך רק ג'ינג'י"): "והוא
      // אדמוני עם יפה עינים וטוב ראי" (I Samuel 16:12; 17:42 "כי היה נער ואדמני"). The shade - a model choice.
      const mHairD = K.mat(0xa5481f, { map: K.texHair, vertexColors: true, roughness: 0.95, side: DoubleSide });
      const david = dsh_fig({ robe: mRobeK, mantle: mMantle, belt: GOLD, beard: mHairD, crown: true, gold: GOLD, k: 2 });
      g.add(david.g);
      // Ahitophel: his own materials (he fades away at the end) - a robe of grey-green, a brown mantle, a grey beard, a dark cap
      const ahi = dsh_fig({ robe: K.mat(0x5d6656, { vertexColors: true, roughness: 0.9 }), mantle: K.mat(0x5a4636, { vertexColors: true, roughness: 0.92, side: DoubleSide }),
        belt: K.mat(0x3b2c20, { roughness: 0.9 }), beard: K.mBeards[1], cap: K.mat(0x2e3440, { roughness: 0.9 }), k: 5, turn: 0.08 });
      const own = new Map();
      ahi.g.traverse((m) => { if (m.isMesh) { const a = m.material; if (!own.has(a)) own.set(a, a.clone()); m.material = own.get(a); } });
      const ahiMats = [...own.values()];
      g.add(ahi.g);
      // the shard (a piece of a jar, a few dark strokes on it for the writing - not letters)
      const shard = new Group();
      {
        const clay = K.mat(0xb5653a, { roughness: 0.85, side: DoubleSide });
        const p = new Mesh(new CylinderGeometry(0.2, 0.2, 0.15, 10, 1, true, 0, 1.2), clay);
        p.rotation.z = Math.PI / 2;
        p.position.set(0, 0, -0.17);
        shard.add(p);
        const ink = new MeshBasicMaterial({ color: 0x2a1a12 });
        for (let i = 0; i < 3; i++) { const s = new Mesh(new BoxGeometry(0.008, 0.06, 0.012), ink); s.position.set(-0.03 + i * 0.03, 0, 0.024); s.rotation.z = 0.2 * (i - 1); shard.add(s); }
        shard.traverse((m) => { if (m.isMesh) m.userData.noPick = true; });
      }
      g.add(shard);
      // the water that wells up out of the shaft on the floor, and its spring
      const mW = new MeshStandardMaterial({ color: 0x3f7fc0, roughness: 0.12, metalness: 0.1, transparent: true, opacity: 0.78, depthWrite: false });
      const pool = new Mesh(new CircleGeometry(1, 40).rotateX(-Math.PI / 2), mW);
      pool.renderOrder = 3;
      g.add(pool);
      const spring = new Mesh(new SphereGeometry(1, 20, 10, 0, Math.PI * 2, 0, Math.PI / 2), mW);
      g.add(spring);
      // ---- the section (drawn over the picture): the earth's layers, the shaft, the water in it, the deep, the scale, the words
      const OV = new Group();
      OV.name = "davidShitinSection";
      g.add(OV);
      const ovM = [];   // [material, its full opacity]
      const ovMat = (color, op, map) => { const m = new MeshBasicMaterial({ color, map: map || null, transparent: true, opacity: op, depthTest: false, depthWrite: false, side: DoubleSide }); ovM.push([m, op]); return m; };
      const plane = (w, h, mat, x, y, ro) => { const m = new Mesh(new PlaneGeometry(w, h), mat); m.position.set(x, y, 0); m.renderOrder = ro; m.userData.noPick = true; OV.add(m); return m; };
      const earthTex = (() => {
        const cv = document.createElement("canvas");
        cv.width = 128;
        cv.height = 1024;
        const c = cv.getContext("2d");
        let q = 20261120 >>> 0;
        const r = () => { q = (q * 1664525 + 1013904223) >>> 0; return q / 4294967296; };
        const cols = ["#6b4b31", "#5d4129", "#735237", "#56402c", "#674a33", "#4f3a28"];
        let y = 0;
        while (y < 1024) { const h = 18 + r() * 60; c.fillStyle = cols[Math.floor(r() * cols.length)]; c.fillRect(0, y, 128, h + 1); y += h; }
        for (let i = 0; i < 900; i++) { c.fillStyle = "rgba(0,0,0," + (0.05 + r() * 0.12) + ")"; c.fillRect(r() * 128, r() * 1024, 1 + r() * 3, 1 + r() * 2); }
        const t = new CanvasTexture(cv);
        t.colorSpace = SRGBColorSpace;
        return t;
      })();
      plane(PW, PH, ovMat(0xffffff, 0.94, earthTex), 0, -PH / 2, 60);
      plane(PW + 0.3, 0.16, ovMat(0xcbb48a, 0.95), 0, 0, 61);                                  // the ground's face
      const deep = plane(PW, PH - DEEP * U, ovMat(0x1f5f9e, 0.95), 0, -(DEEP * U + PH) / 2, 62);   // the deep
      const shaft = plane(0.7, 1, ovMat(0x0f0b08, 0.97), 0, 0, 63);
      const col = plane(0.7, 1, ovMat(0x3c86d0, 0.97), 0, 0, 64);                              // the water in the shaft
      const top = plane(1.1, 0.12, ovMat(0xbfe3ff, 0.98), 0, 0, 65);                           // its face
      const oshard = plane(0.6, 0.18, ovMat(0xc56b3c, 1), 0, 0, 66);                           // the shard, in the section
      // the scale: a line, a mark at every thousand, the numbers at every two thousand
      const RX = -PW / 2 + 0.55;
      plane(0.06, 17 * U, ovMat(0xf4ead0, 0.9), RX, -17 * U / 2, 66);
      for (let k = 0; k <= 17; k++) plane(k % 2 ? 0.25 : 0.5, 0.05, ovMat(0xf4ead0, 0.9), RX + (k % 2 ? 0.12 : 0.25), -k * U, 66);
      const labs = [];
      for (let k = 2; k <= 16; k += 2) { const s = dsh_text(k.toLocaleString("en-US").replace(/\B(?=(\d{3})+(?!\d))/g, ",") + ",000".slice(0, 0), { px: 44, h: 0.8, cx: 0 }); labs.push(s); }
      labs.length = 0;   // (the numbers below, with the thousands written out)
      for (let k = 2; k <= 16; k += 2) { const s = dsh_text((k * 1000).toLocaleString("en-US"), { px: 44, h: 0.78, cx: 0 }); s.position.set(RX + 0.6, -k * U, 0); OV.add(s); s.material.opacity = 0.95; ovM.push([s.material, 0.95]); }
      { const s = dsh_text("אמות", { px: 44, h: 0.8, cx: 0 }); s.position.set(RX + 0.6, 0.7, 0); OV.add(s); ovM.push([s.material, 1]); }
      { const s = dsh_text("שנתה — אלף אמה (מכווץ)", { px: 38, h: 0.7, bg: "rgba(14,17,28,0.7)" }); s.position.set(0, -PH - 0.6, 0); OV.add(s); ovM.push([s.material, 1]); }
      { const s = dsh_text("התהום", { px: 52, h: 1.0, color: "#dff1ff" }); s.position.set(1.9, -(DEEP * U + PH) / 2, 0); OV.add(s); ovM.push([s.material, 1]); }
      // the reading beside the water's face: "פני הארץ" or its depth; the song's count during the Songs of Ascents
      const reads = [dsh_text("פני הארץ", { px: 44, h: 0.82, cx: 0, bg: "rgba(14,17,28,0.72)" })];
      for (let k = 1; k <= 16; k++) reads.push(dsh_text((k * 1000).toLocaleString("en-US") + " אמה", { px: 44, h: 0.82, cx: 0, bg: "rgba(14,17,28,0.72)" }));
      for (const s of reads) { s.visible = false; OV.add(s); ovM.push([s.material, 1]); }
      const HEB = ["קכ", "קכא", "קכב", "קכג", "קכד", "קכה", "קכו", "קכז", "קכח", "קכט", "קל", "קלא", "קלב", "קלג", "קלד"];
      const ORD = ["א׳", "ב׳", "ג׳", "ד׳", "ה׳", "ו׳", "ז׳", "ח׳", "ט׳", "י׳", "י״א", "י״ב", "י״ג", "י״ד", "ט״ו"];
      const songs = HEB.map((h, i) => dsh_text("שיר המעלות " + ORD[i] + " מתוך ט״ו (תהלים " + h + ")", { px: 44, h: 0.9, bg: "rgba(60,40,10,0.82)", color: "#ffe6a8" }));
      for (const s of songs) { s.visible = false; s.position.set(0, 5.2, 0); OV.add(s); ovM.push([s.material, 1]); }   // over the people's heads
      D = { g, david, ahi, ahiMats, shard, pool, spring, mW, OV, ovM, deep, shaft, col, top, oshard, reads, songs, H: null, saved: null, run: false, faded: [] };
      return D;
    };
    // where it stands: the west opening of the shitin (40-altar.js; R. Yose's altar moves them), the people west of it
    const place = () => {
      const v = new Vector3();
      let hit = null;
      ctx.root.traverse((o) => { if (!hit && o.name === "shitinHole" && o.visible !== false) hit = o; });
      if (hit) hit.getWorldPosition(v); else v.set(42.7, F, 21.4);
      const hx = v.x, hz = v.z;
      D.H = { hx, hz, pz: hz + 1.2, Dv: [hx - 1.0, hz - 0.8], Av: [hx - 3.2, hz - 0.25] };
      D.OV.position.set(hx, F, hz + 1.2);
      D.pool.position.set(hx, F + 0.025, hz);
      D.spring.position.set(hx, F, hz);
      D.david.g.position.set(D.H.Dv[0], F, D.H.Dv[1]);
      D.ahi.g.position.set(D.H.Av[0], F, D.H.Av[1]);
      return D.H;
    };
    // the house and the altar see-through (in David's days they were not yet): every mesh of their groups, and of the courts' what stands
    // up from the floor (its walls, gates and chambers; its floors stay) - each material for a faded copy, given back at the end
    const fadeOn = () => {
      const cache = new Map(), list = [], box = new Box3();
      const fadeOf = (m) => { if (!m) return m; if (!cache.has(m)) { const c = m.clone(); c.transparent = true; c.opacity = Math.min(m.opacity == null ? 1 : m.opacity, 0.13); c.depthWrite = false; cache.set(m, c); } return cache.get(m); };
      const take = (o) => { if (!(o.isMesh || o.isInstancedMesh) || o.parent === null) return; list.push([o, o.material]); o.material = Array.isArray(o.material) ? o.material.map(fadeOf) : fadeOf(o.material); };
      for (const n of ["altar", "heichal"]) { const r = ctx.root.getObjectByName(n); if (r) r.traverse(take); }
      // Solomon's vessels and the house's furniture are not there at all (their ghosts crowded the section's view)
      D.hid = [];
      for (const n of ["vessels", "interior", "kelim"]) { const r = ctx.root.getObjectByName(n); if (r && r.visible) { r.visible = false; D.hid.push(r); } }
      const cr = ctx.root.getObjectByName("courts");
      if (cr) cr.traverse((o) => { if (!(o.isMesh || o.isInstancedMesh)) return; try { box.setFromObject(o); if (box.max.y - box.min.y > 1.2 && box.max.y > F + 1) take(o); } catch (_) {} });
      D.faded = list;
    };
    const fadeOff = () => { for (const [o, m] of D.faded) o.material = m; D.faded = []; for (const r of D.hid || []) r.visible = true; D.hid = []; };
    const pills = (off) => {
      if (!D.style) { D.style = document.createElement("style"); D.style.textContent = "body.tm-dshdemo .tm-pill{display:none!important}"; document.head.appendChild(D.style); }
      document.body.classList.toggle("tm-dshdemo", !!off);
    };
    const enter = () => {
      if (D.saved) return;
      const lg = ctx.root.getObjectByName("labels") || (ctx.scene && ctx.scene.getObjectByName("labels"));
      D.saved = { labels: lg ? lg.visible : null, lg };
      if (lg) lg.visible = false;
      place();
      fadeOn();
      pills(true);
      D.g.visible = true;
    };
    const leave = () => {
      if (!D || !D.saved) return;
      const s = D.saved;
      D.saved = null;
      fadeOff();
      if (s.lg && s.labels != null) s.lg.visible = s.labels;
      pills(false);
      D.g.visible = false;
      for (const m of D.ahiMats) { m.transparent = false; m.opacity = 1; m.depthWrite = true; }
    };
    // ---- the scene at demo second t
    const REST = [0.05, 0.08, -0.15], ALARM = [-0.35, 0.3, -0.5], ASK = [-0.95, 0.25, -0.55], POINT = [-1.35, 0.06, -0.12], THINK = [-0.55, 0.12, -2.3];
    const SPEAK = [-1.05, 0.22, -0.5], HOLD = [-0.75, 0.12, -1.05], WRITE = [-0.7, -0.05, -1.2], TOSS = [-1.6, 0.1, -0.2], PRAY = [-2.15, 0.38, -0.45], NECK = [-0.55, 0.32, -2.55];
    const vS = new Vector3(), vH = new Vector3();
    const level = (t) => {   // the water's face in the shaft, thousands of amot under the floor
      if (t < T.rise0) return DEEP;
      if (t < T.rise1) return lerp(DEEP, 0, span(t, T.rise0, T.rise1));
      if (t < T.drop0) return 0;
      if (t < T.drop1) return lerp(0, 16, span(t, T.drop0, T.drop1));
      if (t < T.ps0) return 16;
      if (t < T.psEnd) { const u = (t - T.ps0) / T.psD, i = Math.floor(u), f = sm((u - i) / 0.75); return 16 - i - f; }
      return 1;
    };
    const apply = (t) => {
      const H = D.H, d = D.david, a = D.ahi;
      // the people: David at the shaft, then turned to those there (Ahitophel among them), back to it to throw; the songs with his hands up
      const yHole = Math.atan2(H.hx - H.Dv[0], H.hz - H.Dv[1]), yAhi = Math.atan2(H.Av[0] - H.Dv[0], H.Av[1] - H.Dv[1]);
      const toA = span(t, T.ask - 0.4, T.ask + 0.3) * (1 - span(t, T.write - 0.5, T.write));
      d.g.rotation.y = lerp(yHole, yAhi, toA);
      d.g.visible = t < T.coda;
      let dR = REST, dL = REST, dHead = 0.28 * (1 - toA);
      if (t >= T.rise1 && t < T.ask) { const k = span(t, T.rise1, T.rise1 + 0.4); dR = dL = mix(REST, ALARM, k); }
      else if (t >= T.ask && t < T.silent) dR = mix(REST, ASK, span(t, T.ask, T.ask + 0.5) * (1 - span(t, T.silent - 0.4, T.silent)));
      else if (t >= T.curse && t < T.kal) dR = mix(REST, POINT, span(t, T.curse, T.curse + 0.4) * (1 - span(t, T.kal - 0.4, T.kal)));
      else if (t >= T.write && t < T.toss) { dR = mix(REST, HOLD, span(t, T.write, T.write + 0.4)); dL = mix(REST, WRITE, span(t, T.write + 0.3, T.write + 0.7)); dL = [dL[0] + 0.06 * Math.sin(t * 22), dL[1], dL[2]]; }
      else if (t >= T.toss && t < T.toss + 0.9) { dR = mix(HOLD, TOSS, span(t, T.toss, T.toss + 0.35)); dL = mix(WRITE, REST, span(t, T.toss, T.toss + 0.5)); dR = mix(dR, REST, span(t, T.toss + 0.5, T.toss + 0.9)); }
      else if (t >= T.ps0 - 0.4 && t < T.psEnd + 0.3) { const k = span(t, T.ps0 - 0.4, T.ps0 + 0.2) * (1 - span(t, T.psEnd - 0.2, T.psEnd + 0.3)), w = 0.08 * Math.sin(t * 2.6); dR = dL = mix(REST, [PRAY[0] + w, PRAY[1], PRAY[2]], k); dHead = lerp(dHead, -0.18, k); }
      ark_setArm(d.R, dR, -1);
      ark_setArm(d.L, dL, 1);
      d.NK.rotation.x = dHead;
      // Ahitophel: silent; then his kal vachomer (the hand to the chin), "שרי" (toward the shaft); at the end alone - the hands to the neck
      const yA = Math.atan2(H.Dv[0] - H.Av[0], H.Dv[1] - H.Av[1]);
      let aR = REST, aL = REST, aHead = 0.12, aYaw = yA;
      if (t >= T.kal && t < T.shrei) aR = mix(REST, THINK, span(t, T.kal + 0.3, T.kal + 0.9) * (1 - span(t, T.shrei - 0.4, T.shrei)));
      else if (t >= T.shrei && t < T.write) aR = mix(REST, SPEAK, span(t, T.shrei, T.shrei + 0.4) * (1 - span(t, T.write - 0.4, T.write)));
      if (t >= T.coda) {
        const k = span(t, T.neck0, T.neck1);
        aYaw = lerp(yA, yA - 1.25, span(t, T.coda, T.coda + 1.2));   // turned from David's place toward the eye
        aR = aL = mix(REST, NECK, k);
        aHead = lerp(0.12, 0.55, span(t, T.neck0 + 0.6, T.fade1 - 0.4));
      }
      a.g.rotation.y = aYaw;
      ark_setArm(a.R, aR, -1);
      ark_setArm(a.L, aL, 1);
      a.NK.rotation.x = aHead;
      const fa = 1 - span(t, T.fade0, T.fade1);
      for (const m of D.ahiMats) { const tr = fa < 0.999; if (m.transparent !== tr) { m.transparent = tr; m.depthWrite = !tr; m.needsUpdate = true; } m.opacity = fa; }
      a.g.visible = fa > 0.01;
      // the shard: in his right hand while he writes, through the air into the shaft, then in the section on the water's face
      const sh = D.shard;
      if (t >= T.write && t < T.toss + 0.12) {
        d.g.updateMatrixWorld(true);
        d.R.grip.getWorldPosition(vS);
        sh.position.copy(vS);
        sh.rotation.set(0, d.g.rotation.y, 0);
        sh.visible = true;
      } else if (t >= T.toss + 0.12 && t < T.toss + 0.62) {
        const u = (t - T.toss - 0.12) / 0.5;
        d.R.grip.getWorldPosition(vH);
        sh.position.set(lerp(vH.x, H.hx, u), lerp(vH.y, F + 0.05, u) + 1.1 * u * (1 - u), lerp(vH.z, H.hz, u));
        sh.rotation.x += 0.4;
        sh.visible = true;
      } else sh.visible = false;
      // the water on the floor and its spring
      const R = t < T.rise1 ? 0 : t < T.drop0 ? 2.4 * span(t, T.rise1, T.well1) : 2.4 * (1 - span(t, T.drop0, T.drop0 + 1.6));
      D.pool.visible = R > 0.02;
      D.pool.scale.setScalar(Math.max(0.02, R * (1 + 0.02 * Math.sin(t * 5))));
      const sp = t >= T.rise1 && t < T.drop0 + 0.4 ? span(t, T.rise1, T.rise1 + 0.6) * (1 - span(t, T.drop0, T.drop0 + 0.4)) : 0;
      D.spring.visible = sp > 0.02;
      D.spring.scale.set(0.42 * sp, (0.5 + 0.12 * Math.sin(t * 9)) * sp, 0.42 * sp);
      // the section
      const ov = span(t, 0, 0.6) * (1 - span(t, T.ovOut, T.ovOut + 0.8)) + span(t, T.ovIn, T.ovIn + 0.8) * (1 - span(t, T.rest + 5.6, T.coda));
      D.OV.visible = ov > 0.01;
      if (D.OV.visible) {
        for (const [m, op] of D.ovM) m.opacity = op * ov;
        const dug = PH * span(t, T.dig0, T.dig1);
        D.shaft.visible = dug > 0.05;
        D.shaft.scale.y = Math.max(0.01, dug);
        D.shaft.position.y = -dug / 2;
        const L = level(t), y = -L * U, wet = t >= T.rise0;
        D.col.visible = wet;
        D.col.scale.y = Math.max(0.01, DEEP * U - L * U);
        D.col.position.y = y - (DEEP * U - L * U) / 2;
        D.top.visible = wet;
        D.top.position.y = y;
        const sIn = t >= T.toss + 0.6;
        D.oshard.visible = sIn;
        if (sIn) { const fall = span(t, T.toss + 0.6, T.splash), y0 = 0.3; D.oshard.position.y = t < T.splash ? lerp(y0, y, fall) : y + 0.12; D.oshard.rotation.z = t < T.splash ? (t - T.toss) * 3 : 0.08; }
        const k = wet ? (L < 0.15 ? 0 : clamp(Math.round(L), 1, 16)) : -1;
        D.reads.forEach((s, i) => { s.visible = i === k; if (i === k) s.position.set(0.75, y, 0); });
        const si = t >= T.ps0 && t < T.psEnd + 1.8 ? clamp(Math.floor((t - T.ps0) / T.psD), 0, 14) : -1;
        D.songs.forEach((s, i) => { s.visible = i === si; });
      }
    };
    // ---- the eye (walk keys, demo seconds) and the words under the picture (the library's text; Rashi's in his own words)
    const keys = () => {
      const H = D.H, hx = H.hx, hz = H.hz;
      const SEC = [[hx - 3, F + 5, hz + 36], [hx, F - 14.5, hz + 1.2]];   // the people, the count of the songs over them and the whole section
      const TALK = [[hx - 2.4, F + 3.4, hz + 7.2], [hx - 2.1, F + 2.1, hz - 0.5]];
      const CODA = [[hx - 4.6, F + 2.9, hz + 3.9], [H.Av[0] + 0.1, F + 2.15, H.Av[1]]];
      return [[0, SEC[0], SEC[1]], [T.ovOut - 0.2, SEC[0], SEC[1]], [T.ask - 0.1, TALK[0], TALK[1]], [T.write + 0.4, TALK[0], TALK[1]],
        [T.ovIn + 0.9, SEC[0], SEC[1]], [T.coda - 0.3, SEC[0], SEC[1]], [T.coda + 1.4, CODA[0], CODA[1]], [T.end, CODA[0], CODA[1]]];
    };
    const caps = [
      [0, "״בשעה שכרה דוד שיתין, קפא תהומא ובעא למשטפיה לעלמא״ (סוכה נג.)"],
      [T.rise0, "רש״י: ״קפא תהומא — צף התהום למעלה״"],
      [T.ask - 0.2, "״אמר דוד: מי איכא דידע אי שרי למכתב שם אחספא, ונשדייה בתהומא ומנח?״ — רש״י: ״דוד לא היה מורה הלכה בפני רבו אחיתופל, והוא היה שם״"],
      [T.silent, "״ליכא דקאמר ליה מידי״"],
      [T.curse, "״אמר דוד: כל דידע למימר ואינו אומר — יחנק בגרונו״"],
      [T.kal, "״נשא אחיתופל קל וחומר בעצמו: ומה לעשות שלום בין איש לאשתו, אמרה תורה: שמי שנכתב בקדושה ימחה על המים — לעשות שלום לכל העולם כולו, על אחת כמה וכמה״"],
      [T.shrei, "״אמר ליה: שרי״"],
      [T.write, "״כתב שם אחספא ושדי לתהומא״ — רש״י: ״מפני שהחרס צולל ויורד ואינו צף, כדי שירד וינוח על הנקב״"],
      [T.drop0, "״ונחית תהומא שיתסר אלפי גרמידי״"],
      [T.said, "״כי חזי דנחית טובא, אמר: כמה דמידלי — טפי מירטב עלמא״ — רש״י: ״כמה שהתהום גבוה וסמוך לארץ, מתלחלח העולם והארץ מצמחת פירותיה״"],
      [T.ps0, "״אמר חמש עשרה מעלות, ואסקיה חמיסר אלפי גרמידי״ — רש״י: ״ט״ו מזמורים של שיר המעלות״. במודל: אלף אמה בכל מזמור"],
      [T.rest, "״ואוקמיה באלפא גרמידי. אמר עולא: שמע מינה סומכא דארעא אלפא גרמידי״ — רש״י: ״עובי הארץ עד התהום״"],
      [T.coda, "״אמר רב יהודה אמר רב: קללת חכם — אפילו בחנם היא באה. מנלן? מאחיתופל״ (מכות יא.)"],
      [T.neck0 - 0.4, "״ואפילו הכי כתיב: ׳ויצו אל ביתו ויחנק׳״ (מכות יא.; שמואל ב יז, כג)"]
    ];
    // ---- start, stop, the sounds
    const finish = () => { if (!D) return; D.run = false; leave(); };
    const start = () => {
      const Wk = W();
      if (!Wk) return false;
      build();
      if (typeof ctx.shared.stopDemos === "function") ctx.shared.stopDemos("davidShitinDemo");
      enter();
      D.run = true;
      apply(0);
      Wk.run(keys(), caps, finish);
      return true;
    };
    const stop = () => { if (!D || !D.run) return; const Wk = W(); if (Wk && Wk.on) Wk.stop(); else finish(); };
    let sndT = -1;
    ctx.animated.push(() => {
      if (!D || !D.run) { sndT = -1; return; }
      const Wk = W(), t = Wk && typeof Wk.now === "function" ? Math.max(0, Wk.now()) : 0;
      apply(t);
      try {
        const SH = ctx.shared;
        if (sndT >= 0 && t > sndT && typeof SH.sfx === "function") {
          if (sndT < T.rise0 && t >= T.rise0) SH.sfx("water", { dur: 3.6 });
          if (sndT < T.splash && t >= T.splash) SH.sfx("click");
          if (sndT < T.drop0 && t >= T.drop0) SH.sfx("water", { dur: 2.4, gain: 0.8 });
        }
      } catch (_) {}
      sndT = t;
    });
    const walkEntry = () => (ctx.shared.demoStops || []).find((q) => q.id === "walk");
    (ctx.shared.demoStops || (ctx.shared.demoStops = [])).push({
      id: "davidShitinDemo", running: () => !!(D && D.run), stop,
      pause: () => { const w = walkEntry(); if (w) w.pause(); },
      resume: () => { const w = walkEntry(); if (w) w.resume(); },
      paused: () => { const w = walkEntry(); return !!(w && w.paused()); },
      restart: () => { stop(); start(); }
    });
    // ---- the card: the Bavli, Rashi, Makkot, the Yerushalmi's other telling, and what the model chose
    const INFO = "**הבבלי** (סוכה נג.–נג:), כפי שהוא בספרייה: ״בשעה שכרה דוד שיתין, קפא תהומא ובעא למשטפיה לעלמא. אמר דוד: מי איכא דידע אי שרי למכתב שם אחספא, ונשדייה בתהומא ומנח? ליכא דקאמר ליה מידי. אמר דוד: כל דידע למימר ואינו אומר, יחנק בגרונו. נשא אחיתופל קל וחומר בעצמו: ומה לעשות שלום בין איש לאשתו, אמרה תורה: שמי שנכתב בקדושה ימחה על המים, לעשות שלום לכל העולם כולו — על אחת כמה וכמה. אמר ליה: שרי. כתב שם אחספא ושדי לתהומא, ונחית תהומא שיתסר אלפי גרמידי. כי חזי דנחית טובא, אמר: כמה דמידלי — טפי מירטב עלמא. אמר חמש עשרה מעלות, ואסקיה חמיסר אלפי גרמידי, ואוקמיה באלפא גרמידי. אמר עולא: שמע מינה סומכא דארעא אלפא גרמידי״.\n" +
      "**רש״י** (שם): ״מי איכא דידע — דוד לא היה מורה הלכה בפני רבו אחיתופל, והוא היה שם״; ״אחספא — מפני שהחרס צולל ויורד ואינו צף, כדי שירד וינוח על הנקב; ובאגדת דספר שמואל מפורש שמצאו דוד על פני נקב התהום, וכתוב בו שהיה שם מששת ימי בראשית״; ״אמר — ט״ו מזמורים של שיר המעלות״; ״סומכא דארעא — עובי הארץ עד התהום״.\n" +
      "**מכות** (יא.): ״אמר רב יהודה אמר רב: קללת חכם – אפילו בחנם היא באה. מנלן? מאחיתופל״, והמעשה שם בקצרה: ״כתב שם אחספא, שדא אתהומא, נחת וקם אדוכתיה. ואפילו הכי כתיב: ׳ואחיתפל ראה כי לא נעשתה עצתו... ויצו אל ביתו ויחנק׳״ (שמואל ב יז, כג).\n" +
      "**הירושלמי** (סנהדרין י, ב) מספר אחרת: דוד חפר את יסודות הבית — ״חפר חמש עשר מאוון דאמין ולא אשכח תהומה, ובסופא אשכח חד עציץ ובעא מירמיתיה״. העציץ אמר לו: ״לית את יכיל... דנא הכא כביש על תהומא״, ולא שמע לו; ״כיון דירימיה סליק תהומה ובעא מטפא עלמא. והוא אחיתופל קאים תמן, אמר: כדון דוד מתחנק ואנא מליך״. ״אמר דוד: מאן דחכם דידע מקימתיה ולא מקים ליה, יהא סופיה מתחנקא. אמר מה דאמר ואוקמיה. התחיל דוד אומר שירה: שיר המעלות — שיר למאה עולות, על כל מאה אמה היה אומר שירה. אף על גב כן הוה סופיה מתחנקה״. כלומר: בירושלמי — מאה אמה בכל שיר, ובבבלי — חמשה עשר אלף בחמש עשרה המעלות.\n" +
      "**דוד** — בבגדי מלך ובכתר, ואדמוני: ״וַיְבִיאֵהוּ וְהוּא אַדְמוֹנִי עִם יְפֵה עֵינַיִם וְטוֹב רֹאִי״ (שמואל א טז, יב).\n" +
      "**במודל:** ההדגמה כבבלי. בימי דוד לא היו עדיין בית ומזבח, ולכן בזמן ההדגמה הבניינים שקופים; השיתין במקומם, ליד קרן מערבית דרומית של המזבח. מתחת לרצפה — חתך מכווץ: שנתה אחת היא אלף אמה, ובו המים בתוך השיתין. אלף אמה בכל מזמור — חמשה עשר האלפים מתחלקים בשווה לחמשה עשר המזמורים (בחירת מודל). ״ויחנק״ מוצג ברמז בלבד: ידיו אל צווארו, ראשו מורכן, והוא נעלם. מקום הדמויות, לבושן, צורת החרס ומראה החתך — בחירות מודל.";
    const REFS = [["סוכה נג.", { book: 108, index: 1371 }], ["סוכה נג:", { book: 108, index: 1374 }], ["רש״י סוכה נג.", { book: 2163, index: 3597 }],
      ["רש״י סוכה נג:", { book: 2163, index: 3600 }], ["מכות יא.", { book: 126, index: 325 }], ["שמואל ב יז, כג", { book: 9, index: 467 }], ["תהלים קכ", { book: 28, index: 2320 }], ["שמואל א טז, יב", { book: 8, index: 411 }]];
    ctx.shared.modelButtons = ctx.shared.modelButtons || [];
    ctx.shared.modelButtons.push({
      id: "davidShitinDemo", label: "הדגמה: ״בשעה שכרה דוד שיתין״", labelOn: "עצור את ההדגמה", maxDist: 42,
      title: "״בשעה שכרה דוד שיתין, קפא תהומא ובעא למשטפיה לעלמא״ (סוכה נג.). ההדגמה: התהום עולה, אחיתופל מתיר, החרס נזרק, התהום יורד שש עשרה אלף אמה, ובחמש עשרה המעלות עולה עד אלף אמה; ובסוף — ״ויחנק״ (מכות יא.), ברמז.",
      anchor: () => { const v = new Vector3(); let h = null; ctx.root.traverse((o) => { if (!h && o.name === "shitinHole") h = o; }); if (!h) return null; h.getWorldPosition(v); return [v.x - 1.4, F + 3.4, v.z + 0.4]; },
      get: () => !!(D && D.run),
      set: (on) => { if (on) start(); else stop(); }
    });
    ctx.shared.davidShitin = { demo: start, stop, T, info: INFO, refs: REFS,
      at: (t) => { build(); if (!D.saved) enter(); apply(t); return D.H; },   // (checks: the scene still at demo second t; stop() or leave via at(-1))
      leave: () => { if (D) { D.run = false; leave(); } } };
  }
