// What sits inside the M3: film path, focal-plane shutter, transport gears
// and the coupled rangefinder. Positions are illustrative (evidence.md).
import { mirrorAngle, rollRadius } from '../optics.js';
import { createFilm } from './film.js';
import {
  AXIS, CASSETTE, DRUMS, DRUM_Z, FILM_LENGTH, FILM_X0, FILM_X1, FILM_Z, FRAMELINE, GEAR_Y,
  LEADER_TIP, LEVER, MIRROR_EXAGGERATION, OPTIC_Z, RF, SPROCKET, TAKEUP, VF, Y_TOP, Z_BACK, Z_FRONT,
} from './layout.js';

const GATE_HALF = 18;
const CURTAIN_HALF = 21;
const SPROCKET_R = 6;
const ROLLER_ARM = 8.5;
const PIVOT = [6, 23, -11.2];

function buildFilmPath(kit, root) {
  const { add, geo, group, anchor, T } = kit;
  const y = AXIS[1];
  const cassette = group(root, { part: 'cassette', p: [CASSETTE[0], y, CASSETTE[1]] });
  add(cassette, geo.post(12.5, 38, 40), 'chrome');
  for (const cy of [-19.6, 19.6]) add(cassette, geo.post(13, 1.2, 40), 'dark', { p: [0, cy, 0] });
  add(cassette, geo.box(4, 34, 3.4), 'dark', { p: [9.6, 0, 7.6], r: [0, -0.5, 0] });
  const cassetteSpool = group(cassette, {});
  add(cassetteSpool, geo.post(4.2, 44, 16), 'dark', { edges: 12 });
  const cassetteRoll = add(cassette, geo.post(1, 35, 40), 'roll');
  anchor(cassette, 'cassette', [0, 21, 0]);

  const takeup = group(root, { part: 'takeup', p: [TAKEUP[0], y, TAKEUP[1]] });
  const takeupSpool = group(takeup, {});
  add(takeupSpool, geo.post(6, 36, 18), 'mech', { edges: 12 });
  for (const cy of [-18, 18]) add(takeupSpool, geo.post(10.2, 1.2, 36), 'mech', { p: [0, cy, 0] });
  add(takeupSpool, geo.box(1.2, 30, 9), 'dark', { edges: false });
  const takeupRoll = add(takeup, geo.post(1, 34, 40), 'roll');
  anchor(takeup, 'takeup', [0, 19, 0]);

  const sprocket = group(root, { part: 'sprocket', p: [SPROCKET[0], y, SPROCKET[1]] });
  const sprocketDrum = group(sprocket, {});
  add(sprocketDrum, geo.post(SPROCKET_R, 31, 28), 'mech', { edges: 14 });
  for (let i = 0; i < 10; i++) {
    const a = (i / 10) * Math.PI * 2;
    for (const ty of [-15.3, 15.3]) {
      add(sprocketDrum, geo.box(1.7, 2.4, 1.6), 'mech', { p: [Math.cos(a) * 6.6, ty, Math.sin(a) * 6.6], r: [0, -a, 0], edges: false });
    }
  }
  anchor(sprocket, 'sprocket', [0, 16, 0]);

  const film = group(root, { part: 'film' });
  const strip = createFilm(T);
  add(film, new T.PlaneGeometry(FILM_X1 - FILM_X0, 35), 'roll', {
    p: [(FILM_X0 + FILM_X1) / 2, y, FILM_Z], material: strip.material, keep: true, edges: false,
  });
  anchor(film, 'film', [-30, y + 14, FILM_Z]);

  const gate = group(root, { part: 'gate' });
  add(gate, geo.plate(44, 40, 0.8, [[0, 0, 36, 24]]), 'mech', { p: [AXIS[0], y, FILM_Z - 0.85] });
  for (const ry of [-18.4, 18.4]) add(gate, geo.box(70, 1, 0.6), 'mech', { p: [0, y + ry, FILM_Z - 0.5] });
  anchor(gate, 'gate', [GATE_HALF, y - 12, FILM_Z - 1]);

  function setFilm(pos, negatives) {
    strip.draw(pos, negatives);
    const outside = pos - LEADER_TIP - FILM_X0;
    cassetteRoll.scale.set(rollRadius(FILM_LENGTH - outside, 4.4), 1, rollRadius(FILM_LENGTH - outside, 4.4));
    const wound = Math.max(0, pos - LEADER_TIP - FILM_X1);
    const r = rollRadius(wound, 6.05);
    takeupRoll.scale.set(r, 1, r);
    takeupRoll.visible = wound > 0;
    sprocketDrum.rotation.y = -pos / SPROCKET_R;
    takeupSpool.rotation.y = -pos / 7.8;
    cassetteSpool.rotation.y = -pos / 7.2;
  }

  return { groups: { cassette, takeup, sprocket, film, gate }, setFilm, dispose: strip.dispose };
}

