# -*- coding: utf-8 -*-
# Round 2.0.17 (Beit Sheni 2.0.8): the parochot wall to wall, with the two readings of "פרופה" (Rashi / Tosafot Rid),
# and Solomon's ten tables in the form of Moses' table. Applied to the built bundle of the second house (bundle.orig.js -> bundle.js).
# Code blocks are given in source form: each non-empty line gets the bundle's " //" ending.
import sys, re
SRC, DST = '/home/claude/b2work/bundle.orig.js', '/home/claude/b2work/bundle.js'
B = open(SRC, encoding='utf-8').read()

def code(s):
    s = s.strip('\n')
    return '\n'.join((l + ' //') if l != '' else '' for l in s.split('\n'))

def rep(old, new, n=1, raw=False, label=''):
    global B
    o = old if raw else code(old)
    w = new if raw else code(new)
    c = B.count(o)
    if c != n:
        print('FAIL', label, 'found', c, 'expected', n); sys.exit(1)
    B = B.replace(o, w)
    print('ok', label, c)

# ---------------------------------------------------------------- 1. the parochot (heichal.js)
OLD_PAR = r'''
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
'''
NEW_PAR = r'''
    // PAROCHET_217 (2.0.8; the user, 17.11.2026: "היא מאויירת כאילו היא קצרה ומגיע עד לפני הכותל... ברש"י ביומא מבואר שהיא היתה על כל
    // האורך אלא שהיתה נכפלת במקום הפתח ומחובת בקרסים להשאירה פתוחה, ובתוס' רי"ד מבואר שהיא מגיעה לגמרי עד הכותל"): EACH PAROCHET
    // FROM WALL TO WALL - from the gold liner of the north wall to that of the south (their faces at z +-9.38: lineMat below; the house
    // is twenty, Middot 4:7); until 2.0.7 18.4 amot, its end an amah short of the wall at its opening. "החיצונה היתה פרופה מן הדרום,
    // והפנימית מן הצפון" (Mishnah Yoma 5:1; 55:38) in two readings (ctx2.shared.parochetFold; the row "פריפת הפרוכות"):
    // "rashi" (the default) - Rashi, Yoma 52b: "פרופה - ראשה כפולה לצד החוץ ונאחזת בקרס של זהב להיות פתוחה ועומדת" (2157:1973); 51b, of
    // R. Yose's one: "ואצל הכותל הצפוני היה ראשה כפול ופרופה בקרס זהב כלפי החוץ ובו נכנסין לפני ולפנים" (2157:1949); so the Bartenura
    // (582:196); the Meiri: "שהיה ראשה כפול על עצמה ונתונה בקרסי זהב על שאר היריעה כדי שלא תסגור כל הצד וישאר מקום כניסה" (2199:425);
    // the Tosafot Yom Tov: "שהפרוכת על פני כל הדביר מכותל הצפון עד כותל הדרום" (898:155). Drawn: the lower corner at the opening's wall
    // folded up toward the outside (east), flat on the parochet's own face, a gold hook at its point - the triangle it leaves is the way in.
    // "rid" - Tosafot Rid, Yoma 52b (2109:161): "ואינו נ"ל שאין זה דרך צניעות להיות הפתח פתוח"; "שהיו קרסיו תקועין בכותל ולולאות היו
    // בשפת הפרוכת... וכל הפרכת מלמעלה למטה היתה מחוברת יפה ומהודקה... אבל כשיעור כניסת הכהן היו מניחים שלא היו קושרים אותם בהידוק...
    // מסלק הלולאות מן הקרסים ופותח": closed; gold hooks in both walls and loops on its edges, the loops of the way in slack; in the High
    // Priest's walk (ykEntry) that corner opens as he comes - laid back the way he goes - and closes behind him (near). The corner's size
    // (5 amot each way), the hooks' spacing (2 amot), the side the corner opens to - model choices. The Tosafot Yom Tov's own picture
    // of the fold ("היתה ארוכה ויצאת לחוץ לתוך ההיכל ונאחזת בכותל הדרום בקרס") is told in the row's card, not drawn.
    const PAR_Y = FL + houseRise(-45), PAR_H = 39.9 - houseRise(-45), PAR_BEND = 2;
    const PAR_W = 18.78, PAR_T = 0.12, PAR_FOLD = 5, PAR_LIFT = 0.16;   // liner to liner (a hair into each); the cloth; the corner's legs; the fold off the face
    const parFaces = [];   // [mesh, side]: the woven faces, dressed by the figures below; side +1 toward the heichal (east), -1 toward the devir
    const parRolls = [];   // the folds' round edges (Rashi), in the plain weave below
    const parShape = (pts) => { const s = new Shape(); pts.forEach(([a, b], i) => (i ? s.lineTo(a, b) : s.moveTo(a, b))); return s; };
    // a piece of the cloth in the plane x = 0 of its parochet, pts [z, y]
    const parSlab = (pts) => {
      const geo = new ExtrudeGeometry(parShape(pts), { depth: PAR_T, bevelEnabled: false });
      geo.rotateY(-Math.PI / 2);   // (u, v, w) -> (x -w, y v, z u)
      geo.translate(PAR_T / 2, 0, 0);
      return geo;
    };
    // its face toward sd; the uv in amot (the figures' textures repeat by the amah)
    const parFace = (pts, sd) => {
      const geo = new ShapeGeometry(parShape(pts.map(([a, b]) => [sd > 0 ? -a : a, b])));
      geo.rotateY(sd > 0 ? Math.PI / 2 : -Math.PI / 2);
      geo.translate(sd * 0.065, 0, 0);
      return geo;
    };
    // the Rid's hooks: a gold peg out of the wall along the cloth's east face, its end turned up; a loop on the cloth's edge round it
    const RID_X = 0.15, RID_IN = 0.26;   // the pegs' line off the cloth's middle; their length out of the wall
    const pegG = new CylinderGeometry(0.032, 0.032, RID_IN, 8);
    pegG.rotateX(Math.PI / 2);
    const pegTipG = new CylinderGeometry(0.028, 0.028, 0.11, 8);
    const loopG = new TorusGeometry(0.1, 0.02, 6, 14);
    const looseG = new TorusGeometry(0.16, 0.02, 6, 16);   // the way in: "שלא היו קושרים אותם בהידוק" - a loop hanging slack on its peg
    // one parochet: x - its place; open - +1 its way in by the south wall, -1 by the north; hh - its height
    const mkPar = (x, open, hh) => {
      const G = new Group();
      G.position.set(x, PAR_Y, 0);
      g.add(G);
      const zw = open * PAR_W / 2, zi = zw - open * PAR_FOLD;   // the wall's edge; the fold's foot
      const cloth = (parent, pts) => {
        const m = new Mesh(parSlab(pts), M2.parochet);
        m.castShadow = m.receiveShadow = true;
        parent.add(m);
        for (const sd of [1, -1]) {
          const f = new Mesh(parFace(pts, sd), M2.parochet);
          f.receiveShadow = true;
          parent.add(f);
          parFaces.push([f, sd]);
        }
      };
      cloth(G, [[-zw, 0], [zi, 0], [zw, PAR_FOLD], [zw, hh], [-zw, hh]]);
      // the corner turns on the fold's line, from (zi, 0) to (zw, PAR_FOLD): P's z axis lies along it and the corner on P's -y, so
      // P.rotation.z > 0 swings it east; Q takes back P's own turn - what is put in Q is set in G's measures
      const mz = (zi + zw) / 2, my = PAR_FOLD / 2, phi = open > 0 ? -Math.PI / 4 : Math.PI / 4;
      const P = new Group(), Q = new Group();
      P.position.set(0, my, mz);
      P.rotation.set(phi, 0, 0);
      Q.rotation.x = -phi;
      Q.position.set(0, -my, -mz).applyAxisAngle(new Vector3(1, 0, 0), -phi);
      P.add(Q);
      G.add(P);
      cloth(Q, [[zi, 0], [zw, 0], [zw, PAR_FOLD]]);
      // Rashi: the fold's round edge, and the gold hook ("קרס של זהב") that holds the corner's point on the cloth
      const rashi = new Group();
      const roll = new Mesh(new CylinderGeometry(0.095, 0.095, PAR_FOLD * Math.SQRT2, 10), M2.parochet);   // (its weave: parRolls, below)
      roll.geometry.rotateX(Math.PI / 2);
      roll.position.set(0.1, my, mz);
      parRolls.push(roll);
      roll.rotation.x = phi;
      roll.castShadow = true;
      rashi.add(roll);
      const hook = new Group();
      hook.position.set(PAR_LIFT + 0.11, PAR_FOLD - 0.42, zi + open * 0.42);
      const ring = new Mesh(new TorusGeometry(0.19, 0.045, 8, 20), M2.gold);
      ring.rotation.y = Math.PI / 2;
      hook.add(ring, new Mesh(new SphereGeometry(0.075, 10, 8), M2.gold));
      rashi.add(hook);
      G.add(rashi);
      // the Rid: pegs in both walls along the height and the loops on the edges; by the way in, up to the fold's top, the loops are on the
      // corner (they go with it) and slack
      const rid = new Group(), ridQ = new Group();
      const pegs = [], tips = [], loops = [], slack = [];
      for (const zs of [-1, 1]) for (let y = 1; y < hh - 0.3; y += 2) {
        const zc = zs * (PAR_W / 2 - RID_IN / 2);
        pegs.push(m4(RID_X, y, zc));
        tips.push(m4(RID_X, y + 0.045, zs * (PAR_W / 2 - RID_IN + 0.02)));
        if (zs === open && y < PAR_FOLD) slack.push(m4(RID_X, y - 0.06, zc)); else loops.push(m4(RID_X, y, zc));
      }
      instMesh(rid, pegG, M2.gold, pegs, false);
      instMesh(rid, pegTipG, M2.gold, tips, false);
      instMesh(rid, loopG, M2.gold, loops, false);
      instMesh(ridQ, looseG, M2.gold, slack, false);
      G.add(rid);
      Q.add(ridQ);
      const p = { G, open, zo: open * (PAR_W / 2 - 0.4), k: 0, want: 0 };   // zo: the way in, by the wall
      // Rashi: folded over to the east for good. The Rid: closed; opened, the corner is laid back the way he goes in - to the west, flat
      // on the parochet's other face (the outer one's, in the amah between them; the inner one's, in the Holy of Holies)
      p.pose = (mode) => {
        const r = mode === "rid";
        if (r) { const s = p.k * p.k * (3 - 2 * p.k); P.rotation.z = -Math.PI * s; P.position.x = -PAR_LIFT * s; }
        else { P.rotation.z = Math.PI; P.position.x = PAR_LIFT; }
        rashi.visible = !r;
        rid.visible = ridQ.visible = r;
      };
      return p;
    };
    const parOut = mkPar(-44.5, 1, PAR_H), parIn = mkPar(-45.5, -1, PAR_H - PAR_BEND);
    const PARS = [parOut, parIn];
    // 1.9.3: the inner one's head, bent toward the Holy of Holies (with it when it moves: R. Yose's one parochet)
    const parHead = new Mesh(new BoxGeometry(PAR_T, 2.4, PAR_W).translate(0, 1.2, 0), M2.parochet);
    parHead.position.set(0, PAR_H - PAR_BEND, 0);
    parHead.rotation.z = Math.PI / 3;
    parHead.castShadow = parHead.receiveShadow = true;
    parIn.G.add(parHead);
    const parFold = ctx2.shared.parochetFold = {
      mode: "rashi",
      t: 0,
      set(k) {
        this.mode = k === "rid" ? "rid" : "rashi";
        for (const p of PARS) { p.k = p.want = 0; p.pose(this.mode); }
        return this.mode;
      },
      // the Rid: [x, z] of the High Priest and of the eye that follows him (null - no one): the corner by them opens - an amah and a half
      // from its way in fully, five amot off not at all - and closes again behind them
      near(pts) {
        for (const p of PARS) {
          let k = 0;
          if (pts && p.G.visible) for (const q of pts) if (q) k = Math.max(k, Math.min(1, Math.max(0, (5 - Math.hypot(q[0] - p.G.position.x, q[1] - p.zo)) / 3.5)));
          p.want = k;
        }
      }
    };
    parFold.set("rashi");
    ctx2.animated.push((t) => {
      const dt = parFold.t ? Math.min(0.1, Math.max(0, (t - parFold.t) / 1000)) : 0;
      parFold.t = t;
      if (parFold.mode !== "rid") return;
      for (const p of PARS) {
        const d = p.want - p.k;
        if (Math.abs(d) < 1e-4) continue;
        p.k += Math.max(-1.2 * dt, Math.min(1.2 * dt, d));
        p.pose("rid");
      }
    });
'''
rep(OLD_PAR, NEW_PAR, label='parochot')

