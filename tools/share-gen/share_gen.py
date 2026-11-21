# -*- coding: utf-8 -*-
# tools/share-gen/share_gen.py - ONE shared text and two "slot" files out of the same file of the two houses (21.11.2026, stage 2 of
# the split: the interface written once). Used once per file, to make shared/<file> - not part of the build.
#
#   python3 -I tools/share-gen/share_gen.py <rishon file> <sheni file> <shared out> <rishon slots out> <sheni slots out> [--prefix P]
#
# The shared text holds the lines where the CODE of both houses is the same, line by line (the tokens - tools/share-gen/line-keys.mjs;
# comments and the whitespace between tokens are not code). Every place where the two houses differ - in code, or only in a comment or
# the spaces - becomes a SLOT: in the shared text one line "<indent>//@@slot <name>", and in each house's slot file its own lines there:
#     //@@begin <name>
#     ...the house's lines (none, if the house has nothing there)...
#     //@@end <name>
# so tools/house-slots.mjs gives back EACH HOUSE'S FILE BYTE FOR BYTE (checked here before anything is written). A short run of equal
# code (under --min-run lines, 3) between two differences is not cut out: it goes into the slot with them.
#
# Used on 21.11.2026 on 3.0.6's files (git show 3c82e60:src/<f> and 6bb5881:sheni/src/<f>), for f in 70-ui.js 72-words.js 75-tour.js
# 85-hq.js 90-entry.js:  share_gen.py <rishon f> <sheni f> shared/<f> src/slots/<base>.slots.js sheni/src/slots/<base>.slots.js;
# 00-lib.js is the same in both houses (byte for byte): moved to shared/ as it is, no slots. The figures' kits: cut_frag.py.
# A slot's name: the function it is in, and what its first code line declares ("buildUI.PLACES"); "-note" - comments only.
import sys, os, json, re, difflib, subprocess, collections, tempfile
HERE = os.path.dirname(os.path.abspath(__file__))
argv = sys.argv[1:]
def opt(k, d):
    if k in argv:
        i = argv.index(k); v = argv[i + 1]; del argv[i:i + 2]; return v
    return d
PREFIX = opt('--prefix', '')
MIN_RUN = int(opt('--min-run', '3'))
rf, sf, shared_out, rslots_out, sslots_out = argv[:5]

def info(path):
    fd, tmp = tempfile.mkstemp(suffix='.json'); os.close(fd)
    try:
        subprocess.check_call(['node', os.path.join(HERE, 'line-keys.mjs'), path, tmp])
        return json.load(open(tmp, encoding='utf-8'))
    finally:
        os.unlink(tmp)
R = open(rf, encoding='utf-8').read().split('\n')
S = open(sf, encoding='utf-8').read().split('\n')
IR, IS = info(rf), info(sf)
KR, KS = IR['keys'], IS['keys']
assert len(KR) == len(R) and len(KS) == len(S)
cr = [i for i, k in enumerate(KR) if k]
cs = [i for i, k in enumerate(KS) if k]
sm = difflib.SequenceMatcher(None, [KR[i] for i in cr], [KS[i] for i in cs], autojunk=False)
blocks = [b for b in sm.get_matching_blocks() if b.size >= MIN_RUN]

pieces = []   # ('shared', lines) | ('slot', rishon lines, sheni lines, rishon start line, sheni start line)
def emit(rl, sl, ra, sa):
    if rl == sl:
        if rl: pieces.append(['shared', list(rl)])
    else:
        pieces.append(['slot', list(rl), list(sl), ra, sa])
pr = ps = 0
for b in blocks:
    # before the run: a slot (or shared lines, if the in-between is the same)
    r0, s0 = cr[b.a], cs[b.b]
    emit(R[pr:r0], S[ps:s0], pr, ps)
    cur = []
    for k in range(b.size):
        ri, si = cr[b.a + k], cs[b.b + k]
        if k:
            rp, sp = cr[b.a + k - 1], cs[b.b + k - 1]
            rg, sg = R[rp + 1:ri], S[sp + 1:si]   # the comment / empty lines between two code lines
            if rg != sg:
                if cur: pieces.append(['shared', cur]); cur = []
                pieces.append(['slot', rg, sg, rp + 1, sp + 1])
            else:
                cur.extend(rg)
        if R[ri] != S[si]:   # the same code, another comment or spacing on the line
            if cur: pieces.append(['shared', cur]); cur = []
            pieces.append(['slot', [R[ri]], [S[si]], ri, si])
        else:
            cur.append(R[ri])
    if cur: pieces.append(['shared', cur])
    pr, ps = cr[b.a + b.size - 1] + 1, cs[b.b + b.size - 1] + 1
emit(R[pr:], S[ps:], pr, ps)
# adjacent slots merge into one
merged = []
for p in pieces:
    if p[0] == 'slot' and merged and merged[-1][0] == 'slot':
        merged[-1][1].extend(p[1]); merged[-1][2].extend(p[2])
    else:
        merged.append(p)
