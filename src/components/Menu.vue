<script setup lang="ts">
import { nextTick } from 'vue'
import { storeToRefs } from 'pinia'
import { useSessionStore } from '@/stores/library'

import Nav from './Nav.vue'

const { chapter, isTyping } = storeToRefs(useSessionStore())

async function next() { let p = chapter.value?.next(); if (p) { chapter.value = await p; await nextTick(); chapter.value.resetCaret() } }
async function prev() { let p = chapter.value?.prev(); if (p) { chapter.value = await p; await nextTick(); chapter.value.resetCaret() } }
</script>

<template>
    <div id="menu-items">
        <button @click="isTyping = false" class="menu-button">
            <font-awesome-icon :icon="['fas', 'home']" fixed-width />
        </button>

        <Nav>
            <font-awesome-icon :icon="['fas', 'bars']" fixed-width />
        </Nav>

        <span v-if="chapter" class="title">{{
            chapter.title }}</span>
        <span v-else style="flex-grow: 1;">Select a book from Library to get started</span>

        <!-- <Nav style="flex-grow: 1;">
            <span v-if="chapter" class="title">{{
                chapter.title }}</span>
            <span v-else>Select a book from Library to get started</span>
        </Nav> -->

        <template v-if="chapter">
            <button @click="prev" class="menu-button">
                <font-awesome-icon :icon="['fas', 'caret-left']" fixed-width />
            </button>
            <button @click="next" class="menu-button">
                <font-awesome-icon :icon="['fas', 'caret-right']" fixed-width />
            </button>
        </template>
    </div>
</template>

<style scoped>
#menu-items {
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: .3rem;
    padding: .3rem;
    background-color: #363636;
    border-radius: 10px;
    margin-bottom: 1rem;
}

.title {
    flex-grow: 1;
    text-align: center;
    text-overflow: ellipsis;
    text-wrap: nowrap;
    overflow: hidden;
}

.menu-button {
    border-radius: 8px;
    border: 0;
    padding: 0.4rem 0.6rem;
    font-size: 1.1rem;
    line-height: normal;
    background-color: transparent;
    color: #808080;
    cursor: pointer;

    transition: color 0.25s;
}

.menu-button:hover {
    color: #c4c4c4;
}
</style>