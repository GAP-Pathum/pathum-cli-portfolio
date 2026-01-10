<template>
    <div :class="['file-manager', isMobile ? 'mobile' : 'desktop', darkMode ? 'dark' : '', { maximized, minimized }]"
        :style="windowStyle" ref="windowRef">
        <div class="sidebar">
            <div class="folder" :class="{ active: navStack.length === 1 }" @click="goToRoot">
                <span class="folder-icon">📁</span>
                <span class="folder-name">Projects</span>
            </div>
        </div>
        <div class="content">
            <div class="folder-content">
                <div class="fm-header">
                    <button v-if="navStack.length > 1" class="fm-back" @click="goBack">‹ Back</button>
                    <h2>{{ currentFolder.name }}</h2>
                </div>
                <div v-if="currentFolder.children && currentFolder.children.length > 0" class="file-list">
                    <div v-for="file in currentFolder.children" :key="file.name" class="file-row"
                        @dblclick="openFile(file)">
                        <span class="file-icon" v-html="getFileIconSvg(file)"></span>
                        <span class="file-name">{{ file.name }}</span>
                        <span class="file-size">{{ file.size || '' }}</span>
                        <span class="file-modified">{{ file.modified || '' }}</span>
                    </div>
                </div>
                <div v-else class="empty">This folder is empty.</div>
            </div>
        </div>
        <!-- Resize handles (desktop only) -->
        <div v-if="!isMobile && !maximized && !minimized" class="resize-handle resize-right" @mousedown="e => startResize(e, 'right')"></div>
        <div v-if="!isMobile && !maximized && !minimized" class="resize-handle resize-bottom" @mousedown="e => startResize(e, 'bottom')"></div>
        <div v-if="!isMobile && !maximized && !minimized" class="resize-handle resize-corner" @mousedown="e => startResize(e, 'corner')"></div>
    </div>
</template>

<script>

import { ref, onMounted, onBeforeUnmount, computed } from 'vue';
import { projectsFolder } from '../data/projects.js';
import { appIcons } from '../assets/appIcons.js';

