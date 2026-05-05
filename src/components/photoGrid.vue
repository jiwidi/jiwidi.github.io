<template>
    <div class="category-grid">
      <div class="category-card" v-for="category in categories" :key="category.name" @click="goToCategory(category.link)">
        <img :src="category.image" :alt="category.name" class="category-image">
        <div class="category-name">{{ category.name }}</div>
      </div>
    </div>
  </template>

<script>
import { photoCategories } from '/src/lib/siteContent.js';

export default {
    name: 'CategoryGrid',
    data() {
        return {
            categories: photoCategories,
        };
    },
    methods: {
        goToCategory(link) {
            this.$router.push(link);
        }
    }
};
</script>
