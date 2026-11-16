# -*- coding: utf-8 -*-
# 2.0.2, THE REVIEW ROUND (15.11.2026; eight fresh reviewers): the references that the cards cite and did not link, the labels and the
# targets that were wrong, and a last pass that leaves no paragraph twice in a card. Idempotent; runs LAST of the content steps
# (tools/chain.sh, after rows_211.py). The wording fixes themselves were made in the texts' own tools by /home/claude/tools211/revfix.py
# (fixes_b2_*.py) - one (old -> new) in the content and in the tool that wrote it. Every line named here was read in the library
# (book : line) on 15.11.2026; the reviewers' reports: /home/claude/rev211/reports.
import json, os
HERE = os.path.dirname(os.path.abspath(__file__))
P = os.path.join(HERE, 'content.json')
c = json.load(open(P, encoding='utf-8'))

def place(title):
    for cat, items in c['PLACES']:
        for it in items:
            if it.get('t') == title:
                return it
    raise KeyError(title)

def row(title):
    for r in c['SHITOT']:
        if r['t'] == title:
            return r
    raise KeyError(title)

def L(book, index):
    return {'book': book, 'index': index}

def add(card, *refs):
    """link what the card cites: a ref goes in when no ref of that label is there (a shared list is copied first)"""
    card['refs'] = [list(x) for x in card.get('refs') or []]
    for r in refs:
        if not any(x[0] == r[0] for x in card['refs']):
            card['refs'].append(list(r))

def retarget(card, label, new_label=None, target=None):
    card['refs'] = [list(x) for x in card.get('refs') or []]
    for x in card['refs']:
        if x[0] == label:
            if target is not None:
                x[1] = target
            if new_label is not None:
                x[0] = new_label

def drop(card, *labels):
    card['refs'] = [list(x) for x in card.get('refs') or [] if x[0] not in labels]

# ---------------------------------------------------------------- the places
add(place('החיל'), ['רמב״ם בית הבחירה ו, א', 'Mishneh_Torah,_The_Chosen_Temple.6.1'])                                   # S1-05 (337:94)

MEZ = (['יומא יא:', L(107, 245)], ['מנחות לג:', L(131, 1143)], ['מנחות לג.', L(131, 1137)], ['תוספות מנחות לג.', L(1933, 387)])   # S1-07, S2-17
_nk = [it for cat, items in c['PLACES'] for it in items if it.get('key') == 'nikanor']
assert len(_nk) == 1
add(_nk[0], *MEZ)
c['REFS']['nikanor'] = [list(x) for x in c['REFS'].get('nikanor', [])]
for _r in MEZ:
    if not any(x[0] == _r[0] for x in c['REFS']['nikanor']):
        c['REFS']['nikanor'].append(list(_r))

_mn = place('מנורות של זהב — שמחת בית השואבה')                                                                          # S1-08
retarget(_mn, 'יכין סוכה ה, ז', new_label='יכין סוכה ה, ב (אות ז)')
retarget(_mn, 'יכין סוכה ה, ח', new_label='יכין סוכה ה, ב (אות ח)')
add(_mn, ['יכין סוכה ה, ב (אות ט)', L(772, 522)])

add(place('לשכת עושי לחם הפנים'), ['מנחות צד:', L(131, 3364)])                                                         # S1-09
_MOK = (['רש״י יומא יז:', L(2157, 533)], ['תוספות רי״ד יומא יז.', L(2109, 50)], ['ברטנורא מידות א, ו', L(643, 39)],
        ['מאירי מידות א, ו', L(6033, 16)], ['יכין תמיד ג, ג', L(818, 252)], ['המפרש לתמיד ל.', L(2105, 247)])
for _t in ('לשכת החותמות — בבית המוקד', 'לשכת אבני המזבח — בבית המוקד', 'הירידה לבית הטבילה — בבית המוקד'):
    add(place(_t), *_MOK)
add(place('הממונים שבמקדש'), ['מידות א, ט', L(89, 10)], ['יכין תמיד ג, ג', L(818, 252)])                               # S1-02, S1-12

