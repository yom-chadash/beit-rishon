# Reviewer U — UNDERSTANDABILITY — round 211 (b1 1.4.4 + b2 2.0.2, unified 2.0.11)

Tested: the RELEASE CANDIDATE `/home/claude/rev211/cand/` (b2/plugin, b2/content.json, b1/plugin, b1/src/70-ui.js,
`תיאור העדכון 2.0.11.txt`, `תיאור התוסף לחנות.txt`).
Persona: a Torah teacher, fluent Hebrew, knows Mishnah and Gemara, not a computer person, never saw the development.
Scratch: `/home/claude/rev211/work/U/`, scripts and renders: `/home/claude/qa/r211/rev_U/` (`out/`).
I did NOT check quotations against the books (other reviewers do). Findings are appended as found (so the numbers are in the order of discovery, not of weight); the summary,
the full improved texts ("מה חדש", store note, store description), VERIFIED and COVERAGE are at the end.

## FINDINGS

### U-01 — MED — the same paragraph appears twice in five b2 cards
- WHERE: b2 `content.json` PLACES: «לשכת הנזירים» (the paragraph `**המאירי:** ״לשכת הנזירים, ששם מבשלין…״` ×2, paragraphs 7 and 8); «לשכת המלח» (`במודל (מ־2.0.2): כהן ממלא קערה מן הערמה…` ×2, paragraphs 4 and 6); «לשכת הפרוה» (`במודל (מ־2.0.2): על הגיגית המזרחית…` ×2); «לשכת העץ — לשכת כהן גדול (פרהדרין)» (`**שבעת הימים** (יומא א, ג)…` ×2 and `במודל (מ־2.0.2): מזוזה על עמוד הפתח המערבי…` ×2); «לשכת בית אבטינס — על גבי שער המים» (`**הגמרא** (יומא לח.), בין הנזכרים לגנאי…` ×2 and `במודל (מ־2.0.2): אחד מבית אבטינס…` ×2).
- WHAT: a reader sees the identical paragraph twice in one card — it looks like a broken card. All seven doubled paragraphs were added in this round.
- EVIDENCE: `python3` over `cand/b2/content.json` (Counter of the paragraphs of each `info`): 7 paragraphs with count 2, exactly the list above. In «לשכת המלח» there are in addition two different paragraphs that both open "במודל" (3: `במודל: הראשונה מן המזרח… (מ־1.5.0)`, 4: `במודל (מ־2.0.2): …`).
- FIX: delete the second copy in each of the five cards; in «לשכת המלח» join the two "במודל" paragraphs into one: «במודל: הראשונה מן המזרח בשלוש לשכות הדרום, כסדר התוספות יום טוב והתפארת ישראל. בתוכה ערמת מלח — ״על כל קרבנך תקריב מלח״ (ויקרא ב, יג); כהן ממלא קערה מן הערמה, ועל שולחן שיש בפינה עומדות קערות מלח מוכנות להוליכן אל הכבש, ששם מלחו את האברים: ״הלכו ונתנום מחצי הכבש ולמטה במערבו, ומלחום״ (תמיד ד, ג). הערמה, הדמות, הקערות והשולחן — בחירת מודל.»
- OWNER: no.

### U-02 — MED — «הממונים שבמקדש»: two consecutive paragraphs contradict each other
- WHERE: b2 PLACES «הממונים שבמקדש», paragraphs 5–6: `במודל: מקומות שעבדו בהם חלק מן הממונים … יש להם כרטיסים משלהם; … הממונים עצמם אינם מצוירים בהם.` and immediately `**מ־2.0.2 — חמישה עשר הממונים מצוירים**, כל אחד במקומו, ומעליו לוחית ובה מספרו ותפקידו.`
- WHAT: "הממונים עצמם אינם מצוירים" and, in the next line, "חמישה עשר הממונים מצוירים". A reader cannot know which is true. Also the card says the sign carries "מספרו ותפקידו", the "מה חדש" line says "כל אחד ושמו ותפקידו" (in the model: a sign `1 · החותמות` and under it the name, `יוחנן בן פנחס — על החותמות` — `30-courts.js`), and the bold opening is a version number.
- FIX (one paragraph instead of the two): «במודל: חמישה עשר הממונים מצוירים, כל אחד במקום עבודתו. מעל כל אחד לוחית ובה מספרו כסדר המשנה ותפקידו, ותחתיה שמו. צבע הלוחית: זהב — כהן; אדום — לוי; ירוק — ישראל; כחול — מי ששבטו לא נתפרש. למקומות שעבדו בהם כמה מן הממונים — לשכת הגזית (הפייסות), בית אבטינס ולשכת פנחס המלביש — יש כרטיסים משלהם; ובהדגמה ״סדר עבודת הבוקר״ בן ארזא מקיש בצלצל (תמיד ז, ג).»
- OWNER: no.

### U-03 — MED — first-person voice of the builder in a card
- WHERE: b2 PLACES «לשכת הכלים», the "במודל (מ־2.0.2)" paragraph, last sentence: `אם לשכת הכלים שבתמיד ולשכת הכלים שבשקלים — לשכה אחת, לא מצאתי מי שכתב.` (new in this round).
- WHAT: "לא מצאתי" — who is speaking? (rule 7). The same paragraph says `איזה תא — בחירת מודל, שהרי כתב ״אפשר״` without saying who wrote.
- FIX: «איזה תא — בחירת מודל, שהרי התפארת ישראל כתב רק ״אפשר״; וכן המדפים, צורת הכלים (קערות, כוסות ומחבתות, כסף וזהב לסירוגין) וסדרם. האם לשכת הכלים שבמסכת תמיד היא לשכת הכלים שבמסכת שקלים — לא נמצא מי שכתב על כך.»
- OWNER: no.

### U-04 — MED — a trace of the dialogue in four cards: «מ־1.3.0 (בעקבות ההערות)»
- WHERE: b2 PLACES «כבשים קטנים — רש"י», «כבשים קטנים — תוספות»; SHITOT «הכבשים הקטנים» / «רש״י — שני כבשים», «תוספות — גם כבש שלישי» — in the long paragraph that was rewritten in this round: `מ־1.3.0 (בעקבות ההערות): שני הכבשים הקטנים יוצאים מגוף הכבש הגדול…`
- WHAT: "בעקבות ההערות" — whose comments? It is a note of the development, not information about the Temple (rule 7).
- FIX: delete the words `מ־1.3.0 (בעקבות ההערות): ` (the whole paragraph is rewritten in U-14).
- OWNER: no.

### U-05 — MED — version talk in the cards (65 places in b2; 38 of them in paragraphs written or changed in this round)
- WHERE: b2 `content.json`, everywhere: `במודל (מ־2.0.2):` (לשכת המלח, הפרוה, המדיחין, פרהדרין, פנחס המלביש, לשכות כלי השיר, בית אבטינס, מנורות של זהב, שולחן לחם הפנים, לשכת הכלים…), `הדלת (מ־2.0.2):` (נזירים, עצים, שמנים), `בית הטבילה (מ־2.0.2):`, `**מקום הלשכה** (מ־2.0.2): … עד גרסה 2.0.1 עמדה הלשכה…` (פנחס, חביתין), `(מ־2.0.2; עד אז בלט בסיס האבן…)` (החיל), `כהן שלם (מ־2.0.2; עד אז נראתה יד בלבד)` (פשפשי ההיכל, פתיחת השער הגדול), `בהדגמה (מ־2.0.2) נראה כהן שלם` (5 options), and «בית המוקד», one paragraph with FOUR version numbers: `במודל (מ־1.4.0): … מ־2.0.1 … מ־1.8.0 … מ־2.0.2: הבית רחב שלושים ושתיים אמה (עשרים וארבע עד אז)`. b1: `(כפתור על הכסא; מ־1.4.4 המלך מוצג…; עד אז הוצג בצללית בלבד)`, `**הרבובה — למה שימשה** (מ־1.4.4)`, `במודל (מ־1.4.4): הכבש לסובב…`.
- WHAT: an end user does not need to know from which version a thing is drawn, nor what was drawn before; that belongs in "מה חדש". It is also undecipherable: the cards of b2 cite 16 different version numbers (1.1.0 … 2.0.3), the screen shows "v2.0.2", the store shows "2.0.11", and three old cards say `עד גרסה 2.0.3` — a number HIGHER than the b2 version on the screen (pre-existing: «שער שושן», INFO `shushanGate`, «בניין הורדוס»).
- EVIDENCE: regex `מ־\d+\.\d+\.\d+` over the candidate's cards: 65 paragraphs, 38 not found in 2.0.1's content; version numbers cited: 1.1.0(2 cards) 1.3.0(14) 1.4.0(3) 1.5.0(8) 1.7.0 1.7.1 1.8.0(2) 1.9.1(4) 1.9.2 1.9.3 1.9.4 1.9.5(3) 1.9.6 2.0.1(6) 2.0.2(25) 2.0.3(3).
- FIX: a mechanical pass — `במודל (מ־X):` → `במודל:`; `(מ־X)` and `מ־X:` removed; every "עד אז…/עד גרסה…" sentence removed. The new sentences, rewritten:
  - החיל (end of the paragraph): delete `(מ־2.0.2; עד אז בלט בסיס האבן של העזרות שבע אמות וחצי לתוך החיל, והסורג עמד סמוך לו.)`.
  - נזירים: `מ־2.0.2 יש בה גם אנשים: נזיר יושב…` → «ובה אנשים: נזיר יושב…»; `הדלת (מ־2.0.2): בשיטת הרא״ש…` → «הדלת: בשיטת הרא״ש (הלשכות מבחוץ) — כותל בצד העזרה, ובו פתח ודלת, כבלשכת המצורעים. אין לה מקור — בחירת מודל.» (the same in עצים and שמנים).
  - מצורעים: `ומ־2.0.2 — כך בכל ארבע הלשכות` → «וכך בכל ארבע הלשכות».
  - פנחס המלביש / עושי חביתין: «**מקום הלשכה:** על רצפת עזרת ישראל, ופתחה אל העזרה, דרך הכותל; ותחתיה, בגובה רצפת עזרת הנשים, לשכת כלי השיר, הפתוחה לעזרת הנשים (מידות ב, ו). מקומה מעל לשכת כלי השיר, ופתחה לעזרה — בחירת מודל.»
  - בית המוקד: «במודל: הבית חלול — ארבע הלשכות בפינותיו (טלאי קרבן, עושי לחם הפנים, אבני המזבח, הירידה לבית הטבילה), ומעל כל אחת שמה במשנת תמיד; הרובדין; טבלת השיש והטבעת שבה; המוקד — אש גדולה להתחמם בה; והירידה לבית הטבילה. הכפתור ״פתח את הלשכות״ מסיר את גגו. מקומו על החומה הצפונית, קצתו בעזרה וקצתו בחיל; האולם פתוח מצד לצד — ״שתים בקדש ושתים בחל, וראשי פספסין מבדילין בין קדש לחל״ (מידות א, ו; ברטנורא: ״ראשי קורות יוצאים מן הכתל עד המקום שהוא קדש״) — וראשי הקורות בכתלי הבית, על קו החומה. שני שעריו (א, ז) גבוהים עשרים אמה, ולכן גובה הבית במודל עשרים וארבע. הבית רחב שלושים ושתיים אמה; כל לשכה כתשע אמות וחצי על שש וחצי, ומקורה בתקרה משלה; רצפת הבית כולה במפלס אחד, כרצפת העזרה, וחמש מעלות עולות אליה בתוך השער הפתוח לחיל. מידות הבית והלשכות אינן כתובות (״בית גדול היה״) — בחירת מודל.»
  - פשפשי ההיכל / פתיחת השער הגדול / the five options: see U-09.
- OWNER: no.

### U-06 — MED — one thing, four names: «מתג» / «שורה» / «הקריאה נבחרת בשורה» / «טבלת השיטות» / «קטגוריית ״שיטות ומחלוקות״»
- WHERE: the cards of 2.0.1 say "מתג" (68 paragraphs). The cards written in this round say "שורה" (11 new uses): «לשכת עושי לחם הפנים» `הקריאה נבחרת בשורה שבכרטיס זה`, `לפי השורה ״צורת לחם הפנים״`; «לשכת החותמות» `הקריאה נבחרת בשורה ״שמות הלשכות שבבית המוקד״`; «לשכת אבני המזבח», «הירידה לבית הטבילה» `(השורה ״שמות הלשכות שבבית המוקד״)`; «לשכת פנחס המלביש», «לשכת עושי חביתין» `(הקריאה נבחרת בשורה ״חביתי כהן גדול — אפייה וטיגון״)`; «ניצוצות הנברשת» `לפי השורה ״הנברשת של הילני — צורתה״`; «שולחן לחם הפנים» `לפי השורה ״צורת לחם הפנים״`; «פשפשי ההיכל» `כקריאה שנבחרה בשורה ״המפתח שיורד לאמת השחי״`; «הכהן הגדול נכנס בקטורת» `(רבי יוסי; השורה ״הפרוכות — שתיים או אחת״)`; the on-model button's tooltip `בדרך שנבחרה בשורת ״הפרוכות — שתיים או אחת״` (`50-heichal.js:3243`); the demo text `כשבשורה "מניין המערכות" נבחרו שלוש מערכות או ארבע` (`56-tamid-data.js`). The place where the toggles live is called `בטבלת ״שיטות ומחלוקות״` ("מה חדש"), `(בטבלת השיטות)` (הסורג, מידות המזבח, פשפשי ההיכל), `שבקטגוריית ״שיטות ומחלוקות״` (כני הזהב, עושי חביתין, נזירים), `בקטגוריה ״שיטות ומחלוקות״` ("מה חדש" of 2.0.1); on the screen it is a section of the side menu headed «שיטות ומחלוקות — בחירת הקריאה». The help page says "לחיצה על שיטה".
- WHAT: "שורה" is the builder's word for a line of the table; a reader does not know what "השורה" is, and `הקריאה נבחרת בשורה שבכרטיס זה` is not Hebrew that a teacher understands. "מה חדש" itself says "מתג" (11 times).
- FIX: one formula everywhere — «במתג ״<שם>״ (בתפריט, תחת ״שיטות ומחלוקות״)», and inside a card that carries the toggle: «במתג שבסוף כרטיס זה». Replacements:
  - עושי לחם הפנים: `הקריאה נבחרת בשורה שבכרטיס זה.` → «בוחרים בין השתיים במתג ״לשכת עושי לחם הפנים — מה נעשה בה״, שבסוף כרטיס זה.»; `לפי השורה ״צורת לחם הפנים״` → «לפי המתג ״צורת לחם הפנים״».
  - החותמות: → «בוחרים בין השיטות במתג ״שמות הלשכות שבבית המוקד — לפי משנת תמיד״, והחותמות עוברים עם הבחירה.»
  - אבני המזבח / הירידה לבית הטבילה: `(השורה ״…״)` → «(המתג ״שמות הלשכות שבבית המוקד — לפי משנת תמיד״)».
  - פנחס / חביתין: `(הקריאה נבחרת בשורה ״חביתי כהן גדול — אפייה וטיגון״)` → «(בוחרים במתג ״חביתי כהן גדול — אפייה וטיגון״)».
  - ניצוצות: «לפי המתג ״הנברשת של הילני — צורתה״»; שולחן לחם הפנים: «לפי המתג ״צורת לחם הפנים״».
  - הכהן הגדול נכנס בקטורת: «(רבי יוסי; המתג ״הפרוכות — שתיים או אחת״)»; the button's tooltip: «…בדרך שנבחרה במתג ״הפרוכות — שתיים או אחת״.»
  - the demo text: «היא מוצגת כשבמתג ״מניין המערכות״ נבחרו שלוש מערכות או ארבע.»
  - "טבלת השיטות" / "קטגוריית…" → «בתפריט, תחת ״שיטות ומחלוקות״» (also in "מה חדש", see U-30).
