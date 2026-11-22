    // ===== TEF_STRAP_A2 (fix-a2; the user, 22.11.2026 12:15, via the coordinator: "רצועות התפילין — דקות, שחורות ושטוחות (רצועת עור),
    // ולא חוט עגול כמו גליל"): THE STRAP OF THE TEFILLIN - a flat band of leather along a path, as a strap lies on what it is wound on.
    // One construction for all the tefillin of both houses (shared/frag/strap.js, by an include line "strap"): the priests' and the
    // Levites' (priest-kit.js - the head's ring and its two ends, the arm's under the sleeve and on the hand) and the crowds' (people-kit.js).
    //   tm_strap(pts, nrm, w, t, closed, seg) -> a geometry (positions and normals, no texture coordinates): pts - its middle line
    //   (Vector3); nrm(p, i) - the normal of what it lies on at p (its face turned to it: the head, the arm, the hand); w - its breadth,
    //   t - its thickness; closed - a ring; seg - the pieces along it. Its four faces - the face, the back and the two edges - each flat
    //   across. Its breadth and thickness - model choices.
    const tm_strap = (pts, nrm, w, t, closed = false, seg = 0) => {
      const curve = new CatmullRomCurve3(pts, closed), n = seg || Math.max(16, pts.length * 4);
      const P = [], N = [], B = [], T = [];
      let bPrev = null;
      for (let i = 0; i <= n; i++) {
        const u = i / n, p = curve.getPointAt(closed && i === n ? 0 : u), tg = curve.getTangentAt(closed && i === n ? 0 : u).normalize();
        const s = nrm(p, i).clone().normalize();
        let b = new Vector3().crossVectors(tg, s);
        if (b.lengthSq() < 1e-10) b = bPrev ? bPrev.clone() : new Vector3(1, 0, 0);
        b.normalize();
        if (bPrev && b.dot(bPrev) < 0) b.negate();   // no twist where the normal turns over
        const nn = new Vector3().crossVectors(b, tg).normalize();
        P.push(p); N.push(nn); B.push(b); T.push(tg);
        bPrev = b;
      }
      const pos = [], nor = [], idx = [];
      // a face from the corner (sb, sn) to the corner (sb2, sn2) - B and N signs - its normal (mb, mn); triangles (a, a', b), (b, a', b')
      const face = (sb, sn, sb2, sn2, mb, mn) => {
        const base = pos.length / 3;
        for (let i = 0; i <= n; i++) {
          const p = P[i], b = B[i], nn = N[i];
          for (const [qb, qn] of [[sb, sn], [sb2, sn2]]) {
            pos.push(p.x + b.x * qb * w / 2 + nn.x * qn * t / 2, p.y + b.y * qb * w / 2 + nn.y * qn * t / 2, p.z + b.z * qb * w / 2 + nn.z * qn * t / 2);
            nor.push(b.x * mb + nn.x * mn, b.y * mb + nn.y * mn, b.z * mb + nn.z * mn);
          }
        }
        for (let i = 0; i < n; i++) { const a = base + i * 2, c = a + 2; idx.push(a, c, a + 1, a + 1, c, c + 1); }
      };
      face(1, 1, -1, 1, 0, 1);     // the face (toward +N): from +B to -B
      face(-1, 1, -1, -1, -1, 0);  // the edge at -B
      face(-1, -1, 1, -1, 0, -1);  // the back
      face(1, -1, 1, 1, 1, 0);     // the edge at +B
      const g = new BufferGeometry();
      g.setAttribute("position", new Float32BufferAttribute(pos, 3));
      g.setAttribute("normal", new Float32BufferAttribute(nor, 3));
      g.setIndex(idx);
      return g;
    };
