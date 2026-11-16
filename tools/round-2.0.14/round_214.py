#!/usr/bin/env python3
# 16.11.2026 (evening): round 2.0.14 (B1 1.4.7, B2 2.0.5, the unified plugin 2.0.14) - the versions, the "מה חדש" lists, the
# maintainers' notes, docs/תיאור העדכון 2.0.14.txt and news.md (README.md). Idempotent; made from round_213.py. "מה חדש" is written
# for one who never saw the dialogue.
import os, re, sys
sys.path.insert(0, '/home/claude/tools209')
from round_209 import put_list, rd, wr, J

B2_NEWS = [
    ("**קידוש ידיים ורגליים** — בהדגמת סדר עבודת הבוקר (בשלב ״קידוש ידיים ורגליים — והמוכני״) הכהן מרים את רגל ימין, ומניח עליה "
     "את יד ימין, תחת הזרם שיוצא מן הכיור. אחר כך הוא מוריד אותה, צועד צעד אחד, ועושה כך ברגל שמאל וביד שמאל — ״מניח ידו הימנית על "
     "גבי רגלו הימנית, וידו השמאלית על גבי רגלו השמאלית, ומקדש״ (זבחים יט, ב). פניו אל הכיור, והוא עומד על רצפת העזרה. עד עכשיו הוא "
     "רק שחה מן המותניים, והניח את ידיו על רגליו."),
    ("**שמחת בית השואבה** — בהדגמת המנורות של זהב, הילדים מפרחי הכהונה עולים על הסולמות, ועומדים על השלב העליון. הם מטים את הכדים "
     "מעל הספלים, ורואים את השמן נשפך לתוך כל ספל — ״שהן מטילין לכל ספל וספל״ (סוכה ה, ב). עד עכשיו עלו באוויר ליד הסולמות, והכד "
     "הוטה מתחת לשפת הספל, כך שהשמן לא נכנס אליו."),
]
B1_NEWS = [
    ("**קידוש ידיים ורגליים** — בהדגמת המכונה, בעצירה של הקידוש: הכהן מרים את רגל ימין, ומניח עליה את יד ימין, תחת הזרם שיורד מן "
     "הברז. אחר כך הוא מוריד אותה, מסתובב, ועושה כך ברגל שמאל וביד שמאל (זבחים יט, ב). בזמן הקידוש המבט של ההדגמה יורד אל הכהן, "
     "ואחר כך חוזר למקומו — עד עכשיו גוף המכונה הסתיר אותו. ועד עכשיו הכהן רק שחה מן המותניים, והניח את ידיו על רגליו."),
]
NOTE = "בשני הבתים: בקידוש ידיים ורגליים הכהן מרים כל רגל ומניח עליה את ידו. בבית שני: בשמחת בית השואבה השמן נשפך לתוך הספלים."
N1 = ("**1.4.7 (16.11.2026; עם בית שני 2.0.5):** KIDDUSH_FOOT_213 — רגל מורמת (58-ark.js: ARK_LEG, ark_legAt, ark_kidLocal, "
      "ark_kidPose; לכל צד קבוצת legs — ירך, ברך, שוק ורגל; הכתונת חתוכה במותניים בשורה משותפת של קודקודים, WAIST 1.0). "
      "KIDDUSH_LEG_214 — ARK_LEG k1 [0.18, 1.12, 0.43], a1 [0.27, 1.02, 0.83], pitch 0.1: הברך בגובה הירך, היד על הרגל 1.34 מעל "
      "הרצפה ו־1.3 לפניו, הכיפוף 42° (עד עכשיו הברך עלתה מעל הירך, והשוק נכנסה מתחת לגוף המכופף). 45-vessels.js kiddAt — ימין: "
      "פניו לדרום־מערב (yaw −π/4); סיבוב; שמאל: yaw −2π/3; היד תחת זרם הברז המזרחי, והרגל המורמת נכנסת מתחת לגוף המכונה, בין "
      "אופניה. KIDDUSH_VIEW_214 — FOL_KID: בזמן המים מבט המעקב יורד אל הכהן מדרום (9.5 מן הזרם, 5.5 מעל הרצפה; עירוב של המקום ושל "
      "הכיוון, עם הרמה של 4 אמות באמצע הדרך, מעל שפת הכיור), והתוויות ״השיתין״ ו״רבובה — חלון בכבש״ מוסתרות בינתיים "
      "(ctx.shared.hideLabels, 70-ui.js). נבדק בשלושת מקומות המזבח ובשיטת רבנו תם: אין נקודה של הכהן בתוך המכונה או המזבח, והמבט "
      "רחוק 2.8 אמות לפחות מכל גוף.\n\n")
