# NIGHT_WATCH_305 (3.0.5) - the morning's service begins in the night: Ish Har HaBayit and Ben Bavi (a new first stage, "ihb"),
# the officer followed across the chel and up the flight (the stage "moked"), and Gevini's call (a new stage after it, "gevini").
# The user, 19.11.2026 21:15 / 21:24 ("4. הממונה", "5. להוסיף את איש הר הבית..."), 23:26 ("2. כתפא"י", "3. ב"), 23:49 ("שלום עליך - א").
# The row "״שלום עליך״ — איש הר הבית או השומר" (sh61) in the group of the Temple Mount and the chel.
# Run after menorot_patch.py: python3 -I tools/round-3.0.5/night_watch_patch.py ; then node tools/safe-lines.mjs sheni-src/bundle.js
import json, os, re, sys

def rd(p):
    return open(p, encoding='utf-8').read()

def wr(p, s):
    open(p, 'w', encoding='utf-8').write(s)

def once(s, old, new, what):
    k = s.count(old)
    if k != 1:
        sys.exit('%s: anchor found %d times' % (what, k))
    return s.replace(old, new)

HERE = os.path.dirname(os.path.abspath(__file__))
p = 'sheni-src/bundle.js'
s = rd(p)
if 'NIGHT_WATCH_305' in s:
    sys.exit('already applied')
TX = json.load(open(os.path.join(os.path.dirname(os.path.abspath(__file__)), 'night_texts.json'), encoding='utf-8'))

# ---------- 1. the figures ----------
s = once(s, '      for (const id of LEV_IDS) makeFig(id, "L"); //\n',
         '      for (const id of LEV_IDS) makeFig(id, "L"); //\n'
         '      // NIGHT_WATCH_305: the night\'s watch - Ish Har HaBayit (his tribe is not said: plain clothes in a colour of his own, as the //\n'
         '      // officers\' "not said"), four Levite guards, and Ben Bavi and Gevini - priests ("בן בביי, שם כהן", Rabbeinu Elyakim on Yoma 23a; //\n'
         '      // "כהן ששמו גביני", the Bartenura on Tamid 3:8), in the priests\' garments without the avnet: "לפיכך לובשם ביום עבודתו ואפילו //\n'
         '      // שלא בשעת עבודה, חוץ מן האבנט מפני שהוא שעטנז" (the Rambam, Klei HaMikdash 8:11) //\n'
         '      for (const id of ["bbv", "gev"]) { const f = makeFig(id, "K"); if (f.belt) f.belt.visible = false; } //\n'
         '      for (const id of ["ihb", "gk", "gn", "gc", "gp"]) makeFig(id, "L"); //\n'
         '      if (KG) { const mI = KG.mLev.clone(); mI.color.setHex(0x56606e); figs.ihb.g.traverse((o) => { if (o.isMesh && o.material === KG.mLev) o.material = mI; }); } //\n', 'figs')

# ---------- 2. the world: lanterns, the sleepers on their stones, the cloak, the staff, the pakia, the torch ----------
s = once(s, '      torch(1); torch(2); //\n', '      torch(1); torch(2); //\n' + rd(os.path.join(HERE, 'night-world.js')), 'world')
s = once(s, '      return { group, altarG, MAT, G, figs, hp: hpGarb, piles, lamb, props, sleepers, L1, L2, modelGez, blood, tagMat, paths: new Map(), routes: new Map() }; //\n',
         '      return { group, altarG, MAT, G, figs, hp: hpGarb, piles, lamb, props, sleepers, L1, L2, modelGez, blood, tagMat, paths: new Map(), routes: new Map(), night: NW };   // NIGHT_WATCH_305 //\n', 'W')
s = once(s, 'slab: 0, slabKeys: 1, fx: [], night: 1 }); //',
         'slab: 0, slabKeys: 1, fx: [], night: 1, //\n        lanterns: 0, lantA: 0, joltN: 0, joltP: 0, cloakFire: 0, ltorchOut: 0 });   // NIGHT_WATCH_305 //', 'N')
