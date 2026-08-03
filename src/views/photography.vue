<template>
    <div class="photos-container">
        <div class="home-container">
      <main class="shadowPlus4">
        <article>
          <h1>The art of noticing</h1>
            <p>I believe life holds more beauty than we usually see. How much of it we experience depends, in part, on our ability to pay attention.</p>

        <p>These moments are everywhere. Most are brief and unplanned. Some happen every day, while others happen only once. Together, they remind us of something about life and who we are.</p>

        <p>Noticing these moments and finding a way to preserve them is the part of photography I love most. A photograph may keep the moment, but the real art is noticing it in the first place.</p>
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
