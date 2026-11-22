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
      // MITZ_CLOTH_A2 (the user, via the coordinator, 22.11.2026: the mitznefet "נראית כקסדה, ולא מבד"; in both readings "מראה של בד פשתן
      // לבן כרוך — קפלים ורצועות בד נראות, שוליים רכים ולא מעוגלים בצורה מושלמת, מרקם של אריג, צל בין הקפלים. לא משטח חלק ומבריק"):
      // the mitznefet of linen wound - bands of cloth on a surface round the head (band), each bulging, its edges soft and tucked under
      // the next, creased across, its line not a perfect round; a woven texture (a plain weave of fine threads, a few thicker - linen),
      // rough, not shiny; darker at the bands' edges, in the creases and in the gaps between them (the shadow between the folds; a darker
      // shell under the bands). Rashi's "כמין כפת כובע" - a low dome of one band wound up from the rim in a spiral, gathered at the top
      // in folds; the Ramban's "צניף... מגלגל ומחזיר... כפל על כפל" - six turns round the head, each a little aslant the other way, one
      // over another, and the top gathered. Until now a smooth half ball with a ring (Rashi) and five smooth rings (the Ramban). The
      // number of the turns, their breadth, the folds and the texture's scale - model choices. Built once for the kit (mzCloth).
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
        const mat = std(0xffffff, { vertexColors: true, map: tex, bumpMap: bump, bumpScale: 1.6, roughness: 0.97, metalness: 0 });   // one-sided: under a band's edge its inside is not seen
        // a surface round the head (the frame hd): prof(v) -> [r, y], v from its lower edge up; ex, ez - its round drawn to an ellipse
        const surf = (prof, ex, ez) => (v, th) => { const [r, y] = prof(v); return new Vector3(r * ex * Math.sin(th), y, r * ez * Math.cos(th)); };
        const nrmOf = (S) => (v, th) => { const e = 1e-3, a = S(v, th + e).sub(S(v, th - e)), b = S(v + e, th).sub(S(v - e, th)); return a.cross(b).normalize(); };
        // a band of the cloth wound on S, from th0 to th1 (a whole ring - closed): its middle at vc(th), half its breadth hw (in v, a little
        // uneven), bulging t out of the surface (lift - its foot out, the later bands over the earlier), its edges tucked under, creased
        // across and aslant (folds to a turn), its line not a perfect round; taper - a spiral's ends thinner. Its colour darker at its edges
        // and in its creases. Lv, Rm: the surface's height and radius, for the texture's scale
        const band = (S, o) => {
          const N = nrmOf(S), th0 = o.th0 || 0, th1 = o.th1 == null ? Math.PI * 2 : o.th1, t = o.t, hw = o.hw, lift = o.lift || 0, folds = o.folds || 11;
          const nU = o.nU || 96, nS = o.nS || 9, Lv = o.Lv || 0.3, Rm = o.Rm || 0.19, taper = o.taper || 0, sdd = o.seed || 1;
          const closed = Math.abs(th1 - th0 - Math.PI * 2) < 1e-6, ph = [1.7, 2.9, 4.3, 5.1, 0.7, 3.3].map((q) => q * sdd);
          const pos = [], col = [], uv = [], idx = [];
          for (let i = 0; i <= nU; i++) {
            const u = i / nU, th = th0 + (th1 - th0) * u;
            const uneven = 0.022 * Math.sin(2 * th + ph[0]) + 0.013 * Math.sin(3 * th + ph[1]) + 0.007 * Math.sin(5 * th + ph[2]);
            const h = hw * (1 + 0.13 * Math.sin(4 * th + ph[3]) + 0.06 * Math.sin(7 * th + ph[4]));
            const end = taper ? Math.min(1, u / taper, (1 - u) / taper) : 1;
            for (let j = 0; j <= nS; j++) {
              const s = -1 + (2 * j) / nS, v = o.vc(th) + s * h * (0.55 + 0.45 * end), P = S(v, th), n = N(v, th), q = Math.sqrt(Math.max(0, 1 - s * s));
              const crease = Math.sin(folds * th + 2.6 * s + ph[5]) * (0.55 + 0.45 * Math.sin(3 * th + ph[0] + s));
              P.addScaledVector(n, lift + t * end * (q - 0.32 + 0.3 * crease * q) + Rm * uneven);
              pos.push(P.x, P.y, P.z);
              const ao = (1 - 0.36 * Math.pow(Math.abs(s), 2.4)) * (1 - 0.16 * Math.max(0, -crease)) * (0.84 + 0.16 * end);
              col.push(ao, ao * 0.995, ao * 0.985);
              uv.push(((th - th0) * Rm) / TILE, (s * h * Lv) / TILE);
            }
          }
          for (let i = 0; i < nU; i++) for (let j = 0; j < nS; j++) { const a = i * (nS + 1) + j, b = a + nS + 1; idx.push(a, b, a + 1, a + 1, b, b + 1); }
          const g = new BufferGeometry();
          g.setAttribute("position", new Float32BufferAttribute(pos, 3));
          g.setAttribute("color", new Float32BufferAttribute(col, 3));
          g.setAttribute("uv", new Float32BufferAttribute(uv, 2));
          g.setIndex(idx);
          g.computeVertexNormals();
          if (closed) {   // the ring's seam: one normal
            const nn = g.attributes.normal, w3 = new Vector3();
            for (let j = 0; j <= nS; j++) { const a = j, b = nU * (nS + 1) + j; w3.set(nn.getX(a) + nn.getX(b), nn.getY(a) + nn.getY(b), nn.getZ(a) + nn.getZ(b)).normalize(); nn.setXYZ(a, w3.x, w3.y, w3.z); nn.setXYZ(b, w3.x, w3.y, w3.z); }
          }
          return g;
        };
        // the top, gathered: a low dome of cloth, its folds running in to the middle (the Ramban's)
        const crown = (cy, R, ex, ez, dome, folds, sdd) => {
          const nR = 8, nT = 72, pos = [], col = [], uv = [], idx = [];
          for (let i = 0; i <= nR; i++) for (let k = 0; k <= nT; k++) {
            const r0 = i / nR, th = (k / nT) * Math.PI * 2, f = Math.sin(folds * th + 2.4 * r0 + 0.8 * Math.sin(2 * th + sdd) + sdd) * (0.55 + 0.45 * Math.sin(3 * th + sdd * 1.7)) * r0 * (1 - r0) * 4 * 0.0065 + 0.003 * Math.sin(5 * th + sdd * 2) * r0;
            const r = R * r0 * (1 + 0.03 * Math.sin(3 * th + sdd)), x = r * ex * Math.sin(th), z = r * ez * Math.cos(th);
            pos.push(x, cy + dome * (1 - r0 * r0) + f, z);
            const ao = (1 - 0.14 * Math.max(0, -f / 0.0065)) * (1 - 0.12 * Math.pow(r0, 4));
            col.push(ao, ao * 0.995, ao * 0.985);
            uv.push(x / TILE, z / TILE);
          }
          for (let i = 0; i < nR; i++) for (let k = 0; k < nT; k++) { const a = i * (nT + 1) + k, b = a + nT + 1; idx.push(a, b, a + 1, a + 1, b, b + 1); }
          const g = new BufferGeometry();
          g.setAttribute("position", new Float32BufferAttribute(pos, 3));
          g.setAttribute("color", new Float32BufferAttribute(col, 3));
          g.setAttribute("uv", new Float32BufferAttribute(uv, 2));
          g.setIndex(idx);
          g.computeVertexNormals();
          return g;
        };
        const SHADE = 0x8f887a;   // the shell under the bands - seen only in the gaps between them, as shadow (not below the lowest)
        // Rashi: a low dome (its middle 0.125 over the head's, radius 0.19), one band from the rim up round and round to near the top,
        // and the top gathered over it
        const profR = (v) => { const a = (1 - Math.min(1, v)) * HP; return [0.19 * Math.sin(a), 0.125 + 0.18 * Math.cos(a)]; };
        const SR = surf(profR, 1, 1);
        const TURNS = 2.0, V0 = 0.2, V1 = 0.68;
        // the cloth's edge turned in under the lowest band, to the hair (seen from below - not the band's inside)
        const tuck = (r0, y0, r1, y1, ez) => { const pts = [new Vector2(r1, y1), new Vector2((r0 + r1) / 2, (y0 + y1) / 2 - 0.004), new Vector2(r0, y0)]; return [pts, pts.slice().reverse()].map((q) => tint(plain(new LatheGeometry(q, 48).scale(1, 1, ez)), 0x847e72)); };   // both faces
        const rashiG = mergeGeometries([
          tint(plain(new SphereGeometry(0.182, 28, 12, 0, Math.PI * 2, 0, HP - 0.05).scale(1, 0.95, 1).translate(0, 0.125, 0)), SHADE),
          ...tuck(0.176, 0.1, 0.1, 0.135, 1),
          band(SR, { vc: () => 0.02, hw: 0.15, t: 0.022, folds: 12, nU: 110, seed: 3.7 }),   // the lowest turn level all round (the cap's rim)
          band(SR, { th0: Math.PI, th1: Math.PI + TURNS * Math.PI * 2, vc: (th) => V0 + (V1 - V0) * ((th - Math.PI) / (TURNS * Math.PI * 2)), hw: 0.15, t: 0.02, lift: 0.003, folds: 11, nU: 220, taper: 0.1, seed: 1 }),   // from behind, so that its ends are not seen
          band(SR, { vc: () => 0.83, hw: 0.2, t: 0.012, lift: 0.004, folds: 9, nU: 96, seed: 2.3 })
        ]);
        // the Ramban: a band of turns round the head (its radius 0.18 .. 0.198, from 0.112 up 0.258), each aslant the other way, the
        // later over the earlier, and the top gathered
        const profB = (v) => [0.18 + 0.018 * v, 0.112 + 0.258 * v];
        const SB = surf(profB, 1, 1.06);
        const TURN6 = [[0.08, 0.02, 0.3, 10], [0.27, 0.11, 0.9, 12], [0.43, -0.11, -0.7, 9], [0.58, 0.1, 2.5, 13], [0.73, -0.09, -2.4, 11], [0.87, 0.05, 1.2, 10]];
        const coreB = new LatheGeometry([...Array.from({ length: 12 }, (_, k) => { const [r, y] = profB(0.06 + (0.94 * k) / 11); return new Vector2(r * 0.985, y); }), new Vector2(0.0005, profB(1)[1])], 36).scale(1, 1, 1.06);
        const rambanG = mergeGeometries([
          tint(plain(coreB), SHADE),
          ...tuck(0.172, 0.097, 0.1, 0.13, 1.06),
          ...TURN6.map(([v, tl, ph, fo], i) => band(SB, { vc: (th) => v + tl * Math.cos(th - ph), hw: 0.135, t: 0.024, lift: 0.004 * i, folds: fo, nU: 120, Lv: 0.258, seed: i + 1 })),
          crown(profB(1)[1] + 0.003, 0.2, 1, 1.06, 0.026, 8, 1.3)
        ]);
        MZC = { mat, rashiG, rambanG, SR, nR: nrmOf(SR) };
        return MZC;
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
          tefillin: std(0x141414, { roughness: 0.45 }),
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
        mk(new CylinderGeometry(1, 1, 0.078, 36, 1, true, -HP, Math.PI).scale(0.174, 1, 0.194), std(0xffffff, { map: tz, metalness: 0.75, roughness: 0.3, side: DoubleSide }), 0, 3.085, HZ, L);
        mk(new BoxGeometry(0.056, 0.056, 0.056), M.tefillin, 0, 3.172, 0.164 + HZ, L).rotation.x = -0.55;
        // the mitznefet sits back on the head (model choice: its frame hd tilted 0.3 back about the head's centre): its front edge above the
        // hair and the tefillin, its back over the nape; loc() = a point of the figure in that frame
        const TILT = -0.3, cT = Math.cos(TILT), sT = Math.sin(TILT);
        const loc = (x, y, z) => { const yy = y - 3.04, zz = z - HZ; return [x, yy * cT + zz * sT, -yy * sT + zz * cT]; };
        const hd = new Group();
        hd.position.set(0, 3.04, HZ);
        hd.rotation.x = TILT;
        L.add(hd);
        const rashi = new Group(), rashiW = new Group(), ramban = new Group();
        hd.add(rashi, ramban);
        L.add(rashiW);
        // HP_KIT_A2 (the user, via the coordinator: "פתילי התכלת בולטים וברורים"): the cords of techelet thicker (were 0.0075, the knot 0.011)
        const MZ_CORD = 0.0115, MZ_KNOT = 0.016;
        const tubeIn = (par, pts, r, mat) => { const tm = cord(pts, r * 0.7, mat); par.add(tm); return tm; };
        // Rashi: "כמין כפת כובע", high on the head; his cords: the two at the ends tied behind the nape, the middle one over it.
        // MITZ_CLOTH_A2: of linen wound (mzCloth), not a smooth half ball
        const MZ = mzCloth();
        mk(MZ.rashiG, MZ.mat, 0, 0, 0, rashi);
        const nape = (k) => { const t = k / 12, p = headAt(HP + t * Math.PI, 0.366 - 0.58 * Math.sin(t * Math.PI), 0.027); return [p.x, p.y, p.z]; };
        tubeIn(rashiW, Array.from({ length: 13 }, (_, k) => nape(k)), MZ_CORD, M.techelet);
        const NP = nape(6);
        mk(new SphereGeometry(MZ_KNOT, 6, 5), M.techelet, NP[0], NP[1], NP[2] - 0.004, rashiW);
        // the middle cord over the cloth, from before to behind (clear of its folds)
        const over = (v, th) => { const q = MZ.SR(v, th).addScaledVector(MZ.nR(v, th), 0.034); return [q.x, q.y, q.z]; };
        const mer = [[0.1, 0], [0.32, 0], [0.56, 0], [0.8, 0], [1, 0], [0.8, Math.PI], [0.56, Math.PI], [0.32, Math.PI], [0.1, Math.PI]].map(([v, th]) => over(v, th));
        tubeIn(rashi, [loc(0, 3.122, 0.196 + HZ), ...mer, loc(0, 3.03, HZ - 0.222), loc(NP[0], NP[1], NP[2])], MZ_CORD, M.techelet);
        // the Ramban: "כעין צניף שצונף בו את ראשו, מגלגל ומחזיר... כפל על כפל"; the Rambam's one cord, tied behind over it. MITZ_CLOTH_A2:
        // six turns of linen (mzCloth), not five smooth rings
        mk(MZ.rambanG, MZ.mat, 0, 0, 0, ramban);
        tubeIn(ramban, [loc(0.174, 3.085, HZ), [0.222, 0.1, -0.08], [0.18, 0.165, -0.18], [0, 0.175, -0.25], [-0.18, 0.165, -0.18], [-0.222, 0.1, -0.08], loc(-0.174, 3.085, HZ)], MZ_CORD, M.techelet);
        mk(new SphereGeometry(MZ_KNOT, 6, 5), M.techelet, 0, 0.175, -0.255, ramban);
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
          wr.add(new Mesh(GA.hand[side], K.mSkin));
          const grip = new Group();
          grip.position.set(0, -(A.fo + 0.08), 0.03);
          el.add(grip);
          sh.rotation.set(0.05, side * 0.08, 0); el.rotation.x = -0.15;   // standing, the arms hanging (58-ark.js ARK_POSE.stand)
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
        if (K.tefOn) K.tefOn(hh);   // TEFILLIN_A2: "שערו היה נראה בין ציץ למצנפת, ששם מניחין תפילין" (Zevachim 19a)
        const [L, R] = arms(lean, AH, true), [fl, fr] = feet(g);
        const garb = buildHP({ lean });
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
