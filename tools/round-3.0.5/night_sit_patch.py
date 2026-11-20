# NIGHT_SIT_305 (3.0.5) - the guards of the night sit on their stones: the awake one upright, the sleepers bent forward, the head
# bowed, wrapped in a cloak; they get up (situp) or leap up at the blow (wake). Built on the Tamid figures' own legs (KIDDUSH_FOOT_213)
# and a pivot at the neck, instead of the plain sitting lumps of the first draft (the shots of 20.11.2026: a head floating over a ball).
# Run after night_watch_patch.py: python3 -I tools/round-3.0.5/night_sit_patch.py ; then node tools/safe-lines.mjs sheni-src/bundle.js
import os, sys

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
if 'const SIT = { seat' in s:
    sys.exit('already applied')
if 'NIGHT_WATCH_305' not in s:
    sys.exit('run night_watch_patch.py first')

# ---------- 1. the figure: the neck's pivot, and the part above the waist kept ----------
s = once(s, '        let body, belt = null, bend = null; //\n',
         '        let body, belt = null, bend = null, neckG = null, upG = null;   // NIGHT_SIT_305: the neck\'s pivot; the part above the waist //\n', 'let body')
s = once(s,
         '          U.add(new Mesh(KG.neck, K.mSkin)); //\n'
         '          if (!lev) { belt = new Mesh(K.gSash, TM.belt === "white" ? K.mSashWhite : K.mSashDyed); belt.userData.kit = true; U.add(belt); } //\n'
         '          const hg = K.headOn(U, K.HEAD_Y, K.mBeards[n % K.mBeards.length], n); //\n'
         '          hg.rotation.set(0, (((n * 0.618) % 1) - 0.5) * 0.4, 0);   // every man a little different (a fixed turn, no chance) //\n'
         '          if (lev) { const cap = new Mesh(K.gCap, KG.mLevCap); cap.position.y = K.HEAD_Y; U.add(cap); } //\n'
         '          else { const hat = new Mesh(K.gHat, K.mHat); hat.position.y = K.HAT_Y; hat.rotation.y = hg.rotation.y + (((n * 0.37) % 1) - 0.5) * 0.9; U.add(hat); } //\n',
         '          // NIGHT_SIT_305: the neck, the head and its cap or hat in one group, turned at the neck\'s foot (NK) - a guard asleep bows his //\n'
         '          // head (applyFig: headA). Not turned, all is where it was. //\n'
         '          const NKY = 1.86, NK = new Group(); //\n'
         '          NK.position.y = NKY; //\n'
         '          U.add(NK); //\n'
         '          neckG = NK; upG = U; //\n'
         '          { const nk = new Mesh(KG.neck, K.mSkin); nk.position.y = -NKY; NK.add(nk); } //\n'
         '          if (!lev) { belt = new Mesh(K.gSash, TM.belt === "white" ? K.mSashWhite : K.mSashDyed); belt.userData.kit = true; U.add(belt); } //\n'
         '          const hg = K.headOn(NK, K.HEAD_Y - NKY, K.mBeards[n % K.mBeards.length], n); //\n'
         '          hg.rotation.set(0, (((n * 0.618) % 1) - 0.5) * 0.4, 0);   // every man a little different (a fixed turn, no chance) //\n'
         '          if (lev) { const cap = new Mesh(K.gCap, KG.mLevCap); cap.position.y = K.HEAD_Y - NKY; NK.add(cap); } //\n'
         '          else { const hat = new Mesh(K.gHat, K.mHat); hat.position.y = K.HAT_Y - NKY; hat.rotation.y = hg.rotation.y + (((n * 0.37) % 1) - 0.5) * 0.9; NK.add(hat); } //\n',
         'head')
s = once(s, '        const f = { id, g, lean, bend, legs, A, L, R, fl, fr, levite: lev, kind, body, belt, st: null, tag: null, kit: true }; //\n',
         '        const f = { id, g, lean, bend, legs, A, L, R, fl, fr, levite: lev, kind, body, belt, st: null, tag: null, kit: true, neck: neckG, upper: upG };   // NIGHT_SIT_305 //\n', 'f')

# ---------- 2. the state: the cloak about him; the API ----------
s = once(s, '        Object.assign(f.st, { vis: false, x: 0, y: 0, z: 0, yaw: 0, pose: "stand", ph: 0, t: 0, tag: "" }); //\n',
         '        Object.assign(f.st, { vis: false, x: 0, y: 0, z: 0, yaw: 0, pose: "stand", ph: 0, t: 0, tag: "", cloak: false });   // NIGHT_SIT_305: cloak //\n', 'reset')
