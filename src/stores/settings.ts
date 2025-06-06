import { defineStore } from 'pinia'
import { ref, watch } from 'vue'

export const statsDisplayOptions = ['RAW', 'WPM', 'ACC'] as const;
export type statsDisplayType = typeof statsDisplayOptions[number]; // 'RAW' | 'WPM' | 'ACC'

export const stopOnErrorOptions = ['Word', 'Letter'] as const;
export type stopOnErrorType = typeof stopOnErrorOptions[number];


export const useSettingsStore = defineStore('settings', () => {
  let typing = ref({
    freedomMode: false,
    stopOnError: undefined as (stopOnErrorType | undefined),
    statsDisplay: 'WPM' as (statsDisplayType | undefined),
    reducedScrolling: true,
    typingFontScale: 1,
    typingLineScale: 1,
  })

  function $reset() {
    typing.value = {
      freedomMode: false,
      stopOnError: undefined,
      statsDisplay: 'WPM',
      reducedScrolling: true,
      typingFontScale: 1,
      typingLineScale: 1,
    }
  }

  // Watchers
  watch(() => typing.value.typingFontScale, (scale) => {
    document.documentElement.style.setProperty('--typing-font-scale', String(scale));
  })
  watch(() => typing.value.typingLineScale, (scale) => {
    document.documentElement.style.setProperty('--typing-line-scale', String(scale));
  })

  return {
    // States
    typing,
    // Functions
    $reset,
  }
}, {
  persist: true
})