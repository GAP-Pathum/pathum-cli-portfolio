<template>
    <div v-if="isOpen && !isMinimized" class="calendar-container" :class="{ 'mobile-mode': mobileMode }"
        :style="windowStyle">
        <!-- Mobile Header -->
        <div v-if="mobileMode" class="mobile-header">
            <button class="back-btn" @click="close">‹ Back</button>
            <span class="mobile-title">Calendar</span>
            <span class="spacer"></span>
        </div>

        <!-- Desktop Header -->
        <div v-else class="calendar-header" @mousedown="startDrag">
            <div class="window-controls">
                <div class="window-dot close" @click.stop="close"></div>
                <div class="window-dot minimize" @click.stop="minimize"></div>
                <div class="window-dot maximize" @click.stop="toggleMaximize"></div>
            </div>
            <div class="window-title">Calendar</div>
        </div>

        <div class="calendar-body">
            <!-- Month/Year Navigation -->
            <div class="calendar-nav">
                <button class="nav-btn" @click="previousMonth">‹</button>
                <h2 class="current-month">{{ currentMonthName }} {{ currentYear }}</h2>
                <button class="nav-btn" @click="nextMonth">›</button>
            </div>

            <!-- Calendar Grid -->
            <div class="calendar-grid">
                <!-- Day Headers -->
                <div class="day-header" v-for="day in dayNames" :key="day">
                    {{ day }}
                </div>

                <!-- Empty cells for days before the first day of the month -->
                <div v-for="empty in emptyDays" :key="'empty-' + empty" class="calendar-day empty"></div>

                <!-- Calendar days -->
                <div v-for="day in daysInMonth" :key="day" class="calendar-day" :class="{
                    'today': isToday(day),
                    'selected': selectedDate && selectedDate.getDate() === day && selectedDate.getMonth() === currentMonth && selectedDate.getFullYear() === currentYear,
                    'birthday': isBirthday(day),
                    'event-day': hasEvent(day)
                }" @click="selectDate(day)">
                    <span class="day-number">{{ day }}</span>
                    <div class="day-events">
                        <div v-for="event in getEventsForDay(day)" :key="event.id" class="event-indicator"
                            :class="event.type" :title="event.title"></div>
                    </div>
                </div>
            </div>

            <!-- Selected Date Details -->
            <div v-if="selectedDate" class="date-details">
                <h3 class="selected-date-title">
                    {{ selectedDate.toLocaleDateString('en-US', {
                        weekday: 'long', year: 'numeric', month: 'long', day:
                    'numeric' }) }}
                </h3>

                <!-- Birthday Surprise -->
                <div v-if="isBirthday(selectedDate.getDate())" class="birthday-surprise">
                    <div class="birthday-message">
                        <div class="birthday-icon">🎂</div>
                        <h4>Happy Birthday! 🎉</h4>
                        <p>Wishing you a fantastic year ahead! May all your dreams come true and your code always
                            compile on the first try! 🚀</p>
                        <div class="birthday-gift">
                            <div class="gift-box">🎁</div>
                            <p class="gift-message">Here's a virtual gift from your portfolio: <strong>100% Bug-Free
                                    Code</strong> ✨</p>
                        </div>
                    </div>
                </div>

                <!-- Events for selected date -->
                <div v-if="getEventsForDay(selectedDate.getDate()).length > 0" class="events-list">
                    <h4>Events:</h4>
                    <div v-for="event in getEventsForDay(selectedDate.getDate())" :key="event.id" class="event-item"
                        :class="event.type">
                        <div class="event-time">{{ event.time }}</div>
                        <div class="event-title">{{ event.title }}</div>
                        <div v-if="event.description" class="event-description">{{ event.description }}</div>
                    </div>
                </div>

                <!-- No events message -->
                <div v-else-if="!isBirthday(selectedDate.getDate())" class="no-events">
                    <p>No events scheduled for this day.</p>
                </div>
            </div>
        </div>

        <!-- Resize Handles -->
        <div class="resize-handle resize-right" @mousedown="startResize($event, 'right')"></div>
        <div class="resize-handle resize-bottom" @mousedown="startResize($event, 'bottom')"></div>
        <div class="resize-handle resize-corner" @mousedown="startResize($event, 'corner')"></div>
    </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';

const props = defineProps({
    isOpen: {
        type: Boolean,
        default: false
    },
    isMinimized: {
        type: Boolean,
        default: false
    },
    mobileMode: {
        type: Boolean,
        default: false
    }
});

