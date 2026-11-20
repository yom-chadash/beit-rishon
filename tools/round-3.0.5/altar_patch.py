#!/usr/bin/env python3
# round 3.0.5 (בית שני 2.0.14) - ALTAR_EAST_305 (the user, 19.11.2026 22:41: "א: להזיז אמה ורבע בכל המודל, בשני הבתים ובכל הקריאות"):
# the golden altar 1.25 amot further east - x -32.25 (-33.5 until 2.0.13) - so that Rashi's answer on Yoma 51b holds: "ואם תאמר אף בין
# המזבח לשולחן אין דרך, שהרי המזבח באמצע ההיכל וראש השולחן הדרומי סמוך למזבח - ... שאין המזבח מכוון כנגד השולחן אלא משוך קימעא כלפי
# חוץ". With Solomon's ten tables north-south (Rashi, Menachot 99a: "ושורה מערבית משוכה מכותל מערבי שתי אמות ומחצה ואמה רוחב דשולחן
# ושתי אמות ומחצה בינו ובין השלחן של משה כו'") the east row ends 10.5 from the parochet, at x -34; the altar's west face now at -32.75
# - a way of an amah and a quarter between them (0.06 until 2.0.13, when the east row was pulled that much off the altar). Into
# sheni-src/bundle.js: the altar (ALT; ctx2.shared.goldenAltar follows it), the morning service's fallback and its four views of it,
# the ten tables' east row, the altar's card. (The first house: src/55-interior.js and src/70-ui.js, by hand.)
# Run from the repository's root: python3 -I tools/round-3.0.5/altar_patch.py ; then node tools/safe-lines.mjs sheni-src/bundle.js
import sys

def rd(p):
    return open(p, encoding='utf-8').read()

def wr(p, s):
    open(p, 'w', encoding='utf-8').write(s)

def once(s, old, new, what):
    k = s.count(old)
    if k != 1:
        sys.exit('%s: anchor found %d times' % (what, k))
    return s.replace(old, new)

p = 'sheni-src/bundle.js'
s = rd(p)
if 'ALTAR_EAST_305' in s:
    sys.exit('already applied')
s = once(s, '    const ALT = { x: -33.5, z: 0 };                      // the golden altar between them, drawn outward (east) a little //\n',
         '    // ALTAR_EAST_305 (the user, 19.11.2026 22:41): 1.25 further east (x -33.5 until 2.0.13) - a way between it and the east row of //\n'
         '    // Solomon\'s tables when they lie north-south, as Rashi\'s answer on Yoma 51b: "שאין המזבח מכוון כנגד השולחן אלא משוך קימעא כלפי חוץ" //\n'
         '    const ALT = { x: -32.25, z: 0 };                     // the golden altar between them, drawn outward (east) a little //\n', 'ALT')
s = once(s, '    const GA = () => SH.goldenAltar || { x: -33.5, z: 0, top: 25.9 }; //\n',
         '    const GA = () => SH.goldenAltar || { x: -32.25, z: 0, top: 25.9 };   // ALTAR_EAST_305 //\n', 'GA')
for k, t in [('inner', '[[-20, 27.6, 7], [-33.5, 24.4, 0]]'), ('teni', '[[-20, 28, 8], [-33.5, 24, 0]]'),
             ('gechalim', '[[-25, 27.5, 6], [-33.5, 24.5, 0]]'), ('ketoret', '[[-22, 28.5, 8], [-33.5, 25, 0]]')]:
    s = once(s, '      %s: () => %s, //\n' % (k, t), '      %s: () => %s,   // ALTAR_EAST_305 //\n' % (k, t.replace('-33.5', '-32.25')), 'view ' + k)
s = once(s, '          const xW = -44.5 + 2.5 + 0.5, xM = xW + 3.5, xE = xM + 3.5 - 0.06; //\n',
         '          // ALTAR_EAST_305: the east row at 2.5 from Moses\' table as the west row (Rashi 99a "כו\'"); until 2.0.13 0.06 west of that, //\n'
         '          // touching the altar - now an amah and a quarter from it //\n'
         '          const xW = -44.5 + 2.5 + 0.5, xM = xW + 3.5, xE = xM + 3.5; //\n', 'east row')
OLD = 'במודל: כבמודל בית ראשון, בלי השכבות של בית ראשון;'
s = once(s, OLD, 'מקומו במודל: ארבע אמות ושלושה רבעים מזרחה לקו השולחן והמנורה — כדי שכשעשרת שולחנות שלמה מונחים צפון ודרום (במתג), יהיה מעבר בינם ובין המזבח, '
         'כתירוץ רש״י (יומא נא:): ״ואם תאמר אף בין המזבח לשולחן אין דרך... שאין המזבח מכוון כנגד השולחן, אלא משוך קימעא כלפי חוץ״. ״קימעא״ — בלי מידה; המידה בחירת מודל.\\n'
         + OLD, 'card')
wr(p, s)
print('ALTAR_EAST_305 applied')
