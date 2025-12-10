<template>
    <div class="login-screen">
        <!-- Menu Bar -->
        <div class="menu-bar">
            <div class="menu-left">
                <div class="apple-logo"></div>
            </div>
            <div class="menu-right">
                <div class="menu-icon wifi-icon">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="white">
                        <path d="M1 9l2 2c4.97-4.97 13.03-4.97 18 0l2-2C16.93 2.93 7.08 2.93 1 9zm8 8l3 3 3-3c-1.65-1.66-4.34-1.66-6 0zm-4-4l2 2c2.76-2.76 7.24-2.76 10 0l2-2C15.14 9.14 8.87 9.14 5 13z"/>
                    </svg>
                </div>
                <div class="menu-icon battery-icon">
                    <svg width="22" height="12" viewBox="0 0 22 12" fill="none">
                        <rect x="0.5" y="0.5" width="19" height="11" rx="2.5" stroke="white" stroke-opacity="0.8"/>
                        <rect x="2" y="2" width="15" height="8" rx="1" fill="white"/>
                        <path d="M21 4v4c0.5 0 1-0.5 1-1V5c0-0.5-0.5-1-1-1z" fill="white" fill-opacity="0.8"/>
                    </svg>
                </div>
                <div class="menu-time">{{ currentTime }}</div>
            </div>
        </div>

        <!-- Main Login Area -->
        <div class="login-main">
            <div class="login-container" :class="{ 'shake': loginError }">
                <div class="user-avatar">
                    <img src="/avatar.jpg" alt="GAP Pathum" @error="handleImageError" />
                </div>
                <div class="user-name">GAP Pathum</div>
                <div class="password-field">
                    <div class="password-dots">
                        <span v-for="n in 8" :key="n" class="dot" :class="{ 'filled': password.length >= n }"></span>
                    </div>
                    <input 
                        type="password" 
                        v-model="password"
                        @keydown.enter="handleLogin"
                        @keydown="clearError"
                        maxlength="8"
                        class="password-input"
                        ref="passwordInput"
                        autofocus
                    />
                </div>
                <div class="password-hint" v-if="!loginError">Enter Password</div>
                <div class="password-error" v-else>
                    <span class="error-icon">⚠️</span>
                    Incorrect password. Please try again.
                </div>
                <button class="touch-id-btn" @click="handleTouchID">
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                        <path d="M17.81 4.47c-.08 0-.16-.02-.23-.06C15.66 3.42 14 3 12.01 3c-1.98 0-3.86.47-5.57 1.41-.24.13-.54.04-.68-.2-.13-.24-.04-.55.2-.68C7.82 2.52 9.86 2 12.01 2c2.13 0 3.99.47 6.03 1.52.25.13.34.43.21.67-.09.18-.26.28-.44.28z" fill="currentColor"/>
                        <path d="M3.5 9.72c-.1 0-.2-.03-.29-.09-.23-.16-.28-.47-.12-.7.99-1.4 2.25-2.5 3.75-3.27C9.98 4.04 14 4.03 17.15 5.65c1.5.77 2.76 1.86 3.75 3.25.16.22.11.54-.12.7-.23.16-.54.11-.7-.12-.9-1.26-2.04-2.25-3.39-2.94-2.87-1.47-6.54-1.47-9.4.01-1.36.7-2.5 1.7-3.4 2.96-.08.14-.23.21-.39.21z" fill="currentColor"/>
                        <path d="M9.75 21.79c-.13 0-.26-.05-.35-.15-.87-.87-1.34-1.43-2.01-2.64-.69-1.23-1.05-2.73-1.05-4.34 0-2.97 2.54-5.39 5.66-5.39s5.66 2.42 5.66 5.39c0 .28-.22.5-.5.5s-.5-.22-.5-.5c0-2.42-2.09-4.39-4.66-4.39-2.57 0-4.66 1.97-4.66 4.39 0 1.44.32 2.77.93 3.85.64 1.15 1.08 1.64 1.85 2.42.19.2.19.51 0 .71-.11.1-.24.15-.37.15z" fill="currentColor"/>
                        <path d="M16.92 19.94c-1.19 0-2.24-.3-3.1-.89-1.49-1.01-2.38-2.73-2.38-4.61 0-.28.22-.5.5-.5s.5.22.5.5c0 1.54.72 2.95 1.94 3.77.71.48 1.54.71 2.54.71.24 0 .64-.03 1.04-.1.27-.05.53.13.58.41.05.27-.13.53-.41.58-.57.11-1.07.13-1.21.13z" fill="currentColor"/>
                        <path d="M14.91 22c-.04 0-.09-.01-.13-.02-1.59-.44-2.63-1.03-3.72-2.1-1.4-1.39-2.17-3.24-2.17-5.22 0-1.62 1.38-2.94 3.08-2.94 1.7 0 3.08 1.32 3.08 2.94 0 1.07.93 1.94 2.08 1.94s2.08-.87 2.08-1.94c0-3.77-3.25-6.83-7.25-6.83-2.84 0-5.44 1.58-6.61 4.03-.39.81-.59 1.76-.59 2.8 0 .78.07 2.01.67 3.61.1.26-.03.55-.29.64-.26.1-.55-.04-.64-.29-.49-1.31-.73-2.61-.73-3.96 0-1.2.23-2.29.68-3.24 1.33-2.79 4.28-4.6 7.51-4.6 4.55 0 8.25 3.51 8.25 7.83 0 1.62-1.38 2.94-3.08 2.94s-3.08-1.32-3.08-2.94c0-1.07-.93-1.94-2.08-1.94s-2.08.87-2.08 1.94c0 1.71.66 3.31 1.87 4.51.95.94 1.86 1.46 3.27 1.85.27.07.42.35.35.61-.05.23-.26.37-.48.37z" fill="currentColor"/>
                    </svg>
                    <span>Touch ID or Enter Password</span>
                </button>
            </div>

            <!-- Other Users -->
            <div class="other-users">
                <button class="switch-user">Switch User...</button>
            </div>
        </div>

        <!-- Footer -->
        <div class="login-footer">
            <button class="power-btn" @click="handleSleep" title="Sleep">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 3c-4.97 0-9 4.03-9 9s4.03 9 9 9 9-4.03 9-9c0-.46-.04-.92-.1-1.36-.98 1.37-2.58 2.26-4.4 2.26-2.98 0-5.4-2.42-5.4-5.4 0-1.81.89-3.42 2.26-4.4-.44-.06-.9-.1-1.36-.1z"/>
                </svg>
            </button>
            <button class="power-btn" @click="handleRestart" title="Restart">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M17.65 6.35C16.2 4.9 14.21 4 12 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08c-.82 2.33-3.04 4-5.65 4-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z"/>
                </svg>
            </button>
            <button class="power-btn" @click="handleShutdown" title="Shut Down">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M13 3h-2v10h2V3zm4.83 2.17l-1.42 1.42C17.99 7.86 19 9.81 19 12c0 3.87-3.13 7-7 7s-7-3.13-7-7c0-2.19 1.01-4.14 2.58-5.42L6.17 5.17C4.23 6.82 3 9.26 3 12c0 4.97 4.03 9 9 9s9-4.03 9-9c0-2.74-1.23-5.18-3.17-6.83z"/>
                </svg>
            </button>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';

