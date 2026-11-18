#!/usr/bin/env python3
# round 3.0.3, the libation bowls (בית שני): SFALIM_303 - by text anchors on the readable bundle (sheni-src/bundle.js).
#   python3 -I tools/round-3.0.3/sfalim_patch.py sheni-src/bundle.js
# then: node tools/safe-lines.mjs sheni-src/bundle.js && node --check sheni-src/bundle.js
import sys, os, re

path = sys.argv[1]
here = os.path.dirname(os.path.abspath(__file__))
s = open(path, encoding='utf-8').read()
n_edits = 0

def strip(t):
    # the bundle closes its lines with " //": compare without it
    return '\n'.join(l[:-3] if l.endswith(' //') else l for l in t.split('\n'))

def rep(old, new, count=1):
    global s, n_edits
    k = s.count(old)
    if k != count:
        sys.exit('anchor found %d times (want %d): %r' % (k, count, old[:120]))
    s = s.replace(old, new)
    n_edits += 1

# 1. the bowls' block, whole
a = s.index("      // 1.4.0 (the user): THE TWO BOWLS of the libations")
a = s.rindex("    { //\n", 0, a)
lab = s.index('{ text: "ספלי הניסוך — מים (מערבי) ויין (מזרחי)", x: 47.2', a)
b = s.index("    } //\n", lab) + len("    } //\n")
block = open(os.path.join(here, 'sfalim-block.js'), encoding='utf-8').read()
s = s[:a] + block + s[b:]
n_edits += 1

# 2. the glass corner follows the bowls: R. Yose's altar (altarMeasures) and the Tannaim's places (the altar's PLACE)
rep("        if (ctx2.shared.__sfG) ctx2.shared.__sfG.position.set(y ? 4 : 0, 0, y ? -4 : 0); //\n",
    "        if (ctx2.shared.__sfG) ctx2.shared.__sfG.position.set(y ? 4 : 0, 0, y ? -4 : 0); //\n"
    "        if (ctx2.shared.sfalimSee) ctx2.shared.sfalimSee.refresh();   // SFALIM_303: the glass corner with the bowls //\n")
i = s.index("          mv.position.z = dz; //\n          mv.updateMatrixWorld(true); //\n")
rep("          mv.position.z = dz; //\n          mv.updateMatrixWorld(true); //\n",
    "          mv.position.z = dz; //\n          mv.updateMatrixWorld(true); //\n"
    "          if (ctx2.shared.sfalimSee) ctx2.shared.sfalimSee.refresh();   // SFALIM_303: the glass corner with the altar //\n")

# 3. the place: the glass corner while it shows, the eye where it sees the ways down, and the card
old_place = '{ t: "ספלי הניסוך", tg: () => ui_altarCam(ctx, [43.2, 25.3, 21.9], "cups"), cam: () => ui_altarCam(ctx, [48, 29.5, 17], "cups"), info: "'
rep(old_place,
    '{ t: "ספלי הניסוך", feature: (ctx.shared.features || {})["sfalimSee"] || null, '
    'tg: () => ui_altarCam(ctx, SFALIM_TG, "cups"), cam: () => ui_altarCam(ctx, SFALIM_CAM, "cups"), info: "')
old_tail = 'צורת הנקבים — חוטם בולט (רש״י וברטנורא) או נקב בתחתית (תוספות) — בתפריט, תחת ״שיטות ומחלוקות״.", refs: [["סוכה ד, ט", "Mishnah_Sukkah.4.9"]'
rep(old_tail,
    'צורת הנקבים — חוטם בולט (רש״י וברטנורא) או נקב בתחתית (תוספות) — בתפריט, תחת ״שיטות ומחלוקות״.'
    '\\nבמקום הזה פינת המזבח נעשית שקופה, וגם הרצפה שתחתיה: רואים את הנקבים יורדים מראש המזבח אל השיתין — '
    '״חלל שתחת המזבח כנגד מקום הנסכים״ (רש״י סוכה מט.). הספלים קבועים בגג בסיד, כדברי התוספות והתפארת ישראל. '
    'בשיטת רש״י: חוטם לכל ספל, ונקב בגג לכל אחד — אחד למים ואחד ליין (וכך גם לתפארת ישראל במידות ג, א), מעט אחרי פי החוטם, במקום שהנסך נופל. בשיטת התוספות: הנקב בתחתית כל ספל, '
    'ויורד ממנו ישר; ״ולשון מעובה משמע ששולי הספל היו עבים ומתוך כך אין המשקה ממהר לצאת״ (תוספות סוכה מח:) — במודל, בשיטה זו, ספל המים תחתיתו עבה: המים ממהרים לצאת מן היין (״שהמים ממהרים לצאת״, רש״י שם), והתחתית העבה משווה ביניהם; והנקבים שווים. '
    'גודל הספלים, מקומם המדויק, וגודל השיתין ועומקם — בחירת מודל.'
    '", refs: [["סוכה ד, ט", "Mishnah_Sukkah.4.9"]')
