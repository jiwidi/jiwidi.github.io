<template>
    <div class="home-container">
      <main class="shadowPlus4">
        <article>
          <h1>Things I have written</h1>
          <p>A mix of opinions, papers and notes.</p>
        </article>
        <listDisplay :listItems="writings" />
      </main>
    </div>
  </template>

<script>
import listDisplay from '/src/components/listDisplay.vue';
import { writings } from '/src/lib/siteContent.js';

export default {
    name: 'Writing',
    components: {
        listDisplay
    },
    data() {
        return {
            writings,
        };
    },
};
</script>
