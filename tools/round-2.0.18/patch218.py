# -*- coding: utf-8 -*-
# Round 2.0.18 (Beit Sheni 2.0.9): the Tosafot Yom Tov's fold of the parochet (Way A), R. Meir's way of the High Priest, the bread and
# the lamps on Solomon's vessels, the nine parochot of the openings and the two of the upper storey (Ketubot 106a, Rambam Kelei
# HaMikdash 7:17). Applied to the built bundle of the second house (bundle208.js = 2.0.8 -> bundle218.js).
# Code blocks are given in source form: each non-empty line gets the bundle's " //" ending.
import sys, re
SRC, DST = '/home/claude/b2work/bundle208.js', '/home/claude/b2work/bundle218.js'
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

def noq(*ts):
    for t in ts:
        assert '"' not in t, 'a plain quote in a card text: ' + t[:60]

# ================================================================ A. the parochot: the Tosafot Yom Tov's fold (heichal.js)
rep('''
    // (5 amot each way), the hooks' spacing (2 amot), the side the corner opens to - model choices. The Tosafot Yom Tov's own picture
    // of the fold ("היתה ארוכה ויצאת לחוץ לתוך ההיכל ונאחזת בכותל הדרום בקרס") is told in the row's card, not drawn.
''', '''
    // (5 amot each way), the hooks' spacing (2 amot), the side the corner opens to - model choices. TYT_218 (2.0.9; the user, 17.11.2026:
    // "תוסיף תוספות יום טוב"; of the two ways shown him, "דרך א"): "tyt" - the Tosafot Yom Tov, Yoma 5:1 (898:155): "ור"ל שהפרוכת על פני
    // כל הדביר מכותל הצפון עד כותל הדרום. ושם בכותל דרום נכפלה ר"ל היתה ארוכה ויצאת לחוץ לתוך ההיכל ונאחזת בכותל הדרום בקרס"; so the
    // Ikar TYT (1025:116). The Rashash (Yoma 52b, 2494:568) asks: "וא"י איך יפרנס לפי פירושו מש"כ רש"י להיות פתוחה ועומדת" - held to the
    // wall, the corner is shut. Drawn (Way A): the parochet longer than the house is wide; its lower corner by the wall of the opening
    // drawn out east and up, its tip on a gold hook in that wall (TYT_Y over the floor, TYT_OUT east of the cloth) - the way in is under
    // it, along the wall. The inner one's corner goes into the amah between the two (TYT_AMAH, as much as the amah allows); alone (R.
    // Yose's and R. Meir's one parochet) - into the heichal, as the outer one's. The height, the reach and the corner's form - model choices.
''', label='par comment')

rep('''
    const PAR_W = 18.78, PAR_T = 0.12, PAR_FOLD = 5, PAR_LIFT = 0.16;   // liner to liner (a hair into each); the cloth; the corner's legs; the fold off the face
''', '''
    const PAR_W = 18.78, PAR_T = 0.12, PAR_FOLD = 5, PAR_LIFT = 0.16;   // liner to liner (a hair into each); the cloth; the corner's legs; the fold off the face
    const TYT_OUT = 3, TYT_AMAH = 0.35, TYT_Y = 5.5;   // TYT_218: the corner's reach east into the heichal, into the amah; the hook's height
''', label='tyt consts')

rep('''
    const mkPar = (x, open, hh) => {
''', '''
    const mkPar = (x, open, hh, reaches) => {
''', label='mkPar sig')

rep('''
      const p = { G, open, zo: open * (PAR_W / 2 - 0.4), k: 0, want: 0 };   // zo: the way in, by the wall
''', '''
      // TYT_218: the Tosafot Yom Tov's corner - one flap for each reach (the inner parochet's two: in the amah, and alone in the heichal).
      // The flap is the triangle of the fold's line (A on the floor, C on the wall's edge) and the tip H on its hook; its woven faces carry
      // on the weave of the parochet - the tip laid back into the cloth's plane on the corner's side (h2), longer than the house is wide.
      const tytFlaps = [];
      for (const reach of reaches || [TYT_OUT]) {
        const T = new Group();
        T.visible = false;
        const zh = open * (PAR_W / 2 - 0.13);
        const A = new Vector3(0, 0, zi), C = new Vector3(0, PAR_FOLD, zw), H = new Vector3(reach, TYT_Y, zh);
        const n = C.clone().sub(A).cross(H.clone().sub(A)).normalize();
        const a2 = [A.z, A.y], c2 = [C.z, C.y], L2 = Math.hypot(c2[0] - a2[0], c2[1] - a2[1]);
        const e1 = [(c2[0] - a2[0]) / L2, (c2[1] - a2[1]) / L2];
        let e2 = [e1[1], -e1[0]];
        if ((zw - a2[0]) * e2[0] + (0 - a2[1]) * e2[1] < 0) e2 = [-e2[0], -e2[1]];
        const dAH = A.distanceTo(H), dCH = C.distanceTo(H), ua = (dAH * dAH - dCH * dCH + L2 * L2) / (2 * L2), ub = Math.sqrt(Math.max(0, dAH * dAH - ua * ua));
        const h2 = [a2[0] + ua * e1[0] + ub * e2[0], a2[1] + ua * e1[1] + ub * e2[1]];
        {
          const up = [A, C, H].map((q) => q.clone().addScaledVector(n, PAR_T / 2)), dn = [A, C, H].map((q) => q.clone().addScaledVector(n, -PAR_T / 2));
          const q3 = [];
          const f3 = (a, b, c) => q3.push(a.x, a.y, a.z, b.x, b.y, b.z, c.x, c.y, c.z);
          f3(up[0], up[1], up[2]);
          f3(dn[0], dn[2], dn[1]);
          for (let i = 0; i < 3; i++) { const j = (i + 1) % 3; f3(up[i], dn[i], dn[j]); f3(up[i], dn[j], up[j]); }
          const sg = new BufferGeometry();
          sg.setAttribute("position", new Float32BufferAttribute(q3, 3));
          sg.computeVertexNormals();
          const m = new Mesh(sg, M2.parochet);
          m.castShadow = m.receiveShadow = true;
          T.add(m);
        }
        // the two woven faces: the face that looked toward the heichal (sd +1) is turned up as the corner is drawn out east and up - the
        // side of n with y > 0 (o: +1 along n, -1 against it)
        const upN = n.y >= 0 ? 1 : -1;
        for (const sd of [1, -1]) {
          const o = upN * sd, pts = o > 0 ? [A, C, H] : [A, H, C], uv = o > 0 ? [a2, c2, h2] : [a2, h2, c2];
          const fg = new BufferGeometry();
          fg.setAttribute("position", new Float32BufferAttribute(pts.flatMap((q) => [q.x + n.x * o * 0.065, q.y + n.y * o * 0.065, q.z + n.z * o * 0.065]), 3));
          fg.setAttribute("uv", new Float32BufferAttribute(uv.flatMap((q) => [sd > 0 ? -q[0] : q[0], q[1]]), 2));
          fg.computeVertexNormals();
          const f = new Mesh(fg, M2.parochet);
          f.receiveShadow = true;
          T.add(f);
          parFaces.push([f, sd]);
        }
        // the bend on the fold's line; the hook - a gold peg out of the wall, and the ring of the tip on it
        const bend = new Mesh(new CylinderGeometry(0.08, 0.08, PAR_FOLD * Math.SQRT2, 10), M2.parochet);
        bend.geometry.rotateX(Math.PI / 2);
        bend.position.set(0, PAR_FOLD / 2, (zi + zw) / 2);
        bend.rotation.x = open > 0 ? -Math.PI / 4 : Math.PI / 4;
        T.add(bend);
        parRolls.push(bend);
        const pegT = new Mesh(new CylinderGeometry(0.05, 0.05, 0.3, 10), M2.gold);
        pegT.geometry.rotateX(Math.PI / 2);
        pegT.position.set(reach, TYT_Y + 0.05, open * (PAR_W / 2 - 0.15));
        const ringT = new Mesh(new TorusGeometry(0.16, 0.04, 8, 18), M2.gold);
        ringT.position.set(reach, TYT_Y - 0.06, zh);
        T.add(pegT, ringT);
        G.add(T);
        tytFlaps.push(T);
      }
      const p = { G, open, zo: open * (PAR_W / 2 - 0.4), k: 0, want: 0, tytI: 0 };   // zo: the way in, by the wall; tytI: which flap (TYT_218)
''', label='tyt flaps')

rep('''
        else { P.rotation.z = Math.PI; P.position.x = PAR_LIFT; }
        rashi.visible = !r;
        rid.visible = ridQ.visible = r;
''', '''
        else { P.rotation.z = Math.PI; P.position.x = PAR_LIFT; }
        const ty = mode === "tyt";   // TYT_218: the corner drawn out to its hook (tytFlaps) instead of the folded one
        P.visible = !ty;
        rashi.visible = !r && !ty;
        rid.visible = ridQ.visible = r;
        tytFlaps.forEach((T, i) => { T.visible = ty && i === Math.min(p.tytI, tytFlaps.length - 1); });
''', label='pose')

rep('''
    const parOut = mkPar(-44.5, 1, PAR_H), parIn = mkPar(-45.5, -1, PAR_H - PAR_BEND);
''', '''
    const parOut = mkPar(-44.5, 1, PAR_H, [TYT_OUT]), parIn = mkPar(-45.5, -1, PAR_H - PAR_BEND, [TYT_AMAH, TYT_OUT]);
''', label='mkPar calls')

rep('''
        this.mode = k === "rid" ? "rid" : "rashi";
''', '''
        this.mode = k === "rid" ? "rid" : k === "tyt" ? "tyt" : "rashi";
''', label='fold set')

