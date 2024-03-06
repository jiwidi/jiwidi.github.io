<template>
    <div id="app">
      <Navbar />
      <router-view />
    </div>

    <SpeedInsights />

  </template>

<script>
import Navbar from './components/Navbar.vue';
import { inject } from '@vercel/analytics';
import { injectSpeedInsights } from '@vercel/speed-insights';
inject();
injectSpeedInsights();


export default {
    name: 'App',
    components: {
        Navbar
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
</style>
