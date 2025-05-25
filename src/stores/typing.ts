import { defineStore, storeToRefs } from 'pinia'
import { Book, Chapter, Word } from '../lib/book'
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
class WPMCounter {
    beg: number = 0
    end: number | undefined = undefined
    typedLetters: number = 0
    errorLetters: number = 0
    totalLetters: number = 0

    beginTyping() {
        this.beg = Date.now()
        this.end = undefined
        this.typedLetters = 0
        this.errorLetters = 0
        this.totalLetters = 0
    }
    typeWord(word: Word) {
        this.typedLetters += word.cLetters.length
        word.cLetters.forEach(correct => this.errorLetters += correct ? 0 : 1)
        this.totalLetters += word.letters.length
    }
    untypeWord(word: Word) {
        this.typedLetters -= word.cLetters.length
        word.cLetters.forEach(correct => this.errorLetters -= correct ? 0 : 1)
        this.totalLetters -= word.letters.length
    }
    endTyping() {
        this.end = Date.now()
    }
    get() {
        let time = ((this.end ? this.end : Date.now()) - this.beg) / 60000
        let raw = (this.typedLetters / 5) / time
        let wpm = raw - (this.errorLetters / 5) / time
        let acc = (this.typedLetters - this.errorLetters) / this.totalLetters;
        return { raw, wpm, acc }
    }
}

export const useStatsStore = defineStore('stats', () => {
    let wpmCounter = ref(new WPMCounter)
    let paragraphWPMs = ref([] as {
        raw: number,
        wpm: number,
        acc: number,
    }[])

    function $reset() {
        wpmCounter.value = new WPMCounter
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
        paragraphWPMs.value.push(wpmCounter.value.get())
    }
    /**
     * @param length length of the typed word
     */
    function typeWord(word: Word) {
        wpmCounter.value.typeWord(word)
    }
    function untypeWord(word: Word) {
        wpmCounter.value.untypeWord(word)
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
        untypeWord,
        typeError,
    }
})