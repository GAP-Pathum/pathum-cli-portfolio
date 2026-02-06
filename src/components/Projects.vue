<template>
    <div class="projects-wrapper" :class="{ 'desktop-mode': isDesktopMode, 'mobile-mode': isMobileMode }">
        <!-- Desktop Mode: macOS Finder Style -->
        <div v-if="isDesktopMode" class="projects-desktop">
            <!-- Toolbar -->
            <div class="projects-toolbar">
                <div class="toolbar-left">
                    <button class="toolbar-btn" @click="goBack" :disabled="!canGoBack">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z" />
                        </svg>
                    </button>
                    <button class="toolbar-btn" @click="goForward" :disabled="!canGoForward">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z" />
                        </svg>
                    </button>
                    <div class="breadcrumbs">
                        <span class="breadcrumb-item" @click="navigateToRoot">Projects</span>
                        <span v-if="currentProject" class="breadcrumb-separator">›</span>
                        <span v-if="currentProject" class="breadcrumb-item active">{{ currentProject.name }}</span>
                        <span v-if="currentView === 'images'" class="breadcrumb-separator">›</span>
                        <span v-if="currentView === 'images'" class="breadcrumb-item active">Images</span>
                    </div>
                </div>
                <div class="toolbar-right">
                    <div class="view-switcher">
                        <button class="view-btn" :class="{ active: viewMode === 'grid' }" @click="viewMode = 'grid'"
                            title="Grid View">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M3 3h8v8H3V3zm10 0h8v8h-8V3zM3 13h8v8H3v-8zm10 0h8v8h-8v-8z" />
                            </svg>
                        </button>
                        <button class="view-btn" :class="{ active: viewMode === 'list' }" @click="viewMode = 'list'"
                            title="List View">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                                <path
                                    d="M3 5h2v2H3V5zm4 0h14v2H7V5zM3 11h2v2H3v-2zm4 0h14v2H7v-2zM3 17h2v2H3v-2zm4 0h14v2H7v-2z" />
                            </svg>
                        </button>
                    </div>
                    <div class="search-box">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                            <path
                                d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" />
                        </svg>
                        <input type="text" placeholder="Search Projects" v-model="searchQuery" />
                    </div>
                </div>
            </div>

            <!-- Content Area -->
            <div class="projects-content">
                <!-- Grid View: Project List -->
                <div v-if="currentView === 'projects' && viewMode === 'grid'" class="projects-grid">
                    <div v-for="project in filteredProjects" :key="project.id" class="project-card"
                        @click="selectProject(project)" :style="{ '--project-color': project.color }">
                        <div class="project-icon">{{ project.icon }}</div>
                        <div class="project-name">{{ project.name }}</div>
                        <div class="project-type">{{ project.type }}</div>
                    </div>
                </div>

                <!-- List View: Project List -->
                <div v-if="currentView === 'projects' && viewMode === 'list'" class="projects-list">
                    <div class="list-header">
                        <div class="list-col-name">Name</div>
                        <div class="list-col-type">Type</div>
                        <div class="list-col-tech">Technologies</div>
                        <div class="list-col-status">Status</div>
                        <div class="list-col-date">Date</div>
                    </div>
                    <div v-for="project in filteredProjects" :key="project.id" class="list-row"
                        @click="selectProject(project)">
                        <div class="list-col-name">
                            <span class="list-icon">{{ project.icon }}</span>
                            <span>{{ project.name }}</span>
                        </div>
                        <div class="list-col-type">{{ project.type }}</div>
                        <div class="list-col-tech">
                            <span class="tech-badge" v-for="(tech, i) in project.tech.slice(0, 3)" :key="i">{{ tech
                                }}</span>
                            <span v-if="project.tech.length > 3" class="tech-more">+{{ project.tech.length - 3 }}</span>
                        </div>
                        <div class="list-col-status">
                            <span class="status-badge" :class="project.status.toLowerCase().replace(' ', '-')">{{
                                project.status }}</span>
                        </div>
                        <div class="list-col-date">{{ project.date }}</div>
                    </div>
                </div>

                <!-- Project Detail View -->
                <div v-if="currentView === 'project-detail'" class="project-detail">
                    <div class="detail-header">
                        <div class="detail-icon" :style="{ background: currentProject.color }">{{ currentProject.icon }}
                        </div>
                        <div class="detail-info">
                            <h2>{{ currentProject.name }}</h2>
                            <p class="detail-description">{{ currentProject.description }}</p>
                            <div class="detail-meta">
                                <span class="meta-item"><strong>Category:</strong> {{ currentProject.category }}</span>
                                <span class="meta-item"><strong>Status:</strong> {{ currentProject.status }}</span>
                                <span class="meta-item"><strong>Date:</strong> {{ currentProject.date }}</span>
                            </div>
                            <div class="detail-tech">
                                <span class="tech-tag" v-for="tech in currentProject.tech" :key="tech">{{ tech }}</span>
                            </div>
                            <div class="detail-actions">
                                <button v-if="currentProject.github" class="action-btn primary"
                                    @click="openLink(currentProject.github)">
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                                        <path
                                            d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                                    </svg>
                                    GitHub
                                </button>
                                <button v-if="currentProject.demo" class="action-btn primary"
                                    @click="openLink(currentProject.demo)">
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                                        <path
                                            d="M19 19H5V5h7V3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2v-7h-2v7zM14 3v2h3.59l-9.83 9.83 1.41 1.41L19 6.41V10h2V3h-7z" />
                                    </svg>
                                    Live Demo
                                </button>
                                <button class="action-btn" @click="showReadme">
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                                        <path
                                            d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z" />
                                    </svg>
                                    README
                                </button>
                                <button v-if="currentProject.images.length > 0" class="action-btn" @click="viewImages">
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                                        <path
                                            d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z" />
                                    </svg>
                                    Images ({{ currentProject.images.length }})
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Images Gallery View -->
                <div v-if="currentView === 'images'" class="images-gallery">
                    <div class="gallery-grid">
                        <div v-for="image in currentProject.images" :key="image.id" class="gallery-item"
                            @click="openLightbox(image)">
                            <div class="gallery-thumbnail">
                                <div class="placeholder-image" :style="{ background: currentProject.color }">
                                    <svg width="48" height="48" viewBox="0 0 24 24" fill="white" opacity="0.7">
                                        <path
                                            d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z" />
                                    </svg>
                                    <span class="placeholder-text">{{ image.alt }}</span>
                                </div>
                            </div>
                            <div class="gallery-name">{{ image.name }}</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Mobile Mode: iOS Files Style -->
        <div v-if="isMobileMode" class="projects-mobile">
            <!-- Mobile Header -->
            <div class="mobile-header">
                <button v-if="currentView !== 'projects'" class="mobile-back" @click="goBack">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z" />
                    </svg>
                </button>
                <h1 class="mobile-title">
                    <span v-if="currentView === 'projects'">Projects</span>
                    <span v-else-if="currentView === 'project-detail'">{{ currentProject.name }}</span>
                    <span v-else-if="currentView === 'images'">Images</span>
                </h1>
                <button class="mobile-search" @click="toggleSearch">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                        <path
                            d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" />
                    </svg>
                </button>
            </div>

            <!-- Mobile Search Bar -->
            <div v-if="showSearchBar" class="mobile-search-bar">
                <input type="text" placeholder="Search Projects" v-model="searchQuery" />
            </div>

            <!-- Mobile Content -->
            <div class="mobile-content">
                <!-- Projects List -->
                <div v-if="currentView === 'projects'" class="mobile-projects-list">
                    <div v-for="project in filteredProjects" :key="project.id" class="mobile-project-card"
                        @click="selectProject(project)">
                        <div class="mobile-project-icon" :style="{ background: project.color }">{{ project.icon }}</div>
                        <div class="mobile-project-info">
                            <div class="mobile-project-name">{{ project.name }}</div>
                            <div class="mobile-project-meta">{{ project.type }} • {{ project.date }}</div>
                        </div>
                        <svg class="mobile-chevron" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z" />
                        </svg>
                    </div>
                </div>

                <!-- Project Detail -->
                <div v-if="currentView === 'project-detail'" class="mobile-project-detail">
                    <div class="mobile-detail-header">
                        <div class="mobile-detail-icon" :style="{ background: currentProject.color }">{{
                            currentProject.icon }}</div>
                        <h2>{{ currentProject.name }}</h2>
                        <p>{{ currentProject.description }}</p>
                    </div>

                    <div class="mobile-detail-section">
                        <div class="mobile-meta-grid">
                            <div class="mobile-meta-item">
                                <span class="mobile-meta-label">Category</span>
                                <span class="mobile-meta-value">{{ currentProject.category }}</span>
                            </div>
                            <div class="mobile-meta-item">
                                <span class="mobile-meta-label">Status</span>
                                <span class="mobile-meta-value">
                                    <span class="status-badge"
                                        :class="currentProject.status.toLowerCase().replace(' ', '-')">{{
                                        currentProject.status }}</span>
                                </span>
                            </div>
                            <div class="mobile-meta-item">
                                <span class="mobile-meta-label">Date</span>
                                <span class="mobile-meta-value">{{ currentProject.date }}</span>
                            </div>
                        </div>
                    </div>

                    <div class="mobile-detail-section">
                        <h3>Technologies</h3>
                        <div class="mobile-tech-grid">
                            <span class="mobile-tech-tag" v-for="tech in currentProject.tech" :key="tech">{{ tech
                                }}</span>
                        </div>
                    </div>

                    <div class="mobile-detail-section">
                        <h3>Actions</h3>
                        <div class="mobile-actions">
                            <button class="mobile-action-btn" @click="showReadme">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                                    <path
                                        d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z" />
                                </svg>
                                <span>View README</span>
                            </button>
                            <button v-if="currentProject.images.length > 0" class="mobile-action-btn"
                                @click="viewImages">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                                    <path
                                        d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z" />
                                </svg>
                                <span>Images ({{ currentProject.images.length }})</span>
                            </button>
                            <button v-if="currentProject.github" class="mobile-action-btn"
                                @click="openLink(currentProject.github)">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                                    <path
                                        d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                                </svg>
                                <span>View on GitHub</span>
                            </button>
                            <button v-if="currentProject.demo" class="mobile-action-btn"
                                @click="openLink(currentProject.demo)">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                                    <path
                                        d="M19 19H5V5h7V3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2v-7h-2v7zM14 3v2h3.59l-9.83 9.83 1.41 1.41L19 6.41V10h2V3h-7z" />
                                </svg>
                                <span>Live Demo</span>
                            </button>
                        </div>
                    </div>
                </div>

                <!-- Images Gallery -->
                <div v-if="currentView === 'images'" class="mobile-images-gallery">
                    <div v-for="image in currentProject.images" :key="image.id" class="mobile-gallery-item"
                        @click="openLightbox(image)">
                        <div class="mobile-gallery-thumbnail">
                            <div class="placeholder-image" :style="{ background: currentProject.color }">
                                <svg width="40" height="40" viewBox="0 0 24 24" fill="white" opacity="0.7">
                                    <path
                                        d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z" />
                                </svg>
                                <span class="placeholder-text">{{ image.alt }}</span>
                            </div>
                        </div>
                        <div class="mobile-gallery-name">{{ image.name }}</div>
                    </div>
                </div>
            </div>
        </div>

        <!-- README Modal (macOS Notes Style) -->
        <div v-if="readmeOpen" class="readme-overlay" @click.self="closeReadme">
            <div class="readme-modal">
                <div class="readme-header">
                    <div class="readme-title">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                            <path
                                d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z" />
                        </svg>
                        <span>{{ currentProject?.name }} - README.md</span>
                    </div>
                    <button class="readme-close" @click="closeReadme">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                            <path
                                d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
                        </svg>
                    </button>
                </div>
                <div class="readme-content" v-html="formattedReadme"></div>
            </div>
        </div>

        <!-- Image Lightbox -->
        <div v-if="lightboxOpen" class="lightbox-overlay" @click.self="closeLightbox">
            <div class="lightbox-content">
                <button class="lightbox-close" @click="closeLightbox">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="white">
                        <path
                            d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
                    </svg>
                </button>
                <div class="lightbox-image">
                    <div class="placeholder-lightbox" :style="{ background: currentProject?.color }">
                        <svg width="80" height="80" viewBox="0 0 24 24" fill="white" opacity="0.7">
                            <path
                                d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z" />
                        </svg>
                        <p class="lightbox-alt">{{ selectedImage?.alt }}</p>
                    </div>
                </div>
                <div class="lightbox-caption">{{ selectedImage?.name }}</div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { projects } from '../data/projects.js';

