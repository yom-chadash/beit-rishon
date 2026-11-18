    {
      // 1.4.0 (the user): THE TWO BOWLS of the libations (Sukkah 48a-b; Rambam Temidin uMusafin 10): on the top by the south-west horn, on its
      // south side (Tiferet Yisrael, Tamid 7:3) - the western for the water, the eastern for the wine, of silver (R. Yehuda: of lime), "pierced
      // like two thin nostrils", the wine's wider. Two readings of the holes (ctx2.shared.sfalim): "rashi" (Rashi, Bartenura) - a spout out of
      // each bowl, the libation runs on the top to a hole that leads to the shitin; "tosafot" (Tosafot, Rosh, Ritva, Meiri) - the holes in the
      // bowls' bottoms, straight down to the shitin. Sizes and the exact spot: model choices.
      // SFALIM_303 (the user, 18.11.2026: "תעשה את שניהם" - the proposal he took): the bowls fixed in lime in both readings - Tosafot's answer
      // "דספלים היו קבועים בסיד" (Tosafot Yom Tov, Sukkah 4:9) and Tiferet Yisrael's "מחוברין בסיד במזבח"; set 0.35 east, clear of the
      // south-west horn (x 41.5..42.5, z 9.5..10.5 - the western bowl's rim stood in it); Rashi's reading: each spout long and plain, sloping
      // down toward its hole in the top, the holes wider and ringed; Tosafot's: the holes in the bowls' bottoms, and the wine's bowl with a
      // thick bottom (the Mishnah's "אחד מעבה ואחד דק"); under the corner the shitin (Rashi, Sukkah 49a: "חלל שתחת המזבח כנגד מקום הנסכים"),
      // and the ways down to them of the reading shown - seen when the corner is drawn as glass (SFSEE, below; the place "ספלי הניסוך").
      // Sizes, the hollow's measures and depth: model choices.
      const bowlPts = [[0.02, 0], [0.22, 0], [0.3, 0.1], [0.34, 0.28], [0.3, 0.36]];
      const sil = new MeshStandardMaterial({ color: 0xE8E8EC, metalness: 0.8, roughness: 0.3, side: DoubleSide });   // SFALIM_303: two-sided - from above, the bowl's inside and bottom were not drawn
      const BX = [43.05, 43.95], BZ = 9.4;   // SFALIM_303: was 42.7 and 43.6
      const sfG = new Group();   // 1.9.1: the bowls and their holes - R. Yose's first altar moves them to its own south-west horn
      mv.add(sfG);
      ctx2.shared.__sfG = sfG;
      for (const x of BX) H2.lathe(sfG, bowlPts, sil, x, TOP + 0.05, BZ, 16);
      // SFALIM_303: the lime round each bowl's foot - a ring, open in the middle (a whole cylinder's top covered the bowl's floor and the
      // hole in it): its top from the bowl's side out, then down to the top of the altar
      const lime = new MeshStandardMaterial({ color: 0xEEEADF, roughness: 0.95, metalness: 0, side: DoubleSide });
      const limeGeo = new LatheGeometry([new Vector2(0.27, 0.12), new Vector2(0.31, 0.12), new Vector2(0.41, 0)], 20);
      for (const x of BX) {
        const m = new Mesh(limeGeo, lime);
        m.position.set(x, TOP, BZ);
        m.castShadow = m.receiveShadow = true;
        sfG.add(m);
      }
      const sfR = new Group(), sfT = new Group();
      sfG.add(sfR);
      sfG.add(sfT);
      sfT.visible = false;
      ctx2.layers = ctx2.layers || {};
      ctx2.layers.sfalimRashi = sfR;
      ctx2.layers.sfalimTosafot = sfT;
      const dark = new MeshBasicMaterial({ color: 0x120e08 });
      // the ways down of each reading (shown only with the glass corner, SFSEE): from the hole to the top of the shitin, the bottom of the
      // court's floor slab (30-courts.js: the slab is 2.65 thick)
      const DOWN = F - 2.65;
      const wayM = new MeshBasicMaterial({ color: 0x2b1f13 });
      const wayR = new Group(), wayT = new Group();
      wayR.visible = wayT.visible = false;
      sfR.add(wayR);
      sfT.add(wayT);
      const way = (grp, x, z, r, yTop) => { const m = H2.cyl(grp, r, r, yTop - DOWN, wayM, x, DOWN, z, 14); m.castShadow = m.receiveShadow = false; return m; };
      // Rashi: "חוטם אחד בספל ונקב אחד בחוטמו... ויורדין דרך החוטמין על גב המזבח, ובמזבח היה נקב שבו המים והיין יורדין לשיתין". The spout
      // leaves the bowl's south wall a little above its floor and slopes down; the hole in the top lies a little beyond its mouth, where the
      // libation falls. A hole for each (the user, 18.11.2026: "כוונת רשי היא נקב אחד לכל סוג אחד למים ואחד ליין ולכן אין מח' בינו לבין
      // התפאי" - Tiferet Yisrael on Middot 3:1: two holes from the top to the shitin); ONE_HOLE (one for both, the two spouts turned to it)
      // is kept for the other reading of Rashi's "נקב"
      const ONE_HOLE = false;
      const HZ = BZ + 0.86;
      const rimM = new MeshStandardMaterial({ color: 0xD8D0BF, roughness: 0.85, metalness: 0 });
      const holes = ONE_HOLE ? [[(BX[0] + BX[1]) / 2, HZ, 0.1]] : BX.map((x, i) => [x, HZ, i ? 0.09 : 0.07]);   // the wine's hole the wider
      for (const [hx, hz, hr] of holes) {
        H2.cyl(sfR, hr + 0.045, hr + 0.045, 0.012, rimM, hx, TOP, hz, 20);
        H2.cyl(sfR, hr, hr, 0.016, dark, hx, TOP, hz, 20);
        way(wayR, hx, hz, hr * 0.92, TOP);
      }
      const UP = new Vector3(0, 1, 0);
      BX.forEach((x, i) => {
        const hole = ONE_HOLE ? holes[0] : holes[i];
        const h = new Vector3(hole[0] - x, 0, hole[1] - BZ);
        const dh = h.length();
        h.normalize();
        const tilt = 0.2, y0 = TOP + 0.05 + 0.13, r0 = 0.27, len = (dh - r0 - 0.12) / Math.cos(tilt);
        const d = new Vector3(h.x * Math.cos(tilt), -Math.sin(tilt), h.z * Math.cos(tilt));
        const rB = i ? 0.075 : 0.055, rT = i ? 0.058 : 0.042;   // the wine's spout the thicker ("נקב היין עבה ושל המים דק", Bartenura)
        const sp = new Mesh(new CylinderGeometry(rT, rB, len, 14), sil);
        sp.quaternion.setFromUnitVectors(UP, d);
        sp.position.set(x + h.x * r0, y0, BZ + h.z * r0).addScaledVector(d, len / 2);
        sp.castShadow = sp.receiveShadow = true;
        sfR.add(sp);
        const mouth = new Mesh(new CylinderGeometry(rT * 0.62, rT * 0.62, 0.012, 12), dark);   // "ונקב אחד בחוטמו"
        mouth.quaternion.copy(sp.quaternion);
        mouth.position.set(x + h.x * r0, y0, BZ + h.z * r0).addScaledVector(d, len + 0.004);
        sfR.add(mouth);
      });
      // Tosafot (Sukkah 48b; 1903, lines 504-505): "דלמא הוא דמנקב הספלים יורדין לשיתין כמין שני נקבי החוטם ולא שהיה בולט כמין חוטם" -
      // the holes in the bowls' bottoms, straight down; and "אחד מעובה ואחד דק": "ולשון מעובה משמע ששולי הספל היו עבים ומתוך כך אין
      // המשקה ממהר לצאת" - one bowl's bottom thick, the holes alike. Which bowl Tosafot do not say: THICK - the water's, as the water is the
      // one that runs out fast ("שהמים ממהרים לצאת", Rashi 48b, from the Gemara's "חמרא סמיך מיא קליש"), or the wine's - asked of the
      // user, 18.11.2026
      const THICK = 0;   // the index in BX: 0 the water's (western), 1 the wine's (eastern)
      BX.forEach((x, i) => {
        let floorY = TOP + 0.05;
        if (i === THICK) {
          const thick = 0.09;
          H2.cyl(sfT, 0.288, 0.216, thick, sil, x, TOP + 0.05, BZ, 20);   // the thick bottom: fills the bowl's foot
          floorY += thick;
        }
        const hr = 0.045;
        H2.cyl(sfT, hr, hr, 0.008, dark, x, floorY, BZ, 16);
        way(wayT, x, BZ, hr, TOP + 0.05);
      });
      ctx2.shared.sfalim = { mode: "rashi", set(m) { this.mode = m === "tosafot" ? "tosafot" : "rashi"; sfR.visible = this.mode === "rashi"; sfT.visible = this.mode === "tosafot"; } };
      ctx2.labels.push({ text: "ספלי הניסוך — מים (מערבי) ויין (מזרחי)", x: 43.5, y: TOP + 1.1, z: 9.4, size: 0.8, layer: "altarBody32" },
        { text: "ספלי הניסוך — מים (מערבי) ויין (מזרחי)", x: 47.5, y: TOP + 1.1, z: 5.4, size: 0.8, layer: "altarBody28" });
      const SHITIN_SEE = "השיתין — ״חלל שתחת המזבח כנגד מקום הנסכים״ (רש״י סוכה מט.)";   // apart from the yesod's "שני הנקבים... והן הנקראין שיתין" (SHITIN_LABEL, below: the Rambam's name for the yesod's two holes)
      // drawn on top (l.onTop): it stands in the hollow, and the stone round the glass would hide most of it
      ctx2.labels.push({ text: SHITIN_SEE, x: 43.8, y: F - 5.6, z: 9.6, size: 0.62, layers: ["sfalimSee", "altarBody32"], moveWithAltar: true, onTop: true },
        { text: SHITIN_SEE, x: 47.8, y: F - 5.6, z: 5.6, size: 0.62, layers: ["sfalimSee", "altarBody28"], moveWithAltar: true, onTop: true });
      // SFALIM_303: SFSEE - THE CORNER AS GLASS (ctx2.shared.features.sfalimSee; the place "ספלי הניסוך", 70-ui.js - on while it shows).
      // A box round the south-west corner, from under the shitin to over the horn (C, in sfG's frame: R. Yose's altar and the Tannaim's
      // places move it with the bowls). Every plain box of the altar and of the court's floor that meets it is drawn with a clone of its
      // material that leaves the box out (LULHOLE's way, 50-heichal.js). Inside the box, built anew each time from those boxes: the glass -
      // only the outer surface of their union (a face, or the part of it, that lies against another box is not drawn: nine faces lay one
      // over another under the bowls, and the glass came out all but opaque) - with its edges; and on the box's own faces, where they lie in
      // stone, the cut, facing into the box: from outside the near ones are not seen, the far ones are the cut stone - and under the
      // floor's slab the hollow's dark walls. The ways down of the reading shown go from the holes to the hollow.
      const SFSEE = (() => {
        const C = { x0: 40.7, x1: 45.3, y0: F - 7, y1: TOP + 1.3, z0: 8.3, z1: 12.3 };
        const outP = [];
        for (let k = 0; k < 6; k++) outP.push(new Plane(new Vector3(1, 0, 0), 1e7));
        const seeW = new Group();
        seeW.name = "sfalimSee";
        seeW.visible = false;
        ctx2.root.add(seeW);
        const flag = new Group();   // the layer of the shitin's label
        flag.visible = false;
        ctx2.layers.sfalimSee = flag;
        const ghostM = new MeshBasicMaterial({ color: 0xF1E9D6, transparent: true, opacity: 0.15, depthWrite: false, side: DoubleSide });
        const edgeM = new LineBasicMaterial({ color: 0x5e4a2e, transparent: true, opacity: 0.8, depthWrite: false });
        const pitM = new MeshBasicMaterial({ vertexColors: true });
        const clones = new Map();
        const Cw = new Box3(), tmp = new Vector3();
        const noRay = () => {};
        let on = false, paused = false, live = [];
        const setPlanes = () => {
          ctx2.root.updateMatrixWorld(true);
          Cw.min.copy(sfG.localToWorld(tmp.set(C.x0, C.y0, C.z0)));
          Cw.max.copy(sfG.localToWorld(tmp.set(C.x1, C.y1, C.z1)));
          const n = [[-1, 0, 0, Cw.min.x], [1, 0, 0, -Cw.max.x], [0, -1, 0, Cw.min.y], [0, 1, 0, -Cw.max.y], [0, 0, -1, Cw.min.z], [0, 0, 1, -Cw.max.z]];
          n.forEach(([a, b, c, d], k) => {
            outP[k].normal.set(a, b, c);
            outP[k].constant = d;
          });
        };
        // the boxes that meet C: plain boxes of the altar and of the courts, opaque, shown, not the bowls' own
        const cands = () => {
          const out = [];
          for (const top of ctx2.root.children) {
            if (top.name !== "altar" && top.name !== "courts") continue;
            top.traverse((o) => {
              if (!o.isMesh || o.isInstancedMesh || !o.geometry || o.geometry.type !== "BoxGeometry" || Array.isArray(o.material)) return;
              for (let p = o; p; p = p.parent) if (p === sfG || !p.visible) return;
              const m = o.material;
              if (!m || m.transparent || !(m.isMeshStandardMaterial || m.isMeshLambertMaterial || m.isMeshPhongMaterial)) return;
              if (!o.geometry.boundingBox) o.geometry.computeBoundingBox();
              const b = o.geometry.boundingBox.clone().applyMatrix4(o.matrixWorld), e = 1e-3;
              if (b.max.x <= Cw.min.x + e || b.min.x >= Cw.max.x - e || b.max.y <= Cw.min.y + e || b.min.y >= Cw.max.y - e || b.max.z <= Cw.min.z + e || b.min.z >= Cw.max.z - e) return;
              out.push([o, b]);
            });
          }
          return out;
        };
        const cutOf = (m) => {
          const orig = m.userData && m.userData.__sfseeOrig ? m.userData.__sfseeOrig : m;
          let c = clones.get(orig);
          if (!c) {
            c = orig.clone();
            c.clippingPlanes = outP;
            c.clipIntersection = true;
            c.userData = Object.assign({}, orig.userData, { __sfseeOrig: orig });
            clones.set(orig, c);
          }
          return c;
        };
        // quads on axis-aligned planes: axis a ("x" | "y" | "z") at v, over [u0, u1] x [w0, w1] of the other two (x: z, y; y: x, z; z: x, y),
        // facing sign sg along a; texture coordinates in amot (as uvWorldBox)
        const OTHER = { x: ["z", "y"], y: ["x", "z"], z: ["x", "y"] };
        const quads = () => ({ pos: [], nrm: [], uv: [], col: [] });
        const PT = (a, v, u, w) => (a === "x" ? [v, w, u] : a === "y" ? [u, v, w] : [u, w, v]);
        const quad = (q, a, v, u0, u1, w0, w1, sg, colY) => {
          const c = [PT(a, v, u0, w0), PT(a, v, u1, w0), PT(a, v, u1, w1), PT(a, v, u0, w1)], t = [[u0, w0], [u1, w0], [u1, w1], [u0, w1]];
          const nat = a === "z" ? 1 : -1, n = a === "x" ? [sg, 0, 0] : a === "y" ? [0, sg, 0] : [0, 0, sg];
          for (const k of sg === nat ? [0, 1, 2, 0, 2, 3] : [0, 2, 1, 0, 3, 2]) {
            q.pos.push(...c[k]);
            q.nrm.push(...n);
            q.uv.push(...t[k]);
            if (colY) q.col.push(...colY(c[k][1]));
          }
        };
        const mesh = (q, mat) => {
          const g = new BufferGeometry();
          g.setAttribute("position", new Float32BufferAttribute(q.pos, 3));
          g.setAttribute("normal", new Float32BufferAttribute(q.nrm, 3));
          g.setAttribute("uv", new Float32BufferAttribute(q.uv, 2));
          if (q.col.length) g.setAttribute("color", new Float32BufferAttribute(q.col, 3));
          const m = new Mesh(g, mat);
          m.castShadow = m.receiveShadow = false;
          m.raycast = noRay;
          m.userData.noPick = true;
          m.userData.__sfseeOwn = true;
          seeW.add(m);
          return m;
        };
        // the cuts of [lo, hi] along axis ax by the boxes' sides, sorted
        const cuts = (boxes, ax, lo, hi, skip) => {
          const t = [lo, hi];
          boxes.forEach((o, i) => {
            if (i === skip) return;
            for (const x of [o.min[ax], o.max[ax]]) if (x > lo + 1e-4 && x < hi - 1e-4) t.push(x);
          });
          return Array.from(new Set(t.map((x) => Math.round(x * 1e4) / 1e4))).sort((x, y) => x - y);
        };
        const inBox = (o, p) => p.x > o.min.x + 1e-4 && p.x < o.max.x - 1e-4 && p.y > o.min.y + 1e-4 && p.y < o.max.y - 1e-4 && p.z > o.min.z + 1e-4 && p.z < o.max.z - 1e-4;
        const pitCol = (y) => {   // the hollow's walls: dark brown under the slab, black at the bottom
          const t = Math.max(0, Math.min(1, (y - Cw.min.y) / Math.max(0.01, DOWN - Cw.min.y))), k = t * t;
          return [0.015 + 0.2 * k, 0.011 + 0.15 * k, 0.008 + 0.1 * k];
        };
        const build = (list) => {
          const boxes = list.map((x) => x[1]), mats = list.map((x) => x[2]), pit = boxes.map((b) => b.max.y <= DOWN + 0.05);   // the courts' fill: the hollow
          const P = new Vector3(), G = quads(), E = [];
          // the glass: each face of each box, inside C, cell by cell between the other boxes' sides; a cell is drawn when the point just
          // outside it lies in no other box; its edges where the next cell of the face is not drawn (or the face ends)
          boxes.forEach((b, i) => {
            if (pit[i]) return;
            for (const a of ["x", "y", "z"]) for (const s of [-1, 1]) {
              const v = s > 0 ? b.max[a] : b.min[a];
              if (v <= Cw.min[a] + 1e-4 || v >= Cw.max[a] - 1e-4) continue;
              const [ua, wa] = OTHER[a];
              const u0 = Math.max(b.min[ua], Cw.min[ua]), u1 = Math.min(b.max[ua], Cw.max[ua]), w0 = Math.max(b.min[wa], Cw.min[wa]), w1 = Math.min(b.max[wa], Cw.max[wa]);
              if (u1 - u0 < 1e-3 || w1 - w0 < 1e-3) continue;
              const us = cuts(boxes, ua, u0, u1, i), ws = cuts(boxes, wa, w0, w1, i);
              const ex = us.slice(1).map((_, j) => ws.slice(1).map((__, k) => {
                P[a] = v + s * 0.003;
                P[ua] = (us[j] + us[j + 1]) / 2;
                P[wa] = (ws[k] + ws[k + 1]) / 2;
                return !boxes.some((o, m) => m !== i && inBox(o, P));
              }));
              const X = (j, k) => j >= 0 && k >= 0 && j < ex.length && k < ex[0].length && ex[j][k];
              for (let j = 0; j < ex.length; j++) for (let k = 0; k < ex[0].length; k++) {
                if (!ex[j][k]) continue;
                quad(G, a, v, us[j], us[j + 1], ws[k], ws[k + 1], s);
                if (!X(j - 1, k)) E.push(PT(a, v, us[j], ws[k]), PT(a, v, us[j], ws[k + 1]));
                if (!X(j + 1, k)) E.push(PT(a, v, us[j + 1], ws[k]), PT(a, v, us[j + 1], ws[k + 1]));
                if (!X(j, k - 1)) E.push(PT(a, v, us[j], ws[k]), PT(a, v, us[j + 1], ws[k]));
                if (!X(j, k + 1)) E.push(PT(a, v, us[j], ws[k + 1]), PT(a, v, us[j + 1], ws[k + 1]));
              }
            }
          });
          if (G.pos.length) mesh(G, ghostM).renderOrder = 3;
          if (E.length) {
            const eg = new BufferGeometry();
            eg.setAttribute("position", new Float32BufferAttribute(E.flat(), 3));
            const el = new LineSegments(eg, edgeM);
            el.raycast = noRay;
            el.userData.noPick = true;
            el.userData.__sfseeOwn = true;
            el.renderOrder = 4;
            seeW.add(el);
          }
          // the cut: on each face of C, the boxes that cross it, cell by cell; a cell takes the smallest box that holds it (the sovev's
          // slab over the body), so that no two plates lie one on another
          const byMat = new Map(), PQ = quads();
          for (const [a, v, s] of [["x", Cw.min.x, 1], ["x", Cw.max.x, -1], ["z", Cw.min.z, 1], ["z", Cw.max.z, -1], ["y", Cw.min.y, 1], ["y", Cw.max.y, -1]]) {
            const cross = [];
            boxes.forEach((o, i) => { if (o.min[a] < v - 1e-4 && o.max[a] > v + 1e-4) cross.push(i); });
            if (!cross.length) continue;
            const [ua, wa] = OTHER[a];
            const sub = cross.map((i) => boxes[i]);
            const us = cuts(sub, ua, Cw.min[ua], Cw.max[ua], -1), ws = cuts(sub, wa, Cw.min[wa], Cw.max[wa], -1);
            for (let j = 0; j + 1 < us.length; j++) for (let k = 0; k + 1 < ws.length; k++) {
              P[a] = v;
              P[ua] = (us[j] + us[j + 1]) / 2;
              P[wa] = (ws[k] + ws[k + 1]) / 2;
              let best = -1, bv = Infinity;
              for (const i of cross) {
                const o = boxes[i];
                if (!(P[ua] > o.min[ua] && P[ua] < o.max[ua] && P[wa] > o.min[wa] && P[wa] < o.max[wa])) continue;
                const vol = (o.max.x - o.min.x) * (o.max.y - o.min.y) * (o.max.z - o.min.z);
                if (vol < bv) { bv = vol; best = i; }
              }
              if (best < 0) continue;
              if (pit[best]) quad(PQ, a, v, us[j], us[j + 1], ws[k], ws[k + 1], s, pitCol);
              else {
                if (!byMat.has(mats[best])) byMat.set(mats[best], quads());
                quad(byMat.get(mats[best]), a, v, us[j], us[j + 1], ws[k], ws[k + 1], s);
              }
            }
          }
          for (const [m, q] of byMat) mesh(q, m);
          if (PQ.pos.length) mesh(PQ, pitM);
        };
        const show = () => {
          setPlanes();
          for (const c of clones.values()) { c.clippingPlanes = outP; c.clipIntersection = true; }   // after a section (it gives null back)
          ghostM.side = DoubleSide;
          if (ctx2.renderer && !ctx2.renderer.localClippingEnabled) ctx2.renderer.localClippingEnabled = true;
          const list = [];
          for (const [o, b] of cands()) {
            const m = o.material;
            live.push([o, m]);
            o.material = cutOf(m);
            list.push([o, b, o.material.userData.__sfseeOrig]);
          }
          build(list);
          seeW.visible = flag.visible = wayR.visible = wayT.visible = true;
        };
        const hide = () => {
          for (const [o, m] of live) if (o.material && o.material.userData && o.material.userData.__sfseeOrig) o.material = m;
          live = [];
          for (const c of seeW.children.slice()) {
            seeW.remove(c);
            if (c.userData.__sfseeOwn && c.geometry) c.geometry.dispose();
          }
          seeW.visible = flag.visible = wayR.visible = wayT.visible = false;
        };
        // a section (90-entry.js) gives every material its own plane and takes it back as null: while it is on the corner is whole
        ctx2.animated.push(() => {
          if (!on) return;
          const S = ctx2.shared.section;
          if (S && S.on) { if (!paused) { paused = true; hide(); } return; }
          if (paused) { paused = false; show(); }
        });
        // the programs, compiled with the rest at load (the renderer's compile walks the hidden objects too): the glass, the edges, the
        // hollow's walls and the cut clone of each material the corner meets now (the 32 body; R. Yose's is of the same materials)
        if (ctx2.renderer) ctx2.renderer.localClippingEnabled = true;
        {
          const warm = new Group();
          warm.name = "sfalimSeeWarm";
          warm.visible = false;
          ctx2.root.add(warm);
          setPlanes();
          const tg = new BoxGeometry(0.01, 0.01, 0.01);
          for (const [o] of cands()) warm.add(new Mesh(tg, cutOf(o.material)));
          warm.add(new Mesh(tg, ghostM));
          warm.add(new LineSegments(new EdgesGeometry(tg), edgeM));
          const pg = new BoxGeometry(0.01, 0.01, 0.01);
          pg.setAttribute("color", new Float32BufferAttribute(new Float32Array(pg.attributes.position.count * 3), 3));
          warm.add(new Mesh(pg, pitM));
        }
        ctx2.shared.features = ctx2.shared.features || {};
        ctx2.shared.features.sfalimSee = { key: "sfalimSee", timed: false, isOn: () => on,
          on: () => { if (on) return; on = true; paused = false; show(); },
          off: () => { if (!on) return; on = false; paused = false; hide(); } };
        // ctx.shared.sfalimSee: refresh() after the bowls moved; set(v) / on - the presentation's way to a place's feature (75-tour.js featureOf)
        const FS = ctx2.shared.features.sfalimSee;
        return { refresh: () => { if (on && !paused) { hide(); show(); } }, set: (v) => (v ? FS.on() : FS.off()), get on() { return on; } };
      })();
      ctx2.shared.sfalimSee = SFSEE;
    }
