# -*- coding: utf-8 -*-
"""UI_211R (Beit Sheni): the review round of 2.0.11 - patches of the GENERATED src/70-ui.js, after ui_211.py, at every chain run.
The fixes shared with Beit Rishon are in tools/ui_shared_211r.py; the ones below are Beit Sheni's own."""
import os, re, sys
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
P = os.path.join(ROOT, 'src', '70-ui.js')
s = open(P, encoding='utf-8').read()
ns = {}
exec(open(os.path.join(ROOT, 'tools', 'ui_shared_211r.py'), encoding='utf-8').read(), ns)
n = 0
def rep(fid, old, new, cnt=1):
    global s, n
    c = s.count(old)
    assert c == cnt, 'ui_211r %s: %d (wanted %d)' % (fid, c, cnt)
    s = s.replace(old, new); n += 1
for fid, old, new in ns['SHARED']:
    rep(fid, old, new)

# ---- F1-04: "↺ החזר הכל" shows also while a place's own untimed feature or layer is on
rep('RESET_SHOW_211',
'''          if ((ctx.shared.section && ctx.shared.section.on) || (ctx.shared.walkMode && ctx.shared.walkMode.on)) anyOn = true;   // 1.9.3''',
'''          if ((ctx.shared.section && ctx.shared.section.on) || (ctx.shared.walkMode && ctx.shared.walkMode.on)) anyOn = true;   // 1.9.3
          if (typeof leaveFeat !== "undefined" && (leaveFeat || leaveLayer)) anyOn = true;   // VIEW_LEAVE_211''')

# ---- F1-02: the four rows whose "for a while" display had a private timer - the next click could not end it. They are armed through
# autoOff now (15 seconds, as every other), so a place, a chip, a view button, "↺ החזר הכל" and the presentation end them at once.
rep('TIMER_GHOST_211',
'''clearTimeout(ctx.shared.__ghostT); ctx.shared.__ghostT = setTimeout(() => { try { G.set(false); } catch (_) {} }, 20000);''',
'''ctx.ui.autoOff.arm("__ghost", () => { try { G.set(false); } catch (_) {} });''')
rep('TIMER_UAZ_211',
'''clearTimeout(ctx.shared.__uazT); ctx.shared.__uazT = setTimeout(() => { try { F.off(); } catch (_) {} }, 15000);''',
'''ctx.ui.autoOff.arm("__uaz", () => { try { F.off(); } catch (_) {} });''')
rep('TIMER_HLN_211',
'''clearTimeout(ctx.shared.__hlnT); ctx.shared.__hlnT = setTimeout(() => { try { F.off(); } catch (_) {} }, 15000); } else { clearTimeout(ctx.shared.__hlnT); F.off(); }''',
'''ctx.ui.autoOff.arm("__hln", () => { try { F.off(); } catch (_) {} }); } else { ctx.ui.autoOff.cancel("__hln"); F.off(); }''')
rep('TIMER_AGL_211',
'''clearTimeout(ctx.shared.__aglT); ctx.shared.__aglT = setTimeout(() => { try { F.off(); } catch (_) {} }, 15000);''',
'''ctx.ui.autoOff.arm("__agl", () => { try { F.off(); } catch (_) {} });''')
assert '__ghostT' not in s and '__uazT' not in s and '__hlnT' not in s and '__aglT' not in s

# ---- U-28 (3): the foot of the side menu was Beit Rishon's (verses, the "השלמות" list)
rep('UNITS_211',
'''בכרטיס ליד הלוח (✕ או Esc סוגר). מה שאינו בפסוקים מסומן בהסברים ובלוח 'השלמות'; המחלוקות — בטבלת 'שיטות ומחלוקות'.''',
'''בכרטיס ליד התפריט (✕ או Esc סוגר). מה שאין לו מקור מסומן בכרטיסים ״בחירת מודל״; המחלוקות — בתפריט, תחת ״שיטות ומחלוקות״.''')

# NOTE 15 (the understandability review, U-14 end): the one title with a straight quote - every reference to it in this generated
# file at once (the place, its rows, the labels' targets, the tour's views), so that nothing is left pointing at the old name
s = s.replace('כבשים קטנים — רש\\"י', 'כבשים קטנים — רש״י').replace('כבשים קטנים — רש"י', 'כבשים קטנים — רש״י')
# NOTE 3 (the understandability review, U-16): one spelling for one name in titles - "בית המטבחים" (as the row and the whole First Temple;
# the Mishnah's "המטבחיים" stays inside its quotations), "שולחן" in the two places' titles. Exact quoted titles only, so every reference
# in this generated file moves with them (the place, its rows, the labels' targets, the tour's views).
for _a, _b in (('"בית המטבחיים"', '"בית המטבחים"'), ('"שלחן החלבים — שני השלחנות שבמערב הכבש"', '"שולחן החלבים — שני השולחנות שבמערב הכבש"'),
               ('"שלחנות האולם — שיש וזהב"', '"שולחנות האולם — שיש וזהב"')):
    s = s.replace(_a, _b)
open(P, 'w', encoding='utf-8').write(s)
print('ui_211r ok:', n, 'patches')
