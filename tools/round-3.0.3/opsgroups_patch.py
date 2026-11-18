#!/usr/bin/env python3
# round 3.0.3: OPS_GROUPS_303 - the table "שיטות ומחלוקות" in groups by place (both houses), by text anchors.
#   python3 -I tools/round-3.0.3/opsgroups_patch.py rishon-ui   src/70-ui.js
#   python3 -I tools/round-3.0.3/opsgroups_patch.py rishon-tour src/75-tour.js
#   python3 -I tools/round-3.0.3/opsgroups_patch.py sheni       sheni-src/bundle.js
# then, for the bundle: node tools/safe-lines.mjs sheni-src/bundle.js && node --check sheni-src/bundle.js
import sys, os, json

mode, path = sys.argv[1], sys.argv[2]
here = os.path.dirname(os.path.abspath(__file__))
s = open(path, encoding='utf-8').read()
SH = mode == 'sheni'
n_edits = 0

def L(code):
    """an anchor of code lines: in the bundle every code line ends with ' //' (tools/safe-lines.mjs)"""
    if not SH:
        return code
    return '\n'.join((ln + ' //') if ln.strip() else ln for ln in code.split('\n'))

def rep(old, new, count=1):
    global s, n_edits
    k = s.count(old)
    if k != count:
        sys.exit('%s: anchor found %d times (want %d): %r' % (mode, k, count, old[:140]))
    s = s.replace(old, new)
    n_edits += 1

GROUPS = {
    'rishon': [
        ["הר הבית והחצרות", ["lesserPlace", "eastSteps", "yehoyadaChests", "sanhedrinRows", "slaughterLayout"]],
        ["המזבח וכלי הנחושת", ["seaPlacement", "altarPlace", "altarRTam", "altarYose", "altarLook", "maarachot", "maarachotYK",
                               "sfalim", "rampGap", "altarRamps"]],
        ["הבית מבחוץ והיציע", ["aliyot", "ulamRambam", "yatziaShape", "pillarCapital", "ulamTables", "ulamCeiling"]],
        ["הבית מבפנים", ["potot", "kodeshLayout", "kodeshOpinion", "breadShape", "devirDoor", "devirHeight", "cherubPose", "arkLayout"]],
        ["בית שלמה", ["forestHouse", "throneVersion"]],
    ],
    'sheni': [
        ["הר הבית והחיל", ["sh0", "sh1", "sh2", "sh55", "sh3"]],
        ["עזרת נשים", ["sh4", "sh5", "sh6"]],
        ["העזרה", ["sh9", "sh54", "sh8", "sh11", "sh10", "sh14", "sh15"]],
        ["לשכות העזרה ובית המוקד", ["sh7", "sh50", "sh51", "sh52", "sh53"]],
        ["המזבח, הכבש והכיור", ["sh16", "sh17", "sh18", "sh19", "sh20", "sh21", "sh23", "sh24", "sh25", "sh26"]],
        ["האולם", ["sh27", "sh28", "sh29", "sh30", "sh31", "sh32"]],
        ["בניין ההיכל, התאים והעלייה", ["sh33", "sh34", "sh35", "sh36", "sh37", "sh38", "sh39", "sh40", "sh41"]],
        ["כלי ההיכל", ["sh42", "sh43", "sh44", "sh45", "sh57", "sh46", "sh48"]],
        ["הפרוכות", ["sh47", "sh56", "sh58", "sh59", "sh49"]],
        ["סדר העבודה ובגדי הכהנים", ["sh12", "sh22", "sh13"]],
    ],
}

def groups_js(house):
    g = GROUPS[house]
    out = "[\n"
    for i, (name, ids) in enumerate(g):
        out += "          [" + json.dumps(name, ensure_ascii=False) + ", " + json.dumps(ids) + "]" + ("," if i < len(g) - 1 else "") + "\n"
    out += "        ]"
    return out

def block(house):
    b = open(os.path.join(here, 'opsgroups-block.js'), encoding='utf-8').read()
    assert b.count('/*GROUPS*/') == 1
    return b.replace('/*GROUPS*/', groups_js(house))

CSS_OLD = "#tm-ops .tm-op button:disabled{opacity:.45;cursor:default}\n"
CSS_NEW = CSS_OLD + (
    "#tm-ops details.tm-opg{border-bottom:1px solid rgba(201,168,76,.2)}\n"
    "#tm-ops details.tm-opg:last-child{border-bottom:0}\n"
    "#tm-ops details.tm-opg>summary{cursor:pointer;font-size:12px;font-weight:600;color:#e8dcae;padding:6px 0 5px}\n"
    "#tm-ops details.tm-opg>summary:hover{color:#fff2c8}\n"
    "#tm-ops details.tm-opg[open]>summary{color:#f3dc9a}\n"
    "#tm-ops details.tm-opg>summary .n{font-weight:400;font-size:10.5px;color:#b9ac82;margin-right:5px}\n"
    "#tm-ops .tm-opg-b{margin:0 4px 7px 0;padding-right:8px;border-right:2px solid rgba(201,168,76,.28)}\n")

NOTE_OLD = 'opsNote.textContent = "בכל שורה: הנושא והדעות. הלחיצה מחליפה את המודל, מסבירה את הדעה ועפה אליה. המקורות — בכרטיס ההסבר.";'
NOTE_NEW = ('opsNote.textContent = "המחלוקות מחולקות לקבוצות לפי המקומות; לחיצה על קבוצה פותחת אותה. בכל שורה: הנושא והדעות. '
            'הלחיצה מחליפה את המודל, מסבירה את הדעה ועפה אליה. המקורות — בכרטיס ההסבר.";   // OPS_GROUPS_303')

