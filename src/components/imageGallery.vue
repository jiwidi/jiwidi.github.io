<template>
    <div class="image-gallery">
      <div v-for="(image, index) in images" :key="index" class="gallery-image" @click="openImage(index)">
        <img :src="getThumbnail(image)" :alt="`Image ${index + 1}`" class="responsive-img" />
      </div>
      <div v-if="isViewerOpen" class="image-viewer" @click.self="closeViewer">
        <img :src="getMediumResImage(images[currentImageIndex])" :alt="`Image ${currentImageIndex + 1}`" class="full-image" />
        <div class="image-row">
          <img v-for="(img, index) in images" :key="`thumb-${index}`" :src="getThumbnail(img)" @click.stop="navigateTo(index)" class="thumb" :class="{ active: currentImageIndex === index }">
        </div>
        <span class="close-btn" @click.stop="closeViewer">&times;</span>
        <button class="download-btn" @click.stop="downloadImage(images[currentImageIndex])">Download</button>
      </div>
    </div>
  </template>

<script>
export default {
    props: {
        images: {
            type: Array,
            required: true,
        },
    },
    data() {
        return {
            isViewerOpen: false,
            currentImageIndex: 0,
            loadedImages: {}, // Track loaded images
        };
    },
    mounted() {
        window.addEventListener('keydown', this.handleKeydown);
        this.preloadImages();
    },
    beforeDestroy() {
        window.removeEventListener('keydown', this.handleKeydown);
    },
    methods: {
        getThumbnail(imageSrc) {
            return this.loadedImages[imageSrc] || imageSrc.replace('/original/', '/thumbnails/');
        },
        getMediumResImage(imageSrc) {
            return imageSrc.replace('/original/', '/medium_res/');
        },
        preloadImages() {
            this.images.forEach(imageSrc => {
                const img = new Image();
                img.onload = () => {
                    this.$set(this.loadedImages, imageSrc, imageSrc); // Track loaded original image
                };
                img.src = imageSrc; // Start loading the original image
            });
        },
        openImage(index) {
            this.isViewerOpen = true;
            this.currentImageIndex = index;
        },
        closeViewer() {
            this.isViewerOpen = false;
        },
        navigateTo(index) {
            this.currentImageIndex = index;
        },
        handleKeydown(e) {
            if (!this.isViewerOpen) return;
            if (e.key === 'ArrowLeft') {
                this.navigate(-1);
            } else if (e.key === 'ArrowRight') {
                this.navigate(1);
            }
            if (e.key === 'Escape') {
                this.closeViewer();
            }
        },
        navigate(direction) {
            const nextIndex = this.currentImageIndex + direction;
            if (nextIndex >= this.images.length) {
                this.currentImageIndex = 0;
            } else if (nextIndex < 0) {
                this.currentImageIndex = this.images.length - 1;
            } else {
                this.currentImageIndex = nextIndex;
            }
        },
        downloadImage(imageSrc) {
            const link = document.createElement('a');
            link.href = imageSrc; // Direct link to the original image
            link.download = 'Download'; // Optional: you can give the file a default name for downloading
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        },
    },
};
</script>

<style scoped>
.image-gallery {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    justify-content: flex-start;
}

.gallery-image img.responsive-img {
    max-height: 180px;
    max-width: 100%;
    height: auto;
    width: auto;
    cursor: pointer;
    border-radius: 5px;
}

.image-viewer {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.9);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    z-index: 1000;
}

.full-image {
    max-height: 80%;
    max-width: 80%;
}

.image-row {
    display: flex;
    flex-wrap: nowrap;
    overflow-x: auto;
    padding-top: 20px;
}

.thumb {
    max-height: 100px;
    margin-right: 10px;
    opacity: 0.6;
    transition: opacity 0.2s;
}

.thumb.active {
    opacity: 1;
}

.close-btn {
    position: absolute;
    top: 20px;
    right: 25px;
    font-size: 40px;
    color: white;
    cursor: pointer;
}

.download-btn {
    margin-top: 20px;
    padding: 10px 20px;
    background-color: #fff;
    border: none;
    border-radius: 5px;
    cursor: pointer;
}
</style>
