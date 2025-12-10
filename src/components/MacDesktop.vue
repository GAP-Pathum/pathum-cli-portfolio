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
                    <div v-else-if="icon.id === 'linkedin'" class="social-icon-content">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white" width="36" height="36">
                            <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                        </svg>
                    </div>
                    <div v-else-if="icon.id === 'facebook'" class="social-icon-content">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white" width="36" height="36">
                            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                        </svg>
                    </div>
                    <div v-else-if="icon.id === 'instagram'" class="social-icon-content">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white" width="36" height="36">
                            <path d="M12 0C8.74 0 8.333.015 7.053.072 5.775.132 4.905.333 4.14.63c-.789.306-1.459.717-2.126 1.384S.935 3.35.63 4.14C.333 4.905.131 5.775.072 7.053.012 8.333 0 8.74 0 12s.015 3.667.072 4.947c.06 1.277.261 2.148.558 2.913.306.788.717 1.459 1.384 2.126.667.666 1.336 1.079 2.126 1.384.766.296 1.636.499 2.913.558C8.333 23.988 8.74 24 12 24s3.667-.015 4.947-.072c1.277-.06 2.148-.262 2.913-.558.788-.306 1.459-.718 2.126-1.384.666-.667 1.079-1.335 1.384-2.126.296-.765.499-1.636.558-2.913.06-1.28.072-1.687.072-4.947s-.015-3.667-.072-4.947c-.06-1.277-.262-2.149-.558-2.913-.306-.789-.718-1.459-1.384-2.126C21.319 1.347 20.651.935 19.86.63c-.765-.297-1.636-.499-2.913-.558C15.667.012 15.26 0 12 0zm0 2.16c3.203 0 3.585.016 4.85.071 1.17.055 1.805.249 2.227.415.562.217.96.477 1.382.896.419.42.679.819.896 1.381.164.422.36 1.057.413 2.227.057 1.266.07 1.646.07 4.85s-.015 3.585-.074 4.85c-.061 1.17-.256 1.805-.421 2.227-.224.562-.479.96-.899 1.382-.419.419-.824.679-1.38.896-.42.164-1.065.36-2.235.413-1.274.057-1.649.07-4.859.07-3.211 0-3.586-.015-4.859-.074-1.171-.061-1.816-.256-2.236-.421-.569-.224-.96-.479-1.379-.899-.421-.419-.69-.824-.9-1.38-.165-.42-.359-1.065-.42-2.235-.045-1.26-.061-1.649-.061-4.844 0-3.196.016-3.586.061-4.861.061-1.17.255-1.814.42-2.234.21-.57.479-.96.9-1.381.419-.419.81-.689 1.379-.898.42-.166 1.051-.361 2.221-.421 1.275-.045 1.65-.06 4.859-.06l.045.03zm0 3.678c-3.405 0-6.162 2.76-6.162 6.162 0 3.405 2.76 6.162 6.162 6.162 3.405 0 6.162-2.76 6.162-6.162 0-3.405-2.76-6.162-6.162-6.162zM12 16c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4zm7.846-10.405c0 .795-.646 1.44-1.44 1.44-.795 0-1.44-.646-1.44-1.44 0-.794.646-1.439 1.44-1.439.793-.001 1.44.645 1.44 1.439z"/>
                        </svg>
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