# the gate's two chambers (S2-21 / R-01 / R-02; S2-01; the user's "כהן")
_G = (['צורת בית המקדש לתפארת ישראל, סימן יח', L(6029, 47)], ['בועז מידות ה, ב', L(1329, 26)], ['לחם שמים מידות ה, ד', L(1145, 123)])
for _t in ('לשכת פנחס המלביש', 'לשכת עושי חביתין'):
    _q = place(_t)
    retarget(_q, 'רמב״ם בית הבחירה ה, ד', new_label='רמב״ם בית הבחירה ה, יז', target='Mishneh_Torah,_The_Chosen_Temple.5.17')
    add(_q, *_G)
add(place('לשכת פנחס המלביש'), ['תמיד ה, ג', L(88, 29)], ['צורת בית המקדש לתפארת ישראל, סימן כ', L(6029, 51)],
    ['פירוש הרא״ש תמיד לב:', L(2224, 267)], ['מלאכת שלמה תמיד ה, ג', L(1202, 242)])
add(place('לשכת עושי חביתין'), ['המפרש לתמיד כח.', L(2105, 144)])
add(place('לשכות כלי השיר — תחת עזרת ישראל'), ['רבינו שמעיה מידות ב, ו', L(645, 78)], ['צורת בית המקדש לתפארת ישראל, סימן יז', L(6029, 45)])

add(place('לשכת בית אבטינס — על גבי שער המים'), ['יומא ג, יא', L(55, 29)], ['יומא לח. (טעמם)', L(107, 910)],        # S2-03, S2-13
    ['יומא לח. (רבי עקיבא)', L(107, 913)], ['תמיד כז.', L(138, 28)])
_pr = place('לשכת העץ — לשכת כהן גדול (פרהדרין)')                                                                       # S2-17, S2-13, R-07
add(_pr, *MEZ[:3])
add(_pr, ['יומא יט. (ומסתברא)', L(107, 410)])
retarget(_pr, 'יומא א, ג', target=L(55, 4))
add(place('שלוש המחתות — בכל יום וביום הכיפורים'), ['תוספות יומא מד:', L(1908, 358)], ['מאירי יומא מד:', L(2199, 399)],   # S2-05, S2-22
    ['יומא מד: (בשל קביים)', L(107, 1127)])
add(place('כני הזהב שבהיכל — ביום הכיפורים'), ['יומא נו:', L(107, 1461)])                                               # S2-08
for _o in row('כני הזהב — שניים או אחד')['opts']:
    add(_o, ['יומא נו:', L(107, 1461)])
_kt = place('הכהן הגדול נכנס בקטורת — הדגמה')                                                                           # S2-09, S4-11
retarget(_kt, 'מאירי יומא מז.', target=L(2199, 425))
add(_kt, ['יומא נב:', L(107, 1349)])
add(place('לשכת הכלים'), ['לחם שמים תמיד ג, ד', L(1140, 53)], ['מלאכת שלמה תמיד ג, ה', L(1202, 104)])                  # S2-10
add(place('הרובד הרביעי — ביום הכיפורים'), ['פירוש המשנה לרמב״ם, במאירי יומא מג.', L(2199, 382)])                      # S2-11
add(place('לשכת המדיחין'), ['תוי״ט מידות ה, ג', L(948, 198)])                                                           # S2-20
add(place('לשכת המלח'), ['מנחות כא: (שלשה מקומות)', L(131, 727)])                                                       # S2-19

# ---------------------------------------------------------------- the cards that cite, whoever they are (S2-13, S3-09, S3-12)
def every_card():
    for cat, items in c['PLACES']:
        for it in items:
            yield it
    for r in c['SHITOT']:
        for o in r['opts']:
            yield o