rep('''
          const one = k === "one";
          this.mode = one ? "one" : "two";
          parOut.G.visible = !one;
          parIn.G.position.x = one ? -44.5 : -45.5;   // PAROCHET_217: its faces, corner, hooks and head with it
''', '''
          const one = k === "one" || k === "meir";   // MEIR_218: R. Meir's one parochet - as R. Yose's ("לעולם כרבי יוסי סבירא ליה")
          this.mode = k === "meir" ? "meir" : one ? "one" : "two";
          parOut.G.visible = !one;
          parIn.G.position.x = one ? -44.5 : -45.5;   // PAROCHET_217: its faces, corner, hooks and head with it
          parIn.tytI = one ? 1 : 0;   // TYT_218: alone, its corner goes into the heichal; of two, into the amah
          parIn.pose(parFold.mode);
''', label='count set')

# ---- the High Priest's walk: the outer opening reached along the south wall (under the Tosafot Yom Tov's corner), and R. Meir's way
rep('[9.3, -40.0, 5.6], [10.6, -43.3, 8.6], [11.4, -44.95, 9.25]', '[9.3, -40.0, 5.6], [10.1, -41.3, 7.9], [10.7, -43.3, 8.75], [11.4, -44.95, 9.25]', raw=True, label='path two')
rep('''
          one: [[0, -7.5, -1.2], [1.6, -11.5, -6.6], [2.5, -14.0, -8.8], [11.6, -43.2, -8.9], [12.4, -44.9, -9.25], [13.1, -45.1, -8.4], [15.8, -45.1, -0.5], [16.6, -46.7, 0]]
        };
''', '''
          one: [[0, -7.5, -1.2], [1.6, -11.5, -6.6], [2.5, -14.0, -8.8], [11.6, -43.2, -8.9], [12.4, -44.9, -9.25], [13.1, -45.1, -8.4], [15.8, -45.1, -0.5], [16.6, -46.7, 0]],
          // MEIR_218 (the user, 17.11.2026: "יש להוסיף גם את דעת ר' מאיר"; "רבי מאיר הוא עוד שיטה"): "רבי מאיר אומר: בין שלחן למזבח" (Yoma
          // 51b; 107:1318); "לעולם כרבי יוסי סבירא ליה" (1320) - the opening in the north, one parochet (the Meiri, 2199:464; the Tosafot Yom
          // Tov, 898:156: "אליבא דר"מ דס"ל כר' יוסי שלא היה אלא פרוכת אחת"). His way: west between the table and the altar, past the table
          // turned north, along the north wall to the opening (the Ritva, 1940:789: "שבא מדרום המזבח ונכנס בין השלחן שבצפון ולמזבח ויוצא
          // ונכנס בפתח שבצפון"); inside as R. Yose's
          meir: [[0, -7.5, -1.2], [2.6, -15.5, -2.4], [7.6, -31.5, -3.4], [9.4, -37.0, -3.6], [11.0, -40.4, -6.6], [11.9, -42.0, -8.7], [12.6, -43.6, -8.95], [13.2, -44.9, -9.25], [13.9, -45.1, -8.4], [16.6, -45.1, -0.5], [17.4, -46.7, 0]]
        };
''', label='path meir')

rep('''
          one: [[20.0, -45.1, -5.0, 0], [21.2, -45.1, -9.25, 0], [22.0, -43.5, -9.0, WESTY], [23.2, -41.6, -7.6, WESTY]]
        };
''', '''
          one: [[20.0, -45.1, -5.0, 0], [21.2, -45.1, -9.25, 0], [22.0, -43.5, -9.0, WESTY], [23.2, -41.6, -7.6, WESTY]],
          meir: [[20.8, -45.1, -5.0, 0], [22.0, -45.1, -9.25, 0], [22.8, -43.5, -9.0, WESTY], [24.0, -41.0, -6.6, WESTY]]
        };
''', label='back meir')

rep('''
            [26.4, [-37.6, E(-37.6, 3.6), -3.2], [-42.0, E(-42, 2.3), -7.6]]
          ]
''', '''
            [26.4, [-37.6, E(-37.6, 3.6), -3.2], [-42.0, E(-42, 2.3), -7.6]]
          ],
          meir: [
            [0, [-5.6, E(-5.6, 3.6), 1.0], [-12, E(-12, 2.4), -1.6]],
            [2.8, [-10.0, E(-10, 3.6), -0.6], [-18, E(-18, 2.3), -2.8]],
            [7.6, [-24.5, E(-24.5, 3.7), -1.8], [-33, E(-33, 2.3), -3.6]],
            [9.6, [-30.0, E(-30, 3.7), -2.4], [-39, E(-39, 2.3), -4.6]],
            [11.4, [-34.5, E(-34.5, 3.6), -3.6], [-43.0, E(-43, 2.3), -8.6]],
            [13.4, [-40.6, E(-40.6, 3.5), -7.4], [-45.2, E(-45, 2.3), -9.1]],
            [18.9, [-40.9, E(-40.9, 3.5), -7.2], [-45.2, E(-45, 2.3), -9.1]],
            [20.1, [-38.5, E(-38.5, 3.6), -4.0], [-44.4, E(-44.4, 2.3), -9.0]],
            [24.9, [-37.6, E(-37.6, 3.6), -3.2], [-42.0, E(-42, 2.3), -7.6]],
            [26.9, [-37.6, E(-37.6, 3.6), -3.2], [-42.0, E(-42, 2.3), -7.6]]
          ]
''', label='keys meir')

rep('''
        const HOLD = { two: 4, one: 4.6 }, HOLD_FROM = { two: 21.4, one: 18.4 };
        for (const k of ["two", "one"]) {
''', '''
        const HOLD = { two: 4, one: 4.6, meir: 4.6 }, HOLD_FROM = { two: 21.4, one: 18.4, meir: 18.9 };
        for (const k of ["two", "one", "meir"]) {
''', label='hold meir')

rep('''
                [16.4, C_EVEN], [16.4 + 4.2, C_IN], [19.4 + HOLD.one, C_OUT]]
''', '''
                [16.4, C_EVEN], [16.4 + 4.2, C_IN], [19.4 + HOLD.one, C_OUT]],
          meir: [[0, C0], [2.8, "״רבי מאיר אומר: בין שלחן למזבח״ — ״לעולם כרבי יוסי סבירא ליה״: הפתח בצפון (יומא נא:)"],
                [6.6, "״שולחנות צפון ודרום מונחין, ומפסקא ליה שלחן ולא מתעייל ליה״"],
                [9.8, "״ואיבעית אימא: לעולם מזרח ומערב מונחין, ומשום שכינה לאו אורח ארעא למיעל להדיא״ (יומא נא:–נב.)"],
                [13.2, C_ARON.replace("״הגיע לצפון, הופך", "״הופך")],
                [17.2, C_EVEN], [17.2 + 4.2, C_IN], [20.2 + HOLD.meir, C_OUT]]
''', label='caps meir')

rep('''
          Y.mode = ctx2.shared.parochotCount && ctx2.shared.parochotCount.mode === "one" ? "one" : "two";
''', '''
          { const pc = ctx2.shared.parochotCount; Y.mode = pc && (pc.mode === "one" || pc.mode === "meir") ? pc.mode : "two"; }   // MEIR_218
''', label='y mode')

rep('בדרך שנבחרה במתג ״הפרוכות — שתיים או אחת״.', 'בדרך שנבחרה במתג ״הפרוכות ודרך הכהן הגדול״.', raw=True, label='demo title')

# ================================================================ B. Solomon's vessels: the bread and the lamps (vessels.js)
rep('''
      SOL.mSideEW = mk(menorahGeo.sideEW, menBody.material, false);
      SOL.TBL0 = { x: TBL.x, z: TBL.z };
''', '''
      SOL.mSideEW = mk(menorahGeo.sideEW, menBody.material, false);
      // SOLOMON_LIT_218 (the user, 17.11.2026: "כן, להוסיף מתג"; "כמו עכשיו: על כולם יחד"): "רבי אלעזר בן שמוע אומר: על כולם היו
      // מסדרין... ובכולן היו מדליקין" (Menachot 99a; 131:3530; so R. Yose b. R. Yehuda in the Jerusalem Talmud, Shekalim 6:3, 154:206) -
      // the loaves and the frankincense on each of the ten, and the seven lamps of each of the ten alight (SOL.lit); the Tanna Kamma's
      // "ולא היו מסדרין אלא על של משה... ולא היו מדליקין אלא בשל משה" (3528-3529) is the default. All of them at once - the user's
      // choice; Rashi there: "על כולן היו מסדרין - פעמים בזה פעמים בזה" (2186:4706), told in the card. No lights of their own (the
      // flames only).
      SOL.lit = false;
      SOL.tBread = BREAD_SH.shaped(mk(tableGeo.bread, breadMat, false), tableGeo.bread, tableGeo.breadB);
      SOL.tIncense = mk(tableGeo.incense, incenseMat, false);
      SOL.flames = int_inst(sg, flameG, flameMat, Array.from({ length: 70 }, () => int_m4(0, -50, 0, 0, 0, 0)), false);
      SOL.flamePos = [];   // [x, y, z, rot] of the seventy
      for (const im of [SOL.tBread, SOL.tIncense, SOL.flames]) im.visible = false;
      SOL.TBL0 = { x: TBL.x, z: TBL.z };
''', label='sol lit parts')

