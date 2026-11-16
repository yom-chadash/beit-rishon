#!/usr/bin/env python3
# 16.11.2026: round 2.0.12 (B1 1.4.5, B2 2.0.3, the unified plugin 2.0.12) - the versions, the "מה חדש" lists, the maintainers' notes,
# docs/תיאור העדכון 2.0.12.txt and news.md (README.md). Idempotent. "מה חדש" is written for one who never saw the dialogue (the user,
# 13.11.2026: "מה חדש צריך להיות מנוסח יותר טוב, אף אחד לא מכיר את כל הדיאלוג בינינו!"). FORM (env): the user's choice for the
# Rambam's "מכסה גבוה יורד בגלגל" (Tamid 3:8) - "a" (a cover of its own), "b" (no new form: the source in the Rambam's card), "c"
# (the Beit Ephraim: the vessel round the laver goes up and down by its wheel) or "" (not decided - nothing said).
import os, re, sys
sys.path.insert(0, '/home/claude/tools209')
from round_209 import put_list, rd, wr, J

FORM = os.environ.get('FORM', '')
# ------------------------------------------------------------------ Beit Sheni 2.0.3
B2_NEWS = [
    ("**שערי חולדה** — המבט של המקום (בתפריט: ״שערי הר הבית וחצרות״, ״שערי חולדה״) מראה עכשיו את שני השערים ואת המדרגות שלהם; "
     "עד עכשיו נראה בעיקר הקיר שביניהם."),
    ("**הדגמת הפייסות** — הממונה, והאבוקה אחריו, באים מהר הבית, עוברים בפתח שבסורג ועולים בעשרים ושבע המדרגות שלאורך הכותל הצפוני "
     "של בית המוקד, עד השער; ואחרי שפותחים לו — עולים בחמש המדרגות שבתוך השער, אל רצפת הבית. עד עכשיו הלכו בדרך הישנה, מלפני "
     "שהחיל הועמד בגובה הר הבית (בגרסה 2.0.2), ועלו כאילו באוויר. וכך גם בפירושו השני של הרא״ש, שהשער בכותל המזרחי — ושם השער "
     "גם נפתח עכשיו לממונה."),
    ("**הדגמת הפייסות, לשיטת הרמב״ם** — שתי דמויות שהלכו בתוך בית המוקד שתי אמות וחצי מתחת לרצפתו — הולכות עכשיו על הרצפה."),
]
FORM_NEWS = {
    'a': ("**המוכני של הכיור — אפשרות שלישית** — ״מכסה גבוה יורד בגלגל״, כלשון הרמב״ם בפירוש המשניות (תמיד ג, ח): מכסה גבוה תלוי "
          "בגלגל מעל הכיור, וב״הדגמת המוכני״ הוא יורד על הכיור בערב ועולה בבוקר, והכיור נשאר במקומו. צורת המכסה — בחירת מודל. "
          "בתפריט, תחת ״שיטות ומחלוקות״."),
    'b': ("**המוכני של הכיור** — בשיטת הרמב״ם (בתפריט, תחת ״שיטות ומחלוקות״) נוספה לשונו בפירוש המשניות (תמיד ג, ח): ״מכסה גבוה "
          "יורד בגלגל״, ודברי התוספות יום טוב עליה: ״שהיה כלי סביב ושהיו משקעים אותו הכלי״."),
    'c': ("**המוכני של הכיור — אפשרות שלישית** — כשו״ת בית אפרים (במעשי למלך, בית הבחירה ג, יח), על לשון הרמב״ם ״מכסה גבוה יורד "
          "בגלגל״ (פירוש המשניות, תמיד ג, ח): הכלי הגבוה שסביב הכיור עולה ויורד בגלגל שלו, והכיור אינו יורד לבור. בתפריט, תחת "
          "״שיטות ומחלוקות״."),
}
if FORM in FORM_NEWS:
    B2_NEWS.insert(0, FORM_NEWS[FORM])