const props = defineProps({
    isDesktopMode: { type: Boolean, default: true },
    isMobileMode: { type: Boolean, default: false }
});

const emit = defineEmits(['close']);

// State
const currentView = ref('projects'); // 'projects', 'project-detail', 'images'
const currentProject = ref(null);
const selectedImage = ref(null);
const viewMode = ref('grid'); // 'grid', 'list'
const searchQuery = ref('');
const readmeOpen = ref(false);
const lightboxOpen = ref(false);
const showSearchBar = ref(false);
const navigationHistory = ref([]);
const historyIndex = ref(-1);

// Computed
const filteredProjects = computed(() => {
    if (!searchQuery.value) return projects;
    const query = searchQuery.value.toLowerCase();
    return projects.filter(p =>
        p.name.toLowerCase().includes(query) ||
        p.description.toLowerCase().includes(query) ||
        p.tech.some(t => t.toLowerCase().includes(query))
    );
});

const canGoBack = computed(() => historyIndex.value > 0);
const canGoForward = computed(() => historyIndex.value < navigationHistory.value.length - 1);

const formattedReadme = computed(() => {
    if (!currentProject.value?.readme) return '';
    // Simple markdown-to-HTML conversion
    let html = currentProject.value.readme;

    // Headers
    html = html.replace(/^### (.*$)/gim, '<h3>$1</h3>');
    html = html.replace(/^## (.*$)/gim, '<h2>$1</h2>');
    html = html.replace(/^# (.*$)/gim, '<h1>$1</h1>');

    // Bold
    html = html.replace(/\*\*(.*?)\*\*/gim, '<strong>$1</strong>');

    // Lists
    html = html.replace(/^\- (.*$)/gim, '<li>$1</li>');
    html = html.replace(/^(\d+)\. (.*$)/gim, '<li>$2</li>');

    // Wrap lists
    html = html.replace(/(<li>.*<\/li>)/s, '<ul>$1</ul>');

    // Line breaks
    html = html.replace(/\n/gim, '<br>');

    return html;
});

// Navigation
function addToHistory(view, project = null) {
    // Remove forward history
    if (historyIndex.value < navigationHistory.value.length - 1) {
        navigationHistory.value = navigationHistory.value.slice(0, historyIndex.value + 1);
    }
    navigationHistory.value.push({ view, project });
    historyIndex.value++;
}

function goBack() {
    if (canGoBack.value) {
        historyIndex.value--;
        const state = navigationHistory.value[historyIndex.value];
        currentView.value = state.view;
        currentProject.value = state.project;
    }
}

function goForward() {
    if (canGoForward.value) {
        historyIndex.value++;
        const state = navigationHistory.value[historyIndex.value];
        currentView.value = state.view;
        currentProject.value = state.project;
    }
}

function navigateToRoot() {
    currentView.value = 'projects';
    currentProject.value = null;
    addToHistory('projects');
}

function selectProject(project) {
    currentProject.value = project;
    currentView.value = 'project-detail';
    addToHistory('project-detail', project);
}

function viewImages() {
    currentView.value = 'images';
    addToHistory('images', currentProject.value);
}

// Modals
function showReadme() {
    readmeOpen.value = true;
}

function closeReadme() {
    readmeOpen.value = false;
}

function openLightbox(image) {
    selectedImage.value = image;
    lightboxOpen.value = true;
}

function closeLightbox() {
    lightboxOpen.value = false;
    selectedImage.value = null;
}

function openLink(url) {
    window.open(url, '_blank');
}

function toggleSearch() {
    showSearchBar.value = !showSearchBar.value;
}

// Initialize
addToHistory('projects');
</script>

<style scoped>
/* Base Styles */
.projects-wrapper {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    background: linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(248, 250, 252, 0.95) 100%);
    color: #1a1a1a;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Helvetica', 'Arial', sans-serif;
    overflow: hidden;
}

/* Desktop Mode */
.projects-desktop {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
}

/* Toolbar */
.projects-toolbar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 8px 16px;
    background: rgba(255, 255, 255, 0.8);
    backdrop-filter: blur(20px);
    border-bottom: 1px solid rgba(0, 0, 0, 0.08);
    height: 48px;
    flex-shrink: 0;
}

.toolbar-left {
    display: flex;
    align-items: center;
    gap: 8px;
}

.toolbar-btn {
    width: 28px;
    height: 28px;
    border-radius: 6px;
    border: none;
    background: rgba(0, 0, 0, 0.04);
    color: #333;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.2s;
}

.toolbar-btn:hover:not(:disabled) {
    background: rgba(0, 0, 0, 0.08);
}

.toolbar-btn:disabled {
    opacity: 0.3;
    cursor: not-allowed;
}

.breadcrumbs {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 13px;
    margin-left: 8px;
}

.breadcrumb-item {
    color: #666;
    cursor: pointer;
    transition: color 0.2s;
}

.breadcrumb-item:hover {
    color: #007AFF;
}

.breadcrumb-item.active {
    color: #1a1a1a;
    font-weight: 500;
    cursor: default;
}

.breadcrumb-separator {
    color: #999;
    font-size: 12px;
}

.toolbar-right {
    display: flex;
    align-items: center;
    gap: 12px;
}

.view-switcher {
    display: flex;
    gap: 4px;
    background: rgba(0, 0, 0, 0.04);
    border-radius: 6px;
    padding: 2px;
}

.view-btn {
    width: 28px;
    height: 28px;
    border: none;
    background: transparent;
    color: #666;
    border-radius: 5px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.2s;
}

.view-btn:hover {
    background: rgba(0, 0, 0, 0.06);
}

.view-btn.active {
    background: white;
    color: #007AFF;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.search-box {
    display: flex;
    align-items: center;
    gap: 6px;
    background: rgba(0, 0, 0, 0.04);
    border-radius: 6px;
    padding: 6px 12px;
    min-width: 200px;
}

.search-box svg {
    color: #999;
}

.search-box input {
    border: none;
    background: transparent;
    outline: none;
    font-size: 13px;
    color: #333;
    width: 100%;
}

.search-box input::placeholder {
    color: #999;
}

/* Content Area */
.projects-content {
    flex: 1;
    overflow-y: auto;
    padding: 20px;
}

/* Grid View */
.projects-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
    gap: 20px;
    padding: 10px;
}

