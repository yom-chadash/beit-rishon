#!/usr/bin/env python3
# SOLOMON_214 (b2 45-vessels.js): Solomon's ten tables and ten menorahs in the Second Temple - the geometry and ctx2.shared.solomonVessels.
# Idempotent (a marked block, replaced on each run). The layout's open choices: EW (the table east-west) and MEN (the menorahs) - see
# the block's comment; they are set below and written into the code.
import re, sys
P = '/home/claude/b2src/src/45-vessels.js'
EW = sys.argv[1] if len(sys.argv) > 1 else 'gemara'     # 'gemara' (Menachot 99a with Rashi) | 'meiri'
MEN = sys.argv[2] if len(sys.argv) > 2 else 'mirror'    # 'mirror' (as the tables, in the south) | 'row'
s = open(P, encoding='utf-8').read()
A, B = '    // ---- SOLOMON_214 BEGIN', '    // ---- SOLOMON_214 END\n'
block = A + r''' (the user, 16.11.2026 17:21: "האם בבית שני היו עשרת השולחנות שעשה שלמה"; 17:32: "1. כן 2. כן 3. נכון"; 20:21,
    // on the two open choices below: "1. אפשרות א 2. אפשרות א" - the Gemara with Rashi, and the menorahs as the tables): SOLOMON'S TEN
    // TABLES AND TEN MENORAHS - a row of the opinions table ("שולחנות שלמה ומנורותיו — בבית שני"). "one" (THE DEFAULT, as it stood): the
    // Tosafot Rid on Yoma 51b (2109:157) - "אלמא לא הי' בהיכל אלא שלחן אחד בלבד בבית שני", "ויקבץ את כל כלי הזהב אשר עשה שלמה".
    // "ten": Rashi on Yoma 51b (2157:1951) reads that sugya, of the Second Temple, with Solomon's ten tables; the Meforash on Tamid 31b
    // (2105:319): "ועשר שולחנות היו עדיין בהיכל שעשה שלמה... ובאותן של שלמה לא היו מסדרים" - bare tables (no bread, no spoons), unlit
    // menorahs (Menachot 99a, 131:3528-3529: "ולא היו מסדרין אלא על של משה... ולא היו מדליקין אלא בשל משה"). The menorahs - the user
    // ("2. כן"; "ולכאורה מחלוקתם היא גם לגבי המנורות").
    // THE PLACES (Menachot 98b-99a, 131:3504-3527; Rashi 2186:4676-4704): "של משה באמצע, חמשה מימינו וחמשה משמאלו" - all the tables in
    // the north, the menorahs in the south, from the house's middle inward; "תרי דרי נינהו" - two rows of five, head to head. They
    // follow the row "כיוון המנורה והשולחן":
    //   the table north-south (R. Elazar b. R. Shimon): Rashi on Yoma 51b - "חמש בשורה אחת פונות ראשה של זו לראשה של זו... ועל כרחך
    //   צריך היה לסמוך ראש השולחן הצפוני לכותל"; Rashi on 99a - "שורה מערבית משוכה מכותל מערבי שתי אמות ומחצה ואמה רוחב דשולחן ושתי
    //   אמות ומחצה בינו ובין השלחן של משה": from the parochet 2.5, the west row, 2.5, Moses' table (one amah west of its own place), 2.5,
    //   the east row (its southern table 0.06 from the golden altar - "ראש השולחן הדרומי סמוך למזבח", Rashi there);
    //   the table east-west (the Rambam, Rabbi): %(EWDOC)s
    // The menorahs: %(MENDOC)s
    // The floor rises westward (10-core.js houseRise): each vessel stands on the floor at its own x - "כתלמיד היושב לפני רבו, נמוך
    // הימנו... דבית המקדש היה משופע ולצד מערב מגביה יותר" (Rashi 99a). Not lit, nothing on them; their metal follows vesselMetal.
    const SOL = { on: false };
    {
      const sg = new Group();
      sg.name = "solomonVessels";
      sg.visible = false;
      g.add(sg);
      ctx2.layers = ctx2.layers || {};
      ctx2.layers.solomonVessels = sg;
      const FLx = (x) => LV.HEI + houseRise(x);
      const id10 = () => Array.from({ length: 10 }, () => int_part(0, -50, 0, 0, 0, 0, 0));
      const mk = (geo, mat, sh) => int_inst(sg, geo, mat, id10(), sh);
      SOL.tBody = mk(tableGeo.body, tblBody.material, true);
      SOL.tCrown = mk(tableGeo.crown, tblCrown.material, false);
      SOL.mBody = mk(menorahGeo.body, menBody.material, true);
      SOL.mMidNS = mk(menorahGeo.midNS, menBody.material, false);
      SOL.mSideNS = mk(menorahGeo.sideNS, menBody.material, false);
      SOL.mMidEW = mk(menorahGeo.midEW, menBody.material, false);
      SOL.mSideEW = mk(menorahGeo.sideEW, menBody.material, false);
      SOL.TBL0 = { x: TBL.x, z: TBL.z };
      // the places: { tables: [[x, z, rot] x 10], mens: [[x, z, rot] x 10], mt: [x, z] - Moses' table }
      SOL.layout = () => {
        const tNS = ctx2.shared.tableDir && ctx2.shared.tableDir.current === "ns";
        const mEW = ctx2.shared.menorahDir && ctx2.shared.menorahDir.current === "ew";
        const tables = [], mens = [];
        let mt = [SOL.TBL0.x, SOL.TBL0.z];
        if (tNS) {
          const xW = -44.5 + 2.5 + 0.5, xM = xW + 3.5, xE = xM + 3.5 - 0.06;
          for (const x of [xW, xE]) for (let i = 0; i < 5; i++) tables.push([x, -9 + 2 * i, Math.PI / 2]);
          mt = [xM, SOL.TBL0.z];
        } else {
%(EWCODE)s
        }
%(MENCODE)s
        return { tables, mens, mt };
      };
      SOL.place = () => {
        const L = SOL.layout();
        L.tables.forEach(([x, z, r], i) => { const m = int_part(x, FLx(x), z, r, 0, 0, 0); SOL.tBody.setMatrixAt(i, m); SOL.tCrown.setMatrixAt(i, m); });
        L.mens.forEach(([x, z, r], i) => { const m = int_part(x, FLx(x), z, r, 0, 0, 0); for (const im of [SOL.mBody, SOL.mMidNS, SOL.mSideNS, SOL.mMidEW, SOL.mSideEW]) im.setMatrixAt(i, m); });
        const mEW = ctx2.shared.menorahDir && ctx2.shared.menorahDir.current === "ew";
        SOL.mMidNS.visible = SOL.mSideNS.visible = !mEW;
        SOL.mMidEW.visible = SOL.mSideEW.visible = mEW;
        for (const im of [SOL.tBody, SOL.tCrown, SOL.mBody, SOL.mMidNS, SOL.mSideNS, SOL.mMidEW, SOL.mSideEW]) {
          im.instanceMatrix.needsUpdate = true;
          if (im.computeBoundingSphere) im.computeBoundingSphere();
          if (im.computeBoundingBox) im.computeBoundingBox();
        }
        // Moses' table: its place in this layout (with "one" - its own); its label, found once among the labels
        if (SOL.lbl === undefined) SOL.lbl = (ctx2.labels || []).find((l) => l && l.text === "שולחן לחם הפנים") || null;
        const mt = SOL.on ? L.mt : [SOL.TBL0.x, SOL.TBL0.z];
        if (mt[0] !== TBL.x || mt[1] !== TBL.z) {
          TBL.x = mt[0]; TBL.z = mt[1];
          const m = int_part(TBL.x, FLx(TBL.x), TBL.z, TBL.rot, 0, 0, 0);
          for (const im of [tblBody, tblCrown, tblRig, tblEnds, tblSpoons, tblBread, tblIncense]) {
            im.setMatrixAt(0, m);
            im.instanceMatrix.needsUpdate = true;
            if (im.computeBoundingSphere) im.computeBoundingSphere();
            if (im.computeBoundingBox) im.computeBoundingBox();
          }
          const fp = ctx2.shared.flyPoints && ctx2.shared.flyPoints.shulchan;
          if (fp) { fp.pos = [TBL.x + 6.2, FL + 4.4, TBL.z + 2.6]; fp.target = [TBL.x, FL + 2.1, TBL.z]; }
          if (SOL.lbl) { SOL.lbl.x = TBL.x; SOL.lbl.z = TBL.z; }
          try {
            const lg = ctx2.root.getObjectByName("labels");
            if (lg) for (const spr of lg.children) if (spr.userData && spr.userData.label === SOL.lbl) spr.position.set(TBL.x, spr.position.y, TBL.z);
          } catch (_) {}
        }
      };
      SOL.metal = (k) => {
        if (!METALS[k]) return;
        SOL.tBody.material = METALS[k].tbl;
        SOL.tCrown.material = METALS[k].crown;
        for (const im of [SOL.mBody, SOL.mMidNS, SOL.mSideNS, SOL.mMidEW, SOL.mSideEW]) im.material = METALS[k].men;
      };
      SOL_HOOK.place = () => { if (SOL.on || TBL.x !== SOL.TBL0.x || TBL.z !== SOL.TBL0.z) SOL.place(); };
      SOL_HOOK.metal = (k) => SOL.metal(k);
      ctx2.shared.solomonVessels = {
        current: "one",
        keys: ["one", "ten"],
        set(k) {
          k = k === "ten" ? "ten" : "one";
          this.current = k;
          SOL.on = k === "ten";
          sg.visible = SOL.on;
          SOL.place();
          return k;
        },
        get() { return this.current; },
        layout: () => SOL.layout()   // (tests)
      };
    }
''' + B
EW_GEMARA_DOC = '''Menachot 99a - "מי סברת שלחן דמשה בהדייהו הוה יתיב? לא, דמידלי ליה, ומנח ליה,
    //   ומיתתי להו לדידהו פורתא, כתלמיד היושב לפני רבו"; Rashi: "שלא יהא מונח ביניהם ממש אלא משוך לצד מערב וראשו מכוון כנגד אויר שבין
    //   שתי השורות", "מושיבם לצד מזרח במקום נמוך": the north row 2.5 from the north wall ("שורה הצפונית... מרוחקת מכותל צפוני שתי
    //   אמות ומחצה"), 2.5, the south row - each five head to head along the house; Moses' table west of them, on the line of the air
    //   between the rows (1.75 south of its own place), the rows beginning half an amah east of its head.'''
