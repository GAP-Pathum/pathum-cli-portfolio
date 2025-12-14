<template>
    <div v-if="isOpen && !isMinimized" class="music-container" :class="{ 'mobile-mode': mobileMode }" :style="windowStyle">
        <!-- Mobile Header -->
        <div v-if="mobileMode" class="mobile-header">
            <button class="back-btn" @click="close">‹ Back</button>
            <span class="mobile-title">Music</span>
            <span class="spacer"></span>
        </div>

        <!-- Desktop Header -->
        <div v-else class="music-header" @mousedown="startDrag">
            <div class="window-controls">
                <div class="window-dot close" @click.stop="close"></div>
                <div class="window-dot minimize" @click.stop="minimize"></div>
                <div class="window-dot maximize" @click.stop="toggleMaximize"></div>
            </div>
            <div class="window-title">Music</div>
        </div>
        <div class="music-body">
            <audio ref="audioElement" :src="tracks[currentTrackIndex].src" @timeupdate="updateTime" @loadedmetadata="updateDuration" @ended="handleTrackEnd"></audio>
            
            <!-- Album Art -->
            <div class="album-art-container">
                <div class="album-art" :style="{ animationPlayState: isPlaying ? 'running' : 'paused' }">
                    <div class="album-placeholder">🎵</div>
                </div>
            </div>

            <div class="music-player">
                <div class="track-info">
                    <h3 class="track-name">{{ tracks[currentTrackIndex].name }}</h3>
                    <p class="track-artist">Now Playing</p>
                </div>

                <div class="time-display">
                    <span class="time">{{ formatTime(currentTime) }}</span>
                    <div class="progress-bar">
                        <div class="progress-fill" :style="{ width: duration ? (currentTime / duration * 100) + '%' : '0%' }"></div>
                        <input type="range" min="0" :max="duration" v-model="currentTime" @input="seek" class="progress-slider">
                    </div>
                    <span class="time">{{ formatTime(duration) }}</span>
                </div>

                <div class="controls">
                    <button @click="toggleShuffle" class="control-btn shuffle-btn" :class="{ active: shuffle }">
                        <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M3 17a4.983 4.983 0 0 1 5 0M3 12a9 9 0 0 1 9 0M3 7a15.3 15.3 0 0 1 15.3 0M12 21v-7M3 9l9-6 9 6M3 12h8M9 3v6"></path>
                        </svg>
                    </button>
                    <button @click="prevTrack" class="control-btn prev-btn">
                        <svg class="icon" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M6 6h2v12H6V6zm3.5 6l8.5 6V6l-8.5 6z"/>
                        </svg>
                    </button>
                    <button @click="togglePlay" class="control-btn play-btn">
                        <svg class="icon-large" v-if="!isPlaying" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M8 5v14l11-7z"/>
                        </svg>
                        <svg class="icon-large" v-else viewBox="0 0 24 24" fill="currentColor">
                            <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z"/>
                        </svg>
                    </button>
                    <button @click="nextTrack" class="control-btn next-btn">
                        <svg class="icon" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M16 18h2V6h-2v12zM2 6v12l8.5-6L2 6z"/>
                        </svg>
                    </button>
                    <button @click="toggleRepeat" class="control-btn repeat-btn" :class="{ active: repeat }">
                        <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <polyline points="17 2 21 6 17 10"></polyline>
                            <path d="M3 11v-1a4 4 0 0 1 4-4h14"></path>
                            <polyline points="7 22 3 18 7 14"></polyline>
                            <path d="M21 13v1a4 4 0 0 1-4 4H3"></path>
                        </svg>
                    </button>
                </div>

                <div class="volume-control">
                    <svg class="icon-small" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.3-2.5-4.04v8.08c1.48-.74 2.5-2.27 2.5-4.04zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/>
                    </svg>
                    <input type="range" min="0" max="1" step="0.01" v-model="volume" @input="changeVolume" class="volume-slider">
                    <span class="volume-percent">{{ Math.round(volume * 100) }}%</span>
                </div>

                <!-- Playlist -->
                <div class="playlist-section">
                    <div class="playlist-header">
                        <h4>Up Next</h4>
                    </div>
                    <div class="playlist">
                        <div v-for="(track, index) in tracks" :key="index" class="playlist-item" :class="{ active: index === currentTrackIndex }" @click="currentTrackIndex = index">
                            <span class="track-number">{{ index + 1 }}</span>
                            <span class="track-title">{{ track.name }}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        
        <!-- Resize Handles -->
        <div class="resize-handle resize-right" @mousedown="startResize($event, 'right')"></div>
        <div class="resize-handle resize-bottom" @mousedown="startResize($event, 'bottom')"></div>
        <div class="resize-handle resize-corner" @mousedown="startResize($event, 'corner')"></div>
    </div>