for _card in every_card():
    _t = _card.get('info') or ''
    if '״אותו שפונין בו לסובב יצא במזרחו של כבש' in _t:           # the small ramps: Rashi's words are quoted (2191:3022)
        add(_card, ['זבחים סב:', L(130, 2129)], ['רש״י זבחים סב:', L(2191, 3022)])
    if '״נראה דהיה שם כבש״' in _t:                                   # Tosafot Zevachim 64a (1936:681)
        add(_card, ['תוספות זבחים סד.', L(1936, 681)])
    if 'וכמותו פסק הרמב״ם לכסף משנה' in _t or '״כל חלה מהן מרבעת״' in _t:
        add(_card, ['רמב״ם תמידין ומוספין ה, ט', L(344, 78)], ['כסף משנה תמידין ה, ט', L(4261, 187)])
    if '(כלים יז, י)' in _t:
        add(_card, ['כלים יז, י', L(91, 151)])
    if '״וקרנותיו שבע אצבעות״ (מנחות יא, ד)' in _t:
        add(_card, ['מנחות יא, ד', L(81, 83)])
    if 'ספר הבתים** (שערי בית המקדש, שער שני)' in _t:
        add(_card, ['ספר הבתים, שערי בית המקדש (בקובץ שיטות קמאי למידות)', L(7576, 234)])
    if '(תפארת ישראל, צורת בית המקדש, סימן ח)' in _t:
        add(_card, ['צורת בית המקדש לתפארת ישראל, סימן ח', L(6029, 25)])

# the north for slaughter: Rashi's words are on four lines of the page (S3-12)
for _o in row('צפון לשחיטת קדשי קדשים')['opts']:
    retarget(_o, 'רש״י יומא לו.', new_label='רש״י יומא לו. (וכנגד כל המזבח)')
    add(_o, ['רש״י יומא לו. (בין אולם ולמזבח)', L(2157, 1322)], ['רש״י יומא לו. (אף בין האולם למזבח)', L(2157, 1324)],
        ['רש״י יומא לו. (רבי מוסיף)', L(2157, 1325)], ['רש״י יומא לו. (דרבי נמי)', L(2157, 1330)])
for _o in row('הפרוכות — שתיים או אחת')['opts']:
    if 'מאן יש אומרים' in (_o.get('info') or ''):
        add(_o, ['יומא נא: (רב חסדא)', L(107, 1318)])
_ul = row('רוחב האולם ובית החליפות')['opts']
add(_ul[0], ['תוי״ט מידות ד, ז', L(948, 181)], ['תוי״ט מידות ד, ז (בית החליפות)', L(948, 182)], ['רבינו שמעיה מידות ד, ז', L(645, 155)],
    ['תפארת ישראל מידות ד, ז', L(819, 618)], ['זבחים נה:', L(130, 1920)])
add(_ul[1], ['זבחים נה:', L(130, 1920)])
add(_ul[2], ['ברטנורא מידות ד, ז', L(643, 204)], ['ברטנורא מידות ד, ז (צר מאחוריו)', L(643, 206)], ['תוי״ט מידות ד, ז', L(948, 181)])
for _o in row('הנברשת של הילני — צורתה')['opts']:
    for _x in _o.get('refs') or []:
        if _x[0] == 'יומא לז.' and _x[1] == L(107, 893):
            retarget(_o, 'יומא לז.', new_label='יומא לז:')
for _o in row('חביתי כהן גדול — אפייה וטיגון')['opts']:           # the row's cards do not cite Chronicles; the place's card does
    drop(_o, 'דברי הימים א ט, לא', 'רלב״ג דברי הימים א ט, לא')

# ---------------------------------------------------------------- the labels whose wording was corrected (S4-08, 09, 10, 17): the old keys go
for _old in ('״וכולו היה מקורה, סטיו לפנים מסטיו״ — כל הר הבית (לחם שמים)',
             '״ומנורות של זהב היו שם... וארבעה ספלים של זהב בראשיהן״ (סוכה ה, ב)',
             'לשכת בית האבן — לרש״י ולרמב״ם: עלייה על בניין שלוש הלשכות, בקרן המזרחית־צפונית (בחירת מודל)',
             'קרן הטבלה קצוצה — ״כדי להרויח מקום המערכה״'):
    c['LABEL_MAP'].pop(_old, None)

