import { hsl, type Color } from "@/lib/color";
import { defineStore } from "pinia";
import { onMounted, ref, watch } from "vue";

const defaultImageUrl = 'https://images.unsplash.com/photo-1745669754254-c30c98e5f8b1?w=2070&auto=format&fit=crop' as const;

export const imageLayoutOptions = ['Cover', 'Contain', 'Auto'] as const;
export type imageLayoutType = typeof imageLayoutOptions[number];

export interface Theme {
    name: string,

    primaryColor: Color,
    accentColor: Color,
    textColor: Color,
    textDimmedColor: Color,
}

export const Themes: Theme[] = [
    {
        name: 'Default Dark',
        primaryColor: hsl(0, 0, 30),
        accentColor: hsl(80, 70, 55),
        textColor: hsl(0, 0, 97),
        textDimmedColor: hsl(0, 0, 72),
    },
    {
        name: 'The Infection',
        primaryColor: hsl(30, 15, 90),
        accentColor: hsl(20, 90, 60),
        textColor: hsl(0, 0, 10),
        textDimmedColor: hsl(0, 0, 40),
    },
    {
        name: 'Dory',
        primaryColor: hsl(240, 23, 30),
        accentColor: hsl(55, 100, 50),
        textColor: hsl(247, 100, 95),
        textDimmedColor: hsl(0, 0, 72),
    },
    {
        name: 'Spooky Horseman',
        primaryColor: hsl(0, 0, 15),
        accentColor: hsl(35, 100, 50),
        textColor: hsl(0, 0, 78),
        textDimmedColor: hsl(0, 0, 32),
    },
] as const;

/**
 * Has to be called at least once for initial theme to load
 */
export const useThemeStore = defineStore('theme', () => {
    let theme = ref(structuredClone(Themes[0]))
    let savedThemes = ref([] as Theme[])
    let opacity = ref(0.8)
    let blur = ref(16)
    let imageUrl = ref(undefined as string | undefined)
    let imageLayout = ref('Cover' as imageLayoutType)

    function $reset() {
        theme.value = structuredClone(Themes[0])
        savedThemes.value = [] as Theme[]
        opacity.value = 0.8
        blur.value = 16
        imageUrl.value = undefined
    }
    function applyColors(t: Theme) {
        let fmt = (col: Color) => {
            return `${col.h} ${col.s}% ${col.l}%`
        }

        let isDarkMode = t.primaryColor.l <= 50;
        document.documentElement.setAttribute('data-mode', isDarkMode ? 'dark' : 'light')
        document.documentElement.style.setProperty('--primary-hsl', fmt(t.primaryColor));
        document.documentElement.style.setProperty('--accent-hsl', fmt(t.accentColor));
        document.documentElement.style.setProperty('--text-hsl', fmt(t.textColor));
        document.documentElement.style.setProperty('--text-dimmed-hsl', fmt(t.textDimmedColor));
    }

    // Watchers
    watch(theme, (nt) => {
        applyColors(nt)
    })
    watch(opacity, (no) => {
        document.documentElement.style.setProperty('--opacity', no * 100 + '%');
    })
    watch(blur, (nb) => {
        document.documentElement.style.setProperty('--blur-amount', nb + 'px');
    })
    watch(imageUrl, (ni) => {
        if (ni)
            document.documentElement.style.setProperty('--image-url', `url(${ni})`);
        else
            document.documentElement.style.setProperty('--image-url', `url(${defaultImageUrl})`);
    })
    watch(imageLayout, (ni) => {
        if (ni === 'Cover')
            document.documentElement.style.setProperty('--image-layout', 'cover');
        else if (ni === 'Contain')
            document.documentElement.style.setProperty('--image-layout', 'contain');
        else if (ni === 'Auto')
            document.documentElement.style.setProperty('--image-layout', 'auto');
    })

    // It seems that theme is the only one that does not trigger a watcher on startup :(
    onMounted(() => {
        applyColors(theme.value)
    })

    return {
        // States
        theme,
        savedThemes,
        opacity,
        blur,
        imageUrl,
        imageLayout,
        // Functions
        $reset,
    }
}, {
    persist: true
})