SEARCH_HIT_OLD = ('        const itemHit = (b, q) => { const op = b.closest(".tm-op"), cap = op && op.querySelector(".cap"); '
                  'return hit(b, q) || (!!cap && hit(cap, q)); };')
SEARCH_HIT_NEW = ('        // OPS_GROUPS_303: the name of a group of the opinions table finds all its rows\n'
                  '        const itemHit = (b, q) => { const op = b.closest(".tm-op"), cap = op && op.querySelector(".cap"), '
                  'g = op && op.closest("details.tm-opg"), gs = g && g.querySelector("summary"); '
                  'return hit(b, q) || (!!cap && hit(cap, q)) || (!!gs && hit(gs, q)); };')

SEARCH_NEST_OLD = ('          for (const d of panel.querySelectorAll("details details")) {\n'
                   '            if (Array.from(d.querySelectorAll(ITEMS)).some((b) => b.style.display !== "none")) d.open = true;\n'
                   '          }\n')
SEARCH_NEST_NEW = ('          // OPS_GROUPS_303: a group inside a group (the groups of the opinions table) opens when it holds a match and steps aside\n'
                   '          // when it holds none; a row of the table without a match steps aside too (its caption alone was left). saved: back\n'
                   '          for (const d of panel.querySelectorAll("details details")) {\n'
                   '            if (!saved.has(d)) saved.set(d, { display: d.style.display, open: d.open });\n'
                   '            const has = Array.from(d.querySelectorAll(ITEMS)).some((b) => b.style.display !== "none");\n'
                   '            d.style.display = has ? saved.get(d).display : "none";\n'
                   '            if (has) d.open = true;\n'
                   '          }\n'
                   '          for (const r of panel.querySelectorAll("#tm-ops .tm-op")) {\n'
                   '            if (!saved.has(r)) saved.set(r, { display: r.style.display });\n'
                   '            r.style.display = Array.from(r.querySelectorAll(ITEMS)).some((b) => b.style.display !== "none") ? saved.get(r).display : "none";\n'
                   '          }\n')

TOUR_SLIDE_OLD = '            out.push({ kind: "opinion", part: 1, row, key, def, title: label, sub: row.cap, text: info || "", refs: infoRefs || row.refs || [],'
TOUR_SLIDE_NEW = '            out.push({ kind: "opinion", part: 1, group: row.group || "", row, key, def, title: label, sub: row.cap, text: info || "", refs: infoRefs || row.refs || [],'
TOUR_LABEL_OLD = '        return "לפי הנושאים · " + (s.part ? "שיטות נוספות" : s.group || "מבטים");   // 1.0.1-L: the panel\'s group'
TOUR_LABEL_NEW = ('        // OPS_GROUPS_303: a reading of the opinions table says its group of the table\n'
                  '        return "לפי הנושאים · " + (s.part ? "שיטות נוספות" + (s.group ? " · " + s.group : "") : s.group || "מבטים");   // 1.0.1-L: the panel\'s group')

def do_ui(house):
    rep(CSS_OLD, CSS_NEW)
    rep(L(NOTE_OLD), NOTE_NEW)
    rep(L(SEARCH_HIT_OLD), SEARCH_HIT_NEW)
    rep(L(SEARCH_NEST_OLD.rstrip('\n')) + '\n', SEARCH_NEST_NEW)
    if house == 'rishon':
        a = s.find('      {\n        const WANT = ["lesserPlace"')
        b_end = '        for (const r of sorted) { OPS.push(r); if (r.box) opsBox.appendChild(r.box); }\n      }\n'
        b = s.find(b_end, a)
        if a < 0 or b < 0 or s.count('const WANT = ["lesserPlace"') != 1:
            sys.exit('rishon: the walk-order block not found')
        old = s[a:b + len(b_end)]
        rep(old, '      // (the walk order of 1.3.5 lives on inside the groups: OPS_GROUPS_303 below)\n' + block('rishon'))
    else:
        # the bundle's rows did not keep their box (בית ראשון's do, 1.3.5)
        keep = "        if (!row.cardOnly) opsBox.appendChild(box);   // 1.9.2: a card's own switch is not in the table"
        rep(L(keep), L(keep) + '\n        row.box = box;   // OPS_GROUPS_303: kept - the rows go into their groups after the last of them (below)')
        anchor = L('      }\n      // ===== viewing tools (SPEC 9.6; 1.0.1 FIXES F.2; 1.0.1-H: sources on the rows) =====')
        rep(anchor, L('      }') + '\n' + block('sheni') + L('      // ===== viewing tools (SPEC 9.6; 1.0.1 FIXES F.2; 1.0.1-H: sources on the rows) ====='))

def do_tour():
    rep(L(TOUR_SLIDE_OLD), TOUR_SLIDE_NEW)
    rep(L(TOUR_LABEL_OLD), TOUR_LABEL_NEW)

if mode == 'rishon-ui':
    do_ui('rishon')
elif mode == 'rishon-tour':
    do_tour()
elif mode == 'sheni':
    do_ui('sheni')
    do_tour()
else:
    sys.exit('mode?')
open(path, 'w', encoding='utf-8').write(s)
print(mode, path, n_edits, 'edits')
