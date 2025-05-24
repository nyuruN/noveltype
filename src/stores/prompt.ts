import { defineStore } from 'pinia'

interface PromptObj {
  resolveFn: ((val: boolean) => void) | undefined,
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
  }),
  actions: {
    async openPrompt(_title: string, _description: string, _invert?: boolean) {
      let { promise, resolve } = Promise.withResolvers<boolean>()

      this.resolveFn = resolve
      this.title = _title
      this.description = _description
      this.invert = (_invert) ? _invert : false

      let confirm = await promise;

      // Reset when resolved
      this.resolveFn = undefined

      return confirm
    }
  }
})