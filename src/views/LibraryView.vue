<script setup lang="ts">
import { saveEpubFile, loadEpubFile } from '@/db'
import type { BookRecord } from '@/library'
import { useLocalStore, useTempStore } from '@/stores/library'
import { storeToRefs } from 'pinia'

const { library } = storeToRefs(useLocalStore())
const { book, chapter, isTyping } = storeToRefs(useTempStore())

async function loadEpub(e: Event) {
    var input = e.target as HTMLInputElement

    if (!input.files || !input.files[0] || input.files[0].type !== 'application/epub+zip') {
        return
    }

    // Load book
    if (!library.value.exists(input.files[0].name)) {
        let epub = await library.value.loadBook(input.files[0])

        book.value = epub
        chapter.value = await epub.getChapter(0)

        await saveEpubFile(input.files[0])
    }
}
async function openBook(filename: string, _: number) {
    if (book.value?.record.filename == filename) {
        isTyping.value = true;
        return;
    }

    let file = await loadEpubFile(filename)
    let epub = await library.value.loadBook(file)

    book.value = epub
    chapter.value = await epub.getChapter(0)
    isTyping.value = true
}
async function triggerInput() {
    document.getElementById('file-input')?.click();
}
async function inspectBook(event: Event, _rec: BookRecord, _idx: number) {
    event.stopPropagation()

    // Change view to book inspection
}
</script>

<template>
    <h1>Your Library</h1>
    <div class="book-container" style="margin-top: 2rem;">
        <div v-for="(book, index) in library.books" class="card" @click="openBook(book.filename, index)">
            <div class="card-more" @click="event => inspectBook(event, book, index)">
                <font-awesome-icon :icon="['fas', 'ellipsis']" fixed-width />
            </div>
            <div class="card-image">
                <font-awesome-icon :icon="['fas', 'book']" fixed-width />
            </div>
            <div class="card-text">{{ book.title }}</div>
        </div>
        <div class="card" @click="triggerInput">
            <input id='file-input' type="file" accept=".epub" @change="loadEpub" style="display: none;" />
            <div class="card-image">
                <font-awesome-icon :icon="['fas', 'plus']" fixed-width />
            </div>
            <div class="card-text">Upload from device</div>
        </div>
    </div>
</template>

<style>
.card-more {
    position: absolute;
    top: 0;
    right: 0;
    padding: 0.4rem 0.5rem;
    font-size: 1.3em;
    border-radius: 8px;
    z-index: 1;
    opacity: 0;
}

.card:hover .card-more {
    opacity: 1;
    background-color: #42424250;
}

.card:hover .card-more:hover {
    background-color: #424242d2;
}


.card-image {
    background-color: #7e7e7e;
    height: 75%;
    border-radius: 8px;
    font-size: 9.5rem;
}

.card-text {
    text-align: center;
    width: 100%;
    margin-top: 0.5rem;
}

.card {
    position: relative;
    height: 20rem;
    width: 14rem;
    padding: 1rem;
    border-radius: 12px;
    overflow: hidden;
}

.card:hover {
    background-color: #575757;
    cursor: pointer;
}

.book-container {
    display: flex;
    flex-wrap: wrap;
    gap: 1rem;
}
</style>
