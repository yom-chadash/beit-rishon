# -*- coding: utf-8 -*-
"""TOUR_211R (Beit Sheni): the review round of 2.0.11 - patches of the GENERATED src/75-tour.js, after tour_209.py, at every chain run."""
import os
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
P = os.path.join(ROOT, 'src', '75-tour.js')
s = open(P, encoding='utf-8').read(); n = 0
def rep(fid, old, new, cnt=1):
    global s, n
    c = s.count(old)
    assert c == cnt, 'tour_211r %s: %d (wanted %d)' % (fid, c, cnt)
    s = s.replace(old, new); n += 1

# ---- F1-08 (and with it F1-07): a place whose display is a feature WITHOUT a timer was shown in the presentation without it - the
# officers' slide had no officers, the tribes' slide no strip, the earlier altar's no outline. The rule "timed === false = an animation
# with its own end" came from Beit Rishon (the king's ascent); in this house timed === false marks the standing displays of a place
# (memunim, altar28, tribes, rampWays, machtot, rovad4, kanim, kelim, simchaMenorot). The slide switches them on, and off when it is left.
rep('TOUR_UNTIMED_211',
'''        if (!F || !fnc(F.on) || !fnc(F.isOn) || F.timed === false) return null;   // (an animation with its own end: the throne's slides)''',
'''        if (!F || !fnc(F.on) || !fnc(F.isOn)) return null;   // TOUR_UNTIMED_211: (Beit Rishon skips timed === false here - the throne's slides)''')

# ---- F1-09 (2) / F1-02: what a reading's slide switched on "for a while" ends when the slide is left
rep('TOUR_FLUSH_211',
'''        rt.undo.push(() => {
          call(ctx.shared.holdAuto, false);
          call(ctx.shared.closeAuto);
        });''',
'''        rt.undo.push(() => {
          call(ctx.shared.holdAuto, false);
          call(ctx.shared.closeAuto);
          try { if (ctx.ui && ctx.ui.autoOff) ctx.ui.autoOff.flush(); } catch (_) {}   // TOUR_FLUSH_211: the zones, the see-through house
        });''')
# ---- U-06 / U-07: the modes' descriptions in the words of the menu ("מתג", "שיטה", "התפריט")
rep('TOUR_WORDS_211a',
    """desc: "כל המבטים וכל המקומות לפי סדר הלוח, ובסוף הקריאות הנוספות של טבלת 'שיטות ומחלוקות'." """.strip(),
    """desc: "כל המבטים וכל המקומות לפי סדר התפריט, ובסוף השיטות הנוספות שבתפריט, תחת ״שיטות ומחלוקות״." """.strip())
rep('TOUR_WORDS_211b',
    """בלשון המשנה — בסדר שנבחר בטבלת 'שיטות ומחלוקות' (אביי או הרמב״ם).""",
    """בלשון המשנה — בסדר שנבחר במתג ״סדר עבודת הבוקר״ (אביי או הרמב״ם).""")
# ---- "18. א" / U-05 / U-06 (the last pass before publishing): the slides of the Mishnah-order tour (tools/port_tour.py) have their own
# texts, which the cards' wording pass does not reach - two version stamps, "טבלת השיטות", and one promise long since kept
rep('TOUR_WORDS_211c', "ראה בטבלת השיטות", "ראה בתפריט, תחת ״שיטות ומחלוקות״", 7)
rep('TOUR_WORDS_211d', "כל השיטות — בטבלת השיטות.", "כל השיטות — בתפריט, תחת ״שיטות ומחלוקות״.")
rep('TOUR_WORDS_211e', " במודל הפשפשים נוספו ב־1.1.0.", "")
rep('TOUR_WORDS_211f', "במודל גובה ההיכל תוקן ל־100 אמה ב־1.1.0; שתי השיטות במעקה", "במודל גובה ההיכל מאה אמה; שתי השיטות במעקה")
rep('TOUR_WORDS_211g', "מחלוקת בזבחים נח:–נט., ותתווסף לטבלת השיטות.", "מחלוקת בזבחים נח:–נט.; ראה את המתג ״מקום המזבח בעזרה״ בתפריט, תחת ״שיטות ומחלוקות״.")
rep('TOUR_WORDS_211h', "סיום המצגת: הקריאות, השכבות והמתגים חוזרים למה שהיו לפניה (Esc)", "סיום המצגת: השיטות, השכבות והמתגים חוזרים למה שהיו לפניה (Esc)")
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
print('tour_211r ok:', n, 'patches')
