<script setup lang="ts">
import Prompt, { openPrompt } from '@/components/Prompt.vue';
import { deleteDB } from '@/db';
import { useLocalStore, useTempStore } from '@/stores/library';

async function deleteProgramData() {
    let confirm = await openPrompt('Confirm Action', 'This will erase all program data!', true)
    
    if (confirm) {
        deleteDB()
        useLocalStore().$reset()
        useTempStore().$reset()
    }
}
</script>

<template>
    <h1>Settings</h1>

    <div class="important-button" @click="deleteProgramData">
        <font-awesome-icon :icon="['fas', 'triangle-exclamation']" fixed-width />
        <div style="display: inline; margin-left: 0.5rem">Delete all program data</div>
    </div>

    <Prompt></Prompt>
</template>

<style>
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
