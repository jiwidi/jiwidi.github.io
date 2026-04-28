<template>
    <div class="creative-container">
      <main class="shadowPlus4">
        <article>
          <h1>Creative stuff</h1>
          <p>Storage for creative stuff.</p>
        </article>
        <listDisplay :listItems="creativeItems" />
      </main>
    </div>
  </template>

<script>
import listDisplay from '/src/components/listDisplay.vue';

export default {
    name: 'Creative',
    components: {
        listDisplay
    },
    data() {
        return {
            creativeItems: [
                {
                    title: "The Mechanical Watch",
                    description: "ciechanow.ski",
                    link: "https://ciechanow.ski/mechanical-watch/",
                },
                {
                    title: "Forgotten Ideas of CS",
                    description: "pdf",
                    link: "https://codesync.global/uploads/media/default/0001/01/de7dfa6889612b31caf9ffa5b3377ee57be54cfd.pdf",
                },
                {
                    title: "The World Has Become Less Colorful",
                    description: "archdaily",
                    link: "https://www.archdaily.com/993197/is-the-world-less-colorful-highlighting-the-color-evolution-of-objects-and-spaces",
                },
                {
                    title: "Scapes",
                    description: "tumblr",
                    link: "https://futuretage.tumblr.com/",
                },
                {
                    title: "40 Questions",
                    description: "kepano",
                    link: "https://github.com/kepano/40-questions",
                },
                {
                    title: "Dracula Theme",
                    description: "draculatheme",
                    link: "https://draculatheme.com/",
                },
                {
                    title: "How Do Rangefinder Cameras Focus?",
                    description: "youtube",
                    link: "https://www.youtube.com/watch?v=4fuPYirmous",
                },
                {
                    title: "The Age of Average",
                    description: "alex murrell",
                    link: "https://www.alexmurrell.co.uk/articles/the-age-of-average",
                },
                {
                    title: "Tastiness of Watermelon",
                    description: "internal",
                    link: "/creative/watermelon",
                },
            ],
        };
    },

};
</script>

<style>
/* Add your CSS here */
</style>
