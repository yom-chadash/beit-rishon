#!/usr/bin/env python3
# round 3.0.3, the way down to the bath (בית שני): MESIBAH_303 - by text anchors on the readable bundle (sheni-src/bundle.js),
# after sfalim_patch.py.
#   python3 -I tools/round-3.0.3/mesibah_patch.py sheni-src/bundle.js
# then: node tools/safe-lines.mjs sheni-src/bundle.js && node --check sheni-src/bundle.js
import sys, os, json

path = sys.argv[1]
here = os.path.dirname(os.path.abspath(__file__))
s = open(path, encoding='utf-8').read()
n_edits = 0

def rep(old, new, count=1):
    global s, n_edits
    k = s.count(old)
    if k != count:
        sys.exit('anchor found %d times (want %d): %r' % (k, count, old[:120]))
    s = s.replace(old, new)
    n_edits += 1

def block(name):
    return open(os.path.join(here, name), encoding='utf-8').read()

# 1. a piece of a box cut round a hole keeps the whole box's texture (30-courts.js, after boxHoles)
rep("      return made; //\n    }; //\n",
    "      return made; //\n    }; //\n"
    "    // MESIBAH_303: the pieces of a box cut round a hole (boxHoles) - their texture as the whole box's (BoxGeometry's faces in amot, as //\n"
    "    // uvWorldBox; the box's extent x0..x1, y0..y1, z0..z1; the group unmoved) //\n"
    "    const uvLike = (m, x0, x1, y0, y1, z0, z1) => { //\n"
    "      const p = m.geometry.attributes.position, n = m.geometry.attributes.normal, uv = m.geometry.attributes.uv, o = m.position; //\n"
    "      for (let i = 0; i < p.count; i++) { //\n"
    "        const x = p.getX(i) + o.x, y = p.getY(i) + o.y, z = p.getZ(i) + o.z, nx = n.getX(i), ny = n.getY(i), nz = n.getZ(i); //\n"
    "        if (nx > 0.5) uv.setXY(i, z1 - z, y - y0); else if (nx < -0.5) uv.setXY(i, z - z0, y - y0); //\n"
    "        else if (ny > 0.5) uv.setXY(i, x - x0, z1 - z); else if (ny < -0.5) uv.setXY(i, x - x0, z - z0); //\n"
    "        else if (nz > 0.5) uv.setXY(i, x - x0, y - y0); else uv.setXY(i, x1 - x, y - y0); //\n"
    "      } //\n"
    "      uv.needsUpdate = true; //\n"
    "    }; //\n")

# 2. Beit HaMoked's base: the mouth goes through it (the stair's shaft, 3.5 by 3.5)
rep("      H2.box(g, W, 13.5, 7.5, M2.stone, X, 0, -73.75); //\n",
    "      // MESIBAH_303: the mouth of the way down to the bath (the north-west chamber) goes through the base as well - the base in pieces //\n"
    "      // round it, its stone's texture as one //\n"
    "      { const [hx, hz] = chC(-1, -1); for (const m of boxHoles(g, W, 13.5, 7.5, M2.stone, X, 0, -73.75, [{ x: hx, z: hz, w: 3.5, d: 3.5 }])) uvLike(m, X - W / 2, X + W / 2, 0, 13.5, -77.5, -70); } //\n")

# 3. the mouth in the chamber's floor: 3.5 by 3.5 (2.2 by 3.2 until 3.0.2)
rep("{ x: nwx, z: nwz, w: 2.2, d: 3.2 }", "{ x: nwx, z: nwz, w: 3.5, d: 3.5 }")

# 4. the old mouth (a dark plate and five steps) -> the way down, whole
rep("        const [dx, dz] = chC(-1, -1);   // the north-west chamber: the way down - a mouth in the floor (FLOOR_211), dark below, and the first steps //\n"
    "        H2.box(g, 2.2, 0.06, 3.2, darkMat, dx, 13.52, dz); //\n"
    "        H2.stairs(g, { width: 2, totalRise: 2.2, steps: 5, dir: \"N\", x: dx, y: FL - 2.2, z: dz + 1.6, tread: 0.5 }); //\n",
    block('mesibah-block.js'))

