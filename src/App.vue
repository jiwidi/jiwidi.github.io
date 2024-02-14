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
    }
};
</script>

<style>
/* Global styles */
</style>
