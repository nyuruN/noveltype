import { defineStore } from "pinia";
import { useLibraryStore } from "./library";
import db from "@/lib/db";

export const useCacheStore = defineStore('cache', {
    state: () => ({
        images: new Map<string, string>()
    }),
    actions: {
        loadImages() {
            for (const book of useLibraryStore().books) {
                db.loadCover(book.filename).then((coverImage) => {
                    if (coverImage) {
                        const url = URL.createObjectURL(coverImage)
                        this.images.set(book.filename, url)
                    }
                })
            }
        }
    }
})