.project-card {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 20px;
    border-radius: 12px;
    background: white;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
    cursor: pointer;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    position: relative;
    overflow: hidden;
}

.project-card::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: var(--project-color, #007AFF);
    transform: scaleX(0);
    transition: transform 0.3s;
}

.project-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.12);
}

.project-card:hover::before {
    transform: scaleX(1);
}

.project-icon {
    font-size: 48px;
    margin-bottom: 12px;
}

.project-name {
    font-size: 14px;
    font-weight: 500;
    text-align: center;
    margin-bottom: 4px;
    color: #1a1a1a;
}

.project-type {
    font-size: 12px;
    color: #666;
    text-align: center;
}

/* List View */
.projects-list {
    background: white;
    border-radius: 10px;
    overflow: hidden;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

.list-header {
    display: grid;
    grid-template-columns: 2fr 1fr 2fr 0.8fr 0.6fr;
    gap: 16px;
    padding: 12px 20px;
    background: rgba(0, 0, 0, 0.02);
    border-bottom: 1px solid rgba(0, 0, 0, 0.06);
    font-size: 12px;
    font-weight: 600;
    color: #666;
    text-transform: uppercase;
    letter-spacing: 0.5px;
}

.list-row {
    display: grid;
    grid-template-columns: 2fr 1fr 2fr 0.8fr 0.6fr;
    gap: 16px;
    padding: 14px 20px;
    border-bottom: 1px solid rgba(0, 0, 0, 0.04);
    cursor: pointer;
    transition: background 0.2s;
    align-items: center;
}

.list-row:hover {
    background: rgba(0, 122, 255, 0.04);
}

.list-row:last-child {
    border-bottom: none;
}

.list-col-name {
    display: flex;
    align-items: center;
    gap: 10px;
    font-weight: 500;
    color: #1a1a1a;
}

.list-icon {
    font-size: 24px;
}

.list-col-type,
.list-col-date {
    color: #666;
    font-size: 13px;
}

.list-col-tech {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
}

.tech-badge {
    padding: 3px 8px;
    background: rgba(0, 122, 255, 0.1);
    color: #007AFF;
    border-radius: 4px;
    font-size: 11px;
    font-weight: 500;
}

.tech-more {
    padding: 3px 8px;
    background: rgba(0, 0, 0, 0.05);
    color: #666;
    border-radius: 4px;
    font-size: 11px;
}

.status-badge {
    padding: 4px 10px;
    border-radius: 12px;
    font-size: 11px;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.5px;
}

.status-badge.completed {
    background: rgba(52, 199, 89, 0.15);
    color: #34C759;
}

.status-badge.in-progress {
    background: rgba(255, 149, 0, 0.15);
    color: #FF9500;
}

.status-badge.archived {
    background: rgba(142, 142, 147, 0.15);
    color: #8E8E93;
}

/* Project Detail */
.project-detail {
    max-width: 900px;
    margin: 0 auto;
}

.detail-header {
    background: white;
    border-radius: 12px;
    padding: 32px;
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
    display: flex;
    gap: 24px;
}

.detail-icon {
    width: 80px;
    height: 80px;
    border-radius: 16px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 40px;
    flex-shrink: 0;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.detail-info {
    flex: 1;
}

.detail-info h2 {
    margin: 0 0 12px 0;
    font-size: 28px;
    font-weight: 600;
    color: #1a1a1a;
}

.detail-description {
    margin: 0 0 16px 0;
    color: #666;
    font-size: 15px;
    line-height: 1.6;
}

.detail-meta {
    display: flex;
    flex-wrap: wrap;
    gap: 16px;
    margin-bottom: 16px;
    font-size: 13px;
}

.meta-item {
    color: #666;
}

.meta-item strong {
    color: #1a1a1a;
}

.detail-tech {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    margin-bottom: 20px;
}

.tech-tag {
    padding: 6px 12px;
    background: linear-gradient(135deg, rgba(0, 122, 255, 0.1) 0%, rgba(88, 86, 214, 0.1) 100%);
    color: #007AFF;
    border-radius: 6px;
    font-size: 12px;
    font-weight: 500;
}

.detail-actions {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
}

.action-btn {
    padding: 10px 18px;
    border: none;
    border-radius: 8px;
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 8px;
    transition: all 0.2s;
    background: rgba(0, 0, 0, 0.04);
    color: #333;
}

.action-btn.primary {
    background: linear-gradient(135deg, #007AFF 0%, #5856D6 100%);
    color: white;
    box-shadow: 0 2px 8px rgba(0, 122, 255, 0.3);
}

.action-btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

/* Images Gallery */
.images-gallery {
    max-width: 1200px;
    margin: 0 auto;
}

.gallery-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    gap: 20px;
}

.gallery-item {
    cursor: pointer;
    border-radius: 12px;
    overflow: hidden;
    background: white;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
    transition: all 0.3s;
}

.gallery-item:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.12);
}

