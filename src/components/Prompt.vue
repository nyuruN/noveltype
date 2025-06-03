<script setup lang="ts">
import { usePromptStore } from '@/stores/prompt'
import { storeToRefs } from 'pinia'

const { resolveFn, title, description, danger } = storeToRefs(usePromptStore())
</script>

<template>
    <div class="prompt-bg" v-if="resolveFn" @click="resolveFn(false)">
        <div class="content-container prompt flex-col" :class="{ danger: danger }" @click.stop>
            <div style="margin-bottom: 1rem; font-size: large;">
                <h2 style="margin: 0.5rem 0 1rem;">{{ title }}</h2>
                <span>{{ description }}</span>
            </div>
            <button class="button prompt-button" :class="{ danger: danger }" @click="resolveFn(true)">Confirm</button>
        </div>
    </div>
</template>

<style scoped>
.prompt-button {
    width: auto;
}

.prompt {
    min-height: 10%;
    width: 40%;
    background-color: var(--ui-prompt-bg);
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