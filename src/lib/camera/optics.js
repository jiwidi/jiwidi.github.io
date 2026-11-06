// Optics and exposure math for the Leica M3 simulation. All lengths in mm,
// times in seconds. Distances may be Infinity.

export const FOCAL = 50;            // Summicron 50 mm
export const BASE = 68.5;           // M3 rangefinder base
export const NEAR = 700;            // closest focus
export const SYNC = 1 / 50;         // full-gate curtain travel (M3 flash sync)
export const FRAME_PITCH = 38;      // film per frame: 36 mm image + 2 mm gap
export const PERF_PITCH = 4.75;     // 8 perforations per frame
export const ROLL = 36;
export const SCENE_EV = 12;         // bright overcast at ISO 100
export const ISO = 400;
export const APERTURES = [2, 2.8, 4, 5.6, 8, 11, 16];
export const SPEEDS = [1, 1 / 2, 1 / 4, 1 / 8, 1 / 15, 1 / 30, 1 / 60, 1 / 125, 1 / 250, 1 / 500, 1 / 1000];

const inverse = (d) => (d === Infinity ? 0 : 1 / d);

/* The focus slider is linear in 1/d, like a real distance scale:
   0 is the near limit, 1 is infinity. */
export const distanceAt = (v) => (v >= 1 ? Infinity : NEAR / (1 - v));
export const sliderAt = (d) => 1 - NEAR * inverse(d);

/* Helicoid travel from infinity: thin-lens f² / (d − f). */
export const extension = (d) => FOCAL ** 2 * inverse(d) / (1 - FOCAL * inverse(d));

/* The swinging mirror turns half the parallax angle at the far window. */
export const mirrorAngle = (d) => 0.5 * Math.atan(BASE * inverse(d));

/* Horizontal offset of the rangefinder ghost for an object at `d` when the
   lens is set to `focus`. Zero means the two images coincide. */
export const rangefinderShift = (d, focus) => BASE * (inverse(d) - inverse(focus));

/* Blur-circle diameter on the film for an object at `d`. */
export function blurMm(d, focus, n) {
  return (FOCAL ** 2 / n) * Math.abs(inverse(d) - inverse(focus)) / (1 - FOCAL * inverse(focus));
}

/* Stops of over (+) or under (−) exposure against the scene. */
export function exposureError(n, t, sceneEv = SCENE_EV, iso = ISO) {
  return sceneEv + Math.log2(iso / 100) - Math.log2((n * n) / t);
}

/* Slit width and the slowed-down animation delay before the second curtain. */
export function shutterPlan(t, travelMs) {
  const open = t / SYNC;
  return {
    slitMm: 36 * Math.min(1, open),
    delayMs: open <= 1 ? travelMs * open : travelMs + 260 * Math.log2(open),
  };
}

/* Outer radius of a film roll on a core. Base + emulsion ≈ 0.13 mm. */
export const rollRadius = (length, core, thickness = 0.13) =>
  Math.sqrt(core * core + (Math.max(0, length) * thickness) / Math.PI);

export const formatSpeed = (t) => (t >= 1 ? `${t} s` : `1/${Math.round(1 / t)}`);
export const formatAperture = (n) => `f/${n}`;
export function formatDistance(d) {
  if (d === Infinity) return '∞';
  return d < 2000 ? `${(d / 1000).toFixed(2)} m` : d < 10000 ? `${(d / 1000).toFixed(1)} m` : `${Math.round(d / 1000)} m`;
}
export function formatStops(e) {
  const r = Math.round(e * 3) / 3;
  if (Math.abs(r) < 0.34) return 'correct';
  return `${r > 0 ? '+' : '−'}${Math.abs(r).toFixed(1).replace('.0', '')} stop${Math.abs(r) >= 1.5 ? 's' : ''} ${r > 0 ? 'over' : 'under'}`;
}
