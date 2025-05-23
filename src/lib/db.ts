import Dexie from "dexie";

export async function deleteDB() {
    await Dexie.delete('noveltypeDB')
}
export function createDB(): Dexie {
    let db = new Dexie('noveltypeDB')

    db.version(1).stores({
        epub: 'name, type, data, lastModified'
    })

    return db
}
export async function saveEpubFile(file: File) {
    let db = createDB();

    await db.table('epub').add({
        name: file.name,
        type: file.type,
        data: file,
        lastModified: file.lastModified,
    })

    db.close()
}
export async function loadEpubFile(filename: string) {
    let db = createDB();

    let fileRecord = await db.table('epub').get(filename)
    let file = new File([fileRecord.data], fileRecord.name, { type: fileRecord.type, lastModified: fileRecord.lastModified })

    console.log(file)

    db.close()

    return file
}