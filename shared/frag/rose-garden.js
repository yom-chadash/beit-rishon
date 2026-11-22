  // ROSES_B2 (fix-b2, 22.11.2026 - the user's decisions 76 and 77: "גנת הוורדים — שכבה כבויה", in both houses): THE ROSE GARDEN. Bava Kamma
  // 82b (122:3124): "ואין עושין בה גנות ופרדסות - חוץ מגנות וורדין שהיו מימות נביאים הראשונים"; the Rambam, Beit HaBechirah 7:14 (337:124)
  // "חוץ מגינת ורדים שהיתה שם מימות נביאים הראשונים". Its place is not given: the Tosafot Yom Tov (Middot 1:3, 948:30) in the name of the
  // Shiltei HaGiborim reads the name Kiponos as "עבודת הגן, שאפשר שהיה שם גן של ורדים מחוץ להר הבית", and the Tiferet Yisrael (Yachin,
  // Middot 1, 25 - 819:52) "שהיה שם אחורי ק"ק גנת וורדין" - so: outside the west gate, a hidden layer. Its size, beds, fence and roses - model
  // choices. tm_roseGarden(ctx, { x0, x1, z0, z1, ground(x, z), open: "e" | "w" | "n" | "s", wall: (the side against a wall), name }) -> its group (hidden).
  function tm_roseGarden(ctx, o) {
    const G = new Group(); G.name = o.name || "roseGarden"; G.visible = false; ctx.root.add(G);
    ctx.layers = ctx.layers || {}; ctx.layers[G.name] = G;
    const gy = o.ground, x0 = o.x0, x1 = o.x1, z0 = o.z0, z1 = o.z1;
    let q = 7714;
    const rr = () => (q = (q * 1664525 + 1013904223) >>> 0) / 4294967296;
    const stone = new MeshStandardMaterial({ color: 0xb3a07c, roughness: 0.9 });
    const soilM = new MeshStandardMaterial({ color: 0x6b5236, roughness: 1 });
    const pathM = new MeshStandardMaterial({ color: 0xa89a7c, roughness: 0.95 });
    const leafM = new MeshStandardMaterial({ color: 0x3f6b33, roughness: 0.85 });
    const roseM = new MeshStandardMaterial({ color: 0xffffff, roughness: 0.6 });
    // the ground: soil beds along x, a path between each two and round the edge, following the ground
    const W = x1 - x0, D = z1 - z0;
    const soil = new PlaneGeometry(W, D, Math.ceil(W / 2), Math.ceil(D / 2)).rotateX(-Math.PI / 2);
    { const p = soil.attributes.position; for (let i = 0; i < p.count; i++) { const x = p.getX(i) + (x0 + x1) / 2, z = p.getZ(i) + (z0 + z1) / 2; p.setXYZ(i, x, gy(x, z) + 0.04, z); } soil.computeVertexNormals(); }
    const sm = new Mesh(soil, pathM); sm.receiveShadow = true; sm.userData.noPick = true; G.add(sm);
    const beds = [], BW = 2.4, PW = 1.2;
    for (let z = z0 + PW; z + BW <= z1 - PW + 1e-6; z += BW + PW) beds.push([z, z + BW]);
    const bedG = [];
    for (const [a, b] of beds) {
      const g = new PlaneGeometry(W - 2 * PW, b - a, Math.ceil((W - 2 * PW) / 2), 2).rotateX(-Math.PI / 2), p = g.attributes.position;
      for (let i = 0; i < p.count; i++) { const x = p.getX(i) + (x0 + x1) / 2, z = p.getZ(i) + (a + b) / 2; p.setXYZ(i, x, gy(x, z) + 0.09, z); }
      g.computeVertexNormals(); bedG.push(g);
    }
    if (bedG.length) { const bm = new Mesh(mergeGeometries(bedG), soilM); bm.receiveShadow = true; bm.userData.noPick = true; G.add(bm); }
    // the bushes and their roses (red, pink and white)
    const bush = [], rose = [];
    for (const [a, b] of beds) for (let x = x0 + PW + 0.8; x < x1 - PW - 0.5; x += 1.5 + rr() * 0.3) for (const z of [a + 0.65, b - 0.65]) {
      const zz = z + (rr() - 0.5) * 0.2, s = 0.45 + rr() * 0.25, y = gy(x, zz) + 0.09 + s * 0.75;
      bush.push([x, y, zz, s]);
      const n = 26 + Math.floor(rr() * 9);   // (the user: "ורדים אמורים להיות ורודים!" - many large pink blooms, a pink garden from afar)
      for (let k = 0; k < n; k++) {
        const th = rr() * Math.PI * 2, ph = Math.acos(1 - rr() * 1.3), r = s * 0.98;
        rose.push([x + Math.cos(th) * Math.sin(ph) * r, y + Math.cos(ph) * r * 0.82, zz + Math.sin(th) * Math.sin(ph) * r, rr()]);
      }
    }
    const M4 = new Matrix4(), Q = new Quaternion(), V = new Vector3(), S = new Vector3(), C = new Color();
    const bi = new InstancedMesh(new IcosahedronGeometry(1, 1).scale(1, 0.8, 1), leafM, bush.length);
    bush.forEach(([x, y, z, s], i) => { M4.compose(V.set(x, y, z), Q.identity(), S.set(s, s, s)); bi.setMatrixAt(i, M4); });
    bi.instanceMatrix.needsUpdate = true; bi.castShadow = true; bi.userData.noPick = true; G.add(bi);
    const ri = new InstancedMesh(new IcosahedronGeometry(0.25, 1), roseM, rose.length);
    rose.forEach(([x, y, z, kind], i) => {
      M4.compose(V.set(x, y, z), Q.identity(), S.set(1, 0.75, 1)); ri.setMatrixAt(i, M4);
      ri.setColorAt(i, kind < 0.6 ? C.setRGB(0.95, 0.36, 0.62) : kind < 0.85 ? C.setRGB(0.99, 0.56, 0.76) : C.setRGB(0.85, 0.18, 0.5));   // pink, light pink, deep pink
    });
    ri.instanceMatrix.needsUpdate = true; if (ri.instanceColor) ri.instanceColor.needsUpdate = true; ri.userData.noPick = true; G.add(ri);
    // a low stone fence, open (4 amot) on the side toward the gate
    const fence = [], FH = 0.9, FT = 0.4, OW = 4;
    const seg = (ax, az, bx, bz) => {
      const L = Math.hypot(bx - ax, bz - az); if (L < 0.3) return;
      const n = Math.max(1, Math.ceil(L / 3));
      for (let i = 0; i < n; i++) {
        const u0 = i / n, u1 = (i + 1) / n, cx = ax + (bx - ax) * (u0 + u1) / 2, cz = az + (bz - az) * (u0 + u1) / 2, l = L / n;
        const y = Math.min(gy(ax + (bx - ax) * u0, az + (bz - az) * u0), gy(ax + (bx - ax) * u1, az + (bz - az) * u1)) - 0.3;
        const gb = new BoxGeometry(bx !== ax ? l + FT : FT, FH + 0.3, bz !== az ? l + FT : FT).translate(cx, y + (FH + 0.3) / 2, cz);
        fence.push(gb);
      }
    };
    const mx = (x0 + x1) / 2, mz = (z0 + z1) / 2;
    const side = (s, a, b, c) => { if (o.open === s) { const m = (a + b) / 2; c(a, m - OW / 2); c(m + OW / 2, b); } else c(a, b); };
    // o.wall - the side against the mount's wall: no fence there
    if (o.wall !== "n") side("n", x0, x1, (a, b) => seg(a, z0, b, z0));
    if (o.wall !== "s") side("s", x0, x1, (a, b) => seg(a, z1, b, z1));
    if (o.wall !== "w") side("w", z0, z1, (a, b) => seg(x0, a, x0, b));
    if (o.wall !== "e") side("e", z0, z1, (a, b) => seg(x1, a, x1, b));
    if (fence.length) { const fm = new Mesh(mergeGeometries(fence), stone); fm.castShadow = fm.receiveShadow = true; G.add(fm); }
    ctx.labels.push({ text: "גנת הוורדים — ״חוץ מגנות וורדין שהיו מימות נביאים הראשונים״ (בבא קמא פב:); מקומה — בחירת מודל", x: mx, y: gy(mx, mz) + 5, z: mz, size: 1.6, layer: G.name,
      info: o.info || "", refs: o.refs || [] });
    return G;
  }
