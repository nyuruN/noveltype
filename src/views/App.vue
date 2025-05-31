<script setup lang="ts">
import { useTypingStore } from '@/stores/typing';
import TypingView from './TypingView.vue';
import { storeToRefs } from 'pinia';
import { useThemeStore } from '@/stores/theme';

const { showTyper } = storeToRefs(useTypingStore())

// Init theme
useThemeStore()
</script>

<template>
  <div class="app-container relative">
    <div class="center-container" v-show="!showTyper">
      <nav class="nav">
        <div class="nav-items">
          <button class="nav-item" @click="$router.push('/')">
            <font-awesome-icon :icon="['fas', 'book-open']" fixed-width />
            <span style="margin-left: 0.5rem;">Library</span>
          </button>
          <button class="nav-item" @click="$router.push('/themes')">
            <font-awesome-icon :icon="['fas', 'palette']" fixed-width />
            <span style="margin-left: 0.5rem;">Themes</span>
          </button>
          <button class="nav-item" @click="$router.push('/settings')">
            <font-awesome-icon :icon="['fas', 'gear']" fixed-width />
            <span style="margin-left: 0.5rem;">Settings</span>
          </button>
        </div>
        <div class="grow"></div>
        <button class="nav-item" style="font-size: 1.1rem" @click="showTyper = true">
          <font-awesome-icon :icon="['fas', 'keyboard']" fixed-width />
          <span style="margin-left: 0.5rem;">Resume</span>
        </button>
      </nav>
      <main class="view-container">
        <RouterView />
      </main>
    </div>

    <TypingView v-show="showTyper"></TypingView>
  </div>
</template>

<style>
@media screen and (max-width: 950px) {
  .nav-item span {
    display: none;
  }
}

.nav-item {
  padding: 1rem 1rem;
  font-size: 1.2rem;
  background-color: transparent;
  color: var(--ui-nav-text);
  border: none;
  border-radius: 8px;
  user-select: none;
  cursor: pointer;
  display: flex;
  align-items: center;
}

.nav-item:hover {
  background-color: var(--ui-nav-hover);
}

.nav {
  width: fit-content;
  padding: 2rem 0.5rem;
  display: flex;
  flex-direction: column;
  background-color: var(--ui-nav-bg);
}

.view-container {
  flex-grow: 1;
  padding: 2rem;
  background-color: var(--ui-main-bg);
  scroll-behavior: auto !important;
  overflow-y: auto;
  position: relative;
}

.center-container {
  display: flex;
  flex-direction: row;

  height: 100%;
}

.app-container {
  width: 100%;
  height: 100%;
  border-radius: 16px;

  -webkit-backdrop-filter: blur(var(--blur-amount));
  backdrop-filter: blur(var(--blur-amount));

  overflow-x: hidden;
}

#app {
  width: 100%;
  height: 100%;
  padding: var(--app-padding);
}
</style>
