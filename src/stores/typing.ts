import { defineStore } from 'pinia'
import { Book, Chapter } from '../lib/book'

interface TypingObj {
    book: Book | undefined,
    chapter: Chapter | undefined,
    isTyping: boolean
}

export const useTypingStore = defineStore('typing', {
    state: (): TypingObj => ({
        book: undefined,
        chapter: undefined,
        isTyping: false,
    })
})