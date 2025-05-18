<script setup lang="ts">
import { nextTick, ref, type Ref } from 'vue'
import { useLibraryStore } from '../stores/library'
import { Chapter } from '../library'
import { storeToRefs } from 'pinia'

const { library, book } = storeToRefs(useLibraryStore())

let chapter: Ref<Chapter | undefined> = ref(undefined)

document.addEventListener('keydown', async (event: Event) => {
    let keyevent = event as KeyboardEvent
    let key = keyevent.key

    if (chapter.value) {
        // Check if it's a single character (letter, number, symbol)
        if (key.length === 1 || /^[a-zA-Z0-9!@#$%^&*()_+{}\[\]:;"'<>,.?/~`\-=\\| ]$/.test(key)) {
            chapter.value.input(key)
            keyevent.preventDefault()
        } else if (key === 'Enter') {
            chapter.value?.enter()
            keyevent.preventDefault()

            // Next Chapter if completed
            if (chapter.value.finished) {
                chapter.value = await chapter.value.next(); await nextTick(); chapter.value?.resetCaret()
            }
        }
    }
})

async function loadEpub(e: Event) {
    var input = e.target as HTMLInputElement

    if (!input.files || !input.files[0] || input.files[0].type !== 'application/epub+zip') {
        return
    }

    // Load book
    book.value = await library.value.loadBook(input.files[0])

    // Load chapter
    chapter.value = await book.value.getChapter(0)

    nextTick().then(() => {
        chapter.value?.resetCaret()
    })
}
async function next() { let p = chapter.value?.next(); if (p) { chapter.value = await p; await nextTick(); chapter.value.resetCaret() } }
async function prev() { let p = chapter.value?.prev(); if (p) { chapter.value = await p; await nextTick(); chapter.value.resetCaret() } }
</script>

<template>
    <div id="container">
        <!-- <h1>{{ book ? book.title : 'Choose a file' }}</h1> -->
        <div id="options">
            <button class="button active-border">
                <font-awesome-icon :icon="['fas', 'bars']" fixed-width />
            </button>
            <label id="file-label" class="button active-border" for="file-input">
                <font-awesome-icon :icon="['fas', 'folder-open']" fixed-width />
                <input id='file-input' type="file" accept=".epub" @change="loadEpub" style="display: none;"/>
            </label>
            <span v-if="chapter" style="flex-grow: 1; text-align: center;">{{ chapter.title }}</span>
            <button v-if="chapter" @click="prev" class="button active-border">
                <font-awesome-icon :icon="['fas', 'caret-left']" fixed-width />
            </button>
            <button v-if="chapter" @click="next" class="button active-border">
                <font-awesome-icon :icon="['fas', 'caret-right']" fixed-width />
            </button>
        </div>
        <div id="typing-area" v-if="chapter">
            <div id="caret" style="top: 0px; left: 0px;"></div>
            <div class="paragraph" v-for="p in chapter?.paragraphs">
                <div class="word" v-for="w in p.words">
                    <div class="letter" v-for="(l, index) in w.letters" :class="{ correct: w.cLetters[index] }">{{ l }}
                    </div>
                </div>
                <div class="newline">
                    <font-awesome-icon :icon="['fas', 'turn-down']" class="fa-rotate-90" transform="down-5 right-2" />
                </div>
            </div>
        </div>
        <div style="height: 8rem"></div>
    </div>
</template>

<style>
.newline {
    color: #474747;
}
.paragraph {
    display: flex;
    flex-wrap: wrap;
    height: fit-content;
    margin-bottom: 1.5em;
}
.word {
    display: inline;
    padding: .2em;
}
.letter {
    display: inline;
    font-size: 1em;
    line-height: 1em;
    color: #9C9C9C;
    user-select: none;
}
.letter.correct {
    color: #f3f3f3
}

#caret {
    position: absolute;
    height: 1.2em;
    width: 0.08em;
    border-radius: 0.1em;
    background-color: white;
    transition: top 0.1s ease, left 0.1s ease;
}

#container {
    display: flex;
    height: 100%;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
    gap: 1.5rem;
}

#container>* {
    width: 80rem;
    max-width: 85vw;
}

#options {
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 0.75rem;
    padding: .3em;
    background-color: #303030;
    border-radius: 10px;
}

#typing-area {
    display: block;
    position: relative;
    height: 60rem;
    font-size: 1.4rem;
}

#file-label { /* For some unknown reason the height ends up different from <button> based elements*/
    padding: 0.43rem 1.0rem;
}

.button {
    border-radius: 8px;
    padding: 0.5rem 1.0rem;
    font-size: 1rem;
    line-height: normal;
    background-color: #1a1a1a;
    cursor: pointer;
    border: 0;
}
.active-border {
    border: 1px solid transparent;
    transition: border-color 0.25s;
}
.active-border:hover {
    border-color: #646cff;
}
</style>