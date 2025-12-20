<template>
    <div v-if="isOpen && !isMinimized" class="youtube-container"
        :class="{ 'mobile-mode': mobileMode, 'maximized': isMaximized }" :style="windowStyle">
        <!-- Modern Header -->
        <div v-if="mobileMode" class="mobile-header">
            <button class="back-btn" @click="close">
                <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" stroke-width="2" fill="none">
                    <path d="M15 18l-6-6 6-6" />
                </svg>
                <span>Back</span>
            </button>
            <div class="mobile-center">
                <span class="mobile-title">{{ currentVideo ? currentVideo.title : 'YouTube' }}</span>
            </div>
            <button class="playlist-btn-mobile" @click="playlistOpen = !playlistOpen" :class="{ active: playlistOpen }">
                <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" stroke-width="2" fill="none">
                    <path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01" />
                </svg>
            </button>
        </div>

        <div v-else class="youtube-header" @mousedown="startDrag">
            <div class="window-controls">
                <div class="window-dot close" @click.stop="close">
                    <svg viewBox="0 0 12 12">
                        <path d="M4 4l4 4m0-4L4 8" stroke="currentColor" stroke-width="1.2" />
                    </svg>
                </div>
                <div class="window-dot minimize" @click.stop="minimize">
                    <svg viewBox="0 0 12 12">
                        <path d="M2.5 6h7" stroke="currentColor" stroke-width="1.2" />
                    </svg>
                </div>
                <div class="window-dot maximize" @click.stop="toggleMaximize">
                    <svg viewBox="0 0 12 12">
                        <path d="M3 3h6v6H3z" stroke="currentColor" stroke-width="1.2" fill="none" />
                    </svg>
                </div>
            </div>
            <div class="window-title">
                <svg viewBox="0 0 24 24" width="16" height="16" fill="#FF0000">
                    <path
                        d="M23.5 6.2c-.3-1.1-1.1-1.9-2.2-2.2C19.3 3.5 12 3.5 12 3.5s-7.3 0-9.3.5c-1.1.3-1.9 1.1-2.2 2.2C0 8.2 0 12 0 12s0 3.8.5 5.8c.3 1.1 1.1 1.9 2.2 2.2 2 1 9.3 1 9.3 1s7.3 0 9.3-.5c1.1-.3 1.9-1.1 2.2-2.2.5-2 .5-5.8.5-5.8s0-3.8-.5-5.8z" />
                    <path d="M9.6 15.3l6.2-3.3-6.2-3.3v6.6z" fill="white" />
                </svg>
                <span>YouTube Player</span>
            </div>
            <div class="header-right"></div>
        </div>

        <div class="youtube-body">
            <!-- Desktop Layout -->
            <template v-if="!mobileMode">
                <div class="video-list-sidebar">
                    <div class="sidebar-header">
                        <h3>Playlist</h3>
                        <span class="video-count">{{ videos.length }} videos</span>
                    </div>
                    <div class="sidebar-scroll">
                        <div class="video-item" v-for="video in videos" :key="video.id"
                            :class="{ active: currentVideo && currentVideo.id === video.id }"
                            @click="selectVideo(video)">
                            <div class="video-thumb">
                                <div v-if="!video.loaded" class="thumb-skeleton"></div>
                                <img v-show="video.loaded" :src="`https://img.youtube.com/vi/${video.id}/mqdefault.jpg`"
                                    :alt="video.title" @load="video.loaded = true" @error="video.loaded = true" />
                                <div class="play-overlay">
                                    <svg viewBox="0 0 24 24" width="24" height="24" fill="white">
                                        <path d="M8 5v14l11-7z" />
                                    </svg>
                                </div>
                            </div>
                            <div class="video-info">
                                <div v-if="!video.loaded" class="title-skeleton"></div>
                                <div v-else class="video-title-wrap">
                                    <div class="video-title">{{ video.title }}</div>
                                    <div class="video-meta">YouTube • Portfolio</div>
                                </div>
                            </div>
                            <div v-if="currentVideo && currentVideo.id === video.id" class="playing-indicator">
                                <span></span><span></span><span></span>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="main-player-area">
                    <div class="player-wrapper">
                        <div v-if="isLoading" class="player-skeleton-v2">
                            <div class="shimmer"></div>
                        </div>
                        <div v-else-if="currentVideo" class="player-view">
                            <iframe :src="currentVideo.embedUrl + '?autoplay=0&rel=0&modestbranding=1'" frameborder="0"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowfullscreen width="100%" height="100%" @load="playerLoaded = true"></iframe>
                        </div>
                        <div v-else class="empty-player">
                            <div class="empty-icon-v2">
                                <svg viewBox="0 0 24 24" width="64" height="64" fill="currentColor" opacity="0.2">
                                    <path
                                        d="M21 16.5l-9-5.2v10.4l9-5.2zm-9-15l-9 5.2v10.4l9 5.2 9-5.2V6.7l-9-5.2zm7 13.9l-7 4-7-4V6.7l7-4 7 4v8.7z" />
                                </svg>
                            </div>
                            <p>Select a video to start watching</p>
                        </div>
                    </div>
                    <div class="video-details" v-if="currentVideo && !isLoading">
                        <div class="details-left">
                            <h2 class="playing-title">{{ currentVideo.title }}</h2>
                            <p class="playing-meta">4.2K views • Published in Portfolio</p>
                        </div>
                        <div class="details-right">
                            <button class="action-btn">
                                <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor"
                                    stroke-width="2">
                                    <path d="M14 9l-5 5 5 5M9 14h12" />
                                </svg>
                                <span>Share</span>
                            </button>
                        </div>
                    </div>
                </div>
            </template>

            <!-- Mobile Layout -->
            <template v-else>
                <div class="mobile-player-v2">
                    <div class="video-stage">
                        <div v-if="isLoading" class="mobile-skeleton">
                            <div class="shimmer"></div>
                        </div>
                        <div v-else-if="currentVideo" class="mobile-iframe-container">
                            <iframe :src="currentVideo.embedUrl + '?autoplay=0&rel=0&modestbranding=1'" frameborder="0"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowfullscreen width="100%" height="100%"></iframe>
                        </div>
                    </div>

                    <div class="mobile-video-info" v-if="currentVideo && !isLoading">
                        <h1 class="mobile-active-title">{{ currentVideo.title }}</h1>
                        <div class="mobile-stats">
                            <span>Portfolio Project</span>
                            <span>•</span>
                            <span>YouTube Video</span>
                        </div>
                        <div class="mobile-actions">
                            <button class="mob-action"><span class="icon">👍</span><span>Like</span></button>
                            <button class="mob-action"><span class="icon">🔗</span><span>Share</span></button>
                            <button class="mob-action"><span class="icon">➕</span><span>Save</span></button>
                        </div>
                    </div>

                    <!-- Next Up Section -->
                    <div class="mobile-next-up">
                        <div class="section-title">Up Next</div>
                        <div class="mobile-list-content">
                            <div class="video-item mini" v-for="video in videos" :key="'mob-' + video.id"
                                :class="{ active: currentVideo && currentVideo.id === video.id }"
                                @click="selectVideo(video)">
                                <div class="item-inner">
                                    <div class="mini-thumb">
                                        <img :src="`https://img.youtube.com/vi/${video.id}/default.jpg`"
                                            :alt="video.title" />
                                    </div>
                                    <div class="mini-info">
                                        <div class="mini-title">{{ video.title }}</div>
                                        <div class="mini-meta">Pathum • Portfolio</div>
                                    </div>
                                    <div v-if="currentVideo && currentVideo.id === video.id" class="wave-indicator">
                                        <div class="bar"></div>
                                        <div class="bar"></div>
                                        <div class="bar"></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </template>
        </div>

        <!-- Mobile Playlist Drawer Overlay -->
        <div v-if="mobileMode && playlistOpen" class="drawer-overlay" @click="playlistOpen = false"></div>
        <div v-if="mobileMode" class="mobile-playlist-drawer" :class="{ open: playlistOpen }">
            <div class="drawer-handle" @click="playlistOpen = false"></div>
            <div class="drawer-header">
                <h3>Playlist</h3>
                <button class="close-drawer" @click="playlistOpen = false">DONE</button>
            </div>
            <div class="drawer-content">
                <div class="video-item-drawer" v-for="video in videos" :key="'drawer-' + video.id"
                    :class="{ active: currentVideo && currentVideo.id === video.id }"
                    @click="selectVideo(video); playlistOpen = false">
                    <img :src="`https://img.youtube.com/vi/${video.id}/default.jpg`" :alt="video.title"
                        class="drawer-thumb" />
                    <div class="drawer-info">
                        <div class="drawer-title">{{ video.title }}</div>
                        <div class="drawer-meta">Portfolio Project</div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Resize Handles for Desktop -->
        <template v-if="!mobileMode && !isMaximized">
            <div class="resize-handle r" @mousedown="startResize($event, 'right')"></div>
            <div class="resize-handle b" @mousedown="startResize($event, 'bottom')"></div>
            <div class="resize-handle se" @mousedown="startResize($event, 'corner')"></div>
        </template>
    </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';
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

