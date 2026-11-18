#!/usr/bin/env python3
# round 3.0.3: GI_OFF_303 - the light bounced from the walls (HQ_302's screen-space GI) is cancelled, in both houses.
#   python3 -I tools/round-3.0.3/gi_off_patch.py src/90-entry.js
#   python3 -I tools/round-3.0.3/gi_off_patch.py sheni-src/bundle.js      (then tools/safe-lines.mjs and node --check)
import sys

path = sys.argv[1]
s = open(path, encoding='utf-8').read()
SH = path.endswith('bundle.js')
old = ('      hq: { get ao() { return ent_hq.S.ao; }, get gi() { return ent_hq.S.gi; }, giReady: true, set: (aoOn, giOn) => '
       'ent_hq.set(aoOn, giOn) }   // HQ_302')
if SH:
    old += ' //'
new = ('      // GI_OFF_303 (the user, 18.11.2026, over a picture of the heichal: "טכנולוגיית האור החוזר אתה מבטל עכשיו! לא לזה התכוונתי, אא\\"כ\n'
       '      // זה באג"; "תראה את העמעום מה זה האפור הזה?"): with both light rows on, the bounce\'s own ambient occlusion (radius 12 amot, 2\n'
       '      // slices of 6 steps a pixel, no filter over time) took the place of the soft corner shadow, and every floor and wall came out\n'
       '      // dimmed grey in blotches, the bounced light itself speckled - not a slip of the code but the method at a cost a weak computer\n'
       '      // can bear. The row "אור חוזר מהקירות" is gone (giReady false: 70-ui.js builds no row and reads no stored "tm.hq.gi") and the\n'
       '      // bounce is never drawn, whatever is asked; "צל רך בפינות" (GTAO) stays. The GI code stays in 85-hq.js, idle.\n'
       '      hq: { get ao() { return ent_hq.S.ao; }, get gi() { return false; }, giReady: false, set: (aoOn) => ent_hq.set(aoOn, false) }   // HQ_302; GI_OFF_303')
k = s.count(old)
if k != 1:
    sys.exit('anchor found %d times' % k)
s = s.replace(old, new)
open(path, 'w', encoding='utf-8').write(s)
print(path, 'GI_OFF_303: 1 edit')
