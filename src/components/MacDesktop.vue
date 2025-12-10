<template>
    <div class="desktop">
        <!-- Menu Bar -->
        <div class="menu-bar">
            <div class="menu-left">
                <div class="apple-logo"></div>
                <div class="menu-item">Finder</div>
                <div class="menu-item">File</div>
                <div class="menu-item">Edit</div>
                <div class="menu-item">View</div>
            </div>
            <div class="menu-right">
                <div class="menu-icon">🔋</div>
                <div class="menu-icon">📶</div>
                <div class="menu-icon">🔍</div>
                <div class="menu-time">{{ currentTime }}</div>
                <div class="menu-item logout-btn" @click="handleLogout">Logout</div>
            </div>
        </div>

        <!-- Desktop Icons -->
        <div class="desktop-icons">
            <div 
                class="desktop-icon"
                v-for="icon in desktopIcons"
                :key="icon.id"
                @mousedown="startDragIcon($event, icon)"
                @click="handleIconClick(icon.id)"
                :class="{ selected: selectedIcon === icon.id }"
                :style="{ left: icon.x + 'px', top: icon.y + 'px' }"
            >
                <div :class="['icon-image', icon.iconClass]">
                    <div v-if="icon.id === 'terminal'" class="terminal-icon-content">
                        <span class="terminal-symbol">&gt;_</span>
                    </div>
                    <span v-else class="finder-symbol">{{ icon.emoji }}</span>
                </div>
                <div class="icon-label">{{ icon.label }}</div>
            </div>
        </div>

        <!-- Dock -->
        <div class="dock-container">
            <div class="dock">
                <div class="dock-icon finder-dock" @click="selectDockIcon('finder')">
                    <span>🗂️</span>
                </div>
                <div class="dock-icon" @click="selectDockIcon('safari')">
                    <span>🧭</span>
                </div>
                <div class="dock-icon" @click="selectDockIcon('mail')">
                    <span>✉️</span>
                </div>
                <div class="dock-icon" @click="selectDockIcon('messages')">
                    <span>💬</span>
                </div>
                <div class="dock-divider"></div>
                <div class="dock-icon terminal-dock" @click="selectDockIcon('terminal')">
                    <div class="dock-terminal-icon">
                        <span>&gt;_</span>
                    </div>
                </div>
                <div class="dock-icon" @click="selectDockIcon('settings')">
                    <span>⚙️</span>
                </div>
            </div>
        </div>

        <!-- Terminal Window (shown when opened) -->
        <div 
            v-if="terminalOpen" 
            class="terminal-container"
            :style="terminalStyle"
        >
            <div 
                class="terminal-resize-header"
                @mousedown="startDragWindow"
            >
                <div class="window-controls">
                    <span class="window-dot close" @click.stop="closeTerminal"></span>
                    <span class="window-dot minimize"></span>
                    <span class="window-dot maximize" @click.stop="toggleMaximize"></span>
                </div>
                <div class="window-title">Terminal — zsh</div>
            </div>
            <div class="terminal-body-wrapper">
                <div class="terminal-body" ref="terminalOutputContainer">
                    <div v-html="welcomeMessage" class="welcome-output"></div>
                    
                    <div v-for="(item, index) in terminalOutput" :key="index" class="output-block">
                        <div v-if="item.command" class="command-line">
                            <span class="prompt-user">pathum</span>
                            <span class="prompt-separator">@</span>
                            <span class="prompt-host">portfolio</span>
                            <span class="prompt-separator">:</span>
                            <span class="prompt-path">{{ item.prompt }}</span>
                            <span class="prompt-symbol">$</span>
                            <span class="command-text">{{ item.command }}</span>
                        </div>
                        <div v-if="item.output" class="output-content" :class="item.type" v-html="item.output"></div>
                    </div>
                    
                    <div class="input-line">
                        <span class="prompt-user">pathum</span>
                        <span class="prompt-separator">@</span>
                        <span class="prompt-host">portfolio</span>
                        <span class="prompt-separator">:</span>
                        <span class="prompt-path">~</span>
                        <span class="prompt-symbol">$</span>
                        <input 
                            ref="terminalInput"
                            v-model="currentCommand"
                            @keydown.enter="executeTerminalCommand"
                            @keydown.tab.prevent="autocompleteCommand"
                            @keydown.up.prevent="navigateHistory('up')"
                            @keydown.down.prevent="navigateHistory('down')"
                            @keydown.ctrl.l.prevent="clearTerminal"
                            class="command-input"
                            spellcheck="false"
                            autocomplete="off"
                            placeholder="type 'help' to get started..."
                        />
                    </div>
                </div>
            </div>
            <!-- Resize Handles -->
            <div class="resize-handle resize-right" @mousedown="startResize($event, 'right')"></div>
            <div class="resize-handle resize-bottom" @mousedown="startResize($event, 'bottom')"></div>
            <div class="resize-handle resize-corner" @mousedown="startResize($event, 'corner')"></div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, nextTick } from 'vue';

