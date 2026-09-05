<template>
    <article>
          <h1>Nature</h1>
          <p>Photos from different hikes and trips.</p>

        <photoSection :section_name='name'></photoSection>
        </article>
</template>

<script>
import photoSection from '/src/components/photoSection.vue'

export default {
    components: {
        photoSection,
    },
    data() {
        return {
            name: 'nature'
        }
    },
    mounted() {
    },
}
</script>
