<template>
    <div>
        <photoSection :section_name='name'></photoSection>
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
            name: 'me&tim'
        }
    },
    mounted() {
    },
}
</script>