rep('''
        t.repeat.set(18.4 / TILE, 39.9 / TILE);
''', '''
        t.repeat.set(1 / TILE, 1 / TILE);   // PAROCHET_217: the faces' uv is in amot (until 2.0.7 a plane's 0..1 over 18.4 by 39.9)
        t.offset.set(PAR_W / 2 / TILE, 0);
''', label='tex repeat')

rep('''
      if (parFlap) { const tf = T.plain.clone(); tf.repeat.set(18.4 / TILE, 2.4 / TILE); tf.needsUpdate = true; parFlap.material = mat(tf); }   // 1.9.3: the bent head, in the weave
''', '''
      { const tf = T.plain.clone(); tf.repeat.set(PAR_W / TILE, 2.4 / TILE); tf.offset.set(0, 0); tf.needsUpdate = true; parHead.material = mat(tf); }   // 1.9.3: the bent head, in the weave
      for (const r of parRolls) r.material = M.plain;   // PAROCHET_217: the fold's edge, in the weave's own colour (not the dark of the cloth's body)
''', label='head texture')

rep('''
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
''', '''
      const faces = parFaces;   // PAROCHET_217: made with the parochot (mkPar) - of each one's two pieces, two faces each
''', label='faces')

rep('''
          const x = one ? -44.5 : -45.5;
          parOut.visible = !one;
          parIn.position.x = x;
          if (parFlap) parFlap.position.x = x;
          faces[0][0].visible = faces[1][0].visible = !one;
          faces[2][0].position.x = x + 0.065;
          faces[3][0].position.x = x - 0.065;
''', '''
          parOut.G.visible = !one;
          parIn.G.position.x = one ? -44.5 : -45.5;   // PAROCHET_217: its faces, corner, hooks and head with it
          parFold.near(null);
''', label='parochotCount')