const emit = defineEmits(['logout']);

const currentTime = ref('');
const selectedIcon = ref(null);
const terminalOpen = ref(false);
let clickTimer = null;
let clickCount = 0;

// Terminal state
const currentCommand = ref('');
const terminalOutput = ref([]);
const commandHistory = ref([]);
const historyIndex = ref(-1);
const terminalInput = ref(null);
const terminalOutputContainer = ref(null);

const welcomeMessage = `
<div class="ascii-banner">
<span class="banner-text">
 ██████╗  █████╗ ██████╗     ██████╗  █████╗ ████████╗██╗  ██╗██╗   ██╗███╗   ███╗
██╔════╝ ██╔══██╗██╔══██╗    ██╔══██╗██╔══██╗╚══██╔══╝██║  ██║██║   ██║████╗ ████║
██║  ███╗███████║██████╔╝    ██████╔╝███████║   ██║   ███████║██║   ██║██╔████╔██║
██║   ██║██╔══██║██╔═══╝     ██╔═══╝ ██╔══██║   ██║   ██╔══██║██║   ██║██║╚██╔╝██║
╚██████╔╝██║  ██║██║         ██║     ██║  ██║   ██║   ██║  ██║╚██████╔╝██║ ╚═╝ ██║
 ╚═════╝ ╚═╝  ╚═╝╚═╝         ╚═╝     ╚═╝  ╚═╝   ╚═╝   ╚═╝  ╚═╝ ╚═════╝ ╚═╝     ╚═╝
</span>
</div>
<div class="welcome-info">
<div class="info-line"><span class="arrow">➜</span> <span class="label">Developer:</span> <span class="value">Full-Stack Developer</span></div>
<div class="info-line"><span class="arrow">➜</span> <span class="label">Location:</span> <span class="value">Ragala, Sri Lanka 🇱🇰</span></div>
<div class="info-line"><span class="arrow">➜</span> <span class="label">Tip:</span> Type <span class="cmd">help</span> to see available commands</div>
<div class="info-line"><span class="arrow">➜</span> <span class="label">Quick:</span> <span class="cmd">ls</span> <span class="separator">│</span> <span class="cmd">cd projects</span> <span class="separator">│</span> <span class="cmd">cat bio.txt</span></div>
</div>
`;

// Terminal commands
const commands = {
    help: () => '<b>Available Commands:</b><ul><li><b>clear</b> - Clear screen</li><li><b>banner</b> - Show banner</li><li><b>whoami</b> - About me</li><li><b>contact</b> - Get in touch</li><li><b>projects</b> - View projects</li></ul>',
    clear: () => { terminalOutput.value = []; return null; },
    banner: () => welcomeMessage,
    whoami: () => '<b>GAP Pathum</b><br>Full-Stack Developer from Sri Lanka 🇱🇰<br>Passionate about building amazing web experiences!',
    contact: () => '<b>Contact:</b><br>📧 Email: contact@pasindupathum.me<br>🌐 Portfolio: <a href="https://pasindupathum.me" target="_blank">pasindupathum.me</a>',
    projects: () => '<b>Projects:</b><ul><li>🚀 CLI Portfolio</li><li>💼 E-Commerce Platform</li><li>📱 Mobile App</li></ul>',
};

