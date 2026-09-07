<template>
    <article>
          <h1>Milu</h1>
          <p>My single cell brain cat.</p>

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
            name: 'milu'
        }
    },
    mounted() {
    },
}
</script>
