<template>
    <div class="home-container">
      <main class="shadowPlus4">
        <article>
          <h1>Things I have written</h1>
          <p>A mix of opinions, papers and notes.</p>
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
                    title: "The AI Revolution: Interfaces, Not Intelligence",
                    description: "opinions",
                    link: "/writing/ai_revolution_interfaces",
                },
                {
                    title: "Explaining Preferences with Shapley Values",
                    description: "neurips 2022",
                    link: "https://arxiv.org/pdf/2205.13662.pdf",
                },
                {
                    title: "Fashion Recommender Systems with Focus on Time and Seasonality",
                    description: "thesis",
                    link: "https://github.com/jiwidi/MASTER_THESIS/blob/master/thesis.pdf",
                },
                {
                    title: "Twitter's Open Source Algorithm — Unveiling the Code, but Not the Secrets",
                    description: "opinions",
                    link: "/writing/twitter_open_source_algorithm",
                },
                {
                    title: "GPT-4: A New Milestone in Scaling Up Deep Learning",
                    description: "opinions",
                    link: "/writing/gpt4_release",
                },
                {
                    title: "Size Isn't Everything — How LLaMA Democratizes Access to Large Language Models",
                    description: "opinions",
                    link: "/writing/llama_size_isnt_everything",
                },
                {
                    title: "Microsoft vs Google — ChatGPT Taking Over Search?",
                    description: "opinions",
                    link: "/writing/search_google_vs_microsoft",
                },
                {
                    title: "Why Your Feeds Are Getting Worse Over Time",
                    description: "opinions",
                    link: "/writing/feeds_worse_overtime",
                },
                {
                    title: "Your Browsing Behavior Is Being Modeled as a Language",
                    description: "opinions",
                    link: "/writing/browser_behavior_language",
                },
                {
                    title: "Takeaways from the 2022 NVIDIA RecSys Workshop",
                    description: "notes",
                    link: "/writing/takeaways_nvidia_22",
                },
                {
                    title: "RecSys 2022 — Favorite Papers and Talks",
                    description: "notes",
                    link: "/writing/recsys_2022",
                },
            ],
        };
    },
};
</script>