rep('''
        L.mens.forEach(([x, z, r], i) => { const m = int_part(x, FLx(x), z, r, 0, 0, 0); for (const im of [SOL.mBody, SOL.mMidNS, SOL.mSideNS, SOL.mMidEW, SOL.mSideEW]) im.setMatrixAt(i, m); });
''', '''
        L.mens.forEach(([x, z, r], i) => { const m = int_part(x, FLx(x), z, r, 0, 0, 0); for (const im of [SOL.mBody, SOL.mMidNS, SOL.mSideNS, SOL.mMidEW, SOL.mSideEW]) im.setMatrixAt(i, m); });
        // SOLOMON_LIT_218: the loaves and the frankincense on each table; each menorah's seven flames, on its lamps as Moses' (flameXZ)
        L.tables.forEach(([x, z, r], i) => { const m = int_part(x, FLx(x), z, r, 0, 0, 0); SOL.tBread.setMatrixAt(i, m); SOL.tIncense.setMatrixAt(i, m); });
        SOL.flamePos.length = 0;
        L.mens.forEach(([x, z, r]) => {
          const ew = Math.abs(r) < 1e-6;
          for (const dx of lampX) { const d = ew ? dx - SPT : dx === 0 ? 0 : dx - Math.sign(dx) * SPT; SOL.flamePos.push([x + d * Math.cos(r) - (!ew && dx === 0 ? SPT : 0), FLx(x) + FLY, z - d * Math.sin(r), r]); }
        });
        SOL.flamePos.forEach((q, i) => SOL.flames.setMatrixAt(i, int_m4(q[0], q[1], q[2], 0, q[3], 0)));
        for (const im of [SOL.tBread, SOL.tIncense, SOL.flames]) {
          im.instanceMatrix.needsUpdate = true;
          if (im.computeBoundingSphere) im.computeBoundingSphere();
          if (im.computeBoundingBox) im.computeBoundingBox();
        }
''', label='sol place lit')

rep('''
        hold(on) { this.held = !!on; sg.visible = SOL.on && !this.held; },
        layout: () => SOL.layout()   // (tests)
      };
''', '''
        hold(on) { this.held = !!on; sg.visible = SOL.on && !this.held; },
        layout: () => SOL.layout(),   // (tests)
        // SOLOMON_LIT_218: the bread, the frankincense and the lamps on all ten (the row "סידור הלחם והדלקת הנרות בכלי שלמה")
        lit: false,
        setLit(on) { this.lit = SOL.lit = !!on; for (const im of [SOL.tBread, SOL.tIncense, SOL.flames]) im.visible = SOL.lit; SOL.place(); return this.lit; }
      };
      // the seventy flames flicker as Moses' seven
      ctx2.animated.push((t) => {
        if (!SOL.lit || !sg.visible) return;
        SOL.flamePos.forEach((q, i) => {
          const s = 1 + 0.28 * Math.sin(t * 0.012 + i * 1.9) * Math.sin(t * 43e-4 + i);
          SOL.flames.setMatrixAt(i, int_m4(q[0], q[1], q[2], Math.sin(t * 9e-3 + i) * 0.1, q[3], Math.cos(t * 0.011 + i * 2) * 0.1, 1, s, 1));
        });
        SOL.flames.instanceMatrix.needsUpdate = true;
      });
''', label='sol setLit')

# ================================================================ C. the parochot of the openings and of the upper storey (heichal.js)
rep('''
      instMesh(g, pg, M2.cedar, [-8, -6, -4, -2, 0, 2, 4, 6, 8].map((z) => m4(-45, 67.6, z)), false);
''', '''
      // ALIYAH_PAR_218: in two rows - the middle one stands only in the reading of the parochot from wall to wall (below, aliyahParochot)
      instMesh(g, pg, M2.cedar, [-8, -6, 6, 8].map((z) => m4(-45, 67.6, z)), false);
      ctx2.__pispMid = instMesh(g, pg, M2.cedar, [-4, -2, 0, 2, 4].map((z) => m4(-45, 67.6, z)), false);
''', label='pispasin split')

rep('''
      ctx2.shared.parochetArt.set("rashi");
''', '''
      ctx2.shared.parochetArt.set("rashi");
      // GATE_PAROCHOT_218 (the user, 17.11.2026: "בית שני היו י"ג פרוכות... וא"כ צריך להוסיף את הפרוכות שתלויות היו על חלל הפתחים";
      // of the ways shown him: "פרוסות עם מתג להגבהה / במקרה של הדגמה / מבט שנפתח ונחסם יוגבה אוטומטית", "מבחוץ, כמו בהיכל"): THE
      // PAROCHOT OF THE OPENINGS. "דאמר רבי זירא אמר רב: שלש עשרה פרכות היו במקדש שני, שבע כנגד שבעה שערים, אחת לפתחו של היכל, ואחת
      // לפתחו של אולם. שתים בדביר, שתים כנגדן בעליה" (Ketubot 106a; 116:3032; Yoma 54a, 107:1412); Rashi: "בדבבי - בפרכות שכנגד הפתחים
      // דלצניעותא עבידי" (2168:4902), "ז' שערים - לעזרה" (4903); the Rambam (Kelei HaMikdash 7:17; 338:118): "שבע על שבעה שערי העזרה
      // ואחת על פתח האולם ואחת על פתח ההיכל ושתים לדביר בינו ובין הקדש ושתים כנגדן בעליה". The heichal's: "ארכה עשרים אמה ורחבה עשר...
      // והיתה פרוסה על פתחו של היכל מבחוץ" (Tosefta Shekalim 3:11; 193:40); the ulam's - it had no doors (Middot 2:3, 89:14: "כל
      // הפתחים שהיו שם היו להן דלתות חוץ משל אולם"; the Bartenura, Tamid 7:1, 634:222: "אלא פרכת בלבד"). Each hangs OUTSIDE its opening
      // (the heichal's by the Tosefta, the others as it - the user), the size of the opening (the gates and the heichal 10 x 20 - Middot
      // 2:3, 4:1; the ulam 20 x 40 - 3:7); the court's gates are the seven of the Tanna of Middot 1:4 (the Tosafot, Ketubot 106a;
      // 1914:1407), Beit HaMoked's door to the court among them (its outside - the hall of Beit HaMoked). Spread (the default) or raised -
      // rolled up under the lintel and tied: "שהיה הפרכת כל היום מגבה ועומד על ידי קשרים ויתרות" (the Ikar TYT, Tamid 7:1; 1075:171),
      // "מגללין להם את הפרוכת" (Yoma 54a) - the row "פרוכות הפתחים" (ctx2.shared.gateParochot). Spread, a parochet is raised by itself
      // while a demonstration runs and while the eye looks through its opening (the line from the camera to its target crosses it), and
      // comes down after. The weave - the parochet's, without figures; the gold rod, the roll and the ties - model choices.
      {
        const weave = M.plain.clone();
        weave.side = DoubleSide;
        const GC = [];
        // axis "x": a wall along x, its outside toward out (z); axis "z": a wall along z, its outside toward out (x). c - the curtain's
        // plane (z, or x); m - the opening's middle along the wall; w, h - the width and the height; top - the lintel's underside
        const mkGC = (name, axis, c, m, w, h, top, out) => {
          const grp = new Group();
          grp.name = "parochet-" + name;
          if (axis === "x") grp.position.set(m, top, c);
          else { grp.position.set(c, top, m); grp.rotation.y = Math.PI / 2; }
          const pgeo = new PlaneGeometry(w, h);
          pgeo.translate(0, -h / 2, 0);
          const uva = pgeo.attributes.uv;
          for (let i = 0; i < uva.count; i++) uva.setXY(i, uva.getX(i) * w, uva.getY(i) * h);
          const panel = new Mesh(pgeo, weave);
          panel.castShadow = panel.receiveShadow = true;
          const rod = new Mesh(new CylinderGeometry(0.07, 0.07, w + 0.5, 10), M2.gold);
          rod.rotation.z = Math.PI / 2;
          rod.position.y = -0.06;
          const rgeo = new CylinderGeometry(1, 1, w, 18);
          rgeo.rotateZ(Math.PI / 2);
          const roll = new Mesh(rgeo, weave);
          roll.castShadow = true;
          const ties = new Group();
          for (const sx of [-1, 1]) for (const sz of [-1, 1]) {
            const tie = new Mesh(new BoxGeometry(0.14, 1, 0.03), M2.gold);
            tie.position.x = sx * w * 0.3;
            tie.userData.sz = sz;
            ties.add(tie);
          }
          grp.add(panel, rod, roll, ties);
          g.add(grp);
          const o = { name, axis, c, m, w, h, top, out, grp, u: 0, want: 0 };
          o.pose = () => {
            const e = o.u * o.u * (3 - 2 * o.u), left = h * (1 - 0.95 * e), r = 0.1 + 0.32 * e;
            panel.scale.y = Math.max(0.001, 1 - 0.95 * e);
            roll.scale.set(1, r, r);
            roll.position.set(0, -left - r * 0.6, 0);
            ties.visible = e > 0.25;
            for (const tie of ties.children) { const len = left + r * 1.7; tie.scale.y = len; tie.position.y = -len / 2; tie.position.z = tie.userData.sz * (r + 0.03); }
          };
          o.pose();
          GC.push(o);
          return o;
        };
        for (const x of [-78, -48]) mkGC("north" + x, "x", -70.7, x, 10.6, 20, 33.5, -1);
        for (const x of [-78, -48, -18]) mkGC("south" + x, "x", 70.7, x, 10.6, 20, 33.5, 1);
        mkGC("moked", "x", -58.65, -18, 10.4, 20, 36, -1);
        mkGC("nikanor", "z", 98.0, 0, 11.2, 20.7, 34.2, 1);
        mkGC("heichal", "z", 1.65, 0, 10.6, 20, F + 20, 1);
        const ulamGC = mkGC("ulam", "z", 17.75, 0, 20.6, 40, F + 40, 1);
        if (Array.isArray(ctx2.shared.__ulamFrontCut)) ctx2.shared.__ulamFrontCut.push(ulamGC.grp);   // "פתח את האולם" takes it with the front
        const GP = ctx2.shared.gateParochot = { mode: "down", list: GC, set(k) { this.mode = k === "up" ? "up" : "down"; return this.mode; } };
        const SEE = new Vector3();
        const sees = (o) => {
          const cam = ctx2.camera && ctx2.camera.position, tg = ctx2.controls && ctx2.controls.target;
          if (!cam) return false;
          const along = (v) => (o.axis === "x" ? v.x : v.z), across = (v) => (o.axis === "x" ? v.z : v.x);
          const inside = (al, y) => Math.abs(al - o.m) < o.w / 2 + 0.6 && y > o.top - o.h - 0.6 && y < o.top + 0.6;
          const da = across(cam) - o.c;
          if (Math.abs(da) < 1.6 && inside(along(cam), cam.y)) return true;   // the eye in the opening itself
          if (!tg) return false;
          const db = across(tg) - o.c;
          if (da * db > 0 || da === db) return false;
          SEE.copy(tg).sub(cam).multiplyScalar(da / (da - db)).add(cam);
          return inside(along(SEE), SEE.y);
        };
        const demoOn = () => (ctx2.shared.demoStops || []).some((d) => { try { return !!(d && typeof d.running === "function" && d.running()); } catch (_) { return false; } });
        let gcT = 0;
        ctx2.animated.push((t) => {
          const dt = gcT ? Math.min(0.1, Math.max(0, (t - gcT) / 1000)) : 0;
          gcT = t;
          const up = GP.mode === "up", demo = !up && demoOn();
          for (const o of GC) {
            o.want = up || demo || sees(o) ? 1 : 0;
            const d = o.want - o.u;
            if (Math.abs(d) < 1e-4) continue;
            o.u = dt ? o.u + Math.max(-0.9 * dt, Math.min(0.9 * dt, d)) : o.want;
            o.pose();
          }
        });
      }
      // ALIYAH_PAR_218 (the user, 17.11.2026, of the two in the upper storey: "תביא את הלחם שמים והחולקים עליו", "תעשה מתג לשתי השיטות"):
      // "ושתים כנגדן בעליה" (Rav, Ketubot 106a); Rashi: "להבדיל בין עליית היכל לעליית קדשי הקדשים וגם הן במקום אמה טרקסין" (2168:4905);
      // with "וראשי פספסין מבדילים בעליה בין הקדש לבין קדש הקדשים" (Middot 4:5; 89:32). "wall" (the default) - the Tosafot Yom Tov (Middot
      // 4:5; 948:167: "דשתי פרוכות היו מבדילות בעלייה... וא"כ קשיא תרתי למה לי" - and the pispasin for the storey's greater holiness),
      // the Yachin (819:570), the Meleches Shlomo (1210:164: "כדי להפסיק בין שתי עליות"): two parochot an amah apart, from wall to wall,
      // from the storey's floor to its ceiling (67..107; Middot 4:6), over the two below, the row of the pispasin between them; shut. "ls"
      // - the Lechem Shamayim (Middot 4:5; 1145:96): "מ"מ לא היו רחבות כל כך ולא מגיעות בעליה עד הכותלים... שהפספסין יוצאין מן הכתלים
      // בצפון ובדרום ומגיעין עד הבדלת הפרוכת": the parochot in the middle (ten amot wide - a model choice), the pispasin from the walls to
      // them. The weave - as the openings' (without figures).
      {
        const weave = M.plain.clone();
        weave.side = DoubleSide;
        const mkA = (x, w) => {
          const pgeo = new PlaneGeometry(w, 40);
          const uva = pgeo.attributes.uv;
          for (let i = 0; i < uva.count; i++) uva.setXY(i, uva.getX(i) * w, uva.getY(i) * 40);
          const m = new Mesh(pgeo, weave);
          m.rotation.y = Math.PI / 2;
          m.position.set(x, 87, 0);
          m.castShadow = m.receiveShadow = true;
          g.add(m);
          return m;
        };
        const AW = [mkA(-44.5, 19.94), mkA(-45.5, 19.94)], AL = [mkA(-44.5, 10), mkA(-45.5, 10)];
        for (const m of AL) m.visible = false;
        ctx2.shared.aliyahParochot = {
          mode: "wall",
          set(k) {
            this.mode = k === "ls" ? "ls" : "wall";
            const ls = this.mode === "ls";
            for (const m of AW) m.visible = !ls;
            for (const m of AL) m.visible = ls;
            if (ctx2.__pispMid) ctx2.__pispMid.visible = !ls;
            return this.mode;
          }
        };
      }
''', label='gate parochot')