const emit = defineEmits(['login']);
const password = ref('');
const passwordInput = ref(null);
const loginError = ref(false);
const currentTime = ref('');

function updateTime() {
    const now = new Date();
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const day = days[now.getDay()];
    const month = months[now.getMonth()];
    const date = now.getDate();
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    currentTime.value = `${day} ${month} ${date}  ${hours}:${minutes}`;
}

function handleLogin() {
    if (password.value.length > 0) {
        emit('login');
    } else {
        loginError.value = true;
    }
}

function handleTouchID() {
    emit('login');
}

function clearError() {
    loginError.value = false;
}

function handleSleep() {
    document.body.style.transition = 'opacity 0.5s';
    document.body.style.opacity = '0';
    setTimeout(() => {
        document.body.style.opacity = '1';
    }, 1500);
}

function handleRestart() {
    window.location.reload();
}

function handleShutdown() {
    document.body.innerHTML = '<div style="width:100vw;height:100vh;background:#000;"></div>';
}

function handleImageError(e) {
    e.target.src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="50" cy="50" r="50" fill="%2389dceb"/><text x="50" y="65" font-size="40" text-anchor="middle" fill="white" font-family="Arial">GP</text></svg>';
}

let timeInterval;

onMounted(() => {
    passwordInput.value?.focus();
    updateTime();
    timeInterval = setInterval(updateTime, 1000);
});

onUnmounted(() => {
    if (timeInterval) clearInterval(timeInterval);
});
</script>

<style scoped>
.login-screen {
    width: 100vw;
    height: 100vh;
    background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%);
    display: flex;
    flex-direction: column;
    position: relative;
    font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Segoe UI', sans-serif;
}

