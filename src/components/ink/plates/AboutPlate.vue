<template>
  <g class="ink-body">
    <path class="ink-thin" :d="bezelOuter" data-draw="2" />
    <path class="ink-thin" :d="bezelInner" data-draw="2" />
    <path v-for="(d, i) in ticks" :key="`t${i}`" class="ink-hair" :d="d" data-draw="3" />

    <path
      v-for="(p, i) in rose"
      :key="`p${i}`"
      :class="[p.cls, 'ink-rose']"
      :d="p.d"
      :style="p.tone ? { fill: `url(#ink-hatch-${uid})` } : null"
      data-draw="2"
    />

    <text
      v-for="c in cardinals"
      :key="c.label"
      class="ink-label ink-label--card"
      :x="c.x"
      :y="c.y"
      text-anchor="middle"
    >{{ c.label }}</text>

    <g ref="needle" class="ink-pivot" style="transform-origin: 120px 128px">
      <path class="ink-fill" d="M120 82l4.5 46h-9Z" data-fade />
      <path class="ink-thin ink-needle" d="M120 174l4.5-46h-9Z" data-draw="3" />
    </g>

    <path class="ink-thin ink-needle" :d="hubRing" data-draw="3" />
    <path class="ink-fill" :d="hubDot" data-fade />
  </g>
</template>

<script>
import { circlePath, polar, radialTicks } from '/src/lib/inkGeometry.js';
import { AMBIENT_START, animate } from '/src/lib/plateMotion.js';

const CX = 120;
const CY = 128;
const MAJOR = 58;
const MINOR = 36;

export default {
  name: 'AboutPlate',
  props: { uid: { type: String, required: true } },
  computed: {
    bezelOuter() {
      return circlePath(CX, CY, 86);
    },
    bezelInner() {
      return circlePath(CX, CY, 74);
    },
    ticks() {
      return radialTicks(CX, CY, {
        count: 72, inner: 76, outer: 86, majorEvery: 6, majorInner: 70,
      });
    },
    /* Eight points, each split into a lit and a shaded half. */
    rose() {
      const out = [];
      for (let i = 0; i < 8; i += 1) {
        const deg = i * 45;
        const isMajor = i % 2 === 0;
        const reach = isMajor ? MAJOR : MINOR;
        const base = isMajor ? 15 : 11;
        const [tx, ty] = polar(CX, CY, reach, deg);
        const [lx, ly] = polar(CX, CY, base, deg - 45);
        const [rx, ry] = polar(CX, CY, base, deg + 45);
        const f = (n) => n.toFixed(1);
        out.push({ cls: 'ink-thin', d: `M${f(tx)} ${f(ty)}L${f(lx)} ${f(ly)}L${CX} ${CY}Z`, tone: false });
        out.push({ cls: 'ink-thin', d: `M${f(tx)} ${f(ty)}L${f(rx)} ${f(ry)}L${CX} ${CY}Z`, tone: !isMajor });
      }
      return out;
    },
    cardinals() {
      return [
        { label: 'N', x: CX, y: CY - 62 },
        { label: 'E', x: CX + 65, y: CY + 4 },
        { label: 'S', x: CX, y: CY + 69 },
        { label: 'W', x: CX - 65, y: CY + 4 },
      ];
    },
    hubRing() {
      return circlePath(CX, CY, 8);
    },
    hubDot() {
      return circlePath(CX, CY, 2.8);
    },
  },
  methods: {
    ambient() {
      return [
        animate(this.$refs.needle, {
          rotate: [
            { to: -33, duration: 1000, ease: 'inOut(2)' },
            { to: 21, duration: 850, ease: 'inOut(2)' },
            { to: -11, duration: 700, ease: 'inOut(2)' },
            { to: 5, duration: 600, ease: 'inOut(2)' },
            { to: 0, duration: 900, ease: 'out(3)' },
          ],
          loop: true,
          loopDelay: 2600,
          delay: AMBIENT_START,
        }),
      ];
    },
  },
};
</script>
