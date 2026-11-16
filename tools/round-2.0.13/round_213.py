#!/usr/bin/env python3
# 16.11.2026 (afternoon): round 2.0.13 (B1 1.4.6, B2 2.0.4, the unified plugin 2.0.13) - the versions, the "מה חדש" lists, the
# maintainers' notes, docs/תיאור העדכון 2.0.13.txt and news.md (README.md). Idempotent; made from round_212.py. "מה חדש" is written
# for one who never saw the dialogue.
import os, re, sys
sys.path.insert(0, '/home/claude/tools209')
from round_209 import put_list, rd, wr, J

B2_NEWS = [
    ("**קידוש ידיים ורגליים** — בהדגמת סדר עבודת הבוקר (״קידוש ידיים ורגליים — והמוכני״) הכהן עומד עכשיו ורגליו זקופות, שוחה מן "
     "המותניים, וידיו על רגליו — ״מניח ידו הימנית על גבי רגלו הימנית, וידו השמאלית על גבי רגלו השמאלית, ומקדש״ (זבחים יט, ב). עד "
     "עכשיו נטה כל גופו באלכסון, כמו נופל."),
    ("**המוכני של הכיור** — בשיטת הרמב״ם (בתפריט, תחת ״שיטות ומחלוקות״) נוספה לשונו בפירוש המשניות (תמיד ג, ח): ״מכסה גבוה יורד "
     "בגלגל״, ודברי התוספות יום טוב עליה (תמיד א, ד): ״שהיה כלי סביב ושהיו משקעים אותו הכלי״ — כלומר, זה אותו הכלי שסביב הכיור."),
]
B1_NEWS = [
    ("**קידוש ידיים ורגליים** — בהדגמת המכונה, בעצירה של הקידוש, הכהן עומד עכשיו ורגליו זקופות, שוחה מן המותניים, וידיו על רגליו "
     "(זבחים יט, ב). עד עכשיו נטה כל גופו באלכסון, כמו נופל."),
]
NOTE = "בשני הבתים: בקידוש ידיים ורגליים הכהן שוחה מן המותניים, וידיו על רגליו. ובבית שני: לשון הרמב״ם על המוכני של הכיור, בפירוש המשניות לתמיד."
N1 = ("**1.4.6 (16.11.2026; עם בית שני 2.0.4):** KIDDUSH_BEND_212 (58-ark.js) — לכהן מותניים: הכתונת בשתיים (gRobeLow, gRobeUp; "
      "WAIST 1.36), ark_priestFig(n, true) מחזיר bend; ark_kiddush(w, kb) — הרגליים זקופות, שוחה מן המותניים, וכל יד על רגלה (IK של "
      "שתי עצמות, הנקודה הנמוכה שהיד מגיעה אליה על חזית הרגל). בעצירת הקידוש של הדגמת המכונה (45-vessels.js) — עד עכשיו lean 0.5 מן "
      "הקרסוליים.\n\n")
N2 = ("- 2.0.4 (16.11.2026; עם בית ראשון 1.4.6): KIDDUSH_BEND_212 — הכתונת בשתיים במותניים (55-payis.js: WAIST 1.33, gRobeLow, gRobeUp, "
      "bZ ו־spl ב־SH.priestKit); 55-tamid.js makeFigKit — קבוצת bend (מעל המותניים: הכתונת העליונה, האבנט, הצוואר, הראש, המגבעת "
      "והזרועות); POSES.kiddush — הרגליים זקופות, KB 0.95 במותניים, הידיים על הרגליים (reach, kidReach); לכהן הגדול (בלי מותניים) — "
      "lean 0.4. FORM_212 \"ב\" (rows_211r.py): בכרטיס שיטת הרמב״ם במוכני — פירוש המשניות תמיד ג, ח (575:38) והתוספות יום טוב תמיד "
      "א, ד (944:45); 40-altar.js כמו ב־2.0.11 (המכסה הנפרד שנבנה — בצד, round-2.0.12/beit-sheni-tools/40-altar.with-cover.js).\n")
