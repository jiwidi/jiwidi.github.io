<template>
  <ImageGallery :images="images" :section="section_name" />
</template>

<script>
import ImageGallery from '/src/components/imageGallery.vue';
import imageDictionary from '/src/assets/imageDictionary.json';
import imageMeta from '/src/assets/imageMeta.json';

const toThumb = (src) => src.replace('/original/', '/thumbnails/');
const toMedium = (src) => src.replace('/original/', '/medium_res/');

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
    computed: {
        // Dimensions come from the build-time manifest so the gallery can
        // reserve space (aspect-ratio) before lazy images arrive.
        images() {
            const list = imageDictionary[this.section_name] || [];
            return list.map((src) => {
                const meta = imageMeta[src] || { w: 3, h: 2 };
                return {
                    original: src,
                    thumb: toThumb(src),
                    medium: toMedium(src),
                    w: meta.w,
                    h: meta.h,
                };
            });
        },
    },
}
</script>
