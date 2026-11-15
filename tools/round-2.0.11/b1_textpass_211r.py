# -*- coding: utf-8 -*-
# Beit Rishon: the wording pass of the review round (as b2src/tools/textpass_211r.py does for Beit Sheni): no version stamps in the cards
# ("18. א"), "שיטה" for an opinion ("19"), "מתג" for a switch, "בתפריט, תחת ״שיטות ומחלוקות״" for the place of the switches (U-06).
# On src/*.js: user-facing string lines only - not comment lines, not the news lists (70-ui.js UI_NEWS .. the end of UI_NEWS_VERS).
# Run: python3 b1_textpass_211r.py [-n]   (-n: dry run, print what would change). Idempotent.
import io, re, sys, glob
DRY = '-n' in sys.argv
RULES = [
    (r'במודל \((?:מ־|מגרסה )\d[\d.]*(?:; \d[\d.]*)?\):', 'במודל:'),
    (r' \((?:מ־|מגרסה )\d[\d.]*\)', ''),
    (r"של טבלת ['״]שיטות ומחלוקות['״]", 'שבתפריט, תחת ״שיטות ומחלוקות״'),
    (r"\(טבלת ['״]שיטות ומחלוקות['״]", '(בתפריט, תחת ״שיטות ומחלוקות״'),
    (r"בטבלת ['״]שיטות ומחלוקות['״]", 'בתפריט, תחת ״שיטות ומחלוקות״'),
    (r'בטבלת השיטות', 'בתפריט, תחת ״שיטות ומחלוקות״'),
    (r'שבקטגוריית ״שיטות ומחלוקות״', 'שבתפריט, תחת ״שיטות ומחלוקות״'),
    (r"בשורה (['״])", r'במתג \1'),
    (r"השורה (['״])", r'המתג \1'),
    (r"(?<![א-ת])שורת (['״])", r'המתג \1'),
    (r'(?<![א-ת])([והבלכש]{0,3})קריא(ות|ה|תו|ת)(?![א-ת])(?! שמע| הגבר| התורה| שם | הקישורים| בתורה)', r'\1שיט\2'),
    (r'בחירת המודל', 'בחירת מודל'),
]
log = []
for f in sorted(glob.glob('/home/claude/beit-rishon/src/*.js')):
    lines = io.open(f, encoding='utf-8').read().split('\n'); out = []; in_news = False; n = 0
    for line in lines:
        st = line.lstrip()
        if f.endswith('70-ui.js'):
            if st.startswith('var UI_NEWS = {'): in_news = True
            if in_news:
                out.append(line)
                if st.startswith('var UI_NEWS_VERS'): in_news = 'vers'
                elif in_news == 'vers' and line.startswith('  ];'): in_news = False
                continue
        if st.startswith('//') or st.startswith('*') or st.startswith('/*'):
            out.append(line); continue
        # the code and its trailing comment: only the code part is touched
        m = re.search(r'\s//\s', line)
        code, tail = (line[:m.start()], line[m.start():]) if m and line.count('"', 0, m.start()) % 2 == 0 else (line, '')
        new = code
        for pat, rep in RULES:
            new2 = re.sub(pat, rep, new)
            if new2 != new:
                for mm in re.finditer(pat, new): log.append((f.split('/')[-1], pat[:22], new[max(0, mm.start() - 30):mm.end() + 30]))
                new = new2
        if new != code: n += 1
        out.append(new + tail)
    if n and not DRY: io.open(f, 'w', encoding='utf-8').write('\n'.join(out))
    if n: print(f.split('/')[-1], n, 'lines')
print(len(log), 'replacements')
if DRY or '-v' in sys.argv:
    for x in log: print(' ·', x[0], '|', x[2].replace('\n', ' '))