# ================================================================ D. the rows, the cards, the places, the news (ui.js)
import json
def R(label, book, index):
    return [label, {"book": book, "index": index}]
def jd(x):
    return json.dumps(x, ensure_ascii=False)

def row_span(rid):
    i = B.find('        opRow({ //\n          id: "%s",' % rid)
    if i < 0: print('FAIL row', rid); sys.exit(1)
    j = B.find('        }); //\n', i) + len('        }); //\n')
    return i, j

def row_get(rid, key):
    i, j = row_span(rid)
    blk = B[i:j]
    m = re.search(r'\n          %s: (\[.*\]), //\n' % key, blk)
    if not m: print('FAIL row key', rid, key); sys.exit(1)
    return json.loads(m.group(1))

def row_set(rid, key, val):
    global B
    i, j = row_span(rid)
    blk = B[i:j]
    m = re.search(r'\n          %s: (\[.*\]), //\n' % key, blk)
    blk = blk[:m.start(1)] + jd(val) + blk[m.end(1):]
    B = B[:i] + blk + B[j:]
    print('ok row', rid, key)

def row_rep(rid, old, new):
    global B
    i, j = row_span(rid)
    blk = B[i:j]
    if blk.count(old) != 1: print('FAIL row rep', rid, old[:50], blk.count(old)); sys.exit(1)
    B = B[:i] + blk.replace(old, new) + B[j:]
    print('ok row rep', rid)

# ---- sh47: R. Meir, a third reading
T_MEIR = (r'הברייתא (יומא נא:): ״תנו רבנן: בין המזבח למנורה היה מהלך, דברי רבי יהודה. רבי מאיר אומר: בין שלחן למזבח. ויש אומרים: בין שלחן לכותל״.\n'
    r'הגמרא שואלת: ״ורבי מאיר כמאן סבירא ליה? אי כרבי יהודה סבירא ליה — ניעול כרבי יהודה, אי כרבי יוסי סבירא ליה — ניעול כרבי יוסי!״ ומשיבה: ״לעולם כרבי יוסי סבירא ליה, ואמר לך: שולחנות צפון ודרום מונחין, ומפסקא ליה שלחן ולא מתעייל ליה. ואיבעית אימא: לעולם מזרח ומערב מונחין, ומשום שכינה לאו אורח ארעא למיעל להדיא״.\n'
    r'**רש״י** (יומא נא:): ״בין שולחן ולמזבח — דרך הצפון״. ״שולחנות צפון ודרום מונחין — עשר שולחנות עשה שלמה... חמש בשורה אחת... ועל כרחך צריך היה לסמוך ראש השולחן הצפוני לכותל... הלכך מפסקי שולחנות את הדרך ולא מתעייל ליה בין שולחן לכותל״. ועל ״למיעל להדיא״ (נב.): ״לילך אצל הכותל הצפוני כל אורך ההיכל, וכל שעה עיניו נזונות מבית קדשי הקדשים דרך הפריפה שכנגדו״.\n'
    r'**הריטב״א** (יומא נא:): ״שבא מדרום המזבח ונכנס בין השלחן שבצפון ולמזבח, ויוצא ונכנס בפתח שבצפון, דסבי׳ לי׳ כר׳ יוסי דפתח׳ בצפון קאי״.\n'
    r'**המאירי** (יומא נא:): ״ור׳ מאיר אף הוא סובר שלא היתה שם אלא פרוכת אחת, אלא שאומר שדרך מהלכו היה בין מזבח לשלחן משתי סבות״. והסיבה השנייה: ״אם הוא נכנס בין שלחן לכותל נמצא בעודו בהיכל מכוון כנגד הפירוף ורואה לפנים... ונוח לו שיעקם בין מזבח לשלחן שלא יראה בפנים עד שיגיע לפירוף עצמו״.\n'
    r'**תוספות יום טוב** (יומא ה, א): ״כדאמר בגמרא אליבא דר״מ דס״ל כר׳ יוסי שלא היה אלא פרוכת אחת, ומצריכו שלא יכנס בהיכל כנגד הפריפה כדי שלא יזונו עיניו״.\n'
    r'**רבינו חננאל** גורס בברייתא הפוך: ״בין המזבח למנורה... דברי ר׳ מאיר״, ו״ר׳ יהודה שהיה אומר בין המזבח לשלחן... לעולם ר׳ יהודה פתחא בצפון קאי״. גם לגרסתו, מי שהולך בין השולחן למזבח סובר שהפתח בצפון.\n'
    r'**לחם שמים** (מידות ד, ה): דברי רב, ששתי פרוכות היו בדביר ושתיים כנגדן בעלייה — ״אליבא דרבי מאיר התם, דשתי פרוכות הוו למטה״; כלומר, לדעתו לרבי מאיר שתי פרוכות. ובפירושו ליומא (ה, א) הוא מבאר את דרכו בבית ראשון: ״דרך ישר נגד הפתח, והוא בין שולחן למזבח כר״מ״.\n'
    r'במודל: פרוכת אחת, כרבי יוסי, ופתחה בצפון — כמאירי וכתוספות יום טוב. בהדגמת הכהן הגדול: הוא מהלך בין השולחן למזבח, ואחרי השולחן פונה לצפון, אל הפתח, ונכנס בו כבשיטת רבי יוסי.')
noq(T_MEIR)
REFS_MEIR = [R('יומא נא:', 107, 1318), R('יומא נא: (כמאן סבירא ליה)', 107, 1319), R('יומא נא: (שולחנות צפון ודרום)', 107, 1320), R('יומא נב. (למיעל להדיא)', 107, 1323),
    R('רש״י יומא נא:', 2157, 1951), R('רש״י יומא נב.', 2157, 1953), R('ריטב״א יומא נא:', 1940, 789), R('מאירי יומא נא:', 2199, 464), R('תוי״ט יומא ה, א (מן הדרום)', 898, 156),
    R('רבינו חננאל יומא נא:', 2135, 478), R('לחם שמים מידות ד, ה', 1145, 95), R('לחם שמים יומא ה, א', 1094, 215)]
o47 = row_get('sh47', 'options')
o47[0][2] = o47[0][2].replace('המבט — מתוך האמה שביניהן, מן הדרום אל הצפון.',
    'המבט — מתוך האמה שביניהן, מן הדרום אל הצפון.\nבהדגמת הכהן הגדול — דרכו כרבי יהודה: ״בין המזבח למנורה היה מהלך... ורבי יהודה אמר לך: פיתחא בדרום קאי״ (יומא נא:).')
