# MENOROT_305 (3.0.5) - the menorah a little narrower (the user, 19.11.2026 23:41: "רוחב מנורות - א - בתנאי שאתה לא פוגע בעיצוב";
# 23:49: "גם בית ראשון" - src/55-interior.js, by hand): the lamps 0.24 apart (0.27), the lamps and their nozzles in the same proportion,
# the height and the form as they were. Solomon's menorahs north-south from the south wall, the east row before the tables' east row;
# R. Meir's walk shows them (and the golden stands, the user 23:26), between the tables' heads and the menorahs' (the Ritva); his card.
# Run after meir_patch.py: python3 -I tools/round-3.0.5/menorot_patch.py ; then node tools/safe-lines.mjs sheni-src/bundle.js
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
if 'MENOROT_305' in s:
    sys.exit('already applied')
if 'MEIR_TABLES_305' not in s:
    sys.exit('meir_patch.py first')

# ---------- 1. the menorah ----------
s = once(s, '    const LAMP_R = 0.27; //\n',
         '    // MENOROT_305 (the user, 19.11.2026 23:41: "רוחב מנורות - א - בתנאי שאתה לא פוגע בעיצוב"): 0.27 until 3.0.4 - the menorah 1.67 wide //\n'
         '    // (1.88), so that five north-south fit the south half with a way between them and the tables\' heads, as R. Meir\'s walk needs //\n'
         '    // (the Ritva, Yoma 51b: "ונכנס בצד סוף השלחן הסמוך לו בין שלחן למנורה והולך לצפון"); its breadth is not given (Menachot 28b: //\n'
         '    // its height alone). The form and the height as they were; the lamps and their nozzles narrower in the same proportion (0.889) //\n'
         '    const LAMP_R = 0.24; //\n', 'LAMP_R')
s = once(s, '      for (const dx of [-3, -2, -1, 0, 1, 2, 3]) add(new CylinderGeometry(0.13, 0.08, 0.16, 8), dx * LAMP_R, 3.08, 0);   // the seven lamps ("נרתיה") //\n',
         '      for (const dx of [-3, -2, -1, 0, 1, 2, 3]) add(new CylinderGeometry(0.115, 0.071, 0.16, 8), dx * LAMP_R, 3.08, 0);   // the seven lamps ("נרתיה"); MENOROT_305: 0.13, 0.08 until 3.0.4 //\n', 'lamps')
s = once(s, '      // NOZZLE_211b: the lamps stand LAMP_R (0.27) apart and their tops are 0.26 wide, so a spout cannot reach out sideways (the first //\n',
         '      // NOZZLE_211b: the lamps stand LAMP_R (0.24; MENOROT_305) apart and their tops are 0.23 wide, so a spout cannot reach out sideways (the first //\n', 'nozzle note 1')
s = once(s, '      // face, from 0.04 to 0.125 off the lamp\'s centre, the wick\'s mouth at the rim (the flame on it: SPT below) //\n',
         '      // face, from 0.035 to 0.111 off the lamp\'s centre (MENOROT_305; 0.04 to 0.125 until 3.0.4), the wick\'s mouth at the rim (the flame on it: SPT below) //\n', 'nozzle note 2')
s = once(s, '        const B = new Vector3(x + dirX * 0.04, 3.13, dirZ * 0.04), T = new Vector3(x + dirX * 0.125, 3.205, dirZ * 0.125), v = T.clone().sub(B); //\n',
         '        const B = new Vector3(x + dirX * 0.035, 3.13, dirZ * 0.035), T = new Vector3(x + dirX * 0.111, 3.205, dirZ * 0.111), v = T.clone().sub(B); //\n', 'nozzle')
s = once(s, '        const sg = new CylinderGeometry(0.02, 0.034, v.length(), 8); //\n',
         '        const sg = new CylinderGeometry(0.018, 0.03, v.length(), 8); //\n', 'nozzle r')
s = once(s, '    const SPT = 0.115, FLY = 3.17; //\n', '    const SPT = 0.102, FLY = 3.17;   // MENOROT_305: 0.115 until 3.0.4 //\n', 'SPT')

# ---------- 2. Solomon's menorahs north-south ----------
s = once(s, '    // dרום") - two rows of five, two amot apart, about Moses\' menorah, which does not move (the morning\'s service goes to it). //\n'.replace('dרום', 'דרום'),
         '    // דרום") - two rows of five about Moses\' menorah, which does not move (the morning\'s service goes to it); north-south they stand from //\n'
         '    // the south wall (MENOROT_305, below). //\n', 'sol note')
s = once(s, '          if (!mEW) { for (const x of [xM - 3.5, xM + 3.5]) for (let i = 0; i < 5; i++) mens.push([x, 1 + 2 * i, Math.PI / 2]); } //\n',
         '          // MENOROT_305: north-south - the five of a row from the south wall toward the middle, a little air between them and from the //\n'
         '          // wall (0.05); the east row 2.5 east of Moses\' menorah, before the tables\' east row (3.5 until 3.0.4 - it stood in the way //\n'
         '          // between the altar and the tables), the west row 3.5 west of it (the golden stands at x -42); between the tables\' heads //\n'
         '          // (z 0) and the menorahs\' (z 1.4) R. Meir\'s way - "בין שלחן למנורה" (the Ritva, Yoma 51b). Until 3.0.4: two amot apart from z 1 //\n'
         '          if (!mEW) { const h = 3 * LAMP_R + 0.115, gp = 0.05; for (const x of [xM - 3.5, xM + 2.5]) for (let i = 0; i < 5; i++) mens.push([x, 10 - gp - h - i * (2 * h + gp), Math.PI / 2]); } //\n', 'sol ns')