EW_GEMARA_CODE = '''          const zN = -10 + 2.5 + 0.5, zS = zN + 3.5, zM = (zN + zS) / 2, xM = SOL.TBL0.x, x0 = xM + 1 + 0.5 + 1;
          for (const z of [zN, zS]) for (let i = 0; i < 5; i++) tables.push([x0 + 2 * i, z, 0]);
          mt = [xM, zM];'''
EW_MEIRI_DOC = '''the Meiri on Yoma 51b (2199:464) - "וכולן רצופות מפרנסות כ"ב אמה בארך הבית עם אותו של משה שהיתה
    //   אמצעית להן, ולדעת זה ריוח היו מניחין בין השלחנות לכותל הצפוני": one row of eleven along the house, Moses' in its middle.'''
EW_MEIRI_CODE = '''          const z = SOL.TBL0.z, xM = SOL.TBL0.x;
          for (let i = 1; i <= 5; i++) { tables.push([xM - 2 * i, z, 0]); tables.push([xM + 2 * i, z, 0]); }'''
MEN_MIRROR_DOC = '''as the tables, in the south (the Meiri: "כשם שנחלקו בשלחנות לצד הצפון כך נחלקו במנורות לצד
    // דרום") - two rows of five, two amot apart, about Moses' menorah, which does not move (the morning's service goes to it).'''