</template>

<script setup>
import { ref, nextTick } from 'vue';

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

// Music player state
const currentTrackIndex = ref(0);
const isPlaying = ref(false);
const volume = ref(0.7);
const currentTime = ref(0);
const duration = ref(0);
const shuffle = ref(false);
const repeat = ref(false);
const audioElement = ref(null);

const tracks = [
    { name: 'Kuwe Musical Experience by Charitha Attalage', src: '/audio/KuweMusical.mp3' },
    { name: 'Salalihini', src: '/audio/salalihini.mp3' },
    { name: 'ZD8', src: '/audio/ZD8.mp3' }
];

// Window state
const windowStyle = ref(props.mobileMode ? {
    left: '0px',
    top: '0px',
    width: '100vw',
    height: '100vh'
} : {
    left: '300px',
    top: '120px',
    width: Math.min(400, window.innerWidth - 600) + 'px',
    height: Math.min(600, window.innerHeight - 200) + 'px'
});

const isMaximized = ref(false);
let previousStyle = null;

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
    if (audioElement.value) {
        audioElement.value.pause();
        isPlaying.value = false;
    }
}

function minimize() {
    emit('minimize');
}

function toggleMaximize() {
    if (isMaximized.value) {
        // Restore
        windowStyle.value = { ...previousStyle };
        isMaximized.value = false;
        emit('maximize', false);
    } else {
        // Maximize
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
        newWidth = Math.max(300, resizeStartWidth + deltaX);
    }
    if (resizeDirection === 'bottom' || resizeDirection === 'corner') {
        newHeight = Math.max(200, resizeStartHeight + deltaY);
    }

    windowStyle.value.width = newWidth + 'px';
    windowStyle.value.height = newHeight + 'px';
}

function stopResize() {
    isResizing = false;
    document.removeEventListener('mousemove', resize);
    document.removeEventListener('mouseup', stopResize);
}

// Music player functions
function togglePlay() {
    if (!audioElement.value) return;
    if (isPlaying.value) {
        audioElement.value.pause();
    } else {
        audioElement.value.play();
    }
    isPlaying.value = !isPlaying.value;
}

function nextTrack() {
    if (shuffle.value) {
        // Pick a random track different from current
        let newIndex;
        do {
            newIndex = Math.floor(Math.random() * tracks.length);
        } while (newIndex === currentTrackIndex.value && tracks.length > 1);
        currentTrackIndex.value = newIndex;
    } else {
        currentTrackIndex.value = (currentTrackIndex.value + 1) % tracks.length;
    }
    if (isPlaying.value) {
        nextTick(() => {
            audioElement.value.play();
        });
    }
}

function prevTrack() {
    if (shuffle.value) {
        // Pick a random track different from current
        let newIndex;
        do {
            newIndex = Math.floor(Math.random() * tracks.length);
        } while (newIndex === currentTrackIndex.value && tracks.length > 1);
        currentTrackIndex.value = newIndex;
    } else {
        currentTrackIndex.value = currentTrackIndex.value === 0 ? tracks.length - 1 : currentTrackIndex.value - 1;
    }
    if (isPlaying.value) {
        nextTick(() => {
            audioElement.value.play();
        });
    }
}

function toggleRepeat() {
    repeat.value = !repeat.value;
}

