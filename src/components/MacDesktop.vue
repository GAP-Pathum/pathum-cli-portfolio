<template>
    <div class="desktop" :style="desktopBackground">
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
                <div class="menu-icon wifi-icon">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="white">
                        <path
                            d="M1 9l2 2c4.97-4.97 13.03-4.97 18 0l2-2C16.93 2.93 7.08 2.93 1 9zm8 8l3 3 3-3c-1.65-1.66-4.34-1.66-6 0zm-4-4l2 2c2.76-2.76 7.24-2.76 10 0l2-2C15.14 9.14 8.87 9.14 5 13z" />
                    </svg>
                </div>
                <div class="menu-icon battery-icon">
                    <svg width="22" height="12" viewBox="0 0 22 12" fill="none">
                        <rect x="0.5" y="0.5" width="19" height="11" rx="2.5" stroke="white" stroke-opacity="0.8" />
                        <rect x="2" y="2" width="15" height="8" rx="1" fill="white" />
                        <path d="M21 4v4c0.5 0 1-0.5 1-1V5c0-0.5-0.5-1-1-1z" fill="white" fill-opacity="0.8" />
                    </svg>
                </div>
                <div class="menu-time">{{ currentTime }}</div>
                <div class="menu-item logout-btn" @click="handleLogout">Logout</div>
            </div>
        </div>

        <!-- Global Drag Overlay: Prevents lag and iframe interference during drag -->
        <div v-show="isDraggingAnything" class="global-drag-overlay"></div>

        <!-- Desktop Icons -->
        <div class="desktop-icons">
            <div class="desktop-icon" v-for="icon in desktopIcons" :key="icon.id"
                @mousedown="startDragIcon($event, icon)" @click="handleIconClick(icon.id)"
                :class="{ selected: selectedIcon === icon.id }" :style="{ left: icon.x + 'px', top: icon.y + 'px' }">
                <div class="icon-image">
                    <!-- Photos -->
                    <div v-if="icon.id === 'photos'" class="app-icon-content" v-html="appIcons.photos"></div>
                    <!-- Music -->
                    <div v-else-if="icon.id === 'music'" class="app-icon-content">
                        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <rect width="24" height="24" rx="5" fill="url(#musicGrad)" />
                            <path
                                d="M17 7V15C17 16.66 15.66 18 14 18C12.34 18 11 16.66 11 15C11 13.34 12.34 12 14 12C14.35 12 14.69 12.07 15 12.18V9L11 10V16C11 17.66 9.66 19 8 19C6.34 19 5 17.66 5 16C5 14.34 6.34 13 8 13C8.35 13 8.69 13.07 9 13.18V7L17 5V7Z"
                                fill="white" />
                            <defs>
                                <linearGradient id="musicGrad" x1="0" y1="0" x2="24" y2="24">
                                    <stop stop-color="#FA2D48" />
                                    <stop offset="1" stop-color="#A12B6B" />
                                </linearGradient>
                            </defs>
                        </svg>
                    </div>
                    <!-- Notes -->
                    <div v-else-if="icon.id === 'notes'" class="app-icon-content" v-html="appIcons.notes"></div>
                    <!-- Calendar -->
                    <div v-else-if="icon.id === 'calendar'" class="app-icon-content">
                        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <rect width="24" height="24" rx="5" fill="white" />
                            <rect y="0" width="24" height="7" rx="3" fill="#FF3B30" />
                            <text x="12" y="18" text-anchor="middle" fill="#1C1C1E" font-size="11" font-weight="bold"
                                font-family="-apple-system">{{ new Date().getDate() }}</text>
                        </svg>
                    </div>
                    <!-- LinkedIn -->
                    <div v-else-if="icon.id === 'linkedin'" class="app-icon-content">
                        <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <rect width="24" height="24" rx="5" fill="#0A66C2" />
                            <path
                                d="M8.5 10V17H6V10H8.5ZM7.25 8.75C6.56 8.75 6 8.19 6 7.5C6 6.81 6.56 6.25 7.25 6.25C7.94 6.25 8.5 6.81 8.5 7.5C8.5 8.19 7.94 8.75 7.25 8.75ZM18 17H15.5V13.5C15.5 12.5 15 12 14 12C13 12 12.5 12.67 12.5 13.5V17H10V10H12.5V11C12.5 11 13.17 10 14.75 10C16.33 10 18 11 18 13.5V17Z"
                                fill="white" />
                        </svg>
                    </div>
                    <!-- Facebook -->
                    <div v-else-if="icon.id === 'facebook'" class="app-icon-content">
                        <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <rect width="24" height="24" rx="5" fill="#1877F2" />
                            <path
                                d="M16.5 12.5H14V18H11V12.5H9V10H11V8.5C11 6.5 12.17 5.5 14 5.5C14.83 5.5 15.5 5.58 15.5 5.58V7.5H14.67C13.67 7.5 13.5 8 13.5 8.67V10H15.5L15 12.5H13.5"
                                fill="white" />
                        </svg>
                    </div>
                    <!-- Instagram -->
                    <div v-else-if="icon.id === 'instagram'" class="app-icon-content">
                        <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <rect width="24" height="24" rx="5" fill="url(#instaGrad)" />
                            <rect x="6" y="6" width="12" height="12" rx="3" stroke="white" stroke-width="1.5"
                                fill="none" />
                            <circle cx="12" cy="12" r="3" stroke="white" stroke-width="1.5" fill="none" />
                            <circle cx="15.5" cy="8.5" r="1" fill="white" />
                            <defs>
                                <radialGradient id="instaGrad" cx="30%" cy="107%" r="150%">
                                    <stop offset="0%" stop-color="#FFDC80" />
                                    <stop offset="10%" stop-color="#FCAF45" />
                                    <stop offset="35%" stop-color="#F77737" />
                                    <stop offset="55%" stop-color="#F56040" />
                                    <stop offset="70%" stop-color="#FD1D1D" />
                                    <stop offset="80%" stop-color="#E1306C" />
                                    <stop offset="100%" stop-color="#C13584" />
                                </radialGradient>
                            </defs>
                        </svg>
                    </div>
                    <!-- GitHub -->
                    <div v-else-if="icon.id === 'github'" class="app-icon-content">
                        <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <rect width="24" height="24" rx="5" fill="#24292F" />
                            <path
                                d="M12 5C8.13 5 5 8.13 5 12C5 15.1 7.01 17.71 9.78 18.5C10.12 18.56 10.25 18.35 10.25 18.17V16.65C8.13 17.07 7.73 15.6 7.73 15.6C7.42 14.9 6.97 14.69 6.97 14.69C6.34 14.27 7.02 14.28 7.02 14.28C7.72 14.33 8.09 15 8.09 15C8.71 16.05 9.73 15.75 10.28 15.57C10.34 15.12 10.52 14.82 10.72 14.65C9.03 14.48 7.25 13.81 7.25 11.21C7.25 10.54 7.5 10 7.9 9.57C7.83 9.4 7.58 8.78 7.96 7.94C7.96 7.94 8.55 7.76 10.24 8.55C10.79 8.4 11.4 8.33 12 8.33C12.6 8.33 13.21 8.4 13.76 8.55C15.45 7.76 16.04 7.94 16.04 7.94C16.42 8.78 16.17 9.4 16.1 9.57C16.5 10 16.75 10.54 16.75 11.21C16.75 13.82 14.97 14.47 13.27 14.64C13.52 14.85 13.75 15.26 13.75 15.9V18.17C13.75 18.35 13.88 18.57 14.23 18.5C16.99 17.7 19 15.1 19 12C19 8.13 15.87 5 12 5Z"
                                fill="white" />
                        </svg>
                    </div>
                    <!-- Terminal -->
                    <div v-else-if="icon.id === 'terminal'" class="app-icon-content" v-html="appIcons.terminal"></div>
                    <!-- Calendar -->
                    <div v-else-if="icon.id === 'calendar'" class="app-icon-content" v-html="appIcons.calendar"></div>
                    <div v-else-if="icon.id === 'youtube'" class="app-icon-content" v-html="appIcons.youtube"></div>
                    <!-- Resume PDF -->
                    <div v-else-if="icon.id === 'resume'" class="app-icon-content" v-html="appIcons.pdf"></div>
                    <!-- ChatBot -->
                    <div v-else-if="icon.id === 'chatbot'" class="app-icon-content" v-html="appIcons.chatbot"></div>
                </div>
                <div class="icon-label">{{ icon.label }}</div>
            </div>
        </div>

        <!-- Dock -->
        <div class="dock-container" :class="{ 'dock-hidden': anyWindowMaximized }">
            <div class="dock mac-dock">
                <div class="dock-icon finder-dock" @click="selectDockIcon('finder')">
                    <div class="desktop-dock-icon-inner" v-html="appIcons.finder"></div>
                </div>
                <div class="dock-icon" @click="selectDockIcon('safari')">
                    <div class="desktop-dock-icon-inner" v-html="appIcons.safari"></div>
                </div>
                <div class="dock-icon" @click="selectDockIcon('mail')">
                    <div class="desktop-dock-icon-inner" v-html="appIcons.mail"></div>
                </div>
                <div class="dock-icon" @click="selectDockIcon('messages')">
                    <div class="desktop-dock-icon-inner" v-html="appIcons.messages"></div>
                </div>
                <div class="dock-divider"></div>
                <!-- ChatBot Dock (shows when running) -->
                <div v-if="chatbotOpen || chatbotMinimized" class="dock-icon chatbot-dock"
                    @click="selectDockIcon('chatbot')" :class="{ 'has-window': chatbotOpen || chatbotMinimized }">
                    <div class="desktop-dock-icon-inner" v-html="appIcons.chatbot"></div>
                    <div class="dock-indicator"
                        :class="{ 'minimized-indicator': chatbotMinimized, 'running-indicator': chatbotOpen && !chatbotMinimized }">
                    </div>
                </div>
                <!-- Terminal Dock (shows when running) -->
                <div v-if="terminalOpen || terminalMinimized" class="dock-icon terminal-dock"
                    @click="selectDockIcon('terminal')" :class="{ 'has-window': terminalOpen || terminalMinimized }">
                    <div class="desktop-dock-icon-inner" v-html="appIcons.terminal"></div>
                    <div class="dock-indicator"
                        :class="{ 'minimized-indicator': terminalMinimized, 'running-indicator': terminalOpen && !terminalMinimized }">
                    </div>
                </div>
                <!-- Photos Dock (shows when running) -->
                <div v-if="galleryOpen || galleryMinimized" class="dock-icon photos-dock"
                    @click="selectDockIcon('photos')" :class="{ 'has-window': galleryOpen || galleryMinimized }">
                    <div class="desktop-dock-icon-inner" v-html="appIcons.photos"></div>
                    <div class="dock-indicator"
                        :class="{ 'minimized-indicator': galleryMinimized, 'running-indicator': galleryOpen && !galleryMinimized }">
                    </div>
                </div>
                <!-- Notes Dock (shows when running) -->
                <div v-if="notesOpen || notesMinimized" class="dock-icon notes-dock" @click="selectDockIcon('notes')"
                    :class="{ 'has-window': notesOpen || notesMinimized }">
                    <div class="desktop-dock-icon-inner" v-html="appIcons.notes"></div>
                    <div class="dock-indicator"
                        :class="{ 'minimized-indicator': notesMinimized, 'running-indicator': notesOpen && !notesMinimized }">
                    </div>
                </div>

                <!-- Settings Dock (shows when running) -->
                <div v-if="settingsOpen || settingsMinimized" class="dock-icon settings-dock"
                    @click="selectDockIcon('settings')" :class="{ 'has-window': settingsOpen || settingsMinimized }">
                    <div class="desktop-dock-icon-inner" v-html="appIcons.settings"></div>
                    <div class="dock-indicator"
                        :class="{ 'minimized-indicator': settingsMinimized, 'running-indicator': settingsOpen && !settingsMinimized }">
                    </div>
                </div>
                <div v-else class="dock-icon" @click="selectDockIcon('settings')">
                    <div class="desktop-dock-icon-inner" v-html="appIcons.settings"></div>
                </div>

                <!-- Resume PDF Dock (shows when running) -->
                <div v-if="pdfOpen || pdfMinimized" class="dock-icon resume-dock" @click="selectDockIcon('resume')"
                    :class="{ 'has-window': pdfOpen || pdfMinimized }">
                    <div class="desktop-dock-icon-inner" v-html="appIcons.pdf"></div>
                    <div class="dock-indicator"
                        :class="{ 'minimized-indicator': pdfMinimized, 'running-indicator': pdfOpen && !pdfMinimized }">
                    </div>
                </div>
                <!-- Music Dock (shows when running) -->
                <div v-if="musicOpen || musicMinimized" class="dock-icon music-dock" @click="selectDockIcon('music')"
                    :class="{ 'has-window': musicOpen || musicMinimized }">
                    <div class="desktop-dock-icon-inner">
                        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <rect width="24" height="24" rx="5" fill="url(#musicGrad)" />
                            <path
                                d="M17 7V15C17 16.66 15.66 18 14 18C12.34 18 11 16.66 11 15C11 13.34 12.34 12 14 12C14.35 12 14.69 12.07 15 12.18V9L11 10V16C11 17.66 9.66 19 8 19C6.34 19 5 17.66 5 16C5 14.34 6.34 13 8 13C8.35 13 8.69 13.07 9 13.18V7L17 5V7Z"
                                fill="white" />
                            <defs>
                                <linearGradient id="musicGrad" x1="0" y1="0" x2="24" y2="24">
                                    <stop stop-color="#FA2D48" />
                                    <stop offset="1" stop-color="#A12B6B" />
                                </linearGradient>
                            </defs>
                        </svg>
                    </div>
                    <div class="dock-indicator"
                        :class="{ 'minimized-indicator': musicMinimized, 'running-indicator': musicOpen && !musicMinimized }">
                    </div>
                </div>
                <!-- Calendar Dock (shows when running) -->
                <div v-if="calendarOpen || calendarMinimized" class="dock-icon calendar-dock"
                    @click="selectDockIcon('calendar')" :class="{ 'has-window': calendarOpen || calendarMinimized }">
                    <div class="desktop-dock-icon-inner" v-html="appIcons.calendar"></div>
                    <div class="dock-indicator"
                        :class="{ 'minimized-indicator': calendarMinimized, 'running-indicator': calendarOpen && !calendarMinimized }">
                    </div>
                </div>
                <!-- YouTube Dock (shows when running) -->
                <div v-if="youtubeOpen || youtubeMinimized" class="dock-icon youtube-dock"
                    @click="selectDockIcon('youtube')" :class="{ 'has-window': youtubeOpen || youtubeMinimized }">
                    <div class="desktop-dock-icon-inner" v-html="appIcons.youtube"></div>
                    <div class="dock-indicator"
                        :class="{ 'minimized-indicator': youtubeMinimized, 'running-indicator': youtubeOpen && !youtubeMinimized }">
                    </div>
                </div>
                <!-- ChatBot Window (shown when opened, always in desktop area) -->
            </div> <!-- close .dock.mac-dock -->
        </div> <!-- close .dock-container -->

        <!-- ChatBot Window (shown when opened, always in desktop area) -->
        <div v-if="chatbotOpen && !chatbotMinimized" class="chatbot-container chatbot-desktop-window"
            :style="chatbotStyle">
            <div class="terminal-resize-header" @mousedown="startDragChatbot">
                <div class="window-controls">
                    <span class="window-dot close" @click.stop="closeChatbot"></span>
                    <span class="window-dot minimize" @click.stop="minimizeChatbot"></span>
                    <span class="window-dot maximize" @click.stop="toggleChatbotMaximize"></span>
                </div>
                <div class="window-title">Gemini ChatBot</div>
            </div>
            <div style="flex:1;overflow:hidden;background:rgba(255,255,255,0.12);border-radius:0 0 10px 10px;">
                <ChatBot />
            </div>
            <!-- Resize Handles -->
            <div class="resize-handle resize-right" @mousedown="startChatbotResize($event, 'right')"></div>
            <div class="resize-handle resize-bottom" @mousedown="startChatbotResize($event, 'bottom')"></div>
            <div class="resize-handle resize-corner" @mousedown="startChatbotResize($event, 'corner')"></div>
        </div>
    </div>

    <!-- Terminal Window (shown when opened) -->
    <div v-if="terminalOpen && !terminalMinimized" class="terminal-container" :style="terminalStyle">
        <div class="terminal-resize-header" @mousedown="startDragWindow">
            <div class="window-controls">
                <span class="window-dot close" @click.stop="closeTerminal"></span>
                <span class="window-dot minimize" @click.stop="minimizeTerminal"></span>
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
                    <input ref="terminalInput" v-model="currentCommand" @keydown.enter="executeTerminalCommand"
                        @keydown.tab.prevent="autocompleteCommand" @keydown.up.prevent="navigateHistory('up')"
                        @keydown.down.prevent="navigateHistory('down')" @keydown.ctrl.l.prevent="clearTerminal"
                        class="command-input" spellcheck="false" autocomplete="off"
                        placeholder="type 'help' to get started..." />
                </div>
            </div>
        </div>
        <!-- Resize Handles -->
        <div class="resize-handle resize-right" @mousedown="startResize($event, 'right')"></div>
        <div class="resize-handle resize-bottom" @mousedown="startResize($event, 'bottom')"></div>
        <div class="resize-handle resize-corner" @mousedown="startResize($event, 'corner')"></div>
    </div>

    <!-- Gallery Window -->
    <div v-if="galleryOpen && !galleryMinimized" class="gallery-container" :style="galleryStyle">
        <div class="gallery-header" @mousedown="startDragGallery">
            <div class="window-controls">
                <span class="window-dot close" @click.stop="closeGallery"></span>
                <span class="window-dot minimize" @click.stop="minimizeGallery"></span>
                <span class="window-dot maximize" @click.stop="toggleGalleryMaximize"></span>
            </div>
            <div class="window-title">Photos</div>
        </div>
        <div class="gallery-body">
            <!-- Grid View -->
            <div v-if="!lightboxOpen" class="photo-grid">
                <div v-for="(photo, index) in photos" :key="photo.id" class="photo-item" @click="openLightbox(index)">
                    <img :src="photo.src" :alt="photo.title" loading="lazy" />
                </div>
            </div>

            <!-- Lightbox View -->
            <div v-else class="lightbox" @click.self="closeLightbox">
                <button class="lightbox-close" @click="closeLightbox">×</button>
                <button class="lightbox-nav lightbox-prev" @click.stop="prevPhoto">‹</button>
                <div class="lightbox-image-container">
                    <img :src="photos[currentPhotoIndex].src" :alt="photos[currentPhotoIndex].title" />
                    <div class="lightbox-counter">{{ currentPhotoIndex + 1 }} / {{ photos.length }}</div>
                </div>
                <button class="lightbox-nav lightbox-next" @click.stop="nextPhoto">›</button>
            </div>
        </div>
        <!-- Gallery Resize Handles -->
        <div class="resize-handle resize-right" @mousedown="startGalleryResize($event, 'right')"></div>
        <div class="resize-handle resize-bottom" @mousedown="startGalleryResize($event, 'bottom')"></div>
        <div class="resize-handle resize-corner" @mousedown="startGalleryResize($event, 'corner')"></div>
    </div>

    <!-- Notes Window -->
    <div v-if="notesOpen && !notesMinimized" class="notes-container" :style="notesStyle">
        <Notes @close="closeNotes" @minimize="minimizeNotes" @toggleMaximize="toggleNotesMaximize"
            @startDrag="startDragNotes" />
        <!-- Notes Resize Handles -->
        <div class="resize-handle resize-right" @mousedown="startNotesResize($event, 'right')"></div>
        <div class="resize-handle resize-bottom" @mousedown="startNotesResize($event, 'bottom')"></div>
        <div class="resize-handle resize-corner" @mousedown="startNotesResize($event, 'corner')"></div>
    </div>

    <!-- Settings Window -->
    <div v-if="settingsOpen && !settingsMinimized" class="settings-container" :style="settingsStyle">
        <SettingsWindow @close="closeSettings" @minimize="minimizeSettings" @toggleMaximize="toggleSettingsMaximize"
            @startDrag="startDragSettings" @wallpaperChanged="handleWallpaperChanged" />
    </div>

    <!-- PDF Viewer Window -->
    <div v-if="pdfOpen && !pdfMinimized" class="pdf-container" :style="pdfStyle">
        <PdfViewer @close="closePdf" @minimize="minimizePdf" @toggleMaximize="togglePdfMaximize"
            @startDrag="startDragPdf" />
    </div>

    <!-- Music Player Window -->
    <MusicPlayer :is-open="musicOpen" :is-minimized="musicMinimized" @close="closeMusic" @minimize="minimizeMusic"
        @maximize="isMusicMaximized = $event" />

    <!-- Calendar Window -->
    <Calendar :is-open="calendarOpen" :is-minimized="calendarMinimized" :mobile-mode="false" @close="closeCalendar"
        @minimize="minimizeCalendar" @maximize="isCalendarMaximized = $event" />

    <!-- YouTube Window -->
    <YouTubePlayer :is-open="youtubeOpen" :is-minimized="youtubeMinimized" :mobile-mode="false" @close="closeYoutube"
        @minimize="minimizeYoutube" @maximize="isYoutubeMaximized = $event" />

    <!-- macOS Notification Banner -->
    <Transition name="notification">
        <div v-if="showNotification" class="macos-notification">
            <div class="notification-icon">👋</div>
            <div class="notification-content">
                <div class="notification-title">Welcome</div>
                <div class="notification-text">Welcome to Pathum's Portfolio</div>
            </div>
            <button class="notification-close" @click="showNotification = false">×</button>
        </div>
    </Transition>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, nextTick } from 'vue';
