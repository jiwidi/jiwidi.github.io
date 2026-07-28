<template>
    <div class="image-gallery">
      <button
        v-for="(image, index) in images"
        :key="image.original"
        type="button"
        class="gallery-item"
        :style="itemStyle(image)"
        :aria-label="`Open photo ${index + 1} of ${images.length}`"
        @click="openImage(index)"
      >
        <img
          ref="thumbs"
          :src="image.thumb"
          :alt="`${section} photo ${index + 1}`"
          class="gallery-thumb"
          :class="{ 'is-loaded': loaded[index] }"
          :loading="index < EAGER_COUNT ? 'eager' : 'lazy'"
          decoding="async"
          @load="markLoaded(index)"
          @error="markLoaded(index)"
        >
        <span class="gallery-num" aria-hidden="true">{{ String(index + 1).padStart(2, '0') }}</span>
      </button>

      <Teleport to="body">
        <transition name="viewer" @after-leave="releaseScrollLock">
          <div
            v-if="isViewerOpen"
            ref="viewer"
            class="image-viewer"
            role="dialog"
            aria-modal="true"
            :aria-label="`Photo ${currentImageIndex + 1} of ${images.length}`"
            @click.self="closeViewer"
          >
            <header class="viewer-bar">
              <span class="viewer-counter">{{ currentImageIndex + 1 }} / {{ images.length }}</span>
              <span class="viewer-actions">
                <a
                  class="viewer-btn"
                  :href="currentImage.original"
                  download
                  @click.stop
                >full size ↓</a>
                <button
                  ref="closeBtn"
                  class="viewer-btn"
                  type="button"
                  @click.stop="closeViewer"
                >esc ×</button>
              </span>
            </header>

            <div class="viewer-stage" @click.self="closeViewer">
              <button
                class="viewer-nav viewer-prev"
                type="button"
                aria-label="Previous photo"
                @click.stop="navigate(-1)"
              >‹</button>
              <!-- The cached grid thumbnail shows as a background while the
                   medium-res file decodes, so the stage never appears empty. -->
              <img
                :key="currentImage.medium"
                :src="currentImage.medium"
                :alt="`${section} photo ${currentImageIndex + 1}`"
                class="viewer-image"
                decoding="async"
                :style="{
                  '--ar': currentImage.w / currentImage.h,
                  backgroundImage: `url('${currentImage.thumb}')`,
                }"
              >
              <button
                class="viewer-nav viewer-next"
                type="button"
                aria-label="Next photo"
                @click.stop="navigate(1)"
              >›</button>
            </div>

            <div class="viewer-strip">
              <button
                v-for="(image, index) in images"
                :key="`strip-${image.original}`"
                ref="stripThumbs"
                type="button"
                class="strip-item"
                :class="{ active: currentImageIndex === index }"
                :aria-label="`Photo ${index + 1}`"
                @click.stop="navigateTo(index)"
              >
                <img :src="image.thumb" alt="" loading="lazy" decoding="async">
              </button>
            </div>
          </div>
        </transition>
      </Teleport>
    </div>
  </template>

<script>
// Target row height for the justified layout; rows flex to fill the width.
const ROW_BASIS_PX = 220;
// Above-the-fold thumbnails load eagerly so the grid paints instantly;
// the rest lazy-load as the page scrolls.
const EAGER_COUNT = 8;

