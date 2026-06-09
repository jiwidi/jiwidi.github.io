<template>
  <div v-if="isLoading" class="loading-bar"></div>
</template>

<script>
// Route chunks are prefetched on idle, so navigation is normally instant.
// The bar only appears when a navigation genuinely stalls (cold chunk on a
// slow connection) — showing it on every click makes fast pages feel slow.
const SLOW_NAVIGATION_MS = 250;

export default {
  name: 'LoadingBar',
  data() {
    return {
      isLoading: false,
      showTimer: null,
    };
  },
  mounted() {
    const finish = () => {
      clearTimeout(this.showTimer);
      this.isLoading = false;
    };
    this.stopGuards = [
      this.$router.beforeEach((to, from, next) => {
        clearTimeout(this.showTimer);
        this.showTimer = setTimeout(() => {
          this.isLoading = true;
        }, SLOW_NAVIGATION_MS);
        next();
      }),
      this.$router.afterEach(finish),
      this.$router.onError(finish),
    ];
  },
  beforeUnmount() {
    clearTimeout(this.showTimer);
    (this.stopGuards || []).forEach((stop) => stop());
  },
};
</script>

<style scoped>
.loading-bar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: linear-gradient(
    90deg,
    var(--fg) 0%,
    var(--fg) 50%,
    transparent 50%,
    transparent 100%
  );
  background-size: 200% 100%;
  animation: loading 1s ease-in-out infinite;
  z-index: 9999;
}

@keyframes loading {
  0% {
    background-position: 200% 0;
  }
  100% {
    background-position: -200% 0;
  }
}
</style>
