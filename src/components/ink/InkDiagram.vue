<template>
  <div
    ref="root"
    class="ink-plate"
    :class="{ 'ink-plate--compact': plate.compact }"
    aria-hidden="true"
  >
    <svg class="ink-plate__svg" :viewBox="plate.box.join(' ')" fill="none">
      <defs>
        <pattern
          :id="`ink-hatch-${uid}`"
          width="8"
          height="8"
          patternUnits="userSpaceOnUse"
          patternTransform="rotate(45)"
        >
          <line x1="0" y1="0" x2="0" y2="8" stroke="currentColor" stroke-width="0.8" />
        </pattern>
      </defs>

      <PlateCaption
        :title="plate.title"
        :fig="plate.fig"
        :caption="plate.caption"
        :box="plate.box"
        :title-y="plate.titleY"
        :caption-y="plate.captionY"
      />

      <component :is="plate.component" ref="body" :uid="uid" />
    </svg>
  </div>
</template>

<script>
import PlateCaption from './PlateCaption.vue';
import PhotographyPlate from './plates/PhotographyPlate.vue';
import WritingPlate from './plates/WritingPlate.vue';
import CreativePlate from './plates/CreativePlate.vue';
import ProjectsPlate from './plates/ProjectsPlate.vue';
import AboutPlate from './plates/AboutPlate.vue';
import { mountPlate } from '/src/lib/plateMotion.js';

/* Each `box` hugs its drawing, leaving only enough room above and below for
   the title and the figure caption. No frame, so no dead margin either. */
const PLATES = {
  photography: {
    component: PhotographyPlate,
    title: 'RANGEFINDER',
    fig: '01',
    caption: 'COINCIDENT IMAGE',
    box: [12, 6, 380, 228],
    titleY: 19,
    captionY: 227,
  },
  writing: {
    component: WritingPlate,
    title: 'INK & LINE',
    fig: '02',
    caption: 'NIB / STROKE',
    box: [8, 8, 376, 216],
    titleY: 21,
    captionY: 217,
  },
  creative: {
    component: CreativePlate,
    title: 'MOVEMENT',
    fig: '03',
    caption: 'CALIBRE',
    box: [31, 30, 357, 182],
    titleY: 42,
    captionY: 205,
  },
  projects: {
    component: ProjectsPlate,
    title: 'REPOSITORY',
    fig: '04',
    caption: 'COMMIT GRAPH',
    box: [12, 12, 372, 224],
    titleY: 25,
    captionY: 229,
  },
  about: {
    component: AboutPlate,
    title: 'ORIENTATION',
    fig: '05',
    caption: 'TRUE NORTH',
    box: [28, 16, 184, 226],
    titleY: 30,
    captionY: 235,
    compact: true,
  },
};

let seq = 0;

export default {
  name: 'InkDiagram',
  components: { PlateCaption },
  props: {
    kind: { type: String, required: true, validator: (v) => v in PLATES },
  },
  data() {
    seq += 1;
    return { uid: `p${seq}` };
  },
  computed: {
    plate() {
      return PLATES[this.kind];
    },
  },
  mounted() {
    this.motion = mountPlate(this.$refs.root, () => this.$refs.body?.ambient?.(this.$refs.root));
  },
  beforeUnmount() {
    this.motion?.destroy();
  },
};
</script>