MEN_MIRROR_CODE = '''        {
          const xM = MEN.x, zM = MEN0.z;
          if (!mEW) { for (const x of [xM - 3.5, xM + 3.5]) for (let i = 0; i < 5; i++) mens.push([x, 1 + 2 * i, Math.PI / 2]); }
          else { const zN = zM - 1.75, zS = zM + 1.75, x0 = xM + 2.5; for (const z of [zN, zS]) for (let i = 0; i < 5; i++) mens.push([x0 + 2 * i, z, 0]); }
        }'''
MEN_ROW_DOC = '''one row of eleven, Moses' in its middle, two amot apart, along the lamps' own line.'''
MEN_ROW_CODE = '''        {
          const xM = MEN.x, zM = MEN0.z;
          for (let i = 1; i <= 5; i++) { if (!mEW) { mens.push([xM - 2 * i, zM, Math.PI / 2]); mens.push([xM + 2 * i, zM, Math.PI / 2]); } else { mens.push([xM - 2 * i, zM, 0]); mens.push([xM + 2 * i, zM, 0]); } }
        }'''
block = block % {'EWDOC': EW_GEMARA_DOC if EW == 'gemara' else EW_MEIRI_DOC, 'EWCODE': EW_GEMARA_CODE if EW == 'gemara' else EW_MEIRI_CODE,
                 'MENDOC': MEN_MIRROR_DOC if MEN == 'mirror' else MEN_ROW_DOC, 'MENCODE': MEN_MIRROR_CODE if MEN == 'mirror' else MEN_ROW_CODE}
