import { Book as EPub } from 'epubjs'
import type Navigation from 'epubjs/types/navigation';
import type { PackagingMetadataObject } from 'epubjs/types/packaging';
import type { Bookmark, BookRecord } from '../stores/library';
import { removeFancyTypography, scrollToNextCaretPos, type Offset } from './utils';
import { useStatsStore, } from '@/stores/typing';
import { useSettingsStore } from '@/stores/settings';
import { nextTick } from 'vue';
import path from './path';

export class Book {
    constructor(filename: string, epub: EPub, nav: Navigation, metadata: PackagingMetadataObject) {
        this.epub = epub

        let toc: string[] = []
        let tocHref: string[] = []

        let last = this.epub.spine.last().index
        for (let i = 0; i <= last; i++) {
            let section = this.epub.spine.get(i)
            let navItem = nav.get('#' + section.idref) || nav.get(section.href)
            let label = navItem ? navItem.label : 'undefined'
            toc.push(label)
            tocHref.push(section.href)
        }

        this.tocHref = tocHref
        this.record = {
            toc: toc,
            bookmarks: [],
            filename: filename,

            author: metadata.creator,
            title: metadata.title,
            description: metadata.creator,
            date: metadata.pubdate,
            id: metadata.identifier,
            lang: metadata.language,
        }
    }

    epub: EPub
    record: BookRecord
    tocHref: string[] = []

    async getChapter(n: number): Promise<Chapter> {
        let href = this.tocHref[n]
        let doc = await this.epub.load(href) as XMLDocument

        return new Chapter(this, n, doc)
    }
    /**
     * The allow-same-origin sandbox property is needed in case of an iframe element
     * @returns 
     */
    async getCoverDocument(): Promise<XMLDocument> {
        const item = this.epub.spine.get(0);
        const doc = await this.epub.load(item.href) as XMLDocument;

        // Inject <base> tag to set document-relative URL resolution
        const baseTag = doc.createElement("base");
        baseTag.href = this.epub.path.resolve(item.href); // Absolute path to the spine item
        doc.head.prepend(baseTag);

        // Process all elements with resource references
        for (const { name, attr } of [
            { name: "img", attr: "src" },
            { name: "image", attr: "href" },
            { name: "link", attr: "href" },
            { name: "script", attr: "src" },
        ]) {
            for (const element of doc.documentElement.querySelectorAll(name)) {
                const XLINK_NS = 'http://www.w3.org/1999/xlink' as const;
                const dir = path.dirname(item.canonical)
                const xlinkPath = element.getAttributeNS(XLINK_NS, 'href');
                const normalPath = element.getAttribute(attr);
                const relativePath = xlinkPath || normalPath;

                if (relativePath) {
                    const absolutePath = path.resolve(dir, relativePath)
                    const blob = await this.epub.archive.getBlob(absolutePath);
                    const blobUrl = URL.createObjectURL(blob);
                    element.setAttribute(attr, blobUrl); // Replace with Blob URL
                }

                // Because of an undocumented optimization on chromium based browsers
                // If both 'xlink:href' and 'href' are present, 'href' will be omitted!
                // As such we must either:
                // - remove 'xlink:href' for data in 'href' to take precedence OR
                // - set data url before html-to-image
                if (xlinkPath) {
                    element.removeAttributeNS(XLINK_NS, 'href');
                }
            }
        }
        return doc
    }
    async getFirstImage(canonical: string, doc: XMLDocument): Promise<Blob | undefined> {
        // Process all elements with resource references
        for (const { name, attr } of [
            { name: "img", attr: "src" },
            { name: "image", attr: "href" },
        ]) {
            for (const element of doc.documentElement.querySelectorAll(name)) {
                const XLINK_NS = 'http://www.w3.org/1999/xlink' as const;
                const dir = path.dirname(canonical)
                const xlinkPath = element.getAttributeNS(XLINK_NS, 'href');
                const normalPath = element.getAttribute(attr);
                const relativePath = xlinkPath || normalPath;

                if (relativePath) {
                    const absolutePath = path.resolve(dir, relativePath)
                    const blob = await this.epub.archive.getBlob(absolutePath);
                    return blob;
                }
            }
        }
        return undefined;
    }
    async getCover(): Promise<Blob | undefined> {
        const coverPath = await this.epub.loaded.cover;

        // CASE 1: The cover is a xhtml document -> extract the first image
        if (coverPath && coverPath.endsWith('.xhtml')) {
            const doc = await this.epub.load(coverPath) as XMLDocument;

            return this.getFirstImage(coverPath, doc)
        }

        // CASE 2: The cover is any other file -> hope the browser can display it
        if (coverPath) {
            const blob = await this.epub.archive.getBlob(coverPath)
            if (blob.type.startsWith('image/')) {
                return blob
            }
        }

        // CASE 3: No cover is provided -> Try and extract first image from first chapter
        const item = this.epub.spine.get(0);
        const doc = await this.epub.load(item.href) as XMLDocument;

        return this.getFirstImage(item.canonical, doc)
    }
}