.gallery-thumbnail {
    aspect-ratio: 16/10;
    overflow: hidden;
}

.placeholder-image {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 12px;
    padding: 20px;
    text-align: center;
}

.placeholder-text {
    color: white;
    font-size: 13px;
    font-weight: 500;
    opacity: 0.9;
}

.gallery-name {
    padding: 12px 16px;
    font-size: 14px;
    font-weight: 500;
    color: #1a1a1a;
}

/* Mobile Mode */
.projects-mobile {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    background: #f5f5f7;
}

.mobile-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 12px 16px;
    background: rgba(255, 255, 255, 0.95);
    backdrop-filter: blur(20px);
    border-bottom: 1px solid rgba(0, 0, 0, 0.08);
    min-height: 56px;
}

.mobile-back {
    width: 36px;
    height: 36px;
    border: none;
    background: transparent;
    color: #007AFF;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 8px;
}

.mobile-back:active {
    background: rgba(0, 0, 0, 0.05);
}

.mobile-title {
    font-size: 17px;
    font-weight: 600;
    color: #1a1a1a;
    flex: 1;
    text-align: center;
    margin: 0;
}

.mobile-search {
    width: 36px;
    height: 36px;
    border: none;
    background: transparent;
    color: #007AFF;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 8px;
}

.mobile-search:active {
    background: rgba(0, 0, 0, 0.05);
}

