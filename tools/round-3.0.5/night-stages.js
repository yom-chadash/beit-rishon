    // ---------------------------------------------------------------- NIGHT_WATCH_305: the night's watch and Gevini's call //
    // (the user, 19.11.2026 21:24: "5. להוסיף את איש הר הבית, כולל שומר ישן וכו', תוסיף אח"כ את גביני צועק (את הצעקה תדגים בתנועות גוף //
    // עם יד על הפה וכד', והמלל בכתובית)... את בן בבי שמכה אותם (תעשה אחד ער ואחד ישן - ובישן הכאה)"; 23:26: "2. כתפא"י", "3. ב"; 23:49: //
    // "שלום עליך - א"). Every figure walks the chel on its own floor (y 0: hintY gives the court's there), between the court's wall //
    // (z -74.25, x -96.75) and the soreg (z -80, x -100). The places of the posts, the lanterns and the ways - model choices. //
    const ON_CHEL = (pts) => pts.map((p) => [p[0], p[1], 0]); //
    const NWP = { gk: [-41.6, -75.9], gn: [-71.6, -75.8], gc: [-97.9, -76.0], gp: [-97.7, -6.0], cloak: [-70.4, -76.2] }; //   // (the cloak falls on his east side, before the stone - NIGHT_SIT_305) //
    const faceTo = (from, to) => Math.atan2(to[0] - from[0], to[1] - from[1]); //
    const upAt = (p, yaw) => [p[0] + 0.62 * Math.sin(yaw), p[1] + 0.62 * Math.cos(yaw)];   // NIGHT_SIT_305: where he stands up (SIT.step before the stone) //
    const NIGHT_FIGS = ["ihb", "bbv", "gk", "gn", "gc", "gp"]; //
    SC.ihb = (a) => { //
      const GM = TM.shalom === "gemara";   // the row "״שלום עליך״": the guard says it (the Gemara, Tamid 27b; the Rambam) - or the officer (the Mishnah) //
      a.set("lanterns", 1, 0); //
      a.set("lantA", 1, 0); //
      a.at("gc", NWP.gc[0], NWP.gc[1], -2.36, 0, { y: 0 });   // the north-west corner's guard, awake, at his post all night //
      // NIGHT_SIT_305: the guards on their stones - the gate of the offering's awake, the gate of the spark's and the one behind the //
      // house of the kaporet asleep, wrapped in their cloaks //
      a.at("gk", NWP.gk[0], NWP.gk[1], Math.PI, 0, { y: 0, pose: "sit" }); //
      a.at("gn", NWP.gn[0], NWP.gn[1], Math.PI, 0, { y: 0, pose: "doze" }); //
      a.cloak("gn", 0, 16.4); //
      a.at("gp", NWP.gp[0], NWP.gp[1], -HP, 0, { y: 0, pose: "doze" }); //
      a.cloak("gp", 0); //
      // ---- Ish Har HaBayit (Middot 1:2): along the north chel, westward //
      const p0 = [-36.5, -78.0], p1 = [-40.4, -78.0], p2 = [-69.8, -77.9], p3 = [-70.6, -77.3]; //
      a.hold("ihb", "stick", "R", 0); //
      a.at("ihb", p0[0], p0[1], -HP, 0, { y: 0 }); //
      a.walk("ihb", ON_CHEL([p0, p1]), 0.8, 2.6, { yaw: faceTo(p1, NWP.gk) }); //
      a.tag("ihb", "איש הר הבית", 0.6, 26); //
      // the guard of the gate of the offering is awake: he sees him by the lantern's light and rises (Tiferet Yisrael: "כדי שכשהשומר ער, //
      // יראה להשר ויקום לפניו") //
      a.face("gk", faceTo(NWP.gk, p1), 2.4); //
      a.pose("gk", "situp", 2.4, 3.3); //
      const gkU = upAt(NWP.gk, faceTo(NWP.gk, p1)); //
      a.at("gk", gkU[0], gkU[1], faceTo(NWP.gk, p1), 3.3, { y: 0 }); //
      if (GM) { a.pose("gk", "hail", 3.6, 5.6); a.tag("gk", "״איש הר הבית, שלום עליך״", 3.6, 6.2); } //
      a.walk("ihb", ON_CHEL([p1, [-55, -78.2], p2]), 6.4, 11.2, { yaw: faceTo(p2, NWP.gn) }); //
      a.face("gk", Math.PI, 7.5); //
      // the guard of the gate of the spark sleeps: he does not rise //
      if (!GM) { a.pose("ihb", "hail", 12.0, 13.8); a.tag("ihb", "״שלום עליך״", 12.0, 14.2); } //
      a.walk("ihb", ON_CHEL([p2, p3]), 14.4, 14.9, { yaw: faceTo(p3, NWP.gn) }); //
      a.pose("ihb", "strike", 14.9, 16.3); //
      a.fx("strike", 15.25); a.fx("strike", 15.95); //
      a.ramp("joltN", 1, 0, 15.25, 15.65); a.ramp("joltN", 1, 0, 15.95, 16.35); //
      // he wakes and leaps up - his cloak falls from him //
      a.face("gn", faceTo(NWP.gn, p3), 16.4); //
      a.pose("gn", "wake", 16.4, 17.4); //
      const gnU = upAt(NWP.gn, faceTo(NWP.gn, p3)); //
      a.at("gn", gnU[0], gnU[1], faceTo(NWP.gn, p3), 17.4, { y: 0 }); //
      a.put("cloakN", NWP.cloak[0], 0.02, NWP.cloak[1], 16.4, 0.5); //
      a.walk("gn", ON_CHEL([gnU, [-72.6, -76.6]]), 17.4, 18.2, { yaw: faceTo([-72.6, -76.6], NWP.cloak) }); //
      // "ורשות היה לו לשרוף את כסותו": the torch from the lantern, to the cloak, and back //
      const pl = [-73.0, -75.9]; //
      a.walk("ihb", ON_CHEL([p3, pl]), 16.6, 17.6, { yaw: faceTo(pl, [-73.6, -75.0]) }); //
      a.pose("ihb", "reachL", 17.6, 18.2); //
      a.set("ltorchOut", 1, 18.0); //
      a.hold("ihb", "ltorch", "L", 18.0); //
      const pc = [-70.4, -77.15];   // north of the cloak, his face to it //
      a.walk("ihb", ON_CHEL([pl, pc]), 18.3, 19.1, { yaw: 0 }); //
      a.pose("ihb", "lowerL", 19.2, 20.4); //
      a.ramp("cloakFire", 0, 1, 19.6, 20.6); //
      a.fx("ignite", 19.6); a.fx("torch", 20.3); //
      a.walk("ihb", ON_CHEL([pc, pl]), 20.6, 21.4, { yaw: faceTo(pl, [-73.6, -75.0]) }); //
      a.pose("ihb", "reachL", 21.4, 21.9); //
      a.gone("ltorch", 21.7); //
      a.set("ltorchOut", 0, 21.7); //
      a.ramp("cloakFire", 1, 0.35, 23, 26); //
      // ---- Ben Bavi (Shekalim 5:1 "בן בבי על הפקיע"; the Yachin there: "והיה הוא או אנשיו חוזרים על המשמורת בלילה"): by the west //
      a.set("lantA", 2, 26.0); //
      const b0 = [-91.0, -78.2], b1 = [-99.2, -78.4], b2 = [-99.1, -8.2], b3 = [-98.9, -6.9]; //
      a.hold("bbv", "pakia", "R", 26.0); //
      a.at("bbv", b0[0], b0[1], -HP, 26.0, { y: 0 }); //
      a.tag("bbv", "בן בבי — על הפקיע", 26.0, 46); //
      a.walk("bbv", ON_CHEL([b0, b1]), 26.4, 28.6, { yaw: faceTo(b1, NWP.gc) }); //
      a.face("gc", faceTo(NWP.gc, b1), 27.8); //
      a.walk("bbv", ON_CHEL([b1, [-99.2, -60], [-99.1, -20], b2]), 30.0, 36.6, { yaw: faceTo(b2, NWP.gp) }); //
      a.face("gc", -2.36, 31.0); //
      a.walk("bbv", ON_CHEL([b2, b3]), 37.6, 38.1, { yaw: faceTo(b3, NWP.gp) }); //
      a.pose("bbv", "strike", 38.1, 39.5); //
      a.fx("strike", 38.45); a.fx("strike", 39.15); //
      a.ramp("joltP", 1, 0, 38.45, 38.85); a.ramp("joltP", 1, 0, 39.15, 39.55); //
      a.face("gp", faceTo(NWP.gp, b3), 39.6); //
      a.pose("gp", "wake", 39.6, 40.6); //
      const gpU = upAt(NWP.gp, faceTo(NWP.gp, b3)); //
      a.at("gp", gpU[0], gpU[1], faceTo(NWP.gp, b3), 40.6, { y: 0 }); //
    }; //
    // Gevini the herald (the Bartenura on Tamid 3:8: "כהן ששמו גביני, שהיה מכריז בכל בוקר בבית המקדש"; the Yachin there: "מכריז בכל //
    // בוקר בהר הבית לפני שער בית המוקד הסגור" - on the landing, as in the officers' layer, GEVINI_211): up the flight, his hands about //
    // his mouth; first to the gate (the priests within), then to the chel (the Levites and Israel) - model choice. The officer stands //
    // at the gate from the stage before (Tamid 1:2 "פעמים שהוא בא מקריאת הגבר, או סמוך לו מלפניו או מלאחריו"). //
    SC.gevini = (a) => { //
      a.roofs(); //
      const gv = [-15.5, -78.9]; //
      a.walk("gev", [[3.0, -78.65], [-11.5, -78.65], [-12.6, -78.75], [gv[0], gv[1], 13.5]], 0.2, 3.0, { yaw: 0 }); //
      a.tag("gev", "גביני — הכרוז", 0.2, 14); //
      a.pose("gev", "call", 3.3, 13.4); //
      [[6.2, 0.8], [6.35, 1.6], [6.5, 2.4], [6.65, Math.PI]].forEach(([t, y]) => a.face("gev", y, t)); //
    }; //
