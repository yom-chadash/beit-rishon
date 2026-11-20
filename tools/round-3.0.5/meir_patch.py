#!/usr/bin/env python3
# round 3.0.5 (בית שני 2.0.14) - MEIR_TABLES_305 (the user, 19.11.2026 22:21: "בהדגמת שיטת ר' מאיר... מודגם ההיכל בלי כל השולחנות
# והמנורות של שלמה... לפי שיטה זו בודאי שצריך להדגים את ההיכל עם עשר שולחנות שלמה (וכמ"ד צפון דרום היו מונחים - לתירוץ הראשון בגמ',
# וכמ"ד מזרח ומערב היו מונחין - לתירוץ השני בגמ')"; 22:36: "א: תנסה להבין את רשי ולבצע על פיו... ב: תוס ריד למסקנא הוא בעצם כשיטה
# החולקת על ר מאיר"). Into sheni-src/bundle.js, after altar_patch.py (the altar 1.25 further east - the way of Rashi's answer):
#  1. solomonVessels.menHold(on) - Solomon's menorahs alone hidden;
#  2. the high priest's walk, R. Meir's reading: the ten tables whatever the row "שולחנות שלמה ומנורותיו" holds, north-south with
#     Moses' table (the row "כיוון המנורה והשולחן" for the walk) until the second answer's caption, then east-west; his way by Rashi -
#     north of the altar, between it and the east row's southern head, west along the heads, and between the west row and the parochet
#     north to the opening; the menorahs hidden while he walks; the rows as they were at its end; its captions (Rashi's words), its eye;
#  3. the reading's card.
# Run from the repository's root: python3 -I tools/round-3.0.5/meir_patch.py ; then node tools/safe-lines.mjs sheni-src/bundle.js
import sys

def rd(p):
    return open(p, encoding='utf-8').read()

def wr(p, s):
    open(p, 'w', encoding='utf-8').write(s)

def once(s, old, new, what):
    k = s.count(old)
    if k != 1:
        sys.exit('%s: anchor found %d times' % (what, k))
    return s.replace(old, new)

p = 'sheni-src/bundle.js'
s = rd(p)
if 'MEIR_TABLES_305' in s:
    sys.exit('already applied')
if 'ALTAR_EAST_305' not in s:
    sys.exit('altar_patch.py first')

# ---------- 1. the menorahs alone ----------
s = once(s, '        hold(on) { this.held = !!on; sg.visible = SOL.on && !this.held; }, //\n',
         '        hold(on) { this.held = !!on; sg.visible = SOL.on && !this.held; }, //\n'
         '        // MEIR_TABLES_305: Solomon\'s menorahs alone hidden (R. Meir\'s walk shows the ten tables, 50-heichal.js ykEntry) //\n'
         '        menHold(on) { SOL.menOff = !!on; SOL.place(); }, //\n', 'menHold')
s = once(s, '        SOL.mMidEW.visible = SOL.mSideEW.visible = mEW; //\n',
         '        SOL.mMidEW.visible = SOL.mSideEW.visible = mEW; //\n'
         '        SOL.mBody.visible = !SOL.menOff;   // MEIR_TABLES_305 //\n'
         '        if (SOL.menOff) SOL.mMidNS.visible = SOL.mSideNS.visible = SOL.mMidEW.visible = SOL.mSideEW.visible = false; //\n'
         '        SOL.flames.visible = SOL.lit && !SOL.menOff; //\n', 'menOff place')

