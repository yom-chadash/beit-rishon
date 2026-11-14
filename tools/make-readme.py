# tools/make-readme.py — README.md of yoniny/beit-rishon, written anew at every release (UPDATE_DOWNLOAD_210, 14.11.2026; the user:
# "רק שיעודכן כל פעם מחדש, תכניס ל-MD"). The plugin's page in the store and the link in the single HTML file lead to the repository,
# and its first screen is this file: what the plugin is, where to get it with Otzaria and without it, and what is new.
#
#   python3 -I tools/make-readme.py <version> <ver. of בית ראשון> <ver. of בית שני> <date d.m.yyyy> <news.md> <out README.md>
#
# news.md: the lines of "מה חדש" of this release (markdown, written for a reader who did not follow the work).
import sys

ver, v1, v2, date, news_p, out = sys.argv[1:7]
news = open(news_p, encoding="utf-8").read().strip()
DL = f"https://github.com/yoniny/beit-rishon/releases/download/v{ver}/beit-hamikdash-{ver}.html"   # the version in the name (the user: "תוסיף לשם הHTML את שם הגרסה")
text = f"""<div dir="rtl">

# בית המקדש — מודל תלת־ממדי

מודל תלת־ממדי של שני בתי המקדש: בית ראשון כפירוש רש״י, ובית שני לפי מסכת מידות והרמב״ם.
סיור, שיטות ומחלוקות, מצגות, ומקורות שנפתחים באוצריא.

**הגרסה הנוכחית: {ver}** (בית ראשון {v1}, בית שני {v2}). עודכן ב־{date}.

## באוצריא

התוסף נמצא בחנות התוספים של אוצריא, בשם ״בית המקדש״.
ההתקנה והעדכונים — דרך החנות.

## בלי אוצריא — קובץ אחד לצפייה

### [⬇ הורדת הקובץ — גרסה {ver}]({DL})

- זה קובץ אחד. פותחים אותו בדפדפן: כרום, אדג׳ או פיירפוקס. אין צורך בהתקנה.
- הקובץ יורד בשם `beit-hamikdash-{ver}.html`. אפשר לשנות את שמו.
- בתוך הקובץ, בסוף התפריט של כל בית, יש כפתור ״בדיקת עדכונים״. הוא בודק אם יצאה גרסה חדשה, ומוריד ושומר אותה.
- כל הגרסאות שפורסמו: [דף הגרסאות](https://github.com/yoniny/beit-rishon/releases).

## מה חדש בגרסה {ver}

{news}

## קרדיט

יוני מאיר ויוסי כהן (Yossi Cohen), shalomke.

## למפתחים

- `unified-plugin/` — התיקייה שהחנות מפרסמת ממנה (`.github/workflows/release.yml`).
- `src/`, `tools/` — קוד המקור של בית ראשון; `unified/` — המעטפת שמאחדת את שני הבתים. סדר הבנייה והפרסום: `unified/DEV_NOTES.md`.
- בענף `html` — הקובץ לצפייה בלי אוצריא בגרסה האחרונה, ו־`version.txt`. משם קורא כפתור ״בדיקת עדכונים״.

</div>
"""
open(out, "w", encoding="utf-8").write(text)
print("README.md:", ver, len(text), "chars")
