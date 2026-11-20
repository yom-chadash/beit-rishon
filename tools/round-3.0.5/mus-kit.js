      // ---- MUSICIANS_305 (the user, 21:08: "צריך גם לעשות את הלוויים מנגנים... אם הם מנגנים, לא יכולים לעמוד כמו פסלים"; 21:10:
      // "ידיים של הכוהנים תופסות את החצוצרה, אי אפשר בלי"): THE MUSICIANS' KIT. A musician is a figure of tm_people without its own
      // arms (crowd o.arms: false); every frame his arms (PP.rig) and his instrument are set: the instrument in his hands, the hands at
      // their work in time with the music, the body swaying a little with it. All in the figure's own units (its scale 1.4 - an amah
      // is 0.714; the face to +z, the left at +x). Until 2.0.13 the Levites and the flutes stood still, their instruments standing
      // before them, and the priests' trumpets moved before their mouths without hands. The instruments' forms and the motions -
      // model choices.
      const MUS = (() => {
        const UA = 0.32, FA = 0.29, HL = 0.075;   // the upper arm, the forearm (to the wrist), the wrist to the middle of the fingers
        const SHL = new Vector3(0.25, 1.718, 0), SHR = new Vector3(-0.25, 1.718, 0);
        const cyl = (r0, r1, a, b, n = 6) => {   // a tube from a to b
          const d = new Vector3(b[0] - a[0], b[1] - a[1], b[2] - a[2]), L = d.length();
          const q = new CylinderGeometry(r1, r0, L, n);
          q.applyQuaternion(new Quaternion().setFromUnitVectors(new Vector3(0, 1, 0), d.normalize()));
          q.translate((a[0] + b[0]) / 2, (a[1] + b[1]) / 2, (a[2] + b[2]) / 2);
          return q;
        };
        // the lyre (כנור): a sound-box below, two arms out and up, the yoke across them, five strings - in its own plane (x, y)
        const G = {
          lyre: [mergeGeometries([new BoxGeometry(0.27, 0.085, 0.06).translate(0, 0.0425, 0), cyl(0.016, 0.013, [0.1, 0.06, 0], [0.155, 0.37, 0]),
            cyl(0.016, 0.013, [-0.1, 0.06, 0], [-0.155, 0.37, 0]), cyl(0.014, 0.014, [-0.18, 0.345, 0], [0.18, 0.345, 0])]),
            mergeGeometries([-2, -1, 0, 1, 2].map((k) => cyl(0.0025, 0.0025, [k * 0.035, 0.085, 0.012], [k * 0.042, 0.335, 0.012], 3)))],
          // the harp (נבל): its pillar, the neck over it, the sound-box along its foot, seven strings
          harp: [mergeGeometries([new BoxGeometry(0.045, 0.56, 0.055).translate(0, 0.28, 0), new BoxGeometry(0.33, 0.045, 0.05).translate(0.165, 0.545, 0),
            new BoxGeometry(0.36, 0.09, 0.08).translate(0.18, 0.045, 0)]),
            mergeGeometries([1, 2, 3, 4, 5, 6, 7].map((k) => cyl(0.0022, 0.0022, [k * 0.042, 0.09, 0], [k * 0.042, 0.52, 0], 3)))],
          cym: [new CylinderGeometry(0.13, 0.13, 0.016, 16).rotateZ(Math.PI / 2)],   // a cymbal: its face across x (the two meet)
          // a trumpet (חצוצרה): from the mouthpiece (the origin) forward along +z, the bell at its end
          tru: [mergeGeometries([cyl(0.017, 0.021, [0, 0, 0], [0, 0, 0.86], 8), new ConeGeometry(0.095, 0.2, 14, 1, true).rotateX(-Math.PI / 2).translate(0, 0, 0.96)])],
          flute: [cyl(0.019, 0.026, [0, 0, 0], [0, 0, 0.68], 8)]   // the flute (חליל): from the mouth forward
        };
        G.koh = G.tru;
        const strM = new MeshStandardMaterial({ color: 0xe9dfc6, roughness: 0.55 });
        const bronzeM = new MeshStandardMaterial({ color: 0xc8963e, metalness: 0.75, roughness: 0.32 });   // (M2.bronze is dark in the night)
        const MAT = { lyre: [wood, strM], harp: [wood, strM], cym: [bronzeM], tru: [silver], koh: [silver], flute: [wood] };
        const ss01 = (x) => { const u = Math.max(0, Math.min(1, x)); return u * u * (3 - 2 * u); };
        const lerp = (a, b, u) => a + (b - a) * u;
        const V = new Vector3(), Q = new Quaternion(), E3 = new Euler(), ONE = new Vector3(1, 1, 1);
        const P1 = new Vector3(), P2 = new Vector3(), T1 = new Vector3(), T2 = new Vector3();
        const place = (out, x, y, z, rx, ry, rz) => out.compose(V.set(x, y, z), Q.setFromEuler(E3.set(rx, ry, rz, "YXZ")), ONE);
        const pt = (m, x, y, z, out) => out.set(x, y, z).applyMatrix4(m);
        const wristTo = (S, P, out) => { T1.subVectors(P, S); const d = T1.length() || 1e-6; out.copy(P).addScaledVector(T1, -HL / d); };   // the fingers at P
        // the elbow of the arm from the shoulder S to the wrist W (W is pulled in when it is beyond the arm's length): down, out and back
        const elbow = (S, W, side, out) => {
          T1.subVectors(W, S);
          let d = T1.length();
          T1.multiplyScalar(1 / (d || 1e-6));
          if (d > UA + FA - 1e-3) { d = UA + FA - 1e-3; W.copy(S).addScaledVector(T1, d); }
          const ca = Math.max(-1, Math.min(1, (UA * UA + d * d - FA * FA) / (2 * UA * Math.max(d, 1e-4)))), sa = Math.sqrt(Math.max(0, 1 - ca * ca));
          T2.set(side * 0.55, -1, -0.3);
          T2.addScaledVector(T1, -T2.dot(T1)).normalize();
          out.copy(S).addScaledVector(T1, UA * ca).addScaledVector(T2, UA * sa);
        };
        // every instrument at a moment: e8 - the music's eighth (fractional), v - 0 at rest .. 1 playing; sets f.IM (and f.IM2), f.WL, f.WR
        const HANDS = {
          lyre(f, e8, v) {   // before the chest, a little to the left, its top out and to the left; the left hand on its left arm, the right across the strings
            place(f.IM, 0.07, 1.2, 0.3, 0.28, 0.12, -0.22);
            pt(f.IM, 0.155, 0.2, -0.02, P1);
            const sw = v * 0.075 * Math.sin(Math.PI * e8 + f.ph);   // a stroke every eighth
            pt(f.IM, sw - 0.02 * (1 - v), 0.19, 0.045 + 0.035 * (1 - v), P2);
            wristTo(SHL, P1, f.WL); wristTo(SHR, P2, f.WR);
          },
          harp(f, e8, v) {   // at the hip before him, its pillar to his right; both hands on the strings, by turns
            place(f.IM, -0.17, 0.98, 0.3, 0.12, 0.25, 0.05);
            const a = v * Math.sin(Math.PI * e8 * 0.5 + f.ph), b = v * Math.sin(Math.PI * e8 * 0.5 + f.ph + Math.PI);
            pt(f.IM, 0.23 + 0.03 * a, 0.3 + 0.05 * a, 0.04 + 0.03 * (1 - v), P1);
            pt(f.IM, 0.09 + 0.03 * b, 0.36 + 0.05 * b, 0.04 + 0.03 * (1 - v), P2);
            wristTo(SHL, P1, f.WL); wristTo(SHR, P2, f.WR);
          },
          cym(f, e8, v) {   // a cymbal in each hand; they meet at the head of every phrase (the loop's clash, 92-sounds)
            const u = ((e8 / 16) % 1 + 1) % 1;
            let gap = 0.15;
            if (u > 0.86) gap = 0.035 + 0.115 * (1 - ss01((u - 0.86) / 0.14));
            else if (u < 0.22) gap = 0.035 + 0.115 * ss01((u - 0.04) / 0.18);
            gap = 0.15 + (gap - 0.15) * v;
            const y = 1.3 + 0.14 * v, z = 0.28 + 0.04 * v;
            place(f.IM, gap, y, z, 0, 0, 0);
            place(f.IM2, -gap, y, z, 0, 0, 0);
            P1.set(gap + 0.03, y - 0.01, z - 0.01); P2.set(-gap - 0.03, y - 0.01, z - 0.01);
            wristTo(SHL, P1, f.WL); wristTo(SHR, P2, f.WR);
          },
          tru(f, e8, v) {   // across the chest at rest; at the call (the loop's trumpets: the head of the first and the third phrase) to the mouth
            const u = ((e8 % 32) + 32) % 32;
            let up = 0;
            if (u >= 29.5) up = ss01((u - 29.5) / 2.5); else if (u < 4.2) up = 1; else if (u < 6) up = 1 - ss01((u - 4.2) / 1.8);
            HANDS.koh(f, up * v);
          },
          koh(f, up) {   // the trumpet in both hands: the right by the mouthpiece, the left further; up 0 - before him, a little down; 1 - at the mouth, its bell a little up
            place(f.IM, lerp(-0.08, 0, up), lerp(1.36, 1.985, up), lerp(0.24, 0.135, up), lerp(0.38, -0.14, up), lerp(0.32, 0, up), 0);
            pt(f.IM, 0, -0.03, 0.2, P2); pt(f.IM, 0, -0.03, 0.34, P1);
            wristTo(SHR, P2, f.WR); wristTo(SHL, P1, f.WL);
          },
          flute(f, e8, v) {   // at the mouth, down and forward; the left hand above, the right below it, the fingers at work
            const b = v * 0.012 * Math.sin(Math.PI * e8 * 0.5 + f.ph);
            place(f.IM, lerp(0.02, 0, v), lerp(1.4, 1.98, v), lerp(0.22, 0.13, v), lerp(1.15, 0.55, v), lerp(-0.2, 0, v), 0);
            pt(f.IM, 0, -0.025 + b, 0.2, P1); pt(f.IM, 0, -0.025 - b, 0.42, P2);
            wristTo(SHL, P1, f.WL); wristTo(SHR, P2, f.WR);
          }
        };
        const qB = new Quaternion(), eB = new Euler(), vB = new Vector3(), vS = new Vector3(), mW = new Matrix4();
        // a set: figs [{ x, y, z, yaw, kind, cw (the crowd's handle), ci (its index there), skin }] in `parent`, their sleeves `robe`
        const set = (parent, figs, robe) => {
          const PP = tm_people(ctx2);
          const rig = PP.rig(parent, figs.length, { robe, skin: (i) => figs[i].skin });
          const count = {}, inst = {}, all = [];
          figs.forEach((f, i) => {
            f.ri = i; f.ii = count[f.kind] = (count[f.kind] || 0);
            count[f.kind]++;
            f.IM = new Matrix4(); f.IM2 = new Matrix4(); f.M = new Matrix4();
            f.WL = new Vector3(); f.WR = new Vector3(); f.EL = new Vector3(); f.ER = new Vector3();
            f.ph = ((i * 0.618) % 1) * 0.9; f.up = 0;
          });
          for (const k in count) {
            const n = count[k] * (k === "cym" ? 2 : 1);
            inst[k] = G[k].map((geo, j) => {
              const im = new InstancedMesh(geo, MAT[k][j], n);
              im.castShadow = false; im.receiveShadow = true; im.frustumCulled = false; im.userData.noPick = true; im.name = "simchaInstr";
              parent.add(im); all.push(im);
              return im;
            });
          }
          const crowds = [...new Set(figs.map((f) => f.cw).filter(Boolean))];
          return {
            g: parent, figs,
            // e8 - the music's eighth; v - how much they play (0 .. 1); the body's sway and the hands at their work. Every frame, near
            // or far (a few tens of thousands of triangles in all): a pause, or a flight to them in it, finds them set
            play(e8, v) {
              for (const f of figs) {
                const sw = v * Math.sin(Math.PI * 2 * e8 / 16 + f.ph * 7), nd = v * Math.sin(Math.PI * 2 * e8 / 8 + f.ph * 9);
                qB.setFromEuler(eB.set(0.03 * nd, f.yaw + 0.05 * sw, 0.025 * sw, "YXZ"));
                f.M.compose(vB.set(f.x, f.y, f.z), qB, vS.set(1.4, 1.4, 1.4));
                if (f.cw) f.cw.pose(f.ci, f.M);
                if (f.kind === "koh") HANDS.koh(f, f.up); else HANDS[f.kind](f, e8, v);
                elbow(SHL, f.WL, 1, f.EL);
                elbow(SHR, f.WR, -1, f.ER);
                rig.arm(f.ri, 1, f.M, SHL, f.EL, f.WL);
                rig.arm(f.ri, -1, f.M, SHR, f.ER, f.WR);
                const two = f.kind === "cym";
                mW.multiplyMatrices(f.M, f.IM);
                for (const im of inst[f.kind]) im.setMatrixAt(two ? 2 * f.ii : f.ii, mW);
                if (two) { mW.multiplyMatrices(f.M, f.IM2); for (const im of inst[f.kind]) im.setMatrixAt(2 * f.ii + 1, mW); }
              }
              for (const c of crowds) c.done();
              rig.done();
              for (const im of all) im.instanceMatrix.needsUpdate = true;
            }
          };
        };
        return { set };
      })();
