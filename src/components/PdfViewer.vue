<template>
    <div class="safari-window" :class="{ 'mobile-mode': isMobileMode }" @touchstart.stop @touchmove.stop @touchend.stop>
        <!-- Safari Header / Toolbar -->
        <div class="safari-header" @mousedown="isMobileMode ? null : $emit('startDrag', $event)">
            <!-- macOS Traffic Lights (Desktop only) -->
            <div v-if="!isMobileMode" class="window-controls" @mousedown.stop>
                <span class="window-dot close" @click.stop="$emit('close')"></span>
                <span class="window-dot minimize" @click.stop="$emit('minimize')"></span>
                <span class="window-dot maximize" @click.stop="$emit('toggleMaximize')"></span>
            </div>

            <!-- Safari Navigation Controls -->
            <div class="safari-nav" @mousedown.stop>
                <button class="nav-btn" :disabled="true">
                    <svg viewBox="0 0 24 24" width="18" height="18">
                        <path fill="currentColor" d="M15.41 16.59L10.83 12l4.58-4.59L14 6l-6 6 6 6 1.41-1.41z" />
                    </svg>
                </button>
                <button class="nav-btn" :disabled="true">
                    <svg viewBox="0 0 24 24" width="18" height="18">
                        <path fill="currentColor" d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z" />
                    </svg>
                </button>
            </div>

            <!-- URL Bar -->
            <div class="url-bar" @mousedown.stop>
                <div class="security-icon">
                    <svg viewBox="0 0 24 24" width="12" height="12">
                        <path fill="currentColor"
                            d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z" />
                    </svg>
                </div>
                <span class="url-text">pasindu.me/resume.pdf</span>
                <div class="refresh-icon" @click="loadPDF">
                    <svg viewBox="0 0 24 24" width="14" height="14">
                        <path fill="currentColor"
                            d="M17.65 6.35C16.2 4.9 14.21 4 12 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08c-.82 2.33-3.04 4-5.65 4-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z" />
                    </svg>
                </div>
            </div>

            <!-- Sidebar & Share Controls -->
            <div class="safari-extra" @mousedown.stop>
                <button class="nav-btn desktop-only" v-if="!isMobileMode">
                    <svg viewBox="0 0 24 24" width="18" height="18">
                        <path fill="currentColor"
                            d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92 1.61 0 2.92-1.31 2.92-2.92s-1.31-2.92-2.92-2.92z" />
                    </svg>
                </button>
                <button class="nav-btn" v-if="!isMobileMode">
                    <svg viewBox="0 0 24 24" width="18" height="18">
                        <path fill="currentColor" d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />
                    </svg>
                </button>
                <button class="nav-btn" v-if="!isMobileMode">
                    <svg viewBox="0 0 24 24" width="18" height="18">
                        <path fill="currentColor"
                            d="M3 13h2v-2H3v2zm0 4h2v-2H3v2zm0-8h2V7H3v2zm4 4h14v-2H7v2zm0 4h14v-2H7v2zM7 7v2h14V7H7z" />
                    </svg>
                </button>
                <button v-if="isMobileMode" class="mobile-close-btn" @click="$emit('close')">Done</button>
            </div>
        </div>

        <!-- Safari Tabs (Desktop Only) -->
        <div v-if="!isMobileMode" class="safari-tabs">
            <div class="safari-tab active">
                <span class="tab-favicon">📄</span>
                <span class="tab-title">Resume — Pasindu Pathum</span>
                <span class="tab-close">×</span>
            </div>
            <div class="new-tab-btn">+</div>
        </div>

        <!-- PDF Toolbar (Internal) -->
        <div class="pdf-internal-toolbar">
            <div class="pdf-pages">
                <button @click="previousPage" :disabled="currentPage <= 1" class="page-btn">←</button>
                <span class="page-count">{{ currentPage }} / {{ totalPages }}</span>
                <button @click="nextPage" :disabled="currentPage >= totalPages" class="page-btn">→</button>
            </div>
            <div class="pdf-zoom">
                <button @click="zoomOut" class="page-btn">－</button>
                <span class="zoom-level">{{ Math.round(scale * 100) }}%</span>
                <button @click="zoomIn" class="page-btn">＋</button>
            </div>
        </div>

        <!-- Browser Body -->
        <div class="browser-body" ref="pdfContainer" @scroll="handleScroll">
            <div v-if="loading" class="pdf-loader">
                <div class="spinner"></div>
                <span>Opening PDF...</span>
            </div>
            <div v-else-if="error" class="pdf-error">
                <div class="error-msg">⚠️ {{ error }}</div>
                <button class="retry-btn" @click="loadPDF">Retry</button>
            </div>

            <div v-show="!loading && !error" class="pdf-pages-list">
                <div v-for="pageIndex in totalPages" :key="pageIndex" :id="'page-' + pageIndex" class="pdf-page-wrapper"
                    :data-page-number="pageIndex"
                    :style="{ width: (pageDimensions.get(pageIndex)?.width || 0) + 'px', height: (pageDimensions.get(pageIndex)?.height || 0) + 'px' }">
                    <canvas :id="'canvas-' + pageIndex"></canvas>
                    <div :id="'annotation-' + pageIndex" class="annotationLayer"></div>
                </div>
            </div>
        </div>

        <!-- Mobile Bottom Bar (iOS Safari Style) -->
        <div v-if="isMobileMode" class="mobile-bottom-bar">
            <button class="mob-nav-btn"><svg viewBox="0 0 24 24" width="24" height="24">
                    <path fill="currentColor" d="M15.41 16.59L10.83 12l4.58-4.59L14 6l-6 6 6 6 1.41-1.41z" />
                </svg></button>
            <button class="mob-nav-btn"><svg viewBox="0 0 24 24" width="24" height="24">
                    <path fill="currentColor" d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z" />
                </svg></button>
            <button class="mob-nav-btn share"><svg viewBox="0 0 24 24" width="24" height="24">
                    <path fill="currentColor"
                        d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92 1.61 0 2.92-1.31 2.92-2.92s-1.31-2.92-2.92-2.92z" />
                </svg></button>
            <button class="mob-nav-btn book"><svg viewBox="0 0 24 24" width="24" height="24">
                    <path fill="currentColor"
                        d="M18 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zM6 4h5v8l-2.5-1.5L6 12V4z" />
                </svg></button>
            <button class="mob-nav-btn tabs"><svg viewBox="0 0 24 24" width="24" height="24">
                    <path fill="currentColor"
                        d="M3 13h2v-2H3v2zm0 4h2v-2H3v2zm0-8h2V7H3v2zm4 4h14v-2H7v2zm0 4h14v-2H7v2zM7 7v2h14V7H7z" />
                </svg></button>
        </div>
    </div>
