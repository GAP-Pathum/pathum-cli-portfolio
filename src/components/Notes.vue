<template>
    <div class="notes-window" @touchstart.stop @touchmove.stop @touchend.stop>
        <div class="notes-header" @mousedown="$emit('startDrag', $event)">
            <div class="window-controls">
                <span class="window-dot close" @click.stop="$emit('close')"></span>
                <span class="window-dot minimize" @click.stop="$emit('minimize')"></span>
                <span class="window-dot maximize" @click.stop="$emit('toggleMaximize')"></span>
            </div>
            <div class="window-title">Notes</div>
        </div>
        <div class="notes-body">
            <!-- Sidebar -->
            <div class="notes-sidebar">
                <div class="sidebar-header">
                    <button class="new-note-btn" type="button" aria-label="Create new note" @click="createNewNote">
                        <span class="btn-icon" aria-hidden="true">+</span>
                        New Note
                    </button>
                </div>
                <div class="notes-list">
                    <div v-for="note in notes" :key="note.id" class="note-item"
                        :class="{ active: currentNoteId === note.id }" @click="selectNote(note.id)">
                        <div class="note-item-title">{{ note.title || 'Untitled' }}</div>
                        <div class="note-item-preview">{{ getPreview(note.content) }}</div>
                        <div class="note-item-date">{{ formatDate(note.updatedAt) }}</div>
                        <button class="delete-note-btn" @click.stop="deleteNote(note.id)">×</button>
                    </div>
                </div>
            </div>
            <!-- Editor -->
            <div class="notes-editor">
                <div v-if="currentNote" class="editor-content">
                    <input v-model="currentNote.title" class="note-title-input" placeholder="Note Title"
                        @input="saveNote" />
                    <textarea v-model="currentNote.content" class="note-textarea" placeholder="Start writing..."
                        @input="saveNote"></textarea>
                </div>
                <div v-else class="no-note-selected">
                    <div class="empty-state">
                        <span class="empty-icon">📝</span>
                        <p>Select a note or create a new one</p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';

const emit = defineEmits(['close', 'minimize', 'toggleMaximize', 'startDrag']);

// Notes data
const notes = ref([]);
const currentNoteId = ref(null);

// Computed current note
const currentNote = computed(() => {
    return notes.value.find(n => n.id === currentNoteId.value) || null;
});

// Load notes from localStorage
function loadNotes() {
    const saved = localStorage.getItem('portfolio-notes');
    if (saved) {
        notes.value = JSON.parse(saved);
        if (notes.value.length > 0) {
            currentNoteId.value = notes.value[0].id;
        }
    } else {
        // Create welcome note
        createNewNote();
        if (currentNote.value) {
            currentNote.value.title = 'Welcome to Notes';
            currentNote.value.content = `Hello! 👋

This is your personal notepad. Feel free to write anything here!

Features:
• Create multiple notes
• Auto-save to browser storage
• Delete notes you don't need

Tips:
- Click "New Note" to create a new note
- Your notes are saved automatically
- Notes persist even after closing the browser

Enjoy! 🎉`;
            saveNotes();
        }
    }
}

// Save notes to localStorage
function saveNotes() {
    localStorage.setItem('portfolio-notes', JSON.stringify(notes.value));
}

// Create new note
function createNewNote() {
    const newNote = {
        id: Date.now(),
        title: '',
        content: '',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    };
    notes.value.unshift(newNote);
    currentNoteId.value = newNote.id;
    saveNotes();
}

// Select note
function selectNote(id) {
    currentNoteId.value = id;
}

// Delete note
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

// Save current note (debounced via input)
function saveNote() {
    if (currentNote.value) {
        currentNote.value.updatedAt = new Date().toISOString();
        saveNotes();
    }
}

// Get preview text
function getPreview(content) {
    if (!content) return 'No content';
    return content.substring(0, 50) + (content.length > 50 ? '...' : '');
}

