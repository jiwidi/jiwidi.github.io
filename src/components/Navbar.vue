<template>
  <nav class="topnav" aria-label="path">
    <span class="crumbs">
      <router-link to="/">//jaime</router-link>
      <template v-for="(segment, index) in pathSegments" :key="index">
        <span class="sep">/</span>
        <router-link :to="getPathUpToSegment(index)">{{ segment }}</router-link>
      </template>
      <span>:</span>
      <span class="blink_me">_</span>
    </span>

    <span class="right">
      <router-link
        v-if="pathSegments.length > 0"
        :to="parentPath"
        class="back-btn"
      >← back</router-link>
      <button class="theme-btn term-btn" type="button" @click="onToggleTerminal">
        {{ terminalLabel }}
      </button>
      <button class="theme-btn" type="button" @click="toggleTheme">
        {{ themeLabel }}
      </button>
    </span>
  </nav>
</template>

<script>
import { terminalState, toggleTerminal } from '/src/lib/terminalMode.js';

export default {
  name: 'Navbar',
  data() {
    return {
      theme: 'light',
      terminalState,
    };
  },
  computed: {
    pathSegments() {
      return this.$route.path.split('/').filter(Boolean);
    },
    parentPath() {
      if (this.pathSegments.length <= 1) return '/';
      return '/' + this.pathSegments.slice(0, -1).join('/');
    },
    themeLabel() {
      return this.theme === 'dark' ? '☼ light' : '☾ dark';
    },
    terminalLabel() {
      return this.terminalState.active ? '× tui' : '> tui';
    },
  },
  methods: {
    getPathUpToSegment(index) {
      return '/' + this.pathSegments.slice(0, index + 1).join('/');
    },
    applyTheme(t) {
      this.theme = t;
      document.documentElement.setAttribute('data-theme', t);
      try { localStorage.setItem('theme', t); } catch (e) { /* noop */ }
    },
    toggleTheme() {
      this.applyTheme(this.theme === 'dark' ? 'light' : 'dark');
    },
    onToggleTerminal() {
      toggleTerminal();
    },
  },
  mounted() {
    let saved = 'light';
    try { saved = localStorage.getItem('theme') || 'light'; } catch (e) { /* noop */ }
    this.applyTheme(saved);
  },
};
</script>
