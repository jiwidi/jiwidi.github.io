<template>
    <div class="creative-container">
      <main class="shadowPlus4">
        <article>
          <h1>Many keyboards!</h1>
          <p>As someone who spends a lot of time at a keyboard, I consider it an extension of myself. Most keyboards are functional and get the job done, but if you want to improve your typing experience, you can go pretty overkill. These over-the-top keyboards don't offer any special features, but they are comfortable to use for long periods of time without causing hand strain. Building them from scratch by soldering, picking out components, and assembling them is a satisfying engineering challenge for me.</p>
          <div v-html="markdownContent"></div>
        </article>
        <ListDisplay />
      </main>
    </div>
  </template>

<script>
import { marked } from 'marked';
import ListDisplay
    from '/src/components//ListDisplay.vue';
export default {
    name: 'Creative',
    components: {
        ListDisplay
    },
    data() {
        return {
            markdownContent: ''
        };
    },
    mounted() {
        this.loadMarkdown();
    },
    methods: {
        async loadMarkdown() {
            try {
                const response = await fetch('src/markdown/keyboards.md');
                if (response.ok) {
                    const markdown = await response.text();
                    this.markdownContent = marked(markdown);
                } else {
                    console.error('Markdown file could not be loaded.');
                }
            } catch (error) {
                console.error('Error fetching markdown content:', error);
            }
        }
    }
};
</script>
