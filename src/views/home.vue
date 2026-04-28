<template>
    <main>
      <article>
        <h1>Hello there!</h1>
        <p>I'm <router-link to="/about" class="abold">{Jaime}</router-link> a
          <strike>data scientist, engineer, geek</strike> who likes to build stuff at the computer. Apart from coding my interests include photography, snow sports and cycling.</p>
        <p>I'm currently building <a href="https://ecomid.com" target="_blank" rel="noopener" class="abold">eComID</a> as co-founder and head of AI.</p>
      </article>
      <listDisplay :listItems="pages" :numbered="true" />
    </main>
  </template>

<script>
import listDisplay from '/src/components/listDisplay.vue';

export default {
    name: 'Home',
    components: {
        listDisplay
    },
    data() {
        return {
            pages: [
                { title: "Projects",    link: "/projects",    description: "12 repos" },
                { title: "Writing",     link: "/writing",     description: "11 pieces" },
                { title: "Creative",    link: "/creative",    description: "9 finds" },
                { title: "Keyboards",   link: "/keyboards",   description: "7 builds" },
                { title: "Photography", link: "/photography", description: "8 sets" },
                { title: "About",       link: "/about",       description: "readme" },
            ],
        };
    },
};
</script>

<style scoped></style>
