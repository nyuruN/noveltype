<script setup lang="ts">
import Prompt from '@/components/Prompt.vue';
import ToggleSwitch from '@/components/ToggleSwitch.vue';
import Dropdown from '@/components/Dropdown.vue';
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

    <div class="content-container flex-col" style="gap: 1rem">
        <h2 style="margin: 0.5rem 0;">Typing</h2>
        <div class="option">
            <div class="content-texts">
                <div>Freedom mode</div>
                <span>Allows you to edit all previously typed words</span>
            </div>
            <ToggleSwitch v-model="typing.freedomMode"></ToggleSwitch>
        </div>
        <div class="option">
            <div class="content-texts">
                <div>Stop on error</div>
                <span>Prevents you from skipping incorrect elements</span>
            </div>
            <Dropdown v-model="typing.stopOnError" :options="stopOnErrorOptions" default="None">
            </Dropdown>
        </div>
        <div class="option">
            <div class="content-texts">
                <div>Paragraph statistic display</div>
                <span>Displays a trailing statistic indicator at the end of a typed paragraph</span>
            </div>
            <Dropdown v-model="typing.statsDisplay" :options="statsDisplayOptions" default="Off">
            </Dropdown>
        </div>
    </div>

    <div class="content-container danger flex-col" style="gap: 1rem">
        <h2 style="margin: 0.5rem 0;">Important</h2>
        <div class="option">
            <div class="content-texts">
                <div style="margin-left: -0.1rem;">
                    <font-awesome-icon :icon="['fas', 'triangle-exclamation']" fixed-width />
                    <span style="margin-left: 0.1rem;">Persistant storage</span>
                </div>
                <span>Makes data persistant under storage pressure (check browser implementation for details)</span>
            </div>
            <ToggleSwitch v-model="isPersistant" :accept="acceptPersistantToggle"></ToggleSwitch>
        </div>
        <div class="option">
            <div class="content-texts">
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

    <Prompt />
</template>

<style scoped>
.option {
    display: flex;
    align-items: center;
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
