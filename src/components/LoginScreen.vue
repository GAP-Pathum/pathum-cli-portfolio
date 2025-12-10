<template>
    <div class="login-screen">
        <div class="login-container">
            <div class="user-avatar">
                <img src="/avatar.jpg" alt="GAP Pathum" @error="handleImageError" />
            </div>
            <div class="user-name">GAP Pathum</div>
            <div class="password-container">
                <input 
                    type="password" 
                    v-model="password"
                    @keydown.enter="handleLogin"
                    placeholder="Enter Password"
                    class="password-input"
                    ref="passwordInput"
                />
                <button @click="handleLogin" class="login-arrow">→</button>
            </div>
            <div class="login-hint">Press Enter or click → to continue</div>
        </div>
        <div class="login-footer">
            <button class="power-btn" title="Sleep">⏾</button>
            <button class="power-btn" title="Restart">⟲</button>
            <button class="power-btn" title="Shutdown">⏻</button>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';

const emit = defineEmits(['login']);
const password = ref('');
const passwordInput = ref(null);

function handleLogin() {
    // Simple animation then emit login event
    emit('login');
}

function handleImageError(e) {
    // Fallback to a default avatar if image not found
    e.target.src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="50" cy="50" r="50" fill="%2389dceb"/><text x="50" y="65" font-size="40" text-anchor="middle" fill="white" font-family="Arial">GP</text></svg>';
}

onMounted(() => {
    passwordInput.value?.focus();
});
</script>

<style scoped>
.login-screen {
    width: 100vw;
    height: 100vh;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    position: relative;
}

.login-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    animation: fadeIn 0.5s ease;
}

.user-avatar {
    width: 120px;
    height: 120px;
    border-radius: 50%;
    overflow: hidden;
    border: 4px solid rgba(255, 255, 255, 0.3);
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
    margin-bottom: 20px;
}

.user-avatar img {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.user-name {
    font-size: 28px;
    font-weight: 300;
    color: white;
    margin-bottom: 24px;
    text-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
}

.password-container {
    display: flex;
    align-items: center;
    background: rgba(255, 255, 255, 0.15);
    backdrop-filter: blur(20px);
    border-radius: 20px;
    padding: 4px 4px 4px 20px;
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);
    border: 1px solid rgba(255, 255, 255, 0.2);
    margin-bottom: 12px;
}

.password-input {
    background: transparent;
    border: none;
    outline: none;
    color: white;
    font-size: 16px;
    padding: 10px;
    width: 200px;
}

.password-input::placeholder {
    color: rgba(255, 255, 255, 0.6);
}

.login-arrow {
    width: 36px;
    height: 36px;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.3);
    border: none;
    color: white;
    font-size: 20px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.2s ease;
}

.login-arrow:hover {
    background: rgba(255, 255, 255, 0.4);
    transform: scale(1.05);
}

.login-hint {
    color: rgba(255, 255, 255, 0.8);
    font-size: 13px;
    font-weight: 300;
}

.login-footer {
    position: absolute;
    bottom: 30px;
    display: flex;
    gap: 16px;
}

.power-btn {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.15);
    backdrop-filter: blur(10px);
    border: 1px solid rgba(255, 255, 255, 0.2);
    color: white;
    font-size: 20px;
    cursor: pointer;
    transition: all 0.2s ease;
}

.power-btn:hover {
    background: rgba(255, 255, 255, 0.25);
    transform: scale(1.05);
}

@keyframes fadeIn {
    from {
        opacity: 0;
        transform: translateY(20px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

@media (max-width: 767px) {
    .login-screen {
        display: none !important;
    }
}
</style>
