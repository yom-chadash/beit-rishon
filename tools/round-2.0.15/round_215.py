#!/usr/bin/env python3
# 16.11.2026 (night): round 2.0.15 (B2 2.0.6, the unified plugin 2.0.15; B1 stays 1.4.7) - the versions, the "מה חדש" list, the
# maintainers' notes, docs/תיאור העדכון 2.0.15.txt and news.md. Idempotent; made from round_214.py. "מה חדש" is written for one who
# never saw the dialogue.
import os, re, sys
sys.path.insert(0, '/home/claude/tools209')
from round_209 import put_list, rd, wr, J

B2_NEWS = [
    ("**מתג חדש: שולחנות שלמה ומנורותיו — בבית שני** — ברירת המחדל, כתוספות רי״ד (יומא נא:): בהיכל של בית שני "
     "היו שולחן אחד ומנורה אחת. האפשרות השנייה, כרש״י (יומא נא:) וכמפרש למסכת תמיד (לא:): גם עשרת השולחנות ועשר המנורות שעשה שלמה "
     "עמדו בהיכל, אבל לא סידרו עליהם לחם ולא הדליקו בהם (מנחות צט.). הסידור — ״של משה באמצע, חמשה מימינו, וחמשה משמאלו״ (מנחות צח:): "
     "השולחנות בצפון ההיכל והמנורות בדרומו, לפי המתג ״כיוון המנורה והשולחן״. כשהשולחן מונח ממזרח למערב — שתי שורות של חמישה, ושולחן "
     "משה ממערב להן, מול הרווח שביניהן (מנחות צט. ורש״י שם); והמנורות — כמו השולחנות (המאירי, יומא נא:)."),
    ("**שער ניקנור פתוח** — דלתות הנחושת של השער עומדות פתוחות בתוך עובי השער, ואפשר לראות דרכו מעזרת ישראל אל עזרת הנשים. עד עכשיו "
     "עמדו בתוך המעבר עוד שתי דלתות כמעט סגורות, ועוד שתיים בשני הפשפשים שלצדו — שרידים מגרסה ישנה."),
    ("**הדגמת סדר עבודת הבוקר — בלי מעבר דרך קירות** — כהנים שעברו דרך פינת האולם ומעלותיו, דרך הכותל המזרחי של העזרה, דרך הכבש הקטן "
     "או דרך הקירות של הלשכות שבדרום העזרה — עוקפים אותם עכשיו. הלויים נכנסים בפתח שער ניקנור בשני טורים, ומתפזרים אל הדוכן רק אחרי "
     "שעברו את הכותל. הממונה דופק על שער בית המוקד מן הרחבה שלפניו, ודלתות השער נפתחות לו — ״והם פתחו לו״ (תמיד א, ב); עד עכשיו עמד "
     "על הקרקע שמתחת לרחבה, ונכנס דרך האבן."),
    ("**הדגמת סדר עבודת הבוקר — בלי קפיצות** — האחים שרצים אל הכיור (״והן רצין ובאין״, תמיד ב, א) רצים מן המקום שבו נפגשו הכהנים, "
     "ליד לשכת עושי חביתין; עד עכשיו שניים מהם רצו כמאה וחמישים אמה בארבע שניות. שלושת הכהנים של הסולת, החביתין והיין יוצאים מלשכת "
     "הגזית אחרי מעלי האברים, ולא מופיעים פתאום בשורה. הרואה של ״ברקאי״ עולה לגג לשכת הגזית ויורד ממנו, ולא נשאר עומד שם עד קריאת שמע. "
     "ובכמה שלבים ההליכה ארוכה ואיטית יותר: אל הכיור, בהעלאת האברים, במנחה ובנסכים."),
]
NOTE = "בבית שני: שולחנות שלמה ומנורותיו — שיטה חדשה; שער ניקנור פתוח; בהדגמת עבודת הבוקר הכהנים לא עוברים דרך קירות ולא קופצים."
N2 = ("- 2.0.6 (16.11.2026; בית ראשון נשאר 1.4.7): SOLOMON_214 — 45-vessels.js (בלוק SOLOMON_214, ctx.shared.solomonVessels "
      "one/ten; הסידור gemara + mirror לפי החלטת המשתמש 20:21), tools/rows_214.py (השורה ״שולחנות שלמה ומנורותיו — בבית שני״, "
      "בשרשרת לפני cards_196), cards_196.py ROWB/SHORT, port_ui.py OPS_P (המנורה, שולחן לחם הפנים, הקודש) ו־OPS_V kodesh, "
      "rows_198.py WANT_ROWS. NIKANOR_LEAVES_215 — 30-courts.js: הוסרו ארבע דלתות נחושת ישנות (bz) שעמדו כמעט סגורות במעבר "
      "שער ניקנור ובפשפשיו; הדלתות של H2.doors (פתוחות בעובי השער מ־1.9.5) נשארות. בהדגמת עבודת הבוקר (55-tamid.js): "
      "ROUTER_BLOCK_215 — BLK (הבית עד x −83, במת האולם, שתים עשרה המעלות, הבר־שורה x 90–91 בלי פתחיו), segBox/blocked: דילוג "
      "ישר שחוצה אותם לא נבחר, לא בתחילת הדרך ולא בסופה; צמתים UL_NE, ST_NE, ST_SE, CV_D וקשתות STB_S–RF_W; LEVITES_GATE_215; "
      "CHEL_GATE_215 (N.chelG, הדלתות נפתחות חצי רדיאן בדפיקה, וחוזרות בסוף); MOKED_KNOCK_215 (z −79.4 על הרחבה); BROTHERS_215; "
      "PACE_215 (tamid_200.py: mincha 17); PLATFORM_215; NINE_215; BARKAI_UP_215; ASH_PLACE_215; TABLES_215; CUT_215. "
      "tamidmotion.mjs: קירות 52 → 14 בסדר אביי (כולם נגיעה של 0.1 שנייה בשולי מדרגה או משקוף), חתכים בין שלבים 3 → 0; ובסדר "
      "הרמב״ם 16, 0.\n")
