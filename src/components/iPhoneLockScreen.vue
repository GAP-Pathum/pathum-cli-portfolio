<template>
    <div class="iphone-lockscreen" :style="lockscreenBackground" @touchstart="handleTouchStart" @touchmove="handleTouchMove" @touchend="handleTouchEnd">
        <!-- Status Bar -->
        <div class="status-bar">
            <div class="status-left">
                <span class="time-small">{{ currentTimeSmall }}</span>
            </div>
            <div class="status-center">
                <div class="dynamic-island"></div>
            </div>
            <div class="status-right">
                <svg class="signal-icon" width="17" height="12" viewBox="0 0 17 12" fill="white">
                    <rect x="0" y="8" width="3" height="4" rx="0.5"/>
                    <rect x="4.5" y="5" width="3" height="7" rx="0.5"/>
                    <rect x="9" y="2" width="3" height="10" rx="0.5"/>
                    <rect x="13.5" y="0" width="3" height="12" rx="0.5"/>
                </svg>
                <svg class="wifi-icon" width="16" height="12" viewBox="0 0 16 12" fill="white">
                    <path d="M8 9.5a1.5 1.5 0 110 3 1.5 1.5 0 010-3zM8 5c2.5 0 4.5 1.5 5.5 3l-1.5 1c-.7-1-2.2-2-4-2s-3.3 1-4 2L2.5 8C3.5 6.5 5.5 5 8 5zM8 1c4 0 7 2 8.5 4l-1.5 1c-1.2-1.5-3.8-3-7-3s-5.8 1.5-7 3L-.5 5C1 3 4 1 8 1z"/>
                </svg>
                <div class="battery-container">
                    <svg width="25" height="12" viewBox="0 0 25 12" fill="none">
                        <rect x="0.5" y="0.5" width="21" height="11" rx="2.5" stroke="white" stroke-opacity="0.4"/>
                        <rect x="2" y="2" width="17" height="8" rx="1.5" fill="white"/>
                        <path d="M23 4v4c0.5 0 1-0.5 1-1V5c0-0.5-0.5-1-1-1z" fill="white" fill-opacity="0.4"/>
                    </svg>
                </div>
            </div>
        </div>

        <!-- Lock Content -->
        <div class="lock-content">
            <!-- Lock Icon -->
            <div class="lock-icon" @click="handleFaceID">
                <svg v-if="!faceIDActive" width="20" height="24" viewBox="0 0 20 24" fill="white">
                    <path d="M16 8h-1V6c0-2.76-2.24-5-5-5S5 3.24 5 6v2H4c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zM10 17c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zM7 8V6c0-1.66 1.34-3 3-3s3 1.34 3 3v2H7z"/>
                </svg>
                <svg v-else width="24" height="24" viewBox="0 0 24 24" fill="white" class="face-id-icon">
                    <path d="M9 4H5.5C4.67 4 4 4.67 4 5.5V9"/>
                    <path d="M15 4h3.5c.83 0 1.5.67 1.5 1.5V9"/>
                    <path d="M9 20H5.5c-.83 0-1.5-.67-1.5-1.5V15"/>
                    <path d="M15 20h3.5c.83 0 1.5-.67 1.5-1.5V15"/>
                    <circle cx="9" cy="9" r="1"/>
                    <circle cx="15" cy="9" r="1"/>
                    <path d="M9 14c.83 1.5 2.5 2.5 3 2.5s2.17-1 3-2.5"/>
                </svg>
            </div>

            <div class="time-display">{{ currentTime }}</div>
            <div class="date-display">{{ currentDate }}</div>

            <!-- Notifications Area -->
            <div class="notifications-area">
                <div class="notification">
                    <div class="notif-icon">👨‍💻</div>
                    <div class="notif-content">
                        <div class="notif-app">PORTFOLIO</div>
                        <div class="notif-title">Welcome!</div>
                        <div class="notif-text">Swipe up to explore my portfolio</div>
                    </div>
                    <div class="notif-time">now</div>
                </div>
            </div>
        </div>

        <!-- Home Indicator & Bottom -->
        <div class="bottom-area">
            <div class="bottom-icons">
                <div class="bottom-icon flashlight">
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="white">
                        <path d="M6 2h12v6l-2 2v12H8V10L6 8V2zm2 2v3l2 2v11h4V9l2-2V4H8z"/>
                    </svg>
                </div>
                <div class="bottom-icon camera">
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="white">
                        <path d="M12 15.2c1.76 0 3.2-1.44 3.2-3.2 0-1.76-1.44-3.2-3.2-3.2-1.76 0-3.2 1.44-3.2 3.2 0 1.76 1.44 3.2 3.2 3.2zm7-10.2h-3.17l-1.24-1.35c-.37-.41-.91-.65-1.47-.65H10.88c-.56 0-1.1.24-1.48.65L8.17 5H5c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm-7 13c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5z"/>
                    </svg>
                </div>
            </div>
            <div class="home-indicator-area">
                <div class="swipe-hint">Swipe up to unlock</div>
                <div class="home-indicator"></div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { wallpapers } from '../data/wallpapers.js';

const emit = defineEmits(['unlock']);

const currentTime = ref('');
const currentTimeSmall = ref('');
const currentDate = ref('');
const unlockOffset = ref(0);
const faceIDActive = ref(false);
const currentWallpaper = ref(null);
let startY = 0;
let isDragging = false;

