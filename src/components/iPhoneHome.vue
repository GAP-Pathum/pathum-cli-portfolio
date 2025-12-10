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

            <!-- Row 4 - Social Media -->
            <div class="app-icon" @click="handleAppTap('linkedin')" :class="{ 'bouncing': bouncingApp === 'linkedin' }">
                <div class="icon linkedin-icon">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white" width="32" height="32">
                        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                    </svg>
                </div>
                <div class="app-name">LinkedIn</div>
            </div>
            <div class="app-icon" @click="handleAppTap('facebook')" :class="{ 'bouncing': bouncingApp === 'facebook' }">
                <div class="icon facebook-icon">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white" width="32" height="32">
                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                    </svg>
                </div>
                <div class="app-name">Facebook</div>
            </div>
            <div class="app-icon" @click="handleAppTap('instagram')" :class="{ 'bouncing': bouncingApp === 'instagram' }">
                <div class="icon instagram-icon">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white" width="32" height="32">
                        <path d="M12 0C8.74 0 8.333.015 7.053.072 5.775.132 4.905.333 4.14.63c-.789.306-1.459.717-2.126 1.384S.935 3.35.63 4.14C.333 4.905.131 5.775.072 7.053.012 8.333 0 8.74 0 12s.015 3.667.072 4.947c.06 1.277.261 2.148.558 2.913.306.788.717 1.459 1.384 2.126.667.666 1.336 1.079 2.126 1.384.766.296 1.636.499 2.913.558C8.333 23.988 8.74 24 12 24s3.667-.015 4.947-.072c1.277-.06 2.148-.262 2.913-.558.788-.306 1.459-.718 2.126-1.384.666-.667 1.079-1.335 1.384-2.126.296-.765.499-1.636.558-2.913.06-1.28.072-1.687.072-4.947s-.015-3.667-.072-4.947c-.06-1.277-.262-2.149-.558-2.913-.306-.789-.718-1.459-1.384-2.126C21.319 1.347 20.651.935 19.86.63c-.765-.297-1.636-.499-2.913-.558C15.667.012 15.26 0 12 0zm0 2.16c3.203 0 3.585.016 4.85.071 1.17.055 1.805.249 2.227.415.562.217.96.477 1.382.896.419.42.679.819.896 1.381.164.422.36 1.057.413 2.227.057 1.266.07 1.646.07 4.85s-.015 3.585-.074 4.85c-.061 1.17-.256 1.805-.421 2.227-.224.562-.479.96-.899 1.382-.419.419-.824.679-1.38.896-.42.164-1.065.36-2.235.413-1.274.057-1.649.07-4.859.07-3.211 0-3.586-.015-4.859-.074-1.171-.061-1.816-.256-2.236-.421-.569-.224-.96-.479-1.379-.899-.421-.419-.69-.824-.9-1.38-.165-.42-.359-1.065-.42-2.235-.045-1.26-.061-1.649-.061-4.844 0-3.196.016-3.586.061-4.861.061-1.17.255-1.814.42-2.234.21-.57.479-.96.9-1.381.419-.419.81-.689 1.379-.898.42-.166 1.051-.361 2.221-.421 1.275-.045 1.65-.06 4.859-.06l.045.03zm0 3.678c-3.405 0-6.162 2.76-6.162 6.162 0 3.405 2.76 6.162 6.162 6.162 3.405 0 6.162-2.76 6.162-6.162 0-3.405-2.76-6.162-6.162-6.162zM12 16c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4zm7.846-10.405c0 .795-.646 1.44-1.44 1.44-.795 0-1.44-.646-1.44-1.44 0-.794.646-1.439 1.44-1.439.793-.001 1.44.645 1.44 1.439z"/>
                    </svg>
                </div>
                <div class="app-name">Instagram</div>
            </div>
            <div class="app-icon" @click="handleAppTap('settings')" :class="{ 'bouncing': bouncingApp === 'settings' }">
                <div class="icon">⚙️</div>
                <div class="app-name">Settings</div>
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
        } else if (appName === 'linkedin') {
            window.open('https://www.linkedin.com/in/pasindu-pathum-98a299249', '_blank');
        } else if (appName === 'facebook') {
            window.open('https://www.facebook.com/gap.pathum', '_blank');
        } else if (appName === 'instagram') {
            window.open('https://www.instagram.com/gap_pathum', '_blank');
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

.linkedin-icon {
    background: linear-gradient(135deg, #0077B5 0%, #005582 100%) !important;
}

.facebook-icon {
    background: linear-gradient(135deg, #1877F2 0%, #0C5DC7 100%) !important;
}

.instagram-icon {
    background: linear-gradient(45deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%) !important;
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