if A in s:
    i = s.index(A); j = s.index(B, i) + len(B)
    s = s[:i] + block + s[j:]
else:
    anchor = '    ctx2.shared.flyPoints = ctx2.shared.flyPoints || {};\n    Object.assign(ctx2.shared.flyPoints, {\n      menorah: {'
    assert s.count(anchor) == 1
    s = s.replace(anchor, block + anchor)
# hooks (SOLOMON_214): a holder declared before vesselMetal, filled by the block; the metal, the table's direction and the menorah's call it
if 'const SOL_HOOK = {};' not in s:
    a0 = '    ctx2.shared.vesselMetal = {\n'
    assert s.count(a0) == 1
    s = s.replace(a0, '    const SOL_HOOK = {};   // SOLOMON_214: filled below (the vessels of Solomon), called by the metal and the two directions\n' + a0)
h1 = """        tblCrown.material = METALS[k].crown;
        return true;"""
if h1 in s:
    s = s.replace(h1, """        tblCrown.material = METALS[k].crown;
        if (SOL_HOOK.metal) SOL_HOOK.metal(k);   // SOLOMON_214
        return true;""")
h2 = """          if (typeof im.computeBoundingBox === "function") im.computeBoundingBox();
        }
        return true;
      },
      get() { return this.current; }
    };
    const menLay = {"""
if h2 in s:
    s = s.replace(h2, """          if (typeof im.computeBoundingBox === "function") im.computeBoundingBox();
        }
        if (SOL_HOOK.place) SOL_HOOK.place();   // SOLOMON_214
        return true;
      },
      get() { return this.current; }
    };
    const menLay = {""")
h3 = """        const fp = ctx2.shared.flyPoints && ctx2.shared.flyPoints.menorah;   // the menorah's view: broadside to the row of the lamps
        if (fp) fp.pos = k === "ew" ? [MEN.x + 1.2, FL + 3.2, MEN.z - 4.4] : [MEN.x + 4.2, FL + 3.2, MEN.z + 1.2];
        return true;"""
if h3 in s:
    s = s.replace(h3, """        const fp = ctx2.shared.flyPoints && ctx2.shared.flyPoints.menorah;   // the menorah's view: broadside to the row of the lamps
        if (fp) fp.pos = k === "ew" ? [MEN.x + 1.2, FL + 3.2, MEN.z - 4.4] : [MEN.x + 4.2, FL + 3.2, MEN.z + 1.2];
        if (SOL_HOOK.place) SOL_HOOK.place();   // SOLOMON_214
        return true;""")
t0 = '        const m = int_part(TBL.x, FL, TBL.z, TBL.rot, 0, 0, 0);\n        for (const im of [tblBody, tblCrown, tblRig, tblEnds, tblSpoons, tblBread, tblIncense]) {'
if t0 in s:   # the table on the floor at its own x (Moses' table moves with Solomon's: SOLOMON_214)
    s = s.replace(t0, t0.replace('int_part(TBL.x, FL, TBL.z', 'int_part(TBL.x, LV.HEI + houseRise(TBL.x), TBL.z'))
open(P, 'w', encoding='utf-8').write(s)
print('ok', EW, MEN)
