<template>
  <div class="settings-window">
    <div class="settings-header" @mousedown="$emit('startDrag', $event)">
      <div class="window-controls">
        <span class="window-dot close" @click.stop="$emit('close')"></span>
        <span class="window-dot minimize" @click.stop="$emit('minimize')"></span>
        <span class="window-dot maximize" @click.stop="$emit('toggleMaximize')"></span>
      </div>
      <div class="window-title">Settings</div>
    </div>
    
    <div class="settings-content">
      <div class="settings-sidebar">
        <div 
          class="sidebar-item" 
          :class="{ active: activeTab === 'appearance' }"
          @click="activeTab = 'appearance'"
        >
          <span class="sidebar-icon">🎨</span>
          Appearance
        </div>
      </div>
      
      <div class="settings-main">
        <div v-if="activeTab === 'appearance'" class="settings-section">
          <h2 class="section-title">Wallpaper</h2>
          <div class="wallpaper-grid">
            <!-- Default Gradient -->
            <div 
              class="wallpaper-item"
              :class="{ selected: selectedWallpaper === 0 }"
              @click="selectWallpaper(0)"
            >
              <div class="wallpaper-preview gradient-preview">
                <div class="gradient-bg"></div>
              </div>
              <div class="wallpaper-name">Default</div>
              <div v-if="selectedWallpaper === 0" class="check-icon">✓</div>
            </div>
            
            <!-- Image Wallpapers -->
            <div 
              v-for="wallpaper in wallpapers"
              :key="wallpaper.id"
              class="wallpaper-item"
              :class="{ selected: selectedWallpaper === wallpaper.id }"
              @click="selectWallpaper(wallpaper.id)"
            >
              <div class="wallpaper-preview">
                <img 
                  :src="wallpaper.thumbnail" 
                  :alt="wallpaper.name"
                  loading="lazy"
                  @load="handleImageLoad"
                  @error="handleImageError"
                >
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
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 800px;
  height: 600px;
  background: rgba(30, 30, 30, 0.95);
  backdrop-filter: blur(40px);
  border-radius: 12px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
  display: flex;
  flex-direction: column;
  z-index: 1000;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.settings-header {
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

.settings-content {
  display: flex;
  flex: 1;
  overflow: hidden;
}

.settings-sidebar {
  width: 200px;
  background: rgba(0, 0, 0, 0.2);
  border-right: 1px solid rgba(255, 255, 255, 0.1);
  padding: 12px 0;
}

.sidebar-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 20px;
  color: rgba(255, 255, 255, 0.7);
  cursor: pointer;
  transition: all 0.2s;
  font-size: 14px;
}

.sidebar-item:hover {
  background: rgba(255, 255, 255, 0.05);
  color: white;
}

.sidebar-item.active {
  background: rgba(10, 132, 255, 0.2);
  color: #0a84ff;
  border-left: 3px solid #0a84ff;
  padding-left: 17px;
}

.sidebar-icon {
  font-size: 16px;
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
