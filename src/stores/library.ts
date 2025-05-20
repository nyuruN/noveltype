import { defineStore } from 'pinia'
import { Book, Chapter, Library } from '../library'

interface LibraryObj {
  library: Library
  book: Book | undefined
  chapter: Chapter | undefined
}

export const useLibraryStore = defineStore('library', {
  state: (): LibraryObj => ({
    library: new Library(),
    book: undefined,
    chapter: undefined,
  }),
})