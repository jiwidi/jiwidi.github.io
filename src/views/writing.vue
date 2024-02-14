<template>
    <div class="home-container">
      <main class="shadowPlus4">
        <article>
          <h1>Things I have written</h1>
        </article>
        <ListDisplay :listItems="writings" />
      </main>
    </div>
  </template>

<script>
import ListDisplay from '../components/listDisplay.vue'; // Make sure the path is correct

export default {
    name: 'Home',
    components: {
        ListDisplay
    },
    data() {
        return {
            writings: [
                {
                    title: "Explaining Preferences with Shapley Values",
                    description: "NeurIPS 2022",
                    link: "https://arxiv.org/pdf/2205.13662.pdf",
                    icon: "newspaper_icon"
                },
                {
                    title: "Fashion recommender systems with focus on time and seasonability",
                    description: "My Thesis",
                    link: "https://github.com/jiwidi/MASTER_THESIS/blob/master/thesis.pdf",
                    icon: "newspaper_icon"
                },
                {
                    title: "Twitter's Open Source Algorithm - Unveiling the code, but not the secrets",
                    description: "Analysis",
                    link: "https://www.shaped.ai/blog/twitters-open-source-algorithm-unveiling-the-code-but-not-the-secrets",
                    icon: "newspaper_icon"
                },
            ],
        };
    },
};
</script>

