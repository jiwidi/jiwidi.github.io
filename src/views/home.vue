<template>
  <article class="page-intro">
    <div class="page-copy">
      <h1>Hello there<span class="accent">!</span></h1>
      <p class="intro-lead">I'm <router-link to="/about" class="abold">{Jaime}</router-link> a
        <s>data scientist, engineer, geek</s> who likes to build stuff at the computer. Apart from coding my interests include photography, snow sports and cycling.</p>
      <p class="current-work"><span class="status-dot" aria-hidden="true"></span><span>I'm currently building <a href="https://ecomid.com" target="_blank" rel="noopener" class="abold">eComID</a> as co-founder and head of AI.</span></p>
    </div>
    <LandingBirds class="home-birds" />
  </article>
  <listDisplay :listItems="pages" :numbered="true" class="home-directory" />
</template>

<script>
import listDisplay from '/src/components/listDisplay.vue';
import { homePages } from '/src/lib/siteContent.js';
import LandingBirds from '/src/components/ink/LandingBirds.vue';

export default {
  name: 'Home',
  components: {
    listDisplay,
    LandingBirds,
  },
  data() {
    return {
      pages: homePages,
    };
  },
};
</script>

<style scoped>
.page-intro {
  position: relative;
  display: grid;
  grid-template-columns: minmax(0, 2.2fr) minmax(180px, 1fr);
  align-items: center;
  gap: 26px;
}
.home-birds { max-width: 286px; justify-self: end; }
@media (max-width: 760px) {
  .page-intro { display: block; }
  .home-birds { position: absolute; top: 21px; right: var(--gutter); width: 92px; }
  .page-intro h1 { padding-right: 100px; }
}
@media (max-width: 380px) {
  .home-birds { top: 24px; width: 73px; }
  .page-intro h1 { padding-right: 80px; font-size: clamp(2rem, 10.5vw, 2.5rem); }
}
</style>
