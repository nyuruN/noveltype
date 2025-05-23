
export interface Offset {
    top: number,
    left: number
}

// Sourced from https://github.com/ProfXwing/copytype
export function removeFancyTypography(textToClean: string) {
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

export function scrollToNextCaretPos(offset: number) {
    let container = document.querySelector('#typer-container') as HTMLElement
    let caret = document.getElementById('caret') as HTMLElement

    let containerR = container.getBoundingClientRect()
    let caretR = caret.getBoundingClientRect()
    // Calculate next 'top' position relative to viewport
    let caretTop = caretR.top + offset
    // Usually 'top' would be negative to account for current scroll
    let scrollY = caretTop - Math.max(containerR.top, 0)
    // Adjust for current scroll, needed since 'overflow: hidden' clips negative 'top' positions ()
    scrollY += container.scrollTop
    // Adjust center of caret to center of scroll
    scrollY += (caretR.height / 2)

    // Get viewport size
    // TODO: Why 'null' here?
    let max = window.visualViewport?.height || Infinity

    // Caret is inside upper 30% (of viewport)
    let scroll = (caretTop < max * 0.30)
        // Caret is inside lower 40% (of viewport)
        || (caretTop > max - max * 0.40);

    if (scroll) {
        // Scroll caret to roughly 32% (of viewport)
        container.scrollTo({
            top: scrollY - (max * 0.32),
            behavior: 'smooth'
        })
    }
}