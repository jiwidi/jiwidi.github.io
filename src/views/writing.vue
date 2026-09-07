<template>
  <article class="page-hero">
    <div class="page-copy">
      <h1>Things I have written</h1>
      <p>A mix of opinions, papers and notes.</p>
    </div>
    <WritingDesk />
  </article>
  <listDisplay :listItems="writings" />
</template>

<script>
import listDisplay from '/src/components/listDisplay.vue';
import WritingDesk from '/src/components/ink/WritingDesk.vue';
import { writings } from '/src/lib/siteContent.js';

export default {
  name: 'Writing',
  components: {
    listDisplay,
    WritingDesk,
  },
  data() {
    return {
      writings,
    };
  },
};
</script>
