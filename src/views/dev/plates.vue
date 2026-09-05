<template>
  <article class="plate-gallery">
    <h1>Ink plates</h1>
    <p>Dev-only proof sheet — every figure at review size.</p>
    <section v-for="kind in kinds" :key="kind" class="plate-gallery__row">
      <h2>{{ kind }}</h2>
      <InkDiagram :kind="kind" />
    </section>
  </article>
</template>

<script>
import InkDiagram from '/src/components/ink/InkDiagram.vue';

export default {
  name: 'PlateGallery',
  components: { InkDiagram },
  data() {
    return { kinds: ['photography', 'writing', 'creative', 'projects', 'about'] };
  },
};
</script>

<style scoped>
.plate-gallery__row {
  margin: 2.4em 0;
  border-top: 1px dotted var(--rule_soft);
  padding-top: 1em;
}

.plate-gallery__row h2 {
  font-family: var(--font-mono);
  font-size: 0.8em;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  opacity: 0.6;
  margin: 0 0 0.8em;
}

.plate-gallery__row :deep(.ink-plate) {
  max-width: 620px;
}
</style>
