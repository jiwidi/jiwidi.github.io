<template>
    <nav class="category-grid" aria-label="Photo categories">
      <router-link
        v-for="category in categories"
        :key="category.name"
        :to="category.link"
        class="category-card"
        @pointerenter="warm(category)"
        @focus="warm(category)"
      >
        <span class="category-frame">
          <img
            :src="category.image"
            :alt="category.name + ' photos'"
            class="category-image"
            decoding="async"
          >
        </span>
        <span class="category-name">
          <span>{{ category.name }}</span>
          <span class="category-arrow" aria-hidden="true">→</span>
        </span>
      </router-link>
    </nav>
  </template>

<script>
import { photoCategories } from '/src/lib/siteContent.js';
import { prefetchSectionThumbs } from '/src/lib/prefetch.js';

export default {
    name: 'CategoryGrid',
    data() {
        return {
            categories: photoCategories,
            warmed: {},
        };
    },
    methods: {
        // Hovering a card warms that section's gallery thumbnails so the
        // category page paints instantly on click.
        warm(category) {
            const section = category.link.split('/').pop();
            if (this.warmed[section]) return;
            this.warmed = { ...this.warmed, [section]: true };
            prefetchSectionThumbs(section);
        },
    },
};
</script>
