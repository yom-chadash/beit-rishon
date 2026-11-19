#!/usr/bin/env python3
# round 3.0.4 - EXIT_BACK_304 (בית ראשון 1.4.13): in "דבקו שערים" the four priests leave the Holy of Holies BACKWARD, their faces to it.
# The user, 19.11.2026 19:07: "הכהנים שהכניסו את הארון יוצאים ופניהם לאולם ואחוריהם לבית קה"ק. ולכאורה לא כן הוא אלא כשיוצאים
# מבית קה"ק צריך לצאת ואחוריהם לאולם ופניהם לקה"ק כדי לא להפנות את גבם לשכינה, כמו הכה"ג כשיצא ביוהכ"פ מקוה"ק. תקן".
# Sources (read in the library): the Rambam, Beit HaBechira 7:4 (337:114) "כל שהשלים עבודה ונסתלק לו אינו יוצא ואחוריו להיכל, אלא
# מהלך אחורנית מעט מעט ומהלך בנחת על צדו עד שיצא מן העזרה"; Avodat Yom HaKippurim 4:1 (342:32) "והוא מהלך אחורנית מעט מעט פניו לקדש
# ואחוריו להיכל עד שיצא מן הפרכת"; Yoma 53a (107:1375) "וכן כהנים בעבודתן... כשהן נפטרין לא היו מחזירין פניהן והולכין".
# Run from the repository's root: python3 -I tools/round-3.0.4/ark_back_patch.py
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

p = 'src/58-ark.js'
s = rd(p)
s = once(s, "        p.v = front ? 4.4 : 4.0;\n",
         "        p.v = front ? 3.8 : 3.5;   // EXIT_BACK_304: \"מהלך אחורנית מעט מעט\" - a little slower than the walk in (4.4 / 4.0 until 1.4.12)\n",
         p + ' speed')
OLD = """          if (done) {
            const tEnd = T.lower1 + 0.5 + p.len[p.len.length - 1] / p.v, w = ease((t - tEnd) / 0.6);
            p.g.rotation.y = yaw + (-Math.PI / 2 - yaw) * w;
            walkPose(p, 0, 0, false, 0);
          } else {
            p.g.rotation.y = yaw;
            walkPose(p, (d * Math.PI) / 0.85 + (p.front ? 0 : Math.PI), u < 0.3 ? u / 0.3 : 1, false, 0);
          }"""
NEW = """          // EXIT_BACK_304 (the user, 19.11.2026: "כשיוצאים מבית קה"ק צריך לצאת ואחוריהם לאולם ופניהם לקה"ק"): all the way out - round
          // the staffs' ends and through the heichal - each priest faces west, to the Holy of Holies, as he stood when the ark was set
          // down, and goes BACKWARD: the Rambam, Beit HaBechira 7:4 "כל שהשלים עבודה ונסתלק לו אינו יוצא ואחוריו להיכל, אלא מהלך
          // אחורנית מעט מעט"; Avodat Yom HaKippurim 4:1 (the High Priest) "פניו לקדש ואחוריו להיכל". Until 1.4.12 he turned to the way
          // he went (yaw), his back to the house, and turned back to it only at the end.
          void yaw;
          p.g.rotation.y = -Math.PI / 2;
          if (done) walkPose(p, 0, 0, false, 0);
          else walkPose(p, (d * Math.PI) / 0.85 + (p.front ? 0 : Math.PI), u < 0.3 ? u / 0.3 : 1, false, 0);"""
s = once(s, OLD, NEW, p + ' apply')
s = once(s, '      [T.cloud0, "״ויהי בצאת הכהנים מן הקדש והענן מלא את בית ה׳״ (מלכים א ח, י)"],',
         '      [T.cloud0, "״ויהי בצאת הכהנים מן הקדש והענן מלא את בית ה׳״ (מלכים א ח, י). והכהנים יוצאים לאחוריהם, פניהם אל הקודש: ״אינו יוצא ואחוריו להיכל, אלא מהלך אחורנית מעט מעט״ (רמב״ם, בית הבחירה ז, ד)"],   // EXIT_BACK_304',
         p + ' caption')
