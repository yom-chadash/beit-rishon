# -*- coding: utf-8 -*-
# UI_211R - the fixes of the review round of 2.0.11 (15.11.2026) that are THE SAME CODE in the two houses' 70-ui.js.
# Read by tools/ui_211r.py (Beit Sheni: on the generated src/70-ui.js, at every chain run) and by tools211/b1_ui_211r.py (Beit Rishon:
# once, on its source). SHARED = [(id, old, new)], each `old` exactly once in the file.
SHARED = []
def S(fid, old, new): SHARED.append((fid, old, new))

# ---- F1-04 / F2-02: the two view buttons leave the place before, as a place's click and a chip do
S('VIEW_LEAVE_211',
'''            // 1.0.1-K: no automatic removal (v.interior / v.yatzia / v.ulam are data only)''',
'''            // VIEW_LEAVE_211 (the function review, F1-04 / F2-02): a view button did not put back what the place before it had switched on by
            // itself - the tower of "העליות", the officers, the golden stands stayed over "מבט כללי" for good. It does now what a place's
            // click and a chip do (CHIP_CLOSEAUTO_211).
            try { autoOff.flush(); } catch (_) {}
            try { if (typeof ctx.shared.closeAuto === "function") ctx.shared.closeAuto(); } catch (_) {}
            try { placeLeave({}); } catch (_) {}
            // 1.0.1-K: no automatic removal (v.interior / v.yatzia / v.ulam are data only)''')
S('RESET_LEAVE_211',
'''          autoOff.flush();   // 1.0.1-L (L.27): what a place switched on goes back now (the tables of the ulam have no pill), and no timer stays''',
'''          autoOff.flush();   // 1.0.1-L (L.27): what a place switched on goes back now (the tables of the ulam have no pill), and no timer stays
          try { placeLeave({}); } catch (_) {}   // VIEW_LEAVE_211: and the place's own layer or untimed feature''')

# ---- U-45: the chips at a card's foot always say which dispute they switch
S('CHIP_NAME_211',
'''          if (rows.length > 1) {
            g.className = "g";
            const k = document.createElement("span");
            k.className = "k";
            k.textContent = (row.short || "") + (row.short ? ":" : "");
            g.appendChild(k);
          }''',
'''          // CHIP_NAME_211 (the understandability review, U-45): a card with ONE row ended "שיטות:" and bare chips - in "הרובד הרביעי"
          // the three chips of "מעלות האולם" read as three opinions about the rovad. The row's name stands before its chips always.
          const nm = row.short || (row.cardOnly ? "" : row.cap) || "";
          if (rows.length > 1 || nm) {
            g.className = "g";
            const k = document.createElement("span");
            k.className = "k";
            k.textContent = nm + (nm ? ":" : "");
            g.appendChild(k);
          }''')

# ---- the "מה חדש" window: the title and "סגירה" always in sight, a wider box, Enter does not close it, and a way back to the list
S('NEWS_CSS_211',
'''#tm-news .box{width:min(430px,92vw)}''',
'''#tm-news .box{width:min(560px,92vw);display:flex;flex-direction:column;overflow:hidden;font-size:13px;line-height:1.55}
#tm-news .box:focus{outline:none}
#tm-news ul{flex:1 1 auto;min-height:0;overflow-y:auto;overscroll-behavior:contain}
#tm-news .t{flex:none;display:flex;align-items:center;justify-content:space-between;gap:8px}
#tm-news .t .x{cursor:pointer;border:1px solid rgba(201,168,76,.45);background:rgba(201,168,76,.12);color:#e8dcae;border-radius:6px;padding:0 8px;font:inherit;line-height:1.5}
#tm-news .b{flex:none}
#tm-foot-news{margin-top:4px;font-size:10px;color:#c9b77a;text-align:center;cursor:pointer;text-decoration:underline}
@media (max-height:700px){#tm-xcard .o,#tm-card .o{max-height:24vh}#tm-xcard .r{max-height:70px}}''')
S('NEWS_BOX_211',
'''          box.appendChild(t);
          box.appendChild(ul);
          box.appendChild(bb);''',
'''          // NEWS_WIN_211 (the reviews, U-19 / F2-03; the user, 15.11.2026 18:39: "20. א"): the list was 3.4 screens long in its box and
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
          xb.addEventListener("click", () => dlg.remove());''')
