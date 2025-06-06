<script setup lang="ts">
import { useTypingStore } from '@/stores/typing';
import TypingView from './TypingView.vue';
import { storeToRefs } from 'pinia';
import { useThemeStore } from '@/stores/theme';
import { useWindowStore } from '@/stores/window';

const { showTyper } = storeToRefs(useTypingStore())
const windowStore = useWindowStore()
const { pos, size } = storeToRefs(windowStore)

// Init theme
useThemeStore()

function resumeTyping() {
  showTyper.value = true
}
function clearSelection() {
  if (!window.getSelection) return

  let selection = window.getSelection()
  if (!selection) return

  selection.empty();
  selection.removeAllRanges();
}

let drag = false
let move = false
let lock = {
  x: false,
  y: false
};

function dragStart(axisLock: { x?: boolean, y?: boolean }, moveOnly?: boolean) {
  lock = {
    x: Boolean(axisLock.x),
    y: Boolean(axisLock.y)
  }
  drag = true
  move = Boolean(moveOnly)
  clearSelection()
}
document.addEventListener('mousemove', ev => {
  if (!drag) return

  if (move) {
    pos.value.x += ev.movementX
    pos.value.y += ev.movementY
    windowStore.applyLayout()
    return
  }

  let app = document.getElementById('app-window') as HTMLElement

  // Center of simulated window
  let center = {
    x: pos.value.x + app.clientWidth / 2,
    y: pos.value.y + app.clientHeight / 2
  }

  // Determines resize property
  if (!lock.x && ev.clientX < center.x) { // Left
    pos.value.x += ev.movementX
    size.value.x -= ev.movementX
  } else if (!lock.x && ev.clientX > center.x) {
    size.value.x += ev.movementX
  }
  if (!lock.y && ev.clientY < center.y) {
    pos.value.y += ev.movementY
    size.value.y -= ev.movementY
  } else if (!lock.y && ev.clientY > center.y) {
    size.value.y += ev.movementY
  }

  windowStore.applyLayout()
})
document.addEventListener('mouseup', _ => {
  if (drag)
    drag = false
  move = false
})
</script>

<template>
  <div id="app-window">
    <div id="app-container" class="relative">
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
          <button class="nav-item" style="font-size: 1.1rem" @click="resumeTyping">
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

    <div class="grab w" @mousedown="dragStart({ y: true })"></div>
    <div class="grab e" @mousedown="dragStart({ y: true })"></div>
    <div class="grab n" @mousedown="dragStart({}, true)"></div>
    <div class="grab s" @mousedown="dragStart({ x: true })"></div>

    <div class="grab corner nw" @mousedown="dragStart({})"></div>
    <div class="grab corner ne" @mousedown="dragStart({})"></div>
    <div class="grab corner se" @mousedown="dragStart({})"></div>
    <div class="grab corner sw" @mousedown="dragStart({})"></div>
  </div>
</template>

<style scoped>
#app-window {
  position: absolute;
  top: 10%;
  left: 10%;
  width: 80%;
  height: 80%;
  --grab-width: 8px;
  --grab-offset: -4px;
}

#app-container {
  width: 100%;
  height: 100%;
  border-radius: 16px;

  -webkit-backdrop-filter: blur(var(--blur-amount));
  backdrop-filter: blur(var(--blur-amount));
  background-color: var(--ui-main-bg);

  overflow-x: hidden;
}

.grab {
  position: absolute;
  user-select: none;
  /* border-radius: var(--grab-width); */
}

/* .grab:hover {
  background-color: var(--ui-border-active);
} */

.grab.corner {
  z-index: 1;
  width: calc(var(--grab-width) * 2.25);
  height: calc(var(--grab-width) * 2.25);
}

.grab.n:hover {
  cursor: move !important;
}

.sw {
  left: var(--grab-offset);
  bottom: var(--grab-offset);
}

.se {
  right: var(--grab-offset);
  bottom: var(--grab-offset);
}

.ne {
  right: var(--grab-offset);
  top: var(--grab-offset);
}

.nw {
  left: var(--grab-offset);
  top: var(--grab-offset);
}

.n,
.s {
  left: 0;
  width: 100%;
  height: var(--grab-width);
}

.w,
.e {
  top: 0;
  height: 100%;
  width: var(--grab-width);
}

.w {
  left: var(--grab-offset);
}

.n {
  top: var(--grab-offset);
}

.e {
  right: var(--grab-offset);
}

.s {
  bottom: var(--grab-offset);
}

.w:hover,
.e:hover {
  cursor: ew-resize;
}

.n:hover,
.s:hover {
  cursor: ns-resize;
}

.grab.sw:hover {
  cursor: sw-resize;
}

.grab.se:hover {
  cursor: se-resize;
}

.grab.ne:hover {
  cursor: ne-resize;
}

.grab.nw:hover {
  cursor: nw-resize;
}

.nav-item {
  width: 100%;
  padding: 0.8rem 1rem;
  font-size: 1.2rem;
  background-color: transparent;
  color: var(--ui-nav-text);
  border: none;
  border-radius: 8px;
  user-select: none;
  cursor: pointer;
  display: flex;
  align-items: center;

  transition: var(--ui-bg-transition);
}

.nav-item:hover,
.nav-item:focus-visible {
  outline: none;
  background-color: var(--ui-nav-hover);
}

.nav {
  min-width: 10rem;
  padding: 2rem 0.5rem;
  display: flex;
  flex-direction: column;
  background-color: var(--ui-nav-bg);
  border-right: 1px solid var(--ui-border);
  overflow: hidden;
}

@media screen and (max-width: 950px) {
  .nav-item span {
    display: none;
  }

  .nav-item {
    width: fit-content;
    padding: 0.8rem 0.6rem;
  }

  .nav {
    min-width: fit-content;
  }
}


.view-container {
  flex-grow: 1;
  padding: 1.5rem;
  scrollbar-width: thin;
  overflow-y: auto;
  position: relative;
}

.center-container {
  display: flex;
  flex-direction: row;

  height: 100%;
}
</style>
