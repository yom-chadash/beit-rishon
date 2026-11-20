#!/usr/bin/env python3
# round 3.0.6: the release's texts and versions - בית ראשון 1.4.15, בית שני 2.0.15, the unified plugin 3.0.6.
# The Second House's part (its "מה חדש") runs at the end of the chain (tools/round-3.0.6/chain.sh, "--sheni"); the other parts (the
# manifests, the first house's news, DEV_NOTES, news.md) once ("--rest"). Run from the repository's root.
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

# ---------- the lines of "מה חדש" (for one who never saw the work: what changed, where it is, from what source) ----------
DAVID_OFF = ("**הוסרה ההדגמה ״בשעה שכרה דוד שיתין״** — בימי דוד עוד לא נבנה הבית: במקום היה גורן ארונה היבוסי (שמואל ב כד), "
             "וההדגמה הציגה את הבית סביב הסיפור. לכן היא הוסרה מקבוצת ״הדגמות״ ומעץ המקומות. ״השיתין״ עצמם, שתחת המזבח, נשארו במקומם.")
WALK_R = ("**מצב הליכה — עולים במדרגות** — במצב הליכה, כשמגיעים למדרגות, העין עולה עכשיו עם המדרגות בכל קצב הליכה. עד עכשיו, "
          "בהליכה רגילה, המבט יכול היה להיכנס לתוך המדרגות במקום לעלות עליהן. אותו תיקון נעשה גם בבית שני.")
RISHON = [DAVID_OFF, WALK_R]

WALK_S = ("**מצב הליכה — עולים במעלות של שער ניקנור** — במצב הליכה בעזרת הנשים, כשמגיעים לחמש עשרה המעלות של שער ניקנור, העין "
          "עולה עכשיו עם המעלות. עד עכשיו המבט נכנס לתוך המעלות במקום לעלות עליהן. התיקון חל על כל המדרגות במודל, וגם בבית ראשון.")
BARKAI = ("**״ברקאי״ — רואים את אור השחר** — בהדגמת ״סדר עבודת הבוקר״, בשלב ״ברקאי — עלות השחר״, המזרח מאיר עכשיו בזמן שהרואה "
          "עולה ומסתכל, והאור כבר נראה כשהוא קורא — ״אם הגיע, הרואה אומר, ברקאי״ (תמיד ג, ב; ברטנורא: ״האיר והבריק השחר״). בדברי "
          "מתתיא בן שמואל, ״האיר פני כל המזרח״, האור מתחזק, והחמה עוד לא עלתה. עד עכשיו השמים נשארו חשוכים עד סוף השלב. כך גם "
          "בהדגמת ארבעת הפייסות.")
BEHIND = ("**מאחר הדלתות — בלי זהב** — ״והפנימיות נפתחות לתוך הבית לכסות אחר הדלתות, שכל הבית טוח בזהב, חוץ מאחר הדלתות״ (מידות "
          "ד, א). בכותל המזרחי של ההיכל מבפנים, משני צדי הפתח ועד הכתלים, בגובה הדלתות, הקיר הוא עכשיו אבן בלי זהב, ועליו נשענות "
          "הדלתות הפנימיות כשהן פתוחות — כדברי התפארת ישראל שם: ״חוץ מאותן ה׳ אמות מזה ומזה לדלתות כגובה הדלתות״. מה היה שם "
          "במקום הזהב לא נאמר, והאבן — בחירת מודל. בשיטת רבי יהודה, שהדלתות עומדות בתוך הפתח, הכותל כולו זהב. עד עכשיו היה "
          "זהב גם מאחר הדלתות.")
SHENI = [WALK_S, BARKAI, BEHIND]
TAGS = 'WALK_STAIRS_306, BARKAI_LIGHT_306, BEHIND_DOORS_306'

only_sheni = '--sheni' in sys.argv   # in the chain: the Second House's news alone
rest = '--rest' in sys.argv         # once: everything but the Second House's news

# ---------- 1. בית שני's "מה חדש": the window's list, its version, and by version (on the bundle patched anew) ----------
p = 'sheni-src/bundle.js'
s = rd(p)
if rest:
    pass
elif 'ver: "2.0.15"' in s:
    sys.exit('the bundle has 2.0.15 already')
if not rest:
    s = once(s, '    ver: "2.0.14",   // tools/assemble.mjs writes manifest.json\'s version here //',
             '    ver: "2.0.15",   // tools/assemble.mjs writes manifest.json\'s version here //', p + ' ver')
    i = s.index('    items: ["**חדש: מעיין השילוח והדגמת ניסוך המים**')
    j = s.index('\n', i)
    if not s[i:j].endswith(' //'):
        sys.exit('the items line does not end as expected')
    s = s[:i] + '    items: ' + json.dumps(SHENI, ensure_ascii=False) + ',   // ' + TAGS + ' //' + s[j:]
    s = once(s, '    ["2.0.14", [', '    ["2.0.15", ' + json.dumps(SHENI, ensure_ascii=False) + '],   // ' + TAGS + ' //\n    ["2.0.14", [', p + ' vers')
    wr(p, s)
if only_sheni:
    print('release_306: the Second House\'s news')
    sys.exit(0)

# ---------- 2. versions ----------
p = 'plugin/manifest.json'
if '"version": "1.4.15"' not in rd(p):
    wr(p, once(rd(p), '"version": "1.4.14"', '"version": "1.4.15"', p))
