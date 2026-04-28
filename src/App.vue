<template>
  <div id="app">
    <LoadingBar />
    <Navbar />
    <router-view v-slot="{ Component, route }">
      <transition name="fade" mode="out-in">
        <component :is="Component" :key="route.path" />
      </transition>
    </router-view>
    <footer class="site-footer">
      <span>© {{ year }} jaime ferrando huertas</span>
      <span>
        <a href="https://github.com/jiwidi" target="_blank" rel="noopener">github</a>
        ·
        <a href="https://ecomid.com" target="_blank" rel="noopener">ecomid</a>
        ·
        <a href="mailto:hi@imjai.me">email</a>
      </span>
    </footer>
  </div>

  <SpeedInsights />
</template>

<script>
import Navbar from './components/Navbar.vue';
import LoadingBar from './components/LoadingBar.vue';
import { inject } from '@vercel/analytics';
import { injectSpeedInsights } from '@vercel/speed-insights';
import { startBackgroundPrefetch, prefetchAllSectionThumbs } from './lib/prefetch.js';
inject();
injectSpeedInsights();

export default {
  name: 'App',
  components: {
    Navbar,
    LoadingBar,
  },
  data() {
    return { year: new Date().getFullYear() };
  },
  mounted() {
    startBackgroundPrefetch();
    this.maybePrefetchPhotos(this.$route.path);
    this.$router.afterEach((to) => this.maybePrefetchPhotos(to.path));
  },
  methods: {
    maybePrefetchPhotos(path) {
      if (path === '/photography' && !this._prefetchedPhotos) {
        this._prefetchedPhotos = true;
        const idle = window.requestIdleCallback || ((cb) => setTimeout(cb, 600));
        idle(() => prefetchAllSectionThumbs(), { timeout: 3000 });
      }
    },
  },
  metaInfo: {
    title: '//jaime',
    meta: [
      { name: 'description', content: 'Personal site of Jaime Ferrando Huertas — projects, writing, photography and creative work.' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { name: 'robots', content: 'index, follow' },
      { name: 'author', content: 'https://github.com/jiwidi' },
      { rel: 'canonical', href: 'https://www.imjai.me/' },
    ],
  },
};
</script>
