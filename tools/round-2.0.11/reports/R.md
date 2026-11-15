# Reviewer R — THE REFUTER — round 211 (b2 2.0.2 / b1 1.4.4)

Method: the builder's claims (ROUND_SUMMARY_HE.md, the "במודל:" paragraphs, the "בחירת מודל" marks) were treated as false until the
library and a render said otherwise. Renders: `/home/claude/qa/r211/rev_R/out/*.png` (scripts in `/home/claude/qa/r211/rev_R/`).
Library = `/home/claude/texts` (book id : line).

## SUCCESSFUL REFUTATIONS

### R-01 — HIGH — the two chambers of the Nikanor gate stand OUTSIDE the court; the instruments' chambers are not "תחת עזרת ישראל"
- WHERE: b2, places "לשכת פנחס המלביש", "לשכת עושי חביתין", "לשכות כלי השיר — תחת עזרת ישראל"; paragraph "**מקום הלשכה** (מ־2.0.2): על רצפת
  עזרת ישראל, ופתחה לעזרה דרך הכותל… מקומה מעל לשכת כלי השיר, ופתחה לעזרה — בחירת מודל"; summary items 15, 16; `30-courts.js:3046-3049`.
- WHAT (1): the card calls the chambers' place a "בחירת מודל". It is not free: there is an explicit source, and the model contradicts it.
  The model builds each chamber as the upper storey of a tower standing in עזרת הנשים, EAST of the court's east wall
  (`room(98, ±24, 9, 9, …)`; the wall is `azE: 93.5`, so the room is x 93.5…102.5 — wholly outside the 187×135), with only its door
  cut through the wall. But:
  - Rambam, Beit HaBechirah 5:17 (337:92): "שמונה לשכות היו **בעזרת ישראל**… ושתי לשכות אחרות היו שם **בעזרת ישראל**. אחת מימין שער
    מזרחי והוא לשכת פינחס המלביש. ואחד משמאלו והוא לשכת עושה חביתין".
  - Tiferet Yisrael, צורת בית המקדש §48 (6029:47): "וב׳ לשכות היו מזה ומזה לשער נקנור **בפנים בעזרת ישראל** [מדות פ״א מ״ד פ״ב מ״ג]".
    (The same card takes "פנחס בצפון" from this very author, and drops his "בפנים".)
  - The card's ref list gives "רמב״ם בית הבחירה ה, ד", not 5:17, so the reader is never shown the halachah that fixes the place.
- WHAT (2): the instruments' chambers. The 3D label says "לשכת כלי השיר — תחת עזרת ישראל, פתוחה לעזרת הנשים (מידות ב, ו)", but what is
  drawn is the ground storey of that same tower, on the floor of עזרת הנשים, east of the wall line (`room(98, ±24, 9, 9, LV.AZ-LV.EZN,
  LV.EZN, …)`). Nothing of it is under the court of Israel. The commentators read "תחת" literally — hollows under the court's floor:
  - Rabbenu Shemaya, Middot 2:6 (645:78): "ולשכות היו תחת עזרת ישראל. **מחילות תחתיה**".
  - Meiri, Middot (6033:37): "לשכות היו תחת עזרת ישראל פתוחות לעזרת הנשים **שהיתה נמוכה הימנה שבע אמות וחצי אמה**".
  - Tiferet Yisrael, צורת בית המקדש §46 (6029:45): "**ב' לשכות** היו תחת עזרת ישראל ופתוחות לעזרת נשים… **מערות** הנ״ל".
  - Ra'aviah in Tosafot Yom Tov, Middot 2:6 (948:98): "דרך שם היו מביאין מן **המחילה** כלי שיר".
- EVIDENCE (render): `out/nik_east.png` (from עזרת הנשים, looking west: two towers flank the fifteen steps, in front of the wall; the
  wickets are between them and the gate), `out/kl1.png` (the lower room), `out/kl3.png` (the upper room, its door leaf on the west).
- FIX: move both storeys WEST of the wall line, into the eleven amot of עזרת ישראל: the upper chamber on the court's floor inside the
  wall (Rambam, Tiferet Yisrael), and the instruments' chamber really under that floor, its opening in the 7.5-amah face that looks into
  עזרת הנשים beside the steps. This keeps the owner's instruction ("לשכת כלי שיר… מתחת לשתי הלשכות") AND satisfies Middot 2:6, the
  Rambam and the Tiferet Yisrael at once; the patrol of Tamid 1:3 still meets at the chamber's door inside the court.
  Card text then: "מקום הלשכה: בעזרת ישראל, מימין השער ומשמאלו — ״ושתי לשכות אחרות היו שם בעזרת ישראל, אחת מימין שער מזרחי… ואחד
  משמאלו״ (רמב״ם בית הבחירה ה, יז); וכן בתפארת ישראל: ״בפנים בעזרת ישראל״. ותחתיה, תחת רצפת העזרה — לשכת כלי השיר, ופתחה לעזרת הנשים
  (מידות ב, ו; רבינו שמעיה: ״מחילות תחתיה״). מידות הלשכה ומקומה המדויק לאורך הכותל — בחירת מודל." Add the ref רמב״ם בית הבחירה ה, יז.
- If the towers stay as they are, at the very least the card must say that the Rambam and the Tiferet Yisrael place the two chambers
  inside the court, and the label must not say "תחת עזרת ישראל" of a room that is not under it.