import { photos } from '../data/photos.js';
import { appIcons } from '../assets/appIcons.js';
import { wallpapers } from '../data/wallpapers.js';
import Notes from './Notes.vue';
import SettingsWindow from './SettingsWindow.vue';
import PdfViewer from './PdfViewer.vue';
import ChatBot from './ChatBot.vue';
import MusicPlayer from './MusicPlayer.vue';
import Calendar from './Calendar.vue';
import YouTubePlayer from './YouTubePlayer.vue';

const emit = defineEmits(['logout']);

const currentTime = ref('');
const selectedIcon = ref(null);
const terminalOpen = ref(false);
const terminalMinimized = ref(false);
const galleryOpen = ref(false);
const galleryMinimized = ref(false);
const notesOpen = ref(false);
const notesMinimized = ref(false);
const settingsOpen = ref(false);
const settingsMinimized = ref(false);
const pdfOpen = ref(false);
const pdfMinimized = ref(false);
const musicOpen = ref(false);
const musicMinimized = ref(false);
const isMusicMaximized = ref(false);
const calendarOpen = ref(false);
const calendarMinimized = ref(false);
const isCalendarMaximized = ref(false);
const youtubeOpen = ref(false);
const youtubeMinimized = ref(false);
const isYoutubeMaximized = ref(false);
const lightboxOpen = ref(false);
const currentPhotoIndex = ref(0);
const showNotification = ref(false);
const currentWallpaper = ref(null);
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

