#!/usr/bin/env python3
# WALK_STAIRS_306 - walk mode climbs a stair at any pace (both houses: the first's src/90-entry.js, the second's bundle).
# A report sent on to the user (20.11.2026 14:21): "כשהולכים במצב הליכה בעזרת נשים ומתקרבים למדרגות של שער ניקנור, המבט נכנס לתוך
# עובי המדרגות במקום לעלות עם גובה המדרגות". The ray for the floor went down from a knee (1.2) over the eye's EASED feet: up the fifteen
# steps (half an amah high and deep - a rise of 1 in 1) at the walking pace (9 amot a second) the eased feet lag the floor by about an
# amah, and between two rays (every half an amah) the floor rises half an amah more - the knee fell under the next step's face, the ray
# began inside the stairs and found the court's floor under them, and the eye went down into the steps. Now the floor is followed along
# the way walked since the last ray, a third of an amah at a time, each ray from a knee over the floor found before it (not over the eye):
# a stair under a knee is climbed at any pace; a ledge higher than 1.2 over the floor before it is still a wall. Climbing eases a little
# faster (60 ms; going down - 110 as before), so the eye keeps its height over the steps.
# Usage: walk_stairs.py <file> ["semis"]  - "semis": the bundle's lines end with " //" (the second house)
import sys
p = sys.argv[1]
semi = len(sys.argv) > 2
s = open(p, encoding='utf-8').read()
E = ' //' if semi else ''
if 'WALK_STAIRS_306' in s:
    sys.exit(p + ': WALK_STAIRS_306 already applied')
def L(t):
    return t + E + '\n'
old_head = [
    "  // CAM_219 (4) (the audit: walk mode set the eye 3 amot over the floor once, when it began, and then walked level - from the court into",
]
a = s.index("  var cam_wf = { h: NaN, rayAt: -1e9, x: NaN, z: NaN, fy: NaN, o: new Vector3() };" + E + "\n")
b = s.index("  (function liftKeys() {" + E + "\n", a)
new = ''.join(L(t) for t in [
    "  // WALK_STAIRS_306 (a report sent on to the user, 20.11.2026: walking in the women's court up to the steps of Nikanor's gate, the view",
    "  // went into the steps instead of climbing them): the ray went down from a knee over the eye's eased feet, which on a stair at a walking",
    "  // pace lag the floor by about an amah - the knee fell under the next step's face, the ray began inside the stairs and found the floor",
    "  // under them. Now the floor is followed along the way walked since the last ray, a third of an amah at a time, each ray from a knee over",
    "  // the floor found before it: a stair under a knee is climbed at any pace, a ledge higher than 1.2 is still a wall. Up eases in 60 ms,",
    "  // down in 110.",
    "  var cam_wf = { h: NaN, rayAt: -1e9, x: NaN, z: NaN, fy: NaN, o: new Vector3() };",
    "  function cam_walkFloor(dt) {",
    "    const p = camera.position, q = controls.target, F = cam_wf, now = performance.now();",
    "    if (!Number.isFinite(F.h)) { F.rayAt = -1e9; F.x = NaN; }   // a new walk (ent_walkStep: the walk stood): its height over the floor is taken afresh",
    "    const moved = Number.isFinite(F.x) ? Math.hypot(p.x - F.x, p.z - F.z) : 0;",
    "    if (now - F.rayAt >= 90 || moved > 0.3) {",
    "      F.rayAt = now;",
    "      const ray = cam.ray || (cam.ray = new Raycaster());",
    "      ray.camera = camera;",
    "      ray.near = 0;",
    "      ray.far = 400;",
    "      const solids = ent_solids(false);",
    "      const down = (x, z, from) => {",
    "        try {",
    "          ray.set(F.o.set(x, from, z), CAM_DOWN);",
    "          const h = ray.intersectObjects(solids, false);",
    "          return h.length ? h[0].point.y : NaN;",
    "        } catch (_) { return NaN; }",
    "      };",
    "      let fy = NaN;",
    "      if (!Number.isFinite(F.x) || !Number.isFinite(F.fy)) {",
    "        fy = down(p.x, p.z, (Number.isFinite(F.h) ? p.y - F.h : p.y - ent_wm.eye) + 1.2);",
    "      } else {",
    "        const n = Math.min(24, Math.max(1, Math.ceil(moved / 0.33)));",
    "        let base = F.fy;",
    "        fy = base;",
    "        for (let i = 1; i <= n; i++) {",
    "          const u = i / n, y = down(F.x + (p.x - F.x) * u, F.z + (p.z - F.z) * u, base + 1.2);",
    "          if (Number.isFinite(y)) base = fy = y;",
    "        }",
    "      }",
    "      F.x = p.x;",
    "      F.z = p.z;",
    "      F.fy = fy;",
    "      if (!Number.isFinite(F.h) && Number.isFinite(fy)) F.h = Math.max(0.5, p.y - fy);",
    "    }",
    "    if (!Number.isFinite(F.fy) || !Number.isFinite(F.h)) return;",
    "    const want = F.fy + F.h, dy = want - p.y;",
    "    if (Math.abs(dy) < 0.003) return;",
    "    const s = dy * (1 - Math.exp(-Math.max(1, dt) / (dy > 0 ? 60 : 110)));",
    "    p.y += s;",
    "    q.y += s;",
    "  }",
])
# keep the old comment block above (CAM_219 (4)) - only the variable and the function are replaced
s = s[:a] + new + s[b:]
open(p, 'w', encoding='utf-8').write(s)
print(p + ': WALK_STAIRS_306 applied')