o47[1][2] = o47[1][2].replace('כראש הפרוכת הפנימית שבשיטה הראשונה — בחירת מודל.',
    'כראש הפרוכת הפנימית שבשיטה הראשונה — בחירת מודל.\nבהדגמת הכהן הגדול — דרכו ״בין שלחן לכותל״, אל הפתח שבצפון.')
assert 'בהדגמת הכהן הגדול' in o47[0][2] and 'בהדגמת הכהן הגדול' in o47[1][2]
o47.append(['o2', 'רבי מאיר — פרוכת אחת, ודרכו בין השולחן למזבח', T_MEIR, REFS_MEIR])
row_set('sh47', 'options', o47)
r47 = row_get('sh47', 'refs')
r47 += [R('יומא נא: (רבי מאיר)', 107, 1319), R('מאירי יומא נא:', 2199, 464)]
row_set('sh47', 'refs', r47)
row_rep('sh47', 'short: "הפרוכות — שתיים או אחת"', 'short: "הפרוכות ודרך הכהן הגדול"')
row_rep('sh47', 'cap: "הפרוכות — שתיים או אחת"', 'cap: "הפרוכות ודרך הכהן הגדול — רבי יהודה, רבי יוסי או רבי מאיר"')
row_rep('sh47', 'R.set(k === "o1" ? "one" : "two");', 'R.set(k === "o2" ? "meir" : k === "o1" ? "one" : "two");')
row_rep('sh47', '"o1": [[-45.0, 29.5, 9.0], [-45.1, 25.3, -9.3]]}[k];', '"o1": [[-45.0, 29.5, 9.0], [-45.1, 25.3, -9.3]], "o2": [[-30.5, 31.0, 2.5], [-41.0, 26.2, -6.0]]}[k];')

# ---- sh56: the Tosafot Yom Tov's fold, a third reading
T_TYT = (r'**תוספות יום טוב** (יומא ה, א), על ״פרופה״: ״פירש הר״ב ראשה כפולה לצד החיצון ונאחזת בקרס כו׳ וכפי׳ רש״י. ור״ל שהפרוכת על פני כל הדביר מכותל הצפון עד כותל הדרום. ושם בכותל דרום נכפלה, ר״ל היתה ארוכה ויצאת לחוץ לתוך ההיכל ונאחזת בכותל הדרום בקרס כו׳. ועל שם הקרס מקרי פרופה, כדמתרגם קרסי זהב — פורפין דדהב״. וכן **עיקר תוספות יום טוב**: ״היתה ארכה יוצאת לחוץ לתוך ההיכל ונאחזת בכתל הדרום בקרס״.\n'
    r'ובדיבור ״מן הדרום״ הוא מבאר למה לא עשו גם את פריפת החיצונה בצפון: ״דכבוד הוא לקדש הקדשים שלא יהיו נפתחים שתי הפרוכות בצד אחד, ויהיו עיניו ניזונות מיד מבית קדש קדשים״.\n'
    r'**הרש״ש** (יומא נב:) מקשה: ״וא״י איך יפרנס לפי פירושו מש״כ רש״י להיות פתוחה ועומדת״ — אם הקצה נאחז בכותל, הפינה סגורה. ולכן הוא מפרש את רש״י אחרת — כאפשרות הראשונה: ״דלא היה רוחב הפרוכת אלא כנגד רוחב ההיכל, והחיצונה היתה נכפלה על עצמה בקצה הדרום לצד ההיכל... ונמצא שהיתה שם פתוחה ועומדת״.\n'
    r'במודל: הפרוכת ארוכה מרוחב הבית. הפינה התחתונה שליד הכותל — בחיצונה בדרום, ובפנימית בצפון — מורמת ונמשכת החוצה, וקצה נאחז בקרס של זהב בכותל, בגובה כחמש אמות וחצי. בחיצונה הפינה נמשכת שלוש אמות לתוך ההיכל; בפנימית — לתוך האמה שבין הפרוכות, ולכן מעט בלבד; וכשיש פרוכת אחת (רבי יוסי ורבי מאיר) — שלוש אמות לתוך ההיכל. הפתח — מתחת לפינה, לאורך הכותל, ובו עובר הכהן הגדול. הגובה, המשיכה וצורת הפינה — בחירת מודל, כדי שיישאר פתח, כקושיית הרש״ש.')
noq(T_TYT)
REFS_TYT = [R('תוי״ט יומא ה, א', 898, 155), R('תוי״ט יומא ה, א (מן הדרום)', 898, 156), R('עיקר תוי״ט יומא ה, א', 1025, 116), R('רש״ש יומא נב:', 2494, 568), R('רש״ש משנה יומא ה, א', 698, 59), R('רש״י יומא נב:', 2157, 1973)]
o56 = row_get('sh56', 'options')
o56[0][2] = o56[0][2].replace('ציורו של תוספות יום טוב, שהקצה הכפול יוצא אל ההיכל ונאחז בכותל הדרומי, לא צויר.', 'ציורו של תוספות יום טוב — באפשרות השלישית.')
o56[0][2] = o56[0][2].replace('במודל (ברירת המחדל): כל פרוכת מגיעה מכותל לכותל.',
    '**פני משה** ו**קרבן העדה** (ירושלמי יומא ה, ב): ״ראשה כפולה לצד החיצון ונאחזת בקרסי זהב להיות פתוחה מן הדרום ועומדת״. ו**הרש״ש** (יומא נב:) מפרש כך את רש״י: ״דלא היה רוחב הפרוכת אלא כנגד רוחב ההיכל, והחיצונה היתה נכפלה על עצמה בקצה הדרום לצד ההיכל, וזהו לצד חוץ שכתב רש״י, והיתה שם פרופה בקרס, ונמצא שהיתה שם פתוחה ועומדת״.\nבמודל (ברירת המחדל): כל פרוכת מגיעה מכותל לכותל.')
assert 'באפשרות השלישית' in o56[0][2] and 'פני משה' in o56[0][2]
o56[0][3] += [R('פני משה ירושלמי יומא ה, ב', 1809, 939), R('קרבן העדה ירושלמי יומא ה, ב', 1443, 1255), R('רש״ש יומא נב:', 2494, 568)]
o56.append(['o2', 'תוספות יום טוב — הפינה נמשכת אל הכותל', T_TYT, REFS_TYT])
row_set('sh56', 'options', o56)
r56 = row_get('sh56', 'refs')
r56 += [R('תוי״ט יומא ה, א (מן הדרום)', 898, 156), R('עיקר תוי״ט יומא ה, א', 1025, 116), R('רש״ש יומא נב:', 2494, 568), R('פני משה ירושלמי יומא ה, ב', 1809, 939),
    R('קרבן העדה ירושלמי יומא ה, ב', 1443, 1255), R('מלאכת שלמה יומא ה, א', 1151, 177), R('רמב״ם עבודת יום הכפורים ד, א', 342, 32)]
row_set('sh56', 'refs', r56)
row_rep('sh56', 'short: "פריפת הפרוכות — רש״י או תוספות רי״ד"', 'short: "פריפת הפרוכות — רש״י, תוספות רי״ד או תוספות יום טוב"')
row_rep('sh56', 'cap: "פריפת הפרוכות — רש״י או תוספות רי״ד"', 'cap: "פריפת הפרוכות — רש״י, תוספות רי״ד או תוספות יום טוב"')
row_rep('sh56', 'F.set(k === "o1" ? "rid" : "rashi");', 'F.set(k === "o1" ? "rid" : k === "o2" ? "tyt" : "rashi");')
row_rep('sh56', '"o1": [[-35.5, 30.5, 1.5], [-44.5, 27.5, 7]]}[k];', '"o1": [[-35.5, 30.5, 1.5], [-44.5, 27.5, 7]], "o2": [[-35.0, 31.5, 2.5], [-43.4, 26.6, 8.4]]}[k];')

# ---- sh45: Solomon's vessels - the new row's companion
row_rep('sh45', 'onPick: (k) => { const S = ctx.shared.solomonVessels; if (S && typeof S.set === "function") S.set(k === "o1" ? "ten" : "one"); },',
    'onPick: (k) => { const S = ctx.shared.solomonVessels; if (S && typeof S.set === "function") S.set(k === "o1" ? "ten" : "one"); if (k !== "o1") { const r = OPS_BY_ID["sh57"]; if (r && r.cur === "o1") { r.mark("o0"); if (S && typeof S.setLit === "function") S.setLit(false); } } },')
o45 = row_get('sh45', 'options')
old45 = 'ריקים — אבל בלי לחם ובלי לבונה; ומנורותיו בלי נרות דולקים;'
assert o45[1][2].count(old45) == 1
o45[1][2] = o45[1][2].replace(old45, 'ריקים — בלי לחם ובלי לבונה, ומנורותיו בלי נרות דולקים, כתנא קמא (מנחות צט.); ולרבי אלעזר בן שמוע, שעל כולם היו מסדרין ובכולן היו מדליקין — במתג ״סידור הלחם והדלקת הנרות בכלי שלמה״;')
o45[1][3] += [R('רש״ש שקלים ו, ד', 703, 74), R('ירושלמי שקלים ו, ג', 154, 206), R('סיריליו ירושלמי שקלים ו, ג', 1752, 1169)]
row_set('sh45', 'options', o45)

