# the wording check over the visible strings of every source file of a house (comments and the news lists left out)
import re, io, glob, sys
root = sys.argv[1]
pats = [('version', r'מ־\d|גרסה \d|עד אז|ב־\d\.\d|עד \d\.\d'), ('kria', r'קריא(?:ה|ות|ת (?!שמע|הגבר|התורה|ההלל|המגילה))'), ('shura', r'בשור(?:ה|ת) ״|השורה ״|שורת ״'),
        ('table', r'טבלת(?! השיש)|בטבלה|קטגורי'), ('dgm', r'בדגם|בחירת דגם|לא מצאתי|בעקבות ההערות|כהן שלם')]
tot = 0
for f in sorted(glob.glob(root + '/src/*.js')):
    L = io.open(f, encoding='utf-8').read().split('\n'); innews = False
    for n, line in enumerate(L, 1):
        st = line.strip()
        if 'UI_NEWS_VERS' in line: innews = True
        if innews:
            if st.startswith('];'): innews = False
            continue
        if st.startswith('//') or st.startswith('*') or st.startswith('/*'): continue
        code = re.sub(r'\s//\s.*$', '', line)
        for name, p in pats:
            for m in re.finditer(p, code):
                tot += 1
                print(f.split('/')[-1], n, name, '|', code[max(0, m.start()-60):m.end()+45].strip())
print('total', tot)
