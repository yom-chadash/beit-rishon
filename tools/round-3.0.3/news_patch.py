#!/usr/bin/env python3
# round 3.0.3 -> released as 3.0.2 (the user, 18.11.2026: "תאחד את שניהם לגרסה החדשה"; "תפרסם רק אחרי המסיבה ובית הטבילה"):
# the Second Temple's "מה חדש" for 2.0.11 - the way down to the bath and the libation bowls, after the large line at its head,
# in both lists (UI_NEWS.items - the window's; UI_NEWS_VERS - by version). After sfalim_patch.py and mesibah_patch.py.
#   python3 -I tools/round-3.0.3/news_patch.py sheni-src/bundle.js
import sys, json

path = sys.argv[1]
s = open(path, encoding='utf-8').read()

MES = ("**חדש: המסיבה ובית הטבילה** — הדרך שבה כהן שאירע לו קרי בלילה יורד מבית המוקד לטבול (תמיד א, א): "
       "מעלות סביב עמוד יורדות מן הלשכה הצפונית מערבית אל מחילה שמתחת לקרקע, ונרות דולקים משני צדיה; בסופה המדורה, "
       "בית כסא של כבוד, ודלתו פתוחה, ובית הטבילה. במקום ״המסיבה ובית הטבילה״ (בקבוצת ״לשכות״) הקרקע נעשית שקופה, "
       "ורואים את כל הדרך מלמעלה. ובהדגמה החדשה ״הכהן יורד לבית הטבילה״ (בקבוצת ״הדגמות״) — ההליכה כולה, בגובה העיניים.")
CUPS = ("**ספלי הניסוך — צוירו מחדש, בשתי השיטות** — שני הספלים שבראש המזבח, בקרן דרומית מערבית, קבועים עכשיו בגג המזבח. "
        "בשיטת רש״י: חוטם לכל ספל, ונקב בגג המזבח לכל אחד. בשיטת התוספות: נקב בתחתית כל ספל, ספל המים תחתיתו עבה, "
        "ומעל כל נקב כיסוי קטן כמין חוטם (״ושמא כמין בליטת חוטם״). במקום ״ספלי הניסוך״ פינת המזבח נעשית שקופה, "
        "ורואים את הנקבים יורדים אל השיתין. ובהדגמת ״סדר עבודת הבוקר״ הכהן מנסך את היין כשהוא עומד מצפון לספלים — "
        "עד עכשיו עמד בתוך ספל המים.")

i = s.index('"@גדול **שימו לב')
j = s.index('", "', i) + 1
big = s[i:j]
if s.count(big) != 2:
    sys.exit('the large line found %d times (want 2)' % s.count(big))
s = s.replace(big, big + ', ' + json.dumps(MES, ensure_ascii=False) + ', ' + json.dumps(CUPS, ensure_ascii=False))
open(path, 'w', encoding='utf-8').write(s)
print('NEWS_303: 2 lines, in both lists')