function handleTrackEnd() {
    if (repeat.value) {
        // Replay the same track
        nextTick(() => {
            audioElement.value.play();
        });
    } else {
        nextTrack();
    }
}

function updateTime() {
    if (audioElement.value) {
        currentTime.value = audioElement.value.currentTime;
    }
}

function updateDuration() {
    if (audioElement.value) {
        duration.value = audioElement.value.duration;
    }
}

function seek(e) {
    if (audioElement.value) {
        audioElement.value.currentTime = currentTime.value;
    }
}

function changeVolume() {
    if (audioElement.value) {
        audioElement.value.volume = volume.value;
    }
}

function formatTime(time) {
    if (!time || isNaN(time)) return '0:00';
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
}
</script>

<style scoped>
.music-container {
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

.music-header {
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

.music-body {
    flex: 1;
    padding: 18px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-start;
    background: linear-gradient(135deg, rgba(20, 20, 40, 0.5) 0%, rgba(30, 15, 50, 0.3) 100%);
    overflow-y: auto;
    scrollbar-width: thin;
    scrollbar-color: rgba(255, 255, 255, 0.1) transparent;
}

.music-body::-webkit-scrollbar {
    width: 6px;
}

.music-body::-webkit-scrollbar-track {
    background: transparent;
}

.music-body::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.1);
    border-radius: 3px;
}

.album-art-container {
    margin-bottom: 20px;
    display: flex;
    justify-content: center;
}

.album-art {
    width: 180px;
    height: 180px;
    border-radius: 12px;
    background: linear-gradient(135deg, rgba(255, 107, 107, 0.2) 0%, rgba(107, 142, 255, 0.2) 100%);
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 15px 45px rgba(255, 107, 107, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.1);
    border: 1px solid rgba(255, 255, 255, 0.1);
}

.album-art .album-placeholder {
    font-size: 60px;
    opacity: 0.6;
}

.music-player {
    width: 100%;
    text-align: center;
}

.track-info {
    margin-bottom: 18px;
}

.track-name {
    color: rgba(255, 255, 255, 0.95);
    margin: 0 0 6px 0;
    font-size: 14px;
    font-weight: 600;
    line-height: 1.3;
}

.track-artist {
    color: rgba(255, 255, 255, 0.5);
    margin: 0;
    font-size: 12px;
    font-weight: 500;
}

.time-display {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 20px;
}

.time {
    color: rgba(255, 255, 255, 0.5);
    font-size: 11px;
    font-weight: 500;
    font-family: 'SF Mono', monospace;
}

.progress-bar {
    flex: 1;
    position: relative;
    height: 28px;
    display: flex;
    align-items: center;
}

.progress-fill {
    position: absolute;
    height: 4px;
    background: linear-gradient(90deg, #ff6159 0%, #ff8a6b 100%);
    border-radius: 2px;
    pointer-events: none;
    left: 0;
    top: 50%;
    transform: translateY(-50%);
}

.progress-slider {
    width: 100%;
    height: 28px;
    border-radius: 14px;
    background: transparent;
    outline: none;
    -webkit-appearance: none;
    appearance: none;
    position: relative;
    z-index: 5;
}

.progress-slider::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    width: 14px;
    height: 14px;
    border-radius: 50%;
    background: #ffffff;
    cursor: pointer;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.4);
    transition: transform 0.2s ease;
}

.progress-slider::-webkit-slider-thumb:hover {
    transform: scale(1.3);
}

.progress-slider::-moz-range-thumb {
    width: 14px;
    height: 14px;
    border-radius: 50%;
    background: #ffffff;
    cursor: pointer;
    border: none;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.4);
    transition: transform 0.2s ease;
}

.progress-slider::-moz-range-thumb:hover {
    transform: scale(1.3);
}

.controls {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 16px;
    margin-bottom: 20px;
}

.control-btn {
    background: transparent;
    border: none;
    color: rgba(255, 255, 255, 0.6);
    cursor: pointer;
    padding: 8px;
    border-radius: 8px;
    transition: all 0.2s ease;
    display: flex;
    align-items: center;
    justify-content: center;
}

