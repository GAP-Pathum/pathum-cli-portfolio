<template>
    <div v-if="isOpen" class="gallery-app" @touchstart.stop @touchmove.stop="handleGalleryTouchMove" @touchend.stop>
        <div class="gallery-header-mobile">
            <button class="gallery-back" @click="closeGallery()">
                ‹ {{ lightboxOpen ? 'Gallery' : 'Back' }}
            </button>
            <span class="gallery-title">{{ lightboxOpen ? `${currentPhotoIndex + 1} of ${photos.length}` : 'Photos' }}</span>
            <span class="gallery-spacer"></span>
        </div>

        <!-- Photo Grid -->
        <div v-if="!lightboxOpen" class="photo-grid-mobile">
            <div v-for="(photo, index) in photos" :key="photo.id" class="photo-item-mobile"
                @click="openLightbox(index)">
                <img :src="photo.src" :alt="photo.title" loading="lazy" />
            </div>
        </div>

        <!-- Lightbox -->
        <div v-else class="lightbox-mobile" @touchstart="handleLightboxTouchStart"
            @touchmove="handleLightboxTouchMove" @touchend="handleLightboxTouchEnd">
            <img :src="photos[currentPhotoIndex].src" :alt="photos[currentPhotoIndex].title"
                :style="{ transform: `translateX(${lightboxSwipeX}px)` }" />
            <div class="lightbox-dots">
                <span v-for="(_, index) in photos" :key="index" class="dot"
                    :class="{ active: index === currentPhotoIndex }"></span>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import { photos } from '../data/photos.js';

const props = defineProps({
    isOpen: {
        type: Boolean,
        default: false
    }
});

const emit = defineEmits(['close']);

// Gallery state
const lightboxOpen = ref(false);
const currentPhotoIndex = ref(0);
const lightboxSwipeX = ref(0);
let lightboxTouchStartX = 0;

function closeGallery() {
    emit('close');
    lightboxOpen.value = false;
    currentPhotoIndex.value = 0;
}

function openLightbox(index) {
    currentPhotoIndex.value = index;
    lightboxOpen.value = true;
}

function closeLightbox() {
    lightboxOpen.value = false;
    lightboxSwipeX.value = 0;
}

function nextPhoto() {
    currentPhotoIndex.value = (currentPhotoIndex.value + 1) % photos.length;
}

function prevPhoto() {
    currentPhotoIndex.value = (currentPhotoIndex.value - 1 + photos.length) % photos.length;
}

// Lightbox swipe handlers
function handleLightboxTouchStart(e) {
    lightboxTouchStartX = e.touches[0].clientX;
}

function handleLightboxTouchMove(e) {
    const diff = e.touches[0].clientX - lightboxTouchStartX;
    lightboxSwipeX.value = diff;
}

function handleLightboxTouchEnd() {
    if (lightboxSwipeX.value < -50) {
        nextPhoto();
    } else if (lightboxSwipeX.value > 50) {
        prevPhoto();
    }
    lightboxSwipeX.value = 0;
}

// Gallery touch move handler (allows scrolling in gallery)
function handleGalleryTouchMove(e) {
    // Allow default touch behavior for scrolling in gallery
}
</script>

<style scoped>
/* Gallery App */
.gallery-app {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: #000;
    z-index: 500;
    display: flex;
    flex-direction: column;
    touch-action: auto;
}

.gallery-header-mobile {
    height: 56px;
    background: rgba(30, 30, 30, 0.95);
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 16px;
    flex-shrink: 0;
}

.gallery-back {
    background: none;
    border: none;
    color: #007AFF;
    font-size: 17px;
    padding: 8px 0;
    cursor: pointer;
    min-width: 80px;
    text-align: left;
}

.gallery-title {
    color: white;
    font-size: 17px;
    font-weight: 600;
}

.gallery-spacer {
    min-width: 80px;
}

/* Mobile Photo Grid */
.photo-grid-mobile {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 2px;
    padding: 2px;
    overflow-y: auto;
    flex: 1;
}

.photo-item-mobile {
    aspect-ratio: 1;
    overflow: hidden;
    cursor: pointer;
}

.photo-item-mobile img {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

/* Mobile Lightbox */
.lightbox-mobile {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background: #000;
    overflow: hidden;
}

.lightbox-mobile img {
    max-width: 100%;
    max-height: calc(100vh - 120px);
    object-fit: contain;
    transition: transform 0.1s ease-out;
}

.lightbox-dots {
    position: absolute;
    bottom: 40px;
    display: flex;
    gap: 6px;
}

.lightbox-dots .dot {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.4);
    transition: background 0.2s;
}

.lightbox-dots .dot.active {
    background: white;
}
</style>