# 5. the mount's floor (20-mount.js): in four pieces round the mouth, its pave's texture as one
rep("    H2.box(g, CO.HAR, 1.5, CO.HAR, M2.pave, CX, -1.5, CZ); //\n",
    "    // MESIBAH_303: the mount's floor in four pieces round the mouth of the way down to the bath (30-courts.js: the stair's shaft under //\n"
    "    // Beit HaMoked's north-west chamber, x -30..-26.5, z -75..-71.5); each piece's texture as the whole floor's //\n"
    "    { //\n"
    "      const hx0 = -30, hx1 = -26.5, hz0 = -75, hz1 = -71.5, h5 = CO.HAR / 2, x0 = CX - h5, x1 = CX + h5, z0 = CZ - h5, z1 = CZ + h5; //\n"
    "      for (const [a, b, c, d] of [[x0, hx0, z0, z1], [hx1, x1, z0, z1], [hx0, hx1, z0, hz0], [hx0, hx1, hz1, z1]]) { //\n"
    "        const m = H2.box(g, b - a, 1.5, d - c, M2.pave, (a + b) / 2, -1.5, (c + d) / 2); //\n"
    "        const p = m.geometry.attributes.position, n = m.geometry.attributes.normal, uv = m.geometry.attributes.uv, o = m.position; //\n"
    "        for (let i = 0; i < p.count; i++) { //\n"
    "          const x = p.getX(i) + o.x, y = p.getY(i) + o.y, z = p.getZ(i) + o.z, nx = n.getX(i), ny = n.getY(i), nz = n.getZ(i); //\n"
    "          if (nx > 0.5) uv.setXY(i, z1 - z, y + 1.5); else if (nx < -0.5) uv.setXY(i, z - z0, y + 1.5); //\n"
    "          else if (ny > 0.5) uv.setXY(i, x - x0, z1 - z); else if (ny < -0.5) uv.setXY(i, x - x0, z - z0); //\n"
    "          else if (nz > 0.5) uv.setXY(i, x - x0, y + 1.5); else uv.setXY(i, x1 - x, y + 1.5); //\n"
    "        } //\n"
    "        uv.needsUpdate = true; //\n"
    "      } //\n"
    "    } //\n")

# 6. the fire by the bath burns with the altar's live flames (40-altar.js), as the hearth of Beit HaMoked
rep("[1.05, 0.1, 0.28, 0.55, 0.65]]]]) {",
    "[1.05, 0.1, 0.28, 0.55, 0.65]]], [ctx2.shared.tevilaFire, [[0, 0, 0.55, 1.45, 0.95], [0.25, 0.15, 0.38, 1.05, 0.85], [-0.22, -0.14, 0.4, 1.15, 0.85]]]]) {")

# 7. the demonstration (50-heichal.js: by the walk, DW, and the priest, KOH)
rep("    // 1.4.0: the cedar beams across the ulam",
    block('mesibah-demo.js') + "    // 1.4.0: the cedar beams across the ulam")

# 8. the place, after the chamber's own; the chamber's card: the way is drawn now
CARD = json.load(open(os.path.join(here, 'mesibah-card.json'), encoding='utf-8'))
i = s.index('          { t: "הירידה לבית הטבילה — בבית המוקד", action:')
j = s.index('\n', i) + 1
place = ('          { t: "המסיבה ובית הטבילה", feature: (ctx.shared.features || {})["mesibahSee"] || null, '
         'action: () => { if (ctx.shared.openFor) ctx.shared.openFor("crt-lishkot-roofs", 15000); }, '
         'tg: ' + json.dumps(CARD['tg']) + ', cam: ' + json.dumps(CARD['cam']) + ', '
         'info: ' + json.dumps(CARD['info'], ensure_ascii=False) + ', refs: ' + json.dumps(CARD['refs'], ensure_ascii=False) + ' }, //\n')
s = s[:j] + place + s[j:]
n_edits += 1
rep("במודל: פתח ברצפת הלשכה, וראש המעלות היורדות. המסיבה שתחת הבירה, בית הטבילה, המדורה ובית הכיסא אינם מצוירים.",
    CARD['chamber'])

# 9. the demonstrations' group: the new one, after the heichal's mesibah
rep('          { t: "הליכה במסיבה", place: "הליכה במסיבה — הדגמה" }, //\n',
    '          { t: "הליכה במסיבה", place: "הליכה במסיבה — הדגמה" }, //\n'
    '          { t: "הכהן יורד לבית הטבילה", pill: "mes-tevila-demo" }, //\n')

# 10. the names under the ground lead to the place
rep('          "הירידה לבית הטבילה": {"p": "הירידה לבית הטבילה — בבית המוקד"}, //\n',
    '          "הירידה לבית הטבילה": {"p": "הירידה לבית הטבילה — בבית המוקד"}, //\n' +
    ''.join('          ' + json.dumps(t, ensure_ascii=False) + ': {"p": "המסיבה ובית הטבילה"}, //\n' for t in CARD['labels']))

open(path, 'w', encoding='utf-8').write(s)
print('MESIBAH_303: %d edits' % n_edits)
