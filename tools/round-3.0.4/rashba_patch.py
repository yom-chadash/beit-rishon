#!/usr/bin/env python3
# round 3.0.4 - RASHBA_304 (בית שני 2.0.13): a fourth way in the row "הפרוכות ודרך הכהן הגדול" - the Rashba's reading of the Rambam:
# two parochot, the outer one folded back at the NORTH and the inner one at the SOUTH ("וכי נפיק נפיק מן הצפון").
# The user, 19.11.2026 19:07: "דעת הרשב"א בתשו' ח"א סי' שפ"ח (הובא בכ"מ עביוה"כ פ"ד ה"ב) שלדעת הרמב"ם הפרוכת החיצונה נפרפת מן הצפון
# והפנימית נפרפת מן הדרום... א"כ יש להוסיף בשיטות לענין פרוכת שיטת הרשב"א לדעת הרמב"ם".
# Read in the library: the Kesef Mishneh, Avodat Yom HaKippurim 4:2 (the responsum quoted: "אלא שהחיצונה פרופה מן הצפון ופנימית מן
# הדרום וכי נפיק נפיק מן הצפון"); the Tosafot Yom Tov, Yoma 5:5 (898:180); the Lechem Mishneh, AYH 4:2 ("דאית ליה לרבינו ז"ל פתחא
# בדרום קאי"); the Mar'eh HaPanim, Yerushalmi Yoma 5:5-6 ("ופיתחא בצפון קאי"); R. Y. Korkos in the Kesef Mishneh, Ma'aseh HaKorbanot
# 5:14 ("כי מצד צפון יוצא"); the Meiri, Yoma 54a (the same questions on the Rambam).
# Drawn: the two parochot of the Tanna Kamma's reading, mirrored north-south (their groups' scale.z = -1 about the house's axis z = 0);
# the High Priest's walk - the Tanna Kamma's walk mirrored (in by the north, south between the two, in by the inner one's opening in
# the south, out the way he came - to the north). His way in the heichal (on its north side) - a model choice.
# Run from the repository's root: python3 -I tools/round-3.0.4/rashba_patch.py
import json, re, sys

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

# 1. the parochot: the mode "rashba" mirrors both
OLD = """          const one = k === "one" || k === "meir";   // MEIR_218: R. Meir's one parochet - as R. Yose's ("לעולם כרבי יוסי סבירא ליה") //
          this.mode = k === "meir" ? "meir" : one ? "one" : "two"; //
          parOut.G.visible = !one; //
          parIn.G.position.x = one ? -44.5 : -45.5;   // PAROCHET_217: its faces, corner, hooks and head with it //"""
NEW = """          const one = k === "one" || k === "meir";   // MEIR_218: R. Meir's one parochet - as R. Yose's ("לעולם כרבי יוסי סבירא ליה") //
          this.mode = k === "meir" ? "meir" : k === "rashba" ? "rashba" : one ? "one" : "two"; //
          parOut.G.visible = !one; //
          parIn.G.position.x = one ? -44.5 : -45.5;   // PAROCHET_217: its faces, corner, hooks and head with it //
          // RASHBA_304: the Rashba in the Rambam - "שהחיצונה פרופה מן הצפון ופנימית מן הדרום": both mirrored about the axis z = 0 (the //
          // groups stand at z = 0); the way in by the wall (zo, for the Rid's corner) with them //
          const mz = this.mode === "rashba" ? -1 : 1; //
          for (const q of [parOut, parIn]) { if (q.zo0 == null) q.zo0 = q.zo; q.G.scale.z = mz; q.zo = mz * q.zo0; } //"""
s = once(s, OLD, NEW, 'parochotCount.set')

# 2. the High Priest's walk: the mode, the mirrored way, keys and captions
s = once(s, '{ const pc = ctx2.shared.parochotCount; Y.mode = pc && (pc.mode === "one" || pc.mode === "meir") ? pc.mode : "two"; }   // MEIR_218 //',
         '{ const pc = ctx2.shared.parochotCount; Y.mode = pc && (pc.mode === "one" || pc.mode === "meir" || pc.mode === "rashba") ? pc.mode : "two"; }   // MEIR_218, RASHBA_304 //',
         'Y.start mode')