- OWNER: no.

### U-07 — LOW — «קריאה» for an opinion (19 new uses), next to «שיטה», «דעה», «אפשרות», «פירוש»
- WHERE: all eight cards of «צורת התאים» open `**בקריאה זו:**`; «הפרוכות — שתיים או אחת» / «רבי יוסי» `כבקריאה הראשונה`, `שבקריאה הראשונה`; «שמות הלשכות שבבית המוקד» `בבחירת קריאה המבט עובר…`, `לפי אותה קריאה`; «לשכת אבני המזבח» `לקריאת הרא״ש`; «מידות המזבח» `קריאות רש״י והרמב״ם… קריאת הראב״ד`; the menu's heading «שיטות ומחלוקות — בחירת הקריאה».
- WHAT: a Torah teacher says "שיטה" or "פירוש"; "קריאה" in this sense is academic Hebrew, and next to "קריאת שמע" in the same cards it is confusing. The row is called "שיטות ומחלוקות", "מה חדש" says "שמונה השיטות".
- FIX: `**בקריאה זו:**` → «**בשיטה זו:**»; `כבקריאה הראשונה` → «כבאפשרות הראשונה»; `בבחירת קריאה המבט עובר על ארבע הלשכות, אחת אחת, ומעל כל לשכה שמה לפי אותה קריאה… נגיעה בעכבר במודל עוצרת את הסיור.` → «כשבוחרים שיטה, המבט עובר על ארבע הלשכות, אחת אחת, ומעל כל לשכה מופיע שמה לפי אותה שיטה: שתי הצפוניות, שבהן המחלוקת, במסגרת אדומה, ושתי הדרומיות, המוסכמות, בזהב. בסוף נראות ארבעתן יחד. לחיצה בעכבר על המודל עוצרת את הסיור.»; the heading → «שיטות ומחלוקות — בחירת השיטה».
- OWNER: yes (the word is used since earlier versions; the owner may prefer it).

### U-08 — LOW — «בדגם» instead of «במודל»
- WHERE: b2 PLACES «לשכת המצורעים», `בית הטבילה (מ־2.0.2): הלשכה עצמה — ״ולא היו מקורות״ (מידות ב, ה). בדגם: סביב הבור בית קטן של אבן…` (new). Pre-existing, in the "מה חדש" of an older version of both houses: `לחיצה על הדגם בזמן הדגמה`. b1 cards: `בחירת המודל` ×5 in `40-altar.js` (one of them new: `כמה הוא נוטה, ורוחב הכבשים — בחירת המודל.`) and once in `70-ui.js`, against "בחירת מודל" everywhere else.
- FIX: «בית הטבילה: הלשכה עצמה אינה מקורה — ״ולא היו מקורות״ (מידות ב, ה). במודל: סביב הבור בית קטן של אבן, מקורה…»; b1: `בחירת המודל` → «בחירת מודל».
- OWNER: no.

### U-09 — MED — «כהן שלם» (seven places)
- WHERE: b2 «פשפשי ההיכל» `כהן שלם (מ־2.0.2; עד אז נראתה יד בלבד) פותח את המנעולים`; «פתיחת השער הגדול — הדגמה» `כהן שלם (מ־2.0.2; עד אז נראתה יד בלבד) מכניס מפתח`; SHITOT «המפתח שיורד לאמת השחי» ×3 `בהדגמה (מ־2.0.2) נראה כהן שלם`; «הדרך מן הפשפש לשער הגדול» ×2 `הולך לפני העין כהן שלם`.
- WHAT: in a card about the Temple "כהן שלם" reads as "a kohen without a blemish". It only makes sense to one who knows that a bare hand was drawn before.
- FIX: «…בתחילת ההליכה — המפתחות: כהן פותח את המנעולים, לפי השיטה שנבחרה במתג ״המפתח שיורד לאמת השחי״; בתוך הכותל, החור והיד מצוירים כאילו הכותל שקוף; ומשם הוא הולך לפני העין עד השער הגדול.» / «…הדלתות סגורות; כהן מכניס מפתח של זהב למנעול…» / «בהדגמה נראה הכהן עצמו: הוא עומד לפני הדלת…» / «בהדגמה הולך לפני העין כהן, והמפתח בידו: …».
- OWNER: no.

