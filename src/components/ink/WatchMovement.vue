<template>
  <figure ref="root" class="watch-movement" aria-label="Interactive watch escapement">
    <figcaption><span>MOVEMENT / 03</span><button type="button" :aria-pressed="detail" @click="detail = !detail">{{ detail ? 'Full view ↗' : 'Closer look ↗' }}</button></figcaption>
    <svg ref="surface" class="watch-surface" :viewBox="detail ? '111 84 144 108' : '34 35 306 220'" role="group" tabindex="0"
      aria-label="Watch mechanism. Drag horizontally to scrub through a beat. Arrow keys step through time; Space pauses or plays."
      @pointerdown="startDrag" @pointermove="drag" @pointerup="stopDrag" @pointercancel="stopDrag" @lostpointercapture="stopDrag" @keydown="keyDown">
      <g class="construction" aria-hidden="true">
        <path d="M46 146H329M99 85V207M161 127V166M253 48V202" />
        <circle cx="99" cy="146" r="52"/><circle cx="253" cy="126" r="71"/>
      </g>
      <g :transform="rotate(state.escape, ESCAPE)" class="escape-wheel">
        <path :d="escapePath" class="metal" />
        <circle cx="99" cy="146" r="29" class="paper"/>
        <path v-for="i in 5" :key="i" d="M95 113H103V146H95Z" :transform="`rotate(${i * 72} 99 146)`" class="metal"/>
        <circle cx="99" cy="146" r="10" class="metal"/>
      </g>
      <g :transform="rotate(state.fork, FORK)" class="pallet-fork">
        <path :d="forkPath" class="metal fork-body"/>
        <g :transform="`rotate(${FORK_REST * 180 / Math.PI} 161 146)`">
          <path d="M161 142H224L230 138H239V141H232L228 144V148L232 151H239V154H230L224 150H161Z" class="metal"/>
        </g>
        <path v-for="(path, i) in palletPaths" :key="i" :d="path" class="jewel" :class="{ 'jewel-active': state.contact }"/>
      </g>
      <g :transform="rotate(state.balance, BALANCE)" class="balance-wheel">
        <circle cx="253" cy="126" r="63" class="balance-rim"/>
        <circle cx="253" cy="126" r="57" class="balance-inner"/>
        <path d="M249 66H257V186H249Z" class="balance-spoke"/>
        <path v-for="i in 12" :key="i" d="M250 65H256V70H250Z" :transform="`rotate(${i * 30} 253 126)`" class="screw"/>
        <circle cx="253" cy="126" r="22" class="roller-disc"/>
        <rect x="230.5" y="122.5" width="5" height="7" rx="1.5" class="jewel roller-jewel" :class="{ 'jewel-active': state.contact }"/>
      </g>
      <path :d="springPath" class="hairspring"/>
      <path d="M297 126H304V122" class="spring-anchor"/>
      <g v-for="point in [ESCAPE, FORK, BALANCE]" :key="point[0]" class="bearing">
        <circle :cx="point[0]" :cy="point[1]" r="4.8" class="paper"/>
        <circle :cx="point[0]" :cy="point[1]" r="1.9"/>
      </g>
      <g v-if="!detail" class="annotations" aria-hidden="true">
        <text x="253" y="43" text-anchor="middle">BALANCE</text>
        <path d="M99 201V216H73M161 157V231H192"/>
        <text x="73" y="227" text-anchor="middle">ESCAPE WHEEL</text>
        <text x="194" y="234">PALLET FORK</text>
      </g>
    </svg>
    <div class="watch-transport">
      <button type="button" :aria-label="playing ? 'Pause watch' : 'Play watch'" @click="togglePlay">{{ playing ? 'Ⅱ' : '▷' }}</button>
      <label class="watch-speed"><span>Speed</span><input v-model.number="speed" type="range" min="0.1" max="1" step="0.05" aria-label="Watch speed"><output>{{ speed.toFixed(2) }}×</output></label>
    </div>
    <label class="watch-timeline"><span>Cycle</span><input :value="state.phase" type="range" min="0" max="1" step="0.001" aria-label="Scrub watch cycle" @input="scrub"><span>tick / tock</span></label>
    <div class="watch-footer"><span>{{ state.stage }}</span><span>Drag to explore</span></div>
    <a class="watch-reference" href="https://ciechanow.ski/mechanical-watch/#balance" target="_blank" rel="noopener noreferrer">Inspired by Bartosz Ciechanowski ↗</a>
  </figure>
