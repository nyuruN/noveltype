<script setup lang="ts">
import { nextTick, ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useTempStore } from '@/stores/library'

const { book, chapter } = storeToRefs(useTempStore())

let showTOC = ref(false)

async function toChapter(n: number) { let c = book.value?.getChapter(n); if (c) { chapter.value = await c; await nextTick(); chapter.value.resetCaret() } }

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
                <ul v-for="(arr, index) in book?.record.toc" @click="toChapter(index)">
                    {{ arr[0] }}
                </ul>
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
    position: fixed;
    top: 0;
    left: 0;
    max-width: 40vw;
    min-width: 20rem;
    height: 100%;

    background-color: #252525de;
    backdrop-filter: blur(4px);
    box-shadow: 0px 0px 30px 0px rgba(0, 0, 0, 0.5);

    scrollbar-width: thin;
    scrollbar-color: #757575 #ffffff00;
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

    transition: background-color 0.3s ease;
}

#toc-content>ul:hover {
    background-color: #474747;
}
</style>