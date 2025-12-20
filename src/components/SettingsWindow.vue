<template>
  <div class="settings-window">
    <div class="settings-header" @mousedown="$emit('startDrag', $event)">
      <div class="window-controls">
        <span class="window-dot close" @click.stop="$emit('close')"></span>
        <span class="window-dot minimize" @click.stop="$emit('minimize')"></span>
        <span class="window-dot maximize" @click.stop="$emit('toggleMaximize')"></span>
      </div>
      <div class="window-title-container">
        <span class="window-icon">⚙️</span>
        <span class="window-title">System Settings</span>
      </div>
    </div>

    <div class="settings-content">
      <div class="settings-sidebar">
        <div class="sidebar-item" :class="{ active: activeTab === 'appearance' }" @click="activeTab = 'appearance'">
          <span class="sidebar-icon">🖼️</span>
          Appearance
        </div>
      </div>

      <div class="settings-main">
        <div v-if="activeTab === 'appearance'" class="settings-section">
          <h2 class="section-title">Wallpaper</h2>
          <div class="wallpaper-grid">
            <!-- Default Gradient -->
            <div class="wallpaper-item" :class="{ selected: selectedWallpaper === 0 }" @click="selectWallpaper(0)">
              <div class="wallpaper-preview gradient-preview">
                <div class="gradient-bg"></div>
              </div>
              <div class="wallpaper-name">Default</div>
              <div v-if="selectedWallpaper === 0" class="check-icon">✓</div>
            </div>

            <!-- Image Wallpapers -->
            <div v-for="wallpaper in wallpapers" :key="wallpaper.id" class="wallpaper-item"
              :class="{ selected: selectedWallpaper === wallpaper.id }" @click="selectWallpaper(wallpaper.id)">
              <div class="wallpaper-preview">
                <img :src="wallpaper.thumbnail" :alt="wallpaper.name" loading="lazy" @load="handleImageLoad"
                  @error="handleImageError">
              </div>
              <div class="wallpaper-name">{{ wallpaper.name }}</div>
              <div v-if="selectedWallpaper === wallpaper.id" class="check-icon">✓</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { wallpapers, defaultWallpaper } from '../data/wallpapers.js';

const emit = defineEmits(['close', 'minimize', 'toggleMaximize', 'startDrag', 'wallpaperChanged']);
const activeTab = ref('appearance');
const selectedWallpaper = ref(0);

onMounted(() => {
  // Load saved wallpaper preference
  const saved = localStorage.getItem('wallpaper');
  if (saved !== null) {
    selectedWallpaper.value = parseInt(saved);
  }
});

const selectWallpaper = (id) => {
  selectedWallpaper.value = id;
  localStorage.setItem('wallpaper', id.toString());

  // Emit wallpaper change event
  if (id === 0) {
    emit('wallpaperChanged', { id, path: null });
  } else {
    const wallpaper = wallpapers.find(w => w.id === id);
    emit('wallpaperChanged', { id, path: wallpaper.path });
  }
};

const handleImageLoad = (event) => {
  // Image loaded successfully
  event.target.style.opacity = '1';
};

const handleImageError = (event) => {
  // Fallback for missing images
  event.target.style.display = 'none';
  event.target.parentElement.style.background = '#1a1a2e';
};
</script>

<style scoped>
.settings-window {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  background: transparent;
}

.settings-header {
  height: 48px;
  background: rgba(230, 230, 230, 0.05);
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  display: flex;
  align-items: center;
  padding: 0 16px;
  cursor: move;
  user-select: none;
  flex-shrink: 0;
  position: relative;
}

.window-controls {
  display: flex;
  gap: 8px;
  z-index: 2;
}

.window-dots {
  display: flex;
  gap: 8px;
}

.window-dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  cursor: pointer;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  border: 0.5px solid rgba(0, 0, 0, 0.1);
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

.window-dot:hover {
  filter: brightness(0.9);
}

.window-title-container {
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  pointer-events: none;
  gap: 8px;
}

.window-icon {
  font-size: 16px;
}

.window-title {
  color: rgba(255, 255, 255, 0.8);
  font-size: 13px;
  font-weight: 600;
  letter-spacing: 0.3px;
}

.settings-content {
  display: flex;
  flex: 1;
  overflow: hidden;
}

.settings-sidebar {
  width: 180px;
  background: rgba(255, 255, 255, 0.05);
  padding: 16px 8px;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.sidebar-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 8px 12px;
  color: rgba(255, 255, 255, 0.6);
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 13px;
  font-weight: 500;
  border-radius: 8px;
}

.sidebar-item:hover {
  background: rgba(255, 255, 255, 0.1);
  color: rgba(255, 255, 255, 0.9);
}

.sidebar-item.active {
  background: rgba(255, 255, 255, 0.15);
  color: #fff;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}

.sidebar-icon {
  font-size: 18px;
}

.settings-main {
  flex: 1;
  padding: 24px;
  overflow-y: auto;
}

.settings-section {
  max-width: 100%;
}

.section-title {
  font-size: 20px;
  font-weight: 600;
  color: white;
  margin-bottom: 20px;
}

.wallpaper-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
  gap: 16px;
  padding: 4px;
}

.wallpaper-item {
  position: relative;
  cursor: pointer;
  transition: transform 0.2s;
}

.wallpaper-item:hover {
  transform: translateY(-4px);
}

.wallpaper-preview {
  position: relative;
  width: 100%;
  aspect-ratio: 16 / 10;
  border-radius: 8px;
  overflow: hidden;
  border: 2px solid transparent;
  transition: all 0.2s;
  background: #1a1a2e;
}

.wallpaper-item.selected .wallpaper-preview {
  border-color: #0a84ff;
  box-shadow: 0 0 0 2px rgba(10, 132, 255, 0.3);
}

.wallpaper-preview img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  opacity: 0;
  transition: opacity 0.3s;
}

.gradient-preview {
  display: flex;
  align-items: center;
  justify-content: center;
}

.gradient-bg {
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%);
}

.wallpaper-name {
  margin-top: 8px;
  font-size: 12px;
  color: rgba(255, 255, 255, 0.7);
  text-align: center;
}

.check-icon {
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

/* Scrollbar styling */
.settings-main::-webkit-scrollbar {
  width: 8px;
}

.settings-main::-webkit-scrollbar-track {
  background: transparent;
}

.settings-main::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.2);
  border-radius: 4px;
}

.settings-main::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 255, 255, 0.3);
}
</style>
