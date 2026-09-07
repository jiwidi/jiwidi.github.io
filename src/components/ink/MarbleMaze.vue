<template>
  <section class="marble-maze" aria-label="Tilt maze">
    <div class="maze-heading">
      <span>04 / Tilt table</span>
      <button type="button" class="maze-reset" aria-label="Reset marble maze" @click="reset">↻ reset</button>
    </div>
    <div
      ref="board"
      class="maze-input"
      tabindex="0"
      role="group"
      aria-label="Guide the marble to the ring. Move the pointer to tilt, or use the arrow keys. Press R to reset."
      @pointermove="movePointer"
      @pointerdown="startPointer"
      @pointerup="endPointer"
      @pointercancel="release"
      @pointerleave="leavePointer"
      @keydown="keyDown"
      @blur="release"
    >
      <svg
        viewBox="0 0 360 192"
        class="maze-board"
        :class="{ 'is-won': ball.won }"
        :style="boardStyle"
        aria-hidden="true"
      >
        <defs>
          <pattern :id="gridId" width="12" height="12" patternUnits="userSpaceOnUse">
            <circle cx="6" cy="6" r="0.65" fill="currentColor" opacity="0.15" />
          </pattern>
        </defs>
        <rect class="maze-floor" x="12" y="12" width="336" height="168" />
        <rect x="12" y="12" width="336" height="168" :fill="`url(#${gridId})`" />
        <circle class="maze-start" :cx="maze.start.x" :cy="maze.start.y" r="9" />
        <path class="maze-start" d="M32 36h8M36 32v8" />
        <rect v-for="(wall, i) in maze.walls" :key="i" class="maze-wall" :x="wall.x" :y="wall.y" :width="wall.w" :height="wall.h" rx="1" />
        <circle class="maze-goal" :cx="maze.goal.x" :cy="maze.goal.y" :r="maze.goal.radius" />
        <circle class="maze-goal-inner" :cx="maze.goal.x" :cy="maze.goal.y" r="8" />
        <ellipse :cx="ball.x + 1" :cy="ball.y + 3" rx="7" ry="5" fill="currentColor" opacity="0.14" />
        <circle class="maze-marble" :cx="ball.x" :cy="ball.y" :r="maze.radius" />
        <circle :cx="ball.x - 1.8" :cy="ball.y - 2" r="1.5" fill="var(--bg)" opacity="0.75" />
      </svg>
    </div>
    <div class="maze-footer">
      <span role="status">{{ ball.won ? 'Made it! Nicely done.' : 'Tilt the box. Find your way to ◎' }}</span>
      <span class="maze-keys" aria-hidden="true">↑ ↓ ← →</span>
    </div>
    <div class="maze-touch-controls" aria-label="Tilt controls">
      <button v-for="direction in directions" :key="direction.key" type="button" :aria-label="`Tilt ${direction.name}`"
        @pointerdown.prevent="pressDirection($event, direction.key)" @pointerup="release" @pointercancel="release"
        @keydown.enter.prevent="nudge(direction.key)" @keydown.space.prevent="nudge(direction.key)"
      >{{ direction.symbol }}</button>
    </div>
  </section>
</template>

<script setup>
import { computed, onBeforeUnmount, onMounted, reactive, ref, useId } from 'vue';
import { MAZE, createMarble, stepMarble } from '/src/lib/marblePhysics.js';

const maze = MAZE;
const gridId = `maze-grid-${useId()}`;
const board = ref(null);
const ball = reactive(createMarble());
const tilt = reactive({ x: 0, y: 0 });
const target = { x: 0, y: 0 };
const heldKeys = new Set();
const reduced = ref(false);
const directions = [
  { key: 'ArrowLeft', name: 'left', symbol: '←' },
  { key: 'ArrowUp', name: 'up', symbol: '↑' },
  { key: 'ArrowDown', name: 'down', symbol: '↓' },
  { key: 'ArrowRight', name: 'right', symbol: '→' },
];
let frame = 0;
let previousTime = 0;
let visible = true;
let observer;
let preference;
let touchPointer = null;
let nudgeTimer;

const boardStyle = computed(() => ({
  transform: reduced.value ? 'none' : `perspective(650px) rotateX(${-tilt.y * 9}deg) rotateY(${tilt.x * 9}deg)`,
}));

function tick(time) {
  frame = 0;
  const elapsed = previousTime ? Math.min((time - previousTime) / 1000, 0.04) : 1 / 60;
  previousTime = time;
  const blend = 1 - Math.exp(-elapsed * 14);
  tilt.x += (target.x - tilt.x) * blend;
  tilt.y += (target.y - tilt.y) * blend;
  const steps = Math.ceil(elapsed / (1 / 120));
  for (let i = 0; i < steps; i += 1) stepMarble(ball, tilt, elapsed / steps);
  if (ball.won) target.x = target.y = 0;
  const moving = Math.abs(target.x) + Math.abs(target.y) + Math.abs(tilt.x) + Math.abs(tilt.y)
    + Math.abs(ball.vx) + Math.abs(ball.vy) > 0.02;
  if (moving) wake();
  else { tilt.x = tilt.y = ball.vx = ball.vy = 0; previousTime = 0; }
}

function wake() {
  if (!frame && visible && !document.hidden) frame = requestAnimationFrame(tick);
}

function release() {
  heldKeys.clear();
  target.x = target.y = 0;
  touchPointer = null;
  clearTimeout(nudgeTimer);
  wake();
}

