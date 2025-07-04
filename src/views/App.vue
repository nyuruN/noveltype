<script setup lang="ts">
import Nav from '@/components/Nav.vue';
import { useTypingStore } from '@/stores/typing';
import TypingView from './TypingView.vue';
import { storeToRefs } from 'pinia';
import { useThemeStore } from '@/stores/theme';
import { useWindowStore } from '@/stores/window';
import Background from './Background.vue';

const { showTyper } = storeToRefs(useTypingStore())
const windowStore = useWindowStore()
const { pos, size, fullscreen } = storeToRefs(windowStore)

// Init theme
useThemeStore()

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
    if (fullscreen.value)
        return

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

    // Center of simulated window
    let center = {
        x: pos.value.x + size.value.x / 2,
        y: pos.value.y + size.value.y / 2
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
    if (drag) {
        fitWindow()
        drag = false
        move = false
    }
})
function fitWindow(center?: boolean) {
    if (center) {
        pos.value.x = (window.innerWidth - size.value.x) / 2
        pos.value.y = (window.innerHeight - size.value.y) / 2
    } else {
        // horizontal clipping
        if (pos.value.x < 0) {
            pos.value.x = 0
        }
        if (pos.value.x + size.value.x > window.innerWidth) {
            pos.value.x = window.innerWidth - size.value.x;
            if (size.value.x > window.innerWidth) {
                size.value.x = window.innerWidth
                pos.value.x = 0;
            }
        }
        // vertical clipping
        if (pos.value.y < 0) {
            pos.value.y = 0
        }
        if (pos.value.y + size.value.y > window.innerHeight) {
            pos.value.y = window.innerHeight - size.value.y;
            if (size.value.y > window.innerHeight) {
                size.value.y = window.innerHeight
                pos.value.y = 0;
            }
        }
    }
    windowStore.applyLayout()
}
let time = 0
function grabClicked() {
    let current = Date.now()
    if (current - time < 250) {
        fitWindow(true)
    }
    time = current
}
function toggleFullscreen() {
    let current = Date.now()
    if (current - time < 250) {
        fullscreen.value = !fullscreen.value
        windowStore.applyLayout()
    }
    time = current
}
</script>

<template>
    <div>
        <Background />
        <div id="app-window">
            <div id="app-container" class="relative" :style="{ borderRadius: fullscreen ? '0px' : '16px' }">
                <div class="center-container" v-show="!showTyper">
                    <Nav></Nav>
                    <main class="view-container">
                        <RouterView />
                    </main>
                </div>

                <TypingView v-show="showTyper"></TypingView>
            </div>

            <div class="grab w" @mousedown="dragStart({ y: true })" @click="grabClicked"></div>
            <div class="grab e" @mousedown="dragStart({ y: true })" @click="grabClicked"></div>
            <div class="grab n" @mousedown="dragStart({}, true)" @click="toggleFullscreen"></div>
            <div class="grab s" @mousedown="dragStart({ x: true })" @click="grabClicked"></div>

            <div class="grab corner nw" @mousedown="dragStart({})"></div>
            <div class="grab corner ne" @mousedown="dragStart({})"></div>
            <div class="grab corner se" @mousedown="dragStart({})"></div>
            <div class="grab corner sw" @mousedown="dragStart({})"></div>
        </div>
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
    /* border-radius: 16px; */

    -webkit-backdrop-filter: blur(var(--blur-amount));
    backdrop-filter: blur(var(--blur-amount));
    background-color: var(--ui-main-bg);

    overflow-x: hidden;

    transition: var(--ui-bg-transition);
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
</style>
