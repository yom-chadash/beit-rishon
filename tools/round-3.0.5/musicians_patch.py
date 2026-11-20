#!/usr/bin/env python3
# round 3.0.5 (בית שני 2.0.14) - MUSICIANS_305 and TERUAH_305 (the user, 19.11.2026 21:08: "צריך גם לעשות את הלוויים מנגנים, אותו
# דבר בעבודת הבוקר. אם הם מנגנים, לא יכולים לעמוד כמו פסלים"; 21:10: "ידיים של הכוהנים תופסות את החצוצרה, אי אפשר בלי. ונראה לי יש
# תרועה שם גם, תבדוק"; 21:24: "2. ג" - a switch). Into sheni-src/bundle.js:
#  1. the people kit (tm_people, this house's copy): crowd o.arms === false - the figures without their own arms; the crowd's
#     handle near.userData.crowd = { lod, pose(i, m), done() }; rig(parent, n, o) - arms that move (tools/round-3.0.5/kit-rig.js);
#  2. the water-drawing (SIMCHA_304 block): the musicians' kit (mus-kit.js), the Levites, the flutes and the two priests built with
#     it (mus-build.js), set every frame by the music's clock; the walking blasts by the reading (SH.simchaWalk: Rashi / the Tiferet
#     Yisrael); the caption of "היו תוקעין והולכין" by the reading; the card;
#  3. 92-sounds: the loop's clock (L.beat), the Levites' trumpets and a clash of the cymbals at the head of every phrase; the teruah's
#     nine blasts each heard; Rashi's pattern "drawn";
#  4. the morning service (55-tamid): the players' right hand on the strings (playArm), the song's sway (songSway), the twelve
#     singers too, a pause at each section (Yachin, Tamid 7); its teruah as above;
#  5. the readings: the row "התקיעות בהליכה לשער המזרח — שמחת בית השואבה" (sh60) in the group of the women's court.
# Run from the repository's root: python3 -I tools/round-3.0.5/musicians_patch.py ; then node tools/safe-lines.mjs sheni-src/bundle.js
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

def line_of(lines, needle, what, start=0):
    hits = [i for i in range(start, len(lines)) if needle in lines[i]]
    if len(hits) != 1 and start == 0:
        sys.exit('%s: line found %d times' % (what, len(hits)))
    if not hits:
        sys.exit('%s: line not found' % what)
    return hits[0]

HERE = os.path.dirname(os.path.abspath(__file__))
p = 'sheni-src/bundle.js'
s = rd(p)
if 'MUSICIANS_305' in s:
    sys.exit('already applied')

# ---------- 1. the people kit ----------
s = once(s, '    const build = (pose, L, kind, robeCol, young) => {   // YOUNG_300: young - a short beard (the young priests of the water-drawing) //\n',
         '    const build = (pose, L, kind, robeCol, young, noArms) => {   // YOUNG_300: young - a short beard (the young priests of the water-drawing); MUSICIANS_305: noArms //\n', 'build')
s = once(s, '(young ? "|young" : ""); //\n      if (cache[key]) return cache[key]; //\n',
         '(young ? "|young" : "") + (noArms ? "|na" : ""); //\n      if (cache[key]) return cache[key]; //\n', 'build key')
s = once(s, '          for (const q of arm([sd * 0.25, SY - 0.01, 0], [sd * 0.275, 1.4, 0.02], W)) cloth.push(q); //\n',
         '          if (!noArms) for (const q of arm([sd * 0.25, SY - 0.01, 0], [sd * 0.275, 1.4, 0.02], W)) cloth.push(q);   // MUSICIANS_305 //\n', 'near arm')
s = once(s, '          skin.push(hand(sd, sd > 0 ? [0.1, 1.395, 0.26] : [-0.09, 1.475, 0.27], -sd * 0.3)); //\n',
         '          if (!noArms) skin.push(hand(sd, sd > 0 ? [0.1, 1.395, 0.26] : [-0.09, 1.475, 0.27], -sd * 0.3)); //\n', 'near hand')
