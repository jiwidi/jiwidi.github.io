// Summicron-style 50 mm lens. Heights h run forward from the mount face;
// the lathe helper maps them onto −z.
import { AXIS, Z_FRONT } from './layout.js';

/* [semi-diameter, front radius, back radius, centre thickness, front vertex]
   A six-element double-Gauss sketch: proportions, not a prescription. */
const ELEMENTS = [
  [14, 36, 200, 4, 31.6],
  [12.5, 20, 45, 3.4, 26.6],
  [11, 60, 20, 1.5, 22.4],
  [10.5, -20, 0, 1.5, 12.8],
  [11.5, -60, -22, 3.6, 10],
  [12, 50, -40, 3.6, 5.4],
];
const IRIS_H = 16.2;
const BLADES = 10;
const BLADE_R = 13.6;
const BLADE_SPAN = (Math.PI / BLADES) * 1.55;

function bladeShape(T, open) {
  const s = new T.Shape();
  for (let i = 0; i <= 12; i++) {
    const a = -BLADE_SPAN + (2 * BLADE_SPAN * i) / 12;
    const p = [BLADE_R * Math.sin(a), BLADE_R * Math.cos(a)];
    i ? s.lineTo(...p) : s.moveTo(...p);
  }
  const r = Math.min(open, BLADE_R * Math.cos(BLADE_SPAN) - 0.05);
  s.lineTo(r * Math.tan(BLADE_SPAN), r);
  s.lineTo(-r * Math.tan(BLADE_SPAN), r);
  s.closePath();
  return new T.ShapeGeometry(s);
}

export function buildLens(kit, root) {
  const { add, geo, group, anchor, T } = kit;
  const lens = group(root, { part: 'lens', p: [AXIS[0], AXIS[1], Z_FRONT] });
  add(lens, geo.tube(19.8, 23, 0, 2.2), 'chrome');
  const unit = group(lens, {});
  add(unit, geo.tube(16, 17.6, -4.8, 2.2), 'chrome');

  const cam = group(unit, { part: 'focusCam' });
  add(cam, geo.tube(17.6, 19.4, -3.9, -1.6), 'brass');
  anchor(cam, 'focusCam', [-12, 14, 3]);

  const focusRing = group(unit, { part: 'focusRing' });
  add(focusRing, geo.tube(21, 23.6, 2.2, 11, 36), 'chrome', { edges: 6 });
  add(focusRing, geo.box(4.6, 4.2, 4.4), 'chrome', { p: [0, -25.2, -6.6] });
  anchor(focusRing, 'focusRing', [0, -25, -6.6]);
  add(unit, geo.tube(20.6, 22, 11, 13), 'chrome');
  add(unit, geo.box(0.7, 0.5, 1.6), 'dark', { p: [0, 22.1, -12], edges: false });

  const apertureRing = group(unit, { part: 'apertureRing', action: 'aperture' });
  add(apertureRing, geo.tube(20.6, 22.6, 13, 19.5, 40), 'chrome', { edges: 6 });
  anchor(apertureRing, 'apertureRing', [16, 16, -16]);
  add(unit, geo.tube(19, 21, 19.5, 31), 'chrome');
  add(unit, geo.tube(15.2, 20.4, 31, 32.4), 'dark');

  const optics = group(unit, { part: 'elements' });
  const elements = ELEMENTS.map(([a, r1, r2, t, h]) => {
    const g = group(optics, {});
    add(g, geo.element(a, r1, r2, t, h), 'glass', { edges: 24 });
    return g;
  });
  anchor(elements[1], 'elements', [0, 12, -25]);

  const iris = group(unit, { part: 'iris', p: [0, 0, -IRIS_H] });
  const blades = Array.from({ length: BLADES }, (_, i) => add(iris, bladeShape(T, 6), 'mech', {
    p: [0, 0, i * 0.035], r: [0, 0, (i / BLADES) * Math.PI * 2 + 0.3],
  }));
  add(iris, geo.tube(13.6, 15.2, -0.4, 0.8), 'mech');
  anchor(iris, 'iris', [0, -9, 0]);

  function setAperture(n, index) {
    const open = 23.4 / n;
    for (const blade of blades) {
      blade.geometry.dispose();
      blade.geometry = bladeShape(T, open);
      blade.userData.edges.geometry.dispose();
      blade.userData.edges.geometry = new T.EdgesGeometry(blade.geometry);
    }
    apertureRing.rotation.z = index * 0.24;
  }

  function setFocus(extension, slider) {
    unit.position.z = -extension;
    focusRing.rotation.z = (1 - slider) * 1.9;
  }

  /* Elements fan forward out of the barrel, front glass furthest. */
  function explode(t) {
    elements.forEach((g, i) => { g.position.z = -t * (24 + (ELEMENTS.length - 1 - i) * 8); });
    iris.position.z = -IRIS_H - t * 45;
  }

  return { group: lens, unit, setAperture, setFocus, explode };
}
