<script setup lang="ts">
import { useTypingStore } from '@/stores/typing';
import TypingView from './TypingView.vue';
import { storeToRefs } from 'pinia';

const { isTyping } = storeToRefs(useTypingStore())
</script>

<template>
  <div class="app-container">
    <div class="center-container" v-show="!isTyping">
      <nav class="nav">
        <div class="nav-items">
          <div class="nav-item" @click="$router.push('/')">
            <font-awesome-icon :icon="['fas', 'book-open']" fixed-width />
            <span style="margin-left: 0.5rem;">Library</span>
          </div>
          <div class="nav-item" @click="$router.push('/settings')">
            <font-awesome-icon :icon="['fas', 'gear']" fixed-width />
            <span style="margin-left: 0.5rem;">Settings</span>
          </div>
        </div>
        <div style="flex-grow: 1;"></div>
        <div class="nav-item" style="font-size: 1.1rem" @click="isTyping = true">
          <font-awesome-icon :icon="['fas', 'keyboard']" fixed-width />
          <span style="margin-left: 0.5rem;">Resume</span>
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
  border-radius: 8px;
  user-select: none;
  cursor: pointer;
}

.nav-item:hover {
  background-color: #525252;
}

.nav {
  min-width: 15%;
  max-width: 25%;
  padding: 2rem 0.5rem;
  display: flex;
  flex-direction: column;
}

.view-container {
  flex-grow: 1;
  padding: 2rem;
  background-color: #525252;
  overflow-y: scroll;
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
  background-color: #444444;
  border-radius: 16px;

  overflow-x: hidden;
}

#app {
  width: 100%;
  height: 100%;
  padding: 2rem;
}
</style>
