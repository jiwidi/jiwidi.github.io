<template>
  <div class="about-container">
    <main class="shadowPlus4">
      <article class="about-article">
        <div>
          <h1>About me</h1>
          <p>I was born in Spain and have been tinkering with computers since I was 8 years old.</p>

          <h2>Life principles</h2>
          <p>— Be kind.</p>
          <p>— Being normal is overrated.</p>
          <p>— I care about what people make, not what they own.</p>

          <h2>Quotes I resonate with</h2>
          <p>— Above all, don't lie to yourself.</p>
          <p>— If nothing happens, nothing happens.</p>
          <p>— Those who cannot remember the past are condemned to repeat it.</p>
          <p>— Do not get stuck in the past.</p>
          <p>— Fear is the greatest teacher, and I'm not skipping class.</p>
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
        </div>
      </article>
      <listDisplay :listItems="pages" />
    </main>
  </div>
</template>

<script>
import listDisplay from '/src/components/listDisplay.vue';

export default {
  name: 'About',
  components: {
    listDisplay,
  },
  methods: {
    toggleTheme() {
    },
  },
  data() {
    return {
      spoilerOpen: false,
      pages: [
        {
          title: 'Curriculum Vitae',
          description: 'pdf · github',
          link: 'https://github.com/jiwidi/CurriculumVitae/blob/master/JaimeFerrandoHuertas_CV.pdf',
        },
      ],
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