for old in ['        mc.push(shade(limb([sd * 0.245, SY - 0.01, 0], E, 0.074, 0.06, 5), 0.95)); //\n',
            '        mc.push(shade(limb(E, W, 0.058, 0.048, 5), 0.9)); //\n',
            '        ms.push(skinPart(at(sph(0.032, 0.016, 0.05, 4, 3), W[0] - sd * 0.02, W[1] - 0.02, W[2] + 0.05))); //\n']:
    s = once(s, old, old.replace('        m', '        if (!noArms) m', 1), 'mid arm')
s = once(s, 'G = build(o.pose, L, o.kind, o.robe, !!o.young), mCl0 = clothMat(o.robe); //\n',
         'G = build(o.pose, L, o.kind, o.robe, !!o.young, o.arms === false), mCl0 = clothMat(o.robe); //\n', 'crowd build')
s = once(s, '      let R = 0; //\n      pts.forEach(([x, z, yaw], i) => { //\n',
         '      let R = 0; //\n      const slots = [];   // MUSICIANS_305: each figure\'s hair - its mesh and place there //\n      pts.forEach(([x, z, yaw], i) => { //\n', 'crowd slots')
s = once(s, '        mHr.setColorAt(i, c3); //\n        cnt[k]++; //\n',
         '        mHr.setColorAt(i, c3); //\n        slots[i] = [k, cnt[k]]; //\n        cnt[k]++; //\n', 'crowd slot')
s = once(s, '      LOD.push({ near, mid, far, anchor, R: R * 1.0, lv: 1, k: o.lodK > 0 ? o.lodK : 1, min: o.minLv | 0 });   // PEOPLE_LOD_304: lodK, minLv (this house\'s copy) //\n      return near; //\n',
         '      LOD.push({ near, mid, far, anchor, R: R * 1.0, lv: 1, k: o.lodK > 0 ? o.lodK : 1, min: o.minLv | 0 });   // PEOPLE_LOD_304: lodK, minLv (this house\'s copy) //\n'
         '      // MUSICIANS_305: the crowd\'s handle - its level of detail, and a figure moved (its matrix: place, turn, scale) //\n'
         '      const lodE = LOD[LOD.length - 1], allIm = [cloth, skin, fm, mCl, mSk, mHr]; //\n'
         '      near.userData.crowd = { //\n'
         '        lod: lodE, //\n'
         '        pose(i, m) { for (const im of allIm) im.setMatrixAt(i, m); const sl = slots[i]; if (sl) hairs[sl[0]].setMatrixAt(sl[1], m); }, //\n'
         '        done() { for (const im of allIm.concat(hairs)) im.instanceMatrix.needsUpdate = true; } //\n'
         '      }; //\n'
         '      return near; //\n', 'crowd handle')
RIG = rd(os.path.join(HERE, 'kit-rig.js')).rstrip('\n') + '\n'
s = once(s, "    // PEOPLE_KIT_205: the level by the eye's distance from the crowd's edge (as it would be at a 45-degree lens); a tenth of slack //\n",
         RIG + "    // PEOPLE_KIT_205: the level by the eye's distance from the crowd's edge (as it would be at a 45-degree lens); a tenth of slack //\n", 'rig')
s = once(s, '    return (ctx.__tmPeople = { crowd, facing, age }); //\n', '    return (ctx.__tmPeople = { crowd, facing, age, rig }); //\n', 'kit export')

# ---------- 2. the water-drawing ----------
MUSKIT = rd(os.path.join(HERE, 'mus-kit.js')).rstrip('\n') + '\n'
s = once(s, '      const DR = 8.2, NDANCE = 14; //\n      let B = null; //\n', '      const DR = 8.2, NDANCE = 14; //\n' + MUSKIT + '      let B = null; //\n', 'mus kit')
lines = s.split('\n')
a = line_of(lines, '// ---- the two priests with the trumpets (white garments, the hat and the sash), the trumpet at the mouth while they blow', 'koh start')
b = line_of(lines, '        return B; //', 'return B', a)
if not lines[b - 1].strip().startswith('}'):
    sys.exit('the flute block does not end before "return B"')