// File system
const fileSystem = {
  '~': {
    'README.txt': '<b>Welcome to G.A.P. Pathum\'s CLI Portfolio!</b><br><i>Type "help" for commands. Navigate directories like "cd projects" or "cat bio.txt" for details.</i><br><br>Tip: Use "banner" for a stylish intro!',
    'bio.txt': '<b>About Me:</b><br><i>Full-stack developer from Ragala, Sri Lanka.</i><br>Curiosity drives exploration beyond surface appearances, seeking patterns and structure through patient observation and systematic reasoning. Understanding emerges from disciplined focus rather than haste, where complexity transforms into clarity through sustained attention and deliberate practice. Simplicity guides every pursuit—precision replaces excess, depth supersedes breadth, and awareness overcomes impulse. Knowledge matures into insight through reflection, evolving into quiet confidence built on consistency and balance. Growth manifests through steady refinement, where meaningful progress arises from thoughtful engagement and unwavering commitment to clarity, purpose, and lasting transformation.',
    'education': {},
    'skills.txt': '<b>Technical Skills:</b><ul><li>HTML, CSS, JavaScript</li><li>Figma, Photoshop</li><li>React, Node.js, Express, MongoDB, MySQL</li><li>C, Python, Java, PHP</li><li>Git, Tailwind, ViteJS, WordPress</li><li>Microsoft Office</li></ul><br><b>Soft Skills:</b><ul><li>Patient observation & systematic reasoning</li><li>Disciplined focus & reflection</li><li>Consistency, balance, & steady refinement</li></ul>',
    'contact.txt': '<b>Contact Info:</b><ul><li>Email: <a href="mailto:pathumpasindu41@gmail.com">pathumpasindu41@gmail.com</a></li><li>Phone: +94 752 955 301</li><li>Location: Ragala, Sri Lanka</li><li>Website: <a href="https://www.pasindupathum.me/">pasindupathum.me</a></li><li>Social: GitHub/LinkedIn (add links if available)</li></ul>',
    'resume.txt': '<b>Resume:</b><br>View my full resume at <a href="https://www.pasindupathum.me/">https://www.pasindupathum.me/</a> or type "open resume".<br><i>Includes education, skills, projects, and more.</i>',
    'projects': {},  
    'certificates.txt': '<b>Certificates & Achievements:</b><br>No formal certifications listed yet, but key achievements include:<ul><li>Capstone Project: Build Mate Plus (2024)</li><li>Ongoing BSc in Computing and Information Systems</li><li>Multiple web and ML projects</li></ul>'
  },
  '~/education': {
    'bsc.txt': '<b>BSc (Hons) Computing and Information Systems</b><br>Sabaragamuwa University of Sri Lanka<br>2022–Present',
    'advanced-levels.txt': '<b>G.C.E. Advanced Levels (Physics Stream)</b><br>T.B.M. Herath National School – Ragala<br>2020',
    'ordinary-levels.txt': '<b>G.C.E. Ordinary Levels</b><br>T.B.M. Herath National School – Ragala<br>2016'
  },
  '~/projects': {
    'build-mate-plus.txt': '<b>Build Mate Plus</b> – Capstone Project 2024<br><i>Description:</i> Comprehensive construction management tool for tracking materials, budgets, and progress.<br><i>Technologies:</i> React, Node.js, MongoDB, Tailwind CSS',
    'foody.txt': '<b>Foody</b> – Online Food Ordering App<br><i>Description:</i> User-friendly platform for browsing menus, placing orders, and real-time tracking.<br><i>Technologies:</i> React, Express, MongoDB, Stripe for payments',
    'syncpress.txt': '<b>SyncPress</b> – Digital Services Application<br><i>Description:</i> App for managing digital printing services, orders, and customer interactions.<br><i>Technologies:</i> PHP, MySQL, JavaScript, Bootstrap',
    'spam-detector.txt': '<b>Spam Detector</b><br><i>Description:</i> Web app detecting spam in English/Sinhala messages using SMSSpamCollection and SinhalaSpamCollection datasets.<br><i>Technologies:</i> Python (Scikit-learn for TF-IDF & Naive Bayes), Flask, HTML/CSS/JS',
    'react-portfolio.txt': '<b>React Vite Portfolio</b><br><i>Description:</i> Personal portfolio with Home, About, Projects sections, animations.<br><i>Technologies:</i> React, Vite, Bootstrap, Framer Motion',
    'drug-inventory-dashboard.txt': '<b>Drug Inventory Dashboard</b><br><i>Description:</i> Responsive, role-based dashboard for managing drug stock.<br><i>Technologies:</i> PHP, Laravel, Bootstrap, MySQL',
    'hotel-booking.txt': '<b>Hotel Booking System</b><br><i>Description:</i> Booking system using Google Sheets as backend for room availability.<br><i>Technologies:</i> HTML, CSS, JavaScript, Google Apps Script',
  }
};

const cwd = ref('~');

const resolvePath = (path) => {
    if (!path) return cwd.value;
    if (path.startsWith('/')) return path.slice(1) || '~';
    if (path === '~') return '~';
    if (path === '..') {
        const parts = cwd.value.split('/').filter(Boolean);
        parts.pop();
        return parts.length ? parts.join('/') : '~';
    }
    if (path === '.') return cwd.value;
    
    const current = cwd.value === '~' ? '' : cwd.value;
    const newPath = current ? `${current}/${path}` : path;
    return newPath;
};

