import { defineStore } from 'pinia'


export const usePromptStore = defineStore('prompt', {
    state: () => ({
        resolveFn: undefined as ((val: boolean) => void) | undefined,
        title: 'Confirm Action',
        description: 'I\'m the description~!',
        danger: false
    }),
    actions: {
        async openPrompt(title: string, description: string, danger?: boolean) {
            let { promise, resolve } = Promise.withResolvers<boolean>()

            this.resolveFn = resolve
            this.title = title
            this.description = description
            this.danger = danger || this.danger;

            let confirm = await promise;

            // Reset when resolved
            this.resolveFn = undefined

            return confirm
        }
    }
})