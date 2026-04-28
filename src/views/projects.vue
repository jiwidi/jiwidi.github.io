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
                    title: "Behavior Sequence Transformer (PyTorch)",
                    description: "pytorch · recsys",
                    link: "https://github.com/jiwidi/Behavior-Sequence-Transformer-Pytorch",
                },
                {
                    title: "Time Series Forecasting with Python",
                    description: "python · forecasting",
                    link: "https://github.com/jiwidi/time-series-forecasting-with-python",
                },
                {
                    title: "DeepSpeech (PyTorch)",
                    description: "pytorch · asr",
                    link: "https://github.com/jiwidi/DeepSpeech-pytorch",
                },
                {
                    title: "Listen, Attend and Spell (PyTorch)",
                    description: "pytorch · asr",
                    link: "https://github.com/jiwidi/las-pytorch",
                },
                {
                    title: "JupyterLab Docker for Raspberry Pi",
                    description: "docker · rpi",
                    link: "https://github.com/jiwidi/jupyter-lab-docker-rpi",
                },
                {
                    title: "DailyQwertee",
                    description: "scraper · bot",
                    link: "https://github.com/jiwidi/DailyQwertee",
                },
                {
                    title: "Lens Database",
                    description: "live · database",
                    link: "https://www.lens-database.com/",
                },
                {
                    title: "This Personal Website",
                    description: "source",
                    link: "https://github.com/jiwidi/jiwidi.github.io",
                },
                {
                    title: "Master's Thesis",
                    description: "thesis",
                    link: "https://github.com/jiwidi/MASTER_THESIS",
                },
                {
                    title: "GMM Classifier",
                    description: "stats · ml",
                    link: "https://github.com/jiwidi/gmm-classifier",
                },
                {
                    title: "Netflix RNN Recommender",
                    description: "rnn · recsys",
                    link: "https://github.com/jiwidi/Netflix-RNN-Recommender",
                },
                {
                    title: "Dotfiles",
                    description: "unix · config",
                    link: "https://github.com/jiwidi/dotfiles",
                },
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
