import { defineStore } from 'pinia'
import { Book } from '../lib/book'
import ePub from 'epubjs'

export interface BookRecord {
  toc: string[]
  chapterCount: number

  filename: string
  author: string
  title: string
  description: string
  date: string
  id: string
  lang: string
}

interface LibraryObj {
  books: BookRecord[]
}

export const useLibraryStore = defineStore('library', {
  state: (): LibraryObj => ({
    books: []
  }),
  actions: {
    exists(filename: string): boolean {
      for (let i = 0; i < this.books.length; i++) {
        if (this.books[i].filename == filename) {
          return true
        }
      }
      return false;
    },
    async loadBook(file: File): Promise<Book> {
      let epub = ePub(await file.arrayBuffer())
      await epub.ready
      let metadata = await epub.loaded.metadata
      let nav = await epub.loaded.navigation
      let book = new Book(file.name, epub, nav, metadata)

      // Load epub file from book records
      if (!this.exists(file.name)) {
        this.books.push(book.record)
      }

      return book
    }
  },
  persist: true,
})