s = once(s, '      W.sleepers.visible = N.sleepers > 0.5; //\n',
         '      W.sleepers.visible = N.sleepers > 0.5; //\n      if (W.night) W.night.apply(N);   // NIGHT_WATCH_305 //\n', 'apply')

# ---------- 3. the poses ----------
s = once(s, '      kiddush: [[-0.3, 0.14, 0], [-0.3, 0.14, 0], 0.4] //\n    }; //\n',
         '      kiddush: [[-0.3, 0.14, 0], [-0.3, 0.14, 0], 0.4], //\n'
         '      // NIGHT_WATCH_305: "שלום עליך" - the right hand raised before him; the blow of the staff or the pakia (applyFig); woken; up from //\n'
         '      // the stone; the left hand to the lantern and down to the cloak; the herald\'s two hands about his mouth (callArms) //\n'
         '      hail: [[-1.25, 0.12, -0.75], [0.05, 0.08, -0.15], 0.04], strike: [[-0.85, 0.05, -0.15], [0.05, 0.08, -0.15], 0.1], //\n'
         '      startle: [[0.05, 0.08, -0.15], [0.05, 0.08, -0.15], 0], rise: [[0.05, 0.08, -0.15], [0.05, 0.08, -0.15], 0], //\n'
         '      reachL: [[0.05, 0.08, -0.15], [-1.9, -0.05, -0.4], 0], lowerL: [[0.05, 0.08, -0.15], [-0.6, -0.05, -0.2], 0], call: [[-0.9, 0.2, -1.6], [-0.9, 0.2, -1.6], 0] //\n'
         '    }; //\n', 'POSES')
s = once(s, '    const KB = 0.95;   // KIDDUSH_BEND_212: how far he bends at the waist (rad) - a model choice //\n',
         '    const KB = 0.95;   // KIDDUSH_BEND_212: how far he bends at the waist (rad) - a model choice //\n'
         '    // NIGHT_WATCH_305: the herald\'s hands cupped about his mouth - the targets in the bending part\'s frame, as kidReach\'s (cached) //\n'
         '    const callArms = (f) => { //\n'
         '      if (f.callArms) return f.callArms; //\n'
         '      const K = SH.priestKit, FS = K.FS, WY = f.bend.position.y, A = f.A, my = K.HEAD_Y * FS - 0.135 - WY, out = {}; //\n'
         '      for (const side of [1, -1]) out[side] = reach([side * A.sx, A.sy - WY, 0], [side * 0.075, my, 0.27], A.up, A.fo + 0.06 * FS, side); //\n'
         '      return (f.callArms = out); //\n'
         '    }; //\n', 'callArms')
s = once(s, '        else if (p === "knock") R = [-1.4 + 0.2 * Math.sin(t * 9), 0.05, -1.3]; //\n',
         '        else if (p === "knock") R = [-1.4 + 0.2 * Math.sin(t * 9), 0.05, -1.3]; //\n'
         '        else if (p === "strike") {   // NIGHT_WATCH_305: raised high and brought down, twice in 1.4 seconds //\n'
         '          const ph = (t / 0.7) % 1, k = ph < 0.55 ? smooth(ph / 0.55) : 1 - smooth(Math.min(1, (ph - 0.55) / 0.2)); //\n'
         '          R = [lerp(-0.85, -2.75, k), lerp(0.05, 0.3, k), lerp(-0.15, -0.55, k)]; lean = 0.1 + 0.08 * (1 - k); //\n'
         '        } //\n'
         '        else if (p === "hail") R = [-1.25 - 0.12 * Math.sin(t * 5), 0.12, -0.75]; //\n'
         '        else if (p === "startle") { const u = smooth(clamp(t / 0.25, 0, 1)) * (1 - smooth(clamp((t - 0.6) / 0.4, 0, 1))); R = Lv = [lerp(0.05, -1.0, u), lerp(0.08, 0.45, u), lerp(-0.15, -1.25, u)]; lean = -0.1 * u; } //\n'
         '        else if (p === "rise" && f.bend) { const u = 1 - smooth(clamp(t / 0.8, 0, 1)); bendA = 0.6 * u; R = Lv = [lerp(0.05, -0.5, u), 0.15, lerp(-0.15, -0.6, u)]; } //\n'
         '        else if (p === "lowerL" && f.bend) { const u = smooth(clamp(t / 0.4, 0, 1)); bendA = 0.55 * u; } //\n'
         '        else if (p === "call" && f.bend && f.A && SH.priestKit) { const H = callArms(f); R = H[-1]; Lv = H[1]; bendA = 0.1 + 0.06 * Math.sin(t * 2.6); } //\n', 'applyFig')