</template>

<script setup>
import { ref, shallowRef, onMounted, onUnmounted, nextTick, watch } from 'vue';
import * as pdfjsLib from 'pdfjs-dist';

// Set worker source to local file in public folder
pdfjsLib.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.js';

const props = defineProps({
    isMobileMode: {
        type: Boolean,
        default: false
    }
});

const emit = defineEmits(['close', 'minimize', 'toggleMaximize', 'startDrag']);

const pdfContainer = ref(null);
const pdfDoc = shallowRef(null);
const currentPage = ref(1);
const totalPages = ref(0);
const scale = ref(1.0);
const loading = ref(true);
const error = ref(null);
const pageDimensions = ref(new Map());

async function loadPDF() {
    loading.value = true;
    error.value = null;
    try {
        console.log('Loading PDF from /documents/resume.txt (Base64)...');
        const resp = await fetch('/documents/resume.txt');
        if (!resp.ok) throw new Error(`HTTP error! status: ${resp.status}`);
        const json = await resp.json();

        const base64 = json.file.data.replace(/\s/g, '');
        const binaryString = window.atob(base64);
        const len = binaryString.length;
        const bytes = new Uint8Array(len);
        for (let i = 0; i < len; i++) bytes[i] = binaryString.charCodeAt(i);

        const loadingTask = pdfjsLib.getDocument({ data: bytes });
        const doc = await loadingTask.promise;

        pdfDoc.value = doc;
        totalPages.value = doc.numPages;
        currentPage.value = 1;

        await nextTick();
        await renderAllPages();
        setupIntersectionObserver();
        loading.value = false;
    } catch (e) {
        console.error('Error in loadPDF:', e);
        error.value = `Load Error: ${e.message}`;
        loading.value = false;
    }
}

async function renderAllPages() {
    for (let i = 1; i <= totalPages.value; i++) {
        await renderSinglePage(i);
    }
}