export default {
    props: {
        // [{ original, thumb, medium, w, h }] — built by photoSection.vue
        // from the imageDictionary/imageMeta manifests.
        images: {
            type: Array,
            required: true,
        },
        section: {
            type: String,
            default: 'gallery',
        },
    },
    data() {
        return {
            EAGER_COUNT,
            isViewerOpen: false,
            currentImageIndex: 0,
            loaded: {},
        };
    },
    computed: {
        currentImage() {
            return this.images[this.currentImageIndex] || {};
        },
    },
    watch: {
        // The scroll lock engages immediately on open but is released by
        // @after-leave, so the page doesn't jump under the closing fade.
        isViewerOpen(open) {
            if (open) document.body.classList.add('viewer-open');
        },
    },
    mounted() {
        window.addEventListener('keydown', this.handleKeydown);
        // Images served from cache can fire `load` before the handler binds.
        (this.$refs.thumbs || []).forEach((img, index) => {
            if (img.complete && img.naturalWidth > 0) this.markLoaded(index);
        });
    },
    beforeUnmount() {
        window.removeEventListener('keydown', this.handleKeydown);
        this.releaseScrollLock();
    },
    methods: {
        // Justified rows: each tile grows proportionally to its aspect ratio,
        // and `aspect-ratio` reserves space before the lazy thumbnail loads.
        itemStyle(image) {
            const ratio = image.w / image.h;
            return {
                aspectRatio: `${image.w} / ${image.h}`,
                flexGrow: ratio * 100,
                flexBasis: `${ratio * ROW_BASIS_PX}px`,
            };
        },
        markLoaded(index) {
            if (this.loaded[index]) return;
            this.loaded = { ...this.loaded, [index]: true };
        },
        openImage(index) {
            this.lastFocused = document.activeElement;
            this.currentImageIndex = index;
            this.isViewerOpen = true;
            this.afterIndexChange();
            this.$nextTick(() => this.$refs.closeBtn?.focus());
        },
        closeViewer() {
            this.isViewerOpen = false;
            this.$nextTick(() => this.lastFocused?.focus?.());
        },
        releaseScrollLock() {
            document.body.classList.remove('viewer-open');
        },
        navigateTo(index) {
            this.currentImageIndex = index;
            this.afterIndexChange();
        },
        navigate(direction) {
            const count = this.images.length;
            this.currentImageIndex = (this.currentImageIndex + direction + count) % count;
            this.afterIndexChange();
        },
        afterIndexChange() {
            this.preloadNeighbors();
            this.scrollStripToActive();
        },
        preloadNeighbors() {
            [-1, 1].forEach((offset) => {
                const count = this.images.length;
                const neighbor = this.images[(this.currentImageIndex + offset + count) % count];
                if (neighbor) new Image().src = neighbor.medium;
            });
        },
        scrollStripToActive() {
            this.$nextTick(() => {
                const el = (this.$refs.stripThumbs || [])[this.currentImageIndex];
                if (el) el.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
            });
        },
        handleKeydown(e) {
            if (!this.isViewerOpen) return;
            if (e.key === 'ArrowLeft') this.navigate(-1);
            else if (e.key === 'ArrowRight') this.navigate(1);
            else if (e.key === 'Escape') this.closeViewer();
            else if (e.key === 'Tab') this.trapFocus(e);
        },
        // aria-modal alone doesn't confine keyboard focus — keep Tab cycling
        // within the dialog while it's open.
        trapFocus(e) {
            const viewer = this.$refs.viewer;
            if (!viewer) return;
            const focusables = viewer.querySelectorAll('button, a[href]');
            if (!focusables.length) return;
            const first = focusables[0];
            const last = focusables[focusables.length - 1];
            if (e.shiftKey && document.activeElement === first) {
                e.preventDefault();
                last.focus();
            } else if (!e.shiftKey && document.activeElement === last) {
                e.preventDefault();
                first.focus();
            } else if (!viewer.contains(document.activeElement)) {
                e.preventDefault();
                first.focus();
            }
        },
    },
};
</script>

<style scoped>
.image-gallery {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    margin-top: 1.4em;
}

/* Stop the last row from stretching to full width. */
.image-gallery::after {
    content: '';
    flex-grow: 1000000;
}

.gallery-item {
    position: relative;
    padding: 0;
    border: 1px solid var(--rule_soft);
    background: var(--bg_acc);
    cursor: zoom-in;
    overflow: hidden;
    transition: transform 0.18s cubic-bezier(0.22, 1, 0.36, 1),
        box-shadow 0.18s cubic-bezier(0.22, 1, 0.36, 1),
        border-color 0.18s ease;
}

/* Prints lift off the sheet: hard offset shadow in ink, no blur —
   the same box language as the rest of the site. */
