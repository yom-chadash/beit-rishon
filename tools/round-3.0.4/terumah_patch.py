#!/usr/bin/env python3
# round 3.0.4 (בית שני 2.0.13) - the morning service's terumat hadeshen, as the user decided (19.11.2026 19:24-19:35):
#  CIRCUIT_304 - the one who won the terumah goes ROUND THE WHOLE ALTAR before he goes down: the user, of the Mishnah Zevachim 6:3
#    "כל העולין למזבח עולין דרך ימין, ומקיפין, ויורדין דרך שמאל, חוץ מן העולה לג' אלו" - "מה לא ברור בזה? זה לא נקרא הקפה"; up the
#    ramp's east side, the heap of the night's coals, east along the priests' walk ("מקום הילוך רגלי הכהנים", 24..26: x 43 / 68, z -16 / 9
#    in the altar's frame), north, west, south, down the WEST side; round the ramp's foot to its east (the user, 19:35: "מאושר"), north
#    some ten amot, the coals heaped three tefachim from the ramp. The stage 28 -> 36 s.
#  NIGHT_COALS_304 - the end of the night on the altar: the user, 19:24, "ערמת גחלים כפי שהצעת" (of the two shown him: "ערמת גחלים
#    לוחשות עם להבה נמוכה, בלי עצים שלמים"): from the demonstration's start until the great pyre is laid ("החלו מעלין בגזרין", 2:3)
#    the great and the second pyre's logs are not seen; low flames on a heap of glowing coals where the great pyre stands, and a small
#    heap where the second stands (40-altar.js: ctx2.shared.altarNight.set(k), k 1 the night .. 0 the model). Sources (read in the
#    library): Tamid 1:4 "אלא מהלך לאור המערכה"; the Rambam, Temidin 2:12 (344:27) "וחותה מן הגחלים שנתאכלו בלב האש"; the Yerushalmi,
#    Yoma 2:1 (155:75) "יכול עצים? ת"ל עולה... חותה מן המאוכלות הפנימיות"; the Tiferet Yisrael, Tamid 1 (818:122) "שבתחלה פינה את הגחלים
#    שנתהוו מהעצים של המערכה אילך ואילך לצדדי המזבח". The heaps' size, the flames' height - model choices.
#  The card: the absorbed ash (Yoma 21a, Abaye; Tosafot there - R. Porat / Rabbenu Tam; the Mefaresh, Tamid 28b; Kritot 6a) and in
#    which house (the Yerushalmi Yoma 1:4 with the Pnei Moshe; the Bavli Yoma 21b) - both sides, no decision (the user: "ציין בכרטיס אל
#    תכריע").
# Run from the repository's root: python3 -I tools/round-3.0.4/terumah_patch.py
import json, re, sys

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

# ---------- 1. 40-altar.js: the night of the altar ----------
s = once(s, '    instLogs(logs); //\n', '    const pyreLogsK = instLogs(logs);   // NIGHT_COALS_304: kept - not seen in the night of the morning\'s service //\n', 'instLogs')
s = once(s, '    { //\n      // 1.0.23: flames spread over the whole great pyre (top of the logs at y ~ 29) //',
         '    const GPF_FROM = flames.length;   // NIGHT_COALS_304 //\n    { //\n      // 1.0.23: flames spread over the whole great pyre (top of the logs at y ~ 29) //', 'GPF_FROM')
s = once(s, '    addFlame(46, TOP + 0.3, 5, 0.6, 1.6, 16758832, 0.8); //\n',
         '    addFlame(46, TOP + 0.3, 5, 0.6, 1.6, 16758832, 0.8); //\n    const GPF = flames.slice(GPF_FROM);   // NIGHT_COALS_304: the great pyre\'s fifteen flames and the second pyre\'s one //\n', 'GPF')
