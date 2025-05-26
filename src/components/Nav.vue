<script setup lang="ts">
import { ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useTypingStore } from '@/stores/typing';

const { book, chapter } = storeToRefs(useTypingStore())

let showTOC = ref(false)

async function toChapter(n: number) { let c = book.value?.getChapter(n); if (c) { chapter.value = await c } }

</script>

<template>
    <button id="toc" class="menu-button" v-if="book" @click="showTOC = !showTOC">
        <slot></slot>
        <div id="toc-container">
            <div id="toc-content" class="thin-scrollbar" :style="{
                left: showTOC ? '0vw' : '-60vw',
                opacity: showTOC ? '100' : '0',
                pointerEvents: showTOC ? 'auto' : 'none'
            }">
                <template v-for="(arr, index) in book?.record.toc">
                    <ul @click="toChapter(index)" :class="{ selected: index == chapter?.index}">
                        {{ arr[0] }}
                    </ul>
                </template>
            </div>
            <div v-if="showTOC" id="toc-screenquad"></div>
        </div>
    </button>
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
    position: absolute;
    top: 0;
    left: 0;
    max-width: 40vw;
    min-width: 20rem;
    height: 100%;

    background-color: var(--primary-darker);
    box-shadow: 0px 0px 20px 0px rgba(0, 0, 0, 0.5);

    scrollbar-width: thin;
    overscroll-behavior: contain;
    overflow: scroll;
    overflow-x: hidden;

    transition:
        left 0.2s ease,
        opacity 0.2s cubic-bezier(1, 0, 0, 1);
}

#toc-content>ul {
    text-wrap: wrap;
    text-align: left;
    padding-block-start: 1rem;
    padding-block-end: 1rem;
    margin-block-start: 0;
    margin-block-end: 0;
    user-select: none;
    color: var(--text-dimmed);

    transition: background-color 0.25s ease;
}

#toc-content>ul.selected {
    color: var(--text);
    background-color: var(--primary-dark);
}

#toc-content>ul:hover {
    background-color: var(--primary-dark);
}
</style>