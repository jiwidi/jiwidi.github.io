// Materials and geometry helpers shared by the M3 body and mechanism.
// Every mesh carries a material role, so one switch repaints the whole
// camera as an illustration or as an X-ray.

const XRAY_VERTEX = `
varying vec3 vNormal; varying vec3 vView;
void main() {
  vec4 mv = modelViewMatrix * vec4(position, 1.0);
  vNormal = normalize(normalMatrix * normal);
  vView = normalize(-mv.xyz);
  gl_Position = projectionMatrix * mv;
}`;
const XRAY_FRAGMENT = `
uniform vec3 color; uniform float base; uniform float rim;
varying vec3 vNormal; varying vec3 vView;
void main() {
  float edge = pow(1.0 - abs(dot(normalize(vNormal), normalize(vView))), 2.2);
  gl_FragColor = vec4(color * (base + rim * edge), 1.0);
}`;

/* X-ray colors are fixed: the stage turns into a dark radiograph in both
   site themes. Glass and mirrors get their own hues so the optics read. */
const XRAY = {
  paper: ['#8fdcc6', 0.012, 0.2], chrome: ['#8fdcc6', 0.015, 0.24], ink: ['#8fdcc6', 0.01, 0.18],
  dark: ['#8fdcc6', 0.03, 0.3], mech: ['#d9f3ea', 0.1, 0.75], brass: ['#ffcf7d', 0.1, 0.7],
  glass: ['#3fd0ff', 0.2, 1.0], frosted: ['#b9e6ff', 0.14, 0.7], mirror: ['#f4f8ff', 0.42, 0.9],
  curtain: ['#ff8a76', 0.16, 0.55], roll: ['#ffb347', 0.2, 0.75], red: ['#ff6b6b', 0.14, 0.7], yellow: ['#ffe36b', 0.16, 0.7],
};
const GHOSTS = new Set(['paper', 'chrome', 'ink', 'dark']);
/* Curtains stay opaque in X-ray: they hide the film until the slit passes. */
const SOLID = { curtain: ['#7a2a25', 0.9] };

