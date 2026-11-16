# Round 211 (14.11.2026 evening) — B2 2.0.2 / B1 1.4.4 / unified 2.0.11 — DO NOT PUBLISH until the user says

Sources: all pulled and sent to the user (parts א–ה). Local library export: /home/claude/texts (lq.py via /home/claude/tools211/q.py, ln.py).
PC library: device_bash `cd $HOME && python3 q.py grep|books|lines|ref` (seforim.db).

## Standing requirements for this round
- Every change also in the guided tour ("מצגת", 75-tour / port_tour / tour_2xx) and in the cards (content.json INFO/PLACES/SHITOT).
- At the end: unify menus, update all toggle texts and card texts. Both houses where relevant.
- "מה חדש" written for outsiders. No English to the user. Full punctuation.

## Decisions received
- 1 yesod Rav/Levi: keep the toggle, make the difference visible.
- 2 ulam width: remove the gold surface blocking the view.
- 3 Helene tablet: aimed view + marker.
- 4 fill empty chambers (פרוה, אבטינס, מלח, פרהדרין, Levites on duchan) — deep, sourced.
- 5 shorten long cards (my reading; user didn't object).
- 6 don't publish yet.
- 20: mark Yehudah/Binyamin strip in the model (toggle) + card.
- 4 menorot approved (card: "מספר המנורות אינו מפורש במשנה — בחירת מודל"); + demo of פרחי כהונה filling oil.

## Decisions 22:22 (reply to sources parts א–ג)
- parochot: ADD R' Yose (one parochet) as toggle option. Parochot demo: excellent.
- rovad 4: mark BOTH opinions.
- golden stands: default OFF (Yom Kippur only — two stands; R' Yehudah one).
- machtot toggle, kevesh east/west: approved.
- small sanhedrins: plain-Mishnah option → "פתח הר הבית" to the RIGHT of Shushan gate, may be at some distance.
- duchan: yes there's a dispute (exists).
- soreg: add toggle "13 breaches — Greek period" default off.
- sleeping in Beit HaMoked + key: also into the demo.
- fire from Beit HaMoked: USER WAS RIGHT — Tosafot Yoma 15b (R"Ch) + Shabbat 20a; vs Rashi (warming) and Rambam Temidin 2:9. Proposed: optional demo step "לשיטת ר״ח" (awaiting OK).
- birkat kohanim: hands above heads, palms facing the people and the altar.
- all other items V.

## Decisions 22:25 (parts ד–ה)
- trumpets: demo = only morning blasts; + toggle showing the 2 trumpeters on the marble table.
- onkaliot: iron color. chavitin: oven AND frying pan. kevesh: ONE ramp (parah) only, change mountain shape.
- all other V. Stone color: asked again (extend existing "בניין הורדוס" marble option to the walls?).

## Pending user decisions (asked)
- Kevesh: (1) one ramp (parah) + mountain shape only, or (2) add a separate scapegoat ramp.
- Stone color: (1) as now, (2) Herod marble toggle (NOTE: shita "בניין הורדוס" ALREADY has a floor-marble option — tell him), (3) ancient stone.
- Birkat kohanim: hands above heads (Mishnah); palms facing forward? 
- Rovad 4: mark both opinions in a toggle? (proposed)
- Small sanhedrins: ALREADY EXIST (place "שתי הסנהדראות הקטנות" + shita with Rashi/plain Mishnah) — correct my earlier proposal; check why not visible.

## Items (status: todo / doing / done)
### Stage A
- [x] soreg: DONE (dark wood 0x5e4636, SOREG_211 in 20-mount.js; label changed -> add LABEL_MAP entry!) cedar diagonal lattice, two layers, rails (20-mount.js soregSide) + label + card line
- [x] compass larger DONE (B1 70-ui.js CSS scale 1.25; B2 tools/ui_211.py) (both houses: B1 70-ui.js, B2 port_ui/ui patch #tm-compass 58px)
- [x] (needs visual check) KG avnet colors better mixed (55-tamid.js belt palette; 55-payis.js) — both houses if B1 has priests
- [x] (needs visual check) priests' avnet wider (3 fingers) (55-payis.js gSash; 55-tamid.js G.belt)
- [x] sovev thicker DONE (SOVEV_211) & clearer (40-altar.js)
- [x] oil jugs color (JUG_COLOR_211; recheck render after jugMat white) ≠ shelves (30-courts.js OIL_SHELVES_210)
- [x] lambs: pens DONE (LAMBS_211)/fences + more realistic (30-courts.js LAMBS_210)
- [ ] railings on all stairs Har HaBayit→Azarah + "בחירת מודל"
- [ ] dec.1 yesod Rav/Levi visible difference (40-altar.js)
- [ ] dec.2 ulam width: gold surface blocking (50-heichal.js ulamT)
- [ ] dec.3 Helene tablet view + marker (57-add208.js heleneTablet, content place)
### Stage B (chambers / elements)
- [ ] 7 kli shir chambers (2) under Ezrat Yisrael, open to Ezrat Nashim (Middot 2:6)
- [ ] 8 Nikanor wickets (Middot 2:6) — CHECK existing "4×8 כפשפשי ניקנור"
- [ ] 10 four menorot in Ezrat Nashim toggle (default off) + oil-filling demo (Sukkah 5:2-3, 52b; Rambam KH 8:6)
- [ ] 11/32 immersion: on Water Gate (chol, beside Avtinas/his chamber) + Parvah roof (kodesh) — CHECK existing
- [ ] 12 golden stands (2; R' Yehudah 1) in the Heichal
- [ ] 13 railings (stage A)
- [ ] 14 small sanhedrins — check visibility
- [ ] 19 mezuzah at Nikanor gate + card (Yoma 11a)
- [ ] 24 Beit HaMoked NW room: descent to immersion (Middot 1:6, 1:9), tunnel with lamps
- [ ] 25 lepers' mikveh in a building + view + 40 se'ah (Yoma 31a)
- [ ] 26 Rosh mode: enclose all 4 Ezrat Nashim chambers like the lepers'
- [ ] 30 "לשכת דיר העצים" label+card (Rambam BHB 5:8)
- [ ] 31 Pinchas: compartments of garments (96 windows, Rambam KH 8:8-9) + table with white garment
- [ ] 33 chavitin: kohen putting chavitin into an oven (static) (Menachot 50b)
- [ ] 4 fill: Parvah (salting hides; immersion on roof), Melach (salt), Madichin?, Avtinas (upper room, teaching chafinah, incense), Parhedrin (dwelling), Levites on duchan (12+)
- [ ] rovad 4 marker toggle (Yoma 4:3; Rashi; Meiri/TY vs TYT)
- [ ] 3 machtot toggle (Yoma 4:4)
- [ ] 20 Yehudah/Binyamin strip toggle (Yoma 12a + Rashi; Zevachim 53b + Rashi)
- [ ] north-for-slaughter toggle 3 opinions (Yoma 36a)
- [ ] B2 kelim toggle like B1 (relevant vessels: Tamid 3:4, 3:6, 7:2)
- [ ] 18-list2: label fix ננסין/אונקליות (Middot 3:5) — check labels
- [ ] parochot gap = 1 amah — check model
### Stage B demos (B2 morning service 55-tamid.js; B1 mechona 45-vessels.js)
- [ ] kevesh ascent east / descent west — close view + arrows (Yoma 4:5)
- [ ] short parochot demo: KG enters at south (outer pinned open at S), walks north between, enters at N (Yoma 5:1, Rashi 51b)
- [ ] kohanim sleeping in Beit HaMoked (Tamid 1:1) + key slab (Middot 1:9)
- [ ] payis: close-up of pointing fingers few seconds
- [ ] "שלום הכל שלום" tangible (Tamid 1:3)
- [ ] fire from Beit HaMoked — NOT adding (Rambam Temidin 2:9) — told user
- [ ] ma'arachot: old pieces pushed aside burning (Tamid 2:1), new arrangements unlit, light kindling in gaps (2:4-5), third "קיום האש" burning (Rambam 2:4)
- [ ] bring lamb from lambs' chamber (Tamid 3:3); water it with gold cup (3:4)
- [ ] barkai announcer clearer (Tamid 3:2)
- [ ] B1 mechona: wash the innards for real; kohen right hand on right foot (Zevachim 19b)
- [ ] hatavat haneirot fix (Tamid 3:9, 6:1) + lamps facing middle always (Menachot 98b + Rashi)
- [ ] Levites: instruments (nevalim 2-6, kinorot ≥9, tziltzal 1; no chalil daily), ≥12 Levites, memuneh (Shekalim 5:1; Rambam KH 3:4, 7:5)
- [ ] birkat kohanim: hands above heads; more kohanim (Tamid 7:2) — palms per user
- [ ] nesachim & menachot: solet, chavitin, wine (Tamid 4:3, 7:3)
- [ ] trumpets daily (Sukkah 5:5) — answered yes
- [ ] inner altar dishun clearer: teni, handfuls, ashes to the pile east of kevesh (Tamid 3:6, 3:9, 1:4)
- [ ] terumat hadeshen (Tamid 1:4) — check existing
- [ ] real 3D coals on the altar
- [ ] nivreshet sparks at sunrise (Yoma 37b)
### Stage C
- [ ] Temple Mount mountain-shaped terrain; kevesh emerging (after decision)
- [ ] stone color (after decision)
- [ ] shorten long cards
- [ ] unify menus; update toggle/card texts; tour (מצגת) updates
### Corrections to tell the user
- Small sanhedrins already in the model (2 opinions). Herod marble floor option already exists.

## Done also (22:30-22:45)
- CURSOR_211 magnifier cursor always over the canvas (both houses 90-entry.js) + HELP_211 plain-language navigation help (B1 70-ui.js direct; B2 via tools/help_211.py called from tools/ui_211.py)
- SOREG_BREACH_211: 13 breaches geometry + ctx2.shared.soregBreach.set("greeks"|"repaired") — NEED shita row (rows_211.py)
- LOAD_211: renderer.debug.checkShaderErrors=false (both). Measured: no load-time change 2.0.5→now (headless ~5s). Asked user where/when.
- Stone color: user wants a CHECKBOX in the settings (like תוויות / סיבוב איטי / מעבר דרך קירות), default ancient stone — TODO
- Discovered existing: descent to immersion in Beit HaMoked NW room exists (1.5.0) — check visibility; small sanhedrins exist; Herod floor marble exists.

## 14.11 23:15 — state after the model switch (Fable) — READ SOURCES_211.md (the 45 source points + the user's replies + photos + garments site)
- PUBLISH RULE NOW: after EVERYTHING is done + >=4 fresh review agents + fixes -> "מה חדש", publish (store + HTML + PC copy). Not before.
- Verify every "done" item by a render before counting it (the user: "לוודא מה בוצע ומה לא").
- Git attribution from now: Co-Authored-By: Claude Fable 5.2 <noreply@anthropic.com> + Claude-Session line.
- DONE since the list above: railings RAILS_211; yesod tint+labels YESOD_211; stone checkbox STONE_211; cursor; help; soreg dark; breaches geometry.
- Chel: Bartenura — shrink podium to the wall line (30-courts.js: azarah podium box 197x13.35x155 -> z width 140; EZN podium 137.5 x 155), fix gate flights (12 at z 97.75, 15 at z 85, 5 at z 70), zoneHel strips (20-mount.js), Gazit hall foundation, labels.
- Ulam roof blocking the top view: meshes at y 130.5/132 in heichal group (fff1c8 / f1e4c8) — hide in the row view; camera farther.
- Fire from Beit HaMoked: APPROVED as demo step "לשיטת ר״ח" (Tosafot Yoma 15b).
- Earlier-today tasks to re-verify (2.0.10): #115 Beit HaMoked names toggle (Tamid), #116 shulchan hachalavim, #117 oil/lambs/wood chambers, #118 citation fixes, #119 outside visual review fixes.
- Order: A (chel, ulam view, Helene, yesod cam, onkaliot, avnet check, rows/cards) -> B1 lambs -> B2 B1-king -> B3 garments toggle -> B4 chambers -> B5 shita toggles -> B6 demos -> C terrain/cards/tours/menus/load -> agents -> fix -> publish.
- [x] 23:55 STONE tint v2 (all walls+chambers, Temple building untinted via fresh twins; both houses) — verified by render.
- [x] 00:20 CHEL_211 done in geometry (patch_chel.py; backup snap/b2src-src-before-chel211.tgz): podiums to wall faces, landings+flights along walls (S east, N west), Beit HaMoked base+north flight (soreg opening moved to x 3.5), Gazit base + 32-step flight, g13/g13r small gates' landings, Rosh moked east gate flight, zoneHel strips, guards, demo memuneh path. TODO: chel/soreg card texts ("במודל"), check tour views near the old ledge.
- 23:36 USER: kiddush yadayim ve-raglayim (right hand on right foot, Zevachim 19b) ALSO in the B2 morning demo (kiyor stage).
- [x] 00:55 ULAMVIEW_211: row cams [9,215,0]->[7,60,0] + top frames (blue hollow / orange chalifot) shown while the ulam roof is open (50-heichal.js) — rendered OK.
- [x] HELENE_211: glow frame feature heleneTabletGlow + cardOnly row 'הנברשת והטבלא של הילני — מבט' (near view [9.8,27.1,-15.2]); OPS_P in port_ui.py.
- [x] SOREG breaches row 'הסורג — שלוש עשרה הפרצות' (cams [82,6,94]); yesod cams [86,21.5,40]->[70.5,16.6,24.5], labels moved.
- [x] ONKLIOT_211: iron grey hooks (thicker), labels 'עמודים ננסין' / glow labels.
- tools/rows_211.py is the round's content step (in chain.sh); new rows MUST be added to WANT_ROWS in tools/rows_198.py (walk order) or the chain fails on its 2nd run.
- NEXT in stage A: avnet check vs photo p01; then draft A (B2+B1+unified build, NO publish), send HTML to user. Then stage B.
- [x] 01:40 Draft A sent (טיוטות/בית המקדש - טיוטה לצפייה - שלב א.html; unified qa 20/20). Stage A done (avnet check deferred to B3).
- [x] LAMB_211: realistic lamb kit in 10-core.js (H.lambKit: pose(stand|look|graze|lie) geometries + build() articulated); chamber uses instanced poses; demo lamb (55-tamid.js) uses kit. Card text updated. Rendered OK.
- NEXT: B2 (B1-house king: new dignified figure, leaning on the animals per the Midrash, 3 readings + "דבקו שערים"); then B3 garments toggle (site mikdash3 + photos), B4 chambers...

## 15.11 00:09-00:30 — USER TESTED DRAFT A; NEW ITEMS (verbatim gist; all acknowledged in chat). KING (ב2) PAUSED mid-way (only code reading done).
N1. "תבדוק אם לשכות העזר"נ היו מקורות" — SOURCES FOUND (library): Mishnah Middot 2:5 "ולא היו מקורות... ואין קטרות אלא שאינן מקורות"; Rambam BHB 5:7 "ולא היו מקרות וכן עתידין להיות"; Bartenura 2:5; R. Shemaya "כמין חצרות הן"; TYT 2:5 "כדי לבשל בתוכו"; Rosh (6035): "מבחוץ... ולא היו מקורות בבית שני". TODO: check the model (are the 4 chambers roofed?) + report.
N2. "דעת הרמבם שכל העזרה היתה מקורה" — Rambam BHB 5:1 "הר הבית... וכלו היה מקרה סטיו לפנים מסטיו" (about HAR HABAYIT). Boaz Middot 2:1: "לכאורה משמע... שכל העזרות... מקורין. וכן הבין הש"ג... ולפענ"ד... שגה" (proofs: chambers of EN unroofed; achsadraot Tamid 1:3; Rashi Pesachim 13b); TYT Middot 2:1: only over the itztabaot at the sides; Lechem Shamayim: all Har HaBayit roofed (vs TYT); Even HaAzel BHB 1:13: "העזרה לא היתה מקורה"; Kesef Mishneh 5:1 (Pesachim 13b, Sukkah 45a); Mishneh LaMelech 5:1 (Yerushalmi Taanit 3:8). TODO: report, user decides (toggle?).
N3. CURSOR: Enter must zoom into the place under the cursor (both houses) + update help text.
N4. Lishkat HaNezirim: more elements (Middot 2:5: cook shelamim, shave, hair under the dud) — send list + sources, then build.
N5. BUG lambs' chamber row: eye lands 0.3 from target (cam_keepInside pulls the eye to a tmPass hit near the target). Reproduced: qa/r211/rowprobe.mjs, rowsdist.mjs. FIX cam_keepInside (ignore hits near the target / small flat things). Video: dome "closes immediately".
N6. "הממונים שבמקדש לא מציג כלום" — row shows only a far top view. TODO: show the 15 officers at their places (figures/labels; unsourced places = בחירת מודל).
N7. SOUND in the morning demo (memuneh knocks, gate opens, magrefa, tziltzal, trumpets, shir...) + N12 sounds in the payis demo too; mute button. Send the list with sources first. (Audio code exists: b2 50-heichal.js:1682, 55-tamid.js:2187; b1 55-interior.js:1299, 60-palace.js:689.)
N8. "הגלילה ל360 רצה מדי, נגעת בהגדרות?" — check rotate speed vs published 2.0.10; likely the eye-too-close bug (N5).
N9/N13. "לשכת הכלים — מה הוא מציג?" + "אמורה להציג את מה שהיה בה": show the vessels (Tamid 3:4 "תשעים ושלשה כלי כסף וכלי זהב") inside one cell; clear view (no parochet section, no stray labels/pills). Place = model choice (Tiferet Yisrael "אפשר" one of the cells).
N10/N11/N14. Blank views in the opinion rows = the SECTION of "לשכת הכלים" (sectionFor x=-38) stays when an opinion CHIP is clicked next (chips do not call ctx.shared.closeAuto; only place buttons do: b2 70-ui.js:3090 / b1 70-ui.js:3881). FIX in the first house's 70-ui.js (source of port_ui.py) — chips call autoOff.flush + closeAuto. ALSO: walls fade (see-through) in rows about a wall's height ("גובה כותל המזרח") — the wall under discussion must not fade.
N15. "לשכת בית האבן — תוספות חוץ לעזרה": the user's screenshot (/mnt/user-data/uploads/c223bcf5-image.png) IS the wanted angle — reproduce, set as the chip's view, send a picture.
N16. On-model pills ("הסר ענן", "פתח את האולם", "הדגמה: פתיחת ארבע הדלתות") float in views they do not belong to (e.g. Nikanor gate) — fix visibility rule.
N17. Slaughter area row: option "הראבי״ה והגר״א — שורה אחת" is WRONG as merged. Ra'avyah (TYT Middot 3:5, lib 948 line 133): "פי' שבין המזבח ולעמודים... כל דממזרח למערב עמודים ח'. שלחנות שמנה" (tables between the altar and the pillars); Gra (7509 lines 67-68): 7 tables opposite the gaps + the 8th outside the end pillar. Proposed to the user: split into two readings — WAIT for his decision.
N18/N19. "מידות המזבח": side view from inside the azarah for readings about yesod/sovev (top view only for roof-only readings); labels: ONE per level, each level its own colour, like the first house's markers (the top-view screenshot with "20 אמה" x5 = unacceptable). Asked him: Rashi (sovev) vs Ra'avad (horns = roof only).
N20. Ramp vs altar: the ramp is one wedge down to the floor, swallowed by the sovev/yesod — gap seen only above the sovev. Interpretive: sources (Zevachim 62b + Rashi, Tosafot, Rambam BHB 2:13 "פרוח ממנו אמה על היסוד ואמה על הסובב. ואויר מעט"), pictures of options, user decides.
ORDER NOW: bugs N5, N8, N10/14, N16 -> N15 -> N18/19 -> N20 -> N17 -> N1/N2 report -> N3 cursor -> N9/13 -> N6 -> N4 -> N7/12 -> back to the king (ב2) and the rest of stage ב.

## 15.11 00:30-00:36 — MORE ITEMS
N21. Row "צורת התאים" (8 readings): messy — drawings, cards, chips. Redo: one clean section, only the differing numbers (bold, coloured), short chip names, card opens with "what differs". Send ONE sample reading first.
N22. Wicket demo ("הדרך מן הפשפש לשער הגדול", both readings): a whole KOHEN, not a hand.
N23. (IMPORTANT) "שמות הלשכות שבבית המוקד": on picking a reading run a short demo chamber by chamber (big name, changed names coloured), end on a far view with all four names.
N24. N17 decided: SPLIT. Ra'avyah: 8 pillars E-W + 8 tables in their own E-W row between the altar and the pillars. Gra: ASKED the user — row N-S (my reading of his reckoning) or E-W with tables opposite the gaps? Build only the Ra'avyah until he answers.
N25. Ra'avad's tapuach: the slab is painted black (looks as if it swallowed the ma'aracha). Sources verified: Ra'avad Temidin 2:7 (5256 line 7); LECHEM MISHNEH there (4030 line 26): "הניח אמה מכל צד כדי שישימו שם גזרי המערכה שהם אמה על אמה... עשו טבלא גבוהה עשרים ושתים על כ"ב וקצרו בטבלא ב' אמות...". Redraw: slab in the altar's stone, ash only at its middle, the 1-amah strip + cut corners clear with logs (E-W, heads touching the slab) and fire; side view; add the Lechem Mishneh to the card.
DONE in source (not yet built/tested): CHIP_CLOSEAUTO_211 (b1 70-ui.js: chips that fly call autoOff.flush + closeAuto; card chips too) — reaches b2 through port_ui.py; KEEP_NEAR_211 + ROOF_HOLD_211 (both 90-entry.js). Backups in /home/claude/snap/. QA tools: qa/r211/allviews.mjs (every row/chip: distance + blankness), rowprobe.mjs, rowsdist.mjs, keephit.mjs, pageshot.mjs (real page screenshot incl. pills).

## 15.11 00:45 — summary sent to the user (what was / doing / left). State:
- Built b2 with: CHIP_CLOSEAUTO_211 (tested OK: kelim -> wall chip shows the model), KEEP_NEAR_211 (tested: lambs' row lands right), ROOF_HOLD_211 (untested), FADE_HOLD_211 (mechanism: 90-entry.js fadeHold + 70-ui gate; b2 rows marked noFade in rows_211.py sec. 6: east wall height, Shushan, soreg, EN gates, EN chambers' place, Tadi) — UNTESTED; b1 NOT rebuilt since FADE_HOLD (run node tools/build.mjs).
- b2's 70-ui.js comes from the FROZEN /home/claude/b1/src/70-ui.js (Nov 11) via port_ui.py — a UI fix must be made BOTH in beit-rishon/src/70-ui.js AND in b2 tools (ui_211.py rep()).
- User's file (/mnt/user-data/uploads/1cdb6fe4-attachment.txt, from "המשיב") on the Ra'avyah; verified in lib: Rashash Middot 3:5 (750 lines 50-51): "להראבי"ה משמע דהעמודים הי' בסדר אחד ממזרח למערב וכן השלחנות לפניהם" + emendation "שבין הטבעות ולעמודים"; "ובציור הרמב"ם מסודרים העמודים כדעת הראבי"ה ושלחנות באמצען". Melechet Shlomo Tamid 3:5 (1202 line 102): Ra'avad "מכוונים היו כנגד בין העמודים אבל ודאי מרוחקים היו ד' אמות"; Rosh "תרי גווני שלחנות".
- OPEN QUESTIONS to the user: (1) Gra's row N-S or E-W; (2) altar measures: which reading is roof-only (Rashi / Ra'avad).
- N1 answer given: EN chambers unroofed (model: saw wood + lepers' chambers open; check the other two). N2 answer given in short; full quotes + his decision (draw?) still owed.
- NEXT: test FADE_HOLD (pageshot of the 6 rows), pills (N16), Beit HaEven angle (N15), rotate speed (N8) -> corrected draft A2 -> group ב of the summary.

## 15.11 00:53-01:00 — USER DECISIONS
- Gra (N24): row NORTH-SOUTH (pillar, table, pillar ... in one line; the 8th table sticks out 4 amot toward the rings). Ra'avyah: 8 pillars E-W, 8 tables in their own row before them (Rashash). "המשיב" has no Gra book; our quote is from lib 7509 (Middot 5:2), told him where.
- N18: Ra'avad = roof-only (stays top view); RASHI moves to the side view (yesod/sovev).
- N20 ramp: "ראש מדורג עם רווח כפי שכתוב" — the ramp's head cut in STEPS along the altar's profile, a gap all the way down, its size per each reading (hair / Tosafot / R. Chaim) as written.
- N2: NEW OPINIONS ROW for Har HaBayit's roofing — TYT (only over the itztabaot at the sides) vs Lechem Shamayim (all Har HaBayit roofed); Shiltei HaGiborim (courts too) in the card with Boaz's rejection.
- Sounds: speech as CAPTIONS only; other sounds synthesized (knock, gate, magrefa, tziltzal, trumpets, played shir) + mute button.
- King (ב2): ROYAL DRESS (tekhelet, argaman, gold) on a more real figure — not the white robe.
- PILL_HOME_211 done in both (a pill whose place is under the card/panel is hidden unless it is on). TODO pills: hide when the anchor is in the half cut by the live section; hide behind faded walls (occluded() skips transparent<=0.5).
- pageshot.mjs now has a 170 s screenshot timeout (heavy views).

## 15.11 ~01:20 — progress
- [x] N10/11/14 CHIP_CLOSEAUTO (tested). [x] N5 KEEP_NEAR (tested on the lambs' row). [x] N14 FADE_HOLD (tested: east wall whole). [x] N16 PILL_HOME (a: hidden when under card/panel — and FOUND that PILL_FREE_210 never ran: #tm-panel/#tm-xcard are position:fixed so offsetParent===null skipped them; fixed in b1 70-ui.js + b2 tools/ui_210.py; b: faded wall hides an off pill; c: pill in the half cut by the section hidden). Nikanor view: no pills now.
- [x] N15 Beit HaEven (Tosafot) view = the user's angle, solved from his screenshot (qa/r211: least-squares on the chamber's corners): cam [43.5, 15.8, -121.7] tg [78.4, 15.2, -87.9] (rows_211.py sec. 7). His screenshot was in ROSH mode (EN chambers outside) — that is why big walls stood beside the chamber. Picture qa/r211/ps_even.png — SEND to him with the corrected draft.
- [x] N8 rotation: constants identical in published 2.0.10, draft and now (rotateSpeed 0.5, autoRotate 0.4) — the "too fast" came from the eye sitting on the target (N5). Tell him.
- N26 (01:00): "מה עם לשכת החותמות שבה גונזין את האבנים" — add place rows + cards for the three Beit HaMoked chambers without a row (chotamot/stones NE, lechem hapanim makers, descent to the immersion); draw the seals (Shekalim 5:3 "ארבעה חותמות... עגל זכר גדי חוטא"; Ben Azzai five) beside the stones heap (exists, 30-courts.js ~1741); place follows the names toggle. Verify quotes in the library first. Also his file on roofed chambers (/mnt/user-data/uploads/1fdd9a5d-attachment.txt): verify in the MODEL chamber by chamber: EN four unroofed, all the others roofed.
- running in background: allviews places scan b2 -> qa/r211/views_b2_places.log/json
- NEXT: corrected draft A2 (build unified via deliver or build-unified to /home/claude/dist-draft, qa-unified 20/20, HTML to /mnt/user-data/outputs/טיוטות/) -> N18/19 altar measures -> N25 tapuach -> N20 ramp steps -> N17/24 slaughter split -> N23 names demo -> N21 cells -> N9/13 kelim -> N6 memunim -> N26 chotamot -> N22 wicket kohen -> N3 cursor Enter -> N7/12 sounds -> N4 nezirim -> N2 new row (Har HaBayit roofing) -> king (royal dress) -> rest of stage ב/ג.

## 15.11 ~02:00 — DRAFT A2 built and sent (טיוטות/בית המקדש - טיוטה לצפייה - שלב א2 (מתוקן).html; unified qa 20/20; b2 places scan 87/87 OK, ops 114 OK; b1 sample 32 OK)
In A2: CHIP_CLOSEAUTO (+placeLeave({}) for flying chips), KEEP_NEAR, ROOF_HOLD, FADE_HOLD (6 wall rows), PILL_HOME (a,b,c + the offsetParent fix), Beit HaEven view (user's angle), MEASURES_211 in b2:
 - 40-altar.js: frames in 5 strong colours (b1's), ONE plate per level (rim = the line's colour; text "32 אמה (הבסיס)"...), measLayout each frame: side view -> ladder CLOSE beside the right silhouette corner, moved in to stay inside the free area (freeArea: clear of #tm-xcard/#tm-panel); top view -> two lines along the side at the foot of the picture. feature altar28 timed:false (stays while the reading shows; leaveFeat = F28 in the row's pick). Label rim: 90-entry.js makeLabelSprite2 l.rim (both houses).
 - views: side = cam [84, 28.5, -24] tg [56.5, 20.5, 8] (THE USER CHOSE THIS: "זה עדיף, רק יותר צמוד למזבח"); Ra'avad top = [56, 74, 19] -> [55.5, 24, 9]. Place "מידות המזבח — 32..." also side.
 - tamid-demo pill hidden while the measures show.
TODO from this: port MEASURES_211 (one plate per level + ladder) to the FIRST house's altar measures (b1 40-altar.js ~L990: still 4 sides x levels + height post).
NOTE: the user SEES the pictures I open with Read (he screenshotted my contact sheet) — pictures are a channel to him.
NEXT: N25 tapuach (Ra'avad) redraw -> N20 ramp stepped head with gap per reading -> N17/24 slaughter split (Ra'avyah E-W rows; Gra one N-S line) -> N23 names demo -> N21 cells -> N9/13 kelim -> N6 memunim -> N26 chotamot rows -> N22 wicket kohen -> N3 cursor Enter -> N7/12 sounds (speech = captions) -> N4 nezirim (already has hearth/pot/hair/stool+razor: ADD figures, more cauldrons, basket of matzot — sources Numbers 6:18-20 / Mishnah Nazir 6 must be fetched: not in the local library) -> N2 new row Har HaBayit roofing -> king (ROYAL dress) -> rest.

## 15.11 ~02:25 — after compaction #N; new items 01:47–02:00 (all answered point by point)
DONE since last note: TAPUACH_211 (N25) built+rendered (cs_tap1.png OK; NOT yet shown to user). RAMP_STEPS_211 (N20) coded in b2 40-altar.js (wedgeGrooved(..., o) with o = {zM, zL, yS, yY}; heads per reading) — built OK, render from SW (rp_sw_*.png) shows nothing clear yet (labels in the way; need a clean close picture with labels off) — NOT yet shown; b1 port pending.
NEW (user, 01:47–02:00):
- M1 menus: "שלא יהיו קפיצות במסך אלא הכל לפי הסדר" + "לסדר את הקטג' לפי סדר המסך": categories (DETAILS.tm-pl) and the items inside in ONE walking order from outside in (Har HaBayit+gates -> chel+Ezrat Nashim -> Azarah+gates -> its chambers -> altar -> Ulam+Heichal -> KK, cells, upper floor); SHITOT rows in the same order; both houses. At the menus-unification stage. b2 categories now: שערי הר הבית וחצרות / שערי העזרה / לשכות / מזבח וכלים / ההיכל ופנים / שיטות.
- M2 "לשכת עושי לחם הפנים — חפש עכשיו מקורות וצייר את תוכה": sources SENT 02:25 (Middot 1:6; Tamid 3:3; BHB 5:10; Bartenura; Menachot 11:1-2; Rambam Temidin 5:6-10; TYT Middot 1:6 (baking only) vs Yachin Middot 1:6 "שם לשין ואופין" ; Zevachim 95b metal oven; Menachot 94a three moulds; 95a "כמין כוורת" + Tosafot (perforated); Yoma 38a Beit Garmu + Rashi). ASKED: baking only / kneading too / toggle. Drawing the agreed part (oven, 3 moulds, 2 loaves baking, 12 loaves on a board, baker drawing a loaf out). Chamber = SE of Beit HaMoked: cx = MOKED_X + 8, cz = -61.5, 6x6, floor y 16 (south chambers' floor as seen is 16).
- M2b Beit HaMoked chambers roofed: TOLD him I add a ceiling to each of the four chambers (fades when looking in) unless he objects.
- M3 (01:53): officers place still shows nothing (N6 — moved up: right after the lechem-hapanim chamber); hooks colour (cause: the button's floating YELLOW marking; base iron light grey) -> marking in bright steel, base darker iron; Ra'avad LAST in "מידות המזבח" readings; "בריחה של הכרטיסיות": measure plates went under the bottom bar in the top view (freeArea must count the bottom bar; keep the plates by the altar, inside the free area).
- M4 (01:54): panel's last row ("התפוח") cut at the panel's bottom edge, chips spill out -> fix scroll/height, both houses.
- M5 (01:55): small ramps "לא טיפלת": booklet photo p02 (/home/claude/qa/r211/photos/p02.jpg, crop p02_crop.jpg): the small ramp to the sovev = a narrow strip that is PART of the big ramp's surface at the bottom (no vertical end face) and then splits and rises more gently to the sovev, alongside the big ramp's east side. Wanted: Tosafot — both sovev ramps (east + west); Rashi — the one (east). Model now: block 3 wide from z 33 with a vertical 2.7 face (west/Tosafot from z 24, 5.2 face). TODO: side-by-side picture + confirm, rebuild (west: mind the yesod path, the rubuva window, the two tables).
- M6 (02:00 + video): cursor: Enter = zoom in at the place under the magnifier (half the way), Shift+Enter = back, double-click = same; stop before walls/floor (his video ends in a white screen); update the navigation help. Both houses.
ORDER NOW: quick fixes (Ra'avad last, plates, panel cut, hooks, Enter) -> draft A3 -> lechem-hapanim chamber + ceilings -> officers -> small ramps -> ramp picture/b1 port -> slaughter split -> the rest as listed above.

## 15.11 ~02:50 — quick-fix batch (ALL in both houses unless noted)
DONE+tested: RAAVAD_LAST_211 (b2 rows_211 8b + port_ui pick by name); MEAS_SCREEN_211 (tools211/meas_layout.py generates the plates' ladder layout for BOTH houses — screen-space: right of the altar's outline, else left, else at the free part's edge; freeRect counts panel, card, header.topbar, #tm-nav, #tm-compass); MEASURES_211 ported to b1 (tools211/b1_meas.py: one plate per level + rim, features timed:false, flyPoint mizbeachMeasures from the side, height plates 1.3); CARD_ROWS_211 (#tm-xcard .o max-height 40vh + scroll; b1 direct, b2 via ui_211.py rep); ONK_MARK_211 (hooks marking = iron glint, b2 iron darker 0x4f545c); ENTER_ZOOM_211 (both 90-entry.js: Enter = half way to the point under the cursor, min 6 amot; Shift+Enter back; dblclick; help line via ui_211 ENTER_HELP_211 / b1 direct); PLACE_NOFADE_211 (places with noFade hold the fade; b1 bar shura new view + band glow feature ctx.shared.barShura; b2 bar shura noFade); GAZIT_STRAIGHT_211 (b1 gazitTop cam x). quick1.py holds the patch script.
N20 ramp: b1's ramp ALREADY has the stepped head (prismGrooved pts) — nothing to port. b2 RAMP_STEPS_211 verified in renders (rg_sheet.jpg). Tosafot (Zev. 62b, 1936:663): big air at the head, "סגי במשהו" elsewhere -> lower steps keep a hair. Picture for the user still to send.
USER 02:10: lechem hapanim = option 3 (TOGGLE: baking only [TYT/Rambam] / kneading+baking [Yachin, R. Yehudah]); 02:13: Beit HaMoked enlarge = option B (W 24 -> 32, chambers 10 x 7; move Abba Yose's small gate (x -36 -> ~-38.5) and the Rosh's stairs; update morning + payis demos, tour views, place cams).
USER 02:40: at publish ALSO update the LONG DESCRIPTION in the Otzaria store (b1, b2, unified) — write for outsiders; send the text with the last draft.
RULE (promised 02:08): no draft goes out with a fix in one house only — check every fix in both before each draft.
SMALL RAMPS (M5): booklet p02: the sovev ramp is a strip that is flush with the big ramp from the FOOT up to the split (no vertical end face), then rises gently to the sovev. b1: toSovev pts [BRZ,0]->[foot,0]; b2: wedge needs a zFoot param; b2 Tosafot west: strip x 44.5..47.5 covers the rubuva window + the yesod path's start (move both in that mode), check the two tables' place. Send side-by-side + confirm.
NEXT: unified draft A3 -> send. Then: Beit HaMoked B + lechem hapanim chamber + ceilings; officers; small ramps; slaughter split; names demo; cells row; kelim; chotamot rows; wicket kohen; sounds; nezirim; Har HaBayit roofing row; king; menus order (M1); rest of stage ב/ג.

## 15.11 ~03:45 — CONTINUOUS MODE (user 02:43: "אל תשלח יותר טיוטות תעבוד ברצף אני הולך לישון"); state after Beit HaMoked + lechem + figures
MODE: NO MORE DRAFTS. Work to the end; interpretive questions go to the QUESTIONS list below; when he wakes: a short Hebrew report (done / left / % / the questions). Told him: 20-30 hours. Keep a send_later check-in pending at the end of every turn.
DONE (b2 unless noted; BUILD-OK, 0 load errors in BOTH houses after the last kit change):
- MOKED_WIDE_211 / FLOOR_211 (tools211/moked_211.py; backup snap/b2-30-courts-before-moked211.js): house 32 wide (x -34..-2), ONE floor at 16 (LV.KOH) with five inner steps at the chel gate (and at the Rosh's east gate), four chambers 9.5 x 6.5 x 6 high, each with a cedar ceiling (lishkotCut pill "crt-lishkot-roofs"), doorways to the middle strip; chC(sx, sz) = (X ± 10.25, Z ± 5.75), X = MOKED_X (-18), Z = -67.5; NASHIM_X small gate -38.5.
- LECHEM_211 (tools211/lechem_211.py + content_lechem.py): SE chamber: metal oven, 3 gold moulds, 10 + 2 loaves, baker; switch row 'לשכת עושי לחם הפנים — מה נעשה בה' (bake [init] / knead: trough, kneader, jars, 11 sieves); place card with verified refs.
- LECHEM_LEVI_211 (tools211/lechem_levi.py; rows_211.py sec. 11): THE MAKERS ARE LEVITES (user 03:15 with sources "תעשה כך - אנו תמיד נצמדים למקורות"; 03:16 "לווים לא היו בבגדי כהונה"): kind "levi", robe 0x8f8468, plain cap. Card: I Chr 9:32 (38:404) + Tosefta Shekalim 2:6 (193:16) + "שבית גרמו עצמם לויים אינו כתוב במפורש". The Ralbag he quoted is NOT in the local library — not quoted in the card (told him).
- PEOPLE_KIT_211C (tools211/people_211c.py -> BOTH houses' 30-courts.js, same text; backups snap/b?-30-courts-before-people211c.js): user 03:15 "יש בעיה עם שער שלהם הוא לא מקיף את כל הראש" -> hairLow/hairRing: hair ROUND the head (fringe under the kippah, sideburns to the beard / peyot, over the ears, behind them into the neck), also on the plain (mid) figure; kippah 14 faces round (mid 10); kohen's hat = the lottery priests' migba'at (PAYIS_FIGURE4D profile, bands in relief at the near level). Checked from 5 sides (qa/r211/hd_sheet7.jpg, heads_spec.py builds the test row at (40..55, 0, 150) — inside the view limits) and in the chamber (lv_sheet.jpg). b1 rebuilt, 0 errors, Sanhedrin seen with the new hair.
- RULE from 03:15: who the workers are = BY THE SOURCE per chamber (Levites where the source says Levites, kohanim where kohanim, "בחירת מודל" where none) — his earlier "כל הפועלים הם כהנים" is superseded by "אנו תמיד נצמדים למקורות".
- allq.py fixed (a zip in /home/claude/texts broke it: errors='replace').
NOT YET VERIFIED (edited for the new Beit HaMoked, never run): 55-tamid.js (hintY, SLEEP/RISE arrays, lamb scene path, CAMK.lamb) and 55-payis.js (MK ring, inMem/inTor tracks, Rosh-gate tracks). Tools: qa/tamid/{fullrun,cams,figs,lots}.mjs. ALSO: allviews scan of places/ops after the rebuild; tour slides that fly to Beit HaMoked; the chel side (stairs, small gate, g13r); Rosh reading inside.
QUESTIONS FOR THE USER (collect; do NOT decide alone):
 Q1. LOAF SHAPE: I told him a toggle "תיבה פרוצה / ספינה רוקדת" already exists on the table — WRONG, there is none (both houses draw "תיבה פרוצה"). Admit it; ask whether he wants such a toggle (table + chamber).
 Q2. SMALL RAMPS (M5): confirm my reading of the booklet picture (strip flush with the big ramp from its foot, splitting and rising gently to the sovev; both sovev ramps for Tosafot, the east one for Rashi).
 Q3. THE RALBAG on I Chr 9:32: not in my local library — add its words to the card as he brought them, or leave the card with the verse + Tosefta only?
 Q4. WHO STANDS WHERE in the other chambers/officers (N6): list per figure kohen / Levite / Israel with the source or "בחירת מודל" — to be filled as each is built.
ORDER FROM HERE: verify demos + views in the new Beit HaMoked -> officers (N6) -> small ramps (M5) -> slaughter split (N17/24) -> names demo (N23) -> cells row (N21) -> kelim (N9/13) -> chotamot/stones/descent rows (N26) -> wicket kohen (N22) -> sounds (N7/12) -> nezirim (N4) -> Har HaBayit roofing row (N2) -> noFade for other wall rows (N14, b1 too) -> king (ב2) -> rest of stage ב -> stage ג (mountain, short cards, tours, menus order M1, load time) -> bump versions (2.0.2 / 1.4.4 / 2.0.11) -> >= 4 fresh review agents -> fixes -> "מה חדש" + LONG store description -> publish -> HTML -> copy to PC.

## 15.11 ~05:45 — demos verified in the new Beit HaMoked; TWO OLD DEMO BUGS FOUND+FIXED; officers drawn
- Morning demo (55-tamid.js) in the rebuilt house: sleepers on the two ledges + floor OK; views moked/lot1/patrol raised to [-18, 50.5, -58.6] (house 32 wide); SLEEP_CLEAR_211 (two sleepers moved off the x -18 walking line; RISE[4], RISE[5] with them).
- LOT1_RING_211 — BUG THAT WAS IN PUBLISHED 2.0.10 (checked on /home/claude/dist-unified/plugin/sheni): Abaye's order, first lottery in Beit HaMoked: the ten priests sank to y 0 when they reached the ring (a ring spot [x, z, yaw] was given whole as a path point; its yaw was read as the floor's height). Fixed: [sp[0], sp[1]]. TELL THE USER.
- GAZIT_PLACE_211 — SECOND BUG THAT WAS IN PUBLISHED 2.0.10: the morning demo gathered the priests for the lotteries / Shema "in the hall of hewn stone" at (60, -63.3) = OPEN COURT west of the building (where the hall stood before 1.9.5); the hall is inner x 69..89, z -78..-56, lottery in its east half. Fixed: GZX/GZZ 84/-67, ellipse 4.2 x 7.4, officer at (84, -60), GZV = the lots demo's eye [[84.4, 53, -57.5], [84, 16.6, -67.6]], region "gazit" + hintY F for the hall, nodes GZ_OUT [81, -51.4] / GZ_IN [81, -57.4] / GZ_C [83.2, -61.4], edge CNE-GZ_OUT. Backup snap/b2-55-tamid-before-gazit211.js. TELL THE USER.
- tamidscan.mjs (qa/r211): every stage x 3 moments x both orders: 0 errors, no figure under the ground. Lots demo first scene OK in both gate readings (payisshots.mjs; PRE=...mokedGates.set('adjacent')).
- MEMUNIM_211 (tools211/memunim_211.py -> b2 30-courts.js after the guards' block; rows_211.py sec. 12): 15 officers as figures (kit) + discs (gold priests / red Levites / blue "tribe not said") + number plates "N · office" (far 1500, spread with leader rods where crowded) + name labels (far 130) + legend plate; feature "memunim" (timed:false; on with the place, off on leaving — tested); place cam [62, 250, 110] tg [62, 10, -5]; card: who is priest/Levite BY SOURCES (I Chr 9:30 Avtinas priests; Arakhin 11b + Tosefta Shekalim 2:14 gate-locking = Levites; Tamid 7:3 duchan; I Chr 9:32 Garmu) and which places are written / model choices. Petachya "זה מרדכי": plain dress (Esther is NOT in the local library — verse on his tribe not quoted).
  FOUND while placing: Israel's court free floor is x 82.5..85.5 and 89..90.9; the duchan block x 85.5..89; the east wall's mass from x 91.
 Q5 (for the user): officers whose tribe is not said are drawn in plain dress, blue plates — or does he want them as priests ("כל הפועלים הם כהנים")? Petachya = Mordechai (Binyamin) cannot be a priest.
NEXT: small ramps (M5) -> slaughter split -> names demo -> cells row -> kelim -> chotamot/stones/descent rows -> wicket kohen -> sounds -> nezirim -> Har HaBayit roofing row -> noFade rows -> king -> rest.

## 15.11 ~06:40 — SMALL_RAMPS_211 done in both houses (M5)
- b2 40-altar.js (backup snap/b2-40-altar-before-smallramps211.js): east sovev ramp + lower wedge to the foot (z 33 -> 42.6, flush with the big ramp); Tosafot's west ramp rebuilt as its twin (parting 2.7 up; was 5.2 with an upright face) + in that mode the yesod walk leaves the small ramp's outer side (path32T/path28T) and the rubuva is in its west face (rubT); ctx2.shared.ramps.set toggles D/T sets. Cards (rows_211 sec. 13): the 1.3.0 sentence replaced in 4 texts.
- b1 40-altar.js (backup snap/b1-40-altar-before-smallramps211.js): all small-ramp profiles run to the big ramp's foot ([42,0] / R. Yose's [44,0] / smallRT ft) instead of the upright face at BRZ; askew() straight below the parting; card sentence updated. NOTE: in b1 the YESOD ramp too was run down to the foot (coherence with Tosafot's wide western ramp) — the user asked only for the sovev ramps: tell him (Q2).
- Renders: qa/r211/sr_sheet.jpg (b1), sr_sheet3.jpg (b2: SE, SW+Tosafot, R. Yose's altar both).

## 15.11 ~07:40 — SLAUGHTER_SPLIT_211 done in both houses (N17/N24)
- b2 40-altar.js (backup snap/b2-40-altar-before-slaughter211.js): layouts bartenura / meiri / raavyah / gra ("oneRow" is gone). Ra'avyah: 8 pillars E-W at z -49.4, 8 tables in their own row at z -44 (4 from the rings' place -39, 4 from the pillars: Middot 5:2 "מן הטבעות לשלחנות ארבע, מן השלחנות ולננסין ארבע"; Rashash 750:51). Gra: ONE ROW N-S at x 51.75: 8th table (4 long) z -43..-47, then slim pillars (0.5) + short tables to -59.5 = 12.5 amot (the Rambam's "בית המטבחים י"ב אמות ומחצה"); hooks E+W. Hooks pill view from the east for gra. Row (rows_211 sec. 14): 4 options, pickJs keys, cams; place card summary split.
- SLAUGHTER_HOLD_211: 55-tamid.js enterWorld/leaveWorld + 55-payis.js start/stop show the usual layout while a demo runs (the priests' ways cross the Ra'avyah's and the Gra's rows) and give the viewer's choice back.
- b1 30-courts.js + 70-ui.js (backups snap/b1-*-before-slaughter211.js): layG book / meiri / raavyah / gra; Ra'avyah tables -47, pillars -52.5; Gra row WEST of the hall of hewn stone (x 46.5; on the altar's axis it would run into the hall), 8th table -46..-50, pillars to -59.3 (9.5 amot: slim 0.4, short tables); UI row chips/options/fly. 0 load errors.
- Renders: qa/r211/sl_sheet.jpg, sl_sheet2.jpg (b2), sl1_sheet.jpg, sl1_sheet2.jpg (b1), sl_ui_g.jpg (the row in the interface).
NEXT: N23 names demo -> N21 cells row -> N9/13 kelim -> N26 chotamot/stones/descent rows -> N22 wicket kohen -> N7/12 sounds -> N4 nezirim -> N2 Har HaBayit roofing row -> N14 noFade rows -> king -> rest of stage ב -> stage ג.

## 15.11 ~08:20 — NAMES_DEMO_211 (N23) + CELLS_CLEAN_211 (N21) done (b2)
- N23: 30-courts.js after the Tamid-names labels: ctx2.shared.mokedTamid.show(mode) = set + a round of the four chambers (SW, SE, NE, NW; 3.4 s each; large name plates size 3: gold = agreed, red rim = the two northern, exchanged between readings; layers mokedNm0..3), ends on a far view with the four plates, 16 s, then they go; not during a presentation (plates only); a mouse touch stops it. Row pickJs -> M.show (rows_211 sec. 15) + a sentence in both options' cards. Renders qa/r211/nm_sheet.jpg, nm_sheet2.jpg.
- N21 (he asked to SEE ONE SAMPLE FIRST - done for all eight in one style; show him cells_n1.jpg + cells_n3.jpg and ask: Q6): 50-heichal.js CELLS_CLEAN_211 - a number that is not the Mishnah's plain one (heichal wall 6, cell wall 5, cells 5/6/7) on a dark plate with a red rim; the rest plain and smaller; unrelated labels hidden while the section shows (by sprite.material.visible). rows_211 sec. 16: chips = short names (by key), every card opens "**בקריאה זו:** ..." with the differing numbers bold. Backup snap/b2-50-heichal-before-cells211.js.
NEXT: N26 chotamot/stones/descent places + seals -> N9/13 kelim -> N22 wicket kohen -> N7/12 sounds -> N4 nezirim -> N2 Har HaBayit roofing row -> N14 noFade rows -> king -> rest of stage ב -> stage ג.

## 15.11 ~09:00 — CHOTAMOT_211 done (N26, b2)
- 30-courts.js (inside the Tamid-names block): the four seals (table, four trays with clay tokens, words עגל/זכר/גדי/חוטא + a label) in the chamber that is "לשכת החותמות" by the names' reading: a -> NW (group in tamA), b -> NE by the east wall, beside the stones (groups in tamB tied to mokedDef / mokedRosh). Ben Azzai's five - in the card only.
- rows_211 sec. 17 + port_ui.py (menu order + OPS_P): three new places in "לשכות" after the showbread chamber: 'לשכת החותמות — בבית המוקד' (camJs/tgJs by reading and gates), 'לשכת אבני המזבח — בבית המוקד', 'הירידה לבית הטבילה — בבית המוקד'; LABEL_MAP remapped. Quotes verified: Shekalim 5:3-5 (54:33-35), Tamid 1:1 (88:2), 3:3 (88:15), Middot 1:6 (89:7), 3:4 (89:22). (rows_211: a loop variable had shadowed _cat - fixed.)
- Renders: qa/r211/ch_sheet2.jpg.
NEXT: N9/13 kelim -> N22 wicket kohen -> N7/12 sounds -> N4 nezirim -> N2 Har HaBayit roofing row -> N14 noFade rows -> king -> rest of stage ב -> stage ג.

## ~10:10 (15.11) — KELIM_211 done (N9/N13, b2 only: the place exists only in בית שני)
- b2 src/50-heichal.js KELIM_211: 93 vessels (bowls/cups/pans, silver and gold in turn, InstancedMesh) on three STEPPED cedar shelves in the
  middle northern cell of the lowest storey; position by the cells' reading (geo(): y0, yCut = st[1] - 1.04, zIn, zOut; rambam: strip 3);
  feature `kelim` (not timed): shows the group + section axis "y" at yCut (previous section state restored on off()); the reading's
  set() is wrapped (the vessels and the cut follow a reading chosen while the place is on); label moves with the cell (found in the
  scene's "labels" group by userData.label). `ctx2.shared.kelimView()` = the place's camJs/tgJs (62 deg or steeper, 15.5 amot away).
- rows_211.py sec. 18: place 'לשכת הכלים' -> featureKey kelim, camJs/tgJs, no 'section'/'openPill'; the "במודל" sentence rewritten
  (which cell / shelves / shapes / order = בחירת מודל); LABEL_MAP for the label.
- ENGINE (BOTH houses, 90-entry.js KEEP_CUT_211): cam_keepInside skips a surface that lies in the half the section removed
  (the cut ceiling drew the eye down to a span from the shelves).
- Known: in the tall readings (cells 13 high) the view is a steep look down a white shaft - acceptable; polish later if time.
- The background run of tamidscan was killed by the user's interruption (exit 144) - RE-RUN tamidscan at the final verification.

## 15.11 ~07:35 (clock of the user: Israel time) — KOHEN_ACTOR_211 done (N22, b2) + THIRD OLD BUG (WALK_END_211)
- tools211/kohen_211.py -> b2 src/50-heichal.js (backup snap/b2-50-heichal-before-kohen211.js):
  * `KOH` (ctx2.shared.kohenActor): one articulated priest from SH.priestKit (55-payis.js) on 55-tamid's skeleton; KOH.pose({x,y,z,yaw?,base:"rest"|"hold",
    armR/armL:{p:[world],w,pole},key:true|{dir,turn},xray}) each frame - gait by distance moved, two-bone IK arms, a life-size key (KEYL 0.36), the right arm
    drawn over the stone when inside a wall; KOH.hide(); KOH.dims(); KOH.actor.
  * WICKET (PL.koh(t) + kohWicket(t), KWAY per way): he stands at the locks - Rambam: before the door, the arm straight down to the low lock, then the lock at
    elbow height (plate moved 2.35 -> 1.95; both plates at local z 2.3); Melechet Shlomo / Ra'avad: his face to the wall, the arm into the hole / window "עד בית
    השחי" with the elbow bent as the hole bends (hole and window MOVED to an arm's length: MS_PATH/RV_PATH at shoulder height LKY = F+2.42, mouth z -16.8, window
    z -16.6; the inner lock = a box on the door's inner face by its free edge, keyhole in its south side; X-ray shows hole + lock box); pushes the door; walks
    AHEAD OF THE EYE (Sages: wall -> cell -> heichal -> inner doors' lock; R. Yehuda: inside the wall's thickness -> between the gates -> outer doors' lock).
    LOCK_CAM now from the north-east (his body hid the arm from the south). Eye keys retuned: rabbanan 4.8 and 9.2, yehuda 9.0.
  * GREAT GATE (kohGate(e,k) from apply(e); also in the standalone demo and G.at): key in/turn/out with his right hand; BAR LOWERED to 3.3 (BAR_Y; was 8.4 -
    out of any man's reach) - both hands lift it, a step back, it is put by (timings with the priest: lift 3.2-3.5, back 3.5-4.0, dx -0.6); he draws each pair
    by its meeting edges and steps back clear of the leaves (KT tracks; tipOf); then walks into the heichal. The big floating key+fist no longer drawn.
  * WALK_END_211 - BUG IN PUBLISHED 2.0.10: PWALK0's last key was written with PW_END and then shifted again (shiftK) -> it came at 18.2 instead of 14.4; the
    great gate's demonstration started at 14.4, so the key and the bar were over before the eye came, and the gate's two close views were skipped. Fixed (10.6).
- rows_211.py sec. 19: cards of 'המפתח שיורד לאמת השחי' (3 options), 'הדרך מן הפשפש לשער הגדול' (2 options), places 'פשפשי ההיכל', 'פתיחת השער הגדול — הדגמה'.
- QA: qa/r211/wkshots.mjs (NEW: a stepped page clock - moments of a walked demo by its written second; env PFX/STEP), kohstop.mjs (stop/hide checks: OK).
  Sheets: qa/r211/wk/wk_sheet1..6.jpg. 0 errors.
- TELL THE USER: three old bugs now (LOT1 ring, Gazit place, late eye at the great gate).
NEXT: N7/12 sounds -> N4 nezirim -> N2 Har HaBayit roofing row -> N14 noFade rows -> king -> rest of stage ב -> stage ג.

## 15.11 ~08:05 — SOUND_211 done (N7/N12, both houses)
- tools211/sound_211.py (backups snap/*-before-sound211): 
  * b2 55-tamid.js: new synthesized sounds door / water / coals / wood / bleat / hiss / pour / torch + their seconds in the stages (lot1, patrol, kiyor,
    terumah, tapuach, maarachah(2), gezirin, lamb, inner, machta, gechalim, ketoret, haalaah, mincha, nesachim); the tone of "ברקאי" and the chord of the
    blessing REMOVED (the user 00:53: speech = captions only); `SH.sfx = { play, stop }`; `ac()` asks `SH.soundOff`; stopSounds in `SH.soundStops`.
  * b2 55-payis.js: the night's sounds in step() (knock, the gate, the wicket, torches) through SH.sfx; stop() silences.
  * b2 50-heichal.js gate SFX + b1 55-interior.js (heichal doors) + b1 60-palace.js (throne's witnesses) ask the mute.
  * THE MUTE: settings row "קולות בהדגמות" (on by default; localStorage "tm.sound.off", one key for both houses) - b1 70-ui.js after the stone block;
    b2 tools/sound_211.txt put in by tools/ui_211.py after the stone block.
- QA: qa/r211/sndtest.mjs (every sound makes its nodes; mute -> 0 nodes; kept) both houses OK; sndrun.mjs (lots demo 24 nodes in 9.5 s; kiyor water) OK.
NEXT: N4 nezirim -> N2 Har HaBayit roofing row -> N14 noFade rows -> king -> rest of stage ב -> stage ג.

## 15.11 ~08:40 — NEZIRIM_211 done (N4, b2)
- 30-courts.js (backup snap/b2-30-courts-before-nezirim211.js), in the "fire" prop block: kit figures (kind "worker", plain robes) - a Nazirite SEATED on the
  stool (pose bench, y 7.0, seat 1.0, fwd 0.3), the one who cuts his hair standing behind him with the razor in his hand, two by the pot facing the fire;
  a low table with THE BASKET OF LOAVES (5 thick loaves + 4 wafers) + label "סל המצות — חלות ורקיקים (במדבר ו, טו)"; a heap of 9 logs. The label of the
  razor raised to y 10.4.
- rows_211.py sec. 20: the place's card - the Meiri's words (6033 line 35, verified) + the new "במודל" paragraph; ref added; LABEL_MAP.
- TODO BEFORE PUBLISHING (PC library was OFF - "device not connected"): read Numbers 6:15, 6:18-19, Mishnah Nazir 6:8-9 and Rambam Nezirut 8:1-3 in the
  user's library (cd $HOME && python3 q.py ...) - the card gives only the PLACE of the verse for the basket (no words quoted); web check (Wikisource) agreed
  with my memory of 6:18-19. Tell the user that this one reference was not checked in his library.
- Renders: qa/r211/nz_sheet.jpg, nz_sheet2.jpg, nz_6.jpg.
NEXT: N2 Har HaBayit roofing row -> N14 noFade rows -> king -> rest of stage ב -> stage ג.

## 15.11 ~09:10 — ROOF_ALL_211 done (N2, b2)
- 20-mount.js after the soreg (backup snap/b2-20-mount-before-roofall211.js): layer harRoofAll - 436 columns in rings (a ring every 24 amot, columns ~13
  apart) over the whole mount outside the soreg + four see-through roof slabs (y 23.5) round the soreg's rectangle + a label; ctx2.shared.harRoof.set("sides"|"all").
- rows_211.py sec. 21: NEW ROW 'קירוי הר הבית' (first in the table; rows_198.py WANT_ROWS) - o0 TYT (default, the model as it was), o1 Lechem Shamayim
  (drawn); cards: Pesachim 13b (106:388), Rambam BHB 5:1 (337:76), TYT (948:64, incl. his answer to the Shiltei HaGiborim), Melechet Shlomo (1210:50),
  Lechem Shamayim (1145:35), Boaz (1329:9: the Shiltei HaGiborim's reading and its rejection) - all read in the local library. Model choice: the roof to the soreg.
- Render: qa/r211/hr_sheet.jpg.
NEXT: N14 noFade rows (b1 too) + roofs check -> king -> rest of stage ב -> stage ג.

## 15.11 ~10:25 — KING_211 done (stage ב2, b1)
- tools211/king_211.py (backups snap/b1-*-before-king211): 
  * 58-ark.js: ark_kingMats() - the king's cloths (tekhelet robe, argaman mantle with gold borders, dark hair) made once, shared.
  * 60-palace.js: PAL_KING (measures) + pal_kingFig(GOLD, seatH) - THE KING standing (arms a little out, on the creatures' limbs) and seated (hands
    before him), on the priests' kit at 1.72 (as tall as the silhouette he replaces); built lazily at the first ascent (kingEnsure in T.silOn); the
    silhouette stays as a fallback. The limbs come UNDER HIS HANDS: T.sideOf / T.handOf / T.followHand (HAND_X 0.72, HAND_Y 1.62) in all three
    midrashim (targumSheni, estherRabbah, beitHamidrash). Shoulders for the eagles (SH_S/SH_H/SH_X), the crown's place (crownHead, crY) and the
    scroll's (SCR_KNEES, SCR_HANDS) by his measures. No crown of his own (the midrashim bring it).
  * texts: 60-palace.js (button title, throneAscent note), 70-ui.js, 75-tour.js - "המלך בלבוש מלכות" instead of "צללית".
- QA: qa/r211/thrshots.mjs (NEW: the throne's ascent on a stepped clock; `node thrshots.mjs <plugin> <out> <version> <sec>[@cam]...`).
  Sheets qa/r211/thr/thr_sheet1..3.jpg (all three versions). 0 load errors.
- The king of "דבקו שערים" was already in royal dress (12-13.11) - unchanged.
NEXT: N14 (results of allviews2 scan: qa/r211/views2_b2.log / .json) -> rest of stage ב -> stage ג.

## 15.11 07:50 (REAL clock; the "~hh:mm" stamps above were guesses and ran ~3 h ahead) — after compaction
- NOFADE2_211 (b2, rows_211.py sec. 6): rows 'שער העליון', 'חמש עשרה המעלות — צורתן', 'שערי בית המוקד', 'שמות שערי הצפון — אבא יוסי בן חנן' and places
  'שער ניקנור', 'שערי חולדה', 'שושן הבירה — שתי אמות המידה' got noFade. b2 full scan (qa/r211/allviews2.mjs -> views2_b2.json): 210 views, 0 suspects, 0 errors.
- b1 full scan running (views2_b1.log/.json). FADE so far: place 'ארון יהוידע שבשער — לתקלין עתיקין', place 'לשכת הגזית'. b1 rows have no row-level noFade (places only).
- KEEP_CUT_211 in cam_keepInside (both houses): a surface above an active section does not pull the eye inside.
- Stage ב audit: almost none of the 45 points of SOURCES_211.md is in the code yet. Order: Batch 1 (heichal / Yom Kippur) -> 2 (altar / azarah) -> 3 (chambers) -> 4 (demos).
- Batch 1 sources READ in the local library (book:line):
  * parochot: Mishnah Yoma 5:1 (55:38), Yoma 51b (107:1316), Rambam BHB 4:2 (337:63), Yachin (762:444 "ס"ל דעובי אותה אמה כלפנים"), Lechem Shamayim (1145:95 "(דהיינו כפי הנראה צד החיצון)").
  * rovad 4: Mishnah Yoma 4:3 (55:33); Rashi 43b (2157:1669); Bartenura (582:168); Yachin (762:371, 762:383 - machta "לצד העזרה", blood "לצד פנים סמוך להיכל [כך נ"ל]");
    Meiri (2199:386 "ברביעי שבכניסת ההיכל חוץ להיכל... באותו תחום שבין האולם למזבח"); TYT (898:130, 898:133).

## 15.11 08:55 — the user woke (08:23-08:25): three messages, answered point by point (SendUserMessage)
- "אתה לא יכול לצייר לי מלך בלי כיפה" -> KING_KIPPAH_211 (b1): 58-ark.js ark_kingKippah(GOLD) - a kippah of argaman with a gold rim on the head's group,
  for BOTH kings (pal_kingFig in 60-palace.js; ark_kingFig, under his crown). Texts: 60-palace.js throneAscent, 75-tour.js ("כיפה לראשו"). Checked: thr2/kippah_sheet.jpg. DONE.
- "הנזיר צריך להיות עם ממש הרבה שיער, כמו רסטות" -> TODO now (b2 30-courts.js NEZIRIM_211): long thick locks for the seated Nazirite and the two by the pot.
- "תן לי עדכון איפה אתה אוחז" -> sent: done / left / ~40% / ~20 h / my mistake about the Meiri (rovad 4) / questions א-ט.
- QUESTIONS NOW WAITING (sent to him as א-ט): loaf shape toggle; small ramps reading; Ralbag I Chr 9:32; officers of unknown tribe; cells samples;
  R. Yose's parochet place (outer side, opening north); the KG's route in the demo; the TYT's machta rovad (mark?); model choices (stands' place, machtot's place, a row = one amah).
- Batch 1 code DONE and rendered (tools211/par_211.py, yk_211.py + yk_211.js.txt -> b2 50-heichal.js): parochotCount (row in rows_211 sec. 22, WANT_ROWS, ROWB),
  features rovad4 / kanim / machtot, ctx2.shared.kanim.set(1|2), ctx2.shared.ykEntry.start()/stop() (the KG's walk; KOH got o.white, o.props, base "carry").
  STILL TO WRITE: the places + rows + cards for rovad4 / kanim (+ row "כני הזהב") / machtot / the walk (rows_211.py sec. 23), LABEL_MAP, tours.
- b1 scan (allviews2): 157 views, 0 suspects, 0 errors; 'ארון יהוידע שבשער' got noFade; the palace's see-through walls are meant (they show the inside).
- 09:20 NAZIR_LOCKS_211 DONE (b2 30-courts.js; tools211/locks_211.py): the kit's crowd() got o.exact (no jitter; the random sequence kept); the seated
  Nazirite and the two by the pot got long knotted locks (40 a man, from under the kippah: down the back, behind and over the shoulders), merged mesh
  per man, seen within 70 amot. Card (rows_211 sec. 20, _swap 'nezirim locks'): "״קדש יהיה גדל פרע שער ראשו״ (במדבר ו, ה)" - the verse as quoted
  in Pesachim 23a (106:688). Renders qa/r211/b1x/nz_locks2.jpg.
- The user 08:33-08:38: א -> ADD the showbread-shape row in BOTH houses, DEFAULT R. Yochanan "כמין ספינה רוקדת" (סניפין on the table), o1 R. Chanina
  "כמין תיבה פרוצה" (the Rambam per the Kesef Mishneh; סניפין on the floor - as drawn now). Sources read: Menachot 94b (131:3364-3370), 95a (131:3373),
  Rashi 94b (2186:4469-4470, 4478, 4480), 96a (2186:4540), Tosafot 94b (1933:1119), Kesef Mishneh Temidin 5:9 (4261:187), Lechem Mishneh (4030:80, 95).
  ב -> MY READING WAS WRONG: "הכבש הקטן מתחיל מהאמצע ובחלק מופרד" - look at the booklet picture again; fix both houses (Tosafot both ramps, Rashi ramp 1).
  ג -> "יש": the Ralbag on Chronicles exists - find it (PC library / other reliable source), quote only what I read.
  ד -> "חפש את שבטם של הממונים": research the tribe of each of the 15 officers; colour by the sources; list the ones with no source.
  ז approved (the KG's route). ח -> "למה לא?": MARK the TYT's counting for the machta - "מירידתו מן הכבש" (third colour; "לכאורה").
  ה, ו, ט approved as they are. 08:35 "עשית את המלך נשען?" -> partly; TODO: hands on the paw/wing, arms bent, body leaning forward in each step (b1).
  MODEL: the user moved me to Opus 5.5 (08:33): "עצור לפני הסוכנים, שלח למייל, ואני אחזיר לפייבל" - work on to just before the 4 review agents,
  then STOP and send him an email; he switches back to Fable for the agents / fixes / publish.

## 15.11 10:20 — ramps final, officers' tribes (Opus 5.5 session; STOP before the 4 review agents and email the user)
- SMALL_RAMPS2/3/4_211 DONE in BOTH houses (b1 40-altar.js, b2 40-altar.js; tools211/ramps2_211.py, ramps3_211.py, ramps3_b1.py, ramps4_211.py):
  the ramp to the sovev (and for Tosafot the second one, west) starts at the big ramp's lower third (ZT = foot - 32/3), runs 4 amot attached
  flush beside it at its height (ALONG = 4), then turns diagonally with open air between it and the big ramp, its head continuing the sovev.
  Tosafot's yesod ramp walks alongside (pathAlong). R. Yose (body 28) shifted. Cards (b1 RAMP_INFO rashi/tosafot; b2 rows_211 sec. 13
  _SR_NEW3 + Lechem Shamayim _LS, ref {book 5069, index 31}). The user 09:32 "זה מעולה", 09:34 "החיבור צריך להיות רק בחלק הצמוד לכבש",
  09:55 "עכשיו הכבש נורמלי" = APPROVED. TODO (small): the rubuva's purpose + disputes, briefly, in the ramp card of both houses.
- KING_KIPPAH_211 DONE (b1). KING LEANING TODO (b1 60-palace.js throne ascent): hands on the lion's paw / eagle's wing, arms bent, body forward.
- MEMUNIM_TRIBES_211 DONE (b2 30-courts.js via tools211/tribes_211.py; card rows_211 sec. 12 via tools211/tribes_rows.py, _MM_NEW1 -> _MM_NEW).
  The user 09:55: "היה כהן" (Pinchas) / "גביני כהן יש משנה כזו" / "בן אחי גם" / "השאר לא ידוע". Kinds now: k = 3 Matityah, 5 Ben Achiya (user;
  NO source found - card: "בחירת מודל"), 7 Gevini, 9 Ben Bavai, 13 Avtinas, 15 Pinchas (user; no source - "בחירת מודל"); l = 8, 10, 11, 12;
  i (NEW, green #3f9a55, robe 0x6b5a3e) = 4 Petachya; p (blue) = 1, 2, 6, 14. Legend "...ירוק: ישראל...".
  Sources read (book:line): Bartenura Tamid 3:8 (634:117 "כהן ששמו גביני"); Yachin Tamid 3:8 (818:332, also the PLACE "בהר הבית לפני שער
  בית המוקד הסגור"); Rabbeinu Elyakim Yoma 23a in Kovetz Shitot Kamai (PC 7549:1327 "בן בביי, שם כהן"); Rashi Menachot 100a (2186:4755) +
  Rashi Yoma 28a (2157:1007 "הממונה - הוא הסגן") for Matityah; Rashi Yoma 38a (2157:1430 "בן לוי - כלומר מן הלוים") vs Yoma 38b (107:917
  "אחיו הכהנים"); Raavad in Melechet Shlomo Tamid 7:3 (1202:315 "לבן ארזא ושאר לוים"); Petachya: Shekalim 5:1 (54:31), Esther 2:5 (PC 34:29),
  Rashi Menachot 64b (2186:2973), Tosafot there (1933:784: named after him); Meiri Yoma 28a (2199:251: "על החומה או על גג העזרה").
  GEVINI_211: the herald stands on the landing before Beit HaMoked's gate to the chel (-15.5, -78.9, 13.5), face to the gate; in the Rosh's
  reading (mokedGates "adjacent") he moves to the east gate's landing (1.4, -73.3) - mokedGates.set is wrapped at the officers' build.
  Renders qa/r211/b1x/trb_sheet.jpg (sent). errs 0.
- NEXT (in order): king leaning (b1) -> YK cards (rovad4 / kanim row / machtot / KG walk; rows_211 sec. 23) -> showbread-shape row in both
  houses (default R. Yochanan "ספינה רוקדת") -> rubuva line in ramp cards -> Ralbag 9:32 in the showbread chamber card -> stage ב batches 2-4
  -> stage ג -> STOP, email the user (he returns to Fable for the agents / fixes / publish).

## 15.11 11:40 — done since 10:20 (Opus): KING_LEAN, YK cards, SHOWBREAD_SHAPE, rubuva, Ralbag
- KING_LEAN_211 (b1 60-palace.js; tools211/lean_211.py, lean_ext.py, lean_txt.py): pal_kingFig standing figure has userData.lean.set(v)
  (PAL_KING_REST -> PAL_KING_BENT [-0.1, 0.3, -0.7], body bend PAL_KING_LEAN 0.15); PAL_KING.HAND_X/Y/Z = 0.78 / 1.78 / -0.88 (measured,
  qa/r211/leans.mjs) - the limbs reach there; T.lean tracks in targumSheni / estherRabbah / beitHamidrash (the last: the limbs stay till
  a+7.3..8 for k<6). Texts: throneAscent + tour. Renders b1x/lean_sheet2.jpg (sent). NOTE: the ascent clock runs at demoSlow (1.5x page s).
- YK_CARDS_211 (b2 rows_211 sec. 23 via tools211/yk_rows.py; yk_211.js.txt sync): places 'הרובד הרביעי — ביום הכיפורים' (rovad4;
  tourThen to the green), 'כני הזהב שבהיכל — ביום הכיפורים' (+ row 'כני הזהב — שניים או אחד', WANT_ROWS, ROWB, OPS_P), 'שלוש המחתות —
  בכל יום וביום הכיפורים' (followAltar), 'הכהן הגדול נכנס בקטורת — הדגמה' (actionJs ykEntry.start). Menu ORDER in port_ui.py updated.
  FOUND/FIXED: the green counting lay inside the building south of the ramp (the ramp's foot reaches it in the model) -> now from the
  ramp's WEST edge by its foot (model choice, said in the card); the green and the firepans follow ctx2.shared.altarPlace (dz) and the
  green R. Yose's measures; the green lies on the real paving (16.3 there; floorY). allviews2: 0 suspects, 0 errors.
- SHOWBREAD_SHAPE_211 (both houses; tools211/bread_211.py + boat_loaf.js.txt, bread_rows.py, bread_b1ui.py): int_boatLoaf (mouth square,
  V walls to a finger-wide keel, raked rising ends) + int_breadShape(ctx) (one switch: set("boat"|"box"), shaped(mesh, box, boat)).
  Default boat (R. Yochanan): posts ON the table (POST_ZB 0.485), reeds under the keels; box (R. Chanina): posts on the floor (as before).
  b2: table (45-vessels), ulam marble table (50-heichal breadKit.geoB), chamber loaves (30-courts); row 'צורת לחם הפנים — ספינה רוקדת או
  תיבה פרוצה' (rows_211 sec. 24, WANT_ROWS after 'כיוון המנורה', ROWB + SHORT, OPS_P table + chamber), cards: table + chamber sentences.
  b1: tables (55-interior: ten + Moses' + ulam entry table), opRow id "breadShape" (70-ui.js; UI_OPS_V shulchanot / shulchanMoshe /
  ulamTables, UI_OPS_P the layout place), card 'שולחן משה מקרוב' updated. Checked: allviews2 both houses 0 suspects, chips render.
- RUBUVA (b1 70-ui.js place 'הכבש'): its purpose + where (Rambam / R. Shemaya / Rashi per Boaz / Raavad), refs. (b2's big-ramp card had it.)
- RALBAG (b2 rows_211 sec. 25): the chamber card's makers paragraph + ref {3634, 253}.
- NEXT: stage ב batches 2-4 (SOURCES_211.md), stage ג, then STOP + email.

## 15.11 13:05 — more of stage ב done (Opus)
- MEZUZAH_211 (b2 30-courts.js: on Nikanor's northern post, x 97.4 / y 26.8 / z -5.56 + label; rows_211 sec. 26: the place + INFO 'nikanor' +
  ref ['יומא יא.', 'Yoma.11a'] - NOTE this card's refs are the 'Tractate.page' STRING kind; a dict there broke cards_196 (fixed)).
- DIR_ETZIM_211 (b2: second label "לרמב״ם — ״לשכת דיר העצים״" moving with the chamber (eznLbl); card sentence, ref 337:83). Sec. 27.
- RAMP_WAYS_211 (b2 40-altar.js in rampG + b1 40-altar.js in rampDefG/rampYoseG): chevrons blue (east up), orange (west down), gold (middle,
  YK), labels; feature "rampWays"; places 'עולים במזרח ויורדים במערב — הכבש' (b2 rows_211 sec. 28 + ORDER; b1 70-ui.js after "הכבש").
- NIVR_SPARKS_211 (b2 57-add208.js): twinkling additive sprites round the lamp / the shamshit; feature heleneSparks (15 s), label on layer
  heleneSparks; place 'ניצוצות הנברשת בזריחת החמה' (sec. 29; Yoma 37b 107:893, Rashi 2157:1409/1385).
- PINCHAS_WINDOWS_211 (b2 30-courts.js F_PINCHAS): a canvas panel - 96 closed windows, 24 groups (I Chr 24:7-18 names) x מכנסים/כתונת/
  מצנפת/אבנט - on the chamber's north side at z cz-2.2 (a block stands 1 amah inside the north wall), a ledge, a label; a table by the door
  with a folded white tunic. Card sec. 30 (Rambam KH 8:8-9, 338:130-131, PC library).
- ONKALIOT iron, Nikanor wickets, Beit HaMoked descent, golden stands, rovad, machtot, parochot: found DONE earlier.
- KLI SHIR CHAMBERS (Middot 2:6): NOT drawn - the west wall of the women's court beside the steps is taken by Nikanor's two chambers
  (z +-19.5..28.5) and the corner chambers; ASK the user where the doors go (options: under the steps / at the steps' ends / ...).
- NEXT: chavitin (oven + frying, Menachot 50b) -> lepers' mikveh building -> Rosh mode enclosed chambers -> four menorot (Sukkah 5:2-3) ->
  fill chambers -> Yehudah/Binyamin + north-for-slaughter (may need decisions) -> morning-service demo items -> stage ג.

## 15.11 — CHAVITIN_211 done (Opus)
- b2 30-courts.js F_CHAVITIN: the oven is now HOLLOW (open cylinder, inner face BackSide, lip ring, glowing embers at its bottom) with a
  loaf on its NORTH inner wall (shows over the lip from the south); the stove (1.1 cube, fire's mouth to the east, bronze pan + oil + loaf,
  handle to the maker) by the WEST wall at (cx-2.2, cz-0.75); Levite at the oven (bake) / east of the stove (fry); labels size 0.6
  ("1 · אפייה" y+5.6 over the oven, "2 · טיגון במחבת" y+3.9 at sx+1.6) on layers chavBake / chavFry; the room's title label up to y+13.
  The marble table + 12 loaves moved 0.5 north. FOUND: the south strip of both Nikanor chambers (z > |26.25|) lies inside the women's-court
  corner chamber's partition (40 x 12 x 2.5 at z +-27.5) - nothing may stand there; the door leaf (east) hides the SE pocket from the west.
- rows_211 sec. 31: row 'חביתי כהן גדול — אפייה וטיגון' (openPill at ROW level - the option-level key is ignored by port_ui row_js),
  cams [97.9, 18.2, 26.0] -> [97.9, 7.8, 22.6]; the card paragraph (_CHV) replaces any earlier wording in both Nikanor cards.
  Renders qa/r211/b1x/chv.jpg (both readings), errs 0.
- LEPERS_BATH_211 (point 25; b2 30-courts.js mikveh branch): a small roofed stone house round the 40-se'ah pit (5.6 sq, 7.5 high, door east
  with a cedar leaf, bench + cloth, ladder in the pit), its roof in lishkotCut; label "בור מים — ארבעים סאה" over it (LABEL_MAP -> the
  place). rows_211 sec. 32: place openPill + nearer cam [120.5, 30, -38.5] (Rosh dz kept), card: Yoma 30b (107:726, 728) + the house as a
  model choice; ref 'Yoma.30b'. Renders b1x/lep.jpg, errs 0.
- ROSH_DOORS_211 (point 26; b2 57-add208.js dOut): the oils' (112.25, 67.5), wood's (209.75, -67.5), Nazirites' (209.75, 67.5) walls +
  lintel + cedar leaves in the Rosh reading, as the lepers'. rows_211 sec. 33: cards. Renders b1x/rosh4.jpg.
  NOTE for stage ג: the oils card's "בקצרה" (cards_196 SHORT) lacks the chambers-place dispute the other three have.
- SIMCHA_MENOROT_211 (points 10/37; b2 57-add208.js): four gold lamps (141|181, -20|20), 50 high (Sukkah 52b), 4 cups on arms, a ladder
  per cup (InstancedMesh rails + rungs, "וזקיף טובא"), 16 young priests (tm_people kind kohen, white, s 1.3, own groups) with jars;
  flames (sprites) + halos; feature simchaMenorot (timed:false, off by default); ctx.shared.simchaDemo.start() (climb 1.5-11.5, pour
  11.5-13.5, light 13.5-14.5, down 14.5-23). rows_211 sec. 34: place 'מנורות של זהב — שמחת בית השואבה' after the 15 steps (ORDER in
  port_ui.py), actionJs flies to the top at 8.5 s and back at 15.8 s; card with Mishnah 5:2-3, 52b, 51b, Rashi, Bartenura, Yachin,
  Rambam KH 8:6 (all read: 56:52-53, 108:1323/1355/1357, 2163:2406/2408, 588:246, 772:518/520, 338:128). Renders b1x/sz.jpg, sp.jpg.
  ASK the user: Tiferet Yisrael (772:520) calls the 50 amot "גוזמא גדולה" - the lamps on high platforms or round the gallery's edge:
  add as a toggle option? (not drawn yet; the card says it in short).
- FILL_211 (point 40; b2 30-courts.js + rows_211 sec. 35): salt - a priest with a bowl at the heap + a marble table with 3 salt bowls;
  hides - a hide salted on the east tub, a priest, a salt basket; washers - a priest at the pit with the rumen (Tamid 4:2) + label;
  Avtinas - a maker at the mortar + two "rovim" (kind student) by the door + label (Tamid 1:1; Rosh 2224:8; TYT 944:18; Yoma 38a);
  Parhedrin - MEZUZAH on the door's west post (64.54, 19.83, -69.55; Yoma 10a 107:208) + an elder reading from a scroll to the high
  priest in his own clothes (Yoma 1:3, 107:383) + labels. Nikanor's mezuzah label -> "מזוזה — מכל השערים, רק בשער ניקנור (יומא יא.)"
  (LABEL_MAP moved). Cards: _add_par (replaces its own paragraph on reruns). allviews2: 14 checked, 0 suspects. Renders b1x/fill2.jpg, g6.png.
  NOT YET: the Levites on the duchan (>= 12, instruments) - goes with the morning demo batch.
- NORTH_211 (point 35; b2 57-add208.js + rows_211 sec. 36 + WANT_ROWS 'צפון לשחיטת' after 'בית המטבחים' + ROWB + OPS_P 'בית המטבחיים'):
  row 'צפון לשחיטת קדשי קדשים' o0 R. Yose b. R. Yehuda / o1 R. Elazar b. R. Shimon / o2 Rebbi (init; the Rambam BHB 5:15-16 in its card).
  Patches (feature northZones, 15 s): green opposite the altar (fit to altarPlace dz + altarMeasures 28), blue Ulam..altar from z 0 north,
  orange altar..93.5 from z 0 north, red "מן החליפות ולפנים" (x -93.5..17.5, z -67.5..-50); strips follow the floor (long N-S boxes'
  tops: steps, 16, 13.5). Renders b1x/nz.jpg. ASK: the southern line of the additions - Rashi (the court's middle, drawn) or the Rambam
  (the altar's wall line)?
- LEVITES_211 (b2 55-tamid.js): LEV_IDS 12 (l1..l11 + ba), LEV_PLAY = first 11; props lyre1..9 + nevel1..2; magrefa: in through Nikanor
  then to LZ spots along the duchan (6 north, 5 south of the middle; ba 9.4 then the middle in nesachim). Renders b1x/lev.jpg.
- SHALOM_211 / BARKAI_211 (b2 55-tamid.js): captions "״שלום״" / "״הכל שלום״" (patrol 28.6-33); "הרואה — עולה למקום גבוה" then
  "״ברקאי!״ — הגיע זמן השחיטה" (barkai). Tamid 1:3 (88:4), 3:2 (88:14).
- KIDDUSH_211: b2 POSES.kiddush [[-0.3,0.14,0]x2, lean 0.5] (the kit bends from the ankles; lean >= 1 = lying, feet hidden) in the kiyor
  stage + caption "מקדש ידיו ורגליו — יד ימין על רגל ימין (זבחים יט:)"; b1 45-vessels.js: ark_priestFig at the wash stop (layer
  mechonaWash, moves with demo.rebuild) and a priest rinsing the innards under the east tap at the STOP (48.5,-46; layer mechonaPurpose).
  Renders b1x/b1kid.jpg, b1kid2.png. NOTE the b1 path: home (39,33), wash (39,22), STOP (48.5,-46).

## LAMPS_MIDDLE_211 + NOZZLE_211b (stage ב, point 25) — done, both houses
- b2 45-vessels.js / b1 55-interior.js: each side lamp has a nozzle toward the middle; the middle lamp's nozzle toward the west
  (Menachot 98b; Rashi: "פי הפתילה כלפי מערב", "ושאר הפתילות מצודדות פיהן כלפי האמצעי"). b2: midNS/midEW instanced by the menorah's turn.
- First try (spout 0.16 long reaching 0.27 out) put every side flame in its NEIGHBOUR's lamp (LAMP_R = 0.27 = the lamps' pitch):
  the outer lamps had no flame and the middle had two. Fixed: a short nozzle rising inside its own lamp (0.04..0.125 off the centre,
  y 3.13..3.205), the flame on it (SPT 0.115, foot 3.17). Verified in renders men34.png (b2) and b1men12.png (b1).
- Form and size of the nozzles: בחירת מודל.

## 15.11 13:20-13:40 — ASH_PLACE_211 + KEY_SLAB_211 done (b2); USER DECISIONS 13:32-13:35
- ASH_PLACE_211 (55-tamid.js SC.haalaah): s3 (teni) + s4 (kuz) walk down the ramp's west side, round its foot, north along its east side to
  A(65.15, 31.8/33.05) east of the heap, pour 12.6-15.2, teniAsh -> 0 at 14, caption. Tamid 1:4 (88:5 "מקום שנותנין מראות העוף ודשון מזבח
  הפנימי והמנורה"), Rambam TuM 3:12 (344:43). tamid_200.py: haalaah text + refs MREF(1,4), RREF(3,12). WHEN - model choice.
- KEY_SLAB_211 (30-courts.js: the tablet on a hinge group at its south edge, a dark hollow 0.96 sq, a chain of 7 links + key ring + 3 keys;
  ctx2.shared.mokedSlab.pose(v, keys)); 55-tamid.js: SLEEP[8] lies on the tablet (F + 0.1, head west), RISE[8] [-21.6, -72.0] (ring
  assignment unchanged, no walk through the hearth - checked); patrol: the officer to sp (SL.x, SL.z - 1.25), "scoop" pose, slab 0->1->0,
  keys from the hollow to his hand (prop "keys"), caption; then the wicket. N.slab / N.slabKeys; leaveWorld resets. Texts: moked + patrol
  (Middot 1:9 89:10; TYT 948:58 - the priest, not the Levite, puts his garment on it; Melechet Shlomo 1202:31 "מתחת הטבלא של שיש").
  Renders qa/r211/b1x/ks/ks_sheet.jpg (abba), s01_patrol_5.png (rambam). errs 0.
- USER 13:32: kli shir chambers (Middot 2:6) "בשני הצדדים מתחת לשתי הלשכות פנחס/חביתין בהתאמה" -> raise the Pinchas / Chavitin rooms to the
  Israelite court's level (13.5; their doors west to the court - model choice, fits Tamid 1:3), the kli shir rooms under them (6..12.8,
  doors east to the women's court). Card: "בחירת מודל" (told the user "הכרעה שלך" - say in the email that the card says בחירת מודל).
- USER 13:33: Tiferet Yisrael (50-amah lamps) toggle - NO. Card keeps its one short sentence.
- USER 13:35: north zones' southern line - BOTH as a toggle: Rashi (the court's middle, z 0 - as drawn) / the Rambam (BHB 5:15-16, 337:90-91:
  "מכותל צפוני של עזרה עד כותל המזבח... כל המרובע הזה הוא הנקרא צפון" - to the altar's north wall line).
- KLI_SHIR_211 DONE (b2): 30-courts.js - room() opts doorW / noLeaf / noRoof; the gate's chambers room(98, +-24, 9, 9, 12, LV.AZ, door WEST)
  over the instruments' chambers room(98, +-24, 9, 9, 7.5, LV.EZN, door EAST 5.4 wide, no leaf, no roof) + label; the court's east wall
  (H2.wall x 91..96, y 13.5..40) gets openings at z +-24 (3.6 x 7) and bar shura breaks there (the rooms' west 2.5 amot are inside that
  wall / the fill under it - nothing stands at x < 96). F_PINCHAS: cupboard on the EAST wall (shelfX cx+2.7, CZ cz+0.8, CL 4.6), rail E-W
  on the south side (x 96.4..99.4), table under the windows (cx-0.1, cz-1.5). F_CHAVITIN: oven (cx+1.75, cz-1.7), stove EAST (cx+2.55,
  cz+1.3) mouth west, table 2.0 x 1.4 at (cx-0.9, cz-2.45) with 3 piles of 4 loaves, oil (cx-0.4, cz+1.75), flour (cx+0.9, cz+1.55),
  makers moved. F_KLISHIR: pegs board + 6 lyres on the fill's face (x 96.1..96.5), 2 harps, a table with 2 pairs of cymbals, a Levite.
  55-tamid.js: cv at (96.7, 24.0) facing west. rows_211 sec. 37: place 'לשכות כלי השיר — תחת עזרת ישראל' (after Pinchas; port_ui ORDER),
  cams of both chambers + the chavitin row raised 7.5 (tourThen popped), _CHV "הכותל המזרחי", _PW "ולפני החלונות", _add_par "**מקום
  הלשכה** (מ־2.0.2)" in both. Renders qa/r211/b1x/kl/*.jpg (pl_sheet.jpg = the three places through the menu). errs 0.
- NORTH_LINE_211 DONE (b2): 57-add208.js N.line ("rashi" mid z 0 | "rambam" aN), setLine(), labels L4/L5 by the line (layers swap);
  rows_211 sec. 36: o2 'רבי — אף דריסת רגלי הכהנים וישראל; הגבול כרש״י' (init) + NEW o3 'רבי — הגבול כרמב״ם: עד קו כותל המזבח';
  pickJs setLine(k === "o3" ? "rambam" : "rashi"); cards_196 SHORT + "הגבול הדרומי — לרש״י אמצע העזרה, ולרמב״ם קו כותל המזבח".
  Renders b1x/nl_sheet.jpg.
- MAARACHOT2_211 DONE (b2 55-tamid.js): props old1..3 (charred limbs) on the old fire from the moked stage; tapuach 14.4-16.2 fly to the
  altar's east side + caption (Tamid 2:1); gezirin 3.0-4.8 back onto the pyre + caption (2:5); kindle1..3 in the gaps 5.4-12.6 +
  caption (2:4); maarachah2: if SH.maarachot.count >= 3, b2 to the third pyre (A(48.9, -9.4)) + caption (Rambam TuM 2:4, 344:19).
  tamid_200.py texts of tapuach / gezirin / maarachah2 + refs MREF(2,4), RREF(2,4). Renders b1x/mr/mr_sheet.jpg.
- COALS3D_211 DONE (b2 40-altar.js): two flickering instanced meshes of icosahedron coals - a mound between the gezirin, a bed by the
  great pyre's SW foot, embers round its foot; hidden in the Ra'avad's reading (tapuach.set). Renders b1x/co_sheet.jpg.
- Trumpets toggle (on the marble table): SKIPPED - the people kit's figures cannot hold props outside the demo; the demo's nesachim
  stage already shows the two trumpeters on the marble table (Rambam KH? / Tamid 7:3). Tell the user.
- hatavat haneirot: checked earlier (lamps5 / lamps2 by the reading). Inner altar: ash disposal added (ASH_PLACE_211).
- NEXT: stage ג (terrain "כבש1 כהצעה 1", shorten long cards, unify texts, load time, full scans) -> STOP + email.
- TERRAIN_211 DONE (b2 20-mount.js; stage ג, "רק כבש1 כהצעה 1"): valley(x, z) subtracted from terrainH beyond 35 amot of the walls
  (sm(35, 100, d)): Kidron east (32 deep at 150 from the wall, width 85), south slope (30 at 200, width 140), west valley (24 at 110,
  width 70); north level. Parah ramp: a third (lowest) row of arches from GROUND_Y - 34 to YB, hollows on 10, 20, ... (under the lower
  row's piers) - hidden by the wall, emerging eastward. Renders b1x/tr_sheet.jpg. (b1 has its own mount - Har HaBayit of the First
  Temple: NOT changed; the user's item was about the Second Temple's ramp. Ask? - no: noted in the email.)
- TERRAIN_211 in b1 too (20-mount.js): east + west valleys only (no south slope - Solomon's palace terrace stands south and reads the
  ground under it). Rendered b1x/tr_b1_sheet.jpg (before removing the south slope).
- STAGE ג so far (15.11 ~14:20-15:10):
  * FOLD_211 (both houses; b2 via tools/rich_block.js + port_ui.py, b1 70-ui.js): ui_fillRich(el, text, link, fold) - cards over 1700
    letters show their first paragraphs (to ~850 letters, at least 2) and a button "המשך הכרטיס ▾" for the rest; print uses __raw (whole).
    Checked: b2 'הממונים שבמקדש' 4 shown / 18 hidden -> all after the click; b1 'הכבש' 7 / 10. errs 0.
  * WORDING_211: "בחירת דגם" -> "בחירת מודל" (b2 rows_208, cards_208, 57-add208 labels + rows_211 sec. 98 walks content.json incl. the
    LABEL_MAP keys; b1 70-ui.js). 0 left in both.
  * Oils card "בקצרה" (cards_196 TEXT_ONLY) + the four chambers' place dispute (TYT inside / Rosh outside), as the other three.
  * LOAD_211: bake211() merges the instruments (~90 pieces a room -> 2 meshes). Load (headless, overlay removed): published 2.0.1 7.43 s;
    before the bake 8.38 s; after 7.43 s. b1 6.83 s.
  * Tour: the gates slide (1,4) mentions the instruments' chambers + ref Middot 2:6 (port_tour.py).
  * allviews2 b2 running (av_b2_final.json / .log); then b1.
- PATROL_MEET_211 (b2 55-tamid.js): EAST / WEST ends -> [89.6, 21.2] / [89.6, 26.6] (were x 92.4, inside the court's east wall; the
  east group's third stood on the bar shura). Checked b1x/cv/s01_patrol_31p2.png.
- FULL SCANS (allviews2, both modes): b2 230 measured, 0 suspects, errs 0 (av_b2_final.json); b1 160 measured, 0 suspects, errs 0
  (av_b1_final.json).
- 15.11 ~15:50: STAGES ב + ג DONE. Email to the user (the one he asked for before the agents), then STOP. Open question in it: the
  Yehudah/Binyamin strip (א only the band inside the altar / ב to the court's south wall / ג other).
- NEXT (Fable): >= 4 fresh review agents (sources, understandability, refuter, every toggle/drag/cursor/tour) -> fixes -> "מה חדש" for
  outsiders + the long store descriptions -> versions b2 2.0.2 / b1 1.4.4 / unified 2.0.11 -> publish -> HTML -> copy to the PC.
- USER 17:10: "יהודה ובנימין אפשרות ב" -> TRIBES_211 DONE (b2): 57-add208.js feature 'tribes' (untimed, a place's): gold (Yehudah) on the
  floors east of the altar's east face (floorAt by x: the priests' 11 amot, the duchan, Israel's court) + the whole women's court (6);
  blue (Binyamin) west of the strip's line / north of the strip; the strip (darker gold) from the altar's south inner amah to the court's
  south wall, x from ax0+1 to ax1; the altar's two bands as gold columns (east amah without the NE amah, south amah without the SW amah);
  labels TL1-TL5 (the mount's east side - a label). Fitted to the altar's place and R. Yose's 28. rows_211 sec. 38: place
  'חלקי יהודה ובנימין — הרצועה שבדרום המזבח' after the altar's measures (port_ui ORDER), featureKey 'tribes', refs Yoma 12a 107:256,
  Rashi 2157:332, Zevachim 53b 130:1866, Rashi 2191:2590/2591; LABEL_MAP. "עד היכן — בחירת מודל". b1: not applied (the First
  Temple's altar and courts differ; Rashi's geometry is the Second's). Renders b1x/tb3_sheet.jpg. errs 0.
- STOPPED again before the agents.

## 15.11 ~18:25 — REVIEW ROUND (Fable): eight fresh agents; the user's decisions (18:12-18:13)
Candidate built 17:42 (b2 2.0.2 / b1 1.4.4 / unified 2.0.11; qa-unified 20/20); snapshot of it: /home/claude/rev211/cand (U, F1, F2 test it).
Reports: /home/claude/rev211/reports/{S1,S2,S3,S4,R}.md DONE (S1 12, S2 23, S3 14, S4 19, R 13 findings); U, F1, F2 RUNNING at 18:25.
No invented citation found; the faults: attributions, silent choices between readings, duplicated paragraphs, a place-leave bug, demo details.
THE USER'S ANSWERS (my question numbers; his words in quotes):
- Q2 "ב": TWELVE SINGERS without instruments on the duchan + beside them the players (9 lyres, 2 harps, cymbal) - Rambam KH 3:3 (338:39).
- Q3 "כהן וציין בכרטיס לד.הימים": the chavitin maker a KOHEN (Mefaresh Tamid 28a, 2105:144); the card cites I Chr 9:31 too.
- Q4 (his attached file /mnt/user-data/uploads/a86799cc-attachment.txt): the teni and the kuz are poured out RIGHT AFTER they are taken out, after
  the two lamps - before the incense in the Mishnah's order (Bartenura Tamid 3:9, 6:1; Rosh; Yachin); in the Rambam's order after the two lamps
  (which follow the incense). I told him this reading; waiting for a correction if any.
- Q5 "לשנות את רבי לד' הרמבם": in REBBI'S east-west reading the lamps' mouths all WEST, one behind the other (Rambam PhM Tamid 3:9, 575:40); both houses.
- Q6 "להאריך כולו עד היחל": the "all roofed" option's roof goes on over the CHEL to the courts' walls (Tiferet Yisrael, Boaz Middot 2:1; 6029:25).
- Q7 "א": the four windows of ONE watch open (Rambam KH 8:8).
- "לא נתפרש 4": the four officers coloured by inference (Ben Gever, Beit Avtinas, Matityah b. Shmuel, Beit Garmu) go back to "לא נתפרש".
- "לתקן": the windows' place card (TY 6029:51 against the Rosh / Raavad "בלשכת הגזית בחומה") and the Parhedrin card.
- "כמודל": the kohen who locked sleeps on the marble slab (TYT); R. Shemaya's reading "בקצרה" in the text.
- "כל השאר מאושר": the fixes without asking (morning logs by ONE kohen = the terumah's winner, who also lays the pyres - Rambam Temidin 2:3, 4:5,
  6:1, Yoma 22a; kanei hazahav: the Gemara's conclusion; the place-leave bug; ascents on the ramp's EAST side - Yoma 4:5; officer 15 up to his room)
  and every unanswered item of part ב: the model stays, the card says both readings "בקצרה".
- UNCLEAR, asked 18:25 (his numbers did not fit mine): "להוסיף מתג לרשי" (the chest of Yehoyada in b1? or "שלום הכל שלום"?), "גמרא" (Parhedrin in
  the south?), "לא לגעת" (niashtik? the chip "הרמב״ם" of the cells?). Until he answers: nothing of these three is touched.
- Q1 REVISED after the Boaz (1329:26: the two chambers "תוך עובי חומת עזרת ישראל ... פתוחות לעזרת ישראל"): the two chambers STAY; asked whether to
  deepen the instruments' chambers west, under the court's floor (א) or leave (ב). WAITING. His pasted sources: Yoma 19a, Middot 1:4, Rambam BHB 5:17,
  Lechem Shamayim, Seder HaDorot. Cards in any case: the chambers' place is Rambam 5:17 / TY siman 18 (6029:47) / Boaz - not "בחירת מודל"; ref ה, יז.
DONE so far: LEAVE_TWICE_211 (R-03) in b2 tools/ui_210.py and b1 src/70-ui.js (both rebuilt; feat.mjs A, B pass; C, D to re-run - Chrome crashed
under the machine's load). Scratch: /home/claude/rev211/fix (show.py, cards_now.txt), /home/claude/qa/r211/fix.
NEXT: card fixes (b2: tools/rows_211r.py at the chain's end + _add_par fix; b1: src) -> model changes -> U / F1 / F2 findings -> rebuild, rescan, publish.
- 18:21 THE USER CLEARED THE FOUR OPEN POINTS: (1) "להעמיק" - the instruments' chambers go WEST under the court of Israel's floor, their opening stays
  to the women's court under the two chambers (which STAY); (2) "ארון יהוידע" - b1 gets a TOGGLE: Malbim two chests (as now, default) / Rashi one
  chest (II Chr 24:8, 3662:739); (3) "גמרא" was only the heading of his pasted sources - Parhedrin STAYS north (Rambam), the card says the Gemara's
  "ומסתברא ... בדרום"; (4) "לא לגעת" = the chip name "הרמב״ם" of the cells stays, the card's first line says the numbers are the Raavad's.
  "השאר = תקין": everything else as proposed (model stays, the card says both readings "בקצרה").
TOOLS of the fix round: tools211/revfix.py (one (old -> new) applied to content.json AND to the tools/*.py that wrote it; b1: src/*.js),
  tools211/fixlib.py (the cards as they were: /home/claude/rev211/fix/content_before_revfix.json), fixes files tools211/fixes_b2_a.py ... ;
  frozen copies before the fixes: /home/claude/rev211/fix/{src_before, b1_src_before, content_before_revfix.json}.
  Batch A (S1) applied 18:40. After all batches: chain twice -> content.json must not change; then rows_211r.py (refs, dedupe) at the chain's end.
- 18:39 THE USER, of five more questions (17-21): (17) the SECOND PYRE stays the brothers' (Tiferet Yisrael 818:179 "ואחרים מסדרין מערכה שנייה"), and
  the other opinion is shown INSIDE the demonstration for a few seconds ("הוסף שיטה בתוך המצגת לכמה שניות") - the Rambam Temidin 6:1: the winner
  lays it too; (18) "א": ALL version numbers and "עד אז..." sentences go out of the cards, both houses; (19) "קריאה" -> "שיטה" everywhere;
  (20) "א": a line "מה חדש בגרסה זו" at the menu's end (the top-bar button stays gone after the first view - his request of 1.1.0), the list
  shorter, the close button always seen, Enter does not close it; (21) "א": in a folded card the "במודל" paragraph is always shown under the
  fold button - only the middle (the commentators) folds.
  Without asking (told him): the incense demo's last captions say the Second Temple's own words - Yoma 5:2 "משנטל הארון, אבן היתה שם..." (55:39)
  and "מקום ארון" (Yoma 52b, 107:1349); the captions stay long enough to read; "שורה" -> "מתג" in the cards.
STATE 18:45: b2 card fixes of S1 / S2 / S3 IN (fixes_b2_a / b / b2 / c / lbl; tools/rows_211r.py at the chain's end; chain at rest).
  30-courts.js: TRIBES4_211, OFFICER15_211, WINDOWS_OPEN_211, CHAVITIN_KOHEN_211; 20-mount.js: ROOF_CHEL_211; ui_210.py + b1 70-ui.js: LEAVE_TWICE_211.
  NOT BUILT / NOT RENDERED yet. TODO NEXT (b2): the demo (55-tamid.js + tools/tamid_200.py): east-lane ascents (R-12), the winner lays the great
  pyre and both logs (R-04) + the Rambam's caption on the second pyre, new stage 'deshen' after 'lamps2' in both orders (Q4), 12 singers + players
  (Q2), barkai before lamb in the Rambam order (R-09), stage texts (S4-13, 14, 16); KLI_SHIR deepen (Q1); lamps for Rebbi (Q5, both houses);
  version tags out (Q18), קריאה->שיטה (Q19), שורה->מתג; fold keeps "במודל" (Q21, both houses); news reopen + shorter lists (Q20, U);
  the incense demo's captions; b1: S4 part A, Yehoyada toggle (Q14); then U / F1 / F2 reports in full.
STATE 19:20 (15.11): ALL EIGHT REVIEW REPORTS ARE IN (reports/U.md 42 findings, F1.md 10, F2.md 9 - to be read in full and fixed).
  DEMO DONE in b2 (src/55-tamid.js + tools/tamid_200.py; backup rev211/fix/bak/): EAST_UP_211 (all ascents on the ramp's east half),
  ONE_KOHEN_211 (the terumah winner "t" lays the great pyre and the two boards "carryT"; brothers only carry; the Rambam's caption on the
  second pyre for a few seconds), DESHEN_211 (new stage 'deshen' after 'lamps2' in both orders; out of 'haalaah'), SINGERS_211 (v1..v12
  singers + l1..l11, ba players), GEZ_FIND_211 (modelGez search fixed to the 0.94 boards), 'barkai' before 'lamb' in the Rambam order,
  stage texts (moked, patrol, maarachah, maarachah2, gezirin, haalaah, magrefa). Built (chain 5 s) and scanned: qa/r211/fix/tamidscan2.mjs
  -> both orders, no errors (only "mem" outside the Moked at y 3.8, as before). NOT YET LOOKED AT IN PICTURES.
  STILL TO DO: see "TODO NEXT" above, minus the demo; plus U / F1 / F2.
STATE 19:10: UI ROUND FIXES IN (both houses, built, tested by qa/r211/fix/uichk.mjs): b2src/tools/ui_shared_211r.py (SHARED list: VIEW_LEAVE_211,
  RESET_LEAVE_211, CHIP_NAME_211, NEWS_* (window: title+✕ and "סגירה" always seen, Enter does not close, #tm-foot-news "מה חדש בגרסה זו"),
  SOUND_SYNC_211, HELP_* ) applied by b2src/tools/ui_211r.py (chain step after ui_211.py; + RESET_SHOW_211, TIMER_*_211 -> autoOff.arm, UNITS_211)
  and once to b1 by tools211/b1_ui_211r.py; FOLD_MODEL_211 (tools211/fold_211r.py: b2 tools/rich_block.js + port_ui.py CSS, b1 70-ui.js):
  only the middle folds, "במודל" paragraphs always shown, button "▾ המשך הכרטיס — עוד N פסקאות"; `.tm-more` exempt in both 90-entry.js (U-49).
  NEXT: F1-05 (moked round -> demoStops), F1-06/07 (simcha demo stop/register), F1-08 (tour placeOwnFeat timed:false), F1-09, F1-03 labels,
  F1-01 onkliot; then b2 content fixes of U (U-02..U-16), model work (KLI_SHIR deepen, Rebbi lamps, incense captions), b1 texts + toggle,
  news lists (U's proposed texts in reports/U.md lines 181-214), store text (U.md 227-250), F2-05 throne restore, F2-06/07.
STATE 19:55: b2 TEXT PASS IN: b2src/tools/textpass_211r.py (RULES + EXACT; hooked in tools/port_ui.py right after CONTENT load; writes
  tools/content_shipped.json = the cards AS SHIPPED; content.json and the chain's patches untouched -> chain at rest). Covers Q18 (no version
  stamps), Q19 (שיטה), U-02, U-06, U-07, U-09, U-10, U-11, U-12 (bracket + 17th amah), U-13 (+2 option names renamed at port), U-15 (part),
  U-28 (1,2). Helpers: tools211/ctx.py (sentence around a phrase), tools211/par.py (paragraphs of a card). NOT DONE of U: U-14 (kevashim
  paragraph rewrite - left), U-16 (spelling unification), U-12 names "ר״י — אי נמי / עוד" (left for the owner), 'כבשים קטנים — רש"י' title quote.
  F1 fixes IN (b2): MOKED_ROUND_STOP_211 (30-courts.js), SIMCHA_STOP_211 (57-add208.js; rows_211.py actionJs), ONK_TIMER_211 (40-altar.js),
  tools/tour_211r.py (TOUR_UNTIMED_211, TOUR_FLUSH_211; chain step), ZONES_FOLLOW_211 (57-add208.js), F1-03 labels (rows_211r.py).
STATE 20:40: MODEL WORK DONE (b2 built; renders in qa/r211/fix/shots/): KLI_DEEP_211 (30-courts.js: KDEEP x 82.5..102.5, holes in the podium and
  the fill under the east wall, room 20 long, two ceiling slabs, F_KLISHIR re-laid, label "לשכת כלי השיר (מידות ב, ו)" at x 108.5; place cam
  [112.5,10.3,22.4]->[88,8.3,24.4] in rows_211.py; LABEL_MAP key renamed) - looked at: deep_place2.png OK, court floor above OK, chavitin room OK.
  LAMPS_REBBI_211: b2 45-vessels.js (sideNS / sideEW spout meshes, flameXZ; + spouts follow the metal) and b1 55-interior.js (sideNS / sideEW per
  menorah, flames) + cards (b2 rows_211r.py paragraph in "רבי — מזרח ומערב"; b1 70-ui.js menorot card + 2 refs). b2 positions checked by numbers.
  STILL: incense captions (50-heichal.js ~3193-3207, U-24), U-41/U-46/U-54(1,2,3)/U-42 view fixes (optional), b1 texts (S4 part A, U-26/27/17/51/52/53,
  F2-05 throne restore, F2-06 is in shared CSS, F2-07 pill clamp, F2-08), b1 Yehoyada toggle, b1 version tags/קריאה/שורה, news lists both,
  store text, DEV_NOTES, full scans, publish, PC copy, e-mail.
STATE 20:10 (real clock; earlier "STATE" times in this file ran about an hour ahead): b1 DONE SO FAR: tools211/b1_textpass_211r.py (146 replacements:
  stamps, שיטה, מתג, תפריט), tools211/b1_fix_211r.py (S4-01..06, S4-19, S2-06, U-26, U-27), THRONE_BACK_211 (70-ui.js: feature.leave + placeLeave),
  YEHOYADA_ONE_211 (20-mount.js modes two/gate/altar + flag layers; 70-ui.js row "yehoyadaChests" with 3 chips; WANT order + breadShape moved),
  LAMPS_REBBI_211 (55-interior.js), menorot card paragraph. Tested: qa/r211/fix/yh.mjs OK.
  ASKED THE USER (19:50): where Rashi's ONE chest stands - א gate / ב altar / ג two chips (built now = ג; if no answer - ג stays).
  STILL b1: U-52(3) place order (ramp arrows after הכבש), U-53 (doubled בקצרה block in שולחן משה מקרוב; bread colour), U-17/U-51 news, F2-07
  pill clamp at the nav row, F2-08 (LOW), news lists for both houses (U.md 181-214), store text (U.md 227-250), DEV_NOTES; then scans + publish.
STATE 20:25 (real): NEWS REWRITTEN (tools211/round_211.py: C_EASE, B2_NEWS 17 items, B1_NEWS 11 items incl. "ארון יהוידע" (wording for option ג -
  adjust if the user answers א/ב), NOTE 141 chars (U's), LONG_DESC (U's text; the credits line kept as it was), N1/N2 + "סבב הסקירה"). Run and
  built into both houses. b1 also: DEDUPE_211 (uiMergedCard), PILL_NAV_211 (shared), ramp-arrows place after "הכבש" in the menu.
  NEXT: U-41 (tribes place cam from above), U-46 (machtot labels), U-54 (patrol/magrefa/shema caption times); then: full scans of both houses,
  unified build + qa-unified, update-button check, publish (html branch -> main), delivery folder, PC copy, store description, e-mail.
  LEFT FOR A LATER ROUND (to tell the user): U-12 chip names "ר״י — אי נמי / עוד", U-14 kevashim paragraph, U-16 spelling unification,
  U-42 lamps' captions, U-47, U-48, U-53(2) bread colour, U-55, U-57, U-58, F2-04, F2-07 (card hides its own place's pill: only the nav clamp
  was done), F2-08, F1-10, 'כבשים קטנים — רש"י' title quote, the PC-library checks (Numbers 6 for the Nazirites' card; the reviewers' NOT-IN-LOCAL lists).
STATE 23:45 (real, after the environment stopped 20:26-23:23): USER DECISIONS 23:23-23:42 -
  "ארון יהוידע לרשי תעשה איפה שהתקלין חדתין של המלבים" -> option ב (altar) DONE (b1 70-ui.js, news, yh.mjs; checked).
  "תכניס את כולן עכשיו" (all 16 small notes, before publishing); "התיאור לא מהודק ולא ממצה" -> LONG_DESC v2 (1697 chars) DONE, sent;
  short description: NOT changed (he did not write "להחליף"); "שמות - אפשרות ב" (Ri's three: פירוש ראשון/שני/שלישי + description);
  "הראבד רק מתאר את הרמבם" -> keep the name "הרמב״ם" (told him the Ra'avad opens "איני יודע מהו על גבה"; TYT: equal on the main point);
  "תעשה פרסום בסוף"; he went to sleep 23:43; Opus max is enough (his question).
  KIYOR: he asked whether the laver was covered - Rambam, Commentary Tamid 3:8 (575:38): "שהמוכני שעשה בן קטין היה מכסה גבוה יורד
  בגלגל" (I first said no source - corrected). TODO: a short sentence in the b2 laver card; a switch -> next version (his decision).
  Wake-ups scheduled 02:00 (trig_01Kin8x19UAWiR3CthmmHo9q) and 05:00 (trig_012jsnQ6SGA1K6nmUjms9yG6).
  Scans before the notes: b1 allviews 163/0 suspects/0 errors; tamid both orders ok; qa-unified 20/20 (dist-unified 23:30 build).
  NOTES PLAN: b2 content N1 U-12 names, N2 U-14 kevashim text, N15 title quote, N3 U-16 spelling, kiyor sentence; b2 views N4 U-42 simcha
  captions+labels, N5 U-47 ramp, N6 U-48, N8 U-55 officers, N9 U-57, N10 U-58; b1 N7 U-53(2) bread colour, N11 F2-04 ark view,
  N12 F2-07 pill under card, N13 F2-08 ramp places follow the altar; N14 F1-10; N16 PC checks. Then rebuild, scans, make.sh, qa, publish.
STATE 01:20 (16.11): NOTES DONE - MOCHANI_RAMBAM_211 (new row "המוכני של הכיור — גלגל, או כלי סביב הכיור", 40-altar mochR, rows_211r,
  rows_198 walk order, OPS_P, news); N1 Ri names (option ב) + rashi 17th amah text + CELLS_LBL + LABEL_MAP keys; N2 kevashim split (rows_211r);
  N15 title quote (ui_211r/tour_211r global rename); N3 spelling (בית המטבחים, שולחן titles, 3 · הפייסות, לכסאו); N4 simcha captions
  (57-add208 CAPS, labels x2); N5 ramp arrows with shaft, labels stacked over the ramp, place cam [86,44,50]->[50,13,38]; N6 oven label up,
  rovad sentence (seals cam tried and reverted); N7 bread boat smooth normals + uv + warm material (b1 55-interior, ported to b2 45-vessels);
  N8 officers' plates "n · name — task" size 2.1, cam [41,330,140]; N9 Pinchas labels smaller, kanim labels lower; N10 no roof column near
  the soreg eye (20-mount); N11 ark row opens the ark + new eye (b1); N12 CARD_PILLS_211 (shared, both houses); N13 b1 ramp places follow
  the altar (altarShift); N14 wheel reset in mukhni.stop/pose. N16 (PC library) NOT POSSIBLE: device_bash gone; PC copy also not possible
  tonight (no commit tool) - say so in the e-mail. NEXT: rebuild both, scans, make.sh, qa-unified, publish_211.sh, e-mail.
STATE 01:20 real (16.11) DONE: scans b1 162/0/0, b2 233/0/0, tamid both orders ok, qa-unified 20/20; publish_211.sh -> html 1fc34b8 (version.txt
  2.0.11), main efb0e9c; store workflow 43773871986 success ("העדכון פורסם בחנות בגרסה 2.0.11", HTTP 200, no pending approval).
  Files sent in the chat; summary e-mail sent (msg 1a1e180b9904a750). Wake-ups deleted. NOT DONE: PC copy and PC-library checks (no device
  tools tonight) - in the e-mail. Open for his decision: the Rambam's "מכסה גבוה יורד בגלגל" (commentary Tamid 3:8) as its own form.

## STATE 03:30 (16.11.2026) — round 2.0.12 (B1 1.4.5, B2 2.0.3)
- DONE: copy of 2.0.11 to the PC (Documents\בית המקדש - תוסף 2.0.11; 2.0.10 → סל - למחיקה).
- DONE: note 16 on the PC's Otzaria DB (chk211*.py in the device $HOME): R, S1, S2, S3 items found and matching; b1 שמות כ, כג added
  (src/70-ui.js, the card "הכבש"). NOT checked (the PC's shell went away at ~03:13): Esther 8:15, Psalms 24:7–10, Exodus 25:23–25,
  Leviticus 24:6, Radak on Kings (the bases' cards) — to check when the PC is linked again.
- DONE: שערי חולדה cam [45.5, 42, 490] tg [45.5, 11, 340] (rows_211r.py).
- DONE: PAYIS_STAIRS_212 (55-payis.js): the climb up the CHEL_211 flight in both readings of the gates; the Rambam reading's s1/s2 and
  "פותחין לו" at 16; the Rosh's gate doorsOf(-2.5, -73.3); his cameras. Checked with payisshots.mjs (pst2, pst3, pst4).
- BUILT, NOT WIRED: MOCHANI_COVER_211 (40-altar.js) - a tall cover over the laver, ctx2.shared.mochani.set("cover"); mochk.mjs OK in
  the three modes. ASKED the user (03:20) which form: א the cover / ב as the TYT (no new form; the source in the Rambam's card) / ג as
  the Beit Ephraim (the vessel round the laver goes up and down) - my recommendation ב. round_212.py takes FORM=a|b|c.
- round_212.py run with FORM='' (versions, news, notes); publish_212.sh ready (replace __FORM__ in its commit line).
- checks so far: BUILD-OK, chain at rest, textpass/wordscan as before, qa-unified 20/20, uichk b1/b2, f1chk; the b2 full scan running
  (scan212_b2.json).
- The Rashi question (Bamidbar 8:2, the lamps facing the middle) sent to the user - no answer yet.
