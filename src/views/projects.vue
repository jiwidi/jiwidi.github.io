<template>
  <article class="page-hero">
    <div class="page-copy">
      <h1>My Projects</h1>
      <p>A collection of my personal and professional projects.</p>
    </div>
    <InkDiagram kind="projects" />
  </article>
  <listDisplay :listItems="projectItems" />
</template>

<script>
import listDisplay from '/src/components/listDisplay.vue';
import InkDiagram from '/src/components/InkDiagram.vue';
import { projects } from '/src/lib/siteContent.js';

export default {
  name: 'Projects',
  components: {
    listDisplay,
    InkDiagram,
  },
  data() {
    return {
      projectItems: projects,
    };
  },
};
</script>
