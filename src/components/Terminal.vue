<template>
    <div class="terminal-wrapper" :class="{ 'desktop-mode': isDesktopMode, 'mobile-mode': isMobileMode }">
        <!-- Mobile Header -->
        <div v-if="isMobileMode" class="mobile-terminal-header">
            <button class="mobile-back-btn" @click="handleClose">
                ‹ Back
            </button>
            <span class="mobile-terminal-title">Terminal</span>
            <span class="mobile-spacer"></span>
        </div>
        
        <div class="terminal-window" @click="focusInput">
            <div class="terminal-header" v-if="!isMobileMode">
                <div class="traffic-lights">
                    <span class="light close" @click.stop="handleClose"></span>
                    <span class="light minimize" @click.stop="minimizeWindow"></span>
                    <span class="light maximize" @click.stop="toggleFullscreen"></span>
                </div>
                <div class="terminal-title">
                    <span class="title-icon">⌘</span>
                    <span class="title-text">pathum@portfolio — zsh</span>
                </div>
            </div>
            
            <div class="terminal-body" ref="outputContainer">
                <div v-html="welcomeMessage" class="welcome-output"></div>
                
                <div v-for="(item, index) in outputHistory" :key="index" class="output-block">
                    <div v-if="item.command" class="command-line">
                        <span class="prompt-user">pathum</span>
                        <span class="prompt-separator">@</span>
                        <span class="prompt-host">portfolio</span>
                        <span class="prompt-separator">:</span>
                        <span class="prompt-path">{{ item.prompt.split(' ')[1] }}</span>
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
                    <span class="prompt-path">{{ cwd }}</span>
                    <span class="prompt-symbol">$</span>
                    <input 
                        ref="commandInput"
                        v-model="currentCommand"
                        @keydown.enter="executeCommand"
                        @keydown.tab.prevent="autocomplete"
                        @keydown.up.prevent="navigateHistory('up')"
                        @keydown.down.prevent="navigateHistory('down')"
                        @keydown.ctrl.l.prevent="clearScreen"
                        class="command-input"
                        spellcheck="false"
                        autocomplete="off"
                        placeholder="type 'help' to get started..."
                    />
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, nextTick, onMounted } from 'vue';
import { fileSystem } from '../data/filesystem';

const props = defineProps({
    isDesktopMode: {
        type: Boolean,
        default: false
    },
    isMobileMode: {
        type: Boolean,
        default: false
    }
});

const emit = defineEmits(['close']);

const cwd = ref('~');
const commandHistory = ref([]);
const historyIndex = ref(-1);
const currentCommand = ref('');
const outputHistory = ref([]);
const commandInput = ref(null);
const outputContainer = ref(null);

const prompt = computed(() => `pathum@portfolio ${cwd.value} $`);

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

function generateBanner() {
    return `
<div class="ascii-banner">
<span class="banner-text">
 ██████╗  █████╗ ██████╗     ██████╗  █████╗ ████████╗██╗  ██╗██╗   ██╗███╗   ███╗
██╔════╝ ██╔══██╗██╔══██╗    ██╔══██╗██╔══██╗╚══██╔══╝██║  ██║██║   ██║████╗ ████║
██║  ███╗███████║██████╔╝    ██████╔╝███████║   ██║   ███████║██║   ██║██╔████╔██║
██║   ██║██╔══██║██╔═══╝     ██╔═══╝ ██╔══██║   ██║   ██╔══██║██║   ██║██║╚██╔╝██║
╚██████╔╝██║  ██║██║         ██║     ██║  ██║   ██║   ██║  ██║╚██████╔╝██║ ╚═╝ ██║
 ╚═════╝ ╚═╝  ╚═╝╚═╝         ╚═╝     ╚═╝  ╚═╝   ╚═╝   ╚═╝  ╚═╝ ╚═════╝ ╚═╝     ╚═╝
</span>
</div>`;
}

const resolvePath = (path) => {
    if (typeof path !== 'string' || !path) return '~';  // Fix: Default to home if invalid
    if (path.startsWith('/')) return path.slice(1);
    const parts = cwd.value.split('/').filter(Boolean).concat(path.split('/').filter(Boolean));
    const resolved = [];
    parts.forEach(part => {
        if (part === '..') resolved.pop();
        else if (part) resolved.push(part);
    });
    return resolved.join('/') || '~';
};