function reset() {
  release();
  Object.assign(ball, createMarble());
  tilt.x = tilt.y = 0;
}

function movePointer(event) {
  if (ball.won || heldKeys.size || (event.pointerType === 'touch' && touchPointer !== event.pointerId)) return;
  // Reduced motion keeps the game available through intentional press/drag or keys.
  if (reduced.value && !event.buttons) return;
  const rect = board.value.getBoundingClientRect();
  const clamp = (v) => Math.max(-1, Math.min(1, v));
  target.x = clamp(((event.clientX - rect.left) / rect.width - 0.5) * 2);
  target.y = clamp(((event.clientY - rect.top) / rect.height - 0.5) * 2);
  wake();
}

function startPointer(event) {
  if (event.button !== 0) return;
  board.value.focus({ preventScroll: true });
  if (event.pointerType === 'touch') {
    touchPointer = event.pointerId;
    board.value.setPointerCapture(event.pointerId);
  }
  movePointer(event);
}

function endPointer(event) {
  if (event.pointerType === 'touch' || reduced.value) release();
}

function leavePointer() {
  if (touchPointer === null && !heldKeys.size) { target.x = target.y = 0; wake(); }
}

function updateKeys() {
  target.x = Number(heldKeys.has('ArrowRight')) - Number(heldKeys.has('ArrowLeft'));
  target.y = Number(heldKeys.has('ArrowDown')) - Number(heldKeys.has('ArrowUp'));
  wake();
}

function keyDown(event) {
  if (event.key.toLowerCase() === 'r') { event.preventDefault(); reset(); return; }
  if (!directions.some((d) => d.key === event.key)) return;
  event.preventDefault();
  heldKeys.add(event.key);
  updateKeys();
}

function keyUp(event) {
  if (heldKeys.delete(event.key)) updateKeys();
}

function pressDirection(event, key) {
  event.currentTarget.setPointerCapture(event.pointerId);
  heldKeys.clear();
  heldKeys.add(key);
  updateKeys();
}

function nudge(key) {
  heldKeys.add(key);
  updateKeys();
  clearTimeout(nudgeTimer);
  nudgeTimer = setTimeout(release, 180);
}

function pause() {
  release();
  cancelAnimationFrame(frame);
  frame = 0;
  previousTime = 0;
  tilt.x = tilt.y = ball.vx = ball.vy = 0;
}

function changePreference() { reduced.value = preference.matches; pause(); }
function visibilityChange() { if (document.hidden) pause(); }

onMounted(() => {
  preference = window.matchMedia('(prefers-reduced-motion: reduce)');
  changePreference();
  preference.addEventListener('change', changePreference);
  window.addEventListener('keyup', keyUp);
  window.addEventListener('blur', pause);
  document.addEventListener('visibilitychange', visibilityChange);
  observer = new IntersectionObserver(([entry]) => {
    visible = entry.isIntersecting;
    if (!visible) pause();
  });
  observer.observe(board.value);
});

onBeforeUnmount(() => {
  pause();
  observer?.disconnect();
  preference?.removeEventListener('change', changePreference);
  window.removeEventListener('keyup', keyUp);
  window.removeEventListener('blur', pause);
  document.removeEventListener('visibilitychange', visibilityChange);
});
</script>

<style scoped>
.marble-maze { width: 100%; min-width: 0; max-width: 420px; color: var(--fg); }
.maze-heading, .maze-footer { display: flex; align-items: center; justify-content: space-between; gap: 8px; font: 10px/1.5 var(--font-mono); }
.maze-heading { padding: 0 12px 5px; text-transform: uppercase; letter-spacing: 0.1em; }
.maze-reset { border: 0; background: transparent; color: var(--muted); font: inherit; padding: 4px; cursor: pointer; }
.maze-reset:hover { color: var(--accent); }
.maze-input { touch-action: none; cursor: crosshair; border-radius: 2px; }
.maze-input:focus-visible { outline-offset: 2px; }
.maze-board { display: block; width: 100%; height: auto; overflow: visible; }
.maze-floor { fill: var(--bg); stroke: var(--fg); stroke-width: 2; }
.maze-wall { fill: var(--bg_acc); stroke: var(--fg); stroke-width: 1.2; }
.maze-start { fill: none; stroke: var(--muted); stroke-width: 0.7; opacity: 0.4; }
.maze-goal { fill: var(--accent-soft); stroke: var(--accent); stroke-width: 1.4; stroke-dasharray: 3 3; }
.maze-goal-inner { fill: none; stroke: var(--accent); stroke-width: 0.7; opacity: 0.5; }
.maze-marble { fill: var(--accent); stroke: var(--fg); stroke-width: 0.8; }
.is-won .maze-goal { stroke-dasharray: none; stroke-width: 2.5; }
.maze-footer { padding: 5px 12px 0; color: var(--muted); font-size: 9px; }
.maze-keys { white-space: nowrap; }
.maze-touch-controls { display: none; justify-content: center; gap: 8px; padding-top: 10px; }
.maze-touch-controls button { min-width: 40px; min-height: 36px; background: var(--bg); border: 1px solid var(--rule_soft); color: var(--fg); font: 16px var(--font-mono); touch-action: none; }
.maze-touch-controls button:active { background: var(--accent-soft); }
@media (hover: none), (pointer: coarse) { .maze-touch-controls { display: flex; } .maze-keys { display: none; } }
@media (max-width: 700px) { .marble-maze { margin-inline: auto; } }
</style>