.mobile-search-bar {
    padding: 8px 16px;
    background: white;
    border-bottom: 1px solid rgba(0, 0, 0, 0.08);
}

.mobile-search-bar input {
    width: 100%;
    padding: 10px 16px;
    border: none;
    background: rgba(0, 0, 0, 0.04);
    border-radius: 10px;
    font-size: 16px;
    outline: none;
}

.mobile-content {
    flex: 1;
    overflow-y: auto;
    -webkit-overflow-scrolling: touch;
}

.mobile-projects-list {
    padding: 0;
}

.mobile-project-card {
    display: flex;
    align-items: center;
    gap: 16px;
    padding: 16px;
    background: white;
    border-bottom: 1px solid rgba(0, 0, 0, 0.06);
    cursor: pointer;
    transition: background 0.2s;
}

.mobile-project-card:active {
    background: rgba(0, 0, 0, 0.02);
}

.mobile-project-icon {
    width: 56px;
    height: 56px;
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 28px;
    flex-shrink: 0;
}

.mobile-project-info {
    flex: 1;
    min-width: 0;
}

.mobile-project-name {
    font-size: 16px;
    font-weight: 500;
    color: #1a1a1a;
    margin-bottom: 4px;
}

.mobile-project-meta {
    font-size: 13px;
    color: #666;
}

