import ePub, { Book as EPub } from 'epubjs'
import type Navigation from 'epubjs/types/navigation';
import type { PackagingMetadataObject } from 'epubjs/types/packaging';

// Sourced from https://github.com/ProfXwing/copytype
function removeFancyTypography(textToClean: string) {
    const specials = {
        "“": '"', // &ldquo;	&#8220;
        "”": '"', // &rdquo;	&#8221;
        "’": "'", // &lsquo;	&#8216;
        "‘": "'", // &rsquo;	&#8217;
        ",": ",", // &sbquo;	&#8218;
        "—": "-", // &mdash;    &#8212;
        "…": "...", // &hellip; &#8230;
        "«": "<<",
        "»": ">>",
        "–": "-",
    };
    return textToClean.replace(/[“”’‘—,…«»–]/g, (char) => {
        return specials[char as keyof object] || "";
    });
}

interface Offset {
    top: number,
    left: number
}

export class Library {
    constructor() { }

    books: Book[] = [];

    length() { return this.books.length }
    async loadBook(file: File): Promise<Book> {
        var epub = ePub(await file.arrayBuffer())
        await epub.ready
        var metadata = await epub.loaded.metadata
        var nav = await epub.loaded.navigation
        var book = new Book(epub, nav, metadata)

        this.books.push(book)

        return book
    }
}

export class Book {
    constructor(epub: EPub, nav: Navigation, metadata: PackagingMetadataObject) {
        this.epub = epub

        var last = this.epub.spine.last().index
        for (var i = 0; i <= last; i++) {
            var section = this.epub.spine.get(i)
            var navItem = nav.get('#' + section.idref) || nav.get(section.href)
            var label = navItem ? navItem.label : 'undefined'
            this.toc.push([label, section.href])
        }
        this.chapterCount = this.toc.length

        this.author = metadata.creator
        this.title = metadata.title
        this.description = metadata.creator
        this.date = metadata.pubdate
        this.id = metadata.identifier
        this.lang = metadata.language
    }

    epub: EPub
    toc: [string, string][] = []
    chapterCount: number

    author: string
    title: string
    description: string
    date: string
    id: string
    lang: string

    async getChapter(n: number): Promise<Chapter> {
        var href = this.toc[n][1]
        var doc = await this.epub.load(href) as XMLDocument

        return new Chapter(this, n, doc)
    }
}

export class Chapter {
    constructor(book: Book, index: number, doc: XMLDocument) {
        this.book = new WeakRef(book)
        this.title = doc.getElementsByTagName('title')[0].textContent as string
        this.index = index

        var paragraphElements = doc.querySelectorAll('p, blockquote, li, pre, h1, h2, h3, h4, h5, h6');
        paragraphElements.forEach(el => {
            var text = (el as HTMLElement).innerText.trim()

            if (text) {
                // Clean text
                text = text.replace(/[\t\r\v\f\b\0]/g, '');
                text = text.replace(/\n/g, ' ')
                text = text.replace(/  +/g, ' ')
                text = removeFancyTypography(text)
                this.paragraphs.push(new Paragraph(text));
            }
        });
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

    input(key: string) {
        let typed = this.paragraphs[this.caret.p].input(key, this.caret.l);

        if (typed) {
            this.caret.l += 1;

            let p = document.getElementsByClassName('paragraph')[this.caret.p]
            let offset = this.paragraphs[this.caret.p].getLetterOffset(p as HTMLElement, this.caret.l);

            let caret = document.getElementById('caret') as HTMLElement;

            caret.style['top'] = offset.top + 'px'
            caret.style['left'] = offset.left + 'px'
        }
    }
    /**
     * Call when enter is pressed
     */
    enter() {
        let paragraph = this.paragraphs[this.caret.p]

        if (!paragraph) {
            this.finished = true
            return
        }
        // If the end of paragraph was reached
        if (this.caret.l >= paragraph.source.length - 1) {
            // The entire chapter was typed
            if (this.caret.p + 1 > this.paragraphs.length - 1) {
                this.finished = true
                return
            }
            this.caret.p++
            this.caret.l = 0

            let p = document.getElementsByClassName('paragraph')[this.caret.p]
            let offset = this.paragraphs[this.caret.p].getLetterOffset(p as HTMLElement, this.caret.l);
            let caret = document.getElementById('caret') as HTMLElement;

            caret.style['top'] = offset.top + 'px'
            caret.style['left'] = offset.left + 'px'
        }
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
        return (book && this.index < book.chapterCount - 1) ? book.getChapter(this.index + 1) : undefined
    }
    prev(): Promise<Chapter> | undefined {
        let book = this.book.deref()
        return (book && this.index > 0) ? book.getChapter(this.index - 1) : undefined
    }
}

export class Paragraph {
    constructor(text: string) {
        this.source = text
        this.words = text.split(' ').map((word: string): Word => {
            return new Word(word)
        })
    }

    words: Word[]
    source: string

    input(key: string, pos: number): boolean {
        if (key == this.getLetter(pos)) {
            this.setLetterCorrect(pos)
            return true;
        }
        return false;
    }
    getLetter(index: number): string | undefined {
        return this.source.at(index)
    }
    setLetterCorrect(index: number) {
        let i = 0
        for (let j = 0; j < this.words.length; j++) {
            let word = this.words[j]

            if ((i + word.letters.length) < index) {
                i += word.letters.length + 1
            } else {
                word.cLetters[index - i] = true
                return;
            }
        }
    }
    getLetterOffset(p: HTMLElement, index: number): Offset {
        let i = 0, j = 0;
        for (; j < this.words.length; j++) {
            let word = this.words[j]

            if ((i + word.letters.length) < index) {
                i += word.letters.length + 1
            } else {
                i = index - i
                break;
            }
        }

        if (i < this.words[j].letters.length) {
            let l = p.getElementsByClassName('word')[j].getElementsByClassName('letter')[i] as HTMLElement;
            return {
                top: l.offsetTop,
                left: l.offsetLeft
            }
        } else {
            let l = p.getElementsByClassName('word')[j].getElementsByClassName('letter')[i - 1] as HTMLElement;
            return {
                top: l.offsetTop,
                left: l.offsetLeft + l.getBoundingClientRect().width
            }
        }
    }
}

export class Word {
    constructor(word: string) {
        this.letters = word.split('')
    }

    letters: string[]
    cLetters: boolean[] = []
    eLetters: boolean[] = []

    correct: boolean = false
    error: boolean = false
}