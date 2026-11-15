# -*- coding: utf-8 -*-
# REVIEW FIXES of round 211 (the eight fresh agents, 15.11.2026): one tool for the wording fixes of the cards.
#   python3 -I revfix.py b2 <fixes.py>      the Second Temple: patches tools/content.json AND the tools/*.py that wrote the text
#   python3 -I revfix.py b1 <fixes.py>      the First Temple: patches src/*.js
# A fixes file defines FIXES = [ (id, where, [(old, new), ...]), ... ]
#   where (b2): ('place', title) | ('row', title, option-title-or-key-or-None) | ('info', key) | ('label', key) | None (= every card)
#   where (b1): None (the sources are searched)
# Why both the content and its sources (b2): content.json accumulates, and every chain run re-applies the tools' own texts with their
# own "done already?" tests. A fix made only in the content would be undone, or doubled, by the next run; a fix made only in a tool
# would not reach a text that is already in the content. So: the same (old -> new) in both; afterwards the chain is at rest again
# (checked by running it twice and comparing content.json).
# The source search lets a Python / JS string literal break between any two characters ('...' newline '...'), so a fragment may
# straddle the literal's lines; the replacement is written on one line.
import json, re, os, sys, glob

MODE, FIXFILE = sys.argv[1], sys.argv[2]
ns = {}
exec(compile(open(FIXFILE, encoding='utf-8').read(), FIXFILE, 'exec'), ns)
FIXES = ns['FIXES']

def rx(old):
    sep = r"(?:['\"][ \t]*(?:\+[ \t]*)?\n[ \t]*(?:\+[ \t]*)?['\"])?"
    parts = []
    for ch in old:
        if ch == "'":
            parts.append(r"\\?'")
        elif ch == '"':
            parts.append(r'\\?"')
        elif ch == '\n':
            parts.append(r'(?:\\n|\n)')
        else:
            parts.append(re.escape(ch))
    return re.compile(sep.join(parts))

def lit_kind(src, pos):
    """the kind of string literal that holds src[pos]: 'T' (Python triple-quoted), "'" , '"' or '`'; None when it is code or a comment.
    Line-local: the literal's opener is looked for on the match's own line (a one-line literal cannot start on an earlier line); for
    Python, an odd number of triple quotes before the line means that the line lies inside a triple-quoted text."""
    ls = src.rfind('\n', 0, pos) + 1
    if MODE == 'b2':
        head = src[:ls]
        if (head.count('"""') % 2) == 1 or (head.count("'''") % 2) == 1:
            return 'T'
    i, kind = ls, None
    while i < pos:
        ch = src[i]
        if kind is None:
            if MODE == 'b2' and (src.startswith('"""', i) or src.startswith("'''", i)):
                kind = ('T', src[i:i + 3]); i += 3; continue
            if ch in '"\'' or (MODE != 'b2' and ch == '`'):
                kind = (ch, ch); i += 1; continue
            if MODE == 'b2' and ch == '#':
                return None
            if MODE != 'b2' and src.startswith('//', i):
                return None
            i += 1
        else:
            if ch == '\\':
                i += 2; continue
            if src.startswith(kind[1], i):
                i += len(kind[1]); kind = None; continue
            i += 1
    return kind[0] if kind else None

def enc(new, kind):
    if kind == 'T':
        return new
    out = new.replace('\\', '\\\\').replace('\n', '\\n')
    if kind == "'":
        out = out.replace("'", "\\'")
    elif kind == '"':
        out = out.replace('"', '\\"')
    elif kind == '`':
        out = out.replace('`', '\\`')
    return out

def patch_sources(files, old, new, fid):
    """replace every occurrence of `old` (inside string literals, maybe straddling their lines) in the files; returns how many"""
    total = 0
    R = rx(old)
    for p in files:
        s = open(p, encoding='utf-8').read()
        out, last, k = [], 0, 0
        for m in R.finditer(s):
            kind = lit_kind(s, m.start())
            if kind is None:
                continue   # in a comment or in code, not in a literal
            out.append(s[last:m.start()]); out.append(enc(new, kind)); last = m.end(); k += 1
        if k:
            out.append(s[last:])
            open(p, 'w', encoding='utf-8').write(''.join(out))
            total += k
            print('   src', os.path.basename(p), 'x%d' % k)
    return total

