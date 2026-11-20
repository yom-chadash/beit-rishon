#!/usr/bin/env python3
# BARKAI_LIGHT_306 - the light of "ברקאי" seen when it is called (the second house's morning demonstration).
# A report sent on to the user (20.11.2026 14:21): "כשהרואה אומר ברקאי לא רואים את האור"; the user: V (fix). Checked: in the stage
# "ברקאי — עלות השחר" (16 s; the watcher's call at 7.8 s, "האיר פני כל המזרח" at 12 s) the sky was black to the stage's end: the sky's
# measure (skyAt) began to grow only at 2 s and reached the night kit's phase "barkai" (the sun 7 degrees under the horizon - still dark)
# at 14 s, and the next stages went on from there. The Mishnah: "צאו וראו אם הגיע זמן השחיטה. אם הגיע, הרואה אומר, ברקאי" (Tamid 3:2;
# Bartenura: "האיר והבריק השחר"; the Rambam, Temidin 1:2: "משיאור פני כל מזרח") - the light is there when he calls. Now the east
# lights while he goes up and looks (the night kit's "heir", its glow seen, by 7.4 s), and a little more ("האיר פני כל המזרח", the sun 2 degrees under the
# horizon, its glow seen in the east) by 11.8 s; the next stages go on from "heir" to the morning. The measures - model choices.
import sys
p = 'sheni-src/bundle.js'
s = open(p, encoding='utf-8').read()
if 'BARKAI_LIGHT_306' in s:
    sys.exit('BARKAI_LIGHT_306 already applied')
def once(old, new, what):
    global s
    k = s.count(old)
    if k != 1:
        sys.exit('%s: %d' % (what, k))
    s = s.replace(old, new)
once('      if (i === kB) return 1.2 * smooth(clamp((sec - 2) / 12, 0, 1)); //\n'
     '      const n = list.length - 1 - kB, v = (k) => 1.2 + 1.8 * (k - kB) / Math.max(1, n); //\n',
     '      // BARKAI_LIGHT_306 (a report sent on to the user: "כשהרואה אומר ברקאי לא רואים את האור"): the east lights while the watcher goes //\n'
     '      // up and looks - the night kit\'s "heir", whose glow is the first seen in the east, by 7.4 s (his call, 7.8 s: "אם הגיע, הרואה //\n'
     '      // אומר, ברקאי", Tamid 3:2) - and a little more by 11.8 s ("האיר פני כל המזרח", 12 s), the sun still under the horizon //\n'
     '      // ("קודם שתעלה החמה", the Rambam, Temidin 1:2). The next stages: the dawn to the stage of the Shema (the sun at the horizon by //\n'
     '      // its end), then the morning. Until 2.0.14 the light began at 2 s and was only at "barkai" (still dark) at 14 s. Model choices //\n'
     '      if (i === kB) return sec < 7.4 ? 2.0 * smooth(clamp((sec - 1.4) / 6.0, 0, 1)) : 2.0 + 0.08 * smooth(clamp((sec - 7.4) / 4.4, 0, 1)); //\n'
     '      const n = list.length - 1 - kB, kS = list.indexOf("shema"); //\n'
     '      const v = (k) => kS > kB + 1 && kS < list.length - 1 ? (k <= kS ? lerp(2.08, 2.18, (k - kB) / (kS - kB)) : lerp(2.18, 3.0, (k - kS) / (list.length - 1 - kS))) : lerp(2.08, 3.0, (k - kB) / Math.max(1, n)); //\n', 'skyAt')
open(p, 'w', encoding='utf-8').write(s)
print('BARKAI_LIGHT_306 applied')

# the same in the lotteries' demonstration (55-payis.js, "ארבעת הפייסות ו״ברקאי״"): the sky went from "alot" to "barkai" (still dark) by
# the call and to "heir" only during Mattiya ben Shmuel's words - now from "alot" to "heir" while the watcher goes up (from 9 s), its
# glow seen at the call, held there through "האיר פני כל המזרח", then on to the morning as before
s = open(p, encoding='utf-8').read()
if 'BARKAI_LIGHT_306 (the lotteries' not in s:
    def once2(old, new, what):
        global s
        k = s.count(old)
        if k != 1:
            sys.exit('%s: %d' % (what, k))
        s = s.replace(old, new)
    once2('      sky(13.5, "alot", "barkai"); //\n',
          '      sky(9, "alot", "heir");   // BARKAI_LIGHT_306 (the lotteries\' demonstration): the east lit by the call ("ברקאי") - until 2.0.14 "alot" to "barkai" (dark) //\n', 'payis sky 1')
    once2('      sky(4, "barkai", "heir"); //\n',
          '      sky(0, "heir");   // BARKAI_LIGHT_306: held through "האיר פני כל המזרח" //\n', 'payis sky 2')
    open(p, 'w', encoding='utf-8').write(s)
    print('BARKAI_LIGHT_306: the lotteries\' demonstration too')