### U-10 — MED — «הכהן הגדול נכנס בקטורת — הדגמה»: the "במודל" paragraph is written in shorthand, and does not say whose way is drawn
- WHERE: b2 PLACES «הכהן הגדול נכנס בקטורת — הדגמה», last paragraph: `במודל: הכהן הגדול באבנט לבן, המחתה בימינו והכף בשמאלו. בשתי פרוכות (ברירת המחדל) — בין המזבח למנורה, אל פתח הפרוכת החיצונה שבדרום, ביניהן צפונה, ונכנס בפתח הפנימית. בפרוכת אחת (רבי יוסי; השורה ״הפרוכות — שתיים או אחת״) — בין השולחן לכותל, אל הפתח שבצפון. המבט אינו נכנס לקודש הקדשים, והענן נשאר: הכהן נכנס ואינו נראה עוד, ויוצא אחורנית.`
- WHAT: (1) "בשתי פרוכות — בין המזבח למנורה, אל פתח…, ביניהן צפונה" has no verb and no subject; (2) "והענן נשאר" — which cloud? Only the builder knows that the model covers the Holy of Holies with a cloud (another card of this round does explain it: `קודש הקדשים, המכוסה בענן במודל`); (3) "באבנט לבן" — a teacher expects "בבגדי לבן"; (4) the card quotes three ways through the Heichal (רבי יהודה, רבי מאיר, יש אומרים = רבי יוסי) and the model draws two; the paragraph does not say that the default way is רבי יהודה's and that רבי מאיר's is not drawn.
- FIX: «במודל: הכהן הגדול בבגדי לבן, המחתה בימינו והכף בשמאלו. כשיש שתי פרוכות (ברירת המחדל) הוא מהלך בין המזבח למנורה, כרבי יהודה, אל פתח הפרוכת החיצונה, שבדרום; הולך בין שתי הפרוכות צפונה; ונכנס בפתח הפרוכת הפנימית. כשיש פרוכת אחת (רבי יוסי; המתג ״הפרוכות — שתיים או אחת״) הוא מהלך בין השולחן לכותל, אל הפתח שבצפון. דרכו של רבי מאיר, בין השולחן למזבח, אינה מצוירת. המבט אינו נכנס לקודש הקדשים, והוא נשאר מכוסה בענן, כבכל המודל: הכהן הגדול נכנס ואינו נראה עוד, ואחר כך הוא יוצא אחורנית, ופניו אל קודש הקדשים. מהירות ההליכה, דרך המבט ומקום התפילה — בחירת מודל.»
- OWNER: yes for (4) only (whether it is enough to say "כרבי יהודה", or רבי מאיר's way should be offered too).

### U-11 — MED — «הרובד הרביעי — ביום הכיפורים»: sentences only the builder can follow
- WHERE: b2 PLACES «הרובד הרביעי — ביום הכיפורים»: `בקצרה — מאיפה מונים (במודל — שלושה צבעים):`; the last paragraph: `במודל: ארבע שורות לכל מניין; הרביעית חזקה, ושלוש הראשונות חיוורות. … בירוק — רגל הכבש מגיעה במודל עד הבניין שמדרומה, ולכן הוא יורד מצדו המערבי של הכבש, סמוך לרגלו, ופניו אל ההיכל, והשורות נמנות משפת הכבש. … במעלות האולם לשיטת הרמב״ם — שתי מעלות לשורה.`
- WHAT: "מאיפה" is spoken Hebrew; "הרביעית חזקה" (strong what?); "ולכן הוא יורד" — who? (the High Priest is not mentioned in the paragraph); "הבניין שמדרומה" — which building?; "במעלות האולם לשיטת הרמב״ם — שתי מעלות לשורה" is a note of the builder. In the same card the same commentary is called once "יכין" (`״על השורה הד׳…״ (יכין)`) and once "תפארת ישראל" (`ולתפארת ישראל — את המחתה…`); a reader may take them for two books (so also «לשכת החותמות»: "ליכין", and «מנורות של זהב»: "תפארת ישראל (סוכה ה)" with the source chips "יכין סוכה ה, ז").
- FIX: `בקצרה — מהיכן מונים (במודל — שלושה צבעים):`; «במודל: לכל אחת משלוש הדעות מסומנות ארבע שורות של אבני הרצפה — שלוש הראשונות בצבע חיוור, והרביעית בצבע חזק. על הרביעית שבכחול ועל הרביעית שבכתום עומד כהן, והמזרק בידו; על הרביעית שבירוק מונחת המחתה, ובה גחלים. בירוק: רגל הכבש מגיעה במודל עד הבניין שבדרום העזרה, ואין לפניה מקום לארבע שורות; לכן מצויר שהכהן הגדול יורד מצדו המערבי של הכבש, סמוך לרגלו, ופניו אל ההיכל, והשורות נמנות משפת הכבש. רוחב כל שורה (אמה), אורך השורות ומקום תחילת המניין בירוק — בחירת מודל. כשבוחרים במתג ״מעלות האולם״ את שיטת הרמב״ם, כל שורה שבאולם תופסת שתי מעלות.» And one name for the commentary in every card: «תפארת ישראל (יכין)».
- OWNER: no.

### U-12 — MED — «צורת התאים»: two option names say nothing, "לא מאומת" instead of "בחירת מודל", and one sentence in code
- WHERE: b2 SHITOT «צורת התאים», the new option names `ר״י — אי נמי`, `ר״י — עוד` (and `ר״י בתוספות`, `הרמב״ם`); card «ר״י — עוד»: `שתי הקומות העליונות — לא מאומת, ר״י לא פירש אותן.` and `…והתאים שבע ושמונה — לא מאומת: ר״י לא פירש אותן.`; card «רש״י והר״ש»: `האמה השבע עשרה שבמשנה (ד, ז) — בכותל התא החיצון, שש אמות (בחירת מודל).`; all eight: `(במודגש — מה שאינו כמספרי המשנה כפשוטם, ובציור על לוחית אדומה.)`.
- WHAT: (1) "אי נמי" and "עוד" are the opening words of two paragraphs of the Tosafot; as names of buttons they tell the user nothing about the shape ("מה חדש" promises "שמות קצרים, ובכל כרטיס — קודם כול במה השיטה שונה"). (2) "לא מאומת" — not verified by whom? What has no source is called "בחירת מודל" (rule 2). (3) "האמה השבע עשרה שבמשנה" cannot be understood without doing the builder's sum. (4) The default option is named «הרמב״ם», its key in the code is `raavad`, and its "במודל" paragraph ends "כלשון הראב״ד"; the Rambam's own words in the card (`כל אלו המקומות הפנויים…`) give no measure. (5) "ובציור" — everywhere else "במודל".
- FIX: names — «ר״י, פירוש ראשון — כותל ההיכל שבע למטה», «ר״י, פירוש שני — חצי אמה מכל כותל», «ר״י, פירוש שלישי — התא התחתון שש»; and the default «הרמב״ם והראב״ד — התחתונה כנגד האוטם». Card «ר״י — עוד»: «שתי הקומות העליונות אינן מפורשות בדברי ר״י; מה שמצויר בהן — בחירת מודל.» Card «רש״י והר״ש»: «במשנה (ד, ז) כותל התא, התא וכותל ההיכל הם יחד שבע עשרה אמה. בשיטה זו התא התחתון חמש בלבד, והאמה החסרה ניתנה במודל לכותל התא החיצון — שש אמות במקום חמש (בחירת מודל).» The bracket: «(המספרים המודגשים — מה שאינו כמספרי המשנה כפשוטם; במודל הם כתובים על לוחית אדומה.)»
- OWNER: yes for (4) (the name of the default option is an attribution).

### U-13 — MED — «צפון לשחיטת קדשי קדשים»: the default card has no key to its colours, and two option names are cryptic
- WHERE: b2 SHITOT «צפון לשחיטת קדשי קדשים»: option names `רבי — אף דריסת רגלי הכהנים וישראל; הגבול כרש״י` (default) and `רבי — הגבול כרמב״ם: עד קו כותל המזבח`; default card: `במודל (ברירת המחדל): ירוק, כחול וכתום — שלושתם יחד; והגבול הדרומי של הכחול והכתום — אמצע העזרה…`; option 2: `רש״י: ״…״; ובמקום אחר: ״מחצי פתח ההיכל ולצפון בין האולם למזבח״`.
- WHAT: the user who opens the row sees the default first, and its card speaks of "ירוק, כחול וכתום" without saying what each colour is (green is explained only in option 1, blue only in option 2, orange nowhere; red — "מן החליפות ולפנים" — only in option 1). "הגבול כרש״י" — which border? (the southern border of "north" — the news line says so, the name does not). "ובמקום אחר" — where?
- FIX: names «רבי — אף מקום דריסת רגלי הכהנים וישראל (הגבול הדרומי כרש״י: אמצע העזרה)» and «רבי, והגבול הדרומי כרמב״ם: קו כותל המזבח הצפוני». In the cards of options 3 and 4: «במודל (ברירת המחדל): בירוק — כנגד המזבח (רבי יוסי ברבי יהודה); בכחול — בין האולם ולמזבח (תוספת רבי אלעזר ברבי שמעון); בכתום — מקום דריסת רגלי הכהנים ומקום דריסת רגלי ישראל (תוספת רבי); באדום — ״מן החליפות ולפנים״, שבו ״הכל מודים שפסול״. הגבול הדרומי של הכחול ושל הכתום — אמצע העזרה, כלשון רש״י (״מחצי פתח ההיכל ולצפון״); הגבול לשיטת הרמב״ם — באפשרות הבאה. הצבעים — בחירת מודל.» In option 2 give the place of the second Rashi instead of "ובמקום אחר".
- OWNER: no.

### U-14 — LOW/MED — «כבשים קטנים» (four cards): one paragraph of some 1,000 letters that cannot be followed
- WHERE: b2 PLACES «כבשים קטנים — רש"י», «כבשים קטנים — תוספות»; SHITOT «הכבשים הקטנים» (both options): `במודל (מ־2.0.2): הכבש לסובב — ולתוספות שני הכבשים לסובב — יוצא מצד הכבש הגדול בשליש התחתון שלו, ״בשפולו של כבש״, וראשו שם בגובה הילוכו של הכבש הגדול; משם הוא פונה באלכסון ועולה במתינות, ובינו ובין הכבש הגדול אוויר גמור עד הרצפה; וראשו חתוך לאורך שפת הסובב ובגובהו — הסובב נמשך לתוכו — ״ומובדלין מן המזבח מלא נימא״. … לתוספות, הכבש ליסוד צמוד לכבש השלישי מבחוץ… ; הכבש ליסוד הולך באלכסון מצלעו המערבית של הכבש הגדול… אפשרות שלא צוירה: כבש ליסוד צמוד לכבש הגדול — אינה מוכרחת מן המקורות, ואין לה דרך להגיע לאמת היסוד.`
- WHAT: "ראשו" is used for both ends of the small ramp; "הסובב נמשך לתוכו" next to "ומובדלין מן המזבח מלא נימא" reads as a contradiction; two consecutive sentences describe "הכבש ליסוד" differently without saying that the first is the Tosafot's and the second Rashi's; the title of the place has a straight quote (`רש"י`) where every other title has ״.
- FIX (to be checked by the builder against the drawing): «במודל: הכבש הקטן העולה לסובב — ולתוספות שני הכבשים העולים לסובב — יוצא מצד הכבש הגדול בשליש התחתון שלו, ״בשפולו של כבש״. בתחילתו הוא צמוד לכבש הגדול ובגובהו; משם הוא פונה ממנו באלכסון ועולה במתינות אל הסובב, ובינו לבין הכבש הגדול רווח פתוח עד הרצפה. קצהו העליון מגיע אל שפת הסובב ובגובהה, ואינו נוגע במזבח — ״ומובדלין מן המזבח מלא נימא״. הכבש הקטן היורד ליסוד: לרש״י הוא יוצא מצלעו המערבית של הכבש הגדול והולך באלכסון אל אמת היסוד שבקרן דרומית־מערבית (מידות ג, א: ״ואוכל בדרום אמה אחת״), כציור התוספות יום טוב והתפארת ישראל; ולתוספות הוא צמוד מבחוץ לכבש השלישי, לכל אורכו — כבש אחד רחב, שמקצתו מוגבה עד הסובב (תוספות יום טוב זבחים ו, ג). כבש ליסוד הצמוד לכל אורכו לכבש הגדול לא צויר: אין לו הכרח במקורות, ואין לו דרך להגיע אל אמת היסוד. מידת הנטייה ורוחב הכבשים — בחירת מודל.» Title: «כבשים קטנים — רש״י».
- OWNER: no.

### U-15 — LOW — small wording points in the new b2 cards (each with its fix)
1. «לשכת אבני המזבח — בבית המוקד»: `לקריאת הרא״ש בשערי בית המוקד הלשכה עומדת שש אמות וחצי מערבה, שהשער לחיל נפתח במקומה.` — both options of the row «שערי בית המוקד» are the Rosh's (first and second explanation), so "לקריאת הרא״ש" does not say which. → «כשבוחרים במתג ״שערי בית המוקד״ את הפירוש השני של הרא״ש (״סמוכים זה לזה״), הלשכה עומדת שש אמות וחצי מערבה, כי השער הפתוח לחיל עומד במקומה.»
2. Same card: `אבני המזבח (מידות ג, ד): ״ומביאים משם אבנים שלמות…״` — "משם"? → «אבני המזבח (מידות ג, ד) — מבקעת בית כרם: ״ומביאים משם אבנים שלמות, שלא הונף עליהן ברזל…״».
3. «פשפשי ההיכל»: `המתג של הדרך האחרת מראה את שלה.` → «כשבוחרים במתג את הדרך האחרת, ההליכה נעשית בה.»
4. «בית המוקד» and «הממונים»: `השער שלחיל`, `שער בית המוקד שלחיל` → «השער הפתוח לחיל».
5. «קירוי הר הבית» / «לחם שמים»: `על טבעות של עמודים — טבעת לפנים מטבעת` — in the Temple "הטבעות" are the rings of the slaughter-place. → «על שורות עמודים המקיפות את ההר, שורה לפנים משורה».
6. «חלקי יהודה ובנימין»: `(וצדו המזרחי של הר הבית — בתווית)` → «(צדו המזרחי של הר הבית אינו צבוע, והוא מסומן בתווית בלבד)»; `שתי עמודות זהב` — to be seen in the render (U-41).
7. «לשכות כלי השיר»: the Mishnah is quoted with nikud, every other card without; `ברצפת עזרת הנשים, ופתחן הרחב אליה` → «בגובה רצפת עזרת הנשים, ופתחן הרחב פונה אליה».
8. «עולים במזרח ויורדים במערב — הכבש»: the card writes `חיצים`, "מה חדש" writes `חצים` → one spelling («חיצים»).
9. «מנורות של זהב»: `בבחירת מקום זה רצה הדגמה` → «כשבוחרים במקום זה בתפריט, מתחילה הדגמה»; the title does not say that it is a demonstration, as the other demonstrations' titles do («… — הדגמה»).
10. The four chambers of Beit HaMoked: «לשכת הטלאים — בבית המוקד», «לשכת החותמות — בבית המוקד», «לשכת אבני המזבח — בבית המוקד», «הירידה לבית הטבילה — בבית המוקד», but «לשכת עושי לחם הפנים» without "— בבית המוקד". → add it. (The menu now lists FIVE entries "בבית המוקד" for four chambers; the cards explain it, the menu does not — consider «לשכת החותמות — בבית המוקד (שמה במשנת תמיד)».)
11. «צורת לחם הפנים» / «רבי יוחנן» (the default): the card does not mention that the Rambam wrote "כל חלה מהן מרובעת" (it is only in the other option's card) → add «ועל פסק הרמב״ם — ראה באפשרות ״רבי חנינא״.»
12. «הסורג — שלוש עשרה הפרצות» sits in "שיטות ומחלוקות" although it is not a dispute but two times (before and after "חזרו וגדרום") — the card says so clearly; no change needed, noted only.
- OWNER: no.

### U-16 — LOW — names and spelling that differ between the two houses, the menu and "מה חדש"
- «בית המטבחיים» (b2 place, its 3D label, both "מה חדש" lists) / «בית המטבחים» (b2 row «בית המטבחים — העמודים והאונקליות»; in b1 the place, the row and the labels — everywhere). The Mishnah: "בית המטבחים".
- «שולחן לחם הפנים», «חומר המנורה והשולחן», the new options «…והשולחנות לפניה» / «שלחן החלבים — שני השלחנות שבמערב הכבש», «שלחנות האולם — שיש וזהב» (b2 places); b1: «שולחנות האולם».
- «כסא שלמה», «עליית המלך לכסא» (b1 menu) / «העלייה לכיסא שלמה» ("מה חדש" and the store description).
- «הרובובה» ("מה חדש" of b1) / «הרבובה» (the b1 card) / «רבובה» (label).
- «צורת לחם הפנים» (b1 row) / «צורת לחם הפנים — ספינה רוקדת או תיבה פרוצה» (b2 row).
- «הפיסות» (label `3 · הפיסות`, the card's list of places) / «הפייסות» (the same card, the place «ארבעת הפייסות»); «הקינין» (label) / «הקנין» (the Mishnah quoted in the card).
- «לשכת שמנים» (b2 place) / «לשכת השמנים» (the 2.0.1 list).
- FIX: in titles and running text write «בית המטבחיים», «שולחן», «כיסא» (or «כסא» — but one), «הרבובה», «הפייסות»; inside quotations keep the book's spelling.
- OWNER: no.


## "מה חדש" — the list of this release (`תיאור העדכון 2.0.11.txt` = `UI_NEWS` of both builds; verified identical: b1 14 lines, b2 27 lines)

### U-17 — HIGH — b1 "מה חדש", line «מידות המזבח»: the numbers are the Second Temple's, not this model's
- WHERE: `תיאור העדכון 2.0.11.txt`, "בבית ראשון (1.4.4)", line 5 (= `b1/src/70-ui.js:877`): `**מידות המזבח** — לכל מידה (32, 30, 28, 26 ו־24 אמה) קו בצבע משלו, ולוחית אחת בצד המזבח שאומרת מהי.`
- WHAT: in the First Temple model there is no line of 32 or of 30. The lines are 24, 22 and 20 amot (the default, "כדברי הימים": `chronicles: { w: [YO, MID, S] }` — the yesod 24, the wall up to the sovev 22, the body 20) or 28, 26, 24, 22, 20 (the option "רבי יוסי — המזבח הראשון": `yose: { w: [28, 26, 24, 22, 20] }`). The sentence was copied from the b2 list. A teacher who reads "32 אמה" about Solomon's altar ("עשרים אמה ארכו") stops there.
- EVIDENCE: `cand/b1/src/40-altar.js:432` (`const YT = 24, YM = 26, YY = 28`), `:1080-1101` (the two readings and their comment: "chronicles - the yesod 24, the wall up to the sovev 22, the body 20 … yose - 28, 26, 24, 22 … and 20"). In the running model: see U-44.
- FIX: «**מידות המזבח** — לכל מידה קו בצבע משלו, ולצד המזבח לוחית לכל קו: 24, 22 ו־20 אמה כדברי הימים, או 28 עד 20 לרבי יוסי — לפי המתג ״מידות המזבח״. המבט מן הצד, מתוך העזרה, כדי שייראו הכניסות שבין מדרגה למדרגה. בתפריט: ״מידות המזבח — קווי האמות״.»
- OWNER: no.

### U-18 — MED — "מה חדש" (both lists): the same sentence «ולוחית אחת בצד המזבח שאומרת מהי» reads as ONE sign; the cards say a sign for each line
- WHERE: b2 line «המזבח», b1 line «מידות המזבח»: `לכל מידה … קו בצבע משלו, ולוחית אחת בצד המזבח שאומרת מהי.` The cards: b2 «מידות המזבח…» `ליד המזבח חמש לוחיות, אחת לכל קו`; b1 `ולצד המזבח לוחית לכל קו במסגרת בצבעו`.
- FIX: «…לכל מידה קו בצבע משלו, ולצד המזבח לוחית לכל קו, במסגרת בצבעו.»
- OWNER: no.

### U-19 — MED — the list is too long to be read where it is shown, and it cannot be opened again
- WHERE: the window "מה חדש בתוסף" of b2 as it opens by itself at the first run (my harness copy with the boot version = the manifest's and without the "seen" key; 1280×800).
- WHAT: (1) 27 lines, 6,557 letters (about 1,200 words) in a box 430 px wide, 12.5 px type: **3.4 screens of scrolling** (`scrollHeight 2378 / clientHeight 702`). The first screen shows 5 of the 27 lines. (2) The only button, "סגירה", is at the very end of the list (`closeBtnVisibleAtStart: false`, its top at 2388 px); there is no ✕ at the top and almost no scrollbar (2 px). A user who does not know that a click outside or Esc closes the window must scroll through everything. (3) Enter also closes it — and Enter is the new key of this very release. (4) Once it was closed, the list cannot be seen again: `news-after-close → { topbarNewsBtn: false, anywhere: [] }` — the top-bar button "מה חדש" is removed the moment the window shows (`markSeen`), so one accidental click or key loses the whole list. (5) Five lines are word for word the same in both houses, so the user of the unified plugin reads them twice.
- EVIDENCE: `/home/claude/qa/r211/rev_U/out/b2a/news_0.png`, `news_1.png`, `b2n/news_end.png`; `out/b2a/log.json` (step `news`), `out/b2n/log.json`; `b2/src/70-ui.js:6033-6037` (markSeen removes `#tm-news-btn`), `:6096` (Enter closes).
- FIX: (a) the shorter lists below (b2: 17 lines, about half the length; b1: 10 lines); (b) "סגירה" (or ✕) fixed at the top of the window, or the button row kept visible (`position: sticky; bottom: 0`); (c) a permanent way back to the list — a line "מה חדש בגרסה זו" at the end of the side menu, next to the version number; (d) wider box on a wide window (e.g. `min(640px, 92vw)`) and 13.5–14 px type.
- OWNER: yes for (c) (the removal of the button after the first view was the owner's own request in 1.1.0).

### U-20 — MED — "מה חדש": lines that do not say where the thing is, or call a toggle by a name it does not have
- b2 «בית המטבחיים — ארבע שיטות — המתג שעל העמודים והשולחנות…» — the toggle's name is «בית המטבחים — העמודים והאונקליות» (b1: «בית המטבחים»); one who looks for "ארבע שיטות" or "העמודים והשולחנות" in the table does not find it.
- b2 «יום הכיפורים — ארבעה מקומות חדשים…» — there is no category "יום הכיפורים": three of the places are under «ההיכל ופנים» and one («שלוש המחתות») under «מזבח וכלים»; the line does not say so.
- b2 «הממונים שבמקדש», «המזבח», «הנברשת של הילני», «מזוזה», «צורת התאים», b1 «המלך בלבוש מלכות», «המכונות», «מידות המזבח» — no place named at all (the king: the place «עליית המלך לכסא»; the news writes "כיסא").
- b2 «צפון…», «צורת לחם הפנים»: `מתג חדש בטבלת ״שיטות ומחלוקות״` — on the screen it is a section of the side menu, «שיטות ומחלוקות — בחירת הקריאה»; the 2.0.1 list called it "בקטגוריה ״שיטות ומחלוקות״". One name: «בתפריט, תחת ״שיטות ומחלוקות״».
- b1 line 4 `הסבר על הרובובה` — the card and the label write "הרבובה".
- b2 line 4 `ובריצפה` — everywhere else in the same list "רצפת", "רצפה".

### U-21 — MED — "מה חדש": sentences that an outsider cannot follow, or that say more than the model does
1. b2 «שלוש תקלות ישנות בהדגמות — תוקנו» — the body tells the three faults in the past tense with no word that they are gone (`בפייס הראשון כסדר אביי שקעו הכהנים ברצפה…; ההתכנסות… נעשתה בחצר שלפני לשכת הגזית, ולא בתוכה; …נשמטו שני המבטים הקרובים…`), and then goes on in the present tense with something that is new (`ובהדגמת הפשפשים — כהן שלם פותח…`). In the window the bold heading is far from the end of the paragraph; read alone, the line says that the priests sink into the floor. "כסדר אביי", "שני המבטים הקרובים", "כהן שלם" — builder's words.
2. b2 «הממונים שבמקדש»: `צבע הלוחית — לפי השבט: כהן, לוי או ישראל, לפי המקורות.` — the card itself says that two (בן אחיה, פנחס) are drawn as kohanim by "בחירת מודל", and that for four the tribe "לא נתפרש" (a fourth colour, blue). "לפי המקורות" for all fifteen is more than is true.
3. b2 «המזבח»: `ראש הכבש בנוי מול קומות המזבח, והאוויר שבינו לבין המזבח — לפי השיטות.` — which "שיטות"? (the toggle «הרווח שבין הכבש למזבח»); "בנוי מול קומות המזבח" is not understandable.
4. b2 «סדר עבודת הבוקר — נוסף להדגמה»: one sentence of 103 words with eight semicolons and seven bracketed references; `המערכה השלישית, לקיום האש — לרמב״ם` — "לרמב״ם" against whom? (in the table the three pyres are «רבי יוסי — שלוש», the default).
5. b2 «לשכות מלאות — אנשים וכלים»: 95 words, ten chambers in one sentence. "לשכות מלאות" (also in the store note) — full of what?
6. both «הכבש והכבשים הקטנים»: `הכבש הקטן יוצא עכשיו מן הכבש הגדול עצמו` — there are two small ramps (three for the Tosafot); which one? And the cards say that the small ramps come out of the great ramp's body since 1.3.0 — what is new is the way it leaves it.
7. both «מבטים וכפתורים»: `תוקנו מבטים שבהם העין נכנסה לתוך קיר… וקירוי שנפתח לצורך מבט אינו נסגר עוד באמצע ההסתכלות` — "העין", "קירוי שנפתח לצורך מבט".
8. both «ניווט נוח יותר»: `ו־Shift עם Enter מחזיר` — the help page says "מתרחק" (the code: the distance is doubled); "מחזיר" promises a return to the former view.
9. both «הדמויות»: `הלויים לבושים בבגדיהם` — in whose clothes?
10. both «גוון אבן עתיקה»: `תיבת סימון חדשה… (דולקת כברירת מחדל)` — "תיבת סימון" and "ברירת מחדל" are computer words (the list is otherwise written for a teacher).
11. The store note (147 letters): `…צפון לשחיטה, … לשכות מלאות. בית ראשון: המלך. בשניהם: לחם הפנים, צורת ההר.` — a list of nouns; "צפון לשחיטה", "לשכות מלאות" and "בית ראשון: המלך" mean nothing to one who did not see the work.
- FIX: the full texts below.

### PROPOSED TEXT — the store note (141 letters)
«נוספו בבית שני: לשכות כלי השיר, חלקי יהודה ובנימין, הכהן הגדול ביום הכיפורים, שמחת בית השואבה ואנשים בלשכות; ובבית ראשון — המלך העולה לכיסאו.»

### PROPOSED TEXT — "מה חדש" of בית שני 2.0.2 (17 lines instead of 27; the bold openings as in the app)
• **לשכות כלי השיר** — שתי לשכות חדשות תחת עזרת ישראל, פתוחות לעזרת הנשים, ובהן כינורות, נבלים ומצלתיים (מידות ב, ו). לשכת פנחס המלביש ולשכת עושי חביתין עומדות עכשיו מעליהן. מקומן המדויק — בחירת מודל. בתפריט: ״לשכות״.
• **חלקי יהודה ובנימין** — רצפת העזרה צבועה לפי חלקי השבטים, יהודה בזהב ובנימין בכחול; ונראית הרצועה היוצאת מחלקו של יהודה, שבה המזבח בנוי (יומא יב.; זבחים נג:). עד היכן היא נמשכת בדרום — בחירת מודל. בתפריט: ״מזבח וכלים״.
• **צפון לשחיטת קדשי קדשים** — ״איזהו צפון״ (יומא לו.): דעות רבי יוסי ברבי יהודה, רבי אלעזר ברבי שמעון ורבי נצבעות על רצפת העזרה, כל אחת בצבעה; והגבול הדרומי — לרש״י ולרמב״ם. מתג חדש בתפריט, תחת ״שיטות ומחלוקות״.
• **יום הכיפורים** — הדגמה חדשה: ״הכהן הגדול נכנס בקטורת״ (יומא ה, א). מקומות חדשים: ״הרובד הרביעי״ ו״כני הזהב שבהיכל״ (תחת ״ההיכל ופנים״) ו״שלוש המחתות״ (תחת ״מזבח וכלים״). ושני מתגים: ״הפרוכות — שתיים או אחת״, ״כני הזהב — שניים או אחד״.
• **שמחת בית השואבה** — מנורות הזהב שבעזרת הנשים, גובהן חמישים אמה (סוכה נב:); ובהדגמה פרחי הכהונה עולים בסולמות, יוצקים שמן ומדליקים. מספר המנורות — בחירת מודל. בתפריט: ״שערי הר הבית וחצרות״, ״מנורות של זהב״.
• **בית המוקד** — הבית הורחב, וארבע לשכותיו נבנו מחדש. מקומות חדשים תחת ״לשכות״: ״לשכת עושי לחם הפנים״ (התנור, הדפוסים והחלות), ״לשכת החותמות״, ״לשכת אבני המזבח״ ו״הירידה לבית הטבילה״. וברצפה — טבלת השיש שתחתיה מפתחות העזרה (מידות א, ט).
• **אנשים וכלים בלשכות** — בלשכת המלח, הפרוה, המדיחין, בית אבטינס, פרהדרין, הנזירים, המצורעים, עושי חביתין ולשכת הכלים; ובלשכת פנחס המלביש — תשעים ושישה החלונות לבגדי הכהונה (רמב״ם כלי המקדש ח, ח–ט). מי שעובד בכל לשכה — כהן, לוי או ישראל — לפי המקור; ובאין מקור, כתוב בכרטיס ״בחירת מודל״.
• **הממונים שבמקדש** — חמישה עשר הממונים שבמשנה (שקלים ה, א) עומדים במקומות עבודתם, ולכל אחד לוחית ובה שמו ותפקידו. צבע הלוחית: כהן, לוי או ישראל — לפי המקורות; ומי ששבטו לא נתפרש — בכחול. בתפריט: ״לשכות״.
• **סדר עבודת הבוקר** — נוספו להדגמה: המפתח שמתחת לטבלת השיש (מידות א, ט); ״שלום, הכל שלום״; קידוש ידיים ורגליים (זבחים יט:); האברים שלא נתאכלו מבערב (תמיד ב, א); הצתת האליתא; המערכה השלישית; מקום הדשן שבמזרח הכבש; ושנים עשר לויים בכלי שיר על הדוכן.
• **מתגים חדשים** (בתפריט, תחת ״שיטות ומחלוקות״) — ״צורת לחם הפנים״: ספינה רוקדת או תיבה פרוצה (מנחות צד:); ״קירוי הר הבית״: רק האצטבאות שבצדדים, או ההר כולו; ״הסורג — שלוש עשרה הפרצות״; ״חביתי כהן גדול — אפייה וטיגון״ (מנחות נ:); ״לשכת עושי לחם הפנים — מה נעשה בה״.
• **בית המטבחיים — ארבע שיטות** — שיטת הראבי״ה ושיטת הגר״א הוצגו עד כה, בטעות, כשיטה אחת; עכשיו כל אחת לעצמה. במתג ״בית המטבחיים — העמודים והאונקליות״.
• **המזבח והכבש** — לכל מידה של המזבח (32, 30, 28, 26 ו־24 אמה) קו בצבע משלו, ולצדו לוחית; התפוח לשיטת הראב״ד צויר מחדש; הכבש הקטן העולה לסובב יוצא מצד הכבש הגדול; וחיצים על הכבש מראים היכן עולים והיכן יורדים (יומא ד, ה) — מקום חדש תחת ״מזבח וכלים״.
• **החיל** — נבנה מחדש כדברי הברטנורא: עשר אמות פנויות בגובה הר הבית, והמעלות בתוכו.
• **ועוד במודל** — נרות המנורה פונים אל הנר האמצעי (מנחות צח:); מזוזה בשער ניקנור ובלשכת פרהדרין (יומא י.–יא.); ניצוצות הנברשת של הילני בזריחת החמה (יומא לז:); פתחים ודלתות ללשכות עזרת הנשים לשיטת הרא״ש; ושמות קצרים לשמונה השיטות שב״צורת התאים״.
• **צורת ההר** — הקרקע שסביב הר הבית יורדת אל נחל קדרון שבמזרח, אל המדרון שבדרום ואל העמק שבמערב; וכבש הפרה נמשך מעליה על כיפין. העומקים והמרחקים — בחירת מודל.
• **נוח יותר** — קולות בהדגמות (לכיבוי: בתפריט, תחת ״תצוגה״); כרטיס ארוך נפתח בתחילתו, והכפתור ״המשך הכרטיס״ מראה את השאר; המקש Enter מקרב אל המקום שהסמן עומד עליו, ו־Shift עם Enter מרחיק; דף ״ניווט״ נכתב מחדש בלשון פשוטה; וגוון אבן עתיקה לחומות וללשכות (״תצוגה״).
• **תיקונים** — בהדגמות: הכהנים אינם שוקעים עוד ברצפה בפייס הראשון; ההתכנסות לפייס ולקריאת שמע היא עכשיו בתוך לשכת הגזית; בפתיחת השער הגדול נראים המפתח והבריח מקרוב; ובפשפשים פותח את המנעולים כהן, ולא יד לבדה. תוקנו מבטים שנכנסו לתוך קיר. לדמויות שיער ופאות; הלויים בבגדי חול, ולא בבגדי כהונה.

### PROPOSED TEXT — "מה חדש" of בית ראשון 1.4.4 (10 lines instead of 14)
• **המלך בלבוש מלכות** — בהדגמה ״עליית המלך לכסא״ עולה עכשיו המלך עצמו — בתכלת, בארגמן ובזהב, וכיפה לראשו — ולא צללית. בכל מעלה הוא נשען על הארי ועל הנשר המושיטים לו יד וכנף, כמתואר במדרשים. דמותו ולבושו — בחירת מודל.
• **צורת לחם הפנים** — מתג חדש בתפריט, תחת ״שיטות ומחלוקות״: ״כמין ספינה רוקדת״ (רבי יוחנן) או ״כמין תיבה פרוצה״ (רבי חנינא) — מנחות צד:. החלות שעל השולחנות משתנות לפי הבחירה.
• **נרות המנורות** — פי כל נר פונה אל הנר האמצעי, ופי הנר האמצעי למערב (מנחות צח: ורש״י).
• **הכבש** — הכבש הקטן העולה לסובב יוצא מצד הכבש הגדול. מקום חדש בתפריט, ״עולים במזרח ויורדים במערב — הכבש״: חיצים מראים את דרך העולים ואת דרך היורדים (יומא ד, ה). ובכרטיס ״הכבש״ — למה שימשה הרבובה.
• **מידות המזבח** — (the text of U-17).
• **בית המטבחים — ארבע שיטות** — שיטת הראבי״ה ושיטת הגר״א הוצגו עד כה, בטעות, כשיטה אחת; עכשיו כל אחת לעצמה, במתג ״בית המטבחים״.
• **המכונות** — אצל המכונות נראים כהן המדיח את קרבי העולה, וכהן המקדש ידיו ורגליו — יד ימין על רגל ימין (זבחים יט:). בתפריט: ״המכונות מקרוב״.
• **צורת ההר** — הקרקע שסביב הר הבית יורדת אל נחל קדרון שבמזרח ואל העמק שבמערב. העומקים והמרחקים — בחירת מודל.
• **נוח יותר** — (as in the b2 list).
• **תיקונים** — תוקנו מבטים שנכנסו לתוך קיר, וכפתור שעל המודל מופיע רק במקום שהוא שייך לו. לדמויות שיער ופאות; הלויים בבגדי חול, ולא בבגדי כהונה.


## The store description (`תיאור התוסף לחנות.txt`)

### U-22 — LOW/MED — the store description: mostly accurate and inviting; five places where it says a little more, or less, than the plugin
Checked against the running b2, the unified opening page (`cand/unified/plugin/index.html`) and the manifests. Search — exists (two fields: "חיפוש בכל הכפתורים…" and "חיפוש במשנה"/"מילה מן המשנה או מן הרמב״ם…"); print — exists (button "הדפסה", window "הדפסה או שמירה כ-PDF": "תמונת המבט ושם המקום; וכשהסבר פתוח — גם ההסבר ומקורותיו"); guided presentation — exists (button "מצגת": "לפי הנושאים", "רציפה", "סדר עבודת הבוקר — מסכת תמיד", "לפי סדר המשניות במסכת מידות"); book buttons — exist (manifest `reader.toolbar`, "בית המקדש — המקום במודל"); "דיווח" — exists; the credits (יוסי כהן, shalomke) — present. Nothing is promised that is missing. The points:
1. `מאות מקומות בתפריט` — the b2 menu has exactly 100 places (15+14+26+16+29; `out/b2n/ui.json`) and the b1 menu about 90 (the builder's own scan `qa/r211/av_b1_final.json`: 90 place buttons; b2 there: 99). Together about 190 — not "מאות". → «כמאתיים מקומות בתפריט».
2. `בכל כרטיס לשון המשנה, הגמרא, הרמב״ם והמפרשים` — not in every card (b1's cards are verses and their commentators). → «בכרטיסים — לשון המקורות עצמם».
3. `ומה שאין לו מקור — כתוב עליו במפורש ״בחירת מודל״` — true, but in every long card this very paragraph is now folded behind "המשך הכרטיס" (U-23); and the First Temple model completes a great deal from the Mishnah of the Second Temple (the ramp, בית המטבחים, לשכת הגזית, השיתין, the altar's yesod and sovev — marked "השלמה מן המשנה" in the menu), which the description's `בית ראשון — כפי שהוא מתואר במלכים ובדברי הימים` does not say.
4. `לחפש — מקום לפי שמו, או מילה מלשון המקורות` — the word search covers the verses (מלכים א, דברי הימים ב), Mishnah Middot and the Rambam's הלכות בית הבחירה only (the plugin's own notice says so).
5. Not mentioned, and worth a line: the button inside Otzaria's own search field; saving as PDF; that it works without the internet; sounds in the demonstrations.
Also: `להרב shalomke` (a user name with "הרב"); `העלייה לכיסא שלמה` (menu: "כסא"); the b1 manifest description writes `רש"י` with a straight quote, the others ״.

### PROPOSED TEXT — the store description
בית המקדש — מודל תלת־ממדי של שני בתי המקדש, בתוך אוצריא.

בתוסף שני בתים, ובוחרים ביניהם במסך הפתיחה:
• בית ראשון — כפי שהוא מתואר במלכים ובדברי הימים, כפירוש רש״י ושאר המפרשים. מה שלא נתפרש בפסוקים הושלם מן המשנה, ומסומן ״השלמה״.
• בית שני — לפי מסכת מידות, מפרשיה והרמב״ם (הלכות בית הבחירה).

מה אפשר לעשות בו:
• לסייר — להסתובב סביב כל מקום, להתקרב, להיכנס פנימה וללכת בגובה העיניים. כמאתיים מקומות בתפריט: השערים, העזרות, הלשכות, המזבח, ההיכל והכלים. לחיצה על שם מעבירה אל המקום ופותחת עליו כרטיס הסבר.
• ללמוד מן המקורות — בכרטיסים לשון המקורות עצמם: הפסוקים, המשנה, הגמרא, הרמב״ם והמפרשים. לחיצה על מקור פותחת את הספר באוצריא, במקומו. ומה שאין לו מקור — כתוב עליו במפורש ״בחירת מודל״.
• לראות את המחלוקות — עשרות מתגים בתפריט, תחת ״שיטות ומחלוקות״: בוחרים שיטה, והמודל משתנה לפיה. למשל: מקום המזבח ומידותיו, צורת התאים, שמות השערים והלשכות, צורת לחם הפנים, הפרוכות.
• לצפות בהדגמות — סדר עבודת הבוקר על פי מסכת תמיד, ארבעת הפייסות, פתיחת השער הגדול, כניסת הכהן הגדול בקטורת ביום הכיפורים, שמחת בית השואבה, המוכני של הכיור; ובבית ראשון — הכנסת הארון (״דבקו שערים״) ועליית המלך לכיסא שלמה. בהדגמות נשמעים גם קולות.
• מצגת מודרכת — סיור מסודר, שלב אחר שלב, למורה ולכיתה; בבית שני גם לפי סדר המשניות של מסכת מידות.
• לחפש — מקום לפי שמו; או מילה מן הפסוקים, ממסכת מידות או מהלכות בית הבחירה לרמב״ם — והמודל נפתח במקומה.
• להדפיס כרטיס הסבר עם תמונת המקום, או לשמור אותו כ־PDF.

התוסף מוסיף כפתור בספרים הנוגעים למקדש (מסכת מידות, הלכות בית הבחירה, מלכים ועוד), שפותח את המודל במקום שהספר עוסק בו. הוא עובד בלי אינטרנט.

מי שאין לו אוצריא יכול לצפות במודל גם בדפדפן, בקובץ אחד; הקישור בדף הבית של התוסף.

המודל נבנה בזהירות מן המקורות, ועדיין ייתכנו בו טעויות. הערות ותיקונים יתקבלו בברכה — בכפתור ״דיווח״ שבתוסף.

תודות: להרב יוסי כהן ול־shalomke, שבנו את המודל הראשון של בית שני; ולכל המעירים והמתקנים.


## The cards as shown, the fold button, the demonstrations, the help page

### U-23 — MED/HIGH — «המשך הכרטיס»: in every folded card the paragraph that is folded away is "במודל: … בחירת מודל"
- WHERE: both houses, `70-ui.js` `ui_fillRich(…, 1700)` (FOLD_211): a card of more than 1,700 letters shows its paragraphs until half of that is passed and hides the rest behind the button `המשך הכרטיס ▾`.
- WHAT: the cards are written in a fixed order — the Mishnah, "בקצרה", the commentators, and LAST "במודל: …" with the words "בחירת מודל". So the fold hides exactly the paragraph that tells the user what is drawn without a source (rule 2; and the store description promises "כתוב עליו במפורש ״בחירת מודל״"). A teacher who shows a chamber to his class sees the Mishnah and one commentator, and nothing says that the figures, the vessels and the place are the model's choice — unless he presses a small button whose name does not say what is behind it. In three cards the "בקצרה" paragraph (the dispute) is hidden too.
- EVIDENCE: a simulation of the code's rule over `cand/b2/content.json` (`work/U`, the script in my notes): 51 of the 242 cards of b2 are folded, and in all 51 every paragraph that opens "במודל" or contains "בחירת מודל" is in the hidden part — among them the new «מנורות של זהב — שמחת בית השואבה» (4 shown, 4 hidden) and «לשכת עושי לחם הפנים» (4 shown, 2 hidden), and «הממונים שבמקדש» (4 shown, 18 hidden), «בית המוקד», «לשכת פנחס המלביש», «לשכת עושי חביתין», «החיל», «הסורג», «שולחן לחם הפנים», «שער ניקנור». "בקצרה" hidden: INFO `shushanGate`, `ezratNashim`, «בגדי הכהנים». In the running model: U-40.
- FIX (any one): (a) when a card is folded, always show its last "במודל" paragraph under the button (fold the middle, not the end); or (b) move "במודל" up, to be the second paragraph of every card; and (c) let the button say what it hides: «המשך הכרטיס — עוד N פסקאות, ובהן ״במודל״ ▾». In "מה חדש": «כרטיס ארוך נפתח בתחילתו, והכפתור ״המשך הכרטיס״ מראה את השאר — ובו גם הפסקה ״במודל״».
- OWNER: yes (which of the three).

### U-24 — MED — the demonstration «הכהן הגדול נכנס בקטורת»: captions too short to read, and "הארון" in the Second Temple
- WHERE: b2 `50-heichal.js:3193-3207` (`C0`, `C_IN`, `C_OUT`, `CAPS`): two curtains — `9.3 s: ״עד שמגיע לבין שתי הפרכות המבדילות בין הקדש ובין קדש הקדשים, וביניהן אמה... החיצונה היתה פרופה מן הדרום, והפנימית מן הצפון״` (22 words) is replaced at 13.2 s — 3.9 seconds; `17.6 s: ״הגיע לצפון, הופך פניו לדרום, מהלך לשמאלו עם הפרכת עד שהוא מגיע לארון״` (13 words) — 2.8 seconds; `20.4 s: ״נותן את המחתה בין שני הבדים. צבר את הקטרת על גבי גחלים, ונתמלא כל הבית כלו עשן״` (16 words) — 3.8 seconds. One curtain: 16 words in 3.0 seconds (16.4–19.4 s).
- WHAT: (1) a pupil cannot read 22 words of Mishnah in under four seconds (the other captions stay 4–7 seconds). (2) The model is the Second Temple, its Holy of Holies shows "אבן השתייה", and the captions say "עד שהוא מגיע לארון" and "בין שני הבדים" — the Mishnah's own next words are «משנטל הארון, אבן היתה שם מימות נביאים ראשונים, ושתיה היתה נקראת, גבוהה מן הארץ שלש אצבעות, ועליה היה נותן» (יומא ה, ב; library book 55, line 39 — verified). A pupil learns from the demonstration that there was an ark in the Second Temple.
- FIX: lengthen the three captions to at least 6 seconds each (the walk can wait at the curtain), or split the long one in two; and replace the last two: «״הגיע לצפון, הופך פניו לדרום, מהלך לשמאלו עם הפרכת״ — עד מקום הארון» and «״משנטל הארון, אבן היתה שם… ושתיה היתה נקראת… ועליה היה נותן״ (יומא ה, ב). ״צבר את הקטרת על גבי גחלים, ונתמלא כל הבית כלו עשן״».
- OWNER: yes for (2).

### U-25 — MED — the help page ("ניווט"), both houses: one line does not match the button, one pair is shown in reverse, one instruction does not work as written
- WHERE: `70-ui.js` (b2 `:4536-4572`, b1 `:5236-5272`), as rendered: `out/b2n/help_0.png`, `help_end.png`, `help_crop_keys.png`.
1. `״↺ החזר הכל״ בתחתית הלוח — מחזיר את המבט הראשון ואת כל ההגדרות.` — the button is not in the side panel but in the row of buttons at the bottom of the screen (`nav.appendChild(resetAllBtn)`, `:5353`); it is hidden until something was opened on the model (`resetAllBtn.style.display = anyOn ? "inline-block" : "none"`, `:5826`; in my run it was not among the visible buttons); and it does not return "the first view and all the settings": it closes what the on-model buttons opened, the section and the walk mode (`:5675-5685`), and its own tooltip says so («מחזיר את המודל למצבו הרגיל: סוגר את כל מה שנפתח או הוסר בכפתורים שעל המודל…»). The chosen opinions stay. → «״↺ החזר הכל״ — מופיע בשורת הכפתורים שבתחתית המסך אחרי שפתחתם משהו במודל (גג, קיר, חתך). לחיצה עליו סוגרת את כל מה שנפתח. את השיטות שבחרתם הוא אינו משנה.»
2. `[[PageUp]] [[PageDown]] — לעלות ולרדת.` is drawn `PageDown  PageUp — לעלות ולרדת` (the two Latin key names form a left-to-right run inside the Hebrew line), so the reader pairs PageDown with "לעלות". → «[[PageUp]] — לעלות. [[PageDown]] — לרדת.»
3. `במחשב נייד (משטח מגע) — להסתובב: גרור אצבע אחת על המשטח.` — on a touchpad one finger only moves the pointer; the model turns when the pad's button is held (or after a double tap). → «להסתובב: לחץ על המשטח, החזק, וגרור את האצבע (או: הקש פעמיים, ובפעם השנייה השאר את האצבע וגרור).»
4. The page calls the side list "הלוח"; "מה חדש" and the store description call it "התפריט" (the menu button itself is only ✕/☰). One word — «התפריט».
5. Words a non-computer person may not know: "המחוון" («הפס שלידו»), "גרירה".
6. Not explained anywhere on the page (they have hover tips only): the top-bar buttons "מצגת", "הדפסה", "דיווח"; the bottom buttons ⟲ ⟳ 📏 and "טשטוש חומות: פועל" / "מרחק טשטוש 120 אמה" — the last two are the first thing a teacher asks about. → one more group: «״טשטוש חומות״ — חומה שמסתירה את מה שמביטים בו נעשית שקופה למחצה. ״מרחק טשטוש״ — עד איזה מרחק מן העין. 📏 — סרגל למדידה באמות. ״מצגת״ — סיור מודרך. ״הדפסה״ — הדפסת התמונה והכרטיס. ״דיווח״ — לשלוח הערה או תיקון.»
- The rest of the page is clear and matches: Enter / Shift + Enter (halves and doubles the distance to the point under the pointer, `90-entry.js:893-907`), the double click, the right button, the compass, "חתך", "מעבר דרך קירות" (a checkbox under "תצוגה" — present).
- OWNER: no.


## בית ראשון (b1 1.4.4) — the texts

### U-26 — HIGH — b1 card «עליית המלך לכסא»: the card opens "המלך מוצג… בלבוש מלכות" and ends "העלייה מוצגת בלי דמות המלך: רק רגל מכוסה"
- WHERE: `cand/b1/src/60-palace.js:3604` (`throneAscent`), shown as the card of the place «עליית המלך לכסא» (`70-ui.js:3424`; the code replaces only two other phrases, one of which — `בלי דמות המלך — מקומו ניכר ממה שהכסא עושה` — no longer exists in the text).
- WHAT: first paragraph (new): `(כפתור על הכסא; מ־1.4.4 המלך מוצג כדמות שלמה, בלבוש מלכות — תכלת, ארגמן וזהב — כיפה לראשו, ונשען בידיו על ידי החיות המושטות אליו … עד אז הוצג בצללית בלבד. דמותו ולבושו — בחירת מודל)`. Last paragraph (old, left in): `במודל: זמני העלייה והרעש, הגלגלים, הזוהר על המעלה, הצללית, אורך היד והכנף… — בחירת מודל. העלייה מוצגת בלי דמות המלך: רק רגל מכוסה עולה מעלה מעלה באמצע, וכל חיה נשארת במקומה…`. The card of the round's headline feature contradicts itself. In addition: "כדמות שלמה" reads as "the figure of Shlomo" (שלֹמֹה) and not "a whole figure" (שלֵמָה) — in a card about Shlomo's throne; "ונשען בידיו על ידי החיות" — "על ידי" reads "by means of"; the whole first paragraph is one bracket of 55 words; and a version number.
- EVIDENCE: the source lines above; in the running model: U-43.
- FIX: first paragraph — «עליית המלך לכסא (בכפתור שעל הכסא). המלך מצויר בדמות מלאה, בלבוש מלכות — תכלת, ארגמן וזהב — וכיפה לראשו. בכל מעלה הוא נשען בידיו על היד ועל הכנף שהחיות מושיטות לו: גופו נוטה מעט קדימה, ידיו נחות עליהן, ואחר כך הוא מזדקף. דמותו ולבושו — בחירת מודל.» Last paragraph — «במודל: זמני העלייה והרעש, הגלגלים, הזוהר על המעלה, אורך היד והכנף, צורת התנועות והבשמים, ומקום הארון ליד המושב — בחירת מודל. כל חיה נשארת במקומה, ורק ידה או כנפה נמשכת עד אמצע המעלה, ששם המלך נשען עליה. בעדי השקר נשמע רעש, והכפתור ״השתק את הרעש״ משתיק אותו.» The presentation's slide (`75-tour.js`): `ונשען על ידי החיות המושטות אליו` → «ונשען על היד ועל הכנף שהחיות מושיטות לו».
- OWNER: no.

### U-27 — LOW — b1: wording of the other new texts
1. Card «הכבש»: `**הרבובה — למה שימשה** (מ־1.4.4): …` and `כל זה נאמר על בית שני; לבית ראשון אין לה מקור מאומת.`; the label `רבובה — חלון בכבש (רמב״ם ב, יד; לבית ראשון לא מאומת)` → «**הרבובה — למה שימשה:** …», «כל זה נאמר על בית שני; על בית ראשון אין מקור.», label «…; בבית ראשון — בלי מקור)».
2. Card «הכבשים הקטנים — השלמה מן הגמרא»: `במודל (מ־1.4.4): …` (the same long sentence as b2, U-14) and `המזבח עשרים, ובצד הכבש הגדול נשארות רק שלוש אמות עד קרן המזבח, ולכן האלכסון קטן. כמה הוא נוטה, ורוחב הכבשים — בחירת המודל.` → «במודל זה גוף המזבח עשרים אמה; לכן נשארות בצד הכבש הגדול רק שלוש אמות עד קרן המזבח, והאלכסון קצר. מידת הנטייה ורוחב הכבשים — בחירת מודל.»
3. Card «מידות המזבח — קווי האמות»: `הקריאה נבחרת בשורה ״מידות המזבח״ שבטבלת השיטות (ובכרטיס זה).` → «בוחרים בין השיטות במתג ״מידות המזבח״ — בתפריט, תחת ״שיטות ומחלוקות״, וגם בסוף כרטיס זה.»
4. Card «שולחן משה מקרוב»: `(מנחות צד:; השורה 'צורת לחם הפנים')`, `לפי השורה 'צורת לחם הפנים'`, `(הלחם — לפי השורה 'הדלקת המנורות וסידור הלחם')` → «המתג».
5. Quotation marks: the new b1 cards quote with single marks ('…') — «עולים במזרח ויורדים במערב — הכבש», «הכבש», the two «צורת לחם הפנים» options, the two new «בית המטבחים» options — where the same texts in b2, and the b1 king and ark cards, use ״…״.
6. "מה חדש" of b1, line 2: `החלות שעל השולחן משתנות` — b1 has ten tables besides Moshe's → «שעל השולחנות».
- OWNER: no.

### U-28 — LOW — old texts met on the way (not from this round; listed because rule 7 counts every one)
1. b2 SHITOT «שער טדי — צורת האבנים» / «אבנים זקופות — לא מאומת»: `צורתן המדויקת לא נתפרשה — ״לא מאומת״ (לצייר ולציין).` — "(לצייר ולציין)" is an instruction of the dialogue left in the card. → delete the bracket.
2. b2 «בניין הורדוס» / «שיש בשלושה גוונים…»: `הספר אינו בספרייה, והדבר לא אומת` — "בספרייה" = the owner's library; → «הספר לא היה לפנינו».
3. b2, the foot of the side panel: `מה שאינו בפסוקים מסומן בהסברים ובלוח 'השלמות'; המחלוקות — בטבלת 'שיטות ומחלוקות'.` — copied from b1; b2 has no "השלמות" list and is not built on verses. → «מה שאין לו מקור מסומן בכרטיסים ״בחירת מודל״; המחלוקות — בתפריט, תחת ״שיטות ומחלוקות״.»
4. b2 «שער שושן», INFO `shushanGate`, «בניין הורדוס»: `(עד גרסה 2.0.3 …)` — see U-05.
5. b2 option names without a holder: «מקום המזבח בעזרה» / `רש״י` (no description, the three others have one); «נקבי ספלי הניסוך» / `ברטנורא`, `ראשונים`; «מעלות האולם» / `ברטנורא`, `תפארת ישראל`, `רמב״ם` (also: "רמב״ם" here, "הרמב״ם" in the other rows).
- OWNER: no.


## The running model (candidate builds; renders in `/home/claude/qa/r211/rev_U/out/`)

### U-40 — (evidence for U-23) the fold in the running b2 — and the button looks like one more source chip
- WHERE: b2, the place «מנורות של זהב — שמחת בית השואבה» opened through the menu (`out/b2b/p03_simcha.png`, `p03_more_crop.png`, `p03_simcha_x.png`; `out/b2b/log.json`).
- WHAT: the card shows 4 paragraphs (המשנה, בקצרה, הגמרא, רש״י) and hides 4: ברטנורא, תפארת ישראל, הרמב״ם and `במודל (מ־2.0.2): ארבע מנורות זהב… מספר המנורות אינו מפורש במשנה — בחירת מודל; וכן מקומן בעזרה, צורתן, והזרועות…` (log: `shown 4 hidden 4`, exactly as the simulation). On the screen stand four golden lamps fifty amot high, and nothing visible says that their number and shape are the model's choice. The button itself: a small outlined pill at the end of the text, the same shape, colour and size as the source chips of the "למקור:" row directly under it — it reads as one more source named "המשך הכרטיס". The text above it ends with a full stop, so nothing hints that half the card is missing. After a click the card needs scrolling (827 px of text in a 487 px body), which is expected.
- FIX: as U-23; and draw the button differently from the chips — full width of the card, filled, with the count: «▾ המשך הכרטיס — עוד 4 פסקאות, ובהן ״במודל״».
- SEVERITY: MED. OWNER: no.

### U-41 — MED — «חלקי יהודה ובנימין»: in the place's own view the strip is behind a wall and the four explaining labels cannot be read
- WHERE: b2, the place «חלקי יהודה ובנימין — הרצועה שבדרום המזבח» opened through the menu, 1280×800 (`out/b2b/p02_tribes.png`, enlarged `p02_crop.png`).
- WHAT: the eye stands outside the Azarah, south-east and above; the southern wall of the Azarah fills the lower half of the picture and covers the very thing the title names — "הרצועה שבדרום המזבח… עד כותל העזרה הדרומי". Of the colours one sees a blue field north of the altar, gold slabs standing along the altar's east side, and some gold floor near the fifteen steps. The four labels that explain the colours (`חלקו של יהודה — …`, `חלקו של בנימין — …`, `הרצועה — מחלקו של יהודה, בדרום המזבח ועד כותל העזרה (עד היכן — בחירת מודל)`, `״מזבח אוכל בחלקו של יהודה אמה״ — …`) are 14–19 px high and lost among some 150 other labels of the whole Temple that are on in this view; the large ones are cut by walls ("ית בית אבטינס", "שער ניק", "לשכת עוש", "הכבש"). A teacher who opens this place does not see what is Yehuda's, what is Binyamin's and where the strip is — he must read it from the card.
- FIX: a view from above (as the row «צפון לשחיטת קדשי קדשים» has: eye [72, 112, 40]), with the other labels switched off while this place shows, and the four labels larger; or three large words on the floor itself — «יהודה», «בנימין», «הרצועה».
- NOTE: rendered with the harness's single-frame draw; to be confirmed on the owner's screen, where the wall fade ("טשטוש חומות") may thin the wall. The card's `ובתוך המזבח שתי עמודות זהב` — on the screen they are thin upright gold slabs along the altar's sides, not "עמודות"; → «שתי רצועות זהב צרות — האמה שבמזרח והאמה שבדרום».
- OWNER: no.

### U-42 — LOW/MED — the demonstration of שמחת בית השואבה has no caption, and its two labels are too small to read
- WHERE: b2, «מנורות של זהב — שמחת בית השואבה» (`out/b2b/p03_simcha.png`, `p03_simcha_t13.png`; log: `overlays: []` during the demonstration).
- WHAT: every other demonstration explains itself with captions in the words of the Mishnah; this one runs silently — small white figures at the feet of fifty-amot ladders, then lights at the top. The two labels in the scene (`״ומנורות של זהב היו שם... וארבעה ספלים של זהב בראשיהן״ (סוכה ה, ב)`, `״גובהה של מנורה חמשים אמה״ (סוכה נב:)`) are a few pixels high in the place's view. The menu title does not say that choosing it starts a demonstration (U-15, 9).
- FIX: three captions from the Mishnah quoted in the card — «״וארבעה ילדים מפרחי כהנה ובידיהם כדים של שמן״», «״שהן מטילין לכל ספל וספל״», «״ולא היתה חצר בירושלים שאינה מאירה מאור בית השואבה״ (סוכה ה, ב–ג)»; and the two labels at twice the size.
- OWNER: no.


### U-45 — MED — the chips at the foot of a card do not say which dispute they switch; in «הרובד הרביעי» they read as three opinions about the rovad
- WHERE: both houses, `70-ui.js` `renderChips` (b2 `:1904-1916`): the name of the row is written before its chips only when the card carries more than one row (`if (rows.length > 1)`); with one row the card ends "שיטות:" and bare chips.
- WHAT: b2 «הרובד הרביעי — ביום הכיפורים» ends `שיטות: [ברטנורא] [תפארת ישראל] [רמב״ם]` (`out/b2b/p06_rovad.png`; log `ops: שיטות: ברטנוראתפארת ישראלרמב״ם`). These are the options of the row «מעלות האולם» — but the card has just listed three ways of counting the fourth rovad, in three colours, in the names of the יכין, the תוספות רי״ד, the תוספות יום טוב and the מאירי; the reader takes the three chips for the three ways (and wonders where the Rambam spoke of the rovad). The same in «לשכת החותמות» (`שיטות: [רש״י, רי״ד וריטב״א — בית המוקד בצפון־מזרח] [ברטנורא, מאירי, יכין והמפרש — החותמות בצפון־מזרח]` — here the names happen to explain themselves).
- FIX: always write the row's name before its chips — «מעלות האולם: [ברטנורא] [תפארת ישראל] [רמב״ם]»; and name the holders' options there («ברטנורא — …»).
- OWNER: no.

### U-46 — MED — «שלוש המחתות»: in the place's view each label stands beside the wrong firepan
- WHERE: b2, the place «שלוש המחתות — בכל יום וביום הכיפורים» opened through the menu (`out/b2b/p08_machtot.png`; eye [36, 21, 15] → [39.2, 16.2, 20]).
- WHAT: the three boxed labels are readable and well written (`בכל יום — של כסף, ארבעת קבין`, `בכל יום — של זהב, שלושת קבין`, `ביום הכיפורים — זהב אדום, ידה ארוכה`). But each floats above its pan, and from this eye a label above one pan lands beside the next pan behind it: "של כסף" stands next to the green-gold pan, "של זהב, שלושת קבין" next to the red pan with the long handle (the Yom Kippur one), and "ביום הכיפורים — זהב אדום, ידה ארוכה" next to the white marble slab with the ring that covers the shitin — which is not a firepan at all, and has a ring, as the Yom Kippur pan has. The silver pan in front has no label beside it. A pupil reads all three wrongly.
- FIX: lower each label to its own pan (or a short line from the label to the pan), or number the pans (1, 2, 3) on the floor and in the labels; and move the row away from the shitin's slab.
- OWNER: no.

### U-47 — LOW/MED — «עולים במזרח ויורדים במערב — הכבש»: one label of three can be read; the "arrows" do not show a direction
- WHERE: b2, the place opened through the menu (`out/b2b/p07_ramp.png`).
- WHAT: the blue label `״כהנים עולים במזרחו של כבש״` is clear. The gold one is cut by the edge of the window under the card (`״והיום כהן גדול עולה ב…`), and the orange `״ויורדין במערבו״` is not in the picture — the card lies over the western side of the ramp. The marks on the ramp are chevrons without a shaft; seen along the slope it is not clear which way each points, so without the labels "up" and "down" cannot be told.
- FIX: an eye a little higher and further east, so that the whole width of the ramp is to the right of the card; arrows with a shaft; the three labels one above the other at the foot of the ramp.
- OWNER: no.

### U-48 — LOW — smaller things seen in the renders of the new b2 places
1. «הרובד הרביעי» (`p06_rovad.png`): the card says "במודל — שלושה צבעים"; the place's view shows the blue and the orange only — the green rows (by the ramp) are behind the eye, and nothing says where to look. The boxed label `הרובד הרביעי — ״מפתח ההיכל ולחוץ״` lies over the label `שלחן השיש — לחם הפנים בכניסתו`. Half of the picture is the Ulam's steps. → add to the card: «הכחול והכתום — לפניך, באולם ולפניו; הירוק — ליד רגל הכבש, מאחוריך.» (or a second view for the green, as the presentation has: `tourThen`).
2. «לשכת עושי לחם הפנים» (`p04_lechem.png`): the label `תנור של מתכת — שתי חלות בבת אחת` is cut by the oven's rim ("ת — שתי חלות בבת אחת"), and `עשר חלות מוכנות, ושתיים בתנור` is under the card ("עשר חלות מוכנות, וש"). The text part of the card is 315 px high between the title and 17 source chips and two rows of opinions, so "המשך הכרטיס" is reached only by scrolling inside it (`inViewNoScroll: false`).
3. «לשכת החותמות» (`p05_chotamot.png`): clear — the four bowls with "עגל", "זכר", "גדי", "חוטא" and one readable label. The view is straight down, with no wall or door to tell which chamber it is.
4. «לשכות כלי השיר» (`p01_klishir.png`): clear and pleasant; the Levite stands with his back to the eye; no label in the picture (the label `לשכת כלי השיר — תחת עזרת ישראל…` is outside the view).
5. The bottom row of buttons gets the button «↺ החזר הכל» as soon as a place opens the chambers' roofs (`p04`, `p05`) — in the bottom row, not in the side panel (U-25, 1).
- OWNER: no.


### U-43 — (evidence for U-26, HIGH) b1 «עליית המלך לכסא» in the running model
- WHERE: b1 candidate, the place opened through the menu ("בית שלמה"): `out/b1a/k01_king.png`, `out/b1a/log.json`.
- WHAT: on the screen the king climbs in blue, crimson and gold, a kippah on his head (the picture matches "מה חדש"). The card (5,105 letters) shows three paragraphs and hides nine behind "המשך הכרטיס"; the first shown is `עליית המלך לכסא (כפתור על הכסא; מ־1.4.4 המלך מוצג כדמות שלמה, בלבוש מלכות…`, and among the hidden ones stands, word for word, `במודל: זמני העלייה והרעש, הגלגלים, הזוהר על המעלה, הצללית, אורך היד והכנף… — בחירת מודל. העלייה מוצגת בלי דמות המלך: רק רגל מכוסה עולה מעלה מעלה באמצע…`. So the old description of the model is still in the card, and it is the paragraph a user reaches when he presses "המשך הכרטיס" to find out what is the model's choice.
- Also seen: the card's second paragraph `בקצרה — השיטות בכרטיס זה (״כסא שלמה״; הפירוט — במתגים שבכרטיס ובטבלת ״שיטות ומחלוקות״)` — here "מתגים" and "טבלת" (U-06); two paragraphs both open "במודל:"; the pause bar reads "⏸ השהה · ⟲ מההתחלה · ■ עצור" (the help page mentions "המשך" and "עצור" only).
- FIX: U-26.


### U-49 — HIGH — pressing «המשך הכרטיס» stops the demonstration that is running
- WHERE: both houses, `90-entry.js` (b1 `:1231-1236`, b2 `:1240-1245`): `document.addEventListener("click", (ev) => { const t = ev.target.closest("button, input, select, [role='button'], .tm-op a"); if (!t || t.closest(".tm-pill, #tm-news, #tm-help, .tm-src, .tm-srcl, #tm-xcard .x, #tm-card .x, #tm-burger, #tm-dpause, #tm-tour-box")) return; ctx.shared.stopDemos(); }, true);` and the new button of this round, `70-ui.js:339-343` (`<button class="tm-more">המשך הכרטיס ▾`), which lives in `#tm-xcard .b` / `#tm-card .b`.
- WHAT: every press on a button stops the running demonstrations, except the buttons named in the list; of the card only its ✕ and ▾ (`#tm-xcard .x`) are in the list — the code's own comment gives the owner's rule: "closing a floating card, folding it, folding the panel - no command, the demonstration goes on". The new "המשך הכרטיס" is a button inside the card and is not in the list; the listener runs in the capture phase, so the button's own `stopPropagation()` does not help. Result: the user chooses «עליית המלך לכסא» (b1 — the headline of 1.4.4), the king begins to climb, the card opens folded (3 of 12 paragraphs); he presses "המשך הכרטיס" to read on — and the king vanishes and the throne returns to rest. In b2 the same happens with «פשפשי ההיכל» (the walk through the wicket starts when the place is chosen; the card is folded) — confirmed with a real mouse press, U-50 — and it must happen with every folded card that is open while a demonstration known to `stopDemos()` runs («ארבעת הפייסות ו״ברקאי״ — הדגמה», 3,284 letters; «המסיבה»; the cards opened during «סדר עבודת הבוקר»).
- EVIDENCE: the code above; b1 run `out/b1a`: `k01_king.png` (the king climbing; pills "עצור את העלייה" and "עדי שקר — הכסא מרעיש"; the bar "⏸ השהה ⟲ מההתחלה ■ עצור") → the script presses `.tm-more` → `k01_king_t14.png`: no king, no bar, the pill "עצור את העלייה" gone (log: `pills: [עדי שקר — הכסא מרעיש]`, `overlays: []`). A second check with a real mouse press in b2: U-50.
- FIX: add `.tm-more` (or the whole card body: `#tm-xcard .b, #tm-card .b`) to the list of the listener in both houses.
- OWNER: no.


### U-44 — (evidence for U-17, HIGH) b1 «מידות המזבח — קווי האמות» in the running model
- WHERE: b1 candidate, the place opened through the menu ("המזבח וכלי הנחושת"): `out/b1a/k02_midot.png`; the list as it shows in b1: `out/b1a/news_0.png`.
- WHAT: three lines and three signs — `24 אמה (הבסיס)` blue, `22 אמה (מעל היסוד)` green, `20 אמה (מעל הסובב)` pink — and a height post with `1 אמה`, `6 אמות`, `10 אמות`. No 32, 30, 28 or 26 (the b1 row «מידות המזבח» has the options «דברי הימים — עשרים על עשרים» and «רבי יוסי — עשרים ושמונה»). The "מה חדש" window of the same build says "לכל מידה (32, 30, 28, 26 ו־24 אמה)". The view itself is clear: the signs stand one above the other beside the altar, each rim in its line's colour, all readable. One label is cut by the window's edge (`— הטבעות (מדות ג, ה; ה, ב; תמיד ד, א)`).
- FIX: U-17.


### U-51 — MED — b1 "מה חדש", line «המכונות»: the two priests are seen only inside a demonstration, and the line does not say so
- WHERE: b1 "מה חדש" line 7: `**המכונות** — אצל המכונות נראים עכשיו כהן המדיח את קרבי העולה, וכהן המקדש ידיו ורגליו — יד ימין על רגל ימין (זבחים יט:).`
- WHAT: I opened «המכונות מקרוב» ("המזבח וכלי הנחושת"): ten lavers and no man (`out/b1a/k05_mechonot.png`). The figures stand "in the stops' own layers, so they show while the water runs" (`45-vessels.js:1329-1333`), that is, only while the demonstration of the on-model button «הבא את הכיור לקידוש ידים ורגלים ולהדחת העולה» runs (the card, hidden part: `במודל — ההדגמה (הכפתור שעל המכונה שבשורה הצפונית): היא עוצרת תחילה בין האולם למזבח…`). A user who reads the line and looks at the lavers finds nothing.
- FIX: «**המכונות** — בהדגמה ״הבא את הכיור לקידוש ידים ורגלים ולהדחת העולה״ (הכפתור שעל המכונה שבשורה הצפונית) נראים עכשיו כהן המקדש ידיו ורגליו — יד ימין על רגל ימין (זבחים יט:) — וכהן המדיח את קרבי העולה. הדמויות ומקומן — בחירת מודל.»
- OWNER: no.

### U-52 — LOW/MED — b1, what the sampled places show (five places and more)
1. «הכבש» (`out/b1a/k04_kevesh.png`, log): the card (3,126 letters) is folded exactly between a heading and its list — the last visible line is `בקצרה — השיטות בכרטיס זה (הפירוט — במתגים שבכרטיס ובטבלת ״שיטות ומחלוקות״):`, and the four bullets it announces are behind "המשך הכרטיס". The card also contains an empty paragraph (a blank line in the middle), and the new `הרבובה — למה שימשה (מ־1.4.4)`. In the picture the label of the רבובה is some 7 px high (unreadable), and at the top five labels lie on each other ("בית המטבחים — הטבעות…", "שלחנות השיש", "הננסין", "הים של שלמה", "מזבח הנחושת"). → the fold should never cut after a line that ends with a colon; the label of the רבובה larger while this place shows.
2. «המכונות מקרוב»: 4 paragraphs shown, 17 hidden — among the hidden ones all the "במודל" / "בחירות מודל" paragraphs (U-23 holds in b1 too: also «עליית המלך לכסא» 3/9, «הכבש» 7/10).
3. «עולים במזרח ויורדים במערב — הכבש» (`k03_ramp.png`): the three labels are in the picture; the orange `״ויורדין במערבו״` is much smaller than the other two; the chevrons do not show a direction (as U-47). In the menu the place is the LAST of 21 in "המזבח וכלי הנחושת", after «כלי הבית — סוף פרק ז», fifteen lines away from «הכבש» → put it right after «הכבש» (as in b2).
4. «מידות המזבח — קווי האמות» (`k02_midot.png`): clear (U-44). The chips at the foot: `שיטות: [דברי הימים: עשרים] [רבי יוסי: עשרים ושמונה]` — without the row's name (U-45).
5. «עליית המלך לכסא» (`k01_king.png`): the king's figure and dress as "מה חדש" describes; the plaque "לא ירבה לו נשים" and the label "כסא שלמה" readable; two on-model buttons reachable.
6. The row «צורת לחם הפנים» is the last of the 30 rows of b1's table (after «כסא שלמה»), far from «סידור השולחנות והמנורות» and «הדלקת המנורות וסידור הלחם» → move it next to them.
7. The same option has different names in the two houses: b1 «כציור הספר — חתיכת ארז על כל עמוד», b2 «ברטנורא — חתיכת ארז על כל עמוד».
- OWNER: no.


### U-53 — LOW — b1, two more things from the sample
1. «שולחן משה מקרוב — הלחם, הסניפין והקנים» (log `k06_table`): the block `בקצרה — השיטות בכרטיס זה (הפירוט — במתגים שבכרטיס ובטבלת ״שיטות ומחלוקות״):` with its three bullets (the third is the new `• צורת לחם הפנים: רבי יוחנן — כמין ספינה רוקדת (ברירת המחדל); רבי חנינא — כמין תיבה פרוצה.`) stands twice in the one card — once in the shown part and once in the hidden part (the card is two cards joined, and each gets the block); there is also an empty paragraph between them.
2. The same place with the two options of «צורת לחם הפנים» (`k06_table.png`, `k07_bread_box.png`): the toggle works and the loaves change, as "מה חדש" says. But in the default («ספינה רוקדת») the loaves are drawn in a dark wood-grain colour and look like wooden wedges; in «תיבה פרוצה» they have the colour of bread. One who compares the two thinks the first are not loaves. → the same bread colour in both.
3. «בית המטבחים» / «הגר״א» (`k08_gra.png`): clear, and as the card says — eight pillars in one row, a small table between each two, the long eighth table at the head of the row.
- OWNER: no.


### U-54 — MED — «סדר עבודת הבוקר»: the new moments are there, but two of them cannot be seen or read at the demonstration's own eye
- WHERE: b2 candidate, the presentation "סדר עבודת הבוקר — מסכת תמיד", order of Abaye, stages at fixed seconds (`out/b2d/d1_moked_7.png`, `d2_patrol_29.png`, `out/b2d/log.json`); the texts: `56-tamid-data.js`.
- WHAT (good): the banner at the left is clear — title, "שלב 1 מתוך 34", the Mishnah with nikud, a short explanation, the caption of the moment highlighted, and "→ הקודם · ▶ המשך · הבא ← · ✕ סיום" with "קצב". Captions are short phrases of the Mishnah and nearly all stay 4–10 seconds (all 34 stages checked from the data: 109 captions; the exceptions below).
- WHAT (to fix):
  1. «שתי כתות עם אבוקות», second 29–31: the two groups meet and say "״שלום״ — ״הכל שלום״". The eye is high above the dark court; the two priests are a few pixels tall, and the two speech labels some 8–10 px high (`d2_patrol_29.png`); the caption `אמרו שלום, הכל שלום` stays 2 seconds and the next one (`העמידו עושי חבתים לעשות חבתים`) 3. "מה חדש" announces this moment; a viewer will not notice it.
  2. Stage 1, «בלילה — בית המוקד»: the new sentence of the explanation — `ליד הלשכה הצפונית־מערבית, טבלת השיש שבריצפה, והמפתחות תלויים בשלשלת שתחתיה; הכהן שנעל ישן עליה, וכסותו עליה` — describes something that the top view does not let one pick out among the dark sleeping figures (no label, no mark on the slab). Also "שבריצפה" and, two lines above, "על הרצפה".
  3. Too short for their length (from the data): «המגרפה» `ובן לוי שהוא שומע את קולה, יודע שאחיו הלוים נכנסים לדבר בשיר, והוא רץ…` — 15 words in 4 seconds; «לשכת הגזית — קריאת שמע» `ברכו את העם שלש ברכות, אמת ויציב, ועבודה, וברכת כהנים` — 10 words in 4 seconds.
  4. The banner carries five rows of switches before the text («סדר», «נרות», «אבנט כהן הדיוט», «מצנפת כהן גדול», «אפוד») — two of them with bare names of holders («רש״י / רמב״ן», «רש״י / הרמב״ם»); a teacher who came to watch the morning service does not know what they change.
  5. The stage text of «המערכה השנייה»: `ולשיטת הרמב״ם (תמידין ב, ד) — גם המערכה השלישית… היא מוצגת כשבשורה "מניין המערכות" נבחרו שלוש מערכות או ארבע` — "בשורה" (U-06), and the third pyre is called here "שיטת הרמב״ם" while the table calls it «רבי יוסי — שלוש».
- FIX: 1 — for these five seconds bring the eye down, some fifteen amot from the meeting, labels twice as large, and give the two captions 4 seconds each; 2 — a label «טבלת השיש — המפתחות תחתיה» on the slab during this stage, and «שברצפה»; 3 — 6–7 seconds; 5 — «…וכן פסק הרמב״ם (תמידין ב, ד): גם מערכה שלישית, ״לקיים מצות האש״; היא מוצגת כשבמתג ״מניין המערכות״ נבחרו שלוש מערכות או ארבע.»
- OWNER: no.


### U-50 — (evidence for U-49, HIGH) a real mouse press on «המשך הכרטיס» in b2 stops the walk through the wicket; the Water-Drawing demonstration is outside the stop/pause mechanism altogether
- WHERE: b2 candidate, `out/b2g/log.json` (first five steps) and `out/b2d/log.json` (last six steps); `page.click('#tm-xcard .tm-more')` — a real pointer press, not a script call.
- WHAT: (1) «פשפשי ההיכל» chosen in the menu → running demonstrations `["walk", "hei-pish-demo"]`, the card folded → press on "המשך הכרטיס" → running demonstrations `[]`. The user who wanted to read the rest of the card lost the demonstration. (2) «מנורות של זהב — שמחת בית השואבה» → `simchaDemo.running() = true` → the same press → still `true`: this new demonstration is not registered in `ctx.shared.demoStops` (the list has `alt-mukhni-demo`, `walk`, `hei-mesibah-demo`, `hei-gate-demo`, `hei-pish-demo`, `hei-yk-entry`, the tamid and the payis — not the lamps). So it also has no pause bar ("⏸ השהה · ■ עצור" — none on the screen while it runs, log `overlays: []`), a press on the model does not pause it, and the help page's sentence "לחיצה על המודל בזמן הדגמה — עוצרת אותה" is not true of it.
- FIX: U-49; and register the lamps' demonstration in `demoStops` with `pause` / `resume`, as the others.
- OWNER: no.


### U-55 — LOW/MED — «הממונים שבמקדש» in the place's view: number and task, not the name; one sign under the card
- WHERE: b2 candidate, the place opened through the menu (`out/b2g/p11_memunim.png`).
- WHAT: a view from above with boxed signs — `1 · החותמות`, `7 · הכרוז`, `12 · לחם הפנים`, `5 · חולי מעיים`, `3 · הפיסות`, `6 · השיחין`, `4 · הקינין`, `11 · השיר`, `10 · הצלצל`, `8 · נעילת שערים`, `15 · המלבוש`, `9 · הפקיע`, `2 · הנסכים` — each rim in its colour, and the key at the top (`חמישה עשר הממונים — זהב: כהנים · אדום: לויים · ירוק: ישראל · כחול: לא נתפרש שבטם`) small but readable. Good as a map. But: the names of the officials (the second line, `יוחנן בן פנחס — על החותמות`) cannot be read at this distance, so "מה חדש"'s "כל אחד ושמו ותפקידו" is not what the place shows — a sign reads "5 · חולי מעיים" over a small figure; the sign of no. 14 is cut by the card at the left edge, and no. 13 is not in the picture; the usual labels of the whole Temple stay on behind the signs ("לשכת המצורע…", "שער ני…", "בית המטבחיים" under "6 · השיחין"). The card: 4 paragraphs shown, 18 hidden — the whole list "מי כהן, מי לוי ומי ישראל" and "בחירת מודל" for בן אחיה and פנחס are behind "המשך הכרטיס" (U-23).
- FIX: the name on the sign («1 · יוחנן בן פנחס — החותמות»), the other labels off while this place shows, the eye a little more to the east so that 13 and 14 are in the picture.
- OWNER: no.

### U-56 — (evidence for U-18) b2 «מידות המזבח» in the running model
- `out/b2g/p12_midot.png`: five lines and five signs, one above the other beside the altar — `24 אמה (מקום המערכה)`, `26 אמה (בין הקרנות)`, `28 אמה (מעל הסובב)`, `30 אמה (מעל היסוד)`, `32 אמה (הבסיס)` — each rim in the colour of its line; clear and readable from the side, as "מה חדש" says. Not "לוחית אחת".


### U-57 — LOW/MED — more of the new b2 places as rendered (labels)
1. «לשכת פנחס המלביש» (`out/b2g/p15_pinchas.png`): the wall of ninety-six niches is seen, each group with a name. Both labels of the place are cut: the new one loses its first words at the window's edge (`…עים חלון — ארבעה לכל משמר (רמב״ם כלי המקדש ח, ח–ט)`), and `בגדי כהונה — כתונת, מכנסים, אבנט ומגבעת` is cut at both ends by the walls. The eye looks down at a slant, and it takes a moment to understand what is wall and what is floor.
2. «לשכת עושי חביתין» (`p16_chavitin.png`): clear — `1 · אפייה` over the oven, `2 · טיגון במחבת` by the pan, the maker by the oven, as the card says. A stray tail of another label floats in the room: `(מידות ב, ו) |` (the end of the label of לשכת כלי השיר, which is under the floor).
3. «כני הזהב שבהיכל» (`p09_kanim.png`): clear and handsome — two stands, `כן הזהב — דם הפר`, `הכן השני — דם השעיר`. The labels float far above the stands, so which is which must be guessed (as U-46, milder).
4. «צפון לשחיטת קדשי קדשים», the default (`r01_tzafon_rebbi.png`): the best of the new views — green, blue, orange and a small red field, each with its outline, seen from above. The words written in the fields are too small to read at this distance, so the key to the colours must be in the card (U-13). The red field is drawn in this option too.
5. «מידות המזבח» (b2): the folded card hides `במודל: חמישה קווים…` (8 shown, 3 hidden).
- OWNER: no.

### U-58 — LOW/MED — «הסורג — שלוש עשרה הפרצות» chosen while «קירוי הר הבית» stands on «לחם שמים»: a column of the roof fills the view
- WHERE: b2 candidate, the row «קירוי הר הבית» → «לחם שמים — כל הר הבית מקורה», and then the row «הסורג — שלוש עשרה הפרצות» → «בימי מלכי יון — שלוש עשרה פרצות» (`out/b2g/r03_kiruy_all.png`, then `r04_soreg.png`).
- WHAT: the eye of the Soreg row (cam [82, 6, 94]) stands right behind one of the columns that the "whole Mount roofed" option adds; the white column covers the left 45 % of the picture, the breach is behind it (only the end post and a few fallen laths show), and the label is cut — `שלוש עשרה פרצות —` and no more. Each of the two rows alone is fine; together the new row shows nothing. (Seen in one render, in this order of presses.)
- FIX: when «לחם שמים» is on, no column within some ten amot of the fixed eyes of the places and rows; or move this eye two amot aside.
- OWNER: no.


## SUMMARY

Findings: 42 — 4 HIGH (U-17, U-23, U-26, U-49) · 22 MED · 8 LOW/MED · 8 LOW; plus five "evidence" entries that belong to them (U-40, U-43, U-44, U-50, U-56). The numbers U-29 to U-39 are not used.

HIGH
- U-49 (+U-50): pressing the new button «המשך הכרטיס» stops the demonstration that is running (b1: the king vanishes; b2: the walk through the wicket ends) — the button is missing from the list of presses that do not stop demonstrations.
- U-23 (+U-40): the fold hides, in every one of the 51 folded cards of b2 (and in the three b1 cards sampled), the paragraph "במודל … בחירת מודל"; the button looks like a source chip.
- U-26 (+U-43): b1 card «עליית המלך לכסא» opens "המלך מוצג… בלבוש מלכות" and still ends "העלייה מוצגת בלי דמות המלך: רק רגל מכוסה"; "כדמות שלמה" reads "the figure of Shlomo".
- U-17 (+U-44): b1 "מה חדש" says the altar's lines are 32, 30, 28, 26 and 24 amot; the First Temple model shows 24, 22, 20 (or 28…20).

MED (the main ones)
- U-19: the b2 list is 27 lines / 6,557 letters in a 430-px window — 3.4 screens; "סגירה" only at the very end; once closed it cannot be opened again.
- U-20, U-21, U-18, U-51: lines of "מה חדש" that do not say where, name a toggle wrongly («בית המטבחיים — ארבע שיטות» for «בית המטבחים — העמודים והאונקליות»), are told in the past tense as if the fault were still there, say "לוחית אחת" for five, or speak of priests at the lavers that are seen only inside a demonstration.
- U-01: the same paragraph twice in five new b2 cards. U-02: «הממונים»: "אינם מצוירים" and then "מצוירים".
- U-03, U-04, U-05, U-09: "לא מצאתי", "בעקבות ההערות", 65 version stamps (16 different numbers, one higher than the version on the screen), "כהן שלם".
- U-06: "מתג" / "שורה" / "הקריאה נבחרת בשורה" / "טבלת" / "קטגוריית" for one thing.
- U-10, U-11, U-12, U-13: cards whose "במודל" paragraph only the builder can follow (the High Priest's way; the fourth rovad; "ר״י — אי נמי", "לא מאומת", "האמה השבע עשרה"; the colours of "צפון" without a key).
- U-24: the Yom Kippur demonstration — 22 words of Mishnah in 3.9 seconds, and "הארון" / "בין שני הבדים" in the Second Temple.
- U-25: the help page — "↺ החזר הכל" described in the wrong place and with the wrong effect; "PageDown PageUp — לעלות ולרדת" drawn in reverse; the touch-pad instruction.
- U-41, U-45, U-46, U-54: in the place's own view — the tribes' strip behind a wall and its labels unreadable; chips that do not say which dispute they switch; each firepan label beside the wrong pan; "שלום — הכל שלום" a few pixels high for two seconds.

VERDICT — "מה חדש": true to the model in all but U-17 (and U-18, U-51 in wording), honest about "בחירת מודל" and about its own mistake (בית המטבחיים). But it is written as a builder's log: too long for its window, it quotes sources that belong in the cards, eleven lines give no place, and three use words of the work ("כסדר אביי", "כהן שלם", "העין"). Proposed: 17 lines (3,685 letters, 57 % of the present 6,512) for b2 and 10 lines for b1, each ending with where to press — full texts above, with a 141-letter store note.
VERDICT — the store description: accurate and pleasant; nothing promised that is missing (search, print, presentation, book buttons, report and credits all checked). Five small overstatements or omissions (U-22: "מאות מקומות" for about 190; "בכל כרטיס"; the First Temple's completions from the Mishnah; the scope of the word search; the button in Otzaria's search field). Full improved text above.

## VERIFIED (checked and found right)
- "מה חדש" = the lists built into the two candidates, word for word (b1 14 lines, b2 27 lines).
- b2 menu: «לשכות כלי השיר — תחת עזרת ישראל», the four chambers of Beit HaMoked and «הממונים» under "לשכות"; «חלקי יהודה ובנימין», «שלוש המחתות», «עולים במזרח ויורדים במערב — הכבש» under "מזבח וכלים"; «מנורות של זהב — שמחת בית השואבה» under "שערי הר הבית וחצרות"; «הרובד הרביעי», «כני הזהב שבהיכל», «הכהן הגדול נכנס בקטורת — הדגמה», «ניצוצות הנברשת בזריחת החמה» under "ההיכל ופנים" — as "מה חדש" says where it says.
- b2 table: the eight new rows exist under the names quoted in "מה חדש" («צפון לשחיטת קדשי קדשים» with four options; «קירוי הר הבית»; «הסורג — שלוש עשרה הפרצות»; «צורת לחם הפנים…»; «הפרוכות — שתיים או אחת»; «כני הזהב — שניים או אחד»; «לשכת עושי לחם הפנים — מה נעשה בה»; «חביתי כהן גדול — אפייה וטיגון»); «בית המטבחים…» has four options.
- b2 renders that match their cards and "מה חדש": לשכות כלי השיר; four golden lamps with four ladders each and the lighting; the bread chamber (oven, moulds, baker); the seals' bowls; the firepans (three, as described); the small ramp leaving the great ramp's side (`p07`); the five altar lines and five signs; the fifteen officials' signs with the colour key; צפון with its coloured fields; the two golden stands; `1 · אפייה` / `2 · טיגון במחבת`; the ninety-six niches; לשכת הכלים — three stepped shelves of silver and gold vessels and a readable label (`out/b2g/p17_kelim.png`); «קירוי הר הבית» / «לחם שמים» — a half-transparent roof over the whole Mount on rings of columns, the courts open, as the card says (`r03_kiruy_all.png`); «ניצוצות הנברשת בזריחת החמה» — the lamp over the golden vine with its sparks and a readable label of the Gemara's words (`p10_sparks.png`); «לשכת אבני המזבח» — a heap of unhewn stones with both names of the chamber over it (`p13_avanim.png`).
- b1: the king climbs in royal dress with a kippah; the row «צורת לחם הפנים» changes the loaves; «בית המטבחים» / «הגר״א» as its card; «עולים במזרח ויורדים במערב — הכבש» exists; the card «הכבש» explains the רבובה.
- Both: "קולות בהדגמות" and "גוון אבן עתיקה" are checkboxes under "תצוגה", on by default; "המשך הכרטיס" opens the rest and nothing is lost (8 of 8, 12 of 12, 6 of 6 paragraphs after the press); Enter halves and Shift + Enter doubles the distance (code); the help page's lines on the mouse, the keyboard arrows, the compass, "חתך", "מעבר דרך קירות", "המשך" / "עצור" match the buttons.
- Morning service: the banner, the Mishnah with nikud, captions of 4–10 seconds for 105 of 109 captions; the kiddush moment with its large label «מקדש ידיו ורגליו — יד ימין על רגל ימין (זבחים יט:)» is clear.
- No Latin letters in any card paragraph of b2; no "המשתמש", "הכרעת", "כפי שביקשת", "בחירת דגם" in user-facing strings of either house; the credits (יוסי כהן, shalomke) are in the b2 and unified manifests and in the store description.
- Mishnah Yoma 5:2 (book 55, line 39), used in the fix of U-24: «משנטל הארון, אבן היתה שם מימות נביאים ראשונים, ושתיה היתה נקראת, גבוהה מן הארץ שלש אצבעות, ועליה היה נותן».

## COVERAGE
- Read in full: `תיאור העדכון 2.0.11.txt`, `תיאור התוסף לחנות.txt`; all 12 new b2 places and all 9 new rows with their options, the 2 new options of «בית המטבחים», the 8 options of «צורת התאים» (from `cand/b2/content.json`; the candidate's cards are identical to the snapshot's); every changed paragraph of the existing b2 cards in the scope file; `b2_strings_new.md` and `b1_strings_new.md` whole; the b1 texts of the king, the ramp, the altar measures, the small ramps, the bread row, the two new slaughter-place options; the help page of both houses; the unified plugin's opening page; the manifests.
- Counted by script over the candidate: version stamps, "שורה / מתג / קריאה", first person, traces of the dialogue, duplicated paragraphs, the fold's effect on all 242 b2 cards, the 109 captions of the morning service.
- Run and looked at (1280×800, my own copy of the harness with the news window left alone): the "מה חדש" window of b2 (three positions) and of b1; the help page; the whole menu and table of both houses (DOM); b2 — 16 new or changed places through the menu (כלי השיר, חלקי יהודה ובנימין, מנורות של זהב, עושי לחם הפנים, החותמות, הרובד הרביעי, עולים במזרח, שלוש המחתות, הממונים, מידות המזבח, כני הזהב, פנחס המלביש, עושי חביתין, לשכת הכלים, ניצוצות הנברשת, אבני המזבח) and 3 rows (צפון, the default; קירוי הר הבית / לחם שמים; הסורג / בימי מלכי יון); b1 — 6 places (עליית המלך לכסא, מידות המזבח, עולים במזרח, הכבש, המכונות מקרוב, שולחן משה מקרוב) and 2 rows (צורת לחם הפנים / רבי חנינא, בית המטבחים / הגר״א); demonstrations — the morning service (stages 1, 3, 4 and 8 at fixed seconds), the High Priest's entry (one frame and the captions' log), the lamps of the Water-Drawing, the king's ascent (b1); the real-press test of "המשך הכרטיס".
- NOT done: the other new rows in the running model (הפרוכות, כני הזהב, חביתין, לחם הפנים of b2, התאים — read only); the places הירידה לבית הטבילה and כבשים קטנים in the running model; the wall-fade check of U-41 with continuous drawing; the guided presentation's slides (except the one new b1 slide's text); printing; the stand-alone HTML file; a phone-sized window; Otzaria itself; sound. The machine was short of memory (browsers were killed several times), so every render is a single 1280×800 view; label sizes are as seen there. Quotations were not compared with the books (not my task), except the one above.
- A slip of mine, for the record: while clearing my own queue of scripts I sent a TERM signal to process 1 by mistake (I took a script's parent id without looking). The init process ignored it; I checked that it and the other reviewers' processes kept running. Nothing outside my scratch folders was changed.

## NOT IN LOCAL LIBRARY
- Nothing to list: I did not check quotations (only Mishnah Yoma 5:2, found).
