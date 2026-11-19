#!/usr/bin/env python3
# round 3.0.4 (בית שני 2.0.13) - SIMCHA_304: the demonstration "שמחת בית השואבה" (the user, 19.11.2026 19:09 and 19:33; see the
# block's head in tools/round-3.0.4/simcha-block.js). Into sheni-src/bundle.js:
#  1. 63-simcha (the golden lamps' block, SIMCHA_MENOROT_211): SH.simchaDemo.drive(t) / clear() / tex - the lamps run by another
#     demonstration's clock, without their own flights and labels; their flame and halo pictures lent to the torches;
#  2. the SIMCHA_304 block after it (the corbels always; the planks, the people, the dancers, the Levites, the priests - in the run);
#  3. 92-sounds (SOUNDS_300): the flute, the lyre, the harp and the clapping, and the loop sfxLoop("simcha");
#  4. 70-ui: the place "שמחת בית השואבה — הדגמה" (its card, every quotation read in the library) and the demonstrations' list.
# Run from the repository's root: python3 -I tools/round-3.0.4/simcha_patch.py ; then node tools/safe-lines.mjs sheni-src/bundle.js
import json, os, sys

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
if 'SIMCHA_304' in s:
    sys.exit('already applied')

# ---------- 1. the lamps: driven by another clock ----------
s = once(s, '        paused() { return D.held >= 0; } //\n      }; //\n      (SH.demoStops || (SH.demoStops = [])).push({ id: "simcha-lamps",',
         '        paused() { return D.held >= 0; }, //\n'
         '        // SIMCHA_304: the rejoicing\'s demonstration runs the lamps by its own clock (t < 0: before the climb) - no flights, no labels //\n'
         '        drive(t) { if (!MG.visible) MG.visible = true; D.t0 = -1; D.held = -1; pose(t); caps(-1); }, //\n'
         '        clear() { D.held = -1; D.fl = 0; reset(); }, //\n'
         '        tex: { flame: ftx, halo: htx } //\n'
         '      }; //\n      (SH.demoStops || (SH.demoStops = [])).push({ id: "simcha-lamps",', 'simchaDemo')

# ---------- 2. the block, after the lamps' ----------
BLOCK = rd(os.path.join(HERE, 'simcha-block.js')).rstrip('\n') + '\n'
anchor = '      }); //\n    } //\n  } //\n  // plugin/js/ui.js //\n'
i = s.index('SH.features.simchaMenorot = {')
j = s.index(anchor, i)
k = j + len('      }); //\n    } //\n')
s = s[:k] + BLOCK + s[k:]

# ---------- 3. the sounds ----------
s = once(s, "    const LEVEL = { water: 0.07, creak: 0.06, bigGate: 0.16, trumpets: 0.045, cymbals: 0.045, click: 0.05, step: 0.02, hiss: 0.03, wicket: 0.045, wheel: 0.05, wheels: 0.05, steps: 0.02 }; //\n",
         "    const LEVEL = { water: 0.07, creak: 0.06, bigGate: 0.16, trumpets: 0.045, cymbals: 0.045, click: 0.05, step: 0.02, hiss: 0.03, wicket: 0.045, wheel: 0.05, wheels: 0.05, steps: 0.02, //\n"
         "      flute: 0.05, lyre: 0.026, harp: 0.04, clap: 0.03 };   // SIMCHA_304 //\n", 'LEVEL')