const getDir = (path) => {
    const parts = path.split('/').filter(Boolean);
    let dir = fileSystem;
    parts.forEach(part => { if (dir && dir[part]) dir = dir[part]; });
    return dir || {};
};

function addOutput(output, type = 'stdout') {
    outputHistory.value.push({
        prompt: prompt.value,
        command: currentCommand.value,
        output: output,
        type: type
    });
    nextTick(() => {
        if (outputContainer.value) {
            outputContainer.value.scrollTop = outputContainer.value.scrollHeight;
        }
    });
}

const commands = {
    help: () => ({
        output: '<b>Available Commands:</b><ul><li><b>cd [dir]</b> - Change directory</li><li><b>ls</b> - List files</li><li><b>cat [file]</b> - Read file</li><li><b>clear</b> - Clear screen</li><li><b>banner</b> - Show stylish banner</li><li><b>whoami</b> - Show bio</li><li><b>open [resume/project-name]</b> - Open link</li><li><b>exit</b> - Farewell message</li><li><b>pwd</b> - Current directory</li><li><b>echo [text]</b> - Echo with colors</li><li><b>history</b> - Show command history</li></ul>',
        type: 'stdout'
    }),
    
    ls: () => {
        const dir = getDir(cwd.value);
        if (typeof dir !== 'object') return { output: 'Not a directory', type: 'stderr' };
        const items = Object.keys(dir);
        if (items.length === 0) return { output: '(empty directory)', type: 'stdout' };
        const output = items.map(key => {
            const isDir = typeof dir[key] === 'object' && !Array.isArray(dir[key]);
            const color = isDir ? '#00bfff' : '#00ff00';
            return `<span style="color: ${color}; font-weight: bold;">${key}${isDir ? '/' : ''}</span>`;
        }).join('  ');
        return { output, type: 'stdout' };
    },
    
    cd: (args) => {
        const dir = args.join(' ').trim();
        if (!dir) {
            cwd.value = '~';
            return null;
        }
        const newPath = resolvePath(dir);
        const targetDir = getDir(newPath);
        if (targetDir && typeof targetDir === 'object' && !Array.isArray(targetDir)) {
            cwd.value = newPath || '~';
            return null;
        }
        return { output: `cd: no such directory: ${dir}`, type: 'stderr' };
    },
    
    cat: (args) => {
        const file = args.join(' ').trim();
        if (!file) return { output: 'cat: missing file operand<br>Try \'help\' for available commands.', type: 'stderr' };
        const dir = getDir(cwd.value);
        const content = dir[file];
        if (content !== undefined && typeof content === 'string') {
            return { output: `<div class="typing">${content}</div>`, type: 'stdout' };
        }
        return { output: `cat: ${file}: No such file<br>Type 'ls' to see available files.`, type: 'stderr' };
    },
    
    banner: () => ({ output: generateBanner(), type: 'stdout' }),
    
    clear: () => {
        outputHistory.value = [];
        return null;
    },
    
    whoami: () => ({ output: fileSystem['~']['bio.txt'], type: 'stdout' }),
    
    open: (args) => {
        const target = args[0];
        if (!target) return { output: 'open: missing argument<br>Usage: open [resume|project-name|email]', type: 'stderr' };
        let url = '';
        if (target === 'resume') url = 'https://www.pasindupathum.me/';
        else if (fileSystem['~/projects'][`${target}.txt`]) url = `https://github.com/pathum/${target}`;
        else if (target === 'email') url = 'mailto:pathumpasindu41@gmail.com';
        if (url) {
            window.open(url, '_blank');
            return { output: `Opening ${target} in new tab...`, type: 'stdout' };
        }
        return { output: `open: unknown target '${target}'<br>Try 'cd projects' and 'ls' to see available projects.`, type: 'stderr' };
    },
    
    exit: () => ({ 
        output: '<b>Farewell!</b> Contact me at <a href="mailto:pathumpasindu41@gmail.com">pathumpasindu41@gmail.com</a>. Reload to restart.', 
        type: 'stdout' 
    }),
    
    pwd: () => ({ output: cwd.value, type: 'stdout' }),
    
    echo: (args) => {
        const text = args.join(' ');
        if (!text) return { output: '', type: 'stdout' };
        const coloredText = text.split(' ').map(word => 
            `<span style="color: hsl(${Math.random() * 360}, 100%, 50%);">${word}</span>`
        ).join(' ');
        return { output: coloredText, type: 'stdout' };
    },
    
    history: () => {
        if (commandHistory.value.length === 0) return { output: '(no commands in history)', type: 'stdout' };
        const historyList = commandHistory.value.map((cmd, idx) => `${idx + 1}  ${cmd}`).join('<br>');
        return { output: historyList, type: 'stdout' };
    },
    
    fullscreen: () => {
        if (document.documentElement.requestFullscreen) {
            document.documentElement.requestFullscreen().catch(err => {
                return { output: `Fullscreen failed: ${err.message}`, type: 'stderr' };
            });
            return { output: 'Entering fullscreen mode...', type: 'stdout' };
        }
        return { output: 'Fullscreen not supported.', type: 'stderr' };
    }
};