# ---------- 4. the stages ----------
s = once(s, '    SC.moked = (a) => { //\n', rd(os.path.join(HERE, 'night-stages.js')) + '    SC.moked = (a) => { //\n', 'SC')
s = once(s, '      a.walk("mem", [[8, -78.65], [1.5, -78.65], [-12, -78.65], [-13.2, -79.4], [-18, -79.4, 13.5]], 2, 12, { yaw: 0 });',
         '      // NIGHT_WATCH_305: the officers of the watch gone; the lanterns\' light at the flight and its landing //\n'
         '      for (const k of ["ihb", "bbv"]) a.hide(k, 0); //\n'
         '      for (const pr of ["cloakN", "stick", "pakia", "ltorch"]) a.gone(pr, 0); //\n'
         '      a.set("lantA", 3, 0); //\n'
         '      a.walk("mem", [[8, -78.65], [1.5, -78.65], [-12, -78.65], [-13.2, -79.4], [-18, -79.4, 13.5]], 1, 9.2, { yaw: 0 });   // NIGHT_WATCH_305: 2..12 until 3.0.4 (CAMK.moked) //', 'moked')
s = once(s, '      if (a.prev === "moked") { //\n', '      if (a.prev === "moked" || a.prev === "gevini") {   // NIGHT_WATCH_305: after Gevini\'s call too //\n', 'lot1')
s = once(s, '      const night = a.prev === "moked";   // (the Rambam\'s order) //\n',
         '      const night = a.prev === "moked" || a.prev === "gevini";   // (the Rambam\'s order; NIGHT_WATCH_305) //\n', 'patrol')
s = once(s, '    SC.barkai = (a) => { //\n',
         '    SC.barkai = (a) => { //\n'
         '      for (const k of ["gk", "gn", "gc", "gp"]) a.hide(k, 0);   // NIGHT_WATCH_305: the watch ends with the light //\n'
         '      a.set("lanterns", 0, 0); a.set("lantA", 0, 0); //\n', 'barkai')

