<template>
    <div v-if="isOpen && !isMinimized" class="youtube-container" :class="{ 'mobile-mode': mobileMode }" :style="windowStyle">
        <!-- Mobile Header -->
        <div v-if="mobileMode" class="mobile-header">
            <button class="back-btn" @click="close">‹ Back</button>
            <span class="mobile-title">{{ currentVideo ? currentVideo.title : 'YouTube' }}</span>
            <button class="playlist-btn" @click="playlistOpen = !playlistOpen">
                <span class="playlist-icon">📋</span>
            </button>
        </div>

        <!-- Desktop Header -->
        <div v-else class="youtube-header" @mousedown="startDrag">
            <div class="window-controls">
                <div class="window-dot close" @click.stop="close"></div>
                <div class="window-dot minimize" @click.stop="minimize"></div>
                <div class="window-dot maximize" @click.stop="toggleMaximize"></div>
            </div>
            <div class="window-title">YouTube Player</div>
        </div>

        <div class="youtube-body">
            <!-- Desktop Layout -->
            <template v-if="!mobileMode">
                <div class="video-list">
                    <h3>Playlist</h3>
                    <div class="video-item" v-for="video in videos" :key="video.id" :class="{ active: currentVideo && currentVideo.id === video.id }" @click="selectVideo(video)">
                        <div class="video-thumb">
                            <div v-if="!video.loaded" class="thumb-skeleton"></div>
                            <img 
                                v-else
                                :src="`https://img.youtube.com/vi/${video.id}/default.jpg`" 
                                :alt="video.title"
                                @load="video.loaded = true"
                                @error="video.loaded = true"
                            />
                        </div>
                        <div class="video-info">
                            <div v-if="!video.loaded" class="title-skeleton"></div>
                            <div v-else class="video-title">{{ video.title }}</div>
                        </div>
                    </div>
                </div>
                <div class="video-player">
                    <div v-if="isLoading" class="player-skeleton">
                        <div class="skeleton-video"></div>
                        <div class="skeleton-controls">
                            <div class="skeleton-play"></div>
                            <div class="skeleton-progress"></div>
                            <div class="skeleton-buttons"></div>
                        </div>
                    </div>
                    <div v-else-if="currentVideo" class="player-container">
                        <div v-if="!playerLoaded" class="loading-overlay">
                            <div class="loading-spinner"></div>
                            <p>Loading video...</p>
                        </div>
                        <iframe
                            :src="currentVideo.embedUrl + '?autoplay=0&rel=0'"
                            frameborder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowfullscreen
                            width="100%"
                            height="100%"
                            @load="playerLoaded = true"
                        ></iframe>
                    </div>
                    <div v-else class="no-video">
                        <div class="no-video-icon">📺</div>
                        <p>Select a video to play</p>
                    </div>
                </div>
            </template>

            <!-- Mobile Layout -->
            <template v-else>
                <div class="video-player mobile-player">
                    <div v-if="isLoading" class="player-skeleton">
                        <div class="skeleton-video"></div>
                        <div class="skeleton-controls">
                            <div class="skeleton-play"></div>
                            <div class="skeleton-progress"></div>
                            <div class="skeleton-buttons"></div>
                        </div>
                    </div>
                    <div v-else-if="currentVideo" class="player-container">
                        <div v-if="!playerLoaded" class="loading-overlay">
                            <div class="loading-spinner"></div>
                            <p>Loading video...</p>
                        </div>
                        <iframe
                            :src="currentVideo.embedUrl + '?autoplay=0&rel=0'"
                            frameborder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowfullscreen
                            width="100%"
                            height="100%"
                            @load="playerLoaded = true"
                        ></iframe>
                    </div>
                    <div v-else class="no-video">
                        <div class="no-video-icon">📺</div>
                        <p>Select a video to play</p>
                    </div>

                    <!-- Playlist Toggle Button -->
                    <button class="playlist-toggle" @click="playlistOpen = !playlistOpen">
                        <span class="toggle-icon">{{ playlistOpen ? '▼' : '▲' }}</span>
                        <span class="toggle-text">Playlist ({{ videos.length }})</span>
                    </button>
                </div>

                <!-- Mobile Playlist Drawer -->
                <div class="mobile-playlist" :class="{ open: playlistOpen }">
                    <div class="playlist-header">
                        <h3>Playlist</h3>
                        <button class="close-playlist" @click="playlistOpen = false">×</button>
                    </div>
                    <div class="playlist-content">
                        <div class="video-item" v-for="video in videos" :key="video.id" :class="{ active: currentVideo && currentVideo.id === video.id }" @click="selectVideo(video); playlistOpen = false">
                            <div class="video-thumb">
                                <div v-if="!video.loaded" class="thumb-skeleton"></div>
                                <img 
                                    v-else
                                    :src="`https://img.youtube.com/vi/${video.id}/default.jpg`" 
                                    :alt="video.title"
                                    @load="video.loaded = true"
                                    @error="video.loaded = true"
                                />
                            </div>
                            <div class="video-info">
                                <div v-if="!video.loaded" class="title-skeleton"></div>
                                <div v-else class="video-title">{{ video.title }}</div>
                            </div>
                        </div>
                    </div>
                </div>
            </template>
        </div>

        <!-- Resize Handles -->
        <div class="resize-handle resize-right" @mousedown="startResize($event, 'right')"></div>
        <div class="resize-handle resize-bottom" @mousedown="startResize($event, 'bottom')"></div>
        <div class="resize-handle resize-corner" @mousedown="startResize($event, 'corner')"></div>
    </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { youtubeVideos } from '../data/youtubeVideos.js';