# ---------------------------------------------------------------- LAMPS_REBBI_211 (R-08 / S4-12; the user, 15.11.2026 18:12: "5. לשנות את רבי לד' הרמבם")
# the lamps' mouths in Rebbi's east-west reading: all to the west, as the Rambam drew them (his commentary on Tamid 3:9; 575:40)
_PI = ('**פי הנרות בשיטה זו:** הרמב״ם, בפירוש המשנה (תמיד ג, ט), צייר את שבעת הנרות בין המערב ובין המזרח: ״ופיות כל הנרות לצד מערב זה לאחור זה״ — וכך במודל. '
       '״מצדדין פניהם כלפי נר אמצעי״ הובא בגמרא ליישוב שיטת רבי אלעזר ברבי שמעון, שהמנורה צפון ודרום. צורת פי הנר — בחירת מודל.')
for _o in row('כיוון המנורה והשולחן')['opts']:
    if _o['t'].startswith('רבי — מזרח ומערב'):
        _ps = _o['info'].split('\n')
        if _PI not in _ps:
            _k = next(i for i, x in enumerate(_ps) if x.startswith('במודל'))
            _ps.insert(_k, _PI)
            _o['info'] = '\n'.join(_ps)
        add(_o, ['פירוש המשניות לרמב״ם תמיד ג, ט', L(575, 40)])

# ---------------------------------------------------------------- F1-03: three labels of the 3D model opened nothing
c['LABEL_MAP'].update({'לשכת הטלאים': {'place': 'לשכת הטלאים — בבית המוקד'}, 'לשכת בית המוקד': {'place': 'בית המוקד'},
                       'כבש לסובב — לתוספות': {'place': 'כבשים קטנים — תוספות'}})

# ---------------------------------------------------------------- no paragraph twice in a card (S1-01, S2-07, R-11)
n_dup = 0
def dedupe(text):
    global n_dup
    seen, out = set(), []
    for p_ in text.split('\n'):
        if p_.strip() and p_ in seen:
            n_dup += 1
            continue
        seen.add(p_)
        out.append(p_)
    return '\n'.join(out)
# ---------------------------------------------------------------- MOCHANI_RAMBAM_211 (the user, 15.11.2026 23:45: "הרמב"ם (בפירוש
# המשניות ובמשנה תורה הלכות בית הבחירה) מפרש שמוכני היה כלי חול סובב שהקיף את הכיור... תוסיף את זה כמתג שיטה לכיור"). Every line
# read in the library on 15.11.2026: Yoma 37a (107:889), Rashi there (2157:1384), Bartenura Yoma 3:10 (582:142), Beit HaBechirah 3:18
# (337:60), the Ra'avad there (5252:20), the Kesef Mishneh there (4260:166), the Even HaAzel there (4466:45), the Rambam's commentary on
# Tamid 1:4 (575:10). The model: 40-altar.js MOCHANI_RAMBAM_211.
MO = 'המוכני של הכיור — גלגל, או כלי סביב הכיור'
MO_REFS = [['יומא ג, י', 'Mishnah_Yoma.3.10'], ['יומא לז.', L(107, 889)], ['רש״י יומא לז.', L(2157, 1384)], ['ברטנורא יומא ג, י', 'Bartenura_on_Mishnah_Yoma.3.10'],
           ['רמב״ם בית הבחירה ג, יח', 'Mishneh_Torah,_The_Chosen_Temple.3.18'], ['השגות הראב״ד בית הבחירה ג, יח', L(5252, 20)],
           ['כסף משנה בית הבחירה ג, יח', L(4260, 166)], ['אבן האזל בית הבחירה ג, יח', L(4466, 45)], ['פירוש המשניות לרמב״ם תמיד א, ד', L(575, 10)]]