# ---------- 5. the eyes ----------
s = once(s, '    const CAMK = { //\n',
         '    const CAMK = { //\n'
         '      // NIGHT_WATCH_305: with Ish Har HaBayit along the north chel, then with Ben Bavi by the west //\n'
         '      // (NIGHT_SIT_305: the sleepers seen beside the one who comes to them - from the west of the gate of the spark, from the south-west //\n'
         '      // behind the house of the kaporet; until the second draft the eye looked over the officer\'s back) //\n'
         '      ihb: () => [[0, [-28, 17, -99], [-42, 1.6, -77.2]], [2.6, [-49, 7.5, -89], [-41.2, 1.5, -76.9]], [6.4, [-49, 7.5, -89], [-41.2, 1.5, -76.9]], //\n'
         '        [11.2, [-80, 6.2, -83], [-71.3, 1.3, -76.7]], [12.0, [-82, 4.6, -80.5], [-71.3, 1.2, -76.6]], [18.6, [-82, 4.6, -80.5], [-71.3, 1.2, -76.6]], //\n'
         '        [19.4, [-79, 3.8, -80.6], [-71.0, 0.8, -76.6]], [25.6, [-79, 3.8, -80.6], [-71.0, 0.8, -76.6]], //\n'
         '        [27.0, [-84, 22, -100], [-98.5, 2, -78.5]], [29.6, [-88, 12, -93], [-98.6, 1.8, -77.4]], [30.2, [-88, 12, -93], [-98.6, 1.8, -77.4]], //\n'
         '        [33.4, [-112, 9, -50], [-99, 1.6, -42]], [36.6, [-110, 7, -2], [-99, 1.4, -10]], [37.6, [-104, 4.5, 0], [-98.3, 1.2, -6.4]], //\n'
         '        [46, [-104, 4.5, 0], [-98.3, 1.2, -6.4]]], //\n'
         '      // Gevini on the landing: from the north-east, then from before him when he turns to the chel //\n'
         '      gevini: () => [[0, [-2, 21, -95], [-13.5, 14.6, -79.1]], [3.0, [-8.6, 16.9, -86.4], [-15.4, 15.9, -79.0]], [6.2, [-8.6, 16.9, -86.4], [-15.4, 15.9, -79.0]], //\n'
         '        [7.4, [-15.0, 16.4, -88.6], [-15.5, 15.8, -79.0]], [14, [-15.0, 16.4, -88.6], [-15.5, 15.8, -79.0]]], //\n'
         '      // NIGHT_WATCH_305 (the user, 19.11.2026 21:24: "4. הממונה"): the officer across the chel and up the flight, then into the house //\n'
         '      moked: () => [[0, [16, 8.5, -94], [7, 2.4, -79]], [1.0, [16, 8.5, -94], [7, 2.4, -79]], [5.6, [5, 13, -94.5], [-6.5, 8.5, -79.2]], //\n'
         '        [9.2, [-8, 20.5, -93], [-18, 14.6, -79.4]], [10.6, [-8, 20.5, -93], [-18, 14.6, -79.4]], [12.6, [-18, 50.5, -58.6], [-18, 14, -69]], [22, [-18, 50.5, -58.6], [-18, 14, -69]]], //\n', 'CAMK')
s = once(s, '      moked: () => [[-18, 50.5, -58.6], [-18, 14, -69]],   // MOKED_WIDE_211: higher (44 until 2.0.1) - the house is 32 wide now //\n',
         '      ihb: () => CAMK.ihb()[0].slice(1), gevini: () => CAMK.gevini()[0].slice(1),   // NIGHT_WATCH_305 //\n'
         '      moked: () => CAMK.moked()[0].slice(1),   // NIGHT_WATCH_305: the moving eye\'s first key (MOKED_WIDE_211\'s eye at its end) //\n', 'VIEW')

# ---------- 6. the reading "״שלום עליך״" ----------
s = once(s, '      order: "abba", lamps: "rambam", belt: "kilayim", mitz: "rashi", ephod: "rashi", active: false, stage: -1, sec: 0, qa: null, //\n',
         '      order: "abba", lamps: "rambam", belt: "kilayim", mitz: "rashi", ephod: "rashi", shalom: "mishna", active: false, stage: -1, sec: 0, qa: null, //\n', 'TM')
s = once(s, '      readings: () => ({ order: TM.order, lamps: TM.lamps, belt: TM.belt, mitz: TM.mitz, ephod: TM.ephod }), //\n',
         '      readings: () => ({ order: TM.order, lamps: TM.lamps, belt: TM.belt, mitz: TM.mitz, ephod: TM.ephod, shalom: TM.shalom }), //\n'
         '      // NIGHT_WATCH_305: the row "״שלום עליך״" - who says it: the officer (the Mishnah, Middot 1:2; the default, the user 23:49) or //\n'
         '      // the guard (the Gemara, Tamid 27b; the Rambam, Beit HaBechira 8:10) - the presentation built again at the same stage //\n'
         '      setShalom: (m) => { TM.shalom = m === "gemara" ? "gemara" : "mishna"; retour(); return TM.shalom; }, //\n', 'readings')
