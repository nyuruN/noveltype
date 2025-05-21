import { defineStore } from 'pinia'

export interface TypingConfig {
    stopOnError: boolean
}

export interface Config {
    typing: TypingConfig,
}

export const useLibraryStore = defineStore('library', {
  state: (): Config => ({
    typing: {
        stopOnError: false,
    }
  }),
  persist: true,
})