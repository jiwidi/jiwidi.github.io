<template>
  <g class="ink-body">
    <!-- history -->
    <path class="ink-bold" d="M92 52V204" data-draw="2" />
    <path class="ink-line" :d="branchFeat" data-draw="2" />
    <path class="ink-line" :d="branchWip" data-draw="2" />
    <path class="ink-hair ink-dash" d="M46 118v24" data-fade />
    <path ref="track" class="ink-track" :d="branchFeat" />

    <path v-for="(c, i) in commits" :key="`n${i}`" :class="c.cls" :d="c.d" data-draw="3" />
    <g ref="head" class="ink-pivot" style="transform-origin: 92px 200px">
      <path class="ink-thin" :d="headRing" data-draw="3" />
    </g>
    <rect ref="packet" class="ink-fill" x="-3" y="-3" width="6" height="6" opacity="0" />

    <text class="ink-label" x="92" y="42" text-anchor="middle">main</text>
    <text class="ink-label ink-label--sm" x="150" y="112">feat</text>
    <text class="ink-label ink-label--sm" x="34" y="112" text-anchor="end">wip</text>
    <text class="ink-label ink-label--sm" x="78" y="207" text-anchor="end">HEAD</text>

    <!-- build output -->
    <rect class="ink-line" x="232" y="44" width="146" height="160" data-draw="2" />
    <rect class="ink-fill" x="232" y="44" width="146" height="15" data-fade />
    <text class="ink-label ink-label--invert" x="240" y="54.5">BUILD</text>

    <rect
      v-for="(w, i) in logLines"
      :key="`g${i}`"
      class="ink-bar"
      x="242"
      :y="76 + i * 13"
      :width="w"
      height="2.5"
      data-fade
    />

    <rect class="ink-thin" x="242" y="146" width="126" height="8" data-draw="3" />
    <rect
      ref="progress"
      class="ink-fill"
      x="243.5"
      y="147.5"
      width="123"
      height="5"
      style="transform-origin: 243.5px 150px"
    />
    <text class="ink-label ink-label--sm" x="242" y="176">› ship</text>
    <rect ref="caret" class="ink-fill" x="278" y="168" width="6" height="9" />

    <path class="ink-hair" d="M104 204c52 8 100 0 124-24" data-draw="3" />
    <path class="ink-hair" :d="ciArrow" data-draw="3" />
    <text class="ink-label ink-label--sm" x="166" y="200" text-anchor="middle">ci</text>
  </g>
</template>

<script>
import { arrowHead, circlePath } from '/src/lib/inkGeometry.js';
import { AMBIENT_START, animate, steps, svg } from '/src/lib/plateMotion.js';

export default {
  name: 'ProjectsPlate',
  props: { uid: { type: String, required: true } },
  computed: {
    branchFeat() {
      return 'M92 92c16 0 48 4 48 20v38c0 16-32 20-48 20';
    },
    branchWip() {
      return 'M92 82c-30 0-46 10-46 26';
    },
    commits() {
      const onMain = [58, 92, 126, 160, 200];
      const onBranch = [[140, 120], [140, 142], [46, 112], [46, 148]];
      return [
        ...onMain.map((y) => ({ cls: 'ink-node', d: circlePath(92, y, 4.5) })),
        ...onBranch.map(([x, y]) => ({ cls: 'ink-node ink-node--open', d: circlePath(x, y, 4) })),
      ];
    },
    headRing() {
      return circlePath(92, 200, 9);
    },
    logLines() {
      return [92, 66, 110, 48, 84];
    },
    ciArrow() {
      return arrowHead(228, 180, 132, 5);
    },
  },
  methods: {
    ambient() {
      const start = AMBIENT_START;
      return [
        /* a change riding the feature branch back into main */
        animate(this.$refs.packet, {
          ...svg.createMotionPath(this.$refs.track),
          opacity: [{ to: 1, duration: 200 }, { to: 1, duration: 2600 }, { to: 0, duration: 300 }],
          duration: 3100,
          ease: 'inOut(2)',
          loop: true,
          loopDelay: 1600,
          delay: start,
        }),
        animate(this.$refs.head, {
          scale: [1, 1.5],
          opacity: [0.9, 0],
          duration: 1800,
          ease: 'out(3)',
          loop: true,
          loopDelay: 900,
          delay: start,
        }),
        animate(this.$refs.progress, {
          scaleX: [0, 1],
          duration: 2800,
          ease: 'inOut(2)',
          loop: true,
          loopDelay: 1200,
          delay: start,
        }),
        animate(this.$refs.caret, {
          opacity: [1, 0],
          duration: 1000,
          ease: steps(2),
          loop: true,
          delay: start,
        }),
      ];
    },
  },
};
</script>