SND = r'''    // SIMCHA_304: the water-drawing's music - "החליל מכה ומנגנין בכנור ובנבלים ובמצלתים... ורוקדין ומספקין ומטפחין" (the Rambam, Lulav
    // 8:13): a flute with a slow vibrato and its breath, plucked strings (the lyres high, the harps low), and the clapping of hands. The
    // tune - four phrases in the mode of "אהבה רבה" on D - and its instruments' sound: model choices, not a reconstruction
    const pluck = (a, t, f, k, dur) => {
      for (const [m, type, pk] of [[1, "triangle", 1], [2, "sine", 0.35], [3, "sine", 0.12]]) {
        const o = a.createOscillator(), g = a.createGain();
        o.type = type;
        o.frequency.setValueAtTime(f * m, t);
        g.gain.setValueAtTime(0, t);
        g.gain.linearRampToValueAtTime(k * pk, t + 0.006);
        g.gain.setTargetAtTime(0, t + 0.012, dur / (2.5 + m));
        o.connect(g); g.connect(master);
        o.start(t); o.stop(t + dur + 0.25);
      }
    };
    const pipe = (a, t, f, k, dur) => {
      const o = a.createOscillator(), g = a.createGain(), lfo = a.createOscillator(), lg = a.createGain();
      o.type = "sine";
      o.frequency.setValueAtTime(f, t);
      lfo.frequency.value = 5.2;
      lg.gain.value = f * 0.006;
      lfo.connect(lg); lg.connect(o.frequency);
      env(g, t, 0.05, k, Math.max(0, dur - 0.13), 0.08);
      o.connect(g); g.connect(master);
      o.start(t); o.stop(t + dur + 0.1); lfo.start(t); lfo.stop(t + dur + 0.1);
      osc(a, "triangle", f * 2, t, dur, k * 0.16, 0.05, 0.08);
      noise(a, t, dur, k * 0.22, "bandpass", f * 2.2, 3, 0.04, 0.08);
    };
    const SIM = (() => {   // the cycle: 64 eighths of 0.2 s; [eighth, kind, semitones from D4, length in eighths]
      const E8 = 0.2, D4 = 293.66, hz = (n) => D4 * Math.pow(2, n / 12);
      const MEL = [
        [[7, 1], [7, 1], [8, 1], [7, 1], [5, 1], [4, 1], [5, 1], [7, 1], [4, 1], [5, 1], [4, 1], [1, 1], [0, 4]],
        [[12, 1], [12, 1], [10, 1], [8, 1], [7, 1], [8, 1], [10, 1], [12, 1], [10, 1], [8, 1], [7, 1], [5, 1], [7, 4]],
        [[7, 1], [8, 1], [10, 1], [12, 1], [13, 2], [12, 2], [10, 1], [8, 1], [7, 1], [5, 1], [4, 2], [7, 2]],
        [[8, 1], [7, 1], [5, 1], [4, 1], [5, 2], [4, 1], [1, 1], [0, 4], [null, 4]]];
      const CH = [[[0, 4, 7], [0, 4, 7]], [[-2, 1, 5], [0, 4, 7]], [[-2, 1, 5], [1, 5, 8]], [[5, 8, 12], [0, 4, 7]]];
      const BASS = [[-12, -12], [-14, -12], [-14, -11], [-19, -12]];
      const at = new Map(), put = (e, x) => { if (!at.has(e)) at.set(e, []); at.get(e).push(x); };
      MEL.forEach((ph, p) => { let e = p * 16; for (const [n, l] of ph) { if (n != null) put(e, ["f", n, l]); e += l; } });
      for (let e = 0; e < 64; e++) {
        const p = Math.floor(e / 16), h = Math.floor((e % 16) / 8), ch = CH[p][h];
        put(e, ["l", ch[[0, 1, 2, 1][e % 4]] + (e % 2 ? 12 : 0), 2]);
        if (e % 4 === 0) put(e, ["h", BASS[p][h], 6]);
        if (e % 4 === 2) put(e, ["c", 0, 0]);
      }
      return { E8, hz, at };
    })();
    const simchaStep = (a, t, step, lv) => {
      const e = step % 64;
      for (const [kind, n, l] of SIM.at.get(e) || []) {
        if (kind === "f") pipe(a, t, SIM.hz(n), LEVEL.flute * lv, l * SIM.E8 * 0.95);
        else if (kind === "l") pluck(a, t, SIM.hz(n), LEVEL.lyre * lv * (e % 2 ? 0.6 : 1), 0.9);
        else if (kind === "h") pluck(a, t, SIM.hz(n), LEVEL.harp * lv, 1.6);
        else noise(a, t, 0.05, LEVEL.clap * lv, "bandpass", 1300, 1.4, 0.002, 0.045);
      }
    };
'''
s = once(s, '    const make = { //\n      water(a, t, k, o) { //\n', SND + '    const make = { //\n      water(a, t, k, o) { //\n', 'make')
LOOP = r'''        if (name === "simcha") {   // SIMCHA_304: the tune, an eighth at a time, a little ahead of the clock; the level read at each one
          if (v > 0 && !L.timer && ac) {
            loops.add(L);
            L.step = 0;
            L.at = ac.currentTime + 0.1;
            L.timer = setInterval(() => {
              if (!ac || ctx.shared.soundOff) return;
              if (L.at < ac.currentTime) L.at = ac.currentTime + 0.05;
              while (L.at < ac.currentTime + 0.25) {
                if (L.level > 0.02) { try { simchaStep(ac, L.at, L.step, L.level); if (L.step % 64 === 0 && L.step > 0) make.cymbals(ac, L.at, LEVEL.cymbals * 0.35 * L.level); } catch (_) {} }
                L.step++;
                L.at += SIM.E8;
              }
            }, 60);
          }
          return;
        }
'''
s = once(s, '        if (name === "wheels" && ac) { //\n', LOOP + '        if (name === "wheels" && ac) { //\n', 'wheels loop')

