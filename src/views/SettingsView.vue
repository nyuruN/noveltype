<script setup lang="ts">
import Prompt from '@/components/Prompt.vue';
import ToggleSwitch from '@/components/ToggleSwitch.vue';
import ButtonGroup from '@/components/ButtonGroup.vue';
import { deleteDB } from '@/lib/db';
import { useLibraryStore } from '@/stores/library';
import { usePromptStore } from '@/stores/prompt';
import { statDisplayOptions, useSettingsStore } from '@/stores/settings';
import { useTypingStore } from '@/stores/typing';
import { storeToRefs } from 'pinia';

let { typing } = storeToRefs(useSettingsStore())

async function deleteProgramData() {
    let confirm = await usePromptStore().openPrompt('Confirm Action', 'This will erase all program data!', true)

    if (confirm) {
        deleteDB()
        useLibraryStore().$reset()
        useTypingStore().$reset()
    }
}
</script>

<template>
    <h1>Settings</h1>

    <div class="settings-container">
        <div class="option-container" style="margin-bottom: 0.5rem;">
            <div class="option-text">
                <div style="margin-left: 0.5rem; font-weight: bold;">Stop on error</div>
                <div style="margin-left: 0.5rem">You cannot proceed util you have input the correct key</div>
            </div>
            <ToggleSwitch v-model="typing.stopOnError"></ToggleSwitch>
        </div>
        <div class="option-container" style="margin-bottom: 0.5rem;">
            <div class="option-text">
                <div style="margin-left: 0.5rem; font-weight: bold;">Allow word skipping</div>
                <div style="margin-left: 0.5rem">Words can be skipped by pressing space (incomplete words do not count
                    towards WPM)</div>
            </div>
            <ToggleSwitch v-model="typing.allowWordSkipping"></ToggleSwitch>
        </div>

        <div class="option-container" style="margin-bottom: 0.5rem;">
            <div class="option-text">
                <div style="margin-left: 0.5rem; font-weight: bold;">Do something</div>
                <div style="margin-left: 0.5rem">Fancy description ooouh~</div>
            </div>
            <ButtonGroup v-model="typing.statDisplay" :options="statDisplayOptions">
            </ButtonGroup>
        </div>

        <div class="danger-container">
            <div class="danger-button" @click="deleteProgramData">
                <font-awesome-icon :icon="['fas', 'triangle-exclamation']" fixed-width />
                <div style="display: inline; margin-left: 0.5rem">Delete all program data</div>
            </div>
        </div>
    </div>

    <Prompt />
</template>

<style scoped>
.option-text {
    flex-grow: 1;
}

.option-container {
    padding: 1rem;
    background-color: #474747;
    border-radius: 8px;
    display: flex;
    align-items: center;
}

.danger-button {
    user-select: none;
    padding: 1rem;
    background-color: #474747;
    border-radius: 8px;
    border-color: #ff6161;
    border-width: 2px;
    border-style: solid;
}

.danger-button:hover {
    background-color: #3b3b3b;
    cursor: pointer;
}
</style>
