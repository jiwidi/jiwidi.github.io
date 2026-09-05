<template>
  <g class="ink-caption">
    <text class="ink-label ink-label--title" :x="midX" :y="titleY" text-anchor="middle">
      {{ title }}
    </text>
    <text class="ink-label ink-label--caption" :x="midX" :y="captionY" text-anchor="middle">
      FIG. {{ fig }} · {{ caption }}
    </text>
  </g>
</template>

<script>
export default {
  name: 'PlateCaption',
  props: {
    title: { type: String, required: true },
    fig: { type: String, required: true },
    caption: { type: String, required: true },
    /* Plate viewBox as [x, y, w, h] — the caption centres on it. */
    box: { type: Array, required: true },
    titleY: { type: Number, required: true },
    captionY: { type: Number, required: true },
  },
  computed: {
    midX() {
      return this.box[0] + this.box[2] / 2;
    },
  },
};
</script>
