import { defineStore } from "pinia";
import { ref, watch } from "vue";

export interface Theme {
    name: string,

    primaryColor: string,
    accentColor: string,
    textColor: string,
    textDimmedColor: string,
}

export const Themes: Theme[] = [
    {
        name: 'Default',
        primaryColor: 'hsl(0 0% 30% / var(--opacity))',
        accentColor: 'hsl(80 70% 55%)',
        textColor: 'hsl(0 0% 90%)',
        textDimmedColor: 'hsl(0 0% 60%)',
    }, {
        name: 'Red',
        primaryColor: 'hsl(50 10% 90% / var(--opacity))',
        accentColor: 'hsl(20 90% 60%)',
        textColor: 'hsl(0 0% 20%)',
        textDimmedColor: 'hsl(0 0% 45%)',
    },
] as const;

export const useThemeStore = defineStore('theme', () => {
    let theme = ref(structuredClone(Themes[0]))
    let opacity = ref('')
    let blur = ref('')

    function $reset() {
        theme.value = structuredClone(Themes[0])
        opacity.value = ''
        blur.value = ''
    }

    // Watchers
    watch(theme, (nt) => {
        document.documentElement.style.setProperty('--primary', String(nt.primaryColor));
        document.documentElement.style.setProperty('--accent', String(nt.accentColor));
        document.documentElement.style.setProperty('--text', String(nt.textColor));
        document.documentElement.style.setProperty('--text-dimmed', String(nt.textDimmedColor));
    })
    watch(opacity, (newOpacity) => {
        document.documentElement.style.setProperty('--opacity', String(newOpacity));
    })
    watch(blur, (blurAmount) => {
        document.documentElement.style.setProperty('--blur-amount', String(blurAmount));
    })

    // Functions
    function changeTheme(newTheme: Theme) {
        theme.value = newTheme
    }

    return {
        // States
        theme,
        opacity,
        blur,
        // Functions
        $reset,
        changeTheme,
    }
}, {
    persist: true
})