<template>
    <div class="photos-container">
        <div class="home-container">
      <main class="shadowPlus4">
        <article>
          <h1>To capture life</h1>
            <p>Photography stands as life's pause button, captivating the fleeting essence of life's moments. It offers a tangible reminder of the transient beauty that surrounds us, a beauty that flashes by in the blink of an eye.</p>

        <p>Society's immersion in the internet redirects our focus towards ephemeral trends, creating needs for the new and the now. Photography beckons us to decelerate, to cherish the present, and to look around, offering a gentle reminder of life's depth beyond the transient chase.  </p>
<photoGrid/>
        </article>

      </main>
    </div>
    </div>
  </template>

<script>
import photoGrid from '/src/components/photoGrid.vue';

export default {
    name: 'PhotosView',
    components: {
        photoGrid,
    },
    data() {
        return {
            photos: []
        };
    },
    mounted() {
        this.loadPhotos();
    },
    methods: {
        loadPhotos() {
            fetch('/api/photos')
                .then(response => response.json())
                .then(data => {
                    // Assuming 'data' is an array of objects with 'src' and 'title'
                    this.photos = data.map(photo => ({
                        src: photo.src,
                        caption: photo.title,
                        thumbnail: photo.src // If you have thumbnails, replace `photo.src` with the thumbnail path
                    }));
                })
                .catch(error => console.error('Error loading photos:', error));
        }
    }
};
</script>