# the High Priest's walk: the corner opens to him in the Rid's reading
rep('''
          KOH.hide();
          solHold(false);
          if (!fromWalk) DW.stop();
''', '''
          KOH.hide();
          solHold(false);
          { const PF = ctx2.shared.parochetFold; if (PF) PF.near(null); }   // PAROCHET_217
          if (!fromWalk) DW.stop();
''', label='yk stop')

rep('''
          const t = DW.now(), P = PATH[Y.mode], B = BACK[Y.mode], tin = P[P.length - 1][0];
          if (t <= tin + 0.45) {
            const p = at(P, Math.max(0, t)), o = { x: p[1], y: FY(p[1]), z: p[2], base: "carry", white: true, props };
            if (t <= 0.05) o.yaw = Math.atan2(P[1][1] - P[0][1], P[1][2] - P[0][2]);
            KOH.pose(o);
          } else if (t < B[0][0]) KOH.hide();
          else { const p = at(B, t); KOH.pose({ x: p[1], y: FY(p[1]), z: p[2], yaw: p[3] == null ? B[0][3] : p[3], white: true }); }
''', '''
          const t = DW.now(), P = PATH[Y.mode], B = BACK[Y.mode], tin = P[P.length - 1][0];
          let hp = null;
          if (t <= tin + 0.45) {
            const p = at(P, Math.max(0, t)), o = { x: p[1], y: FY(p[1]), z: p[2], base: "carry", white: true, props };
            if (t <= 0.05) o.yaw = Math.atan2(P[1][1] - P[0][1], P[1][2] - P[0][2]);
            KOH.pose(o);
            hp = [p[1], p[2]];
          } else if (t < B[0][0]) KOH.hide();
          else { const p = at(B, t); KOH.pose({ x: p[1], y: FY(p[1]), z: p[2], yaw: p[3] == null ? B[0][3] : p[3], white: true }); hp = [p[1], p[2]]; }
          // PAROCHET_217: in the Rid's reading the corner by him opens to him - and to the eye that goes after him - and closes behind
          const PF = ctx2.shared.parochetFold, cp = ctx2.camera && ctx2.camera.position;
          if (PF) PF.near([hp, cp ? [cp.x, cp.z] : null]);
''', label='yk walk')