# ---------- 3. R. Meir's walk: the menorahs seen, the golden stands, his way in the middle of the passage ----------
s = once(s, '            if (on) { Y.solSaved = { sol: S.current, dir: TD.current }; S.hold(false); S.set("ten"); TD.set("ns"); if (typeof S.menHold === "function") S.menHold(true); } //\n',
         '            if (on) { Y.solSaved = { sol: S.current, dir: TD.current }; S.hold(false); S.set("ten"); TD.set("ns"); kanimFor(true); }   // MENOROT_305: the menorahs stay //\n', 'meirSol on')
s = once(s, '            else if (Y.solSaved) { const v = Y.solSaved; Y.solSaved = null; if (typeof S.menHold === "function") S.menHold(false); TD.set(v.dir); S.set(v.sol); } //\n',
         '            else if (Y.solSaved) { const v = Y.solSaved; Y.solSaved = null; kanimFor(false); TD.set(v.dir); S.set(v.sol); } //\n', 'meirSol off')
s = once(s, '        const meirSol = (on) => { //\n',
         '        // MENOROT_305 (the user, 19.11.2026 23:26: "כנים הכוונה לכן... יש לנו מתג על זה"): the golden stands (kanim; one or two by their //\n'
         '        // row) stand in the heichal while R. Meir\'s walk runs - put back off at its end, if they were off //\n'
         '        const kanimFor = (on) => { //\n'
         '          const FK = (ctx2.shared.features || {}).kanim; //\n'
         '          if (!FK) return; //\n'
         '          try { if (on) { Y.kanimWas = FK.isOn(); if (!Y.kanimWas) FK.on(); } else if (Y.kanimWas === false) { FK.off(); Y.kanimWas = null; } } catch (_) {} //\n'
         '        }; //\n'
         '        const meirSol = (on) => { //\n', 'kanimFor')
s = once(s, '[9.7, -34.5, 0.8], [11.5, -40.0, 0.8], [12.4, -42.7, 0.5]',
         '[9.7, -34.5, 0.7], [11.5, -40.0, 0.7], [12.4, -42.7, 0.5]', 'meir path')

# ---------- 4. the card ----------
s = once(s, 'מנורות שלמה מוסתרות בזמן ההליכה. ',
         'מנורות שלמה עומדות בדרום, חמש וחמש, מן הכותל הדרומי, והכהן הגדול הולך בין ראשי השולחנות לראשי המנורות — כלשון הריטב״א (יומא נא:): '
         '״הילכך בין מזבח לשולחן כי המזבח משוך הי׳ כלפי חוץ כדאיתא לעיל ונכנס בצד סוף השלחן הסמוך לו בין שלחן למנורה והולך לצפון״. '
         'כני הזהב שבהיכל עומדים במקומם, כמתג ״כני הזהב — שניים או אחד״. ', 'card menorahs')
s = once(s, 'תוספות רי״ד, שמסקנתו ״אלמא לא הי׳ בהיכל אלא שלחן אחד בלבד בבית שני״, כותב זאת מכוח המשנה בשקלים (ו, ד), והוא שיטה החולקת על רבי מאיר. ',
         'תוספות רי״ד מדייק מכאן ״דעשרה שולחנות שעשה שלמה הי׳ בבית שני״, ומקשה מן המשנה בשקלים (ו, ד); ומסקנתו ״אלמא לא הי׳ בהיכל אלא שלחן אחד בלבד בבית שני״ — '
         'והיא שיטה החולקת על רבי מאיר. ', 'card rid')
s = once(s, 'נמצא מקום פנוי הרבה שהיה יכול להלך בין המזבח לשולחנות״. ',
         'נמצא מקום פנוי הרבה שהיה יכול להלך בין המזבח לשולחנות״. '
         'והמאירי (יומא נא:): ״שהשלחנות עומדות צפון ודרום וראשי השלחנות מחברים לכותל ומפסיקות המהלך ומתוך כך בוקע בין מזבח לשלחן״. '
         'ותוספות רבינו פרץ (יומא נא:): ״לכן נראה לי שהיה המזבח בין השולחנות של שלמה למול שלחן של משה משוך קימעא לצד חוץ, פירוש למזרח, ויש דרך לעבור בינתים״. '
         'ובגרסת רבינו חננאל הדברים בשם רבי יהודה: ״ואמרינן לעולם ר׳ יהודה פתחא בצפון קאי וקסבר שלחנות בצפון ודרום היו מונחין ומפסקי ליה ולא מתעייל ליה״. ', 'card rishonim')
s = once(s, 'הדרך המדויקת ומקום המזבח (אמה ורבע מזרחה יותר מבעבר, כדי שיהיה מעבר בינו ובין השולחנות) — בחירת מודל לפי רש״י.',
         'הדרך המדויקת, מקום המזבח (אמה ורבע מזרחה יותר מבעבר, כדי שיהיה מעבר בינו ובין השולחנות), ומקום המנורות בשורותיהן — בחירת מודל לפי רש״י והריטב״א.', 'card end')

wr(p, s)
print('MENOROT_305 applied')