BUILD = rd(os.path.join(HERE, 'mus-build.js')).rstrip('\n').split('\n')
lines[a:b] = BUILD
s = '\n'.join(lines)
s = once(s, '        for (const [k, g] of Object.entries(b.lev)) g.visible = (k === "rid") === rid; //\n        if (!b.lev[rid ? "rid" : "rambam"]) b.levFor(rid).visible = true; //\n',
         '        for (const [k, st] of Object.entries(b.lev)) st.g.visible = (k === "rid") === rid; //\n'
         '        if (!b.lev[rid ? "rid" : "rambam"]) b.levFor(rid).g.visible = true; //\n'
         '        // MUSICIANS_305: the music\'s eighth - the loop\'s own clock while it sounds (D.music.beat, 92-sounds), else the screen\'s - //\n'
         '        // and how much they play: from the dance to the cock\'s crow, as the music (below) //\n'
         '        const bt = D.music && fnc(D.music.beat) ? D.music.beat() : null, e8 = bt != null ? bt : performance.now() / 200; //\n'
         '        const vM = ss(29.5, 31.2, t) * (1 - ss(TD - 1.2, TD + 0.2, t)); //\n'
         '        b.lev[rid ? "rid" : "rambam"].play(e8, vM); //\n'
         '        if (b.flute) b.flute.play(e8, vM); //\n', 'lev visible')
s = once(s, '        const blow = BLASTS.some((s) => t >= s - 0.3 && t < s + 5) || LONGS.some((s) => t >= s - 0.2 && t < s + 3); //\n',
         '        const blow = blowing(t); //\n'
         '        const dt = Math.max(0, Math.min(0.2, t - (D.lt == null ? t : D.lt))); //\n'
         '        D.lt = t; //\n', 'blow')
s = once(s, '          k.tr.position.set(0, blow ? 2.78 : 1.55, blow ? 0.16 : 0.32); //\n          k.tr.rotation.set(blow ? -0.12 : 1.25, 0, 0); //\n',
         '          k.up += ((blow ? 1 : 0) - k.up) * Math.min(1, dt * 7);   // MUSICIANS_305: to the mouth in about a third of a second //\n'
         '          k.set.figs[0].up = k.up; //\n'
         '          k.set.play(0, 0); //\n', 'koh trumpet')
WALK = (
    '      // TERUAH_305 (the user, 21:10: "ונראה לי יש תרועה שם גם, תבדוק"; 21:24: "2. ג" - a switch, ״שיטות ומחלוקות״ sh60): "היו תוקעין\n'
    '      // והולכין" (5:4). Rashi (on the mishnah): "באלו שלש אחרונות מאריכין עד שמגיעין לשער היוצא מעזרת נשים להר הבית", and so the\n'
    '      // Bartenura (5:5: "ומאריכין בהן עד שהגיעו לשער התחתון"), the Tosafot Yom Tov and the Pnei Moshe - the court\'s tekia, teruah and\n'
    '      // tekia drawn out along the way, to the east gate (the default; their length - model choice); the Tiferet Yisrael (Yachin 5:5,\n'
    '      // 772:581): "ואע״ג דגם לאחר מעלה עשירית קאמר תוקעין והולכין, היינו רק תקיעה בלי תרועה" - after the court\'s three, long blasts\n'
    '      // without a teruah as they go (until 2.0.13 the only way)\n'
    '      const WALK = SH.simchaWalk || (SH.simchaWalk = { mode: "rashi", set(m) { this.mode = m === "tyt" ? "tyt" : "rashi"; return this.mode; } });\n'
    '      const DRAWN = [TD + 15, TD + 34];   // Rashi\'s: from the court\'s floor to the east gate\n'
    '      const blowing = (t) => (WALK.mode === "tyt"\n'
    '        ? BLASTS.some((s) => t >= s - 0.3 && t < s + 5) || LONGS.some((s) => t >= s - 0.2 && t < s + 3)\n'
    '        : BLASTS.slice(0, 2).some((s) => t >= s - 0.3 && t < s + 5) || (t >= DRAWN[0] - 0.3 && t < DRAWN[1]));\n')
s = once(s, '      const LONGS = [TD + 20.2, TD + 24.8, TD + 29.4];   // "היו תוקעין והולכין" - long blasts as they go //\n',
         '      const LONGS = [TD + 20.2, TD + 24.8, TD + 29.4];   // "היו תוקעין והולכין" - long blasts as they go (the Tiferet Yisrael\'s) //\n' + WALK, 'walk')
