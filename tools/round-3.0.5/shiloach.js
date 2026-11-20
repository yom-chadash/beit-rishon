    // ---------- SHILOACH_305 (the user, 20.11.2026 01:21: "אתה יכול להוסיף את מעיין השילוח [איך היו מגיעים לשם"; 01:25: "1. א 2. זו ---------- //
    // 3. כהן"): THE SHILOACH AND THE WATER'S LIBATION. "נסוך המים כיצד. צלוחית של זהב מחזקת שלשת לגים היה ממלא מן השלוח. הגיעו לשער //
    // המים, תקעו והריעו ותקעו. עלה בכבש ופנה לשמאלו, שני ספלים של כסף היו שם" (Mishnah Sukkah 4:9, book 56, line 48); "ולמה נקרא שמו //
    // שער המים. שבו מכניסין צלוחית של מים של נסוך בחג" (Middot 2:6); "שני שערי חלדה מן הדרום, משמשין כניסה ויציאה" (Middot 1:3); "שילוח //
    // היה מוציא מים כאיסר" (the Yerushalmi, Sukkah 5:6). No source gives the way out of the mount or how far the spring was: the pool is //
    // drawn at the bottom of the model's valley south of the mount (some 220 amot from its wall), the path to it from the western gate of //
    // Chulda, its form and the pool's - model choices. Always: the pool, its stream and the path. In the demonstration: a priest with the //
    // golden flask goes out by the Water Gate and the gate of Chulda, fills it at the Shiloach and comes back; two priests blow at the //
    // Water Gate; he goes up the ramp, turns left and pours into the western bowl (40-altar.js: the bowls at x 43.05 / 43.95, z 9.4 of the //
    // altar's frame - "מערבי של מים ומזרחי של יין"). Its walk is the walk engine's (ctx2.shared.walk); the walks are hurried. //
    // SH.shiloach = { demo, stop, at(t), info, refs, POOL }. //
    { //
      const SHL = { POOL: [32, 550], PW: 26, PD: 12, D: null, run: false, SP: { x: 25.5, z: 541.4, zT: 540.92 } }; //
      const K = SH.priestKit; //
      const fnc = (f) => typeof f === "function"; //
      const smooth = (u) => u * u * (3 - 2 * u), lerp = (a, b, u) => a + (b - a) * u; //
      const altDz = () => { const AP = SH.altarPlace; return AP && AP.dz && typeof AP.dz[AP.current] === "number" ? AP.dz[AP.current] : 12.5; }; //
      const groundY = (x, z, from) => { const y = fnc(SH.floorY) ? SH.floorY(x, from == null ? 40 : from, z) : -Infinity; return isFinite(y) ? y : -28; }; //
      // ---- always: the pool, its stream and the path (built when the terrain is there: on the first frame) //
      const SG = new Group(); //
      SG.name = "shiloach"; //
      ctx2.root.add(SG); //
      let built = false, Y0 = -55; //
      const mStone = new MeshStandardMaterial({ color: 0xbfae8c, roughness: 0.95 }), mStone2 = new MeshStandardMaterial({ color: 0xa8987a, roughness: 0.95 }); //
      const mWater = new MeshStandardMaterial({ color: 0x3e7fb8, roughness: 0.12, metalness: 0.1, transparent: true, opacity: 0.86 }); //
      const mStream = new MeshStandardMaterial({ color: 0x8fc3ec, roughness: 0.1, transparent: true, opacity: 0.85 }); //
      const mPath = new MeshStandardMaterial({ color: 0xcbbd9a, roughness: 1, polygonOffset: true, polygonOffsetFactor: -2, polygonOffsetUnits: -2 }); //
      const PATH = [[0, 366], [2, 392], [7, 425], [14, 460], [21, 495], [26, 522], [29, 538]];   // from the foot of the western Chulda stairs //
      const streamTo = (yb) => { const SP = SHL.SP; if (!SP.st) return; const h = Math.max(0.05, SP.y - yb); SP.st.position.set(SP.x, yb + h / 2, SP.zT); SP.st.scale.y = h; }; //
      const buildPool = () => { //
        if (built) return; //
        built = true; //
        try { const D0 = buildDemo(); SHL.offF = measure(D0, ARM.fill, FILL_LEAN, 0); SHL.offP = measure(D0, ARM.pour, POUR_LEAN, TILT); } catch (e) { console.warn("[shiloach]", e && e.message); } //
        const [px, pz] = SHL.POOL, W2 = SHL.PW / 2, D2 = SHL.PD / 2; //
        let lo = Infinity; //
        for (const dx of [-W2, 0, W2]) for (const dz of [-D2, 0, D2]) lo = Math.min(lo, groundY(px + dx, pz + dz, 20)); //
        Y0 = isFinite(lo) ? lo : -55; //
        const RIM = Y0 + 1.3, WL = Y0 + 0.95; //
        const box = (w, h, d, m, x, y, z) => { const b = new Mesh(new BoxGeometry(w, h, d), m); b.position.set(x, y + h / 2, z); b.castShadow = b.receiveShadow = true; SG.add(b); return b; }; //
        // the basin's four walls (1 thick), from 1.5 under the ground's lowest point to the rim, and its floor //
        box(SHL.PW + 2, RIM - Y0 + 1.5, 1, mStone, px, Y0 - 1.5, pz - D2 - 0.5); //
        box(SHL.PW + 2, RIM - Y0 + 1.5, 1, mStone, px, Y0 - 1.5, pz + D2 + 0.5); //
        box(1, RIM - Y0 + 1.5, SHL.PD, mStone, px - W2 - 0.5, Y0 - 1.5, pz); //
        box(1, RIM - Y0 + 1.5, SHL.PD, mStone, px + W2 + 0.5, Y0 - 1.5, pz); //
        box(SHL.PW, 0.2, SHL.PD, mStone2, px, Y0 - 1.6, pz); //
        const water = new Mesh(new PlaneGeometry(SHL.PW, SHL.PD).rotateX(-Math.PI / 2), mWater); //
        water.position.set(px, WL, pz); //
        water.renderOrder = 2; //
        SG.add(water); //
        // the spring's mouth (the user, 01:56, over the picture of the pouring: "הוא לא מוזג לתוך הספל למה" - and a flask held over a pool //
        // that it could not reach would be the same fault): a block of stone on the pool's north side, at the path's end, with a spout //
        // toward the path; its thin stream ("כאיסר") falls into a small basin at its foot (the water goes on to the pool under the block). //
        // The spout's height: over the mouth of the flask held out under it - measured on the priest's own figure (SHL.offF). Its form - a //
        // model choice //
        const SP = SHL.SP, gy = groundY(SP.x, SP.z - 0.9, 20), offF = SHL.offF || { y: 1.2 }; //
        SP.gy = gy; //
        SP.y = gy + Math.max(1.15, offF.y + 0.34);   // the spout's tip //
        box(2.6, SP.y - gy + 1.15, 1.6, mStone, SP.x, gy - 0.4, SP.z + 0.8); //
        const spout = new Mesh(new CylinderGeometry(0.075, 0.095, 0.48, 12), mStone); //
        spout.rotation.x = Math.PI / 2; //
        spout.position.set(SP.x, SP.y + 0.03, SP.z - 0.24); //
        spout.castShadow = true; //
        SG.add(spout); //
        box(1.4, 0.85, 1.0, mStone2, SP.x, gy - 0.45, SP.z - 0.52);   // the basin //
        const bw = new Mesh(new PlaneGeometry(1.15, 0.78).rotateX(-Math.PI / 2), mWater); //
        bw.position.set(SP.x, gy + 0.36, SP.z - 0.52); //
        SG.add(bw); //
        SP.base = gy + 0.36; //
        SP.st = new Mesh(new CylinderGeometry(0.026, 0.032, 1, 8, 1, true), mStream); //
        SG.add(SP.st); //
        streamTo(SP.base); //
        // the path: a strip on the ground from the stairs' foot to the steps (sampled every 2 amot, 3.2 wide) //
        const pts = [], pos = [], idx = []; //
        for (let i = 0; i < PATH.length - 1; i++) { const a = PATH[i], b = PATH[i + 1], n = Math.ceil(Math.hypot(b[0] - a[0], b[1] - a[1]) / 2); for (let k = 0; k < n; k++) pts.push([lerp(a[0], b[0], k / n), lerp(a[1], b[1], k / n)]); } //
        pts.push(PATH[PATH.length - 1]); //
        pts.forEach((p, i) => { //
          const q = pts[Math.min(pts.length - 1, i + 1)], r0 = pts[Math.max(0, i - 1)], dx = q[0] - r0[0], dz = q[1] - r0[1], L = Math.hypot(dx, dz) || 1, nx = -dz / L * 1.6, nz = dx / L * 1.6; //
          for (const s of [-1, 1]) { const x = p[0] + s * nx, z = p[1] + s * nz; pos.push(x, groundY(x, z, 20) + 0.06, z); } //
          if (i > 0) { const k = 2 * i; idx.push(k - 2, k - 1, k, k - 1, k + 1, k); } //
        }); //
        const pg = new BufferGeometry(); //
        pg.setAttribute("position", new Float32BufferAttribute(pos, 3)); //
        pg.setIndex(idx); //
        pg.computeVertexNormals(); //
        const pm = new Mesh(pg, mPath); //
        pm.receiveShadow = true; //
        SG.add(pm); //
        SG.traverse((o) => { if (o.isMesh) o.userData.noPick = true; }); //
      }; //
      if (Array.isArray(ctx2.animated)) ctx2.animated.push(() => { if (!built && fnc(SH.floorY)) { try { buildPool(); } catch (e) { console.warn("[shiloach]", e && e.message); built = true; } } }); //
      (ctx2.labels = ctx2.labels || []).push({ text: "מעיין השילוח", x: SHL.POOL[0], y: -45, z: SHL.POOL[1], size: 4 }); //
      // ---- the demonstration's people: the priest of the water and two with trumpets (the kit's priest; his arms and feet move) //
      const FIG = (() => { //
        if (!K) return null; //
        const FS = K.FS, sc = (q, s) => q.scale(s, s, s), W1 = (q) => K.white(q); //
        const P = { sx: K.SH_X * FS, sy: K.SH_Y * FS, up: K.UP * FS, fo: K.FORE * FS }; //
        const upP = sc(mergeGeometries([W1(K.sph(0.07, 0.07, 0.07, 14, 10)), W1(K.at(new CylinderGeometry(0.07, 0.058, P.up / FS, 14), 0, -P.up / FS / 2, 0)), //
          W1(K.at(K.sph(0.058, 0.058, 0.058, 12, 8), 0, -P.up / FS, 0))]), FS); //
        const foP = sc(W1(K.at(new CylinderGeometry(0.056, 0.046, P.fo / FS, 14), 0, -P.fo / FS / 2, 0)), FS); //
        const hand = { 1: sc(K.at(K.handRaw(1), 0, -(P.fo / FS + 0.045), 0), FS), "-1": sc(K.at(K.handRaw(-1), 0, -(P.fo / FS + 0.045), 0), FS) }; //
        const foot = { 1: sc(K.footGeo(1).translate(-0.1, 0, 0), FS), "-1": sc(K.footGeo(-1).translate(0.1, 0, 0), FS) }; //
        const neck = sc(K.at(new CylinderGeometry(0.066, 0.072, 0.09, 12), 0, 1.925, 0), 1); //
        return { P, upP, foP, hand, foot, neck }; //
      })(); //
      const mkPriest = (n) => { //
        const FS = K.FS, g = new Group(), lean = new Group(), S = new Group(); //
        g.add(lean); //
        S.scale.setScalar(FS); //
        lean.add(S); //
        const add = (par, geo, mat) => { const m = new Mesh(geo, mat); m.castShadow = true; m.userData.noPick = true; par.add(m); return m; }; //
        add(S, K.gRobeBody, K.mRobe); //
        add(S, FIG.neck, K.mSkin); //
        const sash = add(S, K.gSash, (SH.tamid && SH.tamid.belt === "white") ? K.mSashWhite : K.mSashDyed); //
        const hg = K.headOn(S, K.HEAD_Y, K.mBeards[n % K.mBeards.length], n); //
        hg.traverse((m) => { if (m.isMesh) m.userData.noPick = true; }); //
        add(S, K.gHat, K.mHat).position.y = K.HAT_Y; //
        const arm = (side) => { //
          const sh = new Group(); //
          sh.position.set(side * FIG.P.sx, FIG.P.sy, 0); //
          lean.add(sh); //
          add(sh, FIG.upP, K.mRobe); //
          const el = new Group(); //
          el.position.y = -FIG.P.up; //
          sh.add(el); //
          add(el, FIG.foP, K.mRobe); //
          add(el, FIG.hand[side], K.mSkin); //
          const grip = new Group(); //
          grip.position.set(0, -(FIG.P.fo + 0.08), 0.03); //
          el.add(grip); //
          return { sh, el, grip }; //
        }; //
        const L = arm(1), R = arm(-1); //
        const fl = add(g, FIG.foot[1], K.mSkin), fr = add(g, FIG.foot[-1], K.mSkin); //
        fl.position.x = 0.1 * FS; //
        fr.position.x = -0.1 * FS; //
        g.visible = false; //
        return { g, lean, L, R, fl, fr, sash }; //
      }; //
      const setArm = (A2, v, side) => { A2.sh.rotation.set(v[0], 0, side * v[1]); A2.el.rotation.set(v[2], 0, 0); }; //
      const ARM = { rest: [0.05, 0.08, -0.15], carry: [-0.25, 0.1, -0.85], fill: [-1.05, 0.12, -0.35], pour: [-1.2, 0.1, -0.55], tR: [-1.42, 0.05, -0.2], tL: [-1.28, -0.06, -0.38] }; //
      const buildDemo = () => { //
        if (SHL.D) return SHL.D; //
        const DG = new Group(); //
        DG.name = "shiloachDemo"; //
        DG.visible = false; //
        ctx2.root.add(DG); //
        const p = mkPriest(2), t1 = mkPriest(4), t2 = mkPriest(6); //
        for (const f of [p, t1, t2]) DG.add(f.g); //
        // the golden flask (its form - a model choice), in his right hand //
        const gold = new MeshStandardMaterial({ color: 0xd8ad45, metalness: 0.9, roughness: 0.28 }); //
        const flask = new Mesh(new LatheGeometry([[0.001, 0], [0.07, 0], [0.105, 0.05], [0.11, 0.12], [0.07, 0.21], [0.032, 0.25], [0.04, 0.3], [0.001, 0.3]].map(([r, y]) => new Vector2(r, y)), 18), gold); //
        flask.castShadow = true; //
        flask.userData.noPick = true; //
        flask.position.set(0, -0.2, 0.02); //
        p.R.grip.add(flask); //
        const fwater = new Mesh(new CylinderGeometry(0.035, 0.05, 1, 8, 1, true), new MeshStandardMaterial({ color: 0x7fc0f0, transparent: true, opacity: 0.8, roughness: 0.1 })); //
        fwater.visible = false; //
        DG.add(fwater); //
        // the silver trumpets (Numbers 10:2), one for each of the two, from his mouth forward and up //
        const silver = new MeshStandardMaterial({ color: 0xe6e6ea, metalness: 0.85, roughness: 0.25, side: DoubleSide }); //
        for (const f of [t1, t2]) { //
          const tr = new Group(); //
          const tube = new Mesh(new CylinderGeometry(0.022, 0.026, 1.25, 10), silver); //
          tube.position.y = 0.625; //
          const bell = new Mesh(new CylinderGeometry(0.16, 0.03, 0.26, 16, 1, true), silver); //
          bell.position.y = 1.36; //
          tr.add(tube, bell); //
          tr.position.set(0, K.HEAD_Y * K.FS - 0.17, 0.14); //
          tr.rotation.x = 1.25; //
          tr.traverse((m) => { if (m.isMesh) { m.castShadow = true; m.userData.noPick = true; } }); //
          f.lean.add(tr); //
        } //
        SHL.D = { DG, p, t1, t2, flask, fwater, ys: new Map() }; //
        return SHL.D; //
      }; //
      // ---- the ways (each [x, z] in the world; the floor under them read once, from a height near it) //
      const AW = (x, lz) => [x, lz + altDz()];   // in the altar's frame (the opinions table moves it) //
      const yAt = (D2, x, z, near) => { const k = Math.round(x * 4) + "," + Math.round(z * 4) + "," + Math.round(near); let y = D2.ys.get(k); if (y === undefined) { y = groundY(x, z, near + 2.6); D2.ys.set(k, y); } return y; }; //
      const plen = (pts) => { let L = 0; for (let i = 1; i < pts.length; i++) L += Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]); return L; }; //
      const along = (pts, u) => {   // the point at fraction u of the way, and the way's heading there //
        const L = plen(pts) * clamp(u, 0, 1); //
        let acc = 0; //
        for (let i = 1; i < pts.length; i++) { //
          const a = pts[i - 1], b = pts[i], l = Math.hypot(b[0] - a[0], b[1] - a[1]); //
          if (acc + l >= L || i === pts.length - 1) { const f = l > 0 ? clamp((L - acc) / l, 0, 1) : 0; return [lerp(a[0], b[0], f), lerp(a[1], b[1], f), Math.atan2(b[0] - a[0], b[1] - a[1])]; } //
          acc += l; //
        } //
        return [pts[0][0], pts[0][1], 0]; //
      }; //
      // the beats (demo seconds; the walk engine runs them at ctx2.shared.demoSlow) //
      const T = { out1: 4.6, gate1: 8.6, stairs1: 11.8, path1: 17.6, rim1: 18.8, fill0: 19.6, fill1: 22.6, back0: 23.6, //
        back1: 30.2, wg0: 32.4, wg1: 35.8, blow0: 36.0, blow1: 40.2, in1: 44.2, ramp1: 48.6, top1: 51.4, pour0: 52.0, pour1: 55.6, end: 58.2 }; //
      // the flask: upright in the world, its neck in his hand; tilted forward to pour. Its mouth - where the streams begin and end //
      const FILL_LEAN = 0.1, POUR_LEAN = 0.08, TILT = 1.62; //
      const QG = new Quaternion(), QT = new Quaternion(), AX = new Vector3(), NECK = new Vector3(0, -0.21, 0), MOUTH = new Vector3(0, 0.3, 0), V1 = new Vector3(); //
      const setFlask = (D2, tilt, yaw) => { //
        const f = D2.flask; //
        D2.p.g.updateMatrixWorld(true); //
        D2.p.R.grip.getWorldQuaternion(QG).invert(); //
        QT.setFromAxisAngle(AX.set(Math.cos(yaw), 0, -Math.sin(yaw)), tilt); //
        f.quaternion.copy(QG).multiply(QT); //
        f.position.copy(NECK).applyQuaternion(QT).applyQuaternion(QG); //
        f.updateMatrixWorld(true); //
      }; //
      const mouthW = (D2, out) => D2.flask.localToWorld(out.copy(MOUTH)); //
      const measure = (D2, arm, lean, tilt) => {   // the flask's mouth from his feet, his face to +z //
        const p = D2.p; //
        p.g.position.set(0, 0, 0); //
        p.g.rotation.y = 0; //
        p.lean.position.set(0, 0, 0); //
        p.lean.rotation.x = lean; //
        setArm(p.R, arm, -1); //
        setFlask(D2, tilt, 0); //
        const m = mouthW(D2, new Vector3()), o = p.g.getWorldPosition(new Vector3()); //
        return { x: m.x - o.x, y: m.y - o.y, z: m.z - o.z }; //
      }; //
      // the ways (each [x, z] in the world; the floor under them read once, from a height near it). The Water Gate's landing (y 13.5, //
      // x -24..-12) has its stair down to the east (to y 0 at x 2) and the soreg its opening before the gate (x -19..-17, z 80) //
      const BOWL = () => AW(43.05, 9.4);   // the western bowl, of the water //
      const bowlY = () => { const B = BOWL(), k = Math.round(B[1] * 10); if (SHL.byK !== k) { SHL.byK = k; SHL.by = groundY(B[0], B[1], 40); } return SHL.by; }; //
      const standF = () => { const SP = SHL.SP, o = SHL.offF || { x: 0, z: 0.9 }; return [SP.x - o.x, SP.zT - o.z]; };   // the flask's mouth under the spout //
      const standP = () => { const B = BOWL(), o = SHL.offP || { x: 0, z: 0.9 }; return [B[0] - o.x, B[1] - o.z]; };   // the flask's mouth over the bowl //
      const WAYS = () => { //
        const G_IN = [-18, 60.5], G_OUT = [-18, 72.6], TOPS = [-12, 72.6], FOOT = [2.6, 72.6]; //
        return [ //
          { pts: [G_IN, [-18, 66.5], G_OUT, TOPS, FOOT], t: [0.6, T.out1], near: 16 }, //
          { pts: [FOOT, [3.4, 77.6], [-18, 78], [-18, 84], [-12, 150], [0, 305], [0, 335.5]], t: [T.out1, T.gate1], near: 1, hide: true },   // (not seen: the soreg's opening, the mount, the gate of Chulda) //
          { pts: [[0, 335.5], [0, 364.5]], t: [T.gate1, T.stairs1], stairs: [0.2, -28] }, //
          { pts: PATH.slice(), t: [T.stairs1, T.path1], terrain: true }, //
          { pts: [PATH[PATH.length - 1], standF()], t: [T.path1, T.rim1], terrain: true, endYaw: 0 },   // his face to the spout //
          { pts: [standF()].concat(PATH.slice().reverse()), t: [T.back0, T.back0 + 4.6], terrain: true }, //
          { pts: [[0, 364.5], [0, 335.5]], t: [T.back0 + 4.6, T.back1], stairs: [-28, 0.2] }, //
          { pts: [[0, 335.5], [0, 305], [-12, 150], [-18, 84], [-18, 78], [3.6, 77.4]], t: [T.back1 + 0.1, T.wg0], near: 1, hide: true }, //
          { pts: [[3.6, 77.4], FOOT, TOPS, [-16.6, 72.6], G_OUT], t: [T.wg0, T.wg1], near: 16, endYaw: Math.PI },   // up to the gate, his face to it //
          // in the court: north of the chambers along its south wall (from z 54) and of the laver (x 22, z 57), to the ramp's foot (z 54) //
          { pts: [G_OUT, [-18, 64], [-18, 59], [-8, 54.5], [30, 53.2], [46, 53.2], AW(57.4, 41.2)], t: [T.blow1, T.in1], near: 16 }, //
          { pts: [AW(57.4, 41.2), AW(57.4, 18.5)], t: [T.in1, T.ramp1], ramp: true }, //
          { pts: [AW(57.4, 18.5), AW(57.0, 12.6), AW(50.8, 9.8), AW(46.6, 8.4), standP()], t: [T.ramp1, T.top1], near: 25, endYaw: 0 }   // "ופנה לשמאלו"; his face to the bowls //
        ]; //
      }; //
      const placeOn = (D2, f, w, t, carry) => {   // the figure on way w at second t: its place, heading, height and the step //
        const u = (t - w.t[0]) / Math.max(1e-3, w.t[1] - w.t[0]), q = along(w.pts, u); //
        let y; //
        if (w.stairs) y = lerp(w.stairs[0], w.stairs[1], clamp(u, 0, 1)); //
        else if (w.terrain) y = yAt(D2, q[0], q[1], 20); //
        else if (w.ramp) y = yAt(D2, q[0], q[1], 30); //
        else y = yAt(D2, q[0], q[1], w.near); //
        f.g.position.set(q[0], y, q[1]); //
        f.g.rotation.y = u >= 1 && w.endYaw != null ? w.endYaw : q[2]; //
        const walking = u > 0 && u < 1, ph = t * 9; //
        f.fl.position.z = walking ? 0.17 * Math.sin(ph) : 0; //
        f.fr.position.z = walking ? -0.17 * Math.sin(ph) : 0; //
        f.lean.position.y = walking ? Math.abs(Math.cos(ph)) * 0.035 : 0; //
        setArm(f.L, walking ? [0.3 * Math.sin(ph), 0.08, -0.25] : ARM.rest, 1); //
        setArm(f.R, carry ? ARM.carry : walking ? [-0.3 * Math.sin(ph), 0.08, -0.25] : ARM.rest, -1); //
        return u; //
      }; //
      const apply = (t) => { //
        const D2 = buildDemo(), WS = WAYS(), p = D2.p; //
        // the priest: which way he is on at this second (between them he stands where the last left him; on a hidden one he is not seen) //
        let cur = null; //
        for (const w of WS) if (t >= w.t[0] - 0.01) cur = w; //
        p.g.visible = !!cur && !cur.hide && t < T.end; //
        if (cur) placeOn(D2, p, cur, Math.min(t, cur.t[1]), true); //
        const yaw = p.g.rotation.y; //
        p.lean.rotation.x = 0; //
        // filling under the spring's stream (the flask upright, its mouth under the spout) //
        let fillK = 0, pourK = 0; //
        if (t >= T.fill0 && t < T.back0) { //
          fillK = smooth(clamp((t - T.fill0) / 0.6, 0, 1)) * (1 - smooth(clamp((t - T.fill1) / 0.6, 0, 1))); //
          setArm(p.R, ARM.carry.map((v, i) => lerp(v, ARM.fill[i], fillK)), -1); //
          p.lean.rotation.x = FILL_LEAN * fillK; //
        } //
        // pouring into the western bowl, his hand raised ("ולמנסך אומרים לו, הגבה ידך") //
        if (t >= T.pour0 && t < T.end) { //
          pourK = smooth(clamp((t - T.pour0) / 0.6, 0, 1)) * (1 - smooth(clamp((t - T.pour1) / 0.6, 0, 1))); //
          setArm(p.R, ARM.carry.map((v, i) => lerp(v, ARM.pour[i], pourK)), -1); //
          p.lean.rotation.x = POUR_LEAN * pourK; //
        } //
        setFlask(D2, TILT * pourK, yaw); //
        // the streams: the spring's ends in the flask while he holds it there; the flask's falls into the bowl //
        const m = mouthW(D2, V1); //
        streamTo(fillK > 0.9 && p.g.visible ? m.y + 0.02 : (SHL.SP.base || 0)); //
        D2.fwater.visible = false; //
        if (pourK > 0.92 && p.g.visible) { //
          const by = bowlY(), h = Math.max(0.05, m.y - by); //
          D2.fwater.visible = true; //
          D2.fwater.position.set(m.x, by + h / 2, m.z); //
          D2.fwater.scale.y = h; //
        } //
        // the two with trumpets at the Water Gate: on its landing, either side of the way in //
        const tOn = t >= T.wg0 && t < T.in1 + 1; //
        for (const [f, x] of [[D2.t1, -21.4], [D2.t2, -14.4]]) { //
          f.g.visible = tOn; //
          if (!tOn) continue; //
          f.g.position.set(x, yAt(D2, x, 74.0, 13.5), 74.0); //
          f.g.rotation.y = x < -18 ? 0.35 : -0.35;   // their faces out, to the chel, a little toward the way in //
          const up = smooth(clamp((t - T.blow0 + 0.6) / 0.5, 0, 1)) * (1 - smooth(clamp((t - T.blow1) / 0.5, 0, 1))); //
          setArm(f.R, ARM.rest.map((v, i) => lerp(v, ARM.tR[i], up)), -1); //
          setArm(f.L, ARM.rest.map((v, i) => lerp(v, ARM.tL[i], up)), 1); //
          f.lean.children[f.lean.children.length - 1].visible = up > 0.3;   // the trumpet //
        } //
      }; //
      // ---- the eye (keys [t, eye, look], demo seconds) and the words //
      const keys = () => { //
        const wy = Y0, SP = SHL.SP, sf = standF(), sy = SP.gy != null ? SP.gy : wy; //
        const A1 = AW(57.4, 30), B = BOWL(); //
        return [ //
          [0, [4, 21, 94], [-17, 15, 70]], [T.out1, [9, 14, 92], [-3, 5, 74]], //
          // over the mount (above the roof of the royal stoa, 37.5) to the outside of the gate of Chulda //
          [T.out1 + 1.6, [10, 95, 200], [6, 0, 360]], [T.gate1 - 1.0, [24, 40, 384], [2, -4, 338]], //
          [T.gate1, [22, 10, 352], [0, -6, 340]], [T.stairs1, [24, -6, 380], [0, -24, 360]], //
          [T.path1 - 2.2, [44, wy + 22, 470], [20, wy + 4, 515]], //
          [T.rim1, [sf[0] - 5.2, sy + 2.9, sf[1] - 2.0], [sf[0] + 0.3, sy + 1.3, sf[1] + 0.8]], [T.fill1, [sf[0] - 4.8, sy + 2.7, sf[1] - 1.6], [sf[0] + 0.3, sy + 1.25, sf[1] + 0.85]], //
          [T.back0 + 1.0, [sf[0] - 6, sy + 10, sf[1] - 6], [sf[0] + 4, sy - 2, sf[1] - 30]], [T.back0 + 2.6, [40, wy + 34, 600], [12, -24, 420]], //
          [T.back1 - 0.6, [22, 4, 384], [0, -6, 345]], //
          // up over the wall and the mount again, to the Water Gate //
          [T.back1 + 0.5, [22, 42, 372], [0, 0, 330]], [T.back1 + 1.4, [10, 48, 220], [-10, 0, 100]], //
          [T.wg0 + 0.2, [10, 16, 96], [-4, 6, 74]], [T.wg1 - 0.4, [-30, 18, 86], [-17, 15.2, 73]], [T.blow1, [-32, 17.6, 84], [-17, 15.3, 73.2]], //
          // over the court's wall (40.9) into the court, to the ramp //
          [T.blow1 + 1.0, [-4, 52, 80], [-14, 16, 63]], [T.in1 - 0.8, [38, 30, 44], [56, 18, 50]], [T.ramp1 - 1.0, [38, 31, A1[1] - 8.5], [56, 23, A1[1] - 12.5]], //
          [T.top1, [40, 31, B[1] + 11], [B[0] + 3, 25.5, B[1] - 1]], [T.pour0 + 0.8, [48.6, 29.4, B[1] + 8.6], [B[0] + 0.3, 26.2, B[1] - 0.4]], //
          [T.end, [48.2, 29.2, B[1] + 8.2], [B[0] + 0.2, 26.1, B[1] - 0.3]] //
        ]; //
      }; //
      const caps = [ //
        [0, "״נסוך המים כיצד. צלוחית של זהב מחזקת שלשת לגים היה ממלא מן השלוח״ (סוכה ד, ט)"], //
        [T.gate1 - 0.8, "״שני שערי חלדה מן הדרום, משמשין כניסה ויציאה״ (מידות א, ג)"], //
        [T.stairs1, "אל השילוח — הדרך ומקום המעיין בחירת מודל: אין מקור שמתאר אותם"], //
        [T.rim1 - 0.4, "״היה ממלא מן השלוח״ (סוכה ד, ט); ״שילוח היה מוציא מים כאיסר״ (ירושלמי סוכה ה, ו)"], //
        [T.back0 + 0.6, "בחזרה — דרך שערי חלדה ושער המים"], //
        [T.wg0, "״הגיעו לשער המים, תקעו והריעו ותקעו״ (סוכה ד, ט). ״ולמה נקרא שמו שער המים. שבו מכניסין צלוחית של מים של נסוך בחג״ (מידות ב, ו)"], //
        [T.in1 - 0.4, "״עלה בכבש ופנה לשמאלו, שני ספלים של כסף היו שם״ (סוכה ד, ט)"], //
        [T.pour0 - 0.6, "״מערבי של מים, מזרחי של יין״; ״ולמנסך אומרים לו, הגבה ידך״ (סוכה ד, ט)"] //
      ]; //
      const finish = () => { //
        SHL.run = false; //
        if (SHL.D) SHL.D.DG.visible = false; //
        streamTo(SHL.SP.base || 0); //
        const sv = SHL.saved; //
        if (sv && sv.lg) sv.lg.visible = sv.labels; //
        if (sv && sv.view && SH.viewLimits) SH.viewLimits.set(sv.view);   // the view's limits as they were //
        delete SH.camLow; //
        SHL.saved = null; //
      }; //
      const start = () => { //
        const Wk = SH.walk; //
        if (!Wk || !K || !FIG) return false; //
        buildPool(); //
        const D2 = buildDemo(); //
        if (fnc(SH.stopDemos)) SH.stopDemos("shiloachDemo"); //
        for (const f of [D2.p, D2.t1, D2.t2]) f.sash.material = (SH.tamid && SH.tamid.belt === "white") ? K.mSashWhite : K.mSashDyed; //
        let lg = null; //
        try { lg = ctx2.root.getObjectByName("labels"); } catch (_) {} //
        SHL.saved = { lg, labels: lg ? lg.visible : true, view: SH.viewLimits ? SH.viewLimits.get() : null }; //
        if (lg) lg.visible = false; //
        // the eye goes down to the Shiloach, far from the mount and under its ground: the view's limits are widened for the walk //
        if (SH.viewLimits) SH.viewLimits.include([SHL.POOL[0], Y0 - 1, SHL.POOL[1] + 10]); //
        SH.camLow = Y0 - 3; //
        D2.DG.visible = true; //
        SHL.run = true; //
        apply(0); //
        Wk.run(keys(), caps, finish); //
        return true; //
      }; //
      const stop = () => { if (!SHL.run) return; const Wk = SH.walk; if (Wk && Wk.on) Wk.stop(); else finish(); }; //
      let sndT = -1; //
      if (Array.isArray(ctx2.animated)) ctx2.animated.push(() => { //
        if (!SHL.run) { sndT = -1; return; } //
        const Wk = SH.walk, t = Wk && fnc(Wk.now) ? Math.max(0, Wk.now()) : 0; //
        try { apply(t); } catch (e) { console.warn("[shiloach]", e && e.message); } //
        try { //
          if (sndT >= 0 && t > sndT && fnc(SH.sfx)) { //
            if (sndT < T.fill0 + 0.4 && t >= T.fill0 + 0.4) SH.sfx("water", { dur: 2.2, gain: 0.7 }); //
            if (sndT < T.blow0 && t >= T.blow0) SH.sfx("trumpets"); //
            if (sndT < T.pour0 + 0.5 && t >= T.pour0 + 0.5) SH.sfx("water", { dur: 2.0, gain: 0.6 }); //
          } //
        } catch (_) {} //
        sndT = t; //
      }); //
      const walkEntry = () => (SH.demoStops || []).find((q) => q.id === "walk"); //
      (SH.demoStops || (SH.demoStops = [])).push({ id: "shiloachDemo", running: () => SHL.run, stop, //
        pause: () => { const w = walkEntry(); if (w) w.pause(); }, resume: () => { const w = walkEntry(); if (w) w.resume(); }, //
        paused: () => { const w = walkEntry(); return !!(w && w.paused()); }, restart: () => { stop(); start(); } }); //
      const INFO = "**המשנה** (סוכה ד, ט): ״נסוך המים כיצד. צלוחית של זהב מחזקת שלשת לגים היה ממלא מן השלוח. הגיעו לשער המים, תקעו והריעו ותקעו. עלה בכבש ופנה לשמאלו, שני ספלים של כסף היו שם... מערבי של מים, מזרחי של יין... ולמנסך אומרים לו, הגבה ידך״; ובשבת (שם, י): ״היה ממלא מערב שבת חבית של זהב שאינה מקדשת, מן השלוח, ומניחה בלשכה״.\n" + //
        "**שער המים** (מידות ב, ו): ״ולמה נקרא שמו שער המים. שבו מכניסין צלוחית של מים של נסוך בחג. רבי אליעזר בן יעקב אומר, ובו המים מפכים, ועתידין להיות יוצאין מתחת מפתן הבית״; וכן בתוספתא (סוכה ג, ג).\n" + //
        "**שערי חולדה** (מידות א, ג): ״שני שערי חלדה מן הדרום, משמשין כניסה ויציאה״.\n" + //
        "**השילוח** — תני, רבן שמעון בן גמליאל אומר: ״שילוח היה מוציא מים כאיסר. אמרו: נרחיבנו וירבו מימיו. הרחיבוהו ונתמעטו מימיו. חזרו וגדרוהו וחזר לכמות שהיה״ (ירושלמי סוכה ה, ו).\n" + //
        "**במודל:** אין מקור שמתאר את הדרך מהמקדש אל השילוח ואת מרחקו. הבריכה מצוירת בתחתית העמק שבדרום ההר, כמאתיים ועשרים אמה מחומתו, והשביל אליה יוצא משער חולדה המערבי — בחירת מודל. צורת הבריכה, מוצא המעיין (אבן עם צינור שהמים יורדים ממנו), צורת הצלוחית ושני התוקעים — בחירות מודל. בהדגמה הכהן ממלא את הצלוחית מתחת לזרם היוצא מן המעיין, ומנסך ביד מורמת לתוך הספל המערבי. ההליכה בהדגמה מואצת, ובשני מקומות היא מדולגת (בדרך על פני הר הבית)."; //
      const REFS = [["סוכה ד, ט", { book: 56, index: 48 }], ["סוכה ד, י", { book: 56, index: 49 }], ["מידות ב, ו", "Mishnah_Middot.2.6"], ["מידות א, ג", "Mishnah_Middot.1.3"]]; //
      SH.shiloach = { demo: start, stop, T, info: INFO, refs: REFS, POOL: SHL.POOL, at: (t) => { buildPool(); const D2 = buildDemo(); D2.DG.visible = true; apply(t); return { Y0 }; }, //
        leave: () => { if (SHL.D) SHL.D.DG.visible = false; }, dbg: () => ({ offF: SHL.offF, offP: SHL.offP, SP: { x: SHL.SP.x, y: SHL.SP.y, gy: SHL.SP.gy, zT: SHL.SP.zT }, standF: standF(), standP: standP(), bowl: BOWL(), bowlY: bowlY() }) }; //
      SH.modelButtons = SH.modelButtons || []; //
      SH.modelButtons.push({ //
        id: "shiloachDemo", label: "הדגמה: ניסוך המים — מן השילוח", labelOn: "עצור את ההדגמה", maxDist: 140, //
        title: "״צלוחית של זהב מחזקת שלשת לגים היה ממלא מן השלוח. הגיעו לשער המים, תקעו והריעו ותקעו״ (סוכה ד, ט). ההדגמה: כהן יוצא בשער המים ובשער חולדה, ממלא מן השילוח, חוזר, ומנסך בספל המערבי.", //
        anchor: () => [SHL.POOL[0], Y0 + 9, SHL.POOL[1]], //
        get: () => SHL.run, //
        set: (on) => { if (on) start(); else stop(); } //
      }); //
    } //
