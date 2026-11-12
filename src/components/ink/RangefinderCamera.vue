<template>
  <figure class="m3" :class="{ 'is-expanded': expanded }" aria-label="Leica M3 teardown and simulator">
    <figcaption class="m3-head">
      <span class="m3-title">LEICA M3 <span>· 1954 · teardown</span></span>
      <span class="m3-modes" role="group" aria-label="View">
        <button type="button" :aria-pressed="xray" :disabled="!ready3d" @click="toggleXray">X-ray</button>
        <template v-if="expanded">
          <button type="button" :aria-pressed="exploded" :disabled="!ready3d" @click="toggleExplode">Explode</button>
          <button type="button" :aria-pressed="labels" :disabled="!ready3d" @click="toggleLabels">Labels</button>
        </template>
        <button type="button" class="m3-dig" :aria-expanded="expanded" aria-controls="m3-deck" @click="toggleExpanded">
          {{ expanded ? 'Collapse ↑' : 'Dig deeper ↓' }}
        </button>
      </span>
    </figcaption>

    <div
      ref="stage" class="m3-stage" :class="{ 'is-xray': xray, 'is-flash': flash }" tabindex="0" role="group"
      aria-label="3D Leica M3. Drag to turn it. Arrow keys rotate and Home resets. Click the advance lever, release button, speed dial, aperture ring or rewind knob to use them."
      @keydown="rotateWithKeys"
    >
      <svg v-if="labels && placed.length" class="m3-leaders" aria-hidden="true">
        <g v-for="label in placed" :key="label.id">
          <path :d="label.path" />
          <circle :cx="label.ax" :cy="label.ay" r="1.8" />
        </g>
      </svg>
      <span
        v-for="label in labels ? placed : []" :key="label.id" class="m3-label" :class="`is-${label.side}`"
        :style="{ top: `${label.y - 6}px` }" aria-hidden="true"
      >{{ label.name }}</span>
      <p v-if="loading || failed" class="m3-placeholder" role="status">
        {{ failed ? 'The 3D view is not available here. The viewfinder and controls below still work.' : 'Assembling the camera…' }}
      </p>
      <p v-if="hovered" class="m3-hover"><strong>{{ hovered[0] }}</strong> {{ hovered[1] }}</p>
      <span v-if="xray && !hovered" class="m3-tag">X-ray · mirror swing drawn ×3</span>
    </div>

    <div v-if="expanded" id="m3-deck" class="m3-deck">
      <section class="m3-finder" aria-labelledby="m3-finder-title">
        <h3 id="m3-finder-title">Through the viewfinder</h3>
        <canvas ref="finder" role="img" :aria-label="aligned ? 'Viewfinder: the two images in the centre patch coincide.' : 'Viewfinder: the centre patch shows a double image.'" />
        <p class="m3-finder-note" :class="{ 'is-ok': aligned }">
          {{ aligned ? 'Patch aligned. The subject is sharp at 2.4 m.' : 'Double image in the patch. Focus until the two views meet.' }}
        </p>
      </section>

      <section class="m3-film" aria-labelledby="m3-film-title">
        <h3 id="m3-film-title">On film, if you release now</h3>
        <canvas ref="preview" role="img" :aria-label="`Film preview: ${formatStops(error)}`" />
        <p class="m3-finder-note">
          <span :class="exposureClass">{{ formatStops(error) }}</span>
          · {{ formatAperture(APERTURES[apertureIdx]) }} · {{ formatSpeed(SPEEDS[speedIdx]) }} · ISO 400 black and white
        </p>
      </section>

      <section class="m3-settings" aria-label="Camera settings">
        <div class="m3-sliders">
        <label class="m3-setting">
          <span>Focus</span>
          <input type="range" min="0" max="1" step="0.005" :value="focusV" @input="onFocus">
          <output>{{ formatDistance(distance) }}</output>
        </label>
        <label class="m3-setting">
          <span>Aperture</span>
          <input type="range" min="0" :max="APERTURES.length - 1" step="1" :value="apertureIdx" @input="onAperture">
          <output>{{ formatAperture(APERTURES[apertureIdx]) }}</output>
        </label>
        <label class="m3-setting">
          <span>Shutter</span>
          <input type="range" min="0" :max="SPEEDS.length - 1" step="1" :value="speedIdx" @input="onSpeed">
          <output>{{ formatSpeed(SPEEDS[speedIdx]) }}</output>
        </label>
        </div>
        <div class="m3-effects">
        <p class="m3-meter">
          Bright overcast, ISO 400. The M3 has no meter: sunny 16 says f/8 at 1/250. {{ meterHint }}
          <span :class="exposureClass">{{ formatStops(error) }}</span>
        </p>
        <dl class="m3-readout" aria-label="What these settings do to the photograph">
          <div v-for="row in effects" :key="row.label">
            <dt>{{ row.label }}</dt>
            <dd :class="row.ok === true ? 'is-ok' : row.ok === false ? 'is-off' : ''">{{ row.value }}</dd>
          </div>
        </dl>
        </div>
      </section>
    </div>
    <div class="m3-actions">
      <button type="button" :disabled="!canWind" @click="advance"><span class="m3-dot is-red" />Wind on</button>
      <span class="m3-counter" aria-label="Frame counter"><b>{{ String(frame).padStart(2, '0') }}</b> / 36</span>
      <button type="button" :disabled="!!busy || !loaded" @click="shoot"><span class="m3-dot is-yellow" />Release</button>
      <button
        v-if="expanded || !loaded || frame >= ROLL" type="button" class="m3-quiet"
        :disabled="!!busy || (loaded && frame === 0)" @click="loaded ? rewind() : load()"
      >{{ loaded ? 'Rewind' : 'Load film' }}</button>
    </div>
    <p class="m3-status" role="status">{{ status }}</p>

    <section v-if="expanded && shots.length" class="m3-sheet" aria-labelledby="m3-sheet-title">
      <h3 id="m3-sheet-title">Contact sheet · roll {{ roll }}</h3>
      <figure class="m3-print">
        <img :src="selected.src" :alt="`Frame ${selected.frame}, enlarged: ${selected.caption}`" width="600" height="400">
        <figcaption><b>Frame {{ selected.frame }}</b> {{ selected.caption }}<span>{{ selected.notes }}</span></figcaption>
      </figure>
      <ol>
        <li v-for="shot in shots" :key="shot.frame">
          <button type="button" :aria-pressed="shot.frame === selected.frame" :aria-label="`Enlarge frame ${shot.frame}`" @click="selectedFrame = shot.frame">
            <img :src="shot.src" alt="" width="150" height="100">
            <span>{{ shot.frame }}</span>
            <small>{{ shot.caption }}</small>
          </button>
        </li>
      </ol>
    </section>
  </figure>
