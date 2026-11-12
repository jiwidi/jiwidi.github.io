// A small painted scene at known distances. The viewfinder draws it sharp
// with the rangefinder ghost. print.js exposes it through the lens.
import { rangefinderShift } from './optics.js';

export const SUBJECT = 2400;
export const FRAME_W = 300;        // virtual frame units, 3:2 like 36 × 24
export const FRAME_H = 200;
/* Two gulls, ~1 m wingspan, 14 m away, flying at 8 m/s:
   8000 × 50 / 14000 ≈ 28 mm/s across the film. */
export const GULL_FILM_SPEED = 28;
const GULL_UNITS_PER_S = (GULL_FILM_SPEED * FRAME_W) / 36;   // ≈ 233 frame units per second
const GULL_LOOP = 4.4;             // s: one pass across the finder, then a pause
const GULL_ENTRY = 210;            // frame units right of the drawn position at the start of a pass
/* A scene time with the gulls in the middle of the frame, for still views. */
export const STILL_TIME = GULL_ENTRY / GULL_UNITS_PER_S;
const VF_PAD_X = 46;               // the finder shows more than the 50 mm frame
const VF_PAD_Y = 31;
const PATCH = { x: 123, y: 82, w: 54, h: 36 };
const SHIFT_SCALE = 1050;          // ghost units per (mm · mm⁻¹) of base parallax
const SHIFT_LIMIT = 82;

function blob(ctx, points) {
  ctx.beginPath();
  points.forEach(([x, y], i) => (i ? ctx.lineTo(x, y) : ctx.moveTo(x, y)));
  ctx.closePath();
  ctx.fill();
}

function disc(ctx, x, y, r) {
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.fill();
}

export const LAYERS = [
  { d: Infinity, draw(ctx) {
    const sky = ctx.createLinearGradient(0, -40, 0, 150);
    sky.addColorStop(0, '#a9c6d6');
    sky.addColorStop(1, '#e9efe6');
    ctx.fillStyle = sky;
    ctx.fillRect(-80, -60, 460, 320);
    ctx.fillStyle = 'rgba(255,255,255,.75)';
    [[40, 30, 15], [58, 26, 19], [78, 32, 13], [250, 18, 12], [266, 14, 16], [283, 20, 11]].forEach(([x, y, r]) => disc(ctx, x, y, r));
    ctx.fillStyle = '#fbf6df';
    disc(ctx, 312, 38, 10);
  } },
  { d: 2e6, draw(ctx) {
    ctx.fillStyle = '#9db1a6';
    blob(ctx, [[-80, 120], [-20, 96], [40, 108], [110, 84], [170, 100], [240, 80], [300, 96], [380, 88], [380, 260], [-80, 260]]);
  } },
  { d: 15000, draw(ctx) {
    ctx.fillStyle = '#58775f';
    [[-30, 118, 22], [2, 112, 18], [30, 120, 16], [205, 116, 14], [330, 114, 24], [360, 122, 18]].forEach(([x, y, r]) => disc(ctx, x, y, r));
    ctx.fillRect(-80, 118, 460, 20);
    ctx.fillStyle = '#e9e2d0';
    ctx.fillRect(250, 104, 46, 28);
    ctx.fillStyle = '#8c4a3c';
    blob(ctx, [[246, 106], [273, 88], [300, 106]]);
    ctx.fillStyle = '#3e4f45';
    ctx.fillRect(266, 116, 9, 16);
  } },
  { d: 14000, motion: [-GULL_FILM_SPEED, 3], draw(ctx, t = STILL_TIME) {
    const pass = t % GULL_LOOP;
    const dx = GULL_ENTRY - pass * GULL_UNITS_PER_S;
    const dy = pass * GULL_UNITS_PER_S * (3 / GULL_FILM_SPEED);
    ctx.strokeStyle = ctx.fillStyle = '#46534e';
    ctx.lineWidth = 2.4;
    ctx.lineCap = ctx.lineJoin = 'round';
    for (const [x0, y0, s, phase] of [[186, 46, 1, 0], [210, 30, 0.8, 1.3]]) {
      const x = x0 + dx, y = y0 + dy - GULL_ENTRY * 3 / GULL_FILM_SPEED;
      const flap = Math.sin(t * Math.PI * 2 * 2.3 + phase) * 4 * s;
      ctx.beginPath();
      ctx.moveTo(x - 14 * s, y - s + flap);
      ctx.quadraticCurveTo(x - 7 * s, y - 9 * s + flap * 0.4, x, y);
      ctx.quadraticCurveTo(x + 7 * s, y - 9 * s + flap * 0.4, x + 14 * s, y - s + flap);
      ctx.stroke();
      ctx.beginPath();
      ctx.ellipse(x, y + 0.6 * s, 3.4 * s, 1.8 * s, 0, 0, Math.PI * 2);
      ctx.fill();
    }
  } },
  { d: 7000, draw(ctx) {
    const field = ctx.createLinearGradient(0, 130, 0, 260);
    field.addColorStop(0, '#93a86d');
    field.addColorStop(1, '#6f8a4c');
    ctx.fillStyle = field;
    ctx.fillRect(-80, 132, 460, 140);
    ctx.fillStyle = '#d9cdb0';
    blob(ctx, [[150, 132], [168, 132], [250, 260], [90, 260]]);
  } },
  { d: 5200, draw(ctx) {
    ctx.fillStyle = '#26332c';
    ctx.fillRect(229, 34, 4, 112);
    ctx.fillRect(222, 30, 18, 7);
    ctx.fillStyle = '#f2e7b8';
    ctx.fillRect(225, 37, 12, 5);
  } },
  { d: SUBJECT, draw(ctx) {
    ctx.save();
    ctx.translate(8, 28);
    ctx.fillStyle = '#2d3640';
    blob(ctx, [[86, 250], [92, 150], [104, 116], [128, 104], [156, 104], [180, 116], [192, 150], [198, 250]]);
    ctx.fillStyle = '#b4473b';
    blob(ctx, [[118, 102], [166, 102], [160, 118], [146, 124], [150, 160], [138, 160], [134, 122], [124, 118]]);
    ctx.fillStyle = '#e0b496';
    ctx.fillRect(134, 86, 16, 20);
    disc(ctx, 142, 70, 19);
    ctx.fillStyle = '#2b211b';
    blob(ctx, [[122, 70], [124, 52], [140, 46], [158, 52], [163, 70], [158, 60], [140, 56], [126, 62]]);
    ctx.fillStyle = 'rgba(0,0,0,.22)';
    disc(ctx, 135, 72, 1.6);
    disc(ctx, 149, 72, 1.6);
    ctx.restore();
  } },
  { d: 1100, draw(ctx) {
    ctx.strokeStyle = '#47612f';
    ctx.lineWidth = 2.4;
    ctx.lineCap = 'round';
    for (let i = 0; i < 16; i++) {
      const x = 236 + i * 8 + (i % 3) * 3;
      ctx.beginPath();
      ctx.moveTo(x, 250);
      ctx.quadraticCurveTo(x - 6 + (i % 4) * 3, 214, x - 14 + (i % 5) * 6, 172 + (i % 4) * 9);
      ctx.stroke();
    }
    ctx.fillStyle = '#f1e4a4';
    [[262, 178], [300, 186], [334, 176]].forEach(([x, y]) => disc(ctx, x, y, 4.2));
  } },
];