// Computed property for background
const lockscreenBackground = computed(() => {
  if (currentWallpaper.value) {
    return {
      backgroundImage: `url(${currentWallpaper.value})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat'
    };
  }
  return {
    background: 'linear-gradient(180deg, #1c1c1e 0%, #2c2c2e 50%, #1c1c1e 100%)'
  };
});

function updateDateTime() {
    const now = new Date();
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    currentTime.value = `${hours}:${minutes}`;
    currentTimeSmall.value = `${hours}:${minutes}`;
    
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    const dayName = days[now.getDay()];
    const monthName = months[now.getMonth()];
    const date = now.getDate();
    
    currentDate.value = `${dayName}, ${monthName} ${date}`;
}

function handleTouchStart(e) {
    startY = e.touches[0].clientY;
    isDragging = true;
}

function handleTouchMove(e) {
    if (!isDragging) return;
    
    const currentY = e.touches[0].clientY;
    const diff = startY - currentY;
    
    if (diff > 0) {
        unlockOffset.value = Math.min(diff, 100);
    }
}

function handleTouchEnd() {
    if (unlockOffset.value > 80) {
        emit('unlock');
    }
    unlockOffset.value = 0;
    isDragging = false;
}

function handleFaceID() {
    faceIDActive.value = true;
    setTimeout(() => {
        emit('unlock');
    }, 800);
}

let timeInterval;

onMounted(() => {
    updateDateTime();
    timeInterval = setInterval(updateDateTime, 1000);
    
    // Load saved wallpaper
    const savedWallpaper = localStorage.getItem('wallpaper');
    if (savedWallpaper && savedWallpaper !== '0') {
        const wallpaper = wallpapers.find(w => w.id === parseInt(savedWallpaper));
        if (wallpaper) {
            currentWallpaper.value = wallpaper.path;
        }
    }
});

onUnmounted(() => {
    if (timeInterval) clearInterval(timeInterval);
});
</script>

<style scoped>
.iphone-lockscreen {
    width: 100vw;
    height: 100vh;
    transition: background 0.3s ease;
    position: relative;
    overflow: hidden;
    touch-action: none;
    font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', sans-serif;
}

/* Status Bar */
.status-bar {
    height: 54px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 14px 24px 0;
    color: white;
    font-size: 15px;
    position: relative;
    z-index: 10;
}

.status-left {
    width: 64px;
}

.time-small {
    font-size: 15px;
    font-weight: 600;
}

.status-center {
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    top: 10px;
}

.dynamic-island {
    width: 126px;
    height: 36px;
    background: #000;
    border-radius: 22px;
}

.status-right {
    display: flex;
    gap: 5px;
    align-items: center;
    width: 74px;
    justify-content: flex-end;
}

.signal-icon, .wifi-icon {
    opacity: 0.9;
}

.battery-container {
    display: flex;
    align-items: center;
}

/* Lock Content */
.lock-content {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding-top: 20px;
}

.lock-icon {
    width: 44px;
    height: 44px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 16px;
    cursor: pointer;
    opacity: 0.7;
    transition: all 0.3s;
}

.lock-icon:active {
    transform: scale(0.95);
}

.face-id-icon {
    animation: faceIDScan 0.6s ease;
}

@keyframes faceIDScan {
    0% { opacity: 0.5; transform: scale(0.9); }
    50% { opacity: 1; transform: scale(1.1); }
    100% { opacity: 1; transform: scale(1); }
}

.time-display {
    font-size: 82px;
    font-weight: 300;
    color: white;
    letter-spacing: -2px;
    line-height: 1;
    margin-bottom: 4px;
    font-variant-numeric: tabular-nums;
}

.date-display {
    font-size: 20px;
    font-weight: 500;
    color: rgba(255, 255, 255, 0.9);
    margin-bottom: 28px;
}

/* Notifications */
.notifications-area {
    width: 100%;
    padding: 0 16px;
    margin-top: 20px;
}

.notification {
    background: rgba(255, 255, 255, 0.12);
    backdrop-filter: blur(40px);
    -webkit-backdrop-filter: blur(40px);
    border-radius: 16px;
    padding: 14px;
    display: flex;
    align-items: flex-start;
    gap: 12px;
}

.notif-icon {
    width: 40px;
    height: 40px;
    background: linear-gradient(135deg, #667eea, #764ba2);
    border-radius: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 20px;
}

.notif-content {
    flex: 1;
}

.notif-app {
    font-size: 12px;
    font-weight: 600;
    color: rgba(255, 255, 255, 0.6);
    text-transform: uppercase;
    letter-spacing: 0.5px;
    margin-bottom: 2px;
}

.notif-title {
    font-size: 15px;
    font-weight: 600;
    color: white;
    margin-bottom: 2px;
}

.notif-text {
    font-size: 14px;
    color: rgba(255, 255, 255, 0.8);
}

.notif-time {
    font-size: 12px;
    color: rgba(255, 255, 255, 0.5);
}

/* Bottom Area */
.bottom-area {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    padding-bottom: 8px;
}

.bottom-icons {
    display: flex;
    justify-content: space-between;
    padding: 0 46px;
    margin-bottom: 20px;
}

.bottom-icon {
    width: 50px;
    height: 50px;
    background: rgba(255, 255, 255, 0.2);
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all 0.15s;
}

.bottom-icon:active {
    transform: scale(0.92);
    background: rgba(255, 255, 255, 0.3);
}

.home-indicator-area {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 16px;
}

.swipe-hint {
    font-size: 13px;
    color: rgba(255, 255, 255, 0.5);
    font-weight: 400;
}

.home-indicator {
    width: 134px;
    height: 5px;
    background: rgba(255, 255, 255, 0.6);
    border-radius: 3px;
}

@media (min-width: 768px) {
    .iphone-lockscreen {
        display: none !important;
    }
}
</style>