# ------------------------------------------------------------------ Beit Rishon 1.4.5
B1_NEWS = [
    "**מראה מקום** — בכרטיס ״הכבש״ נוסף מספר הפסוק: ״ולא תעלה במעלת על מזבחי״ (שמות כ, כג).",
]
NOTE = ("בבית שני: בהדגמת הפייסות הממונה עולה במדרגות אל בית המוקד, ושני שערי חולדה נראים במבט שלהם"
        + ("; ולמוכני של הכיור — לשון הרמב״ם בתמיד" if FORM == 'b' else ("; ולמוכני של הכיור — אפשרות שלישית" if FORM in ('a', 'c') else ""))
        + ". ותיקונים קטנים.")
N1 = r'''**1.4.5 (16.11.2026; עם בית שני 2.0.3):** בכרטיס ״הכבש״ — ״שמות כ, כג״ (עד עכשיו ״שמות כ״, בלי פסוק; נבדק בספריית אוצריא שבמחשב המשתמש: שמות כ, כג — ״ולא תעלה במעלת על מזבחי״).

'''
N2 = (r'''- 2.0.3 (16.11.2026; עם בית ראשון 1.4.5): PAYIS_STAIRS_212 (55-payis.js) — הדרך של הממונה ושל האבוקה בתחילת הדגמת הפייסות: מהר הבית, '''
      r'''דרך הפתח שבסורג (x 3.5), במדרגות שלאורך הכותל הצפוני של בית המוקד (CHEL_211: מ־x 1.5 בגובה 0 עד x ‎-12 בגובה 13.5; y על אמצע '''
      r'''השלחים = 1.75 − x) ועל הרחבה עד השער; ובתוך השער — חמש המדרגות אל 16 (FLOOR_211). כך גם בשיטת הרא״ש (השער המזרחי; המדרגות '''
      r'''x 16.5..3 לאורך z ‎-73.3), ושם תוקן גם doorsOf(-2.5, -73.3) — מאז MOKED_WIDE_211 השער לא נמצא ולא נפתח. S.knock 7.1 (6.4, ובשיטת '''
      r'''הרא״ש 0.4). ובשיטת הרמב״ם: s1/s2 ו״פותחין לו״ בגובה 16 (עד עכשיו 13.5 — מתחת לרצפה). שערי חולדה: cam/tg חדשים (rows_211r.py). '''
      + ({'a': r'''MOCHANI_COVER_211 (40-altar.js): מכסה גבוה תלוי בגלגל, אפשרות שלישית במתג ״המוכני של הכיור״ (pickJs: o2 → "cover"); בהדגמה '''
                r'''המכסה יורד והכיור במקומו. ''',
          'b': r'''המוכני של הכיור: בכרטיס שיטת הרמב״ם — פירוש המשניות תמיד ג, ח (575:38) והתוספות יום טוב תמיד א, ד (944:45). ''',
          'c': r'''MOCHANI_COVER_211 (40-altar.js): כבית אפרים — הכלי שסביב הכיור עולה ויורד בגלגל, אפשרות שלישית במתג ״המוכני של הכיור״. '''}.get(FORM, ''))
      + '\n')
NU = ('- 2.0.12 (16.11.2026): בית ראשון 1.4.5 ובית שני 2.0.3 — הדגמת הפייסות (הממונה עולה במדרגות החדשות של בית המוקד), המבט של '
      'שערי חולדה, מראה מקום בכרטיס ״הכבש״' + ('; המוכני של הכיור' if FORM else '') + '.\n')
V = {'b2': ('2.0.2', '2.0.3'), 'b1': ('1.4.4', '1.4.5'), 'u': ('2.0.11', '2.0.12')}

