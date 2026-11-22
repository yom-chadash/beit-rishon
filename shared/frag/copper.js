  // ===== COPPER_C BEGIN - ONE COPPER FOR BOTH HOUSES (shared/frag/copper.js; fix-c, 22.11.2026). The user, 12:23: "שים לב לצבע הנחושת של
  // החוברת — כך צריך להיות במודל" - the book "מקרא מפורש" (pp. 17-21: the Sea, the bases, the lavers, Yachin and Boaz, the vessels of
  // bronze; "ויעש את המכנות עשר נחשת", I Kings 7:27 - the whole base, its frame and its wheels too): an orange-red copper, saturated
  // and polished - the scan sampled: the shadow #8d341f, the middle #af3928..#a24b14, the glints #df7720..#f59d40.
  // tm_copperHex(hex) - an old bronze tone in the copper's hue: its lightness kept (so the darker grooves, the dark basin of Yachin and
  // Boaz and the darker wheels stay darker, the polished rims lighter - one hue), the hue going from red in the dark tones to orange in
  // the light ones (as the book's shadow and glint), the saturation high. tm_copperCss(css) - the same for a canvas colour ("#rrggbb").
  // tm_copper(hex, rough, o) - the material (polished: its roughness 0.75 of the given): o = { glow (the warm emissive that keeps the
  // shaded faces red-brown, not black; 0.5), metalness (0.75), env (envMapIntensity, 2.2), raw (true: the hex as given, no re-hue - for a
  // white carrier of a map) }. Chosen of six variants rendered beside the book (metalness .75-.92, envMapIntensity 1.9-2.6, saturation .84-.95).
  // MODEL CHOICES: the numbers (chosen by pictures beside the book's, by day and by night).
  function tm_copperHex(hex) {
    const c = new Color(hex), hsl = { h: 0, s: 0, l: 0 };
    c.getHSL(hsl);
    const L = Math.max(0.1, Math.min(0.6, hsl.l)), k = Math.max(0, Math.min(1, (hsl.l - 0.15) / 0.6)), sk = k * k * (3 - 2 * k);
    return c.setHSL(0.022 + 0.053 * sk, 0.95, L * 0.88).getHex();
  }
  function tm_copperCss(css) {
    const m = /^#?([0-9a-f]{6})$/i.exec(String(css || "").trim());
    if (!m) return css;
    return "#" + tm_copperHex(parseInt(m[1], 16)).toString(16).padStart(6, "0");
  }
  function tm_copper(hex, rough, o) {
    o = o || {};
    const col = o.raw ? hex : tm_copperHex(hex == null ? 0xb87a3e : hex), hsl = { h: 0, s: 0, l: 0 };
    new Color(col).getHSL(hsl);
    const m = new MeshStandardMaterial({
      color: col, roughness: 0.75 * (rough == null ? 0.32 : rough), metalness: o.metalness == null ? 0.75 : o.metalness, envMapIntensity: o.env == null ? 2.2 : o.env,
      emissive: new Color().setHSL(o.raw ? 0.04 : hsl.h, 0.85, 0.12), emissiveIntensity: o.glow == null ? 0.5 : o.glow
    });
    m.userData.copper = { hex: hex == null ? 0xb87a3e : hex, rough: m.roughness, raw: !!o.raw };   // (a mark: the house's coppers can be found in the scene)
    return m;
  }
  // ===== COPPER_C END
