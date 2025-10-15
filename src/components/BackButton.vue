<template>
  <div class="back-button-container">
    <hr />
    <router-link to="/" class="back-button">
      <div class="arrow_back_icon"></div>
    </router-link>
  </div>
</template>

<script>
export default {
  name: 'BackButton',
};
</script>

<style scoped>
.back-button-container {
  margin-top: 1rem;
}

.back-button {
  display: inline-flex;
  align-items: center;
  text-decoration: none;
  color: var(--fg);
  padding: 0.5rem 0;
}

.arrow_back_icon {
  margin-right: 0.5rem;
  background: url("path-to-back-arrow-icon.png") no-repeat center center;
  display: inline-block;
  width: 24px;
  height: 24px;
}

.arrow_back_icon::before {
  content: "←";
  font-size: 24px;
  display: block;
}
</style>
