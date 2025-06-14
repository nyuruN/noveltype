<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useTypingStore } from '@/stores/typing';
import { useSettingsStore } from '@/stores/settings';


const { book, chapter, showTyper, showToc } = storeToRefs(useTypingStore())
const { typing } = storeToRefs(useSettingsStore())

async function next() {
    let p = chapter.value?.next();
    if (p) chapter.value = await p
}
async function prev() {
    let p = chapter.value?.prev();
    if (p) chapter.value = await p
}
function larger() {
    typing.value.typingFontScale = typing.value.typingFontScale + 0.1
    typing.value.typingLineScale = typing.value.typingLineScale + 0.1
}
function smaller() {
    typing.value.typingFontScale = typing.value.typingFontScale - 0.1
    typing.value.typingLineScale = typing.value.typingLineScale - 0.1
}
function bookmark() {
    chapter.value?.toggleBookmark()
}
</script>

<template>
    <nav id="menu">
        <button @click="showTyper = false" class="menu-button">
            <font-awesome-icon :icon="['fas', 'home']" fixed-width />
        </button>

        <button id="toc" class="menu-button" v-if="book" @click="showToc = true">
            <font-awesome-icon :icon="['fas', 'bars']" fixed-width />
        </button>

        <div class="grow"></div>

        <button id="toc" class="menu-button" v-if="book" @click="showToc = true">
            <span v-if="chapter" class="title">{{
                chapter.title }}</span>
            <span v-else>Select a chapter to get started</span>
        </button>
        <span v-else>Select a book from the library to get started</span>

        <div class="grow"></div>

        <div v-if="chapter" style="margin: 0 .3rem; display: flex;">
            <button @click="bookmark" class="menu-button" style="padding: .4rem .3rem;">
                <font-awesome-icon :icon="['fas', 'bookmark']" fixed-width v-if="chapter?.bookmark !== undefined" />
                <font-awesome-icon :icon="['far', 'bookmark']" fixed-width v-else />
            </button>
            <button @click="larger" class="menu-button" style="padding: .4rem .3rem;">
                <font-awesome-icon :icon="['fas', 'magnifying-glass-plus']" fixed-width />
            </button>
            <button @click="smaller" class="menu-button" style="padding: .4rem .3rem;">
                <font-awesome-icon :icon="['fas', 'magnifying-glass-minus']" fixed-width />
            </button>
            <button @click="prev" class="menu-button" style="padding: .4rem .3rem;">
                <font-awesome-icon :icon="['fas', 'caret-left']" fixed-width />
            </button>
            <button @click="next" class="menu-button" style="padding: .4rem .3rem;">
                <font-awesome-icon :icon="['fas', 'caret-right']" fixed-width />
            </button>
        </div>

    </nav>
</template>

<style scoped>
#menu {
    z-index: 1;

    display: flex;
    flex-direction: row;
    align-items: center;
    gap: .3rem;
    padding: .3rem;
    background-color: var(--typing-menu-bg);
    border-radius: 10px;
    max-width: 80%;
    width: 60rem;
    min-width: fit-content;

    box-shadow: 0px 0px 16px 0px var(--typing-menu-bg);
}

.title {
    flex-grow: 1;
    text-align: center;
    text-overflow: ellipsis;
    text-wrap: nowrap;
    overflow: hidden;
    color: color-mix(in hsl, var(--typing-menu-color), white 10%);
}

*:hover>.title {
    color: color-mix(in hsl, var(--typing-menu-color-lighter), white 10%);
}

.menu-button {
    border-radius: 8px;
    border: 0;
    padding: 0.4rem 0.6rem;
    font-size: 1.1rem;
    line-height: normal;
    background-color: transparent;
    color: var(--typing-menu-color);
    cursor: pointer;

    transition: var(--typing-text-transition);
}

.menu-button:hover {
    color: var(--typing-menu-color-lighter);
}
</style>