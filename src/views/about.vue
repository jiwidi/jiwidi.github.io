<template>
  <div class="about-container">
    <main class="shadowPlus4">
      <article class="about-article">
        <div>
          <h1>About me</h1>
          <div>
            I was born in Spain and have been tinkering with Computers since I was 8 years old.
            A few quotes I resonate with:
            <p>- Be kind.</p>
            <p>- Being normal is overrated.</p>
            <p>- I care about what people make, not what they own.</p>
          </div>
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
      pages: [
        {
          title: 'Curriculum Vitae',
          link: 'https://github.com/jiwidi/CurriculumVitae/blob/master/JaimeFerrandoHuertas_CV.pdf',
          icon: 'newspaper_icon',
        },
      ],
    };
  },
};
</script>