- OWNER: yes (the towers follow his words of 15.11 13:32, but he was not shown Rambam 5:17 / Tiferet Yisrael §48).

### R-02 — MED — "two" instruments' chambers has a source; "which side is Pinchas" is a dispute shown with one side only
- WHERE: b2, "לשכות כלי השיר — תחת עזרת ישראל" ("במודל (מ־2.0.2): שתי לשכות…"); "לשכת פנחס המלביש" ("במודל: שני תאים… פנחס המלביש
  בצפון, כדברי התפארת ישראל").
- WHAT: (a) the number two is not a bare model choice (SOURCES_211 §13 says "'Two' is not written"): Tiferet Yisrael writes "ב' לשכות
  היו תחת עזרת ישראל" (6029:45). The card should cite it. (b) North/south is a real dispute in the owner's library and the card shows
  one side as if unopposed: the Tosafot Yom Tov's plan / Tiferet Yisrael — right of the one who enters = north = Pinchas; Lechem
  Shamayim (Ya'avetz), end of Middot (1145:123): "נראה שהיה מפרש לימינו ולשמאלו של הנכנס דרך השער. ולא ידעתי מניין לו. וסתמו כפירושו
  משמע ימינו ושמאלו של שער… והוא דרום וצפון של עולם" — i.e. Pinchas in the SOUTH, the chavitin in the NORTH.
- FIX: add to the card: "בקצרה: לתוספות יום טוב ולתפארת ישראל — פנחס בצפון (ימין הנכנס); ולדעת הלחם שמים — ימין השער הוא דרום, ופנחס
  בדרום. במודל — כתפארת ישראל." and cite 6029:45 for "שתי לשכות".
- OWNER: yes for (b) (a silent decision between two readings; it also moves the meeting point of the patrol of Tamid 1:3 from the
  south-east to the north-east).

### R-03 — HIGH (broken function) — a place's overlay never goes off once its place is clicked twice
- WHERE: b2, every place with an untimed feature or a layer of its own; proved on "חלקי יהודה ובנימין — הרצועה שבדרום המזבח" (tribes)
  and "מנורות של זהב — שמחת בית השואבה" (simchaMenorot). `70-ui.js:2056-2063` (`placeLeave`).
- WHAT: the lamps' card promises "המנורות מוצגות רק בבחירת מקום זה, ונעלמות במעבר למקום אחר". True only if the place is clicked ONCE.
  Click the same place a second time (the natural thing: the lamps' place replays its demonstration on every click) and the feature
  is never switched off again: the four fifty-amah lamps, or the gold / blue colouring of Yehudah and Binyamin, stay in every later
  place, option and view. Cause: on the second click `placeLeave` sets `leaveFeat = null` (line 2059) and then does not re-arm it,
  because `F.isOn()` is already true (line 2062) — the feature is now taken for "what the reader switched on himself". The same holds
  for `leaveLayer`.
- EVIDENCE: `node /home/claude/qa/r211/rev_R/feat.mjs`:
  `A1 tribes → on; A2 other place → off` (good); `B1 tribes → on; B2 tribes again → on; B3 other place → tribes STILL on; B4 third place →
  still on`; `C1 row "צפון לשחיטת" → tribes AND northZones both on`; `D1 lamps; D2 lamps again; D3 other place → simchaMenorot STILL on`.
  Renders that caught it by accident: `out/menorot.png`, `out/lepers.png`, `out/rosh.png`, `out/chel.png` — the floor of עזרת הנשים is
  gold and the court blue in all of them, long after the place was left (the place had been opened twice in a row).
- FIX: in `placeLeave`, keep the armed feature / layer when the new place asks for the same one:
  `const keepF = leaveFeat && it.feature && it.feature.key === leaveFeat.key ? leaveFeat : null; const keepL = leaveLayer && leaveLayer === it.layer ? leaveLayer : null;`
  switch off only what is not kept, then `leaveFeat = keepF; leaveLayer = keepL;` and arm a new one only if none was kept.
  Re-test with feat.mjs (B3, C5, D3 must read false).
- OWNER: no.

### R-04 — HIGH — the kohen who won the first lottery vanishes after the terumah; the "brothers" lay the great pyre and the two logs
- WHERE: b2, demo "סדר עבודת הבוקר", stages "סידור המערכה הגדולה" (`55-tamid.js` `SC.maarachah`: `B4.forEach` — b1…b4 carry and
  "place"), "המערכה השנייה" (`SC.maarachah2`: b1, b2; the third pyre: b2), "שני גזרי עצים" (`SC.gezirin`: `a.pose("b3","place",…);
  a.pose("b4","place",…)`). The winner, "t", has no step in any of them. The two-logs stage's own caption quotes the Rambam in the
  singular: "ואחר כך מעלה שני גזרי עצים ומניחן על מערכה גדולה".
- WHAT: the great pyre and the two logs of the morning are the work of ONE kohen — the one who won the terumah:
  - Yoma 22a (107:486-487): "מי שזכה בתרומת הדשן (יזכה) בסידור מערכה ובשני גזירי עצים".
  - Rambam, Temidin uMusafin 4:5 (344:59): "הפיסו וזכה מי שזכה לתרם. **והוא מסדר את המערכה. והוא מעלה שני גזרי עצים למזבח**".
  - Rambam 6:1 (344:87): "ומתחיל זה שזכה בתרומת הדשן ותורם… ואחר כך מסדר מערכה גדולה. ואחר כך מסדר מערכה שניה. ואחר כך מעלה שני גזרי עצים".
  - Rambam 2:3 (344:18): "שני גזרים של בין הערבים מעלין אותן שני כהנים. כל אחד ואחד בעץ יחידי בידו… **אבל של שחר בכהן אחד**".
  - Tiferet Yisrael, Tamid 2 §16, §24 (818:163, 179): "וזה שזכה בתרומת הדשן הולך בראשון ונושא ב' גזירי עצים [ובערב, ב' כהנים נושאין כל
    א' גיזרה א']"; "אותו שזכה בתרומת הדשן מסדר המערכה הגדולה… **ואחרים** מסדרין מערכה שנייה של קטורת… ואח״כ הזוכה בתרומת הדשן מניח
    ב' הגיזרין על המערכה הגדולה".
  In the demo four brothers lay the great pyre together (`out/dm05_maarachah_12p5.png`: four kohanim at the pyre, logs in hand), and in
  the two-logs stage two brothers stand at the pyre with the same laying movement (`out/dm07_gezirin_3p6.png`; the caption over one
  of them is the limbs' "מחזירין אותן למערכה", so the viewer cannot tell who lays the logs — and neither is the winner). The brothers
  may carry the wood up ("החלו מעלין בגזרין", Tamid 2:3); the laying is his ("סדר המערכה גדולה", 2:4, singular).
  The second pyre: by the Rambam 6:1 also his; by the Tiferet Yisrael "אחרים" — the demo's b1, b2 fit the latter; say which.
- FIX: keep "t" on the altar after the terumah: the brothers bring the logs up, "t" lays the great pyre and, alone, both of the two
  logs; one brother returns the limbs. Stage text: "שני גזרי העצים — בשחר כהן אחד מעלה אותם, הוא שזכה בתרומת הדשן (יומא כב.; רמב״ם
  תמידין ב, ג: ״אבל של שחר בכהן אחד״; ד, ה). המערכה השנייה — לרמב״ם (ו, א) אף היא שלו; ולתפארת ישראל — ״אחרים מסדרין״."
- OWNER: no for the great pyre and the logs (explicit); yes for the second pyre (Rambam / Tiferet Yisrael). The stages may predate
  this round, but round 211 reworked them (MAARACHOT2_211) and left the cast as it was.

### R-05 — MED — "מתי הולכים לשם — בחירת מודל" is not a model choice: the Bartenura says when
- WHERE: b2, demo stage "האברים על המזבח", text "…בינתיים מדשן מזבח הפנימי ומדשן המנורה שופכים את הדשן שבטני ובכוז במקום הדשן שבמזרח
  הכבש… מתי הולכים לשם — בחירת מודל"; summary item 27; `55-tamid.js:1972-1985` (ASH_PLACE_211).
- WHAT: the time is stated. Bartenura, Tamid 6:1 (634:201): the two go in before those who burn the incense, "…עושה הטבת שתי נרות וגומר
  השלמת דשון המנורה, **ואז היו שניהן מוציאין זה הטני וזה הכוז ושופכים הדשן במקום אחד אצל המזבח קדמה**"; and again on 3:9 (634:123).
  Tiferet Yisrael, Tamid 3 §74, §82 (818:356, 372): he waits "עד אחר הטבת גם ב' נרות האחרונים, כדי להוציא ב' הדישונים יחד"; "וכשיטיב…
  גם השתי נרות האחרות אחר הקטורת, אז מוציא הכוז, וכן חבירו מוציא אז הטני". Both say the same thing about the time: STRAIGHT AFTER
  the two lamps, when the two vessels leave the Heichal together (for the Bartenura that is before the incense, for the Tiferet
  Yisrael after it — each by his order of the lamps). In the demo's Rambam order the pouring does follow the two lamps (lamps2 →
  the limbs' stage); in Abaye's order — the default — it is pushed past the incense and the priestly blessing, to the raising of the
  limbs (7:3), which no source says.
  The other side that the builder may have had in mind is real and should be said: Mishnah Tamid 7:2 has the five still holding their
  vessels at the blessing — "הטני ביד אחד, והכוז ביד אחד" — which may mean that the vessels were not yet emptied. So this is a question
  between a commentator's explicit words and an inference from the Mishnah, not a free choice.
  In the Rambam's order of the demo the pouring (in "האברים על המזבח") comes BEFORE the blessing, in Abaye's order AFTER it — the same
  act lands on both sides of 7:2 without a word.
- EVIDENCE: 634:201, 634:123, 818:356; the stage text (scope/b2_strings_new.md line 327). NOT SETTLED: in `out/dm09_haalaah_14.png` (the demo's own camera at second 14, when the two
  should be pouring) I do not see them or their caption — only "מעלה האברים למזבח"; a second render from the east failed (Chrome
  crashed under the machine's load), so whether the act is hidden behind the ramp in the demo's view needs one look by the builder.
- FIX: in both orders let the two walk to the ash place at the end of the stage "הטבת שתי נרות" (Bartenura, Tiferet Yisrael), or keep it and write: "מתי שופכים: לברטנורא (תמיד
  ו, א) — מיד כשמוציאים את הטני ואת הכוז, אחר הטבת שתי הנרות: ״ואז היו שניהן מוציאין… ושופכים הדשן במקום אחד אצל המזבח קדמה״; ובמשנה
  (ז, ב) הטני והכוז עדיין בידם בשעת ברכת כהנים. בהדגמה — …".
- OWNER: yes (which of the two the demo follows).

### R-06 — HIGH — the "twelve Levites on the duchan" are drawn as the players; the Rambam says the players do NOT count among the twelve
- WHERE: b2, demo "סדר עבודת הבוקר" (stages "המגרפה" … "ניסוך היין, החצוצרות והשיר"); summary item 22 "שנים עשר לויים עם כינורות ונבלים על
  הדוכן"; `55-tamid.js:1230-1233` (LEVITES_211: "twelve: nine with lyres, two with harps, and Ben Arza with the cymbal"), `:1871-1878`.
- WHAT: the builder added 9 lyres + 2 harps + the cymbal and called the sum "the twelve Levites of Arachin 2:6". The Rambam rules the
  opposite, in so many words — Klei HaMikdash 3:3 (338:39): "ואין פוחתין משנים עשר לוים עומדים על הדוכן בכל יום לומר שירה על הקרבן…
  **ואין אומרין שירה אלא בפה בלא כלי** שעקר השירה שהיא עבודתם בפה. **ואחרים** היו עומדים שם מנגנין בכלי שיר. מהן לוים ומהן ישראלים
  מיחסין המשיאין לכהנה… **ואין אלו המשוררים על פי הכלים עולין למנין השנים עשר**". So by the Rambam (whom the demo follows for the
  instruments: KH 3:4, 3:6): twelve Levites who sing with their mouths and hold nothing, AND beside them the players (at least nine
  lyres, two harps, one cymbal), some of whom may be Israelites. In the model not one Levite sings without an instrument, and the
  number twelve is given to the very group the Rambam excludes. (Arachin 2:4 is the dispute who the players were — "עבדי הכהנים" /
  families of Israel "משיאין לכהונה" / "לוים היו"; SOURCES_211 §28 quotes KH 3:4 and missed 3:3.)
- EVIDENCE: 338:39; the code lines above (every one of `LEV_IDS` but "ba" gets `a.hold(k, "lyre…"/"nevel…")`, "ba" the cymbals).
- FIX: twelve Levites on the duchan with empty hands (the singers), and the players beside them — nine lyres, two harps, and Ben Arza with
  the cymbal (Shekalim 5:1). Text: "שנים עשר לויים אומרים שירה בפה — ״ואין אומרין שירה אלא בפה בלא כלי״; ולצדם המנגנים בכלי שיר —
  ״מהן לוים ומהן ישראלים מיחסין״, ״ואין אלו… עולין למנין השנים עשר״ (רמב״ם כלי המקדש ג, ג)." Who the players are (Levites only, or also
  Israelites) — say it and mark the choice.
