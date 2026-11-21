# בית שני — קובצי המקור (לפיתוח)

מ־21.11.2026, אחרי גרסה 3.0.6, הקוד של בית שני נמצא כאן, ב־`sheni/src/`, בקבצים נפרדים.
עד אז הוא היה קובץ אחד, `sheni-src/bundle.js` (כ־78,000 שורות), וכל שינוי נעשה בתסריט שמחליף טקסט.
הקבצים נחתכו מן הקובץ הזה בלי שום שינוי בקוד (`tools/split-sheni.mjs`).
הבנייה מחזירה את הקובץ בדיוק, בייט לבייט.

**מ־21.11.2026 (שלב 2): הממשק משותף לשני הבתים.** ששה קבצים אינם עוד כאן: `00-lib.js`, `70-ui.js`, `72-words.js`, `75-tour.js`, `85-hq.js`, `90-entry.js`.
הם ב־`shared/`, אחד לשני הבתים. מה ששונה בבית שני — בחריצים, ב־`sheni/src/slots/<קובץ>.slots.js`.
כך גם שתי ערכות הדמויות: ב־`30-courts.js` וב־`55-payis.js` יש שורת `//@@include`, והקטע עצמו ב־`shared/frag/`.
הבנייה מרכיבה הכול בחזרה (`tools/house-slots.mjs`), והקובץ הקריא נשאר זהה בייט לבייט.
ההסבר והכללים — `unified/DEV_NOTES.md`, ״הקוד המשותף לשני הבתים״.

## איך בונים

מתוך תיקיית המאגר. בפעם הראשונה: `npm ci` (מתקין את terser ואת acorn).

```sh
node tools/build-sheni.mjs                                   # הקובץ הקריא: build/sheni/bundle.readable.js
node tools/build-sheni.mjs --house build/sheni/house         # תיקיית הבית: bundle.js מוקטן, index.html, manifest.json
node tools/build.mjs                                         # בית ראשון, כמו תמיד (אל plugin/)
node tools/build-unified.mjs --rishon plugin --sheni build/sheni/house --out dist-unified --version <הגרסה המאוחדת>
```

- הגרסה של בית שני נלקחת מ־`UI_NEWS.ver` שב־`sheni/src/70-ui.js`.
- אם נותנים `--version` — היא חייבת להיות אותה גרסה. אחרת הבנייה נעצרת (״מה חדש״ והסרגל היו מראים גרסאות שונות).
- השוואה בייט לבייט לקובץ קריא אחר: `--compare <קובץ>`. כשיש הבדל — מודפסת השורה הראשונה השונה, וקובץ המקור שהיא באה ממנו.
- למשל, מול 3.0.6:
  `git show 3c82e60:sheni-src/bundle.js > /tmp/sheni-306.js && node tools/build-sheni.mjs --compare /tmp/sheni-306.js`

## מה הבנייה עושה

1. מחברת את הקבצים לפי `ORDER` שב־`tools/build-sheni.mjs`. בסוף היא מוסיפה את `TAIL`: סגירת הפונקציה ורישיון three.js (כמו `tools/assemble.mjs` של בית ראשון).
2. מוסיפה ` //` בסוף כל שורת קוד (`tools/safe-lines.mjs`), כמו שהיה בקובץ הגדול. כך הקובץ הקריא זהה לו בדיוק. הכלי גם מוכיח שלא השתנה שום דבר בקוד עצמו.
3. בודקת את הקובץ ב־`node --check`.
4. עם `--house`: מקטינה ב־terser, באותן אפשרויות של בית ראשון (`tools/build.mjs`), ומריצה safe-lines על הקובץ המוקטן. זה הקובץ שהחנות בודקת; בלי ` //` בסוף השורות הבודק שלה נתקע.
5. אחר כך מריצה את `tools/round-2.0.18/house_sheni.py`, שכותב את `index.html` ואת `manifest.json` של הבית.

## הקבצים

הסדר כאן הוא סדר הבנייה.

| הקובץ | מה בו | שורות |
|---|---|---|
| `header.txt` | הערת הפתיחה של הקובץ (DEV NOTES) | 83 |
| `00-lib.js` → `shared/00-lib.js` | פתיחת הפונקציה, שני העזרים של esbuild, ו־three.js 187. אחד לשני הבתים (היה זהה בייט לבייט) | 46,246 |
| `10-core.js` | הגבהים (`LV`), הצבעים, המרקמים וכלי הבנייה (`H`) | 858 |
| `20-mount.js` | הר הבית והחומות (`build`) | 712 |
| `30-courts.js` | העזרות, השערים והלשכות (`build2`); ערכת האנשים — `//@@include people-kit` (`shared/frag/people-kit.js`) | 3,700 |
| `40-altar.js` | המזבח, הכבש והאש (`build3`) | 2,254 |
| `45-vessels.js` | כלי הקודש: המנורה, השולחן, מזבח הזהב (`buildVessels`) | 1,255 |
| `50-heichal.js` | האולם, ההיכל והתאים (`build4`) | 4,149 |
| `55-payis.js` | הדגמת הפייסות (`buildPayis`); דמות הכהן — `//@@include priest-kit` (`shared/frag/priest-kit.js`) | 1,287 |
| `56-tamid-data.js` | הטקסטים של ״סדר עבודת הבוקר״. נוצר בכלי (`tamid_200.py`); לא עורכים ביד | 3 |
| `55-tamid.js` | ״סדר עבודת הבוקר״ (`buildTamid`) | 3,220 |
| `57-add208.js` | התוספות של סבב ״ערכי המקדש״ (`buildAdd208`) | 1,727 |
| `70-ui.js` → `shared/70-ui.js` + `slots/70-ui.slots.js` | הממשק: הלוח, המקומות, השיטות, הכרטיסים, ״מה חדש״ (החריץ `UI_NEWS`) | 6,581 |
| `72-words.js` → `shared/72-words.js` + `slots/72-words.slots.js` | החיפוש במילות המקורות. הטבלה — החריץ `WORDS` (נוצרה ב־`tools/words/gen_words.py`; לא עורכים ביד) | 700 |
| `75-tour.js` → `shared/75-tour.js` + `slots/75-tour.slots.js` | המצגת | 2,160 |
| `85-hq.js` → `shared/85-hq.js` + `slots/85-hq.slots.js` | הגדרות התאורה (HQ_302) | 989 |
| `90-entry.js` → `shared/90-entry.js` + `slots/90-entry.slots.js` | המנוע: הצייר, המצלמה, הטעינה, לולאת הציור, הקולות | 2,099 |