// Desktop icons with positions
const desktopIcons = ref([
    { id: 'terminal', label: 'Terminal', emoji: '', iconClass: 'terminal-icon', x: window.innerWidth - 120, y: 40 },
    { id: 'finder', label: 'Finder', emoji: '🗂️', iconClass: 'finder-icon', x: window.innerWidth - 120, y: 140 },
    { id: 'safari', label: 'Safari', emoji: '🧭', iconClass: 'safari-icon', x: window.innerWidth - 120, y: 240 }
]);

// Icon dragging
let isDraggingIcon = false;
let draggedIcon = null;
let iconStartX = 0;
let iconStartY = 0;
let iconOffsetX = 0;
let iconOffsetY = 0;

// Terminal window state
const terminalStyle = ref({
    left: '100px',
    top: '100px',
    width: '1200px',
    height: '85vh'
});

const isMaximized = ref(false);
let previousStyle = null;

// Window dragging
let isDraggingWindow = false;
let windowStartX = 0;
let windowStartY = 0;
let windowOffsetX = 0;
let windowOffsetY = 0;

// Window resizing
let isResizing = false;
let resizeDirection = null;
let resizeStartX = 0;
let resizeStartY = 0;
let resizeStartWidth = 0;
let resizeStartHeight = 0;

function updateTime() {
    const now = new Date();
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    
    const dayName = days[now.getDay()];
    const monthName = months[now.getMonth()];
    const date = now.getDate();
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    
    currentTime.value = `${dayName} ${monthName} ${date}  ${hours}:${minutes}`;
}

function handleIconClick(iconName) {
    selectedIcon.value = iconName;
    clickCount++;
    
    if (clickCount === 1) {
        clickTimer = setTimeout(() => {
            clickCount = 0;
        }, 300);
    } else if (clickCount === 2) {
        clearTimeout(clickTimer);
        clickCount = 0;
        if (!isDraggingIcon) {
            openApplication(iconName);
        }
    }
}

function startDragIcon(event, icon) {
    event.preventDefault();
    selectedIcon.value = icon.id;
    
    const iconElement = event.currentTarget;
    const rect = iconElement.getBoundingClientRect();
    
    isDraggingIcon = false;
    draggedIcon = icon;
    iconStartX = event.clientX;
    iconStartY = event.clientY;
    iconOffsetX = event.clientX - rect.left;
    iconOffsetY = event.clientY - rect.top;
    
    document.addEventListener('mousemove', dragIcon);
    document.addEventListener('mouseup', stopDragIcon);
}

function dragIcon(event) {
    if (!draggedIcon) return;
    
    const moveThreshold = 5;
    if (Math.abs(event.clientX - iconStartX) > moveThreshold || 
        Math.abs(event.clientY - iconStartY) > moveThreshold) {
        isDraggingIcon = true;
    }
    
    if (isDraggingIcon) {
        draggedIcon.x = event.clientX - iconOffsetX;
        draggedIcon.y = event.clientY - iconOffsetY;
        
        // Keep within bounds
        draggedIcon.x = Math.max(0, Math.min(window.innerWidth - 100, draggedIcon.x));
        draggedIcon.y = Math.max(30, Math.min(window.innerHeight - 150, draggedIcon.y));
    }
}

function stopDragIcon() {
    setTimeout(() => {
        isDraggingIcon = false;
        draggedIcon = null;
    }, 10);
    
    document.removeEventListener('mousemove', dragIcon);
    document.removeEventListener('mouseup', stopDragIcon);
}