_kp = place('הכיור')
c['SHITOT'] = [r for r in c['SHITOT'] if r['t'] != MO]
_mo_at = [i for i, r in enumerate(c['SHITOT']) if r['t'].startswith('בין האולם ולמזבח')][0]   # its place in the walk (rows_198.py)
c['SHITOT'].insert(_mo_at, {
  't': MO,
  'pickJs': 'const M = ctx.shared.mochani; if (M && typeof M.set === "function") M.set(k === "o1" ? "rambam" : "rashi");',
  'opts': [
    {'t': 'רש״י והראב״ד — גלגל, ומשקיעים את הכיור בבור', 'init': True, 'drawn': True, 'cam': _kp['cam'], 'tg': _kp['tg'], 'refs': MO_REFS,
     'info': 'המשנה (יומא ג, י): ״ואף הוא עשה מוכני לכיור, שלא יהיו מימיו נפסלין בלינה״; והגמרא (יומא לז.): ״מאי מוכני? אמר אביי: גילגלא דהוה משקעא ליה״.\n'
             '**רש״י** (יומא לז.): ״גלגל לשקעו בו בבור, שיהו מימיו מחוברים למימי הכיור, ואי לא הוו מיפסלי בלינה, לפי שקדשו בכלי״. וכן **הברטנורא** (יומא ג, י): ״גלגל לשקעו בבור, שיהיו מימיו מחברים בבור ולא יפסלו בלינה״.\n'
             '**הראב״ד** (השגות, בית הבחירה ג, יח): ״אנו מקובלים שהמוכני אינו מקבל מים, והוא גלגל שהיו קושרים בו את הכיור בחבל, ומשקעין אותו הוא ומימיו בבור העזרה בערב, כדי שיהיו מימיו מחוברים ולא יפסלו בלינה״.\n'
             'במודל (ברירת המחדל): הכיור תלוי בגלגל מעל הבור, וב״הדגמת המוכני״ הוא יורד לתוכו ועולה. צורת הגלגל ועומק הבור — בחירת מודל.'},
    {'t': 'הרמב״ם — כלי חול סביב הכיור, והמים שותתים ממנו', 'drawn': True, 'cam': _kp['cam'], 'tg': _kp['tg'], 'refs': MO_REFS,
     'info': '**הרמב״ם** (בית הבחירה ג, יח): ״ומוכני עשו לו שיהיו בה המים תמיד. והיא חול, כדי שלא יהיו המים שבה נפסלין בלינה, שהכיור מכלי הקדש ומקדש, וכל דבר שיתקדש בכלי קדש אם לן נפסל״.\n'
             'ובפירוש המשניות (תמיד א, ד): ״שבן קטין עשה כלי על הכיור להיות מלא מים, והיה סביב לכיור, כדי שלא יפסלו מימיו בלינה״. ובפירושו ליומא (ג, י), כלשון הכסף משנה: ״וזה עשה כלי סביב לכיור, והיו בו המים תמיד, והיו שותתין מאותו כלי לכיור כדי הצורך ראשון ראשון, ואותו הכלי היה נקרא מוכני״.\n'
             '**הכסף משנה** (בית הבחירה ג, יח) מפרש לדעתו ״גילגלא דהוה משקעא ליה״ — ״שעשה כלי עגול כגלגל סביבות הכיור, שהיה הכיור משוקע בתוכו״.\n'
             '**בקצרה —** הראב״ד חולק: ״דברים זרים אני רואה בכאן״. ו**אבן האזל** (שם) מביא שבהלכות ביאת מקדש כתב הרמב״ם כפירוש רש״י, וכותב ״שדבריו עולים בסגנון אחד, שהי׳ כלי סביב ושהיו משקעין אותו הכלי״.\n'
             'במודל: כלי עגול סביב הכיור, ובו המים, ומאותו כלי שותתים המים לכיור. צורת הכלי, מידותיו, גובהו והחומר שלו — בחירת מודל. ב״הדגמת המוכני״ יורדים הכיור והכלי שסביבו יחד, כדברי אבן האזל — בחירת מודל.'},
  ]})