# ---------- 2. the walk ----------
s = once(s, '          meir: [[0, -7.5, -1.2], [2.6, -15.5, -2.4], [7.6, -31.5, -3.4], [9.4, -37, -3.6], [10.15, -38.8, -4.4], [10.92, -40.3, -5.8], [11.62, -41.5, -7.2], [12.07, -42.5, -7.8], [12.47, -43.5, -8.15], [12.85, -44.5, -8.3], [13.07, -44.86, -8.27], [13.29, -45.18, -8.05], [13.49, -45.32, -7.76], [13.6, -45.35, -7.57], [16.6, -45.35, -0.5], [17.4, -46.95, 0]] //\n',
         '          // MEIR_TABLES_305: by Rashi (Yoma 51b) among Solomon\'s ten - "הלכך מפסקי שולחנות את הדרך ולא מתעייל ליה בין שולחן לכותל", //\n'
         '          // and "שאין המזבח מכוון כנגד השולחן אלא משוך קימעא כלפי חוץ": north of the altar (its west face x -32.75), between it and the //\n'
         '          // east row\'s southern head (its east face -34; ALTAR_EAST_305), west along the heads (z 0), between the west row (-42) and the //\n'
         '          // parochet north to the opening, and in as before (2.75 s later). The same way clears the tables east-west. Until 2.0.13 he //\n'
         '          // went west along z -3.4 and turned north past Moses\' table (one table) //\n'
         '          meir: [[0, -7.5, -1.2], [2.6, -15.5, -1.3], [7.0, -29.5, -1.3], [8.0, -32.3, -1.35], [8.45, -33.2, -1.25], [8.85, -33.4, -0.6], [9.25, -33.4, 0.55], [9.7, -34.5, 0.8], [11.5, -40.0, 0.8], [12.4, -42.7, 0.5], [12.8, -43.3, -0.3], [14.9, -43.6, -6.9], [15.4, -44.2, -8.2], [15.6, -44.5, -8.3], [15.82, -44.86, -8.27], [16.04, -45.18, -8.05], [16.24, -45.32, -7.76], [16.35, -45.35, -7.57], [19.35, -45.35, -0.5], [20.15, -46.95, 0]] //\n', 'path')
s = once(s, '          meir: [[20.8, -45.35, -5.0, 0], [22.0, -45.35, -8.66, 0], [22.8, -43.5, -8.66, WESTY], [24.0, -41.0, -6.6, WESTY]] //\n',
         '          meir: [[23.55, -45.35, -5.0, 0], [24.75, -45.35, -8.66, 0], [25.55, -43.5, -8.66, WESTY], [26.75, -41.0, -6.6, WESTY]]   // MEIR_TABLES_305: 2.75 later //\n', 'back')
a = s.index('          meir: [ //\n            [0, [-5.6, E(-5.6, 3.6), 1.0], [-12, E(-12, 2.4), -1.6]], //\n')
b = s.index('          ] //\n', a) + len('          ] //\n')
s = s[:a] + ('          meir: [   // MEIR_TABLES_305: the eye behind him and a little up - the altar and the rows\' heads, the way between them, the corridor //\n'
             '            [0, [-5.6, E(-5.6, 3.6), 1.0], [-12, E(-12, 2.4), -1.6]], //\n'
             '            [2.8, [-10.0, E(-10, 3.6), 0.4], [-18, E(-18, 2.3), -1.6]], //\n'
             '            [6.8, [-21.5, E(-21.5, 4.4), 2.6], [-31.5, E(-31.5, 1.8), -1.6]], //\n'
             '            [8.8, [-27.0, E(-27, 4.8), 4.2], [-34.2, E(-34.2, 1.6), -0.8]], //\n'
             '            [10.6, [-30.5, E(-30.5, 4.6), 5.0], [-39.5, E(-39.5, 1.8), 0.2]], //\n'
             '            [12.6, [-36.5, E(-36.5, 4.4), 4.4], [-43.6, E(-43.6, 2.0), -1.0]], //\n'
             '            [14.6, [-39.8, E(-39.8, 3.8), -1.6], [-44.6, E(-44.6, 2.3), -8.0]], //\n'
             '            [16.15, [-40.6, E(-40.6, 3.5), -7.4], [-45.2, E(-45, 2.3), -9.1]], //\n'
             '            [21.65, [-40.9, E(-40.9, 3.5), -7.2], [-45.2, E(-45, 2.3), -9.1]], //\n'
             '            [22.85, [-38.5, E(-38.5, 3.6), -4.0], [-44.4, E(-44.4, 2.3), -9.0]], //\n'
             '            [27.65, [-37.6, E(-37.6, 3.6), -3.2], [-42.0, E(-42, 2.3), -7.6]], //\n'
             '            [29.65, [-37.6, E(-37.6, 3.6), -3.2], [-42.0, E(-42, 2.3), -7.6]] //\n'
             '          ] //\n') + s[b:]