- OWNER: yes (how many figures, and whether some players are drawn as Israelites).

### R-07 — MED — Parhedrin in the north and Beit Avtinas in the south: the card cites Yoma 19a for the opposite of what Yoma 19a concludes;
  and the Nikanor gate's mezuzah is given a reason that the model's own chamber contradicts
- WHERE: b2, "לשכת העץ — לשכת כהן גדול (פרהדרין)" — "לשכתו השנייה של כהן גדול — בית אבטינס, בדרום (יומא יט.)", and the new
  "במודל (מ־2.0.2): מזוזה על עמוד הפתח המערבי…"; "לשכת בית אבטינס — על גבי שער המים"; "שער ניקנור" — "**מזוזה** (יומא יא.)…"; item 5.
- WHAT (1): Yoma 19a (107:410-412) asks exactly which of the two was where, and concludes: "ולא ידענא אי לשכת פרהדרין בצפון ולשכת בית
  אבטינס בדרום, או לשכת בית אבטינס בצפון ולשכת פרהדרין בדרום. **ומסתברא דלשכת פרהדרין בדרום הואי**. מאי טעמא? מקדים קאי ומיסך את רגליו
  וטביל, ואזיל לצפון וגמר חפינה…". The model has it the other way (Parhedrin = לשכת העץ in the north, Avtinas over the Water Gate in the
  south) — which is the Rambam (BHB 5:17 "ולשכת העץ… והיא הנקראת לשכת פרהדרין"), the Bartenura and the Tiferet Yisrael, a legitimate
  choice — but the card (a) never tells the reader that the Gemara says "ומסתברא… בדרום", and (b) gives "(יומא יט.)" as the source for
  "בית אבטינס, בדרום", which is the reverse of that page's conclusion. The mezuzah of 2.0.2 now hangs on this choice (it is put on
  the northern chamber). SOURCES_211 §40 shows the builder had the line "ומסתברא דלשכת פרהדרין בדרום הואי" before him.
