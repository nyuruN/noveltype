<script setup lang="ts">
import { nextTick, ref } from 'vue'
import { useLibraryStore } from '../stores/library'
import { storeToRefs } from 'pinia'

const { library, book, chapter } = storeToRefs(useLibraryStore())

let showTOC = ref(false)

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
async function toChapter(n: number) { let c = book.value?.getChapter(n); if (c) { chapter.value = await c; await nextTick(); chapter.value.resetCaret() } }
</script>

<template>
    <div id="options">
        <button id="toc" class="button active-border" v-if="book" @click="showTOC = !showTOC">
            <font-awesome-icon :icon="['fas', 'bars']" fixed-width />
            <div id="toc-container">
                <div v-if="book" id="toc-content" class="thin-scrollbar" :style="{ left: showTOC ? '0px' : '-100vw' }">
                    <ul v-for="(arr, index) in book?.toc" @click="toChapter(index)">
                        {{ arr[0] }}
                    </ul>
                </div>
                <div v-if="showTOC" id="toc-screenquad"></div>
            </div>
        </button>

        <button class="button active-border" onclick="document.getElementById('file-input').click();">
            <font-awesome-icon :icon="['fas', 'folder-open']" fixed-width />
            <input id='file-input' type="file" accept=".epub" @change="loadEpub" style="display: none;" />
        </button>

        <span v-if="chapter" style="flex-grow: 1; text-align: center; text-overflow: ellipsis; overflow: hidden; text-wrap: nowrap;">{{ chapter.title }}</span>
        <span v-if="!chapter" style="flex-grow: 1;">Upload a <b>*.epub</b> file to get started</span>

        <button v-if="chapter" @click="prev" class="button active-border">
            <font-awesome-icon :icon="['fas', 'caret-left']" fixed-width />
        </button>

        <button v-if="chapter" @click="next" class="button active-border">
            <font-awesome-icon :icon="['fas', 'caret-right']" fixed-width />
        </button>
    </div>
</template>

<style>
#toc-screenquad {
    cursor: default;
    display: block;
    position: fixed;
    top: 0;
    left: 0;
    height: 100%;
    width: 100%;
    z-index: 1;
}

#toc-content {
    display: flex;
    flex-direction: column;
    align-items: stretch;
    z-index: 2;
    position: fixed;
    top: 0;
    left: 0;
    min-width: 20rem;
    max-width: 50vw;
    height: 100%;

    background-color: #252525de;
    backdrop-filter: blur(4px);
    box-shadow: 0px 0px 30px 0px rgba(0, 0, 0, 0.5);

    scrollbar-width: thin;
    scrollbar-color: #757575 #ffffff00;
    overscroll-behavior: contain;
    overflow: scroll;
    overflow-x: hidden;

    transition: left 0.2s ease;
}

#toc-content>ul {
    text-wrap: wrap;
    text-align: left;
    padding-block-start: 1rem;
    padding-block-end: 1rem;
    margin-block-start: 0;
    margin-block-end: 0;
    user-select: none;

    transition: background-color 0.3s ease;
}

#toc-content>ul:hover {
    background-color: #474747;
}

#options {
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 0.75rem;
    padding: .3rem;
    background-color: #303030;
    border-radius: 10px;
    margin-bottom: 1rem;
}

.button {
    border-radius: 8px;
    padding: 0.5rem 1.0rem;
    font-size: 1rem;
    line-height: normal;
    background-color: #252525;
    cursor: pointer;
    border: 0;
}

.active-border {
    border: 1px solid transparent;
    transition: border-color 0.25s;
}

.active-border:hover {
    border-color: #646cff;
}
</style>