</template>

<script setup>
import { computed, onBeforeUnmount, onMounted, ref } from 'vue';
import { BALANCE, ESCAPE, FORK, FORK_REST, PALLETS, TAU, escapementState } from '/src/lib/escapement.js';
const root = ref(null), surface = ref(null);
const cycles = ref(.08), speed = ref(.3), playing = ref(true), detail = ref(false);
const state = computed(() => escapementState(cycles.value));
const rotate = (angle, center) => `rotate(${angle * 180 / Math.PI} ${center.join(' ')})`;
const xy = point => point.map(n => n.toFixed(3)).join(' ');
const escapePath = Array.from({length:15}, (_, i) => {
  const a = i * TAU / 15;
  return [[35,a-.17],[47,a],[44,a+.045],[35,a+.085]].map(([r,t],j) => `${i === 0 && j === 0 ? 'M' : 'L'}${xy([99 + r * Math.cos(t),146 + r * Math.sin(t)])}`).join('');
}).join('') + 'Z';
const forkPath = `M${xy(PALLETS[0])} Q139 121 161 142 Q142 173 ${xy(PALLETS[1])} l-3 -4 Q138 162 155 146 Q138 129 ${xy([PALLETS[0][0]-3,PALLETS[0][1]+4])}Z`;
const palletPaths = PALLETS.map(p => {
  const length = Math.hypot(p[0]-ESCAPE[0],p[1]-ESCAPE[1]);
  const u = [(p[0]-ESCAPE[0])/length,(p[1]-ESCAPE[1])/length];
  return [[0,-2],[0,2],[-10,2],[-10,-2]].map(([along,across],i) => `${i ? 'L' : 'M'}${xy([p[0]+u[0]*along-u[1]*across,p[1]+u[1]*along+u[0]*across])}`).join('') + 'Z';
});
const springPath = computed(() => Array.from({length:201},(_,i) => {
  const t = i / 200, a = 4 * TAU * t + state.value.balance * (1-t), r = 7 + 37 * t;
  return `${i ? 'L' : 'M'}${xy([253 + r * Math.cos(a),126 + r * Math.sin(a)])}`;
}).join(''));
let frame = 0, lastTime = 0, visible = false, observer, preference, activeDrag;
function schedule() { if (!frame && playing.value && visible && !document.hidden && !activeDrag) frame = requestAnimationFrame(tick); }
function tick(time) {
  frame = 0;
  if (!playing.value || !visible || document.hidden || activeDrag) { lastTime = 0; return; }
  if (lastTime) cycles.value += Math.min(time - lastTime, 50) / 1000 * speed.value;
  lastTime = time; schedule();
}
function pause() { cancelAnimationFrame(frame); frame = 0; lastTime = 0; }
function togglePlay() { playing.value = !playing.value; pause(); schedule(); }
function scrub(event) { playing.value = false; pause(); cycles.value = Math.floor(cycles.value) + Number(event.target.value); }
function startDrag(event) {
  if (event.button !== 0 || activeDrag) return;
  surface.value.focus({preventScroll:true});
  activeDrag = { id:event.pointerId, x:event.clientX, cycles:cycles.value };
  playing.value = false; pause(); surface.value.setPointerCapture(event.pointerId);
}
function drag(event) {
  if (!activeDrag || activeDrag.id !== event.pointerId) return;
  cycles.value = activeDrag.cycles + (event.clientX - activeDrag.x) / surface.value.getBoundingClientRect().width;
}
function stopDrag(event) {
  if (!activeDrag || activeDrag.id !== event.pointerId) return;
  activeDrag = null;
  if (surface.value.hasPointerCapture(event.pointerId)) surface.value.releasePointerCapture(event.pointerId);
}
function keyDown(event) {
  if (event.key === ' ') { event.preventDefault(); togglePlay(); }
  else if (['ArrowLeft','ArrowRight','Home'].includes(event.key)) {
    event.preventDefault(); playing.value = false; pause();
    cycles.value = event.key === 'Home' ? 0 : cycles.value + (event.key === 'ArrowLeft' ? -.005 : .005);
  }
}
function visibility() { pause(); schedule(); }
function motionPreference() { if (preference.matches) { playing.value = false; pause(); } }
onMounted(() => {
  preference = window.matchMedia('(prefers-reduced-motion: reduce)'); motionPreference();
  preference.addEventListener('change',motionPreference);
  document.addEventListener('visibilitychange',visibility);
  observer = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; visibility(); });
  observer.observe(root.value);
});
onBeforeUnmount(() => { pause(); observer?.disconnect(); preference?.removeEventListener('change',motionPreference); document.removeEventListener('visibilitychange',visibility); });
</script>