</template>

<script setup>
import { computed, nextTick, onBeforeUnmount, onMounted, ref, shallowRef } from 'vue';
import {
  APERTURES, FRAME_PITCH, ROLL, SPEEDS, distanceAt, exposureError, formatAperture, formatDistance,
  formatMm, formatSpeed, formatStops, shutterPlan,
} from '/src/lib/camera/optics.js';
import { STILL_TIME, drawViewfinder, isAligned } from '/src/lib/camera/sceneArt.js';
import { exposeFrame, measure } from '/src/lib/camera/print.js';
import { placeLabels } from '/src/lib/camera/labels.js';
import { LABELS, LEVER_STROKE, PARTS } from '/src/lib/camera/m3/layout.js';

const stage = ref(null);
const finder = ref(null);
const preview = ref(null);
const loading = ref(true);
const failed = ref(false);
const ready3d = ref(false);
const xray = ref(false);
const exploded = ref(false);
const labels = ref(false);
const placed = shallowRef([]);
const hovered = ref(null);
const flash = ref(false);
const expanded = ref(false);

const focusV = ref(1);
const apertureIdx = ref(APERTURES.indexOf(8));
const speedIdx = ref(8);
const frame = ref(0);
const roll = ref(1);
const loaded = ref(true);
const cocked = ref(false);
const busy = ref(null);
const shots = ref([]);
const selectedFrame = ref(null);
const selected = computed(() => shots.value.find((shot) => shot.frame === selectedFrame.value) ?? shots.value.at(-1));
const status = ref('Wind on to bring frame 1 into the gate.');

const distance = computed(() => distanceAt(focusV.value));
const aligned = computed(() => isAligned(distance.value));
const error = computed(() => exposureError(APERTURES[apertureIdx.value], SPEEDS[speedIdx.value]));
const exposureClass = computed(() => (Math.abs(error.value) < 0.34 ? 'is-ok' : Math.abs(error.value) < 1.5 ? 'is-near' : 'is-off'));
/* How the film copes with an exposure error. Negative film has wide
   latitude on the over side and very little on the under side. */
function negativeNote(error) {
  if (error > 4.5) return { value: 'very dense, highlights blocked', ok: false };
  if (error > 2.5) return { value: 'dense, the sky blocks up', ok: false };
  if (error > 0.7) return { value: 'dense, prints fine', ok: true };
  if (error >= -0.7) return { value: 'normal', ok: true };
  if (error >= -1.7) return { value: 'thin, weak shadows', ok: null };
  return { value: 'thin, shadows lost', ok: false };
}
/* The lens scales, done live: what the current settings do to the frame. */
function effectsOf(focus, aperture, speed) {
  const m = measure({ focus, aperture, speed });
  const [near, far] = m.depth;
  const rows = [
    { label: 'Depth of field', value: `${formatDistance(near)} – ${formatDistance(far)}`, ok: null },
    { label: 'Subject at 2.4 m', value: m.sharp(m.subjectBlur) ? 'sharp' : `${formatMm(m.subjectBlur)} blur`, ok: m.sharp(m.subjectBlur) },
    { label: 'Gulls in flight', value: m.sharp(m.gulls) ? `frozen (${formatMm(m.gulls)})` : `${formatMm(m.gulls)} streak`, ok: m.sharp(m.gulls) },
    { label: 'Hand shake', value: m.sharp(m.shake) ? 'steady' : `${formatMm(m.shake)} blur`, ok: m.sharp(m.shake) },
  ];
  rows.push({ label: 'Negative', ...negativeNote(exposureError(aperture, speed)) });
  if (m.reciprocity >= 0.25) rows.push({ label: 'Reciprocity', value: `−${m.reciprocity.toFixed(1)} stop`, ok: false });
  return rows;
}
/* Sunny 16 worked out for the chosen f-stop: the speed that exposes
   correctly, or why no speed on the M3 dial can. */
const meterHint = computed(() => {
  const n = APERTURES[apertureIdx.value];
  const best = SPEEDS.reduce((a, t) => (Math.abs(exposureError(n, t)) < Math.abs(exposureError(n, a)) ? t : a));
  const off = exposureError(n, best);
  if (Math.abs(off) < 0.6) return `At ${formatAperture(n)} use ${formatSpeed(best)}.`;
  return off > 0
    ? `At ${formatAperture(n)} even 1/1000 is ${Math.round(off)} stops over. The negative copes, but an ND filter would fix it.`
    : `At ${formatAperture(n)} even 1 s is ${Math.round(-off)} stops too dark.`;
});
const effects = computed(() => effectsOf(distance.value, APERTURES[apertureIdx.value], SPEEDS[speedIdx.value]));
const canWind = computed(() => !busy.value && loaded.value && !cocked.value && frame.value < ROLL);

