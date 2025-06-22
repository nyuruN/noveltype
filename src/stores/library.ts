import { defineStore } from 'pinia'
import { Book } from '../lib/book'
import ePub from 'epubjs'
import { computed, ref } from 'vue'
import db from '@/lib/db'
import { scaleImageBlob } from '@/lib/utils'
import { useCacheStore } from './cacheStore'

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

        if (!exists(file.name)) {
            // Create new record for the book
            books.value.push(book.record)

            // Save to larger storage
            await db.saveEpubFile(file)

            // Load book covers asynchronously
            book.getCover().then(async (blob) => {
                if (!blob) return;

                const scaled = await scaleImageBlob(blob, 400, 600)
                const url = URL.createObjectURL(scaled);
                await db.saveCover(file.name, scaled);

                useCacheStore().bookCovers.set(file.name, url)
            })
        } else {
            // Have book.record point to the record in library
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
