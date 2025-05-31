import { defineStore } from 'pinia'


export const usePromptStore = defineStore('prompt', {
  state: () => ({
    resolveFn: undefined as ((val: boolean) => void) | undefined,
    title: 'Confirm Action',
    description: 'I\'m the description~!',
  }),
  actions: {
    async openPrompt(_title: string, _description: string) {
      let { promise, resolve } = Promise.withResolvers<boolean>()

      this.resolveFn = resolve
      this.title = _title
      this.description = _description

      let confirm = await promise;

      // Reset when resolved
      this.resolveFn = undefined

      return confirm
    }
  }
})