const CURTAIN = 21;
const START_DIRECTION = [0.6, 0.36, -0.71];
const FOV = 30;
const negatives = new Map();
let filmPos = 0;
let THREE, renderer, scene, camera, controls, model;
let fit = { assembled: 200, exploded: 300, centre: null };
let explodeT = 0;
let disposed = false;
let preference;
let resizeObserver, themeObserver;
let removeListeners = () => {};
const request = { cancelled: false };

/* --- animation: a tween set driven by one rAF loop, rendering on demand --- */
const tweens = new Set();
let raf = 0;
const reduced = () => preference?.matches;
const ease = (t) => (t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2);
const clamp01 = (t) => Math.min(1, Math.max(0, t));

function tween(duration, update) {
  if (reduced() || duration <= 0 || !renderer) { update(1); render(); return Promise.resolve(); }
  return new Promise((resolve) => {
    tweens.add({ start: performance.now(), duration, update, resolve });
    if (!raf) raf = requestAnimationFrame(step);
  });
}
function step(now) {
  raf = 0;
  for (const tw of [...tweens]) {
    const t = clamp01((now - tw.start) / tw.duration);
    tw.update(t);
    if (t >= 1) { tweens.delete(tw); tw.resolve(); }
  }
  render();
  if (tweens.size && !disposed) raf = requestAnimationFrame(step);
}

function render() {
  if (!renderer || disposed) return;
  renderer.render(scene, camera);
  if (labels.value) layoutLabels();
}

function layoutLabels() {
  const { width, height } = stage.value.getBoundingClientRect();
  const wanted = new Set(xray.value ? LABELS.inside : exploded.value ? [...LABELS.inside, ...LABELS.outside] : LABELS.outside);
  const raycaster = new THREE.Raycaster();
  const points = [];
  for (const anchor of model.anchors) {
    const id = anchor.userData.anchor;
    if (!wanted.has(id) || points.some((p) => p.id === id)) continue;
    const world = anchor.getWorldPosition(new THREE.Vector3());
    if (!xray.value && occluded(raycaster, world, id)) continue;
    const v = world.clone().project(camera);
    if (v.z > 1 || Math.abs(v.x) > 1.05 || Math.abs(v.y) > 1.05) continue;
    points.push({ id, name: PARTS[id][0], x: (v.x + 1) / 2 * width, y: (1 - v.y) / 2 * height });
  }
  placed.value = placeLabels(points, width, height);
}

function occluded(raycaster, world, id) {
  const origin = camera.position.clone();
  const dir = world.clone().sub(origin);
  const dist = dir.length();
  raycaster.set(origin, dir.normalize());
  raycaster.far = dist - 0.5;
  const hit = raycaster.intersectObject(model.root, true).find((h) => h.object.isMesh && h.object.visible);
  return hit && model.partOf(hit.object) !== id;
}

/* --- camera state machine --- */
function setCurtains(e1, e2, exposing = false) { model?.setCurtains(e1, e2, exposing); }

async function advance() {
  if (!canWind.value) return;
  busy.value = 'winding';
  hovered.value = null;
  status.value = 'Lever stroke: the sprocket pulls 38 mm of film and the shutter cocks.';
  const from = filmPos;
  await tween(xray.value || exploded.value ? 1700 : 820, (t) => {
    const out = clamp01(t / 0.68);
    model?.setLever((t < 0.68 ? ease(out) : 1 - ease((t - 0.68) / 0.32)) * LEVER_STROKE);
    filmPos = from + FRAME_PITCH * ease(out);
    model?.setFilm(filmPos, negatives);
    const edge = -CURTAIN + 2 * CURTAIN * ease(out);
    setCurtains(edge, edge);
  });
  frame.value += 1;
  cocked.value = true;
  model?.setCounter(frame.value);
  busy.value = null;
  status.value = `Frame ${frame.value} is in the gate and the shutter is cocked.`;
  render();
}

async function shoot() {
  if (busy.value || !loaded.value) return;
  if (!cocked.value) {
    status.value = frame.value >= ROLL ? 'End of the roll. Rewind the film into the cassette.' : 'The release is locked. Wind on first.';
    await tween(140, (t) => model?.setRelease(Math.sin(t * Math.PI) * 0.6));
    return;
  }
  busy.value = 'exposing';
  const moment = sceneTime();
  const speed = SPEEDS[speedIdx.value];
  const travel = xray.value || exploded.value ? 950 : 240;
  const plan = shutterPlan(speed, travel);
  status.value = `Shutter at ${formatSpeed(speed)}: ${plan.slitMm < 36 ? `a ${plan.slitMm.toFixed(1)} mm slit crosses the film.` : 'the whole gate opens.'}`;
  await tween(90, (t) => model?.setRelease(t * 1.4));
  model?.setExposureRays(true);
  flash.value = !xray.value;
  const total = plan.delayMs + travel;
  await tween(total, (t) => {
    const ms = t * total;
    const e1 = CURTAIN - 2 * CURTAIN * clamp01(ms / travel) ** 1.4;
    const e2 = CURTAIN - 2 * CURTAIN * clamp01((ms - plan.delayMs) / travel) ** 1.4;
    setCurtains(e1, e2, true);
  });
  flash.value = false;
  model?.setExposureRays(false);
  recordFrame(speed, moment);
  cocked.value = false;
  await tween(120, (t) => model?.setRelease((1 - t) * 1.4));
  busy.value = null;
}