s = once(s, '      const caps = (R && st.capsR ? st.capsR : st.caps).map(([t, c]) => ({ t, text: c })); //\n',
         '      const caps = (st.capsG && TM.shalom === "gemara" ? st.capsG : R && st.capsR ? st.capsR : st.caps).map(([t, c]) => ({ t, text: c }));   // NIGHT_WATCH_305: capsG //\n', 'caps')

# ---------- 7. the sound of the blow ----------
s = once(s, '        else if (name === "barkai") osc(a, "sine", 660, t, 0.6, 0.05, null, 0.2, 0.8); //\n',
         '        else if (name === "barkai") osc(a, "sine", 660, t, 0.6, 0.05, null, 0.2, 0.8); //\n'
         '        else if (name === "strike") { noise(a, t, 0.06, 0.45, "lowpass", 900, 0.8, 0.08); osc(a, "sine", 120, t, 0.05, 0.22, null, 0.003, 0.1); }   // NIGHT_WATCH_305: a soft blow //\n', 'sound')

# ---------- 8. the data: the two stages, the officer's stage longer, the orders ----------
m = re.search(r'  var TAMID_DATA = (\{.*\}); //\n', s)
D = json.loads(m.group(1))
st = D['stages']
mk = st['moked']
mk['dur'] = 22
mk['caps'] = [[1, mk['caps'][0][1]], [12.8, mk['caps'][1][1]], [16.4, mk['caps'][2][1]]]
mk['text'] = ('הממונה בא בלילה: עובר בחיל, עולה במעלות שלאורך כותל הבית הצפוני ועומד על המדרגה שלפני שער בית המוקד שאל החיל — '
              'והמצלמה הולכת אחריו, ואחר כך נכנסת פנימה. ' + mk['text'])