s = once(s, '          for (const s of BLASTS) if (D.snd < s && t >= s) SH.sfx("trumpets"); //\n'
            '          for (const s of LONGS) if (D.snd < s && t >= s) SH.sfx("trumpets", { pattern: "long" }); //\n'
            '          for (const s of [31.5, 43, 52]) if (D.snd < s && t >= s) SH.sfx("cymbals", { gain: 0.5 }); //\n',
         '          const tyt = WALK.mode === "tyt";   // TERUAH_305; the cymbals - in the loop now (MUSICIANS_305) //\n'
         '          for (const s of tyt ? BLASTS : BLASTS.slice(0, 2)) if (D.snd < s && t >= s) SH.sfx("trumpets"); //\n'
         '          if (tyt) { for (const s of LONGS) if (D.snd < s && t >= s) SH.sfx("trumpets", { pattern: "long" }); } //\n'
         '          else if (D.snd < DRAWN[0] && t >= DRAWN[0]) SH.sfx("trumpets", { pattern: "drawn", dur: (DRAWN[1] - t) * SLOW() }); //\n', 'blast sounds')
s = once(s, '        [TD + 20, "״היו תוקעין והולכין, עד שמגיעין לשער היוצא מזרח״ (סוכה ה, ד)"], //\n',
         '        [TD + 20, () => "״היו תוקעין והולכין, עד שמגיעין לשער היוצא מזרח״ (סוכה ה, ד) — " + (SH.simchaWalk && SH.simchaWalk.mode === "tyt" //\n'
         '          ? "לתפארת ישראל: ״היינו רק תקיעה בלי תרועה״" : "לרש״י: ״באלו שלש אחרונות מאריכין עד שמגיעין לשער״ — התקיעה, התרועה והתקיעה נמשכות בהליכה")], //\n', 'walk caption')
s = once(s, '        for (const [ct, x] of CAPS) if (t >= ct) txt = x; //\n', '        for (const [ct, x] of CAPS) if (t >= ct) txt = typeof x === "function" ? x() : x; //\n', 'caps fn')
s = once(s, '        D.way = null; //\n        D.music = fnc(SH.sfxLoop) ? SH.sfxLoop("simcha") : null; //\n',
         '        D.way = null; //\n        D.lt = null; //\n        D.music = fnc(SH.sfxLoop) ? SH.sfxLoop("simcha") : null; //\n', 'start lt')
# the card
LEVOLD = 'בהדגמה — שורה של לוים על כל אחת מחמש עשרה המעלות, בכנורות, בנבלים, במצלתים ובחצוצרות, ושני מחללים למרגלות המעלות; מספרם ומקומם — בחירת מודל.'
s = once(s, LEVOLD, LEVOLD + ' הכלים בידיהם, והם מנגנים בקצב הלחן: הכנור ביד שמאל והפריטה בימין, הנבל בשתי הידיים, המצלתיים נקשים בראש כל פסוק של הלחן, '
         'והחצוצרות עולות לפה בקריאה שבו; והגוף נע מעט עם השיר. התנועות — בחירת מודל.', 'card levites')
GOLD = 'והמה משתחוים קדמה לשמש, ואנו ליה עינינו״ (סוכה ה, ד).'
s = once(s, GOLD + '",', GOLD + '\\n**התקיעות בהליכה — מתג ב״שיטות ומחלוקות״:** רש״י: ״והיו תוקעין והולכין — באלו שלש אחרונות מאריכין עד שמגיעין לשער היוצא מעזרת נשים '
         'להר הבית״ — התקיעה, התרועה והתקיעה של העזרה נמשכות לאורך ההליכה; וכך הברטנורא (סוכה ה, ה): ״הגיעו לעזרה תקעו והריעו ותקעו. ומאריכין בהן עד '
         'שהגיעו לשער התחתון״, ותוספות יום טוב. ולתפארת ישראל (יכין, סוכה ה, ה): ״ואע״ג דגם לאחר מעלה עשירית קאמר תוקעין והולכין, היינו רק תקיעה בלי '
         'תרועה״ — ובהדגמה, לשיטתו, שלוש תקיעות ארוכות בהליכה. ברירת המחדל — רש״י. אורך התקיעות — בחירת מודל.",', 'card walk')

