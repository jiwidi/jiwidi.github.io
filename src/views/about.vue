<template>
      <article class="about-article">
        <div>
          <h1>About me</h1>
          <p>I was born in Spain and have been tinkering with computers since I was 8 years old.</p>

          <h2>Life principles</h2>
          <p>— Be honest with yourself, first.</p>
          <p>— Be kind.</p>
          <p>— There's no prize for blending in.</p>
          <p>— What you do means more than what you say or own.</p>

          <h2>Quotes I resonate with</h2>
          <p>— If nothing happens, nothing happens.</p>
          <p>— Those who cannot remember the past are condemned to repeat it.</p>
          <p>— Learn from it. Don't live in it.</p>
          <p>— Fear is a teacher worth showing up for.</p>
          <p>
            — There is a battle of two wolves: one represents despair and darkness,
            the other hope and light. Which one wins?
            <button
              type="button"
              class="spoiler"
              :class="{ 'is-open': spoilerOpen }"
              :aria-expanded="spoilerOpen"
              :aria-label="spoilerOpen ? 'Hide spoiler' : 'Reveal spoiler'"
              @click="spoilerOpen = !spoilerOpen"
            >
              <span class="spoiler-text">The one you feed.</span>
            </button>
          </p>
        </div>

        <div class="about-image">
          <img src="/src/assets/img/about/author_feroe.jpeg" />
          <InkDiagram kind="about" />
        </div>
      </article>
      <listDisplay :listItems="pages" />
</template>

<script>
import listDisplay from '/src/components/listDisplay.vue';
import InkDiagram from '/src/components/InkDiagram.vue';
import { aboutPages } from '/src/lib/siteContent.js';

export default {
  name: 'About',
  components: {
    listDisplay,
    InkDiagram,
  },
  methods: {
    toggleTheme() {
    },
  },
  data() {
    return {
      spoilerOpen: false,
      pages: aboutPages,
    };
  },
};
</script>

<style scoped>
.spoiler {
  display: inline-flex;
  align-items: baseline;
  gap: 4px;
  padding: 0 6px;
  margin: 0 1px;
  border: 0;
  font: inherit;
  cursor: pointer;
  background: var(--fg);
  color: var(--fg);
  border-radius: 2px;
  transition: background 0.18s ease, color 0.18s ease;
  position: relative;
  text-align: left;
}

.spoiler::after {
  content: "▸ reveal";
  font-family: var(--font-mono);
  font-size: 0.72em;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--bg);
  margin-left: 6px;
  opacity: 0.85;
  transition: opacity 0.18s ease;
}

.spoiler .spoiler-text {
  user-select: none;
  filter: blur(5px);
  transition: filter 0.18s ease;
}

.spoiler:hover {
  background: var(--bg);
  color: var(--bg);
  outline: 1px dashed var(--fg);
  outline-offset: -1px;
}

.spoiler:hover::after {
  color: var(--fg);
}

.spoiler.is-open {
  background: transparent;
  color: var(--fg);
  outline: 0;
}

.spoiler.is-open::after { display: none; }

.spoiler.is-open .spoiler-text {
  user-select: text;
  filter: none;
}
</style>