function buildShutter(kit, root) {
  const { add, geo, group, anchor, T } = kit;
  const shutter = group(root, { part: 'curtains' });
  const drums = DRUMS.map((x) => {
    const g = group(shutter, { p: [x, AXIS[1], DRUM_Z] });
    add(g, geo.post(2.6, 32, 16), 'mech', { edges: 12 });
    return g;
  });
  const curtain = (z) => add(shutter, new T.PlaneGeometry(1, 30), 'curtain', { p: [0, AXIS[1], z] });
  const first = curtain(FILM_Z - 1.65);
  const second = curtain(FILM_Z - 2.15);
  const slit = new T.Mesh(new T.PlaneGeometry(1, 24), kit.materials.glow);
  slit.position.set(0, AXIS[1], FILM_Z - 0.2);
  slit.visible = false;
  shutter.add(slit);
  anchor(shutter, 'curtains', [-10, AXIS[1] - 15, FILM_Z - 1.8]);

  const span = (mesh, a, b) => {
    mesh.visible = b - a > 0.05;
    mesh.scale.x = Math.max(0.001, b - a);
    mesh.position.x = (a + b) / 2;
  };
  /* The first curtain covers [−21, e1]; the second covers [e2, 21].
     Exposure happens wherever e1 < e2. */
  function setCurtains(e1, e2, exposing) {
    span(first, -CURTAIN_HALF, e1);
    span(second, e2, CURTAIN_HALF);
    drums[0].rotation.y = e1 / 2.6;
    drums[1].rotation.y = -e2 / 2.6;
    const a = Math.max(e1, -GATE_HALF), b = Math.min(e2, GATE_HALF);
    slit.visible = exposing && b - a > 0.1;
    if (slit.visible) span(slit, a, b);
  }
  return { group: shutter, setCurtains };
}

function buildGears(kit, root) {
  const { add, geo, group, anchor } = kit;
  const gears = group(root, { part: 'gears' });
  const centres = [LEVER, SPROCKET, [DRUMS[1], DRUM_Z]];
  const d = (a, b) => Math.hypot(a[0] - b[0], a[1] - b[1]);
  const radii = [d(LEVER, SPROCKET) - SPROCKET_R, SPROCKET_R, d(SPROCKET, centres[2]) - SPROCKET_R];
  const wheels = centres.map(([x, z], i) => {
    const g = group(gears, { p: [x, GEAR_Y, z] });
    add(g, geo.gear(radii[i], 1.6), 'brass', { edges: 40 });
    return g;
  });
  add(gears, geo.post(1.1, Y_TOP - 16), 'mech', { p: [LEVER[0], (Y_TOP + 16) / 2, LEVER[1]] });
  add(gears, geo.post(1.1, 7), 'mech', { p: [SPROCKET[0], GEAR_Y - 3, SPROCKET[1]] });
  add(gears, geo.post(1.1, 8), 'mech', { p: [DRUMS[1], GEAR_Y - 3.5, DRUM_Z] });
  add(gears, geo.post(1.3, Y_TOP - 19), 'mech', { p: [CASSETTE[0], (Y_TOP + 19) / 2, CASSETTE[1]], part: 'rewindKnob' });
  anchor(gears, 'gears', [LEVER[0], GEAR_Y + 1, LEVER[1] + 8]);
  function setTransport(filmPos) {
    const turn = -filmPos / SPROCKET_R;
    wheels[1].rotation.y = turn;
    wheels[0].rotation.y = -turn * (radii[1] / radii[0]);
    wheels[2].rotation.y = -turn * (radii[1] / radii[2]);
  }
  return { group: gears, setTransport };
}

