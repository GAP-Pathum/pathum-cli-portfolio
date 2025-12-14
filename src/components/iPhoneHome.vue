<template>
    <div class="iphone-home" :style="homeBackground" @touchstart="handleTouchStart" @touchmove="handleTouchMove"
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
                <div class="icon" v-html="appIcons.terminalMobile"></div>
                <div class="app-name">Terminal</div>
            </div>
            <div class="app-icon" @click="handleAppTap('messages')" :class="{ 'bouncing': bouncingApp === 'messages' }">
                <div class="icon" v-html="appIcons.messages"></div>
                <div class="app-name">Messages</div>
            </div>
            <div class="app-icon" @click="handleAppTap('safari')" :class="{ 'bouncing': bouncingApp === 'safari' }">
                <div class="icon" v-html="appIcons.safari"></div>
                <div class="app-name">Safari</div>
            </div>
            <div class="app-icon" @click="handleAppTap('mail')" :class="{ 'bouncing': bouncingApp === 'mail' }">
                <div class="icon" v-html="appIcons.mail"></div>
                <div class="app-name">Mail</div>
            </div>

            <!-- Row 2 -->
            <div class="app-icon" @click="handleAppTap('photos')" :class="{ 'bouncing': bouncingApp === 'photos' }">
                <div class="icon" v-html="appIcons.photosMobile"></div>
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
                <div class="icon" v-html="appIcons.notesMobile"></div>
                <div class="app-name">Notes</div>
            </div>

            <!-- Row 3 -->
            <div class="app-icon" @click="handleAppTap('calendar')" :class="{ 'bouncing': bouncingApp === 'calendar' }">
                <div class="icon">📅</div>
                <div class="app-name">Calendar</div>
            </div>
            <div class="app-icon" @click="handleAppTap('youtube')" :class="{ 'bouncing': bouncingApp === 'youtube' }">
                <div class="icon">📺</div>
                <div class="app-name">YouTube</div>
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
            <div class="app-icon" @click="handleAppTap('chatbot')" :class="{ 'bouncing': bouncingApp === 'chatbot' }">
                <div class="icon" v-html="appIcons.chatbotMobile"></div>
                <div class="app-name">ChatBot</div>
            </div>
            <div class="app-icon" @click="handleAppTap('linkedin')" :class="{ 'bouncing': bouncingApp === 'linkedin' }">
                <div class="icon linkedin-icon">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white" width="32" height="32">
                        <path
                            d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                    </svg>
                </div>
                <div class="app-name">LinkedIn</div>
            </div>
            <div class="app-icon" @click="handleAppTap('facebook')" :class="{ 'bouncing': bouncingApp === 'facebook' }">
                <div class="icon facebook-icon">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white" width="32" height="32">
                        <path
                            d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                    </svg>
                </div>
                <div class="app-name">Facebook</div>
            </div>
            <div class="app-icon" @click="handleAppTap('instagram')"
                :class="{ 'bouncing': bouncingApp === 'instagram' }">
                <div class="icon instagram-icon">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white" width="32" height="32">
                        <path
                            d="M12 0C8.74 0 8.333.015 7.053.072 5.775.132 4.905.333 4.14.63c-.789.306-1.459.717-2.126 1.384S.935 3.35.63 4.14C.333 4.905.131 5.775.072 7.053.012 8.333 0 8.74 0 12s.015 3.667.072 4.947c.06 1.277.261 2.148.558 2.913.306.788.717 1.459 1.384 2.126.667.666 1.336 1.079 2.126 1.384.766.296 1.636.499 2.913.558C8.333 23.988 8.74 24 12 24s3.667-.015 4.947-.072c1.277-.06 2.148-.262 2.913-.558.788-.306 1.459-.718 2.126-1.384.666-.667 1.079-1.335 1.384-2.126.296-.765.499-1.636.558-2.913.06-1.28.072-1.687.072-4.947s-.015-3.667-.072-4.947c-.06-1.277-.262-2.149-.558-2.913-.306-.789-.718-1.459-1.384-2.126C21.319 1.347 20.651.935 19.86.63c-.765-.297-1.636-.499-2.913-.558C15.667.012 15.26 0 12 0zm0 2.16c3.203 0 3.585.016 4.85.071 1.17.055 1.805.249 2.227.415.562.217.96.477 1.382.896.419.42.679.819.896 1.381.164.422.36 1.057.413 2.227.057 1.266.07 1.646.07 4.85s-.015 3.585-.074 4.85c-.061 1.17-.256 1.805-.421 2.227-.224.562-.479.96-.899 1.382-.419.419-.824.679-1.38.896-.42.164-1.065.36-2.235.413-1.274.057-1.649.07-4.859.07-3.211 0-3.586-.015-4.859-.074-1.171-.061-1.816-.256-2.236-.421-.569-.224-.96-.479-1.379-.899-.421-.419-.69-.824-.9-1.38-.165-.42-.359-1.065-.42-2.235-.045-1.26-.061-1.649-.061-4.844 0-3.196.016-3.586.061-4.861.061-1.17.255-1.814.42-2.234.21-.57.479-.96.9-1.381.419-.419.81-.689 1.379-.898.42-.166 1.051-.361 2.221-.421 1.275-.045 1.65-.06 4.859-.06l.045.03zm0 3.678c-3.405 0-6.162 2.76-6.162 6.162 0 3.405 2.76 6.162 6.162 6.162 3.405 0 6.162-2.76 6.162-6.162 0-3.405-2.76-6.162-6.162-6.162zM12 16c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4zm7.846-10.405c0 .795-.646 1.44-1.44 1.44-.795 0-1.44-.646-1.44-1.44 0-.794.646-1.439 1.44-1.439.793-.001 1.44.645 1.44 1.439z" />
                    </svg>
                </div>
                <div class="app-name">Instagram</div>
            </div>
            <div class="app-icon" @click="handleAppTap('resume')" :class="{ 'bouncing': bouncingApp === 'resume' }">
                <div class="icon" v-html="appIcons.pdfMobile"></div>
                <div class="app-name">Resume</div>
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
                <div class="icon" v-html="appIcons.messages"></div>
            </div>
            <div class="dock-icon" @click="handleAppTap('safari')">
                <div class="icon" v-html="appIcons.safari"></div>
            </div>
            <div class="dock-icon" @click="handleAppTap('terminal')">
                <div class="icon" v-html="appIcons.terminalMobile"></div>
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
        <div v-if="terminalOpen" class="app-overlay" @touchstart.prevent.stop @touchmove.prevent.stop @touchend.prevent.stop>
            <Terminal @close="closeTerminal" :isDesktopMode="false" :isMobileMode="true" />
        </div>

        <!-- Music App -->
        <div v-if="musicOpen" class="app-overlay" @touchstart.stop @touchmove.stop @touchend.stop>
            <MusicPlayer :is-open="musicOpen" :is-minimized="false" :mobile-mode="true" @close="closeMusic" />
        </div>

        <!-- Calendar App -->
        <div v-if="calendarOpen" class="app-overlay" @touchstart.stop @touchmove.stop @touchend.stop>
            <Calendar :is-open="calendarOpen" :is-minimized="false" :mobile-mode="true" @close="closeCalendar" />
        </div>

        <!-- YouTube App -->
        <div v-if="youtubeOpen" class="app-overlay" @touchstart.stop @touchmove.stop @touchend.stop>
            <YouTubePlayer :is-open="youtubeOpen" :is-minimized="false" :mobile-mode="true" @close="closeYoutube" />
        </div>

        <!-- Settings App -->
        <div v-if="settingsOpen" class="settings-modal" @touchstart.stop @touchmove.stop @touchend.stop>
            <div class="settings-header-mobile">
                <button class="back-btn" @click="closeSettings">
                    ‹ Back
                </button>
                <span class="settings-title-mobile">Settings</span>
                <span class="spacer"></span>
            </div>
            <div class="settings-content-mobile">
                <div class="settings-section-mobile">
                    <h3 class="section-label">Appearance</h3>
                    <div class="section-card">
                        <h4 class="subsection-title">Wallpaper</h4>
                        <div class="wallpaper-grid-mobile">
                            <!-- Default Gradient -->
                            <div class="wallpaper-item-mobile" :class="{ 'selected': selectedWallpaper === 0 }"
                                @click="selectWallpaper(0)">
                                <div class="wallpaper-thumb">
                                    <div class="gradient-bg"></div>
                                </div>
                                <div class="wallpaper-label">Default</div>
                                <div v-if="selectedWallpaper === 0" class="check-badge">✓</div>
                            </div>

                            <!-- Image Wallpapers -->
                            <div v-for="wallpaper in wallpapers" :key="wallpaper.id" class="wallpaper-item-mobile"
                                :class="{ 'selected': selectedWallpaper === wallpaper.id }"
                                @click="selectWallpaper(wallpaper.id)">
                                <div class="wallpaper-thumb">
                                    <img :src="wallpaper.thumbnail" :alt="wallpaper.name" loading="lazy">
                                </div>
                                <div class="wallpaper-label">{{ wallpaper.name }}</div>
                                <div v-if="selectedWallpaper === wallpaper.id" class="check-badge">✓</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Notes App -->
        <div v-if="notesOpen" class="notes-app" @touchstart.prevent.stop @touchmove.prevent.stop @touchend.prevent.stop>
            <div class="notes-header-mobile">
                <button class="notes-back" @click="showNotesList ? closeNotes() : backToNotesList()">
                    ‹ {{ showNotesList ? 'Back' : 'Notes' }}
                </button>
                <span class="notes-title">{{ showNotesList ? 'Notes' : (getCurrentNote()?.title || 'Untitled') }}</span>
                <button v-if="showNotesList" class="notes-new-btn" @click="createNewNote">+</button>
                <span v-else class="notes-spacer"></span>
            </div>

            <!-- Notes List -->
            <div v-if="showNotesList" class="notes-list-mobile">
                <button v-if="notes.length > 0" @click="createNewNote" class="create-note-btn" style="margin: 8px; width: calc(100% - 16px);">+ New Note</button>
                <div v-if="notes.length === 0" class="notes-empty">
                    <span class="empty-icon">📝</span>
                    <p>No notes yet</p>
                    <button @click="createNewNote" class="create-note-btn">Create Note</button>
                </div>
                <div v-for="note in notes" :key="note.id" class="note-item-mobile" @click="selectNote(note.id)">
                    <div class="note-item-content">
                        <div class="note-item-title">{{ note.title || 'Untitled' }}</div>
                        <div class="note-item-preview">{{ getPreview(note.content) }}</div>
                        <div class="note-item-date">{{ formatNoteDate(note.updatedAt) }}</div>
                    </div>
                    <button class="note-delete-btn" @click.stop="deleteNote(note.id)">×</button>
                </div>
            </div>

            <!-- Note Editor -->
            <div v-else class="note-editor-mobile">
                <input v-if="getCurrentNote()" v-model="getCurrentNote().title" class="note-title-input-mobile"
                    placeholder="Note Title" @input="updateCurrentNote" autocorrect="off" autocomplete="off" autocapitalize="off" spellcheck="false" />
                <textarea v-if="getCurrentNote()" v-model="getCurrentNote().content" class="note-textarea-mobile"
                    placeholder="Start writing..." @input="updateCurrentNote" autocorrect="off" autocomplete="off" autocapitalize="off" spellcheck="false"></textarea>
            </div>
        </div>


        <!-- Notification -->
        <div class="notification" :class="{ 'visible': showNotification }">
            <div class="notification-icon">👋</div>
            <div class="notification-content">
                <div class="notification-title">Welcome</div>
                <div class="notification-text">Welcome to Pathum's Portfolio</div>
            </div>
        </div>

        <!-- ChatBot App (MUST be after other overlays) -->
        <div v-if="chatbotOpen" class="app-overlay" @touchstart.stop @touchmove.stop @touchend.stop>
            <div class="mobile-header">
                <button class="back-btn" @click="closeChatbot">‹ Back</button>
                <span class="mobile-title">Gemini ChatBot</span>
                <span class="spacer"></span>
            </div>
            <ChatBot />
        </div>

        <!-- Gallery App -->
        <Gallery :is-open="galleryOpen" @close="closeGallery" />
    </div>
