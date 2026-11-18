        // ===== MESIBAH_303 (the user, 18.11.2026: "תפרסם רק אחרי המסיבה ובית הטבילה" - the plan he took): THE WAY DOWN TO THE BATH.
        // Tamid 1:1 (book 88, line 2): "ארע קרי לאחד מהן, יוצא והולך לו במסבה ההולכת תחת הבירה, והנרות דולקין מכאן ומכאן, עד שהוא מגיע
        // לבית הטבילה. ומדורה היתה שם, ובית כסא של כבוד... ירד וטבל, עלה ונסתפג ונתחמם כנגד המדורה"; Middot 1:6 (89, line 7): "צפונית
        // מערבית, בה יורדים לבית הטבילה". The Mefaresh on Tamid 26a (book 2105, lines 17-22): the mesibah - "עמוד של בנין שעולין ויורדין בו
        // ע"י גלגול"; its one end open to the chamber of Beit HaMoked, the other "חוץ לעזרה אל מקום הטבילה"; "ולכך עשו מחילה דמחילות לא
        // נתקדשו"; the lamps "במחילה כדי להאיר לו"; the fire "במחילה סמוך לבית הטבילה"; on 26b (line 44), of the bath over the water gate:
        // "כמין חקיקה אמה על אמה ברום שלש אמות". So: from the mouth in the north-west chamber's floor a winding stair round a pillar, down to
        // a tunnel's floor seven amot under the mount's; the tunnel south, under the house's holy half, and west along the court's
        // north-west, under its west wall and the chel, to the bath - a room, and in it a pool of an amah by an amah, three deep, with steps
        // down into it; a lamp on each side every four amot; the fire in a niche on the south side by the bath, the toilet opposite, its
        // door open ("פתוח, יודע שאין שם אדם"). The light under the ground is drawn into the surfaces (the lamps' and the fire's - vertex
        // colours on plain materials): no light is added to the scene. ctx2.shared.tevilaWay - for the demonstration (50-heichal.js,
        // MESIBAH_DEMO); ctx2.shared.features.mesibahSee - the way seen through the ground (an x-ray: each piece's twin is drawn only where
        // the ground hides it). The course, the depth, the breadth (2) and the height (4), the rooms, the lamps' and the fire's form -
        // model choices. (The mouth's hole goes through the floor, the house's base and the mount's floor: FLOOR_211 above, 20-mount.js.)
        {
          const [MX, MZ] = chC(-1, -1);                                   // the north-west chamber's middle: the mouth (-28.25, -73.25)
          const YF = -7, YC = -3, YR = -2.5, SH = 1.74, COLR = 0.35, NST = 45, RISE = 0.5;   // the floors and ceilings; the stair's half-breadth (in the mouth's 1.75), pillar, steps
          const root = new Group();
          root.name = "tevilaWay";
          g.add(root);
          const noRay = () => {};
          // ---- the lamps and the fire first: every surface's light is drawn from them
          const LAMPS = [];
          const lamp = (wx, y, wz, nx, nz) => LAMPS.push({ wx, y, wz, nx, nz });
          for (const z of [-69.5, -65.5, -61.5]) { lamp(MX - 1, YF + 2.2, z, 1, 0); lamp(MX + 1, YF + 2.2, z, -1, 0); }   // the tunnel, south
          for (let x = -31.25; x > -96; x -= 4) { lamp(x, YF + 2.2, -59, 0, 1); lamp(x, YF + 2.2, -57, 0, -1); }      // and west
          for (const k of [9, 15, 21, 27, 33, 39]) { const e = (k - 9) % 12 === 0; lamp(e ? MX + SH : MX - SH, 17.95 - RISE * k, MZ, e ? -1 : 1, 0); }   // the stair: every half turn
          lamp(MX + SH, -4.3, MZ, -1, 0);                                 // at the stair's foot, by its last step (east)
          lamp(-103.2, YF + 2.4, -61.2, 0, 1); lamp(-101.2, YF + 2.4, -54.8, 0, -1); lamp(-98, YF + 2.4, -60.5, -1, 0);   // the bath
          lamp(-97.6, YF + 2.2, -60.6, 1, 0);                             // the toilet
          for (const L of LAMPS) L.f = [L.wx + L.nx * 0.24, L.y + 0.07, L.wz + L.nz * 0.24];   // the flame, at the lamp's nozzle
          const FIRE = { x: -96.6, z: -56.3 };
          const LIT = LAMPS.map((L) => [L.f[0], L.f[1] + 0.06, L.f[2], 0.8, 1.05]).concat([[FIRE.x, YF + 0.8, FIRE.z, 2.2, 2.0]]);   // [x, y, z, strength, reach]
          const AMB = [0.022, 0.022, 0.028];
          const inShaft = (x, z) => Math.abs(x - MX) < SH + 0.05 && Math.abs(z - MZ) < SH + 0.05;
          const shade = (x, y, z, nx, ny, nz) => {
            let r = AMB[0], gg = AMB[1], b = AMB[2];
            if (inShaft(x, z) && y > 6) { const k = Math.min(1, (y - 6) / 10), d = 0.32 * k * k * k; r += d; gg += d * 0.97; b += d * 0.92; }   // the day, from the chamber above
            for (const L of LIT) {
              const dx = L[0] - x, dy = L[1] - y, dz = L[2] - z, d2 = dx * dx + dy * dy + dz * dz;
              if (d2 > 49) continue;
              const d = Math.sqrt(d2) || 1e-4, ndl = (nx * dx + ny * dy + nz * dz) / d;
              if (ndl <= 0) continue;
              const f = L[3] * (0.25 + 0.75 * ndl) * Math.exp(-d2 / (2 * L[4] * L[4]));   // a pool of light round each flame
              r += f; gg += f * 0.74; b += f * 0.46;
            }
            return [Math.min(1.15, r), Math.min(1.05, gg), Math.min(0.9, b)];
          };
          // ---- the surfaces: in buffers by material, each face cut to half an amah (that its light is smooth)
          const mWall = new MeshBasicMaterial({ map: M2.stoneSmooth.map, vertexColors: true });
          const mFloor = new MeshBasicMaterial({ map: M2.stone.map, vertexColors: true });
          const BUF = new Map();
          const buf = (m) => { let b = BUF.get(m); if (!b) { b = { pos: [], col: [], uv: [], idx: [] }; BUF.set(m, b); } return b; };
          const put = (B, p, n, u, v) => {
            B.pos.push(p[0], p[1], p[2]);
            const c = shade(p[0], p[1], p[2], n[0], n[1], n[2]);
            B.col.push(c[0], c[1], c[2]);
            B.uv.push(u, v);
            return B.pos.length / 3 - 1;
          };
          // a rectangle on the plane ax = v, over [u0, u1] x [w0, w1] of the other two (x: z, y; y: x, z; z: x, y), facing sg along ax
          const WALLS = [];   // (for the walk: the walls' solid slabs, below)
          const rect = (m, ax, v, u0, u1, w0, w1, sg) => {
            if (u1 - u0 < 1e-4 || w1 - w0 < 1e-4) return;
            if (ax !== "y") WALLS.push([ax, v, u0, u1, w0, w1, sg]);
            const B = buf(m), nu = Math.max(1, Math.ceil((u1 - u0) / 0.5 - 1e-6)), nw = Math.max(1, Math.ceil((w1 - w0) / (ax === "y" ? 0.5 : 0.6) - 1e-6));
            const n = ax === "x" ? [sg, 0, 0] : ax === "y" ? [0, sg, 0] : [0, 0, sg], i0 = B.pos.length / 3;
            for (let j = 0; j <= nw; j++) for (let i = 0; i <= nu; i++) {
              const u = u0 + (u1 - u0) * i / nu, w = w0 + (w1 - w0) * j / nw;
              put(B, ax === "x" ? [v, w, u] : ax === "y" ? [u, v, w] : [u, w, v], n, u, w);
            }
            const flip = sg !== (ax === "z" ? 1 : -1);
            for (let j = 0; j < nw; j++) for (let i = 0; i < nu; i++) {
              const a = i0 + j * (nu + 1) + i, b = a + 1, c = a + nu + 1, d = c + 1;
              if (flip) B.idx.push(a, d, b, a, c, d); else B.idx.push(a, b, d, a, d, c);
            }
          };
          // four points of one plane, wound to face n
          const quad4 = (m, P, n, uvs) => {
            const B = buf(m);
            const e1 = [P[1][0] - P[0][0], P[1][1] - P[0][1], P[1][2] - P[0][2]], e2 = [P[2][0] - P[0][0], P[2][1] - P[0][1], P[2][2] - P[0][2]];
            const cx = e1[1] * e2[2] - e1[2] * e2[1], cy = e1[2] * e2[0] - e1[0] * e2[2], cz = e1[0] * e2[1] - e1[1] * e2[0];
            const k = P.map((p, i) => put(B, p, n, uvs[i][0], uvs[i][1]));
            if (cx * n[0] + cy * n[1] + cz * n[2] >= 0) B.idx.push(k[0], k[1], k[2], k[0], k[2], k[3]); else B.idx.push(k[0], k[2], k[1], k[0], k[3], k[2]);
          };
          // ---- the rooms: boxes in plan, one floor (YF), each its ceiling; the walls where a room meets the rock or a lower ceiling
          const ROOMS = [
            { x0: MX - SH, x1: MX + SH, z0: MZ - SH, z1: MZ + SH, c: FL, open: true },   // the stair's shaft, open to the chamber
            { x0: MX - 1, x1: MX + 1, z0: MZ + SH, z1: -57, c: YC },                      // the tunnel, south, under the house's holy half
            { x0: -98, x1: MX + 1, z0: -59, z1: -57, c: YC },                              // and west, along the court's north-west, under its west wall and the chel
            { x0: -97.6, x1: -95.6, z0: -57, z1: -55.6, c: YC },                          // the fire's niche
            { x0: -97.6, x1: -95.4, z0: -61.7, z1: -59.3, c: YC },                        // the toilet
            { x0: -97.1, x1: -95.9, z0: -59.3, z1: -59, c: YF + 3.3 },                    // its doorway
            { x0: -104.4, x1: -98, z0: -61.2, z1: -54.8, c: YR }                          // the bath
          ];
          const POOL = { x0: -104.4, x1: -100.4, z0: -58.5, z1: -57.5 };
          const r3 = (v) => Math.round(v * 1000) / 1000;
          const cutsOf = (a0, a1, extra) => Array.from(new Set(ROOMS.map((r) => r[a0]).concat(ROOMS.map((r) => r[a1]), extra).map(r3))).sort((p, q) => p - q);
          const XS = cutsOf("x0", "x1", [POOL.x0, POOL.x1]), ZS = cutsOf("z0", "z1", [POOL.z0, POOL.z1]);
          const CELL = XS.slice(1).map((_, i) => ZS.slice(1).map((__, j) => {
            const xm = (XS[i] + XS[i + 1]) / 2, zm = (ZS[j] + ZS[j + 1]) / 2, rs = ROOMS.filter((r) => xm > r.x0 && xm < r.x1 && zm > r.z0 && zm < r.z1);
            if (!rs.length) return null;
            return { c: Math.max(...rs.map((r) => r.c)), open: rs.some((r) => r.open), pool: xm > POOL.x0 && xm < POOL.x1 && zm > POOL.z0 && zm < POOL.z1 };
          }));
          const cellAt = (i, j) => (i < 0 || j < 0 || i >= XS.length - 1 || j >= ZS.length - 1 ? null : CELL[i][j]);
          for (let i = 0; i + 1 < XS.length; i++) for (let j = 0; j + 1 < ZS.length; j++) {
            const C = CELL[i][j];
            if (!C) continue;
            const x0 = XS[i], x1 = XS[i + 1], z0 = ZS[j], z1 = ZS[j + 1];
            if (!C.pool) rect(mFloor, "y", YF, x0, x1, z0, z1, 1);
            if (!C.open) rect(mWall, "y", C.c, x0, x1, z0, z1, -1);
            for (const [di, dj, ax, v, sg] of [[-1, 0, "x", x0, 1], [1, 0, "x", x1, -1], [0, -1, "z", z0, 1], [0, 1, "z", z1, -1]]) {
              const nb = cellAt(i + di, j + dj), bot = !nb ? YF : nb.c < C.c - 1e-4 ? nb.c : null;
              if (bot === null) continue;
              if (ax === "x") rect(mWall, "x", v, z0, z1, bot, C.c, sg); else rect(mWall, "z", v, x0, x1, bot, C.c, sg);
            }
          }
          // ---- the pool: five steps down from the east (half an amah each, risers of 0.525), then its floor, an amah and a half long -
          // the water 3 deep over an amah by an amah ("ברום שלש אמות"), its face just under the room's floor
          const PB = YF - 3.15, RP = 0.525;
          {
            let xe = POOL.x1;
            for (let i = 0; i < 5; i++) {
              const xw = xe - 0.5, top = YF - RP * (i + 1);
              rect(mFloor, "y", top, xw, xe, POOL.z0, POOL.z1, 1);
              rect(mWall, "x", xe, POOL.z0, POOL.z1, top, YF - RP * i, -1);
              rect(mWall, "z", POOL.z0, xw, xe, top, YF, 1);
              rect(mWall, "z", POOL.z1, xw, xe, top, YF, -1);
              xe = xw;
            }
            rect(mFloor, "y", PB, POOL.x0, xe, POOL.z0, POOL.z1, 1);
            rect(mWall, "x", xe, POOL.z0, POOL.z1, PB, YF - RP * 5, -1);
            rect(mWall, "z", POOL.z0, POOL.x0, xe, PB, YF, 1);
            rect(mWall, "z", POOL.z1, POOL.x0, xe, PB, YF, -1);
            rect(mWall, "x", POOL.x0, POOL.z0, POOL.z1, PB, YF, 1);
          }
          // ---- the stair: 45 steps of half an amah round the pillar (30 degrees each, going down sunwise: in from the south edge of the
          // mouth westward, out at the foot on the east side southward - to the tunnel); each a slab from the pillar to the shaft's walls
          const D2R = Math.PI / 180;
          const onSq = (a) => { const s = Math.sin(a), c = Math.cos(a), t = SH / Math.max(Math.abs(s), Math.abs(c)); return [MX + t * s, MZ + t * c]; };
          const onCol = (a) => [MX + COLR * Math.sin(a), MZ + COLR * Math.cos(a)];
          for (let k = 0; k < NST; k++) {
            const a0 = -(k + 1) * 30, a1 = -k * 30, top = FL - RISE * (k + 1), bot = top - RISE;
            const A = [a0, a0 + 10, a0 + 20, a1];
            for (let c = 45 - 90 * 20; c < 400; c += 90) if (c > a0 + 1e-6 && c < a1 - 1e-6) A.push(c);   // a corner of the square within the step
            A.sort((p, q) => p - q);
            const R = A.map((d) => d * D2R);
            for (let q = 0; q + 1 < R.length; q++) {
              const i0 = onCol(R[q]), i1 = onCol(R[q + 1]), o0 = onSq(R[q]), o1 = onSq(R[q + 1]);
              for (const [y, n] of [[top, [0, 1, 0]], [bot, [0, -1, 0]]]) {
                quad4(mFloor, [[i0[0], y, i0[1]], [o0[0], y, o0[1]], [o1[0], y, o1[1]], [i1[0], y, i1[1]]], n, [[i0[0], i0[1]], [o0[0], o0[1]], [o1[0], o1[1]], [i1[0], i1[1]]]);
              }
            }
            for (const [d, sg] of [[a0, -1], [a1, 1]]) {   // its two ends: the riser (toward the step below) and the end under the step above
              const r = d * D2R, i0 = onCol(r), o0 = onSq(r), n = [sg * Math.cos(r), 0, -sg * Math.sin(r)], L = Math.hypot(o0[0] - i0[0], o0[1] - i0[1]);
              quad4(mWall, [[i0[0], bot, i0[1]], [o0[0], bot, o0[1]], [o0[0], top, o0[1]], [i0[0], top, i0[1]]], n, [[0, bot], [L, bot], [L, top], [0, top]]);
            }
          }
          // the toilet's seat: a stone bench along its north wall, its hole dark
          {
            const sx0 = -97.35, sx1 = -95.65, sz0 = -61.7, sz1 = -61.05, sy = YF + 0.9;
            rect(mWall, "y", sy, sx0, sx1, sz0, sz1, 1);
            rect(mWall, "z", sz1, sx0, sx1, YF, sy, 1);
            rect(mWall, "x", sx0, sz0, sz1, YF, sy, -1);
            rect(mWall, "x", sx1, sz0, sz1, YF, sy, 1);
          }
          let floorMesh = null;   // the floors and the treads: solid for the walk (90-entry.js ent_solids) - one walks down the stair and along the way
          for (const [m, B] of BUF) {
            const geo = new BufferGeometry();
            geo.setAttribute("position", new Float32BufferAttribute(B.pos, 3));
            geo.setAttribute("color", new Float32BufferAttribute(B.col, 3));
            geo.setAttribute("uv", new Float32BufferAttribute(B.uv, 2));
            geo.setIndex(B.idx);
            geo.computeBoundingSphere();
            const mesh = new Mesh(geo, m);
            if (m === mFloor) floorMesh = mesh;
            root.add(mesh);
          }
          // ---- the pillar, round, from the tunnel's floor to the chamber's floor
          {
            const H = FL + 0.04 - YF, cg = new CylinderGeometry(COLR, COLR, H, 16, Math.ceil(H / 0.6), true);
            cg.translate(MX, YF + H / 2, MZ);
            const p = cg.attributes.position, nr = cg.attributes.normal, uv = cg.attributes.uv, col = new Float32Array(p.count * 3);
            for (let i = 0; i < p.count; i++) {
              col.set(shade(p.getX(i), p.getY(i), p.getZ(i), nr.getX(i), nr.getY(i), nr.getZ(i)), i * 3);
              uv.setXY(i, uv.getX(i) * 2.2, uv.getY(i) * H);
            }
            cg.setAttribute("color", new Float32BufferAttribute(col, 3));
            root.add(new Mesh(cg, mWall));
            const cap = new Mesh(new CircleGeometry(COLR, 16).rotateX(-HP), new MeshBasicMaterial({ map: M2.stoneSmooth.map, color: 0xa39a88 }));
            cap.position.set(MX, FL + 0.04, MZ);
            root.add(cap);
          }
          // ---- the water, and a ring on it (the demonstration's)
          const water = new Mesh(new PlaneGeometry(POOL.x1 - POOL.x0, POOL.z1 - POOL.z0).rotateX(-HP), new MeshBasicMaterial({ color: 0x2a4c58, transparent: true, opacity: 0.72, depthWrite: false }));
          water.position.set((POOL.x0 + POOL.x1) / 2, YF - 0.15, (POOL.z0 + POOL.z1) / 2);
          water.renderOrder = 3;
          root.add(water);
          const ripple = new Mesh(new RingGeometry(0.16, 0.24, 28).rotateX(-HP), new MeshBasicMaterial({ color: 0xcfe6ee, transparent: true, opacity: 0, depthWrite: false }));
          ripple.position.set(POOL.x0 + 0.75, YF - 0.14, (POOL.z0 + POOL.z1) / 2);
          ripple.visible = false;
          ripple.renderOrder = 4;
          root.add(ripple);
          // ---- the lamps: a stone shelf on the wall, a clay lamp on it, its flame; a glow round each flame
          const m4 = new Matrix4(), q4 = new Quaternion(), qI = new Quaternion(), s3 = new Vector3(), v3 = new Vector3(), YAX = new Vector3(0, 1, 0);
          const nL = LAMPS.length;
          const shelfI = new InstancedMesh(uvWorldBox(new BoxGeometry(0.3, 0.07, 0.24), 0.3, 0.07, 0.24), new MeshBasicMaterial({ color: 0x9c876a, map: M2.stoneSmooth.map }), nL);
          const bodyG = new SphereGeometry(0.1, 10, 6);
          bodyG.scale(1, 0.48, 1.35);
          const bodyI = new InstancedMesh(bodyG, new MeshBasicMaterial({ color: 0x9a5a34 }), nL);
          const flameG = new ConeGeometry(0.03, 0.11, 7);
          flameG.translate(0, 0.055, 0);
          const flameI = new InstancedMesh(flameG, new MeshBasicMaterial({ color: 0xffd27a }), nL);
          LAMPS.forEach((L, i) => {
            q4.setFromAxisAngle(YAX, Math.atan2(L.nx, L.nz));
            shelfI.setMatrixAt(i, m4.compose(v3.set(L.wx + L.nx * 0.12, L.y - 0.035, L.wz + L.nz * 0.12), q4, s3.set(1, 1, 1)));
            bodyI.setMatrixAt(i, m4.compose(v3.set(L.wx + L.nx * 0.13, L.y + 0.045, L.wz + L.nz * 0.13), q4, s3.set(1, 1, 1)));
            flameI.setMatrixAt(i, m4.compose(v3.set(L.f[0], L.f[1], L.f[2]), qI, s3.set(1, 1, 1)));
          });
          for (const I of [shelfI, bodyI, flameI]) { I.computeBoundingSphere(); root.add(I); }
          const glowTex = (() => {
            const c = document.createElement("canvas");
            c.width = c.height = 64;
            const x = c.getContext("2d"), gr = x.createRadialGradient(32, 32, 0, 32, 32, 32);
            gr.addColorStop(0, "rgba(255,226,160,1)");
            gr.addColorStop(0.22, "rgba(255,176,80,0.55)");
            gr.addColorStop(1, "rgba(255,120,30,0)");
            x.fillStyle = gr;
            x.fillRect(0, 0, 64, 64);
            return new CanvasTexture(c);
          })();
          const glows = [0, 1, 2].map((s) => {
            const pts = [];
            LAMPS.forEach((L, i) => { if (i % 3 === s) pts.push(L.f[0], L.f[1] + 0.05, L.f[2]); });
            const geo = new BufferGeometry();
            geo.setAttribute("position", new Float32BufferAttribute(pts, 3));
            const P = new Points(geo, new PointsMaterial({ size: 1.3, map: glowTex, transparent: true, depthWrite: false, blending: AdditiveBlending, color: 0xffb060, opacity: 0.8 }));
            P.renderOrder = 5;
            root.add(P);
            return P;
          });
          // ---- the fire: a ring of stones, the embers, the logs; its flames are the altar's (40-altar.js, ctx2.shared.tevilaFire)
          {
            const stI = new InstancedMesh(new BoxGeometry(0.26, 0.2, 0.2), new MeshBasicMaterial({ color: 0x6a5c4e, map: M2.stoneSmooth.map }), 9);
            for (let i = 0; i < 9; i++) {
              const a = i / 9 * Math.PI * 2;
              q4.setFromAxisAngle(YAX, a);
              stI.setMatrixAt(i, m4.compose(v3.set(FIRE.x + Math.sin(a) * 0.55, YF + 0.1, FIRE.z + Math.cos(a) * 0.55), q4, s3.set(1, 1, 1)));
            }
            stI.computeBoundingSphere();
            root.add(stI);
            const emb = new Mesh(new CylinderGeometry(0.45, 0.48, 0.06, 16), new MeshBasicMaterial({ color: 0xff5a14 }));
            emb.position.set(FIRE.x, YF + 0.03, FIRE.z);
            root.add(emb);
            const logM = new MeshBasicMaterial({ color: 0x3a2414 });
            for (let i = 0; i < 4; i++) {
              const lg = new Mesh(new CylinderGeometry(0.06, 0.07, 0.85, 7), logM);
              lg.position.set(FIRE.x, YF + 0.12 + (i % 2) * 0.09, FIRE.z);
              lg.rotation.set(0, i * Math.PI / 4, HP, "YXZ");
              root.add(lg);
            }
            ctx2.shared.tevilaFire = { x: FIRE.x, y: YF + 0.14, z: FIRE.z };
            const fg = new BufferGeometry();
            fg.setAttribute("position", new Float32BufferAttribute([FIRE.x, YF + 0.75, FIRE.z], 3));
            const fp = new Points(fg, new PointsMaterial({ size: 5, map: glowTex, transparent: true, depthWrite: false, blending: AdditiveBlending, color: 0xff8a3a, opacity: 0.85 }));
            fp.renderOrder = 5;
            root.add(fp);
            glows.push(fp);
          }
          // ---- the toilet: its seat's hole; its door, standing open into it
          {
            const hole = new Mesh(new CircleGeometry(0.17, 18).rotateX(-HP), new MeshBasicMaterial({ color: 0x0d0b09 }));
            hole.scale.set(1, 1, 0.75);
            hole.position.set(-96.5, YF + 0.905, -61.4);
            root.add(hole);
          }
          const door = new Group();
          door.position.set(-95.9, YF, -59.3);
          door.rotation.y = -1.75;
          root.add(door);
          {
            const leaf = new Mesh(uvWorldBox(new BoxGeometry(1.18, 3.25, 0.08), 1.18, 3.25, 0.08), new MeshBasicMaterial({ map: M2.cedar.map, color: 0x9a7650 }));
            leaf.position.set(-0.6, 1.625, -0.05);
            door.add(leaf);
            const ring = new Mesh(new TorusGeometry(0.07, 0.016, 6, 14), new MeshBasicMaterial({ color: 0x6e5a32 }));
            ring.position.set(-1.0, 1.55, -0.12);
            door.add(ring);
          }
          // ---- the towel ("ונסתפג"), on a peg on the bath's north wall by the pool; and its twin for the priest's hand
          const towelM = new MeshBasicMaterial({ color: 0xd9d2c2, map: TEX.plaster.map });
          const towel = new Mesh(new BoxGeometry(0.5, 0.85, 0.03), towelM);
          towel.position.set(-100.9, YF + 2.3 - 0.47, -61.17);
          root.add(towel);
          {
            const peg = new Mesh(new CylinderGeometry(0.025, 0.025, 0.14, 6).rotateX(HP), new MeshBasicMaterial({ color: 0x5a3e24 }));
            peg.position.set(-100.9, YF + 2.32, -61.13);
            root.add(peg);
          }
          const towelProp = new Mesh(new BoxGeometry(0.42, 0.8, 0.03).translate(0, -0.38, 0), towelM);
          towelProp.userData.noPick = true;
          // ---- the names, seen with the ground made clear (the layer "mesibahSee")
          const seeFlag = new Group();
          seeFlag.visible = false;
          ctx2.layers.mesibahSee = seeFlag;
          for (const [text, x, y, z] of [["המסבה — ״עמוד של בנין שעולין ויורדין בו ע״י גלגול״ (המפרש)", MX, 2, MZ - 2.6],
                                         ["המחילה — ״והנרות דולקין מכאן ומכאן״", -62, -1.2, -58],
                                         ["המדורה — ״ונתחמם כנגד המדורה״", FIRE.x, -2.4, -54.6],
                                         ["בית כסא של כבוד — פתוח: ״יודע שאין שם אדם״", -96.5, -1.2, -62.6],
                                         ["בית הטבילה — אמה על אמה, ברום שלש אמות", -102.4, -0.6, -58]]) {
            ctx2.labels.push({ text, x, y, z, size: 1.05, layer: "mesibahSee", onTop: true });
          }
          // ---- the x-ray: a twin of every piece, drawn only where something is in front of it (GreaterDepth), lighter
          const XR = [], xrMats = new Map();
          const xrOf = (m) => {
            let x = xrMats.get(m);
            if (!x) {
              x = m.clone();
              x.transparent = true;
              x.opacity = (m.transparent ? m.opacity : 1) * (m.blending === AdditiveBlending ? 0.9 : 0.55);
              x.depthWrite = false;
              x.depthTest = true;
              x.depthFunc = GreaterDepth;
              xrMats.set(m, x);
            }
            return x;
          };
          const pieces = [];
          root.traverse((o) => { if ((o.isMesh || o.isPoints) && o !== towelProp) pieces.push(o); });
          for (const o of pieces) {
            o.castShadow = o.receiveShadow = false;
            if (o !== floorMesh) { o.userData.noPick = true; o.raycast = noRay; }
            let t;
            if (o.isInstancedMesh) { t = new InstancedMesh(o.geometry, xrOf(o.material), o.count); t.instanceMatrix = o.instanceMatrix; t.boundingSphere = o.boundingSphere; }
            else if (o.isPoints) t = new Points(o.geometry, xrOf(o.material));
            else t = new Mesh(o.geometry, xrOf(o.material));
            t.visible = false;
            t.renderOrder = 30 + (o.renderOrder || 0);
            t.raycast = noRay;
            t.userData.noPick = true;
            t.castShadow = t.receiveShadow = false;
            o.add(t);
            XR.push(t);
          }
          // the walls, solid for the walk (90-entry.js ent_solids: the eye in the walking mode keeps to the way) - thin slabs behind them,
          // drawn neither in colour nor in depth; under the mount's floor only (above it its own pieces bound the mouth)
          {
            const parts = [];
            for (const [ax, v, u0, u1, w0, w1, sg] of WALLS) {
              const y1 = Math.min(w1, -1.5);
              if (y1 - w0 < 0.05) continue;
              const L = u1 - u0, c = (u0 + u1) / 2, off = v - sg * 0.06;
              const bg = ax === "x" ? new BoxGeometry(0.12, y1 - w0, L) : new BoxGeometry(L, y1 - w0, 0.12);
              bg.translate(ax === "x" ? off : c, (w0 + y1) / 2, ax === "x" ? c : off);
              parts.push(bg);
            }
            const cm = new Mesh(mergeGeometries(parts), new MeshBasicMaterial({ colorWrite: false, depthWrite: false }));
            cm.name = "tevilaWalls";
            cm.castShadow = cm.receiveShadow = false;
            root.add(cm);
          }
          // the flames flicker (each its own way); the glows breathe, in three sets
          const PH = LAMPS.map((_, i) => [((Math.sin(i * 12.9898) * 43758.5453) % 1 + 1) % 1, ((Math.sin(i * 78.233) * 12543.123) % 1 + 1) % 1]);
          let seeOn = false;
          // far from the way (and not seen through, nor walked) it is not drawn at all: nothing of it can be seen from there
          const BB = { x0: -106, x1: -24, y0: -11, y1: 17, z0: -77, z1: -53 };
          ctx2.animated.push((t) => {
            const cam = ctx2.camera;
            if (cam) {
              const p = cam.position, dx = Math.max(BB.x0 - p.x, 0, p.x - BB.x1), dy = Math.max(BB.y0 - p.y, 0, p.y - BB.y1), dz = Math.max(BB.z0 - p.z, 0, p.z - BB.z1);
              const want = dx * dx + dy * dy + dz * dz < 150 * 150 || seeOn || !!(ctx2.shared.tevilaDemo && ctx2.shared.tevilaDemo.on);
              if (root.visible !== want) root.visible = want;
            }
            if (!root.visible) return;
            const s = t * 0.001;
            LAMPS.forEach((L, i) => {
              const a = PH[i][0] * 6.283, b = PH[i][1] * 6.283, k = 1 + 0.2 * Math.sin(s * (7 + 3 * PH[i][0]) + a) + 0.1 * Math.sin(s * (17 + 5 * PH[i][1]) + b);
              flameI.setMatrixAt(i, m4.compose(v3.set(L.f[0], L.f[1], L.f[2]), qI, s3.set(1.05 - 0.1 * k, k, 1.05 - 0.1 * k)));
            });
            flameI.instanceMatrix.needsUpdate = true;
            glows.forEach((P, i) => { P.material.opacity = (i === 3 ? 0.78 : 0.72) + 0.12 * Math.sin(s * (5.3 + i * 1.7) + i * 2.1) + 0.06 * Math.sin(s * (13.1 + i) + i); });
          });
          // ---- the feature: the way seen through the ground (the place "המסיבה ובית הטבילה", 70-ui.js - on while it shows)
          const setSee = (v) => { seeOn = !!v; seeFlag.visible = seeOn; for (const t of XR) t.visible = seeOn; };
          ctx2.shared.features = ctx2.shared.features || {};
          ctx2.shared.features.mesibahSee = { key: "mesibahSee", timed: false, isOn: () => seeOn, on: () => setSee(true), off: () => setSee(false) };
          const FS = ctx2.shared.features.mesibahSee;
          ctx2.shared.mesibahSee = { set: (v) => (v ? FS.on() : FS.off()), get on() { return seeOn; } };   // the presentation's way (75-tour.js featureOf)
          // ---- for the demonstration (50-heichal.js MESIBAH_DEMO)
          ctx2.shared.tevilaWay = {
            MX, MZ, YF, YC, YR, FL, SH, NST, RISE, COLR, POOL, PB, RP, WATER: YF - 0.15, FIRE,
            TOWEL: [towel.position.x, towel.position.y, towel.position.z],
            stepTop: (k) => FL - RISE * (k + 1),
            towel, towelProp, ripple, door, root,
            see: (v) => setSee(v),
            get seeOn() { return seeOn; }
          };
        }