async function renderSinglePage(pageNum) {
    const doc = pdfDoc.value;
    if (!doc) return;

    try {
        const page = await doc.getPage(pageNum);
        const canvas = document.getElementById(`canvas-${pageNum}`);
        const annotationDiv = document.getElementById(`annotation-${pageNum}`);
        if (!canvas) return;

        const context = canvas.getContext('2d');
        const container = pdfContainer.value;
        if (!container) return;

        let containerWidth = container.clientWidth - (props.isMobileMode ? 20 : 80);
        if (containerWidth <= 0) containerWidth = window.innerWidth * 0.8;

        const viewport1 = page.getViewport({ scale: 1 });
        const autoScale = (containerWidth / viewport1.width) * 0.98;
        const finalScale = autoScale * scale.value;
        const viewport = page.getViewport({ scale: finalScale });

        pageDimensions.value.set(pageNum, {
            width: Math.floor(viewport.width),
            height: Math.floor(viewport.height)
        });

        const outputScale = window.devicePixelRatio || 1;
        canvas.width = Math.floor(viewport.width * outputScale);
        canvas.height = Math.floor(viewport.height * outputScale);
        canvas.style.width = Math.floor(viewport.width) + 'px';
        canvas.style.height = Math.floor(viewport.height) + 'px';

        const renderContext = {
            canvasContext: context,
            viewport: viewport,
            transform: outputScale !== 1 ? [outputScale, 0, 0, outputScale, 0, 0] : null
        };

        await page.render(renderContext).promise;

        if (annotationDiv) {
            annotationDiv.innerHTML = '';
            const annotations = await page.getAnnotations();
            pdfjsLib.AnnotationLayer.render({
                viewport: viewport.clone({ dontFlip: true }),
                div: annotationDiv,
                annotations: annotations,
                page: page,
                linkService: {
                    externalLinkTarget: 2,
                    getDestinationHash: () => "#",
                    getAnchorUrl: (h) => h,
                },
            });
        }
    } catch (e) {
        console.error(`Error rendering page ${pageNum}:`, e);
    }
}

let observer = null;

function setupIntersectionObserver() {
    if (observer) observer.disconnect();

    const options = {
        root: pdfContainer.value,
        threshold: 0.3
    };

    observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const pageNum = parseInt(entry.target.getAttribute('data-page-number'));
                currentPage.value = pageNum;
            }
        });
    }, options);

    document.querySelectorAll('.pdf-page-wrapper').forEach(page => {
        observer.observe(page);
    });
}

onUnmounted(() => {
    if (observer) observer.disconnect();
});

function scrollToPage(pageNum) {
    const el = document.getElementById(`page-${pageNum}`);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
}

function previousPage() {
    if (currentPage.value > 1) scrollToPage(currentPage.value - 1);
}

function nextPage() {
    if (currentPage.value < totalPages.value) scrollToPage(currentPage.value + 1);
}

function zoomIn() {
    scale.value = Math.min(scale.value + 0.2, 3.0);
    renderAllPages();
}

function zoomOut() {
    scale.value = Math.max(scale.value - 0.2, 0.5);
    renderAllPages();
}

onMounted(() => {
    loadPDF();
});
</script>

<style scoped>
.safari-window {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    background: #ffffff;
    border-radius: 12px;
    overflow: hidden;
    box-shadow: 0 20px 70px rgba(0, 0, 0, 0.4);
}

.safari-window.mobile-mode {
    border-radius: 0;
    height: 100vh;
}

/* Header / Toolbar */
.safari-header {
    height: 52px;
    background: #f1f1f1;
    border-bottom: 0.5px solid #d1d1d1;
    display: flex;
    align-items: center;
    padding: 0 16px;
    gap: 20px;
    flex-shrink: 0;
    user-select: none;
}

.mobile-mode .safari-header {
    height: 60px;
    background: #f9f9f9;
    padding: 0 12px;
    gap: 12px;
    padding-top: env(safe-area-inset-top, 20px);
}

.window-controls {
    display: flex;
    gap: 8px;
    width: 60px;
}

.window-dot {
    width: 12px;
    height: 12px;
    border-radius: 50%;
    cursor: pointer;
}

.window-dot.close {
    background: #ff5f57;
}

.window-dot.minimize {
    background: #febc2e;
}

.window-dot.maximize {
    background: #28c840;
}

.safari-nav {
    display: flex;
    gap: 12px;
}

.nav-btn {
    background: none;
    border: none;
    color: #8c8c8c;
    cursor: pointer;
    padding: 4px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 4px;
}

.nav-btn:hover:not(:disabled) {
    background: rgba(0, 0, 0, 0.05);
}

.nav-btn:disabled {
    opacity: 0.3;
    cursor: default;
}

.url-bar {
    flex: 1;
    height: 28px;
    background: #e3e3e3;
    border-radius: 6px;
    display: flex;
    align-items: center;
    padding: 0 10px;
    gap: 8px;
    max-width: 600px;
    margin: 0 auto;
}

.mobile-mode .url-bar {
    max-width: none;
    height: 34px;
    background: #e8e8e8;
}

.security-icon {
    color: #8c8c8c;
}

