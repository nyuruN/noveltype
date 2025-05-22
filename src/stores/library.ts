import { defineStore } from 'pinia'
import { Book, Chapter, Library } from '../library'
import { ref, type Ref } from 'vue'


export const useLibraryStore = defineStore('library', {
  state: () => ({
    library: new Library()
  }),
  persist: true,
})

export const useSessionStore = defineStore('session', () => {
  const book: Ref<Book | undefined> = ref(undefined)
  const chapter: Ref<Chapter | undefined> = ref(undefined)
  const isTyping = ref(false)

  return { book, chapter, isTyping }
}, {
  persist: {
    storage: sessionStorage
  }
})