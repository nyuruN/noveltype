<script setup lang="ts">
import { nextTick } from 'vue'
import { storeToRefs } from 'pinia'
import { useStatsStore, useTypingStore } from '@/stores/typing'
import { useSettingsStore } from '@/stores/settings'

const { chapter } = storeToRefs(useTypingStore())
const { paragraphWPMs } = storeToRefs(useStatsStore())
const { typing } = storeToRefs(useSettingsStore())

document.addEventListener('keydown', async (event: Event) => {
    let keyevent = event as KeyboardEvent
    let key = keyevent.key

    if (chapter.value) {
        // Check if it's a single character (letter, number, symbol)
        if (key.length === 1 || /^[a-zA-Z0-9!@#$%^&*()_+{}\[\]:;"'<>,.?/~`\-=\\| ]$/.test(key)) {
            keyevent.preventDefault()
            chapter.value.input(key)
        } else if (key === 'Enter') {
            keyevent.preventDefault()
            chapter.value?.enter()

            // Next Chapter if completed
            if (chapter.value.finished) {
                chapter.value = await chapter.value.next(); await nextTick(); chapter.value?.resetCaret();
                let container = (document.getElementById('typer-container') as HTMLElement)
                container.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                })
            }
        } else if (key === 'Backspace') {
            keyevent.preventDefault()
            chapter.value.backspace()
        }
    }
})
</script>

<template>
    <div id="typing-area" v-if="chapter">
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
            </div>
        </div>
        <div class="newline" v-if="!chapter?.paragraphs[0]" style="padding: .2em">
            <font-awesome-icon :icon="['fas', 'turn-down']" class="fa-rotate-90" transform="down-5 right-2" />
        </div>
    </div>
</template>

<style>
.stat {
    position: absolute;
    top: 0.4em;
    left: 1.9em;
    padding: .1em 0.3em;
    height: 1.6em;
    font-size: 0.7em;
    text-wrap: nowrap;
    background-color: #4d4d4d;
    color: #9e9e9e;
    /* transform: translate(0.8em, 0.4em); */
    border-radius: 6px;
}

.newline {
    color: #4d4d4d;
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
    color: #9C9C9C;
    border-bottom: 0.09em solid transparent;
}

.word.typed.error {
    border-bottom-color: #f37575;
}

.letter {
    display: inline;
    color: #9C9C9C;
    transition: color 0.1s;
}

.letter.correct {
    color: #f3f3f3
}

.letter.error {
    color: #f37575
}

.letter.overflow {
    color: #944949
}

#caret {
    position: absolute;
    height: 1.2em;
    width: 0.08em;
    border-radius: 0.1em;
    background-color: white;
    transition: top 0.05s ease, left 0.1s ease;
    z-index: 1;
}

#typing-area {
    display: block;
    position: relative;
    font-size: calc(2.0rem * var(--typing-font-scale));
    line-height: calc(2.4rem * var(--typing-line-scale));
    margin-bottom: 6rem;
}
</style>