s = once(s, '        const HOLD = { two: 4, one: 4.6, meir: 4.6 }, HOLD_FROM = { two: 21.4, one: 18.4, meir: 18.9 }; //\n',
         '        const MEIR_EW_T = 12.6;   // MEIR_TABLES_305: the second answer\'s caption - the tables turn east-west //\n'
         '        const HOLD = { two: 4, one: 4.6, meir: 4.6 }, HOLD_FROM = { two: 21.4, one: 18.4, meir: 21.65 };   // (meir 18.9 until 2.0.13) //\n', 'hold')
a = s.index('          meir: [[0, C0], [2.8, "״רבי מאיר אומר: בין שלחן למזבח״')
b = s.index('[20.2 + HOLD.meir, C_OUT]] //\n', a) + len('[20.2 + HOLD.meir, C_OUT]] //\n')
s = s[:a] + ('          meir: [[0, C0], [2.8, "״רבי מאיר אומר: בין שלחן למזבח״ — ״לעולם כרבי יוסי סבירא ליה״: הפתח בצפון (יומא נא:)"], //\n'
             '                [5.2, "״שולחנות צפון ודרום מונחין, ומפסקא ליה שלחן ולא מתעייל ליה״ — רש״י: ״עשר שולחנות עשה שלמה... חמש בשורה אחת... ועל כרחך צריך היה לסמוך ראש השולחן הצפוני לכותל... הלכך מפסקי שולחנות את הדרך״"], //\n'
             '                [8.3, "רש״י: ״ואם תאמר אף בין המזבח לשולחן אין דרך... שאין המזבח מכוון כנגד השולחן, אלא משוך קימעא כלפי חוץ״"], //\n'
             '                [MEIR_EW_T, "״ואיבעית אימא: לעולם מזרח ומערב מונחין, ומשום שכינה לאו אורח ארעא למיעל להדיא״ (יומא נא:–נב.) — השולחנות ממזרח למערב"], //\n'
             '                [15.95, C_ARON.replace("״הגיע לצפון, הופך", "״הופך")], //\n'
             '                [19.95, C_EVEN], [19.95 + 4.2, C_IN], [22.95 + HOLD.meir, C_OUT]] //\n') + s[b:]
s = once(s, '        const solHold = (on) => { const S = ctx2.shared.solomonVessels; if (S && typeof S.hold === "function") { try { S.hold(on); } catch (_) {} } }; //\n',
         '        const solHold = (on) => { const S = ctx2.shared.solomonVessels; if (S && typeof S.hold === "function") { try { S.hold(on); } catch (_) {} } }; //\n'
         '        // MEIR_TABLES_305 (the user, 22:21, 22:36): in R. Meir\'s reading the ten tables stand whatever the row "שולחנות שלמה ומנורותיו" //\n'
         '        // holds (the Tosafot Rid\'s one table is a reading against R. Meir), north-south with Moses\' table until the second answer\'s //\n'
         '        // caption (MEIR_EW_T), then east-west; Solomon\'s menorahs are hidden while he walks; at the end both rows as they were //\n'
         '        const meirSol = (on) => { //\n'
         '          const S = ctx2.shared.solomonVessels, TD = ctx2.shared.tableDir; //\n'
         '          if (!S || !TD) return; //\n'
         '          try { //\n'
         '            if (on) { Y.solSaved = { sol: S.current, dir: TD.current }; S.hold(false); S.set("ten"); TD.set("ns"); if (typeof S.menHold === "function") S.menHold(true); } //\n'
         '            else if (Y.solSaved) { const v = Y.solSaved; Y.solSaved = null; if (typeof S.menHold === "function") S.menHold(false); TD.set(v.dir); S.set(v.sol); } //\n'
         '          } catch (_) {} //\n'
         '        }; //\n', 'meirSol')