function recordFrame(speed, time) {
  const n = frame.value;
  const aperture = APERTURES[apertureIdx.value];
  const { print, negative } = exposeFrame({ focus: distance.value, aperture, speed, error: error.value, seed: n + roll.value * 37, time });
  negatives.set(n, negative);
  model?.setFilm(filmPos, negatives);
  const caption = `${formatAperture(aperture)} · ${formatSpeed(speed)} · ${formatDistance(distance.value)} · ${formatStops(error.value)}`;
  const notes = effectsOf(distance.value, aperture, speed).map((row) => `${row.label}: ${row.value}.`).join(' ');
  shots.value = [...shots.value, { frame: n, src: print.toDataURL('image/jpeg', 0.9), caption, notes }];
  selectedFrame.value = n;
  const sharp = aligned.value ? 'sharp' : 'focus missed';
  status.value = n >= ROLL
    ? `Frame ${n} exposed. That was the last frame: rewind the film.`
    : `Frame ${n} exposed (${sharp}, ${formatStops(error.value)}). Wind on for the next one.`;
}

async function rewind() {
  if (busy.value || !loaded.value) return;
  busy.value = 'rewinding';
  status.value = 'Rewinding: the sprocket disengages and the film goes back into the cassette.';
  const from = filmPos, to = -96;
  await tween(Math.min(3400, 900 + (from - to) * 2.4), (t) => {
    filmPos = from + (to - from) * ease(t);
    model?.setFilm(filmPos, negatives);
    model?.setRewind((from - filmPos) / 5);
  });
  loaded.value = false;
  cocked.value = false;
  busy.value = null;
  status.value = 'The film is back in the cassette. Load a new roll to shoot again.';
}

function load() {
  if (busy.value) return;
  negatives.clear();
  filmPos = 0;
  frame.value = 0;
  if (shots.value.length) roll.value += 1;
  shots.value = [];
  selectedFrame.value = null;
  loaded.value = true;
  cocked.value = false;
  model?.setFilm(0, negatives);
  model?.setCounter(0);
  setCurtains(-CURTAIN, -CURTAIN);
  status.value = 'New roll loaded. Wind on to bring frame 1 into the gate.';
  render();
}

/* --- settings --- */
function onFocus(event) {
  focusV.value = Number(event.target.value);
  model?.setFocus(focusV.value);
  paintFinder();
  requestPreview();
  render();
}
function onAperture(event) {
  apertureIdx.value = Number(event.target.value);
  model?.setAperture(apertureIdx.value);
  requestPreview();
  render();
}
function onSpeed(event) {
  speedIdx.value = Number(event.target.value);
  model?.setSpeed(speedIdx.value);
  requestPreview();
  render();
}
function cycle(kind) {
  if (kind === 'speed') onSpeed({ target: { value: (speedIdx.value + 1) % SPEEDS.length } });
  if (kind === 'aperture') onAperture({ target: { value: (apertureIdx.value + 1) % APERTURES.length } });
}

/* --- viewfinder and film preview --- */
/* One scene clock drives the gulls in the finder, the preview and the
   exposure, so a frame records the gulls where they were at release. */
const sceneTime = () => (reduced() ? STILL_TIME : performance.now() / 1000);
const FINDER_MS = 33;
const PREVIEW_MS = 160;
const PREVIEW_MAX_W = 480;
let finderRaf = 0, previewRaf = 0, lastFinder = 0, lastPreview = 0;

function fitCanvas(canvas, ratio, maxWidth = Infinity) {
  if (!canvas) return false;
  const { width } = canvas.getBoundingClientRect();
  if (!width) return false;
  const w = Math.round(Math.min(maxWidth, width * ratio)), h = Math.round((w * 2) / 3);
  if (canvas.width !== w || canvas.height !== h) { canvas.width = w; canvas.height = h; }
  return true;
}
function paintFinder() {
  if (fitCanvas(finder.value, Math.min(window.devicePixelRatio || 1, 2))) drawViewfinder(finder.value, distance.value, sceneTime());
}
function paintPreview() {
  previewRaf = 0;
  const canvas = preview.value;
  if (!fitCanvas(canvas, 1, PREVIEW_MAX_W)) return;
  const { print } = exposeFrame({
    focus: distance.value, aperture: APERTURES[apertureIdx.value], speed: SPEEDS[speedIdx.value],
    error: error.value, seed: 7, time: sceneTime(), width: canvas.width, negative: false,
  });
  canvas.getContext('2d').drawImage(print, 0, 0, canvas.width, canvas.height);
}
function requestPreview() {
  if (finderRaf) lastPreview = 0;
  else if (!previewRaf) previewRaf = requestAnimationFrame(paintPreview);
}
/* While the bench is open the gulls fly: redraw the finder at ~30 fps and
   the film preview at ~6 fps. Reduced motion keeps them still. */
function liveLoop(now) {
  finderRaf = 0;
  if (!expanded.value || disposed || reduced() || document.hidden) return;
  if (now - lastFinder >= FINDER_MS && finder.value) { lastFinder = now; drawViewfinder(finder.value, distance.value, sceneTime()); }
  if (now - lastPreview >= PREVIEW_MS) { lastPreview = now; paintPreview(); }
  finderRaf = requestAnimationFrame(liveLoop);
}
const resumeLive = () => { if (!document.hidden && expanded.value) startLive(); };
function startLive() {
  paintFinder();
  paintPreview();
  if (!finderRaf && expanded.value) finderRaf = requestAnimationFrame(liveLoop);
}

