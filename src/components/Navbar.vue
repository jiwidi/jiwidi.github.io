<template>
  <nav class="topnav" aria-label="path">
    <span class="crumbs">
      <router-link to="/">//jaime</router-link>
      <template v-for="(segment, index) in pathSegments" :key="index">
        <span class="sep">/</span>
        <router-link :to="getPathUpToSegment(index)">{{ segment }}</router-link>
      </template>
      <template v-for="(segment, index) in cliCrumbs" :key="'cli-' + index">
        <span class="sep">/</span>
        <span class="crumb-cli">{{ segment }}</span>
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
    cliCrumbs() {
      // When the terminal has a side preview open, append its path
      // segments as dim crumbs so the topnav reflects what's on screen.
      const p = this.terminalState.previewPath;
      if (!this.terminalState.active || !p) return [];
      const previewSegs = p.split('/').filter(Boolean);
      // Skip segments already covered by the route (cd writing on /writing).
      const route = new Set(this.pathSegments);
      return previewSegs.filter((s) => !route.has(s));
    },
    parentPath() {
      if (this.pathSegments.length <= 1) return '/';
      return '/' + this.pathSegments.slice(0, -1).join('/');
    },
    themeLabel() {
      return this.theme === 'dark' ? '☼ light' : '☾ dark';
    },
    terminalLabel() {
      return this.terminalState.active ? '× cli' : '> cli';
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
