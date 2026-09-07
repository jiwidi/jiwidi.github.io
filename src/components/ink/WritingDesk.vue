<template>
  <section class="writing-desk" aria-label="Interactive writing desk">
    <div class="writing-desk__heading">
      <span>INK & LINE</span>
      <button type="button" @click="clearPage" :disabled="!strokes.length">Clear page <span aria-hidden="true">↺</span></button>
    </div>

    <svg
      ref="surface"
      class="writing-desk__surface"
      :class="{ 'is-writing': drawing, 'has-pointer': pointerInside }"
      viewBox="0 0 360 218"
      tabindex="0"
      role="group"
      aria-label="Drawing paper. Move your pointer and hold to write. With a keyboard, use arrow keys to move the pen and hold Space to write."
      @pointerenter="enter"
      @pointermove="move"
      @pointerdown="start"
      @pointerup="stop"
      @pointercancel="cancel"
      @lostpointercapture="cancel"
      @pointerleave="leave"
      @keydown="keyDown"
      @keyup="keyUp"
      @blur="blur"
      @focus="keyboardFocus = true"
    >
      <path v-for="line in 9" :key="line" class="writing-desk__rule" :d="`M0 ${line * 22}H360`" />

      <g class="writing-desk__ink">
        <path
          v-for="(stroke, index) in strokes"
          :key="index"
          :d="stroke"
          fill="none"
          stroke="currentColor"
          stroke-width="1.65"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </g>

      <g class="writing-desk__pen" :transform="`translate(${pen.x} ${pen.y}) rotate(36)`" aria-hidden="true">
        <ellipse class="writing-desk__pen-shadow" cx="5" cy="-48" rx="8" ry="53" transform="rotate(-5)" />
        <path class="writing-desk__barrel" d="M-6-37L-7-104Q-7-115 0-115Q7-115 7-104L6-37Z" />
        <path class="writing-desk__highlight" d="M-3-103V-48" />
        <path class="writing-desk__clip" d="M3-106L3-76Q3-72 0-72" />
        <path class="writing-desk__band" d="M-7-43H7V-37H-7Z" />
        <path class="writing-desk__grip" d="M-6-37L-5-22H5L6-37Z" />
        <path class="writing-desk__nib" d="M-5-22L-7-15Q-3-8 0 0Q3-8 7-15L5-22Z" />
        <path class="writing-desk__nib-detail" d="M0 0V-13M-4-19Q0-16 4-19" />
        <circle class="writing-desk__breather" cx="0" cy="-14" r="1.3" />
      </g>
    </svg>

    <div class="writing-desk__footer">
      <span>{{ keyboardFocus && !pointerInside ? 'Arrow keys move · hold Space to write' : 'Move the pen · hold to write' }}</span>
      <span class="writing-desk__status" aria-hidden="true" :class="{ 'is-active': drawing }">{{ drawing ? 'INKING' : '02' }}</span>
    </div>
    <span class="writing-desk__sr" role="status">{{ announcement }}</span>
  </section>
</template>

<script setup>
import { ref } from 'vue';

const surface = ref(null);
const strokes = ref([]);
const pen = ref({ x: 234, y: 164 });
const drawing = ref(false);
const pointerInside = ref(false);
const keyboardFocus = ref(false);
const announcement = ref('');
let activePointer = null;
let lastPoint = null;
let spaceHeld = false;

function pointFromEvent(event) {
  const matrix = surface.value?.getScreenCTM();
  if (!matrix) return pen.value;
  const point = new DOMPoint(event.clientX, event.clientY).matrixTransform(matrix.inverse());
  return { x: point.x, y: point.y };
}

function inside(point) {
  return point.x >= 0 && point.x <= 360 && point.y >= 0 && point.y <= 218;
}

function beginStroke() {
  // Bound memory for very long drawing sessions without limiting individual gestures.
  if (strokes.value.length >= 300) strokes.value.shift();
  lastPoint = { ...pen.value };
  strokes.value.push(`M${pen.value.x.toFixed(2)} ${pen.value.y.toFixed(2)}l.01 .01`);
  drawing.value = true;
}

function addPoint(point) {
  pen.value = point;
  if (!drawing.value || !lastPoint) return;
  if (Math.hypot(point.x - lastPoint.x, point.y - lastPoint.y) < 0.7) return;
  const previous = lastPoint;
  const midX = (previous.x + point.x) / 2;
  const midY = (previous.y + point.y) / 2;
  strokes.value[strokes.value.length - 1] += `Q${previous.x.toFixed(2)} ${previous.y.toFixed(2)} ${midX.toFixed(2)} ${midY.toFixed(2)}`;
  lastPoint = point;
}

function finishStroke() {
  if (drawing.value && lastPoint) {
    strokes.value[strokes.value.length - 1] += `L${lastPoint.x.toFixed(2)} ${lastPoint.y.toFixed(2)}`;
  }
  drawing.value = false;
  lastPoint = null;
}

function enter(event) {
  if (activePointer !== null && activePointer !== event.pointerId) return;
  pointerInside.value = true;
  pen.value = pointFromEvent(event);
}