st['ihb'] = {
    'id': 'ihb', 'title': 'בלילה — איש הר הבית ובן בבי', 'dur': 46,
    'v': [{'lbl': 'מידות א, ב', 'w': TX['MIDDOT12']},
          {'lbl': 'שקלים ה, א', 'w': TX['SHEK_A'] + '... ' + TX['SHEK_B']}],
    'vr': [{'lbl': 'רמב״ם בית הבחירה ח, י', 'w': TX['RAMBAM810']}],
    'caps': [[0.5, TX['c1']],
             [3.0, '״כדי שכשהשומר ער, יראה להשר ויקום לפניו״ (תפארת ישראל)'],
             [12.0, TX['c2']],
             [14.4, TX['c3']],
             [16.8, TX['c4']],
             [20.8, TX['c5']],
             [23.8, TX['c6']],
             [26.2, TX['SHEK_B'] + ' (שקלים ה, א) — ״והיה הוא או אנשיו חוזרים על המשמורת בלילה״ (תפארת ישראל)'],
             [37.8, '״להלקות הכהנים והלוים שנמצאו ישנים על משמרותיהם״ (ברטנורא, שקלים ה, א)'],
             [42.0, '״' + TX['YOH'] + '״ (רבי יוחנן, תמיד כח.)']],
    'text': ('משמרות הלילה. השומרים — לויים: ״חמשה על חמשה שערי העזרה, ארבעה על ארבע פנותיה מבחוץ... ואחד אחורי בית הכפורת״ (מידות א, א). '
             'הם יושבים מחוץ לעזרה: ״לפי שאין ישיבה בעזרה אלא למלכי בית דוד בלבד... השומרים בשערי העזרה שומרים מבחוץ כדי שיהיו מותרין בישיבה״ (ברטנורא שם).\n'
             '**איש הר הבית** — ״ממונה על כל השומרים״ (ברטנורא); ״שהיו כמה שרים ממונים על השומרים, ומתחלפים בכל לילה לסבב על השומרים, וראש שעל כולן נקרא בן ביבאי״ (תפארת ישראל, מידות א, ב). '
             'האבוקות — בפנסים קבועים ליד המשמרות, כתפארת ישראל: ״מדלא קאמר ונושאים אבוקות לפניו, משמע שהאבוקות עומדות במקומן בפנסין סביב, שלא יתכבו ברוח״. '
             'השומר בשער הקרבן ער — רואה את השר ״ויקום לפניו״. השומר בשער הניצוץ ישן. מי אומר ״שלום עליך״ — במתג ״״שלום עליך״ — איש הר הבית או השומר״ (שיטות ומחלוקות); ברירת המחדל — המשנה ותפארת ישראל: איש הר הבית אומר, ״שאם הוא ער יענהו״. '
             '״חובטו במקלו — בפקיע שבהמקל״, ״לשרוף את כסותו — ר״ל רק כסותו העליון שמסתמא התחתל בו״ (תפארת ישראל). '
             '״מה קול בעזרה — אומרים זה לזה בן לוי לוקה, ובשביל כך הוא צועק ונשמע קולו בכאן״ (המפרש לתמיד כח.).\n'
             '**בן בבי** — ״בן בבי על הפקיע״ (שקלים ה, א): ״להלקות הכהנים והלוים שנמצאו ישנים על משמרותיהם... כדאמרן במסכת מדות״ (ברטנורא שם); '
             '״והיה הוא או אנשיו חוזרים על המשמורת בלילה״ (תפארת ישראל שם). הפקיע — ״מאי פקיע? אמר רב: מדרא. מאי מדרא? אמר רב פפא: מטרקא דטייעי דפסיק רישיה״ (יומא כג.); '
             'רש״י: ״מפסקת בראשה לרצועות דקות״. בן בבי — כהן (״בן בביי, שם כהן״, רבינו אליקים), ולכן בבגדי כהונה בלי האבנט (רמב״ם כלי המקדש ח, יא). '
             'ובירושלמי (שקלים ה, א) אחרת: ״בן בבי על הפקיע — שהיה מזוויג את הפתילות״; וכך היה סבור אביי בתחילה: ״אמינא פתילתא״ (יומא כג.). '
             'השומרים בהדגמה לויים: ״שלא מצינו כהנים לוקים״ (שלטי הגבורים, בתוספות יום טוב מידות א, ב); ״אבל כהן שישן על משמרו קנסוהו באופן אחר״ (תפארת ישראל, מידות א, ב).\n'
             'בחירות מודל: מקום כל שומר וכל פנס, הישיבה על אבן, לבושו של איש הר הבית (שבטו לא נתפרש), שני השומרים של בן בבי — בפינה הצפונית־מערבית ואחורי בית הכפורת — '
             'והליכה מואצת.'),
    'refs': [['מידות א, א', 'Mishnah_Middot.1.1'], ['מידות א, ב', 'Mishnah_Middot.1.2'], ['ברטנורא מידות א, א', 'Bartenura_on_Mishnah_Middot.1.1'],
             ['יכין מידות א, ב', {'book': 819, 'index': 26}], ['תוספות יום טוב מידות א, ב', {'book': 948, 'index': 27}],
             ['תמיד כז:–כח.', 'Tamid.27b'], ['המפרש תמיד כז:', {'book': 2105, 'index': 173}],
             ['רמב״ם בית הבחירה ח, י', 'Mishneh_Torah,_The_Chosen_Temple.8.10'],
             ['שקלים ה, א', 'Mishnah_Shekalim.5.1'], ['ברטנורא שקלים ה, א', {'book': 593, 'index': 182}], ['יכין שקלים ה, א', {'book': 768, 'index': 372}],
             ['ירושלמי שקלים ה, א', {'book': 154, 'index': 148}], ['יומא כג.', {'book': 107, 'index': 522}], ['רש״י יומא כג.', {'book': 2157, 'index': 1167}],
             ['רמב״ם כלי המקדש ח, יא', {'book': 338, 'index': 133}]],
    'lamps': None}