const props = defineProps({
    isOpen: {
        type: Boolean,
        default: false
    },
    isMinimized: {
        type: Boolean,
        default: false
    },
    mobileMode: {
        type: Boolean,
        default: false
    }
});

const emit = defineEmits(['close', 'minimize', 'maximize']);

const videos = ref(youtubeVideos);
const currentVideo = ref(null);
const isMaximized = ref(false);
const isLoading = ref(false);
const playerLoaded = ref(false);
const playlistOpen = ref(false);
let previousStyle = null;

// Window state
const windowStyle = ref(props.mobileMode ? {
    left: '0px',
    top: '0px',
    width: '100vw',
    height: '100vh'
} : {
    left: '400px',
    top: '100px',
    width: Math.min(800, window.innerWidth - 300) + 'px',
    height: Math.min(600, window.innerHeight - 150) + 'px'
});

// Dragging state
let isDragging = false;
let startX = 0;
let startY = 0;
let offsetX = 0;
let offsetY = 0;

// Resizing state
let isResizing = false;
let resizeDirection = null;
let resizeStartX = 0;
let resizeStartY = 0;
let resizeStartWidth = 0;
let resizeStartHeight = 0;

// Functions
function close() {
    emit('close');
}

function minimize() {
    emit('minimize');
}

function toggleMaximize() {
    if (isMaximized.value) {
        windowStyle.value = { ...previousStyle };
        isMaximized.value = false;
        emit('maximize', false);
    } else {
        previousStyle = { ...windowStyle.value };
        windowStyle.value = {
            left: '0px',
            top: '0px',
            width: '100vw',
            height: '100vh'
        };
        isMaximized.value = true;
        emit('maximize', true);
    }
}

function startDrag(event) {
    if (isMaximized.value || props.mobileMode) return;
    isDragging = true;
    startX = event.clientX;
    startY = event.clientY;
    offsetX = event.clientX - parseInt(windowStyle.value.left);
    offsetY = event.clientY - parseInt(windowStyle.value.top);
    document.addEventListener('mousemove', drag);
    document.addEventListener('mouseup', stopDrag);
}

function drag(event) {
    if (!isDragging) return;
    const newLeft = event.clientX - offsetX;
    const newTop = event.clientY - offsetY;
    windowStyle.value.left = Math.max(0, newLeft) + 'px';
    windowStyle.value.top = Math.max(0, newTop) + 'px';
}

function stopDrag() {
    isDragging = false;
    document.removeEventListener('mousemove', drag);
    document.removeEventListener('mouseup', stopDrag);
}

function startResize(event, direction) {
    if (isMaximized.value || props.mobileMode) return;
    isResizing = true;
    resizeDirection = direction;
    resizeStartX = event.clientX;
    resizeStartY = event.clientY;
    resizeStartWidth = parseInt(windowStyle.value.width);
    resizeStartHeight = parseInt(windowStyle.value.height);
    document.addEventListener('mousemove', resize);
    document.addEventListener('mouseup', stopResize);
}

