# Round 2.0.18 (17.11.2026) — בית שני 2.0.9; בית ראשון 1.4.8; the choice screen's bar

## The user's requests (17.11.2026, 21:22-22:32)
1. 21:22 "תוסיף תוספות יום טוב" - the Tosafot Yom Tov as a third option of the row "פריפת הפרוכות" (2.0.8: Rashi / Tosafot Rid);
   of the two ways shown him, 21:41 "דרך א": the corner raised, drawn east and hooked on the wall, the opening beneath it.
2. Earlier, approved: a switch in בית שני for the bread and the lamps on Solomon's vessels ("כן, להוסיף מתג"); in both houses all at
   once, with Rashi's "פעמים בזה פעמים בזה" in the card ("כמו עכשיו: על כולם יחד").
3. 21:47 R. Meir's way in the High Priest's demo; the thirteen parochot of the Second Temple (Ketubot 106a; Rambam Kelei HaMikdash
   7:17) - "צריך להוסיף את הפרוכות שתלויות היו על חלל הפתחים. תחפש מקורות על זה". 22:03 "רבי מאיר הוא עוד שיטה."
   NOTE: the user wrote that R. Meir holds "פיתחא בדרום"; the Gemara (Yoma 51b) says "לעולם כרבי יוסי סבירא ליה" - the opening in the
   north (so Rashi, the Ritva, the Meiri, the Tosafot Yom Tov). He was told so plainly; the model follows the Gemara.
4. The parochot of the openings: spread, with a switch to raise them; raised by themselves in a demo and when a view through the
   opening is blocked; hung outside, like the heichal's (Tosefta Shekalim 3:11); the upper storey: a switch between wall to wall
   (the Tosafot Yom Tov and those who disagree with the Lechem Shamayim) and the Lechem Shamayim ("תעשה מתג לשתי השיטות"); בית ראשון -
   none ("לא, רק בבית שני").
5. 22:23-22:32: on the choice screen, a fixed bar of its own: a switch for each button the plugin puts INTO OTZARIA (not the model's
   buttons; "כמו 'כפתורים באוצריא'... בלי לבטל הרשאה"), and the update check there instead of in the menu. Decided: the search field's
   switch - when Otzaria 0.9.99 is out (shown, off limits, until then); the update check - in the one-file HTML only.
6. 21:53 "פרסום משותף" - one release of everything.

## Sources read (the Otzaria library; DB line = the index the plugin opens)
- Ketubot 106a (116:3032); Yoma 54a (107:1412, 1407); Rashi Ketubot 106a (2168:4902, 4905); Tosafot there (1914:1407); Meiri there
  (2209:1340); Rambam Kelei HaMikdash 7:17 (338:118) and the Mishneh LaMelech (4607:54); Tosefta Shekalim 3:11 (193:40); Middot 2:3
  (89:14), 4:5 (89:32); Tamid 7:1 (88:38), Bartenura (634:222), Tosafot Yom Tov (944:209), Ikar TYT (1075:171), the Rosh Tamid 33b
  (2224:308), Melechet Shlomo (1202:288).
- The upper storey: TYT Middot 4:5 (948:167), Yachin (819:570), Lechem Shamayim Middot 4:5 (1145:95, 96), Melechet Shlomo (1210:164).
- The fold: TYT Yoma 5:1 (898:155, 156) and Ikar TYT (1025:116); the Rashash Yoma 52b (2494:568) and on the Mishnah (698:59); Pnei
  Moshe / Korban HaEdah on Yerushalmi Yoma 5:2 (1809:939; 1443:1255) and Melechet Shlomo Yoma 5:1 (1151:177), in the first option's card.
- R. Meir: Yoma 51b (107:1318-1320), 52a (107:1323); Rashi (2157:1951, 1953); Ritva (1940:789); Meiri (2199:464); Rabbenu Chananel
  (2135:478, a reversed reading); Lechem Shamayim Yoma 5:1 (1094:215).