# ---------- 3. the sounds ----------
s = once(s, '      return { E8, hz, at }; //\n',
         '      // MUSICIANS_305: the Levites\' trumpets - a call at the head of the first and the third phrase (D, A) - and the cymbals: one clash //\n'
         '      // at the head of every phrase (until 2.0.13 three clashes at the head of the cycle, unseen) //\n'
         '      put(0, ["t", 0, 4]); put(32, ["t", 7, 4]); //\n'
         '      for (let e = 0; e < 64; e += 16) put(e, ["y", 0, 0]); //\n'
         '      return { E8, hz, at }; //\n', 'sim events')
s = once(s, '        else noise(a, t, 0.05, LEVEL.clap * lv, "bandpass", 1300, 1.4, 0.002, 0.045); //\n',
         '        else if (kind === "t") brass(a, t, l * SIM.E8 * 0.92, LEVEL.trumpets * 0.45 * lv, SIM.hz(n)); //\n'
         '        else if (kind === "y") { const k = LEVEL.cymbals * 0.6 * lv; noise(a, t, 1.5, 0.75 * k, "highpass", 5200, 0.7, 0.005, 1.4); noise(a, t, 0.5, 0.38 * k, "bandpass", 3200, 3, 0.005, 0.45); } //\n'
         '        else noise(a, t, 0.05, LEVEL.clap * lv, "bandpass", 1300, 1.4, 0.002, 0.045); //\n', 'sim step')
s = once(s, 'if (L.level > 0.02) { try { simchaStep(ac, L.at, L.step, L.level); if (L.step % 64 === 0 && L.step > 0) make.cymbals(ac, L.at, LEVEL.cymbals * 0.35 * L.level); } catch (_) {} } //\n',
         'if (L.level > 0.02) { try { simchaStep(ac, L.at, L.step, L.level); } catch (_) {} } //\n', 'loop cymbals')
s = once(s, '            L.at = ac.currentTime + 0.1; //\n',
         '            L.at = ac.currentTime + 0.1; //\n'
         '            L.beat = () => (L.timer && ac ? L.step - (L.at - ac.currentTime) / SIM.E8 : null);   // MUSICIANS_305: the eighth that sounds now //\n', 'loop beat')
s = once(s, '        if (o.pattern === "long") { brass(a, t, 2.6, k, 466); brass(a, t + 0.03, 2.6, k * 0.8, 470); return; } //\n'
            '        brass(a, t, 1.4, k); //\n'
            '        for (let i = 0; i < 9; i++) brass(a, t + 1.8 + i * 0.16, 0.08, k); //\n'
            '        brass(a, t + 3.4, 1.4, k); //\n',
         '        if (o.pattern === "long") { brass(a, t, 2.6, k, 466); brass(a, t + 0.03, 2.6, k * 0.8, 470); return; } //\n'
         '        if (o.pattern === "drawn") {   // TERUAH_305: Rashi\'s - the tekia, the teruah and the tekia drawn out over o.dur seconds //\n'
         '          const d = Math.max(4.5, +o.dur || 20) / 3; //\n'
         '          brass(a, t, d - 0.25, k); //\n'
         '          for (let i = 0, n = Math.max(9, Math.round((d - 0.3) / 0.2)); i < n; i++) brass(a, t + d + i * 0.2, 0.13, k * 1.1); //\n'
         '          brass(a, t + 2 * d + 0.15, d - 0.15, k); //\n'
         '          return; //\n'
         '        } //\n'
         '        brass(a, t, 1.4, k); //\n'
         '        // TERUAH_305 (the user, 21:10: "ונראה לי יש תרועה שם גם"): the teruah\'s nine short blasts, each long enough to be heard as one //\n'
         '        // (0.08 s every 0.16 until 2.0.13 - one rattle) //\n'
         '        for (let i = 0; i < 9; i++) brass(a, t + 1.75 + i * 0.2, 0.13, k * 1.1); //\n'
         '        brass(a, t + 3.75, 1.4, k); //\n', 'trumpets')

