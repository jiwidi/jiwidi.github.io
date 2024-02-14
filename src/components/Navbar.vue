<template>
    <div class="topnav">
      <span>
        <router-link to="/">//jaime</router-link>
        <span v-for="(segment, index) in pathSegments" :key="index">
          <span v-if="index > 0"></span>
          <router-link :to="getPathUpToSegment(index)">
            /{{ segment }}
          </router-link>
        </span>:
        <span class="blink_me">_</span>
      <ThemeToggle />
      </span>
      <ThemeToggle />
    </div>
  </template>

<script>
import ThemeToggle from './themeToggle.vue';

export default {
    components: {
        ThemeToggle
    },
    computed: {
        pathSegments() {
            // Split the current path into segments
            return this.$route.path.split('/').filter(Boolean);
        },
    },
    methods: {
        getPathUpToSegment(index) {
            // Generate the path up to the clicked segment
            return '/' + this.pathSegments.slice(0, index + 1).join('/');
        },
    },
};
</script>

<style scoped>
.topnav {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

/* Rest of the styles */
</style>
