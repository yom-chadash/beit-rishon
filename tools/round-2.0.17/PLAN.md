# Round 2.0.17 (17.11.2026) — בית שני 2.0.8; בית ראשון 1.4.7 unchanged

## The user's two requests (17.11.2026, 14:05-14:06)
1. "אודות הפרוכת, היא מאויירת כאילו היא קצרה... ברש"י ביומא מבואר שהיא היתה על כל האורך אלא שהיתה נכפלת במקום הפתח ומחובת
   בקרסים להשאירה פתוחה, ובתוס' רי"ד מבואר שהיא מגיעה לגמרי עד הכותל ומחוברת בקרסים ולולאות... תבדוק מקורות לכך וא"כ תשנה".
2. "למה לשיטת רש"י שגם בבית שני היו עשרת השולחנות של שלמה. השולחנות מאויירים כשולחנות פשוטים בלי הסניפים והמנקיות... ובבית
   ראשון מאויירים השולחנות בשלמותם".

## Sources read (the Otzaria library, Sivan22/otzaria-library; DB line = the index the plugin opens)
- Mishnah Yoma 5:1 (55:38). Rashi Yoma 52b ד"ה פרופה (2157:1973); Rashi 51b ד"ה רבי יוסי היא (2157:1949) - the DB numbering of
  Rashi = the GitHub file's lines without its "<h3>שורה" lines, +1 (checked on six known refs).
- Tosafot Rid Yoma 52b (2109:161) - NOTE: on 52b, not 52a as the user wrote. Bartenura Yoma 5:1 (582:196). Meiri (2199:425).
  Tosafot Yom Tov Yoma 5:1 (898:155): "שהפרוכת על פני כל הדביר מכותל הצפון עד כותל הדרום" + his own picture (not drawn).
- Menachot 99a "ולא היו מסדרין אלא על של משה".

## Done
- 50-heichal.js PAROCHET_217: the parochot liner to liner (z +-9.39; the gold liners' faces are at +-9.38), each of two pieces (the
  body, and the corner on a hinge along the fold's line); ctx2.shared.parochetFold { mode, set("rashi"|"rid"), near(pts) }.
  Rashi: the corner folded east for good + a gold hook; the Rid: closed, pegs and loops along both walls, slack loops on the corner,
  in ykEntry the corner opens (laid back west, the way he goes) as the High Priest or the eye comes, and closes. The figures' textures
  now repeat by the amah (ShapeGeometry uv). parochotCount moves the inner one's group.
- 45-vessels.js SOLOMON_FORM_217: Solomon's ten with rig, ends and spoons (no bread, no frankincense); breadShape.retint - the posts'
  metal survived a switch of the loaves' shape (until 2.0.7 they went back to gold - Moses' table too).
- 70-ui.js: the row sh56 "פריפת הפרוכות — רש״י או תוספות רי״ד" (after sh47; in UI_OPS_V/P); the bullets of three cards; the place card
  "שתי הפרוכות": its text, refs, its view from inside the room (until now from inside the south liner) and the presentation's first
  look at the south opening; the YK demo card; the sh45 card; "מה חדש" 2.0.8.

## The build (no make.sh, no sources of the second house in this session)
patch217.py on unified-plugin/sheni/bundle.js of 2.0.16 -> house_sheni.py -> build-unified.mjs --sheni. Checked first: the same
procedure on the 2.0.16 bundle rebuilds unified-plugin/ and the branch html's file byte for byte.

## Checks
qa-unified.mjs: 20/20. checks/look.mjs (headless, swiftshader): both readings, the YK demo frame by frame (a slowed clock:
steps6_*.json), R. Yose's one parochet, the figures' modes, Solomon's tables with each metal and loaf shape, the row's card.
