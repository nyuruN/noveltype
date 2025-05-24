import { defineStore } from 'pinia'
import { ref, watch } from 'vue'

export const useSettingsStore = defineStore('settings', () => {
  let typing = ref({
    stopOnError: false,
    allowWordSkipping: true,
    typingFontScale: 1,
    typingLineScale: 1,
  })

  function $reset() {
    typing.value = {
      stopOnError: false,
      allowWordSkipping: true,
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