const emit = defineEmits(['close', 'minimize', 'maximize']);

// Calendar state
const currentDate = ref(new Date());
const selectedDate = ref(null);
const isMaximized = ref(false);
let previousStyle = null;

// Window state
const windowStyle = ref(props.mobileMode ? {
    left: '0px',
    top: '0px',
    width: '100vw',
    height: '100vh'
} : {
    left: '350px',
    top: '150px',
    width: Math.min(600, window.innerWidth - 400) + 'px',
    height: Math.min(450, window.innerHeight - 200) + 'px'
});

// Dragging state
let isDragging = false;
let startX = 0;
let startY = 0;
let offsetX = 0;
let offsetY = 0;

// Resizing state
let isResizing = false;
let resizeDirection = null;
let resizeStartX = 0;
let resizeStartY = 0;
let resizeStartWidth = 0;
let resizeStartHeight = 0;

// Calendar data
const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
];

// Events data
const events = ref([
    // Universal events
    { id: 1, date: '2025-01-01', time: 'All Day', title: 'New Year\'s Day', type: 'holiday', description: 'Happy New Year!' },
    { id: 2, date: '2025-02-14', time: 'All Day', title: 'Valentine\'s Day', type: 'celebration', description: 'Love is in the air 💕' },
    { id: 3, date: '2025-03-17', time: 'All Day', title: 'St. Patrick\'s Day', type: 'celebration', description: 'Luck of the Irish 🍀' },
    { id: 4, date: '2025-04-01', time: 'All Day', title: 'April Fools\' Day', type: 'fun', description: 'Don\'t believe everything you see! 😄' },
    { id: 5, date: '2025-05-01', time: 'All Day', title: 'May Day', type: 'celebration', description: 'Spring celebrations 🌸' },
    { id: 6, date: '2025-06-01', time: 'All Day', title: 'World Milk Day', type: 'fun', description: 'Milk is amazing! 🥛' },
    { id: 7, date: '2025-07-04', time: 'All Day', title: 'Independence Day', type: 'holiday', description: 'Celebrating freedom 🇺🇸' },
    { id: 8, date: '2025-07-23', time: 'All Day', title: 'Birthday Celebration', type: 'birthday', description: 'Special birthday surprise! 🎂' },
    { id: 9, date: '2025-08-01', time: 'All Day', title: 'World Breastfeeding Week', type: 'awareness', description: 'Supporting mothers worldwide 👶' },
    { id: 10, date: '2025-09-01', time: 'All Day', title: 'Knowledge Day', type: 'education', description: 'Back to learning 📚' },
    { id: 11, date: '2025-10-31', time: 'All Day', title: 'Halloween', type: 'celebration', description: 'Trick or treat! 🎃' },
    { id: 12, date: '2025-11-11', time: 'All Day', title: 'Veterans Day', type: 'holiday', description: 'Honoring our veterans 🇺🇸' },
    { id: 13, date: '2025-12-25', time: 'All Day', title: 'Christmas Day', type: 'holiday', description: 'Merry Christmas! 🎄' },
    { id: 14, date: '2025-12-31', time: 'All Day', title: 'New Year\'s Eve', type: 'celebration', description: 'Countdown to midnight 🎆' },

    // Additional events for current year
    { id: 15, date: '2025-03-14', time: 'All Day', title: 'Pi Day', type: 'fun', description: '3.14159... 🥧' },
    { id: 16, date: '2025-05-05', time: 'All Day', title: 'Cinco de Mayo', type: 'celebration', description: 'Mexican heritage celebration 🇲🇽' },
    { id: 17, date: '2025-06-21', time: 'All Day', title: 'Summer Solstice', type: 'nature', description: 'Longest day of the year ☀️' },
    { id: 18, date: '2025-09-23', time: 'All Day', title: 'Autumn Equinox', type: 'nature', description: 'Balance of light and dark 🍂' },
    { id: 19, date: '2025-12-21', time: 'All Day', title: 'Winter Solstice', type: 'nature', description: 'Shortest day of the year ❄️' },
]);

// Computed properties
const currentMonth = computed(() => currentDate.value.getMonth());
const currentYear = computed(() => currentDate.value.getFullYear());
const currentMonthName = computed(() => monthNames[currentMonth.value]);

const daysInMonth = computed(() => {
    return new Date(currentYear.value, currentMonth.value + 1, 0).getDate();
});

