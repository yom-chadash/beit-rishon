//@@begin top-note
  // plugin/js/entry - renderer, scene, lights, camera, controls, input safety, the load sequence and the animation loop.
  // 1.0.1-K (K.9a, the user: "שפר מהירות טעינה של עלית התוסף", "תוסיף אופציה להגדלת זום או להקטנה באמצעות שתי אצבעות"):
  //   - the load is measured: a "[load]" table in the console (and window.__loadTimes): the three.js evaluation, the 10-core textures,
  //     the renderer/scene, PMREM + sky, every module, the shader compile, the first frame under the overlay, the first visible frame;
  //   - nothing is rendered while the modules load (1.0.1 rendered a frame after EVERY module behind the overlay: each frame compiled the
  //     new shaders synchronously - 27 frames, ~12 s of a ~14 s cold load on an Intel Iris Xe); the 30 ms wait per module is gone (one
  //     frame yield repaints the progress bar); the shaders compile together at the end (renderer.compileAsync: in parallel where the
  //     driver has KHR_parallel_shader_compile), then ONE frame is rendered under the overlay (texture uploads, shadow map), then the
  //     overlay goes;
  //   - two-finger zoom on a laptop touchpad: a pinch arrives as wheel events with ctrlKey (Chromium / WebView2) - handled here
  //     (preventDefault: the page itself never zooms) with a smooth dolly; a two-finger slide (small wheel deltas) zooms smoothly too;
  //     the mouse wheel stays with OrbitControls; touch pinch stays with OrbitControls;
  //   - the DPR bug (review entry-dpr-wheel-collapse): 00-lib.js getZoomScale divided by (100 * (devicePixelRatio | 0)) = 0 below DPR 1
  //     (one notch put the camera ON the target) - now / 100; controls.minDistance = 2; guardCamera never saves or accepts a pose closer
  //     than minDistance;
  //   - the arrow keys are no longer OrbitControls' (plain arrows PANNED and every arrow press anywhere was preventDefault-ed, so the side
  //     panel could not scroll): 70-ui.js turns the view with them like the nav buttons and leaves the panel's keys alone;
  //   - pointerSafety tracks EVERY pointer down on the canvas (a Map): a lost two-finger release is ended for both fingers.
  // 1.0.1-K review (ui-4): a touchpad pinch (ctrl + wheel) over the overlays (the pills, the label's card, the panel, the nav row, the
  //   presentation's box) no longer zooms the whole page: a window listener prevents every ctrl + wheel; the canvas keeps its own zoom.
  // 1.0.1-L (FIXES L.49, the user: "מהירות הסיבוב במודל 360 הוא מהיר מדי כברירת מחדל - האט אותו, וסיבוב איטי השאר כך"): the free drag
  //   rotation is slower - OrbitControls rotateSpeed 0.9 -> 0.5 (makeControls); the nav buttons' and the arrow keys' step is slowed in
  //   70-ui.js; "סיבוב איטי" (autoRotateSpeed 0.4, 70-ui.js) is unchanged.
  // 1.0.1-L (L.87): the pan is limited (ent_clampView), the damping follows time (ent_damp), a sideways wheel moves nothing, maxDistance 1400; (L.89) the bracket of a source is smaller in the labels.
  // 1.0.2 (the user: "שפר את ה-360 בכל התוסף"): in every roofed space a drag, the nav buttons and "סיבוב איטי" turn the view in place (ent_indoors, ent_look,
  //   ent_controlsUpdate); outside the drag orbits as before; the camera never goes into a wall (ent_wallStep). The loading view stays below the top bar (index.html):
  //   initModules marks the page ready (html.tm-ready) when it goes.
  // 1.0.2 (M; the user: "אני לא יכול לרדת מתחת לאמצע או מעל - בשולחנות אין לי דרך לראות את הבזיכין", "גם במכונות אותה בעיה"): the view is free up and down everywhere -
  //   the orbit's polar limit no longer keeps the eye above the target's level; it keeps the eye ENT_FLOOR_M over the floor or the ground under it (ent_floorStep), and,
  //   as before, out of the walls and the ceilings (ent_wallStep: a floor keeps 0.4 now, a wall or a ceiling 0.8). The eye's height: ArrowUp / ArrowDown, PageUp /
  //   PageDown and Shift + wheel raise and lower the eye and the target together (ent_liftStep); the tilt the arrows did stays on the nav buttons and on Shift + arrows.
  // 1.0.4 (the user, in the heichal: "כשאני מסתכל על המנורות למה אני לא יכול לראות מאחוריהם? יש לי בעיה בסיבוב בעיקר לצד שמאל. אם צריך תוותר על התקרה"): after a
  //   flight to something close under a roof (the menorot, the tables, the cherubim: ENT_ORBIT_NEAR) a drag orbits round it again, and the walls and the ceilings of
  //   the buildings let the camera through while the fade loop of 70-ui.js shows them see-through (ent_orbit, ent_passOn, ent_passSurf); the 360 in place stays for
  //   a hall seen from afar (the kodesh, the forest house) and after a look in place.