# ---------- 4. the place and the demonstrations' list ----------
s = once(s, '          { t: "שמחת בית השואבה — מנורות של זהב", place: "מנורות של זהב — שמחת בית השואבה" } //\n',
         '          { t: "שמחת בית השואבה", place: "שמחת בית השואבה — הדגמה" }   // SIMCHA_304 (until 2.0.12: the lamps alone - their place stays) //\n', 'demos list')
INFO = ("לשון המשנה (סוכה ה, א–ד): ״אמרו, כל מי שלא ראה שמחת בית השואבה, לא ראה שמחה מימיו״; ״במוצאי יום טוב הראשון של חג, ירדו לעזרת נשים, "
        "ומתקנין שם תקון גדול״; ״חסידים ואנשי מעשה היו מרקדים לפניהם באבוקות של אור שבידיהן, ואומרים לפניהן דברי שירות ותשבחות. והלוים "
        "בכנורות ובנבלים ובמצלתים ובחצוצרות ובכלי שיר בלא מספר, על חמש עשרה מעלות היורדות מעזרת ישראל לעזרת נשים״.\n"
        "ההדגמה — מתג, כבויה כברירת מחדל; עם קולות (״קולות בהדגמות״ שבתפריט משתיק אותם). הלילה, הגזוזטראות, המנורות של זהב, "
        "העם, הריקודים והלוים — רק בזמן ההדגמה.\n"
        "**הגזוזטראות:** ״מאי תיקון גדול? אמר רבי אלעזר: כאותה ששנינו: חלקה היתה בראשונה. והקיפוה גזוזטרא, והתקינו שיהו נשים יושבות "
        "מלמעלה ואנשים מלמטה״ (סוכה נא:; מידות ב, ה); ״עשו שלש גזוזטראות בעזרה כנגד שלש רוחות״ (תוספתא סוכה ד, א). התפארת ישראל: "
        "״שהניחו קרשים עם מעקה סביב על הזיזין שיוצאין מהחומות סביב״ (סוכה ה, ב), ו״תקרה בולטת מאמצע גובה כתליה״ (מידות ב, ה). "
        "במודל — הזיזים קבועים בכתלים ונראים תמיד, והקרשים והמעקה — רק בהדגמה. שלוש גזוזטראות: בצפון, בדרום ובמזרח (משני צדי השער), "
        "לאורך הכותל שבין הלשכות, באמצע גובה הכתלים. עומקן, מספר הזיזים וצורתם — בחירת מודל.\n"
        "**המנורות:** ארבעה ילדים מפרחי כהונה מדליקים את המנורות של זהב, כבמקום ״מנורות של זהב — שמחת בית השואבה״.\n"
        "**העם:** אלפי אנשים וילדים בכל הגילים, בבגדיהם, ממלאים את העזרה סביב המרקדים — ״היו מרקדים לפניהם לפני כל העם שעמדו סביב "
        "אצל החומות״ (תפארת ישראל, סוכה ה, ד). מספרם וצפיפותם — בחירת מודל.\n"
        "**האור:** ״ולא היתה חצר בירושלים שאינה מאירה מאור בית השואבה״ (סוכה ה, ג) — משנדלקות המנורות, כל העזרה מוארת באור חם; "
        "והאבוקות והספלים בוערים באש חיה. עוצמת האור — בחירת מודל.\n"
        "**החסידים ואנשי מעשה:** מרקדים במעגל באמצע עזרת הנשים, אבוקה ביד כל אחד; ״בארבע אבוקות או בשמונה, זורק זו ומקבל את זו״ "
        "(ברטנורא, סוכה ה, ד) — בהדגמה שניים מהם זורקים ארבע אבוקות. ומה היו אומרים: ״יש מהן אומרים: אשרי ילדותנו שלא ביישה את "
        "זקנותנו — אלו חסידים ואנשי מעשה. ויש מהן אומרים: אשרי זקנותנו שכפרה את ילדותנו — אלו בעלי תשובה. אלו ואלו אומרים: אשרי מי שלא "
        "חטא, ומי שחטא — ישוב וימחול לו״ (סוכה נג.). ומי היו המרקדים: ״גדולי חכמי ישראל וראשי הישיבות והסנהדרין והחסידים והזקנים "
        "ואנשי מעשה הם שהיו מרקדין ומספקין ומנגנין ומשמחין במקדש בימי חג הסכות״ (רמב״ם, הלכות שופר וסוכה ולולב ח, יד).\n"
        "**הלוים והחליל:** ״החליל מכה ומנגנין בכנור ובנבלים ובמצלתים וכל אחד ואחד בכלי שיר שהוא יודע לנגן בו״ (רמב״ם שם, ח, יג); "
        "״זהו החליל של בית השואבה״ (סוכה ה, א); ובתוספתא (סוכה ד, ה): ״ולוים בכנורות ובנבלים וכל כלי שיר מהן אומרים שיר המעלות הנה "
        "ברכו... יש מהן שהיו אומרים שאו ידיכם קדש״. והתפארת ישראל (מידות ב, ה): ״עמדו שם בט״ו שורות על הט״ו מעלות, ובכל שורה שררו "
        "שיר המעלות אחר, שורה אחר שורה. ולהכי נקראין המזמורים ההם שיר המעלות, וסיימו העומדים וגו׳ בלילות של סוכות״. בהדגמה — שורה של "
        "לוים על כל אחת מחמש עשרה המעלות, בכנורות, בנבלים, במצלתים ובחצוצרות, ושני מחללים למרגלות המעלות; מספרם ומקומם — בחירת מודל. "
        "הנגינה בהדגמה — לחן כללי, ולא שחזור של נגינת המקדש.\n"
        "**רבן שמעון בן גמליאל:** ״כשהיה שמח שמחת בית השואבה, היה נוטל שמנה אבוקות של אור, וזורק אחת ונוטל אחת ואין נוגעות זו בזו. "
        "וכשהוא משתחוה, נועץ שני גודליו בארץ ושוחה ונושק את הרצפה וזוקף, ואין כל בריה יכולה לעשות כן, וזו היא קידה״ (סוכה נג.).\n"
        "**קרא הגבר:** ״ועמדו שני כהנים בשער העליון שיורד מעזרת ישראל לעזרת נשים, ושתי חצוצרות בידיהן. קרא הגבר, תקעו והריעו ותקעו. "
        "הגיעו למעלה עשירית, תקעו והריעו ותקעו. הגיעו לעזרה, תקעו והריעו ותקעו״ (סוכה ה, ד). איזו היא המעלה העשירית — ״בעי רבי ירמיה: "
        "למעלה עשירית — דנחית חמשה וקאי אעשרה, או דלמא דנחית עשרה וקאי אחמשה? תיקו״ (סוכה נג:). בהדגמה — ירדו חמש, ועומדים על "
        "העשירית; זו בחירת תצוגה, ולא הכרעה. ״הגיעו לעזרה״ — ״לרצפת עזרת נשים״ (תפארת ישראל). ״היו תוקעין והולכין, עד שמגיעין לשער "
        "היוצא מזרח. הגיעו לשער היוצא ממזרח, הפכו פניהן למערב, ואמרו, אבותינו שהיו במקום הזה אחוריהם אל היכל ה׳ ופניהם קדמה, והמה "
        "משתחוים קדמה לשמש, ואנו ליה עינינו״ (סוכה ה, ד).")
