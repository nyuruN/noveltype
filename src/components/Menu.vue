<script setup lang="ts">
import { nextTick } from 'vue'
import { storeToRefs } from 'pinia'
import { useLibraryStore, useSessionStore } from '@/stores/library'

import Nav from './Nav.vue'

const { library } = storeToRefs(useLibraryStore())
const { book, chapter } = storeToRefs(useSessionStore())

async function loadEpub(e: Event) {
    var input = e.target as HTMLInputElement

    if (!input.files || !input.files[0] || input.files[0].type !== 'application/epub+zip') {
        return
    }

    // Load book
    book.value = await library.value.loadBook(input.files[0])

    // Load chapter
    chapter.value = await book.value.getChapter(0)

    nextTick().then(() => {
        chapter.value?.resetCaret()
    })
}
async function next() { let p = chapter.value?.next(); if (p) { chapter.value = await p; await nextTick(); chapter.value.resetCaret() } }
async function prev() { let p = chapter.value?.prev(); if (p) { chapter.value = await p; await nextTick(); chapter.value.resetCaret() } }
</script>

<template>
    <div id="menu-items">
        <Nav></Nav>

        <!-- <button class="menu-button">
            <font-awesome-icon :icon="['fas', 'gear']" fixed-width />
        </button> -->

        <button class="menu-button" onclick="document.getElementById('file-input').click();">
            <font-awesome-icon :icon="['fas', 'folder-open']" fixed-width />
            <input id='file-input' type="file" accept=".epub" @change="loadEpub" style="display: none;" />
        </button>

        <span v-if="chapter" class="title">{{
                chapter.title }}</span>
        <span v-else style="flex-grow: 1;">Upload a <b>*.epub</b> file to get started</span>

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
    background-color: #303030;
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