# ---------- 4. the morning service ----------
s = once(s, '        else if (name === "tekia") { brass(a, t, 1.4); for (let i = 0; i < 9; i++) brass(a, t + 1.8 + i * 0.16, 0.08); brass(a, t + 3.4, 1.4); } //\n',
         '        else if (name === "tekia") { brass(a, t, 1.4); for (let i = 0; i < 9; i++) brass(a, t + 1.75 + i * 0.2, 0.13); brass(a, t + 3.75, 1.4); }   // TERUAH_305: the nine each heard //\n', 'tamid tekia')
PLAY = r'''    // MUSICIANS_305 (the user, 19.11.2026 21:08: "צריך גם לעשות את הלוויים מנגנים, אותו דבר בעבודת הבוקר. אם הם מנגנים, לא יכולים
    // לעמוד כמו פסלים"): THE PLAYER'S RIGHT HAND on the strings of the instrument in his left (the lyre: five strings on its face; the
    // harp: seven along it) - across them and back, a stroke in about 0.45 s, from the face of the strings nearer to him; the left arm
    // as POSES.play. And every Levite of the song - the players and the twelve singers - sways a little with it (songSway: the body
    // above the waist, aside and forward). Until 2.0.13 the right arm swung 0.12 in the air, and the singers stood still. The
    // motions - model choices
    const PLAY_STR = { lyre: [[-0.14, 0.33], [0.14, 0.38]], nevel: [[0.1, 0.45], [0.42, 0.55]] };
    const mPA = new Matrix4(), mPB = new Matrix4(), mPI = new Matrix4(), qP = new Quaternion(), eP = new Euler(), vP = new Vector3(), vP1 = new Vector3(), vP2 = new Vector3();
    const figNo = (f) => { if (f.no == null) { let h = 0; for (const c of String(f.id)) h = (h * 31 + c.charCodeAt(0)) % 997; f.no = h; } return f.no; };
    const playArm = (f, t) => {
      if (!f.A || !f.L || !f.L.grip || !f.R) return null;
      const inst = /^l(10|11)$/.test(f.id) ? "nevel" : /^l[1-9]$/.test(f.id) ? "lyre" : null, pr = inst && W.props[inst + "1"];
      if (!pr) return null;
      setArm(f.L, POSES.play[1], 1);
      f.L.sh.updateMatrix(); f.L.el.updateMatrix(); f.L.grip.updateMatrix();
      mPA.multiplyMatrices(f.L.sh.matrix, f.L.el.matrix).multiply(f.L.grip.matrix);
      if (pr.upright) {   // upright (applyProps): its own place in the hand, turned as the figure and by its own turn (grip.r[1])
        vP.set(pr.grip.p[0], pr.grip.p[1], pr.grip.p[2]).applyMatrix4(mPA);
        mPA.makeRotationY(pr.grip.r[1] || 0).setPosition(vP);
      } else {
        mPB.compose(vP.set(pr.grip.p[0], pr.grip.p[1], pr.grip.p[2]), qP.setFromEuler(eP.set(pr.grip.r[0], pr.grip.r[1], pr.grip.r[2])), vP2.set(1, 1, 1));
        mPA.multiply(mPB);   // the instrument in the frame of the arms' parent
      }
      const sp = f.R.sh.position;
      vP1.copy(sp).applyMatrix4(mPI.copy(mPA).invert());   // the right shoulder in the instrument's frame: which face of the strings is his
      const side = vP1.z >= 0 ? 1 : -1, ab = PLAY_STR[inst], u = 0.5 + 0.5 * Math.sin(t * 14 + figNo(f));
      vP.set(ab[0][0] + (ab[1][0] - ab[0][0]) * u, ab[0][1] + (ab[1][1] - ab[0][1]) * u, side * 0.06).applyMatrix4(mPA);
      return reach([sp.x, sp.y, sp.z], [vP.x, vP.y, vP.z], f.A.up, f.A.fo + 0.08, -1);
    };
    const songSway = (f, s) => {
      const t = s.t || 0, k = smooth(clamp(t / 0.6, 0, 1)) * smooth(clamp((s.tl == null ? 9 : s.tl) / 0.5, 0, 1)), ph = figNo(f) * 0.11;
      return [0.055 * k * Math.sin(t * 2.4 + ph), k * (0.04 + 0.035 * Math.sin(t * 4.8 + ph))];
    };
'''
s = once(s, '    const setArm = (A2, v, side) => { A2.sh.rotation.x = v[0]; A2.sh.rotation.z = side * v[1]; A2.el.rotation.x = v[2]; }; //\n',
         '    const setArm = (A2, v, side) => { A2.sh.rotation.x = v[0]; A2.sh.rotation.z = side * v[1]; A2.el.rotation.x = v[2]; }; //\n' + PLAY, 'playArm')
