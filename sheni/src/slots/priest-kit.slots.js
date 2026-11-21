//@@begin top-note
    // KIDDUSH_BEND_212 / KIDDUSH_FOOT_213 (the user, 16.11.2026 13:31 and 17:14: "הקידוש צריך להיות יד ימין על רגל ימין (מורמת) וכן
    // בשמאל לפי הסדר! בכל ההדגמות!"): the kutonet in two at the hips (WAIST - the name kept; 1.33, at the avnet, until 2.0.4) - that the
    // body may bend there while the legs stay, and a leg may rise (55-tamid.js). One surface (as gRobeBody: its folds, shades and uv), its
    // index cut at the row of the hips: the two parts share their vertices and normals - no seam while he stands. Below, a band a little
    // narrower inside the upper part, narrowing as it goes up: hidden while he stands, it closes the back as he bends.
//@@end top-note
//@@begin ROWS
    const ROWS = 48, CUT = Math.round(ROWS * (WAIST - 0.1) / 1.8);   // (the hips' row: 24)
//@@end ROWS
//@@begin SY0
    // ---------- the avnet: one band at the elbows' height, lying on the kutonet
    // AVNET_211 (the user: "אבנט הכהנים רחב יותר"): broader, and its turns seen - three turns "כרך על גבי כרך" (8:19), each rounded
    const SY0 = 1.312, SY1 = 1.462;
    const gSash = surf(40, 12, (u, v, o) => {
      const tv = (v * 3) % 1, e = Math.max(0, Math.sin(Math.PI * tv)) * (0.55 + 0.45 * Math.sin(Math.PI * v));
      const y = SY0 + v * (SY1 - SY0), a = u * TAU + Math.PI, th = 0.004 + 0.017 * Math.pow(e, 0.35);
//@@end SY0