/* --- views --- */
/* Compact in the hero column; "Dig deeper" grows the same scene into the
   full bench. The page grid reacts to .is-expanded through :has(). */
async function toggleExpanded() {
  const next = !expanded.value;
  if (!next && exploded.value) {
    exploded.value = false;
    explodeT = 0;
    model?.explode(0);
    if (controls) dolly(fit.assembled);
  }
  const apply = async () => {
    expanded.value = next;
    if (!next) { labels.value = false; hovered.value = null; model?.setHighlight(null); }
    await nextTick();
    if (next) startLive();
    render();
  };
  if (document.startViewTransition && !reduced()) await document.startViewTransition(apply).finished;
  else await apply();
  stage.value.closest('figure').scrollIntoView({ behavior: reduced() ? 'auto' : 'smooth', block: next ? 'start' : 'nearest' });
}
/* X-ray draws additive light. Give the canvas an opaque background then:
   light added to a transparent pixel is invalid premultiplied colour, which
   Chrome shows but Safari turns into noise. */
function paintBackground() {
  const bg = getComputedStyle(stage.value).getPropertyValue('--xray-bg').trim();
  renderer.setClearColor(xray.value ? new THREE.Color(bg) : 0, xray.value ? 1 : 0);
}
function toggleXray() {
  xray.value = !xray.value;
  paintBackground();
  model.setXray(xray.value);
  hovered.value = null;
  model.setHighlight(null);
  render();
}
function toggleLabels() {
  labels.value = !labels.value;
  render();
}
async function toggleExplode() {
  exploded.value = !exploded.value;
  const from = explodeT, to = exploded.value ? 1 : 0;
  await tween(1100, (t) => {
    explodeT = from + (to - from) * ease(t);
    model.explode(explodeT);
    dolly(fit.assembled + (fit.exploded - fit.assembled) * explodeT);
    render();
  });
}
/* Keep the orbit direction; move the target toward the exploded centre. */
function dolly(dist) {
  const offset = camera.position.clone().sub(controls.target).setLength(dist);
  controls.target.copy(fit.centre).multiplyScalar(explodeT);
  camera.position.copy(controls.target).add(offset);
  controls.update();
}
function resetView() {
  controls.target.copy(fit.centre).multiplyScalar(explodeT);
  camera.position.set(...START_DIRECTION).setLength(fit.assembled + (fit.exploded - fit.assembled) * explodeT).add(controls.target);
  controls.update();
  render();
}
function rotateWithKeys(event) {
  if (event.target !== stage.value || !controls) return;
  if (event.key === 'Home') { event.preventDefault(); resetView(); return; }
  const keys = { ArrowLeft: [-0.15, 0], ArrowRight: [0.15, 0], ArrowUp: [0, -0.12], ArrowDown: [0, 0.12] };
  if (!keys[event.key]) return;
  event.preventDefault();
  const offset = camera.position.clone().sub(controls.target);
  const spherical = new THREE.Spherical().setFromVector3(offset);
  spherical.theta += keys[event.key][0];
  spherical.phi = THREE.MathUtils.clamp(spherical.phi + keys[event.key][1], 0.12, Math.PI - 0.12);
  camera.position.copy(controls.target).add(new THREE.Vector3().setFromSpherical(spherical));
  controls.update();
}

function syncTheme() {
  if (!model) return;
  const style = getComputedStyle(stage.value);
  const read = (name) => new THREE.Color(style.getPropertyValue(name).trim());
  model.theme({ ink: read('--fg'), paper: read('--bg'), accent: read('--accent'), red: read('--control-red'), yellow: read('--yellow') });
  render();
}

function resize() {
  paintFinder();
  requestPreview();
  if (!renderer) return;
  const { width, height } = stage.value.getBoundingClientRect();
  renderer.setSize(width, height, false);
  camera.aspect = width / height;
  // Fit the body width on narrow stages, not just its height.
  camera.fov = width / height < 1.25 ? FOV * 1.25 / (width / height) : FOV;
  camera.updateProjectionMatrix();
  render();
}

function fitDistances() {
  const box = new THREE.Box3();
  const measure = () => {
    box.makeEmpty();
    model.root.updateMatrixWorld(true);
    model.kit.meshes.forEach((m) => box.expandByObject(m));
    return box;
  };
  const centre = measure().getCenter(new THREE.Vector3());
  model.root.position.sub(centre);
  const radius = (b) => b.getBoundingSphere(new THREE.Sphere()).radius;
  const half = (FOV / 2) * Math.PI / 180;
  fit.assembled = radius(measure()) / Math.sin(half) * 0.74;
  model.explode(1);
  fit.exploded = radius(measure()) / Math.sin(half) * 0.72;
  fit.centre = box.getCenter(new THREE.Vector3());
  model.explode(0);
}