const videos = ref(youtubeVideos.map(v => ({ ...v, loaded: false })));
const currentVideo = ref(null);
const isMaximized = ref(false);
const isLoading = ref(false);
const playerLoaded = ref(false);
const playlistOpen = ref(false);
let previousStyle = null;

// Window state
const initialWidth = Math.min(960, window.innerWidth - 80);
const initialHeight = Math.min(680, window.innerHeight - 120);

const windowStyle = ref(props.mobileMode ? {
    left: '0px',
    top: '0px',
    width: '100vw',
    height: '100vh'
} : {
    left: ((window.innerWidth - initialWidth) / 2) + 'px',
    top: '60px',
    width: initialWidth + 'px',
    height: initialHeight + 'px'
});

// Watch for mobile mode changes
watch(() => props.mobileMode, (isMobile) => {
    if (isMobile) {
        windowStyle.value = {
            left: '0px',
            top: '0px',
            width: '100vw',
            height: '100vh'
        };
    } else {
        const w = Math.min(960, window.innerWidth - 80);
        const h = Math.min(680, window.innerHeight - 120);
        windowStyle.value = {
            left: ((window.innerWidth - w) / 2) + 'px',
            top: '60px',
            width: w + 'px',
            height: h + 'px'
        };
    }
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
        newWidth = Math.max(600, resizeStartWidth + deltaX);
    }
    if (resizeDirection === 'bottom' || resizeDirection === 'corner') {
        newHeight = Math.max(400, resizeStartHeight + deltaY);
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

    // Smooth transition simulation
    setTimeout(() => {
        playerLoaded.value = true;
        setTimeout(() => {
            isLoading.value = false;
        }, 300);
    }, 600);
}

onMounted(() => {
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
    background: rgba(15, 15, 20, 0.85);
    backdrop-filter: blur(25px);
    -webkit-backdrop-filter: blur(25px);
    border-radius: 20px;
    overflow: hidden;
    box-shadow:
        0 30px 60px rgba(0, 0, 0, 0.5),
        0 0 0 1px rgba(255, 255, 255, 0.08);
    z-index: 500;
    transition: transform 0.3s cubic-bezier(0.2, 0, 0, 1), opacity 0.3s ease;
}

.youtube-container.maximized {
    border-radius: 0;
}

/* Header Styles */
.youtube-header {
    height: 44px;
    background: rgba(30, 30, 40, 0.4);
    border-bottom: 1px solid rgba(255, 255, 255, 0.05);
    display: flex;
    align-items: center;
    padding: 0 16px;
    cursor: move;
    user-select: none;
    justify-content: space-between;
}

.window-controls {
    display: flex;
    gap: 8px;
    width: 60px;
}

.window-dot {
    width: 12px;
    height: 12px;
    border-radius: 50%;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.2s ease;
}

.window-dot svg {
    width: 8px;
    height: 8px;
    opacity: 0;
    color: rgba(0, 0, 0, 0.5);
    transition: opacity 0.2s ease;
}

.window-dot:hover svg {
    opacity: 1;
}

.window-dot.close {
    background: #ff5f57;
}

.window-dot.minimize {
    background: #febc2e;
}

.window-dot.maximize {
    background: #28c840;
}

.window-title {
    display: flex;
    align-items: center;
    gap: 8px;
    color: rgba(255, 255, 255, 0.8);
    font-size: 13px;
    font-weight: 600;
    letter-spacing: 0.2px;
}

.header-right {
    width: 60px;
}

/* Body Layout */
.youtube-body {
    flex: 1;
    display: flex;
    overflow: hidden;
}

/* Sidebar Playlist */
.video-list-sidebar {
    width: 300px;
    background: rgba(0, 0, 0, 0.2);
    border-right: 1px solid rgba(255, 255, 255, 0.05);
    display: flex;
    flex-direction: column;
}

.sidebar-header {
    padding: 20px 16px;
}

.sidebar-header h3 {
    margin: 0;
    font-size: 18px;
    color: #fff;
    font-weight: 700;
}

.video-count {
    font-size: 12px;
    color: rgba(255, 255, 255, 0.4);
    margin-top: 4px;
    display: block;
}

.sidebar-scroll {
    flex: 1;
    overflow-y: auto;
    padding: 0 8px 20px;
}

.sidebar-scroll::-webkit-scrollbar {
    width: 4px;
}

.sidebar-scroll::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.1);
    border-radius: 10px;
}