NIGHT = r"""      ctx2.shared.__coals3d = c3; //
    } //
    // NIGHT_COALS_304 (the user, 19.11.2026 19:24: "ערמת גחלים כפי שהצעת"): THE END OF THE NIGHT ON THE ALTAR - for the morning's //
    // service (55-tamid.js: from its start until the great pyre is laid). The logs of the great and the second pyre are not seen; a heap //
    // of glowing coals in grey ash where the great pyre stands, a small one where the second stands; the great pyre's flames come down //
    // onto the heap, lower; the sparks, the smoke and the glow rise from it. "אלא מהלך לאור המערכה" (Tamid 1:4); "וחותה מן הגחלים //
    // שנתאכלו בלב האש" (the Rambam, Temidin 2:12); "שבתחלה פינה את הגחלים שנתהוו מהעצים של המערכה אילך ואילך" (the Tiferet Yisrael, //
    // Tamid 1, 818:122). The heaps' size and form, the flames' height - model choices. set(k): 1 the night, 0 the model as it was //
    { //
      const NH = new Group(); //
      NH.name = "nightCoals"; //
      NH.visible = false; //
      const parent = (ctx2.shared.__coals3d && ctx2.shared.__coals3d.parent) || mv; //
      parent.add(NH); //
      const cG = new IcosahedronGeometry(1, 0); //
      const hot = new MeshStandardMaterial({ color: 0x3a1206, emissive: 0xff5a10, emissiveIntensity: 1.5, roughness: 1 }); //
      const warm = new MeshStandardMaterial({ color: 0x2a0d05, emissive: 0xc8360a, emissiveIntensity: 1.0, roughness: 1 }); //
      const ash = new MeshStandardMaterial({ color: 0x8a8580, roughness: 1 }); //
      let seed = 3041; //
      const rnd = () => (seed = (seed * 16807) % 2147483647) / 2147483647; //
      const lists = [[], [], []]; //
      // a heap: centre, half-sizes, height, pieces; ash on its rim, the glow in its heart //
      const heap = (cx, cz, rx, rz, h, n, s0, s1) => { //
        for (let i = 0; i < n; i++) { //
          const a = rnd() * Math.PI * 2, r = Math.sqrt(rnd()), x = cx + Math.cos(a) * rx * r, z = cz + Math.sin(a) * rz * r; //
          const y = TOP + 0.03 + (1 - r * r) * h * (0.75 + rnd() * 0.25); //
          const k = r > 0.82 ? (rnd() < 0.7 ? 2 : 1) : r > 0.55 ? (rnd() < 0.35 ? 2 : 1) : (rnd() < 0.6 ? 0 : 1); //
          lists[k].push([x, y, z, s0 + rnd() * (s1 - s0)]); //
        } //
      }; //
      heap((GP.x0 + GP.x1) / 2, GP.cz, 1.75, 3.1, 0.55, 300, 0.07, 0.15);   // where the great pyre stands (4.5 x 8) //
      heap(GP.x0 - 0.2, GP.cz + GP.hz - 0.6, 0.75, 0.6, 0.28, 50, 0.06, 0.11);   // its south-west foot - the inner coals, whence the terumah //
      heap(46, 5, 0.62, 0.55, 0.24, 46, 0.05, 0.1);   // the second pyre (addPyre(46, 5, ...)) //
      const m4 = new Matrix4(), q4 = new Quaternion(), e4 = new Euler(), v4 = new Vector3(), s4 = new Vector3(); //
      lists.forEach((list, k) => { //
        const im = new InstancedMesh(cG, [hot, warm, ash][k], list.length); //
        list.forEach((p, i) => { e4.set(rnd() * 6.28, rnd() * 6.28, rnd() * 6.28); q4.setFromEuler(e4); v4.set(p[0], p[1], p[2]); s4.set(p[3] * 1.3, p[3] * 0.7, p[3]); m4.compose(v4, q4, s4); im.setMatrixAt(i, m4); }); //
        im.userData.noPick = true; //
        im.receiveShadow = true; //
        NH.add(im); //
      }); //
      ctx2.animated.push((t) => { if (!NH.visible) return; hot.emissiveIntensity = 1.35 + 0.4 * Math.sin(t * 0.0068) * Math.sin(t * 0.0029 + 1); warm.emissiveIntensity = 0.85 + 0.3 * Math.sin(t * 0.0091 + 2); }); //
      const GL0 = { y: glow.position.y, op: glow.material.opacity, sx: glow.scale.x, sy: glow.scale.y }, FL0 = fireLight.position.y, TOP_F = FXP.top; //
      ctx2.shared.altarNight = { //
        k: 0, //
        set(k) { //
          k = Math.max(0, Math.min(1, +k || 0)); //
          if (Math.abs(k - this.k) < 1e-4) return; //
          this.k = k; //
          const night = k > 0.5; //
          pyreLogsK.visible = !night; //
          coals.visible = !night;   // the plane between the gezirin, on the pyre's top //
          if (ctx2.shared.__coals3d) ctx2.shared.__coals3d.visible = !night; //
          NH.visible = k > 0.01; //
          NH.scale.y = Math.max(0.05, k); //
          for (const f of GPF) { //
            const u = f.userData; //
            if (u.ny0 == null) { u.ny0 = f.position.y; u.nh0 = u.h; } //
            f.position.y = u.ny0 + (TOP + 0.3 - u.ny0) * k; //
            u.h = u.nh0 * (1 - 0.62 * k); //
          } //
          FXP.top = TOP_F + (0.55 - TOP_F) * k; //
          glow.position.y = GL0.y + (TOP + 1.0 - GL0.y) * k; //
          glow.material.opacity = GL0.op * (1 - 0.25 * k); //
          glow.scale.set(GL0.sx * (1 - 0.3 * k), GL0.sy * (1 - 0.45 * k), 1); //
          fireLight.position.y = FL0 - 2.2 * k; //
        } //
      }; //
    } //"""