p = 'unified/manifest.json'
if '"version": "3.0.6"' not in rd(p):
    wr(p, once(rd(p), '"version": "3.0.5"', '"version": "3.0.6"', p))

# ---------- 3. בית ראשון's "מה חדש" (src/70-ui.js) ----------
p = 'src/70-ui.js'
s = rd(p)
if '["1.4.15", [' not in s:
    s = once(s, '    ["1.4.14", [', '    ["1.4.15", ' + json.dumps(RISHON, ensure_ascii=False) + '],   // DAVID_SHITIN_305 removed, WALK_STAIRS_306\n    ["1.4.14", [', p)
    wr(p, s)

# ---------- 4. the development notes ----------
p = 'plugin/DEV_NOTES.md'
s = rd(p)
if '**1.4.15 (20.11.2026;' not in s:
    k = s.index('**1.4.14 (20.11.2026;')
    e = s.index('\n', k)
    NOTE_R = ('\n\n**1.4.15 (20.11.2026; עם בית שני 2.0.15, התוסף המאוחד 3.0.6):** (1) **ההדגמה ״בשעה שכרה דוד שיתין״ הוסרה** (DAVID_SHITIN_305; '
              'דיווח שהועבר למשתמש: בימי דוד עוד לא היה שם הבית אלא גורן ארונה; המשתמש בחר ״ב״ — להוריד): `src/46-shitin.js` נמחק, וכך '
              'השורה ב־`tools/assemble.mjs`, המודול ב־90-entry.js (MODULES, STAGES), פריט ההדגמות והמקום שאחרי ״השיתין״ ב־70-ui.js; '
              'שורת 1.4.14 ב״מה חדש״ נשארת כהיסטוריה. (2) **90-entry.js — WALK_STAIRS_306** (דיווח: במצב הליכה המבט נכנס לתוך המדרגות): '
              'cam_walkFloor הולך עם הרצפה לאורך הדרך מן הקרן הקודמת, שליש אמה בכל פעם, כל קרן מגובה ברך (1.2) מעל הרצפה שנמצאה לפניה '
              '(עד עכשיו — מעל רגלי העין המרוככות, שבמדרגה מאחרות כאמה); עלייה מתרככת ב־60 ms, ירידה ב־110.')
    s = s[:e] + NOTE_R + s[e:]
    wr(p, s)

p = 'unified/DEV_NOTES.md'
s = rd(p)
NOTE_U = ('- 3.0.6 (20.11.2026): בית ראשון 1.4.15; בית שני 2.0.15 (דיווחים שהמשתמש העביר). **בבית ראשון:** ההדגמה ״בשעה שכרה דוד שיתין״ '
          'הוסרה (המשתמש: ״ב״ — בימי דוד לא היה שם הבית); WALK_STAIRS_306. **בבית שני** (`tools/round-3.0.6/chain.sh`, לפי '
          '`order.txt`): (1) WALK_STAIRS_306 — מצב הליכה עולה במדרגות (חמש עשרה המעלות: העין 2.6–3 מעל המעלות לאורך כל העלייה); '
          '(2) BARKAI_LIGHT_306 — skyAt: בשלב ״ברקאי״ אל ״heir״ של ערכת הלילה עד 7.4 ש׳ (הקריאה ב־7.8) ומעט יותר עד 11.8; השלבים '
          'שאחריו — 2.08 עד 2.18 בשלב ״shema״, ואחר כך הבוקר; בהדגמת הפייסות — sky(9, alot, heir), sky(0, heir); (3) BEHIND_DOORS_306 '
          '— בכותל השער מבפנים (x ‎-4.53), z ‎±5..9.38, גובה 20: שיש (M2.marble), רק בשיטת תנא קמא (greatGate.set); הכרטיס ״פיתוחי '
          'הקירות״ — דברי תפארת ישראל (יכין מידות ד, א, שורה 488; בטקסט שבספרייה ״תוץ״ — טעות דפוס של ״חוץ״). ״סיד״ לא נמצא בשום '
          'מקור בספרייה על המקום. **הבנייה:** `tools/build.mjs`; בית שני — `tools/round-3.0.6/chain.sh` (כולל release_306 --sheni), '
          '`tools/round-3.0.0/minify.mjs` ו־`tools/round-2.0.18/house_sheni.py ... 2.0.15`; `build-unified.mjs --version 3.0.6`; '
          'README — `tools/round-3.0.6/news.md`.\n')
if '- 3.0.6 (20.11.2026):' in s:
    i = s.index('- 3.0.6 (20.11.2026):')
    s = s[:i] + s[s.index('- 3.0.5 (20.11.2026):'):]
s = once(s, '- 3.0.5 (20.11.2026):', NOTE_U + '- 3.0.5 (20.11.2026):', p)
wr(p, s)

# ---------- 5. the release's "מה חדש" for README.md: this version, then 3.0.5 (its sections a level down) and before ----------
old = rd('tools/round-3.0.5/news.md').strip().split('\n')
prev = []
for ln in old:
    if ln.startswith('#### ') or ln.startswith('### '):
        ln = '#' + ln
    prev.append(ln)
news = ['### בבית ראשון (1.4.15)', ''] + ['- ' + x for x in RISHON] + ['', '### בבית שני (2.0.15)', ''] + ['- ' + x for x in SHENI] + \
       ['', '### ומה שהתחדש בגרסה 3.0.5', ''] + prev
wr('tools/round-3.0.6/news.md', '\n'.join(news).strip() + '\n')
print('release_306: versions, the news of both houses, DEV_NOTES, tools/round-3.0.6/news.md')