if MODE == 'b2':
    ROOT = '/home/claude/b2src'
    P = ROOT + '/tools/content.json'
    c = json.load(open(P, encoding='utf-8'))
    SRC = [p for p in sorted(glob.glob(ROOT + '/tools/*.py')) if not os.path.basename(p).startswith(('verify_', 'rows_211r'))]

    def cards(where):
        """the cards (dict, field) that `where` names"""
        out = []
        if where is None:
            for cat, items in c['PLACES']:
                for it in items:
                    out.append((it, 'info', 'place ' + it['t']))
            for r in c['SHITOT']:
                for o in r['opts']:
                    out.append((o, 'info', 'row ' + r['t'] + ' :: ' + o['t']))
            for k, v in c['INFO'].items():
                if isinstance(v, str):
                    out.append((c['INFO'], k, 'info ' + k))
                elif isinstance(v, dict) and isinstance(v.get('info'), str):
                    out.append((v, 'info', 'info ' + k))
            for k, v in c['LABEL_MAP'].items():
                if isinstance(v, dict) and isinstance(v.get('info'), str):
                    out.append((v, 'info', 'label ' + k))
        elif where[0] == 'place':
            for cat, items in c['PLACES']:
                for it in items:
                    if it.get('t') == where[1]:
                        out.append((it, 'info', 'place ' + it['t']))
        elif where[0] == 'row':
            for r in c['SHITOT']:
                if r['t'] == where[1]:
                    for o in r['opts']:
                        if where[2] is None or o['t'] == where[2] or o.get('key') == where[2]:
                            out.append((o, 'info', 'row ' + r['t'] + ' :: ' + o['t']))
        elif where[0] == 'info':
            v = c['INFO'][where[1]]
            out.append((c['INFO'], where[1], 'info ' + where[1]) if isinstance(v, str) else (v, 'info', 'info ' + where[1]))
        elif where[0] == 'label':
            out.append((c['LABEL_MAP'][where[1]], 'info', 'label ' + where[1]))
        assert out, ('no such card', where)
        return out

    bad = 0
    for fx in FIXES:
        fid, where, pairs = fx[0], fx[1], fx[2]
        only = fx[3] if len(fx) > 3 else 'CS'   # 'C' the content alone, 'S' the sources alone (for a text that a chain step drops or rebuilds)
        for old, new in pairs:
            n_old = n_new = 0
            if 'C' in only:
                for d, f, name in cards(where):
                    t = d[f]
                    if old in t:
                        d[f] = t.replace(old, new); n_old += t.count(old)
                    elif new in t:
                        n_new += 1
            k = patch_sources(SRC, old, new, fid) if 'S' in only else 0
            state = 'APPLIED' if (n_old or (only == 'S' and k)) else ('already' if (n_new or only == 'S') else 'MISSING')
            if state == 'MISSING' or (n_old and not k and only == 'CS'):
                bad += 1
            print('%-8s %-8s content x%d (had new x%d), sources x%d | %s' % (fid, state, n_old, n_new, k, old[:46].replace('\n', ' ')))
    json.dump(c, open(P, 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
    print('b2 done; problems:', bad)
else:
    # 'b1': the First Temple's sources; 'b2js': the Second Temple's hand-written sources (70-ui.js, 75-tour.js and 56-tamid-data.js are
    # generated by tools/*.py - a fix of theirs goes into the tool, in mode b2)
    ROOT = '/home/claude/beit-rishon' if MODE == 'b1' else '/home/claude/b2src'
    SRC = [p for p in sorted(glob.glob(ROOT + '/src/*.js')) if MODE == 'b1' or os.path.basename(p) not in ('70-ui.js', '75-tour.js', '56-tamid-data.js')]
    bad = 0
    for fx in FIXES:
        fid, where, pairs = fx[0], fx[1], fx[2]
        for old, new in pairs:
            k = patch_sources(SRC, old, new, fid)
            had = 0
            if not k:
                R = rx(new)
                had = sum(1 for p in SRC if R.search(open(p, encoding='utf-8').read()))
            state = 'APPLIED' if k else ('already' if had else 'MISSING')
            if state == 'MISSING':
                bad += 1
            print('%-8s %-8s sources x%d | %s' % (fid, state, k, old[:46].replace('\n', ' ')))
    print(MODE, 'done; problems:', bad)
