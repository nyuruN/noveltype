import { hsl, type Color } from "@/lib/color";
import { defineStore } from "pinia";
import { onMounted, ref, watch } from "vue";

export interface Theme {
    name: string,

    primaryColor: Color,
    accentColor: Color,
    textColor: Color,
    textDimmedColor: Color,
}

export const Themes: Theme[] = [
    {
        name: 'Default',
        primaryColor: hsl(0, 0, 30),
        accentColor: hsl(80, 70, 55),
        textColor: hsl(0, 0, 97),
        textDimmedColor: hsl(0, 0, 72),
    }, {
        name: 'Light',
        primaryColor: hsl(30, 15, 90),
        accentColor: hsl(20, 90, 60),
        textColor: hsl(0, 0, 10),
        textDimmedColor: hsl(0, 0, 40),
    },
] as const;

/**
 * Has to be called at least once for initial theme to load
 */
export const useThemeStore = defineStore('theme', () => {
    let theme = ref(structuredClone(Themes[0]))
    let opacity = ref(0.8)
    let blur = ref(16)

    function $reset() {
        theme.value = structuredClone(Themes[0])
        opacity.value = 0.8
        blur.value = 16
    }
    function applyColors(t: Theme) {
        let fmt = (col: Color) => {
            return `${col.h} ${col.s}% ${col.l}%`
        }

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

    onMounted(() => {
        applyColors(theme.value)
    })

    return {
        // States
        theme,
        opacity,
        blur,
        // Functions
        $reset,
    }
}, {
    persist: true
})