s = once(s, '        tag(k, text, t0 = 0, t1 = 1e9) { if (tau >= t0 && tau < t1) fig(k).st.tag = text; }, //\n',
         '        tag(k, text, t0 = 0, t1 = 1e9) { if (tau >= t0 && tau < t1) fig(k).st.tag = text; }, //\n'
         '        cloak(k, t0 = 0, t1 = 1e9) { if (tau >= t0 && tau < t1) fig(k).st.cloak = true; },   // NIGHT_SIT_305: wrapped in his cloak //\n', 'API')

# ---------- 3. the postures ----------
s = once(s, '    const KB = 0.95;   // KIDDUSH_BEND_212: how far he bends at the waist (rad) - a model choice //\n',
         '    const KB = 0.95;   // KIDDUSH_BEND_212: how far he bends at the waist (rad) - a model choice //\n'
         '    // NIGHT_SIT_305 (the user, 19.11.2026 21:24: "כולל שומר ישן"): A GUARD ON HIS STONE. The legs (KIDDUSH_FOOT_213\'s: the thigh, the //\n'
         '    // knee, the shin, the foot) bent at the hip and the knee, the robe over the knees down to the feet (sitParts) and its lower part //\n'
         '    // hidden; awake ("sit") upright, the hands on the thighs; asleep ("doze") bent forward at the waist, the head bowed, the hands in //\n'
         '    // the lap, a slow breath - and a start at each blow (N.joltN, N.joltP); "situp": up in 0.9 s; "wake": up in 0.35 s, the hands //\n'
         '    // raised as "startle". The cloak about his shoulders (cloakOn: the API\'s cloak()) - "רק כסותו העליון שמסתמא התחתל בו, ובא עי"ז //\n'
         '    // לשינה" (Tiferet Yisrael, Middot 1:2). The stone\'s height (seat, amot), the postures and the cloak\'s form - model choices. //\n'
         '    // step: how far before the stone he stands up (his feet stay where they were; the stage puts the standing man there) //\n'
         '    const SIT = { seat: 0.63, step: 0.62, knee: [0.125, 1.02, 0.42], ank: [0.13, 0.47], gPel: null, gDrape: null, gCloak: null, mCloak: null }; //\n'
         '    const sitArms = (f, doze) => {   // the hands\' places: in the lap (asleep), on the thighs (awake); the targets in the bend\'s frame //\n'
         '      const key = doze ? "d" : "a"; //\n'
         '      f.sitArms = f.sitArms || {}; //\n'
         '      if (f.sitArms[key]) return f.sitArms[key]; //\n'
         '      const K = SH.priestKit, FS = K.FS, WY = f.bend.position.y, A = f.A, th = doze ? 0.36 : 0, cb = Math.cos(th), sb = Math.sin(th), out = {}; //\n'
         '      for (const side of [1, -1]) { //\n'
         '        const T = doze ? [side * 0.07, WY + 0.15 * FS, 0.25 * FS] : [side * 0.15, WY + 0.14 * FS, 0.3 * FS]; //\n'
         '        const dy = T[1] - WY, Tb = [T[0], dy * cb + T[2] * sb, -dy * sb + T[2] * cb]; //\n'
         '        out[side] = reach([side * A.sx, A.sy - WY, 0], Tb, A.up, A.fo + 0.06 * FS, side); //\n'
         '      } //\n'
         '      return (f.sitArms[key] = out); //\n'
         '    }; //\n'
         '    const sitPose = (f, s, p, t) => { //\n'
         '      const doze = p === "doze", wake = p === "wake"; //\n'
         '      const u = p === "situp" ? 1 - smooth(clamp(t / 0.9, 0, 1)) : wake ? 1 - smooth(clamp(t / 0.35, 0, 1)) : 1, w = 1 - u; //\n'
         '      const H = sitArms(f, doze || wake), q = { u, bend: 0, bz: 0, head: 0, lean: 0, R: H[-1], L: H[1], shift: doze || p === "sit" ? 0 : SIT.step * w }; //\n'
         '      const mix = (a2, b2) => [lerp(a2[0], b2[0], w), lerp(a2[1], b2[1], w), lerp(a2[2], b2[2], w)]; //\n'
         '      if (doze) { //\n'
         '        const jo = f.id === "gn" ? N.joltN : f.id === "gp" ? N.joltP : 0, br = Math.sin(t * 1.25); //\n'
         '        q.bend = 0.36 + 0.012 * br + 0.06 * jo * Math.sin(t * 31); //\n'
         '        q.bz = 0.04 * jo * Math.sin(t * 23); //\n'
         '        q.head = 0.62 + 0.03 * br; //\n'
         '      } else if (wake) { //\n'
         '        const k = smooth(clamp(t / 0.25, 0, 1)) * (1 - smooth(clamp((t - 0.6) / 0.4, 0, 1))), S2 = [lerp(0.05, -1.0, k), lerp(0.08, 0.45, k), lerp(-0.15, -1.25, k)]; //\n'
         '        q.R = mix(H[-1], S2); q.L = mix(H[1], S2); q.bend = 0.36 * u; q.head = 0.62 * u; q.lean = -0.1 * k; //\n'
         '      } else if (p === "situp") { //\n'
         '        q.R = mix(H[-1], POSES.stand[0]); q.L = mix(H[1], POSES.stand[1]); q.bend = 0.3 * Math.sin(Math.PI * w);   // forward as he rises //\n'
         '      } //\n'
         '      return q; //\n'
         '    }; //\n'
         '    const sitParts = (f) => {   // the seat under the robe above the waist, and the robe hanging from each knee (the robe\'s own material) //\n'
         '      const FS = SH.priestKit.FS, mR = f.body.material, g = new Group(); //\n'
         '      if (!SIT.gPel) {   // (white vertex colours: the robe\'s material takes them, as the kit\'s legs) //\n'
         '        SIT.gPel = SH.priestKit.white(new SphereGeometry(1, 16, 10).scale(0.22 * FS, 0.12 * FS, 0.21 * FS)); //\n'
         '        SIT.gDrape = SH.priestKit.white(new CylinderGeometry(0.1 * FS, 0.088 * FS, 1, 12, 1, true).translate(0, 0.5, 0)); //\n'
         '      } //\n'
         '      const pel = new Mesh(SIT.gPel, mR); //\n'
         '      pel.castShadow = true; //\n'
         '      pel.position.set(0, f.bend.position.y - 0.04 * FS, -0.03 * FS); //\n'
         '      g.add(pel); //\n'
         '      const dr = {}; //\n'
         '      for (const side of [1, -1]) { const m = new Mesh(SIT.gDrape, mR); m.castShadow = true; g.add(m); dr[side] = m; } //\n'
         '      g.visible = false; //\n'
         '      f.lean.add(g); //\n'
         '      return (f.sitP = { g, pel, dr }); //\n'
         '    }; //\n'
         '    // u: 1 seated, 0 standing - the body lowered so the hip is just over the stone, the knee before it, the foot on the floor //\n'
         '    const setSit = (f, u) => { //\n'
         '      const P = f.sitP || sitParts(f), on = u > 0.001; //\n'
         '      P.g.visible = on; //\n'
         '      if (on) { f.body.visible = u < 0.3; f.sitHid = true; } //\n'
         '      else if (f.sitHid) { f.body.visible = true; f.sitHid = false; } //\n'
         '      P.pel.visible = on && u >= 0.3; //\n'
         '      if (!on) return;   // the legs as setLeg left them (hidden, the feet his own) //\n'
         '      const FS = SH.priestKit.FS, hk = SIT.seat / FS + 0.1, dk = (1 - hk) * u;   // the hip over the floor when seated; its drop now (kit units) //\n'
         '      f.lean.position.y -= dk * FS; //\n'
         '      for (const side of [1, -1]) { //\n'
         '        const lg = f.legs[side]; //\n'
         '        lg.g.visible = true; //\n'
         '        (side > 0 ? f.fl : f.fr).visible = false; //\n'
         '        const Hp = [side * 0.1 * FS, FS, 0]; //\n'
         '        const Kp = [side * lerp(0.1, SIT.knee[0], u) * FS, lerp(0.55 + dk, SIT.knee[1], u) * FS, lerp(0.02, SIT.knee[2], u) * FS]; //\n'
         '        const Ap = [side * lerp(0.1, SIT.ank[0], u) * FS, (dk + 0.15) * FS, lerp(-0.01, SIT.ank[1], u) * FS]; //\n'
         '        seg(lg.th, Hp, Kp); //\n'
         '        lg.kn.position.set(Kp[0], Kp[1], Kp[2]); //\n'
         '        seg(lg.sn, Kp, Ap); //\n'
         '        lg.ft.rotation.set(0, 0, 0); //\n'
         '        lg.ft.position.set(Ap[0], Ap[1] - 0.15 * FS, Ap[2] + 0.01 * FS); //\n'
         '        seg(P.dr[side], Kp, [Ap[0], Ap[1] + 0.02 * FS, Ap[2]]); //\n'
         '      } //\n'
         '    }; //\n'
         '    const cloakOn = (f, on) => {   // a cloak over the shoulders and the back, open before him; with the body above the waist //\n'
         '      if (!f.cloakG) { //\n'
         '        if (!on) return; //\n'
         '        if (!SIT.gCloak) { //\n'
         '          SIT.mCloak = new MeshStandardMaterial({ color: 0x6e5c46, roughness: 1, metalness: 0, side: DoubleSide }); //\n'
         '          // rings from the neck down to below the waist (the kit\'s units): [y, half-breadth, half-depth] about the body and over the //\n'
         '          // arms; round him from his back (0) to \u00b12.3 rad, open before him; soft folds that grow toward the hem //\n'
         '          const RG = [[1.875, 0.1, 0.085], [1.84, 0.21, 0.13], [1.79, 0.34, 0.17], [1.72, 0.42, 0.195], [1.6, 0.4, 0.205], [1.4, 0.35, 0.21], //\n'
         '            [1.2, 0.33, 0.215], [1.0, 0.33, 0.225], [0.82, 0.34, 0.24]], NS = 30, PM = 2.3, pos = [], idx = []; //\n'
         '          RG.forEach(([y, a2, b2]) => { //\n'
         '            const k = clamp((1.72 - y) / 0.8, 0, 1); //\n'
         '            for (let j = 0; j <= NS; j++) { const ph = -PM + (2 * PM * j) / NS, w2 = 1 + 0.045 * k * Math.sin(9 * ph + 0.6); pos.push(a2 * w2 * Math.sin(ph), y, -0.02 - b2 * w2 * Math.cos(ph)); } //\n'
         '          }); //\n'
         '          for (let i = 0; i < RG.length - 1; i++) for (let j = 0; j < NS; j++) { const q0 = i * (NS + 1) + j, q2 = q0 + NS + 1; idx.push(q0, q2, q0 + 1, q0 + 1, q2, q2 + 1); } //\n'
         '          SIT.gCloak = new BufferGeometry(); //\n'
         '          SIT.gCloak.setAttribute("position", new Float32BufferAttribute(pos, 3)); //\n'
         '          SIT.gCloak.setIndex(idx); //\n'
         '          SIT.gCloak.computeVertexNormals(); //\n'
         '        } //\n'
         '        const m = new Mesh(SIT.gCloak, SIT.mCloak); //\n'
         '        m.castShadow = true; //\n'
         '        m.userData.noPick = true; //\n'
         '        f.upper.add(m);   // in the kit\'s units, above the waist //\n'
         '        f.cloakG = m; //\n'
         '      } //\n'
         '      f.cloakG.visible = on; //\n'
         '    }; //\n', 'SIT')
