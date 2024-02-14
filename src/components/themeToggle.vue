<template>
    <button class="theme-toggle" @click="toggleTheme" :title="themeTitle" aria-label="auto" aria-live="polite">
      <svg class="sun-and-moon" width="20" height="20" viewBox="0 0 24 24">
        <mask class="moon" id="moon-mask">
          <rect x="0" y="0" width="100%" height="100%" fill="white"></rect>
          <circle cx="24" cy="10" r="6" fill="black"></circle>
        </mask>
        <circle class="sun" cx="12" cy="12" r="6" mask="url(#moon-mask)" :fill="currentColor"></circle>
      </svg>
    </button>
  </template>

<script>
export default {
    name: 'ThemeToggle',
    data() {
        return {
            theme: 'light', // default theme
        };
    },
    computed: {
        currentColor() {
            return this.theme === 'light' ? 'var(--color-dark)' : 'var(--color-light)';
        },
        themeTitle() {
            return `Toggles ${this.theme === 'light' ? 'dark' : 'light'} mode`;
        }
    },
    methods: {
        toggleTheme() {
            this.theme = this.theme === 'light' ? 'dark' : 'light';
            document.body.setAttribute('data-theme', this.theme);
            // Here you'd also want to save this preference, e.g., to localStorage
            localStorage.setItem('theme', this.theme);
        }
    },
    mounted() {
        // On mount, check if a theme is saved in localStorage and apply it
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme) {
            this.theme = savedTheme;
            document.body.setAttribute('data-theme', savedTheme);
        }
    }
};
</script>