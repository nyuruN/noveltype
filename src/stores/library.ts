import { defineStore } from 'pinia'
import { Book, Chapter, Library } from '../library'

export const useLocalStore = defineStore('local', {
  state: () => ({
    library: new Library()
  }),
  persist: true,
})

interface TempObj {
  book: Book | undefined,
  chapter: Chapter | undefined,
  isTyping: boolean
}

export const useTempStore = defineStore('temp', {
  state: (): TempObj => ({
    book: undefined,
    chapter: undefined,
    isTyping: false,
  })
})