OLD = """          BACK[k] = BACK[k].map((q) => [q[0] + h, q[1], q[2], q[3]]); //
        } //"""
NEW = """          BACK[k] = BACK[k].map((q) => [q[0] + h, q[1], q[2], q[3]]); //
        } //
        // RASHBA_304: the Tanna Kamma's walk (with its hold), mirrored north-south: z -> -z, a yaw a -> PI - a //
        PATH.rashba = PATH.two.map((q) => [q[0], q[1], -q[2]]); //
        BACK.rashba = BACK.two.map((q) => [q[0], q[1], -q[2], q[3] == null ? q[3] : Math.PI - q[3]]); //
        KEYS.rashba = KEYS.two.map((q) => [q[0], [q[1][0], q[1][1], -q[1][2]], [q[2][0], q[2][1], -q[2][2]]]); //
        HOLD.rashba = HOLD.two; //"""
s = once(s, OLD, NEW, 'mirrored walk')
OLD = """        const CAPS = { //
          two: [[0, C0], [4.0, "״בין המזבח למנורה היה מהלך, דברי רבי יהודה״ (יומא נא:)"], //"""
NEW = """        const CAPS = { //
          // RASHBA_304 //
          rashba: [[0, C0], [4.0, "הרשב״א בדעת הרמב״ם: ״וכי נפיק נפיק מן הצפון״ (בכסף משנה, עבודת יום הכפורים ד, ב) — ולכן הדרך בהיכל, בצד צפון"], //
                [7.6, "״עד שמגיע לבין שתי הפרכות המבדילות בין הקדש ובין קדש הקדשים, וביניהן אמה״"], //
                [10.6, "״אלא שהחיצונה פרופה מן הצפון ופנימית מן הדרום״ (הרשב״א)"], //
                [13.2, "מהלך ביניהן, עד שמגיע לדרום"], //
                [16.2, "הגיע לדרום, הופך פניו לצפון, ומהלך עם הפרכת עד מקום הארון — ובבית שני: ״מקום ארון״ (יומא נב:)"], //
                [20.4, C_EVEN], [20.4 + 4.2, C_IN], [24.2 + HOLD.two, C_OUT]], //
          two: [[0, C0], [4.0, "״בין המזבח למנורה היה מהלך, דברי רבי יהודה״ (יומא נא:)"], //"""
s = once(s, OLD, NEW, 'CAPS')

# 3. the opinions row: a fourth way
i = s.index('id: "sh47", short: "הפרוכות ודרך הכהן הגדול"')
j = s.index('opRow({', i)
blk = s[i:j]
nb = blk.replace('cap: "הפרוכות ודרך הכהן הגדול — רבי יהודה, רבי יוסי או רבי מאיר"',
                 'cap: "הפרוכות ודרך הכהן הגדול — רבי יהודה, רבי יוסי, רבי מאיר, או הרשב״א בדעת הרמב״ם"', 1)
if nb == blk:
    sys.exit('sh47 cap')
