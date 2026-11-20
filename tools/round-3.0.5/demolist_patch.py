# DEMOLIST_305 (3.0.5) - the lamps of the water-drawing (the youths who climb and light the golden menorahs, SIMCHA_304's first
# demonstration) back in the list of demonstrations, after the whole rejoicing. The user, 19.11.2026 23:49: "תשאיר" (to the question
# whether to keep the lamps' demonstration or take it out). Until 3.0.4 it was reached only by its place in the tree.
# Run in the chain: python3 -I tools/round-3.0.5/demolist_patch.py
import sys

def once(s, old, new, what):
    k = s.count(old)
    if k != 1:
        sys.exit('%s: anchor found %d times' % (what, k))
    return s.replace(old, new)

p = 'sheni-src/bundle.js'
s = open(p, encoding='utf-8').read()
if 'DEMOLIST_305' in s:
    sys.exit('already applied')
s = once(s, '          { t: "שמחת בית השואבה", place: "שמחת בית השואבה — הדגמה" }   // SIMCHA_304 (until 2.0.12: the lamps alone - their place stays) //\n',
         '          { t: "שמחת בית השואבה", place: "שמחת בית השואבה — הדגמה" },   // SIMCHA_304 (until 2.0.12: the lamps alone - their place stays) //\n'
         '          { t: "הדלקת מנורות הזהב בעזרת נשים", place: "מנורות של זהב — שמחת בית השואבה" }   // DEMOLIST_305: the lamps alone, kept (the user, 23:49) //\n',
         'demos list')
open(p, 'w', encoding='utf-8').write(s)
print('DEMOLIST_305 applied')