c['LABEL_MAP']['המוכני לרמב״ם — כלי סביב הכיור, ובו המים (בית הבחירה ג, יח)'] = {'place': 'הכיור'}
_MO_BRIEF = ('**בקצרה —** המחלוקת בכרטיס זה (הפירוט — במתג ״המוכני של הכיור״, בתפריט תחת ״שיטות ומחלוקות״):\n'
             '• לרש״י, לראב״ד ולברטנורא — המוכני הוא גלגל, ובו משקיעים את הכיור בבור בערב (ברירת המחדל).\n'
             '• לרמב״ם — המוכני הוא כלי חול סביב הכיור, ובו המים תמיד, ומהם שותתים לכיור כדי הצורך (בית הבחירה ג, יח; פירוש המשניות תמיד א, ד).')
for _t, _mark, _add in (('הכיור', 'במודל: הכיור דרומית למעלות האולם', ' ובמתג ״המוכני של הכיור״ — לשיטת הרמב״ם: כלי סביב הכיור, ובו המים.'),
                        ('הדגמת המוכני — הכיור יורד לבור ועולה', 'בהדגמה: בערב הגלגל מסתובב', ' לשיטת הרמב״ם (במתג ״המוכני של הכיור״) יורד עם הכיור גם הכלי שסביבו, כדברי אבן האזל — בחירת מודל.')):
    _pl = place(_t)
    _ps = _pl['info'].split('\n')
    if not any(x.startswith('**בקצרה —** המחלוקת בכרטיס זה (הפירוט — במתג ״המוכני') for x in _ps):
        _i = [j for j, x in enumerate(_ps) if x.startswith(_mark)][0]
        _ps[_i] = _ps[_i] + _add
        _ps.insert(_i, _MO_BRIEF)
        _pl['info'] = '\n'.join(_ps)
    add(_pl, *MO_REFS)

# ---------------------------------------------------------------- FORM_212 (the user's choice "ב", 16.11.2026): the Rambam's "מכסה
# גבוה יורד בגלגל" (his commentary on Tamid 3:8) is the same vessel - as the Tosafot Yom Tov (Tamid 1:4) and the Even HaAzel read it;
# no form of its own. The source in the Rambam's option, the brief and the demonstration's sentence.
_o = [o for o in row(MO)['opts'] if o['t'].startswith('הרמב״ם — כלי חול')][0]
_ps = _o['info'].split('\n')
_add = ('ובפירוש המשניות (תמיד ג, ח): ״ושם נתבאר שהמוכני שעשה בן קטין היה מכסה גבוה יורד בגלגל, והיא מה שאמר: מאי מוכני — גלגלא דהוו משקעי ליה, והיו שומעין לגלגול הגלגל ההוא״. **התוספות יום טוב** (תמיד א, ד) מביא את הלשון הזאת (בנוסחו: ״מכסה [עולה] ויורד בגלגל״), '
        'וכותב: ״אבל מלשונו זה שבפי׳ בפ״ג דלקמן מוכח שדבריו עולים בסגנון אחד, שהיה כלי סביב ושהיו משקעים אותו הכלי״.')
if not any(x.startswith('ובפירוש המשניות (תמיד ג, ח)') for x in _ps):
    _k = [j for j, x in enumerate(_ps) if x.startswith('**הכסף משנה**')][0]
    _ps.insert(_k, _add)
_ps = [x.replace('ב״הדגמת המוכני״ יורדים הכיור והכלי שסביבו יחד, כדברי אבן האזל — בחירת מודל.',
                 'ב״הדגמת המוכני״ יורד הכלי שסביב הכיור — ״שהיו משקעים אותו הכלי״, כתוספות יום טוב ואבן האזל; ושהכיור יורד עמו — בחירת מודל.') for x in _ps]
_o['info'] = '\n'.join(_ps).replace(', וכותב ״שדבריו עולים בסגנון אחד, שהי׳ כלי סביב ושהיו משקעין אותו הכלי״.', ', ומביא את דברי התוספות יום טוב שלמעלה.')   # (the same words just above, in the TYT's own name)
for _r in [['פירוש המשניות לרמב״ם תמיד ג, ח', L(575, 38)], ['תוספות יום טוב תמיד א, ד', L(944, 45)]]:
    if _r not in _o['refs']: _o['refs'] = _o['refs'] + [_r]
