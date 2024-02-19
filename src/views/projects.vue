<template>
    <div class="projects-container">
      <main class="shadowPlus4">
        <article>
          <h1>My Projects</h1>
          <p>A collection of my personal and professional projects.</p>
        </article>
        <listDisplay :listItems="projectItems" />
      </main>
    </div>
  </template>

<script>
import listDisplay from '/src/components/listDisplay.vue';

export default {
    name: 'Projects',
    components: {
        listDisplay
    },
    data() {
        return {
            projectItems: [
                {
                    title: "Behavior Sequence Transformer Pytorch",
                    description: "Pytorch implementation of a behavior sequence transformer for session-based recommendation.",
                    link: "https://github.com/jiwidi/Behavior-Sequence-Transformer-Pytorch",
                    icon: "link_icon",
                },
                {
                    title: "Time Series Forecasting with Python",
                    description: "Collection of methods for time-series forecasting in Python.",
                    link: "https://github.com/jiwidi/time-series-forecasting-with-python",
                    icon: "link_icon",
                },
                {
                    title: "DeepSpeech Pytorch",
                    description: "Pytorch implementation of DeepSpeech, a speech recognition system.",
                    link: "https://github.com/jiwidi/DeepSpeech-pytorch",
                    icon: "link_icon",
                },
                {
                    title: "LAS Pytorch",
                    description: "Pytorch implementation of Listen, Attend and Spell, a speech recognition model.",
                    link: "https://github.com/jiwidi/las-pytorch",
                    icon: "link_icon",
                },
                {
                    title: "Jupyter Lab Docker RPI",
                    description: "Docker setup for running Jupyter Lab on Raspberry Pi.",
                    link: "https://github.com/jiwidi/jupyter-lab-docker-rpi",
                    icon: "link_icon",
                },
                {
                    title: "DailyQwertee",
                    description: "A scraper that notifies you of the daily t-shirt design on Qwertee.",
                    link: "https://github.com/jiwidi/DailyQwertee",
                    icon: "link_icon",
                },
                {
                    title: "Lens Database",
                    description: "Comprehensive database of camera lenses with detailed specifications.",
                    link: "https://www.lens-database.com/",
                    icon: "link_icon",
                },
                {
                    title: "My Personal Website",
                    description: "Source code for this website.",
                    link: "https://github.com/jiwidi/jiwidi.github.io",
                    icon: "link_icon",
                },
                {
                    title: "Master Thesis",
                    description: "Repository containing my master's thesis work.",
                    link: "https://github.com/jiwidi/MASTER_THESIS",
                    icon: "link_icon",
                },
                {
                    title: "GMM Classifier",
                    description: "Implementation of a Gaussian Mixture Model for classification tasks.",
                    link: "https://github.com/jiwidi/gmm-classifier",
                    icon: "link_icon",
                },
                {
                    title: "Netflix RNN Recommender",
                    description: "Session based recommendation system for Netflix data using RNNs.",
                    link: "https://github.com/jiwidi/Netflix-RNN-Recommender",
                    icon: "link_icon",
                },
                {
                    title: "Dotfiles",
                    description: "My collection of dotfiles for Unix-based systems.",
                    link: "https://github.com/jiwidi/dotfiles",
                    icon: "link_icon",
                }
            ],
        };
    },
};
</script>

<style>
/* Style your projects view here */
.projects-container {
    /* Styles */
}

.shadowPlus4 {
    /* Styles */
}
</style>