/* --- pointer: hover names a part, click uses a control --- */
function bindPointer() {
  const raycaster = new THREE.Raycaster();
  const ndc = new THREE.Vector2();
  const canvas = renderer.domElement;
  const hit = (event) => {
    const bounds = canvas.getBoundingClientRect();
    ndc.set((event.clientX - bounds.left) / bounds.width * 2 - 1, -(event.clientY - bounds.top) / bounds.height * 2 + 1);
    raycaster.setFromCamera(ndc, camera);
    return raycaster.intersectObject(model.root, true)
      .find((h) => h.object.isMesh && h.object.visible && !(xray.value && h.object.userData.shell))?.object;
  };
  let press = null;
  const show = (object) => {
    const part = object ? model.partOf(object) : null;
    hovered.value = part ? PARTS[part] : null;
    if (model.setHighlight(part)) render();
  };
  const down = (event) => {
    if (event.button !== 0) return;
    stage.value.focus({ preventScroll: true });
    const object = hit(event);
    press = { x: event.clientX, y: event.clientY, id: event.pointerId, action: object && model.actionOf(object) };
    if (press.action) controls.enabled = false;
  };
  const up = (event) => {
    controls.enabled = true;
    if (!press || event.pointerId !== press.id) return;
    if (Math.hypot(event.clientX - press.x, event.clientY - press.y) < 6) {
      const object = hit(event);
      const action = object && model.actionOf(object);
      if (action && action === press.action) ({ advance, shoot, rewind, speed: () => cycle('speed'), aperture: () => cycle('aperture') })[action]();
      else if (event.pointerType !== 'mouse') show(object);
    }
    press = null;
  };
  const move = (event) => {
    if (event.pointerType !== 'mouse') return;
    if (event.buttons) { canvas.style.cursor = 'grabbing'; return; }
    const object = hit(event);
    canvas.style.cursor = object && model.actionOf(object) ? 'pointer' : 'grab';
    show(object);
  };
  const leave = () => { show(null); };
  const lost = (event) => { event.preventDefault(); failed.value = true; };
  canvas.addEventListener('pointerdown', down, true);
  window.addEventListener('pointerup', up);
  canvas.addEventListener('pointermove', move);
  canvas.addEventListener('pointerleave', leave);
  canvas.addEventListener('webglcontextlost', lost);
  return () => {
    canvas.removeEventListener('pointerdown', down, true);
    window.removeEventListener('pointerup', up);
    canvas.removeEventListener('pointermove', move);
    canvas.removeEventListener('pointerleave', leave);
    canvas.removeEventListener('webglcontextlost', lost);
  };
}

onMounted(async () => {
  preference = window.matchMedia('(prefers-reduced-motion: reduce)');
  document.addEventListener('visibilitychange', resumeLive);
  resizeObserver = new ResizeObserver(resize);
  resizeObserver.observe(stage.value);
  paintFinder();
  try {
    const [three, { OrbitControls }, { createM3 }] = await Promise.all([
      import('three'),
      import('three/addons/controls/OrbitControls.js'),
      import('/src/lib/camera/m3/model.js'),
    ]);
    if (disposed || request.cancelled) return;
    THREE = three;
    scene = new THREE.Scene();
    scene.add(new THREE.AmbientLight(0xffffff, 2.1));
    const sun = new THREE.DirectionalLight(0xffffff, 1.1);
    sun.position.set(0.4, 1, -0.6);
    scene.add(sun);
    camera = new THREE.PerspectiveCamera(FOV, 1, 1, 4000);
    renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0, 0);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.domElement.setAttribute('aria-hidden', 'true');
    stage.value.appendChild(renderer.domElement);

    model = createM3(THREE);
    scene.add(model.root);
    model.setFocus(focusV.value);
    model.setAperture(apertureIdx.value);
    model.setSpeed(speedIdx.value);
    model.setFilm(filmPos, negatives);
    model.setCounter(frame.value);
    setCurtains(-CURTAIN, -CURTAIN);
    fitDistances();

    controls = new OrbitControls(camera, renderer.domElement);
    Object.assign(controls, { enablePan: false, enableZoom: false, enableDamping: false, rotateSpeed: 0.6, minPolarAngle: 0.12, maxPolarAngle: Math.PI - 0.12 });
    controls.addEventListener('change', render);
    resetView();
    removeListeners = bindPointer();

    themeObserver = new MutationObserver(syncTheme);
    themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
    loading.value = false;
    ready3d.value = true;
    syncTheme();
    resize();
  } catch (err) {
    if (!disposed) { loading.value = false; failed.value = true; }
  }
});

onBeforeUnmount(() => {
  disposed = true;
  request.cancelled = true;
  cancelAnimationFrame(raf);
  cancelAnimationFrame(finderRaf);
  cancelAnimationFrame(previewRaf);
  document.removeEventListener('visibilitychange', resumeLive);
  tweens.clear();
  removeListeners();
  resizeObserver?.disconnect();
  themeObserver?.disconnect();
  controls?.dispose();
  const geometries = new Set(), materials = new Set();
  scene?.traverse((object) => {
    if (object.geometry) geometries.add(object.geometry);
    if (object.material) (Array.isArray(object.material) ? object.material : [object.material]).forEach((m) => materials.add(m));
  });
  geometries.forEach((g) => g.dispose());
  materials.forEach((m) => { m.map?.dispose(); m.dispose(); });
  model?.dispose();
  renderer?.dispose();
  renderer?.domElement.remove();
});
</script>

