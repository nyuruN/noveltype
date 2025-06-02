<script setup lang="ts">
import Prompt from '@/components/Prompt.vue';
import ButtonGroup from '@/components/ButtonGroup.vue';
import ToggleSwitch from '@/components/ToggleSwitch.vue';
import { deleteDB, isStoragePersistant, persist } from '@/lib/db';
import { useLibraryStore } from '@/stores/library';
import { usePromptStore } from '@/stores/prompt';
import { statsDisplayOptions, stopOnErrorOptions, useSettingsStore } from '@/stores/settings';
import { useStatsStore, useTypingStore } from '@/stores/typing';
import { storeToRefs } from 'pinia';
import { onMounted, ref } from 'vue';
import { useThemeStore } from '@/stores/theme';

let { typing } = storeToRefs(useSettingsStore())
let isPersistant = ref(false)

onMounted(async () => {
    isPersistant.value = await isStoragePersistant()
    console.log('Storage persistance status: ' + isPersistant.value)
})

async function deleteProgramData() {
    let confirm = await usePromptStore().openPrompt('Confirm Action', 'This will erase all site data!')

    if (confirm) {
        deleteDB()
        useLibraryStore().$reset()
        useSettingsStore().$reset()
        useTypingStore().$reset()
        useThemeStore().$reset()
        useStatsStore().$reset()
        usePromptStore().$reset()
    }
}
async function acceptPersistantToggle(persistant: boolean) {
    return persistant ? (await persist()) : false
}
</script>

<template>
    <h1>Settings</h1>

    <div class="settings-container flex-col" style="gap: 1rem;">
        <div class="option-container flex-col">
            <h2 style="margin: 0.5rem 0;">Typing</h2>
            <div class="option">
                <div class="option-texts">
                    <div>Freedom mode</div>
                    <span>Allows you to edit all previously typed words</span>
                </div>
                <ToggleSwitch v-model="typing.freedomMode"></ToggleSwitch>
            </div>
            <div class="option">
                <div class="option-texts">
                    <div>Stop on error</div>
                    <span>Prevents you from skipping incorrect elements</span>
                </div>
                <ButtonGroup v-model="typing.stopOnError" :options="stopOnErrorOptions" use-default="">
                </ButtonGroup>
            </div>
            <div class="option">
                <div class="option-texts">
                    <div>Paragraph statistic display</div>
                    <span>Displays a trailing statistic indicator at the end of a typed paragraph</span>
                </div>
                <ButtonGroup v-model="typing.statsDisplay" :options="statsDisplayOptions" use-default="">
                </ButtonGroup>
            </div>
        </div>

        <div class="option-container flex-col danger">
            <h2 style="margin: 0.5rem 0;">Important</h2>
            <div class="option">
                <div class="option-texts">
                    <div style="margin-left: -0.1rem;">
                        <font-awesome-icon :icon="['fas', 'triangle-exclamation']" fixed-width />
                        <span style="margin-left: 0.1rem;">Persistant storage</span>
                    </div>
                    <span>Makes data persistant under storage pressure (check browser implementation for details)</span>
                </div>
                <ToggleSwitch v-model="isPersistant" :accept="acceptPersistantToggle"></ToggleSwitch>
            </div>
            <div class="option">
                <div class="option-texts">
                    <div style="margin-left: -0.1rem;">
                        <font-awesome-icon :icon="['fas', 'triangle-exclamation']" fixed-width />
                        <span style="margin-left: 0.1rem;">Delete all site data</span>
                    </div>
                    <span>Deletes your stored books and settings</span>
                </div>
                <button class="delete-button" @click="deleteProgramData">
                    <font-awesome-icon :icon="['fas', 'trash']" fixed-width />
                </button>
            </div>
        </div>
    </div>

    <Prompt />
</template>

<style scoped>
.option-texts {
    flex-grow: 1;
    color: var(--text);
}

.option-texts>*:first-child {
    font-weight: bold;
    color: var(--text-dimmed);
}

.option {
    display: flex;
    align-items: center;
}

.option-container {
    border-radius: 12px;
    padding: 1rem;
    gap: 1.2rem;
    background-color: var(--ui-content-bg);
    border: 1px solid var(--ui-content-border)
}

.option-container.danger {
    border: 2px solid var(--ui-important);
}

.delete-button {
    user-select: none;
    padding: 0.6rem 0.7rem;
    border: none;
    border-radius: 8px;
    background-color: var(--ui-important);
    color: color-mix(in hsl, var(--ui-important), black 20%);
}

.delete-button:hover {
    cursor: pointer;
    background-color: color-mix(in hsl, var(--ui-important), white 15%);
}
</style>