pieces = merged

# names: the function the slot is in (rishon's side; sheni's if rishon has no code there), and the name the slot's first code line
# declares, if it declares one ("buildUI.PLACES", "WORDS", "make.trumpets"); "-note" when neither side has code (a comment or
# spacing only); a counter when a name comes back
DECL = re.compile(r'^\s*(?:async\s+)?(?:function\*?\s+([A-Za-z_$][\w$]*)|(?:const|let|var)\s+([A-Za-z_$][\w$]*))')
def fn_at(units, line, lines=None):
    best = None
    for u in units:
        if u['a'] <= line <= u['b'] and (best is None or u['b'] - u['a'] < best['b'] - best['a']):
            best = u
    if not best:
        # outside every function and table: the last thing declared before it at the outermost level ("after-ent_view")
        if lines is not None:
            for i in range(line - 1, -1, -1):
                m = DECL.match(lines[i])
                if m and len(lines[i]) - len(lines[i].lstrip()) <= 2: return 'after-' + (m.group(1) or m.group(2))
        return None
    if lines is not None and not best.get('top') and best['b'] - best['a'] > 300:
        # in a very long function (buildUI, buildTour): also the last thing declared in it before the slot
        for i in range(line - 1, best['a'], -1):
            m = DECL.match(lines[i])
            if m: return best['name'] + '.after-' + (m.group(1) or m.group(2))
    return best['name']
seen = collections.Counter()
for p in pieces:
    if p[0] != 'slot': continue
    rl, sl, ra, sa = p[1], p[2], p[3], p[4]
    code_r = [ra + i for i in range(len(rl)) if KR[ra + i]]
    code_s = [sa + i for i in range(len(sl)) if KS[sa + i]]
    if code_r: fn, first = fn_at(IR['units'], code_r[0], R), R[code_r[0]]
    elif code_s: fn, first = fn_at(IS['units'], code_s[0], S), S[code_s[0]]
    else: fn, first = fn_at(IR['units'], ra, R) or fn_at(IS['units'], sa, S), ''
    m = DECL.match(first)
    decl = (m.group(1) or m.group(2)) if m else None
    if fn and decl and decl != fn: base = fn.split('.after-')[0] + '.' + decl
    else: base = decl or fn or 'top'
    p.append([KR[i] for i in code_r] == [KS[i] for i in code_s])   # True: the same code, only comments / spacing differ
    base = PREFIX + base + ('' if code_r or code_s else '-note')
    base = re.sub(r'[^\w.\-]', '_', base)
    seen[base] += 1
    p.append(base if seen[base] == 1 else '%s-%d' % (base, seen[base]))

def indent_of(lines):
    for l in lines:
        if l.strip(): return l[:len(l) - len(l.lstrip())]
    return '  '
sh, rs, ss = [], [], []
for p in pieces:
    if p[0] == 'shared': sh.extend(p[1]); continue
    name = p[6]
    sh.append(indent_of(p[1] or p[2]) + '//@@slot ' + name)
    rs += ['//@@begin ' + name] + p[1] + ['//@@end ' + name]
    ss += ['//@@begin ' + name] + p[2] + ['//@@end ' + name]
shared_text = '\n'.join(sh)
# the proof, before writing: each house's file comes back byte for byte
sys.path.insert(0, HERE)
def expand(shared, slots_lines):
    sl, i = {}, 0
    while i < len(slots_lines):
        m = re.match(r'^//@@begin (\S+)$', slots_lines[i])
        if not m: i += 1; continue
        j = i + 1; body = []
        while slots_lines[j] != '//@@end ' + m.group(1): body.append(slots_lines[j]); j += 1
        sl[m.group(1)] = body; i = j + 1
    out = []
    for l in shared.split('\n'):
        m = re.match(r'^\s*//@@slot (\S+)$', l)
        out.extend(sl[m.group(1)] if m else [l])
    return '\n'.join(out)
assert expand(shared_text, rs) == '\n'.join(R), 'rishon does not come back'
assert expand(shared_text, ss) == '\n'.join(S), 'sheni does not come back'
for f, t in ((shared_out, shared_text), (rslots_out, '\n'.join(rs) + '\n'), (sslots_out, '\n'.join(ss) + '\n')):
    os.makedirs(os.path.dirname(os.path.abspath(f)), exist_ok=True)
    open(f, 'w', encoding='utf-8').write(t)
n = sum(1 for p in pieces if p[0] == 'slot')
n_note = sum(1 for p in pieces if p[0] == 'slot' and p[5])
shl = sum(len(p[1]) for p in pieces if p[0] == 'shared')
print('%s: shared %d lines (rishon %d, sheni %d), %d slots - %d of code, %d of comments only (rishon %d lines, sheni %d lines)' % (
    os.path.basename(shared_out), shl, len(R), len(S), n, n - n_note, n_note, sum(len(p[1]) for p in pieces if p[0] == 'slot'), sum(len(p[2]) for p in pieces if p[0] == 'slot')))