S('NEWS_ENTER_211',
'''            if (e.key === "Escape" || e.key === "Esc" || e.key === "Enter") close();''',
'''            if (e.key === "Enter") { e.preventDefault(); return; }   // NEWS_WIN_211
            if (e.key === "Escape" || e.key === "Esc") close();''')
S('NEWS_FOCUS_211',
'''          try { ok.focus({ preventScroll: true }); } catch (_) {}
          markSeen(ver);''',
'''          try { box.focus({ preventScroll: true }); } catch (_) {}   // NEWS_WIN_211: not the button - Enter would press it
          markSeen(ver);''')
S('NEWS_FOOT_211',
'''      panel.appendChild(foot);
''',
'''      panel.appendChild(foot);
      // NEWS_WIN_211: the way back to the list of this version - the top bar's button goes once the list was seen (1.1.0, the user)
      {
        const fn = document.createElement("div");
        fn.id = "tm-foot-news";
        fn.textContent = "מה חדש בגרסה זו";
        fn.addEventListener("click", () => { try { const o = document.getElementById("tm-news"); if (o) o.remove(); else if (ctx.ui && ctx.ui.news) ctx.ui.news.show(); } catch (_) {} });
        panel.appendChild(fn);
      }
''')

# ---- F2-09: "קולות בהדגמות" follows the other house while both are open
S('SOUND_SYNC_211',
'''        toggleRow("קולות בהדגמות", !off, (on) => {
          ctx.shared.soundOff = !on;
          try { localStorage.setItem("tm.sound.off", on ? "0" : "1"); } catch (_) {}
          if (!on) { for (const f of (Array.isArray(ctx.shared.soundStops) ? ctx.shared.soundStops : [])) { try { f(); } catch (_) {} } }
        });''',
'''        const inpS = toggleRow("קולות בהדגמות", !off, (on) => {
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
        document.addEventListener("visibilitychange", syncS);''')

# ---- U-25: the navigation help
S('HELP_TOUCH_211',
'''          "להסתובב: גרור אצבע אחת על המשטח.",''',
'''          "להסתובב: לחץ על המשטח, החזק, וגרור את האצבע (או: הקש פעמיים, ובפעם השנייה השאר את האצבע על המשטח וגרור).",''')
S('HELP_PAGE_211',
'''          "[[PageUp]] [[PageDown]] — לעלות ולרדת.",''',
'''          "[[PageUp]] — לעלות. [[PageDown]] — לרדת.",''')
S('HELP_PANEL_211',
'''        sec("הלוח שבצד", [
          "בלוח רשומים כל המקומות. לחיצה על שם — מעבירה אל המקום ופותחת עליו הסבר.",
          "שורת החיפוש שבראש הלוח: כתוב מילה, ויופיעו המקומות שמתאימים לה.",
          "״שיטות ומחלוקות״: כאן בוחרים איך לצייר דבר שנחלקו בו. לחיצה על שיטה — משנה את המודל מיד.",
          "״↺ החזר הכל״ בתחתית הלוח — מחזיר את המבט הראשון ואת כל ההגדרות."
        ]);''',
'''        sec("התפריט שבצד", [
          "בתפריט רשומים כל המקומות. לחיצה על שם — מעבירה אל המקום ופותחת עליו הסבר.",
          "שורת החיפוש שבראש התפריט: כתוב מילה, ויופיעו המקומות שמתאימים לה.",
          "״שיטות ומחלוקות״: כאן בוחרים איך לצייר דבר שנחלקו בו. לחיצה על שיטה — משנה את המודל מיד.",
          "״מה חדש בגרסה זו״, בסוף התפריט — פותח שוב את רשימת החידושים."
        ]);''')
