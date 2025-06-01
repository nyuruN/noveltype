<script setup lang="ts">
import { onMounted, onUpdated, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { useStatsStore, useTypingStore } from '@/stores/typing'
import { useSettingsStore } from '@/stores/settings'

const { chapter, isFocused } = storeToRefs(useTypingStore())
const { paragraphWPMs } = storeToRefs(useStatsStore())
const { typing } = storeToRefs(useSettingsStore())

document.addEventListener('keydown', async (event: Event) => {
    let keyevent = event as KeyboardEvent
    let key = keyevent.key

    if (chapter.value) {
        // Check if it's a single character (letter, number, symbol)
        if (key.length === 1 || /^[a-zA-Z0-9!@#$%^&*()_+{}\[\]:;"'<>,.?/~`\-=\\| ]$/.test(key)) {
            keyevent.preventDefault()
            isFocused.value = true
            chapter.value.input(key)
        } else if (key === 'Enter') {
            keyevent.preventDefault()
            isFocused.value = true
            chapter.value?.enter()
        } else if (key === 'Backspace') {
            keyevent.preventDefault()
            isFocused.value = true
            chapter.value.backspace()
        }

    }

    // Next Chapter if completed
    if (chapter.value && chapter.value.finished) {
        chapter.value = await chapter.value.next();
        // Reset scroll to top
        let container = (document.getElementById('typer-wrapper') as HTMLElement)
        container.scrollTo({
            top: 0,
            behavior: 'smooth'
        })
    }
})

// Refresh caret position after layout has changed
let caretRefreshTimeout = setTimeout(() => { })
const resizeObserver = new ResizeObserver(_ => {
    clearTimeout(caretRefreshTimeout)
    caretRefreshTimeout = setTimeout(() => { chapter.value?.refreshCaret(); }, 80)
})
onUpdated(() => resizeObserver.observe(document.getElementById('typing-area') as Element))

// Scroll to caret when entering focused state
onMounted(() => {
    watch(isFocused, (focused) => {
        if (focused) {
            chapter.value?.refreshCaret(true)
        }
    })
})
</script>

<template>
    <div id="typing-area" v-if="chapter" style="scrollbar-width: none;">
        <div id="caret" style="top: 0px; left: 0px;"></div>
        <div class="paragraph" v-for="(p, index) in chapter?.paragraphs">
            <template v-if="p.isRendered">
                <div class="word" v-for="w in p.words" :class="{ typed: w.typed, error: w.error }">
                    <div class="letter" v-for="(l, index) in w.letters"
                        :class="{ correct: w.cLetters[index], error: w.cLetters[index] === false }">
                        {{ l }}
                    </div>
                    <div class="letter overflow" v-for="l in w.overflow">
                        {{ l }}
                    </div>
                </div>
            </template>
            <template v-else>
                <div class="word" v-for="w in p.words">
                    {{ w.word }}
                </div>
            </template>

            <div class="newline relative">
                <font-awesome-icon :icon="['fas', 'turn-down']" class="fa-rotate-90" transform="down-5 right-2" />

                <div class="trailers">
                    <template v-if="paragraphWPMs[index]">
                        <div class="stat" v-if="typing.statsDisplay == 'RAW'">
                            raw: {{ paragraphWPMs[index].raw.toFixed(0) }}
                        </div>
                        <div class="stat" v-else-if="typing.statsDisplay == 'WPM'">
                            wpm: {{ paragraphWPMs[index].wpm.toFixed(0) }}
                        </div>
                        <div class="stat" v-else-if="typing.statsDisplay == 'ACC'">
                            acc: {{ (paragraphWPMs[index].acc * 100).toFixed(0) }}%
                        </div>
                    </template>
                    <div style="font-size: 1.6em; margin-left: 0.5em" class="bookmark" v-if="chapter?.bookmark == index"
                        @click="chapter.toggleBookmark()">
                        <font-awesome-icon :icon="['fas', 'bookmark']" />
                    </div>
                </div>
            </div>
        </div>
        <div class="newline" v-if="!chapter?.paragraphs[0]" style="padding: .2em">
            <font-awesome-icon :icon="['fas', 'turn-down']" class="fa-rotate-90" transform="down-5 right-2" />
        </div>
    </div>
</template>

<style>
.bookmark {
    font-size: 1.6em;
    margin-left: 0.5em;
    transition: color 0.1s ease;
}

.bookmark:hover {
    cursor: pointer;
    color: var(--typing-trailer-color)
}

.trailers {
    position: absolute;
    top: 0.4em;
    left: 1.9em;
    height: 1.6em;
    font-size: 0.7em;
    display: flex;
}

.stat {
    /* position: absolute;
    top: 0.4em;
    left: 1.9em;
    height: 1.6em;
    font-size: 0.7em; */
    padding: .1em 0.3em;
    text-wrap: nowrap;
    background-color: var(--typing-trailer);
    color: var(--typing-trailer-color);
    border-radius: 6px;
}

.newline {
    color: var(--typing-trailer);
}

.paragraph {
    user-select: none;
    display: flex;
    flex-wrap: wrap;
    height: fit-content;
    margin-bottom: 2em;
}

.word {
    display: inline;
    margin: .2em;
    color: var(--typing-text-dimmed);
    border-bottom: 0.09em solid transparent;
}

.word.typed.error {
    border-bottom-color: #f37575;
}

.letter {
    display: inline;
    color: var(--typing-text-dimmed);
    transition: color 0.1s;
}

.letter.correct {
    color: var(--typing-text)
}

.letter.error {
    color: var(--typing-text-error)
}

.letter.overflow {
    color: var(--typing-text-error-dimmed)
}

#caret {
    position: absolute;
    height: 1.2em;
    width: var(--typing-caret-width);
    border-radius: 0.1em;
    background-color: var(--typing-caret-color);
    transition: top 0.05s ease, left 0.1s ease;
    z-index: 1;
}

#typing-area {
    display: block;
    position: relative;
    font-size: calc(2.0rem * var(--typing-font-scale));
    line-height: calc(2.4rem * var(--typing-line-scale));
}
</style>