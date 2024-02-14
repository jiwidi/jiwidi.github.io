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
import { SpeedInsights } from "@vercel/speed-insights/next"
inject();


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
