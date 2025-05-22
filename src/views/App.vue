<script setup lang="ts">
import { useSessionStore } from '@/stores/library';
import TypingView from './TypingView.vue';
import { storeToRefs } from 'pinia';

const { isTyping } = storeToRefs(useSessionStore())
</script>

<template>
  <div class="app-container">
    <div class="center-container" v-show="!isTyping">
      <nav class="nav">
        <div class="nav-item">
          <font-awesome-icon :icon="['fas', 'book-open']" fixed-width />
          <span style="margin-left: 0.5rem;">Library</span>
        </div>
        <div class="nav-item">
          <font-awesome-icon :icon="['fas', 'gear']" fixed-width />
          <span style="margin-left: 0.5rem;">Settings</span>
        </div>
      </nav>
      <div class="view-container">
        <RouterView />
      </div>
    </div>

    <TypingView v-show="isTyping"></TypingView>
  </div>
</template>

<style>
.nav-item {
  padding: 1rem 1rem;
  font-size: 1.2rem;
}
.nav {
  min-width: 15%;
  max-width: 25%;
  padding: 1rem;
  display: flex;
  flex-direction: column;
}

.view-container {
  flex-grow: 1;
  padding: 2rem;
  background-color: #525252;
}

.center-container {
  display: flex;
  flex-direction: row;

  height: 100%;
}

.app-container {
  width: 100%;
  height: 100%;
  background-color: #444444;
  border-radius: 16px;

  overflow: hidden;
}

#app {
  width: 100%;
  height: 100%;
  padding: 2rem;
}

:root {
  font-family: system-ui, Avenir, Helvetica, Arial, sans-serif;
  font-weight: normal;

  color-scheme: light dark;
  color: rgba(255, 255, 255, 0.87);
  /* background-color: #292929; */
  background-image: url(https://images.unsplash.com/photo-1745669754254-c30c98e5f8b1?w=2070&auto=format&fit=crop);

  font-synthesis: none;
  text-rendering: optimizeLegibility;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

html,
body {
  height: 100%;
  margin: 0;
  scrollbar-width: thin;
  scroll-behavior: smooth;
  scrollbar-color: #757575 #ffffff00;
}

* {
  box-sizing: border-box;
}
</style>
