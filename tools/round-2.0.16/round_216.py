#!/usr/bin/env python3
# 16.11.2026 (night): round 2.0.16 (B2 2.0.7, the unified plugin 2.0.16; B1 stays 1.4.7). Idempotent; made from round_215.py.
# "מה חדש" is written for one who never saw the dialogue.
import os, re, sys
sys.path.insert(0, '/home/claude/tools209')
from round_209 import put_list, rd, wr, J

B2_NEWS = [
    ("**הדגמת כניסת הכהן הגדול ביום הכיפורים — בלי שולחנות שלמה** — כשבמתג ״שולחנות שלמה ומנורותיו — בבית שני״ נבחרה האפשרות "
     "של רש״י והמפרש, עשרת השולחנות ועשר המנורות של שלמה מוסתרים בזמן ההדגמה, ודרכו של הכהן הגדול נשארת כמו שהייתה. בסוף ההדגמה "
     "הם חוזרים. בלי זה הדרך עברה דרכם, כשהשולחן או המנורה מונחים מצפון לדרום — ״הלכך מפסקי שולחנות את הדרך״ (רש״י, יומא נא:)."),
    ("**שולחנות שלמה — עוד שני מקורות בכרטיס** — מלאכת שלמה (שקלים ו, ד), בשם הירושלמי: ״דאיכא נמי בהיכל עשר שלחנות שעשה שלמה... "
     "ובאותם של שלמה לא היו מסדרין״; והרש״ש (יומא נא:), על דברי רש״י שם."),
]
NOTE = "בבית שני: בהדגמת הכהן הגדול ביום הכיפורים שולחנות שלמה מוסתרים; ובכרטיס השיטה — מלאכת שלמה והרש״ש."
N2 = ("- 2.0.7 (16.11.2026; בית ראשון נשאר 1.4.7): YK_SOLOMON_215 — 45-vessels.js solomonVessels.held / hold(on): קבוצת כלי שלמה "
      "מוסתרת כל עוד hold; 50-heichal.js ykEntry: solHold(true) ב־start, solHold(false) ב־stop (גם בסוף ההליכה) — החלטת המשתמש "
      "21:43, ״אפשרות ב״. tools/rows_214.py: מלאכת שלמה שקלים ו, ד (1152:217) והרש״ש יומא נא: (2494:563), שנקראו בספרייה שבמחשב "
      "המשתמש. נבדק: עם ten — גלוי לפני ההדגמה, מוסתר בזמנה, גלוי אחריה; עם one — מוסתר תמיד.\n")
NU = ("- 2.0.16 (16.11.2026): בית שני 2.0.7 — בהדגמת הכהן הגדול ביום הכיפורים שולחנות שלמה ומנורותיו מוסתרים; שני מקורות נוספים "
      "בכרטיס. בית ראשון 1.4.7 כמו שהיה.\n")
V = {'b2': ('2.0.6', '2.0.7'), 'u': ('2.0.15', '2.0.16')}

if __name__ == '__main__':
    assert len(NOTE) <= 150, len(NOTE)
    p = '/home/claude/b2src/tools/port_ui.py'; u = rd(p); u0 = u
    u = put_list(u, 'news_207', B2_NEWS, 'news_206 = [\n')
    old = '  var UI_NEWS_VERS = [\n    ["2.0.6", %s],\n'
    if old in u:
        u = u.replace(old, '  var UI_NEWS_VERS = [\n    ["2.0.7", %s],\n    ["2.0.6", %s],\n')
        old2 = "''' % (J(news_206), J(news_206), J(news_205),"; assert u.count(old2) == 1, 'news fmt'
        u = u.replace(old2, "''' % (J(news_207), J(news_207), J(news_206), J(news_205),")
    if u != u0: wr(p, u); print('B2: news 2.0.7')
    m_ = '/home/claude/b2src/plugin/manifest.json'; t = rd(m_)
    if '"version": "%s"' % V['b2'][0] in t: wr(m_, t.replace('"version": "%s"' % V['b2'][0], '"version": "%s"' % V['b2'][1], 1)); print('B2: manifest', V['b2'][1])
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
    put('/home/claude/b2src/DEV_NOTES.md', '- 2.0.7 (16.11.2026', '- 2.0.6 (16.11.2026', N2)
    put('/home/claude/unified-wt/unified/DEV_NOTES.md', '- 2.0.16 (16.11.2026', '- 2.0.15 (16.11.2026', NU)
    clean = lambda s: s.replace('**', '')
    out = ['בית המקדש (בית ראשון ובית שני בתוסף אחד) — גרסה 2.0.16', '', 'הערת העדכון לחנות (עד 150 תווים; כאן %d):' % len(NOTE), NOTE, '',
           'בבית שני (2.0.7):'] + ['• ' + clean(x) for x in B2_NEWS] + ['', 'בבית ראשון: אין שינוי (1.4.7).']
    wr('/home/claude/beit-rishon/docs/תיאור העדכון 2.0.16.txt', '\n'.join(out) + '\n')
    md = ['### בבית שני (2.0.7)', ''] + ['- ' + x for x in B2_NEWS]
    wr('/home/claude/tools216/news.md', '\n'.join(md) + '\n')
    print('release notes: %d lines; the store note %d chars; B2 %d items' % (len(out), len(NOTE), len(B2_NEWS)))
