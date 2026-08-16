<template>
  <article class="page-hero">
    <div class="page-copy">
      <h1>Hello there!</h1>
      <p>I'm <router-link to="/about" class="abold">{Jaime}</router-link> a
        <s>data scientist, engineer, geek</s> who likes to build stuff at the computer. Apart from coding my interests include photography, snow sports and cycling.</p>
      <p>I'm currently building <a href="https://ecomid.com" target="_blank" rel="noopener" class="abold">eComID</a> as co-founder and head of AI.</p>
    </div>
    <InkDiagram kind="home" />
  </article>
  <listDisplay :listItems="pages" :numbered="true" />
</template>

<script>
import listDisplay from '/src/components/listDisplay.vue';
import InkDiagram from '/src/components/InkDiagram.vue';
import { homePages } from '/src/lib/siteContent.js';

export default {
  name: 'Home',
  components: {
    listDisplay,
    InkDiagram,
  },
  data() {
    return {
      pages: homePages,
    };
  },
};
</script>