</template>


<script setup>
import ChatBot from './ChatBot.vue';
import MusicPlayer from './MusicPlayer.vue';
import Gallery from './Gallery.vue';
import Terminal from './Terminal.vue';
import Calendar from './Calendar.vue';
import YouTubePlayer from './YouTubePlayer.vue';
import { appIcons } from '../assets/appIcons.js';
import { wallpapers } from '../data/wallpapers.js';
import { ref, computed, onMounted, onUnmounted } from 'vue';

const emit = defineEmits(['logout']);

const currentTime = ref('');
const batteryLevel = ref(87);
const terminalOpen = ref(false);
const galleryOpen = ref(false);
const notesOpen = ref(false);
const musicOpen = ref(false);
const calendarOpen = ref(false);
const youtubeOpen = ref(false);
const showControlCenter = ref(false);
const showNotification = ref(false);
const showWidgets = ref(false);
const bouncingApp = ref(null);
const isDark = ref(false);
const currentWallpaper = ref(null);
const settingsOpen = ref(false);
const selectedWallpaper = ref(0);

// Notes related refs
const notes = ref([]);
const currentNoteId = ref(null);
const showNotesList = ref(true);

// Computed property for background
const homeBackground = computed(() => {
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

const chatbotOpen = ref(false);

function handleAppTap(appName) {
    if (appName === 'chatbot') {
        chatbotOpen.value = true;
    }
    bouncingApp.value = appName;
    setTimeout(() => {
        bouncingApp.value = null;
        if (appName === 'terminal') {
            terminalOpen.value = true;
        } else if (appName === 'photos') {
            galleryOpen.value = true;
        } else if (appName === 'music') {
            musicOpen.value = true;
        } else if (appName === 'calendar') {
            calendarOpen.value = true;
        } else if (appName === 'youtube') {
            youtubeOpen.value = true;
        } else if (appName === 'notes') {
            notesOpen.value = true;
            loadNotes();
        } else if (appName === 'linkedin') {
            window.open('https://www.linkedin.com/in/pasindu-pathum-98a299249', '_blank');
        } else if (appName === 'facebook') {
            window.open('https://www.facebook.com/gap.pathum', '_blank');
        } else if (appName === 'instagram') {
            window.open('https://www.instagram.com/gap_pathum', '_blank');
        } else if (appName === 'resume') {
            window.open('/documents/resume.pdf', '_blank');
        } else if (appName === 'settings') {
            settingsOpen.value = true;
        } else if (appName === 'phone') {
            window.location.href = 'tel:+94752955301';
        } else if (appName === 'messages') {
            window.open('https://wa.me/94752955301?text=Hello%20Pathum', '_blank');
        }
    }, 300);
}




    function closeTerminal() {
        terminalOpen.value = false;
    }

function closeSettings() {
    settingsOpen.value = false;
}

function closeMusic() {
    musicOpen.value = false;
}

function closeGallery() {
    galleryOpen.value = false;
}

function closeCalendar() {
    calendarOpen.value = false;
}

function closeYoutube() {
    youtubeOpen.value = false;
}

function handleWallpaperChanged({ id, path }) {
    currentWallpaper.value = path;
}

// Notes functions
function loadNotes() {
    const saved = localStorage.getItem('portfolio-notes');
    if (saved) {
        notes.value = JSON.parse(saved);
        if (notes.value.length > 0 && !currentNoteId.value) {
            currentNoteId.value = notes.value[0].id;
        }
    } else {
        createNewNote();
        if (notes.value.length > 0) {
            notes.value[0].title = 'Welcome to Notes';
            notes.value[0].content = `Hello! 👋\n\nThis is your personal notepad.\n\nFeatures:\n• Create multiple notes\n• Auto-save to browser\n• Delete notes you don't need\n\nEnjoy! 🎉`;
            saveNotes();
        }
    }
}

function saveNotes() {
    localStorage.setItem('portfolio-notes', JSON.stringify(notes.value));
    }



function selectNote(id) {
    currentNoteId.value = id;
    showNotesList.value = false;
}

function deleteNote(id) {
    const index = notes.value.findIndex(n => n.id === id);
    if (index > -1) {
        notes.value.splice(index, 1);
        if (currentNoteId.value === id) {
            currentNoteId.value = notes.value.length > 0 ? notes.value[0].id : null;
        }
        saveNotes();
    }
}

function getCurrentNote() {
    return notes.value.find(n => n.id === currentNoteId.value) || null;
}

function updateCurrentNote() {
    const note = getCurrentNote();
    if (note) {
        note.updatedAt = new Date().toISOString();
        saveNotes();
    }
}

function closeNotes() {
    notesOpen.value = false;
    showNotesList.value = true;
}

function backToNotesList() {
    showNotesList.value = true;
}

function formatNoteDate(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now - date;

    if (diff < 60000) return 'Just now';
    if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
    if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;

    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

function getPreview(content) {
    if (!content) return 'No content';
    return content.substring(0, 40) + (content.length > 40 ? '...' : '');
}

function toggleControlCenter() {
    showControlCenter.value = !showControlCenter.value;
}

function handleLogout() {
    emit('logout');
}

function selectWallpaper(id) {
    selectedWallpaper.value = id;
    localStorage.setItem('wallpaper', id.toString());

    // Update wallpaper immediately
    if (id === 0) {
        currentWallpaper.value = null;
    } else {
        const wallpaper = wallpapers.find(w => w.id === id);
        if (wallpaper) {
            currentWallpaper.value = wallpaper.path;
        }
    }
}

let timeInterval;

onMounted(() => {
    updateTime();
    timeInterval = setInterval(updateTime, 1000);

    // Load saved wallpaper
    const savedWallpaper = localStorage.getItem('wallpaper');
    if (savedWallpaper && savedWallpaper !== '0') {
        const wallpaper = wallpapers.find(w => w.id === parseInt(savedWallpaper));
        if (wallpaper) {
            currentWallpaper.value = wallpaper.path;
            selectedWallpaper.value = parseInt(savedWallpaper);
        }
    }

    // Show welcome notification after login
    setTimeout(() => {
        showNotification.value = true;
        setTimeout(() => {
            showNotification.value = false;
        }, 4000);
    }, 500);
});

onUnmounted(() => {
    if (timeInterval) clearInterval(timeInterval);
});
</script>

<style scoped>
.iphone-home {
    width: 100vw;
    transition: background 0.3s ease;
    height: 100vh;
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

    0%,
    100% {
        transform: scale(1);
    }

    50% {
        transform: scale(1.15);
    }
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

.icon svg {
    width: 100%;
    height: 100%;
    border-radius: 14px;
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

.dock-icon .icon svg {
    width: 100%;
    height: 100%;
    border-radius: 12px;
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

/* App Overlay - wrapper for full screen apps */
.app-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 500;
    touch-action: auto;
}

/* Settings Modal */
.settings-modal {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: #1c1c1e;
    z-index: 600;
    display: flex;
    flex-direction: column;
    overflow: hidden;
}

.settings-header-mobile {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 12px 16px;
    background: rgba(28, 28, 30, 0.98);
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    padding-top: calc(12px + env(safe-area-inset-top));
}

.back-btn {
    background: none;
    border: none;
    color: #0a84ff;
    font-size: 18px;
    cursor: pointer;
    padding: 8px 0;
}

.settings-title-mobile {
    font-size: 17px;
    font-weight: 600;
    color: white;
}

.spacer {
    width: 44px;
}

.settings-content-mobile {
    flex: 1;
    overflow-y: auto;
    padding: 20px 16px;
    padding-bottom: calc(20px + env(safe-area-inset-bottom));
}

.settings-section-mobile {
    margin-bottom: 32px;
}

.section-label {
    font-size: 13px;
    font-weight: 600;
    color: rgba(255, 255, 255, 0.6);
    text-transform: uppercase;
    letter-spacing: 0.5px;
    margin-bottom: 8px;
    padding-left: 4px;
}

.section-card {
    background: rgba(44, 44, 46, 0.6);
    border-radius: 12px;
    padding: 16px;
}

.subsection-title {
    font-size: 17px;
    font-weight: 600;
    color: white;
    margin-bottom: 16px;
}

.wallpaper-grid-mobile {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 12px;
}

.wallpaper-item-mobile {
    position: relative;
    cursor: pointer;
    transition: transform 0.2s;
}

.wallpaper-item-mobile.selected .wallpaper-thumb {
    border-color: #0a84ff;
    box-shadow: 0 0 0 2px rgba(10, 132, 255, 0.4);
}

.wallpaper-thumb {
    position: relative;
    width: 100%;
    aspect-ratio: 16 / 10;
    border-radius: 10px;
    overflow: hidden;
    border: 2px solid transparent;
    transition: all 0.2s;
    background: #000;
}

.wallpaper-thumb img {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.wallpaper-thumb .gradient-bg {
    width: 100%;
    height: 100%;
    background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%);
}

.wallpaper-label {
    margin-top: 6px;
    font-size: 13px;
    color: rgba(255, 255, 255, 0.7);
    text-align: center;
}

.check-badge {
    position: absolute;
    top: 8px;
    right: 8px;
    width: 24px;
    height: 24px;
    background: #0a84ff;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    font-size: 14px;
    font-weight: bold;
}

.settings-content-mobile::-webkit-scrollbar {
    display: none;
}

/* Mobile Notes App */
.notes-app {
    position: fixed;
    inset: 0;
    background: #1c1c1e;
    z-index: 500;
    display: flex;
    flex-direction: column;
    animation: slideUpMobile 0.3s ease;
    touch-action: auto;
}

.notes-header-mobile {
    height: 56px;
    background: rgba(30, 30, 30, 0.95);
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 16px;
    flex-shrink: 0;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.notes-back {
    background: none;
    border: none;
    color: #007AFF;
    font-size: 17px;
    padding: 8px 0;
    cursor: pointer;
    min-width: 80px;
    text-align: left;
    display: flex;
    justify-content: flex-start;
    align-items: center;
}

.notes-title {
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

.notes-spacer {
    min-width: 80px;
}

/* Notes List Mobile */
.notes-list-mobile {
    flex: 1;
    overflow-y: auto;
    padding: 8px;
}

.notes-empty {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100%;
    color: rgba(255, 255, 255, 0.5);
}

.notes-empty .empty-icon {
    font-size: 48px;
    margin-bottom: 16px;
}

.notes-empty p {
    font-size: 16px;
    margin-bottom: 20px;
}

.create-note-btn {
    background: #FFCC02;
    border: none;
    color: #1c1c1e;
    padding: 12px 24px;
    border-radius: 10px;
    font-size: 16px;
    font-weight: 600;
    cursor: pointer;
}

.note-item-mobile {
    background: rgba(255, 255, 255, 0.05);
    border-radius: 12px;
    padding: 14px 16px;
    margin-bottom: 8px;
    display: flex;
    align-items: center;
    cursor: pointer;
    transition: background 0.2s;
}

.note-item-mobile:active {
    background: rgba(255, 255, 255, 0.1);
}

.note-item-content {
    flex: 1;
    min-width: 0;
}

.note-item-title {
    color: white;
    font-size: 16px;
    font-weight: 600;
    margin-bottom: 4px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

.note-item-preview {
    color: rgba(255, 255, 255, 0.5);
    font-size: 14px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    margin-bottom: 4px;
}

.note-item-date {
    color: rgba(255, 255, 255, 0.3);
    font-size: 12px;
}

.note-delete-btn {
    background: rgba(255, 59, 48, 0.8);
    border: none;
    color: white;
    width: 28px;
    height: 28px;
    border-radius: 50%;
    font-size: 18px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-left: 12px;
    flex-shrink: 0;
}

/* Note Editor Mobile */
.note-editor-mobile {
    flex: 1;
    display: flex;
    flex-direction: column;
    padding: 16px;
    overflow: hidden;
}

.note-title-input-mobile {
    background: transparent;
    border: none;
    outline: none;
    color: white;
    font-size: 22px;
    font-weight: 700;
    padding: 8px 0;
    margin-bottom: 12px;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.note-title-input-mobile::placeholder {
    color: rgba(255, 255, 255, 0.3);
}

.note-textarea-mobile {
    flex: 1;
    background: transparent;
    border: none;
    outline: none;
    color: rgba(255, 255, 255, 0.9);
    font-size: 16px;
    line-height: 1.6;
    resize: none;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

.note-textarea-mobile::placeholder {
    color: rgba(255, 255, 255, 0.3);
}

@media (min-width: 768px) {
    .iphone-home {
        display: none !important;
    }
}
</style>