function resize(event) {
    if (!isResizing) return;
    const deltaX = event.clientX - resizeStartX;
    const deltaY = event.clientY - resizeStartY;
    let newWidth = resizeStartWidth;
    let newHeight = resizeStartHeight;

    if (resizeDirection === 'right' || resizeDirection === 'corner') {
        newWidth = Math.max(400, resizeStartWidth + deltaX);
    }
    if (resizeDirection === 'bottom' || resizeDirection === 'corner') {
        newHeight = Math.max(300, resizeStartHeight + deltaY);
    }

    windowStyle.value.width = newWidth + 'px';
    windowStyle.value.height = newHeight + 'px';
}

function stopResize() {
    isResizing = false;
    document.removeEventListener('mousemove', resize);
    document.removeEventListener('mouseup', stopResize);
}

function selectVideo(video) {
    if (currentVideo.value && currentVideo.value.id === video.id) return;
    
    isLoading.value = true;
    playerLoaded.value = false;
    currentVideo.value = video;
    
    // Simulate network latency for realistic loading
    setTimeout(() => {
        playerLoaded.value = true;
        setTimeout(() => {
            isLoading.value = false;
        }, 500);
    }, 800 + Math.random() * 1200); // 800-2000ms random delay
}

onMounted(() => {
    // Preload thumbnails
    videos.value.forEach(video => {
        video.loaded = false;
        const img = new Image();
        img.onload = () => {
            video.loaded = true;
        };
        img.src = `https://img.youtube.com/vi/${video.id}/default.jpg`;
    });
    
    if (videos.value.length > 0) {
        currentVideo.value = videos.value[0];
        selectVideo(videos.value[0]);
    }
});
</script>

<style scoped>
.youtube-container {
    position: fixed;
    display: flex;
    flex-direction: column;
    background: rgba(30, 30, 46, 0.98);
    backdrop-filter: blur(30px);
    -webkit-backdrop-filter: blur(30px);
    border-radius: 16px;
    overflow: hidden;
    box-shadow: 0 30px 80px rgba(0, 0, 0, 0.6), inset 0 1px 0 rgba(255, 255, 255, 0.1);
    z-index: 500;
    border: 1px solid rgba(255, 255, 255, 0.08);
}

.youtube-header {
    height: 36px;
    background: rgba(45, 45, 65, 0.8);
    border-bottom: 1px solid rgba(255, 255, 255, 0.05);
    display: flex;
    align-items: center;
    padding: 0 12px;
    cursor: move;
    user-select: none;
    -webkit-user-select: none;
}

.window-controls {
    display: flex;
    gap: 8px;
}

.window-dot {
    width: 12px;
    height: 12px;
    border-radius: 50%;
    cursor: pointer;
    border: 0.5px solid rgba(0, 0, 0, 0.2);
    transition: all 0.2s ease;
}

.window-dot:hover {
    transform: scale(1.1);
}