- Solomon's vessels: Menachot 99a (131:3528-3531) - R. Yose b. R. Yehuda "לא היו מסדרין אלא על של משה" (3531; the first draft of the
  card said only "תנא קמא" - corrected); Rashi there "פעמים בזה פעמים בזה" (2186:4706); Yerushalmi Shekalim 6:3 (154:206) with the
  names the other way round, and the Sirilio (1752:1169); Melechet Shlomo and the Rashash on Shekalim 6:4 (1152:217; 703:74).

## Done (patch218.py on the built bundle of 2.0.8 = unified-plugin/sheni/bundle.js of 2.0.17)
- A. heichal: TYT_OUT 3, TYT_AMAH 0.35, TYT_Y 5.5; mkPar(x, open, h, reaches) - a flap for each reach (a triangle from the wall's
  corner to the hook; slab + two woven faces, the east face on the side whose normal points up; a roll along the bend; a gold peg
  and ring). The outer: 3 amot into the heichal. The inner: within the amah between the two (0.35, small) - and 3 amot when there is
  one parochet (R. Yose, R. Meir). parochetFold.set("tyt"); parochotCount "one" | "meir" | "two".
- R. Meir's walk: PATH.meir / BACK.meir / KEYS.meir, HOLD and HOLD_FROM per mode, CAPS.meir with the Gemara's words; the approach of
  PATH.two straightened beneath the TYT flap.
- B. Solomon's vessels lit: bread and frankincense on the ten tables, 70 flames on the ten lamps (flicker); solomonVessels.setLit.
- C. GATE_PAROCHOT_218: nine curtains - north x -78/-48 (z -70.7), south -78/-48/-18 (z 70.7), the moked (-18, z -58.65), Nikanor (x 98),
  the heichal (1.65) and the ulam (17.75, in __ulamFrontCut); spread / raised; raised by themselves in a demo and when the segment eye ->
  target crosses the opening (0.9/s). ALIYAH_PAR_218: the upper storey's two (x -44.5 / -45.5, y 67-107), wall to wall (19.94) or the
  Lechem Shamayim (10, the pispasin's middle posts hidden).
- D. UI: sh47 + o2 R. Meir; sh56 + o2 the TYT; sh57 (new) the bread and the lamps on Solomon's vessels, kept in step with sh45; sh58
  (new) the openings' parochot; sh59 (new) the upper storey's; the place "שלוש עשרה הפרוכות"; the bullets of three cards; the YK place
  card; "מה חדש" 2.0.9 (seven lines, the last on the choice screen's bar). Card texts: "במודל:" and "בחירת מודל", as everywhere.
- בית ראשון 1.4.8 (src/70-ui.js): Rashi in the card of R. Elazar b. Shamua, the ref 2186:4706; "מה חדש" (with the bar).
- The shell: #uni-bar in unified/shell.html (Otzaria: #uni-bar-otz, the switch set-reader -> storage tm.ui.readerButton; set-search shown
  disabled until 0.9.99; the one-file HTML: #uni-bar-web); tools/build-unified.mjs - `when` on the books' button, update-check.js into
  the shell of the one-file HTML only; unified/update-check.js builds into the bar.

## The build
patch218.py (bundle208.js -> bundle218.js) -> house_sheni.py <bundle> 2.0.9 <dir> -> build-unified.mjs --rishon plugin --sheni <dir>.

## Checks (checks/)
qa-unified.mjs: 20/20. bar.mjs: 19/19 (in Otzaria and in the one file; seven window sizes and reading fonts; storage set/get; no update
button in the house menus). look.mjs with steps_a-d.json (the TYT flaps, R. Meir's and the others' walks frame by frame, Solomon's
lights, the nine curtains spread / raised / by themselves, the upper storey both ways) and steps_rows.json (every new option of the
rows, and sh45 / sh57 in step).