.mobile-chevron {
    color: #c7c7cc;
    flex-shrink: 0;
}

.mobile-project-detail {
    padding: 20px 16px;
}

.mobile-detail-header {
    text-align: center;
    margin-bottom: 24px;
    background: white;
    padding: 24px;
    border-radius: 16px;
}

.mobile-detail-icon {
    width: 80px;
    height: 80px;
    border-radius: 16px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 40px;
    margin: 0 auto 16px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.mobile-detail-header h2 {
    font-size: 24px;
    font-weight: 600;
    margin: 0 0 12px 0;
    color: #1a1a1a;
}

.mobile-detail-header p {
    font-size: 15px;
    color: #666;
    line-height: 1.5;
    margin: 0;
}

.mobile-detail-section {
    background: white;
    padding: 20px;
    border-radius: 16px;
    margin-bottom: 16px;
}

.mobile-detail-section h3 {
    font-size: 18px;
    font-weight: 600;
    margin: 0 0 16px 0;
    color: #1a1a1a;
}

.mobile-meta-grid {
    display: grid;
    gap: 16px;
}

.mobile-meta-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-bottom: 12px;
    border-bottom: 1px solid rgba(0, 0, 0, 0.06);
}

.mobile-meta-item:last-child {
    border-bottom: none;
    padding-bottom: 0;
}