.window-dot.close {
    background: linear-gradient(135deg, #ff6159 0%, #ff5449 100%);
}

.window-dot.minimize {
    background: linear-gradient(135deg, #ffbd44 0%, #ffb529 100%);
}

.window-dot.maximize {
    background: linear-gradient(135deg, #27c93f 0%, #1fb934 100%);
}

.window-title {
    flex: 1;
    text-align: center;
    color: rgba(255, 255, 255, 0.6);
    font-size: 13px;
    font-weight: 600;
    letter-spacing: 0.3px;
    margin-right: 76px;
}

.youtube-body {
    flex: 1;
    display: flex;
    height: calc(100% - 36px);
}

.video-list {
    width: 250px;
    background: rgba(20, 20, 40, 0.5);
    border-right: 1px solid rgba(255, 255, 255, 0.05);
    padding: 16px;
    overflow-y: auto;
}

.video-list h3 {
    color: rgba(255, 255, 255, 0.9);
    font-size: 16px;
    font-weight: 600;
    margin: 0 0 16px 0;
}

.video-item {
    display: flex;
    align-items: center;
    padding: 8px;
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.2s ease;
    margin-bottom: 8px;
}

.video-item:hover {
    background: rgba(255, 255, 255, 0.05);
}

.video-item.active {
    background: rgba(255, 107, 107, 0.2);
    border: 1px solid rgba(255, 107, 107, 0.3);
}

.video-thumb {
    width: 80px;
    height: 45px;
    border-radius: 4px;
    overflow: hidden;
    margin-right: 12px;
}

.video-thumb img {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.video-info {
    flex: 1;
}

.video-title {
    color: rgba(255, 255, 255, 0.9);
    font-size: 13px;
    font-weight: 500;
    line-height: 1.3;
}

.video-player {
    flex: 1;
    padding: 16px;
    display: flex;
    align-items: center;
    justify-content: center;
}

.player-container {
    width: 100%;
    height: 100%;
    border-radius: 8px;
    overflow: hidden;
}

.player-container iframe {
    border-radius: 8px;
}

.no-video {
    text-align: center;
    color: rgba(255, 255, 255, 0.5);
    font-size: 16px;
}

/* Resize Handles */
.resize-handle {
    position: absolute;
    background: transparent;
}

.resize-right {
    right: 0;
    top: 36px;
    bottom: 0;
    width: 10px;
    cursor: ew-resize;
}

.resize-bottom {
    left: 0;
    right: 0;
    bottom: 0;
    height: 10px;
    cursor: ns-resize;
}

.resize-corner {
    right: 0;
    bottom: 0;
    width: 20px;
    height: 20px;
    cursor: nw-resize;
}

/* Mobile Mode Styles */
.mobile-mode .youtube-header {
    display: none;
}

.mobile-mode .resize-handle {
    display: none;
}

.mobile-mode .youtube-container {
    position: static !important;
    border-radius: 0 !important;
    box-shadow: none !important;
    z-index: auto !important;
}

.mobile-mode .youtube-body {
    flex-direction: column;
    height: calc(100vh - 56px);
}

.mobile-mode .video-list {
    width: 100%;
    height: 200px;
    border-right: none;
    border-bottom: 1px solid rgba(255, 255, 255, 0.05);
}

.mobile-mode .video-player {
    flex: 1;
}

/* Mobile Player Enhancements */
.mobile-player {
    position: relative;
}

.playlist-toggle {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    background: rgba(0, 0, 0, 0.8);
    backdrop-filter: blur(10px);
    border: none;
    color: white;
    padding: 12px 16px;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    cursor: pointer;
    font-size: 14px;
    font-weight: 500;
    z-index: 10;
    transition: all 0.3s ease;
}

.playlist-toggle:hover {
    background: rgba(0, 0, 0, 0.9);
}

.toggle-icon {
    font-size: 12px;
    transition: transform 0.3s ease;
}

.mobile-playlist {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    background: rgba(30, 30, 46, 0.98);
    backdrop-filter: blur(30px);
    transform: translateY(100%);
    transition: transform 0.3s ease;
    max-height: 60vh;
    overflow: hidden;
    border-radius: 16px 16px 0 0;
    z-index: 1000;
}

.mobile-playlist.open {
    transform: translateY(0);
}

.playlist-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 16px;
    border-bottom: 1px solid rgba(255, 255, 255, 0.05);
}

.playlist-header h3 {
    margin: 0;
    color: rgba(255, 255, 255, 0.9);
    font-size: 16px;
    font-weight: 600;
}

.close-playlist {
    background: none;
    border: none;
    color: rgba(255, 255, 255, 0.6);
    font-size: 24px;
    cursor: pointer;
    padding: 0;
    width: 32px;
    height: 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    transition: all 0.2s ease;
}

.close-playlist:hover {
    background: rgba(255, 255, 255, 0.1);
    color: white;
}

.playlist-content {
    max-height: calc(60vh - 70px);
    overflow-y: auto;
    padding: 16px;
}

/* Skeleton Loading */
.thumb-skeleton {
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, rgba(255, 255, 255, 0.1) 25%, rgba(255, 255, 255, 0.05) 50%, rgba(255, 255, 255, 0.1) 75%);
    background-size: 200% 100%;
    animation: skeleton-loading 1.5s infinite;
    border-radius: 4px;
}

.title-skeleton {
    height: 13px;
    background: linear-gradient(90deg, rgba(255, 255, 255, 0.1) 25%, rgba(255, 255, 255, 0.05) 50%, rgba(255, 255, 255, 0.1) 75%);
    background-size: 200% 100%;
    animation: skeleton-loading 1.5s infinite;
    border-radius: 4px;
    margin-bottom: 4px;
}

.title-skeleton:last-child {
    width: 70%;
}

.player-skeleton {
    width: 100%;
    height: 100%;
    background: rgba(20, 20, 40, 0.5);
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    border-radius: 8px;
}

.skeleton-video {
    width: 90%;
    height: 70%;
    background: linear-gradient(90deg, rgba(255, 255, 255, 0.1) 25%, rgba(255, 255, 255, 0.05) 50%, rgba(255, 255, 255, 0.1) 75%);
    background-size: 200% 100%;
    animation: skeleton-loading 1.5s infinite;
    border-radius: 8px;
    margin-bottom: 20px;
}

.skeleton-controls {
    width: 90%;
    display: flex;
    flex-direction: column;
    gap: 12px;
}

.skeleton-play {
    width: 60px;
    height: 60px;
    background: linear-gradient(90deg, rgba(255, 255, 255, 0.1) 25%, rgba(255, 255, 255, 0.05) 50%, rgba(255, 255, 255, 0.1) 75%);
    background-size: 200% 100%;
    animation: skeleton-loading 1.5s infinite;
    border-radius: 50%;
    align-self: center;
}

.skeleton-progress {
    width: 100%;
    height: 4px;
    background: linear-gradient(90deg, rgba(255, 255, 255, 0.1) 25%, rgba(255, 255, 255, 0.05) 50%, rgba(255, 255, 255, 0.1) 75%);
    background-size: 200% 100%;
    animation: skeleton-loading 1.5s infinite;
    border-radius: 2px;
}

.skeleton-buttons {
    display: flex;
    justify-content: space-between;
    width: 100%;
}

.skeleton-buttons::before,
.skeleton-buttons::after {
    content: '';
    width: 40px;
    height: 40px;
    background: linear-gradient(90deg, rgba(255, 255, 255, 0.1) 25%, rgba(255, 255, 255, 0.05) 50%, rgba(255, 255, 255, 0.1) 75%);
    background-size: 200% 100%;
    animation: skeleton-loading 1.5s infinite;
    border-radius: 8px;
}

@keyframes skeleton-loading {
    0% {
        background-position: -200% 0;
    }
    100% {
        background-position: 200% 0;
    }
}

/* Loading Overlay */
.loading-overlay {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.7);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    z-index: 10;
    border-radius: 8px;
}

.loading-spinner {
    width: 40px;
    height: 40px;
    border: 3px solid rgba(255, 255, 255, 0.3);
    border-top: 3px solid #ff0000;
    border-radius: 50%;
    animation: spin 1s linear infinite;
    margin-bottom: 16px;
}

.loading-overlay p {
    color: white;
    font-size: 14px;
    font-weight: 500;
    margin: 0;
}

@keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
}

