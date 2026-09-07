<template>
    <article>
          <h1>Family</h1>
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
            name: 'family'
        }
    },
    mounted() {
    },
}
</script>