export class Chapter {
    constructor(book: Book, index: number, doc: XMLDocument) {
        this.book = new WeakRef(book)
        this.title = doc.getElementsByTagName('title')[0].textContent as string
        this.index = index
        this.bookmark = book.record.bookmarks.find(b => b.chapter == this.index)?.paragraph;

        const paragraphs = doc.querySelectorAll('p, blockquote, li, pre, h1, h2, h3, h4, h5, h6');
        let idx = 0;
        paragraphs.forEach(el => {
            let text = (el as HTMLElement).innerText.trim()

            if (text) {
                // Clean text
                text = text.replace(/[\t\r\v\f\b\0]/g, '')
                text = text.replace(/\n/g, ' ')
                text = text.replace(/  +/g, ' ')
                text = removeFancyTypography(text)
                this.paragraphs.push(new Paragraph(text, idx))
                idx++
            }
        });

        if (this.paragraphs.length == 0) {
            this.empty = true
            this.paragraphs.push(new Paragraph('', 0))
        }
    }

    book: WeakRef<Book>

    title: string
    index: number
    // Bookmarked paragraph
    bookmark: number | undefined = undefined
    /**
     * Indicates that the user has finished typing
     */
    typed: boolean = false
    /**
     * The chapter is empty and will finish on enter press
     */
    empty: boolean = false
    paragraphs: Paragraph[] = []
    caret = {
        p: 0,
        l: 0
    }
    started = false

    input(key: string) {
        if (!this.started) {
            this.started = true;
            useStatsStore().beginChapter()
        }

        this.caret.l += this.paragraphs[this.caret.p].input(key, this.caret.l)
        nextTick().then(() => this.refreshCaret())
    }
    /**
     * Required for undoing errors
     */
    backspace() {
        this.caret.l += this.paragraphs[this.caret.p].backspace(this.caret.l)
        nextTick().then(() => this.refreshCaret())
    }
    /**
     * Call when enter is pressed
     */
    enter() {
        // There is no chapter to begin with (blank page)
        if (this.empty) {
            this.typed = true
            return
        }

        let paragraph = this.paragraphs[this.caret.p]
        let stopOnError = useSettingsStore().typing.stopOnError !== undefined;
        let lastWord = paragraph.words[paragraph.words.length - 1]
        let isError = lastWord ? lastWord.error : false

        // If the end of paragraph was reached
        if (this.caret.l >= paragraph.source.length && !(stopOnError && isError)) {
            // Cleanup
            paragraph.finish()

            // The entire chapter was typed
            if (this.caret.p + 1 > this.paragraphs.length - 1) {
                this.typed = true
                useStatsStore().endChapter()
                return
            }

            // Buffer one rendered paragraph
            if (this.paragraphs[this.caret.p + 1]) this.paragraphs[this.caret.p + 1].render();

            // Update caret
            this.caret.p++
            this.caret.l = 0
            nextTick().then(() => this.refreshCaret(true))
        }
    }
    goTo(paragraph: number) {
        this.caret.p = paragraph
        this.caret.l = 0
        if (this.paragraphs[paragraph]) this.paragraphs[paragraph].render()
        if (this.paragraphs[paragraph + 1]) this.paragraphs[paragraph + 1].render()
    }
    /**
     * Toggles the bookmark on this chapter (one per chapter only)
     * @param paragraph specifies which paragraph to enable
     */
    toggleBookmark(paragraph?: number) {
        let book = this.book.deref()
        if (!book) {
            return;
        }

        if (this.bookmark !== undefined) {
            // Find bookmark in record and delete it
            let idx = book.record.bookmarks.findIndex(bookmark => bookmark.chapter == this?.index)
            if (idx != -1) {
                this.bookmark = undefined
                console.log(book.record.bookmarks.splice(idx, 1))
            }
        } else {
            const p = (paragraph !== undefined) ? paragraph : this.caret.p
            const bookmark = {
                chapter: this.index,
                paragraph: p,
                progress: p / (this.paragraphs.length - 1),
            } as Bookmark;
            console.log(bookmark)
            book.record.bookmarks.push(bookmark)
            this.bookmark = bookmark.paragraph
        }
    }
    /**
     * Call when chapter layout has changed
     * @param scroll scrolls to the caret position with calculated offset
     */
    refreshCaret(scroll?: boolean) {
        let caret = document.getElementById('caret') as HTMLElement
        let paragraph = document.getElementsByClassName('paragraph')[this.caret.p] as HTMLElement

        if (paragraph) {
            let offset = this.paragraphs[this.caret.p].getLetterOffset(paragraph, this.caret.l)

            caret.style['top'] = offset.top + 'px'
            caret.style['left'] = offset.left + 'px'

            if (scroll || offset.top - caret.offsetTop != 0) {
                scrollToNextCaretPos(offset.top - caret.offsetTop)
            }
        } else if (scroll) { // Handle empty chapter
            caret.style['top'] = '0px'
            caret.style['left'] = '0px'
            scrollToNextCaretPos(-caret.offsetTop)
        }
    }
    /**
     * Goes to the first paragraph of the next chapter
     */
    next(): Promise<Chapter> | undefined {
        let book = this.book.deref()
        return (book && this.index < book.record.toc.length - 1)
            ? book.getChapter(this.index + 1).then(chapter => {
                chapter.goTo(0)
                return chapter
            })
            : undefined
    }
    /**
     * Goes to the first paragraph of the previous chapter
     */
    prev(): Promise<Chapter> | undefined {
        let book = this.book.deref()
        return (book && this.index > 0)
            ? book.getChapter(this.index - 1).then(chapter => {
                chapter.goTo(0)
                return chapter
            })
            : undefined
    }
}

