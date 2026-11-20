        // ---- the two priests with the trumpets (white garments, the hat and the sash) - MUSICIANS_305: "ושתי חצוצרות בידיהן" (5:4):
        // the trumpet in both hands, to the mouth while they blow (MUS above; each priest a set of one, in his own group)
        for (const s of [-1, 1]) {
          const G = new Group(); G.visible = false; DG.add(G);
          const near = PP.crowd(G, [[0, 0, 0]], { y: 0, s: 1.4, pose: "stand", kind: "kohen", robe: 0xf1ede2, tone: () => (s < 0 ? 1 : 2), exact: true, arms: false, name: "simchaKohen" });
          const cw = near && near.userData ? near.userData.crowd : null;
          const set = MUS.set(G, [{ x: 0, y: 0, z: 0, yaw: 0, kind: "koh", cw, ci: 0, skin: s < 0 ? 0 : 1 }], 0xf1ede2);
          B.koh.push({ G, s, set, up: 0 });
        }
        // ---- the musicians: the Levites on the steps, and the flute below them (MUSICIANS_305: each with his instrument in his hands)
        const levites = (rid) => {
          const g = new Group(); g.visible = false; DG.add(g);
          const pts = [];
          // on all fifteen: "עמדו שם בט״ו שורות על הט״ו מעלות, ובכל שורה שררו שיר המעלות אחר" (the Tiferet Yisrael, Middot 2:5,
          // 819:253) - a row on every step, its figures between those of the row below (a half step along it)
          if (!rid) {
            for (let k = 1; k <= 15; k++) {
              const r = 22 - (k - 1) * 0.5 - 0.25, y = Y0 + 0.5 * k, off = k % 2 ? 0 : 0.5;
              for (let i = 0; i < 6; i++) {
                const th = -1.02 + ((i + off) / 5.5) * 2.04, z = r * Math.sin(th);
                if (Math.abs(z) < 2.6 || (k <= 5 && Math.abs(z) > 19)) continue;
                pts.push([96 + r * Math.cos(th), y, z, Math.atan2(Math.cos(th), Math.sin(th))]);
              }
            }
          } else {
            const RRr = (19.5 * 19.5 + 7.5 * 7.5) / 15;
            for (let k = 1; k <= 15; k++) {
              const d = 0.5 * (15 - k), half = Math.sqrt(Math.max(0, RRr * RRr - (RRr - 7.5 + d) * (RRr - 7.5 + d))) - 1, x = 96 + 0.5 * (15.5 - k), y = Y0 + 0.5 * k, off = k % 2 ? 0 : 0.5;
              for (let i = 0; i < 6; i++) { const z = -half + ((i + off) / 5.5) * 2 * half; if (Math.abs(z) >= 2.6) pts.push([x, y, z, Math.PI / 2]); }
            }
          }
          // "בכנורות ובנבלים ובמצלתים ובחצוצרות" (5:4): lyres for most, harps, cymbals and trumpets (their numbers - model choices)
          const kinds = pts.map((p, i) => (i % 9 === 4 ? "cym" : i % 7 === 3 ? "tru" : i % 4 === 1 ? "harp" : "lyre"));
          // each row's figures stand on their own step: one crowd per height
          const byY = new Map();
          pts.forEach((p, i) => { if (!byY.has(p[1])) byY.set(p[1], []); byY.get(p[1]).push(i); });
          const figs = [];
          for (const [y, idx] of byY) {
            const near = PP.crowd(g, idx.map((i) => [pts[i][0], pts[i][2], pts[i][3]]), { y, s: 1.4, pose: "stand", kind: "levi", robe: 0x8f8468, tone: (j) => 1 + (j % 2), exact: true, arms: false, name: "simchaLevi" });
            const cw = near && near.userData ? near.userData.crowd : null;
            idx.forEach((i, j) => figs.push({ x: pts[i][0], y, z: pts[i][2], yaw: pts[i][3], kind: kinds[i], cw, ci: j, skin: j }));
          }
          return MUS.set(g, figs, 0x8f8468);
        };
        B.levFor = (rid) => B.lev[rid ? "rid" : "rambam"] || (B.lev[rid ? "rid" : "rambam"] = levites(rid));
        // the flute: two players at the steps' foot, on the court's floor ("החליל מכה", the Rambam, Lulav 8:13)
        {
          const g = new Group(); DG.add(g);
          const pts = [[121.6, -6, Math.PI / 2 - 0.25], [121.6, 6, Math.PI / 2 + 0.25]];   // their faces to the court
          const near = PP.crowd(g, pts, { y: Y0, s: 1.4, pose: "stand", kind: "levi", robe: 0x8f8468, tone: (i) => 1 + i, exact: true, arms: false, name: "simchaFlute" });
          const cw = near && near.userData ? near.userData.crowd : null;
          B.flute = MUS.set(g, pts.map((p, j) => ({ x: p[0], y: Y0, z: p[1], yaw: p[2], kind: "flute", cw, ci: j, skin: j })), 0x8f8468);
        }
