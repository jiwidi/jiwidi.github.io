// The M3 shell and its outside controls.
import { SPEEDS } from '../optics.js';
import {
  AXIS, D, DIAL, FILM_Z, FRAMELINE, LEVER, R_END, RELEASE, REWIND, RF, SHOE, VF, W,
  Y_BASE, Y_BOTTOM, Y_SEAM, Y_TOP, Z_BACK, Z_FRONT,
} from './layout.js';

const DIAL_STEP = (Math.PI * 2) / 12;
const LEVER_REST = 0.29;

function faceTexture(T, size) {
  const canvas = document.createElement('canvas');
  canvas.width = canvas.height = size;
  const texture = new T.CanvasTexture(canvas);
  texture.colorSpace = T.SRGBColorSpace;
  texture.anisotropy = 4;
  return { canvas, texture, material: new T.MeshBasicMaterial({ map: texture }) };
}

function buildWindows(kit, top) {
  const { add, geo, anchor, group } = kit;
  const z = Z_FRONT - 0.35;
  const windowAt = (part, [x, y], w, h, role) => {
    const g = group(top, { part });
    add(g, geo.plate(w + 2.4, h + 2.4, 0.7, [[0, 0, w, h]]), 'chrome', { p: [x, y, z] });
    add(g, geo.box(w, h, 0.5), role, { p: [x, y, z + 0.1] });
    anchor(g, part, [x, y, z - 0.4]);
    return g;
  };
  windowAt('vfWindow', VF, 21, 12.5, 'glass');
  windowAt('frameline', FRAMELINE, 10.5, 7.5, 'frosted');
  windowAt('rfWindow', RF, 10, 8, 'glass');

  const eye = group(top, { part: 'eyepiece', p: [VF[0], VF[1], Z_BACK] });
  add(eye, geo.tube(4.4, 6.2, 0, 1.8), 'chrome', { r: [0, Math.PI, 0] });
  add(eye, geo.disc(4.4, 0.4, 0.9), 'glass', { r: [0, Math.PI, 0] });
  anchor(eye, 'eyepiece', [0, 0, 2]);
}

function buildDial(kit, parent) {
  const { add, geo, group, anchor, T } = kit;
  const dial = group(parent, { part: 'speedDial', action: 'speed', p: [DIAL[0], Y_TOP, DIAL[1]] });
  const face = faceTexture(T, 256);
  add(dial, geo.post(10, 4.6, 26), 'chrome', { p: [0, 2.3, 0], edges: 6 });
  const top = new T.CircleGeometry(9.7, 48);
  top.rotateX(-Math.PI / 2);
  add(dial, top, 'paper', { p: [0, 4.62, 0], material: face.material, edges: false });
  add(parent, geo.box(0.7, 0.3, 2.6), 'dark', { p: [DIAL[0], Y_TOP + 0.15, DIAL[1] - 11.8], edges: false });
  anchor(dial, 'speedDial', [0, 5, 0]);
  return { dial, face };
}

function buildLever(kit, parent) {
  const { add, geo, group, anchor, T } = kit;
  const root = group(parent, { part: 'lever', action: 'advance', p: [LEVER[0], Y_TOP, LEVER[1]] });
  add(root, geo.post(6.4, 3, 32), 'chrome', { p: [0, 1.5, 0] });
  const counter = faceTexture(T, 128);
  const face = new T.CircleGeometry(4.4, 32);
  face.rotateX(-Math.PI / 2);
  add(root, face, 'paper', { p: [0, 4.35, 0], material: counter.material, edges: false });
  add(root, geo.tube(4.4, 5.4, 0, 1.2), 'chrome', { p: [0, 3.2, 0], r: [Math.PI / 2, 0, 0] });

  // The arm turns with the stroke; `rest` angles it behind the speed dial.
  const arm = group(root, {});
  const rest = group(arm, { r: [0, LEVER_REST, 0] });
  const s = new T.Shape();
  s.moveTo(0, -3.4);
  s.quadraticCurveTo(-14, -2.4, -27, 1.2);
  s.lineTo(-27.6, 4.6);
  s.quadraticCurveTo(-14, 3.8, 0, 3.4);
  s.absarc(0, 0, 3.4, Math.PI / 2, -Math.PI / 2, true);
  const blade = new T.ExtrudeGeometry(s, { depth: 1.5, bevelEnabled: false, curveSegments: 10 });
  blade.rotateX(Math.PI / 2);
  add(rest, blade, 'chrome', { p: [0, 3.0, 0] });
  add(rest, geo.box(5, 3.6, 5), 'red', { p: [-28, 2.6, 2.9], r: [0, 0.25, 0] });
  anchor(rest, 'lever', [-28, 4.6, 3]);
  return { root, arm, counter };
}

