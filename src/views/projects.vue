<template>
    <div class="projects-container">
      <main class="shadowPlus4">
        <article>
          <h1>My Projects</h1>
          <p>A collection of my personal and professional projects.</p>
        </article>
        <listDisplay :listItems="projectItems" />
      </main>
    </div>
  </template>

<script>
import listDisplay from '/src/components/listDisplay.vue';
import { projects } from '/src/lib/siteContent.js';

export default {
    name: 'Projects',
    components: {
        listDisplay
    },
    data() {
        return {
            projectItems: projects,
        };
    },
};
</script>

<style>
.projects-container {
}

.shadowPlus4 {
}
</style>
