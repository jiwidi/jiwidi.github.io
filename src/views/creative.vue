<template>
  <article class="page-hero">
    <div class="page-copy">
      <h1>Creative stuff</h1>
      <p>Storage for creative stuff.</p>
    </div>
    <InkDiagram kind="creative" />
  </article>
  <listDisplay :listItems="creativeItems" />
</template>

<script>
import listDisplay from '/src/components/listDisplay.vue';
import InkDiagram from '/src/components/InkDiagram.vue';
import { creativeItems } from '/src/lib/siteContent.js';

export default {
  name: 'Creative',
  components: {
    listDisplay,
    InkDiagram,
  },
  data() {
    return {
      creativeItems,
    };
  },
};
</script>