.gallery-item:hover,
.gallery-item:focus-visible {
    border-color: var(--fg);
    transform: translate(-2px, -2px);
    box-shadow: 4px 4px 0 var(--fg);
    z-index: 1;
}

.gallery-item:active {
    transform: translate(0, 0);
    box-shadow: 2px 2px 0 var(--fg);
}

.gallery-thumb {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
    opacity: 0;
    transform: translateY(8px);
    transition: opacity 0.35s ease, transform 0.35s cubic-bezier(0.22, 1, 0.36, 1);
}

.gallery-thumb.is-loaded {
    opacity: 1;
    transform: none;
}

/* Contact-sheet frame number, revealed on hover/focus. */
.gallery-num {
    position: absolute;
    left: 0;
    bottom: 0;
    padding: 2px 7px;
    background: var(--fg);
    color: var(--bg);
    font: 600 10px/1.5 var(--font-mono);
    letter-spacing: 0.08em;
    opacity: 0;
    transition: opacity 0.15s ease;
    pointer-events: none;
}

.gallery-item:hover .gallery-num,
.gallery-item:focus-visible .gallery-num {
    opacity: 1;
}

/* ---------- lightbox ---------- */
.image-viewer {
    position: fixed;
    inset: 0;
    background: rgba(12, 12, 16, 0.94);
    display: flex;
    flex-direction: column;
    z-index: 1000;
    color: #fff;
}

.viewer-bar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 12px 18px;
    font: 12px/1.4 var(--font-mono);
    letter-spacing: 0.08em;
    text-transform: uppercase;
}

.viewer-counter {
    opacity: 0.75;
}

.viewer-actions {
    display: flex;
    gap: 10px;
}

.viewer-btn {
    background: transparent;
    border: 1px solid rgba(255, 255, 255, 0.6);
    color: #fff;
    font: inherit;
    padding: 3px 10px;
    cursor: pointer;
    text-decoration: none;
}

.viewer-btn:hover {
    background: #fff;
    color: #111;
}

.viewer-stage {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
    min-height: 0;
    padding: 0 8px;
}

.viewer-image {
    height: min(74vh, calc(86vw / var(--ar)));
    aspect-ratio: var(--ar);
    object-fit: contain;
    background-size: contain;
    background-position: center;
    background-repeat: no-repeat;
}

.viewer-nav {
    background: transparent;
    border: 0;
    color: rgba(255, 255, 255, 0.7);
    font-size: 44px;
    line-height: 1;
    padding: 0 14px;
    cursor: pointer;
    user-select: none;
    flex-shrink: 0;
}

.viewer-nav:hover {
    color: #fff;
}

.viewer-strip {
    display: flex;
    gap: 8px;
    overflow-x: auto;
    padding: 12px 18px 16px;
    scrollbar-width: thin;
}

.strip-item {
    padding: 0;
    border: 1px solid transparent;
    background: transparent;
    cursor: pointer;
    flex-shrink: 0;
    opacity: 0.45;
    transition: opacity 0.15s ease, border-color 0.15s ease;
}

.strip-item img {
    height: 56px;
    width: auto;
    display: block;
}

.strip-item:hover {
    opacity: 0.85;
}

.strip-item.active {
    opacity: 1;
    border-color: #fff;
}

/* open/close fade */
.viewer-enter-active,
.viewer-leave-active {
    transition: opacity 160ms ease;
}

.viewer-enter-from,
.viewer-leave-to {
    opacity: 0;
}

@media (max-width: 640px) {
    .viewer-nav {
        font-size: 32px;
        padding: 0 8px;
    }

    .viewer-image {
        height: auto;
        max-width: 94vw;
        max-height: 70vh;
        width: min(94vw, calc(70vh * var(--ar)));
    }
}

@media (prefers-reduced-motion: reduce) {
    .gallery-item,
    .gallery-thumb,
    .viewer-enter-active,
    .viewer-leave-active {
        transition: none !important;
    }

    .gallery-item:hover,
    .gallery-item:focus-visible,
    .gallery-thumb {
        transform: none !important;
    }
}
</style>
