# AVNET_305 (3.0.5) - the avnet of the priests of the people kit (the water-drawing, the chambers' workers, the officers) as the
# lottery's priest's (55-payis.js AVNET_211): one band at the elbows' height, three rounded turns, the twined weave (dyed, or
# white in "של בוץ"). Until 3.0.4: three separate stripes at the waist and two hanging ends.
# The user, 19.11.2026 23:36: "יש בעיה עם האבנט של הכהנים בשמחת בית השואבה הוא לא מה שיצרנו כבר".
# Run after musicians_patch.py (the crowd's MUSICIANS_305 lines are its anchors):
#   python3 -I tools/round-3.0.5/avnet_patch.py ; then node tools/safe-lines.mjs sheni-src/bundle.js
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
if 'AVNET_305' in s:
    sys.exit('already applied')
if 'MUSICIANS_305' not in s:
    sys.exit('musicians_patch.py first')

# ---------- 1. the band and its two materials, in place of the three stripes ----------
a = s.index('    const SASH_C = [new Color(0x3d62ab), new Color(0x8e1f34), new Color(0xc5432b)]; //\n')
b = s.index('    const kippah = (ws, hs) => ', a)
NEW = '''    // AVNET_305 (the user, 19.11.2026 23:36: "יש בעיה עם האבנט של הכהנים בשמחת בית השואבה הוא לא מה שיצרנו כבר"): the avnet of the //
    // lottery's priest (55-payis.js AVNET_211) - one band at the elbows' height ("כנגד אצילי ידיו", Klei HaMikdash 10:1), three turns //
    // "כרך על גבי כרך" (8:19), each rounded; its threads twined, their colours melting into one hue - tekhelet, argaman, tola'at shani //
    // and white (8:1, 8:13) - or all white in "של בוץ" (Yoma 12b; the row "אבנטו של כהן הדיוט": ctx.shared.peopleAvnet.set). Its own //
    // InstancedMesh, near and mid (none from afar). Until 3.0.4: three separate stripes at the waist and two ends hanging before him. //
    const AVN = ctx.shared.peopleAvnet || (ctx.shared.peopleAvnet = (() => { //
      const weave = (pal, seed) => {   // as the lottery's priest's: fine threads, twined - every row leans the other way //
        const cv = document.createElement("canvas"); //
        cv.width = 256; //
        cv.height = 48; //
        const c = cv.getContext("2d"); //
        let q = seed >>> 0; //
        const r = () => { q = (q * 1664525 + 1013904223) >>> 0; return q / 4294967296; }; //
        c.fillStyle = pal[0][0]; //
        c.fillRect(0, 0, 256, 48); //
        const rows = 12, rh = 48 / rows, tot = pal.reduce((t, x) => t + x[1], 0); //
        const pick = () => { let x = r() * tot; for (const y of pal) { x -= y[1]; if (x <= 0) return y[0]; } return pal[0][0]; }; //
        c.lineCap = "round"; //
        c.lineWidth = 3.1; //
        for (let k = 0; k < rows; k++) { //
          const lean = (k % 2 ? 1 : -1) * rh * 0.9, y = k * rh; //
          for (let x = -8; x < 264; x += 4) { //
            c.strokeStyle = pick(); //
            c.globalAlpha = 0.8 + r() * 0.2; //
            for (const dx of [0, 256, -256]) { c.beginPath(); c.moveTo(x + dx, y + 0.6); c.lineTo(x + dx + lean, y + rh - 0.6); c.stroke(); } //
          } //
        } //
        c.globalAlpha = 1; //
        const t = new CanvasTexture(cv); //
        t.wrapS = t.wrapT = RepeatWrapping; //
        t.colorSpace = SRGBColorSpace; //
        t.repeat.set(5, 1); //
        t.anisotropy = 4; //
        return t; //
      }; //
      const mat = (pal, seed) => new MeshStandardMaterial({ color: 0xffffff, map: weave(pal, seed), vertexColors: true, roughness: 0.88 }); //
      const D = mat([["#3d62ab", 4.2], ["#8e1f34", 3.1], ["#c5432b", 1.3], ["#e6e1d3", 1]], 20261119); //
      const Wt = mat([["#f7f5ee", 4], ["#e0dbcc", 3], ["#ffffff", 2], ["#cfc9b7", 1]], 20261120); //
      const P = { //
        white: false, meshes: [], //
        mat() { const Y = ctx.shared.payis; if (Y && Y.avnet) P.white = Y.avnet === "butz"; return P.white ? Wt : D; }, //
        set(m) { P.white = m === "butz"; const M = P.white ? Wt : D; for (const im of P.meshes) im.material = M; return P.white ? "butz" : "rambam"; } //
      }; //
      return P; //
    })()); //
    const AV0 = 1.312, AV1 = 1.462;   // the lottery's priest's band (SY0, SY1) //
    const avnet = (yo, nu, nv) => surf(nu, nv, (u, v, o) => { //
      const tv = (v * 3) % 1, e = Math.max(0, Math.sin(Math.PI * tv)) * (0.55 + 0.45 * Math.sin(Math.PI * v)); //
      const y = AV0 + v * (AV1 - AV0), a = u * TAU + Math.PI, th = 0.004 + 0.017 * Math.pow(e, 0.35); //
      o.x = (spl(bX, y) + th) * Math.sin(a); //
      o.y = y + yo; //
      o.z = (spl(bZ, y) + th) * Math.cos(a); //
      o.c = 0.88 + 0.12 * e; //
    }); //
'''
s = s[:a] + NEW + s[b:]