st['ihb']['capsG'] = [list(c) for c in st['ihb']['caps']]
st['ihb']['capsG'][1] = [3.6, 'השומר הער קם, ואומר לאיש הר הבית ״שלום עליך״ (כגמרא, תמיד כז:)']
st['ihb']['capsG'][2] = [12.0, TX['G1']]
st['ihb']['capsG'].pop(3)
st['gevini'] = {
    'id': 'gevini', 'title': 'גביני הכרוז — ״עמדו כהנים לעבודתכם״', 'dur': 14,
    'v': [{'lbl': 'תמיד ג, ח', 'w': TX['TAMID38']}, {'lbl': 'יומא כ:', 'w': TX['YOMA20B']}],
    'vr': [],
    'caps': [[0.4, TX['TAMID38']], [3.4, '״עִמְדוּ כֹּהֲנִים לַעֲבוֹדַתְכֶם״'], [6.8, '״וּלְוִיִּם לְדוּכַנְכֶם, וְיִשְׂרָאֵל לְמַעֲמַדְכֶם״'],
             [10.2, 'וְהָיָה קוֹלוֹ נִשְׁמָע בְּשָׁלֹשׁ פַּרְסָאוֹת (יומא כ:)']],
    'text': ('גביני הכרוז — ״כהן ששמו גביני, שהיה מכריז בכל בוקר בבית המקדש עמדו כהנים לעבודתכם״ (ברטנורא, תמיד ג, ח). '
             'מקומו — ״מכריז בכל בוקר בהר הבית לפני שער בית המוקד הסגור״ (תפארת ישראל שם), כבתצוגת ״חמישה עשר הממונים״. '
             'לשון הקריאה — כבבלי (יומא כ:): ״עמדו כהנים לעבודתכם, ולוים לדוכנכם, וישראל למעמדכם. והיה קולו נשמע בשלש פרסאות״; '
             'ובירושלמי (שקלים ה, א): ״הכהנים לעבודה והלוים לדוכן וישראל למעמד. אגריפס המלך שמע קולו עד שמונה פרסאות״.\n'
             '**קריאת הגבר:** ״מאי קריאת הגבר? רב אמר: קרא גברא. רבי שילא אמר: קרא תרנגולא״, ״תניא כותיה דרב: גביני כרוז מהו אומר...״ (יומא כ:); '
             'רש״י: ״קרא גברא — מכריז הממונה על הכרוז ואומר עמדו כהנים לעבודתכם״. והממונה בא ״מקריאת הגבר, או סמוך לו מלפניו או מלאחריו״ (תמיד א, ב) — '
             '״ופירשוהו בגמ׳ יומא על גביני כרוז שהיו מכריזין בקול רם סמוך לעליית השחר״ (המאירי, תמיד כח.). בהדגמה הממונה כבר עומד לפני השער, וגביני קורא; אחר כך הממונה דופק.\n'
             'גביני בבגדי כהונה, בלי האבנט: ״לפיכך לובשם ביום עבודתו ואפילו שלא בשעת עבודה, חוץ מן האבנט מפני שהוא שעטנז״ (רמב״ם כלי המקדש ח, יא). '
             'הידיים סביב הפה, ופניו תחילה אל השער ואחר כך אל החיל — בחירת מודל; המלים בכתוביות.'),
    'refs': [['תמיד ג, ח', 'Mishnah_Tamid.3.8'], ['ברטנורא תמיד ג, ח', {'book': 634, 'index': 117}], ['יכין תמיד ג, ח', {'book': 818, 'index': 332}],
             ['יומא כ:', {'book': 107, 'index': 446}], ['רש״י יומא כ:', {'book': 2157, 'index': 982}], ['ירושלמי שקלים ה, א', {'book': 154, 'index': 146}],
             ['תמיד א, ב', 'Mishnah_Tamid.1.2'], ['רמב״ם כלי המקדש ח, יא', {'book': 338, 'index': 133}]],
    'lamps': None}
for o in ('abba', 'rambam'):
    L = D['orders'][o]
    assert L[0] == 'moked'
    L.insert(1, 'gevini')
    L.insert(0, 'ihb')
s = s[:m.start(1)] + json.dumps(D, ensure_ascii=False) + s[m.end(1):]

