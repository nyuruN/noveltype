import { defineStore } from 'pinia'
import { Book, Chapter, Library } from '../library'
import { ref, type Ref } from 'vue'


export const useLocalStore = defineStore('local', {
  state: () => ({
    library: new Library()
  }),
  persist: true,
})

export const useTempStore = defineStore('temp', () => {
  const book: Ref<Book | undefined> = ref(undefined)
  const chapter: Ref<Chapter | undefined> = ref(undefined)
  const isTyping = ref(false)

  return { book, chapter, isTyping }
})