if __name__ == '__main__':
    assert len(NOTE) <= 150, len(NOTE)
    # ---- B2: news_203
    p = '/home/claude/b2src/tools/port_ui.py'; u = rd(p); u0 = u
    u = put_list(u, 'news_203', B2_NEWS, 'news_202 = [\n')
    old = '  var UI_NEWS_VERS = [\n    ["2.0.2", %s],\n'
    if old in u:
        u = u.replace(old, '  var UI_NEWS_VERS = [\n    ["2.0.3", %s],\n    ["2.0.2", %s],\n')
        old2 = "''' % (J(news_202), J(news_202), J(news_201),"; assert u.count(old2) == 1
        u = u.replace(old2, "''' % (J(news_203), J(news_203), J(news_202), J(news_201),")
    if u != u0: wr(p, u); print('B2: news 2.0.3')
    m_ = '/home/claude/b2src/plugin/manifest.json'; t = rd(m_)
    if '"version": "%s"' % V['b2'][0] in t: wr(m_, t.replace('"version": "%s"' % V['b2'][0], '"version": "%s"' % V['b2'][1], 1)); print('B2: manifest', V['b2'][1])
    # ---- B1: 1.4.5
    p = '/home/claude/beit-rishon/src/70-ui.js'; u = rd(p); u0 = u
    line = '    ["1.4.5", [' + ", ".join(J(x) for x in B1_NEWS) + ']],\n'
    m = re.search(r'    \["1\.4\.5", \[.*?\]\],\n', u)
    if m:
        if m.group(0) != line: u = u[:m.start()] + line + u[m.end():]
    else:
        old = '  var UI_NEWS_VERS = [\n    ["1.4.4", ['; assert u.count(old) == 1, old
        u = u.replace(old, '  var UI_NEWS_VERS = [\n' + line + '    ["1.4.4", [')
    if u != u0: wr(p, u); print('B1: news 1.4.5')
    p = '/home/claude/beit-rishon/plugin/manifest.json'; t = rd(p)
    if '"version": "%s"' % V['b1'][0] in t: wr(p, t.replace('"version": "%s"' % V['b1'][0], '"version": "%s"' % V['b1'][1], 1)); print('B1: manifest', V['b1'][1])
    for p in ('/home/claude/unified-wt/unified/manifest.json', '/home/claude/beit-rishon/unified/manifest.json'):
        t = rd(p)
        if '"version": "%s"' % V['u'][0] in t: wr(p, t.replace('"version": "%s"' % V['u'][0], '"version": "%s"' % V['u'][1], 1)); print('unified: manifest', V['u'][1], p)

    def put(path, mark, before, text):
        s = rd(path)
        if mark in s:
            i = s.index(mark); j = s.index(before, i)
            if s[i:j] != text: wr(path, s[:i] + text + s[j:]); print('notes renewed:', path)
            return
        assert s.count(before) >= 1, (path, before)
        i = s.index(before); wr(path, s[:i] + text + s[i:]); print('notes:', path)
    put('/home/claude/beit-rishon/plugin/DEV_NOTES.md', '**1.4.5 (16.11.2026', '**1.4.4 (15.11.2026', N1)
    put('/home/claude/b2src/DEV_NOTES.md', '- 2.0.3 (16.11.2026', '- 2.0.2 (15.11.2026', N2)
    put('/home/claude/unified-wt/unified/DEV_NOTES.md', '- 2.0.12 (16.11.2026', '- 2.0.11 (15.11.2026', NU)
    clean = lambda s: s.replace('**', '')
    out = ['בית המקדש (בית ראשון ובית שני בתוסף אחד) — גרסה 2.0.12', '', 'הערת העדכון לחנות (עד 150 תווים; כאן %d):' % len(NOTE), NOTE, '',
           'בבית ראשון (1.4.5):'] + ['• ' + clean(x) for x in B1_NEWS] + ['', 'בבית שני (2.0.3):'] + ['• ' + clean(x) for x in B2_NEWS]
    wr('/home/claude/beit-rishon/docs/תיאור העדכון 2.0.12.txt', '\n'.join(out) + '\n')
    md = ['### בבית שני (2.0.3)', ''] + ['- ' + x for x in B2_NEWS] + ['', '### בבית ראשון (1.4.5)', ''] + ['- ' + x for x in B1_NEWS]
    wr('/home/claude/tools211/news.md', '\n'.join(md) + '\n')
    print('release notes: %d lines; the store note %d chars; B2 %d items, B1 %d items; FORM=%r' % (len(out), len(NOTE), len(B2_NEWS), len(B1_NEWS), FORM))