NU = "- 2.0.13 (16.11.2026): בית ראשון 1.4.6 ובית שני 2.0.4 — קידוש ידיים ורגליים (שוחה מן המותניים, הידיים על הרגליים); לשון הרמב״ם על המוכני בתמיד.\n"
V = {'b2': ('2.0.3', '2.0.4'), 'b1': ('1.4.5', '1.4.6'), 'u': ('2.0.12', '2.0.13')}

if __name__ == '__main__':
    assert len(NOTE) <= 150, len(NOTE)
    # ---- B2: news_203
    p = '/home/claude/b2src/tools/port_ui.py'; u = rd(p); u0 = u
    u = put_list(u, 'news_204', B2_NEWS, 'news_203 = [\n')
    old = '  var UI_NEWS_VERS = [\n    ["2.0.3", %s],\n'
    if old in u:
        u = u.replace(old, '  var UI_NEWS_VERS = [\n    ["2.0.4", %s],\n    ["2.0.3", %s],\n')
        old2 = "''' % (J(news_203), J(news_203), J(news_202),"; assert u.count(old2) == 1
        u = u.replace(old2, "''' % (J(news_204), J(news_204), J(news_203), J(news_202),")
    if u != u0: wr(p, u); print('B2: news 2.0.4')
    m_ = '/home/claude/b2src/plugin/manifest.json'; t = rd(m_)
    if '"version": "%s"' % V['b2'][0] in t: wr(m_, t.replace('"version": "%s"' % V['b2'][0], '"version": "%s"' % V['b2'][1], 1)); print('B2: manifest', V['b2'][1])
    # ---- B1: 1.4.5
    p = '/home/claude/beit-rishon/src/70-ui.js'; u = rd(p); u0 = u
    line = '    ["1.4.6", [' + ", ".join(J(x) for x in B1_NEWS) + ']],\n'
    m = re.search(r'    \["1\.4\.6", \[.*?\]\],\n', u)
    if m:
        if m.group(0) != line: u = u[:m.start()] + line + u[m.end():]
    else:
        old = '  var UI_NEWS_VERS = [\n    ["1.4.5", ['; assert u.count(old) == 1, old
        u = u.replace(old, '  var UI_NEWS_VERS = [\n' + line + '    ["1.4.5", [')
    if u != u0: wr(p, u); print('B1: news 1.4.6')
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
    put('/home/claude/beit-rishon/plugin/DEV_NOTES.md', '**1.4.6 (16.11.2026', '**1.4.5 (16.11.2026', N1)
    put('/home/claude/b2src/DEV_NOTES.md', '- 2.0.4 (16.11.2026', '- 2.0.3 (16.11.2026', N2)
    put('/home/claude/unified-wt/unified/DEV_NOTES.md', '- 2.0.13 (16.11.2026', '- 2.0.12 (16.11.2026', NU)
    clean = lambda s: s.replace('**', '')
    out = ['בית המקדש (בית ראשון ובית שני בתוסף אחד) — גרסה 2.0.13', '', 'הערת העדכון לחנות (עד 150 תווים; כאן %d):' % len(NOTE), NOTE, '',
           'בבית ראשון (1.4.6):'] + ['• ' + clean(x) for x in B1_NEWS] + ['', 'בבית שני (2.0.4):'] + ['• ' + clean(x) for x in B2_NEWS]
    wr('/home/claude/beit-rishon/docs/תיאור העדכון 2.0.13.txt', '\n'.join(out) + '\n')
    md = ['### בבית שני (2.0.4)', ''] + ['- ' + x for x in B2_NEWS] + ['', '### בבית ראשון (1.4.6)', ''] + ['- ' + x for x in B1_NEWS]
    wr('/home/claude/tools211/news.md', '\n'.join(md) + '\n')
    print('release notes: %d lines; the store note %d chars; B2 %d items, B1 %d items' % (len(out), len(NOTE), len(B2_NEWS), len(B1_NEWS)))