- WHAT (2): the gate's card quotes "חוץ משער ניקנור, **שלפנים ממנו לשכת פרהדרין**" (107:222) — the gate needs a mezuzah because it leads
  to the dwelling. But in the model the Parhedrin chamber has one door only, north, to the chel ("פתחה היחיד — לצפון… אל החיל", and
  the Tosafot Yom Tov quoted there: "ולא היה לזו פתח כלל אל הקדש"). A man never passes Nikanor's gate on his way to it. The two cards
  stand side by side without a word on how they fit.
- FIX: in the Parhedrin card: "בקצרה — מקום שתי לשכותיו של כהן גדול: בגמרא (יומא יט.) — ״ומסתברא דלשכת פרהדרין בדרום הואי״, ובית אבטינס
  בצפון; ולרמב״ם (בית הבחירה ה, יז), לברטנורא ולתפארת ישראל — לשכת העץ שבצפון היא לשכת פרהדרין, ובית אבטינס על גבי שער המים שבדרום.
  במודל — כרמב״ם." Remove "(יומא יט.)" from "בית אבטינס, בדרום". In the gate's card add one line on "שלפנים ממנו" (or say plainly that
  in the model the chamber opens to the chel, after the Tosafot Yom Tov, and that the baraita's reason is then not seen in the model).
