<template>
    <div id="app">
      <Navbar />
      <router-view />
    </div>
  </template>

<script>
import Navbar from './components/Navbar.vue';
// import { init } from '@vercel/analytics';

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
