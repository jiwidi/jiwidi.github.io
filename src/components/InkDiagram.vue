<template>
  <div ref="root" class="ink-diagram-wrap" aria-hidden="true">
    <!-- HOME: site index -->
    <svg v-if="kind === 'home'" class="ink-diagram" viewBox="0 0 400 220" fill="none">
      <path class="ink-draw" d="M14 34V14h20" />
      <path class="ink-draw" d="M386 34V14h-20" />
      <path class="ink-draw" d="M14 186v20h20" />
      <path class="ink-draw" d="M386 186v20h-20" />

      <path class="ink-draw" :d="circle(200, 112, 16)" />
      <path class="ink-draw" :d="circle(200, 112, 6)" />

      <path class="ink-draw" d="M200 96L92 52" />
      <path class="ink-draw" d="M200 96L308 52" />
      <path class="ink-draw" d="M186 118L92 168" />
      <path class="ink-draw" d="M214 118L308 168" />
      <path class="ink-draw" d="M200 128L200 188" />

      <path class="ink-draw" :d="circle(92, 52, 11)" />
      <path class="ink-draw" :d="circle(308, 52, 11)" />
      <path class="ink-draw" :d="circle(92, 168, 11)" />
      <path class="ink-draw" :d="circle(308, 168, 11)" />
      <path class="ink-draw" :d="circle(200, 188, 11)" />

      <text class="ink-label" x="200" y="34" text-anchor="middle">INDEX</text>
      <text class="ink-label" x="92" y="38" text-anchor="middle">01</text>
      <text class="ink-label" x="308" y="38" text-anchor="middle">02</text>
      <text class="ink-label" x="92" y="198" text-anchor="middle">03</text>
      <text class="ink-label" x="308" y="198" text-anchor="middle">04</text>
      <text class="ink-label" x="232" y="192">05</text>
      <text class="ink-label" x="200" y="116" text-anchor="middle">//</text>
      <text class="ink-label" x="200" y="212" text-anchor="middle">FIG. 00  ·  FIVE ROOMS</text>
    </svg>

    <!-- PHOTOGRAPHY: optical engine -->
    <svg v-else-if="kind === 'photography'" class="ink-diagram" viewBox="0 0 400 220" fill="none">
      <path class="ink-draw" d="M14 34V14h20" />
      <path class="ink-draw" d="M386 34V14h-20" />
      <path class="ink-draw" d="M14 186v20h20" />
      <path class="ink-draw" d="M386 186v20h-20" />

      <path class="ink-draw" d="M34 84h112a6 6 0 0 1 6 6v58a6 6 0 0 1-6 6H34a6 6 0 0 1-6-6V90a6 6 0 0 1 6-6z" />
      <path class="ink-draw" d="M58 84l18-22h42l18 22" />
      <path class="ink-draw" d="M82 68h32v10H82z" />
      <path class="ink-draw" d="M128 76h12v7h-12z" />
      <path class="ink-draw" d="M40 96h28" />
      <path class="ink-draw" d="M40 104h18" />
      <path class="ink-draw" :d="circle(48, 118, 7)" />
      <path class="ink-draw" :d="circle(48, 118, 3)" />
      <path class="ink-draw" :d="circle(128, 118, 22)" />
      <path class="ink-draw" :d="circle(128, 118, 15)" />
      <path class="ink-draw" :d="circle(128, 118, 6)" />
      <path class="ink-draw" d="M150 108h18v20h-18" />
      <path class="ink-draw" d="M168 118h188" />
      <path class="ink-draw" d="M188 86c18 10 18 54 0 64" />
      <path class="ink-draw" d="M188 86c-10 10-10 54 0 64" />
      <path class="ink-draw" d="M226 96l10 8-10 8 10 8-10 8" />
      <path class="ink-draw" d="M246 96l-10 8 10 8-10 8 10 8" />
      <path class="ink-draw" :d="circle(236, 118, 5)" />
      <path class="ink-draw" d="M268 88c16 9 16 51 0 60" />
      <path class="ink-draw" d="M268 88c-8 9-8 51 0 60" />
      <path class="ink-draw" d="M328 78v80" />
      <path class="ink-draw" d="M328 78h8M328 94h5M328 110h5M328 126h5M328 142h5M328 158h8" />
      <path class="ink-draw" d="M336 86v12h10v24h-10v12" />

      <g ref="spin" class="ink-spin">
        <path class="ink-draw" :d="gearD(358, 118, 10, 22, 16)" />
        <path class="ink-draw" :d="circle(358, 118, 6)" />
        <path class="ink-draw" d="M358 112v12M352 118h12" />
      </g>

      <path class="ink-ray" d="M168 118h160" />
      <path class="ink-ray" d="M176 102c28 6 70 10 144 12" />
      <path class="ink-ray" d="M176 134c28-6 70-10 144-12" />

      <path class="ink-draw" d="M34 196h332" />
      <path class="ink-draw" d="M34 190v12M366 190v12" />
      <text class="ink-label" x="200" y="34" text-anchor="middle">OPTICAL ENGINE</text>
      <text class="ink-label" x="128" y="52" text-anchor="middle">35mm</text>
      <text class="ink-label" x="236" y="178" text-anchor="middle">ƒ/2.8</text>
      <text class="ink-label" x="336" y="72" text-anchor="middle">FILM</text>
      <text class="ink-label" x="200" y="212" text-anchor="middle">FIG. 01  ·  LIGHT → SILVER</text>
    </svg>

    <!-- WRITING: fountain pen + keyboard -->
    <svg v-else-if="kind === 'writing'" class="ink-diagram" viewBox="0 0 400 220" fill="none">
      <path class="ink-draw" d="M14 34V14h20" />
      <path class="ink-draw" d="M386 34V14h-20" />
      <path class="ink-draw" d="M14 186v20h20" />
      <path class="ink-draw" d="M386 186v20h-20" />

      <!-- barrel -->
      <path class="ink-draw" d="M40 168c-8-8-6-20 4-28L132 56l22 20L62 184c-8 8-18 6-22-16z" />
      <path class="ink-draw" d="M58 154l16 14" />
      <path class="ink-draw" d="M78 132l16 14" />
      <path class="ink-draw" d="M118 70l18 16" />
      <!-- clip -->
      <path class="ink-draw" d="M50 150c-10 2-18-8-12-18l8-8" />
      <!-- collar -->
      <path class="ink-draw" d="M126 62l22 20" />
      <!-- nib -->
      <path class="ink-draw" d="M144 70l36-40 8 16-28 36z" />
      <path class="ink-draw" d="M156 72l28-34" />
      <path class="ink-draw" :d="circle(168, 50, 3.2)" />
      <path class="ink-draw" :d="circle(186, 28, 3)" />

      <!-- keyboard plate -->
      <path class="ink-draw" d="M204 86h172v100H204z" />
      <rect
        v-for="(k, i) in writingKeys"
        :key="i"
        class="ink-draw"
        :x="k.x"
        :y="k.y"
        :width="k.w"
        :height="k.h"
      />

      <path class="ink-draw" d="M184 32C230 8 278 46 290 96" />

      <text class="ink-label" x="200" y="34" text-anchor="middle">INK + TYPE</text>
      <text class="ink-label" x="70" y="200">NIB</text>
      <text class="ink-label" x="290" y="78" text-anchor="middle">QWERTY</text>
      <text class="ink-label" x="200" y="212" text-anchor="middle">FIG. 02  ·  FOUNTAIN / KEYS</text>
    </svg>

    <!-- CREATIVE: cyberpunk signal -->
    <svg v-else-if="kind === 'creative'" class="ink-diagram" viewBox="0 0 400 220" fill="none">
      <path class="ink-draw" d="M14 34V14h20" />
      <path class="ink-draw" d="M386 34V14h-20" />
      <path class="ink-draw" d="M14 186v20h20" />
      <path class="ink-draw" d="M386 186v20h-20" />

      <path class="ink-draw" :d="circle(86, 56, 26)" />
      <path class="ink-draw" d="M24 152h148" />

      <!-- skyline -->
      <path class="ink-draw" d="M30 152V118h14v34" />
      <path class="ink-draw" d="M46 152V96h16v56" />
      <path class="ink-draw" d="M50 104h8M50 112h8" />
      <path class="ink-draw" d="M64 152V128h12v24" />
      <path class="ink-draw" d="M78 152V82h20v70" />
      <path class="ink-draw" d="M84 90h8M84 98h8M84 106h8" />
      <path class="ink-draw" d="M88 82V64" />
      <path class="ink-draw" d="M100 152V110h14v42" />
      <path class="ink-draw" d="M116 152V74h12v78" />
      <path class="ink-draw" d="M130 152V124h22v28" />
      <path class="ink-draw" d="M136 132h10M136 140h10" />

      <!-- helmet / visor -->
      <path class="ink-draw" :d="circle(248, 86, 28)" />
      <path class="ink-draw" d="M224 78h50c6 0 10 6 8 12l-8 10H226l-8-10c-2-6 2-12 6-12z" />
      <path class="ink-draw" d="M228 90h44" />
      <path class="ink-draw" d="M270 108c10 8 18 22 18 36" />
      <path class="ink-draw" d="M288 144h36v8h-8v14h-14v-14h-14z" />

      <!-- circuit deck -->
      <path class="ink-draw" d="M186 132h56v34h-56z" />
      <path class="ink-draw" d="M194 140h40M194 148h28M194 156h34" />
      <path class="ink-draw" d="M242 150h28v-18h36" />
      <path class="ink-draw" d="M306 132v36h40" />
      <path class="ink-draw" :d="circle(242, 150, 3)" />
      <path class="ink-draw" :d="circle(306, 132, 3)" />
      <path class="ink-draw" :d="circle(346, 168, 3)" />

      <!-- floor grid -->
      <path class="ink-draw" d="M24 170h352" />
      <path class="ink-draw" d="M56 170l-14 26" />
      <path class="ink-draw" d="M118 170l-6 26" />
      <path class="ink-draw" d="M200 170v26" />
      <path class="ink-draw" d="M282 170l6 26" />
      <path class="ink-draw" d="M344 170l14 26" />

      <path class="ink-ray" d="M270 108c10 8 18 22 18 36" />
      <path class="ink-ray" d="M242 150h64" />
      <path class="ink-ray" d="M306 132v36" />

      <text class="ink-label" x="200" y="34" text-anchor="middle">SIGNAL</text>
      <text class="ink-label" x="86" y="60" text-anchor="middle">2084</text>
      <text class="ink-label" x="330" y="124">NET</text>
      <text class="ink-label" x="200" y="212" text-anchor="middle">FIG. 03  ·  CITY / JACK</text>
    </svg>

    <!-- PROJECTS: modules + graph -->
    <svg v-else-if="kind === 'projects'" class="ink-diagram" viewBox="0 0 400 220" fill="none">
      <path class="ink-draw" d="M14 34V14h20" />
      <path class="ink-draw" d="M386 34V14h-20" />
      <path class="ink-draw" d="M14 186v20h20" />
      <path class="ink-draw" d="M386 186v20h-20" />

      <path class="ink-draw" d="M36 56h150v78H36z" />
      <path class="ink-draw" d="M36 56h150v16H36z" />
      <path class="ink-draw" :d="circle(48, 64, 3)" />
      <path class="ink-draw" :d="circle(60, 64, 3)" />
      <path class="ink-draw" d="M48 88h90M48 100h70M48 112h110" />

      <path class="ink-draw" d="M72 108h150v78H72z" />
      <path class="ink-draw" d="M72 108h150v16H72z" />
      <path class="ink-draw" :d="circle(84, 116, 3)" />
      <path class="ink-draw" :d="circle(96, 116, 3)" />
      <path class="ink-draw" d="M88 142h80M88 154h100M88 166h54" />

      <!-- git graph -->
      <path class="ink-draw" d="M268 60v120" />
      <path class="ink-draw" d="M268 100c0-20 40-20 40 0v36c0 20-40 20-40 0" />
      <path class="ink-draw" :d="circle(268, 60, 5)" />
      <path class="ink-draw" :d="circle(268, 100, 5)" />
      <path class="ink-draw" :d="circle(308, 118, 5)" />
      <path class="ink-draw" :d="circle(268, 136, 5)" />
      <path class="ink-draw" :d="circle(268, 180, 5)" />

      <g ref="spin" class="ink-spin">
        <path class="ink-draw" :d="gearD(348, 70, 8, 18, 12)" />
        <path class="ink-draw" :d="circle(348, 70, 5)" />
      </g>

      <text class="ink-label" x="200" y="34" text-anchor="middle">BUILD</text>
      <text class="ink-label" x="111" y="68" text-anchor="middle">REPO</text>
      <text class="ink-label" x="268" y="48" text-anchor="middle">main</text>
      <text class="ink-label" x="200" y="212" text-anchor="middle">FIG. 04  ·  MODULES / GRAPH</text>
    </svg>

    <!-- ABOUT: compass / self -->
    <svg v-else-if="kind === 'about'" class="ink-diagram" viewBox="0 0 400 220" fill="none">
      <path class="ink-draw" d="M14 34V14h20" />
      <path class="ink-draw" d="M386 34V14h-20" />
      <path class="ink-draw" d="M14 186v20h20" />
      <path class="ink-draw" d="M386 186v20h-20" />

      <path class="ink-draw" :d="circle(200, 112, 62)" />
      <path class="ink-draw" :d="circle(200, 112, 44)" />
      <path class="ink-draw" d="M200 50v20M200 154v20M138 112h20M242 112h20" />
      <path class="ink-draw" d="M200 70l8 34-8 8-8-8z" />
      <path class="ink-draw" d="M200 154l-6-28 6-6 6 6z" />
      <path class="ink-draw" d="M158 112h84" />
      <path class="ink-draw" :d="circle(200, 112, 6)" />

      <text class="ink-label" x="200" y="34" text-anchor="middle">SELF</text>
      <text class="ink-label" x="200" y="48" text-anchor="middle">N</text>
      <text class="ink-label" x="268" y="116">E</text>
      <text class="ink-label" x="200" y="184" text-anchor="middle">S</text>
      <text class="ink-label" x="132" y="116" text-anchor="end">W</text>
      <text class="ink-label" x="200" y="212" text-anchor="middle">FIG. 05  ·  TRUE NORTH</text>
    </svg>
  </div>