.video-item {
    display: flex;
    padding: 10px;
    gap: 12px;
    border-radius: 12px;
    cursor: pointer;
    transition: all 0.2s ease;
    margin-bottom: 4px;
    position: relative;
}

.video-item:hover {
    background: rgba(255, 255, 255, 0.05);
}

.video-item.active {
    background: rgba(255, 255, 255, 0.08);
}

.video-thumb {
    width: 100px;
    height: 56px;
    border-radius: 8px;
    overflow: hidden;
    position: relative;
    flex-shrink: 0;
    background: #000;
}

.video-thumb img {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.play-overlay {
    position: absolute;
    inset: 0;
    background: rgba(0, 0, 0, 0.4);
    display: flex;
    align-items: center;
    justify-content: center;
    opacity: 0;
    transition: opacity 0.2s ease;
}

.video-item:hover .play-overlay {
    opacity: 1;
}

.video-info {
    flex: 1;
    min-width: 0;
    display: flex;
    flex-direction: column;
    justify-content: center;
}

.video-title {
    color: #fff;
    font-size: 13px;
    font-weight: 500;
    line-height: 1.4;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
}

.video-meta {
    font-size: 11px;
    color: rgba(255, 255, 255, 0.4);
    margin-top: 4px;
}

/* Playing Indicator */
.playing-indicator {
    position: absolute;
    right: 12px;
    top: 50%;
    transform: translateY(-50%);
    display: flex;
    align-items: flex-end;
    gap: 2px;
    height: 12px;
}

.playing-indicator span {
    width: 2px;
    background: #FF0000;
    animation: wave 1s ease-in-out infinite;
}

.playing-indicator span:nth-child(2) {
    animation-delay: 0.2s;
    height: 100%;
}

.playing-indicator span:nth-child(1) {
    height: 60%;
}

.playing-indicator span:nth-child(3) {
    animation-delay: 0.4s;
    height: 80%;
}

@keyframes wave {

    0%,
    100% {
        height: 30%;
    }

    50% {
        height: 100%;
    }
}

/* Main Player Area */
.main-player-area {
    flex: 1;
    display: flex;
    flex-direction: column;
    padding: 24px;
    background: #0f0f0f;
}

.player-wrapper {
    width: 100%;
    aspect-ratio: 16/9;
    background: #000;
    border-radius: 12px;
    overflow: hidden;
    position: relative;
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.4);
}