function buildRangefinder(kit, root) {
  const { add, geo, group, anchor, T } = kit;
  const optics = group(root, {});
  const splitter = group(optics, { part: 'splitter', p: [VF[0], VF[1], OPTIC_Z] });
  add(splitter, geo.box(12, 12, 12), 'glass');
  add(splitter, new T.PlaneGeometry(16.6, 11.8), 'mirror', { r: [0, Math.PI / 4, 0] });
  anchor(splitter, 'splitter', [0, 6.5, 0]);
  add(optics, geo.disc(4.6, -4.2, -2.6), 'glass', { p: [VF[0], VF[1], Z_BACK], r: [0, Math.PI, 0], part: 'eyepiece' });

  const frame = group(optics, { part: 'frameline' });
  add(frame, geo.plate(11, 8, 0.4, [[0, 0, 8.2, 5.4]]), 'mech', { p: [FRAMELINE[0], FRAMELINE[1], Z_FRONT + 4] });
  add(frame, geo.box(6, 6, 6), 'glass', { p: [FRAMELINE[0], FRAMELINE[1], OPTIC_Z] });
  add(frame, new T.PlaneGeometry(8.4, 5.8), 'mirror', { p: [FRAMELINE[0], FRAMELINE[1], OPTIC_Z], r: [0, Math.PI / 4, 0] });

  const mirrorRoot = group(optics, { part: 'rfMirror', p: [RF[0], RF[1], OPTIC_Z] });
  add(mirrorRoot, geo.post(0.8, 12), 'mech');
  const mirror = group(mirrorRoot, {});
  add(mirror, geo.box(12, 9, 0.9), 'mirror', { r: [0, Math.PI / 4, 0] });
  add(mirror, geo.box(7.4, 1.2, 1.2), 'mech', { p: [-4.6, 2, 0] });
  anchor(mirrorRoot, 'rfMirror', [3, 5, 0]);

  const roller = group(optics, { part: 'roller', p: PIVOT });
  add(roller, geo.post(1.2, 2.6), 'mech', { r: [0, 0, Math.PI / 2] });
  add(roller, geo.box(1.4, ROLLER_ARM, 1.4), 'mech', { p: [0, -ROLLER_ARM / 2, 0] });
  add(roller, geo.box(1.2, 5, 1.2), 'mech', { p: [0, 2.5, 0] });
  add(roller, geo.post(1.7, 3, 18), 'brass', { p: [0, -ROLLER_ARM, 0], r: [0, 0, Math.PI / 2] });
  anchor(roller, 'roller', [0, -ROLLER_ARM, 0]);
  const link = add(optics, geo.post(0.6, 1, 10), 'mech', { part: 'roller' });

  // Light paths, shown only in X-ray.
  const eyeZ = Z_BACK + 16;
  kit.rays(optics, [[VF[0], VF[1], Z_FRONT - 34], [VF[0], VF[1], eyeZ]]);
  kit.rays(optics, [[FRAMELINE[0], FRAMELINE[1], Z_FRONT - 12], [FRAMELINE[0], FRAMELINE[1], OPTIC_Z], [VF[0], FRAMELINE[1], OPTIC_Z], [VF[0], FRAMELINE[1], eyeZ]]);
  const rfRay = kit.rays(optics, [[RF[0], RF[1], Z_FRONT - 34], [RF[0], RF[1], OPTIC_Z], [VF[0], RF[1], OPTIC_Z], [VF[0], RF[1], eyeZ]]);

  const v = new T.Vector3(), up = new T.Vector3(0, 1, 0);
  function setFocus(distance, extension) {
    const delta = mirrorAngle(distance) * MIRROR_EXAGGERATION;
    mirror.rotation.y = delta;
    const swing = Math.asin(Math.min(0.95, extension / ROLLER_ARM));
    roller.rotation.x = swing;
    // Link from the crank tip to the mirror lever tip.
    const crank = new T.Vector3(0, 5, 0).applyEuler(roller.rotation).add(roller.position);
    const lever = new T.Vector3(-8.2 * Math.cos(delta), 2, 8.2 * Math.sin(delta)).add(mirrorRoot.position);
    v.subVectors(lever, crank);
    link.position.copy(crank).addScaledVector(v, 0.5);
    link.scale.set(1, v.length(), 1);
    link.quaternion.setFromUnitVectors(up, v.normalize());
    // The reflected beam turns twice the mirror swing.
    const p = rfRay.geometry.attributes.position;
    const z = OPTIC_Z + (RF[0] - VF[0]) * Math.tan(2 * delta);
    p.setXYZ(2, VF[0], RF[1], z);
    p.setXYZ(3, VF[0], RF[1], z + (eyeZ - OPTIC_Z));
    p.needsUpdate = true;
    rfRay.computeLineDistances();
  }
  return { group: optics, setFocus };
}

/* Light through the lens during an exposure: corner rays cross at the
   lens and land upside down on the gate. */
function buildExposureRays(kit, root) {
  const rays = [];
  const y = AXIS[1];
  for (const [sx, sy] of [[-1, -1], [1, -1], [-1, 1], [1, 1], [0, 0]]) {
    const item = kit.rays(root, [[sx * 26, y + sy * 17, Z_FRONT - 90], [sx * 7, y + sy * 5, Z_FRONT - 24], [-sx * 18, y - sy * 12, FILM_Z]]);
    item.userData.hidden = true;
    rays.push(item);
  }
  return function setExposureRays(on, xray) {
    rays.forEach((r) => { r.userData.hidden = !on; r.visible = on && xray; });
  };
}

export function buildMechanism(kit, root) {
  const filmPath = buildFilmPath(kit, root);
  const shutter = buildShutter(kit, root);
  const gears = buildGears(kit, root);
  const rangefinder = buildRangefinder(kit, root);
  const setExposureRays = buildExposureRays(kit, root);
  return {
    groups: { ...filmPath.groups, shutter: shutter.group, gears: gears.group, optics: rangefinder.group },
    setFilm(pos, negatives) { filmPath.setFilm(pos, negatives); gears.setTransport(pos); },
    setCurtains: shutter.setCurtains,
    setFocus: rangefinder.setFocus,
    setExposureRays,
    dispose: filmPath.dispose,
  };
}
