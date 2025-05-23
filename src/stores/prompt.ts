import { defineStore } from 'pinia'

interface PromptObj {
    resolveFn:  ((val: boolean) => void) | undefined,
    title: string,
    description: string,
    invert: boolean,
}

export const usePromptStore = defineStore('prompt', {
  state: (): PromptObj => ({
    resolveFn: undefined,
    title: 'Confirm Action',
    description: 'I\'m the description~!',
    invert: false,
  })
})