import { useWindowStore } from "@/stores/window";

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
    let store = useWindowStore()

    let container = document.getElementById('typer-wrapper') as HTMLElement
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

    // Height of the app window
    let max = store.size.y

    /**
     * TODO: Let users tweak these values according to their typing preferences
    */

    // Convert from relative to viewport to relative to app window
    caretTop = caretTop - store.pos.y;
    // Caret is inside upper 30% (of app window)
    let scroll = (caretTop < max * 0.30)
        // Caret is inside lower 40% (of app window)
        || (caretTop > max - max * 0.40);

    if (scroll) {
        // Scroll caret to roughly 35% (of app window)
        container.scrollTo({
            top: scrollY - (max * 0.35),
            behavior: 'smooth'
        })
    }
}