<script setup lang="ts">
import { nextTick } from 'vue'
import { useLibraryStore } from '../stores/library'
import { storeToRefs } from 'pinia'

const { chapter } = storeToRefs(useLibraryStore())

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
                chapter.value = await chapter.value.next(); await nextTick(); chapter.value?.resetCaret();
            }
        }
    }
})
</script>

<template>
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

#typing-area {
    display: block;
    position: relative;
    height: 60rem;
    font-size: 1.4rem;
}
</style>