.player-view {
    width: 100%;
    height: 100%;
}

.player-skeleton-v2 {
    width: 100%;
    height: 100%;
    background: #1a1a1a;
    position: relative;
    overflow: hidden;
}

.shimmer {
    position: absolute;
    inset: 0;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.05), transparent);
    transform: translateX(-100%);
    animation: shimmer 2s infinite;
}

@keyframes shimmer {
    100% {
        transform: translateX(100%);
    }
}

.video-details {
    margin-top: 20px;
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
}

.playing-title {
    font-size: 20px;
    font-weight: 700;
    color: #fff;
    margin: 0;
}

.playing-meta {
    font-size: 14px;
    color: rgba(255, 255, 255, 0.5);
    margin: 6px 0 0;
}

.action-btn {
    display: flex;
    align-items: center;
    gap: 8px;
    background: rgba(255, 255, 255, 0.1);
    border: none;
    color: #fff;
    padding: 8px 16px;
    border-radius: 20px;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    transition: background 0.2s ease;
}

.action-btn:hover {
    background: rgba(255, 255, 255, 0.2);
}

/* Mobile Mode Styles */
.mobile-mode {
    border-radius: 0 !important;
}

.mobile-header {
    height: 56px;
    display: flex;
    align-items: center;
    padding: 0 16px;
    background: #0f0f0f;
    border-bottom: 1px solid rgba(255, 255, 255, 0.05);
}

.back-btn {
    background: none;
    border: none;
    color: #fff;
    display: flex;
    align-items: center;
    gap: 4px;
    font-size: 16px;
    padding: 0;
    min-width: 60px;
}

.mobile-center {
    flex: 1;
    text-align: center;
    padding: 0 12px;
    min-width: 0;
}

.mobile-title {
    font-size: 15px;
    font-weight: 600;
    color: #fff;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    display: block;
}

.playlist-btn-mobile {
    background: none;
    border: none;
    color: #fff;
    width: 40px;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    min-width: 40px;
}

.playlist-btn-mobile.active {
    background: rgba(255, 255, 255, 0.1);
    color: #FF0000;
}

