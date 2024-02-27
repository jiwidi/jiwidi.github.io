<template>
    <div class="home-container">
      <main class="shadowPlus4">
        <article>
          <h1>Things I have written</h1>
        </article>
        <listDisplay :listItems="writings" />
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
                    description: "Opinions",
                    link: "/writing/twitter_open_source_algorithm",
                    icon: "newspaper_icon"
                },
                {
                    title: "GPT-4: A New Milestone in Scaling Up Deep Learning",
                    description: "Opinions",
                    link: "/writing/gpt4_release",
                    icon: "newspaper_icon"
                },
                {
                    title: "Size Isn't Everything - How LLaMA democratizes access to Large-Language-Models",
                    description: "Opinions",
                    link: "/writing/llama_size_isnt_everything",
                    icon: "newspaper_icon"
                },
                {
                    title: "Microsoft vs Google - ChatGPT taking over search?",
                    description: "Opinions",
                    link: "/writing/search_google_vs_microsoft",
                    icon: "newspaper_icon"
                },
                {
                    title: "Why your feeds are getting worse over time",
                    description: "Opinions",
                    link: "/writing/feeds_worse_overtime",
                    icon: "newspaper_icon"
                },
                {
                    title: "Your browsing behavior is being modeled as a language",
                    description: "Opinions",
                    link: "/writing/browser_behavior_language",
                    icon: "newspaper_icon"
                },
                {
                    title: "Takeaways from the 2022 NVIDIA RecSys Worksop",
                    description: "Opinions",
                    link: "/writing/takeaways_nvidia_22",
                    icon: "newspaper_icon"
                },
                {
                    title: "RecSys 2022 - Favorite papers and talks",
                    description: "Opinions",
                    link: "/writing/recsys_2022",
                    icon: "newspaper_icon"
                },

            ],
        };
    },
};
</script>