// Format date
function formatDate(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now - date;

    if (diff < 60000) return 'Just now';
    if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
    if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;

    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

onMounted(() => {
    loadNotes();
});
</script>

<style scoped>
.notes-window {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    background: #1e1e1e;
    border-radius: 10px;
    overflow: hidden;
}

.notes-header {
    height: 36px;
    background: rgba(40, 40, 58, 0.95);
    border-bottom: 1px solid rgba(255, 255, 255, 0.08);
    display: flex;
    align-items: center;
    padding: 0 12px;
    cursor: move;
    user-select: none;
    flex-shrink: 0;
}

.window-controls {
    display: flex;
    gap: 8px;
    margin-right: 12px;
}

.window-dot {
    width: 12px;
    height: 12px;
    border-radius: 50%;
    cursor: pointer;
    transition: all 0.15s ease;
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

.window-dot:active {
    transform: scale(0.95);
}

.window-title {
    flex: 1;
    text-align: center;
    color: rgba(255, 255, 255, 0.7);
    font-size: 13px;
    font-weight: 500;
}

.notes-body {
    flex: 1;
    display: flex;
    overflow: hidden;
}

/* Sidebar */
.notes-sidebar {
    width: 250px;
    background: #252526;
    border-right: 1px solid rgba(255, 255, 255, 0.08);
    display: flex;
    flex-direction: column;
}

.sidebar-header {
    padding: 12px;
    border-bottom: 1px solid rgba(255, 255, 255, 0.08);
}

.new-note-btn {
    width: 100%;
    padding: 10px 16px;
    background: linear-gradient(135deg, #FFCC02 0%, #FFB800 100%);
    border: none;
    border-radius: 8px;
    color: #1e1e1e;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    transition: all 0.2s ease;
}

.new-note-btn:hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(255, 204, 2, 0.3);
}

.btn-icon {
    font-size: 18px;
    font-weight: bold;
}

.notes-list {
    flex: 1;
    overflow-y: auto;
    padding: 8px;
}

.notes-list::-webkit-scrollbar {
    width: 6px;
}

.notes-list::-webkit-scrollbar-track {
    background: transparent;
}

.notes-list::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.2);
    border-radius: 3px;
}

.note-item {
    padding: 12px;
    border-radius: 8px;
    cursor: pointer;
    margin-bottom: 4px;
    position: relative;
    transition: all 0.2s ease;
}

.note-item:hover {
    background: rgba(255, 255, 255, 0.05);
}

.note-item.active {
    background: rgba(255, 204, 2, 0.15);
    border-left: 3px solid #FFCC02;
}

.note-item-title {
    color: #fff;
    font-size: 14px;
    font-weight: 600;
    margin-bottom: 4px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

.note-item-preview {
    color: rgba(255, 255, 255, 0.5);
    font-size: 12px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    margin-bottom: 4px;
}

.note-item-date {
    color: rgba(255, 255, 255, 0.3);
    font-size: 11px;
}

.delete-note-btn {
    position: absolute;
    top: 8px;
    right: 8px;
    width: 20px;
    height: 20px;
    background: rgba(255, 59, 48, 0.8);
    border: none;
    border-radius: 50%;
    color: white;
    font-size: 14px;
    cursor: pointer;
    opacity: 0;
    transition: all 0.2s ease;
    display: flex;
    align-items: center;
    justify-content: center;
}

.note-item:hover .delete-note-btn {
    opacity: 1;
}

.delete-note-btn:hover {
    background: #ff3b30;
    transform: scale(1.1);
}

/* Editor */
.notes-editor {
    flex: 1;
    display: flex;
    flex-direction: column;
    background: #1e1e1e;
}

.editor-content {
    flex: 1;
    display: flex;
    flex-direction: column;
    padding: 20px;
}

.note-title-input {
    background: transparent;
    border: none;
    outline: none;
    color: #fff;
    font-size: 24px;
    font-weight: 700;
    padding: 8px 0;
    margin-bottom: 16px;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.note-title-input::placeholder {
    color: rgba(255, 255, 255, 0.3);
}

.note-textarea {
    flex: 1;
    background: transparent;
    border: none;
    outline: none;
    color: rgba(255, 255, 255, 0.9);
    font-size: 15px;
    line-height: 1.7;
    resize: none;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

.note-textarea::placeholder {
    color: rgba(255, 255, 255, 0.3);
}

.note-textarea::-webkit-scrollbar {
    width: 6px;
}

.note-textarea::-webkit-scrollbar-track {
    background: transparent;
}

.note-textarea::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.2);
    border-radius: 3px;
}

/* Empty state */
.no-note-selected {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
}

.empty-state {
    text-align: center;
    color: rgba(255, 255, 255, 0.4);
}

.empty-icon {
    font-size: 48px;
    display: block;
    margin-bottom: 16px;
}

.empty-state p {
    font-size: 16px;
}
</style>
