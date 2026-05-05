<template>
    <div class="creative-container">
      <main class="shadowPlus4">
        <article>
          <h1>Creative stuff</h1>
          <p>Storage for creative stuff.</p>
        </article>
        <listDisplay :listItems="creativeItems" />
      </main>
    </div>
  </template>

<script>
import listDisplay from '/src/components/listDisplay.vue';
import { creativeItems } from '/src/lib/siteContent.js';

export default {
    name: 'Creative',
    components: {
        listDisplay
    },
    data() {
        return {
            creativeItems,
        };
    },

};
</script>

<style>
</style>