export class Paragraph {
    constructor(text: string, index: number) {
        this.source = text
        this.words = this.source.split(' ').map((word: string): Word => {
            return new Word(word)
        })
        this.index = index
        this.empty = text === ''
    }

    words: Word[] = []
    source: string
    index: number
    empty: boolean
    /**
     * Indicates whether each word should render as indivudual letters
     */
    isRendered: boolean = false
    started = false

    /**
     * @param idx Caret position in this.source
     * @returns Horizontal movement of the caret
     */
    input(key: string, idx: number): number {
        // Ignore all input if empty
        if (this.empty) return 0;

        if (!this.started) {
            this.started = true;
            useStatsStore().beginParagraph(this.index)
        }

        // Don't let Word.input() complete but allow overflows
        // Should be handled by Chapter.enter()
        // Also don't allow overflows if the last word was skipped
        if (idx == this.source.length && key == ' ' || this.words[this.words.length - 1].typed) {
            return 0;
        }

        let [wid, lid] = this.getWordLetterIdx(idx)
        let move = this.words[wid].input(key, lid)

        // Limit idx within bounds of this.source
        // Required for backspacing last word
        return Math.min(move, this.source.length - idx)
    }
    /**
     * @param idx Caret position on this.source
     * @returns Horizontal movement of the caret
     */
    backspace(idx: number): number {
        // Ignore all input if empty
        if (this.empty) return 0;

        let [wid, lid] = this.getWordLetterIdx(idx)

        // Allow going back to previous words in freedom mode or on error
        if (lid == 0) {
            let lastword = this.words[wid - 1]
            if (lastword && (lastword.error || useSettingsStore().typing.freedomMode)) {
                useStatsStore().untypeWord(lastword)
                lastword.typed = false
                // Recalculate error state since incomplete words count as errors
                lastword.error = !lastword.cLetters.every(c => c);
                // Go immediately to last letter position if any
                let lastLetterIdx = lastword.letters.length - lastword.cLetters.length
                return -1 - lastLetterIdx
            }
        }

        return this.words[wid].backspace(lid)
    }
    /**
     * Completes formatting of paragraph
     * @param idx Caret position on this.source
     */
    finish() {
        let store = useStatsStore()

        // Confirm last typed word paragraphs is typed
        let lastWord = this.words[this.words.length - 1];

        if (!lastWord.typed) {
            store.typeWord(lastWord)
            lastWord.typed = true
        }

        store.endParagraph(this.index)
    }
    /**
     * Renders the each word as individual letters (expensive!)
     */
    render() {
        if (this.isRendered) {
            this.reset()
            return;
        }

        this.words.forEach((word) => {
            word.render()
        })
        this.isRendered = true
    }
    /**
     * Resets paragraph typing state
     */
    reset() {
        this.words.forEach(word => {
            word.cLetters = []
            word.error = false
            word.overflow = []
            word.typed = false
        })
    }
    getWordLetterIdx(index: number): [number, number] {
        let i = 0, j = 0
        for (j = 0; j < this.words.length; j++) {
            let word = this.words[j]

            if ((i + word.letters.length) < index) {
                i += word.letters.length + 1
            } else {
                return [j, index - i];
            }
        }
        return [0, 0]
    }
    getLetterOffset(p: HTMLElement, index: number): Offset {
        // Choose first word when first changing paragraphs and when not rendered
        if (!this.isRendered || this.empty) {
            let d = p.getElementsByClassName('word')[0] as HTMLElement
            return {
                top: d.offsetTop,
                left: d.offsetLeft
            }
        }

        // Convert index
        let [j, i] = (index < this.source.length) ?
            this.getWordLetterIdx(index) :
            [this.words.length - 1, this.words[this.words.length - 1].letters.length]

        let w = p.getElementsByClassName('word')[j] as HTMLElement

        return this.words[j].getOffset(w, i)
    }
}