.mobile-player-v2 {
    flex: 1;
    display: flex;
    flex-direction: column;
    overflow-y: auto;
    background: #0f0f0f;
}

.video-stage {
    width: 100%;
    aspect-ratio: 16/9;
    background: #000;
    position: sticky;
    top: 0;
    z-index: 10;
}

.mobile-iframe-container {
    width: 100%;
    height: 100%;
}

.mobile-video-info {
    padding: 16px;
}

.mobile-active-title {
    font-size: 18px;
    font-weight: 700;
    color: #fff;
    margin: 0;
    line-height: 1.4;
}

.mobile-stats {
    display: flex;
    gap: 8px;
    font-size: 12px;
    color: rgba(255, 255, 255, 0.5);
    margin-top: 8px;
}

.mobile-actions {
    display: flex;
    justify-content: space-between;
    margin-top: 20px;
    padding-bottom: 20px;
    border-bottom: 1px solid rgba(255, 255, 255, 0.05);
}

.mob-action {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 6px;
    background: none;
    border: none;
    color: #fff;
    font-size: 11px;
}

.mob-action .icon {
    font-size: 20px;
}

.mobile-next-up {
    padding: 16px;
}

.section-title {
    font-size: 14px;
    font-weight: 600;
    color: #fff;
    margin-bottom: 12px;
}

.video-item.mini {
    margin-bottom: 12px;
}

.item-inner {
    display: flex;
    gap: 12px;
    align-items: center;
}

.mini-thumb {
    width: 120px;
    aspect-ratio: 16/9;
    background: #1a1a1a;
    border-radius: 8px;
    overflow: hidden;
}

.mini-thumb img {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.mini-info {
    flex: 1;
}

.mini-title {
    color: #fff;
    font-size: 13px;
    font-weight: 500;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
}

.mini-meta {
    font-size: 11px;
    color: rgba(255, 255, 255, 0.5);
    margin-top: 4px;
}

/* Drawer Styles */
.drawer-overlay {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.6);
    backdrop-filter: blur(4px);
    z-index: 1000;
}

.mobile-playlist-drawer {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    background: #0f0f0f;
    border-radius: 20px 20px 0 0;
    z-index: 1001;
    transform: translateY(100%);
    transition: transform 0.4s cubic-bezier(0.3, 0, 0.1, 1);
    max-height: 80vh;
    display: flex;
    flex-direction: column;
    padding-bottom: env(safe-area-inset-bottom);
}

.mobile-playlist-drawer.open {
    transform: translateY(0);
}

.drawer-handle {
    width: 40px;
    height: 4px;
    background: rgba(255, 255, 255, 0.2);
    border-radius: 2px;
    margin: 12px auto;
}

.drawer-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 20px 16px;
    border-bottom: 1px solid rgba(255, 255, 255, 0.05);
}

.drawer-header h3 {
    margin: 0;
    color: #fff;
    font-size: 18px;
}

.close-drawer {
    background: none;
    border: none;
    color: #3ea6ff;
    font-weight: 600;
    font-size: 14px;
}

.drawer-content {
    flex: 1;
    overflow-y: auto;
    padding: 16px;
}

.video-item-drawer {
    display: flex;
    gap: 16px;
    padding: 12px 0;
    border-bottom: 1px solid rgba(255, 255, 255, 0.03);
}

.drawer-thumb {
    width: 100px;
    aspect-ratio: 16/9;
    border-radius: 8px;
    object-fit: cover;
}

.drawer-info {
    flex: 1;
}

.drawer-title {
    color: #fff;
    font-size: 14px;
    font-weight: 500;
}

.drawer-meta {
    font-size: 12px;
    color: rgba(255, 255, 255, 0.5);
    margin-top: 4px;
}

/* Resize Handles */
.resize-handle {
    position: absolute;
    z-index: 10;
}

.resize-handle.r {
    top: 0;
    bottom: 0;
    right: 0;
    width: 6px;
    cursor: ew-resize;
}

.resize-handle.b {
    left: 0;
    right: 0;
    bottom: 0;
    height: 6px;
    cursor: ns-resize;
}

.resize-handle.se {
    right: 0;
    bottom: 0;
    width: 12px;
    height: 12px;
    cursor: nwse-resize;
}

/* Empty Player State */
.empty-player {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    color: rgba(255, 255, 255, 0.3);
}

.empty-icon-v2 {
    margin-bottom: 16px;
}

@media (max-width: 768px) {
    .video-list-sidebar {
        display: none;
    }
}
</style>
