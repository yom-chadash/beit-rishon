      // ===== MIZRAK_A2 (fix-a2; the user, 22.11.2026 12:16, via the coordinator: "הוא נראה כספל מאורך, רק מחודד בסופו"): THE MIZRAK, as
      // the book "מקרא מפורש" draws it - p. מ (the bronze vessels) and p. מד (the gold): a cone, its rim round and broad, open above, its
      // sides straight down to a point, about 1.3 times as high as its rim is broad; a thin rim, the inside smooth; a straight thin rod
      // out of the rim's side, outward and a little up, about as long as the rim is broad. So the Mishnah of the Pesach's bowls, Pesachim
      // 5:5 (53:42): "ולא היו לבזיכין שולים, שמא יניחום ויקרש הדם", and the Bartenura there (589:239): "רחבים היו מלמעלה ותחתיהם חדים, כדי
      // שלא יוכלו לישב על הקרקע" - it cannot stand on a floor: held, laid on its side, or in a stand. One construction for both houses
      // (shared/frag/mizrak.js, by an include line "mizrak"); each place gives its own metal (mat). Its size - a model choice.
      //   tm_mizrak(mat, o) -> a group: o.r the rim's radius (0.17), o.h the height in rims' radii (2.6), o.grip where its origin is, a
      //   share of the height from the point (0 - the point), or o.at "rod" - its origin at the rod's end (held by the rod), o.handleYaw
      //   the rod's turn about the axis (0: toward +x), o.bloodMat - the blood in it (hidden: userData.blood), o.seg. userData: { R, H,
      //   rimY (the rim over the origin), lip(a) - a point on the rim (a: round the axis from +z) }
      const tm_mizrak = (mat, o = {}) => {
        const R = o.r || 0.17, H = (o.h || 2.6) * R, th = R * 0.035, y0 = -(o.grip || 0) * H, seg = o.seg || 40, g = new Group();
        const V = (x, y) => new Vector2(x, y + y0);
        // out from the point up its side, over the thin rim, and down its inside (smooth) to near the point
        const prof = [V(0.0002, 0), V(R * 0.03, H * 0.012), V(R, H), V(R + th * 0.55, H + th * 0.35), V(R + th * 0.15, H + th * 0.95), V(R - th * 0.7, H + th * 0.55),
          V(R - th * 1.1, H - th * 0.4), V(R * 0.5 - th * 1.1, H * 0.5), V(0.0002, th * 2.9)];
        const cone = new Mesh(new LatheGeometry(prof, seg), mat);
        cone.castShadow = true;
        g.add(cone);
        // the rod: from the rim's side, outward and a little up (as the book), about as long as the rim is broad; a round end
        const rr = R * 0.05, L = 2 * R, a = Math.atan2(0.42, 1), sx = R * 0.93 - rr * 0.5, sy = H * 0.93 + y0;
        const rodG = new CylinderGeometry(rr, rr, L, 10);
        rodG.rotateZ(-(Math.PI / 2 - a));
        rodG.translate(sx + Math.cos(a) * L / 2, sy + Math.sin(a) * L / 2, 0);
        const endG = new SphereGeometry(rr * 1.3, 10, 8);
        endG.translate(sx + Math.cos(a) * L, sy + Math.sin(a) * L, 0);
        for (const q of [rodG, endG]) { q.translate(0, -sy, 0); q.rotateY(o.handleYaw || 0); q.translate(0, sy, 0); const m = new Mesh(q, mat); m.castShadow = true; g.add(m); }
        // held by the rod: the origin at its end
        const off = new Vector3();
        if (o.at === "rod") off.set(sx + Math.cos(a) * L, sy + Math.sin(a) * L, 0).applyAxisAngle(new Vector3(0, 1, 0), o.handleYaw || 0).setY(sy + Math.sin(a) * L);
        if (o.bloodMat) {   // the blood, four fifths up (a model choice)
          const bf = 0.8, b = new Mesh(new CircleGeometry(R * bf - th * 1.2, seg).rotateX(-Math.PI / 2), o.bloodMat);
          b.position.y = H * bf + y0;
          b.visible = false;
          g.add(b);
          g.userData.blood = b;
        }
        for (const ch of g.children) ch.position.sub(off);
        g.userData.R = R;
        g.userData.H = H;
        g.userData.rimY = H + y0 - off.y;
        g.userData.lip = (ang) => new Vector3(Math.sin(ang) * R, H + y0, Math.cos(ang) * R).sub(off);
        return g;
      };
