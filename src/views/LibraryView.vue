<script setup lang="ts">
import { saveEpub } from '@/db'
import { useLibraryStore, useSessionStore } from '@/stores/library'
import { storeToRefs } from 'pinia'

const { library } = storeToRefs(useLibraryStore())
const { book, chapter, isTyping } = storeToRefs(useSessionStore())

async function loadEpub(e: Event) {
    var input = e.target as HTMLInputElement

    if (!input.files || !input.files[0] || input.files[0].type !== 'application/epub+zip') {
        return
    }

    // Load book
    if (!library.value.exists(input.files[0].name)) {
        let epub = await library.value.loadBook(input.files[0])
        saveEpub(input.files[0])

        book.value = epub
        chapter.value = await epub.getChapter(0)
        isTyping.value = true
    }
}
async function triggerInput() {
    document.getElementById('file-input')?.click();
}
</script>

<template>
    <h1>Your Library</h1>
    <div class="book-container" style="margin-top: 2rem;">
        <template v-if="library.books.length > 0">
            <div v-for="book in library.books" class="card" @click="console.log('I\'m clicked!')">
                <div class="card-image">
                    <font-awesome-icon :icon="['fas', 'book']" fixed-width />
                </div>
                <div class="card-text">{{ book.title }}</div>
            </div>
        </template>
        <!-- <div v-else>
            Upload an *.epub file to get started
        </div> -->
        <div v-else class="card" @click="triggerInput">
            <input id='file-input' type="file" accept=".epub" @change="loadEpub" style="display: none;" />
            <div class="card-image">
                <font-awesome-icon :icon="['fas', 'plus']" fixed-width />
            </div>
            <div class="card-text">Upload from device</div>
        </div>
    </div>
</template>

<style>

.card-image {
    background-color: #888888;
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
    height: 18rem;
    width: 12rem;
}

.book-container {
    display: flex;
    flex-wrap: wrap;
    gap: 2rem;
}
</style>
