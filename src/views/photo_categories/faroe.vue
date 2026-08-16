<template>
    <article>
          <h1>Faroe</h1>
          <p>Trip to Faroe islands.</p>

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
            name: 'faroe'
        }
    },
    mounted() {
    },
}
</script>
