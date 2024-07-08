<template>
    <div class="home-container">
      <main class="shadowPlus4">
        <article>
          <h1>Hello there!</h1>
          <p>I'm <a href="about/" class="abold">{Jaime}</a> a
            <strike>data scientist, engineer, geek</strike> who likes to build stuff at the computer. Apart from coding my interests include photography, snow sports and cycling.</p>
          <p>I'm currently building <a href="https://ecomid.com" class="abold">eComID</a> as co-founder and head of AI.</p>
        </article>
        <listDisplay :listItems="pages" />
      </main>
    </div>
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
                {
                    title: "Projects",
                    link: "/projects",
                    icon: "folder_icon",
                },
                {
                    title: "Writing",
                    link: "/writing",
                    icon: "folder_icon",
                },
                {
                    title: "Creative",
                    link: "/creative",
                    icon: "folder_icon",
                },
                {
                    title: "Keyboards",
                    link: "/keyboards",
                    icon: "folder_icon",
                },
                {
                    title: "Photography",
                    link: "/photography",
                    icon: "folder_icon",
                },
                {
                    title: "About",
                    link: "/about",
                    icon: "folder_icon",
                }
            ],
        };
    },
};
</script>

<style scoped></style>
