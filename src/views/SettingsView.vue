<script setup lang="ts">
import Prompt, { openPrompt } from '@/components/Prompt.vue';
import { deleteDB } from '@/lib/db';
import { useLibraryStore } from '@/stores/library';
import { useTypingStore } from '@/stores/typing';

async function deleteProgramData() {
    let confirm = await openPrompt('Confirm Action', 'This will erase all program data!', true)

    if (confirm) {
        deleteDB()
        useLibraryStore().$reset()
        useTypingStore().$reset()
    }
}
</script>

<template>
    <h1>Settings</h1>

    <div class="container">

        <div class="important-button" @click="deleteProgramData">
            <font-awesome-icon :icon="['fas', 'triangle-exclamation']" fixed-width />
            <div style="display: inline; margin-left: 0.5rem">Delete all program data</div>
        </div>

    </div>

    <Prompt />
</template>

<style scoped>
.important-button {
    user-select: none;
    padding: 1rem;
    background-color: #474747;
    border-radius: 8px;
    border-color: #ff6161;
    border-width: 2px;
    border-style: solid;
}

.important-button:hover {
    background-color: #3b3b3b;
    cursor: pointer;
}
</style>
