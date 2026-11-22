    const mat = (color, extra) => new MeshStandardMaterial(Object.assign({ color, roughness: 0.85 }, extra || {}));
    const mSkin = mat(0xcfa07a, { roughness: 0.8 }), mElder = mat(0xd8caa2);
    const mFlame = new MeshBasicMaterial({ color: 0xffb347 }), mMark = new MeshBasicMaterial({ color: 0xffe08a });
    // PAYIS_LIGHT_205 (12.11.2026, the user: "הכל נהיה איטי בטירוף"): the same figure in a third of the faces - the robe 40 x 30 (was 64 x 50),
    // the migbaat 56 x 30 (96 x 56), the beard 32 x 14 (46 x 22), the avnet 40 x 6 (64 x 8): twenty-one figures were 610,000 triangles
    const FS = 1.4;                                  // the figures' scale (a model choice): to the top of the head 2.23 drawn x 1.4 = a little over three amot
    // ===== PAYIS_FIGURE4 - THE PRIEST. The user, 12.11.2026: 00:42 "לכהנים היו ידיים ... האבנט צריך להיראות שזור, לא חלק ... ככה לא
    // היה נראה המגבעת. בבקשה לנסות לחפש תמונות של כהן הדיוט, ולנסות לבנות דרכן"; 00:43 the page mikdash3.co.il/limud-leshichno-a-71
    // ("אנחנו מפה"); 00:48 "גם את הפרצוף תעשה כמוהו ... את הזקן"; 01:00 "תעשה את הכל יותר חי"; 01:11 "המגבעת נראית כמו כדור גלידה.
    // הזקן כמו 6 מלפפונים ... עשית את הכתונת כמו שמלה ... מה זה על הכתפיים? הגולות האלה. האבנט ... למה הוא כפול? היה אחד ... זה אמור
    // להיות צבע אחיד ... ביקשתי לראות אנשים, לא בובות. ידיים, רגליים, פתוחות"; 01:15 (the site's drawing 200) "זה שטריימל ולא המגבעת
    // אבל הכתונת טובה".
    // Built after that site's drawings - the migba'at and the whole man after drawing 452 "כהן הדיוט לבוש 4 בגדים", the kutonet
    // after drawing 200 - each part against the Rambam (Klei HaMikdash, read in his library - qa/fs/LIB_1111.md):
    //   the migba'at - tall, a smooth egg rounded at its head, broad bands of the cloth going up aslant one on another, a band
    //     over the forehead (the site's "שיטה ב"; 8:2 "ובניו צונפין בה ככובע", 8:19 "ארכו שש עשרה אמות"; the Ramban, Shemot 28:31
    //     "ומעלה הכפלים עליו כעין מגבעת שהוא קובע"; Ibn Ezra, 28:36 "שיכסו הראש והם גבוהים");
    //   the face - eyes with lids, brows, a nose, lips, a moustache; the beard one body, from the cheeks and the jaw to the chest;
    //   the kutonet - straight, checkered ("משבצת היתה שהיא בתים בתים באריגתה", 8:16), to above the heel, its sleeves to the palm
    //     ("וארך בית יד שלה עד פס ידו", 8:17); open hands; bare feet;
    //   the avnet - one band at the elbows ("כנגד אצילי ידיו", 10:1; "רחבו כמו שלש אצבעות", 8:19), finely woven of twined threads
    //     whose colours melt into one hue - tekhelet, argaman ("הצבוע אדום"), tola'at shani and white (8:1 "רקום בצמר", 8:13) -
    //     or all white ("של בוץ", Yoma 12b).
    // MODEL CHOICES: the proportions, the features of each face, the colour and the length of each beard.
    const cnv = (w, h, rx, ry, draw) => {
      const c = document.createElement("canvas");
      c.width = w;
      c.height = h;
      draw(c.getContext("2d"), w, h);
      const t = new CanvasTexture(c);
      t.wrapS = t.wrapT = RepeatWrapping;
      t.colorSpace = SRGBColorSpace;
      t.repeat.set(rx, ry);
      return t;
    };
    const rnd = (() => { let q = 20261112; return () => { q = (q * 1664525 + 1013904223) >>> 0; return q / 4294967296; }; })();   // a fixed sequence: the same priests in every run
    const TAU = Math.PI * 2;
    const sstep = (a, b, x) => { const t = Math.max(0, Math.min(1, (x - a) / (b - a))); return t * t * (3 - 2 * t); };
    // a smooth line through a table of [x, y]
    const spl = (tab, x) => {
      let i = 0;
      while (i < tab.length - 2 && x > tab[i + 1][0]) i++;
      const p0 = tab[Math.max(0, i - 1)], p1 = tab[i], p2 = tab[i + 1], p3 = tab[Math.min(tab.length - 1, i + 2)];
      const d = p2[0] - p1[0], t = Math.max(0, Math.min(1, (x - p1[0]) / d));
      const m1 = (p2[1] - p0[1]) / (p2[0] - p0[0]) * d, m2 = (p3[1] - p1[1]) / (p3[0] - p1[0]) * d, t2 = t * t, t3 = t2 * t;
      return (2 * t3 - 3 * t2 + 1) * p1[1] + (t3 - 2 * t2 + t) * m1 + (-2 * t3 + 3 * t2) * p2[1] + (t3 - t2) * m2;
    };
    // a surface P(u, v) - u goes round (its seam at the back; `open`: a strip, not closed), v goes up - with uv (o.tu / o.tv may
    // set them), a shade per vertex (o.c: the folds) and smooth normals
    const surf = (nu, nv, fn, open) => {
      const pos = [], uv = [], col = [], idx = [], o = { x: 0, y: 0, z: 0, c: 1, tu: 0, tv: 0 };
      for (let j = 0; j <= nv; j++) for (let i = 0; i <= nu; i++) {
        o.tu = i / nu;
        o.tv = j / nv;
        o.c = 1;
        fn(i === nu && !open ? 0 : i / nu, j / nv, o);
        pos.push(o.x, o.y, o.z);
        uv.push(i === nu && !open ? 1 : o.tu, o.tv);
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
    const white = (q) => { q.setAttribute("color", new BufferAttribute(new Float32Array(q.attributes.position.count * 3).fill(1), 3)); return q; };
    const sph = (sx, sy, sz, ws, hs, ps, pl, ts, tl) => {
      const q = new SphereGeometry(1, ws, hs, ps === undefined ? 0 : ps, pl === undefined ? TAU : pl, ts === undefined ? 0 : ts, tl === undefined ? Math.PI : tl);
      q.scale(sx, sy, sz);
      return q;
    };
    const at = (q, x, y, z) => { q.translate(x, y, z); return q; };
    const rot = (q, rx, ry, rz) => { if (rz) q.rotateZ(rz); if (rx) q.rotateX(rx); if (ry) q.rotateY(ry); return q; };
    const flatUV = (q, u, v) => { const a = q.attributes.uv; for (let i = 0; i < a.count; i++) a.setXY(i, u, v); return q; };
    // ---------- the textures
    // the kutonet's weave: small cells, white on white
    const texRobe = cnv(128, 128, 9, 12, (c, w, h) => {
      c.fillStyle = "#fbfaf6";
      c.fillRect(0, 0, w, h);
      c.fillStyle = "#f3f1e9";
      for (let i = 0; i < 4; i++) for (let j = 0; j < 4; j++) if ((i + j) % 2) c.fillRect(i * 32 + 2, j * 32 + 2, 28, 28);
      c.strokeStyle = "#d9d5c9";
      c.lineWidth = 2;
      c.setLineDash([10, 6]);
      for (let i = 0; i <= 4; i++) {
        c.beginPath(); c.moveTo(i * 32, 0); c.lineTo(i * 32, h); c.stroke();
        c.beginPath(); c.moveTo(0, i * 32); c.lineTo(w, i * 32); c.stroke();
      }
    });
    // hair: strands
    const texHair = cnv(64, 256, 3, 1, (c, w, h) => {
      c.fillStyle = "#ffffff";
      c.fillRect(0, 0, w, h);
      for (let k = 0; k < 46; k++) {
        const x0 = rnd() * w, wv = 2 + rnd() * 3, f0 = rnd() * 6;
        c.strokeStyle = "rgba(95,90,82," + (0.16 + rnd() * 0.3).toFixed(2) + ")";
        c.lineWidth = 0.8 + rnd() * 1.4;
        for (const dx of [-w, 0, w]) {
          c.beginPath();
          for (let y = 0; y <= h; y += 8) { const x = x0 + dx + Math.sin(y / 31 + f0) * wv; if (y) c.lineTo(x, y); else c.moveTo(x, y); }
          c.stroke();
        }
      }
    });
    // the avnet's weave: fine threads, twined - every row leans the other way; a thread's colour is drawn by the palette's weights,
    // so that from a little way off the colours melt into one hue
    const weave = (pal) => cnv(256, 48, 5, 1, (c, w, h) => {
      c.fillStyle = pal[0][0];
      c.fillRect(0, 0, w, h);
      const rows = 12, rh = h / rows, tot = pal.reduce((t, p) => t + p[1], 0);
      const pick = () => { let x = rnd() * tot; for (const p of pal) { x -= p[1]; if (x <= 0) return p[0]; } return pal[0][0]; };
      c.lineCap = "round";
      c.lineWidth = 3.1;
      for (let r = 0; r < rows; r++) {
        const lean = (r % 2 ? 1 : -1) * rh * 0.9, y = r * rh;
        for (let x = -8; x < w + 8; x += 4) {
          c.strokeStyle = pick();
          c.globalAlpha = 0.8 + rnd() * 0.2;
          for (const dx of [0, w, -w]) { c.beginPath(); c.moveTo(x + dx, y + 0.6); c.lineTo(x + dx + lean, y + rh - 0.6); c.stroke(); }
        }
      }
      c.globalAlpha = 1;
    });
    // the face's skin: shade about the eyes and by the nose, colour in the cheeks, the lines at the eyes' corners (the face's
    // front is at a quarter of the width); a patch of the lips' colour (the lips' own piece takes it)
    // FACE_A2 (fix-a2; the user, 22.11.2026: "הפרצוף עצמו קצת נראה כבובה" - more real, within this kit, no AI): a skin of a man who
    // works in the sun - less orange, its tone uneven (a fine mottling, the forehead lighter, the temples, the sockets of the eyes and
    // the hollows under the cheekbones darker, the nose and the cheeks a little redder, the folds from the nose to the mouth); the eye
    // brown, its white not white but warm, its glint small, the eye a little smaller and set in (HEAD_Y's line). Model choices.
    const SKIN = "#c39a7c";
    const texFace = cnv(512, 256, 1, 1, (c) => {
      c.fillStyle = SKIN;
      c.fillRect(0, 0, 512, 256);
      { const img = c.getImageData(0, 0, 512, 256), d = img.data;   // FACE_A2: the mottling, two sizes
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
      blob(cx, 100, 58, 22, "rgba(222,186,152,0.45)");
      // FACE_REAL_A2: fine lines - three across the forehead, and a soft line under each eye
      c.strokeStyle = "rgba(104,64,44,0.28)"; c.lineWidth = 1.4;
      for (const [y, w] of [[88, 34], [96, 40], [104, 36]]) { c.beginPath(); c.moveTo(cx - w, y + 2); c.quadraticCurveTo(cx, y - 3, cx + w, y + 2); c.stroke(); }
      for (const sd of [-1, 1]) { c.beginPath(); c.moveTo(cx + sd * 18, ey + 9); c.quadraticCurveTo(cx + sd * 29, ey + 13, cx + sd * 40, ey + 9); c.stroke(); }
      for (const sd of [-1, 1]) {
        blob(cx + sd * 29, ey, 25, 15, "rgba(92,52,34,0.26)");     // FACE_A2: the sockets deeper
        blob(cx + sd * 60, 112, 16, 26, "rgba(96,58,40,0.18)");    // the temples
        blob(cx + sd * 44, 162, 22, 18, "rgba(96,58,40,0.16)");    // under the cheekbones
        blob(cx + sd * 38, 146, 24, 16, "rgba(196,104,84,0.22)");  // the cheeks' colour, softer
        c.strokeStyle = "rgba(110,70,48,0.4)";
        c.lineWidth = 1.3;
        for (const k of [-1, 0, 1]) { c.beginPath(); c.moveTo(cx + sd * 45, ey + k * 2.5); c.lineTo(cx + sd * 54, ey + k * 6 - 1); c.stroke(); }
        c.strokeStyle = "rgba(110,62,38,0.22)";
        c.lineWidth = 5;
        c.beginPath(); c.moveTo(cx + sd * 10, ey + 2); c.lineTo(cx + sd * 12, 152); c.stroke();
      }
      blob(cx, 150, 9, 10, "rgba(186,96,80,0.22)");                // FACE_A2: the nose a little redder
      c.strokeStyle = "rgba(92,54,38,0.22)";                         // and the folds from its wings down to the mouth
      c.lineWidth = 3;
      for (const sd of [-1, 1]) { c.beginPath(); c.moveTo(cx + sd * 13, 156); c.quadraticCurveTo(cx + sd * 22, 170, cx + sd * 20, 186); c.stroke(); }
      c.fillStyle = "#8f5a4e";
      c.fillRect(372, 190, 40, 30);
    });
    // the eye: the white, the iris, the pupil and a glint (its front is at a quarter of the width)
    const texEye = cnv(128, 64, 1, 1, (c) => {
      // FACE_A2: the white warm and shaded toward its corners, the iris brown (a darker ring, lighter flecks), the glint small
      c.fillStyle = "#e3d8c8";
      c.fillRect(0, 0, 128, 64);
      const sh = c.createRadialGradient(32, 33, 8, 32, 33, 34);
      sh.addColorStop(0, "rgba(0,0,0,0)"); sh.addColorStop(1, "rgba(88,60,44,0.45)");
      c.fillStyle = sh; c.fillRect(0, 0, 128, 64);
      c.fillStyle = "#2a1a10"; c.beginPath(); c.arc(32, 32, 11.6, 0, TAU); c.fill();
      c.fillStyle = "#5a3a22"; c.beginPath(); c.arc(32, 32, 10, 0, TAU); c.fill();
      for (let k = 0; k < 18; k++) { const q = (j) => { const h = Math.sin((k * 3 + j) * 91.17 + 7.3) * 43758.5453; return h - Math.floor(h); }, a = q(0) * TAU, r = 5 + q(1) * 4.5; c.fillStyle = "rgba(150,108,62,0.5)"; c.beginPath(); c.arc(32 + Math.cos(a) * r, 32 + Math.sin(a) * r, 0.9 + q(2), 0, TAU); c.fill(); }
      c.fillStyle = "#0e0907"; c.beginPath(); c.arc(32, 32, 4.2, 0, TAU); c.fill();
      c.fillStyle = "rgba(255,250,240,0.85)"; c.beginPath(); c.arc(29.4, 29.2, 1.25, 0, TAU); c.fill();
    });
    const mRobe = mat(0xffffff, { map: texRobe, vertexColors: true, roughness: 0.92 });   // PAYIS_WHITE: one white for every priest
    const mHat = mat(0xffffff, { vertexColors: true, roughness: 0.93 });
    const mFace = mat(0xffffff, { map: texFace, roughness: 0.78 });
    const mEye = mat(0xffffff, { map: texEye, roughness: 0.18 });
    // tekhelet, argaman ("הצבוע אדום"), tola'at shani, and the white of the linen
    const mSashDyed = mat(0xffffff, { map: weave([["#3d62ab", 4.2], ["#8e1f34", 3.1], ["#c5432b", 1.3], ["#e6e1d3", 1]]), vertexColors: true, roughness: 0.88 });
    const mSashWhite = mat(0xffffff, { map: weave([["#f7f5ee", 4], ["#e0dbcc", 3], ["#ffffff", 2], ["#cfc9b7", 1]]), vertexColors: true, roughness: 0.88 });
    const mBeards = [0xf4f2ec, 0xbdbab2, 0xeae7df, 0x54402f, 0xa29e96, 0xf0eee8, 0x6d5a48].map((c) => mat(c, { map: texHair, vertexColors: true, roughness: 0.95, side: DoubleSide })), mBeardOld = mBeards[0];
    const SASHES = [];   // every avnet's mesh: dyed in the Rambam's reading, white in "של בוץ"
    // ---------- the head (its middle at HEAD_Y): an egg, narrower at the chin; the nose with its wings, the lids, the lips and the
    // ears are pieces of its skin
    const HEAD_Y = 2.075, HR = [0.128, 0.16, 0.14], EYE = [0.044, 0.014, 0.1155], ER = 0.0158, HS = 1.045;   // FACE_REAL_A2 (the user: "פרצופים אמיתיים יותר" - not a doll's): the eyes smaller (0.0206 until now), a little closer, set in to the skin   // FACE_A2: the eyes 0.0206 (0.0222), set in 0.002
    // (the skull's distance from its axis at the angle ph - 0 is the front - and the height y)
    const headR = (ph, y) => {
      const yn = Math.max(-0.999, Math.min(0.999, y / HR[1])), j = yn < 0 ? yn * yn : 0;
      return Math.sqrt(1 - yn * yn) / Math.hypot(Math.sin(ph) / (HR[0] * (1 - 0.2 * j)), Math.cos(ph) / (HR[2] * (1 - 0.1 * j)));
    };
    const gHeadAll = (() => {
      const k = new SphereGeometry(1, 28, 20), p = k.attributes.position;
      for (let i = 0; i < p.count; i++) {
        const x = p.getX(i), y = p.getY(i), z = p.getZ(i), j = y < 0 ? y * y : 0;
        p.setXYZ(i, x * HR[0] * (1 - 0.2 * j), y * HR[1], z * HR[2] * (1 - 0.1 * j));
      }
      k.computeVertexNormals();
      const skin = (q) => flatUV(q, 0.75, 0.3), parts = [k];
      parts.push(skin(at(sph(0.0105, 0.032, 0.017, 8, 6), 0, -0.014, 0.131)));                // the nose (FACE_REAL_A2: of a natural size): its bridge,
      parts.push(skin(at(sph(0.0135, 0.0125, 0.016, 10, 8), 0, -0.04, 0.1405)));             // its tip,
      for (const sd of [-1, 1]) {
        parts.push(skin(at(sph(0.0085, 0.008, 0.009, 6, 5), sd * 0.0135, -0.045, 0.1325)));  // its wings
        parts.push(skin(at(sph(0.012, 0.03, 0.02, 6, 6), sd * 0.126, 0, -0.004)));           // the ear
        // the lids: the upper one over the top of the iris, the lower one under it
        parts.push(skin(at(rot(sph(ER * 1.08, ER * 1.08, ER * 1.08, 12, 6, 0, TAU, 0, 0.74), 0.5), sd * EYE[0], EYE[1], EYE[2])));
        parts.push(skin(at(rot(sph(ER * 1.07, ER * 1.07, ER * 1.07, 12, 5, 0, TAU, 0, 0.6), Math.PI - 0.42), sd * EYE[0], EYE[1], EYE[2])));
      }
      parts.push(flatUV(at(sph(0.021, 0.0052, 0.01, 10, 6), 0, -0.0865, 0.1215), 0.766, 0.2));   // the lips
      return mergeGeometries(parts);
    })();
    const gEyes = mergeGeometries([-1, 1].map((sd) => at(sph(ER, ER, ER, 14, 10), sd * EYE[0], EYE[1], EYE[2])));
    // ---------- the hair, one piece. THE BEARD IS ONE BODY (the user: "הזקן גוש כזה", then "כמו 6 מלפפונים" - "תסתכל תמונות של
    // אנשים"): it grows from the cheeks before the ears and from the jaw, lies on the face, and under the chin it hangs and comes
    // forward to the chest, narrowing; its lower edge is uneven and its face is of strands. With it: the brows, the moustache (two
    // parts), the hair of the head's top (seen when the migba'at is lifted) and of its back
    const YJ = -0.118;
    const hairGeo = () => {
      const PM = 1.4, w2 = rnd() * 6, len = 0.165 + rnd() * 0.07, parts = [];   // PAYIS_FIGURE4B: full and rounded below
      parts.push(surf(32, 14, (u, v, o) => {
        const a = u * 2 - 1, ph = a * PM, ya = Math.abs(a), sd = 1 - v;                      // sd: 0 at the upper edge, 1 at the lower
        const yTop = -0.094 + 0.124 * Math.pow(ya, 1.3), yBot = -0.07 - len * (1 - Math.pow(ya, 5)) + 0.01 * Math.sin(15 * ph + w2) * (1 - ya);   // PAYIS_FIGURE4C
        const y = yTop + sd * (yBot - yTop);
        const strand = Math.sin(24 * ph + 5 * sd + w2), th = (0.004 + 0.03 * Math.pow(Math.sin(Math.PI * Math.min(1, sd * 1.22)), 0.9) + 0.003 * strand + 0.002 * Math.sin(39 * ph - 3 * sd)) * (1 - Math.pow(ya, 5));
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
        o.c = 0.87 + 0.13 * (0.5 + 0.5 * strand) - 0.05 * sd;
        o.tu = u * 1.4;
        o.tv = v;
      }, true));
      for (const sd of [-1, 1]) {
        parts.push(white(at(rot(sph(0.026, 0.0062, 0.01, 8, 5), 0, 0, -sd * 0.04), sd * EYE[0], 0.05, 0.1262)));   // the brow (FACE_REAL_A2: finer)
        parts.push(white(at(rot(sph(0.037, 0.0125, 0.016, 10, 6), 0, 0, -sd * 0.4), sd * 0.027, -0.066, 0.127)));     // the moustache
      }
      parts.push(white(sph(HR[0] * HS, HR[1] * HS, HR[2] * HS, 20, 6, 0, TAU, 0, 1.08)));
      parts.push(white(sph(HR[0] * HS, HR[1] * HS, HR[2] * HS, 14, 8, Math.PI + 0.3, Math.PI - 0.6, 1.08, 1.4)));
      return mergeGeometries(parts);
    };
    const gHairs = [hairGeo(), hairGeo(), hairGeo(), hairGeo()];   // four beards, a little different
    const headOn = (f, y, mHair, k) => {
      const hg = new Group();
      hg.position.y = y;
      hg.add(new Mesh(gHeadAll, mFace));
      hg.add(new Mesh(gEyes, mEye));
      hg.add(new Mesh(gHairs[(k || 0) % gHairs.length], mHair));
      f.add(hg);
      return hg;
    };
    // ---------- the kutonet (the site's drawing 200 - the user: "הכתונת טובה"): straight, falling from the shoulders - the body's
    // breadth and depth at each height; soft folds of the cloth below the avnet
    const BODY = [[0.1, 0.207, 0.166], [0.5, 0.205, 0.164], [1.0, 0.201, 0.16], [1.2, 0.199, 0.158], [1.33, 0.193, 0.15], [1.45, 0.197, 0.152], [1.58, 0.216, 0.158], [1.68, 0.244, 0.156], [1.745, 0.264, 0.146], [1.79, 0.242, 0.128], [1.83, 0.186, 0.11], [1.87, 0.116, 0.09], [1.9, 0.076, 0.076]];
    const bX = BODY.map((r) => [r[0], r[1]]), bZ = BODY.map((r) => [r[0], r[2]]);
    const gRobeBody = surf(40, 30, (u, v, o) => {
      const y = v < 0.6 ? 0.1 + 2 * v : 1.3 + (v - 0.6) * 1.5, a = u * TAU + Math.PI, k = Math.max(0, (1.3 - y) / 1.2);
      const fold = Math.sin(7 * a + 0.8) * 0.6 + Math.sin(11 * a + 2.1) * 0.4, m = 1 + 0.02 * k * fold;
      o.x = spl(bX, y) * m * Math.sin(a);
      o.y = y;
      o.z = spl(bZ, y) * m * Math.cos(a);
      o.c = 1 - 0.11 * k * Math.max(0, -fold);
      o.tv = (y - 0.1) / 1.8;
    });
    //@@slot top-note
    const WAIST = 1.0;
    const robeBand = (y0, y1, rows, grow) => surf(40, rows, (u, v, o) => {
      const y = y0 + (y1 - y0) * v, a = u * TAU + Math.PI, k = Math.max(0, (1.3 - y) / 1.2);
      const fold = Math.sin(7 * a + 0.8) * 0.6 + Math.sin(11 * a + 2.1) * 0.4, m = (1 + 0.02 * k * fold) * (typeof grow === "function" ? grow(v) : grow);
      o.x = spl(bX, y) * m * Math.sin(a);
      o.y = y;
      o.z = spl(bZ, y) * m * Math.cos(a);
      o.c = 1 - 0.11 * k * Math.max(0, -fold);
      o.tv = (y - 0.1) / 1.8;
    });
    //@@slot ROWS
    const gRobeAll = robeBand(0.1, 1.9, ROWS, 1);
    const part = (j0, j1) => {
      const q = new BufferGeometry();
      for (const k of ["position", "uv", "color", "normal"]) q.setAttribute(k, gRobeAll.attributes[k]);
      q.setIndex(Array.from(gRobeAll.index.array.slice(j0 * 40 * 6, j1 * 40 * 6)));
      return q;
    };
    const gRobeLow = mergeGeometries([part(0, CUT), robeBand(WAIST - 0.02, WAIST + 0.16, 6, (v) => 0.97 - 0.4 * v * v)]);
    const gRobeUp = part(CUT, ROWS);
    // an arm hanging from the shoulder (its origin), a little bent at the elbow: the sleeve to the wrist (its top is the shoulder's
    // own roundness - no ball on it)
    const SH_X = 0.252, SH_Y = 1.728, BEND = 0.2, UP = 0.36, FORE = 0.34;
    const foreAt = (q, d) => at(rot(at(q, 0, -d, 0), -BEND), 0, -UP, 0);   // a piece at the distance d along the forearm from the elbow
    const sleeveGeo = () => mergeGeometries([
      sph(0.07, 0.07, 0.07, 14, 10),
      at(new CylinderGeometry(0.07, 0.058, UP, 14), 0, -UP / 2, 0),
      at(sph(0.058, 0.058, 0.058, 12, 8), 0, -UP, 0),
      foreAt(new CylinderGeometry(0.056, 0.046, FORE, 14), FORE / 2)
    ].map(white));
    // an open hand: the palm, four fingers a little apart, the thumb (sd: the arm's side - the thumb is to the front)
    const handRaw = (sd) => {
      const parts = [sph(0.03, 0.04, 0.0125, 10, 8)];
      [-0.0215, -0.0072, 0.0072, 0.0215].forEach((x, i) => parts.push(at(rot(sph(0.0083, 0.031 - Math.abs(i - 1.4) * 0.004, 0.0083, 6, 6), 0, 0, x * 5), x * 1.25, -0.062, 0)));
      parts.push(at(rot(sph(0.0098, 0.027, 0.0098, 6, 6), 0, 0, -sd * 0.75), -sd * 0.037, -0.012, 0.004));
      const q = mergeGeometries(parts);
      q.rotateY(sd * 0.95);                // the palm toward the body, the thumb to the front
      return q;
    };
    const handOpen = (sd) => foreAt(handRaw(sd), FORE + 0.045);   // PRIEST_KIT_207: the same hand (handRaw: in its own frame, for 55-tamid.js)
    // the hand of "הצביעו": closed, one finger out
    const handPoint = () => mergeGeometries([foreAt(sph(0.03, 0.034, 0.024, 10, 8), FORE + 0.036), foreAt(new CylinderGeometry(0.0095, 0.011, 0.085, 6), FORE + 0.105)]);
    const armPlace = (q, sd) => at(rot(q, -0.04, 0, sd * 0.17), sd * SH_X, SH_Y, 0);     // the arms a little away from the body
    const gRobe = mergeGeometries([gRobeBody, armPlace(sleeveGeo(), 1)]);
    // (the skin that does not move: the neck, the left hand, the ankles and the bare feet - a little apart, the toes outward)
    const footGeo = (sd) => mergeGeometries([at(new CylinderGeometry(0.034, 0.04, 0.14, 8), sd * 0.1, 0.1, -0.01), at(rot(sph(0.043, 0.027, 0.098, 10, 6), 0, sd * 0.22, 0), sd * 0.108, 0.027, 0.095)]);
    const gSkinStill = mergeGeometries([at(new CylinderGeometry(0.066, 0.072, 0.09, 12), 0, 1.925, 0), armPlace(handOpen(1), 1), footGeo(-1), footGeo(1)]);
    // (the right arm moves: it hangs, and at "הצביעו" it is stretched forward, one finger out)
    const gSleeve = sleeveGeo(), gHandOpen = handOpen(-1), gHandPoint = handPoint();
    const ARM_DOWN = [-0.04, -0.17], ARM_OUT = [-1.15, -0.05];
    // ---------- the avnet: one band at the elbows' height, lying on the kutonet
    // AVNET_211 (the user: "אבנט הכהנים רחב יותר"): broader, and its turns seen - three turns "כרך על גבי כרך" (8:19), each rounded
    const SY0 = 1.312, SY1 = 1.462;
    const gSash = surf(40, 12, (u, v, o) => {
      const tv = (v * 3) % 1, e = Math.max(0, Math.sin(Math.PI * tv)) * (0.55 + 0.45 * Math.sin(Math.PI * v));
      const y = SY0 + v * (SY1 - SY0), a = u * TAU + Math.PI, th = 0.004 + 0.017 * Math.pow(e, 0.35);
      o.x = (spl(bX, y) + th) * Math.sin(a);
      o.y = y;
      o.z = (spl(bZ, y) + th) * Math.cos(a);
      o.c = 0.88 + 0.12 * e;
    });
    // ---------- the migba'at. MIGBAAT_A2 (fix-a2, 22.11.2026; the user: "המגבעות — לשנות את כולן כמו בחוברת", tall, a cone wound with
    // bands; and "להזיז את המגבעות קצת לאחור על הראש, כך שהתפילין ייראו מלפנים"): as the priests of the booklet "אלחנן וחיים שמחים
    // בירושלים" draw it - a tall cone, narrowing a little to a round head, the cloth wound round it in bands, one above another; it sits
    // on the head from the start of the hair up (its lower edge at the hairline all round, a little back), so the head's tefillin are
    // seen before it (gTefR). The Rambam, Klei HaMikdash 8:2 (338:124): "ומצנפת האמורה באהרן היא המגבעת האמורה בבניו. אלא שכהן גדול צונף
    // בה כמי שלופף על השבר. ובניו צונפין בה ככובע ולפיכך נקראת מגבעת". Until now (PAYIS_FIGURE4D, the site's drawing 452): an egg, its
    // bands aslant, down to the forehead. Its height, the narrowing and the bands' number - model choices. Its origin stays HAT_Y (the
    // figures place it there); the lower edge is MIG.y0 over it.
    const HAT_H = 0.335, HAT_Y = HEAD_Y + 0.06, ARROW_Y = 2.75;
    // MIGBAAT_CHALAMISH_A2 (the user, on pictures 07-08: "נוראיות, וממש לא דומות לזו שבחלמיש" - A-10, A-11, B-03, B-07, B-22): as the
    // booklet draws it - a tall white cylinder, hardly narrowing, about half as high again as the head, its head a low round dome; the
    // cloth wound round it in bands that run ASLANT (three bands going round together), a soft fold between them; it sits back on the
    // crown, a little tilted back, its lower edge from just over the ears round the back of the head, and in front it rises over the
    // head's tefillin - the box and the strap lie on the hair, the hat above and behind them, nothing between (the user, after
    // Shulchan Aruch OC 27:4, 382:231: "לא יהא דבר חוצץ בין תפילין לבשרו"; "גם רצועה לא עוברת מעל" - the strap round the head under its
    // edge). Its measures, the tilt and the bands - model choices. Until now: a cone of six level bands, its edge round the head at
    // one height. Its origin stays HAT_Y (the figures place it there).
    const MIG = { y0: 0.012, H: 0.41, rx: 0.122, rz: 0.132, top: 0.58, back: -0.014, bands: 5.5, starts: 2, lift: 0.06, tilt: 0.12 };
    const hatSurf = (P, bandsOn) => (u, v, o) => {
      const a = u * TAU + Math.PI, body = 0.86, k = v < body ? v / body : 1, fr = Math.pow(Math.max(0, Math.cos(a)), 2);
      let R = 1 - (1 - P.top) * Math.pow(k, 0.95), y = P.y0 + P.lift * fr * Math.pow(1 - k, 1.4) + v * P.H;   // MIGBAAT_CONE_A2: a cone narrowing upward
      if (v > body) { const w = (v - body) / (1 - body); R = P.top * Math.sqrt(Math.max(0, 1 - w * w)); y = P.y0 + body * P.H + w * P.top * P.rz * 1.0; }
      const t = (((v / body) * P.bands + u * P.starts) % 1 + 1) % 1, on = bandsOn ? (v < body ? sstep(0.0, 0.04, v) : 1 - sstep(body, 0.97, v)) : 0;
      const r = R * (1 + on * (0.045 * (1 - t) * (1 - t) - 0.01));
      const x = r * P.rx * Math.sin(a), z = r * P.rz * Math.cos(a) + P.back, c = Math.cos(P.tilt), sn = Math.sin(P.tilt);
      o.x = x;
      o.y = y * c + z * sn;            // tilted back: the front up, the top back
      o.z = -y * sn + z * c;
      o.c = 1 - on * (Math.exp(-t / 0.07) * 0.36 + 0.06 * Math.pow(t, 3));
    };
    const gHat = surf(48, 44, hatSurf(MIG, true));
    // TEFILLIN_A2 (fix-a2; the user's decision 67, 22.11.2026): THE HEAD'S TEFILLIN on every priest - Zevachim 19a (130:737-743):
    // "כֹּהֲנִים בַּעֲבוֹדָתָן... פְּטוּרִין מִן הַתְּפִלָּה וּמִן הַתְּפִילִּין"; "הָא דְּיָד, הָא דְּרֹאשׁ" (the arm's comes between, the head's does
    // not); "שְׂעָרוֹ הָיָה נִרְאֶה בֵּין צִיץ לְמִצְנֶפֶת, שֶׁשָּׁם מַנִּיחִין תְּפִילִּין". At the start of the hair (the user: "בתחילת צמיחת השער"):
    // the box (bayit) on its base (titura), the strap round the head to the knot behind, and its two ends down before the shoulders.
    // Not by night, nor on Shabbat, a festival or its middle days (the user, 01:04) - the houses' demonstrations hide them (tefSet).
    // In the head's frame (its middle at 0). Their size (a little over four fingers) and the straps' length - model choices.
    const TEF = { on: true, list: [] };
    const tefSet = (on) => { TEF.on = !!on; for (const m of TEF.list) m.visible = TEF.on; };
    const mTef = mat(0x111111, { roughness: 0.42, metalness: 0.0 });
    // TEFILLIN_PLACE_A2 (the user: "תעשה במקומם, גם מבחינת הרצועות שסביב הראש. אל תחרטט"; the box smaller): Shulchan Aruch OC 27:9
    // (382:236) "מהתחלת עיקרי השער ממצחו עד סוף המקום שמוחו של תינוק רופס" - the box's foot at the start of the hair (the hair's edge
    // here at y 0.079 over the head's middle), in the middle, over between the eyes; 27:10 (382:237) "צריך שיהיה הקשר מאחורי הראש למעלה
    // בעורף... באמצע העורף ולא יטה לכאן או לכאן" - the strap from the box round the head, over the ears, to the knot behind, at the top of
    // the nape, in its middle; 27:11 (382:238) "ישלשל הרצועות שיהיו תלוים לפניו ויגיעו עד הטבור או למעלה ממנו מעט" - the two ends from
    // the knot over the shoulders and down before him, the right to the navel, the left a little shorter (the user). Until now the box
    // was 0.052 and the ends stopped at the chest. Their thickness - a model choice.
    const TY = 0.1, TB = 0.04;   // the box's middle over the head's, and its side
    const tefRing = (n) => {   // the strap round the head: from the box's foot (front) over the ears (y ~0.05) to the knot (y -0.056)
      const ring = [], yF = TY - TB * 0.45, yB = -0.056;
      for (let i = 0; i < n; i++) {
        const ph = (i / n) * TAU, w = 0.5 + 0.5 * Math.cos(ph), y = yB + (yF - yB) * Math.pow(w, 0.35), r = headR(ph, y) + 0.005;
        ring.push(new Vector3(Math.sin(ph) * r, y, Math.cos(ph) * r));
      }
      return ring;
    };
    const tefBox = () => {
      const zs = HR[2] * Math.sqrt(1 - (TY / HR[1]) * (TY / HR[1])), n = new Vector3(0, TY / (HR[1] * HR[1]), zs / (HR[2] * HR[2])).normalize();
      const tilt = Math.atan2(n.y, n.z), place = (q, d) => { q.rotateX(-tilt); q.translate(0, TY + n.y * d, zs + n.z * d); return q; };
      return [place(new BoxGeometry(TB * 1.25, TB * 1.25, 0.01), 0.007), place(new BoxGeometry(TB, TB, TB), 0.012 + TB / 2)];   // the titura, the bayit
    };
    const gTefR = (() => {
      const parts = tefBox();
      parts.push(new TubeGeometry(new CatmullRomCurve3(tefRing(48), true), 72, 0.0048, 4, true));
      const kz = -(headR(Math.PI, -0.056) + 0.009);
      parts.push(at(new BoxGeometry(0.024, 0.02, 0.012), 0, -0.058, kz));                 // the knot, in the nape's middle
      for (const sd of [-1, 1]) {   // the two ends: behind the neck, over the shoulder by the neck, and down before him (sd -1 his right)
        const end = sd < 0 ? -0.93 : -0.8;
        const pts = [[0.008, -0.064, kz + 0.004], [0.05, -0.13, -0.118], [0.098, -0.19, -0.088], [0.13, -0.212, -0.02], [0.136, -0.235, 0.07], [0.134, -0.29, 0.122], [0.13, -0.36, 0.142],
          [0.127, -0.48, 0.146], [0.124, -0.6, 0.15], [0.122, -0.72, 0.17], [0.121, end, sd < 0 ? 0.142 : 0.168]].map(([x, y, z]) => new Vector3(sd * x, y, z));
        parts.push(new TubeGeometry(new CatmullRomCurve3(pts), 40, 0.0046, 4, false));
      }
      return mergeGeometries(parts.map((q) => { q.deleteAttribute("uv"); if (q.attributes.normal === undefined) q.computeVertexNormals(); return q; }));
    })();
    // the head's tefillin on a head made by headOn (its group): priests only - the figures that are priests ask for it
    const tefOn = (hg) => { const m = new Mesh(gTefR, mTef); m.name = "tefillin-rosh"; m.visible = TEF.on; hg.add(m); TEF.list.push(m); return m; };
    // TEFILLIN_A2: THE ARM'S, for the Levites (the user, 00:58: "תפילין גם ללויים" - no priestly garments, nothing between): on the left
    // arm's upper part, the strap wound seven times round the forearm (a model choice, to be shown to the user). up / fo: the arm's two
    // lengths in its own frame (the shoulder at 0, the elbow at -up; the forearm from the elbow, 0 .. -fo); rU / rF: their radii.
    const tefArm = (shoulder, elbow, up, fo, rU, rF) => {
      const box = new Group();
      box.add(new Mesh(new BoxGeometry(TB * 1.3, TB * 1.25, 0.012), mTef));
      const b = new Mesh(new BoxGeometry(TB, TB, TB), mTef); b.position.z = 0.006 + TB / 2; box.add(b);
      // TEFILLIN_PLACE_A2: Shulchan Aruch OC 27:1 (382:228) "בזרוע שמאל, בבשר התופח שבעצם שבין הקובד"ו ובית השחי, ויטה התפלה מעט לצד
      // הגוף" - on the swelling of the upper arm, about its middle, turned a little toward the body (the arm bare there: the sleeve rolled
      // up - 55-tamid.js); a strap from it down to the elbow, and wound round the forearm
      box.position.set(-rU * 0.55, -up * 0.5, rU * 0.82);
      box.rotation.y = -0.6;
      shoulder.add(box);
      const pts = [];
      for (let i = 0; i <= 84; i++) { const k = i / 84, th = k * 7 * TAU, r = (rF * (1 - 0.18 * k)) + 0.006; pts.push(new Vector3(Math.cos(th) * r, -0.04 - k * (fo - 0.1), Math.sin(th) * r)); }
      const wind = new Mesh(new TubeGeometry(new CatmullRomCurve3(pts), 220, 0.0055, 4, false), mTef);
      elbow.add(wind);
      const down = new Mesh(new TubeGeometry(new CatmullRomCurve3([new Vector3(-rU * 0.5, -up * 0.5 - TB * 0.6, rU * 0.85), new Vector3(-rU * 0.2, -up * 0.78, rU * 1.0), new Vector3(rU * 0.4, -up + 0.02, rU * 0.95)]), 12, 0.0055, 4, false), mTef);
      shoulder.add(down);
      for (const m of [box, wind, down]) { m.visible = TEF.on; TEF.list.push(m); }
      return { box, wind };
    };
    const gCap = sph(HR[0] * 1.1, HR[1] * 1.1, HR[2] * 1.1, 16, 5, 0, TAU, 0, 1.15);   // the elder's cap
    const gFlame = new ConeGeometry(0.2, 0.7, 8); gFlame.translate(0, 0.35, 0);
    const gArrowHead = new ConeGeometry(0.2, 0.4, 12); gArrowHead.rotateX(Math.PI);   // the point down
    const gArrowShaft = new CylinderGeometry(0.065, 0.065, 0.36, 8);
    const mArrow = new MeshBasicMaterial({ color: 0xffc83a });
    const gStick = new CylinderGeometry(0.04, 0.04, 1.3, 6); gStick.translate(0, 0.65, 0);
    // a standing figure: the group's +z is the way it faces; hat = the migba'at (its own object: the appointed one lifts it);
    // hand = the right arm: `hand.visible = true` stretches it forward, one finger out ("הצביעו")
    // PRIEST_KIT_207 (12.11.2026 19:28, the user: "שים לב להתאים את הדמויות לאלו שעשית בשרשור הזה"): this priest's parts, for the figures
    // of the morning's service (55-tamid.js) - the same geometries and materials, shared (nothing is built twice; his figures below unchanged)