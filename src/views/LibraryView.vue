<script setup lang="ts">
import { saveEpubFile, loadEpubFile } from '@/lib/db'
import { useLibraryStore, type BookRecord } from '@/stores/library'
import { useTypingStore } from '@/stores/typing'
import { storeToRefs } from 'pinia'
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const library = useLibraryStore()
const { book, chapter, showTyper } = storeToRefs(useTypingStore())
const router = useRouter()

async function loadEpub(file: File) {
    if (file.type !== 'application/epub+zip') return

    // Load book
    if (!library.exists(file.name)) {
        let epub = await library.loadBook(file)

        book.value = epub
        chapter.value = await epub.getChapter(0)

        await saveEpubFile(file)
    }
}
async function fileInputHandler(e: Event) {
    var input = e.target as HTMLInputElement

    if (!input.files || !input.files[0]) return

    // Load book
    loadEpub(input.files[0])
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
// Change view to book inspection
async function inspectBook(rec: BookRecord) {
    router.push('/books/' + rec.title)
}
function removeBookmark(rec: BookRecord, idx: number) {
    rec.bookmarks.splice(idx, 1)
}
function dropHandler(event: Event) {
    dropping.value = false
    let ev = event as DragEvent;

    if (!ev.dataTransfer) return;

    // Use DataTransfer interface to access the file(s)
    [...ev.dataTransfer.files].forEach((file, i) => {
        console.log(`… file[${i}].name = ${file.name}`);
        loadEpub(file)
    });
}
// Only begin Drag&Drop if data is a file
function dragenterHandler(_event: Event) {
    dropping.value = true
}
const dropping = ref(false)
</script>

<template>
    <h1>Library</h1>

    <div class="content-container" v-if="library.hasBookmarks">
        <h2 style="margin-bottom: 1rem;">Bookmarks</h2>
        <div class="bookmarks flex-col" style="gap: 0.5rem;">
            <template v-for="book in library.books">
                <div class="bookmark-entry flex" v-for="(bookmark, idx) in book.bookmarks">
                    <button class="cover relative"
                        @click="openBook(book.filename, bookmark.chapter, bookmark.paragraph)">
                        <font-awesome-icon :icon="['fas', 'book']" fixed-width class="absolute-center" />
                        <div class="play-icon">
                            <font-awesome-icon :icon="['fas', 'play']" fixed-width class="absolute-center" />
                        </div>
                    </button>
                    <div class="entry-text grow flex">
                        <span> {{ book.title }} </span>
                        <span> {{ book.toc[bookmark.chapter] }} </span>
                        <span> c{{ (bookmark.chapter + 1) }} {{ (bookmark.progress * 100).toFixed(0) }}% </span>
                    </div>
                    <button class="button" style=" width: fit-content; padding: 0.5rem"
                        @click="removeBookmark(book, idx)">
                        <font-awesome-icon :icon="['fas', 'trash']" fixed-width />
                    </button>
                </div>
            </template>
        </div>
    </div>

    <div class="content-container relative" style="min-height: 30rem; overflow: clip;"
        @dragenter.prevent="dragenterHandler">
        <div class="flex">
            <h2 class="grow" style="margin-bottom: .5rem;">My Books</h2>
            <button class="button" @click="triggerInput" v-if="library.books.length">
                <font-awesome-icon :icon="['fas', 'upload']" fixed-width />
                <span style="margin-left: 0.5rem;">Upload</span>
            </button>
        </div>
        <div class="absolute-center" style="font-size: 2rem;" v-if="!library.books.length">
            <div class="flex-col align-center" style="gap: 1rem; text-align: center;">
                <div style="font-size: 6rem;">
                    <font-awesome-icon :icon="['fas', 'cloud-arrow-up']" fixed-width />
                </div>
                <span>Drag & Drop to Upload EPUB</span>
                <div>OR</div>
                <button class="button" style="font-size: 1.5rem;" @click="triggerInput">Browse File</button>
            </div>
        </div>

        <div class="drop-zone absolute-fill" v-show="dropping" @dragleave.prevent="dropping = false" @dragover.prevent
            @drop.prevent="dropHandler">
            <div class="absolute-center" style="pointer-events: none;">
                <font-awesome-icon :icon="['fas', 'right-to-bracket']" fixed-width class="fa-rotate-90" />
            </div>
        </div>
        <input id='file-input' type="file" accept=".epub" @change="fileInputHandler" style="display: none;" />

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
        </div>
    </div>
</template>

<style scoped>
.drop-zone {
    /* Above .card-more */
    z-index: 2;
    font-size: 7rem;
    background-color: #00000099;
    outline: 8px dashed var(--text-dimmed);
    outline-offset: -2rem;
}

.entry-text:hover {
    cursor: default;
}

.entry-text>span {
    padding: 0.5rem;
}

.entry-text>span:not(:last-child) {
    border-right: 1px solid var(--ui-border);
}

.cover:hover,
.cover:focus-visible {
    border-color: var(--ui-border-active);
}

.cover {
    background-color: hsl(0 0 55);
    color: hsl(0 0 90);
    padding: 0;
    border: none;
    border: 1px solid var(--ui-border);
    aspect-ratio: 1 / 1;
    min-width: 3rem;
    font-size: 1.5rem;
    cursor: pointer;

    transition: var(--ui-border-transition);
}

.play-icon {
    position: absolute;
    z-index: 1;
    background-color: #00000069;
    color: var(--text);
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    opacity: 0;
    transition: opacity 0.2s ease;
}

.bookmark-entry:hover .play-icon {
    opacity: 1;
}

.bookmark-entry {
    width: 100%;
    gap: 1rem;
    align-items: center;

    transition: var(--ui-bg-transition);
}

.bookmark-entry:hover {
    background-color: var(--ui-card-hover);
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

    transition: var(--ui-bg-transition);
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

    transition: var(--ui-bg-transition);
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