<style scoped>
.m3 {
  --xray-bg: #06120e;
  --xray-ink: #cfeee3;
  width: 100%;
  min-width: 0;
  max-width: 290px;
  align-self: start;
  justify-self: end;
  margin: 0;
  color: var(--fg);
}
.m3.is-expanded { max-width: none; justify-self: stretch; }
.m3:not(.is-expanded) .m3-modes button { padding: 6px 8px; }
.m3:not(.is-expanded) .m3-actions button { padding: 6px 9px; }
.m3-head {
  opacity: 1; /* the site fades every figcaption; this one holds controls */
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding-bottom: 8px;
  border-bottom: 1px solid var(--rule_soft);
  font: 10px/1.4 var(--font-mono);
  letter-spacing: 0.14em;
}
.m3-title span { color: var(--muted); letter-spacing: 0.08em; }
.m3:not(.is-expanded) .m3-title span { display: none; }
.m3-modes { display: flex; gap: 6px; }
.m3-modes button {
  border: 1px solid var(--rule_soft);
  background: transparent;
  color: var(--fg);
  font: 10px/1 var(--font-mono);
  letter-spacing: 0.06em;
  padding: 7px 10px;
  cursor: pointer;
  transition: background-color 160ms var(--ease-out), color 160ms var(--ease-out), border-color 160ms var(--ease-out);
}
.m3-modes button:hover:not(:disabled) { border-color: var(--fg); }
.m3-modes button[aria-pressed="true"] { background: var(--fg); color: var(--bg); border-color: var(--fg); }
.m3-modes button:disabled { opacity: 0.45; cursor: default; }
.m3-modes .m3-dig { background: var(--accent); border-color: var(--accent); color: var(--bg); }
.m3-modes .m3-dig:hover { background: var(--fg); border-color: var(--fg); }
.m3-modes .m3-dig[aria-expanded="true"] { background: transparent; color: var(--fg); border-color: var(--rule_soft); }

