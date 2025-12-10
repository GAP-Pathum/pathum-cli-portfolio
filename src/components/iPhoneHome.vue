<template>
    <div class="iphone-home" 
         @touchstart="handleTouchStart" 
         @touchmove="handleTouchMove" 
         @touchend="handleTouchEnd">
        
        <!-- Status Bar -->
        <div class="status-bar">
            <div class="status-left">
                <span class="time">{{ currentTime }}</span>
            </div>
            <div class="status-center">
                <div class="notch"></div>
            </div>
            <div class="status-right">
                <span class="signal">📶</span>
                <span class="wifi">📡</span>
                <span class="battery">🔋 {{ batteryLevel }}%</span>
            </div>
        </div>

        <!-- Widget Area (optional) -->
        <div class="widget-area" v-if="showWidgets">
            <div class="widget">
                <div class="widget-title">Portfolio Stats</div>
                <div class="widget-content">
                    <div class="stat-item">
                        <span class="stat-label">Projects</span>
                        <span class="stat-value">12+</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-label">Experience</span>
                        <span class="stat-value">3 Years</span>
                    </div>
                </div>
            </div>
        </div>

        <!-- App Grid -->
        <div class="app-grid" :class="{ 'with-widgets': showWidgets }">
            <!-- Row 1 -->
            <div class="app-icon" @click="handleAppTap('terminal')" :class="{ 'bouncing': bouncingApp === 'terminal' }">
                <div class="icon terminal-icon">
                    <span class="terminal-symbol">&gt;_</span>
                </div>
                <div class="app-name">Terminal</div>
            </div>
            <div class="app-icon" @click="handleAppTap('messages')" :class="{ 'bouncing': bouncingApp === 'messages' }">
                <div class="icon">💬</div>
                <div class="app-name">Messages</div>
            </div>
            <div class="app-icon" @click="handleAppTap('safari')" :class="{ 'bouncing': bouncingApp === 'safari' }">
                <div class="icon">🧭</div>
                <div class="app-name">Safari</div>
            </div>
            <div class="app-icon" @click="handleAppTap('mail')" :class="{ 'bouncing': bouncingApp === 'mail' }">
                <div class="icon">✉️</div>
                <div class="app-name">Mail</div>
            </div>

            <!-- Row 2 -->
            <div class="app-icon" @click="handleAppTap('photos')" :class="{ 'bouncing': bouncingApp === 'photos' }">
                <div class="icon">📷</div>
                <div class="app-name">Photos</div>
            </div>
            <div class="app-icon" @click="handleAppTap('music')" :class="{ 'bouncing': bouncingApp === 'music' }">
                <div class="icon">🎵</div>
                <div class="app-name">Music</div>
            </div>
            <div class="app-icon" @click="handleAppTap('files')" :class="{ 'bouncing': bouncingApp === 'files' }">
                <div class="icon">📁</div>
                <div class="app-name">Files</div>
            </div>
            <div class="app-icon" @click="handleAppTap('notes')" :class="{ 'bouncing': bouncingApp === 'notes' }">
                <div class="icon">📝</div>
                <div class="app-name">Notes</div>
            </div>

            <!-- Row 3 -->
            <div class="app-icon" @click="handleAppTap('calendar')" :class="{ 'bouncing': bouncingApp === 'calendar' }">
                <div class="icon">📅</div>
                <div class="app-name">Calendar</div>
            </div>
            <div class="app-icon" @click="handleAppTap('clock')" :class="{ 'bouncing': bouncingApp === 'clock' }">
                <div class="icon">⏰</div>
                <div class="app-name">Clock</div>
            </div>
            <div class="app-icon" @click="handleAppTap('weather')" :class="{ 'bouncing': bouncingApp === 'weather' }">
                <div class="icon">🌤️</div>
                <div class="app-name">Weather</div>
            </div>
            <div class="app-icon" @click="handleAppTap('maps')" :class="{ 'bouncing': bouncingApp === 'maps' }">
                <div class="icon">🗺️</div>
                <div class="app-name">Maps</div>
            </div>

            <!-- Row 4 -->
            <div class="app-icon" @click="handleAppTap('settings')" :class="{ 'bouncing': bouncingApp === 'settings' }">
                <div class="icon">⚙️</div>
                <div class="app-name">Settings</div>
            </div>
            <div class="app-icon" @click="handleAppTap('health')" :class="{ 'bouncing': bouncingApp === 'health' }">
                <div class="icon">❤️</div>
                <div class="app-name">Health</div>
            </div>
            <div class="app-icon" @click="handleAppTap('wallet')" :class="{ 'bouncing': bouncingApp === 'wallet' }">
                <div class="icon">💳</div>
                <div class="app-name">Wallet</div>
            </div>
            <div class="app-icon" @click="handleAppTap('contacts')" :class="{ 'bouncing': bouncingApp === 'contacts' }">
                <div class="icon">👤</div>
                <div class="app-name">Contacts</div>
            </div>
        </div>

        <!-- Page Indicators -->
        <div class="page-indicators">
            <div class="dot active"></div>
            <div class="dot"></div>
        </div>

        <!-- Dock -->
        <div class="dock">
            <div class="dock-icon" @click="handleAppTap('phone')">
                <div class="icon">📞</div>
            </div>
            <div class="dock-icon" @click="handleAppTap('messages')">
                <div class="icon">💬</div>
            </div>
            <div class="dock-icon" @click="handleAppTap('safari')">
                <div class="icon">🧭</div>
            </div>
            <div class="dock-icon" @click="handleAppTap('terminal')">
                <div class="icon terminal-icon-small">
                    <span>&gt;_</span>
                </div>
            </div>
        </div>

        <!-- Home Indicator -->
        <div class="home-indicator"></div>

        <!-- Control Center -->
        <div class="control-center" :class="{ 'visible': showControlCenter }">
            <div class="control-panel">
                <div class="control-header">
                    <button @click="toggleControlCenter" class="close-btn">×</button>
                </div>
                <div class="control-grid">
                    <div class="control-tile">
                        <span>📡</span>
                        <span class="control-label">WiFi</span>
                    </div>
                    <div class="control-tile">
                        <span>🔊</span>
                        <span class="control-label">Sound</span>
                    </div>
                    <div class="control-tile" @click="handleLogout">
                        <span>🚪</span>
                        <span class="control-label">Logout</span>
                    </div>
                </div>
                <div class="brightness-control">
                    <span>☀️</span>
                    <input type="range" min="0" max="100" value="70" />
                </div>
            </div>
        </div>

        <!-- Terminal App -->
        <Terminal 
            v-if="terminalOpen" 
            @close="closeTerminal"
            :isDesktopMode="false"
            :isMobileMode="true"
        />

        <!-- Notification -->
        <div class="notification" :class="{ 'visible': showNotification }">
            <div class="notification-icon">💼</div>
            <div class="notification-content">
                <div class="notification-title">Portfolio</div>
                <div class="notification-text">Welcome to GAP Pathum's Terminal Portfolio</div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import Terminal from './Terminal.vue';