s = once(s, '        else if (p === "play") R = [R[0] + 0.12 * Math.sin(t * 7), R[1], R[2]]; //\n',
         '        else if (p === "play" || p === "sing") {   // MUSICIANS_305: the player\'s right hand over the strings; both sway with the song //\n'
         '          if (p === "play") { const H = playArm(f, t); R = H || [R[0] + 0.12 * Math.sin(t * 7), R[1], R[2]]; } //\n'
         '          const w = songSway(f, s); //\n'
         '          bendZ = w[0]; bendA = w[1]; //\n'
         '        } //\n', 'play pose')
s = once(s, '      LEV_PLAY.forEach((k) => a.pose(k, "play", 14.6, 30)); //\n',
         '      // MUSICIANS_305: the players and the twelve singers, with a pause at each section while the trumpets sound - "הגיעו לפרק - חלק //\n'
         '      // שבשיר. שכל שיר של יום חלקוהו לג\' חלקים, שמפסיקין שם בין פרק לפרק" (Yachin, Tamid 7, 818:712); the song again after each //\n'
         '      for (const [t0, t1] of [[14.6, 21], [23.2, 26], [28.2, 30]]) { LEV_PLAY.forEach((k) => a.pose(k, "play", t0, t1)); LEV_SING.forEach((k) => a.pose(k, "sing", t0, t1)); } //\n'
         '      a.fx("song", 23.2); a.fx("song", 28.2); //\n', 'nesachim play')
s = once(s, '      LEV_PLAY.forEach((k) => a.pose(k, "play", 0, 16)); //\n',
         '      LEV_PLAY.forEach((k) => a.pose(k, "play", 0, 16)); //\n      LEV_SING.forEach((k) => a.pose(k, "sing", 0, 16));   // MUSICIANS_305 //\n', 'shir play')

# MUSICIANS_305: the lyres and the harps stand upright in the hand (until 2.0.13 they turned with it, and in POSES.play lay flat);
# the harp turned so that its strings go toward his middle; the left hand lower, before the chest (the instrument from the chest up)
s = once(s, '        prop("lyre" + i, g, { p: [0, 0.1, 0.2], r: [0, 0, 0] }, false); //\n',
         '        prop("lyre" + i, g, { p: [0, 0.1, 0.05], r: [0, 0, 0] });   // MUSICIANS_305: upright (false until 2.0.13), on the hand (0.2 above it) //\n', 'lyre prop')
s = once(s, '        prop("nevel" + i, g, { p: [0, 0.05, 0.2], r: [0, 0, 0] }, false); //\n',
         '        prop("nevel" + i, g, { p: [0, 0.05, -0.05], r: [0, Math.PI, 0] });   // MUSICIANS_305: upright, its strings toward his middle, its foot at the hand //\n', 'nevel prop')
s = once(s, '            EU.set(0, f.g.rotation.y, 0); //\n',
         '            EU.set(0, f.g.rotation.y + (p.grip.r[1] || 0), 0);   // MUSICIANS_305: and its own turn //\n', 'upright yaw')
s = once(s, '      play: [[-0.75, -0.15, -1.15], [-0.95, -0.1, -0.9], 0], ',
         '      play: [[-0.75, -0.15, -1.15], [-0.2, -0.12, -1.35], 0], ', 'play left arm')

s = once(s, '          for (const [fx, fz] of [[121.6, -6], [121.6, 6]]) if (Math.hypot(x - fx, z - fz) < 1.6) return false;   // the two flutes //\n',
         '          for (const [fx, fz] of [[121.6, -6], [121.6, 6]]) if (Math.hypot(x - fx, z - fz) < 2.6) return false;   // the two flutes (MUSICIANS_305: 2.6, 1.6 until 2.0.13 - one stood before each) //\n', 'flutes room')