<style scoped>
.watch-movement { margin: 0; min-width: 0; width: 100%; max-width: 420px; color: var(--fg); align-self: start; }
figcaption { display:flex; align-items:center; justify-content:space-between; border-bottom:1px solid var(--rule_soft); padding-bottom:8px; color:var(--muted); font:9px/1.4 var(--font-mono); letter-spacing:.13em; }
button { color:var(--fg); background:none; border:0; cursor:pointer; font:inherit; }
figcaption button { letter-spacing:0; font-size:9px; padding:4px 0 4px 8px; }
.watch-surface { display:block; width:100%; height:260px; touch-action:pan-y; cursor:ew-resize; user-select:none; }
.watch-surface:active { cursor:grabbing; }
.watch-surface path,.watch-surface circle,.watch-surface rect { stroke:currentColor; stroke-width:.9; stroke-linejoin:round; }
.construction { opacity:.14; fill:none; stroke-dasharray:2 4; }
.metal { fill:var(--accent-soft); }
.paper { fill:var(--bg); }
.fork-body { stroke-width:1.4; }
.balance-rim { fill:none; stroke-width:5!important; }
.balance-inner { fill:none; opacity:.45; }
.balance-spoke { fill:var(--accent-soft); opacity:.65; }
.screw { fill:var(--bg); stroke-width:.6!important; }
.roller-disc { fill:var(--bg); fill-opacity:.9; stroke-width:.65!important; }
.jewel { fill:var(--fg); fill-opacity:.52; stroke-width:.6!important; }
.jewel-active { fill:var(--accent); fill-opacity:1; }
.hairspring { fill:none; stroke-width:.7!important; opacity:.7; pointer-events:none; }
.spring-anchor { fill:none; stroke-width:1.5!important; }
.bearing { fill:var(--fg); }
.annotations { font:7px var(--font-mono); letter-spacing:.8px; fill:var(--muted); }
.annotations path { fill:none; opacity:.4; stroke-width:.6!important; }
.watch-transport { display:flex; align-items:center; gap:15px; padding:10px 0; border-block:1px solid var(--rule_soft); }
.watch-transport button { width:22px; height:22px; border:1px solid var(--rule_soft); font:13px var(--font-mono); }
.watch-speed,.watch-timeline { display:flex; align-items:center; gap:10px; font:9px var(--font-mono); color:var(--muted); }
.watch-speed { flex:1; }
input { accent-color:var(--accent); min-width:0; width:60px; flex:1; cursor:ew-resize; }
output { width:37px; font-variant-numeric:tabular-nums; }
.watch-timeline { margin-top:10px; }
.watch-timeline > span:last-child { font-size:8px; }
.watch-footer { display:flex; justify-content:space-between; gap:10px; padding-top:10px; font:8px/1.5 var(--font-mono); color:var(--muted); }
.watch-reference { display:inline-block; margin-top:9px; font:8px/1.5 var(--font-mono); color:var(--muted); text-decoration:none; }
.watch-reference:hover { color:var(--fg); text-decoration:underline; }
button:focus-visible,input:focus-visible,.watch-surface:focus-visible { outline:2px solid var(--accent); outline-offset:3px; }
@media(max-width:700px) { .watch-surface { height:240px; } }
</style>