s = once(s, "      ctx2.shared.__coals3d = c3; //\n    } //", NIGHT, 'coals3d end')

# ---------- 2. 55-tamid.js: the state "night", the restore, the pyre laid ----------
s = once(s, "        blood: { ne: 0, sw: 0, ys: 0 }, chelG: 0, roofs: false, torches: [0, 0], coalsS: 0, coalsG: 0, teniAsh: 0, kafLid: 1, mizrak: 0, slab: 0, slabKeys: 1, fx: [] }); //",
         "        blood: { ne: 0, sw: 0, ys: 0 }, chelG: 0, roofs: false, torches: [0, 0], coalsS: 0, coalsG: 0, teniAsh: 0, kafLid: 1, mizrak: 0, slab: 0, slabKeys: 1, fx: [], night: 1 }); //   // NIGHT_COALS_304: night", 'resetState')
s = once(s, "      for (const m of W.modelGez) m.visible = N.gz > 0.5; //\n",
         "      for (const m of W.modelGez) m.visible = N.gz > 0.5; //\n      if (SH.altarNight && fnc(SH.altarNight.set)) SH.altarNight.set(N.night);   // NIGHT_COALS_304 //\n", 'applyWorld')
s = once(s, "      for (const o of W.modelGez) o.visible = true; //\n",
         "      for (const o of W.modelGez) o.visible = true; //\n      if (SH.altarNight && fnc(SH.altarNight.set)) SH.altarNight.set(0);   // NIGHT_COALS_304: the model's own pyres again //\n", 'restore')
s = once(s, "      a.ramp(\"l1\", 0, 4, 10.4, 16.6); //\n",
         "      a.ramp(\"l1\", 0, 4, 10.4, 16.6); //\n      a.ramp(\"night\", 1, 0, 10.4, 16.6);   // NIGHT_COALS_304: the great pyre laid - its logs come, the night's heap goes //\n", 'maarachah night')

# ---------- 3. 55-tamid.js: the terumah, round the altar ----------
i = s.index("    SC.terumah = (a) => { //")
j = s.index("    const TAP = [0.55, 0.95, 1.35, 1.75]", i)
OLD = s[i:j]
for need in ['a.walk("t", [pan, A(46.6, 41.9), A(49.6, 41.9), A(60.2, 41.7), A(60.0, 12.2), A(57.4, 7.2)], 4.8, 10.6, { hold: true, yaw: Math.PI * 0.75 }); //',
             'a.walk("t", [A(57.4, 7.2), A(51.2, 12.2), A(50.6, 40.6), A(55.5, 42.2), A(64.4, 42.3), A(64.4, 33.4)], 14.2, 21.4, { hold: true, yaw: Math.PI }); //']:
    if OLD.count(need) != 1:
        sys.exit('terumah: ' + need[:40])
