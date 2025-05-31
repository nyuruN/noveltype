<script setup lang="ts">
import { usePromptStore } from '@/stores/prompt'
import { storeToRefs } from 'pinia'

const { resolveFn, title, description } = storeToRefs(usePromptStore())
</script>

<template>
    <div class="prompt-bg" v-if="resolveFn" @click="resolveFn(false)">
        <div class="prompt" @click.stop>
            <div style="margin-bottom: 1rem; font-size: large;">
                <h2 style="margin: 1rem 0;">{{ title }}</h2>
                <span>{{ description }}</span>
            </div>
            <button class="prompt-button" @click="resolveFn(true)">Confirm</button>
        </div>
    </div>
</template>

<style scoped>
.prompt-button {
    flex-grow: 1;
    padding: 0.5rem;
    border: none;
    border-radius: 6px;
    cursor: pointer;
    text-align: center;
    font-size: large;
    background-color: var(--ui-button-bg);
    color: var(--ui-button-text)
}
.prompt-button:hover {
    background-color: var(--ui-button-hover);
}

.prompt {
    display: flex;
    flex-direction: column;
    padding: 1rem;
    min-height: 10%;
    min-width: 40%;
    background-color: var(--ui-prompt-bg);
    border-radius: 8px;
}

.prompt-bg {
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    width: 100%;
    background-color: var(--ui-prompt-cover);

    display: flex;
    align-items: center;
    justify-content: center;
}
</style>