/* Menu Bar */
.menu-bar {
    height: 25px;
    background: rgba(0, 0, 0, 0.35);
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 12px;
    color: white;
    font-size: 13px;
    font-weight: 500;
}

.menu-left {
    display: flex;
    align-items: center;
}

.apple-logo {
    width: 14px;
    height: 17px;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='white'%3E%3Cpath d='M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z'/%3E%3C/svg%3E");
    background-size: contain;
    background-repeat: no-repeat;
    background-position: center;
}

.menu-right {
    display: flex;
    align-items: center;
    gap: 10px;
}

.menu-icon {
    display: flex;
    align-items: center;
}

.menu-time {
    font-weight: 500;
    letter-spacing: 0.3px;
}

/* Main Login Area */
.login-main {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
}

.login-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    animation: fadeIn 0.6s ease;
}

.login-container.shake {
    animation: shake 0.5s ease;
}

@keyframes shake {
    0%, 100% { transform: translateX(0); }
    20%, 60% { transform: translateX(-10px); }
    40%, 80% { transform: translateX(10px); }
}

.user-avatar {
    width: 96px;
    height: 96px;
    border-radius: 50%;
    overflow: hidden;
    box-shadow: 0 4px 24px rgba(0, 0, 0, 0.4);
    margin-bottom: 14px;
    border: 3px solid rgba(255, 255, 255, 0.15);
}

.user-avatar img {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.user-name {
    font-size: 22px;
    font-weight: 500;
    color: white;
    margin-bottom: 18px;
    text-shadow: 0 1px 4px rgba(0, 0, 0, 0.3);
    letter-spacing: 0.3px;
}

/* Password Field */
.password-field {
    position: relative;
    margin-bottom: 10px;
}

.password-dots {
    display: flex;
    gap: 8px;
    background: rgba(255, 255, 255, 0.12);
    backdrop-filter: blur(30px);
    -webkit-backdrop-filter: blur(30px);
    padding: 14px 22px;
    border-radius: 10px;
    border: 1px solid rgba(255, 255, 255, 0.15);
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.2);
}

.dot {
    width: 10px;
    height: 10px;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.25);
    transition: all 0.12s ease;
}

.dot.filled {
    background: white;
    box-shadow: 0 0 10px rgba(255, 255, 255, 0.6);
}

.password-input {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    opacity: 0;
    cursor: text;
}

.password-hint {
    font-size: 12px;
    color: rgba(255, 255, 255, 0.6);
    margin-bottom: 24px;
    font-weight: 400;
}

.password-error {
    font-size: 12px;
    color: #ff6b6b;
    margin-bottom: 24px;
    display: flex;
    align-items: center;
    gap: 6px;
}

.error-icon {
    font-size: 14px;
}

/* Touch ID Button */
.touch-id-btn {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;
    background: transparent;
    border: none;
    color: rgba(255, 255, 255, 0.7);
    cursor: pointer;
    padding: 14px 20px;
    border-radius: 10px;
    transition: all 0.2s;
}

.touch-id-btn:hover {
    background: rgba(255, 255, 255, 0.08);
    color: white;
}

.touch-id-btn span {
    font-size: 12px;
    font-weight: 400;
}

/* Other Users */
.other-users {
    margin-top: 50px;
}

.switch-user {
    background: transparent;
    border: none;
    color: rgba(255, 255, 255, 0.6);
    font-size: 13px;
    cursor: pointer;
    padding: 8px 16px;
    border-radius: 6px;
    transition: all 0.2s;
    font-weight: 400;
}

.switch-user:hover {
    background: rgba(255, 255, 255, 0.08);
    color: white;
}

/* Footer */
.login-footer {
    position: absolute;
    bottom: 24px;
    left: 50%;
    transform: translateX(-50%);
    display: flex;
    gap: 14px;
}

.power-btn {
    width: 34px;
    height: 34px;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.08);
    backdrop-filter: blur(10px);
    -webkit-backdrop-filter: blur(10px);
    border: 1px solid rgba(255, 255, 255, 0.1);
    color: rgba(255, 255, 255, 0.6);
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.2s ease;
}

.power-btn:hover {
    background: rgba(255, 255, 255, 0.15);
    color: white;
}

@keyframes fadeIn {
    from {
        opacity: 0;
        transform: scale(0.96);
    }
    to {
        opacity: 1;
        transform: scale(1);
    }
}

@media (max-width: 767px) {
    .login-screen {
        display: none !important;
    }
}
</style>
