<template>
    <div class="creative-container">
      <main class="shadowPlus4">
        <article>
          <h1>Creative stuff</h1>
          <p>Storage for creative stuff.</p>
        </article>
        <ListDisplay :listItems="creativeItems" />
      </main>
    </div>
  </template>

<script>
import ListDisplay from '../components/ListDisplay.vue';

export default {
    name: 'Creative',
    components: {
        ListDisplay
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
                    description: "An article on the concept of average.",
                    link: "https://www.alexmurrell.co.uk/articles/the-age-of-average",
                    icon: "link_icon",
                },
                {
                    title: "Tastiness of watermelon",
                    description: "A delicious summer treat.",
                    link: "/creative/photos/watermelon",
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
