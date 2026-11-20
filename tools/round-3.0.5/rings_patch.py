# RINGS_305 (3.0.5) - the slaughter rings' arrangement: "ששה סדרים של ארבע ארבע" (the first Tanna - each order one row of four, as
# Rabbeinu Shemaya, "היו הטבעות בשורה אחת ובכל סדר ארבעה טבעות", read by the user, 20.11.2026 01:30: "ב... הנכון") or "ויש אומרים,
# ארבעה של שש שש" - a new row "סידור הטבעות" (sh62; the user: "מתג"); Rabbeinu Shemaya's own words on the rings' card.
# Run in the chain after demolist_patch.py: python3 -I tools/round-3.0.5/rings_patch.py
import sys

def once(s, old, new, what):
    k = s.count(old)
    if k != 1:
        sys.exit('%s: anchor found %d times' % (what, k))
    return s.replace(old, new)

p = 'sheni-src/bundle.js'
s = open(p, encoding='utf-8').read()
if 'RINGS_305' in s:
    sys.exit('already applied')

# ---------- 1. the rings laid out by one function: the arrangement, and R. Yose's single row ----------
s = once(s,
         '      let k = 0; //\n'
         '      for (let i = 0; i < 6; i++) for (let j = 0; j < 4; j++) { //\n'
         '        m42.makeTranslation(42 + i * 4, F + 0.35, -18 - j * 6);   // 1.5.0: the rings\' place -39..-15 (Rambam 5:14-15: 24 amot, 8 from the altar at -7) //\n'
         '        inst.setMatrixAt(k++, m42); //\n'
         '      } //\n',
         '      // RINGS_305 (the user, 20.11.2026 01:25 / 01:30): the arrangement - "ששה סדרים של ארבע ארבע" (the first Tanna, the default: six //\n'
         '      // rows north-south, four rings in each - each order one row, as Rabbeinu Shemaya: "היו הטבעות בשורה אחת ובכל סדר ארבעה טבעות") or //\n'
         '      // "ויש אומרים, ארבעה של שש שש" (four rows of six) - both in the rings\' 24 amot (Middot 5:2; 1.5.0: z -39..-15, 8 from the altar //\n'
         '      // at -7, Rambam 5:14-15); the row "סידור הטבעות" (sh62). R. Yose\'s place (the switch below) keeps its single row of six. //\n'
         '      let ringsMode = "six4", ringsOne = false; //\n'
         '      const ringsApply = () => { //\n'
         '        const zero = new Matrix4().makeScale(0, 0, 0); //\n'
         '        let k = 0; //\n'
         '        if (ringsOne) { for (let i = 0; i < 24; i++) { if (i < 6) { m42.makeTranslation(42 + i * 4, F + 0.35, -42); inst.setMatrixAt(k++, m42); } else inst.setMatrixAt(k++, zero); } } //\n'
         '        else if (ringsMode === "four6") { for (let i = 0; i < 4; i++) for (let j = 0; j < 6; j++) { m42.makeTranslation(42 + i * 20 / 3, F + 0.35, -17 - j * 4); inst.setMatrixAt(k++, m42); } } //\n'
         '        else { for (let i = 0; i < 6; i++) for (let j = 0; j < 4; j++) { m42.makeTranslation(42 + i * 4, F + 0.35, -18 - j * 6); inst.setMatrixAt(k++, m42); } } //\n'
         '        inst.instanceMatrix.needsUpdate = true; //\n'
         '        inst.computeBoundingSphere(); //\n'
         '      }; //\n'
         '      ringsApply(); //\n'
         '      ctx2.shared.ringsLayout = { //\n'
         '        get current() { return ringsMode; }, //\n'
         '        set(m) { ringsMode = m === "four6" ? "four6" : "six4"; ringsApply(); return ringsMode; }, //\n'
         '        one(b) { ringsOne = !!b; ringsApply(); } //\n'
         '      }; //\n', 'rings')
s = once(s,
         '            const one = key === "north", mm = new Matrix4(), zero = new Matrix4().makeScale(0, 0, 0); //\n'
         '            let kk = 0; //\n'
         '            for (let i = 0; i < 6; i++) for (let j = 0; j < 4; j++) { //\n'
         '              if (one && j > 0) ringsInst.setMatrixAt(kk++, zero); //\n'
         '              else { mm.makeTranslation(42 + i * 4, F + 0.35, one ? -42 : -18 - j * 6); ringsInst.setMatrixAt(kk++, mm); } //\n'
         '            } //\n'
         '            ringsInst.instanceMatrix.needsUpdate = true; //\n'
         '            ringsInst.computeBoundingSphere(); //\n',
         '            const one = key === "north"; //\n'
         '            if (ctx2.shared.ringsLayout) ctx2.shared.ringsLayout.one(one);   // RINGS_305: R. Yose\'s row and the arrangement together //\n',
         'place switch')