const firstDayOfMonth = computed(() => {
    return new Date(currentYear.value, currentMonth.value, 1).getDay();
});

const emptyDays = computed(() => firstDayOfMonth.value);

// Functions
function close() {
    emit('close');
}

function minimize() {
    emit('minimize');
}

function toggleMaximize() {
    if (isMaximized.value) {
        // Restore
        windowStyle.value = { ...previousStyle };
        isMaximized.value = false;
        emit('maximize', false);
    } else {
        // Maximize
        previousStyle = { ...windowStyle.value };
        windowStyle.value = {
            left: '0px',
            top: '0px',
            width: '100vw',
            height: '100vh'
        };
        isMaximized.value = true;
        emit('maximize', true);
    }
}

function startDrag(event) {
    if (isMaximized.value || props.mobileMode) return;
    isDragging = true;
    startX = event.clientX;
    startY = event.clientY;
    offsetX = event.clientX - parseInt(windowStyle.value.left);
    offsetY = event.clientY - parseInt(windowStyle.value.top);
    document.addEventListener('mousemove', drag);
    document.addEventListener('mouseup', stopDrag);
}

function drag(event) {
    if (!isDragging) return;
    const newLeft = event.clientX - offsetX;
    const newTop = event.clientY - offsetY;
    windowStyle.value.left = Math.max(0, newLeft) + 'px';
    windowStyle.value.top = Math.max(0, newTop) + 'px';
}

function stopDrag() {
    isDragging = false;
    document.removeEventListener('mousemove', drag);
    document.removeEventListener('mouseup', stopDrag);
}

function startResize(event, direction) {
    if (isMaximized.value || props.mobileMode) return;
    isResizing = true;
    resizeDirection = direction;
    resizeStartX = event.clientX;
    resizeStartY = event.clientY;
    resizeStartWidth = parseInt(windowStyle.value.width);
    resizeStartHeight = parseInt(windowStyle.value.height);
    document.addEventListener('mousemove', resize);
    document.addEventListener('mouseup', stopResize);
}

function resize(event) {
    if (!isResizing) return;
    const deltaX = event.clientX - resizeStartX;
    const deltaY = event.clientY - resizeStartY;
    let newWidth = resizeStartWidth;
    let newHeight = resizeStartHeight;

    if (resizeDirection === 'right' || resizeDirection === 'corner') {
        newWidth = Math.max(300, resizeStartWidth + deltaX);
    }
    if (resizeDirection === 'bottom' || resizeDirection === 'corner') {
        newHeight = Math.max(200, resizeStartHeight + deltaY);
    }

    windowStyle.value.width = newWidth + 'px';
    windowStyle.value.height = newHeight + 'px';
}

function stopResize() {
    isResizing = false;
    document.removeEventListener('mousemove', resize);
    document.removeEventListener('mouseup', stopResize);
}

function previousMonth() {
    currentDate.value = new Date(currentYear.value, currentMonth.value - 1, 1);
    selectedDate.value = null;
}

function nextMonth() {
    currentDate.value = new Date(currentYear.value, currentMonth.value + 1, 1);
    selectedDate.value = null;
}

function selectDate(day) {
    selectedDate.value = new Date(currentYear.value, currentMonth.value, day);
}

function isToday(day) {
    const today = new Date();
    return today.getDate() === day &&
        today.getMonth() === currentMonth.value &&
        today.getFullYear() === currentYear.value;
}

function isBirthday(day) {
    return currentMonth.value === 6 && day === 23; // July is month 6 (0-indexed)
}

function hasEvent(day) {
    return getEventsForDay(day).length > 0;
}

