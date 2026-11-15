# -*- coding: utf-8 -*-
# FOLD_MODEL_211: the new fold (only the middle folds; "במודל" always shows) - in b2's tools/rich_block.js and port_ui.py (the CSS), in
# b1's src/70-ui.js, and `.tm-more` in the two 90-entry.js (U-49). Idempotent.
import io
OLD_FOLD = '''    if (fold && el.__raw.length > fold) {
      const ps = [...el.children].filter((c) => c.classList && c.classList.contains("p"));
      let acc = 0, k = -1;
      for (let i = 0; i < ps.length; i++) { acc += ps[i].textContent.length; if (i >= 1 && acc > fold * 0.5) { k = i; break; } }
      const rest = k >= 0 ? ps.slice(k + 1) : [];
      if (rest.reduce((n, c) => n + c.textContent.length, 0) > 200) {
        for (const c of rest) c.style.display = "none";
        const bt = document.createElement("button");
        bt.className = "tm-more";
        bt.textContent = "המשך הכרטיס ▾";
        bt.onclick = (e) => { e.stopPropagation(); for (const c of rest) c.style.display = ""; bt.remove(); };
        el.appendChild(bt);
      }
    }
'''
NEW_FOLD = '''    // FOLD_MODEL_211 (the understandability review, U-23 / U-40 / U-52; the user, 15.11.2026 18:39: "21. א"): the fold hid the END of the
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
'''
OLD_CSS = '''#tm-xcard .tm-more,#tm-card .tm-more{display:block;margin:7px 0 2px;background:rgba(201,168,76,.12);border:1px solid rgba(201,168,76,.42);color:#e8dcae;border-radius:6px;padding:3px 12px;cursor:pointer;font-size:12px;font-family:inherit}'''
NEW_CSS = '''#tm-xcard .tm-more,#tm-card .tm-more{display:block;width:100%;box-sizing:border-box;text-align:center;margin:8px 0 6px;background:rgba(201,168,76,.26);border:1px solid rgba(201,168,76,.65);color:#f3dc9a;border-radius:6px;padding:5px 12px;cursor:pointer;font-size:12px;font-weight:700;font-family:inherit}'''
OLD_ENT = '''closest(".tm-pill, #tm-news, #tm-help, .tm-src, .tm-srcl, #tm-xcard .x, #tm-card .x, #tm-burger, #tm-dpause, #tm-tour-box")'''
def patch(path, pairs):
    s = io.open(path, encoding='utf-8').read(); n = 0
    for fid, old, new in pairs:
        if new in s: continue
        assert s.count(old) == 1, (path, fid, s.count(old))
        s = s.replace(old, new); n += 1
    io.open(path, 'w', encoding='utf-8').write(s); print(path.split('/home/claude/')[-1], n)
patch('/home/claude/b2src/tools/rich_block.js', [('fold', OLD_FOLD, NEW_FOLD)])
patch('/home/claude/b2src/tools/port_ui.py', [('css', OLD_CSS, NEW_CSS)])
patch('/home/claude/beit-rishon/src/70-ui.js', [('fold', OLD_FOLD, NEW_FOLD), ('css', OLD_CSS, NEW_CSS)])
