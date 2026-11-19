#!/usr/bin/env python3
# round 3.0.4 (בית שני 2.0.13) - LIVE_FIRE_304 (the user, 19.11.2026 20:43: "האש בלפידים צריכה להיות ממש חיה. אש אש אמיתית, ולא מה
# שעשית עכשיו") and PEOPLE_LOD_304 (20:44: "הכמות האנשים צריכה להיות הרבה יותר גדולה, צריך להיות ממש צפוף בכל העזרה הזאת"):
#  1. 40-altar.js: ctx2.shared.liveFlame(parent, x, y, z, r, h, op) - the altar's live fire (1.0.28: a camera-facing quad with a noise
#     shader, animated by the altar's loop) for other modules: the torches of the rejoicing (63-simcha, SIMCHA_304) and the golden
#     lamps' cups;
#  2. 63-simcha (SIMCHA_MENOROT_211): the sixteen cups burn with it (the soft sprite only where it is missing);
#  3. the people kit (PEOPLE_KIT_204, this house's copy only): crowd(..., { lodK, minLv }) - a crowd that changes to its plainer
#     levels sooner (its distances multiplied by lodK; 1 as before) and, with minLv 1, never takes the full figure - for the
#     thousands of the rejoicing (measured: 4,300 figures, +0.6 million triangles and some 350 draws in the views of the run).
# Run from the repository's root, before simcha_patch.py: python3 -I tools/round-3.0.4/live_fire_patch.py
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
if 'LIVE_FIRE_304' in s:
    sys.exit('already applied')

# 1. the altar's fire, lent
s = once(s, '''      (parent || mv).add(m); //
      flames.push(m); //
      return m; //
    }; //
''', '''      (parent || mv).add(m); //
      flames.push(m); //
      return m; //
    }; //
    // LIVE_FIRE_304: the same live fire for the other modules - the torches of the rejoicing of the water-drawing and the golden lamps' //
    // cups (63-simcha); the flame stands on (x, y, z) in `parent`, r its half-breadth, h its height (amot), op its strength //
    ctx2.shared.liveFlame = (parent, x, y, z, r, h, op) => addFlame(x, y, z, r, h, 16758832, op == null ? 0.9 : op, parent); //
''', 'addFlame')

# 2. the lamps' cups
s = once(s, '''          const fl = new Sprite(new SpriteMaterial({ map: ftx, transparent: true, depthWrite: false, blending: AdditiveBlending })); //
          fl.position.set(cx, TOPY + 1.25, cz); fl.scale.set(0.9, 1.8, 1); fl.visible = false; fl.renderOrder = 9; fl.userData = { noPick: true, ph: flames.length * 1.3 }; //
          MG.add(fl); flames.push(fl); //
''', '''          // LIVE_FIRE_304: the cup burns with the altar's live fire (40-altar.js, ctx2.shared.liveFlame) - "הפתילה העבה ביותר והבעירוה" //
          // (the Tiferet Yisrael, 772:518); the soft sprite only where that fire is missing //
          const live = typeof SH.liveFlame === "function" ? SH.liveFlame(MG, cx, TOPY + 0.42, cz, 0.36, 1.3, 1.0) : null; //
          const fl = live || new Sprite(new SpriteMaterial({ map: ftx, transparent: true, depthWrite: false, blending: AdditiveBlending })); //
          if (!live) { fl.position.set(cx, TOPY + 1.25, cz); fl.scale.set(0.9, 1.8, 1); fl.renderOrder = 9; MG.add(fl); } //
          fl.visible = false; fl.userData.noPick = true; fl.userData.ph = flames.length * 1.3; flames.push(fl); //
''', 'cups')
s = once(s, "        for (const f of flames) if (f.visible) { const k = 0.85 + 0.15 * Math.sin(now * 9 + f.userData.ph)",
         "        for (const f of flames) if (f.visible && f.isSprite) { const k = 0.85 + 0.15 * Math.sin(now * 9 + f.userData.ph)", 'cups flicker')

# 3. the people kit: lodK
s = once(s, '      LOD.push({ near, mid, far, anchor, R: R * 1.0, lv: 1 }); //\n',
         '      LOD.push({ near, mid, far, anchor, R: R * 1.0, lv: 1, k: o.lodK > 0 ? o.lodK : 1, min: o.minLv | 0 });   // PEOPLE_LOD_304: lodK, minLv (this house\'s copy) //\n', 'LOD push')
s = once(s, '        else lv = d < 20 ? 0 : d < 110 ? 1 : 2; //\n',
         '        else lv = d < 20 ? 0 : d < 110 ? 1 : 2; //\n        if (lv < e.min) lv = e.min;   // PEOPLE_LOD_304: a crowd that never takes the full figure (minLv 1) //\n', 'LOD min')
s = once(s, '        const d = Math.max(0, wp.distanceTo(cam.position) - e.R) * f; //\n',
         '        const d = Math.max(0, wp.distanceTo(cam.position) - e.R) * f * e.k; //\n', 'LOD d')
wr(p, s)
print('LIVE_FIRE_304, PEOPLE_LOD_304 applied')
