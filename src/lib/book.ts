import { Book as EPub } from 'epubjs'
import type Navigation from 'epubjs/types/navigation';
import type { PackagingMetadataObject } from 'epubjs/types/packaging';
import type { BookRecord } from '../stores/library';
import { removeFancyTypography, scrollToNextCaretPos, type Offset } from './utils';
import { useStatsStore, } from '@/stores/typing';
import { useSettingsStore } from '@/stores/settings';

export class Book {
    constructor(filename: string, epub: EPub, nav: Navigation, metadata: PackagingMetadataObject) {
        this.epub = epub

        let toc: [string, string][] = []

        let last = this.epub.spine.last().index
        for (let i = 0; i <= last; i++) {
            let section = this.epub.spine.get(i)
            let navItem = nav.get('#' + section.idref) || nav.get(section.href)
            let label = navItem ? navItem.label : 'undefined'
            toc.push([label, section.href])
        }

        this.record = {
            toc: toc,
            chapterCount: toc.length,

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

    async getChapter(n: number): Promise<Chapter> {
        let href = this.record.toc[n][1]
        let doc = await this.epub.load(href) as XMLDocument

        return new Chapter(this, n, doc)
    }
}

export class Chapter {
    constructor(book: Book, index: number, doc: XMLDocument) {
        this.book = new WeakRef(book)
        this.title = doc.getElementsByTagName('title')[0].textContent as string
        this.index = index

        const paragraphs = doc.querySelectorAll('p, blockquote, li, pre, h1, h2, h3, h4, h5, h6');
        paragraphs.forEach(el => {
            let text = (el as HTMLElement).innerText.trim()

            if (text) {
                // Clean text
                text = text.replace(/[\t\r\v\f\b\0]/g, '');
                text = text.replace(/\n/g, ' ')
                text = text.replace(/  +/g, ' ')
                text = removeFancyTypography(text)
                this.paragraphs.push(new Paragraph(text));
            }
        });

        // Buffer one rendered paragraph
        if (this.paragraphs[0]) this.paragraphs[0].render();
        if (this.paragraphs[1]) this.paragraphs[1].render();
    }

    book: WeakRef<Book>

    title: string
    index: number
    finished: boolean = false
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

        let movement = this.paragraphs[this.caret.p].input(key, this.caret.l)
        this.moveCaret(movement)
    }
    /**
     * Required for undoing errors
     */
    backspace() {
        let movement = this.paragraphs[this.caret.p].backspace(this.caret.l)
        this.moveCaret(movement)
    }
    /**
     * Call when enter is pressed
     */
    enter() {
        let paragraph = this.paragraphs[this.caret.p]

        // There is no chapter to begin with (blank page)
        if (!paragraph) {
            this.finished = true
            return
        }
        // If the end of paragraph was reached
        if (this.caret.l >= paragraph.source.length) {
            // Cleanup
            paragraph.finish()

            // The entire chapter was typed
            if (this.caret.p + 1 > this.paragraphs.length - 1) {
                this.finished = true
                useStatsStore().endChapter()
                return
            }
            this.caret.p++
            this.caret.l = 0

            let p = document.getElementsByClassName('paragraph')[this.caret.p]
            let offset = this.paragraphs[this.caret.p].getLetterOffset(p as HTMLElement, this.caret.l)
            let caret = document.getElementById('caret') as HTMLElement;

            caret.style['top'] = offset.top + 'px'
            caret.style['left'] = offset.left + 'px'

            scrollToNextCaretPos(offset.top - caret.offsetTop)
            // Buffer one rendered paragraph
            if (this.paragraphs[this.caret.p + 1]) this.paragraphs[this.caret.p + 1].render();
        }
    }
    moveCaret(movement: number) {
        this.caret.l += movement;

        let p = document.getElementsByClassName('paragraph')[this.caret.p]
        let offset = this.paragraphs[this.caret.p].getLetterOffset(p as HTMLElement, this.caret.l)

        // Distinguish caret position and actual offset
        if (offset.left == 0 && offset.top == 0) {
            return
        }

        let caret = document.getElementById('caret') as HTMLElement

        // Caret line changed (Scroll update)
        if (caret.offsetTop != offset.top) {
            console.log('line changed')
            scrollToNextCaretPos(offset.top - caret.offsetTop)
        }

        caret.style['top'] = offset.top + 'px'
        caret.style['left'] = offset.left + 'px'
    }
    /**
     * Call when the chapter content has finished loading
     */
    resetCaret() {
        let caret = document.getElementById('caret') as HTMLElement
        let letter = document.getElementsByClassName('letter')[0]

        if (letter) {
            let l = letter as HTMLElement
            caret.style['top'] = l.offsetTop + 'px'
            caret.style['left'] = l.offsetLeft + 'px'
            caret.style['height'] = l.getBoundingClientRect().height + 'px'
        }
    }
    next(): Promise<Chapter> | undefined {
        let book = this.book.deref()
        return (book && this.index < book.record.chapterCount - 1) ? book.getChapter(this.index + 1) : undefined
    }
    prev(): Promise<Chapter> | undefined {
        let book = this.book.deref()
        return (book && this.index > 0) ? book.getChapter(this.index - 1) : undefined
    }
}

export class Paragraph {
    constructor(text: string) {
        this.source = text
        this.words = this.source.split(' ').map((word: string): Word => {
            return new Word(word)
        })
    }