export function createKit(T) {
  // Add light without touching canvas alpha, so the CSS radiograph shows through.
  const additive = (src = T.OneFactor) => ({
    blending: T.CustomBlending, blendEquation: T.AddEquation, blendSrc: src, blendDst: T.OneFactor,
    blendSrcAlpha: T.ZeroFactor, blendDstAlpha: T.OneFactor, transparent: true, depthWrite: false,
  });
  const normal = {}, xray = {}, lineNormal = {}, lineXray = {};
  const pebbles = document.createElement('canvas');
  pebbles.width = pebbles.height = 128;
  const pebbleMap = new T.CanvasTexture(pebbles);
  pebbleMap.wrapS = pebbleMap.wrapT = T.RepeatWrapping;
  pebbleMap.colorSpace = T.SRGBColorSpace;
  pebbleMap.repeat.set(1 / 9, 1 / 9);

  for (const role of Object.keys(XRAY)) {
    normal[role] = new T.MeshLambertMaterial({ side: T.DoubleSide });
    const [color, base, rim] = XRAY[role];
    xray[role] = SOLID[role]
      ? new T.MeshBasicMaterial({ color: SOLID[role][0], transparent: true, opacity: SOLID[role][1], side: T.DoubleSide })
      : new T.ShaderMaterial({
        uniforms: { color: { value: new T.Color(color) }, base: { value: base }, rim: { value: rim } },
        vertexShader: XRAY_VERTEX, fragmentShader: XRAY_FRAGMENT, side: T.DoubleSide, ...additive(),
      });
    lineNormal[role] = new T.LineBasicMaterial({ transparent: true, opacity: 0.55 });
    lineXray[role] = new T.LineBasicMaterial({ color, opacity: GHOSTS.has(role) ? 0.16 : 0.42, ...additive(T.SrcAlphaFactor) });
  }
  normal.ink.map = pebbleMap;
  Object.assign(normal.glass, { transparent: true, opacity: 0.5, depthWrite: false });
  Object.assign(normal.frosted, { transparent: true, opacity: 0.85 });
  const highlightNormal = new T.MeshLambertMaterial({ side: T.DoubleSide });
  const highlightXray = new T.ShaderMaterial({
    uniforms: { color: { value: new T.Color('#ffe14a') }, base: { value: 0.28 }, rim: { value: 1.1 } },
    vertexShader: XRAY_VERTEX, fragmentShader: XRAY_FRAGMENT, side: T.DoubleSide, ...additive(),
  });
  const ray = new T.LineDashedMaterial({ color: '#ffe14a', dashSize: 2.2, gapSize: 1.6, transparent: true, opacity: 0.95 });
  const glow = new T.MeshBasicMaterial({ color: '#ffe14a', opacity: 0.7, side: T.DoubleSide, ...additive(T.SrcAlphaFactor) });

  const meshes = [];
  const xrayOnly = [];
  const state = { xray: false, highlight: null };

  const partOf = (object) => {
    for (let o = object; o; o = o.parent) if (o.userData.part) return o.userData.part;
    return null;
  };

  function group(parent, options = {}) {
    const g = new T.Group();
    if (options.p) g.position.set(...options.p);
    if (options.r) g.rotation.set(...options.r);
    Object.assign(g.userData, { part: options.part, action: options.action });
    parent.add(g);
    return g;
  }

  function add(parent, geometry, role, options = {}) {
    const mesh = new T.Mesh(geometry, normal[role]);
    if (options.p) mesh.position.set(...options.p);
    if (options.r) mesh.rotation.set(...options.r);
    Object.assign(mesh.userData, { role, part: options.part, action: options.action, shell: GHOSTS.has(role), custom: options.material, keep: options.keep });
    if (options.edges !== false) {
      const edges = new T.LineSegments(new T.EdgesGeometry(geometry, options.edges ?? 32), lineNormal[role]);
      edges.raycast = () => {};
      mesh.add(edges);
      mesh.userData.edges = edges;
    }
    parent.add(mesh);
    meshes.push(mesh);
    return mesh;
  }

  function line(parent, points, material = ray) {
    const item = new T.Line(new T.BufferGeometry().setFromPoints(points.map((p) => new T.Vector3(...p))), material);
    item.computeLineDistances();
    item.raycast = () => {};
    parent.add(item);
    return item;
  }

  function rays(parent, points) {
    const item = line(parent, points);
    item.visible = false;
    xrayOnly.push(item);
    return item;
  }

  function paint() {
    for (const mesh of meshes) {
      const { role, edges } = mesh.userData;
      mesh.userData.partId ??= partOf(mesh);
      const lit = state.highlight && mesh.userData.partId === state.highlight;
      mesh.material = mesh.userData.keep ? mesh.userData.custom : lit ? (state.xray ? highlightXray : highlightNormal) : state.xray ? xray[role] : mesh.userData.custom ?? normal[role];
      if (edges) edges.material = (state.xray ? lineXray : lineNormal)[role];
    }
    xrayOnly.forEach((item) => { item.visible = state.xray && !item.userData.hidden; });
  }

  function setXray(on) { state.xray = on; paint(); }
  function setHighlight(part) {
    if (state.highlight === part) return false;
    state.highlight = part;
    paint();
    return true;
  }

  /* Light theme: chrome plates in paper, leatherette in ink. Dark theme:
     the site inverts ink and paper, so keep the body dark and the lines lit. */
  function theme({ ink, paper, accent, red, yellow }) {
    const mix = (a, b, t) => a.clone().lerp(b, t);
    const lum = (c) => 0.3 * c.r + 0.59 * c.g + 0.11 * c.b;
    const light = lum(paper) > lum(ink);
    const black = new T.Color(0, 0, 0);
    normal.paper.color.copy(mix(paper, ink, light ? 0.03 : 0.16));
    normal.chrome.color.copy(mix(paper, ink, light ? 0.12 : 0.26));
    normal.ink.color.set('#ffffff');
    normal.dark.color.copy(light ? mix(ink, paper, 0.12) : mix(paper, black, 0.55));
    normal.mech.color.copy(mix(paper, ink, 0.3));
    normal.brass.color.set('#c9a45a');
    normal.glass.color.set('#5cc6e6');
    normal.frosted.color.set('#e6f3f6');
    normal.mirror.color.set('#d5e0ea');
    normal.curtain.color.copy(light ? mix(ink, paper, 0.25) : mix(paper, black, 0.3));
    normal.roll.color.set('#b98a4e');
    normal.red.color.copy(red);
    normal.yellow.color.copy(yellow);
    highlightNormal.color.copy(mix(accent, paper, 0.35));
    for (const role of Object.keys(lineNormal)) {
      lineNormal[role].color.copy(role === 'ink' || role === 'dark' ? mix(ink, paper, light ? 0.55 : 0.35) : ink);
    }
    // Leatherette with a light pebble grain.
    const ctx = pebbles.getContext('2d');
    ctx.fillStyle = `#${(light ? ink : mix(paper, black, 0.45)).getHexString()}`;
    ctx.fillRect(0, 0, 128, 128);
    ctx.fillStyle = `#${(light ? paper : ink).getHexString()}`;
    ctx.globalAlpha = light ? 0.09 : 0.07;
    for (let i = 0; i < 190; i++) {
      ctx.beginPath();
      ctx.arc((i * 73) % 128, (i * 151 + (i % 7) * 13) % 128, 1.6 + (i % 3) * 0.7, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalAlpha = 1;
    pebbleMap.needsUpdate = true;
  }

  /* Geometry. World axes: +x photographer's right, +y up, −z toward the
     subject. Turned parts are built on the lens axis, with h measured
     forward from the mount face. */
  const v2 = (points) => points.map(([r, h]) => new T.Vector2(r, h));
  function lathe(profile, segments = 72) {
    const geometry = new T.LatheGeometry(v2(profile), segments);
    geometry.rotateX(-Math.PI / 2);
    return geometry;
  }
  const tube = (rIn, rOut, h0, h1, segments) => lathe([[rIn, h0], [rOut, h0], [rOut, h1], [rIn, h1], [rIn, h0]], segments);
  const disc = (r, h0, h1, segments) => lathe([[0, h0], [r, h0], [r, h1], [0, h1]], segments);
  const box = (w, h, d) => new T.BoxGeometry(w, h, d);
  const post = (r, h, segments = 40) => new T.CylinderGeometry(r, r, h, segments);
  function roundedRect(w, h, r) {
    const s = new T.Shape();
    s.moveTo(-w / 2 + r, -h / 2);
    s.lineTo(w / 2 - r, -h / 2);
    s.absarc(w / 2 - r, -h / 2 + r, r, -Math.PI / 2, 0, false);
    s.lineTo(w / 2, h / 2 - r);
    s.absarc(w / 2 - r, h / 2 - r, r, 0, Math.PI / 2, false);
    s.lineTo(-w / 2 + r, h / 2);
    s.absarc(-w / 2 + r, h / 2 - r, r, Math.PI / 2, Math.PI, false);
    s.lineTo(-w / 2, -h / 2 + r);
    s.absarc(-w / 2 + r, -h / 2 + r, r, Math.PI, Math.PI * 1.5, false);
    return s;
  }
  /* A rounded-end slab between two heights: the M3 body silhouette. */
  function stadium(w, d, r, y0, y1, bevel = 0) {
    const geometry = new T.ExtrudeGeometry(roundedRect(w - 2 * bevel, d - 2 * bevel, r - bevel), {
      depth: y1 - y0 - 2 * bevel, curveSegments: 14,
      bevelEnabled: bevel > 0, bevelSize: bevel, bevelThickness: bevel, bevelSegments: 3,
    });
    geometry.rotateX(-Math.PI / 2);
    geometry.translate(0, y0 + bevel, 0);
    return geometry;
  }
  /* A flat plate facing ±z with optional rectangular openings. */
  function plate(w, h, depth, holes = []) {
    const shape = roundedRect(w, h, Math.min(w, h) * 0.08);
    for (const [x, y, hw, hh] of holes) {
      const hole = new T.Path();
      hole.moveTo(x - hw / 2, y - hh / 2);
      hole.lineTo(x - hw / 2, y + hh / 2);
      hole.lineTo(x + hw / 2, y + hh / 2);
      hole.lineTo(x + hw / 2, y - hh / 2);
      hole.closePath();
      shape.holes.push(hole);
    }
    const geometry = new T.ExtrudeGeometry(shape, { depth, bevelEnabled: false, curveSegments: 6 });
    geometry.translate(0, 0, -depth / 2);
    return geometry;
  }
  /* A spur gear lying in the xz plane (axis along y). */
  function gear(radius, thickness) {
    const teeth = Math.max(10, Math.round(radius * 2.4));
    const shape = new T.Shape();
    for (let i = 0; i < teeth * 4; i++) {
      const a = (i / (teeth * 4)) * Math.PI * 2;
      const r = i % 4 < 2 ? radius : radius - 1.1;
      i ? shape.lineTo(Math.cos(a) * r, Math.sin(a) * r) : shape.moveTo(Math.cos(a) * r, Math.sin(a) * r);
    }
    const geometry = new T.ExtrudeGeometry(shape, { depth: thickness, bevelEnabled: false });
    geometry.rotateX(Math.PI / 2);
    geometry.translate(0, thickness / 2, 0);
    return geometry;
  }
  /* A lens element from its two surface radii (+ means centre of curvature
     behind the surface). `h` is the front vertex, measured forward. */
  function element(a, r1, r2, t, h) {
    const sag = (r, R) => (R ? R - Math.sign(R) * Math.sqrt(Math.max(0, R * R - r * r)) : 0);
    const steps = 10, back = [], front = [];
    for (let i = 0; i <= steps; i++) {
      const r = (a * i) / steps;
      back.push([r, h - t - sag(r, r2)]);
      front.push([r, h - sag(r, r1)]);
    }
    const edgeGap = front[steps][1] - back[steps][1];
    if (edgeGap < 0.4) front.forEach((p) => { p[1] += 0.4 - edgeGap; });
    return lathe([...back, ...front.reverse()], 64);
  }

  function anchor(parent, part, p) {
    const point = new T.Object3D();
    point.position.set(...p);
    point.userData.anchor = part;
    parent.add(point);
    return point;
  }

  function dispose() {
    pebbleMap.dispose();
    [...Object.values(xray), highlightXray, highlightNormal, ray, glow].forEach((m) => m.dispose());
  }

  return {
    T, add, group, line, rays, anchor, paint, setXray, setHighlight, theme, partOf, meshes, state, dispose,
    materials: { ray, glow, normal },
    geo: { lathe, tube, disc, box, post, stadium, plate, gear, element, roundedRect },
  };
}