// Computed property for background
const desktopBackground = computed(() => {
    if (currentWallpaper.value) {
        return {
            backgroundImage: `url(${currentWallpaper.value})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat'
        };
    }
    return {
        background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)'
    };
});

// Computed property to check if any window is maximized
const anyWindowMaximized = computed(() => {
    return isMaximized.value || isGalleryMaximized.value || isNotesMaximized.value || isSettingsMaximized.value || isPdfMaximized.value || isChatbotMaximized.value || isMusicMaximized.value || isCalendarMaximized.value || isYoutubeMaximized.value;
});

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

// Desktop icons with positions arranged from left side (excluding dock items)
const desktopIcons = ref([
    // Column 1 - Apps
    { id: 'terminal', label: 'Terminal', x: 20, y: 40 },
    { id: 'photos', label: 'Photos', x: 20, y: 130 },
    { id: 'music', label: 'Music', x: 20, y: 220 },
    { id: 'notes', label: 'Notes', x: 20, y: 310 },
    { id: 'calendar', label: 'Calendar', x: 20, y: 400 },
    // Column 2 - Social
    { id: 'linkedin', label: 'LinkedIn', x: 110, y: 40 },
    { id: 'facebook', label: 'Facebook', x: 110, y: 130 },
    { id: 'instagram', label: 'Instagram', x: 110, y: 220 },
    { id: 'youtube', label: 'YouTube', x: 110, y: 310 },
    { id: 'github', label: 'GitHub', x: 110, y: 400 },
    // Column 3 - ChatBot & Resume
    { id: 'chatbot', label: 'ChatBot', x: 200, y: 40 },
    { id: 'resume', label: 'Resume', x: 200, y: 130 },
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
    width: Math.min(1200, window.innerWidth - 200) + 'px',
    height: Math.min(680, window.innerHeight - 200) + 'px'
});

const isMaximized = ref(false);
let previousStyle = null;

// Gallery window state
const galleryStyle = ref({
    left: '150px',
    top: '80px',
    width: Math.min(900, window.innerWidth - 300) + 'px',
    height: Math.min(600, window.innerHeight - 200) + 'px'
});

const isGalleryMaximized = ref(false);
let previousGalleryStyle = null;

// Notes window state
const notesStyle = ref({
    left: '200px',
    top: '100px',
    width: Math.min(800, window.innerWidth - 400) + 'px',
    height: Math.min(550, window.innerHeight - 200) + 'px'
});

const isNotesMaximized = ref(false);
let previousNotesStyle = null;

// Notes dragging
let isDraggingNotes = false;
let notesStartX = 0;
let notesStartY = 0;
let notesOffsetX = 0;
let notesOffsetY = 0;

// Notes resizing
let isNotesResizing = false;
let notesResizeDirection = null;
let notesResizeStartX = 0;
let notesResizeStartY = 0;

// Settings window state
const settingsStyle = ref({
    left: '250px',
    top: '80px',
    width: Math.min(800, window.innerWidth - 500) + 'px',
    height: Math.min(600, window.innerHeight - 200) + 'px'
});

const isSettingsMaximized = ref(false);
let previousSettingsStyle = null;

// PDF window state
const pdfStyle = ref({
    left: '200px',
    top: '100px',
    width: Math.min(900, window.innerWidth - 400) + 'px',
    height: Math.min(700, window.innerHeight - 200) + 'px'
});

const isPdfMaximized = ref(false);
let previousPdfStyle = null;

// PDF dragging
let isDraggingPdf = false;
let pdfStartX = 0;
let pdfStartY = 0;
let pdfOffsetX = 0;
let pdfOffsetY = 0;

// Settings dragging
let isDraggingSettings = false;
let settingsStartX = 0;
let settingsStartY = 0;
let settingsOffsetX = 0;
let settingsOffsetY = 0;
let notesResizeStartWidth = 0;
let notesResizeStartHeight = 0;

// Gallery dragging
let isDraggingGallery = false;
let galleryStartX = 0;
let galleryStartY = 0;
let galleryOffsetX = 0;
let galleryOffsetY = 0;

// Gallery resizing
let isGalleryResizing = false;
let galleryResizeDirection = null;
let galleryResizeStartX = 0;
let galleryResizeStartY = 0;
let galleryResizeStartWidth = 0;
let galleryResizeStartHeight = 0;

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
    } else if (appName === 'photos') {
        galleryOpen.value = true;
    } else if (appName === 'notes') {
        notesOpen.value = true;
    } else if (appName === 'chatbot') {
        if (!chatbotOpen.value) {
            chatbotOpen.value = true;
            chatbotMinimized.value = false;
            isChatbotMaximized.value = false;
            chatbotStyle.value = {
                left: '300px',
                top: '120px',
                width: '420px',
                height: '540px'
            };
            // Do not autofocus any input here to avoid browser autofocus errors
        } else if (chatbotMinimized.value) {
            chatbotMinimized.value = false;
        }
    } else if (appName === 'linkedin') {
        window.open('https://www.linkedin.com/in/pasindu-pathum-98a299249', '_blank');
    } else if (appName === 'facebook') {
        window.open('https://www.facebook.com/pasindu.pathum.584868/about', '_blank');
    } else if (appName === 'instagram') {
        window.open('https://www.instagram.com/g_a_p_pathum/?fbclid=IwY2xjawOnaAJleHRuA2FlbQIxMABicmlkETFWdlJ5dzhYTWdsN0FzMTJZc3J0YwZhcHBfaWQQMjIyMDM5MTc4ODIwMDg5MgABHtmbbieoC8U6m3DtsZ1QQan4CB7-vB5fL0gdzLWrwqD8JUtAjZa_DFlGnslE_aem_U6isFa-dV9-0SKORDrs3Sg#', '_blank');
    } else if (appName === 'github') {
        window.open('https://github.com/GAP-Pathum', '_blank');
    } else if (appName === 'resume') {
        pdfOpen.value = true;
    } else if (appName === 'music') {
        musicOpen.value = true;
    } else if (appName === 'calendar') {
        calendarOpen.value = true;
        calendarMinimized.value = false;
    } else if (appName === 'youtube') {
        youtubeOpen.value = true;
        youtubeMinimized.value = false;
    }
}

function selectDockIcon(iconName) {
    if (iconName === 'chatbot') {
        if (chatbotMinimized.value) {
            restoreChatbot();
        } else if (chatbotOpen.value) {
            // Already open and not minimized: bring to front (no-op for now)
        } else {
            chatbotOpen.value = true;
            chatbotMinimized.value = false;
            isChatbotMaximized.value = false;
            chatbotStyle.value = {
                left: '300px',
                top: '120px',
                width: '420px',
                height: '540px'
            };
            // Do not autofocus any input here to avoid browser autofocus errors
        }
        return;
    }
    if (iconName === 'terminal') {
        if (terminalMinimized.value) {
            restoreTerminal();
        } else if (!terminalOpen.value) {
            terminalOpen.value = true;
            nextTick(() => {
                terminalInput.value?.focus();
            });
        }
    } else if (iconName === 'photos') {
        if (galleryMinimized.value) {
            restoreGallery();
        } else if (!galleryOpen.value) {
            galleryOpen.value = true;
        }
    } else if (iconName === 'notes') {
        if (notesMinimized.value) {
            restoreNotes();
        } else if (!notesOpen.value) {
            notesOpen.value = true;
        }
    } else if (iconName === 'linkedin') {
        window.open('https://www.linkedin.com/in/pasindu-pathum-98a299249', '_blank');
    } else if (iconName === 'facebook') {
        window.open('https://www.facebook.com/gap.pathum', '_blank');
    } else if (iconName === 'instagram') {
        window.open('https://www.instagram.com/gap_pathum', '_blank');
    } else if (iconName === 'settings') {
        if (settingsMinimized.value) {
            restoreSettings();
        } else if (!settingsOpen.value) {
            settingsOpen.value = true;
        }
    } else if (iconName === 'resume') {
        if (pdfMinimized.value) {
            restorePdf();
        } else if (!pdfOpen.value) {
            pdfOpen.value = true;
        }
    } else if (iconName === 'music') {
        if (musicMinimized.value) {
            restoreMusic();
        } else if (!musicOpen.value) {
            musicOpen.value = true;
        }
    } else if (iconName === 'calendar') {
        if (calendarMinimized.value) {
            restoreCalendar();
        } else if (!calendarOpen.value) {
            calendarOpen.value = true;
        }
    } else if (iconName === 'youtube') {
        if (youtubeMinimized.value) {
            restoreYoutube();
        } else if (!youtubeOpen.value) {
            youtubeOpen.value = true;
        }
    }
}

function closeSettings() {
    settingsOpen.value = false;
    settingsMinimized.value = false;
    isSettingsMaximized.value = false;
}

function minimizeSettings() {
    settingsMinimized.value = true;
    if (isSettingsMaximized.value) {
        toggleSettingsMaximize();
    }
}

function restoreSettings() {
    settingsMinimized.value = false;
    nextTick(() => {
        // Focus restored
    });
}

function toggleSettingsMaximize() {
    if (isSettingsMaximized.value) {
        settingsStyle.value = { ...previousSettingsStyle };
        isSettingsMaximized.value = false;
    } else {
        previousSettingsStyle = { ...settingsStyle.value };
        settingsStyle.value = {
            left: '0',
            top: '24px',
            width: '100vw',
            height: 'calc(100vh - 94px)'
        };
        isSettingsMaximized.value = true;
    }
}

function startDragSettings(event) {
    if (isSettingsMaximized.value) return;

    isDraggingSettings = true;
    isDraggingAnything.value = true;
    settingsStartX = event.clientX;
    settingsStartY = event.clientY;

    const currentLeft = parseInt(settingsStyle.value.left) || 0;
    const currentTop = parseInt(settingsStyle.value.top) || 0;

    settingsOffsetX = settingsStartX - currentLeft;
    settingsOffsetY = settingsStartY - currentTop;

    document.addEventListener('mousemove', onSettingsDrag);
    document.addEventListener('mouseup', stopDragSettings);
}

function onSettingsDrag(event) {
    if (!isDraggingSettings) return;
    if (rafId) cancelAnimationFrame(rafId);

    rafId = requestAnimationFrame(() => {
        const newX = event.clientX - settingsOffsetX;
        const newY = event.clientY - settingsOffsetY;

        settingsStyle.value.left = `${Math.max(0, newX)}px`;
        settingsStyle.value.top = `${Math.max(24, newY)}px`;
    });
}

function stopDragSettings() {
    isDraggingSettings = false;
    isDraggingAnything.value = false;
    if (rafId) cancelAnimationFrame(rafId);
    document.removeEventListener('mousemove', onSettingsDrag);
    document.removeEventListener('mouseup', stopDragSettings);
}

function handleWallpaperChanged({ id, path }) {
    currentWallpaper.value = path;
}

// PDF viewer functions
function closePdf() {
    pdfOpen.value = false;
    pdfMinimized.value = false;
    isPdfMaximized.value = false;
}

function minimizePdf() {
    pdfMinimized.value = true;
    if (isPdfMaximized.value) {
        togglePdfMaximize();
    }
}

function restorePdf() {
    pdfMinimized.value = false;
    nextTick(() => {
        // Focus restored
    });
}

function togglePdfMaximize() {
    if (isPdfMaximized.value) {
        pdfStyle.value = { ...previousPdfStyle };
        isPdfMaximized.value = false;
    } else {
        previousPdfStyle = { ...pdfStyle.value };
        pdfStyle.value = {
            left: '0',
            top: '0',
            width: '100vw',
            height: '100vh'
        };
        isPdfMaximized.value = true;
    }
}

function startDragPdf(event) {
    if (isPdfMaximized.value) return;

    isDraggingPdf = true;
    isDraggingAnything.value = true;
    pdfStartX = event.clientX;
    pdfStartY = event.clientY;

    const currentLeft = parseInt(pdfStyle.value.left) || 0;
    const currentTop = parseInt(pdfStyle.value.top) || 0;

    pdfOffsetX = pdfStartX - currentLeft;
    pdfOffsetY = pdfStartY - currentTop;

    document.addEventListener('mousemove', onPdfDrag);
    document.addEventListener('mouseup', stopDragPdf);
}

function onPdfDrag(event) {
    if (!isDraggingPdf) return;
    if (rafId) cancelAnimationFrame(rafId);

    rafId = requestAnimationFrame(() => {
        const newX = event.clientX - pdfOffsetX;
        const newY = event.clientY - pdfOffsetY;

        pdfStyle.value.left = `${Math.max(0, newX)}px`;
        pdfStyle.value.top = `${Math.max(24, newY)}px`;
    });
}

function stopDragPdf() {
    isDraggingPdf = false;
    isDraggingAnything.value = false;
    if (rafId) cancelAnimationFrame(rafId);
    document.removeEventListener('mousemove', onPdfDrag);
    document.removeEventListener('mouseup', stopDragPdf);
}

// Music functions
function closeMusic() {
    musicOpen.value = false;
    musicMinimized.value = false;
    isMusicMaximized.value = false;
}

function minimizeMusic() {
    musicMinimized.value = true;
}

function restoreMusic() {
    musicMinimized.value = false;
}

function toggleMusicMaximize() {
    // Handled by component
}

function closeCalendar() {
    calendarOpen.value = false;
    calendarMinimized.value = false;
    isCalendarMaximized.value = false;
}

function minimizeCalendar() {
    calendarMinimized.value = true;
}

function restoreCalendar() {
    calendarMinimized.value = false;
}

function toggleCalendarMaximize() {
    // Handled by component
}

function closeYoutube() {
    youtubeOpen.value = false;
    youtubeMinimized.value = false;
    isYoutubeMaximized.value = false;
}

function minimizeYoutube() {
    youtubeMinimized.value = true;
}

function restoreYoutube() {
    youtubeMinimized.value = false;
}

function toggleYoutubeMaximize() {
    // Handled by component
}

function startDragMusic(event) {
    // Handled by component
}

function startMusicResize(event, direction) {
    // Handled by component
}

function closeTerminal() {
    terminalOpen.value = false;
    terminalMinimized.value = false;
    isMaximized.value = false;
    terminalOutput.value = [];
    currentCommand.value = '';
    cwd.value = '~';
}

function minimizeTerminal() {
    terminalMinimized.value = true;
    if (isMaximized.value) {
        toggleMaximize(); // Restore from maximize before minimizing
    }
}

function restoreTerminal() {
    terminalMinimized.value = false;
    nextTick(() => {
        terminalInput.value?.focus();
    });
}

// Gallery functions
function closeGallery() {
    galleryOpen.value = false;
    galleryMinimized.value = false;
    isGalleryMaximized.value = false;
    lightboxOpen.value = false;
    currentPhotoIndex.value = 0;
}

function minimizeGallery() {
    galleryMinimized.value = true;
    if (isGalleryMaximized.value) {
        toggleGalleryMaximize(); // Restore from maximize before minimizing
    }
}

function restoreGallery() {
    galleryMinimized.value = false;
}

// Notes functions
function closeNotes() {
    notesOpen.value = false;
    notesMinimized.value = false;
    isNotesMaximized.value = false;
}

function minimizeNotes() {
    notesMinimized.value = true;
    if (isNotesMaximized.value) {
        toggleNotesMaximize();
    }
}

function restoreNotes() {
    notesMinimized.value = false;
}

function toggleNotesMaximize() {
    if (isNotesMaximized.value) {
        notesStyle.value = { ...previousNotesStyle };
        isNotesMaximized.value = false;
    } else {
        previousNotesStyle = { ...notesStyle.value };
        notesStyle.value = {
            left: '0px',
            top: '24px',
            width: '100vw',
            height: 'calc(100vh - 24px)'
        };
        isNotesMaximized.value = true;
    }
}

function dragNotes(event) {
    if (!isDraggingNotes) return;
    if (rafId) cancelAnimationFrame(rafId);

    rafId = requestAnimationFrame(() => {
        const newX = event.clientX - notesOffsetX;
        const newY = event.clientY - notesOffsetY;

        notesStyle.value.left = `${Math.max(0, newX)}px`;
        notesStyle.value.top = `${Math.max(24, newY)}px`;
    });
}

function stopDragNotes() {
    isDraggingNotes = false;
    isDraggingAnything.value = false;
    if (rafId) cancelAnimationFrame(rafId);
    document.removeEventListener('mousemove', dragNotes);
    document.removeEventListener('mouseup', stopDragNotes);
}

function startDragNotes(event) {
    if (isNotesMaximized.value) return;
    event.preventDefault();

    const container = document.querySelector('.notes-container');
    const rect = container.getBoundingClientRect();

    isDraggingNotes = true;
    isDraggingAnything.value = true;
    notesStartX = event.clientX;
    notesStartY = event.clientY;
    notesOffsetX = event.clientX - rect.left;
    notesOffsetY = event.clientY - rect.top;

    document.addEventListener('mousemove', dragNotes);
    document.addEventListener('mouseup', stopDragNotes);
}

function startNotesResize(event, direction) {
    if (isNotesMaximized.value) return;
    event.preventDefault();

    isNotesResizing = true;
    notesResizeDirection = direction;
    notesResizeStartX = event.clientX;
    notesResizeStartY = event.clientY;
    notesResizeStartWidth = parseInt(notesStyle.value.width);
    notesResizeStartHeight = parseInt(notesStyle.value.height);

    document.addEventListener('mousemove', resizeNotes);
    document.addEventListener('mouseup', stopNotesResize);
}

function resizeNotes(event) {
    if (!isNotesResizing) return;

    const deltaX = event.clientX - notesResizeStartX;
    const deltaY = event.clientY - notesResizeStartY;

    if (notesResizeDirection === 'right' || notesResizeDirection === 'corner') {
        const newWidth = Math.max(400, notesResizeStartWidth + deltaX);
        notesStyle.value.width = `${newWidth}px`;
    }

    if (notesResizeDirection === 'bottom' || notesResizeDirection === 'corner') {
        const newHeight = Math.max(300, notesResizeStartHeight + deltaY);
        notesStyle.value.height = `${newHeight}px`;
    }
}

function stopNotesResize() {
    isNotesResizing = false;
    notesResizeDirection = null;
    document.removeEventListener('mousemove', resizeNotes);
    document.removeEventListener('mouseup', stopNotesResize);
}

function openLightbox(index) {
    currentPhotoIndex.value = index;
    lightboxOpen.value = true;
}

function closeLightbox() {
    lightboxOpen.value = false;
}

function nextPhoto() {
    currentPhotoIndex.value = (currentPhotoIndex.value + 1) % photos.length;
}

function prevPhoto() {
    currentPhotoIndex.value = (currentPhotoIndex.value - 1 + photos.length) % photos.length;
}

function toggleGalleryMaximize() {
    if (isGalleryMaximized.value) {
        galleryStyle.value = { ...previousGalleryStyle };
        isGalleryMaximized.value = false;
    } else {
        previousGalleryStyle = { ...galleryStyle.value };
        galleryStyle.value = {
            left: '0px',
            top: '24px',
            width: '100vw',
            height: 'calc(100vh - 24px)'
        };
        isGalleryMaximized.value = true;
    }
}

function startDragGallery(event) {
    if (isGalleryMaximized.value) return;
    event.preventDefault();
    isDraggingGallery = true;
    galleryStartX = event.clientX;
    galleryStartY = event.clientY;
    galleryOffsetX = parseInt(galleryStyle.value.left) || 0;
    galleryOffsetY = parseInt(galleryStyle.value.top) || 0;
    document.addEventListener('mousemove', dragGallery);
    document.addEventListener('mouseup', stopDragGallery);
}

function dragGallery(event) {
    if (!isDraggingGallery) return;
    const deltaX = event.clientX - galleryStartX;
    const deltaY = event.clientY - galleryStartY;
    galleryStyle.value.left = (galleryOffsetX + deltaX) + 'px';
    galleryStyle.value.top = Math.max(24, galleryOffsetY + deltaY) + 'px';
}

function stopDragGallery() {
    isDraggingGallery = false;
    document.removeEventListener('mousemove', dragGallery);
    document.removeEventListener('mouseup', stopDragGallery);
}

function startGalleryResize(event, direction) {
    if (isGalleryMaximized.value) return;
    event.preventDefault();
    isGalleryResizing = true;
    galleryResizeDirection = direction;
    galleryResizeStartX = event.clientX;
    galleryResizeStartY = event.clientY;
    galleryResizeStartWidth = parseInt(galleryStyle.value.width) || 900;
    galleryResizeStartHeight = parseInt(galleryStyle.value.height) || 600;
    document.addEventListener('mousemove', resizeGallery);
    document.addEventListener('mouseup', stopGalleryResize);
}

function resizeGallery(event) {
    if (!isGalleryResizing) return;
    const deltaX = event.clientX - galleryResizeStartX;
    const deltaY = event.clientY - galleryResizeStartY;

    if (galleryResizeDirection === 'right' || galleryResizeDirection === 'corner') {
        galleryStyle.value.width = Math.max(400, galleryResizeStartWidth + deltaX) + 'px';
    }
    if (galleryResizeDirection === 'bottom' || galleryResizeDirection === 'corner') {
        galleryStyle.value.height = Math.max(300, galleryResizeStartHeight + deltaY) + 'px';
    }
}

function stopGalleryResize() {
    isGalleryResizing = false;
    galleryResizeDirection = null;
    document.removeEventListener('mousemove', resizeGallery);
    document.removeEventListener('mouseup', stopGalleryResize);
}

// Keyboard navigation for lightbox
function handleKeydown(event) {
    if (lightboxOpen.value) {
        if (event.key === 'ArrowRight') {
            nextPhoto();
        } else if (event.key === 'ArrowLeft') {
            prevPhoto();
        } else if (event.key === 'Escape') {
            closeLightbox();
        }
    }
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

// ChatBot window state
const chatbotOpen = ref(false);
const chatbotMinimized = ref(false);
const chatbotStyle = ref({
    left: '300px',
    top: '120px',
    width: '420px',
    height: Math.min(380, window.innerHeight - 300) + 'px' // reduced default height
});
// ChatBot resizing
let isChatbotResizing = false;
let chatbotResizeDirection = null;
let chatbotResizeStartX = 0;
let chatbotResizeStartY = 0;
let chatbotResizeStartWidth = 0;
let chatbotResizeStartHeight = 0;

function startChatbotResize(event, direction) {
    isChatbotResizing = true;
    chatbotResizeDirection = direction;
    chatbotResizeStartX = event.clientX;
    chatbotResizeStartY = event.clientY;
    chatbotResizeStartWidth = parseInt(chatbotStyle.value.width);
    chatbotResizeStartHeight = parseInt(chatbotStyle.value.height);
    document.addEventListener('mousemove', resizeChatbot);
    document.addEventListener('mouseup', stopChatbotResize);
}

function resizeChatbot(event) {
    if (!isChatbotResizing) return;
    if (chatbotResizeDirection === 'right' || chatbotResizeDirection === 'corner') {
        const newWidth = Math.max(320, chatbotResizeStartWidth + (event.clientX - chatbotResizeStartX));
        chatbotStyle.value.width = newWidth + 'px';
    }
    if (chatbotResizeDirection === 'bottom' || chatbotResizeDirection === 'corner') {
        const newHeight = Math.max(220, chatbotResizeStartHeight + (event.clientY - chatbotResizeStartY));
        chatbotStyle.value.height = newHeight + 'px';
    }
}

function stopChatbotResize() {
    isChatbotResizing = false;
    chatbotResizeDirection = null;
    document.removeEventListener('mousemove', resizeChatbot);
    document.removeEventListener('mouseup', stopChatbotResize);
}
const isChatbotMaximized = ref(false);
let previousChatbotStyle = null;

function closeChatbot() {
    chatbotOpen.value = false;
    chatbotMinimized.value = false;
    isChatbotMaximized.value = false;
}
function minimizeChatbot() {
    chatbotMinimized.value = true;
    if (isChatbotMaximized.value) toggleChatbotMaximize();
}
function restoreChatbot() {
    chatbotMinimized.value = false;
}
function toggleChatbotMaximize() {
    if (isChatbotMaximized.value) {
        chatbotStyle.value = { ...previousChatbotStyle };
        isChatbotMaximized.value = false;
    } else {
        previousChatbotStyle = { ...chatbotStyle.value };
        chatbotStyle.value = {
            left: '0px',
            top: '24px',
            width: '100vw',
            height: 'calc(100vh - 24px)'
        };
        isChatbotMaximized.value = true;
    }
}
function startDragChatbot(event) {
    if (isChatbotMaximized.value) return;
    event.preventDefault();
    let startX = event.clientX;
    let startY = event.clientY;
    let origLeft = parseInt(chatbotStyle.value.left) || 0;
    let origTop = parseInt(chatbotStyle.value.top) || 0;
    function onMove(e) {
        chatbotStyle.value.left = Math.max(0, origLeft + (e.clientX - startX)) + 'px';
        chatbotStyle.value.top = Math.max(24, origTop + (e.clientY - startY)) + 'px';
    }
    function onUp() {
        document.removeEventListener('mousemove', onMove);
        document.removeEventListener('mouseup', onUp);
    }
    document.addEventListener('mousemove', onMove);
    document.addEventListener('mouseup', onUp);
}

onMounted(() => {
    updateTime();
    timeInterval = setInterval(updateTime, 1000);
    document.addEventListener('keydown', handleKeydown);

    // Load saved wallpaper
    const savedWallpaper = localStorage.getItem('wallpaper');
    if (savedWallpaper && savedWallpaper !== '0') {
        const wallpaper = wallpapers.find(w => w.id === parseInt(savedWallpaper));
        if (wallpaper) {
            currentWallpaper.value = wallpaper.path;
        }
    }

    // Show welcome notification after login
    setTimeout(() => {
        showNotification.value = true;
        setTimeout(() => {
            showNotification.value = false;
        }, 5000);
    }, 800);
});

onUnmounted(() => {
    if (timeInterval) clearInterval(timeInterval);
    document.removeEventListener('keydown', handleKeydown);
});
</script>

<style scoped>
.desktop {
    width: 100vw;
    height: 100vh;
    position: relative;
    overflow: hidden;
    transition: background 0.3s ease;
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
    background: rgba(255, 255, 255, 0.08);
}

.desktop-icon.selected {
    background: rgba(66, 133, 244, 0.3);
    border-radius: 8px;
}

.icon-image {
    width: 64px;
    height: 64px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 4px;
    border-radius: 14px;
    overflow: visible;
}

/* Unified app icon content */
.app-icon-content {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
}

.app-icon-content svg {
    width: 100%;
    height: 100%;
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
    bottom: 4px;
    left: 50%;
    transform: translateX(-50%);
    z-index: 1000;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.dock {
    background: rgba(30, 30, 30, 0.4);
    backdrop-filter: blur(40px) saturate(180%);
    -webkit-backdrop-filter: blur(40px) saturate(180%);
    border: 0.5px solid rgba(255, 255, 255, 0.18);
    border-radius: 18px;
    padding: 4px 6px;
    display: flex;
    align-items: center;
    gap: 4px;
    box-shadow:
        0 0 0 0.5px rgba(0, 0, 0, 0.3),
        0 10px 40px rgba(0, 0, 0, 0.4),
        inset 0 0.5px 0 rgba(255, 255, 255, 0.1);
}

.dock-icon {
    width: 52px;
    height: 52px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    border-radius: 12px;
    transition: transform 0.15s cubic-bezier(0.4, 0, 0.2, 1);
    position: relative;
}

/* Ensure inner v-html wrapper fills the dock icon so injected SVGs scale properly */
.dock-icon>div {
    width: 48px;
    height: 48px;
    display: flex;
    align-items: center;
    justify-content: center;
}

.dock-icon svg {
    width: 100%;
    height: 100%;
    border-radius: 11px;
    filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.2));
    transition: filter 0.15s ease;
}

/* Desktop-specific dock overrides: ensure desktop dock shows desktop-style icons */
.mac-dock .dock-icon>div {
    width: 48px;
    height: 48px;
    display: flex;
    align-items: center;
    justify-content: center;
}

.mac-dock .dock-icon svg {
    border-radius: 11px;
}

/* Stronger rules for desktop dock inner icon wrapper */
.mac-dock .desktop-dock-icon-inner {
    width: 48px;
    height: 48px;
    display: flex;
    align-items: center;
    justify-content: center;
}

.mac-dock .desktop-dock-icon-inner svg {
    width: 100%;
    height: 100%;
    border-radius: 11px !important;
}

.dock-icon:hover {
    transform: translateY(-10px) scale(1.15);
}

.dock-icon:hover svg {
    filter: drop-shadow(0 8px 16px rgba(0, 0, 0, 0.35));
}

.dock-divider {
    width: 1px;
    height: 40px;
    background: rgba(255, 255, 255, 0.15);
    margin: 0 2px;
    border-radius: 1px;
}

/* Dock Hidden State - when window is maximized */
.dock-hidden {
    transform: translateX(-50%) translateY(100px);
    opacity: 0;
    pointer-events: none;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

/* Dock Window Indicators - dot under running apps */
.dock-indicator {
    position: absolute;
    bottom: -8px;
    left: 50%;
    transform: translateX(-50%);
    width: 5px;
    height: 5px;
    border-radius: 50%;
    background: transparent;
    transition: all 0.2s ease;
}

.running-indicator {
    background: rgba(255, 255, 255, 0.176);
    box-shadow: 0 0 4px rgba(255, 255, 255, 0.301);
}

.minimized-indicator {
    background: rgba(255, 255, 255, 0.5);
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

/* Gallery Window */
.gallery-container {
    position: absolute;
    background: rgba(30, 30, 30, 0.95);
    backdrop-filter: blur(20px);
    border-radius: 10px;
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
    display: flex;
    flex-direction: column;
    z-index: 200;
    overflow: hidden;
}

/* Notes Container */
.notes-container {
    position: absolute;
    background: rgba(30, 30, 30, 0.95);
    backdrop-filter: blur(20px);
    border-radius: 10px;
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
    display: flex;
    flex-direction: column;
    z-index: 300;
    overflow: hidden;
}

/* Settings Container */
.settings-container {
    position: absolute;
    background: rgba(30, 30, 30, 0.95);
    backdrop-filter: blur(20px);
    border-radius: 10px;
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
    display: flex;
    flex-direction: column;
    z-index: 400;
    overflow: hidden;
}

/* PDF Container */
.pdf-container {
    position: absolute;
    background: rgba(30, 30, 30, 0.95);
    backdrop-filter: blur(20px);
    border-radius: 10px;
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
    display: flex;
    flex-direction: column;
    z-index: 450;
    overflow: hidden;
}

/* Ensure chatbot window floats above the dock, not attached */
.chatbot-desktop-window {
    position: absolute;
    background: rgba(30, 30, 30, 0.541);
    backdrop-filter: blur(20px);
    border-radius: 10px;
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
    display: flex;
    flex-direction: column;
    z-index: 200;
    overflow: hidden;
}

/* ChatBot resize handles */
.chatbot-container .resize-handle {
    position: absolute;
    background: transparent;
    z-index: 10;
}

.chatbot-container .resize-right {
    top: 0;
    right: 0;
    width: 10px;
    height: 100%;
    cursor: ew-resize;
}

.chatbot-container .resize-bottom {
    left: 0;
    bottom: 0;
    width: 100%;
    height: 10px;
    cursor: ns-resize;
}

.chatbot-container .resize-corner {
    right: 0;
    bottom: 0;
    width: 18px;
    height: 18px;
    cursor: nwse-resize;
}

.gallery-header {
    height: 40px;
    background: rgba(60, 60, 60, 0.9);
    display: flex;
    align-items: center;
    padding: 0 12px;
    cursor: move;
    flex-shrink: 0;
}

.gallery-body {
    flex: 1;
    overflow: hidden;
    display: flex;
    flex-direction: column;
}

/* Photo Grid */
.photo-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
    gap: 8px;
    padding: 16px;
    overflow-y: auto;
    flex: 1;
}

.photo-item {
    aspect-ratio: 1;
    overflow: hidden;
    border-radius: 8px;
    cursor: pointer;
    transition: transform 0.2s, box-shadow 0.2s;
    background: rgba(0, 0, 0, 0.3);
}

.photo-item:hover {
    transform: scale(1.05);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.4);
}

.photo-item img {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

/* Lightbox */
.lightbox {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.95);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 10;
}

.lightbox-image-container {
    max-width: 90%;
    max-height: 90%;
    display: flex;
    flex-direction: column;
    align-items: center;
}

.lightbox-image-container img {
    max-width: 100%;
    max-height: calc(100vh - 200px);
    object-fit: contain;
    border-radius: 8px;
    box-shadow: 0 10px 40px rgba(0, 0, 0, 0.5);
}

.lightbox-counter {
    color: rgba(255, 255, 255, 0.7);
    font-size: 14px;
    margin-top: 16px;
}

.lightbox-close {
    position: absolute;
    top: 16px;
    right: 16px;
    width: 40px;
    height: 40px;
    border: none;
    background: rgba(255, 255, 255, 0.1);
    color: white;
    font-size: 28px;
    border-radius: 50%;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: background 0.2s;
    z-index: 20;
}

.lightbox-close:hover {
    background: rgba(255, 255, 255, 0.2);
}

.lightbox-nav {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    width: 50px;
    height: 50px;
    border: none;
    background: rgba(255, 255, 255, 0.1);
    color: white;
    font-size: 32px;
    border-radius: 50%;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: background 0.2s;
    z-index: 20;
}

.lightbox-nav:hover {
    background: rgba(255, 255, 255, 0.25);
}

.lightbox-prev {
    left: 16px;
}

.lightbox-next {
    right: 16px;
}

/* macOS Notification Banner */
.macos-notification {
    position: fixed;
    top: 40px;
    right: 20px;
    width: 340px;
    background: rgba(40, 40, 45, 0.95);
    backdrop-filter: blur(30px);
    border-radius: 14px;
    padding: 14px 16px;
    display: flex;
    align-items: center;
    gap: 12px;
    box-shadow: 0 10px 40px rgba(0, 0, 0, 0.4),
        0 0 0 1px rgba(255, 255, 255, 0.1);
    z-index: 9999;
}

.macos-notification .notification-icon {
    font-size: 32px;
    flex-shrink: 0;
}

.macos-notification .notification-content {
    flex: 1;
    min-width: 0;
}

.macos-notification .notification-title {
    color: white;
    font-size: 14px;
    font-weight: 600;
    margin-bottom: 2px;
}

.macos-notification .notification-text {
    color: rgba(255, 255, 255, 0.7);
    font-size: 13px;
}

.macos-notification .notification-close {
    background: rgba(255, 255, 255, 0.1);
    border: none;
    color: rgba(255, 255, 255, 0.6);
    width: 24px;
    height: 24px;
    border-radius: 50%;
    font-size: 16px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    transition: all 0.2s;
}

.macos-notification .notification-close:hover {
    background: rgba(255, 255, 255, 0.2);
    color: white;
}

/* Notification Transition */
.notification-enter-active {
    animation: notificationSlideIn 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.notification-leave-active {
    animation: notificationSlideOut 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

@keyframes notificationSlideIn {
    from {
        opacity: 0;
        transform: translateX(100px);
    }

    to {
        opacity: 1;
        transform: translateX(0);
    }
}

@keyframes notificationSlideOut {
    from {
        opacity: 1;
        transform: translateX(0);
    }

    to {
        opacity: 0;
        transform: translateX(100px);
    }
}

/* Responsive */
@media (max-width: 767px) {
    .desktop {
        display: none !important;
    }
}

/* Global Drag Overlay */
.global-drag-overlay {
    position: fixed;
    inset: 0;
    z-index: 99999;
    background: transparent;
    cursor: move;
}

/* Enhanced Window Transitions and Performance */
.calendar-container,
.chatbot-container,
.gallery-container,
.notes-container,
.pdf-container,
.settings-container,
.terminal-container,
.music-container,
.youtube-container {
    will-change: left, top, width, height;
}
</style>
