import { defineStore } from 'pinia'
import { Book } from '../lib/book'
import ePub from 'epubjs'
import { computed, ref } from 'vue'

export interface Bookmark {
    chapter: number
    paragraph: number
    progress: number
}

export interface BookRecord {
    filename: string
    toc: string[]
    bookmarks: Bookmark[]

    author: string
    title: string
    description: string
    date: string
    id: string
    lang: string
}

export const useLibraryStore = defineStore('library', () => {
    const books = ref([] as BookRecord[])
    const hasBookmarks = computed(() => {
        return books.value.findIndex(book => book.bookmarks.length > 0) != -1
    })

    function $reset() {
        books.value = [] as BookRecord[]
    }
    function exists(filename: string): boolean {
        for (let i = 0; i < books.value.length; i++) {
            if (books.value[i].filename == filename) {
                return true
            }
        }
        return false;
    }
    async function loadBook(file: File): Promise<Book> {
        let epub = ePub(await file.arrayBuffer())
        await epub.ready
        let metadata = await epub.loaded.metadata
        let nav = await epub.loaded.navigation
        let book = new Book(file.name, epub, nav, metadata)

        // Load epub file from book records
        if (!exists(file.name)) {
            books.value.push(book.record)
        } else {
            book.record = books.value.find(b => b.filename == file.name) as BookRecord;
        }

        return book
    }

    return {
        books,
        hasBookmarks,
        // functions
        $reset,
        exists,
        loadBook,
    }
},
    {
        persist: true,
    })
