# -*- coding: utf-8 -*-
# helpers for the fixes files of revfix.py: the cards AS THEY WERE before the review fixes (a frozen copy), so that an `old` text can be
# taken from the card itself (by its opening words) and not typed again.
import json
_c = json.load(open('/home/claude/rev211/fix/content_before_revfix.json', encoding='utf-8'))

def _place(t):
    for cat, items in _c['PLACES']:
        for it in items:
            if it.get('t') == t:
                return it
    raise KeyError(t)

def _opt(row, o):
    for r in _c['SHITOT']:
        if r['t'] == row:
            for x in r['opts']:
                if x['t'] == o or x.get('key') == o:
                    return x
    raise KeyError((row, o))

def par(info, prefix):
    """the one paragraph of the text that starts with `prefix`"""
    ps = [p for p in info.split('\n') if p.startswith(prefix)]
    assert len(set(ps)) == 1, ('paragraph not found or not single', prefix, len(ps))
    return ps[0]

def pp(title, prefix):
    return par(_place(title)['info'], prefix)

def po(row, o, prefix):
    return par(_opt(row, o)['info'], prefix)

def between(text, a, b):
    """the part of `text` from `a` up to (not including) `b`"""
    i = text.index(a); j = text.index(b, i)
    return text[i:j]