# ---------------------------------------------------------------- 2. Solomon's ten tables (vessels.js)
rep('''
    // (2105:319): "ועשר שולחנות היו עדיין בהיכל שעשה שלמה... ובאותן של שלמה לא היו מסדרים" - bare tables (no bread, no spoons), unlit
''', '''
    // (2105:319): "ועשר שולחנות היו עדיין בהיכל שעשה שלמה... ובאותן של שלמה לא היו מסדרים" - no bread on them (SOLOMON_FORM_217), unlit
''', label='sol comment')

rep('''
      SOL.tBody = mk(tableGeo.body, tblBody.material, true);
      SOL.tCrown = mk(tableGeo.crown, tblCrown.material, false);
''', '''
      SOL.tBody = mk(tableGeo.body, tblBody.material, true);
      SOL.tCrown = mk(tableGeo.crown, tblCrown.material, false);
      // SOLOMON_FORM_217 (the user, 17.11.2026: "השולחנות מאויירים כשולחנות פשוטים בלי הסניפים והמנקיות כמו שלחן לחם הפנים עצמו, ובבית
      // ראשון מאויירים השולחנות בשלמותם"): each of the ten in the form of Moses' table, as the First Temple's ten (its 55-interior.js, L.46):
      // the posts and the reeds (with the loaves' shape, breadShape), their ends, and the two spoons - empty; no bread and no frankincense:
      // "ולא היו מסדרין אלא על של משה" (Menachot 99a). Until 2.0.7 the board and the crown only.
      SOL.tRig = BREAD_SH.shaped(mk(tableGeo.rig, METALS.gold.tbl, false), tableGeo.rig, tableGeo.rigB);
      SOL.tEnds = BREAD_SH.shaped(mk(tableGeo.ends, tubeEndMat, false), tableGeo.ends, tableGeo.endsB);
      SOL.tSpoons = mk(tableGeo.spoons, METALS.gold.tbl, false);
      SOL.tParts = [SOL.tBody, SOL.tCrown, SOL.tRig, SOL.tEnds, SOL.tSpoons];
''', label='sol parts')

