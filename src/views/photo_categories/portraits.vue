<template>
    <div class="photos-container">
        <div class="home-container">
      <main class="shadowPlus4">
        <article>
          <h1>Portraits</h1>
          <p></p>

        <photoSection :section_name='name'></photoSection>
        </article>

      </main>
    </div>
    </div>
</template>

<script>
import photoSection from '/src/components/photoSection.vue'

export default {
    components: {
        photoSection,
    },
    data() {
        return {
            name: 'portraits'
        }
    },
    mounted() {
    },
}
</script>