# ---- sh57: the bread and the lamps on Solomon's vessels (new, after sh45)
T57_0 = (r'הגמרא (מנחות צט.): ״תנו רבנן: עשרה שלחנות עשה שלמה, ולא היו מסדרין אלא על של משה, שנאמר: ׳ואת השלחן אשר עליו לחם הפנים זהב׳. עשר מנורות עשה שלמה, ולא היו מדליקין אלא בשל משה, שנאמר: ׳את מנורת הזהב ונרתיה לבער בערב׳״.\n'
    r'וכן **רבי יוסי ברבי יהודה** (שם): ״לא היו מסדרין אלא על של משה, אלא מה אני מקיים ׳ואת השלחנות אשר עליהם לחם הפנים זהב׳? אלו שלשה שלחנות שהיו במקדש: שנים שהיו באולם מבפנים לפתח הבית... אחד של זהב בפנים, שעליו לחם הפנים תמיד״.\n'
    r'ובירושלמי (שקלים ו, ג), בסתם: ״אף על פי כן לא היה מסדר אלא שלמשה בלבד, שנאמר את השולחן אשר עליו לחם הפנים״.\n'
    r'**מלאכת שלמה** (שקלים ו, ד), בשם הירושלמי: המשנה בשקלים לא מנתה את עשרת השולחנות של שלמה, ״משום דלא חשיב אלא אותם שמשתמשין בהן, ובאותם של שלמה לא היו מסדרין״. וכן **ר׳ שלמה סיריליו** (ירושלמי שקלים ו, ג).\n'
    r'**הרש״ש** (שקלים ו, ד): ״מדלא חשיב י׳ שולחנות שעשה שלמה... משמע לכאורה דלא היו בבית שני, אבל ביומא (נ״א ב׳) מוכח דהיו, וצ״ע. אח״ז מצאתי בהמפרש לתמיד (ל״א ב׳) שכ׳ דהא דלא חשיב להו משום דלא היו משמשין כלום, כת״ק במנחות שם״.\n'
    r'במודל (ברירת המחדל): לחם ולבונה — רק על שולחן משה; נרות דולקים — רק במנורת משה. שולחנות שלמה ומנורותיו — לפי המתג ״שולחנות שלמה ומנורותיו — בבית שני״: שלמים, עם הסניפים, הקנים והבזיכים, אבל ריקים.')
T57_1 = (r'הגמרא (מנחות צט.): ״רבי אלעזר בן שמוע אומר: על כולם היו מסדרין, שנאמר: ׳את השלחנות ועליהם לחם הפנים׳, ובכולן היו מדליקין, שנאמר: ׳את המנרות ונרתיהם לבערם כמשפט לפני הדביר זהב סגור׳״.\n'
    r'ובירושלמי (שקלים ו, ג) השמות הפוכים: ״רבי יוסי בירבי יהודה אומר: על כולם היה מסדר, שנאמר את השולחנות ועליהם לחם הפנים״; ובבבלי רבי יוסי ברבי יהודה אומר ״לא היו מסדרין אלא על של משה״.\n'
    r'**מלאכת שלמה** (שקלים ו, ד): ״אבל ר׳ יוסי ב״ר יהודה פליג התם דעל כולן היה מסדר... ואיתה נמי בגמ׳ דילן בפ׳ שתי הלחם, ופי׳ שם רש״י ז״ל דמ״ד על כולם היינו פעמים על זו ופעמים על זו״.\n'
    r'**רש״י** (מנחות צט.): ״על כולן היו מסדרין — פעמים בזה פעמים בזה״. כלומר, לפי רש״י לא היה לחם על כל השולחנות בבת אחת, אלא פעם על שולחן זה ופעם על שולחן אחר.\n'
    r'במודל: לחם ולבונה על כל עשרת השולחנות, ונרות דולקים בכל עשר המנורות — כולם יחד. כשבוחרים בזה, שולחנות שלמה ומנורותיו מוצגים, אם לא היו מוצגים.')
noq(T57_0, T57_1)
REFS57 = [R('מנחות צט.', 131, 3528), R('מנחות צט. (מנורות)', 131, 3529), R('מנחות צט. (רבי אלעזר בן שמוע)', 131, 3530), R('ירושלמי שקלים ו, ג', 154, 206), R('מנחות צט. (רבי יוסי ברבי יהודה)', 131, 3531), R('רש״י מנחות צט. (על כולן)', 2186, 4706),
    R('מלאכת שלמה שקלים ו, ד', 1152, 217), R('רש״ש שקלים ו, ד', 703, 74), R('סיריליו ירושלמי שקלים ו, ג', 1752, 1169)]
ROW57 = '''
        opRow({
          id: "sh57", short: "סידור הלחם והדלקת הנרות בכלי שלמה", cardFly: true,
          cap: "סידור הלחם והדלקת הנרות בכלי שלמה — רק בשל משה או בכולם",
          refs: %s,
          options: %s,
          current: "o0",
          onPick: (k) => { const S = ctx.shared.solomonVessels; if (!S) return; if (k === "o1" && S.current !== "ten") { const r = OPS_BY_ID["sh45"]; if (r) { r.mark("o1"); try { r.onPick("o1"); } catch (_) {} } else if (typeof S.set === "function") S.set("ten"); } if (typeof S.setLit === "function") S.setLit(k === "o1"); },
          fly: (k) => { const c = {"o0": [[-17, LV.HEI + houseRise(-37) + 14, 3], [-36, LV.HEI + houseRise(-37) + 0.5, -1]], "o1": [[-17, LV.HEI + houseRise(-37) + 14, 3], [-36, LV.HEI + houseRise(-37) + 0.5, -1]]}[k]; if (c && c[0] && c[1]) fly(c[0], c[1]); }
        });
''' % (jd(REFS57), jd([['o0', 'תנא קמא ורבי יוסי ברבי יהודה — רק בשל משה', T57_0, [REFS57[0], REFS57[1], REFS57[4], REFS57[3], REFS57[6], REFS57[7], REFS57[8]]],
                     ['o1', 'רבי אלעזר בן שמוע — בכולם', T57_1, [REFS57[2], REFS57[3], REFS57[5], REFS57[6]]]]))
i45, j45 = row_span('sh45')
B = B[:j45] + code(ROW57) + '\n' + B[j45:]
print('ok row sh57')

# ---- sh58: the parochot of the openings; sh59: the two of the upper storey (new, after sh56)
T58_0 = (r'רב (כתובות קו.; יומא נד.): ״שלש עשרה פרכות היו במקדש שני: שבע כנגד שבעה שערים, אחת לפתחו של היכל, ואחת לפתחו של אולם, שתים בדביר, שתים כנגדן בעליה״. וכן פסק **הרמב״ם** (כלי המקדש ז, יז): ״שבע על שבעה שערי העזרה, ואחת על פתח האולם, ואחת על פתח ההיכל, ושתים לדביר בינו ובין הקדש, ושתים כנגדן בעליה״.\n'
    r'**רש״י** (כתובות קו.): ״בדבבי — בפרכות שכנגד הפתחים, דלצניעותא עבידי ואינן תחת בנין״; ״ז׳ שערים — לעזרה״. **תוספות** שם: שבעת שערי העזרה הם כתנא של מידות (א, ד): ״שלשה בצפון ושלשה בדרום ואחד במזרח״. **המאירי** שם: ״פרכות אלו של שערים תשעה היו... ושל דביר היו ארבעה״.\n'
    r'**פרוכת ההיכל** — התוספתא (שקלים ג, יא): ״אחרת היתה שם, ארכה עשרים אמה ורחבה עשר... מעשה רוקם, והיתה פרוסה על פתחו של היכל מבחוץ״. **פרוכת האולם** — המשנה (מידות ב, ג): ״כל הפתחים שהיו שם היו להן דלתות, חוץ משל אולם״; ו**הברטנורא** (תמיד ז, א), על ״הגביה לו את הפרכת״: ״שתלוי בפתחו של אולם, שלא היה לפתחו של אולם דלתות כשאר פתחים שבמקדש, אלא פרכת בלבד״.\n'
    r'**תוספות יום טוב** (תמיד ז, א) מסכים לברטנורא, ועל פרוכת להיכל כותב: ״וזה לא שמענו בשום מקום״. אבל **הרא״ש** (תמיד לג:): ״התלוי לפני פתח ההיכל לצניעות, וכן היה לפני שער האולם״ (הובא במלאכת שלמה שם); ו**המשנה למלך** (כלי המקדש ז, יז) מעיר שהרמב״ם עצמו כתב ״ואחת על פתח ההיכל״.\n'
    r'״פרוסה״ — כך משמע מן התוספתא; ומן ״מגללין להם את הפרוכת״ בשעת העלייה לרגל (יומא נד.); ומן ״הגביה לו את הפרכת״ (תמיד ז, א).\n'
    r'במודל (ברירת המחדל): כל פרוכת תלויה מבחוץ, לפני הפתח — כפרוכת ההיכל שבתוספתא. בשבעת שערי העזרה — בצפון: שער הניצוץ, שער הקרבן, ופתח בית המוקד לעזרה, מצד בית המוקד; בדרום: שער הדלק, שער הבכורות ושער המים; ובמזרח: שער ניקנור, מצד עזרת נשים. בפתח ההיכל — באולם; ובפתח האולם — מול העזרה. גודלה כגודל הפתח: השערים וההיכל עשר על עשרים (מידות ב, ג; ד, א), והאולם עשרים על ארבעים (ג, ז). פרוכת מוגבהת מעצמה בזמן הדגמה, וכשהמבט עובר דרך הפתח שלה — ויורדת אחר כך. האריג — כאריג הפרוכת, בלי צורות; המוט של זהב — בחירת מודל.')
T58_1 = (r'**עיקר תוספות יום טוב** (תמיד ז, א): ״ונראה לי שהיה הפרכת כל היום מגבה ועומד על ידי קשרים ויתרות, לכנס ולצאת הכהנים הצריכים לעבודת מנורה ומזבח פנימי, אלא שכשנכנס הכהן גדול היו מסירים הפרכת מהקשרים ויתרות כדי שיהא נתלה על עמדו״.\n'
    r'והגמרא (יומא נד.): ״בשעה שהיו ישראל עולין לרגל, מגללין להם את הפרוכת, ומראין להם את הכרובים״ — ושם מעמידה זאת ב״פרוכת דבבי״; ורש״י: ״דבבי — שכנגד הפתחים: פתח אולם והיכל ובית קדשי הקדשים״.\n'
    r'במודל: כל תשע הפרוכות מגוללות למעלה, מתחת למשקוף, וקשורות — והפתחים פתוחים למבט.')