    words: Word[] = []
    source: string
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
        // Don't let Word.input() complete but allow overflows
        // Should be handled by Chapter.enter()
        if (idx == this.source.length && key == ' ') {
            return 0;
        }
        if (!this.started) {
            this.started = true;
            useStatsStore().beginParagraph()
        }


        let [wid, lid] = this.getWordLetterIdx(idx)
        return this.words[wid].input(key, lid)
    }
    /**
     * @param idx Caret position on this.source
     * @returns Horizontal movement of the caret
     */
    backspace(idx: number): number {
        let [wid, lid] = this.getWordLetterIdx(idx)
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

        store.typeWord(lastWord)
        lastWord.typed = true

        store.endParagraph()
    }
    /**
     * Renders the each word as individual letters (expensive!)
     */
    render() {
        this.words.forEach((word) => {
            word.render()
        })
        this.isRendered = true
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
        // Choose first word when first changing paragraphs
        if (!this.isRendered) {
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
        if (settings.typing.allowWordSkipping && key == ' ') {
            this.typed = true
            // Error if incomplete, otherwise keep error state
            this.error = (idx != this.letters.length) ? true : this.error
            stats.typeWord(this)

            // Skip word
            return (this.letters.length - idx) + 1;
        }

        // Stop behaviour
        if (settings.typing.stopOnError) {
            let isCorrect = key === letter
            this.cLetters[idx] = (this.cLetters[idx] !== false) ? isCorrect : false // Keep error state

            if (isCorrect) stats.typeLetter()
            if (isCorrect && idx == this.letters.length) stats.typeWord(this)

            return isCorrect ? 1 : 0
        }
        // Overflow behaviour
        else {
            let isCorrect = key === letter
            if (idx == this.letters.length) {
                // Wrong input on last char
                if (!isCorrect) {
                    this.overflow.push(key)
                    // Just errored
                    if (!this.error) stats.typeError()
                    this.error = true;
                } else {
                    // Complete word
                    this.typed = true
                    stats.typeWord(this)
                }
                return isCorrect ? 1 : 0
            }

            let justErrored = !this.error && !isCorrect
            this.cLetters[idx] = (this.error) ? false : isCorrect
            this.error = (justErrored) ? true : this.error

            if (justErrored)
                stats.typeError()
            else if (!this.error)
                stats.typeLetter()

            return 1
        }
    }
    /**
     * Revert any errors caused by overflow bahaviour
     */
    backspace(idx: number): number {
        if (useSettingsStore().typing.stopOnError) {
            return 0
        } else {
            this.error = (this.error) ? !(this.cLetters[idx - 2] || true) : false
            let hasOverflow = this.overflow.pop() !== undefined
            let letterPopped = (hasOverflow) ? true : this.cLetters.pop() == undefined
            return (letterPopped) ? 0 : -1
        }
    }
    render() {
        this.letters = this.word.split('')
    }
    getOffset(w: HTMLElement, idx: number): Offset {
        if (idx < this.letters.length) {
            let l = w.getElementsByClassName('letter')[idx] as HTMLElement
            return {
                top: l.offsetTop,
                left: l.offsetLeft
            }
        } else {
            // We can only estimate based on the current letter width
            let overflow = Math.max(this.overflow.length - 1, 0)
            let l = w.getElementsByClassName('letter')[idx - 1 + overflow] as HTMLElement
            let width = l.getBoundingClientRect().width
            return {
                top: l.offsetTop,
                // Sadly, because the offset is immediately needed after input()
                // we cannot use the last overflow letter since it is unrendered
                left: l.offsetLeft + width * (this.overflow.length ? 2 : 1)
            }
        }
    }
}