function executeCommand() {
    const cmd = currentCommand.value.trim();
    if (!cmd) {
        currentCommand.value = '';
        return;
    }
    
    const parts = cmd.split(' ').filter(Boolean);
    const commandName = parts[0];
    const args = parts.slice(1);
    
    commandHistory.value.push(cmd);
    historyIndex.value = commandHistory.value.length;
    
    if (commands[commandName]) {
        const result = commands[commandName](args);
        if (result) {
            addOutput(result.output, result.type);
        } else {
            outputHistory.value.push({
                prompt: prompt.value,
                command: currentCommand.value,
                output: '',
                type: 'stdout'
            });
        }
    } else {
        const suggestions = Object.keys(commands).sort().join(', ');
        addOutput(
            `Command not found: ${commandName}<br><br>` +
            `<b>Available commands:</b><br>${suggestions}<br><br>` +
            `Type <b>help</b> for detailed command usage.`,
            'stderr'
        );
    }
    
    currentCommand.value = '';
}

function autocomplete() {
    const parts = currentCommand.value.split(' ');
    const commandName = parts[0];
    
    if (parts.length === 1) {
        const matches = Object.keys(commands).filter(cmd => cmd.startsWith(commandName));
        if (matches.length === 1) {
            currentCommand.value = matches[0] + ' ';
        }
    } else {
        const dir = getDir(cwd.value);
        const partial = parts[parts.length - 1];
        const matches = Object.keys(dir).filter(f => f.startsWith(partial));
        if (matches.length === 1) {
            parts[parts.length - 1] = matches[0];
            currentCommand.value = parts.join(' ');
        }
    }
}

function navigateHistory(direction) {
    if (direction === 'up' && historyIndex.value > 0) {
        historyIndex.value--;
        currentCommand.value = commandHistory.value[historyIndex.value];
    } else if (direction === 'down' && historyIndex.value < commandHistory.value.length - 1) {
        historyIndex.value++;
        currentCommand.value = commandHistory.value[historyIndex.value];
    } else if (direction === 'down') {
        historyIndex.value = commandHistory.value.length;
        currentCommand.value = '';
    }
}

function clearScreen() {
    outputHistory.value = [];
}

function focusInput() {
    commandInput.value?.focus();
}

function minimizeWindow() {
    // Placeholder for minimize action
    console.log('Minimize');
}

function handleClose() {
    emit('close');
}

function toggleFullscreen() {
    if (document.documentElement.requestFullscreen) {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen();
        } else {
            document.exitFullscreen();
        }
    }
}

onMounted(() => {
    focusInput();
});

</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=SF+Mono:wght@400;500;600&family=Inter:wght@400;500;600&display=swap');

* {
    box-sizing: border-box;
}

.terminal-wrapper {
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 40px 20px;
    transition: background-color 0.3s ease;
}

.terminal-wrapper.desktop-mode {
    position: fixed;
    inset: 0;
    z-index: 500;
    background: rgba(0, 0, 0, 0.3);
    backdrop-filter: blur(10px);
    animation: fadeIn 0.3s ease;
}

.terminal-wrapper.mobile-mode {
    position: fixed;
    inset: 0;
    z-index: 500;
    padding: 0;
    animation: slideUpMobile 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    display: flex;
    flex-direction: column;
    touch-action: auto;
}

.terminal-wrapper.mobile-mode .terminal-window {
    max-width: 100%;
    height: 100%;
    max-height: 100%;
    border-radius: 0;
    flex: 1;
}