for _pl in (place('הכיור'), place('הדגמת המוכני — הכיור יורד לבור ועולה')):
    _pl['info'] = _pl['info'].replace('ומהם שותתים לכיור כדי הצורך (בית הבחירה ג, יח; פירוש המשניות תמיד א, ד).',
        'ומהם שותתים לכיור כדי הצורך (בית הבחירה ג, יח; פירוש המשניות תמיד א, ד); ובפירושו לתמיד (ג, ח): ״מכסה גבוה יורד בגלגל״ — ולתוספות יום טוב הוא אותו הכלי.')
    add(_pl, *[['פירוש המשניות לרמב״ם תמיד ג, ח', L(575, 38)], ['תוספות יום טוב תמיד א, ד', L(944, 45)]])

# ---------------------------------------------------------------- NOTE 1 = U-12 (the user, 15.11.2026 23:38 "שמות - אפשרות ב"; 23:38 "לגבי
# הרמבם הראבד רק מתאר את הרמבם" - the default keeps its name). Ri's three readings by their order in the Tosafot (Yoma 52a): the first;
# "אי נמי נראה לר״י"; "עוד פר״י". The 3D titles (50-heichal.js CELLS_LBL) and their cards (LABEL_MAP) follow.
_RI = {'ri': 'ר״י, פירוש ראשון — כותל ההיכל שבע למטה', 'riB': 'ר״י, פירוש שני — חצי אמה מכל כותל', 'riC': 'ר״י, פירוש שלישי — התא התחתון שש'}
for _o in row('צורת התאים')['opts']:
    if _o.get('key') in _RI:
        _o['t'] = _RI[_o['key']]
    if _o.get('key') == 'rashi':   # U-12 (3): the seventeenth amah, said so that it can be followed
        _o['info'] = _o['info'].replace('כותל התא **שש** (בחירת מודל, להשלמת האמה השבע עשרה שבמשנה ד, ז).',
            'כותל התא **שש**: במשנה (ד, ז) כותל התא, התא וכותל ההיכל הם יחד שבע עשרה אמה; בשיטה זו התא התחתון חמש בלבד, והאמה החסרה ניתנה במודל לכותל התא — שש במקום חמש (בחירת מודל).')
for _old, _new in (('צורת התאים — ר״י בתוספות', 'צורת התאים — ר״י, פירוש ראשון'), ('צורת התאים — ר״י, אי נמי', 'צורת התאים — ר״י, פירוש שני'), ('צורת התאים — ר״י, עוד', 'צורת התאים — ר״י, פירוש שלישי')):
    if _old in c['LABEL_MAP']:
        c['LABEL_MAP'][_new] = c['LABEL_MAP'].pop(_old)