NEW = OLD
NEW = NEW.replace('a.walk("t", [pan, A(46.6, 41.9), A(49.6, 41.9), A(60.2, 41.7), A(60.0, 12.2), A(57.4, 7.2)], 4.8, 10.6, { hold: true, yaw: Math.PI * 0.75 }); //',
    '// CIRCUIT_304 (the user, 19.11.2026 19:24, of the Mishnah Zevachim 6:3 - 130:2152 - "כל העולין למזבח עולין דרך ימין, ומקיפין, //\n'
    '      // ויורדין דרך שמאל... מה לא ברור בזה? זה לא נקרא הקפה"; the Rambam, Ma\'aseh HaKorbanot 7:11, 341:123, and his commentary there: //\n'
    '      // "וסובב על המזבח כלו"): up the east side to the inner coals at the night\'s heap (NIGHT_COALS_304: by the old fire\'s south-west), //\n'
    '      // then round the whole altar on the priests\' walk - east, the south-east horn, north, west, south - and down the ramp\'s WEST side; //\n'
    '      // below, round the ramp\'s foot to its east (the user, 19:35: "מאושר"; no source names it) and north some ten amot (Tamid 1:4; //\n'
    '      // the Tiferet Yisrael, 818:126 "עד י\' אמות מתחלת תחתית הכבש"). Until 2.0.12 he went down straight from the coals, no circuit. //\n'
    '      const SC0 = A(59.0, 4.7);   // by the heap\'s south-west foot, his face to its heart //\n'
    '      a.walk("t", [pan, A(46.6, 41.9), A(49.6, 41.9), A(60.2, 41.7), A(60.0, 12.2), A(59.6, 8.0), SC0], 4.8, 10.6, { hold: true, yaw: 2.6 }); //', 1)
NEW = NEW.replace('a.walk("t", [A(57.4, 7.2), A(51.2, 12.2), A(50.6, 40.6), A(55.5, 42.2), A(64.4, 42.3), A(64.4, 33.4)], 14.2, 21.4, { hold: true, yaw: Math.PI }); //',
    'a.walk("t", [SC0, A(60.8, 9.0), A(68.0, 9.0), A(68.0, -16.0), A(43.0, -16.0), A(43.0, 9.0), A(51.2, 9.4)], 14.2, 22.0, { hold: true, yaw: 0 });   // CIRCUIT_304: the priests\' walk //\n'
    '      a.walk("t", [A(51.2, 9.4), A(51.2, 12.2), A(50.6, 40.6), A(55.5, 42.2), A(64.4, 42.3), A(64.4, 33.4)], 22.2, 29.4, { hold: true, yaw: Math.PI }); //', 1)
for a_, b_ in [('a.pose("t", "pour", 21.8, 24.4); //', 'a.pose("t", "pour", 29.8, 32.4); //'),
               ('a.fx("coals", 22.2);   // SOUND_211 //', 'a.fx("coals", 30.2);   // SOUND_211 //'),
               ('a.set("coalsS", 0, 23.4); //', 'a.set("coalsS", 0, 31.4); //'),
               ('a.putA("ashHeap", 64.05, 32.4, 23.2); //', 'a.putA("ashHeap", 64.05, 32.4, 31.2); //'),
               ('a.putA("machtaS", 65.3, 34.3, 25.4, 0.4); //', 'a.putA("machtaS", 65.3, 34.3, 33.4, 0.4); //'),
               ('a.tag("t", "תרומת הדשן", 1, 25); //', 'a.tag("t", "תרומת הדשן", 1, 14.1); //\n      a.tag("t", "מקיף את כל המזבח — ״ומקיפין, ויורדין דרך שמאל״", 14.2, 22.1);   // CIRCUIT_304 //\n      a.tag("t", "יורד במערב הכבש, ומקיף את רגלו אל מזרח הכבש", 22.2, 29.5); //\n      a.tag("t", "צובר את הגחלים — כעשר אמות מתחתית הכבש", 29.6, 33.4); //')]:
    if NEW.count(a_) != 1:
        sys.exit('terumah times: ' + a_)
    NEW = NEW.replace(a_, b_)
s = s[:i] + NEW + s[j:]

# ---------- 4. TAMID_DATA: the stage's length, captions, text and sources ----------
i = s.index('  var TAMID_DATA = ')
j = s.index('\n', i)
m = re.match(r'(  var TAMID_DATA = )(\{.*\})(;?\s*//.*)$', s[i:j])
d = json.loads(m.group(2))
st = d['stages']['terumah']
assert st['dur'] == 28 and len(st['caps']) == 4
st['dur'] = 36
st['caps'] = [[1, "נָטַל מַחְתַּת הַכֶּסֶף וְעָלָה לְרֹאשׁ הַמִּזְבֵּחַ"],
              [8, "וּפִנָּה אֶת הַגֶּחָלִים הֵילָךְ וְהֵילָךְ, חָתָה מִן הַמְאֻכָּלוֹת הַפְּנִימִיּוֹת"],
              [14.4, "״כל העולין למזבח עולין דרך ימין, ומקיפין, ויורדין דרך שמאל״ (זבחים ו, ג)"],
              [22.2, "וְיָרַד. הִגִּיעַ לָרִצְפָה, הָפַךְ פָּנָיו לַצָּפוֹן, הָלַךְ לְמִזְרָחוֹ שֶׁל כֶּבֶשׁ כְּעֶשֶׂר אַמּוֹת"],
              [29.6, "צָבַר אֶת הַגֶּחָלִים עַל גַּבֵּי הָרִצְפָה רָחוֹק מִן הַכֶּבֶשׁ שְׁלשָׁה טְפָחִים"]]
