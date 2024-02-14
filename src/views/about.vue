<template>
    <div class="about-container">
      <main class="shadowPlus4">
        <article>
            <h1>About me</h1>
            <div style="width: 50%; float: left;"> I was born in Spain and
					have been tinkering with computers since I was 8 years old.
					A few quotes I resonate with:
					<p> - Be kind.</p>
					<p> - Being normal is overrated.</p>
					<p> - I care about what people make, not what they own.</p>
				</div>
				<div style="margin-left: 50%; text-align:right; "> <img
						src="/src/assets/img/about/author.jpg" width="50%"> </div>
                    </article>
      <ListDisplay :listItems="pages" />
      </main>
    </div>
  </template>

<script>
import ListDisplay from '/src/components//ListDisplay.vue';

export default {
    name: 'About',
    components: {
        ListDisplay
    },
    methods: {
        toggleTheme() {
        }
    },
    data() {
        return {
            pages: [
                {
                    title: "Curriculum Vitae",
                    link: "https://github.com/jiwidi/CurriculumVitae/blob/master/JaimeFerrandoHuertas_CV.pdf", // Make sure this link is handled by your Vue router
                    icon: "newspaper_icon",
                },
            ],
        };
    },
};
</script>