rep('["סוכה מח.", "Sukkah.48a"]] }, //\n',
    '["סוכה מח.", "Sukkah.48a"], ["רש״י סוכה מט.", { book: 2163, index: 2307 }], ["תוספות סוכה מח:", { book: 1903, index: 504 }], ["תוספות סוכה מח. (בסיד)", { book: 1903, index: 502 }]] }, //\n')
# the eye: from the south-south-west, high - the floor in front of the corner is not cut, so the hollow is seen through the glass top
rep("  function ui_altarCam(ctx, p, part) { //\n",
    "  // SFALIM_303: the place \"ספלי הניסוך\" - the target between the bowls and the shitin, the eye high in the south-south-west (the floor in //\n"
    "  // front of the corner stays whole: the hollow is seen down through the glass top and the glass floor) //\n"
    "  var SFALIM_TG = [43.5, 18.0, 22.4], SFALIM_CAM = [40.0, 34.5, 31.0]; //\n"
    "  function ui_altarCam(ctx, p, part) { //\n")

# 4. the tour keeps its hands off the layer of the glass corner's label (the feature drives it)
rep('const OWNED = new Set(["yatziaDims", ', 'const OWNED = new Set(["sfalimSee", "yatziaDims", ')


# 5. the morning service's libation (55-tamid.js, the stage "nesachim"): the priest of the libations stood where the western bowl stood
# until now (42.7, 9.5) and faced north-west, away from the bowls - the wine went on the top. Now he comes along the top's south side, turns
# north of the bowls (the way along their line went through them), and stands north of the wine's bowl, facing it, so that the jug's mouth
# is over it.
rep('A(50.8, 9.8), A(44, 9.6), A(42.7, 9.5)], 3, 7, { carry: true, yaw: -Math.PI * 0.75 });   // EAST_UP_211: up the east side, and at the top to his left, to the south-west horn //',
    'A(50.8, 9.8), A(46.6, 8.6), A(45.0, 8.05), A(SFALIM_POUR[0], SFALIM_POUR[1])], 3, 7, { carry: true, yaw: 0 });   // EAST_UP_211: up the east side, and at the top to his left, to the south-west horn; SFALIM_303: north of the bowls, to the wine\'s, facing it //')
rep("    SC.nesachim = (a) => { //\n",
    "    const SFALIM_POUR = [44.4, 7.45];   // SFALIM_303: where the priest of the libations stands to pour into the wine's bowl (40-altar.js: x 43.95, z 9.4) - the jug in his right hand, west of him and 1.95 before him, over its middle //\n"
    "    SC.nesachim = (a) => { //\n")


# 6. the row "נקבי ספלי הניסוך" (שיטות ומחלוקות): a reading picked opens the glass corner too, as the place does (so that the ways down of
# the two readings are compared), until another place is chosen (placeLeave, as the row of R. Yose's altar does); it flies to the
# place's eye (the old near eye looked between the bowls' old places)
rep('          onPick: (k) => { if (ctx.shared.sfalim && typeof ctx.shared.sfalim.set === "function") ctx.shared.sfalim.set(k === "o1" ? "tosafot" : "rashi"); }, //\n',
    '          onPick: (k) => { if (ctx.shared.sfalim && typeof ctx.shared.sfalim.set === "function") ctx.shared.sfalim.set(k === "o1" ? "tosafot" : "rashi"); '
    'const FS = (ctx.shared.features || {}).sfalimSee; if (FS) { try { const wasS = !!FS.isOn(); autoOff.run(FS); if (!wasS) leaveFeat = FS; } catch (_) {} } }, //\n')
rep('fly: (k) => { const c = {"o0": [[47.5, 29, 16.5], [43.2, 25.3, 21.9]], "o1": [[47.5, 29, 16.5], [43.2, 25.3, 21.9]]}[k];',
    'fly: (k) => { const c = {"o0": [SFALIM_CAM, SFALIM_TG], "o1": [SFALIM_CAM, SFALIM_TG]}[k];')

open(path, 'w', encoding='utf-8').write(s)
print('sfalim_patch: %d edits' % n_edits)
