<script setup>
import { onMounted, onUnmounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth } from '../src/firebase';

const props = defineProps({
  userInitials: {
    type: String,
    default: 'JD',
  },
});

const emit = defineEmits(['avatar-click']);

const route = useRoute();
const router = useRouter();
const isSidebarOpen = ref(false);
const userName = ref('Juan dela Cruz');
const userDetail = ref('CCS · 2nd Year');

let unsubscribeAuth = null;

const navLinks = [
  { label: 'Menu', name: 'menu' },
  { label: 'Inbox', name: 'inbox' },
  { label: 'Events', name: 'events' },
];

const sidebarLinks = [
  { label: 'Outdoor Sports', action: () => router.push({ name: 'events', query: { category: 'outdoor' } }) },
  { label: 'Esports', action: () => router.push({ name: 'events', query: { category: 'esports' } }) },
  { label: 'Board Games', action: () => router.push({ name: 'events', query: { category: 'boardgames' } }) },
  { label: 'Musical Arts', action: () => router.push({ name: 'events', query: { category: 'musical' } }) },
  { label: 'Inbox', action: () => router.push({ name: 'inbox' }) },
  { label: 'Register', action: () => router.push({ name: 'register' }) },
];

function isActive(name) {
  return route.name === name;
}

function goTo(name) {
  router.push({ name });
}

function handleAvatarClick() {
  isSidebarOpen.value = true;
  emit('avatar-click');
}

function closeSidebar() {
  isSidebarOpen.value = false;
}

function runSidebarAction(action) {
  closeSidebar();
  action();
}

async function handleSignOut() {
  closeSidebar();
  try {
    await signOut(auth);
  } finally {
    router.push({ name: 'login' });
  }
}

function deriveProfile(user) {
  const fallbackName = 'Juan dela Cruz';
  const displayName = user?.displayName || fallbackName;
  userName.value = displayName;

  userDetail.value = user?.email ? 'CCS · 2nd Year' : 'CCS · 2nd Year';
}

onMounted(() => {
  deriveProfile(auth.currentUser);
  unsubscribeAuth = onAuthStateChanged(auth, (user) => {
    deriveProfile(user);
  });
});

onUnmounted(() => {
  if (unsubscribeAuth) {
    unsubscribeAuth();
  }
});
</script>

<template>
  <div>
    <div class="topbar">
      <div class="topbar-brand">
        <div class="topbar-logo">ADNU</div>
        <div class="topbar-title">
          ATENEO DE NAGA UNIVERSITY<span>Intramurals 2026</span>
        </div>
      </div>

      <div class="topbar-nav">
        <a v-for="link in navLinks" :key="link.name" :class="{ active: isActive(link.name) }" @click="goTo(link.name)">
          {{ link.label }}
        </a>
      </div>

      <div class="topbar-actions">
        <button class="avatar" type="button" @click="handleAvatarClick">
          {{ userInitials }}
        </button>
      </div>
    </div>

    <transition name="sidebar-fade">
      <div v-if="isSidebarOpen" class="sidebar-overlay" @click="closeSidebar"></div>
    </transition>

    <transition name="sidebar-slide">
      <aside v-if="isSidebarOpen" class="profile-sidebar" @click.stop>
        <div class="profile-card">
          <button class="sidebar-close" type="button" @click="closeSidebar">×</button>
          <div class="profile-avatar">{{ userInitials }}</div>
          <div class="profile-name">{{ userName }}</div>
          <div class="profile-detail">{{ userDetail }}</div>
        </div>

        <button class="sidebar-action dashboard" type="button"
          @click="runSidebarAction(() => router.push({ name: 'menu' }))">
          Dashboard
        </button>

        <nav class="sidebar-links">
          <button v-for="item in sidebarLinks" :key="item.label" type="button" class="sidebar-link"
            @click="runSidebarAction(item.action)">
            {{ item.label }}
          </button>
        </nav>

        <div class="sidebar-divider"></div>

        <button class="sidebar-action signout" type="button" @click="handleSignOut">
          Sign Out
        </button>
      </aside>
    </transition>
  </div>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Rajdhani:wght@500;600;700&family=Inter:wght@300;400;500;600&display=swap');

