<template>
  <div ref="drawing" class="landing-birds" aria-hidden="true">
    <svg viewBox="12 24 320 222" fill="none" xmlns="http://www.w3.org/2000/svg">
      <g class="bird bird--left" :style="{ transform: `rotate(${lean * 2.5}deg)` }">
        <g class="bird-feet">
          <path d="M108 177 111 200 102 205 M111 200 120 207 M111 200 110 210" />
          <path d="M143 182 146 202 138 208 M146 202 156 209 M146 202 146 211" />
        </g>
        <path class="bird-body" d="M166 173 C151 185 127 187 105 176 C83 165 68 146 59 122 L28 72 C22 63 24 59 30 62 L53 89 L29 55 C25 49 29 46 35 51 L61 82 L38 48 C35 41 40 40 45 46 L71 78 L49 43 C46 38 51 37 56 43 L91 91 C104 107 127 111 140 122 C146 110 157 107 169 111 C182 115 191 128 192 141 L212 160 L188 153 C182 168 177 172 166 173 Z" />
        <path class="bird-etch" d="M59 97 C66 119 78 144 91 156 M98 166 C115 179 140 184 157 177 M147 119 C156 112 165 113 173 117 M188 144 203 155" />
        <g class="bird-wing" :transform="wingTransform('left', 96, 126)">
          <path d="M137 139 C120 122 102 117 96 126 C89 137 107 158 121 161 C112 151 104 140 107 134" />
          <path d="M116 141 C123 149 128 156 131 160 C132 164 128 164 123 160 M123 139 141 159 C145 165 139 165 134 159 M132 141 150 157 C154 162 149 163 144 158 M143 146 156 156 C160 160 157 162 153 158" />
        </g>
        <circle :cx="174 + gazeX" :cy="137 + gazeY" r="2.5" class="bird-eye" />
      </g>

      <g class="bird bird--right" :style="{ transform: `rotate(${-lean * 3}deg)` }">
        <g class="bird-feet">
          <path d="M240 208 237 226 226 231 M237 226 245 232 M237 226 235 235" />
          <path d="M270 204 274 222 265 228 M274 222 283 227 M274 222 274 232" />
        </g>
        <path class="bird-body" d="M223 199 C215 194 211 185 211 177 L192 167 L214 170 C219 158 228 151 238 155 C249 158 252 167 258 172 C272 163 288 161 297 148 L316 122 C321 116 326 118 322 125 L307 147 L329 123 C334 118 337 122 332 128 L313 151 L331 135 C337 130 340 134 334 141 L308 173 C297 185 287 199 270 206 C253 215 235 214 223 199 Z" />
        <path class="bird-etch" d="M219 176 C218 187 224 199 235 204 M242 208 C260 211 279 200 289 189 M262 174 C278 169 290 166 299 154 M214 172 202 169" />
        <g class="bird-wing" :transform="wingTransform('right', 280, 179)">
          <path d="M233 190 Q239 184 248 180 C262 171 277 172 280 179 C283 187 269 201 259 202 C267 195 274 185 270 181" />
          <path d="M263 186 251 202 C247 208 244 204 248 199 M256 184 241 199 C236 204 235 199 240 194 M248 183 235 194 C230 198 228 195 233 190" />
        </g>
        <circle :cx="230 + gazeX" :cy="173 + gazeY" r="2.35" class="bird-eye" />
      </g>
    </svg>
  </div>
</template>

<script setup>
import { onBeforeUnmount, onMounted, ref } from 'vue';
import { defaultBirdWings } from '/src/lib/birdWings.js';

const wings = defaultBirdWings();
function wingTransform(side, anchorX, anchorY) {
  const wing = wings[side];
  return `translate(${wing.x} ${wing.y}) rotate(${wing.angle}) scale(${-wing.scale} ${wing.flipY ? -wing.scale : wing.scale}) translate(${-anchorX} ${-anchorY})`;
}

const drawing = ref(null);
const lean = ref(0);
const gazeX = ref(0);
const gazeY = ref(0);
let surface;
let frame = 0;
let motionPreference;

function watchPointer(event) {
  if (motionPreference.matches || event.pointerType === 'touch') return;
  cancelAnimationFrame(frame);
  frame = requestAnimationFrame(() => {
    const bounds = drawing.value.getBoundingClientRect();
    const x = Math.max(-1, Math.min(1, (event.clientX - bounds.left - bounds.width / 2) / bounds.width));
    const y = Math.max(-1, Math.min(1, (event.clientY - bounds.top - bounds.height / 2) / bounds.height));
    lean.value = x;
    gazeX.value = x * 1.2;
    gazeY.value = y * 0.9;
  });
}

function rest() {
  cancelAnimationFrame(frame);
  lean.value = 0;
  gazeX.value = 0;
  gazeY.value = 0;
}

onMounted(() => {
  motionPreference = window.matchMedia('(prefers-reduced-motion: reduce)');
  motionPreference.addEventListener('change', rest);
  surface = drawing.value.closest('article');
  surface?.addEventListener('pointermove', watchPointer, { passive: true });
  surface?.addEventListener('pointerleave', rest);
});

onBeforeUnmount(() => {
  cancelAnimationFrame(frame);
  motionPreference?.removeEventListener('change', rest);
  surface?.removeEventListener('pointermove', watchPointer);
  surface?.removeEventListener('pointerleave', rest);
});
</script>

<style scoped>
.landing-birds { width: 100%; color: var(--fg); }
.landing-birds svg { display: block; width: 100%; overflow: visible; }
.bird { stroke: currentColor; stroke-width: 1.45; stroke-linecap: round; stroke-linejoin: round; transition: transform 650ms cubic-bezier(.22, 1, .36, 1); }
.bird--left { transform-origin: 127px 205px; }
.bird--right { transform-origin: 254px 227px; }
.bird-body { fill: var(--bg); }
.bird-eye { fill: currentColor; stroke: none; }
.bird-etch { stroke-width: .7; opacity: .65; }
.bird-feet { stroke-width: 1.2; }
@media (max-width: 760px) {
  .bird { stroke-width: 2; }
  .bird-feet { stroke-width: 1.8; }
  .bird-etch { opacity: .4; }
}
@media (prefers-reduced-motion: reduce) {
  .bird { transition: none; }
}
</style>
