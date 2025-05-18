import { defineStore } from 'pinia'
import { Book, Library } from '../library'

interface LibraryObj {
  library: Library
  book: Book | undefined
}

export const useLibraryStore = defineStore('library', {
  state: (): LibraryObj => ({
    library: new Library(),
    book: undefined,
  }),
})