.topbar {
  background: #1a1f5e;
  border-bottom: 1px solid rgba(255, 255, 255, 0.12);
  padding: 10px 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  position: sticky;
  top: 0;
  z-index: 100;
  font-family: 'Inter', sans-serif;
  color: #ffffff;
}

.topbar-brand {
  display: flex;
  align-items: center;
  gap: 10px;
}

.topbar-logo {
  width: 42px;
  height: 36px;
  border-radius: 8px;
  background: #2d2fa8;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: 'Rajdhani', sans-serif;
  font-weight: 700;
  font-size: 14px;
  color: #ffffff;
  flex-shrink: 0;
}

.topbar-title {
  font-family: 'Rajdhani', sans-serif;
  font-weight: 700;
  font-size: 11px;
  line-height: 1.2;
  letter-spacing: 0.5px;
}

.topbar-title span {
  display: block;
  color: #9ea3c8;
  font-size: 10px;
  font-weight: 500;
}

.topbar-nav {
  display: flex;
  gap: 4px;
}

.topbar-nav a {
  padding: 5px 12px;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 500;
  color: #9ea3c8;
  text-decoration: none;
  cursor: pointer;
  transition: all 0.2s;
}

.topbar-nav a:hover,
.topbar-nav a.active {
  background: #2d2fa8;
  color: #ffffff;
}

.topbar-actions {
  display: flex;
  align-items: center;
  gap: 8px;
}

.avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: #4b4fd9;
  border: 2px solid #00c9b1;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  border: none;
  color: #ffffff;
}

.sidebar-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.6);
  z-index: 200;
}

.profile-sidebar {
  position: fixed;
  top: 0;
  right: 0;
  width: 260px;
  height: 100vh;
  background: #1a1f5e;
  border-left: 1px solid rgba(255, 255, 255, 0.08);
  box-shadow: -18px 0 42px rgba(0, 0, 0, 0.38);
  z-index: 201;
  padding: 24px 20px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.profile-card {
  position: relative;
  padding: 0 0 12px;
}

.sidebar-close {
  border: none;
  background: none;
  color: #9ea3c8;
  font-size: 18px;
  line-height: 1;
  cursor: pointer;
  padding: 0;
  align-self: flex-start;
}

.profile-avatar {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  border: 2px solid #00c9b1;
  background: #4b4fd9;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  margin-bottom: 8px;
}

.profile-name {
  font-size: 14px;
  font-weight: 700;
  color: #ffffff;
  line-height: 1.2;
}

.profile-detail {
  color: #9ea3c8;
  font-size: 11px;
  margin-top: 4px;
}

.sidebar-action,
.sidebar-link {
  width: 100%;
  border: none;
  cursor: pointer;
  text-align: center;
  border-radius: 10px;
  font-weight: 600;
  transition: transform 0.2s, background 0.2s, color 0.2s;
}

.sidebar-action.dashboard {
  padding: 11px 14px;
  background: rgba(75, 79, 217, 0.22);
  color: #ffffff;
}

.sidebar-action.signout {
  margin-top: 8px;
  padding: 12px 14px;
  background: transparent;
  color: #ffffff;
  border: 1px solid rgba(255, 255, 255, 0.12);
}

.sidebar-links {
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding-top: 2px;
}

.sidebar-link {
  padding: 11px 14px;
  background: transparent;
  color: #ffffff;
  font-size: 14px;
}

.sidebar-link:hover,
.sidebar-action:hover {
  transform: translateY(-1px);
  background: rgba(255, 255, 255, 0.08);
}

.sidebar-divider {
  height: 1px;
  background: rgba(255, 255, 255, 0.12);
  margin: 4px 0;
}

.sidebar-fade-enter-active,
.sidebar-fade-leave-active {
  transition: opacity 0.2s ease;
}

.sidebar-fade-enter-from,
.sidebar-fade-leave-to {
  opacity: 0;
}

.sidebar-slide-enter-active,
.sidebar-slide-leave-active {
  transition: transform 0.25s ease, opacity 0.25s ease;
}

.sidebar-slide-enter-from,
.sidebar-slide-leave-to {
  transform: translateX(100%);
  opacity: 0;
}

@media (max-width: 640px) {
  .topbar-nav {
    display: none;
  }
}
</style>