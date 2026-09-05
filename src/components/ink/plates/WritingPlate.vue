<template>
  <g class="ink-body">
    <!-- section the nib is seated in -->
    <path class="ink-line" d="M84 32h40v50l-5 12H89l-5-12Z" data-draw="2" />
    <path class="ink-hair" d="M84 46h40M84 54h40M84 62h40" data-draw="3" />
    <path class="ink-line" d="M90 94h28" data-draw="2" />

    <!-- nib, front view -->
    <path class="ink-bold" :d="nib" data-draw="2" />
    <path class="ink-line" d="M104 200V131" data-draw="2" />
    <path class="ink-line" :d="breather" data-draw="2" />
    <path class="ink-hair" d="M87 108q17 9 34 0M90 118h4M114 118h4" data-draw="3" />
    <path class="ink-hair" d="M91 152q13 7 26 0M94 170q10 6 20 0" data-draw="3" />

    <text class="ink-label ink-label--sm" x="14" y="52">NIB · F</text>
    <path class="ink-hair" d="M56 49h26" data-draw="3" />
    <text class="ink-label ink-label--sm" x="14" y="118">BREATHER</text>
    <path class="ink-hair" d="M64 115h33" data-draw="3" />
    <text class="ink-label ink-label--sm" x="14" y="186">SLIT</text>
    <path class="ink-hair" d="M40 183h64" data-draw="3" />

    <!-- ruled sheet -->
    <rect class="ink-thin" x="212" y="58" width="164" height="132" data-draw="2" />
    <path class="ink-hair" d="M228 58v132" data-draw="3" />
    <path v-for="(y, i) in rules" :key="`r${i}`" class="ink-hair" :d="`M228 ${y}h136`" data-draw="3" />
    <path v-for="(d, i) in setText" :key="`t${i}`" class="ink-hair" :d="d" data-draw="3" />
    <text class="ink-label ink-label--sm" x="216" y="139">¶</text>

    <!-- the line being written -->
    <path ref="stroke" class="ink-script" :d="script" />
    <path class="ink-fill" :d="inkDot" data-fade />
  </g>
</template>

<script>
import { circlePath } from '/src/lib/inkGeometry.js';
import { AMBIENT_START, animate, drawablesIn } from '/src/lib/plateMotion.js';

export default {
  name: 'WritingPlate',
  props: { uid: { type: String, required: true } },
  computed: {
    /* Semicircular shoulders at the top, long concave taper to the point. */
    nib() {
      return 'M104 200C92 170 86 142 86 112a18 18 0 0 1 36 0c0 30-6 58-18 88Z';
    },
    breather() {
      return circlePath(104, 124, 6.5);
    },
    rules() {
      return [84, 110, 136, 162];
    },
    setText() {
      return [
        'M234 80h58M298 80h44M348 80h14',
        'M234 106h74M314 106h36',
        'M234 158h62M330 158h34',
      ];
    },
    script() {
      return 'M236 142c9-26 21-27 26-11 4 13 10 16 15 5 6-13 9-24 17-24 7 0 6 14 3 22-3 7 3 11 9 5 7-7 10-19 18-19 6 0 7 10 5 16 5-4 9-9 14-9';
    },
    inkDot() {
      return circlePath(236, 142, 2.6);
    },
  },
  methods: {
    /* Write the line, hold it, then let the ink lift and start again. */
    ambient(root) {
      const [stroke] = drawablesIn(root, '.ink-script');
      if (!stroke) return [];
      return [
        animate(stroke, {
          draw: [
            { to: '0 0', duration: 0 },
            { to: '0 1', duration: 2800, ease: 'inOut(2)' },
            { to: '1 1', duration: 1100, ease: 'in(2)', delay: 1600 },
          ],
          delay: AMBIENT_START,
          loop: true,
          loopDelay: 600,
        }),
      ];
    },
  },
};
</script>
