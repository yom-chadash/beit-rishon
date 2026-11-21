  // plugin/js/tour.js
  // ===== 75-tour.js — the presentation ("מצגת"), 1.0.1-K (FIXES-1.0.1-K.md, K.8; replaces the 1.0.1-H tour) =====
  // The user: "הוסף כפתור 1) של מצגת רציפה 2) מצגת לפי סדר הפס' במלכים" (part J); "אם בנית את המצגת מחדש פשוט צריך להזיז את באנר ההסבר
  // מאמצע העמוד"; "את באנר המצגת תעשה יותר מאורך ולא מלבן מאוזן" (part K).
  // The button at the top left (#tm-tour-btn) opens a small menu of three modes (tour_MODES):
  //   (1) "לפי הנושאים" (1.0.1-L: and every place of the panel, below) - every view of the "מבטים" grid in its order (ctx.ui.views, read when the tour starts; the view "העליות" is a row of
  //       the opinions table and comes with the readings), the model in its DEFAULT readings (the first option of every row: Rashi first),
  //       then every other reading of the opinions table, one slide each (as 1.0.1-H);
  //   (2) "רציפה" - the same slides, ~7 s each (tour_DWELL), a slow orbit on exterior slides (up to 12 degrees, alternating sides, eased;
  //       only where nothing is above the camera within 150 amot and the camera is >= 35 from its target), looping until stopped; a slide
  //       whose camera or target is inside the devir is skipped while the cloud covers it (ctx.ui.cloudOn()); a pointer, wheel or arrow-key
  //       interaction holds it and it goes on by itself 8 s after the last one (an explicit "השהה" is not resumed by itself);
  //   (3) "לפי סדר הפסוקים במלכים" - I Kings 6:1-38, 7:1-51, 8:1-11, 8:62-66 in order: tour_KINGS = 46 slides (1.2.0: the verses with nothing to show are gone - the user), one per verse or per group of
  //       consecutive verses, each with the pointed verses (tour_VERSES: the text of the Otzaria library, book 10, ketiv in parentheses and
  //       qere in brackets as printed there), its view or place, a short explanation built on Rashi first (then Targum, Radak, Metzudot,
  //       Ralbag; every quotation was checked mechanically against the Otzaria text of the verse and its commentaries: 260 fragments) and
  //       source links that open in Otzaria (ui_V / ui_P / ui_MI of 70-ui.js; Otzaria line = ui_BASE[10][chapter] + verse, checked in the
  //       library: 6:1 = 186, 7:1 = 225, 8:1 = 277, 8:62 = 338). 1.0.1-L: + I Kings 10:18-20 (10:18 = 390) and two completion slides = 53.
  // The banner (#tm-tour-box): a TALL NARROW panel on the LEFT - left 12, top 52, bottom 76 (above the compass and the nav row), width
  // min(300px, 34vw) - with the part and "n / N", the title, the reference, a notice line OUTSIDE the scrolling area (the cloud
  // confirmation, the pause, the countdown of the continuous mode), the scrolling text (the verses in a Hebrew serif with nikud, the
  // explanation, the sources), a progress bar and the controls (הקודם / השהה / הבא / סיום, and the speed "קצב", remembered in
  // localStorage); RTL; under 640 px a bottom sheet (left/right 8, bottom 66, max-height min(40vh, 50vh - 70px)); z-index 29, under the
  // side panel (30), so it never covers it. fitBox() keeps it above #tm-nav / #tm-compass whatever their height (the nav row wraps to two
  // lines on a phone) and caps the sheet so that it never reaches the centre of the view.
  // Rules (the user's): the tour never opens a removal by itself - interior slides use cameras inside the closed house; a navigation call of
  // the UI that would still open one is undone at once (keepClosed). A slide that needs a model feature switches it on for itself and
  // restores it when it is left: the yatzia section (ctx.shared.yatziaSection, 6:6), the wall and floor layers (ctx.shared.wallLayers,
  // 6:14-15, 6:30), the incense altar's layers (ctx.shared.incenseAltar.layers, 6:22), the base's demo (ctx.shared.mechona.demo, 7:30-33)
  // and its exploded view with the parts' labels (explode + ctx.layers.mechonaParts, 7:34-37) and the palace layer (7:1-12, 8:1-5); the
  // cloud is put back over the devir for 8:10-11 and left there (the UI returns it by itself whenever the camera leaves the devir). At the
  // end (or on "סיום" / Esc) every reading, layer and switch the tour changed is restored: the opinion rows, the layers of ctx.layers (1.0.1-H
  // review F3: the palace layer) but for the groups that a feature's own set() drives (OWNED), the features as they were before the
  // tour through their own set() (the yatzia section, the wall layers, the altar's layers, the base taken apart), the auto-rotation
  // "סיבוב איטי" (suspended while the tour runs; through ctx.ui.autoRotate when the UI has it), the side panel on a phone. A removal the
  // user opened before the tour is left as it is.
  // Review fixes (journal wf_b468c06b-909): F1/UX2 a click on a source link pauses (capture-phase listener: openSource stops the bubbling);
  // F2/UX1 while the Holy-of-Holies confirmation is open the tour's keys and buttons do nothing, Esc answers the dialog ("ביטול") instead of
  // ending the tour (ctx.ui.cancelConfirm), and leaving a slide / ending cancels a pending confirmation so its fly cannot land later; after
  // "ביטול" the slide flies to a view outside the devir (tour_OUT: the parochet from the heichal; 8:6-9: the two bulges of the staffs in
  // the parochet, 8:8); F3/UX7 layers restored; F4/UX6 the nav buttons and the arrow keys pause too (any pointerdown outside
  // the tour's own elements and the dialog, any wheel outside the banner and the panel); UX3 the banner moves up while measuring
  // (body.tm-measuring); UX4 never over the centre; UX5 the last "הבא" reads "לסיכום"; UX8 the notice line is outside the scroll; UX9 the
  // running label is short ("■ עצור"). No key is taken while the focus is in an input or the side panel; the clock is a ctx.animated hook
  // (no interval), frozen while paused, held, waiting for the dialog or while the document is hidden.
  // 1.0.1-K review fixes (review-K-fixargs.json): vessels-2/tour-4 leaving 7:30-33 parks the base at once (demo.reset, not stop: it drove
  // home at three times the speed into 7:34-37), and 7:34-37 takes the base apart in its place (a demo still running is parked and started
  // again when the slide is left); tour-1/cross-2/interior-2 the groups a feature's own set() drives (yatziaDims, wallLayers, altarLayers,
  // mechonaParts) are never written raw at the end - the features go back through their set(); tour-2 the label's card (ctx.ui.closeCard)
  // is closed on every slide change and when the tour starts or ends; tour-3 Esc is handled before the focus test (a panel button or the
  // speed <select> kept it), and the select gives the focus back after a choice; tour-5 the layers an opinion slide's own calls switch (the
  // forest house turns the palace on) are put back when it is left; tour-6 the continuous mode holds while a pointer is down (and on a
  // move with a button pressed); tour-7 one phone rule for the CSS and fitBox (tour_PHONE_MQ), and on a phone the speed sits in the controls
  // row (no "Esc" line), for the text's height; tour-8 auto-rotation through ctx.ui.autoRotate; tour-9 the quotation of 7:14.
  // API: ctx.shared.tour = { modes, start(mode, {speed}), stop(), next(), prev(), state (a function; also state.running / .mode / .idx ...),
  // slides (the current list), plan(mode) (each slide's resolved target, for tests), setSpeed(k) }.
  // Navigation: views by key (ctx.ui.resolveFp + ctx.ui.fly: the fly asks for the cloud), places by title (ctx.ui.place: its view, or its
  // cam / tg), each slide with a chain of candidates that ends in a broad view - a missing target falls back, never an error.
  // Model choices (marked): which view illustrates each verse group; 8:10-11 is shown from the heichal (Rashi 8:10 "כשיצאו שרתה שכינה
  // בהיכל"; the model's cloud covers the devir only); the dwell (7 s), the orbit (12 degrees) and the reading times (2.5 s + 55 ms per
  // character, 9..45 s; verse slides 3 s + 55 ms per character of the explanation + 70 ms per letter of the verses, 10..60 s; x speed).
  // 1.0.1-K review (tour-7): the phone sheet - ONE rule for the CSS below and for narrow() (window.matchMedia of the same query): the CSS
  // said max-width 640 while narrow() said innerWidth < 640, so at exactly 640 the sheet was laid out with the desktop thresholds. On a
  // phone the text gets more of the sheet's height (it had 34-64 px at 360 x 640): the speed choice moves into the controls row (.spd,
  // without its word "קצב"; placeSpeed()), the row under the controls is not shown, the paddings and the notice line are tighter; the "Esc"
  // hint is not shown on a touch screen (hover: none) - there is no Esc key there. From 640 to 881 px (640 is now the desktop banner, as
  // narrow() said) the banner is 34vw < 300 px wide: the controls' gaps, side paddings and font (11 px) are smaller there, so that
  // "→ הקודם" and "⏸ השהה" are not cut (they were cut from 641 px up to ~750 before)
  // 1.0.1-L (FIXES-1.0.1-L.md; the user: "אני רוצה שהמצגת תכלול גם תקריבים - בעצם את כל הכפתורים האפשריים בתוסף - שיטות נוספות בסוף ממש"):
  //   - L.50 the topics mode (and the continuous mode, which plays the same slides) goes through EVERY view of the grid and EVERY place of the
  //     panel, read at runtime from ctx.ui.places() (fallback: placeTitles() + place(t)), in the panel's order: the opening view, then group by
  //     group; a view comes right before the first place of its group that flies to it (a view no place flies to, and the overview "בית שלמה",
  //     opens its group), and a place that only repeats its view's text is the view's slide. Each place has its title, text and sources and
  //     flies to its fly point / view / camera; a place with no target is shown at its group's view camera. A place that switches a model
  //     feature on has it on for its slide and off when the slide is left; the base's demonstration and its parts (L.51 took their places
  //     away, the pills on the base do them) are slides of the tour after "המכונות מקרוב". The tour never opens a removal, the ulam stays closed
  //     ("תשאיר סגור, אולי תרחיק מאוד את המבט"), and only at the VERY END come the other readings of the opinions table.
  //   - L.78-L.81 the throne: after the throne's own places, ONE SLIDE PER VERSION of ctx.shared.throneVersion ("pesukim" = the verses with
  //     their commentators and no midrashic figures; the three midrashim play ctx.shared.throne.ascent with the captions of throne.script
  //     shown progressively, each at its time, the midrash's own words as each thing happens) and after each midrash its witnesses' scene
  //     (throne.witnesses, witnessScript). The tour drives their timeline (ascent.start, then seek per frame), so a pause, a hold or a hidden
  //     document freezes them with the captions and the speed scales them; the version goes back when the slide is left. A slide with a
  //     timeline dwells for that timeline in every mode, the continuous one too. The verses gain I Kings 10:18-20 (tour_KINGS, last slide).
  //   - L.80 the bubble (.bub): a speech bubble in the banner on the throne slides: the Ben Yehoyada's words on Sanhedrin 106b (book 2546 line 778),
  //     and apart from them, under the marker "לכאורה", the inference (the user's: "זהו מקור לכאו' לכך שהכל פעל עפ"י חשמל"), never attributed to him - his
  //     words are about the flying tower. No text on the screen names the user (the integrator's rule): what he decided reads "בחירת מודל".
  //   - the verse slides brought in step with the model (the builders' reports): the ulam's doorway and doors, the section, the golden altar,
  //     the cherubim's wings and faces, the devir's lintel, the forest house's THREE readings (forestAlam / forestAv), the king's own court,
  //     the Sea in the corner, the bases' block of 2 x 5, the tables in Moses' form with his table at the rows' head, the menorot, the staves;
  //     two completion slides, marked as such: לשכת הגזית (with 6:36) and בית המטבחים (with 8:62-66).
  //   - the floating explanation card (ctx.ui.card) stays closed while the tour runs (while the user himself paused it, a card he opened from
  //     the panel may stay on a desktop); ctx.ui.autoOff is cancelled at the start: a slide's feature is the tour's alone. After "ביטול" in
  //     the cloud dialog the tour does not ask again in that run: the next devir slides are shown from outside the devir (their "out" views).
  // 1.0.1-L, part 5 (brief-part5.md):
  //   - L.93 ("אני רוצה שבזמן הצפיה התפריט מצד ימין יסגר לצד לגמרי"): in every mode the panel closes when the presentation starts (through the burger, which stays) and goes
  //     back to its state at the end; the view's centre moves to the middle of the free space beside the banner (viewShift: a lens shift, no camera or ray changes).
  //   - L.88: the exhibit of the vessels (ctx.shared.kelim) is on on its slides only: the place, 7:40-47, 7:49 (second stop), 7:50 and the completion slide on 7:40-50.
  //   - L.89: the slide's text, title and captions through ctx.ui.smallSources (it leaves a quote's own words); the verses are not touched.
  //   - L.85: arkInside is a removal, which stays by its pill: no slide opens it; a press during the tour goes back at the end (OWN_FEAT). A31: one slide per version, the
  //     ascent and then the witnesses. A32: the throne's long texts are short here (tour_SHORT); the whole text stays in the panel's card.
  //   - 1.0.2: the box starts 5 px below the fixed top bar of index.html (--topbar-h: 56 px, 44 px in a narrow window), as it did below the old 47 px header.
  var tour_PHONE_MQ = "(max-width:639px)";
  var tour_CSS = `
/* 1.1.0: #tm-tour-btn is a bar button (index.html header.topbar .tm-topbtn, via ctx.ui.topbarAdd); the menu hangs under the bar's
   button row (#tm-topbtns is position:relative), at its start edge (right, RTL), where the presentation button is */
#tm-tour-menu{position:absolute;top:calc(100% + 6px);right:0;left:auto;z-index:33;width:min(282px,calc(100vw - 20px));display:none;flex-direction:column;gap:5px;
  padding:7px;box-sizing:border-box;direction:rtl;text-align:right;background:rgba(12,16,24,.95);border:1px solid rgba(201,168,76,.55);
  border-radius:11px;backdrop-filter:blur(8px);box-shadow:0 8px 26px rgba(0,0,0,.5);font:13px 'Segoe UI',Arial,sans-serif;color:#e8dcae}
#tm-tour-menu .mh{font-size:11px;color:#b9ac82;padding:0 3px 1px}
#tm-tour-menu button{display:block;width:100%;text-align:right;background:rgba(201,168,76,.08);border:1px solid rgba(201,168,76,.3);
  border-radius:8px;padding:7px 9px;color:#e8dcae;cursor:pointer;font:inherit;direction:rtl}
#tm-tour-menu button:hover,#tm-tour-menu button:focus-visible{background:rgba(201,168,76,.26);outline:none}
#tm-tour-menu button b{display:block;color:#f3dc9a;font-size:13.5px;font-weight:700}
#tm-tour-menu button span{display:block;font-size:11.5px;color:#b9ac82;margin-top:2px;line-height:1.45}
#tm-tour-box{position:fixed;left:12px;top:calc(var(--topbar-h, 56px) + 5px);bottom:76px;width:min(300px,34vw);z-index:29;display:none;flex-direction:column;
  box-sizing:border-box;direction:rtl;text-align:right;background:rgba(12,16,24,.9);border:1px solid rgba(201,168,76,.55);border-radius:12px;
  overflow:hidden;backdrop-filter:blur(8px);color:#e8dcae;font:13px 'Segoe UI',Arial,sans-serif;box-shadow:0 6px 24px rgba(0,0,0,.45)}
#tm-tour-box .hd{display:flex;justify-content:space-between;align-items:center;gap:8px;padding:8px 12px 2px;font-size:11px;color:#b9ac82;flex:none}
#tm-tour-box .hd .part{color:#c9a84c;font-weight:600;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;min-width:0}
#tm-tour-box .hd .num{direction:ltr;unicode-bidi:isolate;white-space:nowrap;font-variant-numeric:tabular-nums}
#tm-tour-box .ttl{padding:3px 12px 0;font-size:16px;font-weight:700;color:#f3dc9a;line-height:1.35;flex:none}
#tm-tour-box .sub{padding:1px 12px 0;font-size:11.5px;color:#c9b98a;flex:none}
#tm-tour-box .opts{display:none;flex-wrap:wrap;gap:4px 9px;padding:6px 12px 1px;flex:none;font-size:11px;color:#b9ac82}
#tm-tour-box .opts.on{display:flex}
#tm-tour-box .opts .og{display:inline-flex;align-items:center;gap:3px;white-space:nowrap}
#tm-tour-box .opts .og b{font-weight:600;color:#c9a84c;margin-left:2px}
#tm-tour-box .opts button{background:rgba(201,168,76,.08);border:1px solid rgba(201,168,76,.35);color:#cfc29a;border-radius:6px;padding:1px 6px;font:inherit;line-height:1.5;cursor:pointer}
#tm-tour-box .opts button:hover{background:rgba(201,168,76,.24)}
#tm-tour-box .opts button.on{background:rgba(201,168,76,.45);color:#17120a;border-color:#e2c56e;font-weight:700;cursor:default}
#tm-tour-box .wait{display:none;margin:6px 12px 0;padding:5px 8px;border-radius:7px;background:rgba(255,207,110,.12);
  border:1px solid rgba(255,207,110,.35);color:#ffcf6e;font-size:12px;line-height:1.45;flex:none}
#tm-tour-box .body{position:relative;flex:1 1 auto;min-height:0;overflow-y:auto;padding:8px 12px 6px;overscroll-behavior:contain}
#tm-tour-box .vs{font-family:var(--font-main,'Frank Ruhl Libre','David',serif),'David','Times New Roman',serif;font-size:17.5px;line-height:1.9;
  color:#f6ead0;margin-bottom:8px;padding-bottom:7px;border-bottom:1px solid rgba(201,168,76,.22)}
#tm-tour-box .vs:empty{display:none}
#tm-tour-box .vs .v{margin:0 0 3px}
#tm-tour-box .vs .vn{color:#c9a84c;font:600 12px 'Segoe UI',Arial,sans-serif;margin-left:5px;vertical-align:2px}
#tm-tour-box .vs .kt{color:#9a8f6c;font-size:.8em}
#tm-tour-box .vs .vl{display:block;color:#c9a84c;font:600 12px 'Segoe UI',Arial,sans-serif;margin:6px 0 1px}
#tm-tour-box .txt{line-height:1.65}
#tm-tour-box .src{margin-top:8px;font-size:11px;color:#b9ac82;line-height:1.5}
#tm-tour-box .src a{display:inline-block;color:#f3dc9a;margin:2px 0 2px 5px;padding:2px 7px;border:1px solid rgba(201,168,76,.45);border-radius:6px;
  background:rgba(201,168,76,.12);text-decoration:none;cursor:pointer}
#tm-tour-box .src a:hover{background:rgba(201,168,76,.3)}
#tm-tour-box .caps{margin-top:6px}
#tm-tour-box .caps:empty{display:none}
#tm-tour-box .caps .cap{margin:0 0 6px;padding:4px 8px;border-right:3px solid rgba(201,168,76,.3);border-radius:4px;line-height:1.6;color:#a89c78;
  font-family:var(--font-main,'Frank Ruhl Libre','David',serif),'David','Times New Roman',serif;font-size:14px}
#tm-tour-box .caps .cap.now{color:#f6ead0;border-right-color:#f3dc9a;background:rgba(201,168,76,.13)}
#tm-tour-box .bubw{display:none;position:relative;flex:none;flex-direction:column;min-height:0;max-height:34%;margin:7px 10px 13px}
#tm-tour-box .bubw.on{display:flex}
#tm-tour-box .bubw::before,#tm-tour-box .bubw::after{content:"";position:absolute;right:26px;width:0;height:0;border-left:9px solid transparent;border-right:9px solid transparent}
#tm-tour-box .bubw::before{bottom:-10px;border-top:10px solid #7fb4ee}
#tm-tour-box .bubw::after{bottom:-8px;border-top:9px solid #14304f}
#tm-tour-box .bub{flex:0 1 auto;min-height:0;overflow-y:auto;box-sizing:border-box;padding:7px 10px 8px;border-radius:14px;background:#14304f;
  border:1px solid #7fb4ee;color:#e4f0ff;font-size:12px;line-height:1.55;box-shadow:0 2px 10px rgba(0,0,0,.35)}
#tm-tour-box .bub .m{display:inline-block;margin-left:6px;padding:0 8px;border-radius:9px;background:#7fb4ee;color:#0b1a2c;font-weight:700;font-size:11.5px;line-height:1.55}
#tm-tour-box .bub .bt{margin-top:5px;font-weight:600}
#tm-tour-box .bub .bq{color:#cfe2fa;font-family:var(--font-main,'Frank Ruhl Libre','David',serif),'David','Times New Roman',serif;font-size:13px}
#tm-tour-box .bub .br{margin-top:4px;font-size:11px}
#tm-tour-box .bub .br a{display:inline-block;color:#e4f0ff;margin:2px 0 2px 5px;padding:1px 7px;border:1px solid rgba(127,180,238,.6);border-radius:6px;
  background:rgba(127,180,238,.16);text-decoration:none;cursor:pointer}
#tm-tour-box .bub .br a:hover{background:rgba(127,180,238,.34)}
#tm-tour-box .prog{height:3px;background:rgba(201,168,76,.18);flex:none}
#tm-tour-box .prog .bar{height:100%;width:0;background:#c9a84c}
#tm-tour-box .ctl{display:flex;gap:5px;padding:7px 10px 4px;flex:none}
#tm-tour-box .ctl button{flex:1 1 0;min-width:0;background:rgba(201,168,76,.12);border:1px solid rgba(201,168,76,.4);color:#e8dcae;
  border-radius:7px;padding:5px 2px;font:12px 'Segoe UI',Arial,sans-serif;cursor:pointer;white-space:nowrap;overflow:hidden}
#tm-tour-box .ctl button:hover{background:rgba(201,168,76,.3)}
#tm-tour-box .ctl button:disabled{opacity:.4;cursor:default}
#tm-tour-box .ctl2{display:flex;justify-content:space-between;align-items:center;gap:6px;padding:2px 12px 8px;font-size:11px;color:#b9ac82;flex:none}
#tm-tour-box .spd{display:flex;align-items:center;white-space:nowrap}
#tm-tour-box .spd select{background:#141a26;color:#e8dcae;border:1px solid rgba(201,168,76,.4);border-radius:6px;
  font:11.5px 'Segoe UI',Arial,sans-serif;padding:1px 3px;margin-right:4px}
#tm-tour-box .ctl .spd{flex:none;font-size:11px;color:#b9ac82}
#tm-tour-box .ctl .spd .k{display:none}
#tm-tour-box .ctl .spd select{margin-right:0;padding:4px 2px;font-size:12px}
body.tm-measuring #tm-tour-box{bottom:96px}
@media(hover:none){#tm-tour-box .ctl2 .esc{display:none}}
@media(min-width:640px) and (max-width:881px){#tm-tour-box .ctl{gap:3px;padding-left:6px;padding-right:6px}#tm-tour-box .ctl button{padding:5px 1px;font-size:11px}}
@media${tour_PHONE_MQ}{
  #tm-tour-box{left:8px;right:8px;top:auto;bottom:66px;width:auto;max-height:min(40vh,calc(50vh - 70px))}
  body.tm-measuring #tm-tour-box{bottom:96px;max-height:min(40vh,calc(50vh - 100px))}
  #tm-tour-box .vs{font-size:16px;line-height:1.75}
  #tm-tour-box .ttl{font-size:14.5px}
  #tm-tour-box .hd{padding-top:6px}
  #tm-tour-box .wait{margin:4px 12px 0;padding:2px 8px;font-size:11.5px;line-height:1.35}
  #tm-tour-box .body{padding:6px 12px 4px}
  #tm-tour-box .ctl{padding:6px 8px}
  #tm-tour-box .ctl2{display:none}
  #tm-tour-box .bubw{max-height:none;margin:8px 0 14px}
  #tm-tour-box .caps .cap{font-size:13.5px}
}
`;
  // TOUR_VIEWS_205 BEGIN (tools/tour_views_b2.json)
  var tour_VIEWS = {"שער ניקנור": [[[128, 26, 16], [93.5, 17.5, -4]]], "לשכת הנזירים": [[[206.2, 20.96, 44.39], [208.5, 9.6, 47.5]], [[212.97, 15.77, 40.43], [214.5, 8.2, 42.5]]], "לשכת המצורעים": [[[115.99, 20.91, -44.13], [113.5, 8.6, -47.5]]], "לשכת שמנים": [[[111.92, 16.82, 51.67], [110.2, 8.3, 54]], [[115.22, 17.52, 44.17], [113.5, 9, 46.5]], [[120.03, 15.87, 51.03], [118.5, 8.3, 53.1]]], "לשכת הגזית — הסנהדרין": [[[72.5, 32.75, -62.03], [72.5, 18.6, -67]], [[77, 28.38, -61.36], [77, 18, -65]]], "בית המוקד": [[[-20, 23.6, -68.19], [-20, 14.9, -70.5]], [[-18, 28.56, -64.16], [-18, 16, -67.5]]], "לשכת בית אבטינס — על גבי שער המים": [[[-30, 55.04, 63.73], [-30, 42.6, 67.5]]], "לשכת המדיחין": [[[34.24, 30.46, 59], [34, 20, 62.4]]], "לשכת הפרוה": [[[55, 47.45, 56.26], [55, 35, 60]]], "מידות המזבח — 32, 30, 28, 26, 24, והמזבח הקודם 28 על 28": [[[104, 34, 9], [55.5, 22, 9]]], "בית המטבחים": [[[51.8, 33.58, -44.13], [51.8, 20, -50.5]]], "כבשים קטנים — רש״י": [[[84, 42, 50], [64, 22, 31]]], "כבשים קטנים — תוספות": [[[84, 42, 50], [64, 22, 31]]], "הכבש הגדול": [[[69.04, 33.54, 29.46], [59, 26.6, 25]]], "שולחנות האולם — שיש וזהב": [[[9.5, 26.6, -4.5], [4, 24.4, -8]], [[9.5, 26.6, 4.5], [4, 24.2, 8]]], "המנורה": [[[-41.8, 26.6, 4.2], [-38.2, 24.2, 6.4]]], "פתח העלייה ופנים העלייה": [[[-20, 74, 2], [-50, 69.5, -2]]], "המזבח": [[[100, 60, -40], [52, 18, 14]]], "פשפשי בית החליפות": [[[-13, 34, -47], [0.4, 27.5, -51.5]]]};
  // TOUR_VIEWS_205 END
  var tour_MODES = [
    { key: "topics", label: "לפי הנושאים", desc: "כל המבטים וכל המקומות לפי סדר התפריט, ובסוף השיטות הנוספות שבתפריט, תחת ״שיטות ומחלוקות״." },
    { key: "continuous", label: "רציפה", desc: "אותן שקופיות ברצף, בתנועה איטית ובלולאה עד לעצירה." },
    { key: "tamid", label: "סדר עבודת הבוקר — מסכת תמיד", desc: "הדגמה: מבית המוקד בלילה ועד שיר הלויים, שלב אחר שלב, בלשון המשנה — בסדר שנבחר במתג ״סדר עבודת הבוקר״ (אביי או הרמב״ם)." },   // 2.0 (55-tamid.js)
    { key: "verses", label: "לפי סדר המשניות במסכת מידות", desc: "מסכת מידות א–ה — שלושים וארבע המשניות המנוקדות, כל אחת במקומה במודל, עם הסבר ומקורות ברמב״ם ובגמרא." }
  ];
  var tour_DWELL = 7000;        // the continuous mode: ms per slide (the brief: ~7 s; model choice)
  // 1.0.1-L (L.78-L.81): a slide with a timeline (the king's ascent, the witnesses' scene): seconds before it starts (the camera arrives: the
  // UI's fly is 1.6 s) and at rest after it, for reading the last caption (model choices)
  var tour_ANIM_LEAD = 2;
  var tour_ANIM_TAIL = 2.5;
  // 1.0.1-L (L.50): the group of a view that no place of the panel flies to (a fragment of the group's name; else the previous view's group)
  var tour_VIEW_GROUP = {};    // Beit Sheni: every view has a home place in the panel
  var tour_VIEW_OPENS = {};
  var tour_VIEW_ALIAS = {};
  var tour_ORBIT = 12 * Math.PI / 180;   // the continuous mode's orbit on exterior slides: 12 degrees (the brief: +-12, alternating sides; model choice)
  // the view of a devir slide when the cloud dialog is answered "ביטול": the parochet from the heichal (K.4), else the devir doorway, the heichal
  var tour_OUT = [{ fp: "kodesh" }];   // a Holy-of-Holies slide when the cloud dialog is answered "ביטול": the kodesh, before the parochet
  // The pointed text of Mishnah Middot 1:1-5:4 as printed in the Otzaria library (book 89; generated from its text, nothing retyped).
  var tour_VERSES = {
    "1:1": "בִּשְׁלשָׁה מְקוֹמוֹת הַכֹּהֲנִים שׁוֹמְרִים בְּבֵית הַמִּקְדָּשׁ, בְּבֵית אַבְטִינָס, וּבְבֵית הַנִּיצוֹץ, וּבְבֵית הַמּוֹקֵד. וְהַלְוִיִּם בְּעֶשְׂרִים וְאֶחָד מָקוֹם. חֲמִשָּׁה, עַל חֲמִשָּׁה שַׁעֲרֵי הַר הַבַּיִת. אַרְבָּעָה, עַל אַרְבַּע פִּנּוֹתָיו מִתּוֹכוֹ. חֲמִשָּׁה, עַל חֲמִשָּׁה שַׁעֲרֵי הָעֲזָרָה. אַרְבָּעָה, עַל אַרְבַּע פִּנּוֹתֶיהָ מִבַּחוּץ. וְאֶחָד בְּלִשְׁכַּת הַקָּרְבָּן, וְאֶחָד בְּלִשְׁכַּת הַפָּרֹכֶת, וְאֶחָד לַאֲחוֹרֵי בֵית הַכַּפֹּרֶת:",
    "1:2": "אִישׁ הַר הַבַּיִת הָיָה מְחַזֵּר עַל כָּל מִשְׁמָר וּמִשְׁמָר, וַאֲבוּקוֹת דּוֹלְקִין לְפָנָיו, וְכָל מִשְׁמָר שֶׁאֵינוֹ עוֹמֵד, אוֹמֵר לוֹ אִישׁ הַר הַבַּיִת, שָׁלוֹם עָלֶיךָ. נִכָּר שֶׁהוּא יָשֵׁן, חוֹבְטוֹ בְמַקְלוֹ. וּרְשׁוּת הָיָה לוֹ לִשְׂרֹף אֶת כְּסוּתוֹ. וְהֵם אוֹמְרִים, מַה קּוֹל בָּעֲזָרָה. קוֹל בֶּן לֵוִי לוֹקֶה וּבְגָדָיו נִשְׂרָפִין, שֶׁיָּשֵׁן לוֹ עַל מִשְׁמָרוֹ. רַבִּי אֱלִיעֶזֶר בֶּן יַעֲקֹב אוֹמֵר, פַּעַם אַחַת מָצְאוּ אֶת אֲחִי אִמָּא יָשֵׁן, וְשָׂרְפוּ אֶת כְּסוּתוֹ:",
    "1:3": "חֲמִשָּׁה שְׁעָרִים הָיוּ לְהַר הַבַּיִת. שְׁנֵי שַׁעֲרֵי חֻלְדָּה מִן הַדָּרוֹם, מְשַׁמְּשִׁין כְּנִיסָה וִיצִיאָה. קִיפוֹנוֹס מִן הַמַּעֲרָב, מְשַׁמֵּשׁ כְּנִיסָה וִיצִיאָה. טָדִי מִן הַצָּפוֹן, לֹא הָיָה מְשַׁמֵּשׁ כְּלוּם. שַׁעַר הַמִּזְרָחִי, עָלָיו שׁוּשַׁן הַבִּירָה צוּרָה, שֶׁבּוֹ כֹהֵן גָּדוֹל הַשּׂוֹרֵף אֶת הַפָּרָה וּפָרָה וְכָל מְסַעֲדֶיהָ יוֹצְאִים לְהַר הַמִּשְׁחָה:",
    "1:4": "שִׁבְעָה שְׁעָרִים הָיוּ בָעֲזָרָה, שְׁלשָׁה בַצָּפוֹן וּשְׁלשָׁה בַדָּרוֹם וְאֶחָד בַּמִּזְרָח. שֶׁבַּדָּרוֹם, שַׁעַר הַדֶּלֶק. שֵׁנִי לוֹ, שַׁעַר הַבְּכוֹרוֹת. שְׁלִישִׁי לוֹ, שַׁעַר הַמָּיִם. שֶׁבַּמִּזְרָח, שַׁעַר נִקָּנוֹר, וּשְׁתֵּי לְשָׁכוֹת הָיוּ לוֹ, אַחַת מִימִינוֹ וְאַחַת מִשְּׂמֹאלוֹ, אַחַת לִשְׁכַּת פִּנְחָס הַמַּלְבִּישׁ, וְאַחַת לִשְׁכַּת עוֹשֵׂי חֲבִתִּין:",
    "1:5": "וְשֶׁבַּצָּפוֹן, שַׁעַר הַנִּיצוֹץ. וּכְמִין אַכְסַדְרָה הָיָה, וַעֲלִיָּה בְנוּיָה עַל גַּבָּיו, שֶׁהַכֹּהֲנִים שׁוֹמְרִים מִלְמַעְלָן וְהַלְוִיִּם מִלְּמַטָּן, וּפֶתַח הָיָה לוֹ לַחֵיל. שֵׁנִי לוֹ, שַׁעַר הַקָּרְבָּן. שְׁלִישִׁי לוֹ, בֵּית הַמּוֹקֵד:",
    "1:6": "וְאַרְבַּע לְשָׁכוֹת הָיוּ בְּבֵית הַמּוֹקֵד, כְּקִיטוֹנוֹת פְּתוּחוֹת לִטְרַקְלִין, שְׁתַּיִם בַּקֹּדֶשׁ וּשְׁתַּיִם בַּחֹל, וְרָאשֵׁי פִסְפָּסִין מַבְדִּילִין בֵּין קֹדֶשׁ לַחֹל. וּמֶה הָיוּ מְשַׁמְּשׁוֹת. מַעֲרָבִית דְּרוֹמִית, הִיא הָיְתָה לִשְׁכַּת טְלָאֵי קָרְבָּן. דְּרוֹמִית מִזְרָחִית, הִיא הָיְתָה לִשְׁכַּת עוֹשֵׂי לֶחֶם הַפָּנִים. מִזְרָחִית צְפוֹנִית, בָּהּ גָּנְזוּ בְנֵי חַשְׁמוֹנַאי אֶת אַבְנֵי הַמִּזְבֵּחַ שֶׁשִּׁקְּצוּם מַלְכֵי יָוָן. צְפוֹנִית מַעֲרָבִית, בָּהּ יוֹרְדִים לְבֵית הַטְּבִילָה:",
    "1:7": "שְׁנַיִם שְׁעָרִים הָיוּ לְבֵית הַמּוֹקֵד, אֶחָד פָּתוּחַ לַחֵיל וְאֶחָד פָּתוּחַ לָעֲזָרָה. אָמַר רַבִּי יְהוּדָה, זֶה שֶׁהָיָה פָתוּחַ לָעֲזָרָה, פִּשְׁפָּשׁ קָטָן הָיָה לוֹ, שֶׁבּוֹ נִכְנָסִין לִבְלֹשׁ אֶת הָעֲזָרָה:",
    "1:8": "בֵּית הַמּוֹקֵד, כִּפָּה, וּבַיִת גָּדוֹל הָיָה, מֻקָּף רוֹבָדִין שֶׁל אֶבֶן, וְזִקְנֵי בֵית אָב יְשֵׁנִים שָׁם, וּמַפְתְּחוֹת הָעֲזָרָה בְּיָדָם, וּפִרְחֵי כְהֻנָּה, אִישׁ כִּסְתּוֹ בָאָרֶץ:",
    "1:9": "וּמָקוֹם הָיָה שָׁם, אַמָּה עַל אַמָּה, וְטַבְלָא שֶׁל שַׁיִשׁ וְטַבַּעַת הָיְתָה קְבוּעָה בָהּ, וְשַׁלְשֶׁלֶת שֶׁהַמַּפְתְּחוֹת הָיוּ תְלוּיוֹת בָּהּ. הִגִּיעַ זְמַן הַנְּעִילָה, הִגְבִּיהַּ אֶת הַטַּבְלָא בַּטַּבַּעַת וְנָטַל אֶת הַמַּפְתְּחוֹת מִן הַשַּׁלְשֶׁלֶת, וְנָעַל הַכֹּהֵן מִבִּפְנִים, וּבֶן לֵוִי יָשֵׁן לוֹ מִבַּחוּץ. גָּמַר מִלִּנְעֹל, הֶחֱזִיר אֶת הַמַּפְתְּחוֹת לַשַּׁלְשֶׁלֶת וְאֶת הַטַּבְלָא לִמְקוֹמָהּ, נָתַן כְּסוּתוֹ עָלֶיהָ, יָשֵׁן לוֹ. אֵרַע קֶרִי בְּאַחַד מֵהֶם, יוֹצֵא וְהוֹלֵךְ לוֹ בַמְּסִבָּה הַהוֹלֶכֶת תַּחַת הַבִּירָה, וְהַנֵּרוֹת דּוֹלְקִים מִכָּאן וּמִכָּאן, עַד שֶׁהוּא מַגִּיעַ לְבֵית הַטְּבִילָה. רַבִּי אֱלִיעֶזֶר בֶּן יַעֲקֹב אוֹמֵר, בַּמְּסִבָּה הַהוֹלֶכֶת תַּחַת הַחֵיל יוֹצֵא וְהוֹלֵךְ לוֹ בְּטָדִי:",
    "2:1": "הַר הַבַּיִת הָיָה חֲמֵשׁ מֵאוֹת אַמָּה עַל חֲמֵשׁ מֵאוֹת אַמָּה, רֻבּוֹ מִן הַדָּרוֹם, שֵׁנִי לוֹ מִן הַמִּזְרָח, שְׁלִישִׁי לוֹ מִן הַצָּפוֹן, מִעוּטוֹ מִן הַמַּעֲרָב. מְקוֹם שֶׁהָיָה רֹב מִדָּתוֹ, שָׁם הָיָה רֹב תַּשְׁמִישׁוֹ:",
    "2:2": "כָּל הַנִּכְנָסִין לְהַר הַבַּיִת נִכְנָסִין דֶּרֶךְ יָמִין וּמַקִּיפִין וְיוֹצְאִין דֶּרֶךְ שְׂמֹאל, חוּץ מִמִּי שֶׁאֵרְעוֹ דָבָר, שֶׁהוּא מַקִּיף לִשְׂמֹאל. מַה לְּךָ מַקִּיף לִשְׂמֹאל, שֶׁאֲנִי אָבֵל, הַשּׁוֹכֵן בַּבַּיִת הַזֶּה יְנַחֲמֶךָּ. שֶׁאֲנִי מְנֻדֶּה, הַשּׁוֹכֵן בַּבַּיִת הַזֶּה יִתֵּן בְּלִבָּם וִיקָרְבוּךָ, דִּבְרֵי רַבִּי מֵאִיר. אָמַר לוֹ רַבִּי יוֹסֵי, עֲשִׂיתָן כְּאִלּוּ עָבְרוּ עָלָיו אֶת הַדִּין. אֶלָּא, הַשּׁוֹכֵן בַּבַּיִת הַזֶּה יִתֵּן בְּלִבְּךָ וְתִשְׁמַע לְדִבְרֵי חֲבֵרֶיךָ וִיקָרְבוּךָ:",
    "2:3": "לִפְנִים מִמֶּנּוּ, סוֹרֵג, גָּבוֹהַּ עֲשָׂרָה טְפָחִים. וּשְׁלשׁ עֶשְׂרֵה פְרָצוֹת הָיוּ שָׁם, שֶׁפְּרָצוּם מַלְכֵי יָוָן. חָזְרוּ וּגְדָרוּם, וְגָזְרוּ כְנֶגְדָּם שְׁלשׁ עֶשְׂרֵה הִשְׁתַּחֲוָיוֹת. לִפְנִים מִמֶּנּוּ, הַחֵיל, עֶשֶׂר אַמּוֹת. וּשְׁתֵּים עֶשְׂרֵה מַעֲלוֹת הָיוּ שָׁם. רוּם הַמַּעֲלָה חֲצִי אַמָּה, וְשִׁלְחָהּ חֲצִי אַמָּה. כָּל הַמַּעֲלוֹת שֶׁהָיוּ שָׁם, רוּם מַעֲלָה חֲצִי אַמָּה, וְשִׁלְחָהּ חֲצִי אַמָּה, חוּץ מִשֶּׁל אוּלָם. כָּל הַפְּתָחִים וְהַשְּׁעָרִים שֶׁהָיוּ שָׁם, גָּבְהָן עֶשְׂרִים אַמָּה, וְרָחְבָּן עֶשֶׂר אַמּוֹת, חוּץ מִשֶּׁל אוּלָם. כָּל הַפְּתָחִים שֶׁהָיוּ שָׁם, הָיוּ לָהֶן דְּלָתוֹת, חוּץ מִשֶּׁל אוּלָם. כָּל הַשְּׁעָרִים שֶׁהָיוּ שָׁם, הָיוּ לָהֶן שְׁקוֹפוֹת, חוּץ מִשַּׁעַר טָדִי, שֶׁהָיוּ שָׁם שְׁתֵּי אֲבָנִים מֻטּוֹת זוֹ עַל גַּב זוֹ. כָּל הַשְּׁעָרִים שֶׁהָיוּ שָׁם, נִשְׁתַּנּוּ לִהְיוֹת שֶׁל זָהָב, חוּץ מִשַּׁעַר נִקָּנוֹר, מִפְּנֵי שֶׁנַּעֲשָׂה בָהֶן נֵס. וְיֵשׁ אוֹמְרִים, מִפְּנֵי שֶׁנְּחֻשְׁתָּן מַצְהִיב:",
    "2:4": "כָּל הַכְּתָלִים שֶׁהָיוּ שָׁם, הָיוּ גְבוֹהִים, חוּץ מִכֹּתֶל הַמִּזְרָחִי, שֶׁהַכֹּהֵן הַשּׂוֹרֵף אֶת הַפָּרָה עוֹמֵד בְּרֹאשׁ הַר הַמִּשְׁחָה, וּמִתְכַּוֵּן וְרוֹאֶה בְפִתְחוֹ שֶׁל הֵיכָל בִּשְׁעַת הַזָּיַת הַדָּם:",
    "2:5": "עֶזְרַת הַנָּשִׁים הָיְתָה אֹרֶךְ מֵאָה וּשְׁלשִׁים וְחָמֵשׁ עַל רֹחַב מֵאָה וּשְׁלֹשִׁים וְחָמֵשׁ. וְאַרְבַּע לְשָׁכוֹת הָיוּ בְאַרְבַּע מִקְצוֹעוֹתֶיהָ, שֶׁל אַרְבָּעִים אַרְבָּעִים אַמָּה. וְלֹא הָיוּ מְקוֹרוֹת. וְכָךְ הֵם עֲתִידִים לִהְיוֹת, שֶׁנֶּאֱמַר (יחזקאל מו), וַיּוֹצִיאֵנִי אֶל הֶחָצֵר הַחִיצוֹנָה וַיַּעֲבִירֵנִי אֶל אַרְבַּעַת מִקְצוֹעֵי הֶחָצֵר וְהִנֵּה חָצֵר בְּמִקְצֹעַ הֶחָצֵר, חָצֵר בְּמִקְצֹעַ הֶחָצֵר, בְּאַרְבַּעַת מִקְצֹעוֹת הֶחָצֵר חֲצֵרוֹת קְטֻרוֹת. וְאֵין קְטֻרוֹת אֶלָּא שֶׁאֵינָן מְקוֹרוֹת. וּמֶה הָיוּ מְשַׁמְּשׁוֹת. דְּרוֹמִית מִזְרָחִית, הִיא הָיְתָה לִשְׁכַּת הַנְּזִירִים, שֶׁשָּׁם הַנְּזִירִים מְבַשְּׁלִין אֶת שַׁלְמֵיהֶן, וּמְגַלְּחִין אֶת שְׂעָרָן, וּמְשַׁלְּחִים תַּחַת הַדּוּד. מִזְרָחִית צְפוֹנִית, הִיא הָיְתָה לִשְׁכַּת הָעֵצִים, שֶׁשָּׁם הַכֹּהֲנִים בַּעֲלֵי מוּמִין מַתְלִיעִין הָעֵצִים. וְכָל עֵץ שֶׁנִּמְצָא בוֹ תוֹלַעַת, פָּסוּל מֵעַל גַּבֵּי הַמִּזְבֵּחַ. צְפוֹנִית מַעֲרָבִית, הִיא הָיְתָה לִשְׁכַּת מְצֹרָעִים. מַעֲרָבִית דְּרוֹמִית, אָמַר רַבִּי אֱלִיעֶזֶר בֶּן יַעֲקֹב, שָׁכַחְתִּי מֶה הָיְתָה מְשַׁמֶּשֶׁת. אַבָּא שָׁאוּל אוֹמֵר, שָׁם הָיוּ נוֹתְנִין יַיִן וָשֶׁמֶן, הִיא הָיְתָה נִקְרֵאת לִשְׁכַּת בֵּית שְׁמַנְיָה. וַחֲלָקָה הָיְתָה בָּרִאשׁוֹנָה, וְהִקִּיפוּהָ כְצוֹצְרָה, שֶׁהַנָּשִׁים רוֹאוֹת מִלְמַעְלָן, וְהָאֲנָשִׁים מִלְּמַטָּן, כְּדֵי שֶׁלֹּא יְהוּ מְעֹרָבִין. וַחֲמֵשׁ עֶשְׂרֵה מַעֲלוֹת עוֹלוֹת מִתּוֹכָהּ לְעֶזְרַת יִשְׂרָאֵל, כְּנֶגֶד חֲמֵשׁ עֶשְׂרֵה מַעֲלוֹת שֶׁבַּתְּהִלִּים, שֶׁעֲלֵיהֶן הַלְוִיִּם אוֹמְרִים בַּשִּׁיר. לֹא הָיוּ טְרוּטוֹת, אֶלָּא מֻקָּפוֹת כַּחֲצִי גֹרֶן עֲגֻלָּה:",
    "2:6": "וּלְשָׁכוֹת הָיוּ תַחַת עֶזְרַת יִשְׂרָאֵל, וּפְתוּחוֹת לְעֶזְרַת הַנָּשִׁים, שֶׁשָּׁם הַלְוִיִּם נוֹתְנִים כִּנּוֹרוֹת וּנְבָלִים וּמְצִלְתַּיִם וְכָל כְּלֵי שִׁיר. עֶזְרַת יִשְׂרָאֵל הָיְתָה אֹרֶךְ מֵאָה אַמָּה וּשְׁלשִׁים וְחָמֵשׁ עַל רֹחַב אַחַת עֶשְׂרֵה. וְכֵן עֶזְרַת כֹּהֲנִים הָיְתָה אֹרֶךְ מֵאָה וּשְׁלשִׁים וְחָמֵשׁ עַל רֹחַב אַחַת עֶשְׂרֵה. וְרָאשֵׁי פִסְפָּסִין מַבְדִּילִין בֵּין עֶזְרַת יִשְׂרָאֵל לְעֶזְרַת הַכֹּהֲנִים. רַבִּי אֱלִיעֶזֶר בֶּן יַעֲקֹב אוֹמֵר, מַעֲלָה הָיְתָה שָׁם, וּגְבוֹהָה אַמָּה, וְהַדּוּכָן נָתוּן עָלֶיהָ, וּבָהּ שָׁלשׁ מַעֲלוֹת שֶׁל חֲצִי חֲצִי אַמָּה. נִמְצֵאת עֶזְרַת הַכֹּהֲנִים גְּבוֹהָה מֵעֶזְרַת יִשְׂרָאֵל שְׁתֵּי אַמּוֹת וּמֶחֱצָה. כָּל הָעֲזָרָה הָיְתָה אֹרֶךְ מֵאָה וּשְׁמוֹנִים וָשֶׁבַע עַל רֹחַב מֵאָה וּשְׁלשִׁים וְחָמֵשׁ. וּשְׁלֹשׁ עֶשְׂרֵה הִשְׁתַּחֲוָיוֹת הָיוּ שָׁם. אַבָּא יוֹסֵי בֶן חָנָן אוֹמֵר, כְּנֶגֶד שְׁלֹשָׁה עָשָׂר שְׁעָרִים. שְׁעָרִים דְּרוֹמִיִּים סְמוּכִים לַמַּעֲרָב, שַׁעַר הָעֶלְיוֹן, שַׁעַר הַדֶּלֶק, שַׁעַר הַבְּכוֹרוֹת, שַׁעַר הַמָּיִם, וְלָמָּה נִקְרָא שְׁמוֹ שַׁעַר הַמַּיִם. שֶׁבּוֹ מַכְנִיסִין צְלוֹחִית שֶׁל מַיִם שֶׁל נִסּוּךְ בֶּחָג. רַבִּי אֱלִיעֶזֶר בֶּן יַעֲקֹב אוֹמֵר, וּבוֹ הַמַּיִם מְפַכִּים, וַעֲתִידִין לִהְיוֹת יוֹצְאִין מִתַּחַת מִפְתַּן הַבָּיִת. וּלְעֻמָּתָן בַּצָּפוֹן סְמוּכִים לַמַּעֲרָב, שַׁעַר יְכָנְיָה, שַׁעַר הַקָּרְבָּן, שַׁעַר הַנָּשִׁים, שַׁעַר הַשִּׁיר. וְלָמָּה נִקְרָא שְׁמוֹ שַׁעַר יְכָנְיָה, שֶׁבּוֹ יָצָא יְכָנְיָה בְּגָלוּתוֹ. שֶׁבַּמִּזְרָח, שַׁעַר נִקָּנוֹר. וּשְׁנֵי פִשְׁפָּשִׁים הָיוּ לוֹ, אֶחָד מִימִינוֹ וְאֶחָד מִשְּׂמֹאלוֹ. וּשְׁנַיִם בַּמַעֲרָב, לֹא הָיָה לָהֶם שֵׁם:",
    "3:1": "הַמִּזְבֵּחַ הָיָה שְׁלֹשִׁים וּשְׁתַּיִם עַל שְׁלֹשִׁים וּשְׁתַּיִם. עָלָה אַמָּה וְכָנַס אַמָּה, זֶה הַיְסוֹד. נִמְצָא שְׁלֹשִׁים עַל שְׁלֹשִׁים. עָלָה חָמֵשׁ וְכָנַס אַמָּה. זֶה הַסּוֹבֵב. נִמְצָא עֶשְׂרִים וּשְׁמֹנֶה עַל עֶשְׂרִים וּשְׁמֹנֶה. מְקוֹם הַקְּרָנוֹת אַמָּה מִזֶּה וְאַמָּה מִזֶּה. נִמְצָא עֶשְׂרִים וָשֵׁשׁ עַל עֶשְׂרִים וָשֵׁשׁ. מְקוֹם הִלּוּךְ רַגְלֵי הַכֹּהֲנִים, אַמָּה מִזֶּה וְאַמָּה מִזֶּה. נִמְצָא עֶשְׂרִים וְאַרְבַּע עַל עֶשְׂרִים וְאַרְבַּע, מְקוֹם הַמַּעֲרָכָה. אָמַר רַבִּי יוֹסֵי, מִתְּחִלָּה לֹא הָיָה אֶלָּא שְׁמֹנֶה וְעֶשְׂרִים עַל שְׁמֹנֶה וְעֶשְׂרִים, כּוֹנֵס וְעוֹלֶה בְּמִדָּה זוֹ, עַד שֶׁנִּמְצָא מְקוֹם הַמַּעֲרָכָה עֶשְׂרִים עַל עֶשְׂרִים. וּכְשֶׁעָלוּ בְנֵי הַגּוֹלָה, הוֹסִיפוּ עָלָיו אַרְבַּע אַמּוֹת מִן הַדָּרוֹם וְאַרְבַּע אַמּוֹת מִן הַמַּעֲרָב, כְּמִין גַּמָּא, שֶׁנֶּאֱמַר (יחזקאל מג), וְהָאֲרִיאֵל שְׁתֵּים עֶשְׂרֵה אֹרֶךְ בִּשְׁתֵּים עֶשְׂרֵה רֹחַב רָבוּעַ. יָכוֹל שֶׁאֵינוֹ אֶלָּא שְׁתֵּים עֶשְׂרֵה עַל שְׁתֵּים עֶשְׂרֵה, כְּשֶׁהוּא אוֹמֵר (שם) אֶל אַרְבַּעַת רְבָעָיו, מְלַמֵּד שֶׁמִּן הָאֶמְצַע הוּא מוֹדֵד שְׁתֵּים עֶשְׂרֵה אַמָּה לְכָל רוּחַ. וְחוּט שֶׁל סִקְרָא חוֹגְרוֹ בָאֶמְצַע, לְהַבְדִּיל בֵּין הַדָּמִים הָעֶלְיוֹנִים לַדָּמִים הַתַּחְתּוֹנִים. וְהַיְסוֹד הָיָה מְהַלֵּךְ עַל פְּנֵי כָל הַצָּפוֹן וְעַל פְּנֵי כָל הַמַּעֲרָב, וְאוֹכֵל בַּדָּרוֹם אַמָּה אַחַת, וּבַמִּזְרָח אַמָּה אֶחָת:",
    "3:2": "וּבְקֶרֶן מַעֲרָבִית דְּרוֹמִית הָיוּ שְׁנֵי נְקָבִים, כְּמִין שְׁנֵי חֳטָמִין דַּקִּין, שֶׁהַדָּמִים הַנִּתָּנִין עַל יְסוֹד מַעֲרָבִי וְעַל יְסוֹד דְּרוֹמִי, יוֹרְדִין בָּהֶן וּמִתְעָרְבִין בָּאַמָּה, וְיוֹצְאִין לְנַחַל קִדְרוֹן:",
    "3:3": "לְמַטָּה בָרִצְפָה בְּאוֹתָהּ הַקֶּרֶן, מָקוֹם הָיָה שָׁם אַמָּה עַל אַמָּה, וְטַבְלָא שֶׁל שַׁיִשׁ, וְטַבַּעַת הָיְתָה קְבוּעָה בָהּ, שֶׁבּוֹ יוֹרְדִין לַשִּׁית וּמְנַקִּין אוֹתוֹ. וְכֶבֶשׁ הָיָה לִדְרוֹמוֹ שֶׁל מִזְבֵּחַ, שְׁלֹשִׁים וּשְׁתַּיִם עַל רֹחַב שֵׁשׁ עֶשְׂרֵה, וּרְבוּבָה הָיְתָה לוֹ בְּמַעֲרָבוֹ, שֶׁשָּׁם הָיוּ נוֹתְנִים פְּסוּלֵי חַטַּאת הָעוֹף:",
    "3:4": "אֶחָד אַבְנֵי הַכֶּבֶשׁ וְאֶחָד אַבְנֵי הַמִּזְבֵּחַ, מִבִּקְעַת בֵּית כָּרֶם. וְחוֹפְרִין לְמַטָּה מֵהַבְּתוּלָה, וּמְבִיאִים מִשָּׁם אֲבָנִים שְׁלֵמוֹת, שֶׁלֹּא הוּנַף עֲלֵיהֶן בַּרְזֶל, שֶׁהַבַּרְזֶל פּוֹסֵל בִּנְגִיעָה. וּבִפְגִימָה לְכָל דָּבָר. נִפְגְּמָה אַחַת מֵהֶן, הִיא פְסוּלָה וְכֻלָּן כְּשֵׁרוֹת. וּמְלַבְּנִים אוֹתָן פַּעֲמַיִם בַּשָּׁנָה, אַחַת בַּפֶּסַח וְאַחַת בֶּחָג. וְהַהֵיכָל, פַּעַם אַחַת, בַּפֶּסַח. רַבִּי אוֹמֵר, כָּל עֶרֶב שַׁבָּת מְלַבְּנִים אוֹתוֹ בְמַפָּה מִפְּנֵי הַדָּמִים. לֹא הָיוּ סָדִין אוֹתָן בְּכָפִיס שֶׁל בַּרְזֶל, שֶׁמָּא יִגַּע וְיִפְסֹל, שֶׁהַבַּרְזֶל נִבְרָא לְקַצֵּר יָמָיו שֶׁל אָדָם, וְהַמִּזְבֵּחַ נִבְרָא לְהַאֲרִיךְ יָמָיו שֶׁל אָדָם, אֵינוֹ בַדִין שֶׁיּוּנַף הַמְקַצֵּר עַל הַמַּאֲרִיךְ:",
    "3:5": "וְטַבָּעוֹת הָיוּ לִצְפוֹנוֹ שֶׁל מִזְבֵּחַ, שִׁשָּׁה סְדָרִים שֶׁל אַרְבַּע אַרְבַּע, וְיֵשׁ אוֹמְרִים, אַרְבָּעָה שֶׁל שֵׁשׁ שֵׁשׁ, שֶׁעֲלֵיהֶן שׁוֹחֲטִין אֶת הַקֳּדָשִׁים. בֵּית הַמִּטְבָּחַיִם הָיָה לִצְפוֹנוֹ שֶׁל מִזְבֵּחַ, וְעָלָיו שְׁמֹנָה עַמּוּדִים נַנָּסִין, וּרְבִיעִין שֶׁל אֶרֶז עַל גַּבֵּיהֶן, וְאֻנְקְלָיוֹת שֶׁל בַּרְזֶל הָיוּ קְבוּעִין בָּהֶם, וּשְׁלֹשָׁה סְדָרִים הָיוּ לְכָל אֶחָד וְאֶחָד, שֶׁבָּהֶם תּוֹלִין. וּמַפְשִׁיטִין עַל שֻׁלְחָנוֹת שֶׁל שַׁיִשׁ שֶׁבֵּין הָעַמּוּדִים:",
    "3:6": "הַכִּיּוֹר הָיָה בֵּין הָאוּלָם וְלַמִּזְבֵּחַ, וּמָשׁוּךְ כְּלַפֵּי הַדָּרוֹם. בֵּין הָאוּלָם וְלַמִּזְבֵּחַ, עֶשְׂרִים וּשְׁתַּיִם אַמָּה. וּשְׁתֵּים עֶשְׂרֵה מַעֲלוֹת הָיוּ שָׁם, רוּם מַעֲלָה חֲצִי אַמָּה, וְשִׁלְחָהּ אַמָּה. אַמָּה אַמָּה וְרֹבֶד שָׁלֹשׁ, וְאַמָּה אַמָּה וְרֹבֶד שָׁלֹשׁ. וְהָעֶלְיוֹנָה, אַמָּה אַמָּה וְרֹבֶד אַרְבַּע. רַבִּי יְהוּדָה אוֹמֵר, הָעֶלְיוֹנָה, אַמָּה אַמָּה וְרֹבֶד חָמֵשׁ:",
    "3:7": "פִּתְחוֹ שֶׁל אוּלָם, גָּבְהוֹ אַרְבָּעִים אַמָּה, וְרָחְבּוֹ עֶשְׂרִים אַמָּה. וְחָמֵשׁ מַלְתְּרָאוֹת שֶׁל מִילָת הָיוּ עַל גַּבָּיו. הַתַּחְתּוֹנָה עוֹדֶפֶת עַל הַפֶּתַח אַמָּה מִזֶּה וְאַמָּה מִזֶּה. שֶׁלְּמַעְלָה מִמֶּנָּה עוֹדֶפֶת עָלֶיהָ אַמָּה מִזֶּה וְאַמָּה מִזֶּה. נִמְצֵאת הָעֶלְיוֹנָה שְׁלֹשִׁים אַמָּה. וְנִדְבָּךְ שֶׁל אֲבָנִים הָיָה בֵין כָּל אַחַת וְאֶחָת:",
    "3:8": "וּכְלוֹנָסוֹת שֶׁל אֶרֶז הָיוּ קְבוּעִין מִכָּתְלוֹ שֶׁל הֵיכָל לְכָתְלוֹ שֶׁל אוּלָם, כְּדֵי שֶׁלֹּא יִבְעָט. וְשַׁרְשְׁרוֹת שֶׁל זָהָב הָיוּ קְבוּעוֹת בְּתִקְרַת הָאוּלָם, שֶׁבָּהֶן פִּרְחֵי כְהֻנָּה עוֹלִין וְרוֹאִין אֶת הָעֲטָרֹת, שֶׁנֶּאֱמַר (זכריה ו), וְהָעֲטָרֹת תִּהְיֶה לְחֵלֶם וּלְטוֹבִיָּה וְלִידַעְיָה וּלְחֵן בֶּן צְפַנְיָה לְזִכָּרוֹן בְּהֵיכַל ה'. גֶּפֶן שֶׁל זָהָב הָיְתָה עוֹמֶדֶת עַל פִּתְחוֹ שֶׁל הֵיכָל, וּמֻדְלָה עַל גַּבֵּי כְלוֹנָסוֹת. כָּל מִי שֶׁהוּא מִתְנַדֵּב עָלֶה, אוֹ גַרְגִּיר, אוֹ אֶשְׁכּוֹל, מֵבִיא וְתוֹלֶה בָהּ. אָמַר רַבִּי אֱלִיעֶזֶר בְּרַבִּי צָדוֹק, מַעֲשֶׂה הָיָה, וְנִמְנוּ עָלֶיהָ שְׁלֹשׁ מֵאוֹת כֹּהֲנִים:",
    "4:1": "פִּתְחוֹ שֶׁל הֵיכָל, גָּבְהוֹ עֶשְׂרִים אַמָּה וְרָחְבּוֹ עֶשֶׂר אַמּוֹת. וְאַרְבַּע דְּלָתוֹת הָיוּ לוֹ, שְׁתַּיִם בִּפְנִים וּשְׁתַּיִם בַּחוּץ, שֶׁנֶאֱמַר (יחזקאל מא), וּשְׁתַּיִם דְּלָתוֹת לַהֵיכָל וְלַקֹּדֶשׁ. הַחִיצוֹנוֹת נִפְתָּחוֹת לְתוֹךְ הַפֶּתַח לְכַסּוֹת עָבְיוֹ שֶׁל כֹּתֶל, וְהַפְּנִימִיּוֹת נִפְתָּחוֹת לְתוֹךְ הַבַּיִת לְכַסּוֹת אַחַר הַדְּלָתוֹת, שֶׁכָּל הַבַּיִת טוּחַ בְּזָהָב, חוּץ מֵאַחַר הַדְּלָתוֹת. רַבִּי יְהוּדָה אוֹמֵר, בְּתוֹךְ הַפֶּתַח הָיוּ עוֹמְדוֹת, וּכְמִין אִצְטְרָמִיטָה הָיוּ, וְנִקְפָּלוֹת לַאֲחוֹרֵיהֶן, אֵלּוּ שְׁתֵּי אַמּוֹת וּמֶחֱצָה, וְאֵלּוּ שְׁתֵּי אַמּוֹת וּמֶחֱצָה, חֲצִי אַמָּה מְזוּזָה מִכָּאן, וַחֲצִי אַמָּה מְזוּזָה מִכָּאן, שֶׁנֶּאֱמַר (שם), וּשְׁתַּיִם דְּלָתוֹת לַדְּלָתוֹת שְׁתַּיִם מוּסַבּוֹת דְּלָתוֹת, שְׁתַּיִם לְדֶלֶת אֶחָת וּשְׁתֵּי דְלָתוֹת לָאַחֶרֶת:",
    "4:2": "וּשְׁנֵי פִשְׁפָּשִׁין הָיוּ לוֹ לַשַּׁעַר הַגָּדוֹל, אֶחָד בַּצָּפוֹן, וְאֶחָד בַּדָּרוֹם. שֶׁבַּדָּרוֹם, לֹא נִכְנַס בּוֹ אָדָם מֵעוֹלָם, וְעָלָיו הוּא מְפֹרָשׁ עַל יְדֵי יְחֶזְקֵאל, שֶׁנֶּאֱמַר (שם מד), וַיֹּאמֶר אֵלַי ה' הַשַּׁעַר הַזֶּה סָגוּר יִהְיֶה לֹא יִפָּתֵחַ וְאִישׁ לֹא יָבֹא בוֹ כִּי ה' אֱלֹהֵי יִשְׂרָאֵל בָּא בוֹ וְהָיָה סָגוּר. נָטַל אֶת הַמַּפְתֵּחַ וּפָתַח אֶת הַפִּשְׁפָּשׁ, וְנִכְנַס לְהַתָּא, וּמֵהַתָּא לַהֵיכָל. רַבִּי יְהוּדָה אוֹמֵר, בְּתוֹךְ עָבְיוֹ שֶׁל כֹּתֶל הָיָה מְהַלֵּךְ, עַד שֶׁנִּמְצָא עוֹמֵד בֵּין שְׁנֵי הַשְּׁעָרִים, וּפָתַח אֶת הַחִיצוֹנוֹת מִבִּפְנִים וְאֶת הַפְּנִימִיּוֹת מִבַּחוּץ:",
    "4:3": "וּשְׁלֹשִׁים וּשְׁמֹנָה תָאִים הָיוּ שָׁם, חֲמִשָּׁה עָשָׂר בַּצָּפוֹן, חֲמִשָּׁה עָשָׂר בַּדָּרוֹם, וּשְׁמֹנָה בַּמַּעֲרָב. שֶׁבַּצָּפוֹן וְשֶׁבַּדָּרוֹם, חֲמִשָּׁה עַל גַּבֵּי חֲמִשָּׁה, וַחֲמִשָּׁה עַל גַּבֵּיהֶם. וְשֶׁבַּמַּעֲרָב, שְׁלֹשָׁה עַל גַּבֵּי שְׁלֹשָׁה, וּשְׁנַיִם עַל גַּבֵּיהֶם. וּשְׁלֹשָׁה פְתָחִים הָיוּ לְכָל אֶחָד וְאֶחָד, אֶחָד לַתָּא מִן הַיָּמִין, וְאֶחָד לַתָּא מִן הַשְּׂמֹאל, וְאֶחָד לַתָּא שֶׁעַל גַּבָּיו. וּבְקֶרֶן מִזְרָחִית צְפוֹנִית הָיוּ חֲמִשָּׁה פְתָחִים, אֶחָד לַתָּא מִן הַיָּמִין, וְאֶחָד לַתָּא שֶׁעַל גַּבָּיו, וְאֶחָד לַמְּסִבָּה, וְאֶחָד לַפִּשְׁפָּשׁ, וְאֶחָד לַהֵיכָל:",
    "4:4": "הַתַּחְתּוֹנָה, חָמֵשׁ, וְרֹבֶד שֵׁשׁ. וְהָאֶמְצָעִית, שֵׁשׁ, וְרֹבֶד שֶׁבַע. וְהָעֶלְיוֹנָה, שֶׁבַע, שֶׁנֶּאֱמַר (מלכים א ו), הַיָּצִיעַ הַתַּחְתּוֹנָה חָמֵשׁ בָּאַמָּה רָחְבָּהּ וְהַתִּיכֹנָה שֵׁשׁ בָּאַמָּה רָחְבָּהּ וְהַשְּׁלִישִׁית שֶׁבַע בָּאַמָּה רָחְבָּה:",
    "4:5": "וּמְסִבָּה הָיְתָה עוֹלָה מִקֶּרֶן מִזְרָחִית צְפוֹנִית לְקֶרֶן צְפוֹנִית מַעֲרָבִית, שֶׁבָּהּ הָיוּ עוֹלִים לְגַגּוֹת הַתָּאִים. הָיָה עוֹלֶה בַּמְּסִבָּה וּפָנָיו לַמַּעֲרָב. הָלַךְ עַל כָּל פְּנֵי הַצָּפוֹן, עַד שֶׁהוּא מַגִּיעַ לַמַּעֲרָב. הִגִּיעַ לַמַּעֲרָב, וְהָפַךְ פָּנָיו לַדָּרוֹם. הָלַךְ כָּל פְּנֵי מַעֲרָב עַד שֶׁהוּא מַגִּיעַ לַדָּרוֹם. הִגִּיעַ לַדָּרוֹם, וְהָפַךְ פָּנָיו לַמִּזְרָח. הָיָה מְהַלֵּךְ בַּדָּרוֹם, עַד שֶׁהוּא מַגִּיעַ לְפִתְחָהּ שֶׁל עֲלִיָּה, שֶׁפִּתְחָהּ שֶׁל עֲלִיָּה פָּתוּחַ לַדָּרוֹם. וּבְפִתְחָהּ שֶׁל עֲלִיָּה הָיוּ שְׁנֵי כְלוֹנָסוֹת שֶׁל אֶרֶז, שֶׁבָּהֶן הָיוּ עוֹלִין לְגַגָּהּ שֶׁל עֲלִיָּה. וְרָאשֵׁי פִסְפָּסִין מַבְדִּילִים בָּעֲלִיָּה בֵּין הַקֹּדֶשׁ לְבֵין קֹדֶשׁ הַקֳּדָשִׁים. וְלוּלִין הָיוּ פְתוּחִין בָּעֲלִיָּה לְבֵית קֹדֶשׁ הַקֳּדָשִׁים, שֶׁבָּהֶן הָיוּ מְשַׁלְשְׁלִין אֶת הָאֻמָּנִים בְּתֵבוֹת, כְּדֵי שֶׁלֹּא יָזוּנוּ עֵינֵיהֶן מִבֵּית קָדְשֵׁי הַקֳּדָשִׁים:",
    "4:6": "וְהַהֵיכָל מֵאָה עַל מֵאָה, עַל רוּם מֵאָה. הָאֹטֶם שֵׁשׁ אַמּוֹת, וְגָבְהוֹ אַרְבָּעִים אַמָּה, אַמָּה כִּיּוּר, וְאַמָּתַיִם בֵּית דִּלְפָה, וְאַמָּה תִּקְרָה, וְאַמָּה מַעֲזִיבָה, וְגֹבַהּ שֶׁל עֲלִיָּה אַרְבָּעִים אַמָּה, וְאַמָּה כִּיּוּר, וְאַמָּתַיִם בֵּית דִּלְפָה, וְאַמָּה תִּקְרָה, וְאַמָּה מַעֲזִיבָה, וְשָׁלֹשׁ אַמּוֹת מַעֲקֶה, וְאַמָּה כָּלֵה עוֹרֵב, רַבִּי יְהוּדָה אוֹמֵר, לֹא הָיָה כָלֵה עוֹרֵב עוֹלֶה מִן הַמִּדָּה, אֶלָּא אַרְבַּע אַמּוֹת הָיָה מַעֲקֶה:",
    "4:7": "מֵהַמִּזְרָח לַמַּעֲרָב מֵאָה אַמָּה, כֹּתֶל הָאוּלָם חָמֵשׁ, וְהָאוּלָם אַחַד עָשָׂר, כֹּתֶל הַהֵיכָל שֵׁשׁ, וְתוֹכוֹ אַרְבָּעִים אַמָּה, אַמָּה טְרַקְסִין, וְעֶשְׂרִים אַמָּה בֵּית קֹדֶשׁ הַקֳּדָשִׁים, כֹּתֶל הַהֵיכָל שֵׁשׁ, וְהַתָּא שֵׁשׁ, וְכֹתֶל הַתָּא חָמֵשׁ. מִן הַצָּפוֹן לַדָּרוֹם שִׁבְעִים אַמָּה, כֹּתֶל הַמְּסִבָּה חָמֵשׁ, וְהַמְּסִבָּה שָׁלֹשׁ, כֹּתֶל הַתָּא חָמֵשׁ, וְהַתָּא שֵׁשׁ, כֹּתֶל הַהֵיכָל שֵׁשׁ, וְתוֹכוֹ עֶשְׂרִים אַמָּה, כֹּתֶל הַהֵיכָל שֵׁשׁ, וְהַתָּא שֵׁשׁ, וְכֹתֶל הַתָּא חָמֵשׁ, וּבֵית הוֹרָדַת הַמַּיִם שָׁלֹשׁ אַמּוֹת, וְהַכֹּתֶל חָמֵשׁ אַמּוֹת. הָאוּלָם עוֹדֵף עָלָיו חֲמֵשׁ עֶשְׂרֵה אַמָּה מִן הַצָּפוֹן, וַחֲמֵשׁ עֶשְׂרֵה אַמָּה מִן הַדָּרוֹם, וְהוּא הָיָה נִקְרָא בֵּית הַחֲלִיפוֹת, שֶׁשָּׁם גּוֹנְזִים אֶת הַסַּכִּינִים. וְהַהֵיכָל צַר מֵאַחֲרָיו, וְרָחָב מִלְּפָנָיו, וְדוֹמֶה לַאֲרִי, שֶׁנֶּאֱמַר (ישעיה כט), הוֹי אֲרִיאֵל אֲרִיאֵל קִרְיַת חָנָה דָוִד, מָה הָאֲרִי צַר מֵאַחֲרָיו וְרָחָב מִלְּפָנָיו, אַף הַהֵיכָל צַר מֵאַחֲרָיו וְרָחָב מִלְּפָנָיו:",
    "5:1": "כָּל הָעֲזָרָה הָיְתָה אֹרֶךְ מֵאָה וּשְׁמוֹנִים וָשֶׁבַע עַל רֹחַב מֵאָה וּשְׁלֹשִׁים וְחָמֵשׁ. מִן הַמִּזְרָח לַמַּעֲרָב מֵאָה וּשְׁמוֹנִים וָשֶׁבַע, מְקוֹם דְּרִיסַת יִשְׂרָאֵל אַחַת עֶשְׂרֵה אַמָּה, מְקוֹם דְּרִיסַת הַכֹּהֲנִים אַחַת עֶשְׂרֵה אַמָּה, הַמִּזְבֵּחַ שְׁלֹשִׁים וּשְׁתַּיִם, בֵּין הָאוּלָם וְלַמִּזְבֵּחַ עֶשְׂרִים וּשְׁתַּיִם אַמָּה, הַהֵיכָל מֵאָה אַמָּה, וְאַחַת עֶשְׂרֵה אַמָּה לַאֲחוֹרֵי בֵית הַכַּפֹּרֶת:",
    "5:2": "מִן הַצָּפוֹן לַדָּרוֹם מֵאָה וּשְׁלֹשִׁים וְחָמֵשׁ, הַכֶּבֶשׁ וְהַמִּזְבֵּחַ שִׁשִּׁים וּשְׁתַּיִם. מִן הַמִּזְבֵּחַ לַטַּבָּעוֹת שְׁמֹנֶה אַמּוֹת, מְקוֹם הַטַּבָּעוֹת עֶשְׂרִים וְאַרְבַּע, מִן הַטַּבָּעוֹת לַשֻּׁלְחָנוֹת אַרְבַּע, מִן הַשֻּׁלְחָנוֹת וְלַנַּנָּסִין אַרְבַּע. מִן הַנַּנָּסִין לְכֹתֶל הָעֲזָרָה שְׁמֹנֶה אַמּוֹת, וְהַמּוֹתָר בֵּין הַכֶּבֶשׁ לַכֹּתֶל וּמְקוֹם הַנַּנָּסִין:",
    "5:3": "שֵׁשׁ לְשָׁכוֹת הָיוּ בָעֲזָרָה, שָׁלֹשׁ בַּצָּפוֹן וְשָׁלֹשׁ בַּדָּרוֹם. שֶׁבַּצָּפוֹן, לִשְׁכַּת הַמֶּלַח, לִשְׁכַּת הַפַּרְוָה, לִשְׁכַּת הַמְדִיחִים. לִשְׁכַּת הַמֶּלַח, שָׁם הָיוּ נוֹתְנִים מֶלַח לַקָּרְבָּן. לִשְׁכַּת הַפַּרְוָה, שָׁם הָיוּ מוֹלְחִין עוֹרוֹת קָדָשִׁים, וְעַל גַּגָּהּ הָיָה בֵית הַטְּבִילָה לְכֹהֵן גָּדוֹל בְּיוֹם הַכִּפּוּרִים. לִשְׁכַּת הַמְדִיחִין, שֶׁשָּׁם הָיוּ מְדִיחִין קִרְבֵי הַקֳּדָשִׁים. וּמִשָּׁם מְסִבָּה עוֹלָה לְגַג בֵּית הַפַּרְוָה:",
    "5:4": "שֶׁבַּדָּרוֹם, לִשְׁכַּת הָעֵץ, לִשְׁכַּת הַגּוֹלָה, לִשְׁכַּת הַגָּזִית. לִשְׁכַּת הָעֵץ, אָמַר רַבִּי אֱלִיעֶזֶר בֶּן יַעֲקֹב, שָׁכַחְתִּי מֶה הָיְתָה מְשַׁמֶּשֶׁת. אַבָּא שָׁאוּל אוֹמֵר, לִשְׁכַּת כֹּהֵן גָּדוֹל, וְהִיא הָיְתָה אֲחוֹרֵי שְׁתֵּיהֶן, וְגַג שְׁלָשְׁתָּן שָׁוֶה. לִשְׁכַּת הַגּוֹלָה, שָׁם הָיָה בוֹר קָבוּעַ, וְהַגַּלְגַּל נָתוּן עָלָיו, וּמִשָּׁם מַסְפִּיקִים מַיִם לְכָל הָעֲזָרָה. לִשְׁכַּת הַגָּזִית, שָׁם הָיְתָה סַנְהֶדְרִי גְדוֹלָה שֶׁל יִשְׂרָאֵל יוֹשֶׁבֶת וְדָנָה אֶת הַכְּהֻנָּה, וְכֹהֵן שֶׁנִּמְצָא בוֹ פְסוּל, לוֹבֵשׁ שְׁחוֹרִים וּמִתְעַטֵּף שְׁחוֹרִים, וְיוֹצֵא וְהוֹלֵךְ לוֹ. וְשֶׁלֹּא נִמְצָא בוֹ פְסוּל, לוֹבֵשׁ לְבָנִים וּמִתְעַטֵּף לְבָנִים, נִכְנָס וּמְשַׁמֵּשׁ עִם אֶחָיו הַכֹּהֲנִים. וְיוֹם טוֹב הָיוּ עוֹשִׂים, שֶׁלֹּא נִמְצָא פְסוּל בְּזַרְעוֹ שֶׁל אַהֲרֹן הַכֹּהֵן, וְכָךְ הָיוּ אוֹמְרִים, בָּרוּךְ הַמָּקוֹם בָּרוּךְ הוּא, שֶׁלֹּא נִמְצָא פְסוּל בְּזַרְעוֹ שֶׁל אַהֲרֹן. וּבָרוּךְ הוּא, שֶׁבָּחַר בְּאַהֲרֹן וּבְבָנָיו לַעֲמֹד לְשָׁרֵת לִפְנֵי ה' בְּבֵית קָדְשֵׁי הַקֳּדָשִׁים:"
  };
  // 1.0.1-L (L.78-L.81): the throne's slides. pesukim = the default version's text (the verses with Rashi first, then Radak, Metzudat David, Ralbag,
  // Malbim, Abarbanel; every quotation from the Otzaria library: 3673:610-613, 3540:683, 3345:939, 944, 3645:462, 3394:624, 3574:563, 3318:493), the
  // topics mode's plain slide and the verse slide of 10:18-20; lead / leadW = the few words before a timeline's captions (the captions themselves,
  // the midrash's own words, are ctx.shared.throne.script / witnessScript of 60-palace.js); refs = the slide's source links
  var tour_THRONE = { pesukim: "", lead: {}, leadW: "", refs: {} };   // Beit Sheni: no throne (First Temple only); the engine's branches are guarded
  var tour_SHORT = {};
  // 1.0.1-L (L.88): the exhibit's slides. The stand's own axis (x -60; flyPoints.kelim stands 5 east of it to clear the panel, which is closed here); same line of sight, moved 5 west
  var tour_KELIM_GO = [{ pos: [-60, 21, -78], target: [-60, 4.5, -120], f: "kelim" }, { fp: "kelim", f: "kelim" }];
  // 1.0.1-L (L.80, the user: "זהו מקור לכאו' לכך שהכל פעל עפ"י חשמל - ציין זאת כבועה בתוך המצגת"): the inference, marked "לכאורה" and apart from the quotation, is
  // never the Ben Ish Chai's own statement: he speaks of the tower in the air and not of the throne; his words: בן יהוידע על סנהדרין קו: (book 2546, line 778,
  // letter for letter); the Gemara's line "ארבע מאה בעיי בעו דואג ואחיתופל במגדל הפורח באויר": book 125, line 4140
  var tour_BUBBLE = { quote: "", mark: "", inference: "", refs: [] };
  var tour_KINGS = [
    { v: [1, 1, 1], t: "שמירת המקדש", go: [{"place": "המשמרות — שלושה לכהנים ועשרים ואחד ללויים", "act": true}, {"fp": "harHabayit"}],
      x: "הכהנים שומרים בשלושה מקומות — בית אבטינס ובית הניצוץ (עליות על גבי שערים) ובית המוקד (כיפה) — והלויים בעשרים ואחד מקום: על שערי הר הבית ופינותיו מבפנים, על שערי העזרה ופינותיה מבחוץ, ובלשכות. השמירה אינה מפני גנבים אלא כבוד למקדש: 'אינו דומה פלטרין שיש עליו שומרין לפלטרין שאין עליו שומרין' (רמב״ם בית הבחירה ח, א). במודל: מקומות המשמר יסומנו בשלב הבא.",
      r: [["רמב״ם בית הבחירה ח, א", ["RB", 8, 1]], ["רמב״ם בית הבחירה ח, ד", ["RB", 8, 4]], ["תמיד א, א", ["MN", 88, 1, 1]]] },
    { v: [1, 2, 2], t: "איש הר הבית", go: [{"pos": [-20, 250, 150], "target": [-20, 20, 0], "lay": "guards"}, {"fp": "harHabayit"}],
      x: "הממונה על השומרים מחזר בלילה על כל משמר ואבוקות לפניו. שומר שאינו עומד — חובטו במקלו, ורשות בידו לשרוף את כסותו; לכן אמרו 'קול בעזרה — קול בן לוי לוקה ובגדיו נשרפין'. הרמב״ם (ח, י): 'ומעמידין ממונה אחד על כל משמרות השומרים ואיש הר הבית היה נקרא'.",
      r: [["רמב״ם בית הבחירה ח, י", ["RB", 8, 10]]] },
    { v: [1, 3, 3], t: "חמישה שערים להר הבית", go: [{"fp": "harHabayit"}],
      x: "שני שערי חולדה מן הדרום — לכניסה וליציאה; קיפונוס מן המערב; טדי מן הצפון — 'לא היה משמש כלום'; והשער המזרחי שעליו שושן הבירה צורה, שבו כהן גדול השורף את הפרה יוצא להר המשחה. כל השערים במודל מרובעים ומשקוף אבן על גביהם, ושער טדי — שתי אבנים מוטות זו על זו (מידות ב, ג).",
      r: [["רמב״ם בית הבחירה ה, ב", ["RB", 5, 2]], ["מידות ב, ג", ["MI", 2, 3]]],
      then: [{"go": [{"pos": [55, 24, 436], "target": [55, 10, 340]}], "at": 0.2, "dur": 1500}, {"go": [{"pos": [-204, 16, 0], "target": [-154, 10, 0]}], "at": 0.4, "dur": 1500}, {"go": [{"pos": [55, 16, -224], "target": [55, 13, -174.5]}], "at": 0.6, "dur": 1500}, {"go": [{"pos": [455, 24, -88], "target": [392, -4, 0]}], "at": 0.8, "dur": 1500}] },
    { v: [1, 4, 4], t: "שבעה שערים לעזרה", go: [{"fp": "azarah"}],
      x: "שלושה בצפון, שלושה בדרום ואחד במזרח. בדרום: שער הדלק (שבו מכניסים עצים למערכה), שער הבכורות (שבו מכניסים את הבכורות לשחיטה), שער המים (שבו מכניסים צלוחית של מים לניסוך בחג). במזרח שער ניקנור, ושתי לשכות לו — לשכת פנחס המלביש ולשכת עושי חביתין; ולשכות היו תחת עזרת ישראל, ופתוחות לעזרת הנשים, ששם הלוים נותנים כינורות ונבלים ומצלתיים (מידות ב, ו) — במודל, מתחת לשתי הלשכות. מקומם של שערי הצפון והדרום בכותל — 'סמוכים למערב' לפי המשנה והרמב״ם — ראה בתפריט, תחת ״שיטות ומחלוקות״.",
      r: [["רמב״ם בית הבחירה ה, ד", ["RB", 5, 4]], ["שקלים ו, ג", ["MN", 54, 6, 3]], ["מידות ב, ו", ["MI", 2, 6]]] },
    { v: [1, 5, 5], t: "שערי הצפון: הניצוץ, הקרבן ובית המוקד", go: [{"place": "שער הניצוץ"}, {"fp": "azarah"}],
      x: "שער הניצוץ — כמין אכסדרה, ועלייה בנויה על גביו: הכהנים שומרים מלמעלה והלויים מלמטה, ופתח היה לו לחיל. שני לו שער הקרבן, שלישי לו בית המוקד — שהוא עצמו היה השער, ופתחו לעזרה הוא השער השלישי (ראה בתפריט, תחת ״שיטות ומחלוקות״).",
      r: [["רמב״ם בית הבחירה ה, ד", ["RB", 5, 4]], ["רמב״ם בית הבחירה ח, ה", ["RB", 8, 5]]] },
    { v: [1, 6, 6], t: "ארבע לשכות בית המוקד", go: [{"place": "בית המוקד", "act": true}],
      x: "כקיטוניות הפתוחות לטרקלין: דרומית־מערבית — לשכת טלאי קרבן התמיד; דרומית־מזרחית — לשכת עושי לחם הפנים; צפונית־מזרחית — שם גנזו בני חשמונאי את אבני המזבח ששיקצום מלכי יוון; צפונית־מערבית — בה יורדים לבית הטבילה. שתיים בקודש ושתיים בחול, וראשי פספסין מבדילים.",
      r: [["תמיד ג, ג", ["MN", 88, 3, 3]], ["רמב״ם בית הבחירה ה, יא", ["RB", 5, 11]]] },
    { v: [1, 7, 7], t: "שני שערים לבית המוקד", go: [{"pos": [8, 66, -112], "target": [-15, 17, -69]}, {"place": "בית המוקד", "act": true}],
      x: "פתח אחד לחיל ופתח אחד לעזרה. בשער הפתוח לעזרה פשפש קטן, שבו נכנסים לבלוש את העזרה בבוקר קודם פתיחת השערים (תמיד א, ג). במודל שני הפתחים נוספו בתיקון 1.0.6.",
      r: [["תמיד א, ג", ["MN", 88, 1, 3]]],
      then: [{"go": [{"place": "שער בית המוקד — פתחו של הבית לעזרה"}], "at": 0.5, "dur": 1500}] },
    { v: [1, 8, 8], t: "בית המוקד — כיפה ורובדין", go: [{"place": "בית המוקד", "act": true}],
      x: "בית גדול מוקף רובדין של אבן — מדרגות־אצטבאות — שבהן ישנים זקני בית אב, ומפתחות העזרה בידם; פרחי כהונה ישנים על הרצפה, 'איש כסתו בארץ'. שמו על שם המדורה הגדולה שדלקה בו לחמם את הכהנים ההולכים יחפים על הרצפה.",
      r: [["תמיד א, א", ["MN", 88, 1, 1]], ["רמב״ם בית הבחירה ח, ה", ["RB", 8, 5]]],
      then: [{"go": [{"pos": [-18, 28.56, -64.16], "target": [-18, 16, -67.5]}], "at": 0.5, "dur": 1500}] },
    { v: [1, 9, 9], t: "מקום המפתחות ובית הטבילה", go: [{"place": "בית המוקד", "act": true}],
      x: "מקום היה שם אמה על אמה, וטבלא של שיש וטבעת קבועה בה ושלשלת שהמפתחות תלויות בה; הגיע זמן הנעילה — הגביה את הטבלא בטבעת, נטל את המפתחות, נעל, והחזיר את המפתחות והטבלא למקומן, וכסתו עליהן. מי שאירע בו קרי — יורד במסיבה ההולכת תחת הבירה לבית הטבילה, ונרות דולקים מכאן ומכאן.",
      r: [["תמיד א, א", ["MN", 88, 1, 1]], ["רמב״ם בית הבחירה ה, יא", ["RB", 5, 11]]],
      then: [{"go": [{"pos": [-20, 23.6, -68.19], "target": [-20, 14.9, -70.5]}], "at": 0.5, "dur": 1500}] },
    { v: [2, 1, 1], t: "הר הבית — חמש מאות על חמש מאות", go: [{"fp": "harHabayit"}],
      x: "רובו מן הדרום, שני לו מן המזרח, שלישי לו מן הצפון, ומיעוטו מן המערב — 'מקום שהיה רוב מדתו שם היה רוב תשמישו'. במודל: העזרה מוסטת לצפון־מערב ההר בהתאם, והסטיו המלכותי ושערי חולדה בדרום הרחב.",
      r: [["רמב״ם בית הבחירה ה, א", ["RB", 5, 1]], ["רמב״ם בית הבחירה ה, ו", ["RB", 5, 6]]] },
    { v: [2, 2, 2], t: "הנכנסים להר הבית", go: [{"place": "שערי חולדה"}, {"fp": "harHabayit"}],
      x: "כל הנכנסים נכנסים דרך ימין, מקיפים ויוצאים דרך שמאל — חוץ ממי שאירעו דבר (אבל ומנודה), שמקיף לשמאל, וכשרואים אותו מקיף לשמאל שואלים 'מה לך מקיף לשמאל?' ומברכים אותו: 'השוכן בבית הזה ינחמך'.",
      r: [["רמב״ם בית הבחירה ז, ג", ["RB", 7, 3]]] },
    { v: [2, 3, 3], t: "הסורג והחיל", go: [{"place": "הסורג"}, {"fp": "ezratNashim"}],
      x: "לפנים מן החומה הסורג — מחיצת שתי וערב גבוהה עשרה טפחים — ובו שלוש עשרה פרצות שפרצו מלכי יוון, וחזרו וגדרום וגזרו כנגדן שלוש עשרה השתחוויות. לפנים ממנו החיל, עשר אמות, ושתים עשרה מעלות — רום מעלה חצי אמה ושלחה חצי אמה. כל הפתחים גובהם עשרים אמה ורוחבם עשר חוץ משל אולם; כל השערים מצופים זהב חוץ משער ניקנור, שנעשה בהם נס (יומא לח.). מקומן של שתים עשרה המעלות — ראה בתפריט, תחת ״שיטות ומחלוקות״.",
      r: [["רמב״ם בית הבחירה ה, ג", ["RB", 5, 3]], ["יומא לח.", ["P", 107, "לח."]]] },
    { v: [2, 4, 4], t: "כותל המזרח הנמוך", go: [{"place": "שער שושן"}, {"fp": "shushanGate"}],
      x: "כל הכתלים גבוהים חוץ מכותל המזרחי — שהכהן השורף את הפרה עומד בראש הר המשחה ומתכוון ורואה בפתחו של היכל בשעת הזאת הדם. הוא כותל המזרח של הר הבית, שבו שער שושן (רש״י וברטנורא). לרמב״ם רק הכותל שעל גבי השער נמוך; לתפארת ישראל כל הכותל מעט יותר מעשרים; לפסקי תוספות שש אמות; לרבינו שמעיה — כותל החיל, כעשר אמות. כל השיטות — בתפריט, תחת ״שיטות ומחלוקות״.",
      r: [["רמב״ם בית הבחירה ו, ה", ["RB", 6, 5]], ["פרה ג, ט", ["MN", 94, 3, 9]]] },
    { v: [2, 5, 5], t: "עזרת נשים", go: [{"place": "עזרת נשים", "act": true}, {"fp": "ezratNashim"}],
      x: "אורך מאה ושלושים וחמש על רוחב מאה ושלושים וחמש, וארבע לשכות בארבע מקצועותיה של ארבעים אמה: לשכת הנזירים (דרומית־מזרחית), לשכת העצים (צפונית־מזרחית), לשכת המצורעים (צפונית־מערבית), לשכת בית שמניא (דרומית־מערבית). חלקה היתה בראשונה והקיפוה כצוצרה, שהנשים רואות מלמעלן. חמש עשרה מעלות עולות ממנה לעזרת ישראל, כנגד חמש עשרה שיר המעלות, שעליהן הלויים אומרים בשיר — לא טרוטות אלא מוקפות כחצי גורן עגולה.",
      r: [["רמב״ם בית הבחירה ה, ז", ["RB", 5, 7]], ["רמב״ם בית הבחירה ה, ח", ["RB", 5, 8]], ["סוכה ה, ד", ["MN", 56, 5, 4]]] },
    { v: [2, 6, 6], t: "עזרת ישראל, הדוכן ולשכות העזרה", go: [{"place": "דוכן הלויים", "act": true}, {"fp": "azarah"}],
      x: "עזרת ישראל מאה ושלושים וחמש על אחת עשרה, וכן עזרת הכהנים; ראשי פספסין מבדילים ביניהן, ורבי אליעזר בן יעקב אומר: מעלה היתה שם גבוהה אמה והדוכן נתון עליה ובה שלוש מעלות של חצי חצי אמה — וכך במודל (רמב״ם ו, ג). שש לשכות בעזרה, שלוש בצפון ושלוש בדרום; לשכת הגזית — בצפון (יומא יט.; רמב״ם ה, יז).",
      r: [["רמב״ם בית הבחירה ו, ג", ["RB", 6, 3]], ["רמב״ם בית הבחירה ה, יז", ["RB", 5, 17]], ["יומא יט.", ["P", 107, "יט."]]] },
    { v: [3, 1, 1], t: "המזבח", go: [{"place": "מידות המזבח — 32, 30, 28, 26, 24, והמזבח הקודם 28 על 28", "act": true}, {"fp": "mizbeach"}],
      x: "שלושים ושתיים על שלושים ושתיים: עלה אמה וכנס אמה — זה היסוד; חמש וכנס אמה — זה הסובב; שלוש וכנס אמה — מקום הקרנות, אמה מכאן ואמה מכאן, ומקום הילוך רגלי הכהנים אמה מכאן ואמה מכאן; נמצא מקום המערכה עשרים ושמונה על עשרים ושמונה. היסוד מהלך על פני כל הצפון וכל המערב ואוכל בדרום אמה אחת ובמזרח אמה אחת. רבי יוסי: מתחילה היה עשרים ושמונה, וכשעלו בני הגולה הוסיפו עליו ארבע אמות מן הדרום וארבע מן המערב כמין גמא — 'והאריאל שתים עשרה' (יחזקאל מג).",
      r: [["רמב״ם בית הבחירה ב, ה", ["RB", 2, 5]], ["רמב״ם בית הבחירה ב, ז", ["RB", 2, 7]], ["זבחים סא:", ["P", 130, "סא:"]]] },
    { v: [3, 2, 2], t: "נקבי היסוד", go: [{"place": "השיתין — שני הנקבים וטבלת השיש"}, {"fp": "mizbeach"}],
      x: "בקרן מערבית־דרומית שני נקבים כמין שני חוטמין דקין, שהדמים הניתנים על יסוד מערבי ועל יסוד דרומי יורדים בהם ומתערבים באמה ויוצאים לנחל קדרון — ונמכרים לגננים לזבל (יומא ה, ו). הכיוון: שיירי הדם של החיצון ליסוד דרומי, ושל הפנימי ליסוד מערבי (יומא נח:).",
      r: [["רמב״ם בית הבחירה ב, יא", ["RB", 2, 11]], ["יומא ה, ו", ["MN", 55, 5, 6]], ["יומא נח:", ["P", 107, "נח:"]]] },
    { v: [3, 3, 3], t: "הטבלא, השיתין והכבש", go: [{"place": "הכבש הגדול"}, {"fp": "mizbeach"}],
      x: "למטה ברצפה באותה הקרן מקום אמה על אמה, וטבלא של שיש וטבעת קבועה בה, שבו יורדים לשית ומנקים אותו. כבש היה לדרומו של מזבח, שלושים ושתיים על רוחב שש עשרה, ורבובה היתה לו במערבו — חלון שבו נותנים פסולי חטאת העוף עד שתעובר צורתם. שני כבשים קטנים יוצאים ממנו, אחד לסובב ואחד ליסוד (רמב״ם ב, יד) — ראה בתפריט, תחת ״שיטות ומחלוקות״.",
      r: [["רמב״ם בית הבחירה ב, יב", ["RB", 2, 12]], ["רמב״ם בית הבחירה ב, יג", ["RB", 2, 13]], ["רמב״ם בית הבחירה ב, יד", ["RB", 2, 14]]] },
    { v: [3, 4, 4], t: "אבני המזבח והכבש", go: [{"fp": "mizbeach"}],
      x: "אחד אבני הכבש ואחד אבני המזבח — מבקעת בית כרם, חופרים למטה מן הבתולה ומביאים אבנים שלמות שלא הונף עליהן ברזל, שהברזל פוסל בנגיעה ופגימה בכל דבר. אבן שנפגמה — פסולה, וחברותיה כשרות. מלבנים אותן פעמיים בשנה, בפסח ובחג, וההיכל פעם אחת בפסח; רבי אומר: כל ערב שבת מלבנים אותן במפה מפני הדמים. לא היו סדים אותן בכפיס של ברזל, 'שלא יגע בהן הברזל ויפסול'.",
      r: [["רמב״ם בית הבחירה א, יד", ["RB", 1, 14]], ["רמב״ם בית הבחירה א, טז", ["RB", 1, 16]]] },
    { v: [3, 5, 5], t: "הטבעות, השולחנות והננסין", go: [{"place": "בית המטבחים"}, {"fp": "azarah"}],
      x: "טבעות היו לצפונו של מזבח — שש סדרים של ארבע ארבע, ויש אומרים ארבע של שש שש — שעליהן שוחטים את הקדשים: מכניסים צוואר הבהמה לטבעת. בית המטבחיים לצפונו של מזבח: שמונה עמודים ננסים ורביעים של ארז על גביהם, ואונקליות של ברזל קבועים בהם, ושלושה סדרים לכל אחד — שבהם תולים ומפשיטים, על שולחנות של שיש שבין העמודים.",
      r: [["רמב״ם בית הבחירה ה, יד", ["RB", 5, 14]], ["רמב״ם בית הבחירה ה, טו", ["RB", 5, 15]], ["תמיד ג, ה", ["MN", 88, 3, 5]]] },
    { v: [3, 6, 6], t: "הכיור ומעלות האולם", go: [{"place": "הכיור"}, {"fp": "ulam"}],
      x: "הכיור בין האולם ולמזבח, משוך כלפי הדרום (זבחים נט.). בין האולם ולמזבח עשרים ושתיים אמה, ושתים עשרה מעלות — רום מעלה חצי אמה ושלחה אמה — אמה אמה ורובד שלוש, אמה אמה ורובד שלוש, והעליונה אמה אמה ורובד ארבע; רבי יהודה אומר: העליונה אמה אמה ורובד חמש. ברטנורא (כמו במודל), תפארת ישראל או הרמב״ם — ראה בתפריט, תחת ״שיטות ומחלוקות״.",
      r: [["רמב״ם בית הבחירה ו, ד", ["RB", 6, 4]], ["רמב״ם בית הבחירה ג, יח", ["RB", 3, 18]], ["זבחים נט.", ["P", 130, "נט."]]] },
    { v: [3, 7, 7], t: "פתחו של אולם", go: [{"pos": [78, 48, 0], "target": [15, 52, 0]}, {"fp": "ulam"}],
      x: "גובהו ארבעים אמה ורוחבו עשרים, וחמש מלתראות של מילה — קורות מגולפות של עץ מילה — על גביו: התחתונה עודפת על הפתח אמה מזה ואמה מזה, ושלמעלה ממנה עודפת עליה אמה מזה ואמה מזה, נמצאת העליונה שלושים אמה; ונדבך של אבנים בין כל אחת ואחת.",
      r: [["רמב״ם בית הבחירה ד, ח", ["RB", 4, 8]]] },
    { v: [3, 8, 8], t: "כלונסות, שרשרות וגפן של זהב", go: [{"place": "הגפן של זהב", "act": true}, {"fp": "ulam"}],
      x: "כלונסות של ארז קבועים מכותלו של היכל לכותלו של אולם, כדי שלא יבעט — שלא יטה כותל האולם הגבוה. שרשרות של זהב בתקרת האולם, שבהן פרחי כהונה עולים ורואים את העטרות שבחלונות (זכריה ו). גפן של זהב עומדת על פתחו של היכל, מודלה על גבי כלונסות, וכל המתנדב עלה או גרגיר או אשכול — מביא ותולה בה; אמר רבי אליעזר ברבי צדוק: מעשה היה ונמנו עליה שלוש מאות כהנים לפנותה.",
      r: [["רמב״ם בית הבחירה ד, ח", ["RB", 4, 8]]] },
    { v: [4, 1, 1], t: "פתחו של היכל ודלתותיו", go: [{"place": "פתיחת השער הגדול — הדגמה", "act": true}, {"place": "השער הגדול — ארבע הדלתות"}, {"fp": "kodesh"}],
      x: "גובהו עשרים אמה ורוחבו עשר, וארבע דלתות לו — שתיים מבפנים ושתיים מבחוץ. החיצונות נפתחות לתוך הפתח לכסות עוביו של כותל, והפנימיות נפתחות לתוך הבית לכסות אחר הדלתות — שכל הבית טוח בזהב חוץ מאחר הדלתות. רבי יהודה אומר: בתוך הפתח היו עומדות, כמין איצטרמיטה, ונקפלות לאחוריהן.",
      r: [["רמב״ם בית הבחירה ד, ז", ["RB", 4, 7]]] },
    { v: [4, 2, 2], t: "שני פשפשין לשער הגדול", go: [{"place": "פשפשי ההיכל", "act": true}, {"fp": "kodesh"}],
      x: "אחד בצפון ואחד בדרום; שבדרום לא נכנס בו אדם מעולם, ועליו מפורש על ידי יחזקאל (מד, ב): 'השער הזה סגור יהיה'. נטל את המפתח ופתח את הפשפש, נכנס לתא ומן התא להיכל, עד שמגיע לשער הגדול, ופותחו מבפנים; רבי יהודה אומר: בתוך עוביו של כותל היה מהלך.",
      r: [["רמב״ם בית הבחירה ד, ו", ["RB", 4, 6]], ["תמיד ג, ז", ["MN", 88, 3, 7]]] },
    { v: [4, 3, 3], t: "שלושים ושמונה תאים", go: [{"place": "התאים — שלושים ושמונה בשלוש קומות", "act": true}, {"fp": "heichalFront"}],
      x: "חמישה עשר בצפון, חמישה עשר בדרום ושמונה במערב: שבצפון ושבדרום — חמישה על גבי חמישה וחמישה על גביהן; שבמערב — שלושה על גבי שלושה ושניים על גביהן. שלושה פתחים לכל אחד: לתא מן הימין, לתא מן השמאל, ולתא שעל גביו; ובקרן צפונית־מזרחית חמישה פתחים — לתא מן הימין, לתא שעל גביו, למסיבה, לפשפש, ולהיכל. במודל: התאים ייבנו בשלב הבא.",
      r: [["רמב״ם בית הבחירה ד, יא", ["RB", 4, 11]]] },
    { v: [4, 4, 4], t: "רוחב התאים", go: [{"place": "התאים — שלושים ושמונה בשלוש קומות", "act": true}, {"fp": "heichalFront"}],
      x: "התחתונה חמש ורובד שש, האמצעית שש ורובד שבע, והעליונה שבע — שנאמר 'היציע התחתונה חמש באמה רחבה והתיכונה שש באמה רחבה והשלישית שבע באמה רחבה' (מלכים א ו, ו): כותל ההיכל נכנס בכל קומה אמה, והתא רחב בה אמה יותר.",
      r: [["רמב״ם בית הבחירה ד, ה", ["RB", 4, 5]]] },
    { v: [4, 5, 5], t: "המסיבה, העלייה והלולין", go: [{"place": "המסיבה", "act": true}, {"fp": "heichalFront"}],
      x: "מסיבה עולה מקרן מזרחית־צפונית לקרן צפונית־מערבית, ומשם למערב ולדרום, עד פתחה של עלייה — פתוח לדרום. בפתחה שני כלונסות של ארז שבהן עולים לגגה של עלייה. ראשי פספסין מבדילים בעלייה בין הקודש לקודש הקדשים, ולולין פתוחים בעלייה לבית קודש הקדשים — שבהם משלשלים את האומנים בתיבות, כדי שלא יזונו עיניהם מבית קודשי הקדשים (פסחים כו.). במודל: ייבנה בשלב הבא.",
      r: [["רמב״ם בית הבחירה ד, יב", ["RB", 4, 12]], ["רמב״ם בית הבחירה ד, יג", ["RB", 4, 13]], ["פסחים כו.", ["P", 106, "כו."]]] },
    { v: [4, 6, 6], t: "גובה ההיכל — מאה אמה", go: [{"place": "גובה ההיכל — מאה אמה מרצפת העזרה (1.1.0)"}, {"fp": "heichalFront"}],
      x: "האוטם שש אמות, גובהו ארבעים אמה, אמה כיור, אמתיים בית דילפה, אמה תקרה, אמה מעזיבה; גובה העלייה ארבעים אמה, אמה כיור, אמתיים בית דילפה, אמה תקרה, אמה מעזיבה, שלוש אמות מעקה ואמה כלה עורב — טבלאות חדות על הגג שלא ישבו עליו העורבים. רבי יהודה אומר: לא היה כלה עורב עולה מן המידה, אלא ארבע אמות היה מעקה. במודל גובה ההיכל מאה אמה; שתי השיטות במעקה — ראה בתפריט, תחת ״שיטות ומחלוקות״.",
      r: [["רמב״ם בית הבחירה ד, ג", ["RB", 4, 3]], ["ערכין ו.", ["P", 134, "ו."]]] },
    { v: [4, 7, 7], t: "ההיכל — מאה על מאה, וצר מאחוריו", go: [{"pos": [-30, 250, 70], "target": [-45, 60, 0]}, {"fp": "heichalFront"}],
      x: "ממזרח למערב מאה: כותל האולם חמש, האולם אחת עשרה, כותל ההיכל שש, תוכו ארבעים, אמה טרקסין, עשרים אמה בית קודש הקדשים, כותל ההיכל שש, התא שש, כותל התא חמש. מן הצפון לדרום שבעים: כותל המסיבה חמש, המסיבה שלוש, כותל התא חמש, התא שש, כותל ההיכל שש, תוכו עשרים, כותל ההיכל שש, התא שש, כותל התא חמש, בית הורדת המים שלוש, הכותל חמש. האולם עודף עליו חמש עשרה אמה מן הצפון וחמש עשרה מן הדרום — בית החליפות, ששם גונזים את הסכינים. ההיכל צר מאחוריו ורחב מלפניו, דומה לארי: 'הוי אריאל אריאל קרית חנה דוד'. רוחב האולם לפי המשנה או הרמב״ם — ראה בתפריט, תחת ״שיטות ומחלוקות״.",
      r: [["רמב״ם בית הבחירה ד, ד", ["RB", 4, 4]], ["רמב״ם בית הבחירה ד, ה", ["RB", 4, 5]], ["רמב״ם בית הבחירה ד, ט", ["RB", 4, 9]]] },
    { v: [5, 1, 1], t: "העזרה — ממזרח למערב", go: [{"fp": "azarah"}],
      x: "כל העזרה אורך מאה ושמונים ושבע על רוחב מאה ושלושים וחמש. ממזרח למערב: אחת עשרה אמה מקום דריסת רגלי ישראל, אחת עשרה אמה מקום דריסת רגלי הכהנים, המזבח שלושים ושתיים, בין האולם ולמזבח עשרים ושתיים, ההיכל מאה אמה, ואחת עשרה אמה לאחורי בית הכפורת.",
      r: [["רמב״ם בית הבחירה ה, יב", ["RB", 5, 12]]] },
    { v: [5, 2, 2], t: "העזרה — מצפון לדרום", go: [{"pos": [150, 120, 0.5], "target": [20, 15, 0]}, {"fp": "azarah"}],
      x: "מן הצפון לדרום מאה ושלושים וחמש: הכבש והמזבח שישים ושתיים, מן המזבח לטבעות שמונה אמות, מקום הטבעות עשרים וארבע, מן הטבעות לשולחנות ארבע, מן השולחנות לננסין ארבע, מן הננסין לכותל העזרה שמונה אמות, והמותר — בין הכבש לכותל ומקום הננסין. מכאן שהמזבח אינו באמצע העזרה; מקומו המדויק — מחלוקת בזבחים נח:–נט.; ראה את המתג ״מקום המזבח בעזרה״ בתפריט, תחת ״שיטות ומחלוקות״.",
      r: [["רמב״ם בית הבחירה ה, יג", ["RB", 5, 13]], ["זבחים נח:", ["P", 130, "נח:"]]] },
    { v: [5, 3, 3], t: "לשכות הדרום", go: [{"place": "לשכת המלח", "act": true}, {"fp": "azarah"}],
      x: "לשכת המלח — שם נותנים מלח לקרבן; לשכת הפרוה — שם מולחים עורות קדשים, ועל גגה בית הטבילה לכהן גדול ביום הכיפורים; לשכת המדיחין — שם מדיחים קרבי הקדשים, ומסיבה עולה ממנה לגג בית הפרוה. על שם פרוה אמגושא, שבנאה.",
      r: [["רמב״ם בית הבחירה ה, יז", ["RB", 5, 17]], ["יומא ג, ג", ["MN", 55, 3, 3]]] },
    { v: [5, 4, 4], t: "לשכות הצפון", go: [{"place": "לשכת הגזית — הסנהדרין", "act": true}, {"fp": "azarah"}],
      x: "לשכת העץ — לשכת כהן גדול (פרהדרין), אחורי שתיהן, וגג שלושתן שווה; לשכת הגולה — בור קבוע וגלגל נתון עליו, ומשם מספקים מים לכל העזרה; לשכת הגזית — שם סנהדרין גדולה של ישראל יושבת ודנה את הכהונה: כהן שנמצא בו פסול לובש שחורים ומתעטף שחורים ויוצא, ושלא נמצא בו פסול לובש לבנים ונכנס ומשמש עם אחיו הכהנים, ויום טוב היו עושים — 'ברוך המקום ברוך הוא שלא נמצא פסול בזרעו של אהרן'. לשכת הגזית בצפון (יומא יט.; רמב״ם ה, יז).",
      r: [["רמב״ם בית הבחירה ה, יז", ["RB", 5, 17]], ["יומא יט.", ["P", 107, "יט."]], ["סנהדרין יא, ב", ["MN", 73, 11, 2]]] }
  ];
  function tour_heb(n) {
    if (n === 15) return "טו";
    if (n === 16) return "טז";
    const T = ["", "י", "כ", "ל", "מ", "נ", "ס", "ע", "פ", "צ"], O = ["", "א", "ב", "ג", "ד", "ה", "ו", "ז", "ח", "ט"];
    return (T[Math.floor(n / 10)] || "") + (O[n % 10] || "");
  }
  // a source spec -> the UI's ref ({book, index} from ui_V / ui_P / ui_MI / ui_MN / ui_RB of 70-ui.js);
  // 1.0.1-L: ["L", book, line, sef?] = a line of the Otzaria library named directly (commentaries and pages the UI's tables do not hold)
  function tour_ref(sp) {
    try {
      if (sp[0] === "L") return { book: sp[1], index: sp[2] };
      if (sp[0] === "V") {
        if (typeof ui_V === "function") return ui_V(sp[1], sp[2], sp[3]);
        return null;
      }
      if (sp[0] === "P" && typeof ui_P === "function") return ui_P(sp[1], sp[2]);
      if (sp[0] === "MI") return typeof ui_MI === "function" ? ui_MI(sp[1], sp[2]) : null;
      if (sp[0] === "MN" && typeof ui_MN === "function") return ui_MN(sp[1], sp[2], sp[3]);
      if (sp[0] === "RB" && typeof ui_RB === "function") return ui_RB(sp[1], sp[2]);
    } catch (_) {
    }
    return null;
  }
  async function buildTour(ctx) {
    try {
      const U = ctx.ui;
      if (!U || !Array.isArray(U.views)) return;   // the UI did not load: no presentation
      if (!Array.isArray(ctx.animated)) ctx.animated = [];
      if (!ctx.shared) ctx.shared = {};
      const style = document.createElement("style");
      style.textContent = tour_CSS;
      document.head.appendChild(style);
      const CO = ctx.CO || {};
      const fnc = (f) => typeof f === "function";
      const call = (f, ...a) => {
        try {
          return fnc(f) ? f(...a) : undefined;
        } catch (_) {
          return undefined;
        }
      };
      const fin3 = (a) => Array.isArray(a) && a.length >= 3 && isFinite(a[0]) && isFinite(a[1]) && isFinite(a[2]);
      const now = () => performance.now();
      const inside = (node, el) => {
        for (let n = node; n && el; n = n.parentNode) if (n === el) return true;
        return false;
      };
      // ---- the UI's API (70-ui.js ctx.ui), each call guarded ----
      const confirmOpen = () => !!call(U.confirmOpen);
      const cloudOn = () => !!call(U.cloudOn);
      const resolveFp = (key) => {
        const f = call(U.resolveFp, key);
        return f && fin3(f.pos) && fin3(f.target) ? f : null;
      };
      const fly = (pos, target, dur) => {
        if (fnc(U.fly)) call(U.fly, pos, target, dur);
        else call(ctx.flyTo, pos, target, dur);
      };
      const setInfo = (key, custom) => call(U.setInfo, key, custom);
      // 1.0.1-L (L.34): the floating explanation card of the panel (ctx.ui.card)
      const closeXCard = () => {
        const c = U.card;
        if (!c || !fnc(c.close)) return;
        try {
          c.close();
        } catch (_) {
        }
      };
      const layerOn = (name) => !!(ctx.layers && ctx.layers[name] && ctx.layers[name].visible);
      const setLayer = (name, on) => {
        if (fnc(U.setLayer)) call(U.setLayer, name, !!on);
        else if (ctx.layers && ctx.layers[name]) ctx.layers[name].visible = !!on;
      };
      const cfEl = () => document.getElementById("tm-confirm");
      // a pending Holy-of-Holies confirmation is answered "ביטול" (its fly is dropped)
      const cancelConfirm = () => {
        if (!confirmOpen()) return;
        if (fnc(U.cancelConfirm)) return void call(U.cancelConfirm);
        const c = cfEl(), n = c && fnc(c.querySelector) ? c.querySelector(".n") : null;
        if (n && fnc(n.click)) n.click();
        else call(U.closeConfirm);
      };
      // the devir and its aliyah, as the UI's cloud test ("inKK": x -66..CO.xDevirE, |z| < 12, y 14..44)
      const KK_E = typeof CO.xDevirE === "number" ? CO.xDevirE : -44.5;
      const inDevir = (p) => fin3(p) && p[0] > -66 && p[0] < KK_E && p[2] > -12 && p[2] < 12 && p[1] > 14 && p[1] < 44;
      // ---- model features a slide switches on for itself (each undone when the slide is left); a missing one is skipped ----
      const onOff = (o) => (o && fnc(o.set) ? { on: () => !!o.on, set: (v) => o.set(!!v) } : null);
      const FEATURES = {
        yatziaSection: () => onOff(ctx.shared.yatziaSection),
        wallLayers: () => onOff(ctx.shared.wallLayers),
        altarLayers: () => onOff(ctx.shared.incenseAltar && ctx.shared.incenseAltar.layers),
        mechonaExplode: () => onOff(ctx.shared.mechona && ctx.shared.mechona.explode),
        mechonaDemo: () => {
          const d = ctx.shared.mechona && ctx.shared.mechona.demo;
          if (!d || !fnc(d.start) || !fnc(d.stop)) return null;
          // 1.0.1-K review (vessels-2 / tour-4): the slide's undo (off) parks the base AT ONCE - demo.reset(), "at once back in its place (for
          // the presentation)" (45-vessels.js) - also after the user's own "עצור" (then it drives home): stop() let it finish its round
          // at three times the speed, still driving for seconds into 7:34-37, which takes it apart and looks at its empty place
          const off = () => {
            if (fnc(d.reset)) {
              if (d.home !== true) d.reset();
            } else if (d.running) d.stop();
          };
          // 1.0.1-L (vessels-2 FOR-UI; a round is 48.6 s now, first the priests' washing, then the rinsing): the continuous mode's short slide
          // starts two seconds before the rinsing beside the marble tables (the purpose, L.40), the other modes from the start
          const on = () => {
            if (mode.key === "continuous" && fnc(d.seek) && Array.isArray(d.pourAt)) d.seek(d.pourAt[0] - 2);
            d.start();
          };
          return { on: () => !!d.running, set: (v) => (v ? on() : off()), off };
        },
        // 8:10-11: the cloud is put back over the devir and LEFT there (no undo): the UI itself returns it whenever the camera leaves the
        // devir, and switching it off again would reset that return (setCloud(false) clears its "seen near" state)
        cloud: () => (fnc(U.setCloud) && fnc(U.cloudOn) ? { on: cloudOn, set: (v) => (v ? U.setCloud(true) : undefined) } : null),
        // 1.0.1-L (L.72): R. Yose b. R. Yehuda's two tables in the ulam, the place "שולחנות האולם" (a switch of readings: "none" = hidden)
        ulamTables: () => {
          const o = ctx.shared.ulamTables;
          return o && fnc(o.set) ? { on: () => true, set: () => true } : null;   // 1.1.0: the tables are always shown (no "none")
        },
        // 1.2.2: the section along the length (70-ui.js setSection: the house's south wall off, the ceilings kept) with the aliyot opened
        houseSection: () => {
          const ao = ctx.shared.aliyotOpen;
          if (!fnc(U.setSection) || !fnc(U.sectionOn) || !ao || !fnc(ao.set)) return null;
          return {
            on: () => !!U.sectionOn(),
            set: (v) => {
              if (v) { if (fnc(U.setCutaway)) U.setCutaway(false); U.setSection(true); ao.set(true); }
              else { U.setSection(false); ao.set(false); }
            }
          };
        }
      };
      // 1.0.1-L (L.50): the feature a place of the panel switches on: its name in ctx.ui.places() (the ctx.shared key) -> the tour's FEATURES;
      // any other key of ctx.shared with set() and on (or current / keys) works too, and a missing one is skipped
      const FEAT_ALIAS = { incenseAltar: "altarLayers", "incenseAltar.layers": "altarLayers", "mechona.demo": "mechonaDemo", "mechona.explode": "mechonaExplode", section: "yatziaSection", demo: "mechonaDemo", explode: "mechonaExplode" };
      const featureOf = (name) => {
        const k = FEAT_ALIAS[name] || name;
        if (FEATURES[k]) return FEATURES[k]();
        const o = ctx.shared[k];
        if (!o || !fnc(o.set)) return null;
        if (Array.isArray(o.keys) && o.keys.length > 1) return { on: () => o.current !== o.keys[0], set: (v) => o.set(v ? o.keys[1] : o.keys[0]) };
        return onOff(o);
      };
      const hasFeature = (name) => !!featureOf(name);
      const featureOn = (rt, name) => {
        const F = featureOf(name);
        if (!F) return false;
        try {
          if (!F.on()) {
            F.set(true);
            rt.undo.push(() => {
              try {
                if (fnc(F.off)) F.off();   // the feature's own way back (the base's demo: parked at once)
                else if (F.on()) F.set(false);
              } catch (_) {
              }
            });
          }
          return true;
        } catch (_) {
          return false;
        }
      };
      // 1.0.1-K review (vessels-2 / tour-4): a slide that takes the base apart (7:34-37) starts from a parked base - a demo still running
      // (the user's own) is parked at once and started again when the slide is left (this undo is pushed before the explode's, so it runs
      // after it: the parts go down in 1.1 s while the base waits its first 1.2 s); a base driving home after "עצור" is parked at once
      const parkBase = (rt) => {
        const d = ctx.shared.mechona && ctx.shared.mechona.demo;
        if (!d || !fnc(d.reset) || d.home === true) return;
        const was = !!d.running;
        try {
          d.reset();
        } catch (_) {
          return;
        }
        if (was && fnc(d.start)) {
          rt.undo.push(() => {
            try {
              if (!d.running) d.start();
            } catch (_) {
            }
          });
        }
      };
      const layerNeed = (rt, name) => {
        if (!name || !ctx.layers || !ctx.layers[name] || layerOn(name)) return;
        setLayer(name, true);
        rt.undo.push(() => setLayer(name, false));
      };
      // 1.0.1-K review (tour-1 / cross-2 / interior-2): the layer groups that a feature's own set() drives, together with its meshes and its
      // "on" (50-heichal.js: the yatzia section -> yatziaDims; 55-interior.js: the wall layers -> wallLayers, the altar's layers ->
      // altarLayers; the base taken apart -> mechonaParts, its parts' labels). The tour never writes them raw: at the end the features go
      // back through their own set() (OWN_FEAT), and the parts' labels follow the explode; the other layers are restored as before
      // 1.0.1-L: + yatziaWhole (the section's set), mechonaPurpose and mechonaWash (the demonstration), the ulam tables' groups (ulamTables.set), forestBoards (a
      // palace hook keeps it equal to the boards) and the throne's version groups (throneVersion.set)
      const OWNED = new Set(["sfalimSee", "yatziaDims", "yatziaWhole", "wallLayers", "altarLayers", "mechonaParts", "mechonaPurpose", "mechonaWash", "ulamTables", "ulamTablesRyby", "ulamTablesMishnah", "forestBoards", "kelim", "arkInside", "arkLid"]);
      const OWN_FEAT = ["yatziaSection", "wallLayers", "altarLayers", "mechonaExplode", "kelim", "arkInside"];   // (1.0.1-L: kelim, arkInside: a press of their pills during the tour)
      const layerVis = () => Object.keys(ctx.layers || {}).filter((n) => !OWNED.has(n) && n.indexOf("throne") !== 0).map((n) => [n, layerOn(n)]);
      const featState = (k) => {
        try {
          const F = featureOf(k);
          return F ? !!F.on() : null;
        } catch (_) {
          return null;
        }
      };
      // 1.0.1-K review (tour-8): the panel's "סיבוב איטי" through the UI - ctx.ui.autoRotate {get(): its checkbox, set(on): the checkbox and
      // controls.autoRotate together}, so the box shows what really turns; without it (an older ui.js) controls.autoRotate directly
      const autoRot = () => (U.autoRotate && fnc(U.autoRotate.get) && fnc(U.autoRotate.set) ? U.autoRotate : null);
      // ---- the user's rule: the tour never opens a removal by itself. If a navigation call of the UI still opens one (an older ui.js:
      // the automatic cutaway / openings of the views and rows), it is undone at once - by the UI's own "automatic" switches, by the
      // on-model buttons that flipped, and as the last resort on the meshes of the hide-list ----
      const HIDE = () => [["cut", ctx.cutaway], ["yatzia", ctx.yatziaCut], ["ulam", ctx.ulamCut], ["boards", ctx.forestBoardsCut]];
      const anyHidden = (a) => Array.isArray(a) && a.some((m) => m && m.visible === false);
      const mbList = () => (Array.isArray(ctx.shared.modelButtons) ? ctx.shared.modelButtons : []);
      // 1.3.6 / 1.9.4 (the user, 11.11.2026: "למה הוא מציג במצגת בהתחלה את החתך פתוח לא קשור למקום"; "החתך נשאר פתוח לאורך כל המצגת"): the
      // presentation starts from the model's regular state. Every viewing tool the viewer left on - the on-model buttons (the house or
      // the galleries opened, a section of the galleries, roofs, a demonstration), the live section and the walk - goes off when it
      // starts, and what is not a demonstration comes back when it ends (restore), as the rows and the layers do. Not touched: the
      // cloud (the devir's slides ask about it themselves) and a button that only mutes (keepDemos).
      const toolsOff = () => {
        const back = [];
        // TOUR_STOPDEMOS_204: a running demonstration ends first and gives back what IT opened (the lotteries' night opens the
        // chambers' roofs), so that what it opened is not taken for the viewer's own and opened again when the presentation ends
        try { call(ctx.shared.stopDemos); } catch (_) {}
        for (const b of mbList().slice()) {
          try {
            if (!b || !fnc(b.get) || !fnc(b.set) || b.keepDemos || b.id === "ui-cloud" || !b.get()) continue;
            b.set(false);
            if (!b.get() && !/^עצור/.test(String(b.labelOn || "")) && !/demo/i.test(String(b.id || ""))) back.push(() => { if (!b.get()) b.set(true); });
          } catch (_) {
          }
        }
        try {
          const S = ctx.shared.section;
          if (S && S.on && fnc(S.set)) {
            const ax = S.axis, v = S.v;
            S.set(false, ax, v);
            back.push(() => { if (!S.on) S.set(true, ax, v); });
          }
          const w = ctx.shared.walkMode;
          if (w && w.on && fnc(w.set)) w.set(false);
          if (fnc(ctx.shared.navRepaint)) ctx.shared.navRepaint();
        } catch (_) {
        }
        return back;
      };
      const snapOpen = () => {
        const o = { mb: mbList().map((b) => !!(b && fnc(b.get) && call(b.get))) };
        for (const [k, a] of HIDE()) o[k] = anyHidden(a);
        return o;
      };
      const keepClosed = (before) => {
        let opened = false;
        for (const [k, a] of HIDE()) {
          if (before[k] || !anyHidden(a)) continue;
          opened = true;
          if (k === "cut") call(U.applyCut, false);
          else call(U.applyOpen, k, false);
        }
        if (!opened) return;
        mbList().forEach((b, i) => {
          if (b && fnc(b.get) && fnc(b.set) && !before.mb[i] && call(b.get)) call(b.set, false);
        });
        for (const [k, a] of HIDE()) if (!before[k] && anyHidden(a)) for (const m of a) if (m) m.visible = true;
      };
      // ---- targets: a fly point (ctx.ui.resolveFp: the module's, the Sea's placement, or the UI's fallback), a place of the panel by title
      // (its view, or its cam / tg), or an explicit camera ----
      const camOf = (c) => {
        if (!c) return null;
        if (c.fp) {
          const f = resolveFp(c.fp);
          return f ? { pos: f.pos.slice(0, 3), target: f.target.slice(0, 3), layer: null } : null;
        }
        if (c.place) {
          const it = call(U.place, c.place);
          if (!it) return null;
          const f = it.view ? resolveFp(it.view) : null;
          const pos = f ? f.pos : fnc(it.cam) ? call(it.cam) : it.cam;
          const target = f ? f.target : fnc(it.tg) ? call(it.tg) : it.tg;
          return fin3(pos) && fin3(target) ? { pos: pos.slice(0, 3), target: target.slice(0, 3), layer: it.layer || null } : null;
        }
        return fin3(c.pos) && fin3(c.target) ? { pos: c.pos.slice(0, 3), target: c.target.slice(0, 3), layer: null } : null;
      };
      const pick = (list) => {
        for (const c of Array.isArray(list) ? list : []) {
          if (c.f && !hasFeature(c.f)) continue;   // a candidate tied to a feature the model does not have
          const cam = camOf(c);
          if (cam) return { c, cam };
          // 1.3.5 / 1.9.3: a place shown by its action alone (a walk that leads the eye itself) has no camera of its own
          if (c.place && c.act && placeAct(placeByTitle(c.place))) return { c, cam: { pos: null, target: null, layer: null } };
        }
        return null;
      };
      // ---- exterior test of the continuous mode's orbit: the camera >= 35 from its target and nothing above it within 150 amot ----
      let roofList = null;
      const roofs = () => {
        if (roofList) return roofList;
        roofList = [];
        if (ctx.root && fnc(ctx.root.traverse)) {
          ctx.root.traverse((o) => {
            if (!o.isMesh || o.isInstancedMesh || !o.geometry) return;
            const pa = o.geometry.attributes && o.geometry.attributes.position;
            if (pa && pa.count > 30000) return;   // the terrain: always below
            roofList.push(o);
          });
        }
        return roofList;
      };
      const upRay = new Raycaster(), UP = new Vector3(0, 1, 0), P0 = new Vector3();
      const shown = (o) => {
        for (; o; o = o.parent) if (o.visible === false) return false;
        return true;
      };
      const outdoors = (pos, target) => {
        if (!fin3(pos) || !fin3(target)) return false;
        if (Math.hypot(pos[0] - target[0], pos[1] - target[1], pos[2] - target[2]) < 35) return false;
        try {
          P0.set(pos[0], pos[1], pos[2]);
          upRay.set(P0, UP);
          upRay.near = 0;
          upRay.far = 150;
          for (const h of upRay.intersectObjects(roofs(), false)) if (shown(h.object)) return false;
        } catch (_) {
          return false;
        }
        return true;
      };
      // ---- the opinions table (rows of ctx.ui.opinions: options [[key, label, info, refs]], onPick, mark, cur, fly) ----
      const rowsOf = () => (Array.isArray(U.opinions) ? U.opinions : []).filter((r) => r && !r.disabled && Array.isArray(r.options) && r.options.length > 1 && fnc(r.onPick));
      const setRow = (row, key) => {
        if (!row || row.cur === key) return;
        call(row.onPick, key);
        call(row.mark, key);
      };
      // 1.0.1-L (L.81): the throne's versions: the row "כסא שלמה — לפי איזה מדרש" of the opinions table (70-ui.js), when it is there
      const isThroneRow = (r) => r.options.some((o) => o[0] === "targumSheni");
      // 2.0 (55-tamid.js): the demonstration's two rows are the user's own choice - never reset, restored or shown as slides by the tour
      const isTamidRow = (r) => /^(סדר עבודת הבוקר|המנורה והנרות בבוקר)/.test(String(r.cap || ""));
      const tamidSlides = () => (ctx.shared.tamid && fnc(ctx.shared.tamid.slides) ? call(ctx.shared.tamid.slides) || [] : []);
      const throneRow = () => rowsOf().find(isThroneRow) || null;
      // ---- the slides ----
      const vRange = (v) => tour_heb(v[0]) + ", " + tour_heb(v[1]) + (v[2] > v[1] ? "–" + tour_heb(v[2]) : "");
      // 1.0.1-L (L.50): the panel's places in its order: ctx.ui.places() (one entry per place button: title, group, view, fp, info, refs, layer,
      // feature, item), or by the older API (placeTitles + place: no groups, the camera from the item)
      const placesOf = () => {
        let list = null;
        if (fnc(U.places)) list = call(U.places);
        // 1.3.7 / 1.9.5 (TOUR_ENGINE_204): a place whose matter is shown by another place's slide (item.noTour) has no slide of its own
        if (Array.isArray(list) && list.length) return list.filter((p) => p && p.title && !(p.item && p.item.noTour));
        const titles = call(U.placeTitles);
        if (!Array.isArray(titles)) return [];
        const out = [];
        for (const t of titles) {
          const it = call(U.place, t);
          if (!it) continue;
          out.push({ title: t, group: it.group || "", view: it.view || null, fp: null, info: it.key ? (U.info && U.info[it.key]) || "" : it.info || "",
            refs: it.key ? (U.refs && U.refs[it.key]) || [] : it.refs || [], layer: it.layer || null, feature: it.feature || null, item: it });
        }
        return out;
      };
      const camKey = (p) => p.fp || p.view || (p.item && p.item.view) || null;
      const isExtras = (g) => !!g && g.indexOf("השלמות") >= 0;   // the group "השלמות": its entries repeat the views' cameras and are not their home
      // the feature a place's slide needs: the panel's word for it, and a fly point that is only right with its feature on (the section's camera
      // stands inside the closed chambers while the section is off: 50-heichal.js) - when the panel's list does not name them
      const NEED_FEAT = { yatziaSection: "yatziaSection", wallLayers: "wallLayers" };
      const placeFeat = (p) => {
        if (p.feature && hasFeature(p.feature)) return p.feature;
        const k = camKey(p);
        return k && NEED_FEAT[k] ? NEED_FEAT[k] : null;
      };
      // a place's slide: its fly point / view, else its own camera, else (only a text) its group's view; with its feature when it has one
      // (1.0.1-L: 57-kelim.js gives its links as specs, ["V", 10, 7, 40]: resolved here)
      const linkRefs = (rs) => (rs || []).map(([l, r]) => [l, Array.isArray(r) ? tour_ref(r) : r]).filter((x) => x[1]);
      // 1.3.5 / 1.9.3 (the user: "בדוק שכל הטכני באמת נמצא בשני הבתים כולל עדכון כרטיסים ומצגות"; the full scan of 10.11.2026): A PLACE'S
      // SLIDE DOES WHAT THE PLACE'S BUTTON DOES - its own feature (pf: a zone lit on the floor, the altar's frames - a feature object of
      // the panel, { isOn, on, off }, that is not one of the tour's named FEATURES) and its action (act: the roof opened to look down
      // into a chamber, the cells' section, a demonstration). What the action opens is held until the slide is left (the engine's
      // ctx.shared.holdAuto / closeAuto), a demonstration runs to its end before the next slide, and a place whose action is all it has
      // (a walk that leads the eye itself) is not flown to. Until now such slides only flew: a closed roof seen from above, or the
      // group's general view instead of the walk. A verse's slide shows a place so by a candidate { place, act: true }.
      const placeOwnFeat = (p) => {
        const F = p && p.item && p.item.feature;
        if (!F || !fnc(F.on) || !fnc(F.isOn)) return null;   // TOUR_UNTIMED_211: (Beit Rishon skips timed === false here - the throne's slides)
        if (p.feature && hasFeature(p.feature)) return null;                       // one of the tour's own features: switched on by its name
        return F;
      };
      const placeAct = (p) => (p && p.item && fnc(p.item.action) ? p.item.action : null);
      const placeOwnCam = (p) => !!(p && (p.fp || (p.item && (p.item.view || p.item.cam || p.item.tg))));
      const placeByTitle = (t) => placesOf().find((x) => x.title === t) || null;
      const demoRunning = () => {
        const L = ctx.shared.demoStops;
        if (!Array.isArray(L)) return false;
        for (const d of L) {
          try {
            if (d && fnc(d.running) && d.running()) return true;
          } catch (_) {
          }
        }
        return false;
      };
      // TOUR_DEMO_HOLD_206 b: does a demonstration hold this slide now? One that goes round and round (its entry has roundLeft(), the
      // seconds left of its present round) holds it for one round, counted from the moment the slide first saw it running
      const demoHolds = (rt) => {
        const L = ctx.shared.demoStops;
        if (!rt || rt.anim || !Array.isArray(L)) return false;   // (a slide with a timeline: the timeline is its length)
        for (const d of L) {
          try {
            if (!d || !fnc(d.running) || !d.running()) continue;
            if (fnc(d.roundLeft)) {
              const R = rt.rounds || (rt.rounds = {});
              if (R[d.id] === undefined) R[d.id] = elapsed + Math.max(0, +d.roundLeft() || 0) * 1000;
              if (elapsed >= R[d.id]) continue;
            }
            return true;
          } catch (_) {
          }
        }
        return false;
      };
      const runPlace = (rt, s, res) => {
        let pf = s.pf || null, act = s.act || null;
        if (s.actOnly) rt.actOnly = true;
        if (res && res.c && res.c.place && res.c.act) {
          const p = placeByTitle(res.c.place);
          if (p) {
            pf = pf || placeOwnFeat(p);
            act = act || placeAct(p);
            if (act && !placeOwnCam(p)) rt.actOnly = true;
          }
        }
        if (pf && !rt.feat) {
          try {
            if (!pf.isOn()) {
              pf.on();
              rt.undo.push(() => {
                try {
                  if (fnc(pf.off) && pf.isOn()) pf.off();
                } catch (_) {
                }
              });
            }
          } catch (_) {
          }
        }
        if (act) {
          const rows0 = rowsOf().map((r) => [r, r.cur]);
          rt.undo.push(() => {
            call(ctx.shared.stopDemos);
            for (const [r, k] of rows0) if (r.cur !== k) setRow(r, k);   // (a place may pick a reading: the small ramps' two places)
          });
          call(act);
          rt.act = true;
        }
      };
      // 1.3.7 / 1.9.5 (TOUR_ENGINE_204; the user, 11.11.2026: "אם כרטיס אחד... מציג כמה דברים המצגת צריכה להציג את כולם באותו הכרטיס
      // (דהיינו באותם ה7 שניות להסתובב ולהציג הכל"): a place that speaks of several things names their further cameras - item.tourThen,
      // a list of { cam, tg } | { fp } | { place } - and its slide flies to each in its turn, the slide's time shared between them
      // TOUR_ENGINE_204C (the helper's scan, 11.11.2026): the list may be a function; an entry may be { pos, target } (the
      // gatekeepers' place wrote it so and its cameras never ran); `extra`: further entries the engine adds (mergedCams)
      const placeThen = (p, extra) => {
        let own = p && p.item ? p.item.tourThen : null;
        if (fnc(own)) own = call(own);
        // TOUR_VIEWS_205: the table's further views of this place - the things its card speaks of, each looked at in a picture before it was written
        const tv = p && tour_VIEWS[p.title];   // (the table's views come after the place's own and the merged ones)
        const L = (Array.isArray(own) ? own : []).concat(extra || [], Array.isArray(tv) ? tv.map((v) => ({ cam: v[0], tg: v[1] })) : [])
          .map((t) => (t && !t.fp && !t.place && !(t.cam && t.tg) && t.pos && t.target ? Object.assign({}, t, { cam: t.pos, tg: t.target }) : t))
          .filter((t) => t && (t.fp || t.place || (t.cam && t.tg)));
        if (!L.length) return null;
        const share = 1 / (L.length + 1);
        return L.map((t, i) => ({ go: [t.fp ? { fp: t.fp } : t.place ? { place: t.place } : { pos: t.cam, target: t.tg }], at: (i + 1) * share, dur: t.dur || 1500 }));
      };
      // TOUR_VIEWS_205: a reading's own further views (row.tourThen[key], a list of { cam, tg }): the slide of a dispute moves among
      // the places it speaks of, as a place's slide does
      const optThen = (row, key) => {
        const L = ((row && row.tourThen && row.tourThen[key]) || []).filter((t) => t && t.cam && t.tg);
        if (!L.length) return null;
        const share = 1 / (L.length + 1);
        return L.map((t, i) => ({ go: [{ pos: t.cam, target: t.tg }], at: (i + 1) * share, dur: t.dur || 1500 }));
      };
      const placeSlide = (p, groupCam) => {
        const f = placeFeat(p), k = camKey(p), go = f === "kelim" ? tour_KELIM_GO.slice() : [];   // 1.0.1-L (L.88): the panel's own camera there is for the card beside its panel
        if (k) go.push(f ? { fp: k, f } : { fp: k });
        go.push(f ? { place: p.title, f } : { place: p.title });
        if (groupCam) go.push({ fp: groupCam });
        return { kind: "place", part: 0, group: p.group || "", title: p.title, text: tour_SHORT[p.title] || p.info || "", refs: linkRefs(p.refs), go, lay: p.layer || null, out: tour_OUT,
          pf: placeOwnFeat(p), act: p.item && p.item.tourNoAct ? null : placeAct(p), actOnly: !!(placeAct(p) && !placeOwnCam(p) && !(p.item && p.item.tourNoAct)),   // 1.3.5 / 1.9.3; TAMID_STOP_209
          then: placeThen(p),   // 1.3.7 / 1.9.5
          bubble: p.title === "כסא שלמה" || p.title === "עליית המלך לכסא" || k === "throneSteps" };
      };
      const viewSlide = (v, group) => ({ kind: "view", part: 0, group: group || "", key: v.key, title: v.label, text: (U.info && U.info[v.key]) || "", refs: (U.refs && U.refs[v.key]) || [],
        go: [{ fp: v.key }], lay: v.layer || null, out: tour_OUT });
      // the base's demonstration and its parts: L.51 took their places out of the panel (the pills on the base do them), and the presentation
      // still shows them, after the close view of the base: the pill's own words as the slide's title, its explanation as the text
      const baseSlides = (group) => {
        const out = [];
        for (const [id, feat, go, lay, what] of [
          ["mechonaDemo", "mechonaDemo", [{ pos: [70, 88, -8], target: [34, 8, -8], f: "mechonaDemo" }, { fp: "mechonaDemo", f: "mechonaDemo" }, { fp: "mechonaClose", f: "mechonaDemo" }, { fp: "mechonot" }], null, "המכונה בפעולה"],
          ["mechonaExplode", "mechonaExplode", [{ fp: "mechonaParts", f: "mechonaExplode", lay: "mechonaParts" }, { fp: "mechonaClose", f: "mechonaExplode", lay: "mechonaParts" }, { fp: "mechonot" }], null, "המכונה לחלקיה"]
        ]) {
          const b = mbList().find((x) => x && x.id === id);
          if (!b || !hasFeature(feat)) continue;
          // (the pill's title ends by telling what a further click does; in a slide nothing is clicked, and leaving the slide reassembles the base)
          out.push({ kind: "place", part: 0, group: group || "", title: what + " — ״" + b.label + "״", text: (b.title || "").replace(/\s*לחיצה נוספת[^.]*\.\s*$/, ""), refs: [["מלכים א ז, כז", tour_ref(["V", 10, 7, 27])], ["ז, לג", tour_ref(["V", 10, 7, 33])], ["דברי הימים ב ד, ו", tour_ref(["V", 39, 4, 6])]].filter((x) => x[1]),
            go, lay, out: tour_OUT });
        }
        return out;
      };
      // 1.0.1-L (L.78-L.81): one slide per version of the throne, then each midrash's witnesses' scene; "pesukim" (no ascent) a plain slide with the verses
      const throneSlides = (group) => {
        const tv = ctx.shared.throneVersion, th = ctx.shared.throne;
        if (!tv || !Array.isArray(tv.keys) || !fnc(tv.set)) return [];
        const out = [], names = tv.names || {}, T = tour_THRONE;
        for (const key of tv.keys) {
          const name = key === "beitHamidrash" ? "בית המדרש ב" : names[key] || key, cap = th && th.script && th.script[key], cw = th && th.witnessScript && th.witnessScript[key];   // 1.0.1-L: the user: its name on screen, whatever the module's list says
          const asc = !!(th && th.ascent && fnc(th.ascent.start) && Array.isArray(cap) && cap.length);
          const common = { kind: "throne", part: 0, group: group || "", ver: key, sub: "מלכים א י, יח–כ", lay: "palace", out: tour_OUT, bubble: true, refs: (T.refs[key] || T.refs.pesukim).map(([l, sp]) => [l, tour_ref(sp)]).filter((x) => x[1]) };
          if (key === "pesukim" || !asc) {
            const verses = [], kv = [18, 19, 20];
            let letters = 0;
            if (key === "pesukim") for (const v of kv) { const t = tour_VERSES["10:" + v] || ""; verses.push([v, t]); letters += t.replace(/[^א-ת]/g, "").length; }
            out.push(Object.assign({}, common, { title: "כסא שלמה — לפי " + name, text: key === "pesukim" ? T.pesukim : T.lead[key] || "", go: [{ fp: "throne" }, { fp: "throneSteps" }, { fp: "palace" }], then: [{ go: [{ fp: "throneSteps" }], at: 0.5, dur: 3000 }], verses, letters, anim: null }));
            continue;
          }
          // 1.0.1-L (A31, "תאחד"): one slide per version: the ascent, and on the same slide the witnesses with their captions (beginAnim, animStep)
          const wit = !!(th.witnesses && fnc(th.witnesses.start) && Array.isArray(cw) && cw.length);
          out.push(Object.assign({}, common, { title: "כסא שלמה — לפי " + name, text: T.lead[key] || "", go: [{ fp: "throneSteps" }, { fp: "throne" }, { fp: "palace" }], anim: "ascent", animW: wit, goW: [{ fp: "throne" }, { fp: "throneSteps" }, { fp: "palace" }] }));
        }
        return out;
      };
      // L.50: the whole panel. The opening view; then group by group its places in their order, each grid view of the group right before the first
      // place that flies to it (a place that only repeats the view's text IS that slide); a view no place flies to, and an overview, opens its
      // group; the group "השלמות" is the panel's last and holds no view. After the throne's own places, its versions; at the VERY END the readings
      const topicSlides = () => {
        const out = [];
        const views = (Array.isArray(U.views) ? U.views : []).filter((v) => v && v.key && v.key !== "aliyot" && resolveFp(v.key));   // "העליות" is the row "גובה הבית" of the opinions table: shown with the readings
        const byKey = {};
        for (const v of views) byKey[v.key] = v;
        // 1.3.7 / 1.9.5 (TOUR_ENGINE_204B; the user, 11.11.2026: "יש כרטיסים שלא מראים כלום - להסיר אותם או לאחד", "אם כרטיס אחד...
        // מציג כמה דברים המצגת צריכה להציג את כולם באותו הכרטיס"): ONE SLIDE PER BUTTON OF THE PANEL. Until now a place that the
        // panel had merged into another button (70-ui.js UI_MERGE: noButton, mergeInto - the whole group "השלמות") still had a slide
        // of its own, before the kept button's own camera, and a view of the grid whose button a place had taken (UI_VIEW_HOME) had
        // its slide right before that place's - the same picture two and three times. Now the kept button's slide stands for them,
        // with the card the button shows (its text, then each merged one's under its title: mergedCard), and a merged matter that
        // has a camera of its own is one of the slide's further cameras (item.tourThen on the kept place, 70-ui.js)
        const allPlaces = placesOf();
        const keptOf = (p) => {
          const k = p && p.item && p.item.noButton ? p.item.mergeInto : null;
          return k ? allPlaces.find((x) => x.item === k) || null : null;
        };
        const places = allPlaces.filter((p) => !keptOf(p));
        const groups = [];
        for (const p of places) if (groups.indexOf(p.group || "") < 0) groups.push(p.group || "");
        const viewKeyOf = (k) => (k && !byKey[k] && tour_VIEW_ALIAS[k] ? tour_VIEW_ALIAS[k] : k);
        // a view whose button left the grid (a place repeats it): the place's slide is the view's slide
        const gridless = (key) => {
          const b = fnc(U.viewButton) ? call(U.viewButton, key) : null;
          return !!b && !b.parentNode;
        };
        const coverOf = {};
        for (const p of places) {
          if (isExtras(p.group)) continue;
          const k = camKey(p);
          if (k && byKey[k] && k !== "__general" && gridless(k) && !(k in coverOf)) coverOf[k] = p;
          for (const d of p.item && Array.isArray(p.item.more) ? p.item.more : []) {
            if (d && !d.t && d.key && byKey[d.key] && gridless(d.key) && !(d.key in coverOf)) coverOf[d.key] = p;
          }
        }
        const mergedCard = (p) => {
          const own = tour_SHORT[p.title] || p.info || "";
          const parts = [own], refs = linkRefs(p.refs).slice(), seen = new Set(refs.map((r) => r[0]));
          for (const d of p.item && Array.isArray(p.item.more) ? p.item.more : []) {
            if (!d) continue;
            const tx = (d.t && tour_SHORT[d.t]) || (d.key ? (U.info && U.info[d.key]) || "" : d.info || "");
            // TOUR_ENGINE_204C: only the lines the card already has are left out (a merged card that opened with the kept card's
            // own verse was dropped whole - its first 40 letters were the same)
            if (tx) {
              const have = parts.join("\n") + "\n" + String(p.info || ""), fresh = String(tx).split("\n").filter((ln) => ln.trim() && have.indexOf(ln.trim()) < 0);
              if (fresh.length) parts.push((d.t ? d.t + ": " : "") + fresh.join("\n"));
            }
            for (const r of linkRefs(d.key ? (U.refs && U.refs[d.key]) || [] : d.refs || [])) {
              if (!seen.has(r[0])) {
                seen.add(r[0]);
                refs.push(r);
              }
            }
          }
          return { text: parts.filter(Boolean).join("\n\n"), refs };
        };
        // TOUR_ENGINE_204C: a merged matter that has a camera of its own is one of the slide's further cameras - up to four -
        // when the kept place names none itself (item.tourThen)
        const mergedCams = (p) => {
          const out = [], own = camKey(p);
          for (const d of p.item && Array.isArray(p.item.more) ? p.item.more : []) {
            if (!d || out.length >= 4) continue;
            if (d.t) {
              const q = allPlaces.find((x) => x.item === d || x.title === d.t);
              if (q && placeOwnCam(q) && camKey(q) !== own) out.push({ place: q.title });
            } else if (d.key && d.key !== own && resolveFp(d.key)) out.push({ fp: d.key });
          }
          return out;
        };
        const buttonSlide = (p, groupCam) => {
          const s = placeSlide(p, groupCam);
          if (p.item && Array.isArray(p.item.more) && p.item.more.length) {
            const mc = mergedCard(p);
            s.text = mc.text;
            s.refs = mc.refs;
            if (!s.then) s.then = placeThen(p, mergedCams(p));
          }
          return s;
        };
        const home = {};
        for (const p of places) {
          const k = viewKeyOf(camKey(p));
          if (k && byKey[k] && !isExtras(p.group) && !(k in home)) home[k] = p.group || "";
        }
        const opens = {};
        let prev = groups.filter((g) => !isExtras(g))[0];
        for (const v of views) {
          if (v.key === "__general") continue;
          if (!(v.key in home)) {
            const hint = tour_VIEW_GROUP[v.key], g = hint ? groups.find((x) => x.indexOf(hint) >= 0) : undefined;
            home[v.key] = g !== undefined ? g : prev;
            opens[v.key] = true;
          }
          if (tour_VIEW_OPENS[v.key]) opens[v.key] = true;
          prev = home[v.key];
        }
        const done = {};
        for (const k of Object.keys(coverOf)) done[k] = true;   // TOUR_ENGINE_204B: the covering place's slide stands for the view
        const viewSlideOf = {};   // 1.3.5 / 1.9.3: a place folded into its view's slide gives it its feature and its action
        const emitView = (v, g) => {
          if (done[v.key]) return;
          done[v.key] = true;
          const vs = viewSlide(v, g);
          viewSlideOf[v.key] = vs;
          out.push(vs);
        };
        if (byKey.__general) emitView(byKey.__general, "");
        // (an older ui.js gives no groups: the grid first, in its order, then the places)
        if (groups.length <= 1) for (const v of views) emitView(v, "");
        let throneAt = -1;
        for (const g of groups) {
          const gv = views.filter((v) => home[v.key] === g && v.key !== "__general");
          const groupCam = gv.length ? gv[0].key : null;
          for (const v of gv) if (opens[v.key]) emitView(v, g);
          for (const p of places) {
            if ((p.group || "") !== g) continue;
            const k = camKey(p), vk = viewKeyOf(k), v = vk && !isExtras(g) && home[vk] === g ? byKey[vk] : null;
            let fold = false;
            if (v) {
              for (const w of gv) {
                emitView(w, g);
                if (w === v) break;
              }
              fold = vk === k && coverOf[vk] !== p && !!viewSlideOf[vk] && ((p.item && p.item.key === k) || !p.info || p.info === (U.info && U.info[k]));
            }
            if (!fold) {
              const bs = buttonSlide(p, groupCam);
              out.push(bs);
              for (const ck of Object.keys(coverOf)) if (coverOf[ck] === p && !viewSlideOf[ck]) viewSlideOf[ck] = bs;
            }
            else if (v && viewSlideOf[v.key]) {
              const vs = viewSlideOf[v.key];
              if (!vs.act) vs.act = placeAct(p);
              if (!vs.pf) vs.pf = placeOwnFeat(p);
            }
            if (k === "mechonaClose" && !isExtras(g) && !done.__base) {
              done.__base = true;
              for (const s of baseSlides(g)) out.push(s);
            }
            if (k === "throne" || k === "throneSteps") { if (!isExtras(g)) throneAt = out.length; }
          }
          for (const v of gv) emitView(v, g);
        }
        for (const v of views) emitView(v, "");   // (no places, or a view of no group: in the grid's order)
        // the throne's versions after its own places (else after the palace's overview, else at the end of the places)
        if (throneAt < 0) {
          for (let i = out.length - 1; i >= 0; i--) if (out[i].key === "palace") { throneAt = i + 1; break; }
        }
        const ts = throneSlides(throneAt >= 0 ? out[throneAt - 1].group : "");
        if (ts.length) out.splice(throneAt >= 0 ? throneAt : out.length, 0, ...ts);
        for (const row of rowsOf()) {
          if (ts.length && isThroneRow(row)) continue;
          if (isTamidRow(row)) continue;   // 2.0 (55-tamid.js)   // its readings are the version slides above
          // 1.3.5 / 1.9.3 (the full scan: a row that stands by default on a reading that is not its first - its first reading had no
          // slide, and the row was left on it after its slides): the reading the row stands on is the one gone back to, and every other
          // reading has its slide
          const def = row.cur != null && row.options.some((o) => o[0] === row.cur) ? row.cur : row.options[0][0];
          for (const [key, label, info, infoRefs] of row.options.filter((o) => o[0] !== def)) {
            out.push({ kind: "opinion", part: 1, group: row.group || "", row, key, def, title: label, sub: row.cap, text: info || "", refs: infoRefs || row.refs || [],
              then: optThen(row, key), out: tour_OUT });
          }
        }
        return out;
      };
      const verseSlides = () => tour_KINGS.filter((d) => !d.kelim || ctx.shared.kelim).map((d) => {
        const verses = [];
        let letters = 0;
        // (a completion slide, d.compl: no verse of its own; the slide says on which verses it stands)
        if (!d.compl) {
          for (let v = d.v[1]; v <= d.v[2]; v++) {
            const t = tour_VERSES[d.v[0] + ":" + v] || "";
            verses.push([v, t]);
            letters += t.replace(/[^א-ת]/g, "").length;
          }
        }
        const refs = d.compl ? [] : [["מידות " + vRange(d.v), tour_ref(["MI", d.v[0], d.v[1]])]];
        for (const [label, sp] of d.r || []) {
          const ref = tour_ref(sp);
          if (ref && !refs.some((x) => x[0] === label)) refs.push([label, ref]);
        }
        if (d.kelim) for (const r of linkRefs(ctx.shared.kelim.refs)) refs.push(r);
        return { kind: "verse", part: 2, d, ch: d.v[0], title: d.t, sub: (d.compl ? "השלמה — על מידות " : "מידות ") + vRange(d.v), text: d.kelim ? ctx.shared.kelim.info : d.x, xf: d.xf || "", refs: refs.filter((x) => x[1]),
          go: d.go || [], lay: d.lay || null, out: d.out || tour_OUT, nofly: !!d.nofly, then: d.then ? [].concat(d.then) : null, verses, letters, bubble: !!d.bubble };
      });
      // ---- the DOM ----
      const mk = (tag, cls, txt, parent) => {
        const e = document.createElement(tag);
        if (cls) e.className = cls;
        if (txt != null) e.textContent = txt;
        if (parent) parent.appendChild(e);
        return e;
      };
      const tip = (el, text) => {
        el.title = text;
        if (fnc(el.setAttribute)) el.setAttribute("data-tip", text);   // for the UI's custom tooltips (K.9a), when it reads them
        if (fnc(U.tip)) call(U.tip, el, text);
        else if (fnc(U.tooltip)) call(U.tooltip, el, text);
      };
      // 1.1.0: the button goes into the top bar (70-ui.js ctx.ui.topbarAdd: order 10 = first), the menu under the bar's button row
      const btn = mk("button", null, "▶ מצגת", null);
      btn.id = "tm-tour-btn";
      btn.type = "button";
      if (fnc(U.topbarAdd)) call(U.topbarAdd, btn, 10, "play", "מצגת");
      else document.body.appendChild(btn);
      tip(btn, "מצגת: בחירה בין מצגת לפי הנושאים, מצגת רציפה, או מצגת לפי סדר המשניות במסכת מידות");
      const menu = mk("div", null, null, btn.parentNode && btn.parentNode.id === "tm-topbtns" ? btn.parentNode : document.body);
      menu.id = "tm-tour-menu";
      mk("div", "mh", "מצגת — בחר את סוג המצגת:", menu);
      for (const M of tour_MODES) {
        const b = mk("button", null, null, menu);
        b.type = "button";
        mk("b", null, M.label, b);
        mk("span", null, M.desc, b);   // (no tooltip: the item already shows its description)
        b.addEventListener("click", () => {
          if (!confirmOpen()) start(M.key);
        });
      }
      const box = mk("div", null, null, document.body);
      box.id = "tm-tour-box";
      const hd = mk("div", "hd", null, box);
      const elPart = mk("span", "part", "", hd), elNum = mk("span", "num", "", hd);
      const elTtl = mk("div", "ttl", "", box), elSub = mk("div", "sub", "", box), elWait = mk("div", "wait", "", box);
      const elOpts = mk("div", "opts", null, null);   // 2.0 (55-tamid.js): the demonstration's switches, under the subtitle
      box.insertBefore(elOpts, elWait);
      const body = mk("div", "body", null, box);
      // 1.0.1-L: elCaps = the captions of a timeline (the king's ascent, the witnesses), added one by one at their times
      const elVs = mk("div", "vs", null, body), elTxt = mk("div", "txt", "", body), elCaps = mk("div", "caps", null, body), elSrc = mk("div", "src", "", body);
      // 1.0.1-L (L.80): the bubble on the throne slides - in the banner under the scrolling text, always seen (on a phone it scrolls with the text:
      // placeBubble): the marker "לכאורה", the USER'S inference, the Ben Yehoyada's own words and their links
      const bubW = mk("div", "bubw", null, box);
      const elBub = mk("div", "bub", null, bubW);
      elBub.setAttribute("role", "note");
      {
        mk("div", "bq", tour_BUBBLE.quote, elBub);   // his words first, the inference apart from them
        const bt = mk("div", "bt", null, elBub);
        mk("span", "m", tour_BUBBLE.mark, bt);
        bt.appendChild(document.createTextNode(tour_BUBBLE.inference));
        if (fnc(U.refLinks)) call(U.refLinks, mk("div", "br", null, elBub), tour_BUBBLE.refs.map(([l, sp]) => [l, tour_ref(sp)]).filter((x) => x[1]));
      }
      const progEl = mk("div", "prog", null, box);
      const bar = mk("div", "bar", null, progEl);
      const ctl = mk("div", "ctl", null, box);
      const bPrev = mk("button", "prev", "→ הקודם", ctl), bPause = mk("button", "pause", "⏸ השהה", ctl);
      const bNext = mk("button", "next", "הבא ←", ctl), bStop = mk("button", "stop", "✕ סיום", ctl);
      for (const b of [bPrev, bPause, bNext, bStop]) b.type = "button";
      tip(bPrev, "לשקופית הקודמת");
      tip(bPause, "השהיית המצגת או המשכתה");
      tip(bNext, "לשקופית הבאה");
      tip(bStop, "סיום המצגת: השיטות, השכבות והמתגים חוזרים למה שהיו לפניה (Esc)");
      const ctl2 = mk("div", "ctl2", null, box);
      // 1.0.1-K review (tour-7): the speed's label (.spd, its word "קצב" in a span) moves into the controls row on a phone (placeSpeed)
      const spdLab = mk("label", "spd", null, ctl2);
      mk("span", "k", "קצב", spdLab);
      const spd = mk("select", null, null, spdLab);
      const SPEEDS = [["איטי", 1.5], ["רגיל", 1], ["מהיר", 0.6]];
      for (const [lab, k] of SPEEDS) {
        const o = mk("option", null, lab, spd);
        o.value = String(k);
      }
      tip(spdLab, "קצב המצגת: מהיר — 7 שניות לשקופית, רגיל — 10, איטי — 12");
      mk("span", "esc", "Esc — סיום", ctl2);
      // a mouse click does not leave the focus on the tour's buttons (Enter / Space then cannot act on them behind the cloud dialog)
      for (const b of [btn, bPrev, bPause, bNext, bStop]) b.addEventListener("mousedown", (e) => e.preventDefault());
      // ---- the state ----
      let mode = tour_MODES[0], slides = [], idx = -1, running = false, paused = false, ended = false, round = 1;
      let elapsed = 0, total = 1, lastT = 0, idleUntil = 0, cfSeenAt = -1e9, progAt = 0, waitTxt = "", menuOpen = false, orbitSide = 1;
      let holdDemo = false;   // CAM_219: the continuous mode's hold paused the slide's demonstration
      let cur = null, saved = null;
      // 1.0.1-L: the cloud dialog was answered "ביטול" in this run: the next devir slides do not ask again, they use their views from outside
      let cloudDenied = false;
      // 1.0.1-K review (tour-6): the pointers that are down now (pointerId; pressed on the model, the nav row, the pills or the panel - not
      // on the tour's own elements or the dialog): the continuous mode holds while any is down and 8 s after the last is lifted
      const downPtrs = new Set();
      // the speed the user chose ("קצב", remembered in localStorage) and the speed of the running tour (start(mode, {speed}) may override it
      // for that run only: tests)
      let userSpeed = 1;
      try {
        const k = parseFloat(localStorage.getItem("tm-tour-speed"));
        if (SPEEDS.some((s) => s[1] === k)) userSpeed = k;
      } catch (_) {
      }
      let speed = userSpeed;
      spd.value = String(userSpeed);
      const slideMs = (s) => {
        // 1.0.1-L: a slide with a timeline dwells for it, in every mode (the speed scales the timeline too: animStep)
        const a = cur && cur.s === s ? cur.anim : null;
        if (a) return (tour_ANIM_LEAD + a.whole + tour_ANIM_TAIL) * 1000 * speed;
        // TOUR_TIMES_205 (the user, 12.11.2026 12:14: "זה ארוך מדי. צריך להיות 7 שניות לכרטיס במצב מהיר ... במצב רגיל 10, במצב איטי 12"):
        // a slide's time goes by the chosen pace alone, in every mode - no longer by the length of its text (9 to 45 seconds until
        // 2.0.4); a slide of several views gets no less than three seconds a view (told to the user 12:20)
        const base = speed >= 1.3 ? 12000 : speed <= 0.75 ? 7000 : 10000;
        return Math.max(base, (1 + (Array.isArray(s.then) ? s.then.length : 0)) * 3000);
      };
      const setBtn = () => {
        if (fnc(U.setTopBtn)) call(U.setTopBtn, btn, running ? "stop" : "play", running ? "עצור" : "מצגת");
        else btn.textContent = running ? "■ עצור" : "▶ מצגת";
        btn.classList.toggle("on", running);
        tip(btn, running ? "עצירת המצגת (Esc)" : "מצגת: בחירה בין מצגת לפי הנושאים, מצגת רציפה, או מצגת לפי סדר המשניות במסכת מידות");
      };
      const openMenu = (on) => {
        menuOpen = !!on;
        menu.style.display = menuOpen ? "flex" : "none";
        btn.classList.toggle("open", menuOpen);
      };
      const setPaused = (p) => {
        paused = !!p;
        if (!paused) idleUntil = 0;
        holdDemo = false;   // CAM_219: "⏸" / "▶" take the demonstration over (below)
        bPause.textContent = paused ? "▶ המשך" : "⏸ השהה";
        // TOUR_DEMO_PAUSE_209: the slide's demonstration pauses with the presentation and goes on with it (90-entry.js DEMO_PAUSE_207)
        try {
          if (paused) { if (fnc(ctx.shared.demoPause)) ctx.shared.demoPause(); }
          else if (fnc(ctx.shared.demoPaused) && ctx.shared.demoPaused() && fnc(ctx.shared.demoResume)) ctx.shared.demoResume();
        } catch (_) {
        }
        showWait();
      };
      const showWait = () => {
        let t = "";
        if (running) {
          if (confirmOpen()) t = "ממתין לתשובה בחלון קודש הקדשים…";
          else if (paused) t = "המצגת מושהית.";
          else if (mode.key === "continuous" && idleUntil > now()) t = "המצגת ממשיכה מעצמה בעוד " + Math.max(1, Math.ceil((idleUntil - now()) / 1000)) + " שניות.";
          else if (cur && cur.outside) t = "קודש הקדשים מכוסה בענן — המבט מחוצה לו.";
        }
        if (t === waitTxt) return;
        waitTxt = t;
        elWait.textContent = t;
        elWait.style.display = t ? "block" : "none";
        if (cur && cur.anim && cur.anim.last) showCaption(cur.anim, cur.anim.last);   // 1.0.1-L: (the notice line takes the text's height: the caption stays in view)
      };
      // the banner stays above the compass and the nav row at the bottom left (#tm-compass, #tm-nav of 70-ui.js), whatever their height
      // (on a phone the nav row wraps to two lines): bottom = max(76 / 66 by CSS, their top + 8); on a phone the sheet's height is then
      // capped so that it never reaches the centre of the view. Measured on every slide, on resize and once a second while running.
      const fitBox = () => {
        const H = window.innerHeight || 0;
        let top = Infinity;
        for (const id of ["tm-nav", "tm-compass"]) {
          const e = document.getElementById(id);
          const r = e && fnc(e.getBoundingClientRect) ? e.getBoundingClientRect() : null;
          if (r && r.height > 0 && r.top > H / 2 && r.top < top) top = r.top;   // (only a row at the bottom counts)
        }
        let need = isFinite(top) ? Math.ceil(H - top + 8) : 0;
        if (document.body && document.body.classList && document.body.classList.contains("tm-measuring")) need = Math.max(need, 96);   // UX3
        box.style.bottom = need > (narrow() ? 66 : 76) ? need + "px" : "";
        box.style.maxHeight = narrow() && need > 66 ? Math.max(120, Math.floor(Math.min(0.4 * H, H / 2 - need - 4))) + "px" : "";
        placeSpeed();
        placeBubble();
        viewShift();
      };
      // 1.0.1-L (L.93): the panel is closed, and the banner stands on the left: the view's centre moves to the middle of the free space, so that what a slide looks at stands
      // beside the banner. A lens shift (setViewOffset): no camera, target or ray changes, the pills and the labels follow it. Measured with fitBox; if the viewer reopens the
      // panel, the middle between the two. On a phone, where the banner is a bottom sheet, the shift is upward
      let shiftKey = "";
      const viewShift = () => {
        const c = ctx.camera;
        if (!c || !fnc(c.setViewOffset) || !fnc(c.clearViewOffset)) return;
        const W = window.innerWidth || 0, H = window.innerHeight || 0;
        let dx = 0, dy = 0;
        if (running && W > 0 && H > 0 && fnc(box.getBoundingClientRect)) {
          const r = box.getBoundingClientRect();
          if (narrow()) {
            // 1.0.1-L: on a phone the sheet covers the lower half, and the view's centre fell on its edge (the throne's steps, the ascent itself, behind it): the centre goes up to the middle of the space above the sheet (in steps of 24 px, so that a slide's text of another length does not move the view)
            if (r && r.height > 0 && r.top > 0) dy = Math.round(Math.max(0, Math.min(0.3 * H, (H - r.top - 48) / 2)) / 24) * 24;
          } else {
            const p = panelOpen() && fnc(U.panel.getBoundingClientRect) ? U.panel.getBoundingClientRect() : null;
            if (r && r.width > 0) dx = Math.round((r.right + (p && p.width > 0 ? p.left : W) - W) / 2);
          }
        }
        const k = dx || dy ? W + "x" + H + ":" + dx + ":" + dy : "";
        if (k === shiftKey) return;
        shiftKey = k;
        if (dx || dy) c.setViewOffset(W, H, -dx, dy, W, H);
        else c.clearViewOffset();
      };
      // 1.0.1-L (L.80): the bubble's place: a strip of its own under the text; on a phone (the sheet is low) at the end of the scrolling text
      const placeBubble = () => {
        const home = narrow() ? body : box;
        if (bubW.parentNode === home) return;
        if (home === box && fnc(box.insertBefore)) box.insertBefore(bubW, progEl);
        else home.appendChild(bubW);
      };
      // 1.0.1-K review (tour-7): on a phone the speed choice sits at the end of the controls row (the row under it is not shown there, for
      // the text's height); on a wider window it goes back before the "Esc" hint. Moved only when the side changes
      const placeSpeed = () => {
        const home = narrow() ? ctl : ctl2;
        if (spdLab.parentNode === home) return;
        if (home === ctl2 && fnc(ctl2.insertBefore)) ctl2.insertBefore(spdLab, ctl2.firstChild);
        else home.appendChild(spdLab);
      };
      window.addEventListener("resize", () => {
        if (box.style.display !== "none") fitBox();
      });
      let fitAt = 0;
      // 2.0 (55-tamid.js): the demonstration's readings in the banner - each a pair of buttons; a change goes on at once, in the same stage
      const TAMID_OPTS = [
        { k: "order", lab: "סדר", o: [["abba", "אביי"], ["rambam", "הרמב״ם"]], row: /^סדר עבודת הבוקר/, set: "setOrder",
          tip: "סדר אביי (יומא לג.) או סדר הרמב״ם (תמידים ומוספין ו). ההדגמה ממשיכה מאותו שלב." },
        { k: "lamps", lab: "נרות", o: [["rambam", "הרמב״ם"], ["rashi", "רש״י"]], row: /^המנורה והנרות בבוקר/, set: "setLamps",
          tip: "הרמב״ם: המנורה בין צפון לדרום, ומדליק נר שכבה. רש״י, הראב״ד והברטנורא: המנורה בין מזרח למערב, והנרות נשארים כבויים עד הערב." },
        { k: "belt", lab: "אבנט כהן הדיוט", o: [["kilayim", "כלאים"], ["white", "לבן"]], row: /^אבנטו של כהן הדיוט/, set: "setBelt",
          tip: "יומא יב: \"לא נחלקו אלא באבנטו של כהן הדיוט... שרבי אומר: של כלאים, ורבי אלעזר ברבי שמעון אומר: של בוץ\". הרמב״ם (כלי המקדש ח, א) כרבי. אבנט כהן גדול תמיד של כלאים." },
        { k: "mitz", lab: "מצנפת כהן גדול", o: [["rashi", "רש״י"], ["ramban", "רמב״ן"]], set: "setMitz",
          tip: "רש״י (שמות כח, ד): \"כמין כפת כובע\"; (כח, לז): \"למעלה בגבה הראש\". הרמב״ן (כח, לא): \"כעין צניף שצונף בו את ראשו\"." },
        { k: "ephod", lab: "אפוד", o: [["rashi", "רש״י"], ["rambam", "הרמב״ם"]], set: "setEphod",
          tip: "רש״י (שמות כח, ו): \"רחבו כמדת רחב גבו של אדם ויותר\"; (כח, כו): \"ונקפל הסינר לפני הכהן על מתניו\". הרמב״ם (כלי המקדש ט, ט): \"רחבו כרחב גבו של אדם מכתף לכתף\"." }
      ];
      const renderOpts = (s) => {
        const T = ctx.shared.tamid;
        const on = !!(s && s.kind === "tamid" && T && fnc(T.readings));
        elOpts.classList.toggle("on", on);
        if (!on) return;
        const cur = call(T.readings) || {};
        elOpts.textContent = "";
        for (const g of TAMID_OPTS) {
          const w = mk("span", "og", null, elOpts);
          tip(mk("b", null, g.lab + ":", w), g.tip);
          g.o.forEach(([v, lab], j) => {
            const b = mk("button", cur[g.k] === v ? "on" : null, lab, w);
            b.type = "button";
            b.addEventListener("click", () => {
              const now = call(T.readings) || {};
              if (now[g.k] === v) return;
              const row = g.row ? rowsOf().find((r) => g.row.test(String(r.cap || ""))) : null;
              if (row) setRow(row, "o" + j);
              else call(T[g.set], v);
              renderOpts(slides[idx] || s);
            });
          });
        }
      };
      const partLabel = (s) => {
        if (mode.key === "continuous") return "מצגת רציפה · סבב " + round;
        if (s.kind === "verse") return "לפי סדר המשניות · מידות פרק " + tour_heb(s.ch);
        if (s.kind === "tamid") return "סדר עבודת הבוקר · מסכת תמיד";   // 2.0 (55-tamid.js)
        // OPS_GROUPS_303: a reading of the opinions table says its group of the table
        return "לפי הנושאים · " + (s.part ? "שיטות נוספות" + (s.group ? " · " + s.group : "") : s.group || "מבטים");   // 1.0.1-L: the panel's group
      };
      const renderVerses = (list) => {
        elVs.textContent = "";
        for (const [v, txt, lbl] of list || []) {   // 2.0 (55-tamid.js): [n, words, label]
          const p = mk("div", "v", null, elVs);
          if (lbl) mk("span", "vl", lbl, p);
          else mk("span", "vn", tour_heb(v), p);
          // ketiv "(...)" small and grey, qere "[...]" in the text, as printed in Otzaria
          for (const part of String(txt).split(/(\([^)]*\)|\[[^\]]*\])/)) {
            if (!part) continue;
            if (part[0] === "(") { const e = mk("span", "kt", part, p); if (!lbl) tip(e, "כתיב"); }
            else if (part[0] === "[") { const e = mk("span", "qr", lbl ? part : part.slice(1, -1), p); if (!lbl) tip(e, "קרי"); }
            else p.appendChild(document.createTextNode(part));
          }
        }
      };
      // 1.0.1-L (L.89, "כל הסוגריים של מקורות תקטין יותר"): the helper of 70-ui.js: a source in parentheses, outside a quote, in a smaller font; the letters do not change
      const fillSrc = (el, text) => {
        const h = fnc(U.smallSources) ? call(U.smallSources, text) : null;
        if (typeof h === "string") el.innerHTML = h;
        else el.textContent = text;
      };
      const slideText = (s, rt) => s.text + (rt && rt.feat && s.xf ? (s.text ? " " : "") + s.xf : "");
      const render = (s, rt) => {
        elPart.textContent = partLabel(s);
        elNum.textContent = (idx + 1) + " / " + slides.length;
        fillSrc(elTtl, s.title);
        elSub.textContent = s.sub || "";
        elSub.style.display = s.sub ? "" : "none";
        renderOpts(s);   // 2.0 (55-tamid.js)
        renderVerses(s.verses && s.verses.length ? s.verses : null);
        fillSrc(elTxt, slideText(s, rt));
        elCaps.textContent = "";
        bubW.classList.toggle("on", !!s.bubble);
        elSrc.textContent = "";
        if (s.refs && s.refs.length && fnc(U.refLinks)) {
          elSrc.appendChild(document.createTextNode("מקורות: "));
          call(U.refLinks, elSrc, s.refs);
        }
        bPrev.disabled = idx <= 0 && mode.key !== "continuous";
        bNext.disabled = false;
        bNext.textContent = idx === slides.length - 1 && mode.key !== "continuous" ? "לסיכום ←" : "הבא ←";
        bPause.textContent = paused ? "▶ המשך" : "⏸ השהה";
        bStop.textContent = "✕ סיום";
        bar.style.width = "0%";
        body.scrollTop = 0;
        showWait();
        fitBox();
      };
      // ---- entering and leaving a slide ----
      const leave = () => {
        const rt = cur;
        cur = null;
        if (!rt) return;
        for (let k = rt.undo.length - 1; k >= 0; k--) {
          try {
            rt.undo[k]();
          } catch (_) {
          }
        }
      };
      const flyRes = (res, dur) => {
        const before = snapOpen();
        fly(res.cam.pos, res.cam.target, dur);
        keepClosed(before);
      };
      // 1.0.1-L (L.81): a version of the throne for this slide (through its row of the opinions table when it is there, so the panel shows it);
      // it goes back when the slide is left
      const versionFor = (rt, key) => {
        const tv = ctx.shared.throneVersion;
        if (!tv || !fnc(tv.set) || tv.current === key) return;
        const row = throneRow(), was = tv.current;
        rt.lv = layerVis();   // (tour-5: a row's onPick may switch the palace layer)
        rt.undo.push(() => {
          for (const [n, v] of rt.lv) if (layerOn(n) !== v) setLayer(n, v);
        });
        if (row) setRow(row, key);
        else call(tv.set, key);
        rt.undo.push(() => {
          if (row) setRow(row, was);
          else call(tv.set, was);
        });
        rt.lv = rt.lv.filter(([n, v]) => layerOn(n) !== v);
      };
      // 1.0.1-L (L.78-L.81): starts the slide's timeline. The tour drives it (animStep: seek per frame), so its clock is the slide's: frozen while the
      // tour is paused, held or hidden, scaled by the speed. Null-safe: no API or no script for this version = a plain slide
      const beginAnim = (rt) => {
        const s = rt.s, th = ctx.shared.throne;
        if (s.anim === "tamid") {   // 2.0 (55-tamid.js)
          const T = ctx.shared.tamid;
          if (!T || !fnc(T.seek)) return;
          const api = { start: () => true, seek: (sec) => T.seek(s.stage, sec, s.order), reset: () => T.seek(s.stage, s.dur, s.order) };
          T.seek(s.stage, 0, s.order);
          rt.anim = { api, dur: s.dur, whole: s.dur, base: 0, next: null, caps: Array.isArray(s.caps) ? s.caps : [], i: 0, last: null, done: false, scrolled: false };
          total = slideMs(s);
          return;
        }
        if (!s.anim || !th) return;
        const wit = s.anim === "witnesses", api = wit ? th.witnesses : th.ascent, scr = wit ? th.witnessScript : th.script;
        const caps = scr && scr[s.ver];
        if (!api || !fnc(api.start)) return;
        let ok = false;
        try {
          ok = wit ? api.start() : api.start(s.ver);
        } catch (_) {
        }
        if (!ok) return;
        const dur = typeof api.duration === "number" && api.duration > 0 ? api.duration : 0;
        rt.anim = { api, dur, whole: dur, base: 0, next: null, caps: Array.isArray(caps) ? caps : [], i: 0, last: null, done: false, scrolled: false };
        // 1.0.1-L (A31): the witnesses follow on the same slide, after a moment for the camera (animStep)
        if (s.animW && th.witnesses && fnc(th.witnesses.start)) {
          const w = th.witnesses, wc = th.witnessScript && th.witnessScript[s.ver], wd = typeof w.duration === "number" && w.duration > 0 ? w.duration : 0;
          if (wd > 0) {
            rt.anim.next = { api: w, dur: wd, caps: Array.isArray(wc) ? wc : [] };
            rt.anim.whole += tour_ANIM_LEAD + wd;
            rt.undo.push(() => {
              try {
                if (fnc(w.reset)) w.reset();
              } catch (_) {
              }
            });
          }
        }
        rt.undo.push(() => {
          try {
            if (fnc(api.reset)) api.reset();
          } catch (_) {
          }
        });
        total = slideMs(s);
      };
      // the newest caption stays in view, unless the reader scrolled the text himself
      const showCaption = (a, e) => {
        const top = e.offsetTop, h = e.offsetHeight, ch = body.clientHeight;
        if (!a.scrolled && ch > 0 && isFinite(top + h)) body.scrollTop = Math.max(0, top + h - ch + 8);
      };
      const addCaption = (a, c) => {
        if (a.last) a.last.classList.remove("now");
        const e = mk("div", "cap now", null, elCaps);
        fillSrc(e, c.text);   // (L.89: the bracket after the midrash's quote; the helper leaves the quote's own words)
        a.last = e;
        showCaption(a, e);
      };
      // per frame, also while held (the same moment again: the timeline stays frozen); no allocation but the caption's element when one appears
      const animStep = (rt) => {
        const a = rt.anim;
        if (!a || a.done) return;
        const at = elapsed / (1000 * speed) - tour_ANIM_LEAD - a.base, sec = at > 0 ? at : 0;   // (at < 0: the camera is still on its way)
        while (a.i < a.caps.length && a.caps[a.i].t <= at) addCaption(a, a.caps[a.i++]);
        if (sec >= a.dur) {
          try {
            if (fnc(a.api.reset)) a.api.reset();
          } catch (_) {
          }
          // 1.0.1-L (A31): from the ascent to the witnesses on the same slide: their lead as a caption, the throne's view, their timeline after the same lead time
          const n = a.next;
          if (n) {
            a.next = null;
            a.base += tour_ANIM_LEAD + a.dur;
            a.api = n.api;
            a.dur = n.dur;
            a.caps = n.caps;
            a.i = 0;
            addCaption(a, { text: tour_THRONE.leadW });
            let ok = false;
            try {
              ok = n.api.start();
            } catch (_) {
            }
            if (ok) {
              const r2 = pick(rt.s.goW);
              if (r2) flyRes(r2);
              return;
            }
          }
          a.done = true;   // everything returns to rest; the last caption stays until the slide ends
          return;
        }
        try {
          if (fnc(a.api.seek)) a.api.seek(sec);
        } catch (_) {
        }
      };
      // returns false when the slide is skipped (the continuous mode, the devir under the cloud); its switches are then undone by leave()
      const enter = () => {
        const s = slides[idx];
        const rt = { s, undo: [], feat: false, devirNav: false, asked: false, orbit: null, thenI: 0, lv: null, anim: null, outside: false, act: false, actOnly: false, demoSeen: false, demoEnd: null, thenAbs: null };
        cur = rt;
        // 1.3.5 / 1.9.3: what this slide's place or reading opens for a while (a roof, a section) stays until the slide is left
        call(ctx.shared.holdAuto, true);
        rt.undo.push(() => {
          call(ctx.shared.holdAuto, false);
          call(ctx.shared.closeAuto);
          try { if (ctx.ui && ctx.ui.autoOff) ctx.ui.autoOff.flush(); } catch (_) {}   // TOUR_FLUSH_211: the zones, the see-through house
        });
        if (s.kind === "opinion") {
          // 1.0.1-K review (tour-5): a reading's own calls may switch a layer that is not its own - the forest house's onPick and fly
          // turn the palace layer on, and so does its undo, onPick(def) (70-ui.js): the layers are recorded first, and those that the
          // slide's own calls changed (rt.lv, narrowed after the row's fly below) are put back after the row's undo (pushed first, so it
          // runs last). In "רציפה" the palace stayed on from the second round. A feature's own group is not among them (OWNED)
          rt.lv = layerVis();
          rt.undo.push(() => {
            for (const [n, v] of rt.lv) if (layerOn(n) !== v) setLayer(n, v);
          });
          // 1.3.5 / 1.9.3: a reading may move another row with it (the names of the north gates show the thirteen gates) - the other rows
          // go back after this row's own way back (pushed first, so it runs after it)
          // 1.3.7 / 1.9.5 (TOUR_ENGINE_204; the scan of 11.11.2026): a row whose onPick runs a demonstration (the way from the wicket to
          // the great gate) started the DEFAULT reading's demonstration when the slide was left and the row went back - over the next
          // slide. The demonstrations are stopped after the rows went back (pushed before their undos: the stack runs backwards)
          rt.undo.push(() => call(ctx.shared.stopDemos));
          const rows0 = rowsOf().filter((r) => r !== s.row).map((r) => [r, r.cur]);
          rt.undo.push(() => {
            for (const [r, k] of rows0) if (r.cur !== k) setRow(r, k);
          });
          setRow(s.row, s.key);
          rt.undo.push(() => setRow(s.row, s.def));
        }
        if (s.ver) versionFor(rt, s.ver);   // 1.0.1-L: before the camera is chosen (a version may re-aim the throne's fly points)
        if (s.lay) layerNeed(rt, s.lay);
        let res = null;
        if (s.kind !== "opinion" && !s.nofly) {
          res = pick(s.go) || pick([{ fp: "__general" }]);   // a missing target: the general view, never an error
          if (res) {
            rt.devirNav = inDevir(res.cam.pos) || inDevir(res.cam.target);
            if (mode.key === "continuous" && rt.devirNav && cloudOn()) return false;
            // 1.0.1-L: after a "ביטול" in this run no second dialog: the slide's view from outside the devir
            if (rt.devirNav && cloudDenied && cloudOn()) {
              const r2 = pick(s.out);
              if (r2) {
                res = r2;
                rt.devirNav = false;
                rt.outside = true;
              }
            }
            if (res.c.f === "mechonaExplode") parkBase(rt);   // 1.0.1-K review (vessels-2 / tour-4): taken apart in its place
            if (res.c.f) rt.feat = featureOn(rt, res.c.f);
            if (rt.feat && s.xf) total = slideMs(s);
            if (res.c.lay) layerNeed(rt, res.c.lay);
            if (res.cam.layer) layerNeed(rt, res.cam.layer);
          }
        }
        render(s, rt);
        // 1.0.1-L (L.34): the UI's info box became the floating card, which stays closed while the tour runs: its text is the banner's own
        if (!U.card) {
          if (s.kind === "view") setInfo(s.key);
          else setInfo("__place", { text: elTxt.textContent, refs: s.refs || [] });
        }
        if (s.kind === "opinion") {
          const before = snapOpen();
          if (fnc(s.row.fly)) call(s.row.fly, s.key);
          keepClosed(before);
          rt.lv = rt.lv.filter(([n, v]) => layerOn(n) !== v);   // (tour-5) only the layers this slide's own calls changed
          if (confirmOpen()) {
            rt.devirNav = true;
            if (mode.key === "continuous") {
              cancelConfirm();
              return false;
            }
            if (cloudDenied) {   // 1.0.1-L: no second dialog in this run
              cancelConfirm();
              rt.devirNav = false;
              rt.outside = true;
              const r2 = pick(s.out);
              if (r2) flyRes(r2);
            }
          }
        } else {
          runPlace(rt, s, res);   // 1.3.5 / 1.9.3: the place's own feature and action, as its button (before its flight, as there)
          if (res && !rt.actOnly) flyRes(res);
        }
        if (s.anim) beginAnim(rt);
        if (mode.key === "continuous" && !rt.devirNav && !s.nofly && !rt.actOnly && !(Array.isArray(s.then) && s.then.length)) {   // TOUR_ENGINE_204B: its own cameras turn it
          rt.orbit = { start: 1800, amp: tour_ORBIT * orbitSide, applied: 0, begun: false, dead: false };
          orbitSide = -orbitSide;
        }
        return true;
      };
      // the slide's further cameras (8:1-5: from the south up to the house; 1.0.1-L: a list, each at its part of the slide)
      const thenStep = (rt) => {
        const th = rt.s.then;
        // TOUR_DEMO_HOLD_206: after a demonstration the further views that waited for it have times of their own (rt.thenAbs)
        if (!th || rt.thenI >= th.length || elapsed < (rt.thenAbs ? rt.thenAbs[rt.thenI] : total * th[rt.thenI].at)) return;
        const t = th[rt.thenI++];
        const r2 = pick(t.go);
        if (!r2) return;
        // 1.0.1-L (L.88): a stop may switch its feature on, for the rest of the slide; the slide's added sentence comes with it
        if (r2.c.f && !rt.feat && featureOn(rt, r2.c.f)) {
          rt.feat = true;
          if (rt.s.xf) {
            fillSrc(elTxt, slideText(rt.s, rt));
            const t1 = slideMs(rt.s);
            if (t1 > total) total = t1;
          }
        }
        flyRes(r2, t.dur);
      };
      // the continuous mode's orbit: eased from 0 to +-12 degrees about the vertical through the target, over the rest of the slide
      const orbitStep = (rt) => {
        const o = rt.orbit;
        if (!o || o.dead || elapsed < o.start) return;
        const cam = ctx.camera, oc = ctx.controls;
        if (!cam || !oc || !oc.target) {
          o.dead = true;
          return;
        }
        const p = cam.position, tg = oc.target;
        if (!o.begun) {
          if (!outdoors([p.x, p.y, p.z], [tg.x, tg.y, tg.z])) {
            o.dead = true;
            return;
          }
          o.begun = true;
        }
        const k = Math.min(1, (elapsed - o.start) / Math.max(1, total - o.start));
        const th = o.amp * (1 - Math.cos(Math.PI * k)) / 2, d = th - o.applied;
        if (Math.abs(d) < 1e-7) return;
        o.applied = th;
        const ox = p.x - tg.x, oz = p.z - tg.z, c = Math.cos(d), sn = Math.sin(d);
        p.x = tg.x + ox * c + oz * sn;
        p.z = tg.z - ox * sn + oz * c;
        cam.lookAt(tg);
      };
      const go = (i, dir) => {
        dir = dir < 0 ? -1 : 1;
        cancelConfirm();   // a pending dialog of the slide that is left: its fly must not land on the next slide
        // 1.0.1-K review (tour-2): the card of a clicked label (70-ui.js, K.9b) is closed on every slide change, as the UI's views and
        // places do - in "רציפה" the tour moves on by itself and the card stayed over the next views with the old label's text
        call(U.closeCard);
        closeXCard();
        leave();
        const N = slides.length;
        let wrapped = false;
        for (let k = 0; k < N; k++) {
          let j = i + k * dir;
          if (mode.key === "continuous") {
            if (j >= N && !wrapped) {
              round++;   // the loop starts again
              wrapped = true;
            }
            j = ((j % N) + N) % N;
          } else if (j < 0 || j >= N) break;
          idx = j;
          elapsed = 0;
          total = slideMs(slides[j]);
          if (enter()) return true;
          leave();   // skipped: undo what it switched on
        }
        return false;
      };
      // ---- the pre-tour state, restored at the end ----
      // 1.0.1-K review (tour-1 / cross-2 / interior-2): the layers but for a feature's own groups (OWNED), and the features themselves
      // (OWN_FEAT, null = not in the model) with the parts' labels of the base taken apart
      const snapshot = () => ({
        rows: rowsOf().map((r) => [r, r.cur]),
        layers: layerVis(),
        feats: OWN_FEAT.map((k) => [k, featState(k)]),
        parts: layerOn("mechonaParts"),
        ver: ctx.shared.throneVersion ? ctx.shared.throneVersion.current : null,   // 1.0.1-L: (also when the panel has no row for it)
        auto: false,
        panel: false
      });
      const restore = () => {
        const sv = saved;
        saved = null;
        if (!sv) return;
        for (const [row, key] of sv.rows) if (!isTamidRow(row)) setRow(row, key);
        const tvr = ctx.shared.throneVersion;
        if (sv.ver && tvr && tvr.current !== sv.ver && fnc(tvr.set)) call(tvr.set, sv.ver);
        for (const [n, vis] of sv.layers) if (ctx.layers[n] && layerOn(n) !== vis) setLayer(n, vis);
        // 1.0.1-K review (tour-1 / cross-2 / interior-2): a feature the user switched during the tour (its pill, "↺ החזר הכל") goes back
        // as it was before the tour through its own set(), which moves its meshes, its "on" and its group together - the raw restore of
        // the group left the measures, the layers' labels or the parts' labels without their feature (or over the closed model)
        for (const [k, on] of sv.feats) {
          if (on === null || featState(k) === on) continue;
          try {
            featureOf(k).set(on);
          } catch (_) {
          }
        }
        // 1.3.6 / 1.9.4: the viewing tools that were on before the presentation come back (toolsOff)
        for (const f of sv.tools || []) {
          try {
            f();
          } catch (_) {
          }
        }
        // the parts' labels go with the base taken apart: as before the tour while it is apart
        const parts = sv.parts && featState("mechonaExplode") === true;
        if (ctx.layers.mechonaParts && layerOn("mechonaParts") !== parts) setLayer("mechonaParts", parts);
        // tour-8: on again only if it was on before the tour and nobody switched it back on meanwhile
        if (sv.auto) {
          const ar = autoRot();
          if (ar) {
            if (!call(ar.get)) call(ar.set, true);
          } else if (ctx.controls && !ctx.controls.autoRotate) ctx.controls.autoRotate = true;
        }
        // 1.0.1-L (L.93): the panel as it was before the presentation, whatever the viewer did with the burger meanwhile
        if (U.panel && U.burger && fnc(U.burger.click) && panelOpen() !== sv.panel) U.burger.click();
      };
      // 1.0.1-K review (tour-7): the same rule as the CSS (tour_PHONE_MQ), one MediaQueryList made once
      let phoneMQ = null;
      try {
        if (fnc(window.matchMedia)) phoneMQ = window.matchMedia(tour_PHONE_MQ);
      } catch (_) {
      }
      const narrow = () => (phoneMQ && typeof phoneMQ.matches === "boolean" ? phoneMQ.matches : (window.innerWidth || 1024) < 640);
      const panelOpen = () => !!(U.panel && U.panel.style.display !== "none");
      const start = (key, opts) => {
        if (confirmOpen()) return false;
        if (running) finish(true);
        const M = tour_MODES.find((m) => m.key === key) || tour_MODES[typeof key === "number" ? key : 0] || tour_MODES[0];
        mode = M;
        speed = opts && opts.speed > 0 ? opts.speed : userSpeed;
        slides = M.key === "tamid" ? tamidSlides() : M.key === "verses" ? verseSlides() : topicSlides();   // 2.0 (55-tamid.js)
        openMenu(false);
        if (!slides.length) return false;
        // 1.0.1-L (L.34 / L.27): the explanation card closes and stays closed; a place's 15-second timer no longer runs - a slide's feature is the
        // tour's alone, and what such a timer would have switched off goes back now (before the snapshot, so the end does not bring it back)
        closeXCard();
        if (U.autoOff) {
          call(U.autoOff.flush);
          call(U.autoOff.cancel);
        }
        if (fnc(ctx.shared.closeAuto)) call(ctx.shared.closeAuto);   // (1.9.4: what a place or a row opened for a while, the Second Temple's timers)
        const tools = toolsOff();   // 1.3.6 / 1.9.4: before the snapshot, so that the features among them are "off" in it
        saved = snapshot();
        saved.tools = tools;
        cloudDenied = false;
        // TOUR_DEFAULT_207: the row's own default (row.current) - a row may begin with another reading than its first (2.0.7: the first lottery,
        // "אביי"); until 2.0.7 every row was set to its first reading here
        for (const [r] of saved.rows) if (!isTamidRow(r)) setRow(r, r.current || r.options[0][0]);   // the model in its default readings (Rashi first)
        {
          const tvs = ctx.shared.throneVersion;   // (L.81: the throne too, also when the panel has no row for it)
          if (tvs && Array.isArray(tvs.keys) && tvs.keys.length && tvs.current !== tvs.keys[0] && fnc(tvs.set)) call(tvs.set, tvs.keys[0]);
        }
        // the tour moves the camera itself: "סיבוב איטי" off while it runs (1.0.1-K review tour-8: through the UI's checkbox when it can)
        const ar = autoRot();
        if (ar ? !!call(ar.get) : !!(ctx.controls && ctx.controls.autoRotate)) {
          if (ar) call(ar.set, false);
          else ctx.controls.autoRotate = false;
          saved.auto = true;
        }
        // 1.0.1-L (L.93, the user: "אני רוצה שבזמן הצפיה התפריט מצד ימין יסגר לצד לגמרי כדי לתת מרחב יותר לתצוגה"): in every mode, as the burger closes it; the burger stays
        saved.panel = panelOpen();
        if (saved.panel && U.burger && fnc(U.burger.click)) U.burger.click();
        running = true;
        ended = false;
        paused = false;
        idleUntil = 0;
        holdDemo = false;   // CAM_219
        downPtrs.clear();
        round = 1;
        orbitSide = 1;
        roofList = null;
        cfSeenAt = -1e9;
        box.style.display = "flex";
        setBtn();
        idx = -1;
        if (mode.key === "tamid" && ctx.shared.tamid) call(ctx.shared.tamid.begin);   // 2.0 (55-tamid.js): the night, the figures
        go(0, 1);   // (closes the label's card: tour-2)
        return true;
      };
      // 1.0.1-K review (tour-3): the hidden banner keeps no focus (a focused speed <select> would go on taking the arrow keys)
      const hideBox = () => {
        const ae = document.activeElement;
        if (ae && inside(ae, box) && fnc(ae.blur)) ae.blur();
        box.style.display = "none";
      };
      const showEnd = () => {
        elPart.textContent = mode.key === "tamid" ? "סדר עבודת הבוקר" : mode.key === "verses" ? "לפי סדר הפסוקים" : "לפי הנושאים";
        elNum.textContent = "";
        elTtl.textContent = "סוף המצגת";
        elSub.style.display = "none";
        elVs.textContent = "";
        elTxt.textContent = "השיטות, השכבות והמתגים שהיו לפני המצגת הוחזרו, וחזרנו למבט הכללי. אפשר להמשיך לבד בלוח הבקרה, או להתחיל שוב.";
        elCaps.textContent = "";
        bubW.classList.remove("on");
        elSrc.textContent = "";
        waitTxt = "";
        elWait.style.display = "none";
        bPrev.disabled = true;
        bPause.textContent = "▶ התחל שוב";
        bNext.textContent = "—";
        bNext.disabled = true;
        bStop.textContent = "✕ סגור";
        bar.style.width = "100%";
      };
      const finish = (close) => {
        if (!running) {
          if (close) hideBox();
          return;
        }
        cancelConfirm();
        call(U.closeCard);   // 1.0.1-K review (tour-2): the label's card does not outlive the tour either
        leave();
        if (mode && mode.key === "tamid" && ctx.shared.tamid) call(ctx.shared.tamid.end);   // 2.0 (55-tamid.js): the day and the model back
        restore();
        running = false;
        viewShift();   // 1.0.1-L (L.93): the lens back to the centre
        paused = false;
        idleUntil = 0;
        holdDemo = false;   // CAM_219
        downPtrs.clear();
        idx = -1;
        setBtn();
        if (close) {
          hideBox();
          return;
        }
        ended = true;
        showEnd();
        const g = resolveFp("__general");
        if (g) flyRes({ cam: { pos: g.pos, target: g.target } });
        if (!U.card) setInfo("__general");   // (1.0.1-L: the floating card does not open by itself)
      };
      const next = () => {
        if (!running) return;
        if (idx + 1 < slides.length || mode.key === "continuous") go(idx + 1, 1);
        else finish(false);
      };
      const prev = () => {
        if (!running) return;
        if (idx > 0) go(idx - 1, -1);
        else if (mode.key === "continuous") go(slides.length - 1, -1);
      };
      const setSpeed = (k) => {
        if (!(k > 0)) return;
        const frac = total > 0 ? elapsed / total : 0;
        speed = userSpeed = k;
        spd.value = String(k);
        try {
          localStorage.setItem("tm-tour-speed", String(k));
        } catch (_) {
        }
        if (running && slides[idx]) {
          total = slideMs(slides[idx]);
          elapsed = frac * total;
        }
      };
      // the user looks around: the continuous mode holds 8 s after the last interaction, the other modes pause until "המשך"
      const userInteract = () => {
        if (!running) return;
        if (mode.key === "continuous" && !paused) {
          idleUntil = now() + 8000;
          if (cur && cur.orbit) cur.orbit.dead = true;
          // CAM_219 (the audit: in "רציפה" a demonstration that leads the eye - a walk, the lots - kept writing the camera through the
          // hold, and a drag or a key did nothing until it ended): the slide's demonstration pauses with the hold (the eye is the
          // viewer's), and goes on from the same moment when the hold ends (the tick, below) - as "⏸" does in the other modes
          try { if (fnc(ctx.shared.demoPause) && ctx.shared.demoPause()) holdDemo = true; } catch (_) {}
          showWait();
        } else setPaused(true);
      };
      // 1.0.1-K review (tour-6): the continuous mode's hold is kept 8 s ahead while a pointer is down or drags (no allocation: per frame)
      const holdOn = () => {
        if (running && mode.key === "continuous" && !paused) idleUntil = Math.max(idleUntil, now() + 8000);
      };
      // ---- the controls ----
      btn.addEventListener("click", () => {
        if (confirmOpen()) return;
        if (running) finish(true);
        else openMenu(!menuOpen);
      });
      bPrev.addEventListener("click", () => {
        if (confirmOpen()) return;
        setPaused(false);
        prev();
      });
      bNext.addEventListener("click", () => {
        if (confirmOpen()) return;
        setPaused(false);
        next();
      });
      bPause.addEventListener("click", () => {
        if (confirmOpen()) return;
        if (!running) {
          start(mode.key);
          return;
        }
        setPaused(!paused);
      });
      bStop.addEventListener("click", () => {
        if (confirmOpen()) return;
        finish(true);
      });
      // 1.0.1-K review (tour-3): after a choice the select gives the focus back - Chromium leaves it there after a mouse pick, and then Esc
      // did not end the tour and the arrow keys changed (and stored) the speed instead of turning the view
      spd.addEventListener("change", () => {
        setSpeed(parseFloat(spd.value));
        if (fnc(spd.blur)) spd.blur();
      });
      // F1 / UX2: a source link opened from the banner (Otzaria takes the reader away): pause. Capture phase - the link's own handler
      // (openSource) stops the click's propagation (1.0.1-L: the bubble's links too)
      for (const host of [elSrc, elBub]) {
        host.addEventListener("click", (e) => {
          if (!running) return;
          for (let n = e.target; n && n !== host; n = n.parentNode) {
            if (n.tagName && String(n.tagName).toUpperCase() === "A") {
              setPaused(true);
              return;
            }
          }
        }, true);
      }
      // 1.0.1-L: the reader scrolls the text himself: a new caption no longer scrolls it away
      for (const ev of ["wheel", "pointerdown", "touchstart"]) {
        body.addEventListener(ev, () => {
          if (cur && cur.anim) cur.anim.scrolled = true;
        }, { passive: true });
      }
      // F4 / UX6: any pointer on the model, the nav buttons, the model's pills or the panel = the user takes over; the wheel outside the
      // banner and the panel too. Not the tour's own elements, not the cloud dialog; synthetic pointer events (90-entry.js) are ignored
      document.addEventListener("pointerdown", (e) => {
        const t = e.target;
        if (menuOpen && !inside(t, menu) && !inside(t, btn)) openMenu(false);
        if (!running || e.__tmSynthetic) return;
        if (inside(t, box) || inside(t, btn) || inside(t, menu) || inside(t, cfEl())) return;
        // TOUR_SOFT_204 (the user, 12.11.2026 02:14: "סגירת כרטיס צף או קיפול במצגת או בכל הדגמה אינה נחשבת פקודה"): closing a floating
        // card, folding it, folding a group of the panel or the panel itself - not the user taking over
        if (t && t.closest && t.closest("#tm-xcard .x, #tm-card .x, #tm-burger, summary")) return;
        downPtrs.add(e.pointerId);   // tour-6: held while it is down
        userInteract();
      }, true);
      // 1.0.1-K review (tour-6): "רציפה" counted only the press, so a drag or a nav button held longer than 8 s (they repeat every 40 ms
      // with no new events) flew to the next slide mid-gesture. Now the tour holds while any pointer is down and 8 s after the last is
      // lifted; a move with a button pressed refreshes the hold too. Synthetic events of 90-entry.js's pointer safety never start or
      // refresh a hold - a synthetic release (a lost release it ends) only clears its pointer, as a move with no button pressed, the
      // window's blur and a hidden document do: a lost release never holds the tour for good
      const ptrUp = (e) => {
        if (!downPtrs.delete(e.pointerId)) return;
        if (!e.__tmSynthetic) holdOn();
      };
      document.addEventListener("pointerup", ptrUp, true);
      document.addEventListener("pointercancel", ptrUp, true);
      document.addEventListener("pointermove", (e) => {
        if (!running) return;
        if (!e.buttons) {
          if (downPtrs.size) downPtrs.delete(e.pointerId);   // not pressed any more (released outside the page)
          return;
        }
        if (e.__tmSynthetic || mode.key !== "continuous" || paused) return;
        const t = e.target;
        if (inside(t, box) || inside(t, btn) || inside(t, menu) || inside(t, cfEl())) return;
        holdOn();
      }, { capture: true, passive: true });
      const ptrsLost = () => {
        if (!downPtrs.size) return;
        downPtrs.clear();
        holdOn();
      };
      window.addEventListener("blur", ptrsLost);
      document.addEventListener("visibilitychange", () => {
        if (document.hidden) ptrsLost();
      });
      document.addEventListener("wheel", (e) => {
        if (!running) return;
        const t = e.target;
        if (inside(t, box) || inside(t, menu) || (U.panel && inside(t, U.panel))) return;
        if (t && t.closest && t.closest("#tm-xcard, #tm-card")) return;   // TOUR_SOFT_204: reading a floating card
        userInteract();
      }, { capture: true, passive: true });
      // keys: Esc closes the menu / answers the cloud dialog ("ביטול") / ends the tour; the arrows and the zoom keys turn the view -> the user
      // takes over. Nothing else is taken while the focus is in an input, a select or the side panel; no key is prevented
      window.addEventListener("keydown", (e) => {
        const ae = document.activeElement;
        const tag = ae && ae.tagName ? String(ae.tagName).toUpperCase() : "";
        const cf = confirmOpen();
        if (e.key === "Escape" || e.key === "Esc") {
          // 1.0.1-K review (tour-3): Esc BEFORE the focus test - with the focus on a side-panel button or checkbox, or on the banner's speed
          // <select> (Chromium leaves the focus on what the mouse clicked), the banner's "Esc — סיום" did nothing. Esc has no use there;
          // only a field one types in (none in the UI today) keeps its own Esc
          if (tag === "TEXTAREA" || (ae && ae.isContentEditable) ||
            (tag === "INPUT" && !/^(checkbox|radio|button|submit|reset|range|color|file|image)$/i.test(String(ae.type || "text")))) return;
          if (menuOpen) return void openMenu(false);
          if (cf) {
            if (running) cancelConfirm();
            return;
          }
          // the dialog was open at the last frame and is closed now: its own Esc handler (if ui.js has one) closed it during this very key
          // press - the tour goes on (a person's next key comes much later than 80 ms)
          if (now() - cfSeenAt < 80) return;
          // 1.0.1-L (L.34): an explanation card the user opened during a pause: this Esc closes the card (70-ui.js), not the tour
          if (running && U.card && fnc(U.card.isOpen) && U.card.isOpen()) return;
          if (running) finish(true);
          else if (box.style.display !== "none") hideBox();
          return;
        }
        if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT" || (ae && ae.isContentEditable) || (U.panel && inside(ae, U.panel))) return;
        if (!running || cf) return;
        if (/^(Arrow(Up|Down|Left|Right)|PageUp|PageDown|\+|-|=)$/.test(e.key || "")) userInteract();
      }, true);
      // ---- the clock: a ctx.animated hook (no interval), frozen while paused, held, waiting for the dialog or hidden ----
      ctx.animated.push(function(t) {
        const tn = typeof t === "number" && isFinite(t) ? t : now();
        const dt = lastT ? Math.min(500, Math.max(0, tn - lastT)) : 0;
        lastT = tn;
        if (!running) return;
        const cf = confirmOpen();
        if (cf) cfSeenAt = now();
        const rt = cur;
        if (rt && rt.devirNav) {
          if (cf) rt.asked = true;
          else if (rt.asked) {
            // the confirmation was answered: "ביטול" (the cloud still covers the devir) -> the slide's view from outside the devir
            rt.asked = false;
            if (cloudOn()) {
              cloudDenied = true;   // 1.0.1-L: not asked again in this run
              const r2 = pick(rt.s.out);
              if (r2) flyRes(r2);
            }
          }
        }
        const hidden = typeof document !== "undefined" && document.hidden;
        if (downPtrs.size) holdOn();   // tour-6: a pointer is still down (a long drag, a nav button held)
        const hold = paused || cf || hidden || (mode.key === "continuous" && now() < idleUntil);
        if (holdDemo && !paused && !(mode.key === "continuous" && now() < idleUntil)) {   // CAM_219: the hold is over - its demonstration goes on
          holdDemo = false;
          try { if (fnc(ctx.shared.demoPaused) && ctx.shared.demoPaused() && fnc(ctx.shared.demoResume)) ctx.shared.demoResume(); } catch (_) {}
        }
        showWait();
        if (tn - fitAt > 1000) {
          fitAt = tn;
          fitBox();   // the nav row may change (e.g. "החזר הכל" appears when a removal is on)
        }
        // 1.0.1-L (L.34): the explanation card stays closed while the tour runs; while the user himself paused it, a card he opened from the
        // panel may stay beside the panel (on a phone it would lie over the banner: closed)
        if (U.card && fnc(U.card.isOpen) && U.card.isOpen() && (!paused || narrow())) closeXCard();
        if (!hold) elapsed += dt;
        if (rt) animStep(rt);   // 1.0.1-L: (held too: the timeline stays at the same moment)
        if (hold) return;
        if (rt) {
          // TOUR_DEMO_HOLD_206 (the user, 12.11.2026 16:00: "כל מקום שיש הדגמה חייב להיות ארוך עד סוף ההדגמה"): ANY demonstration that
          // runs in a slide holds it - also one that a reading's choice or a feature of the slide started (until 2.0.5 only a place's
          // action, rt.act, did: the readings of the wickets and of the doors, and the base that brings the laver, were cut after ten
          // seconds). While it runs it leads the eye itself: no orbit, and the slide's further views wait; when it ends they come one
          // after the other, three seconds each; with none, its end rests two seconds.
          const demo = demoHolds(rt);
          if (demo) rt.demoSeen = true;
          else if (rt.demoSeen && rt.demoEnd == null) {
            rt.demoEnd = elapsed;
            const th = rt.s.then, n = th ? th.length - rt.thenI : 0;
            if (n > 0) {
              rt.thenAbs = [];
              for (let j = rt.thenI; j < th.length; j++) rt.thenAbs[j] = elapsed + 300 + (j - rt.thenI) * 3000;
              total = Math.max(total, elapsed + 300 + n * 3000);
            } else total = Math.max(total, elapsed + 2000);
          }
          if (!demo) {
            thenStep(rt);
            if (!rt.demoSeen) orbitStep(rt);   // (after a demonstration the eye stays where it left it)
          }
        }
        if (tn - progAt > 120 || elapsed >= total) {
          progAt = tn;
          bar.style.width = Math.min(100, elapsed / total * 100).toFixed(1) + "%";
        }
        if (elapsed >= total) {
          // 1.3.5 / 1.9.3: a demonstration that the slide started runs to its end first (two minutes more at most)
          if (rt && elapsed < total + 120000 * speed && demoHolds(rt)) return;   // TOUR_DEMO_HOLD_206: any demonstration, not only a place's action
          next();
        }
      });
      setBtn();
      openMenu(false);
      // ---- the API (tests, the integrator) ----
      const state = () => ({ running, paused, ended, mode: mode.key, idx, total: slides.length, title: slides[idx] ? slides[idx].title : "",
        waiting: confirmOpen(), idle: !!(running && mode.key === "continuous" && now() < idleUntil), round, speed, elapsed, slideMs: total });
      for (const k of ["running", "paused", "ended", "mode", "idx", "total", "title", "waiting", "idle", "round", "speed"]) {
        Object.defineProperty(state, k, { get: () => state()[k], enumerable: true });
      }
      // each slide's resolved target, without moving anything (for tests): fp / place, the feature, whether a fallback was used
      const plan = (key) => {
        const M = tour_MODES.find((m) => m.key === key) || tour_MODES[0];
        const list = M.key === "tamid" ? tamidSlides() : M.key === "verses" ? verseSlides() : topicSlides();
        return list.map((s, i) => {
          const base = { n: i + 1, kind: s.kind, title: s.title, sub: s.sub || "", group: s.group || "", part: s.part, bubble: !!s.bubble, ver: s.ver || null, anim: s.anim ? s.anim + (s.animW ? "+witnesses" : "") : null, chars: (s.text || "").length, refs: (s.refs || []).length };
          if (s.nofly) return Object.assign(base, { target: "nofly" });
          if (s.kind === "opinion") return Object.assign(base, { target: "row.fly(" + s.key + ")" });
          const r = pick(s.go);
          if (!r) return Object.assign(base, { target: "MISSING -> __general" });
          const c = r.c;
          return Object.assign(base, { target: c.fp ? "fp:" + c.fp : c.place ? "place:" + c.place : "pos", feature: c.f || null, layer: s.lay || c.lay || r.cam.layer || null,
            fallback: s.go.indexOf(c) > 0, pos: r.cam.pos, at: r.cam.target, devir: inDevir(r.cam.pos) || inDevir(r.cam.target) });
        });
      };
      ctx.shared.tour = {
        modes: tour_MODES.map((m) => ({ key: m.key, label: m.label, desc: m.desc })),
        start: (m, opts) => start(m, opts),
        stop: () => finish(true),
        next,
        prev,
        // 1.0.1-L: to a slide by its index, and to a moment of its timeline in seconds (tests, the integrator's pictures)
        goto: (i) => (running && i >= 0 && i < slides.length ? go(i, 1) : false),
        // 2.0 (55-tamid.js): the slides again (the order or the lamps' reading changed), at the same stage
        retamid: () => {
          if (!running || !mode || mode.key !== "tamid") return false;
          const id = slides[idx] && slides[idx].id;
          slides = tamidSlides();
          if (!slides.length) return false;
          const j = Math.max(0, slides.findIndex((x) => x.id === id));
          return go(j, 1);
        },
        seek: (sec) => {
          if (!running || !cur || !cur.anim || !(sec >= 0)) return false;
          elapsed = (sec + tour_ANIM_LEAD) * 1000 * speed;
          return true;
        },
        pause: (p) => setPaused(p === undefined ? true : !!p),
        setSpeed,
        state,
        plan,
        get slides() {
          return slides;
        }
      };
    } catch (e) {
      if (typeof console !== "undefined") console.error("[tour.js]", e);
    }
  }
