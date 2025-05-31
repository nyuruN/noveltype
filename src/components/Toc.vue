<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useTypingStore } from '@/stores/typing';

const { book, chapter, showToc } = storeToRefs(useTypingStore())

async function toChapter(n: number) { let c = book.value?.getChapter(n); if (c) { chapter.value = await c; showToc.value = false; } }

</script>

<template>
    <div id="toc-container">
        <div id="toc-content" class="thin-scrollbar" :style="{
            left: showToc ? '0vw' : '-60vw',
            opacity: showToc ? '100' : '0',
            pointerEvents: showToc ? 'auto' : 'none'
        }">
            <h2 style="padding-left: 1.5rem;">{{ book?.record.title }}</h2>
            <template v-for="(title, index) in book?.record.toc">
                <ul @click="toChapter(index)" :class="{ selected: index == chapter?.index }">
                    {{ title }}
                </ul>
            </template>
        </div>
        <div id="toc-screenquad" @click="showToc = false" v-if="showToc"></div>
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
    position: absolute;
    top: 0;
    left: 0;
    max-width: 40vw;
    min-width: 20rem;
    height: 100%;
    padding-top: 2rem;
    padding-bottom: 6rem;

    background-color: var(--ui-toc-bg);
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
    font-size: 1.15em;
    padding-top: 0.75rem;
    padding-bottom: 0.75rem;
    margin-block-start: 0;
    margin-block-end: 0;
    user-select: none;
    cursor: pointer;
    color: var(--text-dimmed);

    transition: background-color 0.25s ease;
}

#toc-content>ul.selected {
    color: var(--text);
    background-color: var(--ui-toc-active);
}

#toc-content>ul:hover {
    background-color: var(--ui-toc-hover);
}
</style>