export class Word {
    constructor(word: string) {
        this.word = word
    }

    letters: string[] = []
    overflow: string[] = []
    cLetters: boolean[] = []

    word: string

    // Error underline
    error: boolean = false
    typed: boolean = false

    /**
     * Behaviour 1: Stops on error, requires correct input to proceed
     * Behaviour 2: Writes into overflow buffer, appears as extra letters
     */
    input(key: string, idx: number): number {
        let stats = useStatsStore()
        let settings = useSettingsStore()
        let letter = this.letters[idx] ? this.letters[idx] : ' '

        // Skip behaviour -> On space pressed
        if (settings.typing.stopOnError === undefined && key == ' ') {
            this.typed = true
            // Error if incomplete, otherwise keep error state
            this.error = (idx != this.letters.length) ? true : this.error
            stats.typeWord(this)

            // Skip word
            return (this.letters.length - idx) + 1;
        }

        // Stop on letter behaviour
        if (settings.typing.stopOnError === 'Letter') {
            let isCorrect = key === letter

            if (idx == this.letters.length) {
                if (isCorrect) {
                    stats.typeWord(this)
                }
                else if (!this.overflow.length) {
                    // incorrect and no overflow
                    this.overflow.push(key)
                    this.error = true
                }
            } else {
                this.cLetters[idx] = isCorrect
            }

            // Stop if overflow
            return (isCorrect && !this.overflow.length) ? 1 : 0
        }

        // Overflow behaviour (default)
        let isCorrect = key === letter

        if (idx == this.letters.length) {
            // Wrong input on last char
            if (!isCorrect) {
                this.overflow.push(key)
                // Just errored
                if (!this.error) stats.typeError()
                this.error = true;
                return 0
            }
            // Prevent skipping word in stop on word mode
            else if (!(settings.typing.stopOnError === 'Word' && this.error)) {
                this.typed = true
                stats.typeWord(this)
                return 1
            }
            return 0
        }

        let justErrored = !this.error && !isCorrect
        this.cLetters[idx] = (this.error) ? false : isCorrect
        this.error = (justErrored) ? true : this.error

        if (justErrored)
            stats.typeError()

        return 1
    }
    /**
     * Revert any errors caused by overflow bahaviour
     */
    backspace(idx: number): number {
        // Reset states caused by skipping (last word only)
        if (this.typed) {
            useStatsStore().untypeWord(this)
            this.typed = false
            // Recalculate error state since incomplete words count as errors
            this.error = !this.cLetters.every(c => c);
        }

        // Remove error state if letter before is correct or itself is first letter
        if (this.error) {
            this.error = !((idx - 2) < 0 || this.cLetters.at(idx - 2))
        }

        // Delete overflowing letters
        if (this.overflow.pop() !== undefined) return 0

        // Go to last completed letter if incomplete
        let isIncomplete = idx > this.cLetters.length;
        if (isIncomplete) {
            // Go to last correct letter if stop on letter
            if (useSettingsStore().typing.stopOnError === 'Letter') {
                let lastCorrectIdx = this.cLetters.findLastIndex(value => value)
                // Go to first letter if no correct letters
                return (lastCorrectIdx != -1) ? -(idx - lastCorrectIdx) + 1 : -idx
            }

            return -(idx - this.cLetters.length)
        }

        // Delete letters until backspaced caret position is reached
        let letterPopped = false
        let toIdx = idx - 1;
        while (this.cLetters.length && this.cLetters.length - 1 >= toIdx) {
            // Only if the letter at caret position is popped
            letterPopped = this.cLetters.pop() !== undefined && toIdx >= this.cLetters.length
        }

        return letterPopped ? -1 : 0;
    }
    render() {
        this.letters = this.word.split('')
    }
    /**
     * Should be called on the next tick!
     */
    getOffset(w: HTMLElement, idx: number): Offset {
        // Normal letter
        if (idx < this.letters.length) {
            let l = w.getElementsByClassName('letter')[idx] as HTMLElement
            return {
                top: l.offsetTop,
                left: l.offsetLeft
            }
        } else {
            let l = w.getElementsByClassName('letter')[idx - 1 + this.overflow.length] as HTMLElement
            return {
                top: l.offsetTop,
                left: l.offsetLeft + l.getBoundingClientRect().width
            }
        }
    }
}