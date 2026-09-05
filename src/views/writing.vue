<template>
  <article class="page-hero">
    <div class="page-copy">
      <h1>Things I have written</h1>
      <p>A mix of opinions, papers and notes.</p>
    </div>
    <InkDiagram kind="writing" />
  </article>
  <listDisplay :listItems="writings" />
</template>

<script>
import listDisplay from '/src/components/listDisplay.vue';
import InkDiagram from '/src/components/ink/InkDiagram.vue';
import { writings } from '/src/lib/siteContent.js';

export default {
  name: 'Writing',
  components: {
    listDisplay,
    InkDiagram,
  },
  data() {
    return {
      writings,
    };
  },
};
</script>