.mobile-meta-label {
    font-size: 14px;
    color: #666;
}

.mobile-meta-value {
    font-size: 14px;
    color: #1a1a1a;
    font-weight: 500;
}

.mobile-tech-grid {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
}

.mobile-tech-tag {
    padding: 8px 14px;
    background: rgba(0, 122, 255, 0.1);
    color: #007AFF;
    border-radius: 8px;
    font-size: 13px;
    font-weight: 500;
}

.mobile-actions {
    display: flex;
    flex-direction: column;
    gap: 12px;
}

.mobile-action-btn {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 14px 16px;
    background: rgba(0, 122, 255, 0.08);
    border: none;
    border-radius: 12px;
    font-size: 15px;
    font-weight: 500;
    color: #007AFF;
    cursor: pointer;
    transition: all 0.2s;
}

.mobile-action-btn:active {
    transform: scale(0.98);
    background: rgba(0, 122, 255, 0.15);
}

.mobile-images-gallery {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 12px;
    padding: 16px;
}

.mobile-gallery-item {
    background: white;
    border-radius: 12px;
    overflow: hidden;
    cursor: pointer;
}

.mobile-gallery-thumbnail {
    aspect-ratio: 1;
}

.mobile-gallery-name {
    padding: 10px 12px;
    font-size: 13px;
    font-weight: 500;
    color: #1a1a1a;
}