export default {
    name: 'FileManager',
    props: {
        darkMode: {
            type: Boolean,
            default: true
        },
        maximized: Boolean,
        minimized: Boolean,
        zIndex: Number
    },
    emits: ['close', 'minimize', 'maximize', 'restore', 'focus'],
    setup(props, { emit }) {

        const isMobile = ref(false);
        const windowRef = ref(null);

        // Navigation stack for folders/files
        const navStack = ref([projectsFolder]);
        const currentFolder = computed(() => navStack.value[navStack.value.length - 1]);

        // Window position and size
        const pos = ref({ x: 120, y: 80 });
        const size = ref({ w: 700, h: 480 });
        const dragging = ref(false);
        const resizing = ref(false);
        const dragOffset = ref({ x: 0, y: 0 });
        const resizeStart = ref({ x: 0, y: 0, w: 0, h: 0 });

        const windowStyle = computed(() => {
            if (props.maximized) {
                return {
                    left: 0,
                    top: 0,
                    width: '100vw',
                    height: '100vh',
                    zIndex: props.zIndex || 10
                };
            }
            if (props.minimized) {
                return {
                    display: 'none'
                };
            }
            return {
                left: pos.value.x + 'px',
                top: pos.value.y + 'px',
                width: size.value.w + 'px',
                height: size.value.h + 'px',
                zIndex: props.zIndex || 10
            };
        });

        function goToRoot() {
            navStack.value = [projectsFolder];
        }
        function goBack() {
            if (navStack.value.length > 1) navStack.value.pop();
        }
        function openFile(file) {
            if (file.children) {
                navStack.value.push(file);
            } else {
                // Optionally: open file preview or show file details
                // For now, do nothing or show alert
                // alert('Open file: ' + file.name);
            }
        }

        function handleResize() {
            isMobile.value = window.innerWidth <= 600;
        }

        function bringToFront() {
            emit('focus');
        }

        // Drag logic
        function startDrag(e) {
            if (props.maximized || props.minimized) return;
            dragging.value = true;
            const clientX = e.touches ? e.touches[0].clientX : e.clientX;
            const clientY = e.touches ? e.touches[0].clientY : e.clientY;
            dragOffset.value = {
                x: clientX - pos.value.x,
                y: clientY - pos.value.y
            };
            document.addEventListener('mousemove', onDragMove);
            document.addEventListener('mouseup', stopDrag);
            document.addEventListener('touchmove', onDragMove);
            document.addEventListener('touchend', stopDrag);
        }
        function onDragMove(e) {
            if (!dragging.value) return;
            const clientX = e.touches ? e.touches[0].clientX : e.clientX;
            const clientY = e.touches ? e.touches[0].clientY : e.clientY;
            pos.value.x = clientX - dragOffset.value.x;
            pos.value.y = clientY - dragOffset.value.y;
        }
        function stopDrag() {
            dragging.value = false;
            document.removeEventListener('mousemove', onDragMove);
            document.removeEventListener('mouseup', stopDrag);
            document.removeEventListener('touchmove', onDragMove);
            document.removeEventListener('touchend', stopDrag);
        }

        // Resize logic
        let resizeDirection = null;
        function startResize(e, direction = 'corner') {
            if (props.maximized || props.minimized) return;
            resizing.value = true;
            resizeDirection = direction;
            const clientX = e.touches ? e.touches[0].clientX : e.clientX;
            const clientY = e.touches ? e.touches[0].clientY : e.clientY;
            resizeStart.value = {
                x: clientX,
                y: clientY,
                w: size.value.w,
                h: size.value.h
            };
            document.addEventListener('mousemove', onResizeMove);
            document.addEventListener('mouseup', stopResize);
            document.addEventListener('touchmove', onResizeMove);
            document.addEventListener('touchend', stopResize);
        }
        function onResizeMove(e) {
            if (!resizing.value) return;
            const clientX = e.touches ? e.touches[0].clientX : e.clientX;
            const clientY = e.touches ? e.touches[0].clientY : e.clientY;
            const dx = clientX - resizeStart.value.x;
            const dy = clientY - resizeStart.value.y;
            if (resizeDirection === 'right') {
                size.value.w = Math.max(400, resizeStart.value.w + dx);
            } else if (resizeDirection === 'bottom') {
                size.value.h = Math.max(300, resizeStart.value.h + dy);
            } else {
                size.value.w = Math.max(400, resizeStart.value.w + dx);
                size.value.h = Math.max(300, resizeStart.value.h + dy);
            }
        }
        function stopResize() {
            resizing.value = false;
            resizeDirection = null;
            document.removeEventListener('mousemove', onResizeMove);
            document.removeEventListener('mouseup', stopResize);
            document.removeEventListener('touchmove', onResizeMove);
            document.removeEventListener('touchend', stopResize);
        }

        function handleMinimize() {
            emit('minimize');
        }
        function handleMaximize() {
            if (props.maximized) {
                emit('restore');
            } else {
                emit('maximize');
            }
        }


        function getFileIconSvg(file) {
            // Use folder icon for folders, file icon for files
            if (file.children) {
                return appIcons.files; // folder icon
            }
            // Use file type icon if available, else default file icon
            if (file.icon && appIcons[file.icon]) {
                return appIcons[file.icon];
            }
            return appIcons.files;
        }

        onMounted(() => {
            handleResize();
            window.addEventListener('resize', handleResize);
        });
        onBeforeUnmount(() => {
            window.removeEventListener('resize', handleResize);
            stopDrag();
            stopResize();
        });

        return {
            isMobile,
            windowRef,
            windowStyle,
            navStack,
            currentFolder,
            goToRoot,
            goBack,
            openFile,
            startDrag,
            bringToFront,
            startResize,
            handleMinimize,
            handleMaximize,
            getFileIconSvg,
            maximized: props.maximized,
            minimized: props.minimized
        };
    }
};
</script>

<style scoped>
/* Windowed File Manager Styles */
.file-manager {
    position: absolute;
    display: flex;
    flex-direction: row;
    background: var(--fm-bg, #f5f5f7);
    border-radius: 12px;
    overflow: hidden;
    box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.18);
    transition: background 0.2s, box-shadow 0.2s;
    min-width: 350px;
    min-height: 260px;
    user-select: none;
}

.file-manager.dark {
    --fm-bg: #18191c;
    --fm-sidebar: #23242a;
    --fm-content: #23242a;
    --fm-border: #23242a;
    --fm-folder: #23242a;
    --fm-folder-active: #31323a;
    --fm-text: #f5f5f7;
    --fm-empty: #888;
    background: var(--fm-bg);
}

.file-manager.maximized {
    border-radius: 0;
    box-shadow: none;
}

