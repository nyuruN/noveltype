<script setup lang="ts">
import { usePromptStore } from '@/stores/prompt'
import { storeToRefs } from 'pinia'

const {resolveFn, title, description, invert} = storeToRefs(usePromptStore())
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
    background-color: var(--yes);
}

.y:hover {
    background-color: var(--yes-light);
}

.n {
    background-color: var(--no);
}

.n:hover {
    background-color: var(--no-light);
}

.prompt-button {
    flex-grow: 1;
    padding: 0.3em 0;
    border-radius: 6px;
    cursor: pointer;
    text-align: center;
    color: var(--primary-darker)
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
    background-color: var(--primary-darker);
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