/* README Modal */
.readme-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    backdrop-filter: blur(10px);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 10000;
    padding: 20px;
}

.readme-modal {
    background: white;
    border-radius: 12px;
    max-width: 800px;
    max-height: 90vh;
    width: 100%;
    display: flex;
    flex-direction: column;
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
    overflow: hidden;
}

.readme-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 16px 20px;
    border-bottom: 1px solid rgba(0, 0, 0, 0.08);
    background: rgba(0, 0, 0, 0.02);
}

.readme-title {
    display: flex;
    align-items: center;
    gap: 10px;
    font-size: 15px;
    font-weight: 600;
    color: #1a1a1a;
}

.readme-close {
    width: 32px;
    height: 32px;
    border: none;
    background: transparent;
    color: #666;
    cursor: pointer;
    border-radius: 6px;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.2s;
}

.readme-close:hover {
    background: rgba(0, 0, 0, 0.05);
    color: #1a1a1a;
}

.readme-content {
    flex: 1;
    overflow-y: auto;
    padding: 24px;
    line-height: 1.8;
    font-size: 15px;
    color: #333;
}

.readme-content>>>h1 {
    font-size: 28px;
    margin: 0 0 16px 0;
    color: #1a1a1a;
}

.readme-content>>>h2 {
    font-size: 22px;
    margin: 24px 0 12px 0;
    color: #1a1a1a;
}

.readme-content>>>h3 {
    font-size: 18px;
    margin: 20px 0 10px 0;
    color: #1a1a1a;
}

.readme-content>>>strong {
    font-weight: 600;
    color: #1a1a1a;
}

.readme-content>>>ul {
    list-style: none;
    padding-left: 0;
    margin: 12px 0;
}

.readme-content>>>li {
    padding-left: 24px;
    position: relative;
    margin-bottom: 8px;
    line-height: 1.6;
}

.readme-content>>>li::before {
    content: '•';
    position: absolute;
    left: 8px;
    color: #007AFF;
}

/* Lightbox */
.lightbox-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.95);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 10001;
    padding: 20px;
}

.lightbox-content {
    max-width: 90vw;
    max-height: 90vh;
    position: relative;
}

.lightbox-close {
    position: absolute;
    top: -50px;
    right: 0;
    width: 40px;
    height: 40px;
    border: none;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 50%;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.2s;
}

.lightbox-close:hover {
    background: rgba(255, 255, 255, 0.2);
}

.lightbox-image {
    max-width: 90vw;
    max-height: 80vh;
    display: flex;
    align-items: center;
    justify-content: center;
}

.placeholder-lightbox {
    min-width: 600px;
    min-height: 400px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 20px;
    border-radius: 12px;
}

.lightbox-alt {
    color: white;
    font-size: 16px;
    max-width: 400px;
    text-align: center;
    margin: 0;
}

.lightbox-caption {
    text-align: center;
    color: white;
    font-size: 15px;
    margin-top: 16px;
}

/* Responsive */
@media (max-width: 768px) {
    .projects-grid {
        grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
        gap: 12px;
    }

    .list-header,
    .list-row {
        grid-template-columns: 2fr 1fr 1fr;
    }

    .list-col-tech,
    .list-col-date {
        display: none;
    }

    .placeholder-lightbox {
        min-width: 90vw;
        min-height: 60vh;
    }
}
</style>