.control-btn:hover {
    color: rgba(255, 255, 255, 0.9);
}

.control-btn.active {
    color: #ff6159;
}

.control-btn.active:hover {
    color: #ff8a6b;
}

.control-btn .icon {
    width: 14px;
    height: 14px;
}

.control-btn .icon-large {
    width: 24px;
    height: 24px;
}

.play-btn {
    background: linear-gradient(135deg, #ff6159 0%, #ff5449 100%);
    color: white;
    width: 48px;
    height: 48px;
    border-radius: 50%;
    box-shadow: 0 6px 20px rgba(255, 97, 89, 0.3);
    transition: all 0.2s ease;
}

.play-btn:hover {
    transform: scale(1.05);
    box-shadow: 0 12px 32px rgba(255, 97, 89, 0.4);
}

.play-btn:active {
    transform: scale(0.95);
}

.volume-control {
    display: flex;
    align-items: center;
    gap: 10px;
    color: rgba(255, 255, 255, 0.5);
    margin-bottom: 16px;
    padding: 0 8px;
}

.icon-small {
    width: 16px;
    height: 16px;
    flex-shrink: 0;
}

.volume-slider {
    flex: 1;
    height: 20px;
    border-radius: 10px;
    background: transparent;
    outline: none;
    -webkit-appearance: none;
    appearance: none;
}

.volume-slider::-webkit-slider-track {
    height: 4px;
    border-radius: 2px;
    background: rgba(255, 255, 255, 0.1);
}

.volume-slider::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    width: 12px;
    height: 12px;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.6);
    cursor: pointer;
    transition: all 0.2s ease;
}

.volume-slider::-webkit-slider-thumb:hover {
    background: rgba(255, 255, 255, 0.9);
}

.volume-slider::-moz-range-track {
    background: transparent;
    border: none;
}

.volume-slider::-moz-range-progress {
    background: rgba(255, 255, 255, 0.1);
    border-radius: 2px;
    height: 4px;
}

.volume-slider::-moz-range-thumb {
    width: 12px;
    height: 12px;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.6);
    cursor: pointer;
    border: none;
    transition: all 0.2s ease;
}

.volume-slider::-moz-range-thumb:hover {
    background: rgba(255, 255, 255, 0.9);
}

.volume-percent {
    font-size: 11px;
    font-weight: 500;
    width: 28px;
    text-align: right;
}

.playlist-section {
    margin-top: 16px;
    border-top: 1px solid rgba(255, 255, 255, 0.05);
    padding-top: 12px;
}

.playlist-header {
    margin-bottom: 10px;
}

.playlist-header h4 {
    color: rgba(255, 255, 255, 0.6);
    font-size: 12px;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    margin: 0;
}

.playlist {
    display: flex;
    flex-direction: column;
    gap: 6px;
}

.playlist-item {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 6px 10px;
    border-radius: 6px;
    background: transparent;
    color: rgba(255, 255, 255, 0.5);
    font-size: 12px;
    cursor: pointer;
    transition: all 0.2s ease;
}

.playlist-item:hover {
    background: rgba(255, 255, 255, 0.05);
    color: rgba(255, 255, 255, 0.7);
}

.playlist-item.active {
    background: rgba(255, 97, 89, 0.15);
    color: #ff6159;
    font-weight: 500;
}

.track-number {
    font-size: 12px;
    opacity: 0.6;
}

.track-title {
    text-align: left;
    flex: 1;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
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
.mobile-mode .music-header {
    display: none;
}

.mobile-mode .resize-handle {
    display: none;
}

.mobile-mode .music-container {
    position: static !important;
    border-radius: 0 !important;
    box-shadow: none !important;
    z-index: auto !important;
}

.mobile-mode .music-body {
    padding: 20px;
    height: calc(100vh - 56px); /* Account for mobile header */
    overflow-y: auto;
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

.spacer {
    min-width: 80px;
}
</style>