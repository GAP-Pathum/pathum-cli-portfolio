<template>
    <div class="pdf-viewer-window">
        <div class="pdf-header" @mousedown="$emit('startDrag', $event)">
            <div class="window-controls">
                <span class="window-dot close" @click.stop="$emit('close')"></span>
                <span class="window-dot minimize" @click.stop="$emit('minimize')"></span>
                <span class="window-dot maximize" @click.stop="$emit('toggleMaximize')"></span>
            </div>
            <div class="window-title">Resume — Pasindu Pathum</div>
            <div class="pdf-controls">
                <button @click="previousPage" :disabled="currentPage <= 1" class="pdf-btn">←</button>
                <span class="page-info">{{ currentPage }} / {{ totalPages }}</span>
                <button @click="nextPage" :disabled="currentPage >= totalPages" class="pdf-btn">→</button>
                <button @click="zoomOut" class="pdf-btn">-</button>
                <span class="zoom-info">{{ Math.round(scale * 100) }}%</span>
                <button @click="zoomIn" class="pdf-btn">+</button>
            </div>
        </div>
        <div class="pdf-body" ref="pdfContainer">
            <canvas ref="pdfCanvas"></canvas>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import * as pdfjsLib from 'pdfjs-dist';
import pdfjsWorker from 'pdfjs-dist/build/pdf.worker.min.mjs?url';
// Use the single canonical PDF in public/documents
// Path served as `/documents/resume.pdf`
const pdfFile = '/documents/resume.pdf';

const emit = defineEmits(['close', 'minimize', 'toggleMaximize', 'startDrag']);

// PDF.js worker
pdfjsLib.GlobalWorkerOptions.workerSrc = pdfjsWorker;

const pdfCanvas = ref(null);
const pdfContainer = ref(null);
const pdfDoc = ref(null);
const currentPage = ref(1);
const totalPages = ref(0);
const scale = ref(1.0);

async function loadPDF() {
    try {
        // Try loading by URL but disable range requests (some dev servers mishandle Range)
        try {
            const loadingTask = pdfjsLib.getDocument({ url: pdfFile, disableRange: true, verbosity: 0 });
            pdfDoc.value = await loadingTask.promise;
        } catch (urlErr) {
            console.warn('pdfjs getDocument(url) failed, falling back to fetch:', urlErr);

            // Fallback: fetch entire file as ArrayBuffer and pass it to pdf.js
            const resp = await fetch(pdfFile);
            if (!resp.ok) throw new Error(`Network error fetching PDF: ${resp.status}`);
            const arrayBuffer = await resp.arrayBuffer();
            const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
            pdfDoc.value = await loadingTask.promise;
        }

        totalPages.value = pdfDoc.value.numPages;
        renderPage(currentPage.value);
    } catch (error) {
        console.error('Error loading PDF:', error);
        alert('Failed to load PDF: ' + (error && error.message ? error.message : error));
    }
}

async function renderPage(pageNum) {
    if (!pdfDoc.value || !pdfCanvas.value) return;
    
    try {
        const page = await pdfDoc.value.getPage(pageNum);
        const canvas = pdfCanvas.value;
        const context = canvas.getContext('2d');
        
        // Get container dimensions
        const container = pdfContainer.value;
        const containerWidth = container.clientWidth - 40; // Account for padding
        const containerHeight = container.clientHeight - 40;
        
        // Get page viewport at scale 1 first
        const viewport1 = page.getViewport({ scale: 1 });
        
        // Calculate scale to fit container
        const scaleX = containerWidth / viewport1.width;
        const scaleY = containerHeight / viewport1.height;
        const autoScale = Math.min(scaleX, scaleY) * 0.95; // 95% to add some margin
        
        // Apply user's scale on top of auto-fit
        const finalScale = autoScale * scale.value;
        
        const viewport = page.getViewport({ scale: finalScale });
        
        // Set canvas dimensions
        const outputScale = window.devicePixelRatio || 1;
        canvas.width = Math.floor(viewport.width * outputScale);
        canvas.height = Math.floor(viewport.height * outputScale);
        canvas.style.width = Math.floor(viewport.width) + 'px';
        canvas.style.height = Math.floor(viewport.height) + 'px';
        
        const transform = outputScale !== 1 ? [outputScale, 0, 0, outputScale, 0, 0] : null;
        
        const renderContext = {
            canvasContext: context,
            viewport: viewport,
            transform: transform
        };
        
        await page.render(renderContext).promise;
    } catch (error) {
        console.error('Error rendering page:', error);
    }
}

function previousPage() {
    if (currentPage.value <= 1) return;
    currentPage.value--;
    renderPage(currentPage.value);
}

function nextPage() {
    if (currentPage.value >= totalPages.value) return;
    currentPage.value++;
    renderPage(currentPage.value);
}

function zoomIn() {
    scale.value = Math.min(scale.value + 0.2, 2.5);
    renderPage(currentPage.value);
}

function zoomOut() {
    scale.value = Math.max(scale.value - 0.2, 0.5);
    renderPage(currentPage.value);
}

onMounted(() => {
    loadPDF();
});
</script>

<style scoped>
.pdf-viewer-window {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    background: #2c2c2c;
    border-radius: 10px;
    overflow: hidden;
}

.pdf-header {
    height: 36px;
    background: rgba(40, 40, 58, 0.95);
    border-bottom: 1px solid rgba(255, 255, 255, 0.08);
    display: flex;
    align-items: center;
    padding: 0 12px;
    cursor: move;
    user-select: none;
    flex-shrink: 0;
    gap: 12px;
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
    color: rgba(255, 255, 255, 0.7);
    font-size: 13px;
    font-weight: 500;
}

.pdf-controls {
    display: flex;
    align-items: center;
    gap: 8px;
}

.pdf-btn {
    background: rgba(255, 255, 255, 0.1);
    border: 1px solid rgba(255, 255, 255, 0.1);
    color: rgba(255, 255, 255, 0.8);
    padding: 4px 10px;
    border-radius: 4px;
    cursor: pointer;
    font-size: 12px;
    transition: all 0.2s;
}

.pdf-btn:hover:not(:disabled) {
    background: rgba(255, 255, 255, 0.15);
}

.pdf-btn:disabled {
    opacity: 0.3;
    cursor: not-allowed;
}

.page-info,
.zoom-info {
    color: rgba(255, 255, 255, 0.6);
    font-size: 12px;
    min-width: 60px;
    text-align: center;
}

.pdf-body {
    flex: 1;
    background: #525659;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: auto;
    padding: 20px;
}

canvas {
    background: white;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
}
</style>