const emit = defineEmits(['logout']);

const currentTime = ref('');
const batteryLevel = ref(87);
const terminalOpen = ref(false);
const showControlCenter = ref(false);
const showNotification = ref(false);
const showWidgets = ref(false);
const bouncingApp = ref(null);
const isDark = ref(false);

let startY = 0;
let startX = 0;
let isDragging = false;

function updateTime() {
    const now = new Date();
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    currentTime.value = `${hours}:${minutes}`;
}

function handleTouchStart(e) {
    startY = e.touches[0].clientY;
    startX = e.touches[0].clientX;
    isDragging = true;
}

function handleTouchMove(e) {
    if (!isDragging) return;
    
    const currentY = e.touches[0].clientY;
    const currentX = e.touches[0].clientX;
    const diffY = currentY - startY;
    const diffX = currentX - startX;
    
    // Swipe down from top right for Control Center
    if (startY < 100 && startX > window.innerWidth * 0.7 && diffY > 50) {
        showControlCenter.value = true;
    }
}

function handleTouchEnd() {
    isDragging = false;
}

function handleAppTap(appName) {
    bouncingApp.value = appName;
    
    setTimeout(() => {
        bouncingApp.value = null;
        if (appName === 'terminal') {
            terminalOpen.value = true;
            // Show welcome notification
            setTimeout(() => {
                showNotification.value = true;
                setTimeout(() => {
                    showNotification.value = false;
                }, 3000);
            }, 500);
        }
    }, 300);
}

function closeTerminal() {
    terminalOpen.value = false;
}

function toggleControlCenter() {
    showControlCenter.value = !showControlCenter.value;
}

function handleLogout() {
    emit('logout');
}

let timeInterval;

onMounted(() => {
    updateTime();
    timeInterval = setInterval(updateTime, 1000);
});

onUnmounted(() => {
    if (timeInterval) clearInterval(timeInterval);
});
</script>

<style scoped>
.iphone-home {
    width: 100vw;
    height: 100vh;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    position: relative;
    overflow: hidden;
    touch-action: none;
}

/* Status Bar */
.status-bar {
    height: 44px;
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    padding: 8px 20px 0;
    color: white;
    font-size: 13px;
    position: relative;
    z-index: 50;
}

.status-left,
.status-right {
    display: flex;
    gap: 6px;
    align-items: center;
    font-weight: 600;
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

/* Widget Area */
.widget-area {
    padding: 20px;
    margin-bottom: 20px;
}

.widget {
    background: rgba(255, 255, 255, 0.2);
    backdrop-filter: blur(20px);
    border-radius: 20px;
    padding: 16px;
    color: white;
}

.widget-title {
    font-size: 14px;
    font-weight: 600;
    margin-bottom: 12px;
}

.widget-content {
    display: flex;
    justify-content: space-around;
}

.stat-item {
    display: flex;
    flex-direction: column;
    align-items: center;
}

.stat-label {
    font-size: 11px;
    opacity: 0.8;
}

.stat-value {
    font-size: 20px;
    font-weight: 700;
}

/* App Grid */
.app-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 20px;
    padding: 20px;
    margin-top: 40px;
}

