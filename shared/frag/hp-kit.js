    // ===== HP_KIT_A2 (fix-a2; the user via the coordinator, 22.11.2026: "בבית ראשון להשתמש באותה בנייה עצמה, ולא בבנייה נפרדת"): THE HIGH
    // PRIEST IN HIS EIGHT GARMENTS AND THE PRIEST IN HIS FOUR - one construction for both houses (shared/frag/hp-kit.js, put in by
    // an include line "hp-kit"). Until now the Second Temple's morning service (55-tamid.js buildHP) had it; it is here as it was there, word
    // for word: the body under the robe, the belt, the robe and its hem, the ephod by Rashi or by the Rambam (setEphod), its band and its
    // shoulders "ממין האפוד" with the shoham stones in gold and the chains of gold (the user's decision 105: "הכתפות ממין האפוד"), the
    // breastplate, the tzitz, the mitznefet of shesh tilted back with its cords of techelet, by Rashi or by the Ramban (setMitz). On the
    // kit's priest (priest-kit.js - K): his head, beard, sleeves, hands and feet. hpKit(K) - built once for a kit (K.__hpKit).
    //   figure()   the high priest: { g, lean, A, L, R, fl, fr, body, belt, garb: { ephod: { rashi, rambam }, mitz: { rashi, ramban } } }
    //   priest(n)  a priest in his four: { g, lean, A, L, R, fl, fr, body, belt, hat, setBelt("kilayim" | "butz") }
    //   pair()     the two side by side ("בגדי הכהנים", both houses): { g, a: priest, b: high priest, set({ belt, ephod, mitz }) }
    const hpKit = (K) => {
      if (K.__hpKit) return K.__hpKit;
      const clamp = (v, a, b) => (v < a ? a : v > b ? b : v);
      const lerp = (a, b, u) => a + (b - a) * u;
      const smooth = (u) => u * u * (3 - 2 * u);
      const HP = Math.PI / 2;
      const std = (color, o = {}) => new MeshStandardMaterial(Object.assign({ color, roughness: 0.85, metalness: 0 }, o));
      // the tunic's weave (Rambam, Klei HaMikdash 8:16 "בתים בתים... כמו בית הכוסות"): white, a grid of fine lines, four cells to a tile
      const weave = (() => {
        const cv = document.createElement("canvas");
        cv.width = cv.height = 64;
        const c = cv.getContext("2d");
        c.fillStyle = "#ffffff"; c.fillRect(0, 0, 64, 64);
        c.fillStyle = "#d3ccba";
        for (let i = 0; i < 4; i++) { c.fillRect(i * 16, 0, 2, 64); c.fillRect(0, i * 16, 64, 2); }
        const tx = new CanvasTexture(cv);
        tx.wrapS = tx.wrapT = RepeatWrapping;
        tx.colorSpace = SRGBColorSpace;
        tx.anisotropy = 4;
        return tx;
      })();
      const MAT = {
        fig: std(0xffffff, { vertexColors: true, roughness: 0.9, map: weave }),
        gold: std(0xe6c05a, { metalness: 0.85, roughness: 0.3, emissive: 0x3a2a06, emissiveIntensity: 0.4 })
      };
      const V2 = (r, y) => new Vector2(r, y);
      const tint = (geo, hex) => {
        const c = new Color(hex), n = geo.attributes.position.count, a = new Float32Array(n * 3);
        for (let i = 0; i < n; i++) { a[i * 3] = c.r; a[i * 3 + 1] = c.g; a[i * 3 + 2] = c.b; }
        geo.setAttribute("color", new BufferAttribute(a, 3));
        return geo;
      };
      // the weave's texture coordinates: the woven linen scaled to the cells; what is not of it takes a point inside a cell (plain)
      const plain = (geo) => { const uv = geo.attributes.uv; for (let i = 0; i < uv.count; i++) uv.setXY(i, 0.12, 0.12); return geo; };
      const uvScale = (geo, fu, fv) => { const uv = geo.attributes.uv; for (let i = 0; i < uv.count; i++) uv.setXY(i, uv.getX(i) * fu, uv.getY(i) * fv); return geo; };
      const uvLathe = (geo, fu, fv) => { const uv = geo.attributes.uv, p = geo.attributes.position; for (let i = 0; i < uv.count; i++) uv.setXY(i, uv.getX(i) * fu, p.getY(i) * fv); return geo; };
      // the body (the user, 12.11.2026: "מה עשית בכתפיים?... נראה יותר שמלה"): a man's, not a bell - broad at the shoulders, flat before
      // and behind (its depth ZS of its breadth - the tunic and all that lies on it), the tunic falling to above the heel ("עד למעלה מן
      // העקב", 8:17) and the bare feet seen below it
      const ZS = 0.66;
      const TUNIC = [V2(0.001, 0.2), V2(0.36, 0.2), V2(0.355, 0.6), V2(0.335, 1.3), V2(0.3, 1.85), V2(0.315, 2.2), V2(0.335, 2.42), V2(0.36, 2.56),
        V2(0.375, 2.61), V2(0.36, 2.66), V2(0.3, 2.72), V2(0.21, 2.77), V2(0.125, 2.8), V2(0.08, 2.815), V2(0.001, 2.815)];
      const robeR = (y) => { for (let i = 2; i < TUNIC.length; i++) { const a = TUNIC[i - 1], b = TUNIC[i]; if (y <= b.y) return lerp(a.x, b.x, clamp((y - a.y) / Math.max(1e-6, b.y - a.y), 0, 1)); } return 0.08; };
      const COL = { linen: 0xf2eee3, hat: 0xf7f4ec, hat2: 0xe9e4d6, shesh: 0xf1ebdc, techelet: 0x2f58a6, argaman: 0x8e1f24, tolaat: 0xc23a30, beltW: 0xe6e0cf,
        skin: 0xc9a07c, beard: 0x35261b, beardW: 0xf4f2ee, beardG: 0xdcd8d0, beardD: 0xbcb6ac, hair: 0xdedad2, levite: 0xd8cfb7, levCap: 0x2a2520 };
      // a fabric of twined threads (the user: "חוט מכל מין יחד שזורים... בעצם יוצר עירוב צבעים"; "האבנט לא מספיק שזור"): the threads
      // across (th pixels each), every thread twined of the kinds - its plies seen as short slanting strokes, each of one kind - the
      // kinds coming in patches along it (the site's picture 194, "אבנט משש חוטים"; model choice). kinds: [colour, weight]
      const twine = (w, h, kinds, seed, th = 4, bias = 1.2, patch = 1, chev = false) => {
        const cv = document.createElement("canvas");
        cv.width = w; cv.height = h;
        const c = cv.getContext("2d"), img = c.createImageData(w, h), d = img.data;
        let sd = seed;
        const rnd = () => (sd = (sd * 16807) % 2147483647) / 2147483647;
        const K = kinds.map(([n, wt]) => [[(n >> 16) & 255, (n >> 8) & 255, n & 255], wt]), GX = 8, GY = 2, grid = K.map(() => Array.from({ length: GX * GY }, rnd));
        const at = (k, i, j) => grid[k][(((j % GY) + GY) % GY) * GX + (((i % GX) + GX) % GX)];
        const noise = (k, x, y) => {
          const gx = (x / w) * GX, gy = (y / h) * GY, i = Math.floor(gx), j = Math.floor(gy), fx = smooth(gx - i), fy = smooth(gy - j);
          return lerp(lerp(at(k, i, j), at(k, i + 1, j), fx), lerp(at(k, i, j + 1), at(k, i + 1, j + 1), fx), fy);
        };
        const hash = (a, b) => { const q = Math.sin(a * 127.1 + b * 311.7 + seed) * 43758.5453; return q - Math.floor(q); };
        for (let y = 0; y < h; y++) {
          const t = Math.floor(y / th), fy = ((y % th) + 0.5) / th;
          for (let x = 0; x < w; x++) {
            const q = x + (chev && t % 2 ? (1 - fy) : fy) * 4 + t * 1.7, seg = Math.floor(q / 4), ph = (q / 4) % 1;   // AVNET_211: chev - a braid
            let best = 0, bv = -1;
            for (let k = 0; k < K.length; k++) { const v = patch * noise(k, x, y) + 0.9 * hash(t * 7 + k, seg) + bias * K[k][1]; if (v > bv) { bv = v; best = k; } }
            const sh = (0.6 + 0.4 * Math.sin(Math.PI * ph)) * (0.76 + 0.24 * Math.sin(Math.PI * fy)), col = K[best][0], o = (y * w + x) * 4;
            d[o] = Math.min(255, col[0] * sh); d[o + 1] = Math.min(255, col[1] * sh); d[o + 2] = Math.min(255, col[2] * sh); d[o + 3] = 255;
          }
        }
        c.putImageData(img, 0, 0);
        return cv;
      };
      const texOf = (cv) => { const t = new CanvasTexture(cv); t.wrapS = t.wrapT = RepeatWrapping; t.colorSpace = SRGBColorSpace; t.anisotropy = 8; return t; };
      // the belt (the user: "יותר מדי הארגמן בולט"; then "לא תיקנת את הצבע... של האבנט"): the techelet the most of it, the white, the two
      // reds (the Rambam 8:13: argaman "הצמר הצבוע אדום", tola'at shani "הצבוע בתולעת") - as the site's 194
      // AVNET_211 (the user, 14.11.2026: "אבנט כהן גדול צריך עירוב צבעים יותר טוב", and the picture of the coiled avnet he sent): finer
      // threads, almost no large patches - every ply its own kind by the weights - in rows leaning one way and the other, as a braid;
      // from a step away the four kinds melt into one mixed hue
      MAT.beltK = std(0xffffff, { map: texOf(twine(256, 64, [[COL.techelet, 0.3], [COL.argaman, 0.24], [COL.tolaat, 0.21], [COL.shesh, 0.25]], 777, 3, 0.55, 0.12, true)), roughness: 0.85 });
      MAT.beltW = std(0xffffff, { map: texOf(twine(256, 64, [[0xf1ece0, 0.5], [0xddd5c2, 0.3], [0xfbf8f1, 0.3]], 99, 3, 0.6, 0.15, true)), roughness: 0.9 });
      // three fingers a turn (24 to the amah; "רחבו כמו שלש אצבעות", Klei HaMikdash 8:19) - AVNET_211 (the user: "אבנט הכהנים רחב יותר"):
      // four turns "כרך על גבי כרך", each a little above the last, so that the band is seen broader and thicker than one turn - model choice
      const BELT_Y = 2.02, BELT_H = 0.19, BELT_TURNS = 4, BELT_BULGE = 0.021;
      // the belt, its own mesh: wound round "כרך על כרך" (10:1; three turns seen, each a little rounded - model choice), of wool and linen,
      // every thread the four kinds twined together - Rashi, Yoma 71b: "דיש בו נמי ארבע מינין וכל אחד כפול ששה וכששוזרן יחד הוו להו כ"ד" -
      // or, for Rabbi Elazar b. R. Shimon, of linen only (TM.belt; the high priest's always of wool and linen: "בשאר ימות השנה — דברי הכל של
      // כלאים", Yoma 12b). No knot nor ends hanging (the user: "מה הקשר של הסרט באפוד ובאבנט? לא קשור")
      const beltG = (() => {
        const r0 = robeR(BELT_Y + BELT_H / 2) + 0.012, prof = [V2(r0 - 0.012, BELT_Y)];
        for (let k = 0; k <= 48; k++) { const u = k / 48; prof.push(V2(r0 + BELT_BULGE * Math.sqrt(Math.sin(Math.PI * ((u * BELT_TURNS) % 1))), BELT_Y + u * BELT_H)); }   // AVNET_211
        prof.push(V2(r0 - 0.012, BELT_Y + BELT_H));
        return uvLathe(new LatheGeometry(prof, 56), 9, 1 / BELT_H).scale(1, 1, ZS);
      })();
      // the hat (the user, 12.11.2026: "המגבעת לא מגבעת"; the site's picture 194, "מגבעת שיטה ב", worn in its picture 498): the cloth wound
      // folds of hanging cloth on a garment round the y axis: its radius waved round, by the height (amp(y))
      const folds = (geo, n, amp) => {
        const p = geo.attributes.position;
        for (let i = 0; i < p.count; i++) {
          const x = p.getX(i), y = p.getY(i), z = p.getZ(i), a = amp(y);
          if (!a) continue;
          const ph = Math.atan2(x, z), k = 1 + a * Math.sin(n * ph + 0.8 * Math.sin(3 * ph + y * 2.1));
          p.setX(i, x * k); p.setZ(i, z * k);
        }
        geo.computeVertexNormals();
        return geo;
      };
      // a geometry mirrored to the other side (x), its faces turned back out
      const gs = (a, b, sa, sb) => Math.exp(-(a * a) / (2 * sa * sa) - (b * b) / (2 * sb * sb));
      // the head (the user: "הפנים... בובתיות"; then "למתוח קצת את הפנים, מדי נמוכות"): an egg taller than it is broad (HD: its half
      // breadth, height and depth; its middle at y); the nose, the brows, the cheekbones, the lower lip and the chin raised, the eyes set
      // in, the jaw narrowing (model choice). headDef: a point of the unit sphere to the head's, both in its units; headAt: a point on it
      // (th round from before, +x the left; ys up) and `off` out from it - the beard and the hair lie on it
      const HD = { a: 0.158, b: 0.232, c: 0.185, y: 3.0 }, HZ = 0.06;   // HZ: the head's middle before the body's
      const headDef = (x, y, z) => {
        if (z > 0) {
          z += 0.15 * gs(x, y + 0.14, 0.07 + 0.09 * clamp(-(y + 0.02) / 0.3, 0, 1), 0.13) * clamp(1 + (y + 0.3) * 7, 0, 1);   // the nose
          z -= 0.06 * (gs(x - 0.33, y + 0.02, 0.11, 0.07) + gs(x + 0.33, y + 0.02, 0.11, 0.07));                              // the eyes set in
          z += 0.035 * gs(0, y - 0.11, 1, 0.06) * (Math.abs(x) < 0.55 ? 1 : 0.4);                                              // the brows
          z += 0.04 * (gs(x - 0.52, y + 0.2, 0.15, 0.13) + gs(x + 0.52, y + 0.2, 0.15, 0.13));                                // the cheekbones
          z += 0.03 * gs(x, y + 0.465, 0.15, 0.035);                                                                            // the lower lip
          z += 0.05 * gs(x, y + 0.78, 0.22, 0.13);                                                                              // the chin
        }
        if (y < -0.35) x *= 1 - 0.3 * (-0.35 - y);   // the jaw
        if (z < 0 && y < -0.3) z *= 1 - 0.38 * smooth(clamp((-0.3 - y) / 0.6, 0, 1));   // the nape, drawn in to the neck
        return [x, y, z];
      };
      const headAt = (th, ys, off) => {
        const rho = Math.sqrt(Math.max(0, 1 - ys * ys)), [x, y, z] = headDef(rho * Math.sin(th), ys, rho * Math.cos(th));
        const n = new Vector3(x / HD.a, y / HD.b, z / HD.c).normalize();
        return new Vector3(x * HD.a, HD.y + y * HD.b, z * HD.c + HZ).addScaledVector(n, off);
      };
      // the neckline lower before than behind - the chin over it (model choice): a garment's top dipped before, zs its flattening
      const neckDip = (geo, zs) => {
        const p = geo.attributes.position;
        for (let i = 0; i < p.count; i++) {
          const x = p.getX(i), y = p.getY(i), z = p.getZ(i);
          if (y <= 2.6 || z <= 0) continue;
          const r = Math.hypot(x, z / zs), c = r > 1e-4 ? z / zs / r : 0;
          p.setY(i, y - 0.07 * smooth(clamp((y - 2.6) / 0.22, 0, 1)) * Math.pow(c, 1.5));
        }
        geo.computeVertexNormals();
        return geo;
      };
      const bodyGeo = (kind) => {   // (HP_KIT_A2: here only "HK" - the high priest's body under the kit's head)
        const lev = kind === "L", parts = [];
        // the tunic, its cloth falling in folds below the belt (the user: "משהו לא חי") - model choice; flat before and behind (ZS)
        const robe = neckDip(folds(new LatheGeometry(TUNIC, 48), 9, (y) => 0.045 * clamp((2.0 - y) / 1.8, 0, 1)).scale(1, 1, ZS), ZS);
        parts.push(tint(lev ? plain(robe) : uvLathe(robe, 8, 3.4), lev ? COL.levite : COL.linen));
        for (const s of [1, -1]) { const dg = new SphereGeometry(1, 16, 10).scale(0.13, 0.05, 0.085).translate(s * 0.36, 2.6, 0); parts.push(tint(lev ? plain(dg) : uvScale(dg, 2, 2), lev ? COL.levite : COL.linen)); }   // the shoulders
        parts.push(tint(plain(new CylinderGeometry(0.066, 0.078, 0.2, 14, 1, true).rotateX(0.2).translate(0, 2.88, 0.02)), COL.skin));   // the neck
        if (kind !== "HK") for (const s of [1, -1]) parts.push(tint(plain(new SphereGeometry(1, 10, 8).scale(0.016, 0.046, 0.03).rotateY(s * 0.35).translate(s * 0.162, 2.985, HZ - 0.012)), COL.skin));   // the ears (TAMID_FIG_207: none on HK)
        if (lev) parts.push(tint(plain(new SphereGeometry(1, 16, 8, 0, Math.PI * 2, 0, HP).scale(0.18, 0.17, 0.2).translate(0, 3.09, HZ)), COL.levCap));
        // his hair, seen between the tzitz and the mitznefet. MITZ_CLOTH_A2: on HK its own mesh, of the kit's hair (figure) - this smooth cap
        // was seen above the tzitz as a part of a helmet
        else if (kind === "H") parts.push(tint(plain(new SphereGeometry(1, 18, 9, 0, Math.PI * 2, 0, 1.0).scale(0.166, 0.246, 0.194).translate(0, 3.0, HZ)), COL.hair));
        // (the priests' migba'at - 55-tamid.js; not here)
        return mergeGeometries(parts);
      };
      // what the beard lies on: the tunic; the high priest's - the robe, and the breastplate on it (in his torso, scaled ZS)
      const MEIL = [[0.3, 0.456], [0.55, 0.45], [1.3, 0.4], [1.85, 0.36], [2.3, 0.39], [2.52, 0.405], [2.62, 0.395], [2.68, 0.37], [2.74, 0.31], [2.83, 0.155]];
      const meilR = (y) => { for (let i = 1; i < MEIL.length; i++) if (y <= MEIL[i][0]) return lerp(MEIL[i - 1][1], MEIL[i][1], clamp((y - MEIL[i - 1][0]) / (MEIL[i][0] - MEIL[i - 1][0]), 0, 1)); return 0; };
      // ---- the high priest in his eight (Rambam, Klei HaMikdash 9 - 10; 10:3 "לובש המעיל. ועל המעיל האפוד והחשן וחוגר בחשב האפוד על
      // המעיל מתחת החשן... ואחר כך צונף במצנפת וקושר הציץ למעלה מן המצנפת ושערו היה נראה בין ציץ למצנפת ושם היה מניח תפלין"):
      //  the robe "כלו תכלת... ואין לו בית יד" (9:3), to the feet (the Ramban 28:31 "עד רגלי האדם"; its opening not drawn), on its hem
      //   "פעמון ורמון פעמון ורמון": 72 bells of gold and as many pomegranates of the three wools (9:4);
      //  the ephod "רחבו כרחב גבו של אדם מכתף לכתף. וארכו מכנגד אצילי הידים מאחוריו עד הרגלים", its band "קשור על לבו תחת החשן", its two
      //   shoulders with a square shoham in gold on each (9:9 - 9:11; the stones' colour a model choice; the names on them not drawn);
      //  the breastplate "זרת על זרת... ארבעה טורים של אבן המפרשים בתורה כל אבן מהן מרבע ומשקע בבית של זהב" (9:6), "על לבו בשוה"
      //   (9:11), the stones of Shemot 28:17 - 20 in their rows, the tribes' names on them "כתולדותם... על האדם ראובן ועל ישפה בנימין" (9:7;
      //   Rashi 28:10, 28:21) and above and below them the Gemara's words (Yoma 73b; the user: as the Gemara); the
      //   first of a row at the viewer's right (model choice: as it is read); the stones' colours are not in the verse - a model choice,
      //   only to tell them apart; the chains of gold from its upper rings to the shoulders, the cords of techelet from its lower rings
      //   under the arms to the ephod's (9:8 - 9:11);
      //  the tzitz "טס של זהב רחב שתי אצבעות ומקיף מאזן לאזן... קדש מלמטה לה' מלמעלה" (9:1);
      //  the mitznefet - TM.mitz: Rashi "כמין כפת כובע" (28:4) "למעלה בגבה הראש ואינה עמקה לכנס בה כל הראש עד המצח", with his three
      //   cords, the middle one over it (28:37); or the Ramban "כעין צניף שצונף בו את ראשו, מגלגל ומחזיר... כפל על כפל" (28:31; the Rambam
      //   8:2 "כמי שלופף על השבר"), with the Rambam's one cord "נקשר... כנגד הערף" (9:2) "למעלה מן המצנפת" (10:3)
      const HEX = (n) => "#" + new Color(n).getHexString();
      const canvasTex = (w, h, draw, rep) => {
        const cv = document.createElement("canvas");
        cv.width = w; cv.height = h;
        draw(cv.getContext("2d"), w, h);
        const t = new CanvasTexture(cv);
        t.colorSpace = SRGBColorSpace;
        t.anisotropy = 4;
        if (rep) { t.wrapS = t.wrapT = RepeatWrapping; t.repeat.set(rep[0], rep[1]); }
        return t;
      };
      const STONES = [["אדם", "ראובן", 0xb3222c], ["פטדה", "שמעון", 0x3f8f4c], ["ברקת", "לוי", 0x1d9a86],
        ["נפך", "יהודה", 0xc8711f], ["ספיר", "דן", 0x2c52b4], ["יהלם", "נפתלי", 0xdce6ec],
        ["לשם", "גד", 0x8d5aa6], ["שבו", "אשר", 0x6d7176], ["אחלמה", "יששכר", 0x9a376a],
        ["תרשיש", "זבולן", 0x2a90b8], ["שהם", "יוסף", 0x2a3331], ["ישפה", "בנימין", 0x63a067]];
      // MITZ_CLOTH_A2 (the user, via the coordinator, 22.11.2026: the mitznefet "נראית כקסדה, ולא מבד"), and then (15:57): "פשוט תיקח את
      // המצנפת שעשית לפני התיקון האחרון ותעשה אותה יותר מבד, מבלי לגעת במבנה שלה" - THE SAME FORM AS BEFORE, OF CLOTH: Rashi's half ball
      // with its ring at the rim, the Ramban's five turns round a band and its low top - their places, sizes and outlines as they were;
      // only their face: a woven texture (a plain weave of fine threads, a few thicker - linen), soft creases and folds on the surface
      // (a few thousandths of an amah - not its outline), darker in the folds and where one turn lies on another and on the ring (the
      // shadow between them), rough and not shiny, linen white. (For a few hours a8eed0f had wound bands in another form - undone.)
      // The folds' number and depth and the texture's scale - model choices. Built once for the kit (mzCloth).
      let MZC = null;
      const mzCloth = () => {
        if (MZC) return MZC;
        const TILE = 0.085;   // amot to the texture's tile - 32 threads across it (a little coarser than linen, that the weave be seen)
        const cv = document.createElement("canvas");
        cv.width = cv.height = 128;
        const c2 = cv.getContext("2d"), img = c2.createImageData(128, 128), d = img.data;
        let sd = 4711;
        const rnd = () => (sd = (sd * 16807) % 2147483647) / 2147483647;
        const slubW = Array.from({ length: 32 }, () => (rnd() < 0.15 ? 0.88 + rnd() * 0.08 : 1)), slubF = Array.from({ length: 32 }, () => (rnd() < 0.15 ? 0.88 + rnd() * 0.08 : 1));
        for (let y = 0; y < 128; y++) for (let x = 0; x < 128; x++) {
          const i = x >> 2, j = y >> 2, u = ((x & 3) + 0.5) / 4, w = ((y & 3) + 0.5) / 4;   // over and under: the warp (along y) or the weft (along x) on top
          const sh = ((i + j) & 1 ? 0.7 + 0.3 * Math.sin(Math.PI * u) * slubW[i] : 0.7 + 0.3 * Math.sin(Math.PI * w) * slubF[j]) * (0.96 + 0.07 * rnd()), o = (y * 128 + x) * 4;
          d[o] = Math.min(255, 262 * sh); d[o + 1] = Math.min(255, 259 * sh); d[o + 2] = Math.min(255, 250 * sh); d[o + 3] = 255;
        }
        c2.putImageData(img, 0, 0);
        const tex = texOf(cv), bump = new CanvasTexture(cv);
        bump.wrapS = bump.wrapT = RepeatWrapping;
        bump.anisotropy = 8;
        const mat = std(0xffffff, { vertexColors: true, map: tex, bumpMap: bump, bumpScale: 1.3, roughness: 0.97, metalness: 0, side: DoubleSide });   // (the band's end lifts - its underside seen)
        // a piece made cloth: its texture's coordinates to the weave's scale (su, sv tiles), each point moved out along its normal by
        // dz(p) (the creases - small) and coloured lin * ao(p) (the shadow in them and between the pieces)
        const _n = new Vector3(), _p = new Vector3();
        const cloth = (geo, su, sv, dz, ao, lin = 1) => {
          geo.computeVertexNormals();
          const P = geo.attributes.position, N = geo.attributes.normal, U = geo.attributes.uv, col = new Float32Array(P.count * 3);
          for (let i = 0; i < P.count; i++) {
            _p.fromBufferAttribute(P, i); _n.fromBufferAttribute(N, i);
            const a = ao(_p), k = lin * a;
            _p.addScaledVector(_n, dz(_p));
            P.setXYZ(i, _p.x, _p.y, _p.z);
            col[i * 3] = k; col[i * 3 + 1] = k * 0.993; col[i * 3 + 2] = k * 0.975;
            U.setXY(i, U.getX(i) * su, U.getY(i) * sv);
          }
          geo.setAttribute("color", new BufferAttribute(col, 3));
          geo.computeVertexNormals();
          return geo;
        };
        const smo = (a, b, x) => { const t = clamp((x - a) / (b - a), 0, 1); return t * t * (3 - 2 * t); };
        // MITZ_REF_A2 (the user's pictures of the high priest, 22.11.2026 - via the coordinator: "מצנפת רחבה ונמוכה, כמו כרית עגולה
        // גדולה או כיפה תפוחה — רחבה בהרבה מן הראש... למטה — גליל עבה כרוך סביב הראש, מעל המצח; מעליו כיפה תפוחה ומעוגלת, עם קווי
        // קפלים אופקיים של כריכות. הראש מכוסה לגמרי"): one outline (the frame hd, its round deeper than broad - EZ): a thick roll round
        // the head over the forehead, and over it a puffed dome, about one and a half times the head's breadth, over the ears, its top
        // rounded; its height about half the face's. The two readings the same outline and size - Rashi's ("כמין כפת כובע") its dome
        // smoother, the Ramban's ("כפל על כפל") its turns plain: grooves round it, deeper. On it soft gathers, a little uneven; darker
        // in the grooves, under the dome where it overhangs and where it meets the roll. Sizes and the grooves - model choices.
        const EZ = 1.09;
        // (measured on the picture: its breadth about 1.5 the head's, its height about two thirds of its breadth - about the face's
        // height). MITZ_HAIR_A2 (the coordinator, from the sources: "תנא: שערו היה נראה בין ציץ למצנפת" - Zevachim 19a, 130:741; Rashi on
        // Shemot 28:37, 3692:2050; the Ramban, 3627:713 "היה מניח גם מקצת שער ראשו כנגד פניו לתפלין"; and so in the user's picture): its
        // foot over the hairline, a band of hair seen between it and the tzitz, about as high as the tefillin's box on it - its lower edge
        // touching the box's top (the coordinator, on picture 47: "פס השיער צר, בערך בגובה בית התפילין")
        // MITZ_SHAPE_A2 (the coordinator, on 47 and 50 - "מה זה השטריימל הזה?"; measured against the picture at the same face size): ONE
        // body - its outline one smooth convex line, no step and no shelf: its lower edge on the head at the start of the hair, as broad as
        // the head with its hair (about 1.1), widening softly to its broadest (about 1.4) a third of the way up, and round from there to the
        // top - as a dome or an onion, not a roll with a lid; its height about the face's (until now a roll and a cushion over it)
        // (overlaid on the picture: its lower edge comes down at the sides and behind to the tzitz's level - over the temples, the band of
        // hair seen only before, about the box; its top lower than a ball's: SIDE_DROP and the points below)
        const KEY = [[0.13, 0.103], [0.184, 0.105], [0.226, 0.138], [0.253, 0.18], [0.262, 0.222], [0.257, 0.262], [0.238, 0.302], [0.203, 0.342], [0.149, 0.373], [0.078, 0.393], [0.0005, 0.399]];
        const SIDE_DROP = 0.05;
        const PROF = new CatmullRomCurve3(KEY.map(([r, y]) => new Vector3(r, y, 0)), false, "centripetal").getSpacedPoints(90);
        const DOME0 = 1;   // MITZ_SHAPE_A2: one body - all of it the dome   // where the dome begins (over the roll)
        let LEN = 0;
        const ARC = PROF.map((q, k) => (k ? (LEN += q.distanceTo(PROF[k - 1])) : 0));
        // MITZ_RELIEF_A2 (the user, on picture 47: "מה זה השטריימל הזה?" - the wound layers stood out as tyres; on 46: "המצנפת יותר
        // טובה"): the outline of 46 (a dome over a roll, sitting on the head), and the band's winding only as a low relief on it - one band
        // wound up round it, a little aslant (a spiral: turns to the outline), each layer's lower edge a little over the one below and
        // sinking under the next at its top: depth - its height, a share of the radius (one or two hundredths); the shadow under each
        // edge soft. Its outline does not change (within depth / 2)
        const puffy = (turns, depth, seed) => {
          const nT = 120, pos = [], col = [], uv = [], idx = [], nP = PROF.length;
          for (let j = 0; j < nP; j++) {
            const q = PROF[j], sd = j < DOME0 ? -1 : (j - DOME0) / (nP - 1 - DOME0), crease = j >= DOME0 - 2 && j <= DOME0 + 2 ? 1 - Math.abs(j - DOME0) / 3 : 0;
            const vv = ARC[j] / LEN, fade = smo(0.97, 0.88, vv) * smo(0, 0.03, vv);
            const under = sd >= 0 && sd < 0.22 ? smo(0.22, 0, sd) : 0;
            for (let k = 0; k <= nT; k++) {
              const th = (k / nT) * Math.PI * 2, ph = turns * vv - th / (Math.PI * 2) + 0.08 * Math.sin(2 * th + seed) + 0.04 * Math.sin(3 * th + 2 * seed), f = ph - Math.floor(ph);   // aslant, in arcs
              const h = f < 0.1 ? 0.7 + 3 * f : 1 - (f - 0.1) / 0.9;   // the layer: its edge raised, sinking to its top under the next
              const gath = 0.003 * Math.sin(9 * th + seed + 5 * vv + 0.7 * Math.sin(2 * th)) * fade;
              const r = q.x * (1 + depth * (h - 0.5) * fade + gath + 0.005 * Math.sin(2 * th + seed) * fade);
              const cf = Math.max(0, Math.cos(th)), dropW = (1 - cf * cf) * smo(0.32, 0, vv);   // lower at the sides and behind, near its edge
              pos.push(r * Math.sin(th) * (1 + 0.06 * dropW), q.y - SIDE_DROP * dropW, r * EZ * Math.cos(th) * (1 + 0.04 * dropW));
              const ao = (1 - 0.32 * smo(0.72, 1, f) * fade) * (1 - 0.3 * under) * (1 - 0.35 * crease) * (j < DOME0 ? 0.96 : 1);
              col.push(ao, ao * 0.993, ao * 0.975);
              uv.push((th * 0.22) / TILE, ARC[j] / TILE);
            }
          }
          for (let j = 0; j < nP - 1; j++) for (let k = 0; k < nT; k++) { const a = j * (nT + 1) + k, b = a + nT + 1; idx.push(a, a + 1, b, a + 1, b + 1, b); }
          const g = new BufferGeometry();
          g.setAttribute("position", new Float32BufferAttribute(pos, 3));
          g.setAttribute("color", new Float32BufferAttribute(col, 3));
          g.setAttribute("uv", new Float32BufferAttribute(uv, 2));
          g.setIndex(idx);
          g.computeVertexNormals();
          // the seam (th 0 and 2 pi) one normal
          const nn = g.attributes.normal, w3 = new Vector3();
          for (let j = 0; j < nP; j++) { const a = j * (nT + 1), b = a + nT; w3.set(nn.getX(a) + nn.getX(b), nn.getY(a) + nn.getY(b), nn.getZ(a) + nn.getZ(b)).normalize(); nn.setXYZ(a, w3.x, w3.y, w3.z); nn.setXYZ(b, w3.x, w3.y, w3.z); }
          return g;
        };
        // MITZ_WOUND_A2 (the user, on picture 46: "להראות את הכריכה של המצנפת" - one long band wound round the head, layer on layer; the
        // Rambam, Klei HaMikdash 8:2, 338:124 "כהן גדול צונף בה כמי שלופף על השבר", 8:19, 338:141 "ארכו שש עשרה אמות"): its winding as
        // the low relief of puffy (MITZ_RELIEF_A2) - Rashi's ("כמין כפת כובע") fainter, the Ramban's ("כפל על כפל") a little deeper
        const RT = 0, BT = 0;
        const rashiG = puffy(6, 0.016, 1.3);
        // a point on its face (th 0 before, along +z), out along it by off - for the cords
        const at = (j, th, off) => { const q = PROF[Math.max(0, Math.min(PROF.length - 1, j))], r = q.x + off; return [r * Math.sin(th), q.y + off * 0.3, r * EZ * Math.cos(th)]; };
        MZC = { mat, rashiG, at, nP: PROF.length, dome0: DOME0, out: 0.0035 + RT * 1.8 };
        return MZC;
      };
      // MITZ_RAMBAN_M (the user, 23.11.2026: "צריך להיות שמשתפל לאחריו כמין מטפחת"; the coordinator's specification, approved, with
      // the user's decision 203): THE MITZNEFET BY THE RAMBAN - a wreath of turns round the head, not a cap. The Ramban on Shemot 28:37
      // (3627:713): "והנה היה צונף המצנפת סביב הראש, לא על המצח כלל, אלא למעלה במקום שער... היה מניח גם מקצת שער ראשו כנגד פניו לתפלין.
      // והיתה הצניפה בגבה שבראש כנגד המוח האמצעי, והוא מכסה בה כל הראש כנגד אחוריו... בשפוע... אבל מאזן לאזן מאחוריו כנגד כל הערף
      // תהיה המצנפת, והפתיל שנקשר בו יבא עליה"; on 28:31 (3627:709) "מגלגל ומחזיר מגלגל ומחזיר סביב ראשו כפל על כפל" (sixteen amot -
      // about fifteen turns round this head); on 29:7 (3627:721) "אבל הנכון שהיתה הצניפה סביב סביב ואמצע הראש מגלה ועליו יצק השמן".
      // So: its lower edge before on the hair above the tefillin (not on the forehead), along the band of hair over the tzitz to the
      // tzitz's end, over the ear and down right behind it, and behind down to the nape - all the back of the head covered, from ear to
      // ear; high before (3 fingers, about 1.2 thick), lying on the back of the head behind as a kerchief (about half a finger thick);
      // the turns seen as 8 soft steps (each two turns), close before and spread behind - sloping back; the middle of the head open,
      // its hair seen (an opening of about 5 fingers by 3.5); the band's end tucked in (none hanging). Under it, between it and the
      // head, the hair and the head's tefillin strap with its knot at the nape (the user's rule for the kippah, 03:47: the strap round
      // the head under the rim): its inner face laid outside all of them - the kit's hair (tm_face hairR), the cap of hair over the
      // crown (GHC, below) and the strap and knot themselves (tef: the head's tefillin geometry) - with a margin. Built in the head's
      // own frame (its middle at 0; the high priest's head is the kit's, 1.3 times - 1 unit = 1.3 amot = 31.2 fingers), once for a kit.
      // The wreath's height, the turns' thickness and the opening's size - model choices.
      let RBW = null;
      const rbWreath = (tefGeo) => {
        if (RBW) return RBW;
        const MZ = mzCloth(), FACE = typeof tm_face === "function" ? tm_face() : null;
        const smo = (a, b, x) => { const t = clamp((x - a) / (b - a), 0, 1); return t * t * (3 - 2 * t); };
        const DEG = Math.PI / 180, FG = 1 / 31.2;   // a degree; a finger in head units
        // the kit's skull (as face.js headR) - if there is no tm_face (never in the plugin)
        const skull = (th, y) => { const yn = clamp(y / 0.16, -0.999, 0.999), j = yn < 0 ? yn * yn : 0; return Math.sqrt(1 - yn * yn) / Math.hypot(Math.sin(th) / (0.128 * (1 - 0.2 * j)), Math.cos(th) / (0.14 * (1 - 0.1 * j))); };
        const hairR = FACE && FACE.hairR ? (th, y) => FACE.hairR(th, y) : (th, y) => skull(th, y) + 0.016;
        // GHC (figure(), below): the cap of hair over the crown - an ellipsoid (0.166, 0.246, 0.194) about the head's middle, down to 1 radian
        // from its top (GY0); in head units. Below its rim the cloth comes softly in to the hair (no step in its inner face)
        const GA = [0.166 / 1.3, 0.246 / 1.3, 0.194 / 1.3], GY0 = GA[1] * Math.cos(1.0);
        const ell = (th, y) => Math.sqrt(Math.max(0, 1 - (y / GA[1]) * (y / GA[1]))) / Math.hypot(Math.sin(th) / GA[0], Math.cos(th) / GA[2]);
        const base = (th, y) => { const h = hairR(th, y); if (y < GY0 - 0.04) return h; return Math.max(h, lerp(h, ell(th, Math.max(y, GY0)), smo(GY0 - 0.04, GY0, y))); };
        // the head's tefillin under the cloth - the strap behind the ears, its knot and its two ends at the nape (before, from 50 degrees
        // on each side, the box, its passage and the strap's start are not under it: the lower edge is above them) - binned round (2
        // degrees) and up (0.004): the farthest out in each; spread to the neighbouring bins and smoothed (the cloth goes softly over them)
        const NB = 180, Y0 = -0.24, DY = 0.004, NY = 125, TB = new Float32Array(NB * NY);
        const tefTop = new Float32Array(NB).fill(-1);   // the tefillin's highest point in each bin (the lower edge above it before)
        if (tefGeo) {
          const P = tefGeo.attributes.position;
          for (let i = 0; i < P.count; i++) {
            const x = P.getX(i), y = P.getY(i), z = P.getZ(i), r = Math.hypot(x, z), th = Math.atan2(x, z);
            const b = Math.min(NB - 1, Math.floor(((th + Math.PI) / (2 * Math.PI)) * NB)), j = Math.floor((y - Y0) / DY);
            if (y > tefTop[b]) tefTop[b] = y;
            if (Math.abs(th) < 50 * DEG) continue;
            if (j >= 0 && j < NY) TB[b * NY + j] = Math.max(TB[b * NY + j], r);
          }
          const pass = (f) => { const T2 = new Float32Array(NB * NY); for (let b = 0; b < NB; b++) for (let j = 0; j < NY; j++) T2[b * NY + j] = f(b, j); TB.set(T2); };
          const at = (b, j) => (j < 0 || j >= NY ? 0 : TB[((b + NB) % NB) * NY + j]);
          pass((b, j) => { let m = 0; for (let db = -3; db <= 3; db++) for (let dj = -2; dj <= 2; dj++) m = Math.max(m, at(b + db, j + dj)); return m; });
          pass((b, j) => { let m = 0; for (let db = -3; db <= 3; db++) for (let dj = -2; dj <= 2; dj++) m += at(b + db, j + dj); return m / 35; });
        }
        const tefR = (th, y) => {
          const fb = ((th + Math.PI) / (2 * Math.PI)) * NB - 0.5, fj = (y - Y0) / DY - 0.5, b0 = Math.floor(fb), j0 = Math.floor(fj), u = fb - b0, v = fj - j0;
          const g = (b, j) => (j < 0 || j >= NY ? 0 : TB[((b + NB) % NB) * NY + j]);
          return (g(b0, j0) * (1 - u) + g(b0 + 1, j0) * u) * (1 - v) + (g(b0, j0 + 1) * (1 - u) + g(b0 + 1, j0 + 1) * u) * v;
        };
        const M = 0.004;   // the margin between the cloth and what is under it (0.12 finger)
        const rIn = (th, y) => Math.max(base(th, y), tefR(th, y)) + M;
        const topAt = (th) => { const f = ((th + Math.PI) / (2 * Math.PI)) * NB - 0.5, b0 = Math.floor(f), u = f - b0; let m = -1; for (let d = -2; d <= 3; d++) m = Math.max(m, tefTop[(b0 + d + NB) % NB]); return m; };
        // a smooth curve through keys [degrees, value] (symmetric: |th|)
        const curve = (K) => (th) => {
          const d = Math.abs(th) / DEG;
          for (let i = 1; i < K.length; i++) if (d <= K[i][0]) { const u = smo(0, 1, (d - K[i - 1][0]) / (K[i][0] - K[i - 1][0])); return lerp(K[i - 1][1], K[i][1], u); }
          return K[K.length - 1][1];
        };
        // the lower edge: before at 4.4 fingers over the eyes' height - and in any case 0.005 above the tefillin there (the box's top, its
        // passage, the strap going out of it); over the band of hair above the tzitz (its top at 0.091) to its end at 90 degrees; over the
        // ear (its top at 0.0285, between 86 and 103 degrees) still above the tefillin's strap - the coordinator's decision 34: the strap
        // seen over the ear, where there is hair, and under the cloth from right behind the ear; then down behind the ear, and behind at
        // the nape's hair edge (-0.106)
        let front = 4.4 * FG;
        for (let b = 0; b < NB; b++) { const th = ((b + 0.5) / NB) * 2 * Math.PI - Math.PI; if (Math.abs(th) < 32 * DEG) front = Math.max(front, tefTop[b] + 0.005); }   // (level before: no bump over the box's corners)
        const yLk = curve([[0, front], [30, front], [60, 0.124], [80, 0.112], [90, 0.106], [97, 0.1], [101, 0.093], [104, 0.07], [107, 0.036], [110, 0.006], [120, -0.048], [140, -0.092], [160, -0.104], [180, -0.106]]);
        const yL = (th) => { const a = Math.abs(th); let y = yLk(th) + 0.0015 * Math.sin(5 * th + 0.7) * smo(100 * DEG, 130 * DEG, a); if (a < 91 * DEG) y = Math.max(y, topAt(th) + 0.005); return y; };
        // the rim (the opening's edge): seen from above an ellipse about the head's axis - 0.058 to each side, 0.07 before and 0.09 behind
        // it (about 3.6 by 5 fingers); its height on a plane sloping down to the back - before 3 fingers over the lower edge, behind where
        // it lies on the hair. So the band stands before (leaning back about 16 degrees) and at the sides (leaning in), and lies on the
        // back of the head behind - its top edge going down evenly from before to behind, as its turns
        const OX = 0.058, OZ = 0.08, OC = -0.01;
        const rOpen = (th) => { const s = Math.sin(th), c = Math.cos(th), A = (s * s) / (OX * OX) + (c * c) / (OZ * OZ), B = (2 * c * -OC) / (OZ * OZ), C = (OC * OC) / (OZ * OZ) - 1; return (-B + Math.sqrt(B * B - 4 * A * C)) / (2 * A); };
        const ySolve = (th, ro) => { let a = -0.06, b = 0.2; for (let k = 0; k < 40; k++) { const m = (a + b) / 2; if (rIn(th, m) > ro) a = m; else b = m; } return (a + b) / 2; };
        const smax = (a, b, k) => Math.max(a, b) + Math.pow(Math.max(0, k - Math.abs(a - b)), 2) / (4 * k);
        const ZB = -rOpen(Math.PI), YB = ySolve(Math.PI, rOpen(Math.PI)), TAN = (front + 3 * FG - YB) / (rOpen(0) - ZB);   // the rim behind; the plane's slope
        const yPlane = (th) => YB + TAN * (rOpen(th) * Math.cos(th) - ZB);
        // the thickness: 1.2 fingers before, half a finger behind
        const thick = (th) => lerp(0.5 * FG, 1.2 * FG, Math.pow(0.5 + 0.5 * Math.cos(th), 1.4));
        // the section at th: the inner face (against the head) from the lower edge (s 0) to the rim (s 1) - the straight way from edge to
        // rim, but never nearer the axis than the head and what is on it (rIn); its hollows filled (the cloth is stretched over them),
        // and its normal in the (r, y) plane - out along it the outer face
        const NF = 56, SEC = new Map();
        const section = (th) => {
          const key = Math.round(th * 1e5);
          let S = SEC.get(key);
          if (S) return S;
          const yl = yL(th), rl = rIn(th, yl);
          const rr = rOpen(th), ys = ySolve(th, rr), yu = smax(ys, yPlane(th), 0.004), ru = Math.max(rr, rIn(th, yu));
          const R0 = new Float32Array(NF + 1), Y = new Float32Array(NF + 1), R = new Float32Array(NF + 1);
          for (let i = 0; i <= NF; i++) { const s = i / NF; Y[i] = lerp(yl, yu, s); R0[i] = smax(rIn(th, Y[i]), lerp(rl, ru, s), 0.006); R[i] = R0[i]; }
          for (let it = 0; it < 40; it++) for (let i = 1; i < NF; i++) R[i] = Math.max(R0[i], 0.5 * (R[i - 1] + R[i + 1]));
          const NR = new Float32Array(NF + 1), NY2 = new Float32Array(NF + 1);
          for (let i = 0; i <= NF; i++) { const i0 = Math.max(0, i - 1), i1 = Math.min(NF, i + 1); let nr = Y[i1] - Y[i0], ny = -(R[i1] - R[i0]); const l = Math.hypot(nr, ny) || 1; NR[i] = nr / l; NY2[i] = ny / l; }
          S = { yl, yu, rl, ru, Y, R, NR, NY: NY2 };
          SEC.set(key, S);
          return S;
        };
        const prof = (s) => Math.sqrt(Math.max(0, 1 - Math.pow(Math.abs(2 * s - 1), 8)));   // its two edges rolled round (the lowest turn's fold, the top one's)
        const STEPS = 8;
        // the steps: a layer's lower edge a little raised, sinking under the next at its top; a spiral (one step to a turn round), a little
        // uneven - as a long band wound (8 steps, each two of the about fifteen turns); fade: none at the edges
        const step = (th, s) => {
          const ph = STEPS * s - th / (2 * Math.PI) + 0.07 * Math.sin(2 * th + 1.9) + 0.035 * Math.sin(3 * th + 4.2), f = ph - Math.floor(ph);
          return { f, h: f < 0.22 ? smo(0, 0.22, f) : 1 - 0.85 * smo(0.22, 1, f), fade: smo(0, 0.07, s) * smo(1, 0.9, s) };
        };
        const outerOff = (th, s) => {
          const st = step(th, s), A = lerp(0.0034, 0.0036, 0.5 + 0.5 * Math.cos(th));   // (the steps soft - not tyres: MITZ_RELIEF_A2)
          return thick(th) * prof(s) + A * (st.h - 0.5) * st.fade * prof(s) + 0.0007 * Math.sin(7 * th + 5 * s + 0.6 * Math.sin(3 * th)) * st.fade;
        };
        // a point of the section at s, out along its normal by off
        const pt = (th, s, off) => {
          const S = section(th), f = clamp(s, 0, 1) * NF, i = Math.min(NF - 1, Math.floor(f)), u = f - i;
          const r = lerp(S.R[i], S.R[i + 1], u), y = lerp(S.Y[i], S.Y[i + 1], u);
          let nr = lerp(S.NR[i], S.NR[i + 1], u), ny = lerp(S.NY[i], S.NY[i + 1], u); const l = Math.hypot(nr, ny) || 1; nr /= l; ny /= l;
          const rr = r + nr * off;
          return [rr * Math.sin(th), y + ny * off, rr * Math.cos(th)];
        };
        // the mesh: rings round (NT) of the closed section - out along the outer face from the lower edge to the rim, and back along the
        // inner face (NO points each way)
        const NT = 160, NO = 72, NI = 22, TILE = 0.085 / 1.3, pos = [], col = [], uv = [], idx = [], ring = NO + NI + 1;
        for (let i = 0; i <= NT; i++) {
          const th = (i / NT) * 2 * Math.PI - Math.PI;
          let arc = 0, prev = null;
          for (let k = 0; k < ring; k++) {
            let p, ao;
            if (k <= NO) {
              const s = k / NO, st = step(th, s);
              p = pt(th, s, outerOff(th, s));
              ao = (1 - 0.2 * smo(0.5, 1, st.f) * st.fade) * (1 - 0.12 * smo(0.12, 0, s)) * (1 - 0.08 * smo(0.85, 1, s));
            } else {
              const s = 1 - (k - NO) / (NI + 1);
              p = pt(th, s, 0);
              ao = 0.86;
            }
            if (prev) arc += Math.hypot(p[0] - prev[0], p[1] - prev[1], p[2] - prev[2]);
            prev = p;
            pos.push(p[0], p[1], p[2]);
            col.push(ao, ao * 0.993, ao * 0.975);
            uv.push(((th + Math.PI) * 0.13) / TILE, arc / TILE);
          }
        }
        for (let i = 0; i < NT; i++) for (let k = 0; k < ring; k++) {
          const a = i * ring + k, b = a + ring, a1 = i * ring + ((k + 1) % ring), b1 = a1 + ring;
          idx.push(a, b, a1, a1, b, b1);
        }
        const g = new BufferGeometry();
        g.setAttribute("position", new Float32BufferAttribute(pos, 3));
        g.setAttribute("color", new Float32BufferAttribute(col, 3));
        g.setAttribute("uv", new Float32BufferAttribute(uv, 2));
        g.setIndex(idx);
        g.computeVertexNormals();
        const nn = g.attributes.normal, w3 = new Vector3();   // the seam behind (th -pi and pi) one normal
        for (let k = 0; k < ring; k++) { const a = k, b = NT * ring + k; w3.set(nn.getX(a) + nn.getX(b), nn.getY(a) + nn.getY(b), nn.getZ(a) + nn.getZ(b)).normalize(); nn.setXYZ(a, w3.x, w3.y, w3.z); nn.setXYZ(b, w3.x, w3.y, w3.z); }
        // a point on the outer face at th, at the height y (its s from the inner face), out by off - for the cord
        const onCloth = (th, y, off) => { const S = section(th), s = clamp((y - S.yl) / (S.yu - S.yl), 0, 1); return pt(th, s, outerOff(th, s) + off); };
        RBW = { geo: g, onCloth, section, rIn, front, yL };
        return RBW;
      };
      const buildHP = (f) => {
        const L = f.lean, out = {}, TILE = 0.42;   // TILE: amot to the ephod's texture
        const T = new Group();   // his torso: all that lies on the tunic, flat as it (ZS)
        T.scale.z = ZS;
        L.add(T);
        const mk = (geo, mat, x = 0, y = 0, z = 0, par = T) => { const m = new Mesh(geo, mat); m.position.set(x, y, z); m.castShadow = true; par.add(m); return m; };
        const tube = (pts, r, mat) => mk(new TubeGeometry(new CatmullRomCurve3(pts.map((p) => new Vector3(p[0], p[1], p[2]))), Math.max(10, pts.length * 7), r, 5, false), mat);
        // a cord of plies twined round its path (the user: "פתיל, לא צינור"): the cords of techelet two plies, the chains of gold three
        // ("מעשה עבת. מעשה קליעת חוטין", Rashi 28:14)
        const cord = (pts, r, mat, plies = 2, pitch = 0.028) => {
          const curve = new CatmullRomCurve3(pts.map((p) => new Vector3(p[0], p[1], p[2])));
          const len = curve.getLength(), n = Math.max(24, Math.ceil(len / 0.005)), fr = curve.computeFrenetFrames(n, false), geos = [];
          for (let k = 0; k < plies; k++) {
            const ps = [];
            for (let i = 0; i <= n; i++) {
              const u = i / n, th = (u * len / pitch) * Math.PI * 2 + k * Math.PI * 2 / plies;
              ps.push(curve.getPointAt(u).addScaledVector(fr.normals[i], Math.cos(th) * r * 0.55).addScaledVector(fr.binormals[i], Math.sin(th) * r * 0.55));
            }
            geos.push(new TubeGeometry(new CatmullRomCurve3(ps), n, r * 0.56, 5, false));
          }
          return mk(mergeGeometries(geos), mat);
        };
        const ribbon = (pts, w, mat) => {   // a flat band along a path, its width along x
          const P = new CatmullRomCurve3(pts.map((p) => new Vector3(p[0], p[1], p[2]))).getPoints(30), pos = [], uv = [], idx = [];
          let len = 0;
          P.forEach((p, i) => { if (i) len += p.distanceTo(P[i - 1]); pos.push(p.x - w / 2, p.y, p.z, p.x + w / 2, p.y, p.z); uv.push(0, len / TILE, w / TILE, len / TILE); if (i) { const k = i * 2; idx.push(k - 2, k - 1, k, k - 1, k + 1, k); } });
          const g = new BufferGeometry();
          g.setAttribute("position", new Float32BufferAttribute(pos, 3));
          g.setAttribute("uv", new Float32BufferAttribute(uv, 2));
          g.setIndex(idx);
          g.computeVertexNormals();
          return mk(g, mat);
        };
        const M = {
          techelet: std(COL.techelet, { roughness: 0.75, side: DoubleSide }),
          // "חמשת מינים הללו שזורין בכל חוט וחוט... ואחר כך שוזר את כלם כאחד" (Rashi 28:6): its threads twined (twine), the ground red with
          // the gold between; the figures of "מעשה חשב" in techelet - flowers and leaves on a vine, as the site the user sent (its picture
          // 191: red, its figures blue; model choice). The user: "הצבע של האפוד גם לא נכון"
          ephod: std(0xffffff, { roughness: 0.6, metalness: 0.12, side: DoubleSide, map: (() => {
            const S = 256, cv = twine(S, S, [[COL.techelet, 0.3], [COL.argaman, 0.14], [COL.tolaat, 0.16], [COL.shesh, 0.26], [0xd8b04c, 0.14]], 31, 3, 1.2, 0.45), c = cv.getContext("2d");
            const NAVY = "rgba(36,52,120,0.78)", BLUE = "rgba(96,124,200,0.85)", EDGE = "rgba(232,206,130,0.75)";
            const flower = (x, y, R, rot) => {
              for (let k = 0; k < 6; k++) {
                const an = rot + (k * Math.PI) / 3, px = x + Math.cos(an) * R * 0.55, py = y + Math.sin(an) * R * 0.55;
                c.fillStyle = NAVY; c.beginPath(); c.ellipse(px, py, R * 0.52, R * 0.27, an, 0, Math.PI * 2); c.fill();
                c.strokeStyle = EDGE; c.lineWidth = 1.2; c.stroke();
                c.fillStyle = BLUE; c.beginPath(); c.ellipse(px, py, R * 0.3, R * 0.11, an, 0, Math.PI * 2); c.fill();
              }
              c.fillStyle = "#e3bd52"; c.beginPath(); c.arc(x, y, R * 0.2, 0, Math.PI * 2); c.fill();
            };
            const leaf = (x, y, an, l) => {
              c.fillStyle = NAVY; c.beginPath(); c.ellipse(x, y, l, l * 0.36, an, 0, Math.PI * 2); c.fill();
              c.strokeStyle = BLUE; c.lineWidth = 1; c.beginPath(); c.moveTo(x - Math.cos(an) * l * 0.8, y - Math.sin(an) * l * 0.8); c.lineTo(x + Math.cos(an) * l * 0.8, y + Math.sin(an) * l * 0.8); c.stroke();
            };
            for (const ox of [-S, 0, S]) for (const oy of [-S, 0, S]) {   // drawn round, so that the tile repeats whole
              c.save(); c.translate(ox, oy);
              c.strokeStyle = NAVY; c.lineWidth = 3.2;
              for (const [x0, y0, x1, y1, cx, cy] of [[64, 64, 192, 192, 160, 80], [64, 64, -64, 192, -40, 90], [192, 192, 320, 320, 290, 210], [192, 192, 64, 320, 90, 300]]) { c.beginPath(); c.moveTo(x0, y0); c.quadraticCurveTo(cx, cy, x1, y1); c.stroke(); }
              for (const [x, y, an] of [[120, 92, 0.4], [150, 150, -0.9], [228, 230, 2.2], [40, 140, 1.9], [100, 220, -0.6], [215, 120, 0.9], [20, 40, 2.6], [150, 20, 0.2]]) leaf(x, y, an, 17);
              flower(64, 64, 34, 0.2); flower(192, 192, 34, 0.7); flower(192, 64, 15, 0); flower(64, 192, 15, 0.5);
              c.restore();
            }
            return texOf(cv);
          })() }),
          shoham: std(0x1f6450, { roughness: 0.14, metalness: 0.1 }),
          pom: std(0x86304a, { roughness: 0.8 })
        };
        // the robe and its hem
        // the robe: "ואין לו בית יד אלא נחלק לשתי כנפים מסוף הגרון עד למטה כדרך כל המעילים ואינו מחבר אלא כנגד כל הגרון בלבד" (9:3; the
        // user: "אין ידיים") - two wings, before and behind, joined only round the neck; the arms out between them
        {
          const prof = MEIL;
          const rows = [];
          for (let i = 1; i < prof.length; i++) { const n = Math.max(1, Math.round((prof[i][0] - prof[i - 1][0]) / 0.06)); for (let k = i === 1 ? 0 : 1; k <= n; k++) rows.push([lerp(prof[i - 1][0], prof[i][0], k / n), lerp(prof[i - 1][1], prof[i][1], k / n)]); }
          const NX = 64, pos = [], idx = [];
          rows.forEach(([y, r]) => { for (let i = 0; i <= NX; i++) { const ph = (i / NX) * Math.PI * 2, k = 1 + 0.032 * clamp((2.0 - y) / 1.7, 0, 1) * Math.sin(8 * ph + 0.7 * Math.sin(3 * ph)); pos.push(Math.sin(ph) * r * k, y - 0.07 * smooth(clamp((y - 2.6) / 0.23, 0, 1)) * Math.pow(Math.max(0, Math.cos(ph)), 1.5), Math.cos(ph) * r * k); } });
          for (let j = 0; j < rows.length - 1; j++) {
            const ym = (rows[j][0] + rows[j + 1][0]) / 2;
            for (let i = 0; i < NX; i++) {
              const ph = ((i + 0.5) / NX) * Math.PI * 2, side = Math.min(Math.abs(ph - HP), Math.abs(ph - 3 * HP));
              if (ym < 2.74 && side < 0.3) continue;   // between the wings
              const p0 = j * (NX + 1) + i, p1 = p0 + NX + 1;
              idx.push(p0, p0 + 1, p1, p1, p0 + 1, p1 + 1);
            }
          }
          const mg = new BufferGeometry();
          mg.setAttribute("position", new Float32BufferAttribute(pos, 3));
          mg.setIndex(idx);
          mg.computeVertexNormals();
          mk(mg, M.techelet);
        }
        const bellG = new LatheGeometry([V2(0.023, -0.016), V2(0.02, -0.012), V2(0.016, 0.006), V2(0.011, 0.02), V2(0.001, 0.022)], 8);
        const bells = new InstancedMesh(bellG, MAT.gold, 72), poms = new InstancedMesh(new SphereGeometry(0.019, 8, 6).scale(1, 1.35, 1), M.pom, 72);
        const m4 = new Matrix4();
        for (let w = 0; w < 2; w++) for (let i = 0; i < 72; i++) {   // each wing: from its one edge to the other, bell and pomegranate by turns
          const an = -HP + 0.3 + (i / 71) * (Math.PI - 0.6) + w * Math.PI;
          m4.makeTranslation(Math.sin(an) * 0.461, 0.272, Math.cos(an) * 0.461);
          (i % 2 ? poms : bells).setMatrixAt(w * 36 + (i >> 1), m4);
        }
        for (const im of [bells, poms]) { im.instanceMatrix.needsUpdate = true; im.frustumCulled = false; T.add(im); }
        // the ephod behind, its band round, its two shoulders and their stones
        // the ephod by Rashi (the user: "רק רש״י"): "כמין סינר של נשים רוכבות סוסים, וחוגר אותו מאחוריו כנגד לבו למטה מאציליו, רחבו כמדת
        // רחב גבו של אדם ויותר, ומגיע עד עקביו" (28:6), "ונקפל הסינר לפני הכהן על מתניו, וקצת כרסו מכאן ומכאן עד כנגד קצות החשן" (28:26):
        // a cloth 1.9 amot wide (model choice: so that girded its ends come before him under the breastplate's corners), round the back and
        // the sides, hanging to the heels
        {
          const prof = [[0.12, 0.482], [0.55, 0.476], [1.3, 0.428], [1.85, 0.39], [1.97, 0.394]];
          const rAt = (y) => { for (let i = 1; i < prof.length; i++) if (y <= prof[i][0]) return lerp(prof[i - 1][1], prof[i][1], (y - prof[i - 1][0]) / (prof[i][0] - prof[i - 1][0])); return prof[prof.length - 1][1]; };
          const XE = 0.25, NY = 16, NX = 32, pos = [], uv = [], idx = [];   // its ends hang straight, x = +-XE (the breastplate's corners)
          for (let j = 0; j <= NY; j++) {
            const y = lerp(0.12, 1.97, j / NY), r = rAt(y), span = Math.PI - Math.asin(Math.min(1, XE / r));
            for (let i = 0; i <= NX; i++) { const ph = Math.PI + lerp(-span, span, i / NX), k = 1 + 0.022 * clamp((1.9 - y) / 1.8, 0, 1) * Math.sin(10 * ph); pos.push(Math.sin(ph) * r * k, y, Math.cos(ph) * r * k); uv.push((lerp(-span, span, i / NX) * r) / TILE, y / TILE); }
          }
          for (let j = 0; j < NY; j++) for (let i = 0; i < NX; i++) { const p0 = j * (NX + 1) + i, p1 = p0 + NX + 1; idx.push(p0, p1, p0 + 1, p1, p1 + 1, p0 + 1); }
          const eg = new BufferGeometry();
          eg.setAttribute("position", new Float32BufferAttribute(pos, 3));
          eg.setAttribute("uv", new Float32BufferAttribute(uv, 2));
          eg.setIndex(idx);
          eg.computeVertexNormals();
          out.ephod = { rashi: mk(eg, M.ephod) };
        }
        // the Rambam's: "רחבו כרחב גבו של אדם מכתף לכתף. וארכו מכנגד אצילי הידים מאחוריו עד הרגלים" (9:9) - behind only
        out.ephod.rambam = mk((() => {
          const g = new LatheGeometry([[0.12, 0.478], [0.55, 0.471], [1.3, 0.424], [1.85, 0.386], [1.97, 0.394]].map(([y, r]) => V2(r, y)), 14, Math.PI * 2 / 3, Math.PI * 2 / 3), p = g.attributes.position, uv = g.attributes.uv;
          for (let i = 0; i < p.count; i++) { const x = p.getX(i), z = p.getZ(i); uv.setXY(i, (Math.atan2(-x, -z) * Math.hypot(x, z)) / TILE, p.getY(i) / TILE); }
          return g;
        })(), M.ephod);
        // its band "קשור על לבו תחת החשן" (9:11) - its knot and its ends not drawn (the user: "מה הקשר של הסרט באפוד ובאבנט? לא קשור")
        mk(uvScale(new CylinderGeometry(0.394, 0.39, 0.13, 36, 1, true), 6, 0.13 / ((Math.PI * 2 * 0.394) / 6)), M.ephod, 0, 1.965, 0);
        for (const s of [1, -1]) {
          // the shoulder: a broad strap of the ephod's work ("שתי רצועות רחבות", Rashi 28:7) from its upper edge behind, over the shoulder,
          // folded down before him a little; the shoham on the shoulder in its gold
          ribbon([[s * 0.21, 2.0, -0.348], [s * 0.21, 2.3, -0.357], [s * 0.21, 2.55, -0.333], [s * 0.21, 2.72, -0.262], [s * 0.21, 2.818, 0], [s * 0.21, 2.742, 0.252], [s * 0.21, 2.64, 0.307]], 0.13, M.ephod);
          // "וקובע על כל כתף וכתף אבן שהם מרבע משקע בבית של זהב" (9:9): the square stone in its gold, lying on the shoulder (the user: "מה
          // עשית בכתפיים?" - they stood up as boxes); outside the torso's flattening, set on the strap where it passes over
          const sg = new Group();
          sg.position.set(s * 0.21, 2.792, 0.094);
          sg.rotation.x = 0.5;
          L.add(sg);
          mk(new BoxGeometry(0.104, 0.014, 0.104), MAT.gold, 0, 0, 0, sg);
          mk(new BoxGeometry(0.08, 0.018, 0.08), M.shoham, 0, 0.008, 0, sg);
          mk(new CylinderGeometry(0.03, 0.033, 0.014, 20).rotateX(HP), MAT.gold, s * 0.21, 2.645, 0.335);   // "והמשבצות נתונות בראשיהם לפני כתפיו" (Rashi 28:6): flat on the strap's end
          cord([[s * 0.235, 2.505, 0.44], [s * 0.226, 2.575, 0.38], [s * 0.21, 2.64, 0.33]], 0.0085, MAT.gold, 3, 0.03);                        // the chains
          // the lower rings "על שפתו אשר אל עבר האפוד ביתה" (28:26: on its inner side), their cords under the arms to the shoulders' lower
          // rings "למעלה מן החשב" (9:9, 9:11)
          cord([[s * 0.235, 2.035, 0.405], [s * 0.35, 2.045, 0.25], [s * 0.398, 2.05, 0.0], [s * 0.35, 2.05, -0.27], [s * 0.21, 2.045, -0.37]], 0.0055, M.techelet);
          mk(new TorusGeometry(0.017, 0.005, 5, 10), MAT.gold, s * 0.235, 2.505, 0.44);
          mk(new TorusGeometry(0.017, 0.005, 5, 10), MAT.gold, s * 0.235, 2.035, 0.41);
          mk(new TorusGeometry(0.017, 0.005, 5, 10), MAT.gold, s * 0.21, 2.05, -0.362);   // "למעלה מן החגורה מעט... והן כנגד סוף החשן" (Rashi 28:27)
        }
        // the breastplate: its middle before the heart; four rows of three, the first above
        const ch = new Group();
        ch.position.set(0, 2.27, 0.424);   // "יהיה החשן על לבו בשוה" (9:11)
        T.add(ch);
        mk(uvScale(new BoxGeometry(0.5, 0.5, 0.024), 0.5 / TILE, 0.5 / TILE), M.ephod, 0, 0, 0, ch);
        const setG = new BoxGeometry(0.114, 0.114, 0.02), stG = new BoxGeometry(0.094, 0.094, 0.026);
        STONES.forEach(([, tribe, hex], i) => {
          const r = Math.floor(i / 3), k = i % 3, x = (1 - k) * 0.155, y = 0.18 - r * 0.12;
          mk(setG, MAT.gold, x, y, 0.016, ch);
          const light = new Color(hex).getHSL({}).l > 0.6;
          const map = canvasTex(128, 128, (c, w, h) => {
            const col = new Color(hex), g = c.createRadialGradient(w * 0.36, h * 0.32, 4, w / 2, h / 2, w * 0.75);
            g.addColorStop(0, HEX(col.clone().lerp(new Color(0xffffff), 0.4).getHex()));
            g.addColorStop(1, HEX(col.clone().multiplyScalar(0.6).getHex()));
            c.fillStyle = g; c.fillRect(0, 0, w, h);
            c.textAlign = "center"; c.textBaseline = "middle"; c.direction = "rtl";
            // above Reuven and below Binyamin the Gemara's words (Yoma 73b: "״אברהם יצחק ויעקב״ כתיב שם", "״שבטי ישורון״ כתיב שם" - the user:
            // as the Gemara; their places as the Rambam 9:7)
            const lines = i === 0 ? [["אברהם יצחק ויעקב", 15, 0.3], [tribe, 30, 0.64]] : i === 11 ? [[tribe, 28, 0.37], ["שבטי ישורון", 17, 0.72]] : [[tribe, tribe.length > 4 ? 29 : 35, 0.5]];
            for (const [txt, fs, fy] of lines) {
              c.font = "700 " + fs + "px 'Frank Ruhl Libre', 'David', 'Times New Roman', serif";
              c.fillStyle = light ? "rgba(255,255,255,0.6)" : "rgba(0,0,0,0.4)"; c.fillText(txt, w / 2 + 1.2, h * fy + 1.6);
              c.fillStyle = light ? "rgba(40,48,60,0.85)" : "rgba(255,255,255,0.84)"; c.fillText(txt, w / 2, h * fy);
            }
          });
          mk(stG, std(0xffffff, { map, roughness: 0.16, metalness: 0.05 }), x, y, 0.026, ch);
        });
        // the tzitz on the forehead, from ear to ear; his hair seen above it, and there the tefillin
        const tz = canvasTex(512, 66, (c, w, h) => {
          const g = c.createLinearGradient(0, 0, 0, h);
          g.addColorStop(0, "#f6dc80"); g.addColorStop(0.5, "#dab64c"); g.addColorStop(1, "#b48c2c");
          c.fillStyle = g; c.fillRect(0, 0, w, h);
          c.textAlign = "center"; c.textBaseline = "middle"; c.direction = "rtl";
          c.font = "700 27px 'Frank Ruhl Libre', 'David', 'Times New Roman', serif";
          for (const [t, y] of [["לה׳", 17], ["קדש", 48]]) { c.fillStyle = "rgba(90,60,10,0.8)"; c.fillText(t, w / 2 + 1, y + 1.5); c.fillStyle = "#fff3c0"; c.fillText(t, w / 2, y); }
        });
        // MITZ_HAIR_A2: on the forehead, over the brows, its top at the hairline (3.085 until now); "רחב שתי אצבעות ומקיף מאזן לאזן" (Klei
        // HaMikdash 9:1, 338:143; Shabbat 63b, 104:1578 "ורוחב שתי אצבעות, ומוקף מאוזן לאוזן"), half round the head - from ear to ear.
        // TZITZ_2F_A2 (the user's answer to question 184 - a: "שתי אצבעות בדיוק"): 2/24 of an amah high in the world (no scale over it -
        // measured: 0.078 until now)
        const TZ_H = 2 / 24;
        mk(new CylinderGeometry(1, 1, TZ_H, 36, 1, true, -HP, Math.PI).scale(0.174, 1, 0.194), std(0xffffff, { map: tz, metalness: 0.75, roughness: 0.3, side: DoubleSide }), 0, 3.118 - TZ_H / 2, HZ, L);
        // TEF_ONE_A2 (the coordinator: two boxes in one place): the head's tefillin are the kit's (figure: K.tefOn) - no box of its own here
        // the mitznefet sits back on the head (model choice: its frame hd tilted 0.3 back about the head's centre): its front edge above the
        // hair and the tefillin, its back over the nape; loc() = a point of the figure in that frame
        const TILT = -0.06, cT = Math.cos(TILT), sT = Math.sin(TILT);   // MITZ_REF_A2: nearly level, as the user's pictures (0.3 back until now)
        const loc = (x, y, z) => { const yy = y - 3.04, zz = z - HZ; return [x, yy * cT + zz * sT, -yy * sT + zz * cT]; };
        const hd = new Group();
        hd.position.set(0, 3.04, HZ);
        hd.rotation.x = TILT;
        L.add(hd);
        const rashi = new Group(), rashiW = new Group(), ramban = new Group();
        hd.add(rashi);
        L.add(rashiW, ramban);   // MITZ_RAMBAN_M: the Ramban's in the figure's own frame (not tilted with Rashi's)
        // the cords of techelet. MITZ_CORD_A2 (the user, 22.11.2026: "פתיל התכלת עבה מדי" - a thick twined rope; Rashi on Shemot 39:31,
        // 3692:2684 "פתיל תכלת זה חוטין הן, לקשרו בהן במצנפת"): thin, as a thick thread or a lace - much thinner than the tefillin's
        // strap - smooth, no plies (until now twined, 0.0115; before that 0.0075)
        const MZ_CORD = 0.0032, MZ_KNOT = 0.0075;
        const tubeIn = (par, pts, r, mat) => { const tm = new Mesh(new TubeGeometry(new CatmullRomCurve3(pts.map((q) => new Vector3(q[0], q[1], q[2]))), Math.max(24, pts.length * 10), r, 6, false), mat); tm.castShadow = true; par.add(tm); return tm; };
        // Rashi: "כמין כפת כובע", high on the head; his cords: the two at the ends tied behind the nape, the middle one over it.
        // MITZ_REF_A2: as the user's pictures - a roll round the head and a puffed dome over it, of cloth (mzCloth)
        const MZ = mzCloth();
        mk(MZ.rashiG, MZ.mat, 0, 0, 0, rashi);
        const nape = (k) => { const t = k / 12, p = headAt(HP + t * Math.PI, 0.366 - 0.58 * Math.sin(t * Math.PI), 0.027); return [p.x, p.y, p.z]; };
        tubeIn(rashiW, Array.from({ length: 13 }, (_, k) => nape(k)), MZ_CORD, M.techelet);
        const NP = nape(6);
        mk(new SphereGeometry(MZ_KNOT, 6, 5), M.techelet, NP[0], NP[1], NP[2] - 0.004, rashiW);
        // MITZ_REF_A2: the middle cord from the tzitz straight up the front of the mitznefet, over its top and down behind it to the nape
        // (as the user's pictures); the end cords as before, round the head under it
        const N0 = MZ.nP - 1, D0 = MZ.dome0, OFF = 0.011 + MZ.out;   // MITZ_WOUND_A2: over the wound layers
        const MI = [3, 12, 24, 36, 48, 60, 72, N0 - 6];
        const mer = [...MI.map((j) => MZ.at(j, 0, OFF)), MZ.at(N0, 0, OFF), ...MI.slice().reverse().map((j) => MZ.at(j, Math.PI, OFF))];
        tubeIn(rashi, [loc(0, 3.116, 0.197 + HZ), loc(0, 3.15, 0.18 + HZ), ...mer, loc(0, 3.03, HZ - 0.222), loc(NP[0], NP[1], NP[2])], MZ_CORD, M.techelet);   // MITZ_HAIR_A2: up over the hair, behind the tefillin
        // the Ramban: the wreath (MITZ_RAMBAN_M, rbWreath above) on the head - in the head's frame (its middle at (0, 3.0, HZ), 1.3 times;
        // f.tef: the head's tefillin, that it be laid over them); and the one cord of techelet, as his words (28:37, 3627:713) "והפתיל
        // שנקשר בו יבא עליה... והיה הפתיל על המצנפת לאחורי אזניו כנגד הערף" (and the Rambam, Klei HaMikdash 9:2 "כדי שיהיה נקשר בפתיל
        // כנגד העורף"): from each end of the tzitz (before the ear) back over the ear, onto the cloth right behind it, and along it down
        // to the knot on it over the nape (over the tefillin's knot, which is under it). Its way - a model choice
        const rw = new Group();
        rw.position.set(0, 3.0, HZ);
        rw.scale.setScalar(1.3);
        ramban.add(rw);
        const RW = rbWreath(f.tef && f.tef.geometry ? f.tef.geometry : null);
        mk(RW.geo, MZ.mat, 0, 0, 0, rw);
        const CR = MZ_CORD / 1.3, KR = MZ_KNOT / 1.3, onC = (deg, y, o = 0) => RW.onCloth((deg * Math.PI) / 180, y, CR + 0.0006 + o);
        // (over the ear on the hair - the cloth's edge is above it there; then on the cloth)
        const onHair = (deg, y) => { const t = (deg * Math.PI) / 180, r = RW.rIn(t, y) - 0.004 + CR + 0.001; return [r * Math.sin(t), y, r * Math.cos(t)]; };
        const WAY = [[95, 0.058, 1], [101, 0.054, 1], [109, 0.042], [116, 0.028], [130, 0.005], [145, -0.02], [160, -0.04], [172, -0.052]];
        const wp = (d, y, h) => (h ? onHair(d, y) : onC(d, y));
        const tzEnd = (sd) => [sd * 0.1338, (3.079 - 3.0) / 1.3, -0.002];   // the tzitz's end (its middle; buildHP's tzitz: 0.174 from the axis, before the ear)
        tubeIn(rw, [tzEnd(1), ...WAY.map(([d, y, h]) => wp(d, y, h)), onC(180, -0.056), ...WAY.slice().reverse().map(([d, y, h]) => wp(-d, y, h)), tzEnd(-1)], CR, M.techelet);
        const KN = onC(180, -0.056, KR * 0.55);
        mk(new SphereGeometry(KR, 8, 6), M.techelet, KN[0], KN[1], KN[2], rw);
        out.mitz = { rashi: [rashi, rashiW], ramban: [ramban] };
        return out;
      };
      // ---- the figures on the kit (as 55-tamid.js makeFigKit): the arms in amot - the sleeve from the shoulder to the elbow, the forearm
      // to the wrist, the open hand in its own wrist frame; the feet; the neck
      const FS = K.FS, sc = (q, s) => q.scale(s, s, s), W1 = (q) => K.white(q);
      const upper = (up) => sc(mergeGeometries([W1(K.sph(0.07, 0.07, 0.07, 14, 10)), W1(K.at(new CylinderGeometry(0.07, 0.058, up / FS, 14), 0, -up / FS / 2, 0)),
        W1(K.at(K.sph(0.058, 0.058, 0.058, 12, 8), 0, -up / FS, 0))]), FS);
      const fore = (fo) => sc(W1(K.at(new CylinderGeometry(0.056, 0.046, fo / FS, 14), 0, -fo / FS / 2, 0)), FS);
      const handW = (side) => sc(K.at(K.handRaw(side), 0, -0.045, 0), FS);
      const foot = (side) => sc(K.footGeo(side).translate(-side * 0.1, 0, 0), FS);
      const AP = { sx: K.SH_X * FS, sy: K.SH_Y * FS, up: K.UP * FS, fo: K.FORE * FS };   // the priest's own arm
      const AH = { sx: 0.39, sy: 2.6, up: 0.6, fo: 0.66 };                                 // the high priest's: as his body (his garments)
      const GA = {
        upP: upper(AP.up), foP: fore(AP.fo), upH: upper(AH.up), foH: fore(AH.fo), hand: { 1: handW(1), "-1": handW(-1) }, foot: { 1: foot(1), "-1": foot(-1) },
        neck: K.at(new CylinderGeometry(0.066, 0.072, 0.09, 12), 0, 1.925, 0)
      };
      let GHK = null, GHC = null;
      const arms = (par, A, hp) => {
        const arm = (side) => {   // side +1 = the left (+x), -1 = the right
          const sh = new Group();
          sh.position.set(side * A.sx, A.sy, 0);
          par.add(sh);
          const u = new Mesh(hp ? GA.upH : GA.upP, K.mRobe); u.castShadow = true; sh.add(u);
          const el = new Group();
          el.position.y = -A.up;
          sh.add(el);
          const f = new Mesh(hp ? GA.foH : GA.foP, K.mRobe); f.castShadow = true; el.add(f);
          const wr = new Group();
          wr.position.y = -A.fo;
          el.add(wr);
          wr.add(wr.userData.hand = new Mesh(GA.hand[side], K.mHand || K.mSkin));   // HAND_A2: kept - the houses put it to its pose
          const grip = new Group();
          if (K.handAt) { const G = K.handAt(side, "grip"); grip.position.set(G.x, -A.fo + G.y, G.z); grip.userData.fo = A.fo; }   // HAND_A2: where a handle lies in the closed hand
          else grip.position.set(0, -(A.fo + 0.08), 0.03);
          el.add(grip);
          sh.rotation.set(0.05, side * 0.08, hp ? side * 0.1 : 0); el.rotation.x = -0.15;   // standing, the arms hanging (58-ark.js ARK_POSE.stand); HAND_A2: the high priest's a little out, his hands clear of the robe
          return { sh, el, grip, wr };
        };
        return [arm(1), arm(-1)];
      };
      const feet = (g) => {
        const fl = new Mesh(GA.foot[1], K.mSkin), fr = new Mesh(GA.foot[-1], K.mSkin);
        fl.position.x = 0.1 * FS;
        fr.position.x = -0.1 * FS;
        g.add(fl, fr);
        return [fl, fr];
      };
      // the high priest: this body (no ears - the head is the kit's) under his eight; his avnet "דברי הכל של כלאים" (Yoma 12b); the
      // kit's head where this body's head was (the mitznefet and the tzitz sit on it), and the head's tefillin "בין ציץ למצנפת"
      const figure = () => {
        const g = new Group(), lean = new Group();
        g.add(lean);
        if (!GHK) GHK = bodyGeo("HK");
        const body = new Mesh(GHK, MAT.fig);
        body.castShadow = true;
        lean.add(body);
        // MITZ_CLOTH_A2: the hair over the crown, under the mitznefet and above the tzitz - of the kit's white hair (its strands), not smooth
        if (!GHC) GHC = tint(new SphereGeometry(1, 24, 10, 0, Math.PI * 2, 0, 1.0).scale(0.166, 0.246, 0.194).translate(0, 3.0, HZ), 0xffffff);
        lean.add(new Mesh(GHC, K.mBeards[0]));
        const belt = new Mesh(beltG, MAT.beltK);
        lean.add(belt);
        const hs = new Group();
        hs.scale.setScalar(1.3);
        hs.position.set(0, 3.0 - 1.3 * K.HEAD_Y, HZ);
        lean.add(hs);
        const hh = K.headOn(hs, K.HEAD_Y, K.mBeards[0], 1);
        const tef = K.tefOn ? K.tefOn(hh, { TY: 0.098 }) : null;   // TEFILLIN_A2: "שערו היה נראה בין ציץ למצנפת, ששם מניחין תפילין" (Zevachim 19a); MITZ_HAIR_A2: on the band of hair over the tzitz (the box a little lower than the priests')
        const [L, R] = arms(lean, AH, true), [fl, fr] = feet(g);
        const garb = buildHP({ lean, tef });
        return { g, lean, A: AH, L, R, fl, fr, body, belt, garb };
      };
      // a priest in his four - "כתנת ומכנסים ומצנפת ואבנט" (the Rambam, Klei HaMikdash 8:1): the kit's kutonet, avnet and migba'at;
      // the avnet of wool and linen (Rebbi; the Rambam) or of linen (Rabbi Elazar b. R. Shimon) - Yoma 12b: setBelt
      const priest = (n = 1) => {
        const g = new Group(), lean = new Group();
        g.add(lean);
        const U = new Group();
        U.scale.setScalar(FS);
        lean.add(U);
        const body = new Mesh(K.gRobeBody, K.mRobe);
        body.castShadow = true;
        U.add(body);
        U.add(new Mesh(GA.neck, K.mSkin));
        const belt = new Mesh(K.gSash, K.mSashDyed);
        U.add(belt);
        const hg = K.headOn(U, K.HEAD_Y, K.mBeards[[3, 1, 6, 4][n % 4] % K.mBeards.length], n);
        hg.rotation.set(0, (((n * 0.618) % 1) - 0.5) * 0.3, 0);
        if (K.tefOn) K.tefOn(hg);
        const hat = new Mesh(K.gHat, K.mHat);
        hat.position.y = K.HAT_Y;
        hat.rotation.y = hg.rotation.y + (((n * 0.37) % 1) - 0.5) * 0.9;
        U.add(hat);
        const [L, R] = arms(lean, AP, false), [fl, fr] = feet(g);
        return { g, lean, A: AP, L, R, fl, fr, body, belt, hat, setBelt: (m) => { belt.material = m === "butz" ? K.mSashWhite : K.mSashDyed; } };
      };
      // "בגדי הכהנים": the priest at the right of the pair (its -z), the high priest at its left (+z), 2.8 apart, both facing +x (the
      // house turns and puts the group); set({ belt, ephod, mitz }) - the readings
      const pair = () => {
        const g = new Group(), a = priest(1), b = figure();
        a.g.position.set(0, 0, -1.4); b.g.position.set(0, 0, 1.4);
        a.g.rotation.y = b.g.rotation.y = HP;
        g.add(a.g, b.g);
        g.traverse((o) => { if (o.isMesh) o.userData.noPick = true; });
        const st = { belt: "kilayim", ephod: "rashi", mitz: "rashi" };
        const set = (o = {}) => {
          if (o.belt) st.belt = o.belt === "butz" ? "butz" : "kilayim";
          if (o.ephod) st.ephod = o.ephod === "rambam" ? "rambam" : "rashi";
          if (o.mitz) st.mitz = o.mitz === "ramban" ? "ramban" : "rashi";
          a.setBelt(st.belt);
          const e = b.garb.ephod, m = b.garb.mitz;
          e.rashi.visible = st.ephod !== "rambam"; e.rambam.visible = st.ephod === "rambam";
          for (const q of m.rashi) q.visible = st.mitz !== "ramban";
          for (const q of m.ramban) q.visible = st.mitz === "ramban";
          return Object.assign({}, st);
        };
        set();
        return { g, a, b, set, get state() { return Object.assign({}, st); } };
      };
      return (K.__hpKit = { figure, priest, pair, MAT, COL, AH, AP });
    };