//@@end top-note
//@@begin makeLabelSprite2
  function makeLabelSprite2(text, size, l) {   // 1.3.3: l - the label's record; l.box draws the text on a dark plate (the altar's measures, as the Second Temple plugin)
//@@end makeLabelSprite2
//@@begin makeLabelSprite2-2
    if (l && l.onTop) spr.renderOrder = 10;   // 1.3.5 (as the Second Temple plugin 1.9.1): l.onTop - drawn over the stone it names
//@@end makeLabelSprite2-2
//@@begin after-viewWH
  // LIB187_302: PCFSoftShadowMap was removed from three.js (it warns and falls back to PCFShadowMap). 187's PCFShadowMap is soft
  // itself - five filtered samples within sun.shadow.radius (1, the default) - and its edge matched 160's soft one in the
  // before/after views, so the radius is left as it is
  renderer.shadowMap.type = PCFShadowMap;
//@@end after-viewWH
//@@begin ent_room
  // LIB187_302: in three.js 160 RoomEnvironment's main light was 5 when no renderer was passed (as here), and 900 only for a renderer
  // without legacy lights; from 163 on it is always 900, which washed the whole model out. 187 also lowers the room by 3.5, which 160
  // did not. Keep the look the model was tuned with: the light 5, the room where it was.
  var ent_room = new RoomEnvironment();
//@@end ent_room
//@@begin after-sky
  sky.material.uniforms.cloudCoverage.value = 0;   // LIB187_302: three.js 187's Sky draws clouds (0.4 by default); 160's had none
//@@end after-sky
//@@begin after-sc
  scene.add(new HemisphereLight(12572400, 9074e3, 0.75));
  // SHADOW_CACHE_302 (the user, 18.11.2026: "תשפר את המנוע הרגיל כמה שאתה יכול"): THE SUN'S SHADOW IS DRAWN AGAIN ONLY WHEN IT CHANGES.
  // Until now every frame drew the shadow map anew - every caster of the mount (about 1000) a second time, from the sun: measured, half the
  // frame's work (the opening view: 20.5 ms a frame with it, 9.6 without). The map depends on the casters and the light only, never on the eye.
  // It is drawn again when a caster moved, was shown, hidden, added or removed, its shape, material or layers changed, the light or its shadow
  // box changed, or the section (ent_sec) changed. The check walks the visible casters once a frame, as three.js's own pass does, and compares
  // each one's world matrix with the one the map was drawn with. Other scenes (the shader warm-up's) are passed through as before.
//@@end after-sc
//@@begin after-camera-note
  // HQ_302: the light toggles (85-hq.js); made before any material is compiled, since it adds its lines to every lit material
//@@end after-camera-note
//@@begin cam_decide
    cam.mode = (ent_wm.on || cam.roofed && (cam.lookLock || p.distanceTo(q) > CAM_NEAR)) ? "look" : "orbit";   // 1.2.9: walk mode is always "look"
//@@end cam_decide
//@@begin ent_walkStep.sd
    const sd = (W.right ? 1 : 0) - (W.left ? 1 : 0);   // 1.2.9 (walk mode): A / D strafe
//@@end ent_walkStep.sd
//@@begin free
    const free = (el) => !el || el === window || el === document || el === document.body || el === document.documentElement || el === renderer.domElement ||
      (el.nodeType === 1 && !el.isContentEditable && !/^(INPUT|TEXTAREA|SELECT)$/i.test(el.tagName || "") && !!(el.closest && el.closest("#tm-nav, #tm-compass, .tm-pill")));
    const WK = { w: "fwd", s: "back", a: "left", d: "right", "ו": "fwd", "ד": "back", "ש": "left", "ג": "right", W: "fwd", S: "back", A: "left", D: "right" };   // 1.2.9: walk mode's keys (QWERTY and the Hebrew layout)
//@@end free
//@@begin free-2
//@@end free-2
//@@begin after-cam_walkFloor-note
  // ===== 1.2.9 (from the Second Temple plugin 1.6.0, stage 6; the user: "תוסיף כפתור מצב הליכה", "מה עם בית ראשון לאחר החתך החי?"): WALK MODE.
  // The eye drops to 3 amot over the floor under it and looks ahead; the mode is "look" (turning in place); the mouse alone turns the view
  // under pointer lock (requested on the canvas; Esc or the button release it), and where pointer lock is refused (a webview) dragging turns
  // the view as in mode "look"; W / S / A / D (also ו ד ש ג and the arrows) walk and strafe at eye height through the existing walking
  // (ent_walkStep, with its pace by distance). ctx.shared.walkMode = { on, set(on) }; the html class "tm-walk" while on (the UI's button state).
//@@end after-cam_walkFloor-note
//@@begin ent_walkModeSet
    if (ctx && ctx.shared && ctx.shared.navRepaint) try { ctx.shared.navRepaint(); } catch (_) {}   // the nav box's button state
//@@end ent_walkModeSet
//@@begin after-ent_walkModeSet-note
  // ===== 1.2.9 (from the Second Temple plugin 1.6.0; the user: "חתך אמיתי"): THE LIVE SECTION - one clipping plane across the model, moved by
  // a slider: everything of the model (not the sky, the ground or the labels) on the far side of the plane is cut away, and the cut faces
  // show as the walls' inner faces (every clipped material is drawn two-sided while the section is on; no filled caps - a model choice,
  // told in the help). Axis "z": the plane is z = v, the SOUTH of it cut (a section through the house from the south, as the cutaway);
  // axis "x": x = v, the EAST cut (a section along the house's length, seen from the east). ctx.shared.section = { on, axis, v, set(on, axis, v) }.
  // Shader materials (the altar's flames) and sprites (the labels) are not clipped.
  // 1.3.4 (from the Second Temple plugin 1.9.1; the user: "כל סעיף 3 לעשות"): the materials are taken afresh every frame while the section
  // is on (ent_sectionApply, from the animation loop) - the wall fade swaps a wall's material for a copy of it, and the fixed list of 1.2.9
  // missed the copies (a faded wall stood whole across the cut); and a third axis, "y" - a plan, everything above v cut
//@@end after-ent_walkModeSet-note
//@@begin ent_sectionApply-note
      // 1.3.5 (the full scan: the dark edges of the doors' boards stood whole in the cut part): lines and points are cut as the meshes
//@@end ent_sectionApply-note
//@@begin ent_sectionApply-note-2
        // 1.3.5 (as the Second Temple plugin 1.9.1): a copy made while the section is on carries the plane and the two sides of its
        // original - its own side is taken as the front's
//@@end ent_sectionApply-note-2
//@@begin ent_sectionSet
    if (ent_sec.axis === "z") P.set(new Vector3(0, 0, -1), ent_sec.v);        // keeps p.z <= v (the north), cuts the south
    else if (ent_sec.axis === "y") P.set(new Vector3(0, -1, 0), ent_sec.v);   // keeps p.y <= v - a plan, everything above cut
    else P.set(new Vector3(-1, 0, 0), ent_sec.v);                             // keeps p.x <= v (the west), cuts the east
//@@end ent_sectionSet
//@@begin ent_sectionSet-2
    if (ctx && ctx.shared && ctx.shared.navRepaint) try { ctx.shared.navRepaint(); } catch (_) {}
//@@end ent_sectionSet-2
//@@begin ent_view
  // ===== 1.0.1-L (L.87, the user: "עדיין יש בעיה בגלילה בעיקר לצד ימין המסך בורח ללא שליטה") =====
  // Reproduced with real events in headless Chrome (SCR/L-part5/panel/scroll2.log): the wheel, the touchpad's slide and sideways deltas only change
  // the radius, but a pan (right button, Ctrl / Shift + left, a two-finger press on a touchpad) has no limit: three drags to the right put the target at
  // [-657, 30, 654], about 900 amot from the Temple, the model gone from the screen; and the damping is per frame, 6% of what is left each
  // frame, so at a low frame rate the view glides on for seconds after the release. Two fixes, for every input:
  // (1) ent_clampView: the target stays inside a band along the site (below; a flight may widen it), the camera moving with it;
  // (2) ent_damp: the damping follows time, 140 ms, whatever the frame rate (at 60 frames a second 0.11 instead of 0.06; at 10, 0.51).
  // (the limit is a band along the site, from the Temple's courts to the palace's, 230 amot to each side: at the first view's distance, 518, the view is 370 to
  // each side, so the site always stays on the screen. A flight to a farther target widens it until the next flight. Model choice; an earlier box of 90 amot round the
  // fly points' targets, and a band that always reached all of them, 350, left an empty desert: pics/s-right4.png, s2-right4.png.)
  var ent_view = { R0: 230, R: 230, yMin: -15, yMax: 180, d: new Vector3(), last: null, dt: 16.7 };
  var ENT_AX = [30, 0], ENT_BX = [103, 510];   // the axis of the site, in x / z: the inner court's middle and the forest house's (model choice)
//@@end ent_view
//@@begin set
      walkMode: { on: false, set: (on) => ent_walkModeSet(on) },                                    // 1.2.9
      section: { on: false, axis: "z", v: 0, set: (on, axis, v) => ent_sectionSet(on, axis, v) },   // 1.2.9
//@@end set
//@@begin after-root
  // PARALLELS_C (fix-c, 22.11.2026; as the Second Temple's SHILOACH_305): the limits of the view, for a demonstration that walks beyond
  // them (59-parallels.js: the pilgrim's walk, the Shiloach) - widened while it runs and given back after
  ctx.shared.viewLimits = { get: () => ({ R: ent_view.R, yMin: ent_view.yMin, yMax: ent_view.yMax }), set: (o) => { if (o) Object.assign(ent_view, o); }, include: (q) => ent_viewInclude(q) };
  ctx.shared.floorY = ctx.shared.floorY || ((x, y, z) => cam_floorY({ x, y, z }));   // the floor under a point (the walking mode's solids), as the Second Temple's
  // 1.9.2 / 1.3.4 (the user's recording: a chamber's roof came back while the eye was inside it, and all one saw was the stone):
  // ctx.shared.camUnder(list) - is the eye under one of these pieces (inside its plan, below its top)? Their boxes are taken once.
  // ctx.shared.openFor(id, ms) - a place or a row opens a pill for a while (another call within it starts the count again; a pill the user
  // opened himself stays open); when the time is up and the eye is under what the pill would put back (its under()), it waits 4 s more
//@@end after-root
//@@begin after-root-note
  // 1.3.5 (the full scan of 10.11.2026: a place's roof, section or zone stayed for the rest of its 15 s over the NEXT place's view):
  // ctx.shared.sectionFor(axis, v, ms) - a place or a row shows a section of the model for a while (another call within it starts the
  // count again); ctx.shared.closeAuto() - everything a place or a row opened for a while (openFor's pills, sectionFor's section) goes
  // back at once: the next place or chip calls it before its own action. What the user opened himself (a pill, the navigation box's
  // section) has no timer and stays. ctx.shared.holdAuto(on) - the presentation holds what a slide opened until the slide is left.
//@@end after-root-note
//@@begin sounds.LEVEL
    const LEVEL = { water: 0.07, creak: 0.06, bigGate: 0.16, trumpets: 0.045, cymbals: 0.045, click: 0.05, step: 0.02, hiss: 0.03, wicket: 0.045, wheel: 0.05, wheels: 0.05, steps: 0.02 };
//@@end sounds.LEVEL
//@@begin pluck
//@@end pluck
//@@begin trumpets
        brass(a, t, 1.4, k);
        for (let i = 0; i < 9; i++) brass(a, t + 1.8 + i * 0.16, 0.08, k);
        brass(a, t + 3.4, 1.4, k);
//@@end trumpets
//@@begin sounds
//@@end sounds
//@@begin initModules
      { name: "mount.js", build: buildMount },
      { name: "courts.js", build: buildCourts },
      { name: "altar.js", build: buildAltar },
      { name: "vessels.js", build: buildVessels },
      { name: "heichal.js", build: buildHeichal },
      { name: "interior.js", build: buildInterior },
      { name: "kelim.js", build: buildKelim },   // 1.0.1-L (L.88): the vessels of I Kings 7 (57-kelim.js); before ui.js, it reads the labels
      { name: "ark.js", build: buildArk },   // ARK_GATES_208 (58-ark.js): "דבקו שערים" - the ark brought into the devir
      { name: "parallels.js", build: buildParallels },   // PARALLELS_C (fix-c, 59-parallels.js): the counterparts of the Second Temple's places
      { name: "palace.js", build: buildPalace },
      { name: "ui.js", build: buildUI },
      { name: "tour.js", build: buildTour }   // 1.0.1-H: the presentation (75-tour.js); after ui.js, it uses ctx.ui
//@@end initModules
//@@begin initModules-2
      "טוען את הר הבית והחצר הגדולה",
      "טוען את חצר הכהנים ושעריה",
      "טוען את מזבח הנחושת",
      "טוען את הים, המכונות ויכין ובועז",
      "טוען את האולם, ההיכל והיציע",
      "טוען את הקודש וקודש הקדשים",
      "טוען את כלי הבית",
      "מכין את הכנסת הארון",
      "מוסיף את בית הכנסת, השולחנות והמעיין",
      "טוען את בית שלמה",
//@@end initModules-2
//@@begin guardCamera.lo
        // CAM_219 (4): not in walk mode - there the eye keeps its height over the floor under ITSELF (cam_walkFloor); the target's floor
        // held it up when one walked backward down a stair (the target still on the top step)
        const lo = Math.max(typeof ctx.shared.camLow === "number" ? ctx.shared.camLow : -27.5, !ent_wm.on && isFinite(cam.floorY) ? cam.floorY + 0.35 : -Infinity);   // PARALLELS_C: ctx.shared.camLow - a walk in the valley (as the Second Temple's SHILOACH_305)
//@@end guardCamera.lo
//@@begin after-guardCamera
    if (ent_sec.on) ent_sectionApply();   // 1.3.4: the materials swapped in since (the wall fade's copies) are cut too
//@@end after-guardCamera
