<template>
  <nav class="articles-list" aria-label="Directory">
    <component
      v-for="(item, index) in listItems"
      :key="item.title"
      :is="getLinkComponent(item.link)"
      v-bind="isExternal(item.link)
        ? { href: item.link, target: '_blank', rel: 'noopener' }
        : { to: item.link }"
      class="row"
      ref="rows"
      :style="{ '--row-index': index }"
    >
      <span class="l">
        <span v-if="showIco(item, index)" class="ico">{{ formatIco(item, index) }}</span>
        <span class="name">{{ item.title }}</span>
      </span>
      <span class="l" style="gap: 14px">
        <span v-if="item.description" class="meta">{{ item.description }}</span>
        <span v-if="item.date" class="date">{{ item.date }}</span>
        <span class="arrow" aria-hidden="true">{{ isExternal(item.link) ? '↗' : '→' }}</span>
      </span>
    </component>
  </nav>
</template>

<script>
import { mountPointerMotion } from '/src/lib/pointerMotion.js';

export default {
  name: 'listDisplay',
  props: {
    listItems: {
      type: Array,
      required: true,
    },
    numbered: {
      type: Boolean,
      default: false,
    },
  },
  mounted() {
    this.pointerMotions = (this.$refs.rows || []).map((row) => mountPointerMotion(row.$el || row));
  },
  beforeUnmount() {
    this.pointerMotions?.forEach((motion) => motion.destroy());
  },
  methods: {
    isExternal(link) {
      return /^(https?:|mailto:|tel:)/.test(link || '');
    },
    getLinkComponent(link) {
      return this.isExternal(link) ? 'a' : 'router-link';
    },
    showIco(item, index) {
      return this.numbered || (item.icoLabel != null);
    },
    formatIco(item, index) {
      if (item.icoLabel != null) return item.icoLabel;
      return String(index + 1).padStart(2, '0');
    },
  },
};
</script>
