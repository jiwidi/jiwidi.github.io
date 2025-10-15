<template>
    <div id="app">
      <LoadingBar />
      <Navbar />
      <router-view v-slot="{ Component, route }">
        <transition name="fade" mode="out-in">
          <component :is="Component" :key="route.path" />
        </transition>
      </router-view>
    </div>

    <SpeedInsights />

  </template>

<script>
import Navbar from './components/Navbar.vue';
import LoadingBar from './components/LoadingBar.vue';
import { inject } from '@vercel/analytics';
import { injectSpeedInsights } from '@vercel/speed-insights';
inject();
injectSpeedInsights();


export default {
    name: 'App',
    components: {
        Navbar,
        LoadingBar
    },
    metaInfo: {
        title: 'Jaime Ferrando Huertas - Personal Page',
        meta: [
            {
                name: 'description',
                content: 'Personal portfolio of Your Name showcasing projects, skills, and professional experience in web development.' // Tailor this description to match your professional focus
            },
            {
                name: 'keywords',
                content: 'personal portfolio, Your Name, web development, projects, professional experience, skills' // Customize these keywords to match your skills and focus areas
            },
            { name: 'viewport', content: 'width=device-width, initial-scale=1' },
            { name: 'robots', content: 'index, follow' },
            { name: 'author', content: 'https://github.com/jiwidi' },
            { rel: 'canonical', href: 'https://www.imjai.me/' },
        ]
    },
};
</script>

<style>
/* Global styles */

/* Fade transition */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.15s ease;
}

.fade-enter-from {
  opacity: 0;
}

.fade-leave-to {
  opacity: 0;
}

.fade-enter-to,
.fade-leave-from {
  opacity: 1;
}
</style>
