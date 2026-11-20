# SHILOACH_305 (3.0.5) - the Shiloach, its pool and the path to it, and the demonstration of the water's libation (the user,
# 20.11.2026 01:21 / 01:25: "1. א 2. זו 3. כהן"). The code: shiloach.js (inserted in buildTamid before the rejoicing's block).
# Run in the chain after rings_patch.py: python3 -I tools/round-3.0.5/shiloach_patch.py
import os, sys

def once(s, old, new, what):
    k = s.count(old)
    if k != 1:
        sys.exit('%s: anchor found %d times' % (what, k))
    return s.replace(old, new)

HERE = os.path.dirname(os.path.abspath(__file__))
p = 'sheni-src/bundle.js'
s = open(p, encoding='utf-8').read()
if 'SHILOACH_305' in s:
    sys.exit('already applied')
code = open(os.path.join(HERE, 'shiloach.js'), encoding='utf-8').read()
anchor = '    // ---------- SIMCHA_304 (the user, 19.11.2026 19:09:'
if s.count(anchor) != 1:
    sys.exit('simcha anchor: %d' % s.count(anchor))
s = s.replace(anchor, code + anchor)
# the demonstrations' list and the tree (after the gates of Chulda)
s = once(s, '          { t: "הדלקת מנורות הזהב בעזרת נשים", place: "מנורות של זהב — שמחת בית השואבה" }   // DEMOLIST_305: the lamps alone, kept (the user, 23:49) //\n',
         '          { t: "הדלקת מנורות הזהב בעזרת נשים", place: "מנורות של זהב — שמחת בית השואבה" },   // DEMOLIST_305: the lamps alone, kept (the user, 23:49) //\n'
         '          { t: "ניסוך המים — מן השילוח", place: "ניסוך המים מן השילוח — הדגמה" }   // SHILOACH_305 //\n', 'demos list')
lines = s.split('\n')
hits = [i for i, l in enumerate(lines) if l.startswith('          { t: "שערי חולדה", tg: [40, 11, 340]')]
if len(hits) != 1:
    sys.exit('chulda place: %d' % len(hits))
lines.insert(hits[0] + 1,
    '          { t: "מעיין השילוח", tg: [30, -53, 545], cam: [6, -24, 506], info: (ctx.shared.shiloach || {}).info || "", refs: (ctx.shared.shiloach || {}).refs || [] },   // SHILOACH_305 //')
lines.insert(hits[0] + 2,
    '          { t: "ניסוך המים מן השילוח — הדגמה", action: () => { const S = ctx.shared.shiloach; if (S && typeof S.demo === "function") S.demo(); }, info: (ctx.shared.shiloach || {}).info || "", refs: (ctx.shared.shiloach || {}).refs || [] },   // SHILOACH_305 //')
s = '\n'.join(lines)
# the entry: a demonstration far from the mount and under its ground (the Shiloach) widens the view's limits for its walk and gives
# them back (ctx.shared.viewLimits), and may let the eye down into the valley (ctx.shared.camLow; otherwise the floor of the world, -27.5)
s = once(s, '  ctx.shared.floorY = (x, y, z) => cam_floorY({ x, y, z }); //\n',
         '  ctx.shared.floorY = (x, y, z) => cam_floorY({ x, y, z }); //\n'
         '  ctx.shared.viewLimits = { get: () => ({ R: ent_view.R, yMin: ent_view.yMin, yMax: ent_view.yMax }), set: (o) => { if (o) Object.assign(ent_view, o); }, include: (q) => ent_viewInclude(q) };   // SHILOACH_305: the Shiloach\'s walk //\n', 'view limits')
s = once(s, '        const lo = Math.max(-27.5, !ent_wm.on && isFinite(cam.floorY) ? cam.floorY + 0.35 : -Infinity); //\n',
         '        const lo = Math.max(typeof ctx.shared.camLow === "number" ? ctx.shared.camLow : -27.5, !ent_wm.on && isFinite(cam.floorY) ? cam.floorY + 0.35 : -Infinity);   // SHILOACH_305: ctx.shared.camLow - the walk in the valley //\n', 'cam low')
open(p, 'w', encoding='utf-8').write(s)
print('SHILOACH_305 applied')