# ---------- 2. the rings' card: Rabbeinu Shemaya in his own words ----------
s = once(s, 'לר׳ שמעיה, בתוספות יום טוב — אלו ואלו עשרים וארבע; במודל — ששה סדרים של ארבע.',
         'לרבינו שמעיה — אלו ואלו עשרים וארבע, וכל סדר שורה אחת; במודל — ששה סדרים של ארבע, ובמתג ״סידור הטבעות״ גם ארבעה של שש.', 'card short')
s = once(s, '\\n**תפארת ישראל:** קבועות ברצפה בצפון המזבח,',
         '\\n**רבינו שמעיה** (מידות ג, ה): ״ו׳ סדרים. היו הטבעות בשורה אחת ובכל סדר ארבעה טבעות, שהן כ״ד טבעות לכ״ד משמרות. וי״א ד׳ סדרים היו של שש שש טבעות, שהן נמי כ״ד״ — כל סדר שורה אחת של ארבע.'
         '\\n**תפארת ישראל:** קבועות ברצפה בצפון המזבח,', 'card shemaya')
s = once(s, 'במודל: עשרים וארבע טבעות ברצפה בצפון המזבח, ששה סדרים של ארבע; צורתן — בחירת מודל.", refs: [["מידות ג, ה"',
         'במודל: עשרים וארבע טבעות ברצפה בצפון המזבח, ששה סדרים של ארבע — כל סדר שורה אחת מצפון לדרום; ובמתג ״סידור הטבעות״ (שיטות ומחלוקות) — ארבעה של שש. צורתן — בחירת מודל.", refs: [["מידות ג, ה"', 'card model')

# ---------- 3. the row, its group and the place's card ----------
T0 = ('**המשנה** (מידות ג, ה): ״וטבעות היו לצפונו של מזבח, ששה סדרים של ארבע ארבע״.\\n'
      '**רבינו שמעיה** (שם): ״ו׳ סדרים. היו הטבעות בשורה אחת ובכל סדר ארבעה טבעות, שהן כ״ד טבעות לכ״ד משמרות״ — כל סדר שורה אחת של ארבע.\\n'
      'במודל: שש שורות מצפון לדרום, ובכל אחת ארבע טבעות, בעשרים וארבע האמות של מקום הטבעות (מידות ה, ב).')
T1 = ('**המשנה** (מידות ג, ה): ״ויש אומרים, ארבעה של שש שש״.\\n'
      '**רבינו שמעיה** (שם): ״וי״א ד׳ סדרים היו של שש שש טבעות, שהן נמי כ״ד״; וכך בתוספות יום טוב.\\n'
      'במודל: ארבע שורות מצפון לדרום, ובכל אחת שש טבעות, באותן עשרים וארבע אמות.')
ROW = ('        opRow({   // RINGS_305 (the user, 20.11.2026 01:30: "מתג") //\n'
       '          id: "sh62", short: "סידור הטבעות — ששה של ארבע או ארבעה של שש", cardFly: true, //\n'
       '          cap: "סידור הטבעות (מידות ג, ה)", //\n'
       '          refs: [["מידות ג, ה", "Mishnah_Middot.3.5"], ["תוי״ט מידות ג, ה", "Tosafot_Yom_Tov_on_Mishnah_Middot.3.5"], ["מידות ה, ב", "Mishnah_Middot.5.2"]], //\n'
       '          options: [["o0", "תנא קמא — ששה סדרים של ארבע ארבע", "' + T0 + '"], //\n'
       '            ["o1", "ויש אומרים — ארבעה של שש שש", "' + T1 + '"]], //\n'
       '          current: "o0", //\n'
       '          onPick: (k) => { const R = ctx.shared.ringsLayout; if (R && typeof R.set === "function") R.set(k === "o1" ? "four6" : "six4"); }, //\n'
       '          fly: () => { fly([52, 46, -4], [52, 14, -27]); } //\n'
       '        }); //\n')
lines = s.split('\n')
hits = [i for i, l in enumerate(lines) if l.startswith('          id: "sh15", short: ')]
if len(hits) != 1:
    sys.exit('sh15 row: %d' % len(hits))
b = hits[0]
while lines[b].strip() != '}); //':
    b += 1
lines[b + 1:b + 1] = ROW.rstrip('\n').split('\n')
s = '\n'.join(lines)
s = once(s, '          ["העזרה", ["sh9", "sh54", "sh8", "sh11", "sh10", "sh14", "sh15"]], //\n',
         '          ["העזרה", ["sh9", "sh54", "sh8", "sh11", "sh10", "sh14", "sh15", "sh62"]], //\n', 'group')
s = once(s, '"הכיור": ["sh26"],', '"הכיור": ["sh26"], "הטבעות": ["sh62"],', 'place rows')

open(p, 'w', encoding='utf-8').write(s)
print('RINGS_305 applied')
