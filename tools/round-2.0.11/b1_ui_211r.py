# -*- coding: utf-8 -*-
# Beit Rishon: the shared UI fixes of the review round (b2src/tools/ui_shared_211r.py), applied once to its source. Idempotent.
import io
ns = {}
exec(io.open('/home/claude/b2src/tools/ui_shared_211r.py', encoding='utf-8').read(), ns)
P = '/home/claude/beit-rishon/src/70-ui.js'
s = io.open(P, encoding='utf-8').read(); n = 0; skipped = []
for fid, old, new in ns['SHARED']:
    if new in s: skipped.append(fid); continue
    c = s.count(old)
    assert c == 1, (fid, c)
    s = s.replace(old, new); n += 1
io.open(P, 'w', encoding='utf-8').write(s)
print('b1 70-ui.js:', n, 'applied;', len(skipped), 'already in')
for p in ('/home/claude/b2src/src/90-entry.js', '/home/claude/beit-rishon/src/90-entry.js'):
    s = io.open(p, encoding='utf-8').read()
    old = 'closest(".tm-pill, #tm-news, #tm-help, .tm-src, .tm-srcl, #tm-xcard .x, #tm-card .x, #tm-burger, #tm-dpause, #tm-tour-box")'
    new = 'closest(".tm-pill, #tm-news, #tm-help, .tm-src, .tm-srcl, #tm-xcard .x, #tm-card .x, .tm-more, #tm-burger, #tm-dpause, #tm-tour-box")'
    if new not in s:
        assert s.count(old) == 1, p
        s = s.replace(old, new)
        # the reason, on the line before the listener
        io.open(p, 'w', encoding='utf-8').write(s)
    print(p.split('/home/claude/')[-1], 'ok')