function startDragWindow(event) {
    if (isMaximized.value) return;
    
    event.preventDefault();
    isDraggingWindow = true;
    windowStartX = event.clientX;
    windowStartY = event.clientY;
    
    const currentLeft = parseInt(terminalStyle.value.left) || 100;
    const currentTop = parseInt(terminalStyle.value.top) || 100;
    
    windowOffsetX = windowStartX - currentLeft;
    windowOffsetY = windowStartY - currentTop;
    
    document.addEventListener('mousemove', dragWindow);
    document.addEventListener('mouseup', stopDragWindow);
}

function dragWindow(event) {
    if (!isDraggingWindow) return;
    
    const newLeft = event.clientX - windowOffsetX;
    const newTop = event.clientY - windowOffsetY;
    
    terminalStyle.value.left = Math.max(0, Math.min(window.innerWidth - 400, newLeft)) + 'px';
    terminalStyle.value.top = Math.max(24, Math.min(window.innerHeight - 100, newTop)) + 'px';
}

function stopDragWindow() {
    isDraggingWindow = false;
    document.removeEventListener('mousemove', dragWindow);
    document.removeEventListener('mouseup', stopDragWindow);
}

function startResize(event, direction) {
    if (isMaximized.value) return;
    
    event.preventDefault();
    event.stopPropagation();
    isResizing = true;
    resizeDirection = direction;
    resizeStartX = event.clientX;
    resizeStartY = event.clientY;
    resizeStartWidth = parseInt(terminalStyle.value.width) || 1200;
    resizeStartHeight = parseInt(terminalStyle.value.height) || window.innerHeight * 0.85;
    
    document.addEventListener('mousemove', resizeWindow);
    document.addEventListener('mouseup', stopResize);
}

function resizeWindow(event) {
    if (!isResizing) return;
    
    const deltaX = event.clientX - resizeStartX;
    const deltaY = event.clientY - resizeStartY;
    
    if (resizeDirection === 'right' || resizeDirection === 'corner') {
        const newWidth = resizeStartWidth + deltaX;
        terminalStyle.value.width = Math.max(600, Math.min(window.innerWidth - parseInt(terminalStyle.value.left), newWidth)) + 'px';
    }
    
    if (resizeDirection === 'bottom' || resizeDirection === 'corner') {
        const newHeight = resizeStartHeight + deltaY;
        terminalStyle.value.height = Math.max(400, Math.min(window.innerHeight - parseInt(terminalStyle.value.top), newHeight)) + 'px';
    }
}

function stopResize() {
    isResizing = false;
    resizeDirection = null;
    document.removeEventListener('mousemove', resizeWindow);
    document.removeEventListener('mouseup', stopResize);
}

function toggleMaximize() {
    if (isMaximized.value) {
        // Restore
        terminalStyle.value = { ...previousStyle };
        isMaximized.value = false;
    } else {
        // Maximize
        previousStyle = { ...terminalStyle.value };
        terminalStyle.value = {
            left: '0px',
            top: '24px',
            width: '100vw',
            height: 'calc(100vh - 24px)'
        };
        isMaximized.value = true;
    }
}

function openApplication(appName) {
    if (appName === 'terminal') {
        terminalOpen.value = true;
        nextTick(() => {
            terminalInput.value?.focus();
        });
    }
    // Other apps can be implemented later
}

function selectDockIcon(iconName) {
    if (iconName === 'terminal') {
        terminalOpen.value = true;
        nextTick(() => {
            terminalInput.value?.focus();
        });
    }
    // Other apps can be implemented later
}