REFS = [["סוכה ה, א", "Mishnah_Sukkah.5.1"], ["סוכה ה, ב", "Mishnah_Sukkah.5.2"], ["סוכה ה, ג", "Mishnah_Sukkah.5.3"], ["סוכה ה, ד", "Mishnah_Sukkah.5.4"],
        ["מידות ב, ה", "Mishnah_Middot.2.5"], ["סוכה נא: (תיקון גדול)", {"book": 108, "index": 1323}], ["סוכה נג. (אשרי ילדותנו)", {"book": 108, "index": 1361}],
        ["סוכה נג. (רבן שמעון בן גמליאל)", {"book": 108, "index": 1366}], ["סוכה נג: (מעלה עשירית)", {"book": 108, "index": 1376}],
        ["רמב״ם בית הבחירה ה, ט", "Mishneh_Torah,_The_Chosen_Temple.5.9"], ["יכין סוכה ה, ב (אות ו)", {"book": 772, "index": 516}],
        ["יכין סוכה ה, ד (אות טז)", {"book": 772, "index": 536}], ["יכין סוכה ה, ד (אות כה)", {"book": 772, "index": 554}],
        ["יכין מידות ב, ה (אות מט)", {"book": 819, "index": 243}], ["יכין מידות ב, ה (אות נד)", {"book": 819, "index": 253}]]