rep('''
        L.tables.forEach(([x, z, r], i) => { const m = int_part(x, FLx(x), z, r, 0, 0, 0); SOL.tBody.setMatrixAt(i, m); SOL.tCrown.setMatrixAt(i, m); });
''', '''
        L.tables.forEach(([x, z, r], i) => { const m = int_part(x, FLx(x), z, r, 0, 0, 0); for (const im of SOL.tParts) im.setMatrixAt(i, m); });
''', label='sol place')

rep('''
        for (const im of [SOL.tBody, SOL.tCrown, SOL.mBody, SOL.mMidNS, SOL.mSideNS, SOL.mMidEW, SOL.mSideEW]) {
''', '''
        for (const im of [...SOL.tParts, SOL.mBody, SOL.mMidNS, SOL.mSideNS, SOL.mMidEW, SOL.mSideEW]) {
''', label='sol update')

rep('''
        SOL.tBody.material = METALS[k].tbl;
        SOL.tCrown.material = METALS[k].crown;
''', '''
        SOL.tBody.material = SOL.tSpoons.material = METALS[k].tbl;
        BREAD_SH.retint(SOL.tRig, METALS[k].tbl);
        SOL.tCrown.material = METALS[k].crown;
''', label='sol metal')

# the metal and the loaves' shape: the posts kept the metal they were made in (gold) once the shape was switched after the metal
rep('''
      set(m) { this.mode = m === "box" ? "box" : "boat"; for (const e of this.list) { e.im.geometry = this.mode === "box" ? e.box : e.boat; e.im.material = this.mat(e); if (e.im.isInstancedMesh) e.im.computeBoundingSphere(); } return this.mode; } });
''', '''
      set(m) { this.mode = m === "box" ? "box" : "boat"; for (const e of this.list) { e.im.geometry = this.mode === "box" ? e.box : e.boat; e.im.material = this.mat(e); if (e.im.isInstancedMesh) e.im.computeBoundingSphere(); } return this.mode; },
      // SOLOMON_FORM_217: a shaped mesh given another material (the metal switch, 45-vessels.js) - until 2.0.7 the next set() put back the
      // material it was made in (the posts of a silver table turned gold again when the loaves' shape was switched)
      retint(im, mat) { const e = this.list.find((x) => x.im === im); if (!e) { im.material = mat; return; } e.mBox = mat; e.mBoat = null; im.material = this.mat(e); } });
''', label='breadShape retint')

rep('''
        tblRig.material = METALS[k].tbl;
''', '''
        BREAD_SH.retint(tblRig, METALS[k].tbl);   // SOLOMON_FORM_217 (was: tblRig.material = ...)
''', label='moses rig metal')

