<template>
  <!-- Mobile iOS Interface -->
  <template v-if="isMobile">
    <iPhoneLockScreen v-if="currentView === 'lock'" @unlock="handleUnlock" />
    <iPhoneHome v-else-if="currentView === 'home'" @logout="handleLogout" />
  </template>

  <!-- Desktop macOS Interface -->
  <template v-else>
    <LoginScreen v-if="currentView === 'login'" @login="handleLogin" />
    <MacDesktop v-else-if="currentView === 'desktop'" @logout="handleLogout" />
  </template>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import LoginScreen from './components/LoginScreen.vue';
import MacDesktop from './components/MacDesktop.vue';
import iPhoneLockScreen from './components/iPhoneLockScreen.vue';
import iPhoneHome from './components/iPhoneHome.vue';

const isMobile = ref(false);
const currentView = ref('login');

function detectDevice() {
  const width = window.innerWidth;
  
  // Only use width for detection - simpler and more reliable
  isMobile.value = width < 768;
  
  // Set initial view based on device
  if (isMobile.value) {
    currentView.value = 'lock';
  } else {
    currentView.value = 'login';
  }
}

function handleLogin() {
  currentView.value = 'desktop';
}

function handleUnlock() {
  currentView.value = 'home';
}

function handleLogout() {
  if (isMobile.value) {
    currentView.value = 'lock';
  } else {
    currentView.value = 'login';
  }
}

function handleResize() {
  detectDevice();
}

onMounted(() => {
  detectDevice();
  window.addEventListener('resize', handleResize);
});

onUnmounted(() => {
  window.removeEventListener('resize', handleResize);
});
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  overflow: hidden;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Helvetica', 'Arial', sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
</style>