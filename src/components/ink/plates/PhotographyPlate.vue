<template>
  <g class="ink-body">
    <!-- the two sight lines that triangulate the subject -->
    <path class="ink-hair ink-dash" d="M196 50V68" data-fade />
    <path class="ink-thin" :d="sightLeft" data-draw="3" />
    <path class="ink-thin" :d="sightRight" data-draw="3" />
    <path class="ink-thin" :d="target" data-draw="3" />
    <path class="ink-hair" :d="theta" data-draw="3" />
    <text class="ink-label ink-label--sm" x="126" y="110">θ</text>
    <text class="ink-label" x="212" y="38">SUBJECT</text>

    <!-- camera, seen from above -->
    <rect class="ink-bold" x="60" y="116" width="272" height="84" rx="5" data-draw="2" />
    <rect class="ink-line" x="170" y="68" width="52" height="10" data-draw="2" />
    <path class="ink-line" d="M174 78V116M218 78V116" data-draw="2" />
    <path class="ink-hair" :d="knurl" data-draw="3" />
    <text class="ink-label ink-label--sm" x="196" y="112" text-anchor="middle">50mm</text>

    <!-- windows and eyepiece punched through the shell -->
    <rect class="ink-thin ink-glass" x="88" y="108" width="24" height="14" data-draw="2" />
    <rect class="ink-thin ink-glass" x="274" y="106" width="32" height="18" data-draw="2" />
    <rect class="ink-thin ink-glass" x="278" y="194" width="24" height="14" data-draw="2" />
    <text class="ink-label ink-label--sm" x="310" y="207">EYE</text>

    <!-- rangefinder base: swing mirror → splitter → eye -->
    <path class="ink-line" d="M100 136H290" data-draw="2" />
    <path class="ink-line" d="M290 116V196" data-draw="2" />
    <path class="ink-hair" d="M100 131v10M290 131v10" data-draw="3" />
    <rect class="ink-notch" x="178" y="131" width="36" height="10" />
    <text class="ink-label ink-label--sm" x="196" y="138.6" text-anchor="middle">BASE</text>

    <path class="ink-bold" d="M280 126l20 20" data-draw="2" />
    <path class="ink-hair" :d="silvering" data-draw="3" />
    <path class="ink-hair" d="M306 130h26" data-draw="3" />
    <text class="ink-label" x="336" y="133">SPLITTER</text>

    <g ref="mirror" class="ink-pivot" style="transform-origin: 100px 136px">
      <path class="ink-bold" d="M90 126l20 20" data-draw="2" />
    </g>
    <path class="ink-fill" :d="dot(100, 136, 2.4)" data-fade />
    <path class="ink-hair" d="M60 133h26" data-draw="3" />
    <text class="ink-label" x="56" y="136" text-anchor="end">MIRROR</text>

    <!-- focus cam and follower: what couples the lens to the mirror -->
    <g ref="cam" class="ink-pivot" style="transform-origin: 196px 172px">
      <path class="ink-line" :d="camProfile" data-draw="2" />
      <path class="ink-hair" d="M196 156v32" data-draw="3" />
    </g>
    <path class="ink-fill" :d="dot(196, 172, 2.4)" data-fade />
    <g ref="arm">
      <path class="ink-line" d="M162 172H124l-24-32" data-draw="3" />
      <path class="ink-thin" :d="dot(166, 172, 4)" data-draw="3" />
    </g>
    <path class="ink-hair" d="M232 184l-18-8" data-draw="3" />
    <text class="ink-label ink-label--sm" x="236" y="188">CAM</text>

    <!-- what the eye sees: two images sliding into one -->
    <path class="ink-thin" :d="dot(52, 54, 26)" data-draw="2" />
    <rect class="ink-line ink-glass" x="38" y="42" width="28" height="24" data-draw="2" />
    <path class="ink-line" d="M52 30v12M52 66v12" data-draw="3" />
    <path class="ink-line" d="M52 43v22" data-draw="3" />
    <path ref="ghost" class="ink-thin ink-patch-ghost" d="M52 43v22" data-draw="3" />
    <text class="ink-label ink-label--sm" x="52" y="92" text-anchor="middle">PATCH</text>
  </g>
</template>

<script>
import { arcPath, circlePath, polar } from '/src/lib/inkGeometry.js';
import { AMBIENT_START, animate } from '/src/lib/plateMotion.js';

const SUBJECT = [196, 44];
const RF_WINDOW = [100, 116];
const VF_WINDOW = [290, 116];
const CAM = [196, 172];
const CAM_BASE = 16;
const CAM_LIFT = 10;

export default {
  name: 'PhotographyPlate',
  props: { uid: { type: String, required: true } },
  computed: {
    sightLeft() {
      return `M${SUBJECT[0]} ${SUBJECT[1]}L${RF_WINDOW[0]} ${RF_WINDOW[1]}`;
    },
    sightRight() {
      return `M${SUBJECT[0]} ${SUBJECT[1]}L${VF_WINDOW[0]} ${VF_WINDOW[1]}`;
    },
    target() {
      const [x, y] = SUBJECT;
      return `${circlePath(x, y, 6)}M${x - 10} ${y}h20M${x} ${y - 10}v20`;
    },
    /* Parallax angle at the swinging mirror — what the cam has to solve for. */
    theta() {
      return arcPath(RF_WINDOW[0], RF_WINDOW[1], 20, 53, 90);
    },
    knurl() {
      return Array.from({ length: 10 }, (_, i) => `M${178 + i * 4.4} 88v16`).join('');
    },
    silvering() {
      return [0, 1, 2, 3].map((i) => `M${283 + i * 5} ${123 + i * 5}l-5 5`).join('');
    },
    /* Rising-lift cam: radius grows through one turn, then drops back. */
    camProfile() {
      const pts = [];
      for (let deg = 0; deg <= 348; deg += 6) {
        const [x, y] = polar(CAM[0], CAM[1], CAM_BASE + CAM_LIFT * (deg / 360), deg);
        pts.push(`${deg === 0 ? 'M' : 'L'}${x.toFixed(1)} ${y.toFixed(1)}`);
      }
      return `${pts.join('')}Z`;
    },
  },
  methods: {
    dot(cx, cy, r) {
      return circlePath(cx, cy, r);
    },
    /* One focus pull, near to far and back: cam turns, arm slides, mirror
       swings, and the ghost image walks onto the real one. */
    ambient() {
      const pull = {
        duration: 2800,
        ease: 'inOut(3)',
        alternate: true,
        loop: true,
        delay: AMBIENT_START,
      };
      return [
        animate(this.$refs.cam, { rotate: [0, 130], ...pull }),
        animate(this.$refs.arm, { translateX: [0, -7], ...pull }),
        animate(this.$refs.mirror, { rotate: [0, -7], ...pull }),
        animate(this.$refs.ghost, { translateX: [-9, 0], ...pull }),
      ];
    },
  },
};
</script>