/* Enhanced No Video State */
.no-video {
    text-align: center;
    color: rgba(255, 255, 255, 0.5);
    font-size: 16px;
}

.no-video-icon {
    font-size: 48px;
    margin-bottom: 16px;
    opacity: 0.5;
}

/* Mobile Header Styles */
.mobile-header {
    height: 56px;
    background: rgba(30, 30, 30, 0.95);
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 16px;
    flex-shrink: 0;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.back-btn {
    background: none;
    border: none;
    color: #007AFF;
    font-size: 17px;
    padding: 8px 0;
    cursor: pointer;
    min-width: 80px;
    text-align: left;
}

.mobile-title {
    color: white;
    font-size: 17px;
    font-weight: 600;
    flex: 1;
    text-align: center;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    padding: 0 8px;
}

.playlist-btn {
    background: none;
    border: none;
    color: rgba(255, 255, 255, 0.8);
    font-size: 16px;
    padding: 8px;
    cursor: pointer;
    min-width: 80px;
    text-align: right;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    transition: all 0.2s ease;
}

.playlist-btn:hover {
    color: white;
}

.playlist-icon {
    font-size: 18px;
}

.spacer {
    min-width: 80px;
}

/* Responsive */
@media (max-width: 768px) {
    .video-list {
        width: 200px;
    }
}
</style>