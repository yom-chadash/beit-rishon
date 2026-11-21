//@@begin top-note
    // KIDDUSH_BEND_212 / KIDDUSH_FOOT_213 (the user, 16.11.2026 13:31 and 17:14: "הקידוש צריך להיות יד ימין על רגל ימין (מורמת) וכן
    // בשמאל לפי הסדר! בכל ההדגמות!" - as the Second Temple's 55-payis.js): the kutonet in two at the hips (WAIST; 1.36, at the avnet,
    // until 1.4.6) - that the body may bend there while the legs stay, and a leg may rise. One surface, its index cut at the hips' row:
    // the two parts share their vertices and normals (no seam while he stands); below, a narrower band inside, closing the back as he bends.
//@@end top-note
//@@begin ROWS
    const ROWS = 48, CUT = Math.round(ROWS * (WAIST - 0.1) / 1.8);
//@@end ROWS
//@@begin SY0
    // ---------- the avnet: one band at the elbows' height, lying on the kutonet
    const SY0 = 1.337, SY1 = 1.437;
    const gSash = surf(40, 6, (u, v, o) => {
      const y = SY0 + v * (SY1 - SY0), a = u * TAU + Math.PI, e = Math.sin(Math.PI * v), th = 0.003 + 0.011 * Math.pow(e, 0.35);
//@@end SY0