.m3-stage {
  position: relative;
  height: clamp(208px, 18.4vw, 240px);
  overflow: hidden;
  cursor: grab;
  touch-action: none;
  user-select: none;
  background: transparent;
  transition: background-color 360ms var(--ease-out);
}
.m3-stage.is-xray { background: var(--xray-bg); }
/* Glow and scanlines sit over the opaque canvas. */
.m3-stage.is-xray::before {
  content: '';
  position: absolute;
  inset: 0;
  pointer-events: none;
  mix-blend-mode: screen;
  background:
    radial-gradient(120% 90% at 50% 42%, rgba(48, 120, 98, 0.3), transparent 70%),
    repeating-linear-gradient(0deg, rgba(255, 255, 255, 0.022) 0 1px, transparent 1px 3px);
}
.is-expanded .m3-stage { height: clamp(320px, 54vw, 470px); }
.m3-stage :deep(canvas) { display: block; width: 100%; height: 100%; }
.m3-stage.is-flash::after {
  content: '';
  position: absolute;
  inset: 0;
  pointer-events: none;
  background: var(--yellow);
  opacity: 0.08;
}
.m3-placeholder {
  position: absolute;
  inset: 0;
  display: grid;
  place-items: center;
  margin: 0;
  padding: 24px;
  font: 11px/1.6 var(--font-mono);
  color: var(--muted);
  text-align: center;
}
.m3-leaders { position: absolute; inset: 0; width: 100%; height: 100%; pointer-events: none; overflow: visible; }
.m3-leaders path { fill: none; stroke: var(--fg); stroke-width: 0.8; opacity: 0.7; }
.m3-leaders circle { fill: var(--fg); }
.m3-label {
  position: absolute;
  pointer-events: none;
  font: 500 9px/12px var(--font-mono);
  letter-spacing: 0.06em;
  text-transform: uppercase;
  white-space: nowrap;
  color: var(--fg);
  background: color-mix(in srgb, var(--bg) 82%, transparent);
  padding: 0 2px;
}
.m3-label.is-left { left: 8px; }
.m3-label.is-right { right: 8px; }
.is-xray .m3-leaders path { stroke: var(--xray-ink); opacity: 0.55; }
.is-xray .m3-leaders circle { fill: #ffe14a; }
.is-xray .m3-label { color: var(--xray-ink); background: rgba(6, 18, 14, 0.7); }
.m3-hover {
  position: absolute;
  left: 10px;
  right: 10px;
  bottom: 8px;
  margin: 0;
  max-width: 34em;
  pointer-events: none;
  font: 11px/1.5 var(--font-sans);
  color: var(--muted);
}
.m3-hover strong { color: var(--fg); font: 600 10px/1.5 var(--font-mono); letter-spacing: 0.06em; text-transform: uppercase; margin-right: 4px; }
.is-xray .m3-hover { color: rgba(207, 238, 227, 0.75); }
.is-xray .m3-hover strong { color: #ffe14a; }
.m3-tag {
  position: absolute;
  left: 10px;
  bottom: 8px;
  pointer-events: none;
  font: 9px var(--font-mono);
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: rgba(207, 238, 227, 0.55);
}

.m3-deck {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
  grid-template-areas: "finder film" "settings settings";
  gap: 18px 22px;
  padding: 16px 0 12px;
  border-top: 1px solid var(--rule_soft);
}
.m3-deck h3, .m3-sheet h3 {
  margin: 0 0 8px;
  font: 9px/1.4 var(--font-mono);
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--muted);
}
.m3-finder canvas {
  display: block;
  width: 100%;
  aspect-ratio: 3 / 2;
  background: #0b0f0d;
  border-radius: 10px / 14px;
  box-shadow: inset 0 0 0 1px var(--rule_soft), 0 0 0 4px var(--bg_acc);
}
.m3-finder-note { margin: 10px 0 0; font: 10px/1.5 var(--font-mono); color: var(--muted); }
.m3-finder-note.is-ok { color: var(--accent); }

.m3-finder { grid-area: finder; min-width: 0; }
.m3-film { grid-area: film; min-width: 0; }
/* The preview reads as a small print: paper border, no rounded finder mask. */
.m3-film canvas {
  display: block;
  width: calc(100% - 12px);
  margin: 6px;
  aspect-ratio: 3 / 2;
  background: #f2efe6;
  box-shadow: 0 0 0 6px #f2efe6, 0 0 0 7px var(--rule_soft);
}
.m3-film .m3-finder-note span { font-weight: 600; }
.m3-film .is-ok { color: var(--accent); }
.m3-film .is-off { color: var(--control-red); }
.m3-settings { grid-area: settings; display: grid; grid-template-columns: minmax(0, 1fr) minmax(0, 1fr); gap: 10px 28px; min-width: 0; }
.m3-sliders, .m3-effects { display: flex; flex-direction: column; gap: 10px; min-width: 0; }
.m3-setting { display: grid; grid-template-columns: 62px minmax(0, 1fr) 58px; align-items: center; gap: 10px; font: 10px var(--font-mono); color: var(--muted); }
.m3-setting input { width: 100%; min-width: 0; accent-color: var(--accent); }
.m3-setting output { color: var(--fg); font-variant-numeric: tabular-nums; text-align: right; }
.m3-meter { margin: 2px 0 0; font: 12px/1.55 var(--font-sans); color: var(--muted); }
.m3-meter span { font: 10px var(--font-mono); margin-left: 4px; white-space: nowrap; }
.m3-meter .is-ok { color: var(--accent); }
.m3-meter .is-near { color: var(--fg); }
.m3-meter .is-off { color: var(--control-red); }
.m3-readout { display: grid; gap: 3px; margin: 0; font: 10px/1.5 var(--font-mono); }
.m3-readout div { display: flex; justify-content: space-between; gap: 12px; border-bottom: 1px dotted var(--rule_soft); padding-bottom: 2px; }
.m3-readout dt { color: var(--muted); }
.m3-readout dd { margin: 0; color: var(--fg); font-variant-numeric: tabular-nums; text-align: right; }
.m3-readout .is-ok { color: var(--accent); }
.m3-readout .is-off { color: var(--control-red); }
.m3-actions {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
  padding: 10px 0;
  border-top: 1px solid var(--rule_soft);
}
.m3:not(.is-expanded) .m3-actions { justify-content: space-between; }
.m3-actions button {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  padding: 8px 11px;
  border: 1px solid var(--fg);
  background: var(--fg);
  color: var(--bg);
  font: 10px/1 var(--font-mono);
  letter-spacing: 0.05em;
  cursor: pointer;
  transition: transform 120ms var(--ease-out), opacity 160ms;
}
.m3-actions button:active:not(:disabled) { transform: translateY(1px); }
.m3-actions button:disabled { opacity: 0.35; cursor: default; }
.m3-actions .m3-quiet { background: transparent; color: var(--fg); border-color: var(--rule_soft); margin-left: auto; }
.m3-dot { width: 6px; height: 6px; border-radius: 50%; }
.m3-dot.is-red { background: var(--control-red); }
.m3-dot.is-yellow { background: var(--yellow); }
.m3-counter { font: 10px var(--font-mono); color: var(--muted); font-variant-numeric: tabular-nums; padding: 0 4px; }
.m3-counter b { font-size: 14px; color: var(--fg); font-weight: 600; }
.m3-status { margin: 0; padding: 9px 0; border-top: 1px solid var(--rule_soft); font: 10px/1.5 var(--font-mono); color: var(--muted); }

.m3-sheet { padding-top: 12px; border-top: 1px solid var(--rule_soft); }
.m3-sheet ol {
  display: flex;
  gap: 10px;
  margin: 0;
  padding: 10px;
  list-style: none;
  overflow-x: auto;
  background: #141716;
  scrollbar-width: thin;
}
.m3-print { margin: 0 0 10px; padding: 14px; background: #141716; display: grid; gap: 10px; justify-items: center; }
.m3-print img { width: min(600px, 100% - 16px); height: auto; aspect-ratio: 3 / 2; display: block; border: 8px solid #f2efe6; }
.m3-print figcaption { width: 100%; max-width: 616px; margin: 0; font: 10px/1.6 var(--font-mono); letter-spacing: 0; text-transform: none; opacity: 1; color: #c9cfcb; }
.m3-print figcaption b { color: #f0c27a; font-weight: 600; margin-right: 6px; }
.m3-print figcaption span { display: block; color: #9aa39e; }
.m3-sheet li { flex: 0 0 150px; }
.m3-sheet li button { display: grid; gap: 3px; width: 100%; padding: 0; border: 0; background: none; color: #c9cfcb; text-align: left; cursor: pointer; }
.m3-sheet li button[aria-pressed="true"] img { outline: 2px solid #f0c27a; }
.m3-sheet li button:hover img { outline-color: rgba(240, 194, 122, 0.6); }
.m3-sheet li img { width: 150px; height: 100px; display: block; outline: 1px solid rgba(255, 255, 255, 0.08); }
.m3-sheet li span { font: 600 10px var(--font-mono); color: #f0c27a; }
.m3-sheet small { font: 9px/1.4 var(--font-mono); color: #9aa39e; }

button:focus-visible, .m3-stage:focus-visible, .m3-setting input:focus-visible { outline: 2px solid var(--accent); outline-offset: 3px; }

@media (max-width: 700px) {
  .m3-deck { grid-template-columns: minmax(0, 1fr); grid-template-areas: "finder" "film" "settings"; }
  .m3-settings { grid-template-columns: minmax(0, 1fr); }
  .m3 { justify-self: center; }
  .m3-stage { height: 208px; }
  .is-expanded .m3-stage { height: 340px; }
  .m3-modes button { padding: 7px 8px; }
  .m3-title span { display: none; }
}
@media (prefers-reduced-motion: reduce) {
  .m3-stage, .m3-modes button, .m3-actions button { transition: none; }
}
</style>
