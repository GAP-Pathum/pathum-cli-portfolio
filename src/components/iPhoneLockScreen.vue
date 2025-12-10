<template>
    <div class="iphone-lockscreen" @touchstart="handleTouchStart" @touchmove="handleTouchMove" @touchend="handleTouchEnd">
        <div class="status-bar">
            <div class="status-left">
                <span class="signal-icon">📶</span>
                <span class="wifi-icon">📡</span>
            </div>
            <div class="status-center">
                <div class="notch"></div>
            </div>
            <div class="status-right">
                <span class="battery-icon">🔋</span>
            </div>
        </div>

        <div class="lock-content">
            <div class="time-display">{{ currentTime }}</div>
            <div class="date-display">{{ currentDate }}</div>
            
            <div class="user-avatar-container">
                <div class="avatar-circle">
                    <img src="/avatar.jpg" alt="GAP Pathum" @error="handleImageError" />
                </div>
                <div class="user-name">GAP Pathum</div>
            </div>

            <div class="unlock-container" :style="{ transform: `translateY(${unlockOffset}px)` }">
                <div class="unlock-bar">
                    <div class="unlock-handle">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                            <path d="M7 10L12 15L17 10" stroke="white" stroke-width="2" stroke-linecap="round"/>
                        </svg>
                    </div>
                </div>
                <div class="unlock-text">Swipe up to unlock</div>
            </div>
        </div>

        <div class="bottom-icons">
            <div class="bottom-icon">
                <span>🔦</span>
            </div>
            <div class="bottom-icon">
                <span>📷</span>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';

const emit = defineEmits(['unlock']);

const currentTime = ref('');
const currentDate = ref('');
const unlockOffset = ref(0);
let startY = 0;
let isDragging = false;

function updateDateTime() {
    const now = new Date();
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    currentTime.value = `${hours}:${minutes}`;
    
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

function handleImageError(e) {
    e.target.src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="50" cy="50" r="50" fill="%2389dceb"/><text x="50" y="65" font-size="40" text-anchor="middle" fill="white" font-family="Arial">GP</text></svg>';
}

let timeInterval;

onMounted(() => {
    updateDateTime();
    timeInterval = setInterval(updateDateTime, 1000);
});

onUnmounted(() => {
    if (timeInterval) clearInterval(timeInterval);
});
</script>

<style scoped>
.iphone-lockscreen {
    width: 100vw;
    height: 100vh;
    background: linear-gradient(135deg, #1e3c72 0%, #2a5298 100%);
    position: relative;
    overflow: hidden;
    touch-action: none;
}

.status-bar {
    height: 44px;
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    padding: 8px 20px 0;
    color: white;
    font-size: 15px;
    position: relative;
    z-index: 10;
}

.status-left,
.status-right {
    display: flex;
    gap: 6px;
    align-items: center;
}

.notch {
    width: 180px;
    height: 30px;
    background: black;
    border-radius: 0 0 20px 20px;
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    top: 0;
}

.lock-content {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding-top: 60px;
}

.time-display {
    font-size: 72px;
    font-weight: 200;
    color: white;
    margin-bottom: 8px;
    font-variant-numeric: tabular-nums;
}

.date-display {
    font-size: 18px;
    font-weight: 500;
    color: rgba(255, 255, 255, 0.9);
    margin-bottom: 60px;
}

.user-avatar-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-bottom: 80px;
}

.avatar-circle {
    width: 100px;
    height: 100px;
    border-radius: 50%;
    overflow: hidden;
    border: 3px solid rgba(255, 255, 255, 0.3);
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
    margin-bottom: 16px;
}

.avatar-circle img {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.user-name {
    font-size: 20px;
    font-weight: 500;
    color: white;
}

.unlock-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    transition: transform 0.1s ease-out;
}

.unlock-bar {
    width: 140px;
    height: 5px;
    background: rgba(255, 255, 255, 0.3);
    border-radius: 3px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 12px;
    position: relative;
}

.unlock-handle {
    width: 40px;
    height: 40px;
    background: rgba(255, 255, 255, 0.2);
    backdrop-filter: blur(10px);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
}

.unlock-text {
    font-size: 14px;
    color: rgba(255, 255, 255, 0.8);
    font-weight: 400;
}

.bottom-icons {
    position: absolute;
    bottom: 30px;
    left: 0;
    right: 0;
    display: flex;
    justify-content: space-between;
    padding: 0 40px;
}

.bottom-icon {
    width: 50px;
    height: 50px;
    background: rgba(255, 255, 255, 0.2);
    backdrop-filter: blur(10px);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 24px;
    cursor: pointer;
    transition: all 0.2s;
}

.bottom-icon:active {
    transform: scale(0.95);
}

@media (min-width: 768px) {
    .iphone-lockscreen {
        display: none !important;
    }
}
</style>
