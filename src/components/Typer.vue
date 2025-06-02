<script setup lang="ts">
import { nextTick, onMounted, onUpdated, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { useStatsStore, useTypingStore } from '@/stores/typing'
import { useSettingsStore } from '@/stores/settings'

const { chapter, isFocused, showTyper } = storeToRefs(useTypingStore())
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
            chapter.value.enter()
        } else if (key === 'Backspace') {
            keyevent.preventDefault()
            isFocused.value = true
            chapter.value.backspace()
        }
    }

    // Next Chapter if completed
    if (chapter.value && chapter.value.typed) {
        chapter.value = await chapter.value.next();
        await nextTick().then(() => chapter.value?.refreshCaret(true))
    }
})

// Refresh caret position after layout has changed
let caretRefreshTimeout = setTimeout(() => { })
const resizeObserver = new ResizeObserver(_ => {
    clearTimeout(caretRefreshTimeout)
    caretRefreshTimeout = setTimeout(() => { chapter.value?.refreshCaret(); }, 80)
})
onUpdated(() => {
    let el = document.getElementById('typing-area') as Element | null
    if (el) resizeObserver.observe(el)
})

// Scroll to caret when entering focused state
onMounted(() => {
    // Scroll on focus
    watch(isFocused, (focused) => {
        if (focused) {
            chapter.value?.refreshCaret(true)
            document.body.style.cursor = 'none'
        } else {
            document.body.style.cursor = 'default'
        }
    })
    // Scroll on typing view opened
    watch(showTyper, (shown) => {
        if (shown && chapter.value) {
            nextTick().then(() => chapter.value?.refreshCaret(true))
        }
    })
    // Scroll on chapter change
    watch(chapter, (ch) => {
        if (ch) {
            nextTick().then(() => ch.refreshCaret(true))
        }
    })
})

// Toggles one paragraph specifically, bookmarking it if not already
function toggleBookmarkAt(paragraph: number) {
    if (!chapter.value) return

    // Force bookmark this paragraph otherwise toggle
    if (chapter.value.bookmark != paragraph && chapter.value.bookmark != undefined) {
        chapter.value.toggleBookmark() // Remove
        chapter.value.toggleBookmark(paragraph)
    } else {
        chapter.value.toggleBookmark(paragraph)
    }
}
function goToParagraph(paragraph: number) {
    chapter.value?.goTo(paragraph)
    nextTick().then(() => chapter.value?.refreshCaret())
}
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

            <div class="relative">
                <div class="newline">
                    <font-awesome-icon :icon="['fas', 'turn-down']" class="fa-rotate-90" transform="down-5 right-2" />
                </div>

                <div class="trailers flex">
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
                    <div class="trailer" @click="toggleBookmarkAt(index)"
                        :class="{ inactive: chapter?.bookmark != index }" v-show="!isFocused">
                        <font-awesome-icon :icon="[chapter?.bookmark == index ? 'fas' : 'far', 'bookmark']" />
                    </div>
                    <div class="trailer inactive" @click="goToParagraph(index)" v-show="!isFocused">
                        <font-awesome-icon :icon="['far', 'keyboard']" v-show="chapter.caret.p != p.index" />
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style>
.newline {
    color: var(--typing-trailer);
}

.stat {
    font-size: 0.6em;
    line-height: 1.75;
    padding: 0 0.2em;
    text-wrap: nowrap;
    height: fit-content;
    background-color: var(--typing-trailer);
    color: var(--typing-trailer-color);
    border-radius: 6px;
}

.trailer {
    transition: color 0.1s ease;
    color: var(--typing-trailer);
}

.trailer.inactive {
    visibility: hidden;
}

.paragraph:hover .trailer.inactive {
    visibility: visible;
}

.trailer:hover {
    cursor: pointer;
    color: var(--typing-trailer-color);
}

.trailers {
    position: absolute;
    top: 0em;
    left: 1.4em;
    height: 1.6em;
    align-items: center;
    gap: 0.4em;
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