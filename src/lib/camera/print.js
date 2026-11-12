// Expose one frame of ISO 400 black-and-white film through the 50 mm lens,
// then make a contact print of it at a fixed printing time. Every effect
// comes from the camera settings:
// - aperture: defocus per layer (depth of field) and corner shading
// - shutter: subject motion and hand shake during the exposure
// - both: exposure in stops, through a film-like tone curve
// The same renderer draws the live preview (small) and the print (large).
import {
  COC, blurMm, depthOfField, motionMm, reciprocityStops, shakeMm,
} from './optics.js';
import { FRAME_W, GULL_FILM_SPEED, LAYERS, SUBJECT } from './sceneArt.js';

export const PRINT_W = 600;
const MAX_STEPS = 36;
const MID_GREY = 0.18;             // scene luminance that a correct exposure puts on mid-grey
const PAPER_MID = 0.144;           // linear print value that reads as mid-grey on screen
/* Light fall-off in the corners, in stops. Fast 50 mm lenses fall off
   hard wide open (a Noctilux at f/1 loses about two stops). */
const VIGNETTE = { 1: 2, 1.4: 1.6, 2: 1.3, 2.8: 0.8, 4: 0.45, 5.6: 0.25, 8: 0.15, 11: 0.12, 16: 0.1 };

/* Pixel geometry for one frame width. Work on a padded canvas so a
   shaken frame never shows empty borders. */
function frameSize(width) {
  const w = Math.round(width);
  const pad = Math.ceil(w / 37.5);
  return { w, h: Math.round((w * 2) / 3), pad, ww: w + 2 * pad, wh: Math.round((w * 2) / 3) + 2 * pad, pxPerMm: w / 36, unit: w / FRAME_W };
}

function canvas(w, h) {
  const c = document.createElement('canvas');
  c.width = w;
  c.height = h;
  return c;
}

/* WebKit accepts ctx.filter but ignores it, so test the pixels: a blurred
   dot must spread into its neighbours. */
let filterWorks;
function canFilter() {
  if (filterWorks === undefined) {
    const ctx = canvas(9, 9).getContext('2d', { willReadFrequently: true });
    ctx.filter = 'blur(2px)';
    ctx.fillRect(4, 4, 1, 1);
    filterWorks = ctx.getImageData(2, 4, 1, 1).data[3] > 0;
  }
  return filterWorks;
}

/* Draw one layer out of focus. A blur circle of diameter D looks like a
   Gaussian with σ ≈ D / 2.8. Without canvas filters, draw small and
   scale up instead. */
function drawLayer(ctx, layer, diameterPx, size, time) {
  const sigma = diameterPx / 2.8;
  const paint = (c, k) => { c.scale(k, k); c.translate(size.pad, size.pad); c.scale(size.unit, size.unit); layer.draw(c, time); };
  ctx.save();
  if (sigma < 0.35 || canFilter()) {
    if (sigma >= 0.35) ctx.filter = `blur(${sigma.toFixed(2)}px)`;
    paint(ctx, 1);
  } else {
    const k = 1 / (1 + sigma * 1.5);
    const small = canvas(Math.ceil(size.ww * k), Math.ceil(size.wh * k));
    paint(small.getContext('2d'), k);
    ctx.imageSmoothingQuality = 'high';
    ctx.drawImage(small, 0, 0, size.ww, size.wh);
  }
  ctx.restore();
}

/* Points along a movement of `length` px. Hand shake curves a little. */
function path(length, angle, curve) {
  const steps = Math.min(MAX_STEPS, Math.max(2, Math.ceil(length / 1.2)));
  const [ux, uy] = [Math.cos(angle), Math.sin(angle)];
  return Array.from({ length: steps }, (_, i) => {
    const s = i / (steps - 1) - 0.5;
    const bend = (s * s - 1 / 12) * length * curve;
    return [ux * s * length - uy * bend, uy * s * length + ux * bend];
  });
}

/* What the film records while the image moves: the time average of the
   frame at each position. `paint(ctx, x, y)` draws one instant. */
function average(target, points, paint, size) {
  const frame = canvas(size.ww, size.wh);
  const fctx = frame.getContext('2d');
  points.forEach(([x, y], i) => {
    fctx.clearRect(0, 0, size.ww, size.wh);
    paint(fctx, x, y);
    target.globalAlpha = 1 / (i + 1);
    target.drawImage(frame, 0, 0);
  });
  target.globalAlpha = 1;
}

/* The image that reaches the film: defocused layers, moving gulls, then
   hand shake over the whole frame. */