S('HELP_TOOLS_211',
'''          "״חתך״: חותך את הבניין כמו בשרטוט, כדי לראות מה בפנים. המחוון מזיז את מקום החתך.",''',
'''          "״חתך״: חותך את הבניין כמו בשרטוט, כדי לראות מה בפנים. הפס שלידו מזיז את מקום החתך.",''')
S('HELP_WALLS_211',
'''          "״מעבר דרך קירות״ (בלוח, תחת ״תצוגה״) — מרשה לעבור דרך קירות; הם נעשים שקופים בדרך."
        ]);''',
'''          "״מעבר דרך קירות״ (בתפריט, תחת ״תצוגה״) — מרשה לעבור דרך קירות; הם נעשים שקופים בדרך.",
          "״טשטוש חומות״ (בשורת הכפתורים שבתחתית המסך): חומה שמסתירה את מה שמביטים בו נעשית שקופה למחצה. ״מרחק טשטוש״ — עד איזה מרחק מן העין.",
          "״↺ החזר הכל״ — מופיע בשורת הכפתורים שבתחתית המסך אחרי שפתחת משהו במודל (גג, קיר, חתך). לחיצה עליו סוגרת את כל מה שנפתח. את השיטות שבחרת הוא אינו משנה.",
          "בסרגל העליון: ״מצגת״ — סיור מודרך, שלב אחר שלב. ״הדפסה״ — מדפיסה את התמונה ואת כרטיס ההסבר. ״דיווח״ — לשלוח הערה או תיקון."
        ]);''')
# ---- U-07 / the user, 15.11.2026 18:39 ("19. להחליף לשיטה"): "שיטה" for an opinion, not "קריאה"
S('OPS_HEAD_211', '''      opsSum.textContent = "שיטות ומחלוקות — בחירת הקריאה";''', '''      opsSum.textContent = "שיטות ומחלוקות — בחירת השיטה";''')
# ---- F2-07: an on-model button is never drawn under the navigation row at the screen's foot (as it is never under the top bar)
S('PILL_NAV_211a',
'''            try { const tb = document.getElementById("tm-topbar"); if (tb) topBarH = tb.offsetHeight || topBarH; } catch (_) {}''',
'''            try { const tb = document.getElementById("tm-topbar"); if (tb) topBarH = tb.offsetHeight || topBarH; } catch (_) {}
            // PILL_NAV_211 (the function review, F2-07): the navigation row's rectangle, measured with the bar
            try { const nv = document.getElementById("tm-nav"), r = nv && getComputedStyle(nv).display !== "none" ? nv.getBoundingClientRect() : null; navR = r && r.width > 20 ? { l: r.left, r: r.right, t: r.top } : null; } catch (_) { navR = null; }''')
S('PILL_NAV_211b',
'''        let topBarH = 56, topBarAt = -1e9;''',
'''        let topBarH = 56, topBarAt = -1e9, navR = null;''')
S('PILL_NAV_211c',
'''            if (y - h / 2 < topBarH + 6) y = topBarH + 6 + h / 2;''',
'''            if (y - h / 2 < topBarH + 6) y = topBarH + 6 + h / 2;
            // PILL_NAV_211: in a low window "הצג מה שבתוך הארון" was drawn under the navigation row and could not be pressed
            if (navR && x + w / 2 > navR.l && x - w / 2 < navR.r && y + h / 2 > navR.t - 4) y = navR.t - 4 - h / 2;''')
# ---- NOTE 12 (the function review, F2-07): a card that lies over its own place's on-model button (PILL_HOME_211 hides such a pill,
# by the user's wish) - the button's caption becomes a chip at the card's foot; pressing it presses the button. (The pills do not move.)
S('CARD_PILLS_211a',
'''          let nPlaced = 0;''',
'''          let nPlaced = 0;
          const hidCard = [];   // CARD_PILLS_211: the pills hidden under the card or the panel in this frame''')
S('CARD_PILLS_211b',
'''            if (x !== p[0] && !on) {''',
'''            if (x !== p[0] && !on) {
              hidCard.push(b);   // CARD_PILLS_211''')
S('CARD_PILLS_211c',
'''          if (anyOn !== anyOnShown) {''',
'''          try { cardPills(hidCard); } catch (_) {}   // CARD_PILLS_211
          if (anyOn !== anyOnShown) {''')
S('CARD_PILLS_211d',
'''        const frame = (force) => {''',
'''        // CARD_PILLS_211: the chips at the card's foot for the pills that the card hides (rebuilt only when the list changes)
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
        const frame = (force) => {''')