TXT = ("**הרשב״א** (בתשובה, סי׳ שפ״ח; הובאה בכסף משנה, הלכות עבודת יום הכפורים ד, ב), בדעת הרמב״ם: התנא של ״מהיכן הוא מתחיל, "
       "מקרן מזרחית צפונית״ (יומא ה, ה) סובר ששתי פרוכות היו, ״אלא שהחיצונה פרופה מן הצפון ופנימית מן הדרום, וכי נפיק נפיק מן "
       "הצפון. ובזה יתקיימו דברי הרב ז״ל שהוא פסק בפרוכות כת״ק״. ולכן הרמב״ם פסק ששתי פרוכות היו (בית הבחירה ד, ב), ופסק גם "
       "שמתחיל להזות ״מקרן מזרחית צפונית״ (עבודת יום הכפורים ד, ב).\n"
       "השאלה שעליה השיב: ״עכ״פ משנה זו שנויה לדעת ר׳ יוסי שסובר שלא היתה שם אלא פרוכת אחת ופרופה לצפון לימין הנכנס... ונפלאתי "
       "מדברי הרמב״ם ז״ל אחר שפסק גם הוא כרבנן היאך פסק בזו דמצפונית מזרחית הוא מתחיל״. אותה תמיהה כתב **המאירי** (יומא נד.).\n"
       "**תוספות יום טוב** (יומא ה, ה) מביא את הרשב״א: ״וסברה דחיצונה פרופה מן הצפון ופנימי מן הדרום, וכי נפיק נפיק מן הצפון״; "
       "ומיישב בעצמו אחרת: הרמב״ם כתב את סדר העבודה כפי שיהיה לעתיד, ״כשאין כאן אלא פרוכת אחת״, ופתחה בצפון.\n"
       "**מראה הפנים** (ירושלמי יומא ה, ה–ו) מבאר את הרמב״ם כרשב״א: ״ופיתחא בצפון קאי״. **מהר״י קורקוס** (הובא בכסף משנה, "
       "מעשה הקרבנות ה, יד): ״כמ״ש בפ״ד מהל׳ עבודת יוה״כ, כי מצד צפון יוצא״.\n"
       "ומנגד, **הלחם משנה** (עבודת יום הכפורים ד, ב): ״דאית ליה לרבינו ז״ל פתחא בדרום קאי״.\n"
       "במודל: שתי הפרוכות כשל תנא קמא, אבל בתמונת ראי — החיצונה פרופה בצד צפון, והפנימית בצד דרום. בהדגמה ״הכהן הגדול נכנס "
       "בקטורת״ הוא נכנס בפתח שבצפון, מהלך בין הפרוכות עד הדרום, נכנס בפתח הפנימית, ויוצא בדרך כניסתו — אל הצפון. דרכו בהיכל עד "
       "הפתח, בצד צפון — בחירת מודל.")
OPT = ', ["o3", "הרשב״א בדעת הרמב״ם — שתי פרוכות; החיצונה מן הצפון והפנימית מן הדרום", ' + json.dumps(TXT, ensure_ascii=False) + ']'
m = re.search(r'(options: \[\[.*?\]\])(,\s*//\s*\n)', nb, re.S)
if not m:
    sys.exit('sh47 options')
opts = json.loads(m.group(1)[len('options: '):])
if len(opts) != 3:
    sys.exit('sh47: %d options' % len(opts))
nb = nb[:m.start(1)] + m.group(1)[:-1] + OPT + ']' + nb[m.end(1):]
nb = once(nb, 'R.set(k === "o2" ? "meir" : k === "o1" ? "one" : "two");', 'R.set(k === "o3" ? "rashba" : k === "o2" ? "meir" : k === "o1" ? "one" : "two");', 'sh47 onPick')
nb = once(nb, '"o2": [[-30.5, 31.0, 2.5], [-41.0, 26.2, -6.0]]}[k];', '"o2": [[-30.5, 31.0, 2.5], [-41.0, 26.2, -6.0]], "o3": [[-45.0, 29.5, -9.0], [-45.1, 25.3, 9.3]]}[k];', 'sh47 fly')
nb = once(nb, '["מאירי יומא נא:", {"book": 2199, "index": 464}]]',
          '["מאירי יומא נא:", {"book": 2199, "index": 464}], ["תוי״ט יומא ה, ה (הרשב״א)", {"book": 898, "index": 180}], ["יומא ה, ה", {"book": 55, "index": 42}], ["רמב״ם עבודת יום הכפורים ד, ב", {"book": 342, "index": 33}], ["מאירי יומא נד.", {"book": 2199, "index": 489}]]',
          'sh47 refs')
s = s[:i] + nb + s[j:]
wr(p, s)
print('RASHBA_304: patched')
