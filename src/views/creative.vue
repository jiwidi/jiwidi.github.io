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
                    title: "The mechanical watch",
                    description: "Great visualizations.",
                    link: "https://ciechanow.ski/mechanical-watch/",
                    icon: "link_icon",
                },
                {
                    title: "Forgotten ideas of cs",
                    description: "CS doesn't change.",
                    link: "https://codesync.global/uploads/media/default/0001/01/de7dfa6889612b31caf9ffa5b3377ee57be54cfd.pdf",
                    icon: "link_icon",
                },
                {
                    title: "The world has become less colorful",
                    description: "A study on color.",
                    link: "https://www.archdaily.com/993197/is-the-world-less-colorful-highlighting-the-color-evolution-of-objects-and-spaces",
                    icon: "link_icon",
                },
                {
                    title: "Scapes",
                    description: "Atop the tallest sky tower, hearing the streets breathe.",
                    link: "https://futuretage.tumblr.com/",
                    icon: "link_icon",
                },
                {
                    title: "40 questions",
                    description: "Ask them to yourself every year.",
                    link: "https://github.com/kepano/40-questions",
                    icon: "link_icon",
                },
                {
                    title: "Dracula theme",
                    description: "Theme I use on most apps.",
                    link: "https://draculatheme.com/",
                    icon: "link_icon",
                },
                {
                    title: "How do rangefinder cameras focus?",
                    link: "https://www.youtube.com/watch?v=4fuPYirmous",
                    icon: "link_icon",
                },
                {
                    title: "The age of average",
                    link: "https://www.alexmurrell.co.uk/articles/the-age-of-average",
                    icon: "link_icon",
                },
                {
                    title: "Tastiness of watermelon",
                    description: "A delicious summer treat.",
                    link: "/creative/watermelon",
                    icon: "link_icon",
                }
            ],
        };
    },

};
</script>

<style>
/* Add your CSS here */
</style>