function move(event) {
  if (activePointer !== null && activePointer !== event.pointerId) return;
  const point = pointFromEvent(event);
  pointerInside.value = inside(point);
  if (!pointerInside.value) {
    finishStroke();
    return;
  }
  // A captured drag can leave the paper and return without a connecting ink line.
  if (activePointer === event.pointerId && !drawing.value) {
    pen.value = point;
    beginStroke();
  }
  const events = event.getCoalescedEvents?.() || [];
  for (const sample of events) {
    const samplePoint = pointFromEvent(sample);
    if (inside(samplePoint)) addPoint(samplePoint);
  }
  addPoint(point);
}

function start(event) {
  if (event.button !== 0 || activePointer !== null) return;
  event.preventDefault();
  surface.value.focus({ preventScroll: true });
  pointerInside.value = true;
  activePointer = event.pointerId;
  pen.value = pointFromEvent(event);
  surface.value.setPointerCapture(event.pointerId);
  beginStroke();
}

function stop(event) {
  if (activePointer !== event.pointerId) return;
  finishStroke();
  activePointer = null;
  if (surface.value.hasPointerCapture(event.pointerId)) surface.value.releasePointerCapture(event.pointerId);
  if (event.pointerType === 'touch') pointerInside.value = false;
}

function cancel() {
  finishStroke();
  activePointer = null;
}

function leave() {
  pointerInside.value = false;
  finishStroke();
}

function keyDown(event) {
  if (activePointer !== null) return;
  if (event.code === 'Space') {
    event.preventDefault();
    if (!spaceHeld) {
      spaceHeld = true;
      beginStroke();
    }
    return;
  }
  const directions = { ArrowLeft: [-1, 0], ArrowRight: [1, 0], ArrowUp: [0, -1], ArrowDown: [0, 1] };
  if (!directions[event.key]) return;
  event.preventDefault();
  const [dx, dy] = directions[event.key];
  const step = event.shiftKey ? 12 : 4;
  addPoint({ x: Math.max(2, Math.min(358, pen.value.x + dx * step)), y: Math.max(2, Math.min(216, pen.value.y + dy * step)) });
}

function keyUp(event) {
  if (event.code !== 'Space') return;
  event.preventDefault();
  spaceHeld = false;
  finishStroke();
}

function blur() {
  keyboardFocus.value = false;
  spaceHeld = false;
  cancel();
}

function clearPage() {
  cancel();
  strokes.value = [];
  announcement.value = 'The page is clear.';
}
</script>

<style scoped>
.writing-desk {
  width: 100%;
  min-width: 0;
  border: 1px solid var(--fg);
  color: var(--fg);
  background: var(--bg);
}

.writing-desk__heading,
.writing-desk__footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  padding: 8px 12px;
  font-family: var(--font-mono);
  font-size: 9px;
  line-height: 1.4;
}

.writing-desk__heading {
  border-bottom: 1px solid var(--rule_soft);
  letter-spacing: 0.16em;
}

.writing-desk__heading button {
  border: 0;
  padding: 0;
  background: transparent;
  color: inherit;
  font: inherit;
  letter-spacing: 0;
  cursor: pointer;
}

.writing-desk__heading button:disabled { opacity: 0.4; cursor: default; }
.writing-desk__heading button:not(:disabled):hover { color: var(--accent); }
.writing-desk__heading button:focus-visible { outline: 1px solid var(--accent); outline-offset: 4px; }
.writing-desk__heading button span { display: inline-block; margin-left: 4px; font-size: 12px; }
.writing-desk__footer { border-top: 1px solid var(--rule_soft); color: var(--muted); font-size: 9px; }
.writing-desk__status { letter-spacing: 0.12em; font-size: 8px; }
.writing-desk__status.is-active { color: var(--accent); }
.writing-desk__surface { display: block; width: 100%; height: auto; touch-action: none; user-select: none; overflow: hidden; }
.writing-desk__surface.has-pointer { cursor: none; }
.writing-desk__surface:focus { outline: none; }
.writing-desk__surface:focus-visible { outline: 2px solid var(--accent); outline-offset: -3px; }
.writing-desk__rule { fill: none; stroke: currentColor; stroke-width: 0.45; opacity: 0.16; }
.writing-desk__ink { color: var(--accent); }
.writing-desk__pen { pointer-events: none; }
.writing-desk__pen-shadow { fill: currentColor; opacity: 0.07; }
.writing-desk__barrel { fill: var(--fg); stroke: var(--bg); stroke-width: 0.7; }
.writing-desk__highlight { fill: none; stroke: var(--bg); stroke-width: 1; opacity: 0.34; }
.writing-desk__clip { fill: none; stroke: var(--bg); stroke-width: 1.1; }
.writing-desk__band { fill: var(--bg); stroke: var(--fg); stroke-width: 0.9; }
.writing-desk__grip { fill: var(--fg); stroke: var(--bg); stroke-width: 0.6; }
.writing-desk__nib { fill: var(--bg); stroke: var(--fg); stroke-width: 1; }
.writing-desk__nib-detail { fill: none; stroke: var(--fg); stroke-width: 0.65; }
.writing-desk__breather { fill: var(--fg); }
.writing-desk__sr { position: absolute; width: 1px; height: 1px; padding: 0; margin: -1px; overflow: hidden; clip: rect(0, 0, 0, 0); white-space: nowrap; border: 0; }
</style>