.url-text {
    flex: 1;
    font-size: 13px;
    color: #333;
    text-align: center;
}

.refresh-icon {
    color: #8c8c8c;
    cursor: pointer;
}

.safari-extra {
    display: flex;
    gap: 16px;
    width: 120px;
    justify-content: flex-end;
}

.mobile-mode .safari-extra {
    width: auto;
}

.mobile-close-btn {
    background: none;
    border: none;
    color: #007aff;
    font-size: 16px;
    font-weight: 600;
    cursor: pointer;
}

/* Safari Tab Bar */
.safari-tabs {
    height: 32px;
    background: #f1f1f1;
    display: flex;
    align-items: flex-end;
    padding: 0 8px;
    gap: 1px;
    border-bottom: 0.5px solid #d1d1d1;
}

.safari-tab {
    height: 28px;
    background: #e3e3e3;
    border-radius: 6px 6px 0 0;
    padding: 0 12px;
    display: flex;
    align-items: center;
    gap: 8px;
    min-width: 180px;
    max-width: 240px;
    font-size: 12px;
    color: #666;
    border: 0.5px solid transparent;
    border-bottom: none;
}

.safari-tab.active {
    background: #fff;
    color: #333;
    box-shadow: 0 -2px 5px rgba(0, 0, 0, 0.05);
}

.tab-favicon {
    font-size: 14px;
}

.tab-title {
    flex: 1;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.tab-close {
    opacity: 0.5;
    padding: 2px;
    cursor: pointer;
    font-size: 14px;
}

.tab-close:hover {
    opacity: 1;
}

.new-tab-btn {
    width: 28px;
    height: 28px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #8c8c8c;
    font-size: 18px;
    cursor: pointer;
    border-radius: 4px;
}

.new-tab-btn:hover {
    background: rgba(0, 0, 0, 0.05);
}

/* PDF Internal Toolbar */
.pdf-internal-toolbar {
    height: 44px;
    background: #f8f8f8;
    border-bottom: 0.5px solid #d1d1d1;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 20px;
    flex-shrink: 0;
}

.pdf-pages,
.pdf-zoom {
    display: flex;
    align-items: center;
    gap: 12px;
}

.page-btn {
    background: #fff;
    border: 0.5px solid #d1d1d1;
    border-radius: 4px;
    padding: 2px 10px;
    font-size: 14px;
    cursor: pointer;
}

.page-btn:disabled {
    opacity: 0.5;
}

.page-count,
.zoom-level {
    font-size: 13px;
    color: #666;
    min-width: 50px;
    text-align: center;
}

/* Browser Body */
.browser-body {
    flex: 1;
    background: #525659;
    overflow: auto;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 20px;
    -webkit-overflow-scrolling: touch;
}

.pdf-pages-list {
    padding: 40px 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 30px;
}

.pdf-page-wrapper {
    position: relative;
    background: #fff;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
}

.mobile-mode .browser-body {
    padding: 10px;
}

canvas {
    display: block;
    width: 100%;
    height: 100%;
}

/* Annotation Layer Styles - Essential for clickable links */
:deep(.annotationLayer) {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    pointer-events: none;
}

:deep(.annotationLayer) a,
:deep(.annotationLayer) section {
    position: absolute;
    pointer-events: auto;
}

:deep(.annotationLayer) a:hover {
    background: rgba(255, 255, 0, 0.1);
}

.pdf-loader {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 15px;
    color: #fff;
}

.pdf-error {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 15px;
    color: #ff5f57;
}

.error-msg {
    font-size: 14px;
    background: rgba(0, 0, 0, 0.5);
    padding: 10px 20px;
    border-radius: 8px;
}

.retry-btn {
    background: #007aff;
    color: white;
    border: none;
    padding: 8px 16px;
    border-radius: 4px;
    cursor: pointer;
}

.spinner {
    width: 30px;
    height: 30px;
    border: 3px solid rgba(255, 255, 255, 0.3);
    border-top-color: #fff;
    border-radius: 50%;
    animation: spin 1s linear infinite;
}

@keyframes spin {
    to {
        transform: rotate(360deg);
    }
}

/* Mobile Bottom Bar */
.mobile-bottom-bar {
    height: 80px;
    background: rgba(249, 249, 249, 0.94);
    backdrop-filter: blur(10px);
    border-top: 0.5px solid #d1d1d1;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 24px 30px;
    /* Account for home indicator */
    flex-shrink: 0;
}

.mob-nav-btn {
    background: none;
    border: none;
    color: #007aff;
    padding: 8px;
}

.desktop-only {
    display: flex;
}

@media (max-width: 768px) {
    .desktop-only {
        display: none;
    }
}
</style>