NU = ("- 2.0.15 (16.11.2026): בית שני 2.0.6 — שולחנות שלמה ומנורותיו (שורה חדשה בשיטות), שער ניקנור פתוח, והדגמת עבודת הבוקר "
      "בלי מעבר דרך קירות ובלי קפיצות. בית ראשון 1.4.7 כמו שהיה.\n")
V = {'b2': ('2.0.5', '2.0.6'), 'u': ('2.0.14', '2.0.15')}

if __name__ == '__main__':
    assert len(NOTE) <= 150, len(NOTE)
    p = '/home/claude/b2src/tools/port_ui.py'; u = rd(p); u0 = u
    u = put_list(u, 'news_206', B2_NEWS, 'news_205 = [\n')
    old = '  var UI_NEWS_VERS = [\n    ["2.0.5", %s],\n'
    if old in u:
        u = u.replace(old, '  var UI_NEWS_VERS = [\n    ["2.0.6", %s],\n    ["2.0.5", %s],\n')
        old2 = "''' % (J(news_205), J(news_205), J(news_204),"; assert u.count(old2) == 1, 'news fmt'
        u = u.replace(old2, "''' % (J(news_206), J(news_206), J(news_205), J(news_204),")
    if u != u0: wr(p, u); print('B2: news 2.0.6')
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
    put('/home/claude/b2src/DEV_NOTES.md', '- 2.0.6 (16.11.2026', '- 2.0.5 (16.11.2026', N2)
    put('/home/claude/unified-wt/unified/DEV_NOTES.md', '- 2.0.15 (16.11.2026', '- 2.0.14 (16.11.2026', NU)
    clean = lambda s: s.replace('**', '')
    out = ['בית המקדש (בית ראשון ובית שני בתוסף אחד) — גרסה 2.0.15', '', 'הערת העדכון לחנות (עד 150 תווים; כאן %d):' % len(NOTE), NOTE, '',
           'בבית שני (2.0.6):'] + ['• ' + clean(x) for x in B2_NEWS] + ['', 'בבית ראשון: אין שינוי (1.4.7).']
    wr('/home/claude/beit-rishon/docs/תיאור העדכון 2.0.15.txt', '\n'.join(out) + '\n')
    md = ['### בבית שני (2.0.6)', ''] + ['- ' + x for x in B2_NEWS]
    wr('/home/claude/tools215/news.md', '\n'.join(md) + '\n')
    print('release notes: %d lines; the store note %d chars; B2 %d items' % (len(out), len(NOTE), len(B2_NEWS)))