wr(p, s)

p = 'src/70-ui.js'
s = rd(p)
ANCHOR = '\\n**הנושאים:** ״ומנא לן דבארבעה הוו דרו להו?'
k = s.count(ANCHOR)
if k != 1:
    sys.exit('70-ui.js info anchor found %d times' % k)
ADD = ('\\n**היציאה מקודש הקדשים:** אחרי שהניחו את הארון, הכהנים יוצאים לאחוריהם — פניהם אל קודש הקדשים, ואחוריהם אל ההיכל. '
       'הרמב״ם (בית הבחירה ז, ד): ״כל שהשלים עבודה ונסתלק לו אינו יוצא ואחוריו להיכל, אלא מהלך אחורנית מעט מעט ומהלך בנחת על צדו עד '
       'שיצא מן העזרה״; וכן בכהן הגדול ביום הכיפורים (עבודת יום הכפורים ד, א): ״והוא מהלך אחורנית מעט מעט, פניו לקדש ואחוריו להיכל, '
       'עד שיצא מן הפרכת״. ובגמרא (יומא נג.): ״וכן כהנים בעבודתן... כשהן נפטרין — לא היו מחזירין פניהן והולכין״.')
s = s.replace(ANCHOR, ADD + ANCHOR)
s = once(s, '["רלב״ג מלכים א ח, נד", { book: 3645, index: 386 }], ["מלבי״ם דברי הימים ב ו, יג", { book: 3364, index: 147 }]] });',
         '["רלב״ג מלכים א ח, נד", { book: 3645, index: 386 }], ["מלבי״ם דברי הימים ב ו, יג", { book: 3364, index: 147 }],\n'
         '            ["רמב״ם בית הבחירה ז, ד", { book: 337, index: 114 }], ["רמב״ם עבודת יום הכפורים ד, א", { book: 342, index: 32 }], ["יומא נג.", { book: 107, index: 1375 }]] });   // EXIT_BACK_304',
         p + ' refs')
NEWS = ("**הכנסת הארון — הכהנים יוצאים לאחוריהם** — בהדגמה ״דבקו שערים״, אחרי שארבעת הכהנים מניחים את הארון בקודש הקדשים, הם יוצאים "
        "עכשיו לאחוריהם: פניהם אל קודש הקדשים, ואחוריהם אל ההיכל, עד שהם עומדים באולם. כך כתב הרמב״ם (בית הבחירה ז, ד): ״כל שהשלים "
        "עבודה ונסתלק לו אינו יוצא ואחוריו להיכל, אלא מהלך אחורנית מעט מעט״, וכך יצא גם הכהן הגדול מקודש הקדשים ביום הכיפורים. עד "
        "עכשיו הם הסתובבו ויצאו כשפניהם אל האולם וגבם אל קודש הקדשים.")
import json
s = once(s, '    ["1.4.12", [', '    ["1.4.13", [' + json.dumps(NEWS, ensure_ascii=False) + ']],   // EXIT_BACK_304\n    ["1.4.12", [', p + ' news')
wr(p, s)

p = 'src/75-tour.js'
s = rd(p)
s = once(s, 'השערים נפתחים, הארון נכנס תחת כנפי הכרובים, והענן ממלא את הבית.",',
         'השערים נפתחים, הארון נכנס תחת כנפי הכרובים, והכהנים יוצאים לאחוריהם, פניהם אל הקודש (רמב״ם בית הבחירה ז, ד), והענן ממלא את הבית.",   // EXIT_BACK_304',
         p + ' slide')
s = once(s, '["ח, ו", ["V", 10, 8, 6]], ["דברי הימים ב ו, מב", ["V", 39, 6, 42]]] },',
         '["ח, ו", ["V", 10, 8, 6]], ["דברי הימים ב ו, מב", ["V", 39, 6, 42]], ["רמב״ם בית הבחירה ז, ד", ["L", 337, 114]]] },',
         p + ' slide refs')
wr(p, s)
print('EXIT_BACK_304: 58-ark.js, 70-ui.js, 75-tour.js patched')
