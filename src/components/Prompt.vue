<script setup lang="ts">
import { usePromptStore } from '@/stores/prompt'
import { storeToRefs } from 'pinia'

const {resolveFn, title, description, invert} = storeToRefs(usePromptStore())
</script>

<script lang="ts">
export async function openPrompt(_title: string, _description: string, _invert?: boolean) {
    const {resolveFn, title, description, invert} = storeToRefs(usePromptStore())

    let { promise, resolve } = Promise.withResolvers<boolean>()
    
    resolveFn.value = resolve
    title.value = _title
    description.value = _description
    invert.value = (_invert) ? _invert : false
    
    let confirm = await promise;

    // Reset when resolved
    resolveFn.value = undefined

    return confirm
}
</script>

<template>
    <div class="prompt-bg" v-if="resolveFn">
        <div class="prompt">
            <div style="padding: 0.3rem;">
                <div style="margin: 0; font-weight: bold; font-size: x-large;">{{ title }}</div>
                <div style="margin: 0.5rem 0 0.5rem 0.2rem;">{{ description }}</div>
            </div>
            <div class="prompt-buttons" v-if="invert">
                <div class="prompt-button n" @click="resolveFn(true)">Ok</div>
                <div class="prompt-button y" @click="resolveFn(false)">Cancel</div>
            </div>
            <div class="prompt-buttons" v-else>
                <div class="prompt-button y" @click="resolveFn(true)">Ok</div>
                <div class="prompt-button n" @click="resolveFn(false)">Cancel</div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.y {
    background-color: #62b85f;
}

.y:hover {
    background-color: #69c066;
}

.n {
    background-color: #b95e4d;
}

.n:hover {
    background-color: #d66c59;
}

.prompt-button {
    flex-grow: 1;
    padding: 0.3em 0;
    border-radius: 6px;
    cursor: pointer;
    text-align: center;
}

.prompt-buttons {
    display: flex;
    gap: 0.3rem;
}

.prompt {
    display: flex;
    flex-direction: column;
    padding: 0.3rem;
    min-height: 10%;
    min-width: 40%;
    background-color: #3b3b3b;
    border-radius: 8px;
}

.prompt-bg {
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    width: 100%;
    background-color: #3b3b3b6c;

    display: flex;
    align-items: center;
    justify-content: center;
}
</style>