# ---------- 9. the row in the opinions table ----------
T0 = ('**המשנה** (מידות א, ב), כמו שהיא באוצריא: ״וכל משמר שאינו עומד, אומר לו איש הר הבית, שלום עליך. נכר שהוא ישן, חובטו במקלו״.\\n'
      '**תפארת ישראל** (יכין שם): ״שלום עליך — דאולי נחלש ולא יכול לקום, או אולי בעל מחשבות הוא. לפיכך דורש השר בשלומו, שאם הוא ער יענהו״.\\n'
      'בהדגמת עבודת הבוקר: השומר בשער הקרבן ער וקם לפני איש הר הבית; לשומר בשער הניצוץ, שאינו קם, איש הר הבית אומר ״שלום עליך״, ואין עונה.')
T1 = ('**הגמרא** (תמיד כז:–כח.): ״וכל משמר שאינו עומד ואומר לו: איש הר הבית שלום עליך — ניכר שהוא ישן, חובטו במקלו״. '
      'וכן **הרמב״ם** (בית הבחירה ח, י): ״וכל משמר שאינו עומד ואומר לו איש הר הבית שלום עליך נכר שהוא ישן״; '
      'ו**המפרש** (תמיד כז:): ״כל משמר שאינו עומד כנגדו ואומר לו שלום עליך ניכר שהוא ישן״.\\n'
      'תפארת ישראל מביא גרסה זו (״וי״ג״), ומקשה: ״וק״ל אמירה למה. הרי כשקם לחוד כבר ניכר שהוא ער״.\\n'
      'בהדגמת עבודת הבוקר: השומר בשער הקרבן קם, ואומר ״איש הר הבית, שלום עליך״; השומר בשער הניצוץ אינו קם ואינו אומר — ניכר שהוא ישן.')
ROW = ('        opRow({   // NIGHT_WATCH_305 (the user, 19.11.2026 23:49: "שלום עליך - א") //\n'
       '          id: "sh61", short: "״שלום עליך״ — איש הר הבית או השומר", cardFly: true, //\n'
       '          cap: "״שלום עליך״ — איש הר הבית או השומר (מידות א, ב)", //\n'
       '          refs: [["מידות א, ב", "Mishnah_Middot.1.2"], ["תמיד כז:–כח.", "Tamid.27b"], ["רמב״ם בית הבחירה ח, י", "Mishneh_Torah,_The_Chosen_Temple.8.10"], '
       '["יכין מידות א, ב", {"book": 819, "index": 32}], ["המפרש תמיד כז:", {"book": 2105, "index": 173}]], //\n'
       '          options: [["o0", "המשנה ותפארת ישראל — איש הר הבית אומר לשומר", "' + T0 + '"], //\n'
       '            ["o1", "הגמרא והרמב״ם — השומר אומר לאיש הר הבית", "' + T1 + '"]], //\n'
       '          current: "o0", //\n'
       '          onPick: (k) => { const T = ctx.shared.tamid; if (T && typeof T.setShalom === "function") T.setShalom(k === "o1" ? "gemara" : "mishna"); }, //\n'
       '          fly: () => { const c = [[-60, 14, -96], [-72, 2, -76]]; fly(c[0], c[1]); } //\n'
       '        }); //\n')
lines = s.split('\n')
hits = [i for i, l in enumerate(lines) if l.startswith('          id: "sh3", short: ')]
if len(hits) != 1:
    sys.exit('sh3 row: %d' % len(hits))
b = hits[0]
while lines[b].strip() != '}); //':
    b += 1
lines[b + 1:b + 1] = ROW.rstrip('\n').split('\n')
s = '\n'.join(lines)
s = once(s, '          ["הר הבית והחיל", ["sh0", "sh1", "sh2", "sh55", "sh3"]], //\n', '          ["הר הבית והחיל", ["sh0", "sh1", "sh2", "sh55", "sh3", "sh61"]], //\n', 'group')

wr(p, s)
print('NIGHT_WATCH_305 applied')
