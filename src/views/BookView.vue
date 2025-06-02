<script setup lang="ts">
import { useLibraryStore } from '@/stores/library';
import { useRoute } from 'vue-router';

const route = useRoute()
const book = useLibraryStore().books.find(record => record.title == route.params.title)

</script>

<template>
    <button id="back-button" @click="$router.back()">
        <font-awesome-icon :icon="['fas', 'arrow-left']" fixed-width />
    </button>

    <h1>{{ $route.params.title }}</h1>

    <div class="entry-container flex-col">
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

.entry-container {
    border-radius: 12px;
    padding: 1rem;
    gap: 0.5rem;
    background-color: var(--ui-content-bg);
    border: 1px solid var(--ui-content-border);
}

.entry-container.danger {
    border: 2px solid var(--ui-important);
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

    transition: color .2s ease, border .2s ease;
}

#back-button:hover {
    color: var(--text);
    border: 3px solid var(--text);
    cursor: pointer;
}
</style>