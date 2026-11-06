// Callout lanes: labels sit along the stage edges, sorted by height, with
// a leader back to the projected anchor of their part.
const CHAR_PX = 5.9;
const ROW_PX = 17;
const EDGE_PX = 8;

export function placeLabels(points, width, height) {
  const lanes = { left: [], right: [] };
  points.forEach((p) => lanes[p.x < width / 2 ? 'left' : 'right'].push(p));
  const placed = [];
  for (const [side, list] of Object.entries(lanes)) {
    list.sort((a, b) => a.y - b.y);
    const ys = [];
    list.forEach((p, i) => { ys[i] = Math.max(p.y, i ? ys[i - 1] + ROW_PX : 14); });
    for (let i = list.length - 1; i >= 0; i--) {
      ys[i] = Math.min(ys[i], i < list.length - 1 ? ys[i + 1] - ROW_PX : height - 14);
    }
    list.forEach((p, i) => {
      const text = p.name.length * CHAR_PX;
      const edge = side === 'left' ? EDGE_PX + text + 5 : width - EDGE_PX - text - 5;
      const elbow = side === 'left' ? edge + 12 : edge - 12;
      placed.push({
        id: p.id, name: p.name, side, y: ys[i], ax: p.x, ay: p.y,
        path: `M${p.x.toFixed(1)} ${p.y.toFixed(1)}L${elbow.toFixed(1)} ${ys[i].toFixed(1)}H${edge.toFixed(1)}`,
      });
    });
  }
  return placed;
}
