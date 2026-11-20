      // ---- NIGHT_WATCH_305 (the user, 19.11.2026 21:24 "5. להוסיף את איש הר הבית, כולל שומר ישן וכו'"; 23:26 "2. כתפא"י", "3. ב") - the //
      // night's watch on the chel (SC.ihb, SC.gevini): the guards' lanterns - "משמע שהאבוקות עומדות במקומן בפנסין סביב, שלא יתכבו ברוח" //
      // (Tiferet Yisrael, Middot 1:2) - two of them giving light where the stage is (N.lantA); the stones the guards sit on; the cloak //
      // that is burnt ("לשרוף את כסותו - ר"ל רק כסותו העליון שמסתמא התחתל בו, ובא עי"ז לשינה", there), the officer's staff ("חובטו במקלו - בפקיע שבהמקל", there), Ben Bavi's pakia (Yoma 23a "מאי פקיע - //
      // נגדא", Rashi "מפסקת בראשה לרצועות דקות") and the lantern's torch. Their places, forms and colours - model choices. //
      const NW = (() => { //
        const grp = new Group(); //
        grp.name = "night-watch"; //
        group.add(grp); //
        const mCloak = std(0x6e5c46, { roughness: 1 }), mStone = std(0x8f8a80, { roughness: 0.95 }), mStrap = std(0x5a3a22, { roughness: 0.8 }); //
        const mFlame = new MeshBasicMaterial({ color: 0xffb04a }); //
        const mGlass = new MeshStandardMaterial({ color: 0xfff1c8, roughness: 0.2, transparent: true, opacity: 0.22, emissive: 0xffb04a, emissiveIntensity: 0.35, depthWrite: false }); //
        // the lanterns: [x, z, the floor] - 0 at the gate of the offering, 1 at the gate of the spark, 2 at the court's north-west corner, //
        // 3 behind the house of the kaporet (Middot 1:1 "ואחד אחורי בית הכפורת"), 4-7 on the way, 8 at the foot of Beit HaMoked's //
        // flight, 9 on its landing //
        const LANT = [[-43.6, -75.0, 0], [-73.6, -75.0, 0], [-97.3, -74.9, 0], [-97.2, -3.6, 0], [-58.5, -75.0, 0], [-87.0, -75.0, 0], [-97.1, -42.0, 0], //
          [-36.4, -75.0, 0], [6.5, -77.8, 0], [-22.5, -79.2, 13.5]]; //
        const LG = new Group(); //
        LG.visible = false; //
        grp.add(LG); //
        const lanterns = LANT.map(([x, z, fy]) => { //
          const g = new Group(); //
          g.position.set(x, fy, z); //
          g.add(mesh(new CylinderGeometry(0.06, 0.085, 2.5, 8), MAT.wood, 0, 1.25, 0)); //
          for (const [dx, dz] of [[-0.2, -0.2], [0.2, -0.2], [0.2, 0.2], [-0.2, 0.2]]) g.add(mesh(new CylinderGeometry(0.018, 0.018, 0.62, 5), MAT.bronze, dx, 2.81, dz)); //
          g.add(mesh(new BoxGeometry(0.5, 0.05, 0.5), MAT.bronze, 0, 2.5, 0)); //
          g.add(mesh(new ConeGeometry(0.34, 0.2, 4).rotateY(Math.PI / 4), MAT.bronze, 0, 3.2, 0)); //
          const gl = new Mesh(new BoxGeometry(0.4, 0.58, 0.4), mGlass); //
          gl.position.y = 2.81; //
          gl.renderOrder = 2; //
          g.add(gl); //
          const fl = new Mesh(new ConeGeometry(0.075, 0.26, 8), mFlame); //
          fl.position.y = 2.7; //
          g.add(fl); //
          LG.add(g); //
          return { g, fl }; //
        }); //
        const LPAIR = { 1: [0, 1], 2: [2, 3], 3: [8, 9] }; //
        const lights = [0, 1].map(() => { const l = new PointLight(0xffa64a, 0, 24, 1.6); grp.add(l); return l; }); //
        // NIGHT_SIT_305: the stones the guards sit on (the Tamid figures themselves sit - applyFig "sit", "doze"): at the gate of the //
        // offering, at the gate of the spark, behind the house of the kaporet - each in its guard's frame (his face +z), the seat 0.63 high //
        const stones = new Group(); //
        stones.visible = false; //
        grp.add(stones); //
        for (const [x, z, yaw] of [[-41.6, -75.9, Math.PI], [-71.6, -75.8, Math.PI], [-97.7, -6.0, -HP]]) { //
          const st = new Group(); //
          st.position.set(x, 0, z); //
          st.rotation.y = yaw; //
          const b = new Mesh(new BoxGeometry(0.74, 0.63, 0.52), mStone); //
          b.position.set(0, 0.315, -0.06); //
          b.castShadow = true; //
          b.receiveShadow = true; //
          st.add(b); //
          stones.add(st); //
        } //
        // the cloak on the ground, and its fire //
        const cloakG = new Group(); //
        { //
          // a cloth fallen in a heap: a few low folds over one another (NIGHT_SIT_305: until the second draft one flat disc) //
          for (const [sx, sy, sz, x, y, z, ry] of [[0.6, 0.09, 0.46, 0, 0.05, 0, 0.2], [0.38, 0.13, 0.27, 0.22, 0.1, -0.12, 0.7], [0.3, 0.11, 0.22, -0.26, 0.09, 0.14, -0.5], //
            [0.24, 0.1, 0.34, 0.05, 0.13, 0.18, 1.2]]) { //
            const c = new Mesh(new SphereGeometry(1, 16, 8).scale(sx, sy, sz), mCloak); //
            c.position.set(x, y, z); //
            c.rotation.y = ry; //
            c.castShadow = true; //
            cloakG.add(c); //
          } //
        } //
        // its fire: tongues of flame over it, orange about and yellow in the middle, and their light on the chel //
        const mFlameO = new MeshBasicMaterial({ color: 0xff7424, transparent: true, opacity: 0.88, depthWrite: false }); //
        const cloakFl = []; //
        for (let i = 0; i < 11; i++) { //
          const inner = i >= 7, an = i * 2.4, rr = inner ? 0.1 + 0.05 * (i % 2) : 0.24 + 0.08 * (i % 3) / 2; //
          const h = inner ? 0.62 + 0.12 * (i % 2) : 0.36 + 0.1 * ((i * 7) % 3) / 2; //
          const fl = new Mesh(new ConeGeometry(inner ? 0.075 : 0.1, h, 7).translate(0, h / 2, 0), inner ? mFlame : mFlameO); //
          fl.position.set(Math.cos(an) * rr * 1.2, 0.1, Math.sin(an) * rr); //
          fl.visible = false; //
          cloakG.add(fl); //
          cloakFl.push(fl); //
        } //
        const cloakL = new PointLight(0xff8a3a, 0, 10, 1.8); //
        cloakL.position.set(0, 0.6, 0); //
        cloakG.add(cloakL); //
        const cloakCol = new Color(0x6e5c46), charCol = new Color(0x241a12); //
        prop("cloakN", cloakG, null, false); //
        // the staff (held at a third of it), the strap at its head //
        const stickG = new Group(); //
        stickG.add(mesh(new CylinderGeometry(0.035, 0.045, 2.4, 7), MAT.wood, 0, 0.55, 0)); //
        stickG.add(mesh(new BoxGeometry(0.03, 0.42, 0.012), mStrap, 0.035, 1.54, 0)); //
        prop("stick", stickG, { p: [0, -0.1, 0.1], r: [-0.25, 0, 0] }, false); //
        // the pakia: a handle and a strap, split at its end into thin straps //
        const pakG = new Group(); //
        pakG.add(mesh(new CylinderGeometry(0.03, 0.035, 0.45, 7), MAT.wood, 0, 0.12, 0)); //
        pakG.add(mesh(new BoxGeometry(0.045, 0.5, 0.012), mStrap, 0, 0.6, 0)); //
        for (const dx of [-0.045, -0.015, 0.015, 0.045]) pakG.add(mesh(new BoxGeometry(0.009, 0.28, 0.006), mStrap, dx, 0.98, 0)); //
        prop("pakia", pakG, { p: [0, -0.06, 0.08], r: [-0.4, 0, 0] }, false); //
        // the torch of the lantern at the gate of the spark (lantern 1 shows no flame while it is out) //
        const ltG = new Group(); //
        ltG.add(mesh(new CylinderGeometry(0.03, 0.025, 0.7, 6), MAT.wood, 0, 0.2, 0)); //
        { const f = new Mesh(new ConeGeometry(0.075, 0.26, 8), mFlame); f.position.y = 0.66; ltG.add(f); } //
        prop("ltorch", ltG, { p: [0, -0.08, 0.08], r: [-0.3, 0, 0] }, false); //
        // none of these is a floor or a wall: the figures' floor ray (floorAt) and the camera pass through them //
        for (const o of [grp, cloakG, stickG, pakG, ltG]) o.traverse((m) => { m.userData.noPick = true; }); //
        return { //
          grp, lanterns, //
          apply(N) { //
            LG.visible = N.lanterns > 0.5; //
            const pair = LG.visible ? LPAIR[N.lantA | 0] : null; //
            lights.forEach((l, i) => { if (pair) { const p = lanterns[pair[i]].g.position; l.position.set(p.x, p.y + 2.85, p.z); l.intensity = 16; } else l.intensity = 0; }); //
            lanterns[1].fl.visible = !(N.ltorchOut > 0.5); //
            const tt = performance.now() * 0.001; //
            lanterns.forEach((L, i) => { L.fl.scale.set(1, 1 + 0.16 * Math.sin(tt * 9 + i * 1.3), 1); }); //
            stones.visible = LG.visible; //
            const cf = N.cloakFire; //
            cloakFl.forEach((m, i) => { m.visible = cf > 0.02; const w = 0.8 + 0.3 * Math.sin(tt * 11 + i * 1.7); m.scale.set(Math.max(0.01, cf * (0.9 + 0.1 * w)), Math.max(0.01, cf * w), Math.max(0.01, cf * (0.9 + 0.1 * w))); }); //
            cloakL.intensity = cf > 0.02 ? cf * (5 + 1.2 * Math.sin(tt * 13)) : 0; //
            mCloak.color.copy(cloakCol).lerp(charCol, clamp(cf * 1.4, 0, 1) * 0.7);   // the cloth blackens as it burns //
          } //
        }; //
      })(); //
