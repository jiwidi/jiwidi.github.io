<template>
  <g class="ink-body">
    <!-- mainspring barrel -->
    <g ref="barrel" class="ink-pivot" :style="origin(BARREL)">
      <path class="ink-line" :d="barrelTeeth" data-draw="2" />
      <path class="ink-hair" :d="mainspring" data-draw="3" />
      <path class="ink-thin" :d="ring(BARREL, 12)" data-draw="3" />
      <path class="ink-fill" d="M91 121h10v10H91Z" data-fade />
    </g>
    <text class="ink-label ink-label--sm" x="96" y="58" text-anchor="middle">MAINSPRING</text>

    <!-- centre wheel -->
    <g ref="centre" class="ink-pivot" :style="origin(CENTRE)">
      <path class="ink-line" :d="centreTeeth" data-draw="2" />
      <path v-for="(d, i) in crossings" :key="`c${i}`" class="ink-hair" :d="d" data-draw="3" />
      <path class="ink-thin" :d="ring(CENTRE, 9)" data-draw="3" />
    </g>
    <path class="ink-fill" :d="ring(CENTRE, 2.6)" data-fade />
    <text class="ink-label ink-label--sm" x="183" y="62" text-anchor="middle">TRAIN</text>

    <!-- escape wheel: advances one tooth per beat -->
    <g ref="escape" class="ink-pivot" :style="origin(ESCAPE)">
      <path class="ink-line" :d="escapeTeeth" data-draw="2" />
      <path class="ink-hair" :d="ring(ESCAPE, 7)" data-draw="3" />
    </g>
    <path class="ink-fill" :d="ring(ESCAPE, 2.6)" data-fade />
    <text class="ink-label ink-label--sm" x="229" y="182" text-anchor="middle">ESCAPEMENT</text>

    <!-- pallet fork: both jewels ride the escape rim, horns drive the balance -->
    <g ref="fork" class="ink-pivot" :style="origin(FORK)">
      <path class="ink-line" :d="forkBody" data-draw="3" />
      <path class="ink-line" d="M289 114l8 12" data-draw="3" />
      <path class="ink-fill" :d="palletJewels" data-fade />
    </g>
    <path class="ink-thin" :d="ring(FORK, 3.2)" data-draw="3" />

    <!-- balance wheel -->
    <g ref="balance" class="ink-pivot" :style="origin(BALANCE)">
      <path class="ink-line" :d="ring(BALANCE, 37)" data-draw="2" />
      <path class="ink-line" :d="ring(BALANCE, 32)" data-draw="2" />
      <path class="ink-hair" d="M293 118h14M353 118h14" data-draw="3" />
      <path class="ink-hair" :d="hairspring" data-draw="3" />
      <path class="ink-fill" :d="balanceScrews" data-fade />
    </g>
    <path class="ink-fill" :d="ring(BALANCE, 2.6)" data-fade />
    <text class="ink-label ink-label--sm" x="330" y="72" text-anchor="middle">BALANCE</text>
  </g>
</template>

<script>
import { circlePath, gearPath, polar, spiralPath } from '/src/lib/inkGeometry.js';
import { AMBIENT_START, animate, steps } from '/src/lib/plateMotion.js';

/* Centre distances equal the sum of the two pitch radii, so the teeth
   actually mesh instead of floating past each other. */
const BARREL = [96, 126];
const CENTRE = [183, 108];
const ESCAPE = [231, 136];
const FORK = [268, 124];
const BALANCE = [330, 118];

const ESCAPE_TIP = 26;
const FORK_REACH = 26;
const ESCAPE_TEETH = 15;
const BEAT = 620;

/* The two points that are simultaneously on the escape wheel's tip circle
   and on the fork's swing circle — where the pallet jewels have to sit. */
function palletContacts() {
  const dx = FORK[0] - ESCAPE[0];
  const dy = FORK[1] - ESCAPE[1];
  const d = Math.hypot(dx, dy);
  const a = (ESCAPE_TIP ** 2 - FORK_REACH ** 2 + d ** 2) / (2 * d);
  const h = Math.sqrt(Math.max(ESCAPE_TIP ** 2 - a ** 2, 0));
  const mx = ESCAPE[0] + (a * dx) / d;
  const my = ESCAPE[1] + (a * dy) / d;
  return [
    [mx - (h * dy) / d, my + (h * dx) / d],
    [mx + (h * dy) / d, my - (h * dx) / d],
  ];
}

export default {
  name: 'CreativePlate',
  props: { uid: { type: String, required: true } },
  data() {
    return { BARREL, CENTRE, ESCAPE, FORK, BALANCE };
  },
  computed: {
    barrelTeeth() {
      return gearPath(...BARREL, { teeth: 32, root: 53, tip: 59 });
    },
    /* Few enough turns that it still reads as one coiled ribbon. */
    mainspring() {
      return spiralPath(...BARREL, { r0: 17, r1: 47, turns: 2, steps: 160 });
    },
    centreTeeth() {
      return gearPath(...CENTRE, { teeth: 20, root: 30, tip: 36 });
    },
    crossings() {
      return [0, 45, 90, 135].map((deg) => {
        const [x0, y0] = polar(...CENTRE, 28, deg);
        const [x1, y1] = polar(...CENTRE, 28, deg + 180);
        return `M${x0.toFixed(1)} ${y0.toFixed(1)}L${x1.toFixed(1)} ${y1.toFixed(1)}`;
      });
    },
    escapeTeeth() {
      return gearPath(...ESCAPE, { teeth: ESCAPE_TEETH, root: 18, tip: ESCAPE_TIP });
    },
    forkBody() {
      const [[ax, ay], [bx, by]] = palletContacts();
      const f = (n) => n.toFixed(1);
      return [
        `M${f(ax)} ${f(ay)}L${FORK[0]} ${FORK[1]}L${f(bx)} ${f(by)}`,
        `M${FORK[0]} ${FORK[1]}L293 120`,
      ].join('');
    },
    palletJewels() {
      return palletContacts()
        .map(([x, y]) => `M${(x - 2.6).toFixed(1)} ${(y - 2.6).toFixed(1)}h5.2v5.2h-5.2Z`)
        .join('');
    },
    hairspring() {
      return spiralPath(...BALANCE, { r0: 8, r1: 24, turns: 2, steps: 120 });
    },
    balanceScrews() {
      return [30, 120, 210, 300]
        .map((deg) => circlePath(...polar(...BALANCE, 34.5, deg), 2.6))
        .join('');
    },
  },
  methods: {
    ring([cx, cy], r) {
      return circlePath(cx, cy, r);
    },
    origin([cx, cy]) {
      return { transformOrigin: `${cx}px ${cy}px` };
    },
    ambient() {
      const beat = { duration: BEAT, alternate: true, loop: true, delay: AMBIENT_START };
      const turn = (duration) => ({ duration, ease: 'linear', loop: true, delay: AMBIENT_START });
      return [
        animate(this.$refs.barrel, { rotate: 360, ...turn(56000) }),
        animate(this.$refs.centre, { rotate: -360, ...turn(18000) }),
        animate(this.$refs.escape, {
          rotate: 360,
          duration: BEAT * 2 * ESCAPE_TEETH,
          ease: steps(ESCAPE_TEETH),
          loop: true,
          delay: AMBIENT_START,
        }),
        animate(this.$refs.fork, { rotate: [-7, 7], ease: 'inOut(3)', ...beat }),
        animate(this.$refs.balance, { rotate: [-135, 135], ease: 'inOutSine', ...beat }),
      ];
    },
  },
};
</script>
