import Dexie from "dexie";

export function createDB(): Dexie {
    let db = new Dexie('booktyprDB')

    db.version(1).stores({
        epub: 'name, file'
    })

    return db
}
export async function saveEpub(_: File) {
    console.log('Saving to DB')
}
export async function loadEpub(_: string): Promise<File> {
    console.log('Loading from DB')
    throw 1;
}