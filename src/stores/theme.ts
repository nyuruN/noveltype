import { hsl, hslString, type Color } from "@/lib/color";
import { defineStore } from "pinia";
import { ref, watch } from "vue";

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
        textColor: hsl(0, 0, 90),
        textDimmedColor: hsl(0, 0, 60),
    }, {
        name: 'Light',
        primaryColor: hsl(50, 10, 90),
        accentColor: hsl(20, 90, 60),
        textColor: hsl(0, 0, 20),
        textDimmedColor: hsl(0, 0, 45),
    },
] as const;

export const useThemeStore = defineStore('theme', () => {
    let theme = ref(structuredClone(Themes[0]))
    let opacity = ref(0.8)
    let blur = ref(16)

    function $reset() {
        theme.value = structuredClone(Themes[0])
        opacity.value = 0.8
        blur.value = 16
    }

    // Watchers
    watch(theme, (nt) => {
        document.documentElement.style.setProperty('--primary', hslString(nt.primaryColor));
        document.documentElement.style.setProperty('--accent', hslString(nt.accentColor));
        document.documentElement.style.setProperty('--text', hslString(nt.textColor));
        document.documentElement.style.setProperty('--text-dimmed', hslString(nt.textDimmedColor));
    })
    watch(opacity, (no) => {
        document.documentElement.style.setProperty('--opacity', no + '%');
    })
    watch(blur, (nb) => {
        document.documentElement.style.setProperty('--blur-amount', nb + 'px');
    })

    // onMounted(() => {
    //     document.documentElement.style.setProperty('--primary', hslString(theme.value.primaryColor));
    //     document.documentElement.style.setProperty('--accent', hslString(theme.value.accentColor));
    //     document.documentElement.style.setProperty('--text', hslString(theme.value.textColor));
    //     document.documentElement.style.setProperty('--text-dimmed', hslString(theme.value.textDimmedColor));
    // })

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