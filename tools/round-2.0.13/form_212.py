#!/usr/bin/env python3
# 16.11.2026: the user's choice for the Rambam's "מכסה גבוה יורד בגלגל" (his commentary on Tamid 3:8) - applied to the second house's
# round script (tools/rows_211r.py, after the MOCHANI row) and to 40-altar.js. Usage: python3 form_212.py a|b|c
#   a - a tall cover of its own over the laver (MOCHANI_COVER_211 as built): a third option in the row
#   b - as the Tosafot Yom Tov (Tamid 1:4) and the Even HaAzel: the same vessel as the Rambam's option - the source added to its card;
#       40-altar.js back to its state before the cover (bak/40-altar.before-cover.js)
#   c - as the Beit Ephraim (in the Ma'asei LaMelech): the vessel round the laver goes up and down by its wheel - a third option
# Every quotation below was read in the library: the Rambam's commentary on Tamid 3:8 (575:38); the Tosafot Yom Tov on Tamid 1:4
# (944:45); the Ma'asei LaMelech on Beit HaBechirah 3:18 (4304:97).
import io, sys, shutil
F = sys.argv[1]
assert F in ('a', 'b', 'c'), F
import os
R = os.environ.get('ROWS', '/home/claude/b2src/tools/rows_211r.py')
TEST = 'ROWS' in os.environ
s = io.open(R, encoding='utf-8').read()
MARK = '# ---------------------------------------------------------------- NOTE 1 = U-12'
assert s.count(MARK) == 1
if 'FORM_212' in s:
    i = s.index('# ---------------------------------------------------------------- FORM_212'); j = s.index(MARK)
    s = s[:i] + s[j:]

Q_RAMBAM = ('״ושם נתבאר שהמוכני שעשה בן קטין היה מכסה גבוה יורד בגלגל, והיא מה שאמר: מאי מוכני — גלגלא דהוו משקעי ליה, והיו שומעין '
            'לגלגול הגלגל ההוא״')
Q_TYT = '״אבל מלשונו זה שבפי׳ בפ״ג דלקמן מוכח שדבריו עולים בסגנון אחד, שהיה כלי סביב ושהיו משקעים אותו הכלי״'
Q_ML = '״וכונתו שהמוכני הי׳ לו גלגל שעולה ויורד בו, ומאותו גלגל הי׳ נשמע הקול״'
REFS = "[['פירוש המשניות לרמב״ם תמיד ג, ח', L(575, 38)], ['תוספות יום טוב תמיד א, ד', L(944, 45)]]"
REFS_C = "[['פירוש המשניות לרמב״ם תמיד ג, ח', L(575, 38)], ['מעשי למלך בית הבחירה ג, יח', L(4304, 97)], ['תוספות יום טוב תמיד א, ד', L(944, 45)]]"

if F == 'b':
    block = '''# ---------------------------------------------------------------- FORM_212 (the user's choice "ב", 16.11.2026): the Rambam's "מכסה
# גבוה יורד בגלגל" (his commentary on Tamid 3:8) is the same vessel - as the Tosafot Yom Tov (Tamid 1:4) and the Even HaAzel read it;
# no form of its own. The source in the Rambam's option, the brief and the demonstration's sentence.
_o = [o for o in row(MO)['opts'] if o['t'].startswith('הרמב״ם — כלי חול')][0]
_ps = _o['info'].split('\\n')
_add = ('ובפירוש המשניות (תמיד ג, ח): %s. **התוספות יום טוב** (תמיד א, ד) מביא את הלשון הזאת (בנוסחו: ״מכסה [עולה] ויורד בגלגל״), '
        'וכותב: %s.')
if not any(x.startswith('ובפירוש המשניות (תמיד ג, ח)') for x in _ps):
    _k = [j for j, x in enumerate(_ps) if x.startswith('**הכסף משנה**')][0]
    _ps.insert(_k, _add)
_ps = [x.replace('ב״הדגמת המוכני״ יורדים הכיור והכלי שסביבו יחד, כדברי אבן האזל — בחירת מודל.',
                 'ב״הדגמת המוכני״ יורד הכלי שסביב הכיור — ״שהיו משקעים אותו הכלי״, כתוספות יום טוב ואבן האזל; ושהכיור יורד עמו — בחירת מודל.') for x in _ps]
_o['info'] = '\\n'.join(_ps)
for _r in %s:
    if _r not in _o['refs']: _o['refs'] = _o['refs'] + [_r]
for _pl in (place('הכיור'), place('הדגמת המוכני — הכיור יורד לבור ועולה')):
    _pl['info'] = _pl['info'].replace('ומהם שותתים לכיור כדי הצורך (בית הבחירה ג, יח; פירוש המשניות תמיד א, ד).',
        'ומהם שותתים לכיור כדי הצורך (בית הבחירה ג, יח; פירוש המשניות תמיד א, ד); ובפירושו לתמיד (ג, ח): ״מכסה גבוה יורד בגלגל״ — ולתוספות יום טוב הוא אותו הכלי.')
    add(_pl, *%s)

''' % (Q_RAMBAM, Q_TYT, REFS, REFS)
    # the %s inside _add are filled here, in python, not at run time
    block = block.replace("'וכותב: %s.')", "'וכותב: " + Q_TYT + ".')").replace("('ובפירוש המשניות (תמיד ג, ח): %s.", "('ובפירוש המשניות (תמיד ג, ח): " + Q_RAMBAM + ".")
    if not TEST:
        shutil.copy('/home/claude/rev211/fix/bak/40-altar.before-cover.js', '/home/claude/b2src/src/40-altar.js')
        print('40-altar.js: back to its state before the cover')