# ---------------------------------------------------------------- 3. the cards, the row, the news (ui.js)
R_MISH = '["יומא ה, א", {"book": 55, "index": 38}]'
R_RASHI52 = '["רש״י יומא נב:", {"book": 2157, "index": 1973}]'
R_RASHI51 = '["רש״י יומא נא:", {"book": 2157, "index": 1949}]'
R_BART = '["ברטנורא יומא ה, א", {"book": 582, "index": 196}]'
R_MEIRI = '["מאירי יומא ה, א", {"book": 2199, "index": 425}]'
R_TYT = '["תוי״ט יומא ה, א", {"book": 898, "index": 155}]'
R_RID = '["תוספות רי״ד יומא נב:", {"book": 2109, "index": 161}]'
REFS_ALL = '[' + ', '.join([R_MISH, R_RASHI52, R_RASHI51, R_BART, R_MEIRI, R_TYT, R_RID]) + ']'
REFS0 = '[' + ', '.join([R_MISH, R_RASHI52, R_RASHI51, R_BART, R_MEIRI, R_TYT]) + ']'
REFS1 = '[' + ', '.join([R_MISH, R_RID, R_RASHI52]) + ']'
T0 = (r'המשנה (יומא ה, א): ״החיצונה היתה פרופה מן הדרום, והפנימית מן הצפון״.\n'
      r'**רש״י** (יומא נב:): ״פרופה — ראשה כפולה לצד החוץ ונאחזת בקרס של זהב להיות פתוחה ועומדת״. ובשיטת רבי יוסי, שהייתה שם פרוכת אחת (רש״י יומא נא:): ״ואצל הכותל הצפוני היה ראשה כפול ופרופה בקרס זהב כלפי החוץ ובו נכנסין לפני ולפנים״. וכן **ברטנורא** (יומא ה, א): ״ראשה כפולה לצד החיצון ונאחזת בקרס של זהב״.\n'
      r'**המאירי** (יומא ה, א): ״שהיה ראשה כפול על עצמה ונתונה בקרסי זהב על שאר היריעה כדי שלא תסגור כל הצד וישאר מקום כניסה״. ולא עשו את הפרוכות סגורות, שיגביה אותן בשעת הכניסה — ״שהרי אין ידיו פנויות להגביהן״: המחתה בימינו, והכף בשמאלו.\n'
      r'**תוספות יום טוב** (יומא ה, א): ״שהפרוכת על פני כל הדביר מכותל הצפון עד כותל הדרום״. ולדבריו, במקום הכפל הפרוכת ״היתה ארוכה ויצאת לחוץ לתוך ההיכל ונאחזת בכותל הדרום בקרס״; ״ועל שם הקרס מקרי פרופה כדמתרגם קרסי זהב. פורפין דדהב״.\n'
      r'במודל (ברירת המחדל): כל פרוכת מגיעה מכותל לכותל. הפינה התחתונה שליד הכותל — בחיצונה בדרום, ובפנימית בצפון — כפולה כלפי חוץ, אל צד ההיכל, ושוכבת על הפרוכת עצמה; קרס של זהב מחזיק את קצה הפינה. מתחת לכפל נשאר פתח בצורת משולש, ובו נכנס הכהן הגדול. גודל הכפל — חמש אמות לכל צד — בחירת מודל. ציורו של תוספות יום טוב, שהקצה הכפול יוצא אל ההיכל ונאחז בכותל הדרומי, לא צויר.')
T1 = (r'**תוספות רי״ד** (יומא נב:) מביא את פירוש רש״י, וכותב: ״ואינו נ״ל שאין זה דרך צניעות להיות הפתח פתוח וכל הכהנים הנכנסים בהיכל יציצו ויראו בית קדש הקדשים״.\n'
      r'ופירושו: ״שפרופה הוא שהיו קרסיו תקועין בכותל ולולאות היו בשפת הפרוכת״; ״וכל הפרכת מלמעלה למטה היתה מחוברת יפה ומהודקה״ בקרסים ובלולאות. ״אבל כשיעור כניסת הכהן היו מניחים שלא היו קושרים אותם בהידוק״, ובשעת הכניסה ״מסלק הלולאות מן הקרסים ופותח וכשרוצה לסגור מכניס הלולאות בקרסים״.\n'
      r'במודל: כל פרוכת סגורה, מכותל לכותל. בשני הכתלים — קרסים של זהב לכל הגובה, ובשפת הפרוכת — לולאות סביבם. ליד הפתח — בחיצונה בדרום, ובפנימית בצפון — בגובה הכניסה, הלולאות רפויות. בהדגמת כניסת הכהן הגדול ביום הכיפורים, הפינה שליד הפתח נפתחת כשהוא מגיע אליה — נכפלת לאחור, אל הצד שאליו הוא נכנס — ונסגרת אחריו. מספר הקרסים, גובה הכניסה וצורת הפתיחה — בחירת מודל.')