- OWNER: yes.

### R-08 — MED — "the lamps face the middle one and the middle one faces west (Menachot 98b; Rashi)" is Rashi's picture for NORTH–SOUTH
  only; the model draws it also in Rebbi's east–west option, unmarked
- WHERE: both houses, the menorah's lamps (b2 `45-vessels.js:740-760` `midEW: spout(-1,0,0)`; b1 `55-interior.js:1883-1889`); b2 row
  "כיוון המנורה והשולחן" → "רבי — מזרח ומערב"; summary item 34.
- WHAT: Rashi, Menachot 98b (2186:4687) says it of R. Elazar b. R. Shimon's answer: "**לעולם צפון ודרום מנחי** ואפי' הכי ליכא אלא חד
  כלפי מערב והיינו אמצעי שפי הפתילה כלפי מערב ושאר הפתילות מצודדות פיהן כלפי האמצעי". For Rebbi (east–west) the same Rashi
  (2186:4683) says that the one lamp "לפני ה'" is not the middle one: "והחיצון של צד מערב קרי ליה נר מערבי"; and the Rambam's commentary
  on Tamid 3:9 (575:40), describing the east–west reading, writes: "ופיות כל הנרות לצד מערב זה לאחור זה". In the model, when the
  option "רבי — מזרח ומערב" is chosen, the six still turn to the middle and the middle one's mouth points west along the row. That is
  the builder's own extension; the option's card says nothing about the lamps' mouths, and nothing is marked "בחירת מודל".
  (In the default — the Rambam, north–south — the drawing is exactly Rashi and BHB 3:8; that part stands.)
- FIX: in the card of "רבי — מזרח ומערב" add: "פי הנרות בשיטה זו: ברמב״ם בפירוש המשנה (תמיד ג, ט) — ״ופיות כל הנרות לצד מערב זה לאחור
  זה״; ״מצדדין פניהם כלפי נר אמצעי״ הובא בגמרא ליישוב שיטת רבי אלעזר ברבי שמעון. במודל — … ; בחירת מודל." (or draw the Rambam's
  picture there). The nozzles' form is a model choice in both houses and should be said once in the menorah's card.