function getEventsForDay(day) {
    const dateString = `${currentYear.value}-${String(currentMonth.value + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return events.value.filter(event => event.date === dateString);
}

onMounted(() => {
    // Select today's date by default
    const today = new Date();
    if (today.getMonth() === currentMonth.value && today.getFullYear() === currentYear.value) {
        selectedDate.value = today;
    }
});
</script>

<style scoped>
.calendar-container {
    position: fixed;
    display: flex;
    flex-direction: column;
    background: rgba(30, 30, 46, 0.98);
    backdrop-filter: blur(30px);
    -webkit-backdrop-filter: blur(30px);
    border-radius: 16px;
    overflow: hidden;
    box-shadow: 0 30px 80px rgba(0, 0, 0, 0.6), inset 0 1px 0 rgba(255, 255, 255, 0.1);
    z-index: 500;
    border: 1px solid rgba(255, 255, 255, 0.08);
}

.calendar-header {
    height: 36px;
    background: rgba(45, 45, 65, 0.8);
    border-bottom: 1px solid rgba(255, 255, 255, 0.05);
    display: flex;
    align-items: center;
    padding: 0 12px;
    cursor: move;
    user-select: none;
    -webkit-user-select: none;
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
    border: 0.5px solid rgba(0, 0, 0, 0.2);
    transition: all 0.2s ease;
}

.window-dot:hover {
    transform: scale(1.1);
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

.window-title {
    flex: 1;
    text-align: center;
    color: rgba(255, 255, 255, 0.6);
    font-size: 13px;
    font-weight: 600;
    letter-spacing: 0.3px;
    margin-right: 76px;
}

.calendar-body {
    flex: 1;
    padding: 16px;
    display: flex;
    flex-direction: column;
    background: linear-gradient(135deg, rgba(20, 20, 40, 0.5) 0%, rgba(30, 15, 50, 0.3) 100%);
    overflow-y: auto;
    scrollbar-width: thin;
    scrollbar-color: rgba(255, 255, 255, 0.1) transparent;
}

.calendar-body::-webkit-scrollbar {
    width: 6px;
}

.calendar-body::-webkit-scrollbar-track {
    background: transparent;
}

.calendar-body::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.1);
    border-radius: 3px;
}

.calendar-nav {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 16px;
}

.nav-btn {
    background: rgba(255, 255, 255, 0.1);
    border: none;
    color: rgba(255, 255, 255, 0.8);
    width: 32px;
    height: 32px;
    border-radius: 8px;
    cursor: pointer;
    font-size: 16px;
    transition: all 0.2s ease;
}

.nav-btn:hover {
    background: rgba(255, 255, 255, 0.2);
    color: white;
}

.current-month {
    color: rgba(255, 255, 255, 0.95);
    font-size: 16px;
    font-weight: 600;
    margin: 0;
}

.calendar-grid {
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    gap: 2px;
    margin-bottom: 16px;
}

.day-header {
    color: rgba(255, 255, 255, 0.6);
    font-size: 12px;
    font-weight: 600;
    text-align: center;
    padding: 6px 0;
    text-transform: uppercase;
    letter-spacing: 0.5px;
}

.calendar-day {
    height: 30px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-start;
    padding: 1px;
    border-radius: 6px;
    cursor: pointer;
    transition: all 0.2s ease;
    position: relative;
}

.calendar-day:hover {
    background: rgba(255, 255, 255, 0.05);
}

.calendar-day.today {
    background: rgba(255, 107, 107, 0.2);
    border: 1px solid rgba(255, 107, 107, 0.3);
}

.calendar-day.selected {
    background: rgba(255, 97, 89, 0.3);
    border: 1px solid #ff6159;
}

.calendar-day.birthday {
    background: linear-gradient(135deg, rgba(255, 107, 107, 0.3), rgba(255, 182, 193, 0.3));
    border: 1px solid rgba(255, 107, 107, 0.5);
}

.calendar-day.event-day {
    border: 1px solid rgba(255, 255, 255, 0.1);
}

.day-number {
    font-size: 12px;
    font-weight: 500;
    color: rgba(255, 255, 255, 0.9);
    margin-bottom: 1px;
}

.day-events {
    display: flex;
    flex-wrap: wrap;
    gap: 1px;
    justify-content: center;
}

.event-indicator {
    width: 4px;
    height: 4px;
    border-radius: 50%;
    flex-shrink: 0;
}

.event-indicator.holiday {
    background: #ff6159;
}

.event-indicator.celebration {
    background: #ffbd44;
}

.event-indicator.fun {
    background: #27c93f;
}

.event-indicator.birthday {
    background: #ff69b4;
}

.event-indicator.awareness {
    background: #00d4ff;
}

.event-indicator.education {
    background: #9c27b0;
}

.event-indicator.nature {
    background: #4caf50;
}

.date-details {
    border-top: 1px solid rgba(255, 255, 255, 0.05);
    padding-top: 16px;
}

.selected-date-title {
    color: rgba(255, 255, 255, 0.95);
    font-size: 15px;
    font-weight: 600;
    margin: 0 0 16px 0;
}

.birthday-surprise {
    background: linear-gradient(135deg, rgba(255, 107, 107, 0.1), rgba(255, 182, 193, 0.1));
    border: 1px solid rgba(255, 107, 107, 0.3);
    border-radius: 12px;
    padding: 16px;
    margin-bottom: 16px;
}

.birthday-message {
    text-align: center;
}

.birthday-icon {
    font-size: 32px;
    margin-bottom: 8px;
}

.birthday-message h4 {
    color: #ff69b4;
    font-size: 16px;
    font-weight: 700;
    margin: 0 0 8px 0;
}

.birthday-message p {
    color: rgba(255, 255, 255, 0.8);
    font-size: 13px;
    line-height: 1.4;
    margin: 0 0 12px 0;
}

.birthday-gift {
    background: rgba(255, 255, 255, 0.05);
    border-radius: 8px;
    padding: 12px;
}

.gift-box {
    font-size: 24px;
    margin-bottom: 4px;
}

.gift-message {
    color: rgba(255, 255, 255, 0.9);
    font-size: 13px;
    font-weight: 600;
    margin: 0;
}

.events-list {
    margin-top: 12px;
}

.events-list h4 {
    color: rgba(255, 255, 255, 0.8);
    font-size: 13px;
    font-weight: 600;
    margin: 0 0 8px 0;
}

.event-item {
    background: rgba(255, 255, 255, 0.05);
    border-radius: 6px;
    padding: 8px 12px;
    margin-bottom: 6px;
    border-left: 3px solid;
}

.event-item.holiday {
    border-left-color: #ff6159;
}

.event-item.celebration {
    border-left-color: #ffbd44;
}

.event-item.fun {
    border-left-color: #27c93f;
}

.event-item.birthday {
    border-left-color: #ff69b4;
}

.event-item.awareness {
    border-left-color: #00d4ff;
}

.event-item.education {
    border-left-color: #9c27b0;
}

.event-item.nature {
    border-left-color: #4caf50;
}

.event-time {
    color: rgba(255, 255, 255, 0.6);
    font-size: 11px;
    font-weight: 500;
    margin-bottom: 2px;
}

.event-title {
    color: rgba(255, 255, 255, 0.9);
    font-size: 12px;
    font-weight: 600;
    margin-bottom: 2px;
}

.event-description {
    color: rgba(255, 255, 255, 0.7);
    font-size: 11px;
    line-height: 1.3;
}

.no-events {
    text-align: center;
    padding: 20px;
}

.no-events p {
    color: rgba(255, 255, 255, 0.5);
    font-size: 14px;
    margin: 0;
}

/* Resize Handles */
.resize-handle {
    position: absolute;
    background: transparent;
}

.resize-right {
    right: 0;
    top: 36px;
    bottom: 0;
    width: 10px;
    cursor: ew-resize;
}

.resize-bottom {
    left: 0;
    right: 0;
    bottom: 0;
    height: 10px;
    cursor: ns-resize;
}

.resize-corner {
    right: 0;
    bottom: 0;
    width: 20px;
    height: 20px;
    cursor: nw-resize;
}

/* Mobile Mode Styles */
.mobile-mode .calendar-header {
    display: none;
}

.mobile-mode .resize-handle {
    display: none;
}

.mobile-mode .calendar-container {
    position: static !important;
    border-radius: 0 !important;
    box-shadow: none !important;
    z-index: auto !important;
}

.mobile-mode .calendar-body {
    padding: 16px;
    height: calc(100vh - 56px);
    overflow-y: auto;
}

/* Mobile Header Styles */
.mobile-header {
    height: 56px;
    background: rgba(30, 30, 30, 0.95);
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 16px;
    flex-shrink: 0;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.back-btn {
    background: none;
    border: none;
    color: #007AFF;
    font-size: 17px;
    padding: 8px 0;
    cursor: pointer;
    min-width: 80px;
    text-align: left;
}

.mobile-title {
    color: white;
    font-size: 17px;
    font-weight: 600;
    flex: 1;
    text-align: center;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    padding: 0 8px;
}

.spacer {
    min-width: 80px;
}

/* Responsive adjustments */
@media (max-width: 600px) {
    .calendar-nav {
        margin-bottom: 16px;
    }

    .current-month {
        font-size: 16px;
    }

    .calendar-grid {
        gap: 2px;
    }

    .day-header {
        font-size: 11px;
        padding: 6px 0;
    }

    .calendar-day {
        padding: 2px;
    }

    .day-number {
        font-size: 13px;
    }
}
</style>