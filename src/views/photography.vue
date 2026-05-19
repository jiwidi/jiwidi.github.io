<template>
    <div class="photos-container">
        <div class="home-container">
      <main class="shadowPlus4">
        <article>
          <h1>To notice life</h1>
            <p>I've always liked paying attention to the small signs of life scattered everywhere, in people, places, animals, movement, stillness, and texture.</p>

        <p>Photography lets me take the things I notice and give them a place to remain. A movement, a texture, a person, an animal, a quiet corner of a place. They might only exist like that for a moment, but a photograph keeps a trace of them.</p>
<photoGrid/>
        </article>
        <BackButton />
      </main>
    </div>
    </div>
  </template>

<script>
import photoGrid from '/src/components/photoGrid.vue';
import BackButton from '/src/components/BackButton.vue';

export default {
    name: 'PhotosView',
    components: {
        photoGrid,
        BackButton,
    },
    data() {
        return {
            photos: []
        };
    },
    mounted() {
    },
};
</script>