NEW_ROW = '''
        opRow({
          id: "sh56", short: "פריפת הפרוכות — רש״י או תוספות רי״ד", cardFly: true,
          cap: "פריפת הפרוכות — רש״י או תוספות רי״ד",
          refs: %s,
          options: [["o0", "רש״י — ראשה כפול ונאחז בקרס", "%s", %s], ["o1", "תוספות רי״ד — סגורה בקרסים ולולאות", "%s", %s]],
          current: "o0",
          onPick: (k) => { const F = ctx.shared.parochetFold; if (F && typeof F.set === "function") F.set(k === "o1" ? "rid" : "rashi"); },
          fly: (k) => { const c = {"o0": [[-35.5, 30.5, 1.5], [-44.5, 27.5, 7]], "o1": [[-35.5, 30.5, 1.5], [-44.5, 27.5, 7]]}[k]; if (c && c[0] && c[1]) fly(c[0], c[1]); }
        });
''' % (REFS_ALL, T0, REFS0, T1, REFS1)
for t in (T0, T1):
    assert '"' not in t, 'a plain quote in a card text'
rep('        opRow({ //\n          id: "sh48", short:', code(NEW_ROW) + '\n        opRow({ //\n          id: "sh48", short:', raw=True, label='row sh56')

rep('"kodeshHakodashim": ["sh47", "sh49"]', '"kodeshHakodashim": ["sh47", "sh56", "sh49"]', raw=True, label='ops V hh')
rep('"kodesh": ["sh39", "sh40", "sh41", "sh42", "sh45", "sh47", "sh49"]', '"kodesh": ["sh39", "sh40", "sh41", "sh42", "sh45", "sh47", "sh56", "sh49"]', raw=True, label='ops V kodesh')
rep('"שתי הפרוכות — בין הקודש לקודש הקדשים": ["sh47", "sh49"]', '"שתי הפרוכות — בין הקודש לקודש הקדשים": ["sh47", "sh56", "sh49"]', raw=True, label='ops P parochot')
rep('"הכהן הגדול נכנס בקטורת — הדגמה": ["sh47"]', '"הכהן הגדול נכנס בקטורת — הדגמה": ["sh47", "sh56"]', raw=True, label='ops P yk')

BUL_OLD = r'• **הפרוכות — שתיים או אחת:** לתנא קמא — שתי פרוכות ואמה ביניהן, וכן כתב הרמב״ם (ברירת המחדל); לרבי יוסי — פרוכת אחת בלבד.\n'
BUL_NEW = BUL_OLD + r'• **פריפת הפרוכות:** לרש״י — ראש הפרוכת כפול ונאחז בקרס של זהב, והפתח פתוח (ברירת המחדל); לתוספות רי״ד — הפרוכת מחוברת לכתלים בקרסים ובלולאות, ונפתחת בשעת הכניסה.\n'
rep(BUL_OLD, BUL_NEW, n=3, raw=True, label='bullets')

rep(r'במודל: שתי פרוכות ורווח אמה ביניהן, החיצונה פרופה בדרום והפנימית בצפון — הלחיצה מביאה את המבט לתוך האמה שבין הפרוכות, מן הדרום לצפון;',
    r'במודל: שתי פרוכות ורווח אמה ביניהן, כל אחת מן הכותל הצפוני עד הכותל הדרומי — ״שהפרוכת על פני כל הדביר מכותל הצפון עד כותל הדרום״ (תוספות יום טוב יומא ה, א); החיצונה פרופה בדרום והפנימית בצפון, כפי שנבחר במתג ״פריפת הפרוכות״ — הלחיצה מביאה את המבט לתוך האמה שבין הפרוכות, מן הדרום לצפון;',
    raw=True, label='place card model')
rep('["רש״י סוכה ז:", "Rashi_on_Sukkah.7.2"]], tourThen:', '["רש״י סוכה ז:", "Rashi_on_Sukkah.7.2"], ' + R_RASHI52 + ', ' + R_RID + ', ' + R_TYT + '], tourThen:', raw=True, label='place card refs')
# the place's view: between the two, along the amah, from inside the room (until 2.0.7 from z 9.75 - in the south liner, and now in
# the outer one's way in); the presentation's first look at the south opening - from the heichal, the fold and its hook in sight
rep('{ t: "שתי הפרוכות — בין הקודש לקודש הקדשים", tg: [-44.95, 24.6, -9], cam: [-45.05, 26.2, 9.75], info:',
    '{ t: "שתי הפרוכות — בין הקודש לקודש הקדשים", tg: [-45.1, 25.3, -9.3], cam: [-45.0, 29.5, 9.0], info:', raw=True, label='place cam')
