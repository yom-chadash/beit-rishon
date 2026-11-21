  // plugin/js/ui.js
  // plugin/js/ui.js - the panel of the FIRST Temple model (1.0.0). Adapted from the Second Temple ui.js 1.0.19:
  // label sprites, occluder fade loop (FADE_DIST 120), cutaway, burger/panel, views grid, places accordion, toggles,
  // info box with deep links into Otzaria (book id + line index), measuring tool (red line), cloud over the devir with
  // confirmation + visibility ray test, compass, nav buttons. All module-private names are prefixed ui_.
  // ui_makeLabelSprite is only the FALLBACK copy of makeLabelSprite2 (90-entry.js, same IIFE, hoisted): the label loop in
  // buildUI uses makeLabelSprite2 whenever it is in scope, so the two cannot drift apart in the bundle.
  // 1.0.1-K (K.9a, the user's fourth and fifth lists):
  //   - NO AUTOMATIC REMOVALS ("כפתור להסרה ולא הסרה אוט'", "ההיכל צריך להיות סגור מכל צדדיו ורק עם כפתור להסרה"): views, places, the
  //     opinions table, label clicks and the presentation API never open the house, the chambers, the ulam or the boards (their flags
  //     interior / yatzia / ulam / boards / in stay as data only; ctx.ui.applyCut / applyOpen are kept as no-ops for older callers);
  //   - ON-MODEL BUTTONS ("הכפתור צריך להיות על המיצג ולא בתוכן הענינים (כרעיון קה"ק והענן)"): a renderer for the registry
  //     ctx.shared.modelButtons (contract: FIXES-1.0.1-K.md 0.5b) draws a pill at each entry's projected anchor; the UI registers the cloud
  //     (with its confirmation) and the four removals - the house (ctx.cutaway), the chambers' outer walls (ctx.yatziaCut), the ulam
  //     (ctx.ulamCut), the boards of בית יער הלבנון (ctx.forestBoardsCut) - anchored at ctx.shared.anchors (fallbacks from CO); "↺ החזר הכל"
  //     in the nav row while anything is open; the panel's removal rows are gone (the panel only says where the pills are);
  //   - walls that block the view fade to 0.35, not 0.1 (Yossi: "שהחומות יהיו שקופות לא לגמרי, שיאחזו שיש חומה"), with a nav toggle
  //     "טשטוש חומות: פועל / כבוי" and a distance control "מרחק טשטוש" (60..400, default 120), remembered in localStorage;
  //   - custom tooltips (the user: "בריחוף על כפתורי המצפן צריך להיות הסבר מה הם עושים") on the nav buttons, the compass and its four
  //     letters (a click turns the view to that direction), the fade controls, the pills and the top-left buttons; a long press on touch;
  //   - the arrow keys turn the view like the nav buttons (left / right orbit, up / down tilt, + / - zoom) and never act while the focus
  //     is in the panel, the presentation or a form field (90-entry.js no longer gives the keys to OrbitControls);
  //   - a page booted in a hidden tab (0 x 0) decides the phone layout only when the real size is known.
  // 1.0.1-K (K.9b, content and integration, after all the build tracks):
  //   - the views grid without "הר הבית" and "השער המזרחי" (the user: "במבט כללי כפתור הר הבית ושער המזרחי מיותרים"; they stay as places
  //     under "הר הבית והחצרות" and their labels lead to those places); "האולם" = flyPoints.ulamInside, the ulam FROM ABOVE;
  //   - places and texts, with their sources, for everything new of this round: Yachin and Boaz and the capital (K.1), the oxen, the bases
  //     close / in operation (starts the demo) / taken apart (explode + the parts' labels) (K.3), the yatzia closed, its section (switches
  //     ctx.shared.yatziaSection on) and its door (K.2), the ulam from above with its courses (7:12 per Metzudat David, Ralbag, Malbim, Radak),
  //     the tables, the parochet's two faces, the golden altar with its smoke and its layers, the wall and floor layers (an OPTION - the
  //     default stays all gold), the carvings, the floor (K.4, K.5), לשכת הגזית, the forest house inside, the throne, the king's house, the
  //     garden (K.6) and "העמוד" (II Kings 11:14, 23:3; II Chr 23:13 with Rashi, Metzudat David, Ralbag, the Targum); the places that show a
  //     model feature switch it on (never one of the four removals); every new model choice in "השלמות";
  //   - LABEL_MAP covers every label of the modules (the yatzia measures, the parts of the base, the layers, the palace rooms carry their
  //     own texts); a click on a label also opens a CARD next to it on the model (the addendum C: "ליד העמוד"), following the camera,
  //     closed by its ✕ or a click elsewhere;
  //   - the review's text fixes Q2-1..Q2-5, Q2-7 (II Kings, Exodus, Leviticus, Kohelet, Song of Songs, the Mishnah of Menachot, Sanhedrin,
  //     Tamid, Kelim and Sanhedrin 100a open in Otzaria: ui_BASE / ui_PAGES / ui_MN) and UI-H2-1..9; the deep-link bases checked in the DB;
  //   - interior views without ghost walls: under a roof the wall fade only clears the direct line to the target (K.6's report);
  //   - the fallbacks (ui_FP, CO, the pillars) in step with the modules.
  // 1.0.1-K review (the round's review, confirmed findings):
  //   - the places "הכבש" (its camera looked through לשכת הגזית) and "כיור משה" (its camera hung over the altar ramp, the altar's corner
  //     in front of the laver) have new cameras with a clear line to their targets (ray-tested against the real meshes, fade on and off);
  //   - "המכונה בפירוק" and "המכונות מקרוב" park a running demonstration first (both frame the base's home spot); the parts' labels go off
  //     whenever the explode goes off, and only then (the pill of 45-vessels.js switches them on with it);
  //   - the wall fade: a far "מרחק טשטוש" lengthens only the rays toward the target, which stop 3 amot before it; the rays along the view
  //     keep the 1.0.19 reach (120 at most) - no ghost walls behind the target, the target's own wall is not faded;
  //   - the long-press tooltip's "swallow the click" is cleared by the next press and 400 ms after the long press ends;
  //   - texts: the small lying wheel that turns the big wheel is the book's explanation (a model choice), not בעל צורת הבית's (his are
  //     rods through pairs of wheels, "ואלו המקלות קראם הכתוב ידות"; for Rashi the ידות are the axle); "הסר את הנסרים" says what each
  //     reading of בית יער הלבנון shows without the boards (Rashi: the עבים, the small beams and the upper storey; the כרותות stay
  //     under its floor);
  //   - ctx.ui.autoRotate {get, set} (the "סיבוב איטי" row and the controls together) for the presentation.
  //   - integration: the pills (.tm-pill) at z-index 28, under the presentation's banner and the label card (29) - they drew over the
  //     banner's text; the nav row's captions hide below 640 px wide by @media(max-width:639px), the same rule as innerWidth < 640.
  // 1.0.1-L (FIXES-1.0.1-L.md, the user's answers of 29.10-1.11.2026; this file = the panel, 75-tour.js = the presentation):
  //   - L.34 THE FLOATING EXPLANATION CARD (the user: "כל פעם שלוחצים על הר הבית הוא פותח הסבר ואז צריך לגלול כדי למצוא את יתר הכפתורים";
  //     "כן, כרטיס צף"): the explanation of a view, a place or an opinion no longer sits at the panel's foot (the panel scrolled down to it
  //     and the buttons went out of view) - it opens in a floating card #tm-xcard BESIDE the panel, over the model (its top at the clicked
  //     button's height), with a ✕, its own scroll and the source links; the panel's lists never move; a new choice replaces the card's
  //     content; Esc or ✕ closes it; on a phone (<= ui_PHONE_MAX px) it is a bottom sheet above the nav row; one card at a time - it closes
  //     the label's card and the label's card closes it, and the presentation closes it when it starts (ctx.ui.card). The #tm-info box is gone.
  //     A place whose subject the card would hide may open it at the window's left edge (it.cardSide: the section's cut); with the presentation's banner on the
  //     left it stays beside the panel. Thin dark scrollbars on the panel and the card; on a phone the panel ends above the nav row.
  //   - L.27 THE 15-SECOND RULE (the user: "תן לזה 15 שניות ויחזור אוטו"): a place that switches a model FEATURE on (the yatzia section, the
  //     wall layers, the altar layers, the ulam tables of R. Yose b. R. Yehuda) switches it off again 15 s later (ui_AUTO_OFF_S), with a small
  //     countdown badge on the button; the feature's own pill / opinion row cancels the timer and the user's state stays; "↺ החזר הכל" and the
  //     presentation cancel every timer; the pills themselves are never timed; an animation with its own duration (the king's ascent to the
  //     throne) is exempt. ctx.ui.autoOff = { seconds, arm, run, cancel, flush, pending }. One setTimeout per feature, nothing per frame.
  //   - L.43 the yatzia has its own group "היציע" in the places accordion, with the place "חתך היציע" (flyPoints.yatziaSection, square-on;
  //     the texts teach Rashi's 7 / 6 / 5); L.49 the nav buttons' and the arrow keys' step is slower (orbitBy 0.045 -> 0.025 rad, tilt 0.035
  //     -> 0.02, the turn buttons' hold repeat 40 -> 50 ms; 90-entry.js rotateSpeed 0.5); L.51 the places "פעולת המכונה" and "המכונה בפירוק" are
  //     gone (the pills on the base do it; "המכונות מקרוב" stays).
  //   - texts, places, rows, "השלמות" and LABEL_MAP for every round-L change of the model files (their reports' FOR-UI sections): the
  //     Sea in the court's north-east CORNER (Rashi 7:39; the book), ALL TEN bases in one block of 2 x 5 before the ulam's south wing with Moses'
  //     laver between the rows (the book p. לח), their purpose (II Chr 4:6; Radak 7:39), the taps, no spouts; Yachin and Boaz as close to the
  //     wall as the capital allows (PX 6.08 / PZ 7.17) and the view "יכין ובועז" = the far view through the ulam's doorway (yachinBoazFull;
  //     the ulam stays closed, L.58); the ulam doorway 10 x 22 with two open cedar doors (II Chr 29:7; L.59) and its place; Malbim's capital
  //     (ctx.shared.pillarCapital, L.60) and R. Yose b. R. Yehuda's two tables (ctx.shared.ulamTables, L.72) as rows; the tables all in Moses'
  //     form, the golden altar 1 x 1 x 1 east of the rows, the menorot with 22 / 11 / 9 and three steps, the layers window near the entrance,
  //     the horizontal cherub wings and the new faces, the devir lintel, the parochet lions right to left, the staves, the foundation stone
  //     (interior); the three forest readings (Rashi / "מלבי״ם ורלב״ג" / "מצודת דוד"), the places אולם העמודים and העמודים והעב by fly point
  //     per reading, the king's own court, בית בת פרעה in the great court, the garden without the pool, the throne per Kings with its four
  //     midrashic versions (ctx.shared.throneVersion) and the ascent (palace); לשכת הגזית in the NORTH (Yoma 19a, the Rambam) and
  //     בית המטבחים north of the altar (courts); Rashi 7:2-7:6 quoted in the library's spelling (לארך, כלן, מחפין, קרוי, הספון, לרחב).
  //   - no text on the screen names the person who asked for a choice (the integrator's rule for the plugin's readers): "בחירת מודל", "כציור הספר" or the source;
  //     the requests' own words stay in comments. The verifiers' FOR-UI: the far views yachinBoazFull / boazFar and the place "בועז — מרחוק" (verify-heichal.md),
  //     בית המטבחים with its tables and pillars in two lines each, north to south (verify-courts.md).
  //   - ctx.ui.places() (every place button in the panel's order, for the presentation), ctx.ui.card, ctx.ui.autoOff; the boards pill also
  //     gates ctx.layers.forestBoards; the CO / pillar / anchor / fly-point fallbacks in step with the modules; one phone rule (ui_PHONE_MAX).
  // 1.0.1-L, part 5 of the round: L.89 ui_srcRuns / ui_fillSrc / ctx.ui.smallSources (the sources' brackets smaller); L.90 the table REVEAL (a pill flies to what it reveals and back); L.91 the forest row flies to the hall;
  // L.88 the place "כלי הבית — סוף פרק ז"; L.85 the place "מה שבתוך הארון" and its nine labels; the waiting texts of verify-interior.md, part5-rambam.md, lens-results.json, palace-2.md, A3, A10.
  // 1.0.1-L (L.89, the user: "כל הסוגריים של מקורות תקטין יותר"): ONE helper for every text the viewer reads. ui_srcRuns(text) cuts a text into runs
  // { t, s } where s = a source in parentheses: outside a quote (' " ״ at a word's edge; a quote's own words are never touched), with no nikud (a
  // verse's words), no quote inside it, at most 70 letters, and it looks like a source: a book or commentator's name, chapter and verse, or a daf.
  // ui_fillSrc(el, text) writes it to the DOM (a span.tm-src, with no innerHTML), ctx.ui.smallSources(text) returns it as HTML for 75-tour.js, and
  // ui_labelText (below) draws it in the labels on the model.
  // 1.0.2 (the user's list of 2.11.2026; this file = the panel):
  //   - item 4, THE OTHER OPINIONS INSIDE THE CARD: a card (the panel's #tm-xcard and the label's #tm-card) whose subject has rows in "שיטות
  //     ומחלוקות" ends with one compact row "שיטות:" and a small chip per reading, the current one marked; a chip does what the table's button
  //     does (row.mark + row.onPick; row.cardFly rows also fly, because their subject moves with the reading), the card stays open and its
  //     chips follow. The subject -> rows map is UI_OPS_V (view keys) / UI_OPS_P (place titles) / UI_OPS_L (label texts) inside buildUI; a card
  //     with no row shows nothing. The presentation's cards (ctx.ui.card.open) carry no chips.
  //   - item 8: the row "מזבח הנחושת — אבנים או מצופה נחושת" from ctx.shared.altarLook (40-altar.js), and the altar's cards carry its chips;
  //   - item 7: the place "השיתין" beside "מזבח הנחושת" and the label "השיתין" open ctx.shared.shitin's text (40-altar.js); nothing without it;
  //   - item 1: "דיווח על טעות או תקלה" at the panel's foot (inside Otzaria only): a small form -> feedback.report, with the version, the view or
  //     card and the chosen readings added to the details;
  //   - item 2: the button "open-beit-rishon" of I Kings and II Chronicles (manifest.json; 70-ui.js listens) opens the plugin with the reading
  //     position (reader.toolbar_item_clicked: currentId / currentBook / currentIndex): the line -> chapter and verse (ui_BASE, all the
  //     chapters of books 10 and 39 read in the DB) -> ui_READ -> the panel's own view or place button, with its card. The event is listened
  //     to from the script's first run (it may come during the loading) and queued until the UI and the loading are done.
  // 1.0.2, the add-on (same version, not yet published):
  //   - A: the brackets of a source in the cards' text are links (srcLinker / ui_srcParse): the card's own refs by label first, then a
  //     verse of a book of ui_BASE or a page of ui_PAGES; openSource as the chips; unresolved = plain; a hover underline only;
  //   - B: "הדפסה או שמירה כ-PDF" at the panel's foot: a print page #tm-print (the view's picture, the place's name, the open card's text and
  //     sources), @media print; ui.print / ui.exportPdf in Otzaria (from the click), window.print() outside; the page goes after;
  //   - C: "מה חדש בגרסה 1.0.2" (UI_NEWS) once per version, after the loading, never during the presentation; storage.* with localStorage;
  //   - D: the fade button's second mode "טשטוש: גם קיר מסתיר" (fadeState.hide): the building's walls that hide the target fade too;
  //   - the row "הכבשים הקטנים" (ctx.shared.altarRamps, 40-altar.js) next to "מראה המזבח", and its chips in the altar's cards.
  //   - the fixes (rule 6): the place "היסוד, הסובב וחוט הסיקרא" (ctx.shared.altarProfile) after "השיתין" with its "השלמות" item merged
  //     into it, and the item "הכבשים הקטנים — השלמה מן הגמרא" (both readings, the row's chips); ui_INFO.mizbeach, "הכבש והקרנות" and
  //     "מקום המזבח" now speak of the yesod and the sovev; UI_NEWS 11 lines (the fade mode added).
  var UI_SRC_NAME = /^ו?ה?(?:שם|ראו שם|מלכים|שמואל|דברי הימים|דה״י|שמות|ויקרא|במדבר|דברים|בראשית|ישעיה|ירמיה|ירמיהו|יחזקאל|הושע|עמוס|מיכה|זכריה|תהלים|משלי|איוב|שיר השירים|קהלת|אסתר|דניאל|עזרא|נחמיה|רש״י|רשב״ם|רש״ש|רד״ק|רלב״ג|מלבי״ם|מצודת|מצודות|מנחת|אברבנאל|רמב״ם|רמב״ן|ראב״ע|ראב״ד|מאירי|המאירי|הגר״א|תרגום|יונתן|ת״י|משנה|משנת|מדות|מידות|תמיד|יומא|זבחים|מנחות|בבא|סנהדרין|שקלים|סוכה|מגילה|חגיגה|ערכין|כלים|תוספתא|תוספות|תוס׳|ברטנורא|ברייתא|הלכות|כסף משנה|ילקוט|פסיקתא|מדרש|פירוש המשנה|עמ׳|בעל צורת הבית|לחם שמים|מעשי למלך|בית הבחירה|ספרי|מכילתא|תפארת ישראל|ראבי״ה|מהרש״א|פנים אחרים|אבא גוריון|פסחים|שבת|עירובין|פרה|מעילה|ריטב״א|רא״ש|תוספות יום טוב|תוי״ט|רע״ב|ר״ש|פיהמ״ש|יוסף בן מתתיהו|יוסיפון|קדמוניות|מלחמות|ירושלמי|גמרא|בבלי)(?:$|[\s,;.:׳״])/;
  // 1.0.2 (fix): the height of index.html's fixed top bar (56 px, 44 px in a narrow window); the floating cards' inline top never goes above it
  // (read once per window width: the label card asks every frame, and offsetHeight would force a layout)
  // 1.1.0: the top bar's icons (inline SVG, stroke = currentColor; index.html sizes them). ui_setTopBtn swaps a button's icon and label.
  var ui_ICONS = {
    play: ['<path d="M8 5.5v13l11-6.5z" fill="currentColor" stroke="none"/>'],
    stop: ['<rect x="6.5" y="6.5" width="11" height="11" rx="1.5" fill="currentColor" stroke="none"/>'],
    help: ['<circle cx="12" cy="12" r="9.2"/>', '<path d="M15.6 8.4l-2.3 6-6 2.3 2.3-6z" fill="currentColor" stroke="none"/>'],
    print: ['<path d="M7 9V4h10v5"/>', '<path d="M7 17H5a2 2 0 0 1-2-2v-4a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v4a2 2 0 0 1-2 2h-2"/>', '<path d="M7 14h10v6H7z"/>'],
    report: ['<path d="M5 21V4"/>', '<path d="M5 4h13l-2.5 4.5L18 13H5"/>'],
    news: ['<path d="M12 3.5l2.1 5.6 5.6 2.1-5.6 2.1L12 19l-2.1-5.7-5.6-2.1 5.6-2.1z" fill="currentColor" stroke="none"/>']
  };
  function ui_topIcon(name) {
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("viewBox", "0 0 24 24");
    svg.setAttribute("aria-hidden", "true");
    svg.innerHTML = (ui_ICONS[name] || ui_ICONS.help).join("");
    return svg;
  }
  function ui_setTopBtn(el, icon, label) {
    const svg = el.querySelector("svg");
    if (icon) {
      const n = ui_topIcon(icon);
      if (svg) el.replaceChild(n, svg);
      else el.insertBefore(n, el.firstChild);
    }
    const sp = el.querySelector(".lbl");
    if (label != null) {
      if (sp) sp.textContent = label;
      else {
        const s2 = document.createElement("span");
        s2.className = "lbl";
        s2.textContent = label;
        el.appendChild(s2);
      }
    }
  }
  var ui_barCache = { w: -1, h: 56 };
  function ui_barH() {
    const w = window.innerWidth;
    if (w !== ui_barCache.w) {
      const b = document.querySelector("header.topbar");
      const h = b ? b.offsetHeight : 0;
      if (h) ui_barCache = { w, h };
      else return 56;
    }
    return ui_barCache.h;
  }
  function ui_srcIs(body) {
    if (!body || body.length > 70 || /[\u0591-\u05C7]/.test(body) || /[()]/.test(body)) return false;
    if (/^עמ['׳]\s?[א-ת]/.test(body)) return true;           // the book's page
    if (/'|(?:^|\s)["״]|["״](?:$|[\s,;.:])/.test(body)) return false;   // a quote inside: its words stay as they are
    if (UI_SRC_NAME.test(body)) return true;
    // chapter and verse ("ז, לח"), a daf ("צט.", "לג:"): letters that are a Hebrew number, so that "אבן, ברוש וזהב" is not taken for a source
    return /(?:^|\s)(?=[א-ת])[קרשת]?[יכלמנסעפצ]?[א-ט]?,\s?(?=[א-ת])[קרשת]?[יכלמנסעפצ]?[א-ט]?(?:$|[\s,;–-])/.test(body) || /(?:^|\s)(?=[א-ת])[קרשת]?[יכלמנסעפצ]?[א-ט]?[.:](?:$|[\s,;–-])/.test(body);
  }
  function ui_srcRuns(text) {
    const s = String(text == null ? "" : text), out = [];
    let q = "", from = 0;
    const edge = (c) => c === "" || /[\s(\[—–:,;.\-]/.test(c);
    for (let i = 0; i < s.length; i++) {
      const c = s[i];
      if (c === "'" || c === '"' || c === "״") {
        const p = i ? s[i - 1] : "", n = i + 1 < s.length ? s[i + 1] : "";
        if (q) { if (c === q && p !== " " && (n === "" || /[\s.,;:)\]—–?!]/.test(n))) q = ""; }
        // an opening: at a word's edge, or after one prefix letter (ו'נכח השלחן')
        else if ((edge(p) || (p !== "" && "ובלכשמה".indexOf(p) >= 0 && edge(i > 1 ? s[i - 2] : ""))) && n !== "" && n !== " ") q = c;
        continue;
      }
      if (c !== "(" || q) continue;
      const e = s.indexOf(")", i + 1);
      if (e < 0 || e - i > 72 || !ui_srcIs(s.slice(i + 1, e))) continue;
      if (i > from) out.push({ t: s.slice(from, i), s: false });
      out.push({ t: s.slice(i, e + 1), s: true, i });   // 1.0.2 (A): i = where the bracket stands in the text (the book named before it)
      from = e + 1;
      i = e;
    }
    if (from < s.length) out.push({ t: s.slice(from), s: false });
    return out;
  }
  // 1.0.2 (A): link(run, text) -> an element for a source's bracket (span.tm-src with links inside it) or null (a plain bracket); only the cards pass it
  function ui_fillSrc(el, text, link) {
    el.textContent = "";
    const full = String(text == null ? "" : text);
    for (const r of ui_srcRuns(full)) {
      if (!r.s) { el.appendChild(document.createTextNode(r.t)); continue; }
      let ln = null;
      if (typeof link === "function") {
        try { ln = link(r, full); } catch (_) { ln = null; }
      }
      if (ln) { el.appendChild(ln); continue; }
      const sp = document.createElement("span");
      sp.className = "tm-src";
      sp.textContent = r.t;
      el.appendChild(sp);
    }
  }
  // ===== 1.3.3 (the user: "שינוי ניסוח, עיצוב וחלוקה לפסקאות, הדגשת שמות מפרשים ודברים חשובים ללא הגדלת הכרטיס"): THE CARD'S TEXT, RICH.
  // A "\n" in a card's text starts a paragraph (a small gap, not a blank line); a paragraph's lead - its words up to the first colon, when they
  // are few and stand before any quote or full stop ("רש״י:", "במודל:", "לשון המשנה (מידות ד, א):", "• רבי יהודה:") - is bold, and so are the
  // commentators' and the sages' names (UI_RICH_NAMES) wherever they stand outside a quote; "**...**" marks an important phrase. A quote's own
  // words are never touched, and the sources' brackets stay links (ui_srcRuns). ui_fillRich(el, text, link) - the cards; ui_richHTML(text) -
  // the presentation (ctx.ui.smallSources); the print rebuilds from the card's own text (el.__raw). The line height drops a little (1.6 -> 1.5),
  // so that the gaps between the paragraphs do not make the card taller. =====
  var UI_RICH_NAMES = new RegExp("(?<=(?:^|[^א-ת׳״'\"])[ובלכשמהד]?)(?:" + [
    "תוספות יום טוב", "תפארת ישראל", "מצודת דוד", "מצודת ציון", "מצודות", "מלבי״ם", "רלב״ג", "רד״ק", "רש״י", "רש\"י", "אברבנאל", "תרגום יונתן", "תרגום שני", "התרגום",
    "הרמב״ם", "רמב״ם", "הראב״ד", "ראב״ד", "הברטנורא", "ברטנורא", "תוספות רי״ד", "התוספות", "תוספות", "רבינו שמעיה", "רבנו שמעיה", "הר״ש", "רי״ד", "ר״י",
    "המשנה למלך", "משנה למלך", "שלטי הגיבורים", "רבי אליעזר בן יעקב", "רבי יהודה בן לקיש", "יוסי ברבי יהודה", "רבי יהודה", "רבי יוסי", "רבי מאיר",
    "רבי אליעזר", "רבי שמעון איש המצפה", "רבי שמעון", "רבי עקיבא", "אבא שאול", "תנא קמא", "רב הונא", "אביי", "רבא",
    "ר׳ יצחק בר מרדכי", "ר׳ יצחק הבחור", "מלאכת שלמה", "הרב קאפח", "קאפח"
  ].join("|") + ")(?![א-ת])", "g");
  function ui_quoteMask(s) {   // 1 inside a quote (its marks too), by ui_srcRuns' own rule; a new paragraph ends an open quote
    const m = new Uint8Array(s.length);
    let q = "";
    const edge = (c) => c === "" || /[\s(\[—–:,;.\-]/.test(c);
    for (let i = 0; i < s.length; i++) {
      const c = s[i];
      if (c === "\n") { q = ""; continue; }
      if (c === "'" || c === '"' || c === "״") {
        const p = i ? s[i - 1] : "", n = i + 1 < s.length ? s[i + 1] : "";
        if (q) { if (c === q && p !== " " && (n === "" || /[\s.,;:)\]—–?!]/.test(n))) { m[i] = 1; q = ""; continue; } }
        else if ((edge(p) || (p !== "" && "ובלכשמה".indexOf(p) >= 0 && edge(i > 1 ? s[i - 2] : ""))) && n !== "" && n !== " ") { q = c; m[i] = 1; continue; }
      }
      if (q) m[i] = 1;
    }
    return m;
  }
  function ui_richSegs(text) {   // -> { plain (the text without the marks), segs: [{ p } | { src: run } | { t, b }] }
    const src0 = String(text == null ? "" : text);
    let plain = "";
    const bold = [];
    let on = false;
    for (let i = 0; i < src0.length; i++) {
      if (src0[i] === "*" && src0[i + 1] === "*") { on = !on; i++; continue; }
      plain += src0[i];
      bold.push(on ? 1 : 0);
    }
    const n = plain.length, B = Uint8Array.from(bold), Q = ui_quoteMask(plain);
    UI_RICH_NAMES.lastIndex = 0;
    for (let m; (m = UI_RICH_NAMES.exec(plain)); ) if (!Q[m.index]) B.fill(1, m.index, m.index + m[0].length);
    for (let ps = 0; ps <= n; ) {   // the paragraphs' leads
      let pe = plain.indexOf("\n", ps);
      if (pe < 0) pe = n;
      let a = ps;
      while (a < pe && /[\s•–-]/.test(plain[a])) a++;
      let depth = 0, c = -1, len = 0;
      for (let k = a; k < pe && len <= 60; k++) {   // 60 letters outside the brackets (a bracket's words do not count, its quotes neither)
        const ch = plain[k];
        if (Q[k] && !depth) break;
        if (!depth) len++;
        if (ch === "(") depth++;
        else if (ch === ")") depth = Math.max(0, depth - 1);
        else if (!depth && (k + 1 >= pe || /\s/.test(plain[k + 1]))) {
          if (ch === ":") { c = k; break; }
          if (ch === "." || ch === ";" || ch === "?") break;   // a sentence ended first: no lead
        }
      }
      if (c > a && /[א-ת][^]*[א-ת]/.test(plain.slice(a, c))) B.fill(1, a, c + 1);
      ps = pe + 1;
    }
    const segs = [];
    let pos = 0;
    for (const r of ui_srcRuns(plain)) {
      const e = pos + r.t.length;
      if (r.s) { segs.push({ src: r }); pos = e; continue; }
      let k0 = pos;
      for (let k = pos; k <= e; k++) {
        if (k < e && plain[k] !== "\n" && B[k] === B[k0]) continue;
        if (k > k0) segs.push({ t: plain.slice(k0, k), b: !!B[k0] });
        if (k < e && plain[k] === "\n") { segs.push({ p: true }); k0 = k + 1; }
        else k0 = k;
      }
      pos = e;
    }
    return { plain, segs };
  }
  function ui_fillRich(el, text, link, fold) {
    el.textContent = "";
    el.__raw = String(text == null ? "" : text);
    const R = ui_richSegs(el.__raw);
    let p = document.createElement("span");
    p.className = "p";
    el.appendChild(p);
    for (const sg of R.segs) {
      if (sg.p) {
        p = document.createElement("span");
        p.className = "p";
        el.appendChild(p);
        continue;
      }
      if (sg.src) {
        let ln = null;
        if (typeof link === "function") {
          try { ln = link(sg.src, R.plain); } catch (_) { ln = null; }
        }
        if (ln) { p.appendChild(ln); continue; }
        const sp = document.createElement("span");
        sp.className = "tm-src";
        sp.textContent = sg.src.t;
        p.appendChild(sp);
        continue;
      }
      if (sg.b) {
        const b = document.createElement("b");
        b.textContent = sg.t;
        p.appendChild(b);
      } else p.appendChild(document.createTextNode(sg.t));
    }
    // FOLD_211 (stage ג, "קיצור כרטיסים ארוכים"; as Beit Rishon's 70-ui.js): a long card (over `fold` letters) shows its first paragraphs
    // and keeps the rest behind a button - none of its words or its sources is cut; the print (el.__raw) sees the whole of it
    // FOLD_MODEL_211 (the understandability review, U-23 / U-40 / U-52; the user, 15.11.2026 18:39: "21. א"): the fold hid the END of the
    // card - and the end is where every card says what in the model has no source ("במודל: ... בחירת מודל"). Now only the MIDDLE folds
    // (the commentators): the paragraphs that open "במודל" - or, in a card that has none, those that say "בחירת מודל" - always show,
    // under the button. The shown head never ends on a line that announces a list (":") nor in the middle of one ("•"). The button is
    // a full-width bar that says how much it hides (it looked like one more source chip).
    if (fold && el.__raw.length > fold) {
      const ps = [...el.children].filter((c) => c.classList && c.classList.contains("p"));
      const tx = (c) => c.textContent.trim();
      let acc = 0, k = -1;
      for (let i = 0; i < ps.length; i++) { acc += ps[i].textContent.length; if (i >= 1 && acc > fold * 0.5) { k = i; break; } }
      if (k >= 0) {
        while (k + 1 < ps.length && (/:$/.test(tx(ps[k])) || /^•/.test(tx(ps[k + 1])))) k++;
        const rest = ps.slice(k + 1);
        const isModel = (c) => /^במודל/.test(tx(c));
        const keep = new Set(ps.some(isModel) ? rest.filter(isModel) : rest.filter((c) => /בחיר(ת|ות) (ה)?מודל/.test(c.textContent)));
        rest.forEach((c, i) => { if (keep.has(c) && /:$/.test(tx(c))) for (let j = i + 1; j < rest.length && /^•/.test(tx(rest[j])); j++) keep.add(rest[j]); });
        const hide = rest.filter((c) => !keep.has(c)), nH = hide.filter(tx).length;
        if (hide.reduce((n, c) => n + c.textContent.length, 0) > 200) {
          for (const c of hide) c.style.display = "none";
          const bt = document.createElement("button");
          bt.className = "tm-more";
          bt.textContent = "▾ המשך הכרטיס — " + (nH === 1 ? "עוד פסקה אחת" : "עוד " + nH + " פסקאות");
          bt.onclick = (e) => { e.stopPropagation(); for (const c of hide) c.style.display = ""; bt.remove(); };
          el.insertBefore(bt, hide[0]);
        }
      }
    }
  }
  function ui_richHTML(text) {
    const esc = (t) => t.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
    return ui_richSegs(text).segs.map((sg) => (sg.p ? "<br>" : sg.src ? '<span class="tm-src">' + esc(sg.src.t) + "</span>" : sg.b ? "<b>" + esc(sg.t) + "</b>" : esc(sg.t))).join("");
  }
  // 1.1.0 (the user: "תסיר מקורות מעץ התפריט - שישארו רק בכרטיסים"): a label for the tree - the source brackets out (ui_srcRuns), the
  // dashes and spaces that led to them tidied; the full title stays on the item (the card, the presentation, the search)
  // 2.0.2 (the user: "הדגש דברים עיקריים במה חדש"): a line of "מה חדש" - plain text, and what stands between ** and ** in bold
  function ui_newsFill(el, text) {   // -> false: the line is not for this build ("@מאוחד ...": only inside the unified plugin "בית המקדש")
    let s0 = String(text == null ? "" : text);
    if (s0.indexOf("@מאוחד ") === 0) {
      if (!/^tm-house:/.test(window.name || "")) return false;
      s0 = s0.slice("@מאוחד ".length);
    }
    if (s0.indexOf("@גדול ") === 0) {   // 3.0.2 (the user, 18.11.2026: "תכתוב בבולד ובגדול"): a line in large letters, in a frame
      el.className = "big";
      s0 = s0.slice("@גדול ".length);
    }
    el.textContent = "";
    s0.split("**").forEach((t, i) => {
      if (!t) return;
      if (i % 2) {
        const b = document.createElement("b");
        b.textContent = t;
        el.appendChild(b);
      } else el.appendChild(document.createTextNode(t));
    });
    return true;
  }
  function ui_stripSrc(text) {
    const runs = ui_srcRuns(text);
    if (!runs.some((r) => r.s)) return String(text == null ? "" : text);
    let t = runs.filter((r) => !r.s).map((r) => r.t).join("");
    t = t.replace(/\s+/g, " ").replace(/\s*[—–-]\s*$/, "").replace(/^\s*[—–-]\s*/, "").replace(/\s+([,;:.])/g, "$1").replace(/[,;:]\s*$/, "").trim();
    return t || String(text);
  }
  function ui_smallSources(text) {   // 1.9.1: the presentation's text as the cards' - paragraphs, the leads and the names in bold
    return ui_richHTML(text);
  }
  // the label's text on a 2D canvas: the bracket in a clearly smaller font (28 of 48 px), so that a long label takes less of the view.
  // ui_labelText(c, text, font, fontSmall) measures and returns { w, draw(c, right, y) }, drawn from the right edge, right to left.
  function ui_labelText(c, text, font, fontSmall) {
    const runs = ui_srcRuns(text);
    let w = 0;
    for (const r of runs) {
      c.font = r.s ? fontSmall : font;
      r.w = c.measureText(r.t).width;
      w += r.w;
    }
    return {
      w,
      draw(c2, right, y) {
        c2.textAlign = "right";
        c2.textBaseline = "middle";
        c2.direction = "rtl";
        let x = right;
        for (const r of runs) {
          c2.font = r.s ? fontSmall : font;
          c2.fillStyle = "rgba(0,0,0,.85)";
          for (const o of [[-2, -2], [2, -2], [-2, 2], [2, 2]]) c2.fillText(r.t, x + o[0], y + o[1]);
          c2.fillStyle = "#f3dc9a";
          c2.fillText(r.t, x, y);
          x -= r.w;
        }
      }
    };
  }
  // 1.0.1-L (L.85; part5-house.md FOR-UI 3): the card of the ark's inside
  var UI_ARK_TXT = "מה שבתוך הארון. 'אין בארון רק שני לחות האבנים אשר הנח שם משה בחרב' (מלכים א ח, ט). בגמרא: 'מאי אין בארון רק? מיעוט אחר מיעוט; ואין מיעוט אחר מיעוט אלא לרבות – ספר תורה שמונח בארון' (בבא בתרא יד., דברי רבי מאיר). הלוחות 'ארכן ששה, ורחבן ששה, ועביין שלשה; מונחות כנגד ארכו של ארון', ו'נשתיירו שם שני טפחים, שבהן ספר תורה מונח'. 'מלמד שהלוחות ושברי לוחות מונחין בארון' (מנחות צט.) — רש״י: 'תחת הלוחות' (בבא בתרא יד:). 'מלמד, שהשם וכל כינויו מונחין בארון' (שם). רבי יהודה חולק: 'מצד הוא מונח, ולא בתוכו', על הארגז (שם יד.). רד״ק: 'זה ראייה כי לא היו בארון לא שברי לוחות ולא ס\"ת'. מחוץ לארון: העמודים, 'עמודין היכא הוו קיימי? מבראי' (שם יד:), ו'צנצנת המן, וצלוחית שמן המשחה, ומקלו של אהרן ושקדיה ופרחיה, וארגז ששגרו פלשתים' (יומא נב:). סידור הדברים וצורתם — כציור הספר; הצבע, לשון הדברות על הלוחות וגודל הכלים שמחוץ לארון — בחירת מודל.";
  function ui_makeLabelSprite(text, size) {
    const font = '600 48px "Segoe UI", Arial', fontSmall = '600 28px "Segoe UI", Arial';
    const pad = 26;
    const cv = document.createElement("canvas");
    let c = cv.getContext("2d");
    const lt = ui_labelText(c, text, font, fontSmall);
    const tw = Math.max(8, Math.ceil(lt.w));
    cv.width = tw + pad * 2;
    cv.height = 48 + pad * 2;
    c = cv.getContext("2d");
    lt.draw(c, cv.width - pad, cv.height / 2);
    const tex = new CanvasTexture(cv);
    tex.colorSpace = SRGBColorSpace;
    tex.anisotropy = 4;
    const spr = new Sprite(new SpriteMaterial({ map: tex, transparent: true, depthTest: true, depthWrite: false }));
    const hAmot = (size || 4) * cv.height / 48;
    spr.scale.set(hAmot * cv.width / cv.height, hAmot, 1);
    return spr;
  }
  // General view (SPEC 9.2). Camera positions are world coordinates in amot (x east, z south, y up).
  var ui_GENERAL = { pos: [430, 190, 240], target: [0, 30, 0] };   // Beit Sheni: the whole mount from the south-east
  // Fallback fly points (kept in step with the modules' registrations of 1.0.1-K; used only when a module did not register
  // ctx.shared.flyPoints[key]): the bases row x 27 = CO.mechX; the interior ones are cameras inside the CLOSED house (55-interior.js, K.5).
  // 1.0.1-L: the fallbacks follow the round-L fly points of the modules (heichal.json, heichal-door.md, interior.md, 45-vessels.js):
  // heichalFront from the south-east above (L.41), ulamInside from the FRONT (L.44), yatziaSection square-on (L.43), yachinBoazFull and boazFar
  // far and off the axis (L.45 / L.58, verify-heichal.md), the interior cameras after the vessels' new places (L.69-L.73), mechonot over the block of bases (L.77)
  // 1.2.0 (the user): Baraita d'Melechet HaMishkan ch. 7, as he sent it - the staffs (a), where the ark was hidden (b), the wall and doors of
  // the First Temple's holy of holies against the two curtains of the Second (c); on the cards of the ark, the foundation stone and the traksin
  var ui_FP = {};   // Beit Sheni: every view's camera is registered by its module (ctx.shared.flyPoints)
  // 1.9.1 (the user: "תראה מה קרה לטבעות ומה קרה לספלי הניסוך (קורה כשהמזבח בשיטות אחרות)"): the views of the altar's parts were written
  // for its place by the Mishnah (ctx.shared.altarPlace "middot", centre z 9) and its 32 amot; they follow the place now chosen and, for
  // R. Yose's first altar of 28 (ctx.shared.altarMeasures "yose"), the part's own shift in 40-altar.js: the body and its top 2 east and 2
  // north (its north-east corner fixed), the ramps 2 east and 4 north, the libation bowls 4 east and 4 north
  // SFALIM_303: the place "ספלי הניסוך" - the target between the bowls and the shitin, the eye high in the south-south-west (the floor in
  // front of the corner stays whole: the hollow is seen down through the glass top and the glass floor)
  var SFALIM_TG = [43.5, 18.0, 22.4], SFALIM_CAM = [40.0, 34.5, 31.0];
  function ui_altarCam(ctx, p, part) {
    const P = ctx && ctx.shared ? ctx.shared.altarPlace : null, M = ctx && ctx.shared ? ctx.shared.altarMeasures : null;
    const dz = P && P.dz && P.dz[P.current] != null && P.dz.middot != null ? P.dz[P.current] - P.dz.middot : 0;
    const sh = M && M.mode === "yose" ? ({ body: [2, -2], ramp: [2, -4], cups: [4, -4] }[part] || [0, 0]) : [0, 0];
    return [p[0] + sh[0], p[1], p[2] + dz + sh[1]];
  }
  // Views grid (SPEC 9.2). layer -> that layer is switched on before flying; yam -> seaPlacement.flyPoint(). 1.0.1-K: no view opens
  // anything (the flag interior stays as data: the camera is inside the closed house); "הר הבית" and "השער המזרחי" left the grid (the
  // user: "במבט כללי כפתור הר הבית ושער המזרחי מיותרים הם נמצאים כבר בהר הבית") - they are places of "הר הבית והחצרות".
  var ui_VIEWS = [
    { key: "__general", label: "מבט כללי" },
    { key: "harHabayit", label: "הר הבית" },
    { key: "shushanGate", label: "שער שושן" },
    { key: "royalStoa", label: "הסטיו המלכותי" },
    { key: "ezratNashim", label: "עזרת נשים" },
    { key: "nikanor", label: "שער ניקנור" },
    { key: "azarah", label: "העזרה" },
    { key: "mizbeach", label: "המזבח" },
    { key: "heichalFront", label: "ההיכל מבחוץ" },
    { key: "ulam", label: "האולם", interior: true },
    { key: "kodesh", label: "הקודש", interior: true },
    { key: "kodeshHakodashim", label: "קודש הקדשים", interior: true }
  ];
  // ===== deep links into Otzaria (Beit Sheni, 1.1.0/1.2.0): OTZ_BOOKS - one table per book: the Mishnah and the Rambam by chapter
  // (line = base[chapter] + n; n 0 = the chapter's heading), the Talmud by amud (the first line of each amud; `start` = amudim before
  // the first one listed, Tamid begins at 25b). Verified in seforim.db (DEV_NOTES "קישורים לאוצריא"). ui_BASE / ui_PAGES below are
  // derived from it for the bracket parser (ui_srcParse) and the helpers ui_V / ui_P / ui_MI / ui_RB / ui_MN. =====
  var OTZ_BOOKS = {
    "Mishnah_Middot": { book: 89, he: "משנה מידות", base: {1:1,2:11,3:18,4:27,5:35}, count: {1:9,2:6,3:8,4:7,5:4} },
    "Mishnah_Tamid": { book: 88, he: "משנה תמיד", base: {1:1,2:6,3:12,4:22,5:26,6:33,7:37}, count: {1:4,2:5,3:9,4:3,5:6,6:3,7:4} },
    "Mishnah_Sanhedrin": { book: 73, he: "משנה סנהדרין", base: {1:1,2:8,3:14,4:23,5:29,6:35,7:42,8:54,9:62,10:69,11:76}, count: {1:6,2:5,3:8,4:5,5:5,6:6,7:11,8:7,9:6,10:6,11:6} },
    "Mishnah_Shekalim": { book: 54, he: "משנה שקלים", base: {1:1,2:9,3:15,4:20,5:30,6:37,7:44,8:52}, count: {1:7,2:5,3:4,4:9,5:6,6:6,7:7,8:8} },
    "Mishnah_Yoma": { book: 55, he: "משנה יומא", base: {1:1,2:10,3:18,4:30,5:37,6:45,7:54,8:60}, count: {1:8,2:7,3:11,4:6,5:7,6:8,7:5,8:9} },
    "Mishnah_Sukkah": { book: 56, he: "משנה סוכה", base: {1:1,2:13,3:23,4:39,5:50}, count: {1:11,2:9,3:15,4:10,5:8} },
    "Mishnah_Zevachim": { book: 80, he: "משנה זבחים", base: {1:1,2:6,3:12,4:19,5:26,6:35,7:43,8:50,9:63,10:71,11:80,12:89,13:96,14:105}, count: {1:4,2:5,3:6,4:6,5:8,6:7,7:6,8:12,9:7,10:8,11:8,12:6,13:8,14:10} },
    "Mishnah_Menachot": { book: 81, he: "משנה מנחות", base: {1:1,2:6,3:12,4:20,5:26,6:36,7:44,8:51,9:59,10:69,11:79,12:89,13:95}, count: {1:4,2:5,3:7,4:5,5:9,6:7,7:6,8:7,9:9,10:9,11:9,12:5,13:11} },
    "Mishnah_Kelim": { book: 91, he: "משנה כלים", base: {1:1,2:11,3:20,4:29,5:34,6:46,7:51,8:58,9:70,10:79,11:88,12:98,13:107,14:116,15:125,16:132,17:141,18:159,19:169,20:180,21:188,22:192,23:203,24:209,25:227,26:237,27:247,28:260,29:271,30:280}, count: {1:9,2:8,3:8,4:4,5:11,6:4,7:6,8:11,9:8,10:8,11:9,12:8,13:8,14:8,15:6,16:8,17:17,18:9,19:10,20:7,21:3,22:10,23:5,24:17,25:9,26:9,27:12,28:10,29:8,30:4} },
    "Mishnah_Parah": { book: 94, he: "משנה פרה", base: {1:1,2:6,3:12,4:24,5:29,6:39,7:45,8:58,9:70,10:80,11:87,12:97}, count: {1:4,2:5,3:11,4:4,5:9,6:5,7:12,8:11,9:9,10:6,11:9,12:11} },
    "Mishneh_Torah,_The_Chosen_Temple": { book: 337, he: "רמב\"ם הלכות בית הבחירה", base: {1:2,2:23,3:42,4:61,5:75,6:93,7:110,8:134}, count: {1:20,2:18,3:18,4:13,5:17,6:16,7:23,8:12} },
    "Mishneh_Torah,_Daily_Offerings_and_Additional_Offerings": { book: 344, he: "רמב\"ם הלכות תמידין ומוספין", base: {1:2,2:15,3:31,4:54,5:69,6:86,7:98,8:124,9:145,10:159}, count: {1:12,2:15,3:22,4:14,5:16,6:11,7:25,8:20,9:13,10:20} },
    "Mishneh_Torah,_Vessels_of_the_Sanctuary_and_Those_who_Serve_Therein": { book: 338, he: "רמב\"ם הלכות כלי המקדש", base: {1:2,2:22,3:36,4:48,5:71,6:89,7:101,8:122,9:142,10:154}, count: {1:19,2:13,3:11,4:22,5:17,6:11,7:20,8:19,9:11,10:13} },
    "Yoma": { book: 107, he: "יומא", start: 0, amud: [2,13,26,33,49,61,76,90,100,116,126,137,144,160,170,177,196,214,222,237,253,265,280,293,302,314,324,341,349,360,365,370,377,395,403,417,434,440,452,462,478,492,514,531,547,558,577,590,607,623,640,654,666,678,695,705,713,723,736,743,754,765,780,793,807,820,829,834,850,860,874,892,899,916,933,951,972,988,1001,1017,1040,1055,1069,1084,1103,1115,1133,1149,1161,1176,1188,1208,1222,1235,1240,1261,1271,1288,1304,1312,1323,1334,1353,1379,1397,1416,1424,1444,1451,1453,1470,1486,1502,1514,1530,1550,1555,1568,1577,1596,1607,1619,1640,1659,1673,1690,1698,1714,1723,1739,1760,1773,1790,1801,1822,1839,1861,1885,1898,1918,1934,1948,1970,1990,2011,2021,2038,2060,2078,2094,2107,2122,2140,2155,2168,2172,2184,2201,2212,2235,2247,2261,2265,2283,2303,2315,2332,2348,2363,2380,2400,2418,2433] },
    "Zevachim": { book: 130, he: "זבחים", start: 0, amud: [2,13,33,51,71,99,128,146,166,185,199,218,245,268,286,311,340,363,398,427,460,480,503,525,548,570,592,611,626,645,664,675,683,695,716,743,767,785,803,814,828,845,862,874,886,904,922,936,957,980,993,1009,1026,1046,1062,1077,1095,1111,1129,1146,1161,1174,1188,1199,1208,1226,1246,1265,1287,1306,1327,1341,1358,1375,1391,1406,1412,1428,1440,1452,1469,1478,1491,1501,1519,1542,1560,1578,1596,1613,1632,1647,1654,1678,1707,1725,1750,1769,1783,1805,1809,1825,1844,1859,1869,1881,1893,1914,1927,1942,1956,1978,1991,2006,2023,2043,2054,2070,2086,2089,2101,2116,2133,2154,2166,2177,2197,2219,2230,2241,2258,2272,2288,2297,2314,2338,2356,2379,2395,2397,2412,2417,2423,2433,2443,2460,2479,2487,2506,2518,2528,2543,2554,2563,2575,2582,2595,2611,2624,2635,2653,2676,2697,2717,2735,2751,2763,2780,2799,2815,2823,2837,2850,2867,2883,2895,2927,2947,2962,2984,3001,3014,3035,3053,3074,3089,3106,3114,3129,3134,3153,3175,3188,3202,3213,3234,3254,3267,3287,3306,3326,3351,3379,3400,3419,3440,3459,3476,3494,3512,3532,3553,3580,3605,3627,3642,3662,3691,3701,3720,3739,3755,3772,3790,3814,3829,3843,3863,3882,3910,3930,3941,3952,3971,3994,4008,4035,4053] },
    "Sukkah": { book: 108, he: "סוכה", start: 0, amud: [2,17,37,52,66,82,100,114,130,143,161,181,203,214,225,239,253,269,284,300,317,332,340,355,368,385,401,417,423,435,449,461,476,493,498,515,530,542,557,565,579,590,601,613,619,631,647,659,670,686,697,712,727,741,752,768,776,785,791,810,826,841,864,882,900,915,925,939,955,966,978,988,999,1010,1019,1026,1034,1044,1057,1069,1084,1097,1108,1122,1138,1150,1161,1169,1183,1197,1212,1225,1237,1247,1260,1265,1280,1287,1296,1314,1328,1342,1360,1374,1388,1400,1414,1426,1443,1463] },
    "Menachot": { book: 131, he: "מנחות", start: 0, amud: [2,10,32,53,74,96,110,128,154,178,203,219,242,261,280,295,317,337,346,371,385,400,419,431,451,467,490,507,524,542,573,595,606,619,635,658,673,698,704,724,742,752,761,781,805,823,840,852,875,898,919,951,971,991,1009,1029,1047,1066,1084,1095,1106,1119,1131,1142,1158,1176,1188,1204,1215,1225,1237,1246,1264,1274,1289,1302,1318,1328,1342,1364,1382,1406,1423,1446,1465,1486,1501,1524,1550,1568,1595,1612,1634,1655,1671,1697,1710,1731,1754,1778,1801,1824,1840,1861,1880,1896,1909,1922,1943,1964,1974,1991,2011,2030,2037,2067,2091,2105,2129,2146,2159,2181,2192,2210,2227,2248,2261,2274,2288,2308,2324,2338,2347,2366,2393,2410,2422,2440,2457,2475,2489,2506,2535,2552,2573,2596,2610,2629,2641,2664,2680,2693,2719,2735,2760,2781,2798,2813,2828,2841,2860,2875,2890,2906,2927,2942,2964,2978,2998,3028,3043,3069,3093,3115,3136,3157,3177,3197,3213,3242,3267,3286,3308,3326,3347,3364,3372,3391,3407,3430,3444,3458,3478,3501,3524,3539,3561,3581,3596,3614,3639,3657,3679,3695,3718,3734,3757,3780,3790,3814,3837,3859,3879,3902,3930,3955,3977] },
    "Pesachim": { book: 106, he: "פסחים", start: 0, amud: [2,12,28,43,58,71,82,103,122,140,158,175,195,214,232,244,260,276,297,319,336,349,368,386,403,420,433,447,466,484,495,516,532,546,564,574,589,603,628,644,656,667,683,701,715,732,745,759,771,790,803,816,829,841,855,870,885,895,909,921,933,947,961,974,983,993,1007,1023,1044,1064,1081,1100,1112,1129,1143,1161,1178,1198,1216,1239,1260,1282,1303,1331,1347,1362,1381,1399,1424,1439,1451,1460,1475,1494,1511,1534,1553,1577,1590,1603,1612,1623,1635,1650,1665,1683,1700,1717,1733,1747,1758,1770,1774,1788,1803,1823,1839,1854,1868,1880,1892,1907,1925,1935,1951,1968,1988,2001,2015,2029,2043,2060,2074,2094,2109,2125,2141,2160,2173,2190,2205,2221,2249,2264,2281,2292,2306,2327,2340,2357,2372,2392,2414,2436,2459,2483,2504,2527,2547,2563,2587,2603,2622,2637,2652,2669,2691,2711,2724,2742,2756,2771,2795,2814,2839,2864,2881,2904,2932,2949,2967,2985,2997,3011,3029,3043,3057,3073,3092,3118,3138,3149,3158,3172,3188,3194,3201,3212,3218,3229,3240,3249,3258,3269,3278,3291,3297,3309,3316,3330,3335,3350,3358,3373,3382,3390,3397,3412,3428,3445,3459,3474,3492,3506,3525,3536,3549,3559,3570,3584,3598,3623,3645,3667,3688,3704,3718,3734,3750,3757] },
    "Tamid": { book: 138, he: "תמיד (בבלי)", start: 47, amud: [2,6,17,28,47,66,81,92,106,117,128,144,154,170,185,198,213] },
    "Sanhedrin": { book: 125, he: "סנהדרין", start: 0, amud: [2,19,29,41,59,75,93,107,122,133,149,169,189,205,213,220,230,244,257,272,283,297,313,325,338,356,371,387,401,423,442,465,477,492,507,525,547,564,585,610,636,659,683,712,734,762,785,805,830,858,889,911,932,965,994,1032,1055,1089,1116,1146,1168,1186,1205,1223,1240,1259,1281,1295,1309,1326,1339,1356,1371,1390,1413,1430,1453,1469,1491,1520,1533,1554,1571,1598,1610,1631,1646,1662,1688,1706,1731,1752,1772,1795,1815,1833,1852,1878,1903,1934,1958,1986,2013,2035,2052,2084,2108,2128,2144,2169,2196,2221,2245,2260,2287,2306,2332,2358,2379,2397,2423,2452,2469,2499,2523,2544,2567,2592,2613,2641,2661,2685,2708,2722,2733,2750,2771,2794,2812,2836,2859,2877,2897,2912,2928,2952,2963,2984,3003,3031,3049,3058,3075,3095,3111,3123,3138,3146,3157,3172,3193,3209,3229,3245,3265,3284,3304,3323,3348,3369,3390,3407,3425,3445,3465,3489,3512,3532,3554,3572,3591,3616,3633,3653,3672,3690,3711,3728,3745,3761,3777,3792,3810,3832,3850,3874,3894,3913,3929,3947,3963,3982,4003,4020,4039,4056,4072,4090,4111,4129,4152,4171,4191,4215,4238,4256,4273,4291,4306,4320,4340,4359,4375,4392] },
    "Shabbat": { book: 104, he: "שבת", start: 0, amud: [2,10,28,35,49,63,75,94,106,123,136,146,157,167,183,191,200,214,223,235,249,262,271,283,294,304,312,323,333,338,349,360,368,377,386,400,407,417,433,446,460,469,478,490,499,507,517,525,533,543,550,563,573,582,595,605,618,628,641,655,666,677,687,702,713,725,732,742,752,759,766,778,788,799,812,821,828,839,852,863,867,876,886,901,910,921,925,935,947,956,967,975,988,1002,1014,1029,1045,1065,1084,1098,1117,1135,1156,1172,1197,1219,1241,1260,1281,1298,1319,1337,1356,1376,1391,1401,1421,1435,1458,1477,1489,1511,1535,1564,1586,1610,1629,1647,1658,1677,1702,1721,1739,1749,1757,1767,1778,1786,1792,1801,1809,1814,1822,1832,1843,1851,1862,1870,1881,1891,1900,1908,1922,1932,1941,1952,1960,1973,1983,1994,2001,2015,2020,2027,2038,2044,2050,2055,2061,2069,2075,2085,2093,2103,2112,2120,2130,2142,2151,2159,2171,2181,2194,2203,2212,2218,2230,2239,2245,2252,2273,2295,2309,2315,2327,2335,2350,2362,2374,2380,2389,2403,2414,2428,2446,2460,2472,2488,2501,2509,2522,2530,2543,2557,2571,2582,2594,2603,2611,2621,2631,2643,2655,2670,2685,2698,2707,2715,2723,2735,2745,2753,2765,2774,2789,2799,2811,2822,2838,2847,2859,2871,2890,2909,2926,2947,2971,2988,3003,3011,3030,3046,3068,3090,3115,3140,3159,3178,3188,3198,3217,3243,3260,3281,3300,3317,3341,3355,3370,3391,3397,3427,3447,3464,3482,3505,3525,3550,3576,3597,3626,3647,3668,3684,3693,3698,3714,3730,3747,3760,3776,3790,3808,3817,3837,3852,3868,3882,3896,3908,3926,3943,3957,3975,3991,3999,4017,4031,4048,4063,4074,4088] },
    "Eruvin": { book: 105, he: "עירובין", start: 0, amud: [2,17,34,62,85,100,121,137,149,162,178,196,201,222,242,261,276,294,315,335,364,389,409,431,449,473,494,515,538,557,587,610,631,660,679,703,734,754,777,797,823,852,875,892,910,931,942,969,981,997,1018,1034,1053,1068,1093,1113,1129,1151,1171,1184,1205,1222,1233,1242,1252,1260,1279,1300,1314,1333,1347,1354,1376,1392,1415,1429,1442,1460,1480,1493,1524,1540,1562,1582,1602,1618,1635,1663,1686,1707,1724,1751,1769,1795,1805,1831,1846,1862,1879,1898,1913,1931,1948,1973,1999,2027,2053,2067,2091,2103,2116,2135,2152,2169,2183,2195,2211,2233,2245,2269,2284,2300,2314,2341,2357,2370,2392,2414,2436,2446,2463,2478,2498,2514,2533,2545,2567,2589,2603,2624,2637,2646,2665,2684,2703,2712,2720,2741,2758,2776,2792,2811,2822,2845,2865,2884,2903,2929,2949,2968,2990,3010,3035,3055,3069,3087,3095,3104,3124,3141,3156,3176,3198,3219,3243,3261,3275,3287,3298,3312,3326,3340,3351,3369,3384,3410,3427,3451,3474,3489,3506,3524,3546,3564,3581,3604,3628,3652,3683,3699,3715,3736,3756,3779,3797,3824,3842] },
    "Bava_Batra": { book: 124, he: "בבא בתרא", start: 0, amud: [2,9,27,52,69,87,105,113,121,136,150,165,182,201,220,236,249,266,281,296,309,325,340,348,361,377,390,408,426,448,467,478,495,511,521,541,555,570,587,601,614,629,643,655,664,679,699,715,731,745,757,765,790,798,813,832,844,851,861,872,884,892,902,908,917,922,926,930,938,953,962,968,976,984,993,1002,1010,1017,1026,1037,1049,1059,1067,1082,1089,1098,1110,1120,1130,1140,1151,1160,1168,1179,1189,1198,1204,1216,1227,1240,1249,1259,1270,1279,1290,1299,1305,1316,1323,1334,1344,1353,1367,1382,1392,1405,1417,1431,1454,1462,1475,1482,1496,1504,1511,1520,1532,1544,1553,1562,1569,1579,1587,1598,1609,1625,1633,1643,1652,1663,1669,1674,1688,1700,1712,1721,1735,1754,1771,1779,1789,1794,1803,1815,1832,1846,1854,1862,1881,1892,1901,1911,1928,1941,1950,1959,1974,1981,1992,2002,2010,2021,2031,2045,2058,2075,2087,2097,2108,2126,2145,2152,2164,2177,2193,2208,2222,2235,2251,2262,2270,2284,2297,2311,2327,2337,2349,2361,2372,2381,2390,2397,2408,2420,2427,2438,2448,2457,2463,2470,2480,2490,2500,2506,2513,2523,2537,2546,2559,2572,2588,2603,2607,2617,2623,2628,2633,2644,2651,2668,2673,2679,2685,2693,2707,2716,2730,2742,2752,2762,2775,2788,2804,2826,2839,2849,2867,2874,2882,2893,2908,2922,2941,2953,2965,2979,2991,3003,3017,3031,3043,3056,3066,3076,3090,3104,3120,3132,3146,3162,3175,3191,3203,3215,3230,3252,3263,3271,3281,3292,3306,3314,3325,3340,3351,3361,3375,3391,3404,3418,3426,3443,3450,3456,3475,3482,3487,3497,3511,3524,3537,3545,3554,3567,3575,3587,3601,3606,3619,3630,3641,3653,3665,3668,3676,3689,3706,3711,3730,3740,3746,3750,3758,3770,3779,3792,3809,3823,3846,3854,3863,3872,3889,3907,3918,3929,3946,3965,3971,3982,4000,4015,4024,4048,4067,4083,4104,4115,4134,4152] },
    "Chagigah": { book: 114, he: "חגיגה", start: 0, amud: [2,11,20,40,55,69,82,101,126,144,160,178,189,200,219,238,256,274,292,309,334,355,371,386,401,420,431,445,462,481,501,512,524,536,549,572,579,598,610,615,620,640,661,678,689,700,715,728,747,766,778] },
    "Arakhin": { book: 134, he: "ערכין", start: 0, amud: [2,20,39,57,75,96,125,147,168,185,204,226,251,266,284,291,308,323,342,363,387,404,416,428,450,471,497,519,547,571,596,617,635,654,670,685,705,738,749,765,783,811,825,841,857,876,889,907,930,947,969,987,1009,1027,1042,1067,1081,1102,1126,1140,1160,1174,1193,1215,1240] }
  };
  // 1.7.0 (stage 4): the commentaries on the Mishnah, by (chapter, mishnah) -> the first line of that mishnah in the book (tools/cm_links.json,
  // from the exports: the <h3> heading of the mishnah in the Bartenura and the Tosafot Yom Tov, the first se'if of the mishnah in the Yachin
  // (aligned by the dibbur ha-matchil), the chapter's note in the Boaz). Opened like the Mishnah: book id + line index.
  var OTZ_CM = {"89": {"1,1": 2, "1,2": 3, "1,3": 4, "1,4": 5, "1,5": 6, "1,6": 7, "1,7": 8, "1,8": 9, "1,9": 10, "2,1": 12, "2,2": 13, "2,3": 14, "2,4": 15, "2,5": 16, "2,6": 17, "3,1": 19, "3,2": 20, "3,3": 21, "3,4": 22, "3,5": 23, "3,6": 24, "3,7": 25, "3,8": 26, "4,1": 28, "4,2": 29, "4,3": 30, "4,4": 31, "4,5": 32, "4,6": 33, "4,7": 34, "5,1": 36, "5,2": 37, "5,3": 38, "5,4": 39}, "643": {"1,1": 3, "1,2": 12, "1,3": 14, "1,4": 21, "1,5": 28, "1,6": 33, "1,7": 41, "1,8": 46, "1,9": 53, "2,1": 60, "2,2": 63, "2,3": 68, "2,4": 81, "2,5": 86, "2,6": 98, "3,1": 108, "3,2": 124, "3,3": 129, "3,4": 136, "3,5": 143, "3,6": 151, "3,7": 159, "3,8": 165, "4,1": 171, "4,2": 176, "4,3": 180, "4,4": 184, "4,5": 186, "4,6": 191, "4,7": 199, "5,1": 208, "5,3": 216, "5,4": 220}, "948": {"1,1": 14, "1,2": 24, "1,3": 28, "1,4": 35, "1,5": 41, "1,6": 43, "1,7": 49, "1,8": 51, "1,9": 53, "2,1": 61, "2,2": 65, "2,3": 67, "2,4": 76, "2,5": 79, "2,6": 89, "3,1": 101, "3,2": 115, "3,3": 118, "3,4": 123, "3,5": 126, "3,6": 134, "3,7": 138, "3,8": 140, "4,1": 149, "4,2": 153, "4,3": 156, "4,4": 160, "4,5": 163, "4,6": 171, "4,7": 178, "5,1": 185, "5,2": 188, "5,3": 193, "5,4": 200}, "819": {"1,1": 3, "1,2": 25, "1,3": 47, "1,4": 65, "1,5": 77, "1,6": 89, "1,7": 103, "1,8": 109, "1,9": 123, "2,1": 146, "2,2": 158, "2,3": 176, "2,4": 208, "2,5": 218, "2,6": 260, "3,1": 313, "3,2": 354, "3,3": 366, "3,4": 380, "3,5": 412, "3,6": 432, "3,7": 440, "3,8": 456, "4,1": 479, "4,2": 505, "4,3": 521, "4,4": 535, "4,5": 551, "4,6": 577, "4,7": 595, "5,1": 626, "5,2": 644, "5,3": 658, "5,4": 672}, "1329": {"1,1": 3, "1,2": 4, "1,3": 5, "1,4": 6, "1,5": 7, "2,1": 9, "2,2": 10, "2,3": 11, "3,1": 13, "3,2": 14, "3,3": 15, "3,4": 16, "3,5": 17, "3,6": 18, "4,1": 20, "4,2": 21, "4,3": 22, "4,4": 23, "5,1": 25, "5,2": 26, "5,3": 27, "5,4": 28}, "88": {"1,1": 2, "1,2": 3, "1,3": 4, "1,4": 5, "2,1": 7, "2,2": 8, "2,3": 9, "2,4": 10, "2,5": 11, "3,1": 13, "3,2": 14, "3,3": 15, "3,4": 16, "3,5": 17, "3,6": 18, "3,7": 19, "3,8": 20, "3,9": 21, "4,1": 23, "4,2": 24, "4,3": 25, "5,1": 27, "5,2": 28, "5,3": 29, "5,4": 30, "5,5": 31, "5,6": 32, "6,1": 34, "6,2": 35, "6,3": 36, "7,1": 38, "7,2": 39, "7,3": 40, "7,4": 41}, "634": {"1,1": 3, "1,2": 23, "1,3": 29, "1,4": 32, "2,1": 39, "2,2": 45, "2,3": 51, "2,4": 56, "2,5": 61, "3,1": 69, "3,2": 78, "3,3": 84, "3,4": 88, "3,5": 93, "3,6": 100, "3,7": 107, "3,8": 113, "3,9": 121, "4,1": 133, "4,2": 141, "4,3": 151, "5,1": 163, "5,2": 168, "5,3": 172, "5,4": 176, "5,5": 181, "5,6": 192, "6,1": 200, "6,2": 207, "6,3": 211, "7,1": 219, "7,2": 223, "7,3": 233, "7,4": 245}, "944": {"1,1": 5, "1,2": 25, "1,3": 30, "1,4": 36, "2,1": 52, "2,2": 60, "2,3": 64, "2,4": 68, "2,5": 74, "3,1": 82, "3,2": 87, "3,3": 89, "3,4": 95, "3,5": 98, "3,6": 101, "3,7": 103, "3,8": 106, "3,9": 111, "4,1": 118, "4,2": 128, "4,3": 139, "5,1": 162, "5,2": 167, "5,3": 171, "5,4": 176, "5,5": 181, "5,6": 187, "6,1": 193, "6,2": 198, "6,3": 200, "7,1": 205, "7,2": 210, "7,3": 218, "7,4": 229}, "818": {"1,1": 3, "1,2": 57, "1,3": 77, "1,4": 97, "2,1": 132, "2,2": 148, "2,3": 162, "2,4": 178, "2,5": 190, "3,1": 209, "3,2": 235, "3,3": 243, "3,4": 257, "3,5": 267, "3,6": 289, "3,7": 305, "3,8": 325, "3,9": 345, "4,1": 374, "4,2": 392, "4,3": 428, "5,1": 501, "5,2": 521, "5,3": 527, "5,4": 535, "5,5": 547, "5,6": 573, "6,1": 588, "6,2": 602, "6,3": 606, "7,1": 631, "7,2": 643, "7,3": 671, "7,4": 719}, "1330": {"1,1": 3, "1,2": 4, "1,3": 5, "3,1": 7, "3,2": 8, "3,3": 9, "3,4": 10, "3,5": 11, "4,1": 13, "5,1": 15, "5,2": 16, "5,3": 17, "7,1": 19}, "54": {"1,1": 2, "1,2": 3, "1,3": 4, "1,4": 5, "1,5": 6, "1,6": 7, "1,7": 8, "2,1": 10, "2,2": 11, "2,3": 12, "2,4": 13, "2,5": 14, "3,1": 16, "3,2": 17, "3,3": 18, "3,4": 19, "4,1": 21, "4,2": 22, "4,3": 23, "4,4": 24, "4,5": 25, "4,6": 26, "4,7": 27, "4,8": 28, "4,9": 29, "5,1": 31, "5,2": 32, "5,3": 33, "5,4": 34, "5,5": 35, "5,6": 36, "6,1": 38, "6,2": 39, "6,3": 40, "6,4": 41, "6,5": 42, "6,6": 43, "7,1": 45, "7,2": 46, "7,3": 47, "7,4": 48, "7,5": 49, "7,6": 50, "7,7": 51, "8,1": 53, "8,2": 54, "8,3": 55, "8,4": 56, "8,5": 57, "8,6": 58, "8,7": 59, "8,8": 60}, "593": {"1,1": 3, "1,2": 13, "1,3": 16, "1,4": 27, "1,5": 31, "1,6": 36, "1,7": 44, "2,1": 54, "2,2": 63, "2,3": 69, "2,4": 75, "2,5": 82, "3,1": 94, "3,2": 99, "3,3": 105, "3,4": 108, "4,1": 113, "4,2": 119, "4,3": 129, "4,4": 134, "4,5": 145, "4,6": 152, "4,7": 157, "4,8": 161, "4,9": 165, "5,1": 172, "5,2": 190, "5,3": 194, "5,4": 200, "5,5": 204, "5,6": 208, "6,1": 212, "6,2": 217, "6,3": 221, "6,4": 232, "6,5": 238, "6,6": 244, "7,1": 249, "7,2": 254, "7,3": 259, "7,4": 269, "7,5": 274, "7,6": 277, "7,7": 284, "8,1": 290, "8,2": 294, "8,3": 300, "8,4": 310, "8,5": 317, "8,6": 323, "8,7": 327, "8,8": 329}, "893": {"1,1": 5, "1,2": 11, "1,3": 13, "1,4": 21, "1,5": 24, "1,6": 28, "1,7": 34, "2,1": 39, "2,2": 46, "2,3": 49, "2,4": 51, "2,5": 54, "3,1": 59, "3,2": 65, "3,3": 70, "3,4": 72, "4,1": 76, "4,2": 81, "4,3": 85, "4,4": 87, "4,5": 91, "4,6": 96, "4,8": 101, "4,9": 104, "5,1": 113, "5,2": 121, "5,3": 125, "5,4": 130, "5,5": 132, "5,6": 134, "6,1": 137, "6,2": 139, "6,3": 142, "6,4": 150, "6,5": 154, "6,6": 160, "7,1": 164, "7,2": 168, "7,3": 172, "7,4": 177, "7,5": 181, "7,6": 184, "7,7": 194, "8,1": 199, "8,2": 202, "8,3": 208, "8,4": 215, "8,5": 219, "8,7": 224, "8,8": 226}, "768": {"1,1": 3, "1,2": 19, "1,3": 27, "1,4": 45, "1,5": 51, "1,6": 59, "1,7": 83, "2,1": 98, "2,2": 116, "2,3": 132, "2,4": 144, "2,5": 156, "3,1": 183, "3,2": 195, "3,3": 209, "3,4": 213, "4,1": 228, "4,2": 238, "4,3": 254, "4,4": 262, "4,5": 280, "4,6": 298, "4,7": 312, "4,8": 328, "4,9": 336, "5,1": 351, "5,2": 385, "5,3": 395, "5,4": 415, "5,5": 423, "5,6": 431, "6,1": 434, "6,2": 442, "6,3": 450, "6,4": 480, "6,5": 492, "6,6": 510, "7,1": 525, "7,2": 539, "7,3": 551, "7,4": 571, "7,5": 581, "7,6": 587, "7,7": 603, "8,1": 616, "8,2": 626, "8,3": 636, "8,4": 658, "8,5": 674, "8,6": 686, "8,7": 694, "8,8": 696}, "1279": {"2,1": 3, "2,2": 4, "2,3": 5, "4,1": 7, "5,1": 9, "5,2": 10, "6,1": 12, "7,1": 14, "7,2": 15, "7,3": 16, "8,1": 18, "8,2": 19, "8,3": 20, "8,4": 21}, "55": {"1,1": 2, "1,2": 3, "1,3": 4, "1,4": 5, "1,5": 6, "1,6": 7, "1,7": 8, "1,8": 9, "2,1": 11, "2,2": 12, "2,3": 13, "2,4": 14, "2,5": 15, "2,6": 16, "2,7": 17, "3,1": 19, "3,2": 20, "3,3": 21, "3,4": 22, "3,5": 23, "3,6": 24, "3,7": 25, "3,8": 26, "3,9": 27, "3,10": 28, "3,11": 29, "4,1": 31, "4,2": 32, "4,3": 33, "4,4": 34, "4,5": 35, "4,6": 36, "5,1": 38, "5,2": 39, "5,3": 40, "5,4": 41, "5,5": 42, "5,6": 43, "5,7": 44, "6,1": 46, "6,2": 47, "6,3": 48, "6,4": 49, "6,5": 50, "6,6": 51, "6,7": 52, "6,8": 53, "7,1": 55, "7,2": 56, "7,3": 57, "7,4": 58, "7,5": 59, "8,1": 61, "8,2": 62, "8,3": 63, "8,4": 64, "8,5": 65, "8,6": 66, "8,7": 67, "8,8": 68, "8,9": 69}, "582": {"1,1": 3, "1,2": 8, "1,3": 14, "1,4": 20, "1,5": 22, "1,6": 29, "1,7": 32, "1,8": 37, "2,1": 45, "2,2": 53, "2,3": 56, "2,4": 73, "2,5": 77, "2,6": 82, "2,7": 85, "3,1": 90, "3,2": 97, "3,3": 101, "3,4": 106, "3,5": 113, "3,6": 119, "3,7": 124, "3,8": 130, "3,9": 134, "3,10": 139, "3,11": 147, "4,1": 155, "4,2": 161, "4,3": 166, "4,4": 170, "4,5": 180, "4,6": 183, "5,1": 189, "5,2": 205, "5,3": 207, "5,4": 213, "5,5": 218, "5,6": 220, "5,7": 226, "6,1": 233, "6,2": 241, "6,3": 243, "6,4": 246, "6,5": 252, "6,6": 255, "6,7": 260, "6,8": 268, "7,1": 274, "7,2": 292, "7,3": 294, "7,4": 298, "7,5": 300, "8,1": 304, "8,2": 311, "8,3": 314, "8,4": 317, "8,5": 322, "8,6": 326, "8,7": 334, "8,8": 338, "8,9": 342}, "898": {"1,1": 5, "1,2": 10, "1,3": 14, "1,4": 16, "1,5": 18, "1,7": 23, "1,8": 26, "2,1": 30, "2,2": 36, "2,3": 39, "2,4": 45, "2,5": 48, "2,6": 53, "2,7": 55, "3,1": 60, "3,2": 63, "3,3": 66, "3,4": 74, "3,5": 83, "3,6": 88, "3,7": 93, "3,8": 98, "3,9": 106, "3,10": 109, "3,11": 115, "4,1": 119, "4,2": 121, "4,3": 127, "4,4": 134, "4,5": 140, "4,6": 144, "5,1": 149, "5,2": 163, "5,3": 167, "5,4": 171, "5,5": 176, "5,6": 182, "5,7": 187, "6,1": 191, "6,2": 196, "6,3": 202, "6,4": 205, "6,5": 209, "6,6": 211, "6,7": 215, "6,8": 221, "7,1": 227, "7,2": 238, "7,3": 240, "7,4": 245, "7,5": 248, "8,1": 252, "8,2": 256, "8,3": 260, "8,5": 264, "8,6": 267, "8,7": 273, "8,8": 276, "8,9": 280}, "762": {"1,1": 3, "1,2": 13, "1,3": 23, "1,4": 41, "1,5": 43, "1,6": 63, "1,7": 69, "1,8": 81, "2,1": 96, "2,2": 116, "2,3": 120, "2,4": 154, "2,5": 160, "2,6": 174, "2,7": 180, "3,1": 189, "3,2": 203, "3,3": 217, "3,4": 227, "3,5": 243, "3,6": 251, "3,7": 255, "3,8": 267, "3,9": 281, "3,10": 295, "3,11": 317, "4,1": 330, "4,2": 348, "4,3": 366, "4,4": 384, "4,5": 408, "4,6": 416, "5,1": 425, "5,2": 469, "5,3": 479, "5,4": 491, "5,5": 499, "5,6": 507, "5,7": 523, "6,1": 534, "6,2": 564, "6,3": 574, "6,4": 576, "6,5": 590, "6,6": 596, "6,7": 606, "6,8": 620, "7,1": 633, "7,2": 685, "7,3": 687, "7,4": 701, "7,5": 709, "8,1": 730, "8,2": 746, "8,3": 752, "8,4": 766, "8,5": 774, "8,6": 784, "8,7": 802, "8,8": 814, "8,9": 826}, "1281": {"1,1": 3, "1,2": 4, "1,3": 5, "2,1": 7, "2,2": 8, "3,1": 10, "6,1": 12, "8,1": 14, "8,2": 15, "8,3": 16}, "81": {"1,1": 2, "1,2": 3, "1,3": 4, "1,4": 5, "2,1": 7, "2,2": 8, "2,3": 9, "2,4": 10, "2,5": 11, "3,1": 13, "3,2": 14, "3,3": 15, "3,4": 16, "3,5": 17, "3,6": 18, "3,7": 19, "4,1": 21, "4,2": 22, "4,3": 23, "4,4": 24, "4,5": 25, "5,1": 27, "5,2": 28, "5,3": 29, "5,4": 30, "5,5": 31, "5,6": 32, "5,7": 33, "5,8": 34, "5,9": 35, "6,1": 37, "6,2": 38, "6,3": 39, "6,4": 40, "6,5": 41, "6,6": 42, "6,7": 43, "7,1": 45, "7,2": 46, "7,3": 47, "7,4": 48, "7,5": 49, "7,6": 50, "8,1": 52, "8,2": 53, "8,3": 54, "8,4": 55, "8,5": 56, "8,6": 57, "8,7": 58, "9,1": 60, "9,2": 61, "9,3": 62, "9,4": 63, "9,5": 64, "9,6": 65, "9,7": 66, "9,8": 67, "9,9": 68, "10,1": 70, "10,2": 71, "10,3": 72, "10,4": 73, "10,5": 74, "10,6": 75, "10,7": 76, "10,8": 77, "10,9": 78, "11,1": 80, "11,2": 81, "11,3": 82, "11,4": 83, "11,5": 84, "11,6": 85, "11,7": 86, "11,8": 87, "11,9": 88, "12,1": 90, "12,2": 91, "12,3": 92, "12,4": 93, "12,5": 94, "13,1": 96, "13,2": 97, "13,3": 98, "13,4": 99, "13,5": 100, "13,6": 101, "13,7": 102, "13,8": 103, "13,9": 104, "13,10": 105, "13,11": 106}, "635": {"1,1": 3, "1,2": 11, "1,3": 22, "1,4": 34, "2,1": 43, "2,2": 47, "2,3": 56, "2,4": 58, "2,5": 62, "3,1": 70, "3,2": 77, "3,3": 89, "3,4": 96, "3,5": 102, "3,6": 109, "3,7": 124, "4,1": 132, "4,2": 139, "4,3": 142, "4,4": 153, "4,5": 158, "5,1": 167, "5,2": 174, "5,3": 177, "5,4": 188, "5,5": 193, "5,6": 198, "5,7": 208, "5,8": 216, "5,9": 222, "6,1": 231, "6,2": 238, "6,3": 241, "6,4": 248, "6,5": 253, "6,6": 261, "6,7": 266, "7,1": 270, "7,2": 278, "7,3": 290, "7,4": 299, "7,5": 307, "7,6": 312, "8,1": 317, "8,2": 327, "8,3": 339, "8,4": 344, "8,5": 362, "8,6": 364, "8,7": 372, "9,1": 381, "9,2": 386, "9,3": 394, "9,4": 402, "9,5": 412, "9,6": 420, "9,7": 423, "9,8": 431, "9,9": 441, "10,1": 448, "10,2": 452, "10,3": 456, "10,4": 467, "10,5": 480, "10,6": 489, "10,7": 496, "10,8": 504, "10,9": 511, "11,1": 523, "11,2": 528, "11,3": 532, "11,4": 535, "11,5": 540, "11,6": 551, "11,7": 558, "11,8": 573, "11,9": 582, "12,1": 591, "12,2": 594, "12,3": 602, "12,4": 606, "12,5": 612, "13,1": 620, "13,2": 626, "13,3": 635, "13,4": 639, "13,5": 644, "13,6": 650, "13,7": 656, "13,8": 664, "13,9": 670, "13,10": 678}, "950": {"1,1": 5, "1,2": 14, "1,3": 26, "2,1": 38, "2,2": 40, "2,3": 44, "2,4": 47, "2,5": 50, "3,1": 55, "3,2": 58, "3,3": 67, "3,4": 71, "3,5": 74, "3,6": 81, "3,7": 84, "4,1": 91, "4,2": 98, "4,3": 101, "4,4": 107, "4,5": 118, "5,1": 124, "5,2": 128, "5,3": 132, "5,4": 136, "5,5": 141, "5,6": 145, "5,7": 151, "5,8": 153, "5,9": 156, "6,1": 159, "6,2": 163, "6,3": 168, "6,4": 174, "6,5": 181, "6,6": 185, "6,7": 187, "7,1": 191, "7,2": 195, "7,3": 199, "7,4": 205, "7,5": 213, "7,6": 216, "8,1": 222, "8,2": 228, "8,3": 233, "8,4": 238, "8,6": 244, "8,7": 247, "9,1": 253, "9,2": 256, "9,3": 261, "9,4": 268, "9,5": 274, "9,6": 281, "9,7": 285, "9,8": 293, "9,9": 302, "10,1": 306, "10,2": 308, "10,3": 310, "10,4": 315, "10,5": 322, "10,6": 329, "10,7": 334, "10,8": 340, "10,9": 344, "11,1": 355, "11,2": 361, "11,3": 367, "11,4": 371, "11,5": 377, "11,6": 383, "11,7": 391, "11,8": 401, "11,9": 405, "12,1": 411, "12,2": 417, "12,3": 421, "12,4": 423, "12,5": 431, "13,1": 436, "13,2": 439, "13,3": 442, "13,4": 449, "13,5": 453, "13,6": 458, "13,7": 461, "13,8": 465, "13,9": 467, "13,10": 471, "13,11": 480}, "814": {"1,1": 3, "1,2": 27, "1,3": 63, "1,4": 91, "2,1": 108, "2,2": 120, "2,3": 140, "2,4": 148, "2,5": 154, "3,1": 165, "3,2": 175, "3,3": 209, "3,4": 227, "3,5": 241, "3,6": 251, "3,7": 285, "4,1": 296, "4,2": 306, "4,3": 312, "4,4": 332, "4,5": 352, "5,1": 369, "5,2": 383, "5,3": 393, "5,4": 413, "5,5": 419, "5,6": 423, "5,7": 451, "5,8": 465, "5,9": 477, "6,1": 488, "6,2": 501, "6,3": 517, "6,4": 533, "6,5": 543, "6,6": 563, "6,7": 569, "7,1": 574, "7,2": 592, "7,3": 612, "7,6": 630, "8,1": 665, "8,2": 675, "8,3": 695, "8,4": 705, "8,5": 739, "8,6": 743, "8,7": 763, "9,1": 782, "9,2": 792, "9,3": 808, "9,4": 826, "9,5": 844, "9,6": 866, "9,7": 870, "9,8": 882, "9,9": 898, "10,1": 913, "10,2": 927, "10,3": 933, "10,4": 963, "10,5": 997, "10,6": 1015, "10,7": 1029, "10,8": 1037, "10,9": 1051, "11,1": 1072, "11,2": 1086, "11,3": 1094, "11,4": 1100, "11,5": 1114, "11,6": 1134, "11,7": 1156, "11,8": 1190, "11,9": 1212, "12,1": 1233, "12,2": 1245, "12,3": 1265, "12,4": 1269, "12,5": 1291, "13,1": 1306, "13,2": 1316, "13,3": 1332, "13,4": 1342, "13,5": 1354, "13,6": 1366, "13,7": 1378, "13,8": 1394, "13,9": 1400, "13,10": 1418, "13,11": 1438}, "1327": {"3,1": 3, "5,1": 5, "10,1": 7, "10,2": 8, "10,3": 9, "11,1": 11, "11,2": 12, "11,3": 13, "12,1": 15, "12,2": 16, "13,1": 18, "13,2": 19, "13,3": 20, "13,4": 21}, "56": {"1,1": 2, "1,2": 3, "1,3": 4, "1,4": 5, "1,5": 6, "1,6": 7, "1,7": 8, "1,8": 9, "1,9": 10, "1,10": 11, "1,11": 12, "2,1": 14, "2,2": 15, "2,3": 16, "2,4": 17, "2,5": 18, "2,6": 19, "2,7": 20, "2,8": 21, "2,9": 22, "3,1": 24, "3,2": 25, "3,3": 26, "3,4": 27, "3,5": 28, "3,6": 29, "3,7": 30, "3,8": 31, "3,9": 32, "3,10": 33, "3,11": 34, "3,12": 35, "3,13": 36, "3,14": 37, "3,15": 38, "4,1": 40, "4,2": 41, "4,3": 42, "4,4": 43, "4,5": 44, "4,6": 45, "4,7": 46, "4,8": 47, "4,9": 48, "4,10": 49, "5,1": 51, "5,2": 52, "5,3": 53, "5,4": 54, "5,5": 55, "5,6": 56, "5,7": 57, "5,8": 58}, "588": {"1,1": 3, "1,2": 11, "1,3": 15, "1,4": 20, "1,5": 28, "1,6": 33, "1,7": 35, "1,8": 41, "1,9": 46, "1,10": 53, "1,11": 59, "2,1": 66, "2,2": 71, "2,3": 74, "2,4": 84, "2,5": 89, "2,6": 92, "2,7": 97, "2,8": 99, "2,9": 102, "3,1": 107, "3,2": 119, "3,3": 124, "3,4": 128, "3,5": 131, "3,6": 136, "3,7": 144, "3,8": 147, "3,9": 150, "3,10": 156, "3,11": 160, "3,12": 165, "3,13": 170, "3,14": 173, "3,15": 175, "4,1": 183, "4,2": 191, "4,3": 194, "4,4": 196, "4,5": 202, "4,6": 206, "4,7": 209, "4,8": 212, "4,9": 216, "4,10": 231, "5,1": 236, "5,2": 240, "5,3": 243, "5,4": 247, "5,5": 257, "5,6": 267, "5,7": 274, "5,8": 284}, "899": {"1,1": 5, "1,2": 13, "1,3": 17, "1,4": 21, "1,5": 29, "1,6": 33, "1,7": 37, "1,8": 43, "1,9": 49, "1,10": 51, "1,11": 56, "2,1": 61, "2,2": 66, "2,3": 71, "2,4": 76, "2,5": 82, "2,6": 88, "2,7": 93, "2,8": 98, "2,9": 103, "3,1": 109, "3,2": 121, "3,3": 126, "3,4": 135, "3,5": 141, "3,6": 150, "3,7": 161, "3,8": 165, "3,9": 170, "3,10": 176, "3,11": 180, "3,12": 184, "3,13": 189, "3,14": 191, "3,15": 193, "4,1": 197, "4,2": 200, "4,3": 204, "4,4": 207, "4,5": 212, "4,6": 225, "4,7": 228, "4,8": 230, "4,9": 233, "4,10": 243, "5,1": 247, "5,2": 252, "5,3": 258, "5,4": 261, "5,5": 273, "5,6": 278, "5,7": 282, "5,8": 291}, "772": {"1,1": 3, "1,2": 21, "1,3": 27, "1,4": 39, "1,5": 59, "1,6": 67, "1,7": 73, "1,8": 85, "1,9": 95, "1,10": 105, "1,11": 115, "2,1": 136, "2,2": 144, "2,3": 156, "2,4": 166, "2,5": 180, "2,6": 190, "2,7": 200, "2,8": 204, "2,9": 210, "3,1": 219, "3,2": 249, "3,3": 255, "3,4": 267, "3,5": 271, "3,6": 287, "3,7": 311, "3,8": 315, "3,9": 325, "3,10": 337, "3,11": 343, "3,12": 353, "3,13": 361, "3,14": 369, "3,15": 371, "4,1": 386, "4,2": 404, "4,3": 408, "4,4": 410, "4,5": 426, "4,6": 444, "4,7": 456, "4,8": 458, "4,9": 466, "4,10": 498, "5,1": 505, "5,2": 511, "5,3": 527, "5,4": 533, "5,5": 565, "5,6": 587, "5,7": 617, "5,8": 643}, "1284": {"3,1": 3}};
  OTZ_BOOKS.Bartenura_on_Mishnah_Middot = { book: 643, he: "ברטנורא על משנה מדות", cm: OTZ_CM[643] };
  OTZ_BOOKS.Tosafot_Yom_Tov_on_Mishnah_Middot = { book: 948, he: "תוספות יום טוב על משנה מדות", cm: OTZ_CM[948] };
  OTZ_BOOKS.Yachin_on_Mishnah_Middot = { book: 819, he: "תפארת ישראל — יכין, מדות", cm: OTZ_CM[819] };
  OTZ_BOOKS.Boaz_on_Mishnah_Middot = { book: 1329, he: "תפארת ישראל — בועז, מדות", cm: OTZ_CM[1329] };
  OTZ_BOOKS.Bartenura_on_Mishnah_Tamid = { book: 634, he: "ברטנורא על משנה תמיד", cm: OTZ_CM[634] };
  OTZ_BOOKS.Tosafot_Yom_Tov_on_Mishnah_Tamid = { book: 944, he: "תוספות יום טוב על משנה תמיד", cm: OTZ_CM[944] };
  OTZ_BOOKS.Yachin_on_Mishnah_Tamid = { book: 818, he: "תפארת ישראל — יכין, תמיד", cm: OTZ_CM[818] };
  OTZ_BOOKS.Mishnah_Sotah = { book: 67, he: "משנה סוטה", base: {1:1,2:11,3:18,4:27,5:33,6:39,7:44,8:53,9:61}, count: {1:9,2:6,3:8,4:5,5:5,6:4,7:8,8:7,9:15} };   // 2.0 (55-tamid.js): Mishnah Sotah
  OTZ_BOOKS.Boaz_on_Mishnah_Tamid = { book: 1330, he: "תפארת ישראל — בועז, תמיד", cm: OTZ_CM[1330] };
  // 1.7.1: Shekalim, Yoma, Menachot and Sukkah too (exported from the user's seforim.db on 9.11.2026)
  OTZ_BOOKS.Bartenura_on_Mishnah_Shekalim = { book: 593, he: "ברטנורא על משנה שקלים", cm: OTZ_CM[593] };
  OTZ_BOOKS.Tosafot_Yom_Tov_on_Mishnah_Shekalim = { book: 893, he: "תוספות יום טוב על משנה שקלים", cm: OTZ_CM[893] };
  OTZ_BOOKS.Yachin_on_Mishnah_Shekalim = { book: 768, he: "תפארת ישראל — יכין, שקלים", cm: OTZ_CM[768] };
  OTZ_BOOKS.Boaz_on_Mishnah_Shekalim = { book: 1279, he: "תפארת ישראל — בועז, שקלים", cm: OTZ_CM[1279] };
  OTZ_BOOKS.Bartenura_on_Mishnah_Yoma = { book: 582, he: "ברטנורא על משנה יומא", cm: OTZ_CM[582] };
  OTZ_BOOKS.Tosafot_Yom_Tov_on_Mishnah_Yoma = { book: 898, he: "תוספות יום טוב על משנה יומא", cm: OTZ_CM[898] };
  OTZ_BOOKS.Yachin_on_Mishnah_Yoma = { book: 762, he: "תפארת ישראל — יכין, יומא", cm: OTZ_CM[762] };
  OTZ_BOOKS.Boaz_on_Mishnah_Yoma = { book: 1281, he: "תפארת ישראל — בועז, יומא", cm: OTZ_CM[1281] };
  OTZ_BOOKS.Bartenura_on_Mishnah_Menachot = { book: 635, he: "ברטנורא על משנה מנחות", cm: OTZ_CM[635] };
  OTZ_BOOKS.Tosafot_Yom_Tov_on_Mishnah_Menachot = { book: 950, he: "תוספות יום טוב על משנה מנחות", cm: OTZ_CM[950] };
  OTZ_BOOKS.Yachin_on_Mishnah_Menachot = { book: 814, he: "תפארת ישראל — יכין, מנחות", cm: OTZ_CM[814] };
  OTZ_BOOKS.Boaz_on_Mishnah_Menachot = { book: 1327, he: "תפארת ישראל — בועז, מנחות", cm: OTZ_CM[1327] };
  OTZ_BOOKS.Bartenura_on_Mishnah_Sukkah = { book: 588, he: "ברטנורא על משנה סוכה", cm: OTZ_CM[588] };
  OTZ_BOOKS.Tosafot_Yom_Tov_on_Mishnah_Sukkah = { book: 899, he: "תוספות יום טוב על משנה סוכה", cm: OTZ_CM[899] };
  OTZ_BOOKS.Yachin_on_Mishnah_Sukkah = { book: 772, he: "תפארת ישראל — יכין, סוכה", cm: OTZ_CM[772] };
  OTZ_BOOKS.Boaz_on_Mishnah_Sukkah = { book: 1284, he: "תפארת ישראל — בועז, סוכה", cm: OTZ_CM[1284] };
  // 1.8.2: single comments (cm: "chapter,mishnah" -> the line), the north gates' order and the parochot
  OTZ_BOOKS.Chok_Natan_on_Mishnah_Middot = { book: 6026, he: "חק נתן על משנה מדות", cm: { "1,4": 12, "2,4": 42 } };
  OTZ_BOOKS.Rosh_on_Mishnah_Middot = { book: 6035, he: "פירוש הרא״ש על מדות", cm: { "2,3": 28, "2,5": 32, "2,6": 34, "4,4": 62 } };
  OTZ_BOOKS.Maasei_LaMelech_on_Klei_HaMikdash = { book: 4305, he: "מעשי למלך על הלכות כלי המקדש", cm: { "8,15": 226 } };
  // 1.9.0: the cells' readings
  OTZ_BOOKS.Tosafot_on_Yoma = { book: 1908, he: "תוספות על יומא", cm: { "8,2": 68, "52,1": 425, "2,1": 7 } };
  OTZ_BOOKS.Tosafot_on_Bava_Batra = { book: 1923, he: "תוספות על בבא בתרא", cm: { "61,1": 722 } };
  OTZ_BOOKS.Kovetz_Shitot_Kamai_on_Middot = { book: 7576, he: "קובץ שיטות קמאי על מדות", cm: { "2,3": 244, "2,5": 248, "4,4": 668, "4,7": 773 } };
  OTZ_BOOKS.Raavad_on_Beit_HaBechira = { book: 5252, he: "השגות הראב״ד על הלכות בית הבחירה", cm: { "3,12": 18, "4,9": 29, "4,11": 33 } };
  OTZ_BOOKS.R_Shemaya_on_Middot = { book: 645, he: "רבינו שמעיה על משנה מדות", cm: { "2,4": 66, "4,4": 139 } };
  OTZ_BOOKS.Maasei_LaMelech_on_Beit_HaBechira = { book: 4304, he: "מעשי למלך על הלכות בית הבחירה", cm: { "4,3": 104 } };
  OTZ_BOOKS.Har_HaMoriah_on_Beit_HaBechira = { book: 5474, he: "הר המוריה על הלכות בית הבחירה", cm: { "4,9": 203, "1,10": 25 } };
  // 1.9.1: the upper and the lower gate (Sukkah 5:4-5; the Rambam, Klei HaMikdash 7:6)
  OTZ_BOOKS.Rambam_Klei_HaMikdash = { book: 338, he: "רמב״ם הלכות כלי המקדש", cm: { "7,6": 107, "8,1": 123, "8,2": 124, "8,11": 133, "8,13": 135, "8,16": 138, "8,17": 139, "8,18": 140, "8,19": 141, "10,1": 155, "10,2": 156 } };
  // 1.9.5: the priests' garments (the place "בגדי הכהנים", the row "אבנטו של כהן הדיוט") - read in the user's library, 12.11.2026
  OTZ_BOOKS.Kesef_Mishneh_on_Klei_HaMikdash = { book: 4255, he: "כסף משנה על הלכות כלי המקדש", cm: { "8,1": 339 } };
  OTZ_BOOKS.Exodus = { book: 2, he: "שמות", cm: { "39,29": 1197 } };
  OTZ_BOOKS.Rashbam_on_Exodus = { book: 3549, he: "רשב״ם על שמות", cm: { "39,29": 1353 } };
  OTZ_BOOKS.Ramban_on_Exodus = { book: 3627, he: "רמב״ן על שמות", cm: { "28,31": 709, "39,28": 925 } };
  OTZ_BOOKS.Ibn_Ezra_on_Exodus = { book: 3619, he: "אבן עזרא על שמות", cm: { "28,36": 2002 } };
  // 1.9.1: the low eastern wall (Middot 2:4) and the twelve steps (2:3) - the commentators found in the user's library
  OTZ_BOOKS.Rambam_Commentary_on_Middot = { book: 573, he: "פירוש המשניות לרמב״ם, מדות", cm: { "1,3": 6, "2,3": 23, "2,4": 25, "2,5": 25, "3,6": 40, "4,1": 47, "4,3": 51, "4,4": 53, "4,6": 57, "4,7": 59 } };
  OTZ_BOOKS.Rashash_on_Middot = { book: 750, he: "רש״ש על משנה מדות", cm: { "2,4": 30 } };
  OTZ_BOOKS.Piskei_Tosafot_on_Middot = { book: 2082, he: "פסקי תוספות על משנה מדות", cm: { "8,1": 16 } };
  OTZ_BOOKS.Rashi_on_Yoma = { book: 2157, he: "רש״י על יומא", cm: { "16,1": 493, "19,1": 595, "22,1": 741, "25,1": 885, "28,1": 1005, "45,1": 1728, "52,1": 1959, "2,1": 11, "37,1": 1385 } };
  // 1.9.5: the lotteries (the demonstration's card and the row of the first lottery)
  OTZ_BOOKS.Ritva_on_Yoma = { book: 1940, he: "חידושי הריטב״א על יומא", cm: { "22,1": 279 } };
  OTZ_BOOKS.Jerusalem_Talmud_Yoma = { book: 155, he: "תלמוד ירושלמי, יומא", cm: { "2,1": 83 } };
  OTZ_BOOKS.Har_HaMoriah_on_Temidin = { book: 5468, he: "הר המוריה על הלכות תמידין ומוספין", cm: { "6,1": 365 } };
  OTZ_BOOKS.Meiri_on_Middot = { book: 6033, he: "מאירי על משנה מידות", cm: { "2,4": 33, "2,5": 35, "3,5": 50, "3,6": 52 } };
  OTZ_BOOKS.Lechem_Shamayim_on_Middot = { book: 1145, he: "לחם שמים על משנה מידות", cm: { "2,4": 55 } };
  // 1.9.2: the slaughter place's three layouts (as in the First Temple plugin)
  OTZ_BOOKS.Gra_on_Middot = { book: 7509, he: "ביאורי הגר״א על משנה מדות", cm: { "5,2": 67 } };
  OTZ_BOOKS.Tzurat_Beit_HaMikdash_Tiferet = { book: 6029, he: "צורת בית המקדש לתפארת ישראל", cm: { "1,1": 99, "66,1": 65 } };
  // 1.9.2: the pishpesh's keys (Tamid 3:6) - the three readings
  OTZ_BOOKS.Rambam_Commentary_on_Tamid = { book: 575, he: "פירוש המשניות לרמב״ם, תמיד", cm: { "3,6": 34, "6,3": 69 } };   // 2.0: + 6:3
  OTZ_BOOKS.Melekhet_Shelomoh_on_Mishnah_Tamid = { book: 1202, he: "מלאכת שלמה על משנה תמיד", cm: { "2,2": 62, "3,6": 110 } };
  OTZ_BOOKS.Raavad_on_Temidin = { book: 5256, he: "השגות הראב״ד על הלכות תמידין ומוספין", cm: { "2,7": 7 } };   // 1.9.5
  OTZ_BOOKS.Rambam_Issurei_Mizbeach = { book: 339, he: "רמב״ם הלכות איסורי מזבח", cm: { "7,3": 100 } };   // 1.9.5: the gezirin's measure
  OTZ_BOOKS.Rabbeinu_Gershom_on_Tamid = { book: 2101, he: "רבינו גרשום על תמיד", cm: { "30,1": 107 } };
  // 1.9.3 (the kuntres "בגדרי ודיני צורת הבית"): the books of its sources
  OTZ_BOOKS.Mishnah_Sotah = { book: 67, he: "משנה סוטה", base: {1:1,2:11,3:18,4:27,5:33,6:39,7:44,8:53,9:61}, count: {1:9,2:6,3:8,4:5,5:5,6:4,7:8,8:7,9:15} };
  OTZ_BOOKS.Rashi_on_Sotah = { book: 2172, he: "רש״י על סוטה", cm: { "15,2": 851 } };
  OTZ_BOOKS.Rashi_on_Menachot = { book: 2186, he: "רש״י על מנחות", cm: { "99,1": 4703, "98,1": 4648, "98,2": 4681 } };
  // 1.9.5: the menorah's direction (the row "כיוון המנורה")
  OTZ_BOOKS.Tosafot_on_Menachot = { book: 1933, he: "תוספות על מנחות", cm: { "98,2": 1167 } };
  OTZ_BOOKS.Rashi_on_Shabbat = { book: 2156, he: "רש״י על שבת", cm: { "22,2": 1043 } };
  OTZ_BOOKS.Kesef_Mishneh_on_Beit_HaBechira = { book: 4260, he: "כסף משנה על הלכות בית הבחירה", cm: { "3,12": 147 } };
  OTZ_BOOKS.Rashi_on_Sukkah = { book: 2163, he: "רש״י על סוכה", cm: { "7,2": 263, "45,1": 2081 } };
  OTZ_BOOKS.Rashi_on_Zevachim = { book: 2191, he: "רש״י על זבחים", cm: { "54,1": 2598, "55,2": 2692, "62,2": 3021 } };
  OTZ_BOOKS.Mefaresh_on_Tamid = { book: 2105, he: "המפרש על תמיד", cm: { "28,1": 148, "31,2": 308 } };
  OTZ_BOOKS.Tosafot_Rid_on_Yoma = { book: 2109, he: "תוספות רי״ד על יומא", cm: { "25,1": 76, "52,1": 159 } };
  OTZ_BOOKS.Meiri_on_Yoma = { book: 2199, he: "בית הבחירה למאירי, יומא", cm: { "25,1": 228, "37,1": 333 } };   // 1.9.5: the three chambers
  OTZ_BOOKS.Tosafot_Yeshanim_on_Yoma = { book: 1992, he: "תוספות ישנים על יומא", cm: { "25,1": 243 } };
  OTZ_BOOKS.Rosh_on_Tamid = { book: 2224, he: "פירוש הרא״ש על תמיד", cm: { "26,2": 34, "27,1": 48 } };
  OTZ_BOOKS.Tosafot_on_Zevachim = { book: 1936, he: "תוספות על זבחים", cm: { "62,2": 663, "87,2": 949 } };
  OTZ_BOOKS.Rashi_on_Sanhedrin = { book: 2180, he: "רש״י על סנהדרין", cm: { "36,2": 1777, "37,1": 1781, "86,2": 4632 } };
  OTZ_BOOKS.Yad_Ramah_on_Sanhedrin = { book: 1957, he: "יד רמה על סנהדרין", cm: { "36,2": 564 } };
  OTZ_BOOKS.Rashi_on_Exodus = { book: 3692, he: "רש״י על שמות", cm: { "27,5": 1912, "28,4": 1957, "29,12": 2101 } };
  OTZ_BOOKS.Beit_Yosef_OC = { book: 3900, he: "בית יוסף, אורח חיים", cm: { "123,1": 2000 } };
  OTZ_BOOKS.Binyan_Tzion = { book: 5791, he: "בנין ציון", cm: { "12,1": 50 } };
  OTZ_BOOKS.Chazon_Ish_OC = { book: 5849, he: "חזון איש, אורח חיים מועד", cm: { "126,1": 6086 } };   // 1.9.3: on Middot 2:6 (the duchan)
  OTZ_BOOKS.Rashi_on_Pesachim = { book: 2162, he: "רש״י על פסחים", cm: { "86,1": 4148, "13,2": 581, "11,2": 489 } };
  OTZ_BOOKS.Rashi_on_I_Kings = { book: 3673, he: "רש״י על מלכים א", cm: { "7,50": 468 } };   // 1.9.1: "והפתות. מפתחות" - the key of gold of the great gate's demonstration
  // 1.9.5 (the remarks sent on to the user, 11.11.2026): the books of their sources, read in his library that day (LIB_1111.md)
  OTZ_BOOKS.Bartenura_on_Mishnah_Parah = { book: 632, he: "ברטנורא על משנה פרה", cm: { "3,6": 103, "3,1": 69 } };
  OTZ_BOOKS.Rambam_Commentary_on_Parah = { book: 569, he: "פירוש המשניות לרמב״ם, פרה", cm: { "3,6": 34 } };
  OTZ_BOOKS.Rambam_Parah_Adumah = { book: 372, he: "רמב״ם הלכות פרה אדומה", cm: { "3,1": 28, "2,1": 19 } };
  OTZ_BOOKS.Rambam_Shekalim = { book: 310, he: "רמב״ם הלכות שקלים", cm: { "4,8": 48 } };
  OTZ_BOOKS.Kovetz_Shitot_Kamai_Middot = { book: 7576, he: "קובץ שיטות קמאי על מדות", cm: { "53,1": 355, "51,2": 353 } };
  OTZ_BOOKS.Rambam_Sanhedrin = { book: 375, he: "רמב״ם הלכות סנהדרין", cm: { "1,3": 5 } };
  OTZ_BOOKS.Meiri_on_Sanhedrin = { book: 2214, he: "בית הבחירה למאירי, סנהדרין", cm: { "17,1": 190 } };
  // 1.9.5: Shushan HaBirah and the two rods (the user's file of sources, 11.11.2026; each line read in his library)
  OTZ_BOOKS.Rashi_on_Pesachim_Shtei_Amot = { book: 2162, he: "רש״י על פסחים", cm: { "86,1": 4141 } };
  OTZ_BOOKS.Tosafot_on_Pesachim = { book: 1905, he: "תוספות על פסחים", cm: { "86,1": 910 } };
  OTZ_BOOKS.Rashash_on_Pesachim = { book: 2492, he: "רש״ש על פסחים", cm: { "86,1": 718 } };
  OTZ_BOOKS.Bartenura_on_Mishnah_Kelim = { book: 627, he: "ברטנורא על משנה כלים", cm: { "17,9": 1141 } };
  OTZ_BOOKS.Rambam_Commentary_on_Kelim = { book: 558, he: "פירוש המשניות לרמב״ם, כלים", cm: { "17,9": 293 } };
  var REF_RE = /^([A-Za-z_,]+?)(?:\.(\d+)([ab])?)?(?:\.(\d+))?$/;
  // "Mishnah_Middot.2.3" / "Yoma.54a" / "Mishneh_Torah,_The_Chosen_Temple.5.17" / a bare book -> { book, index, he } or null
  function refIndex(ref) {
    const m = REF_RE.exec(String(ref || ""));
    if (!m) return null;
    const T = OTZ_BOOKS[m[1]];
    if (!T) return null;
    if (T.cm) {   // 1.7.0: a commentary, "Bartenura_on_Mishnah_Middot.2.3" -> the first line of mishnah 2:3 in it
      if (!m[2]) return { book: T.book, index: 0, he: T.he };
      const i = T.cm[m[2] + "," + (m[4] || 1)];
      return i == null ? null : { book: T.book, index: i, he: T.he };
    }
    if (T.amud) {
      if (!m[2]) return { book: T.book, index: 0, he: T.he };
      const k = (+m[2] - 2) * 2 + (m[3] === "b" ? 1 : 0) - T.start;
      if (k < 0 || k >= T.amud.length) return null;
      return { book: T.book, index: T.amud[k], he: T.he };
    }
    if (m[3]) return null;
    if (!m[2]) return { book: T.book, index: 0, he: T.he };
    const c = +m[2];
    if (!T.base[c]) return null;
    const n = m[4] ? Math.min(+m[4], T.count[c] || +m[4]) : 0;
    return { book: T.book, index: T.base[c] + n, he: T.he };
  }
  // a daf number in Hebrew letters (15 = טו, 16 = טז; 100 = ק)
  function ui_dafLabel(n) {
    const U = ["", "א", "ב", "ג", "ד", "ה", "ו", "ז", "ח", "ט"], T = ["", "י", "כ", "ל", "מ", "נ", "ס", "ע", "פ", "צ"], H = ["", "ק", "ר", "ש", "ת"];
    let s = H[Math.floor(n / 100)] || "";
    const r = n % 100;
    if (r === 15) return s + "טו";
    if (r === 16) return s + "טז";
    return s + T[Math.floor(r / 10)] + U[r % 10];
  }
  var ui_BASE = {}, ui_PAGES = {};
  for (const k of Object.keys(OTZ_BOOKS)) {
    const T = OTZ_BOOKS[k];
    if (T.base) ui_BASE[T.book] = T.base;
    if (T.amud) {
      const P = ui_PAGES[T.book] = {};
      T.amud.forEach((idx, i) => { const n = i + T.start; P[ui_dafLabel(2 + (n >> 1)) + (n % 2 ? ":" : ".")] = idx; });
    }
  }
  // 1.0.1-L (Part 7, U2): no other site: every source opens in Otzaria only (the table of Sefaria names and every URL built from it are gone)
  function ui_gematria(s) {
    const V = { "א": 1, "ב": 2, "ג": 3, "ד": 4, "ה": 5, "ו": 6, "ז": 7, "ח": 8, "ט": 9, "י": 10, "כ": 20, "ל": 30, "מ": 40, "נ": 50, "ס": 60, "ע": 70, "פ": 80, "צ": 90, "ק": 100, "ר": 200, "ש": 300, "ת": 400 };
    let n = 0;
    for (const ch of s) n += V[ch] || 0;
    return n;
  }
  // V(book, chapter, verse) -> Tanach verse; P(book, "צח:") -> Talmud page; MI(ch, m) -> Mishnah Middot; RB(ch, h) -> Rambam Beit HaBechira (h = 0: chapter heading)
  function ui_V(book, ch, v) {
    const base = ui_BASE[book] && ui_BASE[book][ch];
    return { book, index: base == null ? null : base + v };
  }
  function ui_P(book, page) {
    const idx = ui_PAGES[book] && ui_PAGES[book][page];
    return { book, index: idx == null ? null : idx };
  }
  function ui_MI(ch, m) {
    return { book: 89, index: ui_BASE[89][ch] + (m || 0) };
  }
  function ui_RB(ch, h) {
    return { book: 337, index: ui_BASE[337][ch] + (h || 0) };
  }
  // 1.0.1-K: MN(book, ch, m) -> a Mishnah of another tractate (Sanhedrin 73, Menachot 81, Tamid 88, Kelim 91), like MI for Middot
  function ui_MN(book, ch, m) {
    const base = ui_BASE[book] && ui_BASE[book][ch];
    return { book, index: base == null ? null : base + (m || 0) };
  }
  // A plain Sefaria-style string ref ("Mishnah_Middot.4.7", "I_Kings.6.6") -> Otzaria position, when the book is known.
  function ui_sefToOtz(ref) {
    return refIndex(ref);
  }
  // ===== 1.0.2 (A, "links in the brackets"): a source's bracket inside a card's text opens it in Otzaria, as the card's chip does. A part
  // of a bracket ("ו, טו; ו, ל" has two) is matched to the card's own refs by its label first (the label as written, then without a range's
  // end "–כב", then without a commentator's name before it: "רש״י יומא לו." is the chip "יומא לו."); else it is read here: a verse of a book
  // in ui_BASE ("מלכים א ז, טו", "מדות ג, ב", "רמב״ם בית הבחירה ב, יא", "שקלים ו, ד"), a page of ui_PAGES ("יומא נא:"), or a bare "ז, כו" when
  // the last book named in a bracket before it is the book of the card's first ref (both must agree). A commentator's name is dropped only
  // before a verse of the Tanach (its verse opens, as the chips "רש״י ז, טו" do), never before a page or a Mishnah (another book).
  // Anything else stays plain text (model choice: no guessing). The names below are only those of ui_BASE / ui_PAGES. =====
  var UI_SRC_TN = {};   // Beit Sheni cites no Tanach book by chapter and verse in its brackets (a verse is plain text)
  var UI_SRC_MI = { "מדות": 89, "מידות": 89, "משנה מדות": 89, "משנה מידות": 89, "תמיד": 88, "משנה תמיד": 88, "שקלים": 54, "משנה שקלים": 54, "יומא": 55, "משנה יומא": 55, "סוכה": 56, "משנה סוכה": 56, "זבחים": 80, "משנה זבחים": 80, "מנחות": 81, "משנה מנחות": 81, "כלים": 91, "משנה כלים": 91, "פרה": 94, "משנה פרה": 94, "סנהדרין": 73, "משנה סנהדרין": 73,
    'רמב"ם': 337, 'רמב"ם בית הבחירה': 337, 'רמב"ם הלכות בית הבחירה': 337, "הלכות בית הבחירה": 337, "בית הבחירה": 337, 'רמב"ם תמידין ומוספין': 344, 'רמב"ם הלכות תמידין ומוספין': 344, "תמידין ומוספין": 344, 'רמב"ם כלי המקדש': 338, 'רמב"ם הלכות כלי המקדש': 338, "כלי המקדש": 338 };
  var UI_SRC_TAL = { "יומא": 107, "זבחים": 130, "סוכה": 108, "מנחות": 131, "פסחים": 106, "תמיד": 138, "סנהדרין": 125, "שבת": 104, "עירובין": 105, "בבא בתרא": 124, 'ב"ב': 124, "חגיגה": 114, "ערכין": 134 };
  var UI_SRC_PRE = ['רש"י', "תוספות", "ברטנורא", 'רע"ב', "תוספות יום טוב", 'תוי"ט', "תפארת ישראל", 'ראב"ד', "כסף משנה", "מאירי", 'ריטב"א', 'רא"ש', "פירוש המשניות", 'פיהמ"ש'];
  var UI_SRC_TN_IDS = [];
  // 1.7.0 (stage 4): a commentary named before a Mishnah tractate in the brackets -> that commentary's book, at the mishnah (OTZ_CM)
  var UI_SRC_CM_B = { 89: 643, 88: 634, 54: 593, 55: 582, 81: 635, 56: 588 }, UI_SRC_CM_T = { 89: 948, 88: 944, 54: 893, 55: 898, 81: 950, 56: 899 },
    UI_SRC_CM_Y = { 89: 819, 88: 818, 54: 768, 55: 762, 81: 814, 56: 772 }, UI_SRC_CM_Z = { 89: 1329, 88: 1330, 54: 1279, 55: 1281, 81: 1327, 56: 1284 };
  var UI_SRC_CM = { "ברטנורא": UI_SRC_CM_B, 'רע"ב': UI_SRC_CM_B, "תוספות יום טוב": UI_SRC_CM_T, 'תוי"ט': UI_SRC_CM_T,
    "תפארת ישראל": UI_SRC_CM_Y, "יכין": UI_SRC_CM_Y, "בועז": UI_SRC_CM_Z };
  var UI_SRC_NUM = /^[קרשת]{0,2}(?:[יכלמנסעפצ]?[א-ט]?|טו|טז)$/;
  function ui_srcNorm(s) {
    return String(s || "").replace(/[֑-ׇ]/g, "").replace(/[״"]/g, '"').replace(/[׳']/g, "'").replace(/\s+/g, " ").replace(/^[\s,;]+|[\s,;]+$/g, "");
  }
  // "ז, טו–כב" -> "ז, טו"; "ו–ז" stays (no verse: it is not read)
  function ui_srcNoRange(s) {
    return s.replace(/(,\s?[א-ת"']{1,5})\s*[–-]\s*[א-ת"']{1,5}$/, "$1").replace(/([א-ת"']{1,5}[.:])\s*[–-]\s*[א-ת"']{1,5}[.:]?$/, "$1");
  }
  function ui_srcNum(t) {
    const s = String(t || "").replace(/["']/g, "");
    return s && UI_SRC_NUM.test(s) ? ui_gematria(s) : 0;
  }
  // the last Tanach book named at the head of a bracket in text before `pos` (a bracket with a quote counts too: it names its book), or null
  function ui_srcLastBook(text, pos) {
    const s = ui_srcNorm(String(text || "").slice(0, Math.max(0, pos || 0)));
    const re = /\((?:(?:רש"י|רד"ק|מצודת דוד|מצודת ציון|מצודות|מלבי"ם|רלב"ג|תרגום יונתן|תרגום|ראו|וראו)\s+)?(מלכים א|מלכים ב|דברי הימים א|דברי הימים ב|דה"י א|דה"י ב|ירמיהו|ירמיה|שמות|ויקרא|במדבר|שיר השירים|קהלת)\s/g;
    let m, last = null;
    while ((m = re.exec(s))) last = UI_SRC_TN[m[1]] || null;
    return last;
  }
  // one part (normalized, its range end dropped) -> { book, index } or null; bareBook = the book of a bare "ז, כו" (null: not read)
  function ui_srcParse(p, bareBook) {
    p = String(p || "").replace(/ ע"א$/, ".").replace(/ ע"ב$/, ":");   // Beit Sheni: the amud as ע״א / ע״ב (ui_srcNorm made the quote plain)
    const tal = /^(.+?) ([א-ת"']{1,5}[.:])$/.exec(p);
    if (tal && UI_SRC_TAL[tal[1]]) {
      const b = UI_SRC_TAL[tal[1]], pg = tal[2].replace(/["']/g, "");
      const idx = ui_PAGES[b] && ui_PAGES[b][pg];
      return idx == null ? null : { book: b, index: idx };
    }
    const m = /^(?:(.+?) )?([א-ת"']{1,5}), ?([א-ת"']{1,5})$/.exec(p);
    if (!m) return null;
    const ch = ui_srcNum(m[2]), v = ui_srcNum(m[3]);
    if (!ch || !v) return null;
    let book = null;
    const name = m[1] || "";
    if (!name) book = bareBook;
    else if (UI_SRC_TN[name]) book = UI_SRC_TN[name];
    else if (UI_SRC_MI[name]) book = UI_SRC_MI[name];
    else {
      for (const pre of Object.keys(UI_SRC_CM)) {   // 1.7.0: "ברטנורא מידות ב, ג" -> the Bartenura at 2:3
        if (name.indexOf(pre + " ") !== 0) continue;
        const tr = UI_SRC_MI[name.slice(pre.length + 1)], cb = tr && UI_SRC_CM[pre][tr];
        if (!cb || !OTZ_CM[cb]) break;
        const i = OTZ_CM[cb][ch + "," + v];
        return i == null ? null : { book: cb, index: i };
      }
      for (const pre of UI_SRC_PRE) {
        if (name === pre) { book = bareBook; break; }
        if (name.indexOf(pre + " ") === 0) { book = UI_SRC_TN[name.slice(pre.length + 1)] || null; break; }
      }
    }
    const B = book != null && ui_BASE[book];
    if (!B || B[ch] == null) return null;
    const idx = B[ch] + v;
    if (B[ch + 1] != null && idx >= B[ch + 1]) return null;   // past the chapter's end (books 10 and 39 have all their chapters)
    return { book, index: idx };
  }
  // ===== 1.0.2 (item 2): opening the plugin from the books (the reader's button "open-beit-rishon", openPlugin: true, shown in I Kings
  // and II Chronicles only). Otzaria opens the page and delivers reader.toolbar_item_clicked with the reading position (api.md: itemId,
  // currentBook = the title, currentBookId, currentId = the numeric id, currentIndex = the line, currentRef); plugin.page_opened's param is
  // read the same way when it carries a position. The listeners are set when the script runs - the event may come while the model loads -
  // and the position waits in ui_bookQueue until buildUI is done and the loading screen is gone (ui_bookGo is set at buildUI's end). =====
  var UI_BOOK_ITEM = "open-beit-sheni";
  var ui_bookQueue = [];
  var ui_bookGo = null;
  var ui_bootVersion = "";   // payload.plugin.version of plugin.boot (for the report, item 1)
  // the reading ranges -> the panel's button: p = a place title, v = a view key (the grid's own buttons); [chapter, from verse, to verse].
  // The first range that holds the verse wins (the narrow ones first); verse 0 = the chapter's heading line. Built from the verses
  // themselves (each one read in the DB); where a verse names something narrower than its range it has its own line (marked).
  var ui_READ = {
    89: [   // Mishnah Middot: [chapter, from mishnah, to mishnah, the panel's button]; mishnah 0 = the chapter's heading line
      [1, 1, 2, { v: "harHabayit" }],                       // the guards (1:1-2)
      [1, 3, 3, { v: "harHabayit" }],                       // the five gates of the mount
      [1, 4, 4, { v: "azarah" }],                           // the seven gates of the court
      [1, 5, 5, { p: "שער הניצוץ" }],
      [1, 6, 9, { p: "בית המוקד" }],
      [1, 0, 9, { v: "harHabayit" }],
      [2, 1, 2, { v: "harHabayit" }],
      [2, 3, 3, { p: "הסורג" }],
      [2, 4, 4, { p: "שער עזרת נשים — המזרחי" }],          // the eastern wall, lower than the others
      [2, 5, 5, { v: "ezratNashim" }],
      [2, 6, 6, { v: "azarah" }],
      [2, 0, 6, { v: "harHabayit" }],
      [3, 1, 4, { v: "mizbeach" }],
      [3, 5, 5, { p: "בית המטבחים" }],
      [3, 6, 6, { p: "הכיור" }],
      [3, 7, 8, { v: "ulam" }],
      [3, 0, 8, { v: "mizbeach" }],
      [4, 1, 1, { v: "kodesh" }],
      [4, 2, 2, { p: "פשפשי ההיכל" }],
      [4, 3, 5, { v: "heichalFront" }],                     // the cells, the mesibah, the upper storey
      [4, 6, 7, { v: "heichalFront" }],
      [4, 0, 7, { v: "heichalFront" }],
      [5, 1, 2, { v: "azarah" }],
      [5, 3, 3, { p: "לשכת המלח" }],
      [5, 4, 4, { p: "לשכת הגזית — הסנהדרין" }],
      [5, 0, 4, { v: "azarah" }]
    ],
    337: [   // Rambam, Hilchot Beit HaBechirah: [chapter, from halacha, to halacha, the button]
      [1, 5, 8, { v: "heichalFront" }],
      [1, 13, 17, { v: "mizbeach" }],
      [1, 18, 20, { p: "המנורה" }],
      [1, 0, 20, { v: "__general" }],
      [2, 1, 18, { v: "mizbeach" }],
      [3, 1, 11, { p: "המנורה" }],
      [3, 12, 16, { p: "שולחן לחם הפנים" }],
      [3, 17, 17, { p: "מזבח הזהב" }],
      [3, 18, 18, { p: "הכיור" }],
      [3, 0, 18, { v: "kodesh" }],
      [4, 1, 2, { v: "kodeshHakodashim" }],
      [4, 6, 6, { p: "פשפשי ההיכל" }],
      [4, 8, 8, { v: "ulam" }],
      [4, 0, 13, { v: "heichalFront" }],
      [5, 1, 2, { v: "harHabayit" }],
      [5, 3, 3, { p: "הסורג" }],
      [5, 4, 6, { v: "azarah" }],
      [5, 7, 11, { v: "ezratNashim" }],
      [5, 12, 16, { v: "azarah" }],
      [5, 17, 17, { p: "לשכת הגזית — הסנהדרין" }],
      [5, 0, 17, { v: "harHabayit" }],
      [6, 1, 5, { v: "ezratNashim" }],
      [6, 0, 16, { v: "azarah" }],
      [7, 13, 23, { v: "azarah" }],
      [7, 0, 23, { v: "harHabayit" }],
      [8, 0, 12, { v: "harHabayit" }]
    ]
  };
  // a book given as a number, "10", "id:10", a title ("מלכים א", "דברי הימים ב", with or without its marks) or an object holding one of them
  function ui_bookOf(b) {
    if (b == null) return null;
    if (typeof b === "object") {
      for (const k of ["id", "bookId", "currentId", "bookUid", "title", "name", "currentBook"]) {
        const r = ui_bookOf(b[k]);
        if (r) return r;
      }
      return null;
    }
    if (typeof b === "number") return b === 89 || b === 337 ? b : null;
    const s = String(b).trim();
    const n = /^(?:id:)?(\d+)$/.exec(s);
    if (n) return ui_bookOf(+n[1]);
    const t = s.replace(/[֑-ׇ]/g, "").replace(/[׳״'"]/g, "").replace(/[\s,_-]+/g, " ").trim();
    if (/^(?:משנה )?מי?דות$|^Mishnah Middot$/i.test(t)) return 89;
    if (/^(?:משנה תורה )?(?:הלכות )?בית הבחירה$|Chosen Temple/i.test(t)) return 337;
    return null;
  }
  // line index -> { ch, v } by ui_BASE (the largest chapter base not after the line; v 0 = the heading line)
  function ui_lineToVerse(book, index) {
    const B = ui_BASE[book];
    if (!B || !(index >= 0)) return null;
    let ch = 0;
    for (const k of Object.keys(B)) if (B[k] <= index && (!ch || B[k] > B[ch])) ch = +k;
    return ch ? { ch, v: index - B[ch] } : null;
  }
  // a reference string ("מלכים א, ז, כג" as the DB's heRef, or "מלכים א פרק ז") -> { ch, v } (v 0 = the chapter only)
  function ui_refToVerse(ref) {
    const s = String(ref || "").replace(/[֑-ׇ]/g, "").replace(/[׳״'"]/g, "");
    const p = /פרק\s+([א-ת]{1,3})(?:\s*,?\s*(?:פסוק\s+)?([א-ת]{1,3}))?\s*$/.exec(s);
    const m = p || /,\s*([א-ת]{1,3})\s*,\s*([א-ת]{1,3})\s*$/.exec(s);
    if (!m) return null;
    const ch = ui_gematria(m[1]), v = m[2] ? ui_gematria(m[2]) : 0;
    return ch > 0 ? { ch, v } : null;
  }
  // a number in Hebrew letters (15 = ט״ו, 16 = ט״ז) for the toast
  function ui_heNum(n) {
    const L = [[400, "ת"], [300, "ש"], [200, "ר"], [100, "ק"], [90, "צ"], [80, "פ"], [70, "ע"], [60, "ס"], [50, "נ"], [40, "מ"], [30, "ל"], [20, "כ"], [10, "י"], [9, "ט"], [8, "ח"], [7, "ז"], [6, "ו"], [5, "ה"], [4, "ד"], [3, "ג"], [2, "ב"], [1, "א"]];
    let s = "";
    for (const [v, c] of L) while (n >= v) { if (n === 15 || n === 16) { s += n === 15 ? "טו" : "טז"; n = 0; break; } s += c; n -= v; }
    return s.length > 1 ? s.slice(0, -1) + "״" + s.slice(-1) : s + "׳";
  }
  // the reading position of an event -> { book, ch, v } or null (another book, another button, nothing readable)
  function ui_readingOf(d) {
    if (!d || typeof d !== "object") return null;
    if (d.itemId && d.itemId !== UI_BOOK_ITEM) return null;
    let book = null;
    for (const k of ["currentId", "currentBookId", "currentBook", "bookId", "book", "id", "bookUid", "title"]) {
      book = ui_bookOf(d[k]);
      if (book) break;
    }
    const ix = [d.currentIndex, d.index, d.lineIndex].map((x) => (typeof x === "string" && /^\d+$/.test(x) ? +x : x)).find((x) => typeof x === "number" && isFinite(x));
    if (!book) {
      // 2.0.2: the button clicked in ANOTHER book (the manifest shows it in the books that have the most links to this house's sources):
      // the book and the line go to 72-words.js, which asks for the links of that line (ctx.ui.reading.linked)
      if (d.itemId !== UI_BOOK_ITEM) return null;
      const num = (x) => (typeof x === "number" && isFinite(x) ? x : typeof x === "string" && /^\d+$/.test(x) ? +x : null);
      const uid = /^id:(\d+)$/.exec(String(d.currentBookUid || d.bookUid || ""));
      let oid = uid ? +uid[1] : null;
      for (const k of ["currentId", "id"]) if (oid == null) oid = num(d[k]);
      let title = "";
      for (const k of ["currentBook", "currentBookId", "bookId", "title"]) if (!title && typeof d[k] === "string" && d[k] && !/^(?:id:)?\d+$/.test(d[k])) title = d[k];
      if (oid == null && !title) return null;
      return { other: { id: oid, title, index: ix == null ? null : ix } };
    }
    const cv = ix != null ? ui_lineToVerse(book, ix) : ui_refToVerse(d.currentRef || d.ref);
    return cv ? { book, ch: cv.ch, v: cv.v } : { book, ch: 0, v: 0 };
  }
  function ui_bookEvent(d) {
    const r = ui_readingOf(d);
    if (!r) return;
    if (ui_bookGo) {
      try { ui_bookGo(r); } catch (_) {}
    } else {
      ui_bookQueue.push(r);
      if (ui_bookQueue.length > 4) ui_bookQueue.shift();
    }
  }
  try {
    if (typeof window !== "undefined" && window.Otzaria && typeof window.Otzaria.on === "function") {
      window.Otzaria.on("reader.toolbar_item_clicked", (d) => ui_bookEvent(d));
      window.Otzaria.on("plugin.page_opened", (d) => { if (d && d.param && typeof d.param === "object") ui_bookEvent(d.param); });
      window.Otzaria.on("plugin.boot", (p) => { ui_bootVersion = (p && p.plugin && p.plugin.version) || ui_bootVersion; });
    }
  } catch (_) {
  }
  // ===== explanation texts of the views (Hebrew, verse reference first; wording after research/*.md) =====
  // 1.0.1-L: the pillars' text is shared by the far view "יכין ובועז" (yachinBoazFull, L.58) and the in-doorway place (yachinBoaz)
  var ui_INFO = {
    __general: "מודל בית המקדש השני על פי מסכת מידות, יוסף בן מתתיהו ומחקר ארכיאולוגי.",
    harHabayit: "לשון המשנה (מידות ב, א): ״הר הבית היה חמש מאות אמה על חמש מאות אמה, רבו מן הדרום, שני לו מן המזרח, שלישי לו מן הצפון, מעוטו מן המערב. מקום שהיה רב מדתו, שם היה רב תשמישו״; (ב, ב): ״כל הנכנסין להר הבית נכנסין דרך ימין ומקיפין ויוצאין דרך שמאל״.\nבקצרה — המחלוקות בכרטיס זה (הפירוט — במתגים שבתפריט, תחת ״שיטות ומחלוקות״):\n• **גובה כותל המזרח:** לרמב״ם — רק הכותל שמעל השער נמוך (ברירת המחדל); לתפארת ישראל — כל הכותל מעט יותר מעשרים; לפסקי תוספות — שש אמות; לרבינו שמעיה — כותל החיל.\n• **שער טדי:** ״שתי אבנים מטות זו על גב זו״ (ברירת המחדל); ולראבי״ה — ״שני אבנים זקופות״ (״לא מאומת״).\n**ברטנורא:** מוקף חומה סביב; ״רובו מן הדרום״ — המרחק מחומת הר הבית לחומת העזרה בדרום גדול מן המרחק שבמזרח, והמזרחי מן הצפוני, והצפוני מן המערבי; הנכנסים דרך שערי חולדה שמן הימין מקיפים דרך שער טדי (ברטנורא מידות ב, א; ב, ב).\n**תוספות יום טוב:** רוחב העזרה קל״ה ואורכה קפ״ז, ונותרו שס״ה אמה לצפון ולדרום ושי״ג למזרח ולמערב — דרך משל: דרום ר״נ, מזרח רי״ג, צפון קט״ו, מערב ק׳; ״רוב תשמישו״ — לשכות ובתים רבים למשמשי הבית נוסף על שבמשנה (שלטי הגיבורים מנה שלושים); ההר לא היה מקורה אלא על גבי האצטבאות שבצדדים (פסחים א, ה); ורובו מן הדרום לפי ששם כניסת כל אדם מן העיר שבנגב (תוספות יום טוב מידות ב, א).\n**תפארת ישראל:** הרווח שבתוך החומה ת״ק על ת״ק; הסורג מקיף את העזרה ברחוק עשר אמות בשווה, אבל המרחק מחומת ההר עד הסורג — רובו בדרום; לשלטי הגיבורים: דרום רס״ה, מזרח ר״נ, צפון ק׳, מערב ס״ג, ובכל הרווח לשכות — ודירת חמישה עשר הממונים; רוב האצטבאות המקורות בדרום לשבת בהן בגשם, וכל הר הבית מקורה (ירושלמי תענית) — וארובות בקירוי לאור; ובבועז — רק הר הבית שמחוץ לחומה הפנימית מקורה, ולא העזרות (תפארת ישראל מידות ב, א; בועז ב, א).\nבמודל: הר הבית חמש מאות על חמש מאות אמה, וחמישה שערים לו; העזרה בצפון־מערבו — רוב השטח הפתוח בדרום; הסטיו המלכותי של הורדוס בדרום (יוסף בן מתתיהו) — מתג משלו.",
    shushanGate: "לשון המשנה (מידות א, ג): ״שער המזרחי, עליו שושן הבירה צורה, שבו כהן גדול השורף את הפרה ופרה וכל מסעדיה יוצאים להר המשחה״.\n**ברטנורא:** כשעלו מן הגולה ציוו להם מלכי פרס לצייר צורת שושן הבירה על שערי הבית, כדי שיהיה להם מורא מלכות, וציירוה בשער המזרח. המשנה כרבי מאיר, שאין פרה אדומה נשרפת אלא בכהן גדול — ואינה הלכה; ״מסעדיה״ — הכהנים המסייעים לשורף; ״הר המשחה״ — הר הזיתים שבמזרח ירושלים, ששם שורפים את הפרה (ברטנורא מידות א, ג).\n**תוספות יום טוב:** מפנה לפירוש הר״ב בכלים יז, ט — ״שתי אמות היו בשושן הבירה״, אמות המידה שהיו קבועות בשער זה; ועל כהן גדול השורף — הרמב״ם בפרה (ג, ח) פירש שבתמידות הייתה נעשית בכהן גדול אף שכשרה בכהן הדיוט (תוספות יום טוב מידות א, ג).\n**תפארת ישראל:** בני הגולה ציירו מעל השער את שושן הבירה, המטרופולין של מלך פרס, לכבוד המלכות — לומר שלמלכות זו הם שייכים, או כדי לפרסם לבאים דרך שם שמלך פרס בנה את הבית, זכר כנגד שער ההיכל המכוון כנגד שער זה. הפרה כשרה גם בכהן אחר, אלא שרגילה להיעשות בכהן גדול; ויוצאים בשער המזרח לפי שהר הזיתים במזרח (תפארת ישראל מידות א, ג).\nבמודל: השער המזרחי של הר הבית, על ציר ההיכל; צורת שושן אינה מצוירת. שתי אמות המידה (כלים יז, ט) — על שתי מזוזות השער מבחוץ; ולרש״י — בחדר שעל גבי שער העזרה (בתפריט, תחת ״שיטות ומחלוקות״, ״שושן הבירה ושתי האמות״).\nבקצרה — המחלוקת בשתי האמות (הפירוט — במתג ״שושן הבירה ושתי האמות״ שבתפריט, תחת ״שיטות ומחלוקות״):\n• לרמב״ם ולברטנורא במידות — האמות בשער שושן, שער המזרח של הר הבית (ברירת המחדל).\n• לרש״י, לברטנורא בכלים ולתוספות — בחדר שעל גבי שער המזרח של העזרה.\nכותל המזרח הנמוך (מידות ב, ד): ״כל הכתלים שהיו שם, היו גבוהים, חוץ מכתל המזרחי, שהכהן השורף את הפרה עומד בראש הר המשחה, ומתכון ורואה בפתחו של היכל בשעת הזית הדם״. רש״י (יומא טז.): ״הוא התחתון לרגלי הר הבית שבו נכנסין לחיל״, וכן ברטנורא. בקצרה — השיטות בגובהו (הפירוט — במתגים שבתפריט, תחת ״שיטות ומחלוקות״): הרמב״ם — רק הכותל שעל גבי שער שושן נמוך; תפארת ישראל — כל כותל המזרח מעט יותר מעשרים; פסקי תוספות — ״כותל מזרחי גבוה שש אמות״, ולחק נתן — שש אמות מעל השער; רבינו שמעיה — כותל החיל המזרחי, כעשר אמות.\nהכבש שמחוץ לשער (פרה ג, ו): ״וכבש היו עושים מהר הבית להר המשחה, כפין על גבי כפין, וכפה כנגד האטם, מפני קבר התהום, שבו כהן השורף את הפרה, ופרה וכל מסעדיה, יוצאין להר המשחה״.\n**ברטנורא** (שם): ״רגלי הכפה שהכפה נשענת עליהם נקראין אטם. ואין רגלי הכפה העליונה כנגד רגלי התחתונה, אלא כנגד הכפה עצמה, דכנגד אטם העליונה עומד חלל התחתונה״; ״מפני קבר התהום — שלא תהיה שם טמאה רצוצה שהיא בוקעת ועולה״.\n**הרמב״ם** (פרה אדומה ג, א): ״וכבש היו עושין מהר הבית להר המשחה ותחתיו בנוי כפין כפין וכפה על כל שני כפין כדי שיהיו שני רגלי הכפה על גג שני כפין שתחתיה. כדי שתהיה תחת הכל חלול מפני קבר התהום״.\nובשקלים (ד, ב): ״כבש פרה, וכבש שעיר המשתלח ולשון שבין קרניו... באין משירי הלשכה״.\nבמודל: הכבש יוצא משער שושן מזרחה, על שתי שורות של כיפין — רגלי הכיפה העליונה מעל חלל התחתונה, וכל כיפה עליונה מעל רגל תחתונה. הוא מצויר לאורך 150 אמה בלבד; הר המשחה אינו מצויר. גובהו, רוחבו, אורכו ומידות הכיפין — בחירת מודל.",
    royalStoa: "בגמרא (פסחים יג:; וכן נב:, וסוכה מה.): ״אמר רחבא אמר רבי יהודה: הר הבית סטיו כפול היה. תניא נמי הכי: הר הבית סטיו כפול היה. רבי יהודה אומר: איסטוונית היתה נקראת — סטיו לפנים מסטיו״.\n**רש״י** (פסחים יג:): ״סטיו כפול היה — האיצטבא סביב סביב מקפת, ובתוך אותו הקף עוד אחר״; (סוכה מה.): ״אצטבאות מקיפות אותו, ואצטבאות אחרים היקף לפנים מהיקף״; (פסחים יא:): ״על גב האיצטבא — סטיו שהיה בהר הבית, ששם מתקבצין ויושבין בני אדם״.\nשמו ופרטיו של הסטיו שבדרום ההר, המכונה הסטיו המלכותי — בזיליקה בת ארבע שורות של עמודים שבנה הורדוס — מיוסף בן מתתיהו בלבד (קדמוניות טו), ואינם מדברי חז״ל.\nבמודל: הבזיליקה שבדרום ההר; צורתה ומידותיה — בחירת מודל.",
    ezratNashim: "לשון המשנה (מידות ב, ה): ״עזרת הנשים היתה ארך מאה ושלשים וחמש על רחב מאה ושלשים וחמש. וארבע לשכות היו בארבע מקצועותיה, של ארבעים ארבעים אמה. ולא היו מקורות... וחלקה היתה בראשונה, והקיפוה כצוצרה, שהנשים רואות מלמעלן, והאנשים מלמטן, כדי שלא יהו מערבין. וחמש עשרה מעלות עולות מתוכה לעזרת ישראל, כנגד חמש עשרה מעלות שבתהלים, שעליהן הלוים אומרים בשיר. לא היו טרוטות, אלא מקפות כחצי גרן עגלה״.\n**ברטנורא:** ״אורך״ — מן המזרח למערב, ״רוחב״ — מן הצפון לדרום; ״חלקה״ — פרוצה, שלא הייתה מוקפת מחיצה (הרמב״ם); ״כצוצטרה״ — גזוזטרא הקיפו סביב, שיהיו הנשים עומדות למעלה והאנשים למטה לראות בשמחת בית השואבה, כדי שלא יבואו לידי קלות ראש; חמש עשרה מעלות — גובה קרקע עזרת ישראל מעזרת נשים; ״לא היו טרוטות״ — ארוכות ובעלות זוויות, אלא עגולות כחצי גורן (ברטנורא מידות ב, ה).\n**תוספות יום טוב:** הלשכות במקצועות שבפנים, ולא כתמונת בית שני שנדפסה בוונציה; אם מרובעות היו — אינו יודע; ״לא היו מקורות״ — כדי לבשל בהן את זבח העם; ״חלקה״ — וצריך לומר שמעקה היה לה, שהרי גבוהה הייתה שש אמות מהר הבית (תוספות יום טוב מידות ב, ה).\n**תפארת ישראל:** בתוך חומת העזרה, אבל רק לצד מזרחה, ושער לה במזרח (רש״י יומא טז.) שאין לו שם פרטי; סימן למידתה — ״נשים דעתן קלה״; ״חלקה״ — כתליה חלקים בלי בליטה, והגזוזטרא — תקרה הבולטת מאמצע גובה הכתלים; הלויים עומדים בשמחת בית השואבה בחמש עשרה שורות על המעלות, ובכל שורה שיר המעלות אחר; והמעלות עגולות כדי שיוכלו הכול לראותם, ובולטות באמצע כבטן ומחזיקות מזמרים הרבה (סוכה נא:) (תפארת ישראל מידות ב, ה).\nבמודל: עזרת הנשים מאה שלושים וחמש על מאה שלושים וחמש אמה, ארבע לשכותיה במקצועותיה בלא תקרה, הזיזים של הגזוזטרא בכתליה, באמצע גובהם (הקרשים והמעקה שעליהם — בהדגמת ״שמחת בית השואבה״), וחמש עשרה המעלות, מוקפות כחצי גורן, אל שער ניקנור; שערי צפון ודרום (יוסף בן מתתיהו) — בתפריט, תחת ״שיטות ומחלוקות״.\nבקצרה — המחלוקות בכרטיס זה (הפירוט — במתגים שבתפריט, תחת ״שיטות ומחלוקות״):\n• שער העליון — במשנה בסוכה (ה, ד) ״שער העליון שיורד מעזרת ישראל לעזרת נשים״, הוא שער ניקנור שבמערבה; והרמב״ם (כלי המקדש ז, ו): ״ולמה נקרא שער עליון לפי שהוא למעלה מעזרת נשים״, ושערה המזרחי — ״שער התחתון״. ובשקלים (ו, ג) ובמידות (ב, ו) ״שער העליון״ הוא שער בדרום העזרה.\n• שערי עזרת נשים — לחז״ל שער אחד, במזרח; ליוסף בן מתתיהו — גם בצפון ובדרום.\nושתים עשרה המעלות שבתוך החיל — מהן עולים לשערה המזרחי (מידות ב, ג).\nמקום ארבע הלשכות: לתוספות יום טוב ״במקצעותיה שבפנים״ (ברירת המחדל); ולרא״ש — ״מבחוץ״, כציורו (בתפריט, תחת ״שיטות ומחלוקות״).\nחמש עשרה המעלות: לרמב״ם — כל מעלה חצי עיגול, לפני השער (ברירת המחדל); ולרי״ד ולרבינו יהונתן — ארוכות, כרוחב העזרה (בתפריט, תחת ״שיטות ומחלוקות״).",
    nikanor: "שער ניקנור — השער המזרחי של העזרה, מכוון כנגד בית קודש הקדשים (רמב״ם בית הבחירה ה, ד).\nלשון המשנה (מידות ב, ג): ״כל השערים שהיו שם, נשתנו להיות של זהב, חוץ משער נקנור, מפני שנעשה בהן נס. ויש אומרים, מפני שנחשתן מצהיב״; (ב, ו): ״שבמזרח, שער נקנור. ושני פשפשים היו לו, אחד מימינו ואחד משמאלו״; (יומא ג, י): ״ניקנור נעשו נסים לדלתותיו, והיו מזכירין אותו לשבח״.\nבקצרה — המחלוקת בכרטיס זה (הפירוט — במתג ״שער העליון״ שבתפריט, תחת ״שיטות ומחלוקות״):\n• לחכמים — שבעה שערים לעזרה (ברירת המחדל).\n• לאבא יוסי בן חנן — שלושה עשר, וביניהם ״שער העליון״.\n• לרמב״ם — ״שער זה הוא הנקרא שער העליון והוא שער ניקנור״.\n**ברטנורא:** הנס — ״שהלך לאלכסנדריא של מצרים להביא דלתות, ובחזרתו עמד סער גדול בים לטבען, נטלו אחת מהן והטילוה בים להקל מעליהם, בקשו להטיל האחרת, אמר להם הטילוני עמה, מיד נח הים מזעפו. כיון שהגיעו לנמל של עכו היתה מבצבצת ויצאה מתחת דפני הספינה״; ״מצהיבות״ — כמו מזהיבות, שמראיתן דומה לזהב, לפיכך לא הוצרכו לעשותו של זהב (ברטנורא יומא ג, י; ברטנורא מידות ב, ג).\n**תוספות יום טוב:** ״נשתנו להיות של זהב״ — שכשעלו מן הגולה לא היו עשירים, וזהו שדקדק הרמב״ם (בית הבחירה א, יא): ״אפילו שערי העזרה מצפין אותן זהב אם מצאה ידם״; ״מצהיב״ — כתבנית הזהב (מן הספרא); הפשפשין — ״דלתות קטנות שעושים בבתים הגדולים בעצם דלתות השערים הגדולים כדי שיהיו נוחין לפתוח בכל עת שירצו״ (הרמב״ם) (תוספות יום טוב מידות ב, ג; תוספות יום טוב שקלים ו, ג).\n**תפארת ישראל:** ״שהביא דלתות נחושת קלל... לביהמ״ק״, ולזיכרון הנס העמידו את הדלתות ״לשער מזרח שיהיו נגד פתח ההיכל״; ״נחשתן מצהיב״ — יותר משל זהב; ואף שהיה לו ״פשפש בצפון ופשפש בדרום״ כשער ההיכל, לא נקרא ״שער הגדול״ — שם זה לשער ההיכל בלבד, בערך קדושתו (תפארת ישראל יומא ג, י; תפארת ישראל מידות ב, ג; ד, ב).\nבמודל: השער המזרחי של העזרה, בין עזרת נשים לעזרת ישראל, על ציר ההיכל; דלתותיו נחושת שמצהיבה כזהב, ושני פשפשין משני צדיו; שתי לשכותיו — לכל אחת כרטיס משלה. בו העמידו את הסוטה ואת המצורע ביום טהרתו (סוטה א, ה; נגעים יד, ח). לרמב״ם (בית הבחירה ה, ה) הוא ״שער העליון״ — בתפריט, תחת ״שיטות ומחלוקות״.\n**מזוזה** (יומא יא.): ״כל השערים שהיו שם לא היה להם מזוזה, חוץ משער ניקנור, שלפנים ממנו לשכת פרהדרין״. במודל: על העמוד הצפוני, מימין הנכנס — ״דרך ביאתך״ (יומא יא:); בטפח החיצון — ״בטפח הסמוך לרשות הרבים״ (מנחות לג:); ״בתחלת שליש העליון״ של הפתח (מנחות לג.); וזקופה, כפירוש רש״י שם — ולרבנו תם שבתוספות, שכובה. צורתה ומידותיה — בחירת מודל.",
    azarah: "לשון המשנה (מידות ה, א): ״כל העזרה היתה ארך מאה ושמונים ושבע על רחב מאה ושלשים וחמש. מן המזרח למערב מאה ושמונים ושבע, מקום דריסת ישראל אחת עשרה אמה, מקום דריסת הכהנים אחת עשרה אמה, המזבח שלשים ושתים, בין האולם ולמזבח עשרים ושתים אמה, ההיכל מאה אמה, ואחת עשרה אמה לאחורי בית הכפרת״; (ה, ב): ״מן הצפון לדרום מאה ושלשים וחמש, הכבש והמזבח ששים ושתים. מן המזבח לטבעות שמנה אמות, מקום הטבעות עשרים וארבע, מן הטבעות לשלחנות ארבע, מן השלחנות ולננסין ארבע. מן הננסין לכתל העזרה שמנה אמות, והמותר בין הכבש לכתל ומקום הננסין״.\nבקצרה — המחלוקות בכרטיס זה (הפירוט — במתגים שבתפריט, תחת ״שיטות ומחלוקות״):\n• **שער העליון:** לחכמים — שבעה שערים לעזרה (ברירת המחדל); לאבא יוסי בן חנן — שלושה עשר, וביניהם ״שער העליון״; ולרמב״ם — ״שער זה הוא הנקרא שער העליון והוא שער ניקנור״.\n• **מקום המזבח בעזרה:** כתנא דמידות והרמב״ם — רובו בדרום (ברירת המחדל); לרש״י — עוד שתי אמות דרומה; לרבי יהודה — באמצע העזרה; לרבי יוסי — כולו בצפון.\n• **בין האולם ולמזבח — רוחבו:** במודל — לכל רוחב העזרה (ברירת המחדל); לתוספות ר״י הלבן — כנגד המזבח והכבש בלבד.\n• **בניין הורדוס:** אבן בהירה אחידה (ברירת המחדל); שיש בשלושה גוונים — ״אפיק שפה ועייל שפה״ (בבא בתרא ד.).\n• **שמות שערי הצפון:** לתפארת ישראל ולחק נתן — שער הנשים קטן, ושער השיר הוא בית המוקד (ברירת המחדל); והאפשרות שתפארת ישראל דוחה — שער הנשים הוא בית המוקד.\n**ברטנורא:** כל היקף העזרה — הבית לצד מערבו, והחצר והמזבח במזרחו; מקום דריסת רגלי ישראל — עזרת ישראל, ושל הכהנים — עזרת כהנים; ״ההיכל מאה אמה״ — כותל האולם וחללו, כותל ההיכל וחללו, אמה טרקסין, קודש הקדשים, כותל ההיכל למערב, התא וכותל התא; ״אחורי בית הכפורת״ — מכותל ההיכל החיצון עד כותל העזרה המערבי אחת עשרה אמה של חלל עם עובי הכותל (ברטנורא מידות ה, א).\n**תוספות יום טוב:** ״ששים ושתים״ — ולא שישים וארבע, ש״נמצא פורח אמה על יסוד ואמה על סובב״ (זבחים סב.); ״מן הטבעות לשלחנות ארבע״ — לרש״י (יומא טז.) מקום השולחנות עצמם ארבע נוספות, שהיו שמונה, ארבע על ארבע; ולרמב״ם (בית הבחירה ה) מקום השולחנות שמונה אמות — ״מן הטבעות למחצית השלחנות ארבע וממחצית השלחנות לננסין ארבע״ (הכסף משנה); המותר — לרש״י עשרים ואחת ולרמב״ם עשרים וחמש, לחצאין: ״בית המטבחיים י״ב אמות ומחצה, ובין הכבש לכותל דרומית י״ב אמה ומחצה״; ומכאן לתנא דמידות המזבח עומד גם בצפון — לרמב״ם שישים ומחצה מקיר המזבח עד כותל הצפון, ולרש״י שישים ושתיים ומחצה; והתוי״ט: משנה זו כפשטה — המותר לחצאין — ולא רבי אליעזר בן יעקב (תוספות יום טוב מידות ה, ב).\n**תפארת ישראל:** ״המזבח שלשים ושתים״ — אף שלא היה יסוד ברוב המזרח, אמת היסוד שבקרן מזרחית־צפונית נמנית; ״אחורי בית הכפורת״ — הרווח שבין כותל התאים המערביים לכותל העזרה; ובבועז — הר״ב שכלל את עובי הכותל בי״א האמה — ״דברי הר״ב נשארין בתימה״, ורש״י (יומא טז:) והרמב״ם (ה, יב) — י״א אמה של רווח מלבד הכותל; הכבש והמזבח — שתי האמות העליונות של הכבש פורחות מעל אמת היסוד ואמת הסובב; הטבעות — ארבע שורות ממזרח למערב, שש בכל שורה; השולחנות — שמונה, אמה על אמה, בשורה אחת מצפון לדרום על שמונה האמות שבין הטבעות לננסין (כרמב״ם), ולתוספות (יומא טז:) שתי שורות של ארבעה; ״המותר״ — עשרים וחמש, שתים עשרה ומחצה לכאן ולכאן (תפארת ישראל מידות ה, א; ה, ב; בועז ה, א).\nבמודל: העזרה מאה שמונים ושבע על מאה שלושים וחמש אמה — עזרת ישראל ועזרת הכהנים, אחת עשרה אמה כל אחת, והדוכן ביניהן; מקום המזבח ברוחב העזרה — בתפריט, תחת ״שיטות ומחלוקות״ (60.5 אמה מכותל הצפון כחשבון הרמב״ם; רש״י 62.5; רבי יהודה; רבי יוסי).",
    mizbeach: "לשון המשנה (מידות ג, א): ״המזבח היה שלשים ושתים על שלשים ושתים. עלה אמה וכנס אמה, זה היסוד. נמצא שלשים על שלשים. עלה חמש וכנס אמה. זה הסובב. נמצא עשרים ושמנה על עשרים ושמנה. מקום הקרנות אמה מזה ואמה מזה. נמצא עשרים ושש על עשרים ושש. מקום הלוך רגלי הכהנים, אמה מזה ואמה מזה. נמצא עשרים וארבע על עשרים וארבע, מקום המערכה... וחוט של סקרא חוגרו באמצע, להבדיל בין הדמים העליונים לדמים התחתונים. והיסוד היה מהלך על פני כל הצפון ועל פני כל המערב, ואוכל בדרום אמה אחת, ובמזרח אמה אחת״; (ג, ב): ״ובקרן מערבית דרומית היו שני נקבים, כמין שני חטמין דקין, שהדמים הנתנין על יסוד מערבי ועל יסוד דרומי, יורדין בהן ומתערבין באמה, ויוצאין לנחל קדרון״; (ג, ג): ״למטה ברצפה באותה הקרן, מקום היה שם אמה על אמה, וטבלא של שיש, וטבעת היתה קבועה בה, שבו יורדין לשית ומנקין אותו״.\nבקצרה — המחלוקות בכרטיס זה (הפירוט — במתגים שבתפריט, תחת ״שיטות ומחלוקות״):\n• **בית המטבחים:** לברטנורא — חתיכת ארז על כל עמוד (ברירת המחדל); למאירי — קורות מעמוד לעמוד; לראבי״ה ולגר״א — שמונה העמודים בשורה אחת.\n• **מקום המזבח בעזרה:** כתנא דמידות והרמב״ם — רובו בדרום (ברירת המחדל); לרש״י — עוד שתי אמות דרומה; לרבי יהודה — באמצע העזרה; לרבי יוסי — כולו בצפון.\n• **מידות המזבח:** כמשנה — 32, 30, 28, 26, 24 (ברירת המחדל); לרש״י — הסובב באמה בת חמישה; לרמב״ם — היסוד והסובב באמה בת חמישה; לראב״ד — הקרנות שני טפחים פנימה; לרבי יוסי — המזבח הראשון, 28.\n• **יסוד המזבח:** לרב — היסוד בצפון ובמערב בלבד (ברירת המחדל); ללוי — יסוד סביב כל המזבח.\n• **התפוח:** כרי אפר עגול באמצע המזבח (ברירת המחדל); לראב״ד — טבלה מרובעת גבוהה אמה, והמערכות אצלה ונוגעות בה.\n• **מניין המערכות:** לרבי יוסי — שלוש, וכן פסק הרמב״ם (ברירת המחדל); לרבי יהודה — שתיים; לרבי מאיר — ארבע.\n• **המערכות ביום הכיפורים:** ביום הכיפורים — מערכה אחת נוספת, לכל אחד מן התנאים.\n• **נקבי ספלי הניסוך:** לרש״י ולברטנורא — ״כמין שני חוטמין״ (ברירת המחדל); לתוספות, לריטב״א ולמאירי — הנקבים בתחתית הספלים.\n• **הרווח שבין הכבש למזבח:** לרש״י ולרמב״ם — כחוט השערה, ״אויר מעט״ (ברירת המחדל); לתוספות — אויר גדול וניכר; לרבינו חיים — יותר מאמת הסובב.\n• **הכבשים הקטנים:** לרש״י — שני כבשים קטנים, לסובב וליסוד (ברירת המחדל); לתוספות — גם שלישי.\n**ברטנורא:** בונים בדפוסים — דפוס מרובע של ארבעה קרשים, ל״ב על ל״ב וגובהו אמה, ממלאים אותו אבנים וסיד וזפת ועופרת מותכת, והוא היסוד; דפוס שני ל׳ על ל׳ וגובהו חמש — הסובב; דפוס שלישי כ״ח על כ״ח וגובהו שלוש — מקום המערכה, ראשו של מזבח; ודפוס אמה על אמה בכל זווית — הקרן. ״מקום הילוך רגלי הכהנים״ — שלא יהיו צריכים להלך בין הקרנות. חוט הסיקרא — חוט אדום סביב למזבח באמצעו, לסוף חמש אמות של גובהו, אמה למטה מעליונו של סובב; דמים עליונים — חטאת בהמה ועולת העוף. היסוד — המזבח כולו בחלקו של בנימין חוץ מאמה בדרום ואמה במזרח שבחלקו של יהודה, ו״בחלקו של טורף״ נותנים דמים, לפיכך אין יסוד בקרן דרומית־מזרחית, ומפני זה נקרא החלק האמצעי סובב — שהוא מקיף את כל הקרנות. שני הנקבים — למטה באמה של יסוד: על יסוד מערבי שופכים שיירי דם החטאות הפנימיות, ועל יסוד דרומי — של החיצוניות; מתערבים באמת המים שבעזרה ויוצאים לנחל קדרון, ובעלי גנות קונים אותם מן הגזברים לזבל; הטבלא — שבה יורדים לשית, החלל שתחת המזבח כנגד מקום הנסכים (ברטנורא מידות ג, א; ג, ב; ג, ג).\n**תוספות יום טוב:** ל״ב על ל״ב — מן הצד, מצפון וממערב, שבמזרח ובדרום לא היה אלא ל״א (זבחים נד.); האמות של הקרן, הסובב והיסוד בנות חמישה טפחים (כלים יז, י) — לרש״י גובהן בלבד, ולרמב״ם אף הכניסה, ולכן כתב ״ל׳ אמה ושני טפחים״, וכ״ד אמה וארבעה טפחים למקום המערכה — והראב״ד: ארבעת הטפחים הם כניסת הקרנות מדפני המזבח. ״עלה שלש״ — מקום הקרנות, ״ושלש אמות קומתו״ משפת הסובב ולמעלה (הכסף משנה); חוט הסיקרא — ״והיתה הרשת עד חצי המזבח״ (זבחים נג.), והרמב״ם ״כששה טפחים״ — שאי אפשר לצמצם; הנקבים לנסכים נעשו בשעת הבניין, שפגימה אחר כך פוסלת (תוספות יום טוב מידות ג, א).\n**תפארת ישראל:** בפתיחה לפרק — כל מעשה המזבח בדפוסים, ושתי קורות במקצוע מזרחית־דרומית שלא יהיה שם יסוד; באמה העליונה של הסובב, מעל חוט הסיקרא, כיור של פרחים וציצים בולטים — ״כרכוב״ (זבחים סב.); הקרנות חלולות; שתי האמות שבין הקרנות ושל הילוך הכהנים משוקעות קצת, כמעקה, שלא יחליקו הכהנים; ״אריאל״ — על שם אש המערכה שהייתה כתמונת ארי; הנקב המערבי לשיירי דם הפנימיות והמזרחי לחיצוניות, ושפה גבוהה ביסוד כמזחילה; ה״שית״ — חלל קטן תחת היסוד בקרן, על שם שתיתת הדם, והשיתין — על שתיתת היין; ובבועז — הטבלא יורדת לשית של הדמים, ולא לשיתין של הנסכים, שלהם לול בין הכבש למזבח (סוכה מט.) (תפארת ישראל מידות ג, א; ג, ב; ג, ג; בועז ג, ב).\nבמודל: המזבח ל״ב על ל״ב, יסוד אמה, סובב בגובה שש, קרנות אמה על אמה, חוט הסיקרא באמצע, והיסוד חסר בקרן דרומית־מזרחית; מקומו בעזרה — בתפריט, תחת ״שיטות ומחלוקות״ (רובו בדרום, כחשבון הרמב״ם); קווי המידות — בכרטיס מידות המזבח; הכיור של הסובב, הנקבים שביסוד והטבלא של השית אינם מצוירים.\nהטבלא של שיש והטבעת, שבה יורדים לשית, מצוירת ברצפה אצל קרן דרומית־מערבית, ממערב לסוף הכבש ליסוד; מקומה המדויק — בחירת מודל.\nהיסוד כבית קיבול: רש״י (שמות כט, יב): ״אל יסוד המזבח. כמין בליטת בית קבול עשוי לו סביב סביב, לאחר שעלה אמה מן הארץ״. ובמקום שאין יסוד — רש״י (זבחים נד.): ״למעלה מג׳ דלאו קרקע הוא, עשוי כמין בליטה קטנה כנגד אותה הקרן לקבל בה דם עולת העוף שלא יפול לארץ״. במודל: שפה נמוכה על קצה גג היסוד; ובקרן דרומית־מזרחית בליטה קטנה, חצי אמה מעל הרצפה, הנמשכת לאורך הדרום עד אמת היסוד שבקרן דרומית־מערבית, אצל שני הנקבים. המשך הבליטה אל הנקבים, ומידות השפה והבליטה — בחירת מודל.",
    heichalFront: "לשון המשנה (מידות ד, ו): ״וההיכל מאה על מאה, על רום מאה. האטם שש אמות, וגבהו ארבעים אמה, אמה כיור, ואמתים בית דלפה, ואמה תקרה, ואמה מעזיבה, וגבה של עליה ארבעים אמה, ואמה כיור, ואמתים בית דלפה, ואמה תקרה, ואמה מעזיבה, ושלש אמות מעקה, ואמה כלה עורב״; (ד, ז): ״וההיכל צר מאחריו, ורחב מלפניו, ודומה לארי״; (ד, א): ״פתחו של היכל, גבהו עשרים אמה ורחבו עשר אמות. וארבע דלתות היו לו, שתים בפנים ושתים בחוץ״.\nבקצרה — המחלוקות בכרטיס זה (הפירוט — במתגים שבתפריט, תחת ״שיטות ומחלוקות״):\n• **רוחב האולם ובית החליפות:** לתוספות יום טוב — חלל האולם שבעים (ברירת המחדל); לתפארת ישראל — וחדרי החליפות בצדדים; לרמב״ם — תשעים.\n• **גובה ההיכל:** כמשנה — מאה אמה, האוטם בכלל (ברירת המחדל); לאברבנאל, מדברי יוסף בן מתתיהו — מאה ועשרים.\n• **צורת הבניין:** כפשט המשנה — הבית שבעים, והאולם מאה (ברירת המחדל); לרמב״ם — מאה על מאה, ומעט צר במערב, כציורו.\n• **המעקה וכליא עורב:** לתנא קמא — מעקה שלוש וכליא עורב אמה (ברירת המחדל); לרבי יהודה — ״לא היה כלה עורב עולה מן המדה, אלא ארבע אמות היה מעקה״.\n**ברטנורא:** ״מאה על מאה״ — מאה אורך ומאה רוחב; ״אוטם״ — בניין אטום וסתום להיות יסוד לבית, שעליו מעמידים את הכתלים; ״צר מאחוריו״ — לצד מערב, ״ורחב מלפניו״ — לצד מזרח, ״ולא אתפרש לי היאך, שהרי מאה על מאה היה בשוה״; ארבע הדלתות — שתיים בעובי הכותל שכלפי פנים ושתיים כלפי חוץ, שעובי כותל ההיכל שש אמות; כל דלת רחבה חמש אמות, החיצונות נפתחות לפנים ומכסות חמש אמות של עובי הכותל, והפנימיות נפתחות לפנים ומכסות חמש אמות מרוחב הכותל בפנים — ושם לא היה הכותל טוח בזהב, לפי שלא היה נראה (ברטנורא מידות ד, ו; ד, ז; ד, א).\n**תוספות יום טוב:** ״היכל״ — חז״ל קוראים לכל הבניין יחד בשם הפרט; ״האוטם״ — תמה: היאך עולה בחשבון הרום מה שבארץ ואינו נראה? ולדעתו האוטם הוא גובה שתים עשרה המעלות שמעזרת ישראל (צ״ל: מן העזרה) אל האולם — שש אמות — והאולם וההיכל עומדים עליו בשווה (כרמב״ם: ״האולם וההיכל כולו בשוה״); ״צר מאחריו ורחב מלפניו״ — הראב״ד: לא היה לאולם כותל אלא במזרח, ורוחב האולם מאה ורוחב ההיכל ותאיו שבעים (ר׳ שמעיה: ״צר מאחוריו. ע׳ אמה״; ״ורחב מלפניו. ק׳ אמה״); והתוי״ט מסכים: האולם לא נמשך אצל התאים לצפון ולדרום (תוספות יום טוב מידות ד, ו; ד, ז).\n**תפארת ישראל:** ״ההיכל״ — כל בניין הבית: ההיכל וקודש הקדשים, התאים שסביבו, המסיבה שמחוצה להם והאולם שלפניו — מאה אורך, מאה רוחב ומאה גובה; האוטם — היסוד, שש אמות, אבני גזית סביב, אטום בפנים עם הקרקע, נראה מבחוץ רק בתוך תאי הדיוטא התחתונה, ובמזרח מכסות אותו שתים עשרה המעלות שגובהן שש; ״רחב מלפניו״ — כותל המזרח של האולם מאה, וכותל המערב של התאים שבעים, ״דומה לארי״ (תפארת ישראל מידות ד, ו; ד, ז).\nבמודל: ההיכל מאה על מאה על רום מאה — הגובה כולל את האוטם; האולם מאה רוחב וההיכל ותאיו שבעים — ״צר מאחוריו ורחב מלפניו״; פתח ההיכל עשרים על עשר, וארבע דלתותיו; רוחב האולם ובית החליפות, המעקה וכליא עורב וגובה ההיכל — בתפריט, תחת ״שיטות ומחלוקות״.",
    ulam: "לשון המשנה (מידות ג, ז): ״פתחו של אולם, גבהו ארבעים אמה, ורחבו עשרים אמה. וחמש מלתראות של מילת היו על גביו. התחתונה עודפת על הפתח אמה מזה ואמה מזה. שלמעלה ממנה עודפת עליה אמה מזה ואמה מזה. נמצאת העליונה שלשים אמה. ונדבך של אבנים היה בין כל אחת ואחת״; (ד, ז): ״האולם עודף עליו חמש עשרה אמה מן הצפון, וחמש עשרה אמה מן הדרום, והוא היה נקרא בית החליפות, ששם גונזים את הסכינים״.\nבקצרה — המחלוקות בכרטיס זה (הפירוט — במתגים שבתפריט, תחת ״שיטות ומחלוקות״):\n• **מעלות האולם:** כברטנורא (ברירת המחדל), כתפארת ישראל או כרמב״ם — איך מתחלקות שתים עשרה המעלות בעשרים ושתיים האמות.\n• **רוחב האולם ובית החליפות:** לתוספות יום טוב — חלל האולם שבעים (ברירת המחדל); לתפארת ישראל — וחדרי החליפות בצדדים; לרמב״ם — תשעים.\n• **תקרת האולם:** לרש״י — כיפה (ברירת המחדל); לתוספות רי״ד — בלי תקרה.\n**ברטנורא:** ״אמלתראות״ — קורות מצוירות ומכוירות; ״של מילת״ — של אילן שגדלים בו עפצים; התחתונה מושכבת על משקוף הפתח ועודפת אמה מזה ואמה מזה — כ״ב, השנייה כ״ד, השלישית כ״ו, הרביעית כ״ח והחמישית שלושים; ״נדבך״ — שורה של בניין אבנים בין קורה לקורה (ברטנורא מידות ג, ז).\n**תוספות יום טוב:** קורות של עץ באולם — ואין בהן משום ״לא תטע לך אשרה כל עץ״, שלא אסרה תורה אלא דומיא דנטיעה, עץ בולט — ״ואין בונין בו עץ בולט כלל״ (רמב״ם בית הבחירה א); שרשרות הזהב תלויות למטה באולם, ופרחי כהונה מפסגים בהן ועולים (ר׳ שמעיה) (תוספות יום טוב מידות ג, ז; ג, ח).\n**תפארת ישראל:** האולם רחב מאה אמה מצפון לדרום — שבעים כנגד ההיכל ותאיו וחמש עשרה עודפות מכל צד — ופתחו באמצע, עשרים על ארבעים, כרוחב חלל ההיכל וגובהו; ואף על פי כן נקרא בגמרא ״אכסדרה״, שפתחו גבוה ורחב ביותר כפרוץ במלואו; ״אמלתרא״ — נוטריקון ״מול תרעא״, כנגד השער, ויש אומרים ״מילת״ — צבועות כבגד משי אדום; הקורות משוקעות בבניין ואינן בולטות; ״נדבך״ — שורת אבנים מרובעות לנוי; האולם מקורה — ששרשרות הזהב קבועות בתקרתו (תפארת ישראל מידות ג, ז; ג, ח).\nבמודל: האולם — רוחבו מאה אמה ורומו מאה (ד, ז), פתחו עשרים על ארבעים בלא דלתות (ב, ג), חמש האמלתראות ונדבכי האבן על גביו; הכלונסות, השרשרות, גפן הזהב, השולחנות והפשפשין — כרטיסים משלהם; רוחבו ובית החליפות — בתפריט, תחת ״שיטות ומחלוקות״. בלחיצה על המקום — מבט מלמעלה, ותקרת האולם נפתחת ל־15 שניות. הכפתור ״פתח את האולם״ שעל חזית האולם, מעל פתחו, מסיר את החזית ואת התקרה ומעמיד את המבט מול האולם, באמצעו (כלי צפייה בלבד).\nפשפשי בית החליפות: ״רבי יוסי ברבי יהודה אומר: שני פשפשין היו בבית החליפות, וגובהן שמנה; כדי להכשיר את העזרה כולה לאכילת קדשי קדשים, ולשחיטת קדשים קלים״ (זבחים נה:). רש״י: ״ובאותן שני כתלים היו שני פתחים קטנים״, ״ופתוחין למערב״; ועל הצדדים: ״דפתח להו בקרן זוית — של אולם, מקצת הפתח פונה לצפון ומקצתו למערב, וכן בדרום״; ״שהן פתחים קטנים, ואין משמשין כניסה ויציאה״. במודל: פשפש גבוה שמונה אמות בקרן הזווית המערבית של כל אחד משני העודפים של האולם — מקצתו בכותל המערבי ומקצתו בכותל הצד — בגובה רצפת האולם; רוחבו — בחירת מודל. המקום ״פשפשי בית החליפות״ מראה אותו.",
    kodesh: "לשון המשנה (מידות ד, ז): ״כתל ההיכל שש, ותוכו ארבעים אמה, אמה טרקסין, ועשרים אמה בית קדש הקדשים״; ״ותוכו עשרים אמה״; (ד, ו): ״וגבהו ארבעים אמה, אמה כיור, ואמתים בית דלפה, ואמה תקרה, ואמה מעזיבה״; (ד, א): ״שכל הבית טוח בזהב, חוץ מאחר הדלתות״.\nבקצרה — המחלוקות בכרטיס זה (הפירוט — במתגים שבתפריט, תחת ״שיטות ומחלוקות״):\n• **המפתח שיורד לאמת השחי:** לרמב״ם — שני מנעולים מבחוץ (ברירת המחדל); למלאכת שלמה ולרבינו גרשום — המנעול מבפנים; לראב״ד — הפשפש ״פתח קטן כעין חלון״.\n• **הדרך מן הפשפש לשער הגדול:** לחכמים — דרך התא וההיכל (ברירת המחדל); לרבי יהודה — ״בתוך עביו של כתל היה מהלך״.\n• **דלתות ההיכל:** לתנא קמא, וכן פסק הרמב״ם — החיצונות לתוך הפתח והפנימיות לתוך הבית (ברירת המחדל); לרבי יהודה — ״בתוך הפתח היו עומדות... ונקפלות לאחוריהן״.\n• **חומר המנורה והשולחן:** זהב — ״חזרו והעשירו, עשאום של זהב״ (ברירת המחדל); כסף — ״העשירו, עשאום של כסף״; ברזל מחופה — ״שפודים של ברזל היו, וחיפום בבעץ״ (מנחות כח:).\n• **שולחנות שלמה:** לתוספות רי״ד — שולחן אחד ומנורה אחת (ברירת המחדל); לרש״י ולמפרש לתמיד — גם עשרת השולחנות ועשר המנורות של שלמה, ולא סידרו עליהם ולא הדליקו בהם.\n• **סידור הלחם והדלקת הנרות בכלי שלמה:** לתנא קמא ולרבי יוסי ברבי יהודה — רק בשל משה (ברירת המחדל); לרבי אלעזר בן שמוע — ״על כולם היו מסדרין... ובכולן היו מדליקין״.\n• **הפרוכות ודרך הכהן הגדול:** לתנא קמא — שתי פרוכות ואמה ביניהן, וכן כתב הרמב״ם (ברירת המחדל), והכהן הגדול מהלך בין המזבח למנורה, כרבי יהודה; לרבי יוסי — פרוכת אחת בלבד, ודרכו בין השולחן לכותל; לרבי מאיר — פרוכת אחת, ודרכו בין השולחן למזבח.\n• **פריפת הפרוכות:** לרש״י — ראש הפרוכת כפול ונאחז בקרס של זהב, והפתח פתוח (ברירת המחדל); לתוספות רי״ד — הפרוכת מחוברת לכתלים בקרסים ובלולאות, ונפתחת בשעת הכניסה; לתוספות יום טוב — הפרוכת ארוכה, ופינתה נמשכת אל הכותל ונאחזת בו בקרס, והפתח מתחתיה.\n• **הציור על הפרוכות:** לרש״י — ״פעמים שמצד זה ארי ומצד זה נשר״ (ברירת המחדל); לרמב״ם, כהבנת המשנה למלך — אותה צורה משני הצדדים; למעשי למלך — בלי צורות.\n**ברטנורא:** ״ותוכו״ — חללו של היכל ארבעים אמה; ״אמה כיור״ — הקורה התחתונה של התקרה, עובייה אמה, ולפי שהייתה טוחה בזהב ומצוירת ציורים נאים נקראת כיור; ״בית דלפה״ — הקורות העליונות הנשענות עליה, עוביין שתי אמות, שהנסרים מחוברים על ידן; ״תקרה״ — הנסרים; ״מעזיבה״ — הטיט והאבנים והסיד שעל הנסרים (ברטנורא מידות ד, ז; ד, ו).\n**תוספות יום טוב:** הרמב״ם — ״דלף״ הוא נפילת המים מן הגגות, ונהגו לעשות לבית שני קירויים זה למעלה מזה ומעט הרחקה ביניהם — בית הדליפה — שאם יטיף הקירוי העליון יעמדו המים באותו חלל (תוספות יום טוב מידות ד, ו).\n**תפארת ישראל:** ״אמה כיור״ — פטורי ציצים של גבס מוזהבים, כשפה גבוהה אמה מעל ארבעים האמה סביב, נראית מבחוץ ומבפנים; ״בית דלפה״ — קורות עבות בגובה שתי אמות השוכבות על אורך הכתלים סביב, כמלבן המחבר ומחזק את הבניין; ובבועז — התנא מנה את גובה הכתלים ולא את גובה החלל, שהרי מנה גם את האוטם ואת המעקה; ודוחה את הרמב״ם — שאין טעם למקום לדלף תחת שתי תקרות עבות (תפארת ישראל מידות ד, ו; בועז ד, ג).\nבמודל: הקודש — ארבעים אמה אורכו ועשרים רוחבו וארבעים גובהו, ובו המנורה בדרום, השולחן בצפון ומזבח הזהב ביניהם משוך לחוץ (יומא לג:; רמב״ם בית הבחירה א, ז; ג, יז); כל הבית טוח בזהב, ופיתוחי הקירות — כרטיס משלהם.\nרצפת הבית משופעת: רש״י (מנחות צט.): ״דבית המקדש היה משופע, ולצד מערב מגביה יותר״. במודל: רצפת ההיכל וקודש הקדשים עולה מן הפתח אל המערב — ארבע אמות לכל אורך הבית — והכלים והפרוכות עומדים עליה; שיעור השיפוע לא נתפרש, והוא בחירת מודל. המקום ״שיפוע רצפת הבית״ מראה אותה בחתך.",
    kodeshHakodashim: "לשון המשנה (מידות ד, ז): ״אמה טרקסין, ועשרים אמה בית קדש הקדשים״; (ד, ה): ״ולולין היו פתוחין בעליה לבית קדש הקדשים, שבהן היו משלשלין את האמנים בתבות, כדי שלא יזונו עיניהן מבית קדשי הקדשים״.\nבקצרה — המחלוקות בכרטיס זה (הפירוט — במתגים שבתפריט, תחת ״שיטות ומחלוקות״):\n• **הפרוכות ודרך הכהן הגדול:** לתנא קמא — שתי פרוכות ואמה ביניהן, וכן כתב הרמב״ם (ברירת המחדל), והכהן הגדול מהלך בין המזבח למנורה, כרבי יהודה; לרבי יוסי — פרוכת אחת בלבד, ודרכו בין השולחן לכותל; לרבי מאיר — פרוכת אחת, ודרכו בין השולחן למזבח.\n• **פריפת הפרוכות:** לרש״י — ראש הפרוכת כפול ונאחז בקרס של זהב, והפתח פתוח (ברירת המחדל); לתוספות רי״ד — הפרוכת מחוברת לכתלים בקרסים ובלולאות, ונפתחת בשעת הכניסה; לתוספות יום טוב — הפרוכת ארוכה, ופינתה נמשכת אל הכותל ונאחזת בו בקרס, והפתח מתחתיה.\n• **הציור על הפרוכות:** לרש״י — ״פעמים שמצד זה ארי ומצד זה נשר״ (ברירת המחדל); לרמב״ם, כהבנת המשנה למלך — אותה צורה משני הצדדים; למעשי למלך — בלי צורות.\n**ברטנורא:** ״אמה טרקסין״ — כותל המפסיק בין ההיכל לקודש הקדשים, על שם שסוגר על הארון והלוחות שניתנו בסיני — ״טרק״ בארמית סגירה, ״סין״ — סיני; עוביו אמה, ולא הכריעו בו חכמים אם קדושתו כקדושת פנים או כקדושת חוץ, לפיכך עשו בבית שני שתי פרוכות, חיצונה ופנימית, ואוויר אמה ביניהן (ברטנורא מידות ד, ז).\n**תוספות יום טוב:** ״בית הכפורת״ (א, א) — קודש הקדשים, על שם הכפורת; עליית בית קודש הקדשים חמורה ממנו — ״אין נכנסים לה אלא פעם אחת בשבוע״ (פסחים פו.), ולכן הפספסין בעלייה (תוספות יום טוב מידות א, א; ד, ה).\n**תפארת ישראל:** בבית שני, שחלל ההיכל גבוה ארבעים אמה, לא יכול כותל שעוביו אמה לעמוד, לכן עשו פרוכת; ומן הספק — שתי פרוכות ורווח אמה ביניהן, והתנא קרא לאמה ״טרקסין״ על שם הראשון, ובפרט שגם בבית שני נגנז הארון במקום קודש הקדשים (יומא נג:) (תפארת ישראל מידות ד, ז).\nובמשנה (יומא ה, ב): ״משנטל הארון, אבן היתה שם מימות נביאים ראשונים, ושתיה היתה נקראת, גבוהה מן הארץ שלש אצבעות, ועליה היה נותן״. **ברטנורא** (שם): ״ושתיה היתה נקראת. על שם שממנה נשתת העולם, שבה יסד הקדוש ברוך הוא את עולמו. שתיה, יסוד״.\nבמודל: לפני ולפנים — עשרים על עשרים אמה; בבית שני לא היה בו ארון אלא אבן השתייה בלבד, גבוהה מן הארץ שלוש אצבעות (יומא ה, ב), במערבו — ״אבן היתה בקדש הקדשים במערבו״ (רמב״ם בית הבחירה ד, א); בינו לקודש שתי הפרוכות ואמה ביניהן (רמב״ם ד, ב) — כרטיס משלהן.\nרצפת הבית משופעת ועולה אל המערב (רש״י מנחות צט.) — ראו בכרטיס הקודש.\nבכותל המערבי — לול קטן אל התא שמאחוריו (זבחים נה:; הרא״ש, תמיד כז.): ראו במקום ״הלול שאחורי בית הכפורת״.",
    heichalInside: "לשון המשנה (מידות ד, א): ״פתחו של היכל, גבהו עשרים אמה ורחבו עשר אמות. וארבע דלתות היו לו, שתים בפנים ושתים בחוץ... החיצונות נפתחות לתוך הפתח לכסות עביו של כתל, והפנימיות נפתחות לתוך הבית לכסות אחר הדלתות, שכל הבית טוח בזהב, חוץ מאחר הדלתות. רבי יהודה אומר, בתוך הפתח היו עומדות, וכמין אצטרמיטה היו, ונקפלות לאחוריהן״; (ד, ז): ״כתל ההיכל שש, ותוכו ארבעים אמה, אמה טרקסין, ועשרים אמה בית קדש הקדשים״; ״ותוכו עשרים אמה״.\n**ברטנורא:** עובי כותל ההיכל שש אמות; לסוף אמה חיצונה של עובי הכותל — הדלתות החיצונות, אחת לימין הפתח ואחת לשמאלו, כל דלת רחבה חמש אמות, וכשנעולות נוגעות זו בזו וסותמות את חלל הפתח שרוחבו עשר; ושתי דלתות אחרות בסוף עובי הכותל לצד פנים, וכשנפתחות מכסות חמש אמות מפה וחמש מפה מרוחב הכותל בפנים, ושם לא היה הכותל טוח בזהב; לרבי יהודה — ״אצטרמיטה״: לוחות של פרקים המחוברות בחוליות, שנכפלות זו על זו — הדלתות קבועות לסוף חצי אמה של עובי הכותל, וכל דלת של חמש אמות מחוברת משני לוחות של שתי אמות ומחצה, ונכפלת ומכסה את עובי הכותל (ברטנורא מידות ד, א).\n**תפארת ישראל:** ״ורחבו עשר אמות״ — כחצי גובהו (תפארת ישראל מידות ד, א).\nבמודל: ההיכל מבפנים — מן האולם, דרך פתחו הגדול (ארבעים על עשרים), אל הקודש: ארבעים אמה אורך, עשרים רוחב, ארבעים גובה (ד, ו–ז); קירותיו ורצפתו מצופים זהב — ״שכל הבית טוח בזהב״ — ובסופו שתי הפרוכות; בו המנורה בדרום, השולחן בצפון ומזבח הזהב ביניהם (רמב״ם בית הבחירה א, ז); ארבע הדלתות — שתיים בחוץ ושתיים בפנים, כתנא קמא."
  };
  // 1.0.1 (FIXES E.2 / F.3): the basis of the palace's placement (south of the Temple's great court, on a lower terrace) - the UI's copy,
  // used when 60-palace.js did not write ctx.shared.palaceBasis. The verses: I Kings 10:5 (II Chr 9:4 "ועליתו"), II Kings 11:19,
  // Jer 26:10, Jer 22:1 (the palace below the house, one goes UP to the house), I Kings 8:1 (the city of David south of the house).
  var ui_REFS = {
    __general: [["מידות א–ה", "Mishnah_Middot"]],
    harHabayit: [["מידות ב, א", "Mishnah_Middot.2.1"], ["א, ג", "Mishnah_Middot.1.3"], ["רמב\"ם בית הבחירה ה, א", "Mishneh_Torah,_The_Chosen_Temple.5.1"], ["רמב\"ם בית הבחירה ה, ב", "Mishneh_Torah,_The_Chosen_Temple.5.2"]],
    shushanGate: [["מידות א, ג", "Mishnah_Middot.1.3"], ["ברטנורא א, ג", "Bartenura_on_Mishnah_Middot.1.3"], ["תוי״ט א, ג", "Tosafot_Yom_Tov_on_Mishnah_Middot.1.3"], ["תפא״י א, ג", "Yachin_on_Mishnah_Middot.1.3"], ["כלים יז, ט", "Mishnah_Kelim.17.9"], ["מידות ב, ד", "Mishnah_Middot.2.4"], ["רש״י יומא טז.", "Rashi_on_Yoma.16.1"], ["רמב״ם בית הבחירה ו, ה", "Mishneh_Torah,_The_Chosen_Temple.6.5"], ["פרה ג, ו", "Mishnah_Parah.3.6"], ["ברטנורא פרה ג, ו", "Bartenura_on_Mishnah_Parah.3.6"], ["רמב״ם פרה אדומה ג, א", "Rambam_Parah_Adumah.3.1"], ["שקלים ד, ב", "Mishnah_Shekalim.4.2"]],
    royalStoa: [["פסחים יג:", "Pesachim.13b"], ["רש״י פסחים יג:", "Rashi_on_Pesachim.13.2"], ["סוכה מה.", "Sukkah.45a"], ["רש״י סוכה מה.", "Rashi_on_Sukkah.45.1"], ["רש״י פסחים יא:", "Rashi_on_Pesachim.11.2"]],
    ezratNashim: [["מידות ב, ה", "Mishnah_Middot.2.5"], ["ב, ג", "Mishnah_Middot.2.3"], ["רמב\"ם בית הבחירה ה, ז", "Mishneh_Torah,_The_Chosen_Temple.5.7"], ["רמב\"ם בית הבחירה ה, ח", "Mishneh_Torah,_The_Chosen_Temple.5.8"], ["תוי״ט ב, ה", "Tosafot_Yom_Tov_on_Mishnah_Middot.2.5"], ["הרא״ש מידות ב, ה", "Rosh_on_Mishnah_Middot.2.5"], ["פירוש המשניות לרמב״ם מידות ב, ה", "Rambam_Commentary_on_Middot.2.5"], ["פסקי הרי״ד סוכה נג.", "Kovetz_Shitot_Kamai_Middot.53.1"]],
    nikanor: [["מידות ב, ג", "Mishnah_Middot.2.3"], ["ברטנורא ב, ג", "Bartenura_on_Mishnah_Middot.2.3"], ["תוי״ט ב, ג", "Tosafot_Yom_Tov_on_Mishnah_Middot.2.3"], ["תפא״י ב, ג", "Yachin_on_Mishnah_Middot.2.3"], ["מידות ב, ו", "Mishnah_Middot.2.6"], ["תפא״י ב, ו", "Yachin_on_Mishnah_Middot.2.6"], ["תפא״י ד, ב", "Yachin_on_Mishnah_Middot.4.2"], ["מידות א, ד", "Mishnah_Middot.1.4"], ["יומא ג, י", "Mishnah_Yoma.3.10"], ["ברטנורא ג, י", "Bartenura_on_Mishnah_Yoma.3.10"], ["תפא״י ג, י", "Yachin_on_Mishnah_Yoma.3.10"], ["שקלים ו, ג", "Mishnah_Shekalim.6.3"], ["תוי״ט ו, ג", "Tosafot_Yom_Tov_on_Mishnah_Shekalim.6.3"], ["יומא לח.", "Yoma.38a"], ["רמב״ם בית הבחירה ה, ה", "Mishneh_Torah,_The_Chosen_Temple.5.5"], ["רמב״ם בית הבחירה א, יא", "Mishneh_Torah,_The_Chosen_Temple.1.11"], ["יומא יא.", "Yoma.11a"], ["יומא יא:", {"book": 107, "index": 245}], ["מנחות לג:", {"book": 131, "index": 1143}], ["מנחות לג.", {"book": 131, "index": 1137}], ["תוספות מנחות לג.", {"book": 1933, "index": 387}], ["רמב\"ם בית הבחירה ה, יז", "Mishneh_Torah,_The_Chosen_Temple.5.17"]],
    azarah: [["מידות ה, א", "Mishnah_Middot.5.1"], ["מידות ה, ב", "Mishnah_Middot.5.2"], ["רמב\"ם בית הבחירה ה, יב", "Mishneh_Torah,_The_Chosen_Temple.5.12"], ["רמב\"ם בית הבחירה ה, יג", "Mishneh_Torah,_The_Chosen_Temple.5.13"]],
    mizbeach: [["מידות ג, א", "Mishnah_Middot.3.1"], ["רמב\"ם בית הבחירה ב, ה", "Mishneh_Torah,_The_Chosen_Temple.2.5"], ["רמב\"ם בית הבחירה ב, ז", "Mishneh_Torah,_The_Chosen_Temple.2.7"], ["רמב\"ם בית הבחירה ב, י", "Mishneh_Torah,_The_Chosen_Temple.2.10"], ["רש״י שמות כט, יב", "Rashi_on_Exodus.29.12"], ["רש״י זבחים נד.", "Rashi_on_Zevachim.54.1"]],
    heichalFront: [["מידות ד, ו", "Mishnah_Middot.4.6"], ["מידות ד, ז", "Mishnah_Middot.4.7"], ["מידות ד, א", "Mishnah_Middot.4.1"], ["רמב\"ם בית הבחירה ד, ג", "Mishneh_Torah,_The_Chosen_Temple.4.3"]],
    ulam: [["מידות ג, ז", "Mishnah_Middot.3.7"], ["מידות ג, ח", "Mishnah_Middot.3.8"], ["מידות ד, ז", "Mishnah_Middot.4.7"], ["רמב\"ם בית הבחירה ד, ח", "Mishneh_Torah,_The_Chosen_Temple.4.8"], ["זבחים נה:", "Zevachim.55b"], ["רש״י זבחים נה:", "Rashi_on_Zevachim.55.2"]],
    kodesh: [["מידות ד, ז", "Mishnah_Middot.4.7"], ["יומא לג ע״ב", "Yoma.33b"], ["רמב\"ם בית הבחירה א, ז", "Mishneh_Torah,_The_Chosen_Temple.1.7"], ["רמב\"ם בית הבחירה ג, יז", "Mishneh_Torah,_The_Chosen_Temple.3.17"], ["רש״י מנחות צט.", "Rashi_on_Menachot.99.1"]],
    kodeshHakodashim: [["מידות ד, ז", "Mishnah_Middot.4.7"], ["משנה יומא ה, ב", "Mishnah_Yoma.5.2"], ["רמב\"ם בית הבחירה ד, א", "Mishneh_Torah,_The_Chosen_Temple.4.1"], ["רמב\"ם בית הבחירה ד, ב", "Mishneh_Torah,_The_Chosen_Temple.4.2"], ["רש״י מנחות צט.", "Rashi_on_Menachot.99.1"], ["ברטנורא יומא ה, ב", "Bartenura_on_Mishnah_Yoma.5.2"]],
    heichalInside: [["מידות ד, א", "Mishnah_Middot.4.1"], ["מידות ד, ז", "Mishnah_Middot.4.7"], ["רמב״ם בית הבחירה א, ז", "Mishneh_Torah,_The_Chosen_Temple.1.7"]]
  };
  // 1.0.1-L: ONE phone rule for the JS and the CSS (the brief: "the 639 px media rule"): a window up to this many px wide is a phone -
  // the panel starts closed and closes after a choice, the explanation card is a bottom sheet, the nav row hides its captions
  var ui_PHONE_MAX = 639;
  // 1.0.2: #tm-panel and #tm-xcard start 9 px below the fixed top bar of index.html (--topbar-h: 56 px, 44 px in a narrow window), as below the old 47 px header
  var ui_AUTO_OFF_S = 15;   // 1.0.1-L (L.27): a feature a PLACE switched on goes off by itself after this many seconds
  // 1.0.2 (C): the window "מה חדש" - shown once for this version (ver = manifest.json's version); short plain Hebrew, one line a feature
  var UI_NEWS = {
    ver: "2.0.15",   // tools/assemble.mjs writes manifest.json's version here
    items: ["**מצב הליכה — עולים במעלות של שער ניקנור** — במצב הליכה בעזרת הנשים, כשמגיעים לחמש עשרה המעלות של שער ניקנור, העין עולה עכשיו עם המעלות. עד עכשיו המבט נכנס לתוך המעלות במקום לעלות עליהן. התיקון חל על כל המדרגות במודל, וגם בבית ראשון.", "**״ברקאי״ — רואים את אור השחר** — בהדגמת ״סדר עבודת הבוקר״, בשלב ״ברקאי — עלות השחר״, המזרח מאיר עכשיו בזמן שהרואה עולה ומסתכל, והאור כבר נראה כשהוא קורא — ״אם הגיע, הרואה אומר, ברקאי״ (תמיד ג, ב; ברטנורא: ״האיר והבריק השחר״). בדברי מתתיא בן שמואל, ״האיר פני כל המזרח״, האור מתחזק, והחמה עוד לא עלתה. עד עכשיו השמים נשארו חשוכים עד סוף השלב. כך גם בהדגמת ארבעת הפייסות.", "**מאחר הדלתות — בלי זהב** — ״והפנימיות נפתחות לתוך הבית לכסות אחר הדלתות, שכל הבית טוח בזהב, חוץ מאחר הדלתות״ (מידות ד, א). בכותל המזרחי של ההיכל מבפנים, משני צדי הפתח ועד הכתלים, בגובה הדלתות, הקיר הוא עכשיו אבן בלי זהב, ועליו נשענות הדלתות הפנימיות כשהן פתוחות — כדברי התפארת ישראל שם: ״חוץ מאותן ה׳ אמות מזה ומזה לדלתות כגובה הדלתות״. מה היה שם במקום הזהב לא נאמר, והאבן — בחירת מודל. בשיטת רבי יהודה, שהדלתות עומדות בתוך הפתח, הכותל כולו זהב. עד עכשיו היה זהב גם מאחר הדלתות."],   // WALK_STAIRS_306, BARKAI_LIGHT_306, BEHIND_DOORS_306
  };
  // what is new by version, newest first - one who saw a version is shown only the versions after it
  var UI_NEWS_VERS = [
    ["2.0.15", ["**מצב הליכה — עולים במעלות של שער ניקנור** — במצב הליכה בעזרת הנשים, כשמגיעים לחמש עשרה המעלות של שער ניקנור, העין עולה עכשיו עם המעלות. עד עכשיו המבט נכנס לתוך המעלות במקום לעלות עליהן. התיקון חל על כל המדרגות במודל, וגם בבית ראשון.", "**״ברקאי״ — רואים את אור השחר** — בהדגמת ״סדר עבודת הבוקר״, בשלב ״ברקאי — עלות השחר״, המזרח מאיר עכשיו בזמן שהרואה עולה ומסתכל, והאור כבר נראה כשהוא קורא — ״אם הגיע, הרואה אומר, ברקאי״ (תמיד ג, ב; ברטנורא: ״האיר והבריק השחר״). בדברי מתתיא בן שמואל, ״האיר פני כל המזרח״, האור מתחזק, והחמה עוד לא עלתה. עד עכשיו השמים נשארו חשוכים עד סוף השלב. כך גם בהדגמת ארבעת הפייסות.", "**מאחר הדלתות — בלי זהב** — ״והפנימיות נפתחות לתוך הבית לכסות אחר הדלתות, שכל הבית טוח בזהב, חוץ מאחר הדלתות״ (מידות ד, א). בכותל המזרחי של ההיכל מבפנים, משני צדי הפתח ועד הכתלים, בגובה הדלתות, הקיר הוא עכשיו אבן בלי זהב, ועליו נשענות הדלתות הפנימיות כשהן פתוחות — כדברי התפארת ישראל שם: ״חוץ מאותן ה׳ אמות מזה ומזה לדלתות כגובה הדלתות״. מה היה שם במקום הזהב לא נאמר, והאבן — בחירת מודל. בשיטת רבי יהודה, שהדלתות עומדות בתוך הפתח, הכותל כולו זהב. עד עכשיו היה זהב גם מאחר הדלתות."]],   // WALK_STAIRS_306, BARKAI_LIGHT_306, BEHIND_DOORS_306
    ["2.0.14", ["**חדש: מעיין השילוח והדגמת ניסוך המים** — בעמק שמדרום להר הבית יש עכשיו בריכת השילוח, מוצא המעיין, ושביל אליה משער חולדה המערבי (״מעיין השילוח״ בקבוצת ״שערי הר הבית וחצרות״, אחרי ״שערי חולדה״). ובקבוצת ״הדגמות״ — ״ניסוך המים — מן השילוח״: כהן יוצא בצלוחית של זהב, ממלא אותה מן השילוח וחוזר. כשהוא מגיע לשער המים תוקעים, מריעים ותוקעים; הוא עולה בכבש, פונה לשמאלו, ומנסך ביד מורמת לתוך הספל המערבי — ״נסוך המים כיצד... הגיעו לשער המים, תקעו והריעו ותקעו. עלה בכבש ופנה לשמאלו״; ״ולמנסך אומרים לו, הגבה ידך״ (סוכה ד, ט). אין מקור שמתאר את הדרך אל השילוח ואת מקומו: הדרך, צורת הבריכה ומוצא המעיין הם בחירות מודל, וכך כתוב בכרטיס.", "**חדש: הלילה שלפני עבודת הבוקר** — הדגמת ״סדר עבודת הבוקר״ מתחילה עכשיו בלילה. איש הר הבית מחזר על המשמרות, ואבוקות דולקות לפניו (מידות א, ב): שומר אחד ער וקם לפניו, ושומרים אחרים ישנים — יושבים על אבניהם, עטופים בכסותם. את הישן הוא חובט במקלו ושורף את כסותו — ״קול בן לוי לוקה ובגדיו נשרפין, שישן לו על משמרו״. מופיע גם בן בבי, הממונה ״על הפקיע״ (שקלים ה, א). אחר כך המצלמה מלווה את הממונה בדרכו אל בית המוקד, ואחריו נשמעת קריאת גביני הכרוז: ״עמדו כהנים לעבודתכם, ולוים לדוכנכם, וישראל למעמדכם״ (יומא כ:). בשיטות ומחלוקות נוספה השורה: מי אומר ״שלום עליך״ — במשנה איש הר הבית אומר לשומר, ובגמרא וברמב״ם השומר אומר לאיש הר הבית.", "**הלויים מנגנים** — בהדגמת שמחת בית השואבה ובהדגמת ״סדר עבודת הבוקר״ הלויים אינם עומדים עוד כפסלים: ידיהם מנגנות בכלים, והמשוררים נעים עם השיר; בעבודת הבוקר השיר נפסק בין פרק לפרק. הכהנים אוחזים את החצוצרות בידיהם, וקולות התרועה נשמעים ברורים. בשיטות ומחלוקות נוספה השורה ״התקיעות בהליכה לשער המזרח — שמחת בית השואבה״: לפי רש״י וברטנורא, התקיעה, התרועה והתקיעה נמשכות בהליכה; לפי התפארת ישראל — תקיעה בלי תרועה.", "**שמחת בית השואבה — עוד מן הגמרא** — נוספו כתוביות מן הגמרא שהיו חסרות (סוכה נא:–נג:), ביניהן: ״אשה היתה בוררת חטים לאור של בית השואבה״; דברי הלל הזקן — ״אם אני כאן — הכל כאן, ואם איני כאן — מי כאן״; ודברי רבי יהושע בן חנניה — ״כשהיינו שמחים שמחת בית השואבה, לא ראינו שינה בעינינו״. ולפני הקידה, רבן שמעון בן גמליאל פונה עכשיו למערב, אל ההיכל; עד עכשיו פנה למזרח.", "**שיטת רבי מאיר — עם שולחנות שלמה ומנורותיו** — בהדגמת כניסת הכהן הגדול ביום הכיפורים, בשיטת רבי מאיר (״בין שלחן למזבח״, יומא נא:), ההיכל מוצג עכשיו עם עשרת השולחנות של שלמה ועם מנורותיו. תחילה השולחנות מונחים צפון ודרום, כתירוץ הראשון בגמרא, ובהמשך מזרח ומערב, כתירוץ השני. הכהן הגדול הולך כדברי רש״י — מצפון למזבח, בין המזבח לראשי השולחנות. עד עכשיו הוצג ההיכל בשיטה זו בלי השולחנות והמנורות של שלמה.", "**מזבח הזהב — אמה ורבע מזרחה** — כמו בבית ראשון: מזבח הזהב הוזז אמה ורבע לצד מזרח, בכל הקריאות, כדי שתהיה דרך בינו ובין השולחנות — ״שאין המזבח מכוון כנגד השולחן, אלא משוך קימעא כלפי חוץ״ (רש״י, יומא נא:). כמה הוא ״קימעא״ לא נאמר, ואמה ורבע — בחירת מודל.", "**המנורה — מעט צרה יותר** — המנורה, וכן מנורות שלמה בקריאות שבהן הן מוצגות, צרות מעט מבעבר: הנרות קרובים יותר זה לזה, והגובה והצורה כמו שהיו. רוחב המנורה אינו נזכר במקורות, והוא בחירת מודל.", "**האבנט של הכהנים** — בהדגמת שמחת בית השואבה, בלשכות ואצל הממונים, אבנט הכהנים עשוי עכשיו כמו של הכהן שבהדגמת הפייס: חגורה אחת בגובה המרפקים, בשלושה סיבובים, באריג הצבוע (או לבן, בשיטה ״של בוץ״). עד עכשיו היו שם שלושה פסים נפרדים במותניים ושני קצוות תלויים.", "**סידור הטבעות — שתי השיטות** — בשיטות ומחלוקות נוספה השורה ״סידור הטבעות״: לפי תנא קמא, ״ששה סדרים של ארבע ארבע״ (מידות ג, ה) — שש שורות, בכל אחת ארבע טבעות, כפירוש רבינו שמעיה: ״היו הטבעות בשורה אחת ובכל סדר ארבעה טבעות״; ולפי ״ויש אומרים״ — ארבעה סדרים של שש שש. דברי רבינו שמעיה נוספו גם לכרטיס של הטבעות.", "**הדלקת מנורות הזהב — שוב ברשימת ההדגמות** — ההדגמה הקצרה של הדלקת מנורות הזהב בעזרת הנשים, בלי כל השמחה, נמצאת שוב בקבוצת ״הדגמות״. עד עכשיו הגיעו אליה רק דרך עץ המקומות."]],   // SHILOACH_305, NIGHT_WATCH_305, MUSICIANS_305, CAPTIONS_305, MEIR_TABLES_305, ALTAR_EAST_305, MENOROT_305, AVNET_305, RINGS_305, DEMOLIST_305
    ["2.0.13", ["**חדש: הדגמת שמחת בית השואבה** — בקבוצת ״הדגמות״, וגם בכפתור שעל עזרת הנשים. לילה של חג הסוכות בעזרת הנשים: על הזיזים שבכתלים מניחים קרשים ומעקה, וכך נעשות שלוש הגזוזטראות — בצפון, בדרום ובמזרח. פרחי הכהונה עולים בסולמות ומדליקים את המנורות של זהב, ומאז כל העזרה מוארת באור חם. העם — אלפי אנשים וילדים בכל הגילים — ממלא את העזרה. באמצע, החסידים ואנשי מעשה מרקדים באבוקות של אש חיה, ושניים מהם זורקים ארבע אבוקות. הלוים עומדים על חמש עשרה המעלות, בכנורות, בנבלים, במצלתים ובחצוצרות, ונשמעים החליל וכלי השיר. רבן שמעון בן גמליאל זורק שמונה אבוקות, ומשתחווה בקידה. ובקריאת הגבר, שני כהנים בחצוצרות יורדים מן השער העליון, תוקעים והולכים עד השער המזרחי, ושם הופכים את פניהם למערב ואומרים ״ואנו ליה עינינו״. הכתוביות — בלשון המשנה, הגמרא והתוספתא, ובכרטיס — כל המקורות.", "**הזיזים של הגזוזטרא — באמצע גובה הכתלים** — בכתלי עזרת הנשים, בצפון, בדרום ובמזרח, נראים עכשיו תמיד הזיזים — אבנים בולטות מן הכותל, שעליהן הניחו את הקרשים של הגזוזטרא. מקומם באמצע גובה הכתלים, כדברי התפארת ישראל: ״תקרה בולטת מאמצע גובה כתליה״. הקרשים והמעקה נראים רק בזמן ההדגמה. עד עכשיו עמדה שם תמיד גזוזטרא נמוכה יותר, ועליה סריג.", "**תרומת הדשן — הכהן מקיף את המזבח** — בהדגמת ״סדר עבודת הבוקר״, הכהן שזכה בתרומת הדשן עולה במזרח הכבש, מקיף את כל המזבח, ויורד במערב הכבש — ״כל העולין למזבח עולין דרך ימין, ומקיפין, ויורדין דרך שמאל״ (זבחים ו, ג). אחר כך הוא מקיף את רגל הכבש אל מזרחו, הולך צפונה כעשר אמות, וצובר שם את הגחלים. עד עכשיו ירד מיד, בלי להקיף. בכרטיס נוספו שתי שאלות, עם כל הדעות ובלי הכרעה: האם הדשן נבלע במקומו, ובאיזה בית.", "**סוף הלילה על המזבח** — בתחילת אותה הדגמה, על המזבח ערמת גחלים לוחשות ולהבה נמוכה, בלי עצים שלמים — ״אלא מהלך לאור המערכה״ (תמיד א, ד). כשמסדרים את המערכה הגדולה, העצים חוזרים.", "**הפרוכות — שיטת הרשב״א בדעת הרמב״ם** — במחלוקת ״הפרוכות״ (בתפריט, תחת ״שיטות ומחלוקות״) נוספה אפשרות: שתי פרוכות, החיצונה פרופה מן הצפון והפנימית מן הדרום (שו״ת הרשב״א, חלק א, סימן שפח; הובא בכסף משנה, עבודת יום הכפורים ד, ב). בשיטה זו, בהדגמת כניסת הכהן הגדול, הוא נכנס בין הפרוכות בצפון, מהלך עד הדרום, ושם נכנס לקודש הקדשים."]],   // SIMCHA_304, CIRCUIT_304, NIGHT_COALS_304, RASHBA_304
    ["2.0.12", ["**שיטות ומחלוקות — בקבוצות** — הרשימה ״שיטות ומחלוקות״ שבתפריט מחולקת עכשיו לעשר קבוצות לפי המקומות, מבחוץ פנימה: ״הר הבית והחיל״, ״עזרת נשים״, ״העזרה״, ״לשכות העזרה ובית המוקד״, ״המזבח, הכבש והכיור״, ״האולם״, ״בניין ההיכל, התאים והעלייה״, ״כלי ההיכל״, ״הפרוכות״ ו״סדר העבודה ובגדי הכהנים״. כל קבוצה נפתחת בלחיצה, ובכותרתה מספר המחלוקות שבה. החיפוש שבראש התפריט פותח לבד את הקבוצה של מה שנמצא, ושם של קבוצה מוצא את כל המחלוקות שבה. גם במצגת, כל שיטה נוספת מראה את שם הקבוצה שלה.", "**האור החוזר מהקירות — בוטל** — השורה ״אור חוזר מהקירות (כבד מאוד)״ ירדה מן ההגדרות. כשסימנו אותה יחד עם ״צל רך בפינות״, כל המבט התעמעם באפור, והופיעו כתמים על הרצפה ועל הקירות. ״צל רך בפינות״ נשאר: הוא מוסיף צל עדין רק בפינות, בחיבורים ובתחתית הקירות."]],   // OPS_GROUPS_303, GI_OFF_303
    ["2.0.11", ["@גדול **שימו לב: ייתכן שהטעינה תהיה איטית מעט יותר** — מנוע הציור עודכן לגרסה חדשה, שמחשבת בטעינה את ההשתקפויות בזהב ובשיש בדיוק רב יותר. זה אמור להשתלם: התנועה בתוך המודל לא נעשתה איטית יותר, ובמחשב עם כרטיס גרפי ההבדל בטעינה אמור להיות קטן. אם אצלכם הטעינה איטית במיוחד, או שמשהו נראה אחרת — נשמח מאוד שתדווחו לנו, בכפתור ״דיווח״ שבסרגל העליון (באוצריא).", "**חדש: המסיבה ובית הטבילה** — הדרך שבה כהן שאירע לו קרי בלילה יורד מבית המוקד לטבול (תמיד א, א): מעלות סביב עמוד יורדות מן הלשכה הצפונית מערבית אל מחילה שמתחת לקרקע, ונרות דולקים משני צדיה; בסופה המדורה, בית כסא של כבוד, ודלתו פתוחה, ובית הטבילה. במקום ״המסיבה ובית הטבילה״ (בקבוצת ״לשכות״) הקרקע נעשית שקופה, ורואים את כל הדרך מלמעלה. ובהדגמה החדשה ״הכהן יורד לבית הטבילה״ (בקבוצת ״הדגמות״) — ההליכה כולה, בגובה העיניים.", "**ספלי הניסוך — צוירו מחדש, בשתי השיטות** — שני הספלים שבראש המזבח, בקרן דרומית מערבית, קבועים עכשיו בגג המזבח. בשיטת רש״י: חוטם לכל ספל, ונקב בגג המזבח לכל אחד. בשיטת התוספות: נקב בתחתית כל ספל, ספל המים תחתיתו עבה, ומעל כל נקב כיסוי קטן כמין חוטם (״ושמא כמין בליטת חוטם״). במקום ״ספלי הניסוך״ פינת המזבח נעשית שקופה, ורואים את הנקבים יורדים אל השיתין. ובהדגמת ״סדר עבודת הבוקר״ הכהן מנסך את היין כשהוא עומד מצפון לספלים — עד עכשיו עמד בתוך ספל המים.", "**צל השמש — פחות עבודה למחשב** — צל השמש מצויר עכשיו מחדש רק כשמשהו בו משתנה: כשהאור או חלק מן המודל זזים, או כשמשתמשים בחתך. עד עכשיו הוא צויר מחדש בכל תמונה ותמונה, גם כשדבר לא השתנה. בזכות זה התנועה חלקה יותר, בעיקר במחשבים חלשים.", "**שתי אפשרויות חדשות לתאורה** — בהגדרות נוספו שתי שורות: ״איכות גבוהה: צל רך בפינות״ — צל עדין בפינות, בחיבורים ובתחתית הקירות; ו״אור חוזר מהקירות (כבד מאוד)״ — האור שחוזר מן הקירות ומן הזהב אל מה שסביבם. שתיהן כבויות מראש. במחשב חלש הן מאטות את התנועה, והשנייה מאוד.", "**השער הגדול — הכהן יוצא מן המבט** — בהדגמות ״הכניסה בפשפש״ ו״פתיחת השער הגדול״, אחרי שהשער נפתח, הכהן נכנס להיכל, פונה צפונה לאורך הכותל המזרחי, ויוצא מן המבט לפני סוף ההדגמה. עד עכשיו הוא הלך באמצע ההיכל, מול העין, ונעלם פתאום כשההדגמה נגמרה."]],
    ["2.0.10", ["**מבט במקום — גם כלפי מטה** — בתוך מבנה מקורה, ובמצב הליכה, אפשר עכשיו להוריד את המבט כמעט עד למטה ממש. עד עכשיו, כשהמבט ירד הרבה ושחררו את העכבר, המצלמה קפצה ממקומה והמבט הסתובב; ובמצב הליכה העין החליקה לאחור ושקעה.", "**מעבר חלק אל כל מקום** — כל מעבר — בלחיצה על מקום, על מבט, או במצגת — עובר עכשיו בדרך חלקה מתחילתו ועד סופו. עד עכשיו, במעבר שעבר מעל המקום, המבט קפץ והתמונה הסתובבה בבת אחת באמצע הדרך.", "**עצירת מעבר באמצעו** — לחיצה על המודל, גלגלת העכבר, מקש או כפתור ניווט בזמן מעבר עוצרים אותו במקום שבו הוא נמצא, ומשם אפשר להסתובב ולהתקרב מיד. עד עכשיו גרירה בזמן מעבר לא נקלטה, ושארית שלה המשיכה להזיז את המבט אחרי סוף המעבר.", "**התקרבות לכלי** — כשמתקרבים מאוד לכלי — בכפתור ״+״, במקש + או בצביטה — הכלי כבר אינו נחתך.", "**מצב הליכה עולה ויורד עם הרצפה** — בהליכה העין שומרת על גובהה מעל הרצפה שתחתיה: עולה במדרגות ויורדת מהן. עד עכשיו, במעבר מן החצר אל מקום גבוה ממנה, העין נכנסה לתוך הרצפה.", "**הדגמות במצגת הרציפה** — כשמסתכלים סביב בזמן הדגמה במצגת הרציפה, ההדגמה נעצרת והמבט חופשי; כשהמצגת ממשיכה, גם ההדגמה ממשיכה מאותו רגע. עד עכשיו ההדגמה המשיכה להוביל את המבט, ואי אפשר היה להסתובב עד סופה.", "**המצפן** — לחיצה על מקום מיד אחרי לחיצה על אות במצפן כבר אינה מעקמת את המעבר.", "**צביטה במסך מגע** — צביטה בשתי אצבעות בתוך מבנה מקורה מקרבת ומרחיקה את המבט. עד עכשיו היא הרעידה אותו.", "**קבוצת ״הדגמות״** — בראש רשימת המקומות יש עכשיו קבוצה חדשה, ״הדגמות״, ובה כל ההדגמות של הבית במקום אחד.", "**כפתורי ההדגמה בצד** — הכפתורים ״השהה״ ו״עצור״, שמופיעים בזמן הדגמה, עברו לצד שמאל, מעל המצפן. עד עכשיו הם עמדו באמצע המסך והסתירו את המודל.", "**קולות בהדגמות** — בעוד הדגמות נשמעים עכשיו קולות, בעוצמה נמוכה. השהיה או עצירה של ההדגמה משתיקות אותם מיד. אפשר לכבות את כל הקולות בהגדרות, בשורה ״קולות בהדגמות״.", "**מדידה באמות** — נקודת מדידה נקבעת עכשיו רק על מה שרואים: לא על חלק שהחתך הסתיר, ולא על משהו שקרוב מדי לעין. עד עכשיו נקודה יכלה ליפול על חלק שאינו נראה, והמידה יצאה שגויה.", "**סדר עבודת הבוקר — המבט הנע** — בהדגמה, המבט הנע מכוון עכשיו בדיוק אל מה שמוצג. עד עכשיו, במבט שכמעט מעל המקום, הוא נטה כחמש מעלות הצידה.", "**פרחי כהונה צעירים** — בהדגמת שמחת בית השואבה, פרחי הכהונה נראים עכשיו צעירים: שיער כהה וזקן קצר. עד עכשיו היה להם שיער לבן.", "**שתי הסנהדראות הקטנות** — המקום ״שתי הסנהדראות הקטנות״ מראה עכשיו את שתיהן במבט אחד. עד עכשיו נראתה רק אחת.", "**פרוכת השער** — כשבוחרים שער שיש בו פרוכת, למשל ״שער הבכורות״, הפרוכת מורמת, וכך רואים את הפתח. עד עכשיו הפרוכת נשארה סגורה והסתירה אותו.", "**הכהן הגדול נכנס בקטורת** — בהדגמה, הכהן הגדול הולך עכשיו בדרך חלקה ואינו נכנס לתוך הכתלים. הדרך עצמה, בכל שיטה, לא השתנתה.", "**הטבת הנרות** — בעבודת הבוקר, יד הכהן מגיעה עכשיו אל כל נר שהוא מטיב. בשיטת הרמב״ם, כתובית בתחילת ״הטבת שתי נרות״ מסבירה למה כל שבעת הנרות דולקים.", "**הקולות בהדגמות של בית שני** — קול השער הגדול כשהוא נפתח, דלת הפשפש, גלגל המוכני והמים כשהכיור יורד לבור ועולה, צעדי הכהנים בפייסות ובכניסת הכהן הגדול, וקול הקטורת על הגחלים. רעש האש בעבודת הבוקר שקט עכשיו יותר."]],   // CAM_219
    ["2.0.9", ["**תוספות יום טוב — אפשרות שלישית במתג ״פריפת הפרוכות״** — לפי תוספות יום טוב (יומא ה, א), הפרוכת הייתה ארוכה מרוחב הבית, וקצה ״יצאת לחוץ לתוך ההיכל ונאחזת בכותל הדרום בקרס״. במודל: הפינה התחתונה של הפרוכת מורמת, נמשכת אל הכותל ונאחזת בו בקרס של זהב, והכהן הגדול נכנס מתחתיה. בכרטיס — גם קושיית הרש״ש על פירוש זה.", "**דרך הכהן הגדול לשיטת רבי מאיר** — בהדגמה ״הכהן הגדול נכנס בקטורת״ יש עכשיו דרך שלישית. רבי מאיר אומר: ״בין שלחן למזבח״, ו״לעולם כרבי יוסי סבירא ליה״ — הפתח בצפון (יומא נא:). במודל: פרוכת אחת, והכהן הגדול הולך בין השולחן למזבח, ואחרי השולחן פונה לצפון. בוחרים בה במתג ״הפרוכות ודרך הכהן הגדול״.", "**מתג חדש: סידור הלחם והדלקת הנרות בכלי שלמה** — כשמוצגים עשרת השולחנות ועשר המנורות של שלמה, אפשר לבחור: כתנא קמא ורבי יוסי ברבי יהודה — לחם ונרות רק בשל משה (ברירת המחדל); או כרבי אלעזר בן שמוע (מנחות צט.) — ״על כולם היו מסדרין... ובכולן היו מדליקין״. בכרטיס — גם פירוש רש״י: ״פעמים בזה פעמים בזה״.", "**פרוכות בשערים, בפתח ההיכל ובפתח האולם** — ״שלש עשרה פרכות היו במקדש שני״ (כתובות קו.; רמב״ם כלי המקדש ז, יז). עד עכשיו צוירו רק שתי הפרוכות שבין הקודש לקודש הקדשים. עכשיו מצוירות גם שבע הפרוכות של שערי העזרה, פרוכת פתח ההיכל ופרוכת פתח האולם — תלויות מבחוץ, לפני הפתח. הן פרוסות, ומתג ״פרוכות הפתחים״ מגביה אותן. בזמן הדגמה, וכשהמבט עובר דרך פתח, הפרוכת שלו מוגבהת מעצמה.", "**שתי הפרוכות שבעלייה** — גם בעלייה, מעל ההיכל וקודש הקדשים, יש עכשיו שתי פרוכות. מתג ״הפרוכות שבעלייה״: מכותל לכותל, כתוספות יום טוב (ברירת המחדל); או באמצע בלבד, וראשי הפספסין מן הכתלים — כלחם שמים.", "**מקום חדש: שלוש עשרה הפרוכות** — ברשימת המקומות, תחת ״ההיכל ופנים״: כל הפרוכות שבמקדש השני, ומקורותיהן.", "**סרגל במסך הבחירה** — במסך הפתיחה, שבו בוחרים בית ראשון או בית שני, יש עכשיו סרגל בתחתית. באוצריא יש בו מתג לכפתור ״פתח בתוסף בית המקדש״, שבסרגל העליון של ספרים כמו מלכים, דברי הימים ומידות: אפשר להסתיר את הכפתור ולהחזיר אותו, בלי לבטל הרשאה. מתג לכפתור שבשדה החיפוש יפעל מגרסה 0.9.99 של אוצריא. בקובץ לצפייה בלי אוצריא נמצא בסרגל הזה כפתור ״בדיקת עדכונים״ — עד עכשיו הוא היה בסוף התפריט."]],
    ["2.0.8", ["**שתי הפרוכות — מכותל לכותל** — כל אחת משתי הפרוכות שבין ההיכל לקודש הקדשים מגיעה עכשיו מן הכותל הצפוני עד הכותל הדרומי. עד עכשיו צוירה כל פרוכת קצרה יותר, ובין קצה הפרוכת לכותל נשאר רווח — בחיצונה בדרום, ובפנימית בצפון — ובו היה הפתח.", "**מתג חדש: פריפת הפרוכות — רש״י או תוספות רי״ד** — המשנה (יומא ה, א): ״החיצונה היתה פרופה מן הדרום, והפנימית מן הצפון״. ברירת המחדל, כרש״י (יומא נב:): הפינה התחתונה של הפרוכת, ליד הכותל, כפולה כלפי חוץ ונאחזת בקרס של זהב, ומתחתיה הפתח. האפשרות השנייה, כתוספות רי״ד (יומא נב:): הפרוכת סגורה, ומחוברת לשני הכתלים בקרסים ובלולאות לכל גובהה; ליד הפתח הלולאות רפויות, ובהדגמת כניסת הכהן הגדול ביום הכיפורים הפינה נפתחת כשהוא מגיע אליה, ונסגרת אחריו.", "**שולחנות שלמה — בצורת שולחן משה** — כשבמתג ״שולחנות שלמה ומנורותיו — בבית שני״ נבחרה האפשרות של רש״י, עשרת השולחנות מצוירים עכשיו כמו שולחן לחם הפנים, וכמו בבית ראשון: עם הסניפים, הקנים ושני הבזיכים. אבל בלי לחם ובלי לבונה — ״ולא היו מסדרין אלא על של משה״ (מנחות צט.). עד עכשיו צוירו כשולחנות פשוטים."]],
    ["2.0.7", ["**הדגמת כניסת הכהן הגדול ביום הכיפורים — בלי שולחנות שלמה** — כשבמתג ״שולחנות שלמה ומנורותיו — בבית שני״ נבחרה האפשרות של רש״י והמפרש, עשרת השולחנות ועשר המנורות של שלמה מוסתרים בזמן ההדגמה, ודרכו של הכהן הגדול נשארת כמו שהייתה. בסוף ההדגמה הם חוזרים. בלי זה הדרך עברה דרכם, כשהשולחן או המנורה מונחים מצפון לדרום — ״הלכך מפסקי שולחנות את הדרך״ (רש״י, יומא נא:).", "**שולחנות שלמה — עוד שני מקורות בכרטיס** — מלאכת שלמה (שקלים ו, ד), בשם הירושלמי: ״דאיכא נמי בהיכל עשר שלחנות שעשה שלמה... ובאותם של שלמה לא היו מסדרין״; והרש״ש (יומא נא:), על דברי רש״י שם."]],
    ["2.0.6", ["**מתג חדש: שולחנות שלמה ומנורותיו — בבית שני** — ברירת המחדל, כתוספות רי״ד (יומא נא:): בהיכל של בית שני היו שולחן אחד ומנורה אחת. האפשרות השנייה, כרש״י (יומא נא:) וכמפרש למסכת תמיד (לא:): גם עשרת השולחנות ועשר המנורות שעשה שלמה עמדו בהיכל, אבל לא סידרו עליהם לחם ולא הדליקו בהם (מנחות צט.). הסידור — ״של משה באמצע, חמשה מימינו, וחמשה משמאלו״ (מנחות צח:): השולחנות בצפון ההיכל והמנורות בדרומו, לפי המתג ״כיוון המנורה והשולחן״. כשהשולחן מונח ממזרח למערב — שתי שורות של חמישה, ושולחן משה ממערב להן, מול הרווח שביניהן (מנחות צט. ורש״י שם); והמנורות — כמו השולחנות (המאירי, יומא נא:).", "**שער ניקנור פתוח** — דלתות הנחושת של השער עומדות פתוחות בתוך עובי השער, ואפשר לראות דרכו מעזרת ישראל אל עזרת הנשים. עד עכשיו עמדו בתוך המעבר עוד שתי דלתות כמעט סגורות, ועוד שתיים בשני הפשפשים שלצדו — שרידים מגרסה ישנה.", "**הדגמת סדר עבודת הבוקר — בלי מעבר דרך קירות** — כהנים שעברו דרך פינת האולם ומעלותיו, דרך הכותל המזרחי של העזרה, דרך הכבש הקטן או דרך הקירות של הלשכות שבדרום העזרה — עוקפים אותם עכשיו. הלויים נכנסים בפתח שער ניקנור בשני טורים, ומתפזרים אל הדוכן רק אחרי שעברו את הכותל. הממונה דופק על שער בית המוקד מן הרחבה שלפניו, ודלתות השער נפתחות לו — ״והם פתחו לו״ (תמיד א, ב); עד עכשיו עמד על הקרקע שמתחת לרחבה, ונכנס דרך האבן.", "**הדגמת סדר עבודת הבוקר — בלי קפיצות** — האחים שרצים אל הכיור (״והן רצין ובאין״, תמיד ב, א) רצים מן המקום שבו נפגשו הכהנים, ליד לשכת עושי חביתין; עד עכשיו שניים מהם רצו כמאה וחמישים אמה בארבע שניות. שלושת הכהנים של הסולת, החביתין והיין יוצאים מלשכת הגזית אחרי מעלי האברים, ולא מופיעים פתאום בשורה. הרואה של ״ברקאי״ עולה לגג לשכת הגזית ויורד ממנו, ולא נשאר עומד שם עד קריאת שמע. ובכמה שלבים ההליכה ארוכה ואיטית יותר: אל הכיור, בהעלאת האברים, במנחה ובנסכים."]],
    ["2.0.5", ["**קידוש ידיים ורגליים** — בהדגמת סדר עבודת הבוקר (בשלב ״קידוש ידיים ורגליים — והמוכני״) הכהן מרים את רגל ימין, ומניח עליה את יד ימין, תחת הזרם שיוצא מן הכיור. אחר כך הוא מוריד אותה, צועד צעד אחד, ועושה כך ברגל שמאל וביד שמאל — ״מניח ידו הימנית על גבי רגלו הימנית, וידו השמאלית על גבי רגלו השמאלית, ומקדש״ (זבחים יט, ב). פניו אל הכיור, והוא עומד על רצפת העזרה. עד עכשיו הוא רק שחה מן המותניים, והניח את ידיו על רגליו.", "**שמחת בית השואבה** — בהדגמת המנורות של זהב, הילדים מפרחי הכהונה עולים על הסולמות, ועומדים על השלב העליון. הם מטים את הכדים מעל הספלים, ורואים את השמן נשפך לתוך כל ספל — ״שהן מטילין לכל ספל וספל״ (סוכה ה, ב). עד עכשיו עלו באוויר ליד הסולמות, והכד הוטה מתחת לשפת הספל, כך שהשמן לא נכנס אליו."]],
    ["2.0.4", ["**קידוש ידיים ורגליים** — בהדגמת סדר עבודת הבוקר (״קידוש ידיים ורגליים — והמוכני״) הכהן עומד עכשיו ורגליו זקופות, שוחה מן המותניים, וידיו על רגליו — ״מניח ידו הימנית על גבי רגלו הימנית, וידו השמאלית על גבי רגלו השמאלית, ומקדש״ (זבחים יט, ב). עד עכשיו נטה כל גופו באלכסון, כמו נופל.", "**המוכני של הכיור** — בשיטת הרמב״ם (בתפריט, תחת ״שיטות ומחלוקות״) נוספה לשונו בפירוש המשניות (תמיד ג, ח): ״מכסה גבוה יורד בגלגל״, ודברי התוספות יום טוב עליה (תמיד א, ד): ״שהיה כלי סביב ושהיו משקעים אותו הכלי״ — כלומר, זה אותו הכלי שסביב הכיור."]],
    ["2.0.3", ["**שערי חולדה** — המבט של המקום (בתפריט: ״שערי הר הבית וחצרות״, ״שערי חולדה״) מראה עכשיו את שני השערים ואת המדרגות שלהם; עד עכשיו נראה בעיקר הקיר שביניהם.", "**הדגמת הפייסות** — הממונה, והאבוקה אחריו, באים מהר הבית, עוברים בפתח שבסורג ועולים בעשרים ושבע המדרגות שלאורך הכותל הצפוני של בית המוקד, עד השער; ואחרי שפותחים לו — עולים בחמש המדרגות שבתוך השער, אל רצפת הבית. עד עכשיו הלכו בדרך הישנה, מלפני שהחיל הועמד בגובה הר הבית (בגרסה 2.0.2), ועלו כאילו באוויר. וכך גם בפירושו השני של הרא״ש, שהשער בכותל המזרחי — ושם השער גם נפתח עכשיו לממונה.", "**הדגמת הפייסות, לשיטת הרמב״ם** — שתי דמויות שהלכו בתוך בית המוקד שתי אמות וחצי מתחת לרצפתו — הולכות עכשיו על הרצפה."]],
    ["2.0.2", ["**לשכות כלי השיר** — שתי לשכות חדשות (מידות ב, ו; רמב״ם בית הבחירה ו, ו): פתחן בעזרת הנשים, והן נמשכות אל מתחת לרצפת עזרת ישראל; ובהן כינורות, נבלים ומצלתיים. מעליהן, משני צדי שער ניקנור, לשכת פנחס המלביש ולשכת עושי חביתין — ״בעזרת ישראל״, כלשון הרמב״ם (בית הבחירה ה, יז), ופתחן אליה. מקום הפתח ועומק הלשכה — בחירת מודל. בתפריט: ״לשכות״.", "**חלקי יהודה ובנימין** — רצפת העזרה צבועה לפי חלקי השבטים, יהודה בזהב ובנימין בכחול; ונראית הרצועה היוצאת מחלקו של יהודה, שבה המזבח בנוי (יומא יב.; זבחים נג:). עד היכן היא נמשכת בדרום — בחירת מודל. בתפריט: ״מזבח וכלים״.", "**צפון לשחיטת קדשי קדשים** — ״איזהו צפון״ (יומא לו.): דעות רבי יוסי ברבי יהודה, רבי אלעזר ברבי שמעון ורבי נצבעות על רצפת העזרה, כל אחת בצבעה; והגבול הדרומי — לרש״י ולרמב״ם. מתג חדש בתפריט, תחת ״שיטות ומחלוקות״.", "**יום הכיפורים** — הדגמה חדשה: ״הכהן הגדול נכנס בקטורת״ (יומא ה, א–ב). מקומות חדשים: ״הרובד הרביעי״ ו״כני הזהב שבהיכל״ (תחת ״ההיכל ופנים״) ו״שלוש המחתות״ (תחת ״מזבח וכלים״). ושני מתגים: ״הפרוכות — שתיים או אחת״, ״כני הזהב — שניים או אחד״.", "**שמחת בית השואבה** — מנורות הזהב שבעזרת הנשים, גובהן חמישים אמה (סוכה נב:); ובהדגמה פרחי הכהונה עולים בסולמות, יוצקים שמן ומדליקים. מספר המנורות — בחירת מודל. בתפריט: ״שערי הר הבית וחצרות״, ״מנורות של זהב״.", "**בית המוקד** — הבית הורחב, וארבע לשכותיו נבנו מחדש. מקומות חדשים תחת ״לשכות״: ״לשכת עושי לחם הפנים״ (התנור, הדפוסים והחלות), ״לשכת החותמות״, ״לשכת אבני המזבח״ ו״הירידה לבית הטבילה״. וברצפה — טבלת השיש שתחתיה מפתחות העזרה (מידות א, ט).", "**אנשים וכלים בלשכות** — בלשכת המלח, הפרוה, המדיחין, בית אבטינס, פרהדרין, הנזירים, המצורעים, עושי חביתין ולשכת הכלים; ובלשכת פנחס המלביש — תשעים ושישה החלונות לבגדי הכהונה (רמב״ם כלי המקדש ח, ח–ט). מי שעובד בכל לשכה — כהן, לוי או ישראל — לפי המקור; ובאין מקור, כתוב בכרטיס ״בחירת מודל״.", "**הממונים שבמקדש** — חמישה עשר הממונים שבמשנה (שקלים ה, א) עומדים במקומות עבודתם, ולכל אחד לוחית ובה מספרו, שמו ותפקידו. צבע הלוחית: כהן, לוי או ישראל — לפי המקורות; ומי ששבטו לא נתפרש — בכחול. בתפריט: ״לשכות״.", "**סדר עבודת הבוקר** — נוספו להדגמה: המפתח שמתחת לטבלת השיש (מידות א, ט); ״שלום, הכל שלום״; קידוש ידיים ורגליים (זבחים יט:); האברים שלא נתאכלו מבערב (תמיד ב, א); הצתת האליתא; המערכה השלישית; שפיכת דשן המזבח הפנימי והמנורה, מיד אחר הטבת שתי הנרות; ושנים עשר לויים האומרים שירה בפה, ולצדם המנגנים (רמב״ם כלי המקדש ג, ג). ותוקן: הזוכה בתרומת הדשן הוא המסדר את המערכה הגדולה ומניח את שני הגזרים (יומא כב.), והעולים למזבח עולים במזרח הכבש ויורדים במערבו (יומא ד, ה).", "**מתגים חדשים** (בתפריט, תחת ״שיטות ומחלוקות״) — ״צורת לחם הפנים״: ספינה רוקדת או תיבה פרוצה (מנחות צד:); ״קירוי הר הבית״: רק האצטבאות שבצדדים, או ההר כולו עד כותלי העזרות; ״הסורג — שלוש עשרה הפרצות״; ״חביתי כהן גדול — אפייה וטיגון״ (מנחות נ:); ״לשכת עושי לחם הפנים — מה נעשה בה״; ״המוכני של הכיור״: גלגל, ומשקיעים את הכיור בבור (רש״י והראב״ד), או כלי חול סביב הכיור, ובו המים (הרמב״ם).", "**בית המטבחים — ארבע שיטות** — שיטת הראבי״ה ושיטת הגר״א הוצגו עד כה, בטעות, כשיטה אחת; עכשיו כל אחת לעצמה. במתג ״בית המטבחים — העמודים והאונקליות״.", "**המזבח והכבש** — לכל מידה של המזבח (32, 30, 28, 26 ו־24 אמה) קו בצבע משלו, ולצדו לוחית; התפוח לשיטת הראב״ד צויר מחדש; הכבש הקטן העולה לסובב יוצא מצד הכבש הגדול; וחיצים על הכבש מראים היכן עולים והיכן יורדים (יומא ד, ה) — מקום חדש תחת ״מזבח וכלים״.", "**החיל** — נבנה מחדש: עשר אמות פנויות לפנים מן הסורג, כלשון הברטנורא, בגובה הר הבית, כדברי הרמב״ם (בית הבחירה ו, א); ושתים עשרה המעלות בתוכו.", "**ועוד במודל** — נרות המנורה: כשהיא עומדת מצפון לדרום (ברירת המחדל) הם פונים אל הנר האמצעי (מנחות צח:), וכשבוחרים בשיטת רבי, ממזרח למערב — פי כל הנרות למערב, כציור הרמב״ם בפירוש המשנה (תמיד ג, ט); מזוזה בשער ניקנור ובלשכת פרהדרין; ניצוצות הנברשת של הילני בזריחת החמה (יומא לז:); פתחים ודלתות ללשכות עזרת הנשים לשיטת הרא״ש; ושמות ברורים לשמונה השיטות שב״צורת התאים״.", "**צורת ההר** — הקרקע שסביב הר הבית יורדת אל נחל קדרון שבמזרח, אל המדרון שבדרום ואל העמק שבמערב; וכבש הפרה נמשך מעליה על כיפין. העומקים והמרחקים — בחירת מודל.", "**נוח יותר** — קולות בהדגמות (לכיבוי: בתפריט, תחת ״תצוגה״); כרטיס הסבר ארוך מציג את תחילתו ואת הפסקה ״במודל״, והכפתור ״המשך הכרטיס״ פותח את האמצע; המקש Enter מקרב אל המקום שהסמן עומד עליו, ו־Shift עם Enter מרחיק; דף ״ניווט״ נכתב מחדש בלשון פשוטה; גוון אבן עתיקה לחומות וללשכות (״תצוגה״); ו״מה חדש בגרסה זו״, בסוף התפריט, פותח שוב את הרשימה הזאת.", "**תיקונים** — בהדגמות: הכהנים אינם שוקעים עוד ברצפה בפייס הראשון; ההתכנסות לפייס ולקריאת שמע היא עכשיו בתוך לשכת הגזית; בפתיחת השער הגדול נראים המפתח והבריח מקרוב; ובפשפשים פותח את המנעולים כהן, ולא יד לבדה. ״מבט כללי״ מחזיר את מה שמקום הדליק מעצמו; ובמצגת כל מקום מוצג עם תצוגתו (הממונים, רצועת השבטים). תוקנו מבטים שנכנסו לתוך קיר. לדמויות שיער ופאות; הלויים בלבוש פשוט, ולא בבגדי כהונה."]],
    ["2.0.1", ["**לשכת השמנים — מלאה** — בעזרת נשים: מדפי עץ לאורך הכתלים ושלושה מדפים עומדים באמצע, חמש קומות, מלאים כדי שמן. חביות היין הקטנות ושבע מידות הלח נשארו במקומן.", "**לשכת העצים — מלאה** — עשרים ואחת ערמות עצים בגדלים שונים, משלושה מינים: ״במרביות של תאנה ושל אגוז ושל עץ שמן״ (תמיד ב, ג). מן הפתח נשאר מעבר פנוי, והרצפה המשונה מחברותיה — במקומה.", "**לשכת הטלאים** — בבית המוקד: עשרה טלאים בגדלים שונים, מטלה צעיר ועד בן שנתו — ״אין פוחתין מששה טלאים המבקרין בלשכת הטלאים״ (ערכין ב, ה). כפתור חדש בתפריט, בקטגוריה ״לשכות״: ״לשכת הטלאים — בבית המוקד״. ובלשכה שבה גנזו בני חשמונאי את אבני המזבח — ערמת אבנים.", "**שמות הלשכות שבבית המוקד לפי משנת תמיד** — מעל שם כל לשכה כמשנת מידות מופיע עכשיו גם שמה במשנת תמיד (ג, ג). בשתי הלשכות שבצפון יש מחלוקת: לרש״י, לתוספות רי״ד ולריטב״א (יומא יז.) — בית המוקד בצפון־מזרח והחותמות בצפון־מערב; לברטנורא, למאירי, ליכין ולמפרש — להפך. מתג חדש בקטגוריה ״שיטות ומחלוקות״.", "**שלחן החלבים** — שני השולחנות שבמערב הכבש (שקלים ו, ד) עברו אל ליד הקרן המערבית־הדרומית של המזבח, כדברי הראב״ד. שלחן השיש הוא ״שלחן החלבים״ שבמשנה בתמיד (ז, ג): עליו עומדים שני הכהנים עם החצוצרות בשעת ניסוך היין. כפתור חדש בתפריט, בקטגוריה ״מזבח וכלים״.", "**מעבר בין מקומות** — מקום בתפריט שהדליק לעצמו תצוגה מיוחדת מכבה אותה כשעוברים למקום אחר. עד כה התצוגה נשארה דולקת גם במקומות הבאים, ונראה כאילו היא חלק מן המודל. מה שהדלקתם בעצמכם — נשאר דולק.", "**כפתורים שעל המודל** — כפתור שנפל מתחת לתפריט או מתחת לכרטיס ההסבר זז עכשיו הצידה, אל המקום הפנוי, כדי שאפשר יהיה ללחוץ עליו.", "**תיקוני ציטוטים** — בודק חיצוני השווה את הציטוטים שבכרטיסים לספרים עצמם. תוקנו: דברי תוספות יום טוב שהובאו כאילו הם דברי התוספות (כתובות קו.); דברי התפארת ישראל שנראו כדברי הגמרא (זבחים נה:) — ונוסף לשון הגמרא עצמה; לשון רבינו שמעיה (מידות ד, ז); מילה במשנה ביומא (ה, א) ומילה בברטנורא (יומא ג, י). וכמה ביטויים שלא היו מובנים לקורא מן החוץ.", "**לשכת פנחס המלביש** — המבט על הלשכה מלמעלה, בלי הקורה שחצתה את התמונה לפני הארון והבגדים.", "**בקובץ לצפייה בלי אוצריא בלבד — עדכון בלחיצה** — כפתור ״בדיקת עדכונים״ שבסוף התפריט מוריד עכשיו את הגרסה החדשה ושומר אותה. בכרום ובאדג׳ נפתח חלון ״שמירה בשם״; בשם הקובץ מופיע מספר הגרסה, כך שהקובץ הישן אינו נדרס. הקובץ נבדק לפני השמירה, וקובץ פגום אינו נשמר."]],
    ["2.0.0", ["**סדר עבודת הבוקר — ההשתחוויות** — הכהנים משתחווים עכשיו כלפי ההיכל, כלומר כלפי מערב. קודם לכן נראה כאילו כהן משתחווה על המזבח, וכהנים שעל מעלות האולם השתחוו כלפי המזבח. הכהן שבהיכל מתרחק מעט ממזבח הזהב, ורק אז משתחווה.", "**סדר עבודת הבוקר — עצירה במתג** — לחיצה על מקום בתפריט או על מתג עוצרת עכשיו את ההדגמה ועוברת אליו, כמו בשאר ההדגמות. עד כה ההדגמה המשיכה, והמצלמה חזרה אליה מיד.", "**סדר עבודת הבוקר — ההתחלה מהתפריט** — ההדגמה נפתחת עכשיו במבט על בית המוקד, ולא במבט על המזבח.", "**סדר עבודת הבוקר — מבטים** — בשלבי הלילה (בית המוקד, הפייס הראשון, שתי הכיתות עם האבוקות, הטלה מלשכת הטלאים) ובברכת כהנים — המצלמה עומדת עכשיו במקום שרואים ממנו את מה שקורה, ולא מאחורי דלתות השער.", "**המצגת לפי הנושאים** — בשקופית ״סדר עבודת הבוקר״ המצגת מציגה את המקום וממשיכה הלאה. עד כה היא נכנסה להדגמה כולה ולא חזרה לשאר השקופיות. את ההדגמה עצמה מפעילים מתפריט המצגת, או בכפתור שבתפריט.", "**השהיה במצגת** — כפתור ״השהה״ של המצגת משהה עכשיו גם הדגמה שרצה באותה שקופית, ו״המשך״ ממשיך אותה מאותו רגע. עד כה ההשהיה עצרה את ההדגמה לגמרי.", "**קודש הקדשים ואבן השתייה — כפתור אחד** — בתפריט היו שני כפתורים שהראו אותו מבט ואותו כרטיס. עכשיו יש כפתור אחד: ״קודש הקדשים ואבן השתייה״.", "**הנברשת והטבלא של הילני** — הכפתור מראה עכשיו את שתיהן יחד: הנברשת מעל פתח ההיכל, והטבלא על הכותל שמצפון לפתח."]],
    ["1.9.9", ["**לילה ברור יותר** — בהדגמת הפייסות ובהדגמת סדר עבודת הבוקר, שמתחילות בלילה, הלילה כחול ובהיר יותר, ורואים היטב את הבניינים. האבוקות והמדורות נשארו באורן החם.", "**הנברשת והטבלא של הילני** (יומא ג, י) — הילני, אמו של מונבז המלך, עשתה נברשת של זהב על פתח ההיכל, וטבלא של זהב שפרשת סוטה כתובה עליה. מה הייתה הנברשת — לרש״י: מנורה; לרמב״ם: ״כמו שמשית שעושין על פתחי הבתים״. את הפירושים מחליפים במתג חדש, בקטגוריה ״שיטות ומחלוקות״.", "**שלשה עשר שופרות** (שקלים ו, ה) — התיבות לכסף השקלים והנדבות. במודל — בעזרת ישראל.", "**לשכת בית האבן** (פרה ג, א) — הלשכה שבה הפרישו את הכהן השורף את הפרה, שבעה ימים לפני השריפה. לרש״י ולרמב״ם — בעזרה, בצד צפון־מזרח (במודל: עלייה על גג בניין שלוש הלשכות); לתוספות — מחוץ לעזרה. מתג חדש בקטגוריה ״שיטות ומחלוקות״.", "**לשכת חשאים** (שקלים ה, ו) — יראי חטא נתנו לתוכה צדקה בחשאי, ועניים בני טובים התפרנסו ממנה בחשאי. במודל — לשכה קטנה בעזרה.", "**כרטיסים חדשים** — ״הממונים שבמקדש״ (שקלים ה, א) ו״לשכת הכלים״ (תמיד ג, ד). ובכרטיס של קודש הקדשים נוספו דברי המשנה על אבן השתייה (יומא ה, ב).", "**מעלות האולם לפי הרמב״ם** — במתג ״מעלות האולם״, שיטת הרמב״ם מראה עכשיו את כותל האולם בנוי ״אמה ורובד״ מלמטה ועד למעלה.", "**דלת ללשכת המצורעים** — בעזרת נשים.", "**הגדלה בצביטה** — במחשב נייד עם משטח מגע, צביטה בשתי אצבעות עבדה הפוך. עכשיו פתיחת האצבעות מקרבת, וסגירתן מרחיקה."]],
    ["1.9.8", ["**הדגמה חדשה: סדר עבודת הבוקר** — לפי מסכת תמיד: מבית המוקד בלילה ועד שיר הלויים, שלב אחר שלב, בלשון המשנה. מפעילים בכפתור שעל המזבח, במקום ״סדר עבודת הבוקר — הדגמה״ שבקטגוריית ״מזבח וכלים״, או במצגת ״סדר עבודת הבוקר — מסכת תמיד״.", "**שתי שורות חדשות בטבלת השיטות** — ״סדר עבודת הבוקר — אביי או הרמב״ם״ ו״המנורה והנרות בבוקר״. בחירה בשורה משנה את ההדגמה מיד, באותו שלב.", "**הדמויות** — הכהנים בהדגמה הם הכהנים של הפייסות. האבנט שלהם לפי השורה ״אבנטו של כהן הדיוט״.", "**הלילה** — הלילה בהדגמה הוא הלילה של הפייסות.", "**הפייס הראשון — שתי שורות מקושרות** — בטבלת השיטות, ״הפייס הראשון — היכן ומתי״ ו״סדר עבודת הבוקר — אביי או הרמב״ם״ עוברות יחד. ברירת המחדל — אביי, כסדר המשנה.", "**זום אל הסמן** — גלגלת העכבר מגדילה עכשיו את המקום שהסמן עומד עליו, ולא את מרכז התמונה. הסמן נראה כזכוכית מגדלת.", "**השהיית הדגמה** — לחיצה על הדגם בזמן הדגמה (הפייסות, ההליכה במסיבה, פתיחת ארבע הדלתות, הכניסה בפשפש) משהה אותה, ולא מפסיקה אותה. בסרגל שלמטה: ״המשך״ — מאותה השנייה; ״מההתחלה״ (בהדגמת הפייסות); ״עצור״. בזמן ההשהיה אפשר להסתובב ולהתבונן."]],
    ["1.9.7", ["**המצגת — הדגמות** — שקופית שיש בה הדגמה נמשכת עד סוף ההדגמה. כך גם שקופיות השיטות של הפשפשים, של דלתות רבי יהודה ושל האבנט, שנקטעו עד כה אחרי עשר שניות. אחרי כל הדגמה — שתי שניות של מנוחה, והמבטים הנוספים של השקופית באים אחריה.", "**שער שושן ושער ניקנור** — נפתח הכרטיס המלא: לשון המשנה, ברטנורא, תוספות יום טוב ותפארת ישראל. בשער שושן — גם כותל המזרח הנמוך והכבש להר המשחה."]],
    ["1.9.6", ["**מהירות** — דמויות הסנהדרין מצוירות עכשיו בשלוש רמות פירוט, לפי המרחק מהן, ובלי צללים. התוסף חזר למהירותו.", "**המצגת — זמנים** — שבע שניות לשקופית במצב מהיר, עשר ברגיל, שתים עשרה באיטי.", "**המצגת — כמה דברים בשקופית אחת** — המבט עובר ביניהם באותה שקופית: לשכת שמנים, לשכת הנזירים, בית המוקד, לשכת הגזית, שלחנות האולם, המנורה והאבן שלפניה, המזבח ומידותיו, הכבשים הקטנים ועוד. וכן בשקופית של שלושה עשר השערים.", "**שער העליון — שבעה או שלושה עשר שערים** — דסקית מעל כל שער: זהובה לשבעת הגדולים, אדומה לששת הקטנים. כך נראית המחלוקת גם במבט הכללי. **שמות שערי הצפון** — מבט לכל קריאה, והשמות שבמחלוקת גדולים יותר.", "**שתי הפרוכות** — המבט עומד בין שתיהן, לאורך האמה שביניהן; ובמצגת — גם הפתח שבדרום והפתח שבצפון.", "**שלחן השיש שבאולם** — החלות בצורת החלות שעל השולחן שבפנים.", "**תקרת האולם** — הבחירה ״כיפה״ סוגרת את גג האולם ומראה את הכיפה מבפנים.", "**השיתין** — הכיתוב אינו מסתיר עוד את שני הנקבים. **הסורג** — מבט קרוב, והסבכה נראית. **הסטיו המלכותי** — מבט לאורך העמודים.", "**שערי בית המוקד** ו**הפייס הראשון לתפארת ישראל** — מבטים שמראים את העניין.", "**גלילה תחת גג** — צעד גלגלת אינו מזיז יותר משתי אמות, והתנועה אינה מהירה מעשרים אמה בשנייה.", "**חתך שמקום פותח** — אינו נסגר כל עוד העין עומדת בחלק החתוך.", "**הדגמת הפשפש** — עצירתה עוצרת גם את פתיחת השער הגדול שהיא הפעילה, ומשתיקה את קול הדלתות.", "**כרטיס לשכת הגזית** — פסקת הדמויות נכתבה בו חמש פעמים; עכשיו פעם אחת. **כרטיס המסיבה** — הוסר משפט ישן, שלפיו הלחיצה חותכת את המודל."]],
    ["1.9.5", ["**הדגמה חדשה: ארבעת הפייסות ו״ברקאי״** — מתג, כבוי כברירת מחדל. לילה שהופך ליום, בלי קול, והכתוביות בלשון המקורות: הממונה בא, בדיקת העזרה באבוקות, ארבעת הפייסות לפי סדרם, תרומת הדשן, ו״צאו וראו אם הגיע זמן השחיטה״. מפעילים בכפתור שעל המודל ליד לשכת הגזית, או במקום שבקבוצת הלשכות.", "**מתג חדש: הפייס הראשון — היכן ומתי** — הרמב״ם: עם השני, בלשכת הגזית (ברירת המחדל); תפארת ישראל, כסדר המשנה: בלילה, בבית המוקד. ההדגמה הולכת אחר הקריאה שנבחרה.", "**הכהנים שבהדגמה** — דמויות בארבעת בגדי הכהונה: כתונת משובצת, אבנט ומגבעת. הזוכה בפייס מסומן בחץ שמעל ראשו. השערים סגורים בלילה.", "**מקום חדש: בגדי הכהנים, ומתג חדש: אבנטו של כהן הדיוט** — הרמב״ם, כרבי: רקום בצמר צבוע (ברירת המחדל); רבי אלעזר ברבי שמעון: של בוץ. בכרטיס — ארבעת הבגדים, סדר הלבישה והמחלוקות, בקצרה.", "**שלוש הלשכות — הגזית, העץ והגולה** — בניין אחד וגג אחד שווה לשלושתן, במקומן כדברי הבועז. ולשכת הגזית כשיטת המאירי: חציה המזרחי קודש וחציה המערבי חול, והסנהדרין בחצי החול.", "**מתג חדש: כיוון המנורה והשולחן** — הרמב״ם: המנורה צפון ודרום (ברירת המחדל); רבי: מזרח ומערב; רבי אלעזר ברבי שמעון: צפון ודרום, וגם השולחן.", "**המערכה** — שני גזירי העצים אמה על אמה, כלשון הגמרא והרמב״ם. ובשיטת הראב״ד שבמתג ״התפוח״ — המערכות כסידורו: גזירים באורך אמה, ראשיהם על הטבלה.", "**מתג חדש: שושן הבירה ושתי האמות** — הרמב״ם: בשער שושן, בלי חדר (ברירת המחדל); רש״י: חדר על גבי שער המזרח של העזרה.", "**חמש עשרה המעלות — שתי קריאות** — הרמב״ם: כל מעלה חצי עיגול, לפני השער (ברירת המחדל); הרי״ד ורבינו יהונתן: מעלות ארוכות, כרוחב העזרה.", "**שתי הסנהדראות הקטנות** — לשכות סגורות, ומתג למקומן: לרש״י אצל שער עזרת נשים, וכפשט המשנה אצל שער הר הבית.", "**המעקה שבראש הבית** — טבעת אחת סביב כל הבית, בכל הקריאות.", "**השיתין** — שני הנקבים שבקרן היסוד, ומקום חדש בלוח.", "**כבש הפרה** — כיפין על גבי כיפין, ממזרח לשער שושן. **שער טדי** — דלתות כצורת ראשו המשופע. **השיש של הורדוס** — ברצפת העזרה, במתג ״בניין הורדוס״.", "**הרובדין שבראש הכבש** — שלושה חריצים של ממש באבן.", "**החיפוש במילות המקורות** — מוצא גם את מתגי השיטות.", "**הסנהדרין — דמויות** — הדיינים יושבים בגלימה שחורה ובכיפה: הזקן לבן סמוך לנשיא שבאמצע, אפור בהמשך השורה ושחור־חום בקצותיה. התלמידים שלפניהם — בלי זקן. שני הסופרים עומדים, ולוח בידם. כך גם בסנהדראות הקטנות.", "**ההליכה במסיבה ובפשפש** — בפינות המצלמה פונה לאט ובקו חלק.", "**המשמרות** — עיגול מעל כל משמר, שייראה גם במבט על ההר כולו. **לשכת פנחס המלביש** — הבגדים נראים על המדפים.", "**המצגת** — שקופית אחת לכל כפתור. מקום שמראה כמה דברים מראה את כולם בשקופית שלו. הדגמה שרצה נעצרת כשהמצגת מתחילה. סגירת כרטיס צף או קיפולו אינם עוצרים מצגת או הדגמה."]],
    ["1.9.4", ["**המצגת** — תפריט המצגת נפתח מתחת לכפתור, ולחיצה על אחד משלושת המצבים מתחילה אותה (בגרסה הקודמת התפריט התפזר בסרגל, והמצגת לא התחילה); והיא מתחילה ממצב רגיל: מה שנשאר פתוח נסגר בתחילתה, וחוזר בסופה.", "**מבטים מתוקנים בטבלת השיטות** — לחיצה על המתג מביאה אל הדבר עצמו: ״תקרת האולם — בלי תקרה״ מלמעלה, אל תוך האולם הפתוח; ״חומר המנורה והשולחן״ מול המנורה והשולחן; ״הציור על הפרוכות״ מול הפרוכת; ״שערי בית המוקד״ מעל הלשכה, בשתי צורות הבניין; ו״הרווח שבין הכבש למזבח״ מקרוב, מלמעלה.", "**הכסף נראה כסף** — המנורה והשולחן של כסף (וכן של ברזל מחופה בבעץ) צבועים באפור, ולא על גון הזהב.", "**הרווח שבין הכבש למזבח, לשיטת התוספות** — מצויר כחריץ כהה בין ראש הכבש למזבח, כדי שייראה."]],
    ["1.9.3", ["**בית שני — מודל שלם, לפי מסכת מידות והרמב״ם**: הר הבית ושעריו, הסורג והחיל, עזרת נשים וארבע לשכותיה, חמש עשרה המעלות ושער ניקנור, העזרה ושלושה עשר שעריה, הלשכות, המזבח והכבש, האולם, ההיכל, התאים והעלייה, וקודש הקדשים.", "**כרטיס הסבר לכל מקום** — לשון המשנה והרמב״ם, דברי המפרשים, ״בקצרה״ על המחלוקות, ומה נבחר במודל; המקורות נפתחים באוצריא בלחיצה.", "**טבלת ״שיטות ומחלוקות״** — עשרות שיטות מצוירות, ולחיצה מחליפה את המודל: מקום המזבח ומידותיו, צורת התאים, צורת הבניין (לשון המשנה, או ציור הרמב״ם), תקרת האולם, חמש עשרה המעלות (הרמב״ם, או הרי״ד ורבינו יהונתן), לשכות עזרת נשים, בית המטבחים, שמות השערים ועוד.", "**הדגמות בהליכה** — פתיחת ארבע הדלתות של השער הגדול במפתח של זהב, הכניסה בפשפש, המסיבה אל העלייה, והמוכני של הכיור.", "**מצגת** — בשלושה מצבים: לפי הנושאים, רציפה, ולפי סדר המשניות במסכת מידות.", "**חיפוש במשנה** — שורה בסוף התפריט: כותבים מילה ממסכת מידות או מהלכות בית הבחירה לרמב״ם, ורואים את המשנה או את ההלכה, המילה מסומנת בה, ומתחתיה המקומות שבמודל; לחיצה מעבירה אל המקום. הכפתור ״חפש באוצריא״ מחפש את אותן מילים בכל הספרייה.", "@מאוחד **כפתור בחיפוש של אוצריא** — כותבים מילה בשדה החיפוש של אוצריא ולוחצים על כפתור ״בית המקדש״ שבשדה: התוסף נפתח במקומות שהמילה מדברת בהם.", "**הכפתור ״פתח בתוסף בית שני״** — במסכת מידות, בהלכות בית הבחירה, ובעוד 75 ספרים: מפרשי מידות (ברטנורא, תוספות יום טוב, תפארת ישראל, מלאכת שלמה ועוד), נושאי כליו של הרמב״ם, יומא, זבחים, מנחות, תמיד, מנחת חינוך ועוד. הכפתור פותח את המקום שהשורה שלפניכם מקושרת אליו.", "**כלי צפייה** — כפתורים על המודל לפתיחת ההיכל, הלשכות והסטיו; חתך חי; מצב הליכה; מצפן; טשטוש חומות; הדפסה, ודיווח על טעות.", "@מאוחד **שני בתי המקדש בתוסף אחד** — בסרגל העליון: מעבר לבית ראשון, וחזרה למסך הבחירה; כל בית נשאר במקום שבו עזבתם."]],
    ["1.9.2", ["הכניסה בפשפש — בהליכה, בגובה העיניים: לחכמים — לתא, ומן התא להיכל; לרבי יהודה — בתוך עובי הכותל עד בין שני השערים; ובסוף נפתחות ארבע הדלתות (מידות ד, ב–ג).", "פתיחת ארבע הדלתות — בהליכה: יד הכהן מכניסה את המפתח ומסובבת אותו, ובזמן שהדלתות נפתחות העין עולה מעליהן ומביטה מלמעלה — לרבי יהודה רואים איך כל דלת נקפלת לשני לוחות. כל הדגמה מראה את השיטה שנבחרה; המתג של השיטה האחרת מראה את שלה.", "המסיבה — נדלקת בצבע צף, וחיצים נעים מראים את הדרך שבמשנה עד פתח העלייה; ויש לה הדגמה בהליכה, בכרטיס ובכפתור על המודל (מידות ד, ה).", "המפתחות של הפשפש (תמיד ג, ו) — שלוש קריאות בטבלת השיטות: הרמב״ם (ברירת המחדל) — שני מנעולים מבחוץ; מלאכת שלמה ורבינו גרשום — מבפנים, בחור עקום בעובי הכותל; הראב״ד — הפשפש כעין חלון. בתחילת הכניסה בפשפש רואים את היד פותחת.", "בית המטבחים — שלוש שיטות בטבלה: ברטנורא (ברירת המחדל) — חתיכת ארז על כל עמוד; המאירי — קורות מעמוד לעמוד; הראבי״ה והגר״א — שורה אחת. וכפתור ״האונקליות״ על המודל מסמן אותן בצבע צף.", "האולם — בלחיצה על המקום מבט מלמעלה, והתקרה נפתחת; הכפתור ״פתח את האולם״ שעל חזיתו מסיר את החזית ומעמיד את המבט מול האולם, באמצעו.", "דיווח על טעות — חובה לסמן על איזה בית הדיווח: בית ראשון, בית שני, או שני בתי המקדש.", "כל ההדגמות לאט יותר, וכל מתג, מקום או כפתור עוצרים הדגמה שרצה, ואחר כך עושים את שלהם.", "פתחים קבועים: מן התא שבקרן מזרחית צפונית להיכל (״ואחד להיכל״, מידות ד, ג), ולרבי יהודה — המעבר בעובי הכותל.", "העלייה — הבית סגור ומבט מן הצד; העלייה והלולין מסומנים בצבע צף. בכרטיס — מתג ״מלמעלה״.", "לרבי יוסי — שורה אחת של טבעות, שמונה אמות מן המזבח; הכבש ליסוד בולט יותר, ושמו עליו.", "הסיבוב חלק יותר: המבט ״מלמעלה״ נוטה מעט, כדי שגרירה תסובב סביב הדבר ולא תסחרר; וגג לשכה אינו נסגר כשהמבט בתוכה.", "טעינה וציור מהירים יותר: חלקים חוזרים (מעקות, מדרגות, רובדים) מצוירים בבת אחת."]],
    ["1.9.1", ["התאים והיציעים — ברירת המחדל כציורי הרמב״ם (מהדורת קאפח, מכתב ידו): שני כתלים וביניהם הרחקה, והיציעים מבחוץ — חמש, שש ושבע.", "צורת הבניין כציור הרמב״ם: מאה על מאה, ומעט צר במערב; כותל האולם לאורך הבית, והרובדים עליו (בית הבחירה ד, ה; ד, ט). שורה חדשה בטבלה, עם קריאת המשנה.", "ארבע הדלתות של השער הגדול — והדגמת הפתיחה לשתי השיטות, מן הסגירה עד הפתיחה: מפתח של זהב, הנגר, וקול של דלת כבדה (תמיד ג, ז–ח).", "הפשפשים — פתחים של ממש בכותל; לרבי יהודה — מעבר בתוך עובי הכותל, וההדגמה חותכת את המודל מעליו (מידות ד, ב).", "המוכני — הכיור יורד לבור בערב ועולה בבוקר (יומא ג, י; תמיד א, ד). לכל הדגמה — כפתור על המודל.", "הלשכות מרוהטות: בור ארבעים סאה בלשכת המצורעים, ערמת המלח, הדוד והאש בלשכת הנזירים, חביות היין ושבע המידות בלשכת השמנים, בור ההדחה בלשכת המדיחין.", "מידות המזבח — המספרים גדולים, על לוחית כהה, בארבעת הצדדים; ומזבח רבי יוסי קטן כולו, לא רק ראשו.", "גפן הזהב — עלים ואשכולות; שלחנות האולם גדולים יותר, ועל שלחן השיש לחם הפנים בכניסתו.", "גובה כותל המזרח — חמש שיטות מצוירות; יחזקאל אינו מקור למידות הבית (״בית שלישי״).", "תיקונים: מבטי המזבח עוקבים אחרי מקומו בכל שיטה; לשכת הגולה מלמעלה; שער בית המוקד מבפנים; המסיבה והעלייה — בחתך לפי גובה; אש חיה בבית המוקד."]],
    ["1.9.0", ["צורת התאים — שמונה שיטות בטבלת השיטות, וכל אחת מצוירת בחתך לרוחב הבית: רש״י והר״ש, ר״י בתוספות (בשלושה פירושים), ר׳ יצחק בר מרדכי, ר׳ יצחק הבחור, תוספות רי״ד והראב״ד.", "תיקון: חמישה תאים בכל קומה בצפון ובדרום, כמשנה (מידות ד, ג) — עד עכשיו צוירו חמישה עשר בכל קומה.", "המסבה ובית הורדת המים — שלוש אמות בין כותל התא לכותל החיצון, וכותלם חמש, כמשנה (מידות ד, ז)."]],
    ["1.8.2", ["שלושה עשר השערים: שמות שערי הצפון לאבא יוסי בן חנן, כתפארת ישראל וכחק נתן — שער הניצוץ הוא שער יכניה, שער הקרבן, שער הנשים הקטן בינו ובין בית המוקד, ושער בית המוקד הוא שער השיר.", "הציור על הפרוכות בשלוש קריאות: רש״י — אריה ונשר; הרמב״ם, כהבנת המשנה למלך — אותה צורה משני הצדדים; המעשי למלך — בלי צורות."]],
    ["1.8.1", ["לחיצה על כל לשכה מראה אותה מלמעלה, והגג נפתח לכמה שניות.", "הכבש ליסוד יוצא מן הכבש הגדול ויורד אל היסוד, כרש״י; הלשכות שבדרום אינן נוגעות עוד בכבש, והמסיבה לגג בית הפרוה — מעלות מגלגלות, כברטנורא.", "מידות המזבח: מספר האמות לצד כל קו, וחמש קריאות בטבלת השיטות — המשנה, רש״י, הרמב״ם, הראב״ד והמזבח של רבי יוסי.", "הדרך מן הפשפש לשער הגדול — של חכמים ושל רבי יהודה — מצוירת, ונראית גם מבפנים דרך הכתלים."]],
    ["1.8.0", ["טבלת השיטות מסודרת מחדש: שמות קצרים, כל קריאה מצוירת, ושורה אחת למערכות — בכל יום וביום הכיפורים (לרבי מאיר חמש).", "מצויר מחדש: התפוח לראב״ד — טבלה מרובעת; שלושה עשר שערים לאבא יוסי בן חנן — שער העליון ועוד שלושה קטנים; רוחב האולם בשלוש קריאות במבט מלמעלה; הציור על הפרוכות — רש״י, הרמב״ם, כרובים או בלי צורות; שני שערי בית המוקד, הפשפש וראשי הפספסין.", "תיקונים: הסורג נסגר מול שערי יוסף בן מתתיהו; שער ניקנור — נחושת הדומה לזהב; בניין הורדוס לפי הגמרא ורש״י — שורה בולטת ושורה שקועה, לבן, ירוק וכחול; ״שתי הפרוכות״ מראה את האמה שביניהן."]],
    ["1.7.1", ["מעלות האולם בשלוש קריאות מצוירות: ברטנורא (כברירת מחדל — שלוש, רובד, שתיים, רובד, ארבע), תפארת ישראל (שתיים־שתיים־שתיים־שתיים) והרמב״ם (שתים עשרה מעלות צמודות לאולם) — בטבלת השיטות.", "המפרשים על שקלים, מנחות, יומא וסוכה נשלפו מהספרייה: הכרטיסים של שלחנות האולם, שולחן לחם הפנים, ספלי הניסוך, שתי הפרוכות, הכיור, בית אבטינס, שער ניקנור, שער המים, שער הניצוץ, לשכות שער ניקנור, לשכת העץ ובית המטבחיים — עכשיו עם ברטנורא, תוספות יום טוב ותפארת ישראל, וכל מקור בסוגריים נפתח באוצריא."]],
    ["1.7.0", ["כל הכרטיסים נכתבו מחדש בלשון המשנה: לשון המשנה במירכאות, ביאור הברטנורא, הוספות התוספות יום טוב והתפארת ישראל (יכין ובועז), ואחריהם ״במודל״ — כל ציטוט אומת מול הספרייה.", "המקורות שבסוגריים — (ברטנורא מידות ב, ג), (תוספות יום טוב מידות ב, ג), (תפארת ישראל מידות ב, ג), (בועז מידות ב, א) — פותחים באוצריא את הפירוש עצמו במשנה הנכונה; וצ׳יפים לברטנורא, לתוי״ט ולתפא״י בתחתית כל כרטיס.", "גם מבטי ההיכל, העזרה, הר הבית ועזרת הנשים, ושורות השיטות שבמסכת מידות (מעלות האולם, כותל המזרח, שתים עשרה המעלות, שער טדי, שער העליון, רוחב האולם, המעקה וכליא עורב, גובה ההיכל) — עם המפרשים."]],
    ["1.6.0", ["מצב הליכה (🚶 בתיבת הניווט): העין בגובה אדם, העכבר מסובב את המבט, W S A D או החצים הולכים — Esc משחרר את העכבר.", "חתך חי: מישור חיתוך שגוררים במחוון דרך כל המודל, בציר צפון–דרום או מזרח–מערב — רואים את הפנים כמו בחתך אדריכלי."]],
    ["1.5.0", ["כל המבטים נבדקו מחדש: השערים מבחוץ וישר, הלשכות מלמעלה עם פתיחת הגג, המזבח והכבש מתוך העזרה, האולם וההיכל מבפנים; פתיחת כל קירוי מעבירה מיד למבט מלמעלה.", "הכיור נבנה מחדש (אגן, דדים ומוכני), דרומית למעלות האולם; המזבח 60.5 אמה מכותל הצפון כחשבון הרמב״ם (ה, טו) ו״רובא דמזבח בדרום״ (יומא טז:), עם קריאת רש״י 62.5 — ״כולו בדרום״ הוסר; קווי המידות 32, 30, 28, 26, 24 על גוף המזבח והמזבח הקודם 28×28 ברצפה.", "מערכת יום הכיפורים — שורה משלה בטבלה, נוספת לכל תנא (ר׳ יהודה שלוש, ר׳ יוסי ארבע, ר׳ מאיר חמש); עשן הקטורת עולה בעמוד ישר, כבית ראשון; מנורת הכסף בהירה יותר.", "כל הלשכות חלולות ומרוהטות לפי שימושן: בור הגולה והגלגל, ערמת המלח, עורות הפרוה והמקווה שעל גגה (ארבעים סאה), שולחנות המדיחין, דירת כהן גדול בלשכת העץ, בגדי הכהונה והחביתין בלשכות ניקנור, המוקד והירידה לבית הטבילה בבית המוקד; לשכות הדרום בסדר התוספות יום טוב; לשכת בית אבטינס על גבי שער המים.", "דלתות לכל השערים — זהב, ושער ניקנור נחושת שמצהיבה כזהב; תחומי החיל, העזרה, עזרת ישראל, עזרת כהנים, בין האולם ולמזבח ועזרת נשים נדלקים על הרצפה כשבוחרים אותם; המסיבה — מדרגות ומסדרון על גגות התאים עד פתח העלייה; כפתור ״פתח את האולם״.", "כרטיסים: למה שימש כל שער ומה מטרת הסורג; שתי הפרוכות ומה היה רקום עליהן; התפריט צומצם (קבוצת התיקונים הישנה הוסרה); סימון טקסט להעתקה — רק בתוך הכרטיס."]],
    ["1.4.0", ["החיל, עזרת ישראל, עזרת כהנים ו\"בין האולם ולמזבח\" — כיתוב ומקום בלוח; הדוכן (מעלות הלויים) ומעלות האולם לכל רוחב העזרה (תפארת ישראל).", "שלושים ושמונה התאים חלולים, בשלוש קומות, עם הפתחים זה לזה ולזה שמעליו (מידות ד, ג); המסיבה מן הקרן המזרחית־צפונית לגג התאים, וכפתור ״פתח את המסיבה״; העלייה עם פתחה לדרום, שני כלונסות הארז, הלולין וראשי הפספסין (ד, ה).", "פיתוחי הקירות — ״כרובים דצורתא״ (יומא נד.): כרובים, תמורות ופטורי ציצים של זהב על קירות הקודש וקודש הקדשים, כבתוסף בית ראשון.", "המזבח: ספלי הניסוך והשיתין לפי רש״י ולפי תוספות (סוכה מח:); מתג ״מקום המערכה כ״ח על כ״ח״; המערכות לפי כל הדעות — רבי יהודה שתיים, רבי יוסי שלוש, רבי מאיר ארבע — ובחירת מצב יום הכיפורים.", "בית המוקד חלול: ארבע לשכותיו, הרובדין וטבלת השיש עם הטבעת (מידות א, ו–ט); לשכת העץ (פרהדרין) מאחורי הגולה והגזית; לשכות פנחס המלביש ועושי חביתין בשער ניקנור; עליית שער הניצוץ; מסיבה לגג בית הפרוה; שלושה משמרות כהנים ועשרים ואחד לויים (מתג).", "מתגים: בניין הורדוס — אבני שיש בשלושה גוונים ״כגלי הים״ (בבא בתרא ד.); גובה מאה ועשרים אמה (אברבנאל); המעקה וכליא עורב — רבי יהודה או תנא קמא. הסורג נפתח כנגד השערים."]],
    ["1.3.0", ["שערי העזרה בחלק המערבי של החומות (רמב״ם בית הבחירה ה, ד), ובית המוקד עצמו הוא השער השלישי של הצפון (מידות א, ה).", "המנורה, שולחן לחם הפנים ומזבח הזהב — המודלים של בית ראשון, אחד מכל אחד, במקומם לפי הרמב״ם ויומא לג:; אבן שלוש המעלות לפני המנורה.", "שיטות חדשות, כולן מצוירות: מקום המזבח (צפון, דרום, אמצע), חומר המנורה והשולחן (ברזל ובעץ, כסף, זהב), רוחב האולם (המשנה או הרמב״ם), גובה כותל המזרח, מקום שתים עשרה המעלות, שערי עזרת נשים (חז״ל או יוסף בן מתתיהו).", "אבן השתייה במערב קודש הקדשים (רמב״ם ד, א).", "הכבשים הקטנים יוצאים מן הכבש הגדול, והכבש ליסוד באלכסון (תוספות יום טוב; תפארת ישראל).", "חלונות ההיכל שקופים אטומים, כמו בבית ראשון; כותלי עזרת נשים גבוהים ככותלי העזרה חוץ מן המזרחי (מידות ב, ד); הזהב בגוון של בית ראשון."]],
    ["1.2.0", ["הלוח נבנה מחדש כמו בבית ראשון: עץ אחד של מקומות עם שורת חיפוש למעלה, וקבוצות מכווצות.", "כרטיס ההסבר בצד שמאל, עם צ׳יפים לשיטות ולמקורות; המקורות נפתחים באוצריא.", "בקר ניווט על המודל: מצפן, סיבוב במקום בתוך הבית, הליכה במקלדת.", "כפתורים על המודל: ״פתח את ההיכל״, ״פתח את הלשכות״, ״פתח את הסטיו״, ״↺ החזר הכל״.", "סרגל עליון: מצגת, ניווט, הדפסה, דיווח, מה חדש.", "המצגת בשלושה מצבים — לפי הנושאים, רציפה, ולפי סדר המשניות במסכת מידות.", "כפתור ״פתח בתוסף בית שני״ במסכת מידות וברמב״ם הלכות בית הבחירה.", "טבלת ״שיטות ומחלוקות״ עם כל הדעות; כל דעה גם כצ׳יפ על הכרטיס של נושאה."]],
    ["1.1.0", ["השם ״בית שני״; טעינה מהירה בהרבה (הציור מתחיל רק אחרי שהכול מוכן).", "הליכה במקלדת: חצים למעלה ולמטה מתקדמים, PageUp/PageDown מגביהים, Shift עם חץ מטה את המבט.", "כפתור ״ניווט״ עם כל הוראות העכבר, המגע והמקלדת.", "המקורות נפתחים באוצריא גם ברמב״ם (בית הבחירה, תמידין ומוספין), במשנה תמיד ובגמרא (יומא, זבחים, סוכה ועוד) — לא רק במסכת מידות.", "מצגת גם לפי סדר המשניות במסכת מידות.", "תיקונים לפי המשנה והרמב״ם — ראו בקבוצה ״תיקונים לפי המשנה״ בלוח."]]
  ];
  var ui_CSS = `
/* 1.1.0: #tm-burger and the bar's buttons (.tm-topbtn) are styled by index.html (header.topbar); nothing here */
html,body{overscroll-behavior:none}
.tm-src{font-size:.74em;opacity:.8;font-weight:400}
.tm-src a.tm-srcl{color:inherit;text-decoration:none;cursor:pointer}
.tm-src a.tm-srcl:hover{text-decoration:underline}
#tm-panel{position:fixed;top:calc(var(--topbar-h, 56px) + 9px);right:12px;z-index:30;width:218px;max-height:calc(100vh - var(--topbar-h, 56px) - 25px);overflow-y:auto;
  direction:rtl;text-align:right;background:rgba(12,16,24,.82);border:1px solid rgba(201,168,76,.45);
  border-radius:12px;backdrop-filter:blur(8px);color:#e8dcae;
  font:13px 'Segoe UI',Arial,sans-serif;padding:12px 14px;box-sizing:border-box}
#tm-panel .t{font-size:17px;font-weight:600;color:#f3dc9a}
#tm-panel .s{font-size:11px;color:#b9ac82;margin-bottom:8px}
#tm-panel .sec{font-size:12px;font-weight:600;color:#c9a84c;margin:10px 0 5px;
  border-bottom:1px solid rgba(201,168,76,.25);padding-bottom:2px}
#tm-views{display:grid;grid-template-columns:1fr 1fr;gap:5px}
#tm-pl-sec{margin-top:8px}
details.tm-pl{margin-top:6px;border-top:1px solid rgba(201,168,76,.2);padding-top:4px}
details.tm-pl summary{cursor:pointer;font-size:12px;font-weight:600;color:#c9a84c;padding:3px 0}
details.tm-pl>div{display:grid;grid-template-columns:1fr 1fr;gap:5px;margin:5px 0}
details.tm-ops-det>div,details.tm-ops-det>div div{display:block;grid-template-columns:none}
details.tm-ops-det>.s{margin:4px 0 2px}
details.tm-pl button,#tm-views button,#tm-panel .tm-opt button{background:rgba(201,168,76,.10);border:1px solid rgba(201,168,76,.32);color:#e8dcae;
  border-radius:6px;padding:5px 3px;font:12px 'Segoe UI',Arial,sans-serif;cursor:pointer;position:relative}
details.tm-pl .tm-cnt{position:absolute;left:3px;top:-7px;min-width:17px;height:16px;padding:0 4px;box-sizing:border-box;border-radius:8px;background:#c9a84c;color:#14110a;font:600 10px/16px 'Segoe UI',Arial,sans-serif;direction:ltr;text-align:center;pointer-events:none}
#tm-views button:hover,details.tm-pl button:hover,#tm-panel .tm-opt button:hover{background:rgba(201,168,76,.28)}
#tm-views.one{grid-template-columns:1fr;margin-bottom:2px}
#tm-views.one button{font-weight:700}
#tm-views button.on,details.tm-pl button.on,#tm-panel .tm-opt button.on{background:rgba(201,168,76,.42);color:#fff2c8;border-color:rgba(201,168,76,.7)}
#tm-panel .tm-opt{margin:7px 0 4px}
#tm-panel .tm-opt .cap{display:block;font-size:11px;color:#b9ac82;margin-bottom:3px}
#tm-panel .tm-opt .bb{display:grid;grid-template-columns:1fr 1fr;gap:5px}
#tm-panel .tm-opt button{font-size:11.5px;padding:4px 3px}
#tm-ops{margin-top:4px;border:1px solid rgba(201,168,76,.3);border-radius:8px;padding:4px 7px 2px;background:rgba(201,168,76,.05)}
#tm-ops .tm-op{padding:5px 0 6px;border-bottom:1px dashed rgba(201,168,76,.22)}
#tm-ops .tm-op:last-child{border-bottom:0}
#tm-ops .tm-op .cap{display:block;font-size:11.5px;font-weight:600;color:#e8dcae;margin-bottom:2px}
#tm-ops .tm-op .src{display:block;font-size:10px;color:#b9ac82;margin-bottom:4px;line-height:1.5}
#tm-ops .tm-op .src a,#tm-panel .tm-src a{color:#f3dc9a;text-decoration:none;border-bottom:1px dotted rgba(243,220,154,.6);margin-left:5px;cursor:pointer}
#tm-ops .tm-op .src a:hover,#tm-panel .tm-src a:hover{color:#fff2c8}
#tm-ops .tm-op .bb{display:grid;grid-template-columns:1fr 1fr;gap:4px}
#tm-ops .tm-op .bb.c3{grid-template-columns:1fr 1fr 1fr}
#tm-ops .tm-op button{background:rgba(201,168,76,.10);border:1px solid rgba(201,168,76,.32);color:#e8dcae;border-radius:6px;padding:4px 3px;font:11px 'Segoe UI',Arial,sans-serif;cursor:pointer;line-height:1.3}
#tm-ops .tm-op button:hover{background:rgba(201,168,76,.28)}
#tm-ops .tm-op button.on{background:rgba(201,168,76,.42);color:#fff2c8;border-color:rgba(201,168,76,.7)}
#tm-ops .tm-op button:disabled{opacity:.45;cursor:default}
#tm-ops details.tm-opg{border-bottom:1px solid rgba(201,168,76,.2)}
#tm-ops details.tm-opg:last-child{border-bottom:0}
#tm-ops details.tm-opg>summary{cursor:pointer;font-size:12px;font-weight:600;color:#e8dcae;padding:6px 0 5px}
#tm-ops details.tm-opg>summary:hover{color:#fff2c8}
#tm-ops details.tm-opg[open]>summary{color:#f3dc9a}
#tm-ops details.tm-opg>summary .n{font-weight:400;font-size:10.5px;color:#b9ac82;margin-right:5px}
#tm-ops .tm-opg-b{margin:0 4px 7px 0;padding-right:8px;border-right:2px solid rgba(201,168,76,.28)}
#tm-panel label.row{display:flex;align-items:center;gap:7px;margin:5px 0;cursor:pointer;user-select:none;flex-wrap:wrap}
#tm-panel label.row input{accent-color:#c9a84c;margin:0}
#tm-panel label.row input:disabled+span{color:#7d7560}
#tm-panel label.row .tm-src{font-size:10px;color:#b9ac82;flex-basis:100%;margin-right:19px;line-height:1.4}
#tm-units{margin-top:8px;font-size:10.5px;line-height:1.5;color:#b9ad84}
#tm-foot{margin-top:8px;font-size:10px;color:#9a8f6c;text-align:center}
#tm-nav{position:fixed;bottom:14px;left:78px;z-index:30;display:flex;gap:4px;align-items:center;flex-wrap:wrap;max-width:calc(100vw - 96px);direction:ltr}
#tm-nav button{width:26px;height:26px;padding:0;border-radius:50%;border:1px solid rgba(201,168,76,.45);background:rgba(12,16,24,.75);color:#e8dcae;font-size:14px;line-height:1;cursor:pointer;backdrop-filter:blur(6px);touch-action:none;user-select:none;-webkit-user-select:none}
#tm-nav button:hover{background:rgba(201,168,76,.28)}
#tm-nav button.on{background:rgba(201,168,76,.55);color:#14110a}
#tm-nav .sp{width:5px}
#tm-nav button.tm-txt{width:auto;padding:0 9px;border-radius:13px;font:11.5px 'Segoe UI',Arial,sans-serif;direction:rtl;white-space:nowrap}
#tm-nav .tm-grp{display:flex;align-items:center;gap:3px;height:26px;padding:0 3px 0 6px;border:1px solid rgba(201,168,76,.45);border-radius:13px;background:rgba(12,16,24,.75);backdrop-filter:blur(6px);direction:rtl;color:#e8dcae;font:11.5px 'Segoe UI',Arial,sans-serif;white-space:nowrap}
#tm-nav .tm-grp button{width:20px;height:20px;font-size:13px;border-color:rgba(201,168,76,.35)}
#tm-nav .tm-grp .v{min-width:44px;text-align:center;color:#f3dc9a}
#tm-nav .tm-range{width:86px;height:14px;accent-color:#c9a84c;margin:0 4px;vertical-align:middle}
#tm-nav .tm-sec button.tm-txt{width:auto;padding:0 7px;height:20px;font-size:11px}
#tm-nav button#tm-nav-walk.on{background:rgba(201,168,76,.55);color:#1b2030}
#tm-nav .tm-grp.off{opacity:.55}
#tm-nav #tm-reset-all{display:none;background:rgba(201,168,76,.42);color:#fff2c8;border-color:rgba(201,168,76,.8)}
#tm-nav #tm-reset-all:hover{background:rgba(201,168,76,.6)}
.tm-pill{position:fixed;z-index:28;display:none;left:0;top:0;transform:translate(-50%,-50%);padding:4px 11px;border-radius:14px;border:1px solid rgba(201,168,76,.6);background:rgba(12,16,24,.84);color:#f3dc9a;font:12px 'Segoe UI',Arial,sans-serif;cursor:pointer;white-space:nowrap;direction:rtl;box-shadow:0 2px 8px rgba(0,0,0,.35);user-select:none;-webkit-user-select:none}
.tm-pill:hover{background:rgba(201,168,76,.35)}
.tm-pill.on{background:rgba(201,168,76,.62);color:#14110a;border-color:rgba(255,236,170,.85)}
#tm-tip{position:fixed;z-index:120;display:none;max-width:280px;padding:6px 10px;border-radius:8px;border:1px solid rgba(201,168,76,.6);background:rgba(12,16,24,.95);color:#efe3b8;font:12px/1.5 'Segoe UI',Arial,sans-serif;direction:rtl;text-align:right;pointer-events:none;box-shadow:0 4px 14px rgba(0,0,0,.45);white-space:normal}
#tm-measure-out{position:fixed;bottom:52px;left:50%;transform:translateX(-50%);z-index:31;background:rgba(12,16,24,.9);border:1px solid rgba(201,168,76,.5);color:#f3dc9a;padding:6px 12px;border-radius:8px;font-size:12px;display:none;direction:rtl;text-align:center;pointer-events:none;max-width:92vw}
body.tm-measuring canvas{cursor:crosshair}
#tm-confirm{position:fixed;inset:0;z-index:100;background:rgba(0,0,0,.55);display:none;align-items:center;justify-content:center;direction:rtl}
#tm-confirm .box{background:#1b2030;border:1px solid rgba(201,168,76,.6);border-radius:10px;padding:16px 18px;max-width:340px;color:#e8dcae;text-align:center;line-height:1.6}
#tm-confirm .t{font-weight:700;color:#f3dc9a;margin-bottom:6px}
#tm-confirm .b{display:flex;gap:8px;justify-content:center;margin-top:12px}
#tm-confirm button{padding:6px 14px;border-radius:8px;border:1px solid rgba(201,168,76,.55);background:rgba(201,168,76,.18);color:#f3dc9a;cursor:pointer;font-size:13px}
#tm-confirm button.y{background:rgba(201,168,76,.5);color:#14110a}
#tm-compass{position:fixed;bottom:10px;left:12px;z-index:30;width:58px;height:58px;border-radius:50%;box-sizing:border-box;transform:scale(1.25);transform-origin:0 100%;
  background:rgba(12,16,24,.75);border:1px solid rgba(201,168,76,.45);backdrop-filter:blur(6px);user-select:none;-webkit-user-select:none}
#tm-rotor{position:absolute;left:0;top:0;width:56px;height:56px;will-change:transform;pointer-events:none}
#tm-rotor .a{position:absolute;left:28px;top:28px;transform:translate(-50%,-62%);color:#e2544a;font-size:13px;line-height:1}
#tm-rotor .d{position:absolute;width:19px;height:19px;margin:-9.5px 0 0 -9.5px;border-radius:50%;display:flex;align-items:center;justify-content:center;
  font:600 10px 'Segoe UI',Arial,sans-serif;color:#e8dcae;cursor:pointer;pointer-events:auto;line-height:1}
#tm-rotor .d:hover{background:rgba(201,168,76,.4);color:#fff2c8}
#tm-rotor .d.n{color:#ff8a7e}
#tm-card{position:fixed;z-index:29;display:none;flex-direction:column;left:0;top:0;width:min(320px,86vw);max-height:46vh;overflow:hidden;box-sizing:border-box;padding:7px 10px 8px;border-radius:10px;border:1px solid rgba(201,168,76,.65);background:rgba(12,16,24,.94);color:#e8dcae;font:12px/1.55 'Segoe UI',Arial,sans-serif;direction:rtl;text-align:right;box-shadow:0 4px 16px rgba(0,0,0,.5);backdrop-filter:blur(6px)}
#tm-card .h{flex:none;display:flex;align-items:flex-start;gap:6px;margin-bottom:4px}
#tm-card .tt{flex:1;font-weight:700;color:#f3dc9a;font-size:12.5px}
#tm-card .x{flex:none;width:20px;height:20px;padding:0;border-radius:50%;border:1px solid rgba(201,168,76,.45);background:rgba(201,168,76,.12);color:#e8dcae;font-size:11px;line-height:1;cursor:pointer}
#tm-card .x:hover{background:rgba(201,168,76,.35)}
#tm-card .b{flex:1 1 auto;min-height:0;overflow-y:auto;white-space:normal;padding-left:4px}
#tm-card .r{flex:none;margin-top:5px;padding-top:4px;border-top:1px solid rgba(201,168,76,.25);font-size:11px}
#tm-card .r a{display:inline-block;color:#f3dc9a;margin:2px 0 2px 5px;padding:2px 7px;border:1px solid rgba(201,168,76,.45);border-radius:6px;background:rgba(201,168,76,.12);text-decoration:none;cursor:pointer}
#tm-card .r a:hover{background:rgba(201,168,76,.3)}
#tm-panel .tm-src.row-src{display:block;font-size:10px;color:#b9ac82;margin:-3px 19px 6px 0;line-height:1.4;cursor:default}
#tm-xcard{position:fixed;z-index:29;display:none;flex-direction:column;top:calc(var(--topbar-h, 56px) + 9px);right:242px;width:min(320px,86vw);max-height:calc(100vh - var(--topbar-h, 56px) - 93px);overflow:hidden;box-sizing:border-box;padding:8px 11px 9px;border-radius:10px;border:1px solid rgba(201,168,76,.65);background:rgba(12,16,24,.94);color:#e8dcae;font:12.5px/1.6 'Segoe UI',Arial,sans-serif;direction:rtl;text-align:right;box-shadow:0 4px 16px rgba(0,0,0,.5);backdrop-filter:blur(6px)}
#tm-xcard .h{flex:none;display:flex;align-items:flex-start;gap:6px;margin-bottom:4px}
#tm-xcard .tt{flex:1;font-weight:700;color:#f3dc9a;font-size:13px;line-height:1.4}
#tm-xcard .x{flex:none;width:22px;height:22px;padding:0;border-radius:50%;border:1px solid rgba(201,168,76,.45);background:rgba(201,168,76,.12);color:#e8dcae;font-size:12px;line-height:1;cursor:pointer}
#tm-xcard .x:hover{background:rgba(201,168,76,.35)}
#tm-search-wrap{position:sticky;top:0;z-index:2;margin:0 0 6px;padding:2px 0 4px;background:inherit}
#tm-search{width:100%;box-sizing:border-box;height:28px;padding:0 8px;border-radius:8px;border:1px solid rgba(201,168,76,.55);background:rgba(12,16,24,.9);color:#f3dc9a;font:13px 'Segoe UI',Arial,sans-serif;direction:rtl;outline:none}
#tm-search:focus{border-color:#f3dc9a;box-shadow:0 0 0 1px rgba(243,220,154,.4)}
#tm-search-none{display:none;padding:6px 2px;font-size:12px;color:#d9cfa8}
#tm-xcard.min .b,#tm-xcard.min .r{display:none}
#tm-xcard.min .h{margin-bottom:0}
#tm-xcard.min .tt{cursor:pointer}
#tm-xcard .b{flex:1 1 auto;min-height:0;overflow-y:auto;white-space:normal;padding-left:4px;color:#ddd2a8;overscroll-behavior:contain}
#tm-xcard .r{flex:none;margin-top:6px;padding-top:5px;border-top:1px solid rgba(201,168,76,.25);font-size:11px;max-height:120px;overflow-y:auto}
#tm-xcard .r a{display:inline-block;color:#f3dc9a;margin:2px 0 2px 5px;padding:3px 8px;border:1px solid rgba(201,168,76,.45);border-radius:6px;background:rgba(201,168,76,.12);text-decoration:none;cursor:pointer}
#tm-xcard .r a:hover{background:rgba(201,168,76,.3)}
#tm-xcard .r a{white-space:normal;max-width:100%;line-height:1.35}
#tm-panel,#tm-topbar,#tm-nav,.tm-pill,#tm-xcard .h,#tm-xcard .r,#tm-help,#tm-news .x{user-select:none;-webkit-user-select:none}
#tm-xcard .b{user-select:text;-webkit-user-select:text}
#tm-panel,#tm-topbar,#tm-nav,.tm-pill,#tm-xcard .h,#tm-xcard .r,#tm-help,#tm-news .x{user-select:none;-webkit-user-select:none}
#tm-xcard .b{user-select:text;-webkit-user-select:text}
#tm-xcard .b{white-space:pre-line}
#tm-xcard .b,#tm-card .b{line-height:1.5}
#tm-xcard .b .p,#tm-card .b .p{display:block;margin-top:3px}
#tm-xcard .tm-more,#tm-card .tm-more{display:block;width:100%;box-sizing:border-box;text-align:center;margin:8px 0 6px;background:rgba(201,168,76,.26);border:1px solid rgba(201,168,76,.65);color:#f3dc9a;border-radius:6px;padding:5px 12px;cursor:pointer;font-size:12px;font-weight:700;font-family:inherit}
#tm-xcard .tm-more:hover,#tm-card .tm-more:hover{background:rgba(201,168,76,.3)}
#tm-xcard .b .p:first-child,#tm-card .b .p:first-child{margin-top:0}
#tm-xcard .b b,#tm-card .b b{font-weight:700;color:#f3dc9a}
#tm-xcard .o,#tm-card .o{flex:none;max-height:40vh;overflow-y:auto;overscroll-behavior:contain;margin-top:5px;padding-top:4px;border-top:1px solid rgba(201,168,76,.25);font-size:11px;line-height:1.5;color:#b9ac82}
#tm-xcard.min .o{display:none}
#tm-card .o{max-height:20vh}
#tm-xcard .o .g,#tm-card .o .g{display:block}
#tm-xcard .o .k,#tm-card .o .k{margin-left:3px}
#tm-xcard .o a,#tm-card .o a{display:inline-block;color:#f3dc9a;margin:2px 0 2px 5px;padding:2px 7px;border:1px solid rgba(201,168,76,.45);border-radius:6px;background:rgba(201,168,76,.12);text-decoration:none;cursor:pointer}
#tm-xcard .o a:hover,#tm-card .o a:hover{background:rgba(201,168,76,.3)}
#tm-xcard .o a.on,#tm-card .o a.on{background:rgba(201,168,76,.5);color:#14110a;border-color:rgba(255,236,170,.85);cursor:default}
#tm-news li.v{list-style:none;font-weight:700;color:#f3dc9a;margin:7px 0 2px}
#tm-report,#tm-printdlg,#tm-news,#tm-help{position:fixed;inset:0;z-index:100;background:rgba(0,0,0,.5);display:none;align-items:center;justify-content:center;direction:rtl}
#tm-printdlg .box,#tm-news .box,#tm-help .box{background:#1b2030;border:1px solid rgba(201,168,76,.6);border-radius:10px;padding:12px 14px;width:min(320px,90vw);box-sizing:border-box;color:#e8dcae;font:12.5px/1.5 'Segoe UI',Arial,sans-serif;text-align:right}
#tm-printdlg .t,#tm-news .t,#tm-help .t{font-weight:700;color:#f3dc9a;margin-bottom:6px;font-size:13.5px}
#tm-printdlg .b,#tm-news .b,#tm-help .b{display:flex;gap:8px;margin-top:10px}
#tm-printdlg .b button,#tm-news .b button,#tm-help .b button{flex:1;padding:5px 6px;border-radius:7px;border:1px solid rgba(201,168,76,.45);background:rgba(201,168,76,.12);color:#e8dcae;cursor:pointer;font:12px 'Segoe UI',Arial,sans-serif}
#tm-printdlg .b button.y,#tm-news .b button.y,#tm-help .b button.y{background:rgba(201,168,76,.5);color:#14110a}
#tm-printdlg .b button:disabled{opacity:.5;cursor:default}
#tm-news,#tm-help{background:rgba(0,0,0,.35)}
#tm-news .box,#tm-help .box{width:min(340px,90vw);max-height:calc(100vh - var(--topbar-h, 56px) - 40px);overflow-y:auto}
#tm-help .box{width:min(400px,92vw)}
#tm-news .box{width:min(560px,92vw);display:flex;flex-direction:column;overflow:hidden;font-size:13px;line-height:1.55}
#tm-news .box:focus{outline:none}
#tm-news ul{flex:1 1 auto;min-height:0;overflow-y:auto;overscroll-behavior:contain}
#tm-news .t{flex:none;display:flex;align-items:center;justify-content:space-between;gap:8px}
#tm-news .t .x{cursor:pointer;border:1px solid rgba(201,168,76,.45);background:rgba(201,168,76,.12);color:#e8dcae;border-radius:6px;padding:0 8px;font:inherit;line-height:1.5}
#tm-news .b{flex:none}
#tm-foot-news{margin-top:4px;font-size:10px;color:#c9b77a;text-align:center;cursor:pointer;text-decoration:underline}
@media (max-height:700px){#tm-xcard .o,#tm-card .o{max-height:24vh}#tm-xcard .r{max-height:70px}}
#tm-help h4{margin:9px 0 3px;font-size:12.5px;color:#f3dc9a}
#tm-help h4:first-of-type{margin-top:2px}
#tm-help ul{margin:0;padding:0 16px 0 0;list-style:disc}
#tm-help li{margin:2px 0}
#tm-help kbd{font:11px Consolas,'Segoe UI',monospace;background:rgba(255,255,255,.08);border:1px solid rgba(201,168,76,.35);border-radius:4px;padding:0 4px}
#tm-news ul{margin:2px 0 0;padding:0 16px 0 0;list-style:disc}
#tm-news li{margin:3px 0}
#tm-news li b{color:#f3dc9a;font-weight:700}
#tm-news li.big{list-style:none;font-size:1.22em;line-height:1.45;margin:4px 0 12px;padding:9px 12px;border:2px solid #e0b84f;border-radius:8px;background:rgba(224,184,79,.14);color:#fff}
#tm-news li.big b{font-size:1.08em;color:#ffd77a}
#tm-print{display:none}
@media print{
  @page{size:A4 landscape;margin:10mm}
  html,body{background:#fff !important;color:#000 !important;width:auto !important;height:auto !important;overflow:visible !important}
  body>*:not(#tm-print){display:none !important}
  #tm-print{display:block !important;direction:rtl;text-align:right;color:#000;font:11pt/1.5 'Segoe UI',Arial,sans-serif}
  #tm-print h1{font-size:15pt;font-weight:700;margin:0 0 3mm}
  #tm-print img{display:block;max-width:100%;max-height:150mm;margin:0 auto 4mm;object-fit:contain}
  #tm-print .tt{font-size:12pt;font-weight:700;margin:0 0 1mm}
  #tm-print .tx{white-space:pre-line}
  #tm-print .tx .p{display:block;margin-top:1.4mm}
  #tm-print .tx .p:first-child{margin-top:0}
  #tm-print .tm-src{font-size:.8em;opacity:1}
  #tm-print .cr{font-size:9pt;color:#555;margin:1mm 0 0}
  #tm-print .pg2{break-before:page;page-break-before:always}
  #tm-print .rs a{color:#000}
  #tm-print .rs{margin-top:2mm;font-size:9.5pt;color:#333}
}
#tm-report .box{background:#1b2030;border:1px solid rgba(201,168,76,.6);border-radius:10px;padding:12px 14px;width:min(340px,90vw);box-sizing:border-box;color:#e8dcae;font:12.5px/1.5 'Segoe UI',Arial,sans-serif;text-align:right}
#tm-report .t{font-weight:700;color:#f3dc9a;margin-bottom:6px;font-size:13.5px}
#tm-report .ty{display:flex;gap:5px;margin-bottom:7px}
#tm-report .ty button,#tm-report .b button{flex:1;padding:5px 6px;border-radius:7px;border:1px solid rgba(201,168,76,.45);background:rgba(201,168,76,.12);color:#e8dcae;cursor:pointer;font:12px 'Segoe UI',Arial,sans-serif}
#tm-report .ty button.on{background:rgba(201,168,76,.45);color:#fff2c8;border-color:rgba(201,168,76,.8)}
#tm-report textarea{width:100%;box-sizing:border-box;height:110px;resize:vertical;padding:6px 8px;border-radius:7px;border:1px solid rgba(201,168,76,.5);background:rgba(12,16,24,.9);color:#f3dc9a;font:12.5px/1.5 'Segoe UI',Arial,sans-serif;direction:rtl;outline:none}
#tm-report textarea:focus{border-color:#f3dc9a}
#tm-report .n{font-size:10.5px;color:#9a8f6c;margin:4px 0 0}
#tm-report .b{display:flex;gap:8px;margin-top:9px}
#tm-report .b button.y{background:rgba(201,168,76,.5);color:#14110a}
#tm-report .b button:disabled{opacity:.5;cursor:default}
#tm-panel,#tm-card .b,#tm-xcard .b,#tm-xcard .r,#tm-tour-box .body,#tm-tour-box .bub{scrollbar-width:thin;scrollbar-color:rgba(201,168,76,.5) transparent}
@media(max-width:${ui_PHONE_MAX}px){#tm-nav .tm-grp .cap{display:none}
  #tm-xcard{left:8px;right:8px;top:auto;bottom:76px;width:auto;max-height:min(42vh,calc(50vh - 60px))}
  #tm-xcard .r{max-height:66px}
  #tm-panel{max-height:calc(100vh - 132px)}}
`;
  async function buildUI(ctx) {
    try {
      const uiGroup = new Group();
      uiGroup.name = "ui";
      if (ctx.root && ctx.root.add) ctx.root.add(uiGroup);
      if (!Array.isArray(ctx.animated)) ctx.animated = [];
      if (!ctx.shared) ctx.shared = {};
      if (!ctx.layers) ctx.layers = {};
      // fallback = the 10-core.js CO values (used only if ctx.CO is missing): 1.0.1-L the Sea in the court's CORNER x 80, z -54 (Rashi) /
      // +54 (L.7), the block of bases round x 30 in the rows z 33 / 45 with Moses' laver between them at z 39 (L.77; vessels-2.md), the house wall 7 / 6 / 5 / 4 (K.2)
      ctx.shared.refIndex = refIndex;   // Beit Sheni: for the checks (tools/dump) and other modules
      const CO = ctx.CO || { seaX: 80, seaZ: 54, seaZRashi: -54, kiyorX: 30, mechX: 30, mechZ: [33, 45], xUlamE: 18.5, xHouseE: 2.5, HOUSE_WALL: [7, 6, 5, 4], zHouseS: 27, xHeiW: -80.5 };
      const LVL = ctx.LV || { HAR: 0, AZ: 6, HEI: 12 };
      // 1.0.1-L: the one phone rule (ui_PHONE_MAX; the CSS media rule is built from the same number)
      const isPhone = (w) => (w == null ? window.innerWidth || 0 : w) <= ui_PHONE_MAX;
      // The four hide-lists (FIXES-1.0.1-K.md 0.5a), all CLOSED by default and opened ONLY by their on-model buttons (1.0.1-K: no view,
      // place, table row, label or presentation call opens them): ctx.cutaway (the house: its south wall, roof and the interior pieces on
      // that side), ctx.yatziaCut (the chambers' outer walls, all three sides), ctx.ulamCut (the ulam's front wall and roof),
      // ctx.forestBoardsCut (60-palace.js: the boards of the roofing of בית יער הלבנון, to show the beams). Any list may be missing.
      let cutOn = false;
      let sectionOn = false;   // 1.2.2: the section along the length (ctx.sectionCut: the house's south wall and windows off, the ceilings kept)
      let yatziaOpen = false, ulamOpen = false;
      let boardsOff = false;
      const layerRows = {};
      const cutList = (a) => Array.isArray(a) ? a : [];
      // one pass sets the visibility of every object of the four "hide" lists, so an object listed in two of them stays hidden while
      // either switch is on and comes back only when both are off
      const applyHidden = function() {
        const hide = new Set();
        if (cutOn) for (const m of cutList(ctx.cutaway)) hide.add(m);
        // 1.2.3 (the user: "ממזרח"): the section is seen from the east - the house's east wall with what hangs on it (ctx.sectionCut), the
        // ulam's front, ceilings and roof (ctx.ulamCut) and Yachin and Boaz (the group; they stand east of the cut)
        if (sectionOn) {
          for (const m of cutList(ctx.sectionCut)) hide.add(m);
          for (const m of cutList(ctx.ulamCut)) hide.add(m);
        }
        if (yatziaOpen) for (const m of cutList(ctx.yatziaCut)) hide.add(m);
        if (ulamOpen) for (const m of cutList(ctx.ulamCut)) hide.add(m);
        if (boardsOff) for (const m of cutList(ctx.forestBoardsCut)) hide.add(m);
        // 1.2.4: with the aliyot layer on, the house's ceiling pieces over the devir and the devir's gold room go - the first aliyah stands there
        if (ctx.layers && ctx.layers.aliyot && ctx.layers.aliyot.visible) for (const m of cutList(ctx.aliyotHide)) hide.add(m);
        for (const list of [ctx.cutaway, ctx.sectionCut, ctx.yatziaCut, ctx.ulamCut, ctx.forestBoardsCut, ctx.aliyotHide]) {
          for (const m of cutList(list)) if (m) m.visible = !hide.has(m);
        }
        try { const yb = ctx.root.getObjectByName("yachinBoaz"); if (yb) yb.visible = !sectionOn; } catch (_) {}
        for (const m of cutList(ctx.interiorOnly)) {
          if (m) m.visible = cutOn;
        }
      };
      // (the on-model pills read the state through get() every frame, so nothing else has to be kept in sync)
      const setCutaway = function(on) {
        cutOn = !!on;
        applyHidden();
      };
      const setSection = function(on) {   // 1.2.2
        sectionOn = !!on;
        applyHidden();
      };
      const setYatziaCut = function(on) {
        yatziaOpen = !!on;
        applyHidden();
      };
      const setUlamCut = function(on) {
        ulamOpen = !!on;
        applyHidden();
      };
      const setBoardsOff = function(on) {
        boardsOff = !!on;
        applyHidden();
        // 1.0.1-L (K review follow-up): the labels that name the boards go with them (60-palace.js's layer group; its per-frame hook keeps it in step whoever hides them)
        if (ctx.layers && ctx.layers.forestBoards) ctx.layers.forestBoards.visible = !boardsOff;
      };
      // Optional layers (ctx.layers.aliyot / ulamRambam / palace): Groups built by the other modules with visible=false.
      const layerMarks = {};   // 1.0.1-H: layers that are chosen in the opinions table (aliyot, ulamRambam) mark their row there
      const setLayer = function(name, on) {
        const g = ctx.layers && ctx.layers[name];
        if (g) g.visible = !!on;
        if (name === "aliyot") { try { applyHidden(); } catch (_) {} }   // 1.2.4: ctx.aliyotHide follows the layer
        const row = layerRows[name];
        if (row) row.checked = !!on;
        if (typeof layerMarks[name] === "function") {
          try {
            layerMarks[name](!!on);
          } catch (_) {
          }
        }
        return !!g;
      };
      // ===== labels =====
      const labelGroup = new Group();
      labelGroup.name = "labels";
      // the engine's sprite maker (makeLabelSprite2 in 90-entry.js) when it is in scope; ui_makeLabelSprite is the fallback copy
      const mkLabel = typeof makeLabelSprite2 === "function" ? makeLabelSprite2 : ui_makeLabelSprite;
      for (const l of Array.isArray(ctx.labels) ? ctx.labels : []) {
        try {
          if (!l || !l.text) continue;
          const spr = mkLabel(String(l.text), l.size, l);   // 1.9.1: a label may ask for a plate (l.box) and to be drawn on top (l.onTop)
          spr.position.set(l.x || 0, l.y || 0, l.z || 0);
          // CONTRACT (no position heuristic): a label that belongs to an optional layer carries an explicit
          // {layer: "aliyot" | "ulamRambam" | "palace"} = the key of its ctx.layers group, and is shown only while that layer is
          // on. 50-heichal.js pushes its layer labels here (with the layer field); 60-palace.js still builds its labels as sprites
          // inside its own layer group (with its own scaling loop) and pushes to ctx.labels only as a fallback, so the "תוויות"
          // toggle does not reach them. Every other label - e.g. 20-mount's "השער הדרומי" at z 341.5,
          // or a future high label - is an ordinary label and stays visible.
          // 1.0.1-H: a label may belong to SEVERAL layers at once (`layers: ["palace", "forestRashi"]`, 60-palace.js: the labels of a
          // reading of בית יער הלבנון) - it is shown only while every listed layer group is visible
          spr.userData.layers = Array.isArray(l.layers) ? l.layers.slice() : l.layer ? [l.layer] : null;
          spr.userData.label = l;   // 1.0.1-H: a click on the label shows its explanation and sources (see "labels -> sources" below)
          labelGroup.add(spr);
        } catch (_) {
        }
      }
      uiGroup.add(labelGroup);
      for (const spr of labelGroup.children) spr.userData.base = spr.scale.clone();
      ctx.animated.push(function() {
        const cp = ctx.camera.position;
        for (const spr of labelGroup.children) {
          const d = cp.distanceTo(spr.position);
          const sz = spr.userData.base.y;
          const k = Math.min(1.5, Math.max(0.3, d / 170));
          spr.scale.set(spr.userData.base.x * k, spr.userData.base.y * k, 1);
          // 1.3.7 / 1.9.5: a label may name its own reach (`far`, amot) - the captions of a switch that is looked at from the whole
          // Mount's view (the gatekeepers' sides); without it the reach goes by the label's size, as before
          const far = spr.userData.label && typeof spr.userData.label.far === "number" ? spr.userData.label.far : 0;
          let vis = d < (far || (sz > 18 ? 1800 : sz > 11 ? 700 : 330));
          const SEC = ctx.shared.section;
          if (vis && SEC && SEC.on) { const p = spr.position; if (SEC.axis === "x" ? p.x > SEC.v + 1 : SEC.axis === "y" ? p.y > SEC.v + 1 : p.z > SEC.v + 1) vis = false; }   // 1.9.2: the height too
          const lays = spr.userData.layers;
          if (vis && lays) {
            for (const lay of lays) {
              const g = ctx.layers[lay];
              if (!g || !g.visible) { vis = false; break; }
            }
          }
          spr.visible = vis;
        }
      });
      // ===== occluder fade loop (1.0.19) =====
      // 1.0.1-K (Yossi: "שהחומות יהיו שקופות לא לגמרי, שיאחזו שיש חומה. להוסיף כפתור טשטוש וחסימת חומות. וכן להוסיף כפתור להגדיל את המרחק
      // של הטשטוש"): a blocking wall fades to UI_FADE_OPACITY (0.35; it was 0.1, the wall all but vanished); the fade can be switched off
      // (walls block) and its distance changed (fadeState.dist, 60..400 amot, default 120 = the 1.0.19 FADE_DIST) from the nav row; both
      // are remembered per viewer (localStorage, wrapped: the page works the same without it)
      const UI_FADE_OPACITY = 0.35;
      const UI_FADE_STOPS = [60, 80, 100, 120, 150, 200, 250, 300, 400];
      const lsGet = (k) => {
        try { return window.localStorage ? window.localStorage.getItem(k) : null; } catch (_) { return null; }
      };
      const lsSet = (k, v) => {
        try { if (window.localStorage) window.localStorage.setItem(k, String(v)); } catch (_) {}
      };
      if (!ctx.shared.fadeState) ctx.shared.fadeState = { on: true, dist: 120 };
      {
        const fs0 = ctx.shared.fadeState, sOn = lsGet("tm2.fade.on"), sDist = +lsGet("tm2.fade.dist");
        if (sOn === "0" || sOn === "1") fs0.on = sOn === "1";
        fs0.hide = !!fs0.on && lsGet("tm2.fade.hide") === "1";   // 1.0.2 (D): the second mode "טשטוש: גם קיר מסתיר" (default off: the fade as before)
        fs0.dist = UI_FADE_STOPS.indexOf(sDist) >= 0 ? sDist : typeof fs0.dist === "number" ? fs0.dist : 120;
      }
      {
        const OCCL = ctx.H && Array.isArray(ctx.H.OCC) ? ctx.H.OCC : [], ray = new Raycaster(), fs = ctx.shared.fadeState;
        const dir = new Vector3(), right = new Vector3(), upv = new Vector3(), to = new Vector3(), dd = new Vector3();
        // 1.0.1-K (K.9b; K.6's report: ghost walls inside the throne hall, the king's house and לשכת הגזית): under a roof - an interior
        // view - the rays around the target (+-20 / +-16) and the "near" rays along the view (through the target, up to the fade distance)
        // hit the room's OWN walls and faded them; there only the direct line from the camera to its target clears what blocks it. "Under a
        // roof" = a ray straight up from the camera meets a visible, solid part of the model within 60 amot (the model's large meshes -
        // plain, or instanced with up to 2000 copies, e.g. the 45 boards of בית יער הלבנון - cached for 4 s; the sky, the terrain and the
        // cloud are not part of the test).
        const OFFS5 = [[0, 0], [1, 0], [-1, 0], [0, 1], [0, -1]], OFFS1 = [[0, 0]], OFFS0 = [];
        const upRay = new Raycaster(), UPV = new Vector3(0, 1, 0);
        let roofT = null, roofAt = -1e9;
        const roofList = () => {
          const now = performance.now();
          if (roofT && now - roofAt < 4000) return roofT;
          roofAt = now;
          roofT = [];
          const bb = new Box3(), sz = new Vector3();
          if (ctx.root && typeof ctx.root.traverse === "function") {
            ctx.root.traverse((o) => {
              if (!o.isMesh || !o.geometry) return;
              for (let p = o; p; p = p.parent) if (p.name === "tm-kk-cloud") return;
              const pa = o.geometry.attributes && o.geometry.attributes.position;
              if (pa && pa.count > 30000) return;   // the terrain
              if (o.isInstancedMesh) {
                if (o.count > 2000 || typeof o.computeBoundingBox !== "function") return;
                if (!o.boundingBox) o.computeBoundingBox();
                bb.copy(o.boundingBox).applyMatrix4(o.matrixWorld).getSize(sz);
              } else {
                if (!o.geometry.boundingBox) o.geometry.computeBoundingBox();
                bb.copy(o.geometry.boundingBox).applyMatrix4(o.matrixWorld).getSize(sz);
              }
              if (Math.max(sz.x, sz.z) < 6) return;
              roofT.push(o);
            });
          }
          return roofT;
        };
        const underRoof = (cam) => {
          upRay.set(cam, UPV);
          upRay.near = 0;
          upRay.far = 60;
          for (const h of upRay.intersectObjects(roofList(), false)) {
            let vis = true;
            for (let p = h.object; p; p = p.parent) if (p.visible === false) { vis = false; break; }
            if (!vis) continue;
            const m = Array.isArray(h.object.material) ? h.object.material[0] : h.object.material;
            if (m && (m.visible === false || (m.transparent && m.opacity < 0.5))) continue;
            return true;
          }
          return false;
        };
        // ===== 1.0.2 (D, the mode "טשטוש: גם קיר מסתיר", chosen from the same button): besides the court and mount walls above, a wall of a
        // building - the house, the ulam, the side chambers, the palace (the groups "heichal", "interior", "palace") - that stands between the
        // camera and the controls' target fades to UI_FADE_OPACITY while it hides it, and comes back when it no longer does. Found by rays from
        // the camera to the target (5 rays, 1.5 amot apart at the target; one under a roof) in the same pass as above (every 140 ms), each
        // stopping 2 amot short of the target (a wall the target stands at is not faded) and at the fade distance. A hit on a level face (a
        // floor, a ceiling, a roof's top) does not count; only plain meshes 4 amot high and 5 wide or more, not flat platforms (the otem, the
        // palace's terrace), not the cloud and nothing noPick (the smoke) - model choice: these are the walls. Instanced meshes (the forest
        // house's columns and beams) are left out: fading one would fade all its copies (1.0.4: but for 4 copies or fewer, below). A wall of two courses ("…-stone" / "…-cedar", the
        // ulam) fades whole. Per mesh: its material is cloned once (kept in userData.tmHideClone), the clone is faded, and the shared
        // material is put back when the wall is whole again - no material of another mesh changes; a module that swaps the material
        // meanwhile wins (the fade lets go). userData.fade is set while it is faded: 90-entry.js's ent_solids counts such a wall as a roof
        // for the 360 (the heichal stays "indoors") and lets the camera through it, as it does with a faded court wall (DEV_NOTES "סבב ה'" 10).
        // The court walls' own fade above is unchanged. No allocation per frame (the lists and vectors are kept; three.js's hit records
        // are made only in the 140 ms pass, as above). =====
        // ===== 1.0.4 (the user at the menorot: "למה אני לא יכול לראות מאחוריהם? ... אם צריך תוותר על התקרה - אני לא צריך אותה בשום מקום"): the pass. Round a thing
        // one flew to under a roof (ctx.camPass, 90-entry.js) the camera orbits through the buildings' walls and ceilings; then the same rays (in every fade mode but
        // "כבוי", and 0.3 short of the target, not 2: the wall the target stands at fades too once the camera is behind it) fade every candidate they cross, the
        // ceilings, the roofs and the upper stories' floors too (the flat meshes 5 wide or more, and the 4 high ones from 1 wide, join the list: hideFlat, hideSmall,
        // used only here; a level face counts) - except what still holds the camera (ctx.camPassHit: the floors at or under the target). Every candidate is marked
        // userData.tmPass: those are the meshes 90-entry.js lets the camera through, so a surface it passes is one this loop can fade. Back to whole as before, when
        // the camera returns. =====
        const HIDE_GROUPS = ["heichal", "courts", "har-habayit"], HIDE_PASS_SHORT = 0.3, HIDE_INST = 4;   // Beit Sheni: the groups of 50-heichal.js / 30-courts.js / 20-mount.js
        // 1.0.4: a ceiling, a roof or a floor that the pass fades goes to HIDE_PASS_FLAT, not UI_FADE_OPACITY: over the heichal four of them lie one on another
        // (the roof, two courses, the gold ceiling), and at 0.35 each the menorot were all but lost (model choice; the walls keep 0.35)
        const HIDE_PASS_FLAT = 0.06;
        let hideT = null, hideAt = -1e9;
        const hidePair = new Map(), hideBlocked = new Set(), hideHits = [], HID = [], hideFlat = new Set(), hideSmall = new Set(), hideDeep = new Set();
        const hideBB = new Box3(), hideSz = new Vector3(), hideN = new Vector3();
        const hideTo = (o) => (hideDeep.has(o) ? HIDE_PASS_FLAT : UI_FADE_OPACITY);   // 1.0.4: how far a hidden mesh fades
        const hideList = () => {
          const now = performance.now();
          if (hideT && now - hideAt < 5000) return hideT;
          hideAt = now;
          const occS = new Set(OCCL), out = [], stems = new Map();
          hidePair.clear();
          hideFlat.clear();
          hideSmall.clear();
          for (const top of ctx.root && Array.isArray(ctx.root.children) ? ctx.root.children : []) {
            if (HIDE_GROUPS.indexOf(top.name) < 0) continue;
            top.traverse((o) => {
              // 1.0.4: an instanced mesh of up to HIDE_INST copies too (Yachin and Boaz in the ulam, whose shafts stopped the orbit round the ulam's tables:
              // the two fade together); not the forest house's 45 columns
              if (!o.isMesh || (o.isInstancedMesh && !(o.count <= HIDE_INST && typeof o.computeBoundingBox === "function")) || !o.geometry || occS.has(o) || o.userData.noPick) return;
              // 1.2.2 (the user: the capital "disappears"): the pillars and their capitals are never faded - the dome of the capital stood between
              // the eye and the target (the capital's centre) and went see-through; also any mesh or group marked userData.noFade
              for (let p = o; p; p = p.parent) if (p.name === "tm-kk-cloud" || p.name === "yachinBoaz" || (p.userData && p.userData.noFade)) return;
              const pa = o.geometry.attributes && o.geometry.attributes.position;
              if (!pa || pa.count > 30000) return;
              if (o.isInstancedMesh) {
                if (!o.boundingBox) o.computeBoundingBox();
                hideBB.copy(o.boundingBox);
              } else {
                if (!o.geometry.boundingBox) o.geometry.computeBoundingBox();
                hideBB.copy(o.geometry.boundingBox);
              }
              hideBB.applyMatrix4(o.matrixWorld).getSize(hideSz);
              const hz = Math.max(hideSz.x, hideSz.z), flat = hideSz.y < 0.15 * hz;
              // 1.0.4: for the pass also what is 4 high but narrower than 5 (1 at least): the devir's door leaves, which hid Moses' menorah from the devir,
              // a cherub, the parochet
              const small = !flat && hideSz.y >= 4 && hz < 5 && hz >= 1;
              if ((hz < 5 && !small) || (!flat && hideSz.y < 4)) return;
              out.push(o);
              o.userData.tmPass = true;   // 1.0.4: 90-entry.js lets the camera through it round a thing one flew to
              if (flat) hideFlat.add(o);   // 1.0.4: a ceiling, a roof, a floor: the pass only
              if (small) hideSmall.add(o);   // 1.0.4: the pass only
              const sm = /^(.+)-(?:stone|cedar)$/.exec(o.name || "");
              if (sm) {
                const k = (o.parent ? o.parent.uuid : "") + "|" + sm[1];
                if (!stems.has(k)) stems.set(k, []);
                stems.get(k).push(o);
              }
            });
          }
          for (const g of stems.values()) if (g.length > 1) for (const o of g) hidePair.set(o, g);
          hideT = out;
          return out;
        };
        const hideShown = (o) => {
          for (let p = o; p; p = p.parent) if (p.visible === false) return false;
          return true;
        };
        const hideStart = (m) => {
          const ud = m.userData, orig = m.material;
          let clone = ud.tmHideClone;
          if (!clone || ud.tmHideOrig !== orig) {
            clone = Array.isArray(orig) ? orig.map((x) => x.clone()) : orig.clone();
            ud.tmHideClone = clone;
            ud.tmHideOrig = orig;
          }
          const base = Array.isArray(orig) ? orig.map((x) => (typeof x.opacity === "number" ? x.opacity : 1)) : typeof orig.opacity === "number" ? orig.opacity : 1;
          for (const c of Array.isArray(clone) ? clone : [clone]) {
            c.transparent = true;
            c.depthWrite = false;
            c.needsUpdate = true;
          }
          m.material = clone;
          const st = { m, orig, clone, base, cur: 1, tgt: 1 };
          ud.fade = st;
          HID.push(st);
          return st;
        };
        const hideHas = (m) => {
          for (let i = 0; i < HID.length; i++) if (HID[i].m === m) return HID[i];
          return null;
        };
        const hideDrop = (i) => {
          const st = HID[i];
          if (st.m.userData.fade === st) delete st.m.userData.fade;
          HID[i] = HID[HID.length - 1];
          HID.pop();
        };
        let last = -1e9;
        ctx.animated.push(function(t) {
          if (t - last > 140) {
            last = t;
            const blocked = new Set();
            hideBlocked.clear();
            hideDeep.clear();
            const FADE_DIST = typeof fs.dist === "number" && fs.dist > 0 ? fs.dist : 120;   // a wall fades only within this many amot of the camera
            // 1.2.2 (the user's recording: the eye left the heichal through its wall while orbiting the menorot): hideList() marks the
            // buildings' walls and ceilings userData.tmPass, and 90-entry.js's cam_keepInside holds the eye in the room by those marks -
            // but it ran only in the modes "גם קיר מסתיר" / "מעבר דרך קירות", so in the default mode no wall was marked. Now every tick (cached 5 s).
            try { hideList(); } catch (_) {}
            let fadeHeld = false;   // FADE_HOLD_211
            try { fadeHeld = !!(ctx.shared.fadeHold && ctx.shared.fadeHold.held()); } catch (_) { fadeHeld = false; }
            if (fs.on && !fadeHeld) {
              const cam = ctx.camera.position, tg = ctx.controls.target;
              let inside = false;
              try { inside = underRoof(cam); } catch (_) { inside = false; }
              dir.subVectors(tg, cam).normalize();
              right.crossVectors(dir, ctx.camera.up).normalize();
              upv.crossVectors(right, dir).normalize();
              for (const [ox, oy] of inside ? OFFS1 : OFFS5) {
                to.copy(tg).addScaledVector(right, ox * 20).addScaledVector(upv, oy * 16);
                dd.subVectors(to, cam);
                const L = dd.length();
                ray.set(cam, dd.normalize());
                ray.near = 0;
                // 1.0.1-K review (ui-3): 3 amot short of the target (was 1): with a far "מרחק טשטוש" these rays reach the target, and the
                // face of the wall it stands in faded with them (the eastGate view at 400: the gate's own wall); 3 = model choice
                ray.far = Math.min(L - 3, FADE_DIST);
                for (const h of ray.intersectObjects(OCCL, false)) blocked.add(h.object);
              }
              // 1.0.16: a wall right in front of the camera (within NEAR amot along the view direction) fades too,
              // even when the orbit target is on this side of it / on the wall itself (e.g. close to a gate).
              // 1.0.1-K: not under a roof (see above)
              // 1.0.1-K review (ui-3): NEAR keeps the 1.0.19 reach (120) at most - these rays go on past the target on purpose (a wall
              // the target stands on), so NEAR = FADE_DIST (up to 400) ghosted the walls far behind the target (eastGate at 400: a third
              // of the screen); a larger distance now lengthens only the rays toward the target above
              const NEAR = Math.min(FADE_DIST, 120);
              for (const [ox, oy] of inside ? OFFS0 : OFFS5) {
                to.copy(cam).addScaledVector(dir, NEAR).addScaledVector(right, ox * 8).addScaledVector(upv, oy * 6);
                dd.subVectors(to, cam);
                ray.set(cam, dd.normalize());
                ray.near = 0;
                ray.far = NEAR + 2;
                for (const h of ray.intersectObjects(OCCL, false)) blocked.add(h.object);
              }
              // 1.0.2 (D): the building's walls that hide the target (see above); 1.0.4: and the pass (see above)
              let pass = false;
              try { pass = typeof ctx.camPass === "function" && !!ctx.camPass() && typeof ctx.camPassHit === "function"; } catch (_) { pass = false; }
              if (fs.hide || pass) {
                const list = hideList();
                for (const [ox, oy] of inside ? OFFS1 : OFFS5) {
                  to.copy(tg).addScaledVector(right, ox * 1.5).addScaledVector(upv, oy * 1.5);
                  dd.subVectors(to, cam);
                  const far = Math.min(dd.length() - (pass ? HIDE_PASS_SHORT : 2), FADE_DIST);
                  if (!(far > 0.5)) continue;
                  ray.set(cam, dd.normalize());
                  ray.near = 0;
                  ray.far = far;
                  hideHits.length = 0;
                  ray.intersectObjects(list, false, hideHits);
                  for (const h of hideHits) {
                    const o = h.object;
                    if (hideBlocked.has(o) || !hideShown(o)) continue;
                    if (pass) {
                      if (!ctx.camPassHit(h, ray.ray.direction)) continue;   // a floor under the target
                    } else if (hideFlat.has(o) || hideSmall.has(o)) continue;
                    else if (h.face) {
                      hideN.copy(h.face.normal).transformDirection(o.matrixWorld);
                      if (Math.abs(hideN.y) > 0.7) continue;
                    }
                    hideBlocked.add(o);
                    if (pass && hideFlat.has(o)) hideDeep.add(o);
                    const pr = hidePair.get(o);
                    if (pr) for (const q of pr) hideBlocked.add(q);
                  }
                }
                hideHits.length = 0;
              }
            }
            for (const m of OCCL) m.userData.fade.tgt = blocked.has(m) ? UI_FADE_OPACITY : 1;
            for (const m of OCCL) {
              const fw = m.userData.fadeWith;
              if (fw && blocked.has(fw)) m.userData.fade.tgt = UI_FADE_OPACITY;
            }
            for (let i = 0; i < HID.length; i++) HID[i].tgt = hideBlocked.has(HID[i].m) ? hideTo(HID[i].m) : 1;
            for (const o of hideBlocked) if (!hideHas(o)) hideStart(o).tgt = hideTo(o);
          }
          // 1.0.2 (D): the building's walls toward their target; whole again -> the shared material back
          for (let i = HID.length - 1; i >= 0; i--) {
            const st = HID[i];
            if (st.m.material !== st.clone) {   // another module changed the material meanwhile: it wins
              hideDrop(i);
              continue;
            }
            if (Math.abs(st.cur - st.tgt) < 4e-3) {
              if (st.tgt >= 1) {
                st.m.material = st.orig;
                hideDrop(i);
              }
              continue;
            }
            st.cur += (st.tgt - st.cur) * 0.2;
            if (Array.isArray(st.clone)) for (let k = 0; k < st.clone.length; k++) st.clone[k].opacity = st.base[k] * st.cur;
            else st.clone.opacity = st.base * st.cur;
          }
          for (const m of OCCL) {
            const f = m.userData.fade;
            if (Math.abs(f.cur - f.tgt) < 4e-3) continue;
            f.cur += (f.tgt - f.cur) * 0.2;
            const mat = m.material, tr = f.cur < 0.99;
            if (mat.transparent !== tr) {
              mat.transparent = tr;
              mat.depthWrite = !tr;
              mat.needsUpdate = true;
            }
            mat.opacity = f.cur;
          }
        });
      }
      window.__TM_CTX = ctx; // debug hook for DEV/tests (labels, camera, controls)
      setCutaway(false);
      // ===== panel =====
      const style = document.createElement("style");
      style.textContent = ui_CSS;
      document.head.appendChild(style);
      // 1.1.0: the burger lives in the top bar of index.html (header.topbar .tb-start); created here only if the page has none
      let burger = document.getElementById("tm-burger");
      if (!burger) {
        burger = document.createElement("button");
        burger.id = "tm-burger";
        burger.type = "button";
        burger.title = "הצג/הסתר לוח בקרה";
        document.body.appendChild(burger);
      }
      burger.textContent = "✕";
      const panel = document.createElement("div");
      panel.id = "tm-panel";
      document.body.appendChild(panel);
      const title = document.createElement("div");
      title.className = "t";
      title.textContent = "בית המקדש השני";
      const sub = document.createElement("div");
      sub.className = "s";
      sub.textContent = "מסכת מידות · רמב״ם הלכות בית הבחירה · חז״ל ומפרשים";
      panel.appendChild(title);
      panel.appendChild(sub);
      burger.addEventListener("click", () => {
        const hidden = panel.style.display === "none";
        panel.style.display = hidden ? "" : "none";
        burger.textContent = hidden ? "✕" : "☰";
      });
      // the phone layout (panel closed) is decided once the real window size is known: a page booted in a hidden tab sees innerWidth 0
      // and 1.0.1 took that for a phone (review ui-zero-width-boot-hides-panel) - then the decision waits for a resize or the next ticks
      {
        let decided = false, iv = null;
        const decide = () => {
          if (decided) return;
          const w = window.innerWidth || 0;
          if (w < 2) return;
          decided = true;
          window.removeEventListener("resize", decide);
          if (iv) clearInterval(iv);
          if (isPhone(w)) {
            panel.style.display = "none";
            burger.textContent = "☰";
          }
        };
        decide();
        if (!decided) {
          window.addEventListener("resize", decide);
          iv = setInterval(decide, 400);
        }
      }
      const hidePanelOnPhone = () => {
        if (isPhone()) {
          panel.style.display = "none";
          burger.textContent = "☰";
        }
      };
      // 1.0.1-H (the user: "הוסף מקורות להכל"): a row may carry its sources - opts.src = [[label, ref], ...] - shown as small links under it
      // (refLinks is defined with the Otzaria opener below; the rows are built after it)
      const toggleRow = function(text, checked, onChange, opts) {
        const lab = document.createElement("label");
        lab.className = "row";
        const inp = document.createElement("input");
        inp.type = "checkbox";
        inp.checked = !!checked;
        if (opts && opts.disabled) {
          inp.disabled = true;
          lab.title = opts.title || "השכבה לא נטענה";
        }
        inp.addEventListener("change", () => {
          try {
            onChange(inp.checked);
          } catch (_) {
          }
        });
        const span = document.createElement("span");
        span.textContent = text;
        lab.appendChild(inp);
        lab.appendChild(span);
        panel.appendChild(lab);
        // 1.0.1-K (review UI-H2-3): the sources go AFTER the label, not inside it - a click on their caption toggled the checkbox
        if (false && opts && Array.isArray(opts.src) && opts.src.length) {   // 1.1.0: no sources in the tree (they stay in the cards)
          const s = document.createElement("div");
          s.className = "tm-src row-src";
          s.appendChild(document.createTextNode(opts.srcLabel || "מקור: "));
          refLinks(s, opts.src);
          panel.appendChild(s);
        }
        return inp;
      };
      // (1.0.1-H: the 1.0.0 two-button rows `optRow` were replaced by the opinions table below)
      // 1.0.1-H: the opinions table (the user: "את השיטות תנסה להכניס לתוך מסגרת מסודרת"): one row per dispute - the subject, its sources as
      // links, and the readings as buttons (2 or 3); picking one calls onPick(key), marks the button, shows the reading's explanation in the
      // info box and, when the row has `fly`, flies to the spot. Rows whose model switch is missing are shown disabled.
      // row = { cap, refs, options: [[key, label, info, infoRefs?]], current, onPick, fly?: () => void, disabled? }; returns { mark }
      const opsBox = document.createElement("div");
      opsBox.id = "tm-ops";
      // 1.0.1-H: every row is also kept in OPS (with row.mark and row.cur = the key now shown) for the presentation (75-tour.js, ctx.ui)
      const OPS = [];
      // 1.0.2 (item 4): a row with an id (the ctx.shared key of its switch) is found by the cards' chips: OPS_BY_ID[id]; row.short = its
      // name in a card with two rows, row.chips = { key: the chip's short label }, row.cardFly = a chip also flies (the subject moves)
      const OPS_BY_ID = {};
      const opRow = function(row) {
        OPS.push(row);
        if (row.id) OPS_BY_ID[row.id] = row;
        row.cur = row.current;
        const box = document.createElement("div");
        box.className = "tm-op";
        const cap = document.createElement("span");
        cap.className = "cap";
        cap.textContent = ui_stripSrc(row.cap);   // 1.1.0: no sources in the tree (they are on the card's chips)
        box.appendChild(cap);
        // 1.1.0 (the user): no sources in the tree - the row's refs stay on the card of its subject (the chips) and in the presentation
        const bb = document.createElement("div");
        bb.className = "bb" + (row.options.length % 3 === 0 ? " c3" : "");   // 1.0.1-L: three in a row; two and four in two columns (1.8.0: six - two rows of three)
        const bts = [];
        const mark = (key) => {
          row.cur = key;
          for (const b of bts) b.el.classList.toggle("on", b.key === key);
          chipsRefresh();   // 1.0.2 (item 4): an open card's chips follow the table, whoever marked it
        };
        row.mark = mark;
        for (const [key, label, info, infoRefs] of row.options) {
          const b = document.createElement("button");
          b.type = "button";
          b.textContent = ui_stripSrc(label);   // 1.1.0: no sources in the tree
          if (b.textContent !== label) b.title = label;
          if (row.disabled) b.disabled = true;
          b.addEventListener("click", () => {
            // CHIP_CLOSEAUTO_211: the roof, the section or the zone that a place or a row opened for a while goes back at once
            if (typeof row.fly === "function") {
              try { autoOff.flush(); } catch (_) {}
              try { if (typeof ctx.shared.closeAuto === "function") ctx.shared.closeAuto(); } catch (_) {}
              try { placeLeave({}); } catch (_) {}   // the layer or the untimed feature of the place before
            }
            mark(key);
            try {
              row.onPick(key);
            } catch (_) {
            }
            // 1.0.1-L (L.34): the reading's explanation opens in the floating card beside the panel (K.9b scrolled the panel to its foot)
            if (info) setInfo("__place", { text: info, refs: infoRefs || row.refs || [] }, { title: row.cap + " — " + label, anchor: b, row });   // 1.0.2: the card's chips = this row
            if (typeof row.fly === "function") {
              try {
                row.fly(key);
              } catch (_) {
              }
              // 1.0.1-K (review UI-H2-2): the row flew elsewhere - the view or place it left is no longer marked
              for (const o of btns) o.classList.remove("on");
              for (const o of placeBtns) o.classList.remove("on");
            }
            hidePanelOnPhone();
          });
          bb.appendChild(b);
          bts.push({ key, el: b });
        }
        box.appendChild(bb);
        if (!row.cardOnly) opsBox.appendChild(box);   // 1.9.2: a card's own switch is not in the table
        row.box = box;   // OPS_GROUPS_303: kept - the rows go into their groups after the last of them (below)
        mark(row.current);
        return { mark };
      };
      let chipsRefresh = () => {};   // 1.0.2 (item 4): set with the cards' chips below
      // ===== 1.0.1-L (L.34, the user: "כל פעם שלוחצים על הר הבית הוא פותח הסבר ואז צריך לגלול כדי למצוא את יתר הכפתורים"; "כן, כרטיס צף"):
      // the floating EXPLANATION CARD #tm-xcard. Until 1.0.1-K the explanation of a view / place / reading was written into #tm-info at the
      // panel's foot and the panel was scrolled to it, so the buttons went out of view. Now the panel holds the buttons only; the explanation
      // opens in a card BESIDE the panel (over the model, next to the panel's edge, its top at the height of the clicked button), with a ✕,
      // its own scroll and the source links; a new choice replaces its content; Esc or ✕ closes it; on a phone it is a bottom sheet above the
      // nav row (CSS). One card at a time: opening it closes the label's card (openCard closes this one), and the presentation closes it when
      // it starts (ctx.ui.card.close). setInfo keeps its old signature and fills the card (ctx.ui.setInfo). =====
      let closeLabelCard = () => {};   // the label's card (set below, where it is built)
      const xcard = document.createElement("div");
      xcard.id = "tm-xcard";
      xcard.setAttribute("role", "dialog");
      xcard.setAttribute("aria-label", "הסבר ומקורות");
      const xHead = document.createElement("div");
      xHead.className = "h";
      const xTitle = document.createElement("span");
      xTitle.className = "tt";
      const xClose = document.createElement("button");
      xClose.type = "button";
      xClose.className = "x";
      xClose.textContent = "✕";
      xClose.title = "סגור את ההסבר (Esc)";
      // 1.0.1-L (the user, on the card over the Sea: "הבועה הזו חוסמת את המסך"): the card opens at the window's left edge, clear of the subject in the
      // middle, and ▾ folds it to its title; the fold stays for the next places, until it is opened again or the card is closed
      const xMin = document.createElement("button");
      xMin.type = "button";
      xMin.className = "x";
      const setXMin = (on) => {
        xcard.classList.toggle("min", !!on);
        xMin.textContent = on ? "▴" : "▾";
        xMin.title = on ? "פתח את ההסבר" : "קפל את ההסבר, כדי לראות את המודל";
      };
      setXMin(false);
      const toggleXMin = (e) => {
        e.stopPropagation();
        setXMin(!xcard.classList.contains("min"));
        placeXCard();
      };
      xMin.addEventListener("click", toggleXMin);
      xTitle.addEventListener("click", (e) => { if (xcard.classList.contains("min")) toggleXMin(e); });
      xHead.appendChild(xTitle);
      xHead.appendChild(xMin);
      xHead.appendChild(xClose);
      const xBody = document.createElement("div");
      xBody.className = "b";
      const xRefs = document.createElement("div");
      xRefs.className = "r";
      const xOps = document.createElement("div");   // 1.0.2 (item 4): "שיטות:" and the chips, when the subject has opinions
      xOps.className = "o";
      xOps.style.display = "none";
      xcard.appendChild(xHead);
      xcard.appendChild(xBody);
      xcard.appendChild(xRefs);
      xcard.appendChild(xOps);
      document.body.appendChild(xcard);
      let xOpen = false, xAnchor = null, xSide = null, xOpsIds = null, xRow = null;
      // ===== 1.0.2 (item 4, the user: "מעולה"): the other opinions inside the card. A card whose subject has rows in "שיטות ומחלוקות" ends with
      // "שיטות:" and one small chip per reading (the style of the card's source chips), the current one marked; a chip does what the row's
      // button does - row.mark (the table in step) and row.onPick - and a row whose subject moves with the reading (row.cardFly: the Sea's
      // corner, the height of the house, the ulam, the pillars, the forest house, the ulam's tables) flies like the row. The card stays open
      // and its chips follow; a card opened from the table itself shows the new reading's explanation. Subject -> rows: UI_OPS_V by view key,
      // UI_OPS_P by place title, UI_OPS_L by a label's text or layer (model choice: the rows that the subject's own text or picture shows). =====
      const UI_OPS_V = {"mizbeach": ["sh14", "sh16", "sh17", "sh18", "sh19", "sh20", "sh21", "sh23", "sh24", "sh25"], "ulam": ["sh28", "sh29", "sh30", "sh58"], "heichalFront": ["sh29", "sh33", "sh35", "sh36", "sh58"], "ezratNashim": ["sh4", "sh5", "sh6", "sh9"], "harHabayit": ["sh1", "sh55"], "shushanGate": ["sh1", "sh2"], "azarah": ["sh9", "sh16", "sh27", "sh34", "sh54", "sh58"], "nikanor": ["sh9", "sh58"], "kodeshHakodashim": ["sh47", "sh56", "sh49"], "kodesh": ["sh39", "sh40", "sh41", "sh42", "sh45", "sh47", "sh56", "sh49", "sh57"]};
      const UI_OPS_P = {"המזבח": ["sh16", "sh17", "sh18", "sh19", "sh20", "sh21", "sh23", "sh24", "sh25"], "ספלי הניסוך": ["sh23"], "מידות המזבח — 32, 30, 28, 26, 24, והמזבח הקודם 28 על 28": ["sh17"], "ההיכל": ["sh29", "sh33", "sh35", "sh36"], "גובה ההיכל — מאה אמה מרצפת העזרה (1.1.0)": ["sh33", "sh36"], "העזרה": ["sh9", "sh16", "sh34", "sh58"], "הכיור": ["sh26"], "הטבעות": ["sh62"], "הדגמת המוכני — הכיור יורד לבור ועולה": ["sh26"], "הכבש הגדול": ["sh24", "sh25"], "כבשים קטנים — רש״י": ["sh25"], "כבשים קטנים — תוספות": ["sh25"], "הכבש והכבשים הקטנים (1.0.21)": ["sh25"], "נקבי המזבח והרבובה (1.0.13)": ["sh19"], "שער טדי": ["sh55"], "שער טדי — פתח פתוח בצורת גג (1.0.19)": ["sh55"], "הסורג": ["sh3"], "הנברשת והטבלא של הילני": ["sh31", "sh32"], "שושן הבירה — שתי אמות המידה": ["sh2"], "שער עזרת נשים — המזרחי": ["sh2", "sh4", "sh9"], "עזרת נשים": ["sh4", "sh9"], "שער שושן": ["sh1"], "כותל המזרח הנמוך (1.0.6)": ["sh1"], "״השער העליון״ — השם הוסר משער עזרת נשים (1.1.0)": ["sh9"], "שער ניקנור": ["sh9", "sh58"], "שער הניצוץ": ["sh9", "sh54", "sh58"], "שער הקרבן": ["sh9", "sh54", "sh58"], "שער הדלק": ["sh9", "sh58"], "שער הבכורות": ["sh9", "sh58"], "שער המים": ["sh9", "sh58"], "בית המוקד": ["sh12", "sh50", "sh51", "sh52", "sh54", "sh58"], "לשכת עושי לחם הפנים": ["sh46", "sh52"], "לשכת עושי חביתין": ["sh53"], "לשכת החותמות — בבית המוקד": ["sh51"], "בין האולם ולמזבח": ["sh27"], "דוכן הלויים": ["sh10"], "עזרת ישראל": ["sh34"], "עזרת כהנים": ["sh34"], "חמש עשרה המעלות — כחצי גורן": ["sh5", "sh6"], "לשכת הנזירים": ["sh5"], "לשכת העצים": ["sh5"], "לשכת המצורעים": ["sh5"], "לשכת שמנים": ["sh5"], "פשפשי בית החליפות": ["sh29", "sh35"], "לשכת הגזית — הסנהדרין": ["sh11", "sh12"], "ארבעת הפייסות ו״ברקאי״ — הדגמה": ["sh12", "sh13"], "בגדי הכהנים": ["sh13"], "שתי הסנהדראות הקטנות": ["sh8", "sh11"], "שתי הפרוכות — בין הקודש לקודש הקדשים": ["sh47", "sh56", "sh49"], "כני הזהב שבהיכל — ביום הכיפורים": ["sh48"], "הכהן הגדול נכנס בקטורת — הדגמה": ["sh47", "sh56"], "הרובד הרביעי — ביום הכיפורים": ["sh28"], "פשפשי ההיכל": ["sh39", "sh40"], "בית המטבחים": ["sh14", "sh15"], "המסיבה": ["sh38"], "הליכה במסיבה — הדגמה": ["sh38"], "העלייה והלולין": ["sh37", "sh59"], "התפוח": ["sh19", "sh20", "sh21"], "מעלות האולם (1.0.12)": ["sh28"], "האולם": ["sh28", "sh29", "sh30", "sh58"], "השער הגדול — ארבע הדלתות": ["sh41", "sh58"], "פתיחת השער הגדול — הדגמה": ["sh41"], "המנורה": ["sh42", "sh44", "sh45", "sh57"], "שולחן לחם הפנים": ["sh42", "sh44", "sh45", "sh46", "sh57"], "הקודש": ["sh40", "sh41", "sh42", "sh44", "sh45", "sh57"], "התאים — שלושים ושמונה בשלוש קומות": ["sh38"], "אבן השתייה": [], "אבן השתייה — גבוהה שלוש אצבעות (1.1.0)": [], "קודש הקדשים": [], "קודש הקדשים ואבן השתייה": [], "פתח העלייה ופנים העלייה": ["sh59"], "שלוש עשרה הפרוכות": ["sh58", "sh59", "sh47", "sh56"]};
      const UI_OPS_L = [
        [/^(?:המזבח|הכבש|כבש )/, ["sh16", "sh17", "sh18", "sh19", "sh20", "sh21", "sh23", "sh24", "sh25"]],
        [/^שער טדי/, ["sh55"]],
        [/^אבן השתייה/, []],
        [/^בית המוקד/, ["sh12", "sh50", "sh51", "sh52", "sh54"]],
        [/^האולם/, ["sh28", "sh29", "sh30", "sh58"]],
        [/^המנורה|^שולחן לחם|^אבן שלפני/, ["sh42", "sh44", "sh45", "sh57"]],
        [/^ספלי הניסוך/, ["sh23"]],
        [/^ההיכל$|^תוספת עד 120/, ["sh29", "sh33", "sh35", "sh36"]],
        [/^הסורג|^החיל/, ["sh3"]],
        [/^(?:צורת התאים|קומה (?:תחתונה|אמצעית|עליונה)|כנגד האוטם|השורה העליונה|כותל של אמה|התאים)/, ["sh38"]]
      ];
      const UI_OPS_LAYER = {};
      // subj = { view?, title?, label?, layers? } -> the row ids (kept unfiltered: the rows are built after the places and the labels)
      const opsFor = (subj) => {
        const ids = [];
        const add = (a) => { for (const id of a || []) if (ids.indexOf(id) < 0) ids.push(id); };
        if (!subj) return ids;
        if (subj.view) add(UI_OPS_V[subj.view]);
        if (subj.title) {
          add(UI_OPS_P[subj.title]);
          const it = placeItemByT[subj.title];
          if (it) { add(UI_OPS_V[it.view]); add(UI_OPS_V[it.key]); }
        }
        if (subj.label) for (const [re, a] of UI_OPS_L) if (re.test(subj.label)) add(a);
        for (const lay of subj.layers || []) if (UI_OPS_LAYER[lay]) add([UI_OPS_LAYER[lay]]);
        return ids;
      };
      // the rows now present (an id or a row object), each once; a disabled row (its switch missing) shows no chips
      const opsLive = (ids) => {
        const out = [];
        for (const id of Array.isArray(ids) ? ids : []) {
          const r = id && typeof id === "object" ? id : OPS_BY_ID[id];
          if (r && !r.disabled && Array.isArray(r.options) && r.options.length > 1 && out.indexOf(r) < 0) out.push(r);
        }
        return out;
      };
      // a chip's words: row.chips[key], else the reading's label up to its colon, without a closing bracket
      const opsChip = (row, key) => {
        if (row.chips && row.chips[key]) return row.chips[key];
        const o = row.options.find((x) => x[0] === key);
        let s = String(o ? o[1] : key);
        const i = s.indexOf(":");
        if (i > 0 && i < 40) s = s.slice(0, i);
        s = s.replace(/\s*\([^()]*\)\s*$/, "").trim();
        return s.length > 72 ? s.slice(0, 70) + "…" : s;   // 1.5.0: the chips wrap, not cut
      };
      const pickFromCard = (row, key) => {
        row.mark(key);
        try {
          row.onPick(key);
        } catch (_) {
        }
        if (row.cardFly && typeof row.fly === "function") {
          try { if (typeof ctx.shared.closeAuto === "function") ctx.shared.closeAuto(); } catch (_) {}   // CHIP_CLOSEAUTO_211
          try {
            row.fly(key);
          } catch (_) {
          }
          for (const o of btns) o.classList.remove("on");
          for (const o of placeBtns) o.classList.remove("on");
        }
      };
      // writes the chips of the rows `ids` into host; false (and host hidden) when there is none. onPicked(row, key) after a chip's switch
      const renderChips = (host, ids, onPicked) => {
        host.textContent = "";
        const rows = opsLive(ids);
        host.style.display = rows.length ? "" : "none";
        if (!rows.length) return false;
        host.appendChild(document.createTextNode(rows.every((r) => r.cardOnly) ? "מבט: " : "שיטות: "));   // 1.9.2
        for (const row of rows) {
          const g = document.createElement("span");
          // CHIP_NAME_211 (the understandability review, U-45): a card with ONE row ended "שיטות:" and bare chips - in "הרובד הרביעי"
          // the three chips of "מעלות האולם" read as three opinions about the rovad. The row's name stands before its chips always.
          const nm = row.short || (row.cardOnly ? "" : row.cap) || "";
          if (rows.length > 1 || nm) {
            g.className = "g";
            const k = document.createElement("span");
            k.className = "k";
            k.textContent = nm + (nm ? ":" : "");
            g.appendChild(k);
          }
          for (const [key, label] of row.options) {
            const a = document.createElement("a");
            a.href = "#";
            a.setAttribute("role", "button");
            const on = row.cur === key;
            a.className = on ? "on" : "";
            a.setAttribute("aria-pressed", on ? "true" : "false");
            ui_fillSrc(a, opsChip(row, key));
            a.title = String(label || "");
            a.addEventListener("click", (ev) => {
              ev.preventDefault();
              ev.stopPropagation();
              if (row.cur === key) return;
              pickFromCard(row, key);
              if (onPicked) onPicked(row, key);
            });
            g.appendChild(a);
          }
          host.appendChild(g);
        }
        return true;
      };
      // the panel's card: a card opened from the table (xRow) shows the new reading's explanation, as the table's button does
      const xChipPicked = (row, key) => {
        if (xRow !== row) return;
        const o = row.options.find((x) => x[0] === key);
        if (o && o[2]) setInfo("__place", { text: o[2], refs: o[3] || row.refs || [] }, { title: row.cap + " — " + o[1], anchor: xAnchor, side: xSide, row });
      };
      // the card's place: beside the panel's edge (right of the panel when it is shown, else at the window's edge), its top at the clicked
      // button's top, clamped so that it stays inside the window above the nav row; a phone uses the CSS bottom sheet (no inline top)
      const placeXCard = () => {
        if (!xOpen) return;
        const W = window.innerWidth || 0, H = window.innerHeight || 0;
        if (isPhone(W)) {
          // the bottom sheet, just above the nav row and the compass (the row wraps on a phone: its real top is measured)
          xcard.style.right = "";
          xcard.style.left = "";
          xcard.style.top = "";
          xcard.style.width = "";
          let edge = H - 70;
          for (const id of ["tm-nav", "tm-compass"]) {
            const el = document.getElementById(id);
            const r = el && typeof el.getBoundingClientRect === "function" ? el.getBoundingClientRect() : null;
            if (r && r.height && r.top < edge) edge = r.top;
          }
          xcard.style.bottom = (H - edge + (document.body.classList.contains("tm-measuring") ? 34 : 6)).toFixed(0) + "px";
          return;
        }
        xcard.style.bottom = "";
        const shown = panel.style.display !== "none", rightGap = shown ? 242 : 12;
        // the presentation's banner on the left (a card opened while it is paused) is never overlapped: the card narrows in a small window
        const tb = document.getElementById("tm-tour-box");
        const tr = tb && typeof tb.getBoundingClientRect === "function" ? tb.getBoundingClientRect() : null;
        const atLeft = !(tr && tr.width);   // 1.0.1-L: every card at the window's left edge, so that the subject in the middle stays clear; beside the panel only while the presentation's banner holds the left
        xcard.style.left = atLeft ? "12px" : "";
        xcard.style.right = atLeft ? "auto" : rightGap + "px";
        xcard.style.width = tr && tr.width ? Math.max(180, Math.min(340, W - rightGap - tr.right - 8)).toFixed(0) + "px" : "";
        const barH = ui_barH();   // 1.0.2: 9 px below the bar, as #tm-panel (the old 56 sat flush against the 56 px bar)
        let top = barH + 9;
        if (!atLeft && xAnchor && xAnchor.isConnected !== false && typeof xAnchor.getBoundingClientRect === "function") {
          const r = xAnchor.getBoundingClientRect();
          if (r && r.height) top = r.top - 6;
        }
        const h = xcard.offsetHeight || 200;
        top = Math.max(barH + 9, Math.min(H - h - 64, top));
        xcard.style.top = top.toFixed(0) + "px";
      };
      const xcardClose = () => {
        if (!xOpen) return;
        xOpen = false;
        xAnchor = null;
        xSide = null;
        xOpsIds = null;
        xRow = null;
        setXMin(false);
        xcard.style.display = "none";
      };
      // open(title, content, refs, anchor, side, ops?, row?): the content is plain text, or HTML when it starts with a tag (ctx.ui.card); refs = [[label, ref], ...]
      // become links; 1.0.2: ops = the rows whose chips end the card (ids or rows; none from ctx.ui.card.open), row = the table's row that opened it
      const xcardOpen = (title, text, refs, anchor, side, ops, row) => {
        closeLabelCard();   // one card at a time
        ui_fillSrc(xTitle, String(title || ""));   // 1.0.1-L (L.89)
        if (/^\s*</.test(String(text || ""))) { xBody.innerHTML = String(text); xBody.__raw = null; }
        else ui_fillRich(xBody, String(text || ""), srcLinker(refs), 1700);   // 1.9.1: rich; FOLD_211   // 1.0.2 (A): the brackets open their sources
        xRefs.textContent = "";
        const rs = Array.isArray(refs) ? refs : [];
        if (rs.length) {
          xRefs.appendChild(document.createTextNode("למקור: "));
          refLinks(xRefs, rs);
        }
        xRefs.style.display = rs.length ? "" : "none";
        xOpsIds = Array.isArray(ops) && ops.length ? ops : null;
        xRow = row || null;
        renderChips(xOps, xOpsIds, xChipPicked);
        xAnchor = anchor || null;
        xSide = side || null;
        xOpen = true;
        xcard.style.display = "flex";
        xBody.scrollTop = 0;
        xRefs.scrollTop = 0;
        placeXCard();
      };
      xClose.addEventListener("click", (e) => {
        e.stopPropagation();
        xcardClose();
      });
      window.addEventListener("resize", placeXCard);
      // the panel came or went: the card moves to the panel's edge; on a phone the open panel covers the sheet, so the sheet closes
      burger.addEventListener("click", () => {
        if (isPhone() && panel.style.display !== "none") xcardClose();
        else placeXCard();
      });
      window.addEventListener("keydown", (e) => {
        if (e.defaultPrevented || (e.key !== "Escape" && e.key !== "Esc")) return;
        const had = xOpen;
        xcardClose();
        closeLabelCard();   // (the label's card closes with Esc too)
        if (had) e.preventDefault();
      });
      // ----- 1.0.1-L (L.27, the user: "תן לזה 15 שניות ויחזור אוטו"): a feature a PLACE switched on goes off by itself after ui_AUTO_OFF_S seconds,
      // with a small countdown on the place's button. One setTimeout + one 1 s interval per armed feature, nothing per frame. The feature's own
      // pill or opinion row cancels the timer and the user's state stays; a feature the user switched on by its pill is never armed; the pills
      // themselves are not timed; "↺ החזר הכל" and the presentation cancel the timers (ctx.ui.autoOff); an animation with its own duration is
      // exempt (feature.timed === false: the king's ascent). -----
      const AUTO = new Map();   // feature key -> { off, left, badge, timer, tick }
      const autoClear = (key) => {
        const a = AUTO.get(key);
        if (!a) return false;
        clearTimeout(a.timer);
        clearInterval(a.tick);
        if (a.badge && a.badge.parentNode) a.badge.parentNode.removeChild(a.badge);
        AUTO.delete(key);
        return true;
      };
      // PLACE_LEAVE_210 (the outside review, 14.11.2026): what the place before switched on BY ITSELF - its layer (it.layer), or its feature
      // that has no timer (feature.timed === false) - goes back when another place is chosen, unless that place asks for it too. What the
      // reader switched on himself (it was on before the place) stays; the 15-second features go back by autoOff.flush, as before.
      let leaveLayer = null, leaveFeat = null;
      const placeLeave = (it) => {
        // LEAVE_TWICE_211 (the refuter, R-03): the same place clicked twice in a row keeps what it armed at the first click - before
        // this the second click forgot it (the feature was "already on", so it passed for the reader's own) and it never went off again.
        const keepL = (leaveLayer && leaveLayer === it.layer) ? leaveLayer : null;
        const keepF = (leaveFeat && it.feature && it.feature.key === leaveFeat.key) ? leaveFeat : null;
        if (leaveLayer && !keepL) { const g = ctx.layers && ctx.layers[leaveLayer]; if (g && g.visible) setLayer(leaveLayer, false); }
        if (leaveFeat && !keepF) { try { if (leaveFeat.isOn()) leaveFeat.off(); } catch (_) {} }
        leaveLayer = keepL; leaveFeat = keepF;
        if (it.layer && !keepL) { const g = ctx.layers && ctx.layers[it.layer]; if (g && !g.visible) leaveLayer = it.layer; }
        const F = it.feature;
        if (!keepF && F && F.timed === false && typeof F.off === "function" && typeof F.isOn === "function") { try { if (!F.isOn()) leaveFeat = F; } catch (_) {} }
      };
      const autoOff = {
        seconds: ui_AUTO_OFF_S,
        arm: (key, off, btn) => {
          autoClear(key);
          const a = { off, left: ui_AUTO_OFF_S, badge: null, timer: 0, tick: 0 };
          if (btn) {
            a.badge = document.createElement("span");
            a.badge.className = "tm-cnt";
            a.badge.textContent = String(a.left);
            btn.appendChild(a.badge);
          }
          a.tick = setInterval(() => {
            a.left = Math.max(0, a.left - 1);
            if (a.badge) a.badge.textContent = String(a.left);
          }, 1000);
          a.timer = setTimeout(() => {
            autoClear(key);
            try { off(); } catch (_) {}
          }, ui_AUTO_OFF_S * 1000);
          AUTO.set(key, a);
        },
        // cancel(key): that feature's timer, cancel(): every timer; the features stay as they are
        cancel: (key) => {
          if (key != null) return autoClear(key);
          for (const k of Array.from(AUTO.keys())) autoClear(k);
          return true;
        },
        pending: () => Array.from(AUTO.keys()),   // the features now waiting for their timer (their ctx.shared keys)
        // the place's click: its feature on; a timer unless the user had it on by its own pill, or it is an animation with its own end
        run: (F, btn) => {
          if (!F || typeof F.on !== "function") return;
          const armed = AUTO.has(F.key), was = !!F.isOn();
          if (!was) F.on();
          if (F.timed !== false && typeof F.off === "function" && (!was || armed)) autoOff.arm(F.key, F.off, btn);
        },
        // "↺ החזר הכל": what the timers would have switched off goes back now, and no timer stays
        flush: () => {
          for (const [k, a] of Array.from(AUTO.entries())) {
            autoClear(k);
            try { a.off(); } catch (_) {}
          }
        }
      };
      // ----- Otzaria: open a source at book id + line index (reader.openBook, permission "reader.open"); 1.0.1-L (Part 7, U2): Otzaria only, no other site -----
      const tmToast = (msg) => {
        const t = document.getElementById("toast");
        if (!t) return;
        t.textContent = msg;
        t.classList.add("show");
        setTimeout(() => t.classList.remove("show"), 6000);
      };
      const errText = (res) => {
        if (res && res.error) return (res.error.code || "") + (res.error.message ? " – " + res.error.message : "");
        return "no result (" + JSON.stringify(res) + ")";
      };
      const okRes = (res) => !!res && res.success !== false && res.data !== false && res.data !== null && res.data !== undefined;
      const callT = (method, params, ms) => Promise.race([
        window.Otzaria.call(method, params),
        new Promise((resolve) => setTimeout(() => resolve({ success: false, error: { code: "timeout", message: method + " >" + (ms || 5000) + "ms" } }), ms || 5000))
      ]);
      // After a successful open, make sure the book's tab is the active one (the API docs do not promise that it is).
      const focusBook = async (book) => {
        try {
          const st = await callT("reader.getCurrentState", {}, 3000);
          const d = st && st.data;
          if (!d || !Array.isArray(d.openTabs)) return;
          if (d.currentId === book || d.currentBookUid === "id:" + book) return;
          const i = d.openTabs.findIndex((t) => t && !t.isSelf && (t.id === book || t.bookUid === "id:" + book));
          if (i >= 0) await callT("reader.activateTab", { index: i }, 3000);
        } catch (_) {
        }
      };
      // Open by bookUid+index (1.0.10 of the Second Temple plugin opened by numeric id and got data:false); the identifier
      // that worked is cached per book. Fallback: library.getBookMetadata gives the bookUid.
      const bookIdf = {};
      const openAt = async (book, index) => {
        const tries = [];
        if (bookIdf[book]) tries.push(bookIdf[book]);
        tries.push({ bookUid: "id:" + book }, { id: book, type: "text" }, { id: book, source: "library" });
        let last = "";
        for (const idf of tries) {
          const res = await callT("reader.openBook", Object.assign({}, idf, { index }));
          if (okRes(res)) {
            bookIdf[book] = idf;
            return "";
          }
          last = JSON.stringify(idf) + ": " + errText(res);
        }
        const md = await callT("library.getBookMetadata", { id: book });
        const d = md && md.data;
        if (d && (d.bookUid || d.bookId)) {
          const idf = d.bookUid ? { bookUid: d.bookUid } : { bookId: d.bookId };
          const res = await callT("reader.openBook", Object.assign({}, idf, { index }));
          if (okRes(res)) {
            bookIdf[book] = idf;
            return "";
          }
          last = "metadata " + JSON.stringify(idf) + ": " + errText(res);
        } else {
          last += " | getBookMetadata: " + errText(md);
        }
        return last;
      };
      // ref = {book, index} (from ui_V / ui_P / ui_MI / ui_RB / ui_MN) or a string the old tables used ("I_Kings.6.6")
      // 1.0.1-L (Part 7, U2, the user: "כל קישורי המקורות בבאנרי המידע חייבים להיות לתוכנת אוצריא ולא לספריא"): outside Otzaria, as in the shared
      // link, a click names the source and says where it opens; it never goes to another site.
      const UI_OTZ_NOTE = " — המקור נפתח בתוכנת אוצריא";
      const openSource = async (ev, label, ref) => {
        ev.preventDefault();
        ev.stopPropagation();
        let target = null;
        if (ref && typeof ref === "object" && ref.book && ref.index !== null && ref.index !== undefined) target = ref;
        else if (typeof ref === "string") target = ui_sefToOtz(ref);
        if (typeof window.Otzaria === "undefined" || !window.Otzaria.call || !target) {
          if (target) {
            // 1.0.1-L (the user: "לחצתי על מקור לפתיחה באוצריא והוא לא נפתח"): outside the plugin, Otzaria's own link: otzaria://open/book/<id>?index=<line>
            tmToast("פותח באוצריא: " + label + " (רק כשאוצריא מותקנת במחשב)");
            try {
              const go = document.createElement("a");
              go.href = "otzaria://open/book/" + encodeURIComponent(target.book) + "?index=" + encodeURIComponent(target.index);
              go.style.display = "none";
              document.body.appendChild(go);
              go.click();
              go.remove();
            } catch (_) {}
            return;
          }
          tmToast(label + UI_OTZ_NOTE);
          return;
        }
        let lastErr = "";
        tmToast("פותח באוצריא: " + label + "...");
        try {
          lastErr = await openAt(target.book, target.index);
          if (!lastErr) {
            await focusBook(target.book);
            tmToast("נפתח באוצריא: " + label);
            return;
          }
        } catch (e) {
          lastErr = "exception: " + (e && e.message ? e.message : e);
        }
        tmToast("פתיחה באוצריא נכשלה: " + label + " (" + lastErr + ")");
      };
      // source links appended to any element (1.0.1-H: used by the info box, the opinions table and the toggle rows)
      // 1.0.1-L: 57-kelim.js gives its links as specs, ["V", 10, 7, 40] / ["L", book, line]: unresolved, the place's and the vessels' links opened nothing
      const refOf = (ref0) => !Array.isArray(ref0) ? ref0 : ref0[0] === "V" ? ui_V(ref0[1], ref0[2], ref0[3]) : ref0[0] === "L" ? { book: ref0[1], index: ref0[2] } : "";
      const refLinks = (host, rs) => {
        for (const [label, ref0] of rs) {
          const ref = refOf(ref0);
          const a = document.createElement("a");
          a.href = "#";
          a.__ref = ref;   // 1.0.1-L (Part 7, U2): no address of another site; the click opens Otzaria
          a.addEventListener("click", (ev) => openSource(ev, label, ref));
          a.textContent = label;
          host.appendChild(a);
        }
      };
      // 1.0.2 (A): the linker of a card's text (ui_fillSrc's third argument) for the card's refs rs: each part of a source's bracket that
      // resolves (ui_srcParse above: the label first) becomes a link that opens it exactly as its chip does (openSource: Otzaria, or the
      // otzaria:// link outside it); the bracket keeps its small style (span.tm-src) and its words; nothing resolves -> null (a plain bracket)
      const srcLinker = (rs) => {
        const labels = [];
        let firstBook = null;
        (Array.isArray(rs) ? rs : []).forEach((r, k) => {
          if (!Array.isArray(r) || r.length < 2) return;
          const ref = refOf(r[1]);
          const t = ref && typeof ref === "object" ? ref : typeof ref === "string" ? ui_sefToOtz(ref) : null;
          if (!t || !t.book || t.index == null) return;
          labels.push({ n: ui_srcNorm(r[0]), label: String(r[0]), ref });
          if (k === 0 && UI_SRC_TN_IDS.indexOf(t.book) >= 0) firstBook = t.book;   // the card's first ref only
        });
        const byLabel = (n) => {
          for (const L of labels) if (L.n === n) return L;
          return null;
        };
        const resolve = (body, bare) => {
          const n = ui_srcNorm(body), nr = ui_srcNoRange(n);
          for (const pre of Object.keys(UI_SRC_CM)) {   // 1.7.0: a commentary's bracket goes to the commentary, not to the Mishnah chip
            if (n.indexOf(pre + " ") !== 0) continue;
            const tc = ui_srcParse(nr, bare);
            if (tc) return { label: body.trim(), ref: tc };
            break;
          }
          let L = byLabel(n) || byLabel(nr);
          if (!L) {
            for (const pre of UI_SRC_PRE) {
              if (n.indexOf(pre + " ") !== 0) continue;
              const rest = n.slice(pre.length + 1);
              L = byLabel(rest) || byLabel(ui_srcNoRange(rest));
              break;
            }
          }
          if (L) return { label: L.label, ref: L.ref };
          const t = ui_srcParse(nr, bare);
          return t ? { label: body.trim(), ref: t } : null;
        };
        return (run, full) => {
          const inner = run.t.slice(1, -1);
          const lb = ui_srcLastBook(full, run.i);
          const bare = firstBook != null && lb === firstBook ? firstBook : null;
          const sp = document.createElement("span");
          sp.className = "tm-src";
          sp.appendChild(document.createTextNode("("));
          let any = false;
          let lastName = "";   // 1.7.0: the book named in the previous part of the bracket ("ברטנורא מידות"), for a bare "ch, m" after ";"
          {   // 1.7.0 (Beit Sheni): a bare "(ב, ג)" follows the last citation before it in the card's text; with none - Mishnah Middot
            const before = ui_srcNorm(full.slice(0, run.i)), reb = /\(([^()]*)\)/g;
            let mb;
            while ((mb = reb.exec(before))) {   // the last NAMED citation wins ("(ו, ב)" after "(תמיד ג, ט)" is Tamid too)
              const first = mb[1].split(";")[0].trim(), nmb = /^(.+?) [א-ת"']{1,5}, ?[א-ת"']{1,5}$/.exec(first);
              if (nmb) lastName = nmb[1];
            }
            if (!lastName) lastName = "מידות";
          }
          inner.split(";").forEach((raw, k) => {
            if (k) sp.appendChild(document.createTextNode(";"));
            const body = raw.trim();
            const lead = raw.slice(0, raw.indexOf(body)), trail = raw.slice(raw.indexOf(body) + body.length);
            if (lead) sp.appendChild(document.createTextNode(lead));
            let hit = body ? resolve(body, bare) : null;
            const nm = /^(.+?) [א-ת"'״׳]{1,5}, ?[א-ת"'״׳]{1,5}$/.exec(ui_srcNorm(body));
            if (hit && nm) lastName = nm[1];
            else if (!hit && lastName && /^[א-ת"'״׳]{1,5}, ?[א-ת"'״׳]{1,5}$/.test(ui_srcNorm(body))) hit = resolve(lastName + " " + body, bare);
            if (hit) {
              const a = document.createElement("a");
              a.href = "#";
              a.className = "tm-srcl";
              a.__ref = hit.ref;
              a.textContent = body;
              a.addEventListener("click", (ev) => openSource(ev, hit.label, hit.ref));
              sp.appendChild(a);
              any = true;
            } else if (body) sp.appendChild(document.createTextNode(body));
            if (trail) sp.appendChild(document.createTextNode(trail));
          });
          sp.appendChild(document.createTextNode(")"));
          return any ? sp : null;
        };
      };
      // 1.0.1-L (L.34): setInfo(key | "__place", custom?, opts?) opens the explanation card: the text of the view `key` (ui_INFO / ui_REFS) or
      // the custom {text, refs}; opts.title (else the view's label), opts.anchor = the clicked button (the card's top follows it)
      const setInfo = (key, custom, opts) => {
        const text = custom ? custom.text : ui_INFO[key] || ui_INFO.__general;
        const rs = custom ? custom.refs || [] : ui_REFS[key] || ui_REFS.__general || [];
        let title = opts && opts.title;
        if (!title) {
          const v = ui_VIEWS.find((vv) => vv.key === key);
          title = v ? v.label : key === "__general" ? "מבט כללי" : "";
        }
        // 1.0.2 (item 4): the card's opinions - the table's own row, opts.ops, or the subject's rows by its view key and title
        const row = opts && opts.row ? opts.row : null;
        const ops = row ? [row] : opts && Array.isArray(opts.ops) ? opts.ops : opsFor({ view: key !== "__place" ? key : null, title: opts && opts.title });
        xcardOpen(title, text, rs, opts && opts.anchor, opts && opts.side, ops, row);
      };
      // 1.0.1 (FIXES D.3 / F.1): the outer court's items from 20-mount.js, ctx.shared.outerCourtItems = [{name, x, y, z}], matched by a
      // fragment of the (Hebrew) name; the FIXES D.2 positions are the fallback when the module did not register them: the court floor
      // y 3 (ctx.shared.newCourt.y), chambers 8 high inside the north low wall, the king's platform 1 high at x 106 / z 8, the chest
      // 1.2 high at x 224 / z 7
      const ncY = ctx.shared && ctx.shared.newCourt && typeof ctx.shared.newCourt.y === "number" ? ctx.shared.newCourt.y : 3;
      const ncCX = ctx.shared && ctx.shared.newCourt && typeof ctx.shared.newCourt.x0 === "number" && typeof ctx.shared.newCourt.x1 === "number"
        ? (ctx.shared.newCourt.x0 + ctx.shared.newCourt.x1) / 2 : 161; // the court's centre x (93.5..228.5)
      const OCI_FB = { lishkot: [161, ncY + 4, -61.5], amud: [106, ncY + 1.2, 8], aron: [224, ncY + 0.6, 7] };
      const oci = (frag, fb) => {
        const list = ctx.shared && Array.isArray(ctx.shared.outerCourtItems) ? ctx.shared.outerCourtItems : [];
        const it = list.find((o) => o && typeof o.name === "string" && o.name.indexOf(frag) >= 0 && typeof o.x === "number");
        return it ? [it.x, typeof it.y === "number" ? it.y : fb[1], typeof it.z === "number" ? it.z : fb[2]] : fb;
      };
      // the camera for such an item: the module's own (outerCourtItems[i].cam, 20-mount.js 1.0.1-K), else dist amot from it toward the
      // court's centre (so it stays inside the court) and 0.55 dist higher
      const ociCam = (frag, fb, dist) => {
        const list = ctx.shared && Array.isArray(ctx.shared.outerCourtItems) ? ctx.shared.outerCourtItems : [];
        const it = list.find((o) => o && typeof o.name === "string" && o.name.indexOf(frag) >= 0 && Array.isArray(o.cam) && o.cam.length >= 3);
        if (it && isFinite(it.cam[0] + it.cam[1] + it.cam[2])) return it.cam.slice(0, 3);
        const p = oci(frag, fb);
        const dx = ncCX - p[0], dz = 0 - p[2], L = Math.hypot(dx, dz) || 1;
        return [p[0] + dx / L * dist, p[1] + dist * 0.55, p[2] + dz / L * dist];
      };
      // (1.0.1-L: no explanation is shown at the start - the card opens on the first choice; the panel's intro line says what the lists are)
      const secViews = document.createElement("div");
      secViews.className = "sec";
      secViews.textContent = "מבטים";
      // ----- 1.0.1-L (the user: search in all the buttons): a field above the views. It filters every button of the panel by its name, without regard to nikud
      // or to quotation marks; the groups that hold a match open, the rest step aside; an empty field brings everything back as it was. Nothing per frame. -----
      {
        const wrap = document.createElement("div");
        wrap.id = "tm-search-wrap";
        const input = document.createElement("input");
        input.id = "tm-search";
        input.type = "search";
        input.placeholder = "חיפוש בכל הכפתורים...";
        input.setAttribute("aria-label", "חיפוש בכל כפתורי התוסף");
        input.autocomplete = "off";
        const none = document.createElement("div");
        none.id = "tm-search-none";
        none.textContent = "לא נמצא כפתור בשם הזה.";
        wrap.appendChild(input);
        wrap.appendChild(none);
        panel.appendChild(wrap);
        const norm = (t) => String(t || "").replace(/[\u0591-\u05C7]/g, "").replace(/[׳״'"`]/g, "").replace(/[.,:;()\-–—]/g, " ").replace(/\s+/g, " ").trim().toLowerCase();
        // 1.0.1-L (last check): the marks are dropped, not spaced ("רדק" finds רד״ק, "מלבים" מלבי״ם). Each word of the query is looked for: "מנורה" finds מנורת and המנורות,
        // "שלחן" שולחן (without ו and י, and without a word's ending, when 3 letters are left); a word of one or two letters is a whole word with its prefixes: "ים" finds הים and והים, not every plural
        const loose = (s) => s.replace(/[וי]/g, "");
        const wordHit = (txt, w) => {
          if (w.length <= 2) return (" " + txt + " ").search(new RegExp(" [והבלמשכ]{0,2}" + w.replace(/[^\p{L}\p{N}]/gu, "") + " ", "u")) >= 0;
          const l = loose(w);
          if (l.length < 3) return txt.includes(w);
          const st = l.replace(/[התםן]$/, "");
          return loose(txt).includes(st.length >= 3 ? st : l);
        };
        const textHit = (t, q) => { const n = norm(t); return q.split(" ").every((w) => wordHit(n, w)); };
        const hit = (el, q) => textHit(el.textContent, q) || textHit(el.title, q);
        // the buttons and the switches' rows; an opinion row's caption finds all its options
        const ITEMS = "button, label";
        // OPS_GROUPS_303: the name of a group of the opinions table finds all its rows
        const itemHit = (b, q) => { const op = b.closest(".tm-op"), cap = op && op.querySelector(".cap"), g = op && op.closest("details.tm-opg"), gs = g && g.querySelector("summary"); return hit(b, q) || (!!cap && hit(cap, q)) || (!!gs && hit(gs, q)); };
        let savedTop = 0;
        let saved = null;  // the state before the search: the blocks' display and the groups' open
        const run = () => {
          const q = norm(input.value);
          const kids = Array.from(panel.children).filter((c) => c !== wrap);
          if (!q) {
            if (saved) {
              for (const [el, st] of saved) {
                el.style.display = st.display;
                if (st.open !== undefined) el.open = st.open;
              }
              saved = null;
            }
            for (const b of panel.querySelectorAll(ITEMS)) b.style.display = b.dataset.tmHid ? b.dataset.tmHid === "x" ? "" : b.dataset.tmHid : b.style.display, delete b.dataset.tmHid;
            none.style.display = "none";
            panel.scrollTop = savedTop;
            return;
          }
          if (!saved) {
            savedTop = panel.scrollTop;
            saved = new Map();
            for (const el of Array.from(panel.querySelectorAll("*"))) if (el.tagName === "DETAILS" || el.parentNode === panel) saved.set(el, { display: el.style.display, open: el.tagName === "DETAILS" ? el.open : undefined });
            saved.delete(wrap);
          }
          let total = 0;
          for (const b of panel.querySelectorAll(ITEMS)) {
            if (b.dataset.tmHid === undefined) b.dataset.tmHid = b.style.display || "x";
            const ok = itemHit(b, q);
            b.style.display = ok ? b.dataset.tmHid === "x" ? "" : b.dataset.tmHid : "none";
            if (ok) total++;
          }
          for (const el of kids) {
            const has = (el.tagName === "LABEL" && el.style.display !== "none") || (!!el.querySelector && Array.from(el.querySelectorAll(ITEMS)).some((b) => b.style.display !== "none"));
            el.style.display = has ? (saved.get(el) ? saved.get(el).display : "") : "none";
            if (el.tagName === "DETAILS" && has) el.open = true;
          if (has && el.tagName !== "DETAILS" && el.tagName !== "LABEL") {
            for (const c of Array.from(el.children)) {
              if (!saved.has(c)) saved.set(c, { display: c.style.display });
              if (c.tagName === "BUTTON" || c.tagName === "LABEL") continue;
              const show = Array.from(c.querySelectorAll(ITEMS)).some((b) => b.style.display !== "none");
              c.style.display = show ? saved.get(c).display : "none";
            }
          }
          }
          // OPS_GROUPS_303: a group inside a group (the groups of the opinions table) opens when it holds a match and steps aside
          // when it holds none; a row of the table without a match steps aside too (its caption alone was left). saved: back
          for (const d of panel.querySelectorAll("details details")) {
            if (!saved.has(d)) saved.set(d, { display: d.style.display, open: d.open });
            const has = Array.from(d.querySelectorAll(ITEMS)).some((b) => b.style.display !== "none");
            d.style.display = has ? saved.get(d).display : "none";
            if (has) d.open = true;
          }
          for (const r of panel.querySelectorAll("#tm-ops .tm-op")) {
            if (!saved.has(r)) saved.set(r, { display: r.style.display });
            r.style.display = Array.from(r.querySelectorAll(ITEMS)).some((b) => b.style.display !== "none") ? saved.get(r).display : "none";
          }
          none.style.display = total ? "none" : "block";
        };
        input.addEventListener("input", run);
        // typing in the field never moves the camera or presses the model's keys; Esc clears it
        input.addEventListener("keydown", (e) => {
          e.stopPropagation();
          if (e.key === "Escape" || e.key === "Esc") {
            input.value = "";
            run();
          }
        });
        input.addEventListener("keyup", (e) => e.stopPropagation());
      }
      panel.appendChild(secViews);
      const grid = document.createElement("div");
      grid.id = "tm-views";
      panel.appendChild(grid);
      // 1.1.0: after the merges (UI_VIEW_HOME) the grid keeps "מבט כללי" alone - no "מבטים" header, one wide button
      setTimeout(() => {
        if (grid.children.length <= 1) {
          secViews.style.display = "none";
          grid.classList.add("one");
        }
      }, 0);

      // ===== Holy of Holies: cloud + confirmation before it is revealed =====
      const KKF = LVL.HEI;
      const dc = ctx.shared.devirCenter;
      const KKC = dc && typeof dc.x === "number" ? { x: dc.x, y: dc.y, z: dc.z } : { x: -54, y: 22, z: 0 }; // SPEC 7: devir centre
      const cloud = new Group();
      cloud.name = "tm-kk-cloud";
      uiGroup.add(cloud);
      const cloudMat = new MeshLambertMaterial({ color: 15856631, emissive: 5593704, transparent: true, opacity: 0.96 });
      const IcoGeo = (ctx.THREE && ctx.THREE.IcosahedronGeometry) || (typeof IcosahedronGeometry !== "undefined" ? IcosahedronGeometry : null);
      const cloudGeo = IcoGeo ? new IcoGeo(1, 3) : new SphereGeometry(1, 10, 8);
      {
        let seed = 7;
        const rnd = () => (seed = seed * 16807 % 2147483647) / 2147483647;
        // the devir is 20 x 20 x 20 (I Kings 6:20), built 19 clear because the amah traksin is taken from it (user's decision, 10-core.js
        // CO.xDevirE / xDevirW): interior x -63.5..-44.5, z +-10, y 12..32, and its aliyah above (y 33..42).
        // The WHOLE cloud (puff centre + scaled radius + the 0.7 / 0.5 sway of the animation below) stays inside x/z +-9 around
        // the centre and y 13..31.5 (1.2.2; was 41), so no puff pokes through the traksin into the kodesh, through the side walls or through the
        // west wall into the ta'im. Smaller puffs than 1.0.19, hence more of them (shared geometry: still cheap).
        // 1.2.2 (the scan): the puffs stay under the devir's own ceiling (F + 20, 50-heichal.js sec. 8) - they rose to 41, into the gold room
        // above the devir, which has its own button now
        const HALF = 9, Y0 = KKF + 1, Y1 = KKF + 19.5, SWAY = 0.7, SWAY_Y = 0.5;
        for (let i = 0; i < 72; i++) {
          const pf = new Mesh(cloudGeo, cloudMat);
          const r = 3 + rnd() * 2;                              // scaled radius 3.45..5.75 in x/z, 2.7..4.5 in y
          pf.scale.set(r * 1.15, r * 0.9, r * 1.15);
          const sp = Math.max(0, HALF - r * 1.15 - SWAY);       // allowed centre spread in x/z for this puff
          const hy = r * 0.9 + SWAY_Y;                          // vertical half-extent incl. the sway
          pf.position.set(
            KKC.x + (rnd() - 0.5) * 2 * sp,
            Y0 + hy + rnd() * Math.max(0, Y1 - Y0 - 2 * hy),
            KKC.z + (rnd() - 0.5) * 2 * sp
          );
          pf.userData.noPick = true;
          pf.userData.base = pf.position.clone();
          pf.userData.ph = rnd() * 6.28;
          cloud.add(pf);
        }
      }
      let cloudOn = true, cloudTarget = 0.96, cloudSeenNear = false;
      const setCloud = (on) => {
        cloudOn = on;
        cloudTarget = on ? 0.96 : 0;
        if (on) cloud.visible = true;
        else cloudSeenNear = false;
      };
      // A camera position/target inside this box counts as "inside the devir" (1.0.19 logic: fly() tests pos and target).
      // SPEC 9.7 gives x -66..-42, z +-12, y 14..44 - but -42 lies 1.5 amot EAST of the traksin's kodesh face (x -43.5), so every
      // kodesh-side spot in front of the traksin (the chains, the traksin, the parochet, the devir door) would pop the
      // Holy-of-Holies confirmation and not fly on "ביטול". The east bound is therefore the devir's east face, CO.xDevirE
      // (-44.5 = the traksin's devir side): only a camera/target really inside the devir (or its aliyah) asks. Rest as in the SPEC.
      const KK_E = CO && typeof CO.xDevirE === "number" ? CO.xDevirE : -44.5;
      const inKK = (p) => p && p[0] > -66 && p[0] < KK_E && p[2] > -12 && p[2] < 12 && p[1] > 14 && p[1] < 44;
      const cf = document.createElement("div");
      cf.id = "tm-confirm";
      cf.innerHTML = '<div class="box"><div class="t">קודש הקדשים</div><div class="m">קודש הקדשים מכוסה בענן מפני כבוד המקום. להסיר את הענן ולהציג את פנים החדר?</div><div class="b"><button class="y">הסר את הענן</button><button class="n">ביטול</button></div></div>';
      document.body.appendChild(cf);
      let cfYes = null, cfNo = null;
      const closeConfirm = () => {
        cf.style.display = "none";
        cfYes = cfNo = null;
        // 1.0.1-K: the focus given to the dialog's button goes back to the page (else the arrow keys stay blocked on a hidden button)
        try {
          const ae = document.activeElement;
          if (ae && cf.contains && cf.contains(ae) && typeof ae.blur === "function") ae.blur();
        } catch (_) {
        }
      };
      cf.querySelector(".y").addEventListener("click", () => {
        const f = cfYes;
        closeConfirm();
        if (f) f();
      });
      cf.querySelector(".n").addEventListener("click", () => {
        const f = cfNo;
        closeConfirm();
        if (f) f();
      });
      const askRemoveCloud = (onYes, onNo) => {
        cfYes = onYes;
        cfNo = onNo || null;
        cf.style.display = "flex";
        // 1.0.1-K (the presentation's request, review UX1): Enter answers the dialog itself ("הסר את הענן")
        try {
          cf.querySelector(".y").focus();
        } catch (_) {
        }
      };
      // 1.0.1-K: the dialog answered from outside (the presentation): "ביטול" runs the pending "no", closeConfirm drops both
      const cancelConfirm = () => {
        if (cf.style.display !== "flex") return;
        const f = cfNo;
        closeConfirm();
        if (f) f();
      };
      // 1.0.1-K: the cloud's pill is an entry of the on-model buttons' registry (see "on-model buttons" below); this block decides when
      // it is seen (cloudSeen.show) and its size (cloudSeen.scale): when the cloud (or, while it is off, its place) is seen at a
      // reasonable size and nothing solid hides it (1.0.17 / 1.0.19 logic); while it is off the pill offers "☁ החזר את הענן" (the cloud
      // also comes back by itself once the camera has been near it and goes more than 75 amot away, as before)
      const cloudSeen = { show: false, scale: 1 };
      {
        const cv = new Vector3();
        // 1.0.19: the "remove cloud" button must appear only while the cloud is really seen: besides its size on screen we
        // cast a ray from the camera to the cloud centre and hide the button when a visible, not-faded solid is in the way
        // (e.g. standing in the court: the house walls hide the cloud). Throttled; targets are cached for a few seconds.
        const cRay = new Raycaster(), cDir = new Vector3();
        let cTargets = null, cTargetsAt = 0, cFrame = 0, cClear = true;
        const underCloud = (o) => {
          for (; o; o = o.parent) if (o === cloud || o.name === "tm-measure") return true;
          return false;
        };
        const isVis = (o) => {
          for (; o; o = o.parent) if (o.visible === false) return false;
          return true;
        };
        const solidEnough = (o) => {
          const m = Array.isArray(o.material) ? o.material[0] : o.material;
          return !m || m.visible === false || (m.transparent ? m.opacity > 0.5 : true);
        };
        const cloudClear = (cam, d) => {
          const now = performance.now();
          if (!cTargets || now - cTargetsAt > 4000) {
            cTargets = [];
            cTargetsAt = now;
            // 1.0.1-H (performance, the user: "נתקע"): only plain meshes of some size can hide the cloud - the walls, ceilings, roofs and
            // the court walls; instanced meshes (knobs, chains, reliefs, pillars: a raycast tests every instance) and small parts are skipped
            const bb = new Box3(), sz = new Vector3();
            ctx.scene.traverse((o) => {
              if (!o.isMesh || o.isInstancedMesh || !o.geometry || underCloud(o)) return;
              const pa = o.geometry.attributes && o.geometry.attributes.position;
              if (pa && pa.count > 30000) return; // skip the terrain: it never hides the cloud
              if (!o.geometry.boundingBox) o.geometry.computeBoundingBox();
              bb.copy(o.geometry.boundingBox).applyMatrix4(o.matrixWorld).getSize(sz);
              if (Math.max(sz.x, sz.y, sz.z) < 6) return;   // a part smaller than 6 amot in every direction never hides the 30-amah cloud
              cTargets.push(o);
            });
          }
          cDir.set(KKC.x - cam.x, KKC.y - cam.y, KKC.z - cam.z).normalize();
          cRay.set(cam, cDir);
          cRay.near = 0;
          cRay.far = Math.max(1, d - 3);
          for (const h of cRay.intersectObjects(cTargets, false)) {
            if (isVis(h.object) && solidEnough(h.object)) return false;
          }
          return true;
        };
        const kkP = [0, 0, 0];   // 1.0.4: the orbit into the cloud (below)
        let kkAsked = false, kkRel = 0;
        ctx.renderer.domElement.addEventListener("pointerdown", () => { kkRel = Infinity; });
        window.addEventListener("pointerup", () => { if (kkRel === Infinity) kkRel = performance.now(); }, true);
        window.addEventListener("pointercancel", () => { if (kkRel === Infinity) kkRel = performance.now(); }, true);
        ctx.animated.push(function(t) {
          const cam = ctx.camera.position;
          const dist = Math.hypot(cam.x - KKC.x, cam.y - KKC.y, cam.z - KKC.z);
          const k = 0.0004 * t;
          cloud.children.forEach((pf) => {
            const b = pf.userData.base, ph = pf.userData.ph;
            pf.position.set(b.x + Math.sin(k + ph) * 0.7, b.y + Math.cos(k * 0.8 + ph) * 0.5, b.z + Math.sin(k * 0.6 + ph * 1.3) * 0.7);
          });
          if (Math.abs(cloudMat.opacity - cloudTarget) > 4e-3) cloudMat.opacity += (cloudTarget - cloudMat.opacity) * 0.08;
          if (!cloudOn && cloudMat.opacity < 0.03) cloud.visible = false;
          if (!cloudOn) {
            if (dist < 50) cloudSeenNear = true;
            else if (cloudSeenNear && dist > 75) setCloud(true);
          }
          // 1.0.4: the orbit round a thing one flew to (ctx.camPass, 90-entry.js; Moses' menorah stands 1.5 amot before the devir) takes the camera through the
          // devir's wall into the cloud: once the drag is let go (kkRel, 400 ms), the question a flight into the devir asks (askRemoveCloud) - once each time the
          // camera goes in; "ביטול" leaves the cloud, and the camera where it is
          kkP[0] = cam.x;
          kkP[1] = cam.y;
          kkP[2] = cam.z;
          if (!inKK(kkP)) kkAsked = false;
          else if (cloudOn && !kkAsked && cf.style.display !== "flex" && performance.now() - kkRel > 400 && typeof ctx.camPass === "function" && ctx.camPass()) {
            kkAsked = true;
            askRemoveCloud(() => setCloud(false));
          }
          let show = false;
          // 1.0.17: the button appears only while the cloud is actually seen at a reasonable size on screen,
          // and its size is proportional to the cloud's apparent size (clamped).
          // 1.0.1-K: with the cloud off, the pill (then "החזר את הענן") appears where the cloud's would: the devir seen at a reasonable size
          const seenOn = cloudOn && cloud.visible && cloudMat.opacity > 0.3;
          if (seenOn || !cloudOn) {
            cv.set(KKC.x, KKC.y, KKC.z).project(ctx.camera);
            const fovT = Math.tan((ctx.camera.fov || 50) * Math.PI / 360);
            const cloudPx = 30 / (2 * Math.max(1, dist) * fovT) * window.innerHeight; // the cloud is ~30 amot tall
            const onScreen = cv.z < 1 && Math.abs(cv.x) < 0.95 && Math.abs(cv.y) < 0.95 && cloudPx >= 90;
            if (onScreen) {
              if ((cFrame++ & 31) === 0) {   // 1.0.1-H: every 32nd frame (was 8): the ray test is the one periodic cost while the cloud is seen
                try {
                  cClear = cloudClear(cam, dist);
                } catch (_) {
                  cClear = false;
                }
              }
            } else {
              cClear = false;
            }
            if (cClear && onScreen) {
              cloudSeen.scale = Math.min(1.6, Math.max(0.7, cloudPx / 300));
              show = true;
            }
          }
          cloudSeen.show = show;
        });
      }

      // ===== measuring tool: click two points on the model (1.0.17: red line with white outline) =====
      const mGroup = new Group();
      mGroup.name = "tm-measure";
      ctx.scene.add(mGroup);
      const mOut = document.createElement("div");
      mOut.id = "tm-measure-out";
      document.body.appendChild(mOut);
      let mOn = false, mPts = [];
      const mRay = new Raycaster(), mNdc = new Vector2();
      const mClear = () => {
        while (mGroup.children.length) {
          const c = mGroup.children.pop();
          if (c.geometry) c.geometry.dispose();
          if (c.material) c.material.dispose();
        }
        mPts = [];
      };
      const mSay = (txt) => {
        mOut.textContent = txt;
        mOut.style.display = txt ? "block" : "none";
      };
      const mPick = (ev) => {
        const el = ctx.renderer.domElement, r = el.getBoundingClientRect();
        mNdc.set((ev.clientX - r.left) / r.width * 2 - 1, -((ev.clientY - r.top) / r.height) * 2 + 1);
        mRay.setFromCamera(mNdc, ctx.camera);
        // MEASURE_300 (the user, 18.11.2026: "לפעמים אני שם נקודה על נקודה, והוא לא באמת מציג את הנקודה"): a point is put only on what
        // is drawn - not on a surface nearer than the camera's near plane (it is not drawn), not on a face that a clipping plane cuts
        // away (the live section: its meshes stay whole, only their drawing is cut), and for a mesh of several materials, by the
        // material of the face that was hit
        mRay.near = ctx.camera.near || 0;
        mRay.far = Infinity;
        for (const h of mRay.intersectObjects(ctx.root.children, true)) {
          const o = h.object;
          if (o.isSprite || o.isLine || o.isPoints || o.userData.noPick) continue;
          let vis = true;
          for (let p = o; p; p = p.parent) if (!p.visible) {
            vis = false;
            break;
          }
          if (!vis) continue;
          const mt0 = o.material, mt = Array.isArray(mt0) ? mt0[(h.face && h.face.materialIndex) || 0] : mt0;
          if (mt && (mt.opacity < 0.5 || mt.visible === false)) continue;
          if (mt && Array.isArray(mt.clippingPlanes) && mt.clippingPlanes.some((pl) => pl && pl.distanceToPoint(h.point) < -1e-4)) continue;
          return h.point.clone();
        }
        return null;
      };
      const M_RED = 0xe53935, M_WHITE = 0xffffff, M_Y = new Vector3(0, 1, 0);
      const mPiece = (geo, color, order, kind, f) => {
        const m = new Mesh(geo, new MeshBasicMaterial({ color, depthTest: false, transparent: true }));
        m.renderOrder = order;
        m.userData.noPick = true;
        m.userData.mk = { kind, f };
        mGroup.add(m);
        return m;
      };
      const mMark = (p) => {
        mPiece(new SphereGeometry(1, 16, 12), M_WHITE, 998, "dot", 0.0085).position.copy(p);
        mPiece(new SphereGeometry(1, 16, 12), M_RED, 999, "dot", 0.006).position.copy(p);
      };
      const mLine = (a, b) => {
        const len = a.distanceTo(b);
        if (len < 1e-6) return;
        const dirv = new Vector3().subVectors(b, a).normalize();
        for (const [col, ord, f] of [[M_WHITE, 996, 0.0045], [M_RED, 997, 0.0028]]) {
          const c = mPiece(new CylinderGeometry(1, 1, 1, 12, 1, true), col, ord, "line", f);
          c.position.copy(a).add(b).multiplyScalar(0.5);
          c.quaternion.setFromUnitVectors(M_Y, dirv);
          c.userData.mk.len = len;
        }
      };
      ctx.animated.push(function() {
        const cp = ctx.camera.position;
        for (const m of mGroup.children) {
          const mk = m.userData.mk;
          if (!mk) continue;
          const r = Math.max(0.02, cp.distanceTo(m.position) * mk.f);
          if (mk.kind === "dot") m.scale.set(r, r, r);
          else m.scale.set(r, mk.len, r);
        }
      });
      const mHint = "מדידה: לחץ על שתי נקודות במודל";
      const mSet = (on) => {
        mOn = on;
        document.body.classList.toggle("tm-measuring", on);
        ctx.renderer.domElement.style.cursor = "";   // 1.0.1-K (review UI-H2-6): a label's hand must not hide the crosshair
        mClear();
        mSay(on ? mHint : "");
        const b = document.getElementById("tm-nav-ruler");
        if (b) b.classList.toggle("on", on);
      };
      {
        const el = ctx.renderer.domElement;
        let down = null;
        el.addEventListener("pointerdown", (e) => {
          down = { x: e.clientX, y: e.clientY, t: performance.now() };
        });
        el.addEventListener("pointerup", (e) => {
          if (e.__tmSynthetic) {   // 1.0.1-H: the release synthesized by 90-entry.js's pointer safety is not a click
            down = null;
            return;
          }
          if (!mOn || !down) return;
          const d = Math.hypot(e.clientX - down.x, e.clientY - down.y), dt = performance.now() - down.t;
          down = null;
          if (d > 6 || dt > 600) return;
          const p = mPick(e);
          if (!p) return;
          if (mPts.length >= 2) mClear();
          mPts.push(p);
          mMark(p);
          if (mPts.length === 1) {
            mSay("נקודה ראשונה סומנה — לחץ על נקודה שנייה");
          } else {
            const a = mPts[0], b = mPts[1];
            mLine(a, b);
            const dist = a.distanceTo(b), dh = Math.hypot(b.x - a.x, b.z - a.z), dy = Math.abs(b.y - a.y);
            mSay("מרחק: " + dist.toFixed(2) + " אמות  ·  אופקי " + dh.toFixed(2) + "  ·  גובה " + dy.toFixed(2) + "  (לחיצה נוספת — מדידה חדשה)");
          }
        });
      }
      // ===== flying =====
      const realFly = typeof ctx.flyTo === "function" ? ctx.flyTo : function() {
      };
      const fly = function(pos, tgt, dur) {
        if (cloudOn && (inKK(pos) || inKK(tgt))) {
          askRemoveCloud(() => {
            setCloud(false);
            realFly(pos, tgt, dur);
          });
          return;
        }
        realFly(pos, tgt, dur);
      };
      const fps = ctx.shared && ctx.shared.flyPoints ? ctx.shared.flyPoints : {};
      // The fly point of a key: the module's registration, or (for the Sea) the current placement, or the SPEC fallback.
      const resolveFp = (key) => {
        if (key === "__general") return ui_GENERAL;
        if (key === "yam" || key === "yamOxen") {   // 1.0.1-K: the oxen's view follows the placement too (45-vessels.js oxenFlyPoint)
          const sp = ctx.shared.seaPlacement;
          const fn = sp && (key === "yam" ? sp.flyPoint : sp.oxenFlyPoint);
          if (typeof fn === "function") {
            try {
              const f = fn.call(sp);
              if (f && Array.isArray(f.pos) && Array.isArray(f.target)) return f;
            } catch (_) {
            }
          }
          if (key === "yamOxen") {
            const fo = fps.yamOxen;
            return fo && Array.isArray(fo.pos) && Array.isArray(fo.target) ? fo : null;
          }
          const f0 = fps.yam;
          if (f0 && Array.isArray(f0.pos) && Array.isArray(f0.target)) return f0;
          // 1.0.1-L (L.7): the fallback as 45-vessels.js's flyPoint: from the court's side of the corner (x + 40 would stand outside the east wall)
          const z = sp && sp.current === "radak" ? CO.seaZ : CO.seaZRashi, s = z < 0 ? 1 : -1;
          return { pos: [CO.seaX - 18, LVL.AZ + 30, z + s * 20], target: [CO.seaX - 1, LVL.AZ + 3, z + s] };
        }
        const f = fps[key];
        if (f && Array.isArray(f.pos) && Array.isArray(f.target)) return f;
        return ui_FP[key] || null;
      };
      // 1.0.1-K (the user: "כפתור להסרה ולא הסרה אוט'"; "כברירת מחדל ההיכל צריך להיות סגור מכל צדדיו ורק עם כפתור להסרה"): navigation
      // never opens anything. 1.0.1 opened the cutaway / the chambers / the ulam / the boards automatically for the views and places that
      // carried interior / yatzia / ulam / boards / in; those flags stay in ui_VIEWS and PLACES as data only, the interior views look
      // from cameras inside the closed house (55-interior.js), and the removals are the on-model pills. applyCut / applyOpen stay in
      // ctx.ui as no-ops for older callers.
      const applyCut = function() {};
      const applyOpen = function() {};
      // the removals by id (the pills, "↺ החזר הכל" and ctx.ui.removals use these)
      const REMOVALS = {
        house: { list: () => ctx.cutaway, isOn: () => cutOn, set: (on) => setCutaway(on) },
        yatzia: { list: () => ctx.yatziaCut, isOn: () => yatziaOpen, set: (on) => setYatziaCut(on) },
        ulam: { list: () => ctx.ulamCut, isOn: () => ulamOpen, set: (on) => setUlamCut(on) },
        boards: { list: () => ctx.forestBoardsCut, isOn: () => boardsOff, set: (on) => setBoardsOff(on) }
      };
      // ===== opinion switches shared by the places and the toggles =====
      let seaRow = null, layoutRow = null, opinionRow = null, ulamTablesRow = null, throneRow = null;
      const pickSea = (key) => {
        const sp = ctx.shared.seaPlacement;
        if (sp && typeof sp.set === "function") {
          try {
            sp.set(key);
          } catch (_) {
          }
        }
        if (seaRow) seaRow.mark(key);
      };
      const pickLayout = (key) => {
        const kl = ctx.shared.kodeshLayout;
        if (kl && typeof kl.set === "function") {
          try {
            kl.set(key);
          } catch (_) {
          }
        }
        if (layoutRow) layoutRow.mark(key);
      };
      const pickOpinion = (key) => {
        const ko = ctx.shared.kodeshOpinion;
        if (ko && typeof ko.set === "function") {
          try {
            ko.set(key);
          } catch (_) {
          }
        }
        if (opinionRow) opinionRow.mark(key);
      };
      // the ark line (even shetiya, ark, great cherubim) in the WEST part of the devir: x -58.5 (Rambam Beit HaBechira 4:1 "במערבו"; SPEC 7),
      // read from 55-interior.js (ctx.shared.arkX) so the place targets follow the model
      const arkX = () => (ctx.shared && typeof ctx.shared.arkX === "number" ? ctx.shared.arkX : -58.5);
      // model numbers for the place targets and the EXTRAS texts, read from the model instead of retyped literals: the laver / bases
      // row and the Sea from ctx.CO (10-core.js, SPEC 2), Yachin and Boaz from 50-heichal.js (ctx.shared.heichal.pillars)
      // 1.0.1-L (L.77): the block of bases from the model (45-vessels.js ctx.shared.mechona.block: its columns, its rows, Moses' laver), else from CO
      const blk = (ctx.shared.mechona && ctx.shared.mechona.block) || null;
      const blkLaver = blk && Array.isArray(blk.laver) ? blk.laver : null;
      const rowX = blkLaver ? blkLaver[0] : typeof CO.kiyorX === "number" ? CO.kiyorX : 30;   // Moses' laver, between the two rows of bases
      const kz = blkLaver ? blkLaver[1] : Array.isArray(CO.mechZ) && CO.mechZ.length ? CO.mechZ.reduce((s, v) => s + v, 0) / CO.mechZ.length : 39;
      const blkRows = blk && Array.isArray(blk.rows) && blk.rows.length > 1 ? blk.rows : Array.isArray(CO.mechZ) && CO.mechZ.length > 1 ? CO.mechZ : [33, 45];
      const blkCols = blk && Array.isArray(blk.cols) && blk.cols.length > 1 ? blk.cols : [21, 25.5, 30, 34.5, 39];
      const ulamE = typeof CO.xUlamE === "number" ? CO.xUlamE : 18.5;     // the outer face of the ulam's front wall
      const seaXm = typeof CO.seaX === "number" ? CO.seaX : 80;           // the Sea's axis, in the court's corner (L.7)
      const courtE = ctx.shared.innerCourt && typeof ctx.shared.innerCourt.x1 === "number" ? ctx.shared.innerCourt.x1 : 91;   // the inner face of the court's east wall
      const houseE = typeof CO.xHouseE === "number" ? CO.xHouseE : 2.5;   // east face of the house wall = the hall's west wall
      const pil = (ctx.shared.heichal && ctx.shared.heichal.pillars) || { x: 6.08, z: 7.17 }; // Yachin / Boaz centres (1.0.1-L, L.6: x 6.08, z +-7.17 - the capital 0.02 from the doorposts and the side walls)
      const ulamDoor = (ctx.shared.heichal && ctx.shared.heichal.ulamDoor) || { w: 10, h: 22, x: [12.5, 18.5], y: [12, 34] };   // 1.0.1-L (L.59; heichal-door.md)
      // ===== views grid =====
      const btns = [];
      const placeBtns = [];
      const viewBtnByKey = {};   // 1.0.1-H: for the presentation (ctx.ui.viewButton)
      const placeBtnByT = {}, placeItemByT = {};   // 1.0.1-J: places by title (ctx.ui.placeButton / ctx.ui.place)
      for (const v of ui_VIEWS) {
        if (!resolveFp(v.key)) continue;
        const b = document.createElement("button");
        b.type = "button";
        b.textContent = v.label;
        viewBtnByKey[v.key] = b;
        b.addEventListener("click", () => {
          try {
            if (v.layer) setLayer(v.layer, true);
            // VIEW_LEAVE_211 (the function review, F1-04 / F2-02): a view button did not put back what the place before it had switched on by
            // itself - the tower of "העליות", the officers, the golden stands stayed over "מבט כללי" for good. It does now what a place's
            // click and a chip do (CHIP_CLOSEAUTO_211).
            try { autoOff.flush(); } catch (_) {}
            try { if (typeof ctx.shared.closeAuto === "function") ctx.shared.closeAuto(); } catch (_) {}
            try { placeLeave({}); } catch (_) {}
            // 1.0.1-K: no automatic removal (v.interior / v.yatzia / v.ulam are data only)
            const fp = resolveFp(v.key);
            if (fp) fly(fp.pos, fp.target);
          } catch (_) {
          }
          setInfo(v.key, null, { title: v.label, anchor: b });   // 1.0.1-L (L.34): in the floating card
          hidePanelOnPhone();
          for (const o of btns) o.classList.remove("on");
          for (const o of placeBtns) o.classList.remove("on");
          b.classList.add("on");
          closeCard();   // 1.0.1-K: a new view closes the label's card (defined with the labels below; the click comes after buildUI)
        });
        grid.appendChild(b);
        btns.push(b);
      }
      if (btns.length) btns[0].classList.add("on");
      // ===== places accordion (SPEC 9.5): item = {t, tg, cam, info, refs, layer?, action?, view?, key?} =====
      // tg / cam may be functions (resolved at click time); view = a fly point key (resolveFp); action = a model feature switched on
      // with the place (1.0.1-K: the yatzia section, the wall / altar layers, the base's demo and its exploded view - FEATURES the user
      // asks to see, never one of the four removals; each has its own "off" on the model and in "↺ החזר הכל"). The 1.0.1 flags in /
      // yatzia / ulam / boards are gone: navigation never opens anything (1.0.1-K).
      const V = ui_V, P = ui_P, MI = ui_MI, RB = ui_RB, MN = ui_MN;
      // 1.0.1-L (Part 7, U4, the user: "כפתור מקום הים אמור להראות ממבט מלמעלה את המיקום ולא מקרוב"): from above, the court's corner in the frame; follows the reading.
      // Model choice: the Sea's side comes from its own fly point's target. The panel's width is why the target stands east of the Sea's middle.
      const uiSeaSide = () => {
        const sp = ctx.shared.seaPlacement;
        try { const f = sp && sp.flyPoint && sp.flyPoint(); if (f && f.target) return f.target[2] < 0 ? -1 : 1; } catch (_) {}
        return -1;
      };
      const uiSeaCam = () => { const k = uiSeaSide(); return [66, 118, k * 22]; };
      const uiSeaTg = () => { const k = uiSeaSide(); return [72, 6, k * 48]; };
      // 1.0.1-L (L.85; part5-house.md FOR-UI 2, 3)
      const UI_ARK_REFS = [["מלכים א ח, ט", V(10, 8, 9)], ["רד״ק שם", { book: 3540, index: 544 }], ["רלב״ג שם", { book: 3645, index: 335 }], ["מלבי״ם שם", { book: 3394, index: 445 }], ["בבא בתרא יד.", { book: 124, index: 369 }], ["בבא בתרא יד:", { book: 124, index: 381 }], ["מנחות צט.", { book: 131, index: 3535 }], ["רש״י בבא בתרא יד:", { book: 2178, index: 585 }], ["יומא נב:", { book: 107, index: 1344 }], ["שמואל א ו, ח", { book: 8, index: 133 }], ["שמות טז, לג", V(2, 16, 33)], ["במדבר יז, כג", V(4, 17, 23)]];
      const PN = (ctx.shared && ctx.shared.palaceNotes) || {};          // 60-palace.js's Hebrew notes (K.6), with their sources
      // 1.0.1-L (L.57, L.81; palace-2.md): the sources of the throne and of its versions - the verses, the commentators and the midrashim (book : line in the DB)
      const TH_V = [["מלכים א י, יח", V(10, 10, 18)], ["י, יט", V(10, 10, 19)], ["י, כ", V(10, 10, 20)], ["דברי הימים ב ט, יז", V(39, 9, 17)], ["ט, יח", V(39, 9, 18)], ["ט, יט", V(39, 9, 19)]];
      const TH_REFS = {
        pesukim: TH_V.concat([["רש״י י, יט", { book: 3673, index: 610 }], ["רד״ק י, יט", { book: 3540, index: 683 }], ["מצודת דוד י, יט", { book: 3345, index: 939 }], ["רלב״ג י, יט", { book: 3645, index: 462 }], ["מלבי״ם י, יט", { book: 3394, index: 624 }], ["תרגום יונתן י, יט", { book: 3206, index: 391 }], ["אברבנאל י, יח–כ", { book: 3574, index: 563 }], ["רש״י דברי הימים ב ט, יט", { book: 3662, index: 354 }], ["מצודת דוד דברי הימים ב ט, יח", { book: 3318, index: 493 }]]),
        targumSheni: [["תרגום שני לאסתר א, ב", { book: 3237, index: 13 }], ["מלכים א י, יט", V(10, 10, 19)], ["רש״י דברי הימים ב ט, יט", { book: 3662, index: 354 }]],
        estherRabbah: [["מהרז״ו על אסתר רבה", { book: 3117, index: 76 }], ["מתנות כהונה", { book: 3099, index: 151 }], ["יפה ענף", { book: 3079, index: 120 }], ["עץ יוסף", { book: 3086, index: 290 }], ["אסתר רבה א, יב", { book: 264, index: 25 }], ["פנים אחרים נוסח ב", { book: 274, index: 116 }], ["מדרש אבא גוריון א", { book: 274, index: 6 }], ["במדבר רבה יב, יז", { book: 259, index: 222 }], ["פסיקתא דרב כהנא א, ז", { book: 277, index: 8 }], ["מלכים א י, יט", V(10, 10, 19)]],
        beitHamidrash: [["בית המדרש ב (דמות כסא שלמה)", { book: 7924, index: 8 }], ["ענין כסא שלמה", { book: 7958, index: 4 }], ["מלכים א י, יט", V(10, 10, 19)]]
      };
      const nf = (v) => String(+(+v).toFixed(2));                        // a model number for a text (no float tails)
      const fhCur = () => (ctx.shared.forestHouse && ctx.shared.forestHouse.current) || "rashi";
      const mech = () => (ctx.shared && ctx.shared.mechona) || null;
      // the features of the build tracks (FIXES-1.0.1-K.md 0.5f), each guarded: a missing one only skips its switch
      const feat = {
        section: () => { const s = ctx.shared.yatziaSection; if (s && typeof s.set === "function") s.set(true); },
        wallLayers: () => { const w = ctx.shared.wallLayers; if (w && typeof w.set === "function") w.set(true); },
        altarLayers: () => { const a = ctx.shared.incenseAltar; if (a && a.layers && typeof a.layers.set === "function") a.layers.set(true); },
        // 1.0.1-K review (vessels-3): the base back in its place at once when the demonstration is running (or still driving home; 1.0.1-L: the pills on the base start it):
        // "המכונות מקרוב" frames its home spot (flyPoints.mechonaClose), and after the demonstration the
        // base kept looping round the court, mostly out of the view (headless: 8 amot from home 1 s after the click)
        park: () => { const m = mech(); if (m && m.demo && typeof m.demo.reset === "function" && !m.demo.home) m.demo.reset(); },
      };
      // the parts' labels (layer mechonaParts) belong to the exploded view: they go off when the explode goes OFF, whoever switched it off
      // ("הרכב בחזרה", "↺ החזר הכל", the presentation). 1.0.1-K review (vessels-6): the hook only ever HIDES them, at that moment - they are
      // switched on by the pill itself (45-vessels.js, through ctx.ui.setLayer; 1.0.1-L, L.51: the place "המכונה בפירוק" is gone), so it never fights the pill
      // or a slide that shows them (1.0.1-K hid them only after the place had shown them). No allocation per frame.
      let explodeWas = false;
      ctx.animated.push(function() {
        const m = mech();
        const on = !!(m && m.explode && m.explode.on);
        if (on === explodeWas) return;
        explodeWas = on;
        if (!on && ctx.layers.mechonaParts && ctx.layers.mechonaParts.visible) setLayer("mechonaParts", false);
      });
      // DEMOS_GROUP_300: the Second Temple's demonstrations, for the group "הדגמות" at the head of the panel (built before the places' loop)
      function ui_demosList() {
        return [
          { t: "סדר עבודת הבוקר", pill: "tamid-demo" },
          { t: "ארבעת הפייסות ו״ברקאי״", place: "ארבעת הפייסות ו״ברקאי״ — הדגמה" },
          { t: "פתיחת השער הגדול", place: "פתיחת השער הגדול — הדגמה" },
          { t: "הכיור יורד לבור ועולה", pill: "alt-mukhni-demo" },
          { t: "הכניסה בפשפש", pill: "hei-pish-demo" },
          { t: "הכהן הגדול נכנס בקטורת", place: "הכהן הגדול נכנס בקטורת — הדגמה" },
          { t: "הליכה במסיבה", place: "הליכה במסיבה — הדגמה" },
          { t: "הכהן יורד לבית הטבילה", pill: "mes-tevila-demo" },
          { t: "שמחת בית השואבה", place: "שמחת בית השואבה — הדגמה" },   // SIMCHA_304 (until 2.0.12: the lamps alone - their place stays)
          { t: "הדלקת מנורות הזהב בעזרת נשים", place: "מנורות של זהב — שמחת בית השואבה" },   // DEMOLIST_305: the lamps alone, kept (the user, 23:49)
          { t: "ניסוך המים — מן השילוח", place: "ניסוך המים מן השילוח — הדגמה" }   // SHILOACH_305
        ];
      }
      const PLACES = [
        ["שערי הר הבית וחצרות", [
          { t: "הר הבית", view: "harHabayit", key: "harHabayit" },
          { t: "המשמרות — שלושה לכהנים ועשרים ואחד ללויים", feature: (ctx.shared.features || {})["guards"] || null, tg: [103, 0, 82.5], cam: [103, 700, 215], info: "לשון המשנה (מידות א, א): ״בשלשה מקומות הכהנים שומרים בבית המקדש, בבית אבטינס, ובבית הניצוץ, ובבית המוקד. והלוים בעשרים ואחד מקום. חמשה, על חמשה שערי הר הבית. ארבעה, על ארבע פנותיו מתוכו. חמשה, על חמשה שערי העזרה. ארבעה, על ארבע פנותיה מבחוץ. ואחד בלשכת הקרבן, ואחד בלשכת הפרכת, ואחד לאחורי בית הכפרת״ (וכן תמיד א, א).\n**ברטנורא:** השמירה אינה מפני פחד לסטים וגנבים, אלא כבוד וגדולה לבית שלא יהא בלא שומרים, ומצוותה כל הלילה; שלושה מקומות לכהנים — כנגד אהרן ושני בניו ששמרו במשכן. בית אבטינס ובית הניצוץ — שתי עליות בצד שערי העזרה; בית המוקד — לא עלייה אלא כיפה עשויה בארץ. עשרים וארבעה מקומות השמירה — מן הכתוב בדברי הימים: שלושה לכהנים ועשרים ואחד ללויים, שאף הכהנים קרויים לויים. שומרי שערי העזרה ופינותיה שומרים מבחוץ, לפי שאין ישיבה בעזרה אלא למלכי בית דוד, ואי אפשר לשמור בעמידה כל הלילה. התנא סובר חמישה שערים לעזרה, ואף למאן דאמר שבעה — לא שמרו אלא על חמישה (ברטנורא מידות א, א).\n**תוספות יום טוב:** השמירה כל הלילה — כדברי הר״ב, ר׳ שמעיה והרמב״ם (בית הבחירה פרק ח), ולא יום ולילה כדברי המפרש לתמיד. ״פנותיו״ — הזוויות, מקום שכלה כותל ומתחיל כותל. שני השערים הנוספים לא הוצרכו שמירה, לפי שהיו תכופים לשאר השערים (תמיד כז.). ״בית הכפורת״ — קודש הקדשים, על שם הכפורת שעל הארון (תוספות יום טוב מידות א, א).\n**תפארת ישראל:** השמירה מן התורה, ומפני הכבוד, ולדעתו יום ולילה. בית אבטינס — עלייה על גבי שער המים בדרום העזרה, ושם מרקחים את הקטורת, ובית הטבילה בצדו; בית המוקד ובית הניצוץ — בכותל הצפון, ובית הניצוץ ממערב לבית המוקד, ושם מבעירים עצים שניצוציהם מתקיימים זמן מרובה, להדליק מהם את המערכה אם תכבה. שומרי הפינות — כנגד הזווית ממש, ובהר הבית מבפנים לחומה. לשכת הקרבן — הלשכה המערבית־דרומית שבבית המוקד (א, ו); לשכת הפרוכת, שבה אורגים את הפרוכת — לא ידע את מקומה, ואפשר שהייתה אחד מל״ח התאים; ״אחורי בית הכפורת״ — אחורי קודש הקדשים (תפארת ישראל מידות א, א).\nבמודל: לחיצה מראה לחמש עשרה שניות סימון זהב לשלושת משמרות הכהנים וסימון עץ לעשרים ואחד משמרות הלויים; מקומות לשכת הקרבן ולשכת הפרוכת — בחירת מודל.", refs: [["מידות א, א", "Mishnah_Middot.1.1"], ["ברטנורא א, א", "Bartenura_on_Mishnah_Middot.1.1"], ["תוי״ט א, א", "Tosafot_Yom_Tov_on_Mishnah_Middot.1.1"], ["תפא״י א, א", "Yachin_on_Mishnah_Middot.1.1"], ["תמיד א, א", "Mishnah_Tamid.1.1"], ["רמב״ם בית הבחירה ח, א", "Mishneh_Torah,_The_Chosen_Temple.8.1"], ["רמב״ם בית הבחירה ח, ד", "Mishneh_Torah,_The_Chosen_Temple.8.4"], ["רמב״ם בית הבחירה ח, ה", "Mishneh_Torah,_The_Chosen_Temple.8.5"]], tourThen: [{"cam": [-20, 250, 150], "tg": [-20, 20, 0]}] },
          { t: "שער שושן", view: "shushanGate", key: "shushanGate" },
          { t: "שושן הבירה — שתי אמות המידה", tg: [356.3, 5, 1.3], cam: [374, 7.6, 1.3], info: "לשון המשנה (כלים יז, ט): ״ושתי אמות היה בשושן הבירה, אחת על קרן מזרחית צפונית ואחת על קרן מזרחית דרומית. שעל קרן מזרחית צפונית היתה יתרה על של משה חצי אצבע. שעל קרן מזרחית דרומית היתה יתרה עליה חצי אצבע, נמצאת יתרה על של משה אצבע. ולמה אמרו אחת גדולה ואחת קטנה, אלא שהאמנין נוטלין בקטנה ומחזירין בגדולה, כדי שלא יבאו לידי מעילה״. ובמידות (א, ג): ״שער המזרחי, עליו שושן הבירה צורה״.\nבקצרה — המחלוקת בכרטיס זה (הפירוט — במתג ״שושן הבירה ושתי האמות״ שבתפריט, תחת ״שיטות ומחלוקות״):\n• לרמב״ם ולברטנורא במידות — האמות בשער שושן, שער המזרח של הר הבית (ברירת המחדל).\n• לרש״י, לברטנורא בכלים ולתוספות — בחדר שעל גבי שער המזרח של העזרה.\n**הרמב״ם** (פירוש המשניות, כלים יז, ט): ״ומזה השער יאמרו ושתי אמות היו בשושן הבירה״ — בשער המזרח של הר הבית. **רש״י** (מנחות צח.): ״חדר אחד היה בנוי על שער המזרחי של עזרה ומצוייר כתבנית שושן הבירה״.\nבמודל: בברירת המחדל שתי האמות על מזוזות שער שושן מבחוץ — הצפונית יתרה על אמת משה חצי אצבע, והדרומית אצבע. לשיטת רש״י — בחדר שעל גבי השער המזרחי של עזרת נשים (בתפריט, תחת ״שיטות ומחלוקות״). מקומן, גובהן וצורתן — בחירת מודל.", refs: [["כלים יז, ט", "Mishnah_Kelim.17.9"], ["מידות א, ג", "Mishnah_Middot.1.3"], ["פירוש המשניות לרמב״ם כלים יז, ט", "Rambam_Commentary_on_Kelim.17.9"], ["פירוש המשניות לרמב״ם מידות א, ג", "Rambam_Commentary_on_Middot.1.3"], ["ברטנורא מידות א, ג", "Bartenura_on_Mishnah_Middot.1.3"], ["רש״י מנחות צח.", "Rashi_on_Menachot.98.1"], ["רש״י פסחים פו.", "Rashi_on_Pesachim_Shtei_Amot.86.1"], ["ברטנורא כלים יז, ט", "Bartenura_on_Mishnah_Kelim.17.9"], ["תוספות פסחים פו.", "Tosafot_on_Pesachim.86.1"], ["רש״ש פסחים פו.", "Rashash_on_Pesachim.86.1"]], noFade: true },
          { t: "שער טדי", tg: [55, 13, -174.5], cam: [55, 16, -224], info: "לשון המשנה (מידות א, ג): ״טדי מן הצפון, לא היה משמש כלום״; ובסוף הפרק (א, ט): ״רבי אליעזר בן יעקב אומר, במסבה ההולכת תחת החיל יוצא והולך לו בטדי״; ובשערי הבית (ב, ג): ״כל השערים שהיו שם, היו להן שקופות, חוץ משער טדי, שהיו שם שתי אבנים מטות זו על גב זו״.\nבקצרה — המחלוקת בכרטיס זה (הפירוט — במתג ״שער טדי — צורת האבנים״ שבתפריט, תחת ״שיטות ומחלוקות״):\n• ״שתי אבנים מטות זו על גב זו״ (ברירת המחדל).\n• לראבי״ה — ״שני אבנים זקופות״ (״לא מאומת״).\n**ברטנורא:** של צפון — טדי שמו. לרבי אליעזר בן יעקב, מי שאירע בו קרי בבית המוקד טובל במחילה שתחת החיל ויוצא בטדי ואינו חוזר לבית המוקד, לפי שהוא טבול יום — ואין הלכה כמותו, אלא כמשנה בריש תמיד, שבא ויושב אצל אחיו הכהנים עד שהשערים נפתחים (ברטנורא מידות א, ג; א, ט).\n**תוספות יום טוב:** ״טדי״ בדל״ת (ר׳ שמעיה והערוך); פסקי התוספות — לשון הצנע (״בטעמים יטידוך״), ולפי זה נקרא כן לפי שלא היה משמש כלום, ואף היציאה בו לבעל קרי — בצנעה, שאין שם עוברים ושבים; ובסוף ספר הראבי״ה, בסדר בניין בית שני, כתוב ״טרי״ בריש — שער טרי, שני אבנים זקופות, ״ולכך נקרא טרי פי׳ מוצב״ (תוספות יום טוב מידות א, ג).\n**תפארת ישראל:** ״טדי״ — תרגום של סוד והצנע, שעשוי למי שנכנס או יוצא בהצנע, כבעל קרי; ויש גורסים ״טרי״ — שמשקופו עשוי משתי אבנים זקופות הנשענות זו על זו כמשולש, ו״טרי״ ביוונית משולש, סימן למי שרוצה לצאת בהצנע; ״לא היה משמש כלום״ — אלא לפרקים לבעל קרי, ובשלטי הגיבורים: לחתנים ולאבלים (תפארת ישראל מידות א, ג).\nבמודל: השער הצפוני של הר הבית; במשקופו שתי אבנים מוטות זו על זו (ב, ג), ובתפריט, תחת ״שיטות ומחלוקות״ ״אבנים זקופות״ — שיטת הראבי״ה והתפארת ישראל — לא מאומת. הדלתות מסתיימות באלכסון, כצורת ראש השער, וכשהן סגורות הן סותמות גם את המשולש שבין שתי האבנים — בחירת מודל; אין לכך מקור.\nהמדרגות שמחוץ לשער — שלושים ושש מעלות מן העיר, ומעקה משני צדיהן — בחירת מודל: במקורות אין תיאור של העלייה מן העיר אל שערי הר הבית.", refs: [["מידות א, ג", "Mishnah_Middot.1.3"], ["ברטנורא א, ג", "Bartenura_on_Mishnah_Middot.1.3"], ["תוי״ט א, ג", "Tosafot_Yom_Tov_on_Mishnah_Middot.1.3"], ["תפא״י א, ג", "Yachin_on_Mishnah_Middot.1.3"], ["מידות א, ט", "Mishnah_Middot.1.9"], ["מידות ב, ג", "Mishnah_Middot.2.3"], ["תמיד א, א", "Mishnah_Tamid.1.1"]] },
          { t: "שער קיפונוס", tg: [-154, 10, 0], cam: [-204, 16, 0], info: "לשון המשנה (מידות א, ג): ״קיפונוס מן המערב, משמש כניסה ויציאה״.\nבקצרה — שמו: לתפארת ישראל — על שם גינת ורדים שמאחורי קודש הקדשים; ויש אומרים — על שם המתנדב שבנאו.\n**ברטנורא:** שער הר הבית שבצד מערב — קיפונוס שמו, ושל צפון — טדי (ברטנורא מידות א, ג).\n**תוספות יום טוב:** לא ידע טעם לשמו; בשלטי הגיבורים — לשון יוון, ועניינו עבודת הגן, שאפשר שהיה שם גן של ורדים מחוץ להר הבית (כפת הירדן שבפיטום הקטורת — רש״י: גינת ורדים הייתה בירושלים). וסדר המשנה — דרום, מערב, צפון, מזרח — אינו הקפה דרך ימין: ״בחושבנא בעלמא לית לן בה״ (תוספות יום טוב מידות א, ג).\n**תפארת ישראל:** אפשר שנקרא על שם גינת ורדים שהייתה מאחורי קודש הקדשים (״קיפוס״ ביוונית — גן), ועשוה שם לכבוד קודש הקדשים שלפניה במזרח; ויש אומרים — על שם המתנדב שבנאו, כשער ניקנור (תפארת ישראל מידות א, ג).\nבמודל: השער המערבי של הר הבית, על ציר ההיכל, מאחורי קודש הקדשים.\nהמדרגות שמחוץ לשער — שלושים ושש מעלות מן העיר, ומעקה משני צדיהן — בחירת מודל: במקורות אין תיאור של העלייה מן העיר אל שערי הר הבית.", refs: [["מידות א, ג", "Mishnah_Middot.1.3"], ["ברטנורא א, ג", "Bartenura_on_Mishnah_Middot.1.3"], ["תוי״ט א, ג", "Tosafot_Yom_Tov_on_Mishnah_Middot.1.3"], ["תפא״י א, ג", "Yachin_on_Mishnah_Middot.1.3"]] },
          { t: "שערי חולדה", tg: [40, 11, 340], cam: [40, 52, 540], info: "לשון המשנה (מידות א, ג): ״חמשה שערים היו להר הבית. שני שערי חלדה מן הדרום, משמשין כניסה ויציאה״; ובפרק ב (ב, ב): ״כל הנכנסין להר הבית נכנסין דרך ימין ומקיפין ויוצאין דרך שמאל, חוץ ממי שארעו דבר, שהוא מקיף לשמאל״.\n**ברטנורא:** ״משמשין כניסה ויציאה״ — שבהן היו נכנסים ויוצאים להר הבית (ברטנורא מידות א, ג).\n**תוספות יום טוב:** שני שערים בדרום, לפי שרוב תשמיש הר הבית בדרום (ריש פרק ב); ושמם — ייתכן על שם חולדה הנביאה, ״והיא יושבת בירושלים במשנה״ (מלכים ב כב) — בתוך שער זה, שהוא ״משנה״, ששניים הם ברוח זו, מה שאין כן ברוחות האחרות (תוספות יום טוב מידות א, ג).\n**תפארת ישראל:** רוב הכניסה והיציאה ורוב תשמישי העזרה בדרום (וכן תוספות יום טוב, מידות א, ג: ״לפי שרוב תשמיש הר הבית בדרום כדתנן בר״פ דלקמן״), והוצרכו שם שני שערים; ונקראו שערי חולדה, שבמקדש ראשון הייתה חולדה הנביאה רגילה לקרוא שם נבואותיה באוזני רוב העם הנכנסים והיוצאים (תפארת ישראל מידות א, ג).\nבמודל: שני שערים בכותל הדרומי של הר הבית, ומהם מדרגות אל ההר; מקומם בכותל — בחירת מודל.\nהמדרגות שמחוץ לשער — שלושים ושש מעלות מן העיר, ומעקה משני צדיהן — בחירת מודל: במקורות אין תיאור של העלייה מן העיר אל שערי הר הבית.", refs: [["מידות א, ג", "Mishnah_Middot.1.3"], ["ברטנורא א, ג", "Bartenura_on_Mishnah_Middot.1.3"], ["תוי״ט א, ג", "Tosafot_Yom_Tov_on_Mishnah_Middot.1.3"], ["תפא״י א, ג", "Yachin_on_Mishnah_Middot.1.3"], ["מידות ב, ב", "Mishnah_Middot.2.2"]], noFade: true },
          { t: "מעיין השילוח", tg: [30, -53, 545], cam: [6, -24, 506], info: (ctx.shared.shiloach || {}).info || "", refs: (ctx.shared.shiloach || {}).refs || [] },   // SHILOACH_305
          { t: "ניסוך המים מן השילוח — הדגמה", action: () => { const S = ctx.shared.shiloach; if (S && typeof S.demo === "function") S.demo(); }, info: (ctx.shared.shiloach || {}).info || "", refs: (ctx.shared.shiloach || {}).refs || [] },   // SHILOACH_305
          { t: "הסטיו המלכותי", view: "royalStoa", key: "royalStoa", tourThen: [{"cam": [150, 10, 270], "tg": [60, 14, 310]}] },
          { t: "הסורג", tg: [246, 1.2, 8], cam: [262, 4.2, 22], info: "לשון המשנה (מידות ב, ג): ״לפנים ממנו, סורג, גבוה עשרה טפחים. ושלש עשרה פרצות היו שם, שפרצום מלכי יון. חזרו וגדרום, וגזרו כנגדם שלש עשרה השתחויות״.\n**ברטנורא:** ״לפנים״ — מחומת הר הבית; סורג — מחיצה העשויה נקבים נקבים כמיטה מסורגת בחבלים, מדפי עץ ארוכים וקצרים המורכבים זה על זה באלכסון; וכשמגיע כנגד כל פרצה ופרצה — משתחווה ומודה על אובדן מלכות יוון (ברטנורא מידות ב, ג).\n**תוספות יום טוב:** הראבי״ה — הסורג והחיל מקיפים לכל ארבע הרוחות, והסורג לא היה פתוח אלא לצד מזרח, והיוונים פרצו בו שלוש עשרה פרצות כנגד שערי העזרה; אבל לדעת הר״ב (סוף הפרק; שקלים ו), מאן דאמר שההשתחוויות כנגד הפרצות אינו סובר שלוש עשרה שערים. ״גבוה עשרה טפחים״ — הכסף משנה בשם הרא״ש: הסורג נעשה לטלטול בשבת, כדין מחיצה; והתוי״ט תמה, שאין שבות במקדש ואין צורך בכך, ולדעתו (בספרו צורת הבית) הסורג בא להבדיל בין הגויים הבאים להתפלל ובין ישראל — ״החיל מקדש ממנו, שאין גוים וטמא מת נכנסים לשם״ (כלים א, ח) — ולכן פרצוהו היוונים, ולכן תיקנו על כל גדר השתחוויה (תוספות יום טוב מידות ב, ג).\n**תפארת ישראל:** מחיצה של דפים ארוכים וקצרים המורכבים באלכסון זה על גב זה, מלאה נקבים כמיטה מסורגת; מקיפה את חומת העזרה מבחוץ ברחוק עשר אמות ממנה, ורק לסימן שאין נכרי וטמא מת רשאים להיכנס ממנה ולפנים; וכנגד כל שער הסורג פתוח — ודוחה את הראבי״ה: לא ייתכן שכל הנכנסים והיוצאים בכל השערים נדחקים בפתח אחד; ועשוהו סורג לנוי, וגם כדי שיוכלו להציץ דרך הנקבים אל מקום הקודש; היוונים פרצוהו מכמה צדדים כדי שייכנסו גם נכרים, וכשגברו ישראל גדרו את הפרצות, והמקיף משתחווה כנגד כל גדר בפישוט ידיים ורגליים (תפארת ישראל מידות ב, ג).\nבמודל: מחיצת סורג של עץ — דפים המורכבים זה על זה באלכסון, כלשון הברטנורא — בגובה עשרה טפחים, סביב העזרה ועזרת הנשים, ובה פתחים כנגד השערים, כתפארת ישראל; לפנים ממנה החיל, עשר אמות פנויות. שלוש עשרה הפרצות: כברירת מחדל הסורג שלם — ״חזרו וגדרום״; ובמתג ״הסורג — שלוש עשרה הפרצות״ (בתפריט, תחת ״שיטות ומחלוקות״) הוא נראה כבימי מלכי יון, פרוץ בשלושה עשר מקומות. מקומות הפרצות, גוון העץ ועוביו — בחירת מודל.", refs: [["מידות ב, ג", "Mishnah_Middot.2.3"], ["ברטנורא ב, ג", "Bartenura_on_Mishnah_Middot.2.3"], ["תוי״ט ב, ג", "Tosafot_Yom_Tov_on_Mishnah_Middot.2.3"], ["תפא״י ב, ג", "Yachin_on_Mishnah_Middot.2.3"], ["כלים א, ח", "Mishnah_Kelim.1.8"]] },
          { t: "החיל", feature: (ctx.shared.features || {})["zoneHel"] || null, tg: [150, 5, -40], cam: [330, 120, -150], info: "לשון המשנה (מידות ב, ג): ״לפנים ממנו, החיל, עשר אמות. ושתים עשרה מעלות היו שם. רום המעלה חצי אמה, ושלחה חצי אמה. כל המעלות שהיו שם, רום מעלה חצי אמה, ושלחה חצי אמה, חוץ משל אולם״.\n**ברטנורא:** לפנים מן הסורג היה מקום פנוי עשר אמות, והוא נקרא חיל; שתים עשרה מעלות — לעלות משם לעזרת נשים; ״רום מעלה״ — כל מעלה גבוהה מחברתה חצי אמה, והראשונה גבוהה מן הקרקע חצי אמה; ״שלחה״ — משך רוחב המעלה, מקום דריסת הרגל, חצי אמה; ״חוץ משל אולם״ — המעלות שבין האולם ולמזבח לא היו כולן כן (ברטנורא מידות ב, ג).\n**תוספות יום טוב:** הרמב״ם (בית הבחירה ה, ג, ובפירושו) — החיל חומה נמוכה הסובבת את העזרה, ועליה נאמר ״ויאבל חיל וחומה״; והתוי״ט דוחה מן הגמרא (פסחים פו.) — ״בר שורא״ שבכתוב היא חומה קטנה הסמוכה לקרקע העזרה, לחיזוק הקרקע — ולכן נראים דברי הר״ב, שהחיל אינו חומה כלל אלא המקום שבין הסורג לעזרה, ולכך לא שנו בו גובה כבסורג. ״שלחה חצי אמה״ — ואורכה בכל רוחב ההר, לצפון ולדרום (רש״י יומא טז.) (תוספות יום טוב מידות ב, ג).\n**תפארת ישראל:** בפרק א (ה) — חומה נמוכה שעל שיפוע ההר בין שתי החומות, שווה לקרקע שלמעלה ממנה, ועליה הסורג, וכל הרווח נקרא חיל; ובפרקנו — הרווח מן הסורג עד חומת העזרה, עשר אמות: ארבע האמות הראשונות קרקע שווה, ושש האמות הנותרות משופעות ובהן שתים עשרה המעלות, תכופות זו לזו; ולדעתו המעלות מקיפות את כל ההר סביב — ״סטיו כפול היה״ (פסחים יג:) — ולא רק כנגד השער, וכן כל המעלות שבעזרה היו לכל רוחבה מצפון לדרום (תפארת ישראל מידות ב, ג; א, ה).\nבמודל: החיל — מקום פנוי של עשר אמות לפנים מן הסורג, כלשון הברטנורא, מסביב לחומות; ובגובה הר הבית, כדברי הרמב״ם (בית הבחירה ו, א): ״מהלך עד סוף החיל בשוה״. הוא נצבע כשלוחצים על המקום; קדושתו: ״החיל מקדש ממנו, שאין גוים וטמא מת נכנסים לשם״ (כלים א, ח; וכן ברמב״ם, בית הבחירה ז, טז). שתים עשרה המעלות — בתוך החיל, ומשם עולים לעזרת נשים: ברטנורא — ״כדי לעלות משם לעזרת נשים״; הרמב״ם בפירוש המשניות — ״והיה אדם עולה מקרקע החיל י״ב מעלות ואז הולך בקרקע ישרה והיא עזרת הנשים״; הרא״ש — ״וי״ב מעלות היו. בחיל״; ותפארת ישראל — ארבע אמות שוות ושש של מעלות. שערי העזרה שבצפון ובדרום גבוהים מקרקע החיל שלוש עשרה אמה וחצי — שש של שתים עשרה המעלות (מידות ב, ג) ושבע וחצי של חמש עשרה המעלות (ב, ה): לפני כל שער רחבה צמודה לכותל, וממנה עשרים ושבע מעלות יורדות לאורך הכותל, בתוך החיל — ״רום מעלה חצי אמה, ושלחה חצי אמה״; וכן לפני שער בית המוקד הפתוח לחיל ולפני פתח לשכת הגזית. מעלות השערים שבצדדים אינן מפורשות במשנה: מקומן, רוחבן וכיוונן — בחירת מודל.", refs: [["מידות ב, ג", "Mishnah_Middot.2.3"], ["ברטנורא ב, ג", "Bartenura_on_Mishnah_Middot.2.3"], ["תוי״ט ב, ג", "Tosafot_Yom_Tov_on_Mishnah_Middot.2.3"], ["תפא״י ב, ג", "Yachin_on_Mishnah_Middot.2.3"], ["תפא״י א, ה", "Yachin_on_Mishnah_Middot.1.5"], ["כלים א, ח", "Mishnah_Kelim.1.8"], ["רמב״ם בית הבחירה ז, טז", "Mishneh_Torah,_The_Chosen_Temple.7.16"], ["רמב״ם בית הבחירה ה, ג", "Mishneh_Torah,_The_Chosen_Temple.5.3"], ["פירוש המשניות לרמב״ם מידות ב, ג", "Rambam_Commentary_on_Middot.2.3"], ["הרא״ש מידות ב, ג", "Rosh_on_Mishnah_Middot.2.3"], ["רמב״ם בית הבחירה ו, א", "Mishneh_Torah,_The_Chosen_Temple.6.1"]] },
          { t: "שער עזרת נשים — המזרחי", tg: [232.5, 16, 0], cam: [292, 22, 0], info: "לשון המשנה (מידות ב, ג): ״ושתים עשרה מעלות היו שם״; ״כל הפתחים והשערים שהיו שם, גבהן עשרים אמה, ורחבן עשר אמות, חוץ משל אולם״.\nבקצרה — המחלוקות בכרטיס זה (הפירוט — במתגים שבתפריט, תחת ״שיטות ומחלוקות״):\n• **שושן הבירה ושתי האמות:** לרמב״ם ולברטנורא במידות — האמות בשער שושן, שער המזרח של הר הבית (ברירת המחדל); לרש״י, לברטנורא בכלים ולתוספות — בחדר שעל גבי שער המזרח של העזרה.\n• **שערי עזרת נשים:** במשנה ובמפרשים — שער במזרח בלבד (ברירת המחדל); ליוסף בן מתתיהו — גם בצפון ובדרום.\n• **שער העליון:** לחכמים — שבעה שערים לעזרה (ברירת המחדל); לאבא יוסי בן חנן — שלושה עשר, וביניהם ״שער העליון״; ולרמב״ם — ״שער זה הוא הנקרא שער העליון והוא שער ניקנור״.\nשמו — ״שער התחתון״: הרמב״ם (כלי המקדש ז, ו): ״שלש לפתיחת שער התחתון והוא שער עזרת נשים ושלש לפתיחת שער העליון הוא שער נקנור ולמה נקרא שער עליון לפי שהוא למעלה מעזרת נשים״. ומקורו במשנה (סוכה ה, ה): ״שלש לשער העליון, ושלש לשער התחתון״; ובשמחת בית השואבה (סוכה ה, ד) מן השער העליון ״היו תוקעין והולכין, עד שמגיעין לשער היוצא מזרח״. ברטנורא (סוכה ה, ה): השער התחתון — ״שער היוצא ממזרח״. וכן בכפתור ופרח (מובא בקובץ שיטות קמאי): ״וזה השער הוא שער עזרת נשים״. ותפארת ישראל (מידות ב, ה): לשער זה ״לא היה לו שם פרטי כלל״.\n**ברטנורא** (מידות ב, ד): הכהן בהר הזיתים רואה את פתח ההיכל דרך השערים המכוונים זה כנגד זה — שער הר הבית כנגד שער עזרת נשים, שער עזרת נשים כנגד שער העזרה הגדולה, ושער העזרה כנגד פתח ההיכל; והכותל הנמוך — כותל המזרח של הר הבית (ראו ״שער שושן״).\nבמודל: השער המזרחי של עזרת נשים, בראש שתים עשרה המעלות שבתוך החיל, על ציר ההיכל; כותל המזרח של עזרת נשים גבוה כשאר כתליה; ממנו ולפנים — ״עזרת נשים מקדשת ממנו, שאין טבול יום נכנס לשם״ (כלים א, ח).", refs: [["מידות ב, ג", "Mishnah_Middot.2.3"], ["רמב״ם כלי המקדש ז, ו", "Rambam_Klei_HaMikdash.7.6"], ["משנה סוכה ה, ד", "Mishnah_Sukkah.5.4"], ["משנה סוכה ה, ה", "Mishnah_Sukkah.5.5"], ["ברטנורא סוכה ה, ה", "Bartenura_on_Mishnah_Sukkah.5.5"], ["כפתור ופרח (קובץ שיטות קמאי)", "Kovetz_Shitot_Kamai_on_Middot.2.5"], ["תפא״י מידות ב, ה", "Yachin_on_Mishnah_Middot.2.5"], ["ברטנורא ב, ד", "Bartenura_on_Mishnah_Middot.2.4"], ["כלים א, ח", "Mishnah_Kelim.1.8"]] },
          { t: "עזרת נשים", view: "ezratNashim", key: "ezratNashim", feature: (ctx.shared.features || {})["zoneEzn"] || null },
          { t: "חמש עשרה המעלות — כחצי גורן", tg: () => (ctx.shared.steps15 && ctx.shared.steps15.mode === "rid" ? [100, 9.5, 0] : [104, 9.5, 5]), cam: () => (ctx.shared.steps15 && ctx.shared.steps15.mode === "rid" ? [150, 44, 34] : [141, 33, 37]), info: "לשון המשנה (מידות ב, ה): ״וחמש עשרה מעלות עולות מתוכה לעזרת ישראל, כנגד חמש עשרה מעלות שבתהלים, שעליהן הלוים אומרים בשיר. לא היו טרוטות, אלא מקפות כחצי גרן עגלה״.\nבקצרה — המחלוקות בכרטיס זה (הפירוט — במתגים שבתפריט, תחת ״שיטות ומחלוקות״):\n• **ארבע לשכות עזרת נשים — מקומן:** לתוספות יום טוב — במקצועותיה שבפנים (ברירת המחדל); לרא״ש — מבחוץ, כציורו.\n• **חמש עשרה המעלות — צורתן:** לרמב״ם — המעלות אינן ארוכות, כל מעלה חצי עיגול, לפני השער (ברירת המחדל); לרי״ד ולרבינו יהונתן — אורך המעלה כרוחב העזרה, מכותל לכותל.\n**הרמב״ם** (פירוש המשניות, מידות ב, ה): ״שמעלות עזרת נשים לא היו ארוכים כשאר המעלות כמו שהוא מפורסם היום מצורת המדרגות אלא היתה כל מעלה כמו חצי עגולה עד שתהא כל מעלה חצי גורן כזה״ (הציור שבמקום זה אינו בנוסח שבספרייה), ״ולפיכך היתה צורת המעלה כמי שלקח קצת אצטבא ונתן אותה על המעלה עד שמשלים צורת הסולם וזה אי אפשר לציירו בפשוט אבל יובן בקירוב״. ובבית הבחירה (ו, ב): ״רום כל מעלה חצי אמה ושלחה חצי אמה״.\n**פסקי הרי״ד** (סוכה נג.): ״וכל מעלה היתה גבוהה חצי אמה ורחבה חצי אמה כדתנן במידות... ואורך המעלה היה קל״ה אמה כרוחב העזרה מכותל לכותל״. **רבינו יהונתן מלוניל** (סוכה נא:): ״אורך המעלה כרוחב העזרה, ורוחב המעלה חצי אמה ורומה חצי אמה״.\n**המאירי:** ״מוקפות כחצי גורן, שהתחתונה קצרה, והשניה עודפת לה משני קצותיה, וכן שלישית לשניה, וכלם על סדר זה, עד שכשהיו כלם מסודרות בסדר זה היתה צורתם דומה להקף של חצי גורן״.\n**הרא״ש:** ״אלא מוקפות כחצי גורן עגולה. כזו״ — וצייר חצאי עיגולים, זה בתוך זה. בציורו אין סימן לאיזה צד פונות המעלות, ולא איזו מעלה היא הגבוהה.\nבמודל (ברירת המחדל, הרמב״ם): חמישה עשר חצאי עיגולים לפני שער ניקנור, כל אחד מונח על זה שמתחתיו; העליון הוא הקטן, וכל מעלה שמתחתיו רחבה ממנו בחצי אמה. רדיוס המעלה העליונה חמש עשרה אמה — השער ושני פשפשיו עומדים עליה — ושל התחתונה עשרים ושתיים. חמש המעלות התחתונות נקטעות אצל כותלי שתי הלשכות הקטנות שמצדי השער. מידות הרדיוס והקטיעה — בחירות מודל.", refs: [["מידות ב, ה", "Mishnah_Middot.2.5"], ["פירוש המשניות לרמב״ם מידות ב, ה", "Rambam_Commentary_on_Middot.2.5"], ["רמב״ם בית הבחירה ו, ב", "Mishneh_Torah,_The_Chosen_Temple.6.2"], ["פסקי הרי״ד סוכה נג.", "Kovetz_Shitot_Kamai_Middot.53.1"], ["רבינו יהונתן סוכה נא:", "Kovetz_Shitot_Kamai_Middot.51.2"], ["מאירי מידות ב, ה", "Meiri_on_Middot.2.5"], ["הרא״ש מידות ב, ה", "Rosh_on_Mishnah_Middot.2.5"], ["מידות ב, ג", "Mishnah_Middot.2.3"]] },
          { t: "מנורות של זהב — שמחת בית השואבה", feature: (ctx.shared.features || {})["simchaMenorot"] || null, action: () => { const S = ctx.shared.simchaDemo; if (S && typeof S.start === "function") S.start(); }, tg: [161, 30, 0], cam: [215, 60, 80], info: "לשון המשנה (סוכה ה, ב–ג): ״במוצאי יום טוב הראשון של חג, ירדו לעזרת נשים, ומתקנין שם תקון גדול. ומנורות של זהב היו שם, וארבעה ספלים של זהב בראשיהן, וארבעה סלמות לכל אחד ואחד, וארבעה ילדים מפרחי כהנה ובידיהם כדים של שמן של מאה ועשרים לג, שהן מטילין לכל ספל וספל. מבלאי מכנסי כהנים ומהמיניהן מהן היו מפקיעין, ובהן היו מדליקין, ולא היתה חצר בירושלים שאינה מאירה מאור בית השואבה״.\nבקצרה — המחלוקת בכרטיס זה: גובה המנורות — בגמרא (סוכה נב:) ״חמשים אמה״ (כך במודל); ולתפארת ישראל — המנורות עצמן לא היו גבוהות כל כך, אלא עמדו על בימות גבוהות, או סביב שפת הגזוזטרא.\n**הגמרא** (סוכה נב:): ״תנא: גובהה של מנורה חמשים אמה... ובידיהם כדי שמן של שלשים שלשים לוג, שהם כולם מאה ועשרים לוג״; ועל הסולמות: ״הכא סולמות, וזקיף טובא״. ומהו התיקון הגדול (שם נא:): ״חלקה היתה בראשונה. והקיפוה גזוזטרא, והתקינו שיהו נשים יושבות מלמעלה ואנשים מלמטה״.\n**רש״י** (סוכה נא.): ״ילדים — בחורים ובידיהם כדי שמן ועולים כל אחד בסולמו״; ״לפי שהמנורות גבוהין חמשים אמה והר הבית גבוה והאורה זורחת בכל העיר, וכותל מזרחי שהוא לסוף עזרת נשים היה נמוך... והמנורות עולין למעלה הימנה״.\n**ברטנורא** (סוכה ה, ג): ״לפי שהמנורות גבוהות חמשים אמה והר הבית גבה, והאורה זורחת בכל העיר״.\n**תפארת ישראל** (סוכה ה): ״בראש כל מנורה היה ד׳... ותוך הספלים הניחו הפתילה העבה ביותר והבעירוה״; ״סולם לכל ספל״; ועל הגובה: ״וזהו גוזמא גדולה שיהיו מנורות רבות גבוהות ועבות כל כך כליל זהב, אלא שהיו המנורות עומדות על בימות גבוהות כל כך, או סביב שפת הגזוזטרא שעשו״.\n**הרמב״ם** (כלי המקדש ח, ו): ״מכנסי כהנים הדיוטים שבלו ואבנטיהם היו עושין מהן פתילות ומדליקין בהן במקדש בשמחת בית השואבה״.\nבמודל: ארבע מנורות זהב בעזרת נשים, גובה כל אחת חמשים אמה, ובראשה ארבעה ספלים; לכל ספל סולם, ולרגלי כל סולם פרח כהונה בבגדים לבנים, וכד שמן בידו. כשבוחרים במקום זה בתפריט, מתחילה הדגמה: הם עולים בסולמות, יוצקים שמן לספלים, הפתילות נדלקות, והם יורדים. מספר המנורות אינו מפורש במשנה — בחירת מודל; וכן מקומן בעזרה, צורתן, והזרועות שהספלים עליהן. המנורות מוצגות רק כשבוחרים במקום זה, ונעלמות כשעוברים למקום אחר.", refs: [["משנה סוכה ה, ב", {"book": 56, "index": 52}], ["משנה סוכה ה, ג", {"book": 56, "index": 53}], ["סוכה נא:", {"book": 108, "index": 1323}], ["סוכה נב:", {"book": 108, "index": 1355}], ["סוכה נב: (הסולמות)", {"book": 108, "index": 1357}], ["רש״י סוכה נא.", {"book": 2163, "index": 2408}], ["ברטנורא סוכה ה, ג", {"book": 588, "index": 246}], ["יכין סוכה ה, ב (אות ז)", {"book": 772, "index": 518}], ["יכין סוכה ה, ב (אות ח)", {"book": 772, "index": 520}], ["רמב״ם כלי המקדש ח, ו", {"book": 338, "index": 128}], ["יכין סוכה ה, ב (אות ט)", {"book": 772, "index": 522}]] },
          { t: "שמחת בית השואבה — הדגמה", action: () => { const S = ctx.shared.simchaShoeva; if (S && typeof S.start === "function") S.start(); }, info: "לשון המשנה (סוכה ה, א–ד): ״אמרו, כל מי שלא ראה שמחת בית השואבה, לא ראה שמחה מימיו״; ״במוצאי יום טוב הראשון של חג, ירדו לעזרת נשים, ומתקנין שם תקון גדול״; ״חסידים ואנשי מעשה היו מרקדים לפניהם באבוקות של אור שבידיהן, ואומרים לפניהן דברי שירות ותשבחות. והלוים בכנורות ובנבלים ובמצלתים ובחצוצרות ובכלי שיר בלא מספר, על חמש עשרה מעלות היורדות מעזרת ישראל לעזרת נשים״.\nההדגמה — מתג, כבויה כברירת מחדל; עם קולות (״קולות בהדגמות״ שבתפריט משתיק אותם). הלילה, הגזוזטראות, המנורות של זהב, העם, הריקודים והלוים — רק בזמן ההדגמה.\n**הגזוזטראות:** ״מאי תיקון גדול? אמר רבי אלעזר: כאותה ששנינו: חלקה היתה בראשונה. והקיפוה גזוזטרא, והתקינו שיהו נשים יושבות מלמעלה ואנשים מלמטה״ (סוכה נא:; מידות ב, ה); ״עשו שלש גזוזטראות בעזרה כנגד שלש רוחות״ (תוספתא סוכה ד, א). התפארת ישראל: ״שהניחו קרשים עם מעקה סביב על הזיזין שיוצאין מהחומות סביב״ (סוכה ה, ב), ו״תקרה בולטת מאמצע גובה כתליה״ (מידות ב, ה). במודל — הזיזים קבועים בכתלים ונראים תמיד, והקרשים והמעקה — רק בהדגמה. שלוש גזוזטראות: בצפון, בדרום ובמזרח (משני צדי השער), לאורך הכותל שבין הלשכות, באמצע גובה הכתלים. עומקן, מספר הזיזים וצורתם — בחירת מודל.\n**המנורות:** ארבעה ילדים מפרחי כהונה מדליקים את המנורות של זהב, כבמקום ״מנורות של זהב — שמחת בית השואבה״.\n**העם:** אלפי אנשים וילדים בכל הגילים, בבגדיהם, ממלאים את העזרה סביב המרקדים — ״היו מרקדים לפניהם לפני כל העם שעמדו סביב אצל החומות״ (תפארת ישראל, סוכה ה, ד). מספרם וצפיפותם — בחירת מודל.\n**האור:** ״ולא היתה חצר בירושלים שאינה מאירה מאור בית השואבה״ (סוכה ה, ג) — משנדלקות המנורות, כל העזרה מוארת באור חם; והאבוקות והספלים בוערים באש חיה. עוצמת האור — בחירת מודל.\n**החסידים ואנשי מעשה:** מרקדים במעגל באמצע עזרת הנשים, אבוקה ביד כל אחד; ״בארבע אבוקות או בשמונה, זורק זו ומקבל את זו״ (ברטנורא, סוכה ה, ד) — בהדגמה שניים מהם זורקים ארבע אבוקות. ומה היו אומרים: ״יש מהן אומרים: אשרי ילדותנו שלא ביישה את זקנותנו — אלו חסידים ואנשי מעשה. ויש מהן אומרים: אשרי זקנותנו שכפרה את ילדותנו — אלו בעלי תשובה. אלו ואלו אומרים: אשרי מי שלא חטא, ומי שחטא — ישוב וימחול לו״ (סוכה נג.). ומי היו המרקדים: ״גדולי חכמי ישראל וראשי הישיבות והסנהדרין והחסידים והזקנים ואנשי מעשה הם שהיו מרקדין ומספקין ומנגנין ומשמחין במקדש בימי חג הסכות״ (רמב״ם, הלכות שופר וסוכה ולולב ח, יד).\n**הלוים והחליל:** ״החליל מכה ומנגנין בכנור ובנבלים ובמצלתים וכל אחד ואחד בכלי שיר שהוא יודע לנגן בו״ (רמב״ם שם, ח, יג); ״זהו החליל של בית השואבה״ (סוכה ה, א); ובתוספתא (סוכה ד, ה): ״ולוים בכנורות ובנבלים וכל כלי שיר מהן אומרים שיר המעלות הנה ברכו... יש מהן שהיו אומרים שאו ידיכם קדש״. והתפארת ישראל (מידות ב, ה): ״עמדו שם בט״ו שורות על הט״ו מעלות, ובכל שורה שררו שיר המעלות אחר, שורה אחר שורה. ולהכי נקראין המזמורים ההם שיר המעלות, וסיימו העומדים וגו׳ בלילות של סוכות״. בהדגמה — שורה של לוים על כל אחת מחמש עשרה המעלות, בכנורות, בנבלים, במצלתים ובחצוצרות, ושני מחללים למרגלות המעלות; מספרם ומקומם — בחירת מודל. הכלים בידיהם, והם מנגנים בקצב הלחן: הכנור ביד שמאל והפריטה בימין, הנבל בשתי הידיים, המצלתיים נקשים בראש כל פסוק של הלחן, והחצוצרות עולות לפה בקריאה שבו; והגוף נע מעט עם השיר. התנועות — בחירת מודל. הנגינה בהדגמה — לחן כללי, ולא שחזור של נגינת המקדש.\n**רבן שמעון בן גמליאל:** ״כשהיה שמח שמחת בית השואבה, היה נוטל שמנה אבוקות של אור, וזורק אחת ונוטל אחת ואין נוגעות זו בזו. וכשהוא משתחוה, נועץ שני גודליו בארץ ושוחה ונושק את הרצפה וזוקף, ואין כל בריה יכולה לעשות כן, וזו היא קידה״ (סוכה נג.). בהדגמה הוא קד ופניו אל ההיכל — ״אבותינו שהיו במקום הזה אחוריהם אל היכל ה׳ ופניהם קדמה... ואנו ליה עינינו״ (סוכה ה, ד).\n**בכתוביות** גם שאר דברי הגמרא על השמחה (סוכה נא:–נג:): שלוש התקנות של מקום הנשים, ״והן משובחין היו יותר מבנה של מרתא בת בייתוס״, ״אשה היתה בוררת חטים לאור של בית השואבה״, דברי הלל הזקן ״אם אני כאן — הכל כאן״ ו״מקום שאני אוהב״, דברי רבי יהושע בן חנניה ״לא ראינו שינה בעינינו״, ו״המה משתחוים קדמה, ואנו ליה״.\n**קרא הגבר:** ״ועמדו שני כהנים בשער העליון שיורד מעזרת ישראל לעזרת נשים, ושתי חצוצרות בידיהן. קרא הגבר, תקעו והריעו ותקעו. הגיעו למעלה עשירית, תקעו והריעו ותקעו. הגיעו לעזרה, תקעו והריעו ותקעו״ (סוכה ה, ד). איזו היא המעלה העשירית — ״בעי רבי ירמיה: למעלה עשירית — דנחית חמשה וקאי אעשרה, או דלמא דנחית עשרה וקאי אחמשה? תיקו״ (סוכה נג:). בהדגמה — ירדו חמש, ועומדים על העשירית; זו בחירת תצוגה, ולא הכרעה. ״הגיעו לעזרה״ — ״לרצפת עזרת נשים״ (תפארת ישראל). ״היו תוקעין והולכין, עד שמגיעין לשער היוצא מזרח. הגיעו לשער היוצא ממזרח, הפכו פניהן למערב, ואמרו, אבותינו שהיו במקום הזה אחוריהם אל היכל ה׳ ופניהם קדמה, והמה משתחוים קדמה לשמש, ואנו ליה עינינו״ (סוכה ה, ד).\n**התקיעות בהליכה — מתג ב״שיטות ומחלוקות״:** רש״י: ״והיו תוקעין והולכין — באלו שלש אחרונות מאריכין עד שמגיעין לשער היוצא מעזרת נשים להר הבית״ — התקיעה, התרועה והתקיעה של העזרה נמשכות לאורך ההליכה; וכך הברטנורא (סוכה ה, ה): ״הגיעו לעזרה תקעו והריעו ותקעו. ומאריכין בהן עד שהגיעו לשער התחתון״, ותוספות יום טוב. ולתפארת ישראל (יכין, סוכה ה, ה): ״ואע״ג דגם לאחר מעלה עשירית קאמר תוקעין והולכין, היינו רק תקיעה בלי תרועה״ — ובהדגמה, לשיטתו, שלוש תקיעות ארוכות בהליכה. ברירת המחדל — רש״י. אורך התקיעות — בחירת מודל.", refs: [["סוכה ה, א", "Mishnah_Sukkah.5.1"], ["סוכה ה, ב", "Mishnah_Sukkah.5.2"], ["סוכה ה, ג", "Mishnah_Sukkah.5.3"], ["סוכה ה, ד", "Mishnah_Sukkah.5.4"], ["מידות ב, ה", "Mishnah_Middot.2.5"], ["סוכה נא: (תיקון גדול)", {"book": 108, "index": 1323}], ["סוכה נג. (אשרי ילדותנו)", {"book": 108, "index": 1361}], ["סוכה נג. (רבן שמעון בן גמליאל)", {"book": 108, "index": 1366}], ["סוכה נג: (מעלה עשירית)", {"book": 108, "index": 1376}], ["רמב״ם בית הבחירה ה, ט", "Mishneh_Torah,_The_Chosen_Temple.5.9"], ["יכין סוכה ה, ב (אות ו)", {"book": 772, "index": 516}], ["יכין סוכה ה, ד (אות טז)", {"book": 772, "index": 536}], ["יכין סוכה ה, ד (אות כה)", {"book": 772, "index": 554}], ["יכין מידות ב, ה (אות מט)", {"book": 819, "index": 243}], ["יכין מידות ב, ה (אות נד)", {"book": 819, "index": 253}]] },   // SIMCHA_304
          { t: "שתי הסנהדראות הקטנות", action: () => { if (ctx.shared.openFor) ctx.shared.openFor("crt-lishkot-roofs", 15000); }, tg: () => (ctx.shared.lesserPlace && ctx.shared.lesserPlace.mode === "mount" ? [224.6, 3, -15] : [189, 3, -15]), cam: () => (ctx.shared.lesserPlace && ctx.shared.lesserPlace.mode === "mount" ? [224.6, 190, 62] : [189, 150, 46]),   // LESSER_BOTH_300: both courts in one view, from above (over the women's court's wall)
          info: "לשון המשנה (סנהדרין יא, ב): ״שלשה בתי דינין היו שם, אחד יושב על פתח הר הבית, ואחד יושב על פתח העזרה, ואחד יושב בלשכת הגזית״.\nבקצרה — המחלוקת בכרטיס זה (הפירוט — במתג ״שורות התלמידים שלפני הסנהדרין״ שבתפריט, תחת ״שיטות ומחלוקות״):\n• לרש״י — אף הן כעגולה, על הקרקע (ברירת המחדל).\n• ליד רמה — שורות פשוטות, ולא בעיגול.\n**רש״י** (פו:): ״אחד יושב על פתח הר הבית — הוא שער המזרחי שלפנים מן החיל לפני עזרת נשים״; ״ואחד יושב למעלה הימנו — כשעברו עזרת נשים ובאין לפני עזרת ישראל״.\nועל ישיבתם (סנהדרין ד, ג–ד): ״סנהדרין היתה כחצי גרן עגלה, כדי שיהו רואין זה את זה. ושני סופרי הדינין עומדין לפניהם, אחד מימין ואחד משמאל״; ״ושלש שורות של תלמידי חכמים יושבין לפניהם, כל אחד ואחד מכיר את מקומו״.\nבמודל: כל בית דין יושב בלשכה סגורה — עשרים ושלושה כחצי גורן, חמש עשרה אמה קוטרו; לפניהם שני סופרי הדיינים ושלוש שורות התלמידים (צורת השורות — במתג ״שורות התלמידים שלפני הסנהדרין״). הלשכה, מידותיה, פתחה ומקומה המדויק — בחירת מודל. המבט כאן: אל בית הדין שלפני שער ניקנור; גג הלשכה מוסר לשעה.\nהדמויות — כבלשכת הגזית: הדיינים בגלימה שחורה ובכיפה, הזקן לבן סמוך לאמצע השורה וכהה בקצותיה; התלמידים בלי זקן; הסופרים עומדים — בחירת מודל.", refs: [["סנהדרין יא, ב", "Mishnah_Sanhedrin.11.2"], ["רש״י סנהדרין פו:", "Rashi_on_Sanhedrin.86.2"], ["רמב״ם סנהדרין א, ג", "Rambam_Sanhedrin.1.3"], ["מאירי סנהדרין יז.", "Meiri_on_Sanhedrin.17.1"], ["סנהדרין ד, ג", "Mishnah_Sanhedrin.4.3"], ["סנהדרין ד, ד", "Mishnah_Sanhedrin.4.4"]], tourThen: [{"cam": [251.5, 30, 10], "tg": [251.5, 2, -14.5]}] }
        ]],
        ["שערי העזרה", [
          { t: "העזרה", view: "azarah", key: "azarah", feature: (ctx.shared.features || {})["zoneAzarah"] || null },
          { t: "שער ניקנור", view: "nikanor", key: "nikanor", noFade: true },
          { t: "עזרת ישראל", feature: (ctx.shared.features || {})["zoneYisrael"] || null, tg: [88, 13.5, 0], cam: [88, 120, 0.5], info: "לשון המשנה (מידות ב, ו): ״עזרת ישראל היתה ארך מאה אמה ושלשים וחמש על רחב אחת עשרה״; (ה, א): ״מן המזרח למערב מאה ושמונים ושבע, מקום דריסת ישראל אחת עשרה אמה״.\nבקצרה — המחלוקת בכרטיס זה (הפירוט — במתג ״בניין הורדוס״ שבתפריט, תחת ״שיטות ומחלוקות״):\n• אבן בהירה אחידה (ברירת המחדל).\n• שיש בשלושה גוונים — ״אפיק שפה ועייל שפה״ (בבא בתרא ד.).\n**ברטנורא:** ״כל העזרה״ — מתחילת עזרת ישראל עד אחרי אחת עשרה אמה מקום פנוי שהיה אחורי בית הכפורת; ״על רחב״ — מצפון לדרום (ברטנורא מידות ב, ו).\n**תוספות יום טוב:** ״אורך מאה ושלשים וחמש״ — מצפון לדרום, שכל מידה יתרה קרויה אורך (רש״י במלכים); קדושת עזרת ישראל יתרה על של נשים, ושל כהנים על של ישראל — כלים א, ח; הראבי״ה: ״עזרת״ בסגול — שם דבר, לשון עזרה, ״ישלח עזרך מקדש״ (ירושלמי ברכות) (תוספות יום טוב מידות ב, ו).\n**תפארת ישראל:** רוחבה אחת עשרה — שאין ישראל רשאים להיכנס משם ולהלן אלא בשעת סמיכה ותנופה (כלים א, ח); ולדעתו הוא הדין לכל צורך, שברגלים, כשהעזרה מלאה, נמשכו ישראל אל בין בית החליפות וכותל העזרה ואל אחת עשרה האמה שאחורי בית הכפורת (יומא כא.); ובבועז — שאלף תפ״ה אמות מרובעות של עזרת ישראל, בניכוי לשכת הגזית, לא הספיקו לכל ישראל ברגל, ולכן התפשטו גם אל הרווח שבין הכבש לכותל הדרום ואל הרווח שבין הטבעות לכותל הצפון (תפארת ישראל מידות ב, ו; בועז ב, ב).\nבמודל: הרצועה הראשונה של העזרה מן המזרח, משער ניקנור ועד המעלה והדוכן; קדושתה: ״עזרת ישראל מקדשת ממנה, שאין מחסר כפורים נכנס לשם, וחיבין עליה חטאת״ (כלים א, ח; רמב״ם בית הבחירה ז, יח).", refs: [["מידות ב, ו", "Mishnah_Middot.2.6"], ["ברטנורא ב, ו", "Bartenura_on_Mishnah_Middot.2.6"], ["תוי״ט ב, ו", "Tosafot_Yom_Tov_on_Mishnah_Middot.2.6"], ["תפא״י ב, ו", "Yachin_on_Mishnah_Middot.2.6"], ["מידות ה, א", "Mishnah_Middot.5.1"], ["בועז ב, ב", "Boaz_on_Mishnah_Middot.2.2"], ["כלים א, ח", "Mishnah_Kelim.1.8"], ["רמב״ם בית הבחירה ז, יח", "Mishneh_Torah,_The_Chosen_Temple.7.18"], ["רמב״ם בית הבחירה ו, ג", "Mishneh_Torah,_The_Chosen_Temple.6.3"]] },
          { t: "בר שורא — חומה קטנה לפנים מן החומה", tg: [90.5, 14.9, 40], cam: [79, 23.5, 20], info: "בגמרא (פסחים פו.), על ״עובי החומה״ שהוא כלפנים: ״ואמר רבי אחא ואיתימא רבי חנינא: שורא ובר שורא״.\n**רש״י:** ״בר שורא — חומה קטנה לפנים מן החומה גדולה, והיא נמוכה ושוה לקרקע גובה העזרה, שקרקע העזרה הולך וגבוה ועולה במעלות״.\n**תוספות יום טוב** (מידות ב, ג): ״כלומר שראשה תהא שוה לקרקע העזרה ותהא מוקדשת כמוה״; ״והיה זה לדעתי לחזוק הקרקע שלא יפול העפר ממנה״.\nבמודל: חומה קטנה צמודה לחומת העזרה מבפנים, וראשה בגובה רצפת עזרת כהנים. בעזרת ישראל היא בולטת שתי אמות וחצי — לאורך הכותל המזרחי (חוץ משער ניקנור ושני פשפשיו) ובצפון ובדרום עד מעלות הדוכן. בעזרת כהנים ראשה שווה לרצפה, ואינו ניכר. עוביה אמה — בחירת מודל.", refs: [["פסחים פו.", "Pesachim.86a"], ["רש״י פסחים פו.", "Rashi_on_Pesachim.86.1"], ["תוי״ט מידות ב, ג", "Tosafot_Yom_Tov_on_Mishnah_Middot.2.3"], ["רמב״ם בית הבחירה ה, ג", "Mishneh_Torah,_The_Chosen_Temple.5.3"]], noFade: true },
          { t: "דוכן הלויים", feature: (ctx.shared.features || {})["zoneDuchan"] || null, tg: [87, 14.8, 2], cam: [89.2, 16.4, 22], info: "לשון המשנה (מידות ב, ו): ״וראשי פספסין מבדילין בין עזרת ישראל לעזרת הכהנים. רבי אליעזר בן יעקב אומר, מעלה היתה שם, וגבוהה אמה, והדוכן נתון עליה, ובה שלש מעלות של חצי חצי אמה. נמצאת עזרת הכהנים גבוהה מעזרת ישראל שתי אמות ומחצה״.\nבקצרה — לתנא קמא ״ראשי פספסין מבדילין בין עזרת ישראל לעזרת הכהנים״; לרבי אליעזר בן יעקב ״מעלה היתה שם, וגבוהה אמה, והדוכן נתון עליה, ובה שלש מעלות של חצי חצי אמה״ (מידות ב, ו) — ולתפארת ישראל הלכה כמותו.\n**ברטנורא:** ראשי פספסין — ראשי קורות בולטים ויוצאים מן הכותל להבדיל בין העזרות; המעלה — בעזרת ישראל, גבוהה אמה וארוכה כאורך כל העזרה; הדוכן של הלויים בנוי עליה ועשוי כמין אצטבא, וגובהו אמה וחצי, ושלוש מעלות של חצי אמה שעולים בהן לדוכן (ברטנורא מידות ב, ו).\n**תוספות יום טוב:** ״פספסין״ — אפשר שלא היו אלא כשיעור פס יד (נגעים יא, ז); ואם ראשי קורות הם — הרי שאין איסור נטיעת עץ בעזרת ישראל, והקורות מגיעות עד עזרת הכהנים, כבבית המוקד, וסיוע לדברי הראב״ד; ״שעולין בהן לדוכן לברך את העם״ (ר׳ שמעיה) (תוספות יום טוב מידות ב, ו).\n**תפארת ישראל:** ראשי הפספסין — קורות ברוחב פיסת היד, יוצאות בכל גובה החומה בכותלי צפון ודרום, בסוף עזרת ישראל, סימן לישראל שאינם רשאים ללכת להלן; רבי אליעזר בן יעקב חולק על תנא קמא, והלכה כמותו — משנתו קב ונקי; הדוכן — אצטבא של אבן שחצובות בה שלוש מדרגות, מונח למעלה וסמוך לאותה מעלה בעזרת כהנים, וכנגדו ההר מגביה עצמו עוד אמה וחצי; על מעלותיו עמדו הכהנים לברך את העם כשצר להם המקום במעלות האולם (רבי טרפון, קידושין עא.), ועיקר תשמישו — ללויים לומר עליו שירה בכל יום (תפארת ישראל מידות ב, ו).\nבמודל: מעלה של אמה לכל רוחב העזרה, ועליה הדוכן ושלוש מעלותיו — כרבי אליעזר בן יעקב; על הדוכן עומדים הלויים בשעת השיר על הקרבן (רמב״ם בית הבחירה ו, ו).\nולחזון איש (על מידות ב, ו) המעלה היא ״כעין לשכה כנוסה בזקיפת ההר של עזרת כהנים״, כנגד המזבח — בתפריט, תחת ״שיטות ומחלוקות״, ״הדוכן ומעלות עזרת הכהנים״.", refs: [["מידות ב, ו", "Mishnah_Middot.2.6"], ["ברטנורא ב, ו", "Bartenura_on_Mishnah_Middot.2.6"], ["תוי״ט ב, ו", "Tosafot_Yom_Tov_on_Mishnah_Middot.2.6"], ["תפא״י ב, ו", "Yachin_on_Mishnah_Middot.2.6"], ["רמב״ם בית הבחירה ו, ג", "Mishneh_Torah,_The_Chosen_Temple.6.3"], ["רמב״ם בית הבחירה ו, ו", "Mishneh_Torah,_The_Chosen_Temple.6.6"], ["חזון איש (אורח חיים, מועד) על מידות ב, ו", "Chazon_Ish_OC.126"]] },
          { t: "עזרת כהנים", feature: (ctx.shared.features || {})["zoneKohanim"] || null, tg: [77, 16, 0], cam: [77, 120, 0.5], info: "לשון המשנה (מידות ב, ו): ״וכן עזרת כהנים היתה ארך מאה ושלשים וחמש על רחב אחת עשרה. וראשי פספסין מבדילין בין עזרת ישראל לעזרת הכהנים״; (ה, א): ״מקום דריסת הכהנים אחת עשרה אמה״.\nבקצרה — המחלוקת בכרטיס זה (הפירוט — במתג ״בניין הורדוס״ שבתפריט, תחת ״שיטות ומחלוקות״):\n• אבן בהירה אחידה (ברירת המחדל).\n• שיש בשלושה גוונים — ״אפיק שפה ועייל שפה״ (בבא בתרא ד.).\n**ברטנורא:** ראשי פספסין — ראשי קורות בולטים ויוצאים מן הכותל להבדיל בין עזרת ישראל לעזרת כהנים; ולרבי אליעזר בן יעקב — מעלה של אמה והדוכן עליה (ברטנורא מידות ב, ו).\n**תוספות יום טוב:** קדושת עזרת הכהנים יתרה על של ישראל (כלים א, ח); ואם הפספסין ראשי קורות הם — עומדים בעזרת ישראל ומגיעים עד עזרת הכהנים, שמעזרת הכהנים ולפנים אסורה נטיעת עץ (תוספות יום טוב מידות ב, ו).\n**תפארת ישראל:** הפספסין — קורות ברוחב פיסת היד בכותלי צפון ודרום, בכל גובה החומה, סימן לישראל שאינם רשאים לעבור; עזרת הכהנים גבוהה מעזרת ישראל שתי אמות ומחצה — ברוב רוחבה, שהמעלות עצמן בתוכה; ובבועז — די בהיכר מן הצד, כלחי שבמבוי, ולרבי אליעזר בן יעקב המעלה של אמה עצמה היכר ברצפה, ולראב״ד איסור נטיעת עץ רק מעזרת הכהנים ולפנים (תפארת ישראל מידות ב, ו; בועז ב, ג).\nבמודל: הרצועה שמן הדוכן ועד המזבח, אחת עשרה אמה; קדושתה: ״עזרת הכהנים מקדשת ממנה, שאין ישראל נכנסים לשם אלא בשעת צרכיהם, לסמיכה לשחיטה ולתנופה״ (כלים א, ח; רמב״ם בית הבחירה ז, יט).", refs: [["מידות ב, ו", "Mishnah_Middot.2.6"], ["ברטנורא ב, ו", "Bartenura_on_Mishnah_Middot.2.6"], ["תוי״ט ב, ו", "Tosafot_Yom_Tov_on_Mishnah_Middot.2.6"], ["תפא״י ב, ו", "Yachin_on_Mishnah_Middot.2.6"], ["מידות ה, א", "Mishnah_Middot.5.1"], ["בועז ב, ג", "Boaz_on_Mishnah_Middot.2.3"], ["כלים א, ח", "Mishnah_Kelim.1.8"], ["רמב״ם בית הבחירה ז, יט", "Mishneh_Torah,_The_Chosen_Temple.7.19"]] },
          { t: "בין האולם ולמזבח", feature: (ctx.shared.features || {})["zoneUlamAltar"] || null, tg: [28.5, 16, 0], cam: [64, 100, 0.5], info: "לשון המשנה (מידות ה, א): ״בין האולם ולמזבח עשרים ושתים אמה״; (ג, ו): ״הכיור היה בין האולם ולמזבח, ומשוך כלפי הדרום. בין האולם ולמזבח, עשרים ושתים אמה. ושתים עשרה מעלות היו שם, רום מעלה חצי אמה, ושלחה אמה״.\nבקצרה — המחלוקת בכרטיס זה (הפירוט — במתג ״בין האולם ולמזבח — רוחבו״ שבתפריט, תחת ״שיטות ומחלוקות״):\n• במודל — לכל רוחב העזרה (ברירת המחדל).\n• לתוספות ר״י הלבן — כנגד המזבח והכבש בלבד.\n**ברטנורא:** שלוש אמות רצפה חלקה מן המזבח עד תחילת המעלות, ותשע עשרה אמות המעלות והרובדים עד האולם — עשרים ושתיים (ברטנורא מידות ג, ו).\n**תוספות יום טוב:** האוטם — שש אמות — הוא גובה שתים עשרה המעלות שבין המזבח לאולם, והאולם וההיכל עליו בשווה (תוספות יום טוב מידות ד, ו).\n**תפארת ישראל:** המעלות בכל רוחב האולם מצפון לדרום, לא רק כנגד הפתח, ומכסות את האוטם במזרח; הכיור משוך לדרום כנגד הרווח שבין האולם למזבח, שלא יפסיק ביניהם (תפארת ישראל מידות ג, ו; ד, ו).\nבמודל: רצועה של עשרים ושתיים אמה בין המזבח לאולם, ובה שתים עשרה מעלות האולם והכיור; קדושתה: ״בין האולם ולמזבח מקדש ממנה, שאין בעלי מומין ופרועי ראש נכנסים לשם״ (כלים א, ט; רמב״ם בית הבחירה ז, כ); לשם יוצא כהן גדול לקבל את ברכת העם ביום הכיפורים, ושם עומדים הכהנים בתפילה (תמיד ז, ב).", refs: [["מידות ה, א", "Mishnah_Middot.5.1"], ["מידות ג, ו", "Mishnah_Middot.3.6"], ["ברטנורא ג, ו", "Bartenura_on_Mishnah_Middot.3.6"], ["תפא״י ג, ו", "Yachin_on_Mishnah_Middot.3.6"], ["תוי״ט ד, ו", "Tosafot_Yom_Tov_on_Mishnah_Middot.4.6"], ["כלים א, ט", "Mishnah_Kelim.1.9"], ["רמב״ם בית הבחירה ז, כ", "Mishneh_Torah,_The_Chosen_Temple.7.20"], ["תמיד ז, ב", "Mishnah_Tamid.7.2"]] },
          { t: "שער בית המוקד — פתחו של הבית לעזרה", tg: [-18, 19.5, -57.5], cam: [-18, 27, -74.5], info: "לשון המשנה (מידות א, ה): ״שלישי לו, בית המוקד״; (א, ז): ״שנים שערים היו לבית המוקד, אחד פתוח לחיל ואחד פתוח לעזרה. אמר רבי יהודה, זה שהיה פתוח לעזרה, פשפש קטן היה לו, שבו נכנסין לבלש את העזרה״.\n**ברטנורא:** הפתח שבצפון בית המוקד פתוח לחיל, ושבדרומו פתוח לעזרה; פשפש — שער קטן בתוך השער הגדול, שבו נכנסים בכל בוקר לחפש על כל כלי שרת שבעזרה שיהיו במקומם, כמשנה בתמיד (א, ג): ״נטל את המפתח ופתח את הפשפש ונכנס מבית המוקד לעזרה״; ״לבלש״ — תרגום ״ויחפש״ (ברטנורא מידות א, ז).\n**תוספות יום טוב:** הגמרא (תמיד כז.) שואלת: כיוון ששני שערים היו לו, למה נמנה עליו שומר אחד? ותירץ אביי — כיוון שעומדים זה אצל זה, די להם בשומר אחד הרואה לכאן ולכאן (תוספות יום טוב מידות א, ז).\n**תפארת ישראל:** הפשפש — פתח קטן בתוך דלת השער הגדול, ובכל בוקר קודם העבודה נכנסים בו לבדוק אם כל כלי השרת במקומם. בית המוקד לא היה רחוק מן המזבח למערב כבציור שבש״ס, אלא סמוך לבית המטבחיים, ששם מצויים הכהנים תדיר, כדי שימהרו להתחמם ולחזור לעבודתם (תפארת ישראל מידות א, ז; א, ה).\nבמודל: בית המוקד עומד על החומה הצפונית, מזרחה משער הקרבן, ודלתו הדרומית פתוחה לעזרה; אין עוד שער נפרד בחומה. סדר שערי הצפון מן המערב: הניצוץ, הקרבן, בית המוקד (רמב״ם בית הבחירה ה, ד: ״שלשה מן הצפון הסמוכין למערב״). שני השערים מצוירים כשאר השערים — עשר אמות רוחב ועשרים גובה (מידות ב, ג), ודלתותיהם זהב; בשער שלעזרה, בתוך הדלת, הפשפש הקטן של רבי יהודה (תפארת ישראל: ״פתח קטן היה בתוך דלת הגדול של השער״); גודלו — בחירת מודל.", refs: [["מידות א, ה", "Mishnah_Middot.1.5"], ["ברטנורא א, ה", "Bartenura_on_Mishnah_Middot.1.5"], ["תוי״ט א, ה", "Tosafot_Yom_Tov_on_Mishnah_Middot.1.5"], ["תפא״י א, ה", "Yachin_on_Mishnah_Middot.1.5"], ["מידות א, ז", "Mishnah_Middot.1.7"], ["תוי״ט א, ז", "Tosafot_Yom_Tov_on_Mishnah_Middot.1.7"], ["תפא״י א, ז", "Yachin_on_Mishnah_Middot.1.7"], ["תמיד א, ג", "Mishnah_Tamid.1.3"], ["רמב״ם בית הבחירה ה, ד", "Mishneh_Torah,_The_Chosen_Temple.5.4"], ["מידות א, ו", "Mishnah_Middot.1.6"]] },
          { t: "שער הקרבן", tg: [-48, 23.5, -71.5], cam: [-48, 30, -130], info: "לשון המשנה (מידות א, ה): ״שני לו, שער הקרבן״; ובסדר השערים (ב, ו): ״שער יכניה, שער הקרבן, שער הנשים, שער השיר״.\nבקצרה — המחלוקות בכרטיס זה (הפירוט — במתגים שבתפריט, תחת ״שיטות ומחלוקות״):\n• **שער העליון:** לחכמים — שבעה שערים לעזרה (ברירת המחדל); לאבא יוסי בן חנן — שלושה עשר, וביניהם ״שער העליון״; ולרמב״ם — ״שער זה הוא הנקרא שער העליון והוא שער ניקנור״.\n• **שמות שערי הצפון:** לתפארת ישראל ולחק נתן — שער הנשים קטן, ושער השיר הוא בית המוקד (ברירת המחדל); והאפשרות שתפארת ישראל דוחה — שער הנשים הוא בית המוקד.\n**ברטנורא:** שם מכניסים קדשי קדשים ששחיטתן בצפון (ברטנורא מידות א, ה).\n**תפארת ישראל:** שבו מכניסים קדשי קדשים ששחיטתן בצפון (תפארת ישראל מידות א, ה).\nבמודל: האמצעי בשערי הצפון: בחלק המערבי של החומה, כרמב״ם (בית הבחירה ה, ד) ״הסמוכין למערב״, וסדר השערים כסדר המשנה מן המערב למזרח; מכוון כנגד בית המטבחיים. גם לאבא יוסי בן חנן הוא שער הקרבן, השני מן המערב (חק נתן מידות א, ד); ובינו ובין בית המוקד — שער הנשים הקטן (תפארת ישראל מידות ב, ו), בתצוגת שלושה עשר השערים.", refs: [["מידות א, ה", "Mishnah_Middot.1.5"], ["ברטנורא א, ה", "Bartenura_on_Mishnah_Middot.1.5"], ["תוי״ט א, ה", "Tosafot_Yom_Tov_on_Mishnah_Middot.1.5"], ["תפא״י א, ה", "Yachin_on_Mishnah_Middot.1.5"], ["מידות ב, ו", "Mishnah_Middot.2.6"], ["רמב״ם בית הבחירה ה, ד", "Mishneh_Torah,_The_Chosen_Temple.5.4"], ["חק נתן מידות א, ד", "Chok_Natan_on_Mishnah_Middot.1.4"], ["תפא״י מידות ב, ו", "Yachin_on_Mishnah_Middot.2.6"]] },
          { t: "שער הניצוץ", tg: [-78, 23.5, -71.5], cam: [-78, 30, -130], info: "לשון המשנה (מידות א, ה): ״ושבצפון, שער הניצוץ. וכמין אכסדרה היה, ועליה בנויה על גביו, שהכהנים שומרים מלמעלן והלוים מלמטן, ופתח היה לו לחיל״; (ב, ו; שקלים ו, ג): ״לעמתן בצפון סמוכין למערב, שער יכניה, שער קרבן, שער נשים, שער השיר. ולמה נקרא שמו שער יכניה, שבו יצא יכניה בגלותו״.\nבקצרה — המחלוקות בכרטיס זה (הפירוט — במתגים שבתפריט, תחת ״שיטות ומחלוקות״):\n• **שער העליון:** לחכמים — שבעה שערים לעזרה (ברירת המחדל); לאבא יוסי בן חנן — שלושה עשר, וביניהם ״שער העליון״; ולרמב״ם — ״שער זה הוא הנקרא שער העליון והוא שער ניקנור״.\n• **שמות שערי הצפון:** לתפארת ישראל ולחק נתן — שער הנשים קטן, ושער השיר הוא בית המוקד (ברירת המחדל); והאפשרות שתפארת ישראל דוחה — שער הנשים הוא בית המוקד.\n**ברטנורא:** ״כמין אכסדרה״ — שני כתלים, אחד מצד זה ואחד מצד זה לשער, בולטים ויוצאים מחוץ לחומת העזרה לצד הר הבית, ועלייה בנויה למעלה על אותם שני כתלים; באחד הכתלים פתח היוצא לחיל; ובשקלים: ״שבו יצא יכניהו בגלותו — שנכנס לבית המקדש להשתחוות ולטל רשות כשהלך בגולה לבבל, ויצא דרך אותו שער״ (ברטנורא מידות א, ה; ברטנורא שקלים ו, ג).\n**תוספות יום טוב:** על הכהנים מלמעלה והלויים מלמטה מפנה לפירוש הר״ב (א, ט); והאכסדרה לא הוצרכה שומר, ש״לא תנן אלא פתח היה לה לחיל וא״צ שמירה כמו שער״; ושערי הצפון שבמידות ושבשקלים — ״בצפון מחסרי חד ושינו בשמותן שקראום ניצוץ וקרבן ומוקד״, ולתוספות (כתובות קו.) לכולי עלמא שלושה עשר שערים, שבעה גדולים ושישה קטנים (תוספות יום טוב מידות א, ה; א, ז; תוספות יום טוב שקלים ו, ג).\n**תפארת ישראל:** שני כתלים משני צדי השער לצד פנים, בעזרה — זו האכסדרה — ועלייה שאינה מקורה עליהם; תמה על הר״ב מניין שבלטה לצד הר הבית, ואין צורך, שגגין ועליות לא נתקדשו; הפתח לחיל — ואצלו מדרגות; בית הניצוץ ממערב לבית המוקד, ושם מבעירים עצים שניצוציהם מתקיימים זמן מרובה, להדליק מהם את המערכה אם תכבה (תפארת ישראל מידות א, ה; א, א).\nבמודל: הראשון משערי הצפון מן המערב: בחלק המערבי של החומה, כרמב״ם (בית הבחירה ה, ד) ״הסמוכין למערב״, וסדר השערים כסדר המשנה; העלייה שעל גביו והפתח לחיל — כרטיס ״עליית שער הניצוץ״. לאבא יוסי בן חנן הוא שער יכניה — כך כתבו החק נתן (מידות א, ד) והתפארת ישראל (מידות ב, ו); בתצוגת שלושה עשר השערים השם כתוב עליו.", refs: [["מידות א, ה", "Mishnah_Middot.1.5"], ["ברטנורא א, ה", "Bartenura_on_Mishnah_Middot.1.5"], ["תוי״ט א, ה", "Tosafot_Yom_Tov_on_Mishnah_Middot.1.5"], ["תפא״י א, ה", "Yachin_on_Mishnah_Middot.1.5"], ["מידות א, א", "Mishnah_Middot.1.1"], ["מידות ב, ו", "Mishnah_Middot.2.6"], ["שקלים ו, ג", "Mishnah_Shekalim.6.3"], ["ברטנורא ו, ג", "Bartenura_on_Mishnah_Shekalim.6.3"], ["תוי״ט ו, ג", "Tosafot_Yom_Tov_on_Mishnah_Shekalim.6.3"], ["רמב״ם בית הבחירה ח, ה", "Mishneh_Torah,_The_Chosen_Temple.8.5"], ["רמב״ם בית הבחירה ה, ד", "Mishneh_Torah,_The_Chosen_Temple.5.4"], ["חק נתן מידות א, ד", "Chok_Natan_on_Mishnah_Middot.1.4"], ["תפא״י מידות ב, ו", "Yachin_on_Mishnah_Middot.2.6"]] },
          { t: "שער הדלק", tg: [-78, 23.5, 71.5], cam: [-78, 30, 130], info: "לשון המשנה (מידות א, ד): ״שבעה שערים היו בעזרה, שלשה בצפון ושלשה בדרום ואחד במזרח. שבדרום, שער הדלק״; ובסדר השערים (ב, ו): ״שערים דרומיים סמוכים למערב, שער העליון, שער הדלק, שער הבכורות, שער המים״.\nבקצרה — המחלוקת בכרטיס זה (הפירוט — במתג ״שער העליון״ שבתפריט, תחת ״שיטות ומחלוקות״):\n• לחכמים — שבעה שערים לעזרה (ברירת המחדל).\n• לאבא יוסי בן חנן — שלושה עשר, וביניהם ״שער העליון״.\n• לרמב״ם — ״שער זה הוא הנקרא שער העליון והוא שער ניקנור״.\n**ברטנורא:** על שם שהיו מכניסים דרך שם עצים של מערכה הדולקים על המזבח נקרא שער הדלק (ברטנורא מידות א, ד).\n**תוספות יום טוב:** ״שבעה שערים״ — ראה סוף פרק ב ושקלים ו, ג; והראבי״ה כתב ששמע שהיו מביאים דרך שער זה אש של הדיוט על גבי המזבח (תוספות יום טוב מידות א, ד).\n**תפארת ישראל:** סמוך למערב היה; נקרא כן לפי שבו מכניסים עצים למערכה, ויש אומרים — שבו מכניסים בכל יום אש של הדיוט למזבח, שאף שירדה אש מן השמים, מצווה להביא מן ההדיוט (עירובין סג.) (תפארת ישראל מידות א, ד).\nבמודל: הראשון משערי הדרום מן המערב: בחלק המערבי של החומה, כרמב״ם (בית הבחירה ה, ד) ״הסמוכין למערב״, וסדר השערים כסדר המשנה מן המערב למזרח; דלתותיו זהב (ב, ג).", refs: [["מידות א, ד", "Mishnah_Middot.1.4"], ["ברטנורא א, ד", "Bartenura_on_Mishnah_Middot.1.4"], ["תוי״ט א, ד", "Tosafot_Yom_Tov_on_Mishnah_Middot.1.4"], ["תפא״י א, ד", "Yachin_on_Mishnah_Middot.1.4"], ["מידות ב, ו", "Mishnah_Middot.2.6"], ["רמב״ם בית הבחירה ה, ד", "Mishneh_Torah,_The_Chosen_Temple.5.4"]] },
          { t: "שער הבכורות", tg: [-48, 23.5, 71.5], cam: [-48, 30, 130], info: "לשון המשנה (מידות א, ד): ״שני לו, שער הבכורות״.\nבקצרה — המחלוקת בכרטיס זה (הפירוט — במתג ״שער העליון״ שבתפריט, תחת ״שיטות ומחלוקות״):\n• לחכמים — שבעה שערים לעזרה (ברירת המחדל).\n• לאבא יוסי בן חנן — שלושה עשר, וביניהם ״שער העליון״.\n• לרמב״ם — ״שער זה הוא הנקרא שער העליון והוא שער ניקנור״.\n**ברטנורא:** ששם היו מכניסים הבכורות ששחיטתן בדרום (ברטנורא מידות א, ד).\n**תוספות יום טוב:** ״ששחיטתן בדרום״ — כלומר אף בדרום, בכל מקום בעזרה, לאפוקי קדשי קדשים ששחיטתן בצפון; ונתייחד שער לבכורות, שהם מתנה לכהן, מה שאין כן קדשים קלים שהם לבעליהם (תוספות יום טוב מידות א, ד).\n**תפארת ישראל:** לפי שהבכורות כולם לכהנים כקדשי קדשים, ושלא יטעו לפסול בכור שנשחט בדרום — קבעו שער על שמו בדרום, להודיע שהוא כשאר קדשים קלים (תפארת ישראל מידות א, ד).\nבמודל: האמצעי בשערי הדרום: בחלק המערבי של החומה, כרמב״ם (בית הבחירה ה, ד) ״הסמוכין למערב״, וסדר השערים כסדר המשנה מן המערב למזרח.", refs: [["מידות א, ד", "Mishnah_Middot.1.4"], ["ברטנורא א, ד", "Bartenura_on_Mishnah_Middot.1.4"], ["תוי״ט א, ד", "Tosafot_Yom_Tov_on_Mishnah_Middot.1.4"], ["תפא״י א, ד", "Yachin_on_Mishnah_Middot.1.4"], ["מידות ב, ו", "Mishnah_Middot.2.6"], ["רמב״ם בית הבחירה ה, ד", "Mishneh_Torah,_The_Chosen_Temple.5.4"]] },
          { t: "שער המים", tg: [-18, 23.5, 71.5], cam: [-18, 30, 130], info: "לשון המשנה (מידות א, ד): ״שלישי לו, שער המים״; (ב, ו; שקלים ו, ג): ״ולמה נקרא שמו שער המים. שבו מכניסין צלוחית של מים של נסוך בחג. רבי אליעזר בן יעקב אומר, ובו המים מפכים, ועתידין להיות יוצאין מתחת מפתן הבית״; (סוכה ד, ט): ״צלוחית של זהב מחזקת שלשת לגים היה ממלא מן השלוח. הגיעו לשער המים, תקעו והריעו ותקעו״.\nבקצרה — המחלוקת בכרטיס זה (הפירוט — במתג ״שער העליון״ שבתפריט, תחת ״שיטות ומחלוקות״):\n• לחכמים — שבעה שערים לעזרה (ברירת המחדל).\n• לאבא יוסי בן חנן — שלושה עשר, וביניהם ״שער העליון״.\n• לרמב״ם — ״שער זה הוא הנקרא שער העליון והוא שער ניקנור״.\n**ברטנורא:** על שם הכתוב ביחזקאל (מז) ״והנה מים מפכים מן הכתף הימנית״ — דרום, שקרוי ימין; ראה יחזקאל בנבואה מים יוצאים מבית קודש הקדשים דקים כקרני חגבים, וכשמגיעים לשער זה מתגברים ונעשים כמלוא פי פך קטן; ובסוכה: ״אחד משערי עזרה נקרא כן, על שם שבו מכניסין צלוחית של מים דנסוך החג״, ותוקעים — ״ושאבתם מים בששון״ (ברטנורא מידות א, ד; ברטנורא שקלים ו, ג; ברטנורא סוכה ד, ט).\n**תוספות יום טוב:** טעמו של הר״ב הוא טעמו של רבי אליעזר בן יעקב, ותנא קמא נתן טעם אחר — צלוחית המים; ולגרסה ״וכן״ בדברי ראב״י — אינו חולק אלא מוסיף (תוספות יום טוב מידות א, ד).\n**תפארת ישראל:** השער לעומת המזבח, להכניס בו בדרך ישר את המים לניסוך בחג הסוכות, שנשאבו בשמחה יתרה; ״ולמה נקרא שמו שער המים — דאינך ידועים מדמורגלים בכל יום״; המעיין שעתיד לצאת מתחת מפתן קודש הקדשים כקרני חגבים — ״ואצל שער זה כבר נתרחב כמלא פי פך״ (תפארת ישראל מידות א, ד; תפארת ישראל שקלים ו, ג).\nבמודל: השלישי בדרום, מזרחה משער הבכורות (בחלק המערבי של החומה, כרמב״ם בית הבחירה ה, ד); על גביו לשכת בית אבטינס ובית הטבילה של יום הכיפורים (יומא יט.; לא.) — כרטיס משלהן.", refs: [["מידות א, ד", "Mishnah_Middot.1.4"], ["ברטנורא א, ד", "Bartenura_on_Mishnah_Middot.1.4"], ["תוי״ט א, ד", "Tosafot_Yom_Tov_on_Mishnah_Middot.1.4"], ["תפא״י א, ד", "Yachin_on_Mishnah_Middot.1.4"], ["מידות ב, ו", "Mishnah_Middot.2.6"], ["שקלים ו, ג", "Mishnah_Shekalim.6.3"], ["ברטנורא ו, ג", "Bartenura_on_Mishnah_Shekalim.6.3"], ["תפא״י ו, ג", "Yachin_on_Mishnah_Shekalim.6.3"], ["סוכה ד, ט", "Mishnah_Sukkah.4.9"], ["ברטנורא ד, ט", "Bartenura_on_Mishnah_Sukkah.4.9"], ["רמב״ם בית הבחירה ה, ד", "Mishneh_Torah,_The_Chosen_Temple.5.4"], ["יומא לא.", "Yoma.31a"]] },
          { t: "שלשה עשר שופרות", tg: [85.6, 14.5, -22], cam: [70, 30, -22], info: "לשון המשנה (שקלים ו, א): ״שלשה עשר שופרות, שלשה עשר שלחנות, שלש עשרה השתחויות, היו במקדש״; (ו, ה): ״שלשה עשר שופרות היו במקדש, וכתוב עליהם, תקלין חדתין ותקלין עתיקין, קנין וגוזלי עולה, עצים, ולבונה, זהב לכפרת. ששה, לנדבה״.\nבקצרה — מקומם (אין להם מקום במשנה):\n• לרמב״ם (שקלים ב, ב): ״ובמקדש היה לפניהם תמיד שלש עשרה תבות״ — לפני השולחנים.\n• לברטנורא (שקלים ב, א): ״והיו עומדים בעזרה״ — כארון יהוידע.\n**ברטנורא** (שקלים ו, א): ״תבות צרות מלמעלה ורחבות מלמטה עקמות כעין שופר, מפני הרמאים״; (ו, ה): ״ששה שופרות הנותרות הן לנדבה, האחד כתוב עליו מותר חטאת, השני מותר אשם, השלישי מותר קני זבים וזבות ויולדות, והרביעי מותר קרבנות נזיר, החמשי מותר אשם מצרע, הששי נדבה סתם״.\n**הרמב״ם** (פירוש המשנה, שקלים ו, א): ״וקראו אותן שופרות לפי שהיו בצורת שופר עגולות עקומות רחבות מלמטה צרות מלמעלה״.\n**ארון יהוידע** (מלכים ב יב, י): ״ויתן אתו אצל המזבח מימין בבוא איש בית ה׳״; ובדברי הימים (ב כד, ח): ״ויתנהו בשער בית ה׳ חוצה״. **המלבי״ם** (מלכים ב יב, י): שני ארונות — של ״תקלין חדתין״ בפנים, ושל ״תקלין עתיקין״ בחוץ; ״ומבואר בפ״ו דשקלים כי י״ג שופרות היו במקדש״.\nבמודל: שלשה עשר שופרות של נחושת בעזרת ישראל — ״והיו עומדים בעזרה״ (ברטנורא, שקלים ב, א, שדימה את צורתם לארון יהוידע) — מצפון לציר, כמקום אותו ארון: ״מימין בבוא איש״ (מלכים ב יב, י); והקרובים ביותר למזבח שישראל רשאים לעמוד בהם. הצד, מקומם המדויק, גודלם והחומר — בחירת מודל.", refs: [["שקלים ו, א", "Mishnah_Shekalim.6.1"], ["שקלים ו, ה", "Mishnah_Shekalim.6.5"], ["רמב״ם שקלים ב, ב", {"book": 310, "index": 15}], ["ברטנורא שקלים ב, א", "Bartenura_on_Mishnah_Shekalim.2.1"], ["ברטנורא שקלים ו, א", "Bartenura_on_Mishnah_Shekalim.6.1"], ["ברטנורא שקלים ו, ה", "Bartenura_on_Mishnah_Shekalim.6.5"], ["פירוש המשניות לרמב״ם שקלים ו, א", {"book": 523, "index": 103}], ["מלכים ב יב, י", {"book": 11, "index": 338}], ["דברי הימים ב כד, ח", {"book": 39, "index": 515}], ["מלבי״ם מלכים ב יב, י", {"book": 3379, "index": 449}]] }
        ]],
        ["לשכות", [
          { t: "לשכת הנזירים", tg: () => { const E = ctx.shared.eznChambers, d = E && E.mode === "outside" ? 40 : 0; return [208.5, 8, 47.5 + d]; }, cam: () => { const E = ctx.shared.eznChambers, d = E && E.mode === "outside" ? 40 : 0; return [200, 50, 36 + d]; }, info: "לשון המשנה (מידות ב, ה): ״וארבע לשכות היו בארבע מקצועותיה, של ארבעים ארבעים אמה. ולא היו מקורות... דרומית מזרחית, היא היתה לשכת הנזירים, ששם הנזירים מבשלין את שלמיהן, ומגלחין את שערן, ומשלחים תחת הדוד״.\nבקצרה — המחלוקת בכרטיס זה (הפירוט — במתג ״ארבע לשכות עזרת נשים — מקומן״ שבתפריט, תחת ״שיטות ומחלוקות״):\n• לתוספות יום טוב — במקצועותיה שבפנים (ברירת המחדל).\n• לרא״ש — מבחוץ, כציורו.\n**ברטנורא:** ״ומשלחים תחת הדוד״ — לשרוף את השיער באש שתחת היורה שמבשלים בה את השלמים, ככתוב ״ונתן על האש אשר תחת זבח השלמים״ (במדבר ו); ״קטרות״ — שאינן מקורות, מלשון ״קיטור הארץ״ — מעלות עשן, לפי שאין להן תקרה (ברטנורא מידות ב, ה).\n**תוספות יום טוב:** הלשכות במקצועות שבפנים — ולא כתמונה שנדפסה בוונציה, ששמה אותן מחוץ לעזרת הנשים; ואינו יודע אם מרובעות היו; ״לא היו מקורות״ — כדי לבשל בתוכן את זבח העם, שלמים, תודה ואיל נזיר (תוספות יום טוב מידות ב, ה).\n**תפארת ישראל:** הלשכות בפנים, כל אחת ארבעים אורך על ארבעים רוחב; ייחדו לשכה זו לבישול שלמי הנזיר, שהוא דבר של חול שאף בירושלים רשאי לעשותו, אלא שנזירים מעיירות אחרות אין להם מכיר בעיר, ולכן ייחדו להם לשכה בעזרה (תפארת ישראל מידות ב, ה).\n**המאירי:** ״לשכת הנזירים, ששם מבשלין את שלמיהם, שהיו טעונין לבשלם במקום קדש מצד הזרע בשלה הניתנת מהם לכהנים, ומגלחין את שערן, ומשלחין תחת הדוד בשבל שישרף״ (המאירי, מידות ב, ה).\nבמודל: הלשכה הדרומית־מזרחית של עזרת נשים, ארבעים על ארבעים אמה, בלא תקרה; בתוכה אש חיה, הדוד עומד עליה על שלוש אבנים ובו השלמים, וקווצות השיער על הגחלים — ״ומשלחים תחת הדוד״. ובה אנשים: נזיר יושב על שרפרף, שערו ארוך וסבוך — ״קדש יהיה גדל פרע שער ראשו״ (במדבר ו, ה) — והמגלח עומד מאחוריו, התער בידו — ״ומגלחין את שערן״; שניים עומדים אצל הדוד, פניהם אל האש, ושערם ארוך כמותו; על שולחן נמוך — סל המצות שהנזיר מביא עם איל השלמים, חלות ורקיקים (במדבר ו, טו; ו, יט); ואצל הכותל ערמת עצים לאש. הנזירים מצוירים כישראלים, בבגדי חול; מי היה המגלח — לא נכתב. צורת הדברים ומקומם, מספר האנשים, צורת השיער ואורכו, השולחן וצורת הסל — בחירות מודל.\nהדלת: בשיטת הרא״ש (הלשכות מבחוץ) — כותל בצד העזרה, ובו פתח ודלת, כבלשכת המצורעים. אין לה מקור — בחירת מודל.", refs: [["מידות ב, ה", "Mishnah_Middot.2.5"], ["ברטנורא ב, ה", "Bartenura_on_Mishnah_Middot.2.5"], ["תוי״ט ב, ה", "Tosafot_Yom_Tov_on_Mishnah_Middot.2.5"], ["תפא״י ב, ה", "Yachin_on_Mishnah_Middot.2.5"], ["המאירי מידות ב, ה", {"book": 6033, "index": 35}]] },
          { t: "לשכת העצים", tg: () => { const E = ctx.shared.eznChambers, d = E && E.mode === "outside" ? -40 : 0; return [208.5, 8, -47.5 + d]; }, cam: () => { const E = ctx.shared.eznChambers, d = E && E.mode === "outside" ? -40 : 0; return [200, 50, -36 + d]; }, info: "לשון המשנה (מידות ב, ה): ״מזרחית צפונית, היא היתה לשכת העצים, ששם הכהנים בעלי מומין מתליעין העצים. וכל עץ שנמצא בו תולעת, פסול מעל גבי המזבח״.\nבקצרה — המחלוקת בכרטיס זה (הפירוט — במתג ״ארבע לשכות עזרת נשים — מקומן״ שבתפריט, תחת ״שיטות ומחלוקות״):\n• לתוספות יום טוב — במקצועותיה שבפנים (ברירת המחדל).\n• לרא״ש — מבחוץ, כציורו.\n**שמה:** במשנה — ״לשכת העצים״; וברמב״ם (בית הבחירה ה, ח): ״מזרחית צפונית לשכת דיר העצים ששם כהנים בעלי מומין מתליעים בעצים. שכל עץ שנמצא בו תולעת פסול״.\n**ברטנורא:** ״מתליעין בעצים״ — מסירים את העצים שנמצאה בהם תולעת, לפי שהם פסולים למערכה (ברטנורא מידות ב, ה).\n**תוספות יום טוב:** ״מתליעין״ — כמו ״מסקלין״, על הרמת האבנים (הרמב״ם); לפסול עץ שיש בו תולעת לא ראה סמך מן הכתוב, ובמנחות (פה:) בעי רבא אם לוקה עליו משום בעל מום — תיקו; ואמר שמואל: לא שנו אלא לח, אבל יבש — גוררו וכשר (תוספות יום טוב מידות ב, ה).\n**תפארת ישראל:** בעלי המומין בודקים את העצים להסיר כל עץ שהתליע בלח; ולשכה זו בצפון, שהעצים לקרבנות הנשחטים בצפון, ובמזרח — רחוק מן המקדש, שאינם ראויים עדיין עד אחר ההתלעה (תפארת ישראל מידות ב, ה).\nבמודל: הלשכה הצפונית־מזרחית של עזרת נשים, בלא תקרה. בתוכה עשרים ואחת ערמות בגדלים שונים: ערמות גדולות של גזרים, בינוניות וקטנות, וערמות קטנות של עצים חתוכים זה על גב זה; בכל שורה של ערמה גזר אחד פחות. שלושה מיני עצים, כמשנה (תמיד ב, ג): ״כל העצים כשרין למערכה, חוץ משל זית ושל גפן. אבל באלו רגילין, במרביות של תאנה ושל אגוז ושל עץ שמן״. מעבר פנוי מן הפתח. מספר הערמות, גודלן, מקומן ואיזה עץ בכל אחת — בחירת מודל.\nהרצפה המשונה: במשנה (שקלים ו, ב): ״מעשה בכהן אחד שהיה מתעסק, וראה הרצפה שהיא משנה מחברותיה. בא ואמר לחברו. לא הספיק לגמר את הדבר עד שיצתה נשמתו, וידעו ביחוד ששם הארון נגנז״. ובגמרא (יומא נד.): ״וחכמים אומרים: ארון בלשכת דיר העצים היה גנוז״.\nבמודל: אבן אחת ברצפת הלשכה, שונה בגוונה ומוגבהת מעט; מקומה בלשכה — בחירת מודל.\nהדלת: בשיטת הרא״ש (הלשכות מבחוץ) — כותל בצד העזרה, ובו פתח ודלת, כבלשכת המצורעים. אין לה מקור — בחירת מודל.", refs: [["מידות ב, ה", "Mishnah_Middot.2.5"], ["ברטנורא ב, ה", "Bartenura_on_Mishnah_Middot.2.5"], ["תוי״ט ב, ה", "Tosafot_Yom_Tov_on_Mishnah_Middot.2.5"], ["תפא״י ב, ה", "Yachin_on_Mishnah_Middot.2.5"], ["מנחות פה:", "Menachot.85b"], ["שקלים ו, ב", "Mishnah_Shekalim.6.2"], ["יומא נד.", "Yoma.54a"], ["תמיד ב, ג", {"book": 88, "index": 9}], ["רמב״ם בית הבחירה ה, ח", {"book": 337, "index": 83}]] },
          { t: "לשכת המצורעים", action: () => { if (ctx.shared.openFor) ctx.shared.openFor("crt-lishkot-roofs", 15000); }, tg: () => { const E = ctx.shared.eznChambers, d = E && E.mode === "outside" ? -40 : 0; return [113.5, 7, -47.5 + d]; }, cam: () => { const E = ctx.shared.eznChambers, d = E && E.mode === "outside" ? -40 : 0; return [120.5, 30, -38.5 + d]; }, info: "לשון המשנה (מידות ב, ה): ״צפונית מערבית, היא היתה לשכת מצרעים״.\nבקצרה — המחלוקת בכרטיס זה (הפירוט — במתג ״ארבע לשכות עזרת נשים — מקומן״ שבתפריט, תחת ״שיטות ומחלוקות״):\n• לתוספות יום טוב — במקצועותיה שבפנים (ברירת המחדל).\n• לרא״ש — מבחוץ, כציורו.\n**ברטנורא:** ששם המצורעים טובלים בשמיני לטהרתם, כשבא להכניס ידו בפנים למתן בהונות, ואף על פי שטבל מבערב (ברטנורא מידות ב, ה).\n**תוספות יום טוב:** הואיל וטבל מבערב רשאי להיכנס לעזרת נשים, ״שאין טבול יום נכנס לשם״ (כלים א, ח) — ולכן אין צורך לומר שהלשכה לא נתקדשה (ר׳ שמעיה), ולא כתמונה שהעמידה את הלשכות מבחוץ; וכן התוספות (יומא ל.): לשכת המצורעים עומדת בעזרת נשים, והיא אחת מארבע לשכותיה (תוספות יום טוב מידות ב, ה).\n**תפארת ישראל:** אחר שטבל בשביעי והעריב שמשו רשאי להיכנס לעזרת נשים, אלא שעדיין מחוסר כיפורים ואסור בעזרת ישראל עד שיביא קרבנותיו בשמיני; וכשצריך להכניס בהונותיו למתן דם ושמן — טובל בלשכה זו וממתין שם; ומקומה בצפון, שהמצורעים מוכנים לקרבן, וכל קדשי הקדשים נשחטים בצפון (תפארת ישראל מידות ב, ה).\nבור המים: ״אמה על אמה ברום שלש אמות. ושיערו חכמים מי מקוה ארבעים סאה״ (עירובין ד:; יומא לא.).\nבמודל: הלשכה הצפונית־מערבית של עזרת נשים, בלא תקרה; בור של אמה על אמה, עמוק שלוש אמות, חצוב ברצפה, ומימיו קרוב לשפתו (מקומו בלשכה — בחירת מודל).\nהדלת: אין לה מקור — בחירת מודל. בברירת המחדל (הלשכות במקצועות שבפנים) — שתי כנפות ארז בפתח הלשכה; ובשיטת הרא״ש (הלשכות מבחוץ) — כותל בצד העזרה, ובו פתח ודלת; וכך בכל ארבע הלשכות.\n**הגמרא** (יומא ל:): ״מצורע — טובל ועומד בשער ניקנור. רבי יהודה אומר: אינו צריך טבילה, שכבר טבל מבערב״; ולמה נקראת כך — ״לשכת המצורעין ששם מצורעין טובלין. רבי יהודה אומר: לא מצורעין בלבד אמרו, אלא כל אדם״.\nבית הטבילה: הלשכה עצמה — ״ולא היו מקורות״ (מידות ב, ה). במודל: סביב הבור בית קטן של אבן, מקורה, ופתחו למזרח, לצד דלת הלשכה; ובו ספסל אבן, ובבור סולם עץ. בצפייה בלשכה התקרה נפתחת, ורואים את הבור מבפנים. הבית, מידותיו, הספסל והסולם — בחירת מודל.", refs: [["מידות ב, ה", "Mishnah_Middot.2.5"], ["ברטנורא ב, ה", "Bartenura_on_Mishnah_Middot.2.5"], ["תוי״ט ב, ה", "Tosafot_Yom_Tov_on_Mishnah_Middot.2.5"], ["תפא״י ב, ה", "Yachin_on_Mishnah_Middot.2.5"], ["כלים א, ח", "Mishnah_Kelim.1.8"], ["עירובין ד:", "Eruvin.4b"], ["יומא לא.", "Yoma.31a"], ["יומא ל:", "Yoma.30b"]] },
          { t: "לשכת שמנים", tg: () => { const E = ctx.shared.eznChambers, d = E && E.mode === "outside" ? 40 : 0; return [113.5, 8, 47.5 + d]; }, cam: () => { const E = ctx.shared.eznChambers, d = E && E.mode === "outside" ? 40 : 0; return [122, 50, 36 + d]; }, info: "לשון המשנה (מידות ב, ה): ״מערבית דרומית, אמר רבי אליעזר בן יעקב, שכחתי מה היתה משמשת. אבא שאול אומר, שם היו נותנין יין ושמן, היא היתה נקראת לשכת בית שמניה״.\nבקצרה — ״אמר רבי אליעזר בן יעקב, שכחתי מה היתה משמשת. אבא שאול אומר, שם היו נותנין יין ושמן״ (מידות ב, ה). ומקום ארבע הלשכות (במתג ״ארבע לשכות עזרת נשים — מקומן״): לתוספות יום טוב — במקצועותיה שבפנים (ברירת המחדל); לרא״ש — מבחוץ, כציורו.\n**ברטנורא:** ״אמר רבי אליעזר בן יעקב שכחתי״ — מכלל שכל תחילת המשנה רבי אליעזר בן יעקב אמרה, וכך מוכח בגמרא (יומא טז.), שסתם משנת מידות רבי אליעזר בן יעקב (ברטנורא מידות ב, ה).\n**תוספות יום טוב:** דיוק כזה דייקו בגמרא גם במשנת סוף קינים (זבחים פרק ז) (תוספות יום טוב מידות ב, ה).\n**תפארת ישראל:** ייחדו לכל לשכה מקום הראוי לה: לשכת השמנים במערבית־דרומית, לפי שמקום ניסוך היין במזבח — בקרן מערבית־דרומית, וגם המנורה בדרום (תפארת ישראל מידות ב, ה).\nמנחות (ח, ז), על היין: ״לא היו כונסים אותו בחצבים גדולים, אלא בחביות קטנות. ואינו ממלא את החביות עד פיהם, כדי שיהא ריחו נודף״. ומנחות (ט, ב): ״שבע מדות של לח היו במקדש. הין, וחצי ההין, ושלישית ההין, ורביעית ההין, לג, וחצי לג, ורביעית לג״; רבי אליעזר בר צדוק: ״שנתות היו בהין״; רבי שמעון: ״לא היה שם הין״, אלא ״מדה יתרה של לג ומחצה היתה״.\nבמודל: הלשכה הדרומית־מערבית של עזרת נשים, בלא תקרה. בתוכה מדפי עץ לאורך הכתלים ושלושה מדפים עומדים, חמש קומות, מלאים כדי שמן; שש חביות קטנות של יין שאינן מלאות עד פיהן, ושבע המידות על שולחן אבן — לפי נפחן. המדפים, מספר הכדים וצורתם, ומקום המידות בלשכה זו — בחירת מודל.\nהדלת: בשיטת הרא״ש (הלשכות מבחוץ) — כותל בצד העזרה, ובו פתח ודלת, כבלשכת המצורעים. אין לה מקור — בחירת מודל.", refs: [["מידות ב, ה", "Mishnah_Middot.2.5"], ["ברטנורא ב, ה", "Bartenura_on_Mishnah_Middot.2.5"], ["תוי״ט ב, ה", "Tosafot_Yom_Tov_on_Mishnah_Middot.2.5"], ["תפא״י ב, ה", "Yachin_on_Mishnah_Middot.2.5"], ["יומא טז.", "Yoma.16a"], ["מנחות ח, ז", "Mishnah_Menachot.8.7"], ["מנחות ט, ב", "Mishnah_Menachot.9.2"]] },
          { t: "לשכת עושי חביתין", action: () => { if (ctx.shared.openFor) ctx.shared.openFor("crt-lishkot-roofs", 15000); }, tg: [98.6, 15.3, 22.6], cam: [98.6, 24.8, 26.0], info: "לשון המשנה (מידות א, ד): ״שבמזרח, שער נקנור, ושתי לשכות היו לו, אחת מימינו ואחת משמאלו, אחת לשכת פנחס המלביש, ואחת לשכת עושי חבתין״; (שקלים ה, א): ״אלו הן הממנין שהיו במקדש... פנחס על המלבוש״.\nבקצרה — המחלוקת בכרטיס זה (הפירוט — במתג ״חביתי כהן גדול — אפייה וטיגון״ שבתפריט, תחת ״שיטות ומחלוקות״):\n• לרבי יוחנן — אופה, ואחר כך מטגנה (ברירת המחדל).\n• לרבי חנינא — מטגנה, ואחר כך אופה.\n**ברטנורא:** פנחס המלביש — ממונה היה להלביש את הכהנים בשעת עבודה ולהפשיטם אחר עבודה ולשמור בגדי כהונה — ״בלשכות העשויות לכך״; לשכת עושי חביתין — בה עושים את מנחת כהן גדול שבכל יום, מחציתה בבוקר ומחציתה בערב, ונקראת חביתין על שם ״על מחבת בשמן תעשה״ (ויקרא ו) (ברטנורא מידות א, ד; ברטנורא שקלים ה, א).\n**תוספות יום טוב:** שער ניקנור — מפורש ביומא ג, י; ״ופנחס על המלבוש״ — הר״ב העתיק ״המלביש״, וכן בסדר המשנה שבירושלמי (תוספות יום טוב מידות א, ד; תוספות יום טוב שקלים ה, א).\n**תפארת ישראל:** הממונה הראשון נקרא פנחס, ונקראו כולם על שמו; ״על פיו נעשו בגדי כהונה, וברשותו נמסרים לכהן העובד וברשותו מחזירין אותן אח״כ״; לשכתו בצפון השער, סמוך לבית המטבחיים, שהכהן שהולבש ילך מיד לעבודתו; ובלשכת החביתין לשים ואופים את שתים עשרה החלות (תפארת ישראל מידות א, ד; תפארת ישראל שקלים ה, א).\nבמודל: שתי לשכות משני צדי השער — פנחס המלביש בצפון, ועושי חביתין בדרום; מקומן המדויק ביחס לשער — בחירת מודל.\n**איזו לשכה בצפון:** ללוח הציור של התוספות יום טוב ולתפארת ישראל, פנחס המלביש בימין הנכנס — בצפון. הלחם שמים חולק: ״וסתמו כפירושו משמע ימינו ושמאלו של שער... והוא דרום וצפון של עולם״ — ולדבריו פנחס בדרום. במודל — כתפארת ישראל.\n**החביתין — אפייה וטיגון** (מנחות נ:): ״חביתי כהן גדול, כיצד עושין אותן? רבי חייא בר אבא אמר רבי יוחנן: אופה, ואחר כך מטגנה. רבי אסי אמר רבי חנינא: מטגנה, ואחר כך אופה״ (בוחרים במתג ״חביתי כהן גדול — אפייה וטיגון״). העושים — כהנים: ״העמידו — מאותן כהנים עושי חביתים״ (המפרש לתמיד כח.). ובדברי הימים (א ט, לא): ״ומתתיה מן הלוים... באמונה על מעשה החבתים״ — לוי ממונה על המעשה; ורלב״ג שם: ״הנה מנחת כהן גדול היתה נקראת מנחת חבתים לפי שהיתה נעשית על מחבת בשמן״. במודל: בלשכת עושי חביתין — התנור פתוח, וגחלים בתחתיתו, וחלה דבוקה לדופנו מבפנים; ואצל הכותל המזרחי כירה, ועליה המחבת בשמן, וחלה מיטגנת בה; והעושה — כהן. צורת התנור, הכירה, המחבת ומקום העושה — בחירת מודל.\n**מקום הלשכה**: בקו הכותל המזרחי של העזרה, ופתחה לעזרת ישראל — כרמב״ם: ״ושתי לשכות אחרות היו שם בעזרת ישראל. אחת מימין שער מזרחי... ואחד משמאלו״ (בית הבחירה ה, יז); כתפארת ישראל: ״מזה ומזה לשער נקנור בפנים בעזרת ישראל״ (צורת בית המקדש, סימן יח); ובבועז (מידות ה, ב): ״באמת היו תוך עובי חומת עזרת ישראל, ואע״ג שהיו פתוחות לעזרת ישראל״. ותחתיה לשכת כלי השיר: פתחה לעזרת הנשים, והיא נמשכת אל מתחת לרצפת עזרת ישראל (מידות ב, ו). כמה היא בולטת מן הכותל, ומקומה מעל פתח לשכת כלי השיר — בחירת מודל.", refs: [["מידות א, ד", "Mishnah_Middot.1.4"], ["ברטנורא א, ד", "Bartenura_on_Mishnah_Middot.1.4"], ["תוי״ט א, ד", "Tosafot_Yom_Tov_on_Mishnah_Middot.1.4"], ["תפא״י א, ד", "Yachin_on_Mishnah_Middot.1.4"], ["שקלים ה, א", "Mishnah_Shekalim.5.1"], ["ברטנורא ה, א", "Bartenura_on_Mishnah_Shekalim.5.1"], ["תוי״ט ה, א", "Tosafot_Yom_Tov_on_Mishnah_Shekalim.5.1"], ["תפא״י ה, א", "Yachin_on_Mishnah_Shekalim.5.1"], ["יומא ג, י", "Mishnah_Yoma.3.10"], ["רמב״ם בית הבחירה ה, יז", "Mishneh_Torah,_The_Chosen_Temple.5.17"], ["מנחות נ:", {"book": 131, "index": 1746}], ["דברי הימים א ט, לא", {"book": 38, "index": 403}], ["רלב״ג דברי הימים א ט, לא", {"book": 3634, "index": 251}], ["מידות ב, ו", {"book": 89, "index": 17}], ["צורת בית המקדש לתפארת ישראל, סימן יח", {"book": 6029, "index": 47}], ["בועז מידות ה, ב", {"book": 1329, "index": 26}], ["לחם שמים מידות ה, ד", {"book": 1145, "index": 123}], ["המפרש לתמיד כח.", {"book": 2105, "index": 144}]] },
          { t: "לשכת פנחס המלביש", action: () => { if (ctx.shared.openFor) ctx.shared.openFor("crt-lishkot-roofs", 15000); }, tg: [98.6, 13.8, -24], cam: [99.5, 33, -20.5], info: "לשון המשנה (מידות א, ד): ״שבמזרח, שער נקנור, ושתי לשכות היו לו, אחת מימינו ואחת משמאלו, אחת לשכת פנחס המלביש, ואחת לשכת עושי חבתין״; (שקלים ה, א): ״אלו הן הממנין שהיו במקדש... פנחס על המלבוש״.\n**ברטנורא:** פנחס המלביש — ממונה היה להלביש את הכהנים בשעת עבודה ולהפשיטם אחר עבודה ולשמור בגדי כהונה — ״בלשכות העשויות לכך״; לשכת עושי חביתין — בה עושים את מנחת כהן גדול שבכל יום, מחציתה בבוקר ומחציתה בערב, ונקראת חביתין על שם ״על מחבת בשמן תעשה״ (ויקרא ו) (ברטנורא מידות א, ד; ברטנורא שקלים ה, א).\n**תוספות יום טוב:** שער ניקנור — מפורש ביומא ג, י; ״ופנחס על המלבוש״ — הר״ב העתיק ״המלביש״, וכן בסדר המשנה שבירושלמי (תוספות יום טוב מידות א, ד; תוספות יום טוב שקלים ה, א).\n**תפארת ישראל:** הממונה הראשון נקרא פנחס, ונקראו כולם על שמו; ״על פיו נעשו בגדי כהונה, וברשותו נמסרים לכהן העובד וברשותו מחזירין אותן אח״כ״; לשכתו בצפון השער, סמוך לבית המטבחיים, שהכהן שהולבש ילך מיד לעבודתו; ובלשכת החביתין לשים ואופים את שתים עשרה החלות (תפארת ישראל מידות א, ד; תפארת ישראל שקלים ה, א).\nבמודל: שתי לשכות משני צדי השער — פנחס המלביש בצפון, ועושי חביתין בדרום; מקומן המדויק ביחס לשער — בחירת מודל.\n**איזו לשכה בצפון:** ללוח הציור של התוספות יום טוב ולתפארת ישראל, פנחס המלביש בימין הנכנס — בצפון. הלחם שמים חולק: ״וסתמו כפירושו משמע ימינו ושמאלו של שער... והוא דרום וצפון של עולם״ — ולדבריו פנחס בדרום. במודל — כתפארת ישראל.\n**החלונות** (רמב״ם כלי המקדש ח, ח–ט): ״וששה ותשעים חלון היו במקדש להניח בהן הבגדים ארבעה חלונות לכל משמר. ושם כל משמר כתוב על חלונותיו. וכלן סתומות... כל המכנסים בחלון אחד וכתוב עליו מכנסים. וכל האבנטים בחלון אחד וכתוב עליו אבנט. וכן המצנפות כלן בחלון אחד. והכתנות כלן בחלון אחד״.\nבמודל: על הכותל הצפוני של הלשכה — ששה ותשעים חלונות, ארבעה לכל משמר, ועל כל ארבעה שם המשמר כסדר הגורלות (דברי הימים א כד, ז–יח). כולם סגורים, חוץ מארבעת חלונות המשמר העובד: ״וכשיכנסו אנשי משמר לעבודה בשבת שלהן פותחין חלונותיהן כל ימי שבתן״ (רמב״ם שם). במודל פתוחים חלונות המשמר הראשון, יהויריב — בחירת מודל. ולפני החלונות שולחן, ועליו כתונת לבנה מקופלת. מקום החלונות — במשנה (תמיד ה, ג): ״וחלונות היו שם, וכתוב עליהם תשמישי הכלים״. לתפארת ישראל הם בלשכה זו: ״שהיה שם צ״ו ארגזים תוך הכותלים... ד׳ ארגזים לכל משמר ומשמר... ועל כל דלת של כל הארגזים כתוב מה שיש בתוכו״ (צורת בית המקדש, סימן כ); ולרא״ש ולראב״ד — ״בלשכת הגזית בחומה״. במודל — כתפארת ישראל. גודל החלונות וסדרם — בחירת מודל.\n**מקום הלשכה**: בקו הכותל המזרחי של העזרה, ופתחה לעזרת ישראל — כרמב״ם: ״ושתי לשכות אחרות היו שם בעזרת ישראל. אחת מימין שער מזרחי... ואחד משמאלו״ (בית הבחירה ה, יז); כתפארת ישראל: ״מזה ומזה לשער נקנור בפנים בעזרת ישראל״ (צורת בית המקדש, סימן יח); ובבועז (מידות ה, ב): ״באמת היו תוך עובי חומת עזרת ישראל, ואע״ג שהיו פתוחות לעזרת ישראל״. ותחתיה לשכת כלי השיר: פתחה לעזרת הנשים, והיא נמשכת אל מתחת לרצפת עזרת ישראל (מידות ב, ו). כמה היא בולטת מן הכותל, ומקומה מעל פתח לשכת כלי השיר — בחירת מודל.", refs: [["מידות א, ד", "Mishnah_Middot.1.4"], ["ברטנורא א, ד", "Bartenura_on_Mishnah_Middot.1.4"], ["תוי״ט א, ד", "Tosafot_Yom_Tov_on_Mishnah_Middot.1.4"], ["תפא״י א, ד", "Yachin_on_Mishnah_Middot.1.4"], ["שקלים ה, א", "Mishnah_Shekalim.5.1"], ["ברטנורא ה, א", "Bartenura_on_Mishnah_Shekalim.5.1"], ["תוי״ט ה, א", "Tosafot_Yom_Tov_on_Mishnah_Shekalim.5.1"], ["תפא״י ה, א", "Yachin_on_Mishnah_Shekalim.5.1"], ["יומא ג, י", "Mishnah_Yoma.3.10"], ["רמב״ם בית הבחירה ה, יז", "Mishneh_Torah,_The_Chosen_Temple.5.17"], ["רמב״ם כלי המקדש ח, ח", {"book": 338, "index": 130}], ["רמב״ם כלי המקדש ח, ט", {"book": 338, "index": 131}], ["דברי הימים א כד, ז", {"book": 38, "index": 795}], ["מידות ב, ו", {"book": 89, "index": 17}], ["צורת בית המקדש לתפארת ישראל, סימן יח", {"book": 6029, "index": 47}], ["בועז מידות ה, ב", {"book": 1329, "index": 26}], ["לחם שמים מידות ה, ד", {"book": 1145, "index": 123}], ["תמיד ה, ג", {"book": 88, "index": 29}], ["צורת בית המקדש לתפארת ישראל, סימן כ", {"book": 6029, "index": 51}], ["פירוש הרא״ש תמיד לב:", {"book": 2224, "index": 267}], ["מלאכת שלמה תמיד ה, ג", {"book": 1202, "index": 242}]] },
          { t: "לשכות כלי השיר — תחת עזרת ישראל", tg: [88, 8.3, 24.4], cam: [112.5, 10.3, 22.4], info: "**המשנה** (מידות ב, ו): ״ולשכות היו תחת עזרת ישראל, ופתוחות לעזרת הנשים, ששם הלוים נותנים כנורות ונבלים ומצלתים וכל כלי שיר״.\nבמודל: שתי לשכות — ״ב׳ לשכות היו תחת עזרת ישראל ופתוחות לעזרת נשים״ (תפארת ישראל, צורת בית המקדש, סימן יז) — אחת מכל צד של חמש עשרה המעלות. פתחן הרחב ברצפת עזרת הנשים, מתחת ללשכת פנחס המלביש ומתחת ללשכת עושי חביתין, ומשם הן נמשכות מערבה, אל מתחת לרצפת עזרת ישראל — ״מחילות תחתיה״ (רבינו שמעיה). בתוכן כינורות תלויים על יתדות, נבלים עומדים, ומצלתיים על שולחן; ולוי מניח כינור במקומו. מקום הפתח מתחת לשתי הלשכות, רוחבו, עומק הלשכה, ומספר הכלים וצורתם — בחירת מודל.", refs: [["מידות ב, ו", {"book": 89, "index": 17}], ["רבינו שמעיה מידות ב, ו", {"book": 645, "index": 78}], ["צורת בית המקדש לתפארת ישראל, סימן יז", {"book": 6029, "index": 45}]] },
          { t: "לשכת הגזית — הסנהדרין", action: () => { if (ctx.shared.openFor) ctx.shared.openFor("crt-lishkot-roofs", 15000); }, tg: [79, 15, -66.5], cam: [79, 62, -50], info: "לשון המשנה (מידות ה, ד): ״לשכת הגזית, שם היתה סנהדרי גדולה של ישראל יושבת ודנה את הכהנה, וכהן שנמצא בו פסול, לובש שחורים ומתעטף שחורים, ויוצא והולך לו. ושלא נמצא בו פסול, לובש לבנים ומתעטף לבנים, נכנס ומשמש עם אחיו הכהנים. ויום טוב היו עושים, שלא נמצא פסול בזרעו של אהרן הכהן״.\n**ברטנורא:** הסנהדרין יושבת בצד החול שבה, שלשכת הגזית חציה בקודש וחציה בחול, ובחצי הקודש אי אפשר לשבת — ״שאין ישיבה בעזרה אלא למלכי בית דוד בלבד״ (ברטנורא מידות ה, ד).\n**תוספות יום טוב:** עשויה גזית לכבוד הסנהדרין; בקודש מפייסים (תמיד א, ב) ושם קוראים את שמע (תמיד ה, א), ולכל התשמישים אסיפת עם רב — ולפיכך גדולה הרבה משתי האחרות; מקומה בחול גבוה כגובה העזרה, ובפתחה לחול מעלות; ״ודנה את הכהונה״ — עיקר מעשיהם התדיר (הרמב״ם), ואף את הלויים (קידושין ד, ה); ״ברוך המקום״ — על שם שלשכת הגזית נקראת ״מקום״ — ״מן המקום אשר יבחר ה׳״ (סנהדרין יא, ב) (תוספות יום טוב מידות ה, ד).\n**תפארת ישראל:** בנויה באבני גזית מרובעות לכבוד הסנהדרין; חציה בקודש וחציה בחול, ושני פתחים לה, והסנהדרין יושבים בחצי החול (יומא כה.) — ״כמין בסילקי גדולה״; במזרח שתי הלשכות האחרות, ״והיה ארכה מצפון לדרום, כאורך לשכת עץ ולשכת גולה מצפון לדרום יחד״; דנים שם כל ענייני כהונה — ייחוס ומום — ואת הלויים, וכל דבר שיארע בישראל, ״כי משם דת ודין יוצא לכל ישראל״; ובבועז — מחזיקה כמאתיים בני אדם (תפארת ישראל מידות ה, ד; בועז ה, ב).\n**בועז** (מידות ה, ב): ״ואותן ג׳ הלשכות היה מקצת מהן בעזרת ישראל, ומקצת מהן בעזרת כהנים. ויהיה איך שיהיה היה לכה״פ קצת מג׳ לשכות ההן בעזרת ישראל״.\n**הגמרא** (יומא כה.): ״לשכת הגזית כמין בסילקי גדולה היתה, פייס במזרחה, וזקן יושב במערבה״. רש״י: ״וזקן — של ב״ד המורה להן סדר הפייסין יושב במערבה״. **המאירי** שם: הכהנים ״מתקבצים בחציה של קדש שהיה בצד מזרחה של לשכה״, ״וזקן מזקני הסנהדרין יושב בחציה של חול לצד מערבה של לשכה״; ושאל: ״האיך היתה חציה של חול לצד המערב וחציה שבקדש למזרח והדין היה נותן בהיפך״, ותירץ: ״אפשר שמצד הפתחים היה כן שחציה הבנוי במקום קדש ר״ל בצד המערב פתוח לחול וחציה שבמזרח פתוח במקום קדש״.\nבמודל: שלוש הלשכות — בניין אחד בצפון־מזרח העזרה, וגג אחד שווה לשלושתן: ״וגג שלשתן שוה״ (מידות ה, ד); רש״י (יומא יט.): ״וגג שלשתן שוה — קירוי אחד לשלשתן״. לשכת הגזית במזרח הבניין, ושתי הלשכות מאחוריה, במערבה — כשלטי הגיבורים שבתוספות יום טוב וכתפארת ישראל. מקומה כדברי הבועז: היא תופסת את אחת עשרה האמה של עזרת ישראל (מעל מעלות הדוכן) ואת אחת עשרה האמה של עזרת הכהנים, והבניין מסתיים עשר אמות מערבה משם. אורכה מצפון לדרום, כלשון תפארת ישראל — עשרים על עשרים ושתיים אמה מבפנים.\nחלוקת הלשכה במודל — מזרח ומערב, כלשון הגמרא והמאירי: **חציה המזרחי — הקודש**, ושם מקום הפייס; **חציה המערבי — החול**, ושם יושבים שבעים ואחד בשורה אחת, כחצי גורן, פניהם למזרח, הנשיא באמצע, ושני סופרי הדיינים לפניהם (סנהדרין ד, ג). הפתח לחול — במערב, ומעלות יורדות ממנו אל החיל; הפתח לקודש — בחציה המזרחי, בכותל הדרומי, אל עזרת הכהנים. פס נחושת ברצפה, מצפון לדרום, מסמן את הגבול. כיוון פניהם לשיטת המאירי — בחירת מודל. בקצרה — **תפארת ישראל** (צורת בית המקדש): ״בנויה חציה בדרום בקודש וחציה בצפון בחול״, והסנהדרין ״פניהם לדרום ואחוריהן לצפון״.\nהלשכה עומדת על קו כותל העזרה: חלקה הצפוני בנוי מחוץ לכותל, ורצפתו גבוהה כרצפת העזרה (תוספות יום טוב). **תוספות ישנים** (יומא כה.): ״דחציה בנויה בקדש וחציה בנויה בחול״.\nמידות האולם ומקומות הפתחים בכתליהם — בחירת מודל.\nהדמויות: הדיינים — בגלימה שחורה ובכיפה; הזקן לבן סמוך לנשיא שבאמצע, אפור בהמשך השורה ושחור־חום בקצותיה — על פי ״ושאר השבעים יושבין לפניו כפי שניהם וכפי מעלתם״ (רמב״ם, סנהדרין א, ג). התלמידים שלפניהם — בלי זקן, פניהם אל הדיינים. שני הסופרים — עומדים, ולוח בידם. צורת הדמויות, לבושן וצבעי הזקנים — בחירת מודל. שלוש שורות התלמידים (סנהדרין ד, ד) — לפניהם, לפי רש״י או יד רמה (בתפריט, תחת ״שיטות ומחלוקות״).\nסדר הישיבה: ״סנהדרין היתה כחצי גרן עגלה, כדי שיהו רואין זה את זה. ושני סופרי הדינין עומדין לפניהם, אחד מימין ואחד משמאל״ (סנהדרין ד, ג). רש״י (לו:): ״בעגולה היו יושבין כדי שיהו כולן רואין זה את זה, לפי שאם היו יושבין בשורה אין פני הראשונים רואין זה את זה״. במודל: שבעים ואחד בשורה אחת, כחצי גורן, על ספסל אחד, בחצי החול; הנשיא באמצע. הלשכה אינה יכולה לגדול מעבר לקו הסורג, ולכן השורה צפופה והדמויות מוקטנות — בחירת מודל. שורות התלמידים — בתפריט, תחת ״שיטות ומחלוקות״.", refs: [["מידות ה, ד", "Mishnah_Middot.5.4"], ["ברטנורא ה, ד", "Bartenura_on_Mishnah_Middot.5.4"], ["תוי״ט ה, ד", "Tosafot_Yom_Tov_on_Mishnah_Middot.5.4"], ["תפא״י ה, ד", "Yachin_on_Mishnah_Middot.5.4"], ["בועז ה, ב", "Boaz_on_Mishnah_Middot.5.2"], ["רמב״ם בית הבחירה ה, יז", "Mishneh_Torah,_The_Chosen_Temple.5.17"], ["יומא כה.", "Yoma.25a"], ["יומא יט.", "Yoma.19a"], ["סנהדרין א, ו", "Mishnah_Sanhedrin.1.6"], ["סנהדרין ד, ג", "Mishnah_Sanhedrin.4.3"], ["תמיד א, ב", "Mishnah_Tamid.1.2"], ["תמיד ה, א", "Mishnah_Tamid.5.1"], ["סנהדרין ד, ד", "Mishnah_Sanhedrin.4.4"], ["רש״י סנהדרין לו:", "Rashi_on_Sanhedrin.36.2"], ["רש״י סנהדרין לז.", "Rashi_on_Sanhedrin.37.1"], ["יד רמה סנהדרין לו:", "Yad_Ramah_on_Sanhedrin.36.2"], ["רש״י יומא יט.", "Rashi_on_Yoma.19.1"], ["רש״י יומא כה.", "Rashi_on_Yoma.25.1"], ["מאירי יומא כה.", "Meiri_on_Yoma.25.1"], ["תוספות ישנים יומא כה.", "Tosafot_Yeshanim_on_Yoma.25.1"], ["תפארת ישראל, צורת בית המקדש", "Tzurat_Beit_HaMikdash_Tiferet.66"], ["רמב״ם סנהדרין א, ג", "Rambam_Sanhedrin.1.3"]] },
          { t: "ארבעת הפייסות ו״ברקאי״ — הדגמה", action: () => { const P = ctx.shared.payis; if (P && typeof P.start === 'function') P.start(); }, info: "ההדגמה — מתג, כבויה כברירת מחדל; בלי קול, והכתוביות בלשון המקורות: סדר הבוקר, בלילה שהופך ליום — ארבעת הפייסות לפי סדרם, בדיקת העזרה באבוקות, ו״צאו וראו אם הגיע זמן השחיטה״.\nבקצרה — המחלוקות:\n• **היכן ומתי הפייס הראשון:** לרמב״ם — עם השני, בלשכת הגזית; לתפארת ישראל, כסדר המשנה — בלילה, בבית המוקד. ההדגמה הולכת אחר השיטה שנבחרה במתג ״הפייס הראשון — היכן ומתי״ שבתפריט, תחת ״שיטות ומחלוקות״.\n• **במה מפיסין** (יומא כד:): ״רב נחמן אמר: בבגדי חול, ורב ששת אמר: בבגדי קדש״. הרמב״ם (תמידין ומוספין ד, א): ״ומלבשין הן בבגדי כהנה״ — וכך הדמויות.\n• **האבנט** (יומא יב:): ״אבנטו של כהן הדיוט, רבי ורבי אלעזר ברבי שמעון, חד אמר: של כלאים, וחד אמר: של בוץ״. הרמב״ם (כלי המקדש ח, א): ״והאבנט לבדו רקום בצמר״ — וכך בדמויות, לפי המתג ״אבנטו של כהן הדיוט״; ובהדגמה, ברגע הבגדים, השיטה השנייה מוצגת לכמה שניות. על הבגדים עצמם — הכרטיס ״בגדי הכהנים״.\n• **מי קובע את המניין:** לרש״י ולברטנורא — הממונה; לרמב״ם (תמידין ומוספין ד, ג) — ״מסכימין על מנין שמונים מאה או אלף או כל מנין שיסכימו עליו״; לריטב״א, וכן פירשו בתוספות — ״זקן או כהן שתופס בפיו המנין שירצה״.\n• **לאיזה צד מונים:** בירושלמי (יומא ב, א) — ״לימין הפייס מהלך״, ויש שם: ״לשמאל הפייס מהלך״.\n• **הפייס הרביעי:** ״רבי אליעזר בן יעקב אומר, המעלה אברים לכבש הוא מעלה אותן על גבי המזבח״ (תמיד ה, ב); ברטנורא: ״ולא היה כאן פיס. ואין הלכה כרבי אליעזר בן יעקב״.\n**ארבעת הפייסות** (יומא ב, ב–ד): ״ארבעה פיסות היו שם, וזה הפיס הראשון״ — מי תורם את המזבח. ״הפיס השני, מי שוחט, מי זורק, ומי מדשן מזבח הפנימי, ומי מדשן את המנורה, ומי מעלה אברים לכבש, הראש והרגל, ושתי הידים, העקץ והרגל, החזה והגרה, ושתי הדפנות, והקרבים, והסלת, והחבתין, והיין. שלשה עשר כהנים זכו בו״. ״הפיס השלישי, חדשים לקטרת באו והפיסו. והרביעי, חדשים עם ישנים, מי מעלה אברים מן הכבש ולמזבח״.\n**כיצד מפיסין** — הברייתא (יומא כה.): ״לשכת הגזית כמין בסילקי גדולה היתה, פייס במזרחה, וזקן יושב במערבה. והכהנים מוקפין ועומדין כמין (ב)כוליאר, והממונה בא ונוטל מצנפת מראשו של אחד מהן, ויודעין שממנו פייס מתחיל״. **רש״י** (יומא כב.): ״הצביעו - הוציאו אצבעותיכם… ומוציא מפיו מנין או מאה או ששים הרבה יותר משהיו שם הכהנים ומתחיל למנות מזה שנטל מראשו המצנפת וסובב והולך ומונה וחוזר חלילה עד סוף המנין ומי שהמנין כלה בו הוא הזוכה וכן לכל הפייסות״. ומונים את האצבעות ולא את האנשים — ״אסור למנות את ישראל אפילו לדבר מצוה״ (יומא כב:).\n**״ברקאי״** (יומא ג, א): ״אמר להם הממנה, צאו וראו אם הגיע זמן השחיטה. אם הגיע, הרואה אומר, ברקאי. מתתיא בן שמואל אומר, האיר פני כל המזרח עד שבחברון. והוא אומר הן״. להיכן יצאו — **רש״י** (יומא כח.): ״על החומה או על הגג״, ״הרואה - זה שעלה לגג״; **ברטנורא**: ״על מקום גבוה שהיה להם במקדש״. **הרמב״ם** (תמידין ומוספין א, ב): ״שוחטין אותו קדם שתעלה החמה משיאור פני כל מזרח״.\n**העלייה בכבש** (יומא ד, ה): ״בכל יום כהנים עולים במזרחו של כבש ויורדין במערבו״ — וכך עולה ויורד הזוכה בתרומת הדשן. **השערים בלילה**: שערי המודל סגורים עד הבוקר; שער בית המוקד נפתח לממונה (״והם פתחו לו״), ואל העזרה יוצאים בפשפש — ״נטל את המפתח ופתח את הפשפש, ונכנס מבית המוקד לעזרה״ (תמיד א, ג).\nבמודל — בחירות מודל: שמונה־עשר כהנים במעגל, ושמונה ״חדשים״ בפייס השלישי; המספרים שנמנים — שישים ומאה, כדוגמאות שברש״י; צורת הדמויות (כל הבגדים לבנים, והזוכה מסומן בחץ שמעל ראשו); דרך האבוקות בעזרה; מקום הרואה — בראש כותל המזרח של העזרה, מעל לשכת הגזית, ושני סולמות אליו; ומשך כל שלב. בזמן ההדגמה גגות הלשכות פתוחים והתוויות מוסתרות, ובסופה היום חוזר. לחיצה על המודל, או שוב על הכפתור, עוצרת אותה.", refs: [["יומא ב, ב", "Mishnah_Yoma.2.2"], ["יומא ב, ג", "Mishnah_Yoma.2.3"], ["יומא ב, ד", "Mishnah_Yoma.2.4"], ["יומא ג, א", "Mishnah_Yoma.3.1"], ["יומא כה.", "Yoma.25a"], ["רש״י יומא כב.", "Rashi_on_Yoma.22.1"], ["יומא כב:", "Yoma.22b"], ["יומא כד:", "Yoma.24b"], ["רש״י יומא כח.", "Rashi_on_Yoma.28.1"], ["ברטנורא יומא ג, א", "Bartenura_on_Mishnah_Yoma.3.1"], ["רמב״ם תמידין ומוספין א, ב", "Mishneh_Torah,_Daily_Offerings_and_Additional_Offerings.1.2"], ["רמב״ם תמידין ומוספין ד, א", "Mishneh_Torah,_Daily_Offerings_and_Additional_Offerings.4.1"], ["רמב״ם תמידין ומוספין ד, ג", "Mishneh_Torah,_Daily_Offerings_and_Additional_Offerings.4.3"], ["ריטב״א יומא כב.", "Ritva_on_Yoma.22.1"], ["ירושלמי יומא ב, א", "Jerusalem_Talmud_Yoma.2.1"], ["תמיד ה, ב", "Mishnah_Tamid.5.2"], ["ברטנורא תמיד ה, ב", "Bartenura_on_Mishnah_Tamid.5.2"], ["יומא יב:", "Yoma.12b"], ["רמב״ם כלי המקדש ח, א", "Rambam_Klei_HaMikdash.8.1"], ["יומא ד, ה", "Mishnah_Yoma.4.5"], ["תמיד א, ג", "Mishnah_Tamid.1.3"]], noTour: true },
          { t: "בגדי הכהנים", action: () => { const P = ctx.shared.payis; if (P && typeof P.garments === 'function') P.garments(15000); }, tg: [78.5, 17.9, 0], cam: [85.4, 18.7, 0], info: "ארבעת בגדי כהן הדיוט, כפי שהם על הכהנים שבהדגמת הפייסות. לחיצה כאן מעמידה שלושה כהנים בעזרת הכהנים, ממזרח למזבח, לרבע דקה — מלפנים, מהצד ומאחור.\n**הרמב״ם** (כלי המקדש ח, א): ״בגדי כהן הדיוט הם ארבעה כלים כתנת ומכנסים ומגבעות ואבנט. וארבעתן של פשתן לבנים וחוטן כפול ששה. והאבנט לבדו רקום בצמר״.\n**הכתונת** (שם ח, טז–יז): ״משבצת היתה שהיא בתים בתים באריגתה… ובית יד שלה נארג בפני עצמו ומחברין אותו עם גוף הכתנת בתפירה״; ״ארך הכתנת עד למעלה מן העקב. וארך בית יד שלה עד פס ידו. ורחבו כרחב היד״.\n**המכנסיים** (שם ח, יח): ״ממתנים עד ירכים שהוא למעלה מן הטבור קרוב מן הלב עד סוף הירך שהוא הארכובה״ — הם תחת הכתונת, ואינם נראים במודל.\n**המגבעת** (שם ח, ב; ח, יט): ״ומצנפת האמורה באהרן היא המגבעת האמורה בבניו. אלא שכהן גדול צונף בה כמי שלופף על השבר. ובניו צונפין בה ככובע ולפיכך נקראת מגבעת״; ״המצנפת של כהן גדול או הדיוט ארכו שש עשרה אמות״.\n**האבנט** (שם ח, יט; י, א): ״רחבו כמו שלש אצבעות וארכו שנים ושלשים אמה. מקיפו ומחזירו כרך על גבי כרך״; ״חוגר את האבנט כנגד אצילי ידיו״. וכן בגמרא (זבחים יח:–יט.): ״אין חוגרין לא למטה ממתניהן, ולא למעלה מאציליהן, אלא כנגד אצילי ידיהן״.\n**סדר הלבישה** (שם י, א–ב): ״לובש המכנסים תחלה… ואחר כך לובש הכתנת. ואחר כך חוגר את האבנט… ואחר כך צונף במצנפת כמין כובע״.\nבקצרה — המחלוקות:\n• **האבנט — של כלאים או של בוץ** (יומא יב:): ״אבנטו של כהן הדיוט, רבי ורבי אלעזר ברבי שמעון, חד אמר: של כלאים, וחד אמר: של בוץ״. **כסף משנה** (על הרמב״ם שם): ״שרבי אומר של כלאים ורבי אלעזר בר״ש אומר של בוץ וידוע שהלכה כרבי מחבירו״. ועל הכתוב (שמות לט, כט) ״ואת האבנט שש משזר ותכלת וארגמן ותולעת שני מעשה רקם״ — **רשב״ם**: ״בדבר הזה נחלקו רבותינו אם מדבר מאבנט של הדיוט או בכהן גדול לבדו״. במודל — המתג ״אבנטו של כהן הדיוט״ שבתפריט, תחת ״שיטות ומחלוקות״; ברירת המחדל כרמב״ם.\n• **צורת המגבעת:** **רש״י** (שמות כח, ד): ״מצנפת. כמין כפת כובע… שהרי במקום אחר קורא להם מגבעות ומתרגמינן כובעין״. **רמב״ן** (שמות כח, לא): ״וגם זה אינו, שהרי אמרו שהמצנפת ארכה שש עשרה אמה, והרי הוא כעין צניף שצונף בו את ראשו, מגלגל ומחזיר מגלגל ומחזיר סביב ראשו כפל על כפל״; ובכהן הדיוט — ״ואף היא מצנפת היא, אלא שקושר בה כל ראשו ומעלה הכפלים עליו כעין מגבעת שהוא קובע״. **אבן עזרא** (שמות כח, לו): ״כדמות אלה שישימו הזכרים באלה הארצות על הראש שיכסו הראש והם גבוהים״. במודל — גבוהה, כרוכה, ומעוגלת בראשה.\n• **במה מפיסין** (יומא כד:): ״רב נחמן אמר: בבגדי חול, ורב ששת אמר: בבגדי קדש״; הרמב״ם (תמידין ומוספין ד, א): ״ומלבשין הן בבגדי כהנה״.\n**הצבעים** — הרמב״ם (שם ח, יג): ״ותכלת האמורה בכל מקום היא הצמר הצבוע כעצם שמים שהוא פתוך מן הכחל. הארגמן הוא הצמר הצבוע אדום. ותולעת השני הוא הצמר הצבוע בתולעת״.\nבמודל — בחירות מודל: צורת הדמויות נבנתה בעקבות ציורי האתר ״בית המקדש השלישי״ (״כהן הדיוט לבוש 4 בגדים״); תווי הפנים, צבע הזקן ואורכו; האבנט מצויר כרך אחד, ורחב מעט משלוש אצבעות כדי שייראה; אריגתו — חוטים דקים שזורים, שצבעיהם מתמזגים לגוון אחד.", refs: [["רמב״ם כלי המקדש ח, א", "Rambam_Klei_HaMikdash.8.1"], ["רמב״ם כלי המקדש ח, ב", "Rambam_Klei_HaMikdash.8.2"], ["רמב״ם כלי המקדש ח, יג", "Rambam_Klei_HaMikdash.8.13"], ["רמב״ם כלי המקדש ח, טז", "Rambam_Klei_HaMikdash.8.16"], ["רמב״ם כלי המקדש ח, יז", "Rambam_Klei_HaMikdash.8.17"], ["רמב״ם כלי המקדש ח, יח", "Rambam_Klei_HaMikdash.8.18"], ["רמב״ם כלי המקדש ח, יט", "Rambam_Klei_HaMikdash.8.19"], ["רמב״ם כלי המקדש י, א", "Rambam_Klei_HaMikdash.10.1"], ["רמב״ם כלי המקדש י, ב", "Rambam_Klei_HaMikdash.10.2"], ["זבחים יח:", "Zevachim.18b"], ["יומא יב:", "Yoma.12b"], ["כסף משנה כלי המקדש ח, א", "Kesef_Mishneh_on_Klei_HaMikdash.8.1"], ["שמות לט, כט", "Exodus.39.29"], ["רשב״ם שמות לט, כט", "Rashbam_on_Exodus.39.29"], ["רש״י שמות כח, ד", "Rashi_on_Exodus.28.4"], ["רמב״ן שמות כח, לא", "Ramban_on_Exodus.28.31"], ["אבן עזרא שמות כח, לו", "Ibn_Ezra_on_Exodus.28.36"], ["יומא כד:", "Yoma.24b"], ["רמב״ם תמידין ומוספין ד, א", "Mishneh_Torah,_Daily_Offerings_and_Additional_Offerings.4.1"]] },
          { t: "לשכת העץ — לשכת כהן גדול (פרהדרין)", action: () => { if (ctx.shared.openFor) ctx.shared.openFor("crt-lishkot-roofs", 15000); }, tg: [65, 16.5, -62.6], cam: [65, 46, -61.4], info: "לשון המשנה (מידות ה, ד): ״שבדרום, לשכת העץ, לשכת הגולה, לשכת הגזית. לשכת העץ, אמר רבי אליעזר בן יעקב, שכחתי מה היתה משמשת. אבא שאול אומר, לשכת כהן גדול, והיא היתה אחורי שתיהן, וגג שלשתן שוה״; (יומא א, א): ״שבעת ימים קדם יום הכפורים מפרישין כהן גדול מביתו ללשכת פלהדרין״.\nבקצרה — ״לשכת העץ, אמר רבי אליעזר בן יעקב, שכחתי מה היתה משמשת. אבא שאול אומר, לשכת כהן גדול״ (מידות ה, ד); ולמה נקראת ״העץ״ — לראב״ד של עץ הייתה, ותוספות יום טוב דוחה.\n**ברטנורא:** היא לשכת פרהדרין שבריש יומא; ״וגג שלשתן שוה״ — קירוי אחד לשלושתן; ״פקידי המלך נקראים פלהדרין״ — הכהנים הגדולים שבבית שני אחר שמעון הצדיק היו נותנים ממון לשמש בכהונה גדולה ומתחלפים כל שנים עשר חודש כפקידי המלך, ״לכך נקראת לשכה זו לשכת פלהדרין״ (ברטנורא מידות ה, ד; ברטנורא יומא א, א).\n**תוספות יום טוב:** נוסח אחר ״שבצפון״ (יומא יט.); הרמב״ם הפך את הסדר — הגזית, הגולה, העץ — שהתנא מונה כאן דרך שמאל; ולמה ״העץ״? הראב״ד: של עץ הייתה, ואין איסור ״לא תטע לך אשרה כל עץ״ אלא אצל המזבח; והתוי״ט דוחה, ולדעתו — כהיפך ״בית האבן״ של הפרשת הפרה; בנויה בקודש ופתוחה לחול ותוכה חול (מעשר שני ג, ח), ולכן יושב בה כהן גדול; ״אחורי שתיהן״ — לשלטי הגיבורים: הגזית במזרח, והגולה והעץ אחריה (תוספות יום טוב מידות ה, ד).\n**תפארת ישראל:** היא לשכת פרהדרין; נקראת ״העץ״ לא שהייתה של עץ — שאסור לבנות עץ בולט מעזרת ישראל ולפנים — אלא להזכיר לכהן גדול שאם יקלקל מעשיו יהיה כעץ העשוי להירקב, ואם יתקנם — יאריך ימים ״כימי עץ ימי עמי״; לשכת הגזית במזרח שתיהן, והעץ והגזית סמוכות לכותל העזרה ופתוחות לחול, שאם לא כן אסור לסנהדרין ולכהן גדול לישב בהן; ובבועז — אפשר שהכותל שבחול היה של עץ, למוסר ולענווה (תפארת ישראל מידות ה, ד; בועז ה, ד).\n**איזו בצפון ואיזו בדרום:** בגמרא (יומא יט.) — ״ולא ידענא אי לשכת פרהדרין בצפון ולשכת בית אבטינס בדרום, או לשכת בית אבטינס בצפון ולשכת פרהדרין בדרום. ומסתברא דלשכת פרהדרין בדרום הואי״. ולרמב״ם (בית הבחירה ה, יז) לשכת העץ, מן השלוש שבצפון, ״היא הנקראת לשכת פרהדרין״ — וכן לברטנורא ולתפארת ישראל. במודל — כרמב״ם.\n**תוספות** (יומא ח:): ״ללשכת פרהדרין שהיתה בנויה בקודש ואפילו את״ל שהיתה פתוחה לחול״. **תוספות רי״ד** (יומא כה.): ״דבתוך העזרה קיימא״. ובלשון **תוספות יום טוב**: ״שאע״פ שהיתה בנויה בקדש היתה פתוחה לחול״, ״ולא היה לזו פתח כלל אל הקדש״, ״והיו לה מעלות אשר יעלו עליה מן החול שהיא נמוך ממקומה של הלשכה שהיא בעזרה״.\nבמודל: הלשכה בתוך העזרה, סמוכה לכותלה הצפוני — החלק הצפוני־מערבי של בניין שלוש הלשכות: במערבה של לשכת הגזית ובצפונה של לשכת הגולה, כלשון שלטי הגיבורים שבתוספות יום טוב: ״ונמצאת אומר שלשכת העץ אחורי דגזית ממש שהרי במערב שלה היא. וגם היא אחורי דגולה שהגולה היא בדרום״. פתחה היחיד — לצפון, דרך כותל העזרה, אל החיל; וחמש מעלות בעובי הכותל עולות אליה מן החיל. גגה וגג שתי האחרות — גג אחד שווה: ״קירוי אחד לשלשתן״ (רש״י יומא יט.). רוחבה מבפנים ארבע אמות (בועז: ״ובצדה למערב לשכה שלכה״פ היה רחבה ד׳ אמות, מלבד עובי כותלים שמפסיק בין גזית לפלהדרין״). אורכה, מקום הפתח בכותל, והריהוט — דירת כהן גדול לשבעת הימים — בחירת מודל. לשכתו השנייה של כהן גדול — בית אבטינס, על גבי שער המים שבדרום — כרטיס משלה.\n**המזוזה** (יומא י.): ״תנו רבנן: כל הלשכות שהיו במקדש לא היו להן מזוזה, חוץ מלשכת פרהדרין, שהיה בה בית דירה לכהן גדול״.\n**שבעת הימים** (יומא א, ג): ״מסרו לו זקנים מזקני בית דין, וקורין לפניו בסדר היום, ואומרים לו: אישי כהן גדול! קרא אתה בפיך, שמא שכחת או שמא לא למדת״.\nבמודל: מזוזה על עמוד הפתח המערבי — מימין הנכנס מן החיל (יומא יא:), בטפח החיצון (מנחות לג:), בתחילת השליש העליון של הפתח (מנחות לג.); ובפנים זקן קורא לפני כהן גדול מתוך מגילה, וכהן גדול בבגדיו שלו. מראה המזוזה, הדמויות ומקומן — בחירת מודל.", refs: [["מידות ה, ד", "Mishnah_Middot.5.4"], ["ברטנורא ה, ד", "Bartenura_on_Mishnah_Middot.5.4"], ["תוי״ט ה, ד", "Tosafot_Yom_Tov_on_Mishnah_Middot.5.4"], ["תפא״י ה, ד", "Yachin_on_Mishnah_Middot.5.4"], ["בועז ה, ד", "Boaz_on_Mishnah_Middot.5.4"], ["יומא א, א", "Mishnah_Yoma.1.1"], ["ברטנורא א, א", "Bartenura_on_Mishnah_Yoma.1.1"], ["רמב״ם בית הבחירה ה, יז", "Mishneh_Torah,_The_Chosen_Temple.5.17"], ["יומא יט.", "Yoma.19a"], ["תוספות יומא ח:", "Tosafot_on_Yoma.8.2"], ["תוספות רי״ד יומא כה.", "Tosafot_Rid_on_Yoma.25.1"], ["רש״י יומא יט.", "Rashi_on_Yoma.19.1"], ["בועז ה, ב", "Boaz_on_Mishnah_Middot.5.2"], ["יומא י.", {"book": 107, "index": 208}], ["יומא א, ג", {"book": 55, "index": 4}], ["יומא יא:", {"book": 107, "index": 245}], ["מנחות לג:", {"book": 131, "index": 1143}], ["מנחות לג.", {"book": 131, "index": 1137}], ["יומא יט. (ומסתברא)", {"book": 107, "index": 410}]] },
          { t: "לשכת הגולה", action: () => { if (ctx.shared.openFor) ctx.shared.openFor("crt-lishkot-roofs", 15000); }, tg: [65, 16.5, -57.2], cam: [65, 46, -56.2], info: "לשון המשנה (מידות ה, ד): ״לשכת הגולה, שם היה בור קבוע, והגלגל נתון עליו, ומשם מספיקים מים לכל העזרה״.\n**ברטנורא:** על שם בור שכרו שם עולי גולה (ברטנורא מידות ה, ד).\n**תוספות יום טוב:** ״בור קבוע״ — תמה; בספרים אחרים ״בור הגולה״, ולר׳ יהונתן: ״שם בור והגולה קבוע בו והגלגל נתון עליו״ — ״גולה״ כמו ״וגלה על ראשה״ (זכריה ד), ספל גדול עגול ששואבים בו בגלגל; והראבי״ה: נקראת על שם הגלגל שבו משלשלים את הכיור שלא ייפסל בלינה, ובני הגולה כרו שם בור לשקעו, שלא היה ים שעשה שלמה; ״מספיקים מים לכל העזרה״ — מים מתוקים לשתייה, ואמת המים להדחה (ר׳ שמעיה) (תוספות יום טוב מידות ה, ד).\n**תפארת ישראל:** ״הגולה״ גרסינן — ספל שממלאים אותו בכל יום ממימי הבור, קבוע בכותל או ברצפה, והגלגל מעל הבור לשאוב בדלי; ותמה על הר״ב — וכי בור זה בלבד עשו בני הגולה, הרי כל המקדש עשו; מי האמה — להדחה, ומים אלו — מתוקים לבישול ולשתייה (תפארת ישראל מידות ה, ד).\nבמודל: הבור, הגלגל, החבל והדלי. הלשכה היא החלק הדרומי־מערבי של בניין שלוש הלשכות שבצפון־מזרח העזרה — מאחורי לשכת הגזית, ומדרום ללשכת העץ — כלשון שלטי הגיבורים שבתוספות יום טוב: ״והיתה לשכת הגולה לדרום של גזית ולשכת העץ בצפון של גזית״; וגג אחד שווה לשלושתן. פתחה לדרום, אל העזרה. רוחבה כרוחב לשכת העץ; אורכה, מקום פתחה וגודל הבור — בחירת מודל.", refs: [["מידות ה, ד", "Mishnah_Middot.5.4"], ["ברטנורא ה, ד", "Bartenura_on_Mishnah_Middot.5.4"], ["תוי״ט ה, ד", "Tosafot_Yom_Tov_on_Mishnah_Middot.5.4"], ["תפא״י ה, ד", "Yachin_on_Mishnah_Middot.5.4"], ["רמב״ם בית הבחירה ה, יז", "Mishneh_Torah,_The_Chosen_Temple.5.17"], ["יומא יט.", "Yoma.19a"], ["רש״י יומא יט.", "Rashi_on_Yoma.19.1"]] },
          { t: "בית המוקד", action: () => { if (ctx.shared.openFor) ctx.shared.openFor("crt-lishkot-roofs", 15000); }, tg: [-18, 16, -67.5], cam: [-18, 66, -53], info: "לשון המשנה (מידות א, ו): ״וארבע לשכות היו בבית המוקד, כקיטונות פתוחות לטרקלין, שתים בקדש ושתים בחל, וראשי פספסין מבדילין בין קדש לחל. ומה היו משמשות. מערבית דרומית, היא היתה לשכת טלאי קרבן. דרומית מזרחית, היא היתה לשכת עושי לחם הפנים. מזרחית צפונית, בה גנזו בני חשמונאי את אבני המזבח ששקצום מלכי יון. צפונית מערבית, בה יורדים לבית הטבילה״; (א, ח): ״בית המוקד, כפה, ובית גדול היה, מקף רובדין של אבן, וזקני בית אב ישנים שם, ומפתחות העזרה בידם, ופרחי כהנה, איש כסתו בארץ״; (א, ט): ״ומקום היה שם, אמה על אמה, וטבלא של שיש וטבעת היתה קבועה בה, ושלשלת שהמפתחות היו תלויות בה״.\nבקצרה — המחלוקות בכרטיס זה (הפירוט — במתגים שבתפריט, תחת ״שיטות ומחלוקות״):\n• **הפייס הראשון — היכן ומתי:** לתפארת ישראל, כסדר המשנה — בלילה, בחצי בית המוקד שבקודש (ברירת המחדל; הולך אחר המתג ״סדר עבודת הבוקר״); לרמב״ם — עם הפייס השני, בלשכת הגזית, סמוך לעלות השחר.\n• **שערי בית המוקד:** לרא״ש, בפירוש הראשון — השערים זה כנגד זה (ברירת המחדל); בפירוש השני — סמוכים זה לזה, ושער החיל בכותל המזרחי.\n• **שמות שערי הצפון:** לתפארת ישראל ולחק נתן — שער הנשים קטן, ושער השיר הוא בית המוקד (ברירת המחדל); והאפשרות שתפארת ישראל דוחה — שער הנשים הוא בית המוקד.\n• **שמות הלשכות במשנת תמיד:** לרש״י, לתוספות רי״ד ולריטב״א (יומא יז.–יז:) — בית המוקד במזרחית צפונית, והחותמות בצפונית מערבית (ברירת המחדל); לברטנורא ולמאירי (מידות א, ו), ליכין ולמפרש — להפך.\n**ברטנורא:** כיפה — לא עלייה אלא כיפה עשויה בארץ; ״כקיטונות״ — חדרים קטנים הפתוחים לבית גדול של מלכים; הבית קצתו בנוי בתוך העזרה וקצתו בחיל, וראשי פספסין — ראשי קורות היוצאים מן הכותל עד המקום שהוא קודש, לדעת איזה קודש ואיזה חול ולאכול קדשים בקודש; לשכת הטלאים — ששה טלאים מבוקרים לתמידים; לחם הפנים — בית גרמו עושים שם; לשכת אבני המזבח — ששיקצום היוונים בהקטרה לעבודה זרה, ובשקלים ובתמיד קרויה לשכת החותמות; ובצפונית־מערבית יורד הכהן שראה קרי במחילה לבית הטבילה, ושם מדורה להתחמם בה — ״לשכת המוקד״. הרובדין — אצטבאות של אבני גזית משוקעות בכותל ויוצאות ממנו, ועל גביהן אבנים קצרות מהן, כעין מעלות זו על זו; זקני בית אב של אותו יום ישנים עליהן, ופרחי כהונה — הבחורים השומרים — על הארץ, כדרך שומרי חצרות המלכים. הכהן נועל את שערי העזרה מבפנים ובן לוי ישן מבחוץ, שהלויים טפלים לכהנים (ברטנורא מידות א, ו; א, ח; א, ט).\n**תוספות יום טוב:** הפספסין היו במקום החול ומגיעים עד הקודש ולא בקודש, משום ״לא תטע לך אשרה כל עץ אצל מזבח״; לשכת לחם הפנים סמוכה לעזרה ומקודשת — כמאן דאמר אפייתן בפנים (מנחות יא, ב); ובסדר הלשכות שבשקלים ובתמיד — החותמות ובית המוקד — דן, והתוספות (יומא טז.): לשכות משמשות שניים ושלושה דברים; מנעולי השערים — כמנעולים שאינם נסגרים אלא במפתחותיהם (הרמב״ם) (תוספות יום טוב מידות א, ו; א, ט).\n**תפארת ישראל:** ראשי הפספסין — קורות ברוחב פיסת יד היוצאות מכותלי מזרח ומערב, באמצע הכותל, מן התקרה עד הרצפה; שתי הלשכות של דברי קדושה — בחצי הקדוש שבדרום, ושתי האחרות — בחצי שבחול; הרובדין — שורות אצטבאות זו על גב זו כמדרגות: זקני בית האב ישנים בעליונה, שאר הכהנים באמצעיות, והצעירים למטה על הרצפה; ולדעתו פתחי הלשכות בין האצטבאות, ורווח הלשכות תחת הרובדין; הטבלא — למטה מהרובדין בחצי שבחול, ותחתיה גומה מרובעת שהשלשלת והמפתחות תלויים לתוכה; המסיבה — כעין כבש היורד למערה, והנרות דולקים בה (תפארת ישראל מידות א, ו; א, ח; א, ט).\nבמודל: הבית חלול — ארבע הלשכות בפינותיו (טלאי קרבן, עושי לחם הפנים, אבני המזבח, הירידה לבית הטבילה; ומעל כל אחת — שמה במשנת תמיד), הרובדין, טבלת השיש עם הטבעת, המוקד — אש גדולה להתחמם בה — והירידה לבית הטבילה; ״פתח את הלשכות״ מסיר את גגו. מקומו על החומה הצפונית, קצתו בעזרה וקצתו בחיל; האולם פתוח מצד לצד — ״שתים בקדש ושתים בחל, וראשי פספסין מבדילין בין קדש לחל״ (מידות א, ו; ברטנורא: ״ראשי קורות יוצאים מן הכתל עד המקום שהוא קדש״) — ראשי קורות בכתלי הבית על קו החומה; שני שעריו (א, ז) — עשרים אמה גובה, ולכן גובה הבית במודל עשרים וארבע (בחירת מודל). הבית רחב שלושים ושתיים אמה, וכל לשכה — כתשע אמות וחצי על שש וחצי, ומקורה בתקרה משלה; רצפת הבית כולה במפלס אחד, כרצפת העזרה, וחמש מעלות עולות אליה בתוך השער הפתוח לחיל. מידות הבית והלשכות אינן כתובות (״בית גדול היה״) — בחירת מודל.\nלאבא יוסי בן חנן (שקלים ו, ג) שער בית המוקד שלעזרה הוא ״שער השיר״ — ״נ״ל דהוא שער בית המוקד דקחשיב התם״ (תפארת ישראל מידות ב, ו); בתצוגת שלושה עשר השערים השם כתוב עליו.\nהאש: ״אבל אתה מבעיר במדורת בית המוקד״ (שבת כ.) — במודל אש חיה במרכז הטרקלין. כשמציגים את בית המוקד נפתח גם קטע החומה שעל גביו, כדי שייראה מלמעלה.", refs: [["מידות א, ו", "Mishnah_Middot.1.6"], ["ברטנורא א, ו", "Bartenura_on_Mishnah_Middot.1.6"], ["תוי״ט א, ו", "Tosafot_Yom_Tov_on_Mishnah_Middot.1.6"], ["תפא״י א, ו", "Yachin_on_Mishnah_Middot.1.6"], ["מידות א, ז", "Mishnah_Middot.1.7"], ["מידות א, ח", "Mishnah_Middot.1.8"], ["מידות א, ט", "Mishnah_Middot.1.9"], ["ברטנורא א, ט", "Bartenura_on_Mishnah_Middot.1.9"], ["תוי״ט א, ט", "Tosafot_Yom_Tov_on_Mishnah_Middot.1.9"], ["תפא״י א, ט", "Yachin_on_Mishnah_Middot.1.9"], ["תמיד א, א", "Mishnah_Tamid.1.1"], ["תמיד ג, ג", "Mishnah_Tamid.3.3"], ["רמב״ם בית הבחירה ה, ט", "Mishneh_Torah,_The_Chosen_Temple.5.9"], ["רמב״ם בית הבחירה ח, ה", "Mishneh_Torah,_The_Chosen_Temple.8.5"], ["תפא״י מידות ב, ו", "Yachin_on_Mishnah_Middot.2.6"], ["שבת כ.", "Shabbat.20a"], ["רש״י יומא יז:", {"book": 2157, "index": 533}]] },
          { t: "לשכת הטלאים — בבית המוקד", action: () => { if (ctx.shared.openFor) ctx.shared.openFor("crt-lishkot-roofs", 15000); }, tg: [-28.2, 16.8, -62.2], cam: [-27.8, 27.5, -58.3], info: "לשון המשנה (מידות א, ו): ״מערבית דרומית, היא היתה לשכת טלאי קרבן״; (תמיד ג, ג): ״אמר להם, צאו והביאו טלה מלשכת הטלאים. והרי לשכת הטלאים היתה במקצוע צפונית מערבית״; (ערכין ב, ה): ״אין פוחתין מששה טלאים המבקרין בלשכת הטלאים, כדי לשבת ולשני ימים טובים של ראש השנה, ומוסיפין עד לעולם״.\nבקצרה — מקום הלשכה: בתמיד ״במקצוע צפונית מערבית״, ובמידות — מערבית דרומית; והגמרא (יומא יז.–יז:) מכריעה: ״במערבית דרומית הואי״ (הפירוט — בכרטיס ״בית המוקד״ ובמתג ״שמות הלשכות שבבית המוקד — לפי משנת תמיד״).\n**ברטנורא** (ערכין ב, ה): ״קדם יום חנוך ארבעה ימים מבקרין שמנה טלאים ונותנין בלשכת הטלאים, וביום חנוך נוטלים שנים לתמידין ונשארו שם ששה מבקרים״.\nבמודל: בלשכה שבמקצוע המערבי־הדרומי של בית המוקד — ארבעה עשר טלאים בגדלים שונים, מטלה צעיר ועד בן שנה, בשני דירים של עץ, וקש על הרצפה; מהם עומדים, מהם אוכלים ומהם רובצים. מספרם, תנוחותיהם, הדירים והקש — בחירת מודל. ״פתח את הלשכות״ מסיר את הגג.", refs: [["מידות א, ו", {"book": 89, "index": 7}], ["תמיד ג, ג", {"book": 88, "index": 15}], ["ערכין ב, ה", {"book": 84, "index": 11}], ["ברטנורא ערכין ב, ה", {"book": 644, "index": 71}], ["יומא יז:", {"book": 107, "index": 370}]] },
          { t: "לשכת עושי לחם הפנים", action: () => { if (ctx.shared.openFor) ctx.shared.openFor("crt-lishkot-roofs", 15000); }, tg: [-7.6, 17.2, -62.2], cam: [-8.4, 27.5, -58.3], info: "לשון המשנה (מידות א, ו): ״דרומית מזרחית, היא היתה לשכת עושי לחם הפנים״; (תמיד ג, ג): ״ואחת לשכה שהיו עושין בה לחם הפנים״. **ברטנורא:** ״בית גרמו היו עושים לחם הפנים שם״.\n**האפייה** (מנחות יא, א): ״לחם הפנים נלוש אחד אחד, ונאפה שנים שנים. ובטפוס היה עושה אותן. וכשהוא רדן, נותנן בטפוס, כדי שלא יתקלקלו״. ובגמרא (מנחות צד.): ״שלשה דפוסין הם: נותנה לדפוס ועדיין היא בצק, וכמין דפוס היה לה בתנור, וכשהוא רודה נותנה בדפוס כדי שלא תתקלקל״. **הרמב״ם** (תמידין ומוספין ה, ח): ״ושלשה דפוסין של זהב היו להם״.\n**התנור:** ״תנור של מקדש – של מתכת היה״ (זבחים צה:). דפוס התנור: ״כמין כוורת היה לה בתנור״ (מנחות צה.), ו**תוספות** שם: ״מנוקב ככוורת של קנים שישלוט האור בכולו״. בית גרמו (יומא לח.): ״מסיקין מבפנים ואופין מבפנים״, ו״אין פיתן מתעפשת״.\nבקצרה — המחלוקת, מה נעשה בלשכה: במשנה (מנחות יא, ב) ״לישתן ועריכתן בחוץ, ואפיתן בפנים... רבי יהודה אומר, כל מעשיהם בפנים״. לתנא קמא, וכן פסק הרמב״ם, בלשכה שבחצי המקודש אופים בלבד; ולרבי יהודה גם לשים בה. התוספות יום טוב כתב שהלשכה ״אתיא כמ״ד אפייתן בפנים״, וכן היכין — ״ואתיא כמ״ד דלחה״פ נאפות בפנים״ — אלא שפתח: ״שם לשין ואופין אותן במקום הקודש״. בוחרים בין השתיים במתג ״לשכת עושי לחם הפנים — מה נעשה בה״, שבסוף כרטיס זה.\n**העושים — לויים:** ״ומן בני הקהתי מן אחיהם על לחם המערכת להכין שבת שבת״ (דברי הימים א ט, לב); **רלב״ג** שם: ״מן אחי הממונים על מעשה החבתים היו ממונים על לחם המערכה והוא לחם הפנים להכין אותו בכל שבת ושבת והנה הוא נאפה קודם השבת״. ובתוספתא (שקלים ב, ו): ״בית גרמו היו עושין מעשה לחם הפנים... נוטלין שכרן מתרומת הלשכה״. שבית גרמו עצמם לויים אינו כתוב במפורש — כך עולה מצירוף הפסוק עם דברי הברטנורא.\nבמודל: התנור בפינת הלשכה, ובפיו שתי חלות בדפוסיהן המנוקבים; על השולחן הדפוס הראשון, ובו בצק, והשלישי, ובו חלה שנרדתה; עשר חלות מוכנות על דף ושתיים בתנור — שתים עשרה; ואופה, לוי, רודה חלה במרדה. צורת החלה כבשולחן שבהיכל — לפי המתג ״צורת לחם הפנים״: ״כמין ספינה רוקדת״ (רבי יוחנן, ברירת המחדל) או ״כמין תיבה פרוצה״ (רבי חנינא); הדפוסים — תיבות פתוחות בשתיהן, בחירת מודל. הלויים בבגד פשוט ולא בבגדי כהונה; צורת בגדם וצבעו, מקומם של כל אלה בלשכה, מראה התנור וגודלו, הדף, העצים ומספר העושים — בחירת מודל. ״פתח את הלשכות״ מסיר את התקרה ואת גג הבית.", refs: [["מידות א, ו", {"book": 89, "index": 7}], ["תמיד ג, ג", {"book": 88, "index": 15}], ["ברטנורא מידות א, ו", {"book": 643, "index": 38}], ["מנחות יא, א", {"book": 81, "index": 80}], ["מנחות יא, ב", {"book": 81, "index": 81}], ["מנחות צד.", {"book": 131, "index": 3361}], ["מנחות צה.", {"book": 131, "index": 3372}], ["תוספות מנחות צה.", {"book": 1933, "index": 1123}], ["זבחים צה:", {"book": 130, "index": 3121}], ["יומא לח.", {"book": 107, "index": 905}], ["רמב״ם תמידין ומוספין ה, ז", {"book": 344, "index": 76}], ["רמב״ם תמידין ומוספין ה, ח", {"book": 344, "index": 77}], ["תוספות יום טוב מידות א, ו", {"book": 948, "index": 47}], ["יכין מידות א, ו", {"book": 819, "index": 98}], ["דברי הימים א ט, לב", {"book": 38, "index": 404}], ["תוספתא שקלים ב, ו", {"book": 193, "index": 16}], ["רלב״ג דברי הימים א ט, לב", {"book": 3634, "index": 253}], ["מנחות צד:", {"book": 131, "index": 3364}]] },
          { t: "לשכת החותמות — בבית המוקד", action: () => { if (ctx.shared.openFor) ctx.shared.openFor("crt-lishkot-roofs", 15000); }, tg: () => { const b = ctx.shared.mokedTamid && ctx.shared.mokedTamid.mode === "b", r = b && ctx.shared.mokedGates && ctx.shared.mokedGates.mode === "adjacent"; return b ? [-6.0 + (r ? -6.5 : 0), 17, -73.3] : [-33.8, 17, -73.3]; }, cam: () => { const b = ctx.shared.mokedTamid && ctx.shared.mokedTamid.mode === "b", r = b && ctx.shared.mokedGates && ctx.shared.mokedGates.mode === "adjacent"; return b ? [-5.6 + (r ? -6.5 : 0), 31, -67.8] : [-33.4, 31, -67.8]; }, info: "לשון המשנה (תמיד ג, ג): ״וארבע לשכות היו שם, אחת לשכת הטלאים, ואחת לשכת החותמות, ואחת לשכת בית המוקד, ואחת לשכה שהיו עושין בה לחם הפנים״.\n**החותמות** (שקלים ה, ג): ״ארבעה חותמות היו במקדש, וכתוב עליהן, עגל, זכר, גדי, חוטא״. (ה, ד): ״מי שהוא מבקש נסכים הולך לו אצל יוחנן שהוא ממנה על החותמות, נותן לו מעות ומקבל ממנו חותם. בא לו אצל אחיה שהוא ממנה על הנסכים, ונותן לו חותם ומקבל ממנו נסכים״. (ה, ה): ״ושם היום כתוב עליהן מפני הרמאין״.\nבקצרה — המחלוקות:\n• מניין החותמות: לתנא קמא ארבעה. ״בן עזאי אומר, חמשה היו, וארמית כתוב עליהן, עגל, זכר, גדי, חוטא דל, וחוטא עשיר״ (שקלים ה, ג). במודל — ארבעה.\n• מקום הלשכה: לרש״י, לתוספות רי״ד ולריטב״א — בצפונית מערבית. לברטנורא, למאירי, ליכין ולמפרש — במזרחית צפונית, היא הלשכה שבה נגנזו אבני המזבח. בוחרים בין השיטות במתג ״שמות הלשכות שבבית המוקד — לפי משנת תמיד״, והחותמות עוברים עם הבחירה.\nבמודל: שולחן אצל הכותל, ועליו ארבע קערות — בכל אחת חותמות, ומעליה הכתוב שעליהם. צורת החותמות, השולחן ומקומו בלשכה — בחירת מודל. ״פתח את הלשכות״ מסיר את התקרה ואת גג הבית.", refs: [["תמיד ג, ג", {"book": 88, "index": 15}], ["שקלים ה, ג", {"book": 54, "index": 33}], ["שקלים ה, ד", {"book": 54, "index": 34}], ["שקלים ה, ה", {"book": 54, "index": 35}], ["מידות א, ו", {"book": 89, "index": 7}], ["רש״י יומא יז:", {"book": 2157, "index": 533}], ["תוספות רי״ד יומא יז.", {"book": 2109, "index": 50}], ["ברטנורא מידות א, ו", {"book": 643, "index": 39}], ["מאירי מידות א, ו", {"book": 6033, "index": 16}], ["יכין תמיד ג, ג", {"book": 818, "index": 252}], ["המפרש לתמיד ל.", {"book": 2105, "index": 247}]] },
          { t: "לשכת אבני המזבח — בבית המוקד", action: () => { if (ctx.shared.openFor) ctx.shared.openFor("crt-lishkot-roofs", 15000); }, tg: () => { const r = ctx.shared.mokedGates && ctx.shared.mokedGates.mode === "adjacent"; return [-9.2 + (r ? -6.5 : 0), 17, -73.4]; }, cam: () => { const r = ctx.shared.mokedGates && ctx.shared.mokedGates.mode === "adjacent"; return [-9.0 + (r ? -6.5 : 0), 31, -67.8]; }, info: "לשון המשנה (מידות א, ו): ״מזרחית צפונית, בה גנזו בני חשמונאי את אבני המזבח ששקצום מלכי יון״.\nאבני המזבח (מידות ג, ד) — מבקעת בית כרם: ״ומביאים משם אבנים שלמות, שלא הונף עליהן ברזל, שהברזל פוסל בנגיעה״.\nבקצרה — שמה במשנת תמיד (ג, ג): לרש״י, לתוספות רי״ד ולריטב״א היא ״לשכת בית המוקד״; לברטנורא, למאירי, ליכין ולמפרש — ״לשכת החותמות״ (המתג ״שמות הלשכות שבבית המוקד״).\nבמודל: ערמה של אבנים שלמות, שאינן מסותתות. מספרן, גודלן ומקומן בלשכה — בחירת מודל. כשבוחרים במתג ״שערי בית המוקד״ את הפירוש השני של הרא״ש, הלשכה עומדת שש אמות וחצי מערבה, כי השער הפתוח לחיל עומד במקומה.", refs: [["מידות א, ו", {"book": 89, "index": 7}], ["מידות ג, ד", {"book": 89, "index": 22}], ["תמיד ג, ג", {"book": 88, "index": 15}], ["רש״י יומא יז:", {"book": 2157, "index": 533}], ["תוספות רי״ד יומא יז.", {"book": 2109, "index": 50}], ["ברטנורא מידות א, ו", {"book": 643, "index": 39}], ["מאירי מידות א, ו", {"book": 6033, "index": 16}], ["יכין תמיד ג, ג", {"book": 818, "index": 252}], ["המפרש לתמיד ל.", {"book": 2105, "index": 247}]] },
          { t: "הירידה לבית הטבילה — בבית המוקד", action: () => { if (ctx.shared.openFor) ctx.shared.openFor("crt-lishkot-roofs", 15000); }, tg: [-30.0, 16.5, -73.3], cam: [-29.8, 31, -67.8], info: "לשון המשנה (מידות א, ו): ״צפונית מערבית, בה יורדים לבית הטבילה״.\n(תמיד א, א): ״ארע קרי לאחד מהן, יוצא והולך לו במסבה ההולכת תחת הבירה, והנרות דולקין מכאן ומכאן, עד שהוא מגיע לבית הטבילה. ומדורה היתה שם, ובית כסא של כבוד״.\nבקצרה — שמה במשנת תמיד (ג, ג): לרש״י, לתוספות רי״ד ולריטב״א היא ״לשכת החותמות״; לברטנורא, למאירי, ליכין ולמפרש — ״לשכת בית המוקד״ (המתג ״שמות הלשכות שבבית המוקד״).\nבמודל: פתח ברצפת הלשכה, ובו מעלות היורדות סביב עמוד אל המחילה שתחת הקרקע. הדרך כולה, עד בית הטבילה — במקום ״המסיבה ובית הטבילה״, ובהדגמה ״הכהן יורד לבית הטבילה״.", refs: [["מידות א, ו", {"book": 89, "index": 7}], ["תמיד א, א", {"book": 88, "index": 2}], ["תמיד ג, ג", {"book": 88, "index": 15}], ["רש״י יומא יז:", {"book": 2157, "index": 533}], ["תוספות רי״ד יומא יז.", {"book": 2109, "index": 50}], ["ברטנורא מידות א, ו", {"book": 643, "index": 39}], ["מאירי מידות א, ו", {"book": 6033, "index": 16}], ["יכין תמיד ג, ג", {"book": 818, "index": 252}], ["המפרש לתמיד ל.", {"book": 2105, "index": 247}]] },
          { t: "המסיבה ובית הטבילה", feature: (ctx.shared.features || {})["mesibahSee"] || null, action: () => { if (ctx.shared.openFor) ctx.shared.openFor("crt-lishkot-roofs", 15000); }, tg: [-62.0, -4.0, -62.0], cam: [-46.0, 86.0, -12.0], info: "לשון המשנה (תמיד א, א): ״ארע קרי לאחד מהן, יוצא והולך לו במסבה ההולכת תחת הבירה, והנרות דולקין מכאן ומכאן, עד שהוא מגיע לבית הטבילה. ומדורה היתה שם, ובית כסא של כבוד. וזה היה כבודו, מצאו נעול, יודע שיש שם אדם. פתוח, יודע שאין שם אדם. ירד וטבל, עלה ונסתפג ונתחמם כנגד המדורה. בא וישב לו אצל אחיו הכהנים עד שהשערים נפתחים, יוצא והולך לו״.\n(מידות א, ו): ״צפונית מערבית, בה יורדים לבית הטבילה״.\nהמפרש (תמיד כו.): המסבה היא ״עמוד של בנין שעולין ויורדין בו ע״י גלגול״; ראשה האחד פתוח ללשכת בית המוקד, וראשה האחר ״חוץ לעזרה אל מקום הטבילה״; ״ולכך עשו מחילה דמחילות לא נתקדשו״; הנרות ״במחילה כדי להאיר לו״; והמדורה ״במחילה סמוך לבית הטבילה״.\nבית הטבילה — כמו שכתב המפרש (תמיד כו:) על בית הטבילה שעל גבי שער המים: ״כמין חקיקה אמה על אמה ברום שלש אמות״.\nבשיטות נוספות: רבי אליעזר בן יעקב (מידות א, ט): ״במסבה ההולכת תחת החיל יוצא והולך לו בטדי״. הרמב״ם (בית הבחירה ה): ״במסבה ההולכת תחת המקדש כלו״. ובמפרש (תמיד ל.), על ״לשכת בית המוקד״ שבמשנה (תמיד ג, ג): הכהן הטובל ״מיד כשעולה מבית הטבילה היה מתחמם באותה לשכה ומסתפג״; ושבתי טבילה הרבה היו להם.\nבמודל: מן הפתח שברצפת הלשכה הצפונית מערבית יורדות מעלות סביב עמוד, עד מחילה שבע אמות מתחת לרצפת הר הבית. המחילה הולכת דרומה, תחת חציו הקדוש של בית המוקד, ומערבה לאורך צפון העזרה, תחת כותלה המערבי והחיל, עד בית הטבילה: חדר, ובו מקווה של אמה על אמה ברום שלש אמות, ומעלות יורדות לתוכו. משני צדי המחילה — נר בכל ארבע אמות. המדורה — בגומחה בצד דרום, סמוך לבית הטבילה; ובית הכסא כנגדה, ודלתו פתוחה.\nבמקום הזה הקרקע נעשית שקופה, ורואים את כל הדרך מלמעלה. ההליכה כולה, בגובה העיניים — בהדגמה ״הכהן יורד לבית הטבילה״.\nמהלך הדרך, עומקה, רוחבה (שתי אמות) וגובהה (ארבע אמות), צורת המעלות, הנרות, המדורה ובית הכסא — בחירת מודל.", refs: [["תמיד א, א", {"book": 88, "index": 2}], ["מידות א, ו", {"book": 89, "index": 7}], ["מידות א, ט", {"book": 89, "index": 10}], ["רמב״ם בית הבחירה ה", {"book": 337, "index": 86}], ["המפרש לתמיד כו.", {"book": 2105, "index": 17}], ["המפרש לתמיד כו:", {"book": 2105, "index": 44}], ["המפרש לתמיד ל.", {"book": 2105, "index": 247}]] },
          { t: "עליית שער הניצוץ", action: () => { if (ctx.shared.openFor) ctx.shared.openFor("crt-lishkot-roofs", 15000); }, tg: [-78, 41.5, -67.5], cam: [-78, 62, -62.5], info: "לשון המשנה (מידות א, ה): ״וכמין אכסדרה היה, ועליה בנויה על גביו, שהכהנים שומרים מלמעלן והלוים מלמטן, ופתח היה לו לחיל״.\n**ברטנורא:** העלייה בנויה על שני הכתלים הבולטים משני צדי השער לצד הר הבית; הכהנים שומרים בעלייה והלויים למטה, שהלויים טפלים לכהנים — ״וילוו עליך וישרתוך״ (במדבר יח) (ברטנורא מידות א, ה; א, ט).\n**תוספות יום טוב:** ״פתח היה לו לחיל״ — ולא שער, ולכן לא נמנה עליו שומר נוסף (תמיד כז.) (תוספות יום טוב מידות א, ז).\n**תפארת ישראל:** עלייה שאינה מקורה, על שני כתלים שבצד פנים; פתחה לחיל ולא לעזרה, ואצל הפתח מדרגות היורדות לחיל; עליות לא נתקדשו, ולכן יכול השומר לשבת בה (תפארת ישראל מידות א, ה).\nבמודל: עלייה מעל השער, ופתח מן העלייה אל החיל עם מדרגות לצדו — כתפארת ישראל; הבלטה לצד הר הבית (ברטנורא) אינה מצוירת. העלייה חלולה, ובה ספסלי השומרים ומנורה — בחירת מודל; בלחיצה כאן — מבט מלמעלה, והגג נפתח ל־15 שניות.", refs: [["מידות א, ה", "Mishnah_Middot.1.5"], ["ברטנורא א, ה", "Bartenura_on_Mishnah_Middot.1.5"], ["תוי״ט א, ה", "Tosafot_Yom_Tov_on_Mishnah_Middot.1.5"], ["תפא״י א, ה", "Yachin_on_Mishnah_Middot.1.5"], ["מידות א, א", "Mishnah_Middot.1.1"], ["רמב״ם בית הבחירה ח, ה", "Mishneh_Torah,_The_Chosen_Temple.8.5"]] },
          { t: "לשכת בית אבטינס — על גבי שער המים", action: () => { if (ctx.shared.openFor) ctx.shared.openFor("crt-lishkot-roofs", 15000); }, tg: [-18, 44, 67.5], cam: [-18, 82, 56], info: "לשון המשנה (מידות א, א): ״בשלשה מקומות הכהנים שומרים בבית המקדש, בבית אבטינס, ובבית הניצוץ, ובבית המוקד״; (יומא א, ה): ״מסרוהו זקני בית דין לזקני כהנה, והעלוהו לעלית בית אבטינס, והשביעוהו ונפטרו והלכו להם״.\n**ברטנורא:** בית אבטינס ובית הניצוץ — שתי עליות בנויות בצד שערי העזרה; ״בית אבטינס — הם העשים את הקטרת וכותשים אותה ומערבין סממניה״; זקני כהונה מעלים אליה את כהן גדול ללמדו חפינת הקטורת, ״ועבדה קשה היתה״; ומשביעים אותו שלא יהא צדוקי לתקן את הקטורת על המחתה מבחוץ (ברטנורא מידות א, א; ברטנורא יומא א, ה).\n**תוספות יום טוב:** ״עוד עיין על לשכה זו בסוף מסכת מדות״, ובמידות: ״שם תמצא מקום לשכה זו לשכת בית אבטינס״ — בסוף המסכת (ה, ד) דן בשתי לשכותיו של כהן גדול, ומעלה אף את האפשרות שלשכת כהן גדול שבמשנה היא של בית אבטינס, שבה למד כל שבעת הימים את החפינה, ומסיק כר״ב והרמב״ם שהיא לשכת פרהדרין; ובציור הבית שבמשניות (אות מ״ה, לפי הבועז) צייר את בית אבטינס במזרח שער המים (תוספות יום טוב יומא א, ה; תוספות יום טוב מידות א, א; ה, ד).\n**תפארת ישראל:** עלייה על גבי שער המים בדרום העזרה, ושם מרקחים את הקטורת, ובית הטבילה בצדה על גבי השער (כרמב״ם); ״ששם אחר שישביעוהו זקני ב״ד, ילמדוהו זקני כהונה, חפינת הקטורת, דעבודה קשה היתה״; ובבועז — מלשון הגמרא ״בצד לשכתו״ משמע שבית הטבילה ואבטינס שתיהן על גבי השער, ואבטינס, שקדוש יותר, ממעל לשער לצד מערב ולא כתוי״ט; ולא נמנתה בלשכות העזרה (ה, ג) לפי שעלייה הייתה ולא שייך לומר שהייתה בעזרה (תפארת ישראל מידות א, א; תפארת ישראל יומא א, ה; בועז מידות א, ב; ה, ב).\nבמודל: עלייה על החומה מעל שער המים, ולצדה בית הטבילה של הטבילה הראשונה ביום הכיפורים — ״היתה בחול, על גבי שער המים, ובצד לשכתו היתה״ (יומא יט.; לא.); ״שתי לשכות היו לו לכהן גדול, אחת לשכת פרהדרין ואחת לשכת בית אבטינס, אחת בצפון ואחת בדרום״ (יומא יט.); בפנים מכתש וכדים (בחירת מודל).\n**הרובים** (תמיד א, א): ״בית אבטינס ובית הניצוץ היו עליות, והרובים שומרים שם״; הרא״ש שם: ״ילדים כדמתרגם ילד רביא שלא הגיעו לעבודה והם זריזים לעלות בעליות״; ובגמרא (תמיד כז.): ״התם דלא מטו למעבד עבודה קרי להו רובים, הכא דמטו להו למעבד עבודה קרי להו פרחי״.\n**המשנה** (יומא ג, יא) מונה אותם בין הנזכרים לגנאי: ״של בית אבטינס לא רצו ללמד על מעשה הקטורת״. **ובגמרא** (יומא לח.) — טעמם: ״יודעין היו של בית אבא שבית זה עתיד ליחרב, אמרו: שמא ילמוד אדם שאינו מהוגן וילך ויעבוד עבודה זרה בכך. ועל דבר זה מזכירין אותן לשבח״; ורבי עקיבא: ״מעתה אסור לספר בגנותן של אלו״.\nבמודל: אחד מבית אבטינס עומד אצל המכתש, ושני רובים צעירים שומרים ליד הפתח. הדמויות ומקומן — בחירת מודל.", refs: [["מידות א, א", "Mishnah_Middot.1.1"], ["ברטנורא א, א", "Bartenura_on_Mishnah_Middot.1.1"], ["תוי״ט א, א", "Tosafot_Yom_Tov_on_Mishnah_Middot.1.1"], ["תפא״י א, א", "Yachin_on_Mishnah_Middot.1.1"], ["יומא א, ה", "Mishnah_Yoma.1.5"], ["ברטנורא א, ה", "Bartenura_on_Mishnah_Yoma.1.5"], ["תוי״ט א, ה", "Tosafot_Yom_Tov_on_Mishnah_Yoma.1.5"], ["תפא״י א, ה", "Yachin_on_Mishnah_Yoma.1.5"], ["בועז א, ב", "Boaz_on_Mishnah_Middot.1.2"], ["תוי״ט ה, ד", "Tosafot_Yom_Tov_on_Mishnah_Middot.5.4"], ["בועז ה, ב", "Boaz_on_Mishnah_Middot.5.2"], ["שקלים ה, א", "Mishnah_Shekalim.5.1"], ["יומא יט.", "Yoma.19a"], ["יומא לא.", "Yoma.31a"], ["תמיד א, א", {"book": 88, "index": 2}], ["פירוש הרא״ש תמיד כה:", {"book": 2224, "index": 8}], ["תוי״ט תמיד א, א", {"book": 944, "index": 18}], ["יומא לח.", {"book": 107, "index": 903}], ["יומא ג, יא", {"book": 55, "index": 29}], ["יומא לח. (טעמם)", {"book": 107, "index": 910}], ["יומא לח. (רבי עקיבא)", {"book": 107, "index": 913}], ["תמיד כז.", {"book": 138, "index": 28}]] },
          { t: "לשכת המדיחין", action: () => { if (ctx.shared.openFor) ctx.shared.openFor("crt-lishkot-roofs", 15000); }, tg: [35, 17, 60], cam: [36, 60, 46], info: "לשון המשנה (מידות ה, ג): ״לשכת המדיחין, ששם היו מדיחין קרבי הקדשים. ומשם מסבה עולה לגג בית הפרוה״.\n**ברטנורא:** ״מסיבה״ — בניין אבנים, מעלות מגולגלות וסובבות, לעלות לגג בית הפרוה (ברטנורא מידות ה, ג).\n**תוספות יום טוב:** והלא בשקלים (ו, ד) שנינו שעל שולחנות השיש מדיחים את הקרביים? — המפרש לתמיד: הקרביים נידחים תחילה בלשכת המדיחין בצנעה, שמלוכלכים בפרש, ואחר כך על השולחנות; ולדעתו שני פתחים ללשכה — אחד למלאכת ההדחה ואחד סמוך לפרוה, ובו המסיבה, שלא יעלה כהן גדול לבית טבילתו דרך מקום ההדחה, ומחיצה במעלותיה (תוספות יום טוב מידות ה, ג).\n**תפארת ישראל:** מדיחים שם את הכרס והקיבה המלאים רפש, ושאר בני המעיים — על שולחנות השיש שאצל הננסים; המסיבה — כמין כבש בלי מעלות, הולכת בעיגול, מבחוץ לבית המדיחין ועולה מעליו עד גג הפרוה (תפארת ישראל מידות ה, ג).\nבמודל: השלישית בלשכות הדרום; בפנים — שולחנות ההדחה ובור מים בנוי ברצפה, ובו מדיחים (״והכרס מדיחין אותה בבית מדיחין כל צרכה״, תמיד ד, ב); הבור וגודלו — בחירת מודל. בכותל המזרחי פתח אל המסיבה, ״ומשם מסבה עולה לגג בית הפרוה״ — מדרגות מגולגלות סביב עמוד, מן הפתח ועד הגג (צורתה — בחירת מודל).\nבמודל: כהן עומד על שפת הבור ומדיח את הכרס. ושאר הקרביים — ״והקרבים מדיחין אותן שלשה פעמים במעוטה, על שלחנות של שיש שבין העמודים״ (תמיד ד, ב): לברטנורא ולתפארת ישראל — שם בלבד, ליד בית המטבחיים; ולמפרש שהביא התוספות יום טוב — ״מדיחין פעם ראשונה בלשכת מדיחין בצנעה... ואח״כ מדיחין ג״כ עוד במיעוט שלחנות״. במודל מצוירת כאן הדחת הכרס בלבד. הדמות ומקומה — בחירת מודל.", refs: [["מידות ה, ג", "Mishnah_Middot.5.3"], ["ברטנורא ה, ג", "Bartenura_on_Mishnah_Middot.5.3"], ["תוי״ט ה, ג", "Tosafot_Yom_Tov_on_Mishnah_Middot.5.3"], ["תפא״י ה, ג", "Yachin_on_Mishnah_Middot.5.3"], ["רמב״ם בית הבחירה ה, יז", "Mishneh_Torah,_The_Chosen_Temple.5.17"], ["שקלים ו, ד", "Mishnah_Shekalim.6.4"], ["תמיד ד, ב", "Mishnah_Tamid.4.2"], ["תוי״ט מידות ה, ג", {"book": 948, "index": 198}]] },
          { t: "לשכת הפרוה", action: () => { if (ctx.shared.openFor) ctx.shared.openFor("crt-lishkot-roofs", 15000); }, tg: [54, 24, 60], cam: [54, 74, 45], info: "לשון המשנה (מידות ה, ג): ״לשכת הפרוה, שם היו מולחין עורות קדשים, ועל גגה היה בית הטבילה לכהן גדול ביום הכפורים״.\nבקצרה — שמה: לברטנורא — על שם מכשף שבנאה; ולרמב״ם — על שם אדם שחתר בקיר לראות היאך הכהן עובד; ולר׳ שמעיה — על שם עורות הפרים שבה.\n**ברטנורא:** פרוה — אדם מכשף ששמו פרוה בנה אותה לשכה על ידי מכשפות; ולרמב״ם — שהיה חותר בקיר כדי לראות היאך הכהן עובד, ונהרג שם; חמש טבילות שטובל כהן גדול ביום הכיפורים — כולן על גג בית הפרוה, שהייתה מקודשת בקדושת העזרה, וטבילות הבאות מחמת היום צריכות מקום קדוש — ״ורחץ את בשרו במים במקום קדוש״; חוץ מן הראשונה, שהייתה בחול על גבי שער המים, ומעיין מים משוך שם באמה הבאה מעין עיטם (ברטנורא מידות ה, ג).\n**תוספות יום טוב:** תמה — היאך יקיימו בקודש בניין הנעשה בכישוף? ור׳ שמעיה: נקראת פרוה על שם עורות הפרים שבה, ובית הטבילה שעל גבה בנה פרוה מגושא דומה לבית הטבילה שעל שער המים; ״ובקדש היתה״ (יומא ג, ו) — היא עצמה בקודש, ולא בחול; וגגות לשכות הבנויות בחול לא נתקדשו (מעשר שני ג, ח) (תוספות יום טוב מידות ה, ג).\n**תפארת ישראל:** בין כל חילוף בגדים טובל כאן, חוץ מן הראשונה שבחול על גבי שער המים — שעובי החומה לא נתקדש אלא בשווה לקרקע העזרה (פסחים פו.); והעלו את המים לגג בסילונות מעשה אומן, שלא יהיו שאובים, ועל שם האומנות הנפלאה — כאילו בכישוף — נקראה על שם בונהה (יומא לה.); ובבועז — המסיבה אל בית הטבילה מלשכת המדיחין, לפנים מחדר, מפני צניעות כהן גדול, והפרוה עצמה, מפני ריח העורות, לא הייתה פתוחה לעזרה (תפארת ישראל מידות ה, ג; בועז ה, ג).\nבמודל: השנייה בלשכות הדרום; בפנים — עורות על מתלה וגיגיות. על הגג — בית הטבילה: בור בנוי, מדרגות עולות אל שפתו מבחוץ ויורדות למים מבפנים, ומימיו שלוש אמות. שיעורו — ארבעים סאה, אמה על אמה ברום שלוש אמות (עירובין ד:); הגודל המצויר — בחירת מודל. ובו ארבע מחמש הטבילות של יום הכיפורים (יומא ג, ג). לצדו סדין של בוץ: ״הביאוהו לבית הפרוה, ובקדש היתה. פרסו סדין של בוץ בינו לבין העם״ (יומא ג, ו). אל הגג עולים במסיבה שמלשכת המדיחין.\n**שמה בגמרא** (יומא לה.): ״מאי פרוה? אמר רב יוסף: פרוה אמגושא״; ורש״י שם: ״מכשף אחד בנאה ושמו פרווה״.\nבמודל: על הגיגית המזרחית — עור פרוש וזרוי מלח, כהן עומד אצלו, ולצדו סל של מלח. הדמות והסל — בחירת מודל.", refs: [["מידות ה, ג", "Mishnah_Middot.5.3"], ["ברטנורא ה, ג", "Bartenura_on_Mishnah_Middot.5.3"], ["תוי״ט ה, ג", "Tosafot_Yom_Tov_on_Mishnah_Middot.5.3"], ["תפא״י ה, ג", "Yachin_on_Mishnah_Middot.5.3"], ["בועז ה, ג", "Boaz_on_Mishnah_Middot.5.3"], ["רמב״ם בית הבחירה ה, יז", "Mishneh_Torah,_The_Chosen_Temple.5.17"], ["יומא ג, ג", "Mishnah_Yoma.3.3"], ["יומא ג, ו", "Mishnah_Yoma.3.6"], ["יומא לה.", "Yoma.35a"], ["פסחים פו.", "Pesachim.86a"], ["רש״י יומא לה.", {"book": 2157, "index": 1297}]] },
          { t: "לשכת המלח", action: () => { if (ctx.shared.openFor) ctx.shared.openFor("crt-lishkot-roofs", 15000); }, tg: [74, 17.5, 60], cam: [74, 56, 50], info: "לשון המשנה (מידות ה, ג): ״שש לשכות היו בעזרה, שלש בצפון ושלש בדרום. שבצפון, לשכת המלח, לשכת הפרוה, לשכת המדיחים. לשכת המלח, שם היו נותנים מלח לקרבן״.\n**תוספות יום טוב:** נוסח אחר ״שבדרום״ — וכן ביומא (יט.) וברמב״ם (בית הבחירה ה), וכן בשערי הר הבית והעזרה נשנה הדרום תחילה; ולדעתו גרסת הספר נשתבשה, ששלוש הלשכות הללו כולן לקרבנות, ועיקרם בצפון; וסדרן — ממזרח למערב, דרך כניסת העזרה, וכן בציור הרמב״ם: לשכת המלח סמוכה למזרח ואחריה הפרוה (תוספות יום טוב מידות ה, ג).\n**תפארת ישראל:** ״שבדרום״ היא הגרסה הנכונה (כרמב״ם וכתוי״ט); בקצה זווית מזרחית־דרומית של עזרת ישראל — לשכת המלח, אחריה למערב הפרוה, ואחריה המדיחין, כולן בשורה אחת סמוכות זו לזו (תפארת ישראל מידות ה, ג).\nבמודל: הראשונה מן המזרח בשלוש לשכות הדרום, כסדר התוספות יום טוב והתפארת ישראל; ערמת המלח — ״על כל קרבנך תקריב מלח״ (ויקרא ב, יג) — בחירת מודל.\n**נאותין במלח** (מנחות כא:): ״תנן התם: על המלח ועל העצים, שיהו הכהנים נאותין בהן. אמר שמואל: לא שנו אלא לקרבנם, אבל לאכילה — לא״. ושם בברייתא: ״בשלשה מקומות המלח נתונה: בלשכת המלח, ועל גבי הכבש, ובראשו של מזבח. בלשכת המלח — ששם מולחין עורות קדשים, על גבי הכבש — ששם מולחים את האברים״.\nבמודל: כהן ממלא קערה מן הערמה, ועל שולחן שיש בפינה עומדות קערות מלח מוכנות — אל הכבש, ששם מלחו את האברים: ״הלכו ונתנום מחצי הכבש ולמטה במערבו, ומלחום״ (תמיד ד, ג). הדמות, הקערות והשולחן — בחירת מודל.", refs: [["מידות ה, ג", "Mishnah_Middot.5.3"], ["ברטנורא ה, ג", "Bartenura_on_Mishnah_Middot.5.3"], ["תוי״ט ה, ג", "Tosafot_Yom_Tov_on_Mishnah_Middot.5.3"], ["תפא״י ה, ג", "Yachin_on_Mishnah_Middot.5.3"], ["רמב״ם בית הבחירה ה, יז", "Mishneh_Torah,_The_Chosen_Temple.5.17"], ["יומא יט.", "Yoma.19a"], ["מנחות כא:", {"book": 131, "index": 725}], ["תמיד ד, ג", {"book": 88, "index": 25}], ["מנחות כא: (שלשה מקומות)", {"book": 131, "index": 727}]] },
          { t: "הממונים שבמקדש", feature: (ctx.shared.features || {})["memunim"] || null, tg: [34, 10, -5], cam: [34, 330, 140], info: "לשון המשנה (שקלים ה, א): ״אלו הן הממנין שהיו במקדש, יוחנן בן פנחס על החותמות, אחיה על הנסכים, מתתיה בן שמואל על הפיסות, פתחיה על הקנין. פתחיה, זה מרדכי. למה נקרא שמו פתחיה. שהיה פותח בדברים ודורשן, ויודע שבעים לשון. בן אחיה על חולי מעים, נחוניא חופר שיחין, גביני כרוז, בן גבר על נעילת שערים, בן בבי על הפקיע, בן ארזה על הצלצל, הגרס בן לוי על השיר, בית גרמו על מעשה לחם הפנים, בית אבטינס על מעשה הקטרת, אלעזר על הפרוכות, ופנחס על המלבוש״.\nבקצרה — המחלוקת בכרטיס זה:\n• ״בן בבי על הפקיע״ — לברטנורא: ״להלקות הכהנים והלוים שנמצאו ישנים על משמרותיהם״; ובירושלמי (כפי שמביא ברטנורא): ״הפתילות של מנורה ושל בית השואבה״.\n**ברטנורא:** ״הנך גברי דחשיב, לא בזמן אחד היו, אלא החסידים והכשרים שבכל דור ודור הוא מונה. ורבותי פרשו, על שם שהממנים הראשונים שנתמנו על כך, כך היה שמם, לפיכך נקראו הבאים אחריהם על שמם״. ועוד בדבריו: ״על הפיסות — להורות סדר הגורל מי יזכה בעבודה זו ומי בזו״; ״על הקנים — ...נותנין מעותיהן לשופרות שבמקדש, והממנים על השופרות לוקחים המעות ומביאין בהן הקנים״; ״גביני כרוז — ...המכריז בכל בקר בבית המקדש עמדו כהנים לעבודתכם. ושומעים קולו מיריחו״; ״על נעילת שערים — לנעל השערים בערב ולפתחן בבקר״; ״צלצל — ...וכשהיו שומעין קולו היו הלוים מתחילין בשיר״; ״המלביש — היה ממנה להלביש הכהנים בשעת עבודה ולהפשיטם אחר עבודה, ולשמר בגדי כהנה בלשכות העשויות לכך״ (ברטנורא שקלים ה, א).\nובמשנה שאחריה (שקלים ה, ב): ״אין פוחתין משלשה גזברין ומשבעה אמרכלין״.\nבמודל: חמישה עשר הממונים מצוירים, כל אחד במקום עבודתו. מעל כל אחד לוחית ובה מספרו כסדר המשנה ותפקידו, ותחתיה שמו. צבע הלוחית: זהב — כהן; אדום — לוי; ירוק — ישראל; כחול — מי ששבטו לא נתפרש. למקומות שעבדו בהם כמה מן הממונים — לשכת הגזית (הפייסות), בית אבטינס ולשכת פנחס המלביש — יש כרטיסים משלהם; ובהדגמה ״סדר עבודת הבוקר״ בן ארזא מקיש בצלצל (תמיד ז, ג).\n**מי כהן, מי לוי ומי ישראל — מי שנתפרש במקורות:**\nגביני הכרוז (7) — כהן: ״כהן ששמו גביני, שהיה מכריז בכל בקר בבית המקדש: עמדו כהנים לעבודתכם״ (ברטנורא, תמיד ג, ח; וכן ביכין שם).\nבן בבי (9) — כהן: ״בן בביי, שם כהן״ (פירוש רבינו אליקים על יומא כג., בקובץ שיטות קמאי).\nבן אחיה (5) ופנחס המלביש (15) — מצוירים ככהנים. בחירת מודל: לא נמצא מקור מפורש לשבטם.\nבן ארזה (10) — לוי: ״והקיש בן ארזא בצלצל, ודברו הלוים בשיר״ (תמיד ז, ג); והראב״ד: ״להניף ולרמז לבן ארזא ושאר לוים״ (במלאכת שלמה שם).\nהגרס בן לוי (11) — לוי: ״בן לוי — כלומר מן הלוים״ (רש״י יומא לח.). אמנם בגמרא שם: ״עד שהיו אחיו הכהנים נזקרים בבת ראש לאחוריהם״ (יומא לח:).\nפתחיה (4) — ישראל, משבט בנימין: ״פתחיה, זה מרדכי״ (שקלים ה, א), ומרדכי — ״איש ימיני״ (אסתר ב, ה). כך לרש״י: ״מרדכי — שהיה בימי אחשורוש״ (מנחות סד:). התוספות שם תמהו ״שהאריך ימים כל כך״, ופירשו ש״על שם מרדכי הראשון היו נקראין הממונים״ — ולפירושם שבטו של פתחיה לא נתפרש.\n**שבטם לא נתפרש** (לוחית כחולה, לבוש פשוט): יוחנן בן פנחס (1), אחיה (2), מתתיה בן שמואל (3), נחוניא (6), בן גבר (8), בית גרמו (12), בית אבטינס (13) ואלעזר (14).\nעל ארבעה מאלה יש רמז מצירוף מקורות. הוא אינו מפורש, ולכן לא נצבעו לפיו:\n• מתתיה בן שמואל (3) — לפירוש רש״י הוא הממונה ששואל ״אם הגיע זמן שחיטה״: ״היה ממונה על כך... שהיה ממונה על הפייסות״ (רש״י מנחות ק.); ו״אמר להם הממונה — הוא הסגן״ (רש״י יומא כח.), והסגן כהן.\n• בית אבטינס (13) — ״ומן בני הכהנים רקחי המרקחת לבשמים״ (דברי הימים א ט, ל); הפסוק אינו מזכיר אותם בשמם.\n• בן גבר (8) — הגפת הדלתות היא עבודת הלויים השוערים: ״שהלך לסייע בהגפת דלתות אצל רבי יוחנן בן גודגדא, אמר לו: בני, חזור לאחוריך, שאתה מן המשוררים ולא מן המשוערים״ (ערכין יא:), ובתוספתא (שקלים ב, יד): ״יוחנן בן גודגדא על נעילת שערים״. אבל במשנה (מידות א, ט): ״ונעל הכהן מבפנים, ובן לוי ישן לו מבחוץ״.\n• בית גרמו (12) — ״ומן בני הקהתי מן אחיהם על לחם המערכת״ (דברי הימים א ט, לב; ראה בכרטיס ״לשכת עושי לחם הפנים״).\n**המקומות:** 1 החותמות — בבית המוקד, אצל ״לשכת החותמות״ (תמיד ג, ג); וביכין שם: ״ששם יושב כל היום הממונה על החותמות״. 2 הנסכים — בלשכת שמנים: ״שם היו נותנין יין ושמן, היא היתה נקראת לשכת בית שמניה״ (מידות ב, ה). 3 הפייסות — בלשכת הגזית. 4 הקינין — אצל שלושה עשר השופרות. 6 השיחין — אצל לשכת הגולה: ״שם היה בור קבוע, והגלגל נתון עליו״ (מידות ה, ד). 10–11 הצלצל והשיר — על הדוכן. 12 לחם הפנים — בלשכתם שבבית המוקד. 13 הקטורת — בעליית בית אבטינס. 14 הפרוכות — במקום ״לשכת הפרכת״ (מידות א, א). 15 המלבוש — ב״לשכת פנחס המלביש״ (מידות א, ד).\n7 הכרוז — לפני שער בית המוקד הפתוח לחיל, ופניו אל השער: ״מכריז בכל בוקר בהר הבית לפני שער בית המוקד הסגור״ (יכין, תמיד ג, ח). לפירוש השני של הרא״ש, שהשער לחיל בכותל המזרחי — הוא עומד לפני אותו שער. ולמאירי גביני הוא גם הרואה אם האיר המזרח: ״וישאלו לגביני כרוז שהיה ממונה על כך, והיה עולה במקום גבוה שבמקדש, על החומה או על גג העזרה, אם רואה פני המזרח מתחילין להאיר״ (יומא כח.).\nמקומם של הרופא (5), הממונה על נעילת השערים (8) ובן בבי (9) אינו כתוב — בחירת מודל. גם העמדת אחיה (2) בלשכת שמנים, פתחיה (4) אצל השופרות, נחוניא (6) אצל הבור שבלשכת הגולה ואלעזר (14) במקום לשכת הפרוכת אינה כתובה: המשניות שהובאו מתארות את המקומות, ולא את מקום הממונים — בחירת מודל. וכן מקומו המדויק של כל אחד, דמותו ולבושו.", refs: [["שקלים ה, א", "Mishnah_Shekalim.5.1"], ["ברטנורא שקלים ה, א", "Bartenura_on_Mishnah_Shekalim.5.1"], ["שקלים ה, ב", "Mishnah_Shekalim.5.2"], ["דברי הימים א ט, ל", {"book": 38, "index": 402}], ["ערכין יא:", {"book": 134, "index": 368}], ["תוספתא שקלים ב, יד", {"book": 193, "index": 24}], ["תמיד ז, ג", {"book": 88, "index": 40}], ["תמיד ג, ג", {"book": 88, "index": 15}], ["מידות ב, ה", {"book": 89, "index": 16}], ["מידות ה, ד", {"book": 89, "index": 39}], ["מידות א, א", {"book": 89, "index": 2}], ["מידות א, ד", {"book": 89, "index": 5}], ["רש״י מנחות ק.", {"book": 2186, "index": 4755}], ["רש״י יומא כח.", {"book": 2157, "index": 1007}], ["ברטנורא תמיד ג, ח", {"book": 634, "index": 117}], ["יכין תמיד ג, ח", {"book": 818, "index": 332}], ["רבינו אליקים יומא כג.", {"book": 7549, "index": 1327}], ["מלאכת שלמה תמיד ז, ג", {"book": 1202, "index": 315}], ["רש״י יומא לח.", {"book": 2157, "index": 1430}], ["יומא לח:", {"book": 107, "index": 917}], ["דברי הימים א ט, לב", {"book": 38, "index": 404}], ["אסתר ב, ה", {"book": 34, "index": 29}], ["רש״י מנחות סד:", {"book": 2186, "index": 2973}], ["תוספות מנחות סד:", {"book": 1933, "index": 784}], ["מאירי יומא כח.", {"book": 2199, "index": 251}], ["מידות א, ט", {"book": 89, "index": 10}], ["יכין תמיד ג, ג", {"book": 818, "index": 252}]] },
          { t: "לשכת בית האבן", tg: [86, 34, -62.5], cam: [58, 56, -30], info: "לשון המשנה (פרה ג, א): ״שבעת ימים קדם לשרפת הפרה מפרישין כהן השורף את הפרה מביתו ללשכה שעל פני הבירה, צפונה מזרחה, ובית אבן היתה נקראת״.\nבקצרה — המחלוקת בכרטיס זה (הפירוט — במתג ״לשכת בית האבן — מקומה״ שבתפריט, תחת ״שיטות ומחלוקות״):\n• לרש״י ולרמב״ם — בעזרה, במקצוע מזרחית־צפונית (ברירת המחדל).\n• לתוספות — ״שחוץ לעזרה״.\n**הגמרא** (יומא ב.): ״ולמה נקרא שמה לשכת בית האבן — שכל מעשיה בכלי גללים, בכלי אבנים, ובכלי אדמה״; ״מאי בירה? אמר רבה בר בר חנה אמר רבי יוחנן: מקום היה בהר הבית ובירה שמו. וריש לקיש אמר: כל המקדש כולו קרוי בירה״.\n**רש״י** (יומא ב.): ״צפונה מזרחה — במקצוע מזרחית צפונית של עזרה היתה״. **הרמב״ם** (פרה אדומה ב, א): ״מפרישין אותו ללשכה מוכנת בעזרה. ובית אבן היתה נקראת מפני שכל כליה כלי אבנים שאין מקבלין טמאה״. **תוספות** (יומא ב., ד״ה ומאי שנא): ״אבל פרה שנעשית מחוץ בהר המשחה פרישתו ללשכה שעל פני הבירה שחוץ לעזרה״. **ברטנורא** (פרה ג, א): ״הבירה. אית דאמרי מקום היה בהר הבית ובירה שמו. ואית דאמרי כל המקדש קרוי בירה״.\nבמודל: לרש״י ולרמב״ם — עלייה על הגג של בניין שלוש הלשכות, בקרן המזרחית־הצפונית של העזרה (הקרן עצמה תפוסה בבניין הזה); לתוספות — לשכה קטנה מקורה בהר הבית, מצפון־מזרח לעזרה ומחוץ לה. הקומה, הגודל, הפתח, הדרך לעלות אליה והמקום המדויק — בחירת מודל.", refs: [["פרה ג, א", "Mishnah_Parah.3.1"], ["יומא ב.", "Yoma.2a"], ["רש״י יומא ב.", "Rashi_on_Yoma.2.1"], ["רמב״ם פרה אדומה ב, א", "Rambam_Parah_Adumah.2.1"], ["תוספות יומא ב.", "Tosafot_on_Yoma.2.1"], ["ברטנורא פרה ג, א", "Bartenura_on_Mishnah_Parah.3.1"]] },
          { t: "לשכת חשאים", tg: [3, 18, 59], cam: [-20, 29, 47], info: "לשון המשנה (שקלים ה, ו): ״שתי לשכות היו במקדש, אחת לשכת חשאים, ואחת לשכת הכלים, לשכת חשאים יראי חטא נותנים לתוכה בחשאי, ועניים בני טובים מתפרנסים מתוכה בחשאי״.\nבקצרה — מקומה: אין לה מקום במשנה; הראב״ד מסתפק אם ״במקדש״ — סניף למקדש, או בעזרה.\n**ברטנורא:** ״לשכת חשאים. על שם שהנותנים בתוכה מעות נותנים בסתר, והמתפרנסים ממנה נוטלים בסתר״ (ברטנורא שקלים ה, ו).\n**תוספות יום טוב:** ״פי׳ הר״ב שהיו נותנים בסתר וכו׳ וכדמתרגמינן קול דממה [דקה] קל דמשבחין בחשאי״ (תוי״ט שקלים ה, ו).\n**מלאכת שלמה:** ״מתפרנסין מתוכה בחשאי משום דכתיב מתן בסתר יכפה אף״ (מלאכת שלמה שקלים ה, ו).\n**פני משה:** ״שהנודבים מעות לתוכה נותני׳ אותן בסתר ובחשאי ומשם עניים בני טובים מתפרנסין ג״כ בחשאי שלא יתביישו״ (פני משה ירושלמי שקלים ה, ד).\n**התוספתא:** ״כשם שהיה לשכת חשאין במקדש כך היתה בכל עיר ועיר מפני שעניים בני טובים מתפרנסין מתוכה בחשאי״ (תוספתא שקלים ב, טז).\n**הרמב״ם:** ״פחות מזה הנותן צדקה לעניים ולא ידע למי נתן ולא ידע העני ממי לקח. שהרי זו מצוה לשמה. כגון לשכת חשאים שהיתה במקדש. שהיו הצדיקים נותנין בה בחשאי והעניים בני טובים מתפרנסין ממנה בחשאי״ (רמב״ם מתנות עניים י, ח).\n**הראב״ד**, שהובא במלאכת שלמה: ״ובמסכת שקלים פ׳ אלו הן הממונים תנינן שתי לשכות היו במקדש אחת לשכת חשאים ואחת לשכת הכלים ולא ידענא אי דוקא במקדש קאמר כגון סניף למקדש. או בעזרה״ (מלאכת שלמה תמיד ג, ה).\nבמודל: לשכה קטנה בעזרה, בצד הדרום, בין שער המים לקרן האולם, ופתחה לצפון. מקומה — בחירת מודל: אין לה מקום במקורות, והועמדה בעזרה — כצד השני שבספק הראב״ד.", refs: [["שקלים ה, ו", "Mishnah_Shekalim.5.6"], ["ברטנורא שקלים ה, ו", "Bartenura_on_Mishnah_Shekalim.5.6"], ["תוי״ט שקלים ה, ו", "Tosafot_Yom_Tov_on_Mishnah_Shekalim.5.6"], ["מלאכת שלמה שקלים ה, ו", {"book": 1152, "index": 187}], ["ירושלמי שקלים ה, ד", {"book": 154, "index": 167}], ["פני משה ירושלמי שקלים ה, ד", {"book": 1807, "index": 622}], ["תוספתא שקלים ב, טז", {"book": 193, "index": 26}], ["רמב״ם מתנות עניים י, ח", {"book": 334, "index": 200}], ["מלאכת שלמה תמיד ג, ה", {"book": 1202, "index": 104}]] }
        ]],
        ["מזבח וכלים", [
          { t: "המזבח", view: "mizbeach", key: "mizbeach" },
          { t: "מידות המזבח — 32, 30, 28, 26, 24, והמזבח הקודם 28 על 28", feature: (ctx.shared.features || {})["altar28"] || null, tg: () => ui_altarCam(ctx, [56.5, 20.5, 8], "body"), cam: () => ui_altarCam(ctx, [84, 28.5, -24], "body"), info: "לשון המשנה (מידות ג, א): ״המזבח היה שלשים ושתים על שלשים ושתים. עלה אמה וכנס אמה, זה היסוד. נמצא שלשים על שלשים. עלה חמש וכנס אמה. זה הסובב. נמצא עשרים ושמנה על עשרים ושמנה. מקום הקרנות אמה מזה ואמה מזה. נמצא עשרים ושש על עשרים ושש. מקום הלוך רגלי הכהנים, אמה מזה ואמה מזה. נמצא עשרים וארבע על עשרים וארבע, מקום המערכה. אמר רבי יוסי, מתחלה לא היה אלא שמנה ועשרים על שמנה ועשרים, כונס ועולה במדה זו, עד שנמצא מקום המערכה עשרים על עשרים. וכשעלו בני הגולה, הוסיפו עליו ארבע אמות מן הדרום וארבע אמות מן המערב, כמין גמא״.\nבקצרה — המחלוקת בכרטיס זה (הפירוט — במתג ״מידות המזבח״ שבתפריט, תחת ״שיטות ומחלוקות״):\n• כמשנה — 32, 30, 28, 26, 24 (ברירת המחדל).\n• לרש״י — הסובב באמה בת חמישה.\n• לרמב״ם — היסוד והסובב באמה בת חמישה.\n• לראב״ד — הקרנות שני טפחים פנימה.\n• לרבי יוסי — המזבח הראשון, 28.\n**ברטנורא:** ״מתחלה״ — בימי שלמה; כונס ועולה של יסוד וסובב וקרנות והילוך הכהנים עד שנשאר מקום המערכה עשרים על עשרים; ״כמין גמא״ — גימל יוונית, כנו״ן הפוכה; הטעם (זבחים) — משום השיתין: בימי שלמה דרשו ״מזבח אדמה״ — אטום כאדמה, והנסכים ירדו לבור שאצל קרן דרומית־מערבית מחוץ למזבח; ובני הגולה הוסיפו בבניין עד שהבור קלוט בתוך המזבח ופתחו נקבים בראשו, ש״שתיה כאכילה״, ו״מזבח אדמה״ — שיהא מחובר באדמה, לא על גבי כיפים ומחילות (ברטנורא מידות ג, א).\n**תוספות יום טוב:** והכתוב ״הכל בכתב מיד ה׳ עלי השכיל״? — ״קרא אשכח ודרוש״: ״זה הוא בית ה׳ האלהים וזה מזבח לעולה״ — מה בית ששים אמה אף מזבח עד ששים אמה ראוי לו (זבחים סב.); ובבית ראשון היה יסוד לדרום, משוך בחלקו של טורף, חוץ מרוח מזרחית (תוספות זבחים סא:); ״גמא״ — צורתה כנגד ההולך מן האולם אל המזבח (תוספות יום טוב מידות ג, א).\n**תפארת ישראל:** בני הגולה ידעו שהנסכים צריכים לזוב למקום המזבח ולא לצדו, ולא יכלו להעתיק את השיתין — מחילה מששת ימי בראשית — ולא את המזבח ממקומו, לפיכך הרחיבוהו ארבע אמות לדרום מעל השיתין וארבע למערב כדי שיישאר ריבוע, והשאירו בשעת הבניין שני נקבים מגגו לשיתין בעזרת קנה ארוך (תפארת ישראל מידות ג, א).\nבמודל: חמישה קווים, כל אחד בגובהו ובצבע משלו — כחול 32 ברצפה, ירוק 30 על היסוד, ורוד 28 על הסובב, סגול 26 וכתום 24 על הגג. ליד המזבח חמש לוחיות, אחת לכל קו, ומסגרת כל לוחית בצבע הקו שלה; מן הצד הן עומדות זו מעל זו כסדר המדרגות, ומלמעלה — בשורה. בתפריט, תחת ״שיטות ומחלוקות״ (מידות המזבח) — שיטות רש״י והרמב״ם באמה בת חמישה טפחים (כלים יז, י), המזבח הראשון של רבי יוסי, 28 עד 20, ולבסוף שיטת הראב״ד, שנראית מלמעלה.", refs: [["מידות ג, א", "Mishnah_Middot.3.1"], ["ברטנורא ג, א", "Bartenura_on_Mishnah_Middot.3.1"], ["תוי״ט ג, א", "Tosafot_Yom_Tov_on_Mishnah_Middot.3.1"], ["תפא״י ג, א", "Yachin_on_Mishnah_Middot.3.1"], ["רמב״ם בית הבחירה ב, ה", "Mishneh_Torah,_The_Chosen_Temple.2.5"], ["זבחים סא:", "Zevachim.61b"], ["זבחים סב.", "Zevachim.62a"], ["כלים יז, י", {"book": 91, "index": 151}]] },
          { t: "חלקי יהודה ובנימין — הרצועה שבדרום המזבח", feature: (ctx.shared.features || {})["tribes"] || null, tg: [70, 13, 5], cam: [95, 190, 95], info: "**הברייתא** (יומא יב.): ״מה היה בחלקו של יהודה — הר הבית, הלשכות והעזרות. ומה היה בחלקו של בנימין — אולם והיכל ובית קדשי הקדשים, ורצועה היתה יוצאה מחלקו של יהודה ונכנסת לחלקו של בנימין, ובה היה מזבח בנוי״.\n**רש״י** שם: ״צד המזרחי רוחב הר הבית, עזרת נשים כולה, ועזרת ישראל כולה, י״א אמה של מקום רגלי דריסת הכהנים... ושם המזבח מתחיל. משם ולמערב בחלקו של בנימין, אלא שבמקום מושב המזבח יוצאה רצועה מחלקו של יהודה ונכנסה לקרן מזרחית דרומית״.\n**בזבחים** (נג:) — לקרן מזרחית דרומית לא היה יסוד, ״לפי שלא היתה בחלקו של טורף. דאמר רב שמואל בר רב יצחק: מזבח אוכל בחלקו של יהודה אמה״. רש״י שם: ״אמה במזרחו אמה בדרומו״ — האמה שבמזרח כלה אמה לפני הקרן המזרחית הצפונית, והאמה שבדרום כלה אמה לפני הקרן הדרומית המערבית; ״והרצועה היתה יוצאה בדרום למזבח ונכנסת בחלקו של בנימין... ומזבח אוכל בה אמה״.\n**במודל**: בזהב — חלקו של יהודה: מקום דריסת רגלי הכהנים, עזרת ישראל ועזרת הנשים (צדו המזרחי של הר הבית אינו צבוע, והוא מסומן בתווית בלבד). בכחול — חלקו של בנימין, מקו כותל המזבח המזרחי ולמערב. בזהב כהה — הרצועה: בדרום המזבח, מאמתו הדרומית ועד כותל העזרה הדרומי; ובצד המזבח שתי רצועות זהב צרות — האמה שבמזרח והאמה שבדרום. עד היכן הרצועה מגיעה בדרום — המקורות אינם אומרים; בחירת מודל. הצבעים — בחירת מודל.", refs: [["יומא יב.", {"book": 107, "index": 256}], ["רש״י יומא יב.", {"book": 2157, "index": 332}], ["זבחים נג:", {"book": 130, "index": 1866}], ["רש״י זבחים נג: — האמה", {"book": 2191, "index": 2590}], ["רש״י זבחים נג: — הרצועה", {"book": 2191, "index": 2591}]] },
          { t: "השיתין — שני הנקבים וטבלת השיש", tg: [40.0, 16.8, 25.0], cam: [35.0, 20.4, 27.2], info: "לשון המשנה (מידות ג, ב): ״ובקרן מערבית דרומית היו שני נקבים, כמין שני חטמין דקין, שהדמים הנתנין על יסוד מערבי ועל יסוד דרומי, יורדין בהן ומתערבין באמה, ויוצאין לנחל קדרון״.\n**הרמב״ם** (בית הבחירה ב, יא): ״ובקרן מערבית דרומית היו שני נקבים כמין שני חטמין דקין. והן הנקראין שיתין שהדמים יורדין בהן ומתערבין באותה הקרן באמה ויוצאין לנחל קדרון״.\nולמטה מהם (מידות ג, ג): ״למטה ברצפה באותה הקרן, מקום היה שם אמה על אמה, וטבלא של שיש, וטבעת היתה קבועה בה, שבו יורדין לשית ומנקין אותו״; והרמב״ם (ב, יב): ״שבו יורדין לשיתין ומנקין אותו״.\nבמודל: שני הנקבים בראש היסוד, בקרן המערבית־דרומית, זה בצד זה; וברצפה שלידה טבלת השיש והטבעת. מקומם המדויק בתוך הקרן, וגודלם — בחירת מודל.", refs: [["מידות ג, ב", "Mishnah_Middot.3.2"], ["מידות ג, ג", "Mishnah_Middot.3.3"], ["רמב״ם בית הבחירה ב, יא", "Mishneh_Torah,_The_Chosen_Temple.2.11"], ["רמב״ם בית הבחירה ב, יב", "Mishneh_Torah,_The_Chosen_Temple.2.12"]] },
          { t: "הטבעות", tg: [52, 14, -27], cam: [52, 46, -4], info: "לשון המשנה (מידות ג, ה): ״וטבעות היו לצפונו של מזבח, ששה סדרים של ארבע ארבע, ויש אומרים, ארבעה של שש שש, שעליהן שוחטין את הקדשים״; (ה, ב): ״מקום הטבעות עשרים וארבע״.\nבקצרה — ״ששה סדרים של ארבע ארבע, ויש אומרים, ארבעה של שש שש״ (מידות ג, ה): לרבינו שמעיה — אלו ואלו עשרים וארבע, וכל סדר שורה אחת; במודל — ששה סדרים של ארבע, ובמתג ״סידור הטבעות״ גם ארבעה של שש.\n**ברטנורא:** לפי שלא היו כופתים את התמיד, התקין יוחנן כהן גדול עשרים וארבע טבעות לעשרים וארבעה משמרות כהונה, קבועות ברצפה ועשויות כמין קשת, שמכניסים בהן צוואר הבהמה בשעת שחיטה ונועצים ראש הטבעת בארץ; בצפון — שקדשי קדשים שחיטתן בצפון (ברטנורא מידות ג, ה).\n**תוספות יום טוב:** ששה סדרים בשורה אחת ובכל סדר ארבע — כ״ד, ויש אומרים ארבעה סדרים של שש — גם כן כ״ד (ר׳ שמעיה); ועל כפיתת התמיד — בתחילת פרק ד של תמיד (תוספות יום טוב מידות ג, ה).\n**רבינו שמעיה** (מידות ג, ה): ״ו׳ סדרים. היו הטבעות בשורה אחת ובכל סדר ארבעה טבעות, שהן כ״ד טבעות לכ״ד משמרות. וי״א ד׳ סדרים היו של שש שש טבעות, שהן נמי כ״ד״ — כל סדר שורה אחת של ארבע.\n**תפארת ישראל:** קבועות ברצפה בצפון המזבח, להכניס בהן צוואר הקרבנות בשעת שחיטה; ולדעתו שימשו רק לבהמה גסה, שהיא חזקה ומפרפרת, וראשה יהיה מונח בהשקט בשעת קבלת הדם — ותמה על הר״ב, שהרי התמיד נכפת יד עם רגל, ובסוטה (מח.) התקנה משום עגלי הקרבן (תפארת ישראל מידות ג, ה).\nבמודל: עשרים וארבע טבעות ברצפה בצפון המזבח, ששה סדרים של ארבע — כל סדר שורה אחת מצפון לדרום; ובמתג ״סידור הטבעות״ (שיטות ומחלוקות) — ארבעה של שש. צורתן — בחירת מודל.", refs: [["מידות ג, ה", "Mishnah_Middot.3.5"], ["ברטנורא ג, ה", "Bartenura_on_Mishnah_Middot.3.5"], ["תוי״ט ג, ה", "Tosafot_Yom_Tov_on_Mishnah_Middot.3.5"], ["תפא״י ג, ה", "Yachin_on_Mishnah_Middot.3.5"], ["מידות ה, ב", "Mishnah_Middot.5.2"], ["רמב״ם בית הבחירה ה, יד", "Mishneh_Torah,_The_Chosen_Temple.5.14"], ["תמיד ד, א", "Mishnah_Tamid.4.1"]] },
          { t: "בית המטבחים", tg: [52, 14, -48], cam: [52, 78, -18], info: "לשון המשנה (מידות ג, ה): ״בית המטבחים היה לצפונו של מזבח, ועליו שמנה עמודים ננסין, ורביעין של ארז על גביהן, ואנקליות של ברזל היו קבועין בהם, ושלשה סדרים היו לכל אחד ואחד, שבהם תולין. ומפשיטין על שלחנות של שיש שבין העמודים״; (שקלים ו, ד): ״שלשה עשר שלחנות היו במקדש, שמונה של שיש בבית המטבחים, שעליהן מדיחין את הקרבים״; (ה, ב): ״מן הטבעות לשלחנות ארבע, מן השלחנות ולננסין ארבע. מן הננסין לכתל העזרה שמנה אמות״.\nבקצרה — המחלוקת בכרטיס זה (הפירוט — במתג ״בית המטבחים — העמודים והאונקליות״ שבתפריט, תחת ״שיטות ומחלוקות״):\n• ברטנורא (ברירת המחדל): ״חתיכות מרבעות של ארז היו על העמודים״, והאונקליות בהן.\n• המאירי: ״כעין קורות קצרות באים מעמוד לעמוד״.\n• הראבי״ה: שמונה העמודים בשורה אחת ממזרח למערב, והשולחנות בשורה משלהם לפניהם.\n• הגר״א: שורה אחת מצפון לדרום, ושולחן בין עמוד לעמוד; השמיני, ארבע אמות אורכו, בראש השורה.\n**ברטנורא:** ״עמודים ננסים״ — עמודי אבן נמוכים; ״רביעין של ארז״ — חתיכות מרובעות של ארז על העמודים; ״אנקליות״ — כעין מזלגות, קבועים ברביעין, ותולים בהם את הבהמה; שלושה סדרים של אנקליות זה למעלה מזה, לבהמה גדולה או קטנה; שולחנות של שיש — ״ולא עשאום של כסף או של זהב דהא אין עניות במקום עשירות, לפי שהזהב והכסף מרתיחים ומסריחים והשיש מצנן ושומר הבשר שלא יסריח״ (ברטנורא מידות ג, ה; ברטנורא שקלים ו, ד).\n**תוספות יום טוב:** ״ועליו״ — באותו מקום (ר׳ שמעיה); הראבי״ה — האנקליות בשלושת הצדדים, מזרח צפון ודרום, ולא למערב, שלא יהפכו המפשיטים אחוריהם לקודש הקדשים; והשולחנות ״שבין העמודים״ — בין המזבח לעמודים, שמונה עמודים ושמונה שולחנות (תוספות יום טוב מידות ג, ה).\n**תפארת ישראל:** לא בית מוקף כתלים — שאם כן אין שוחטים ״על ירך המזבח צפונה״ — אלא כל מקום קבוע קרוי בית; הרביעין מונחים על העמודים ולא מחוברים בהם, משום ״לא תטע לך אשרה כל עץ״; האנקליות לשלושה צדדים ולא למערב; ״על שולחנות״ — אצל השולחנות מפשיטים, ומניחים עליהם את הסכין, ולתוספות (יומא טז.) את תחתית הבהמה הגדולה; ושמונה שולחנות של שיש — ״כדי שיקרר הבשר שיניחו עליו, ולא יסריח״ (תפארת ישראל מידות ג, ה; תפארת ישראל שקלים ו, ד).\nבמודל: בצפון המזבח — שמונה עמודים ננסים, ועליהם הארז והאונקליות, ושמונה שולחנות שיש; מקומם ביחס לטבעות — כמידות ה, ב. ברירת המחדל — כברטנורא: חתיכת ארז מרובעת על כל עמוד, ובה שלושה סדרים של אונקליות. הכפתור ״האונקליות״ שעל המודל מקרב את המבט ומסמן אותן בצבע צף ל־15 שניות. גובה העמודים ומקום האונקליות — בחירת מודל.", refs: [["מידות ג, ה", "Mishnah_Middot.3.5"], ["ברטנורא ג, ה", "Bartenura_on_Mishnah_Middot.3.5"], ["תוי״ט ג, ה", "Tosafot_Yom_Tov_on_Mishnah_Middot.3.5"], ["תפא״י ג, ה", "Yachin_on_Mishnah_Middot.3.5"], ["מידות ה, ב", "Mishnah_Middot.5.2"], ["שקלים ו, ד", "Mishnah_Shekalim.6.4"], ["ברטנורא ו, ד", "Bartenura_on_Mishnah_Shekalim.6.4"], ["תפא״י ו, ד", "Yachin_on_Mishnah_Shekalim.6.4"], ["רמב״ם בית הבחירה ה, יג", "Mishneh_Torah,_The_Chosen_Temple.5.13"], ["מאירי מידות ג, ה", "Meiri_on_Middot.3.5"], ["ביאור הגר״א מידות ה, ב", "Gra_on_Middot.5.2"]] },
          { t: "ספלי הניסוך", feature: (ctx.shared.features || {})["sfalimSee"] || null, tg: () => ui_altarCam(ctx, SFALIM_TG, "cups"), cam: () => ui_altarCam(ctx, SFALIM_CAM, "cups"), info: "לשון המשנה (סוכה ד, ט): ״עלה בכבש ופנה לשמאלו, שני ספלים של כסף היו שם. רבי יהודה אומר, של סיד היו, אלא שהיו משחרין פניהם מפני היין. ומנקבין כמין שני חטמין דקין, אחד מעבה ואחד דק, כדי שיהו שניהם כלין בבת אחת. מערבי של מים, מזרחי של יין״; (מידות ג, א): ״וכשעלו בני הגולה, הוסיפו עליו ארבע אמות מן הדרום וארבע אמות מן המערב, כמין גמא״.\nבקצרה — המחלוקת בכרטיס זה (הפירוט — במתג ״נקבי ספלי הניסוך״ שבתפריט, תחת ״שיטות ומחלוקות״):\n• לרש״י ולברטנורא — ״כמין שני חוטמין״ (ברירת המחדל).\n• לתוספות, לריטב״א ולמאירי — הנקבים בתחתית הספלים.\n**ברטנורא:** ״ופנה לשמאלו״ — שהנסכים נעשים בקרן מערבית־דרומית, וכשפונה לשמאלו היא הראשונה; ״כמין שני חטמין״ — חוטם אחד בכל ספל ונקב אחד בחוטמו, הכהן מערה בפי הספלים, והנסכים מקלחים ויורדים דרך החוטמים על גג המזבח, ״ובמזבח היה נקב שבו היין והמים יורדין לשתין של מזבח, שהן חלולים ועמקים מאד״; נקב היין עבה ושל המים דק, שהמים ממהרים לצאת; ״הספלים היו נתונים אצל הקרן סמוכים זה לזה, זה לפני זה, אחד לצד מערב ואחד לפנים ממנו״ (ברטנורא סוכה ד, ט).\n**תוספות יום טוב:** ״ופנה לשמאלו״ — טעמו בזבחים ו, ג; התוספות הקשו — היאך מורידים בקודש מצלוחית של זהב לספלים של כסף? ותירצו: ״די״ל דספלים היו קבועים בסיד. ולא כלים נינהו דנחשבים כגופו של מזבח״; ״משחרין״ — שאם עירה של יין לתוך של מים, של מים בא להשחיר (תוספות יום טוב סוכה ד, ט).\n**תפארת ישראל:** ״שני ספלים... מחוברין בסיד במזבח, א׳ ליין וא׳ למים״; הכהן מערה בזמן אחד את המים ואת היין, כל אחד לספלו, ומשם דרך החוטם לגג המזבח, ״ומשם דרך נקב שבגג יורדין לשיתין. והוא חלול עמוק מאוד שתחת המזבח״; ומן המזבח (מידות ג, א): בני הגולה השאירו בבניין שני נקבים מגגו לשיתין בעזרת קנה ארוך, ובבועז (מידות ג, ב) — התנא לא הזכירם, שהם בכלל שטח המזבח (תפארת ישראל סוכה ד, ט; תפארת ישראל מידות ג, א).\nבמודל: שני הספלים בראש המזבח בקרן דרומית־מערבית, קבועים בגג, המערבי של מים והמזרחי של יין; מהם יורדים הנסכים אל השיתין שתחת הקרן, היורדים עד התהום (סוכה מט.). צורת הנקבים — חוטם בולט (רש״י וברטנורא) או נקב בתחתית (תוספות) — בתפריט, תחת ״שיטות ומחלוקות״.\nבמקום הזה פינת המזבח נעשית שקופה, וגם הרצפה שתחתיה: רואים את הנקבים יורדים מראש המזבח אל השיתין — ״חלל שתחת המזבח כנגד מקום הנסכים״ (רש״י סוכה מט.). הספלים קבועים בגג בסיד, כדברי התוספות והתפארת ישראל. בשיטת רש״י: חוטם לכל ספל, ונקב בגג לכל אחד — אחד למים ואחד ליין (וכך גם לתפארת ישראל במידות ג, א), מעט אחרי פי החוטם, במקום שהנסך נופל. בשיטת התוספות: הנקב בתחתית כל ספל, ויורד ממנו ישר; ״ולשון מעובה משמע ששולי הספל היו עבים ומתוך כך אין המשקה ממהר לצאת״ (תוספות סוכה מח:) — במודל, בשיטה זו, ספל המים תחתיתו עבה: המים ממהרים לצאת מן היין (״שהמים ממהרים לצאת״, רש״י שם), והתחתית העבה משווה ביניהם; והנקבים שווים. ועוד בתוספות שם: ״ושמא כמין בליטת חוטם היה עשוי על הנקב שלא יפול עליו דבר לסותמו״ — במודל, מעל הנקב שבכל ספל, כיסוי קטן כמין חוטם, פתוח לדרום. גודל הספלים, מקומם המדויק, צורת החוטם שמעל הנקב, וגודל השיתין ועומקם — בחירת מודל.", refs: [["סוכה ד, ט", "Mishnah_Sukkah.4.9"], ["ברטנורא ד, ט", "Bartenura_on_Mishnah_Sukkah.4.9"], ["תוי״ט ד, ט", "Tosafot_Yom_Tov_on_Mishnah_Sukkah.4.9"], ["תפא״י ד, ט", "Yachin_on_Mishnah_Sukkah.4.9"], ["מידות ג, א", "Mishnah_Middot.3.1"], ["ברטנורא ג, א", "Bartenura_on_Mishnah_Middot.3.1"], ["תפא״י ג, א", "Yachin_on_Mishnah_Middot.3.1"], ["בועז ג, ב", "Boaz_on_Mishnah_Middot.3.2"], ["סוכה מח:", "Sukkah.48b"], ["סוכה מט.", "Sukkah.49a"], ["זבחים סא:", "Zevachim.61b"], ["תמיד ז, ג", "Mishnah_Tamid.7.3"], ["רמב״ם תמידין ומוספין י, ז", "Mishneh_Torah,_Daily_Offerings_and_Additional_Offerings.10.7"], ["תוי״ט ג, א", "Tosafot_Yom_Tov_on_Mishnah_Middot.3.1"], ["סוכה מח.", "Sukkah.48a"], ["רש״י סוכה מט.", { book: 2163, index: 2307 }], ["תוספות סוכה מח:", { book: 1903, index: 504 }], ["תוספות סוכה מח. (בסיד)", { book: 1903, index: 502 }]] },
          { t: "כבשים קטנים — רש״י", action: () => { const r = OPS_BY_ID["sh25"]; if (r) { r.mark("o0"); try { r.onPick("o0"); } catch (_) {} } }, tg: () => ui_altarCam(ctx, [42, 17, 30], "ramp"), cam: () => ui_altarCam(ctx, [26, 45, 48], "ramp"), info: "לשון המשנה (מידות ג, ג): ״וכבש היה לדרומו של מזבח, שלשים ושתים על רחב שש עשרה״ — הכבשים הקטנים אינם במשנה אלא בגמרא: ״שני כבשים קטנים יוצאין מן הכבש, שבהן פונים ליסוד ולסובב, ומובדלין מן המזבח מלא נימא״ (זבחים סב:).\nבקצרה — המחלוקת בכרטיס זה (הפירוט — במתג ״הכבשים הקטנים״ שבתפריט, תחת ״שיטות ומחלוקות״):\n• לרש״י — שני כבשים קטנים, לסובב וליסוד (ברירת המחדל).\n• לתוספות — גם שלישי.\n**רש״י** (זבחים סב: ד״ה שני כבשים): אחד לסובב ממזרח הכבש הגדול, מימין, ואחד ליסוד ממערבו, משמאל, אל היסוד הדרומי ששם שופכים שיירי החטאת.\nברטנורא ותפארת ישראל (מידות ג, ג): על הכבש הגדול בלבד — גשר משופע, שאין עולים למזבח במעלות; התפארת ישראל מוסיף שראש הכבש רחוק קצת מגג המזבח (תוספות זבחים סב:).\nבמודל: שני כבשים קטנים כרש״י; רוחבם ושיפועם — בחירת מודל. \nשני הכבשים הקטנים יוצאים מגוף הכבש הגדול (״יוצאים ממנו״, רמב״ם ב, יד). רש״י (זבחים סב:): ״אותו שפונין בו לסובב יצא במזרחו של כבש לימין ויוצא ומתחיל בשפולו של כבש ונמשך ועולה באלכסון עד שמגיע לסובב״.\n**הכבש העולה לסובב** (ולתוספות — שני הכבשים העולים לסובב), במודל: הוא יוצא מצד הכבש הגדול בשליש התחתון שלו, ״בשפולו של כבש״. בתחילתו הוא צמוד לכבש הגדול ובגובה הילוכו; משם הוא פונה ממנו באלכסון ועולה במתינות, ובינו לבין הכבש הגדול אוויר גמור עד הרצפה. קצהו העליון חתוך לאורך שפת הסובב ובגובהה — כהמשך לסובב — ובכל זאת ״ומובדלין מן המזבח מלא נימא״. כמה הוא נוטה ורוחבו — בחירת מודל.\n**הכבש היורד ליסוד — לרש״י:** ״והפונה ליסוד יוצא למערבו... פונה לשמאלו ליסוד דרומי, ומתחיל לצאת בשיפולו של כבש רחוק מן המזבח, כדי שיהא נוח לשפע ולירד ליסוד״. במודל הוא הולך באלכסון מצלעו המערבית של הכבש הגדול אל אמת היסוד שבקרן הדרומית־מערבית (מידות ג, א: ״ואוכל בדרום אמה אחת״), כציור התוספות יום טוב והתפארת ישראל.\n**הכבש היורד ליסוד — לתוספות,** כביאור התוספות יום טוב (זבחים ו, ג): הוא צמוד לכבש השלישי מבחוץ, לאורכו, מאותו שליש עד הקרן הדרומית־מערבית של היסוד — כבש אחד רחב, ומקצתו מוגבה עד הסובב.\n**שלא צויר:** כבש ליסוד הצמוד לכבש הגדול — אינו מוכרח מן המקורות, ואין לו דרך להגיע אל אמת היסוד.", refs: [["מידות ג, ג", "Mishnah_Middot.3.3"], ["ברטנורא ג, ג", "Bartenura_on_Mishnah_Middot.3.3"], ["תפא״י ג, ג", "Yachin_on_Mishnah_Middot.3.3"], ["זבחים סב:", "Zevachim.62b"], ["רמב״ם בית הבחירה ב, יד", "Mishneh_Torah,_The_Chosen_Temple.2.14"], ["מידות ג, א", "Mishnah_Middot.3.1"], ["רש״י זבחים סב:", {"book": 2191, "index": 3022}]] },
          { t: "כבשים קטנים — תוספות", action: () => { const r = OPS_BY_ID["sh25"]; if (r) { r.mark("o1"); try { r.onPick("o1"); } catch (_) {} } }, tg: () => ui_altarCam(ctx, [42, 17, 30], "ramp"), cam: () => ui_altarCam(ctx, [26, 45, 48], "ramp"), info: "לשון המשנה (מידות ג, ג): ״וכבש היה לדרומו של מזבח, שלשים ושתים על רחב שש עשרה״ — הכבשים הקטנים אינם במשנה אלא בגמרא (זבחים סב:).\nבקצרה — המחלוקת בכרטיס זה (הפירוט — במתג ״הכבשים הקטנים״ שבתפריט, תחת ״שיטות ומחלוקות״):\n• לרש״י — שני כבשים קטנים, לסובב וליסוד (ברירת המחדל).\n• לתוספות — גם שלישי.\n**תוספות** (זבחים סד. ד״ה יותר מל״א אמות): הקונטרס (רש״י) סובר שבמערב לא היה כבש קטן לסובב, ותוספות מסיקים ״נראה דהיה שם כבש״ — גם במערב היה כבש קטן לסובב, ולכן שלושה כבשים קטנים.\nברטנורא ותפארת ישראל (מידות ג, ג): על הכבש הגדול בלבד — גשר משופע, שאין עולים למזבח במעלות.\nבמודל: כבש שלישי במערב הכבש הגדול העולה לסובב; מקומו ומידותיו — בחירת מודל. \nשני הכבשים הקטנים יוצאים מגוף הכבש הגדול (״יוצאים ממנו״, רמב״ם ב, יד). רש״י (זבחים סב:): ״אותו שפונין בו לסובב יצא במזרחו של כבש לימין ויוצא ומתחיל בשפולו של כבש ונמשך ועולה באלכסון עד שמגיע לסובב״.\n**הכבש העולה לסובב** (ולתוספות — שני הכבשים העולים לסובב), במודל: הוא יוצא מצד הכבש הגדול בשליש התחתון שלו, ״בשפולו של כבש״. בתחילתו הוא צמוד לכבש הגדול ובגובה הילוכו; משם הוא פונה ממנו באלכסון ועולה במתינות, ובינו לבין הכבש הגדול אוויר גמור עד הרצפה. קצהו העליון חתוך לאורך שפת הסובב ובגובהה — כהמשך לסובב — ובכל זאת ״ומובדלין מן המזבח מלא נימא״. כמה הוא נוטה ורוחבו — בחירת מודל.\n**הכבש היורד ליסוד — לרש״י:** ״והפונה ליסוד יוצא למערבו... פונה לשמאלו ליסוד דרומי, ומתחיל לצאת בשיפולו של כבש רחוק מן המזבח, כדי שיהא נוח לשפע ולירד ליסוד״. במודל הוא הולך באלכסון מצלעו המערבית של הכבש הגדול אל אמת היסוד שבקרן הדרומית־מערבית (מידות ג, א: ״ואוכל בדרום אמה אחת״), כציור התוספות יום טוב והתפארת ישראל.\n**הכבש היורד ליסוד — לתוספות,** כביאור התוספות יום טוב (זבחים ו, ג): הוא צמוד לכבש השלישי מבחוץ, לאורכו, מאותו שליש עד הקרן הדרומית־מערבית של היסוד — כבש אחד רחב, ומקצתו מוגבה עד הסובב.\n**שלא צויר:** כבש ליסוד הצמוד לכבש הגדול — אינו מוכרח מן המקורות, ואין לו דרך להגיע אל אמת היסוד.", refs: [["מידות ג, ג", "Mishnah_Middot.3.3"], ["ברטנורא ג, ג", "Bartenura_on_Mishnah_Middot.3.3"], ["תפא״י ג, ג", "Yachin_on_Mishnah_Middot.3.3"], ["זבחים סד.", "Zevachim.64a"], ["זבחים סב:", "Zevachim.62b"], ["רמב״ם בית הבחירה ב, יד", "Mishneh_Torah,_The_Chosen_Temple.2.14"], ["מידות ג, א", "Mishnah_Middot.3.1"], ["רש״י זבחים סב:", {"book": 2191, "index": 3022}], ["תוספות זבחים סד.", {"book": 1936, "index": 681}]] },
          { t: "הכבש הגדול", tg: () => ui_altarCam(ctx, [55.5, 18, 38], "ramp"), cam: () => ui_altarCam(ctx, [96, 46, 56], "ramp"), info: "לשון המשנה (מידות ג, ג): ״וכבש היה לדרומו של מזבח, שלשים ושתים על רחב שש עשרה, ורבובה היתה לו במערבו, ששם היו נותנים פסולי חטאת העוף״; (ה, ב): ״הכבש והמזבח ששים ושתים״.\nבקצרה — המחלוקות בכרטיס זה (הפירוט — במתגים שבתפריט, תחת ״שיטות ומחלוקות״):\n• **הרווח שבין הכבש למזבח:** לרש״י ולרמב״ם — כחוט השערה, ״אויר מעט״ (ברירת המחדל); לתוספות — אויר גדול וניכר; לרבינו חיים — יותר מאמת הסובב.\n• **הכבשים הקטנים:** לרש״י — שני כבשים קטנים, לסובב וליסוד (ברירת המחדל); לתוספות — גם שלישי.\n**ברטנורא:** כמין גשר משופע ועשוי מדרון, שבו עולים ויורדים מן המזבח, שאי אפשר לעלות לו במעלות — ״ולא תעלה במעלות על מזבחי״; אורכו מדרום לצפון ורוחבו ממזרח למערב; הרבובה — כמין חלון חלול, אמה על אמה, במערבו של הכבש עצמו, ״רבובה״ כמו נבובה; פסולי חטאת העוף מונחים בה עד שיבואו לידי נותר, ואחר כך יוצאים לבית השרפה (ברטנורא מידות ג, ג).\n**תוספות יום טוב:** הכבש בדרום — כל פינות שאתה פונה לא יהו אלא דרך ימין, ואין רוח ראויה לכך אלא דרום (זבחים סב:); הרבובה — לא חלול מפולש לכל רוחב הכבש אלא כחלונות שבתמיד (ה, ג), ואינה נראית אלא במערבו, ולכן נשתנה שמה מנבובה (תוספות יום טוב מידות ג, ג).\n**תפארת ישראל:** גשר משופע, אטום מתחתיו, עולה ל״ב אמה בשיפוע מן הרצפה אל גג המזבח; בראשו רחוק קצת מגג המזבח ריחוק ניכר (תוספות זבחים סב:), והכהן זורק את הנתחים מעל המרחק אל האש; שפה גבוהה קצת בשתי שפתיו שלא ייפלו הכהנים; באמצע רוחב המזבח — שמונה אמות מכל צד למטה ושש למעלה; הרבובה — גומא מרובעת בגג הכבש במערבו, סמוך לגג המזבח, אמה על אמה ועמוקה כאורך זרוע; ובבועז — לרש״י (פסחים לד.) הגומא ברצפת העזרה ממערב לכבש, ולרמב״ם ולראב״ד בגוף הכבש, והראב״ד: ״רבובה״ מלשון ארובה — בגג הכבש (תפארת ישראל מידות ג, ג; בועז ג, ג).\nבמודל: הכבש ל״ב על ט״ז בדרום המזבח, עולה תשע אמות, וראשו מובדל מן המזבח ב״אויר מעט״ (זבחים סב:; רמב״ם בית הבחירה ב, יג); שתי האמות העליונות פורחות על כניסת היסוד והסובב, ולכן הכבש והמזבח ששים ושתים (ה, ב); הרבובה — חלון בצד המערבי (כרמב״ם וברטנורא). שני הכבשים הקטנים — בתפריט, תחת ״שיטות ומחלוקות״ (רש״י או תוספות); מידותיהם ומקומם — בחירת מודל.\nשלושה רובדין: בבית יוסף (אורח חיים קכג) בשם רבינו האי: ״ובין כבש למזבח היו שלש רובדין של אבן, ויורד בהם ג׳ פסיעות על עקב״. ובבנין ציון (סימן יב) ביאר את מקומם: אחד במקום שהכבש פורח על הסובב, אחד במקום שהוא פורח על היסוד, ואחד כנגד אוויר הקרקע. במודל: שלושה חריצים בראש הכבש, בחציו המזרחי, ובינם שלושה רובדין המחוברים בצידם אל אמצע הכבש; צורת החריצים, רוחבם ומקומם — בחירת מודל.", refs: [["מידות ג, ג", "Mishnah_Middot.3.3"], ["ברטנורא ג, ג", "Bartenura_on_Mishnah_Middot.3.3"], ["תוי״ט ג, ג", "Tosafot_Yom_Tov_on_Mishnah_Middot.3.3"], ["תפא״י ג, ג", "Yachin_on_Mishnah_Middot.3.3"], ["מידות ה, ב", "Mishnah_Middot.5.2"], ["בועז ג, ג", "Boaz_on_Mishnah_Middot.3.3"], ["רמב״ם בית הבחירה ב, יג", "Mishneh_Torah,_The_Chosen_Temple.2.13"], ["רמב״ם בית הבחירה ב, יד", "Mishneh_Torah,_The_Chosen_Temple.2.14"], ["זבחים סב:", "Zevachim.62b"], ["בית יוסף, אורח חיים קכג", "Beit_Yosef_OC.123"], ["בנין ציון, יב", "Binyan_Tzion.12"]] },
          { t: "עולים במזרח ויורדים במערב — הכבש", feature: (ctx.shared.features || {})["rampWays"] || null, tg: () => ui_altarCam(ctx, [50, 13, 38], "ramp"), cam: () => ui_altarCam(ctx, [86, 44, 50], "ramp"), info: "לשון המשנה (יומא ד, ה): ״בכל יום כהנים עולים במזרחו של כבש ויורדין במערבו, והיום כהן גדול עולה באמצע ויורד באמצע. רבי יהודה אומר, לעולם כהן גדול עולה באמצע ויורד באמצע״.\nבמודל: על פני הכבש הגדול — חיצים כחולים במחצית המזרחית, כלפי מעלה; חיצים כתומים במחצית המערבית, כלפי מטה; וחיצים זהובים באמצע, למעלה ולמטה — של הכהן הגדול ביום הכיפורים, כתנא קמא; ולרבי יהודה זו דרכו בכל ימות השנה. רוחב כל מסלול והסימון — בחירת מודל.", refs: [["יומא ד, ה", {"book": 55, "index": 35}]] },
          { t: "הכיור", tg: [22, 18, 57], cam: [30, 42, 44], info: "לשון המשנה (מידות ג, ו): ״הכיור היה בין האולם ולמזבח, ומשוך כלפי הדרום״; (יומא ג, י): ״בן קטין עשה שנים עשר דד לכיור, שלא היו לו אלא שנים. ואף הוא עשה מוכני לכיור, שלא יהיו מימיו נפסלין בלינה״.\n**ברטנורא:** בן קטין — כהן גדול היה; שנים עשר דד — ״כדי שיהיו שנים עשר כהנים הזוכים בפיס של תמיד של שחר מקדשים בבת אחת״, ולא עשה דד לשוחט, שהשחיטה כשרה בזר; ״מוכני — גלגל לשקעו בבור, שיהיו מימיו מחברים בבור ולא יפסלו בלינה״ (ברטנורא יומא ג, י).\n**תוספות יום טוב:** ״משוך כלפי הדרום״ — שלא היה עומד באמצע (ר׳ שמעיה); על המוכני — לרבי יוחנן (זבחים כא:) משקעים אותו מבערב, ולרב חסדא סמוך לעלות השחר, והגלגל להשמיע קול (תמיד א; ג); והשיב לבעל ״כף נחת״ — הבור שתחת הכיור, בין האולם ולמזבח: ״דבמקום הבור חסרו מן המעלות עד כדי שעורה״, או שהיקף הכיור תשע אמות ואלכסונו שלוש, במקום הפנוי (תוספות יום טוב מידות ג, ו; תוספות יום טוב יומא ג, י).\n**תפארת ישראל:** לא ממוצע בין האולם למזבח ממש, אלא משוך לדרום, כנגד הרווח שבין האולם למזבח; הבאר שמעליה היה הכיור תלוי בגלגל — בנויה באמצע המעלות לצד דרום, על שיפוע ההר; שנים עשר דד — לשנים עשר הכהנים שזכו בתמיד, שהשוחט אינו צריך קידוש (תפארת ישראל מידות ג, ו; תפארת ישראל יומא ג, י).\n**בקצרה —** המחלוקת בכרטיס זה (הפירוט — במתג ״המוכני של הכיור״, בתפריט תחת ״שיטות ומחלוקות״):\n• לרש״י, לראב״ד ולברטנורא — המוכני הוא גלגל, ובו משקיעים את הכיור בבור בערב (ברירת המחדל).\n• לרמב״ם — המוכני הוא כלי חול סביב הכיור, ובו המים תמיד, ומהם שותתים לכיור כדי הצורך (בית הבחירה ג, יח; פירוש המשניות תמיד א, ד); ובפירושו לתמיד (ג, ח): ״מכסה גבוה יורד בגלגל״ — ולתוספות יום טוב הוא אותו הכלי.\nבמודל: הכיור דרומית למעלות האולם, בין האולם למזבח, משוך לדרום; שנים עשר דדים. הכיור תלוי בגלגל מעל באר — ״הבאר שמעליה היה הכיור תלוי בגלגל״ (תפארת ישראל) — והמוכני מורידו לתוכה ומעלהו; ראו ״הדגמת המוכני״. צורת הגלגל ועומק הבאר — בחירת מודל. ובמתג ״המוכני של הכיור״ — לשיטת הרמב״ם: כלי סביב הכיור, ובו המים.\n״בור הגולה״ שבלשון הרא״ש (תמיד כח:: ״לשקע בגלגל את הכיור לתוך בור הגולה״) — על שם בני הגולה שכרו אותו, כלשון הראבי״ה שבתוספות יום טוב (מידות ה, ד): ״ובני הגולה כרו שם בור לשקעו״; ולכן במודל הכיור עומד מעל הבור שתחתיו, ולא בלשכת הגולה (בחירת מודל).", refs: [["מידות ג, ו", "Mishnah_Middot.3.6"], ["ברטנורא ג, ו", "Bartenura_on_Mishnah_Middot.3.6"], ["תוי״ט ג, ו", "Tosafot_Yom_Tov_on_Mishnah_Middot.3.6"], ["תפא״י ג, ו", "Yachin_on_Mishnah_Middot.3.6"], ["יומא ג, י", "Mishnah_Yoma.3.10"], ["ברטנורא ג, י", "Bartenura_on_Mishnah_Yoma.3.10"], ["תוי״ט ג, י", "Tosafot_Yom_Tov_on_Mishnah_Yoma.3.10"], ["תפא״י ג, י", "Yachin_on_Mishnah_Yoma.3.10"], ["רמב״ם בית הבחירה א, ו", "Mishneh_Torah,_The_Chosen_Temple.1.6"], ["רמב״ם בית הבחירה ג, יח", "Mishneh_Torah,_The_Chosen_Temple.3.18"], ["זבחים נט.", "Zevachim.59a"], ["יומא לז.", {"book": 107, "index": 889}], ["רש״י יומא לז.", {"book": 2157, "index": 1384}], ["ברטנורא יומא ג, י", "Bartenura_on_Mishnah_Yoma.3.10"], ["השגות הראב״ד בית הבחירה ג, יח", {"book": 5252, "index": 20}], ["כסף משנה בית הבחירה ג, יח", {"book": 4260, "index": 166}], ["אבן האזל בית הבחירה ג, יח", {"book": 4466, "index": 45}], ["פירוש המשניות לרמב״ם תמיד א, ד", {"book": 575, "index": 10}], ["פירוש המשניות לרמב״ם תמיד ג, ח", {"book": 575, "index": 38}], ["תוספות יום טוב תמיד א, ד", {"book": 944, "index": 45}]] },
          { t: "הדגמת המוכני — הכיור יורד לבור ועולה", action: () => { const M = ctx.shared.mukhni; if (M && typeof M.demo === 'function') M.demo(); }, tg: [23, 21, 55.2], cam: [12, 29, 63.8], info: "לשון המשנה (יומא ג, י): ״ואף הוא עשה מוכני לכיור, שלא יהיו מימיו נפסלין בלינה״; ובתמיד (א, ד): ״עד ששומעין קול העץ שעשה בן קטין מוכני לכיור, והן אומרים הגיע עת. קדש ידיו ורגליו מן הכיור״; ושם (ג, ח): ״מיריחו היו שומעין קול העץ שעשה בן קטין מוכני לכיור״.\n**ברטנורא** (יומא ג, י): ״מוכני — גלגל לשקעו בבור, שיהיו מימיו מחברים בבור ולא יפסלו בלינה״.\n**תוספות יום טוב:** מתי משקיעים — לרבי יוחנן מבערב, ולרב חסדא סמוך לעלות השחר; והבור שתחת הכיור — בין האולם ולמזבח (תוספות יום טוב יומא ג, י; מידות ג, ו).\n**תפארת ישראל:** ״הבאר שמעליה היה הכיור תלוי בגלגל״ — באמצע המעלות לצד דרום (תפארת ישראל מידות ג, ו).\n**בקצרה —** המחלוקת בכרטיס זה (הפירוט — במתג ״המוכני של הכיור״, בתפריט תחת ״שיטות ומחלוקות״):\n• לרש״י, לראב״ד ולברטנורא — המוכני הוא גלגל, ובו משקיעים את הכיור בבור בערב (ברירת המחדל).\n• לרמב״ם — המוכני הוא כלי חול סביב הכיור, ובו המים תמיד, ומהם שותתים לכיור כדי הצורך (בית הבחירה ג, יח; פירוש המשניות תמיד א, ד); ובפירושו לתמיד (ג, ח): ״מכסה גבוה יורד בגלגל״ — ולתוספות יום טוב הוא אותו הכלי.\nבהדגמה: בערב הגלגל מסתובב והכיור יורד לתוך מי הבור; בלילה מימיו מחוברים במי הבור; בבוקר — ״קול העץ... הגיע עת״ — והכיור עולה. הכיור תלוי בחבלים על ציר הגלגל, ואין לו כן. צורת הגלגל, עומק הבור ומקומו — בחירת מודל. לשיטת הרמב״ם (במתג ״המוכני של הכיור״) יורד עם הכיור גם הכלי שסביבו, כדברי אבן האזל — בחירת מודל.", refs: [["יומא ג, י", "Mishnah_Yoma.3.10"], ["ברטנורא יומא ג, י", "Bartenura_on_Mishnah_Yoma.3.10"], ["תמיד א, ד", "Mishnah_Tamid.1.4"], ["תמיד ג, ח", "Mishnah_Tamid.3.8"], ["תוי״ט יומא ג, י", "Tosafot_Yom_Tov_on_Mishnah_Yoma.3.10"], ["תפא״י מידות ג, ו", "Yachin_on_Mishnah_Middot.3.6"], ["יומא לז.", {"book": 107, "index": 889}], ["רש״י יומא לז.", {"book": 2157, "index": 1384}], ["רמב״ם בית הבחירה ג, יח", "Mishneh_Torah,_The_Chosen_Temple.3.18"], ["השגות הראב״ד בית הבחירה ג, יח", {"book": 5252, "index": 20}], ["כסף משנה בית הבחירה ג, יח", {"book": 4260, "index": 166}], ["אבן האזל בית הבחירה ג, יח", {"book": 4466, "index": 45}], ["פירוש המשניות לרמב״ם תמיד א, ד", {"book": 575, "index": 10}], ["פירוש המשניות לרמב״ם תמיד ג, ח", {"book": 575, "index": 38}], ["תוספות יום טוב תמיד א, ד", {"book": 944, "index": 45}]] },
          { t: "שלוש המחתות — בכל יום וביום הכיפורים", feature: (ctx.shared.features || {})["machtot"] || null, tg: () => ui_altarCam(ctx, [39.2, 16.2, 20.0], true), cam: () => ui_altarCam(ctx, [36, 21, 15], true), info: "לשון המשנה (יומא ד, ד): ״בכל יום היה חותה בשל כסף ומערה בתוך של זהב, והיום חותה בשל זהב ובה היה מכניס. בכל יום חותה בשל ארבעת קבין ומערה בתוך של שלשת קבין, והיום חותה בשל שלשת קבין, ובה היה מכניס... בכל יום היתה כבדה, והיום קלה. בכל יום היתה ידה קצרה, והיום ארכה. בכל יום היה זהבה ירוק, והיום אדם, דברי רבי מנחם״.\nהגמרא (יומא מד:): ״תנא, בכל יום היתה גלדה עבה, והיום רך. בכל יום היתה קצרה, והיום ארוכה. מאי טעמא — כדי שתהא זרועו של כהן גדול מסייעתו״; ״תנא, בכל יום לא היה לה ניאשתיק, והיום היה לה ניאשתיק. דברי בן הסגן״ — ״טבעת בראשה שמקשקש ומשמיע קול״ (רש״י).\nבקצרה — ״ניאשתיק״: לרש״י — טבעת בראשה, המשמיעה קול; לריב״א שבתוספות, על פי הירושלמי — ״כעין נרתק של עור היה עשוי סביב ידה של מחתה לאחוז בה שלא יכווה״; ולמאירי — ״ענין בסיס״, שתשב המחתה על שוליה. במודל — כרש״י.\nבקצרה — המחלוקת: ״רבי יוסי אומר, בכל יום חותה בשל סאה ומערה בתוך של שלשת קבין״ (יומא ד, ד); ובברייתא (יומא מד:): ״רבי ישמעאל בנו של רבי יוחנן בן ברוקה אומר: בשל קביים היה מכניס״. במודל — כתנא קמא.\nבמודל (רק כדי להשוות): שלוש המחתות זו בצד זו, על רצפת העזרה, ליד קרן המזבח הדרומית מערבית — של כסף (ארבעת קבין); של זהב ירוק (שלשת קבין, דופנה עבה וידה קצרה); ושל יום הכיפורים — זהב אדום, דופנה דקה, ידה ארוכה, ובראשה טבעת. מידותיהן, צורתן ומקומן — בחירת מודל; וכן ייחוס ״כבדה״ ו״ידה קצרה״ למחתת הזהב של כל יום, ולא לשל כסף.", refs: [["יומא ד, ד", {"book": 55, "index": 34}], ["יומא מד:", {"book": 107, "index": 1129}], ["יומא מד: (ניאשתיק)", {"book": 107, "index": 1130}], ["רש״י יומא מד:", {"book": 2157, "index": 1718}], ["תוספות יומא מד:", {"book": 1908, "index": 358}], ["מאירי יומא מד:", {"book": 2199, "index": 399}], ["יומא מד: (בשל קביים)", {"book": 107, "index": 1127}]] },
          { t: "שולחן החלבים — שני השולחנות שבמערב הכבש", tg: [40.4, 17.2, 29.4], cam: [27, 31, 43], info: "לשון המשנה (תמיד ז, ג): ״ושני כהנים עומדים על שלחן החלבים ושתי חצוצרות של כסף בידם, תקעו והריעו ותקעו״; (שקלים ו, ד): ״ושנים במערב הכבש, אחד של שיש ואחד של כסף על של שיש היו נותנים את האברים, על של כסף כלי שרת״.\n**הרמב״ם** (בית הבחירה ב, טו): ״ושני שלחנות היו במערב הכבש אחד של שיש שנותנין עליו את האיברים ואחד של כסף שנותנין עליו כלי השרת״; ובפירוש המשנה (תמיד ז, ג): ״ואחד של שיש נותנין עליו האברים והוא שלחן החלבים הנזכר כאן״.\n**ברטנורא** (תמיד ז, ג): ״שתי שלחנות היו במערבו של כבש, אחד שלחן של כסף שבו נותנין כלי שרת, ואחד שלחן של שיש שבו נותנים האברין, והוא נקרא שלחן החלבים״.\n**הראב״ד** (מובא במלאכת שלמה, תמיד ז, ג): ״שלחן החלבים נראה שלחן האברים ששנינו במסכת שקלים״; ״ולפיכך קורא אותו בכאן של חלבים לפי שבשעת ניסוך שאר זבחים הנאכלין שהיו חלבים שלהם מונחין על זה השלחן כמו כן היו התוקעים עומדים עליו״; ומקומו — ״שהרי במערבו של כבש היה השלחן היינו בקרן מערבית דרומית״.\n**הרא״ש** (מובא במלאכת שלמה, שקלים ו, ד): ״דהכא מיירי בעולת יחיד דפעמים שכהן אחד מקריב עולה לבדו ומניח האברין על השלחן עד שמעלן זה אחר זה״; ואברי התמיד — על הכבש עצמו: ״ונתנום מחצי הכבש ולמטה במערבו״ (תמיד ד, ג). ועל התוקעים (פירוש הרא״ש, תמיד לג:): ״על שולחן החלבים. שהוא גבוה״.\n**תפארת ישראל** (יכין, תמיד ז, ג): ״וא׳ של שיש שנותנין עליו האברים של כל קרבן [חוץ מהתמיד] קודם שיקחו אותן הכהנים להעלותן למזבח, והוא הנקרא שולחן החלבים״.\n**הרמב״ם** (תמידין ומוספין ו, ו): ״כשהיו נותנין היין למנסך. היו שני כהנים עומדין על שלחן החלבים ושתי חצוצרות בידן״.\nבמודל: שני השלחנות במערב הכבש, סמוך לקרן המערבית־הדרומית של המזבח — כדברי הראב״ד; שלחן השיש קרוב לקרן, ושלחן הכסף אחריו. בהדגמת ״סדר עבודת הבוקר״ — שני התוקעים עומדים על שלחן השיש בשעת ניסוך היין, ומחתת הזהב מונחת על שלחן הכסף. מידותיהם, גובהם (אמה וחצי) ומקומם המדויק — בחירת מודל: ממערב לכבש ליסוד, שלא יחסמו את הדרך אליו.", refs: [["תמיד ז, ג", {"book": 88, "index": 40}], ["שקלים ו, ד", {"book": 54, "index": 41}], ["רמב״ם בית הבחירה ב, טו", {"book": 337, "index": 38}], ["פירוש המשניות לרמב״ם תמיד ז, ג", {"book": 575, "index": 78}], ["ברטנורא תמיד ז, ג", {"book": 634, "index": 242}], ["מלאכת שלמה תמיד ז, ג (הראב״ד)", {"book": 1202, "index": 319}], ["מלאכת שלמה שקלים ו, ד (הרא״ש)", {"book": 1152, "index": 215}], ["תמיד ד, ג", {"book": 88, "index": 25}], ["פירוש הרא״ש תמיד לג:", {"book": 2224, "index": 326}], ["יכין תמיד ז, ג", {"book": 818, "index": 698}], ["רמב״ם תמידין ומוספין ו, ו", {"book": 344, "index": 92}]] },
          { t: "סדר עבודת הבוקר — הדגמה (מסכת תמיד)", action: () => { const T = ctx.shared.tour; if (T && typeof T.start === 'function') T.start('tamid'); }, tg: [55.5, 22, 9], cam: [96, 60, 62], info: "סדר עבודת הבוקר בבית המקדש, כפי שהוא מתואר במסכת תמיד: מבית המוקד בלילה, דרך תרומת הדשן, המערכה, הפייסות, הטלה, הטבת הנרות, זריקת הדם, הקטורת, ברכת כהנים והאברים — ועד הנסכים ושיר הלויים. כל שלב מוצג במקומו במודל, עם לשון המשנה והרמב״ם ועם מקורות.\nהסדר — לפי המתג ״סדר עבודת הבוקר״ שבתפריט, תחת ״שיטות ומחלוקות״ (אביי, או הרמב״ם); הנרות — לפי המתג ״המנורה והנרות בבוקר״. דמויות הכהנים — כדמויות הפייסות; השחיטה, ההפשט והניתוח אינם מוצגים. מיקומים, מסלולים ומספר הכהנים — בחירת מודל.", refs: [["תמיד א, א", "Mishnah_Tamid.1.1"], ["יומא לג.", "Yoma.33a"], ["רמב״ם תמידין ומוספין ו, א", "Mishneh_Torah,_Daily_Offerings_and_Additional_Offerings.6.1"]], tourNoAct: true, noFly: true }
        ]],
        ["ההיכל ופנים", [
          { t: "האולם", view: "ulam", key: "ulam", action: () => { if (ctx.shared.openFor) ctx.shared.openFor("hei-ulam", 15000); }, tourThen: [{"cam": [62, 58, 14], "tg": [15, 56, 0]}, {"cam": [117, 62, 0.5], "tg": [17, 62, 0]}] },
          { t: "פשפשי בית החליפות", feature: (ctx.shared.features || {})["shellSouth"] || null, tg: [1.5, 26.5, 50], cam: [-12, 36, 63], info: "לשון המשנה (מידות ד, ז): ״האולם עודף עליו חמש עשרה אמה מן הצפון, וחמש עשרה אמה מן הדרום, והוא היה נקרא בית החליפות, ששם גונזים את הסכינים״.\nבקצרה — המחלוקות בכרטיס זה (הפירוט — במתגים שבתפריט, תחת ״שיטות ומחלוקות״):\n• **רוחב האולם ובית החליפות:** לתוספות יום טוב — חלל האולם שבעים (ברירת המחדל); לתפארת ישראל — וחדרי החליפות בצדדים; לרמב״ם — תשעים.\n• **צורת הבניין:** כפשט המשנה — הבית שבעים, והאולם מאה (ברירת המחדל); לרמב״ם — מאה על מאה, ומעט צר במערב, כציורו.\n״רבי יוסי ברבי יהודה אומר: שני פשפשין היו בבית החליפות, וגובהן שמנה; כדי להכשיר את העזרה כולה לאכילת קדשי קדשים, ולשחיטת קדשים קלים״ (זבחים נה:). רש״י: ״ובאותן שני כתלים היו שני פתחים קטנים״, ״ופתוחין למערב״; ועל הצדדים: ״דפתח להו בקרן זוית — של אולם, מקצת הפתח פונה לצפון ומקצתו למערב, וכן בדרום״; ״שהן פתחים קטנים, ואין משמשין כניסה ויציאה״.\nבמודל: פשפש גבוה שמונה אמות בקרן הזווית המערבית של כל אחד משני העודפים של האולם — מקצתו בכותל המערבי ומקצתו בכותל הצד — בגובה רצפת האולם; רוחבו — בחירת מודל.\nהמבט: אל הפשפש הדרומי, מדרום־מערב. בצורת הבניין של הרמב״ם (מאה על מאה) כותל האולם הדרומי, הנמשך לאורך הבית, מסתיר אותו — ובלחיצה כאן הכותל מוסר ל־15 שניות.", refs: [["זבחים נה:", "Zevachim.55b"], ["רש״י זבחים נה:", "Rashi_on_Zevachim.55.2"], ["מידות ד, ז", "Mishnah_Middot.4.7"]] },
          { t: "כלונסות הארז שבאולם", action: () => { if (ctx.shared.openFor) ctx.shared.openFor("hei-ulam", 15000); }, tg: [7, 60.5, 0], cam: [9, 96, 26], info: "לשון המשנה (מידות ג, ח): ״וכלונסות של ארז היו קבועין מכתלו של היכל לכתלו של אולם, כדי שלא יבעט. ושרשרות של זהב היו קבועות בתקרת האולם, שבהן פרחי כהנה עולין ורואין את העטרת״.\n**ברטנורא:** ״שלא יבעטו״ — שלא יטו הכתלים ליפול מחמת גובהם, והכלונסות הנמשכים מכותל זה לכותל זה סומכים את שני הכתלים; ״ורואין את העטרת״ — שבחלונות של היכל (ברטנורא מידות ג, ח).\n**תוספות יום טוב:** ״קבועים״ — לא קבועים ממש בבניין, אלא בלא בניין, שאם לא כן עובר על ״לא תטע לך כל עץ״ (הכסף משנה); הראבי״ה — כעין תומכות; השרשרות תלויות למטה באולם ואוחזים בהן פרחי כהונה ומפסגים ועולים (ר׳ שמעיה) (תוספות יום טוב מידות ג, ח).\n**תפארת ישראל:** ״כלונסות״ — קורות עגולות ועבות, לתמוך את הכתלים; חלל האולם גבוה הרבה יותר מחלל ההיכל, עד כנגד העלייה, בלא מעזיבה מפסקת, ולכן הוצרכו כלונסאות לתמוך גובה של מאה אמה; מן השרשרות מוכח שהאולם מקורה; פרחי כהונה — ילדים קלים ברגליהם, מפסגים עד כנגד העטרות שמעל חלונות ההיכל, שתחת תקרת האולם; העטרות — לתוספות (גיטין ז.) בשם הגאונים: כיפות מוזהבות מעל חלונות ההיכל מבחוץ, עשויות כעטרות — נדבת חלם וטוביה וידעיה וחן בן צפניה (זכריה ו) (תפארת ישראל מידות ג, ח).\nבמודל: קורות ארז מכותל ההיכל אל כותל האולם סמוך לתקרה (מספרן ועוביין — בחירת מודל); לצדן שרשרות הזהב, וגפן הזהב על פתח ההיכל; העטרות שבחלונות אינן מצוירות.", refs: [["מידות ג, ח", "Mishnah_Middot.3.8"], ["ברטנורא ג, ח", "Bartenura_on_Mishnah_Middot.3.8"], ["תוי״ט ג, ח", "Tosafot_Yom_Tov_on_Mishnah_Middot.3.8"], ["תפא״י ג, ח", "Yachin_on_Mishnah_Middot.3.8"], ["רמב״ם בית הבחירה ד, ח", "Mishneh_Torah,_The_Chosen_Temple.4.8"]], tourThen: [{"cam": [7, 24.5, 29], "tg": [7, 55, 0]}] },
          { t: "הגפן של זהב", action: () => { if (ctx.shared.openFor) ctx.shared.openFor("hei-ulam", 15000); }, tg: [2.4, 42.5, 0], cam: [26, 38, 0], info: "לשון המשנה (מידות ג, ח): ״גפן של זהב היתה עומדת על פתחו של היכל, ומדלה על גבי כלונסות. כל מי שהוא מתנדב עלה, או גרגיר, או אשכול, מביא ותולה בה. אמר רבי אליעזר ברבי צדוק, מעשה היה, ונמנו עליה שלש מאות כהנים״.\n**ברטנורא:** המתנדב זהב להיכל ורוצה שהזהב עצמו יינתן בהיכל — עושה מאותו זהב דמות גרגיר או עלה או אשכול ותולה בה; ״שלש מאות כהנים״ — מכובד הזהב הוצרכו לטלטלה ולפנותה, ולשון הבאי הוא, להודיע שזהב הרבה התנדבו (ברטנורא מידות ג, ח).\n**תוספות יום טוב:** הרמב״ם — צורת גפן של זהב על פתחו של היכל להתברך כגפן, שכנסת ישראל נמשלה לגפן; ״מודלה על גבי כלונסות״ — כדלית של גפן על עמודי ארז, ואין בכך משום ״לא תטע״, שאינו בניין (המפרש לתמיד); כשהיו צריכים לזהב לבדק ההיכל לקחו מכאן והתיכוהו; ושלוש מאות כהנים — לפנותה ולפרק משוי הגרגירים (ר׳ שמעיה), ולאו דווקא, שאם הייתה טעונה כל כך — תישבר (תוספות יום טוב מידות ג, ח).\n**תפארת ישראל:** ממעל לפתח ההיכל מבחוץ, לנוי; בחרו בגפן — רמז לכנסת ישראל שנמשלה לגפן (חולין צב.), ולתורה שצריכה סעד כגפן, והכהנים שומרי כרמה; הגפן מושכבת על גבי גבעולים כגפן ממש; הכהנים תולים את הנדבות, והגזבר לוקח משם לבדק הבית, והעודף — לפרנסת כהנים עניים (יומא לט:); ״שלש מאות״ — גוזמא (תפארת ישראל מידות ג, ח).\nבמודל: גפן זהב על פתח ההיכל, מודלה על כלונסות, ועליה עלים ואשכולות שנדבו; צורתה — בחירת מודל.", refs: [["מידות ג, ח", "Mishnah_Middot.3.8"], ["ברטנורא ג, ח", "Bartenura_on_Mishnah_Middot.3.8"], ["תוי״ט ג, ח", "Tosafot_Yom_Tov_on_Mishnah_Middot.3.8"], ["תפא״י ג, ח", "Yachin_on_Mishnah_Middot.3.8"]] },
          { t: "שולחנות האולם — שיש וזהב", action: () => { if (ctx.shared.openFor) ctx.shared.openFor("hei-ulam", 15000); }, tg: [4, 23.5, 0], cam: [24, 28, 0], info: "לשון המשנה (שקלים ו, ד): ״שלשה עשר שלחנות היו במקדש... ושנים באולם מבפנים על פתח הבית, אחד של שיש ואחד של זהב, על של שיש נותנין לחם הפנים בכניסתו, ועל של זהב ביציאתו, שמעלין בקדש ולא מורידין. ואחד של זהב מבפנים, שעליו לחם הפנים תמיד״; (מנחות יא, ז): ״יצאו ונתנו על השלחן של זהב שהיה באולם. הקטירו הבזיכין, והחלות מתחלקות לכהנים״.\n**ברטנורא:** בכניסתו — אחר שנאפה, עד שיסדרוהו על השולחן; ביציאתו — מונח שם עד זמן חלוקו; ״שמעלין בקדש ולא מורידין״ — כיוון שסילקוהו מעל שולחן הזהב אין מורידים אותו לשל כסף; ובמנחות: ״ולא היו מניחים שם אלא להראות שמעלין בקדש״ — מניחים על של שיש ומיד נושאים להיכל ומסדרים על של זהב של משה (ברטנורא שקלים ו, ד; ברטנורא מנחות יא, ז).\n**תוספות יום טוב:** הלחם שוהה על שולחן השיש זמן רב, שאין אפייתו דוחה שבת (מנחות יא), ולכן לא עשאוהו כסף אף שאין עניות במקום עשירות — ״היינו נמי טעמא כדי שלא יתעפש״, ומקשה על פירוש הר״ב במנחות שמיד הסירוהו משל שיש; ״מעלין בקדש״ — ״ויקם משה את המשכן״, בצלאל עשה ומשה שגדול הימנו הקימו; ״ולא מורידין״ — ממחתות קורח; ולכך לא עשו את השולחן השני שבאולם של כסף כאותם שבכבש (תוספות יום טוב שקלים ו, ד; תוספות יום טוב מנחות יא, ז).\n**תפארת ישראל:** אחר שנאפו בערב שבת, פעמים שוהים ימים קודם שיסדרום על השולחן שבהיכל, לכן שיש — שיתקרר מיד ולא יתעפש; ביציאתו — עד שעה שיחלקום לכהנים; ומשלקחוהו משולחן הזהב שבהיכל — גם זה של זהב (תפארת ישראל שקלים ו, ד).\nבמודל: שני שולחנות באולם לפני פתח ההיכל — שיש בצפון וזהב בדרום; מידותיהם וצדיהם — בחירת מודל. שולחן הזהב שבפנים — כרטיס ״שולחן לחם הפנים״.\nבמודל: השולחנות שתי אמות וחומש על אמה וחומש, וגבהם אמה ושלושה חומשים — בחירת מודל.\nבמודל: על שלחן השיש — שתים עשרה החלות בצורתן שעל השולחן שבפנים (כרטיס ״שולחן לחם הפנים״), שש על שש, בלי הסניפים והקנים. אופן הנחתן על שלחן השיש לא נתפרש במקורות שבכרטיס — בחירת מודל.", refs: [["שקלים ו, ד", "Mishnah_Shekalim.6.4"], ["ברטנורא ו, ד", "Bartenura_on_Mishnah_Shekalim.6.4"], ["תוי״ט ו, ד", "Tosafot_Yom_Tov_on_Mishnah_Shekalim.6.4"], ["תפא״י ו, ד", "Yachin_on_Mishnah_Shekalim.6.4"], ["מנחות יא, ז", "Mishnah_Menachot.11.7"], ["ברטנורא יא, ז", "Bartenura_on_Mishnah_Menachot.11.7"], ["תוי״ט יא, ז", "Tosafot_Yom_Tov_on_Mishnah_Menachot.11.7"], ["רמב״ם בית הבחירה ג, טז", "Mishneh_Torah,_The_Chosen_Temple.3.16"], ["תפא״י ג, ה", "Yachin_on_Mishnah_Middot.3.5"], ["מנחות צט:", "Menachot.99b"]] },
          { t: "פשפשי ההיכל", action: () => { const P = ctx.shared.pishpeshDemo; if (typeof P === 'function') P(); }, info: "לשון המשנה (מידות ד, ב): ״ושני פשפשין היו לו לשער הגדול, אחד בצפון, ואחד בדרום. שבדרום, לא נכנס בו אדם מעולם, ועליו הוא מפרש על ידי יחזקאל, שנאמר... ויאמר אלי ה׳ השער הזה סגור יהיה לא יפתח ואיש לא יבא בו כי ה׳ אלהי ישראל בא בו והיה סגור. נטל את המפתח ופתח את הפשפש, ונכנס להתא, ומהתא להיכל. רבי יהודה אומר, בתוך עביו של כתל היה מהלך, עד שנמצא עומד בין שני השערים, ופתח את החיצונות מבפנים ואת הפנימיות מבחוץ״.\nבקצרה — המחלוקות בכרטיס זה (הפירוט — בשני מתגים שבתפריט, תחת ״שיטות ומחלוקות״):\n• הדרך מן הפשפש לשער הגדול — לחכמים דרך התא וההיכל; לרבי יהודה בתוך עובי הכותל.\n• ״ושני מפתחות, אחד יורד לאמת השחי ואחד פותח כיון״ (תמיד ג, ו) — לרמב״ם (ברירת המחדל) שני מנעולים על הפתח מבחוץ, אחד בתחתיתו; למלאכת שלמה ולרבינו גרשום המנעול מבפנים, והיד נכנסת עד בית השחי (במלאכת שלמה — בחור עקום בעובי הכותל); ולראב״ד הפשפש עצמו ״פתח קטן כעין חלון״, ובו מכניס את זרועו.\n**ברטנורא:** שני פתחים קטנים, אחד מימין שער ההיכל הגדול ואחד משמאלו, רחוקים קצת מן השער; הדרומי — ״סגור יהיה לא יפתח״ נאמר בשל עתיד, ומסתמא כך היה בבית עולמים; מן הפשפש לתא — לשכה אחת הפתוחה להיכל — ומן התא להיכל, והולך בחלל ההיכל עד השער הגדול שבסוף עובי הכותל מבפנים ופותחו, ובא אל השער השני שבסוף עובי הכותל מבחוץ ועומד בפנים ופותחו; ולרבי יהודה — מן התא מהלך בתוך עובי הכותל עד שעומד בין שני השערים (ברטנורא מידות ד, ב).\n**תוספות יום טוב:** לרמב״ם ולר״ב התא שבו הפשפש הוא התא שבדיוטא האמצעית, והדיוטא התחתונה כנגד האוטם — ומונה את הדוחקים שבפירושם; ולדעתו (צורת הבית סימן סה) הפשפש באותו התא שבחלל כותל ההיכל, ובדיוטא התחתונה (תוספות יום טוב מידות ד, ג).\n**תפארת ישראל:** התא שבקרן מזרחית־צפונית, שלו חמישה פתחים — אחד לצד חוץ למזרח, והוא הפשפש הצפוני; לדעתו הוא התא שבדיוטא האמצעית, שהתחתונה כנגד האוטם, ויורדים ממנו למסיבה בסולם של שש אמות; והתא שבדרומית־מזרחית, ששערו סגור, היה לו על כורחך פתח להיכל — ״כי ה׳ אלהי ישראל בא בו״ (תפארת ישראל מידות ד, ג).\nבמודל: שני פתחים קטנים בחזית ההיכל, מימין ומשמאל לשער הגדול, בתוך תחום התאים; גודלם ומרחקם מן השער — בחירת מודל; הצפוני — שדרכו נכנסים בבוקר לפתוח את שער ההיכל מבפנים. שתי הדרכים מן הפשפש אל השער הגדול — של חכמים ושל רבי יהודה — מצוירות כקווים הנראים דרך הכתלים, בתפריט, תחת ״שיטות ומחלוקות״ (הדרך מן הפשפש לשער הגדול).\nבמודל: שני הפשפשים פתחים של ממש בכותל ההיכל שעובייו שש — שלוש על שש אמות (בחירת מודל); הצפוני פתוח, והדרומי סגור. הפתחים קבועים — לחכמים פתח מן התא שבקרן מזרחית צפונית להיכל (״ואחד להיכל״, מידות ד, ג), ולרבי יהודה המעבר בתוך עובי הכותל. בלחיצה על המקום, או על הכפתור שעל המודל, נכנסים בפשפש בהליכה, בגובה העיניים, בדרך שנבחרה בתפריט, תחת ״שיטות ומחלוקות״ — ובסוף נפתחות ארבע הדלתות של השער הגדול. כשבוחרים במתג את הדרך האחרת, ההליכה נעשית בה. מקום הפתח שבין התא להיכל וגודלו — בחירת מודל. בתחילת ההליכה — המפתחות: כהן פותח את המנעולים, לפי השיטה שנבחרה במתג ״המפתח שיורד לאמת השחי״, ובתוך הכותל החור והיד מצוירים כאילו הכותל שקוף; ומשם הוא הולך לפני העין עד השער הגדול. מקום המנעולים, החור והחלון וצורתם — בחירת מודל.", refs: [["מידות ד, ב", "Mishnah_Middot.4.2"], ["ברטנורא ד, ב", "Bartenura_on_Mishnah_Middot.4.2"], ["תוי״ט ד, ב", "Tosafot_Yom_Tov_on_Mishnah_Middot.4.2"], ["תפא״י ד, ב", "Yachin_on_Mishnah_Middot.4.2"], ["מידות ד, ג", "Mishnah_Middot.4.3"], ["תוי״ט ד, ג", "Tosafot_Yom_Tov_on_Mishnah_Middot.4.3"], ["תפא״י ד, ג", "Yachin_on_Mishnah_Middot.4.3"], ["רמב״ם בית הבחירה ד, ו", "Mishneh_Torah,_The_Chosen_Temple.4.6"], ["תמיד ג, ז", "Mishnah_Tamid.3.7"], ["תמיד ג, ו", "Mishnah_Tamid.3.6"], ["פירוש המשניות לרמב״ם תמיד ג, ו", "Rambam_Commentary_on_Tamid.3.6"], ["מלאכת שלמה תמיד ג, ו", "Melekhet_Shelomoh_on_Mishnah_Tamid.3.6"], ["רבינו גרשום תמיד ל:", "Rabbeinu_Gershom_on_Tamid.30b"], ["השגות הראב״ד בית הבחירה ד, יא", "Raavad_on_Beit_HaBechira.4.11"]] },
          { t: "השער הגדול — ארבע הדלתות", tg: [-2, 31, 0], cam: [-21, 33, 6], info: "לשון המשנה (מידות ד, א): ״פתחו של היכל, גבהו עשרים אמה ורחבו עשר אמות. וארבע דלתות היו לו, שתים בפנים ושתים בחוץ״.\nבקצרה — המחלוקת בכרטיס זה (הפירוט — במתג ״דלתות ההיכל״ שבתפריט, תחת ״שיטות ומחלוקות״):\n• תנא קמא, וכן פסק הרמב״ם (בית הבחירה ד, ז): ״החיצונות נפתחות לתוך הפתח לכסות עביו של כתל, והפנימיות נפתחות לתוך הבית לכסות אחר הדלתות״.\n• רבי יהודה: ״בתוך הפתח היו עומדות, וכמין אצטרמיטה היו, ונקפלות לאחוריהן״ — כל דלת שני לוחות על חוליות (ברטנורא).\nפתיחתן בבוקר (תמיד ג, ז): ״הגיע לשער הגדול, העביר את הנגר ואת הפותחות ופתחו. לא היה שוחט השוחט, עד ששומע קול שער הגדול שנפתח״; ברטנורא: ״ואת הפותחות. המנעולים והמסגרות״; ובמשנה שאחריה (ג, ח): ״מיריחו היו שומעין קול שער הגדול שנפתח״.\nבמודל: ארבע הדלתות מצופות זהב ועומדות פתוחות, לפי השיטה שנבחרה במתג ״דלתות ההיכל״. המפתח בהדגמה — של זהב, כדברי רש״י (מלכים א ז, נ): ״והפתות. מפתחות, שמעתי. שמפתחין בהם את המנעול״ (בבית ראשון). עובי הדלתות, מקום המנעול והנגר וצורתם — בחירת מודל.", refs: [["מידות ד, א", "Mishnah_Middot.4.1"], ["רמב״ם בית הבחירה ד, ז", "Mishneh_Torah,_The_Chosen_Temple.4.7"], ["ברטנורא ד, א", "Bartenura_on_Mishnah_Middot.4.1"], ["פירוש המשניות לרמב״ם מדות ד, א", "Rambam_Commentary_on_Middot.4.1"], ["תמיד ג, ז", "Mishnah_Tamid.3.7"], ["ברטנורא תמיד ג, ז", "Bartenura_on_Mishnah_Tamid.3.7"], ["תמיד ג, ח", "Mishnah_Tamid.3.8"], ["רש״י מלכים א ז, נ", "Rashi_on_I_Kings.7.50"]] },
          { t: "פתיחת השער הגדול — הדגמה", action: () => { const G = ctx.shared.greatGate; if (G && typeof G.demo === 'function') G.demo(null, true); }, info: "ההדגמה, בהליכה ובגובה העיניים: הדלתות סגורות; כהן מכניס מפתח של זהב למנעול ומסובב אותו, מרים את הנגר ממקומו בשתי ידיו, ומושך את הדלתות; והן נפתחות לאט, עם קול של דלת כבדה — ״מיריחו היו שומעין קול שער הגדול שנפתח״ (תמיד ג, ח). בזמן שזוג דלתות נפתח, העין עולה מעל הדלתות ומביטה בהן מלמעלה, כדי שתיראה התנועה כולה; לרבי יהודה — איך שני הלוחות של כל דלת נקפלים זה על זה; ובסוף, בגובה העיניים, שתי הדלתות המקופלות בעובי הכותל, ״אלו שתי אמות ומחצה, ואלו שתי אמות ומחצה״ (מידות ד, א). המפתח של זהב — כבבית ראשון: ״והפתות... זהב״ (מלכים א ז, נ), ורש״י: ״מפתחות... שמפתחין בהם את המנעול״; לבית שני אין לכך מקור — בחירת מודל.\nבקצרה — המחלוקת בכרטיס זה (הפירוט — במתג ״דלתות ההיכל — ארבע הדלתות״ שבתפריט, תחת ״שיטות ומחלוקות״):\n• לתנא קמא, וכן פסק הרמב״ם — החיצונות לתוך הפתח והפנימיות לתוך הבית (ברירת המחדל).\n• לרבי יהודה — ״בתוך הפתח היו עומדות... ונקפלות לאחוריהן״.\nלתנא קמא — הכהן בא מן ההיכל (מידות ד, ב; תמיד ג, ז), ולכן נפתחות קודם הפנימיות, לתוך הבית, ואחר כך החיצונות, לתוך הפתח. לרבי יהודה — הכהן עומד בין שני השערים: ״ופתח את החיצונות מבפנים ואת הפנימיות מבחוץ״ (מידות ד, ב), וכל דלת נקפלת לשניים.\nההדגמה מראה את השיטה שנבחרה במתג ״דלתות ההיכל״; כשבוחרים במתג את השיטה האחרת, ההדגמה מראה אותה. כפתור ההדגמה נמצא גם על המודל, מעל השער. הקול נוצר בתוסף עצמו, בלי קובץ; מקום המנעול והנגר, צורת המפתח, הזמנים והמסלול — בחירת מודל.", refs: [["תמיד ג, ז", "Mishnah_Tamid.3.7"], ["תמיד ג, ח", "Mishnah_Tamid.3.8"], ["מידות ד, ב", "Mishnah_Middot.4.2"], ["מידות ד, א", "Mishnah_Middot.4.1"], ["רש״י מלכים א ז, נ", "Rashi_on_I_Kings.7.50"]], tourThen: [{"cam": [-21, 33, 6], "tg": [-2, 31, 0]}] },
          { t: "הקודש", view: "kodesh", key: "kodesh" },
          { t: "טבלת השיש — עפר הסוטה", tg: [-8.6, 22.2, -7.4], cam: [-5.2, 26.4, -4.4], info: "לשון המשנה (סוטה ב, ב): ״נכנס להיכל ופנה לימינו, ומקום היה שם אמה על אמה, וטבלא של שיש, וטבעת היתה קבועה בה. וכשהוא מגביהה, נוטל עפר מתחתיה ונותן כדי שיראה על המים״.\n**רש״י** (סוטה טו:): ״טבעת קבועה בה — לאחזה בטבעתה ולהגביהה מבין הרצפה, שהיא כולה באבני שיש״.\nבמודל: טבלה של אמה על אמה ובה טבעת, ברצפת ההיכל, לימין הנכנס — בצפון, סמוך לפתח. מקומה המדויק וצורת הטבעת — בחירת מודל.", refs: [["סוטה ב, ב", "Mishnah_Sotah.2.2"], ["רש״י סוטה טו:", "Rashi_on_Sotah.15.2"]] },
          { t: "המנורה", view: "menorah", info: "לשון המשנה (תמיד ג, ט): ״מי שזכה בדשון המנורה, נכנס ומצא שני נרות מזרחיים דולקים, מדשן את השאר ומניח את אלו דולקין במקומן. מצאן שכבו, מדשנן ומדליקן מן הדולקים, ואחר כך מדשן את השאר. ואבן היתה לפני המנורה ובה שלש מעלות, שעליה הכהן עומד ומטיב את הנרות. והניח את הכוז על מעלה שניה ויצא״; (ו, א): ״מדשן את המזרחי, ומניח את המערבי דולק, שממנו היה מדליק את המנורה בין הערבים. מצאו שכבה, מדשנו ומדליקו ממזבח העולה״.\nבקצרה — המחלוקות בכרטיס זה (הפירוט — במתגים שבתפריט, תחת ״שיטות ומחלוקות״):\n• **חומר המנורה והשולחן:** זהב — ״חזרו והעשירו, עשאום של זהב״ (ברירת המחדל); כסף — ״העשירו, עשאום של כסף״; ברזל מחופה — ״שפודים של ברזל היו, וחיפום בבעץ״ (מנחות כח:).\n• **כיוון המנורה והשולחן:** לרמב״ם — המנורה צפון ודרום והשולחן מזרח ומערב (ברירת המחדל); לרבי — שניהם מזרח ומערב (מנחות צח:), וכמותו משנת תמיד לפי הראב״ד, התוספות והברטנורא; לרבי אלעזר ברבי שמעון — שניהם צפון ודרום.\n• **שולחנות שלמה:** לתוספות רי״ד — שולחן אחד ומנורה אחת (ברירת המחדל); לרש״י ולמפרש לתמיד — גם עשרת השולחנות ועשר המנורות של שלמה, ולא סידרו עליהם ולא הדליקו בהם.\n• **סידור הלחם והדלקת הנרות בכלי שלמה:** לתנא קמא ולרבי יוסי ברבי יהודה — רק בשל משה (ברירת המחדל); לרבי אלעזר בן שמוע — ״על כולם היו מסדרין... ובכולן היו מדליקין״.\n**ברטנורא:** תנא זה סובר שהמנורה מונחת מזרח ומערב; מדשן חמישה נרות שלצד מערב — מסיר שמן ופתילה ודשן ונותן בכוז, ונותן שמן ופתילה חדשים — ואחר שחיטת התמיד וזריקת דמו מדשן את שני המזרחיים, ש״בבקר בבקר בהיטיבו את הנרות״ — חילקה התורה את ההטבה לשני בקרים; נר מערבי — השני שבצד מזרח, שבו פוגע תחילה, ״לפני ה׳״, וממנו מדליקים את שאר הנרות בערב, ובימי שמעון הצדיק היה דולק תמיד בנס; האבן — שהמנורה גבוהה שמונה עשר טפחים, ושלוש מעלותיה כנגד שלוש העלאות שבתורה; ודברי הרמב״ם, שההטבה היא ההדלקה בבוקר — ״פליאה נשגבה בעיני״ (ברטנורא תמיד ג, ט; ו, א).\n**תפארת ישראל:** בהיכל עומדים שולחן בצפון ומנורה בדרום, ומזבח מכוון בין שניהם, משוך קצת כלפי חוץ, וכולם משליש אורך ההיכל ולפנים (יומא לג:) (תפארת ישראל תמיד ג, ט).\nהברייתא (מנחות כח:): גובהה שמונה עשר טפחים — ״הרגלים והפרח שלשה טפחים, וטפחיים חלק, וטפח שבו גביע וכפתור ופרח, וטפחיים חלק, וטפח כפתור... ושני קנים יוצאין ממנו... נשתיירו שם שלשה טפחים שבהן שלשה גביעין וכפתור ופרח״ (רמב״ם בית הבחירה ג, י); עשרים ושניים גביעים, אחד עשר כפתורים ותשעה פרחים, והכול משוקדים. עומדת בדרום, משמאל הנכנס, משוכה מן הכותל שתי אמות ומחצה (יומא לג:; רמב״ם א, ז), ונרותיה כנגד רוחב הבית (רמב״ם ג, יב).\nבמודל: המנורה כבמודל בית ראשון — בנויה בטפחים, כברייתא — ואחת בלבד; לפניה האבן ושלוש מעלותיה; חומרה — בתפריט, תחת ״שיטות ומחלוקות״ (מנחות כח:: של ברזל מחופה בבעץ, של כסף, של זהב).", refs: [["תמיד ג, ט", "Mishnah_Tamid.3.9"], ["ברטנורא ג, ט", "Bartenura_on_Mishnah_Tamid.3.9"], ["תפא״י ג, ט", "Yachin_on_Mishnah_Tamid.3.9"], ["תמיד ו, א", "Mishnah_Tamid.6.1"], ["ברטנורא ו, א", "Bartenura_on_Mishnah_Tamid.6.1"], ["מנחות כח:", "Menachot.28b"], ["רמב״ם בית הבחירה ג, י", "Mishneh_Torah,_The_Chosen_Temple.3.10"], ["רמב״ם בית הבחירה ג, יא", "Mishneh_Torah,_The_Chosen_Temple.3.11"], ["רמב״ם בית הבחירה ג, יב", "Mishneh_Torah,_The_Chosen_Temple.3.12"], ["יומא לג:", "Yoma.33b"], ["רמב״ם בית הבחירה א, ז", "Mishneh_Torah,_The_Chosen_Temple.1.7"]] },
          { t: "מזבח הזהב", view: "goldenAltar", info: "לשון המשנה (תמיד ג, ט): ״מי שזכה בדשון מזבח הפנימי, נכנס ונטל הטני והניחו לפניו, והיה חופן ונותן לתוכו, ובאחרונה כבד את השאר לתוכו והניחו ויצא״; (ו, ב): ״מי שזכה במחתה, צבר את הגחלים על גבי המזבח ורדדן בשולי המחתה, והשתחוה ויצא״; (ו, ג): ״לא היה המקטיר מקטיר עד שהממנה אומר לו, הקטר... פרשו העם, והקטיר והשתחוה ויצא״.\n**ברטנורא:** ״ורדדן בשולי המחתה״ — מרקען ופושטן שלא יהיו משופעים, כדי שלא תיפול הקטורת מעל הגחלים; ועל מזבח הזהב היה מקטיר ולא בתוך המחתה, מה שאין כן ביום הכיפורים; המקטיר שופך את הקטורת על הגחלים לצד מערב, רחוק ממנו, ״כדי שיהא עשנה שוהה לבא״ (יומא מט.), ועושה את הגל לצד מערב שלא ייכווה; ״פרשו העם״ — כל הכהנים פורשים מבין האולם ולמזבח בשעת ההקטרה — ״וכל אדם לא יהיה באהל מועד״ (ברטנורא תמיד ו, ב; ו, ג).\n**תפארת ישראל:** המזבח מכוון בין השולחן והמנורה, משוך קצת כלפי חוץ, משליש אורך ההיכל ולפנים (יומא לג:); וליונתן בן עוזיאל היו גם למזבח הזהב קרנות זקופות, וכן משמע מן הכתוב, ושיעורן לא הוזכר; ומזר הזהב — שהקרנות לפנים מן הזר וגבוהות קצת ממנו (תפארת ישראל תמיד ג, ט).\n**הרמב״ם** (בית הבחירה ג, יז): ״מזבח הקטרת היה מרבע אמה על אמה. והוא נתון בהיכל מכון בין הצפון לדרום משוך בין השלחן והמנורה לחוץ. ושלשתן היו מנחין משליש ההיכל ולפנים כנגד הפרכת״. ארבע קרנותיו ממנו (שמות ל, ב) וזר זהב סביב (ל, ג).\nמקומו במודל: ארבע אמות ושלושה רבעים מזרחה לקו השולחן והמנורה — כדי שכשעשרת שולחנות שלמה מונחים צפון ודרום (במתג), יהיה מעבר בינם ובין המזבח, כתירוץ רש״י (יומא נא:): ״ואם תאמר אף בין המזבח לשולחן אין דרך... שאין המזבח מכוון כנגד השולחן, אלא משוך קימעא כלפי חוץ״. ״קימעא״ — בלי מידה; המידה בחירת מודל.\nבמודל: כבמודל בית ראשון, בלי השכבות של בית ראשון; גובהו שתי אמות כמזבח המשכן — ״ואמתים קומתו״ (שמות ל, ב) — בחירת מודל, שהרמב״ם לא פירש את גובהו בבית (במודל — שתי אמות, כבמודל בית ראשון); עליו גחלים, ועשן הקטורת עולה בעמוד ישר — ״מתמר ועולה כמקל״ (יומא כא:).", refs: [["תמיד ג, ט", "Mishnah_Tamid.3.9"], ["תפא״י ג, ט", "Yachin_on_Mishnah_Tamid.3.9"], ["תמיד ו, ב", "Mishnah_Tamid.6.2"], ["ברטנורא ו, ב", "Bartenura_on_Mishnah_Tamid.6.2"], ["תמיד ו, ג", "Mishnah_Tamid.6.3"], ["ברטנורא ו, ג", "Bartenura_on_Mishnah_Tamid.6.3"], ["רמב״ם בית הבחירה ג, יז", "Mishneh_Torah,_The_Chosen_Temple.3.17"], ["יומא לג:", "Yoma.33b"], ["רמב״ם בית הבחירה א, ז", "Mishneh_Torah,_The_Chosen_Temple.1.7"]] },
          { t: "שולחן לחם הפנים", view: "shulchan", info: "לשון המשנה (מנחות יא, ה): ״השלחן, ארכו עשרה, ורחבו חמשה. לחם הפנים, ארכן עשרה ורחבן חמשה. נותן ארכו כנגד רחבו של שלחן, וכופל טפחים ומחצה מכאן וטפחים ומחצה מכאן, נמצא ארכו ממלא כל רחבו של שלחן, דברי רבי יהודה. רבי מאיר אומר, השלחן ארכו שנים עשר ורחבו ששה. לחם הפנים ארכו עשרה ורחבו חמשה. נותן ארכו כנגד רחבו של שלחן, וכופל טפחים מכאן וטפחים מכאן וטפחים רוח באמצע, כדי שתהא הרוח מנשבת ביניהן. אבא שאול אומר, שם היו נותנין שני בזיכי לבונה של לחם הפנים״; (יא, ז): ״המכניסים עומדים בצפון, ופניהם לדרום. המוציאין עומדים בדרום, ופניהם לצפון. אלו מושכין ואלו מניחין, וטפחו של זה כנגד טפחו של זה״.\nבקצרה — המחלוקות בכרטיס זה (הפירוט — במתגים שבתפריט, תחת ״שיטות ומחלוקות״):\n• **חומר המנורה והשולחן:** זהב — ״חזרו והעשירו, עשאום של זהב״ (ברירת המחדל); כסף — ״העשירו, עשאום של כסף״; ברזל מחופה — ״שפודים של ברזל היו, וחיפום בבעץ״ (מנחות כח:).\n• **כיוון המנורה והשולחן:** לרמב״ם — המנורה צפון ודרום והשולחן מזרח ומערב (ברירת המחדל); לרבי — שניהם מזרח ומערב (מנחות צח:), וכמותו משנת תמיד לפי הראב״ד, התוספות והברטנורא; לרבי אלעזר ברבי שמעון — שניהם צפון ודרום.\n• **שולחנות שלמה:** לתוספות רי״ד — שולחן אחד ומנורה אחת (ברירת המחדל); לרש״י ולמפרש לתמיד — גם עשרת השולחנות ועשר המנורות של שלמה, ולא סידרו עליהם ולא הדליקו בהם.\n• **סידור הלחם והדלקת הנרות בכלי שלמה:** לתנא קמא ולרבי יוסי ברבי יהודה — רק בשל משה (ברירת המחדל); לרבי אלעזר בן שמוע — ״על כולם היו מסדרין... ובכולן היו מדליקין״.\n• **צורת לחם הפנים:** לרבי יוחנן — כמין ספינה רוקדת, והסניפין על גבי השולחן (ברירת המחדל); לרבי חנינא — כמין תיבה פרוצה, והסניפין על גבי קרקע, וכמותו פסק הרמב״ם לכסף משנה.\n**ברטנורא:** ״אמתים ארכו ואמה רחבו״ — לרבי יהודה אמת כלים בת חמישה טפחים, ולרבי מאיר כל אמה בת שישה — ״והלכה כרבי מאיר״; כופל את הלחם למעלה מכאן ומכאן, ״והן הן הקרנות״; שני הסדרים תופסים עשרה טפחים באורך השולחן, ונותרו טפחיים רווח בין סדר לסדר ״שתהא רוח מנשבת בהם שלא יתעפשו״; אבא שאול — הבזיכים באותו רווח, ״ועליו מטה מנשה״ — סמוך, והלכה כמותו; המכניסים בצפון — ״דאותן שמסדרים העבודה יהיו בצפון״ (ברטנורא מנחות יא, ה; יא, ז).\n**תוספות יום טוב:** מגיה בדברי הר״ב ״ובהן הן הקרנות״ — שהקרנות בולטות בראש הדופן, כקרנות המזבח, ודוחה את פירוש הרמב״ם שהקרנות הן עובי הלחם ואת הרלב״ג שהלחם בעל שמונה צלעות; ורבי יוחנן: למאן דאמר טפחיים ומחצה קופל — השולחן מקדש חמישה עשר טפחים למעלה (תוספות יום טוב מנחות יא, ה).\n**תפארת ישראל:** ״לחם הפנים״ — פנים רבים: שנים עשר פנים לכל לחם, כמניין הלחם, על ידי הכפילה מכאן ומכאן; ״וקיי״ל בלחה״פ כר״מ, משום דאבא שאול מודה לו״; הרווח — שלא יתעפש, שאין סומכים על הנס שנשאר חם (יומא כא:); הבזיכים בצד הסדרים, כרמב״ם (תפארת ישראל מנחות יא, ה).\n**הרמב״ם** (בית הבחירה ג, יב–יד): ״השלחן היה ארכו שנים עשר טפח ורחבו ששה טפחים. והיה מנח ארכו לארך הבית ורחבו לרחב הבית״ (כרבי מאיר); ארבעה סניפים של זהב סומכים את שתי המערכות — ״קשותיו״; עשרים ושמונה קנים כחצי קנה חלול — ״מנקיותיו״; ושני הבזיכים — ״כפותיו״. עומד בצפון, מימין הנכנס, משוך מן הכותל שתי אמות ומחצה (יומא לג:; רמב״ם א, ז).\nבמודל: השולחן כבמודל בית ראשון, עם שתים עשרה החלות, הסניפים, הקנים והבזיכים — כרבי מאיר והרמב״ם; חומרו — בתפריט, תחת ״שיטות ומחלוקות״ (רמב״ם א, יט).\nבמודל: צורת החלות — לפי המתג ״צורת לחם הפנים״: לרבי יוחנן (ברירת המחדל) ״כמין ספינה רוקדת״, והסניפין על השולחן; לרבי חנינא ״כמין תיבה פרוצה״, והסניפין על הרצפה.", refs: [["מנחות יא, ה", "Mishnah_Menachot.11.5"], ["ברטנורא יא, ה", "Bartenura_on_Mishnah_Menachot.11.5"], ["תוי״ט יא, ה", "Tosafot_Yom_Tov_on_Mishnah_Menachot.11.5"], ["תפא״י יא, ה", "Yachin_on_Mishnah_Menachot.11.5"], ["מנחות יא, ז", "Mishnah_Menachot.11.7"], ["ברטנורא יא, ז", "Bartenura_on_Mishnah_Menachot.11.7"], ["רמב״ם בית הבחירה ג, יב", "Mishneh_Torah,_The_Chosen_Temple.3.12"], ["רמב״ם בית הבחירה ג, יג", "Mishneh_Torah,_The_Chosen_Temple.3.13"], ["רמב״ם בית הבחירה ג, יד", "Mishneh_Torah,_The_Chosen_Temple.3.14"], ["יומא לג:", "Yoma.33b"], ["רמב״ם בית הבחירה א, ז", "Mishneh_Torah,_The_Chosen_Temple.1.7"], ["תפא״י ג, ט", "Yachin_on_Mishnah_Tamid.3.9"], ["מנחות צד:", {"book": 131, "index": 3364}], ["מנחות צד: (הסניפין)", {"book": 131, "index": 3369}], ["מנחות צה.", {"book": 131, "index": 3372}], ["רמב״ם תמידין ומוספין ה, ט", {"book": 344, "index": 78}], ["כסף משנה תמידין ה, ט", {"book": 4261, "index": 187}]] },
          { t: "פיתוחי הקירות — כרובים דצורתא", tg: [-35, 42, -9.5], cam: [-14, 30, 2], info: "לשון המשנה (מידות ד, א): ״והפנימיות נפתחות לתוך הבית לכסות אחר הדלתות, שכל הבית טוח בזהב, חוץ מאחר הדלתות״.\n**ברטנורא:** הדלתות הפנימיות, כשנפתחות, מכסות חמש אמות מפה וחמש אמות מפה מרוחב כותל ההיכל בפנים, ״ושם לא היה הכתל טוח בזהב כמו שאר הבית, לפי שלא היה נראה״ (ברטנורא מידות ד, א).\n**תפארת ישראל:** ״אמה כיור״ — פטורי ציצים של גבס מוזהבים כשפה סביב ראש הכתלים, מבפנים ומבחוץ (תפארת ישראל מידות ד, ו).\nהגמרא (יומא נד.): ״רב אחא בר יעקב אמר: לעולם במקדש שני, וכרובים דצורתא הוו קיימי, דכתיב: ואת כל קירות הבית מסב קלע כרובים ותמרות ופטורי ציצים וצפה זהב מישר על המחוקה״ — בבית שני לא היו כרובי הכפורת, שהארון נגנז, אבל כרובים ציוריים — חקוקים או מצוירים — היו על הקירות.\nבמודל: פיתוחי הזהב כבמודל בית ראשון — כרובים, תמורות, פטורי ציצים וחבלים — על קירות הקודש וקודש הקדשים.\n**מאחר הדלתות:** תפארת ישראל (מידות ד, א): ״וההיכל כולו מצופה זהב, חוץ מאותן ה׳ אמות מזה ומזה לדלתות כגובה הדלתות, דמדאין הזהב נראה כשנפתחות״. במודל: בכותל המזרחי של ההיכל מבפנים, משני צדי הפתח ועד הכתלים, בגובה הדלתות — אבן בלא זהב, ועליה נשענות הדלתות הפנימיות כשהן פתוחות. מה היה שם במקום הזהב — לא נאמר; האבן — בחירת מודל. בשיטת רבי יהודה הדלתות עומדות בתוך הפתח, ואינן מכסות שם דבר — במודל הכותל כולו זהב.", refs: [["מידות ד, א", "Mishnah_Middot.4.1"], ["ברטנורא ד, א", "Bartenura_on_Mishnah_Middot.4.1"], ["תפא״י ד, ו", "Yachin_on_Mishnah_Middot.4.6"], ["תפא״י ד, א", "Yachin_on_Mishnah_Middot.4.1"], ["יומא נד.", "Yoma.54a"]] },
          { t: "שלוש עשרה הפרוכות", tg: [18.6, 38, 0], cam: [64, 44, 52], info: "רב (כתובות קו.; יומא נד.): ״שלש עשרה פרכות היו במקדש שני: שבע כנגד שבעה שערים, אחת לפתחו של היכל, ואחת לפתחו של אולם, שתים בדביר, שתים כנגדן בעליה״. וכן פסק הרמב״ם (כלי המקדש ז, יז).\n**רש״י** (כתובות קו.): ״בדבבי — בפרכות שכנגד הפתחים, דלצניעותא עבידי״; ״ז׳ שערים — לעזרה״; ״ושתים כנגדן בעליה — להבדיל בין עליית היכל לעליית קדשי הקדשים״.\n**פרוכת ההיכל** (תוספתא שקלים ג, יא): ״ארכה עשרים אמה ורחבה עשר... והיתה פרוסה על פתחו של היכל מבחוץ״. **האולם** — ״כל הפתחים שהיו שם היו להן דלתות, חוץ משל אולם״ (מידות ב, ג), ולכן לפתחו פרוכת בלבד (ברטנורא תמיד ז, א).\nבמודל: שבע הפרוכות של שערי העזרה, פרוכת ההיכל ופרוכת האולם — תלויות מבחוץ, לפני הפתחים, פרוסות או מוגבהות לפי המתג ״פרוכות הפתחים״. בזמן הדגמה, וכשהמבט עובר דרך פתח, הפרוכת שלו מוגבהת מעצמה. שתיים בדביר — ״שתי הפרוכות — בין הקודש לקודש הקדשים״; ושתיים בעלייה — לפי המתג ״הפרוכות שבעלייה״.", refs: [["כתובות קו.", {"book": 116, "index": 3032}], ["יומא נד.", {"book": 107, "index": 1412}], ["רש״י כתובות קו.", {"book": 2168, "index": 4902}], ["רמב״ם כלי המקדש ז, יז", {"book": 338, "index": 118}], ["תוספתא שקלים ג, יא", {"book": 193, "index": 40}], ["מידות ב, ג", {"book": 89, "index": 14}], ["ברטנורא תמיד ז, א", {"book": 634, "index": 222}]] },
          { t: "שתי הפרוכות — בין הקודש לקודש הקדשים", tg: [-45.1, 25.3, -9.3], cam: [-45.0, 29.5, 9.0], info: "לשון המשנה (מידות ד, ז): ״כתל ההיכל שש, ותוכו ארבעים אמה, אמה טרקסין, ועשרים אמה בית קדש הקדשים״; (יומא ה, א): ״היה מהלך בהיכל, עד שמגיע לבין שתי הפרכות המבדילות בין הקדש ובין קדש הקדשים, וביניהן אמה. רבי יוסי אומר, לא היתה שם אלא פרכת אחת בלבד... החיצונה היתה פרופה מן הדרום, והפנימית מן הצפון. מהלך ביניהן, עד שמגיע לצפון״; (שקלים ח, ה): ״פרכת עביה טפח, ועל שבעים ושתים נימין נארגת, ועל כל נימא ונימא עשרים וארבעה חוטין. ארכה ארבעים אמה ורחבה עשרים אמה... ושתים עושין בכל שנה, ושלש מאות כהנים מטבילין אותה״.\nבקצרה — המחלוקות בכרטיס זה (הפירוט — במתגים שבתפריט, תחת ״שיטות ומחלוקות״):\n• **הפרוכות ודרך הכהן הגדול:** לתנא קמא — שתי פרוכות ואמה ביניהן, וכן כתב הרמב״ם (ברירת המחדל), והכהן הגדול מהלך בין המזבח למנורה, כרבי יהודה; לרבי יוסי — פרוכת אחת בלבד, ודרכו בין השולחן לכותל; לרבי מאיר — פרוכת אחת, ודרכו בין השולחן למזבח.\n• **פריפת הפרוכות:** לרש״י — ראש הפרוכת כפול ונאחז בקרס של זהב, והפתח פתוח (ברירת המחדל); לתוספות רי״ד — הפרוכת מחוברת לכתלים בקרסים ובלולאות, ונפתחת בשעת הכניסה; לתוספות יום טוב — הפרוכת ארוכה, ופינתה נמשכת אל הכותל ונאחזת בו בקרס, והפתח מתחתיה.\n• **הציור על הפרוכות:** לרש״י — ״פעמים שמצד זה ארי ומצד זה נשר״ (ברירת המחדל); לרמב״ם, כהבנת המשנה למלך — אותה צורה משני הצדדים; למעשי למלך — בלי צורות.\n**ברטנורא:** ״אמה טרקסין״ — כותל שסוגר על הארון והלוחות שניתנו בסיני (״טרק״ סגירה, ״סין״ סיני), עוביו אמה, ולא הכריעו בו אם קדושתו כפנים או כחוץ, לפיכך עשו בבית שני שתי פרוכות ואוויר אמה ביניהן; ״פרופה״ — ראשה כפולה לצד החיצון ונאחזת בקרס של זהב, פתוחה מן הדרום; נכנס בפריפת הדרום ומהלך ביניהן עד פריפת הצפון; עשרים וארבעה חוטים — תכלת וארגמן ותולעת שני ושש, כל מין חוטו כפול שש; ״ארכה ארבעים ורחבה עשרים״ — כמידת פתח האולם; ושלוש מאות כהנים — ״לשון גזמא והבאי הוא״ (ברטנורא מידות ד, ז; ברטנורא יומא ה, א; ברטנורא שקלים ח, ה).\n**תוספות יום טוב:** ארבעים על עשרים — גם רוחב קודש הקדשים עשרים וגובהו ארבעים, ״ואם כן יש לפרש מתני׳ דבפרוכת הדביר מיירי״ — כרש״י (חולין צ.): פרוכת הדביר רוחבה כרוחב ההיכל וגובהה מן העלייה עד הרצפה; ״ושתים עושין בכל שנה״ — ״לפי ששתים היו שם בדביר כדתנן ביומא״, וכן הרמב״ם (כלי המקדש ז): ״ושתי פרוכת היו עושין בכל שנה להבדיל בין קדש לקדש הקדשים״; הגרסה ״ריבות״ — נערות שלא באו לכלל נידות (תוספות יום טוב שקלים ח, ה).\n**תפארת ישראל:** ״נימין״ — הנירין שמניחים בהם חוטי השתי; בכל נימא עשרים וארבעה חוטים שזורים לחוט אחד — מכל מין שישה; ״ארכה ארבעים אמה ורחבה עשרים אמה — כאורך ורוחב פתח קדשי קדשים״; ״ושתים עושין בכל שנה — דב׳ פרוכת היו בפתח ק״ק״ (יומא נא:); ובמידות — בבית שני, שחלל ההיכל גבוה ארבעים, לא יכול כותל של אמה לעמוד, לכן פרוכת, ומן הספק שתיים (תפארת ישראל שקלים ח, ה; תפארת ישראל מידות ד, ז).\nבמודל: שתי פרוכות ורווח אמה ביניהן, כל אחת מן הכותל הצפוני עד הכותל הדרומי — ״שהפרוכת על פני כל הדביר מכותל הצפון עד כותל הדרום״ (תוספות יום טוב יומא ה, א); החיצונה פרופה בדרום והפנימית בצפון, כפי שנבחר במתג ״פריפת הפרוכות״ — הלחיצה מביאה את המבט לתוך האמה שבין הפרוכות, מן הדרום לצפון; נארגות תכלת וארגמן ותולעת שני ושש, מעשה חושב (תוספתא שקלים ג, יא); מה שהיה מצויר עליהן — ״שתי צורות על שתי קירותיה, אין דומות זו לזו: פעמים שמצד זה ארי ומצד זה נשר״ (רש״י יומא עב:) — ובמודל שלוש שיטות, במתג ״הציור על הפרוכות״: רש״י — נשרים לצד ההיכל ואריות לצד קודש הקדשים, כציור בית ראשון; הרמב״ם, כהבנת המשנה למלך — אותה צורה משני הצדדים; והמעשי למלך — בלי צורות.\nראש הפרוכת כפוף מעט: ״ורבנן? ההוא דניכוף ביה פורתא, דמחזי כסכך״ (סוכה ז:); רש״י: ״ליכוף בה — למעלה פורתא, כעין גג יעשה ממקצתה״. במודל: ראש הפרוכת הפנימית נוטה מעט אל קודש הקדשים; שיעור הכפיפה, ושהיא בפנימית — בחירת מודל.", refs: [["מידות ד, ז", "Mishnah_Middot.4.7"], ["ברטנורא ד, ז", "Bartenura_on_Mishnah_Middot.4.7"], ["תפא״י ד, ז", "Yachin_on_Mishnah_Middot.4.7"], ["יומא ה, א", "Mishnah_Yoma.5.1"], ["ברטנורא ה, א", "Bartenura_on_Mishnah_Yoma.5.1"], ["שקלים ח, ה", "Mishnah_Shekalim.8.5"], ["ברטנורא ח, ה", "Bartenura_on_Mishnah_Shekalim.8.5"], ["תוי״ט ח, ה", "Tosafot_Yom_Tov_on_Mishnah_Shekalim.8.5"], ["תפא״י ח, ה", "Yachin_on_Mishnah_Shekalim.8.5"], ["יומא נא:", "Yoma.51b"], ["יומא עב:", "Yoma.72b"], ["רמב״ם בית הבחירה ד, ב", "Mishneh_Torah,_The_Chosen_Temple.4.2"], ["תוי״ט ד, ז", "Tosafot_Yom_Tov_on_Mishnah_Middot.4.7"], ["סוכה ז:", "Sukkah.7b"], ["רש״י סוכה ז:", "Rashi_on_Sukkah.7.2"], ["רש״י יומא נב:", {"book": 2157, "index": 1973}], ["תוספות רי״ד יומא נב:", {"book": 2109, "index": 161}], ["תוי״ט יומא ה, א", {"book": 898, "index": 155}]], tourThen: [{"cam": [-38.0, 29.3, 3.0], "tg": [-44.6, 26.6, 7.6]}, {"cam": [-44.95, 26.2, -9.75], "tg": [-45.05, 24.6, 9]}] },
          { t: "הרובד הרביעי — ביום הכיפורים", feature: (ctx.shared.features || {})["rovad4"] || null, tg: [9, 17, 0], cam: [29, 25, 17], info: "לשון המשנה (יומא ד, ג): ״שחטו וקבל במזרק את דמו, ונתנו למי שהוא ממרס בו על הרבד הרביעי שבהיכל, כדי שלא יקרש. נטל מחתה ועלה לראש המזבח... וירד והניחה על הרבד הרביעי שבעזרה״.\nהגמרא (יומא מג:): ״והכתיב: וכל אדם לא יהיה באהל מועד? אמר רב יהודה: תני של היכל״. רש״י: ״כשיוצא מן ההיכל לעזרה מונה את הרובדין והוי האי רביעי להיכל״. ״כל שורה ושורה של אבני הרצפה קרויה רבד״ (ברטנורא). ולרמב״ם בפירוש המשנה (הובא במאירי): ״רובד — אצטבא״.\nבקצרה — מהיכן מונים (במודל — שלושה צבעים):\n• **כחול — מפתח ההיכל ולחוץ, באולם:** ״על השורה הד׳ שבאבני הרצפה מפתח ההיכל ולחוץ״ (יכין); וכן לתוספות רי״ד, ״אי שתי קדושות הן״.\n• **כתום — מפתח האולם ולחוץ:** ״אי קדושת היכל ואולם חדא הוא מונה מפתח האולם ולחוץ״ (תוספות רי״ד); ״דאולם והיכל חדא קדושה ואולם נמי אוהל מועד מיקרי״ (תוספות יום טוב); ״באותו תחום שבין האולם למזבח״ (מאירי).\n• **ירוק — מקום המחתה, מירידתו מן הכבש:** ״לכאורה... והכא מונה מירידתו מן הכבש והוא פונה למול ההיכל״ (תוספות יום טוב); ושם: ״ומיהו בירושלמי נראה דבחדא רובד מיירי״.\n״ושם עומד הממרס בו״ (ברטנורא). ולתפארת ישראל רובד אחד לשניהם — ״הניח המחתה על הרצפה אצל הממרס בדם״: את המחתה ״העמיד לצד חוץ מההיכל, דהיינו לצד העזרה״, ואת הדם ״לצד פנים סמוך להיכל [כך נ״ל]״; וכן נראה לתוספות יום טוב מן הירושלמי.\nבמודל: לכל אחת משלוש הדעות מסומנות ארבע שורות של אבני הרצפה — שלוש הראשונות בצבע חיוור, והרביעית בצבע חזק. על הרביעית שבכחול ועל הרביעית שבכתום עומד כהן, והמזרק בידו; על הרביעית שבירוק מונחת המחתה, ובה גחלים — כ״לכאורה״ של התוספות יום טוב; לתפארת ישראל ולירושלמי מקומה אצל הממרס, ושם לא צוירה. בירוק: רגל הכבש מגיעה במודל עד הבניין שבדרום העזרה, ואין לפניה רצפה פנויה; לכן מצויר שהכהן הגדול יורד מצדו המערבי של הכבש, סמוך לרגלו, ופניו אל ההיכל, והשורות נמנות משפת הכבש. רוחב כל שורה (אמה), אורך השורות ומקום תחילת המניין בירוק — בחירת מודל. כשבוחרים במתג ״מעלות האולם״ את שיטת הרמב״ם, כל שורה שבאולם תופסת שתי מעלות. הכחול והכתום נראים במבט של מקום זה, באולם ולפניו; הירוק — ליד רגל הכבש. במבט של מקום זה: הכחול והכתום — לפניך, באולם ולפניו; הירוק — ליד רגל הכבש, מאחוריך.", refs: [["יומא ד, ג", {"book": 55, "index": 33}], ["יומא מג:", {"book": 107, "index": 1100}], ["רש״י יומא מג:", {"book": 2157, "index": 1683}], ["ברטנורא יומא ד, ג", {"book": 582, "index": 168}], ["יכין יומא ד", {"book": 762, "index": 371}], ["יכין יומא ד (המחתה)", {"book": 762, "index": 383}], ["תוספות רי״ד יומא מג:", {"book": 2109, "index": 135}], ["תוי״ט יומא ד, ג", {"book": 898, "index": 130}], ["תוי״ט יומא ד, ג (המחתה)", {"book": 898, "index": 133}], ["מאירי יומא מג:", {"book": 2199, "index": 386}], ["פירוש המשנה לרמב״ם, במאירי יומא מג.", {"book": 2199, "index": 382}]], tourThen: [{"cam": [37, 27, 43], "tg": [45.5, 16.2, 52]}] },
          { t: "כני הזהב שבהיכל — ביום הכיפורים", feature: (ctx.shared.features || {})["kanim"] || null, tg: [-42.3, 24.8, 3.1], cam: [-35, 27, -1.5], info: "לשון המשנה (יומא ה, ג–ד): ״יצא והניחו על כן הזהב שבהיכל״ — דם הפר; ״יצא והניחו על כן השני שהיה בהיכל. רבי יהודה אומר, לא היה שם אלא כן אחד בלבד״ — דם השעיר.\nבקצרה — המחלוקת בכרטיס זה (הפירוט — במתג ״כני הזהב — שניים או אחד״ שבתפריט, תחת ״שיטות ומחלוקות״):\n• לתנא קמא — שני כנים (ברירת המחדל).\n• לרבי יהודה — כן אחד בלבד; והגמרא (יומא נה:): ״תרי מאי טעמא לא — משום דמחלפי. ונעביד תרי וליכתוב עלייהו הי דפר והי דשעיר״? ומסקנת הגמרא (יומא נו:): ״משום חולשא דכהן גדול לאו אדעתיה״ — מחמת חולשתו לא ייתן דעתו על הכתוב.\nבמודל: הכנים עומדים לפני הפרוכת, מעט מדרום לאמצע, ועל כל אחד מזרק ובו הדם. מקומם בהיכל, צורתם וגובהם אינם כתובים — בחירת מודל.", refs: [["יומא ה, ג", {"book": 55, "index": 40}], ["יומא ה, ד", {"book": 55, "index": 41}], ["יומא נה:", {"book": 107, "index": 1444}], ["יומא נו:", {"book": 107, "index": 1461}]] },
          { t: "הכהן הגדול נכנס בקטורת — הדגמה", action: () => { const Y = ctx.shared.ykEntry; if (Y && typeof Y.start === 'function') Y.start(); }, info: "לשון המשנה (יומא ה, א): ״נטל את המחתה בימינו ואת הכף בשמאלו. היה מהלך בהיכל, עד שמגיע לבין שתי הפרכות המבדילות בין הקדש ובין קדש הקדשים, וביניהן אמה... החיצונה היתה פרופה מן הדרום, והפנימית מן הצפון. מהלך ביניהן, עד שמגיע לצפון... יצא ובא לו בדרך בית כניסתו, ומתפלל תפלה קצרה בבית החיצון, ולא היה מאריך בתפלתו, שלא להבעית את ישראל״.\nהדרך בהיכל (יומא נא:): ״בין המזבח למנורה היה מהלך, דברי רבי יהודה. רבי מאיר אומר: בין שלחן למזבח. ויש אומרים: בין שלחן לכותל. מאן יש אומרים? אמר רב חסדא: רבי יוסי היא, דאמר: פיתחא בצפון קאי״; ״ורבי יהודה אמר לך: פיתחא בדרום קאי״.\n״ובא לו בדרך בית כניסתו״ — ״שהולך אחורנית פניו לקדש הקדשים ואחוריו להיכל דרך יראה״ (מאירי).\nבמודל: הכהן הגדול בבגדי לבן, המחתה בימינו והכף בשמאלו. כשיש שתי פרוכות (ברירת המחדל) הוא מהלך בין המזבח למנורה, כרבי יהודה, אל פתח הפרוכת החיצונה, שבדרום; הולך בין שתי הפרוכות צפונה; ונכנס בפתח הפרוכת הפנימית. לשיטת תוספות רי״ד (המתג ״פריפת הפרוכות״) הפרוכות סגורות, והפינה שליד הפתח נפתחת כשהכהן הגדול מגיע אליה, ונסגרת אחריו. לשיטת תוספות יום טוב הפינה שליד הפתח מורמת ונאחזת בכותל, והכהן הגדול עובר מתחתיה. כשיש פרוכת אחת, כרבי יוסי (המתג ״הפרוכות ודרך הכהן הגדול״), הוא מהלך בין השולחן לכותל, אל הפתח שבצפון. ולרבי מאיר — פרוכת אחת, ופתחה בצפון: ״לעולם כרבי יוסי סבירא ליה״; אבל הוא מהלך בין השולחן למזבח, ואחרי השולחן פונה לצפון: ״שולחנות צפון ודרום מונחין, ומפסקא ליה שלחן ולא מתעייל ליה. ואיבעית אימא: לעולם מזרח ומערב מונחין, ומשום שכינה לאו אורח ארעא למיעל להדיא״ (יומא נא:–נב.). המבט אינו נכנס לקודש הקדשים, והוא נשאר מכוסה בענן, כבכל המודל: הכהן הגדול נכנס ואינו נראה עוד, ואחר כך הוא יוצא אחורנית. בכיתובים — לשון המשנה; ובבית שני, שלא היה בו ארון: ״משנטל הארון, אבן היתה שם מימות נביאים ראשונים, ושתיה היתה נקראת... ועליה היה נותן״ (יומא ה, ב), ובגמרא (יומא נב:) — ״מקום ארון״. מהירות ההליכה, דרך המבט ומקום התפילה — בחירת מודל.", refs: [["יומא ה, א", {"book": 55, "index": 38}], ["יומא נא:", {"book": 107, "index": 1318}], ["יומא נא: (פיתחא בדרום)", {"book": 107, "index": 1319}], ["יומא נא: (רבי מאיר)", {"book": 107, "index": 1320}], ["מאירי יומא מז.", {"book": 2199, "index": 425}], ["יומא נב:", {"book": 107, "index": 1349}]] },
          { t: "קודש הקדשים ואבן השתייה", view: "kodeshHakodashim", key: "kodeshHakodashim" },
          { t: "שיפוע רצפת הבית", action: () => { if (ctx.shared.sectionFor) ctx.shared.sectionFor("z", 0, 15000); }, tg: [-35, 29, 0], cam: [-35, 30, 60], info: "**רש״י** (מנחות צט.): ״כתלמיד היושב לפני רבו — נמוך הימנו, כך אותם של שלמה נמוכין משל משה, דבית המקדש היה משופע, ולצד מערב מגביה יותר״.\nבמודל: רצפת ההיכל וקודש הקדשים עולה מן הפתח אל המערב ארבע אמות, והכלים, הפרוכות ואבן השתייה עומדים עליה. שיעור השיפוע לא נתפרש — בחירת מודל. בלחיצה כאן הבית נחתך לאורכו ל־15 שניות, והמבט מן הדרום.", refs: [["מנחות צט.", "Menachot.99a"], ["רש״י מנחות צט.", "Rashi_on_Menachot.99.1"]] },
          { t: "הלול שאחורי בית הכפורת", tg: [-82.5, 31, 0], cam: [-104, 38, 14], info: "בגמרא (זבחים נה:): ״אחורי בית הכפורת מאי? תא שמע, דאמר רמי בר רב יהודה אמר רב: לול קטן היה אחורי בית הכפורת, גבוה שמונה אמות; כדי להכשיר את העזרה לאכילת קדשי קדשים, ולשחיטת קדשים קלים״.\n**רש״י:** ״לול — כמין חלון פתוח מן התא שאחורי בית הכפרת לאויר העזרה״.\n**הרא״ש** (תמיד כז.): ״לשכה אחת היתה במערב, והיה לול קטן בכותל מערבי פתוח מן קדש הקדשים לאותה לשכה, והלשכה היתה פתוחה לעזרה כנגד הלול, להכשיר אחורי הכפורת לשחיטת קדשים״.\nבמודל: פתח בכותל המערבי של קודש הקדשים אל התא האמצעי שבמערב, וכנגדו פתח בכותל התא אל העזרה — שניהם גבוהים שמונה אמות, ואדנם אמה מעל רצפת קודש הקדשים. רוחבם (שתי אמות) וגובה האדן — בחירת מודל.", refs: [["זבחים נה:", "Zevachim.55b"], ["רש״י זבחים נה:", "Rashi_on_Zevachim.55.2"], ["הרא״ש, תמיד כז.", "Rosh_on_Tamid.27.1"]] },
          { t: "התאים — שלושים ושמונה בשלוש קומות", action: () => { if (ctx.shared.openFor) ctx.shared.openFor("ui-house", 15000); if (ctx.shared.sectionFor) ctx.shared.sectionFor("x", -38, 15000); }, tg: [-38, 43, 0], cam: [32, 46, 0], info: "לשון המשנה (מידות ד, ג): ״ושלשים ושמנה תאים היו שם, חמשה עשר בצפון, חמשה עשר בדרום, ושמנה במערב. שבצפון ושבדרום, חמשה על גבי חמשה, וחמשה על גביהם. ושבמערב, שלשה על גבי שלשה, ושנים על גביהם. ושלשה פתחים היו לכל אחד ואחד, אחד לתא מן הימין, ואחד לתא מן השמאל, ואחד לתא שעל גביו. ובקרן מזרחית צפונית היו חמשה פתחים, אחד לתא מן הימין, ואחד לתא שעל גביו, ואחד למסבה, ואחד לפשפש, ואחד להיכל״; (ד, ד): ״התחתונה, חמש, ורבד שש. והאמצעית, שש, ורבד שבע. והעליונה, שבע״; (ד, ז): ״כתל ההיכל שש, והתא שש, וכתל התא חמש״.\nבקצרה — המחלוקת בכרטיס זה (הפירוט — במתג ״צורת התאים״ שבתפריט, תחת ״שיטות ומחלוקות״):\n• לרמב״ם — הדיוטא התחתונה של התאים כנגד האוטם, מרצפת העזרה (ברירת המחדל).\n• לרש״י, לר״ש, לר״י בתוספות ולשאר הראשונים — שלוש הדיוטות מרצפת ההיכל ולמעלה, ונחלקו בעובי הכתלים.\n**ברטנורא:** ״תאים״ — לשכות; חמישה בצפון — ממניין רוחב הבית מצפון לדרום: כותל המסיבה חמש, המסיבה שלוש, כותל התא חמש, התא שש וכותל ההיכל שש — ולא שעובי הכתלים כך, אלא עובי הכותל עם החלל שבינו ובין הכותל השני, ובכל אחד מהחמישה לשכה אחת — תא; וכן בדרום, ובמערב שלושה; ״התחתונה חמש״ — יציעים, גזוזטראות המקיפות את הבית משלוש רוחות, ו״כתל המסבה היה הולך ומצר כלפי מעלה״, נכנס אמה בכל רובד להניח עליו את קורות היציע — ״כי מגרעות נתן לבית חוצה לבלתי אחז בקירות הבית״ (ברטנורא מידות ד, ג; ד, ד).\n**תוספות יום טוב:** הרמב״ם — ״ואל יטעך שקרא אותם כותל ומסבה וכותל התא והתא וכותל ההיכל. אח״כ חזר וקראם כולם תאים״; ותמה: מאין נפלה האורה אל התאים הפנימיים? — ולרש״י ניחא, שאפשר שהמסיבה לא הייתה מקורה; שלושה פתחים — לא לכולם, שהחיצונים אין להם תא חוצה להם; ולפירוש ר׳ שמעיה — כל כותל עוביו כשנשנה, והתאים חמישה זה לפנים מזה, כל אחד רוחב שש, ועם כותליהם ממלאים את אורך הצפון; ״התחתונה חמש״ — לר״ב ולרמב״ם בכותל המסיבה, ולרש״י בתאים עצמם, שהמגרעות בכותל ההיכל שעוביו שש ממש (תוספות יום טוב מידות ד, ג; ד, ד).\n**תפארת ישראל:** שלוש עשרה לשכות סביב שלושת כותלי ההיכל — חמש בצפון, חמש בדרום ושלוש במערב — ועליהן שלוש עשרה, ועליהן שתים עשרה: חמש, חמש ושתיים; רוחב כל תא מצפון לדרום שש אמות, וגובה שלוש הדיוטות נמוך מארבעים אמות ההיכל, שמעל גגיהן חלונות ההיכל; כותלם החיצון חמש אמות ובו חלונותיהם; דיוטא תחתונה חמש — סביב האוטם — ורובד שש, שכותל ההיכל מתמעט בעוביו אמה כנגד כל תקרה, כמדרגות, להניח עליהן את ראשי הקורות; ובבועז — כותל ההיכל שבע כנגד התחתונה, שש כנגד האמצעית, חמש כנגד העליונה וארבע מעליהן, והתנא מנה שש — מה שתופסים הבית וכותליו על הקרקע (תפארת ישראל מידות ד, ג; ד, ד; בועז ד, א).\nבמודל: התאים חלולים בשלוש קומות (גובה הקומות — בחירת מודל), חמישה בכל קומה בצפון ובדרום, ושלושה, שלושה ושניים במערב, עם הפתחים זה לזה ולזה שמעליו. ברירת המחדל — הרמב״ם, כדברי הראב״ד והתוספות יום טוב (מידות ד, ג): הדיוטא התחתונה של התאים כנגד האוטם, מרצפת העזרה, והשנייה בגובה ההיכל. איך התאים מתרחבים חמש, שש, שבע — עוד שבע שיטות בתפריט, תחת ״שיטות ומחלוקות״ (צורת התאים), כל אחת בחתך לרוחב הבית; ״פתח את ההיכל״ מסיר את הכתלים שבדרום ומראה אותם.", refs: [["מידות ד, ג", "Mishnah_Middot.4.3"], ["ברטנורא ד, ג", "Bartenura_on_Mishnah_Middot.4.3"], ["תוי״ט ד, ג", "Tosafot_Yom_Tov_on_Mishnah_Middot.4.3"], ["תפא״י ד, ג", "Yachin_on_Mishnah_Middot.4.3"], ["מידות ד, ד", "Mishnah_Middot.4.4"], ["ברטנורא ד, ד", "Bartenura_on_Mishnah_Middot.4.4"], ["תוי״ט ד, ד", "Tosafot_Yom_Tov_on_Mishnah_Middot.4.4"], ["תפא״י ד, ד", "Yachin_on_Mishnah_Middot.4.4"], ["מידות ד, ז", "Mishnah_Middot.4.7"], ["בועז ד, א", "Boaz_on_Mishnah_Middot.4.1"], ["רמב״ם בית הבחירה ד, יא", "Mishneh_Torah,_The_Chosen_Temple.4.11"], ["תוספות יומא נב.", "Tosafot_on_Yoma.52a"], ["פירוש המשניות לרמב״ם מדות ד, ג", "Rambam_Commentary_on_Middot.4.3"], ["פירוש המשניות לרמב״ם מדות ד, ד", "Rambam_Commentary_on_Middot.4.4"], ["רמב״ם בית הבחירה ד, י", "Mishneh_Torah,_The_Chosen_Temple.4.10"]] },
          { t: "המסיבה", feature: (ctx.shared.features || {})["mesibahGlow"] || null, tg: [-42, 42, -4], cam: [36, 118, -128], info: "לשון המשנה (מידות ד, ה): ״ומסבה היתה עולה מקרן מזרחית צפונית לקרן צפונית מערבית, שבה היו עולים לגגות התאים. היה עולה במסבה ופניו למערב. הלך על כל פני הצפון, עד שהוא מגיע למערב. הגיע למערב, והפך פניו לדרום. הלך כל פני מערב עד שהוא מגיע לדרום. הגיע לדרום, והפך פניו למזרח. היה מהלך בדרום, עד שהוא מגיע לפתחה של עליה״; (ד, ז): ״כתל המסבה חמש, והמסבה שלש... ובית הורדת המים שלש אמות, והכתל חמש אמות״.\nבקצרה — המחלוקת בכרטיס זה (הפירוט — במתג ״צורת התאים״ שבתפריט, תחת ״שיטות ומחלוקות״):\n• לרמב״ם (ברירת המחדל) — המסבה היא התא התחתון שברצועה, ואיך עלו ממנה לגגות לא פירש.\n• לתפארת ישראל ולשאר המפרשים — מעבר משתפע ועולה עד גג התאים, ועליהם עד פתח העלייה.\n**ברטנורא:** ״מסיבה״ — כמין מחילה ומערה; ומפני שהעולה בה עולה דרך היקף ויורד דרך היקף, קרויה מסיבה (ברטנורא מידות ד, ה).\n**תוספות יום טוב:** ״כמין מחילה ומערה״ — לא דייק, שכאן המסיבה עולה למעלה; הכסף משנה: ״בנין עמוד חלול עשוי כמו מעלות סביב והעולה בו עולה דרך היקף״, ורש״י (יומא טז.): ״בנין אבנים מעלות מגלגלות וסובבות במקיף עמוד כמין עץ גלגל של גת״; עולים לגגות התאים לראות בבדק הבית (ר׳ שמעיה) (תוספות יום טוב מידות ד, ה).\n**תפארת ישראל:** המסיבה היא הרווח של שלוש אמות שבצפון, סמוך לכותל התאים מבחוץ — כעין כבש בצד צפון, המשתפע ועולה מקרן מזרחית־צפונית מול מערב עד שבקרן צפונית־מערבית הוא שווה לגג התאים; משם הולכים על גגות התאים המערביים, ומקרן דרומית־מערבית כבש שני משתפע מעל גגי התאים הדרומיים עד פתח העלייה; ולדעתו הכבש חלול מתחתיו לחלונות התאים; כותל המסיבה, חמש אמות, מעקה לה; ובדרום — ״בית הורדת המים״, רווח של שלוש אמות שאליו משתפעים הגגות, וכותל של חמש לחוזק ולהשוות את הבניין (תפארת ישראל מידות ד, ה; ד, ז; ד, ג).\nבמודל: מעבר עולה בצפון הבית, מן הפינה המזרחית־צפונית עד גג התאים במערב, ועל גגות התאים — למערב ולדרום, עד פתח העלייה — כתפארת ישראל; רוחבה שלוש אמות בין כותל התא לכותל המסיבה; ״פתח את המסיבה״ מסיר את כותל המסיבה.\nהלחיצה כאן מדליקה את המסבה בצבע צף ל־15 שניות, והבית נשאר סגור: חיצים נעים מראים את הדרך שבמשנה — למערב לאורך הצפון, לדרום על גגות התאים שבמערב, ולמזרח על גגות התאים שבדרום, עד פתח העלייה. בשיטת הרמב״ם (ברירת המחדל) המסבה היא התא התחתון שברצועה; איך עלו ממנה לגגות — לא פירש, ולכן העלייה לגגות מסומנת בקו מקווקו בלבד.", refs: [["מידות ד, ה", "Mishnah_Middot.4.5"], ["ברטנורא ד, ה", "Bartenura_on_Mishnah_Middot.4.5"], ["תוי״ט ד, ה", "Tosafot_Yom_Tov_on_Mishnah_Middot.4.5"], ["תפא״י ד, ה", "Yachin_on_Mishnah_Middot.4.5"], ["מידות ד, ז", "Mishnah_Middot.4.7"], ["תפא״י ד, ז", "Yachin_on_Mishnah_Middot.4.7"], ["רמב״ם בית הבחירה ד, יב", "Mishneh_Torah,_The_Chosen_Temple.4.12"]] },
          { t: "הליכה במסיבה — הדגמה", action: () => { const M = ctx.shared.mesibahDemo; if (typeof M === 'function') M(); }, info: "לשון המשנה (מידות ד, ה): ״ומסבה היתה עולה מקרן מזרחית צפונית לקרן צפונית מערבית, שבה היו עולים לגגות התאים. היה עולה במסבה ופניו למערב. הלך על כל פני הצפון, עד שהוא מגיע למערב. הגיע למערב, והפך פניו לדרום. הלך כל פני מערב עד שהוא מגיע לדרום. הגיע לדרום, והפך פניו למזרח. היה מהלך בדרום, עד שהוא מגיע לפתחה של עליה, שפתחה של עליה פתוח לדרום״.\nההדגמה, בהליכה ובגובה העיניים, בדרך שבמשנה: במסבה למערב, על גגות התאים לדרום ולמזרח, עד פתח העלייה; המסבה ודרכה מסומנות בצבע צף לאורך כל ההליכה.\nבקצרה — המחלוקת בכרטיס זה (הפירוט — במתג ״צורת התאים״ שבתפריט, תחת ״שיטות ומחלוקות״): לרמב״ם (ברירת המחדל) המסבה היא התא התחתון שברצועה, וההליכה עוברת בתוכו; איך עלו ממנו לגגות — לא פירש, ולכן שם העין עולה בטיסה; בשאר השיטות שבמודל — מעבר עולה במעלות, כתפארת ישראל. כפתור ההדגמה נמצא גם על המודל, ליד תחילת המסבה. גובה העין והזמנים — בחירת מודל.", refs: [["מידות ד, ה", "Mishnah_Middot.4.5"], ["רמב״ם בית הבחירה ד, יב", "Mishneh_Torah,_The_Chosen_Temple.4.12"]] },
          { t: "העלייה והלולין", feature: (ctx.shared.features || {})["aliyahGlow"] || null, tg: [-42, 86, 0], cam: [-38, 88, 165], info: "לשון המשנה (מידות ד, ה): ״ובפתחה של עליה היו שני כלונסות של ארז, שבהן היו עולין לגגה של עליה. וראשי פספסין מבדילים בעליה בין הקדש לבין קדש הקדשים. ולולין היו פתוחין בעליה לבית קדש הקדשים, שבהן היו משלשלין את האמנים בתבות, כדי שלא יזונו עיניהן מבית קדשי הקדשים״; (ד, ו): ״וגבה של עליה ארבעים אמה, ואמה כיור, ואמתים בית דלפה, ואמה תקרה, ואמה מעזיבה, ושלש אמות מעקה, ואמה כלה עורב״.\n**ברטנורא:** ״לולין״ — ארובות שעושים בעליות; משלשלים את האומנים — מורידים אותם בחבל בתוך התיבות, כדי שלא ייהנו בראיית בית קודש הקדשים, אלא מתקנים מה שצריך בלבד ועולים (ברטנורא מידות ד, ה).\n**תוספות יום טוב:** הכלונסות — זקופות למעלה כלפי גג הבית, ובין הכלונסות שליבות (ר׳ שמעיה); הפספסין בעלייה — תמה, שהרי שתי פרוכות הבדילו בעלייה (שקלים ח, ד; רב), ותירץ: עליית בית קודש הקדשים חמורה מקודש הקדשים — ״אין נכנסים לה אלא פעם אחת בשבוע״ (פסחים פו.) — ולכן פספסין, שיכירו העולים שלא ייכנסו; התיבות פרוצות לרוח אחת, לצד החומה, ושלושת הצדדים סתומים (הראבי״ה); ״יזונו״ — לשון הנאה, שמשביע עצמו ממראית נוי המלאכה (רש״י) (תוספות יום טוב מידות ד, ה).\n**תפארת ישראל:** הכלונסות — ארז מחוברות בשליבות, כסולם חזק, שהעלייה גבוהה יותר מארבעים אמה; ולא עשו כבש, שלא להרגיל רגלי אדם לשם; הפספסין — ראשי קורות בולטות מכותלי העלייה מצפון ומדרום, ואפשר שהיו אבנים; הלולין — ארובות בתקרת קודש הקדשים סמוך לכתלים סביב, כל אחת רחוקה מחברתה כדי הושטת היד; האומן בתיבה הסתומה משלושה צדדים, וצדה שלעומת הכותל פרוץ; קול מראה וריח — אף שאין בהם מעילה, איסור יש (פסחים כו.) (תפארת ישראל מידות ד, ה).\nבמודל: העלייה חלולה, גובהה ארבעים אמה, ומתחתיה חמש אמות של תקרות ההיכל — כיור, בית דלפה, תקרה ומעזיבה; פתחה לדרום עם שני כלונסות הארז; שלושה לולין מעל קודש הקדשים (מספרם וגודלם — בחירת מודל) ושורת ראשי פספסין על קו הפרוכת; המעקה וכליא עורב והציור על הפרוכות — בתפריט, תחת ״שיטות ומחלוקות״. הלחיצה כאן מראה את הבית סגור, מן הצד, והעלייה, הלולין ופתח העלייה מסומנים בצבע צף ל־15 שניות. המתג ״מלמעלה״ בכרטיס חותך את המודל בגובה שמונים, ורואים את רצפת העלייה והלולין מלמעלה.", refs: [["מידות ד, ה", "Mishnah_Middot.4.5"], ["ברטנורא ד, ה", "Bartenura_on_Mishnah_Middot.4.5"], ["תוי״ט ד, ה", "Tosafot_Yom_Tov_on_Mishnah_Middot.4.5"], ["תפא״י ד, ה", "Yachin_on_Mishnah_Middot.4.5"], ["מידות ד, ו", "Mishnah_Middot.4.6"], ["ברטנורא ד, ו", "Bartenura_on_Mishnah_Middot.4.6"], ["תפא״י ד, ו", "Yachin_on_Mishnah_Middot.4.6"], ["רמב״ם בית הבחירה ד, יג", "Mishneh_Torah,_The_Chosen_Temple.4.13"], ["פסחים כו.", "Pesachim.26a"], ["פסחים פו.", "Pesachim.86a"]] },
          { t: "פתח העלייה ופנים העלייה", feature: (ctx.shared.features || {})["aliyahDoor"] || null, action: () => { if (ctx.shared.openFor) ctx.shared.openFor("ui-house", 15000); }, tg: [-42, 72, 12], cam: [-40, 95, 60], info: "לשון המשנה (מידות ד, ה): ״היה מהלך בדרום, עד שהוא מגיע לפתחה של עליה, שפתחה של עליה פתוח לדרום. ובפתחה של עליה היו שני כלונסות של ארז, שבהן היו עולין לגגה של עליה״.\n**ברטנורא:** העולה במסיבה עולה דרך היקף — צפון, מערב, דרום — עד פתח העלייה (ברטנורא מידות ד, ה).\n**תוספות יום טוב:** שני כלונסות זקופות למעלה כלפי גג הבית, ובין הכלונסות שליבות (ר׳ שמעיה) (תוספות יום טוב מידות ד, ה).\n**תפארת ישראל:** פתח העלייה בכותל דרום של העלייה, סמוך לקרן דרומית־מזרחית של ההיכל מבחוץ, בראש הכבש העולה על גגי התאים הדרומיים; בפנים, סמוך לפתח — הכלונסות עם השליבות, לעלות מן העלייה לגג ההיכל דרך לול שבגג (תפארת ישראל מידות ד, ה; ד, ג).\nבמודל: הפתח בדרום, בראש המסיבה ההולכת על גגות התאים; בפנים — הכלונסות, הלולין לבית קודש הקדשים וראשי הפספסין; ״פתח את ההיכל״ מסיר את צד הדרום, והמבט אל תוך העלייה.", refs: [["מידות ד, ה", "Mishnah_Middot.4.5"], ["ברטנורא ד, ה", "Bartenura_on_Mishnah_Middot.4.5"], ["תוי״ט ד, ה", "Tosafot_Yom_Tov_on_Mishnah_Middot.4.5"], ["תפא״י ד, ה", "Yachin_on_Mishnah_Middot.4.5"], ["מידות ד, ו", "Mishnah_Middot.4.6"]] },
          { t: "הנברשת והטבלא של הילני", action: () => { if (ctx.shared.openFor) ctx.shared.openFor("hei-ulam", 15000); }, tg: [3, 39, -6.5], cam: [39, 39, 2], info: "לשון המשנה (יומא ג, י): ״הילני אמו עשתה נברשת של זהב על פתחו של היכל. ואף היא עשתה טבלא של זהב שפרשת סוטה כתובה עליה״.\nבקצרה — המחלוקות בכרטיס זה (צורת הנברשת — במתג ״הנברשת של הילני — צורתה״ שבתפריט, תחת ״שיטות ומחלוקות״):\n• צורת הנברשת: לרש״י ולברטנורא — מנורה (ברירת המחדל); לרמב״ם — ״כמו שמשית שעושין על פתחי הבתים״.\n• מה שכתוב בטבלא: בבבלי — ״באלף בית״, ראשי התיבות (רש״י), או ״בסירוגין״: ״תחילת המקרא היה כתוב תיבה שלימה ולבסוף ראשי תיבות״ (רש״י גיטין ס.); לרמב״ם (בתשובה) — ״אות אחת מכל תיבה, או היתה כתובה בסירוגין, שלש תיבות כאן [ושלש] רחוקות מהן בשיטה שניה״.\n• הניצוצות: בבבלי — מן הנברשת; בירושלמי, כפירוש קרבן העדה — השמש ״היתה [ז]ורחת על הטבלא״.\n**הגמרא** (יומא לז:): ״תנא: בשעה שהחמה זורחת ניצוצות יוצאין ממנה, והכל יודעין שהגיע זמן קריאת שמע״; ושם: ״כשהוא כותב רואה וכותב כמה שכתוב בטבלא״.\n**רש״י** (יומא לז.): ״נברשתא — מנורה״. **הרמב״ם** (פירוש המשנה, יומא ג, י): ״ונברשת היא כמו שמשית שעושין על פתחי הבתים מזכוכית והיא עשתה אותה מזהב טוב ממורט. וכשהיה השמש זורח עליה היה לאותה השמשית אורה ונוגה בתחילת היום כעלות השמש מאופק ירושלים ואותה שעה היו קורין קריאת שמע״.\n**התוספתא** (סוטה ב, א): ״היה נוטל את מגילתה ונכנס לו לאולם. טבלא של זהב היתה קבועה בכותלו של היכל והיא נראית [מבאולם]. ממנה רואה [וכתב] לא חסיר ולא יתיר״.\n**הרמב״ם** (תשובות, ז, ב): ״טבלה של זהב שפרשת סוטה כתובה עליה, ובחריתה היתה, והיה הכהן מעתיק ממנה וכותב על הספר״. **המאירי** (יומא לז.): ״כדי שיעתיק ממנה הכהן כשבאה לידו סוטה... ולא יהו צריכים להוציא עליה ספר תורה״.\nבמודל: הנברשת — באולם, מעל פתח ההיכל ומעל הגפן: לרש״י — ״מנורה״ (במודל: תלויה בשרשרת); לרמב״ם — שמשית של זהב על הכותל מעל הפתח. הטבלא — על כותל ההיכל מול האולם, מצפון לפתח, בגובה העין, והכתב חרות בה בשורות (סימנים בלבד, לא אותיות). גודלן, צורתן המדויקת, צד הטבלא וגובהה — בחירת מודל.", refs: [["יומא ג, י", "Mishnah_Yoma.3.10"], ["יומא לז.", "Yoma.37a"], ["רש״י יומא לז.", "Rashi_on_Yoma.37.1"], ["פירוש המשניות לרמב״ם יומא ג, י", {"book": 517, "index": 66}], ["תוספתא סוטה ב, א", {"book": 205, "index": 10}], ["גיטין ס.", {"book": 120, "index": 1941}], ["רש״י גיטין ס.", {"book": 2169, "index": 2989}], ["תשובות הרמב״ם ז, ב", {"book": 5733, "index": 23}], ["מאירי יומא לז.", "Meiri_on_Yoma.37.1"], ["קרבן העדה ירושלמי סוטה ב, ב", {"book": 1453, "index": 532}]] },
          { t: "ניצוצות הנברשת בזריחת החמה", feature: (ctx.shared.features || {})["heleneSparks"] || null, tg: [3.5, 47.5, 0], cam: [17, 40, 9], info: "הגמרא (יומא לז:): ״הילני אמו עשתה נברשת של זהב... תנא: בשעה שהחמה זורחת ניצוצות יוצאין ממנה, והכל יודעין שהגיע זמן קריאת שמע״.\n**רש״י:** ״ניצוצות — זהרורית שהחמה זורחת מן המזרח ונטה על פתח ההיכל שהוא לצד מערבי״; ״נברשתא — מנורה״ (יומא לז.).\nבמודל: ניצוצות מנצנצים סביב הנברשת — או סביב השמשית, לפי המתג ״הנברשת של הילני — צורתה״ — במשך כחמש עשרה שניות. מספרם, גודלם והנצנוץ — בחירת מודל.", refs: [["יומא לז:", {"book": 107, "index": 893}], ["רש״י יומא לז:", {"book": 2157, "index": 1409}], ["רש״י יומא לז.", {"book": 2157, "index": 1385}]] },
          { t: "לשכת הכלים", feature: (ctx.shared.features || {})["kelim"] || null, tg: () => (typeof ctx.shared.kelimView === "function" ? ctx.shared.kelimView().tg : [-38, 18, -21.4]), cam: () => (typeof ctx.shared.kelimView === "function" ? ctx.shared.kelimView().cam : [-38, 30, -8.3]), info: "לשון המשנה (תמיד ג, ד): ״נכנסו ללשכת הכלים, והוציאו משם תשעים ושלשה כלי כסף וכלי זהב״. ובשקלים (ה, ו): ״שתי לשכות היו במקדש, אחת לשכת חשאים, ואחת לשכת הכלים... לשכת הכלים, כל מי שהוא מתנדב כלי, זורקו לתוכה״.\nבקצרה — מקומה: אין לה מקום במשנה; לתפארת ישראל — ״אפשר״ שבאחד מן התאים שסביב ההיכל.\n**תפארת ישראל** (יכין, תמיד ג, ד): ״לא ידעתי מקומה. ואפשר שהיתה באותן ל״ח לשכות שהיו סביב לכותלי ההיכל״.\n**הרמב״ם** (ערכין וחרמין ב, יב): ״שתי לשכות היו במקדש. אחת לשכת חשאים. ואחת לשכת הכלים... ואחת לשלשים יום הגזברין פותחין אותה. כל כלי שנמצא בו צרך לבדק הבית מניחין אותו והשאר נמכרין ודמיהן נופלין ללשכת בדק הבית״.\nבמודל: תשעים ושלושה הכלים עומדים על שלושה מדפים בתא אחד — התא האמצעי שבצפון, בקומה התחתונה — והמבט יורד אל תוכו, כשהבית חתוך בגובה תקרת התא (המדפים מדורגים, כדי שכל שורה תיראה מלמעלה). איזה תא — בחירת מודל, שהרי כתב ״אפשר״; וכן המדפים, צורת הכלים (קערות, כוסות ומחבתות, כסף וזהב לסירוגין) וסדרם. אם לשכת הכלים שבתמיד היא לשכת הכלים שבשקלים — היעב״ץ הניח בצריך עיון: ״צ״ע אם היא אותה של... שקלים. ואף היא סתומה ונעלמה. לא נודע איה איפה מקומה״ (לחם שמים, תמיד ג, ד); והראב״ד העיר שבזו שבשקלים — ״לאו משום דהי׳ גונזין בה כלי שרת, אלא כל מי שיתנדב כלי זורקו לתוכה״, וסיים: ״צריכה עיון באיזה מקום היתה עומדת״ (במלאכת שלמה, תמיד ג, ה).", refs: [["תמיד ג, ד", "Mishnah_Tamid.3.4"], ["יכין תמיד ג, ד", "Yachin_on_Mishnah_Tamid.3.4"], ["שקלים ה, ו", "Mishnah_Shekalim.5.6"], ["רמב״ם ערכין וחרמין ב, יב", {"book": 328, "index": 38}], ["לחם שמים תמיד ג, ד", {"book": 1140, "index": 53}], ["מלאכת שלמה תמיד ג, ה", {"book": 1202, "index": 104}]] }
        ]]
      ];
      const UI_MERGE = {};
      const UI_VIEW_HOME = {"harHabayit": "הר הבית", "shushanGate": "שער שושן", "royalStoa": "הסטיו המלכותי", "ezratNashim": "עזרת נשים", "nikanor": "שער ניקנור", "azarah": "העזרה", "mizbeach": "המזבח", "heichalFront": "ההיכל מבחוץ", "heichalInside": "ההיכל", "ulam": "האולם", "kodesh": "הקודש", "kodeshHakodashim": "קודש הקדשים ואבן השתייה"};
      {
        const byT = {};
        for (const g of PLACES) for (const it of g[1]) if (!byT[it.t]) byT[it.t] = it;
        // the titles of 60-palace.js / 57-kelim.js may change: a merge whose title is not there is skipped (the button stays), and the check reports it
        for (const dt of Object.keys(UI_MERGE)) {
          const d = byT[dt], k = byT[UI_MERGE[dt]];
          if (!d || !k || d === k) { console.warn("[ui.js] merge skipped: " + dt); continue; }
          d.noButton = true;
          d.mergeInto = k;
          (k.more = k.more || []).push(d);
        }
        for (const key of Object.keys(UI_VIEW_HOME)) {
          const b = viewBtnByKey[key], k = byT[UI_VIEW_HOME[key]];
          if (!b || !k) continue;
          grid.removeChild(b);
          if (k.key !== key && k.view !== key) (k.more = k.more || []).push({ t: "", key });
          else if (k.key !== key && ui_INFO[key] && !k.key && String(k.info || "").indexOf(String(ui_INFO[key]).slice(0, 40)) < 0) (k.more = k.more || []).push({ t: "", key });
        }
      }
      const uiItemText = (it) => String((it.key ? ui_INFO[it.key] : it.info) || "");
      const uiItemRefs = (it) => (it.key ? ui_REFS[it.key] : it.refs) || [];
      // the card of a button that took over others: its text, then each one's under its title; the links without repeats
      const uiMergedCard = (it) => {
        const parts = [uiItemText(it)];
        const refs = uiItemRefs(it).slice(), seen = new Set(refs.map((r) => r[0]));
        for (const d of it.more) {
          const tx = uiItemText(d);
          if (tx && parts.indexOf(tx) < 0) parts.push((d.t ? d.t + ": " : "") + tx);
          for (const r of uiItemRefs(d)) if (!seen.has(r[0])) { seen.add(r[0]); refs.push(r); }
        }
        return { text: parts.filter(Boolean).join("\n\n"), refs };
      };
      // 1.0.1-L (the contract with 75-tour.js): every place button in the panel's order, for ctx.ui.places()
      const placeList = [];
      const viewKeySet = new Set(ui_VIEWS.map((v) => v.key));
      // DEMOS_GROUP_300 (the user, 18.11.2026: "והייתי מוסיף קטגוריה נפרדת להדגמות"): the house's demonstrations together, in a group of
      // their own at the head of the panel, "הדגמות" (ui_demosList, the house's own list). Each starts as its own button does - a place's
      // (the same item: its camera and its card) or the pill's on the model (its own flight; the card is the pill's tooltip) - and has
      // no slide of its own in the presentation (noTour: each already has its place there)
      try {
        const list = typeof ui_demosList === "function" ? ui_demosList() : [];
        const pillOf = (id) => (ctx.shared.modelButtons || []).find((x) => x && x.id === id) || null;
        const D = [];
        for (const d of list) {
          let it = null;
          if (d.place) {
            for (const [, its] of PLACES) { const o = its.find((x) => x && x.t === d.place); if (o) { it = Object.assign({}, o, { t: d.t }); break; } }
          } else {
            it = { t: d.t };
            Object.defineProperty(it, "info", { get: () => { const b = pillOf(d.pill); return (b && b.title) || ""; }, enumerable: true });
          }
          if (!it) continue;
          if (d.pill) {
            it.action = () => {
              try { if (d.run) d.run(); } catch (_) {}
              const b = pillOf(d.pill);
              if (b && typeof b.set === "function" && !(typeof b.get === "function" && b.get())) b.set(true);
            };
          }
          if (d.layer) it.layer = d.layer;
          it.noTour = true;
          delete it.noButton;
          D.push(it);
        }
        if (D.length) PLACES.unshift(["הדגמות", D]);
      } catch (_) {}
      for (const [gname, items] of PLACES) {
        const det = document.createElement("details");
        det.className = "tm-pl";
        const sm = document.createElement("summary");
        sm.textContent = gname;
        det.appendChild(sm);
        const box = document.createElement("div");
        for (const it of items) {
          // 1.0.1-K: a place whose view no module registered (and that has no camera of its own) is left out - no dead button
          if (it.view && !resolveFp(it.view) && !(it.cam && it.tg)) continue;
          if (it.noButton) {   // 1.0.1-L (Part 7, U3): no button of its own; its slide stays
            if (!placeItemByT[it.t]) placeItemByT[it.t] = it;
            placeList.push({ title: it.t, group: gname, view: it.view && viewKeySet.has(it.view) ? it.view : null,
              fp: it.view && resolveFp(it.view) ? it.view : null, info: it.key ? ui_INFO[it.key] || "" : it.info || "",
              refs: it.key ? ui_REFS[it.key] || [] : it.refs || [], layer: it.layer || null, feature: it.feature ? it.feature.key : null, item: it });
            continue;
          }
          const pb = document.createElement("button");
          pb.type = "button";
          pb.textContent = ui_stripSrc(it.t);   // 1.1.0: no sources in the tree
          if (pb.textContent !== it.t) pb.title = it.t;
          pb.addEventListener("click", () => {
            try {
              // 1.3.5 / 1.9.3 (the full scan: the zone, the roof or the section of the place before stayed over this place's view for the
              // rest of its 15 seconds): what a place or a row switched on or opened for a while goes back first
              try { autoOff.flush(); } catch (_) {}
              try { if (typeof ctx.shared.closeAuto === "function") ctx.shared.closeAuto(); } catch (_) {}
              try { placeLeave(it); } catch (_) {}   // PLACE_LEAVE_210
              if (it.layer) setLayer(it.layer, true);
              if (typeof it.action === "function") {
                try {
                  it.action();
                } catch (_) {
                }
              }
              // 1.0.1-L (L.27): the place's model feature on, with its 15 seconds (an animation with its own end runs to it)
              if (it.feature) {
                try {
                  autoOff.run(it.feature, pb);
                } catch (_) {
                }
              }
              const fp0 = it.view ? resolveFp(it.view) : null;
              // tg / cam may be functions resolved at click time (e.g. a place that follows the model's numbers)
              const pos = fp0 ? fp0.pos : typeof it.cam === "function" ? it.cam() : it.cam;
              const tgt = fp0 ? fp0.target : typeof it.tg === "function" ? it.tg() : it.tg;
              // 1.0.1-K: no automatic removal - a place only flies (and, when it is one, shows its own model feature)
              if (pos && tgt && !it.noFly) fly(pos, tgt);   // 2.0.9 TAMID_STOP_209: a place whose action brings its own eye
              // PLACE_NOFADE_211 (the user, 15.11.2026, of the place "בר שורא" in בית ראשון: "לא מציג כלום" - the wall it stands by was
              // see-through): a place whose subject is a wall itself holds the fading while it shows (ctx.shared.fadeHold)
              if (pos && tgt && !it.noFly && it.noFade && ctx.shared.fadeHold) { try { ctx.shared.fadeHold.set(tgt); } catch (_) {} }
            } catch (_) {
            }
            // 1.0.1-L (L.34): the explanation in the floating card beside the panel, at this button's height; the panel's lists stay where they are
            if (it.more) setInfo("__place", uiMergedCard(it), { title: it.t, anchor: pb, side: it.cardSide });   // 1.0.1-L (Part 7, U3)
            else if (it.key) setInfo(it.key, null, { title: it.t, anchor: pb, side: it.cardSide });
            else setInfo("__place", { text: it.info || "", refs: it.refs || [] }, { title: it.t, anchor: pb, side: it.cardSide });
            hidePanelOnPhone();
            for (const o of btns) o.classList.remove("on");
            for (const o of placeBtns) o.classList.remove("on");
            pb.classList.add("on");
          });
          box.appendChild(pb);
          placeBtns.push(pb);
          if (!placeBtnByT[it.t]) { placeBtnByT[it.t] = pb; placeItemByT[it.t] = it; }   // 1.0.1-J: for the presentation (ctx.ui.placeButton)
          placeList.push({ title: it.t, group: gname, view: it.view && viewKeySet.has(it.view) ? it.view : null,
            fp: it.view && resolveFp(it.view) ? it.view : null, info: it.key ? ui_INFO[it.key] || "" : it.info || "",
            refs: it.key ? ui_REFS[it.key] || [] : it.refs || [], layer: it.layer || null, feature: it.feature ? it.feature.key : null, item: it });
        }
        det.appendChild(box);
        if (box.children.length) panel.appendChild(det);   // 1.1.0: a group whose buttons all merged elsewhere is not shown
      }
      for (const dt of Object.keys(UI_MERGE)) {   // 1.0.1-L (Part 7, U3): the old title leads to the kept button
        const d = placeItemByT[dt];
        if (d && d.mergeInto && placeBtnByT[d.mergeInto.t]) placeBtnByT[dt] = placeBtnByT[d.mergeInto.t];
      }
      // ===== 1.0.1-H: labels -> sources (the user: "הוסף מקורות להכל"): a click on a label in the model shows the explanation and the source
      // links of the matching view or place; the cursor turns into a hand over such a label. A label object may also carry
      // its own {info, refs}. LABEL_MAP ties the label texts of the modules (20-mount ... 60-palace) to a view key {v}, a place title {p}
      // (PLACES / EXTRAS above) or its own text {info, refs}; a function entry chooses by the label's position or layer (texts shared).
      // 1.0.1-K (K.9b item 7, the addendum C; the user on "העמוד": "ההסבר הזה ייכנס גם ללוח — ליד העמוד"): the click opens a small
      // card NEXT TO THE LABEL on the model - the explanation and its source links - that follows the camera and closes with its ✕ or a click
      // elsewhere (nothing is allocated per frame). 1.0.1-L (L.34): one card at a time - it and the panel's floating explanation card close
      // each other; the panel's #tm-info box is gone. =====
      // the label's card (built before the label handlers; closeCard is also called by the views and the places through setInfo)
      const card = document.createElement("div");
      card.id = "tm-card";
      card.setAttribute("role", "dialog");
      const cardHead = document.createElement("div");
      cardHead.className = "h";
      const cardTitle = document.createElement("span");
      cardTitle.className = "tt";
      const cardX = document.createElement("button");
      cardX.type = "button";
      cardX.className = "x";
      cardX.textContent = "✕";
      cardX.title = "סגור את ההסבר (Esc)";
      cardHead.appendChild(cardTitle);
      cardHead.appendChild(cardX);
      const cardBody = document.createElement("div");
      cardBody.className = "b";
      const cardRefs = document.createElement("div");
      cardRefs.className = "r";
      const cardOps = document.createElement("div");   // 1.0.2 (item 4): the label's opinions (renderChips above)
      cardOps.className = "o";
      cardOps.style.display = "none";
      card.appendChild(cardHead);
      card.appendChild(cardBody);
      card.appendChild(cardRefs);
      card.appendChild(cardOps);
      document.body.appendChild(card);
      let cardOpsIds = null;
      let cardSpr = null, cardW = 300, cardH = 160, cardShown = false, cardX0 = -1, cardY0 = -1, cardSide = 1;   // side: 1 right of the label, -1 left
      const cardV = new Vector3(), cardC = new Vector3();
      const closeCard = () => {
        cardSpr = null;
        cardShown = false;
        card.style.display = "none";
      };
      closeLabelCard = closeCard;   // 1.0.1-L (L.34): the panel's explanation card closes this one
      cardX.addEventListener("click", (e) => {
        e.stopPropagation();
        closeCard();
      });
      // the card's place: beside the label's projected point (to its left on screen when there is no room on its right), inside the window
      // and left of the side panel; hidden (but kept) while the label is behind the camera, out of the view or hidden itself
      const placeCard = (force) => {
        const spr = cardSpr;
        if (!spr) return;
        let ok = !!spr.parent && spr.visible && labelGroup.visible;
        let x = 0, y = 0, half = 0;
        if (ok) {
          cardC.copy(spr.position).applyMatrix4(ctx.camera.matrixWorldInverse);
          ok = cardC.z < -0.5;
          if (ok) {
            cardV.copy(spr.position).project(ctx.camera);
            ok = Math.abs(cardV.x) < 1.05 && Math.abs(cardV.y) < 1.05;
            const W = window.innerWidth, H = window.innerHeight;
            x = (cardV.x * 0.5 + 0.5) * W;
            y = (-cardV.y * 0.5 + 0.5) * H;
            const pxPerAmah = H / (2 * -cardC.z * Math.tan((ctx.camera.fov || 50) * Math.PI / 360));
            half = Math.min(W * 0.25, spr.scale.x * pxPerAmah * 0.5);
          }
        }
        if (!ok) {
          if (cardShown) { cardShown = false; card.style.display = "none"; }
          return;
        }
        if (!cardShown) { cardShown = true; card.style.display = "flex"; }
        const W = window.innerWidth, H = window.innerHeight;
        const right = panel.style.display !== "none" && !isPhone(W) ? W - 242 : W - 8;
        // beside one end of the label; it keeps its side while that side has room (no jumping from side to side as the view turns)
        const leftR = x + half + 10, leftL = x - half - 10 - cardW;
        const fitsR = leftR + cardW <= right, fitsL = leftL >= 8;
        if (cardSide > 0 ? !fitsR && fitsL : !fitsL && fitsR) cardSide = -cardSide;
        let left = cardSide > 0 ? leftR : leftL;
        left = Math.max(8, Math.min(right - cardW, left));
        let top = y - cardH * 0.35;
        top = Math.max(ui_barH() + 8, Math.min(H - cardH - 60, top));   // 1.0.2: never over the fixed top bar (#tm-card is above it, z 29 > 20)
        if (force || Math.abs(left - cardX0) > 0.5 || Math.abs(top - cardY0) > 0.5) {
          cardX0 = left;
          cardY0 = top;
          card.style.left = left.toFixed(0) + "px";
          card.style.top = top.toFixed(0) + "px";
        }
      };
      const openCard = (spr, t) => {
        xcardClose();   // 1.0.1-L (L.34): one card at a time
        cardSpr = spr;
        cardSide = 1;
        ui_fillSrc(cardTitle, String((spr.userData.label && spr.userData.label.text) || "") + (t.title ? " — " + t.title : ""));   // a bare measure gets its meaning
        const rs = t.key ? ui_REFS[t.key] || [] : t.refs || [];
        ui_fillRich(cardBody, t.key ? ui_INFO[t.key] || "" : t.text || "", srcLinker(rs), 1700);   // 1.9.1: rich; FOLD_211   // 1.0.2 (A): the brackets open their sources
        cardRefs.textContent = "";
        if (rs.length) {
          cardRefs.appendChild(document.createTextNode("למקור: "));
          refLinks(cardRefs, rs);
        }
        cardOpsIds = Array.isArray(t.ops) && t.ops.length ? t.ops : null;   // 1.0.2 (item 4)
        renderChips(cardOps, cardOpsIds);
        card.style.display = "flex";   // a column: the title, the text (scrolls), the source links (always seen)
        cardShown = true;
        card.scrollTop = 0;
        cardBody.scrollTop = 0;
        cardW = card.offsetWidth || 300;   // measured once per opening
        cardH = card.offsetHeight || 160;
        placeCard(true);
      };
      ctx.animated.push(() => { if (cardSpr) placeCard(false); });
      // 1.0.2 (item 4): a row marked anywhere (the table, a chip, the presentation) redraws the open cards' chips; the label's card is measured again
      chipsRefresh = () => {
        if (xOpen && xOpsIds) renderChips(xOps, xOpsIds, xChipPicked);
        if (cardSpr && cardOpsIds) {
          renderChips(cardOps, cardOpsIds);
          cardW = card.offsetWidth || cardW;
          cardH = card.offsetHeight || cardH;
          placeCard(true);
        }
      };
      window.addEventListener("resize", () => {
        if (!cardSpr) return;
        cardW = card.offsetWidth || cardW;
        cardH = card.offsetHeight || cardH;
        placeCard(true);
      });
      // a click anywhere else on the page closes the card (the canvas decides in its own pointerup below: a label opens another card)
      document.addEventListener("click", (e) => {
        if (!cardSpr) return;
        const t = e.target;
        if (t === ctx.renderer.domElement || (t && card.contains && card.contains(t))) return;
        closeCard();
      }, true);
      {
        const placeByT = {};
        for (const [, items] of PLACES) for (const it of items) if (it && it.t && !placeByT[it.t]) placeByT[it.t] = it;
        const viewKeys = new Set(ui_VIEWS.map((v) => v.key));
        // 1.0.1-K: the explanations of the labels that are parts of something (the yatzia section's measures, the layers of the wall, of the
        // floor and of the golden altar, the parts of the base, the rooms of the king's house) - each its own text and sources
        const LABEL_MAP = {
          "הר הבית": {"v": "harHabayit"},
          "שער שושן": {"v": "shushanGate"},
          "שער טדי": {"p": "שער טדי"},
          "שערי חולדה": {"p": "שערי חולדה"},
          "שער קיפונוס": {"p": "שער קיפונוס"},
          "הסטיו המלכותי": {"v": "royalStoa"},
          "הסורג": {"p": "הסורג"},
          "דוכן הלויים": {"p": "דוכן הלויים"},
          "עזרת נשים": {"v": "ezratNashim"},
          "לשכת הנזירים": {"p": "לשכת הנזירים"},
          "לשכת העצים": {"p": "לשכת העצים"},
          "לשכת המצורעים": {"p": "לשכת המצורעים"},
          "לשכת שמנים": {"p": "לשכת שמנים"},
          "שער בית המוקד": {"p": "שער בית המוקד — פתחו של הבית לעזרה"},
          "שער הקרבן": {"p": "שער הקרבן"},
          "שער הניצוץ": {"p": "שער הניצוץ"},
          "שער הדלק": {"p": "שער הדלק"},
          "שער הבכורות": {"p": "שער הבכורות"},
          "שער המים": {"p": "שער המים"},
          "שער ניקנור": {"v": "nikanor"},
          "בית המוקד": {"p": "בית המוקד"},
          "לשכת הגולה ובור הגולה": {"p": "לשכת הגולה"},
          "הסנהדרין הגדולה — 71": {"p": "לשכת הגזית — הסנהדרין"},
          "הנשיא": {"p": "לשכת הגזית — הסנהדרין"},
          "סופרי הדיינין": {"p": "לשכת הגזית — הסנהדרין"},
          "פתח לקודש": {"p": "לשכת הגזית — הסנהדרין"},
          "פתח לחול": {"p": "לשכת הגזית — הסנהדרין"},
          "מקום הפייס": {"p": "לשכת הגזית — הסנהדרין"},
          "לשכת הגזית — מושב הסנהדרין": {"p": "לשכת הגזית — הסנהדרין"},
          "לשכת המלח": {"p": "לשכת המלח"},
          "לשכת הפרוה": {"p": "לשכת הפרוה"},
          "לשכת המדיחין": {"p": "לשכת המדיחין"},
          "כבש לסובב": {"p": "כבשים קטנים — רש״י"},
          "כבש ליסוד": {"p": "כבשים קטנים — רש״י"},
          "התפוח": {"info": "במשנה: ״ותפוח היה באמצע המזבח, פעמים עליו כשלש מאות כור״. פירוש הרמב״ם למשנה: האפר הצבור באמצע, כמין כרי עגול כתפוח; ״שלש מאות כור״ הוא גוזמא. המערכה הגדולה נוגעת בו (תמיד ב, ד). במודל: כיפה עגולה ברדיוס 4.5 וגובה 2.2 אמות — המידות בחירת מודל.", "refs": [], "title": "התפוח"},
          "רבובה": {"info": "בקרן המערבית־דרומית של המזבח שני נקבים דקים כמין שני חוטמין (מידות ג, ב; רמב״ם בית הבחירה ב, יא), ובמערב הכבש חלון אמה על אמה הנקראת רבובה (רמב״ם ב, יד). מקומם המדויק בתוך הפינה ובגובה הכבש אינו קבוע במקורות והוא בחירת מודל.", "refs": [["מידות ג, ב", "Mishnah_Middot.3.2"]], "title": "רבובה"},
          "המזבח": {"v": "mizbeach"},
          "הכבש": {"p": "הכבש הגדול"},
          "הכיור": {"p": "הכיור"},
          "בית המטבחים": {"p": "בית המטבחים"},
          "הטבעות": {"p": "הטבעות"},
          "ההיכל": {"v": "heichalFront"},
          "האולם": {"v": "ulam"},
          "הקודש": {"v": "kodesh"},
          "קודש הקדשים": {"v": "kodeshHakodashim"},
          "המנורה": {"p": "המנורה"},
          "שולחן לחם הפנים": {"p": "שולחן לחם הפנים"},
          "מזבח הזהב": {"p": "מזבח הזהב"},
          "הגפן של זהב": {"p": "הגפן של זהב"},
          "אבן השתייה": {"v": "kodeshHakodashim"},
          "שער עזרת נשים": {"p": "שער עזרת נשים — המזרחי"},
          "שלחן השיש — לחם הפנים בכניסתו": {"p": "שולחנות האולם — שיש וזהב"},
          "שלחן הזהב — ביציאתו": {"p": "שולחנות האולם — שיש וזהב"},
          "פשפש צפוני": {"p": "פשפשי ההיכל"},
          "פשפש דרומי — סגור יהיה": {"p": "פשפשי ההיכל"},
          "אבן שלפני המנורה — שלוש מעלות": {"p": "המנורה"},
          "בית החליפות": {"p": "האולם"},
          "החיל — עשר אמות": {"p": "החיל"},
          "עזרת ישראל — י״א אמה": {"p": "עזרת ישראל"},
          "עזרת כהנים — י״א אמה": {"p": "עזרת כהנים"},
          "בין האולם ולמזבח — כ״ב אמה": {"p": "בין האולם ולמזבח"},
          "כלונסות של ארז — שלא יבעט": {"p": "כלונסות הארז שבאולם"},
          "שלושה משמרות כהנים (זהב) ועשרים ואחד לויים (עץ)": {"p": "המשמרות — שלושה לכהנים ועשרים ואחד ללויים"},
          "קו המזבח הקודם — 28 על 28; תוספת בני הגולה בדרום ובמערב": {"p": "מידות המזבח — 32, 30, 28, 26, 24, והמזבח הקודם 28 על 28"},
          "ספלי הניסוך — מים (מערבי) ויין (מזרחי)": {"p": "ספלי הניסוך"},
          "תוספת עד 120 אמה — אברבנאל, יוסף בן מתתיהו": {"info": "האברבנאל (מלכים א ח, י): \"והבית אשר בנה מאה באמה ארכו ומאה באמה רחבו ומאה ועשרים אמה גבהו\" — על פי יוסף בן מתתיהו; המשנה (מדות ד, ו): \"ההיכל מאה על מאה על רום מאה\". במודל: רצועה של עשרים אמה נוספת מעל הגג, במתג.", "refs": [["מידות ד, ו", "Mishnah_Middot.4.6"]], "title": "תוספת עד 120 אמה — אברבנאל, יוסף בן מתתיהו"},
          "התאים — שלושים ושמונה, בשלוש קומות": {"p": "התאים — שלושים ושמונה בשלוש קומות"},
          "בית הורדת המים": {"info": "בית הורדת המים — שלוש אמות בדרום הבית, כנגד המסיבה שבצפון: \"בית הורדת המים שלש, והכותל חמש\" (מידות ד, ז) — מקום שבו יורדים מי הגג (ברטנורא; רמב״ם ד, ה).", "refs": [["מידות ד, ז", "Mishnah_Middot.4.7"]], "title": "בית הורדת המים"},
          "המסיבה — עולה מקרן מזרחית צפונית": {"p": "המסיבה"},
          "העלייה — ארבעים אמה": {"p": "העלייה והלולין"},
          "לולין לבית קודש הקדשים": {"p": "העלייה והלולין"},
          "ראשי פספסין — בין הקודש לקודש הקדשים": {"p": "העלייה והלולין"},
          "פתח העלייה — פתוח לדרום, ושני כלונסות של ארז": {"p": "העלייה והלולין"},
          "כרובים דצורתא — פיתוחי הקירות (יומא נד.)": {"p": "פיתוחי הקירות — כרובים דצורתא"},
          "מסיבה לגג בית הפרוה": {"p": "לשכת הפרוה"},
          "לשכת העץ — לשכת כהן גדול (פרהדרין)": {"p": "לשכת העץ — לשכת כהן גדול (פרהדרין)"},
          "לשכת פנחס המלביש": {"p": "לשכת פנחס המלביש"},
          "לשכת עושי חביתין": {"p": "לשכת עושי חביתין"},
          "עליית שער הניצוץ — הכהנים שומרים מלמעלה": {"p": "עליית שער הניצוץ"},
          "לשכת טלאי קרבן": {"p": "בית המוקד"},
          "לשכת עושי לחם הפנים": {"p": "בית המוקד"},
          "לשכת אבני המזבח שגנזו בני חשמונאי": {"p": "לשכת אבני המזבח — בבית המוקד"},
          "הירידה לבית הטבילה": {"p": "הירידה לבית הטבילה — בבית המוקד"},
          "המסבה — ״עמוד של בנין שעולין ויורדין בו ע״י גלגול״ (המפרש)": {"p": "המסיבה ובית הטבילה"},
          "המחילה — ״והנרות דולקין מכאן ומכאן״": {"p": "המסיבה ובית הטבילה"},
          "המדורה — ״ונתחמם כנגד המדורה״": {"p": "המסיבה ובית הטבילה"},
          "בית כסא של כבוד — פתוח: ״יודע שאין שם אדם״": {"p": "המסיבה ובית הטבילה"},
          "בית הטבילה — אמה על אמה, ברום שלש אמות": {"p": "המסיבה ובית הטבילה"},
          "רובדין של אבן — זקני בית אב ישנים שם": {"p": "בית המוקד"},
          "טבלא של שיש וטבעת — המפתחות": {"p": "בית המוקד"},
          "בור הגולה והגלגל": {"p": "לשכת הגולה"},
          "מולחין עורות קדשים": {"p": "לשכת הפרוה"},
          "דירת כהן גדול בשבעת הימים": {"p": "לשכת העץ — לשכת כהן גדול (פרהדרין)"},
          "עליית בית אבטינס — מפטמי הקטורת": {"p": "לשכת בית אבטינס — על גבי שער המים"},
          "בית הטבילה שעל גבי שער המים — הטבילה הראשונה ביום הכיפורים": {"p": "לשכת בית אבטינס — על גבי שער המים"},
          "המוקד — אש גדולה להתחמם בה": {"p": "בית המוקד"},
          "דלתות ניקנור — נחושת שמצהיבה כזהב": {"p": "שער ניקנור"},
          "על גגות התאים — למערב ולדרום, עד פתח העלייה": {"p": "המסיבה"},
          "העזרה — 187 על 135 (מידות ה, א)": {"p": "העזרה"},
          "עזרת ישראל — 11 אמה": {"p": "עזרת ישראל"},
          "עזרת כהנים — 11 אמה": {"p": "עזרת כהנים"},
          "בין האולם ולמזבח — 22 אמה": {"p": "בין האולם ולמזבח"},
          "עזרת נשים — 135 על 135 (מידות ב, ה)": {"p": "עזרת נשים"},
          "החיל — עשר אמות בין הסורג לחומה (מידות ב, ג)": {"p": "החיל"},
          "32 הבסיס · 30 מעל היסוד · 28 מעל הסובב · 26 בין הקרנות · 24 מקום המערכה (מידות ג, א)": {"p": "מידות המזבח — 32, 30, 28, 26, 24, והמזבח הקודם 28 על 28"},
          "המזבח הקודם — 28 על 28; בני הגולה הוסיפו 4 בדרום ו־4 במערב (רבי יוסי)": {"p": "מידות המזבח — 32, 30, 28, 26, 24, והמזבח הקודם 28 על 28"},
          "אבנים זקופות — לא מאומת": {"p": "שער טדי"},
          "שער העליון — שער קטן (אבא יוסי בן חנן)": {"info": "לשון המשנה (שקלים ו, ג; מידות ב, ו): ״ארבע בצפון, וארבע בדרום, שלש במזרח, ושתים במערב, כנגד שלשה עשר שערים. שערים דרומיים סמוכין למערב, שער העליון, שער הדלק, שער הבכורות, שער המים... לעמתן בצפון סמוכין למערב, שער יכניה, שער קרבן, שער נשים, שער השיר... במזרח, שער ניקנור, ושני פשפשין היו לו... ושנים במערב שלא היה להם שם״.\nברטנורא (שקלים ו, ג): ״הר הבית היה משפע ועולה ממזרח למערב, והשער הסמוך למערב הוא שער העליון״.\nתוספות יום טוב (שקלים ו, ג): ״שער העליון. לא אתפרש מה היה משמש״; בדרום ״מחסרי שער העליון ואינך ניקבו בשמותן ובסידרן״, ובצפון ״מחסרי חד ושינו בשמותן שקראום ניצוץ וקרבן ומוקד״; ובשם התוספות (כתובות קו.): ״דלכולי עלמא היו י״ג שערים וז׳ היו גדולים וששה היו קטנים״; ושני שערי המערב — ״וקטנים היו ולא היו משמשין כלום אלא לעת הצורך הגדול״.\nבמודל: שבעת השערים הגדולים כמשנה, ועוד ארבעה שערים קטנים (ארבע על שמונה אמות, כפשפשי ניקנור): שער העליון בדרום, ממערב לשער הדלק; שער הנשים בצפון, בין שער הקרבן לבית המוקד; ושניים בכותל המערבי. שמות שערי הצפון — כתפארת ישראל וכחק נתן: שער הניצוץ הוא שער יכניה, שער הקרבן, שער הנשים הקטן, ושער בית המוקד הוא שער השיר. מקום השערים הקטנים בכותל — בחירת מודל.", "refs": [["שקלים ו, ג", "Mishnah_Shekalim.6.3"], ["ברטנורא שקלים ו, ג", "Bartenura_on_Mishnah_Shekalim.6.3"], ["תוי״ט שקלים ו, ג", "Tosafot_Yom_Tov_on_Mishnah_Shekalim.6.3"], ["מידות ב, ו", "Mishnah_Middot.2.6"], ["חק נתן מידות א, ד", "Chok_Natan_on_Mishnah_Middot.1.4"], ["תפא״י מידות ב, ו", "Yachin_on_Mishnah_Middot.2.6"]], "title": "שער העליון — שער קטן (אבא יוסי בן חנן)"},
          "שני שערים במערב שלא היה להם שם": {"info": "לשון המשנה (שקלים ו, ג; מידות ב, ו): ״ארבע בצפון, וארבע בדרום, שלש במזרח, ושתים במערב, כנגד שלשה עשר שערים. שערים דרומיים סמוכין למערב, שער העליון, שער הדלק, שער הבכורות, שער המים... לעמתן בצפון סמוכין למערב, שער יכניה, שער קרבן, שער נשים, שער השיר... במזרח, שער ניקנור, ושני פשפשין היו לו... ושנים במערב שלא היה להם שם״.\nברטנורא (שקלים ו, ג): ״הר הבית היה משפע ועולה ממזרח למערב, והשער הסמוך למערב הוא שער העליון״.\nתוספות יום טוב (שקלים ו, ג): ״שער העליון. לא אתפרש מה היה משמש״; בדרום ״מחסרי שער העליון ואינך ניקבו בשמותן ובסידרן״, ובצפון ״מחסרי חד ושינו בשמותן שקראום ניצוץ וקרבן ומוקד״; ובשם התוספות (כתובות קו.): ״דלכולי עלמא היו י״ג שערים וז׳ היו גדולים וששה היו קטנים״; ושני שערי המערב — ״וקטנים היו ולא היו משמשין כלום אלא לעת הצורך הגדול״.\nבמודל: שבעת השערים הגדולים כמשנה, ועוד ארבעה שערים קטנים (ארבע על שמונה אמות, כפשפשי ניקנור): שער העליון בדרום, ממערב לשער הדלק; שער הנשים בצפון, בין שער הקרבן לבית המוקד; ושניים בכותל המערבי. שמות שערי הצפון — כתפארת ישראל וכחק נתן: שער הניצוץ הוא שער יכניה, שער הקרבן, שער הנשים הקטן, ושער בית המוקד הוא שער השיר. מקום השערים הקטנים בכותל — בחירת מודל.", "refs": [["שקלים ו, ג", "Mishnah_Shekalim.6.3"], ["ברטנורא שקלים ו, ג", "Bartenura_on_Mishnah_Shekalim.6.3"], ["תוי״ט שקלים ו, ג", "Tosafot_Yom_Tov_on_Mishnah_Shekalim.6.3"], ["מידות ב, ו", "Mishnah_Middot.2.6"], ["חק נתן מידות א, ד", "Chok_Natan_on_Mishnah_Middot.1.4"], ["תפא״י מידות ב, ו", "Yachin_on_Mishnah_Middot.2.6"]], "title": "שני שערים במערב שלא היה להם שם"},
          "״שער העליון״ — כך קורא הרמב״ם לשער ניקנור": {"info": "הרמב״ם (בית הבחירה ה, ה): ״חוץ משער מזרחי שהיה מצפה נחשת דומה לזהב. ושער זה הוא הנקרא שער העליון והוא שער ניקנור״. תוספות יום טוב (מידות ב, ו) מביא שכך משמע בירושלמי (עירובין, פרק כיצד מעברין) — ״ומעלה יתירה״ — ומסביר שהשם מושאל שם לשער המזרח; ולדעתו ודאי שער העליון שבמשנה הוא בדרום.\nבמודל: על שער ניקנור נכתבת התווית: שער העליון — כך קורא הרמב״ם לשער ניקנור.", "refs": [["רמב״ם בית הבחירה ה, ה", "Mishneh_Torah,_The_Chosen_Temple.5.5"], ["תוי״ט מידות ב, ו", "Tosafot_Yom_Tov_on_Mishnah_Middot.2.6"]], "title": "״שער העליון״ — כך קורא הרמב״ם לשער ניקנור"},
          "התפוח לראב״ד — טבלה כ״ב על כ״ב, גבוהה אמה": {"info": "הראב״ד (בהשגות על הרמב״ם, הלכות תמידין ומוספין פרק ב), כפי שמביא המלאכת שלמה (תמיד ב, ב): מדתנן ״עליו״ ולא ״בו״ — ״משמע שהיה שם טבלא מרובעת גבוה אמה והיא כ״ב אמה על כ״ב אמה ואותה אמה היתה השלמת עשר אמות לגובה המזבח והיא נקראת תפוח ע״ש שהיתה גבוהה על כל סביביו ואפשר שהיתה אותה הטבלא קצוצת קרנות כעין עגולה כדי להרחיב מקום המערכה״; וכן ״החלו מעלין באפר ע״ג התפוח״ — מעלים את האפר על גבי הטבלה.\nבמודל: טבלה מאבן המזבח, עשרים ושתיים על עשרים ושתיים וגובה אמה, באמצע גג המזבח, וקרנותיה קצוצות שתי אמות; עליה האפר, והמערכות עומדות עליה (המערכות על הטבלה — בחירת מודל; הראב״ד לא פירש).", "refs": [["תמיד ב, ב", "Mishnah_Tamid.2.2"], ["ברטנורא תמיד ב, ב", "Bartenura_on_Mishnah_Tamid.2.2"]], "title": "התפוח לראב״ד — טבלה כ״ב על כ״ב, גבוהה אמה"},
          "בית החליפות — חדר (תפארת ישראל)": {"info": "תפארת ישראל (מידות ד, ז): האולם מתרחב לכל צד חמש עשרה אמה — כותל האולם חמש, ועשר אמות חלל; ״ורוחב החלל הזה ממזרח למערב היה י״א אמה״; ״והוא היה נקרא בית החליפות אותו רווח של י׳ אמה מצפון לדרום וי״א אמה ממזרח למערב, שהיה האולם יתר לכאן ולכאן, היה חדר מכאן ומכאן, ונקראו בית חליפות״ — שם גונזים את הסכינים, ארגז לכל משמר; ״ולכל א׳ מב׳ בתי החליפות שבאולם היו ב׳ פתחים, א׳ לאולם, וא׳ בזוית״ — בזווית צפונית־מערבית ובזווית דרומית־מערבית, כל פתח גבוה שמונה אמות, ״כדי להכשיר כל עזרה כולה שם לשחיטת קדשים קלים״; ובגמרא (זבחים נה:): ״כדי להכשיר את העזרה כולה לאכילת קדשי קדשים, ולשחיטת קדשים קלים״.\nבמודל: האולם שבעים אמה, ומשני צדיו חדר של עשר על אחת עשרה, ובו פתח לאולם ופתח בזווית המערבית; גובה החדר (עשרים), המחיצה בינו לאולם והכותל המערבי — בחירת מודל. במבט מלמעלה התקרה פתוחה.", "refs": [["מידות ד, ז", "Mishnah_Middot.4.7"], ["תפא״י ד, ז", "Yachin_on_Mishnah_Middot.4.7"]], "title": "בית החליפות — חדר (תפארת ישראל)"},
          "חלל האולם — תשעים אמה (רמב״ם)": {"info": "הרמב״ם (בית הבחירה ד, ה): ״מן הצפון לדרום מאה אמה. עבי כתל האולם חמש אמות. ומכתל אולם עד כתל הקדש עשר אמות״ — בין כותל האולם לכותל ההיכל חלל של עשר אמות, ואם הוא פתוח לאולם — חלל האולם תשעים אמה. ברטנורא (מידות ד, ז) כדעה זו: ״שכתל האולם עביו חמש אמה, והאולם עשר אמות לצפון וכן לדרום״ — ולכן ״צר מאחוריו ורחב מלפניו״ לא נתפרש לו, ״שהרי מאה על מאה היה בשוה״. תוספות יום טוב דוחה: אם האולם נמשך לצפון ולדרום, היה לתנא לכלול אותו בחשבון מצפון לדרום — ״כותל האולם חמש והאולם עשרה״ — כמו שכתב הרמב״ם בחיבורו, ואין מי שיכריח להעדיף את האולם בכל צד. בחירת הדעה מחליפה את האולם במודל.", "refs": [["רמב״ם בית הבחירה ד, ה", "Mishneh_Torah,_The_Chosen_Temple.4.5"]], "title": "חלל האולם — תשעים אמה (רמב״ם)"},
          "חלל האולם — שבעים אמה": {"info": "לשון המשנה (מידות ד, ז): ״האולם עודף עליו חמש עשרה אמה מן הצפון, וחמש עשרה אמה מן הדרום, והוא היה נקרא בית החליפות, ששם גונזים את הסכינים. וההיכל צר מאחריו, ורחב מלפניו, ודומה לארי״. תוספות יום טוב: הראב״ד על הרמב״ם — ״שלא היה שם כותל לאולם כלל... ורוחב האולם נמנה ברוחב ההיכל״; ולדעת התוי״ט האולם לא נמשך אצל התאים לצפון ולדרום כלל, אלא עודף עליהם חמש עשרה מכל צד, במשך של שש עשרה אמה ממערב למזרח (כותל האולם חמש והאולם אחת עשרה), ובית החליפות — חמש עשרה האמות העודפות (ר׳ שמעיה: ״צר מאחוריו. ע׳ אמה״; ״ורחב מלפניו. ק׳ אמה״). תפארת ישראל: בית החליפות — חדר של עשר אמות מצפון לדרום ואחת עשרה ממזרח למערב מכל צד, ובו ארגז לכל משמר לגנוז סכיניו; ״חליף״ — סכין ביוונית; ולכל בית חליפות שני פתחים, אחד לאולם ואחד בזווית, גבוהים שמונה אמות, להכשיר את כל העזרה לשחיטת קדשים קלים (זבחים נה:). במודל: ההיכל שבעים אמה והאולם מאה; חלל האולם כרוחב ההיכל, ובית החליפות גושים אטומים עם תווית — פתחיהם ותוכם אינם מצוירים.", "refs": [["מידות ד, ז", "Mishnah_Middot.4.7"]], "title": "חלל האולם — שבעים אמה"},
          "שער לחיל": {"p": "בית המוקד"},
          "שער לעזרה — השער השלישי": {"p": "שער בית המוקד — פתחו של הבית לעזרה"},
          "פשפש קטן — רבי יהודה (מידות א, ז)": {"p": "שער בית המוקד — פתחו של הבית לעזרה"},
          "ראשי פספסין — מכאן לדרום קודש, לצפון חול": {"p": "בית המוקד"},
          "24 אמה": {"p": "מידות המזבח — 32, 30, 28, 26, 24, והמזבח הקודם 28 על 28"},
          "28 אמה ו־2 טפחים": {"p": "מידות המזבח — 32, 30, 28, 26, 24, והמזבח הקודם 28 על 28"},
          "26 אמה ו־4 טפחים": {"p": "מידות המזבח — 32, 30, 28, 26, 24, והמזבח הקודם 28 על 28"},
          "28 אמה": {"p": "מידות המזבח — 32, 30, 28, 26, 24, והמזבח הקודם 28 על 28"},
          "32 אמה": {"p": "מידות המזבח — 32, 30, 28, 26, 24, והמזבח הקודם 28 על 28"},
          "30 אמה ו־2 טפחים": {"p": "מידות המזבח — 32, 30, 28, 26, 24, והמזבח הקודם 28 על 28"},
          "24 אמה ו־4 טפחים": {"p": "מידות המזבח — 32, 30, 28, 26, 24, והמזבח הקודם 28 על 28"},
          "30 אמה": {"p": "מידות המזבח — 32, 30, 28, 26, 24, והמזבח הקודם 28 על 28"},
          "22 אמה": {"p": "מידות המזבח — 32, 30, 28, 26, 24, והמזבח הקודם 28 על 28"},
          "20 אמה": {"p": "מידות המזבח — 32, 30, 28, 26, 24, והמזבח הקודם 28 על 28"},
          "26 אמה": {"p": "מידות המזבח — 32, 30, 28, 26, 24, והמזבח הקודם 28 על 28"},
          "24 אמה ו־2 טפחים": {"p": "מידות המזבח — 32, 30, 28, 26, 24, והמזבח הקודם 28 על 28"},
          "28 אמה ו־4 טפחים": {"p": "מידות המזבח — 32, 30, 28, 26, 24, והמזבח הקודם 28 על 28"},
          "26 אמה ו־2 טפחים": {"p": "מידות המזבח — 32, 30, 28, 26, 24, והמזבח הקודם 28 על 28"},
          "המזבח של רבי יוסי — 28 על 28, ומקום המערכה 20 על 20; בני הגולה הוסיפו 4 בדרום ו־4 במערב": {"p": "מידות המזבח — 32, 30, 28, 26, 24, והמזבח הקודם 28 על 28"},
          "דרך חכמים: מן הפשפש לתא, מן התא להיכל, ולשער הגדול": {"p": "פשפשי ההיכל"},
          "דרך רבי יהודה: בתוך עובי הכותל, עד בין שני השערים": {"p": "פשפשי ההיכל"},
          "שער הנשים — שער קטן (תפארת ישראל)": {"info": "סדר שערי הצפון לאבא יוסי בן חנן (שקלים ו, ג; מידות ב, ו): ״לעמתן בצפון סמוכין למערב, שער יכניה, שער קרבן, שער נשים, שער השיר״.\nחק נתן (מידות א, ד): המשנה שם מונה את שערי הצפון מן המערב, כמו את שערי הדרום — שער הניצוץ סמוך למערב, ״והוא שער יכניה דתני אבא יוסי בן חנן לקמן ספ״ב דהא חשיב סמוך לו שער הקרבן״. וכן תפארת ישראל (מידות ב, ו): ״והרי שער נצוץ היה היותר קרוב למערב, ומסתמא ממנו התחיל התנא למנות סדר השערים. רק שבתחלה היה נקרא שער יכניה, ואח״כ יחדוהו לקיום האש״.\nתפארת ישראל שם, על שער הנשים: ״ונ״ל עוד שזהו שער קטן דלא חשיב ליה תנא לעיל״ — ״וגם כדי שיהיה להנשים סימן באיזה שער יכנסו, לכן היה משונה בקטנו משאר השערים. ושער השיר דקחשיב תנא הכא, נ״ל דהוא שער בית המוקד דקחשיב התם״; ולכן ״היה שער הנשים בין שער הקרבן לשער המוקד״. ודוחה את ההפך: ״אבל אי״ל דשער המוקד הוא שער הנשים, ושער השיר היה למזרח משער המוקד, והוא היה השער הקטן דלא חשיב ליה התם. דאין טעם למה יעשו לשער השיר קטן״.\nהרא״ש (מידות ב, ו): ״שער השיר. שם היו מכניסין כלי השיר כי היה סמוך לבית המטבחים״; ״ובית הניצוץ ובית המוקד היו מאלו השערים אלא שנקראו להם גם אלו השמות״.\nבמודל, בתצוגת שלושה עשר השערים (כתפארת ישראל): על שער הניצוץ — שער יכניה; שער הקרבן; שער הנשים — שער קטן, ארבע על שמונה אמות כפשפשי ניקנור, בין שער הקרבן לבית המוקד (מקומו בתוך הרווח — בחירת מודל); ועל שער בית המוקד שלעזרה — שער השיר.", "refs": [["שקלים ו, ג", "Mishnah_Shekalim.6.3"], ["מידות ב, ו", "Mishnah_Middot.2.6"], ["חק נתן מידות א, ד", "Chok_Natan_on_Mishnah_Middot.1.4"], ["תפא״י מידות ב, ו", "Yachin_on_Mishnah_Middot.2.6"], ["הרא״ש מידות ב, ו", "Rosh_on_Mishnah_Middot.2.6"]], "title": "שער הנשים — שער קטן (תפארת ישראל)"},
          "לאבא יוסי בן חנן: שער יכניה": {"info": "סדר שערי הצפון לאבא יוסי בן חנן (שקלים ו, ג; מידות ב, ו): ״לעמתן בצפון סמוכין למערב, שער יכניה, שער קרבן, שער נשים, שער השיר״.\nחק נתן (מידות א, ד): המשנה שם מונה את שערי הצפון מן המערב, כמו את שערי הדרום — שער הניצוץ סמוך למערב, ״והוא שער יכניה דתני אבא יוסי בן חנן לקמן ספ״ב דהא חשיב סמוך לו שער הקרבן״. וכן תפארת ישראל (מידות ב, ו): ״והרי שער נצוץ היה היותר קרוב למערב, ומסתמא ממנו התחיל התנא למנות סדר השערים. רק שבתחלה היה נקרא שער יכניה, ואח״כ יחדוהו לקיום האש״.\nתפארת ישראל שם, על שער הנשים: ״ונ״ל עוד שזהו שער קטן דלא חשיב ליה תנא לעיל״ — ״וגם כדי שיהיה להנשים סימן באיזה שער יכנסו, לכן היה משונה בקטנו משאר השערים. ושער השיר דקחשיב תנא הכא, נ״ל דהוא שער בית המוקד דקחשיב התם״; ולכן ״היה שער הנשים בין שער הקרבן לשער המוקד״. ודוחה את ההפך: ״אבל אי״ל דשער המוקד הוא שער הנשים, ושער השיר היה למזרח משער המוקד, והוא היה השער הקטן דלא חשיב ליה התם. דאין טעם למה יעשו לשער השיר קטן״.\nהרא״ש (מידות ב, ו): ״שער השיר. שם היו מכניסין כלי השיר כי היה סמוך לבית המטבחים״; ״ובית הניצוץ ובית המוקד היו מאלו השערים אלא שנקראו להם גם אלו השמות״.\nבמודל, בתצוגת שלושה עשר השערים (כתפארת ישראל): על שער הניצוץ — שער יכניה; שער הקרבן; שער הנשים — שער קטן, ארבע על שמונה אמות כפשפשי ניקנור, בין שער הקרבן לבית המוקד (מקומו בתוך הרווח — בחירת מודל); ועל שער בית המוקד שלעזרה — שער השיר.", "refs": [["שקלים ו, ג", "Mishnah_Shekalim.6.3"], ["מידות ב, ו", "Mishnah_Middot.2.6"], ["חק נתן מידות א, ד", "Chok_Natan_on_Mishnah_Middot.1.4"], ["תפא״י מידות ב, ו", "Yachin_on_Mishnah_Middot.2.6"], ["הרא״ש מידות ב, ו", "Rosh_on_Mishnah_Middot.2.6"]], "title": "לאבא יוסי בן חנן: שער יכניה"},
          "לאבא יוסי בן חנן: שער הקרבן": {"info": "סדר שערי הצפון לאבא יוסי בן חנן (שקלים ו, ג; מידות ב, ו): ״לעמתן בצפון סמוכין למערב, שער יכניה, שער קרבן, שער נשים, שער השיר״.\nחק נתן (מידות א, ד): המשנה שם מונה את שערי הצפון מן המערב, כמו את שערי הדרום — שער הניצוץ סמוך למערב, ״והוא שער יכניה דתני אבא יוסי בן חנן לקמן ספ״ב דהא חשיב סמוך לו שער הקרבן״. וכן תפארת ישראל (מידות ב, ו): ״והרי שער נצוץ היה היותר קרוב למערב, ומסתמא ממנו התחיל התנא למנות סדר השערים. רק שבתחלה היה נקרא שער יכניה, ואח״כ יחדוהו לקיום האש״.\nתפארת ישראל שם, על שער הנשים: ״ונ״ל עוד שזהו שער קטן דלא חשיב ליה תנא לעיל״ — ״וגם כדי שיהיה להנשים סימן באיזה שער יכנסו, לכן היה משונה בקטנו משאר השערים. ושער השיר דקחשיב תנא הכא, נ״ל דהוא שער בית המוקד דקחשיב התם״; ולכן ״היה שער הנשים בין שער הקרבן לשער המוקד״. ודוחה את ההפך: ״אבל אי״ל דשער המוקד הוא שער הנשים, ושער השיר היה למזרח משער המוקד, והוא היה השער הקטן דלא חשיב ליה התם. דאין טעם למה יעשו לשער השיר קטן״.\nהרא״ש (מידות ב, ו): ״שער השיר. שם היו מכניסין כלי השיר כי היה סמוך לבית המטבחים״; ״ובית הניצוץ ובית המוקד היו מאלו השערים אלא שנקראו להם גם אלו השמות״.\nבמודל, בתצוגת שלושה עשר השערים (כתפארת ישראל): על שער הניצוץ — שער יכניה; שער הקרבן; שער הנשים — שער קטן, ארבע על שמונה אמות כפשפשי ניקנור, בין שער הקרבן לבית המוקד (מקומו בתוך הרווח — בחירת מודל); ועל שער בית המוקד שלעזרה — שער השיר.", "refs": [["שקלים ו, ג", "Mishnah_Shekalim.6.3"], ["מידות ב, ו", "Mishnah_Middot.2.6"], ["חק נתן מידות א, ד", "Chok_Natan_on_Mishnah_Middot.1.4"], ["תפא״י מידות ב, ו", "Yachin_on_Mishnah_Middot.2.6"], ["הרא״ש מידות ב, ו", "Rosh_on_Mishnah_Middot.2.6"]], "title": "לאבא יוסי בן חנן: שער הקרבן"},
          "לאבא יוסי בן חנן: שער השיר (תפארת ישראל)": {"info": "סדר שערי הצפון לאבא יוסי בן חנן (שקלים ו, ג; מידות ב, ו): ״לעמתן בצפון סמוכין למערב, שער יכניה, שער קרבן, שער נשים, שער השיר״.\nחק נתן (מידות א, ד): המשנה שם מונה את שערי הצפון מן המערב, כמו את שערי הדרום — שער הניצוץ סמוך למערב, ״והוא שער יכניה דתני אבא יוסי בן חנן לקמן ספ״ב דהא חשיב סמוך לו שער הקרבן״. וכן תפארת ישראל (מידות ב, ו): ״והרי שער נצוץ היה היותר קרוב למערב, ומסתמא ממנו התחיל התנא למנות סדר השערים. רק שבתחלה היה נקרא שער יכניה, ואח״כ יחדוהו לקיום האש״.\nתפארת ישראל שם, על שער הנשים: ״ונ״ל עוד שזהו שער קטן דלא חשיב ליה תנא לעיל״ — ״וגם כדי שיהיה להנשים סימן באיזה שער יכנסו, לכן היה משונה בקטנו משאר השערים. ושער השיר דקחשיב תנא הכא, נ״ל דהוא שער בית המוקד דקחשיב התם״; ולכן ״היה שער הנשים בין שער הקרבן לשער המוקד״. ודוחה את ההפך: ״אבל אי״ל דשער המוקד הוא שער הנשים, ושער השיר היה למזרח משער המוקד, והוא היה השער הקטן דלא חשיב ליה התם. דאין טעם למה יעשו לשער השיר קטן״.\nהרא״ש (מידות ב, ו): ״שער השיר. שם היו מכניסין כלי השיר כי היה סמוך לבית המטבחים״; ״ובית הניצוץ ובית המוקד היו מאלו השערים אלא שנקראו להם גם אלו השמות״.\nבמודל, בתצוגת שלושה עשר השערים (כתפארת ישראל): על שער הניצוץ — שער יכניה; שער הקרבן; שער הנשים — שער קטן, ארבע על שמונה אמות כפשפשי ניקנור, בין שער הקרבן לבית המוקד (מקומו בתוך הרווח — בחירת מודל); ועל שער בית המוקד שלעזרה — שער השיר.", "refs": [["שקלים ו, ג", "Mishnah_Shekalim.6.3"], ["מידות ב, ו", "Mishnah_Middot.2.6"], ["חק נתן מידות א, ד", "Chok_Natan_on_Mishnah_Middot.1.4"], ["תפא״י מידות ב, ו", "Yachin_on_Mishnah_Middot.2.6"], ["הרא״ש מידות ב, ו", "Rosh_on_Mishnah_Middot.2.6"]], "title": "לאבא יוסי בן חנן: שער השיר (תפארת ישראל)"},
          "צורת התאים — רש״י והר״ש": {"info": "לשון המשנה (מידות ד, ד): ״התחתונה, חמש, ורבד שש. והאמצעית, שש, ורבד שבע. והעליונה, שבע״; ובמידות ד, ז: ״כתל התא חמש, והתא שש, כתל ההיכל שש״.\nתוספות יום טוב (מידות ד, ד): לרש״י המשנה ״אתאים גופייהו קאי ולהם היו מגרעות בכותל ההיכל שעוביו שש ממש לפירש״י. וכן פי׳ הרר״ש״. הר״ש (רבינו שמעיה, מידות ד, ד): ״שהקורות כונסות במגרעות החומה של היכל אמה אחת לכך נמצאת האמצעית שש רחבה״. וכן הרא״ש (שם): ״עובי הכותל של היכל היה שש אמות עד תקרת התא ואז היה מתקצר אמה אמה״.\nבמודל: כותל ההיכל שש בקומה התחתונה, חמש באמצעית וארבע בעליונה; התאים חמש, שש ושבע; ראשי הקורות מונחים על המגרעות. במשנה (ד, ז) כותל ההיכל, התא וכותל התא הם יחד שבע עשרה אמה. בשיטה זו התא התחתון חמש בלבד, והאמה השבע עשרה ניתנה במודל לכותל התא החיצון — שש אמות (בחירת מודל).", "refs": [["מידות ד, ד", "Mishnah_Middot.4.4"], ["תוי״ט מידות ד, ד", "Tosafot_Yom_Tov_on_Mishnah_Middot.4.4"], ["הר״ש מידות ד, ד", "R_Shemaya_on_Middot.4.4"], ["הרא״ש מידות ד, ד", "Rosh_on_Mishnah_Middot.4.4"], ["מידות ד, ז", "Mishnah_Middot.4.7"]], "title": "צורת התאים — רש״י והר״ש"},
          "קומה תחתונה": {"p": "התאים — שלושים ושמונה בשלוש קומות"},
          "כותל ההיכל 6": {"p": "התאים — שלושים ושמונה בשלוש קומות"},
          "התא 5": {"p": "התאים — שלושים ושמונה בשלוש קומות"},
          "כותל התא 6": {"info": "לשון המשנה (מידות ד, ד): ״התחתונה, חמש, ורבד שש. והאמצעית, שש, ורבד שבע. והעליונה, שבע״; ובמידות ד, ז: ״כתל התא חמש, והתא שש, כתל ההיכל שש״.\nתוספות יום טוב (מידות ד, ד): לרש״י המשנה ״אתאים גופייהו קאי ולהם היו מגרעות בכותל ההיכל שעוביו שש ממש לפירש״י. וכן פי׳ הרר״ש״. הר״ש (רבינו שמעיה, מידות ד, ד): ״שהקורות כונסות במגרעות החומה של היכל אמה אחת לכך נמצאת האמצעית שש רחבה״. וכן הרא״ש (שם): ״עובי הכותל של היכל היה שש אמות עד תקרת התא ואז היה מתקצר אמה אמה״.\nבמודל: כותל ההיכל שש בקומה התחתונה, חמש באמצעית וארבע בעליונה; התאים חמש, שש ושבע; ראשי הקורות מונחים על המגרעות. במשנה (ד, ז) כותל ההיכל, התא וכותל התא הם יחד שבע עשרה אמה. בשיטה זו התא התחתון חמש בלבד, והאמה השבע עשרה ניתנה במודל לכותל התא החיצון — שש אמות (בחירת מודל).", "refs": [["מידות ד, ד", "Mishnah_Middot.4.4"], ["תוי״ט מידות ד, ד", "Tosafot_Yom_Tov_on_Mishnah_Middot.4.4"], ["הר״ש מידות ד, ד", "R_Shemaya_on_Middot.4.4"], ["הרא״ש מידות ד, ד", "Rosh_on_Mishnah_Middot.4.4"], ["מידות ד, ז", "Mishnah_Middot.4.7"]], "title": "כותל התא 6"},
          "קומה אמצעית": {"p": "התאים — שלושים ושמונה בשלוש קומות"},
          "כותל ההיכל 5": {"p": "התאים — שלושים ושמונה בשלוש קומות"},
          "התא 6": {"p": "התאים — שלושים ושמונה בשלוש קומות"},
          "קומה עליונה": {"p": "התאים — שלושים ושמונה בשלוש קומות"},
          "כותל ההיכל 4": {"p": "התאים — שלושים ושמונה בשלוש קומות"},
          "התא 7": {"p": "התאים — שלושים ושמונה בשלוש קומות"},
          "המסבה 3": {"p": "התאים — שלושים ושמונה בשלוש קומות"},
          "כותל המסבה 5": {"p": "התאים — שלושים ושמונה בשלוש קומות"},
          "כותל ההיכל 7": {"p": "התאים — שלושים ושמונה בשלוש קומות"},
          "כותל התא 5": {"p": "התאים — שלושים ושמונה בשלוש קומות"},
          "כותל ההיכל 6½": {"info": "לשון המשנה (מידות ד, ד): ״התחתונה, חמש, ורבד שש. והאמצעית, שש, ורבד שבע. והעליונה, שבע״; ובמידות ד, ז: ״כתל התא חמש, והתא שש, כתל ההיכל שש״.\nתוספות (יומא נב.): ״אי נמי נראה לר״י שהמגרעות היו בכל הכתלים בכותל ההיכל ובשלשת כותלי התא וכותל ההיכל היה למטה ו׳ אמות ומחצה וכותל התא ה׳ אמות ומחצה וכשהיה מגרע חצי אמה מכל כותל כדכתיב כי מגרעות נתן לבית סביב נמצא התא התחתונה חמש על חמש והתיכונה שש על שש והשלישית שבע על שבע״; ו״רובד״ — ״לפי שהמגרעת כעין שורה בולטת״.\nבמודל: כותל ההיכל שש וחצי, שש, חמש וחצי; כותל התא החיצון חמש וחצי, חמש, ארבע וחצי; גם המחיצות שבין תא לתא נגרעות חצי אמה מכל צד, והתאים מרובעים — חמש על חמש, שש על שש, שבע על שבע. מרכזי התאים כבשאר השיטות, ולכן המחיצות עבות (בחירת מודל).", "refs": [["תוספות יומא נב.", "Tosafot_on_Yoma.52a"], ["תוספות בבא בתרא סא.", "Tosafot_on_Bava_Batra.61a"], ["מידות ד, ד", "Mishnah_Middot.4.4"]], "title": "כותל ההיכל 6½"},
          "התא 5 על 5": {"info": "לשון המשנה (מידות ד, ד): ״התחתונה, חמש, ורבד שש. והאמצעית, שש, ורבד שבע. והעליונה, שבע״; ובמידות ד, ז: ״כתל התא חמש, והתא שש, כתל ההיכל שש״.\nתוספות (יומא נב.): ״אי נמי נראה לר״י שהמגרעות היו בכל הכתלים בכותל ההיכל ובשלשת כותלי התא וכותל ההיכל היה למטה ו׳ אמות ומחצה וכותל התא ה׳ אמות ומחצה וכשהיה מגרע חצי אמה מכל כותל כדכתיב כי מגרעות נתן לבית סביב נמצא התא התחתונה חמש על חמש והתיכונה שש על שש והשלישית שבע על שבע״; ו״רובד״ — ״לפי שהמגרעת כעין שורה בולטת״.\nבמודל: כותל ההיכל שש וחצי, שש, חמש וחצי; כותל התא החיצון חמש וחצי, חמש, ארבע וחצי; גם המחיצות שבין תא לתא נגרעות חצי אמה מכל צד, והתאים מרובעים — חמש על חמש, שש על שש, שבע על שבע. מרכזי התאים כבשאר השיטות, ולכן המחיצות עבות (בחירת מודל).", "refs": [["תוספות יומא נב.", "Tosafot_on_Yoma.52a"], ["תוספות בבא בתרא סא.", "Tosafot_on_Bava_Batra.61a"], ["מידות ד, ד", "Mishnah_Middot.4.4"]], "title": "התא 5 על 5"},
          "כותל התא 5½": {"info": "לשון המשנה (מידות ד, ד): ״התחתונה, חמש, ורבד שש. והאמצעית, שש, ורבד שבע. והעליונה, שבע״; ובמידות ד, ז: ״כתל התא חמש, והתא שש, כתל ההיכל שש״.\nתוספות (יומא נב.): ״אי נמי נראה לר״י שהמגרעות היו בכל הכתלים בכותל ההיכל ובשלשת כותלי התא וכותל ההיכל היה למטה ו׳ אמות ומחצה וכותל התא ה׳ אמות ומחצה וכשהיה מגרע חצי אמה מכל כותל כדכתיב כי מגרעות נתן לבית סביב נמצא התא התחתונה חמש על חמש והתיכונה שש על שש והשלישית שבע על שבע״; ו״רובד״ — ״לפי שהמגרעת כעין שורה בולטת״.\nבמודל: כותל ההיכל שש וחצי, שש, חמש וחצי; כותל התא החיצון חמש וחצי, חמש, ארבע וחצי; גם המחיצות שבין תא לתא נגרעות חצי אמה מכל צד, והתאים מרובעים — חמש על חמש, שש על שש, שבע על שבע. מרכזי התאים כבשאר השיטות, ולכן המחיצות עבות (בחירת מודל).", "refs": [["תוספות יומא נב.", "Tosafot_on_Yoma.52a"], ["תוספות בבא בתרא סא.", "Tosafot_on_Bava_Batra.61a"], ["מידות ד, ד", "Mishnah_Middot.4.4"]], "title": "כותל התא 5½"},
          "התא 6 על 6": {"info": "לשון המשנה (מידות ד, ד): ״התחתונה, חמש, ורבד שש. והאמצעית, שש, ורבד שבע. והעליונה, שבע״; ובמידות ד, ז: ״כתל התא חמש, והתא שש, כתל ההיכל שש״.\nתוספות (יומא נב.): ״אי נמי נראה לר״י שהמגרעות היו בכל הכתלים בכותל ההיכל ובשלשת כותלי התא וכותל ההיכל היה למטה ו׳ אמות ומחצה וכותל התא ה׳ אמות ומחצה וכשהיה מגרע חצי אמה מכל כותל כדכתיב כי מגרעות נתן לבית סביב נמצא התא התחתונה חמש על חמש והתיכונה שש על שש והשלישית שבע על שבע״; ו״רובד״ — ״לפי שהמגרעת כעין שורה בולטת״.\nבמודל: כותל ההיכל שש וחצי, שש, חמש וחצי; כותל התא החיצון חמש וחצי, חמש, ארבע וחצי; גם המחיצות שבין תא לתא נגרעות חצי אמה מכל צד, והתאים מרובעים — חמש על חמש, שש על שש, שבע על שבע. מרכזי התאים כבשאר השיטות, ולכן המחיצות עבות (בחירת מודל).", "refs": [["תוספות יומא נב.", "Tosafot_on_Yoma.52a"], ["תוספות בבא בתרא סא.", "Tosafot_on_Bava_Batra.61a"], ["מידות ד, ד", "Mishnah_Middot.4.4"]], "title": "התא 6 על 6"},
          "כותל ההיכל 5½": {"info": "לשון המשנה (מידות ד, ד): ״התחתונה, חמש, ורבד שש. והאמצעית, שש, ורבד שבע. והעליונה, שבע״; ובמידות ד, ז: ״כתל התא חמש, והתא שש, כתל ההיכל שש״.\nתוספות (יומא נב.): ״אי נמי נראה לר״י שהמגרעות היו בכל הכתלים בכותל ההיכל ובשלשת כותלי התא וכותל ההיכל היה למטה ו׳ אמות ומחצה וכותל התא ה׳ אמות ומחצה וכשהיה מגרע חצי אמה מכל כותל כדכתיב כי מגרעות נתן לבית סביב נמצא התא התחתונה חמש על חמש והתיכונה שש על שש והשלישית שבע על שבע״; ו״רובד״ — ״לפי שהמגרעת כעין שורה בולטת״.\nבמודל: כותל ההיכל שש וחצי, שש, חמש וחצי; כותל התא החיצון חמש וחצי, חמש, ארבע וחצי; גם המחיצות שבין תא לתא נגרעות חצי אמה מכל צד, והתאים מרובעים — חמש על חמש, שש על שש, שבע על שבע. מרכזי התאים כבשאר השיטות, ולכן המחיצות עבות (בחירת מודל).", "refs": [["תוספות יומא נב.", "Tosafot_on_Yoma.52a"], ["תוספות בבא בתרא סא.", "Tosafot_on_Bava_Batra.61a"], ["מידות ד, ד", "Mishnah_Middot.4.4"]], "title": "כותל ההיכל 5½"},
          "התא 7 על 7": {"info": "לשון המשנה (מידות ד, ד): ״התחתונה, חמש, ורבד שש. והאמצעית, שש, ורבד שבע. והעליונה, שבע״; ובמידות ד, ז: ״כתל התא חמש, והתא שש, כתל ההיכל שש״.\nתוספות (יומא נב.): ״אי נמי נראה לר״י שהמגרעות היו בכל הכתלים בכותל ההיכל ובשלשת כותלי התא וכותל ההיכל היה למטה ו׳ אמות ומחצה וכותל התא ה׳ אמות ומחצה וכשהיה מגרע חצי אמה מכל כותל כדכתיב כי מגרעות נתן לבית סביב נמצא התא התחתונה חמש על חמש והתיכונה שש על שש והשלישית שבע על שבע״; ו״רובד״ — ״לפי שהמגרעת כעין שורה בולטת״.\nבמודל: כותל ההיכל שש וחצי, שש, חמש וחצי; כותל התא החיצון חמש וחצי, חמש, ארבע וחצי; גם המחיצות שבין תא לתא נגרעות חצי אמה מכל צד, והתאים מרובעים — חמש על חמש, שש על שש, שבע על שבע. מרכזי התאים כבשאר השיטות, ולכן המחיצות עבות (בחירת מודל).", "refs": [["תוספות יומא נב.", "Tosafot_on_Yoma.52a"], ["תוספות בבא בתרא סא.", "Tosafot_on_Bava_Batra.61a"], ["מידות ד, ד", "Mishnah_Middot.4.4"]], "title": "התא 7 על 7"},
          "כותל התא 4½": {"info": "לשון המשנה (מידות ד, ד): ״התחתונה, חמש, ורבד שש. והאמצעית, שש, ורבד שבע. והעליונה, שבע״; ובמידות ד, ז: ״כתל התא חמש, והתא שש, כתל ההיכל שש״.\nתוספות (יומא נב.): ״אי נמי נראה לר״י שהמגרעות היו בכל הכתלים בכותל ההיכל ובשלשת כותלי התא וכותל ההיכל היה למטה ו׳ אמות ומחצה וכותל התא ה׳ אמות ומחצה וכשהיה מגרע חצי אמה מכל כותל כדכתיב כי מגרעות נתן לבית סביב נמצא התא התחתונה חמש על חמש והתיכונה שש על שש והשלישית שבע על שבע״; ו״רובד״ — ״לפי שהמגרעת כעין שורה בולטת״.\nבמודל: כותל ההיכל שש וחצי, שש, חמש וחצי; כותל התא החיצון חמש וחצי, חמש, ארבע וחצי; גם המחיצות שבין תא לתא נגרעות חצי אמה מכל צד, והתאים מרובעים — חמש על חמש, שש על שש, שבע על שבע. מרכזי התאים כבשאר השיטות, ולכן המחיצות עבות (בחירת מודל).", "refs": [["תוספות יומא נב.", "Tosafot_on_Yoma.52a"], ["תוספות בבא בתרא סא.", "Tosafot_on_Bava_Batra.61a"], ["מידות ד, ד", "Mishnah_Middot.4.4"]], "title": "כותל התא 4½"},
          "קומה אמצעית — לא מאומת": {"info": "לשון המשנה (מידות ד, ד): ״התחתונה, חמש, ורבד שש. והאמצעית, שש, ורבד שבע. והעליונה, שבע״; ובמידות ד, ז: ״כתל התא חמש, והתא שש, כתל ההיכל שש״.\nתוספות (יומא נב.): ״עוד פר״י דנראה לו דכותל ההיכל שש והתא שש דלמטה לגמרי קא חשיב ואע״ג דכתיב במשכנה דמלכים חמש באמה רחבה של מסכת מדות דבית שני היו חלוקין משל שלמה כמו שהיו חלוקין ממשכנה דיחזקאל דלעתיד״; ובתוספות בבא בתרא (סא.): ״ועוד יש לפרש דבבית שני היתה יציע התחתונה שש והיה חלוק מבית ראשון״.\nבמודל: בקומה התחתונה כותל ההיכל שש, התא שש וכותל התא חמש. בקומות שמעליה כותל ההיכל נגרע אמה בכל קומה, והתאים שבע ושמונה — לא מאומת: ר״י לא פירש אותן.", "refs": [["תוספות יומא נב.", "Tosafot_on_Yoma.52a"], ["תוספות בבא בתרא סא.", "Tosafot_on_Bava_Batra.61a"], ["מידות ד, ז", "Mishnah_Middot.4.7"]], "title": "קומה אמצעית — לא מאומת"},
          "קומה עליונה — לא מאומת": {"info": "לשון המשנה (מידות ד, ד): ״התחתונה, חמש, ורבד שש. והאמצעית, שש, ורבד שבע. והעליונה, שבע״; ובמידות ד, ז: ״כתל התא חמש, והתא שש, כתל ההיכל שש״.\nתוספות (יומא נב.): ״עוד פר״י דנראה לו דכותל ההיכל שש והתא שש דלמטה לגמרי קא חשיב ואע״ג דכתיב במשכנה דמלכים חמש באמה רחבה של מסכת מדות דבית שני היו חלוקין משל שלמה כמו שהיו חלוקין ממשכנה דיחזקאל דלעתיד״; ובתוספות בבא בתרא (סא.): ״ועוד יש לפרש דבבית שני היתה יציע התחתונה שש והיה חלוק מבית ראשון״.\nבמודל: בקומה התחתונה כותל ההיכל שש, התא שש וכותל התא חמש. בקומות שמעליה כותל ההיכל נגרע אמה בכל קומה, והתאים שבע ושמונה — לא מאומת: ר״י לא פירש אותן.", "refs": [["תוספות יומא נב.", "Tosafot_on_Yoma.52a"], ["תוספות בבא בתרא סא.", "Tosafot_on_Bava_Batra.61a"], ["מידות ד, ז", "Mishnah_Middot.4.7"]], "title": "קומה עליונה — לא מאומת"},
          "התא 8": {"info": "לשון המשנה (מידות ד, ד): ״התחתונה, חמש, ורבד שש. והאמצעית, שש, ורבד שבע. והעליונה, שבע״; ובמידות ד, ז: ״כתל התא חמש, והתא שש, כתל ההיכל שש״.\nתוספות (יומא נב.): ״עוד פר״י דנראה לו דכותל ההיכל שש והתא שש דלמטה לגמרי קא חשיב ואע״ג דכתיב במשכנה דמלכים חמש באמה רחבה של מסכת מדות דבית שני היו חלוקין משל שלמה כמו שהיו חלוקין ממשכנה דיחזקאל דלעתיד״; ובתוספות בבא בתרא (סא.): ״ועוד יש לפרש דבבית שני היתה יציע התחתונה שש והיה חלוק מבית ראשון״.\nבמודל: בקומה התחתונה כותל ההיכל שש, התא שש וכותל התא חמש. בקומות שמעליה כותל ההיכל נגרע אמה בכל קומה, והתאים שבע ושמונה — לא מאומת: ר״י לא פירש אותן.", "refs": [["תוספות יומא נב.", "Tosafot_on_Yoma.52a"], ["תוספות בבא בתרא סא.", "Tosafot_on_Bava_Batra.61a"], ["מידות ד, ז", "Mishnah_Middot.4.7"]], "title": "התא 8"},
          "צורת התאים — ר׳ יצחק בר מרדכי": {"info": "לשון המשנה (מידות ד, ד): ״התחתונה, חמש, ורבד שש. והאמצעית, שש, ורבד שבע. והעליונה, שבע״; ובמידות ד, ז: ״כתל התא חמש, והתא שש, כתל ההיכל שש״.\nתוספות (יומא נב.): ״והר׳ יצחק בר מרדכי פי׳ דלא בהיכל היו המגרעות אלא בתא היו והא דתנן רובד שש היינו שורות אבנים עליונים של כותל היציע התחתונה שעליה מונחים ראשי הקורות וכשהיתה אותה שורה רחבה שש נמצאת שהיתה בולטת אמה שעובי כותל התא לא היה אלא ה׳ אמות״, ״לפי שהיו צריכין לכנוס אמה מקום הנחת הקורות לבלתי אחוז בקירות הבית״. ור״י דחה: ״וכשהיה רובד שלמעלה ז׳ נמצא שהיה בולט חוץ לחומה שתי אמות״.\nבמודל: כותל ההיכל שש בכל הקומות; כותל התא חמש, ובכל קומה הוא נכנס אמה פנימה ונוספת אמה מבחוץ; השורה העליונה של הקומה התחתונה רחבה שש, ושל האמצעית שבע, ובולטות החוצה. בשיטה זו הכותל העליון בולט אל תוך המסבה — לא נתבאר בדבריו.", "refs": [["תוספות יומא נב.", "Tosafot_on_Yoma.52a"], ["מידות ד, ד", "Mishnah_Middot.4.4"]], "title": "צורת התאים — ר׳ יצחק בר מרדכי"},
          "השורה העליונה — 6": {"info": "לשון המשנה (מידות ד, ד): ״התחתונה, חמש, ורבד שש. והאמצעית, שש, ורבד שבע. והעליונה, שבע״; ובמידות ד, ז: ״כתל התא חמש, והתא שש, כתל ההיכל שש״.\nתוספות (יומא נב.): ״והר׳ יצחק בר מרדכי פי׳ דלא בהיכל היו המגרעות אלא בתא היו והא דתנן רובד שש היינו שורות אבנים עליונים של כותל היציע התחתונה שעליה מונחים ראשי הקורות וכשהיתה אותה שורה רחבה שש נמצאת שהיתה בולטת אמה שעובי כותל התא לא היה אלא ה׳ אמות״, ״לפי שהיו צריכין לכנוס אמה מקום הנחת הקורות לבלתי אחוז בקירות הבית״. ור״י דחה: ״וכשהיה רובד שלמעלה ז׳ נמצא שהיה בולט חוץ לחומה שתי אמות״.\nבמודל: כותל ההיכל שש בכל הקומות; כותל התא חמש, ובכל קומה הוא נכנס אמה פנימה ונוספת אמה מבחוץ; השורה העליונה של הקומה התחתונה רחבה שש, ושל האמצעית שבע, ובולטות החוצה. בשיטה זו הכותל העליון בולט אל תוך המסבה — לא נתבאר בדבריו.", "refs": [["תוספות יומא נב.", "Tosafot_on_Yoma.52a"], ["מידות ד, ד", "Mishnah_Middot.4.4"]], "title": "השורה העליונה — 6"},
          "השורה העליונה — 7": {"info": "לשון המשנה (מידות ד, ד): ״התחתונה, חמש, ורבד שש. והאמצעית, שש, ורבד שבע. והעליונה, שבע״; ובמידות ד, ז: ״כתל התא חמש, והתא שש, כתל ההיכל שש״.\nתוספות (יומא נב.): ״והר׳ יצחק בר מרדכי פי׳ דלא בהיכל היו המגרעות אלא בתא היו והא דתנן רובד שש היינו שורות אבנים עליונים של כותל היציע התחתונה שעליה מונחים ראשי הקורות וכשהיתה אותה שורה רחבה שש נמצאת שהיתה בולטת אמה שעובי כותל התא לא היה אלא ה׳ אמות״, ״לפי שהיו צריכין לכנוס אמה מקום הנחת הקורות לבלתי אחוז בקירות הבית״. ור״י דחה: ״וכשהיה רובד שלמעלה ז׳ נמצא שהיה בולט חוץ לחומה שתי אמות״.\nבמודל: כותל ההיכל שש בכל הקומות; כותל התא חמש, ובכל קומה הוא נכנס אמה פנימה ונוספת אמה מבחוץ; השורה העליונה של הקומה התחתונה רחבה שש, ושל האמצעית שבע, ובולטות החוצה. בשיטה זו הכותל העליון בולט אל תוך המסבה — לא נתבאר בדבריו.", "refs": [["תוספות יומא נב.", "Tosafot_on_Yoma.52a"], ["מידות ד, ד", "Mishnah_Middot.4.4"]], "title": "השורה העליונה — 7"},
          "צורת התאים — ר׳ יצחק הבחור": {"info": "לשון המשנה (מידות ד, ד): ״התחתונה, חמש, ורבד שש. והאמצעית, שש, ורבד שבע. והעליונה, שבע״; ובמידות ד, ז: ״כתל התא חמש, והתא שש, כתל ההיכל שש״.\nתוספות (יומא נב.): ״ואני שמעתי בשם רבינו יצחק הבחור שלא היה בכותל ההיכל לא מגרעות ולא כניסה ולא בליטה וראשי הקורות היו מונחין מכותל תא לכותל תא שכנגדו ובמקום הנחת הקורות היה כניסה בכותל התא חצי אמה מזה וחצי אמה מזה וכל התאים היו שוים ממזרח למערב שש אמות״... ״וכותל התא חמש אבל מצפון לדרום התחתונה ה׳ והתיכונה ו׳ והשלישית שבע״.\nבמודל: כותל ההיכל שש, התא שש וכותל התא חמש בכל הקומות, כמשנה (ד, ז); המחיצות שבין התאים נגרעות חצי אמה מכל צד בכל תקרה, והקורות מונחות מן המחיצה אל המחיצה; אורך התאים לאורך הכותל — חמש, שש ושבע. דבריו בתאי המערב; בתאי הצפון והדרום — באותה דרך (בחירת מודל).", "refs": [["תוספות יומא נב.", "Tosafot_on_Yoma.52a"], ["מידות ד, ז", "Mishnah_Middot.4.7"]], "title": "צורת התאים — ר׳ יצחק הבחור"},
          "התא 6, אורכו 5": {"info": "לשון המשנה (מידות ד, ד): ״התחתונה, חמש, ורבד שש. והאמצעית, שש, ורבד שבע. והעליונה, שבע״; ובמידות ד, ז: ״כתל התא חמש, והתא שש, כתל ההיכל שש״.\nתוספות (יומא נב.): ״ואני שמעתי בשם רבינו יצחק הבחור שלא היה בכותל ההיכל לא מגרעות ולא כניסה ולא בליטה וראשי הקורות היו מונחין מכותל תא לכותל תא שכנגדו ובמקום הנחת הקורות היה כניסה בכותל התא חצי אמה מזה וחצי אמה מזה וכל התאים היו שוים ממזרח למערב שש אמות״... ״וכותל התא חמש אבל מצפון לדרום התחתונה ה׳ והתיכונה ו׳ והשלישית שבע״.\nבמודל: כותל ההיכל שש, התא שש וכותל התא חמש בכל הקומות, כמשנה (ד, ז); המחיצות שבין התאים נגרעות חצי אמה מכל צד בכל תקרה, והקורות מונחות מן המחיצה אל המחיצה; אורך התאים לאורך הכותל — חמש, שש ושבע. דבריו בתאי המערב; בתאי הצפון והדרום — באותה דרך (בחירת מודל).", "refs": [["תוספות יומא נב.", "Tosafot_on_Yoma.52a"], ["מידות ד, ז", "Mishnah_Middot.4.7"]], "title": "התא 6, אורכו 5"},
          "התא 6, אורכו 6": {"info": "לשון המשנה (מידות ד, ד): ״התחתונה, חמש, ורבד שש. והאמצעית, שש, ורבד שבע. והעליונה, שבע״; ובמידות ד, ז: ״כתל התא חמש, והתא שש, כתל ההיכל שש״.\nתוספות (יומא נב.): ״ואני שמעתי בשם רבינו יצחק הבחור שלא היה בכותל ההיכל לא מגרעות ולא כניסה ולא בליטה וראשי הקורות היו מונחין מכותל תא לכותל תא שכנגדו ובמקום הנחת הקורות היה כניסה בכותל התא חצי אמה מזה וחצי אמה מזה וכל התאים היו שוים ממזרח למערב שש אמות״... ״וכותל התא חמש אבל מצפון לדרום התחתונה ה׳ והתיכונה ו׳ והשלישית שבע״.\nבמודל: כותל ההיכל שש, התא שש וכותל התא חמש בכל הקומות, כמשנה (ד, ז); המחיצות שבין התאים נגרעות חצי אמה מכל צד בכל תקרה, והקורות מונחות מן המחיצה אל המחיצה; אורך התאים לאורך הכותל — חמש, שש ושבע. דבריו בתאי המערב; בתאי הצפון והדרום — באותה דרך (בחירת מודל).", "refs": [["תוספות יומא נב.", "Tosafot_on_Yoma.52a"], ["מידות ד, ז", "Mishnah_Middot.4.7"]], "title": "התא 6, אורכו 6"},
          "התא 6, אורכו 7": {"info": "לשון המשנה (מידות ד, ד): ״התחתונה, חמש, ורבד שש. והאמצעית, שש, ורבד שבע. והעליונה, שבע״; ובמידות ד, ז: ״כתל התא חמש, והתא שש, כתל ההיכל שש״.\nתוספות (יומא נב.): ״ואני שמעתי בשם רבינו יצחק הבחור שלא היה בכותל ההיכל לא מגרעות ולא כניסה ולא בליטה וראשי הקורות היו מונחין מכותל תא לכותל תא שכנגדו ובמקום הנחת הקורות היה כניסה בכותל התא חצי אמה מזה וחצי אמה מזה וכל התאים היו שוים ממזרח למערב שש אמות״... ״וכותל התא חמש אבל מצפון לדרום התחתונה ה׳ והתיכונה ו׳ והשלישית שבע״.\nבמודל: כותל ההיכל שש, התא שש וכותל התא חמש בכל הקומות, כמשנה (ד, ז); המחיצות שבין התאים נגרעות חצי אמה מכל צד בכל תקרה, והקורות מונחות מן המחיצה אל המחיצה; אורך התאים לאורך הכותל — חמש, שש ושבע. דבריו בתאי המערב; בתאי הצפון והדרום — באותה דרך (בחירת מודל).", "refs": [["תוספות יומא נב.", "Tosafot_on_Yoma.52a"], ["מידות ד, ז", "Mishnah_Middot.4.7"]], "title": "התא 6, אורכו 7"},
          "צורת התאים — תוספות רי״ד": {"info": "לשון המשנה (מידות ד, ד): ״התחתונה, חמש, ורבד שש. והאמצעית, שש, ורבד שבע. והעליונה, שבע״; ובמידות ד, ז: ״כתל התא חמש, והתא שש, כתל ההיכל שש״.\nתוספות רי״ד (בבא בתרא סא., בקובץ שיטות קמאי): ״והנכון בעיני לפרש שעובי כותלו של היכל לכל צד היה שש אמות, ולמטה בשיעור גובה התא התחתונה היו בונים בצדו כותל עוביו אמה וסומכין אותו אצל עוביו של כותל ההיכל כדי להניח שם ראשי הקורות של תקרת התא התחתונה״; ״ומש״ה תני והתא שש, האויר שהי׳ ה׳ אמות ואותה האמה שהיתה בנויה בתוכה״; ״ומהתקרה האמצעית ועד תקרת העליונה הי׳ כותלו של היכל חמש״.\nבמודל: כותל ההיכל שש בשתי הקומות התחתונות וחמש בעליונה; בתא התחתון — כותל של אמה צמוד לכותל ההיכל, עד התקרה, ועליו ראשי הקורות; האויר חמש, והתאים שמעליו שש ושבע.", "refs": [["תוספות רי״ד בבא בתרא סא.", "Kovetz_Shitot_Kamai_on_Middot.4.7"], ["מידות ד, ד", "Mishnah_Middot.4.4"], ["מידות ד, ז", "Mishnah_Middot.4.7"]], "title": "צורת התאים — תוספות רי״ד"},
          "כותל של אמה": {"info": "לשון המשנה (מידות ד, ד): ״התחתונה, חמש, ורבד שש. והאמצעית, שש, ורבד שבע. והעליונה, שבע״; ובמידות ד, ז: ״כתל התא חמש, והתא שש, כתל ההיכל שש״.\nתוספות רי״ד (בבא בתרא סא., בקובץ שיטות קמאי): ״והנכון בעיני לפרש שעובי כותלו של היכל לכל צד היה שש אמות, ולמטה בשיעור גובה התא התחתונה היו בונים בצדו כותל עוביו אמה וסומכין אותו אצל עוביו של כותל ההיכל כדי להניח שם ראשי הקורות של תקרת התא התחתונה״; ״ומש״ה תני והתא שש, האויר שהי׳ ה׳ אמות ואותה האמה שהיתה בנויה בתוכה״; ״ומהתקרה האמצעית ועד תקרת העליונה הי׳ כותלו של היכל חמש״.\nבמודל: כותל ההיכל שש בשתי הקומות התחתונות וחמש בעליונה; בתא התחתון — כותל של אמה צמוד לכותל ההיכל, עד התקרה, ועליו ראשי הקורות; האויר חמש, והתאים שמעליו שש ושבע.", "refs": [["תוספות רי״ד בבא בתרא סא.", "Kovetz_Shitot_Kamai_on_Middot.4.7"], ["מידות ד, ד", "Mishnah_Middot.4.4"], ["מידות ד, ז", "Mishnah_Middot.4.7"]], "title": "כותל של אמה"},
          "כנגד האוטם": {"info": "לשון המשנה (מידות ד, ד): ״התחתונה, חמש, ורבד שש. והאמצעית, שש, ורבד שבע. והעליונה, שבע״; ובמידות ד, ז: ״כתל התא חמש, והתא שש, כתל ההיכל שש״.\nהשגות הראב״ד (בית הבחירה ד, ט): ״שבכותל של היכל היה מקצר אמה ונמצא חלל התא שש משש אמות ומעלה ואותן שש אמה שהתא בהן חללו חמש הם היו כנגד אוטם ההיכל שהיו שש אמות וזהו שחשבו רוחב ההיכל כותל התא חמש והתא שש וכותל ההיכל שש והוא למעלה מן האוטם״. ותוספות יום טוב (מידות ד, ג) למד מדבריו ״שדיוטא התחתונה שמן התאים היא כנגד האוטם״.\nבמודל: הקומה התחתונה כנגד האוטם — שש אמות, מרצפת העזרה עד רצפת ההיכל; בה כותל ההיכל שבע והתא חמש; ומשם ולמעלה כותל ההיכל שש והתא שש. התקרה העליונה — על מה היא נשענת, לא נתבאר בדבריו.", "refs": [["השגות הראב״ד בית הבחירה ד, ט", "Raavad_on_Beit_HaBechira.4.9"], ["תוי״ט מידות ד, ג", "Tosafot_Yom_Tov_on_Mishnah_Middot.4.3"], ["מידות ד, ו", "Mishnah_Middot.4.6"], ["מידות ד, ז", "Mishnah_Middot.4.7"]], "title": "כנגד האוטם"},
          "הכותל שעל גבי שער שושן נמוך — הרמב״ם": {"p": "שער שושן"},
          "כל כותל המזרח מעט יותר מעשרים — תפארת ישראל": {"p": "שער שושן"},
          "כותל מזרחי גבוה שש אמות — פסקי תוספות": {"p": "שער שושן"},
          "שש אמות מעל השער — פסקי תוספות לחק נתן": {"p": "שער שושן"},
          "כותל החיל המזרחי כעשר אמות — רבינו שמעיה": {"p": "שער שושן"},
          "״השער התחתון״ — לרמב״ם": {"p": "שער עזרת נשים — המזרחי"},
          "הדוד — ״מבשלין את שלמיהן״": {"p": "לשכת הנזירים"},
          "השיער — ״ומשלחים תחת הדוד״": {"p": "לשכת הנזירים"},
          "תער — ״ומגלחין את שערן״": {"p": "לשכת הנזירים"},
          "בור מים — ארבעים סאה: ״אמה על אמה ברום שלש אמות״": {"p": "לשכת המצורעים"},
          "״שם היו נותנין יין ושמן״": {"p": "לשכת שמנים"},
          "חביות קטנות של יין — ״ואינו ממלא את החביות עד פיהם״": {"p": "לשכת שמנים"},
          "שבע מדות של לח — הין עד רביעית לג": {"p": "לשכת שמנים"},
          "ערמת המלח — ״שם היו נותנים מלח לקרבן״": {"p": "לשכת המלח"},
          "שער השיר — שער קטן למזרח בית המוקד (האפשרות שתפארת ישראל דוחה)": {"info": "תפארת ישראל (שם) מביא ודוחה: ״אבל אי״ל דשער המוקד הוא שער הנשים, ושער השיר היה למזרח משער המוקד, והוא היה השער הקטן דלא חשיב ליה התם. דאין טעם למה יעשו לשער השיר קטן. ובל״ז לא מסתבר שיחדו שער לנשים דרך ביהמו״ק מקום שמצויין שם פרחי כהונה להחם״. והרא״ש (מידות ב, ו): ״שער השיר. שם היו מכניסין כלי השיר כי היה סמוך לבית המטבחים״.\nבמודל: שער השיר — שער קטן למזרח בית המוקד (מקומו — בחירת מודל); שער הנשים — שער בית המוקד שלעזרה.", "refs": [["תפא״י מידות ב, ו", "Yachin_on_Mishnah_Middot.2.6"], ["הרא״ש מידות ב, ו", "Rosh_on_Mishnah_Middot.2.6"], ["מידות ב, ו", "Mishnah_Middot.2.6"]], "title": "שער השיר — שער קטן למזרח בית המוקד (האפשרות שתפארת ישראל דוחה)"},
          "לאבא יוסי בן חנן: שער הנשים — בית המוקד (האפשרות הנדחית)": {"info": "תפארת ישראל (שם) מביא ודוחה: ״אבל אי״ל דשער המוקד הוא שער הנשים, ושער השיר היה למזרח משער המוקד, והוא היה השער הקטן דלא חשיב ליה התם. דאין טעם למה יעשו לשער השיר קטן. ובל״ז לא מסתבר שיחדו שער לנשים דרך ביהמו״ק מקום שמצויין שם פרחי כהונה להחם״. והרא״ש (מידות ב, ו): ״שער השיר. שם היו מכניסין כלי השיר כי היה סמוך לבית המטבחים״.\nבמודל: שער השיר — שער קטן למזרח בית המוקד (מקומו — בחירת מודל); שער הנשים — שער בית המוקד שלעזרה.", "refs": [["תפא״י מידות ב, ו", "Yachin_on_Mishnah_Middot.2.6"], ["הרא״ש מידות ב, ו", "Rosh_on_Mishnah_Middot.2.6"], ["מידות ב, ו", "Mishnah_Middot.2.6"]], "title": "לאבא יוסי בן חנן: שער הנשים — בית המוקד (האפשרות הנדחית)"},
          "בגדי כהונה — כתונת, מכנסים, אבנט ומגבעת": {"p": "לשכת פנחס המלביש"},
          "חביתי כהן גדול — שתים עשרה חלות על מחבת": {"p": "לשכת עושי חביתין"},
          "דוכן הלויים — מעלה של אמה ושלוש מעלות של חצי אמה": {"p": "דוכן הלויים"},
          "בית הטבילה שעל הגג — לכהן גדול ביום הכיפורים": {"p": "לשכת הפרוה"},
          "סדין של בוץ — ״פרסו סדין של בוץ בינו לבין העם״": {"p": "לשכת הפרוה"},
          "בור מים — מדיחין קרבי קדשים": {"p": "לשכת המדיחין"},
          "פתח למסיבה — לגג בית הפרוה": {"p": "לשכת המדיחין"},
          "המוכני — הגלגל של בן קטין": {"p": "הדגמת המוכני — הכיור יורד לבור ועולה"},
          "בערב: הגלגל מסתובב והכיור יורד לבור — ״שלא יהיו מימיו נפסלין בלינה״ (יומא ג, י)": {"p": "הדגמת המוכני — הכיור יורד לבור ועולה"},
          "בלילה: מי הכיור מחוברים במי הבור": {"p": "הדגמת המוכני — הכיור יורד לבור ועולה"},
          "בבוקר: ״קול העץ שעשה בן קטין מוכני לכיור, והן אומרים הגיע עת״ (תמיד א, ד)": {"p": "הדגמת המוכני — הכיור יורד לבור ועולה"},
          "״נטל את המפתח ופתח את הפשפש״": {"p": "פשפשי ההיכל"},
          "״ונכנס להתא, ומהתא להיכל״": {"p": "פשפשי ההיכל"},
          "״הגיע לשער הגדול, העביר את הנגר ואת הפותחות ופתחו״ (תמיד ג, ז)": {"p": "פשפשי ההיכל"},
          "רבי יהודה: ״בתוך עביו של כתל היה מהלך״": {"p": "פשפשי ההיכל"},
          "״עד שנמצא עומד בין שני השערים, ופתח את החיצונות מבפנים ואת הפנימיות מבחוץ״": {"p": "פשפשי ההיכל"},
          "תא — כותל ההיכל": {"info": "לשון המשנה (מידות ד, ג): ״שבצפון ושבדרום, חמשה על גבי חמשה, וחמשה על גביהם. ושבמערב, שלשה על גבי שלשה, ושנים על גביהם״; (ד, ז): ״כתל המסבה חמש, והמסבה שלש, כתל התא חמש, והתא שש, כתל ההיכל שש״.\nפירוש המשניות לרמב״ם (מדות ד, ג): ״כבר אמרנו בתמיד שתא נקראת ההרחקה שיש בין שתי הכתלים, וכשתסתכל בצורת ההיכל שציירנו תמצא בצפון חמשה הרחקות, והם כותל מסבה ומסבה וכותל התא והתא וכותל ההיכל, וכמותם בדרום. לפיכך אמר שעל אלו החמשה הרחקות היו חמשה תאים״; ״אבל כותל המסיבה וכותל התא וכותל ההיכל לא היה כותל סתום, אלא שני כותלים וביניהם הרחקה״. ובמשנה תורה (בית הבחירה ד, י): ״כל אלו המקומות הפנויים שבין הכתלים הם הנקראים תאים״.\nהיציעים — פירוש המשניות (ד, ד): ״הם הגזוזטראות המקיפות להיכל מבחוץ, והיתה גזוזטרא אמצעית יותר רחבה מן התחתונה, והעליונה יותר רחבה מן האמצעית... וכן היה מוקף כל ההיכל מבחוץ לכותל המסבה ג׳ גזוזטראות״; משנה תורה (ד, ט): ״ויציעים היו מקיפין לבית כלו מסביב חוץ לכתל המסבה, ויציע התחתונה חמש ורבד על גבה שש, ויציע אמצעית שש ורבד על גבה שבע, והעליונה שבע״.\nבמודל — כציורי הרמב״ם (מהדורת קאפח, מכתב ידו): בצפון ובדרום שישה כתלים דקים וחמש רצועות, וכל רצועה תא ארוך אחד בכל קומה, בשלוש קומות. במערב שלוש רצועות, שלושה ושלושה, ובקומה העליונה שני תאים, כל אחד חצי מן הרוחב — כציורו. היציעים מחוץ לכותל המסבה, בצפון, במערב ובדרום: הכותל ישר, והיציעים בולטים החוצה — חמש, שש ושבע, וביניהם רובד של שש ושל שבע (בציורו; ובתרגום קאפח: ״עד שאי אפשר לטפס בכותל״). עובי הכתלים הדקים — אמה, המעקה על היציעים, ומקום הפינות — בחירת מודל. המסבה לרמב״ם היא התא התחתון של הרצועה, והתא שיש לו חמשה פתחים היה ״בדיוטא האמצעית... על גבי המסיבה״ (קאפח); איך עלו בה — לא נתבאר, ולכן לא צוירה מדרגה.\nלרש״י, לר״ש ולשאר הראשונים — הכתלים אטומים, והתאים חדרים לאורך הכותל; כל שיטה נבחרת במתג ״צורת התאים״.", "refs": [["פירוש המשניות לרמב״ם מדות ד, ג", "Rambam_Commentary_on_Middot.4.3"], ["פירוש המשניות לרמב״ם מדות ד, ד", "Rambam_Commentary_on_Middot.4.4"], ["רמב״ם בית הבחירה ד, ט", "Mishneh_Torah,_The_Chosen_Temple.4.9"], ["רמב״ם בית הבחירה ד, י", "Mishneh_Torah,_The_Chosen_Temple.4.10"], ["מידות ד, ג", "Mishnah_Middot.4.3"], ["מידות ד, ד", "Mishnah_Middot.4.4"], ["מידות ד, ז", "Mishnah_Middot.4.7"]], "title": "תא — כותל ההיכל"},
          "תא — התא": {"info": "לשון המשנה (מידות ד, ג): ״שבצפון ושבדרום, חמשה על גבי חמשה, וחמשה על גביהם. ושבמערב, שלשה על גבי שלשה, ושנים על גביהם״; (ד, ז): ״כתל המסבה חמש, והמסבה שלש, כתל התא חמש, והתא שש, כתל ההיכל שש״.\nפירוש המשניות לרמב״ם (מדות ד, ג): ״כבר אמרנו בתמיד שתא נקראת ההרחקה שיש בין שתי הכתלים, וכשתסתכל בצורת ההיכל שציירנו תמצא בצפון חמשה הרחקות, והם כותל מסבה ומסבה וכותל התא והתא וכותל ההיכל, וכמותם בדרום. לפיכך אמר שעל אלו החמשה הרחקות היו חמשה תאים״; ״אבל כותל המסיבה וכותל התא וכותל ההיכל לא היה כותל סתום, אלא שני כותלים וביניהם הרחקה״. ובמשנה תורה (בית הבחירה ד, י): ״כל אלו המקומות הפנויים שבין הכתלים הם הנקראים תאים״.\nהיציעים — פירוש המשניות (ד, ד): ״הם הגזוזטראות המקיפות להיכל מבחוץ, והיתה גזוזטרא אמצעית יותר רחבה מן התחתונה, והעליונה יותר רחבה מן האמצעית... וכן היה מוקף כל ההיכל מבחוץ לכותל המסבה ג׳ גזוזטראות״; משנה תורה (ד, ט): ״ויציעים היו מקיפין לבית כלו מסביב חוץ לכתל המסבה, ויציע התחתונה חמש ורבד על גבה שש, ויציע אמצעית שש ורבד על גבה שבע, והעליונה שבע״.\nבמודל — כציורי הרמב״ם (מהדורת קאפח, מכתב ידו): בצפון ובדרום שישה כתלים דקים וחמש רצועות, וכל רצועה תא ארוך אחד בכל קומה, בשלוש קומות. במערב שלוש רצועות, שלושה ושלושה, ובקומה העליונה שני תאים, כל אחד חצי מן הרוחב — כציורו. היציעים מחוץ לכותל המסבה, בצפון, במערב ובדרום: הכותל ישר, והיציעים בולטים החוצה — חמש, שש ושבע, וביניהם רובד של שש ושל שבע (בציורו; ובתרגום קאפח: ״עד שאי אפשר לטפס בכותל״). עובי הכתלים הדקים — אמה, המעקה על היציעים, ומקום הפינות — בחירת מודל. המסבה לרמב״ם היא התא התחתון של הרצועה, והתא שיש לו חמשה פתחים היה ״בדיוטא האמצעית... על גבי המסיבה״ (קאפח); איך עלו בה — לא נתבאר, ולכן לא צוירה מדרגה.\nלרש״י, לר״ש ולשאר הראשונים — הכתלים אטומים, והתאים חדרים לאורך הכותל; כל שיטה נבחרת במתג ״צורת התאים״.", "refs": [["פירוש המשניות לרמב״ם מדות ד, ג", "Rambam_Commentary_on_Middot.4.3"], ["פירוש המשניות לרמב״ם מדות ד, ד", "Rambam_Commentary_on_Middot.4.4"], ["רמב״ם בית הבחירה ד, ט", "Mishneh_Torah,_The_Chosen_Temple.4.9"], ["רמב״ם בית הבחירה ד, י", "Mishneh_Torah,_The_Chosen_Temple.4.10"], ["מידות ד, ג", "Mishnah_Middot.4.3"], ["מידות ד, ד", "Mishnah_Middot.4.4"], ["מידות ד, ז", "Mishnah_Middot.4.7"]], "title": "תא — התא"},
          "תא — כותל התא": {"info": "לשון המשנה (מידות ד, ג): ״שבצפון ושבדרום, חמשה על גבי חמשה, וחמשה על גביהם. ושבמערב, שלשה על גבי שלשה, ושנים על גביהם״; (ד, ז): ״כתל המסבה חמש, והמסבה שלש, כתל התא חמש, והתא שש, כתל ההיכל שש״.\nפירוש המשניות לרמב״ם (מדות ד, ג): ״כבר אמרנו בתמיד שתא נקראת ההרחקה שיש בין שתי הכתלים, וכשתסתכל בצורת ההיכל שציירנו תמצא בצפון חמשה הרחקות, והם כותל מסבה ומסבה וכותל התא והתא וכותל ההיכל, וכמותם בדרום. לפיכך אמר שעל אלו החמשה הרחקות היו חמשה תאים״; ״אבל כותל המסיבה וכותל התא וכותל ההיכל לא היה כותל סתום, אלא שני כותלים וביניהם הרחקה״. ובמשנה תורה (בית הבחירה ד, י): ״כל אלו המקומות הפנויים שבין הכתלים הם הנקראים תאים״.\nהיציעים — פירוש המשניות (ד, ד): ״הם הגזוזטראות המקיפות להיכל מבחוץ, והיתה גזוזטרא אמצעית יותר רחבה מן התחתונה, והעליונה יותר רחבה מן האמצעית... וכן היה מוקף כל ההיכל מבחוץ לכותל המסבה ג׳ גזוזטראות״; משנה תורה (ד, ט): ״ויציעים היו מקיפין לבית כלו מסביב חוץ לכתל המסבה, ויציע התחתונה חמש ורבד על גבה שש, ויציע אמצעית שש ורבד על גבה שבע, והעליונה שבע״.\nבמודל — כציורי הרמב״ם (מהדורת קאפח, מכתב ידו): בצפון ובדרום שישה כתלים דקים וחמש רצועות, וכל רצועה תא ארוך אחד בכל קומה, בשלוש קומות. במערב שלוש רצועות, שלושה ושלושה, ובקומה העליונה שני תאים, כל אחד חצי מן הרוחב — כציורו. היציעים מחוץ לכותל המסבה, בצפון, במערב ובדרום: הכותל ישר, והיציעים בולטים החוצה — חמש, שש ושבע, וביניהם רובד של שש ושל שבע (בציורו; ובתרגום קאפח: ״עד שאי אפשר לטפס בכותל״). עובי הכתלים הדקים — אמה, המעקה על היציעים, ומקום הפינות — בחירת מודל. המסבה לרמב״ם היא התא התחתון של הרצועה, והתא שיש לו חמשה פתחים היה ״בדיוטא האמצעית... על גבי המסיבה״ (קאפח); איך עלו בה — לא נתבאר, ולכן לא צוירה מדרגה.\nלרש״י, לר״ש ולשאר הראשונים — הכתלים אטומים, והתאים חדרים לאורך הכותל; כל שיטה נבחרת במתג ״צורת התאים״.", "refs": [["פירוש המשניות לרמב״ם מדות ד, ג", "Rambam_Commentary_on_Middot.4.3"], ["פירוש המשניות לרמב״ם מדות ד, ד", "Rambam_Commentary_on_Middot.4.4"], ["רמב״ם בית הבחירה ד, ט", "Mishneh_Torah,_The_Chosen_Temple.4.9"], ["רמב״ם בית הבחירה ד, י", "Mishneh_Torah,_The_Chosen_Temple.4.10"], ["מידות ד, ג", "Mishnah_Middot.4.3"], ["מידות ד, ד", "Mishnah_Middot.4.4"], ["מידות ד, ז", "Mishnah_Middot.4.7"]], "title": "תא — כותל התא"},
          "תא — המסבה": {"info": "לשון המשנה (מידות ד, ג): ״שבצפון ושבדרום, חמשה על גבי חמשה, וחמשה על גביהם. ושבמערב, שלשה על גבי שלשה, ושנים על גביהם״; (ד, ז): ״כתל המסבה חמש, והמסבה שלש, כתל התא חמש, והתא שש, כתל ההיכל שש״.\nפירוש המשניות לרמב״ם (מדות ד, ג): ״כבר אמרנו בתמיד שתא נקראת ההרחקה שיש בין שתי הכתלים, וכשתסתכל בצורת ההיכל שציירנו תמצא בצפון חמשה הרחקות, והם כותל מסבה ומסבה וכותל התא והתא וכותל ההיכל, וכמותם בדרום. לפיכך אמר שעל אלו החמשה הרחקות היו חמשה תאים״; ״אבל כותל המסיבה וכותל התא וכותל ההיכל לא היה כותל סתום, אלא שני כותלים וביניהם הרחקה״. ובמשנה תורה (בית הבחירה ד, י): ״כל אלו המקומות הפנויים שבין הכתלים הם הנקראים תאים״.\nהיציעים — פירוש המשניות (ד, ד): ״הם הגזוזטראות המקיפות להיכל מבחוץ, והיתה גזוזטרא אמצעית יותר רחבה מן התחתונה, והעליונה יותר רחבה מן האמצעית... וכן היה מוקף כל ההיכל מבחוץ לכותל המסבה ג׳ גזוזטראות״; משנה תורה (ד, ט): ״ויציעים היו מקיפין לבית כלו מסביב חוץ לכתל המסבה, ויציע התחתונה חמש ורבד על גבה שש, ויציע אמצעית שש ורבד על גבה שבע, והעליונה שבע״.\nבמודל — כציורי הרמב״ם (מהדורת קאפח, מכתב ידו): בצפון ובדרום שישה כתלים דקים וחמש רצועות, וכל רצועה תא ארוך אחד בכל קומה, בשלוש קומות. במערב שלוש רצועות, שלושה ושלושה, ובקומה העליונה שני תאים, כל אחד חצי מן הרוחב — כציורו. היציעים מחוץ לכותל המסבה, בצפון, במערב ובדרום: הכותל ישר, והיציעים בולטים החוצה — חמש, שש ושבע, וביניהם רובד של שש ושל שבע (בציורו; ובתרגום קאפח: ״עד שאי אפשר לטפס בכותל״). עובי הכתלים הדקים — אמה, המעקה על היציעים, ומקום הפינות — בחירת מודל. המסבה לרמב״ם היא התא התחתון של הרצועה, והתא שיש לו חמשה פתחים היה ״בדיוטא האמצעית... על גבי המסיבה״ (קאפח); איך עלו בה — לא נתבאר, ולכן לא צוירה מדרגה.\nלרש״י, לר״ש ולשאר הראשונים — הכתלים אטומים, והתאים חדרים לאורך הכותל; כל שיטה נבחרת במתג ״צורת התאים״.", "refs": [["פירוש המשניות לרמב״ם מדות ד, ג", "Rambam_Commentary_on_Middot.4.3"], ["פירוש המשניות לרמב״ם מדות ד, ד", "Rambam_Commentary_on_Middot.4.4"], ["רמב״ם בית הבחירה ד, ט", "Mishneh_Torah,_The_Chosen_Temple.4.9"], ["רמב״ם בית הבחירה ד, י", "Mishneh_Torah,_The_Chosen_Temple.4.10"], ["מידות ד, ג", "Mishnah_Middot.4.3"], ["מידות ד, ד", "Mishnah_Middot.4.4"], ["מידות ד, ז", "Mishnah_Middot.4.7"]], "title": "תא — המסבה"},
          "תא — כותל המסבה": {"info": "לשון המשנה (מידות ד, ג): ״שבצפון ושבדרום, חמשה על גבי חמשה, וחמשה על גביהם. ושבמערב, שלשה על גבי שלשה, ושנים על גביהם״; (ד, ז): ״כתל המסבה חמש, והמסבה שלש, כתל התא חמש, והתא שש, כתל ההיכל שש״.\nפירוש המשניות לרמב״ם (מדות ד, ג): ״כבר אמרנו בתמיד שתא נקראת ההרחקה שיש בין שתי הכתלים, וכשתסתכל בצורת ההיכל שציירנו תמצא בצפון חמשה הרחקות, והם כותל מסבה ומסבה וכותל התא והתא וכותל ההיכל, וכמותם בדרום. לפיכך אמר שעל אלו החמשה הרחקות היו חמשה תאים״; ״אבל כותל המסיבה וכותל התא וכותל ההיכל לא היה כותל סתום, אלא שני כותלים וביניהם הרחקה״. ובמשנה תורה (בית הבחירה ד, י): ״כל אלו המקומות הפנויים שבין הכתלים הם הנקראים תאים״.\nהיציעים — פירוש המשניות (ד, ד): ״הם הגזוזטראות המקיפות להיכל מבחוץ, והיתה גזוזטרא אמצעית יותר רחבה מן התחתונה, והעליונה יותר רחבה מן האמצעית... וכן היה מוקף כל ההיכל מבחוץ לכותל המסבה ג׳ גזוזטראות״; משנה תורה (ד, ט): ״ויציעים היו מקיפין לבית כלו מסביב חוץ לכתל המסבה, ויציע התחתונה חמש ורבד על גבה שש, ויציע אמצעית שש ורבד על גבה שבע, והעליונה שבע״.\nבמודל — כציורי הרמב״ם (מהדורת קאפח, מכתב ידו): בצפון ובדרום שישה כתלים דקים וחמש רצועות, וכל רצועה תא ארוך אחד בכל קומה, בשלוש קומות. במערב שלוש רצועות, שלושה ושלושה, ובקומה העליונה שני תאים, כל אחד חצי מן הרוחב — כציורו. היציעים מחוץ לכותל המסבה, בצפון, במערב ובדרום: הכותל ישר, והיציעים בולטים החוצה — חמש, שש ושבע, וביניהם רובד של שש ושל שבע (בציורו; ובתרגום קאפח: ״עד שאי אפשר לטפס בכותל״). עובי הכתלים הדקים — אמה, המעקה על היציעים, ומקום הפינות — בחירת מודל. המסבה לרמב״ם היא התא התחתון של הרצועה, והתא שיש לו חמשה פתחים היה ״בדיוטא האמצעית... על גבי המסיבה״ (קאפח); איך עלו בה — לא נתבאר, ולכן לא צוירה מדרגה.\nלרש״י, לר״ש ולשאר הראשונים — הכתלים אטומים, והתאים חדרים לאורך הכותל; כל שיטה נבחרת במתג ״צורת התאים״.", "refs": [["פירוש המשניות לרמב״ם מדות ד, ג", "Rambam_Commentary_on_Middot.4.3"], ["פירוש המשניות לרמב״ם מדות ד, ד", "Rambam_Commentary_on_Middot.4.4"], ["רמב״ם בית הבחירה ד, ט", "Mishneh_Torah,_The_Chosen_Temple.4.9"], ["רמב״ם בית הבחירה ד, י", "Mishneh_Torah,_The_Chosen_Temple.4.10"], ["מידות ד, ג", "Mishnah_Middot.4.3"], ["מידות ד, ד", "Mishnah_Middot.4.4"], ["מידות ד, ז", "Mishnah_Middot.4.7"]], "title": "תא — כותל המסבה"},
          "יציע חמש": {"info": "לשון המשנה (מידות ד, ג): ״שבצפון ושבדרום, חמשה על גבי חמשה, וחמשה על גביהם. ושבמערב, שלשה על גבי שלשה, ושנים על גביהם״; (ד, ז): ״כתל המסבה חמש, והמסבה שלש, כתל התא חמש, והתא שש, כתל ההיכל שש״.\nפירוש המשניות לרמב״ם (מדות ד, ג): ״כבר אמרנו בתמיד שתא נקראת ההרחקה שיש בין שתי הכתלים, וכשתסתכל בצורת ההיכל שציירנו תמצא בצפון חמשה הרחקות, והם כותל מסבה ומסבה וכותל התא והתא וכותל ההיכל, וכמותם בדרום. לפיכך אמר שעל אלו החמשה הרחקות היו חמשה תאים״; ״אבל כותל המסיבה וכותל התא וכותל ההיכל לא היה כותל סתום, אלא שני כותלים וביניהם הרחקה״. ובמשנה תורה (בית הבחירה ד, י): ״כל אלו המקומות הפנויים שבין הכתלים הם הנקראים תאים״.\nהיציעים — פירוש המשניות (ד, ד): ״הם הגזוזטראות המקיפות להיכל מבחוץ, והיתה גזוזטרא אמצעית יותר רחבה מן התחתונה, והעליונה יותר רחבה מן האמצעית... וכן היה מוקף כל ההיכל מבחוץ לכותל המסבה ג׳ גזוזטראות״; משנה תורה (ד, ט): ״ויציעים היו מקיפין לבית כלו מסביב חוץ לכתל המסבה, ויציע התחתונה חמש ורבד על גבה שש, ויציע אמצעית שש ורבד על גבה שבע, והעליונה שבע״.\nבמודל — כציורי הרמב״ם (מהדורת קאפח, מכתב ידו): בצפון ובדרום שישה כתלים דקים וחמש רצועות, וכל רצועה תא ארוך אחד בכל קומה, בשלוש קומות. במערב שלוש רצועות, שלושה ושלושה, ובקומה העליונה שני תאים, כל אחד חצי מן הרוחב — כציורו. היציעים מחוץ לכותל המסבה, בצפון, במערב ובדרום: הכותל ישר, והיציעים בולטים החוצה — חמש, שש ושבע, וביניהם רובד של שש ושל שבע (בציורו; ובתרגום קאפח: ״עד שאי אפשר לטפס בכותל״). עובי הכתלים הדקים — אמה, המעקה על היציעים, ומקום הפינות — בחירת מודל. המסבה לרמב״ם היא התא התחתון של הרצועה, והתא שיש לו חמשה פתחים היה ״בדיוטא האמצעית... על גבי המסיבה״ (קאפח); איך עלו בה — לא נתבאר, ולכן לא צוירה מדרגה.\nלרש״י, לר״ש ולשאר הראשונים — הכתלים אטומים, והתאים חדרים לאורך הכותל; כל שיטה נבחרת במתג ״צורת התאים״.", "refs": [["פירוש המשניות לרמב״ם מדות ד, ג", "Rambam_Commentary_on_Middot.4.3"], ["פירוש המשניות לרמב״ם מדות ד, ד", "Rambam_Commentary_on_Middot.4.4"], ["רמב״ם בית הבחירה ד, ט", "Mishneh_Torah,_The_Chosen_Temple.4.9"], ["רמב״ם בית הבחירה ד, י", "Mishneh_Torah,_The_Chosen_Temple.4.10"], ["מידות ד, ג", "Mishnah_Middot.4.3"], ["מידות ד, ד", "Mishnah_Middot.4.4"], ["מידות ד, ז", "Mishnah_Middot.4.7"]], "title": "יציע חמש"},
          "רובד שש": {"info": "לשון המשנה (מידות ד, ג): ״שבצפון ושבדרום, חמשה על גבי חמשה, וחמשה על גביהם. ושבמערב, שלשה על גבי שלשה, ושנים על גביהם״; (ד, ז): ״כתל המסבה חמש, והמסבה שלש, כתל התא חמש, והתא שש, כתל ההיכל שש״.\nפירוש המשניות לרמב״ם (מדות ד, ג): ״כבר אמרנו בתמיד שתא נקראת ההרחקה שיש בין שתי הכתלים, וכשתסתכל בצורת ההיכל שציירנו תמצא בצפון חמשה הרחקות, והם כותל מסבה ומסבה וכותל התא והתא וכותל ההיכל, וכמותם בדרום. לפיכך אמר שעל אלו החמשה הרחקות היו חמשה תאים״; ״אבל כותל המסיבה וכותל התא וכותל ההיכל לא היה כותל סתום, אלא שני כותלים וביניהם הרחקה״. ובמשנה תורה (בית הבחירה ד, י): ״כל אלו המקומות הפנויים שבין הכתלים הם הנקראים תאים״.\nהיציעים — פירוש המשניות (ד, ד): ״הם הגזוזטראות המקיפות להיכל מבחוץ, והיתה גזוזטרא אמצעית יותר רחבה מן התחתונה, והעליונה יותר רחבה מן האמצעית... וכן היה מוקף כל ההיכל מבחוץ לכותל המסבה ג׳ גזוזטראות״; משנה תורה (ד, ט): ״ויציעים היו מקיפין לבית כלו מסביב חוץ לכתל המסבה, ויציע התחתונה חמש ורבד על גבה שש, ויציע אמצעית שש ורבד על גבה שבע, והעליונה שבע״.\nבמודל — כציורי הרמב״ם (מהדורת קאפח, מכתב ידו): בצפון ובדרום שישה כתלים דקים וחמש רצועות, וכל רצועה תא ארוך אחד בכל קומה, בשלוש קומות. במערב שלוש רצועות, שלושה ושלושה, ובקומה העליונה שני תאים, כל אחד חצי מן הרוחב — כציורו. היציעים מחוץ לכותל המסבה, בצפון, במערב ובדרום: הכותל ישר, והיציעים בולטים החוצה — חמש, שש ושבע, וביניהם רובד של שש ושל שבע (בציורו; ובתרגום קאפח: ״עד שאי אפשר לטפס בכותל״). עובי הכתלים הדקים — אמה, המעקה על היציעים, ומקום הפינות — בחירת מודל. המסבה לרמב״ם היא התא התחתון של הרצועה, והתא שיש לו חמשה פתחים היה ״בדיוטא האמצעית... על גבי המסיבה״ (קאפח); איך עלו בה — לא נתבאר, ולכן לא צוירה מדרגה.\nלרש״י, לר״ש ולשאר הראשונים — הכתלים אטומים, והתאים חדרים לאורך הכותל; כל שיטה נבחרת במתג ״צורת התאים״.", "refs": [["פירוש המשניות לרמב״ם מדות ד, ג", "Rambam_Commentary_on_Middot.4.3"], ["פירוש המשניות לרמב״ם מדות ד, ד", "Rambam_Commentary_on_Middot.4.4"], ["רמב״ם בית הבחירה ד, ט", "Mishneh_Torah,_The_Chosen_Temple.4.9"], ["רמב״ם בית הבחירה ד, י", "Mishneh_Torah,_The_Chosen_Temple.4.10"], ["מידות ד, ג", "Mishnah_Middot.4.3"], ["מידות ד, ד", "Mishnah_Middot.4.4"], ["מידות ד, ז", "Mishnah_Middot.4.7"]], "title": "רובד שש"},
          "יציע שש": {"info": "לשון המשנה (מידות ד, ג): ״שבצפון ושבדרום, חמשה על גבי חמשה, וחמשה על גביהם. ושבמערב, שלשה על גבי שלשה, ושנים על גביהם״; (ד, ז): ״כתל המסבה חמש, והמסבה שלש, כתל התא חמש, והתא שש, כתל ההיכל שש״.\nפירוש המשניות לרמב״ם (מדות ד, ג): ״כבר אמרנו בתמיד שתא נקראת ההרחקה שיש בין שתי הכתלים, וכשתסתכל בצורת ההיכל שציירנו תמצא בצפון חמשה הרחקות, והם כותל מסבה ומסבה וכותל התא והתא וכותל ההיכל, וכמותם בדרום. לפיכך אמר שעל אלו החמשה הרחקות היו חמשה תאים״; ״אבל כותל המסיבה וכותל התא וכותל ההיכל לא היה כותל סתום, אלא שני כותלים וביניהם הרחקה״. ובמשנה תורה (בית הבחירה ד, י): ״כל אלו המקומות הפנויים שבין הכתלים הם הנקראים תאים״.\nהיציעים — פירוש המשניות (ד, ד): ״הם הגזוזטראות המקיפות להיכל מבחוץ, והיתה גזוזטרא אמצעית יותר רחבה מן התחתונה, והעליונה יותר רחבה מן האמצעית... וכן היה מוקף כל ההיכל מבחוץ לכותל המסבה ג׳ גזוזטראות״; משנה תורה (ד, ט): ״ויציעים היו מקיפין לבית כלו מסביב חוץ לכתל המסבה, ויציע התחתונה חמש ורבד על גבה שש, ויציע אמצעית שש ורבד על גבה שבע, והעליונה שבע״.\nבמודל — כציורי הרמב״ם (מהדורת קאפח, מכתב ידו): בצפון ובדרום שישה כתלים דקים וחמש רצועות, וכל רצועה תא ארוך אחד בכל קומה, בשלוש קומות. במערב שלוש רצועות, שלושה ושלושה, ובקומה העליונה שני תאים, כל אחד חצי מן הרוחב — כציורו. היציעים מחוץ לכותל המסבה, בצפון, במערב ובדרום: הכותל ישר, והיציעים בולטים החוצה — חמש, שש ושבע, וביניהם רובד של שש ושל שבע (בציורו; ובתרגום קאפח: ״עד שאי אפשר לטפס בכותל״). עובי הכתלים הדקים — אמה, המעקה על היציעים, ומקום הפינות — בחירת מודל. המסבה לרמב״ם היא התא התחתון של הרצועה, והתא שיש לו חמשה פתחים היה ״בדיוטא האמצעית... על גבי המסיבה״ (קאפח); איך עלו בה — לא נתבאר, ולכן לא צוירה מדרגה.\nלרש״י, לר״ש ולשאר הראשונים — הכתלים אטומים, והתאים חדרים לאורך הכותל; כל שיטה נבחרת במתג ״צורת התאים״.", "refs": [["פירוש המשניות לרמב״ם מדות ד, ג", "Rambam_Commentary_on_Middot.4.3"], ["פירוש המשניות לרמב״ם מדות ד, ד", "Rambam_Commentary_on_Middot.4.4"], ["רמב״ם בית הבחירה ד, ט", "Mishneh_Torah,_The_Chosen_Temple.4.9"], ["רמב״ם בית הבחירה ד, י", "Mishneh_Torah,_The_Chosen_Temple.4.10"], ["מידות ד, ג", "Mishnah_Middot.4.3"], ["מידות ד, ד", "Mishnah_Middot.4.4"], ["מידות ד, ז", "Mishnah_Middot.4.7"]], "title": "יציע שש"},
          "רובד שבע": {"info": "לשון המשנה (מידות ד, ג): ״שבצפון ושבדרום, חמשה על גבי חמשה, וחמשה על גביהם. ושבמערב, שלשה על גבי שלשה, ושנים על גביהם״; (ד, ז): ״כתל המסבה חמש, והמסבה שלש, כתל התא חמש, והתא שש, כתל ההיכל שש״.\nפירוש המשניות לרמב״ם (מדות ד, ג): ״כבר אמרנו בתמיד שתא נקראת ההרחקה שיש בין שתי הכתלים, וכשתסתכל בצורת ההיכל שציירנו תמצא בצפון חמשה הרחקות, והם כותל מסבה ומסבה וכותל התא והתא וכותל ההיכל, וכמותם בדרום. לפיכך אמר שעל אלו החמשה הרחקות היו חמשה תאים״; ״אבל כותל המסיבה וכותל התא וכותל ההיכל לא היה כותל סתום, אלא שני כותלים וביניהם הרחקה״. ובמשנה תורה (בית הבחירה ד, י): ״כל אלו המקומות הפנויים שבין הכתלים הם הנקראים תאים״.\nהיציעים — פירוש המשניות (ד, ד): ״הם הגזוזטראות המקיפות להיכל מבחוץ, והיתה גזוזטרא אמצעית יותר רחבה מן התחתונה, והעליונה יותר רחבה מן האמצעית... וכן היה מוקף כל ההיכל מבחוץ לכותל המסבה ג׳ גזוזטראות״; משנה תורה (ד, ט): ״ויציעים היו מקיפין לבית כלו מסביב חוץ לכתל המסבה, ויציע התחתונה חמש ורבד על גבה שש, ויציע אמצעית שש ורבד על גבה שבע, והעליונה שבע״.\nבמודל — כציורי הרמב״ם (מהדורת קאפח, מכתב ידו): בצפון ובדרום שישה כתלים דקים וחמש רצועות, וכל רצועה תא ארוך אחד בכל קומה, בשלוש קומות. במערב שלוש רצועות, שלושה ושלושה, ובקומה העליונה שני תאים, כל אחד חצי מן הרוחב — כציורו. היציעים מחוץ לכותל המסבה, בצפון, במערב ובדרום: הכותל ישר, והיציעים בולטים החוצה — חמש, שש ושבע, וביניהם רובד של שש ושל שבע (בציורו; ובתרגום קאפח: ״עד שאי אפשר לטפס בכותל״). עובי הכתלים הדקים — אמה, המעקה על היציעים, ומקום הפינות — בחירת מודל. המסבה לרמב״ם היא התא התחתון של הרצועה, והתא שיש לו חמשה פתחים היה ״בדיוטא האמצעית... על גבי המסיבה״ (קאפח); איך עלו בה — לא נתבאר, ולכן לא צוירה מדרגה.\nלרש״י, לר״ש ולשאר הראשונים — הכתלים אטומים, והתאים חדרים לאורך הכותל; כל שיטה נבחרת במתג ״צורת התאים״.", "refs": [["פירוש המשניות לרמב״ם מדות ד, ג", "Rambam_Commentary_on_Middot.4.3"], ["פירוש המשניות לרמב״ם מדות ד, ד", "Rambam_Commentary_on_Middot.4.4"], ["רמב״ם בית הבחירה ד, ט", "Mishneh_Torah,_The_Chosen_Temple.4.9"], ["רמב״ם בית הבחירה ד, י", "Mishneh_Torah,_The_Chosen_Temple.4.10"], ["מידות ד, ג", "Mishnah_Middot.4.3"], ["מידות ד, ד", "Mishnah_Middot.4.4"], ["מידות ד, ז", "Mishnah_Middot.4.7"]], "title": "רובד שבע"},
          "יציע שבע": {"info": "לשון המשנה (מידות ד, ג): ״שבצפון ושבדרום, חמשה על גבי חמשה, וחמשה על גביהם. ושבמערב, שלשה על גבי שלשה, ושנים על גביהם״; (ד, ז): ״כתל המסבה חמש, והמסבה שלש, כתל התא חמש, והתא שש, כתל ההיכל שש״.\nפירוש המשניות לרמב״ם (מדות ד, ג): ״כבר אמרנו בתמיד שתא נקראת ההרחקה שיש בין שתי הכתלים, וכשתסתכל בצורת ההיכל שציירנו תמצא בצפון חמשה הרחקות, והם כותל מסבה ומסבה וכותל התא והתא וכותל ההיכל, וכמותם בדרום. לפיכך אמר שעל אלו החמשה הרחקות היו חמשה תאים״; ״אבל כותל המסיבה וכותל התא וכותל ההיכל לא היה כותל סתום, אלא שני כותלים וביניהם הרחקה״. ובמשנה תורה (בית הבחירה ד, י): ״כל אלו המקומות הפנויים שבין הכתלים הם הנקראים תאים״.\nהיציעים — פירוש המשניות (ד, ד): ״הם הגזוזטראות המקיפות להיכל מבחוץ, והיתה גזוזטרא אמצעית יותר רחבה מן התחתונה, והעליונה יותר רחבה מן האמצעית... וכן היה מוקף כל ההיכל מבחוץ לכותל המסבה ג׳ גזוזטראות״; משנה תורה (ד, ט): ״ויציעים היו מקיפין לבית כלו מסביב חוץ לכתל המסבה, ויציע התחתונה חמש ורבד על גבה שש, ויציע אמצעית שש ורבד על גבה שבע, והעליונה שבע״.\nבמודל — כציורי הרמב״ם (מהדורת קאפח, מכתב ידו): בצפון ובדרום שישה כתלים דקים וחמש רצועות, וכל רצועה תא ארוך אחד בכל קומה, בשלוש קומות. במערב שלוש רצועות, שלושה ושלושה, ובקומה העליונה שני תאים, כל אחד חצי מן הרוחב — כציורו. היציעים מחוץ לכותל המסבה, בצפון, במערב ובדרום: הכותל ישר, והיציעים בולטים החוצה — חמש, שש ושבע, וביניהם רובד של שש ושל שבע (בציורו; ובתרגום קאפח: ״עד שאי אפשר לטפס בכותל״). עובי הכתלים הדקים — אמה, המעקה על היציעים, ומקום הפינות — בחירת מודל. המסבה לרמב״ם היא התא התחתון של הרצועה, והתא שיש לו חמשה פתחים היה ״בדיוטא האמצעית... על גבי המסיבה״ (קאפח); איך עלו בה — לא נתבאר, ולכן לא צוירה מדרגה.\nלרש״י, לר״ש ולשאר הראשונים — הכתלים אטומים, והתאים חדרים לאורך הכותל; כל שיטה נבחרת במתג ״צורת התאים״.", "refs": [["פירוש המשניות לרמב״ם מדות ד, ג", "Rambam_Commentary_on_Middot.4.3"], ["פירוש המשניות לרמב״ם מדות ד, ד", "Rambam_Commentary_on_Middot.4.4"], ["רמב״ם בית הבחירה ד, ט", "Mishneh_Torah,_The_Chosen_Temple.4.9"], ["רמב״ם בית הבחירה ד, י", "Mishneh_Torah,_The_Chosen_Temple.4.10"], ["מידות ד, ג", "Mishnah_Middot.4.3"], ["מידות ד, ד", "Mishnah_Middot.4.4"], ["מידות ד, ז", "Mishnah_Middot.4.7"]], "title": "יציע שבע"},
          "תא — כותל ההיכל 6": {"info": "לשון המשנה (מידות ד, ג): ״שבצפון ושבדרום, חמשה על גבי חמשה, וחמשה על גביהם. ושבמערב, שלשה על גבי שלשה, ושנים על גביהם״; (ד, ז): ״כתל המסבה חמש, והמסבה שלש, כתל התא חמש, והתא שש, כתל ההיכל שש״.\nפירוש המשניות לרמב״ם (מדות ד, ג): ״כבר אמרנו בתמיד שתא נקראת ההרחקה שיש בין שתי הכתלים, וכשתסתכל בצורת ההיכל שציירנו תמצא בצפון חמשה הרחקות, והם כותל מסבה ומסבה וכותל התא והתא וכותל ההיכל, וכמותם בדרום. לפיכך אמר שעל אלו החמשה הרחקות היו חמשה תאים״; ״אבל כותל המסיבה וכותל התא וכותל ההיכל לא היה כותל סתום, אלא שני כותלים וביניהם הרחקה״. ובמשנה תורה (בית הבחירה ד, י): ״כל אלו המקומות הפנויים שבין הכתלים הם הנקראים תאים״.\nהיציעים — פירוש המשניות (ד, ד): ״הם הגזוזטראות המקיפות להיכל מבחוץ, והיתה גזוזטרא אמצעית יותר רחבה מן התחתונה, והעליונה יותר רחבה מן האמצעית... וכן היה מוקף כל ההיכל מבחוץ לכותל המסבה ג׳ גזוזטראות״; משנה תורה (ד, ט): ״ויציעים היו מקיפין לבית כלו מסביב חוץ לכתל המסבה, ויציע התחתונה חמש ורבד על גבה שש, ויציע אמצעית שש ורבד על גבה שבע, והעליונה שבע״.\nבמודל — כציורי הרמב״ם (מהדורת קאפח, מכתב ידו): בצפון ובדרום שישה כתלים דקים וחמש רצועות, וכל רצועה תא ארוך אחד בכל קומה, בשלוש קומות. במערב שלוש רצועות, שלושה ושלושה, ובקומה העליונה שני תאים, כל אחד חצי מן הרוחב — כציורו. היציעים מחוץ לכותל המסבה, בצפון, במערב ובדרום: הכותל ישר, והיציעים בולטים החוצה — חמש, שש ושבע, וביניהם רובד של שש ושל שבע (בציורו; ובתרגום קאפח: ״עד שאי אפשר לטפס בכותל״). עובי הכתלים הדקים — אמה, המעקה על היציעים, ומקום הפינות — בחירת מודל. המסבה לרמב״ם היא התא התחתון של הרצועה, והתא שיש לו חמשה פתחים היה ״בדיוטא האמצעית... על גבי המסיבה״ (קאפח); איך עלו בה — לא נתבאר, ולכן לא צוירה מדרגה.\nלרש״י, לר״ש ולשאר הראשונים — הכתלים אטומים, והתאים חדרים לאורך הכותל; כל שיטה נבחרת במתג ״צורת התאים״.", "refs": [["פירוש המשניות לרמב״ם מדות ד, ג", "Rambam_Commentary_on_Middot.4.3"], ["פירוש המשניות לרמב״ם מדות ד, ד", "Rambam_Commentary_on_Middot.4.4"], ["רמב״ם בית הבחירה ד, ט", "Mishneh_Torah,_The_Chosen_Temple.4.9"], ["רמב״ם בית הבחירה ד, י", "Mishneh_Torah,_The_Chosen_Temple.4.10"], ["מידות ד, ג", "Mishnah_Middot.4.3"], ["מידות ד, ד", "Mishnah_Middot.4.4"], ["מידות ד, ז", "Mishnah_Middot.4.7"]], "title": "תא — כותל ההיכל 6"},
          "תא — התא 6": {"info": "לשון המשנה (מידות ד, ג): ״שבצפון ושבדרום, חמשה על גבי חמשה, וחמשה על גביהם. ושבמערב, שלשה על גבי שלשה, ושנים על גביהם״; (ד, ז): ״כתל המסבה חמש, והמסבה שלש, כתל התא חמש, והתא שש, כתל ההיכל שש״.\nפירוש המשניות לרמב״ם (מדות ד, ג): ״כבר אמרנו בתמיד שתא נקראת ההרחקה שיש בין שתי הכתלים, וכשתסתכל בצורת ההיכל שציירנו תמצא בצפון חמשה הרחקות, והם כותל מסבה ומסבה וכותל התא והתא וכותל ההיכל, וכמותם בדרום. לפיכך אמר שעל אלו החמשה הרחקות היו חמשה תאים״; ״אבל כותל המסיבה וכותל התא וכותל ההיכל לא היה כותל סתום, אלא שני כותלים וביניהם הרחקה״. ובמשנה תורה (בית הבחירה ד, י): ״כל אלו המקומות הפנויים שבין הכתלים הם הנקראים תאים״.\nהיציעים — פירוש המשניות (ד, ד): ״הם הגזוזטראות המקיפות להיכל מבחוץ, והיתה גזוזטרא אמצעית יותר רחבה מן התחתונה, והעליונה יותר רחבה מן האמצעית... וכן היה מוקף כל ההיכל מבחוץ לכותל המסבה ג׳ גזוזטראות״; משנה תורה (ד, ט): ״ויציעים היו מקיפין לבית כלו מסביב חוץ לכתל המסבה, ויציע התחתונה חמש ורבד על גבה שש, ויציע אמצעית שש ורבד על גבה שבע, והעליונה שבע״.\nבמודל — כציורי הרמב״ם (מהדורת קאפח, מכתב ידו): בצפון ובדרום שישה כתלים דקים וחמש רצועות, וכל רצועה תא ארוך אחד בכל קומה, בשלוש קומות. במערב שלוש רצועות, שלושה ושלושה, ובקומה העליונה שני תאים, כל אחד חצי מן הרוחב — כציורו. היציעים מחוץ לכותל המסבה, בצפון, במערב ובדרום: הכותל ישר, והיציעים בולטים החוצה — חמש, שש ושבע, וביניהם רובד של שש ושל שבע (בציורו; ובתרגום קאפח: ״עד שאי אפשר לטפס בכותל״). עובי הכתלים הדקים — אמה, המעקה על היציעים, ומקום הפינות — בחירת מודל. המסבה לרמב״ם היא התא התחתון של הרצועה, והתא שיש לו חמשה פתחים היה ״בדיוטא האמצעית... על גבי המסיבה״ (קאפח); איך עלו בה — לא נתבאר, ולכן לא צוירה מדרגה.\nלרש״י, לר״ש ולשאר הראשונים — הכתלים אטומים, והתאים חדרים לאורך הכותל; כל שיטה נבחרת במתג ״צורת התאים״.", "refs": [["פירוש המשניות לרמב״ם מדות ד, ג", "Rambam_Commentary_on_Middot.4.3"], ["פירוש המשניות לרמב״ם מדות ד, ד", "Rambam_Commentary_on_Middot.4.4"], ["רמב״ם בית הבחירה ד, ט", "Mishneh_Torah,_The_Chosen_Temple.4.9"], ["רמב״ם בית הבחירה ד, י", "Mishneh_Torah,_The_Chosen_Temple.4.10"], ["מידות ד, ג", "Mishnah_Middot.4.3"], ["מידות ד, ד", "Mishnah_Middot.4.4"], ["מידות ד, ז", "Mishnah_Middot.4.7"]], "title": "תא — התא 6"},
          "תא — כותל התא 5": {"info": "לשון המשנה (מידות ד, ג): ״שבצפון ושבדרום, חמשה על גבי חמשה, וחמשה על גביהם. ושבמערב, שלשה על גבי שלשה, ושנים על גביהם״; (ד, ז): ״כתל המסבה חמש, והמסבה שלש, כתל התא חמש, והתא שש, כתל ההיכל שש״.\nפירוש המשניות לרמב״ם (מדות ד, ג): ״כבר אמרנו בתמיד שתא נקראת ההרחקה שיש בין שתי הכתלים, וכשתסתכל בצורת ההיכל שציירנו תמצא בצפון חמשה הרחקות, והם כותל מסבה ומסבה וכותל התא והתא וכותל ההיכל, וכמותם בדרום. לפיכך אמר שעל אלו החמשה הרחקות היו חמשה תאים״; ״אבל כותל המסיבה וכותל התא וכותל ההיכל לא היה כותל סתום, אלא שני כותלים וביניהם הרחקה״. ובמשנה תורה (בית הבחירה ד, י): ״כל אלו המקומות הפנויים שבין הכתלים הם הנקראים תאים״.\nהיציעים — פירוש המשניות (ד, ד): ״הם הגזוזטראות המקיפות להיכל מבחוץ, והיתה גזוזטרא אמצעית יותר רחבה מן התחתונה, והעליונה יותר רחבה מן האמצעית... וכן היה מוקף כל ההיכל מבחוץ לכותל המסבה ג׳ גזוזטראות״; משנה תורה (ד, ט): ״ויציעים היו מקיפין לבית כלו מסביב חוץ לכתל המסבה, ויציע התחתונה חמש ורבד על גבה שש, ויציע אמצעית שש ורבד על גבה שבע, והעליונה שבע״.\nבמודל — כציורי הרמב״ם (מהדורת קאפח, מכתב ידו): בצפון ובדרום שישה כתלים דקים וחמש רצועות, וכל רצועה תא ארוך אחד בכל קומה, בשלוש קומות. במערב שלוש רצועות, שלושה ושלושה, ובקומה העליונה שני תאים, כל אחד חצי מן הרוחב — כציורו. היציעים מחוץ לכותל המסבה, בצפון, במערב ובדרום: הכותל ישר, והיציעים בולטים החוצה — חמש, שש ושבע, וביניהם רובד של שש ושל שבע (בציורו; ובתרגום קאפח: ״עד שאי אפשר לטפס בכותל״). עובי הכתלים הדקים — אמה, המעקה על היציעים, ומקום הפינות — בחירת מודל. המסבה לרמב״ם היא התא התחתון של הרצועה, והתא שיש לו חמשה פתחים היה ״בדיוטא האמצעית... על גבי המסיבה״ (קאפח); איך עלו בה — לא נתבאר, ולכן לא צוירה מדרגה.\nלרש״י, לר״ש ולשאר הראשונים — הכתלים אטומים, והתאים חדרים לאורך הכותל; כל שיטה נבחרת במתג ״צורת התאים״.", "refs": [["פירוש המשניות לרמב״ם מדות ד, ג", "Rambam_Commentary_on_Middot.4.3"], ["פירוש המשניות לרמב״ם מדות ד, ד", "Rambam_Commentary_on_Middot.4.4"], ["רמב״ם בית הבחירה ד, ט", "Mishneh_Torah,_The_Chosen_Temple.4.9"], ["רמב״ם בית הבחירה ד, י", "Mishneh_Torah,_The_Chosen_Temple.4.10"], ["מידות ד, ג", "Mishnah_Middot.4.3"], ["מידות ד, ד", "Mishnah_Middot.4.4"], ["מידות ד, ז", "Mishnah_Middot.4.7"]], "title": "תא — כותל התא 5"},
          "תא — המסבה 3": {"info": "לשון המשנה (מידות ד, ג): ״שבצפון ושבדרום, חמשה על גבי חמשה, וחמשה על גביהם. ושבמערב, שלשה על גבי שלשה, ושנים על גביהם״; (ד, ז): ״כתל המסבה חמש, והמסבה שלש, כתל התא חמש, והתא שש, כתל ההיכל שש״.\nפירוש המשניות לרמב״ם (מדות ד, ג): ״כבר אמרנו בתמיד שתא נקראת ההרחקה שיש בין שתי הכתלים, וכשתסתכל בצורת ההיכל שציירנו תמצא בצפון חמשה הרחקות, והם כותל מסבה ומסבה וכותל התא והתא וכותל ההיכל, וכמותם בדרום. לפיכך אמר שעל אלו החמשה הרחקות היו חמשה תאים״; ״אבל כותל המסיבה וכותל התא וכותל ההיכל לא היה כותל סתום, אלא שני כותלים וביניהם הרחקה״. ובמשנה תורה (בית הבחירה ד, י): ״כל אלו המקומות הפנויים שבין הכתלים הם הנקראים תאים״.\nהיציעים — פירוש המשניות (ד, ד): ״הם הגזוזטראות המקיפות להיכל מבחוץ, והיתה גזוזטרא אמצעית יותר רחבה מן התחתונה, והעליונה יותר רחבה מן האמצעית... וכן היה מוקף כל ההיכל מבחוץ לכותל המסבה ג׳ גזוזטראות״; משנה תורה (ד, ט): ״ויציעים היו מקיפין לבית כלו מסביב חוץ לכתל המסבה, ויציע התחתונה חמש ורבד על גבה שש, ויציע אמצעית שש ורבד על גבה שבע, והעליונה שבע״.\nבמודל — כציורי הרמב״ם (מהדורת קאפח, מכתב ידו): בצפון ובדרום שישה כתלים דקים וחמש רצועות, וכל רצועה תא ארוך אחד בכל קומה, בשלוש קומות. במערב שלוש רצועות, שלושה ושלושה, ובקומה העליונה שני תאים, כל אחד חצי מן הרוחב — כציורו. היציעים מחוץ לכותל המסבה, בצפון, במערב ובדרום: הכותל ישר, והיציעים בולטים החוצה — חמש, שש ושבע, וביניהם רובד של שש ושל שבע (בציורו; ובתרגום קאפח: ״עד שאי אפשר לטפס בכותל״). עובי הכתלים הדקים — אמה, המעקה על היציעים, ומקום הפינות — בחירת מודל. המסבה לרמב״ם היא התא התחתון של הרצועה, והתא שיש לו חמשה פתחים היה ״בדיוטא האמצעית... על גבי המסיבה״ (קאפח); איך עלו בה — לא נתבאר, ולכן לא צוירה מדרגה.\nלרש״י, לר״ש ולשאר הראשונים — הכתלים אטומים, והתאים חדרים לאורך הכותל; כל שיטה נבחרת במתג ״צורת התאים״.", "refs": [["פירוש המשניות לרמב״ם מדות ד, ג", "Rambam_Commentary_on_Middot.4.3"], ["פירוש המשניות לרמב״ם מדות ד, ד", "Rambam_Commentary_on_Middot.4.4"], ["רמב״ם בית הבחירה ד, ט", "Mishneh_Torah,_The_Chosen_Temple.4.9"], ["רמב״ם בית הבחירה ד, י", "Mishneh_Torah,_The_Chosen_Temple.4.10"], ["מידות ד, ג", "Mishnah_Middot.4.3"], ["מידות ד, ד", "Mishnah_Middot.4.4"], ["מידות ד, ז", "Mishnah_Middot.4.7"]], "title": "תא — המסבה 3"},
          "תא — כותל המסבה 5": {"info": "לשון המשנה (מידות ד, ג): ״שבצפון ושבדרום, חמשה על גבי חמשה, וחמשה על גביהם. ושבמערב, שלשה על גבי שלשה, ושנים על גביהם״; (ד, ז): ״כתל המסבה חמש, והמסבה שלש, כתל התא חמש, והתא שש, כתל ההיכל שש״.\nפירוש המשניות לרמב״ם (מדות ד, ג): ״כבר אמרנו בתמיד שתא נקראת ההרחקה שיש בין שתי הכתלים, וכשתסתכל בצורת ההיכל שציירנו תמצא בצפון חמשה הרחקות, והם כותל מסבה ומסבה וכותל התא והתא וכותל ההיכל, וכמותם בדרום. לפיכך אמר שעל אלו החמשה הרחקות היו חמשה תאים״; ״אבל כותל המסיבה וכותל התא וכותל ההיכל לא היה כותל סתום, אלא שני כותלים וביניהם הרחקה״. ובמשנה תורה (בית הבחירה ד, י): ״כל אלו המקומות הפנויים שבין הכתלים הם הנקראים תאים״.\nהיציעים — פירוש המשניות (ד, ד): ״הם הגזוזטראות המקיפות להיכל מבחוץ, והיתה גזוזטרא אמצעית יותר רחבה מן התחתונה, והעליונה יותר רחבה מן האמצעית... וכן היה מוקף כל ההיכל מבחוץ לכותל המסבה ג׳ גזוזטראות״; משנה תורה (ד, ט): ״ויציעים היו מקיפין לבית כלו מסביב חוץ לכתל המסבה, ויציע התחתונה חמש ורבד על גבה שש, ויציע אמצעית שש ורבד על גבה שבע, והעליונה שבע״.\nבמודל — כציורי הרמב״ם (מהדורת קאפח, מכתב ידו): בצפון ובדרום שישה כתלים דקים וחמש רצועות, וכל רצועה תא ארוך אחד בכל קומה, בשלוש קומות. במערב שלוש רצועות, שלושה ושלושה, ובקומה העליונה שני תאים, כל אחד חצי מן הרוחב — כציורו. היציעים מחוץ לכותל המסבה, בצפון, במערב ובדרום: הכותל ישר, והיציעים בולטים החוצה — חמש, שש ושבע, וביניהם רובד של שש ושל שבע (בציורו; ובתרגום קאפח: ״עד שאי אפשר לטפס בכותל״). עובי הכתלים הדקים — אמה, המעקה על היציעים, ומקום הפינות — בחירת מודל. המסבה לרמב״ם היא התא התחתון של הרצועה, והתא שיש לו חמשה פתחים היה ״בדיוטא האמצעית... על גבי המסיבה״ (קאפח); איך עלו בה — לא נתבאר, ולכן לא צוירה מדרגה.\nלרש״י, לר״ש ולשאר הראשונים — הכתלים אטומים, והתאים חדרים לאורך הכותל; כל שיטה נבחרת במתג ״צורת התאים״.", "refs": [["פירוש המשניות לרמב״ם מדות ד, ג", "Rambam_Commentary_on_Middot.4.3"], ["פירוש המשניות לרמב״ם מדות ד, ד", "Rambam_Commentary_on_Middot.4.4"], ["רמב״ם בית הבחירה ד, ט", "Mishneh_Torah,_The_Chosen_Temple.4.9"], ["רמב״ם בית הבחירה ד, י", "Mishneh_Torah,_The_Chosen_Temple.4.10"], ["מידות ד, ג", "Mishnah_Middot.4.3"], ["מידות ד, ד", "Mishnah_Middot.4.4"], ["מידות ד, ז", "Mishnah_Middot.4.7"]], "title": "תא — כותל המסבה 5"},
          "השער הגדול — ארבע דלתות (מידות ד, א)": {"p": "השער הגדול — ארבע הדלתות"},
          "״והפנימיות נפתחות לתוך הבית לכסות אחר הדלתות״ (מידות ד, א)": {"p": "פתיחת השער הגדול — הדגמה"},
          "״החיצונות נפתחות לתוך הפתח לכסות עביו של כתל״ (מידות ד, א)": {"p": "פתיחת השער הגדול — הדגמה"},
          "״מיריחו היו שומעין קול שער הגדול שנפתח״ (תמיד ג, ח)": {"p": "פתיחת השער הגדול — הדגמה"},
          "רבי יהודה: ״עד שנמצא עומד בין שני השערים, ופתח את החיצונות מבפנים״ (מידות ד, ב)": {"p": "פתיחת השער הגדול — הדגמה"},
          "״בתוך הפתח היו עומדות, וכמין אצטרמיטה היו, ונקפלות לאחוריהן״ (מידות ד, א)": {"p": "פתיחת השער הגדול — הדגמה"},
          "״ואת הפנימיות מבחוץ״ — ״אלו שתי אמות ומחצה, ואלו שתי אמות ומחצה״ (מידות ד, א–ב)": {"p": "פתיחת השער הגדול — הדגמה"},
          "כותל האולם — ״עבי כתל האולם חמש אמות״ (רמב״ם בית הבחירה ד, ה)": {"info": "פירוש המשניות לרמב״ם (מדות ד, ז): ״והיה כולו ר״ל כל ההיכל מאה על מאה היו מטין הבנין מעט לצד מערב וכשימשך לצד המזרח מתרחב כדמות האריה שהוא רחב מלפניו וצר מאחוריו כגון זה״ — ובכתב ידו צייר מרובע שצד המערב שלו צר.\nובמשנה תורה (בית הבחירה ד, ה): ״מן הצפון לדרום מאה אמה. עבי כתל האולם חמש אמות. ומכתל אולם עד כתל הקדש עשר אמות״; (ד, ט): ״ויציעים היו מקיפין לבית כלו מסביב חוץ לכתל המסבה... וכן סביב לכתלי האולם מלמטה עד למעלה כך היו אמה אחת חלק ורבד שלש אמות... ורבד העליון היה רחבו ארבע אמות״.\nבמודל — כציורו: כותל האולם, חמש אמות, נמשך לאורך כל הבית בצפון ובדרום, עשר אמות מכותל המסבה, והיציעים עומדים ברווח שביניהם. הבניין מאה במזרח, ומעט צר במערב — תשעים וארבע (״מעט״; הציור שבכתב ידו צר יותר, כרישום). במערב אין כותל כזה, שהאורך מאה נגמר בכותל התא (בית הבחירה ד, ד). הרובדים — לפי הגובה: אמה חלקה ורובד של שלוש, עד הרובד העליון של ארבע; כל רובד בולט אמה. גובה הכתלים כגובה האולם, והרווח פתוח לשמים — בחירות מודל.", "refs": [["פירוש המשניות לרמב״ם מדות ד, ז", "Rambam_Commentary_on_Middot.4.7"], ["רמב״ם בית הבחירה ד, ה", "Mishneh_Torah,_The_Chosen_Temple.4.5"], ["רמב״ם בית הבחירה ד, ט", "Mishneh_Torah,_The_Chosen_Temple.4.9"], ["רמב״ם בית הבחירה ד, ד", "Mishneh_Torah,_The_Chosen_Temple.4.4"]], "title": "כותל האולם — ״עבי כתל האולם חמש אמות״ (רמב״ם בית הבחירה ד, ה)"},
          "הרובדים — ״אמה אחת חלק ורבד שלש אמות״ (רמב״ם ד, ט)": {"info": "פירוש המשניות לרמב״ם (מדות ד, ז): ״והיה כולו ר״ל כל ההיכל מאה על מאה היו מטין הבנין מעט לצד מערב וכשימשך לצד המזרח מתרחב כדמות האריה שהוא רחב מלפניו וצר מאחוריו כגון זה״ — ובכתב ידו צייר מרובע שצד המערב שלו צר.\nובמשנה תורה (בית הבחירה ד, ה): ״מן הצפון לדרום מאה אמה. עבי כתל האולם חמש אמות. ומכתל אולם עד כתל הקדש עשר אמות״; (ד, ט): ״ויציעים היו מקיפין לבית כלו מסביב חוץ לכתל המסבה... וכן סביב לכתלי האולם מלמטה עד למעלה כך היו אמה אחת חלק ורבד שלש אמות... ורבד העליון היה רחבו ארבע אמות״.\nבמודל — כציורו: כותל האולם, חמש אמות, נמשך לאורך כל הבית בצפון ובדרום, עשר אמות מכותל המסבה, והיציעים עומדים ברווח שביניהם. הבניין מאה במזרח, ומעט צר במערב — תשעים וארבע (״מעט״; הציור שבכתב ידו צר יותר, כרישום). במערב אין כותל כזה, שהאורך מאה נגמר בכותל התא (בית הבחירה ד, ד). הרובדים — לפי הגובה: אמה חלקה ורובד של שלוש, עד הרובד העליון של ארבע; כל רובד בולט אמה. גובה הכתלים כגובה האולם, והרווח פתוח לשמים — בחירות מודל.", "refs": [["פירוש המשניות לרמב״ם מדות ד, ז", "Rambam_Commentary_on_Middot.4.7"], ["רמב״ם בית הבחירה ד, ה", "Mishneh_Torah,_The_Chosen_Temple.4.5"], ["רמב״ם בית הבחירה ד, ט", "Mishneh_Torah,_The_Chosen_Temple.4.9"], ["רמב״ם בית הבחירה ד, ד", "Mishneh_Torah,_The_Chosen_Temple.4.4"]], "title": "הרובדים — ״אמה אחת חלק ורבד שלש אמות״ (רמב״ם ד, ט)"},
          "״מטין הבנין מעט לצד מערב״ — מאה במזרח, תשעים וארבע במערב (פירוש המשניות ד, ז)": {"info": "פירוש המשניות לרמב״ם (מדות ד, ז): ״והיה כולו ר״ל כל ההיכל מאה על מאה היו מטין הבנין מעט לצד מערב וכשימשך לצד המזרח מתרחב כדמות האריה שהוא רחב מלפניו וצר מאחוריו כגון זה״ — ובכתב ידו צייר מרובע שצד המערב שלו צר.\nובמשנה תורה (בית הבחירה ד, ה): ״מן הצפון לדרום מאה אמה. עבי כתל האולם חמש אמות. ומכתל אולם עד כתל הקדש עשר אמות״; (ד, ט): ״ויציעים היו מקיפין לבית כלו מסביב חוץ לכתל המסבה... וכן סביב לכתלי האולם מלמטה עד למעלה כך היו אמה אחת חלק ורבד שלש אמות... ורבד העליון היה רחבו ארבע אמות״.\nבמודל — כציורו: כותל האולם, חמש אמות, נמשך לאורך כל הבית בצפון ובדרום, עשר אמות מכותל המסבה, והיציעים עומדים ברווח שביניהם. הבניין מאה במזרח, ומעט צר במערב — תשעים וארבע (״מעט״; הציור שבכתב ידו צר יותר, כרישום). במערב אין כותל כזה, שהאורך מאה נגמר בכותל התא (בית הבחירה ד, ד). הרובדים — לפי הגובה: אמה חלקה ורובד של שלוש, עד הרובד העליון של ארבע; כל רובד בולט אמה. גובה הכתלים כגובה האולם, והרווח פתוח לשמים — בחירות מודל.", "refs": [["פירוש המשניות לרמב״ם מדות ד, ז", "Rambam_Commentary_on_Middot.4.7"], ["רמב״ם בית הבחירה ד, ה", "Mishneh_Torah,_The_Chosen_Temple.4.5"], ["רמב״ם בית הבחירה ד, ט", "Mishneh_Torah,_The_Chosen_Temple.4.9"], ["רמב״ם בית הבחירה ד, ד", "Mishneh_Torah,_The_Chosen_Temple.4.4"]], "title": "״מטין הבנין מעט לצד מערב״ — מאה במזרח, תשעים וארבע במערב (פירוש המשניות ד, ז)"},
          "המסבה — התא התחתון שברצועה זו (פירוש המשניות לרמב״ם)": {"p": "המסיבה"},
          "כבש ליסוד — יוצא מן הכבש הגדול ויורד אל היסוד (רש״י זבחים סב:)": {"p": "כבשים קטנים — רש״י"},
          "הלולין — פתוחים בעלייה לבית קודש הקדשים": {"p": "העלייה והלולין"},
          "העלייה — מעל ההיכל וקודש הקדשים, גובהה ארבעים אמה": {"p": "העלייה והלולין"},
          "המסבה": {"p": "המסיבה"},
          "הפשפש — ״פתח קטן כעין חלון״ (הראב״ד)": {"p": "פשפשי ההיכל"},
          "חור עקום בעובי הכותל (מלאכת שלמה)": {"p": "פשפשי ההיכל"},
          "פתח התא — ״שהיה המנעול מבפנים״": {"p": "פשפשי ההיכל"},
          "שני מנעולים מבחוץ (הרמב״ם)": {"p": "פשפשי ההיכל"},
          "״ואנקליות של ברזל היו קבועין בהם, ושלשה סדרים היו לכל אחד ואחד, שבהם תולין״ (מידות ג, ה)": {"p": "בית המטבחים"},
          "טבלא של שיש וטבעת — עפר הסוטה": {"p": "טבלת השיש — עפר הסוטה"},
          "טבלא של שיש וטבעת — יורדין לשית": {"info": "לשון המשנה (מידות ג, ב): ״ובקרן מערבית דרומית היו שני נקבים, כמין שני חטמין דקין, שהדמים הנתנין על יסוד מערבי ועל יסוד דרומי, יורדין בהן ומתערבין באמה, ויוצאין לנחל קדרון״.\n**הרמב״ם** (בית הבחירה ב, יא): ״ובקרן מערבית דרומית היו שני נקבים כמין שני חטמין דקין. והן הנקראין שיתין שהדמים יורדין בהן ומתערבין באותה הקרן באמה ויוצאין לנחל קדרון״.\nולמטה מהם (מידות ג, ג): ״למטה ברצפה באותה הקרן, מקום היה שם אמה על אמה, וטבלא של שיש, וטבעת היתה קבועה בה, שבו יורדין לשית ומנקין אותו״; והרמב״ם (ב, יב): ״שבו יורדין לשיתין ומנקין אותו״.\nבמודל: שני הנקבים בראש היסוד, בקרן המערבית־דרומית, זה בצד זה; וברצפה שלידה טבלת השיש והטבעת. מקומם המדויק בתוך הקרן, וגודלם — בחירת מודל.", "refs": [["מידות ג, ב", "Mishnah_Middot.3.2"], ["מידות ג, ג", "Mishnah_Middot.3.3"], ["רמב״ם בית הבחירה ב, יא", "Mishneh_Torah,_The_Chosen_Temple.2.11"], ["רמב״ם בית הבחירה ב, יב", "Mishneh_Torah,_The_Chosen_Temple.2.12"]], "title": "טבלא של שיש וטבעת — יורדין לשית"},
          "שלושה רובדין — חריצים בראש הכבש (רב האי גאון)": {"p": "הכבש הגדול"},
          "רצפה משונה מחברותיה (יומא נד.)": {"p": "לשכת העצים"},
          "פשפש בית החליפות — גבוה שמונה": {"v": "ulam"},
          "בין האולם ולמזבח — כנגד המזבח והכבש (ר״י הלבן)": {"p": "בין האולם ולמזבח"},
          "בר שורא — חומה קטנה לפנים מן החומה (רש״י פסחים פו.)": {"p": "בר שורא — חומה קטנה לפנים מן החומה"},
          "פשפש בית החליפות — בקרן זווית, גבוה שמונה": {"p": "פשפשי בית החליפות"},
          "לול קטן אחורי בית הכפורת — גבוה שמונה אמות (זבחים נה:)": {"p": "הלול שאחורי בית הכפורת"},
          "צורת התאים — הרמב״ם (כדברי הראב״ד והתוי״ט)": {"info": "לשון המשנה (מידות ד, ג): ״שבצפון ושבדרום, חמשה על גבי חמשה, וחמשה על גביהם. ושבמערב, שלשה על גבי שלשה, ושנים על גביהם״; (ד, ד): ״התחתונה, חמש, ורבד שש. והאמצעית, שש, ורבד שבע. והעליונה, שבע״; (ד, ז): ״כתל התא חמש, והתא שש, כתל ההיכל שש״.\nהרמב״ם (בית הבחירה ד, י): ״כל אלו המקומות הפנויים שבין הכתלים הם הנקראים תאים״.\nהשגות הראב״ד (בית הבחירה ד, ט): ״שבכותל של היכל היה מקצר אמה ונמצא חלל התא שש משש אמות ומעלה ואותן שש אמה שהתא בהן חללו חמש הם היו כנגד אוטם ההיכל שהיו שש אמות וזהו שחשבו רוחב ההיכל כותל התא חמש והתא שש וכותל ההיכל שש והוא למעלה מן האוטם״.\nתוספות יום טוב (מידות ד, ג): ״מ״מ בענין הזה, שדיוטא התחתונה שמן התאים היא כנגד האוטם, מוכח מתוך פי׳ הרמב״ם, שמפרש בכאן שהתא הזה הוא בדיוטא האמצעית, שגם הוא סובר כן״ — כלומר, בעניין זה הרמב״ם והראב״ד אינם חולקים.\nבמודל (ברירת המחדל): הקומה התחתונה של התאים כנגד האוטם — שש אמות, מרצפת העזרה עד רצפת ההיכל — והקומה השנייה בגובה ההיכל. בקומה התחתונה כותל ההיכל שבע והתא חמש, ומשם ולמעלה כותל ההיכל שש והתא שש, כלשון הראב״ד. התקרה העליונה — על מה היא נשענת, לא נתבאר.", "refs": [["רמב״ם בית הבחירה ד, י", "Mishneh_Torah,_The_Chosen_Temple.4.10"], ["השגות הראב״ד בית הבחירה ד, ט", "Raavad_on_Beit_HaBechira.4.9"], ["תוי״ט מידות ד, ג", "Tosafot_Yom_Tov_on_Mishnah_Middot.4.3"], ["מידות ד, ג", "Mishnah_Middot.4.3"], ["מידות ד, ד", "Mishnah_Middot.4.4"], ["מידות ד, ז", "Mishnah_Middot.4.7"]], "title": "צורת התאים — הרמב״ם (כדברי הראב״ד והתוי״ט)"},
          "בליטה קטנה לקבל דם עולת העוף (רש״י זבחים נד.)": {"v": "mizbeach"},
          "היסוד — כמין בליטת בית קיבול (רש״י שמות כט, יב)": {"v": "mizbeach"},
          "סנהדרי קטנה — על פתח העזרה (סנהדרין יא, ב)": {"p": "שתי הסנהדראות הקטנות"},
          "הסנהדרין הגדולה — שבעים ואחד בשורה אחת, כחצי גורן": {"p": "לשכת הגזית — הסנהדרין"},
          "שלוש שורות של תלמידי חכמים": {"p": "לשכת הגזית — הסנהדרין"},
          "לשכת הדוכן — כנוסה בעזרת הכהנים, רצפתה אמה מעל עזרת ישראל (חזון איש)": {"p": "דוכן הלויים"},
          "הדוכן — בימה ללויים": {"p": "דוכן הלויים"},
          "שלוש מעלות לעזרת הכהנים": {"p": "דוכן הלויים"},
          "מעלה של חצי אמה — הכניסה ממזרח": {"p": "דוכן הלויים"},
          "לשכה — מבחוץ, כציור הרא״ש": {"v": "ezratNashim"},
          "שער לחיל — בכותל המזרחי (הרא״ש)": {"p": "בית המוקד"},
          "שני הנקבים שבקרן היסוד — ״והן הנקראין שיתין״": {"info": "לשון המשנה (מידות ג, ב): ״ובקרן מערבית דרומית היו שני נקבים, כמין שני חטמין דקין, שהדמים הנתנין על יסוד מערבי ועל יסוד דרומי, יורדין בהן ומתערבין באמה, ויוצאין לנחל קדרון״.\n**הרמב״ם** (בית הבחירה ב, יא): ״ובקרן מערבית דרומית היו שני נקבים כמין שני חטמין דקין. והן הנקראין שיתין שהדמים יורדין בהן ומתערבין באותה הקרן באמה ויוצאין לנחל קדרון״.\nולמטה מהם (מידות ג, ג): ״למטה ברצפה באותה הקרן, מקום היה שם אמה על אמה, וטבלא של שיש, וטבעת היתה קבועה בה, שבו יורדין לשית ומנקין אותו״; והרמב״ם (ב, יב): ״שבו יורדין לשיתין ומנקין אותו״.\nבמודל: שני הנקבים בראש היסוד, בקרן המערבית־דרומית, זה בצד זה; וברצפה שלידה טבלת השיש והטבעת. מקומם המדויק בתוך הקרן, וגודלם — בחירת מודל.", "refs": [["מידות ג, ב", "Mishnah_Middot.3.2"], ["מידות ג, ג", "Mishnah_Middot.3.3"], ["רמב״ם בית הבחירה ב, יא", "Mishneh_Torah,_The_Chosen_Temple.2.11"], ["רמב״ם בית הבחירה ב, יב", "Mishneh_Torah,_The_Chosen_Temple.2.12"]], "title": "שני הנקבים שבקרן היסוד — ״והן הנקראין שיתין״"},
          "כבש הפרה — כיפין על גבי כיפין, וכיפה כנגד האוטם (פרה ג, ו)": {"info": "הכבש שמחוץ לשער (פרה ג, ו): ״וכבש היו עושים מהר הבית להר המשחה, כפין על גבי כפין, וכפה כנגד האטם, מפני קבר התהום, שבו כהן השורף את הפרה, ופרה וכל מסעדיה, יוצאין להר המשחה״.\n**ברטנורא** (שם): ״רגלי הכפה שהכפה נשענת עליהם נקראין אטם. ואין רגלי הכפה העליונה כנגד רגלי התחתונה, אלא כנגד הכפה עצמה, דכנגד אטם העליונה עומד חלל התחתונה״; ״מפני קבר התהום — שלא תהיה שם טמאה רצוצה שהיא בוקעת ועולה״.\n**הרמב״ם** (פרה אדומה ג, א): ״וכבש היו עושין מהר הבית להר המשחה ותחתיו בנוי כפין כפין וכפה על כל שני כפין כדי שיהיו שני רגלי הכפה על גג שני כפין שתחתיה. כדי שתהיה תחת הכל חלול מפני קבר התהום״.\nובשקלים (ד, ב): ״כבש פרה, וכבש שעיר המשתלח ולשון שבין קרניו... באין משירי הלשכה״.\nבמודל: הכבש יוצא משער שושן מזרחה, על שתי שורות של כיפין — רגלי הכיפה העליונה מעל חלל התחתונה, וכל כיפה עליונה מעל רגל תחתונה. הוא מצויר לאורך 150 אמה בלבד; הר המשחה אינו מצויר. גובהו, רוחבו, אורכו ומידות הכיפין — בחירת מודל.", "refs": [["פרה ג, ו", "Mishnah_Parah.3.6"], ["ברטנורא פרה ג, ו", "Bartenura_on_Mishnah_Parah.3.6"], ["רמב״ם פרה אדומה ג, א", "Rambam_Parah_Adumah.3.1"], ["שקלים ד, ב", "Mishnah_Shekalim.4.2"], ["מידות א, ג", "Mishnah_Middot.1.3"]], "title": "כבש הפרה — כיפין על גבי כיפין, וכיפה כנגד האוטם (פרה ג, ו)"},
          "אל הר המשחה (אינו מצויר)": {"info": "הכבש שמחוץ לשער (פרה ג, ו): ״וכבש היו עושים מהר הבית להר המשחה, כפין על גבי כפין, וכפה כנגד האטם, מפני קבר התהום, שבו כהן השורף את הפרה, ופרה וכל מסעדיה, יוצאין להר המשחה״.\n**ברטנורא** (שם): ״רגלי הכפה שהכפה נשענת עליהם נקראין אטם. ואין רגלי הכפה העליונה כנגד רגלי התחתונה, אלא כנגד הכפה עצמה, דכנגד אטם העליונה עומד חלל התחתונה״; ״מפני קבר התהום — שלא תהיה שם טמאה רצוצה שהיא בוקעת ועולה״.\n**הרמב״ם** (פרה אדומה ג, א): ״וכבש היו עושין מהר הבית להר המשחה ותחתיו בנוי כפין כפין וכפה על כל שני כפין כדי שיהיו שני רגלי הכפה על גג שני כפין שתחתיה. כדי שתהיה תחת הכל חלול מפני קבר התהום״.\nובשקלים (ד, ב): ״כבש פרה, וכבש שעיר המשתלח ולשון שבין קרניו... באין משירי הלשכה״.\nבמודל: הכבש יוצא משער שושן מזרחה, על שתי שורות של כיפין — רגלי הכיפה העליונה מעל חלל התחתונה, וכל כיפה עליונה מעל רגל תחתונה. הוא מצויר לאורך 150 אמה בלבד; הר המשחה אינו מצויר. גובהו, רוחבו, אורכו ומידות הכיפין — בחירת מודל.", "refs": [["פרה ג, ו", "Mishnah_Parah.3.6"], ["ברטנורא פרה ג, ו", "Bartenura_on_Mishnah_Parah.3.6"], ["רמב״ם פרה אדומה ג, א", "Rambam_Parah_Adumah.3.1"], ["שקלים ד, ב", "Mishnah_Shekalim.4.2"], ["מידות א, ג", "Mishnah_Middot.1.3"]], "title": "אל הר המשחה (אינו מצויר)"},
          "סנהדרי קטנה — על פתח הר הבית (סנהדרין יא, ב; רש״י)": {"p": "שתי הסנהדראות הקטנות"},
          "סנהדרי קטנה — על פתח הר הבית, בשער המזרחי (סנהדרין יא, ב)": {"p": "שתי הסנהדראות הקטנות"},
          "חמש עשרה המעלות — כחצי גורן": {"p": "חמש עשרה המעלות — כחצי גורן"},
          "שתי האמות שבשושן הבירה (כלים יז, ט)": {"p": "שושן הבירה — שתי אמות המידה"},
          "אמה יתרה חצי אצבע — קרן מזרחית צפונית": {"p": "שושן הבירה — שתי אמות המידה"},
          "אמה יתרה אצבע — קרן מזרחית דרומית": {"p": "שושן הבירה — שתי אמות המידה"},
          "שושן הבירה — חדר על גבי השער (רש״י)": {"p": "שושן הבירה — שתי אמות המידה"},
          "פתח לשכת העץ — אל החיל": {"p": "לשכת העץ — לשכת כהן גדול (פרהדרין)"},
          "חצי החול — במערב": {"p": "לשכת הגזית — הסנהדרין"},
          "חצי הקודש — במזרח": {"p": "לשכת הגזית — הסנהדרין"},
          "הנברשת של הילני — כרש״י וברטנורא: מנורה (יומא ג, י)": {"p": "הנברשת והטבלא של הילני"},
          "השמשית של הילני — כרמב״ם (פירוש המשנה, יומא ג, י)": {"p": "הנברשת והטבלא של הילני"},
          "טבלא של זהב — פרשת סוטה (יומא ג, י; תוספתא סוטה ב, א)": {"p": "הנברשת והטבלא של הילני"},
          "שלשה עשר שופרות (שקלים ו, א; ו, ה)": {"p": "שלשה עשר שופרות"},
          "לשכת הכלים — אפשר שבאחד מן התאים (תפארת ישראל, תמיד ג, ד)": {"p": "לשכת הכלים"},
          "לשכת בית האבן — לרש״י ולרמב״ם": {"p": "לשכת בית האבן"},
          "לשכת בית האבן — לתוספות, חוץ לעזרה": {"p": "לשכת בית האבן"},
          "דלת לשכת המצורעים — בחירת מודל": {"p": "לשכת המצורעים"},
          "לשכת בית האבן — לרש״י ולרמב״ם: בקרן המזרחית־צפונית של העזרה": {"p": "לשכת בית האבן"},
          "לשכת חשאים (שקלים ה, ו) — מקומה: בחירת מודל": {"p": "לשכת חשאים"},
          "במשנת תמיד: לשכת הטלאים": {"p": "בית המוקד"},
          "במשנת תמיד: לשכה שהיו עושין בה לחם הפנים": {"p": "בית המוקד"},
          "במשנת תמיד: לשכת בית המוקד": {"p": "בית המוקד"},
          "במשנת תמיד: לשכת החותמות": {"p": "לשכת החותמות — בבית המוקד"},
          "שלחן של שיש — שלחן החלבים": {"p": "שולחן החלבים — שני השולחנות שבמערב הכבש"},
          "שלחן של כסף — לכלי שרת": {"p": "שולחן החלבים — שני השולחנות שבמערב הכבש"},
          "טלאים מבוקרים — ״אין פוחתין מששה״ (ערכין ב, ה)": {"p": "לשכת הטלאים — בבית המוקד"},
          "מדפים מלאים כדי שמן": {"p": "לשכת שמנים"},
          "ערמות העצים — תאנה, אגוז ועץ שמן (תמיד ב, ג)": {"p": "לשכת העצים"},
          "הסורג — מדפי עץ באלכסון, נקבים נקבים (ברטנורא, מידות ב, ג)": {"p": "הסורג"},
          "שלוש עשרה פרצות — שפרצום מלכי יון (מידות ב, ג)": {"p": "הסורג"},
          "מעקות במדרגות — בחירת מודל": {"info": "מעקות הנחושת שבצדי המדרגות העולות מהר הבית אל העזרות אינם נזכרים במשנה ובמפרשיה. הם צוירו כדי שייראו המעלות היטב — בחירת מודל.", "refs": [], "title": "מעקות במדרגות — בחירת מודל"},
          "כאן אין יסוד — רב: ״בבנין״ (זבחים נד.)": {"p": "המזבח"},
          "יסוד בחלקו של יהודה — לוי: ״בדמים״, אין נותנים עליו דם (זבחים נד.)": {"p": "המזבח"},
          "עמודים ננסין": {"p": "בית המטבחים"},
          "ננסין — העמודים הנמוכים": {"p": "בית המטבחים"},
          "אונקליות — ווים של ברזל": {"p": "בית המטבחים"},
          "32 אמה (הבסיס)": {"p": "מידות המזבח — 32, 30, 28, 26, 24, והמזבח הקודם 28 על 28"},
          "30 אמה (מעל היסוד)": {"p": "מידות המזבח — 32, 30, 28, 26, 24, והמזבח הקודם 28 על 28"},
          "28 אמה (מעל הסובב)": {"p": "מידות המזבח — 32, 30, 28, 26, 24, והמזבח הקודם 28 על 28"},
          "26 אמה (בין הקרנות)": {"p": "מידות המזבח — 32, 30, 28, 26, 24, והמזבח הקודם 28 על 28"},
          "24 אמה (מקום המערכה)": {"p": "מידות המזבח — 32, 30, 28, 26, 24, והמזבח הקודם 28 על 28"},
          "28 אמה ו־2 טפחים (מעל הסובב)": {"p": "מידות המזבח — 32, 30, 28, 26, 24, והמזבח הקודם 28 על 28"},
          "26 אמה ו־2 טפחים (בין הקרנות)": {"p": "מידות המזבח — 32, 30, 28, 26, 24, והמזבח הקודם 28 על 28"},
          "24 אמה ו־2 טפחים (מקום המערכה)": {"p": "מידות המזבח — 32, 30, 28, 26, 24, והמזבח הקודם 28 על 28"},
          "30 אמה ו־2 טפחים (מעל היסוד)": {"p": "מידות המזבח — 32, 30, 28, 26, 24, והמזבח הקודם 28 על 28"},
          "28 אמה ו־4 טפחים (מעל הסובב)": {"p": "מידות המזבח — 32, 30, 28, 26, 24, והמזבח הקודם 28 על 28"},
          "26 אמה ו־4 טפחים (בין הקרנות)": {"p": "מידות המזבח — 32, 30, 28, 26, 24, והמזבח הקודם 28 על 28"},
          "24 אמה ו־4 טפחים (מקום המערכה)": {"p": "מידות המזבח — 32, 30, 28, 26, 24, והמזבח הקודם 28 על 28"},
          "28 אמה (הבסיס)": {"p": "מידות המזבח — 32, 30, 28, 26, 24, והמזבח הקודם 28 על 28"},
          "26 אמה (מעל היסוד)": {"p": "מידות המזבח — 32, 30, 28, 26, 24, והמזבח הקודם 28 על 28"},
          "24 אמה (מעל הסובב)": {"p": "מידות המזבח — 32, 30, 28, 26, 24, והמזבח הקודם 28 על 28"},
          "22 אמה (בין הקרנות)": {"p": "מידות המזבח — 32, 30, 28, 26, 24, והמזבח הקודם 28 על 28"},
          "20 אמה (מקום המערכה)": {"p": "מידות המזבח — 32, 30, 28, 26, 24, והמזבח הקודם 28 על 28"},
          "מקום המערכה לראב״ד — האמה שסביב הטבלה, והגזרים בה ממזרח למערב": {"info": "הראב״ד (בהשגות על הרמב״ם, הלכות תמידין ומוספין פרק ב), כפי שמביא המלאכת שלמה (תמיד ב, ב): מדתנן ״עליו״ ולא ״בו״ — ״משמע שהיה שם טבלא מרובעת גבוה אמה והיא כ״ב אמה על כ״ב אמה ואותה אמה היתה השלמת עשר אמות לגובה המזבח והיא נקראת תפוח ע״ש שהיתה גבוהה על כל סביביו ואפשר שהיתה אותה הטבלא קצוצת קרנות כעין עגולה כדי להרחיב מקום המערכה״; וכן ״החלו מעלין באפר ע״ג התפוח״ — מעלים את האפר על גבי הטבלה.\nבמודל: טבלה מאבן המזבח, עשרים ושתיים על עשרים ושתיים וגובה אמה, באמצע גג המזבח, וקרנותיה קצוצות שתי אמות; עליה האפר, והמערכות עומדות עליה (המערכות על הטבלה — בחירת מודל; הראב״ד לא פירש).", "refs": [["תמיד ב, ב", "Mishnah_Tamid.2.2"], ["ברטנורא תמיד ב, ב", "Bartenura_on_Mishnah_Tamid.2.2"]], "title": "מקום המערכה לראב״ד — האמה שסביב הטבלה, והגזרים בה ממזרח למערב"},
          "תנור של מתכת — שתי חלות בבת אחת": {"p": "לשכת עושי לחם הפנים"},
          "שלושה דפוסים של זהב — לבצק, לתנור ולחלה שנרדתה": {"p": "לשכת עושי לחם הפנים"},
          "עשר חלות מוכנות, ושתיים בתנור": {"p": "לשכת עושי לחם הפנים"},
          "עריבה — הלישה (יכין; רבי יהודה: ״כל מעשיהם בפנים״)": {"p": "לשכת עושי לחם הפנים"},
          "אחת עשרה נפות (מנחות ו, ז)": {"p": "לשכת עושי לחם הפנים"},
          "1 · החותמות": {"p": "הממונים שבמקדש"},
          "2 · הנסכים": {"p": "הממונים שבמקדש"},
          "3 · הפיסות": {"p": "הממונים שבמקדש"},
          "4 · הקינין": {"p": "הממונים שבמקדש"},
          "5 · חולי מעיים": {"p": "הממונים שבמקדש"},
          "6 · השיחין": {"p": "הממונים שבמקדש"},
          "7 · הכרוז": {"p": "הממונים שבמקדש"},
          "8 · נעילת שערים": {"p": "הממונים שבמקדש"},
          "9 · הפקיע": {"p": "הממונים שבמקדש"},
          "10 · הצלצל": {"p": "הממונים שבמקדש"},
          "11 · השיר": {"p": "הממונים שבמקדש"},
          "12 · לחם הפנים": {"p": "הממונים שבמקדש"},
          "13 · הקטורת": {"p": "הממונים שבמקדש"},
          "14 · הפרוכות": {"p": "הממונים שבמקדש"},
          "15 · המלבוש": {"p": "הממונים שבמקדש"},
          "יוחנן בן פנחס — על החותמות": {"p": "הממונים שבמקדש"},
          "אחיה — על הנסכים": {"p": "הממונים שבמקדש"},
          "מתתיה בן שמואל — על הפיסות": {"p": "הממונים שבמקדש"},
          "פתחיה (הוא מרדכי) — על הקינין": {"p": "הממונים שבמקדש"},
          "בן אחיה — על חולי מעיים": {"p": "הממונים שבמקדש"},
          "נחוניא — חופר שיחין": {"p": "הממונים שבמקדש"},
          "גביני — כרוז": {"p": "הממונים שבמקדש"},
          "בן גבר — על נעילת שערים": {"p": "הממונים שבמקדש"},
          "בן בבי — על הפקיע": {"p": "הממונים שבמקדש"},
          "בן ארזה — על הצלצל": {"p": "הממונים שבמקדש"},
          "הגרס בן לוי — על השיר": {"p": "הממונים שבמקדש"},
          "בית גרמו — על מעשה לחם הפנים": {"p": "הממונים שבמקדש"},
          "בית אבטינס — על מעשה הקטורת": {"p": "הממונים שבמקדש"},
          "אלעזר — על הפרוכות": {"p": "הממונים שבמקדש"},
          "פנחס — על המלבוש": {"p": "הממונים שבמקדש"},
          "חמישה עשר הממונים — זהב: כהנים · אדום: לויים · כחול: לא נתפרש שבטם": {"p": "הממונים שבמקדש"},
          "עגל": {"p": "לשכת החותמות — בבית המוקד"},
          "זכר": {"p": "לשכת החותמות — בבית המוקד"},
          "גדי": {"p": "לשכת החותמות — בבית המוקד"},
          "חוטא": {"p": "לשכת החותמות — בבית המוקד"},
          "ארבעה חותמות — עגל, זכר, גדי, חוטא (שקלים ה, ג)": {"p": "לשכת החותמות — בבית המוקד"},
          "לשכת החותמות": {"p": "לשכת החותמות — בבית המוקד"},
          "תשעים ושלושה כלי כסף וכלי זהב (תמיד ג, ד)": {"p": "לשכת הכלים"},
          "סל המצות — חלות ורקיקים (במדבר ו, טו)": {"p": "לשכת הנזירים"},
          "חמישה עשר הממונים — זהב: כהנים · אדום: לויים · ירוק: ישראל · כחול: לא נתפרש שבטם": {"p": "הממונים שבמקדש"},
          "הרובד הרביעי — ״מפתח ההיכל ולחוץ״": {"p": "הרובד הרביעי — ביום הכיפורים"},
          "הרובד הרביעי — ״מפתח האולם ולחוץ״": {"p": "הרובד הרביעי — ביום הכיפורים"},
          "הרובד הרביעי של המחתה — ״מירידתו מן הכבש״ (תוספות יום טוב: ״לכאורה״)": {"p": "הרובד הרביעי — ביום הכיפורים"},
          "כן הזהב — דם הפר": {"p": "כני הזהב שבהיכל — ביום הכיפורים"},
          "הכן השני — דם השעיר": {"p": "כני הזהב שבהיכל — ביום הכיפורים"},
          "כן אחד בלבד — רבי יהודה": {"p": "כני הזהב שבהיכל — ביום הכיפורים"},
          "בכל יום — של כסף, ארבעת קבין": {"p": "שלוש המחתות — בכל יום וביום הכיפורים"},
          "בכל יום — של זהב, שלושת קבין": {"p": "שלוש המחתות — בכל יום וביום הכיפורים"},
          "ביום הכיפורים — זהב אדום, ידה ארוכה": {"p": "שלוש המחתות — בכל יום וביום הכיפורים"},
          "לרמב״ם — ״לשכת דיר העצים״": {"p": "לשכת העצים"},
          "״כהנים עולים במזרחו של כבש״": {"p": "עולים במזרח ויורדים במערב — הכבש"},
          "״ויורדין במערבו״": {"p": "עולים במזרח ויורדים במערב — הכבש"},
          "״והיום כהן גדול עולה באמצע ויורד באמצע״ (יומא ד, ה)": {"p": "עולים במזרח ויורדים במערב — הכבש"},
          "״בשעה שהחמה זורחת ניצוצות יוצאין ממנה״ (יומא לז:)": {"p": "ניצוצות הנברשת בזריחת החמה"},
          "ששה ותשעים חלון — ארבעה לכל משמר (רמב״ם כלי המקדש ח, ח–ט)": {"p": "לשכת פנחס המלביש"},
          "1 · אפייה": {"p": "לשכת עושי חביתין"},
          "2 · טיגון במחבת": {"p": "לשכת עושי חביתין"},
          "1 · טיגון במחבת": {"p": "לשכת עושי חביתין"},
          "2 · אפייה": {"p": "לשכת עושי חביתין"},
          "בור מים — ארבעים סאה": {"p": "לשכת המצורעים"},
          "״גובהה של מנורה חמשים אמה״ (סוכה נב:)": {"p": "מנורות של זהב — שמחת בית השואבה"},
          "מזוזה — מכל השערים, רק בשער ניקנור (יומא יא.)": {"p": "שער ניקנור"},
          "״והכרס מדיחין אותה בבית מדיחין כל צרכה״ (תמיד ד, ב)": {"p": "לשכת המדיחין"},
          "״והרובים שומרים שם״ (תמיד א, א)": {"p": "לשכת בית אבטינס — על גבי שער המים"},
          "מזוזה — לשכת פרהדרין, ״שהיה בה בית דירה לכהן גדול״ (יומא י.)": {"p": "לשכת העץ — לשכת כהן גדול (פרהדרין)"},
          "״וקורין לפניו בסדר היום״ (יומא א, ג)": {"p": "לשכת העץ — לשכת כהן גדול (פרהדרין)"},
          "רבי יוסי ברבי יהודה — כנגד כל המזבח, מקירו הצפוני ועד כותל העזרה": {"p": "בית המטבחים"},
          "רבי אלעזר ברבי שמעון מוסיף — בין האולם ולמזבח": {"p": "בית המטבחים"},
          "רבי מוסיף — מקום דריסת רגלי הכהנים ומקום דריסת רגלי ישראל": {"p": "בית המטבחים"},
          "״מן החליפות ולפנים — הכל מודים שפסול״ (יומא לו.)": {"p": "בית המטבחים"},
          "הגבול הדרומי לרש״י — אמצע העזרה (״מחצי פתח ההיכל ולצפון״)": {"p": "בית המטבחים"},
          "הגבול הדרומי לרמב״ם — קו כותל המזבח (בית הבחירה ה, טו–טז)": {"p": "בית המטבחים"},
          "חלקו של יהודה — מקום דריסת רגלי הכהנים, עזרת ישראל ועזרת הנשים (רש״י יומא יב.)": {"p": "חלקי יהודה ובנימין — הרצועה שבדרום המזבח"},
          "חלקו של בנימין — המזבח, האולם, ההיכל ובית קדשי הקדשים": {"p": "חלקי יהודה ובנימין — הרצועה שבדרום המזבח"},
          "הרצועה — מחלקו של יהודה, בדרום המזבח ועד כותל העזרה (עד היכן — בחירת מודל)": {"p": "חלקי יהודה ובנימין — הרצועה שבדרום המזבח"},
          "״מזבח אוכל בחלקו של יהודה אמה״ — במזרח ובדרום; לכן אין יסוד בקרן דרומית מזרחית (זבחים נג:)": {"p": "חלקי יהודה ובנימין — הרצועה שבדרום המזבח"},
          "הר הבית — צדו המזרחי בחלקו של יהודה (רש״י יומא יב.)": {"p": "חלקי יהודה ובנימין — הרצועה שבדרום המזבח"},
          "לשכת בית האבן — לרש״י ולרמב״ם: בקרן המזרחית־צפונית. במודל: עלייה על בניין שלוש הלשכות (בחירת מודל)": {"p": "לשכת בית האבן"},
          "קרן הטבלה קצוצה — ״ואפשר שהיתה אותה הטבלא קצוצת קרנות... כדי להרויח מקום המערכה״ (ראב״ד)": {"info": "הראב״ד (בהשגות על הרמב״ם, הלכות תמידין ומוספין פרק ב), כפי שמביא המלאכת שלמה (תמיד ב, ב): מדתנן ״עליו״ ולא ״בו״ — ״משמע שהיה שם טבלא מרובעת גבוה אמה והיא כ״ב אמה על כ״ב אמה ואותה אמה היתה השלמת עשר אמות לגובה המזבח והיא נקראת תפוח ע״ש שהיתה גבוהה על כל סביביו ואפשר שהיתה אותה הטבלא קצוצת קרנות כעין עגולה כדי להרחיב מקום המערכה״; וכן ״החלו מעלין באפר ע״ג התפוח״ — מעלים את האפר על גבי הטבלה.\nבמודל: טבלה מאבן המזבח, עשרים ושתיים על עשרים ושתיים וגובה אמה, באמצע גג המזבח, וקרנותיה קצוצות שתי אמות; עליה האפר, והמערכות עומדות עליה (המערכות על הטבלה — בחירת מודל; הראב״ד לא פירש).", "refs": [["תמיד ב, ב", "Mishnah_Tamid.2.2"], ["ברטנורא תמיד ב, ב", "Bartenura_on_Mishnah_Tamid.2.2"]], "title": "קרן הטבלה קצוצה — ״ואפשר שהיתה אותה הטבלא קצוצת קרנות... כדי להרויח מקום המערכה״ (ראב״ד)"},
          "״וכולו היה מקורה, סטיו לפנים מסטיו״ (רמב״ם) — כל הר הבית, כלחם שמים": {"info": "הגמרא (פסחים יג:): ״אמר רחבא אמר רבי יהודה: הר הבית סטיו כפול היה. תניא נמי הכי: הר הבית סטיו כפול היה. רבי יהודה אומר: איסטוונית היתה נקראת — סטיו לפנים מסטיו״.\nהרמב״ם (בית הבחירה ה, א): ״הר הבית והוא הר המוריה היה חמש מאות אמה על חמש מאות אמה והיה מקף חומה... וכלו היה מקרה סטיו לפנים מסטיו״.\n**לחם שמים** (מידות ב, א), על דברי התוספות יום טוב: ״שגה ברואה... דהאמרינן עלה: הר הבית סטיו לפנים מסתיו היה. א״כ כולו עשוי אצטבאות, ממילא כולו מקורה. וכן משמע מההיא דתנן בתענית פ״ג, שירדו כל ישראל מירושלים להר הבית מפני הגשמים; ואין סברא שהצדדין יחזיקו כל ישראל... ותו, הרמב״ם נפק לאפיה, דבהדיא כתב בפ״ה מה״ל בית הבחירה שכולו מקורה היה. והוא האמת״.\n**תפארת ישראל** (בועז, מידות ב, א): מדברי הרמב״ם ״לכאורה משמע... שכל הת״ק על ת״ק אמה מקורה היה, נמצא שכל העזרות של נשים וישראל וכהנים היה מקורין. וכן הבין הש״ג״ (שלטי הגיבורים), והוסיף ״חוץ ממזבח הנחושת שעמד תחת לב השמים״. ודחה זאת: ״דהרי אפי׳ הד׳ לשכות שבעזרת נשים לא היו מקורות [כמדות פ״ב מ״ה], וכ״ש העזרה שחוצה לה... א״כ למה הוצרכו אכסדראות תחת הקרוי בגובה כותלי העזרה סביב [כתמיד פ״א מ״ג]. וכן משמע מרש״י... דרק הר הבית שמחוץ לחומה הפנימית מקורה היה״.\nבמודל: קירוי על כל שטח הר הבית שמחוץ לחומת העזרות — ״דכל הר הבית מחוץ לחומה הפנימית מקורה היה״, ואף מעלות החיל: ״וכולו מחופה בגג״ (תפארת ישראל, צורת בית המקדש, סימן ח). העמודים עומדים טבעת לפנים מטבעת — ״סטיו לפנים מסטיו״ — עד הסורג, ומעל החיל הקירוי נשען על כותל העזרות. העזרות עצמן אינן מקורות, כדברי התפארת ישראל. הקירוי מצויר שקוף למחצה רק כדי שייראה ההר שתחתיו. גובהו, ומספר העמודים ומקומם — בחירת מודל.", "refs": [["פסחים יג:", {"book": 106, "index": 388}], ["רמב״ם בית הבחירה ה, א", {"book": 337, "index": 76}], ["תוי״ט מידות ב, א", {"book": 948, "index": 64}], ["מלאכת שלמה מידות ב, א", {"book": 1210, "index": 50}], ["לחם שמים מידות ב, א", {"book": 1145, "index": 35}], ["בועז מידות ב, א", {"book": 1329, "index": 9}]], "title": "״וכולו היה מקורה, סטיו לפנים מסטיו״ (רמב״ם) — כל הר הבית, כלחם שמים"},
          "״ומנורות של זהב היו שם, וארבעה ספלים של זהב בראשיהן״ (סוכה ה, ב)": {"p": "מנורות של זהב — שמחת בית השואבה"},
          "לשכת הטלאים": {"p": "לשכת הטלאים — בבית המוקד"},
          "לשכת בית המוקד": {"p": "בית המוקד"},
          "כבש לסובב — לתוספות": {"p": "כבשים קטנים — תוספות"},
          "לשכת כלי השיר (מידות ב, ו)": {"p": "לשכות כלי השיר — תחת עזרת ישראל"},
          "1 · בכל יום — של כסף, ארבעת קבין": {"p": "שלוש המחתות — בכל יום וביום הכיפורים"},
          "2 · בכל יום — של זהב, שלושת קבין": {"p": "שלוש המחתות — בכל יום וביום הכיפורים"},
          "3 · ביום הכיפורים — זהב אדום, ידה ארוכה": {"p": "שלוש המחתות — בכל יום וביום הכיפורים"},
          "1": {"p": "שלוש המחתות — בכל יום וביום הכיפורים"},
          "2": {"p": "שלוש המחתות — בכל יום וביום הכיפורים"},
          "3": {"p": "שלוש המחתות — בכל יום וביום הכיפורים"},
          "המוכני לרמב״ם — כלי סביב הכיור, ובו המים (בית הבחירה ג, יח)": {"p": "הכיור"},
          "צורת התאים — ר״י, פירוש ראשון": {"info": "לשון המשנה (מידות ד, ד): ״התחתונה, חמש, ורבד שש. והאמצעית, שש, ורבד שבע. והעליונה, שבע״; ובמידות ד, ז: ״כתל התא חמש, והתא שש, כתל ההיכל שש״.\nתוספות (יומא נב.): ״אלא עשו את חומת ההיכל במערב למטה שבעה אמות והוצרכו לגרוע ממנה אמה כנגד תקרת התא האמצעי להניח ראשי הקורות על אותה כניסה ושוב הוצרכו לגרוע עוד אמה כנגד תקרת תא השלישי לפיכך התחתונה חמש באמה רחבה והתיכונה ו׳ באמה רחבה והג׳ ז׳ באמה רחבה״; והמשנה (ד, ז) ״כנגד התיכונה קא חשיב דהוי התם כותל ההיכל ו׳ והתא ו׳״. וכן בתוספות בבא בתרא (סא.), וכן היד רמ״ה (בבא בתרא סא., בקובץ שיטות קמאי): ״והוה ליה כותל ההיכל כנגדה שבע אמות״.\nבמודל: כותל ההיכל שבע, שש וחמש; התאים חמש, שש ושבע; כותל התא חמש; ראשי הקורות מונחים על המגרעות שבכותל ההיכל.", "refs": [["תוספות יומא נב.", "Tosafot_on_Yoma.52a"], ["תוספות בבא בתרא סא.", "Tosafot_on_Bava_Batra.61a"], ["יד רמ״ה בבא בתרא סא.", "Kovetz_Shitot_Kamai_on_Middot.4.4"], ["מידות ד, ד", "Mishnah_Middot.4.4"], ["מידות ד, ז", "Mishnah_Middot.4.7"]], "title": "צורת התאים — ר״י, פירוש ראשון"},
          "צורת התאים — ר״י, פירוש שני": {"info": "לשון המשנה (מידות ד, ד): ״התחתונה, חמש, ורבד שש. והאמצעית, שש, ורבד שבע. והעליונה, שבע״; ובמידות ד, ז: ״כתל התא חמש, והתא שש, כתל ההיכל שש״.\nתוספות (יומא נב.): ״אי נמי נראה לר״י שהמגרעות היו בכל הכתלים בכותל ההיכל ובשלשת כותלי התא וכותל ההיכל היה למטה ו׳ אמות ומחצה וכותל התא ה׳ אמות ומחצה וכשהיה מגרע חצי אמה מכל כותל כדכתיב כי מגרעות נתן לבית סביב נמצא התא התחתונה חמש על חמש והתיכונה שש על שש והשלישית שבע על שבע״; ו״רובד״ — ״לפי שהמגרעת כעין שורה בולטת״.\nבמודל: כותל ההיכל שש וחצי, שש, חמש וחצי; כותל התא החיצון חמש וחצי, חמש, ארבע וחצי; גם המחיצות שבין תא לתא נגרעות חצי אמה מכל צד, והתאים מרובעים — חמש על חמש, שש על שש, שבע על שבע. מרכזי התאים כבשאר השיטות, ולכן המחיצות עבות (בחירת מודל).", "refs": [["תוספות יומא נב.", "Tosafot_on_Yoma.52a"], ["תוספות בבא בתרא סא.", "Tosafot_on_Bava_Batra.61a"], ["מידות ד, ד", "Mishnah_Middot.4.4"]], "title": "צורת התאים — ר״י, פירוש שני"},
          "צורת התאים — ר״י, פירוש שלישי": {"info": "לשון המשנה (מידות ד, ד): ״התחתונה, חמש, ורבד שש. והאמצעית, שש, ורבד שבע. והעליונה, שבע״; ובמידות ד, ז: ״כתל התא חמש, והתא שש, כתל ההיכל שש״.\nתוספות (יומא נב.): ״עוד פר״י דנראה לו דכותל ההיכל שש והתא שש דלמטה לגמרי קא חשיב ואע״ג דכתיב במשכנה דמלכים חמש באמה רחבה של מסכת מדות דבית שני היו חלוקין משל שלמה כמו שהיו חלוקין ממשכנה דיחזקאל דלעתיד״; ובתוספות בבא בתרא (סא.): ״ועוד יש לפרש דבבית שני היתה יציע התחתונה שש והיה חלוק מבית ראשון״.\nבמודל: בקומה התחתונה כותל ההיכל שש, התא שש וכותל התא חמש. בקומות שמעליה כותל ההיכל נגרע אמה בכל קומה, והתאים שבע ושמונה — לא מאומת: ר״י לא פירש אותן.", "refs": [["תוספות יומא נב.", "Tosafot_on_Yoma.52a"], ["תוספות בבא בתרא סא.", "Tosafot_on_Bava_Batra.61a"], ["מידות ד, ז", "Mishnah_Middot.4.7"]], "title": "צורת התאים — ר״י, פירוש שלישי"},
          "3 · הפייסות": {"p": "הממונים שבמקדש"},
          "1 · יוחנן בן פנחס — החותמות": {"p": "הממונים שבמקדש"},
          "2 · אחיה — הנסכים": {"p": "הממונים שבמקדש"},
          "3 · מתתיה בן שמואל — הפייסות": {"p": "הממונים שבמקדש"},
          "4 · פתחיה — הקינין": {"p": "הממונים שבמקדש"},
          "5 · בן אחיה — חולי מעיים": {"p": "הממונים שבמקדש"},
          "6 · נחוניא — השיחין": {"p": "הממונים שבמקדש"},
          "7 · גביני — הכרוז": {"p": "הממונים שבמקדש"},
          "8 · בן גבר — נעילת שערים": {"p": "הממונים שבמקדש"},
          "9 · בן בבי — הפקיע": {"p": "הממונים שבמקדש"},
          "10 · בן ארזה — הצלצל": {"p": "הממונים שבמקדש"},
          "11 · הגרס בן לוי — השיר": {"p": "הממונים שבמקדש"},
          "12 · בית גרמו — לחם הפנים": {"p": "הממונים שבמקדש"},
          "13 · בית אבטינס — הקטורת": {"p": "הממונים שבמקדש"},
          "14 · אלעזר — הפרוכות": {"p": "הממונים שבמקדש"},
          "15 · פנחס — המלבוש": {"p": "הממונים שבמקדש"},
          "צורת התאים — הרמב״ם, כציורו": {"info": "לשון המשנה (מידות ד, ג): ״שבצפון ושבדרום, חמשה על גבי חמשה, וחמשה על גביהם. ושבמערב, שלשה על גבי שלשה, ושנים על גביהם״; (ד, ד): ״התחתונה, חמש, ורבד שש. והאמצעית, שש, ורבד שבע. והעליונה, שבע״; (ד, ז): ״כתל התא חמש, והתא שש, כתל ההיכל שש״.\nהרמב״ם (בית הבחירה ד, י): ״כל אלו המקומות הפנויים שבין הכתלים הם הנקראים תאים״.\nהשגות הראב״ד (בית הבחירה ד, ט): ״שבכותל של היכל היה מקצר אמה ונמצא חלל התא שש משש אמות ומעלה ואותן שש אמה שהתא בהן חללו חמש הם היו כנגד אוטם ההיכל שהיו שש אמות וזהו שחשבו רוחב ההיכל כותל התא חמש והתא שש וכותל ההיכל שש והוא למעלה מן האוטם״.\nתוספות יום טוב (מידות ד, ג): ״מ״מ בענין הזה, שדיוטא התחתונה שמן התאים היא כנגד האוטם, מוכח מתוך פי׳ הרמב״ם, שמפרש בכאן שהתא הזה הוא בדיוטא האמצעית, שגם הוא סובר כן״ — כלומר, בעניין זה הרמב״ם והראב״ד אינם חולקים.\nבמודל (ברירת המחדל): הקומה התחתונה של התאים כנגד האוטם — שש אמות, מרצפת העזרה עד רצפת ההיכל — והקומה השנייה בגובה ההיכל. בקומה התחתונה כותל ההיכל שבע והתא חמש, ומשם ולמעלה כותל ההיכל שש והתא שש, כלשון הראב״ד. התקרה העליונה — על מה היא נשענת, לא נתבאר.", "refs": [["רמב״ם בית הבחירה ד, י", "Mishneh_Torah,_The_Chosen_Temple.4.10"], ["השגות הראב״ד בית הבחירה ד, ט", "Raavad_on_Beit_HaBechira.4.9"], ["תוי״ט מידות ד, ג", "Tosafot_Yom_Tov_on_Mishnah_Middot.4.3"], ["מידות ד, ג", "Mishnah_Middot.4.3"], ["מידות ד, ד", "Mishnah_Middot.4.4"], ["מידות ד, ז", "Mishnah_Middot.4.7"]], "title": "צורת התאים — הרמב״ם, כציורו"}
        };
        const LABEL_PREFIX = [];
        const labelTarget = (l) => {
          if (!l || !l.text) return null;
          if (l.info) return { text: l.info, refs: l.refs || [] };
          // 1.0.2 (item 7): the label "השיתין" of 40-altar.js opens ctx.shared.shitin's text (nothing when the contract is missing)
          const shi = ctx.shared.shitin;
          if (/^השיתין/.test(l.text) && shi && shi.info) return { text: shi.info, refs: Array.isArray(shi.refs) ? shi.refs : [] };
          // 1.0.1-L (L.88; part5-kelim.md FOR-UI 3): a vessel's label opens that vessel; the exhibit's titles open the exhibit
          if (l.kelimKey && ctx.shared.kelim) {
            const K = ctx.shared.kelim, itK = K.items.find((x) => x.key === l.kelimKey);
            return itK ? { text: itK.text, refs: itK.refs || [], title: itK.name + " — " + itK.verse } : { text: K.info, refs: K.refs || [], title: K.title || "" };
          }
          let m = Object.prototype.hasOwnProperty.call(LABEL_MAP, l.text) ? LABEL_MAP[l.text] : null;
          // 1.0.1-L (L.81): a label of ONE version of the throne (its layers) opens that version's text and sources
          if (!m && Array.isArray(l.layers)) {
            for (const lay of l.layers) {
              const k = lay === "thronePesukim" ? "pesukim" : lay === "throneTargumSheni" ? "targumSheni" : lay === "throneEstherRabbah" ? "estherRabbah" : lay === "throneBeitHamidrash" ? "beitHamidrash" : null;
              if (k && PN.throneVersions && PN.throneVersions[k]) { m = { info: PN.throneVersions[k], refs: TH_REFS[k] }; break; }
            }
          }
          if (typeof m === "function") m = m(l);
          if (!m) for (const [pre, t] of LABEL_PREFIX) if (l.text.indexOf(pre) === 0) { m = t; break; }
          if (!m) {
            const v = ui_VIEWS.find((vv) => vv.label === l.text);
            if (v) m = { v: v.key };
            else if (placeByT[l.text]) m = { p: l.text };
          }
          if (!m) return null;
          if (m.info) return { text: m.info, refs: m.refs || [], title: m.title || "", subj: { view: m.v || null, title: m.p || null } };
          if (m.v && viewKeys.has(m.v)) return { key: m.v };
          const it = m.p && placeByT[m.p];
          if (!it) return null;
          if (it.info) return { text: it.info, refs: it.refs || [], subj: { title: m.p } };
          if (it.key) return { key: it.key, subj: { title: m.p } };
          if (it.view && viewKeys.has(it.view)) return { key: it.view, subj: { title: m.p } };
          return null;
        };
        // 1.0.2 (item 4): the label's opinions - its view or place (as the panel's card), its own text and its layers (the throne's
        // versions, the forest readings)
        const labelOps = (l, t) => {
          const s = (t && t.subj) || {};
          const lays = Array.isArray(l.layers) ? l.layers : l.layer ? [l.layer] : [];
          return opsFor({ view: (t && t.key) || s.view || null, title: s.title || null, label: l.text, layers: lays });
        };
        for (const spr of labelGroup.children) {
          const t = labelTarget(spr.userData.label);
          if (t) t.ops = labelOps(spr.userData.label, t);
          spr.userData.target = t;
        }
        const missing = labelGroup.children.filter((s) => !s.userData.target).map((s) => s.userData.label && s.userData.label.text);
        if (missing.length) console.warn("[ui.js] labels without sources:", missing.join(" | "));
        const el = ctx.renderer.domElement;
        const lRay = new Raycaster(), lNdc = new Vector2();
        const visibleLabels = () => (labelGroup.visible ? labelGroup.children.filter((s) => s.visible && s.userData.target) : []);
        const pickLabel = (ev, occlusion) => {
          const r = el.getBoundingClientRect();
          if (!r.width || !r.height) return null;
          lNdc.set((ev.clientX - r.left) / r.width * 2 - 1, -((ev.clientY - r.top) / r.height) * 2 + 1);
          lRay.setFromCamera(lNdc, ctx.camera);   // sets lRay.camera, which sprites need
          const hits = lRay.intersectObjects(visibleLabels(), false);
          if (!hits.length) return null;
          const h = hits[0];
          if (occlusion) {
            // 1.0.1-K (review UI-H2-5): the Holy of Holies' cloud hides the labels inside it while it is on (its puffs carry noPick)
            if (cloud.visible && cloudMat.opacity > 0.5) {
              const ch = lRay.intersectObjects(cloud.children, false);
              if (ch.length && ch[0].distance < h.distance - 1) return null;
            }
            // a label behind a wall is hidden by the depth test: ignore it when a visible, opaque mesh is clearly nearer
            for (const m of lRay.intersectObjects(ctx.root.children, true)) {
              const o = m.object;
              if (o.isSprite || o.isLine || o.isPoints || o.userData.noPick) continue;
              let vis = true;
              for (let p = o; p; p = p.parent) if (!p.visible) { vis = false; break; }
              if (!vis) continue;
              const mt = o.material;
              if (mt && !Array.isArray(mt) && (mt.opacity < 0.5 || mt.visible === false)) continue;
              if (m.distance < h.distance - 1) return null;
              break;
            }
          }
          return h.object;
        };
        let lDown = null, lastHover = 0;
        el.addEventListener("pointerdown", (e) => {
          lDown = e.__tmSynthetic ? null : { x: e.clientX, y: e.clientY, t: performance.now() };
        });
        el.addEventListener("pointerup", (e) => {
          if (e.__tmSynthetic || !lDown || mOn) { lDown = null; return; }
          const d = Math.hypot(e.clientX - lDown.x, e.clientY - lDown.y), dt = performance.now() - lDown.t;
          lDown = null;
          if (d > 6 || dt > 600) return;
          let spr = null;
          try { spr = pickLabel(e, true); } catch (_) { spr = null; }
          if (!spr) {
            closeCard();   // a click on the model, not on a label
            return;
          }
          // 1.0.1-L (L.34): the label's own card is the explanation (the panel's info box is gone, and the panel stays as the user left it)
          openCard(spr, spr.userData.target);
        });
        el.addEventListener("pointermove", (e) => {
          if (e.buttons || mOn) return;
          const now = performance.now();
          if (now - lastHover < 120) return;
          lastHover = now;
          let spr = null;
          // 1.0.1-K (review UI-H2-4): the hand only over a label that a click would open (the same occlusion test; it runs only when the
          // pointer is on a label at all)
          try { spr = pickLabel(e, true); } catch (_) { spr = null; }
          el.style.cursor = spr ? "pointer" : "";
        });
      }

      // ===== 1.0.1-H: the opinions table (the user: "את השיטות תנסה להכניס לתוך מסגרת מסודרת יצר בלבול לגמרי") =====
      // Every dispute of the model in ONE place, one row each: the subject, its sources (links), and the readings as buttons. The
      // places accordion no longer carries opinion buttons (one place = one button); the layers "העליות" and "האולם לשיטת הרמב״ם" are
      // rows here too (a view that needs a layer still switches it on, and the row follows through layerMarks).
      // 1.1.0 (the user: no doubles): the table is a closed group like the places' groups - every row is also a chip on its subject's
      // card, so the table is the one place to see ALL the readings together, and it does not sit open under the tree
      const secOps = document.createElement("details");
      secOps.className = "tm-pl tm-ops-det";
      const opsSum = document.createElement("summary");
      opsSum.textContent = "שיטות ומחלוקות — בחירת השיטה";
      secOps.appendChild(opsSum);
      const opsNote = document.createElement("div");
      opsNote.className = "s";
      opsNote.textContent = "המחלוקות מחולקות לקבוצות לפי המקומות; לחיצה על קבוצה פותחת אותה. בכל שורה: הנושא והדעות. הלחיצה מחליפה את המודל, מסבירה את הדעה ועפה אליה. המקורות — בכרטיס ההסבר.";   // OPS_GROUPS_303
      secOps.appendChild(opsNote);
      secOps.appendChild(opsBox);
      panel.appendChild(secOps);
      {
        // Beit Sheni 1.2.0: the rows are the SHITOT of the old UI (DEV_NOTES): each option = a chip on its subject's card; a drawn
        // option switches the model (the small ramps, the ulam's steps); the others explain and fly only
        opRow({
          id: "sh0", short: "קירוי הר הבית", cardFly: true,
          cap: "קירוי הר הבית",
          refs: [["פסחים יג:", {"book": 106, "index": 388}], ["רמב״ם בית הבחירה ה, א", {"book": 337, "index": 76}], ["תוי״ט מידות ב, א", {"book": 948, "index": 64}], ["מלאכת שלמה מידות ב, א", {"book": 1210, "index": 50}], ["לחם שמים מידות ב, א", {"book": 1145, "index": 35}], ["בועז מידות ב, א", {"book": 1329, "index": 9}], ["ספר הבתים, שערי בית המקדש (בקובץ שיטות קמאי למידות)", {"book": 7576, "index": 234}], ["צורת בית המקדש לתפארת ישראל, סימן ח", {"book": 6029, "index": 25}]],
          options: [["o0", "תוספות יום טוב — רק על האצטבאות שבצדדים", "הגמרא (פסחים יג:): ״אמר רחבא אמר רבי יהודה: הר הבית סטיו כפול היה. תניא נמי הכי: הר הבית סטיו כפול היה. רבי יהודה אומר: איסטוונית היתה נקראת — סטיו לפנים מסטיו״.\nהרמב״ם (בית הבחירה ה, א): ״הר הבית והוא הר המוריה היה חמש מאות אמה על חמש מאות אמה והיה מקף חומה... וכלו היה מקרה סטיו לפנים מסטיו״.\n**תוספות יום טוב** (מידות ב, א): ״ודאי שאין הר הבית מכוסה, שלא היה מסוכך אלא ע״ג האצטבאות [כאותה ששנינו במשנה ה׳ פ״ק דפסחים], והן בצדדים סביב, לא באמצע״. ועל מה שכתב בעל שלטי הגיבורים ״שאמצע הר הבית לא היה מסוכך מפני המזבח שהיה גלוי לשמים״ השיג: ״והרי אין מזבח אלא בעזרה״.\n**מלאכת שלמה** (מידות ב, א), על דברי הרמב״ם: ״ואינו מבואר לע״ד מהיכן הוציא שכולו מקורה, דבפסחים פ״ק ובפ׳ לולב וערבה לא נתבאר אלא שהר הבית סטיו לפנים מסטיו״.\n**ספר הבתים** (שערי בית המקדש, שער שני): ״מה שכתב הר״ם וכלו היה מקורה, הוא מה שאמרו חכמים הר הבית סטו כפול היה, סטו לפנים מסטו, וביארו המפרשים שתי אצטבאות זו לפנים מזו שהיו מקיפות כל הבית לישב עליהם״.\nבמודל (ברירת המחדל): שתי שורות עמודים וקירוי של ארז לאורך כתלי המזרח, הצפון והמערב, והסטיו המלכותי בדרום; אמצע ההר גלוי לשמים. רוחב הסטיו, גובהו, צורת העמודים וחומר הקירוי — בחירת מודל.", [["פסחים יג:", {"book": 106, "index": 388}], ["רמב״ם בית הבחירה ה, א", {"book": 337, "index": 76}], ["תוי״ט מידות ב, א", {"book": 948, "index": 64}], ["מלאכת שלמה מידות ב, א", {"book": 1210, "index": 50}], ["לחם שמים מידות ב, א", {"book": 1145, "index": 35}], ["בועז מידות ב, א", {"book": 1329, "index": 9}], ["ספר הבתים, שערי בית המקדש (בקובץ שיטות קמאי למידות)", {"book": 7576, "index": 234}]]], ["o1", "לחם שמים — כל הר הבית מקורה", "הגמרא (פסחים יג:): ״אמר רחבא אמר רבי יהודה: הר הבית סטיו כפול היה. תניא נמי הכי: הר הבית סטיו כפול היה. רבי יהודה אומר: איסטוונית היתה נקראת — סטיו לפנים מסטיו״.\nהרמב״ם (בית הבחירה ה, א): ״הר הבית והוא הר המוריה היה חמש מאות אמה על חמש מאות אמה והיה מקף חומה... וכלו היה מקרה סטיו לפנים מסטיו״.\n**לחם שמים** (מידות ב, א), על דברי התוספות יום טוב: ״שגה ברואה... דהאמרינן עלה: הר הבית סטיו לפנים מסתיו היה. א״כ כולו עשוי אצטבאות, ממילא כולו מקורה. וכן משמע מההיא דתנן בתענית פ״ג, שירדו כל ישראל מירושלים להר הבית מפני הגשמים; ואין סברא שהצדדין יחזיקו כל ישראל... ותו, הרמב״ם נפק לאפיה, דבהדיא כתב בפ״ה מה״ל בית הבחירה שכולו מקורה היה. והוא האמת״.\n**תפארת ישראל** (בועז, מידות ב, א): מדברי הרמב״ם ״לכאורה משמע... שכל הת״ק על ת״ק אמה מקורה היה, נמצא שכל העזרות של נשים וישראל וכהנים היה מקורין. וכן הבין הש״ג״ (שלטי הגיבורים), והוסיף ״חוץ ממזבח הנחושת שעמד תחת לב השמים״. ודחה זאת: ״דהרי אפי׳ הד׳ לשכות שבעזרת נשים לא היו מקורות [כמדות פ״ב מ״ה], וכ״ש העזרה שחוצה לה... א״כ למה הוצרכו אכסדראות תחת הקרוי בגובה כותלי העזרה סביב [כתמיד פ״א מ״ג]. וכן משמע מרש״י... דרק הר הבית שמחוץ לחומה הפנימית מקורה היה״.\nבמודל: קירוי על כל שטח הר הבית שמחוץ לחומת העזרות — ״דכל הר הבית מחוץ לחומה הפנימית מקורה היה״, ואף מעלות החיל: ״וכולו מחופה בגג״ (תפארת ישראל, צורת בית המקדש, סימן ח). העמודים עומדים טבעת לפנים מטבעת — ״סטיו לפנים מסטיו״ — עד הסורג, ומעל החיל הקירוי נשען על כותל העזרות. העזרות עצמן אינן מקורות, כדברי התפארת ישראל. הקירוי מצויר שקוף למחצה רק כדי שייראה ההר שתחתיו. גובהו, ומספר העמודים ומקומם — בחירת מודל.", [["פסחים יג:", {"book": 106, "index": 388}], ["רמב״ם בית הבחירה ה, א", {"book": 337, "index": 76}], ["תוי״ט מידות ב, א", {"book": 948, "index": 64}], ["מלאכת שלמה מידות ב, א", {"book": 1210, "index": 50}], ["לחם שמים מידות ב, א", {"book": 1145, "index": 35}], ["בועז מידות ב, א", {"book": 1329, "index": 9}], ["צורת בית המקדש לתפארת ישראל, סימן ח", {"book": 6029, "index": 25}]]]],
          current: "o0",
          onPick: (k) => { const R = ctx.shared.harRoof; if (R && typeof R.set === "function") R.set(k === "o1" ? "all" : "sides"); },
          fly: (k) => { const c = {"o0": [[103, 360, 500], [103, 0, 75]], "o1": [[103, 360, 500], [103, 0, 75]]}[k]; if (c && c[0] && c[1]) fly(c[0], c[1]); }
        });
        opRow({
          id: "sh1", short: "גובה כותל המזרח — שער שושן", cardFly: true,
          cap: "גובה כותל המזרח — שער שושן",
          refs: [["רמב״ם בית הבחירה ו, ה", "Mishneh_Torah,_The_Chosen_Temple.6.5"], ["פירוש המשניות לרמב״ם מידות ב, ד (בספרייה: ב, ה)", {"book": 573, "index": 25}], ["תוי״ט מידות ב, ד", "Tosafot_Yom_Tov_on_Mishnah_Middot.2.4"], ["רש״ש מידות ב, ד", "Rashash_on_Middot.2.4"], ["לחם שמים מידות ב, ד", "Lechem_Shamayim_on_Middot.2.4"], ["חק נתן מידות ב, ד", "Chok_Natan_on_Mishnah_Middot.2.4"], ["מידות ב, ד", "Mishnah_Middot.2.4"], ["תפא״י מידות ב, ד", "Yachin_on_Mishnah_Middot.2.4"], ["פסקי תוספות מידות ח", "Piskei_Tosafot_on_Middot.8.1"], ["רבינו שמעיה מידות ב, ד", "R_Shemaya_on_Middot.2.4"], ["מידות ב, ג", "Mishnah_Middot.2.3"]],
          options: [["o0", "הרמב״ם — רק הכותל שמעל השער", "הרמב״ם (בית הבחירה ו, ה): ״נמצא גבה קרקע ההיכל על קרקע שער המזרח של הר הבית שתים ועשרים אמות. וגבה שער הר הבית עשרים אמה. לפיכך העומד כנגד שער המזרח אינו רואה פתח ההיכל. ומפני זה עשו כתל שעל גבי שער זה נמוך. כדי שיהא כהן העומד בהר המשחה רואה פתח ההיכל בשעה שמזה מדם הפרה נכח ההיכל״.\nובפירוש המשניות (מידות ב, ד; ומובא בתוספות יום טוב שם): ״ולפיכך צריך שיהא הכותל שלמעלה משער שושן נמוך כדי שיראה ההיכל ממעל לו״; ״ואמרו שהוא נמוך מכ׳ אמה דרך משל כדי שיהא הנראה משער ההיכל יותר משתי אמות״.\nעל ״נמוך מכ׳ אמה״: הרש״ש — ״וט״ס הוא וצ״ל מכ״ד. או מד׳ ויהיה הכוונה על גובה הכותל שלמעלה מן השער״; לחם שמים — לא נתבאר לו; חק נתן — ״נ״ל שלא בדקדוק כתב זה״, ולחשבונו ״איני יכול להגביה הכותל שעל שער שושן יותר מי״ג אמות״.\nבמודל: הכותל גבוה כשאר הכתלים (27), ורק קטע של עשרים אמה שעל גבי השער נמוך — ראשו 23, שלוש אמות מעל השקוף (המידה — בחירת מודל).", [["רמב״ם בית הבחירה ו, ה", "Mishneh_Torah,_The_Chosen_Temple.6.5"], ["פירוש המשניות לרמב״ם מידות ב, ד (בספרייה: ב, ה)", {"book": 573, "index": 25}], ["תוי״ט מידות ב, ד", "Tosafot_Yom_Tov_on_Mishnah_Middot.2.4"], ["רש״ש מידות ב, ד", "Rashash_on_Middot.2.4"], ["לחם שמים מידות ב, ד", "Lechem_Shamayim_on_Middot.2.4"], ["חק נתן מידות ב, ד", "Chok_Natan_on_Mishnah_Middot.2.4"], ["מידות ב, ד", "Mishnah_Middot.2.4"]]], ["o1", "תפארת ישראל — כל הכותל מעט יותר מעשרים", "תפארת ישראל (יכין, מידות ב, ד): ״חוץ מכותל המזרחי ר״ל כותל מזרח של חומת הר הבית שרק היא היתה גבוה רק מעט יותר מכ׳ אמה״.\nבמודל: כל כותל המזרח של הר הבית 23 אמה (שאר הכתלים 27); ״מעט יותר מכ׳ אמה״ — המידה המדויקת בחירת מודל.", [["תפא״י מידות ב, ד", "Yachin_on_Mishnah_Middot.2.4"], ["מידות ב, ד", "Mishnah_Middot.2.4"]]], ["o2", "פסקי תוספות — כותל מזרחי שש אמות", "פסקי תוספות (מידות, סימן ח): ״כותל מזרחי גבוה שש אמות וכשמזה רואה למעלה לתוך פתח היכל״. כפשוטו — כל כותל המזרח שש אמות; וכך הביא הרש״ש (מידות ב, ד): ״ובפסקי תוס׳ כאן סי׳ ח׳ כתבו שהיה גבהו ששה אמות״.\nחק נתן (מידות ב, ד) מקשה על פירוש זה: ״איך אפשר לעשות שער גבוה עשרים אמה מלבד הכותל שעליו בחומה שקומתה ששה אמות״.\nבמודל: כל כותל המזרח שש אמות, ושער שושן עומד בו כבית שער ברוחב עשרים ובגובה עשרים ושלוש — בחירת מודל, כדי שלא יישאר השער באוויר.", [["פסקי תוספות מידות ח", "Piskei_Tosafot_on_Middot.8.1"], ["רש״ש מידות ב, ד", "Rashash_on_Middot.2.4"], ["חק נתן מידות ב, ד", "Chok_Natan_on_Mishnah_Middot.2.4"]]], ["o3", "פסקי תוספות לחק נתן — שש אמות מעל השער", "חק נתן (מידות ב, ד) מפרש את פסקי התוספות: ״והא דאמרי כותל מזרחי גבוה ששה אמות היינו הכותל שעל השער עליו אמרי היה גבוה ששה אמות״, ״ואותו הכותל שהיה על שער המזרחי לכל אורך המזרח היה שוה ששה אמות קומתו״. וכן תפארת ישראל (מידות ב, ד) בשם תוספות ישנים (יומא טז.): ״לא היה המשקוף שעל השער שם גבוה יותר מו׳ אמות״.\nבמודל: כל כותל המזרח עשרים ושש אמה — שש מעל השער.", [["חק נתן מידות ב, ד", "Chok_Natan_on_Mishnah_Middot.2.4"], ["תפא״י מידות ב, ד", "Yachin_on_Mishnah_Middot.2.4"], ["פסקי תוספות מידות ח", "Piskei_Tosafot_on_Middot.8.1"]]], ["o4", "רבינו שמעיה — כותל החיל המזרחי כעשר אמות", "רבינו שמעיה (מידות ב, ד): ״מן הכותל המזרחי. של החיל שהיה נמוך כעשר אמות לראות מעליו פתחו של היכל״; ובמשנה הקודמת (ב, ג): ״ואם לא היה נמוך כותל מזרחי זה של החיל לא היה מצינו... רואה מעל גבי פתח היכל״. מלאכת שלמה (מידות ב, ד) מביא את דבריו. חק נתן (שם) תמה: ״ולא יכולתי לכוין פירושו איך לא חששו אלא לכותל זה של החיל ולא חששו לכותל מזרח של הר הבית״.\nבמודל: כותל החיל לדבריו עומד עשר אמות מן הסורג — במודל זה קו הכותל המזרחי של עזרת נשים — ולכן הכותל הזה מצויר בגובה עשר אמות, והשער עומד בו כבית שער בגובה עשרים ושלוש (בחירת מודל); חומת הר הבית — גבוהה, 27.", [["רבינו שמעיה מידות ב, ד", "R_Shemaya_on_Middot.2.4"], ["חק נתן מידות ב, ד", "Chok_Natan_on_Mishnah_Middot.2.4"], ["מידות ב, ג", "Mishnah_Middot.2.3"]]]],
          current: "o0",
          onPick: (k) => { if (ctx.shared.eastWall && typeof ctx.shared.eastWall.set === "function") ctx.shared.eastWall.set(["rambam", "tiferet", "piskei", "chok", "shemaya"][+k.slice(1)] || "rambam"); },
          fly: (k) => { const c = {"o0": [[430, 45, 70], [355, 18, 0]], "o1": [[430, 45, 70], [355, 18, 0]], "o2": [[430, 45, 70], [355, 18, 0]], "o3": [[430, 45, 70], [355, 18, 0]], "o4": [[300, 55, 70], [228, 14, 0]]}[k]; if (c && c[0] && c[1]) fly(c[0], c[1]); if (c && c[1] && ctx.shared.fadeHold) ctx.shared.fadeHold.set(c[1]); }
        });
        opRow({
          id: "sh2", short: "שושן הבירה ושתי האמות", cardFly: true,
          cap: "שושן הבירה ושתי האמות",
          refs: [["כלים יז, ט", "Mishnah_Kelim.17.9"], ["מידות א, ג", "Mishnah_Middot.1.3"], ["פירוש המשניות לרמב״ם כלים יז, ט", "Rambam_Commentary_on_Kelim.17.9"], ["פירוש המשניות לרמב״ם מידות א, ג", "Rambam_Commentary_on_Middot.1.3"], ["ברטנורא מידות א, ג", "Bartenura_on_Mishnah_Middot.1.3"], ["רש״י מנחות צח.", "Rashi_on_Menachot.98.1"], ["רש״י פסחים פו.", "Rashi_on_Pesachim_Shtei_Amot.86.1"], ["ברטנורא כלים יז, ט", "Bartenura_on_Mishnah_Kelim.17.9"], ["תוספות פסחים פו.", "Tosafot_on_Pesachim.86.1"], ["רש״ש פסחים פו.", "Rashash_on_Pesachim.86.1"]],
          options: [["o0", "הרמב״ם — בשער שושן, בלי חדר", "לשון המשנה (כלים יז, ט): ״ושתי אמות היה בשושן הבירה, אחת על קרן מזרחית צפונית ואחת על קרן מזרחית דרומית. שעל קרן מזרחית צפונית היתה יתרה על של משה חצי אצבע. שעל קרן מזרחית דרומית היתה יתרה עליה חצי אצבע, נמצאת יתרה על של משה אצבע. ולמה אמרו אחת גדולה ואחת קטנה, אלא שהאמנין נוטלין בקטנה ומחזירין בגדולה, כדי שלא יבאו לידי מעילה״. ובמידות (א, ג): ״שער המזרחי, עליו שושן הבירה צורה״.\n**הרמב״ם** (פירוש המשניות, כלים יז, ט): ״וכבר ביארנו במדות שבשער מזרחית משערי הר הבית היתה צורת שושן הבירה ולזה יקראו שער שושן הבירה ועשו זה בעבור שעלו משושן כדי שיזכירו עמידתם בו ויהיה אימת מלכות עליהן ומזה השער יאמרו ושתי אמות היו בשושן הבירה״; ובמידות (א, ג): ״ולפיכך ציירו אותה על שער מזרח משערי הר הבית״. **ברטנורא** (מידות א, ג): ״כשעלו מן הגולה צוו להם מלכי פרס לציר צורת שושן הבירה על שערי הבית, כדי שיהיה להם מורא מלכות, וצירוהו בשער המזרח״.\nבמודל (ברירת המחדל): שתי אמות המידה בשער שושן, שער המזרח של הר הבית — על שתי מזוזותיו מבחוץ, אחת בקרן המזרחית־צפונית ואחת בקרן המזרחית־דרומית. חדר אינו נזכר בדברי הרמב״ם, ואינו מצויר. מקומן המדויק של האמות, גובהן וצורתן — בחירת מודל. צורת שושן אינה מצוירת.", [["כלים יז, ט", "Mishnah_Kelim.17.9"], ["מידות א, ג", "Mishnah_Middot.1.3"], ["פירוש המשניות לרמב״ם כלים יז, ט", "Rambam_Commentary_on_Kelim.17.9"], ["פירוש המשניות לרמב״ם מידות א, ג", "Rambam_Commentary_on_Middot.1.3"], ["ברטנורא מידות א, ג", "Bartenura_on_Mishnah_Middot.1.3"], ["רש״י מנחות צח.", "Rashi_on_Menachot.98.1"], ["רש״י פסחים פו.", "Rashi_on_Pesachim_Shtei_Amot.86.1"], ["ברטנורא כלים יז, ט", "Bartenura_on_Mishnah_Kelim.17.9"], ["תוספות פסחים פו.", "Tosafot_on_Pesachim.86.1"], ["רש״ש פסחים פו.", "Rashash_on_Pesachim.86.1"]]], ["o1", "רש״י — חדר על גבי שער המזרח של העזרה", "לשון המשנה (כלים יז, ט): ״ושתי אמות היה בשושן הבירה, אחת על קרן מזרחית צפונית ואחת על קרן מזרחית דרומית. שעל קרן מזרחית צפונית היתה יתרה על של משה חצי אצבע. שעל קרן מזרחית דרומית היתה יתרה עליה חצי אצבע, נמצאת יתרה על של משה אצבע. ולמה אמרו אחת גדולה ואחת קטנה, אלא שהאמנין נוטלין בקטנה ומחזירין בגדולה, כדי שלא יבאו לידי מעילה״. ובמידות (א, ג): ״שער המזרחי, עליו שושן הבירה צורה״.\n**רש״י** (מנחות צח.): ״חדר אחד היה בנוי על שער המזרחי של עזרה ומצוייר כתבנית שושן הבירה״; (פסחים פו.): ״קני מדה היו בשושן הבירה והוא בית הבנוי על גובה השער״. **ברטנורא** (כלים יז, ט): ״חדר אחד בנוי על שער מזרחי של עזרה, ועליו שושן הבירה מצירת, כדי שתהא עליהם אימת מלכות״. **תוספות** (פסחים פו.): ״דהא שער מזרחי שעליו שושן הבירה צורה אחת משערי העזרה היה״.\n**הרש״ש** (פסחים פו.), על דברי התוספות: ״וכ״כ רש״י (במנחות צח) והרע״ב בפי״ז דכלים מ״ט ובציורי הרמב״ם בסוף מדות בטבלא א׳ אות ה׳ מצוייר בשער עזרת נשים״; ״ותימה דהא מפורש בפ״א דמדות מ״ג דהוא א׳ משערי הר הבית״.\nבמודל: חדר על גבי השער המזרחי של עזרת נשים, בראש הכותל שמעל השער; ובו שתי אמות המידה, על כותלו המזרחי מבפנים — אחת אצל קרנו המזרחית־צפונית ואחת אצל קרנו המזרחית־דרומית. שהחדר מעל שער עזרת נשים — כציור שמביא הרש״ש. מקום החדר בראש הכותל, מידותיו, פתחו, ומקום האמות וצורתן — בחירת מודל. צורת שושן אינה מצוירת. גג החדר מוסר לשעה.", [["כלים יז, ט", "Mishnah_Kelim.17.9"], ["מידות א, ג", "Mishnah_Middot.1.3"], ["פירוש המשניות לרמב״ם כלים יז, ט", "Rambam_Commentary_on_Kelim.17.9"], ["פירוש המשניות לרמב״ם מידות א, ג", "Rambam_Commentary_on_Middot.1.3"], ["ברטנורא מידות א, ג", "Bartenura_on_Mishnah_Middot.1.3"], ["רש״י מנחות צח.", "Rashi_on_Menachot.98.1"], ["רש״י פסחים פו.", "Rashi_on_Pesachim_Shtei_Amot.86.1"], ["ברטנורא כלים יז, ט", "Bartenura_on_Mishnah_Kelim.17.9"], ["תוספות פסחים פו.", "Tosafot_on_Pesachim.86.1"], ["רש״ש פסחים פו.", "Rashash_on_Pesachim.86.1"]]]],
          current: "o0",
          onPick: (k) => { const S = ctx.shared.shushanRods; if (S && typeof S.set === "function") S.set(k === "o1" ? "rashi" : "rambam"); },
          fly: (k) => { const c = {"o0": [[374, 7.6, 1.3], [356.3, 5, 1.3]], "o1": [(() => { const S = ctx.shared.shushanRods, b = S && typeof S.base === "number" ? S.base : 40.9; return [217, b + 17, -0.9]; })(), (() => { const S = ctx.shared.shushanRods, b = S && typeof S.base === "number" ? S.base : 40.9; return [231.5, b + 4.6, -0.9]; })()]}[k]; if (c && c[0] && c[1]) fly(c[0], c[1]); if (ctx.shared.openFor) ctx.shared.openFor("crt-lishkot-roofs", 15000); if (c && c[1] && ctx.shared.fadeHold) ctx.shared.fadeHold.set(c[1]); }
        });
        opRow({
          id: "sh3", short: "הסורג — שלוש עשרה הפרצות", cardFly: true,
          cap: "הסורג — שלוש עשרה הפרצות",
          refs: [["מידות ב, ג", "Mishnah_Middot.2.3"]],
          options: [["o0", "אחר שגדרום — הסורג שלם", "לשון המשנה (מידות ב, ג): ״לפנים ממנו, סורג, גבוה עשרה טפחים. ושלש עשרה פרצות היו שם, שפרצום מלכי יון. חזרו וגדרום, וגזרו כנגדם שלש עשרה השתחויות״.\nבמודל (ברירת המחדל): הסורג שלם, כפי שהיה משגדרו את הפרצות — ״חזרו וגדרום״.", [["מידות ב, ג", "Mishnah_Middot.2.3"]]], ["o1", "בימי מלכי יון — שלוש עשרה פרצות", "לשון המשנה (מידות ב, ג): ״לפנים ממנו, סורג, גבוה עשרה טפחים. ושלש עשרה פרצות היו שם, שפרצום מלכי יון. חזרו וגדרום, וגזרו כנגדם שלש עשרה השתחויות״.\nבמודל: הסורג פרוץ בשלושה עשר מקומות, כבימי מלכי יון; בכל פרצה שלוש אמות פתוחות, והדפים מוטלים לידה. מקומות הפרצות ורוחבן אינם מפורשים — בחירת מודל (חמש בצפון, חמש בדרום, אחת במזרח ושתים במערב).", [["מידות ב, ג", "Mishnah_Middot.2.3"]]]],
          current: "o0",
          onPick: (k) => { const B = ctx.shared.soregBreach; if (B && typeof B.set === "function") B.set(k === "o1" ? "greeks" : "repaired"); },
          fly: (k) => { const c = {"o0": [[82, 6, 94], [70, 1, 80]], "o1": [[82, 6, 94], [70, 1, 80]]}[k]; if (c && c[0] && c[1]) fly(c[0], c[1]); if (c && c[1] && ctx.shared.fadeHold) ctx.shared.fadeHold.set(c[1]); }
        });
        opRow({   // NIGHT_WATCH_305 (the user, 19.11.2026 23:49: "שלום עליך - א")
          id: "sh61", short: "״שלום עליך״ — איש הר הבית או השומר", cardFly: true,
          cap: "״שלום עליך״ — איש הר הבית או השומר (מידות א, ב)",
          refs: [["מידות א, ב", "Mishnah_Middot.1.2"], ["תמיד כז:–כח.", "Tamid.27b"], ["רמב״ם בית הבחירה ח, י", "Mishneh_Torah,_The_Chosen_Temple.8.10"], ["יכין מידות א, ב", {"book": 819, "index": 32}], ["המפרש תמיד כז:", {"book": 2105, "index": 173}]],
          options: [["o0", "המשנה ותפארת ישראל — איש הר הבית אומר לשומר", "**המשנה** (מידות א, ב), כמו שהיא באוצריא: ״וכל משמר שאינו עומד, אומר לו איש הר הבית, שלום עליך. נכר שהוא ישן, חובטו במקלו״.\n**תפארת ישראל** (יכין שם): ״שלום עליך — דאולי נחלש ולא יכול לקום, או אולי בעל מחשבות הוא. לפיכך דורש השר בשלומו, שאם הוא ער יענהו״.\nבהדגמת עבודת הבוקר: השומר בשער הקרבן ער וקם לפני איש הר הבית; לשומר בשער הניצוץ, שאינו קם, איש הר הבית אומר ״שלום עליך״, ואין עונה."],
            ["o1", "הגמרא והרמב״ם — השומר אומר לאיש הר הבית", "**הגמרא** (תמיד כז:–כח.): ״וכל משמר שאינו עומד ואומר לו: איש הר הבית שלום עליך — ניכר שהוא ישן, חובטו במקלו״. וכן **הרמב״ם** (בית הבחירה ח, י): ״וכל משמר שאינו עומד ואומר לו איש הר הבית שלום עליך נכר שהוא ישן״; ו**המפרש** (תמיד כז:): ״כל משמר שאינו עומד כנגדו ואומר לו שלום עליך ניכר שהוא ישן״.\nתפארת ישראל מביא גרסה זו (״וי״ג״), ומקשה: ״וק״ל אמירה למה. הרי כשקם לחוד כבר ניכר שהוא ער״.\nבהדגמת עבודת הבוקר: השומר בשער הקרבן קם, ואומר ״איש הר הבית, שלום עליך״; השומר בשער הניצוץ אינו קם ואינו אומר — ניכר שהוא ישן."]],
          current: "o0",
          onPick: (k) => { const T = ctx.shared.tamid; if (T && typeof T.setShalom === "function") T.setShalom(k === "o1" ? "gemara" : "mishna"); },
          fly: () => { const c = [[-60, 14, -96], [-72, 2, -76]]; fly(c[0], c[1]); }
        });
        opRow({
          id: "sh4", short: "שערי עזרת נשים", cardFly: true,
          cap: "שערי עזרת נשים",
          refs: [["מידות ב, ה", "Mishnah_Middot.2.5"], ["מידות ב, ג", "Mishnah_Middot.2.3"], ["מידות א, ד", "Mishnah_Middot.1.4"], ["רמב״ם בית הבחירה ה, ז", "Mishneh_Torah,_The_Chosen_Temple.5.7"], ["רמב״ם בית הבחירה ה, ח", "Mishneh_Torah,_The_Chosen_Temple.5.8"]],
          options: [["o0", "חז״ל — מזרח בלבד", "במשנה ובגמרא, ברמב״ם ובמפרשים לא נזכרו שערים בצפון ובדרום לעזרת הנשים: המשנה מונה חמישה שערים להר הבית (מידות א, ג) ושבעה לעזרה (א, ד), ומן החיל עולים לעזרת נשים בשתים עשרה מעלות (ב, ג); השער שבמזרחה — ״שער עזרת נשים״ (ב, ד: הכותל המזרחי הנמוך). הרמב״ם (בית הבחירה ה, ז–ח) מתאר את עזרת הנשים ולשכותיה בלי שערי צפון ודרום. לכן במודל עזרת הנשים סגורה בצפון ובדרום.", [["מידות ב, ה", "Mishnah_Middot.2.5"], ["מידות ב, ג", "Mishnah_Middot.2.3"], ["מידות א, ד", "Mishnah_Middot.1.4"], ["רמב״ם בית הבחירה ה, ז", "Mishneh_Torah,_The_Chosen_Temple.5.7"], ["רמב״ם בית הבחירה ה, ח", "Mishneh_Torah,_The_Chosen_Temple.5.8"]]], ["o1", "יוסף בן מתתיהו — גם צפון ודרום", "יוסף בן מתתיהו (מלחמות היהודים ה, ה, ב) מתאר שערים לעזרת הנשים גם מצפון ומדרום, ומעלות לפניהם. תיאורו אינו מתיישב עם מניין השערים במשנה, ולכן הוא במודל כמתג בלבד — בחירתו מראה את שני השערים ואת שתים עשרה המעלות שלפני כל אחד.", [["מידות א, ד", "Mishnah_Middot.1.4"], ["מידות ב, ה", "Mishnah_Middot.2.5"]]]],
          current: "o0",
          onPick: (k) => { if (ctx.shared.eznGates && typeof ctx.shared.eznGates.set === "function") ctx.shared.eznGates.set(k === "o1"); },
          fly: (k) => { const c = {"o0": [[240, 60, 150], [161, 10, 30]], "o1": [[200, 60, 150], [161, 10, 60]]}[k]; if (c && c[0] && c[1]) fly(c[0], c[1]); if (c && c[1] && ctx.shared.fadeHold) ctx.shared.fadeHold.set(c[1]); }
        });
        opRow({
          id: "sh5", short: "ארבע לשכות עזרת נשים — מקומן", cardFly: true,
          cap: "ארבע לשכות עזרת נשים — מקומן",
          refs: [["מידות ב, ה", "Mishnah_Middot.2.5"], ["תוי״ט ב, ה", "Tosafot_Yom_Tov_on_Mishnah_Middot.2.5"], ["הרא״ש מידות ב, ה", "Rosh_on_Mishnah_Middot.2.5"], ["פסקי הרי״ד סוכה נג.", "Kovetz_Shitot_Kamai_Middot.53.1"]],
          options: [["o0", "תוספות יום טוב — במקצועותיה שבפנים", "לשון המשנה (מידות ב, ה): ״וארבע לשכות היו בארבע מקצועותיה, של ארבעים ארבעים אמה. ולא היו מקורות״.\nתוספות יום טוב: ״פירוש במקצעותיה שבפנים״; וכתב כן ״מפני שראיתי תמונה אחת על צורת בית שני״, ״ושם הושמו אלו הד׳ חצרות קטורות בד׳ המקצעות שמבחוץ לעזרה זו, ואינו כך. וכן מוכח בספר יחזקאל״.\nבמודל (ברירת המחדל): ארבע הלשכות בארבע פינות עזרת נשים, מבפנים.", [["מידות ב, ה", "Mishnah_Middot.2.5"], ["תוי״ט ב, ה", "Tosafot_Yom_Tov_on_Mishnah_Middot.2.5"], ["הרא״ש מידות ב, ה", "Rosh_on_Mishnah_Middot.2.5"]]], ["o1", "הרא״ש — מבחוץ, כציורו", "הרא״ש (מידות ב, ה): ״ד׳ לשכות בד׳ מקצעות. מבחוץ כזה״ — וצייר את העזרה כשהלשכות בולטות ממנה בארבע פינותיה — ״ולא היו מקורות בבית שני״.\nבמודל: ארבע הלשכות מחוץ לעזרת נשים, בארבע פינותיה — שתיים בולטות לצפון ושתיים לדרום — פתוחות אל העזרה, בלי תקרה; ותוכן הלשכות עובר אליהן. כיוון הבליטה (לצפון ולדרום, כהבנת הקונטרס בציור), גובה הכתלים, והחיל והסורג שסביב הלשכות (שלא שורטטו מחדש) — בחירת מודל. ובשיטת הרי״ד שבמתג ״חמש עשרה המעלות — צורתן״, המעלה העליונה היא אז מכותל לכותל, מאה שלושים וחמש אמה — כלשונו (פסקי הרי״ד, סוכה נג.): ״ואורך המעלה היה קל״ה אמה כרוחב העזרה מכותל לכותל״.", [["מידות ב, ה", "Mishnah_Middot.2.5"], ["תוי״ט ב, ה", "Tosafot_Yom_Tov_on_Mishnah_Middot.2.5"], ["הרא״ש מידות ב, ה", "Rosh_on_Mishnah_Middot.2.5"], ["פסקי הרי״ד סוכה נג.", "Kovetz_Shitot_Kamai_Middot.53.1"]]]],
          current: "o0",
          onPick: (k) => { const E = ctx.shared.eznChambers; if (E && typeof E.set === "function") E.set(k === "o1" ? "outside" : "inside"); },
          fly: (k) => { const c = {"o0": [[161, 250, 150], [161, 6, 0]], "o1": [[161, 250, 150], [161, 6, 0]]}[k]; if (c && c[0] && c[1]) fly(c[0], c[1]); if (c && c[1] && ctx.shared.fadeHold) ctx.shared.fadeHold.set(c[1]); }
        });
        opRow({
          id: "sh6", short: "חמש עשרה המעלות — צורתן", cardFly: true,
          cap: "חמש עשרה המעלות — צורתן",
          refs: [["מידות ב, ה", "Mishnah_Middot.2.5"], ["פירוש המשניות לרמב״ם מידות ב, ה", "Rambam_Commentary_on_Middot.2.5"], ["רמב״ם בית הבחירה ו, ב", "Mishneh_Torah,_The_Chosen_Temple.6.2"], ["פסקי הרי״ד סוכה נג.", "Kovetz_Shitot_Kamai_Middot.53.1"], ["רבינו יהונתן סוכה נא:", "Kovetz_Shitot_Kamai_Middot.51.2"], ["מאירי מידות ב, ה", "Meiri_on_Middot.2.5"], ["הרא״ש מידות ב, ה", "Rosh_on_Mishnah_Middot.2.5"], ["מידות ב, ג", "Mishnah_Middot.2.3"]],
          options: [["o0", "הרמב״ם — כל מעלה חצי עיגול, לפני השער", "לשון המשנה (מידות ב, ה): ״וחמש עשרה מעלות עולות מתוכה לעזרת ישראל, כנגד חמש עשרה מעלות שבתהלים, שעליהן הלוים אומרים בשיר. לא היו טרוטות, אלא מקפות כחצי גרן עגלה״.\n**הרמב״ם** (פירוש המשניות, מידות ב, ה): ״שמעלות עזרת נשים לא היו ארוכים כשאר המעלות כמו שהוא מפורסם היום מצורת המדרגות אלא היתה כל מעלה כמו חצי עגולה עד שתהא כל מעלה חצי גורן כזה״ (הציור שבמקום זה אינו בנוסח שבספרייה), ״ולפיכך היתה צורת המעלה כמי שלקח קצת אצטבא ונתן אותה על המעלה עד שמשלים צורת הסולם וזה אי אפשר לציירו בפשוט אבל יובן בקירוב״. ובבית הבחירה (ו, ב): ״רום כל מעלה חצי אמה ושלחה חצי אמה״.\nבמודל (ברירת המחדל): חמישה עשר חצאי עיגולים לפני שער ניקנור, כל אחד מונח על זה שמתחתיו; העליון הוא הקטן, וכל מעלה שמתחתיו רחבה ממנו בחצי אמה. רדיוס המעלה העליונה חמש עשרה אמה — השער ושני פשפשיו עומדים עליה — ושל התחתונה עשרים ושתיים. חמש המעלות התחתונות נקטעות אצל כותלי שתי הלשכות הקטנות שמצדי השער. מידות הרדיוס והקטיעה — בחירות מודל.", [["מידות ב, ה", "Mishnah_Middot.2.5"], ["פירוש המשניות לרמב״ם מידות ב, ה", "Rambam_Commentary_on_Middot.2.5"], ["רמב״ם בית הבחירה ו, ב", "Mishneh_Torah,_The_Chosen_Temple.6.2"], ["פסקי הרי״ד סוכה נג.", "Kovetz_Shitot_Kamai_Middot.53.1"], ["רבינו יהונתן סוכה נא:", "Kovetz_Shitot_Kamai_Middot.51.2"], ["מאירי מידות ב, ה", "Meiri_on_Middot.2.5"], ["הרא״ש מידות ב, ה", "Rosh_on_Mishnah_Middot.2.5"], ["מידות ב, ג", "Mishnah_Middot.2.3"]]], ["o1", "הרי״ד ורבינו יהונתן — מעלות ארוכות, כרוחב העזרה", "לשון המשנה (מידות ב, ה): ״וחמש עשרה מעלות עולות מתוכה לעזרת ישראל, כנגד חמש עשרה מעלות שבתהלים, שעליהן הלוים אומרים בשיר. לא היו טרוטות, אלא מקפות כחצי גרן עגלה״.\n**פסקי הרי״ד** (סוכה נג.): ״וכל מעלה היתה גבוהה חצי אמה ורחבה חצי אמה כדתנן במידות... ואורך המעלה היה קל״ה אמה כרוחב העזרה מכותל לכותל״. **רבינו יהונתן מלוניל** (סוכה נא:): ״אורך המעלה כרוחב העזרה, ורוחב המעלה חצי אמה ורומה חצי אמה״.\n**המאירי:** ״מוקפות כחצי גורן, שהתחתונה קצרה, והשניה עודפת לה משני קצותיה, וכן שלישית לשניה, וכלם על סדר זה, עד שכשהיו כלם מסודרות בסדר זה היתה צורתם דומה להקף של חצי גורן״.\nהרי״ד ורבינו יהונתן כתבו את אורך המעלות ולא את צורתן; המאירי כתב את צורתן ולא את אורכן. בשיטה זו הן מצוירות יחד.\nבמודל: מעלות ישרות לאורך כותל המערב של עזרת נשים. התחתונה היא הקצרה, וכל מעלה שמעליה עודפת עליה משני קצותיה; קצות המעלות על קשת — כחצי גורן. כשארבע הלשכות במקצועות העזרה מבפנים (ברירת המחדל), המעלות בין שתי הלשכות הקטנות שמצדי שער ניקנור — העליונה שלושים ותשע אמה. כשהלשכות מבחוץ (הרא״ש, במתג ״ארבע לשכות עזרת נשים — מקומן״), המעלה העליונה מכותל לכותל, מאה שלושים וחמש אמה, ושתי הלשכות הקטנות עומדות בתוך המעלות. הקשת, אורך המעלה התחתונה, והיות המעלות ישרות — בחירות מודל.", [["מידות ב, ה", "Mishnah_Middot.2.5"], ["פירוש המשניות לרמב״ם מידות ב, ה", "Rambam_Commentary_on_Middot.2.5"], ["רמב״ם בית הבחירה ו, ב", "Mishneh_Torah,_The_Chosen_Temple.6.2"], ["פסקי הרי״ד סוכה נג.", "Kovetz_Shitot_Kamai_Middot.53.1"], ["רבינו יהונתן סוכה נא:", "Kovetz_Shitot_Kamai_Middot.51.2"], ["מאירי מידות ב, ה", "Meiri_on_Middot.2.5"], ["הרא״ש מידות ב, ה", "Rosh_on_Mishnah_Middot.2.5"], ["מידות ב, ג", "Mishnah_Middot.2.3"]]]],
          current: "o0",
          onPick: (k) => { const S = ctx.shared.steps15; if (S && typeof S.set === "function") S.set(k === "o1" ? "rid" : "rambam"); },
          fly: (k) => { const c = {"o0": [[141, 33, 37], [104, 9.5, 5]], "o1": [[150, 44, 34], [100, 9.5, 0]]}[k]; if (c && c[0] && c[1]) fly(c[0], c[1]); if (c && c[1] && ctx.shared.fadeHold) ctx.shared.fadeHold.set(c[1]); }
        });
        opRow({   // TERUAH_305
          id: "sh60", short: "התקיעות בהליכה לשער המזרח — שמחת בית השואבה", cardFly: true,
          cap: "התקיעות בהליכה לשער המזרח — שמחת בית השואבה",
          refs: [["סוכה ה, ד", "Mishnah_Sukkah.5.4"], ["סוכה ה, ה", "Mishnah_Sukkah.5.5"], ["ברטנורא סוכה ה, ה", "Bartenura_on_Mishnah_Sukkah.5.5"], ["תוספות יום טוב סוכה ה, ד", "Tosafot_Yom_Tov_on_Mishnah_Sukkah.5.4"], ["יכין סוכה ה, ה", {"book": 772, "index": 581}]],
          options: [["o0", "רש״י וברטנורא — התקיעה, התרועה והתקיעה של העזרה נמשכות בהליכה", "לשון המשנה (סוכה ה, ד): ״הגיעו לעזרה, תקעו והריעו ותקעו. היו תוקעין והולכין, עד שמגיעין לשער היוצא מזרח״.\n**רש״י:** ״והיו תוקעין והולכין — באלו שלש אחרונות מאריכין עד שמגיעין לשער היוצא מעזרת נשים להר הבית״. וכך הברטנורא (סוכה ה, ה): ״הגיעו לעזרה תקעו והריעו ותקעו. ומאריכין בהן עד שהגיעו לשער התחתון, כדתנן היו תוקעין והולכין״; ותוספות יום טוב (סוכה ה, ד): ״ומאריכין בהן עד שמגיעין וכו׳ רש״י, וכפירוש הר״ב במשנה דלקמן״.\nבהדגמה: מן העזרה ועד השער היוצא למזרח — תקיעה ארוכה, תרועה ארוכה ותקיעה ארוכה, והכהנים הולכים. אורכן — בחירת מודל."],
            ["o1", "תפארת ישראל — תקיעה בלי תרועה", "לשון המשנה (סוכה ה, ד): ״היו תוקעין והולכין, עד שמגיעין לשער היוצא מזרח״.\n**תפארת ישראל** (יכין, סוכה ה, ה): ״הך תנא ס״ל שלא תקעו למעלה העשירית, ואע״ג דגם לאחר מעלה עשירית קאמר תוקעין והולכין, היינו רק תקיעה בלי תרועה״.\nבהדגמה: אחרי התקיעה, התרועה והתקיעה שבעזרה — שלוש תקיעות ארוכות בהליכה, בלי תרועה. מספרן ואורכן — בחירת מודל."]],
          current: "o0",
          onPick: (k) => { const W = ctx.shared.simchaWalk; if (W && typeof W.set === "function") W.set(k === "o1" ? "tyt" : "rashi"); },
          fly: () => { const c = [[205, 42, 62], [150, 9, 0]]; fly(c[0], c[1]); if (ctx.shared.fadeHold) ctx.shared.fadeHold.set(c[1]); }
        });
        opRow({
          id: "sh7", short: "לשכת בית האבן — מקומה", cardFly: true,
          cap: "לשכת בית האבן — מקומה",
          refs: [["פרה ג, א", "Mishnah_Parah.3.1"], ["יומא ב.", "Yoma.2a"], ["רש״י יומא ב.", "Rashi_on_Yoma.2.1"], ["רמב״ם פרה אדומה ב, א", "Rambam_Parah_Adumah.2.1"], ["תוספות יומא ב.", "Tosafot_on_Yoma.2.1"], ["ברטנורא פרה ג, א", "Bartenura_on_Mishnah_Parah.3.1"]],
          options: [["o0", "רש״י והרמב״ם — בעזרה, במקצוע מזרחית־צפונית", "לשון המשנה (פרה ג, א): ״שבעת ימים קדם לשרפת הפרה מפרישין כהן השורף את הפרה מביתו ללשכה שעל פני הבירה, צפונה מזרחה, ובית אבן היתה נקראת״.\n**הגמרא** (יומא ב.): ״ולמה נקרא שמה לשכת בית האבן — שכל מעשיה בכלי גללים, בכלי אבנים, ובכלי אדמה״; ״מאי בירה? אמר רבה בר בר חנה אמר רבי יוחנן: מקום היה בהר הבית ובירה שמו. וריש לקיש אמר: כל המקדש כולו קרוי בירה״.\n**רש״י** (יומא ב.): ״צפונה מזרחה — במקצוע מזרחית צפונית של עזרה היתה״. **הרמב״ם** (פרה אדומה ב, א): ״מפרישין אותו ללשכה מוכנת בעזרה. ובית אבן היתה נקראת מפני שכל כליה כלי אבנים שאין מקבלין טמאה״.\nבמודל (ברירת המחדל): עלייה על הגג של בניין שלוש הלשכות, בקרן המזרחית־הצפונית של העזרה — שהקרן עצמה תפוסה בבניין הזה. הקומה, הגודל, הפתח והדרך לעלות אליה — בחירת מודל.", [["פרה ג, א", "Mishnah_Parah.3.1"], ["יומא ב.", "Yoma.2a"], ["רש״י יומא ב.", "Rashi_on_Yoma.2.1"], ["רמב״ם פרה אדומה ב, א", "Rambam_Parah_Adumah.2.1"], ["תוספות יומא ב.", "Tosafot_on_Yoma.2.1"], ["ברטנורא פרה ג, א", "Bartenura_on_Mishnah_Parah.3.1"]]], ["o1", "תוספות — חוץ לעזרה", "לשון המשנה (פרה ג, א): ״שבעת ימים קדם לשרפת הפרה מפרישין כהן השורף את הפרה מביתו ללשכה שעל פני הבירה, צפונה מזרחה, ובית אבן היתה נקראת״.\n**הגמרא** (יומא ב.): ״ולמה נקרא שמה לשכת בית האבן — שכל מעשיה בכלי גללים, בכלי אבנים, ובכלי אדמה״; ״מאי בירה? אמר רבה בר בר חנה אמר רבי יוחנן: מקום היה בהר הבית ובירה שמו. וריש לקיש אמר: כל המקדש כולו קרוי בירה״.\n**תוספות** (יומא ב., ד״ה ומאי שנא): ״אבל פרה שנעשית מחוץ בהר המשחה פרישתו ללשכה שעל פני הבירה שחוץ לעזרה״.\nבמודל: לשכה קטנה מקורה בהר הבית, מצפון־מזרח לעזרה ומחוץ לה. מקומה המדויק, גודלה ופתחה — בחירת מודל.", [["פרה ג, א", "Mishnah_Parah.3.1"], ["יומא ב.", "Yoma.2a"], ["רש״י יומא ב.", "Rashi_on_Yoma.2.1"], ["רמב״ם פרה אדומה ב, א", "Rambam_Parah_Adumah.2.1"], ["תוספות יומא ב.", "Tosafot_on_Yoma.2.1"], ["ברטנורא פרה ג, א", "Bartenura_on_Mishnah_Parah.3.1"]]]],
          current: "o0",
          onPick: (k) => { const B = ctx.shared.beitEven; if (B && typeof B.set === "function") B.set(k === "o1" ? "tosafot" : "rashi"); },
          fly: (k) => { const c = {"o0": [[64, 52, -28], [87.5, 17, -62]], "o1": [[43.5, 15.8, -121.7], [78.4, 15.2, -87.9]]}[k]; if (c && c[0] && c[1]) fly(c[0], c[1]); }
        });
        opRow({
          id: "sh8", short: "מקום שתי הסנהדראות הקטנות", cardFly: true,
          cap: "מקום שתי הסנהדראות הקטנות",
          refs: [["סנהדרין יא, ב", "Mishnah_Sanhedrin.11.2"], ["רש״י סנהדרין פו:", "Rashi_on_Sanhedrin.86.2"], ["רמב״ם סנהדרין א, ג", "Rambam_Sanhedrin.1.3"], ["מאירי סנהדרין יז.", "Meiri_on_Sanhedrin.17.1"], ["סנהדרין ד, ג", "Mishnah_Sanhedrin.4.3"], ["סנהדרין ד, ד", "Mishnah_Sanhedrin.4.4"]],
          options: [["o0", "רש״י — אצל שער עזרת נשים", "לשון המשנה (סנהדרין יא, ב): ״שלשה בתי דינין היו שם, אחד יושב על פתח הר הבית, ואחד יושב על פתח העזרה, ואחד יושב בלשכת הגזית״.\n**רש״י** (פו:): ״אחד יושב על פתח הר הבית — הוא שער המזרחי שלפנים מן החיל לפני עזרת נשים״; ״ואחד יושב למעלה הימנו — כשעברו עזרת נשים ובאין לפני עזרת ישראל״.\nבמודל (ברירת המחדל): בית הדין שעל פתח הר הבית — בלשכה אצל השער המזרחי של עזרת נשים, מחוץ לסורג, מצפון לדרך אל השער; ובית הדין שעל פתח העזרה — בלשכה שלפני שער ניקנור, בעזרת נשים, מצפון־מזרח למעלות. מקומן המדויק של הלשכות — בחירת מודל.", [["סנהדרין יא, ב", "Mishnah_Sanhedrin.11.2"], ["רש״י סנהדרין פו:", "Rashi_on_Sanhedrin.86.2"], ["רמב״ם סנהדרין א, ג", "Rambam_Sanhedrin.1.3"], ["מאירי סנהדרין יז.", "Meiri_on_Sanhedrin.17.1"], ["סנהדרין ד, ג", "Mishnah_Sanhedrin.4.3"], ["סנהדרין ד, ד", "Mishnah_Sanhedrin.4.4"]]], ["o1", "כפשט המשנה — אצל שער הר הבית", "לשון המשנה (סנהדרין יא, ב): ״שלשה בתי דינין היו שם, אחד יושב על פתח הר הבית, ואחד יושב על פתח העזרה, ואחד יושב בלשכת הגזית״.\n**הרמב״ם** (סנהדרין א, ג): ״ועוד מעמידין שני בתי דינין של עשרים ושלשה עשרים ושלשה אחד על פתח העזרה ואחד על פתח הר הבית״. **המאירי** (סנהדרין יז.): ״וסנהדרי קטנה היו בירושלים שנים אחד על פתח העזרה ואחד על פתח הר הבית״.\nבשיטה זו ״פתח הר הבית״ כפשוטו — אצל שער הר הבית עצמו, ולא אצל שער עזרת נשים כפירוש רש״י. מי שפירש כך במפורש — לא אומת בספרייה.\nבמודל: בית הדין בלשכה שבתוך הר הבית, אצל השער המזרחי (שער שושן), מצפון לדרך. איזה משערי הר הבית — לא נתפרש במשנה; בחירת מודל. בית הדין שעל פתח העזרה נשאר לפני שער ניקנור. מקומן המדויק של הלשכות — בחירת מודל.", [["סנהדרין יא, ב", "Mishnah_Sanhedrin.11.2"], ["רש״י סנהדרין פו:", "Rashi_on_Sanhedrin.86.2"], ["רמב״ם סנהדרין א, ג", "Rambam_Sanhedrin.1.3"], ["מאירי סנהדרין יז.", "Meiri_on_Sanhedrin.17.1"], ["סנהדרין ד, ג", "Mishnah_Sanhedrin.4.3"], ["סנהדרין ד, ד", "Mishnah_Sanhedrin.4.4"]]]],
          current: "o0",
          onPick: (k) => { const L = ctx.shared.lesserPlace; if (L && typeof L.set === "function") L.set(k === "o1" ? "mount" : "rashi"); },
          fly: (k) => { const c = {"o0": [[251.5, 31, 7], [251.5, 2, -15]], "o1": [[322.6, 31, 7], [322.6, 2, -15]]}[k]; if (c && c[0] && c[1]) fly(c[0], c[1]); if (ctx.shared.openFor) ctx.shared.openFor("crt-lishkot-roofs", 15000); }
        });
        opRow({
          id: "sh9", short: "שער העליון", cardFly: true,
          cap: "שער העליון",
          refs: [["מידות א, ד", "Mishnah_Middot.1.4"], ["שקלים ו, ג", "Mishnah_Shekalim.6.3"], ["ברטנורא שקלים ו, ג", "Bartenura_on_Mishnah_Shekalim.6.3"], ["תוי״ט שקלים ו, ג", "Tosafot_Yom_Tov_on_Mishnah_Shekalim.6.3"], ["מידות ב, ו", "Mishnah_Middot.2.6"], ["חק נתן מידות א, ד", "Chok_Natan_on_Mishnah_Middot.1.4"], ["תפא״י מידות ב, ו", "Yachin_on_Mishnah_Middot.2.6"], ["רמב״ם בית הבחירה ה, ה", "Mishneh_Torah,_The_Chosen_Temple.5.5"], ["רמב״ם כלי המקדש ז, ו", "Rambam_Klei_HaMikdash.7.6"], ["משנה סוכה ה, ד", "Mishnah_Sukkah.5.4"], ["משנה סוכה ה, ה", "Mishnah_Sukkah.5.5"], ["ברטנורא סוכה ה, ה", "Bartenura_on_Mishnah_Sukkah.5.5"], ["תוי״ט סוכה ה, ד", "Tosafot_Yom_Tov_on_Mishnah_Sukkah.5.4"], ["תוי״ט מידות ב, ו", "Tosafot_Yom_Tov_on_Mishnah_Middot.2.6"]],
          options: [["o0", "חכמים — שבעה שערים", "לשון המשנה (מידות א, ד): ״שבעה שערים היו בעזרה, שלשה בצפון ושלשה בדרום ואחד במזרח. שבדרום, שער הדלק. שני לו, שער הבכורות. שלישי לו, שער המים״ — במניין חכמים אין ״שער העליון״.\nבמודל: שבעת השערים, בחלק המערבי של הכתלים (רמב״ם בית הבחירה ה, ד), ושני הפשפשין של שער ניקנור.", [["מידות א, ד", "Mishnah_Middot.1.4"]]], ["o1", "אבא יוסי בן חנן — שלושה עשר שערים", "לשון המשנה (שקלים ו, ג; מידות ב, ו): ״ארבע בצפון, וארבע בדרום, שלש במזרח, ושתים במערב, כנגד שלשה עשר שערים. שערים דרומיים סמוכין למערב, שער העליון, שער הדלק, שער הבכורות, שער המים... לעמתן בצפון סמוכין למערב, שער יכניה, שער קרבן, שער נשים, שער השיר... במזרח, שער ניקנור, ושני פשפשין היו לו... ושנים במערב שלא היה להם שם״.\nברטנורא (שקלים ו, ג): ״הר הבית היה משפע ועולה ממזרח למערב, והשער הסמוך למערב הוא שער העליון״.\nתוספות יום טוב (שקלים ו, ג): ״שער העליון. לא אתפרש מה היה משמש״; בדרום ״מחסרי שער העליון ואינך ניקבו בשמותן ובסידרן״, ובצפון ״מחסרי חד ושינו בשמותן שקראום ניצוץ וקרבן ומוקד״; ובשם התוספות (כתובות קו.): ״דלכולי עלמא היו י״ג שערים וז׳ היו גדולים וששה היו קטנים״; ושני שערי המערב — ״וקטנים היו ולא היו משמשין כלום אלא לעת הצורך הגדול״.\nבמודל: שבעת השערים הגדולים כמשנה, ועוד ארבעה שערים קטנים (ארבע על שמונה אמות, כפשפשי ניקנור): שער העליון בדרום, ממערב לשער הדלק; שער הנשים בצפון, בין שער הקרבן לבית המוקד; ושניים בכותל המערבי. שמות שערי הצפון — כתפארת ישראל וכחק נתן: שער הניצוץ הוא שער יכניה, שער הקרבן, שער הנשים הקטן, ושער בית המוקד הוא שער השיר. מקום השערים הקטנים בכותל — בחירת מודל.\nבמודל: במבט הכללי עומדת דסקית מעל כל שער — זהובה מעל שבעת הגדולים ואדומה מעל ששת הקטנים — כדי שיימנו מרחוק.", [["שקלים ו, ג", "Mishnah_Shekalim.6.3"], ["ברטנורא שקלים ו, ג", "Bartenura_on_Mishnah_Shekalim.6.3"], ["תוי״ט שקלים ו, ג", "Tosafot_Yom_Tov_on_Mishnah_Shekalim.6.3"], ["מידות ב, ו", "Mishnah_Middot.2.6"], ["חק נתן מידות א, ד", "Chok_Natan_on_Mishnah_Middot.1.4"], ["תפא״י מידות ב, ו", "Yachin_on_Mishnah_Middot.2.6"]]], ["o2", "הרמב״ם — שער ניקנור", "הרמב״ם (בית הבחירה ה, ה): ״חוץ משער מזרחי שהיה מצפה נחשת דומה לזהב. ושער זה הוא הנקרא שער העליון והוא שער ניקנור״. ובהלכות כלי המקדש (ז, ו): ״שלש לפתיחת שער התחתון והוא שער עזרת נשים ושלש לפתיחת שער העליון הוא שער נקנור ולמה נקרא שער עליון לפי שהוא למעלה מעזרת נשים״.\nמקורו במשנה בסוכה, בשמחת בית השואבה שבעזרת הנשים (ה, ד): ״ועמדו שני כהנים בשער העליון שיורד מעזרת ישראל לעזרת נשים... היו תוקעין והולכין, עד שמגיעין לשער היוצא מזרח״; ושם (ה, ה): ״שלש לשער העליון, ושלש לשער התחתון״. ברטנורא (סוכה ה, ה): השער התחתון — ״שער היוצא ממזרח״.\nתוספות יום טוב (סוכה ה, ד): ״בשער העליון. והוא שער הנקנור. ולמה נקרא שער העליון. לפי שהוא למעלה מעזרת נשים״ — ״וכלומר דלא תטעה שהוא שער העליון שבדרום״ (שקלים ו, ג; מידות ב, ו); ובירושלמי (עירובין פרק ה) — שבעה שמות היו לשער, ואחד מהם ״שער העליון״. ובמידות (ב, ו) הוא כותב שהשם מושאל שם לשער המזרח, ושער העליון שבמשנה שם ודאי בדרום.\nבמודל: על שער ניקנור נכתבת התווית: שער העליון — כך קורא הרמב״ם לשער ניקנור.", [["רמב״ם בית הבחירה ה, ה", "Mishneh_Torah,_The_Chosen_Temple.5.5"], ["רמב״ם כלי המקדש ז, ו", "Rambam_Klei_HaMikdash.7.6"], ["משנה סוכה ה, ד", "Mishnah_Sukkah.5.4"], ["משנה סוכה ה, ה", "Mishnah_Sukkah.5.5"], ["ברטנורא סוכה ה, ה", "Bartenura_on_Mishnah_Sukkah.5.5"], ["תוי״ט סוכה ה, ד", "Tosafot_Yom_Tov_on_Mishnah_Sukkah.5.4"], ["תוי״ט מידות ב, ו", "Tosafot_Yom_Tov_on_Mishnah_Middot.2.6"]]]],
          current: "o0",
          tourThen: {"o1": [{"cam": [-150, 62, 118], "tg": [-86, 16, 40]}, {"cam": [-40, 46, -110], "tg": [-36, 22, -67]}]},
          onPick: (k) => { if (ctx.shared.gates13 && typeof ctx.shared.gates13.set === "function") ctx.shared.gates13.set(["seven", "thirteen", "nikanor"][+k.slice(1)] || "seven"); const r21 = OPS.find((r) => r.cap.indexOf("שמות שערי הצפון") === 0); if (r21 && r21.cur !== "o0" && typeof r21.mark === "function") r21.mark("o0"); },
          fly: (k) => { const c = {"o0": [[175, 205, 215], [-12, 6, 4]], "o1": [[175, 205, 215], [-12, 6, 4]], "o2": [[165, 44, 22], [97, 30, 0]]}[k]; if (c && c[0] && c[1]) fly(c[0], c[1]); if (c && c[1] && ctx.shared.fadeHold) ctx.shared.fadeHold.set(c[1]); const G = ctx.shared.houseGhost; if (G && typeof G.set === "function") { G.set(true); ctx.ui.autoOff.arm("__ghost", () => { try { G.set(false); } catch (_) {} }); } }
        });
        opRow({
          id: "sh10", short: "הדוכן ומעלות עזרת הכהנים", cardFly: true,
          cap: "הדוכן ומעלות עזרת הכהנים",
          refs: [["מידות ב, ו", "Mishnah_Middot.2.6"], ["ברטנורא ב, ו", "Bartenura_on_Mishnah_Middot.2.6"], ["תפא״י ב, ו", "Yachin_on_Mishnah_Middot.2.6"], ["חזון איש (אורח חיים, מועד) על מידות ב, ו", "Chazon_Ish_OC.126"]],
          options: [["o0", "ברטנורא — מעלה לכל רוחב העזרה", "לשון המשנה (מידות ב, ו): ״רבי אליעזר בן יעקב אומר, מעלה היתה שם, וגבוהה אמה, והדוכן נתון עליה, ובה שלש מעלות של חצי חצי אמה. נמצאת עזרת הכהנים גבוהה מעזרת ישראל שתי אמות ומחצה״.\nלברטנורא המעלה בעזרת ישראל, גבוהה אמה וארוכה כאורך כל העזרה, והדוכן של הלויים בנוי עליה כמין אצטבא, ובו שלוש מעלות של חצי אמה.\nבמודל (ברירת המחדל): מעלה של אמה לכל רוחב העזרה, ועליה הדוכן ושלוש מעלותיו.", [["מידות ב, ו", "Mishnah_Middot.2.6"], ["ברטנורא ב, ו", "Bartenura_on_Mishnah_Middot.2.6"], ["תפא״י ב, ו", "Yachin_on_Mishnah_Middot.2.6"], ["חזון איש (אורח חיים, מועד) על מידות ב, ו", "Chazon_Ish_OC.126"]]], ["o1", "החזון איש — לשכת הדוכן, כנגד המזבח", "החזון איש (אורח חיים, מועד), על מידות ב, ו: ״נראה דהמעלה היתה כעין לשכה כנוסה בזקיפת ההר של עזרת כהנים, שהרי עזרת כהנים גבוהה מעזרת ישראל ב׳ אמות ומחצה על פני כל המזרח מדרום לצפון, וכנגד המזבח נכנסה לשכה, ארכה כנגד אורך המזבח ורחבה לא אתפרש״; ״ובה בנוי כעין בימה לעלות הלוים לדוכן בשיר על הקרבן, והיו מעלות לעלות על הבימה, וכן היו מעלות בנויות בה לעלות לעזרת כהנים, והלשכה הלזו היתה רצפה שלה גבוה אמה מעזרת ישראל״; ״והיו בלשכה ג׳ מעלות של חצי חצי אמה לעלות ממנה לעזרת כהנים, ומעלות אלו לא נתפרשו באיזה רוח היו״. ועוד שם: ״והכניסה ללשכת הדוכן היתה ממזרח מעזרת ישראל״; ״ומסתבר דהיתה מעלה חצי אמה לעלות ללשכת הדוכן״.\nבמודל: עזרת הכהנים גבוהה שתי אמות ומחצה לכל רוחב המזרח; וכנגד המזבח (במקומו שבברירת המחדל) לשכה כנוסה בה, שלושים ושתיים אמה אורכה, ורצפתה אמה מעל עזרת ישראל. לפניה, בעזרת ישראל, מעלה של חצי אמה. בתוכה בימה ללויים ושלוש מעלות לפניה; ובשני קצותיה שלוש מעלות של חצי אמה לעזרת הכהנים. רוחב הלשכה (שש אמות), הבימה ומידותיה, ומקום המעלות — בחירת מודל.", [["מידות ב, ו", "Mishnah_Middot.2.6"], ["ברטנורא ב, ו", "Bartenura_on_Mishnah_Middot.2.6"], ["תפא״י ב, ו", "Yachin_on_Mishnah_Middot.2.6"], ["חזון איש (אורח חיים, מועד) על מידות ב, ו", "Chazon_Ish_OC.126"]]]],
          current: "o0",
          onPick: (k) => { const D = ctx.shared.duchanReading; if (D && typeof D.set === "function") D.set(k === "o1" ? "chazonIsh" : "mishnah"); },
          fly: (k) => { const c = {"o0": [[89.6, 27, 30], [79.5, 15, 8]], "o1": [[89.6, 27, 30], [79.5, 15, 8]]}[k]; if (c && c[0] && c[1]) fly(c[0], c[1]); }
        });
        opRow({
          id: "sh11", short: "שורות התלמידים שלפני הסנהדרין", cardFly: true,
          cap: "שורות התלמידים שלפני הסנהדרין",
          refs: [["סנהדרין ד, ג", "Mishnah_Sanhedrin.4.3"], ["סנהדרין ד, ד", "Mishnah_Sanhedrin.4.4"], ["רש״י סנהדרין לו:", "Rashi_on_Sanhedrin.36.2"], ["רש״י סנהדרין לז.", "Rashi_on_Sanhedrin.37.1"], ["יד רמה סנהדרין לו:", "Yad_Ramah_on_Sanhedrin.36.2"]],
          options: [["o0", "רש״י — אף הן כעגולה", "לשון המשנה (סנהדרין ד, ד): ״ושלש שורות של תלמידי חכמים יושבין לפניהם, כל אחד ואחד מכיר את מקומו״. רש״י (לז.): ״ושלש שורות — כל אחת כמנין סנהדרי עשרים ושלשה״; ״יושבין לפניהן — אף הן כעגולה, אלא שהגדולים יושבין על הספסלין והתלמידים על הקרקע״.\nבמודל (ברירת המחדל): שלוש שורות של עשרים ושלושה, כחצי גורן, לפנים משורת הדיינים, יושבים על הקרקע. הרווח שבין השורות — בחירת מודל. וכן בשתי הסנהדראות הקטנות — שלוש שורות לפני כל בית דין.", [["סנהדרין ד, ג", "Mishnah_Sanhedrin.4.3"], ["סנהדרין ד, ד", "Mishnah_Sanhedrin.4.4"], ["רש״י סנהדרין לו:", "Rashi_on_Sanhedrin.36.2"], ["רש״י סנהדרין לז.", "Rashi_on_Sanhedrin.37.1"], ["יד רמה סנהדרין לו:", "Yad_Ramah_on_Sanhedrin.36.2"]]], ["o1", "יד רמה — שורות פשוטות", "יד רמה (סנהדרין לו:): ״והני שלש שורות של תלמידים משמע דשורות פשוטות היו ולא בעיגול, חדא מדלא קתני בהו עגולות כדקתני גבי סנהדרי״; ״כלומר שעומדין בשורה אחת בשוה זה בצד זה, ואע״פ שלא היו רואין זה את זה לא אכפת לן, מאחר שרואין פני הסנהדרין והסנהדרין רואין את פניהם״.\nבמודל: שלוש שורות ישרות של עשרים ושלושה, זו אחר זו, לפני הדיינים. וכן בשתי הסנהדראות הקטנות — שלוש שורות לפני כל בית דין.", [["סנהדרין ד, ג", "Mishnah_Sanhedrin.4.3"], ["סנהדרין ד, ד", "Mishnah_Sanhedrin.4.4"], ["רש״י סנהדרין לו:", "Rashi_on_Sanhedrin.36.2"], ["רש״י סנהדרין לז.", "Rashi_on_Sanhedrin.37.1"], ["יד רמה סנהדרין לו:", "Yad_Ramah_on_Sanhedrin.36.2"]]]],
          current: "o0",
          onPick: (k) => { const S = ctx.shared.sanhedrinRows; if (S && typeof S.set === "function") S.set(k === "o1" ? "straight" : "round"); },
          fly: (k) => { const c = {"o0": [[77, 46, -50], [74.5, 16.5, -67]], "o1": [[77, 46, -50], [74.5, 16.5, -67]]}[k]; if (c && c[0] && c[1]) fly(c[0], c[1]); if (ctx.shared.openFor) ctx.shared.openFor("crt-lishkot-roofs", 15000); }
        });
        opRow({
          id: "sh12", short: "הפייס הראשון — היכן ומתי", cardFly: true,
          cap: "הפייס הראשון — היכן ומתי",
          refs: [["רמב״ם תמידין ומוספין ו, א", "Mishneh_Torah,_Daily_Offerings_and_Additional_Offerings.6.1"], ["רמב״ם תמידין ומוספין ד, א", "Mishneh_Torah,_Daily_Offerings_and_Additional_Offerings.4.1"], ["הר המוריה תמידין ומוספין ו, א", "Har_HaMoriah_on_Temidin.6.1"], ["תמיד א, ב", "Mishnah_Tamid.1.2"], ["תמיד א, ג", "Mishnah_Tamid.1.3"], ["תמיד ב, ה", "Mishnah_Tamid.2.5"], ["תמיד ג, א", "Mishnah_Tamid.3.1"], ["תפא״י תמיד א, ב", "Yachin_on_Mishnah_Tamid.1.2"]],
          options: [["o0", "הרמב״ם — עם השני, בלשכת הגזית", "**הרמב״ם** (תמידין ומוספין ו, א): ״סמוך לעלות השחר יבוא הממנה שעל הפיסות ויקיש על העזרה ופותחין לו. ומבלשין את כל העזרה. ומעמידין עושי חביתין לעשות החביתין. וכל הכהנים ששם כבר טבלו קדם שיבוא הממנה ולבשו בגדי כהנה. ויבואו ויעמדו בלשכת הגזית. ויפיסו פיס ראשון ושני ויזכה כל אחד במלאכתו כמו שבארנו. ומתחיל זה שזכה בתרומת הדשן ותורם על הסדר שאמרנו״. ועוד שם (ד, א): ״כל כהני בתי אבות של יום נכנסין ללשכת הגזית אחר שיעלה עמוד השחר ומלבשין הן בבגדי כהנה״.\nבקצרה — **הר המוריה** (על הרמב״ם שם) מעיר שבמשנה משמע אחרת: ״רק הפייס דתרוה״ד היה קודם העמדת עושי חביתין ובאמת משמע כן שם במשנה ב' וזה שלא כדמשמע מדברי רבינו כאן בהלכה א'״.\nבמודל: בהדגמה, אחרי בדיקת העזרה באבוקות, הכהנים עומדים בלשכת הגזית ומפיסים פייס ראשון ושני, זה אחר זה.", [["רמב״ם תמידין ומוספין ו, א", "Mishneh_Torah,_Daily_Offerings_and_Additional_Offerings.6.1"], ["רמב״ם תמידין ומוספין ד, א", "Mishneh_Torah,_Daily_Offerings_and_Additional_Offerings.4.1"], ["הר המוריה תמידין ומוספין ו, א", "Har_HaMoriah_on_Temidin.6.1"], ["תמיד א, ב", "Mishnah_Tamid.1.2"]]], ["o1", "תפארת ישראל — בלילה, בבית המוקד", "לשון המשנה (תמיד א, ב): ״הממנה בא ודופק עליהם, והם פתחו לו. אמר להן, מי שטבל יבא ויפיס. הפיסו, זכה מי שזכה״; ואחר כך (א, ג): ״נטל את המפתח ופתח את הפשפש, ונכנס מבית המוקד לעזרה״; והפייס השני — רק אחרי ״וירדו ובאו להם ללשכת הגזית״ (ב, ה): ״אמר להם הממנה, באו והפיסו״ (ג, א).\n**תפארת ישראל** (תמיד א, ב): ״מדהיו ישנים בחצי בית המוקד הבנוי בחול, לפיכך אמר שיבואו לחצי האחר הבנוי בקודש, דצריכים להטיל גורל במקום הקודש״. ״והא דלא הטילו גם גורל זה בלשכת הגזית כשאר הגורלות… הכא היו הכל כנוסים בבית המוקד שבמערב עזרה, וטריחא מלתא ללכת לגזית״. ועוד טעם: ״פייסו בלילה, ועדיי[ן] לא היו הסנהדרין בגזית״.\nבמודל — ברירת המחדל: בהדגמה הפייס הראשון נערך בלילה, בחצי בית המוקד שבקודש; אחריו בדיקת העזרה באבוקות ותרומת הדשן, ושלושת הפייסות האחרים בלשכת הגזית.", [["תמיד א, ב", "Mishnah_Tamid.1.2"], ["תמיד א, ג", "Mishnah_Tamid.1.3"], ["תמיד ב, ה", "Mishnah_Tamid.2.5"], ["תמיד ג, א", "Mishnah_Tamid.3.1"], ["תפא״י תמיד א, ב", "Yachin_on_Mishnah_Tamid.1.2"]]]],
          current: "o1",
          onPick: (k) => { const S0 = ctx.shared, linked = !!S0.__lotsLink; if (S0.payis && typeof S0.payis.setReading === "function") S0.payis.setReading(k === "o1" ? "tamid" : "rambam"); if (!linked && S0.openFor) S0.openFor("crt-lishkot-roofs", 15000); const S = ctx.shared; if (!S.__lotsLink) { S.__lotsLink = true; try { const R = ((ctx.ui && ctx.ui.opinions) || []).find((r) => /^סדר עבודת הבוקר/.test(String(r.cap || ""))); const w = k === "o1" ? "o0" : "o1"; if (R && R.cur !== w && typeof R.onPick === "function") { R.onPick(w); if (typeof R.mark === "function") R.mark(w); } } catch (_) {} S.__lotsLink = false; } },
          fly: (k) => { const c = {"o0": [[84.6, 41, -47.5], [83.6, 16.6, -66.6]], "o1": [[-18, 76, -50], [-18, 15, -67]]}[k]; if (c && c[0] && c[1]) fly(c[0], c[1]); }
        });
        opRow({
          id: "sh13", short: "אבנטו של כהן הדיוט", cardFly: true,
          cap: "אבנטו של כהן הדיוט",
          refs: [["רמב״ם כלי המקדש ח, א", "Rambam_Klei_HaMikdash.8.1"], ["רמב״ם כלי המקדש ח, ב", "Rambam_Klei_HaMikdash.8.2"], ["רמב״ם כלי המקדש ח, יא", "Rambam_Klei_HaMikdash.8.11"], ["רמב״ם כלי המקדש ח, יג", "Rambam_Klei_HaMikdash.8.13"], ["כסף משנה כלי המקדש ח, א", "Kesef_Mishneh_on_Klei_HaMikdash.8.1"], ["רמב״ן שמות לט, כח", "Ramban_on_Exodus.39.28"], ["יומא יב:", "Yoma.12b"]],
          options: [["o0", "הרמב״ם, כרבי — רקום בצמר צבוע", "**הרמב״ם** (כלי המקדש ח, א): ״וארבעתן של פשתן לבנים וחוטן כפול ששה. והאבנט לבדו רקום בצמר״. ועוד שם (ח, ב): ״ואבנטו של כהן גדול מעשה רקם הוא והוא דומה במעשיו לאבנט כהן הדיוט״; (ח, יא): ״בגדי כהנה מתר להנות בהן. לפיכך לבשם ביום עבודתו ואפלו שלא בשעת עבודה חוץ מן האבנט מפני שהוא שעטנז״.\n**כסף משנה**: ״לא נחלקו אלא באבנטו של כהן הדיוט בין בשאר ימות השנה בין בי״ה שרבי אומר של כלאים ורבי אלעזר בר״ש אומר של בוץ וידוע שהלכה כרבי מחבירו״.\n**רמב״ן** (שמות לט, כח): ״נודע שהוא רקום בארבע מינין הללו… והאבנט הזה הוא גם באהרן ובניו כדעת האומר (יומא יב) אבנטו של כהן גדול זהו אבנטו של כהן הדיוט״.\nהצבעים — הרמב״ם (ח, יג): ״ותכלת האמורה בכל מקום היא הצמר הצבוע כעצם שמים שהוא פתוך מן הכחל. הארגמן הוא הצמר הצבוע אדום. ותולעת השני הוא הצמר הצבוע בתולעת״.\nבמודל — ברירת המחדל: האבנט ארוג חוטים דקים — תכלת, ארגמן, תולעת שני ולבן — שצבעיהם מתמזגים לגוון אחד. לחיצה מעמידה שלושה כהנים בעזרת הכהנים לרבע דקה; ובהדגמת הפייסות, ברגע הבגדים, השיטה השנייה מוצגת לכמה שניות.", [["רמב״ם כלי המקדש ח, א", "Rambam_Klei_HaMikdash.8.1"], ["רמב״ם כלי המקדש ח, ב", "Rambam_Klei_HaMikdash.8.2"], ["רמב״ם כלי המקדש ח, יא", "Rambam_Klei_HaMikdash.8.11"], ["רמב״ם כלי המקדש ח, יג", "Rambam_Klei_HaMikdash.8.13"], ["כסף משנה כלי המקדש ח, א", "Kesef_Mishneh_on_Klei_HaMikdash.8.1"], ["רמב״ן שמות לט, כח", "Ramban_on_Exodus.39.28"]]], ["o1", "רבי אלעזר ברבי שמעון — של בוץ", "בגמרא (יומא יב:): ״כי אתא רב דימי, אמר: אבנטו של כהן הדיוט, רבי ורבי אלעזר ברבי שמעון, חד אמר: של כלאים, וחד אמר: של בוץ״. ולפי **כסף משנה**: ״ורבי אלעזר בר״ש אומר של בוץ״.\n״בוץ״ הוא פשתן — הרמב״ם (כלי המקדש ח, יג): ״וכל מקום שנאמר בתורה שש או בד הוא הפשתים והוא הבוץ״.\n**רמב״ן** (שמות לט, כח): ״ועל דעת האומר (שם) לא זהו אבנטו של כהן הדיוט פרש בשל אהרן שהוא מעשה רוקם ולא הצרך להזכיר של בניו שהוא שש… וכלן שש ככתנות״.\nבמודל: האבנט כולו לבן, כשאר הבגדים. לחיצה מעמידה שלושה כהנים בעזרת הכהנים לרבע דקה.", [["יומא יב:", "Yoma.12b"], ["כסף משנה כלי המקדש ח, א", "Kesef_Mishneh_on_Klei_HaMikdash.8.1"], ["רמב״ם כלי המקדש ח, יג", "Rambam_Klei_HaMikdash.8.13"], ["רמב״ן שמות לט, כח", "Ramban_on_Exodus.39.28"]]]],
          current: "o0",
          onPick: (k) => { const P = ctx.shared.payis, T = ctx.shared.tamid; if (P && typeof P.setAvnet === "function") P.setAvnet(k === "o1" ? "butz" : "rambam"); { const PA = ctx.shared.peopleAvnet; if (PA) PA.set(k === "o1" ? "butz" : "rambam"); } if (T && T.active && typeof T.setBelt === "function") T.setBelt(k === "o1" ? "white" : "kilayim"); else if (P && typeof P.garments === "function") P.garments(15000); },
          fly: (k) => { const c = {"o0": [[85.4, 18.7, 0], [78.5, 17.9, 0]], "o1": [[85.4, 18.7, 0], [78.5, 17.9, 0]]}[k]; if (c && c[0] && c[1]) fly(c[0], c[1]); }
        });
        opRow({
          id: "sh14", short: "בית המטבחים — העמודים והאונקליות", cardFly: true,
          cap: "בית המטבחים — העמודים והאונקליות",
          refs: [["מידות ג, ה", "Mishnah_Middot.3.5"], ["ברטנורא מידות ג, ה", "Bartenura_on_Mishnah_Middot.3.5"], ["תוי״ט מידות ג, ה", "Tosafot_Yom_Tov_on_Mishnah_Middot.3.5"], ["צורת בית המקדש לתפארת ישראל", "Tzurat_Beit_HaMikdash_Tiferet.1.1"], ["מאירי מידות ג, ה", "Meiri_on_Middot.3.5"], ["רש״ש מידות ג, ה", {"book": 750, "index": 51}], ["מידות ה, ב", {"book": 89, "index": 37}], ["ביאור הגר״א מידות ה, ב", {"book": 7509, "index": 67}]],
          options: [["o0", "ברטנורא — חתיכת ארז על כל עמוד", "לשון המשנה (מידות ג, ה): ״בית המטבחים היה לצפונו של מזבח, ועליו שמנה עמודים ננסין, ורביעין של ארז על גביהן, ואנקליות של ברזל היו קבועין בהם, ושלשה סדרים היו לכל אחד ואחד, שבהם תולין״.\nברטנורא (מידות ג, ה): ״ורביעין של ארז — חתיכות מרבעות של ארז היו על העמודים״; ״ושלשה סדרים — של אנקליות זו למעלה מזו היו בכל חתיכת עץ, לתלות בהמה גדולה או קטנה״.\nבמודל (ברירת המחדל): על כל עמוד חתיכת ארז מרובעת, ובה שלושה סדרים של אונקליות — במזרח, בצפון ובדרום, ולא במערב, כראבי״ה (בתוספות יום טוב שם). שתי שורות של ארבעה עמודים, וכן בצורת בית המקדש לתפארת ישראל: ״בד׳ שורות מצפון לדרום, וכל שורה של ב׳ ב׳״. גובה העמודים והאונקליות — בחירת מודל.", [["מידות ג, ה", "Mishnah_Middot.3.5"], ["ברטנורא מידות ג, ה", "Bartenura_on_Mishnah_Middot.3.5"], ["תוי״ט מידות ג, ה", "Tosafot_Yom_Tov_on_Mishnah_Middot.3.5"], ["צורת בית המקדש לתפארת ישראל", "Tzurat_Beit_HaMikdash_Tiferet.1.1"]]], ["o1", "המאירי — קורות מעמוד לעמוד", "לשון המשנה (מידות ג, ה): ״בית המטבחים היה לצפונו של מזבח, ועליו שמנה עמודים ננסין, ורביעין של ארז על גביהן, ואנקליות של ברזל היו קבועין בהם, ושלשה סדרים היו לכל אחד ואחד, שבהם תולין״.\nהמאירי (מידות ג, ה): ״ועליהם רביעים של ארז, ר״ל כעין קורות קצרות באים מעמוד לעמוד, ואונקליאות של ברזל כעין קרסים קבועים בהם, ושלשה סדרים על כל אחד ואחד, ר״ל על כל אחד מן הרביעים, והם בשני הצדדים ושטח התחתון״.\nבמודל: קורת ארז קצרה מעמוד לעמוד לאורך כל שורה, ובכל קורה אונקליות בשני צדדיה ובתחתיתה. גובה העמודים ומספר האונקליות בכל קורה — בחירת מודל.", [["מידות ג, ה", "Mishnah_Middot.3.5"], ["מאירי מידות ג, ה", "Meiri_on_Middot.3.5"]]], ["o2", "הראבי״ה — שורה אחת ממזרח למערב, והשולחנות לפניה", "לשון המשנה (מידות ג, ה): ״בית המטבחים היה לצפונו של מזבח, ועליו שמנה עמודים ננסין, ורביעין של ארז על גביהן, ואנקליות של ברזל היו קבועין בהם, ושלשה סדרים היו לכל אחד ואחד, שבהם תולין״.\n**הראבי״ה** (בתוספות יום טוב מידות ג, ה): ״ונראה שלא היו העמודים וכן השלחנות מסודרים זה אצל זה, ארבע שורות של ב׳ ב׳ מסודרין זה אחר זה... אלא כל דממזרח למערב עמודים ח׳, שלחנות שמנה״.\n**הרש״ש** שם: ״דלהראבי״ה משמע דהעמודים הי׳ בסדר אחד ממזרח למערב וכן השלחנות לפניהם״.\nבמודל: שמונה העמודים בשורה אחת ממזרח למערב, ושמונה השולחנות בשורה משלהם לפניהם, לצד הטבעות — ארבע אמות מן הטבעות וארבע מן העמודים (מידות ה, ב: ״מן הטבעות לשלחנות ארבע, מן השלחנות ולננסין ארבע״). המרחק שבין עמוד לעמוד וגודל השולחנות — בחירת מודל.", [["מידות ג, ה", "Mishnah_Middot.3.5"], ["תוי״ט מידות ג, ה", "Tosafot_Yom_Tov_on_Mishnah_Middot.3.5"], ["רש״ש מידות ג, ה", {"book": 750, "index": 51}], ["מידות ה, ב", {"book": 89, "index": 37}]]], ["o3", "הגר״א — שורה אחת מצפון לדרום, שולחן בין עמוד לעמוד", "לשון המשנה (מידות ג, ה): ״בית המטבחים היה לצפונו של מזבח, ועליו שמנה עמודים ננסין, ורביעין של ארז על גביהן, ואנקליות של ברזל היו קבועין בהם, ושלשה סדרים היו לכל אחד ואחד, שבהם תולין״.\n**הגר״א** (מידות ה, ב): ״כי שמונה ננסין היו. נמצא היו ז׳ אוירים וכנגד כל אויר היה שולחן, הרי ז׳ שולחנות, ושולחן הח׳ הי׳ עמוד אצל הננס שבקצה מבחוץ, ואות׳ השולחן היה ד׳ אמות, וכל השולחנות היו עומדים בשורה אחת... הרי מן מקום שהתחילו השולחנות עד שהתחילו הננסין ד׳ אמות, דהיינו כאורך השולחן״.\nבמודל: שורה אחת מצפון לדרום. תחילה, לצד הטבעות, השולחן השמיני, שאורכו ארבע אמות; ואחריו עמוד, שולחן, עמוד — עד שמונה אמות מכותל העזרה (מידות ה, ב: ״מן הננסין לכתל העזרה שמנה אמות״). מקום השורה לרוחב העזרה, רוחב השולחנות, אורך השולחנות הקטנים והצד שבו האונקליות — בחירת מודל.", [["מידות ג, ה", "Mishnah_Middot.3.5"], ["ביאור הגר״א מידות ה, ב", {"book": 7509, "index": 67}], ["מידות ה, ב", {"book": 89, "index": 37}]]]],
          current: "o0",
          onPick: (k) => { const S = ctx.shared.slaughterLayout; if (S && typeof S.set === "function") S.set(["bartenura", "meiri", "raavyah", "gra"][+k.slice(1)] || "bartenura"); if (typeof ctx.shared.onkliot === "function") ctx.shared.onkliot(true); },
          fly: (k) => { const c = {"o0": [[51.75, 26, -36.5], [51.75, 18.5, -54]], "o1": [[51.75, 26, -36.5], [51.75, 18.5, -54]], "o2": [[51.75, 31, -30.5], [51.75, 17.5, -47.5]], "o3": [[70, 29, -49], [51.75, 17.5, -49.5]]}[k]; if (c && c[0] && c[1]) fly(c[0], c[1]); }
        });
        opRow({
          id: "sh15", short: "צפון לשחיטת קדשי קדשים", cardFly: true,
          cap: "צפון לשחיטת קדשי קדשים",
          refs: [["יומא לו.", {"book": 107, "index": 851}], ["רש״י יומא לו. (וכנגד כל המזבח)", {"book": 2157, "index": 1323}], ["רמב״ם בית הבחירה ה, טו–טז", {"book": 337, "index": 90}], ["רמב״ם מעשה הקרבנות ה, ב", {"book": 341, "index": 68}], ["רש״י יומא לו. (בין אולם ולמזבח)", {"book": 2157, "index": 1322}], ["רש״י יומא לו. (אף בין האולם למזבח)", {"book": 2157, "index": 1324}], ["רש״י יומא לו. (רבי מוסיף)", {"book": 2157, "index": 1325}], ["רש״י יומא לו. (דרבי נמי)", {"book": 2157, "index": 1330}]],
          options: [["o0", "רבי יוסי ברבי יהודה — כנגד המזבח בלבד", "לשון הברייתא (יומא לו.): ״איזהו צפון — מקיר של מזבח צפוני ועד כותל העזרה, וכנגד כל המזבח כולו צפון, דברי רבי יוסי ברבי יהודה״.\nרש״י: ״שלשים ושתים אמה שכנגד המזבח בצפון קרוי צפון לשחיטת קדשי קדשים, אבל שלא כנגד המזבח לצד מערב ולצד מזרח, אע״פ שהוא צפון העזרה, אינו צפון לשחיטה, דבעינן על ירך המזבח״.\nבמודל: בירוק — כנגד המזבח, מקירו הצפוני ועד כותל העזרה; ובאדום — ״מן החליפות ולפנים״, שבו ״הכל מודים שפסול״.", [["יומא לו.", {"book": 107, "index": 851}], ["רש״י יומא לו. (וכנגד כל המזבח)", {"book": 2157, "index": 1323}], ["רמב״ם בית הבחירה ה, טו–טז", {"book": 337, "index": 90}], ["רמב״ם מעשה הקרבנות ה, ב", {"book": 341, "index": 68}], ["רש״י יומא לו. (בין אולם ולמזבח)", {"book": 2157, "index": 1322}], ["רש״י יומא לו. (אף בין האולם למזבח)", {"book": 2157, "index": 1324}], ["רש״י יומא לו. (רבי מוסיף)", {"book": 2157, "index": 1325}], ["רש״י יומא לו. (דרבי נמי)", {"book": 2157, "index": 1330}]]], ["o1", "רבי אלעזר ברבי שמעון — אף בין האולם ולמזבח", "״רבי אלעזר ברבי שמעון מוסיף אף בין האולם ולמזבח״ (יומא לו.).\nרש״י: ״כל חלק צפוני לצד מערב, אע״פ שאינו ירך ממש, אבל חלק צפוני שמן המזרח ולמזבח לא״; ובמקום אחר: ״מחצי פתח ההיכל ולצפון בין האולם למזבח״.\nבמודל: בירוק — כנגד המזבח; ובכחול — תוספתו: בין האולם ולמזבח, מאמצע העזרה ולצפון.", [["יומא לו.", {"book": 107, "index": 851}], ["רש״י יומא לו. (וכנגד כל המזבח)", {"book": 2157, "index": 1323}], ["רמב״ם בית הבחירה ה, טו–טז", {"book": 337, "index": 90}], ["רמב״ם מעשה הקרבנות ה, ב", {"book": 341, "index": 68}], ["רש״י יומא לו. (בין אולם ולמזבח)", {"book": 2157, "index": 1322}], ["רש״י יומא לו. (אף בין האולם למזבח)", {"book": 2157, "index": 1324}], ["רש״י יומא לו. (רבי מוסיף)", {"book": 2157, "index": 1325}], ["רש״י יומא לו. (דרבי נמי)", {"book": 2157, "index": 1330}]]], ["o2", "רבי — אף מקום דריסת רגלי הכהנים וישראל (הגבול הדרומי כרש״י: אמצע העזרה)", "״רבי מוסיף אף מקום דריסת רגלי הכהנים ואף מקום דריסת רגלי ישראל. אבל מן החליפות ולפנים הכל מודים שפסול״ (יומא לו.).\nרש״י: ״אף כל צפון העזרה שבאחת עשרה אמה של מקום דריסת רגלי הכהנים עד כותל מזרחי של עזרה״; ורבי מודה גם בבין האולם ולמזבח: ״דרבי נמי אית ליה בין האולם ולמזבח צפון״.\nבמודל (ברירת המחדל): בירוק — כנגד המזבח (רבי יוסי ברבי יהודה); בכחול — בין האולם ולמזבח (תוספת רבי אלעזר ברבי שמעון); בכתום — מקום דריסת רגלי הכהנים ומקום דריסת רגלי ישראל (תוספת רבי); באדום — ״מן החליפות ולפנים״, שבו ״הכל מודים שפסול״. הגבול הדרומי של הכחול ושל הכתום — אמצע העזרה — כלשון רש״י בבין האולם ולמזבח: ״מחצי פתח ההיכל ולצפון״; ובתוספת רבי לשונו: ״כל צפון העזרה״. הגבול לשיטת הרמב״ם — באפשרות הבאה; איזו מן השתיים ברירת המחדל — בחירת מודל, וכן הצבעים.", [["יומא לו.", {"book": 107, "index": 851}], ["רש״י יומא לו. (וכנגד כל המזבח)", {"book": 2157, "index": 1323}], ["רמב״ם בית הבחירה ה, טו–טז", {"book": 337, "index": 90}], ["רמב״ם מעשה הקרבנות ה, ב", {"book": 341, "index": 68}], ["רש״י יומא לו. (בין אולם ולמזבח)", {"book": 2157, "index": 1322}], ["רש״י יומא לו. (אף בין האולם למזבח)", {"book": 2157, "index": 1324}], ["רש״י יומא לו. (רבי מוסיף)", {"book": 2157, "index": 1325}], ["רש״י יומא לו. (דרבי נמי)", {"book": 2157, "index": 1330}]]], ["o3", "רבי, והגבול הדרומי כרמב״ם: קו כותל המזבח הצפוני", "הרמב״ם (בית הבחירה ה, טו–טז): ״מכתל צפוני של עזרה עד כתל המזבח שהוא רחב ששים ומחצה. וכנגדו מכתל האולם עד כתל מזרחי של עזרה שהוא ארך שש ושבעים. כל המרבע הזה הוא הנקרא צפון, הוא המקום ששוחטין בו קדשי קדשים״ — כרבי, לאורך כל שש ושבעים האמות.\nבמודל: בירוק — כנגד המזבח; בכחול — בין האולם ולמזבח; בכתום — מקום דריסת רגלי הכהנים וישראל; והגבול הדרומי של הכחול ושל הכתום — קו כותל המזבח הצפוני, ולא אמצע העזרה.", [["יומא לו.", {"book": 107, "index": 851}], ["רש״י יומא לו. (וכנגד כל המזבח)", {"book": 2157, "index": 1323}], ["רמב״ם בית הבחירה ה, טו–טז", {"book": 337, "index": 90}], ["רמב״ם מעשה הקרבנות ה, ב", {"book": 341, "index": 68}], ["רש״י יומא לו. (בין אולם ולמזבח)", {"book": 2157, "index": 1322}], ["רש״י יומא לו. (אף בין האולם למזבח)", {"book": 2157, "index": 1324}], ["רש״י יומא לו. (רבי מוסיף)", {"book": 2157, "index": 1325}], ["רש״י יומא לו. (דרבי נמי)", {"book": 2157, "index": 1330}]]]],
          current: "o2",
          onPick: (k) => { const F = (ctx.shared.features || {}).northZones; if (F) { try { const was = !!F.isOn(); autoOff.run(F); if (!was) leaveFeat = F; } catch (_) {} } const N = ctx.shared.northZones; if (N && typeof N.set === "function") { if (typeof N.setLine === "function") N.setLine(k === "o3" ? "rambam" : "rashi"); N.set(["yose", "elazar", "rebbi", "rebbi"][+k.slice(1)] || "rebbi"); } },
          fly: (k) => { const c = {"o0": [[72, 112, 40], [40, 16, -30]], "o1": [[72, 112, 40], [40, 16, -30]], "o2": [[72, 112, 40], [40, 16, -30]], "o3": [[72, 112, 40], [40, 16, -30]]}[k]; if (c && c[0] && c[1]) fly(c[0], c[1]); }
        });
        opRow({   // RINGS_305 (the user, 20.11.2026 01:30: "מתג")
          id: "sh62", short: "סידור הטבעות — ששה של ארבע או ארבעה של שש", cardFly: true,
          cap: "סידור הטבעות (מידות ג, ה)",
          refs: [["מידות ג, ה", "Mishnah_Middot.3.5"], ["תוי״ט מידות ג, ה", "Tosafot_Yom_Tov_on_Mishnah_Middot.3.5"], ["מידות ה, ב", "Mishnah_Middot.5.2"]],
          options: [["o0", "תנא קמא — ששה סדרים של ארבע ארבע", "**המשנה** (מידות ג, ה): ״וטבעות היו לצפונו של מזבח, ששה סדרים של ארבע ארבע״.\n**רבינו שמעיה** (שם): ״ו׳ סדרים. היו הטבעות בשורה אחת ובכל סדר ארבעה טבעות, שהן כ״ד טבעות לכ״ד משמרות״ — כל סדר שורה אחת של ארבע.\nבמודל: שש שורות מצפון לדרום, ובכל אחת ארבע טבעות, בעשרים וארבע האמות של מקום הטבעות (מידות ה, ב)."],
            ["o1", "ויש אומרים — ארבעה של שש שש", "**המשנה** (מידות ג, ה): ״ויש אומרים, ארבעה של שש שש״.\n**רבינו שמעיה** (שם): ״וי״א ד׳ סדרים היו של שש שש טבעות, שהן נמי כ״ד״; וכך בתוספות יום טוב.\nבמודל: ארבע שורות מצפון לדרום, ובכל אחת שש טבעות, באותן עשרים וארבע אמות."]],
          current: "o0",
          onPick: (k) => { const R = ctx.shared.ringsLayout; if (R && typeof R.set === "function") R.set(k === "o1" ? "four6" : "six4"); },
          fly: () => { fly([52, 46, -4], [52, 14, -27]); }
        });
        opRow({
          id: "sh16", short: "מקום המזבח בעזרה", cardFly: true,
          cap: "מקום המזבח בעזרה",
          refs: [["מידות ה, ב", "Mishnah_Middot.5.2"], ["רמב״ם בית הבחירה ה, יד", "Mishneh_Torah,_The_Chosen_Temple.5.14"], ["רמב״ם בית הבחירה ה, טו", "Mishneh_Torah,_The_Chosen_Temple.5.15"], ["יומא טז:", "Yoma.16b"], ["יומא יז.", "Yoma.17a"], ["יומא טז.", "Yoma.16a"], ["זבחים נח:", "Zevachim.58b"], ["זבחים נח.", "Zevachim.58a"], ["זבחים נט.", "Zevachim.59a"]],
          options: [["o0", "תנא דמידות והרמב״ם — רובו בדרום", "המשנה (מידות ה, ב) מונה מן הצפון לדרום: מן הננסין לכותל שמונה, מן השולחנות לננסין ארבע, מן הטבעות לשולחנות ארבע, מקום הטבעות עשרים וארבע, מן המזבח לטבעות שמונה — ו\"המותר\" (מקום הננסין ומקום השולחנות) לא נמנה. הרמב״ם (ה, יד–טו) מחשב: \"מכותל צפוני של עזרה עד כותל המזבח ששים ומחצה\", ומן הכבש לכותל הדרומי שתים עשרה ומחצה. כך גוף המזבח (32) חוצה את קו האמצע: שבע אמות מצפונו ועשרים וחמש מדרומו — \"רובא דמזבח בדרום קאי\" (יומא טז:), ומכאן שמסכת מידות היא לרבי אליעזר בן יעקב (יומא טז.–יז.). במודל: ברירת המחדל.", [["מידות ה, ב", "Mishnah_Middot.5.2"], ["רמב״ם בית הבחירה ה, יד", "Mishneh_Torah,_The_Chosen_Temple.5.14"], ["רמב״ם בית הבחירה ה, טו", "Mishneh_Torah,_The_Chosen_Temple.5.15"], ["יומא טז:", "Yoma.16b"], ["יומא יז.", "Yoma.17a"]]], ["o1", "רש״י", "רש״י (יומא טז: ד״ה רובא דמזבח) מחלק את המותר אחרת: מקום השולחנות ארבע, ושאר העודף (21) חציו לננסין וחציו בין הכבש לכותל — ומן הכותל הצפוני עד המזבח ששים ושתיים ומחצה; כך חמש אמות מן המזבח בצפון קו האמצע ועשרים ושבע בדרום. במודל: המזבח, הכבש והכלים שעליו זזים שתי אמות דרומה.", [["יומא טז:", "Yoma.16b"], ["מידות ה, ב", "Mishnah_Middot.5.2"]]], ["o2", "רבי יהודה — באמצע", "״רבי יהודה אומר: מזבח ממוצע ועומד באמצע העזרה; ושלשים ושתים אמות היו לו... עשר אמות כנגד פתחו של היכל, אחת עשרה אמה מיכן, ואחת עשרה אמה מיכן... נמצא מזבח מכוון כנגד היכל וכתליו״ (יומא טז.; זבחים נח:). רב אדא בר אהבה תולה בו את מסכת מידות (יומא טז.), והגמרא דוחה. במודל: גוף המזבח ממורכז על קו ציר הבית, שש עשרה אמות מכל צד.\nלרבי יהודה — מקום הטבעות לא נתבאר; במודל נשארו במקומן.", [["יומא טז.", "Yoma.16a"], ["זבחים נח:", "Zevachim.58b"]]], ["o3", "רבי יוסי — בצפון", "״אמר רב אסי אמר רבי יוחנן: אומר היה ר׳ יוסי, כוליה מזבח בצפון קאי״ (זבחים נח.) — כל גוף המזבח בחציה הצפוני של העזרה. הגמרא (נח:–נט.) מעלה גם ״אי קסבר כוליה מזבח בדרום קאי״ ודוחה — אין תנא שסובר שכולו בדרום. במודל: הצלע הדרומית של גוף המזבח על קו הציר, והכבש נמשך ממנו דרומה.\nבית המטבחים לשיטה זו: לא נמצא מקור; אין מקום לעשרים וארבע אמות של טבעות, ובמודל שורה אחת של שש טבעות, שמונה אמות מן המזבח, והשולחנות והננסין אחריה — בחירת מודל.", [["זבחים נח.", "Zevachim.58a"], ["זבחים נט.", "Zevachim.59a"]]]],
          current: "o0",
          onPick: (k) => { if (ctx.shared.altarPlace && typeof ctx.shared.altarPlace.set === "function") ctx.shared.altarPlace.set(["middot", "rashi", "middle", "north"][+k.slice(1)] || "middot"); },
          fly: (k) => { const c = {"o0": [[190, 125, 0], [40, 10, 9]], "o1": [[190, 125, 0], [40, 10, 11]], "o2": [[190, 125, 0], [40, 10, 0]], "o3": [[190, 125, -20], [40, 10, -16]]}[k]; if (c && c[0] && c[1]) fly(c[0], c[1]); }
        });
        opRow({
          id: "sh17", short: "מידות המזבח", cardFly: true,
          cap: "מידות המזבח",
          refs: [["מידות ג, א", "Mishnah_Middot.3.1"], ["ברטנורא ג, א", "Bartenura_on_Mishnah_Middot.3.1"], ["תוי״ט ג, א", "Tosafot_Yom_Tov_on_Mishnah_Middot.3.1"], ["רמב״ם בית הבחירה ב, ז", "Mishneh_Torah,_The_Chosen_Temple.2.7"], ["כלים יז, י", "Mishnah_Kelim.17.10"], ["זבחים סא:", "Zevachim.61b"]],
          options: [["o0", "המשנה — 32, 30, 28, 26, 24", "לשון המשנה (מידות ג, א): ״המזבח היה שלשים ושתים על שלשים ושתים. עלה אמה וכנס אמה, זה היסוד. נמצא שלשים על שלשים. עלה חמש וכנס אמה. זה הסובב. נמצא עשרים ושמנה על עשרים ושמנה. מקום הקרנות אמה מזה ואמה מזה. נמצא עשרים ושש על עשרים ושש. מקום הלוך רגלי הכהנים, אמה מזה ואמה מזה. נמצא עשרים וארבע על עשרים וארבע, מקום המערכה״.\nבמודל: חמישה קווים, כל אחד בגובהו ובצבע משלו — כחול 32 ברצפה, ירוק 30 על היסוד, ורוד 28 על הסובב, סגול 26 וכתום 24 על הגג; ולצד המזבח לוחית לכל קו, במסגרת בצבעו. המבט מן הצד, מתוך העזרה, כדי שייראו הכניסות שבין מדרגה למדרגה.", [["מידות ג, א", "Mishnah_Middot.3.1"], ["ברטנורא ג, א", "Bartenura_on_Mishnah_Middot.3.1"]]], ["o1", "רש״י — הסובב באמה בת חמישה", "במשנה (כלים יז, י): כל האמות בינוניות, חוץ מן הקרן, הסובב והיסוד — אמה בת חמישה טפחים. תוספות יום טוב (מידות ג, א): ״ויש שני פירושים לרש״י גובה היסוד בבת ה׳. ולא הכניסה״; ולכן בכניסת הסובב — ״אבל לרש״י. אין אנו צריכין להוסיף בכאן רק ב׳ טפחים מפני כניסת הסובב בלבד״.\nבמודל: 32, 30, 28 אמה ו־2 טפחים, 26 אמה ו־2 טפחים, 24 אמה ו־2 טפחים.", [["מידות ג, א", "Mishnah_Middot.3.1"], ["תוי״ט ג, א", "Tosafot_Yom_Tov_on_Mishnah_Middot.3.1"], ["רמב״ם בית הבחירה ב, ז", "Mishneh_Torah,_The_Chosen_Temple.2.7"], ["כלים יז, י", "Mishnah_Kelim.17.10"]]], ["o2", "הרמב״ם — היסוד והסובב באמה בת חמישה", "הרמב״ם (בית הבחירה ב, ז): ״עלה חמשה טפחים וכנס חמשה טפחים זהו יסוד. נמצא רחב שלשים אמה ושני טפחים על רחב שלשים אמה ושני טפחים. עלה שלשים טפחים וכנס חמשה טפחים זהו סובב״, ״נמצא רחבו שמונה ועשרים אמה וארבעה טפחים״, ״נמצא מקום המערכה רחבו עשרים וארבע אמות וארבעה טפחים״; וגובהו (ב, ו): ״וגבה כל המזבח נ״ח טפחים״. תוספות יום טוב (מידות ג, א): ״ולהרמב״ם אף כניסת היסוד בבת ה׳״.\nבמודל: 32, 30 אמה ו־2 טפחים, 28 אמה ו־4 טפחים, 26 אמה ו־4 טפחים, 24 אמה ו־4 טפחים. הקווים עומדים על משטחי המזבח שבמודל; הגבהים לרמב״ם (יסוד חמישה טפחים, הסובב שלושים, מקום המערכה שמונה עשר, הקרן חמישה) — כתובים כאן ואינם מצוירים.", [["מידות ג, א", "Mishnah_Middot.3.1"], ["תוי״ט ג, א", "Tosafot_Yom_Tov_on_Mishnah_Middot.3.1"], ["רמב״ם בית הבחירה ב, ז", "Mishneh_Torah,_The_Chosen_Temple.2.7"], ["כלים יז, י", "Mishnah_Kelim.17.10"]]], ["o3", "רבי יוסי — המזבח הראשון", "לשון המשנה (מידות ג, א): ״אמר רבי יוסי, מתחלה לא היה אלא שמנה ועשרים על שמנה ועשרים, כונס ועולה במדה זו, עד שנמצא מקום המערכה עשרים על עשרים. וכשעלו בני הגולה, הוסיפו עליו ארבע אמות מן הדרום וארבע אמות מן המערב, כמין גמא״. ברטנורא: ״מתחלה״ — בימי שלמה; ״וכונס ועולה של יסוד וסובב ומקום הקרנות ומקום הלוך רגלי הכהנים עד שנשאר מקום המערכה עשרים על עשרים״.\nבמודל: המזבח עצמו קטן — 28 על 28, וכונס ועולה עד מקום המערכה 20 על 20. כותלי הצפון והמזרח במקומם, כי ההוספה הייתה בדרום ובמערב. הכבש זז עמו — שתי אמות למזרח וארבע לצפון — וכן ספלי הניסוך, אל קרן מערבית־דרומית שלו; המערכות כולן בתוך מקום המערכה. בכתום — קווי המידות 28, 26, 24, 22, 20.", [["מידות ג, א", "Mishnah_Middot.3.1"], ["ברטנורא ג, א", "Bartenura_on_Mishnah_Middot.3.1"], ["זבחים סא:", "Zevachim.61b"]]], ["o4", "הראב״ד — הקרנות שני טפחים פנימה", "הראב״ד (בהשגות על בית הבחירה ב, ז), על ״עשרים וארבע אמות וארבעה טפחים״ של הרמב״ם: ״אולי אינו כן כי הארבעה טפחים הם כניסת הקרנות מדפני המזבח״; ותפארת ישראל (מידות ג, א): ״ולראב״ד (פ״ב מבחירה) לא היו מעמידין הקרנות על הזויות ממש, רק העמידום רחוקים ב׳ טפחים משפת המזבח לכל צד. ולפ״ז נשאר באמת כ״ד אמה על כ״ד אמות למקום המערכה״.\nבמודל: 32, 30 אמה ו־2 טפחים, 28 אמה ו־4 טפחים — ומשם, אחרי הקרנות שנכנסו שני טפחים, 26 ו־24 בדיוק.", [["מידות ג, א", "Mishnah_Middot.3.1"], ["תוי״ט ג, א", "Tosafot_Yom_Tov_on_Mishnah_Middot.3.1"], ["רמב״ם בית הבחירה ב, ז", "Mishneh_Torah,_The_Chosen_Temple.2.7"], ["כלים יז, י", "Mishnah_Kelim.17.10"]]]],
          current: "o0",
          onPick: (k) => { const F28 = (ctx.shared.features || {}).altar28; if (F28) { try { const was28 = !!F28.isOn(); autoOff.run(F28); if (!was28) leaveFeat = F28; } catch (_) {} } if (ctx.shared.altarMeasures && typeof ctx.shared.altarMeasures.set === "function") ctx.shared.altarMeasures.set(["mishnah", "rashi", "rambam", "yose", "raavad"][+k.slice(1)] || "mishnah"); },
          fly: (k) => { const c = {"o0": [[84, 28.5, -24], [56.5, 20.5, 8]], "o1": [[84, 28.5, -24], [56.5, 20.5, 8]], "o2": [[84, 28.5, -24], [56.5, 20.5, 8]], "o3": [[84, 28.5, -24], [56.5, 20.5, 8]], "o4": [[56, 74, 19], [55.5, 24, 9]]}[k]; if (c && c[0] && c[1]) fly(ui_altarCam(ctx, c[0], "body"), ui_altarCam(ctx, c[1], "body")); }
        });
        opRow({
          id: "sh18", short: "יסוד המזבח — רב ולוי", cardFly: true,
          cap: "יסוד המזבח — רב ולוי",
          refs: [["מידות ג, א", "Mishnah_Middot.3.1"], ["זבחים נד.", "Zevachim.54a"], ["רש״י זבחים נד.", "Rashi_on_Zevachim.54.1"]],
          options: [["o0", "רב — היסוד בצפון ובמערב", "לשון המשנה (מידות ג, א): ״והיסוד היה מהלך על פני כל הצפון ועל פני כל המערב, ואוכל בדרום אמה אחת, ובמזרח אמה אחת״. בגמרא (זבחים נד.) על הקרן שלא היה לה יסוד: ״רב אמר: בבנין, לוי אמר: בדמים״. רש״י: ״רב אמר בבנין — בקרן דרומית מערבית בנו היסוד אמה באורך הדרום, וחדלו להם כל הדרום וכל המזרח עד אמה סמוך לקרן צפונית מזרחית״.\nבמודל (ברירת המחדל): היסוד על פני הצפון והמערב, ואמה אחת בדרום ואמה אחת במזרח. בקרן דרומית־מזרחית — הכיתוב ״כאן אין יסוד״.", [["מידות ג, א", "Mishnah_Middot.3.1"], ["זבחים נד.", "Zevachim.54a"], ["רש״י זבחים נד.", "Rashi_on_Zevachim.54.1"]]], ["o1", "לוי — יסוד סביב כל המזבח", "בגמרא (זבחים נד.): ״רב אמר: בבנין, לוי אמר: בדמים״. רש״י: ״לוי אומר בדמים — יסוד היה על פני כל המזרח, אבל לא נותנין דמים בחלקו של יהודה״.\nבמודל: היסוד מקיף את המזבח מכל צדדיו; בדרום הוא עובר תחת ראש הכבש, הפורח מעליו. רש״י פירש את המזרח; המשכו על פני הדרום — בחירת מודל. חלק היסוד שבחלקו של יהודה — במזרח ובדרום — צבוע בגוון אדמדם, לסימן שאין נותנים עליו דמים (הגוון — סימן של המודל).", [["מידות ג, א", "Mishnah_Middot.3.1"], ["זבחים נד.", "Zevachim.54a"], ["רש״י זבחים נד.", "Rashi_on_Zevachim.54.1"]]]],
          current: "o0",
          onPick: (k) => { if (ctx.shared.yesodLevi && typeof ctx.shared.yesodLevi.set === "function") ctx.shared.yesodLevi.set(k === "o1"); },
          fly: (k) => { const c = {"o0": [[86, 21.5, 40], [70.5, 16.6, 24.5]], "o1": [[86, 21.5, 40], [70.5, 16.6, 24.5]]}[k]; if (c && c[0] && c[1]) fly(ui_altarCam(ctx, c[0], "body"), ui_altarCam(ctx, c[1], "body")); }
        });
        opRow({
          id: "sh19", short: "התפוח", cardFly: true,
          cap: "התפוח",
          refs: [["תמיד ב, ב", "Mishnah_Tamid.2.2"], ["תמיד ב, ד", "Mishnah_Tamid.2.4"], ["תמיד ב, ה", "Mishnah_Tamid.2.5"], ["השגות הראב״ד תמידין ומוספין ב, ז", "Raavad_on_Temidin.2.7"], ["רמב״ם תמידין ומוספין ב, ז", "Mishneh_Torah,_Daily_Offerings_and_Additional_Offerings.2.7"], ["מלאכת שלמה תמיד ב, ב", "Melekhet_Shelomoh_on_Mishnah_Tamid.2.2"], ["מידות ג, א", "Mishnah_Middot.3.1"], ["זבחים סב:", "Zevachim.62b"], ["רמב״ם איסורי מזבח ז, ג", "Rambam_Issurei_Mizbeach.7.3"], ["ברטנורא תמיד ב, ב", "Bartenura_on_Mishnah_Tamid.2.2"], ["לחם משנה תמידין ומוספין ב, ז", {"book": 4030, "index": 26}]],
          options: [["o0", "כרי אפר עגול", "לשון המשנה (תמיד ב, ב): ״החלו מעלין באפר על גבי התפוח. ותפוח היה באמצע המזבח, פעמים עליו כשלש מאות כור. וברגלים לא היו מדשנין אותו, מפני שהוא נוי למזבח. מימיו לא נתעצל הכהן מלהוציא את הדשן״. ברטנורא: מושכים את האפר במגרפות ומעלים אותו לתפוח — ״כמין כרי גדול של אפר שהיה באמצע המזבח צבור ועשוי כתפוח״; ״שלש מאות כור״ — גוזמא; וברגלים לא הוציאוהו, שייראה שקרבנות הרבה קרבו. המערכה הגדולה נוגעת בו — ״וראשי הגזרין הפנימים היו נוגעים בתפוח״ (תמיד ב, ד). במודל: כיפה עגולה ברדיוס 4.5 וגובה 2.2 אמות — המידות בחירת מודל.\nכך פירשו הרמב״ם והתפארת ישראל — כרי של אפר באמצע המזבח, עגול כתפוח.", []], ["o1", "טבלה מרובעת — ראב״ד", "לשון המשנה (תמיד ב, ב): ״החלו מעלין באפר על גבי התפוח. ותפוח היה באמצע המזבח, פעמים עליו כשלש מאות כור״; (ב, ד): ״סדר המערכה גדולה מזרחה, וחזיתה מזרחה, וראשי הגזרין הפנימים היו נוגעים בתפוח. ורוח היה בין הגזרין, שהיו מציתין את האליתא משם״.\n**הראב״ד** (השגות, הלכות תמידין ומוספין ב, ז), על דברי הרמב״ם שהדשן שבאמצע המזבח הוא התפוח: ״שהרי שנינו החלו מעלים באפר ע״ג התפוח ומאחר שכהן מוציא בכל יום כל האפר מהיכן היה שם התפוח. וכן אמרו פעמים שעליו כשלש מאות כור והיה לו לומר פעמים שיש בו כשלש מאות אלא שהיה שם טבלא מרובעת גבוהה אמה והיא כ״ב על כ״ב אמות ואותה אמה היא השלמת עשר אמות לגובה המזבח והיא נקראת תפוח על שם שהיתה גבוהה על כל סביביה ואפשר שהיתה אותה הטבלא קצוצת קרנות כעין עגולה כדי להרויח מקום המערכה״.\nועל המערכה כתב שם: ״שלא יהיו הגזרים הולכין צפון ודרום אלא מזרח ומערב והיינו ראשי הגזרים הפנימים נוגעין בתפוח ולא בא להוסיף אלא שיהיו נוגעים בתפוח שלא ירחיקו מהלך רגלי הכהנים שהיה אמה שלא יקרעו ולא ישרפו בגדיהם״.\nהמלאכת שלמה (תמיד ב, ב) מביא את דבריו בלשון ״כדי להרחיב מקום המערכה״.\n**הלחם משנה** (תמידין ומוספין ב, ז) מבאר את דעתו: ״הניח אמה מכל צד כדי שישימו שם גזרי המערכה שהם אמה על אמה וכיון שהיו כ״ד על כ״ד וקצרו אמה מכל הצדדים לתת מקום לעצי המערכה עשו טבלא גבוהה עשרים ושתים על כ״ב״ — כלומר המערכה איננה על הטבלה אלא באמה שסביבה, והגזרים, אמה אורכם, מונחים בה וראשיהם נוגעים בטבלה.\nבמודל: טבלה מאבן המזבח, עשרים ושתיים על עשרים ושתיים וגובה אמה, באמצע גג המזבח, וקרנותיה קצוצות שתי אמות; האפר צבור במרכזה. האמה שסביבה, מקום המערכה, מסומנת בפס כהה. המערכות אינן על הטבלה: הן על גג המזבח, באמה שבין הטבלה לבין מהלך רגלי הכהנים — מקום המערכה עשרים וארבע על עשרים וארבע (מידות ג, א), והטבלה עשרים ושתיים. הגזרים עצים מבוקעים, אמה אורכם (זבחים סב:: ״גזירין שעשה משה – אורכן אמה, ורוחבן אמה, ועוביין כמחק גודש סאה״; רמב״ם איסורי מזבח ז, ג: ״וכמותן עושין לדורות״), מונחים ממזרח למערב זה בצד זה, ורווח ביניהם, וראשיהם הפנימיים נוגעים בטבלה; מהלך רגלי הכהנים פנוי. על המערכה הגדולה שני הגזרים — שני לוחות, אמה על אמה — והאש ביניהם. המערכה הגדולה במזרח; השנייה, של הקטורת, במערב — ״מכנגד קרן מערבית דרומית, משוך מן הקרן כלפי צפון ארבע אמות״ (תמיד ב, ה).\nהראב״ד לא פירש את צורת הערימה: מספר הגזרים, עוביים, שתי השכבות, עובי שני הלוחות, מידת קיצוץ הקרנות, אורך כל מערכה ומקום שאר המערכות — בחירות מודל.", [["תמיד ב, ב", "Mishnah_Tamid.2.2"], ["תמיד ב, ד", "Mishnah_Tamid.2.4"], ["תמיד ב, ה", "Mishnah_Tamid.2.5"], ["השגות הראב״ד תמידין ומוספין ב, ז", "Raavad_on_Temidin.2.7"], ["רמב״ם תמידין ומוספין ב, ז", "Mishneh_Torah,_Daily_Offerings_and_Additional_Offerings.2.7"], ["מלאכת שלמה תמיד ב, ב", "Melekhet_Shelomoh_on_Mishnah_Tamid.2.2"], ["מידות ג, א", "Mishnah_Middot.3.1"], ["זבחים סב:", "Zevachim.62b"], ["רמב״ם איסורי מזבח ז, ג", "Rambam_Issurei_Mizbeach.7.3"], ["ברטנורא תמיד ב, ב", "Bartenura_on_Mishnah_Tamid.2.2"], ["לחם משנה תמידין ומוספין ב, ז", {"book": 4030, "index": 26}]]]],
          current: "o0",
          onPick: (k) => { if (ctx.shared.tapuach && typeof ctx.shared.tapuach.set === "function") ctx.shared.tapuach.set(k === "o1" ? "raavad" : "kri"); },
          fly: (k) => { const c = {"o0": [[56, 70, 27], [55.5, 25, 9]], "o1": [[82, 38, 24], [58, 25.5, 9]]}[k]; if (c && c[0] && c[1]) fly(ui_altarCam(ctx, c[0], "body"), ui_altarCam(ctx, c[1], "body")); }
        });
        opRow({
          id: "sh20", short: "מניין המערכות", cardFly: true,
          cap: "מניין המערכות",
          refs: [["יומא ד, ו", "Mishnah_Yoma.4.6"], ["רמב״ם תמידין ומוספין ב, ד", "Mishneh_Torah,_Daily_Offerings_and_Additional_Offerings.2.4"], ["רמב״ם תמידין ומוספין ב, ז", "Mishneh_Torah,_Daily_Offerings_and_Additional_Offerings.2.7"], ["המפרש, תמיד לא:", "Mefaresh_on_Tamid.31.2"], ["רמב״ם תמידין ומוספין ב, ב", "Mishneh_Torah,_Daily_Offerings_and_Additional_Offerings.2.2"], ["זבחים סב:", "Zevachim.62b"], ["רמב״ם איסורי מזבח ז, ג", "Rambam_Issurei_Mizbeach.7.3"]],
          options: [["o0", "רבי יוסי — שלוש", "לשון המשנה (תמיד ב, ד): ״סדר המערכה גדולה מזרחה, וחזיתה מזרחה, וראשי הגזרין הפנימים היו נוגעים בתפוח. ורוח היה בין הגזרין, שהיו מציתין את האליתא משם״; (יומא ד, ו): ״בכל יום היו שם ארבע מערכות, והיום חמש, דברי רבי מאיר. רבי יוסי אומר, בכל יום שלש, והיום ארבע. רבי יהודה אומר, בכל יום שתים, והיום שלש״. ברטנורא (תמיד ב, ד): שלוש מערכות בכל יום — הגדולה, ששורפים עליה את התמיד; השנייה, של קטורת, שנוטלים ממנה גחלים במחתה; והשלישית לקיום האש — ״והאש על המזבח תוקד בו״; ״חזיתה מזרחה״ — פתחה וחלונה לצד מזרח של המזבח, ו״אליתא״ — חריות וקיסמים דקים להצית. כרבי יוסי פסק הרמב״ם (תמידין ומוספין ב, ד). במודל — ברירת המחדל: שלוש מערכות, כרבי יוסי. הגדולה בדרום־מזרח הגג: ״מסדרה במזרח המזבח... וראשי הגזרים הפנימיים היו נוגעין בדשן שבאמצע המזבח״ (רמב״ם תמידין ומוספין ב, ז), ״ומקום המערכה במזרח המזבח אצל מזרחו של כבש, ורחב המערכה אינו תופס עד חצי המזבח, שהרי התפוח באמצע המזבח״ (המפרש, תמיד לא:); של הקטורת — ״מכנגד קרן מערבית דרומית, משוכה מן הקרן כלפי צפון ארבע אמות״ (רמב״ם שם ב, ח); והשלישית — ״בכל מקום שירצה מן המזבח״ (שם ב, ט). גודלן, וכמה דרומה עומדת הגדולה — בחירת מודל. על המערכה הגדולה שני הגזרים שמעלים עם התמיד (רמב״ם תמידין ומוספין ב, ב: ״מצוה להעלות שני גזרים של עץ עם תמיד של שחר יותר על עצי המערכה״) — שני לוחות, אמה על אמה: ״גזירין שעשה משה – אורכן אמה, ורוחבן אמה, ועוביין כמחק גודש סאה״ (זבחים סב:); ״וכמותן עושין לדורות״ (רמב״ם איסורי מזבח ז, ג). עוביים ומקומם על המערכה — בחירת מודל. ביום הכיפורים — מערכה נוספת לכל תנא: ראו את המתג ״המערכות ביום הכיפורים״.", [["יומא ד, ו", "Mishnah_Yoma.4.6"], ["רמב״ם תמידין ומוספין ב, ד", "Mishneh_Torah,_Daily_Offerings_and_Additional_Offerings.2.4"], ["רמב״ם תמידין ומוספין ב, ז", "Mishneh_Torah,_Daily_Offerings_and_Additional_Offerings.2.7"], ["המפרש, תמיד לא:", "Mefaresh_on_Tamid.31.2"], ["רמב״ם תמידין ומוספין ב, ב", "Mishneh_Torah,_Daily_Offerings_and_Additional_Offerings.2.2"], ["זבחים סב:", "Zevachim.62b"], ["רמב״ם איסורי מזבח ז, ג", "Rambam_Issurei_Mizbeach.7.3"]]], ["o1", "רבי יהודה — שתיים", "״רבי יהודה אומר, בכל יום שתים, והיום שלש״ (יומא מה.): מערכה גדולה ומערכה שנייה של קטורת בלבד. במודל: המערכה השלישית נעלמת.", [["יומא ד, ו", "Mishnah_Yoma.4.6"]]], ["o2", "רבי מאיר — ארבע", "״בכל יום היו שם ארבע מערכות והיום חמש, דברי רבי מאיר״ (יומא מה.): בנוסף לשלוש — מערכה לאיברים ופדרים שלא נתעכלו מבערב. במודל: מערכה רביעית בצפון־מזרח הגג; מקומה — בחירת מודל.", [["יומא ד, ו", "Mishnah_Yoma.4.6"]]]],
          current: "o0",
          onPick: (k) => { const m = ctx.shared.maarachot; if (m && typeof m.set === "function") m.set([3, 2, 4][+k.slice(1)] || 3, !!m.yk); },
          fly: (k) => { const c = {"o0": [[55.5, 72, 16.5], [55.5, 22.5, 9]], "o1": [[55.5, 72, 16.5], [55.5, 22.5, 9]], "o2": [[55.5, 72, 16.5], [55.5, 22.5, 9]]}[k]; if (c && c[0] && c[1]) fly(ui_altarCam(ctx, c[0], "body"), ui_altarCam(ctx, c[1], "body")); }
        });
        opRow({
          id: "sh21", short: "המערכות ביום הכיפורים", cardFly: true,
          cap: "המערכות ביום הכיפורים",
          refs: [["יומא ד, ו", "Mishnah_Yoma.4.6"], ["יומא מה.", "Yoma.45a"], ["רש״י יומא מה.", "Rashi_on_Yoma.45a"]],
          options: [["o0", "בכל יום", "בכל יום — כמניין התנא שנבחר במתג ״מניין המערכות״: רבי יוסי שלוש, רבי יהודה שתיים, רבי מאיר ארבע (יומא ד, ו).", [["יומא ד, ו", "Mishnah_Yoma.4.6"]]], ["o1", "יום הכיפורים — מערכה נוספת", "לשון המשנה (יומא ד, ו): ״בכל יום היו שם ארבע מערכות, והיום חמש, דברי רבי מאיר. רבי יוסי אומר, בכל יום שלש, והיום ארבע. רבי יהודה אומר, בכל יום שתים, והיום שלש״.\nבכל השיטות ביום הכיפורים מוסיפים מערכה אחת: לרבי יהודה שלוש, לרבי יוסי ארבע, לרבי מאיר חמש. ובברייתא (יומא מה.): ״ואחת שמוסיפין בו ביום״. רש״י (יומא מה.): ״ליטול ממנה גחלים לקטורת של לפני ולפנים״.\nבמודל: המערכה הנוספת נוספת על מניין התנא שנבחר במתג ״מניין המערכות״, בצפון־מזרח הגג; מקומה וגודלה — בחירת מודל.", [["יומא ד, ו", "Mishnah_Yoma.4.6"], ["יומא מה.", "Yoma.45a"], ["רש״י יומא מה.", "Rashi_on_Yoma.45a"]]]],
          current: "o0",
          onPick: (k) => { const m = ctx.shared.maarachot; if (m && typeof m.set === "function") m.set(m.count || 3, k === "o1"); },
          fly: (k) => { const c = {"o0": [[55.5, 72, 16.5], [55.5, 22.5, 9]], "o1": [[55.5, 72, 16.5], [55.5, 22.5, 9]]}[k]; if (c && c[0] && c[1]) fly(ui_altarCam(ctx, c[0], "body"), ui_altarCam(ctx, c[1], "body")); }
        });
        opRow({
          id: "sh22", short: "סדר עבודת הבוקר — אביי או הרמב״ם", cardFly: true,
          cap: "סדר עבודת הבוקר — אביי או הרמב״ם",
          refs: [["יומא לג.", "Yoma.33a"], ["תמיד ג, ט", "Mishnah_Tamid.3.9"], ["תמיד ו, א", "Mishnah_Tamid.6.1"], ["פירוש המשניות לרמב״ם תמיד ו, ג", "Rambam_Commentary_on_Tamid.6.3"], ["רמב״ם תמידין ומוספין ו, א", "Mishneh_Torah,_Daily_Offerings_and_Additional_Offerings.6.1"], ["רמב״ם תמידין ומוספין ו, ג", "Mishneh_Torah,_Daily_Offerings_and_Additional_Offerings.6.3"]],
          options: [["o0", "אביי — אליבא דאבא שאול (יומא לג.)", "בגמרא (יומא לג.): ״אביי מסדר מערכה משמיה דגמרא ואליבא דאבא שאול״ — הסדר שבמשנה במסכת תמיד: ״והטבת חמש נרות קודם לדם התמיד, ודם התמיד קודם להטבת שתי נרות, והטבת שתי נרות קודם לקטורת״.\nבהדגמה (ברירת המחדל): הפייס הראשון בבית המוקד, ואחריו הבילוש באבוקות; הפייס השני בלשכת הגזית; הטבת חמש הנרות לפני זריקת הדם, והטבת שתי הנרות לפני הקטורת.", [["יומא לג.", "Yoma.33a"], ["תמיד ג, ט", "Mishnah_Tamid.3.9"], ["תמיד ו, א", "Mishnah_Tamid.6.1"]]], ["o1", "הרמב״ם — כחכמים (תמידין ומוספין ו)", "הרמב״ם בפירוש המשניות (תמיד ו, ג): ״אבל חכמים אומרים שבהקטרת הקטרת היה מפסיק והיה זורק דם התמיד ומטיב ה' נרות ומקטיר קטרת ואח\"כ מטיב שתי נרות והלכה כחכמים״.\nובהלכות תמידין ומוספין (ו, א): ״ויבואו ויעמדו בלשכת הגזית. ויפיסו פיס ראשון ושני״.\nבהדגמה: הבילוש באבוקות קודם, ושני הפייסות יחד בלשכת הגזית; הטלה מובא לפני ״ברקאי״; הטבת חמש הנרות אחרי זריקת הדם, והטבת שתי הנרות אחרי הקטורת; האברים עולים למזבח לפני ברכת כהנים.", [["פירוש המשניות לרמב״ם תמיד ו, ג", "Rambam_Commentary_on_Tamid.6.3"], ["רמב״ם תמידין ומוספין ו, א", "Mishneh_Torah,_Daily_Offerings_and_Additional_Offerings.6.1"], ["רמב״ם תמידין ומוספין ו, ג", "Mishneh_Torah,_Daily_Offerings_and_Additional_Offerings.6.3"]]]],
          current: "o0",
          onPick: (k) => { const T = ctx.shared.tamid; if (T && typeof T.setOrder === 'function') T.setOrder(k === 'o1' ? 'rambam' : 'abba'); const S = ctx.shared; if (!S.__lotsLink) { S.__lotsLink = true; try { const R = ((ctx.ui && ctx.ui.opinions) || []).find((r) => /^הפייס הראשון/.test(String(r.cap || ""))); const w = k === "o1" ? "o0" : "o1"; if (R && R.cur !== w && typeof R.onPick === "function") { R.onPick(w); if (typeof R.mark === "function") R.mark(w); } } catch (_) {} S.__lotsLink = false; } },
          fly: (k) => { const c = {"o0": [[96, 60, 62], [55.5, 22, 9]], "o1": [[96, 60, 62], [55.5, 22, 9]]}[k]; if (c && c[0] && c[1]) fly(ui_altarCam(ctx, c[0], "body"), ui_altarCam(ctx, c[1], "body")); }
        });
        opRow({
          id: "sh23", short: "נקבי ספלי הניסוך", cardFly: true,
          cap: "נקבי ספלי הניסוך",
          refs: [["סוכה מח:", "Sukkah.48b"], ["סוכה ד, ט", "Mishnah_Sukkah.4.9"]],
          options: [["o0", "ברטנורא", "רש״י (סוכה מח: ד״ה כמין שני חוטמין): \"חוטם אחד בספל ונקב אחד בחוטמו, והכהן מערה בפי הספלים, והנסכים מקלחין ויורדין דרך החוטמין על גב המזבח, ובמזבח היה נקב שבו המים והיין יורדין לשיתין\". וכן הברטנורא (סוכה ד, ט).", [["סוכה מח:", "Sukkah.48b"], ["סוכה ד, ט", "Mishnah_Sukkah.4.9"]]], ["o1", "ראשונים", "תוספות (סוכה מח: ד״ה כמין): \"וזו תימה גדולה, מנין לו כל אותו הענין... דלמא הוא דמנקב הספלים יורדין לשיתין, כמין שני נקבי החוטם, ולא שהיה בולט כמין חוטם\"; הריטב״א: \"שהספלים האלו מחוברין היו במזבח... הנקבים היו בתחתיות הספלים מכוונין כנגד השיתין\"; וכן המאירי: \"ספלים אלו מחוברים היו למזבח והרי הם כקרקע המזבח\".", [["סוכה מח:", "Sukkah.48b"]]]],
          current: "o0",
          onPick: (k) => { if (ctx.shared.sfalim && typeof ctx.shared.sfalim.set === "function") ctx.shared.sfalim.set(k === "o1" ? "tosafot" : "rashi"); const FS = (ctx.shared.features || {}).sfalimSee; if (FS) { try { const wasS = !!FS.isOn(); autoOff.run(FS); if (!wasS) leaveFeat = FS; } catch (_) {} } },
          fly: (k) => { const c = {"o0": [SFALIM_CAM, SFALIM_TG], "o1": [SFALIM_CAM, SFALIM_TG]}[k]; if (c && c[0] && c[1]) fly(ui_altarCam(ctx, c[0], "cups"), ui_altarCam(ctx, c[1], "cups")); }
        });
        opRow({
          id: "sh24", short: "הרווח שבין הכבש למזבח", cardFly: true,
          cap: "הרווח שבין הכבש למזבח",
          refs: [["זבחים סב:", "Zevachim.62b"], ["רש״י זבחים סב:", "Rashi_on_Zevachim.62.2"], ["רש״י שמות כז, ה", "Rashi_on_Exodus.27.5"], ["רמב״ם בית הבחירה ב, יג", "Mishneh_Torah,_The_Chosen_Temple.2.13"], ["תוספות זבחים סב:", "Tosafot_on_Zevachim.62.2"], ["תוספות זבחים פז:", "Tosafot_on_Zevachim.87.2"]],
          options: [["o0", "כחוט השערה — רש״י והרמב״ם", "בגמרא (זבחים סב:): ״אויר יש בין כבש למזבח?״ — ״מה דם בזריקה, אף בשר בזריקה״. רש״י (שמות כז, ה): ״והכבש היה בדרום המזבח, מבדל מן המזבח מלא חוט השערה״. הרמב״ם (בית הבחירה ב, יג): ״ואויר מעט היה מפסיק בין הכבש למזבח, כדי לתן האיברים למזבח בזריקה״.\nבמודל (ברירת המחדל): ראש הכבש מגיע עד המזבח, ורווח דק מפסיק ביניהם.", [["זבחים סב:", "Zevachim.62b"], ["רש״י זבחים סב:", "Rashi_on_Zevachim.62.2"], ["רש״י שמות כז, ה", "Rashi_on_Exodus.27.5"], ["רמב״ם בית הבחירה ב, יג", "Mishneh_Torah,_The_Chosen_Temple.2.13"], ["תוספות זבחים סב:", "Tosafot_on_Zevachim.62.2"], ["תוספות זבחים פז:", "Tosafot_on_Zevachim.87.2"]]], ["o1", "תוספות — אויר גדול וניכר", "תוספות (זבחים סב:, ד״ה אויר קרקע מפסיקו): ״קרקע לאו דוקא, שהיה פורח אמה על יסוד ואמה על סובב; ובלאו קרא היה צריך אויר, משום שנאמר סביב כדבסמוך, אלא דסגי במשהו; אבל הכא בעינן אויר גדול וניכר״.\nבמודל: רווח של חצי אמה בראש הכבש, כולו מעל הסובב. שיעורו לא נתפרש — בחירת מודל.", [["זבחים סב:", "Zevachim.62b"], ["רש״י זבחים סב:", "Rashi_on_Zevachim.62.2"], ["רש״י שמות כז, ה", "Rashi_on_Exodus.27.5"], ["רמב״ם בית הבחירה ב, יג", "Mishneh_Torah,_The_Chosen_Temple.2.13"], ["תוספות זבחים סב:", "Tosafot_on_Zevachim.62.2"], ["תוספות זבחים פז:", "Tosafot_on_Zevachim.87.2"]]], ["o2", "רבינו חיים — יותר מאמת הסובב", "תוספות (זבחים פז:, ד״ה אויר יש בין כבש למזבח): ״מיהו אין נראה לרבינו חיים, שהרי יש אויר מפסיק יותר מכדי אמה סובב, כדי שיהא אויר קרקע מפסיקו, כדאמרינן לעיל: מה דם אויר קרקע מפסיקו, אף בשר אויר קרקע מפסיקו״. ורש״י שם (סב:): ״הרצפה מפסיק בינו למזבח״.\nבמודל: ראש הכבש רחוק מן המזבח אמה ורבע, והרצפה נראית דרך הרווח; רגל הכבש במקומה. שיעור הרווח, והאופן שבו הוא מתיישב עם ״פורח אמה על יסוד ואמה על סובב״ — בחירת מודל.", [["זבחים סב:", "Zevachim.62b"], ["רש״י זבחים סב:", "Rashi_on_Zevachim.62.2"], ["רש״י שמות כז, ה", "Rashi_on_Exodus.27.5"], ["רמב״ם בית הבחירה ב, יג", "Mishneh_Torah,_The_Chosen_Temple.2.13"], ["תוספות זבחים סב:", "Tosafot_on_Zevachim.62.2"], ["תוספות זבחים פז:", "Tosafot_on_Zevachim.87.2"]]]],
          current: "o0",
          onPick: (k) => { const G = ctx.shared.rampGap; if (G && typeof G.set === "function") G.set(["hair", "tosafot", "chaim"][+k.slice(1)] || "hair"); },
          fly: (k) => { const c = {"o0": [[67, 30, 26.5], [60, 23.5, 23.25]], "o1": [[67, 30, 26.5], [60, 23.5, 23.25]], "o2": [[67, 30, 26.5], [60, 23.5, 23.25]]}[k]; if (c && c[0] && c[1]) fly(ui_altarCam(ctx, c[0], "ramp"), ui_altarCam(ctx, c[1], "ramp")); }
        });
        opRow({
          id: "sh25", short: "הכבשים הקטנים", cardFly: true,
          cap: "הכבשים הקטנים",
          refs: [["מידות ג, ג", "Mishnah_Middot.3.3"], ["רמב״ם בית הבחירה ב, יד", "Mishneh_Torah,_The_Chosen_Temple.2.14"], ["מידות ג, א", "Mishnah_Middot.3.1"], ["זבחים סב:", {"book": 130, "index": 2129}], ["רש״י זבחים סב:", {"book": 2191, "index": 3022}], ["לחם שמים בית הבחירה ב, יד", {"book": 5069, "index": 31}], ["תוספות זבחים סד.", {"book": 1936, "index": 681}]],
          options: [["o0", "רש״י — שני כבשים", "הגמרא (זבחים סב:): ״שני כבשים קטנים יוצאין מן הכבש, שבהן פונים ליסוד ולסובב, ומובדלין מן המזבח מלא נימא״. לפי רש״י (שם ד״ה שני כבשים): אחד לסובב, ממזרח (מימין), ואחד ליסוד, ממערב (משמאל). במשנה (מידות ג, ג) נזכר הכבש הגדול בלבד — ברטנורא ותפארת ישראל: גשר משופע, שאין עולים למזבח במעלות. רוחבם ושיפועם בחירת מודל. \nשני הכבשים הקטנים יוצאים מגוף הכבש הגדול (״יוצאים ממנו״, רמב״ם ב, יד). רש״י (זבחים סב:): ״אותו שפונין בו לסובב יצא במזרחו של כבש לימין ויוצא ומתחיל בשפולו של כבש ונמשך ועולה באלכסון עד שמגיע לסובב״.\n**הכבש העולה לסובב** (ולתוספות — שני הכבשים העולים לסובב), במודל: הוא יוצא מצד הכבש הגדול בשליש התחתון שלו, ״בשפולו של כבש״. בתחילתו הוא צמוד לכבש הגדול ובגובה הילוכו; משם הוא פונה ממנו באלכסון ועולה במתינות, ובינו לבין הכבש הגדול אוויר גמור עד הרצפה. קצהו העליון חתוך לאורך שפת הסובב ובגובהה — כהמשך לסובב — ובכל זאת ״ומובדלין מן המזבח מלא נימא״. כמה הוא נוטה ורוחבו — בחירת מודל.\n**הכבש היורד ליסוד — לרש״י:** ״והפונה ליסוד יוצא למערבו... פונה לשמאלו ליסוד דרומי, ומתחיל לצאת בשיפולו של כבש רחוק מן המזבח, כדי שיהא נוח לשפע ולירד ליסוד״. במודל הוא הולך באלכסון מצלעו המערבית של הכבש הגדול אל אמת היסוד שבקרן הדרומית־מערבית (מידות ג, א: ״ואוכל בדרום אמה אחת״), כציור התוספות יום טוב והתפארת ישראל.\n**הכבש היורד ליסוד — לתוספות,** כביאור התוספות יום טוב (זבחים ו, ג): הוא צמוד לכבש השלישי מבחוץ, לאורכו, מאותו שליש עד הקרן הדרומית־מערבית של היסוד — כבש אחד רחב, ומקצתו מוגבה עד הסובב.\n**שלא צויר:** כבש ליסוד הצמוד לכבש הגדול — אינו מוכרח מן המקורות, ואין לו דרך להגיע אל אמת היסוד.", [["מידות ג, ג", "Mishnah_Middot.3.3"], ["רמב״ם בית הבחירה ב, יד", "Mishneh_Torah,_The_Chosen_Temple.2.14"], ["מידות ג, א", "Mishnah_Middot.3.1"], ["זבחים סב:", {"book": 130, "index": 2129}], ["רש״י זבחים סב:", {"book": 2191, "index": 3022}]]], ["o1", "תוספות — גם כבש שלישי", "לפי תוספות (זבחים סד. ד״ה יותר מל״א אמות): ״נראה דהיה שם כבש״ — גם במערב היה כבש קטן לסובב, ולכן שלושה כבשים קטנים. והקשו התוספות על עצמם: ״אבל קשה דלא חשיב ליה לעיל... גבי שני כבשים קטנים יוצאים מן הכבש״; ולחם שמים יישב: ״דהנך תרתי דסובב בחדא חשיב להו״. במשנה (מידות ג, ג) נזכר הכבש הגדול בלבד. מקומו ומידותיו — בחירת מודל. \nשני הכבשים הקטנים יוצאים מגוף הכבש הגדול (״יוצאים ממנו״, רמב״ם ב, יד). רש״י (זבחים סב:): ״אותו שפונין בו לסובב יצא במזרחו של כבש לימין ויוצא ומתחיל בשפולו של כבש ונמשך ועולה באלכסון עד שמגיע לסובב״.\n**הכבש העולה לסובב** (ולתוספות — שני הכבשים העולים לסובב), במודל: הוא יוצא מצד הכבש הגדול בשליש התחתון שלו, ״בשפולו של כבש״. בתחילתו הוא צמוד לכבש הגדול ובגובה הילוכו; משם הוא פונה ממנו באלכסון ועולה במתינות, ובינו לבין הכבש הגדול אוויר גמור עד הרצפה. קצהו העליון חתוך לאורך שפת הסובב ובגובהה — כהמשך לסובב — ובכל זאת ״ומובדלין מן המזבח מלא נימא״. כמה הוא נוטה ורוחבו — בחירת מודל.\n**הכבש היורד ליסוד — לרש״י:** ״והפונה ליסוד יוצא למערבו... פונה לשמאלו ליסוד דרומי, ומתחיל לצאת בשיפולו של כבש רחוק מן המזבח, כדי שיהא נוח לשפע ולירד ליסוד״. במודל הוא הולך באלכסון מצלעו המערבית של הכבש הגדול אל אמת היסוד שבקרן הדרומית־מערבית (מידות ג, א: ״ואוכל בדרום אמה אחת״), כציור התוספות יום טוב והתפארת ישראל.\n**הכבש היורד ליסוד — לתוספות,** כביאור התוספות יום טוב (זבחים ו, ג): הוא צמוד לכבש השלישי מבחוץ, לאורכו, מאותו שליש עד הקרן הדרומית־מערבית של היסוד — כבש אחד רחב, ומקצתו מוגבה עד הסובב.\n**שלא צויר:** כבש ליסוד הצמוד לכבש הגדול — אינו מוכרח מן המקורות, ואין לו דרך להגיע אל אמת היסוד.\n**לחם שמים** (על הרמב״ם, בית הבחירה ב, יד): ״שהיו שני כבשים קטנים פונים לסובב מזה אחד ומזה אחד, יוצאין משיפולו של כבש גדול ומשפעין ועולין עד שנעשין גבוהים בשוה עם הסובב, הימני לעלייה והשמאלי לירידה, שבו יורדין מן המזבח להוליך בו שירים ליסוד דרומי״; והכבש ליסוד — ״הוא קטן ונמוך ביותר לפי גובהו של יסוד בלבד״.", [["מידות ג, ג", "Mishnah_Middot.3.3"], ["רמב״ם בית הבחירה ב, יד", "Mishneh_Torah,_The_Chosen_Temple.2.14"], ["מידות ג, א", "Mishnah_Middot.3.1"], ["לחם שמים בית הבחירה ב, יד", {"book": 5069, "index": 31}], ["זבחים סב:", {"book": 130, "index": 2129}], ["רש״י זבחים סב:", {"book": 2191, "index": 3022}], ["תוספות זבחים סד.", {"book": 1936, "index": 681}]]]],
          current: "o0",
          onPick: (k) => { if (ctx.shared.ramps && typeof ctx.shared.ramps.set === "function") ctx.shared.ramps.set(k === "o1"); },
          fly: (k) => { const c = {"o0": [[26, 45, 48], [42, 17, 30]], "o1": [[26, 45, 48], [42, 17, 30]]}[k]; if (c && c[0] && c[1]) fly(ui_altarCam(ctx, c[0], "ramp"), ui_altarCam(ctx, c[1], "ramp")); }
        });
        opRow({
          id: "sh26", short: "המוכני של הכיור — גלגל, או כלי סביב הכיור", cardFly: true,
          cap: "המוכני של הכיור — גלגל, או כלי סביב הכיור",
          refs: [["יומא ג, י", "Mishnah_Yoma.3.10"], ["יומא לז.", {"book": 107, "index": 889}], ["רש״י יומא לז.", {"book": 2157, "index": 1384}], ["ברטנורא יומא ג, י", "Bartenura_on_Mishnah_Yoma.3.10"], ["רמב״ם בית הבחירה ג, יח", "Mishneh_Torah,_The_Chosen_Temple.3.18"], ["השגות הראב״ד בית הבחירה ג, יח", {"book": 5252, "index": 20}], ["כסף משנה בית הבחירה ג, יח", {"book": 4260, "index": 166}], ["אבן האזל בית הבחירה ג, יח", {"book": 4466, "index": 45}], ["פירוש המשניות לרמב״ם תמיד א, ד", {"book": 575, "index": 10}], ["פירוש המשניות לרמב״ם תמיד ג, ח", {"book": 575, "index": 38}], ["תוספות יום טוב תמיד א, ד", {"book": 944, "index": 45}]],
          options: [["o0", "רש״י והראב״ד — גלגל, ומשקיעים את הכיור בבור", "המשנה (יומא ג, י): ״ואף הוא עשה מוכני לכיור, שלא יהיו מימיו נפסלין בלינה״; והגמרא (יומא לז.): ״מאי מוכני? אמר אביי: גילגלא דהוה משקעא ליה״.\n**רש״י** (יומא לז.): ״גלגל לשקעו בו בבור, שיהו מימיו מחוברים למימי הכיור, ואי לא הוו מיפסלי בלינה, לפי שקדשו בכלי״. וכן **הברטנורא** (יומא ג, י): ״גלגל לשקעו בבור, שיהיו מימיו מחברים בבור ולא יפסלו בלינה״.\n**הראב״ד** (השגות, בית הבחירה ג, יח): ״אנו מקובלים שהמוכני אינו מקבל מים, והוא גלגל שהיו קושרים בו את הכיור בחבל, ומשקעין אותו הוא ומימיו בבור העזרה בערב, כדי שיהיו מימיו מחוברים ולא יפסלו בלינה״.\nבמודל (ברירת המחדל): הכיור תלוי בגלגל מעל הבור, וב״הדגמת המוכני״ הוא יורד לתוכו ועולה. צורת הגלגל ועומק הבור — בחירת מודל.", [["יומא ג, י", "Mishnah_Yoma.3.10"], ["יומא לז.", {"book": 107, "index": 889}], ["רש״י יומא לז.", {"book": 2157, "index": 1384}], ["ברטנורא יומא ג, י", "Bartenura_on_Mishnah_Yoma.3.10"], ["רמב״ם בית הבחירה ג, יח", "Mishneh_Torah,_The_Chosen_Temple.3.18"], ["השגות הראב״ד בית הבחירה ג, יח", {"book": 5252, "index": 20}], ["כסף משנה בית הבחירה ג, יח", {"book": 4260, "index": 166}], ["אבן האזל בית הבחירה ג, יח", {"book": 4466, "index": 45}], ["פירוש המשניות לרמב״ם תמיד א, ד", {"book": 575, "index": 10}]]], ["o1", "הרמב״ם — כלי חול סביב הכיור, והמים שותתים ממנו", "**הרמב״ם** (בית הבחירה ג, יח): ״ומוכני עשו לו שיהיו בה המים תמיד. והיא חול, כדי שלא יהיו המים שבה נפסלין בלינה, שהכיור מכלי הקדש ומקדש, וכל דבר שיתקדש בכלי קדש אם לן נפסל״.\nובפירוש המשניות (תמיד א, ד): ״שבן קטין עשה כלי על הכיור להיות מלא מים, והיה סביב לכיור, כדי שלא יפסלו מימיו בלינה״. ובפירושו ליומא (ג, י), כלשון הכסף משנה: ״וזה עשה כלי סביב לכיור, והיו בו המים תמיד, והיו שותתין מאותו כלי לכיור כדי הצורך ראשון ראשון, ואותו הכלי היה נקרא מוכני״.\nובפירוש המשניות (תמיד ג, ח): ״ושם נתבאר שהמוכני שעשה בן קטין היה מכסה גבוה יורד בגלגל, והיא מה שאמר: מאי מוכני — גלגלא דהוו משקעי ליה, והיו שומעין לגלגול הגלגל ההוא״. **התוספות יום טוב** (תמיד א, ד) מביא את הלשון הזאת (בנוסחו: ״מכסה [עולה] ויורד בגלגל״), וכותב: ״אבל מלשונו זה שבפי׳ בפ״ג דלקמן מוכח שדבריו עולים בסגנון אחד, שהיה כלי סביב ושהיו משקעים אותו הכלי״.\n**הכסף משנה** (בית הבחירה ג, יח) מפרש לדעתו ״גילגלא דהוה משקעא ליה״ — ״שעשה כלי עגול כגלגל סביבות הכיור, שהיה הכיור משוקע בתוכו״.\n**בקצרה —** הראב״ד חולק: ״דברים זרים אני רואה בכאן״. ו**אבן האזל** (שם) מביא שבהלכות ביאת מקדש כתב הרמב״ם כפירוש רש״י, ומביא את דברי התוספות יום טוב שלמעלה.\nבמודל: כלי עגול סביב הכיור, ובו המים, ומאותו כלי שותתים המים לכיור. צורת הכלי, מידותיו, גובהו והחומר שלו — בחירת מודל. ב״הדגמת המוכני״ יורד הכלי שסביב הכיור — ״שהיו משקעים אותו הכלי״, כתוספות יום טוב ואבן האזל; ושהכיור יורד עמו — בחירת מודל.", [["יומא ג, י", "Mishnah_Yoma.3.10"], ["יומא לז.", {"book": 107, "index": 889}], ["רש״י יומא לז.", {"book": 2157, "index": 1384}], ["ברטנורא יומא ג, י", "Bartenura_on_Mishnah_Yoma.3.10"], ["רמב״ם בית הבחירה ג, יח", "Mishneh_Torah,_The_Chosen_Temple.3.18"], ["השגות הראב״ד בית הבחירה ג, יח", {"book": 5252, "index": 20}], ["כסף משנה בית הבחירה ג, יח", {"book": 4260, "index": 166}], ["אבן האזל בית הבחירה ג, יח", {"book": 4466, "index": 45}], ["פירוש המשניות לרמב״ם תמיד א, ד", {"book": 575, "index": 10}], ["פירוש המשניות לרמב״ם תמיד ג, ח", {"book": 575, "index": 38}], ["תוספות יום טוב תמיד א, ד", {"book": 944, "index": 45}]]]],
          current: "o0",
          onPick: (k) => { const M = ctx.shared.mochani; if (M && typeof M.set === "function") M.set(k === "o1" ? "rambam" : "rashi"); },
          fly: (k) => { const c = {"o0": [[30, 42, 44], [22, 18, 57]], "o1": [[30, 42, 44], [22, 18, 57]]}[k]; if (c && c[0] && c[1]) fly(c[0], c[1]); }
        });
        opRow({
          id: "sh27", short: "בין האולם ולמזבח — רוחבו", cardFly: true,
          cap: "בין האולם ולמזבח — רוחבו",
          refs: [["כלים א, ט", "Mishnah_Kelim.1.9"], ["מידות ה, א", "Mishnah_Middot.5.1"], ["יומא כא.", "Yoma.21a"], ["המפרש, תמיד כח.", "Mefaresh_on_Tamid.28.1"]],
          options: [["o0", "לכל רוחב העזרה", "לשון המשנה (כלים א, ט): ״בין האולם ולמזבח מקדש ממנה, שאין בעלי מומין ופרועי ראש נכנסים לשם״; (מידות ה, א): ״בין האולם ולמזבח עשרים ושתים אמה״.\nבמודל (ברירת המחדל): הרצועה מסומנת לכל רוחב העזרה, מן הכותל הצפוני עד הדרומי. רוחבה מצפון לדרום לא נתפרש במשנה — בחירת מודל. בבחירה כאן הרצועה מוארת ל־15 שניות.", [["כלים א, ט", "Mishnah_Kelim.1.9"], ["מידות ה, א", "Mishnah_Middot.5.1"], ["יומא כא.", "Yoma.21a"], ["המפרש, תמיד כח.", "Mefaresh_on_Tamid.28.1"]]], ["o1", "כנגד המזבח והכבש בלבד — תוספות ר״י הלבן", "בגמרא (יומא כא.): ״בשעה שישראל עולין לרגל, עומדין צפופין ומשתחוים רווחים, ונמשכין אחת עשרה אמה אחורי בית הכפורת״.\nתוספות ר״י הלבן שם (מתוך צילום הספר; אינו בספריית אוצריא): ״ונימשכין אחת עשרה אמה אחורי בית [הכפורת]. הכא משמ׳ שברגל היו ישראל ניכנסין חוץ מאחת עשרה אמה שלהן לי״א שלעזרת כהנים, והיו נכנסין לי״א אמות שאחורי הכפורת דרך חלל [שבין] המזבח לכותל עזרה עד שהיו מגיעין לאולם, ושוב דרך חלל שבין אולם לכותל עזרה עד שהיו מגיעין לי״א [אמות] דאחורי הכפורת, אבל בחלל האולם למזבח ודא[י] לא היו ניכנסין, דהא אפילו כהנים בעלי מומין ופרועי ראש לא היו ניכנסין לשם, כדתנן בתחילת טהרות: בין האולם ולמזבח מקודש ממנה, שאין בעלי מומין ופרועי ראש ניכנסין לשם״.\nוהמפרש (תמיד כח.): ״וכי היכי דאדם אסור ליכנס בין אולם למזבח, הכי הוא דאסור ליכנס בין אולם לכבש, דכבש הוא כמזבח לכל דבר״.\nבמודל: הרצועה רק כנגד המזבח והכבש; מצפון למזבח ומדרום לכבש נשאר מעבר עד כותלי העזרה. גבולה המדויק — בחירת מודל. בבחירה כאן הרצועה מוארת ל־15 שניות.", [["כלים א, ט", "Mishnah_Kelim.1.9"], ["מידות ה, א", "Mishnah_Middot.5.1"], ["יומא כא.", "Yoma.21a"], ["המפרש, תמיד כח.", "Mefaresh_on_Tamid.28.1"]]]],
          current: "o0",
          onPick: (k) => { const Z = ctx.shared.ulamAltarZone; if (Z && typeof Z.set === "function") Z.set(k === "o1" ? "narrow" : "wide"); const F = (ctx.shared.features || {}).zoneUlamAltar; if (F) { F.on(); ctx.ui.autoOff.arm("__uaz", () => { try { F.off(); } catch (_) {} }); } },
          fly: (k) => { const c = {"o0": [[64, 100, 0.5], [28.5, 16, 0]], "o1": [[64, 100, 24.5], [28.5, 16, 24]]}[k]; if (c && c[0] && c[1]) fly(c[0], c[1]); }
        });
        opRow({
          id: "sh28", short: "מעלות האולם", cardFly: true,
          cap: "מעלות האולם",
          refs: [["מידות ג, ו", "Mishnah_Middot.3.6"], ["ברטנורא ג, ו", "Bartenura_on_Mishnah_Middot.3.6"], ["מידות ה, א", "Mishnah_Middot.5.1"], ["תפא״י ג, ו", "Yachin_on_Mishnah_Middot.3.6"], ["תוי״ט ד, ו", "Tosafot_Yom_Tov_on_Mishnah_Middot.4.6"], ["בועז ג, ו", "Boaz_on_Mishnah_Middot.3.6"], ["רמב״ם בית הבחירה ו, ד", "Mishneh_Torah,_The_Chosen_Temple.6.4"], ["פירוש המשניות לרמב״ם מדות ג, ו", "Rambam_Commentary_on_Middot.3.6"], ["רמב״ם בית הבחירה ד, ט", "Mishneh_Torah,_The_Chosen_Temple.4.9"], ["מאירי מדות ג, ו", "Meiri_on_Middot.3.6"]],
          options: [["o0", "ברטנורא", "לשון המשנה (מידות ג, ו): ״בין האולם ולמזבח, עשרים ושתים אמה. ושתים עשרה מעלות היו שם, רום מעלה חצי אמה, ושלחה אמה. אמה אמה ורבד שלש, ואמה אמה ורבד שלש. והעליונה, אמה אמה ורבד ארבע. רבי יהודה אומר, העליונה, אמה אמה ורבד חמש״.\nברטנורא (בשם רבי ברוך, מנוסחאות ישנות מדויקות): ״רובד״ — שורה של רצפה, כמו ״מקף רבדים של אבן״; שלוש מעלות ששלחן אמה (״אמה אמה״ — השנייה והשלישית), ״מעלה רביעית היה רחבה שלש אמות״, חמישית ושישית אמה, ״מעלה שביעית היה רחבה שלש אמות״, ואחר ארבע מעלות של אמה — ״המעלה העליונה שהיא המעלה של שתים עשרה... היתה רחבה ארבע אמות עד האולם״; ״נמצאו כל המעלות תשע עשרה אמות מן הראשונה עד האולם. ושלש אמות רחב של רצפה חלקה היה מן המזבח עד תחלת המעלות״ — עשרים ושתיים (ברטנורא מידות ג, ו).\nבמודל: כברטנורא — שלוש אמות רצפה אצל המזבח, ואחריהן שתים עשרה מעלות ברוחב 1, 1, 1, 3, 1, 1, 3, 1, 1, 1, 1, 4 אמות, כל אחת גבוהה חצי אמה מקודמתה, והעליונה ברום האולם; לכל רוחב האולם (תפארת ישראל).", [["מידות ג, ו", "Mishnah_Middot.3.6"], ["ברטנורא ג, ו", "Bartenura_on_Mishnah_Middot.3.6"], ["מידות ה, א", "Mishnah_Middot.5.1"]]], ["o1", "תפארת ישראל", "לשון המשנה (מידות ג, ו): ״בין האולם ולמזבח, עשרים ושתים אמה. ושתים עשרה מעלות היו שם, רום מעלה חצי אמה, ושלחה אמה. אמה אמה ורבד שלש, ואמה אמה ורבד שלש. והעליונה, אמה אמה ורבד ארבע. רבי יהודה אומר, העליונה, אמה אמה ורבד חמש״.\nתפארת ישראל (יכין): ״ב׳ מעלות היו כל אחת רחבה אמה, ומעלה שלישית היתה רובד״ — רצפה רחבה — ״ג׳ אמות. וכך היה ג׳ פעמים״; המעלה התחתונה רחוקה מן המזבח אמה, ״דאלו היתה גג מעלה הראשונה סמוכה ממש למזבח, לא היה עליה שם מעלה״ — מן המזבח עד סוף הרובד הראשון שש אמות, עד סוף השני אחת עשרה, עד סוף השלישי שש עשרה; ואחר כך הסדר הרביעי, העליון — שתי מעלות של אמה ורובד של ארבע: ״נמצא שכל הי״ב מעלות שמהמזבח עד פתח האולם, היו כוללים מרחק כ״ב אמות״. ולרבי יהודה — גג המעלה התחתונה סמוך לקיר המזבח, ואף על פי כן שם מעלה עליה, שהיא מתפשטת לצפון ולדרום של המזבח, ולכן הרובד העליון חמש. והמעלות בכל רוחב האולם מצפון לדרום, לא רק כנגד הפתח — ״ומדסתם בלישני׳ ש״מ דהי״ב מעלות שזכר היו בכל המשך הרווח ההוא״ — ומכסות את האוטם במזרח (תפארת ישראל מידות ג, ו).\nבמודל: בחירת הדעה מחליפה את המעלות — אמה רצפה אצל המזבח, ואחריה מעלות ברוחב 1, 1, 3, 1, 1, 3, 1, 1, 3, 1, 1, 4 אמות, כל אחת גבוהה חצי אמה מקודמתה; לכל רוחב האולם.", [["מידות ג, ו", "Mishnah_Middot.3.6"], ["תפא״י ג, ו", "Yachin_on_Mishnah_Middot.3.6"], ["תוי״ט ד, ו", "Tosafot_Yom_Tov_on_Mishnah_Middot.4.6"]]], ["o2", "רמב״ם", "הרמב״ם (בית הבחירה ו, ד): ״ובין האולם ולמזבח בשוה. ועולה משם לאולם בשתים עשרה מעלות. רום כל מעלה חצי אמה ושלחה חצי אמה״. בועז (ג, ו): ״ודברי הרמב״ם... בענין זה תמוהין מאד״, והכסף משנה הניחם בצריך עיון; הברטנורא והתפארת ישראל (מידות ג, ו) קוראים את המשנה כפשוטה — מעלות של אמה ורובדים של שלוש ושל ארבע הממלאים את עשרים ושתיים האמות. במודל: שתים עשרה מעלות של חצי אמה צמודות לאולם (שש אמות), והשאר מישור.\nכותל האולם — ״אמה ורובד״: לרמב״ם אין אלה מעלות אלא כותל האולם. **פירוש המשנה** (מדות ג, ו): ״שכותל האולם היה בנוי כסדר הזה והוא שאמה אחת מגובה הכותל לארכו היה חלק ושוה כשאר הכתלים אח״כ בנין [בולט] מהכותל כגון כצוצרה גבהו ג׳ אמות... וכן כל בנינו אמה ורובד שלש״. **משנה תורה** (בית הבחירה ד, ט): ״וכן סביב לכתלי האולם מלמטה עד למעלה כך היו אמה אחת חלק ורבד שלש אמות... ובין כל רבד ורבד אמה. ורבד העליון היה רחבו ארבע אמות״ (הכסף משנה כתב שהמשפט הזה מיותר בדפוסים; הלחם שמים חולק ומקיים אותו). **המאירי** (מדות ג, ו) — כמותו: ״הוא חוזר על כותלי האולם לומר שסביב הכותל בונין אמה גובה ואחר כך יוצא ממנה בנין רחב שלש והוא הנקרא רובד״.\nבמודל (בבחירה זו): על חזית האולם — מלמעלה רובד של ארבע אמות, ומתחתיו אמה חלקה ורובד של שלוש, עד הרצפה; סביב הפתח, הקורות ופס הזהב — הרבדים נעצרים. כמה הרובד בולט מן הכותל (חצי אמה) — בחירת מודל.", [["מידות ג, ו", "Mishnah_Middot.3.6"], ["בועז ג, ו", "Boaz_on_Mishnah_Middot.3.6"], ["רמב״ם בית הבחירה ו, ד", "Mishneh_Torah,_The_Chosen_Temple.6.4"], ["פירוש המשניות לרמב״ם מדות ג, ו", "Rambam_Commentary_on_Middot.3.6"], ["רמב״ם בית הבחירה ד, ט", "Mishneh_Torah,_The_Chosen_Temple.4.9"], ["מאירי מדות ג, ו", "Meiri_on_Middot.3.6"]]]],
          current: "o0",
          onPick: (k) => { if (ctx.shared.ulamSteps && typeof ctx.shared.ulamSteps.set === "function") ctx.shared.ulamSteps.set(["bartenura", "tiferet", "rambam"][+k.slice(1)] || "bartenura"); },
          fly: (k) => { const c = {"o0": [[46, 36, 46], [28, 18, 0]], "o1": [[46, 36, 46], [28, 18, 0]], "o2": [[46, 36, 46], [28, 18, 0]]}[k]; if (c && c[0] && c[1]) fly(c[0], c[1]); }
        });
        opRow({
          id: "sh29", short: "רוחב האולם ובית החליפות", cardFly: true,
          cap: "רוחב האולם ובית החליפות",
          refs: [["מידות ד, ז", "Mishnah_Middot.4.7"], ["תוי״ט מידות ד, ז", {"book": 948, "index": 181}], ["תוי״ט מידות ד, ז (בית החליפות)", {"book": 948, "index": 182}], ["רבינו שמעיה מידות ד, ז", {"book": 645, "index": 155}], ["תפארת ישראל מידות ד, ז", {"book": 819, "index": 618}], ["זבחים נה:", {"book": 130, "index": 1920}], ["תפא״י ד, ז", "Yachin_on_Mishnah_Middot.4.7"], ["רמב״ם בית הבחירה ד, ה", "Mishneh_Torah,_The_Chosen_Temple.4.5"], ["ברטנורא מידות ד, ז", {"book": 643, "index": 204}], ["ברטנורא מידות ד, ז (צר מאחוריו)", {"book": 643, "index": 206}]],
          options: [["o0", "תוספות יום טוב — אולם שבעים", "לשון המשנה (מידות ד, ז): ״האולם עודף עליו חמש עשרה אמה מן הצפון, וחמש עשרה אמה מן הדרום, והוא היה נקרא בית החליפות, ששם גונזים את הסכינים. וההיכל צר מאחריו, ורחב מלפניו, ודומה לארי״. תוספות יום טוב: הראב״ד על הרמב״ם — ״שלא היה שם כותל לאולם כלל... ורוחב האולם נמנה ברוחב ההיכל״; ולדעת התוי״ט האולם לא נמשך אצל התאים לצפון ולדרום כלל, אלא עודף עליהם חמש עשרה מכל צד, במשך של שש עשרה אמה ממערב למזרח (כותל האולם חמש והאולם אחת עשרה), ובית החליפות — חמש עשרה האמות העודפות (ר׳ שמעיה: ״צר מאחוריו. ע׳ אמה״; ״ורחב מלפניו. ק׳ אמה״). תפארת ישראל: בית החליפות — חדר של עשר אמות מצפון לדרום ואחת עשרה ממזרח למערב מכל צד, ובו ארגז לכל משמר לגנוז סכיניו; ״חליף״ — סכין ביוונית; ולכל בית חליפות שני פתחים, אחד לאולם ואחד בזווית, גבוהים שמונה אמות, להכשיר את כל העזרה לשחיטת קדשים קלים (זבחים נה:). במודל: ההיכל שבעים אמה והאולם מאה; חלל האולם כרוחב ההיכל, ובית החליפות גושים אטומים עם תווית — פתחיהם ותוכם אינם מצוירים. במבט מלמעלה מסומנים על ראש הבניין: חלל האולם — במסגרת כחולה, ובית החליפות — במסגרת כתומה (סימני המודל).", [["מידות ד, ז", "Mishnah_Middot.4.7"], ["תוי״ט מידות ד, ז", {"book": 948, "index": 181}], ["תוי״ט מידות ד, ז (בית החליפות)", {"book": 948, "index": 182}], ["רבינו שמעיה מידות ד, ז", {"book": 645, "index": 155}], ["תפארת ישראל מידות ד, ז", {"book": 819, "index": 618}], ["זבחים נה:", {"book": 130, "index": 1920}]]], ["o1", "תפארת ישראל — חדרי החליפות", "תפארת ישראל (מידות ד, ז): האולם מתרחב לכל צד חמש עשרה אמה — כותל האולם חמש, ועשר אמות חלל; ״ורוחב החלל הזה ממזרח למערב היה י״א אמה״; ״והוא היה נקרא בית החליפות אותו רווח של י׳ אמה מצפון לדרום וי״א אמה ממזרח למערב, שהיה האולם יתר לכאן ולכאן, היה חדר מכאן ומכאן, ונקראו בית חליפות״ — שם גונזים את הסכינים, ארגז לכל משמר; ״ולכל א׳ מב׳ בתי החליפות שבאולם היו ב׳ פתחים, א׳ לאולם, וא׳ בזוית״ — בזווית צפונית־מערבית ובזווית דרומית־מערבית, כל פתח גבוה שמונה אמות, ״כדי להכשיר כל עזרה כולה שם לשחיטת קדשים קלים״; ובגמרא (זבחים נה:): ״כדי להכשיר את העזרה כולה לאכילת קדשי קדשים, ולשחיטת קדשים קלים״.\nבמודל: האולם שבעים אמה, ומשני צדיו חדר של עשר על אחת עשרה, ובו פתח לאולם ופתח בזווית המערבית; גובה החדר (עשרים), המחיצה בינו לאולם והכותל המערבי — בחירת מודל. במבט מלמעלה התקרה פתוחה. במבט מלמעלה מסומנים על ראש הבניין: חלל האולם — במסגרת כחולה, ובית החליפות — במסגרת כתומה (סימני המודל).", [["מידות ד, ז", "Mishnah_Middot.4.7"], ["תפא״י ד, ז", "Yachin_on_Mishnah_Middot.4.7"], ["זבחים נה:", {"book": 130, "index": 1920}]]], ["o2", "רמב״ם — אולם תשעים", "הרמב״ם (בית הבחירה ד, ה): ״מן הצפון לדרום מאה אמה. עבי כתל האולם חמש אמות. ומכתל אולם עד כתל הקדש עשר אמות״ — בין כותל האולם לכותל ההיכל חלל של עשר אמות, ואם הוא פתוח לאולם — חלל האולם תשעים אמה. ברטנורא (מידות ד, ז) כדעה זו: ״שכתל האולם עביו חמש אמה, והאולם עשר אמות לצפון וכן לדרום״ — ולכן ״צר מאחוריו ורחב מלפניו״ לא נתפרש לו, ״שהרי מאה על מאה היה בשוה״. תוספות יום טוב דוחה: אם האולם נמשך לצפון ולדרום, היה לתנא לכלול אותו בחשבון מצפון לדרום — ״כותל האולם חמש והאולם עשרה״ — כמו שכתב הרמב״ם בחיבורו, ואין מי שיכריח להעדיף את האולם בכל צד. בחירת הדעה מחליפה את האולם במודל. במבט מלמעלה מסומנים על ראש הבניין: חלל האולם — במסגרת כחולה, ובית החליפות — במסגרת כתומה (סימני המודל).", [["רמב״ם בית הבחירה ד, ה", "Mishneh_Torah,_The_Chosen_Temple.4.5"], ["ברטנורא מידות ד, ז", {"book": 643, "index": 204}], ["ברטנורא מידות ד, ז (צר מאחוריו)", {"book": 643, "index": 206}], ["תוי״ט מידות ד, ז", {"book": 948, "index": 181}]]]],
          current: "o0",
          onPick: (k) => { if (ctx.shared.ulamWidth && typeof ctx.shared.ulamWidth.set === "function") ctx.shared.ulamWidth.set(["mishnah", "tiferet", "rambam"][+k.slice(1)] || "mishnah"); },
          fly: (k) => { const c = {"o0": [[9, 215, 0], [7, 60, 0]], "o1": [[9, 215, 0], [7, 60, 0]], "o2": [[9, 215, 0], [7, 60, 0]]}[k]; if (c && c[0] && c[1]) fly(c[0], c[1]); if (ctx.shared.openFor) ctx.shared.openFor("hei-ulam", 15000); }
        });
        opRow({
          id: "sh30", short: "תקרת האולם", cardFly: true,
          cap: "תקרת האולם",
          refs: [["מידות ג, ח", "Mishnah_Middot.3.8"], ["רש״י יומא נב.", "Rashi_on_Yoma.52.1"], ["תוספות רי״ד יומא נב.", "Tosafot_Rid_on_Yoma.52.1"]],
          options: [["o0", "כיפה — רש״י", "רש״י (יומא נב., ד״ה כותל אולם): ״כותל החיצון, למטה רוחב היסוד והאסקופה, ולמעלה מגובה כיפת הפתח — עובי החומה שעולה עד ק׳ אמה, לבד רוחב כיפת החלל שהיא י״א אמה״. ובתוספות רי״ד שם: ״ומשמע מדבריו שאותן י״א אמה שהיו בין האולם ובין ההיכל כיפה היתה עליהם״. ובמשנה (מידות ג, ח): ״ושרשרות של זהב היו קבועות בתקרת האולם״.\nבמודל (ברירת המחדל): כיפה על אחת עשרה האמות, לכל אורך האולם; וראש פתח האולם קשת — ״כיפת הפתח״. גובה הכיפות וצורתן — בחירת מודל.", [["מידות ג, ח", "Mishnah_Middot.3.8"], ["רש״י יומא נב.", "Rashi_on_Yoma.52.1"], ["תוספות רי״ד יומא נב.", "Tosafot_Rid_on_Yoma.52.1"]]], ["o1", "בלי תקרה — תוספות רי״ד", "תוספות רי״ד (יומא נב.), על דברי רש״י: ״ואינו נראה לי, אלא האולם לא הי׳ אלא כותל אחד שאורכו מאה אמה ועוביו ה׳ אמות, ופתח הי׳ באמצעו ארבעים אמה גובהו ועשרים אמה רחבו, ובינו ובין ההיכל הי׳ אויר מגולה, ולא הי׳ שם תקרה ולא כיפה״. וראייתו מכלונסות הארז: ״ואילו הי׳ כיפה באותן י״א אמה, א״כ הי׳ מחובר כותל האולם עם ההיכל, ולא היו צריכים לכלונסות״.\nבמודל: אין תקרה ואין בניין מעל האולם — כותל האולם עומד לבדו, וכלונסות הארז מחברים אותו אל כותל ההיכל.", [["מידות ג, ח", "Mishnah_Middot.3.8"], ["רש״י יומא נב.", "Rashi_on_Yoma.52.1"], ["תוספות רי״ד יומא נב.", "Tosafot_Rid_on_Yoma.52.1"]]]],
          current: "o0",
          onPick: (k) => { if (ctx.shared.ulamCeiling && typeof ctx.shared.ulamCeiling.set === "function") ctx.shared.ulamCeiling.set(k === "o1" ? "none" : "vault"); if (k !== "o1") for (const id of ["hei-ulam", "hei-ulam-front"]) { const b = (ctx.shared.modelButtons || []).find((x) => x.id === id); try { if (b && b.get && b.get()) b.set(false); } catch (_) {} } },
          fly: (k) => { const c = {"o0": [[7, 24.5, 29], [7, 55, 0]], "o1": [[7, 160, 20], [7, 60, -2]]}[k]; if (c && c[0] && c[1]) fly(c[0], c[1]); }
        });
        opRow({
          id: "sh31", short: "הנברשת של הילני — צורתה", cardFly: true,
          cap: "הנברשת של הילני — צורתה",
          refs: [["יומא ג, י", "Mishnah_Yoma.3.10"], ["יומא לז.", "Yoma.37a"], ["רש״י יומא לז.", "Rashi_on_Yoma.37.1"], ["ברטנורא יומא ג, י", "Bartenura_on_Mishnah_Yoma.3.10"], ["פירוש המשניות לרמב״ם יומא ג, י", {"book": 517, "index": 66}]],
          options: [["o0", "רש״י וברטנורא — מנורה", "לשון המשנה (יומא ג, י): ״הילני אמו עשתה נברשת של זהב על פתחו של היכל״.\n**רש״י** (יומא לז.): ״נברשתא — מנורה״. **ברטנורא** (יומא ג, י): ״נברשת. מנורה״.\n**הגמרא** (יומא לז:): ״תנא: בשעה שהחמה זורחת ניצוצות יוצאין ממנה, והכל יודעין שהגיע זמן קריאת שמע״.\nבמודל (ברירת המחדל): מנורה של זהב תלויה בשרשרת באולם, לפני פתח ההיכל ומעל הגפן. מספר הקנים, גודלה, גובהה ותלייתה בשרשרת — בחירת מודל.", [["יומא ג, י", "Mishnah_Yoma.3.10"], ["יומא לז.", "Yoma.37a"], ["רש״י יומא לז.", "Rashi_on_Yoma.37.1"], ["ברטנורא יומא ג, י", "Bartenura_on_Mishnah_Yoma.3.10"], ["פירוש המשניות לרמב״ם יומא ג, י", {"book": 517, "index": 66}]]], ["o1", "הרמב״ם — שמשית מעל הפתח", "לשון המשנה (יומא ג, י): ״הילני אמו עשתה נברשת של זהב על פתחו של היכל״.\n**הרמב״ם** (פירוש המשנה, יומא ג, י): ״ונברשת היא כמו שמשית שעושין על פתחי הבתים מזכוכית והיא עשתה אותה מזהב טוב ממורט. וכשהיה השמש זורח עליה היה לאותה השמשית אורה ונוגה בתחילת היום כעלות השמש מאופק ירושלים ואותה שעה היו קורין קריאת שמע״.\n**הגמרא** (יומא לז:): ״תנא: בשעה שהחמה זורחת ניצוצות יוצאין ממנה, והכל יודעין שהגיע זמן קריאת שמע״.\nבמודל: שמשית של זהב על כותל ההיכל, מעל הפתח ומעל הגפן. צורתה וגודלה — בחירת מודל.", [["יומא ג, י", "Mishnah_Yoma.3.10"], ["יומא לז.", "Yoma.37a"], ["רש״י יומא לז.", "Rashi_on_Yoma.37.1"], ["ברטנורא יומא ג, י", "Bartenura_on_Mishnah_Yoma.3.10"], ["פירוש המשניות לרמב״ם יומא ג, י", {"book": 517, "index": 66}]]]],
          current: "o0",
          onPick: (k) => { const H = ctx.shared.helene; if (H && typeof H.set === "function") H.set(k === "o1" ? "rambam" : "rashi"); },
          fly: (k) => { const c = {"o0": [[26, 44, 0], [4.6, 48, 0]], "o1": [[26, 44, 0], [1.6, 46.6, 0]]}[k]; if (c && c[0] && c[1]) fly(c[0], c[1]); }
        });
        opRow({
          id: "sh32", short: "הנברשת והטבלא של הילני — מבט", cardFly: true, cardOnly: true,
          cap: "הנברשת והטבלא של הילני — מבט",
          refs: [["יומא ג, י", "Mishnah_Yoma.3.10"], ["תוספתא סוטה ב, א", {"book": 205, "index": 10}]],
          options: [["o0", "הנברשת — מעל פתח ההיכל", "מן העזרה, דרך פתח האולם: הנברשת של זהב תלויה מעל פתח ההיכל, והטבלא קבועה בכותל שמצפון לפתח (הצד — בחירת מודל).", [["יומא ג, י", "Mishnah_Yoma.3.10"], ["תוספתא סוטה ב, א", {"book": 205, "index": 10}]]], ["o1", "הטבלא של זהב — מקרוב", "מתוך האולם, מול הטבלא: ״טבלא של זהב היתה קבועה בכותלו של היכל והיא נראית [מבאולם]״ (תוספתא סוטה ב, א). מסגרת כתומה מסמנת אותה ל־15 שניות — סימן של המודל.", [["יומא ג, י", "Mishnah_Yoma.3.10"], ["תוספתא סוטה ב, א", {"book": 205, "index": 10}]]]],
          current: "o0",
          onPick: (k) => { const F = (ctx.shared.features || {}).heleneTabletGlow; if (F) { if (k === "o1") { F.on(); ctx.ui.autoOff.arm("__hln", () => { try { F.off(); } catch (_) {} }); } else { ctx.ui.autoOff.cancel("__hln"); F.off(); } } },
          fly: (k) => { const c = {"o0": [[39, 39, 2], [3, 39, -6.5]], "o1": [[9.8, 27.1, -15.2], [1.7, 26.25, -12.3]]}[k]; if (c && c[0] && c[1]) fly(c[0], c[1]); if (ctx.shared.openFor) ctx.shared.openFor("hei-ulam", 15000); }
        });
        opRow({
          id: "sh33", short: "גובה ההיכל", cardFly: true,
          cap: "גובה ההיכל",
          refs: [["מידות ד, ו", "Mishnah_Middot.4.6"], ["רמב״ם בית הבחירה ד, ג", "Mishneh_Torah,_The_Chosen_Temple.4.3"], ["בבא בתרא ג.", "Bava_Batra.3a"]],
          options: [["o0", "מאה אמה — המשנה", "לשון המשנה (מידות ד, ו): ״וההיכל מאה על מאה, על רום מאה. האטם שש אמות, וגבהו ארבעים אמה, אמה כיור, ואמתים בית דלפה, ואמה תקרה, ואמה מעזיבה, וגבה של עליה ארבעים אמה, ואמה כיור, ואמתים בית דלפה, ואמה תקרה, ואמה מעזיבה, ושלש אמות מעקה, ואמה כלה עורב״. ברטנורא: אוטם — בניין אטום וסתום להיות יסוד לבית; כיור — הקורה התחתונה, טוחה בזהב ומצוירת; בית דלפה — הקורות העליונות שהנסרים מחוברים על ידן, עוביין שתי אמות; תקרה — הנסרים; מעזיבה — הטיט והאבנים והסיד. תוספות יום טוב: האוטם — גובה שתים עשרה המעלות שבין המזבח לאולם, שש אמות, והאולם וההיכל עליו בשווה (כרמב״ם: ״האולם וההיכל כולו בשוה״); ולר׳ שמעיה — המפתן גבוה מן הארץ שש אמות ומעלות באולם ובהיכל, ודחה. תפארת ישראל: האוטם — יסוד אבני גזית סביב, אטום בפנים עם הקרקע, נראה רק בתוך תאי הדיוטא התחתונה, ובמזרח מכוסה במעלות; הכיור — פטורי ציצים מוזהבים כשפה סביב; בית דלפה — קורות עבות על אורך הכתלים, מלבן המחזק את הבניין. המנחת חינוך (רנד, ו): שלמה עשה רומו שלושים, ואנשי בית שני ארבעים (בבא בתרא ג.). במודל: מאה אמה, האוטם בכלל, נמדדות מרצפת העזרה.", [["מידות ד, ו", "Mishnah_Middot.4.6"], ["רמב״ם בית הבחירה ד, ג", "Mishneh_Torah,_The_Chosen_Temple.4.3"], ["בבא בתרא ג.", "Bava_Batra.3a"]]], ["o1", "מאה ועשרים — אברבנאל", "האברבנאל (מלכים א ח, י): \"והבית אשר בנה מאה באמה ארכו ומאה באמה רחבו ומאה ועשרים אמה גבהו, והאבנים אשר בנה בהן המלך את הבית היו לבנות כשלג\" — תיאור בניין הורדוס על פי יוסף בן מתתיהו. במודל: במתג — רצועה של עשרים אמה נוספת מעל גג ההיכל (צורתה — בחירת מודל), והמידה הראשית נשארת כמשנה.", [["מידות ד, ו", "Mishnah_Middot.4.6"]]]],
          current: "o0",
          onPick: (k) => { if (ctx.shared.height120 && typeof ctx.shared.height120.set === "function") ctx.shared.height120.set(k === "o1"); },
          fly: (k) => { const c = {"o0": [[150, 110, 110], [-30, 60, 0]], "o1": [[150, 130, 110], [-30, 70, 0]]}[k]; if (c && c[0] && c[1]) fly(c[0], c[1]); }
        });
        opRow({
          id: "sh34", short: "בניין הורדוס", cardFly: true,
          cap: "בניין הורדוס",
          refs: [["רמב״ם בית הבחירה א, טו", "Mishneh_Torah,_The_Chosen_Temple.1.15"], ["בבא בתרא ד.", "Bava_Batra.4a"], ["סוכה נא:", "Sukkah.51b"], ["רמב״ם בית הבחירה א, י", "Mishneh_Torah,_The_Chosen_Temple.1.10"], ["הר המוריה א, י", "Har_HaMoriah_on_Beit_HaBechira.1.10"]],
          options: [["o0", "אבן אחידה", "כתלי ההיכל במודל — אבן בהירה אחידה, כמראה אבני הגזית של העזרה (מידות ג, ד: אבני המזבח שלמות; לאבני ההיכל ראה רמב״ם א, טו), ורצפת העזרה — ריצוף אבן. זו ברירת המחדל.", [["רמב״ם בית הבחירה א, טו", "Mishneh_Torah,_The_Chosen_Temple.1.15"]]], ["o1", "שיש בשלושה גוונים ברצפת העזרה — כגלי הים", "לשון הגמרא (בבא בתרא ד.; סוכה נא:): ״מי שלא ראה בנין הורדוס, לא ראה בנין נאה מימיו. במאי בנייה? אמר רבה: באבני שישא ומרמרא. איכא דאמרי: באבני כוחלא, שישא ומרמרא. אפיק שפה ועייל שפה, כי היכי דנקביל סידא. סבר למשעייה בדהבא, אמרו ליה רבנן: שבקיה, דהכי שפיר טפי, דמיחזי כי אידוותא דימא״.\nרש״י (בבא בתרא ד.): ״שישא — שיש ירוק שקורין ביי״ש״; ״ומרמרא — שיש לבן״; ״כוחלא — שיש צבוע כעין כחול״; ״אידוותא דימא — גלי הים״; ובסוכה (נא:): ״כגלי הים שהאבנים משונים במראיהן זו מזו והעינים המסתכלות בהן שוטטות ונראות כאילו גלי הים הם נדים ונעים״.\n**הרמב״ם** (בית הבחירה א, י): ״ומרצפין את כל העזרה באבנים יקרות״. **הר המוריה** שם: ״באבנים יקרות. כוונתו באבני שיש״.\nבמודל: רצפת העזרה — עזרת ישראל ועזרת הכהנים — מרוצפת שיש בשלושת הגוונים, לבן, ירוק וכחול, ושורותיו גליות כמראה גלי הים; כתלי ההיכל נשארים אבן בהירה. שהשיש הצבעוני היה ברצפה ולא בכתלים — כך נמסר בשם הספר ״חנוכת הבית״ (אות כ); הספר לא היה לפנינו, והדבר לא אומת. מידות האבנים (שתי אמות) וצורת הגלים — בחירת מודל.", [["בבא בתרא ד.", "Bava_Batra.4a"], ["סוכה נא:", "Sukkah.51b"], ["רמב״ם בית הבחירה א, י", "Mishneh_Torah,_The_Chosen_Temple.1.10"], ["הר המוריה א, י", "Har_HaMoriah_on_Beit_HaBechira.1.10"]]]],
          current: "o0",
          onPick: (k) => { if (ctx.shared.herod && typeof ctx.shared.herod.set === "function") ctx.shared.herod.set(k === "o1"); },
          fly: (k) => { const c = {"o0": [[150, 92, 78], [34, 16, 0]], "o1": [[150, 92, 78], [34, 16, 0]]}[k]; if (c && c[0] && c[1]) fly(c[0], c[1]); }
        });
        opRow({
          id: "sh35", short: "צורת הבניין — ״צר מאחוריו ורחב מלפניו״", cardFly: true,
          cap: "צורת הבניין — ״צר מאחוריו ורחב מלפניו״",
          refs: [["פירוש המשניות לרמב״ם מדות ד, ז", "Rambam_Commentary_on_Middot.4.7"], ["רמב״ם בית הבחירה ד, ה", "Mishneh_Torah,_The_Chosen_Temple.4.5"], ["רמב״ם בית הבחירה ד, ט", "Mishneh_Torah,_The_Chosen_Temple.4.9"], ["רמב״ם בית הבחירה ד, ד", "Mishneh_Torah,_The_Chosen_Temple.4.4"], ["מידות ד, ז", "Mishnah_Middot.4.7"]],
          options: [["o0", "הרמב״ם — מאה על מאה, ומעט צר במערב (כציורו)", "פירוש המשניות לרמב״ם (מדות ד, ז): ״והיה כולו ר״ל כל ההיכל מאה על מאה היו מטין הבנין מעט לצד מערב וכשימשך לצד המזרח מתרחב כדמות האריה שהוא רחב מלפניו וצר מאחוריו כגון זה״ — ובכתב ידו צייר מרובע שצד המערב שלו צר.\nובמשנה תורה (בית הבחירה ד, ה): ״מן הצפון לדרום מאה אמה. עבי כתל האולם חמש אמות. ומכתל אולם עד כתל הקדש עשר אמות״; (ד, ט): ״ויציעים היו מקיפין לבית כלו מסביב חוץ לכתל המסבה... וכן סביב לכתלי האולם מלמטה עד למעלה כך היו אמה אחת חלק ורבד שלש אמות... ורבד העליון היה רחבו ארבע אמות״.\nבמודל — כציורו: כותל האולם, חמש אמות, נמשך לאורך כל הבית בצפון ובדרום, עשר אמות מכותל המסבה, והיציעים עומדים ברווח שביניהם. הבניין מאה במזרח, ומעט צר במערב — תשעים וארבע (״מעט״; הציור שבכתב ידו צר יותר, כרישום). במערב אין כותל כזה, שהאורך מאה נגמר בכותל התא (בית הבחירה ד, ד). הרובדים — לפי הגובה: אמה חלקה ורובד של שלוש, עד הרובד העליון של ארבע; כל רובד בולט אמה. גובה הכתלים כגובה האולם, והרווח פתוח לשמים — בחירות מודל.", [["פירוש המשניות לרמב״ם מדות ד, ז", "Rambam_Commentary_on_Middot.4.7"], ["רמב״ם בית הבחירה ד, ה", "Mishneh_Torah,_The_Chosen_Temple.4.5"], ["רמב״ם בית הבחירה ד, ט", "Mishneh_Torah,_The_Chosen_Temple.4.9"], ["רמב״ם בית הבחירה ד, ד", "Mishneh_Torah,_The_Chosen_Temple.4.4"], ["מידות ד, ז", "Mishnah_Middot.4.7"]]], ["o1", "המשנה — הבית שבעים, והאולם מאה", "לשון המשנה (מידות ד, ז): ״מן הצפון לדרום שבעים אמה... האולם עודף עליו חמש עשרה אמה מן הצפון, וחמש עשרה אמה מן הדרום, והוא היה נקרא בית החליפות, ששם גונזים את הסכינים. וההיכל צר מאחריו, ורחב מלפניו, ודומה לארי״.\nבמודל (ברירת המחדל): הבית שבעים אמה, והאולם שלפניו מאה — העודף בולט חמש עשרה אמה לכל צד, ופשפשי בית החליפות שבקרנותיו נראים.", [["מידות ד, ז", "Mishnah_Middot.4.7"]]]],
          current: "o1",
          onPick: (k) => { if (ctx.shared.houseShape && typeof ctx.shared.houseShape.set === "function") ctx.shared.houseShape.set(k === "o1" ? "mishnah" : "rambam"); },
          fly: (k) => { const c = {"o0": [[70, 165, -175], [-35, 60, 0]], "o1": [[70, 165, -175], [-35, 60, 0]]}[k]; if (c && c[0] && c[1]) fly(c[0], c[1]); }
        });
        opRow({
          id: "sh36", short: "המעקה וכליא עורב", cardFly: true,
          cap: "המעקה וכליא עורב",
          refs: [["מידות ד, ו", "Mishnah_Middot.4.6"], ["ערכין ו.", "Arakhin.6a"], ["רמב״ם בית הבחירה ד, ג", "Mishneh_Torah,_The_Chosen_Temple.4.3"]],
          options: [["o0", "תנא קמא", "לשון המשנה (מידות ד, ו): ״ושלש אמות מעקה, ואמה כלה עורב״. ברטנורא: ״כלה עורב״ — טס של ברזל חד כמין סייף וגובהו אמה, מונח על גבי המעקה כדי שלא ינוחו העופות עליו, ״שמכלה העורבים משם״. תפארת ישראל: המעקה — כמין דופן בשפת הגג סביב, גבוה שלוש אמות; וכליא עורב — כל שטח הגג וראש המעקה מחופה בטבלאות של ברזל שקבועים בהן מסמרות חדים כלפי השמים, גבוהים אמה (רש״י ערכין ו.: ״אמה כליא עורב״ — טבלאות אמה על אמה); ובבועז — דן בדעות: טס חד על המעקה (הרמב״ם והר״ב), גג משופע כמגדל ואמה על אמה בראשו (רש״י מועד קטן ט.), מסמרות בכל הגג (רש״י מנחות קז.), וצורות להבריח את העורבים (הערוך); ואין בכך משום ״לא תניף עליהן ברזל״, שהתקרה והמעזיבה מפסיקות. במקדש ראשון לא הוצרכו לכך, שלא היו עופות פורחים עליו מפני השכינה (מועד קטן ט.). במודל: קוצי זהב על המעקה — צורתם בחירת מודל.", [["מידות ד, ו", "Mishnah_Middot.4.6"], ["ערכין ו.", "Arakhin.6a"], ["רמב״ם בית הבחירה ד, ג", "Mishneh_Torah,_The_Chosen_Temple.4.3"]]], ["o1", "רבי יהודה", "לשון המשנה (מידות ד, ו): ״רבי יהודה אומר, לא היה כלה עורב עולה מן המדה, אלא ארבע אמות היה מעקה״ — כליא עורב היה, אך אינו נמנה במאה האמות; המעקה ארבע. תפארת ישראל (ד, ו): המעקה כמין דופן בשפת הגג סביב, וכליא עורב — מסמרות של ברזל בטבלאות על שטח הגג וראש המעקה. במודל: מעקה של ארבע אמות בלי הקוצים (הקוצים — בחירת מודל לתנא קמא בלבד).", [["מידות ד, ו", "Mishnah_Middot.4.6"]]]],
          current: "o0",
          onPick: (k) => { if (ctx.shared.parapet && typeof ctx.shared.parapet.set === "function") ctx.shared.parapet.set(k === "o1" ? "yehuda" : "tk"); },
          fly: (k) => { const c = {"o0": [[60, 130, 70], [-30, 114, 0]], "o1": [[60, 130, 70], [-30, 114, 0]]}[k]; if (c && c[0] && c[1]) fly(c[0], c[1]); }
        });
        opRow({
          id: "sh37", short: "העלייה — מבט", cardFly: true, cardOnly: true,
          cap: "העלייה — מבט",
          refs: [["מידות ד, ה", "Mishnah_Middot.4.5"]],
          options: [["o0", "מן הצד — הבית סגור", "מן הצד, והבית סגור: העלייה — מעל ההיכל וקודש הקדשים, ארבעים אמה — הלולין שבריצפתה ופתחה שבדרום מסומנים בצבע צף, הנראה דרך הכתלים, ל־15 שניות. כלי צפייה בלבד.", [["מידות ד, ה", "Mishnah_Middot.4.5"]]], ["o1", "מלמעלה — חתך בגובה שמונים", "מלמעלה: המודל נחתך בגובה שמונים אמה ל־15 שניות, ורואים את רצפת העלייה, את שלושת הלולין ואת ראשי הפספסין שעל קו הפרוכת. כלי צפייה בלבד.", [["מידות ד, ה", "Mishnah_Middot.4.5"]]]],
          current: "o0",
          onPick: (k) => { const F = (ctx.shared.features || {}).aliyahGlow; if (k === "o1") { if (F) F.off(); if (ctx.shared.sectionFor) ctx.shared.sectionFor("y", 80, 15000); } else { const S = ctx.shared.section; if (S && S.on && typeof S.set === "function") { S.set(false); if (ctx.shared.sectionPaint) ctx.shared.sectionPaint(); } if (F) { F.on(); ctx.ui.autoOff.arm("__agl", () => { try { F.off(); } catch (_) {} }); } } },
          fly: (k) => { const c = {"o0": [[-38, 88, 165], [-42, 86, 0]], "o1": [[-50, 150, 48], [-52, 67, -2]]}[k]; if (c && c[0] && c[1]) fly(c[0], c[1]); }
        });
        opRow({
          id: "sh38", short: "צורת התאים", cardFly: true,
          cap: "צורת התאים",
          refs: [["רמב״ם בית הבחירה ד, י", "Mishneh_Torah,_The_Chosen_Temple.4.10"], ["השגות הראב״ד בית הבחירה ד, ט", "Raavad_on_Beit_HaBechira.4.9"], ["תוי״ט מידות ד, ג", "Tosafot_Yom_Tov_on_Mishnah_Middot.4.3"], ["מידות ד, ג", "Mishnah_Middot.4.3"], ["מידות ד, ד", "Mishnah_Middot.4.4"], ["מידות ד, ז", "Mishnah_Middot.4.7"], ["תוי״ט מידות ד, ד", "Tosafot_Yom_Tov_on_Mishnah_Middot.4.4"], ["הר״ש מידות ד, ד", "R_Shemaya_on_Middot.4.4"], ["הרא״ש מידות ד, ד", "Rosh_on_Mishnah_Middot.4.4"], ["תוספות יומא נב.", "Tosafot_on_Yoma.52a"], ["תוספות בבא בתרא סא.", "Tosafot_on_Bava_Batra.61a"], ["יד רמ״ה בבא בתרא סא.", "Kovetz_Shitot_Kamai_on_Middot.4.4"], ["תוספות רי״ד בבא בתרא סא.", "Kovetz_Shitot_Kamai_on_Middot.4.7"]],
          options: [["o0", "הרמב״ם", "**בשיטה זו:** הקומה התחתונה של התאים כנגד האוטם — בזה הרמב״ם והראב״ד שווים, כדברי התוספות יום טוב (מידות ד, ג). המספרים שבציור הם לשון הראב״ד בהשגתו (בית הבחירה ד, ט): כותל ההיכל **שבע** בתחתונה ושש מעליה; התאים חמש, שש ו**שש** — ״חלל התא שש משש אמות ומעלה״; כותל התא חמש. את ״והעליונה, שבע״ שבמשנה (ד, ד) לא פירש הראב״ד; התא העליון שש במודל — בחירת מודל. (המספרים המודגשים — מה שאינו כמספרי המשנה כפשוטם; במודל הם כתובים על לוחית אדומה.)\nלשון המשנה (מידות ד, ג): ״שבצפון ושבדרום, חמשה על גבי חמשה, וחמשה על גביהם. ושבמערב, שלשה על גבי שלשה, ושנים על גביהם״; (ד, ד): ״התחתונה, חמש, ורבד שש. והאמצעית, שש, ורבד שבע. והעליונה, שבע״; (ד, ז): ״כתל התא חמש, והתא שש, כתל ההיכל שש״.\nהרמב״ם (בית הבחירה ד, י): ״כל אלו המקומות הפנויים שבין הכתלים הם הנקראים תאים״.\nהשגות הראב״ד (בית הבחירה ד, ט): ״שבכותל של היכל היה מקצר אמה ונמצא חלל התא שש משש אמות ומעלה ואותן שש אמה שהתא בהן חללו חמש הם היו כנגד אוטם ההיכל שהיו שש אמות וזהו שחשבו רוחב ההיכל כותל התא חמש והתא שש וכותל ההיכל שש והוא למעלה מן האוטם״.\nתוספות יום טוב (מידות ד, ג): ״מ״מ בענין הזה, שדיוטא התחתונה שמן התאים היא כנגד האוטם, מוכח מתוך פי׳ הרמב״ם, שמפרש בכאן שהתא הזה הוא בדיוטא האמצעית, שגם הוא סובר כן״ — כלומר, בעניין זה הרמב״ם והראב״ד אינם חולקים.\nבמודל (ברירת המחדל): הקומה התחתונה של התאים כנגד האוטם — שש אמות, מרצפת העזרה עד רצפת ההיכל — והקומה השנייה בגובה ההיכל. בקומה התחתונה כותל ההיכל שבע והתא חמש, ומשם ולמעלה כותל ההיכל שש והתא שש, כלשון הראב״ד. התקרה העליונה — על מה היא נשענת, לא נתבאר.", [["רמב״ם בית הבחירה ד, י", "Mishneh_Torah,_The_Chosen_Temple.4.10"], ["השגות הראב״ד בית הבחירה ד, ט", "Raavad_on_Beit_HaBechira.4.9"], ["תוי״ט מידות ד, ג", "Tosafot_Yom_Tov_on_Mishnah_Middot.4.3"], ["מידות ד, ג", "Mishnah_Middot.4.3"], ["מידות ד, ד", "Mishnah_Middot.4.4"], ["מידות ד, ז", "Mishnah_Middot.4.7"]]], ["o1", "רש״י והר״ש", "**בשיטה זו:** המגרעות בכותל ההיכל: שש, **חמש**, **ארבע**. התאים חמש, שש, שבע; כותל התא **שש**: במשנה (ד, ז) כותל התא, התא וכותל ההיכל הם יחד שבע עשרה אמה; בשיטה זו התא התחתון חמש בלבד, והאמה החסרה ניתנה במודל לכותל התא — שש במקום חמש (בחירת מודל). (המספרים המודגשים — מה שאינו כמספרי המשנה כפשוטם; במודל הם כתובים על לוחית אדומה.)\nלשון המשנה (מידות ד, ד): ״התחתונה, חמש, ורבד שש. והאמצעית, שש, ורבד שבע. והעליונה, שבע״; ובמידות ד, ז: ״כתל התא חמש, והתא שש, כתל ההיכל שש״.\nתוספות יום טוב (מידות ד, ד): לרש״י המשנה ״אתאים גופייהו קאי ולהם היו מגרעות בכותל ההיכל שעוביו שש ממש לפירש״י. וכן פי׳ הרר״ש״. הר״ש (רבינו שמעיה, מידות ד, ד): ״שהקורות כונסות במגרעות החומה של היכל אמה אחת לכך נמצאת האמצעית שש רחבה״. וכן הרא״ש (שם): ״עובי הכותל של היכל היה שש אמות עד תקרת התא ואז היה מתקצר אמה אמה״.\nבמודל: כותל ההיכל שש בקומה התחתונה, חמש באמצעית וארבע בעליונה; התאים חמש, שש ושבע; ראשי הקורות מונחים על המגרעות. במשנה (ד, ז) כותל ההיכל, התא וכותל התא הם יחד שבע עשרה אמה. בשיטה זו התא התחתון חמש בלבד, והאמה השבע עשרה ניתנה במודל לכותל התא החיצון — שש אמות (בחירת מודל).", [["מידות ד, ד", "Mishnah_Middot.4.4"], ["תוי״ט מידות ד, ד", "Tosafot_Yom_Tov_on_Mishnah_Middot.4.4"], ["הר״ש מידות ד, ד", "R_Shemaya_on_Middot.4.4"], ["הרא״ש מידות ד, ד", "Rosh_on_Mishnah_Middot.4.4"], ["מידות ד, ז", "Mishnah_Middot.4.7"]]], ["o2", "ר״י, פירוש ראשון — כותל ההיכל שבע למטה", "**בשיטה זו:** המגרעות בכותל ההיכל, שעוביו בתחתונה שבע: **שבע**, שש, **חמש**. התאים חמש, שש, שבע; כותל התא חמש. (המספרים המודגשים — מה שאינו כמספרי המשנה כפשוטם; במודל הם כתובים על לוחית אדומה.)\nלשון המשנה (מידות ד, ד): ״התחתונה, חמש, ורבד שש. והאמצעית, שש, ורבד שבע. והעליונה, שבע״; ובמידות ד, ז: ״כתל התא חמש, והתא שש, כתל ההיכל שש״.\nתוספות (יומא נב.): ״אלא עשו את חומת ההיכל במערב למטה שבעה אמות והוצרכו לגרוע ממנה אמה כנגד תקרת התא האמצעי להניח ראשי הקורות על אותה כניסה ושוב הוצרכו לגרוע עוד אמה כנגד תקרת תא השלישי לפיכך התחתונה חמש באמה רחבה והתיכונה ו׳ באמה רחבה והג׳ ז׳ באמה רחבה״; והמשנה (ד, ז) ״כנגד התיכונה קא חשיב דהוי התם כותל ההיכל ו׳ והתא ו׳״. וכן בתוספות בבא בתרא (סא.), וכן היד רמ״ה (בבא בתרא סא., בקובץ שיטות קמאי): ״והוה ליה כותל ההיכל כנגדה שבע אמות״.\nבמודל: כותל ההיכל שבע, שש וחמש; התאים חמש, שש ושבע; כותל התא חמש; ראשי הקורות מונחים על המגרעות שבכותל ההיכל.", [["תוספות יומא נב.", "Tosafot_on_Yoma.52a"], ["תוספות בבא בתרא סא.", "Tosafot_on_Bava_Batra.61a"], ["יד רמ״ה בבא בתרא סא.", "Kovetz_Shitot_Kamai_on_Middot.4.4"], ["מידות ד, ד", "Mishnah_Middot.4.4"], ["מידות ד, ז", "Mishnah_Middot.4.7"]]], ["o3", "ר״י, פירוש שני — חצי אמה מכל כותל", "**בשיטה זו:** חצי אמה מכל כותל: כותל ההיכל **שש וחצי**, שש, **חמש וחצי**; כותל התא **חמש וחצי**, חמש, **ארבע וחצי**. התאים מרובעים — חמש על חמש, שש על שש, שבע על שבע. (המספרים המודגשים — מה שאינו כמספרי המשנה כפשוטם; במודל הם כתובים על לוחית אדומה.)\nלשון המשנה (מידות ד, ד): ״התחתונה, חמש, ורבד שש. והאמצעית, שש, ורבד שבע. והעליונה, שבע״; ובמידות ד, ז: ״כתל התא חמש, והתא שש, כתל ההיכל שש״.\nתוספות (יומא נב.): ״אי נמי נראה לר״י שהמגרעות היו בכל הכתלים בכותל ההיכל ובשלשת כותלי התא וכותל ההיכל היה למטה ו׳ אמות ומחצה וכותל התא ה׳ אמות ומחצה וכשהיה מגרע חצי אמה מכל כותל כדכתיב כי מגרעות נתן לבית סביב נמצא התא התחתונה חמש על חמש והתיכונה שש על שש והשלישית שבע על שבע״; ו״רובד״ — ״לפי שהמגרעת כעין שורה בולטת״.\nבמודל: כותל ההיכל שש וחצי, שש, חמש וחצי; כותל התא החיצון חמש וחצי, חמש, ארבע וחצי; גם המחיצות שבין תא לתא נגרעות חצי אמה מכל צד, והתאים מרובעים — חמש על חמש, שש על שש, שבע על שבע. מרכזי התאים כבשאר השיטות, ולכן המחיצות עבות (בחירת מודל).", [["תוספות יומא נב.", "Tosafot_on_Yoma.52a"], ["תוספות בבא בתרא סא.", "Tosafot_on_Bava_Batra.61a"], ["מידות ד, ד", "Mishnah_Middot.4.4"]]], ["o4", "ר״י, פירוש שלישי — התא התחתון שש", "**בשיטה זו:** התא התחתון **שש**, ומעליו **שבע** ו**שמונה**; כותל ההיכל שש, **חמש**, **ארבע**; כותל התא חמש. את שתי הקומות העליונות ר״י לא פירש; מה שמצויר בהן — בחירת מודל (לא מאומת). (המספרים המודגשים — מה שאינו כמספרי המשנה כפשוטם; במודל הם כתובים על לוחית אדומה.)\nלשון המשנה (מידות ד, ד): ״התחתונה, חמש, ורבד שש. והאמצעית, שש, ורבד שבע. והעליונה, שבע״; ובמידות ד, ז: ״כתל התא חמש, והתא שש, כתל ההיכל שש״.\nתוספות (יומא נב.): ״עוד פר״י דנראה לו דכותל ההיכל שש והתא שש דלמטה לגמרי קא חשיב ואע״ג דכתיב במשכנה דמלכים חמש באמה רחבה של מסכת מדות דבית שני היו חלוקין משל שלמה כמו שהיו חלוקין ממשכנה דיחזקאל דלעתיד״; ובתוספות בבא בתרא (סא.): ״ועוד יש לפרש דבבית שני היתה יציע התחתונה שש והיה חלוק מבית ראשון״.\nבמודל: בקומה התחתונה כותל ההיכל שש, התא שש וכותל התא חמש. בקומות שמעליה כותל ההיכל נגרע אמה בכל קומה, והתאים שבע ושמונה — בחירת מודל, לא מאומת: ר״י לא פירש אותן, ובמשנה (ד, ד): ״והעליונה, שבע״.", [["תוספות יומא נב.", "Tosafot_on_Yoma.52a"], ["תוספות בבא בתרא סא.", "Tosafot_on_Bava_Batra.61a"], ["מידות ד, ז", "Mishnah_Middot.4.7"]]], ["o5", "ר׳ יצחק בר מרדכי", "**בשיטה זו:** כותל ההיכל שש בכל הקומות; המגרעות בכותל התא, וה**שורה העליונה** של כל קומה רחבה באמה. התאים חמש, שש, שבע; כותל התא חמש. (המספרים המודגשים — מה שאינו כמספרי המשנה כפשוטם; במודל הם כתובים על לוחית אדומה.)\nלשון המשנה (מידות ד, ד): ״התחתונה, חמש, ורבד שש. והאמצעית, שש, ורבד שבע. והעליונה, שבע״; ובמידות ד, ז: ״כתל התא חמש, והתא שש, כתל ההיכל שש״.\nתוספות (יומא נב.): ״והר׳ יצחק בר מרדכי פי׳ דלא בהיכל היו המגרעות אלא בתא היו והא דתנן רובד שש היינו שורות אבנים עליונים של כותל היציע התחתונה שעליה מונחים ראשי הקורות וכשהיתה אותה שורה רחבה שש נמצאת שהיתה בולטת אמה שעובי כותל התא לא היה אלא ה׳ אמות״, ״לפי שהיו צריכין לכנוס אמה מקום הנחת הקורות לבלתי אחוז בקירות הבית״. ור״י דחה: ״וכשהיה רובד שלמעלה ז׳ נמצא שהיה בולט חוץ לחומה שתי אמות״.\nבמודל: כותל ההיכל שש בכל הקומות; כותל התא חמש, ובכל קומה הוא נכנס אמה פנימה ונוספת אמה מבחוץ; השורה העליונה של הקומה התחתונה רחבה שש, ושל האמצעית שבע, ובולטות החוצה. בשיטה זו הכותל העליון בולט אל תוך המסבה — לא נתבאר בדבריו.", [["תוספות יומא נב.", "Tosafot_on_Yoma.52a"], ["מידות ד, ד", "Mishnah_Middot.4.4"]]], ["o6", "ר׳ יצחק הבחור", "**בשיטה זו:** כותל ההיכל שש, התא **שש** וכותל התא חמש בכל הקומות, כמשנה (ד, ז); הקורות על המחיצות שבין תא לתא, ואורך התאים — חמש, שש, שבע. (המספרים המודגשים — מה שאינו כמספרי המשנה כפשוטם; במודל הם כתובים על לוחית אדומה.)\nלשון המשנה (מידות ד, ד): ״התחתונה, חמש, ורבד שש. והאמצעית, שש, ורבד שבע. והעליונה, שבע״; ובמידות ד, ז: ״כתל התא חמש, והתא שש, כתל ההיכל שש״.\nתוספות (יומא נב.): ״ואני שמעתי בשם רבינו יצחק הבחור שלא היה בכותל ההיכל לא מגרעות ולא כניסה ולא בליטה וראשי הקורות היו מונחין מכותל תא לכותל תא שכנגדו ובמקום הנחת הקורות היה כניסה בכותל התא חצי אמה מזה וחצי אמה מזה וכל התאים היו שוים ממזרח למערב שש אמות״... ״וכותל התא חמש אבל מצפון לדרום התחתונה ה׳ והתיכונה ו׳ והשלישית שבע״.\nבמודל: כותל ההיכל שש, התא שש וכותל התא חמש בכל הקומות, כמשנה (ד, ז); המחיצות שבין התאים נגרעות חצי אמה מכל צד בכל תקרה, והקורות מונחות מן המחיצה אל המחיצה; אורך התאים לאורך הכותל — חמש, שש ושבע. דבריו בתאי המערב; בתאי הצפון והדרום — באותה דרך (בחירת מודל).", [["תוספות יומא נב.", "Tosafot_on_Yoma.52a"], ["מידות ד, ז", "Mishnah_Middot.4.7"]]], ["o7", "תוספות רי״ד", "**בשיטה זו:** בתא התחתון **כותל של אמה** צמוד לכותל ההיכל, ועליו הקורות. כותל ההיכל שש, שש, **חמש**; התאים חמש, שש, שבע; כותל התא חמש. (המספרים המודגשים — מה שאינו כמספרי המשנה כפשוטם; במודל הם כתובים על לוחית אדומה.)\nלשון המשנה (מידות ד, ד): ״התחתונה, חמש, ורבד שש. והאמצעית, שש, ורבד שבע. והעליונה, שבע״; ובמידות ד, ז: ״כתל התא חמש, והתא שש, כתל ההיכל שש״.\nתוספות רי״ד (בבא בתרא סא., בקובץ שיטות קמאי): ״והנכון בעיני לפרש שעובי כותלו של היכל לכל צד היה שש אמות, ולמטה בשיעור גובה התא התחתונה היו בונים בצדו כותל עוביו אמה וסומכין אותו אצל עוביו של כותל ההיכל כדי להניח שם ראשי הקורות של תקרת התא התחתונה״; ״ומש״ה תני והתא שש, האויר שהי׳ ה׳ אמות ואותה האמה שהיתה בנויה בתוכה״; ״ומהתקרה האמצעית ועד תקרת העליונה הי׳ כותלו של היכל חמש״.\nבמודל: כותל ההיכל שש בשתי הקומות התחתונות וחמש בעליונה; בתא התחתון — כותל של אמה צמוד לכותל ההיכל, עד התקרה, ועליו ראשי הקורות; האויר חמש, והתאים שמעליו שש ושבע.", [["תוספות רי״ד בבא בתרא סא.", "Kovetz_Shitot_Kamai_on_Middot.4.7"], ["מידות ד, ד", "Mishnah_Middot.4.4"], ["מידות ד, ז", "Mishnah_Middot.4.7"]]]],
          current: "o0",
          onPick: (k) => { if (ctx.shared.cellsReading && typeof ctx.shared.cellsReading.set === "function") ctx.shared.cellsReading.set(["raavad", "rashi", "ri", "riB", "riC", "rybm", "habachur", "rid"][+k.slice(1)] || "rashi"); },
          fly: (k) => { const c = {"o0": [[30, 40, -24], [-38, 40, -24]], "o1": [[30, 40, -24], [-38, 40, -24]], "o2": [[30, 40, -24], [-38, 40, -24]], "o3": [[30, 40, -24], [-38, 40, -24]], "o4": [[30, 40, -24], [-38, 40, -24]], "o5": [[30, 40, -24], [-38, 40, -24]], "o6": [[30, 40, -24], [-38, 40, -24]], "o7": [[30, 40, -24], [-38, 40, -24]]}[k]; if (c && c[0] && c[1]) fly(c[0], c[1]); if (ctx.shared.openFor) ctx.shared.openFor("ui-house", 15000); if (ctx.shared.sectionFor) ctx.shared.sectionFor("x", -38, 15000); }
        });
        opRow({
          id: "sh39", short: "המפתח שיורד לאמת השחי", cardFly: true,
          cap: "המפתח שיורד לאמת השחי",
          refs: [["תמיד ג, ו", "Mishnah_Tamid.3.6"], ["פירוש המשניות לרמב״ם תמיד ג, ו", "Rambam_Commentary_on_Tamid.3.6"], ["מלאכת שלמה תמיד ג, ו", "Melekhet_Shelomoh_on_Mishnah_Tamid.3.6"], ["רבינו גרשום תמיד ל:", "Rabbeinu_Gershom_on_Tamid.30b"], ["השגות הראב״ד בית הבחירה ד, יא", "Raavad_on_Beit_HaBechira.4.11"]],
          options: [["o0", "הרמב״ם — שני מנעולים מבחוץ", "לשון המשנה (תמיד ג, ו): ״ושני מפתחות, אחד יורד לאמת השחי ואחד פותח כיון״.\nפירוש המשניות לרמב״ם (תמיד ג, ו): ״לאמת שחי, שם מקום שתחת אצילי של יד נקרא שחי. והיו בפתח זה שהיה רוצה לפתוח שני מנעולים, אחד בתחתית הפתח, כדי שלא יהיה נוח לפתוח, עד שיושיט אדם ידו מן המקום שהוא עומד שם ומושך אמת זרועו עד סוף האציל, והוא מה שנאמר אחד יורד לאמת השחי; והאחד פותח אותו כנגד ידו והוא עומד, ואין צריך להרים ידיו למעלה ולא להושיטם למטה, והוא מה שנאמר ואחד פותח כיון, שר״ל כנגדו״.\nבמודל (ברירת המחדל): שני מנעולים על הדלת מבחוץ — אחד נמוך, שהיד מגיעה אליו כשהיא מושטת כולה למטה, ואחד כנגד היד, בגובה המרפק. בהדגמה נראה הכהן עצמו: הוא עומד לפני הדלת, מושיט את זרועו למטה אל המנעול הנמוך, פותח אחריו את זה שכנגד ידו, דוחף את הדלת ונכנס. מקום המנעולים וצורתם, ודמות הכהן — בחירת מודל.", [["תמיד ג, ו", "Mishnah_Tamid.3.6"], ["פירוש המשניות לרמב״ם תמיד ג, ו", "Rambam_Commentary_on_Tamid.3.6"]]], ["o1", "מלאכת שלמה ורבינו גרשום — מבפנים, בחור", "לשון המשנה (תמיד ג, ו): ״ושני מפתחות, אחד יורד לאמת השחי ואחד פותח כיון״.\nמלאכת שלמה (תמיד ג, ו): ״והפתח הפתוח לאולם היה אצל הפתח חור עקום בעובי הכותל, ומכניס ידו עם המפתח בחור עד בית השחי, ופותח את המנעול מבפנים, ונכנס לפשפש, ומהלך בעובי כותל ההיכל עד שמגיע לפתח הפתוח לתא, ופותחו כיון״.\nרבינו גרשום (תמיד ל:): ״אותו שבפנים היה צריך להושיט זרועו עד בית השחי עד המרפק קודם שהיה יכול לפותחו, ומנעול החצוני כיון שמשים המפתח פותח לאלתר״; וכלשון הזה מביא מלאכת שלמה בשם הראב״ד: ״שני מנעולים היו לאותו פשפש, אחד מבפנים ואחד מבחוץ״.\nבמודל: חור עקום בעובי הכותל, מדרום לפתח, והמנעול על הדלת מבפנים, סמוך לקצה שלה; בהדגמה נראה הכהן עצמו: הוא עומד ופניו אל הכותל, ומכניס את זרועו בחור עד בית השחי — הזרוע מתקפלת במרפק, כצורת החור — והכותל שסביב החור ״שקוף״, כדי שתיראה היד עם המפתח עד המנעול. אורך החור — כאורך זרועו של אדם. רבינו גרשום לא פירש איך הגיעה היד אל המנעול שבפנים — במודל כמלאכת שלמה; והמנעול החיצון שבדבריו אינו מצויר. מקום החור וצורתו — בחירת מודל.", [["תמיד ג, ו", "Mishnah_Tamid.3.6"], ["מלאכת שלמה תמיד ג, ו", "Melekhet_Shelomoh_on_Mishnah_Tamid.3.6"], ["רבינו גרשום תמיד ל:", "Rabbeinu_Gershom_on_Tamid.30b"]]], ["o2", "הראב״ד — הפשפש כעין חלון", "לשון המשנה (תמיד ג, ו): ״ושני מפתחות, אחד יורד לאמת השחי ואחד פותח כיון״.\nהשגות הראב״ד (בית הבחירה ד, יא): ״באותו התא שבקרן מזרחית צפונית היה הפשפש למזרחו, והיה פתח קטן כעין חלון שמכניס זרועו בה, והוא נקרא פשפש, ופותח פתח התא המזרחי שהיה המנעול מבפנים, ושני מנעולים היו לו, אחד יורד לאמת השחי ואחד פותח כיון״.\nבמודל: חלון קטן במסגרת אבן, ליד הפתח, והיד נכנסת בו אל המנעול שבפנים; הפתח עצמו — ״פתח התא״. בהדגמה נראה הכהן עצמו, מכניס את זרועו בחלון; הכותל שסביב החלון ״שקוף״. מקום החלון וגודלו — בחירת מודל; המנעול השני שבדבריו אינו מצויר.", [["תמיד ג, ו", "Mishnah_Tamid.3.6"], ["השגות הראב״ד בית הבחירה ד, יא", "Raavad_on_Beit_HaBechira.4.11"]]]],
          current: "o0",
          onPick: (k) => { const L = ctx.shared.pishLock; if (L && typeof L.set === "function") L.set(["rambam", "ms", "raavad"][+k.slice(1)] || "rambam"); if (typeof ctx.shared.pishpeshDemo === "function") ctx.shared.pishpeshDemo(); },
          fly: (k) => { const c = {"o0": [[13, 28, -9], [1.5, 24.8, -17.5]], "o1": [[13, 28, -9], [1.5, 24.8, -17.5]], "o2": [[13, 28, -9], [1.5, 24.8, -17.5]]}[k]; if (c && c[0] && c[1]) fly(c[0], c[1]); }
        });
        opRow({
          id: "sh40", short: "הדרך מן הפשפש לשער הגדול", cardFly: true,
          cap: "הדרך מן הפשפש לשער הגדול",
          refs: [["מידות ד, ב", "Mishnah_Middot.4.2"], ["ברטנורא ד, ב", "Bartenura_on_Mishnah_Middot.4.2"]],
          options: [["o0", "חכמים — דרך התא וההיכל", "לשון המשנה (מידות ד, ב): ״נטל את המפתח ופתח את הפשפש, ונכנס להתא, ומהתא להיכל״. ברטנורא: מן הפשפש לתא — לשכה אחת הפתוחה להיכל — ומן התא להיכל, והולך בחלל ההיכל עד השער הגדול שבסוף עובי הכותל מבפנים ופותחו, ובא אל השער השני שבסוף עובי הכותל מבחוץ ועומד בפנים ופותחו.\nבמודל: קו מקווקו בתכלת, הנראה גם דרך הכתלים — מן הפשפש הצפוני לתא שבקרן מזרחית־צפונית, משם להיכל, אל הדלתות הפנימיות של השער הגדול ומשם אל החיצונות. מקום הפתח מן התא להיכל — בחירת מודל. בהדגמה הולך לפני העין כהן, והמפתח בידו: הוא פותח את המנעולים, דוחף את דלת הפשפש, עובר בתא ובהיכל, ובשער הגדול מסובב את המפתח, מרים את הנגר בשתי ידיו ומושך את הדלתות — הפנימיות, ואחריהן החיצונות.", [["מידות ד, ב", "Mishnah_Middot.4.2"], ["ברטנורא ד, ב", "Bartenura_on_Mishnah_Middot.4.2"]]], ["o1", "רבי יהודה — בתוך עובי הכותל", "לשון המשנה (מידות ד, ב): ״רבי יהודה אומר, בתוך עביו של כתל היה מהלך, עד שנמצא עומד בין שני השערים, ופתח את החיצונות מבפנים ואת הפנימיות מבחוץ״. ברטנורא: לרבי יהודה — מן התא מהלך בתוך עובי הכותל עד שעומד בין שני השערים.\nבמודל: קו מקווקו בוורוד, הנראה גם דרך הכתלים — בתוך שש האמות של כותל החזית, מן הפשפש עד בין שתי הדלתות של השער הגדול. בהדגמה הולך לפני העין כהן, והמפתח בידו: הוא פותח את המנעולים, דוחף את דלת הפשפש, מהלך בתוך עובי הכותל ויוצא אל בין שני השערים; שם הוא מסובב את המפתח, מרים את הנגר בשתי ידיו ומושך את הדלתות — החיצונות, ואחריהן הפנימיות.", [["מידות ד, ב", "Mishnah_Middot.4.2"], ["ברטנורא ד, ב", "Bartenura_on_Mishnah_Middot.4.2"]]]],
          current: "o0",
          onPick: (k) => { if (ctx.shared.pishpeshWay && typeof ctx.shared.pishpeshWay.set === "function") ctx.shared.pishpeshWay.set(k === "o1" ? "yehuda" : "rabbanan"); if (typeof ctx.shared.pishpeshDemo === "function") ctx.shared.pishpeshDemo(k === "o1" ? "yehuda" : "rabbanan"); },
          fly: (k) => { const c = {"o0": [[-24, 37, 3], [-2, 24, -9]], "o1": [[-24, 37, 3], [-2, 24, -9]]}[k]; if (c && c[0] && c[1]) fly(c[0], c[1]); }
        });
        opRow({
          id: "sh41", short: "דלתות ההיכל — ארבע הדלתות", cardFly: true,
          cap: "דלתות ההיכל — ארבע הדלתות",
          refs: [["מידות ד, א", "Mishnah_Middot.4.1"], ["רמב״ם בית הבחירה ד, ז", "Mishneh_Torah,_The_Chosen_Temple.4.7"], ["פירוש המשניות לרמב״ם מדות ד, א", "Rambam_Commentary_on_Middot.4.1"], ["ברטנורא ד, א", "Bartenura_on_Mishnah_Middot.4.1"], ["מידות ד, ב", "Mishnah_Middot.4.2"]],
          options: [["o0", "תנא קמא — החיצונות לתוך הפתח, והפנימיות לתוך הבית", "לשון המשנה (מידות ד, א): ״פתחו של היכל, גבהו עשרים אמה ורחבו עשר אמות. וארבע דלתות היו לו, שתים בפנים ושתים בחוץ... החיצונות נפתחות לתוך הפתח לכסות עביו של כתל, והפנימיות נפתחות לתוך הבית לכסות אחר הדלתות, שכל הבית טוח בזהב, חוץ מאחר הדלתות״.\nוכך פסק הרמב״ם (בית הבחירה ד, ז): ״וארבע דלתות היו לו שתים בפנים ושתים בחוץ. החיצונות נפתחות לתוך הפתח לכסות עביו של כתל והפנימיות נפתחות לתוך הבית לכסות אחורי הדלתות״.\nפירוש המשניות לרמב״ם (מדות ד, א): ״כשיפתחו ב׳ הדלתות לפנים יתכסה עובי הכותל וישאר ממנו אמה וכן השני דלתות הפנימים חוזרות אל פני הבית ונקפלות אל הכותל כלפנים ומתכסה מה שאחורי הדלתות״.\nבמודל: הדלתות החיצונות קבועות אמה לפנים מן הפנים החיצוניים של הכותל, ונפתחות לתוך הפתח — חמש אמות מכסות חמש מששת אמות עוביו. הפנימיות קבועות בפני הכותל שבפנים, ונפתחות לתוך הבית עד שהן שוכבות על הכותל. בהדגמה: מפתח של זהב, הנגר, ואחר כך נפתחות הפנימיות, ואחריהן החיצונות.", [["מידות ד, א", "Mishnah_Middot.4.1"], ["רמב״ם בית הבחירה ד, ז", "Mishneh_Torah,_The_Chosen_Temple.4.7"], ["פירוש המשניות לרמב״ם מדות ד, א", "Rambam_Commentary_on_Middot.4.1"]]], ["o1", "רבי יהודה — בתוך הפתח, ונקפלות", "רבי יהודה (מידות ד, א): ״בתוך הפתח היו עומדות, וכמין אצטרמיטה היו, ונקפלות לאחוריהן, אלו שתי אמות ומחצה, ואלו שתי אמות ומחצה, חצי אמה מזוזה מכאן, וחצי אמה מזוזה מכאן״.\nברטנורא: ״אצטרמיטה. לוחות של פרקים מחברות על ידי חליות, והן נפתחות, וכשרוצה נכפפות ונכפלות זו על זו״; ״וכל דלת היה חמש אמות מחבר משתי לוחות, כל לוח שתי אמות ומחצה, וכשנפתח הדלת החיצון לצד פנים היה חציו נכפף ונכפל זה על זה, ומכסה מעבי הכתל אמתים וחצי, וכן הדלת הקבוע בפנים כשנפתח לצד חוץ היה אף הוא נכפף ונכפל ומכסה האמתים וחצי שנשארו מעבי הכתל״ (ברטנורא מידות ד, א).\nפירוש המשניות לרמב״ם (מדות ד, א): ״ואמר רבי יהודה שכל דלת מהם היה מפורקת והיא נקפלת לשנים״.\nבמודל: כל דלת שני לוחות של שתי אמות ומחצה, קבועות חצי אמה בתוך הכותל מכל צד. החיצונות נפתחות לפנים ונקפלות, והפנימיות נפתחות לחוץ ונקפלות. בהדגמה הכהן עומד בין שני השערים (מידות ד, ב): ״ופתח את החיצונות מבפנים ואת הפנימיות מבחוץ״ — קודם החיצונות, ואחר כך הפנימיות.", [["מידות ד, א", "Mishnah_Middot.4.1"], ["ברטנורא ד, א", "Bartenura_on_Mishnah_Middot.4.1"], ["פירוש המשניות לרמב״ם מדות ד, א", "Rambam_Commentary_on_Middot.4.1"], ["מידות ד, ב", "Mishnah_Middot.4.2"]]]],
          current: "o0",
          onPick: (k) => { const G = ctx.shared.greatGate; if (G && typeof G.set === "function") { G.set(k === "o1" ? "yehuda" : "tk"); if (typeof G.demo === "function") G.demo(); } },
          fly: (k) => { const c = {"o0": [[-21, 33, 6], [-2, 31, 0]], "o1": [[-21, 33, 6], [-2, 31, 0]]}[k]; if (c && c[0] && c[1]) fly(c[0], c[1]); }
        });
        opRow({
          id: "sh42", short: "חומר המנורה והשולחן", cardFly: true,
          cap: "חומר המנורה והשולחן",
          refs: [["מנחות כח:", "Menachot.28b"], ["רמב״ם בית הבחירה א, יט", "Mishneh_Torah,_The_Chosen_Temple.1.19"], ["רמב״ם בית הבחירה א, יח", "Mishneh_Torah,_The_Chosen_Temple.1.18"]],
          options: [["o0", "זהב", "המנורה והשולחן של זהב טהור כמצוות התורה (שמות כה, כד; כה, לא). בבית שני: \"חזרו והעשירו – עשאום של זהב\" (מנחות כח:). הרמב״ם (בית הבחירה א, יט): \"היו הקהל עניים עושין אותן אפילו של בדיל, ואם העשירו עושין אותן של זהב\" — לכל הכלים.", [["מנחות כח:", "Menachot.28b"], ["רמב״ם בית הבחירה א, יט", "Mishneh_Torah,_The_Chosen_Temple.1.19"], ["רמב״ם בית הבחירה א, יח", "Mishneh_Torah,_The_Chosen_Temple.1.18"]]], ["o1", "כסף", "\"העשירו – עשאום של כסף\" (מנחות כח:; וכן ראש השנה כד:, עבודה זרה מג.): בימי בית חשמונאי, משהעשירו מעט, עשו את המנורה של כסף. במודל: המנורה והשולחן של כסף.", [["מנחות כח:", "Menachot.28b"], ["רמב״ם בית הבחירה א, יט", "Mishneh_Torah,_The_Chosen_Temple.1.19"]]], ["o2", "ברזל מחופה בבעץ", "\"רבי יוסי בר רבי יהודה אומר: אף של עץ לא יעשה, כדרך שעשו מלכי בית חשמונאי. אמרו לו: משם ראיה? שפודים של ברזל היו, וחיפום בבעץ\" (מנחות כח:). רש״י שם: \"בבעץ — בדיל\". כשטיהרו החשמונאים את המקדש עשו מנורה של שפודי ברזל מחופים בבעץ. במודל: המנורה והשולחן בצבע הבדיל — אפור־כסוף בהיר ועמום.", [["מנחות כח:", "Menachot.28b"], ["רמב״ם בית הבחירה א, יט", "Mishneh_Torah,_The_Chosen_Temple.1.19"]]]],
          current: "o0",
          tourThen: {"o1": [{"cam": [-32.8, 27.3, 7.7], "tg": [-37, 25.8, 6.5]}, {"cam": [-30.8, 28.5, -4.4], "tg": [-37, 26.2, -7]}], "o2": [{"cam": [-32.8, 27.3, 7.7], "tg": [-37, 25.8, 6.5]}, {"cam": [-30.8, 28.5, -4.4], "tg": [-37, 26.2, -7]}]},
          onPick: (k) => { if (ctx.shared.vesselMetal && typeof ctx.shared.vesselMetal.set === "function") ctx.shared.vesselMetal.set(["gold", "silver", "iron"][+k.slice(1)] || "gold"); },
          fly: (k) => { const c = {"o0": [[-21, LV.HEI + houseRise(-37) + 4.8, 0], [-37, LV.HEI + houseRise(-37) + 2.2, 0]], "o1": [[-21, LV.HEI + houseRise(-37) + 4.8, 0], [-37, LV.HEI + houseRise(-37) + 2.2, 0]], "o2": [[-21, LV.HEI + houseRise(-37) + 4.8, 0], [-37, LV.HEI + houseRise(-37) + 2.2, 0]]}[k]; if (c && c[0] && c[1]) fly(c[0], c[1]); }
        });
        opRow({
          id: "sh43", short: "המנורה והנרות בבוקר", cardFly: true,
          cap: "המנורה והנרות בבוקר",
          refs: [["רמב״ם בית הבחירה ג, יב", "Mishneh_Torah,_The_Chosen_Temple.3.12"], ["רמב״ם תמידין ומוספין ג, יב", "Mishneh_Torah,_Daily_Offerings_and_Additional_Offerings.3.12"], ["תפא״י תמיד ג, ט", "Yachin_on_Mishnah_Tamid.3.9"], ["ברטנורא תמיד ג, ט", "Bartenura_on_Mishnah_Tamid.3.9"], ["שבת כב:", "Shabbat.22b"]],
          options: [["o0", "הרמב״ם — בין הצפון ובין הדרום; האמצעי והנר שמצפון לו", "הרמב״ם (בית הבחירה ג, יב): ״וכן נרות המנורה כנגד רחב הבית בין הצפון ובין הדרום״.\nובהלכות תמידין ומוספין (ג, יב): ״ומדליק נר שכבה. והדלקת הנרות היא הטבתם. ונר שמצאו שלא כבה מתקנו״.\nתפארת ישראל (יכין תמיד ג, עז), על ״ומניח את אלו דולקים במקומן״: ״ולמ\"ד צפון ודרום מונחין, הניח נר האמצעי והנר שבצדו מצפון״.\nבמודל (ברירת המחדל): המנורה בדרום, נרותיה מן הצפון לדרום. בהדגמה: בבוקר שני נרות דולקים — האמצעי והנר שמצפון לו; את החמישה האחרים מטיב ומדליק, ואת השניים — אחר כך.", [["רמב״ם בית הבחירה ג, יב", "Mishneh_Torah,_The_Chosen_Temple.3.12"], ["רמב״ם תמידין ומוספין ג, יב", "Mishneh_Torah,_Daily_Offerings_and_Additional_Offerings.3.12"], ["תפא״י תמיד ג, ט", "Yachin_on_Mishnah_Tamid.3.9"]]], ["o1", "רש״י, הראב״ד והברטנורא — מזרח ומערב; כבויים עד הערב", "הברטנורא (תמיד ג, ט): ״ומצא שתי נרות מזרחיות דולקים. האי תנא סבר מנורה מזרח ומערב היא מנחת״; ועל ״מדשן את השאר״: ״זו הטבת חמש הנרות, שנותן פתילה חדשה ושמן חדש ומניחן כבויות עד הערב שבא ומדליק״.\nרש״י (שבת כב:): ״למ\"ד במנחות מזרח ומערב מונחין סדר הקנים קרי מערבי נר שני שבצד החיצון שהוא במזרח״.\nתפארת ישראל (יכין תמיד ג, עה): ״לראב\"ד [פ\"ג מבחירה] דקיי\"ל כמ\"ד בהמשך מזרח ומערב מונחים נרות המנורה״.\nבמודל: המנורה מסובבת ממזרח למערב, שתי אמות ומחצה מן הכותל הדרומי לשורת הנרות. בהדגמה: שני הנרות המזרחיים, הסמוכים לפתח, דולקים; החמישה מוטבים ונשארים כבויים עד הערב; ובהטבת השניים — המזרחי מוטב ונשאר כבוי, והמערבי (השני מן המזרח) נשאר דולק.", [["ברטנורא תמיד ג, ט", "Bartenura_on_Mishnah_Tamid.3.9"], ["תפא״י תמיד ג, ט", "Yachin_on_Mishnah_Tamid.3.9"], ["שבת כב:", "Shabbat.22b"]]]],
          current: "o0",
          onPick: (k) => { const T = ctx.shared.tamid; if (T && typeof T.setLamps === 'function') T.setLamps(k === 'o1' ? 'rashi' : 'rambam'); },
          fly: (k) => { const c = {"o0": [[-21, LV.HEI + houseRise(-37) + 4.8, 3], [-37, LV.HEI + houseRise(-37) + 2.2, 6]], "o1": [[-21, LV.HEI + houseRise(-37) + 4.8, 3], [-37, LV.HEI + houseRise(-37) + 2.2, 6]]}[k]; if (c && c[0] && c[1]) fly(c[0], c[1]); }
        });
        opRow({
          id: "sh44", short: "כיוון המנורה והשולחן", cardFly: true,
          cap: "כיוון המנורה והשולחן",
          refs: [["מנחות צח:", "Menachot.98b"], ["רמב״ם בית הבחירה ג, יב", "Mishneh_Torah,_The_Chosen_Temple.3.12"], ["רמב״ם בית הבחירה ג, ח", "Mishneh_Torah,_The_Chosen_Temple.3.8"], ["רש״י שבת כב:", "Rashi_on_Shabbat.22.2"], ["כסף משנה בית הבחירה ג, יב", "Kesef_Mishneh_on_Beit_HaBechira.3.12"], ["רש״י מנחות צח:", "Rashi_on_Menachot.98.2"], ["השגות הראב״ד בית הבחירה ג, יב", "Raavad_on_Beit_HaBechira.3.12"], ["תוספות מנחות צח:", "Tosafot_on_Menachot.98.2"], ["תמיד ג, ט", "Mishnah_Tamid.3.9"], ["ברטנורא תמיד ג, ט", "Bartenura_on_Mishnah_Tamid.3.9"], ["תפא״י תמיד ג, ט", "Yachin_on_Mishnah_Tamid.3.9"], ["פירוש המשניות לרמב״ם תמיד ג, ט", {"book": 575, "index": 40}]],
          options: [["o0", "הרמב״ם — מנורה צפון ודרום", "בגמרא (מנחות צח:): ״תנו רבנן: מזרח ומערב היו מונחין, דברי רבי. רבי אלעזר ברבי שמעון אומר: צפון ודרום. מאי טעמא דרבי? גמר ממנורה – מה מנורה מזרח ומערב, אף הני נמי מזרח ומערב״. ורבי אלעזר ברבי שמעון משיב — ״מנורה גופה צפון ודרום הוה מנחה״; והכתוב ״יערך אתו״ — ״דמצדד להו אצדודי. דתניא: ׳אל מול פני המנורה יאירו שבעת הנרות׳ – מלמד שהיו מצדדין פניהם כלפי נר אמצעי״.\n**הרמב״ם** (בית הבחירה ג, יב): ״וכן נרות המנורה כנגד רחב הבית בין הצפון ובין הדרום״; (ג, ח): ״ששת הנרות הקבועים בששת הקנים היוצאים מן המנורה כלן פניהם לנר האמצעי שעל קני המנורה וזה הנר האמצעי פניו כנגד קדש הקדשים והוא הנקרא נר מערבי״.\n**רש״י** (שבת כב:): ״ולמ״ד צפון ודרום מונחים אמצעי קרי מערבי על שם שהיה פיו כנגד מערב וכל שאר הנרות כלפי האמצעית״.\n**כסף משנה** (בית הבחירה ג, יב): אף שהלכה כרבי מחברו — ״פסק רבינו כר' אלעזר בר' שמעון משום דקרא דאל מול פני המנורה יאירו שבעת הנרות מסייע ליה״.\nבמודל — ברירת המחדל, כפסק הרמב״ם: קני המנורה ונרותיה מצפון לדרום, לרוחב הבית; והשולחן — ״והיה מנח ארכו לארך הבית ורחבו לרחב הבית״ (שם ג, יב), כרבי.", [["מנחות צח:", "Menachot.98b"], ["רמב״ם בית הבחירה ג, יב", "Mishneh_Torah,_The_Chosen_Temple.3.12"], ["רמב״ם בית הבחירה ג, ח", "Mishneh_Torah,_The_Chosen_Temple.3.8"], ["רש״י שבת כב:", "Rashi_on_Shabbat.22.2"], ["כסף משנה בית הבחירה ג, יב", "Kesef_Mishneh_on_Beit_HaBechira.3.12"]]], ["o1", "רבי — מזרח ומערב", "**רבי** (מנחות צח:): ״מה מנורה מזרח ומערב״ — רש״י: ״השלשה קנים במזרח והשלשה במערב״. וראייתו: ״ומנורה גופה מנלן? מדכתיב בנר מערבי ׳יערך אתו [אהרן וגו׳] לפני ה׳׳ – מכלל דכולהו לאו ׳לפני ה׳׳, ואי סלקא דעתך צפון ודרום, כולהו נמי ׳לפני ה׳׳ נינהו״.\n**הראב״ד** (בית הבחירה ג, יב), על דברי הרמב״ם: ״זהו מחלוקת התנאים וסדר התמיד אינו כן שהרי שנינו מצא שתי נרות מזרחיות דולקים וזהו לענין מזרח ומערב מונחים״.\n**תוספות** (מנחות צח:): ״ומתניתין דתמיד (פ״ג מ״ט) דמצא שתי מזרחיות דולקות כרבי דאמר מזרח ומערב מונחין דלמאן דאמר צפון ודרום מונחין אין שייך מזרחיות״.\n**ברטנורא** (תמיד ג, ט): ״האי תנא סבר מנורה מזרח ומערב היא מנחת״.\n**כסף משנה** (בית הבחירה ג, יב), ביישוב דברי הרמב״ם: ״שהוא סובר שמשנה זו כרבי ולא קי״ל כוותיה וכ״כ רבינו בפירוש המשנה״.\nבקצרה — איזהו ״נר מערבי״ לשיטה זו: **רש״י** בשבת (כב:) — ״נר שני שבצד החיצון שהוא במזרח״; **רש״י** במנחות (צח:) — ״והחיצון של צד מערב קרי ליה נר מערבי״; **תוספות** (שם) — ״נר שני של שתי מזרחיות קרי נר מערבי״; **תפארת ישראל** (תמיד ג, ט) מעיר על הסתירה שבדברי רש״י.\n**פי הנרות בשיטה זו:** הרמב״ם, בפירוש המשנה (תמיד ג, ט), צייר את שבעת הנרות בין המערב ובין המזרח: ״ופיות כל הנרות לצד מערב זה לאחור זה״ — וכך במודל. ״מצדדין פניהם כלפי נר אמצעי״ הובא בגמרא ליישוב שיטת רבי אלעזר ברבי שמעון, שהמנורה צפון ודרום. צורת פי הנר — בחירת מודל.\nבמודל: המנורה מסובבת — קניה ונרותיה ממזרח למערב, לאורך הבית; והאבן שלפניה מצפונה, לצד פנים ההיכל. מקום האבן בשיטה זו — בחירת מודל. השולחן — ארכו לאורך הבית, כבברירת המחדל: הרמב״ם פוסק בו כרבי.", [["מנחות צח:", "Menachot.98b"], ["רש״י מנחות צח:", "Rashi_on_Menachot.98.2"], ["השגות הראב״ד בית הבחירה ג, יב", "Raavad_on_Beit_HaBechira.3.12"], ["תוספות מנחות צח:", "Tosafot_on_Menachot.98.2"], ["תמיד ג, ט", "Mishnah_Tamid.3.9"], ["ברטנורא תמיד ג, ט", "Bartenura_on_Mishnah_Tamid.3.9"], ["כסף משנה בית הבחירה ג, יב", "Kesef_Mishneh_on_Beit_HaBechira.3.12"], ["רש״י שבת כב:", "Rashi_on_Shabbat.22.2"], ["תפא״י תמיד ג, ט", "Yachin_on_Mishnah_Tamid.3.9"], ["פירוש המשניות לרמב״ם תמיד ג, ט", {"book": 575, "index": 40}]]], ["o2", "רבי אלעזר ברבי שמעון — צפון ודרום", "**רבי אלעזר ברבי שמעון** (מנחות צח:): ״צפון ודרום״. ״מאי טעמא? גמר מארון: מה ארון צפון ודרום, אף הני נמי צפון ודרום״ — רש״י: ״אורכו לרוחבו של בית״. ועל המנורה: ״מנורה גופה צפון ודרום הוה מנחה״.\nבמודל: גם השולחן מסובב — ארכו מצפון לדרום, לרוחב הבית; והמנורה צפון ודרום, כבברירת המחדל.\nבקצרה — **הרמב״ם** (בית הבחירה ג, יב) פוסק בשולחן כרבי — ״והיה מנח ארכו לארך הבית ורחבו לרחב הבית״ — ובנרות המנורה: ״בין הצפון ובין הדרום״.", [["מנחות צח:", "Menachot.98b"], ["רש״י מנחות צח:", "Rashi_on_Menachot.98.2"], ["רמב״ם בית הבחירה ג, יב", "Mishneh_Torah,_The_Chosen_Temple.3.12"]]]],
          current: "o0",
          onPick: (k) => { const L = ["rambam", "rabbi", "rashbash"][+k.slice(1)] || "rambam"; if (ctx.shared.menorahDir && typeof ctx.shared.menorahDir.set === "function") ctx.shared.menorahDir.set(L === "rabbi" ? "ew" : "ns"); if (ctx.shared.tableDir && typeof ctx.shared.tableDir.set === "function") ctx.shared.tableDir.set(L === "rashbash" ? "ns" : "ew"); },
          fly: (k) => { const c = {"o0": [[-7, LV.HEI + houseRise(-37) + 13, 0], [-37, LV.HEI + houseRise(-37) + 1.5, 0]], "o1": [[-7, LV.HEI + houseRise(-37) + 13, 0], [-37, LV.HEI + houseRise(-37) + 1.5, 0]], "o2": [[-7, LV.HEI + houseRise(-37) + 13, 0], [-37, LV.HEI + houseRise(-37) + 1.5, 0]]}[k]; if (c && c[0] && c[1]) fly(c[0], c[1]); }
        });
        opRow({
          id: "sh45", short: "שולחנות שלמה ומנורותיו — בבית שני", cardFly: true,
          cap: "שולחנות שלמה ומנורותיו — בבית שני",
          refs: [["תוספות רי״ד יומא נא:", {"book": 2109, "index": 157}], ["שקלים ו, ד", {"book": 54, "index": 41}], ["רש״י יומא נא:", {"book": 2157, "index": 1951}], ["המפרש תמיד לא:", {"book": 2105, "index": 319}], ["מנחות צח:", {"book": 131, "index": 3504}], ["מנחות צח: (תרי דרי)", {"book": 131, "index": 3522}], ["מנחות צט.", {"book": 131, "index": 3527}], ["מנחות צט. (לא היו מסדרין)", {"book": 131, "index": 3528}], ["רש״י מנחות צח:", {"book": 2186, "index": 4697}], ["רש״י מנחות צט.", {"book": 2186, "index": 4700}], ["רש״י מנחות צט. (שולחן של משה)", {"book": 2186, "index": 4702}], ["מאירי יומא נא:", {"book": 2199, "index": 464}], ["מלאכת שלמה שקלים ו, ד", {"book": 1152, "index": 217}], ["רש״ש יומא נא:", {"book": 2494, "index": 563}]],
          options: [["o0", "תוספות רי״ד — שולחן אחד ומנורה אחת", "**תוספות רי״ד** (יומא נא:): מביא את המשנה בשקלים — ״שלשה עשר שלחנות היו במקדש... ושנים באולם מבפנים על פתח הבית, אחד של שיש ואחד של זהב״ (שקלים ו, ד) — ומסיק: ״אלמא לא הי׳ בהיכל אלא שלחן אחד בלבד בבית שני״. ועוד ראיה מן הכתוב בסוף מלכים: בגלות יהויכין נלקחו כל כלי הזהב שעשה שלמה בהיכל.\nבמודל — ברירת המחדל: שולחן אחד בצפון ההיכל, ומנורה אחת בדרומו.", [["תוספות רי״ד יומא נא:", {"book": 2109, "index": 157}], ["שקלים ו, ד", {"book": 54, "index": 41}]]], ["o1", "רש״י והמפרש לתמיד — גם עשרת השולחנות ועשר המנורות של שלמה", "**רש״י** (יומא נא:), בסוגיה של בית שני, מפרש את דברי רבי מאיר בעשרת השולחנות של שלמה: ״עשר שולחנות עשה שלמה... אלא של משה באמצע חמש מימינו וחמש משמאלו״; ולמאן דאמר צפון ודרום — ״חמש בשורה אחת פונות ראשה של זו לראשה של זו... ועל כרחך צריך היה לסמוך ראש השולחן הצפוני לכותל״.\n**המפרש** (תמיד לא:): ״ועשר שולחנות היו עדיין בהיכל שעשה שלמה... ובאותן של שלמה לא היו מסדרים״.\n**מלאכת שלמה** (שקלים ו, ד), בשם הירושלמי: ״דאיכא נמי בהיכל עשר שלחנות שעשה שלמה... ובאותם של שלמה לא היו מסדרין״.\n**הרש״ש** (יומא נא:), על דברי רש״י שם: ״כשהיה מגיע לשולחנות היה נצרך להתעקם לצד דרום״.\nהגמרא (מנחות צט.): ״עשרה שלחנות עשה שלמה, ולא היו מסדרין אלא על של משה... עשר מנורות עשה שלמה, ולא היו מדליקין אלא בשל משה״.\n**הסידור** (מנחות צח:–צט.): ״של משה באמצע, חמשה מימינו, וחמשה משמאלו״, ״תרי דרי נינהו״ — שתי שורות של חמישה, ראשה של זו בצד ראשה של זו. וכיוונם — לפי המתג ״כיוון המנורה והשולחן״:\n• צפון ודרום (רבי אלעזר ברבי שמעון): רש״י (מנחות צט.) — ״שורה מערבית משוכה מכותל מערבי שתי אמות ומחצה, ואמה רוחב דשולחן, ושתי אמות ומחצה בינו ובין השלחן של משה״; כל שורה מן הכותל הצפוני עד אמצע הבית.\n• מזרח ומערב (הרמב״ם, רבי): הגמרא (מנחות צט.): ״לא, דמידלי ליה, ומנח ליה, ומיתתי להו לדידהו פורתא, כתלמיד היושב לפני רבו״; ורש״י שם: ״משוך לצד מערב וראשו מכוון כנגד אויר שבין שתי השורות״. במודל: שתי שורות של חמישה, ראש אל ראש לאורך הבית; השורה הצפונית ״מרוחקת מכותל צפוני שתי אמות ומחצה״ (רש״י שם), ובינה ובין הדרומית שתי אמות ומחצה; ושולחן משה ממערב להן, מול הרווח שבין השורות.\nהמנורות — כמו השולחנות, בדרום — המאירי (יומא נא:): ״וכשם שנחלקו בשלחנות לצד הצפון כך נחלקו במנורות לצד דרום שאף עשר מנורות עשה שלמה חמש מימין של משה וחמש משמאלו״. במודל: שתי שורות של חמש, סביב מנורת משה, שאינה זזה ממקומה; וכיוונן לפי המתג.\nבמודל: שולחנות שלמה בצורת שולחן משה, כמו בבית ראשון — עם הסניפים, הקנים ושני הבזיכים, ריקים — בלי לחם ובלי לבונה, ומנורותיו בלי נרות דולקים, כתנא קמא (מנחות צט.); ולרבי אלעזר בן שמוע, שעל כולם היו מסדרין ובכולן היו מדליקין — במתג ״סידור הלחם והדלקת הנרות בכלי שלמה״; חומרם — כחומר השולחן והמנורה, בתפריט, תחת ״שיטות ומחלוקות״. כשהשולחנות צפון ודרום, שולחן משה זז אמה אחת למערב, כדברי רש״י; והרצפה עולה למערב, ״כתלמיד היושב לפני רבו״ (מנחות צט.). הסידור — בחירת מודל לפי המקורות שלמעלה.", [["רש״י יומא נא:", {"book": 2157, "index": 1951}], ["תוספות רי״ד יומא נא:", {"book": 2109, "index": 157}], ["המפרש תמיד לא:", {"book": 2105, "index": 319}], ["שקלים ו, ד", {"book": 54, "index": 41}], ["מנחות צח:", {"book": 131, "index": 3504}], ["מנחות צח: (תרי דרי)", {"book": 131, "index": 3522}], ["מנחות צט.", {"book": 131, "index": 3527}], ["מנחות צט. (לא היו מסדרין)", {"book": 131, "index": 3528}], ["רש״י מנחות צח:", {"book": 2186, "index": 4697}], ["רש״י מנחות צט.", {"book": 2186, "index": 4700}], ["רש״י מנחות צט. (שולחן של משה)", {"book": 2186, "index": 4702}], ["מאירי יומא נא:", {"book": 2199, "index": 464}], ["מלאכת שלמה שקלים ו, ד", {"book": 1152, "index": 217}], ["רש״ש יומא נא:", {"book": 2494, "index": 563}], ["רש״ש שקלים ו, ד", {"book": 703, "index": 74}], ["ירושלמי שקלים ו, ג", {"book": 154, "index": 206}], ["סיריליו ירושלמי שקלים ו, ג", {"book": 1752, "index": 1169}]]]],
          current: "o0",
          onPick: (k) => { const S = ctx.shared.solomonVessels; if (S && typeof S.set === "function") S.set(k === "o1" ? "ten" : "one"); if (k !== "o1") { const r = OPS_BY_ID["sh57"]; if (r && r.cur === "o1") { r.mark("o0"); if (S && typeof S.setLit === "function") S.setLit(false); } } },
          fly: (k) => { const c = {"o0": [[-17, LV.HEI + houseRise(-37) + 14, 3], [-36, LV.HEI + houseRise(-37) + 0.5, -1]], "o1": [[-17, LV.HEI + houseRise(-37) + 14, 3], [-36, LV.HEI + houseRise(-37) + 0.5, -1]]}[k]; if (c && c[0] && c[1]) fly(c[0], c[1]); }
        });
        opRow({
          id: "sh57", short: "סידור הלחם והדלקת הנרות בכלי שלמה", cardFly: true,
          cap: "סידור הלחם והדלקת הנרות בכלי שלמה — רק בשל משה או בכולם",
          refs: [["מנחות צט.", {"book": 131, "index": 3528}], ["מנחות צט. (מנורות)", {"book": 131, "index": 3529}], ["מנחות צט. (רבי אלעזר בן שמוע)", {"book": 131, "index": 3530}], ["ירושלמי שקלים ו, ג", {"book": 154, "index": 206}], ["מנחות צט. (רבי יוסי ברבי יהודה)", {"book": 131, "index": 3531}], ["רש״י מנחות צט. (על כולן)", {"book": 2186, "index": 4706}], ["מלאכת שלמה שקלים ו, ד", {"book": 1152, "index": 217}], ["רש״ש שקלים ו, ד", {"book": 703, "index": 74}], ["סיריליו ירושלמי שקלים ו, ג", {"book": 1752, "index": 1169}]],
          options: [["o0", "תנא קמא ורבי יוסי ברבי יהודה — רק בשל משה", "הגמרא (מנחות צט.): ״תנו רבנן: עשרה שלחנות עשה שלמה, ולא היו מסדרין אלא על של משה, שנאמר: ׳ואת השלחן אשר עליו לחם הפנים זהב׳. עשר מנורות עשה שלמה, ולא היו מדליקין אלא בשל משה, שנאמר: ׳את מנורת הזהב ונרתיה לבער בערב׳״.\\nוכן **רבי יוסי ברבי יהודה** (שם): ״לא היו מסדרין אלא על של משה, אלא מה אני מקיים ׳ואת השלחנות אשר עליהם לחם הפנים זהב׳? אלו שלשה שלחנות שהיו במקדש: שנים שהיו באולם מבפנים לפתח הבית... אחד של זהב בפנים, שעליו לחם הפנים תמיד״.\\nובירושלמי (שקלים ו, ג), בסתם: ״אף על פי כן לא היה מסדר אלא שלמשה בלבד, שנאמר את השולחן אשר עליו לחם הפנים״.\\n**מלאכת שלמה** (שקלים ו, ד), בשם הירושלמי: המשנה בשקלים לא מנתה את עשרת השולחנות של שלמה, ״משום דלא חשיב אלא אותם שמשתמשין בהן, ובאותם של שלמה לא היו מסדרין״. וכן **ר׳ שלמה סיריליו** (ירושלמי שקלים ו, ג).\\n**הרש״ש** (שקלים ו, ד): ״מדלא חשיב י׳ שולחנות שעשה שלמה... משמע לכאורה דלא היו בבית שני, אבל ביומא (נ״א ב׳) מוכח דהיו, וצ״ע. אח״ז מצאתי בהמפרש לתמיד (ל״א ב׳) שכ׳ דהא דלא חשיב להו משום דלא היו משמשין כלום, כת״ק במנחות שם״.\\nבמודל (ברירת המחדל): לחם ולבונה — רק על שולחן משה; נרות דולקים — רק במנורת משה. שולחנות שלמה ומנורותיו — לפי המתג ״שולחנות שלמה ומנורותיו — בבית שני״: שלמים, עם הסניפים, הקנים והבזיכים, אבל ריקים.", [["מנחות צט.", {"book": 131, "index": 3528}], ["מנחות צט. (מנורות)", {"book": 131, "index": 3529}], ["מנחות צט. (רבי יוסי ברבי יהודה)", {"book": 131, "index": 3531}], ["ירושלמי שקלים ו, ג", {"book": 154, "index": 206}], ["מלאכת שלמה שקלים ו, ד", {"book": 1152, "index": 217}], ["רש״ש שקלים ו, ד", {"book": 703, "index": 74}], ["סיריליו ירושלמי שקלים ו, ג", {"book": 1752, "index": 1169}]]], ["o1", "רבי אלעזר בן שמוע — בכולם", "הגמרא (מנחות צט.): ״רבי אלעזר בן שמוע אומר: על כולם היו מסדרין, שנאמר: ׳את השלחנות ועליהם לחם הפנים׳, ובכולן היו מדליקין, שנאמר: ׳את המנרות ונרתיהם לבערם כמשפט לפני הדביר זהב סגור׳״.\\nובירושלמי (שקלים ו, ג) השמות הפוכים: ״רבי יוסי בירבי יהודה אומר: על כולם היה מסדר, שנאמר את השולחנות ועליהם לחם הפנים״; ובבבלי רבי יוסי ברבי יהודה אומר ״לא היו מסדרין אלא על של משה״.\\n**מלאכת שלמה** (שקלים ו, ד): ״אבל ר׳ יוסי ב״ר יהודה פליג התם דעל כולן היה מסדר... ואיתה נמי בגמ׳ דילן בפ׳ שתי הלחם, ופי׳ שם רש״י ז״ל דמ״ד על כולם היינו פעמים על זו ופעמים על זו״.\\n**רש״י** (מנחות צט.): ״על כולן היו מסדרין — פעמים בזה פעמים בזה״. כלומר, לפי רש״י לא היה לחם על כל השולחנות בבת אחת, אלא פעם על שולחן זה ופעם על שולחן אחר.\\nבמודל: לחם ולבונה על כל עשרת השולחנות, ונרות דולקים בכל עשר המנורות — כולם יחד. כשבוחרים בזה, שולחנות שלמה ומנורותיו מוצגים, אם לא היו מוצגים.", [["מנחות צט. (רבי אלעזר בן שמוע)", {"book": 131, "index": 3530}], ["ירושלמי שקלים ו, ג", {"book": 154, "index": 206}], ["רש״י מנחות צט. (על כולן)", {"book": 2186, "index": 4706}], ["מלאכת שלמה שקלים ו, ד", {"book": 1152, "index": 217}]]]],
          current: "o0",
          onPick: (k) => { const S = ctx.shared.solomonVessels; if (!S) return; if (k === "o1" && S.current !== "ten") { const r = OPS_BY_ID["sh45"]; if (r) { r.mark("o1"); try { r.onPick("o1"); } catch (_) {} } else if (typeof S.set === "function") S.set("ten"); } if (typeof S.setLit === "function") S.setLit(k === "o1"); },
          fly: (k) => { const c = {"o0": [[-17, LV.HEI + houseRise(-37) + 14, 3], [-36, LV.HEI + houseRise(-37) + 0.5, -1]], "o1": [[-17, LV.HEI + houseRise(-37) + 14, 3], [-36, LV.HEI + houseRise(-37) + 0.5, -1]]}[k]; if (c && c[0] && c[1]) fly(c[0], c[1]); }
        });
        opRow({
          id: "sh46", short: "צורת לחם הפנים — ספינה רוקדת או תיבה פרוצה", cardFly: true,
          cap: "צורת לחם הפנים — ספינה רוקדת או תיבה פרוצה",
          refs: [["מנחות צד:", {"book": 131, "index": 3364}], ["מנחות צד: (הסניפין)", {"book": 131, "index": 3369}], ["מנחות צה.", {"book": 131, "index": 3372}], ["מנחות צה. (תניא כמאן)", {"book": 131, "index": 3373}], ["רש״י מנחות צד: (תיבה)", {"book": 2186, "index": 4469}], ["רש״י מנחות צד: (ספינה)", {"book": 2186, "index": 4470}], ["רש״י מנחות צה.", {"book": 2186, "index": 4490}], ["כסף משנה תמידין ה, ט", {"book": 4261, "index": 187}], ["לחם משנה תמידין ה, ט", {"book": 4030, "index": 95}], ["רמב״ם תמידין ומוספין ה, ט", {"book": 344, "index": 78}], ["מנחות יא, ד", {"book": 81, "index": 83}]],
          options: [["o0", "רבי יוחנן — כמין ספינה רוקדת", "הגמרא (מנחות צד:): ״רבי חנינא אמר: כמין תיבה פרוצה. רבי יוחנן אמר: כמין ספינה רוקדת״.\n**רש״י:** ״אין לה שוליים אלא מלמעלה רחבה ומלמטה כלה והולכת עד כאצבע... וב׳ ראשיה חדין והולכין וגבוהין למעלה״. ופיה — ״אימא: ופיה דומה כמין טבלא מרובעת״ (מנחות צה.); רש״י: ״השוליים עשויין כספינה״.\n**הסניפין:** ״לדברי האומר כמין ספינה רוקדת — סניפין על גבי שלחן מונחין״ (מנחות צד:). ״תניא כמאן דאמר כמין ספינה רוקדת, דתניא: ארבעה סניפין של זהב היו שם... שסומכין בהן את הלחם, שהוא דומה כמין ספינה רוקדת״ (מנחות צה.).\nבמודל (ברירת המחדל): כל חלה — פיה מרובע, דפנותיה משתפעות עד שוליים צרים כאצבע, ושני ראשיה משופעים ועולים; הסניפין עומדים על השולחן, והקנים תחת השוליים. מידות השיפוע והעלייה — בחירת מודל. ברירת המחדל כרבי יוחנן, שהברייתא כמותו; הרמב״ם כתב ״כל חלה מהן מרבעת״ — ראו באפשרות השנייה.", [["מנחות צד:", {"book": 131, "index": 3364}], ["מנחות צד: (הסניפין)", {"book": 131, "index": 3369}], ["מנחות צה.", {"book": 131, "index": 3372}], ["מנחות צה. (תניא כמאן)", {"book": 131, "index": 3373}], ["רש״י מנחות צד: (תיבה)", {"book": 2186, "index": 4469}], ["רש״י מנחות צד: (ספינה)", {"book": 2186, "index": 4470}], ["רש״י מנחות צה.", {"book": 2186, "index": 4490}], ["כסף משנה תמידין ה, ט", {"book": 4261, "index": 187}], ["לחם משנה תמידין ה, ט", {"book": 4030, "index": 95}], ["רמב״ם תמידין ומוספין ה, ט", {"book": 344, "index": 78}]]], ["o1", "רבי חנינא — כמין תיבה פרוצה", "הגמרא (מנחות צד:): ״רבי חנינא אמר: כמין תיבה פרוצה״. **רש״י:** ״שניטל כיסויה ושתי דופנותיה זו כנגד זו כך הלחם היו לו ב׳ דפנות ושוליים רחבים״.\n**הסניפין:** ״לדברי האומר כמין תיבה פרוצה — סניפין על גבי קרקע מונחין״ (מנחות צד:).\n**הרמב״ם** (תמידין ומוספין ה, ט) כתב ״כל חלה מהן מרבעת״ — **כסף משנה:** ״משמע שפסק כר׳ חנינא וצריך טעם למה דהא בגמרא קאמר דתניא כוותיה דר״י״, ויישב: ״ואפשר שטעמו משום דר׳ חנינא עדיף מר״י וקשיש מיניה״; **לחם משנה:** ״נראה דפסק כמ״ד כמין תיבה פרוצה... וצ״ע״.\nבמודל: כל חלה — שוליים רחבים ושתי דפנות זקופות, וקרנותיה — ״וקרנותיו שבע אצבעות״ (מנחות יא, ד) — כפופות פנימה; הסניפין עומדים על הרצפה. צורת הקרנות ומידות הדפנות — בחירת מודל.", [["מנחות צד:", {"book": 131, "index": 3364}], ["מנחות צד: (הסניפין)", {"book": 131, "index": 3369}], ["מנחות צה.", {"book": 131, "index": 3372}], ["מנחות צה. (תניא כמאן)", {"book": 131, "index": 3373}], ["רש״י מנחות צד: (תיבה)", {"book": 2186, "index": 4469}], ["רש״י מנחות צד: (ספינה)", {"book": 2186, "index": 4470}], ["רש״י מנחות צה.", {"book": 2186, "index": 4490}], ["כסף משנה תמידין ה, ט", {"book": 4261, "index": 187}], ["לחם משנה תמידין ה, ט", {"book": 4030, "index": 95}], ["רמב״ם תמידין ומוספין ה, ט", {"book": 344, "index": 78}], ["מנחות יא, ד", {"book": 81, "index": 83}]]]],
          current: "o0",
          onPick: (k) => { const B = ctx.shared.breadShape; if (B && typeof B.set === "function") B.set(k === "o1" ? "box" : "boat"); },
          fly: (k) => { const c = {"o0": [[-33.6, 27.4, -4.2], [-37, 26.4, -7]], "o1": [[-33.6, 27.4, -4.2], [-37, 26.4, -7]]}[k]; if (c && c[0] && c[1]) fly(c[0], c[1]); }
        });
        opRow({
          id: "sh47", short: "הפרוכות ודרך הכהן הגדול", cardFly: true,
          cap: "הפרוכות ודרך הכהן הגדול — רבי יהודה, רבי יוסי, רבי מאיר, או הרשב״א בדעת הרמב״ם",
          refs: [["יומא ה, א", {"book": 55, "index": 38}], ["יומא נא:", {"book": 107, "index": 1317}], ["רמב״ם בית הבחירה ד, ב", {"book": 337, "index": 63}], ["יכין יומא ה", {"book": 762, "index": 444}], ["לחם שמים מידות ד, ה", {"book": 1145, "index": 95}], ["תוי״ט יומא ה, ה", {"book": 898, "index": 179}], ["יומא נא: (רב חסדא)", {"book": 107, "index": 1318}], ["יומא נא: (רבי מאיר)", {"book": 107, "index": 1319}], ["מאירי יומא נא:", {"book": 2199, "index": 464}], ["תוי״ט יומא ה, ה (הרשב״א)", {"book": 898, "index": 180}], ["יומא ה, ה", {"book": 55, "index": 42}], ["רמב״ם עבודת יום הכפורים ד, ב", {"book": 342, "index": 33}], ["מאירי יומא נד.", {"book": 2199, "index": 489}]],
          options: [["o0", "תנא קמא — שתי פרוכות, ואמה ביניהן", "המשנה (יומא ה, א): ״היה מהלך בהיכל, עד שמגיע לבין שתי הפרכות המבדילות בין הקדש ובין קדש הקדשים, וביניהן אמה... החיצונה היתה פרופה מן הדרום, והפנימית מן הצפון. מהלך ביניהן, עד שמגיע לצפון״.\nהגמרא (יומא נא:): ״ורבנן אמרי לך: הני מילי במשכן, אבל במקדש שני כיון דלא הואי אמה טרקסין, ובמקדש ראשון הוא דהואי, ואיסתפקא להו לרבנן בקדושתיה, אי כלפנים אי כלחוץ, ועבוד שתי פרוכת״.\n**הרמב״ם** (בית הבחירה ד, ב): ״ולא בנו כתל בבית שני אלא עשו שתי פרוכות אחת מצד קדש הקדשים ואחת מצד הקדש וביניהן אמה כנגד עבי הכתל שהיה בראשון״.\nבמודל (ברירת המחדל): שתי פרוכות ואמה ביניהן; החיצונה פתוחה בדרום, והפנימית בצפון. המבט — מתוך האמה שביניהן, מן הדרום אל הצפון.\nבהדגמת הכהן הגדול — דרכו כרבי יהודה: ״בין המזבח למנורה היה מהלך... ורבי יהודה אמר לך: פיתחא בדרום קאי״ (יומא נא:).", [["יומא ה, א", {"book": 55, "index": 38}], ["יומא נא:", {"book": 107, "index": 1317}], ["רמב״ם בית הבחירה ד, ב", {"book": 337, "index": 63}], ["יכין יומא ה", {"book": 762, "index": 444}], ["לחם שמים מידות ד, ה", {"book": 1145, "index": 95}], ["תוי״ט יומא ה, ה", {"book": 898, "index": 179}]]], ["o1", "רבי יוסי — פרוכת אחת בלבד", "המשנה (יומא ה, א): ״רבי יוסי אומר, לא היתה שם אלא פרכת אחת בלבד, שנאמר (שמות כו), והבדילה הפרכת לכם בין הקדש ובין קדש הקדשים״.\n**מקומה** — **יכין** (יומא ה): ״ס״ל דעובי אותה אמה כלפנים״. **לחם שמים** (מידות ד, ה): ״למ״ד פרוכת אחת הואי. לא מפסקא פרוכת אלא בצד אחד (דהיינו כפי הנראה צד החיצון)״.\n**פתחה** — הגמרא (יומא נא:): ״מאן יש אומרים? אמר רב חסדא: רבי יוסי היא, דאמר: פיתחא בצפון קאי״. **תוספות יום טוב** (יומא ה, ה): ״ובפרוכת אחת פתחא בצפון דהכי ס״ל ר״י״; ושם כתב שהרמב״ם, בסדר עבודת יום הכיפורים, ״העתיק דעת רבי יוסי שלא היתה אלא פרוכת אחת״ — ״לפי שכן יהיה לעתיד״.\nבמודל: פרוכת אחת, בצד האמה שכלפי ההיכל, ופתחה בצפון; האמה שמאחוריה פתוחה אל קודש הקדשים. המבט — כבשיטה הראשונה, מן הדרום אל הצפון: מימין הפרוכת, ומשמאל קודש הקדשים, המכוסה בענן במודל. ראש הפרוכת כפוף מעט כלפי פנים, כראש הפרוכת הפנימית שבשיטה הראשונה — בחירת מודל.\nבהדגמת הכהן הגדול — דרכו ״בין שלחן לכותל״, אל הפתח שבצפון.", [["יומא ה, א", {"book": 55, "index": 38}], ["יומא נא:", {"book": 107, "index": 1317}], ["רמב״ם בית הבחירה ד, ב", {"book": 337, "index": 63}], ["יכין יומא ה", {"book": 762, "index": 444}], ["לחם שמים מידות ד, ה", {"book": 1145, "index": 95}], ["תוי״ט יומא ה, ה", {"book": 898, "index": 179}], ["יומא נא: (רב חסדא)", {"book": 107, "index": 1318}]]], ["o2", "רבי מאיר — פרוכת אחת, ודרכו בין השולחן למזבח", "הברייתא (יומא נא:): ״תנו רבנן: בין המזבח למנורה היה מהלך, דברי רבי יהודה. רבי מאיר אומר: בין שלחן למזבח. ויש אומרים: בין שלחן לכותל״.\\nהגמרא שואלת: ״ורבי מאיר כמאן סבירא ליה? אי כרבי יהודה סבירא ליה — ניעול כרבי יהודה, אי כרבי יוסי סבירא ליה — ניעול כרבי יוסי!״ ומשיבה: ״לעולם כרבי יוסי סבירא ליה, ואמר לך: שולחנות צפון ודרום מונחין, ומפסקא ליה שלחן ולא מתעייל ליה. ואיבעית אימא: לעולם מזרח ומערב מונחין, ומשום שכינה לאו אורח ארעא למיעל להדיא״.\\n**רש״י** (יומא נא:): ״בין שולחן ולמזבח — דרך הצפון״. ״שולחנות צפון ודרום מונחין — עשר שולחנות עשה שלמה... חמש בשורה אחת... ועל כרחך צריך היה לסמוך ראש השולחן הצפוני לכותל... הלכך מפסקי שולחנות את הדרך ולא מתעייל ליה בין שולחן לכותל״. ועל ״למיעל להדיא״ (נב.): ״לילך אצל הכותל הצפוני כל אורך ההיכל, וכל שעה עיניו נזונות מבית קדשי הקדשים דרך הפריפה שכנגדו״.\\n**הריטב״א** (יומא נא:): ״שבא מדרום המזבח ונכנס בין השלחן שבצפון ולמזבח, ויוצא ונכנס בפתח שבצפון, דסבי׳ לי׳ כר׳ יוסי דפתח׳ בצפון קאי״.\\n**המאירי** (יומא נא:): ״ור׳ מאיר אף הוא סובר שלא היתה שם אלא פרוכת אחת, אלא שאומר שדרך מהלכו היה בין מזבח לשלחן משתי סבות״. והסיבה השנייה: ״אם הוא נכנס בין שלחן לכותל נמצא בעודו בהיכל מכוון כנגד הפירוף ורואה לפנים... ונוח לו שיעקם בין מזבח לשלחן שלא יראה בפנים עד שיגיע לפירוף עצמו״.\\n**תוספות יום טוב** (יומא ה, א): ״כדאמר בגמרא אליבא דר״מ דס״ל כר׳ יוסי שלא היה אלא פרוכת אחת, ומצריכו שלא יכנס בהיכל כנגד הפריפה כדי שלא יזונו עיניו״.\\n**רבינו חננאל** גורס בברייתא הפוך: ״בין המזבח למנורה... דברי ר׳ מאיר״, ו״ר׳ יהודה שהיה אומר בין המזבח לשלחן... לעולם ר׳ יהודה פתחא בצפון קאי״. גם לגרסתו, מי שהולך בין השולחן למזבח סובר שהפתח בצפון.\\n**לחם שמים** (מידות ד, ה): דברי רב, ששתי פרוכות היו בדביר ושתיים כנגדן בעלייה — ״אליבא דרבי מאיר התם, דשתי פרוכות הוו למטה״; כלומר, לדעתו לרבי מאיר שתי פרוכות. ובפירושו ליומא (ה, א) הוא מבאר את דרכו בבית ראשון: ״דרך ישר נגד הפתח, והוא בין שולחן למזבח כר״מ״.\\nבמודל: פרוכת אחת, כרבי יוסי, ופתחה בצפון — כמאירי וכתוספות יום טוב.\n**בהדגמת הכהן הגדול** — עשרת שולחנות שלמה עומדים בהיכל, כרש״י, בכל מצב של המתג ״שולחנות שלמה ומנורותיו״: תוספות רי״ד מדייק מכאן ״דעשרה שולחנות שעשה שלמה הי׳ בבית שני״, ומקשה מן המשנה בשקלים (ו, ד); ומסקנתו ״אלמא לא הי׳ בהיכל אלא שלחן אחד בלבד בבית שני״ — והיא שיטה החולקת על רבי מאיר. בתחילה השולחנות צפון ודרום, כתירוץ הראשון: הכהן הגדול מהלך מצפון למזבח, עובר בין המזבח לראש השורה המזרחית — ״שאין המזבח מכוון כנגד השולחן, אלא משוך קימעא כלפי חוץ״ (רש״י) — ממשיך מערבה לאורך ראשי השולחנות, ובין השורה המערבית לפרוכת פונה צפונה, אל הפתח, ונכנס בו כבשיטת רבי יוסי. בכתובית של התירוץ השני — השולחנות ממזרח למערב. מנורות שלמה עומדות בדרום, חמש וחמש, מן הכותל הדרומי, והכהן הגדול הולך בין ראשי השולחנות לראשי המנורות — כלשון הריטב״א (יומא נא:): ״הילכך בין מזבח לשולחן כי המזבח משוך הי׳ כלפי חוץ כדאיתא לעיל ונכנס בצד סוף השלחן הסמוך לו בין שלחן למנורה והולך לצפון״. כני הזהב שבהיכל עומדים במקומם, כמתג ״כני הזהב — שניים או אחד״. בסוף ההדגמה חוזר הכל כמו שנבחר במתגים. וכן כתבו התוספות (מנחות צח:): ״אע״ג דרבי מאיר סבירא ליה צפון ודרום מונחים כדמסיק התם, ניחא דיכול להלך בין שולחן למזבח, דשולחנות שלמה קיימי בתרי דרי... והמזבח היה בין שולחן דמשה למנורה דמשה, אלא שמשוך קימעא כלפי חוץ, ומזבח הזהב היה אמה על אמה — נמצא מקום פנוי הרבה שהיה יכול להלך בין המזבח לשולחנות״. והמאירי (יומא נא:): ״שהשלחנות עומדות צפון ודרום וראשי השלחנות מחברים לכותל ומפסיקות המהלך ומתוך כך בוקע בין מזבח לשלחן״. ותוספות רבינו פרץ (יומא נא:): ״לכן נראה לי שהיה המזבח בין השולחנות של שלמה למול שלחן של משה משוך קימעא לצד חוץ, פירוש למזרח, ויש דרך לעבור בינתים״. ובגרסת רבינו חננאל הדברים בשם רבי יהודה: ״ואמרינן לעולם ר׳ יהודה פתחא בצפון קאי וקסבר שלחנות בצפון ודרום היו מונחין ומפסקי ליה ולא מתעייל ליה״. הדרך המדויקת, מקום המזבח (אמה ורבע מזרחה יותר מבעבר, כדי שיהיה מעבר בינו ובין השולחנות), ומקום המנורות בשורותיהן — בחירת מודל לפי רש״י והריטב״א.", [["יומא נא:", {"book": 107, "index": 1318}], ["יומא נא: (כמאן סבירא ליה)", {"book": 107, "index": 1319}], ["יומא נא: (שולחנות צפון ודרום)", {"book": 107, "index": 1320}], ["יומא נב. (למיעל להדיא)", {"book": 107, "index": 1323}], ["רש״י יומא נא:", {"book": 2157, "index": 1951}], ["רש״י יומא נב.", {"book": 2157, "index": 1953}], ["ריטב״א יומא נא:", {"book": 1940, "index": 789}], ["מאירי יומא נא:", {"book": 2199, "index": 464}], ["תוי״ט יומא ה, א (מן הדרום)", {"book": 898, "index": 156}], ["רבינו חננאל יומא נא:", {"book": 2135, "index": 478}], ["לחם שמים מידות ד, ה", {"book": 1145, "index": 95}], ["לחם שמים יומא ה, א", {"book": 1094, "index": 215}]]], ["o3", "הרשב״א בדעת הרמב״ם — שתי פרוכות; החיצונה מן הצפון והפנימית מן הדרום", "**הרשב״א** (בתשובה, סי׳ שפ״ח; הובאה בכסף משנה, הלכות עבודת יום הכפורים ד, ב), בדעת הרמב״ם: התנא של ״מהיכן הוא מתחיל, מקרן מזרחית צפונית״ (יומא ה, ה) סובר ששתי פרוכות היו, ״אלא שהחיצונה פרופה מן הצפון ופנימית מן הדרום, וכי נפיק נפיק מן הצפון. ובזה יתקיימו דברי הרב ז״ל שהוא פסק בפרוכות כת״ק״. ולכן הרמב״ם פסק ששתי פרוכות היו (בית הבחירה ד, ב), ופסק גם שמתחיל להזות ״מקרן מזרחית צפונית״ (עבודת יום הכפורים ד, ב).\nהשאלה שעליה השיב: ״עכ״פ משנה זו שנויה לדעת ר׳ יוסי שסובר שלא היתה שם אלא פרוכת אחת ופרופה לצפון לימין הנכנס... ונפלאתי מדברי הרמב״ם ז״ל אחר שפסק גם הוא כרבנן היאך פסק בזו דמצפונית מזרחית הוא מתחיל״. אותה תמיהה כתב **המאירי** (יומא נד.).\n**תוספות יום טוב** (יומא ה, ה) מביא את הרשב״א: ״וסברה דחיצונה פרופה מן הצפון ופנימי מן הדרום, וכי נפיק נפיק מן הצפון״; ומיישב בעצמו אחרת: הרמב״ם כתב את סדר העבודה כפי שיהיה לעתיד, ״כשאין כאן אלא פרוכת אחת״, ופתחה בצפון.\n**מראה הפנים** (ירושלמי יומא ה, ה–ו) מבאר את הרמב״ם כרשב״א: ״ופיתחא בצפון קאי״. **מהר״י קורקוס** (הובא בכסף משנה, מעשה הקרבנות ה, יד): ״כמ״ש בפ״ד מהל׳ עבודת יוה״כ, כי מצד צפון יוצא״.\nומנגד, **הלחם משנה** (עבודת יום הכפורים ד, ב): ״דאית ליה לרבינו ז״ל פתחא בדרום קאי״.\nבמודל: שתי הפרוכות כשל תנא קמא, אבל בתמונת ראי — החיצונה פרופה בצד צפון, והפנימית בצד דרום. בהדגמה ״הכהן הגדול נכנס בקטורת״ הוא נכנס בפתח שבצפון, מהלך בין הפרוכות עד הדרום, נכנס בפתח הפנימית, ויוצא בדרך כניסתו — אל הצפון. דרכו בהיכל עד הפתח, בצד צפון — בחירת מודל."]],
          current: "o0",
          onPick: (k) => { const R = ctx.shared.parochotCount; if (R && typeof R.set === "function") R.set(k === "o3" ? "rashba" : k === "o2" ? "meir" : k === "o1" ? "one" : "two"); },
          fly: (k) => { const c = {"o0": [[-45.0, 29.5, 9.0], [-45.1, 25.3, -9.3]], "o1": [[-45.0, 29.5, 9.0], [-45.1, 25.3, -9.3]], "o2": [[-30.5, 31.0, 2.5], [-41.0, 26.2, -6.0]], "o3": [[-45.0, 29.5, -9.0], [-45.1, 25.3, 9.3]]}[k]; if (c && c[0] && c[1]) fly(c[0], c[1]); }
        });
        opRow({
          id: "sh56", short: "פריפת הפרוכות — רש״י, תוספות רי״ד או תוספות יום טוב", cardFly: true,
          cap: "פריפת הפרוכות — רש״י, תוספות רי״ד או תוספות יום טוב",
          refs: [["יומא ה, א", {"book": 55, "index": 38}], ["רש״י יומא נב:", {"book": 2157, "index": 1973}], ["רש״י יומא נא:", {"book": 2157, "index": 1949}], ["ברטנורא יומא ה, א", {"book": 582, "index": 196}], ["מאירי יומא ה, א", {"book": 2199, "index": 425}], ["תוי״ט יומא ה, א", {"book": 898, "index": 155}], ["תוספות רי״ד יומא נב:", {"book": 2109, "index": 161}], ["תוי״ט יומא ה, א (מן הדרום)", {"book": 898, "index": 156}], ["עיקר תוי״ט יומא ה, א", {"book": 1025, "index": 116}], ["רש״ש יומא נב:", {"book": 2494, "index": 568}], ["פני משה ירושלמי יומא ה, ב", {"book": 1809, "index": 939}], ["קרבן העדה ירושלמי יומא ה, ב", {"book": 1443, "index": 1255}], ["מלאכת שלמה יומא ה, א", {"book": 1151, "index": 177}], ["רמב״ם עבודת יום הכפורים ד, א", {"book": 342, "index": 32}]],
          options: [["o0", "רש״י — ראשה כפול ונאחז בקרס", "המשנה (יומא ה, א): ״החיצונה היתה פרופה מן הדרום, והפנימית מן הצפון״.\n**רש״י** (יומא נב:): ״פרופה — ראשה כפולה לצד החוץ ונאחזת בקרס של זהב להיות פתוחה ועומדת״. ובשיטת רבי יוסי, שהייתה שם פרוכת אחת (רש״י יומא נא:): ״ואצל הכותל הצפוני היה ראשה כפול ופרופה בקרס זהב כלפי החוץ ובו נכנסין לפני ולפנים״. וכן **ברטנורא** (יומא ה, א): ״ראשה כפולה לצד החיצון ונאחזת בקרס של זהב״.\n**המאירי** (יומא ה, א): ״שהיה ראשה כפול על עצמה ונתונה בקרסי זהב על שאר היריעה כדי שלא תסגור כל הצד וישאר מקום כניסה״. ולא עשו את הפרוכות סגורות, שיגביה אותן בשעת הכניסה — ״שהרי אין ידיו פנויות להגביהן״: המחתה בימינו, והכף בשמאלו.\n**תוספות יום טוב** (יומא ה, א): ״שהפרוכת על פני כל הדביר מכותל הצפון עד כותל הדרום״. ולדבריו, במקום הכפל הפרוכת ״היתה ארוכה ויצאת לחוץ לתוך ההיכל ונאחזת בכותל הדרום בקרס״; ״ועל שם הקרס מקרי פרופה כדמתרגם קרסי זהב. פורפין דדהב״.\n**פני משה** ו**קרבן העדה** (ירושלמי יומא ה, ב): ״ראשה כפולה לצד החיצון ונאחזת בקרסי זהב להיות פתוחה מן הדרום ועומדת״. ו**הרש״ש** (יומא נב:) מפרש כך את רש״י: ״דלא היה רוחב הפרוכת אלא כנגד רוחב ההיכל, והחיצונה היתה נכפלה על עצמה בקצה הדרום לצד ההיכל, וזהו לצד חוץ שכתב רש״י, והיתה שם פרופה בקרס, ונמצא שהיתה שם פתוחה ועומדת״.\nבמודל (ברירת המחדל): כל פרוכת מגיעה מכותל לכותל. הפינה התחתונה שליד הכותל — בחיצונה בדרום, ובפנימית בצפון — כפולה כלפי חוץ, אל צד ההיכל, ושוכבת על הפרוכת עצמה; קרס של זהב מחזיק את קצה הפינה. מתחת לכפל נשאר פתח בצורת משולש, ובו נכנס הכהן הגדול. גודל הכפל — חמש אמות לכל צד — בחירת מודל. ציורו של תוספות יום טוב — באפשרות השלישית.", [["יומא ה, א", {"book": 55, "index": 38}], ["רש״י יומא נב:", {"book": 2157, "index": 1973}], ["רש״י יומא נא:", {"book": 2157, "index": 1949}], ["ברטנורא יומא ה, א", {"book": 582, "index": 196}], ["מאירי יומא ה, א", {"book": 2199, "index": 425}], ["תוי״ט יומא ה, א", {"book": 898, "index": 155}], ["פני משה ירושלמי יומא ה, ב", {"book": 1809, "index": 939}], ["קרבן העדה ירושלמי יומא ה, ב", {"book": 1443, "index": 1255}], ["רש״ש יומא נב:", {"book": 2494, "index": 568}]]], ["o1", "תוספות רי״ד — סגורה בקרסים ולולאות", "**תוספות רי״ד** (יומא נב:) מביא את פירוש רש״י, וכותב: ״ואינו נ״ל שאין זה דרך צניעות להיות הפתח פתוח וכל הכהנים הנכנסים בהיכל יציצו ויראו בית קדש הקדשים״.\nופירושו: ״שפרופה הוא שהיו קרסיו תקועין בכותל ולולאות היו בשפת הפרוכת״; ״וכל הפרכת מלמעלה למטה היתה מחוברת יפה ומהודקה״ בקרסים ובלולאות. ״אבל כשיעור כניסת הכהן היו מניחים שלא היו קושרים אותם בהידוק״, ובשעת הכניסה ״מסלק הלולאות מן הקרסים ופותח וכשרוצה לסגור מכניס הלולאות בקרסים״.\nבמודל: כל פרוכת סגורה, מכותל לכותל. בשני הכתלים — קרסים של זהב לכל הגובה, ובשפת הפרוכת — לולאות סביבם. ליד הפתח — בחיצונה בדרום, ובפנימית בצפון — בגובה הכניסה, הלולאות רפויות. בהדגמת כניסת הכהן הגדול ביום הכיפורים, הפינה שליד הפתח נפתחת כשהוא מגיע אליה — נכפלת לאחור, אל הצד שאליו הוא נכנס — ונסגרת אחריו. מספר הקרסים, גובה הכניסה וצורת הפתיחה — בחירת מודל.", [["יומא ה, א", {"book": 55, "index": 38}], ["תוספות רי״ד יומא נב:", {"book": 2109, "index": 161}], ["רש״י יומא נב:", {"book": 2157, "index": 1973}]]], ["o2", "תוספות יום טוב — הפינה נמשכת אל הכותל", "**תוספות יום טוב** (יומא ה, א), על ״פרופה״: ״פירש הר״ב ראשה כפולה לצד החיצון ונאחזת בקרס כו׳ וכפי׳ רש״י. ור״ל שהפרוכת על פני כל הדביר מכותל הצפון עד כותל הדרום. ושם בכותל דרום נכפלה, ר״ל היתה ארוכה ויצאת לחוץ לתוך ההיכל ונאחזת בכותל הדרום בקרס כו׳. ועל שם הקרס מקרי פרופה, כדמתרגם קרסי זהב — פורפין דדהב״. וכן **עיקר תוספות יום טוב**: ״היתה ארכה יוצאת לחוץ לתוך ההיכל ונאחזת בכתל הדרום בקרס״.\\nובדיבור ״מן הדרום״ הוא מבאר למה לא עשו גם את פריפת החיצונה בצפון: ״דכבוד הוא לקדש הקדשים שלא יהיו נפתחים שתי הפרוכות בצד אחד, ויהיו עיניו ניזונות מיד מבית קדש קדשים״.\\n**הרש״ש** (יומא נב:) מקשה: ״וא״י איך יפרנס לפי פירושו מש״כ רש״י להיות פתוחה ועומדת״ — אם הקצה נאחז בכותל, הפינה סגורה. ולכן הוא מפרש את רש״י אחרת — כאפשרות הראשונה: ״דלא היה רוחב הפרוכת אלא כנגד רוחב ההיכל, והחיצונה היתה נכפלה על עצמה בקצה הדרום לצד ההיכל... ונמצא שהיתה שם פתוחה ועומדת״.\\nבמודל: הפרוכת ארוכה מרוחב הבית. הפינה התחתונה שליד הכותל — בחיצונה בדרום, ובפנימית בצפון — מורמת ונמשכת החוצה, וקצה נאחז בקרס של זהב בכותל, בגובה כחמש אמות וחצי. בחיצונה הפינה נמשכת שלוש אמות לתוך ההיכל; בפנימית — לתוך האמה שבין הפרוכות, ולכן מעט בלבד; וכשיש פרוכת אחת (רבי יוסי ורבי מאיר) — שלוש אמות לתוך ההיכל. הפתח — מתחת לפינה, לאורך הכותל, ובו עובר הכהן הגדול. הגובה, המשיכה וצורת הפינה — בחירת מודל, כדי שיישאר פתח, כקושיית הרש״ש.", [["תוי״ט יומא ה, א", {"book": 898, "index": 155}], ["תוי״ט יומא ה, א (מן הדרום)", {"book": 898, "index": 156}], ["עיקר תוי״ט יומא ה, א", {"book": 1025, "index": 116}], ["רש״ש יומא נב:", {"book": 2494, "index": 568}], ["רש״ש משנה יומא ה, א", {"book": 698, "index": 59}], ["רש״י יומא נב:", {"book": 2157, "index": 1973}]]]],
          current: "o0",
          onPick: (k) => { const F = ctx.shared.parochetFold; if (F && typeof F.set === "function") F.set(k === "o1" ? "rid" : k === "o2" ? "tyt" : "rashi"); },
          fly: (k) => { const c = {"o0": [[-35.5, 30.5, 1.5], [-44.5, 27.5, 7]], "o1": [[-35.5, 30.5, 1.5], [-44.5, 27.5, 7]], "o2": [[-35.0, 31.5, 2.5], [-43.4, 26.6, 8.4]]}[k]; if (c && c[0] && c[1]) fly(c[0], c[1]); }
        });
        opRow({
          id: "sh58", short: "פרוכות הפתחים — פרוסות או מוגבהות", cardFly: true,
          cap: "פרוכות הפתחים — שבעת שערי העזרה, ההיכל והאולם: פרוסות או מוגבהות",
          refs: [["כתובות קו.", {"book": 116, "index": 3032}], ["יומא נד.", {"book": 107, "index": 1412}], ["רש״י כתובות קו.", {"book": 2168, "index": 4902}], ["תוספות כתובות קו.", {"book": 1914, "index": 1407}], ["מאירי כתובות קו.", {"book": 2209, "index": 1340}], ["רמב״ם כלי המקדש ז, יז", {"book": 338, "index": 118}], ["תוספתא שקלים ג, יא", {"book": 193, "index": 40}], ["מידות ב, ג", {"book": 89, "index": 14}], ["תמיד ז, א", {"book": 88, "index": 38}], ["ברטנורא תמיד ז, א", {"book": 634, "index": 222}], ["תוי״ט תמיד ז, א", {"book": 944, "index": 209}], ["הרא״ש תמיד לג:", {"book": 2224, "index": 308}], ["מלאכת שלמה תמיד ז, א", {"book": 1202, "index": 288}], ["משנה למלך כלי המקדש ז, יז", {"book": 4607, "index": 54}], ["עיקר תוי״ט תמיד ז, א", {"book": 1075, "index": 171}], ["יומא נד. (מגללין)", {"book": 107, "index": 1407}], ["רש״י יומא נד. (דבבי)", {"book": 2157, "index": 2067}]],
          options: [["o0", "פרוסות על הפתחים (תוספתא, רש״י)", "רב (כתובות קו.; יומא נד.): ״שלש עשרה פרכות היו במקדש שני: שבע כנגד שבעה שערים, אחת לפתחו של היכל, ואחת לפתחו של אולם, שתים בדביר, שתים כנגדן בעליה״. וכן פסק **הרמב״ם** (כלי המקדש ז, יז): ״שבע על שבעה שערי העזרה, ואחת על פתח האולם, ואחת על פתח ההיכל, ושתים לדביר בינו ובין הקדש, ושתים כנגדן בעליה״.\\n**רש״י** (כתובות קו.): ״בדבבי — בפרכות שכנגד הפתחים, דלצניעותא עבידי ואינן תחת בנין״; ״ז׳ שערים — לעזרה״. **תוספות** שם: שבעת שערי העזרה הם כתנא של מידות (א, ד): ״שלשה בצפון ושלשה בדרום ואחד במזרח״. **המאירי** שם: ״פרכות אלו של שערים תשעה היו... ושל דביר היו ארבעה״.\\n**פרוכת ההיכל** — התוספתא (שקלים ג, יא): ״אחרת היתה שם, ארכה עשרים אמה ורחבה עשר... מעשה רוקם, והיתה פרוסה על פתחו של היכל מבחוץ״. **פרוכת האולם** — המשנה (מידות ב, ג): ״כל הפתחים שהיו שם היו להן דלתות, חוץ משל אולם״; ו**הברטנורא** (תמיד ז, א), על ״הגביה לו את הפרכת״: ״שתלוי בפתחו של אולם, שלא היה לפתחו של אולם דלתות כשאר פתחים שבמקדש, אלא פרכת בלבד״.\\n**תוספות יום טוב** (תמיד ז, א) מסכים לברטנורא, ועל פרוכת להיכל כותב: ״וזה לא שמענו בשום מקום״. אבל **הרא״ש** (תמיד לג:): ״התלוי לפני פתח ההיכל לצניעות, וכן היה לפני שער האולם״ (הובא במלאכת שלמה שם); ו**המשנה למלך** (כלי המקדש ז, יז) מעיר שהרמב״ם עצמו כתב ״ואחת על פתח ההיכל״.\\n״פרוסה״ — כך משמע מן התוספתא; ומן ״מגללין להם את הפרוכת״ בשעת העלייה לרגל (יומא נד.); ומן ״הגביה לו את הפרכת״ (תמיד ז, א).\\nבמודל (ברירת המחדל): כל פרוכת תלויה מבחוץ, לפני הפתח — כפרוכת ההיכל שבתוספתא. בשבעת שערי העזרה — בצפון: שער הניצוץ, שער הקרבן, ופתח בית המוקד לעזרה, מצד בית המוקד; בדרום: שער הדלק, שער הבכורות ושער המים; ובמזרח: שער ניקנור, מצד עזרת נשים. בפתח ההיכל — באולם; ובפתח האולם — מול העזרה. גודלה כגודל הפתח: השערים וההיכל עשר על עשרים (מידות ב, ג; ד, א), והאולם עשרים על ארבעים (ג, ז). פרוכת מוגבהת מעצמה בזמן הדגמה, וכשהמבט עובר דרך הפתח שלה — ויורדת אחר כך. האריג — כאריג הפרוכת, בלי צורות; המוט של זהב — בחירת מודל.", [["כתובות קו.", {"book": 116, "index": 3032}], ["יומא נד.", {"book": 107, "index": 1412}], ["רש״י כתובות קו.", {"book": 2168, "index": 4902}], ["תוספות כתובות קו.", {"book": 1914, "index": 1407}], ["מאירי כתובות קו.", {"book": 2209, "index": 1340}], ["רמב״ם כלי המקדש ז, יז", {"book": 338, "index": 118}], ["תוספתא שקלים ג, יא", {"book": 193, "index": 40}], ["מידות ב, ג", {"book": 89, "index": 14}], ["תמיד ז, א", {"book": 88, "index": 38}], ["ברטנורא תמיד ז, א", {"book": 634, "index": 222}], ["תוי״ט תמיד ז, א", {"book": 944, "index": 209}], ["הרא״ש תמיד לג:", {"book": 2224, "index": 308}], ["מלאכת שלמה תמיד ז, א", {"book": 1202, "index": 288}], ["משנה למלך כלי המקדש ז, יז", {"book": 4607, "index": 54}]]], ["o1", "מוגבהות — מגוללות למעלה (עיקר תוי״ט)", "**עיקר תוספות יום טוב** (תמיד ז, א): ״ונראה לי שהיה הפרכת כל היום מגבה ועומד על ידי קשרים ויתרות, לכנס ולצאת הכהנים הצריכים לעבודת מנורה ומזבח פנימי, אלא שכשנכנס הכהן גדול היו מסירים הפרכת מהקשרים ויתרות כדי שיהא נתלה על עמדו״.\\nוהגמרא (יומא נד.): ״בשעה שהיו ישראל עולין לרגל, מגללין להם את הפרוכת, ומראין להם את הכרובים״ — ושם מעמידה זאת ב״פרוכת דבבי״; ורש״י: ״דבבי — שכנגד הפתחים: פתח אולם והיכל ובית קדשי הקדשים״.\\nבמודל: כל תשע הפרוכות מגוללות למעלה, מתחת למשקוף, וקשורות — והפתחים פתוחים למבט.", [["עיקר תוי״ט תמיד ז, א", {"book": 1075, "index": 171}], ["יומא נד. (מגללין)", {"book": 107, "index": 1407}], ["רש״י יומא נד. (דבבי)", {"book": 2157, "index": 2067}]]]],
          current: "o0",
          onPick: (k) => { const G = ctx.shared.gateParochot; if (G && typeof G.set === "function") G.set(k === "o1" ? "up" : "down"); },
          fly: (k) => { const c = {"o0": [[64, 44, 52], [18.6, 38, 0]], "o1": [[64, 44, 52], [18.6, 38, 0]]}[k]; if (c && c[0] && c[1]) fly(c[0], c[1]); }
        });
        opRow({
          id: "sh59", short: "הפרוכות שבעלייה — מכותל לכותל או כלחם שמים", cardFly: true,
          cap: "הפרוכות שבעלייה — מכותל לכותל, או באמצע והפספסין מן הכתלים",
          refs: [["כתובות קו.", {"book": 116, "index": 3032}], ["רש״י כתובות קו. (בעליה)", {"book": 2168, "index": 4905}], ["מידות ד, ה", {"book": 89, "index": 32}], ["תוי״ט מידות ד, ה", {"book": 948, "index": 167}], ["יכין מידות ד, ה", {"book": 819, "index": 570}], ["מלאכת שלמה מידות ד, ה", {"book": 1210, "index": 164}], ["לחם שמים מידות ד, ה", {"book": 1145, "index": 95}], ["לחם שמים מידות ד, ה (ב)", {"book": 1145, "index": 96}], ["רמב״ם כלי המקדש ז, יז", {"book": 338, "index": 118}]],
          options: [["o0", "מכותל לכותל — תוספות יום טוב ויכין", "רב (כתובות קו.): ״שתים בדביר, שתים כנגדן בעליה״. **רש״י** שם: ״להבדיל בין עליית היכל לעליית קדשי הקדשים, וגם הן במקום אמה טרקסין״. וכן פסק **הרמב״ם** (כלי המקדש ז, יז).\\nהמשנה (מידות ד, ה): ״וראשי פספסין מבדילים בעליה בין הקדש לבין קדש הקדשים״.\\n**תוספות יום טוב** (מידות ד, ה): ״דשתי פרוכות היו מבדילות בעלייה... וא״כ קשיא, תרתי למה לי?״ ומתרץ: עליית בית קודש הקדשים חמורה מקודש הקדשים עצמו, ואין נכנסים לה אלא לעיתים רחוקות (פסחים פו.), ״ומעתה הואיל והיא חמורה, עבדי נמי פספסים, כדי שיכירו עולי עלייה שקדושת עליית קדשי קדשים חמורה״.\\n**יכין** (מידות ד, ה): ״אע״ג שהיה שם ב׳ פרוכת בין עליית ההיכל לעליית ק״ק... אפ״ה היה שם גם הפספסין, מפני חומר קדושת עליית ק״ק״. **מלאכת שלמה** (שם): ״ושתי פרוכות כנגדן בעליה, כדי להפסיק בין שתי עליות״.\\nבמודל (ברירת המחדל): שתי פרוכות מכותל לכותל, ואמה ביניהן, מרצפת העלייה עד תקרתה (ארבעים אמה — מידות ד, ו), מעל שתי הפרוכות שלמטה. ראשי הפספסין — שורה באמצע האמה שביניהן. הפרוכות סגורות, בלי פריפה. האריג — בלי צורות; בחירת מודל.", [["כתובות קו.", {"book": 116, "index": 3032}], ["רש״י כתובות קו. (בעליה)", {"book": 2168, "index": 4905}], ["מידות ד, ה", {"book": 89, "index": 32}], ["תוי״ט מידות ד, ה", {"book": 948, "index": 167}], ["יכין מידות ד, ה", {"book": 819, "index": 570}], ["מלאכת שלמה מידות ד, ה", {"book": 1210, "index": 164}], ["רמב״ם כלי המקדש ז, יז", {"book": 338, "index": 118}]]], ["o1", "לחם שמים — באמצע, והפספסין מן הכתלים", "**לחם שמים** (מידות ד, ה) חולק על תוספות יום טוב: ״ומ״ש תי״ט אין בו טעם כל עיקר״. לדעתו, בבית שני — ״ואע״ג דהוו שתי פרוכות למעלה כמו למטה, מ״מ לא היו רחבות כל כך, ולא מגיעות בעליה עד הכותלים, אילך ואילך, שהפספסין יוצאין מן הכתלים בצפון ובדרום ומגיעין עד הבדלת הפרוכת, ושם מפסיקין בין הקודש לבין קודש הקדשים במקום שאין פרוכת. נמצא ששני מיני הבדלות היו צריכין להיות שם בלי ספק, ולא היה אחד מהם לבטלה״. ועוד: ״לפי שפרוכת של עליה מכוון כנגד פרוכת דפתח של בית, לא יותר״.\\nבמודל: שתי הפרוכות שבעלייה באמצע בלבד — רוחבן עשר אמות, בחירת מודל — וראשי הפספסין מן הכותל הצפוני ומן הכותל הדרומי עד הפרוכות. שתי הפרוכות שלמטה — מכותל לכותל, כמו בשאר המודל.", [["לחם שמים מידות ד, ה", {"book": 1145, "index": 95}], ["לחם שמים מידות ד, ה (ב)", {"book": 1145, "index": 96}], ["מידות ד, ה", {"book": 89, "index": 32}]]]],
          current: "o0",
          onPick: (k) => { const A = ctx.shared.aliyahParochot; if (A && typeof A.set === "function") A.set(k === "o1" ? "ls" : "wall"); },
          fly: (k) => { if (ctx.shared.openFor) ctx.shared.openFor("ui-house", 15000); const c = {"o0": [[-33, 96, 40], [-45, 84, 0]], "o1": [[-33, 96, 40], [-45, 84, 0]]}[k]; if (c && c[0] && c[1]) fly(c[0], c[1]); }
        });
        opRow({
          id: "sh48", short: "כני הזהב — שניים או אחד", cardFly: true,
          cap: "כני הזהב — שניים או אחד",
          refs: [["יומא ה, ג", {"book": 55, "index": 40}], ["יומא ה, ד", {"book": 55, "index": 41}], ["יומא נה:", {"book": 107, "index": 1444}], ["יומא נו:", {"book": 107, "index": 1461}]],
          options: [["o0", "תנא קמא — שני כנים", "המשנה (יומא ה, ג–ד): ״יצא והניחו על כן הזהב שבהיכל״; ״יצא והניחו על כן השני שהיה בהיכל״.\nבמודל (ברירת המחדל): שני כנים לפני הפרוכת — על הראשון דם הפר, ועל השני דם השעיר. מקומם וצורתם — בחירת מודל.", [["יומא ה, ג", {"book": 55, "index": 40}], ["יומא ה, ד", {"book": 55, "index": 41}], ["יומא נה:", {"book": 107, "index": 1444}], ["יומא נו:", {"book": 107, "index": 1461}]]], ["o1", "רבי יהודה — כן אחד בלבד", "המשנה (יומא ה, ד): ״רבי יהודה אומר, לא היה שם אלא כן אחד בלבד״.\nהגמרא (יומא נה:): ״תרי מאי טעמא לא — משום דמחלפי. ונעביד תרי וליכתוב עלייהו הי דפר והי דשעיר״? ומסקנת הגמרא (יומא נו:): ״משום חולשא דכהן גדול לאו אדעתיה״ — מחמת חולשתו לא ייתן דעתו על הכתוב.\nבמודל: כן אחד לפני הפרוכת.", [["יומא ה, ג", {"book": 55, "index": 40}], ["יומא ה, ד", {"book": 55, "index": 41}], ["יומא נה:", {"book": 107, "index": 1444}], ["יומא נו:", {"book": 107, "index": 1461}]]]],
          current: "o0",
          onPick: (k) => { const FK = (ctx.shared.features || {}).kanim; if (FK) { try { if (!FK.isOn()) { FK.on(); leaveFeat = FK; } } catch (_) {} } const K = ctx.shared.kanim; if (K && typeof K.set === "function") K.set(k === "o1" ? 1 : 2); },
          fly: (k) => { const c = {"o0": [[-35, 27, -1.5], [-42.3, 24.8, 3.1]], "o1": [[-35, 27, -1.5], [-42.3, 24.8, 3.1]]}[k]; if (c && c[0] && c[1]) fly(c[0], c[1]); }
        });
        opRow({
          id: "sh49", short: "הציור על הפרוכות", cardFly: true,
          cap: "הציור על הפרוכות",
          refs: [["יומא עב:", "Yoma.72b"], ["מעשי למלך כלי המקדש ח, טו", "Maasei_LaMelech_on_Klei_HaMikdash.8.15"], ["יומא נד.", "Yoma.54a"]],
          options: [["o0", "רש״י — אריה ונשר", "בתורה נאמר בפרוכת מעשה חושב וכרובים (שמות כו, לא); וביומא (עב:): ״חושב — מעשה אורג, לפיכך שני פרצופות״.\nרש״י (יומא עב:): ״שיש לה ליריעה שתי קירות ושתי צורות על שתי קירותיה אין דומות זו לזו פעמים שמצד זה ארי ומצד זה נשר״; וכן אחת הדעות בירושלמי (שקלים ח, ד): ״מעשה חושב ארי מכאן ונשר מכאן״ (כגירסת המשנה למלך).\nבמודל: נשרים לצד ההיכל ואריות לצד קודש הקדשים — כפי שקבעת בפרוכת של בית ראשון.", [["יומא עב:", "Yoma.72b"]]], ["o1", "רמב״ם — אותה צורה משני הצדדים", "המשנה למלך (הלכות כלי המקדש ח, טו): ״אך רבינו ס״ל דלעולם אף במעשה חושב ליכא צורות משתנות זו מזו״ — מעשה חושב הוא שהצורה האחת נראית משני הצדדים, ״פנים ואחור״; וכן הדעה השנייה בירושלמי (שקלים ח, ד).\nבמודל: אריות משני צדי כל פרוכת — אותו אריה, כצורה ארוגה הנראית מעברה השני בהיפוך.", [["יומא עב:", "Yoma.72b"]]], ["o2", "המעשי למלך — בלי צורות", "המשנה למלך (הלכות כלי המקדש ח, טו) תמה למה לא הזכיר הרמב״ם צורת כרובים בעשיית הפרוכת. המעשי למלך (שם) מביא בשם ספר התוה״מ: ״דגם פרוכת לא נהג לדורות כי בבית ראשון לא הי׳ שם פרוכת כותל בנין ואף דהי׳ עכ״פ נגד הפתח לא הי׳ דוגמת פרוכת המשכן ובבית שני הי׳ שני פרוכת מפני ספקו של אמה טרקסין והיו במקום בנין ולא הי׳ יכול לעשות כרובים שלא ידעו איזה הפרוכת העקרי״.\nבמודל: הפרוכות ארוגות תכלת וארגמן ותולעת שני ושש, בלי צורות.", [["מעשי למלך כלי המקדש ח, טו", "Maasei_LaMelech_on_Klei_HaMikdash.8.15"], ["יומא נד.", "Yoma.54a"]]]],
          current: "o0",
          onPick: (k) => { if (ctx.shared.parochetArt && typeof ctx.shared.parochetArt.set === "function") ctx.shared.parochetArt.set(["rashi", "rambam", "plain"][+k.slice(1)] || "rashi"); },
          fly: (k) => { const c = {"o0": [[-20, 36, 2], [-44.5, 38, 0]], "o1": [[-20, 36, 2], [-44.5, 38, 0]], "o2": [[-20, 36, 2], [-44.5, 38, 0]]}[k]; if (c && c[0] && c[1]) fly(c[0], c[1]); }
        });
        opRow({
          id: "sh50", short: "שערי בית המוקד", cardFly: true,
          cap: "שערי בית המוקד",
          refs: [["מידות א, ז", "Mishnah_Middot.1.7"], ["תמיד כו:", "Tamid.26b"], ["הרא״ש, תמיד כו:", "Rosh_on_Tamid.26.2"]],
          options: [["o0", "זה כנגד זה — הרא״ש, פירוש ראשון", "לשון המשנה (מידות א, ז): ״שנים שערים היו לבית המוקד, אחד פתוח לחיל ואחד פתוח לעזרה״.\nהרא״ש (תמיד כו:): ״כי מכוונים היו שערים זה כנגד זה, אחד פתוח להר הבית ואחד פתוח לעזרה, ושומר אחד היה יכול לראות לכאן ולכאן״.\nבמודל (ברירת המחדל): שער לחיל באמצע הכותל הצפוני, ושער לעזרה כנגדו באמצע הכותל הדרומי.", [["מידות א, ז", "Mishnah_Middot.1.7"], ["תמיד כו:", "Tamid.26b"], ["הרא״ש, תמיד כו:", "Rosh_on_Tamid.26.2"]]], ["o1", "סמוכים זה לזה — הרא״ש, פירוש שני", "לשון המשנה (מידות א, ז): ״שנים שערים היו לבית המוקד, אחד פתוח לחיל ואחד פתוח לעזרה״.\nהרא״ש (תמיד כו:): ״ותו גבי הדדי הוה קיימי — אותו הפתוח לעזרה היה עומד אצל קרן מזרחית צפונית, ואותו שפתוח להר הבית היה בחציו של כותל מזרחי, מיד שמתחיל החיל, היו סמוכין זה לזה״.\nבמודל: שער החיל בכותל המזרחי, סמוך לקו כותל העזרה מצפונו; הפתח שבצפון סתום; ולשכת אבני המזבח, שעמדה במקום השער, זזה שש אמות וחצי מערבה. שער העזרה נשאר בכותל הדרומי. מקום השערים המדויק, מידת שער החיל (חמש על עשר) והזזת הלשכה — בחירת מודל.", [["מידות א, ז", "Mishnah_Middot.1.7"], ["תמיד כו:", "Tamid.26b"], ["הרא״ש, תמיד כו:", "Rosh_on_Tamid.26.2"]]]],
          current: "o0",
          onPick: (k) => { const G = ctx.shared.mokedGates; if (G && typeof G.set === "function") G.set(k === "o1" ? "adjacent" : "opposite"); },
          fly: (k) => { const c = {"o0": [[8, 66, -112], [-15, 17, -69]], "o1": [[8, 66, -112], [-15, 17, -69]]}[k]; if (c && c[0] && c[1]) fly(c[0], c[1]); if (ctx.shared.openFor) ctx.shared.openFor("crt-lishkot-roofs", 15000); if (c && c[1] && ctx.shared.fadeHold) ctx.shared.fadeHold.set(c[1]); }
        });
        opRow({
          id: "sh51", short: "שמות הלשכות שבבית המוקד — לפי משנת תמיד", cardFly: true,
          cap: "שמות הלשכות שבבית המוקד — לפי משנת תמיד",
          refs: [["תמיד ג, ג", {"book": 88, "index": 15}], ["מידות א, ו", {"book": 89, "index": 7}], ["יומא יז.", {"book": 107, "index": 368}], ["יומא יז:", {"book": 107, "index": 370}], ["רש״י יומא יז:", {"book": 2157, "index": 533}], ["תוספות רי״ד יומא יז.", {"book": 2109, "index": 50}], ["ריטב״א יומא יז.", {"book": 1940, "index": 214}], ["תוספות יומא יז.", {"book": 1908, "index": 142}], ["ברטנורא מידות א, ו", {"book": 643, "index": 39}], ["מאירי מידות א, ו", {"book": 6033, "index": 16}], ["יכין תמיד ג, ג", {"book": 818, "index": 252}], ["המפרש לתמיד ל.", {"book": 2105, "index": 247}], ["הגר״א תמיד ג, ג", {"book": 7510, "index": 42}], ["מאירי יומא טו:", {"book": 2199, "index": 131}]],
          options: [["o0", "רש״י, רי״ד וריטב״א — בית המוקד בצפון־מזרח", "לשון המשנה (תמיד ג, ג): ״וארבע לשכות היו שם, אחת לשכת הטלאים, ואחת לשכת החותמות, ואחת לשכת בית המוקד, ואחת לשכה שהיו עושין בה לחם הפנים״; ובמידות (א, ו): ״מערבית דרומית, היא היתה לשכת טלאי קרבן. דרומית מזרחית, היא היתה לשכת עושי לחם הפנים. מזרחית צפונית, בה גנזו בני חשמונאי את אבני המזבח ששקצום מלכי יון. צפונית מערבית, בה יורדים לבית הטבילה״.\n**הגמרא** (יומא יז.–יז:) מיישבת את שתי המשניות: ״מר קא חשיב דרך ימין, ומר קא חשיב דרך שמאל״; ״אלא לאו שמע מינה, במערבית דרומית הואי״.\nבקצרה — המחלוקת: מוסכם — לשכת הטלאים במערבית דרומית, והלשכה שעושין בה לחם הפנים בדרומית מזרחית. בשתי הלשכות שבצפון:\n• לרש״י, לתוספות רי״ד ולריטב״א — בית המוקד במזרחית צפונית, והחותמות בצפונית מערבית (ברירת המחדל).\n• לברטנורא, למאירי, ליכין ולמפרש — להפך: החותמות במזרחית צפונית, ובית המוקד בצפונית מערבית.\n**רש״י** (יומא יז:): ״כיצד לשכת הטלאים בדרומית מערבית לשכת החותמות כי אזלת דרך שמאל במערבית צפונית לשכת בית המוקד צפונית מזרחית לשכת לחם הפנים במזרחית דרומית״.\n**תוספות רי״ד** (יומא יז.): ״ומאי דתנן במדות מזרחית צפונית בה גנזו בית חשמונאי אבני מזבח האי לשכת בית המוקד דתני בתמיד וצפונית מערבית שבה יורדין לבית הטבילה היא לשכת החותמות דתני בתמיד״.\n**ריטב״א** (יומא יז.): ״ודע דלשכת בית המוקד דמשנת תמיד היא היא לשכה שגנזו בה אבני מזבח כו׳ דמשנת מדות ולשכת החותמות במסכת תמיד היא היא שיורדין בה לבית הטבילה דמס׳ מדות״.\n**תוספות** (יומא יז.): ״דעל כרחך לשכת החותמות ולשכת בית המוקד הם היו אותם שתי לשכות דקא חשיב במסכת מדות״.\nבמודל (ברירת המחדל): מעל שם כל לשכה כמשנת מידות — שמה במשנת תמיד; במזרחית צפונית ״לשכת בית המוקד״, ובצפונית מערבית ״לשכת החותמות״. ״פתח את הלשכות״ מסיר את הגג.\nכשבוחרים שיטה, המבט עובר על ארבע הלשכות, אחת אחת, ומעל כל לשכה מופיע שמה לפי אותה שיטה: שתי הצפוניות, שבהן המחלוקת, במסגרת אדומה, ושתי הדרומיות, המוסכמות, בזהב. בסוף נראות ארבעתן יחד. לחיצה בעכבר על המודל, או בחירה במקום אחר, עוצרת את הסיור.", [["תמיד ג, ג", {"book": 88, "index": 15}], ["מידות א, ו", {"book": 89, "index": 7}], ["יומא יז.", {"book": 107, "index": 368}], ["יומא יז:", {"book": 107, "index": 370}], ["רש״י יומא יז:", {"book": 2157, "index": 533}], ["תוספות רי״ד יומא יז.", {"book": 2109, "index": 50}], ["ריטב״א יומא יז.", {"book": 1940, "index": 214}], ["תוספות יומא יז.", {"book": 1908, "index": 142}]]], ["o1", "ברטנורא, מאירי, יכין והמפרש — החותמות בצפון־מזרח", "לשון המשנה (תמיד ג, ג): ״וארבע לשכות היו שם, אחת לשכת הטלאים, ואחת לשכת החותמות, ואחת לשכת בית המוקד, ואחת לשכה שהיו עושין בה לחם הפנים״; ובמידות (א, ו): ״מערבית דרומית, היא היתה לשכת טלאי קרבן. דרומית מזרחית, היא היתה לשכת עושי לחם הפנים. מזרחית צפונית, בה גנזו בני חשמונאי את אבני המזבח ששקצום מלכי יון. צפונית מערבית, בה יורדים לבית הטבילה״.\n**הגמרא** (יומא יז.–יז:) מיישבת את שתי המשניות: ״מר קא חשיב דרך ימין, ומר קא חשיב דרך שמאל״; ״אלא לאו שמע מינה, במערבית דרומית הואי״.\nבקצרה — המחלוקת: מוסכם — לשכת הטלאים במערבית דרומית, והלשכה שעושין בה לחם הפנים בדרומית מזרחית. בשתי הלשכות שבצפון:\n• לרש״י, לתוספות רי״ד ולריטב״א — בית המוקד במזרחית צפונית, והחותמות בצפונית מערבית (ברירת המחדל).\n• לברטנורא, למאירי, ליכין ולמפרש — להפך: החותמות במזרחית צפונית, ובית המוקד בצפונית מערבית.\n**ברטנורא** (מידות א, ו), על לשכת אבני המזבח: ״ששקצום מלכי יון. שהקטירו עליו לעבודה זרה. ובמסכת שקלים ובמסכת תמיד קורא לה לשכת החותמות״.\n**המאירי** (מידות א, ו): ״מזרחית צפונית בה גנזו מלכי בית חשמונאי אבני המזבח ששקצו מלכי יון והקטירו עליהם והיא הקרויה במסכת תמיד לשכת החותמות, צפונית מערבית בה יורדים לבית הטבילה ובה מדורת אש להתחמם בה״. ובחידושיו ליומא (טו:): ״מה ששנינו במסכת תמיד ל׳ א׳ והלא לשכת הטלאים היתה במקצוע צפונית מערבית כלומר דודאי לשכת הטלאים היתה במקצוע מערבית דרומית וכן שהיתה שם לשכת החותמות ולשכת בית המוקד אין הלכה כן״.\n**תפארת ישראל** (יכין, תמיד ג, ג): ״ואחת לשכת החותמות במזרחית צפונית היתה שם, ששם יושב כל היום הממונה על החותמות״.\n**המפרש לתמיד** (ל.): ״מזרחית צפונית בה גנזו בית חשמונאי את אבני מזבח ששקצום מלכי יון שהיא לשכת בית החותמות דתנן הכא״; ״ולשכת בית המוקד הוא הנקרא בית המוקד קטן היא לשכה שיורדין בה לבית הטבילה״.\n**הגר״א** (תמיד ג, ג): ״לפי׳ המפרש נ״ל בית המוקד קודם לחותמות״ — כלומר, לשיטת המפרש יש להקדים במשנה את בית המוקד לחותמות.\nבמודל: מעל שם כל לשכה כמשנת מידות — שמה במשנת תמיד; במזרחית צפונית ״לשכת החותמות״, ובצפונית מערבית ״לשכת בית המוקד״.\nכשבוחרים שיטה, המבט עובר על ארבע הלשכות, אחת אחת, ומעל כל לשכה מופיע שמה לפי אותה שיטה: שתי הצפוניות, שבהן המחלוקת, במסגרת אדומה, ושתי הדרומיות, המוסכמות, בזהב. בסוף נראות ארבעתן יחד. לחיצה בעכבר על המודל, או בחירה במקום אחר, עוצרת את הסיור.", [["תמיד ג, ג", {"book": 88, "index": 15}], ["מידות א, ו", {"book": 89, "index": 7}], ["יומא יז.", {"book": 107, "index": 368}], ["יומא יז:", {"book": 107, "index": 370}], ["ברטנורא מידות א, ו", {"book": 643, "index": 39}], ["מאירי מידות א, ו", {"book": 6033, "index": 16}], ["יכין תמיד ג, ג", {"book": 818, "index": 252}], ["המפרש לתמיד ל.", {"book": 2105, "index": 247}], ["הגר״א תמיד ג, ג", {"book": 7510, "index": 42}], ["מאירי יומא טו:", {"book": 2199, "index": 131}]]]],
          current: "o0",
          onPick: (k) => { const M = ctx.shared.mokedTamid; if (M && typeof M.show === "function") M.show(k === "o1" ? "b" : "a"); else if (M && typeof M.set === "function") M.set(k === "o1" ? "b" : "a"); },
          fly: (k) => { const c = {"o0": [[-18, 62, -40], [-18, 14, -67.5]], "o1": [[-18, 62, -40], [-18, 14, -67.5]]}[k]; if (c && c[0] && c[1]) fly(c[0], c[1]); if (ctx.shared.openFor) ctx.shared.openFor("crt-lishkot-roofs", 15000); }
        });
        opRow({
          id: "sh52", short: "לשכת עושי לחם הפנים — מה נעשה בה", cardFly: true,
          cap: "לשכת עושי לחם הפנים — מה נעשה בה",
          refs: [["מנחות יא, ב", {"book": 81, "index": 81}], ["רמב״ם תמידין ומוספין ה, ז", {"book": 344, "index": 76}], ["תוספות יום טוב מידות א, ו", {"book": 948, "index": 47}], ["יכין מידות א, ו", {"book": 819, "index": 98}], ["מנחות ו, ז", {"book": 81, "index": 43}], ["מעשי למלך בית הבחירה ה, י", {"book": 4304, "index": 145}]],
          options: [["o0", "אפייה בלבד — תנא קמא, וכן פסק הרמב״ם", "לשון המשנה (מנחות יא, ב): ״אחד שתי הלחם ואחד לחם הפנים, לישתן ועריכתן בחוץ, ואפיתן בפנים״. וכן פסק **הרמב״ם** (תמידין ומוספין ה, ז): ״לישתן ועריכתן בחוץ ואפיתן בפנים בעזרה״.\n**תוספות יום טוב** (מידות א, ו): ״היא היתה לשכת לחם הפנים וסמוכה לעזרה ונמצאת שהיתה מקודשת, אתיא כמ״ד אפייתן בפנים״.\nבמודל: בלשכה התנור, הדפוסים, החלות והאופה — בלי עריבה ובלי נפות.", [["מנחות יא, ב", {"book": 81, "index": 81}], ["רמב״ם תמידין ומוספין ה, ז", {"book": 344, "index": 76}], ["תוספות יום טוב מידות א, ו", {"book": 948, "index": 47}]]], ["o1", "לישה ואפייה — רבי יהודה, וכלשון היכין", "**היכין** (מידות א, ו): ״שם לשין ואופין אותן במקום הקודש. ונ״ל דהנך ב׳ לשכות מדעשויות לדברים קדושים, להכי הכינום בדרום של בית המוקד, דהיינו בחצי שלפנים שהיה קדוש. ואתיא כמ״ד דלחה״פ נאפות בפנים״.\nוכך דעת **רבי יהודה** במשנה (מנחות יא, ב): ״כל מעשיהם בפנים״. **מעשי למלך** (בית הבחירה ה, י), על דברי הרמב״ם: ״ונראה מדבריו דמעשי׳ היתה בקודש, דלשכות של צד דרום בקודש הי׳״; ותלה את מקום הלשכה במחלוקת התנאים: ״ולמ״ד דלישתן ועריכתן בפנים לכן הי׳ בקודש דרומית מזרחית״.\nבמודל: נוספו העריבה ובה בצק, הלש (לוי, כאופה), כד סולת וכד מים, ואחת עשרה נפות על הכותל — ״ולחם הפנים באחת עשרה״ (מנחות ו, ז). מקומם — בחירת מודל.", [["יכין מידות א, ו", {"book": 819, "index": 98}], ["מנחות יא, ב", {"book": 81, "index": 81}], ["מנחות ו, ז", {"book": 81, "index": 43}], ["מעשי למלך בית הבחירה ה, י", {"book": 4304, "index": 145}]]]],
          current: "o0",
          onPick: (k) => { const M = ctx.shared.lechemMakers; if (M && typeof M.set === "function") M.set(k === "o1" ? "knead" : "bake"); },
          fly: (k) => { const c = {"o0": [[-8.4, 27.5, -58.3], [-7.6, 17.2, -62.2]], "o1": [[-8.4, 27.5, -58.3], [-7.6, 17.2, -62.2]]}[k]; if (c && c[0] && c[1]) fly(c[0], c[1]); if (ctx.shared.openFor) ctx.shared.openFor("crt-lishkot-roofs", 15000); }
        });
        opRow({
          id: "sh53", short: "חביתי כהן גדול — אפייה וטיגון", cardFly: true,
          cap: "חביתי כהן גדול — אפייה וטיגון",
          refs: [["מנחות נ:", {"book": 131, "index": 1746}]],
          options: [["o0", "רבי יוחנן — אופה, ואחר כך מטגנה", "הגמרא (מנחות נ:): ״חביתי כהן גדול, כיצד עושין אותן? רבי חייא בר אבא אמר רבי יוחנן: אופה, ואחר כך מטגנה״.\nובהמשך הגמרא — ״כתנאי: ׳תפיני׳ — תאפינה נא. רבי אומר: תאפינה נאה. רבי יוסי אומר: תאפינה רבה. אית ליה נא, ואית ליה נאה״.\nבמודל (ברירת המחדל): ״1 · אפייה״ על התנור, ו״2 · טיגון במחבת״ על הכירה; העושה עומד אצל התנור. ברירת המחדל כרבי יוחנן — בחירת מודל.", [["מנחות נ:", {"book": 131, "index": 1746}]]], ["o1", "רבי חנינא — מטגנה, ואחר כך אופה", "הגמרא (מנחות נ:): ״רבי אסי אמר רבי חנינא: מטגנה, ואחר כך אופה״.\nבמודל: ״1 · טיגון במחבת״ על הכירה, ו״2 · אפייה״ על התנור; העושה עומד אצל המחבת.", [["מנחות נ:", {"book": 131, "index": 1746}]]]],
          current: "o0",
          onPick: (k) => { const C = ctx.shared.chavitinOrder; if (C && typeof C.set === "function") C.set(k === "o1" ? "fry" : "bake"); },
          fly: (k) => { const c = {"o0": [[98.6, 24.8, 26.0], [98.6, 15.3, 22.6]], "o1": [[98.6, 24.8, 26.0], [98.6, 15.3, 22.6]]}[k]; if (c && c[0] && c[1]) fly(c[0], c[1]); if (ctx.shared.openFor) ctx.shared.openFor("crt-lishkot-roofs", 15000); }
        });
        opRow({
          id: "sh54", short: "שמות שערי הצפון — אבא יוסי בן חנן", cardFly: true,
          cap: "שמות שערי הצפון — אבא יוסי בן חנן",
          refs: [["תפא״י מידות ב, ו", "Yachin_on_Mishnah_Middot.2.6"], ["חק נתן מידות א, ד", "Chok_Natan_on_Mishnah_Middot.1.4"], ["מידות ב, ו", "Mishnah_Middot.2.6"], ["הרא״ש מידות ב, ו", "Rosh_on_Mishnah_Middot.2.6"]],
          options: [["o0", "תפארת ישראל וחק נתן — שער הנשים קטן, ושער השיר הוא בית המוקד", "תפארת ישראל (יכין, מידות ב, ו): ״ונ״ל עוד שזהו שער קטן דלא חשיב ליה תנא לעיל״; ״ושער השיר דקחשיב תנא הכא, נ״ל דהוא שער בית המוקד דקחשיב התם. וא״כ מדמונה התנא השעריס כסדר ממערב למזרח, היה שער הנשים בין שער הקרבן לשער המוקד״. וחק נתן (מידות א, ד) — שער הניצוץ ״הוא שער יכניה״.\nבמודל (בתצוגת שלושה עשר השערים): מן המערב — יכניה (הניצוץ), הקרבן, שער הנשים הקטן, ושער השיר — בית המוקד.", [["תפא״י מידות ב, ו", "Yachin_on_Mishnah_Middot.2.6"], ["חק נתן מידות א, ד", "Chok_Natan_on_Mishnah_Middot.1.4"], ["מידות ב, ו", "Mishnah_Middot.2.6"]]], ["o1", "האפשרות שתפארת ישראל דוחה — שער הנשים הוא בית המוקד, ושער השיר קטן למזרחו", "תפארת ישראל (שם) מביא ודוחה: ״אבל אי״ל דשער המוקד הוא שער הנשים, ושער השיר היה למזרח משער המוקד, והוא היה השער הקטן דלא חשיב ליה התם. דאין טעם למה יעשו לשער השיר קטן. ובל״ז לא מסתבר שיחדו שער לנשים דרך ביהמו״ק מקום שמצויין שם פרחי כהונה להחם״. והרא״ש (מידות ב, ו): ״שער השיר. שם היו מכניסין כלי השיר כי היה סמוך לבית המטבחים״.\nבמודל: שער השיר — שער קטן למזרח בית המוקד (מקומו — בחירת מודל); שער הנשים — שער בית המוקד שלעזרה.", [["תפא״י מידות ב, ו", "Yachin_on_Mishnah_Middot.2.6"], ["הרא״ש מידות ב, ו", "Rosh_on_Mishnah_Middot.2.6"], ["מידות ב, ו", "Mishnah_Middot.2.6"]]]],
          current: "o0",
          onPick: (k) => { if (ctx.shared.gates13 && typeof ctx.shared.gates13.set === "function") ctx.shared.gates13.set(k === "o1" ? "thirteenR" : "thirteen"); const r20 = OPS.find((r) => r.cap === "שער העליון"); if (r20 && r20.cur !== "o1" && typeof r20.mark === "function") r20.mark("o1"); },
          fly: (k) => { const c = {"o0": [[-46, 54, -118], [-33, 29, -67]], "o1": [[10, 54, -118], [-8, 29, -67]]}[k]; if (c && c[0] && c[1]) fly(c[0], c[1]); if (c && c[1] && ctx.shared.fadeHold) ctx.shared.fadeHold.set(c[1]); }
        });
        opRow({
          id: "sh55", short: "שער טדי — צורת האבנים", cardFly: true,
          cap: "שער טדי — צורת האבנים",
          refs: [["מידות ב, ג", "Mishnah_Middot.2.3"]],
          options: [["o0", "אבנים מוטות", "״שתי אבנים מטות זו על גב זו״ (מידות ב, ג). תפארת ישראל: המשקוף עשוי משתי אבנים מונחות באלכסון זו כנגד זו, כמשולש, ועשוהו כן לסימן לכל הצריך לצאת בהצנע; תוספות יום טוב מביא את הרמב״ם — שתי אבנים מוטות זו על גב זו וציר השער מונח בהן. המודל: Λ פתוח; אושר על ידי יוסי.", [["מידות ב, ג", "Mishnah_Middot.2.3"]]], ["o1", "אבנים זקופות — לא מאומת", "תוספות יום טוב (מידות א, ג) בשם ספר הראבי״ה, סדר בניין בית שני: ״שער טרי — שני אבנים זקופות... ולכך נקרא טרי פי׳ מוצב״; ותפארת ישראל (שם): יש גורסים ״טרי״, שמשקופו עשוי משתי אבנים זקופות הנשענות זו על זו כמשולש. במודל: מצויר כמתג — שתי אבנים זקופות משני צדי ראש הפתח; צורתן המדויקת לא נתפרשה — ״לא מאומת״.", [["מידות ב, ג", "Mishnah_Middot.2.3"]]]],
          current: "o0",
          onPick: (k) => { if (ctx.shared.tadi && typeof ctx.shared.tadi.set === "function") ctx.shared.tadi.set(k === "o1" ? "zekufot" : "mutot"); },
          fly: (k) => { const c = {"o0": [[55, 16, -224], [55, 14, -174.5]], "o1": [[55, 16, -224], [55, 14, -174.5]]}[k]; if (c && c[0] && c[1]) fly(c[0], c[1]); if (c && c[1] && ctx.shared.fadeHold) ctx.shared.fadeHold.set(c[1]); }
        });
      }
      // OPS_GROUPS_303 (the user, 18.11.2026: "שימת המחלוקות מאוד ארוכה, הייתי מציע לחלק אותה לקטגוריות כגון <הר הבית> <עזרת נשים>
      // <לשכות העזרה> <המזבח> וכו'. ע"י כך זה יהיה מסודר יותר ויהיה קל יותר לשימוש"; on the groups proposed: "החלוקה מצוינת תתחיל
      // לעבוד עליה"; a numbering of סימנים and סעיפים: "לא מעניין - בשביל זה יש חיפוש"): THE TABLE IN GROUPS BY PLACE, from outside in.
      // Each group is a closed <details> inside #tm-ops, its title with the number of its rows; inside a group the rows of one place
      // stand together (the order of one walk, 1.3.5). OPS (the readings of the presentation, 75-tour.js) goes by the same order, and
      // every row knows its group (row.group - the line above a reading's slide). A row that no group lists (one added later) is not
      // lost: it stands after the groups, in "עוד". A row of a card only (row.cardOnly) keeps its place in OPS and is not counted.
      {
        const GROUPS = [
          ["הר הבית והחיל", ["sh0", "sh1", "sh2", "sh55", "sh3", "sh61"]],
          ["עזרת נשים", ["sh4", "sh5", "sh6", "sh60"]],
          ["העזרה", ["sh9", "sh54", "sh8", "sh11", "sh10", "sh14", "sh15", "sh62"]],
          ["לשכות העזרה ובית המוקד", ["sh7", "sh50", "sh51", "sh52", "sh53"]],
          ["המזבח, הכבש והכיור", ["sh16", "sh17", "sh18", "sh19", "sh20", "sh21", "sh23", "sh24", "sh25", "sh26"]],
          ["האולם", ["sh27", "sh28", "sh29", "sh30", "sh31", "sh32"]],
          ["בניין ההיכל, התאים והעלייה", ["sh33", "sh34", "sh35", "sh36", "sh37", "sh38", "sh39", "sh40", "sh41"]],
          ["כלי ההיכל", ["sh42", "sh43", "sh44", "sh45", "sh57", "sh46", "sh48"]],
          ["הפרוכות", ["sh47", "sh56", "sh58", "sh59", "sh49"]],
          ["סדר העבודה ובגדי הכהנים", ["sh12", "sh22", "sh13"]]
        ];
        const byId = {};
        for (const r of OPS) if (r && r.id && !byId[r.id]) byId[r.id] = r;
        const used = new Set();
        const lists = [];
        for (const [name, ids] of GROUPS) {
          const rows = [];
          for (const id of ids) {
            const r = byId[id];
            if (r && !used.has(r)) { used.add(r); rows.push(r); }
          }
          if (rows.length) lists.push([name, rows]);
        }
        const rest = OPS.filter((r) => r && !used.has(r));
        if (rest.length) lists.push(["עוד", rest]);
        OPS.length = 0;
        for (const [name, rows] of lists) {
          const det = document.createElement("details");
          det.className = "tm-opg";
          const body = document.createElement("div");
          body.className = "tm-opg-b";
          let n = 0;
          for (const r of rows) {
            OPS.push(r);
            r.group = name;
            if (r.box && !r.cardOnly) { body.appendChild(r.box); n++; }
          }
          if (!n) continue;   // a group of card rows only: no empty group in the table
          const sm = document.createElement("summary");
          sm.textContent = name;
          const cnt = document.createElement("span");
          cnt.className = "n";
          cnt.textContent = "(" + n + ")";
          sm.appendChild(cnt);
          det.appendChild(sm);
          det.appendChild(body);
          opsBox.appendChild(det);
        }
      }
      // ===== viewing tools (SPEC 9.6; 1.0.1 FIXES F.2; 1.0.1-H: sources on the rows) =====
      // 1.0.1-K: the removal rows (the cutaway, the chambers, the ulam, the boards, the cloud) left the panel for the on-model pills (the
      // user: "הכפתור צריך להיות על המיצג ולא בתוכן הענינים"); the wall fade moved to the nav row. The panel says where they are.
      const secTog = document.createElement("div");
      secTog.className = "sec";
      secTog.textContent = "תצוגה — כלי צפייה (אינם חלק מן הבניין)";
      panel.appendChild(secTog);
      {
        const note = document.createElement("div");
        note.className = "s";
        note.style.lineHeight = "1.5";
        // 1.0.1-L: the pills of this round; what a PLACE switches on goes off by itself (L.27), what a pill switches on stays
        note.textContent = "פתיחה לצפייה (ההיכל, הלשכות, הסטיו) — בכפתורים שעל המודל עצמו; ״↺ החזר הכל״ סוגר הכול.";   // 1.1.0: short (the long list of the pills is gone from the tree)
        panel.appendChild(note);
      }
      toggleRow("תוויות", true, (on) => {
        labelGroup.visible = on;
      });
      const setAutoRotate = (on) => {
        if (ctx.controls) {
          ctx.controls.autoRotate = !!on;
          ctx.controls.autoRotateSpeed = 0.4;
        }
      };
      // 1.0.1-K review (tour-8): the row's input is kept for ctx.ui.autoRotate (the presentation suspends the rotation through it)
      const autoRotRow = toggleRow("סיבוב איטי", false, setAutoRotate);
      // 1.2.0 (the user): indoors the eye stays in the room while it orbits a vessel (the DEFAULT: to see the menorot from behind, come close
      // with the wheel and drag round them); this row lets the eye pass the walls, which then go see-through (the 1.0.5 way)
      if (ctx.camInside && typeof ctx.camInside.set === "function") {
        toggleRow("מעבר דרך קירות (שקופים)", !ctx.camInside.get(), (on) => ctx.camInside.set(!on));
      }
      // STONE_211 (the user, 14.11.2026: "יש דרך לעשות את כל החומות והלשכות בצבע אבן עתיקה"; then: "לא צריך מתג לגוון האבן - אפשר לעשות
      // זאת מתג רק בצורה של אלו" - a row here, by "תוויות"; then, 23:15: "את כלל החומות בגוון אבן עתיקה (גם הלשכות, רק לא האולם, היכל,
      // קה״ק ותאים)"): the stone of ALL the walls and the chambers in a warm, aged hue - on by default; off: the light stone as before.
      // The Temple's own building (the ulam, the heichal, the Holy of Holies, the cells) keeps its light stone: its pieces that share
      // the walls' materials get an untinted twin. The walls' own clones (the fading walls of 10-core.js) are found by their texture.
      // A view setting only, not a reading (the marble of Herod's building is the opinions' row "בניין הורדוס")
      {
        const MM = ctx.M || {}, TT = ctx.THREE;
        const BASES = ["stone", "stoneLight", "stoneSmooth"].map((k) => MM[k]).filter(Boolean);
        if (BASES.length && TT && ctx.scene) {
          const TINT = new TT.Color(0xe8d3aa);
          const orig = new Map(BASES.map((m) => [m, m.color.clone()]));   // a base material -> its own colour
          const tinted = new Map(BASES.map((m) => [m, m.color.clone().multiply(TINT)]));
          const aged = new Map();    // every tinted material -> the colour it goes back to
          const fresh = new Map();   // a base material -> its untinted twin, for the Temple's building
          const src = (t) => t && (t.source || t.image || t);
          const baseOf = (m) => { if (orig.has(m)) return m; if (!m.map) return null; for (const b of BASES) if (b.map && (b.map === m.map || src(b.map) === src(m.map))) return b; return null; };
          const near = (p, q) => Math.abs(p.r - q.r) + Math.abs(p.g - q.g) + Math.abs(p.b - q.b) < 0.02;
          const inTemple = (o) => { for (let p = o; p; p = p.parent) if (/^(heichal|interior|ulamCourses|house-)/.test(p.name || "")) return true; return false; };
          let on = true;
          const notStone = new WeakSet(), done = new WeakMap();   // materials that are not the walls' stone; a mesh -> the material it had when scanned
          const scan = () => {
            ctx.scene.traverse((o) => {
              if (!o.isMesh || o.isSprite) return;
              const arr = Array.isArray(o.material);
              if (!arr && done.get(o) === o.material) return;
              const ms = arr ? o.material : [o.material];
              let temple = null;
              for (let i = 0; i < ms.length; i++) {
                const m = ms[i];
                if (!m || !m.color || notStone.has(m) || (m.userData && m.userData.tmFresh)) continue;
                const isBase = orig.has(m);
                if (!isBase && aged.has(m)) continue;
                const b = isBase ? m : baseOf(m);
                if (!b) { notStone.add(m); continue; }
                if (temple === null) temple = inTemple(o);
                if (temple) {
                  if (isBase) {   // the building shares the walls' material: its untinted twin
                    let f = fresh.get(b);
                    if (!f) { f = b.clone(); f.color.copy(orig.get(b)); f.userData.tmFresh = true; fresh.set(b, f); }
                    if (arr) o.material[i] = f; else o.material = f;
                  } else { if (near(m.color, tinted.get(b))) m.color.copy(orig.get(b)); m.userData.tmFresh = true; }   // its own clone stays light
                  continue;
                }
                if (!isBase && !near(m.color, orig.get(b)) && !near(m.color, tinted.get(b))) { notStone.add(m); continue; }   // a clone with a colour of its own
                aged.set(m, orig.get(b));
              }
              if (!arr) done.set(o, o.material);
            });
          };
          const apply = () => { for (const [m, c] of aged) { m.color.copy(c); if (on) m.color.multiply(TINT); } };
          const setAged = (v) => { on = !!v; scan(); apply(); };
          setAged(true);
          toggleRow("גוון אבן עתיקה", true, setAged);
          ctx.shared.stoneAged = { set: setAged, isOn: () => on, count: () => aged.size };
          setInterval(() => { const n = aged.size; scan(); if (aged.size !== n) apply(); }, 2500);   // pieces built or re-clad later
        }
      }
      // SOUND_211 (the user, 15.11.2026: sounds in the demonstrations - and a way to silence them): the row "קולות בהדגמות", on by
      // default; off - no demonstration makes a sound (ctx.shared.soundOff: every sound maker asks it) and what sounds now stops
      // (ctx.shared.soundStops). Kept between visits (localStorage "tm.sound.off", one key for both houses)
      {
        let off = false;
        try { off = localStorage.getItem("tm.sound.off") === "1"; } catch (_) {}
        ctx.shared.soundOff = off;
        const inpS = toggleRow("קולות בהדגמות", !off, (on) => {
          ctx.shared.soundOff = !on;
          try { localStorage.setItem("tm.sound.off", on ? "0" : "1"); } catch (_) {}
          if (!on) { for (const f of (Array.isArray(ctx.shared.soundStops) ? ctx.shared.soundStops : [])) { try { f(); } catch (_) {} } }
        });
        // SOUND_SYNC_211 (the function review, F2-09): the key was read once, at load - with both houses open, silencing one left the
        // other sounding. Now each house reads it again when the other writes it ("storage") and when it is shown again.
        const syncS = () => {
          let o = false;
          try { o = localStorage.getItem("tm.sound.off") === "1"; } catch (_) { return; }
          if (o === !!ctx.shared.soundOff) return;
          ctx.shared.soundOff = o;
          if (inpS) inpS.checked = !o;
          if (o) { for (const f of (Array.isArray(ctx.shared.soundStops) ? ctx.shared.soundStops : [])) { try { f(); } catch (_) {} } }
        };
        window.addEventListener("storage", (e) => { if (!e || e.key == null || e.key === "tm.sound.off") syncS(); });
        window.addEventListener("focus", syncS);
        document.addEventListener("visibilitychange", syncS);
      }
      // HQ_302 (the WebGPU round's STAGE2_LIGHT rows, in the regular engine): "soft shadow in corners" and, once it is ready, "light
      // bounced from the walls"; both off by default, kept between visits in localStorage "tm.hq.ao" / "tm.hq.gi" (one key for both
      // houses, as "tm.sound.off"); ctx.shared.hq (90-entry.js, 85-hq.js) does the drawing. Each house follows the other's change
      // ("storage", focus, shown again), as the sound row does.
      if (ctx.shared.hq) {
        const HQ = ctx.shared.hq;
        const rd = (k) => { try { return localStorage.getItem(k) === "1"; } catch (_) { return false; } };
        const wr = (k, on) => { try { localStorage.setItem(k, on ? "1" : "0"); } catch (_) {} };
        let aoOn = rd("tm.hq.ao"), giOn = HQ.giReady ? rd("tm.hq.gi") : false;
        HQ.set(aoOn, giOn);
        const inpAO = toggleRow("איכות גבוהה: צל רך בפינות", aoOn, (on) => { aoOn = on; wr("tm.hq.ao", on); HQ.set(aoOn, giOn); });
        if (inpAO && inpAO.parentNode) inpAO.parentNode.title = "צל רך בפינות, בחיבורים ובתחתית הקירות. במחשב חלש זה עלול להאט את התנועה.";
        let inpGI = null;
        if (HQ.giReady) {
          inpGI = toggleRow("אור חוזר מהקירות (כבד מאוד)", giOn, (on) => { giOn = on; wr("tm.hq.gi", on); HQ.set(aoOn, giOn); });
          if (inpGI && inpGI.parentNode) inpGI.parentNode.title = "אור שחוזר מהקירות ומהזהב אל מה שסביבם. כבד מאוד: במחשב חלש התנועה תאט מאוד.";
        }
        const syncHQ = () => {
          const a = rd("tm.hq.ao"), g = HQ.giReady ? rd("tm.hq.gi") : false;
          if (a === aoOn && g === giOn) return;
          aoOn = a;
          giOn = g;
          if (inpAO) inpAO.checked = a;
          if (inpGI) inpGI.checked = g;
          HQ.set(aoOn, giOn);
        };
        window.addEventListener("storage", (e) => { if (!e || e.key == null || e.key === "tm.hq.ao" || e.key === "tm.hq.gi") syncHQ(); });
        window.addEventListener("focus", syncHQ);
        document.addEventListener("visibilitychange", syncHQ);
      }
      const units = document.createElement("div");
      units.id = "tm-units";
      units.textContent = "המידות באמות. יחידה אחת במודל = אמה אחת. לחיצה על מבט, מקום או שיטה פותחת את ההסבר ומקורותיו בכרטיס ליד התפריט (✕ או Esc סוגר). מה שאין לו מקור מסומן בכרטיסים ״בחירת מודל״; המחלוקות — בתפריט, תחת ״שיטות ומחלוקות״.";
      panel.appendChild(units);
      const foot = document.createElement("div");
      foot.id = "tm-foot";
      // 1.1.0: the controls' hint is the "ניווט" dialog of the top bar; the foot only points there
      foot.textContent = "הוראות ניווט (עכבר, מגע, מקלדת) — בכפתור ״ניווט״ שבסרגל העליון";
      foot.style.cursor = "pointer";
      foot.addEventListener("click", () => { const b = document.getElementById("tm-help-btn"); if (b) b.click(); });
      panel.appendChild(foot);
      // NEWS_WIN_211: the way back to the list of this version - the top bar's button goes once the list was seen (1.1.0, the user)
      {
        const fn = document.createElement("div");
        fn.id = "tm-foot-news";
        fn.textContent = "מה חדש בגרסה זו";
        fn.addEventListener("click", () => { try { const o = document.getElementById("tm-news"); if (o) o.remove(); else if (ctx.ui && ctx.ui.news) ctx.ui.news.show(); } catch (_) {} });
        panel.appendChild(fn);
      }
      // 1.1.0: the top bar's buttons are children of #tm-topbtns in index.html's header, in a flex row, ordered by `order`
      // (presentation 10, navigation help 20, print 30, report 40, what's new 50). Each gets an inline SVG icon (ui_topIcon) and its
      // label in a span.lbl (hidden in a narrow window: index.html). No measuring, no polling: the row lays itself out.
      // ctx.ui.topbarAdd is exported for 75-tour.js (the presentation button, built after this module).
      const topbarAdd = (el, order, icon, label) => {
        el.classList.add("tm-topbtn");
        el.dataset.order = String(order == null ? 99 : order);
        if (icon || label) {
          el.textContent = "";
          if (icon) el.appendChild(ui_topIcon(icon));
          if (label) {
            const sp = document.createElement("span");
            sp.className = "lbl";
            sp.textContent = label;
            el.appendChild(sp);
          }
        }
        const nav = document.getElementById("tm-topbtns");
        if (!nav) {
          document.body.appendChild(el);
          return el;
        }
        const o = +el.dataset.order;
        let before = null;
        for (const c of nav.children) {
          if (+c.dataset.order > o) { before = c; break; }
        }
        nav.insertBefore(el, before);
        return el;
      };
      // ===== 1.1.0 (the user): a clear button in the bar with the navigation instructions ("הוראות ניווט") =====
      {
        const hbtn = document.createElement("button");
        hbtn.type = "button";
        hbtn.id = "tm-help-btn";
        hbtn.title = "הוראות ניווט: עכבר, משטח מגע, מגע ומקלדת";
        topbarAdd(hbtn, 20, "help", "ניווט");
        const dlg = document.createElement("div");
        dlg.id = "tm-help";
        dlg.setAttribute("role", "dialog");
        dlg.setAttribute("aria-label", "הוראות ניווט");
        const box = document.createElement("div");
        box.className = "box";
        const t = document.createElement("div");
        t.className = "t";
        t.textContent = "הוראות ניווט במודל";
        box.appendChild(t);
        const sec = (title, items) => {
          const h = document.createElement("h4");
          h.textContent = title;
          box.appendChild(h);
          const ul = document.createElement("ul");
          for (const it of items) {
            const li = document.createElement("li");
            // "<kbd>" marks a key: [[text]]
            const parts = String(it).split(/(\[\[[^\]]+\]\])/);
            for (const p of parts) {
              if (!p) continue;
              const m = /^\[\[([^\]]+)\]\]$/.exec(p);
              if (m) {
                const k = document.createElement("kbd");
                k.textContent = m[1];
                li.appendChild(k);
              } else li.appendChild(document.createTextNode(p));
            }
            ul.appendChild(li);
          }
          box.appendChild(ul);
        };
        // HELP_211: the navigation help in plain words (the user: "בשפה יותר ברורה גם לכאלו שלא מבינים במחשב")
        sec("עם עכבר", [
          "להסתובב סביב המקום: לחץ על הכפתור השמאלי של העכבר, החזק אותו, והזז את העכבר.",
          "להתקרב או להתרחק: גלגל את הגלגלת שבאמצע העכבר. המודל מתקרב בדיוק למקום שעליו עומד הסמן — זכוכית המגדלת.",
          "אפשר גם בלי גלגלת: העמד את זכוכית המגדלת על מקום ולחץ [[Enter]] — המודל מתקרב אליו. [[Shift]] + [[Enter]] — מתרחק. לחיצה כפולה בעכבר עושה כמו [[Enter]].",
          "להזיז את התמונה הצידה: לחץ על הכפתור הימני של העכבר, החזק אותו, והזז את העכבר.",
          "לקרוא הסבר על מקום: לחץ על השם שכתוב עליו במודל. כשהסמן נעשה יד — אפשר ללחוץ."
        ]);
        sec("במחשב נייד (משטח מגע)", [
          "להסתובב: לחץ על המשטח, החזק, וגרור את האצבע (או: הקש פעמיים, ובפעם השנייה השאר את האצבע על המשטח וגרור).",
          "להתקרב: שים שתי אצבעות על המשטח והרחק אותן זו מזו, או החלק את שתיהן יחד למעלה.",
          "אם במקום להתקרב הדף כולו זז: לחץ פעם אחת על המודל, ונסה שוב כשהסמן עומד על המודל."
        ]);
        sec("בטלפון או בטאבלט (מסך מגע)", [
          "אצבע אחת — מסובבת. שתי אצבעות שנפתחות — מקרבות. שתי אצבעות שזזות יחד — מזיזות את התמונה."
        ]);
        sec("עם המקלדת", [
          "[[↑]] — ללכת קדימה. [[↓]] — ללכת אחורה.",
          "[[←]] [[→]] — לפנות שמאלה וימינה.",
          "[[PageUp]] — לעלות. [[PageDown]] — לרדת.",
          "[[+]] [[−]] — להתקרב ולהתרחק. [[Esc]] — לסגור כרטיס הסבר."
        ]);
        sec("התפריט שבצד", [
          "בתפריט רשומים כל המקומות. לחיצה על שם — מעבירה אל המקום ופותחת עליו הסבר.",
          "שורת החיפוש שבראש התפריט: כתוב מילה, ויופיעו המקומות שמתאימים לה.",
          "״שיטות ומחלוקות״: כאן בוחרים איך לצייר דבר שנחלקו בו. לחיצה על שיטה — משנה את המודל מיד.",
          "״מה חדש בגרסה זו״, בסוף התפריט — פותח שוב את רשימת החידושים."
        ]);
        sec("הדגמות", [
          "כפתור של הדגמה מפעיל סרטון בתוך המודל.",
          "לחיצה על המודל בזמן הדגמה — עוצרת אותה. ״המשך״ — ממשיך מאותו רגע. ״עצור״ — מפסיק."
        ]);
        sec("כלים נוספים", [
          "המצפן (בפינה התחתונה): החץ האדום מראה לאן הצפון. לחיצה על אחת האותיות — מפנה את המבט לכיוון שלה.",
          "🚶 מצב הליכה: העין בגובה אדם, כאילו אתה הולך במקום. החצים במקלדת — הליכה. [[Esc]] — יציאה.",
          "״חתך״: חותך את הבניין כמו בשרטוט, כדי לראות מה בפנים. הפס שלידו מזיז את מקום החתך.",
          "בתוך ההיכל: כשאתה רחוק — הגרירה מסובבת את המבט סביבך. ליד כלי — הגרירה מסתובבת סביב הכלי.",
          "״מעבר דרך קירות״ (בתפריט, תחת ״תצוגה״) — מרשה לעבור דרך קירות; הם נעשים שקופים בדרך.",
          "״טשטוש חומות״ (בשורת הכפתורים שבתחתית המסך): חומה שמסתירה את מה שמביטים בו נעשית שקופה למחצה. ״מרחק טשטוש״ — עד איזה מרחק מן העין.",
          "״↺ החזר הכל״ — מופיע בשורת הכפתורים שבתחתית המסך אחרי שפתחת משהו במודל (גג, קיר, חתך). לחיצה עליו סוגרת את כל מה שנפתח. את השיטות שבחרת הוא אינו משנה.",
          "בסרגל העליון: ״מצגת״ — סיור מודרך, שלב אחר שלב. ״הדפסה״ — מדפיסה את התמונה ואת כרטיס ההסבר. ״דיווח״ — לשלוח הערה או תיקון."
        ]);
        const bb = document.createElement("div");
        bb.className = "b";
        const ok = document.createElement("button");
        ok.type = "button";
        ok.className = "y";
        ok.textContent = "סגירה";
        bb.appendChild(ok);
        box.appendChild(bb);
        dlg.appendChild(box);
        document.body.appendChild(dlg);
        const close = () => { dlg.style.display = "none"; };
        ok.addEventListener("click", close);
        dlg.addEventListener("click", (e) => { if (e.target === dlg) close(); });
        dlg.addEventListener("keydown", (e) => {
          e.stopPropagation();
          if (e.key === "Escape" || e.key === "Esc" || e.key === "Enter") close();
        });
        dlg.addEventListener("keyup", (e) => e.stopPropagation());
        hbtn.addEventListener("click", () => {
          dlg.style.display = dlg.style.display === "flex" ? "none" : "flex";
          if (dlg.style.display === "flex") { try { ok.focus({ preventScroll: true }); } catch (_) {} }
        });
      }
      // ===== 1.0.2 (B, printing): one quiet link at the panel's foot, beside "דיווח על טעות או תקלה" (no new button on the model's view).
      // It builds a clean print page #tm-print: the plugin's name and the current place or view (the open card's title, else the marked
      // button), the view as a picture (one frame rendered and the canvas read with toDataURL right after it, in the same task: the
      // drawing buffer is not kept), and, when a card is open, its text (the brackets small) with its sources' names below. @media print
      // (ui_CSS) hides everything else; A4 landscape. Inside Otzaria (api.md): a small choice - ui.print (the system's dialog) or
      // ui.exportPdf ("שמור בשם") - called straight from the button's click (both need the user's own gesture, no permission; no timeout of
      // ours: sdk.md excludes them), with the page size given as parameters (@page is not honoured there). Outside Otzaria: window.print().
      // The print page goes when the print is done or cancelled. =====
      {
        let pg = null, busy = false;
        const PR_OPTS = { pageSize: "a4", orientation: "landscape", marginMm: 10, printBackgrounds: true };
        const inOtz = () => typeof window.Otzaria !== "undefined" && !!window.Otzaria && typeof window.Otzaria.call === "function";
        const drop = () => {
          if (pg) {
            pg.remove();
            pg = null;
          }
        };
        const curName = () => {
          if (xOpen && xTitle.textContent.trim()) return xTitle.textContent.trim();
          if (cardSpr && cardTitle.textContent.trim()) return cardTitle.textContent.trim();
          const on = btns.concat(placeBtns).find((b) => b.classList.contains("on"));
          return on ? on.textContent.replace(/\d+$/, "").trim() : "";
        };
        const build = () => {
          drop();
          let url = "";
          try {
            ctx.renderer.render(ctx.scene, ctx.camera);
            url = ctx.renderer.domElement.toDataURL("image/jpeg", 0.9);
          } catch (e) {
            console.warn("[ui.js] print picture: " + (e && e.message ? e.message : e));
          }
          const name = curName();
          pg = document.createElement("div");
          pg.id = "tm-print";
          const h = document.createElement("h1");
          h.textContent = name || "בית המקדש הראשון";   // 1.1.0 (the user): one title - the place's name (the plugin's name is in the credit)
          pg.appendChild(h);
          if (/^data:image\/(?:jpeg|png)/.test(url) && url.length > 64) {
            const img = document.createElement("img");
            img.alt = name || "בית המקדש הראשון";
            img.src = url;
            pg.appendChild(img);
          }
          const credit = () => {   // 1.1.0 (the user): a link to the plugin in Otzaria
            const cr = document.createElement("div");
            cr.className = "cr";
            cr.appendChild(document.createTextNode("הודפס מתוך תוסף ״בית שני״ לאוצריא — "));
            const a = document.createElement("a");
            a.href = "otzaria://open/plugin/com.beit-hamikdash.3d-model";
            a.textContent = "לפתיחת התוסף באוצריא";
            cr.appendChild(a);
            return cr;
          };
          pg.appendChild(credit());
          const tb = xOpen ? xBody : cardSpr ? cardBody : null, tr = xOpen ? xRefs : cardSpr ? cardRefs : null;
          const raw = tb && typeof tb.__raw === "string" ? tb.__raw.trim() : null;   // 1.9.1: the card's own text - its paragraphs and bold
          const body = raw != null ? raw : tb ? String(tb.textContent || "").trim() : "";
          if (body) {
            // 1.0.6 (the user): the card on a page of its own, attached: its title, its text and each source with its link to Otzaria
            const p2 = document.createElement("div");
            p2.className = "pg2";
            const tx = document.createElement("div");
            tx.className = "tx";
            if (raw != null) ui_fillRich(tx, body); else ui_fillSrc(tx, body);   // the brackets small, as in the card
            p2.appendChild(tx);
            const as = tr ? Array.from(tr.querySelectorAll("a")).filter((a) => String(a.textContent || "").trim()) : [];
            if (as.length) {
              const rs = document.createElement("div");
              rs.className = "rs";
              rs.appendChild(document.createTextNode("מקורות: "));
              as.forEach((a, k) => {
                const r = a.__ref, l = document.createElement("a");
                l.textContent = String(a.textContent).trim();
                if (r && r.book != null && r.index != null) l.href = "otzaria://open/book/" + r.book + "?index=" + r.index;
                if (k) rs.appendChild(document.createTextNode(" · "));
                rs.appendChild(l);
              });
              p2.appendChild(rs);
            }
            p2.appendChild(credit());
            pg.appendChild(p2);
          }
          document.body.appendChild(pg);
          return pg;
        };
        const fileName = () => ("בית שני" + (curName() ? " - " + curName() : "")).replace(/[\\/:*?"<>|\u0000-\u001f]/g, " ").replace(/\s+/g, " ").trim().slice(0, 100);
        const plink = document.createElement("button");
        plink.type = "button";
        plink.id = "tm-print-link";
        plink.textContent = "הדפסה";
        plink.title = "הדפסה או שמירה כ-PDF";
        topbarAdd(plink, 30, "print", "הדפסה");
        // inside Otzaria: the choice
        const pdlg = document.createElement("div");
        pdlg.id = "tm-printdlg";
        pdlg.setAttribute("role", "dialog");
        pdlg.setAttribute("aria-label", "הדפסה או שמירה כ-PDF");
        const pbox = document.createElement("div");
        pbox.className = "box";
        const pt = document.createElement("div");
        pt.className = "t";
        pt.textContent = "הדפסה או שמירה כ-PDF";
        const pn = document.createElement("div");
        pn.textContent = "תמונת המבט ושם המקום; וכשהסבר פתוח — גם ההסבר ומקורותיו.";
        const pbb = document.createElement("div");
        pbb.className = "b";
        const bPrint = document.createElement("button");
        bPrint.type = "button";
        bPrint.className = "y";
        bPrint.textContent = "הדפסה";
        const bPdf = document.createElement("button");
        bPdf.type = "button";
        bPdf.textContent = "שמירה כ-PDF";
        const bNo = document.createElement("button");
        bNo.type = "button";
        bNo.textContent = "ביטול";
        pbb.appendChild(bPrint);
        pbb.appendChild(bPdf);
        pbb.appendChild(bNo);
        pbox.appendChild(pt);
        pbox.appendChild(pn);
        pbox.appendChild(pbb);
        pdlg.appendChild(pbox);
        document.body.appendChild(pdlg);
        const closeP = () => {
          pdlg.style.display = "none";
          try { if (pdlg.contains(document.activeElement)) document.activeElement.blur(); } catch (_) {}
          if (!busy) drop();
        };
        // the call is made at once, inside the click (the user's gesture); then the choice closes and the page waits for the answer
        const runOtz = (method, params) => {
          if (busy) return;
          busy = true;
          bPrint.disabled = bPdf.disabled = true;
          let p;
          try {
            p = window.Otzaria.call(method, params);
          } catch (e) {
            p = Promise.resolve({ success: false, error: { message: e && e.message ? e.message : String(e) } });
          }
          pdlg.style.display = "none";
          Promise.resolve(p).then((res) => {
            if (res && res.success === false) {
              const code = res.error ? res.error.code || res.error.message || "" : "";
              if (code) console.warn("[ui.js] " + method + ": " + code);
              tmToast(code === "error.conflict" ? "חלון אחר פתוח כעת, נסו שוב אחריו" : method === "ui.exportPdf" ? "השמירה לא נפתחה, נסו שוב" : "ההדפסה לא נפתחה, נסו שוב");
            } else if (method === "ui.exportPdf" && res && res.data && res.data.saved) {
              tmToast("נשמר" + (res.data.name ? ": " + res.data.name : ""));
            }
          }, (e) => {
            console.warn("[ui.js] " + method + ": " + (e && e.message ? e.message : e));
            tmToast("ההדפסה לא נפתחה, נסו שוב");
          }).then(() => {
            busy = false;
            bPrint.disabled = bPdf.disabled = false;
            drop();
          });
        };
        bPrint.addEventListener("click", () => runOtz("ui.print", Object.assign({ jobName: fileName() }, PR_OPTS)));
        // 1.0.4 (the user's picture): in Otzaria 0.9.98.x ui.exportPdf opens a FOLDER picker and puts fileName into its folder box, which then
        // fails with "Path does not exist" - so no fileName: the person picks a folder and Otzaria names the file
        bPdf.addEventListener("click", () => runOtz("ui.exportPdf", Object.assign({ title: "שמירה כ-PDF" }, PR_OPTS)));
        bNo.addEventListener("click", closeP);
        pdlg.addEventListener("click", (e) => { if (e.target === pdlg) closeP(); });
        pdlg.addEventListener("keydown", (e) => {
          e.stopPropagation();
          if (e.key === "Escape" || e.key === "Esc") closeP();
        });
        pdlg.addEventListener("keyup", (e) => e.stopPropagation());
        plink.addEventListener("click", () => {
          if (busy) return;
          if (inOtz()) {
            build();   // the picture of the view as it is now, before the choice covers it
            bPrint.disabled = bPdf.disabled = false;
            pdlg.style.display = "flex";
            try { bPrint.focus(); } catch (_) {}
            return;
          }
          // outside Otzaria: the browser's own print, once the picture is decoded
          const page = build();
          const img = page.querySelector("img");
          let done = false;
          const fin = () => {
            if (done) return;
            done = true;
            window.removeEventListener("afterprint", fin);
            drop();
          };
          const go = () => {
            window.addEventListener("afterprint", fin);
            try { window.print(); } catch (_) {}
            setTimeout(fin, 1000);
          };
          const dec = img && typeof img.decode === "function" ? img.decode().catch(() => {}) : Promise.resolve();
          Promise.race([dec, new Promise((r) => setTimeout(r, 1500))]).then(go);
        });
      }
      // ===== 1.0.2 (item 1, the user: "התוסף בחנות כבר"): a report from inside the plugin. The plugin is in the Otzaria store, so
      // feedback.report (api.md: no permission; Otzaria shows its own confirmation with a preview; returns 'sent' | 'queued' | 'cancelled';
      // details up to 5000 characters; reportType bug | crash | content | other) reaches its developer. One quiet link at the panel's foot opens a
      // small form: the kind, the text and "שלח"; the details get the version, the view or the open card, the camera and the readings now
      // chosen. Outside Otzaria (no window.Otzaria.call: the standalone HTML file, a browser) there is no link. =====
      if (typeof window.Otzaria !== "undefined" && window.Otzaria && typeof window.Otzaria.call === "function") {
        const RT = [["content", "טעות במקור"], ["bug", "תקלה"], ["other", "הצעה"]];
        const link = document.createElement("button");
        link.type = "button";
        link.id = "tm-report-link";
        link.textContent = "דיווח";
        link.title = "דיווח על טעות או תקלה";
        topbarAdd(link, 40, "report", "דיווח");
        const dlg = document.createElement("div");
        dlg.id = "tm-report";
        dlg.setAttribute("role", "dialog");
        dlg.setAttribute("aria-label", "דיווח על טעות או תקלה");
        const box = document.createElement("div");
        box.className = "box";
        const hd = document.createElement("div");
        hd.className = "t";
        hd.textContent = "דיווח על טעות או תקלה";
        const ty = document.createElement("div");
        ty.className = "ty";
        let kind = "content";
        const tyBtns = RT.map(([k, label]) => {
          const b = document.createElement("button");
          b.type = "button";
          b.textContent = label;
          b.addEventListener("click", () => { kind = k; for (const o of tyBtns) o.classList.toggle("on", o === b); });
          ty.appendChild(b);
          return b;
        });
        tyBtns[0].classList.add("on");
        // which house the report is about - required, none marked at first (the user: "וללא אפשרות דיווח כלשהו בלי סימון")
        const HOUSES = [["b1", "בית ראשון"], ["b2", "בית שני"], ["both", "שני בתי המקדש"]];
        const hq = document.createElement("div");
        hq.className = "n";
        hq.textContent = "על איזה בית הדיווח? (חובה)";
        const hs = document.createElement("div");
        hs.className = "ty";
        hs.setAttribute("role", "radiogroup");
        hs.setAttribute("aria-label", "על איזה בית הדיווח");
        let house = null;
        const hBtns = HOUSES.map(([k, label]) => {
          const b = document.createElement("button");
          b.type = "button";
          b.textContent = label;
          b.setAttribute("role", "radio");
          b.setAttribute("aria-checked", "false");
          b.addEventListener("click", () => {
            house = k;
            for (const o of hBtns) { o.classList.toggle("on", o === b); o.setAttribute("aria-checked", o === b ? "true" : "false"); }
          });
          hs.appendChild(b);
          return b;
        });
        const clearHouse = () => { house = null; for (const o of hBtns) { o.classList.remove("on"); o.setAttribute("aria-checked", "false"); } };
        const ta = document.createElement("textarea");
        ta.maxLength = 3500;
        ta.placeholder = "מה לא נכון, ואיפה? (למשל: המקור, המידה או הכפתור)";
        ta.setAttribute("aria-label", "תוכן הדיווח");
        const note = document.createElement("div");
        note.className = "n";
        note.textContent = "יצורפו: גרסת התוסף, המבט או ההסבר הפתוח, והשיטות שנבחרו.";
        const bb = document.createElement("div");
        bb.className = "b";
        const send = document.createElement("button");
        send.type = "button";
        send.className = "y";
        send.textContent = "שלח";
        const cancel = document.createElement("button");
        cancel.type = "button";
        cancel.textContent = "ביטול";
        bb.appendChild(send);
        bb.appendChild(cancel);
        box.appendChild(hd);
        box.appendChild(hq);
        box.appendChild(hs);
        box.appendChild(ty);
        box.appendChild(ta);
        box.appendChild(note);
        box.appendChild(bb);
        dlg.appendChild(box);
        document.body.appendChild(dlg);
        const closeDlg = () => {
          dlg.style.display = "none";
          try { if (dlg.contains(document.activeElement)) document.activeElement.blur(); } catch (_) {}
        };
        link.addEventListener("click", () => {
          dlg.style.display = "flex";
          send.disabled = false;
          try { ta.focus(); } catch (_) {}
        });
        cancel.addEventListener("click", closeDlg);
        dlg.addEventListener("click", (e) => { if (e.target === dlg) closeDlg(); });
        // typing in the form never turns the model (the arrow keys, + / -) and never reaches the presentation's keys; Esc closes it
        dlg.addEventListener("keydown", (e) => {
          e.stopPropagation();
          if (e.key === "Escape" || e.key === "Esc") closeDlg();
        });
        dlg.addEventListener("keyup", (e) => e.stopPropagation());
        // what the report is about, for the developer: the version, the open card or the marked view / place, the camera, the readings
        const context = () => {
          const L = [];
          const verEl = document.getElementById("version");
          const ver = ui_bootVersion || (verEl && verEl.textContent ? verEl.textContent.replace(/^v/, "") : "");
          L.push("תוסף: בית שני");
          L.push("גרסה: " + (ver || "לא ידועה"));
          if (xOpen) L.push("הסבר פתוח: " + xTitle.textContent);
          if (cardSpr) L.push("תווית פתוחה: " + cardTitle.textContent);
          const on = btns.concat(placeBtns).find((b) => b.classList.contains("on"));
          if (on) L.push("מבט / מקום: " + on.textContent.replace(/\d+$/, "").trim());
          try {
            const r1 = (v) => [v.x, v.y, v.z].map((n) => Math.round(n * 10) / 10).join(", ");
            L.push("מצלמה: " + r1(ctx.camera.position) + " ← " + r1(ctx.controls.target));
          } catch (_) {}
          const chosen = OPS.filter((r) => !r.disabled && r.cur != null).map((r) => (r.short || r.cap) + ": " + opsChip(r, r.cur));
          if (chosen.length) L.push("שיטות: " + chosen.join(" · "));
          return L.join("\n");
        };
        send.addEventListener("click", async () => {
          const text = ta.value.trim();
          if (!house) {
            tmToast("סמנו על איזה בית הדיווח");
            try { hBtns[0].focus(); } catch (_) {}
            return;
          }
          if (!text) {
            tmToast("כתבו מה לדווח");
            try { ta.focus(); } catch (_) {}
            return;
          }
          send.disabled = true;
          const hName = (HOUSES.find((h) => h[0] === house) || [null, ""])[1];
          const details = ("הבית: " + hName + "\n\n" + text + "\n\n---\n" + context()).slice(0, 5000);
          let res = null;
          try {
            res = await window.Otzaria.call("feedback.report", { details, reportType: kind });
          } catch (e) {
            res = { success: false, error: { message: e && e.message ? e.message : String(e) } };
          }
          send.disabled = false;
          const st = typeof res === "string" ? res : res && typeof res.data === "string" ? res.data : null;
          if (st === "sent" || st === "queued") {
            tmToast(st === "sent" ? "הדיווח נשלח, תודה" : "יישלח כשיהיה חיבור");
            ta.value = "";
            clearHouse();
            closeDlg();
          } else if (st === "cancelled") {
            // Otzaria's own dialog was cancelled: the form stays as it was, nothing to say
          } else {
            // 1.0.2 (fix): the screen in plain Hebrew; the code (error.conflict, error.internal ...) goes to the console
            const code = res && res.error ? res.error.code || res.error.message || "" : "";
            if (code) console.warn("[ui.js] feedback.report: " + code);
            tmToast(code === "error.conflict" ? "הדיווח לא נשלח: חלון אישור אחר פתוח" : "הדיווח לא נשלח, נסו שוב מאוחר יותר");
          }
        });
      }
      // ===== 1.0.1-K: custom tooltips (the user: "בריחוף על כפתורי המצפן צריך להיות הסבר מה הם עושים") =====
      // Any element with data-tip - or a title, moved into data-tip on the first hover so the browser's own tooltip does not double it
      // (the presentation's buttons, the burger) - shows its short Hebrew sentence after 350 ms of hover, above it (below it near the
      // top edge), inside the window. On touch a long press (500 ms without moving) shows it for 3 s, and the click that ends that long
      // press is swallowed (a long press asks "what is this?", it does not press).
      const tipEl = document.createElement("div");
      tipEl.id = "tm-tip";
      tipEl.setAttribute("role", "tooltip");
      document.body.appendChild(tipEl);
      const tip = (el, text) => {
        if (!el || !text || typeof el.setAttribute !== "function") return el;
        try {
          el.setAttribute("data-tip", String(text));
          if (el.removeAttribute) el.removeAttribute("title");
          if (String(el.textContent || "").trim().length <= 2) el.setAttribute("aria-label", String(text));   // an icon button
        } catch (_) {}
        return el;
      };
      {
        let tipFor = null, tipTimer = null, hideTimer = null, lpTimer = null, lp = null, swallow = null, swallowT = null;
        const tipTarget = (node) => {
          for (let n = node; n && n.nodeType === 1 && n !== document.body; n = n.parentNode) {
            if (n.hasAttribute && (n.hasAttribute("data-tip") || n.hasAttribute("title"))) return n;
          }
          return null;
        };
        const textOf = (el) => {
          let t = el.getAttribute("data-tip");
          if (!t) {
            const ti = el.getAttribute("title");
            if (ti) {
              el.setAttribute("data-tip", ti);
              el.removeAttribute("title");
              t = ti;
            }
          }
          return t;
        };
        const hideTip = () => {
          clearTimeout(tipTimer);
          clearTimeout(hideTimer);
          tipTimer = hideTimer = null;
          tipEl.style.display = "none";
          tipFor = null;
        };
        const showTip = (el) => {
          const text = el && el.isConnected !== false ? textOf(el) : null;
          if (!text) return;
          ui_fillSrc(tipEl, text);
          tipEl.style.left = "0px";
          tipEl.style.top = "0px";
          tipEl.style.display = "block";
          const r = el.getBoundingClientRect(), tw = tipEl.offsetWidth, th = tipEl.offsetHeight, W = window.innerWidth, H = window.innerHeight;
          const x = Math.max(6, Math.min(W - tw - 6, r.left + r.width / 2 - tw / 2));
          let y = r.top - th - 8;
          if (y < 6) y = Math.min(H - th - 6, r.bottom + 8);
          tipEl.style.left = x.toFixed(0) + "px";
          tipEl.style.top = y.toFixed(0) + "px";
          tipFor = el;
        };
        document.addEventListener("pointerover", (e) => {
          if (e.pointerType === "touch") return;
          const el = tipTarget(e.target);
          if (el === tipFor && el) return;
          hideTip();
          if (!el || !textOf(el)) return;
          tipTimer = setTimeout(() => showTip(el), 350);
        }, true);
        document.addEventListener("pointerout", (e) => {
          if (e.pointerType === "touch") return;
          const el = tipTarget(e.target);
          if (!el) return;
          const to = e.relatedTarget;
          if (to && el.contains && el.contains(to)) return;
          hideTip();
        }, true);
        document.addEventListener("pointerdown", (e) => {
          clearTimeout(lpTimer);
          lp = null;
          // 1.0.1-K review (ui-5): a new press disarms the swallow of an earlier long press - Chromium ends a long touch with a
          // contextmenu / long-tap and NO click, and the flag then ate the user's next real tap on that button
          swallow = null;
          clearTimeout(swallowT);
          if (e.pointerType !== "touch") {
            hideTip();
            return;
          }
          const el = tipTarget(e.target);
          if (!el) return;
          lp = { x: e.clientX, y: e.clientY };
          lpTimer = setTimeout(() => {
            lp = null;
            showTip(el);
            swallow = el;
            clearTimeout(hideTimer);
            hideTimer = setTimeout(hideTip, 3000);
          }, 500);
        }, true);
        document.addEventListener("pointermove", (e) => {
          if (lp && e.pointerType === "touch" && Math.hypot(e.clientX - lp.x, e.clientY - lp.y) > 10) {
            clearTimeout(lpTimer);
            lp = null;
          }
        }, true);
        for (const ev of ["pointerup", "pointercancel"]) {
          document.addEventListener(ev, (e) => {
            if (e.pointerType === "touch") {
              clearTimeout(lpTimer);
              lp = null;
              // the click that ends a long press comes right after its pointerup; if none comes, the swallow ends 400 ms later
              // (1.0.1-K review, ui-5; 400 ms = model choice)
              if (swallow) {
                clearTimeout(swallowT);
                swallowT = setTimeout(() => { swallow = null; }, 400);
              }
            }
          }, true);
        }
        document.addEventListener("click", (e) => {
          const s = swallow;
          swallow = null;
          if (s && s.contains && s.contains(e.target)) {
            e.preventDefault();
            e.stopPropagation();
          }
        }, true);
        window.addEventListener("blur", hideTip);
        document.addEventListener("scroll", hideTip, true);
        tip(burger, "הצג או הסתר את לוח הבקרה (המבטים, המקומות, השיטות והמקורות)");
      }
      // ===== camera steps (the nav buttons, the arrow keys, the compass) =====
      // 1.0.1-L (L.49, the user: "מהירות הסיבוב במודל 360 הוא מהיר מדי כברירת מחדל - האט אותו, וסיבוב איטי השאר כך"): the turn step 0.045 -> 0.025 rad,
      // the tilt step 0.035 -> 0.02 rad and the hold's repeat of the two turn buttons 40 -> 50 ms: 64 -> 29 degrees a second while held (a drag:
      // rotateSpeed 0.9 -> 0.5, 90-entry.js); "סיבוב איטי" (autoRotateSpeed 0.4) is unchanged
      // 1.0.1-L (Part 7, U1): indoors (ctx.camIndoors, 90-entry.js) the buttons and the keys turn the view round the camera's own place, as the drag does
      const orbitBy = (dir) => {
        ctx.camFlyStop && ctx.camFlyStop();   // CAM_219 (2): a nav button or key in a flight ends it, and acts at once
        const cam = ctx.camera, tg = ctx.controls.target;
        if (ctx.camIndoors && ctx.camIndoors()) {
          const dx = tg.x - cam.position.x, dz = tg.z - cam.position.z, a = dir * 0.025, c = Math.cos(a), s2 = Math.sin(a);
          tg.x = cam.position.x + dx * c + dz * s2;
          tg.z = cam.position.z - dx * s2 + dz * c;
          ctx.controls.update();
          return;
        }
        const ox = cam.position.x - tg.x, oz = cam.position.z - tg.z, a = dir * 0.025, c = Math.cos(a), s2 = Math.sin(a);
        cam.position.x = tg.x + ox * c + oz * s2;
        cam.position.z = tg.z - ox * s2 + oz * c;
        ctx.controls.update();
      };
      // 1.0.1-K: up / down - the camera rises or sinks around the target within the controls' polar limits
      const tiltBy = (dir) => {
        ctx.camFlyStop && ctx.camFlyStop();   // CAM_219 (2): a nav button or key in a flight ends it, and acts at once
        const cam = ctx.camera, c = ctx.controls, tg = c.target;
        const off = cam.position.clone().sub(tg);
        if (!(off.length() > 0)) return;
        const sph = new Spherical().setFromVector3(off);
        if (ctx.camIndoors && ctx.camIndoors()) {   // 1.0.1-L (Part 7, U1): the head turns up and down, the camera stays
          sph.phi = Math.max(0.06, Math.min(Math.PI - 0.06, sph.phi - dir * 0.02));
          off.setFromSpherical(sph);
          c.maxPolarAngle = Math.max(c.maxPolarAngle, sph.phi + 1e-4);
          tg.copy(cam.position).sub(off);
          c.update();
          return;
        }
        sph.phi = Math.max(c.minPolarAngle || 0.06, Math.min(c.maxPolarAngle || Math.PI * 0.495, sph.phi - dir * 0.02));
        off.setFromSpherical(sph);
        cam.position.copy(tg).add(off);
        c.update();
      };
      const zoomBy = (f) => {
        ctx.camFlyStop && ctx.camFlyStop();   // CAM_219 (2): a nav button or key in a flight ends it, and acts at once
        const cam = ctx.camera, tg = ctx.controls.target;
        const off = cam.position.clone().sub(tg);
        off.setLength(Math.min(ctx.controls.maxDistance || 2200, Math.max(ctx.controls.minDistance || 2, off.length() * f)));
        cam.position.copy(tg).add(off);
        ctx.controls.update();
      };
      // 1.0.1-K: turn the view to a heading (the compass letters). az = atan2(camera - target) in x / z: 0 = the camera south of the
      // target, looking north (north up on the compass); -PI/2 looking east, PI looking south, PI/2 looking west. Eased over 0.65 s;
      // a drag on the model stops it.
      let turnAnim = null;
      const turnTo = (azT) => {
        ctx.camFlyStop && ctx.camFlyStop();   // CAM_219 (2): a nav button or key in a flight ends it, and acts at once
        const cam = ctx.camera, tg = ctx.controls.target;
        const az0 = Math.atan2(cam.position.x - tg.x, cam.position.z - tg.z);
        let d = azT - az0;
        while (d > Math.PI) d -= 2 * Math.PI;
        while (d < -Math.PI) d += 2 * Math.PI;
        turnAnim = Math.abs(d) < 1e-3 ? null : { t0: performance.now(), dur: 650, az0, d, look: !!(ctx.camIndoors && ctx.camIndoors()) };
      };
      ctx.renderer.domElement.addEventListener("pointerdown", () => { turnAnim = null; });
      ctx.animated.push(function() {
        if (!turnAnim) return;
        if (ctx.camFlying && ctx.camFlying()) { turnAnim = null; return; }   // CAM_219 (2): a flight that began in the turn takes the view (the turn bent it, then it snapped)
        const cam = ctx.camera, tg = ctx.controls.target;
        const k = Math.min(1, (performance.now() - turnAnim.t0) / turnAnim.dur), e = k < 0.5 ? 2 * k * k : 1 - Math.pow(-2 * k + 2, 2) / 2;
        const az = turnAnim.az0 + turnAnim.d * e, rh = Math.hypot(cam.position.x - tg.x, cam.position.z - tg.z);
        if (turnAnim.look) {   // 1.0.1-L (Part 7, U1)
          tg.x = cam.position.x - Math.sin(az) * rh;
          tg.z = cam.position.z - Math.cos(az) * rh;
        } else {
          cam.position.x = tg.x + Math.sin(az) * rh;
          cam.position.z = tg.z + Math.cos(az) * rh;
        }
        cam.lookAt(tg);
        if (k >= 1) turnAnim = null;
      });
      // ===== compass (1.0.1-K: four letters; a click on a letter turns the view toward it) =====
      const compass = document.createElement("div");
      compass.id = "tm-compass";
      tip(compass, "מצפן: החץ האדום והאות צ׳ מראים לאן הצפון במבט הנוכחי. לחיצה על אות מפנה את המבט לכיוון שלה.");
      const rotor = document.createElement("div");
      rotor.id = "tm-rotor";
      const arrow = document.createElement("div");
      arrow.className = "a";
      arrow.textContent = "▲";
      rotor.appendChild(arrow);
      const DIRS = [
        // [letter, name, x, y in the 56 px rotor, the heading to turn to]
        ["צ", "צפון", 28, 9, 0],
        ["מז", "מזרח", 47, 28, -Math.PI / 2],
        ["ד", "דרום", 28, 47, Math.PI],
        ["מע", "מערב", 9, 28, Math.PI / 2]
      ];
      const dirEls = [];
      for (const [letter, name, x, y, az] of DIRS) {
        const d = document.createElement("div");
        d.className = "d" + (letter === "צ" ? " n" : "");
        d.textContent = letter;
        d.style.left = x + "px";
        d.style.top = y + "px";
        d.setAttribute("role", "button");
        tip(d, name + " — לחץ כדי להפנות את המבט " + (name === "צפון" ? "צפונה" : name === "דרום" ? "דרומה" : name === "מזרח" ? "מזרחה (אל פתח הבית)" : "מערבה (אל קודש הקדשים)") + "; הסיבוב סביב מרכז המבט, בלי לשנות את הגובה והמרחק.");
        d.addEventListener("click", (e) => {
          e.stopPropagation();
          turnTo(az);
        });
        rotor.appendChild(d);
        dirEls.push(d);
      }
      compass.appendChild(rotor);
      document.body.appendChild(compass);
      // ===== nav buttons =====
      const nav = document.createElement("div");
      nav.id = "tm-nav";
      let resetAllBtn = null;
      {
        const mk = (txt, ttl, fn, rep) => {
          const b = document.createElement("button");
          b.type = "button";
          b.textContent = txt;
          tip(b, ttl);
          let iv = null;
          const stop = () => {
            if (iv) {
              clearInterval(iv);
              iv = null;
            }
          };
          b.addEventListener("pointerdown", (e) => {
            e.preventDefault();
            stop();
            fn();
            iv = setInterval(fn, rep || 40);
          });
          for (const ev of ["pointerup", "pointerleave", "pointercancel"]) b.addEventListener(ev, stop);
          nav.appendChild(b);
          return b;
        };
        mk("⟲", "סובב את המבט שמאלה סביב מרכזו (החזק להמשך). גם: מקש חץ שמאלה, או גרירה במודל.", () => orbitBy(-1), 50);
        mk("⟳", "סובב את המבט ימינה סביב מרכזו (החזק להמשך). גם: מקש חץ ימינה, או גרירה במודל.", () => orbitBy(1), 50);
        mk("+", "קרב את המבט (החזק להמשך). גם: גלגלת העכבר, צביטה או גלילה בשתי אצבעות על משטח המגע, ומקש +.", () => zoomBy(0.97));
        mk("−", "הרחק את המבט (החזק להמשך). גם: גלגלת העכבר, צביטה או גלילה בשתי אצבעות על משטח המגע, ומקש −.", () => zoomBy(1.03));
        const sp = document.createElement("span");
        sp.className = "sp";
        nav.appendChild(sp);
        const rb = document.createElement("button");
        rb.type = "button";
        rb.id = "tm-nav-ruler";
        rb.textContent = "📏";
        tip(rb, "מדידה באמות: לחץ על שתי נקודות במודל, והמרחק ביניהן יוצג (גם האופקי והגובה). לחיצה נוספת על הכפתור מסיימת.");
        rb.addEventListener("click", () => mSet(!mOn));
        nav.appendChild(rb);
        // 1.6.0 (stage 6, Beit Sheni): walk mode (90-entry.js ent_walkModeSet) and the live section (ent_sectionSet)
        {
          // 1.9.1: the pills' frame() lives in another block; a call to it from here threw a ReferenceError (and stopped the rows that open a section)
          const pillsFrame = () => { try { const f = ctx.shared.__pillsFrame; if (typeof f === "function") f(true); } catch (_) {} };
          const wb = document.createElement("button");
          wb.type = "button";
          wb.id = "tm-nav-walk";
          wb.textContent = "🚶";
          tip(wb, "מצב הליכה: העין יורדת לגובה אדם ומביטה קדימה; העכבר לבדו מסובב את המבט (הלחיצה על הכפתור נועלת את העכבר למודל, Esc משחררת — ואז גרירה מסובבת), והמקשים W S A D (או ו ד ש ג, או החצים) הולכים ונעים הצידה. לחיצה נוספת — יציאה ממצב הליכה.");
          wb.addEventListener("click", () => { const w = ctx.shared.walkMode; if (!w) return; w.set(!w.on); wb.classList.toggle("on", !!w.on); pillsFrame(); });
          nav.appendChild(wb);
          const sg = document.createElement("span");
          sg.className = "tm-grp tm-sec";
          tip(sg, "חתך חי: מישור חיתוך שעובר במודל — כל מה שמדרום לו (בציר צפון–דרום) או ממזרח לו (בציר מזרח–מערב) נחתך, ורואים את הפנים כמו בחתך אדריכלי. הגרירה מזיזה את המישור; הכפתור מחליף ציר; ״חתך״ מפעיל ומכבה. פני החתך אינם ממולאים — בחירת מודל.");
          const sb = document.createElement("button");
          sb.type = "button";
          sb.className = "tm-txt";
          sb.textContent = "חתך";
          const sr = document.createElement("input");
          sr.type = "range";
          sr.min = "-70"; sr.max = "70"; sr.step = "0.5"; sr.value = "0";
          sr.className = "tm-range";
          const ax = document.createElement("button");
          ax.type = "button";
          ax.className = "tm-txt";
          const paintSec = () => {
            const S = ctx.shared.section || {};
            sb.classList.toggle("on", !!S.on);
            sr.disabled = !S.on;
            ax.textContent = S.axis === "x" ? "מזרח–מערב" : S.axis === "y" ? "גובה" : "צפון–דרום";
            // 1.9.1: a place may cut by height (the mesibah of the Rambam's reading - everything above its storey goes)
            if (S.axis === "x") { sr.min = "-95"; sr.max = "95"; } else if (S.axis === "y") { sr.min = "14"; sr.max = "130"; } else { sr.min = "-70"; sr.max = "70"; }
            wb.classList.toggle("on", !!(ctx.shared.walkMode || {}).on);   // 1.9.3
          };
          // 1.9.3 (as the First Temple plugin): switched on, the cut starts where the eye looks (it stood at the slider's last place, often far from the view)
          const center = (axis) => { const t = ctx.controls && ctx.controls.target; const c = t ? (axis === "x" ? t.x : axis === "y" ? t.y + 6 : t.z) : 0; return Math.max(+sr.min, Math.min(+sr.max, Math.round(c * 2) / 2)); };
          sb.addEventListener("click", () => { const S = ctx.shared.section; if (!S) return; if (!S.on) { paintSec(); const c = center(S.axis); sr.value = String(c); S.set(true, S.axis, c); } else S.set(false, S.axis, +sr.value); paintSec(); pillsFrame(); });
          sr.addEventListener("input", () => { const S = ctx.shared.section; if (!S || !S.on) return; S.set(true, S.axis, +sr.value); pillsFrame(); });
          // 1.9.2: the axis button goes round all three - south, east and the height (a plan; until 1.9.1 only the places used it)
          ax.addEventListener("click", () => { const S = ctx.shared.section; if (!S) return; const a = S.axis === "z" ? "x" : S.axis === "x" ? "y" : "z"; const t = ctx.controls && ctx.controls.target; const v = a === "y" ? Math.round(((t ? t.y : 40) + 6) * 2) / 2 : a === "x" ? Math.round((t ? t.x : 0) * 2) / 2 : Math.round((t ? t.z : 0) * 2) / 2; S.set(S.on, a, v); paintSec(); sr.value = String(v); pillsFrame(); });
          sg.appendChild(sb);
          sg.appendChild(sr);
          sg.appendChild(ax);
          nav.appendChild(sg);
          paintSec();
          // 1.9.0: a row of the opinions table may turn the section on (the cells' readings) - the box follows
          ctx.shared.sectionPaint = () => { paintSec(); const S = ctx.shared.section || {}; if (Number.isFinite(S.v)) sr.value = String(S.v); pillsFrame(); };
          ctx.shared.navRepaint = paintSec;   // 1.9.3 (as the First Temple plugin): "↺ החזר הכל" and the engine repaint the box
        }
        // 1.0.1-K (Yossi): the wall fade - on / off, and its distance
        const fs = ctx.shared.fadeState;
        const fadeBtn = document.createElement("button");
        fadeBtn.type = "button";
        fadeBtn.id = "tm-fade-toggle";
        fadeBtn.className = "tm-txt";
        // 1.0.2 (D): three states from the same button - "פועל" (the court and mount walls, as before; the default), "גם קיר מסתיר" (also a
        // wall of the house, the ulam, the chambers or the palace that hides what is looked at), "כבוי"; a click goes on to the next
        tip(fadeBtn, "טשטוש חומות: כשחומה עומדת בין המצלמה לבין מה שמביטים בו, היא נעשית שקופה למחצה — ונשארת נראית. לחיצה נוספת: גם קיר מסתיר — גם קיר של הבית, האולם, התאים או הארמון שמסתיר את מה שמביטים בו נעשה שקוף, וחוזר כשאינו מסתיר עוד. לחיצה נוספת: כבוי — החומות חוסמות את המבט כמו במציאות.");
        const grp = document.createElement("span");
        grp.className = "tm-grp";
        // 1.0.1-K review (ui-3): the far setting fades only walls that hide what is looked at (not those behind it) - the text says so
        tip(grp, "מרחק טשטוש: חומה שמסתירה את מה שמביטים בו מיטשטשת רק כשהיא בטווח הזה מן המצלמה (באמות). פחות — רק חומות קרובות; יותר — גם חומות רחוקות.");
        const cap = document.createElement("span");
        cap.className = "cap";
        cap.textContent = "מרחק טשטוש";
        const minus = document.createElement("button");
        minus.type = "button";
        minus.textContent = "−";
        tip(minus, "הקטן את מרחק הטשטוש: רק חומות קרובות יותר יהיו שקופות");
        const val = document.createElement("span");
        val.className = "v";
        const plus = document.createElement("button");
        plus.type = "button";
        plus.textContent = "+";
        tip(plus, "הגדל את מרחק הטשטוש: גם חומות רחוקות יותר יהיו שקופות כשהן מסתירות");
        grp.appendChild(cap);
        grp.appendChild(plus);
        grp.appendChild(val);
        grp.appendChild(minus);
        const paintFade = () => {
          fadeBtn.textContent = fs.on && fs.hide ? "טשטוש: גם קיר מסתיר" : "טשטוש חומות: " + (fs.on ? "פועל" : "כבוי");
          fadeBtn.classList.toggle("on", !!fs.on);
          val.textContent = fs.dist + " אמה";
          grp.classList.toggle("off", !fs.on);
          minus.disabled = fs.dist <= UI_FADE_STOPS[0];
          plus.disabled = fs.dist >= UI_FADE_STOPS[UI_FADE_STOPS.length - 1];
        };
        const stepDist = (dir) => {
          let i = UI_FADE_STOPS.indexOf(fs.dist);
          if (i < 0) i = UI_FADE_STOPS.findIndex((v) => v >= fs.dist);
          if (i < 0) i = UI_FADE_STOPS.length - 1;
          fs.dist = UI_FADE_STOPS[Math.max(0, Math.min(UI_FADE_STOPS.length - 1, i + dir))];
          lsSet("tm2.fade.dist", fs.dist);
          paintFade();
        };
        fadeBtn.addEventListener("click", () => {
          // פועל -> גם קיר מסתיר -> כבוי -> פועל
          if (fs.on && !fs.hide) fs.hide = true;
          else if (fs.on) { fs.on = false; fs.hide = false; }
          else fs.on = true;
          lsSet("tm2.fade.on", fs.on ? "1" : "0");
          lsSet("tm2.fade.hide", fs.hide ? "1" : "0");
          paintFade();
        });
        minus.addEventListener("click", () => stepDist(-1));
        plus.addEventListener("click", () => stepDist(1));
        paintFade();
        nav.appendChild(fadeBtn);
        nav.appendChild(grp);
        ctx.shared.fadeState.repaint = paintFade;
        // "↺ החזר הכל" - while anything of the on-model buttons is on (see the registry below)
        resetAllBtn = document.createElement("button");
        resetAllBtn.type = "button";
        resetAllBtn.id = "tm-reset-all";
        resetAllBtn.className = "tm-txt";
        resetAllBtn.textContent = "↺ החזר הכל";
        tip(resetAllBtn, "מחזיר את המודל למצבו הרגיל: סוגר את כל מה שנפתח או הוסר בכפתורים שעל המודל (הבית, קירות היציע, האולם, הנסרים, החתך והתצוגות שעל המודל) ומחזיר את הענן.");
        nav.appendChild(resetAllBtn);
        document.body.appendChild(nav);
      }
      if (ctx.camera && ctx.controls && ctx.controls.target) {
        let lastAz = null;
        ctx.animated.push(function() {
          const az = Math.atan2(
            ctx.camera.position.x - ctx.controls.target.x,
            ctx.camera.position.z - ctx.controls.target.z
          );
          // az = the clockwise screen angle of north (+z = south: the camera due south of the target gives 0deg and the "▲" points
          // straight up); the Second Temple's "+ 180" (ref-ui-bayit2.js) turned the needle to the south in this coordinate frame.
          // 1.0.1-K: the letters turn with the rotor and are turned back so they stay upright
          const deg = (az * 180 / Math.PI).toFixed(1);
          if (deg === lastAz) return;
          lastAz = deg;
          rotor.style.transform = "rotate(" + deg + "deg)";
          for (const d of dirEls) d.style.transform = "rotate(" + (-deg) + "deg)";
        });
      }
      // ===== 1.0.1-K: on-model buttons (FIXES-1.0.1-K.md 0.5b; the user: "הכפתור צריך להיות על המיצג ולא בתוכן הענינים") =====
      // Registry ctx.shared.modelButtons: { id, label, labelOn, title, anchor: [x,y,z] | () => [x,y,z] | null, maxDist (150), get, set,
      // layer? | layers? }. A pill is drawn per entry at the projected anchor while the anchor is given (a function may return null =
      // not now), in front of the camera, inside the view, closer than maxDist and its layer(s) visible; it reads labelOn while get() is
      // true and calls set(!get()) on a click; title is its tooltip. Build modules register their own entries (before or after the UI);
      // the UI registers the cloud and the four removals. Overlapping pills are pushed apart vertically. Internal extras (the UI's own
      // entries only): show() - an extra condition, scale() - a size factor.
      const MB = Array.isArray(ctx.shared.modelButtons) ? ctx.shared.modelButtons : (ctx.shared.modelButtons = []);
      {
        const visUp = (o) => {
          for (; o; o = o.parent) if (o.visible === false) return false;
          return true;
        };
        const hwTop = Array.isArray(CO.HOUSE_WALL) && CO.HOUSE_WALL.length ? CO.HOUSE_WALL[CO.HOUSE_WALL.length - 1] : 4;   // the house wall above the chambers' roof
        const HW2 = (typeof CO.HOUSE_W === "number" ? CO.HOUSE_W : 20) / 2;                                                   // the house's inner half width (I Kings 6:2)
        const midX = typeof CO.xKodeshE === "number" && typeof CO.xKodeshW === "number" ? (CO.xKodeshE + CO.xKodeshW) / 2 : -23.5;   // mid-kodesh
        const zYS = typeof CO.zHouseS === "number" ? CO.zHouseS : 27;                                                          // the chambers' south outer face
        const xYW = typeof CO.xHeiW === "number" ? CO.xHeiW : -80.5;                                                            // the chambers' west outer face
        const frT = fps.forestRoof && Array.isArray(fps.forestRoof.target) ? fps.forestRoof.target : [103, 21, 509.5];
        // fallback anchors, used only while ctx.shared.anchors (50-heichal.js / 60-palace.js) lacks the point - on the visible outside
        const ANCH_FB = {
          houseSouth: [midX, LVL.HEI + 26, HW2 + hwTop + 0.5],   // the house's south face above the chambers' roof (y 38)
          yatziaSouth: [midX, LVL.HEI + 7.5, zYS + 0.5],          // the chambers' south outer wall, at its middle storey
          ulamFront: [(typeof CO.xUlamE === "number" ? CO.xUlamE : 18.5) + 0.5, LVL.HEI + 26.5, 0],   // the ulam front above its doorway (1.0.1-L, L.59: 22 high, its lintel to 35; 50-heichal.js anchors.ulamFront y 38.5)
          forestRoof: [frT[0], frT[1] + 2, frT[2]]               // the roof of בית יער הלבנון
        };
        const anchorPt = (name) => {
          const a0 = ctx.shared.anchors && ctx.shared.anchors[name];
          let a = a0;
          try { if (typeof a0 === "function") a = a0(); } catch (_) { a = null; }
          if (Array.isArray(a) && a.length >= 3 && isFinite(a[0] + a[1] + a[2])) return a;
          if (a && typeof a.x === "number" && isFinite(a.x + a.y + a.z)) return [a.x, a.y, a.z];
          return ANCH_FB[name];
        };
        const camP = () => ctx.camera.position;
        const yatziaPts = [[0, 0, 0], [0, 0, 0], [0, 0, 0]];   // the chambers' south / north / west faces
        const has = (list) => cutList(list).length > 0;
        const reg = (b) => {
          if (!MB.some((x) => x && x.id === b.id)) MB.push(b);
        };
        // the cloud (1.0.19's button, now one of the pills; the removal asks first, as before)
        reg({
          id: "ui-cloud", label: "☁ הסר ענן", labelOn: "☁ החזר את הענן", removal: true,
          title: "קודש הקדשים מכוסה בענן במודל, מפני כבוד המקום (בחירת מודל). הסרת הענן מבקשת אישור.",
          anchor: [KKC.x, KKC.y, KKC.z], maxDist: 1e9, occlude: false,   // the cloud has its own ray test (cloudSeen)
          get: () => !cloudOn,
          set: (on) => { if (on) askRemoveCloud(() => setCloud(false)); else setCloud(true); },
          show: () => cloudSeen.show, scale: () => cloudSeen.scale
        });
        // the house: its south wall, its roof and the interior pieces on that side (ctx.cutaway) - seen from the south or from above
        if (has(ctx.cutaway)) reg({
          id: "ui-house", label: "פתח את ההיכל", labelOn: "סגור את ההיכל", removal: true, maxDist: 260,
          title: "פותח את ההיכל לצפייה בפנים: מסיר את הקיר הדרומי, את הגג ואת החלקים שבצד הדרום. כלי צפייה בלבד — ההיכל סגור לכתחילה.",
          anchor: () => {
            const a = anchorPt("houseSouth"), c = camP();
            if (ctx.shared.section && ctx.shared.section.on) return null;
            return c.z > a[2] - 1 || c.y > a[1] + 12 ? a : null;
          },
          get: () => cutOn, set: (on) => setCutaway(on)
        });
        // the chambers' outer walls, all three sides (ctx.yatziaCut): the pill sits on the side the camera looks at
        if (has(ctx.yatziaCut)) reg({
          id: "ui-yatzia", label: "הסר את קירות היציע", labelOn: "החזר את קירות היציע", removal: true, maxDist: 200,
          title: "מסיר את הכתלים החיצוניים של התאים (בדרום, בצפון ובמערב) כדי לראות את שלוש הקומות — חמש, שש ושבע אמות — והקורות הנחות על המגרעות; הגג נשאר. כלי צפייה בלבד: 'ויבן על קיר הבית יציע סביב' (מלכים א ו, ה–י).",
          anchor: () => {
            const a = anchorPt("yatziaSouth"), c = camP(), zf = Math.abs(a[2]);
            const side = c.z > zf - 1 ? 0 : c.z < -(zf - 1) ? 1 : c.x < xYW + 1 ? 2 : -1;
            if (side < 0) return null;
            const p = yatziaPts[side];   // reused arrays: no allocation per frame
            p[0] = side === 2 ? xYW - 0.5 : a[0];
            p[1] = a[1];
            p[2] = side === 0 ? zf : side === 1 ? -zf : 0;
            return p;
          },
          get: () => yatziaOpen, set: (on) => setYatziaCut(on)
        });
        // the ulam: its front wall with the doorway, and its roof (ctx.ulamCut) - seen from the east
        if (has(ctx.ulamCut)) reg({
          id: "ui-ulam", label: "פתח את האולם", labelOn: "סגור את האולם", removal: true, maxDist: 150,
          title: "מסיר את חזית האולם ואת גגו כדי לראות את יכין ובועז ואת פתח ההיכל. כלי צפייה בלבד — האולם סגור מלבד פתחו (מלכים א ו, ג; ז, כא).",
          anchor: () => {
            const a = anchorPt("ulamFront"), c = camP();
            return c.x > a[0] - 1 ? a : null;
          },
          get: () => ulamOpen, set: (on) => setUlamCut(on)
        });
        // the boards of the roofing of בית יער הלבנון (ctx.forestBoardsCut) - seen from above, with the palace layer on.
        // 1.0.1-K review (palace-courts-5): the tooltip follows the reading shown (a getter: the renderer reads b.title every frame and
        // re-sets the tip only when it changes; two constant strings, no allocation) - Rashi: without the 45 boards and the thin boards
        // the עבים, the small beams with their ledges and the upper storey are seen, his כרותות stay under the upper floor (60-palace.js
        // y 0..1, the floor 1..1.5); the second reading: without the boards and the stone roof, the כרותות on the pillars
        const BOARDS_TIP = {
          rashi: "מסיר את 45 נסרי הסיפון ואת הנסרים הדקים (מלכים א ז, ג–ד) — ונראים המרישין הקטנים ושקופיהם (רש״י ז, ד) והקומה העליונה; הכרותות שמעמוד לעמוד (רש״י ז, ב) נשארות מתחת לרצפתה. כלי צפייה בלבד.",
          metzudot: "מסיר את 45 הלוחות ואת גג האבן — ונראות הכרותות שעל העמודים: 'והם כרותות הארזים אשר על העמודים שהיו ארבעים וחמשה' (רלב״ג ז, ג). כלי צפייה בלבד.",
          // 1.0.1-L (L.20; verify-palace Follow-ups §2): the third reading
          mzd: "מסיר את 45 לוחות הארז של התקרה — ונראות הצלעות שמטור לטור והכרותות שעל העמודים: 'השכיבו צלעות ונסרים, להיות מחיצות הבית ממעל, ועל הצלעות ההם הניחו לוחות ארז, להיות לתקרה' (מצודת דוד ז, ג). כלי צפייה בלבד."
        };
        if (has(ctx.forestBoardsCut)) reg({
          id: "ui-boards", label: "הסר את הנסרים", labelOn: "החזר את הנסרים", removal: true, maxDist: 150, layer: "palace",
          get title() { return BOARDS_TIP[fhCur()] || BOARDS_TIP.rashi; },
          anchor: () => {
            const a = anchorPt("forestRoof"), c = camP();
            return c.y > a[1] - 2 ? a : null;
          },
          get: () => boardsOff, set: (on) => setBoardsOff(on)
        });
        // 1.0.1-L (L.90, the user: "כל פעם שיש הסרת תצוגה זה אמור להוביל לכך שהמסך יראה את התצוגה עצמה, לדוג' הסרת קירוי המסך אמור לעבור למבט מלמעלה"):
        // a table by pill id: on switching on, the camera flies to a view that shows what was revealed; on switching off it returns to where it was.
        // Only a click on the pill itself does this (revealPress, from pillFor): the presentation calls b.set or the shared objects directly, so
        // it does not fly; a removal stays only by the pill. fp = a fly point; cam() = a camera of this table (each checked in a picture: model
        // choice); own: the module's set() already flies there; the flight back here replaces any flight of its own (the section's to heichalSouth).
        const REVEAL = {   // Beit Sheni (1.5.0): every roof pill flies to a view from above of what it opened; back on closing
          "ui-cloud": { fp: "kodeshHakodashim" },
          "ui-house": { cam: () => ({ pos: [-30, 120, 70], target: [-32, 30, 0] }) },                           // from the south and above, into the opened house
          "mnt-stoa-roofs": { cam: () => ({ pos: [103, 430, 100], target: [103, 0, 82.5] }) },                   // the whole Mount from above
          "crt-lishkot-roofs": { cam: () => ({ pos: [0, 175, 2], target: [0, 10, 0] }) },                        // the court from above: both rows of chambers
          "hei-mesibah": { cam: () => ({ pos: [-40, 95, -115], target: [-40, 44, -30] }) },                      // from the north and above: the stairs and the corridor
          "hei-ulam": { cam: () => ({ pos: [34, 125, 0], target: [8, 30, 0] }) },                                 // from above the ulam
          "hei-ulam-front": { cam: () => ({ pos: [70, 43, 0], target: [7, 42, 0] }) }                              // 1.9.2: before the opened ulam, in its middle
        };
        const revealView = (id) => {
          const R = REVEAL[id];
          if (!R) return null;
          if (R.cam) return R.cam();
          return R.fp ? resolveFp(R.fp) : null;
        };
        const revealSaved = new Map();   // pill id -> the camera before it was switched on, in the order of switching
        // 1.0.1-L (the user: "כל קירוי שנפתח צריך להיסגר אחרי 30 שניות"): a roof opened by its pill closes by itself after 30 s, and the view returns
        const ROOF_PILLS = new Set(["ui-house", "ui-ulam", "ui-boards", "palaceKingRoofs", "palacePharaohRoof", "palaceThroneRoofs", "crt-gazit-roof", "mnt-lishka-roofs-n", "mnt-lishka-roofs-s",
          "hei-aliyot-open", "mnt-stoa-roofs", "crt-lishkot-roofs", "hei-mesibah", "hei-ulam", "hei-ulam-front"]);   // 1.2.3 (the user: "צריך להיסגר אוטו... כמו כל הקירויים שנפתחים")
        const roofTimers = new Map();
        const roofDisarm = (id) => { if (roofTimers.has(id)) { clearTimeout(roofTimers.get(id)); roofTimers.delete(id); } };
        const roofArm = (b) => {
          roofDisarm(b.id);
          if (!ROOF_PILLS.has(b.id)) return;
          roofTimers.set(b.id, setTimeout(() => {
            roofTimers.delete(b.id);
            if (!b.get()) return;
            try { revealPress(b); } catch (err) { console.warn("[ui.js] roof timer " + b.id + ":", err && err.message); }
            frame(true);
          }, 30000));
        };
        const revealGo = (id) => {
          const f = revealView(id);
          if (f) fly(f.pos, f.target);
        };
        const revealPress = (b) => {
          const id = b.id, R = REVEAL[id];
          const pose = { pos: ctx.camera.position.toArray(), target: ctx.controls.target.toArray() };
          const was = !!b.get();
          // the cloud's removal asks first: the flight comes with the answer
          if (id === "ui-cloud" && !was) {
            askRemoveCloud(() => {
              setCloud(false);
              revealSaved.delete(id);
              revealSaved.set(id, pose);
              revealGo(id);
              frame(true);
            });
            return;
          }
          b.set(!was);
          if (!R) return;
          const now = !!b.get();
          if (now && !was) {
            revealSaved.delete(id);
            revealSaved.set(id, pose);
            if (!R.own) revealGo(id);
            roofArm(b);
          } else if (!now && was) {
            roofDisarm(id);
            const back = revealSaved.get(id);
            revealSaved.delete(id);
            if (back) realFly(back.pos, back.target);
          }
        };
        // the renderer
        const PILL_FEATURE = { "hei-yatzia-section": "yatziaSection", wallLayers: "wallLayers", incenseAltarLayers: "incenseAltar.layers", palaceThroneAscent: "throne.ascent" };   // 1.0.1-L (L.27)
        const pills = new Map();   // entry -> { el, text, on, disp, x, y, sc, w, h }
        const pv = new Vector3(), pc = new Vector3();
        const pillFor = (b) => {
          let st = pills.get(b);
          if (st) return st;
          const el = document.createElement("button");
          el.type = "button";
          el.className = "tm-pill";
          if (b.id === "ui-cloud") el.id = "tm-cloud-btn";
          else if (b.id) el.setAttribute("data-mb", String(b.id));
          el.addEventListener("click", (e) => {
            e.stopPropagation();
            // 1.9.2 (the user: "בלחיצה על כל מתג הוא חייב לבטל את ההדגמות"): a pill stops every other running demonstration first (its own
            // still toggles); a pill marked keepDemos controls the running scene and leaves it
            if (!b.keepDemos && typeof ctx.shared.stopDemos === "function") ctx.shared.stopDemos(b.id);
            // 1.0.1-L (L.27): the feature's own pill cancels the place's 15-second timer; the user's state stays
            if (PILL_FEATURE[b.id]) autoOff.cancel(PILL_FEATURE[b.id]);
            try {
              revealPress(b);   // 1.0.1-L (L.90)
            } catch (err) {
              console.warn("[ui.js] model button " + b.id + ":", err && err.message);
            }
            frame(true);
          });
          document.body.appendChild(el);
          st = { el, text: null, on: null, disp: "none", x: -1, y: -1, sc: 1, w: 80, h: 24, tip: null, occ: null, occAt: 0 };
          pills.set(b, st);
          return st;
        };
        // a pill whose anchor is hidden behind a solid part of the model is not shown either (from the front, the ulam hides the house's
        // south face: no "פתח את הבית" floating on the ulam). A throttled ray test (every 6th frame per pill) against the large plain
        // meshes, as the cloud's; a faded (transparent) wall does not hide; a hit within 1.5 amot of the anchor does not count (an anchor
        // sits on its own face); an entry may opt out with occlude: false
        const oRay = new Raycaster(), oDir = new Vector3();
        let oTargets = null, oTargetsAt = -1e9, frameNo = 0;
        const bigMeshes = () => {
          const now = performance.now();
          if (oTargets && now - oTargetsAt < 4000) return oTargets;
          oTargetsAt = now;
          oTargets = [];
          const bb = new Box3(), sz = new Vector3();
          ctx.scene.traverse((o) => {
            if (!o.isMesh || o.isInstancedMesh || !o.geometry) return;
            for (let p = o; p; p = p.parent) if (p.name === "tm-kk-cloud" || p.name === "tm-measure") return;
            const pa = o.geometry.attributes && o.geometry.attributes.position;
            if (pa && pa.count > 30000) return;   // the terrain
            if (!o.geometry.boundingBox) o.geometry.computeBoundingBox();
            bb.copy(o.geometry.boundingBox).applyMatrix4(o.matrixWorld).getSize(sz);
            if (Math.max(sz.x, sz.y, sz.z) < 6) return;
            oTargets.push(o);
          });
          return oTargets;
        };
        const occluded = (a, wallsToo) => {
          const cam = ctx.camera.position;
          oDir.set(a[0] - cam.x, a[1] - cam.y, a[2] - cam.z);
          const L = oDir.length();
          if (!(L > 2)) return false;
          oRay.set(cam, oDir.multiplyScalar(1 / L));
          oRay.near = 0;
          oRay.far = L - 1.5;
          for (const hh of oRay.intersectObjects(bigMeshes(), false)) {
            const o = hh.object;
            if (!visUp(o)) continue;
            const m = Array.isArray(o.material) ? o.material[0] : o.material;
            // PILL_HOME_211: a wall that the fade shows see-through still hides the pill behind it (the user: the ulam's and the cloud's
            // pills "יצאו החוצה סתם" in the view of the Nikanor gate) - unless the pill is switched on (wallsToo = false: it must stay
            // within reach, to be switched off); glass and water never hid a pill
            if (m && m.visible !== false && m.transparent && m.opacity <= 0.5 && wallsToo && (o.userData.fade || o.userData.tmPass)) return true;
            if (m && (m.visible === false || (m.transparent && m.opacity <= 0.5))) continue;
            return true;
          }
          return false;
        };
        const layerVis = (l) => {
          const g = ctx.layers && ctx.layers[l];
          return !!g && visUp(g);
        };
        const scr = [0, 0];   // the screen point of place() (reused)
        const place = (b, st, force) => {
          if (!b || typeof b.get !== "function" || typeof b.set !== "function") return null;
          if (b.layer && !layerVis(b.layer)) return null;
          if (Array.isArray(b.layers)) for (const l of b.layers) if (!layerVis(l)) return null;
          if (typeof b.show === "function" && !b.show()) return null;
          let a = b.anchor;
          if (typeof a === "function") a = a();
          if (!Array.isArray(a) || a.length < 3 || !isFinite(a[0] + a[1] + a[2])) return null;
          const cam = ctx.camera;
          // PILL_HOME_211 (the user's picture of "לשכת הכלים": the great gate's pill hung in the air over a section that had cut the
          // gate away): a pill whose place is in the half that the live section removes is not shown
          try {
            const SC = ctx.shared.section;
            if (SC && SC.on && typeof SC.v === "number") { const ai = SC.axis === "x" ? 0 : SC.axis === "y" ? 1 : 2; if (a[ai] > SC.v) return null; }
          } catch (_) {}
          pv.set(a[0], a[1], a[2]);
          if (pv.distanceTo(cam.position) > (typeof b.maxDist === "number" ? b.maxDist : 150)) return null;
          pc.copy(pv).applyMatrix4(cam.matrixWorldInverse);
          if (pc.z > -0.5) return null;                       // behind the camera
          pv.project(cam);
          if (Math.abs(pv.x) > 0.96 || Math.abs(pv.y) > 0.94) return null;   // outside the view
          if (b.occlude !== false) {
            if (force || st.occ == null || frameNo - st.occAt >= 6) {
              let isOn = false;
              try { isOn = !!b.get(); } catch (_) { isOn = false; }
              st.occ = occluded(a, !isOn);   // PILL_HOME_211
              st.occAt = frameNo;
            }
            if (st.occ) return null;
          }
          scr[0] = (pv.x * 0.5 + 0.5) * window.innerWidth;
          scr[1] = (-pv.y * 0.5 + 0.5) * window.innerHeight;
          return scr;
        };
        const resetAll = () => {
          autoOff.flush();   // 1.0.1-L (L.27): what a place switched on goes back now (the tables of the ulam have no pill), and no timer stays
          try { placeLeave({}); } catch (_) {}   // VIEW_LEAVE_211: and the place's own layer or untimed feature
          for (const b of MB.slice()) {
            try {
              if (b && typeof b.get === "function" && typeof b.set === "function" && b.get()) b.set(false);
            } catch (_) {}
          }
          revealSaved.clear();   // 1.0.1-L (L.90)
          frame(true);
        };
        // 1.0.1-L (L.90): the button of the panel returns to where the first of them was switched on; ctx.ui.resetAll (the presentation) does not fly
        resetAllBtn.addEventListener("click", () => {
          const first = revealSaved.values().next().value;
          resetAll();
          try {   // 1.9.3: the live section and walk mode go off too
            const S = ctx.shared.section, w = ctx.shared.walkMode;
            if (S && S.on) S.set(false, S.axis, S.v);
            if (w && w.on) w.set(false);
            if (ctx.shared.sectionPaint) ctx.shared.sectionPaint();
          } catch (_) {}
          if (first) realFly(first.pos, first.target);
        });
        // PILL_FREE_210 (the outside review, 14.11.2026: a pill under the places' panel or under the floating card could not be pressed - 23
        // of 108 pills seen in בית ראשון, 8 of 34 in בית שני): a pill whose place falls under the panel (#tm-panel) or the card (#tm-xcard)
        // moves sideways, to the nearer free side of it (the side with room in the window); the two rectangles are read every 15 frames
        const freeRects = [];
        let freeAt = -1e9;
        const pillFreeX = (x, y, w, h) => {
          if (frameNo - freeAt > 15) {
            freeAt = frameNo;
            freeRects.length = 0;
            for (const id of ["tm-panel", "tm-xcard"]) {
              const e = document.getElementById(id);
              if (!e) continue;   // PILL_HOME_211: (the panel and the card are position: fixed - their offsetParent is always null, so this test used to skip them both and no pill was ever moved)
              const cs = getComputedStyle(e);
              if (cs.display === "none" || cs.visibility === "hidden" || +cs.opacity === 0) continue;
              const r = e.getBoundingClientRect();
              if (r.width > 20 && r.height > 20) freeRects.push({ l: r.left, r: r.right, t: r.top, b: r.bottom });
            }
          }
          for (let k = 0; k < 3; k++) {
            let moved = false;
            for (const R of freeRects) {
              if (x + w / 2 < R.l - 6 || x - w / 2 > R.r + 6 || y + h / 2 < R.t - 6 || y - h / 2 > R.b + 6) continue;
              const toL = R.l - w / 2 - 10, toR = R.r + w / 2 + 10, W = window.innerWidth;
              const okL = toL - w / 2 > 4, okR = toR + w / 2 < W - 4;
              if (!okL && !okR) return x;
              x = okL && (!okR || Math.abs(toL - x) <= Math.abs(toR - x)) ? toL : toR;
              moved = true;
            }
            if (!moved) break;
          }
          return x;
        };
        let anyOnShown = null;
        const rects = [];   // the screen rectangles of the pills placed in this frame (a pool, reused every frame)
        let topBarH = 56, topBarAt = -1e9, navR = null;
        // CARD_PILLS_211: the chips at the card's foot for the pills that the card hides (rebuilt only when the list changes)
        let cardPillsKey = "";
        const cardPills = (list) => {
          const card = document.getElementById("tm-xcard");
          const shown = !!card && card.style.display !== "none" && card.offsetParent !== undefined && getComputedStyle(card).display !== "none";
          const key = shown ? list.map((b) => b.id + ":" + (b.label || "")).join("|") : "";
          if (key === cardPillsKey) return;
          cardPillsKey = key;
          let host = card ? card.querySelector("#tm-card-pills") : null;
          if (!key) { if (host) host.style.display = "none"; return; }
          if (!host) { host = document.createElement("div"); host.id = "tm-card-pills"; host.style.cssText = "padding:4px 10px 8px;border-top:1px solid rgba(201,168,76,.25)"; card.appendChild(host); }
          host.innerHTML = "";
          host.style.display = "";
          const t = document.createElement("div");
          t.textContent = "כפתורים שעל המודל, שהכרטיס מסתיר:";
          t.style.cssText = "font-size:12px;opacity:.8;margin:2px 0 4px";
          host.appendChild(t);
          for (const b of list) {
            const bt = document.createElement("button");
            bt.type = "button";
            bt.className = "tm-more";
            bt.textContent = "▶ " + String(b.label || b.id || "");
            bt.onclick = (e) => { e.stopPropagation(); try { b.set(!b.get()); } catch (_) {} cardPillsKey = ""; };
            host.appendChild(bt);
          }
        };
        const frame = (force) => {
          const cam = ctx.camera;
          cam.updateMatrixWorld();
          frameNo++;
          if (frameNo - topBarAt > 30) {   // the bar's height (56 / 44 px by the width), measured now and then
            topBarAt = frameNo;
            try { const tb = document.getElementById("tm-topbar"); if (tb) topBarH = tb.offsetHeight || topBarH; } catch (_) {}
            // PILL_NAV_211 (the function review, F2-07): the navigation row's rectangle, measured with the bar
            try { const nv = document.getElementById("tm-nav"), r = nv && getComputedStyle(nv).display !== "none" ? nv.getBoundingClientRect() : null; navR = r && r.width > 20 ? { l: r.left, r: r.right, t: r.top } : null; } catch (_) { navR = null; }
          }
          let nPlaced = 0;
          const hidCard = [];   // CARD_PILLS_211: the pills hidden under the card or the panel in this frame
          let anyOn = false;
          for (const b of MB) {
            if (!b || typeof b.get !== "function") continue;
            let on = false;
            try { on = !!b.get(); } catch (_) {}
            if (on) anyOn = true;
            const st = pillFor(b);
            let p = null;
            try { p = place(b, st, force); } catch (_) { p = null; }
            const text = String((on ? b.labelOn || b.label : b.label) || b.id || "");
            if (st.text !== text) {
              st.text = text;
              ui_fillSrc(st.el, text);
              st.w = 0;
            }
            const t = b.title ? String(b.title) : "";
            if (st.tip !== t) {
              st.tip = t;
              if (t) tip(st.el, t);
            }
            if (st.on !== on) {
              st.on = on;
              st.el.classList.toggle("on", on);
            }
            if (!p) {
              if (st.disp !== "none") {
                st.disp = "none";
                st.el.style.display = "none";
              }
              continue;
            }
            if (st.disp !== "block") {
              st.disp = "block";
              st.el.style.display = "block";
            }
            if (!st.w) {
              st.w = st.el.offsetWidth || 8 * text.length + 24;   // measured once per text
              st.h = st.el.offsetHeight || 24;
            }
            const sc = typeof b.scale === "function" ? Math.max(0.5, Math.min(2, +b.scale() || 1)) : 1;
            const w = st.w * sc, h = st.h * sc;
            let x = p[0];
            let y = p[1];
            x = pillFreeX(x, y, w, h);   // PILL_FREE_210
            // PILL_HOME_211 (the user, 15.11.2026: "כל כפתורי הפתיחה, כגון הסר ענן, פתח את האולם, יצאו החוצה סתם" - a pill moved from under
            // the card floated beside it, over a part of the model that is not its own): a pill whose own place is under the card or the
            // panel is NOT shown (folding the card or turning the view brings it back at its place). One that is switched on still moves
            // aside, so that it can be switched off.
            if (x !== p[0] && !on) {
              hidCard.push(b);   // CARD_PILLS_211
              st.disp = "none";
              st.el.style.display = "none";
              continue;
            }
            // 1.2.3 (the user: "הכפתור של הבאת המכונה מוסתר עם הסרגל - צריך להזיז אותו"): never under the top bar - a pill whose anchor projects
            // behind the bar is held just below it
            if (y - h / 2 < topBarH + 6) y = topBarH + 6 + h / 2;
            // PILL_NAV_211: in a low window "הצג מה שבתוך הארון" was drawn under the navigation row and could not be pressed
            if (navR && x + w / 2 > navR.l && x - w / 2 < navR.r && y + h / 2 > navR.t - 4) y = navR.t - 4 - h / 2;
            // push down below any pill already placed that it overlaps (in registration order)
            for (let k = 0; k < 8; k++) {
              let hit = null;
              for (let i = 0; i < nPlaced; i++) {
                const r = rects[i];
                if (Math.abs(r.x - x) * 2 < r.w + w + 4 && Math.abs(r.y - y) * 2 < r.h + h + 4) {
                  hit = r;
                  break;
                }
              }
              if (!hit) break;
              y = hit.y + (hit.h + h) / 2 + 4;
            }
            if (!rects[nPlaced]) rects[nPlaced] = { x: 0, y: 0, w: 0, h: 0 };
            const rr = rects[nPlaced++];
            rr.x = x;
            rr.y = y;
            rr.w = w;
            rr.h = h;
            if (force || Math.abs(st.x - x) > 0.5 || Math.abs(st.y - y) > 0.5 || st.sc !== sc) {
              st.x = x;
              st.y = y;
              st.sc = sc;
              st.el.style.left = x.toFixed(0) + "px";
              st.el.style.top = y.toFixed(0) + "px";
              st.el.style.transform = sc === 1 ? "translate(-50%,-50%)" : "translate(-50%,-50%) scale(" + sc.toFixed(2) + ")";
            }
          }
          // entries taken out of the registry: their pills go
          if (pills.size > MB.length) {
            for (const [b, st] of pills) {
              if (MB.indexOf(b) < 0) {
                st.el.remove();
                pills.delete(b);
              }
            }
          }
          if ((ctx.shared.section && ctx.shared.section.on) || (ctx.shared.walkMode && ctx.shared.walkMode.on)) anyOn = true;   // 1.9.3
          if (typeof leaveFeat !== "undefined" && (leaveFeat || leaveLayer)) anyOn = true;   // VIEW_LEAVE_211
          try { cardPills(hidCard); } catch (_) {}   // CARD_PILLS_211
          if (anyOn !== anyOnShown) {
            anyOnShown = anyOn;
            resetAllBtn.style.display = anyOn ? "inline-block" : "none";
          }
        };
        ctx.animated.push(() => frame(false));
        ctx.shared.__pillsFrame = frame;   // 1.9.1: for the nav box (another block)
        ctx.shared.modelButtonsReset = resetAll;
        ctx.shared.revealViews = { ids: Object.keys(REVEAL), view: revealView, own: (id) => !!(REVEAL[id] && REVEAL[id].own) };   // 1.0.1-L (L.90): for the checks
      }
      // ===== 1.0.1-K: the arrow keys (review entry-arrow-keys-pan-and-swallow) =====
      // Left / right turn the view like the nav buttons, up / down raise or lower it, + / - zoom. Only while the focus is on the page, the
      // model or the nav / compass / pills: a focused panel button, the presentation's controls, a link or a form field keep their keys
      // (the panel scrolls with them); nothing happens while the cloud dialog is open; Ctrl / Alt / Meta combinations are the browser's.
      window.addEventListener("keydown", (e) => {
        if (e.defaultPrevented || e.ctrlKey || e.altKey || e.metaKey) return;
        const k = e.key;
        const act = k === "ArrowLeft" ? () => orbitBy(-1) : k === "ArrowRight" ? () => orbitBy(1) : k === "ArrowUp" ? () => tiltBy(1)
          : k === "ArrowDown" ? () => tiltBy(-1) : k === "+" || k === "=" ? () => zoomBy(0.94) : k === "-" || k === "_" ? () => zoomBy(1.06) : null;
        if (!act) return;
        if (cf.style.display === "flex") return;
        const ae = document.activeElement;
        const free = !ae || ae === document.body || ae === document.documentElement || ae === ctx.renderer.domElement ||
          !!(ae.closest && ae.closest("#tm-nav, #tm-compass, .tm-pill"));
        if (!free) return;
        const tg = e.target;
        if (tg && tg !== window && tg !== document && tg.nodeType === 1 && tg !== document.body && tg !== document.documentElement && tg !== ctx.renderer.domElement &&
          !(tg.closest && tg.closest("#tm-nav, #tm-compass, .tm-pill"))) return;
        e.preventDefault();
        turnAnim = null;
        act();
      });
      // 1.0.1-H: the UI's API for the presentation (75-tour.js): the views in order with their buttons, texts and sources, the opinions
      // table rows (OPS: cap, refs, options [[key, label, info]], onPick, mark, cur, fly, disabled), the info box, the source links, the
      // cloud confirmation state, the panel
      ctx.ui = {
        topbarAdd,            // 1.1.0: (el, order, icon, label) - a button into the top bar (75-tour.js: the presentation button)
        setTopBtn: ui_setTopBtn,
        views: ui_VIEWS,
        info: ui_INFO,
        refs: ui_REFS,
        viewButton: (key) => viewBtnByKey[key] || null,
        opinions: OPS,
        setInfo,
        refLinks,
        smallSources: ui_smallSources,   // 1.0.1-L (L.89): text -> HTML with the sources' brackets in a smaller font (75-tour.js)
        applyCut,    // 1.0.1-K: no-ops (navigation never opens anything); the removals are ctx.ui.removals / the on-model pills
        applyOpen,
        setLayer,
        setCutaway,   // 1.2.1: the house's cutaway (the pill "פתח את הבית") from a place
        setSection,   // 1.2.2: the section along the length (the south wall off, the ceilings kept) - the pill "פתח את העליות", the place "בית דילפא"
        sectionOn: () => sectionOn,
        fly,
        resolveFp,
        confirmOpen: () => cf.style.display === "flex",
        panel,
        burger,
        // 1.0.1-J: places by title (the place's own click logic: layers, fly, info) and the cloud
        placeButton: (t) => placeBtnByT[t] || null,
        place: (t) => placeItemByT[t] || null,
        placeTitles: () => Object.keys(placeBtnByT),
        // 1.0.1-L (the contract with 75-tour.js, brief-ui-shared.md): every place button in the panel's order: { title, group, view (a key of
        // ui_VIEWS or null), fp (a fly point key or null), info, refs, layer, feature (the ctx.shared key it switches on, or null), item }
        places: () => placeList.slice(),
        // 1.0.1-L (L.34): the floating explanation card: open(title, text or html, refs?, anchorElement?), close(), isOpen()
        card: { open: (title, content, refs, anchor) => xcardOpen(title, content, refs, anchor), close: xcardClose, isOpen: () => xOpen },
        // 1.0.1-L (L.27): the 15-second rule: { seconds, cancel(key?) - the timers go, the features stay, pending() - the features waiting for
        // their timer; arm / run / flush - the panel's own }
        autoOff,
        setCloud: (on) => setCloud(!!on),
        cloudOn: () => cloudOn,
        // 1.0.1-K (K.9a): the cloud dialog answered from outside ("ביטול" / closed with no answer), the custom tooltips, the removals,
        // the on-model buttons' registry and "↺ החזר הכל", the wall fade, the camera steps of the nav buttons / keys / compass
        cancelConfirm,
        closeConfirm,
        tip,
        tooltip: tip,
        modelButtons: MB,
        resetAll: () => { if (typeof ctx.shared.modelButtonsReset === "function") ctx.shared.modelButtonsReset(); },
        removals: {
          ids: () => Object.keys(REMOVALS),
          get: (id) => (id === "cloud" ? !cloudOn : !!(REMOVALS[id] && REMOVALS[id].isOn())),
          set: (id, on) => {
            if (id === "cloud") return void setCloud(!on);
            const R = REMOVALS[id];
            if (R && cutList(R.list()).length) R.set(!!on);
          },
          state: () => {
            const o = { cloud: !cloudOn };
            for (const k of Object.keys(REMOVALS)) o[k] = REMOVALS[k].isOn();
            return o;
          }
        },
        fade: {
          // 1.0.2 (D): hide = the mode "טשטוש: גם קיר מסתיר" (only while on)
          get: () => ({ on: !!ctx.shared.fadeState.on, hide: !!(ctx.shared.fadeState.on && ctx.shared.fadeState.hide), dist: ctx.shared.fadeState.dist, opacity: UI_FADE_OPACITY, stops: UI_FADE_STOPS.slice() }),
          set: (o) => {
            const fs = ctx.shared.fadeState;
            if (o && typeof o.on === "boolean") fs.on = o.on;
            if (o && typeof o.hide === "boolean") {
              fs.hide = o.hide;
              if (o.hide && typeof o.on !== "boolean") fs.on = true;
            }
            if (!fs.on) fs.hide = false;
            if (o && UI_FADE_STOPS.indexOf(o.dist) >= 0) fs.dist = o.dist;
            if (typeof fs.repaint === "function") fs.repaint();
          }
        },
        orbitBy,
        tiltBy,
        zoomBy,
        turnTo,
        // 1.0.1-K (K.9b): the info card next to a clicked label (the addendum C) - closed by the presentation's slides if it wants
        closeCard,   // (1.0.1-L: the label's card; the panel's explanation card is ctx.ui.card)
        cardOpen: () => !!cardSpr,
        // 1.0.1-K review (tour-8): the panel's "סיבוב איטי" - get() = its checkbox, set(on) = the checkbox AND controls.autoRotate together
        // (the box always shows what really turns; setting .checked fires no "change", so the row's handler does not run a second time)
        autoRotate: {
          get: () => !!(autoRotRow && autoRotRow.checked),
          set: (on) => {
            if (autoRotRow) autoRotRow.checked = !!on;
            setAutoRotate(!!on);
          }
        }
      };
      // ===== 1.0.2 (item 2, the user: "תוסיף כפתור בספרים הנ"ל"): the reading position from the book's button (ui_bookEvent at the top of
      // this file) -> ui_READ -> the panel's own button for it (a place by its title, or a view of the grid): the same fly, card and marking
      // as a click on it; a verse outside the table, or a position that cannot be read, gives the general view. It waits for the loading
      // screen (ent_load of 90-entry.js, when it is in scope); a running presentation stops first. A toast names the verse. =====
      {
        const loading = () => typeof ent_load !== "undefined" && !!ent_load && !!ent_load.loading;
        let lastKey = "", lastAt = 0;
        const readTarget = (r) => {
          const at = (v) => { for (const [c, a, b, t] of ui_READ[r.book] || []) if (c === r.ch && v >= a && v <= b) return t; return null; };
          return r.v === 0 ? at(1) || at(0) : at(r.v);   // the chapter's heading line: as its first verse (1.0.2 fix: before the 0-based catch-all ranges)
        };
        // 2.0.2: a target's own button, as a click on it (the presentation stops first) - for the reading below and for 72-words.js
        const pressTarget = (t) => {
          try {
            const T = ctx.shared.tour;
            if (T && typeof T.state === "function" && T.state().running && typeof T.stop === "function") T.stop();
          } catch (_) {
          }
          cancelConfirm();
          const b = (t && t.p ? placeBtnByT[t.p] : t && t.v ? viewBtnByKey[t.v] : null) || null;
          if (b) b.click();
          return !!b;
        };
        const goReading = (r) => {
          if (r && r.other) {   // 2.0.2: another book's line: by its links (72-words.js)
            const L = ctx.ui.reading && ctx.ui.reading.linked;
            if (typeof L === "function") Promise.resolve(L(r.other)).catch((e) => console.warn("[ui.js] links: " + ((e && e.message) || e)));
            return;
          }
          const k = r.book + ":" + r.ch + ":" + r.v, now = performance.now();
          if (k === lastKey && now - lastAt < 2000) return;   // the same click told twice (plugin.page_opened and the toolbar event)
          lastKey = k;
          lastAt = now;
          try {
            const T = ctx.shared.tour;
            if (T && typeof T.state === "function" && T.state().running && typeof T.stop === "function") T.stop();
          } catch (_) {
          }
          cancelConfirm();
          const t = r.ch ? readTarget(r) : null;
          const b = (t && t.p ? placeBtnByT[t.p] : t && t.v ? viewBtnByKey[t.v] : null) || viewBtnByKey.__general || null;
          if (b) b.click();
          else {
            fly(ui_GENERAL.pos, ui_GENERAL.target);
            setInfo("__general");
          }
          if (r.ch) tmToast((r.book === 89 ? "מידות " : "רמב״ם בית הבחירה ") + ui_heNum(r.ch) + (r.v ? ", " + ui_heNum(r.v) : ""));
        };
        const whenReady = (r) => {
          let n = 0;
          const tick = () => {
            if (!loading()) return void goReading(r);
            if (++n < 480) setTimeout(tick, 250);   // up to 2 minutes behind the loading screen
          };
          tick();
        };
        ui_bookGo = whenReady;
        const q = ui_bookQueue.splice(0);
        if (q.length) whenReady(q[q.length - 1]);
        ctx.ui.reading = { go: (d) => ui_bookEvent(d), target: (book, ch, v) => readTarget({ book, ch, v }), lineToVerse: ui_lineToVerse,
          press: pressTarget, toast: tmToast, open: openSource, linked: null };   // 2.0.2: press / toast / open / linked - for 72-words.js
      }
      // 2.0.2: the search in the words of the sources (a section at the end of the panel) and the links of the books' button - 72-words.js
      if (typeof buildWords === "function") {
        try { await buildWords(ctx); } catch (e) { console.error("[words.js]", e); }
      }
      // ===== 1.0.2 (C, "מה חדש"): on the first opening of a version that has a list in UI_NEWS, once the model is ready (the loading view
      // gone), a small window with the list and "סגירה"; never while the presentation runs or another window of the plugin is open (it
      // waits). The seen version is remembered at once when it shows: Otzaria's plugin storage (storage.get / storage.set; sdk.md: the
      // permissions plugin.storage.* are given to every plugin since 0.9.97 - none in manifest.json), with localStorage as the fallback and
      // the only store outside Otzaria. Either store saying "seen" is enough. The version: plugin.boot's, else UI_NEWS.ver. =====
      {
        const NEWS_KEY = "tm2.news.seen";
        const inOtz = typeof window.Otzaria !== "undefined" && !!window.Otzaria && typeof window.Otzaria.call === "function";
        const lsSeen = () => lsGet(NEWS_KEY);
        const storeSeen = async () => {
          if (!inOtz) return null;
          try {
            const res = await window.Otzaria.call("storage.get", { key: NEWS_KEY });
            return res && res.success !== false && typeof res.data === "string" ? res.data : null;
          } catch (_) {
            return null;
          }
        };
        const markSeen = (ver) => {
          lsSet(NEWS_KEY, ver);
          const nb0 = document.getElementById("tm-news-btn");   // 1.1.0 (the user): the bar's button goes once the news was seen
          if (nb0 && ver === UI_NEWS.ver) nb0.remove();
          if (inOtz) {
            try {
              Promise.resolve(window.Otzaria.call("storage.set", { key: NEWS_KEY, value: ver })).then((r) => {
                if (r && r.success === false) console.warn("[ui.js] storage.set: " + (r.error ? r.error.code || r.error.message || "" : ""));
              }, () => {});
            } catch (_) {
            }
          }
        };
        let newsSince = null;   // 1.0.6: the version seen before (set by tick), or null
        const show = (ver) => {
          const dlg = document.createElement("div");
          dlg.id = "tm-news";
          dlg.setAttribute("role", "dialog");
          dlg.setAttribute("aria-label", "מה חדש בגרסה " + ver);
          const box = document.createElement("div");
          box.className = "box";
          const t = document.createElement("div");
          t.className = "t";
          const cmpV = (a, b) => {
            const x = String(a).split(".").map(Number), y = String(b).split(".").map(Number);
            for (let i = 0; i < 3; i++) if ((x[i] || 0) !== (y[i] || 0)) return (x[i] || 0) - (y[i] || 0);
            return 0;
          };
          const known = !!newsSince && UI_NEWS_VERS.some((v) => v[0] === newsSince);
          // 1.2.1 (the user): only THIS version's list, whatever was seen before (the older lists stay in the table for the record)
          const vers = UI_NEWS_VERS.filter((v) => v[0] === ver);
          void known;
          t.textContent = known ? "מה חדש בגרסה " + ver : "מה חדש בתוסף";
          const ul = document.createElement("ul");
          for (const [vv, its] of vers) {
            if (vers.length > 1) {
              const lh = document.createElement("li");
              lh.className = "v";
              lh.textContent = "גרסה " + vv;
              ul.appendChild(lh);
            }
            for (const s2 of its) {
              const li = document.createElement("li");
              if (!ui_newsFill(li, s2)) continue;   // 2.0.2: plain text, and **...** in bold (the main things); a line of the unified plugin only there
              ul.appendChild(li);
            }
          }
          const bb = document.createElement("div");
          bb.className = "b";
          const ok = document.createElement("button");
          ok.type = "button";
          ok.className = "y";
          ok.textContent = "סגירה";
          bb.appendChild(ok);
          // NEWS_WIN_211 (the reviews, U-19 / F2-03; the user, 15.11.2026 18:39: "20. א"): the list was 3.4 screens long in its box and
          // "סגירה" stood only at its very end, under the window's edge. Now only the list scrolls: the title (with a ✕) and "סגירה"
          // always show. Enter - this release's own key for coming closer - no longer closes the window (Esc and a click beside it do).
          const tx = document.createElement("span");
          tx.textContent = t.textContent;
          const xb = document.createElement("button");
          xb.type = "button";
          xb.className = "x";
          xb.textContent = "✕";
          xb.title = "סגירה";
          t.textContent = "";
          t.appendChild(tx);
          t.appendChild(xb);
          box.tabIndex = -1;
          box.appendChild(t);
          box.appendChild(ul);
          box.appendChild(bb);
          xb.addEventListener("click", () => dlg.remove());
          dlg.appendChild(box);
          document.body.appendChild(dlg);
          const close = () => dlg.remove();
          ok.addEventListener("click", close);
          dlg.addEventListener("click", (e) => { if (e.target === dlg) close(); });
          dlg.addEventListener("keydown", (e) => {
            e.stopPropagation();
            if (e.key === "Enter") { e.preventDefault(); return; }   // NEWS_WIN_211
            if (e.key === "Escape" || e.key === "Esc") close();
          });
          dlg.addEventListener("keyup", (e) => e.stopPropagation());
          dlg.style.display = "flex";
          try { box.focus({ preventScroll: true }); } catch (_) {}   // NEWS_WIN_211: not the button - Enter would press it
          markSeen(ver);
        };
        // ready = the loading view gone, no presentation running, no other window of the plugin open
        const ready = () => {
          if (typeof ent_load !== "undefined" && ent_load && ent_load.loading) return false;
          if (document.getElementById("loading")) return false;
          try {
            const T = ctx.shared.tour;
            if (T && typeof T.state === "function" && T.state().running) return false;
          } catch (_) {
          }
          for (const id of ["tm-confirm", "tm-report", "tm-printdlg"]) {
            const el = document.getElementById(id);
            if (el && el.style.display === "flex") return false;
          }
          return true;
        };
        let tries = 0;
        const tick = async () => {
          if (!ready()) {
            if (++tries < 3600) setTimeout(tick, 1000);   // up to an hour (a long presentation)
            return;
          }
          const ver = String(ui_bootVersion || UI_NEWS.ver).replace(/^v/, "");
          if (ver !== UI_NEWS.ver) return;   // a version with no list of its own
          let seen = lsSeen();
          if (seen !== ver) {
            const st = await storeSeen();
            if (st) seen = st;
          }
          if (seen === ver) {
            lsSet(NEWS_KEY, ver);
            return;
          }
          newsSince = seen || null;
          if (!ready()) {   // (the storage's answer took a moment)
            tries = 0;
            setTimeout(tick, 1000);
            return;
          }
          show(ver);
        };
        setTimeout(tick, 800);
        ctx.ui.news = { items: UI_NEWS.items.slice(), ver: UI_NEWS.ver, show: () => show(UI_NEWS.ver) };   // for the checks
        // 1.1.0: "מה חדש" in the top bar - until the news of this version was seen once (markSeen removes it; the user)
        if (lsSeen() !== UI_NEWS.ver) {
          const nb = document.createElement("button");
          nb.type = "button";
          nb.id = "tm-news-btn";
          nb.title = "מה חדש בתוסף, לפי גרסאות";
          topbarAdd(nb, 50, "news", "מה חדש");
          nb.addEventListener("click", () => {
            const open = document.getElementById("tm-news");
            if (open) { open.remove(); return; }
            newsSince = null;
            show(UI_NEWS.ver);
          });
        }
      }
    } catch (e) {
      if (typeof console !== "undefined") console.error("[ui.js]", e);
    }
  }
