  // ===== PEOPLE_KIT_204 BEGIN - THE SANHEDRIN'S FIGURES (one text, the same in both houses' 30-courts.js; tools204/people_204.py).
  // The user, 12.11.2026 01:41: "תעשה סנהדרין בשתי הבתים, הגוף אותו גוף רק יושב, [כעין] שמלה שחורה כזאת וכיפה, זקן לבן לכולם, חוץ
  // מהשורה היותר חיצונית ... בעצם הזקנים הכי בפנים לבן, האמצעי אפור והעליון שחור חום"; 01:42: "אלו שמולם בלי זקן בכלל. אבל צורה
  // חרדית כזאת, אבל לא חרדית קלאסית. רק בנראות של הפרצוף." He was told (01:46): in the model the seventy-one sit in ONE row and
  // the three inner rows are the students (Sanhedrin 4:4), so the beards' colours go ALONG the judges' row by the nearness to the
  // Nasi - "ושאר השבעים יושבין לפניו כפי שניהם וכפי מעלתם" (the Rambam, Sanhedrin 1:3; qa/fs/LIB_1111.md) - white by him, grey
  // further, black-brown at the row's two ends; the students - no beard, a kippah and peyot; the two scribes stand, grey-bearded.
  // THE BODY is the lottery's priest's (the Second House's 55-payis.js, PAYIS_FIGURE4: the head, the face, the beard - one body -
  // and the robe's breadth at each height), sitting, in a black robe and a kippah, with far fewer faces: the figures are small
  // (seventy-one in one row in the hall) and many, so every part is one InstancedMesh, and from afar a plain figure stands in.
  // tm_people(ctx).crowd(parent, pts, o): pts [[x, z, yaw] ...] in the parent's frame (yaw 0: the face to +z); o = { y, s (the
  // scale: figure units to amot), pose "bench" | "ground" | "stand", seat (the bench's height, amot), kind "judge" | "student" |
  // "scribe", tone (i) => 0 white | 1 grey | 2 black-brown, big (the index of the one a little larger), fwd (amot forward, to the
  // bench's front edge), name, shadow }.
  // MODEL CHOICES: the figures' size, their faces, the robe, the scribes' tablets, the beards' colours and lengths.
  // PEOPLE_KIT_205 (12.11.2026 12:11, the user: "הכל נהיה איטי בטירוף"): measured against 2.0.3 - the 700 full figures were drawn
  // (and cast shadows) from 150 amot, under closed roofs too: +160,000 to +350,000 triangles in every view inside the courts.
  // Now THREE levels by the eye's distance from the crowd: full (within ~22 amot), plain (~300 triangles: the same robe, head, face,
  // beard and kippah - to ~120 amot), a peg beyond; no figure casts a shadow; the full figure itself has fewer faces.
  function tm_people(ctx) {
    if (ctx.__tmPeople) return ctx.__tmPeople;
    const TAU = Math.PI * 2;
    const rnd = (() => { let q = 20261113; return () => { q = (q * 1664525 + 1013904223) >>> 0; return q / 4294967296; }; })();   // a fixed sequence
    const sstep = (a, b, x) => { const t = Math.max(0, Math.min(1, (x - a) / (b - a))); return t * t * (3 - 2 * t); };
    const spl = (tab, x) => {
      let i = 0;
      while (i < tab.length - 2 && x > tab[i + 1][0]) i++;
      const p0 = tab[Math.max(0, i - 1)], p1 = tab[i], p2 = tab[i + 1], p3 = tab[Math.min(tab.length - 1, i + 2)];
      const d = p2[0] - p1[0], t = Math.max(0, Math.min(1, (x - p1[0]) / d));
      const m1 = (p2[1] - p0[1]) / (p2[0] - p0[0]) * d, m2 = (p3[1] - p1[1]) / (p3[0] - p1[0]) * d, t2 = t * t, t3 = t2 * t;
      return (2 * t3 - 3 * t2 + 1) * p1[1] + (t3 - 2 * t2 + t) * m1 + (-2 * t3 + 3 * t2) * p2[1] + (t3 - t2) * m2;
    };
    // a surface P(u, v) - u goes round (`open`: a strip, not closed), v goes along - with uv, a shade per vertex (o.c) and smooth normals
    const surf = (nu, nv, fn, open) => {
      const pos = [], uv = [], col = [], idx = [], o = { x: 0, y: 0, z: 0, c: 1 };
      for (let j = 0; j <= nv; j++) for (let i = 0; i <= nu; i++) {
        o.c = 1;
        fn(i === nu && !open ? 0 : i / nu, j / nv, o);
        pos.push(o.x, o.y, o.z);
        uv.push(i / nu, j / nv);
        col.push(o.c, o.c, o.c);
      }
      for (let j = 0; j < nv; j++) for (let i = 0; i < nu; i++) {
        const a = j * (nu + 1) + i, b = a + 1, c = a + nu + 1, d = c + 1;
        idx.push(a, b, c, b, d, c);
      }
      const q = new BufferGeometry();
      q.setAttribute("position", new Float32BufferAttribute(pos, 3));
      q.setAttribute("uv", new Float32BufferAttribute(uv, 2));
      q.setAttribute("color", new Float32BufferAttribute(col, 3));
      q.setIndex(idx);
      q.computeVertexNormals();
      if (!open) {
        const n = q.attributes.normal;
        for (let j = 0; j <= nv; j++) {
          const a = j * (nu + 1), b = a + nu, x = n.getX(a) + n.getX(b), y = n.getY(a) + n.getY(b), z = n.getZ(a) + n.getZ(b), l = Math.hypot(x, y, z) || 1;
          n.setXYZ(a, x / l, y / l, z / l);
          n.setXYZ(b, x / l, y / l, z / l);
        }
      }
      return q;
    };
    const shade = (q, c) => { q.setAttribute("color", new Float32BufferAttribute(new Float32Array(q.attributes.position.count * 3).fill(c), 3)); return q; };
    const tint = (q, c) => {
      const n = q.attributes.position.count, a = new Float32Array(n * 3);
      for (let i = 0; i < n; i++) { a[i * 3] = c.r; a[i * 3 + 1] = c.g; a[i * 3 + 2] = c.b; }
      q.setAttribute("color", new Float32BufferAttribute(a, 3));
      return q;
    };
    const sph = (sx, sy, sz, ws, hs, ps, pl, ts, tl) => {
      const q = new SphereGeometry(1, ws, hs, ps === undefined ? 0 : ps, pl === undefined ? TAU : pl, ts === undefined ? 0 : ts, tl === undefined ? Math.PI : tl);
      q.scale(sx, sy, sz);
      return q;
    };
    const at = (q, x, y, z) => { q.translate(x, y, z); return q; };
    const rot = (q, rx, ry, rz) => { if (rz) q.rotateZ(rz); if (rx) q.rotateX(rx); if (ry) q.rotateY(ry); return q; };
    const flatUV = (q, u, v) => { const a = q.attributes.uv; for (let i = 0; i < a.count; i++) a.setXY(i, u, v); return q; };
    // a tube from p0 (radius r0) to p1 (radius r1), its ends open
    const limb = (p0, p1, r0, r1, n) => {
      const d = new Vector3(p1[0] - p0[0], p1[1] - p0[1], p1[2] - p0[2]), len = d.length();
      const q = new CylinderGeometry(r1, r0, len, n, 1, true);
      q.applyQuaternion(new Quaternion().setFromUnitVectors(new Vector3(0, 1, 0), d.normalize()));
      q.translate((p0[0] + p1[0]) / 2, (p0[1] + p1[1]) / 2, (p0[2] + p1[2]) / 2);
      return q;
    };
    // ---------- the face's skin (the face's front is at a quarter of the width): the eyes with their lids, the shade about them
    // and by the nose, colour in the cheeks, the mouth; a patch of parchment (the scribes' tablets)
    const texFace = (() => {
      const cv = document.createElement("canvas");
      cv.width = 512;
      cv.height = 256;
      const c = cv.getContext("2d");
      // FACE_A2 (fix-a2; the user: "הפרצוף עצמו קצת נראה כבובה"): the skin as the lotteries' priest's now (priest-kit.js) - less
      // orange, mottled, the sockets, the temples and the hollows under the cheekbones darker, the nose a little redder, the folds
      // from it to the mouth. Model choices.
      c.fillStyle = "#c39a7c";
      c.fillRect(0, 0, 512, 256);
      { const img = c.getImageData(0, 0, 512, 256), d = img.data;
        for (let y = 0; y < 256; y++) for (let x = 0; x < 512; x++) {
          const k = (y * 512 + x) * 4, h = Math.sin(x * 12.9898 + y * 78.233) * 43758.5453, n = (h - Math.floor(h) - 0.5) * 9 + 5 * Math.sin(x * 0.11 + Math.sin(y * 0.09) * 2) * Math.sin(y * 0.13 + x * 0.02);   // (its own noise: the figures' fixed sequence untouched)
          d[k] = Math.max(0, Math.min(255, d[k] + n)); d[k + 1] = Math.max(0, Math.min(255, d[k + 1] + n * 0.85)); d[k + 2] = Math.max(0, Math.min(255, d[k + 2] + n * 0.7));
        }
        c.putImageData(img, 0, 0); }
      const cx = 128, ey = 121;
      const blob = (x, y, rx, ry, col) => {
        const gr = c.createRadialGradient(0, 0, 0, 0, 0, 1);
        gr.addColorStop(0, col);
        gr.addColorStop(1, col.replace(/[\d.]+\)$/, "0)"));
        c.save(); c.translate(x, y); c.scale(rx, ry); c.fillStyle = gr; c.beginPath(); c.arc(0, 0, 1, 0, TAU); c.fill(); c.restore();
      };
      blob(cx, 100, 56, 22, "rgba(222,186,152,0.42)");
      for (const sd of [-1, 1]) {
        const ex = cx + sd * 30.4;
        blob(ex, ey, 24, 15, "rgba(92,52,34,0.28)");                // FACE_A2
        blob(cx + sd * 60, 112, 16, 26, "rgba(96,58,40,0.18)");
        blob(cx + sd * 44, 162, 22, 18, "rgba(96,58,40,0.16)");
        blob(cx + sd * 38, 146, 24, 16, "rgba(196,104,84,0.2)");
        c.strokeStyle = "rgba(110,62,38,0.22)";
        c.lineWidth = 5;
        c.beginPath(); c.moveTo(cx + sd * 10, ey + 2); c.lineTo(cx + sd * 12, 152); c.stroke();
        c.fillStyle = "#e6ddcf";
        c.beginPath(); c.ellipse(ex, ey + 0.5, 8.4, 3.8, 0, 0, TAU); c.fill();
        c.save();
        c.beginPath(); c.ellipse(ex, ey + 0.5, 8.4, 3.8, 0, 0, TAU); c.clip();
        c.fillStyle = "#33210f"; c.beginPath(); c.arc(ex, ey, 4.7, 0, TAU); c.fill();
        c.fillStyle = "#5b4027"; c.beginPath(); c.arc(ex, ey, 3.7, 0, TAU); c.fill();
        c.fillStyle = "#0c0806"; c.beginPath(); c.arc(ex, ey, 2.2, 0, TAU); c.fill();
        c.fillStyle = "#ffffff"; c.beginPath(); c.arc(ex - 1.6, ey - 1.7, 1.1, 0, TAU); c.fill();
        c.restore();
        c.strokeStyle = "rgba(52,30,20,0.95)";
        c.lineWidth = 1.8;
        c.beginPath(); c.ellipse(ex, ey + 0.5, 8.4, 3.8, 0, Math.PI, TAU); c.stroke();
        c.strokeStyle = "rgba(120,78,58,0.6)";
        c.lineWidth = 1;
        c.beginPath(); c.ellipse(ex, ey + 0.5, 8.4, 3.8, 0, 0, Math.PI); c.stroke();
        c.strokeStyle = "rgba(110,70,48,0.35)";
        c.lineWidth = 1.2;
        c.beginPath(); c.ellipse(ex, ey - 2, 9.6, 5, 0, Math.PI * 1.1, Math.PI * 1.9); c.stroke();
      }
      blob(cx, 150, 9, 10, "rgba(186,96,80,0.22)");                // FACE_A2: the nose, and the folds down to the mouth
      c.strokeStyle = "rgba(92,54,38,0.22)";
      c.lineWidth = 3;
      for (const sd of [-1, 1]) { c.beginPath(); c.moveTo(cx + sd * 13, 156); c.quadraticCurveTo(cx + sd * 22, 168, cx + sd * 19, 182); c.stroke(); }
      c.fillStyle = "rgba(143,90,78,0.9)";
      c.beginPath(); c.ellipse(cx, 175, 13, 3.1, 0, 0, TAU); c.fill();
      c.strokeStyle = "rgba(84,40,34,0.85)";
      c.lineWidth = 1.2;
      c.beginPath(); c.moveTo(cx - 13, 174.6); c.quadraticCurveTo(cx, 176.6, cx + 13, 174.6); c.stroke();
      c.fillStyle = "#eadfc4";
      c.fillRect(436, 8, 68, 56);
      const t = new CanvasTexture(cv);
      t.colorSpace = SRGBColorSpace;
      return t;
    })();
    const mCloth = new MeshStandardMaterial({ color: 0x2f2f36, vertexColors: true, roughness: 0.9 });      // the black robe, the kippah, the shoes
    const mSkin = new MeshStandardMaterial({ color: 0xffffff, map: texFace, roughness: 0.8 });
    const mHair = new MeshStandardMaterial({ color: 0xffffff, vertexColors: true, roughness: 0.95, side: DoubleSide });
    const mFar = new MeshStandardMaterial({ color: 0xffffff, vertexColors: true, roughness: 0.9 });
    const TONES = [[0xf4f2ec, 0xe9e6de, 0xfbfaf6, 0xe2dfd6], [0xa8a49b, 0x8e8a82, 0xbab6ad, 0x9a9388], [0x3d2c1f, 0x2e231b, 0x4c3727, 0x36281d], [0x2a1f17, 0x3b2a1c, 0x1f1813, 0x4b3320, 0x5d4129]];
    const SKINS = [0xffffff, 0xf3e7dc, 0xfff3e6, 0xeedccd];
    // ---------- the head (its middle at the origin, the face to +z): an egg, narrower at the chin; the nose and the ears
    const HR = [0.128, 0.16, 0.14], EYE = [0.047, 0.014, 0.1095], HS = 1.045, YJ = -0.118, OFF = 0.96, HEAD_Y = 2.075;
    const headR = (ph, y) => {
      const yn = Math.max(-0.999, Math.min(0.999, y / HR[1])), j = yn < 0 ? yn * yn : 0;
      return Math.sqrt(1 - yn * yn) / Math.hypot(Math.sin(ph) / (HR[0] * (1 - 0.2 * j)), Math.cos(ph) / (HR[2] * (1 - 0.1 * j)));
    };
    const skinPart = (q) => shade(flatUV(q, 0.75, 0.3), 1);
    const headParts = () => {
      const WS = 14, HG = 10, k = new SphereGeometry(1, WS, HG), p = k.attributes.position;
      for (let i = 0; i < p.count; i++) {
        const x = p.getX(i), y = p.getY(i), z = p.getZ(i), j = y < 0 ? y * y : 0;
        p.setXYZ(i, x * HR[0] * (1 - 0.2 * j), y * HR[1], z * HR[2] * (1 - 0.1 * j));
      }
      k.computeVertexNormals();
      const nr = k.attributes.normal;
      for (let j = 0; j <= HG; j++) {
        const a = j * (WS + 1), b = a + WS, x = nr.getX(a) + nr.getX(b), y = nr.getY(a) + nr.getY(b), z = nr.getZ(a) + nr.getZ(b), l = Math.hypot(x, y, z) || 1;
        nr.setXYZ(a, x / l, y / l, z / l);
        nr.setXYZ(b, x / l, y / l, z / l);
      }
      const parts = [shade(k, 1)];
      parts.push(skinPart(at(sph(0.013, 0.034, 0.02, 5, 3), 0, -0.012, 0.133)));
      parts.push(skinPart(at(sph(0.019, 0.017, 0.022, 6, 4), 0, -0.041, 0.146)));
      for (const sd of [-1, 1]) parts.push(skinPart(at(sph(0.012, 0.03, 0.02, 4, 3), sd * 0.126, 0, -0.004)));
      return parts;
    };
    // ---------- the hair. The beard is one body: from the cheeks before the ears and from the jaw, lying on the face, and under
    // the chin it hangs and comes forward to the chest, narrowing; its lower edge uneven
    const beard = (len, w2, nu, nv) => surf(nu || 14, nv || 6, (u, v, o) => {
      const PM = 1.4, a = u * 2 - 1, ph = a * PM, ya = Math.abs(a), sd = 1 - v;
      const yTop = -0.094 + 0.124 * Math.pow(ya, 1.3), yBot = -0.07 - len * (1 - Math.pow(ya, 5)) + 0.008 * Math.sin(6 * ph + w2) * (1 - ya);
      const y = yTop + sd * (yBot - yTop);
      const strand = Math.sin(9 * ph + 3 * sd + w2), th = (0.004 + 0.03 * Math.pow(Math.max(0, Math.sin(Math.PI * Math.min(1, sd * 1.22))), 0.9) + 0.003 * strand) * (1 - Math.pow(ya, 5));
      if (y >= YJ) {
        const r = headR(ph, y) + th;
        o.x = Math.sin(ph) * r;
        o.z = Math.cos(ph) * r;
      } else {
        const k = Math.min(1, (YJ - y) / 0.2), r = headR(ph, YJ) + th + 0.028 * Math.sin(Math.PI * Math.min(1, k * 1.3)) * Math.abs(Math.sin(ph));
        o.x = Math.sin(ph) * r * (1 - 0.08 * k * k);
        o.z = Math.cos(ph) * r * (1 - 0.1 * k) + 0.05 * k * Math.max(0, Math.cos(ph));
      }
      o.y = y;
      o.c = 0.86 + 0.14 * (0.5 + 0.5 * strand) - 0.06 * sd;
    }, true);
    const brows = () => [-1, 1].map((sd) => shade(at(rot(sph(0.027, 0.0058, 0.009, 6, 3), 0, 0, -sd * 0.05), sd * EYE[0], 0.051, 0.1262), 0.72));
    const stache = () => [-1, 1].map((sd) => shade(at(rot(sph(0.037, 0.0125, 0.016, 5, 3), 0, 0, -sd * 0.4), sd * 0.027, -0.066, 0.127), 1));
    // PEOPLE_KIT_211C (the user, 15.11.2026 03:15: "יש בעיה עם שער שלהם הוא לא מקיף את כל הראש"): until now the hair was a crown
    // under the kippah and a band on the BACK half of the head only - the temples and the top of the forehead were bare. Now it
    // goes ROUND the whole head: a fringe under the kippah's front edge, down before the ears to the beard's upper edge (a young
    // man's: to where his peyot hang), over the ears, and behind them down to the nape. hairLow: the hair's lower edge at `a`
    // radians from the middle of the face; hairRing: the band itself, from y0 (under the kippah) down to that edge
    const hairLow = (a, young) => {
      const side = young ? 0.004 : -0.106 + 0.124 * Math.pow(Math.min(1, a / 1.4), 1.3);
      if (a < 1.05) return side + (0.09 - side) * (1 - sstep(0.68, 1.05, a));
      if (a < 1.6) return side + (0.036 - side) * sstep(1.4, 1.47, a);
      return 0.036 - 0.186 * sstep(1.74, 2.05, a);   // behind the ears: down into the neck
    };
    // the rows: from the lower edge up to just under the kippah's rim (yR: the rim is tilted, higher over the forehead), and `hid`
    // more rows, hidden, up under the kippah. At the rim and above it the hair is thin, close on the skin, so that it does not
    // come out through the kippah's few faces; the band's corners stand over the head's own (28 round over its 14; the plain
    // figure's 10, half a step aside, over its 10), so that no corner of the head comes out through the hair
    const hairRing = (young, nu, nv, hid) => surf(nu, nv, (u, v, o) => {
      const j = Math.round(v * nv), m = nv - hid, ph = (u * 2 - 1) * Math.PI + (hid ? 0 : Math.PI / nu), pw = ph > Math.PI ? ph - TAU : ph;
      const yL = hairLow(Math.abs(pw), young), yR = 0.0907 + 0.0178 * Math.cos(ph), w = 1 - Math.min(1, j / m);
      const y = j > m ? yR + (j - m) / hid * (0.128 - yR) : yL + (1 - w) * (yR - yL);
      const r = headR(ph, y) + (j > m ? 0.002 + 0.0015 * (j - m) : j === m ? (hid ? 0.002 : 0.004) : 0.0078 - 0.0118 * w * w * w * w);   // its lower edge sinks into the skin
      o.x = Math.sin(ph) * r;
      o.y = y;
      o.z = Math.cos(ph) * r;
      o.c = 0.9 + 0.05 * Math.sin(13 * ph + 2 * v);
    });
    const hairCap = (young) => [shade(sph(HR[0] * HS, HR[1] * HS, HR[2] * HS, 10, 2, 0, TAU, 0, 0.8), 0.92), hairRing(young, 28, 7, 2)];
    const peyot = () => [-1, 1].flatMap((sd) => [shade(at(sph(0.013, 0.062, 0.016, 5, 4), sd * 0.122, -0.04, 0.05), 0.95), shade(at(sph(0.016, 0.016, 0.016, 5, 3), sd * 0.124, -0.102, 0.054), 1)]);
    // PEOPLE_KIT_211 (the user, 15.11.2026: "כל הפועלים הם כהנים בכל הלשכות"): kind "kohen" - the white robe (o.robe), the hat instead of
    // the kippah, and the sash in its three colours, its two ends hanging in front (the lottery's priest in fewer faces)
    // PEOPLE_KIT_211C: the hat is the lottery priests' migba'at (the Second House's 55-payis.js, PAYIS_FIGURE4D - the shape the
    // user settled there: "tall, a smooth egg rounded at its head", close on the head, down to just above the ears at the sides
    // and behind), in fewer faces, the bands of its cloth only a soft shade. Kind "levi" (the user, 03:16: "לווים לא היו בבגדי
    // כהונה"): the plain robe in the colour given (o.robe) and the plain cap - no hat, no sash
    // MIGBAAT_A2 (fix-a2, 22.11.2026; the user: "המגבעות — לשנות את כולן כמו בחוברת"): the priests' migba'at as the lotteries'
    // priest's now (priest-kit.js MIG) - a tall cone wound with bands, from the start of the hair up, the head's tefillin before it;
    // in fewer faces, and the mid level's without its bands. Until now the egg of PAYIS_FIGURE4D.
    const MIGP = { y0: 0.02, H: 0.38, rx: 0.13, rz: 0.142, top: 0.62, back: -0.014, bands: 6 };
    const hatK = (ws, hs) => at(surf(ws || 32, hs || 30, (u, v, o) => {
      const a = u * TAU + Math.PI, body = 0.84, k = v < body ? v / body : 1, bands = !ws;
      let R = 1 - (1 - MIGP.top) * Math.pow(k, 1.15), y = MIGP.y0 + v * MIGP.H;
      if (v > body) { const w = (v - body) / (1 - body); R = MIGP.top * Math.sqrt(Math.max(0, 1 - w * w)); y = MIGP.y0 + body * MIGP.H + w * MIGP.top * MIGP.rz * 0.9; }
      const t = (((v / body) * MIGP.bands + 0.12 * u) % 1 + 1) % 1, on = bands ? (v < body ? sstep(0, 0.05, v) : 1 - sstep(body, 1, v)) : 0;
      const r = R * (1 + on * (0.055 * (1 - t) * (1 - t) - 0.012));
      o.x = r * MIGP.rx * Math.sin(a);
      o.y = y;
      o.z = r * MIGP.rz * Math.cos(a) + MIGP.back;
      o.c = 1 - on * (Math.exp(-t / 0.08) * 0.32 + 0.06 * Math.pow(t, 3));
    }), 0, 0.06, 0);
    // TEFILLIN_A2 (the user's decision 67): the head's tefillin on the priests and the Levites of a crowd (kind "kohen" / "levi") -
    // the box at the start of the hair, the strap round the head (priest-kit.js gTefR, in fewer faces); their own instanced mesh in
    // the near level, black, hidden by night or on a festival: the reasons in ctx.shared.tefOff, the High Priest's Yom Kippur and the
    // night of the water-drawing (tefOK). The Levite's cap is set back for it (kippahBack).
    const mTefP = new MeshStandardMaterial({ color: 0x111111, roughness: 0.42 });
    const tefG = (HY) => {
      const TY = 0.102, TB = 0.052, zs = HR[2] * Math.sqrt(1 - (TY / HR[1]) * (TY / HR[1])), n = new Vector3(0, TY / (HR[1] * HR[1]), zs / (HR[2] * HR[2])).normalize();
      const tilt = Math.atan2(n.y, n.z), place = (q, d) => { q.rotateX(-tilt); q.translate(0, TY + n.y * d, zs + n.z * d); return q; }, parts = [];
      parts.push(place(new BoxGeometry(TB * 1.22, TB * 1.22, 0.012), 0.008), place(new BoxGeometry(TB, TB, TB), 0.014 + TB / 2));
      const ring = [];
      for (let i = 0; i < 24; i++) { const ph = (i / 24) * TAU, w = 0.5 + 0.5 * Math.cos(ph), y = -0.035 + (TY - TB * 0.42 + 0.035) * w, r = headR(ph, y) + 0.004; ring.push(new Vector3(Math.sin(ph) * r, y, Math.cos(ph) * r)); }
      parts.push(new TubeGeometry(new CatmullRomCurve3(ring, true), 32, 0.0045, 3, true));
      return mergeGeometries(parts.map((q) => { q.deleteAttribute("uv"); return q.translate(0, HY, 0); }));
    };
    const tefOK = () => { const S = ctx.shared || {}; return !(S.tefOff && S.tefOff.size) && !(S.ykEntry && S.ykEntry.on) && !(S.simchaShoeva && S.simchaShoeva.on); };
    // AVNET_305 (the user, 19.11.2026 23:36: "יש בעיה עם האבנט של הכהנים בשמחת בית השואבה הוא לא מה שיצרנו כבר"): the avnet of the
    // lottery's priest (55-payis.js AVNET_211) - one band at the elbows' height ("כנגד אצילי ידיו", Klei HaMikdash 10:1), three turns
    // "כרך על גבי כרך" (8:19), each rounded; its threads twined, their colours melting into one hue - tekhelet, argaman, tola'at shani
    // and white (8:1, 8:13) - or all white in "של בוץ" (Yoma 12b; the row "אבנטו של כהן הדיוט": ctx.shared.peopleAvnet.set). Its own
    // InstancedMesh, near and mid (none from afar). Until 3.0.4: three separate stripes at the waist and two ends hanging before him.
    const AVN = ctx.shared.peopleAvnet || (ctx.shared.peopleAvnet = (() => {
      const weave = (pal, seed) => {   // as the lottery's priest's: fine threads, twined - every row leans the other way
        const cv = document.createElement("canvas");
        cv.width = 256;
        cv.height = 48;
        const c = cv.getContext("2d");
        let q = seed >>> 0;
        const r = () => { q = (q * 1664525 + 1013904223) >>> 0; return q / 4294967296; };
        c.fillStyle = pal[0][0];
        c.fillRect(0, 0, 256, 48);
        const rows = 12, rh = 48 / rows, tot = pal.reduce((t, x) => t + x[1], 0);
        const pick = () => { let x = r() * tot; for (const y of pal) { x -= y[1]; if (x <= 0) return y[0]; } return pal[0][0]; };
        c.lineCap = "round";
        c.lineWidth = 3.1;
        for (let k = 0; k < rows; k++) {
          const lean = (k % 2 ? 1 : -1) * rh * 0.9, y = k * rh;
          for (let x = -8; x < 264; x += 4) {
            c.strokeStyle = pick();
            c.globalAlpha = 0.8 + r() * 0.2;
            for (const dx of [0, 256, -256]) { c.beginPath(); c.moveTo(x + dx, y + 0.6); c.lineTo(x + dx + lean, y + rh - 0.6); c.stroke(); }
          }
        }
        c.globalAlpha = 1;
        const t = new CanvasTexture(cv);
        t.wrapS = t.wrapT = RepeatWrapping;
        t.colorSpace = SRGBColorSpace;
        t.repeat.set(5, 1);
        t.anisotropy = 4;
        return t;
      };
      const mat = (pal, seed) => new MeshStandardMaterial({ color: 0xffffff, map: weave(pal, seed), vertexColors: true, roughness: 0.88 });
      const D = mat([["#3d62ab", 4.2], ["#8e1f34", 3.1], ["#c5432b", 1.3], ["#e6e1d3", 1]], 20261119);
      const Wt = mat([["#f7f5ee", 4], ["#e0dbcc", 3], ["#ffffff", 2], ["#cfc9b7", 1]], 20261120);
      const P = {
        white: false, meshes: [],
        mat() { const Y = ctx.shared.payis; if (Y && Y.avnet) P.white = Y.avnet === "butz"; return P.white ? Wt : D; },
        set(m) { P.white = m === "butz"; const M = P.white ? Wt : D; for (const im of P.meshes) im.material = M; return P.white ? "butz" : "rambam"; }
      };
      return P;
    })());
    const AV0 = 1.312, AV1 = 1.462;   // the lottery's priest's band (SY0, SY1)
    const avnet = (yo, nu, nv) => surf(nu, nv, (u, v, o) => {
      const tv = (v * 3) % 1, e = Math.max(0, Math.sin(Math.PI * tv)) * (0.55 + 0.45 * Math.sin(Math.PI * v));
      const y = AV0 + v * (AV1 - AV0), a = u * TAU + Math.PI, th = 0.004 + 0.017 * Math.pow(e, 0.35);
      o.x = (spl(bX, y) + th) * Math.sin(a);
      o.y = y + yo;
      o.z = (spl(bZ, y) + th) * Math.cos(a);
      o.c = 0.88 + 0.12 * e;
    });
    const kippah = (ws, hs) => shade(at(rot(sph(HR[0] * 1.09, HR[1] * 1.09, HR[2] * 1.09, ws || 10, hs || 3, 0, TAU, 0, 0.99), -0.14), 0, 0.002, -0.004), 0.45);
    const kippahBack = (ws, hs) => shade(at(rot(sph(HR[0] * 1.09, HR[1] * 1.09, HR[2] * 1.09, ws || 10, hs || 3, 0, TAU, 0, 0.9), -0.55), 0, 0.002, -0.006), 0.45);   // TEFILLIN_A2: the Levite's
    // ---------- the body: the robe's breadth and depth at each height of a standing man (the priest's table); a sitting man is
    // the table from OFF up, with the lap before it
    const BODY = [[0.1, 0.207, 0.166], [0.5, 0.205, 0.164], [1.0, 0.201, 0.16], [1.2, 0.199, 0.158], [1.33, 0.193, 0.15], [1.45, 0.197, 0.152], [1.58, 0.216, 0.158], [1.68, 0.244, 0.156], [1.745, 0.264, 0.146], [1.79, 0.242, 0.128], [1.83, 0.186, 0.11], [1.87, 0.116, 0.09], [1.9, 0.076, 0.076]];
    const bX = BODY.map((r) => [r[0], r[1]]), bZ = BODY.map((r) => [r[0], r[2]]);
    const robe = (ys, yo, folds, nu) => surf(nu || 12, ys.length - 1, (u, v, o) => {
      const y = ys[Math.round(v * (ys.length - 1))], a = u * TAU + Math.PI, k = folds ? Math.max(0, (1.3 - y) / 1.2) : 0;
      const fold = Math.sin(3 * a + 0.8) * 0.6 + Math.sin(5 * a + 2.1) * 0.4, m = 1 + 0.03 * k * fold;
      o.x = spl(bX, y) * m * Math.sin(a);
      o.y = y + yo;
      o.z = spl(bZ, y) * m * Math.cos(a);
      o.c = 1 - 0.16 * k * Math.max(0, -fold);
    });
    // the robe over the thighs, round the knees and down to the shoes (a man on a bench; L: the bench's height in the figure's units)
    const lapBench = (L) => {
      const yT = 0.1, zK = 0.3, RK = 0.085, l1 = zK, l2 = RK * Math.PI / 2, l3 = (yT - RK) - (-L + 0.05), tot = l1 + l2 + l3;
      const D = [0, l1 * 0.5, l1, l1 + l2 / 3, l1 + 2 * l2 / 3, l1 + l2, l1 + l2 + l3 * 0.4, l1 + l2 + l3 * 0.75, tot];
      return surf(12, D.length - 1, (u, v, o) => {
        const d = D[Math.round(v * (D.length - 1))], ph = -u * TAU;
        let pz, py, nz, ny;
        if (d <= l1) { pz = d; py = yT; nz = 0; ny = 1; }
        else if (d <= l1 + l2 + 1e-9) { const th = (d - l1) / RK; pz = zK + RK * Math.sin(th); py = yT - RK + RK * Math.cos(th); nz = Math.sin(th); ny = Math.cos(th); }
        else { pz = zK + RK; py = yT - RK - (d - l1 - l2); nz = 1; ny = 0; }
        const k3 = sstep(l1 + l2, tot, d);
        const a = 0.212 - 0.012 * sstep(0, l1 + l2, d) + 0.02 * k3 * k3, b = 0.1 - 0.012 * sstep(l1 * 0.5, l1 + l2, d) + 0.012 * k3 * k3;
        const sx = Math.sin(ph), cx = Math.cos(ph), x = a * sx, g = Math.exp(-(x / 0.06) * (x / 0.06)), fold = Math.sin(5 * ph + 1.3) * k3;
        const r = b * (cx > 0 ? Math.pow(cx, 0.6) * (1 - 0.3 * g) : cx) * (1 + 0.04 * fold);
        o.x = x * (1 + 0.03 * fold);
        o.y = py + ny * r;
        o.z = pz + nz * r;
        o.c = (cx > 0 ? 1 - 0.3 * g : 0.8) - 0.1 * Math.max(0, fold);
      });
    };
    const arm = (S, E, W) => [shade(at(sph(0.074, 0.074, 0.074, 6, 4), S[0], S[1], S[2]), 1), shade(limb(S, E, 0.072, 0.06, 6), 0.95), shade(at(sph(0.06, 0.06, 0.06, 6, 3), E[0], E[1], E[2]), 0.95), shade(limb(E, W, 0.058, 0.048, 6), 0.9)];
    // a hand lying flat: the palm, the fingers a little bent, the thumb at the inner side (sd: the arm's side; dir: its way, from +z)
    const hand = (sd, H, dir) => {
      const q = mergeGeometries([at(sph(0.03, 0.0135, 0.042, 5, 3), 0, 0, 0.04), at(sph(0.027, 0.011, 0.03, 5, 3), 0, -0.006, 0.085), at(sph(0.01, 0.01, 0.024, 4, 2), -sd * 0.03, 0, 0.04)]);
      q.rotateY(dir);
      q.translate(H[0], H[1], H[2]);
      return skinPart(q);
    };
    const cache = {};
    // PEOPLE_KIT_211: `robe` - the robe's own colour (the cap and the far figure go with it); a standing figure holds the tablet
    // and the pen only when it is a scribe (kind "worker": the same body, its two hands before it)
    const clothOf = {};
    const clothMat = (robe) => (robe == null ? mCloth : clothOf[robe] || (clothOf[robe] = (() => { const m = mCloth.clone(); m.color.setHex(robe); return m; })()));
    const build = (pose, L, kind, robeCol, young, noArms) => {   // YOUNG_300: young - a short beard (the young priests of the water-drawing); MUSICIANS_305: noArms
      const key = pose + "|" + L.toFixed(3) + "|" + kind + "|" + (robeCol == null ? "" : robeCol) + (young ? "|young" : "") + (noArms ? "|na" : "");
      if (cache[key]) return cache[key];
      const seated = pose !== "stand", HY = HEAD_Y - (seated ? OFF : 0), SY = 1.728 - (seated ? OFF : 0), cloth = [], skin = [];
      const headT = (q) => at(q, 0, HY, 0);
      if (seated) cloth.push(robe([0.98, 1.13, 1.28, 1.43, 1.58, 1.644, 1.708, 1.772, 1.836, 1.9], -OFF, false));
      else cloth.push(robe([0.1, 0.4, 0.7, 1.0, 1.3, 1.45, 1.58, 1.644, 1.708, 1.772, 1.836, 1.9], 0, true));
      for (const sd of [-1, 1]) {
        if (pose === "bench") {
          for (const q of arm([sd * 0.245, SY - 0.01, 0], [sd * 0.27, 0.43, 0.03], [sd * 0.15, 0.225, 0.26])) cloth.push(q);
          skin.push(hand(sd, [sd * 0.13, 0.2, 0.27], -sd * 0.25));
          cloth.push(shade(at(sph(0.05, 0.032, 0.1, 5, 3), sd * 0.1, -L + 0.032, 0.42), 0.4));                       // the shoes
        } else if (pose === "ground") {
          for (const q of arm([sd * 0.245, SY - 0.01, 0], [sd * 0.285, 0.44, -0.02], [sd * 0.262, 0.225, 0.15])) cloth.push(q);
          skin.push(hand(sd, [sd * 0.25, 0.195, 0.17], sd * 0.1));
          cloth.push(shade(at(sph(0.115, 0.095, 0.14, 6, 4), sd * 0.255, 0.085, 0.2), 1));                           // the knees under the robe
        } else {
          // (a man facing +z: his left is at +x) the left hand under the tablet, the right hand on it with the pen
          const W = sd > 0 ? [0.11, 1.4, 0.25] : [-0.1, 1.46, 0.27];
          if (!noArms) for (const q of arm([sd * 0.25, SY - 0.01, 0], [sd * 0.275, 1.4, 0.02], W)) cloth.push(q);   // MUSICIANS_305
          if (!noArms) skin.push(hand(sd, sd > 0 ? [0.1, 1.395, 0.26] : [-0.09, 1.475, 0.27], -sd * 0.3));
          cloth.push(shade(at(sph(0.05, 0.03, 0.1, 5, 3), sd * 0.1, 0.03, 0.07), 0.4));
        }
      }
      if (pose === "bench") cloth.push(lapBench(L));
      else if (pose === "ground") cloth.push(shade(at(sph(0.3, 0.115, 0.24, 10, 4), 0, 0.075, 0.17), 0.8));         // the robe over the crossed legs
      else if (kind === "scribe") {
        skin.push(shade(flatUV(at(rot(new BoxGeometry(0.21, 0.016, 0.27), -0.5), 0.01, 1.455, 0.37), 0.92, 0.86), 1));   // the scribe's tablet ("וכותבין", Sanhedrin 4:3)
        cloth.push(shade(limb([-0.07, 1.5, 0.36], [-0.11, 1.6, 0.33], 0.006, 0.004, 5), 0.5));                          // and his pen
      }
      cloth.push(headT(kind === "kohen" ? hatK() : kind === "levi" ? kippahBack(14, 3) : kippah(14, 3)));
      const avG = kind === "kohen" ? avnet(seated ? -OFF : 0, 40, 12) : null;   // AVNET_305
      for (const q of headParts()) skin.push(headT(q));
      skin.push(skinPart(at(new CylinderGeometry(0.066, 0.072, 0.1, 8, 1, true), 0, HY - 0.15, 0)));
      const base = () => brows().concat(hairCap(kind === "student")).map(headT);
      const hair = kind === "student"
        ? [mergeGeometries(base().concat(peyot().map(headT)))]
        : (young ? [[0.05, 2.0]] : [[0.25, 1.1], [0.19, 3.3], [0.14, 5.2]]).map(([len, w2]) => mergeGeometries(base().concat(stache().map(headT), [headT(beard(len, w2))])));
      // PEOPLE_KIT_205 - the plain figure (from ~22 amot): the same body in a few faces - the robe, the lap, the arms, the kippah; the
      // head with its painted face; the beard (or a young man's hair and peyot) in its own colour
      const mc = [], ms = [], mh = [];
      mc.push(robe(seated ? [0.98, 1.3, 1.58, 1.745, 1.9] : [0.1, 0.7, 1.3, 1.58, 1.745, 1.9], seated ? -OFF : 0, false, 8));
      if (pose === "bench") {
        mc.push(shade(at(new BoxGeometry(0.4, 0.19, 0.46), 0, 0.105, 0.2), 0.95));
        mc.push(shade(at(new BoxGeometry(0.38, L, 0.17), 0, -L / 2 + 0.06, 0.385), 0.88));
      } else if (pose === "ground") mc.push(shade(at(sph(0.36, 0.115, 0.26, 8, 3), 0, 0.075, 0.17), 0.85));
      for (const sd of [-1, 1]) {
        const E = pose === "bench" ? [sd * 0.27, 0.43, 0.03] : pose === "ground" ? [sd * 0.285, 0.44, -0.02] : [sd * 0.275, 1.4, 0.02];
        const W = pose === "bench" ? [sd * 0.15, 0.225, 0.26] : pose === "ground" ? [sd * 0.262, 0.225, 0.15] : (sd > 0 ? [0.11, 1.4, 0.25] : [-0.1, 1.46, 0.27]);
        if (!noArms) mc.push(shade(limb([sd * 0.245, SY - 0.01, 0], E, 0.074, 0.06, 5), 0.95));
        if (!noArms) mc.push(shade(limb(E, W, 0.058, 0.048, 5), 0.9));
        if (!noArms) ms.push(skinPart(at(sph(0.032, 0.016, 0.05, 4, 3), W[0] - sd * 0.02, W[1] - 0.02, W[2] + 0.05)));
      }
      if (pose === "stand" && kind === "scribe") ms.push(shade(flatUV(at(rot(new BoxGeometry(0.21, 0.016, 0.27), -0.5), 0.01, 1.455, 0.37), 0.92, 0.86), 1));
      mc.push(headT(kind === "kohen" ? hatK(8, 6) : kind === "levi" ? kippahBack(10, 2) : kippah(10, 2)));
      const avM = kind === "kohen" ? avnet(seated ? -OFF : 0, 16, 9) : null;   // AVNET_305
      {
        const k = new SphereGeometry(1, 10, 6), p = k.attributes.position;
        for (let i = 0; i < p.count; i++) { const x = p.getX(i), y = p.getY(i), z = p.getZ(i), j = y < 0 ? y * y : 0; p.setXYZ(i, x * HR[0] * (1 - 0.2 * j), y * HR[1], z * HR[2] * (1 - 0.1 * j)); }
        k.computeVertexNormals();
        ms.push(headT(shade(k, 1)));
      }
      mh.push(headT(hairRing(kind === "student", 10, 3, 0)));   // PEOPLE_KIT_211C: the hair round the head, in a few faces
      if (kind === "student") {
        mh.push(headT(shade(sph(HR[0] * HS, HR[1] * HS, HR[2] * HS, 8, 2, 0, TAU, 0, 0.8), 0.92)));
        for (const sd of [-1, 1]) mh.push(headT(shade(at(sph(0.015, 0.07, 0.018, 4, 3), sd * 0.123, -0.05, 0.05), 0.95)));
      } else mh.push(headT(beard(young ? 0.05 : 0.2, 2.2, 8, 3)));
      const mid = { cloth: mergeGeometries(mc), skin: mergeGeometries(ms), hair: mergeGeometries(mh), avnet: avM };
      // from afar: the robe, the head and the kippah, plain
      const cR = robeCol == null ? new Color(0x26262c) : new Color(robeCol).multiplyScalar(0.9), cS = new Color(0xcfa07a), cK = robeCol == null ? new Color(0x121215) : new Color(robeCol).multiplyScalar(0.97), far = [];
      if (!seated) far.push(tint(at(new CylinderGeometry(0.17, 0.21, 1.8, 6), 0, 1.0, 0), cR));
      else {
        far.push(tint(at(new CylinderGeometry(0.16, 0.2, 0.9, 6), 0, 0.45, 0), cR));
        if (pose === "bench") {
          far.push(tint(at(new BoxGeometry(0.42, 0.2, 0.5), 0, 0.1, 0.22), cR));
          far.push(tint(at(new BoxGeometry(0.4, L, 0.19), 0, -L / 2 + 0.05, 0.39), cR));
        } else far.push(tint(at(sph(0.36, 0.12, 0.27, 6, 3), 0, 0.07, 0.17), cR));
      }
      far.push(tint(at(sph(HR[0], HR[1], HR[2], 6, 4), 0, HY, 0), cS));
      far.push(tint(at(sph(HR[0] * 1.09, HR[1] * 1.09, HR[2] * 1.09, 6, 2, 0, TAU, 0, 0.92), 0, HY, -0.004), cK));
      return (cache[key] = { cloth: mergeGeometries(cloth), skin: mergeGeometries(skin), hair, mid, far: mergeGeometries(far), avnet: avG, tef: kind === "kohen" || kind === "levi" ? tefG(HY) : null });   // TEFILLIN_A2
    };
    const LOD = [], m4 = new Matrix4(), qt = new Quaternion(), sc = new Vector3(), ps = new Vector3(), up = new Vector3(0, 1, 0), c3 = new Color(), wp = new Vector3();
    const crowd = (parent, pts, o) => {
      const n = pts.length, L = o.pose === "bench" ? o.seat / o.s : 0, G = build(o.pose, L, o.kind, o.robe, !!o.young, o.arms === false), mCl0 = clothMat(o.robe);
      const near = new Group(), mid = new Group(), far = new Group(), anchor = new Group();
      const mk = (g, m) => { const im = new InstancedMesh(g, m, n); im.castShadow = false; im.receiveShadow = true; im.userData.noPick = true; if (o.name) im.name = o.name; return im; };   // (PEOPLE_KIT_205: no figure casts a shadow)
      const cloth = mk(G.cloth, mCl0), skin = mk(G.skin, mSkin), hairs = G.hair.map((g) => mk(g, mHair)), cnt = hairs.map(() => 0), fm = mk(G.far, mFar);
      const mCl = mk(G.mid.cloth, mCl0), mSk = mk(G.mid.skin, mSkin), mHr = mk(G.mid.hair, mHair);
      const avN = G.avnet ? mk(G.avnet, AVN.mat()) : null, avD = G.mid.avnet ? mk(G.mid.avnet, AVN.mat()) : null;   // AVNET_305
      const tef = G.tef ? mk(G.tef, mTefP) : null;   // TEFILLIN_A2
      if (avN) AVN.meshes.push(avN, avD);
      let ax = 0, az = 0;
      for (const p of pts) { ax += p[0] / n; az += p[1] / n; }
      let R = 0;
      const slots = [];   // MUSICIANS_305: each figure's hair - its mesh and place there
      pts.forEach(([x, z, yaw], i) => {
        const big = o.big === i, j0 = big ? 0 : rnd(), s = o.s * (big ? 1.08 : o.exact ? 1 : 0.97 + j0 * 0.06), fw = o.fwd || 0;   // NAZIR_LOCKS_211: o.exact - the size and the turn as given
        const jy = (rnd() - 0.5) * (o.pose === "bench" ? 0.16 : 0.3);
        qt.setFromAxisAngle(up, yaw + (o.exact ? 0 : jy));
        m4.compose(ps.set(x + Math.sin(yaw) * fw, o.y, z + Math.cos(yaw) * fw), qt, sc.set(s, s, s));
        for (const im of [cloth, skin, fm, mCl, mSk, mHr]) im.setMatrixAt(i, m4);
        if (avN) { avN.setMatrixAt(i, m4); avD.setMatrixAt(i, m4); }   // AVNET_305
        if (tef) tef.setMatrixAt(i, m4);   // TEFILLIN_A2
        c3.setHex(SKINS[(i * 5 + 1) % SKINS.length]);
        skin.setColorAt(i, c3);
        mSk.setColorAt(i, c3);
        const pal = TONES[o.kind === "student" || o.young ? 3 : (o.tone ? o.tone(i) : 1)], k = big ? 0 : (i * 7 + 3) % hairs.length;
        c3.setHex(big ? TONES[0][2] : pal[Math.floor(rnd() * pal.length)]);
        hairs[k].setMatrixAt(cnt[k], m4);
        hairs[k].setColorAt(cnt[k], c3);
        mHr.setColorAt(i, c3);
        slots[i] = [k, cnt[k]];
        cnt[k]++;
        R = Math.max(R, Math.hypot(x - ax, z - az));
      });
      hairs.forEach((h, k) => { h.count = cnt[k]; });
      for (const im of [cloth, skin, fm, mCl, mSk, mHr].concat(hairs, avN ? [avN, avD] : [], tef ? [tef] : [])) {   // AVNET_305, TEFILLIN_A2
        im.instanceMatrix.needsUpdate = true;
        if (im.instanceColor) im.instanceColor.needsUpdate = true;
        if (im.count > 0) (im === fm ? far : im === mCl || im === mSk || im === mHr || im === avD ? mid : near).add(im);
      }
      near.visible = false;
      far.visible = false;
      anchor.position.set(ax, o.y, az);
      for (const q of [near, mid, far, anchor]) parent.add(q);
      LOD.push({ near, mid, far, anchor, R: R * 1.0, lv: 1, k: o.lodK > 0 ? o.lodK : 1, min: o.minLv | 0, tef });   // PEOPLE_LOD_304: lodK, minLv (this house's copy); TEFILLIN_A2
      // MUSICIANS_305: the crowd's handle - its level of detail, and a figure moved (its matrix: place, turn, scale)
      const lodE = LOD[LOD.length - 1], allIm = [cloth, skin, fm, mCl, mSk, mHr].concat(avN ? [avN, avD] : [], tef ? [tef] : []);   // AVNET_305, TEFILLIN_A2
      near.userData.crowd = {
        lod: lodE,
        pose(i, m) { for (const im of allIm) im.setMatrixAt(i, m); const sl = slots[i]; if (sl) hairs[sl[0]].setMatrixAt(sl[1], m); },
        done() { for (const im of allIm.concat(hairs)) im.instanceMatrix.needsUpdate = true; }
      };
      return near;
    };
    // MUSICIANS_305 (the user, 19.11.2026 21:08: "צריך גם לעשות את הלוויים מנגנים... אם הם מנגנים, לא יכולים לעמוד כמו פסלים"; 21:10:
    // "ידיים של הכוהנים תופסות את החצוצרה, אי אפשר בלי"): ARMS THAT MOVE, for the figures of a crowd built with o.arms === false (their
    // own arms are left out, near and mid). rig(parent, n, o) - o = { robe (the sleeves' colour), skin(i) (the hand's tint, as the
    // crowd's SKINS index) } -> { g, arm(i, side, M, S, E, W), done() }: the arm `side` (+1 the left, at +x; -1 the right) of figure
    // i; M its matrix (place, turn, scale, in the parent's frame); S, E, W - the shoulder, the elbow and the wrist in the figure's own
    // units (its face to +z). The upper arm and the forearm are tubes from joint to joint, the joints round, the hand along the
    // forearm, its thumb inward. Every part one InstancedMesh; no shadows; not culled (the matrices change every frame).
    // This house's copy only.
    const rig = (parent, n, o) => {
      const g = new Group();
      g.name = "peopleRig";
      const mk = (geo, m, c) => { const im = new InstancedMesh(geo, m, c); im.castShadow = false; im.receiveShadow = true; im.frustumCulled = false; im.userData.noPick = true; g.add(im); return im; };
      const tube = (r0, r1) => shade(new CylinderGeometry(r1, r0, 1, 6, 1, true).translate(0, 0.5, 0), 0.93);
      const mC = clothMat(o.robe);
      const uA = mk(tube(0.072, 0.06), mC, 2 * n), fA = mk(tube(0.058, 0.048), mC, 2 * n), jA = mk(shade(new SphereGeometry(1, 7, 5), 0.95), mC, 4 * n);
      const handG = (sd) => skinPart(mergeGeometries([at(sph(0.03, 0.0135, 0.042, 5, 3), 0, 0, 0.04), at(sph(0.027, 0.011, 0.03, 5, 3), 0, -0.006, 0.085),
        at(sph(0.01, 0.01, 0.024, 4, 2), -sd * 0.026, 0.004, 0.03)]));
      const hA = { 1: mk(handG(1), mSkin, n), "-1": mk(handG(-1), mSkin, n) };
      const cH = new Color();
      for (let i = 0; i < n; i++) {
        cH.setHex(SKINS[((o.skin ? o.skin(i) : i) * 5 + 1) % SKINS.length]);
        hA[1].setColorAt(i, cH);
        hA[-1].setColorAt(i, cH);
      }
      for (const k of [1, -1]) if (hA[k].instanceColor) hA[k].instanceColor.needsUpdate = true;
      const Z0 = new Matrix4().makeScale(0, 0, 0), mL = new Matrix4(), mW = new Matrix4(), qA = new Quaternion(), qI = new Quaternion(), vA = new Vector3(), vS = new Vector3();
      const YV = new Vector3(0, 1, 0), ZV = new Vector3(0, 0, 1);
      for (const im of [uA, fA]) for (let j = 0; j < 2 * n; j++) im.setMatrixAt(j, Z0);   // until a figure's arm is set, it is not drawn
      for (let j = 0; j < 4 * n; j++) jA.setMatrixAt(j, Z0);
      for (let j = 0; j < n; j++) { hA[1].setMatrixAt(j, Z0); hA[-1].setMatrixAt(j, Z0); }
      const put = (im, j, P, Q, sx, sy, sz, M) => { mL.compose(P, Q, vS.set(sx, sy, sz)); mW.multiplyMatrices(M, mL); im.setMatrixAt(j, mW); };
      parent.add(g);
      return {
        g,
        arm(i, side, M, S, E, W) {
          const j = 2 * i + (side > 0 ? 1 : 0);
          vA.subVectors(E, S);
          const lu = vA.length() || 1e-6;
          qA.setFromUnitVectors(YV, vA.multiplyScalar(1 / lu));
          put(uA, j, S, qA, 1, lu, 1, M);
          vA.subVectors(W, E);
          const lf = vA.length() || 1e-6;
          vA.multiplyScalar(1 / lf);
          qA.setFromUnitVectors(YV, vA);
          put(fA, j, E, qA, 1, lf, 1, M);
          put(jA, 2 * j, S, qI, 0.074, 0.074, 0.074, M);
          put(jA, 2 * j + 1, E, qI, 0.06, 0.06, 0.06, M);
          qA.setFromUnitVectors(ZV, vA);
          put(hA[side > 0 ? 1 : -1], i, W, qA, 1, 1, 1, M);
        },
        done() { for (const im of [uA, fA, jA, hA[1], hA[-1]]) im.instanceMatrix.needsUpdate = true; }
      };
    };
    // PEOPLE_KIT_205: the level by the eye's distance from the crowd's edge (as it would be at a 45-degree lens); a tenth of slack
    // both ways, so that a level does not flicker at its border
    if (Array.isArray(ctx.animated)) ctx.animated.push(() => {
      const cam = ctx.camera;
      if (!cam) return;
      const f = cam.isPerspectiveCamera ? Math.tan(cam.fov * Math.PI / 360) / 0.4142 / (cam.zoom || 1) : 1;
      for (const e of LOD) {
        e.anchor.getWorldPosition(wp);
        const d = Math.max(0, wp.distanceTo(cam.position) - e.R) * f * e.k;
        let lv = e.lv;
        if (lv === 0) lv = d > 24 ? (d > 132 ? 2 : 1) : 0;
        else if (lv === 1) lv = d < 20 ? 0 : d > 132 ? 2 : 1;
        else lv = d < 20 ? 0 : d < 110 ? 1 : 2;
        if (lv < e.min) lv = e.min;   // PEOPLE_LOD_304: a crowd that never takes the full figure (minLv 1)
        if (lv !== e.lv || e.near.visible !== (lv === 0) || e.mid.visible !== (lv === 1)) { e.lv = lv; e.near.visible = lv === 0; e.mid.visible = lv === 1; e.far.visible = lv === 2; }
        if (e.tef && lv === 0) e.tef.visible = tefOK();   // TEFILLIN_A2
      }
    });
    // pts [[x, z] ...] along a row round the centre c: every one's face to the row's inner side (`away`: to its outer side)
    const facing = (pts, c, away) => pts.map((p, i) => {
      const a = pts[Math.max(0, i - 1)], b = pts[Math.min(pts.length - 1, i + 1)];
      let nx = -(b[1] - a[1]), nz = b[0] - a[0];
      if (nx * (c[0] - p[0]) + nz * (c[1] - p[1]) < 0) { nx = -nx; nz = -nz; }
      if (away) { nx = -nx; nz = -nz; }
      return [p[0], p[1], Math.atan2(nx, nz)];
    });
    // the beards along a row of n judges: white by the one in the middle, grey further, black-brown at the two ends
    const age = (n) => (i) => { const d = Math.abs(i - (n - 1) / 2) / ((n - 1) / 2); return d < 0.34 ? 0 : d < 0.67 ? 1 : 2; };
    return (ctx.__tmPeople = { crowd, facing, age, rig });
  }
  // ===== PEOPLE_KIT_204 END