/* Draw the viewfinder: the scene sharp (a rangefinder never looks through
   the lens), the 50 mm bright-line frame and the double-image patch. */
export function drawViewfinder(canvas, focus, time = STILL_TIME) {
  const ctx = canvas.getContext('2d');
  const w = canvas.width, h = canvas.height;
  const sx = w / (FRAME_W + VF_PAD_X * 2), sy = h / (FRAME_H + VF_PAD_Y * 2);
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.clearRect(0, 0, w, h);
  ctx.setTransform(sx, 0, 0, sy, VF_PAD_X * sx, VF_PAD_Y * sy);
  LAYERS.forEach((layer) => layer.draw(ctx, time));

  ctx.save();
  ctx.beginPath();
  ctx.rect(PATCH.x, PATCH.y, PATCH.w, PATCH.h);
  ctx.clip();
  ctx.fillStyle = 'rgba(255, 226, 140, .16)';
  ctx.fillRect(PATCH.x, PATCH.y, PATCH.w, PATCH.h);
  ctx.globalAlpha = 0.52;
  for (const layer of LAYERS) {
    const shift = Math.max(-SHIFT_LIMIT, Math.min(SHIFT_LIMIT, rangefinderShift(layer.d, focus) * SHIFT_SCALE));
    ctx.save();
    ctx.translate(shift, 0);
    layer.draw(ctx, time);
    ctx.restore();
  }
  ctx.restore();
  ctx.strokeStyle = 'rgba(255, 244, 205, .9)';
  ctx.lineWidth = 0.9;
  ctx.strokeRect(PATCH.x, PATCH.y, PATCH.w, PATCH.h);

  // Bright-line frame for the 50 mm lens, drawn as a glowing outline.
  ctx.strokeStyle = 'rgba(255, 255, 240, .95)';
  ctx.lineWidth = 1.6;
  ctx.strokeRect(4, 3, FRAME_W - 8, FRAME_H - 6);
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  const vignette = ctx.createRadialGradient(w / 2, h / 2, h * 0.35, w / 2, h / 2, w * 0.62);
  vignette.addColorStop(0, 'rgba(0,0,0,0)');
  vignette.addColorStop(1, 'rgba(0,0,0,.55)');
  ctx.fillStyle = vignette;
  ctx.fillRect(0, 0, w, h);
}

export function isAligned(focus) {
  return Math.abs(rangefinderShift(SUBJECT, focus) * SHIFT_SCALE) < 3;
}
