<template>
  <div class="photo-index">
    <nav class="category-grid" aria-label="Photo categories">
      <router-link
        v-for="(category, index) in categories"
        :key="category.slug"
        :to="category.link"
        class="category-card"
        :class="`is-${category.size}`"
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
          <span class="category-title">
            <span class="category-num">{{ formatNum(index) }}</span>
            <span>{{ category.name }}</span>
          </span>
          <span class="category-count">
            <span>{{ countFor(category) }}</span>
            <span class="category-arrow" aria-hidden="true">→</span>
          </span>
        </span>
      </router-link>
    </nav>
  </div>
</template>

<script>
import { photoCategories } from '/src/lib/siteContent.js';
import imageDictionary from '/src/assets/imageDictionary.json';
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
        countFor(category) {
            return (imageDictionary[category.slug] || []).length;
        },
        formatNum(index) {
            return String(index + 1).padStart(2, '0');
        },
        // Hovering a card warms that section's gallery thumbnails so the
        // category page paints instantly on click.
        warm(category) {
            if (this.warmed[category.slug]) return;
            this.warmed = { ...this.warmed, [category.slug]: true };
            prefetchSectionThumbs(category.slug);
        },
    },
};
</script>