</template>

<script>
import { animate, createTimeline, drawLines, drawable, prefersReducedMotion, stagger } from '/src/lib/motion.js';

function circle(cx, cy, r) {
  return `M ${cx - r} ${cy} a ${r} ${r} 0 1 0 ${r * 2} 0 a ${r} ${r} 0 1 0 ${-r * 2} 0`;
}

function gearD(cx, cy, teeth, tip, root) {
  const da = (Math.PI * 2) / teeth;
  const pts = [];
  for (let i = 0; i < teeth; i++) {
    const a0 = i * da - Math.PI / 2;
    const a1 = a0 + da * 0.22;
    const a2 = a0 + da * 0.78;
    const a3 = a0 + da;
    pts.push(
      [cx + Math.cos(a0) * root, cy + Math.sin(a0) * root],
      [cx + Math.cos(a1) * tip, cy + Math.sin(a1) * tip],
      [cx + Math.cos(a2) * tip, cy + Math.sin(a2) * tip],
      [cx + Math.cos(a3) * root, cy + Math.sin(a3) * root],
    );
  }
  return pts.map((p, i) => `${i === 0 ? 'M' : 'L'}${p[0].toFixed(2)} ${p[1].toFixed(2)}`).join(' ') + 'Z';
}

export default {
  name: 'InkDiagram',
  props: {
    kind: {
      type: String,
      required: true,
    },
  },
  methods: { circle, gearD },
  computed: {
    writingKeys() {
      const rows = [
        { y: 98, n: 10, x: 206, w: 14, g: 3 },
        { y: 118, n: 9, x: 214, w: 14, g: 3 },
        { y: 138, n: 8, x: 222, w: 14, g: 3 },
      ];
      const keys = [];
      rows.forEach((r) => {
        for (let i = 0; i < r.n; i += 1) {
          keys.push({ x: r.x + i * (r.w + r.g), y: r.y, w: r.w, h: 14 });
        }
      });
      keys.push({ x: 236, y: 158, w: 86, h: 14 });
      return keys;
    },
  },
  mounted() {
    const root = this.$refs.root;
    if (!root) return;
    this._anims = [];

    const draw = drawLines(root, '.ink-draw', { duration: 980, stagger: 22 });
    if (draw) this._anims.push(draw);

    const labels = root.querySelectorAll('.ink-label');
    if (labels.length && !prefersReducedMotion()) {
      this._anims.push(animate(labels, {
        opacity: [0, 1],
        delay: stagger(36, { start: 520 }),
        duration: 360,
        ease: 'out(2)',
      }));
    } else {
      labels.forEach((el) => { el.style.opacity = '1'; });
    }

    const rays = drawable(root.querySelectorAll('.ink-ray'));
    if (rays.length && !prefersReducedMotion()) {
      this._anims.push(createTimeline({ defaults: { ease: 'inOut(3)' } }).add(rays, {
        draw: ['0 0', '0 1', '1 1'],
        duration: 2400,
        delay: stagger(140),
        loop: true,
      }));
    }

    if (this.$refs.spin && !prefersReducedMotion()) {
      this._anims.push(animate(this.$refs.spin, {
        rotate: 360,
        duration: 16000,
        ease: 'linear',
        loop: true,
      }));
    }
  },
  beforeUnmount() {
    (this._anims || []).forEach((a) => {
      try { a.pause?.(); } catch (e) { /* noop */ }
    });
  },
};
</script>

<style scoped>
.ink-diagram-wrap {
  width: 100%;
  max-width: 100%;
  min-width: 0;
  color: var(--fg);
  pointer-events: none;
  user-select: none;
}

.ink-diagram {
  display: block;
  width: 100%;
  max-width: 100%;
  height: auto;
  overflow: visible;
}

.ink-draw,
.ink-ray {
  fill: none;
  stroke: currentColor;
  stroke-width: 1.35;
  stroke-linecap: round;
  stroke-linejoin: round;
}

.ink-ray {
  stroke-width: 1.1;
  opacity: 0.55;
}

.ink-label {
  fill: currentColor;
  stroke: none;
  font-family: var(--font-mono);
  font-size: 8px;
  letter-spacing: 0.16em;
  opacity: 0;
}

.ink-spin {
  transform-box: fill-box;
  transform-origin: center;
}
</style>
