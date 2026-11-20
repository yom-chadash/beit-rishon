#!/usr/bin/env python3
# BEHIND_DOORS_306 - the second house's heichal: the wall behind the inner doors without gold.
# A report sent on to the user (20.11.2026 14:21): "מאחורי דלתות ההיכל בדוגמאות שלכם הוא טוח בזהב ואילו במשנה מפורש ששם היה טוח בסיד...
# הַפְּנִימִיּוֹת נִפְתָּחוֹת לְתוֹךְ הַבַּיִת לְכַסּוֹת אַחַר הַדְּלָתוֹת, שֶׁכָּל הַבַּיִת טוּחַ בְּזָהָב, חוּץ מֵאַחַר הַדְּלָתוֹת"; the user: "התיקון שייך רק לבית
# שני". Checked: the gate's wall (H2.wall "gateWall", x -4.5..1.5) was all M2.gold, its inner face beside the doorway too - while the
# place "פיתוחי הקירות" said "מאחורי הדלתות — בלא ציפוי, כמשנה". "סיד" is said in none of the user's library's texts on the place (the
# Mishnah, the Rambam's code and commentary, Bartenura, Tosafot Yom Tov, Tiferet Yisrael, Melekhet Shlomo, Kovetz Shitot Kamai, Kesef
# Mishneh, Ma'aseh Rokeach, Mishnat Eretz Israel) - only "חוץ מאחר הדלתות"; Tiferet Yisrael (Yachin, Middot 4:1, line 488): "וההיכל כולו
# מצופה זהב, חוץ מאותן ה' אמות מזה ומזה לדלתות כגובה הדלתות, דמדאין הזהב נראה כשנפתחות". Now: on the gate wall's inner face, from the
# doorway (z +-5) to the side walls' gold liners (z +-9.38), the doors' height (20 amot) - the building's bare marble, under the inner
# doors when they stand open. Shown in the Tanna Kamma's reading (the inner doors open into the house); in R. Yehuda's they stand in the
# doorway and cover nothing there - the wall all gold. What was there instead of gold is not said - the bare marble is a model choice.
import sys
p = 'sheni-src/bundle.js'
s = open(p, encoding='utf-8').read()
if 'BEHIND_DOORS_306' in s:
    sys.exit('BEHIND_DOORS_306 already applied')
def once(old, new, what):
    global s
    k = s.count(old)
    if k != 1:
        sys.exit('%s: %d' % (what, k))
    s = s.replace(old, new)
a = s.index('    const gateWall = H2.wall(g, {   // 1.9.1')
b = s.index('    }); //\n', a) + len('    }); //\n')
s = s[:b] + (
    '    // BEHIND_DOORS_306 (a report sent on to the user, 20.11.2026; the user: "רק בבית שני"): "והפנימיות נפתחות לתוך הבית לכסות אחר //\n'
    '    // הדלתות, שכל הבית טוח בזהב, חוץ מאחר הדלתות" (Middot 4:1). The gate wall was all gold; now its inner face beside the doorway - //\n'
    '    // from the doorway to the side walls\' liners, the doors\' height (Tiferet Yisrael there: "חוץ מאותן ה\' אמות מזה ומזה לדלתות //\n'
    '    // כגובה הדלתות, דמדאין הזהב נראה כשנפתחות") - is the building\'s bare marble, under the inner doors when they stand open. In the //\n'
    '    // Tanna Kamma\'s reading only (ctx2.shared.greatGate.set); what was there instead of gold is not said - the marble, a model choice //\n'
    '    const bareBehind = new Group(); //\n'
    '    bareBehind.name = "behind-doors"; //\n'
    '    g.add(bareBehind); //\n'
    '    for (const sd of [-1, 1]) H2.box(bareBehind, 0.05, 20, 4.38, M2.marble, -4.53, F, sd * 7.19); //\n'
) + s[b:]
once('          tkG.visible = this.mode === "tk"; //\n',
     '          tkG.visible = this.mode === "tk"; //\n'
     '          bareBehind.visible = this.mode === "tk";   // BEHIND_DOORS_306 //\n', 'gate set')
once('במודל: פיתוחי הזהב כבמודל בית ראשון — כרובים, תמורות, פטורי ציצים וחבלים — על קירות הקודש וקודש הקדשים; מאחורי הדלתות — בלא ציפוי, כמשנה."',
     'במודל: פיתוחי הזהב כבמודל בית ראשון — כרובים, תמורות, פטורי ציצים וחבלים — על קירות הקודש וקודש הקדשים.\\n'
     '**מאחר הדלתות:** תפארת ישראל (מידות ד, א): ״וההיכל כולו מצופה זהב, חוץ מאותן ה׳ אמות מזה ומזה לדלתות כגובה הדלתות, דמדאין הזהב נראה כשנפתחות״. '
     'במודל: בכותל המזרחי של ההיכל מבפנים, משני צדי הפתח ועד הכתלים, בגובה הדלתות — אבן בלא זהב, ועליה נשענות הדלתות הפנימיות כשהן פתוחות. '
     'מה היה שם במקום הזהב — לא נאמר; האבן — בחירת מודל. בשיטת רבי יהודה הדלתות עומדות בתוך הפתח, ואינן מכסות שם דבר — במודל הכותל כולו זהב."', 'card')
once('["תפא״י ד, ו", "Yachin_on_Mishnah_Middot.4.6"], ["יומא נד.", "Yoma.54a"]] }, //',
     '["תפא״י ד, ו", "Yachin_on_Mishnah_Middot.4.6"], ["תפא״י ד, א", "Yachin_on_Mishnah_Middot.4.1"], ["יומא נד.", "Yoma.54a"]] }, //', 'refs')
open(p, 'w', encoding='utf-8').write(s)
print('BEHIND_DOORS_306 applied')
