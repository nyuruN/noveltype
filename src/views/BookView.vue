<script setup lang="ts">
import Prompt from '@/components/widgets/Prompt.vue';
import db from '@/lib/db';
import { useLibraryStore } from '@/stores/library';
import { usePromptStore } from '@/stores/prompt';
import { storeToRefs } from 'pinia';
import { ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const route = useRoute()
const router = useRouter()
const libraryStore = useLibraryStore()
const { books } = storeToRefs(libraryStore)
const bookIdx = ref(books.value.findIndex(record => record.title == route.params.title))
let book = books.value.at(bookIdx.value)

async function deleteBook() {
    if (!book) return

    let confirm = await usePromptStore().openPrompt('Confirm Action', 'This will permanently remove the book from your library!', true)

    if (confirm) {
        console.log(books.value.splice(bookIdx.value, 1))
        await db.deleteEpubFile(book.filename)
        await db.deleteCover(book.filename)
        book = undefined
        bookIdx.value = -1
        router.back()
    }
}
</script>

<template>
    <button id="back-button" @click="$router.back()">
        <font-awesome-icon :icon="['fas', 'arrow-left']" fixed-width />
    </button>

    <h1>{{ (bookIdx != -1) ? book?.title : 'Ooops, nothing here!' }}</h1>

    <template v-if="bookIdx != -1">
        <div class="content-container flex-col" style="gap: 0.5rem">
            <h2 style="margin: 0.5rem 0;">Metadata</h2>
            <div class="entry-texts">
                <div>Title</div>
                <span>{{ book?.title }}</span>
            </div>
            <div class="entry-texts">
                <div>Author</div>
                <span>{{ book?.author }}</span>
            </div>
            <div class="entry-texts">
                <div>Description</div>
                <span>{{ book?.description }}</span>
            </div>
            <div class="entry-texts">
                <div>Filename</div>
                <span>{{ book?.filename }}</span>
            </div>
            <div class="entry-texts">
                <div>Book Id</div>
                <span>{{ book?.id }}</span>
            </div>
            <div class="entry-texts">
                <div>Language</div>
                <span>{{ book?.lang }}</span>
            </div>
        </div>
        <div class="content-container danger flex-col" style="gap: 0.5rem">
            <h2 style="margin: 0.5rem 0 0.5rem;">Danger Zone</h2>
            <div class="flex" style="align-items: center;">
                <div class="entry-texts">
                    <div style="margin-left: -0.1rem;">
                        <font-awesome-icon :icon="['fas', 'triangle-exclamation']" fixed-width />
                        <span style="margin-left: 0.1rem;">Delete book</span>
                    </div>
                    <span>Removes this book from your library</span>
                </div>
                <button class="button danger" @click="deleteBook">
                    <font-awesome-icon :icon="['fas', 'trash']" fixed-width />
                </button>
            </div>
        </div>
    </template>

    <Prompt />
</template>

<style scoped>
.entry-texts {
    flex-grow: 1;
    color: var(--text);
}

.entry-texts>*:first-child {
    font-weight: bold;
    color: var(--text-dimmed);
}

.delete-button {
    user-select: none;
    padding: 0.6rem 0.7rem;
    border: none;
    border-radius: 8px;
    background-color: var(--ui-important);
    color: color-mix(in hsl, var(--ui-important), black 20%);
}

.delete-button:hover {
    cursor: pointer;
    background-color: color-mix(in hsl, var(--ui-important), white 15%);
}

#back-button {
    background-color: transparent;
    border: none;
    margin-top: 1rem;
    color: var(--text-dimmed);
    border: 3px solid var(--text-dimmed);

    /* SQUARE */
    /* font-size: 1.4rem;
    border-radius: 1.0rem;
    padding: 0.2rem 1.0rem; */

    /* CIRCLE */
    font-size: 1.4rem;
    border-radius: 2rem;
    padding: 0.2rem;

    transition: var(--ui-border-transition), var(--ui-text-transition);
}

#back-button:hover {
    color: var(--text);
    border: 3px solid var(--text);
    cursor: pointer;
}
</style>