st['text'] = (
    "בראש המזבח — מה שנשאר מן הלילה: ערמת גחלים לוחשות ולהבה נמוכה, בלי עצים שלמים (״אלא מהלך לאור המערכה״, תמיד א, ד; "
    "״וחותה מן הגחלים שנתאכלו בלב האש״, רמב״ם תמידין ב, יב; ״שבתחלה פינה את הגחלים שנתהוו מהעצים של המערכה אילך ואילך לצדדי "
    "המזבח״, תפארת ישראל). הזוכה עולה במזרח הכבש עם מחתת הכסף, מפנה את הגחלים, חותה מן הגחלים הפנימיות, ומקיף את כל המזבח על "
    "מקום הילוך הכהנים: ״כל העולין למזבח עולין דרך ימין, ומקיפין, ויורדין דרך שמאל״ (משנה זבחים ו, ג; רמב״ם מעשה הקרבנות ז, יא; "
    "״בכל יום כהנים עולים במזרחו של כבש ויורדין במערבו״, יומא ד, ה). הוא יורד במערב הכבש, מקיף את רגל הכבש אל מזרחו (אין לכך מקור "
    "מפורש — בחירת מודל), הולך צפונה כעשר אמות מתחתית הכבש, וצובר שם את הגחלים, שלשה טפחים מן הכבש — ״עד י׳ אמות מתחלת תחתית "
    "הכבש... בריחוק ג׳ טפחים מהכבש, שלא ישחיר כותל הכבש״ (תפארת ישראל).\n"
    "**האם הדשן נבלע במקומו?** אביי (יומא כא.): ״מוראה, ונוצה, ודישון מזבח הפנימי, ודישון המנורה — נבלעין במקומן״ — והם ניתנים "
    "במקום הזה (רש״י שם). ועל תרומת הדשן עצמה נחלקו: לרב פורת (בתוספות שם) — אף היא נבלעת; ולרבנו תם (שם) — אינה נבלעת, שהרי "
    "״ושמו — בנחת... ואפר הקדש לעולם אסור״, וטעונה גניזה; וכן המפרש (תמיד כח:): ״אבל תרומת הדשן נ״ל דלא היתה נבלעת״, ״ואמרינן "
    "בכריתות ושמו מלמד שטעונין גניזה״.\n"
    "**ובאיזה בית?** הבבלי אינו מפרש. בירושלמי (יומא א, ד), על נס אחר מאותה רשימה: ״אמר רבי יוסי בירבי בון: כאן בראשון וכאן "
    "בשיני״ — ״כאן בבית ראשון היו אלו הנסים״ (פני משה). ומנגד, נסים אחרים היו גם בבית שני, אלא שנתמעטו: ״כאן — במקדש ראשון, "
    "כאן — במקדש שני״ (יומא כא:). בהדגמה הגחלים נשארים על הרצפה — זו בחירת תצוגה, ולא הכרעה.")
st['refs'] = st['refs'] + [
    ["זבחים סג. (המשנה)", {"book": 130, "index": 2152}], ["זבחים סד: (הברייתא)", {"book": 130, "index": 2178}],
    ["רמב״ם מעשה הקרבנות ז, יא", {"book": 341, "index": 123}], ["יומא ד, ה", {"book": 55, "index": 35}],
    ["רמב״ם תמידין ומוספין ב, ד", {"book": 344, "index": 19}],
    ["יכין תמיד א (אות ס)", {"book": 818, "index": 122}], ["יכין תמיד א (אות סב–סג)", {"book": 818, "index": 126}],
    ["יומא כא.", {"book": 107, "index": 457}], ["יומא כא:", {"book": 107, "index": 467}],
    ["ירושלמי יומא א, ד", {"book": 155, "index": 46}], ["ירושלמי יומא ב, א", {"book": 155, "index": 75}]]
s = s[:i] + m.group(1) + json.dumps(d, ensure_ascii=False) + m.group(3) + s[j:]
wr(p, s)
print('CIRCUIT_304, NIGHT_COALS_304: patched')
