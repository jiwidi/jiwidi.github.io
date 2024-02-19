<template>
    <div class="home-container">
      <main class="shadowPlus4">
        <article>
          <h1>Hello there!</h1>
          <p>I'm <a href="about/author/" class="abold">{Jaime}</a> a
            <strike>data scientist, engineer, geek</strike> who likes to build stuff. I also enjoy running, natureboarding and taking photos.
          </p>
          <p>This page contains a summary of my work, interests, and some of my writings. Browse around and feel free to learn a bit about me.</p>
        </article>
        <listDisplay :listItems="pages" />
      </main>
    </div>
  </template>

<script>
import listDisplay from '/src/components/listDisplay.vue'; // Make sure the path is correct

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
                    link: "/projects", // Make sure this link is handled by your Vue router
                    icon: "folder_icon",
                },
                {
                    title: "Writing",
                    link: "/writing",
                    icon: "folder_icon",
                },
                {
                    title: "Creative",
                    link: "/creative", // Make sure this link is handled by your Vue router
                    icon: "folder_icon",
                },
                {
                    title: "Keyboards",
                    link: "/keyboards", // Make sure this link is handled by your Vue router
                    icon: "folder_icon",
                },
                {
                    title: "Photography",
                    link: "/photography", // Make sure this link is handled by your Vue router
                    icon: "folder_icon",
                },
                {
                    title: "About",
                    link: "/about", // Make sure this link is handled by your Vue router
                    icon: "folder_icon",
                }
            ],
        };
    },
};
</script>

<style scoped></style>