s = once(s, '        else if (p === "call" && f.bend && f.A && SH.priestKit) { const H = callArms(f); R = H[-1]; Lv = H[1]; bendA = 0.1 + 0.06 * Math.sin(t * 2.6); } //\n',
         '        else if (p === "call" && f.bend && f.A && SH.priestKit) { const H = callArms(f); R = H[-1]; Lv = H[1]; bendA = 0.1 + 0.06 * Math.sin(t * 2.6); } //\n'
         '        else if ((p === "sit" || p === "doze" || p === "situp" || p === "wake") && f.legs && f.bend && f.A && SH.priestKit) {   // NIGHT_SIT_305 //\n'
         '          const q = sitPose(f, s, p, t); //\n'
         '          R = q.R; Lv = q.L; bendA = q.bend; bendZ = q.bz; headA = q.head; sitU = q.u; lean = q.lean; sitZ = q.shift; //\n'
         '        } //\n', 'sit branch')
s = once(s, 'legR = 0, legL = 0; //\n', 'legR = 0, legL = 0, headA = 0, sitU = 0, sitZ = 0;   // NIGHT_SIT_305: headA, sitU, sitZ //\n', 'lets')
s = once(s, '      f.fl.visible = f.fr.visible = lean < 1; //\n',
         '      f.fl.visible = f.fr.visible = lean < 1; //\n'
         '      if (f.neck) f.neck.rotation.x = headA;   // NIGHT_SIT_305 //\n'
         '      if (f.legs && (sitU > 0 || f.sitP)) setSit(f, sitU);   // NIGHT_SIT_305: on his stone - after the lean and the feet //\n'
         '      if (sitZ > 0) { f.lean.position.z = sitZ; f.fl.position.z += sitZ; f.fr.position.z += sitZ; }   // getting up: the body over the feet //\n'
         '      else if (f.lean.position.z !== 0) f.lean.position.z = 0; //\n'
         '      if (f.upper && (s.cloak || f.cloakG)) cloakOn(f, !!s.cloak); //\n', 'after feet')

wr(p, s)
print('NIGHT_SIT_305 applied')
