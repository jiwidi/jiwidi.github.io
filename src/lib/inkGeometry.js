/* Path builders for the ink plates.
   Angles are degrees, 0 = up (north), growing clockwise — the convention a
   compass rose and a gear both want. */

const r2 = (n) => Math.round(n * 100) / 100;

export function polar(cx, cy, radius, deg) {
  const a = ((deg - 90) * Math.PI) / 180;
  return [cx + Math.cos(a) * radius, cy + Math.sin(a) * radius];
}

export function circlePath(cx, cy, radius) {
  const d = r2(radius * 2);
  return `M${r2(cx - radius)} ${r2(cy)}a${r2(radius)} ${r2(radius)} 0 1 0 ${d} 0a${r2(radius)} ${r2(radius)} 0 1 0 ${-d} 0`;
}

export function arcPath(cx, cy, radius, fromDeg, toDeg) {
  const [x0, y0] = polar(cx, cy, radius, fromDeg);
  const [x1, y1] = polar(cx, cy, radius, toDeg);
  const large = Math.abs(toDeg - fromDeg) > 180 ? 1 : 0;
  const sweep = toDeg > fromDeg ? 1 : 0;
  return `M${r2(x0)} ${r2(y0)}A${r2(radius)} ${r2(radius)} 0 ${large} ${sweep} ${r2(x1)} ${r2(y1)}`;
}

/* Trapezoidal-tooth gear. `root` is the valley radius, `tip` the crest. */
export function gearPath(cx, cy, { teeth, root, tip }) {
  const step = 360 / teeth;
  const at = (radius, deg) => {
    const [x, y] = polar(cx, cy, radius, deg);
    return `${r2(x)} ${r2(y)}`;
  };
  const parts = [];
  for (let i = 0; i < teeth; i += 1) {
    const a = i * step;
    parts.push(
      `${i === 0 ? 'M' : 'L'}${at(root, a)}`,
      `L${at(tip, a + step * 0.16)}`,
      `L${at(tip, a + step * 0.44)}`,
      `L${at(root, a + step * 0.6)}`,
    );
  }
  return `${parts.join('')}Z`;
}

/* Archimedean spiral — mainsprings, hairsprings. */
export function spiralPath(cx, cy, { r0, r1, turns, steps = 160, fromDeg = 0 }) {
  const sweep = turns * 360;
  const parts = [];
  for (let i = 0; i <= steps; i += 1) {
    const t = i / steps;
    const [x, y] = polar(cx, cy, r0 + (r1 - r0) * t, fromDeg + sweep * t);
    parts.push(`${i === 0 ? 'M' : 'L'}${r2(x)} ${r2(y)}`);
  }
  return parts.join('');
}

/* Bezel graduations. Every `majorEvery`-th tick reaches `majorInner` instead. */
export function radialTicks(cx, cy, { count, inner, outer, majorEvery = 0, majorInner }) {
  const out = [];
  for (let i = 0; i < count; i += 1) {
    const deg = (360 / count) * i;
    const isMajor = majorEvery > 0 && i % majorEvery === 0;
    const [x0, y0] = polar(cx, cy, isMajor ? majorInner ?? inner : inner, deg);
    const [x1, y1] = polar(cx, cy, outer, deg);
    out.push(`M${r2(x0)} ${r2(y0)}L${r2(x1)} ${r2(y1)}`);
  }
  return out;
}

/* Open arrowhead centred on (x, y), pointing along `deg`. */
export function arrowHead(x, y, deg, size = 6) {
  const [ax, ay] = polar(x, y, size, deg + 148);
  const [bx, by] = polar(x, y, size, deg - 148);
  return `M${r2(ax)} ${r2(ay)}L${r2(x)} ${r2(y)}L${r2(bx)} ${r2(by)}`;
}

/* Architectural door: leaf swung to `leafDeg`, quarter arc closing to `shutDeg`. */
export function doorSwing(hx, hy, radius, leafDeg, shutDeg) {
  const [lx, ly] = polar(hx, hy, radius, leafDeg);
  const [sx, sy] = polar(hx, hy, radius, shutDeg);
  const sweep = ((shutDeg - leafDeg + 360) % 360) > 180 ? 0 : 1;
  return `M${r2(hx)} ${r2(hy)}L${r2(lx)} ${r2(ly)}A${radius} ${radius} 0 0 ${sweep} ${r2(sx)} ${r2(sy)}`;
}

/* Dimension line with end serifs, drawn horizontally at `y`. */
export function dimLine(x0, x1, y, serif = 4) {
  return `M${r2(x0)} ${r2(y - serif)}V${r2(y + serif)}M${r2(x0)} ${r2(y)}H${r2(x1)}M${r2(x1)} ${r2(y - serif)}V${r2(y + serif)}`;
}