/* Mobile Terminal Header */
.mobile-terminal-header {
    height: 56px;
    background: rgba(30, 30, 30, 0.95);
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 16px;
    flex-shrink: 0;
}

.mobile-back-btn {
    background: none;
    border: none;
    color: #007AFF;
    font-size: 17px;
    padding: 8px 0;
    cursor: pointer;
    min-width: 60px;
    text-align: left;
}

.mobile-terminal-title {
    color: white;
    font-size: 17px;
    font-weight: 600;
}

.mobile-spacer {
    min-width: 60px;
}

.terminal-wrapper {
    background: #1e1e1e;
}

.terminal-window {
    width: 100%;
    max-width: 1200px;
    height: 85vh;
    max-height: 85vh;
    border-radius: 10px;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    position: relative;
}

.terminal-window {
    background: #1e1e1e;
    box-shadow: 0 20px 70px rgba(0, 0, 0, 0.5),
                0 0 0 1px rgba(0, 0, 0, 0.3);
}

.terminal-header {
    padding: 11px 16px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-bottom: 1px solid;
    user-select: none;
}

.terminal-header {
    background: #2d2d2d;
    border-color: rgba(255, 255, 255, 0.05);
}

.traffic-lights {
    display: flex;
    gap: 8px;
    align-items: center;
}

.light {
    width: 12px;
    height: 12px;
    border-radius: 50%;
    cursor: pointer;
    transition: all 0.15s ease;
    position: relative;
}

.light::before {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: 50%;
    opacity: 0;
    transition: opacity 0.15s ease;
}

