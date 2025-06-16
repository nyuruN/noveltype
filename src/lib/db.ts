import Dexie from "dexie";

function createDB(): Dexie {
    let db = new Dexie('noveltypeDB')

    db.version(2).stores({
        epub: 'name, type, data, lastModified',
        cover: 'name, blob',
    })

    return db
}

export default {
    async persist(): Promise<boolean> {
        return navigator.storage && navigator.storage.persist &&
            (await navigator.storage.persist());
    },
    async isStoragePersistant(): Promise<boolean> {
        return navigator.storage && navigator.storage.persisted &&
            (await navigator.storage.persisted());
    },

    async saveCover(name: string, cover: Blob) {
        let db = createDB();

        await db.table('cover').add({
            name: name,
            blob: cover,
        })

        db.close()
    },
    async loadCover(name: string): Promise<Blob | undefined> {
        let db = createDB();

        let record = await db.table('cover').get(name)

        if (!record) {
            return undefined;
        }

        let blob = record.blob

        console.log(blob)

        db.close()

        return blob
    },
    async deleteCover(name: string) {
        let db = createDB();

        await db.table('cover').delete(name)

        db.close()
    },
    async saveEpubFile(file: File) {
        let db = createDB();

        await db.table('epub').add({
            name: file.name,
            type: file.type,
            data: file,
            lastModified: file.lastModified,
        })

        db.close()
    },
    async loadEpubFile(filename: string) {
        let db = createDB();

        let fileRecord = await db.table('epub').get(filename)
        let file = new File([fileRecord.data], fileRecord.name, { type: fileRecord.type, lastModified: fileRecord.lastModified })

        console.log(file)

        db.close()

        return file
    },
    async deleteEpubFile(filename: string) {
        let db = createDB();

        await db.table('epub').delete(filename)

        db.close()
    },
    async deleteDB() {
        await Dexie.delete('noveltypeDB')
    }
}