.app-grid.with-widgets {
    margin-top: 10px;
}

.app-icon {
    display: flex;
    flex-direction: column;
    align-items: center;
    cursor: pointer;
    user-select: none;
}

.app-icon.bouncing .icon {
    animation: bounce 0.3s ease;
}

@keyframes bounce {
    0%, 100% { transform: scale(1); }
    50% { transform: scale(1.15); }
}

.icon {
    width: 60px;
    height: 60px;
    background: rgba(255, 255, 255, 0.3);
    backdrop-filter: blur(10px);
    border-radius: 14px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 32px;
    margin-bottom: 6px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}

.terminal-icon {
    background: linear-gradient(135deg, #1e1e1e 0%, #2d2d2d 100%);
}

.terminal-symbol {
    color: #00ff88;
    font-size: 24px;
    font-weight: bold;
    font-family: 'Menlo', monospace;
}

.app-name {
    font-size: 11px;
    color: white;
    font-weight: 500;
    text-align: center;
    text-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
}

/* Page Indicators */
.page-indicators {
    display: flex;
    justify-content: center;
    gap: 6px;
    margin: 20px 0;
}

.dot {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.4);
}

.dot.active {
    background: white;
}

/* Dock */
.dock {
    position: fixed;
    bottom: 30px;
    left: 50%;
    transform: translateX(-50%);
    background: rgba(255, 255, 255, 0.2);
    backdrop-filter: blur(30px);
    border-radius: 20px;
    padding: 12px 16px;
    display: flex;
    gap: 20px;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
}

.dock-icon {
    cursor: pointer;
}

.dock-icon .icon {
    width: 56px;
    height: 56px;
    font-size: 30px;
    margin-bottom: 0;
}

.terminal-icon-small {
    background: linear-gradient(135deg, #1e1e1e 0%, #2d2d2d 100%);
}

.terminal-icon-small span {
    color: #00ff88;
    font-size: 20px;
    font-weight: bold;
    font-family: 'Menlo', monospace;
}

/* Home Indicator */
.home-indicator {
    position: fixed;
    bottom: 8px;
    left: 50%;
    transform: translateX(-50%);
    width: 140px;
    height: 5px;
    background: rgba(255, 255, 255, 0.6);
    border-radius: 3px;
}

/* Control Center */
.control-center {
    position: fixed;
    top: 0;
    right: -100%;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    backdrop-filter: blur(20px);
    transition: right 0.3s ease;
    z-index: 200;
}

.control-center.visible {
    right: 0;
}

.control-panel {
    position: absolute;
    top: 60px;
    right: 20px;
    width: calc(100% - 40px);
    background: rgba(255, 255, 255, 0.15);
    backdrop-filter: blur(30px);
    border-radius: 20px;
    padding: 20px;
}

.control-header {
    display: flex;
    justify-content: flex-end;
    margin-bottom: 16px;
}

.close-btn {
    width: 32px;
    height: 32px;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.2);
    border: none;
    color: white;
    font-size: 24px;
    cursor: pointer;
}

.control-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 12px;
    margin-bottom: 16px;
}

.control-tile {
    background: rgba(255, 255, 255, 0.2);
    border-radius: 16px;
    padding: 16px;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;
    font-size: 32px;
    cursor: pointer;
}

.control-label {
    font-size: 12px;
    color: white;
    font-weight: 500;
}

.brightness-control {
    display: flex;
    align-items: center;
    gap: 12px;
    background: rgba(255, 255, 255, 0.2);
    border-radius: 16px;
    padding: 12px;
    color: white;
}

.brightness-control input[type="range"] {
    flex: 1;
    height: 4px;
    border-radius: 2px;
    background: rgba(255, 255, 255, 0.3);
    outline: none;
}

/* Notification */
.notification {
    position: fixed;
    top: -100px;
    left: 50%;
    transform: translateX(-50%);
    width: calc(100% - 40px);
    max-width: 400px;
    background: rgba(255, 255, 255, 0.95);
    backdrop-filter: blur(20px);
    border-radius: 16px;
    padding: 12px 16px;
    display: flex;
    gap: 12px;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
    transition: top 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    z-index: 300;
}

.notification.visible {
    top: 60px;
}

.notification-icon {
    font-size: 32px;
}

.notification-content {
    flex: 1;
}

.notification-title {
    font-weight: 600;
    font-size: 14px;
    color: #1a1a1a;
    margin-bottom: 2px;
}

.notification-text {
    font-size: 13px;
    color: #666;
}

@media (min-width: 768px) {
    .iphone-home {
        display: none !important;
    }
}
</style>