.light.close {
    background: linear-gradient(135deg, #ff6159 0%, #ff5449 100%);
    border: 0.5px solid rgba(0, 0, 0, 0.1);
}

.light.minimize {
    background: linear-gradient(135deg, #ffbd44 0%, #ffb529 100%);
    border: 0.5px solid rgba(0, 0, 0, 0.1);
}

.light.maximize {
    background: linear-gradient(135deg, #27c93f 0%, #1fb934 100%);
    border: 0.5px solid rgba(0, 0, 0, 0.1);
}

.light:active {
    transform: scale(0.95);
}

.terminal-title {
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    display: flex;
    align-items: center;
    gap: 8px;
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
    font-size: 13px;
    font-weight: 500;
}

.terminal-title {
    color: rgba(255, 255, 255, 0.7);
}

.title-icon {
    font-size: 16px;
}

.terminal-actions {
    display: flex;
    gap: 8px;
}

.action-btn {
    background: transparent;
    border: none;
    cursor: pointer;
    font-size: 16px;
    padding: 4px 8px;
    border-radius: 6px;
    transition: all 0.2s ease;
    display: flex;
    align-items: center;
    justify-content: center;
}

.action-btn:hover {
    background: rgba(255, 255, 255, 0.1);
}

.terminal-body {
    flex: 1;
    overflow-y: auto;
    overflow-x: hidden;
    padding: 20px;
    font-family: 'Menlo', 'Monaco', 'Courier New', monospace;
    font-size: 13px;
    line-height: 1.5;
    cursor: text;
    min-height: 0;
}

.terminal-body {
    color: #d4d4d4;
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

.terminal-body::-webkit-scrollbar-thumb:hover {
    background: rgba(255, 255, 255, 0.3);
}

.welcome-output {
    margin-bottom: 24px;
    padding-bottom: 20px;
    border-bottom: 1px solid;
}

.welcome-output {
    border-color: rgba(255, 255, 255, 0.1);
}

.ascii-banner {
    font-size: 10px;
    line-height: 1.2;
    margin-bottom: 16px;
    overflow-x: auto;
    overflow-y: hidden;
}

.banner-text {
    display: block;
}

.banner-text {
    color: #00ff88 !important;
}

.ascii-banner::-webkit-scrollbar {
    height: 4px;
}

.ascii-banner::-webkit-scrollbar-track {
    background: transparent;
}

.ascii-banner::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.2);
    border-radius: 2px;
}

.welcome-info {
    line-height: 1.8;
}

.info-line {
    margin-bottom: 6px;
}

.arrow {
    margin-right: 8px;
}

.arrow {
    color: #ffaa00 !important;
}

.label {
    font-weight: 500;
}

.label {
    color: rgba(255, 255, 255, 0.6);
}

.value {
    font-weight: 600;
}

.value {
    color: #a6e3a1;
}

.cmd {
    font-weight: 600;
    padding: 2px 6px;
    border-radius: 3px;
}

.cmd {
    color: #89dceb;
    background: rgba(137, 220, 235, 0.1);
}

.separator {
    margin: 0 6px;
}

.separator {
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
}

.prompt-user {
    color: #89dceb;
}

.prompt-separator {
    margin: 0 3px;
}

.prompt-separator {
    color: rgba(255, 255, 255, 0.5);
}

.prompt-host {
    font-weight: 600;
}

.prompt-host {
    color: #f5c2e7;
}

.prompt-path {
    font-weight: 500;
}

.prompt-path {
    color: #a6e3a1;
}

.prompt-symbol {
    margin: 0 8px;
    font-weight: bold;
}

.prompt-symbol {
    color: #f9e2af;
}

.command-text {
    margin-left: 4px;
}

.command-text {
    color: #cdd6f4;
}

.output-content {
    margin-left: 0;
    margin-top: 4px;
    white-space: pre-wrap;
    word-wrap: break-word;
}

.output-content.stderr {
    padding: 8px 12px;
    border-radius: 6px;
    margin: 8px 0;
}

.output-content.stderr {
    color: #f38ba8 !important;
    background: rgba(243, 139, 168, 0.1);
    border-left: 3px solid #f38ba8;
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
    color: inherit;
    padding: 0;
    margin-left: 4px;
    min-width: 200px;
}

.command-input::placeholder {
    font-style: italic;
}

.command-input::placeholder {
    color: rgba(255, 255, 255, 0.3);
}

/* Typography styles */
.terminal-wrapper :deep(a) {
    text-decoration: none;
    cursor: pointer;
    transition: all 0.2s ease;
    border-bottom: 1px solid transparent;
}

.terminal-wrapper :deep(a) {
    color: #89b4fa;
}

.terminal-wrapper :deep(a:hover) {
    border-bottom-color: currentColor;
}

.terminal-wrapper :deep(ul) {
    list-style-type: none;
    padding-left: 0;
    margin: 12px 0;
}

.terminal-wrapper :deep(li) {
    margin: 8px 0;
    padding-left: 20px;
    position: relative;
}

.terminal-wrapper :deep(li::before) {
    content: "▸";
    position: absolute;
    left: 0;
}

.terminal-wrapper :deep(li::before) {
    color: #89dceb;
}

.terminal-wrapper :deep(b) {
    font-weight: 600;
}

.terminal-wrapper :deep(b) {
    color: #cdd6f4;
}

.terminal-wrapper :deep(i) {
    font-style: italic;
}

.terminal-wrapper :deep(i) {
    color: rgba(255, 255, 255, 0.7);
}

/* Typing animation */
.typing {
    white-space: pre-wrap;
    overflow: hidden;
}

/* Mobile */
@media (max-width: 768px) {
    .terminal-wrapper {
        padding: 10px;
    }
    
    .terminal-window {
        max-width: 100%;
        height: 95vh;
        border-radius: 8px;
    }
    
    .terminal-body {
        font-size: 12px;
        padding: 16px;
    }
    
    .terminal-header {
        padding: 10px 12px;
    }
    
    .terminal-title {
        font-size: 12px;
    }
    
    .light {
        width: 10px;
        height: 10px;
    }
    
    .ascii-banner {
        font-size: 7px;
        line-height: 1.1;
    }
    
    .welcome-info {
        font-size: 11px;
    }
}

@media (max-width: 480px) {
    .ascii-banner {
        font-size: 5.5px;
        line-height: 1;
    }
    
    .terminal-body {
        font-size: 11px;
        padding: 12px;
    }
    
    .welcome-info {
        font-size: 10px;
    }
}

@media (min-width: 1400px) {
    .ascii-banner {
        font-size: 11px;
    }
}

/* Animations */
@keyframes fadeIn {
    from {
        opacity: 0;
        transform: translateY(10px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

.output-block {
    animation: fadeIn 0.3s ease;
}

.terminal-wrapper.desktop-mode .terminal-window {
    animation: slideUp 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

@keyframes slideUp {
    from {
        opacity: 0;
        transform: translateY(50px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

@keyframes slideUpMobile {
    from {
        transform: translateY(100%);
    }
    to {
        transform: translateY(0);
    }
}
</style>