T59_0 = (r'רב (כתובות קו.): ״שתים בדביר, שתים כנגדן בעליה״. **רש״י** שם: ״להבדיל בין עליית היכל לעליית קדשי הקדשים, וגם הן במקום אמה טרקסין״. וכן פסק **הרמב״ם** (כלי המקדש ז, יז).\n'
    r'המשנה (מידות ד, ה): ״וראשי פספסין מבדילים בעליה בין הקדש לבין קדש הקדשים״.\n'
    r'**תוספות יום טוב** (מידות ד, ה): ״דשתי פרוכות היו מבדילות בעלייה... וא״כ קשיא, תרתי למה לי?״ ומתרץ: עליית בית קודש הקדשים חמורה מקודש הקדשים עצמו, ואין נכנסים לה אלא לעיתים רחוקות (פסחים פו.), ״ומעתה הואיל והיא חמורה, עבדי נמי פספסים, כדי שיכירו עולי עלייה שקדושת עליית קדשי קדשים חמורה״.\n'
    r'**יכין** (מידות ד, ה): ״אע״ג שהיה שם ב׳ פרוכת בין עליית ההיכל לעליית ק״ק... אפ״ה היה שם גם הפספסין, מפני חומר קדושת עליית ק״ק״. **מלאכת שלמה** (שם): ״ושתי פרוכות כנגדן בעליה, כדי להפסיק בין שתי עליות״.\n'
    r'במודל (ברירת המחדל): שתי פרוכות מכותל לכותל, ואמה ביניהן, מרצפת העלייה עד תקרתה (ארבעים אמה — מידות ד, ו), מעל שתי הפרוכות שלמטה. ראשי הפספסין — שורה באמצע האמה שביניהן. הפרוכות סגורות, בלי פריפה. האריג — בלי צורות; בחירת מודל.')
T59_1 = (r'**לחם שמים** (מידות ד, ה) חולק על תוספות יום טוב: ״ומ״ש תי״ט אין בו טעם כל עיקר״. לדעתו, בבית שני — ״ואע״ג דהוו שתי פרוכות למעלה כמו למטה, מ״מ לא היו רחבות כל כך, ולא מגיעות בעליה עד הכותלים, אילך ואילך, שהפספסין יוצאין מן הכתלים בצפון ובדרום ומגיעין עד הבדלת הפרוכת, ושם מפסיקין בין הקודש לבין קודש הקדשים במקום שאין פרוכת. נמצא ששני מיני הבדלות היו צריכין להיות שם בלי ספק, ולא היה אחד מהם לבטלה״. ועוד: ״לפי שפרוכת של עליה מכוון כנגד פרוכת דפתח של בית, לא יותר״.\n'
    r'במודל: שתי הפרוכות שבעלייה באמצע בלבד — רוחבן עשר אמות, בחירת מודל — וראשי הפספסין מן הכותל הצפוני ומן הכותל הדרומי עד הפרוכות. שתי הפרוכות שלמטה — מכותל לכותל, כמו בשאר המודל.')
noq(T58_0, T58_1, T59_0, T59_1)
REFS58 = [R('כתובות קו.', 116, 3032), R('יומא נד.', 107, 1412), R('רש״י כתובות קו.', 2168, 4902), R('תוספות כתובות קו.', 1914, 1407), R('מאירי כתובות קו.', 2209, 1340),
    R('רמב״ם כלי המקדש ז, יז', 338, 118), R('תוספתא שקלים ג, יא', 193, 40), R('מידות ב, ג', 89, 14), R('תמיד ז, א', 88, 38), R('ברטנורא תמיד ז, א', 634, 222),
    R('תוי״ט תמיד ז, א', 944, 209), R('הרא״ש תמיד לג:', 2224, 308), R('מלאכת שלמה תמיד ז, א', 1202, 288), R('משנה למלך כלי המקדש ז, יז', 4607, 54)]
REFS58_1 = [R('עיקר תוי״ט תמיד ז, א', 1075, 171), R('יומא נד. (מגללין)', 107, 1407), R('רש״י יומא נד. (דבבי)', 2157, 2067)]
REFS59 = [R('כתובות קו.', 116, 3032), R('רש״י כתובות קו. (בעליה)', 2168, 4905), R('מידות ד, ה', 89, 32), R('תוי״ט מידות ד, ה', 948, 167), R('יכין מידות ד, ה', 819, 570),
    R('מלאכת שלמה מידות ד, ה', 1210, 164), R('לחם שמים מידות ד, ה', 1145, 95), R('לחם שמים מידות ד, ה (ב)', 1145, 96), R('רמב״ם כלי המקדש ז, יז', 338, 118)]
ROW58 = '''
        opRow({
          id: "sh58", short: "פרוכות הפתחים — פרוסות או מוגבהות", cardFly: true,
          cap: "פרוכות הפתחים — שבעת שערי העזרה, ההיכל והאולם: פרוסות או מוגבהות",
          refs: %s,
          options: %s,
          current: "o0",
          onPick: (k) => { const G = ctx.shared.gateParochot; if (G && typeof G.set === "function") G.set(k === "o1" ? "up" : "down"); },
          fly: (k) => { const c = {"o0": [[64, 44, 52], [18.6, 38, 0]], "o1": [[64, 44, 52], [18.6, 38, 0]]}[k]; if (c && c[0] && c[1]) fly(c[0], c[1]); }
        });
        opRow({
          id: "sh59", short: "הפרוכות שבעלייה — מכותל לכותל או כלחם שמים", cardFly: true,
          cap: "הפרוכות שבעלייה — מכותל לכותל, או באמצע והפספסין מן הכתלים",
          refs: %s,
          options: %s,
          current: "o0",
          onPick: (k) => { const A = ctx.shared.aliyahParochot; if (A && typeof A.set === "function") A.set(k === "o1" ? "ls" : "wall"); },
          fly: (k) => { if (ctx.shared.openFor) ctx.shared.openFor("ui-house", 15000); const c = {"o0": [[-33, 96, 40], [-45, 84, 0]], "o1": [[-33, 96, 40], [-45, 84, 0]]}[k]; if (c && c[0] && c[1]) fly(c[0], c[1]); }
        });
''' % (jd(REFS58 + REFS58_1), jd([['o0', 'פרוסות על הפתחים (תוספתא, רש״י)', T58_0, REFS58], ['o1', 'מוגבהות — מגוללות למעלה (עיקר תוי״ט)', T58_1, REFS58_1]]),
       jd(REFS59), jd([['o0', 'מכותל לכותל — תוספות יום טוב ויכין', T59_0, REFS59[:6] + [REFS59[8]]], ['o1', 'לחם שמים — באמצע, והפספסין מן הכתלים', T59_1, [REFS59[6], REFS59[7], REFS59[2]]]]))
i56, j56 = row_span('sh56')
B = B[:j56] + code(ROW58) + '\n' + B[j56:]
print('ok rows sh58 sh59')

# ---- the cards' rows (chips): by view, by place, by label
m = re.search(r'const UI_OPS_V = (\{.*\}); //\n', B)
V = json.loads(m.group(1))
for k, add in {"kodesh": ["sh57"], "azarah": ["sh58"], "nikanor": ["sh58"], "ulam": ["sh58"], "heichalFront": ["sh58"], "kodeshHakodashim": []}.items():
    for a in add:
        if a not in V[k]: V[k].append(a)
B = B[:m.start(1)] + jd(V) + B[m.end(1):]
print('ok ops V')
m = re.search(r'const UI_OPS_P = (\{.*\}); //\n', B)
P = json.loads(m.group(1))
PADD = {"המנורה": ["sh57"], "שולחן לחם הפנים": ["sh57"], "הקודש": ["sh57"], "האולם": ["sh58"], "השער הגדול — ארבע הדלתות": ["sh58"], "שער ניקנור": ["sh58"],
        "שער הניצוץ": ["sh58"], "שער הקרבן": ["sh58"], "שער הדלק": ["sh58"], "שער הבכורות": ["sh58"], "שער המים": ["sh58"], "בית המוקד": ["sh58"], "העזרה": ["sh58"],
        "העלייה והלולין": ["sh59"], "פתח העלייה ופנים העלייה": ["sh59"], "שלוש עשרה הפרוכות": ["sh58", "sh59", "sh47", "sh56"],
        "שתי הפרוכות — בין הקודש לקודש הקדשים": [], "הכהן הגדול נכנס בקטורת — הדגמה": []}
for k, add in PADD.items():
    P.setdefault(k, [])
    for a in add:
        if a not in P[k]: P[k].append(a)
B = B[:m.start(1)] + jd(P) + B[m.end(1):]
print('ok ops P')
rep('        [/^המנורה|^שולחן לחם|^אבן שלפני/, ["sh42", "sh44", "sh45"]], //', '        [/^המנורה|^שולחן לחם|^אבן שלפני/, ["sh42", "sh44", "sh45", "sh57"]], //', raw=True, label='ops L menorah')
rep('        [/^האולם/, ["sh28", "sh29", "sh30"]], //', '        [/^האולם/, ["sh28", "sh29", "sh30", "sh58"]], //', raw=True, label='ops L ulam')

# ---- "in short" bullets in the cards of the kodesh and the parochot (three each)
rep(r'של שלמה, ולא סידרו עליהם ולא הדליקו בהם.\n• **', r'של שלמה, ולא סידרו עליהם ולא הדליקו בהם.\n• **סידור הלחם והדלקת הנרות בכלי שלמה:** לתנא קמא ולרבי יוסי ברבי יהודה — רק בשל משה (ברירת המחדל); לרבי אלעזר בן שמוע — ״על כולם היו מסדרין... ובכולן היו מדליקין״.\n• **', n=2, raw=True, label='bullet sol')
rep(r'• **הפרוכות — שתיים או אחת:** לתנא קמא — שתי פרוכות ואמה ביניהן, וכן כתב הרמב״ם (ברירת המחדל); לרבי יוסי — פרוכת אחת בלבד.\n',
    r'• **הפרוכות ודרך הכהן הגדול:** לתנא קמא — שתי פרוכות ואמה ביניהן, וכן כתב הרמב״ם (ברירת המחדל), והכהן הגדול מהלך בין המזבח למנורה, כרבי יהודה; לרבי יוסי — פרוכת אחת בלבד, ודרכו בין השולחן לכותל; לרבי מאיר — פרוכת אחת, ודרכו בין השולחן למזבח.\n', n=3, raw=True, label='bullet count')