function buildControls(kit, root) {
  const { add, geo, group, anchor } = kit;
  const rewind = group(root, { part: 'rewindKnob', action: 'rewind', p: [REWIND[0], Y_TOP, REWIND[1]] });
  add(rewind, geo.post(9.4, 2.2, 40), 'chrome', { p: [0, 1.1, 0] });
  const knob = group(rewind, {});
  add(knob, geo.post(8.4, 6.6, 28), 'chrome', { p: [0, 5.5, 0], edges: 6 });
  add(knob, geo.box(10, 1.2, 2.2), 'chrome', { p: [0, 9.2, 0] });
  anchor(rewind, 'rewindKnob', [0, 9.6, 0]);

  const shoe = group(root, { part: 'shoe', p: [SHOE[0], Y_TOP, SHOE[1]] });
  add(shoe, geo.box(19, 1.2, 17), 'chrome', { p: [0, 0.6, 0] });
  for (const z of [-7.4, 7.4]) {
    add(shoe, geo.box(19, 1.6, 2.2), 'chrome', { p: [0, 2, z] });
    add(shoe, geo.box(19, 0.6, 3.6), 'chrome', { p: [0, 3.1, z * 0.92] });
  }
  anchor(shoe, 'shoe', [0, 3.4, 0]);

  const release = group(root, { part: 'release', action: 'shoot', p: [RELEASE[0], Y_TOP, RELEASE[1]] });
  add(release, geo.post(4.4, 2.6, 36), 'chrome', { p: [0, 1.3, 0] });
  const button = group(release, {});
  add(button, geo.post(2.6, 2.4, 28), 'yellow', { p: [0, 3.6, 0] });
  anchor(release, 'release', [0, 5, 0]);

  return { rewindKnob: knob, button, ...buildDial(kit, root), lever: buildLever(kit, root) };
}

export function buildBody(kit, root) {
  const { add, geo, group, anchor, T } = kit;
  const body = group(root, { part: 'body' });
  add(body, geo.stadium(W, D, R_END, Y_BASE, Y_SEAM), 'ink');
  const mount = group(body, { part: 'mount', p: [AXIS[0], AXIS[1], Z_FRONT] });
  add(mount, geo.tube(21.8, 24.8, 0, 1.0), 'chrome');
  add(mount, geo.disc(21.8, 0.05, 0.25), 'dark', { edges: false });
  anchor(mount, 'mount', [0, 23, -1]);
  add(body, geo.post(2.4, 3, 20), 'chrome', { p: [-27.5, 4, Z_FRONT - 1.2], r: [Math.PI / 2, 0, 0] });
  const timer = group(body, { p: [31, -19, Z_FRONT - 0.8] });
  add(timer, geo.post(2.6, 1.6, 20), 'chrome', { r: [Math.PI / 2, 0, 0] });
  add(timer, geo.box(3.2, 11, 1.4), 'chrome', { p: [3.2, -4, -0.9], r: [0, 0, 0.55] });
  anchor(body, 'body', [-52, -14, Z_FRONT - 0.5]);

  const top = group(root, { part: 'topPlate' });
  add(top, geo.stadium(W, D, R_END, Y_SEAM, Y_TOP, 1.4), 'paper');
  for (const x of [-W / 2 - 1.4, W / 2 + 1.4]) {
    add(top, new T.TorusGeometry(2.4, 0.75, 8, 20), 'chrome', { p: [x, 25, 0], r: [0, Math.PI / 2, 0] });
  }
  anchor(top, 'topPlate', [-62, Y_TOP - 1, -6]);
  buildWindows(kit, top);
  const controls = group(root, {});
  const parts = buildControls(kit, controls);

  const bottom = group(root, { part: 'bottomPlate' });
  add(bottom, geo.stadium(W, D, R_END, Y_BOTTOM, Y_BASE, 1), 'paper');
  const key = group(bottom, { p: [-46, Y_BOTTOM, 0] });
  add(key, geo.post(5.6, 1.2, 32), 'chrome', { p: [0, -0.6, 0] });
  add(key, geo.box(10, 0.9, 2.6), 'chrome', { p: [0, -1.6, 0] });
  anchor(bottom, 'bottomPlate', [20, Y_BOTTOM - 0.5, -8]);

  const door = group(root, { part: 'backDoor' });
  add(door, geo.plate(104, 45, 1.0), 'ink', { p: [0, -9, Z_BACK + 0.5] });
  anchor(door, 'backDoor', [30, -20, Z_BACK + 1]);
  const pressure = group(door, { part: 'pressurePlate' });
  add(pressure, geo.plate(46, 29, 0.8), 'mech', { p: [AXIS[0], AXIS[1], FILM_Z + 1.4] });
  anchor(pressure, 'pressurePlate', [16, 9, FILM_Z + 1.8]);

  function drawDial(ink, paper) {
    const { canvas, texture } = parts.face;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = paper; ctx.fillRect(0, 0, 256, 256);
    ctx.strokeStyle = ink; ctx.lineWidth = 3;
    ctx.beginPath(); ctx.arc(128, 128, 120, 0, Math.PI * 2); ctx.stroke();
    ctx.fillStyle = ink; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    SPEEDS.forEach((t, i) => {
      ctx.save();
      ctx.translate(128, 128);
      ctx.rotate(-i * DIAL_STEP);
      const label = t >= 1 ? '1' : String(Math.round(1 / t));
      ctx.font = `600 ${[0, 32, 30, 23, 17][label.length]}px ui-monospace, monospace`;
      ctx.fillText(label, 0, -90);
      ctx.restore();
    });
    ctx.beginPath(); ctx.arc(128, 128, 26, 0, Math.PI * 2); ctx.stroke();
    texture.needsUpdate = true;
  }
  function drawCounter(ink, paper, frame) {
    const { canvas, texture } = parts.lever.counter;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = paper; ctx.fillRect(0, 0, 128, 128);
    ctx.fillStyle = ink; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.font = '700 58px ui-monospace, monospace';
    ctx.fillText(frame === null ? 'S' : String(frame), 64, 68);
    texture.needsUpdate = true;
  }

  return {
    groups: { body, top, controls, bottom, door },
    lever: parts.lever.arm,
    button: parts.button,
    dial: parts.dial,
    rewindKnob: parts.rewindKnob,
    setSpeed(index) { parts.dial.rotation.y = -index * DIAL_STEP; },
    drawFaces(ink, paper, frame) { drawDial(ink, paper); drawCounter(ink, paper, frame); },
    drawCounter,
  };
}