# ---------------------------------------------------------------- NOTE 2 = U-14 (the understandability review): the small ramps' one paragraph
# of 1,100 letters, "ראשו" for both ends, two sentences on the ramp to the yesod without saying whose - the same facts and the same
# quotes, one subject to a paragraph, each opening with its subject in bold. (The user's own words of the morning are kept: "הכבש צריך
# להיות ממש המשך לסובב".)
import re as _re
_SR_RX = _re.compile(r'שני הכבשים הקטנים יוצאים מגוף הכבש הגדול[^\n]*?ואין לה דרך להגיע לאמת היסוד\.')
_SR_TXT = '\n'.join([
  'שני הכבשים הקטנים יוצאים מגוף הכבש הגדול (״יוצאים ממנו״, רמב״ם ב, יד). רש״י (זבחים סב:): ״אותו שפונין בו לסובב יצא במזרחו של כבש לימין ויוצא ומתחיל בשפולו של כבש ונמשך ועולה באלכסון עד שמגיע לסובב״.',
  '**הכבש העולה לסובב** (ולתוספות — שני הכבשים העולים לסובב), במודל: הוא יוצא מצד הכבש הגדול בשליש התחתון שלו, ״בשפולו של כבש״. בתחילתו הוא צמוד לכבש הגדול ובגובה הילוכו; משם הוא פונה ממנו באלכסון ועולה במתינות, ובינו לבין הכבש הגדול אוויר גמור עד הרצפה. קצהו העליון חתוך לאורך שפת הסובב ובגובהה — כהמשך לסובב — ובכל זאת ״ומובדלין מן המזבח מלא נימא״. כמה הוא נוטה ורוחבו — בחירת מודל.',
  '**הכבש היורד ליסוד — לרש״י:** ״והפונה ליסוד יוצא למערבו... פונה לשמאלו ליסוד דרומי, ומתחיל לצאת בשיפולו של כבש רחוק מן המזבח, כדי שיהא נוח לשפע ולירד ליסוד״. במודל הוא הולך באלכסון מצלעו המערבית של הכבש הגדול אל אמת היסוד שבקרן הדרומית־מערבית (מידות ג, א: ״ואוכל בדרום אמה אחת״), כציור התוספות יום טוב והתפארת ישראל.',
  '**הכבש היורד ליסוד — לתוספות,** כביאור התוספות יום טוב (זבחים ו, ג): הוא צמוד לכבש השלישי מבחוץ, לאורכו, מאותו שליש עד הקרן הדרומית־מערבית של היסוד — כבש אחד רחב, ומקצתו מוגבה עד הסובב.',
  '**שלא צויר:** כבש ליסוד הצמוד לכבש הגדול — אינו מוכרח מן המקורות, ואין לו דרך להגיע אל אמת היסוד.'])
_n_sr = 0
for _card in every_card():
    if isinstance(_card.get('info'), str) and _SR_RX.search(_card['info']):
        _card['info'] = _SR_RX.sub(lambda m: '\n' + _SR_TXT, _card['info']).replace(' \nשני הכבשים הקטנים יוצאים', '\nשני הכבשים הקטנים יוצאים'); _n_sr += 1
assert _n_sr in (0, 4), _n_sr
print('small ramps paragraph split:', _n_sr)

# NOTE 5 (U-47): the ramp's ways seen from above the south-east, the whole ramp to the right of the card (which stands on the left)
place('עולים במזרח ויורדים במערב — הכבש').update({'cam': [86, 44, 50], 'tg': [50, 13, 38]})

# NOTE 6 (U-48, 1): the place's view shows the blue and the orange; the green is behind the eye - said in the card
_rv = place('הרובד הרביעי — ביום הכיפורים')
_RVS = ' במבט של מקום זה: הכחול והכתום — לפניך, באולם ולפניו; הירוק — ליד רגל הכבש, מאחוריך.'
if _RVS.strip() not in _rv['info']:
    _ps = _rv['info'].split('\n')
    _i = [j for j, x in enumerate(_ps) if x.startswith('במודל: ארבע שורות לכל מניין')][0]
    _ps[_i] = _ps[_i] + _RVS
    _rv['info'] = '\n'.join(_ps)
# (NOTE 6, U-48 3 - a slanted eye for the seals chamber was tried and dropped: from lower the walls hid the four bowls)
# NOTE 8 (U-55): the officers' map a little wider and to the west, so that 13 and 14 are not under the card
place('הממונים שבמקדש').update({'cam': [34, 330, 140], 'tg': [34, 10, -5]})

# THE USER (16.11.2026 02:47, a picture of "שערי חולדה": the wall between the two gates filled the view - one gate under the card, the
# other at the window's edge): both gates in the picture - further back and higher, the target a little west, so that the pair stands
# between the card (left) and the panel (right)
place('שערי חולדה').update({'cam': [40, 52, 540], 'tg': [40, 11, 340]})   # 200 back: both gates clear of the card and the panel in a window 1000 wide too (150 back: under them)

for _card in every_card():
    if isinstance(_card.get('info'), str):
        _card['info'] = dedupe(_card['info'])
for _k, _v in list(c['INFO'].items()):
    if isinstance(_v, str):
        c['INFO'][_k] = dedupe(_v)

json.dump(c, open(P, 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
print('rows_211r ok; doubled paragraphs removed:', n_dup)