# ---------- 5. the readings ----------
T0 = ('לשון המשנה (סוכה ה, ד): ״הגיעו לעזרה, תקעו והריעו ותקעו. היו תוקעין והולכין, עד שמגיעין לשער היוצא מזרח״.\\n'
      '**רש״י:** ״והיו תוקעין והולכין — באלו שלש אחרונות מאריכין עד שמגיעין לשער היוצא מעזרת נשים להר הבית״. וכך הברטנורא (סוכה ה, ה): '
      '״הגיעו לעזרה תקעו והריעו ותקעו. ומאריכין בהן עד שהגיעו לשער התחתון, כדתנן היו תוקעין והולכין״; ותוספות יום טוב (סוכה ה, ד): '
      '״ומאריכין בהן עד שמגיעין וכו׳ רש״י, וכפירוש הר״ב במשנה דלקמן״.\\n'
      'בהדגמה: מן העזרה ועד השער היוצא למזרח — תקיעה ארוכה, תרועה ארוכה ותקיעה ארוכה, והכהנים הולכים. אורכן — בחירת מודל.')
T1 = ('לשון המשנה (סוכה ה, ד): ״היו תוקעין והולכין, עד שמגיעין לשער היוצא מזרח״.\\n'
      '**תפארת ישראל** (יכין, סוכה ה, ה): ״הך תנא ס״ל שלא תקעו למעלה העשירית, ואע״ג דגם לאחר מעלה עשירית קאמר תוקעין והולכין, היינו רק תקיעה בלי תרועה״.\\n'
      'בהדגמה: אחרי התקיעה, התרועה והתקיעה שבעזרה — שלוש תקיעות ארוכות בהליכה, בלי תרועה. מספרן ואורכן — בחירת מודל.')
ROW = ('        opRow({   // TERUAH_305 //\n'
       '          id: "sh60", short: "התקיעות בהליכה לשער המזרח — שמחת בית השואבה", cardFly: true, //\n'
       '          cap: "התקיעות בהליכה לשער המזרח — שמחת בית השואבה", //\n'
       '          refs: [["סוכה ה, ד", "Mishnah_Sukkah.5.4"], ["סוכה ה, ה", "Mishnah_Sukkah.5.5"], ["ברטנורא סוכה ה, ה", "Bartenura_on_Mishnah_Sukkah.5.5"], '
       '["תוספות יום טוב סוכה ה, ד", "Tosafot_Yom_Tov_on_Mishnah_Sukkah.5.4"], ["יכין סוכה ה, ה", {"book": 772, "index": 581}]], //\n'
       '          options: [["o0", "רש״י וברטנורא — התקיעה, התרועה והתקיעה של העזרה נמשכות בהליכה", "' + T0 + '"], //\n'
       '            ["o1", "תפארת ישראל — תקיעה בלי תרועה", "' + T1 + '"]], //\n'
       '          current: "o0", //\n'
       '          onPick: (k) => { const W = ctx.shared.simchaWalk; if (W && typeof W.set === "function") W.set(k === "o1" ? "tyt" : "rashi"); }, //\n'
       '          fly: () => { const c = [[205, 42, 62], [150, 9, 0]]; fly(c[0], c[1]); if (ctx.shared.fadeHold) ctx.shared.fadeHold.set(c[1]); } //\n'
       '        }); //\n')
lines = s.split('\n')
a = line_of(lines, '          id: "sh6", short: "חמש עשרה המעלות — צורתן", cardFly: true, //', 'sh6')
b = a
while lines[b].strip() != '}); //':
    b += 1
lines[b + 1:b + 1] = ROW.rstrip('\n').split('\n')
s = '\n'.join(lines)
s = once(s, '          ["עזרת נשים", ["sh4", "sh5", "sh6"]], //\n', '          ["עזרת נשים", ["sh4", "sh5", "sh6", "sh60"]], //\n', 'groups')

wr(p, s)
print('MUSICIANS_305 / TERUAH_305 applied')