N2 = ("- 2.0.5 (16.11.2026; עם בית ראשון 1.4.7): KIDDUSH_LEG_214 (55-tamid.js) — LEG כבבית ראשון (k1 [0.18, 1.12, 0.43], "
      "a1 [0.27, 1.02, 0.83], pitch 0.1); KIDDUSH_SOUTH_214 — KID.yaw 0: פניו לכיור בשתי הרגליים, הוא עומד על רצפת העזרה (z 52.95, "
      "צפונית למעקה הבור), וצעד מערבה בין הרגליים (עד עכשיו פניו למזרח ולמערב, והוא עמד על דופן הבור); השלולית 0.2. "
      "SIMCHA_POUR_214 (57-add208.js) — הילדים עולים על הסולם, 0.22 מן השלבים, ועומדים על השלב העליון (TOPY − 1.3); הכד מורם "
      "לחזה ומוטה, פיו מעל אמצע הספל; זרם שמן מן הפה אל פני השמן שבספל.\n")
NU = ("- 2.0.14 (16.11.2026): בית ראשון 1.4.7 ובית שני 2.0.5 — קידוש ידיים ורגליים ברגל מורמת בשני הבתים, ומבט ההדגמה בבית "
      "ראשון יורד אל הכהן; בבית שני, בשמחת בית השואבה, הילדים על הסולמות והשמן נשפך לספלים.\n")
V = {'b2': ('2.0.4', '2.0.5'), 'b1': ('1.4.6', '1.4.7'), 'u': ('2.0.13', '2.0.14')}

if __name__ == '__main__':
    assert len(NOTE) <= 150, len(NOTE)
    # ---- B2: news_205
    p = '/home/claude/b2src/tools/port_ui.py'; u = rd(p); u0 = u
    u = put_list(u, 'news_205', B2_NEWS, 'news_204 = [\n')
    old = '  var UI_NEWS_VERS = [\n    ["2.0.4", %s],\n'
    if old in u:
        u = u.replace(old, '  var UI_NEWS_VERS = [\n    ["2.0.5", %s],\n    ["2.0.4", %s],\n')
        old2 = "''' % (J(news_204), J(news_204), J(news_203),"; assert u.count(old2) == 1
        u = u.replace(old2, "''' % (J(news_205), J(news_205), J(news_204), J(news_203),")
    if u != u0: wr(p, u); print('B2: news 2.0.5')
    m_ = '/home/claude/b2src/plugin/manifest.json'; t = rd(m_)
    if '"version": "%s"' % V['b2'][0] in t: wr(m_, t.replace('"version": "%s"' % V['b2'][0], '"version": "%s"' % V['b2'][1], 1)); print('B2: manifest', V['b2'][1])
    # ---- B1: 1.4.7
    p = '/home/claude/beit-rishon/src/70-ui.js'; u = rd(p); u0 = u
    line = '    ["1.4.7", [' + ", ".join(J(x) for x in B1_NEWS) + ']],\n'
    m = re.search(r'    \["1\.4\.7", \[.*?\]\],\n', u)
    if m:
        if m.group(0) != line: u = u[:m.start()] + line + u[m.end():]
    else:
        old = '  var UI_NEWS_VERS = [\n    ["1.4.6", ['; assert u.count(old) == 1, old
        u = u.replace(old, '  var UI_NEWS_VERS = [\n' + line + '    ["1.4.6", [')
    if u != u0: wr(p, u); print('B1: news 1.4.7')
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
    put('/home/claude/beit-rishon/plugin/DEV_NOTES.md', '**1.4.7 (16.11.2026', '**1.4.6 (16.11.2026', N1)
    put('/home/claude/b2src/DEV_NOTES.md', '- 2.0.5 (16.11.2026', '- 2.0.4 (16.11.2026', N2)
    put('/home/claude/unified-wt/unified/DEV_NOTES.md', '- 2.0.14 (16.11.2026', '- 2.0.13 (16.11.2026', NU)
    clean = lambda s: s.replace('**', '')
    out = ['בית המקדש (בית ראשון ובית שני בתוסף אחד) — גרסה 2.0.14', '', 'הערת העדכון לחנות (עד 150 תווים; כאן %d):' % len(NOTE), NOTE, '',
           'בבית ראשון (1.4.7):'] + ['• ' + clean(x) for x in B1_NEWS] + ['', 'בבית שני (2.0.5):'] + ['• ' + clean(x) for x in B2_NEWS]
    wr('/home/claude/beit-rishon/docs/תיאור העדכון 2.0.14.txt', '\n'.join(out) + '\n')
    md = ['### בבית שני (2.0.5)', ''] + ['- ' + x for x in B2_NEWS] + ['', '### בבית ראשון (1.4.7)', ''] + ['- ' + x for x in B1_NEWS]
    wr('/home/claude/tools211/news.md', '\n'.join(md) + '\n')
    print('release notes: %d lines; the store note %d chars; B2 %d items, B1 %d items' % (len(out), len(NOTE), len(B2_NEWS), len(B1_NEWS)))