## כללים

- עורכים רק כאן, ב־`sheni/src/` — ובקבצים המשותפים, ב־`shared/` (שינוי שם חל על שני הבתים).
- הקובץ `sheni-src/bundle.js` הוסר מן המאגר. הגרסה שלו של 3.0.6 נמצאת בהיסטוריה, בקומיט 3c82e60.
- לא כותבים ` //` בסוף שורות. הבנייה מוסיפה אותו לבד.
- כל הקבצים הם חלקים של פונקציה אחת: `var OtzariaPlugin = (() => {` בראש `00-lib.js`, ו־`})();` ב־`TAIL`. לכן:
  - אין קובץ שהוא JavaScript תקין לבדו. `node --check` ו־safe-lines רצים רק על הקובץ המורכב.
  - כל השמות משותפים לכל הקבצים, כמו בקובץ האחד. שם שמוצהר פעמיים (`function X` בשני קבצים) — האחרון גובר, בלי שגיאה.
- הסדר הוא `ORDER` שב־`tools/build-sheni.mjs`, ולא סדר השמות: `56-tamid-data.js` בא לפני `55-tamid.js`.
- קובץ חדש — מוסיפים אותו ל־`ORDER`. קובץ שאינו ברשימה מפיל את הבנייה (אחרת הוא היה נשאר בחוץ בשקט).
- השורה הראשונה של כל מודול (`  // plugin/js/<שם>.js`) היא סימן הקטע מן הקובץ הגדול. היא הערה בלבד, ונשארת.
- השמות (`55-tamid.js`, `57-add208.js` וכו') הם השמות שהקוד עצמו מזכיר בהערות שלו.
- `index.html` ו־`manifest.json` של הבית עדיין אינם כאן. `house_sheni.py` לוקח אותם מ־`unified-plugin/` (התוצר האחרון שפורסם).

## תיקונים בתסריט, מעכשיו

- תסריט תיקון כותב אל הקובץ שב־`sheni/src/`, ולא אל קובץ גדול.
- העוגנים — בלי ` //` בסוף השורה. בקבצים כאן אין סיומות כאלה.
- ״מה חדש״ של בית שני — החריץ `UI_NEWS` שב־`sheni/src/slots/70-ui.slots.js` (עד 3.0.6 כתב אותו `release_30x.py --sheni` אל `sheni-src/bundle.js`).

## תסריטי הסבבים הישנים

- התסריטים ב־`tools/round-2.*`, `tools/round-3.0.*` ו־`tools/round-webgpu` נכתבו לקובץ הגדול. הם תיעוד של מה שנעשה בכל גרסה. לא מריצים אותם.
- העוגנים שלהם כוללים את הסיומת ` //`. על הקבצים כאן הם לא יימצאו, והתסריט ייכשל.
- `chain.sh` של 3.0.5 ו־3.0.6 נכשל מעכשיו בפקודה `git checkout -q sheni-src/bundle.js`, כי הקובץ אינו קיים. זה בכוונה: שלא יתוקן קובץ שאינו המקור.
- אם בכל זאת צריך להחיל תיקון כזה (או לקלוט קובץ גדול מענף אחר, במיזוג):
  1. בונים את הקובץ הקריא, ושומרים עותק שלו כבסיס:
     `node tools/build-sheni.mjs && cp build/sheni/bundle.readable.js /tmp/base.js`
  2. מריצים את התיקון על `build/sheni/bundle.readable.js`, ואחריו `node tools/safe-lines.mjs build/sheni/bundle.readable.js` (כמו ב־`chain.sh`).
  3. מפרקים מחדש (מ־שלב 2: **אל תיקייה ריקה**, לא אל `sheni/src` — הכלי מסרב כשיש קבצים ב־`shared/`; את השינוי מעבירים ביד אל `shared/` או אל החריץ):
     `node tools/split-sheni.mjs build/sheni/bundle.readable.js sheni/src --force --base /tmp/base.js`
  - במיזוג: `--base` הוא הקובץ הגדול שממנו יצא הענף האחר. למשל, ענף שיצא מ־3.0.6: `git show 3c82e60:sheni-src/bundle.js > /tmp/base.js`.
  - אם מיזוג מחזיר את `sheni-src/bundle.js`, והוא שונה ממה ש־`sheni/src` בונה — `build-sheni.mjs` נעצר. הוא ממשיך רק אחרי שהשינוי הועבר ל־`sheni/src` והקובץ נמחק.
  - הכלי כותב רק אם הקבצים שב־`sheni/src` בונים **בדיוק** את `--base`. אם הם שונו מאז — הוא מסרב, כדי ששום שינוי לא יאבד בשקט. שינוי כזה מעבירים ביד.
  - והוא אינו כותב כלום לפני שהוכיח שהקבצים החדשים מחזירים את הקובץ המתוקן בדיוק.
