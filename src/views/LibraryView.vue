<script setup lang="ts">
import { saveEpubFile, loadEpubFile } from '@/lib/db'
import { useLibraryStore, type BookRecord } from '@/stores/library'
import { useTypingStore } from '@/stores/typing'
import { storeToRefs } from 'pinia'

const library = useLibraryStore()
const { book, chapter, showTyper } = storeToRefs(useTypingStore())

async function loadEpub(e: Event) {
    var input = e.target as HTMLInputElement

    if (!input.files || !input.files[0] || input.files[0].type !== 'application/epub+zip') {
        return
    }

    // Load book
    if (!library.exists(input.files[0].name)) {
        let epub = await library.loadBook(input.files[0])

        book.value = epub
        chapter.value = await epub.getChapter(0)

        await saveEpubFile(input.files[0])
    }
}
async function openBook(filename: string, chapterIdx?: number, paragraphIdx?: number) {
    // Open book if not already
    if (book.value?.record.filename != filename) {
        let file = await loadEpubFile(filename)
        let epub = await library.loadBook(file)

        book.value = epub
        chapter.value = await epub.getChapter(chapterIdx ? chapterIdx : 0)
    }
    // Open chapter if not already
    else if (chapter.value?.index != chapterIdx) {
        chapter.value = await book.value.getChapter(chapterIdx ? chapterIdx : 0)
    }

    chapter.value?.goTo(paragraphIdx ? paragraphIdx : 0)
    showTyper.value = true
}
async function triggerInput() {
    document.getElementById('file-input')?.click();
}
async function inspectBook(_rec: BookRecord) {
    // Change view to book inspection
}
</script>

<template>
    <h1>Library</h1>

    <div class="container" v-if="library.hasBookmarks">
        <h2 style="margin: 0.5rem 0 1rem;">Bookmarks</h2>
        <div class="bookmarks flex-col" style="gap: 1rem;">
            <template v-for="book in library.books">
                <div class="bookmark-entry flex" v-for="bookmark in book.bookmarks">
                    <div class="cover relative" @click="openBook(book.filename, bookmark.chapter, bookmark.paragraph)">
                        <font-awesome-icon :icon="['fas', 'book']" fixed-width class="absolute-center" />
                        <div class="play-icon">
                            <font-awesome-icon :icon="['fas', 'play']" fixed-width class="absolute-center" />
                        </div>
                    </div>
                    <span> {{ book.title }} </span>
                    <span> {{ book.toc[bookmark.chapter] }} </span>
                    <span> Chapter {{ bookmark.chapter + 1 }} </span>
                    <span> Progress: {{ (bookmark.progress * 100).toFixed(1) }}% </span>
                </div>
            </template>
        </div>
    </div>

    <div class="container" style="margin-top: 2rem;">
        <h2 style="margin: 0.5rem 0 1rem;">My Books</h2>
        <div class="cards flex">
            <div class="card relative" @click="openBook(book.filename)" v-for="(book) in library.books">
                <div class="card-more" @click.stop="inspectBook(book)">
                    <font-awesome-icon :icon="['fas', 'ellipsis']" fixed-width />
                </div>
                <div class="card-image relative">
                    <font-awesome-icon :icon="['fas', 'book']" fixed-width class="absolute-center" />
                </div>
                <div class="card-text">{{ book.title }}</div>
            </div>
            <div class="card" @click="triggerInput">
                <input id='file-input' type="file" accept=".epub" @change="loadEpub" style="display: none;" />
                <div class="card-image relative">
                    <font-awesome-icon :icon="['fas', 'plus']" fixed-width class="absolute-center" />
                </div>
                <div class="card-text">Upload from device</div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.cover {
    background-color: hsl(0 0 55);
    color: hsl(0 0 90);
    aspect-ratio: 1 / 1;
    min-width: 3rem;
    font-size: 1.5rem;
    cursor: pointer;
}

.play-icon {
    position: absolute;
    z-index: 1;
    background-color: #00000069;
    width: 100%;
    height: 100%;
    visibility: hidden;
}

.bookmark-entry:hover .play-icon {
    visibility: visible;
}

.bookmark-entry {
    width: 100%;
    gap: 1.5rem;
    align-items: center;
}

.bookmark-entry:hover {
    background-color: var(--ui-card-hover);
}

.container {
    border-radius: 12px;
    padding: 1rem;
    gap: 1.2rem;
    overflow: hidden;
    background-color: var(--ui-content-bg);
    border: 1px solid var(--ui-content-border);
}

.card-more {
    position: absolute;
    top: 0;
    right: 0;
    padding: 0.4rem 0.5rem;
    font-size: 1.3rem;
    border-radius: 8px;
    z-index: 1;
    opacity: 0;
    color: var(--ui-card-more-text);
    background-color: var(--ui-card-more-bg);
}

.card-more:hover {
    background-color: var(--ui-card-more-hover);
}

.card:hover .card-more {
    opacity: 1;
}


.card-image {
    background-color: hsl(0 0 55);
    color: hsl(0 0 90);
    height: 75%;
    border-radius: 8px;
    font-size: 8rem;
    overflow: hidden;
}

.card-text {
    text-align: center;
    width: 100%;
    margin-top: 0.5rem;
}

.card {
    height: 20rem;
    width: 14rem;
    padding: 1rem;
    background-color: var(--ui-card);
    color: var(--text-dimmed);
    border: none;
    border-radius: 12px;
    overflow: hidden;
}

.card:hover {
    background-color: var(--ui-card-hover);
    cursor: pointer;
}

.cards {
    flex-wrap: wrap;
    gap: 1rem;
}
</style>