function optics({ focus, aperture, speed, seed, time }, size) {
  const scene = canvas(size.ww, size.wh);
  const ctx = scene.getContext('2d');
  for (const layer of LAYERS) {
    const diameter = Math.min(size.w / 15, blurMm(layer.d, focus, aperture) * size.pxPerMm);
    const travel = layer.motion ? motionMm(Math.hypot(...layer.motion), speed) * size.pxPerMm : 0;
    if (travel < 0.6) { drawLayer(ctx, layer, diameter, size, time); continue; }
    const before = canvas(size.ww, size.wh);
    before.getContext('2d').drawImage(scene, 0, 0);
    const moving = canvas(size.ww, size.wh);
    drawLayer(moving.getContext('2d'), layer, diameter, size, time);
    const points = path(Math.min(travel, size.w * 0.4), Math.atan2(layer.motion[1], layer.motion[0]), 0);
    average(ctx, points, (f, x, y) => { f.drawImage(before, 0, 0); f.drawImage(moving, x, y); }, size);
  }
  const shake = Math.min(2 * size.pad, shakeMm(speed) * size.pxPerMm);
  if (shake < 0.6) return scene;
  const steady = canvas(size.ww, size.wh);
  average(steady.getContext('2d'), path(shake, seed * 2.39996, 0.45), (f, x, y) => f.drawImage(scene, x, y), size);
  return steady;
}

const LINEAR = Array.from({ length: 256 }, (_, i) => {
  const v = i / 255;
  return v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4;
});
const toDisplay = (v) => (v <= 0.0031308 ? 12.92 * v : 1.055 * v ** (1 / 2.4) - 0.055);
/* Paper: a soft toe and a shoulder that rolls highlights off to paper
   white (ACES fit). */
const paperCurve = (x) => (x * (2.51 * x + 0.03)) / (x * (2.43 * x + 0.59) + 0.14);

/* Negative: Tri-X-like latitude. Density follows exposure from 3.2 stops
   under mid-grey to 6.5 stops over it. Below, shadows sink into the fog.
   Above, highlights block up. Input and output in stops from mid-grey. */
const TOE = -3.2;
const SHOULDER = 6.5;
const KNEE = 2.2;
const soft = (x) => Math.log2(1 + 2 ** (KNEE * x)) / KNEE;
export const filmStops = (stops) => TOE + soft(stops - TOE) - soft(stops - SHOULDER);

/* Printing: the lab sets print exposure from the negative and corrects
   most of an exposure error, up to three stops either way. */
export const labCorrection = (error) => Math.max(-3, Math.min(3, 0.75 * error));

/* Expose and print one frame at `time` (seconds on the scene clock).
   Returns the print, and the negative unless `negative` is false. */
export function exposeFrame({ focus, aperture, speed, error, seed = 1, time = 0, width = PRINT_W, negative = true }) {
  const size = frameSize(width);
  const { w, h } = size;
  const image = optics({ focus, aperture, speed, seed, time }, size);
  const pixels = image.getContext('2d').getImageData(size.pad, size.pad, w, h);
  const print = canvas(w, h);
  const out = print.getContext('2d').createImageData(w, h);
  const film = negative ? canvas(w, h) : null;
  const neg = film?.getContext('2d').createImageData(w, h);
  const correction = labCorrection(error);
  const falloff = VIGNETTE[aperture] ?? 0.15;
  // Printing a thin or dense negative up or down enlarges its grain.
  const grain = 0.04 + 0.022 * Math.abs(correction) + 0.015 * Math.max(0, -error - 1);
  const cx = w / 2, cy = h / 2, corner = cx * cx + cy * cy;
  let state = (seed * 9301 + 49297) % 233280;
  const random = () => (state = (state * 9301 + 49297) % 233280) / 233280;

  for (let i = 0, p = 0; i < pixels.data.length; i += 4, p++) {
    const x = p % w, y = (p / w) | 0;
    // Panchromatic film sees luminance, in linear light.
    const light = 0.2126 * LINEAR[pixels.data[i]] + 0.7152 * LINEAR[pixels.data[i + 1]] + 0.0722 * LINEAR[pixels.data[i + 2]];
    const r2 = ((x - cx) ** 2 + (y - cy) ** 2) / corner;
    const stops = Math.log2(Math.max(light, 1e-6) / MID_GREY) + error - falloff * r2;
    const negative = filmStops(stops);
    const tone = toDisplay(paperCurve(PAPER_MID * 2 ** (negative - correction)));
    // Grain shows most in the mid-tones.
    const value = Math.min(1, Math.max(0, tone + (random() - 0.5) * grain * (1 - Math.abs(2 * tone - 1) * 0.6)));
    out.data[i] = out.data[i + 1] = out.data[i + 2] = Math.round(value * 255);
    out.data[i + 3] = 255;
    if (!neg) continue;
    // The negative itself: dense where it got more light.
    const density = Math.min(1, Math.max(0, (negative - TOE) / (SHOULDER - TOE)));
    neg.data[i] = 255 - density * 190;
    neg.data[i + 1] = 196 - density * 160;
    neg.data[i + 2] = 118 - density * 108;
    neg.data[i + 3] = 255;
  }
  print.getContext('2d').putImageData(out, 0, 0);
  film?.getContext('2d').putImageData(neg, 0, 0);
  return { print, negative: film };
}

/* What the settings do to the picture, for the live readout and the
   notes under each print. Lengths in mm on the film. */
export function measure({ focus, aperture, speed }) {
  return {
    depth: depthOfField(focus, aperture),
    subjectBlur: blurMm(SUBJECT, focus, aperture),
    gulls: motionMm(GULL_FILM_SPEED, speed),
    shake: shakeMm(speed),
    reciprocity: reciprocityStops(speed),
    sharp: (mm) => mm <= COC,
  };
}
