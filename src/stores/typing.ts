import { defineStore, storeToRefs } from 'pinia'
import { Book, Chapter } from '../lib/book'
import { ref, watch } from 'vue'


export const useTypingStore = defineStore('typing', {
    state: () => ({
        book: undefined as Book | undefined,
        chapter: undefined as Chapter | undefined,
        isTyping: false,
    }),
})

/**
 * Raw WPM counter
 */
class GrossWPMCounter {
    beg: number = 0
    end: number | undefined = undefined
    letters: number = 0

    beginTyping() {
        this.beg = Date.now()
        this.end = undefined
        this.letters = 0
    }
    typeWord(length: number) {
        this.letters += length + 1
    }
    endTyping() {
        this.end = Date.now()
    }
    getWPM(): number {
        let time = (this.end ? this.end : Date.now()) - this.beg
        return (this.letters / 5) / (time / 60000)
    }
}

export const useStatsStore = defineStore('stats', () => {
    let wpmCounter = ref(new GrossWPMCounter)
    let paragraphWPMs = ref([] as number[])

    function $reset() {
        wpmCounter.value = new GrossWPMCounter
        paragraphWPMs.value = []
    }

    // Clear stats
    let { chapter } = storeToRefs(useTypingStore())
    watch(chapter, () => {
        paragraphWPMs.value = []
    })

    function beginChapter() {
    }
    function endChapter() {
    }
    function beginParagraph() {
        wpmCounter.value.beginTyping()
    }
    function endParagraph() {
        wpmCounter.value.endTyping()
        paragraphWPMs.value.push(wpmCounter.value.getWPM())
    }
    /**
     * @param length length of the typed word
     */
    function typeWord(length: number) {
        wpmCounter.value.typeWord(length)
    }
    function typeLetter() {
    }
    function typeError() {
    }

    return {
        wpmCounter,
        paragraphWPMs,

        $reset,

        beginChapter,
        endChapter,
        beginParagraph,
        endParagraph,
        typeWord,
        typeLetter,
        typeError,
    }
})