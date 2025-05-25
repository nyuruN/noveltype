<script setup lang="ts">
import Prompt from '@/components/Prompt.vue';
import ButtonGroup from '@/components/ButtonGroup.vue';
import { deleteDB } from '@/lib/db';
import { useLibraryStore } from '@/stores/library';
import { usePromptStore } from '@/stores/prompt';
import { statsDisplayOptions, stopOnErrorOptions, useSettingsStore } from '@/stores/settings';
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
                <div style="margin-left: 0.5rem" v-if="typing.stopOnError === 'Letter'">You cannot proceed util you have input the correct key</div>
                <div style="margin-left: 0.5rem" v-else-if="typing.stopOnError === 'Word'">You cannot proceed util the correct word is typed</div>
                <div style="margin-left: 0.5rem" v-else>Words can be skipped by pressing space</div>
            </div>
            <ButtonGroup v-model="typing.stopOnError" :options="stopOnErrorOptions">
            </ButtonGroup>
        </div>

        <div class="option-container" style="margin-bottom: 0.5rem;">
            <div class="option-text">
                <div style="margin-left: 0.5rem; font-weight: bold;">Paragraph statistic display</div>
                <div style="margin-left: 0.5rem" v-if="typing.statsDisplay === 'RAW'">Your raw WPM will be shown at the end of a typed paragraph</div>
                <div style="margin-left: 0.5rem" v-else-if="typing.statsDisplay === 'WPM'">Your net WPM will be shown at the end of a typed paragraph</div>
                <div style="margin-left: 0.5rem" v-else-if="typing.statsDisplay === 'ACC'">Your accuracy will be shown at the end of a typed paragraph</div>
                <div style="margin-left: 0.5rem" v-else>Statistic display will be hidden</div>
            </div>
            <ButtonGroup v-model="typing.statsDisplay" :options="statsDisplayOptions">
            </ButtonGroup>
        </div>

        <div class="danger-container">
            <div class="danger-button" @click="deleteProgramData">
                <font-awesome-icon :icon="['fas', 'triangle-exclamation']" fixed-width />
                <div style="display: inline; margin-left: 0.5rem">Delete all site data</div>
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