s = once(s, '          kohSteps(-1);   // SOUNDS_300 (item 7) //\n          solHold(false); //\n',
         '          kohSteps(-1);   // SOUNDS_300 (item 7) //\n          if (Y.solSaved) meirSol(false); else solHold(false);   // MEIR_TABLES_305 //\n', 'stop')
s = once(s, '          Y.stop(); //\n          solHold(true); //\n          { const pc = ctx2.shared.parochotCount; Y.mode = pc && (pc.mode === "one" || pc.mode === "meir" || pc.mode === "rashba") ? pc.mode : "two"; }   // MEIR_218, RASHBA_304 //\n',
         '          Y.stop(); //\n          { const pc = ctx2.shared.parochotCount; Y.mode = pc && (pc.mode === "one" || pc.mode === "meir" || pc.mode === "rashba") ? pc.mode : "two"; }   // MEIR_218, RASHBA_304 //\n'
         '          if (Y.mode === "meir") meirSol(true); else solHold(true);   // MEIR_TABLES_305 //\n', 'start')
s = once(s, '          const t = DW.now(), P = PATH[Y.mode], B = BACK[Y.mode], tin = P[P.length - 1][0]; //\n',
         '          const t = DW.now(), P = PATH[Y.mode], B = BACK[Y.mode], tin = P[P.length - 1][0]; //\n'
         '          if (Y.solSaved) { const TD = ctx2.shared.tableDir, want = t >= MEIR_EW_T ? "ew" : "ns"; if (TD && TD.current !== want) { try { TD.set(want); } catch (_) {} } }   // MEIR_TABLES_305 //\n', 'switch')

# ---------- 3. the card ----------
OLD = 'במודל: פרוכת אחת, כרבי יוסי, ופתחה בצפון — כמאירי וכתוספות יום טוב. בהדגמת הכהן הגדול: הוא מהלך בין השולחן למזבח, ואחרי השולחן פונה לצפון, אל הפתח, ונכנס בו כבשיטת רבי יוסי.'
NEW = ('במודל: פרוכת אחת, כרבי יוסי, ופתחה בצפון — כמאירי וכתוספות יום טוב.\\n'
       '**בהדגמת הכהן הגדול** — עשרת שולחנות שלמה עומדים בהיכל, כרש״י, בכל מצב של המתג ״שולחנות שלמה ומנורותיו״: תוספות רי״ד, שמסקנתו '
       '״אלמא לא הי׳ בהיכל אלא שלחן אחד בלבד בבית שני״, כותב זאת מכוח המשנה בשקלים (ו, ד), והוא שיטה החולקת על רבי מאיר. '
       'בתחילה השולחנות צפון ודרום, כתירוץ הראשון: הכהן הגדול מהלך מצפון למזבח, עובר בין המזבח לראש השורה המזרחית — ״שאין המזבח מכוון כנגד השולחן, '
       'אלא משוך קימעא כלפי חוץ״ (רש״י) — ממשיך מערבה לאורך ראשי השולחנות, ובין השורה המערבית לפרוכת פונה צפונה, אל הפתח, ונכנס בו כבשיטת רבי יוסי. '
       'בכתובית של התירוץ השני — השולחנות ממזרח למערב. מנורות שלמה מוסתרות בזמן ההליכה. בסוף ההדגמה חוזר הכל כמו שנבחר במתגים. '
       'וכן כתבו התוספות (מנחות צח:): ״אע״ג דרבי מאיר סבירא ליה צפון ודרום מונחים כדמסיק התם, ניחא דיכול להלך בין שולחן למזבח, דשולחנות שלמה קיימי בתרי דרי... '
       'והמזבח היה בין שולחן דמשה למנורה דמשה, אלא שמשוך קימעא כלפי חוץ, ומזבח הזהב היה אמה על אמה — נמצא מקום פנוי הרבה שהיה יכול להלך בין המזבח לשולחנות״. '
       'הדרך המדויקת ומקום המזבח (אמה ורבע מזרחה יותר מבעבר, כדי שיהיה מעבר בינו ובין השולחנות) — בחירת מודל לפי רש״י.')
s = once(s, OLD, NEW, 'card')
wr(p, s)
print('MEIR_TABLES_305 applied')