.file-manager.minimized {
    display: none !important;
}

.sidebar {
    margin-top: 38px;
    width: 200px;
    background: var(--fm-sidebar, #e0e0e0);
    padding: 16px 0;
    display: flex;
    flex-direction: column;
    gap: 8px;
    border-right: 1px solid var(--fm-border, #e0e0e0);
    z-index: 1;
}

.folder {
    display: flex;
    align-items: center;
    padding: 8px 16px;
    cursor: pointer;
    border-radius: 8px;
    transition: background 0.2s;
    color: var(--fm-text, #222);
    background: var(--fm-folder, #e0e0e0);
}

.folder.active,
.folder:hover {
    background: var(--fm-folder-active, #d1d1d6);
}

.folder-icon {
    margin-right: 8px;
}

.content {
    flex: 1;
    padding: 62px 24px 24px 24px;
    background: var(--fm-content, #fff);
    border-left: 1px solid var(--fm-border, #e0e0e0);
    color: var(--fm-text, #222);
    min-width: 0;
    min-height: 0;
    overflow: auto;
}

.folder-content h2 {
    margin-top: 0;
    font-weight: 600;
    font-size: 1.2rem;
}

.empty {
    color: var(--fm-empty, #888);
    margin-top: 24px;
}

.file-list {
    margin-top: 12px;
    display: flex;
    flex-direction: column;
    gap: 6px;
}

.file-row {
    display: flex;
    align-items: center;
    padding: 8px 12px;
    border-radius: 6px;
    transition: background 0.15s;
    cursor: pointer;
    background: transparent;
}

.file-row:hover {
    background: rgba(120, 120, 120, 0.08);
}

.file-icon {
    width: 32px;
    text-align: center;
    font-size: 1.3rem;
    margin-right: 10px;
}

.file-name {
    flex: 1;
    font-weight: 500;
    color: var(--fm-text, #222);
}

.file-size {
    width: 80px;
    text-align: right;
    color: #aaa;
    font-size: 0.95em;
}

.file-modified {
    width: 110px;
    text-align: right;
    color: #aaa;
    font-size: 0.95em;
    margin-left: 16px;
}

/* Resize handle */
.resize-handle {
    position: absolute;
    right: 0;
    bottom: 0;
    width: 18px;
    height: 18px;
    background: transparent;
    cursor: nwse-resize;
    z-index: 10;
}

/* Resize handles for scalable window */
.resize-handle {
    position: absolute;
    background: transparent;
    z-index: 20;
}
.resize-right {
    right: 0;
    top: 38px;
    width: 12px;
    height: calc(100% - 38px - 18px);
    cursor: ew-resize;
}
.resize-bottom {
    left: 0;
    bottom: 0;
    width: calc(100% - 18px);
    height: 12px;
    cursor: ns-resize;
}
.resize-corner {
    right: 0;
    bottom: 0;
    width: 18px;
    height: 18px;
    cursor: nwse-resize;
}
.resize-corner:after {
    content: '';
    display: block;
    width: 100%;
    height: 100%;
    background: linear-gradient(135deg, #bbb 40%, transparent 60%);
    opacity: 0.5;
    border-radius: 4px;
}
.file-manager.mobile .sidebar {
    width: 100%;
    flex-direction: row;
    padding: 0 8px;
    gap: 0;
    border-bottom: 1px solid var(--fm-border, #e0e0e0);
    border-right: none;
    margin-top: 0;
}

.file-manager.mobile .folder {
    flex: 1;
    justify-content: center;
    padding: 12px 0;
}

.file-manager.mobile .content {
    padding: 16px;
    border-left: none;
    border-top: 1px solid var(--fm-border, #e0e0e0);
    min-width: 0;
    min-height: 0;
}

.sidebar {
    margin-top: 38px;
    width: 200px;
    background: var(--fm-sidebar, #e0e0e0);
    padding: 16px 0;
    display: flex;
    flex-direction: column;
    gap: 8px;
    border-right: 1px solid var(--fm-border, #e0e0e0);
    z-index: 1;
}

.folder {
    display: flex;
    align-items: center;
    padding: 8px 16px;
    cursor: pointer;
    border-radius: 8px;
    transition: background 0.2s;
    color: var(--fm-text, #222);
    background: var(--fm-folder, #e0e0e0);
}

.folder.active,
.folder:hover {
    background: var(--fm-folder-active, #d1d1d6);
}

.folder-icon {
    margin-right: 8px;
}

.content {
    flex: 1;
    padding: 62px 24px 24px 24px;
    background: var(--fm-content, #fff);
    border-left: 1px solid var(--fm-border, #e0e0e0);
    color: var(--fm-text, #222);
    min-width: 0;
    min-height: 0;
    overflow: auto;
}

.folder-content h2 {
    margin-top: 0;
    font-weight: 600;
    font-size: 1.2rem;
}

.empty {
    color: var(--fm-empty, #888);
    margin-top: 24px;
}

.file-list {
    margin-top: 12px;
    display: flex;
    flex-direction: column;
    gap: 6px;
}

.file-row {
    display: flex;
    align-items: center;
    padding: 8px 12px;
    border-radius: 6px;
    transition: background 0.15s;
    cursor: pointer;
    background: transparent;
}

.file-row:hover {
    background: rgba(120, 120, 120, 0.08);
}

.file-icon {
    width: 32px;
    text-align: center;
    font-size: 1.3rem;
    margin-right: 10px;
}

.file-name {
    flex: 1;
    font-weight: 500;
    color: var(--fm-text, #222);
}

.file-size {
    width: 80px;
    text-align: right;
    color: #aaa;
    font-size: 0.95em;
}

.file-modified {
    width: 110px;
    text-align: right;
    color: #aaa;
    font-size: 0.95em;
    margin-left: 16px;
}

/* Resize handle */
.resize-handle {
    position: absolute;
    right: 0;
    bottom: 0;
    width: 18px;
    height: 18px;
    background: transparent;
    cursor: nwse-resize;
    z-index: 10;
}

/* Resize handles for scalable window */
.resize-handle {
    position: absolute;
    background: transparent;
    z-index: 20;
}
.resize-right {
    right: 0;
    top: 38px;
    width: 12px;
    height: calc(100% - 38px - 18px);
    cursor: ew-resize;
}
.resize-bottom {
    left: 0;
    bottom: 0;
    width: calc(100% - 18px);
    height: 12px;
    cursor: ns-resize;
}
.resize-corner {
    right: 0;
    bottom: 0;
    width: 18px;
    height: 18px;
    cursor: nwse-resize;
}
.resize-corner:after {
    content: '';
    display: block;
    width: 100%;
    height: 100%;
    background: linear-gradient(135deg, #bbb 40%, transparent 60%);
    opacity: 0.5;
    border-radius: 4px;
}
.file-manager.mobile .window-header {
    position: relative;
    border-radius: 0;
}

.file-manager.mobile .sidebar {
    width: 100%;
    flex-direction: row;
    padding: 0 8px;
    gap: 0;
    border-bottom: 1px solid var(--fm-border, #e0e0e0);
    border-right: none;
    margin-top: 0;
}

.file-manager.mobile .folder {
    flex: 1;
    justify-content: center;
    padding: 12px 0;
}

.file-manager.mobile .content {
    padding: 16px;
    border-left: none;
    border-top: 1px solid var(--fm-border, #e0e0e0);
    min-width: 0;
    min-height: 0;
}

.window-header.filemanager-header {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 38px;
    background: rgba(240, 240, 240, 0.95);
    display: flex;
    align-items: center;
    z-index: 100;
    cursor: grab;
    border-top-left-radius: 12px;
    border-top-right-radius: 12px;
    border-bottom: 1px solid var(--fm-border, #e0e0e0);
    user-select: none;
    box-sizing: border-box;
    padding: 0 16px;
}
.file-manager.dark .window-header.filemanager-header {
    background: rgba(30, 30, 30, 0.95);
    border-bottom: 1px solid #23242a;
}
.fm-header-left {
    display: flex;
    gap: 10px;
    align-items: center;
}
.fm-header-right {
    min-width: 40px;
}
.fm-title {
    flex: 1;
    text-align: center;
    font-size: 1.15rem;
    font-weight: 600;
    color: var(--fm-text, #222);
    letter-spacing: 0.01em;
}
.fm-btn {
    width: 18px;
    height: 18px;
    border-radius: 50%;
    border: none;
    margin: 0;
    padding: 0;
    cursor: pointer;
    background: #e74c3c;
    box-shadow: 0 1px 2px rgba(0,0,0,0.08);
    transition: background 0.18s;
}
.fm-btn.minimize { background: #f4c542; }
.fm-btn.maximize { background: #27c93f; }
</style>