- OWNER: yes (which picture to draw in Rebbi's option).

### R-09 — LOW/MED — in the Rambam's order of the demo "ברקאי" is moved to after the lamb was led to the slaughter-house; no source
- WHERE: b2, `56-tamid-data.js` `orders.rambam`: "…gezirin, **lamb, tobeit, barkai**, keys, gate…" (Abaye's order: "lot2, barkai, lamb, tobeit").
- WHAT: Mishnah Tamid 3:2-3 has "צאו וראו אם הגיע זמן השחיטה… ברקאי" BEFORE "צאו והביאו טלה מלשכת הטלאים". The Rambam's chapter 6
  (344:87) does not mention the watch at all, so nothing moves it; the stage's own Rambam caption is Temidin 1:2 (the time), not an
  order. The move is the builder's and is not marked.
- FIX: keep the Mishnah's place for "ברקאי" in both orders (before "lamb"), or mark it: "מקומו של ״ברקאי״ בסדר הרמב״ם — בחירת מודל".
- OWNER: no.

### R-10 — MED — "הכהן שנעל ישן עליה" (the marble slab): a dispute of the commentators shown as fact
- WHERE: b2, demo stage "בלילה — בית המוקד": "…הכהן שנעל ישן עליה, וכסותו עליה (מידות א, ט; תוספות יום טוב שם)"; summary item 25.
- WHAT: the text names the Tosafot Yom Tov and hides whom he is arguing with. Rabbenu Shemaya, Middot 1:9 (645:40): "גמר הכהן מלנעול
  והחזיר המפתחות לשלשלת והחזיר הטבלא למקומה **ונתן בן לוי כסותו עליה** חזר וישן לו". The Tosafot Yom Tov (948:58) brings these very
  words — "נתן. בן לוי כסותו עליה חזר וישן לו. כך לשון הרר״ש" — and rejects them ("ואין אלו בעיני אלא דברי תימה שהרי אין בן לוי ישן
  אלא מבחוץ"). So: Rabbenu Shemaya — the Levite; Tosafot Yom Tov — the kohen. Also "בבוקר הממונה מגביה אותה בטבעת" is an inference
  (Tamid 1:3 says only "נטל את המפתח"); the text does give its support (מלאכת שלמה) — that part stands.
- FIX: "…וישן עליה — לתוספות יום טוב הכהן שנעל; ולרבינו שמעיה — בן הלוי (״ונתן בן לוי כסותו עליה״). בהדגמה — כתוספות יום טוב."
- OWNER: yes.

### R-11 — LOW — small things seen on the way
- "בדגם" in a card: b2 "לשכת המצורעים" — "בית הטבילה (מ־2.0.2): … **בדגם**: סביב הבור בית קטן של אבן" → "במודל:" (summary item 38
  claims the term is uniform; content.json line 1896).
- Paragraphs repeated verbatim inside one card: b2 "לשכת העץ — לשכת כהן גדול (פרהדרין)" — "**שבעת הימים** (יומא א, ג)…" and "במודל
  (מ־2.0.2): מזוזה על עמוד הפתח המערבי…" each appear twice; b2 "לשכת בית אבטינס — על גבי שער המים" — "**הגמרא** (יומא לח.)…" and "במודל
  (מ־2.0.2): אחד מבית אבטינס…" each appear twice. Delete the second copy.
- b2 "לשכת פנחס המלביש" / "לשכת עושי חביתין": two "במודל" paragraphs that an outsider cannot reconcile — "במודל: שני תאים משני צדי השער,
  **בצד עזרת נשים**" and, lower, "**על רצפת עזרת ישראל**, ופתחה לעזרה דרך הכותל". Merge into one (and see R-01).
- A cut label floats in the chavitin room's view: "| (מידות ב, ו)" — the tail of the instruments' chamber's label seen through the floor
  (`out/kl3.png`).
- b2 "צפון לשחיטת קדשי קדשים", default option: "הגבול הדרומי של הכחול והכתום — אמצע העזרה, כלשון רש״י (״מחצי פתח ההיכל ולצפון״)":
  Rashi says these words of "בין האולם ולמזבח" only (2157:1322); of Rebbi's addition he says "כל צפון העזרה" (2157:1325). Write
  "…כלשון רש״י בבין האולם ולמזבח; ובתוספת רבי — ״כל צפון העזרה״".
- OWNER: no.

### R-12 — MED — the new arrows say "עולים במזרחו של כבש", and in the morning demo every kohen goes UP on the ramp's WEST side
- WHERE: b2, place "עולים במזרח ויורדים במערב — הכבש" (RAMP_WAYS_211, `40-altar.js:226-227`: up-lane at `ACX + 4.5`, down-lane at
  `ACX − 4.5`) against the demo "סדר עבודת הבוקר" (`55-tamid.js` `SC.terumah`, `SC.tapuach`, `SC.maarachah`, the limbs' stage).
  Summary item 6.
- WHAT: Mishnah Yoma 4:5 (55:35): "בכל יום כהנים עולים במזרחו של כבש ויורדין במערבו"; Bartenura there (582:181): "לכך עולין במזרחו של
  כבש, שסמוך לפנות לימין". The ramp is x 47.5…63.5 (its middle `ACX = 55.5`; east is +x). In the demo the winner of the terumah steps on
  at `A(50.4, 41.6)` and climbs to `A(50.8, 12.2)` — the western lane — and comes down by the same lane (`A(51.2, 12.2)` → `A(50.6,
  40.6)`); the four brothers climb at x 50.4…53.1 (with the rakes, and again with the logs); the one who raises the limbs climbs by
  `A(51.4, 12.2)`. Nobody ever uses the eastern half to go up. The model now teaches the rule in one place and breaks it in another.
- EVIDENCE: the coordinates above (`const A = (x, lz) => [x, lz + D]`, `55-tamid.js:32`); `40-altar.js:23, 226-227`.
  (No render of the climb was taken — the machine was loaded; the code is unambiguous.)
- FIX: route every ascent of the demo along x ≈ 58…61 (the east half) and keep the descents on x ≈ 50…53; the terumah's way after the
  descent (round the foot to the east side, "הלך למזרחו של כבש כעשר אמות") stays as it is. If the limbs are taken from the west half
  ("מחצי כבש ולמטה במערבו"), say in the stage text that the one who raises them walks up from where they lie — a model choice.
- OWNER: no.

### R-13 — MED — officer 15, "פנחס — על המלבוש", now stands in the instruments' chamber, not in his own
- WHERE: b2, place "הממונים שבמקדש" — "**המקומות:** … 15 המלבוש — ב״לשכת פנחס המלביש״ (מידות א, ד)"; `30-courts.js:744`
  `["15 · המלבוש", "פנחס — על המלבוש", "k", 100.4, -24, 6, …]` (the sixth value is the floor he stands on).
- WHAT: this round raised Pinchas' chamber to the court's floor (13.5) and put the instruments' chamber under it, on the floor of
  עזרת הנשים (6): `room(98, -24, 9, 9, 12, LV.AZ, …, F_PINCHAS)` and `room(98, -24, 9, 9, LV.AZ − LV.EZN, LV.EZN, …, F_KLISHIR)`
  (`30-courts.js:3047-3048`). The officer was left at floor 6, x 100.4, z −24 — inside the lower room (x 93.5…102.5, z −28.5…−19.5):
  a kohen in white, his plate "15 · המלבוש" over him, among the lyres, beside the Levite who hangs a lyre. The card says he is in
  "לשכת פנחס המלביש". (`makeMan` keeps the floor it is given when a floor is found within 1.2 of it — and the lower room's floor is
  exactly 6.)
- EVIDENCE: the three code lines above. No render: Chrome crashed under the machine's load at the end of my time — the builder
  should open "הממונים שבמקדש" and look at number 15.
- FIX: `["15 · המלבוש", "פנחס — על המלבוש", "k", 100.4, -24, 13.5, …]` (LV.AZ), and check that he does not stand in the table or
  the shelf of F_PINCHAS. Also in this card the old sentence "הממונים עצמם אינם מצוירים בהם" now stands right before "מ־2.0.2 —
  חמישה עשר הממונים מצוירים" — delete it.
- OWNER: no.

## WHAT NEEDS THE OWNER'S DECISION (collected)
- R-01: where the two chambers of Nikanor's gate stand — in the court (Rambam BHB 5:17; Tiferet Yisrael §48), with the instruments'
  chambers really under the court's floor — or the present towers in עזרת הנשים.
- R-02: Pinchas north (Tosafot Yom Tov, Tiferet Yisrael) or south (Lechem Shamayim).
- R-05: when the teni and the kuz are emptied — the Bartenura (at Tamid 6:1) or after the blessing (an inference from 7:2).
- R-06: twelve singers with empty hands plus the players (Rambam KH 3:3) — how many figures, and whether some players are Israelites.
- R-07: Parhedrin north (the Rambam) against "ומסתברא דלשכת פרהדרין בדרום הואי" (Yoma 19a); and "שלפנים ממנו".
- R-08: the lamps' mouths in Rebbi's east–west option.
- R-10: who sleeps on the marble slab — the kohen (Tosafot Yom Tov) or the Levite (Rabbenu Shemaya).
- A note, not a finding: the default of "צפון לשחיטת קדשי קדשים" is Rebbi with RASHI's southern line while the altar stands by the
  RAMBAM's measures (the Rambam's line is the fourth option). Both are offered; which is the default is his to say.

## ATTACKS THAT FAILED — the claim stood (this is the coverage of what was attacked)
- North for slaughter, the three opinions: attributed as the baraita (Yoma 36a, 107:851); Rashi 2157:1323-1325. Renders
  `out/north_rashi.png`, `out/north_rambam.png`: green opposite the altar up to the north wall; blue and orange end at the court's
  mid-line (Rashi, 2157:1322 "מחצי פתח ההיכל ולצפון") or at the altar's north face (Rambam BHB 5:15-16, 337:90-91). The two lines are
  truly different — also with Rashi's own place of the altar (five amot north of the middle, by the row "מקום המזבח בעזרה"). I tried
  to show that "Rashi against the Rambam" is an artefact of mixing two altar places; it is not.
- Yehudah and Binyamin: the border on the altar's east face, the strip south of the altar, the altar's two "eaten" bands — the east
  one less the north end's amah, the south one less the west end's amah — are Rashi Zevachim 53b word for word (2191:2590-2591) and
  Rashi Yoma 12a (2157:332); `out/tribes_top.png`, `out/tribes_altar.png` match the card; "עד היכן… בחירת מודל" is marked. (Megillah 26a
  is not in the local library. The label lists "המזבח" under Binyamin while the baraita says "ובה היה מזבח בנוי" — that is Rashi's
  reading and the card gives it.)
- The showbread's default: Menachot 94b attributions right (R. Chanina — תיבה פרוצה; R. Yochanan — ספינה רוקדת); the default was the
  owner's own choice (PLAN.md line 380), and the other option says that the Rambam rules as R. Chanina (Kesef Mishneh). Not silent.
- The golden lamps: fifty amot (Sukkah 52b, 108:1355), four cups, a ladder to each cup (Yachin 772:520), a youth with a jar at each;
  the Tiferet Yisrael's reading (lamps on high platforms) is given "בקצרה"; the number of lamps is marked a model choice; I found no
  source that gives a number. `out/menorot.png`. (Its switching-off is broken — R-03.)
- The lepers' chamber: the roofed hut round the pit is marked a model choice and the card itself quotes "ולא היו מקורות" of the
  chamber; pit 1×1×3 (Yoma 31a). `out/lepers.png`.
- The Rosh's option: the four chambers outside, a wall and a door on the court's side, marked model choice. `out/rosh.png`.
- The chel "כברטנורא": ten free amot at the mount's level, the twelve steps inside it; the side gates' flights of 27 steps are marked
  model choices. `out/chel.png`.
- The soreg's breaches: 5 north + 5 south + 1 east + 2 west = 13 (`20-mount.js:520-523`); places marked model choice. `out/soreg13.png`.
- Beit HaMoked: 32 amot marked a model choice; the four chambers stand as Middot 1:6 — lambs SW, showbread SE, stones NE, the descent
  NW (`out/dm01_moked_9.png`); the names' dispute is a toggle with both sides.
- The demo's two orders: the Rambam's — patrol before the lotteries, blood before the five lamps, incense before the two lamps, the
  limbs before the blessing — agrees with Temidin 6:1-5 (344:87 and the captions); Abaye's agrees with Yoma 33a. (Only "ברקאי": R-09.)
- The limbs: pushed aside before the ash goes up (Tamid 2:1), returned before the lighting (2:5), the kindling in the gaps (2:4) — the
  order in `55-tamid.js:1635-1680` and in `out/dm07_gezirin_3p6.png` is the Mishnah's. The third pyre appears only when the row
  "מניין המערכות" has three or four, cited to Rambam Temidin 2:4 (344:19).
- The patrol meets at the chavitin chamber's door, "שלום" / "הכל שלום" (`out/dm03_patrol_30.png`).
- The two mezuzot hang on the right of the one who enters (north post at Nikanor's gate; west post at the chamber entered from the
  chel) — the geometry agrees with the cards.
- The ramp's arrows themselves: up-lane east, down-lane west (`40-altar.js:226-227`) = Yoma 4:5.
- The high priest's walk with the incense (code only, not rendered): outer curtain open at its south end, north between the two,
  inner open at the north (`50-heichal.js` PATH.two) = Yoma 5:1; R. Yose's single curtain entered along the north = "יש אומרים… רבי
  יוסי היא" (Yoma 52a); he leaves by the way he came.
- The owner's chat sentences ("אתה לא יכול לצייר לי מלך בלי כיפה" …) are in code comments only — 0 hits in `b1/plugin/bundle.js`.
- The names of Beit HaMoked's chambers by Mishnah Tamid: the default (Chotamot NW, "לשכת בית המוקד" NE) is Rashi, Yoma 17b (2157:533:
  "לשכת החותמות… במערבית צפונית, לשכת בית המוקד צפונית מזרחית") on the Gemara's conclusion (107:370); the other option is the Bartenura's
  and others' — a real opinion, not a rejected first thought. Stands.
- The king's kippah (b1, code only): `ark_kingKippah` — colour 0x7a2145 with a gold rim, on the head's own group, "under the crown,
  where he wears one" (`58-ark.js:416-432`); marked a model choice in the card. Not rendered.
- The officers' tribes: each one's reason is written; Ben Achiyah and Pinchas are marked model choices; Ben Gever "לוי" is an
  inference and the card shows it as one.

## VERIFIED (citations I read in the library while attacking)
- Yachin Tamid 2 §16, §24; 3 §74, §82 — 818:163, 179, 356, 372. Yoma 36a baraita — 107:851; Rashi there — 2157:1322-1327. Rambam BHB 5:15-17 — 337:90-92. Yoma 12a — 107:256; Rashi — 2157:332.
  Zevachim 53b — 130:1866-1867; Rashi — 2191:2590-2591. Menachot 98b — 131:3512-3518; Rashi — 2186:4683, 4687-4688.
  Sukkah 52b — 108:1355-1357; Mishnah Sukkah 5:2 — 56:52; Yachin — 772:520, 522. Rambam Temidin 2:2-5 — 344:17-20; 3:4, 3:7, 3:12 —
  344:35, 38, 43; 4:5 — 344:59; 5:9 — 344:78; 6:1 — 344:87. Rambam KH 3:3 — 338:39. Bartenura Tamid 3:9, 6:1 — 634:123, 131, 201.
  Yoma 19a — 107:403-412; Yoma 11a — 107:222; Yoma 22a — 107:486-487; Mishnah Yoma 4:5 — 55:35. Tiferet Yisrael, צורת הבית §44-50 —
  6029:43-49; Yachin Middot 1:4 — 819:74, 76. Rabbenu Shemaya Middot 1:9, 2:6 — 645:40, 78. Meiri Middot — 6033:37. Lechem Shamayim —
  1145:123. Tosafot Yom Tov Middot 1:9 — 948:58.

## COVERAGE
- Attacked with renders AND sources: the Nikanor chambers and the instruments' chambers (R-01, R-02); north for slaughter; Yehudah and
  Binyamin; the golden lamps; the lepers' chamber; the Rosh's option; the chel; the soreg; Beit HaMoked at night; the morning demo at
  nine moments (Abaye's order only).
- Attacked with sources and code, NOT rendered: the two logs' kohanim beyond one frame (R-04), the ash place (R-05), the Levites
  (R-06), Parhedrin / Avtinas / the mezuzot (R-07), the menorah's lamps in both houses (R-08), the ramp's sides in the demo (R-12),
  officer 15 (R-13), the incense walk, the machtot, the stands, the fourth rovad, the showbread's shape.
- NOT REACHED: the First Temple by render — the king's kippah and his leaning on the lion and the eagle, the mechonot's figures, the
  rubuva, the First Temple's small ramps and altar tables; in the Second Temple: the small ramps (item 1), Helene's chandelier and its
  sparks (7, 21), the filled chambers other than those named above (13), the house of stone, the Nazirites, the vessels' chamber, the
  cells, the wickets and the key (19), the altar's measure tables, the tapuach, the ramp-head steps, the slaughter-house's four
  readings, Rav and Levi on the yesod (20), the sounds (30), the mountain's shape and the heifer's ramp (35), the UI items 36-37, the
  presentation, the Rambam's order of the demo by render. Quotations were not checked word by word (left to the source-checkers),
  except those listed under VERIFIED.
- Rendering stopped at about 18:02: Chrome crashed on start ("Target crashed") with the machine's load above 20; four planned shots
  (the ash place from the east, a climb on the ramp, the Rambam-order blessing, officer 15) were not obtained.

## NOT IN LOCAL LIBRARY
- Megillah 26a (the parallel of Yoma 12a) — not in the export.
- The First Temple's throne texts: Midrash Abba Gurion ("והארי, פושט את ידו של ימין, והנשר גפו של שמאל, והמלך נשען עליהם…", "חוזר הגלגל
  בתוך המגנון"), Esther Rabbah 1:12 ("עלה במעלה הראשונה והארי פושט לו יד, ובשניה נשר פושט לו יד"), "פנים אחרים" ("ויונה של זהב…",
  "הנשרים פורשים גפיהם…", "ולמה לחטוף לבם של עדים…"), Targum Sheni, Yefeh Anaf — none found (`allq.py 'והמלך נשען עליהם|פושט לו יד|חוזר
  הגלגל'` returns nothing). The claim "leaning on the lion and the eagle" could not be checked here.
- Rashi on Bamidbar 8:2 (the six lamps turned to the middle in an east–west menorah) — I recalled it while writing R-08 but it is not
  in the export; nothing in R-08 depends on it, and it must not be quoted in a card before it is read on the owner's computer.
- "פירוש רבינו אליקים על יומא כג." as quoted in the officers' card for Ben Bevai — not looked up.