# ---------- 2. the builder: the band apart from the cloth ----------
s = once(s, '      if (kind === "kohen") for (const q of sashK(seated ? -OFF : 0)) cloth.push(q); //\n',
         '      const avG = kind === "kohen" ? avnet(seated ? -OFF : 0, 40, 12) : null;   // AVNET_305 //\n', 'near avnet')
s = once(s, '      if (kind === "kohen") mc.push(sashK(seated ? -OFF : 0)[1]); //\n',
         '      const avM = kind === "kohen" ? avnet(seated ? -OFF : 0, 16, 9) : null;   // AVNET_305 //\n', 'mid avnet')
s = once(s, '      const mid = { cloth: mergeGeometries(mc), skin: mergeGeometries(ms), hair: mergeGeometries(mh) }; //\n',
         '      const mid = { cloth: mergeGeometries(mc), skin: mergeGeometries(ms), hair: mergeGeometries(mh), avnet: avM }; //\n', 'mid obj')
s = once(s, '      return (cache[key] = { cloth: mergeGeometries(cloth), skin: mergeGeometries(skin), hair, mid, far: mergeGeometries(far) }); //\n',
         '      return (cache[key] = { cloth: mergeGeometries(cloth), skin: mergeGeometries(skin), hair, mid, far: mergeGeometries(far), avnet: avG }); //\n', 'return')

# ---------- 3. the crowd: its own InstancedMesh, near and mid ----------
s = once(s, '      const mCl = mk(G.mid.cloth, mCl0), mSk = mk(G.mid.skin, mSkin), mHr = mk(G.mid.hair, mHair); //\n',
         '      const mCl = mk(G.mid.cloth, mCl0), mSk = mk(G.mid.skin, mSkin), mHr = mk(G.mid.hair, mHair); //\n'
         '      const avN = G.avnet ? mk(G.avnet, AVN.mat()) : null, avD = G.mid.avnet ? mk(G.mid.avnet, AVN.mat()) : null;   // AVNET_305 //\n'
         '      if (avN) AVN.meshes.push(avN, avD); //\n', 'crowd meshes')
s = once(s, '        for (const im of [cloth, skin, fm, mCl, mSk, mHr]) im.setMatrixAt(i, m4); //\n',
         '        for (const im of [cloth, skin, fm, mCl, mSk, mHr]) im.setMatrixAt(i, m4); //\n'
         '        if (avN) { avN.setMatrixAt(i, m4); avD.setMatrixAt(i, m4); }   // AVNET_305 //\n', 'crowd matrices')
s = once(s, '      for (const im of [cloth, skin, fm, mCl, mSk, mHr].concat(hairs)) { //\n',
         '      for (const im of [cloth, skin, fm, mCl, mSk, mHr].concat(hairs, avN ? [avN, avD] : [])) {   // AVNET_305 //\n', 'crowd add')
s = once(s, '        if (im.count > 0) (im === fm ? far : im === mCl || im === mSk || im === mHr ? mid : near).add(im); //\n',
         '        if (im.count > 0) (im === fm ? far : im === mCl || im === mSk || im === mHr || im === avD ? mid : near).add(im); //\n', 'crowd lod')
s = once(s, '      const lodE = LOD[LOD.length - 1], allIm = [cloth, skin, fm, mCl, mSk, mHr]; //\n',
         '      const lodE = LOD[LOD.length - 1], allIm = [cloth, skin, fm, mCl, mSk, mHr].concat(avN ? [avN, avD] : []);   // AVNET_305 //\n', 'crowd allIm')

# ---------- 4. the row "אבנטו של כהן הדיוט": the people's avnet too ----------
s = once(s, 'P.setAvnet(k === "o1" ? "butz" : "rambam"); if (T && T.active',
         'P.setAvnet(k === "o1" ? "butz" : "rambam"); { const PA = ctx.shared.peopleAvnet; if (PA) PA.set(k === "o1" ? "butz" : "rambam"); } if (T && T.active', 'sh13')

assert 'sashK(' not in s and 'SASH_C' not in s
wr(p, s)
print('AVNET_305 applied')