rep('tourThen: [{"cam": [-41.5, 26, 6.5], "tg": [-45.2, 25.2, 9.4]}, {"cam": [-44.95, 26.2, -9.75], "tg": [-45.05, 24.6, 9]}]',
    'tourThen: [{"cam": [-38.0, 29.3, 3.0], "tg": [-44.6, 26.6, 7.6]}, {"cam": [-44.95, 26.2, -9.75], "tg": [-45.05, 24.6, 9]}]', raw=True, label='place tour')
rep('fly: (k) => { const c = {"o0": [[-45.05, 26.2, 9.75], [-44.95, 24.6, -9]], "o1": [[-45.05, 26.2, 9.75], [-44.95, 24.6, -9]]}[k];',
    'fly: (k) => { const c = {"o0": [[-45.0, 29.5, 9.0], [-45.1, 25.3, -9.3]], "o1": [[-45.0, 29.5, 9.0], [-45.1, 25.3, -9.3]]}[k];', raw=True, label='sh47 fly')
rep('ונכנס בפתח הפרוכת הפנימית.', 'ונכנס בפתח הפרוכת הפנימית. לשיטת תוספות רי״ד (המתג ״פריפת הפרוכות״) הפרוכות סגורות, והפינה שליד הפתח נפתחת כשהכהן הגדול מגיע אליה, ונסגרת אחריו.', raw=True, label='yk card')
rep('במודל: שולחנות שלמה בלי לחם ובלי בזיכים, ומנורותיו בלי נרות דולקים;',
    'במודל: שולחנות שלמה בצורת שולחן משה, כמו בבית ראשון — עם הסניפים, הקנים ושני הבזיכים, ריקים — אבל בלי לחם ובלי לבונה; ומנורותיו בלי נרות דולקים;', raw=True, label='sh45 text')

# the news (outsiders read it: what changed, where, and why)
NEWS = [
    r'**שתי הפרוכות — מכותל לכותל** — כל אחת משתי הפרוכות שבין ההיכל לקודש הקדשים מגיעה עכשיו מן הכותל הצפוני עד הכותל הדרומי. עד עכשיו צוירה כל פרוכת קצרה יותר, ובין קצה הפרוכת לכותל נשאר רווח — בחיצונה בדרום, ובפנימית בצפון — ובו היה הפתח.',
    r'**מתג חדש: פריפת הפרוכות — רש״י או תוספות רי״ד** — המשנה (יומא ה, א): ״החיצונה היתה פרופה מן הדרום, והפנימית מן הצפון״. ברירת המחדל, כרש״י (יומא נב:): הפינה התחתונה של הפרוכת, ליד הכותל, כפולה כלפי חוץ ונאחזת בקרס של זהב, ומתחתיה הפתח. האפשרות השנייה, כתוספות רי״ד (יומא נב:): הפרוכת סגורה, ומחוברת לשני הכתלים בקרסים ובלולאות לכל גובהה; ליד הפתח הלולאות רפויות, ובהדגמת כניסת הכהן הגדול ביום הכיפורים הפינה נפתחת כשהוא מגיע אליה, ונסגרת אחריו.',
    r'**שולחנות שלמה — בצורת שולחן משה** — כשבמתג ״שולחנות שלמה ומנורותיו — בבית שני״ נבחרה האפשרות של רש״י, עשרת השולחנות מצוירים עכשיו כמו שולחן לחם הפנים, וכמו בבית ראשון: עם הסניפים, הקנים ושני הבזיכים. אבל בלי לחם ובלי לבונה — ״ולא היו מסדרין אלא על של משה״ (מנחות צט.). עד עכשיו צוירו כשולחנות פשוטים.',
]
for t in NEWS:
    assert '"' not in t
items = '[' + ', '.join('"' + t + '"' for t in NEWS) + ']'
m = re.search(r'var UI_NEWS = \{ //\n    ver: "2\.0\.7",(.*) //\n    items: \[.*\] //\n', B)
if not m: print('FAIL news block'); sys.exit(1)
B = B[:m.start()] + 'var UI_NEWS = { //\n    ver: "2.0.8",' + m.group(1) + ' //\n    items: ' + items + ' //\n' + B[m.end():]
print('ok news')
rep('  var UI_NEWS_VERS = [ //\n    ["2.0.7", [', '  var UI_NEWS_VERS = [ //\n    ["2.0.8", ' + items + '], //\n    ["2.0.7", [', raw=True, label='news vers')

open(DST, 'w', encoding='utf-8').write(B)
print('written', DST)