const getDir = (path) => {
    const normalized = path === '~' ? '~' : path.replace(/^~\//, '~/');
    const parts = normalized.split('/').filter(Boolean);
    
    let dir = fileSystem;
    for (const part of parts) {
        if (dir && dir[part]) {
            dir = dir[part];
        } else {
            return null;
        }
    }
    return dir;
};

// Terminal commands
const commands = {
    help: () => '<b>Available Commands:</b><ul><li><b>cd [dir]</b> - Change directory</li><li><b>ls</b> - List files</li><li><b>cat [file]</b> - Read file</li><li><b>clear</b> - Clear screen</li><li><b>banner</b> - Show banner</li><li><b>whoami</b> - About me</li><li><b>pwd</b> - Current directory</li><li><b>open [resume/project]</b> - Open link</li><li><b>exit</b> - Close terminal</li><li><b>echo [text]</b> - Echo text</li><li><b>history</b> - Command history</li></ul>',
    
    clear: () => { 
        terminalOutput.value = []; 
        return null; 
    },
    
    banner: () => welcomeMessage,
    
    whoami: () => {
        const bioFile = fileSystem['~']['bio.txt'];
        return bioFile || '<b>GAP Pathum</b><br>Full-Stack Developer from Sri Lanka 🇱🇰';
    },
    
    pwd: () => cwd.value,
    
    ls: () => {
        const dir = getDir(cwd.value);
        if (!dir) return '<span style="color: #f38ba8;">Directory not found</span>';
        
        const items = Object.keys(dir);
        if (items.length === 0) return '<i>Empty directory</i>';
        
        return items.map(item => {
            const isDir = typeof dir[item] === 'object' && !Array.isArray(dir[item]);
            return isDir ? `<span style="color: #89dceb;">${item}/</span>` : `<span style="color: #a6e3a1;">${item}</span>`;
        }).join('  ');
    },
    
    cd: (args) => {
        if (!args[0]) {
            cwd.value = '~';
            return null;
        }
        
        const targetPath = resolvePath(args[0]);
        const dir = getDir(targetPath);
        
        if (!dir) {
            return `<span style="color: #f38ba8;">cd: ${args[0]}: No such directory</span>`;
        }
        
        if (typeof dir !== 'object') {
            return `<span style="color: #f38ba8;">cd: ${args[0]}: Not a directory</span>`;
        }
        
        cwd.value = targetPath;
        return null;
    },
    
    cat: (args) => {
        if (!args[0]) {
            return '<span style="color: #f38ba8;">cat: missing file argument</span>';
        }
        
        const dir = getDir(cwd.value);
        if (!dir) return '<span style="color: #f38ba8;">Current directory not found</span>';
        
        const file = dir[args[0]];
        if (!file) {
            return `<span style="color: #f38ba8;">cat: ${args[0]}: No such file</span>`;
        }
        
        if (typeof file === 'object') {
            return `<span style="color: #f38ba8;">cat: ${args[0]}: Is a directory</span>`;
        }
        
        return file;
    },
    
    open: (args) => {
        if (!args[0]) {
            return '<span style="color: #f38ba8;">open: missing argument</span>';
        }
        
        const target = args[0];
        let url = '';
        
        if (target === 'resume') {
            url = 'https://www.pasindupathum.me/';
        } else if (target === 'email') {
            url = 'mailto:pathumpasindu41@gmail.com';
        } else {
            const projectsDir = getDir('~/projects');
            if (projectsDir && projectsDir[`${target}.txt`]) {
                url = `https://github.com/GAP-Pathum/${target}`;
            }
        }
        
        if (url) {
            window.open(url, '_blank');
            return `<span style="color: #a6e3a1;">Opening ${target}...</span>`;
        }
        
        return `<span style="color: #f38ba8;">open: unknown target '${target}'</span>`;
    },
    
    exit: () => {
        closeTerminal();
        return null;
    },
    
    echo: (args) => {
        return args.join(' ') || '';
    },
    
    history: () => {
        if (commandHistory.value.length === 0) {
            return '<i>No command history</i>';
        }
        return commandHistory.value.map((cmd, i) => `${i + 1}  ${cmd}`).join('<br>');
    }
};

// Desktop icons with positions arranged from left side
const desktopIcons = ref([
    // Column 1
    { id: 'terminal', label: 'Terminal', emoji: '', iconClass: 'terminal-icon', x: 20, y: 40 },
    { id: 'finder', label: 'Finder', emoji: '🗂️', iconClass: 'finder-icon', x: 20, y: 130 },
    { id: 'safari', label: 'Safari', emoji: '🧭', iconClass: 'safari-icon', x: 20, y: 220 },
    { id: 'mail', label: 'Mail', emoji: '✉️', iconClass: 'mail-icon', x: 20, y: 310 },
    { id: 'photos', label: 'Photos', emoji: '🌅', iconClass: 'photos-icon', x: 20, y: 400 },
    { id: 'music', label: 'Music', emoji: '🎵', iconClass: 'music-icon', x: 20, y: 490 },
    // Column 2
    { id: 'notes', label: 'Notes', emoji: '📝', iconClass: 'notes-icon', x: 110, y: 40 },
    { id: 'calendar', label: 'Calendar', emoji: '📅', iconClass: 'calendar-icon', x: 110, y: 130 },
    { id: 'settings', label: 'Settings', emoji: '⚙️', iconClass: 'settings-icon', x: 110, y: 220 },
    { id: 'linkedin', label: 'LinkedIn', emoji: '', iconClass: 'linkedin-icon', x: 110, y: 310 },
    { id: 'facebook', label: 'Facebook', emoji: '', iconClass: 'facebook-icon', x: 110, y: 400 },
    { id: 'instagram', label: 'Instagram', emoji: '', iconClass: 'instagram-icon', x: 110, y: 490 }
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
    } else if (appName === 'linkedin') {
        window.open('https://www.linkedin.com/in/pasindu-pathum-98a299249', '_blank');
    } else if (appName === 'facebook') {
        window.open('https://www.facebook.com/gap.pathum', '_blank');
    } else if (appName === 'instagram') {
        window.open('https://www.instagram.com/gap_pathum', '_blank');
    }
    // Other apps can be implemented later
}

function selectDockIcon(iconName) {
    if (iconName === 'terminal') {
        terminalOpen.value = true;
        nextTick(() => {
            terminalInput.value?.focus();
        });
    } else if (iconName === 'linkedin') {
        window.open('https://www.linkedin.com/in/pasindu-pathum-98a299249', '_blank');
    } else if (iconName === 'facebook') {
        window.open('https://www.facebook.com/gap.pathum', '_blank');
    } else if (iconName === 'instagram') {
        window.open('https://www.instagram.com/gap_pathum', '_blank');
    }
    // Other apps can be implemented later
}

function closeTerminal() {
    terminalOpen.value = false;
    terminalOutput.value = [];
    currentCommand.value = '';
    cwd.value = '~';
}

function executeTerminalCommand() {
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
    
    let output = '';
    
    if (commands[commandName]) {
        output = commands[commandName](args);
    } else {
        output = `<span style="color: #f38ba8;">Command not found: ${commandName}<br>Type 'help' for available commands.</span>`;
    }
    
    if (output !== null) {
        terminalOutput.value.push({
            prompt: cwd.value,
            command: cmd,
            output: output,
            type: 'stdout'
        });
    }
    
    currentCommand.value = '';
    
    nextTick(() => {
        if (terminalOutputContainer.value) {
            terminalOutputContainer.value.scrollTop = terminalOutputContainer.value.scrollHeight;
        }
        terminalInput.value?.focus();
    });
}

function autocompleteCommand() {
    const cmd = currentCommand.value.trim();
    if (!cmd) return;
    
    const matches = Object.keys(commands).filter(c => c.startsWith(cmd));
    if (matches.length === 1) {
        currentCommand.value = matches[0];
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

function clearTerminal() {
    terminalOutput.value = [];
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
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
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

.linkedin-icon {
    background: linear-gradient(135deg, #0077B5 0%, #005582 100%);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
    overflow: hidden;
}

.linkedin-icon .social-icon-content {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
}

.linkedin-icon .social-icon-content svg {
    width: 36px;
    height: 36px;
}

.facebook-icon {
    background: linear-gradient(135deg, #1877F2 0%, #0d5bbd 100%);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
    overflow: hidden;
}

.facebook-icon .social-icon-content {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
}

.facebook-icon .social-icon-content svg {
    width: 36px;
    height: 36px;
}

.instagram-icon {
    background: linear-gradient(135deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
    overflow: hidden;
}

.instagram-icon .social-icon-content {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
}

.instagram-icon .social-icon-content svg {
    width: 36px;
    height: 36px;
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