else:
    if F == 'a':
        T = 'הרמב״ם בפירוש המשניות לתמיד — מכסה גבוה יורד בגלגל'
        INFO = ('**הרמב״ם** בפירוש המשניות (תמיד ג, ח): ' + Q_RAMBAM + '.\\n'
                '**בקצרה —** **התוספות יום טוב** (תמיד א, ד) מבין שזה הכלי שסביב הכיור: ' + Q_TYT + '; וכן **מעשי למלך** (בית הבחירה ג, יח), בשם שו״ת בית אפרים: ' + Q_ML + '.\\n'
                'במודל: מכסה גבוה תלוי בגלגל מעל הכיור, וב״הדגמת המוכני״ הוא יורד על הכיור בערב ועולה בבוקר, והכיור נשאר במקומו — כפשט המילה ״מכסה״. צורת המכסה, גובהו והחומר שלו — בחירת מודל; לא נמצא מפרש שמפרש כך.')
        LBL = 'המוכני לרמב״ם בפירוש המשניות (תמיד ג, ח) — ״מכסה גבוה יורד בגלגל״'
        BUL = '• לרמב״ם בפירוש המשניות לתמיד (ג, ח) — ״מכסה גבוה יורד בגלגל״ (אפשרות שלישית במתג).'
        refs = REFS
    else:
        T = 'בית אפרים — הכלי שסביב הכיור עולה ויורד בגלגל'
        INFO = ('**הרמב״ם** בפירוש המשניות (תמיד ג, ח): ' + Q_RAMBAM + '.\\n'
                '**מעשי למלך** (בית הבחירה ג, יח), בשם שו״ת בית אפרים: ' + Q_ML + '; ולא פירש כרש״י, בגלל קושיית הכף נחת: היקף הכיור שתים עשרה אמה, והבור צריך להיות רחב כמותו, ״והא ליכא מקום פנוי בין האולם ולמזבח לזה הבור״.\\n'
                '**בקצרה —** **התוספות יום טוב** (תמיד א, ד): ' + Q_TYT + '.\\n'
                'במודל: הכלי הגבוה שסביב הכיור תלוי בגלגל, וב״הדגמת המוכני״ הוא יורד סביב הכיור בערב ועולה בבוקר, והכיור אינו יורד לבור. לאן הכלי עולה ויורד, צורתו וגובהו — בחירת מודל.')
        LBL = 'המוכני לבית אפרים — הכלי שסביב הכיור עולה ויורד בגלגל (מעשי למלך, בית הבחירה ג, יח)'
        BUL = '• לבית אפרים (במעשי למלך) — הכלי שסביב הכיור עולה ויורד בגלגל, והכיור אינו יורד לבור (אפשרות שלישית במתג).'
        refs = REFS_C
    block = '''# ---------------------------------------------------------------- FORM_212 (the user's choice "%s", 16.11.2026): a third option in the
# row "המוכני של הכיור" - 40-altar.js MOCHANI_COVER_211 (ctx2.shared.mochani.set("cover")).
_r = row(MO)
_r['pickJs'] = 'const M = ctx.shared.mochani; if (M && typeof M.set === "function") M.set(k === "o1" ? "rambam" : k === "o2" ? "cover" : "rashi");'
_r['opts'] = [o for o in _r['opts'] if not o['t'].startswith(('הרמב״ם בפירוש המשניות לתמיד', 'בית אפרים —'))]
_r['opts'].append({'t': %r, 'drawn': True, 'cam': _kp['cam'], 'tg': _kp['tg'], 'refs': MO_REFS + %s, 'info': %r})
c['LABEL_MAP'][%r] = {'place': 'הכיור'}
for _pl in (place('הכיור'), place('הדגמת המוכני — הכיור יורד לבור ועולה')):
    _ps = _pl['info'].split('\\n')
    _b = [j for j, x in enumerate(_ps) if x.startswith('• לרמב״ם — המוכני הוא כלי חול')]
    if _b and not any(x.startswith(%r) for x in _ps):
        _ps.insert(_b[0] + 1, %r)
    _pl['info'] = '\\n'.join(_ps)
    add(_pl, *%s)

''' % (F == 'a' and 'א' or 'ג', T, refs, INFO.replace('\\n', '\n'), LBL, BUL[:30], BUL, refs)
s = s.replace(MARK, block + MARK)
io.open(R, 'w', encoding='utf-8').write(s)
print('rows_211r.py: FORM_212 =', F)