rep(r'ובלולאות, ונפתחת בשעת הכניסה.\n', r'ובלולאות, ונפתחת בשעת הכניסה; לתוספות יום טוב — הפרוכת ארוכה, ופינתה נמשכת אל הכותל ונאחזת בו בקרס, והפתח מתחתיה.\n', n=3, raw=True, label='bullet fold')

# ---- the High Priest's place card
rep('כשיש פרוכת אחת (רבי יוסי; המתג ״הפרוכות — שתיים או אחת״) הוא מהלך בין השולחן לכותל, אל הפתח שבצפון. דרכו של רבי מאיר, ״בין שלחן למזבח״, לא צוירה.',
    'לשיטת תוספות יום טוב הפינה שליד הפתח מורמת ונאחזת בכותל, והכהן הגדול עובר מתחתיה. כשיש פרוכת אחת, כרבי יוסי (המתג ״הפרוכות ודרך הכהן הגדול״), הוא מהלך בין השולחן לכותל, אל הפתח שבצפון. ולרבי מאיר — פרוכת אחת, ופתחה בצפון: ״לעולם כרבי יוסי סבירא ליה״; אבל הוא מהלך בין השולחן למזבח, ואחרי השולחן פונה לצפון: ״שולחנות צפון ודרום מונחין, ומפסקא ליה שלחן ולא מתעייל ליה. ואיבעית אימא: לעולם מזרח ומערב מונחין, ומשום שכינה לאו אורח ארעא למיעל להדיא״ (יומא נא:–נב.).',
    raw=True, label='yk place card')
rep('["יומא נא: (פיתחא בדרום)", {"book": 107, "index": 1319}], ["מאירי יומא מז.", {"book": 2199, "index": 425}]',
    '["יומא נא: (פיתחא בדרום)", {"book": 107, "index": 1319}], ["יומא נא: (רבי מאיר)", {"book": 107, "index": 1320}], ["מאירי יומא מז.", {"book": 2199, "index": 425}]', raw=True, label='yk place refs')

# ---- a place: the thirteen parochot
T13 = (r'רב (כתובות קו.; יומא נד.): ״שלש עשרה פרכות היו במקדש שני: שבע כנגד שבעה שערים, אחת לפתחו של היכל, ואחת לפתחו של אולם, שתים בדביר, שתים כנגדן בעליה״. וכן פסק הרמב״ם (כלי המקדש ז, יז).\n'
    r'**רש״י** (כתובות קו.): ״בדבבי — בפרכות שכנגד הפתחים, דלצניעותא עבידי״; ״ז׳ שערים — לעזרה״; ״ושתים כנגדן בעליה — להבדיל בין עליית היכל לעליית קדשי הקדשים״.\n'
    r'**פרוכת ההיכל** (תוספתא שקלים ג, יא): ״ארכה עשרים אמה ורחבה עשר... והיתה פרוסה על פתחו של היכל מבחוץ״. **האולם** — ״כל הפתחים שהיו שם היו להן דלתות, חוץ משל אולם״ (מידות ב, ג), ולכן לפתחו פרוכת בלבד (ברטנורא תמיד ז, א).\n'
    r'במודל: שבע הפרוכות של שערי העזרה, פרוכת ההיכל ופרוכת האולם — תלויות מבחוץ, לפני הפתחים, פרוסות או מוגבהות לפי המתג ״פרוכות הפתחים״. בזמן הדגמה, וכשהמבט עובר דרך פתח, הפרוכת שלו מוגבהת מעצמה. שתיים בדביר — ״שתי הפרוכות — בין הקודש לקודש הקדשים״; ושתיים בעלייה — לפי המתג ״הפרוכות שבעלייה״.')
noq(T13)
REFS13 = [R('כתובות קו.', 116, 3032), R('יומא נד.', 107, 1412), R('רש״י כתובות קו.', 2168, 4902), R('רמב״ם כלי המקדש ז, יז', 338, 118), R('תוספתא שקלים ג, יא', 193, 40), R('מידות ב, ג', 89, 14), R('ברטנורא תמיד ז, א', 634, 222)]
PLACE13 = '          { t: "שלוש עשרה הפרוכות", tg: [18.6, 38, 0], cam: [64, 44, 52], info: "%s", refs: %s }, //\n' % (T13, jd(REFS13))
k13 = B.find('          { t: "שתי הפרוכות — בין הקודש לקודש הקדשים", tg:')
if k13 < 0: print('FAIL place anchor'); sys.exit(1)
B = B[:k13] + PLACE13 + B[k13:]
print('ok place 13')
rep(r'של שלמה, ולא סידרו עליהם ולא הדליקו בהם.\n**בר', r'של שלמה, ולא סידרו עליהם ולא הדליקו בהם.\n• **סידור הלחם והדלקת הנרות בכלי שלמה:** לתנא קמא ולרבי יוסי ברבי יהודה — רק בשל משה (ברירת המחדל); לרבי אלעזר בן שמוע — ״על כולם היו מסדרין... ובכולן היו מדליקין״.\n**בר', raw=True, label='bullet sol 3')

# ---- the news (outsiders read it: what changed, where, and why)
NEWS = [
    r'**תוספות יום טוב — אפשרות שלישית במתג ״פריפת הפרוכות״** — לפי תוספות יום טוב (יומא ה, א), הפרוכת הייתה ארוכה מרוחב הבית, וקצה ״יצאת לחוץ לתוך ההיכל ונאחזת בכותל הדרום בקרס״. במודל: הפינה התחתונה של הפרוכת מורמת, נמשכת אל הכותל ונאחזת בו בקרס של זהב, והכהן הגדול נכנס מתחתיה. בכרטיס — גם קושיית הרש״ש על פירוש זה.',
    r'**דרך הכהן הגדול לשיטת רבי מאיר** — בהדגמה ״הכהן הגדול נכנס בקטורת״ יש עכשיו דרך שלישית. רבי מאיר אומר: ״בין שלחן למזבח״, ו״לעולם כרבי יוסי סבירא ליה״ — הפתח בצפון (יומא נא:). במודל: פרוכת אחת, והכהן הגדול הולך בין השולחן למזבח, ואחרי השולחן פונה לצפון. בוחרים בה במתג ״הפרוכות ודרך הכהן הגדול״.',
    r'**מתג חדש: סידור הלחם והדלקת הנרות בכלי שלמה** — כשמוצגים עשרת השולחנות ועשר המנורות של שלמה, אפשר לבחור: כתנא קמא ורבי יוסי ברבי יהודה — לחם ונרות רק בשל משה (ברירת המחדל); או כרבי אלעזר בן שמוע (מנחות צט.) — ״על כולם היו מסדרין... ובכולן היו מדליקין״. בכרטיס — גם פירוש רש״י: ״פעמים בזה פעמים בזה״.',
    r'**פרוכות בשערים, בפתח ההיכל ובפתח האולם** — ״שלש עשרה פרכות היו במקדש שני״ (כתובות קו.; רמב״ם כלי המקדש ז, יז). עד עכשיו צוירו רק שתי הפרוכות שבין הקודש לקודש הקדשים. עכשיו מצוירות גם שבע הפרוכות של שערי העזרה, פרוכת פתח ההיכל ופרוכת פתח האולם — תלויות מבחוץ, לפני הפתח. הן פרוסות, ומתג ״פרוכות הפתחים״ מגביה אותן. בזמן הדגמה, וכשהמבט עובר דרך פתח, הפרוכת שלו מוגבהת מעצמה.',
    r'**שתי הפרוכות שבעלייה** — גם בעלייה, מעל ההיכל וקודש הקדשים, יש עכשיו שתי פרוכות. מתג ״הפרוכות שבעלייה״: מכותל לכותל, כתוספות יום טוב (ברירת המחדל); או באמצע בלבד, וראשי הפספסין מן הכתלים — כלחם שמים.',
    r'**מקום חדש: שלוש עשרה הפרוכות** — ברשימת המקומות, תחת ״ההיכל ופנים״: כל הפרוכות שבמקדש השני, ומקורותיהן.',
    r'**סרגל במסך הבחירה** — במסך הפתיחה, שבו בוחרים בית ראשון או בית שני, יש עכשיו סרגל בתחתית. באוצריא יש בו מתג לכפתור ״פתח בתוסף בית המקדש״, שבסרגל העליון של ספרים כמו מלכים, דברי הימים ומידות: אפשר להסתיר את הכפתור ולהחזיר אותו, בלי לבטל הרשאה. מתג לכפתור שבשדה החיפוש יפעל מגרסה 0.9.99 של אוצריא. בקובץ לצפייה בלי אוצריא נמצא בסרגל הזה כפתור ״בדיקת עדכונים״ — עד עכשיו הוא היה בסוף התפריט.',
]
noq(*NEWS)
items = '[' + ', '.join('"' + t + '"' for t in NEWS) + ']'
m = re.search(r'var UI_NEWS = \{ //\n    ver: "2\.0\.8",(.*) //\n    items: \[.*\] //\n', B)
if not m: print('FAIL news block'); sys.exit(1)
B = B[:m.start()] + 'var UI_NEWS = { //\n    ver: "2.0.9",' + m.group(1) + ' //\n    items: ' + items + ' //\n' + B[m.end():]
print('ok news')
rep('  var UI_NEWS_VERS = [ //\n    ["2.0.8", [', '  var UI_NEWS_VERS = [ //\n    ["2.0.9", ' + items + '], //\n    ["2.0.8", [', raw=True, label='news vers')

open(DST, 'w', encoding='utf-8').write(B)
print('written', DST)