PLACE = ('          { t: "שמחת בית השואבה — הדגמה", action: () => { const S = ctx.shared.simchaShoeva; if (S && typeof S.start === "function") S.start(); }, '
         'info: ' + json.dumps(INFO, ensure_ascii=False) + ', refs: ' + json.dumps(REFS, ensure_ascii=False) + ' },   // SIMCHA_304 //\n')
i = s.index('          { t: "מנורות של זהב — שמחת בית השואבה", feature:')
j = s.index('\n', i) + 1
s = s[:j] + PLACE + s[j:]
# ---------- 5. the gallery that stood always (30-courts.js), and the women's court's card ----------
i = s.index('    for (const zs of [-1, 1]) for (const [wx, w] of [[144.5, 19], [177.75, 19.5]]) { //\n')
j = s.index('    g.add(ci); //\n', i) + len('    g.add(ci); //\n')
old = s[i:j]
for need in ('M2.lattice, wx, 14, zs * 62.6', 'M2.lattice, 223.6, 14, czs', 'const corbGeo = ', 'm.setPosition(c[0], 13.05, c[1]);'):
    if need not in old:
        sys.exit('the old gallery: %s not found' % need)
s = s[:i] + ("    // SIMCHA_304 (the user, 19.11.2026 19:33: \"זיזים קבועים תמיד הדגמה רק במתג\"): the gallery that stood here always - cedar boards at //\n"
             "    // y 13.65 with a lattice screen over them, on twelve corbels in the north and south walls and six in the east (y 13.05), no source //\n"
             "    // for their height or the screen - is gone. In its place (63-simcha, SIMCHA_304): the corbels at the walls' mid-height, always - //\n"
             "    // \"חלק בלי בליטה באמצע גובהן\", \"תקרה בולטת מאמצע גובה כתליה\" (the Tiferet Yisrael, Middot 2:5, 819:241-243) - and the planks //\n"
             "    // with the railing on them only in the demonstration: \"שהניחו קרשים עם מעקה סביב על הזיזין שיוצאין מהחומות סביב\" (Sukkah 5:2, 772:516) //\n") + s[j:]
s = once(s, 'ארבע לשכותיה במקצועותיה בלא תקרה, הגזוזטרא סביב, וחמש עשרה המעלות',
         'ארבע לשכותיה במקצועותיה בלא תקרה, הזיזים של הגזוזטרא בכתליה, באמצע גובהם (הקרשים והמעקה שעליהם — בהדגמת ״שמחת בית השואבה״), וחמש עשרה המעלות',
         'the women court card')
wr(p, s)
print('SIMCHA_304 applied')