function closeTerminal() {
    terminalOpen.value = false;
    terminalOutput.value = [];
    currentCommand.value = '';
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
.desktop {
    width: 100vw;
    height: 100vh;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    position: relative;
    overflow: hidden;
}

/* Menu Bar */
.menu-bar {
    height: 24px;
    background: rgba(0, 0, 0, 0.3);
    backdrop-filter: blur(20px);
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 12px;
    color: white;
    font-size: 13px;
    font-weight: 500;
    position: relative;
    z-index: 100;
}

.menu-left,
.menu-right {
    display: flex;
    align-items: center;
    gap: 16px;
}

.apple-logo::before {
    content: '';
    font-size: 16px;
}

.menu-item {
    cursor: pointer;
    padding: 2px 8px;
    border-radius: 4px;
    transition: background 0.2s;
}

.menu-item:hover {
    background: rgba(255, 255, 255, 0.1);
}

.logout-btn {
    color: rgba(255, 255, 255, 0.9);
}

.menu-icon {
    font-size: 14px;
}

.menu-time {
    font-size: 12px;
    font-weight: 400;
}

/* Desktop Icons */
.desktop-icons {
    position: absolute;
    top: 40px;
    right: 20px;
    display: flex;
    flex-direction: column;
    gap: 20px;
    pointer-events: none;
}

.desktop-icon {
    position: absolute;
    display: flex;
    flex-direction: column;
    align-items: center;
    cursor: pointer;
    padding: 8px;
    border-radius: 8px;
    transition: background 0.2s;
    user-select: none;
    pointer-events: auto;
}

.desktop-icon:hover {
    background: rgba(255, 255, 255, 0.1);
}

.desktop-icon.selected {
    background: rgba(255, 255, 255, 0.2);
}

.icon-image {
    width: 64px;
    height: 64px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 4px;
    border-radius: 12px;
}

.terminal-icon {
    background: linear-gradient(135deg, #1e1e1e 0%, #2d2d2d 100%);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
}

.terminal-icon-content {
    color: #00ff88;
    font-size: 28px;
    font-weight: bold;
    font-family: 'Menlo', monospace;
}

.finder-icon,
.safari-icon {
    font-size: 48px;
}

.icon-label {
    color: white;
    font-size: 12px;
    font-weight: 500;
    text-shadow: 0 1px 3px rgba(0, 0, 0, 0.5);
    text-align: center;
}

/* Dock */
.dock-container {
    position: fixed;
    bottom: 8px;
    left: 50%;
    transform: translateX(-50%);
    z-index: 1000;
}

.dock {
    background: rgba(255, 255, 255, 0.15);
    backdrop-filter: blur(30px);
    border: 1px solid rgba(255, 255, 255, 0.2);
    border-radius: 16px;
    padding: 8px 12px;
    display: flex;
    align-items: center;
    gap: 8px;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
}

.dock-icon {
    width: 56px;
    height: 56px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    border-radius: 12px;
    transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
    font-size: 36px;
    position: relative;
}

.dock-icon:hover {
    transform: translateY(-8px) scale(1.1);
}

.dock-terminal-icon {
    width: 100%;
    height: 100%;
    background: linear-gradient(135deg, #1e1e1e 0%, #2d2d2d 100%);
    border-radius: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #00ff88;
    font-size: 24px;
    font-weight: bold;
    font-family: 'Menlo', monospace;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
}

.dock-divider {
    width: 1px;
    height: 48px;
    background: rgba(255, 255, 255, 0.2);
    margin: 0 4px;
}

/* Terminal Container */
.terminal-container {
    position: fixed;
    display: flex;
    flex-direction: column;
    background: transparent;
    border-radius: 10px;
    overflow: hidden;
    box-shadow: 0 20px 70px rgba(0, 0, 0, 0.5);
    z-index: 600;
}

.terminal-resize-header {
    height: 36px;
    background: rgba(40, 40, 58, 0.95);
    border-bottom: 1px solid rgba(255, 255, 255, 0.08);
    display: flex;
    align-items: center;
    padding: 0 12px;
    cursor: move;
    user-select: none;
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
    border: 0.5px solid rgba(0, 0, 0, 0.1);
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
    color: rgba(255, 255, 255, 0.7);
    font-size: 13px;
    font-weight: 500;
    margin-right: 76px;
}

.terminal-body-wrapper {
    flex: 1;
    overflow: hidden;
    background: #1e1e1e;
}

.terminal-body {
    height: 100%;
    overflow-y: auto;
    padding: 20px;
    font-family: 'Menlo', 'Monaco', 'Courier New', monospace;
    font-size: 13px;
    line-height: 1.5;
    color: #d4d4d4;
    cursor: text;
}

.terminal-body::-webkit-scrollbar {
    width: 8px;
}

.terminal-body::-webkit-scrollbar-track {
    background: transparent;
}

.terminal-body::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.2);
    border-radius: 4px;
}

.welcome-output {
    margin-bottom: 24px;
    padding-bottom: 20px;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.ascii-banner {
    font-size: 10px;
    line-height: 1.2;
    margin-bottom: 16px;
    overflow-x: auto;
}

.banner-text {
    display: block;
    color: #00ff88;
}

.welcome-info {
    line-height: 1.8;
}

.info-line {
    margin-bottom: 6px;
}

.arrow {
    color: #ffaa00;
    margin-right: 8px;
}

.label {
    font-weight: 500;
    color: rgba(255, 255, 255, 0.6);
}

.value {
    font-weight: 600;
    color: #a6e3a1;
}

.cmd {
    font-weight: 600;
    padding: 2px 6px;
    border-radius: 3px;
    color: #89dceb;
    background: rgba(137, 220, 235, 0.1);
}

.separator {
    margin: 0 6px;
    color: rgba(255, 255, 255, 0.3);
}

.output-block {
    margin-bottom: 12px;
}

.command-line {
    margin-bottom: 6px;
    display: flex;
    align-items: center;
    flex-wrap: wrap;
}

.prompt-user {
    font-weight: 600;
    color: #89dceb;
}

.prompt-separator {
    margin: 0 3px;
    color: rgba(255, 255, 255, 0.5);
}

.prompt-host {
    font-weight: 600;
    color: #f5c2e7;
}

.prompt-path {
    font-weight: 500;
    color: #a6e3a1;
}

.prompt-symbol {
    margin: 0 8px;
    font-weight: bold;
    color: #f9e2af;
}

.command-text {
    margin-left: 4px;
    color: #cdd6f4;
}

.output-content {
    margin-left: 0;
    margin-top: 4px;
    white-space: pre-wrap;
    word-wrap: break-word;
}

.output-content.stderr {
    color: #f38ba8;
    background: rgba(243, 139, 168, 0.1);
    padding: 8px 12px;
    border-radius: 6px;
    border-left: 3px solid #f38ba8;
}

.output-content :deep(a) {
    color: #89b4fa;
    text-decoration: none;
    border-bottom: 1px solid transparent;
}

.output-content :deep(a:hover) {
    border-bottom-color: currentColor;
}

.output-content :deep(ul) {
    list-style-type: none;
    padding-left: 0;
    margin: 12px 0;
}

.output-content :deep(li) {
    margin: 8px 0;
    padding-left: 20px;
    position: relative;
}

.output-content :deep(li::before) {
    content: "▸";
    position: absolute;
    left: 0;
    color: #89dceb;
}

.output-content :deep(b) {
    font-weight: 600;
    color: #cdd6f4;
}

.input-line {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    margin-top: 8px;
}

.command-input {
    flex: 1;
    background: transparent;
    border: none;
    outline: none;
    font-family: inherit;
    font-size: inherit;
    color: #d4d4d4;
    padding: 0;
    margin-left: 4px;
    min-width: 200px;
}

.command-input::placeholder {
    color: rgba(255, 255, 255, 0.3);
    font-style: italic;
}

.terminal-content {
    flex: 1;
    overflow: hidden;
}

/* Resize Handles */
.resize-handle {
    position: absolute;
    background: transparent;
    z-index: 10;
}

.resize-right {
    right: 0;
    top: 0;
    width: 5px;
    height: 100%;
    cursor: ew-resize;
}

.resize-bottom {
    bottom: 0;
    left: 0;
    width: 100%;
    height: 5px;
    cursor: ns-resize;
}

.resize-corner {
    right: 0;
    bottom: 0;
    width: 15px;
    height: 15px;
    cursor: nwse-resize;
}

/* Responsive */
@media (max-width: 767px) {
    .desktop {
        display: none !important;
    }
}
</style>
