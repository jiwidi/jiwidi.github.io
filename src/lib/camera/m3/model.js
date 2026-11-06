// Assembles the M3 from its parts and exposes one control surface:
// focus, aperture, speed, transport, shutter, X-ray and explode.
import { APERTURES, distanceAt, extension } from '../optics.js';
import { buildBody } from './body.js';
import { createKit } from './kit.js';
import { buildLens } from './lens.js';
import { buildMechanism } from './mechanism.js';

export function createM3(T) {
  const kit = createKit(T);
  const root = new T.Group();
  const body = buildBody(kit, root);
  const lens = buildLens(kit, root);
  const mech = buildMechanism(kit, root);

  // One translation per group, from its assembled place (exploded-views.md).
  const explodeVectors = [
    [body.groups.top, [0, 34, 0]],
    [body.groups.controls, [0, 54, 0]],
    [mech.groups.optics, [0, 17, 0]],
    [body.groups.bottom, [0, -30, 0]],
    [body.groups.door, [0, 0, 46]],
    [lens.group, [0, 0, -48]],
    [mech.groups.cassette, [-34, 0, 4]],
    [mech.groups.takeup, [34, 0, 4]],
    [mech.groups.film, [0, 0, 26]],
    [mech.groups.gate, [0, 0, 13]],
    [mech.groups.sprocket, [12, 0, 12]],
    [mech.groups.gears, [0, 9, 4]],
  ].map(([group, v]) => ({ group, base: group.position.clone(), v: new T.Vector3(...v) }));

  const anchors = [];
  root.traverse((o) => { if (o.userData.anchor) anchors.push(o); });
  let colors = null;
  let counter = 0;

  return {
    root,
    anchors,
    kit,
    setFocus(slider) {
      const d = distanceAt(slider);
      const ext = extension(d);
      lens.setFocus(ext, slider);
      mech.setFocus(d, ext);
    },
    setAperture(index) { lens.setAperture(APERTURES[index], index); },
    setSpeed: body.setSpeed,
    setLever(angle) { body.lever.rotation.y = angle; },
    setRelease(depth) { body.button.position.y = -depth; },
    setRewind(angle) { body.rewindKnob.rotation.y = angle; },
    setFilm: mech.setFilm,
    setCurtains: mech.setCurtains,
    setExposureRays(on) { mech.setExposureRays(on, kit.state.xray); },
    setCounter(frame) {
      counter = frame;
      if (colors) body.drawCounter(colors.inkHex, colors.paperHex, frame);
    },
    setXray: kit.setXray,
    setHighlight: kit.setHighlight,
    partOf: kit.partOf,
    actionOf(object) {
      for (let o = object; o; o = o.parent) if (o.userData.action) return o.userData.action;
      return null;
    },
    explode(t) {
      for (const { group, base, v } of explodeVectors) group.position.copy(base).addScaledVector(v, t);
      lens.explode(t);
    },
    theme(next) {
      colors = { ...next, inkHex: `#${next.ink.getHexString()}`, paperHex: `#${next.paper.getHexString()}` };
      kit.theme(next);
      body.drawFaces(colors.inkHex, colors.paperHex, counter);
      kit.paint();
    },
    dispose() { mech.dispose(); kit.dispose(); },
  };
}
