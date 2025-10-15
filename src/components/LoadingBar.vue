<template>
  <div v-if="isLoading" class="loading-bar"></div>
</template>

<script>
export default {
  name: 'LoadingBar',
  data() {
    return {
      isLoading: false,
    };
  },
  mounted() {
    this.$router.beforeEach((to, from, next) => {
      this.isLoading = true;
      next();
    });

    this.$router.afterEach(() => {
      setTimeout(() => {
        this.isLoading = false;
      }, 200);
    });
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
