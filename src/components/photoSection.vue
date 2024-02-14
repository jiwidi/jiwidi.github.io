<template>
    <div>
      <ImageGallery :images="filteredImages"></ImageGallery>
    </div>
  </template>

<script>
import ImageGallery from '/src/components/imageGallery.vue';
import imageDictionary from '/src/assets/imageDictionary.json'


export default {
    components: {
        ImageGallery,
    },
    props: {
        section_name: {
            type: String,
            required: true
        }
    },
    data() {
        return {
            filteredImages: imageDictionary[this.section_name] || []
        }
    },
    mounted() {
        // If you need to do any transformations or additional fetching
    },
}
</script>
